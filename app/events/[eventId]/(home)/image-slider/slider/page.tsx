"use client"

import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"

import { z } from "zod"
import { SliderSchema } from "@/validations/slider"
import AddSliderForm from "@/components/forms/AddSliderForm"

import { fetcher } from "@/lib/fetcher"
import EntitySkeleton from "@/components/EntitySkeleton"

// ---------------- TYPES ----------------
type Slider = z.infer<typeof SliderSchema> & {
  _id: string
}

// ---------------- PAGE ----------------
export default function SliderPage() {
  const { eventId } = useParams()

  if (!eventId || Array.isArray(eventId)) return null

  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingData, setEditingData] = useState<Slider | null>(null)

  // ---------------- FETCH ----------------
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}/sliders`,
    fetcher
  )

  const sliderList: Slider[] = useMemo(
    () => data?.data ?? [],
    [data]
  )

  // ---------------- HANDLERS ----------------
  const handleAdd = () => {
    setEditingData(null)
    setSheetOpen(true)
  }

  const handleEdit = (item: Slider) => {
    setEditingData(item)
    setSheetOpen(true)
  }

  const handleSaved = async () => {
    setSheetOpen(false)
    setEditingData(null)
    await mutate()
  }

  // ---------------- UI ----------------
  if (isLoading) return <EntitySkeleton title="Sliders" />

  return (
    <div className="p-6 bg-background text-foreground">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sliders</h1>

        <Button
          onClick={handleAdd}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          + Add Slide
        </Button>
      </div>

      {/* GRID (🔥 instead of table) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {sliderList.map((item) => {
          const isActive = item.status === "active"

          return (
            <div
              key={item._id}
              className="group rounded-xl overflow-hidden border bg-white shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => handleEdit(item)}
            >
              {/* Image */}
              <div className="relative h-40 w-full">
                <img
                  src={item.image}
                  alt="slider"
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              {/* Footer */}
              <div className="p-3 flex justify-between items-center">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {item.status}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(item)
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          )
        })}

      </div>

      {/* SHEET */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">

          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">
              {editingData ? "Edit Slide" : "Add Slide"}
            </h2>
          </div>

          <AddSliderForm
            defaultValues={editingData || undefined}
            onSave={handleSaved}
          />

        </SheetContent>
      </Sheet>
    </div>
  )
}