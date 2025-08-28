import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Switch } from "./ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

const Settings = ({ user, onLogout }) => {
  const [profileData, setProfileData] = useState({
    name: user.name || "",
    email: user.email || "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    weeklyReport: false,
    moodAlerts: true,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Check for existing dark mode preference
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    // Load notification preferences
    const savedNotifications = localStorage.getItem("notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
    setMessage("")
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
    setMessage("")
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data in localStorage
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setMessage("Profile updated successfully!")
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.")
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setMessage("Password updated successfully!")
    } catch (error) {
      setMessage("Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDarkModeToggle = (checked) => {
    setDarkMode(checked)
    localStorage.setItem("darkMode", checked.toString())

    if (checked) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const handleNotificationChange = (key, value) => {
    const updatedNotifications = {
      ...notifications,
      [key]: value,
    }
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const handleExportData = async () => {
    setLoading(true)
    try {
      // Get all user data
      const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]")
      const userData = {
        user: user,
        entries: entries,
        exportDate: new Date().toISOString(),
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `mindjournal-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage("Data exported successfully!")
    } catch (error) {
      setMessage("Failed to export data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteData = async () => {
    if (window.confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
      setLoading(true)
      try {
        // Clear all user data
        localStorage.removeItem("journalEntries")
        localStorage.removeItem("notifications")
        localStorage.removeItem("darkMode")

        setMessage("All data deleted successfully!")
        setTimeout(() => {
          onLogout()
        }, 2000)
      } catch (error) {
        setMessage("Failed to delete data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-black text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.includes("successfully") || message.includes("exported")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="space-y-8">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Appearance</CardTitle>
              <CardDescription>Customize how the app looks and feels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Daily Reminder</Label>
                  <p className="text-sm text-muted-foreground">Get reminded to write in your journal</p>
                </div>
                <Switch
                  checked={notifications.dailyReminder}
                  onCheckedChange={(checked) => handleNotificationChange("dailyReminder", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly mood and productivity summaries</p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) => handleNotificationChange("weeklyReport", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Mood Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about significant mood changes</p>
                </div>
                <Switch
                  checked={notifications.moodAlerts}
                  onCheckedChange={(checked) => handleNotificationChange("moodAlerts", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Data Management</CardTitle>
              <CardDescription>Export or delete your personal data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={handleExportData}
                  disabled={loading}
                  className="flex-1 bg-transparent"
                >
                  Export My Data
                </Button>
                <Button variant="destructive" onClick={handleDeleteData} disabled={loading} className="flex-1">
                  Delete All Data
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Export your data to keep a backup, or permanently delete all your information from our servers.
              </p>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Account Actions</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={onLogout} className="w-full sm:w-auto bg-transparent">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Settings
