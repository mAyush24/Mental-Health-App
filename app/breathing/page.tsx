"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Heart, Zap } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface BreathingTechnique {
  id: string
  name: string
  description: string
  icon: string
  color: string
  inhale: number
  hold: number
  exhale: number
  holdAfterExhale?: number
  cycles: number
  benefits: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

const breathingTechniques: BreathingTechnique[] = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Equal counts for inhale, hold, exhale, hold. Great for stress relief.",
    icon: "⬜",
    color: "from-blue-400 to-cyan-500",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfterExhale: 4,
    cycles: 8,
    benefits: ["Reduces stress", "Improves focus", "Calms nervous system"],
    difficulty: "Beginner",
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8. Perfect for relaxation.",
    icon: "😴",
    color: "from-purple-400 to-indigo-500",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 6,
    benefits: ["Promotes sleep", "Reduces anxiety", "Lowers heart rate"],
    difficulty: "Intermediate",
  },
  {
    id: "triangle",
    name: "Triangle Breathing",
    description: "Simple 3-count pattern. Ideal for beginners.",
    icon: "🔺",
    color: "from-green-400 to-emerald-500",
    inhale: 3,
    hold: 3,
    exhale: 3,
    cycles: 10,
    benefits: ["Easy to learn", "Quick stress relief", "Improves concentration"],
    difficulty: "Beginner",
  },
  {
    id: "coherent",
    name: "Coherent Breathing",
    description: "5-second inhale and exhale for heart rate variability.",
    icon: "💓",
    color: "from-pink-400 to-rose-500",
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 12,
    benefits: ["Heart rate balance", "Emotional regulation", "Stress resilience"],
    difficulty: "Beginner",
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Quick inhale, longer exhale to boost energy and alertness.",
    icon: "⚡",
    color: "from-yellow-400 to-orange-500",
    inhale: 2,
    hold: 1,
    exhale: 4,
    cycles: 15,
    benefits: ["Increases energy", "Improves alertness", "Boosts mood"],
    difficulty: "Intermediate",
  },
  {
    id: "extended",
    name: "Extended Exhale",
    description: "Longer exhale activates the parasympathetic nervous system.",
    icon: "🌊",
    color: "from-teal-400 to-blue-500",
    inhale: 4,
    hold: 2,
    exhale: 8,
    cycles: 8,
    benefits: ["Deep relaxation", "Activates rest mode", "Reduces tension"],
    difficulty: "Advanced",
  },
]

