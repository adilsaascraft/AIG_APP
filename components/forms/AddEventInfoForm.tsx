"use client"

import React, { useEffect, useState } from "react"
import { EventInfoSchema, EventInfoValues } from "@/validations/eventInfo"
import { z } from "zod"
import { FaHeading,} from "react-icons/fa"
import InputWithIcon from "@/components/InputWithIcon"
import {
  zodResolver,
  useForm,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetClose,
  toast,
} from "@/lib/imports"
import { getIndianFormattedDate } from "@/lib/formatIndianDate"

type Props = {
  defaultValues?: Partial<EventInfoValues>
  onSave: (data: EventInfoValues & { _id: string }) => void
}

export default function AddEventInfoForm({ defaultValues, onSave }: Props) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<EventInfoValues>({
    resolver: zodResolver(EventInfoSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      status: "Active",
      ...defaultValues,
    },
  })

  // ✅ Edit mode
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
      if (defaultValues.image) setImagePreview(defaultValues.image)
    }
  }, [defaultValues, form])

  // ✅ Image Upload
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
      form.setValue("image", url)
    }
  }

  // ✅ Submit
  async function onSubmit(data: z.infer<typeof EventInfoSchema>) {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("description", data.description)
      formData.append("status", data.status)

      if (imageFile) {
        formData.append("image", imageFile)
      } else if (!defaultValues?._id) {
        throw new Error("Image is required")
      }

      // 🔥 Replace API later if needed
      const res = await fetch("/api/event-info", {
        method: defaultValues?._id ? "PUT" : "POST",
        body: formData,
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      toast(defaultValues?._id ? "Updated successfully!" : "Created successfully!", {
        description: getIndianFormattedDate(),
      })

      onSave(result.data)
      form.reset()
      setImagePreview(null)
      setImageFile(null)
    } catch (err: any) {
      toast.error(err.message || "Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <Form {...form}>
        <form
          id="event-info-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter title"
                    icon={<FaHeading />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Enter description"
                    className="w-full border rounded-md p-3 min-h-[100px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image */}
          <div>
            <FormLabel>Image *</FormLabel>
            <div
              className="mt-2 flex h-28 w-48 cursor-pointer items-center justify-center rounded-md border border-dashed"
              onClick={() => document.getElementById("image")?.click()}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  className="h-full w-full object-cover rounded-md"
                />
              ) : (
                <span className="text-sm text-muted-foreground">
                  Choose Image
                </span>
              )}
            </div>

            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            <p className="text-xs mt-1 text-muted-foreground">
              JPG, PNG, WEBP • Max 5MB
            </p>
          </div>

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* Footer */}
      <div className="sticky bottom-0 border-t px-6 py-4 flex justify-between bg-white">
        <SheetClose asChild>
          <Button variant="outline" disabled={loading}>
            Close
          </Button>
        </SheetClose>

        <Button
          type="submit"
          form="event-info-form"
          disabled={loading}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          {loading
            ? defaultValues?._id
              ? "Updating..."
              : "Creating..."
            : defaultValues?._id
            ? "Update"
            : "Create"}
        </Button>
      </div>
    </div>
  )
}