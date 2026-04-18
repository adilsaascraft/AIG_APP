"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { QuickLinkSchema } from "@/validations/quicklink"
import AddQuickLinkForm from "@/components/forms/AddQuickLinkForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type QuickLink = z.infer<typeof QuickLinkSchema> & {
  _id: string
}

// ---------------- PAGE ----------------
export default function QuickLinkPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<QuickLink | null>(null)

  // ---------------- FETCH ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/quick-links`,
    fetcher
  )

  const quickLinkList: QuickLink[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: QuickLink) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<QuickLink>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "link",
      header: "Link",
      cell: ({ row }) => (
        <a
          href={row.original.link}
          target="_blank"
          className="text-blue-600 underline text-sm"
        >
          Open Link
        </a>
      ),
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
  if (isLoading) return <EntitySkeleton title="Quick Links" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quick Links</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Link
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={quickLinkList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Link" : "Add Link"}
            </h2>
          </div>

          <AddQuickLinkForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}