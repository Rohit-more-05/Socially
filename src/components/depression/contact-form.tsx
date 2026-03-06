"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "../ui/alert";

export interface ContactInfo {
  userName: string;
  userEmail: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

interface ContactFormProps {
  onSubmit: (info: ContactInfo) => void;
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    userName: "",
    userEmail: "",
    parentName: "",
    parentEmail: "",
    parentPhone: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate emails are different
    if (contactInfo.userEmail.toLowerCase() === contactInfo.parentEmail.toLowerCase()) {
      setError("Your email and parent's email must be different");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactInfo.userEmail) || !emailRegex.test(contactInfo.parentEmail)) {
      setError("Please enter valid email addresses");
      return;
    }

    onSubmit(contactInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-0">
        <div className="bg-cyan-600 p-6 text-white rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-white">Contact Information</CardTitle>
          <CardDescription className="text-white/90 mt-1">
            We'll share your results with your parent/guardian
          </CardDescription>
        </div>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="userName">Your Name *</Label>
              <Input
                id="userName"
                required
                value={contactInfo.userName}
                onChange={(e) => setContactInfo({ ...contactInfo, userName: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userEmail">Your Email *</Label>
              <Input
                id="userEmail"
                type="email"
                required
                value={contactInfo.userEmail}
                onChange={(e) => setContactInfo({ ...contactInfo, userEmail: e.target.value })}
                className="h-12"
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Parent/Guardian Information
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parentName">Parent's Name</Label>
                  <Input
                    id="parentName"
                    value={contactInfo.parentName}
                    onChange={(e) => setContactInfo({ ...contactInfo, parentName: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentEmail">Parent's Email *</Label>
                  <Input
                    id="parentEmail"
                    type="email"
                    required
                    placeholder="parent.email@example.com"
                    value={contactInfo.parentEmail}
                    onChange={(e) => setContactInfo({ ...contactInfo, parentEmail: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent's Phone</Label>
                  <Input
                    id="parentPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contactInfo.parentPhone}
                    onChange={(e) => setContactInfo({ ...contactInfo, parentPhone: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className=" text-white w-full bg-cyan-600  py-6 text-lg"
              size="lg"
            >
              Continue to Assessment <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}