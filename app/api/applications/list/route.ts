import { NextResponse } from "next/server"

// Mock applicants data - Replace with database queries when MySQL is ready
const mockApplicants = [
  {
    id: 1,
    fullName: "Abebe Tekle",
    email: "abebe.tekle@example.com",
    phone: "+251 911 123456",
    location: "Addis Ababa",
    currentRole: "Senior Accountant",
    experience: "5+ years",
    coverLetter:
      "I am a highly motivated accountant with extensive experience in financial reporting and audit. I am excited about the opportunity to join Ascend Advisory and contribute to your team's success.",
    resumeUrl: "/resumes/abebe-tekle.pdf",
    jobTitle: "Senior Accountant",
    jobSlug: "senior-accountant",
    status: "new",
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    fullName: "Fatima Mohammed",
    email: "fatima.mohammed@example.com",
    phone: "+251 912 654321",
    location: "Dire Dawa",
    currentRole: "Financial Analyst",
    experience: "3 years",
    coverLetter:
      "With my strong analytical skills and passion for financial management, I believe I would be a valuable addition to your advisory team. I look forward to discussing how I can contribute.",
    resumeUrl: "/resumes/fatima-mohammed.pdf",
    jobTitle: "Financial Analyst",
    jobSlug: "financial-analyst",
    status: "reviewed",
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    fullName: "Yohannes Hiwot",
    email: "yohannes.hiwot@example.com",
    phone: "+251 913 789012",
    location: "Addis Ababa",
    currentRole: "Junior Accountant",
    experience: "1 year",
    coverLetter: "I am eager to start my career in a professional firm. I am committed to learning and growing with Ascend Advisory.",
    resumeUrl: "/resumes/yohannes-hiwot.pdf",
    jobTitle: "Junior Accountant",
    jobSlug: "junior-accountant",
    status: "interview",
    appliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export async function GET() {
  try {
    // TODO: When MySQL is ready, fetch from database
    // const applicants = await db.applicants.findAll()

    return NextResponse.json(mockApplicants, { status: 200 })
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json(
      { message: "Failed to fetch applicants" },
      { status: 500 }
    )
  }
}
