"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-100 p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="font-bold text-lg">Liquibase Generator</div>
        <div className="space-x-4">
          <Link
            href="/"
            className={`${pathname === "/" ? "text-blue-600 font-medium" : "text-gray-600"} hover:text-blue-800`}
          >
            Basic
          </Link>
          <Link
            href="/advanced"
            className={`${pathname === "/advanced" ? "text-blue-600 font-medium" : "text-gray-600"} hover:text-blue-800`}
          >
            Advanced
          </Link>
        </div>
      </div>
    </nav>
  )
}
