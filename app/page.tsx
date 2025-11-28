import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen w-full flex flex-col items-center justify-center pointer-events-auto">
      <h1 className="text-6xl font-bold text-white mb-8">Portfolio</h1>
      <div className="flex gap-4">
        <Link 
          href="/projects" 
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          Projects
        </Link>
        <Link 
          href="/about" 
          className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          About
        </Link>
      </div>
    </main>
  )
}
