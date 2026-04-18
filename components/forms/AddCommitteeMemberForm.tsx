"use client"

import React, { useEffect, useState } from "react"
import {
  CommitteeMemberSchema,
  CommitteeMemberValues,
} from "@/validations/committeeMember"
import { z } from "zod"
import { FaUser, FaBriefcase } from "react-icons/fa"
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
  defaultValues?: Partial<CommitteeMemberValues>
  onSave: (data: CommitteeMemberValues & { _id: string }) => void
}

export default function AddCommitteeMemberForm({
  defaultValues,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const form = useForm<CommitteeMemberValues>({
    resolver: zodResolver(CommitteeMemberSchema),
    defaultValues: {
      name: "",
      designation: "",
      type: "",
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
  async function onSubmit(data: z.infer<typeof CommitteeMemberSchema>) {
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("designation", data.designation)
      formData.append("type", data.type)
      formData.append("status", data.status)

      if (imageFile) {
        formData.append("image", imageFile)
      } else if (!defaultValues?._id) {
        throw new Error("Image is required")
      }

      const res = await fetch("/api/committee-members", {
        method: defaultValues?._id ? "PUT" : "POST",
        body: formData,
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      toast(
        defaultValues?._id
          ? "Updated successfully!"
          : "Created successfully!",
        {
          description: getIndianFormattedDate(),
        }
      )

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
          id="committee-member-form"
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
                  <InputWithIcon
                    {...field}
                    placeholder="Enter name"
                    icon={<FaUser />}
                  />
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
                  <InputWithIcon
                    {...field}
                    placeholder="Enter designation"
                    icon={<FaBriefcase />}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Committee Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Committee Type *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full p-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {/* 🔥 Replace with API later */}
                    <SelectItem value="Organizing">Organizing</SelectItem>
                    <SelectItem value="Scientific">Scientific</SelectItem>
                  </SelectContent>
                </Select>
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
          form="committee-member-form"
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