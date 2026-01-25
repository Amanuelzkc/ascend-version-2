import { NextRequest, NextResponse } from "next/server"

// Mock jobs data
const mockJobs = [
  {
    id: 1,
    title: "Senior Accountant",
    slug: "senior-accountant",
    department: "Accounting",
    location: "Addis Ababa",
    type: "Full-time",
    experience: "5+ years",
    description:
      "We're looking for an experienced Senior Accountant to join our team. You'll be responsible for leading accounting operations, ensuring compliance, and managing financial reporting for our clients.",
    requirements: [
      "5+ years of accounting experience",
      "ACCA or CPA certification",
      "Strong knowledge of IFRS",
      "Experience with accounting software (SAP, QuickBooks)",
      "Excellent communication skills",
      "Leadership and team management skills",
    ],
  },
  {
    id: 2,
    title: "Financial Analyst",
    slug: "financial-analyst",
    department: "Advisory",
    location: "Addis Ababa",
    type: "Full-time",
    experience: "3+ years",
    description:
      "Join our advisory team as a Financial Analyst. You'll conduct financial analysis, develop business cases, and support strategic decision-making for our clients.",
    requirements: [
      "3+ years in financial analysis or corporate finance",
      "Strong Excel and financial modeling skills",
      "Knowledge of valuation methods",
      "Excellent analytical and problem-solving abilities",
      "Strong communication and presentation skills",
    ],
  },
  {
    id: 3,
    title: "Junior Accountant",
    slug: "junior-accountant",
    department: "Accounting",
    location: "Addis Ababa",
    type: "Full-time",
    experience: "0-2 years",
    description:
      "Start your career as a Junior Accountant with Ascend Advisory. You'll work on accounting operations, prepare financial statements, and gain exposure to various accounting practices.",
    requirements: [
      "Bachelor's degree in Accounting or Finance",
      "Pursuing or recently completed ACCA/CPA",
      "Proficiency in MS Excel",
      "Strong attention to detail",
      "Willingness to learn and grow",
    ],
  },
]

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // TODO: When MySQL is ready, fetch from database
    // const job = await db.jobs.findOne({ where: { slug } })

    const job = mockJobs.find((j) => j.slug === slug)

    if (!job) {
      return NextResponse.json(
        { message: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(job, { status: 200 })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { message: "Failed to fetch job" },
      { status: 500 }
    )
  }
}
