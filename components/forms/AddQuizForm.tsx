"use client"

import React, { useEffect, useState } from "react"
import { QuizSchema, QuizValues } from "@/validations/quiz"
import { FaQuestionCircle, FaPlus, FaTrash } from "react-icons/fa"

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
  Input,
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
  defaultValues?: Partial<QuizValues & { _id?: string }>
  onSave: (data: QuizValues & { _id: string }) => void
}

export default function AddQuizForm({
  defaultValues,
  onSave,
}: Props) {
  const [loading, setLoading] = useState(false)

  const form = useForm<QuizValues>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      question: "",
      options: ["", ""], // ✅ minimum 2 options
      status: "active",
      ...defaultValues,
    },
  })

  const options = form.watch("options")

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  // ---------------- SUBMIT ----------------
  async function onSubmit(data: QuizValues) {
    try {
      setLoading(true)

      const res = await fetch("/api/quizzes", {
        method: defaultValues?._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message)

      toast(
        defaultValues?._id
          ? "Quiz updated!"
          : "Quiz created!",
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

  // ---------------- OPTIONS HANDLERS ----------------
  const addOption = () => {
    if (options.length >= 6) return
    form.setValue("options", [...options, ""])
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) return
    form.setValue(
      "options",
      options.filter((_, i) => i !== index)
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <Form {...form}>
        <form
          id="quiz-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 p-4"
        >

          {/* Question */}
          <FormField
            control={form.control}
            name="question"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your question"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Options */}
          <div>
            <FormLabel>Options *</FormLabel>

            <div className="space-y-2 mt-2">
              {options.map((opt, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => {
                      const newOptions = [...options]
                      newOptions[index] = e.target.value
                      form.setValue("options", newOptions)
                    }}
                    placeholder={`Option ${index + 1}`}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                  >
                    <FaTrash />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add Option */}
            <Button
              type="button"
              variant="secondary"
              className="mt-2"
              onClick={addOption}
              disabled={options.length >= 6}
            >
              <FaPlus className="mr-2" /> Add Option
            </Button>

            <FormMessage>
              {form.formState.errors.options?.message}
            </FormMessage>
          </div>

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
          form="quiz-form"
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