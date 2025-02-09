import type React from "react"
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Command,
  CreditCard,
  File,
  FileText,
  HelpCircle,
  Image,
  Laptop,
  Loader2,
  Moon,
  MoreVertical,
  Pizza,
  Plus,
  Settings,
  SunMedium,
  Trash,
  Twitter,
  User,
  X,
  type LucideIcon,
} from "lucide-react"

export type Icon = LucideIcon

export const Icons = {
  logo: Command,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  gitHub: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6zm-31.1-4.5c-.7 3-2.4 5.6-5.6 5.6-3.3 0-5.6-2.3-5.6-5.6 0-3 2.3-5.6 5.6-5.6 3.2 0 4.9 2.6 5.6 5.6z"
      />
    </svg>
  ),
  twitter: Twitter,
  check: Check,
}

