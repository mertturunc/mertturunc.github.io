const { createCanvas, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../../_site/placeholders');
if (!fs.existsSync(placeholdersDir)) {
  fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Function to generate placeholder image
function generatePlaceholderImage(post, outputPath) {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#2c3e50');
  gradient.addColorStop(1, '#34495e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);
  
  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 1200; i += 40) {
    for (let j = 0; j < 630; j += 40) {
      if ((i + j) % 80 === 0) {
        ctx.fillRect(i, j, 20, 20);
      }
    }
  }
  
  // Add main content area
  const contentWidth = 1200 * 0.8;
  const contentHeight = 630 * 0.6;
  const contentX = (1200 - contentWidth) / 2;
  const contentY = (630 - contentHeight) / 2;
  
  // Content background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(contentX, contentY, contentWidth, contentHeight);
  
  // Add border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(contentX, contentY, contentWidth, contentHeight);
  
  // Configure text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Add site name at top
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('Blog', 1200 / 2, contentY + 60);
  
  // Add title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Arial, sans-serif';
  
  // Word wrap for title
  const words = post.title.split(' ');
  const lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > contentWidth - 80) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Draw title lines
  const titleY = contentY + contentHeight / 2;
  const lineHeight = 60;
  const startY = titleY - (lines.length - 1) * lineHeight / 2;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, 1200 / 2, startY + index * lineHeight);
  });
  
  // Add date if available
  if (post.date) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(post.date, 1200 / 2, contentY + contentHeight - 60);
  }
  
  // Add blog indicator
  ctx.fillStyle = '#3498db';
  ctx.fillRect(1200 - 120, 30, 90, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BLOG', 1200 - 75, 45);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(outputPath, buffer);
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
  const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
  
  posts.forEach(postFile => {
    const postPath = path.join(postsDir, postFile);
    const postContent = fs.readFileSync(postPath, 'utf8');
    const frontMatter = parseFrontMatter(postContent);
    
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
    const filename = `${dateStr}-${safeTitle}-placeholder.jpg`;
    const outputPath = path.join(placeholdersDir, filename);
    
    // Generate placeholder
    generatePlaceholderImage({
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
