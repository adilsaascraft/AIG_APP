"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { AbstractSchema } from "@/validations/abstract"
import AddAbstractForm from "@/components/forms/AddAbstractForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Abstract = z.infer<typeof AbstractSchema> & {
  _id: string
}

// ---------------- PAGE ----------------
export default function AbstractPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Abstract | null>(null)

  // ---------------- FETCH ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/abstracts`,
    fetcher
  )

  const abstractList: Abstract[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Abstract) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Abstract>[] = [
    {
      accessorKey: "authorName",
      header: "Author",
    },
    {
      accessorKey: "abstractTitle",
      header: "Title",
    },
    {
      accessorKey: "track",
      header: "Track",
    },
    {
      accessorKey: "abstractNumber",
      header: "Abstract No.",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status

        const colorMap: Record<string, string> = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-gray-200 text-gray-700",
          approved: "bg-blue-100 text-blue-800",
          rejected: "bg-red-100 text-red-800",
        }

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              colorMap[status] || "bg-gray-100"
            }`}
          >
            {status}
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
  if (isLoading) return <EntitySkeleton title="Abstracts" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Abstracts</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Abstract
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={abstractList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Abstract" : "Add Abstract"}
            </h2>
          </div>

          <AddAbstractForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}