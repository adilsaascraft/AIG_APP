import { IconType } from "react-icons"
import {
  FaHome,
  FaUsers,
  FaPoll,
  FaComment,
  FaQuestionCircle,
} from "react-icons/fa"

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
    name: "Committee",
    icon: FaUsers,
    baseUrl: "committee",
    subtabs: [
      { name: "Committee Type", icon: FaUsers, path: "committee-type" },
      { name: "Committee Member", icon: FaUsers, path: "committee-member" },
    ],
  },
  {
    name: "Polls",
    icon: FaPoll,
    baseUrl: "polls",
  },
  {
    name: "Quiz",
    icon: FaQuestionCircle,
    baseUrl: "quiz",
    subtabs: [
      { name: "Detail", icon: FaQuestionCircle, path: "detail" },
    ],
  },
  {
    name: "Comments",
    icon: FaComment,
    baseUrl: "comment",
  },
  {
    name: "Users",
    icon: FaUsers,
    baseUrl: "user",
    subtabs: [
      { name: "Add User", icon: FaUsers, path: "add-user" },
      { name: "All Users", icon: FaUsers, path: "get-all" },
      { name: "Analysis", icon: FaUsers, path: "analysis" },
    ],
  },
]

export default sideTabs