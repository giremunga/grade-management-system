"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import StudentList from "@/components/StudentList"
import AddStudentForm from "@/components/AddStudentForm"
import StudentDetails from "@/components/StudentDetails"

interface Student {
  id: string
  name: string
  email?: string | null
  gpa: number
  letterGrade: string
  subjectMarks: Record<string, number>
}

const LOCAL_FALLBACK_API = "http://localhost:8080/api"
function AdminDashboard() {
  const [apiBase, setApiBase] = useState(process.env.NEXT_PUBLIC_API_BASE ?? LOCAL_FALLBACK_API)
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const selectedStudentRef = useRef<Student | null>(null)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_BASE && typeof window !== "undefined") {
      const host = window.location.hostname
      const protocol = window.location.protocol
      setApiBase(`${protocol}//${host}:8080/api`)
    }
  }, [])

  useEffect(() => {
    selectedStudentRef.current = selectedStudent
  }, [selectedStudent])

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/students`)
      if (!res.ok) {
        throw new Error("Failed to fetch students")
      }
      const data = await res.json()
      setStudents(data)
      if (selectedStudentRef.current) {
        const updated = data.find((s: Student) => s.id === selectedStudentRef.current?.id)
        setSelectedStudent(updated || null)
      }
    } catch (err) {
      console.error("Error fetching students:", err)
      setError(err instanceof Error ? err.message : "Unable to fetch students")
    } finally {
      setLoading(false)
    }
  }, [apiBase])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleAddStudent = async (name: string, email: string, marks: Record<string, number>) => {
    try {
      const res = await fetch(`${apiBase}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subjectMarks: marks }),
      })
      if (!res.ok) {
        throw new Error("Failed to add student")
      }
      const newStudent = await res.json()
      setStudents((prev) => [...prev, newStudent])
    } catch (err) {
      console.error("Error adding student:", err)
      throw err instanceof Error ? err : new Error("Error adding student")
    }
  }

  const handleRemoveStudent = async (id: string) => {
    try {
      const res = await fetch(`${apiBase}/students/${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Failed to remove student")
      }
      setStudents((prev) => prev.filter((s) => s.id !== id))
      if (selectedStudent?.id === id) setSelectedStudent(null)
    } catch (err) {
      console.error("Error removing student:", err)
      throw err instanceof Error ? err : new Error("Error removing student")
    }
  }

  const handleSubjectUpdate = async (subject: string, mark: number) => {
    if (!selectedStudent) return
    try {
      const res = await fetch(`${apiBase}/students/${selectedStudent.id}/subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectMarks: { [subject]: mark } }),
      })
      if (!res.ok) {
        throw new Error("Failed to update subject mark")
      }
      const updated = await res.json()
      setSelectedStudent(updated)
      setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
    } catch (err) {
      console.error("Error updating subject:", err)
      throw err instanceof Error ? err : new Error("Error updating subject")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-slate-600">Administrator tools</p>
          <p className="text-xs text-slate-500">Manage student roster and marks directly—no login required.</p>
        </div>
        <Link href="/" className="text-sm text-blue-600 underline">
          Back to portal
        </Link>
      </header>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Console</h1>
        <p className="text-gray-600 mb-8">Add students, update their marks, and manage academic records.</p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AddStudentForm onAdd={handleAddStudent} />
            <StudentList
              students={students}
              selectedId={selectedStudent?.id}
              onSelect={(student) => setSelectedStudent(student)}
              onRemove={handleRemoveStudent}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedStudent ? (
              <StudentDetails
                key={selectedStudent.id}
                student={selectedStudent}
                onUpdateSubject={handleSubjectUpdate}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-gray-500 text-lg">Select a student to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return <AdminDashboard />
}
