import { Insight, CreateInsight, UpdateInsight } from "@/lib/types/insight"

// ===========================================
// MOCK DATA - Replace with MySQL queries
// ===========================================

let mockInsights: Insight[] = [
  {
    id: 1,
    title: "Ethiopian Economic Outlook 2026: Key Trends and Opportunities",
    slug: "ethiopian-economic-outlook-2026",
    excerpt:
      "Our comprehensive analysis of Ethiopia's economic trajectory, examining GDP growth projections, foreign investment trends, and emerging sectors poised for growth in the coming year.",
    content: `# Ethiopian Economic Outlook 2026

Ethiopia's economy is poised for significant transformation in 2026 as the nation continues its structural reforms and development initiatives.

## GDP Growth Projections

The IMF projects Ethiopia's real GDP growth at 6.2% in 2026, driven by:

- Agricultural productivity improvements
- Manufacturing sector expansion
- Service sector growth, particularly in telecommunications and finance

## Foreign Direct Investment Trends

### Key Sectors Attracting Investment
- Light manufacturing and textiles
- Agricultural processing and value addition
- Digital infrastructure and fintech
- Renewable energy projects

### Investment Climate Improvements
The government's recent policy reforms have created a more favorable environment for foreign investors, with streamlined business registration and improved infrastructure.

## Emerging Growth Sectors

## 1. Digital Economy
The digital sector is experiencing exponential growth, with e-commerce platforms and digital payment systems expanding rapidly.

## 2. Renewable Energy
Ethiopia's renewable energy potential remains largely untapped, with significant opportunities in solar and wind projects.

## 3. Tourism and Hospitality
As international travel increases, the tourism sector presents substantial growth opportunities.

## Challenges and Opportunities

While growth prospects are positive, businesses should be aware of:
- Exchange rate volatility
- Ongoing infrastructure development needs
- Regional security considerations

## Recommendations

Businesses should focus on sectors aligned with government priorities while maintaining prudent risk management practices.`,
    category: "Market Analysis",
    icon_name: "TrendingUp",
    author: "Bemnet Abebe",
    read_time: "15 min read",
    published: true,
    featured: true,
    created_at: "2026-01-12T00:00:00Z",
    updated_at: "2026-01-12T00:00:00Z",
  },
  {
    id: 2,
    title: "SME Financing Landscape in Ethiopia",
    slug: "sme-financing-landscape",
    excerpt:
      "A deep dive into the current state of SME financing, including bank lending, microfinance, and emerging alternative financing options.",
    content: `# SME Financing Landscape in Ethiopia

Small and medium enterprises are the backbone of Ethiopia's economy, yet access to financing remains a significant challenge.

## Current Financing Options

### Traditional Bank Lending
Commercial banks provide loans but often require substantial collateral and have lengthy approval processes.

### Microfinance Institutions
MFIs offer more accessible financing but typically for smaller loan amounts with higher interest rates.

### Government Programs
The government has launched several initiatives to support SME financing, including subsidized lending programs.

## Emerging Alternative Financing

## Crowdfunding
Online crowdfunding platforms are beginning to emerge, offering businesses direct access to capital from investors.

## Supply Chain Financing
Suppliers and customers increasingly work together to optimize cash flow through financing arrangements.

## Digital Lending Platforms
Fintech companies are using alternative credit assessment methods to serve previously underbanked businesses.

## Key Challenges

- High interest rates limiting affordability
- Complex application procedures
- Insufficient understanding of financing options among entrepreneurs
- Limited collateral options for service-based businesses

## Recommendations for SMEs

- Develop strong financial records to improve access to formal financing
- Explore multiple financing sources to reduce dependence on single lender
- Engage with industry associations for group lending opportunities`,
    category: "Research Report",
    icon_name: "PieChart",
    author: "Betelhem Desalegn",
    read_time: "12 min read",
    published: true,
    featured: false,
    created_at: "2026-01-08T00:00:00Z",
    updated_at: "2026-01-08T00:00:00Z",
  },
  {
    id: 3,
    title: "Industry Benchmark: Professional Services Sector",
    slug: "professional-services-benchmark",
    excerpt:
      "Comparative analysis of financial performance metrics across Ethiopia's professional services industry.",
    content: `# Industry Benchmark: Professional Services Sector

This comprehensive benchmark study analyzes financial performance across Ethiopia's professional services industry.

## Study Scope

We analyzed financial data from 150+ professional services firms operating in:
- Accounting and auditing
- Legal services
- Management consulting
- Engineering services

## Key Performance Metrics

### Revenue Growth
Average annual revenue growth of 12-15% across the sector, with consulting firms showing highest growth rates.

### Profitability Ratios
- Average net profit margin: 18-22%
- Operating margin: 25-30%
- Return on assets: 15-18%

### Operational Efficiency
- Staff utilization rates: 65-70%
- Average realization rates: 75-80%
- Cost of revenue as % of sales: 35-40%

## Sector Trends

## Digital Service Adoption
Firms are increasingly investing in digital tools, resulting in improved efficiency and client satisfaction.

## Talent Retention Challenges
Competition for skilled professionals remains intense, driving up compensation costs.

## Client Consolidation
Larger clients are consolidating their service provider base, favoring firms with diverse capabilities.

## Industry Outlook

The professional services sector in Ethiopia is expected to grow 14-16% annually over the next 3 years, driven by:
- Economic growth and business expansion
- Increased regulatory complexity
- Growing corporate governance requirements`,
    category: "Benchmark Data",
    icon_name: "BarChart3",
    author: "Bemnet Abebe",
    read_time: "10 min read",
    published: true,
    featured: false,
    created_at: "2026-01-03T00:00:00Z",
    updated_at: "2026-01-03T00:00:00Z",
  },
  {
    id: 4,
    title: "Strategic Planning Framework for Ethiopian Businesses",
    slug: "strategic-planning-framework",
    excerpt:
      "A practical framework for developing robust strategic plans tailored to the unique challenges of the Ethiopian market.",
    content: `# Strategic Planning Framework for Ethiopian Businesses

Effective strategic planning requires understanding the unique operating environment of Ethiopia's business landscape.

## The Strategic Planning Process

### Phase 1: Situation Analysis
- Assess current organizational strengths and weaknesses
- Analyze competitive landscape and market dynamics
- Evaluate external opportunities and threats specific to Ethiopia

### Phase 2: Vision and Mission Development
- Define long-term aspirations (5-10 year vision)
- Establish clear organizational mission
- Set guiding principles and values

### Phase 3: Strategy Formulation
- Identify strategic objectives aligned with vision
- Determine competitive positioning
- Define key strategic initiatives

### Phase 4: Implementation Planning
- Break strategies into specific action plans
- Allocate resources and responsibilities
- Establish timelines and milestones

### Phase 5: Monitoring and Adjustment
- Track progress against KPIs
- Regular strategy reviews (quarterly/annual)
- Adjust plans based on market changes

## Unique Considerations for Ethiopia

## Market Dynamics
- Rapidly changing business environment
- Government policy evolution
- Emerging competitive landscape

## Operational Factors
- Infrastructure development status
- Regulatory compliance requirements
- Access to skilled talent

## Financial Considerations
- Exchange rate volatility
- Access to financing
- Working capital management

## Implementation Success Factors

1. Executive commitment and buy-in
2. Clear communication across organization
3. Regular monitoring and adjustment
4. Cross-functional collaboration
5. External stakeholder engagement`,
    category: "White Paper",
    icon_name: "Target",
    author: "Bemnet Abebe",
    read_time: "18 min read",
    published: true,
    featured: false,
    created_at: "2025-12-22T00:00:00Z",
    updated_at: "2025-12-22T00:00:00Z",
  },
  {
    id: 5,
    title: "Digital Transformation in Ethiopian Finance Departments",
    slug: "digital-transformation-finance",
    excerpt:
      "Insights on how Ethiopian businesses are adopting digital tools to modernize their finance operations.",
    content: `# Digital Transformation in Ethiopian Finance Departments

Ethiopian businesses are increasingly recognizing the strategic value of digital transformation in finance operations.

## Current State of Digital Adoption

### Early Adopters (15-20%)
- Advanced ERP systems implementation
- Cloud-based financial management
- Automated reporting and analytics

### Active Implementers (35-40%)
- Migrating to modern accounting software
- Beginning data analytics initiatives
- Improving financial processes

### Traditional Operators (40-45%)
- Reliance on spreadsheet-based systems
- Manual transaction processing
- Limited data integration

## Key Digital Technologies

## Cloud-Based Solutions
Moving financial data to cloud platforms provides flexibility, scalability, and improved access.

## Data Analytics and BI
Advanced analytics enable better financial insights and informed decision-making.

## Automation Tools
RPA (Robotic Process Automation) streamlines repetitive financial tasks, reducing errors and costs.

## Digital Payments
Modern payment systems improve cash flow visibility and operational efficiency.

## Implementation Challenges

- Initial investment requirements
- Staff training and change management
- Integration with legacy systems
- Data security and compliance concerns

## Success Factors for Digital Transformation

1. Clear business case and ROI expectations
2. Executive leadership commitment
3. Comprehensive change management
4. Phased implementation approach
5. Continuous training and support
6. Regular technology assessment and updates`,
    category: "Trend Report",
    icon_name: "Lightbulb",
    author: "Sosina Kebede",
    read_time: "8 min read",
    published: true,
    featured: false,
    created_at: "2025-12-15T00:00:00Z",
    updated_at: "2025-12-15T00:00:00Z",
  },
]

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

