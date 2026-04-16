"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Pencil, Trash2, ArrowRight } from "lucide-react"
import clsx from "clsx"
import { Event } from "@/data/events"

type Props = {
  event: Event
  onEdit: () => void
  onDelete: () => void
}

export default function EventCard({ event, onEdit, onDelete }: Props) {
  const router = useRouter()

  const statusStyles: Record<Event["status"], string> = {
    Live: "bg-green-100 text-green-700",
    Running: "bg-blue-100 text-blue-700",
    Past: "bg-gray-200 text-gray-700",
  }

  function handleNavigate() {
    router.push(`/events/${event.id}/dashboard`)
  }

  return (
    <Card className="p-0 overflow-hidden rounded-xl shadow-sm">
      <div className="relative w-full h-[200px]">
        <Image
          src={event.eventImage}
          alt={event.eventName}
          fill
          className="object-cover"
        />

        {/* STATUS BADGE */}
        <div className="absolute top-2 left-2">
          <span
            className={clsx(
              "text-xs px-2 py-1 rounded font-medium",
              statusStyles[event.status]
            )}
          >
            {event.status}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="bg-white text-black">
                Manage
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              {/* NEW ITEM */}
              <DropdownMenuItem onClick={handleNavigate}>
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to Event
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={onDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4 space-y-1">
        <h3 className="font-semibold text-sky-800 truncate">
          {event.eventName}
        </h3>

        <p className="text-sm text-gray-600">{event.venue}</p>

        <p className="text-sm text-gray-500">
          {event.startDate} → {event.endDate}
        </p>
      </CardContent>
    </Card>
  )
}