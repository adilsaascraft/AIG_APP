"use client"

import React, { useEffect, useState } from "react"
import {
  ExhibitorMemberSchema,
  ExhibitorMemberValues,
} from "@/validations/exhibitorMember"
import { FaUser, FaMapMarkerAlt, FaImage } from "react-icons/fa"
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
import { Textarea } from "@/components/ui/textarea"
import { getIndianFormattedDate } from "@/lib/formatIndianDate"

type Props = {
  defaultValues?: Partial<ExhibitorMemberValues & { _id?: string }>
  exhibitorTypeOptions: { _id: string; exhibitorType: string }[]
  onSave: (data: ExhibitorMemberValues & { _id: string }) => void
}

export default function AddExhibitorMemberForm({
  defaultValues,
  exhibitorTypeOptions,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<ExhibitorMemberValues>({
    resolver: zodResolver(ExhibitorMemberSchema),
    defaultValues: {
      name: "",
      stall: "",
      hall: "",
      exhibitorTypeId: "",
      image: "",
      description: "",
      status: "active",
      ...defaultValues,
    },
  })

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  // ---------------- SUBMIT ----------------
  async function onSubmit(data: ExhibitorMemberValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/exhibitors", {
        method: defaultValues?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      toast(
        defaultValues?._id
          ? "Exhibitor updated!"
          : "Exhibitor created!",
        { description: getIndianFormattedDate() }
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
          id="exhibitor-form"
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
                  <InputWithIcon {...field} placeholder="Exhibitor name" icon={<FaUser />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stall */}
          <FormField
            control={form.control}
            name="stall"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stall *</FormLabel>
                <FormControl>
                  <InputWithIcon {...field} placeholder="e.g. B12" icon={<FaMapMarkerAlt />} />
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
                  <InputWithIcon {...field} placeholder="e.g. Hall A" icon={<FaMapMarkerAlt />} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Exhibitor Type */}
          <FormField
            control={form.control}
            name="exhibitorTypeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exhibitor Type *</FormLabel>
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
                    {exhibitorTypeOptions.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.exhibitorType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <InputWithIcon {...field} placeholder="Paste image URL" icon={<FaImage />} />
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
                  <Textarea {...field} placeholder="Enter description" />
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
          <Button variant="outline">Close</Button>
        </SheetClose>

        <Button
          type="submit"
          form="exhibitor-form"
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