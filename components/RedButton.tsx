"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: "button" | "submit"
  className?: string
  disabled?: boolean
  loading?: boolean
}

export function RedButton({
  children,
  onClick,
  type = "button",
  className,
  disabled = false,
  loading = false,
}: RedButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full flex items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed",
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 mr-2 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Carregando...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
