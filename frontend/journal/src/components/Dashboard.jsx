import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const Dashboard = ({ user }) => {
  const [todaysMood, setTodaysMood] = useState(null)
  const [recentEntries, setRecentEntries] = useState([])
  const [weeklyAverage, setWeeklyAverage] = useState({ mood: 0, productivity: 0 })

  useEffect(() => {
    // Load mock data
    const mockEntries = [
      {
        id: 1,
        date: new Date().toISOString().split("T")[0],
        mood: 7,
        productivity: 6,
        content: "Had a great day today!",
        weather: "Sunny",
      },
      {
        id: 2,
        date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
        mood: 5,
        productivity: 7,
        content: "Feeling okay, productive day at work.",
        weather: "Cloudy",
      },
      {
        id: 3,
        date: new Date(Date.now() - 172800000).toISOString().split("T")[0],
        mood: 8,
        productivity: 8,
        content: "Amazing day with friends!",
        weather: "Sunny",
      },
    ]

    setRecentEntries(mockEntries)
    setTodaysMood(mockEntries[0])

    // Calculate weekly averages
    const avgMood = mockEntries.reduce((sum, entry) => sum + entry.mood, 0) / mockEntries.length
    const avgProductivity = mockEntries.reduce((sum, entry) => sum + entry.productivity, 0) / mockEntries.length
    setWeeklyAverage({ mood: avgMood, productivity: avgProductivity })
  }, [])

  const getMoodEmoji = (mood) => {
    if (mood >= 8) return "😊"
    if (mood >= 6) return "🙂"
    if (mood >= 4) return "😐"
    if (mood >= 2) return "😔"
    return "😢"
  }

  const getMoodLabel = (mood) => {
    if (mood >= 8) return "Great"
    if (mood >= 6) return "Good"
    if (mood >= 4) return "Okay"
    if (mood >= 2) return "Low"
    return "Very Low"
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-foreground mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">How are you feeling today?</p>
        </div>

        {/* Main Action Button */}
        <div className="mb-8 text-center">
          <Link to="/journal">
            <Button size="lg" className="text-lg px-8 py-4 h-auto">
              ✍️ New Journal Entry
            </Button>
          </Link>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Mood */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Mood</CardTitle>
              <CardDescription>How you're feeling right now</CardDescription>
            </CardHeader>
            <CardContent>
              {todaysMood ? (
                <div className="text-center">
                  <div className="text-4xl mb-2">{getMoodEmoji(todaysMood.mood)}</div>
                  <div className="text-2xl font-serif font-black text-primary mb-1">
                    {getMoodLabel(todaysMood.mood)}
                  </div>
                  <div className="text-sm text-muted-foreground">Mood: {todaysMood.mood}/10</div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">❓</div>
                  <div>No entry today</div>
                  <Link to="/journal">
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Add Entry
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Productivity Snapshot */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Productivity</CardTitle>
              <CardDescription>Your recent productivity levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-serif font-black text-secondary mb-2">
                  {todaysMood ? `${todaysMood.productivity}/10` : "—"}
                </div>
                <div className="text-sm text-muted-foreground mb-3">Today's Score</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${todaysMood ? (todaysMood.productivity / 10) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Average</CardTitle>
              <CardDescription>Your past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Mood</span>
                  <span className="font-medium">{weeklyAverage.mood.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(weeklyAverage.mood / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Productivity</span>
                  <span className="font-medium">{weeklyAverage.productivity.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-secondary h-2 rounded-full"
                    style={{ width: `${(weeklyAverage.productivity / 10) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Entries</CardTitle>
            <CardDescription>Your latest journal entries</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntries.length > 0 ? (
              <div className="space-y-4">
                {recentEntries.slice(0, 3).map((entry) => (
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
                <div className="text-center pt-4">
                  <Link to="/analytics">
                    <Button variant="outline">View All Entries</Button>
                  </Link>
                </div>
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

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/journal">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">✍️</div>
                <h3 className="font-serif font-black mb-1">New Entry</h3>
                <p className="text-sm text-muted-foreground">Record your thoughts and mood</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/analytics">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-serif font-black mb-1">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Explore your mood patterns</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/settings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <h3 className="font-serif font-black mb-1">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize your experience</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
