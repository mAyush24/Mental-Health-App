"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Database, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export function ExportDataDialog() {
  const { getAuthHeaders } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [format, setFormat] = useState("json")
  const [dateRange, setDateRange] = useState("all")
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState<"idle" | "success" | "error">("idle")

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus("idle")

    try {
      const response = await fetch(`/api/user/export?format=${format}&range=${dateRange}`, {
        headers: getAuthHeaders(),
      })

      if (!response.ok) {
        throw new Error("Export failed")
      }

      // Get filename from response headers or create default
      const contentDisposition = response.headers.get("content-disposition")
      let filename = `mindfulme-data-${new Date().toISOString().split("T")[0]}.${format}`

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setExportStatus("success")
      setTimeout(() => {
        setIsOpen(false)
        setExportStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Export error:", error)
      setExportStatus("error")
    } finally {
      setIsExporting(false)
    }
  }

  const formatOptions = [
    {
      value: "json",
      label: "JSON",
      description: "Complete data with full structure",
      icon: <Database className="w-4 h-4" />,
      size: "~50-200KB",
    },
    {
      value: "csv",
      label: "CSV",
      description: "Spreadsheet-friendly format",
      icon: <FileText className="w-4 h-4" />,
      size: "~20-100KB",
    },
  ]

  const dateRangeOptions = [
    { value: "week", label: "Last 7 days", description: "Recent activity" },
    { value: "month", label: "Last 30 days", description: "Monthly summary" },
    { value: "year", label: "Last year", description: "Annual overview" },
    { value: "all", label: "All time", description: "Complete history" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-500" />
            Export Your Data
          </DialogTitle>
          <DialogDescription>
            Download your mood tracking data, progress, and achievements. Your privacy is important - this data stays
            with you.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Export Status */}
          {exportStatus === "success" && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">Export completed successfully!</span>
            </div>
          )}

          {exportStatus === "error" && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">Export failed. Please try again.</span>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Export Format</label>
            <div className="grid gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormat(option.value)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    format === option.value
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${format === option.value ? "text-indigo-500" : "text-slate-400"}`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{option.label}</span>
                        <Badge variant="secondary" className="text-xs">
                          {option.size}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">Date Range</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-slate-500">{option.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* What's Included */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">What's Included</label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Mood entries & journal
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Progress & streaks
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Community posts
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Achievements
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-blue-500 mt-0.5">🔒</div>
              <div className="text-sm text-blue-700">
                <strong>Privacy Protected:</strong> Your data is exported directly to your device. We don't store or
                share your personal information.
              </div>
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isExporting}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
