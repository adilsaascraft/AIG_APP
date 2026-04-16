"use client"

import { useState } from "react"
import EventCard from "@/components/EventCard"
import AddEventForm from "@/components/forms/AddEventForm"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { FaSearch } from "react-icons/fa"
import { Event } from "@/data/events"

const tabs: (Event["status"] | "All")[] = ["Running", "Live", "Past", "All"]

export default function EventsPageClient({
  initialEvents,
}: {
  initialEvents: Event[]
}) {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [open, setOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"Running" | "Live" | "Past" | "All">("All")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 6

  // ✅ FILTER BY STATUS
  const filteredByTab =
    activeTab === "All"
      ? events
      : events.filter((e) => e.status === activeTab)

  // ✅ SEARCH
  const filteredEvents = filteredByTab.filter((event) => {
    const q = search.toLowerCase()
    return (
      event.eventName.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q)
    )
  })

  // ✅ PAGINATION
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)

  // ✅ ADD / UPDATE
  function handleSave(event: Event) {
    if (eventToEdit) {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? event : e))
      )
    } else {
      setEvents((prev) => [
        ...prev,
        { ...event, id: Date.now().toString() },
      ])
    }

    setOpen(false)
    setEventToEdit(null)
  }

  // ✅ DELETE
  function handleDelete(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function handleEdit(event: Event) {
    setEventToEdit(event)
    setOpen(true)
  }

  return (
    <div className="p-4 bg-background text-foreground">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Events</h1>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="bg-sky-800 text-white">
              + Add Event
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[400px]">
            <AddEventForm
              onSuccess={handleSave}
              eventToEdit={eventToEdit}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* TABS */}
      <div className="flex gap-6 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any)
              setCurrentPage(1)
            }}
            className={`pb-2 border-b-2 ${
              tab === activeTab
                ? "border-sky-800 text-sky-800 font-semibold"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <div className="relative w-full max-w-[400px]">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* EVENTS GRID */}
      {filteredEvents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => handleEdit(event)}
              onDelete={() => handleDelete(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center py-10">
          No events found
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-sky-800 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}