import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
}

export function RedButton({ children, onClick, type = "button", className, disabled }: RedButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors w-full",
        className,
      )}
    >
      {children}
    </Button>
  )
}
