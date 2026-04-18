"use client"

import React, { useEffect, useState } from "react"
import { TrackSchema, TrackValues } from "@/validations/track"
import { z } from "zod"
import { FaPalette, FaTag, FaLayerGroup } from "react-icons/fa"
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
  defaultValues?: Partial<TrackValues & { _id?: string }>
  onSave: (data: TrackValues & { _id: string }) => void
  sessionOptions: { _id: string; name: string }[] // 🔥 dropdown data
}

export default function AddTrackForm({
  defaultValues,
  onSave,
  sessionOptions,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<TrackValues>({
    resolver: zodResolver(TrackSchema),
    defaultValues: {
      name: "",
      color: "",
      status: "active",
      sessionDateId: "",
      ...defaultValues,
    },
  })

  // ✅ Edit mode
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  // ✅ Submit
  async function onSubmit(data: TrackValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/tracks", {
        method: defaultValues?._id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      toast(
        defaultValues?._id
          ? "Track updated successfully!"
          : "Track created successfully!",
        {
          description: getIndianFormattedDate(),
        }
      )

      onSave(result.data)
      form.reset()
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
          id="track-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >

          {/* Track Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track Name *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter track name"
                    icon={<FaTag />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Color */}
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track Color *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="e.g. #6366f1"
                    icon={<FaPalette />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Session Date Dropdown 🔥 */}
          <FormField
            control={form.control}
            name="sessionDateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Date *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sessionOptions.map((session) => (
                      <SelectItem key={session._id} value={session._id}>
                        {session.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
          form="track-form"
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