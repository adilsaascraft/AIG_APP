import { IconType } from "react-icons"
import {
  FaHome,
  FaUsers,
  FaPoll,
  FaComment,
  FaQuestionCircle,
  FaUser,
  FaDownload,
  FaClock,
  FaCalendar,
  FaCalculator,
  FaMicroblog,
  FaMagic,
  FaLink,
  FaFileContract,
  FaPhone,
} from "react-icons/fa"
import { Fa5 } from "react-icons/fa6"

export interface SubTab {
  name: string
  icon: IconType
  path?: string
}

export interface SideTab {
  name: string
  icon: IconType
  baseUrl: string
  subtabs?: SubTab[] // ✅ still optional
}

const sideTabs: SideTab[] = [
  {
    name: "Dashboard",
    icon: FaHome,
    baseUrl: "dashboard",
  },
    {
    name: "Event Info",
    icon: FaClock,
    baseUrl: "event-info",
  },
  {
    name: "Committee",
    icon: FaUsers,
    baseUrl: "committee",
    subtabs: [
      { name: "Committee Type", icon: FaUsers, path: "committee-type" },
      { name: "Committee Member", icon: FaUsers, path: "committee-member" },
    ],
  },
    {
    name: "Agenda",
    icon: FaCalendar,
    baseUrl: "agenda",
    subtabs: [
      { name: "Session Date", icon: FaUsers, path: "session-date" },
      { name: "Track", icon: FaUsers, path: "track" },
      { name: "Session Details", icon: FaUsers, path: "session-details" },
    ],
  },
      {
    name: "Speaker",
    icon: FaMagic,
    baseUrl: "speaker",
    subtabs: [
      { name: "Speaker Type", icon: FaUsers, path: "speaker-type" },
      { name: "Speaker Members", icon: FaUsers, path: "speaker-member" },
    ],
  },
    {
    name: "Delegate",
    icon: FaUsers,
    baseUrl: "delegate",
  },
      {
    name: "Download",
    icon: FaDownload,
    baseUrl: "download",
  },

  {
    name: "Quicklinks",
    icon: FaLink,
    baseUrl: "quicklink",
  },
    {
    name: "Quiz",
    icon: FaQuestionCircle,
    baseUrl: "quiz",
  },
  {
    name: "Polls",
    icon: FaPoll,
    baseUrl: "polls",
  },
    {
    name: "Exhibitor",
    icon: FaUsers,
    baseUrl: "exhibitor",
    subtabs: [
      { name: "Exhibitor Type", icon: FaUsers, path: "exhibitor-type" },
      { name: "Exhibitor Members", icon: FaUsers, path: "exhibitor-members" },
    ],
  },

  {
    name: "Push Message",
    icon: FaComment,
    baseUrl: "push-message",
  },
    {
    name: "Contact",
    icon: FaPhone,
    baseUrl: "contact",
  },
]

export default sideTabs