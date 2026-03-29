"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Badge } from "../ui/badge"
import { Loader2, Shield, User, Key, Trash2, AlertCircle, Check } from "lucide-react"
import { toast } from "sonner"

export function UsersManagement() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState<number | null>(null)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  
  // Create User State
  const [newName, setNewName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newPasswordValue, setNewPasswordValue] = useState("")
  const [newRole, setNewRole] = useState<"ADMIN" | "SUPERADMIN">("ADMIN")
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Edit State
  const [editName, setEditName] = useState("")
  const [editUsername, setEditUsername] = useState("")
  // Rename newPassword to resetPasswordValue to avoid conflict
  const [resetPasswordValue, setResetPasswordValue] = useState("")
  const [typingResetId, setTypingResetId] = useState<number | null>(null)
  const [resetSuccessId, setResetSuccessId] = useState<number | null>(null)

  const isAdminB = (session?.user as any)?.role === "SUPERADMIN_B"
  const isSuperA = (session?.user as any)?.role === "SUPERADMIN"

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users/list")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    try {
      const response = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: newUsername, 
          password: newPasswordValue, 
          name: newName, 
          role: newRole 
        }),
      })

      if (response.ok) {
        toast.success("User created successfully")
        setShowCreateForm(false)
        setNewName("")
        setNewUsername("")
        setNewPasswordValue("")
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to create user")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!confirm(`Are you sure you want to delete ${username}? This action cannot be undone.`)) return

    setIsDeleting(userId)
    try {
      const response = await fetch("/api/admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        toast.success(`User ${username} deleted`)
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to delete user")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsDeleting(null)
    }
  }

  const handleStartEdit = (user: any) => {
    setEditingId(user.id)
    setEditName(user.name || "")
    setEditUsername(user.username)
  }

  const handleUpdateUser = async (userId: number) => {
    setIsUpdating(userId)
    try {
      const response = await fetch("/api/admin/users/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: editName, username: editUsername }),
      })

      if (response.ok) {
        toast.success("User updated successfully")
        setEditingId(null)
        fetchUsers()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to update user")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsUpdating(null)
    }
  }

  const handleResetPassword = async (userId: number, username: string) => {
    if (!resetPasswordValue) {
      toast.error("Please enter a new password")
      return
    }

    setIsResetting(userId)
    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword: resetPasswordValue }),
      })

      if (response.ok) {
        toast.success(`Password for ${username} has been reset`)
        setResetPasswordValue("")
        setResetSuccessId(userId)
        // Clear success state after 2 seconds
        setTimeout(() => setResetSuccessId(null), 2000)
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to reset password")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsResetting(null)
      setTypingResetId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-primary text-white hover:bg-primary/90 rounded-xl px-6"
        >
          {showCreateForm ? "Cancel" : "Add New Account"}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="border border-primary/20 bg-primary/5 rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-lg font-bold">Create New Administrator</CardTitle>
            <CardDescription>Add a new account to the system according to your permissions.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-4">
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
              <div className="space-y-2">
                <Label htmlFor="newName" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-muted-foreground">Full Name</Label>
                <Input 
                  id="newName"
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="John Doe"
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newUsername" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-muted-foreground">Username</Label>
                <Input 
                  id="newUsername"
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  placeholder="johndoe"
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPasswordValue" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-muted-foreground">Initial Password</Label>
                <Input 
                  id="newPasswordValue"
                  type="password"
                  value={newPasswordValue} 
                  onChange={(e) => setNewPasswordValue(e.target.value)} 
                  placeholder="••••••••"
                  className="h-11 rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newRole" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-muted-foreground">Role</Label>
                <select 
                  id="newRole"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                >
                  <option value="ADMIN">Regular Admin</option>
                  {isAdminB && <option value="SUPERADMIN">Superadmin A</option>}
                </select>
              </div>
              <div className="lg:col-span-4 mt-2">
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full md:w-auto px-10 h-11 bg-primary text-white hover:bg-primary/90 rounded-xl"
                >
                  {isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Administrator"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border border-border bg-white dark:bg-[#111111] rounded-[2.5rem] overflow-hidden shadow-sm">
        <CardHeader className="p-8 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Administrator Accounts</CardTitle>
              <CardDescription>
                Manage permissions and security for the administrative team.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border bg-muted/30">
                <TableHead className="px-8 py-4 font-bold uppercase tracking-widest text-[10px]">Name</TableHead>
                <TableHead className="px-8 py-4 font-bold uppercase tracking-widest text-[10px]">Username</TableHead>
                <TableHead className="px-8 py-4 font-bold uppercase tracking-widest text-[10px]">Role</TableHead>
                <TableHead className="px-8 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isEditing = editingId === user.id
                const canManage = 
                  isAdminB || (isSuperA && user.role === "ADMIN");
                const isSelf = user.id.toString() === (session?.user as any)?.id;

                return (
                  <TableRow key={user.id} className="border-b border-border/50 hover:bg-muted/5 transition-colors">
                    <TableCell className="px-8 py-6">
                      {isEditing ? (
                        <Input 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-10 w-full max-w-[200px] rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                           <span className="font-semibold text-foreground">{user.name}</span>
                           {isSelf && <Badge variant="outline" className="text-[10px] uppercase px-1">You</Badge>}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      {isEditing ? (
                        <Input 
                          value={editUsername} 
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="h-10 w-full max-w-[200px] rounded-lg"
                        />
                      ) : (
                        <span className="text-muted-foreground font-medium">{user.username}</span>
                      )}
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <Badge 
                        variant="secondary" 
                        className={user.role.includes("SUPERADMIN") 
                          ? "bg-primary/10 text-primary border-primary/20 px-3 py-1" 
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 px-3 py-1"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      {canManage ? (
                        <div className="flex items-center justify-end gap-3">
                          {isEditing ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingId(null)}
                                className="rounded-xl h-10 px-4"
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateUser(user.id)}
                                disabled={isUpdating !== null}
                                className="bg-primary text-white hover:bg-primary/90 rounded-xl h-10 px-6"
                              >
                                {isUpdating === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(user)}
                                className="rounded-xl h-10 px-4 hover:bg-muted font-medium"
                              >
                                Edit
                              </Button>
                              <div className="h-4 w-[1px] bg-border mx-1" />
                              <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-xl border border-border/50">
                                <Input
                                  type="password"
                                  placeholder="New password"
                                  className="w-28 h-8 rounded-lg border-none bg-transparent focus-visible:ring-0 px-2 text-xs"
                                  onChange={(e) => {
                                    setTypingResetId(user.id)
                                    setResetPasswordValue(e.target.value)
                                  }}
                                  value={typingResetId === user.id ? resetPasswordValue : ""}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleResetPassword(user.id, user.username)}
                                  disabled={isResetting !== null || editingId !== null}
                                  className={`h-8 w-8 p-0 ${resetSuccessId === user.id ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-primary text-white hover:bg-primary/90'} rounded-lg shrink-0 transition-all duration-300`}
                                  title="Reset Password"
                                >
                                  {isResetting === user.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : resetSuccessId === user.id ? (
                                    <Check className="h-3 w-3 animate-in zoom-in" />
                                  ) : (
                                    <Key className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                disabled={isDeleting !== null || isSelf}
                                className="h-10 w-10 p-0 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all border border-destructive/20"
                                title="Delete User"
                              >
                                {isDeleting === user.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/30 tracking-widest italic">Protected</span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isAdminB && (
        <Card className="border border-destructive/20 bg-destructive/5 rounded-[2.5rem] overflow-hidden shadow-sm">
          <CardHeader className="p-8">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-destructive/10 flex items-center justify-center border border-destructive/20 text-destructive">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-destructive">Master Recovery Mode</CardTitle>
                <CardDescription className="text-destructive/70 font-medium">
                  You are logged in via the Break-Glass system. You can create/delete Superadmins and bypass standard restrictions.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}
    </div>
  )
}
