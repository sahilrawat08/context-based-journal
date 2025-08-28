import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const Analytics = ({ user }) => {
  const [entries, setEntries] = useState([])
  const [timeRange, setTimeRange] = useState("week")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load entries from localStorage for demo
    const loadEntries = () => {
      const savedEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
      setEntries(savedEntries)
      setLoading(false)
    }

    loadEntries()
  }, [])

  const getMoodEmoji = (mood) => {
    if (mood >= 8) return "😊"
    if (mood >= 6) return "🙂"
    if (mood >= 4) return "😐"
    if (mood >= 2) return "😔"
    return "😢"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getChartData = () => {
    if (timeRange === "week") {
      const last7Days = entries
        .filter(entry => {
          const entryDate = new Date(entry.date)
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          return entryDate >= weekAgo
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      return last7Days.map(entry => ({
        date: formatDate(entry.date),
        mood: entry.mood,
        productivity: entry.productivity
      }))
    } else {
      const last30Days = entries
        .filter(entry => {
          const entryDate = new Date(entry.date)
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          return entryDate >= monthAgo
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      return last30Days.map(entry => ({
        date: formatDate(entry.date),
        mood: entry.mood,
        productivity: entry.productivity
      }))
    }
  }

  const getStats = () => {
    if (entries.length === 0) return { avgMood: 0, avgProductivity: 0, totalEntries: 0 }

    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length
    const avgProductivity = entries.reduce((sum, entry) => sum + entry.productivity, 0) / entries.length

    return {
      avgMood: avgMood.toFixed(1),
      avgProductivity: avgProductivity.toFixed(1),
      totalEntries: entries.length
    }
  }

  const stats = getStats()
  const chartData = getChartData()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading analytics...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-foreground mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track your mood and productivity patterns over time</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            <Button
              variant={timeRange === "week" ? "default" : "outline"}
              onClick={() => setTimeRange("week")}
            >
              Last 7 Days
            </Button>
            <Button
              variant={timeRange === "month" ? "default" : "outline"}
              onClick={() => setTimeRange("month")}
            >
              Last 30 Days
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Entries</CardTitle>
              <CardDescription>Your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.totalEntries}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Mood</CardTitle>
              <CardDescription>Your overall mood score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.avgMood}/10</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Productivity</CardTitle>
              <CardDescription>Your overall productivity score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{stats.avgProductivity}/10</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Mood Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mood Trends</CardTitle>
              <CardDescription>How your mood has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected time range
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productivity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productivity Trends</CardTitle>
              <CardDescription>How your productivity has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip />
                    <Bar dataKey="productivity" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available for selected time range
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Entries</CardTitle>
            <CardDescription>Your latest journal entries with insights</CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length > 0 ? (
              <div className="space-y-4">
                {entries.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl">{getMoodEmoji(entry.mood)}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{formatDate(entry.date)}</span>
                        <span className="text-xs text-muted-foreground">
                          Mood: {entry.mood}/10 • Productivity: {entry.productivity}/10
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                      {entry.weather && (
                        <span className="inline-block mt-1 text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded">
                          {entry.weather}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No entries yet. Start your wellness journey!</p>
                <Link to="/journal">
                  <Button>Create First Entry</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link to="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Analytics
