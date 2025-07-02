"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"

interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  highlight?: boolean
  action?: string
}

interface TutorialOverlayProps {
  isOpen: boolean
  onClose: () => void
  steps: TutorialStep[]
  tutorialId: string
  onComplete: () => void
}

export function TutorialOverlay({ isOpen, onClose, steps, tutorialId, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  useEffect(() => {
    if (isOpen && steps[currentStep]?.target) {
      const element = document.querySelector(steps[currentStep].target!)
      setHighlightedElement(element)

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
        element.classList.add("tutorial-highlight")
      }
    }

    return () => {
      if (highlightedElement) {
        highlightedElement.classList.remove("tutorial-highlight")
      }
    }
  }, [currentStep, isOpen, steps])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete()
    onClose()
    setCurrentStep(0)
  }

  const handleSkip = () => {
    onClose()
    setCurrentStep(0)
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />

      {/* Tutorial Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-2xl border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  Step {currentStep + 1} of {steps.length}
                </Badge>
                {currentStep === steps.length - 1 && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardTitle className="text-xl text-slate-800">{currentStepData.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600 leading-relaxed">{currentStepData.description}</p>

            {currentStepData.action && (
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700 font-medium">💡 Try this:</p>
                <p className="text-sm text-indigo-600">{currentStepData.action}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep ? "bg-indigo-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 51;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);
          border-radius: 8px;
          animation: pulse-highlight 2s infinite;
        }
        
        @keyframes pulse-highlight {
          0%, 100% { box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.3), 0 0 30px rgba(99, 102, 241, 0.2); }
        }
      `}</style>
    </>
  )
}
