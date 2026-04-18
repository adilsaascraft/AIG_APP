"use client"

import React, { useEffect, useState } from "react"
import { ScheduleSchema, ScheduleValues } from "@/validations/sessionDetails"
import { z } from "zod"
import { FaTag, FaMapMarkerAlt, FaClock, FaLayerGroup } from "react-icons/fa"
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
  defaultValues?: Partial<ScheduleValues & { _id?: string }>
  onSave: (data: ScheduleValues & { _id: string }) => void
  sessionOptions: { _id: string; name: string }[]
  trackOptions: { _id: string; name: string }[]
}

export default function AddScheduleForm({
  defaultValues,
  onSave,
  sessionOptions,
  trackOptions,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ScheduleValues>({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      title: "",
      hall: "",
      date: "",
      startTime: "",
      endTime: "",
      description: "",
      sessionDateId: "",
      trackId: "",
      status: "active",
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
  async function onSubmit(data: ScheduleValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/schedules", {
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
          ? "Schedule updated!"
          : "Schedule created!",
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
          id="schedule-form"
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
                  <InputWithIcon {...field} placeholder="Enter title" icon={<FaTag />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hall */}
          <FormField
            control={form.control}
            name="hall"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hall *</FormLabel>
                <FormControl>
                  <InputWithIcon {...field} placeholder="Enter hall" icon={<FaMapMarkerAlt />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date *</FormLabel>
                <FormControl>
                  <input type="date" {...field} className="w-full border p-3 rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Time */}
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time *</FormLabel>
                <FormControl>
                  <input type="time" {...field} className="w-full border p-3 rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time */}
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time *</FormLabel>
                <FormControl>
                  <input type="time" {...field} className="w-full border p-3 rounded-md" />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea {...field} className="w-full border p-3 rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Session Date */}
          <FormField
            control={form.control}
            name="sessionDateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select session" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sessionOptions.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Track */}
          <FormField
            control={form.control}
            name="trackId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select track" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trackOptions.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.name}
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
                            onValueChange={(val) => field.onChange(val.toLowerCase())}
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
          form="schedule-form"
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