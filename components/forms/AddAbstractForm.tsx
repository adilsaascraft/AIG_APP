"use client"

import React, { useEffect, useState } from "react"
import {
  AbstractSchema,
  AbstractValues,
} from "@/validations/abstract"

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

import InputWithIcon from "@/components/InputWithIcon"
import { Textarea } from "@/components/ui/textarea"

import {
  FaUser,
  FaFileAlt,
  FaLayerGroup,
  FaHashtag,
} from "react-icons/fa"

import { getIndianFormattedDate } from "@/lib/formatIndianDate"

type Props = {
  defaultValues?: Partial<AbstractValues & { _id?: string }>
  onSave: (data: AbstractValues & { _id: string }) => void
}

export default function AddAbstractForm({
  defaultValues,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<AbstractValues>({
    resolver: zodResolver(AbstractSchema),
    defaultValues: {
      authorName: "",
      abstractTitle: "",
      track: "",
      abstractNumber: "",
      abstractDetails: "",
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
  async function onSubmit(data: AbstractValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/abstract", {
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
          ? "Abstract updated!"
          : "Abstract created!",
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
          id="abstract-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >
          {/* Author Name */}
          <FormField
            control={form.control}
            name="authorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter author name"
                    icon={<FaUser />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abstract Title */}
          <FormField
            control={form.control}
            name="abstractTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abstract Title *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter abstract title"
                    icon={<FaFileAlt />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Track */}
          <FormField
            control={form.control}
            name="track"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Track *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter track"
                    icon={<FaLayerGroup />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abstract Number */}
          <FormField
            control={form.control}
            name="abstractNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abstract Number *</FormLabel>
                <FormControl>
                  <InputWithIcon
                    {...field}
                    placeholder="Enter abstract number"
                    icon={<FaHashtag />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Abstract Details */}
          <FormField
            control={form.control}
            name="abstractDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Abstract Details *</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder="Enter abstract details..."
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
                  onValueChange={(val) =>
                    field.onChange(val.toLowerCase())
                  }
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
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
            Cancel
          </Button>
        </SheetClose>

        <Button
          type="submit"
          form="abstract-form"
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