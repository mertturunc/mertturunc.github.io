const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../../_site/placeholders');
if (!fs.existsSync(placeholdersDir)) {
  fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Function to generate procedural abstract SVG
function generatePlaceholderSVG(post, outputPath) {
  const title = post.title || 'Blog Post';
  
  // Generate a hash from the title for consistent colors
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate colors based on title hash
  const hue1 = Math.abs(hash) % 360;
  const hue2 = (hue1 + 180) % 360;
  const hue3 = (hue1 + 90) % 360;
  
  // Create abstract geometric patterns
  const patterns = [];
  const numShapes = 15 + (Math.abs(hash) % 10);
  
  for (let i = 0; i < numShapes; i++) {
    const x = (hash + i * 73) % 1200;
    const y = (hash + i * 137) % 630;
    const size = 20 + (hash + i * 47) % 80;
    const rotation = (hash + i * 23) % 360;
    const opacity = 0.1 + (hash + i * 17) % 40 / 100;
    
    // Alternate between circles, rectangles, and triangles
    const shapeType = i % 3;
    
    if (shapeType === 0) {
      // Circle
      patterns.push(`<circle cx="${x}" cy="${y}" r="${size/2}" fill="hsl(${hue1}, 70%, 60%)" opacity="${opacity}"/>`);
    } else if (shapeType === 1) {
      // Rectangle
      patterns.push(`<rect x="${x-size/2}" y="${y-size/2}" width="${size}" height="${size}" fill="hsl(${hue2}, 70%, 60%)" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})"/>`);
    } else {
      // Triangle
      const points = `${x},${y-size/2} ${x-size/2},${y+size/2} ${x+size/2},${y+size/2}`;
      patterns.push(`<polygon points="${points}" fill="hsl(${hue3}, 70%, 60%)" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})"/>`);
    }
  }
  
  // Create wave patterns
  const waves = [];
  for (let i = 0; i < 3; i++) {
    const waveY = 200 + i * 150;
    const amplitude = 30 + (hash + i * 53) % 50;
    const frequency = 0.01 + (hash + i * 37) % 20 / 1000;
    const waveColor = `hsl(${(hue1 + i * 60) % 360}, 70%, 60%)`;
    
    let pathData = `M 0 ${waveY}`;
    for (let x = 0; x <= 1200; x += 10) {
      const y = waveY + Math.sin(x * frequency + hash) * amplitude;
      pathData += ` L ${x} ${y}`;
    }
    pathData += ' L 1200 630 L 0 630 Z';
    
    waves.push(`<path d="${pathData}" fill="${waveColor}" opacity="0.3"/>`);
  }
  
  // Create SVG content
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue1}, 20%, 15%);stop-opacity:1" />
      <stop offset="100%" style="stop-color:hsl(${hue2}, 20%, 10%);stop-opacity:1" />
    </linearGradient>
    <radialGradient id="overlay" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:hsl(${hue3}, 30%, 20%);stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:hsl(${hue1}, 20%, 5%);stop-opacity:0.9" />
    </radialGradient>
  </defs>
  
  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  
  <!-- Abstract patterns -->
  ${patterns.join('\n  ')}
  
  <!-- Wave patterns -->
  ${waves.join('\n  ')}
  
  <!-- Overlay gradient -->
  <rect width="1200" height="630" fill="url(#overlay)"/>
  
  <!-- Content area with glass effect -->
  <rect x="100" y="100" width="1000" height="430" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="20" filter="url(#glass)"/>
  
  <!-- Blog indicator -->
  <rect x="1050" y="50" width="100" height="40" fill="hsl(${hue1}, 80%, 60%)" rx="8"/>
  <text x="1100" y="70" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">BLOG</text>
  
  <!-- Subtle title hint -->
  <text x="600" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="rgba(255,255,255,0.3)" text-anchor="middle">${title.substring(0, 40)}${title.length > 40 ? '...' : ''}</text>
  
  <defs>
    <filter id="glass">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.3 0"/>
    </filter>
  </defs>
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
