"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Event } from "@/data/events"
import { status } from "@/lib/constant"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"

type Props = {
  onSuccess: (event: Event) => void
  eventToEdit?: Event | null
}

export default function AddEventForm({ onSuccess, eventToEdit }: Props) {
  const form = useForm<Event>({
    defaultValues: {
      id: "",
      eventName: "",
      venue: "",
      eventImage: "",
      startDate: "",
      endDate: "",
      status: "Live",
    },
  })

  // ✅ Prefill in edit mode
  useEffect(() => {
    if (eventToEdit) {
      form.reset(eventToEdit)
    }
  }, [eventToEdit, form])

  function onSubmit(values: Event) {
    if (
      !values.eventName ||
      !values.venue ||
      !values.eventImage ||
      !values.startDate ||
      !values.endDate
    ) {
      return alert("Please fill all fields")
    }

    onSuccess(values)
  }

  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">
          {eventToEdit ? "Edit Event" : "Add Event"}
        </h2>
      </div>

      {/* FORM */}
      <div className="flex-1 overflow-y-auto p-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Event Name */}
            <FormField
              control={form.control}
              name="eventName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Venue */}
            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter venue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="eventImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Paste image URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* End Date */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full p-3">
                        <SelectValue placeholder="Select status type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {status.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      {/* FOOTER */}
      <div className="border-t p-4 flex justify-between">
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>

        <Button
          onClick={form.handleSubmit(onSubmit)}
          className="bg-sky-800 text-white"
        >
          {eventToEdit ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  )
}