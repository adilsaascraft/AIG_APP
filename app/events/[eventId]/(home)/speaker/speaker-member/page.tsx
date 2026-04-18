"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { SpeakerSchema } from "@/validations/speakerMember"
import AddSpeakerForm from "@/components/forms/AddSpeakerMemberForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Speaker = z.infer<typeof SpeakerSchema> & {
  _id: string
  speakerType?: {
    _id: string
    speakerType: string
  }
}

// ---------------- PAGE ----------------
export default function SpeakerPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Speaker | null>(null)

  // ---------------- FETCH SPEAKERS ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/speakers`,
    fetcher
  )

  const speakerList: Speaker[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- FETCH SPEAKER TYPES ----------------
  const { data: typeData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/speaker-types`,
    fetcher
  )

  const speakerTypeOptions = useMemo(
    () => typeData?.data ?? [],
    [typeData]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Speaker) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Speaker>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) =>
        row.original.image ? (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200" />
        ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "designation",
      header: "Designation",
    },
    {
      header: "Speaker Type",
      cell: ({ row }) =>
        row.original.speakerType?.speakerType || "—",
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
  if (isLoading) return <EntitySkeleton title="Speakers" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Speakers</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Speaker
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={speakerList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Speaker" : "Add Speaker"}
            </h2>
          </div>

          <AddSpeakerForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
            speakerTypeOptions={speakerTypeOptions} // 🔥 important
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}