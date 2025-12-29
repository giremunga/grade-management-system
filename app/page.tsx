"use client"

import { useState, useEffect } from "react"
import StudentList from "@/components/StudentList"
import AddStudentForm from "@/components/AddStudentForm"
import StudentDetails from "@/components/StudentDetails"

interface Student {
  id: string
  name: string
  gpa: number
  grades: number[]
}

export default function Page() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  const API_BASE = "http://localhost:8080/api"

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/students`)
      const data = await res.json()
      setStudents(data)
      if (selectedStudent) {
        const updated = data.find((s: Student) => s.id === selectedStudent.id)
        setSelectedStudent(updated || null)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
    setLoading(false)
  }

  const handleAddStudent = async (name: string) => {
    try {
      const res = await fetch(`${API_BASE}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const newStudent = await res.json()
      setStudents([...students, newStudent])
    } catch (error) {
      console.error("Error adding student:", error)
    }
  }

  const handleRemoveStudent = async (id: string) => {
    try {
      await fetch(`${API_BASE}/students/${id}`, { method: "DELETE" })
      setStudents(students.filter((s) => s.id !== id))
      if (selectedStudent?.id === id) setSelectedStudent(null)
    } catch (error) {
      console.error("Error removing student:", error)
    }
  }

  const handleAddGrade = async (grade: number) => {
    if (!selectedStudent) return
    try {
      const res = await fetch(`${API_BASE}/students/${selectedStudent.id}/grades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade }),
      })
      const updated = await res.json()
      setSelectedStudent(updated)
      setStudents(students.map((s) => (s.id === updated.id ? updated : s)))
    } catch (error) {
      console.error("Error adding grade:", error)
    }
  }

  const handleRemoveGrade = async (index: number) => {
    if (!selectedStudent) return
    try {
      const res = await fetch(`${API_BASE}/students/${selectedStudent.id}/grades/${index}`, {
        method: "DELETE",
      })
      const updated = await res.json()
      setSelectedStudent(updated)
      setStudents(students.map((s) => (s.id === updated.id ? updated : s)))
    } catch (error) {
      console.error("Error removing grade:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Grade Management System</h1>
        <p className="text-gray-600 mb-8">Manage student records and track academic performance</p>

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
              <StudentDetails student={selectedStudent} onAddGrade={handleAddGrade} onRemoveGrade={handleRemoveGrade} />
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
