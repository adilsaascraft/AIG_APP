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
import { ExhibitorMemberSchema } from "@/validations/exhibitorMember"
import AddExhibitorMemberForm from "@/components/forms/AddExhibitorMemberForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Exhibitor = z.infer<typeof ExhibitorMemberSchema> & {
  _id: string
  exhibitorType?: {
    _id: string
    exhibitorType: string
  }
}

// ---------------- PAGE ----------------
export default function ExhibitorPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Exhibitor | null>(null)

  // ---------------- FETCH ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/exhibitors`,
    fetcher
  )

  const exhibitorList: Exhibitor[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // 🔥 fetch exhibitor types (for dropdown)
  const { data: typeData } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/exhibitor-types`,
    fetcher
  )

  const exhibitorTypeOptions = useMemo(
    () => typeData?.data ?? [],
    [typeData]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Exhibitor) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Exhibitor>[] = [
    {
      accessorKey: "image",
      header: "Logo",
      cell: ({ row }) =>
        row.original.image ? (
          <Image
            src={row.original.image}
            alt={row.original.name}
            width={40}
            height={40}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded" />
        ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      header: "Location",
      cell: ({ row }) => (
        <span>
          {row.original.hall} - {row.original.stall}
        </span>
      ),
    },
    {
      header: "Type",
      cell: ({ row }) =>
        row.original.exhibitorType?.exhibitorType || "—",
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
  if (isLoading) return <EntitySkeleton title="Exhibitors" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Exhibitors</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Exhibitor
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={exhibitorList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Exhibitor" : "Add Exhibitor"}
            </h2>
          </div>

          <AddExhibitorMemberForm
            defaultValues={editingData || undefined}
            exhibitorTypeOptions={exhibitorTypeOptions}
            onSave={handleSaved}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}