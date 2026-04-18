"use client"

import React, { useEffect, useState } from "react"
import { SpeakerTypeSchema, SpeakerTypeValues } from "@/validations/speakerType"
import { FaUserTag } from "react-icons/fa"
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
  defaultValues?: Partial<SpeakerTypeValues & { _id?: string }>
  onSave: (data: SpeakerTypeValues & { _id: string }) => void
}

export default function AddSpeakerTypeForm({
  defaultValues,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SpeakerTypeValues>({
    resolver: zodResolver(SpeakerTypeSchema),
    defaultValues: {
      speakerType: "",
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
  async function onSubmit(data: SpeakerTypeValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/speaker-types", {
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
          ? "Speaker type updated!"
          : "Speaker type created!",
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
          id="speaker-type-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >

          {/* Speaker Type */}
          <FormField
            control={form.control}
            name="speakerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speaker Type *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter speaker type"
                    icon={<FaUserTag />}
                  />
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
          form="speaker-type-form"
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