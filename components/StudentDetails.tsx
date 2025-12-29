"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Student {
  id: string
  name: string
  gpa: number
  grades: number[]
}

interface StudentDetailsProps {
  student: Student
  onAddGrade: (grade: number) => void
  onRemoveGrade: (index: number) => void
}

// Helper function to calculate letter grade and color
function getLetterGrade(gpa: number): { grade: string; color: string } {
  if (gpa >= 90) return { grade: "A", color: "text-green-600" }
  if (gpa >= 80) return { grade: "B", color: "text-lime-600" }
  if (gpa >= 70) return { grade: "C", color: "text-yellow-600" }
  if (gpa >= 60) return { grade: "D", color: "text-orange-600" }
  return { grade: "F", color: "text-red-600" }
}

export default function StudentDetails({ student, onAddGrade, onRemoveGrade }: StudentDetailsProps) {
  const [newGrade, setNewGrade] = useState("")

  // Call helper function to get letter grade & color
  const { grade, color } = getLetterGrade(student.gpa ?? 0)

  const handleAddGrade = () => {
    const gradeValue = Number.parseFloat(newGrade)
    if (!isNaN(gradeValue) && gradeValue >= 0 && gradeValue <= 100) {
      onAddGrade(gradeValue)
      setNewGrade("")
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      {/* Student Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">{student.name}</h2>
        <p className="text-gray-600 mb-2">ID: {student.id}</p>

        {/* GPA + Letter Grade */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Current GPA</p>
          <p className="text-4xl font-bold text-blue-600">
            {(student.gpa ?? 0).toFixed(2)}{" "}
            <span className={`text-2xl font-bold ${color}`}>({grade})</span>
          </p>
        </div>
      </div>

      {/* Add New Grade */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Grade</h3>
        <div className="flex gap-2">
          <Input
            type="number"
            min="0"
            max="100"
            placeholder="Enter grade (0-100)"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddGrade} className="bg-green-600 hover:bg-green-700 text-white">
            Add Grade
          </Button>
        </div>
      </div>

      {/* Grades List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Grades ({student.grades.length})</h3>
        {student.grades.length === 0 ? (
          <p className="text-gray-500">No grades yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {student.grades.map((g, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg flex items-center justify-between">
                <span className="font-semibold text-gray-900">{g.toFixed(1)}</span>
                <Button
                  onClick={() => onRemoveGrade(index)}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
