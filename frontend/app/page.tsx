import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">Grades portal</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Grade Management System</h1>
          <p className="text-lg text-slate-600">
            Teachers capture marks subject-by-subject while students securely view their transcript with a single search.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Link
            href="/admin"
            className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Teachers</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Admin Console</h2>
            <p className="mt-3 text-sm text-slate-600">
              Add learners, upload subject marks, and monitor GPA performance in one place.
            </p>
            <p className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:gap-2">
              Go to dashboard →
            </p>
          </Link>
          <Link
            href="/student"
            className="group rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-wide text-slate-500">Students</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Lookup Transcript</h2>
            <p className="mt-3 text-sm text-slate-600">
              Type your registered name or email to instantly view GPA, letter grade, and per-subject scores.
            </p>
            <p className="mt-6 inline-flex items-center text-sm font-semibold text-indigo-600 group-hover:gap-2">
              View records →
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
