"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, Shield, Bell, Trash2, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ExportDataDialog } from "@/components/ExportDataDialog"

export default function SettingsPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

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

  const settingsCategories = [
    {
      title: "Account",
      icon: <User className="w-5 h-5" />,
      items: [
        {
          title: "Export Data",
          description: "Download your mood tracking data and progress",
          action: "Export",
          component: <ExportDataDialog />,
        },
      ],
    },
    {
      title: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          title: "Data Privacy",
          description: "Your data is stored securely and never shared with third parties",
          action: "Learn More",
          onClick: () => {
            alert("Your privacy is our priority. All data is encrypted and stored securely.")
          },
        },
        {
          title: "Account Security",
          description: "Manage your password and security settings",
          action: "Update Password",
          onClick: () => {
            alert("Password update feature coming soon!")
          },
        },
      ],
    },
    {
      title: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      items: [
        {
          title: "Mood Reminders",
          description: "Get gentle reminders to track your daily mood",
          action: "Configure",
          onClick: () => {
            alert("Notification settings coming soon!")
          },
        },
        {
          title: "Achievement Alerts",
          description: "Receive notifications when you unlock new achievements",
          action: "Manage",
          onClick: () => {
            alert("Achievement notifications coming soon!")
          },
        },
      ],
    },
    {
      title: "Danger Zone",
      icon: <Trash2 className="w-5 h-5" />,
      items: [
        {
          title: "Delete Account",
          description: "Permanently delete your account and all associated data",
          action: "Delete Account",
          dangerous: true,
          onClick: () => {
            if (
              confirm(
                "Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.",
              )
            ) {
              alert("Account deletion feature coming soon. Please contact support if you need immediate assistance.")
            }
          },
        },
      ],
    },
  ]

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
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-500" />
              Settings
            </h1>
            <p className="text-slate-600">Manage your account and preferences</p>
          </div>
        </div>

        {/* User Info Card */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-800">{user.name}</h2>
                <p className="text-slate-600">{user.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span>🏆 {user.totalPoints} points</span>
                  <span>🔥 {user.currentStreak} day streak</span>
                  <span>📅 Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Categories */}
        <div className="space-y-6">
          {settingsCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <div className="text-indigo-500">{category.icon}</div>
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                    </div>
                    <div className="ml-4">
                      {item.component ? (
                        item.component
                      ) : (
                        <Button
                          variant={item.dangerous ? "destructive" : "outline"}
                          size="sm"
                          onClick={item.onClick}
                          className={item.dangerous ? "bg-red-500 hover:bg-red-600" : ""}
                        >
                          {item.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* App Info */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-3">💜</div>
            <h3 className="font-semibold text-slate-800 mb-2">MindfulMe</h3>
            <p className="text-sm text-slate-600 mb-4">
              Your personal mental wellness companion for mood tracking, community support, and mindful living.
            </p>
            <div className="flex justify-center gap-4 text-xs text-slate-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span>Made with ❤️ for your wellbeing</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
