const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../../_site/placeholders');
if (!fs.existsSync(placeholdersDir)) {
  fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Function to generate procedural topographic SVG
function generatePlaceholderSVG(post, outputPath) {
  const title = post.title || 'Blog Post';
  
  // Generate a hash from the title for consistent colors
  const hash = title.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate colors based on title hash
  const baseHue = Math.abs(hash) % 360;
  const bgColor = `hsl(${baseHue}, 15%, 85%)`; // Light background
  const gridColor = `hsl(${baseHue}, 20%, 75%)`; // Slightly darker grid
  const contourColor = `hsl(${(baseHue + 180) % 360}, 40%, 35%)`; // Dark brown contours
  const indexContourColor = `hsl(${(baseHue + 180) % 360}, 50%, 25%)`; // Darker index contours
  const featureColor1 = `hsl(${(baseHue + 60) % 360}, 70%, 45%)`; // Red-like feature
  const featureColor2 = `hsl(${(baseHue + 240) % 360}, 30%, 20%)`; // Black-like feature
  
  // Generate contour lines
  const contours = [];
  const numContours = 25 + (Math.abs(hash) % 15);
  
  for (let i = 0; i < numContours; i++) {
    const seed = hash + i * 73;
    const amplitude = 50 + (seed % 100);
    const frequency = 0.005 + (seed % 20) / 2000;
    const phase = seed % 628; // 2*PI
    const isIndex = i % 5 === 0; // Every 5th contour is an index contour
    
    let pathData = `M 0 ${200 + i * 15}`;
    for (let x = 0; x <= 1200; x += 5) {
      const y = 200 + i * 15 + Math.sin(x * frequency + phase) * amplitude + 
                Math.sin(x * frequency * 0.3 + phase * 0.7) * amplitude * 0.5;
      pathData += ` L ${x} ${y}`;
    }
    
    const strokeWidth = isIndex ? 2 : 1;
    const color = isIndex ? indexContourColor : contourColor;
    contours.push(`<path d="${pathData}" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`);
  }
  
  // Generate grid
  const gridLines = [];
  const gridSpacing = 50;
  
  // Vertical grid lines
  for (let x = 0; x <= 1200; x += gridSpacing) {
    gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="${gridColor}" stroke-width="0.5" opacity="0.6"/>`);
  }
  
  // Horizontal grid lines
  for (let y = 0; y <= 630; y += gridSpacing) {
    gridLines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${gridColor}" stroke-width="0.5" opacity="0.6"/>`);
  }
  
  // Generate feature lines (like rivers, roads, boundaries)
  const features = [];
  
  // Dashed-dot feature line (like the red line in example)
  const feature1Seed = hash + 137;
  let feature1Path = `M 0 ${150 + (feature1Seed % 100)}`;
  for (let x = 0; x <= 1200; x += 10) {
    const y = 150 + (feature1Seed % 100) + 
              Math.sin(x * 0.003 + feature1Seed) * 80 +
              Math.sin(x * 0.001 + feature1Seed * 0.5) * 40;
    feature1Path += ` L ${x} ${y}`;
  }
  features.push(`<path d="${feature1Path}" stroke="${featureColor1}" stroke-width="3" fill="none" stroke-dasharray="15,5,3,5" opacity="0.8"/>`);
  
  // Solid feature line (like the black line in example)
  const feature2Seed = hash + 257;
  let feature2Path = `M 600 ${50 + (feature2Seed % 50)}`;
  for (let x = 0; x <= 1200; x += 8) {
    const y = 50 + (feature2Seed % 50) + 
              Math.sin(x * 0.004 + feature2Seed) * 60 +
              Math.sin(x * 0.002 + feature2Seed * 0.3) * 30;
    feature2Path += ` L ${x} ${y}`;
  }
  features.push(`<path d="${feature2Path}" stroke="${featureColor2}" stroke-width="2" fill="none" opacity="0.9"/>`);
  
  // Dotted feature line
  const feature3Seed = hash + 373;
  let feature3Path = `M 200 ${100 + (feature3Seed % 80)}`;
  for (let x = 0; x <= 1200; x += 12) {
    const y = 100 + (feature3Seed % 80) + 
              Math.sin(x * 0.005 + feature3Seed) * 50 +
              Math.sin(x * 0.0015 + feature3Seed * 0.4) * 25;
    feature3Path += ` L ${x} ${y}`;
  }
  features.push(`<path d="${feature3Path}" stroke="${featureColor2}" stroke-width="1" fill="none" stroke-dasharray="2,4" opacity="0.7"/>`);
  
  // Generate concentric contour patterns (hills/peaks)
  const peaks = [];
  const numPeaks = 3 + (Math.abs(hash) % 4);
  
  for (let p = 0; p < numPeaks; p++) {
    const peakSeed = hash + p * 97;
    const centerX = 200 + (peakSeed % 800);
    const centerY = 150 + (peakSeed % 300);
    const maxRadius = 80 + (peakSeed % 60);
    
    for (let r = 10; r <= maxRadius; r += 8) {
      const points = [];
      const numPoints = 20;
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const radius = r + Math.sin(angle * 3 + peakSeed) * 5;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        points.push(`${x},${y}`);
      }
      const isIndexPeak = r % 24 === 0;
      const strokeWidth = isIndexPeak ? 2 : 1;
      const color = isIndexPeak ? indexContourColor : contourColor;
      peaks.push(`<polygon points="${points.join(' ')}" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`);
    }
  }
  
  // Create SVG content
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${bgColor}"/>
  
  <!-- Grid -->
  ${gridLines.join('\n  ')}
  
  <!-- Contour lines -->
  ${contours.join('\n  ')}
  
  <!-- Peak patterns -->
  ${peaks.join('\n  ')}
  
  <!-- Feature lines -->
  ${features.join('\n  ')}
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
    
    // Generate filename using the post filename (without .md extension)
    const postFilename = postFile.replace('.md', '');
    const filename = `${postFilename}-placeholder.svg`;
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
