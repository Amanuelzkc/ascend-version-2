const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const blogPosts = [
    {
        title: "5 Financial Metrics Every Ethiopian Business Owner Should Track",
        slug: "financial-metrics-ethiopian-business",
        excerpt: "Understanding key financial metrics is crucial for business success. Learn about the essential KPIs that can help you make informed decisions and drive growth.",
        content: `# 5 Financial Metrics Every Ethiopian Business Owner Should Track

Understanding your financial metrics is crucial for making informed business decisions. Here are the top 5 KPIs every Ethiopian business owner should monitor:

## 1. Cash Flow
Cash flow is the lifeblood of your business...

## 2. Gross Profit Margin
Your gross profit margin shows how efficiently you're producing goods or services...

## 3. Net Profit Margin
This metric tells you what percentage of revenue becomes actual profit...

## 4. Current Ratio
The current ratio measures your ability to pay short-term obligations...

## 5. Accounts Receivable Turnover
This shows how quickly you collect payments from customers...`,
        author: "Bemnet Abebe",
        read_time: "6 min read",
        published: true,
        created_at: "2026-01-15T10:00:00Z",
    },
    {
        title: "Navigating Tax Compliance in Ethiopia: A 2026 Guide",
        slug: "tax-compliance-ethiopia-2026",
        excerpt: "Stay ahead of regulatory changes with our comprehensive guide to tax compliance for businesses operating in Ethiopia.",
        content: `# Navigating Tax Compliance in Ethiopia: A 2026 Guide

Tax compliance is essential for any business operating in Ethiopia. This guide covers the key requirements and recent changes you need to know.

## Types of Taxes

### 1. Business Profit Tax
All businesses in Ethiopia are subject to business profit tax...

### 2. Value Added Tax (VAT)
VAT is charged on most goods and services...

### 3. Withholding Tax
Certain payments require withholding tax...

## Key Deadlines for 2026

- Quarterly VAT returns: Due by the 30th of the month following each quarter
- Annual profit tax: Due within 4 months of fiscal year end...`,
        author: "Betelhem Desalegn",
        read_time: "8 min read",
        published: true,
        created_at: "2026-01-10T10:00:00Z",
    },
    {
        title: "The Rise of Fintech in East Africa: Opportunities for SMEs",
        slug: "fintech-east-africa-sme",
        excerpt: "Explore how fintech innovations are creating new opportunities for small and medium enterprises across East Africa.",
        content: `# The Rise of Fintech in East Africa

East Africa is experiencing a fintech revolution that's transforming how SMEs access financial services...

## Mobile Money Revolution

The success of M-Pesa in Kenya paved the way for mobile money adoption across the region...`,
        author: "Sosina Kebede",
        read_time: "5 min read",
        published: false,
        created_at: "2026-01-05T10:00:00Z",
    },
]

const insights = [
    {
        title: "Ethiopian Economic Outlook 2026: Key Trends and Opportunities",
        slug: "ethiopian-economic-outlook-2026",
        excerpt: "Our comprehensive analysis of Ethiopia's economic trajectory.",
        content: `# Ethiopian Economic Outlook 2026

Ethiopia's economy is poised for significant transformation in 2026...`,
        category: "Market Analysis",
        icon_name: "TrendingUp",
        author: "Bemnet Abebe",
        read_time: "15 min read",
        published: true,
        featured: true,
        created_at: "2026-01-12T00:00:00Z",
    },
    {
        title: "SME Financing Landscape in Ethiopia",
        slug: "sme-financing-landscape",
        excerpt: "A deep dive into the current state of SME financing.",
        content: `# SME Financing Landscape in Ethiopia

Small and medium enterprises are the backbone of Ethiopia's economy...`,
        category: "Research Report",
        icon_name: "PieChart",
        author: "Betelhem Desalegn",
        read_time: "12 min read",
        published: true,
        featured: false,
        created_at: "2026-01-08T00:00:00Z",
    },
    {
        title: "Digital Transformation in Ethiopian Banking",
        slug: "digital-transformation-banking",
        excerpt: "Analyzing the shift towards digital banking services and its impact on the financial sector.",
        content: `# Digital Transformation in Ethiopian Banking\n\nThe banking sector in Ethiopia is undergoing a rapid digital transformation...`,
        category: "Sector Report",
        icon_name: "Smartphone",
        author: "Sosina Kebede",
        read_time: "10 min read",
        published: true,
        featured: false,
        created_at: "2026-01-20T00:00:00Z",
    },
]

