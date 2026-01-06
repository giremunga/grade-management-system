export interface StudentRecord {
  id: string
  name: string
  email?: string | null
  gpa: number
  letterGrade: string
  subjectMarks: Record<string, number>
}
