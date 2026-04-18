"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DataTable } from "@/components/DataTable"
import { ColumnDef } from "@tanstack/react-table"

import { z } from "zod"
import { QuizSchema } from "@/validations/quiz"
import AddQuizForm from "@/components/forms/AddQuizForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Quiz = z.infer<typeof QuizSchema> & {
  _id: string
}

// ---------------- PAGE ----------------
export default function QuizPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Quiz | null>(null)

  // ---------------- FETCH ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/quizzes`,
    fetcher
  )

  const quizList: Quiz[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Quiz) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- TABLE ----------------
  const columns: ColumnDef<Quiz>[] = [
    {
      accessorKey: "question",
      header: "Question",
    },
    {
      header: "Options",
      cell: ({ row }) => (
        <ul className="text-sm list-disc pl-4">
          {row.original.options.map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>
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
  if (isLoading) return <EntitySkeleton title="Quizzes" />

  return (
    <div className="p-4 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quizzes</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Quiz
        </Button>
      </div>

      {/* TABLE */}
      <DataTable data={quizList} columns={columns} />

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Quiz" : "Add Quiz"}
            </h2>
          </div>

          <AddQuizForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}