export default function BreathingExercises() {
  const { user, loading, getAuthHeaders } = useAuth()
  const router = useRouter()
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfterExhale">("inhale")
  const [currentCycle, setCurrentCycle] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            nextPhase()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, timeLeft])

  const nextPhase = () => {
    if (!selectedTechnique) return

    const phases: Array<keyof BreathingTechnique> = ["inhale", "hold", "exhale"]
    if (selectedTechnique.holdAfterExhale) {
      phases.push("holdAfterExhale")
    }

    const currentIndex = phases.indexOf(currentPhase as keyof BreathingTechnique)
    const nextIndex = (currentIndex + 1) % phases.length

    if (nextIndex === 0) {
      // Completed a full cycle
      if (currentCycle >= selectedTechnique.cycles - 1) {
        // Session complete
        completeSession()
        return
      } else {
        setCurrentCycle((prev) => prev + 1)
      }
    }

    const nextPhase = phases[nextIndex] as "inhale" | "hold" | "exhale" | "holdAfterExhale"
    setCurrentPhase(nextPhase)
    setTimeLeft(selectedTechnique[nextPhase] || 0)

    // Play sound cue
    playTone(nextPhase)
  }

  const playTone = (phase: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    // Different tones for different phases
    const frequencies = {
      inhale: 440, // A4
      hold: 523, // C5
      exhale: 349, // F4
      holdAfterExhale: 294, // D4
    }

    oscillator.frequency.setValueAtTime(frequencies[phase] || 440, ctx.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }

  const startSession = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique)
    setCurrentPhase("inhale")
    setCurrentCycle(0)
    setTimeLeft(technique.inhale)
    setTotalTime(0)
    setSessionComplete(false)
    setIsActive(true)
    playTone("inhale")
  }

  const pauseSession = () => {
    setIsActive(false)
  }

  const resumeSession = () => {
    setIsActive(true)
  }

  const resetSession = () => {
    setIsActive(false)
    setCurrentPhase("inhale")
    setCurrentCycle(0)
    setTimeLeft(selectedTechnique?.inhale || 0)
    setTotalTime(0)
    setSessionComplete(false)
  }

  const completeSession = async () => {
    setIsActive(false)
    setSessionComplete(true)

    // Save session to backend
    try {
      await fetch("/api/breathing/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          technique: selectedTechnique?.id,
          duration: totalTime,
          cycles: currentCycle + 1,
        }),
      })
    } catch (error) {
      console.error("Error saving breathing session:", error)
    }
  }

  const getPhaseInstruction = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In"
      case "hold":
        return "Hold"
      case "exhale":
        return "Breathe Out"
      case "holdAfterExhale":
        return "Hold"
      default:
        return "Breathe"
    }
  }

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "inhale":
        return "text-blue-600"
      case "hold":
        return "text-purple-600"
      case "exhale":
        return "text-green-600"
      case "holdAfterExhale":
        return "text-orange-600"
      default:
        return "text-slate-600"
    }
  }

  const getCircleScale = () => {
    if (!selectedTechnique) return 1

    const phaseTime = selectedTechnique[currentPhase] || 1
    const progress = 1 - timeLeft / phaseTime

    switch (currentPhase) {
      case "inhale":
        return 0.5 + progress * 0.5 // Scale from 0.5 to 1
      case "exhale":
        return 1 - progress * 0.5 // Scale from 1 to 0.5
      default:
        return 1 // Hold phases stay at full size
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (selectedTechnique && !sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedTechnique(null)}
              className="rounded-full hover:bg-white/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-slate-800">{selectedTechnique.name}</h1>
              <p className="text-sm text-slate-600">
                Cycle {currentCycle + 1} of {selectedTechnique.cycles}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-full hover:bg-white/50"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <Progress
                value={
                  ((currentCycle + (4 - ["inhale", "hold", "exhale", "holdAfterExhale"].indexOf(currentPhase)) / 4) /
                    selectedTechnique.cycles) *
                  100
                }
                className="h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Progress</span>
                <span>{Math.round(((currentCycle + 1) / selectedTechnique.cycles) * 100)}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Breathing Circle */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-8">
                {/* Visual Breathing Circle */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${selectedTechnique.color} opacity-20 transition-transform duration-1000 ease-in-out`}
                    style={{
                      transform: `scale(${getCircleScale()})`,
                    }}
                  />
                  <div
                    className={`absolute inset-4 rounded-full bg-gradient-to-br ${selectedTechnique.color} opacity-40 transition-transform duration-1000 ease-in-out`}
                    style={{
                      transform: `scale(${getCircleScale()})`,
                    }}
                  />
                  <div
                    className={`absolute inset-8 rounded-full bg-gradient-to-br ${selectedTechnique.color} opacity-60 transition-transform duration-1000 ease-in-out`}
                    style={{
                      transform: `scale(${getCircleScale()})`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-2">{selectedTechnique.icon}</div>
                      <div className={`text-2xl font-bold ${getPhaseColor()} mb-1`}>{getPhaseInstruction()}</div>
                      <div className="text-4xl font-mono font-bold text-slate-800">{timeLeft}</div>
                    </div>
                  </div>
                </div>

                {/* Phase Indicator */}
                <div className="flex items-center space-x-4">
                  {["inhale", "hold", "exhale", selectedTechnique.holdAfterExhale && "holdAfterExhale"]
                    .filter(Boolean)
                    .map((phase, index) => (
                      <div
                        key={phase}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentPhase === phase ? "bg-indigo-500 scale-125" : "bg-slate-300"
                        }`}
                      />
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetSession}
                    className="rounded-full bg-white/50 hover:bg-white/70"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={isActive ? pauseSession : resumeSession}
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-8"
                  >
                    {isActive ? <Pause className="w-6 h-6 mr-2" /> : <Play className="w-6 h-6 mr-2" />}
                    {isActive ? "Pause" : "Resume"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTechnique(null)}
                    className="rounded-full bg-white/50 hover:bg-white/70"
                  >
                    End Session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technique Info */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-slate-800 mb-2">Breathing Pattern</h3>
                <div className="flex justify-center items-center space-x-2 text-sm text-slate-600">
                  <span>Inhale: {selectedTechnique.inhale}s</span>
                  <span>•</span>
                  <span>Hold: {selectedTechnique.hold}s</span>
                  <span>•</span>
                  <span>Exhale: {selectedTechnique.exhale}s</span>
                  {selectedTechnique.holdAfterExhale && (
                    <>
                      <span>•</span>
                      <span>Hold: {selectedTechnique.holdAfterExhale}s</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Session Complete!</h2>
              <p className="text-slate-600 mb-6">
                Great job! You completed {currentCycle + 1} cycles of {selectedTechnique?.name}.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">{currentCycle + 1}</div>
                  <div className="text-sm text-slate-600">Cycles Completed</div>
                </div>
                <div className="bg-white/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">+10</div>
                  <div className="text-sm text-slate-600">Points Earned</div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => startSession(selectedTechnique!)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Practice Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedTechnique(null)}
                  className="w-full bg-white/50 hover:bg-white/70"
                >
                  Try Different Technique
                </Button>
                <Link href="/" className="block">
                  <Button variant="ghost" className="w-full">
                    Return to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">🫁 Breathing Exercises</h1>
            <p className="text-slate-600">Guided breathing techniques for relaxation and focus</p>
          </div>
        </div>

        {/* Benefits Overview */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-2">Why Practice Breathing Exercises?</h2>
              <p className="text-slate-600">
                Regular breathing practice can transform your mental and physical wellbeing
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Reduces Stress</h3>
                <p className="text-sm text-slate-600">Activates your body's relaxation response</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-semibold text-slate-800">Improves Focus</h3>
                <p className="text-sm text-slate-600">Enhances concentration and mental clarity</p>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg">
                <div className="text-2xl mb-2">😴</div>
                <h3 className="font-semibold text-slate-800">Better Sleep</h3>
                <p className="text-sm text-slate-600">Promotes relaxation and restful sleep</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breathing Techniques */}
        <div className="grid md:grid-cols-2 gap-6">
          {breathingTechniques.map((technique) => (
            <Card
              key={technique.id}
              className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => startSession(technique)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${technique.color} text-white shadow-lg`}
                    >
                      {technique.icon}
                    </div>
                    <div>
                      <CardTitle className="text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {technique.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={`text-xs mt-1 ${
                          technique.difficulty === "Beginner"
                            ? "bg-green-100 text-green-700"
                            : technique.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {technique.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Play className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">{technique.description}</p>

                {/* Breathing Pattern */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs font-medium text-slate-700 mb-2">Breathing Pattern</div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-center">
                      <div className="font-bold text-blue-600">{technique.inhale}s</div>
                      <div className="text-xs text-slate-500">Inhale</div>
                    </div>
                    <div className="text-slate-300">→</div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{technique.hold}s</div>
                      <div className="text-xs text-slate-500">Hold</div>
                    </div>
                    <div className="text-slate-300">→</div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">{technique.exhale}s</div>
                      <div className="text-xs text-slate-500">Exhale</div>
                    </div>
                    {technique.holdAfterExhale && (
                      <>
                        <div className="text-slate-300">→</div>
                        <div className="text-center">
                          <div className="font-bold text-orange-600">{technique.holdAfterExhale}s</div>
                          <div className="text-xs text-slate-500">Hold</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <div className="text-xs font-medium text-slate-700 mb-2">Benefits</div>
                  <div className="flex flex-wrap gap-1">
                    {technique.benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-transparent">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Session Info */}
                <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t">
                  <span>{technique.cycles} cycles</span>
                  <span>
                    ~
                    {Math.round(
                      ((technique.inhale + technique.hold + technique.exhale + (technique.holdAfterExhale || 0)) *
                        technique.cycles) /
                        60,
                    )}{" "}
                    min
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">💡 Breathing Tips</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Find a comfortable, quiet space where you won't be disturbed</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Sit or lie down in a relaxed position with your spine straight</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Breathe through your nose when possible for better air filtration</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Don't force your breathing - let it flow naturally within the rhythm</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>If you feel dizzy, return to normal breathing and try again later</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Practice regularly for best results - even 5 minutes daily helps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
