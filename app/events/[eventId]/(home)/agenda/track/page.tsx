"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { TrackSchema } from "@/validations/track"
import AddTrackForm from "@/components/forms/AddTrackForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Track = z.infer<typeof TrackSchema> & {
  _id: string
  sessionDate?: {
    _id: string
    name: string
  }
}

// ---------------- PAGE ----------------
export default function TrackPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Track | null>(null)

  // ---------------- FETCH TRACKS ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/tracks`,
    fetcher
  )

  const trackList: Track[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- FETCH SESSION DATES (for dropdown) ----------------
  const { data: sessionData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/session-dates`,
    fetcher
  )

  const sessionOptions = useMemo(
    () => sessionData?.data ?? [],
    [sessionData]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Track) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Track>[] = [
    {
      accessorKey: "name",
      header: "Track Name",
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: row.original.color }}
          />
          <span>{row.original.color}</span>
        </div>
      ),
    },
    {
      accessorKey: "sessionDate.name",
      header: "Session",
      cell: ({ row }) =>
        row.original.sessionDate?.name || "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.original.status === "active"
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {row.original.status}
          </span>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleEdit(row.original)}
        >
          Edit
        </Button>
      ),
    },
  ]

  // ---------------- UI ----------------
  if (isLoading) return <EntitySkeleton title="Tracks" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tracks</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Track
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={trackList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Track" : "Add Track"}
            </h2>
          </div>

          <AddTrackForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
            sessionOptions={sessionOptions} // 🔥 IMPORTANT
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}