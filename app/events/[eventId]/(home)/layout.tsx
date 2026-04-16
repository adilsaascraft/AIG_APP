"use client"

import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import MobileNavbar from "@/components/MobileNavbar"
import { useBreakpoint } from "@/hooks/useDevice"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breakpoint = useBreakpoint()

  const isDesktop =
    breakpoint === "xl" ||
    breakpoint === "xl2" ||
    breakpoint === "2xl"

  return (
    <>
      {/* Top Navbar */}
      <div className="w-full text-white bg-gradient-to-r from-[#0A0E80] via-[#0E3C96] to-[#75a8f2] shadow-md sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Mobile Navbar */}
      {!isDesktop && <MobileNavbar />}

      {/* Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar (Desktop only) */}
        {isDesktop && (
          <div className="w-auto">
            <Sidebar />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}