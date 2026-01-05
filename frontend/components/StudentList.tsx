"use client"

import { Button } from "@/components/ui/button"
import { StudentRecord } from "@/types/student"

interface StudentListProps {
  students: StudentRecord[]
  selectedId?: string
  onSelect: (student: StudentRecord) => void
  onRemove: (id: string) => void
  loading: boolean
}

export default function StudentList({ students, selectedId, onSelect, onRemove, loading }: StudentListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Roster</p>
          <h2 className="text-xl font-bold text-gray-900">Students ({students.length})</h2>
        </div>
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Loading students…</p>
        ) : students.length === 0 ? (
          <p className="text-gray-500">No students yet</p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors border ${
                selectedId === student.id
                  ? "bg-blue-50 border-blue-500"
                  : "bg-slate-50 border-transparent hover:border-slate-200"
              }`}
              onClick={() => onSelect(student)}
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="font-semibold text-gray-900">{student.name}</p>
                  {student.email && <p className="text-xs text-slate-500">{student.email}</p>}
                  <p className="text-xs text-slate-500">ID: {student.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">GPA {student.gpa.toFixed(2)}</p>
                  <p className="text-xs text-slate-500">{student.letterGrade}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Updated subjects: {Object.keys(student.subjectMarks ?? {}).length}
                </p>
                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    onRemove(student.id)
                  }}
                  variant="destructive"
                  className="text-xs px-3 py-1 h-auto"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
