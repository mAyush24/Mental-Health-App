"use client"

import { useState, useEffect } from "react"

export function useTutorial(tutorialId: string) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasCompleted, setHasCompleted] = useState(false)

  useEffect(() => {
    const completedTutorials = JSON.parse(localStorage.getItem("completedTutorials") || "[]")
    setHasCompleted(completedTutorials.includes(tutorialId))
  }, [tutorialId])

  const startTutorial = () => {
    setIsOpen(true)
  }

  const closeTutorial = () => {
    setIsOpen(false)
  }

  const completeTutorial = () => {
    const completedTutorials = JSON.parse(localStorage.getItem("completedTutorials") || "[]")
    if (!completedTutorials.includes(tutorialId)) {
      completedTutorials.push(tutorialId)
      localStorage.setItem("completedTutorials", JSON.stringify(completedTutorials))
      setHasCompleted(true)
    }
  }

  return {
    isOpen,
    hasCompleted,
    startTutorial,
    closeTutorial,
    completeTutorial,
  }
}
