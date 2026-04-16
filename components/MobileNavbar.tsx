"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import sideTabs, { SideTab } from "@/components/SidebarSections"
import { ChevronDown, X } from "lucide-react"

export default function MobileNavbar() {
  const pathname = usePathname()
  const params = useParams<{ eventId: string }>()
  const eventId = params?.eventId || "" // ✅ prevent undefined

  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const navItems: SideTab[] = sideTabs

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleToggle(item: SideTab) {
    if (!item.subtabs?.length) return
    setOpenMenu((prev) => (prev === item.name ? null : item.name))
  }

  // ✅ cache active menu (avoid repeated find)
  const activeMenu = navItems.find((i) => i.name === openMenu)

  return (
    <>
      {/* TOP NAV */}
      <div
        ref={dropdownRef}
        className="top-[64px] bg-background border-t border-blue-900 z-[30]"
      >
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 px-4 py-3 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon
              const isOpen = openMenu === item.name

              const isActive = pathname?.includes(`/${item.baseUrl}`)
              const href = `/events/${eventId}/${item.baseUrl}`

              return (
                <div key={item.name} className="flex flex-col items-center">
                  <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggle(item)
                    }}
                  >
                    {/* ICON */}
                    {!item.subtabs?.length ? (
                      <Link href={href}>
                        <button
                          className={cn(
                            "flex items-center justify-center w-14 h-14 rounded-full border transition",
                            isActive
                              ? "bg-sky-800 text-white border-sky-800"
                              : "bg-sky-100 text-sky-800 border-sky-200"
                          )}
                        >
                          <Icon size={22} />
                        </button>
                      </Link>
                    ) : (
                      <button
                        className={cn(
                          "flex items-center justify-center w-14 h-14 rounded-full border transition",
                          isActive
                            ? "bg-sky-800 text-white border-sky-800"
                            : "bg-sky-100 text-sky-800 border-sky-200"
                        )}
                      >
                        <Icon size={22} />
                      </button>
                    )}

                    {/* LABEL */}
                    <div
                      className={cn(
                        "mt-1 flex items-center text-xs font-medium",
                        isActive ? "text-sky-800" : "text-gray-700"
                      )}
                    >
                      {item.name}
                      {!!item.subtabs?.length && (
                        <ChevronDown
                          size={12}
                          className={cn(
                            "ml-1 transition-transform",
                            isOpen && "rotate-180"
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM DRAWER */}
      <AnimatePresence>
        {openMenu && activeMenu?.subtabs?.length ? (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-2xl border-t z-[1000]"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 py-3 border-b">
              <span className="font-semibold text-gray-800">
                {activeMenu.name}
              </span>
              <button onClick={() => setOpenMenu(null)}>
                <X size={20} />
              </button>
            </div>

            {/* SUBTABS */}
            <ul className="divide-y">
              {activeMenu.subtabs.map((sub) => {
                const SubIcon = sub.icon

                const href = `/events/${eventId}/${activeMenu.baseUrl}/${sub.path || ""}`
                const isActive = pathname === href

                return (
                  <li key={sub.name}>
                    <Link
                      href={href}
                      onClick={() => setOpenMenu(null)}
                      className={cn(
                        "flex items-center gap-3 px-5 py-3 text-sm hover:bg-sky-50 transition",
                        isActive
                          ? "text-sky-800 font-medium"
                          : "text-gray-700"
                      )}
                    >
                      <SubIcon size={16} />
                      {sub.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}