import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Navbar } from "@/components/navbar"
import { Breadcrumb } from "@/components/breadcrumb"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          // gray theme for settings
          "--primary": "#6b7280",
          "--primary-foreground": "#ffffff",
          "--accent": "#6b7280",
          "--accent-foreground": "#ffffff",
          "--sidebar-primary": "#6b7280",
          "--sidebar-primary-foreground": "#ffffff",
          "--sidebar-accent": "#6b7280",
          "--sidebar-accent-foreground": "#ffffff",
          "--ring": "#9ca3af",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-gray-50 dark:bg-gray-950">
        <Navbar />
        <SiteHeader />
        <main className="flex-1 px-6 py-6">
          <div className="flex items-center justify-between">
            <Breadcrumb items={["Dashboard", "Settings"]} />
            <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700">
              Last updated Sep 26
            </Badge>
          </div>
          
          <div className="mt-6">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">Account Settings</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your account preferences and integrations</p>
          </div>

          <div className="mt-8">
            <Tabs defaultValue="profile">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xl font-medium">
                        JD
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Change avatar
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">
                          JPG, GIF or PNG. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue="John" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue="Doe" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue="john.doe@example.com" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Product Manager" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" defaultValue="Acme Inc." className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="eastern">
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eastern">Eastern Time (ET)</SelectItem>
                            <SelectItem value="central">Central Time (CT)</SelectItem>
                            <SelectItem value="mountain">Mountain Time (MT)</SelectItem>
                            <SelectItem value="pacific">Pacific Time (PT)</SelectItem>
                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current password</Label>
                      <Input id="current-password" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="new-password">New password</Label>
                      <Input id="new-password" type="password" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="confirm-password">Confirm password</Label>
                      <Input id="confirm-password" type="password" className="mt-1" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Update password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Meeting Notifications</h3>
                      <div className="grid gap-2">
                        <div className="flex items-start space-x-3">
                          <Checkbox id="meeting-reminder" defaultChecked />
                          <div>
                            <Label htmlFor="meeting-reminder" className="cursor-pointer">Meeting reminders</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notifications before your scheduled meetings
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="meeting-changes" defaultChecked />
                          <div>
                            <Label htmlFor="meeting-changes" className="cursor-pointer">Meeting changes</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when meetings are rescheduled, canceled or updated
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="meeting-notes" defaultChecked />
                          <div>
                            <Label htmlFor="meeting-notes" className="cursor-pointer">Meeting notes</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when meeting notes are ready
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Task Notifications</h3>
                      <div className="grid gap-2">
                        <div className="flex items-start space-x-3">
                          <Checkbox id="assigned-tasks" defaultChecked />
                          <div>
                            <Label htmlFor="assigned-tasks" className="cursor-pointer">Assigned tasks</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when you're assigned a task
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="task-updates" />
                          <div>
                            <Label htmlFor="task-updates" className="cursor-pointer">Task updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when there are updates to your tasks
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="task-deadlines" defaultChecked />
                          <div>
                            <Label htmlFor="task-deadlines" className="cursor-pointer">Task deadlines</Label>
                            <p className="text-sm text-muted-foreground">
                              Get notified when a task is approaching its deadline
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Notification Channels</h3>
                      <div className="grid gap-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">Email</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications
                            </p>
                          </div>
                          <ToggleGroup type="single" defaultValue="all">
                            <ToggleGroupItem value="all">All</ToggleGroupItem>
                            <ToggleGroupItem value="important">Important</ToggleGroupItem>
                            <ToggleGroupItem value="none">None</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">Push Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications in-app and on desktop
                            </p>
                          </div>
                          <ToggleGroup type="single" defaultValue="important">
                            <ToggleGroupItem value="all">All</ToggleGroupItem>
                            <ToggleGroupItem value="important">Important</ToggleGroupItem>
                            <ToggleGroupItem value="none">None</ToggleGroupItem>
                          </ToggleGroup>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Reset to defaults</Button>
                    <Button>Save preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar Settings</CardTitle>
                    <CardDescription>Configure your calendar preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Calendar Integration</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor="default-calendar">Default calendar</Label>
                          <Select defaultValue="work">
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select calendar" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="work">Work Calendar</SelectItem>
                              <SelectItem value="personal">Personal Calendar</SelectItem>
                              <SelectItem value="team">Team Calendar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="work-hours-start">Working hours</Label>
                          <div className="flex items-center space-x-2 mt-1">
                            <Select defaultValue="9">
                              <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder="Start time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <SelectItem key={i} value={(i + 7).toString()}>
                                    {i + 7}:00 AM
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span>to</span>
                            <Select defaultValue="17">
                              <SelectTrigger className="w-[110px]">
                                <SelectValue placeholder="End time" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <SelectItem key={i} value={(i + 13).toString()}>
                                    {i + 1}:00 PM
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 pt-2">
                        <Checkbox id="show-weekends" />
                        <div>
                          <Label htmlFor="show-weekends" className="cursor-pointer">Show weekends</Label>
                          <p className="text-sm text-muted-foreground">
                            Display weekend days in your calendar view
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Meeting Preferences</h3>
                      <div className="grid gap-2">
                        <div className="flex items-start space-x-3">
                          <Checkbox id="auto-add-buffer" defaultChecked />
                          <div>
                            <Label htmlFor="auto-add-buffer" className="cursor-pointer">Add buffer time between meetings</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically add 10 minutes of buffer time between consecutive meetings
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="auto-generate-agenda" defaultChecked />
                          <div>
                            <Label htmlFor="auto-generate-agenda" className="cursor-pointer">Auto-generate meeting agenda</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically generate a meeting agenda template for new meetings
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Checkbox id="add-video-conf" defaultChecked />
                          <div>
                            <Label htmlFor="add-video-conf" className="cursor-pointer">Add video conferencing by default</Label>
                            <p className="text-sm text-muted-foreground">
                              Automatically add video conferencing links to new meetings
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Connected Calendars</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Google Calendar</h4>
                              <p className="text-xs text-muted-foreground">Connected · john.doe@gmail.com</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Disconnect</Button>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                <line x1="16" x2="16" y1="2" y2="6" />
                                <line x1="8" x2="8" y1="2" y2="6" />
                                <line x1="3" x2="21" y1="10" y2="10" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Microsoft Outlook</h4>
                              <p className="text-xs text-muted-foreground">Connected · john.doe@company.com</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Disconnect</Button>
                        </div>
                        <Button variant="outline" className="w-full">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" x2="12" y1="8" y2="16" />
                            <line x1="8" x2="16" y1="12" y2="12" />
                          </svg>
                          Connect another calendar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="integrations" className="mt-6 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Integrations</CardTitle>
                    <CardDescription>Connect your other tools and services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Connected Services</h3>
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <path d="M5.8 11.3 2 22l10.7-3.79" />
                                <path d="M4 3h.01" />
                                <path d="M22 8h.01" />
                                <path d="M15 2h.01" />
                                <path d="M22 20h.01" />
                                <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
                                <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
                                <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.9 9 5.52 9 6.23V7" />
                                <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Slack</h4>
                              <p className="text-xs text-muted-foreground">Connected · Workspace: Acme Team</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">Configure</Button>
                            <Button variant="ghost" size="sm">Disconnect</Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" />
                                <path d="M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Notion</h4>
                              <p className="text-xs text-muted-foreground">Connected · Workspace: Project Docs</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">Configure</Button>
                            <Button variant="ghost" size="sm">Disconnect</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Available Integrations</h3>
                      <div className="grid gap-4">
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M7 7h10" />
                                <path d="M7 12h10" />
                                <path d="M7 17h10" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">Asana</h4>
                              <p className="text-xs text-muted-foreground">Connect for task tracking</p>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect width="4" height="12" x="2" y="9" />
                                <circle cx="4" cy="4" r="2" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">LinkedIn</h4>
                              <p className="text-xs text-muted-foreground">Connect to import contacts</p>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                        <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">GitHub</h4>
                              <p className="text-xs text-muted-foreground">Connect to sync repositories</p>
                            </div>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage API access for developers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                        <div>
                          <h4 className="font-medium text-sm">Production API Key</h4>
                          <p className="text-xs text-muted-foreground">Last used 2 days ago</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-muted px-3 py-1 rounded-md font-mono text-xs">
                            ••••••••••••••••
                          </div>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 border rounded-md bg-background">
                        <div>
                          <h4 className="font-medium text-sm">Development API Key</h4>
                          <p className="text-xs text-muted-foreground">Last used 5 hours ago</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="bg-muted px-3 py-1 rounded-md font-mono text-xs">
                            ••••••••••••••••
                          </div>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" x2="12" y1="8" y2="16" />
                          <line x1="8" x2="16" y1="12" y2="12" />
                        </svg>
                        Generate new API key
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}