const jobs = [
    {
        title: "Senior Financial Analyst",
        slug: "senior-financial-analyst",
        department: "Advisory",
        location: "Addis Ababa, Ethiopia",
        type: "Full-time",
        experience: "5+ years",
        description: "Join our advisory team to lead complex financial analysis projects.",
        requirements: [
            "Bachelor's degree in Finance, Accounting, or related field",
            "CPA, ACCA, or CFA certification preferred",
            "5+ years of experience in financial analysis",
        ],
        responsibilities: [
            "Lead due diligence and valuation engagements",
            "Develop financial models",
            "Mentor junior team members",
        ],
        salary_range: "Competitive",
        published: true,
        created_at: "2026-01-10T10:00:00Z",
    },
    {
        title: "Tax Consultant",
        slug: "tax-consultant",
        department: "Tax & Compliance",
        location: "Addis Ababa, Ethiopia",
        type: "Full-time",
        experience: "3+ years",
        description: "Help our clients navigate Ethiopian tax regulations.",
        requirements: [
            "Bachelor's degree in Accounting, Tax, or related field",
            "3+ years of experience in tax consulting",
        ],
        responsibilities: [
            "Provide tax advisory services",
            "Prepare and review tax returns",
        ],
        salary_range: "Negotiable",
        published: true,
        created_at: "2026-01-08T14:00:00Z",
    },
    {
        title: "Audit Intern",
        slug: "audit-intern",
        department: "Audit",
        location: "Addis Ababa, Ethiopia",
        type: "Internship",
        experience: "Entry Level",
        description: "Gain hands-on experience in auditing with our team.",
        requirements: [
            "Currently pursuing a degree in Accounting or Finance",
        ],
        responsibilities: [
            "Assist with audit fieldwork",
            "Prepare audit workpapers",
        ],
        salary_range: "Stipend",
        published: false,
        created_at: "2026-01-01T08:00:00Z",
    },
]

async function main() {
    console.log('Start seeding ...')

    // Seed Blog Posts
    for (const post of blogPosts) {
        const createdPost = await prisma.blogpost.upsert({
            where: { slug: post.slug },
            update: {
                updatedAt: new Date(),
            },
            create: {
                title: post.title,
                slug: post.slug,
                excerpt: post.excerpt,
                content: post.content,
                author: post.author,
                read_time: post.read_time,
                published: post.published,
                createdAt: new Date(post.created_at),
                updatedAt: new Date(),
            },
        })
        console.log(`Created post with id: ${createdPost.id}`)
    }

    // Seed Insights
    for (const insight of insights) {
        // Use upsert now that we have slug @unique
        const createdInsight = await prisma.insight.upsert({
            where: { slug: insight.slug },
            update: {
                updatedAt: new Date(),
            },
            create: {
                title: insight.title,
                slug: insight.slug,
                excerpt: insight.excerpt,
                content: insight.content,
                category: insight.category,
                icon_name: insight.icon_name,
                author: insight.author,
                read_time: insight.read_time,
                published: insight.published,
                featured: insight.featured,
                createdAt: new Date(insight.created_at),
                updatedAt: new Date(),
            }
        })
        console.log(`Created insight with id: ${createdInsight.id}`)
    }

    // Seed Jobs
    for (const job of jobs) {
        const createdJob = await prisma.job.upsert({
            where: { slug: job.slug },
            update: {
                updatedAt: new Date(),
            },
            create: {
                title: job.title,
                slug: job.slug,
                department: job.department,
                location: job.location,
                type: job.type,
                description: job.description,
                requirements: JSON.stringify(job.requirements),
                responsibilities: JSON.stringify(job.responsibilities),
                salary_range: job.salary_range,
                published: job.published,
                createdAt: new Date(job.created_at),
                updatedAt: new Date(),
            },
        })
        console.log(`Created job with id: ${createdJob.id}`)
    }

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
