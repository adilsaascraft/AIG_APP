"use client"

import EventsPageClient from "@/components/clients/EventsPageClient"
import { dummyEvents } from "@/data/events"

export default function EventsPage() {
  return <EventsPageClient initialEvents={dummyEvents} />
}