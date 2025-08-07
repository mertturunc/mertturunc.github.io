const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../../_site/placeholders');
if (!fs.existsSync(placeholdersDir)) {
  fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Function to generate placeholder SVG
function generatePlaceholderSVG(post, outputPath) {
  const title = post.title || 'Blog Post';
  const date = post.date || '';
  
  // Create SVG content
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2c3e50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#34495e;stop-opacity:1" />
    </linearGradient>
    <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="20" height="20" fill="rgba(255,255,255,0.05)"/>
    </pattern>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#pattern)"/>
  
  <!-- Content area -->
  <rect x="120" y="126" width="960" height="378" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="8"/>
  
  <!-- Site name -->
  <text x="600" y="186" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="rgba(255,255,255,0.7)" text-anchor="middle">Blog</text>
  
  <!-- Title -->
  <text x="600" y="315" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
  
  <!-- Date -->
  ${date ? `<text x="600" y="504" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.6)" text-anchor="middle">${date}</text>` : ''}
  
  <!-- Blog indicator -->
  <rect x="1080" y="30" width="90" height="30" fill="#3498db" rx="4"/>
  <text x="1125" y="45" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffffff" text-anchor="middle">BLOG</text>
</svg>`;
  
  fs.writeFileSync(outputPath, svg);
}

// Function to parse front matter
function parseFrontMatter(content) {
  const lines = content.split('\n');
  const frontMatter = {};
  let inFrontMatter = false;
  let frontMatterEnd = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '---') {
      if (!inFrontMatter) {
        inFrontMatter = true;
      } else {
        frontMatterEnd = i;
        break;
      }
    } else if (inFrontMatter && line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
      frontMatter[key.trim()] = value;
    }
  }
  
  return frontMatter;
}

// Function to process blog posts
function processBlogPosts() {
  const postsDir = path.join(__dirname, '../../_posts');
  console.log('Posts directory:', postsDir);
  
  if (!fs.existsSync(postsDir)) {
    console.error('Posts directory does not exist:', postsDir);
    return;
  }
  
  const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  console.log('Found posts:', posts);
  
  posts.forEach(postFile => {
    console.log(`Processing ${postFile}...`);
    const postPath = path.join(postsDir, postFile);
    const postContent = fs.readFileSync(postPath, 'utf8');
    const frontMatter = parseFrontMatter(postContent);
    
    console.log('Front matter:', frontMatter);
    
    // Skip if post has a header image
    if (frontMatter.header) {
      console.log(`Skipping ${postFile} - has header image`);
      return;
    }
    
    // Generate filename
    const safeTitle = frontMatter.title
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase();
    const dateStr = new Date(frontMatter.date || Date.now()).toISOString().split('T')[0];
    const filename = `${dateStr}-${safeTitle}-placeholder.svg`;
    const outputPath = path.join(placeholdersDir, filename);
    
    console.log('Generating placeholder:', filename);
    console.log('Output path:', outputPath);
    
    // Generate placeholder
    generatePlaceholderSVG({
      title: frontMatter.title,
      date: frontMatter.date ? new Date(frontMatter.date).toLocaleDateString() : null
    }, outputPath);
    
    console.log(`Generated placeholder for ${postFile}: ${filename}`);
  });
}

// Run the script
try {
  processBlogPosts();
  console.log('Placeholder generation completed successfully!');
} catch (error) {
  console.error('Error generating placeholders:', error);
  process.exit(1);
}
