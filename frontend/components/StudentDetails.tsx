"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { scoreToLetter } from "@/lib/grades"
import { SUBJECTS } from "@/lib/subjects"
import { StudentRecord } from "@/types/student"

interface StudentDetailsProps {
  student: StudentRecord
  onUpdateSubject: (subject: string, mark: number) => Promise<void> | void
}

export default function StudentDetails({ student, onUpdateSubject }: StudentDetailsProps) {
  const [subjectInputs, setSubjectInputs] = useState<Record<string, string>>(() => mapMarks(student.subjectMarks))
  const [pendingSubject, setPendingSubject] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSubjectInputs(mapMarks(student.subjectMarks))
    setPendingSubject(null)
    setError(null)
  }, [student])

  const handleSubjectChange = (subject: string, value: string) => {
    setSubjectInputs((prev) => ({ ...prev, [subject]: value }))
  }

  const handleSubjectSave = async (subject: string) => {
    const value = subjectInputs[subject]?.trim()
    if (!value) {
      setError("Enter a score before saving")
      return
    }

    const numericScore = Number(value)
    if (Number.isNaN(numericScore)) {
      setError("Marks must be numeric")
      return
    }

    setPendingSubject(subject)
    setError(null)
    try {
      await onUpdateSubject(subject, Math.min(100, Math.max(0, numericScore)))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to update mark"
      setError(message)
    } finally {
      setPendingSubject(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Selected student</p>
          <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
          {student.email && <p className="text-sm text-slate-500">{student.email}</p>}
          <p className="text-xs text-slate-500">ID: {student.id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Current GPA</p>
          <p className="text-4xl font-bold text-blue-600">{student.gpa.toFixed(2)}</p>
          <p className="text-sm font-semibold text-slate-700">{student.letterGrade}</p>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-500 mb-2">Per subject marks</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map((subject) => {
            const mark = student.subjectMarks?.[subject] ?? null
            const letter = mark == null ? "-" : scoreToLetter(mark)
            return (
              <div key={`${student.id}-${subject}`} className="rounded-lg border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">{subject}</p>
                    <p className="text-2xl font-semibold text-slate-900">{mark == null ? "—" : Math.round(mark)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Letter</p>
                    <p className="text-lg font-semibold">{letter}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={subjectInputs[subject] ?? ""}
                    onChange={(event) => handleSubjectChange(subject, event.target.value)}
                  />
                  <Button
                    onClick={() => handleSubjectSave(subject)}
                    disabled={pendingSubject === subject}
                    className="whitespace-nowrap"
                  >
                    {pendingSubject === subject ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      </div>
    </div>
  )
}

function mapMarks(marks: Record<string, number> | undefined) {
  return SUBJECTS.reduce<Record<string, string>>((acc, subject) => {
    const value = marks?.[subject]
    acc[subject] = value != null ? String(value) : ""
    return acc
  }, {})
}
