"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import AddStudentForm from "@/components/AddStudentForm"
import StudentDetails from "@/components/StudentDetails"
import StudentList from "@/components/StudentList"
import { StudentRecord } from "@/types/student"

const LOCAL_FALLBACK_API = "http://localhost:8080/api"

export default function AdminPage() {
  const [apiBase, setApiBase] = useState(process.env.NEXT_PUBLIC_API_BASE ?? LOCAL_FALLBACK_API)
  const [students, setStudents] = useState<StudentRecord[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedStudentRef = useRef<StudentRecord | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_BASE && typeof window !== "undefined") {
      const { protocol, hostname } = window.location
      setApiBase(`${protocol}//${hostname}:8080/api`)
    }
  }, [])

  useEffect(() => {
    selectedStudentRef.current = selectedStudent
  }, [selectedStudent])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${apiBase}/students`)
      if (!response.ok) {
        throw new Error("Failed to load students")
      }
      const data: StudentRecord[] = await response.json()
      setStudents(data)
      if (selectedStudentRef.current) {
        const updated = data.find((student) => student.id === selectedStudentRef.current?.id)
        setSelectedStudent(updated ?? null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to fetch students"
      setError(message)
      console.error("Fetch students error", err)
    } finally {
      setLoading(false)
    }
  }, [apiBase])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleStudentCreated = (student: StudentRecord) => {
    setStudents((prev) => [...prev, student])
  }

  const handleRemoveStudent = async (id: string) => {
    try {
      const response = await fetch(`${apiBase}/students/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to remove student")
      }
      setStudents((prev) => prev.filter((student) => student.id !== id))
      if (selectedStudentRef.current?.id === id) {
        setSelectedStudent(null)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to delete student"
      setError(message)
      console.error("Remove student error", err)
    }
  }

  const handleSubjectUpdate = async (subject: string, mark: number) => {
    if (!selectedStudentRef.current) return
    const studentId = selectedStudentRef.current.id
    const response = await fetch(`${apiBase}/students/${studentId}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subjectMarks: { [subject]: mark } }),
    })
    if (!response.ok) {
      throw new Error("Failed to update subject mark")
    }
    const updated: StudentRecord = await response.json()
    setSelectedStudent(updated)
    setStudents((prev) => prev.map((student) => (student.id === updated.id ? updated : student)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Administrator tools</p>
          <h1 className="text-3xl font-bold text-slate-900">Admin Console</h1>
          <p className="text-sm text-slate-600">Enroll students, upload marks, and keep transcripts updated.</p>
        </div>
        <Link href="/" className="text-sm font-semibold text-indigo-600">
          ← Back to portal
        </Link>
      </header>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      <div className="max-w-6xl mx-auto grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <AddStudentForm apiBase={apiBase} onAdd={handleStudentCreated} />
          <StudentList
            students={students}
            selectedId={selectedStudent?.id}
            onSelect={setSelectedStudent}
            onRemove={handleRemoveStudent}
            loading={loading}
          />
        </div>
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <StudentDetails student={selectedStudent} onUpdateSubject={handleSubjectUpdate} />
          ) : (
            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow">
              Select a learner to edit their per-subject marks.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
