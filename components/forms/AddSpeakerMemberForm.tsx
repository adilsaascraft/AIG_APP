"use client"

import React, { useEffect, useState } from "react"
import { SpeakerSchema, SpeakerValues } from "@/validations/speakerMember"
import {
  FaUser,
  FaBriefcase,
  FaImage,
  FaAlignLeft,
} from "react-icons/fa"
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
  defaultValues?: Partial<SpeakerValues & { _id?: string }>
  onSave: (data: SpeakerValues & { _id: string }) => void
  speakerTypeOptions: { _id: string; speakerType: string }[]
}

export default function AddSpeakerForm({
  defaultValues,
  onSave,
  speakerTypeOptions,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<SpeakerValues>({
    resolver: zodResolver(SpeakerSchema),
    defaultValues: {
      name: "",
      designation: "",
      description: "",
      image: "",
      speakerTypeId: "",
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
  async function onSubmit(data: SpeakerValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/speakers", {
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
          ? "Speaker updated!"
          : "Speaker created!",
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
          id="speaker-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <InputWithIcon {...field} placeholder="Enter name" icon={<FaUser />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Designation */}
          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation *</FormLabel>
                <FormControl>
                  <InputWithIcon {...field} placeholder="Enter designation" icon={<FaBriefcase />} />
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

          {/* Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL *</FormLabel>
                <FormControl>
                  <InputWithIcon {...field} placeholder="Enter image URL" icon={<FaImage />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Speaker Type */}
          <FormField
            control={form.control}
            name="speakerTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Speaker Type *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select speaker type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {speakerTypeOptions.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.speakerType}
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
          form="speaker-form"
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