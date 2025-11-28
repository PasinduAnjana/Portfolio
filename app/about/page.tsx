import Link from "next/link";

export default function About() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-start pt-20 pointer-events-none">
      <h1 className="text-4xl font-bold text-white mb-8 pointer-events-auto">About</h1>
      <Link 
        href="/" 
        className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors pointer-events-auto"
      >
        Back to Home
      </Link>
    </main>
  )
}
