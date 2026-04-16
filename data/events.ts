export type Event = {
  id: string
  eventName: string
  venue: string
  eventImage: string
  startDate: string
  endDate: string
  status: "Live" | "Running" | "Past"
}

export const dummyEvents: Event[] = [
  {
    id: "1",
    eventName: "AIG Annual Conference",
    venue: "Delhi",
    eventImage: "https://images.unsplash.com/photo-1511578314322-379afb476865",
    startDate: "2026-05-01",
    endDate: "2026-05-03",
    status: "Live",
  },
  {
    id: "2",
    eventName: "Medical Summit 2026",
    venue: "Mumbai",
    eventImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    status: "Running",
  },
  {
    id: "3",
    eventName: "Tech Expo",
    venue: "Bangalore",
    eventImage: "https://images.unsplash.com/photo-1492724441997-5dc865305da7",
    startDate: "2025-12-01",
    endDate: "2025-12-02",
    status: "Past",
  },
  {
    id: "4",
    eventName: "Healthcare Workshop",
    venue: "Hyderabad",
    eventImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
    startDate: "2026-07-15",
    endDate: "2026-07-16",
    status: "Live",
  },
]