import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Starting Data Restoration ---')

  // 1. Restore Blogs from post.json
  const postPath = path.join(process.cwd(), 'post.json')
  if (fs.existsSync(postPath)) {
    const posts = JSON.parse(fs.readFileSync(postPath, 'utf8'))
    console.log(`Found ${posts.length} blogs in post.json. Restoring...`)

    for (const post of posts) {
      try {
        await prisma.blogpost.upsert({
          where: { slug: post.slug || `post-${post.id}` },
          update: {
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author || 'Admin',
            read_time: post.read_time || '5 min read',
            published: post.published ?? false,
            scheduled_at: post.scheduled_at ? new Date(post.scheduled_at) : null,
            updatedAt: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          },
          create: {
            title: post.title,
            slug: post.slug || `post-${post.id}`,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author || 'Admin',
            read_time: post.read_time || '5 min read',
            published: post.published ?? false,
            scheduled_at: post.scheduled_at ? new Date(post.scheduled_at) : null,
            createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
            updatedAt: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          },
        })
      } catch (err) {
        console.error(`Failed to restore blog: ${post.title}`, err)
      }
    }
  }

  // 2. Restore Insights from Sample Data
  const insights = [
    {
      title: 'Ethiopian Economic Outlook 2026: Key Trends and Opportunities',
      slug: 'ethiopian-economic-outlook-2026',
      excerpt: "Our comprehensive analysis of Ethiopia's economic trajectory, examining GDP growth projections, foreign investment trends, and emerging sectors poised for growth in the coming year.",
      content: '# Ethiopian Economic Outlook 2026\n\nFull content here...',
      author: 'Bemnet Abebe',
      read_time: '15 min read',
      icon_name: 'TrendingUp',
      published: true,
      featured: true,
    },
    {
      title: 'SME Financing Landscape in Ethiopia',
      slug: 'sme-financing-landscape',
      excerpt: 'A deep dive into the current state of SME financing, including bank lending, microfinance, and emerging alternative financing options.',
      content: '# SME Financing Landscape\n\nFull content here...',
      author: 'Betelhem Desalegn',
      read_time: '12 min read',
      icon_name: 'PieChart',
      published: true,
      featured: false,
    },
    {
      title: 'Industry Benchmark: Professional Services Sector',
      slug: 'professional-services-benchmark',
      excerpt: "Comparative analysis of financial performance metrics across Ethiopia's professional services industry.",
      content: '# Professional Services Benchmark\n\nFull content here...',
      author: 'Bemnet Abebe',
      read_time: '10 min read',
      icon_name: 'BarChart3',
      published: true,
      featured: false,
    },
    {
      title: 'Strategic Planning Framework for Ethiopian Businesses',
      slug: 'strategic-planning-framework',
      excerpt: 'A practical framework for developing robust strategic plans tailored to the unique challenges of the Ethiopian market.',
      content: '# Strategic Planning Framework\n\nFull content here...',
      author: 'Bemnet Abebe',
      read_time: '18 min read',
      icon_name: 'Target',
      published: true,
      featured: false,
    },
    {
      title: 'Digital Transformation in Ethiopian Finance Departments',
      slug: 'digital-transformation-finance',
      excerpt: 'Insights on how Ethiopian businesses are adopting digital tools to modernize their finance operations.',
      content: '# Digital Transformation in Finance\n\nFull content here...',
      author: 'Sosina Kebede',
      read_time: '8 min read',
      icon_name: 'Lightbulb',
      published: true,
      featured: false,
    }
  ]

  console.log(`Restoring ${insights.length} sample insights...`)
  for (const insight of insights) {
    try {
      await prisma.insight.upsert({
        where: { slug: insight.slug },
        update: {
          title: insight.title,
          excerpt: insight.excerpt,
          content: insight.content,
          author: insight.author,
          read_time: insight.read_time,
          icon_name: insight.icon_name,
          published: insight.published,
          featured: insight.featured,
          updatedAt: new Date(),
        },
        create: {
          ...insight,
          updatedAt: new Date(),
        },
      })
    } catch (err) {
      console.error(`Failed to restore insight: ${insight.title}`, err)
    }
  }

  // 3. Restore Sample Jobs if needed
  const jobs = [
    {
      title: 'Senior Financial Analyst',
      slug: 'senior-financial-analyst',
      department: 'Finance',
      location: 'Addis Ababa (On-site)',
      type: 'Full-time',
      experience: '5+ years',
      description: 'We are seeking a Senior Financial Analyst to join our team...',
      published: true,
    },
    {
      title: 'Audit Manager',
      slug: 'audit-manager',
      department: 'Audit',
      location: 'Addis Ababa (Hybrid)',
      type: 'Full-time',
      experience: '7+ years',
      description: 'The Audit Manager will oversee internal and external audits...',
      published: true,
    }
  ]

  console.log(`Restoring ${jobs.length} sample jobs...`)
  for (const job of jobs) {
    try {
      await prisma.job.upsert({
        where: { slug: job.slug },
        update: {
          title: job.title,
          department: job.department,
          location: job.location,
          type: job.type,
          experience: job.experience,
          description: job.description,
          published: job.published,
          updatedAt: new Date(),
        },
        create: {
          ...job,
          updatedAt: new Date(),
        },
      })
    } catch (err) {
      console.error(`Failed to restore job: ${job.title}`, err)
    }
  }

  console.log('--- Data Restoration Complete ---')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
