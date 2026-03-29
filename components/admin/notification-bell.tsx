"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, ExternalLink } from "lucide-react"
import { Button } from "../ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { ScrollArea } from "../ui/scroll-area"
import { formatDate } from "../../lib/utils"


interface Notification {
    id: number
    type: string
    title: string
    message: string
    link: string | null
    read: boolean
    createdAt: string
}

interface NotificationBellProps {
    onNavigate?: (view: "applicants") => void
}

export function NotificationBell({ onNavigate }: NotificationBellProps) {

    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)

    const fetchNotifications = async () => {
        try {
            const response = await fetch("/api/admin/notifications")
            const data = await response.json()
            if (data.success) {
                setNotifications(data.notifications)
                setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length)
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error)
        }
    }

    useEffect(() => {
        fetchNotifications()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const markAsRead = async (id: number) => {
        try {
            await fetch("/api/admin/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, read: true } : n))
            )
            setUnreadCount(prev => Math.max(0, prev - 1))
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    const markAllAsRead = async () => {
        try {
            await fetch("/api/admin/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ readAll: true }),
            })
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to mark all as read:", error)
        }
    }

    const deleteAllNotifications = async () => {
        try {
            await fetch("/api/admin/notifications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deleteAll: true }),
            })
            setNotifications([])
            setUnreadCount(0)
        } catch (error) {
            console.error("Failed to delete all notifications:", error)
        }
    }

    const deleteNotification = async (id: number) => {
        try {
            await fetch("/api/admin/notifications", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            setNotifications(prev => prev.filter(n => n.id !== id))
            const notification = notifications.find(n => n.id === id)
            if (notification && !notification.read) {
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error("Failed to delete notification:", error)
        }
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 active:scale-95 rounded-xl h-10 w-10 flex items-center justify-center"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white border-2 border-background animate-in zoom-in-50 duration-300">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[400px] p-0 bg-white dark:bg-[#111111] border-border text-foreground shadow-2xl rounded-[2rem] overflow-hidden border transition-colors duration-500"
                align="end"
                sideOffset={12}
            >
                <div className="flex items-center justify-between border-b border-border p-5 bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Bell className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-bold text-base tracking-tight text-foreground">Notifications</h4>
                            <p className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-widest">
                                {unreadCount} unread
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={markAllAsRead}
                                className="h-8 px-3 text-[10px] text-primary hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-widest rounded-xl transition-all"
                            >
                                Mark all read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={deleteAllNotifications}
                                className="h-8 w-8 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                                title="Clear all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <ScrollArea className="h-[450px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center min-h-[400px] p-10 text-center">
                            <div className="w-20 h-20 rounded-3xl bg-muted/20 flex items-center justify-center mb-6 border border-border/50">
                                <Bell className="h-10 w-10 text-muted-foreground/20" />
                            </div>
                            <h5 className="text-foreground font-bold text-lg mb-2 tracking-tight">Clear skies!</h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-[200px] leading-relaxed">
                                No notifications to show right now. We'll alert you when something happens.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                    className={`relative p-6 transition-all hover:bg-muted/30 cursor-pointer flex gap-5 group ${!notification.read ? "bg-primary/[0.02]" : "opacity-60 grayscale-[0.5]"
                                        }`}
                                >
                                    {!notification.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3 mb-2">
                                            <span className={`text-sm font-bold leading-tight tracking-tight ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                                {notification.title}
                                            </span>
                                            <div className="flex items-center gap-2 shrink-0">
                                                {!notification.read && (
                                                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground/20 hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification.id);
                                                    }}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-5 line-clamp-2 leading-relaxed font-medium">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
                                                <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                                    {formatDate(notification.createdAt)}
                                                </span>
                                            </div>
                                            {(notification.link || onNavigate) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-7 px-4 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 text-[9px] font-bold uppercase tracking-widest rounded-xl transition-all group-hover:scale-105 active:scale-95 flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsOpen(false);
                                                        markAsRead(notification.id);
                                                        if (onNavigate) {
                                                            onNavigate("applicants");
                                                        } else if (notification.link) {
                                                            window.location.href = notification.link;
                                                        }
                                                    }}
                                                >
                                                    Details
                                                    <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-5 text-center border-t border-border bg-muted/10">
                        <p className="text-[10px] text-muted-foreground/30 font-bold uppercase tracking-widest">
                            End of notifications
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}


