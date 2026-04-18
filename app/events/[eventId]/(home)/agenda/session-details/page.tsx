"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { ScheduleSchema } from "@/validations/sessionDetails"
import AddScheduleForm from "@/components/forms/AddSessionDetailsForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Schedule = z.infer<typeof ScheduleSchema> & {
  _id: string
  sessionDate?: { _id: string; name: string }
  track?: { _id: string; name: string }
}

// ---------------- PAGE ----------------
export default function SchedulePage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Schedule | null>(null)

  // ---------------- FETCH SCHEDULES ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/schedules`,
    fetcher
  )

  const scheduleList: Schedule[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- FETCH SESSION + TRACK OPTIONS ----------------
  const { data: sessionData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/session-dates`,
    fetcher
  )

  const { data: trackData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/tracks`,
    fetcher
  )

  const sessionOptions = useMemo(
    () => sessionData?.data ?? [],
    [sessionData]
  )

  const trackOptions = useMemo(
    () => trackData?.data ?? [],
    [trackData]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Schedule) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Schedule>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "hall",
      header: "Hall",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      header: "Time",
      cell: ({ row }) => (
        <span>
          {row.original.startTime} - {row.original.endTime}
        </span>
      ),
    },
    {
      header: "Session",
      cell: ({ row }) =>
        row.original.sessionDate?.name || "—",
    },
    {
      header: "Track",
      cell: ({ row }) =>
        row.original.track?.name || "—",
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
  if (isLoading) return <EntitySkeleton title="Schedules" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Schedules</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Schedule
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={scheduleList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Schedule" : "Add Schedule"}
            </h2>
          </div>

          <AddScheduleForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
            sessionOptions={sessionOptions}
            trackOptions={trackOptions}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}