// ===========================================
// SERVICE FUNCTIONS
// ===========================================

/**
 * Get all insights (for admin)
 * MySQL: SELECT * FROM insights ORDER BY created_at DESC
 */
export async function getAllInsights(): Promise<Insight[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...mockInsights].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

/**
 * Get published insights only (for public page)
 * MySQL: SELECT * FROM insights WHERE published = true ORDER BY created_at DESC
 */
export async function getPublishedInsights(): Promise<Insight[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockInsights
    .filter((insight) => insight.published)
    .sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
}

/**
 * Get featured insight (for hero section)
 * MySQL: SELECT * FROM insights WHERE published = true AND featured = true ORDER BY created_at DESC LIMIT 1
 */
export async function getFeaturedInsight(): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  const featured = mockInsights.find((insight) => insight.published && insight.featured)
  return featured || null
}

/**
 * Get insight by slug
 * MySQL: SELECT * FROM insights WHERE slug = ? AND published = true
 */
export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockInsights.find((insight) => insight.slug === slug && insight.published) || null
}

/**
 * Get insight by ID (for admin editing)
 * MySQL: SELECT * FROM insights WHERE id = ?
 */
export async function getInsightById(id: number): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return mockInsights.find((insight) => insight.id === id) || null
}

/**
 * Create new insight
 * MySQL: INSERT INTO insights (title, slug, excerpt, content, category, icon_name, author, read_time, published, featured, created_at, updated_at)
 *        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
 */
