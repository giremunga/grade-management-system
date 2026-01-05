"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { scoreToLetter } from "@/lib/grades"
import { SUBJECTS } from "@/lib/subjects"
import { StudentRecord } from "@/types/student"

const LOCAL_FALLBACK_API = "http://localhost:8080/api"

export default function StudentPage() {
  const [apiBase, setApiBase] = useState(process.env.NEXT_PUBLIC_API_BASE ?? LOCAL_FALLBACK_API)
  const [records, setRecords] = useState<StudentRecord[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState("")

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_API_BASE && typeof window !== "undefined") {
      const { protocol, hostname } = window.location
      setApiBase(`${protocol}//${hostname}:8080/api`)
    }
  }, [])

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`${apiBase}/students`)
        if (!response.ok) {
          throw new Error("Unable to load records")
        }
        const data: StudentRecord[] = await response.json()
        setRecords(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unable to load records"
        setError(message)
        console.error("Load student records error", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRecords()
  }, [apiBase])

  const normalizedQuery = filter.trim().toLowerCase()
  const record = normalizedQuery
    ? records.find(
        (student) =>
          student.name.toLowerCase() === normalizedQuery || student.email?.toLowerCase() === normalizedQuery,
      )
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-white p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Student records</p>
            <h1 className="text-3xl font-bold text-slate-900">Track GPA and subject marks</h1>
            <p className="text-slate-600">
              Enter your registered name or email exactly as provided to the institution.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center text-sm font-semibold text-indigo-600">
            ← Back to portal
          </Link>
        </header>
        <div>
          <label htmlFor="Lookup" className="text-xs uppercase tracking-wide text-slate-500">
            Lookup name or email
          </label>
          <input
            id="Lookup"
            type="text"
            placeholder="Jane Doe / jane@email.com"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="mt-2 w-full rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        {loading && <p className="text-slate-500">Loading your transcript…</p>}
        {!loading && records.length === 0 && (
          <p className="text-slate-500">No student records yet. Ask an instructor to register you.</p>
        )}
        {!loading && records.length > 0 && !normalizedQuery && (
          <p className="text-slate-500">Type your full registered name or email above to view your grades.</p>
        )}
        {!loading && normalizedQuery && !record && (
          <p className="text-slate-500">
            Could not find a student named {filter || "that entry"}. Double-check spelling or confirm registration with a
            teacher.
          </p>
        )}
        {record && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Student</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{record.name}</h2>
                  <p className="text-sm text-slate-500">{record.email ?? "No email on file"}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Current GPA</p>
                  <p className="text-3xl font-bold text-indigo-600">{record.gpa.toFixed(2)}</p>
                  <p className="text-sm text-slate-500">{record.letterGrade}</p>
                </div>
              </div>
            </div>
            {SUBJECTS.map((subject) => {
              const mark = record.subjectMarks?.[subject] ?? 0
              const letter = scoreToLetter(mark)
              return (
                <div key={`${record.id}-${subject}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Subject</p>
                      <h3 className="text-2xl font-semibold text-slate-900">{subject}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Score</p>
                      <p className="text-3xl font-bold text-indigo-600">{Math.round(mark)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Letter grade</p>
                      <p className="text-lg font-semibold">{letter}</p>
                    </div>
                    <p className="text-xs text-slate-400">Updated when teachers upload scores</p>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </div>
    </div>
  )
}
