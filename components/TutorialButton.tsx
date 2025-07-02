"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, CheckCircle } from "lucide-react"

interface TutorialButtonProps {
  onStart: () => void
  hasCompleted: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function TutorialButton({ onStart, hasCompleted, size = "default", variant = "outline" }: TutorialButtonProps) {
  return (
    <div className="relative">
      <Button onClick={onStart} size={size} variant={variant} className="flex items-center gap-2">
        <BookOpen className="w-4 h-4" />
        {hasCompleted ? "Replay Tutorial" : "Start Tutorial"}
      </Button>
      {hasCompleted && (
        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white p-1 min-w-0 h-5 w-5 flex items-center justify-center">
          <CheckCircle className="w-3 h-3" />
        </Badge>
      )}
      {!hasCompleted && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
    </div>
  )
}