export async function createInsight(data: CreateInsight): Promise<Insight> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newInsight: Insight = {
    id: Math.max(...mockInsights.map((i) => i.id), 0) + 1,
    ...data,
    slug: generateSlug(data.title),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  // If setting as featured, unfeature others
  if (data.featured) {
    mockInsights = mockInsights.map((i) => ({ ...i, featured: false }))
  }

  mockInsights.push(newInsight)
  return newInsight
}

/**
 * Update insight
 * MySQL: UPDATE insights SET title = ?, slug = ?, excerpt = ?, content = ?, category = ?, icon_name = ?, author = ?, read_time = ?, published = ?, featured = ?, updated_at = NOW() WHERE id = ?
 */
export async function updateInsight(id: number, data: UpdateInsight): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = mockInsights.findIndex((insight) => insight.id === id)
  if (index === -1) return null

  // If setting as featured, unfeature others
  if (data.featured) {
    mockInsights = mockInsights.map((i) =>
      i.id === id ? i : { ...i, featured: false }
    )
  }

  const updatedInsight: Insight = {
    ...mockInsights[index],
    ...data,
    slug: data.title ? generateSlug(data.title) : mockInsights[index].slug,
    updated_at: new Date().toISOString(),
  }

  mockInsights[index] = updatedInsight
  return updatedInsight
}

/**
 * Delete insight
 * MySQL: DELETE FROM insights WHERE id = ?
 */
export async function deleteInsight(id: number): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const index = mockInsights.findIndex((insight) => insight.id === id)
  if (index === -1) return false

  mockInsights.splice(index, 1)
  return true
}

/**
 * Toggle publish status
 * MySQL: UPDATE insights SET published = NOT published, updated_at = NOW() WHERE id = ?
 */
export async function toggleInsightPublish(id: number): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const insight = mockInsights.find((i) => i.id === id)
  if (!insight) return null

  insight.published = !insight.published
  insight.updated_at = new Date().toISOString()
  return insight
}

/**
 * Toggle featured status
 * MySQL: UPDATE insights SET featured = CASE WHEN id = ? THEN NOT featured ELSE false END, updated_at = NOW()
 */
export async function toggleInsightFeatured(id: number): Promise<Insight | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const insight = mockInsights.find((i) => i.id === id)
  if (!insight) return null

  // If making featured, unfeature all others
  if (!insight.featured) {
    mockInsights = mockInsights.map((i) => ({ ...i, featured: false }))
  }

  insight.featured = !insight.featured
  insight.updated_at = new Date().toISOString()
  return insight
}

/**
 * Get insight stats for admin dashboard
 * MySQL: SELECT COUNT(*) as total, SUM(published) as published, SUM(NOT published) as drafts, SUM(featured) as featured FROM insights
 */
export async function getInsightStats(): Promise<{
  total: number
  published: number
  drafts: number
  featured: number
}> {
  await new Promise((resolve) => setTimeout(resolve, 200))

  return {
    total: mockInsights.length,
    published: mockInsights.filter((i) => i.published).length,
    drafts: mockInsights.filter((i) => !i.published).length,
    featured: mockInsights.filter((i) => i.featured).length,
  }
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
