"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { SUBJECTS } from "@/lib/subjects"
import { scoreToLetter } from "@/lib/grades"

interface StudentRecord {
  id: string
  name: string
  email?: string | null
  gpa: number
  letterGrade: string
  subjectMarks: Record<string, number>
}

const LOCAL_FALLBACK_API = "http://localhost:8080/api"

function StudentDashboard() {
  const [apiBase, setApiBase] = useState(process.env.NEXT_PUBLIC_API_BASE ?? LOCAL_FALLBACK_API)
  const [records, setRecords] = useState<StudentRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filterName, setFilterName] = useState("")

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_BASE && typeof window !== "undefined") {
      const host = window.location.hostname
      const protocol = window.location.protocol
      setApiBase(`${protocol}//${host}:8080/api`)
    }
  }, [])

  useEffect(() => {
    const loadRecords = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${apiBase}/students`)
        if (!res.ok) {
          throw new Error("Unable to load records")
        }
        const data = await res.json()
        setRecords(data)
      } catch (err) {
        console.error("Error fetching students:", err)
        setError(err instanceof Error ? err.message : "Unable to load records")
      } finally {
        setLoading(false)
      }
    }

    loadRecords()
  }, [apiBase])

  const normalizedName = filterName.trim().toLowerCase()
  const record = normalizedName
    ? records.find((student) => student.name.toLowerCase() === normalizedName)
    : null

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-slate-500">Student records</p>
          <h1 className="text-3xl font-bold text-slate-900">Track GPA and per-subject marks</h1>
          <p className="text-slate-600 mt-1">Enter your registered name exactly as provided to the institution to reveal your transcript.</p>
        </div>
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex w-full flex-col gap-2">
            <label htmlFor="nameFilter" className="text-xs uppercase tracking-wide text-slate-500">
              Filter by registered name
            </label>
            <input
              id="nameFilter"
              type="text"
              placeholder="Jane Doe"
              value={filterName}
              onChange={(event) => setFilterName(event.target.value)}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
          >
            <span aria-hidden="true" className="mr-2">&#8592;</span>
            Back to main page
          </Link>
        </div>
      </header>

      {error && <p className="text-red-600">{error}</p>}
      {loading && <p className="text-slate-500">Loading your transcript...</p>}
      {!loading && records.length === 0 && (
        <p className="text-slate-500">No student records available yet. Ask an instructor to add you from the admin console.</p>
      )}
      {!loading && records.length > 0 && !normalizedName && (
        <p className="text-slate-500">Enter your full registered name above to view your grades.</p>
      )}
      {!loading && normalizedName && !record && (
        <p className="text-slate-500">We couldn&#39;t find a student named {filterName || "that name"}. Double-check the spelling or ask an instructor to confirm your registration.</p>
      )}

      {record && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Student</p>
                <h2 className="text-2xl font-semibold text-slate-900">{record.name}</h2>
                <p className="text-sm text-slate-500">{record.email ?? "No email on file"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Current GPA</p>
                <p className="text-3xl font-bold text-indigo-600">{record.gpa.toFixed(2)}</p>
                <p className="text-sm text-slate-500">{record.letterGrade}</p>
              </div>
            </div>
          </div>

          {SUBJECTS.map((subject) => {
            const mark = record.subjectMarks[subject] ?? 0
            const grade = scoreToLetter(mark)
            return (
              <div key={`${record.id}-${subject}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-slate-500">Subject</p>
                    <h3 className="text-2xl font-semibold text-slate-900">{subject}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">Score</p>
                    <p className="text-3xl font-bold text-indigo-600">{Math.round(mark)}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-sm text-slate-500">Letter grade</p>
                    <p className="text-lg">{grade}</p>
                  </div>
                  <p className="text-xs text-slate-400">Updated when teachers upload scores</p>
                </div>
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <StudentDashboard />
      </div>
    </div>
  )
}
