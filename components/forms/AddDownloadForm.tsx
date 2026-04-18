"use client"

import React, { useEffect, useState } from "react"
import { DownloadSchema, DownloadValues } from "@/validations/download"
import { FaFileAlt, FaUpload } from "react-icons/fa"
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
  defaultValues?: Partial<DownloadValues & { _id?: string }>
  onSave: (data: DownloadValues & { _id: string }) => void
}

export default function AddDownloadForm({
  defaultValues,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<DownloadValues>({
    resolver: zodResolver(DownloadSchema),
    defaultValues: {
      title: "",
      file: "",
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
  async function onSubmit(data: DownloadValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/downloads", {
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
          ? "File updated successfully!"
          : "File uploaded successfully!",
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
          id="download-form"
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
                    placeholder="Enter file title"
                    icon={<FaFileAlt />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File */}
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File URL *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Paste file URL"
                    icon={<FaUpload />}
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
          form="download-form"
          disabled={loading}
          className="bg-sky-800 hover:bg-sky-900 text-white"
        >
          {loading
            ? defaultValues?._id
              ? "Updating..."
              : "Uploading..."
            : defaultValues?._id
            ? "Update"
            : "Upload"}
        </Button>
      </div>
    </div>
  )
}