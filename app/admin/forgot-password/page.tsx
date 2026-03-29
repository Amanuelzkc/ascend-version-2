"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2, KeyRound, Lock, ShieldCheck, SendHorizontal, User } from "lucide-react"

type ResetStep = "REQUEST" | "SENDING" | "VERIFY" | "RESET" | "SUCCESS"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background px-4 pt-[15vh]">
      <Card className="w-full max-w-md border border-border bg-white dark:bg-[#111111] text-foreground shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-4 pt-10 pb-6 relative text-center">
          <Link 
            href="/admin" 
            className="absolute left-6 top-6 h-10 w-10 flex items-center justify-center rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
            <Lock className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Recovery Help
            </CardTitle>
            <CardDescription className="text-muted-foreground font-medium px-4">
              To keep your account secure, we do not use email-based resets. 
              Please follow the hierarchy below:
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-12 space-y-8">
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-muted/30 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Are you an Admin?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Contact your <strong>Superadmin</strong>. They can reset your password directly from their dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Are you a Superadmin?</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Contact the <strong>Master System Owner</strong>. They can use the off-grid recovery account to restore your access.
              </p>
            </div>
          </div>

          <Link href="/admin">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 font-bold py-7 rounded-2xl shadow-lg shadow-primary/20 transition-all uppercase tracking-widest text-sm">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
