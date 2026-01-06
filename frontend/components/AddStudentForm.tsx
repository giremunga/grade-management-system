"use client"

import { FormEvent, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SUBJECTS } from "@/lib/subjects"
import { StudentRecord } from "@/types/student"

interface AddStudentFormProps {
  apiBase: string
  onAdd: (student: StudentRecord) => void
}

const emptyMarks = () =>
  SUBJECTS.reduce<Record<string, string>>((acc, subject) => {
    acc[subject] = ""
    return acc
  }, {})

export default function AddStudentForm({ apiBase, onAdd }: AddStudentFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subjectMarks, setSubjectMarks] = useState<Record<string, string>>(emptyMarks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const subjectPairs = useMemo(() => {
    const pairs: Array<[string, string]> = []
    for (let i = 0; i < SUBJECTS.length; i += 2) {
      pairs.push([SUBJECTS[i], SUBJECTS[i + 1] ?? ""])
    }
    return pairs
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim()) {
      setError("Student name is required")
      return
    }

    setLoading(true)
    setError(null)

    const payloadMarks = Object.entries(subjectMarks).reduce<Record<string, number>>((acc, [subject, value]) => {
      if (value.trim() === "") return acc
      const score = Number(value)
      if (!Number.isNaN(score)) {
        acc[subject] = Math.min(100, Math.max(0, score))
      }
      return acc
    }, {})

    try {
      const response = await fetch(`${apiBase}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: email.trim() || null, subjectMarks: payloadMarks }),
      })

      if (!response.ok) {
        throw new Error("Failed to add student")
      }

      const student: StudentRecord = await response.json()
      onAdd(student)
      setName("")
      setEmail("")
      setSubjectMarks(emptyMarks())
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to add student"
      console.error("Add student error", err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkChange = (subject: string, value: string) => {
    setSubjectMarks((prev) => ({ ...prev, [subject]: value }))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="mb-4">
        <p className="text-sm text-slate-500">Teacher console</p>
        <h2 className="text-xl font-bold text-gray-900">Register or update a student</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Student name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={loading}
        />
        <Input
          type="email"
          placeholder="Student email (optional)"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={loading}
        />
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-600">Initial subject marks</p>
          {subjectPairs.map(([left, right]) => (
            <div key={left} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs text-slate-500 block mb-1">{left}</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Score"
                  value={subjectMarks[left]}
                  onChange={(event) => handleMarkChange(left, event.target.value)}
                  disabled={loading}
                />
              </div>
              {right && (
                <div>
                  <label className="text-xs text-slate-500 block mb-1">{right}</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Score"
                    value={subjectMarks[right]}
                    onChange={(event) => handleMarkChange(right, event.target.value)}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
          {loading ? "Saving student..." : "Save student"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
    </div>
  )
}
