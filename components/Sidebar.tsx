"use client"

import { usePathname, useParams } from "next/navigation"
import Link from "next/link"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

import sideTabs from "@/components/SidebarSections"

export default function Sidebar() {
  const pathname = usePathname()
  const params = useParams<{ eventId: string }>()
  const eventId = params?.eventId

  const [isSubtabCollapsed, setIsSubtabCollapsed] = useState(false)

  // -----------------------------
  // Extract route
  // -----------------------------
  const pathParts = pathname.split("/")
  const routeSegment = pathParts[3] // dashboard / user / quiz
  const subRoute = pathParts[4] // add-user / detail

  // -----------------------------
  // Active tab
  // -----------------------------
  const activeTab = useMemo(() => {
    return sideTabs.find((tab) => tab.baseUrl === routeSegment)
  }, [routeSegment])

  return (
    <div className="flex min-h-full">
      {/* ================= MAIN TABS ================= */}
      <div className="w-[105px] bg-blue-100 border-r">
        <div className="flex flex-col items-center py-4 space-y-3">
          {sideTabs.map((tab) => {
            const firstSub = tab.subtabs?.[0]

            const href = firstSub
              ? `/events/${eventId}/${tab.baseUrl}/${firstSub.path || ""}`
              : `/events/${eventId}/${tab.baseUrl}`

            return (
              <Link
                key={tab.name}
                href={href}
                className={cn(
                  "w-full py-2 px-1 flex flex-col items-center text-xs hover:bg-gray-300 border-l-[3px]",
                  routeSegment === tab.baseUrl
                    ? "bg-white text-sky-800 font-semibold border-sky-800"
                    : "text-black border-transparent"
                )}
              >
                <tab.icon className="h-5 w-5 mb-1" />
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ================= SUBTABS ================= */}
      {activeTab?.subtabs && (
        <div
          className={cn(
            "relative transition-all duration-300 bg-blue-100",
            isSubtabCollapsed ? "w-[0px]" : "w-[220px] p-3"
          )}
        >
          {/* Collapse Button */}
          <button
            onClick={() => setIsSubtabCollapsed(!isSubtabCollapsed)}
            className="absolute -right-3 top-0 p-1 z-10 bg-blue-100 rounded-full"
          >
            {isSubtabCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>

          {!isSubtabCollapsed && (
            <>
              <h2 className="text-sm font-semibold text-sky-900 mb-2">
                {activeTab.name}
              </h2>

              <ul className="space-y-1">
                {activeTab.subtabs.map((sub) => {
                  const href = `/events/${eventId}/${activeTab.baseUrl}/${sub.path || ""}`

                  return (
                    <li key={sub.name}>
                      <Link
                        href={href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-gray-300 border-l-[3px]",
                          subRoute === sub.path
                            ? "bg-white text-blue-900 border-sky-800"
                            : "text-gray-800 border-transparent"
                        )}
                      >
                        <sub.icon className="h-4 w-4" />
                        {sub.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}