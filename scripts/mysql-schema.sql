-- ============================================
-- Blog Posts Table Schema for MySQL
-- ============================================
-- Run this script to create the blog_posts table
-- 
-- Connection example (using mysql2 in Node.js):
-- 
-- import mysql from 'mysql2/promise'
-- const pool = mysql.createPool({
--   host: process.env.MYSQL_HOST,
--   user: process.env.MYSQL_USER,
--   password: process.env.MYSQL_PASSWORD,
--   database: process.env.MYSQL_DATABASE,
-- })

CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) DEFAULT '5 min read',
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_published (published),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Data (Optional)
-- ============================================

INSERT INTO blog_posts (title, slug, excerpt, content, author, read_time, published) VALUES
(
  '5 Financial Metrics Every Ethiopian Business Owner Should Track',
  'financial-metrics-ethiopian-business',
  'Understanding key financial metrics is crucial for business success. Learn about the essential KPIs that can help you make informed decisions and drive growth.',
  '# 5 Financial Metrics Every Ethiopian Business Owner Should Track\n\nFull content here...',
  'Bemnet Abebe',
  '6 min read',
  TRUE
),
(
  'Navigating Tax Compliance in Ethiopia: A 2026 Guide',
  'tax-compliance-ethiopia-2026',
  'Stay ahead of regulatory changes with our comprehensive guide to tax compliance for businesses operating in Ethiopia.',
  '# Navigating Tax Compliance in Ethiopia\n\nFull content here...',
  'Betelhem Desalegn',
  '8 min read',
  TRUE
),
(
  'The Rise of Fintech in East Africa: Opportunities for SMEs',
  'fintech-east-africa-sme',
  'Explore how fintech innovations are creating new opportunities for small and medium enterprises across East Africa.',
  '# The Rise of Fintech in East Africa\n\nFull content here...',
  'Sosina Kebede',
  '5 min read',
  FALSE
);

-- ============================================
-- Insights Table Schema for MySQL
-- ============================================

CREATE TABLE IF NOT EXISTS insights (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content LONGTEXT NOT NULL,
  category ENUM('Market Analysis', 'Research Report', 'Benchmark Data', 'White Paper', 'Trend Report') NOT NULL DEFAULT 'Market Analysis',
  icon_name ENUM('TrendingUp', 'PieChart', 'Target', 'Lightbulb', 'BarChart3', 'FileText') NOT NULL DEFAULT 'FileText',
  author VARCHAR(100) NOT NULL,
  read_time VARCHAR(50) DEFAULT '10 min read',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_published (published),
  INDEX idx_featured (featured),
  INDEX idx_category (category),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Sample Insights Data (Optional)
-- ============================================

INSERT INTO insights (title, slug, excerpt, content, category, icon_name, author, read_time, published, featured) VALUES
(
  'Ethiopian Economic Outlook 2026: Key Trends and Opportunities',
  'ethiopian-economic-outlook-2026',
  'Our comprehensive analysis of Ethiopia''s economic trajectory, examining GDP growth projections, foreign investment trends, and emerging sectors poised for growth in the coming year.',
  '# Ethiopian Economic Outlook 2026\n\nFull content here...',
  'Market Analysis',
  'TrendingUp',
  'Bemnet Abebe',
  '15 min read',
  TRUE,
  TRUE
),
(
  'SME Financing Landscape in Ethiopia',
  'sme-financing-landscape',
  'A deep dive into the current state of SME financing, including bank lending, microfinance, and emerging alternative financing options.',
  '# SME Financing Landscape\n\nFull content here...',
  'Research Report',
  'PieChart',
  'Betelhem Desalegn',
  '12 min read',
  TRUE,
  FALSE
),
(
  'Industry Benchmark: Professional Services Sector',
  'professional-services-benchmark',
  'Comparative analysis of financial performance metrics across Ethiopia''s professional services industry.',
  '# Professional Services Benchmark\n\nFull content here...',
  'Benchmark Data',
  'BarChart3',
  'Bemnet Abebe',
  '10 min read',
  TRUE,
  FALSE
),
(
  'Strategic Planning Framework for Ethiopian Businesses',
  'strategic-planning-framework',
  'A practical framework for developing robust strategic plans tailored to the unique challenges of the Ethiopian market.',
  '# Strategic Planning Framework\n\nFull content here...',
  'White Paper',
  'Target',
  'Bemnet Abebe',
  '18 min read',
  TRUE,
  FALSE
),
(
  'Digital Transformation in Ethiopian Finance Departments',
  'digital-transformation-finance',
  'Insights on how Ethiopian businesses are adopting digital tools to modernize their finance operations.',
  '# Digital Transformation in Finance\n\nFull content here...',
  'Trend Report',
  'Lightbulb',
  'Sosina Kebede',
  '8 min read',
  TRUE,
  FALSE
);
