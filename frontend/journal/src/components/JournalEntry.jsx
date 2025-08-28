import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Slider } from "./ui/slider"

const JournalEntry = ({ user }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    content: "",
    mood: [5],
    productivity: [5],
  })
  const [weather, setWeather] = useState(null)
  const [sentiment, setSentiment] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // Mock weather API call
    const fetchWeather = async () => {
      setLoading(true)
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock weather data
        const mockWeather = {
          condition: "Partly Cloudy",
          temperature: 72,
          location: "Your Location",
          icon: "⛅",
        }
        setWeather(mockWeather)
      } catch (error) {
        console.error("Failed to fetch weather:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
  }, [])

  useEffect(() => {
    // Simple sentiment analysis
    if (formData.content.length > 10) {
      const content = formData.content.toLowerCase()
      const positiveWords = [
        "happy",
        "great",
        "good",
        "amazing",
        "wonderful",
        "excited",
        "love",
        "joy",
        "peaceful",
        "grateful",
      ]
      const negativeWords = [
        "sad",
        "bad",
        "terrible",
        "awful",
        "hate",
        "angry",
        "frustrated",
        "worried",
        "anxious",
        "depressed",
      ]

      const positiveCount = positiveWords.filter((word) => content.includes(word)).length
      const negativeCount = negativeWords.filter((word) => content.includes(word)).length

      if (positiveCount > negativeCount) {
        setSentiment({ type: "positive", label: "Positive", icon: "😊", color: "text-green-600" })
      } else if (negativeCount > positiveCount) {
        setSentiment({ type: "negative", label: "Negative", icon: "😔", color: "text-red-600" })
      } else {
        setSentiment({ type: "neutral", label: "Neutral", icon: "😐", color: "text-gray-600" })
      }
    } else {
      setSentiment(null)
    }
  }, [formData.content])

  const handleContentChange = (e) => {
    setFormData({
      ...formData,
      content: e.target.value,
    })
  }

  const handleMoodChange = (value) => {
    setFormData({
      ...formData,
      mood: value,
    })
  }

  const handleProductivityChange = (value) => {
    setFormData({
      ...formData,
      productivity: value,
    })
  }

  const getMoodLabel = (mood) => {
    if (mood >= 9) return "Excellent"
    if (mood >= 7) return "Great"
    if (mood >= 5) return "Good"
    if (mood >= 3) return "Okay"
    if (mood >= 1) return "Low"
    return "Very Low"
  }

  const getProductivityLabel = (productivity) => {
    if (productivity >= 9) return "Highly Productive"
    if (productivity >= 7) return "Very Productive"
    if (productivity >= 5) return "Productive"
    if (productivity >= 3) return "Somewhat Productive"
    if (productivity >= 1) return "Low Productivity"
    return "Not Productive"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Simulate API call to save entry
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock save to localStorage for demo
      const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        content: formData.content,
        mood: formData.mood[0],
        productivity: formData.productivity[0],
        weather: weather?.condition || "Unknown",
        sentiment: sentiment?.type || "neutral",
        userId: user.id,
      }

      const existingEntries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
      existingEntries.unshift(entry)
      localStorage.setItem("journalEntries", JSON.stringify(existingEntries))

      // Navigate back to dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to save entry:", error)
    } finally {
      setSaving(false)
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-foreground mb-2">New Journal Entry</h1>
          <p className="text-muted-foreground">{today}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Area */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How was your day?</CardTitle>
              <CardDescription>Share your thoughts, experiences, and reflections</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write about your day, your feelings, what you're grateful for, or anything on your mind..."
                value={formData.content}
                onChange={handleContentChange}
                className="min-h-[200px] text-base leading-relaxed"
                required
              />
              {sentiment && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sentiment:</span>
                  <span className={`text-sm font-medium ${sentiment.color}`}>
                    {sentiment.icon} {sentiment.label}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mood and Productivity Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood Slider */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mood Level</CardTitle>
                <CardDescription>How are you feeling overall today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Mood</Label>
                    <span className="text-sm font-medium text-primary">
                      {formData.mood[0]}/10 - {getMoodLabel(formData.mood[0])}
                    </span>
                  </div>
                  <Slider
                    value={formData.mood}
                    onValueChange={handleMoodChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Very Low</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Slider */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Productivity Level</CardTitle>
                <CardDescription>How productive did you feel today?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Productivity</Label>
                    <span className="text-sm font-medium text-secondary">
                      {formData.productivity[0]}/10 - {getProductivityLabel(formData.productivity[0])}
                    </span>
                  </div>
                  <Slider
                    value={formData.productivity}
                    onValueChange={handleProductivityChange}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not Productive</span>
                    <span>Highly Productive</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weather Widget */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Weather</CardTitle>
              <CardDescription>Current conditions in your area</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Loading weather...</span>
                </div>
              ) : weather ? (
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{weather.icon}</div>
                  <div>
                    <div className="font-medium">{weather.condition}</div>
                    <div className="text-sm text-muted-foreground">
                      {weather.temperature}°F • {weather.location}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">Weather information unavailable</div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving || !formData.content.trim()}>
              {saving ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JournalEntry
