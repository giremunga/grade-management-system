"use client"

import { Button } from "@/components/ui/button"
function getLetterGrade(gpa: number): { grade: string; color: string } {
  if (gpa >= 90) return { grade: "A", color: "text-green-600" }
  if (gpa >= 80) return { grade: "B", color: "text-lime-600" }
  if (gpa >= 70) return { grade: "C", color: "text-yellow-600" }
  if (gpa >= 60) return { grade: "D", color: "text-orange-600" }
  return { grade: "F", color: "text-red-600" }
}

interface Student {
  id: string
  name: string
  gpa: number
  grades: number[]
}

interface StudentListProps {
  students: Student[]
  selectedId?: string
  onSelect: (student: Student) => void
  onRemove: (id: string) => void
  loading: boolean
}

export default function StudentList({ students, selectedId, onSelect, onRemove, loading }: StudentListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Students ({students.length})</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">No students yet</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedId === student.id ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => onSelect(student)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.id}</p>
                  <p className="text-sm font-bold text-blue-600">GPA: {student.gpa.toFixed(2)}</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(student.id)
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
