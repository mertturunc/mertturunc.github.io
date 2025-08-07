'use strict';

const fs = require('fs');
const path = require('path');

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../../_site/placeholders');
try {
  if (!fs.existsSync(placeholdersDir)) {
    fs.mkdirSync(placeholdersDir, { recursive: true });
  }
} catch (error) {
  console.error(`Error creating placeholders directory: ${error.message}`);
  process.exit(1);
}

// Function to generate procedural topographic SVG
function generatePlaceholderSVG(post, outputPath) {
  try {
    const title = post && post.title ? post.title : 'Blog Post';
    
    // Generate a hash from the title for consistent colors
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Generate colors based on title hash - using more traditional topographic map colors
    const baseHue = Math.abs(hash) % 60; // Limit hue to earthy tones (0-60 degrees: red to yellow)
    const bgColor = `hsl(${baseHue + 40}, 30%, 95%)`; // Very light cream/beige background
    const gridColor = `hsl(${baseHue + 40}, 10%, 85%)`; // Subtle grid
    const contourColor = `hsl(${baseHue}, 40%, 35%)`; // Brown contours
    const indexContourColor = `hsl(${baseHue}, 60%, 25%)`; // Darker brown for index contours
    const waterColor = `hsl(200, 70%, 75%)`; // Blue for water features
    const roadColor = `hsl(0, 70%, 45%)`; // Red for roads

    // Generate elevation contour lines - more realistic topographic style
    const contours = [];
    const elevationLevels = 15 + (Math.abs(hash) % 10); // Number of elevation levels
    const contourSpacing = 8; // Spacing between contour lines (elevation step)
    
    // Create a 2D elevation map using Perlin-like noise
    const mapWidth = 1200;
    const mapHeight = 630;
    const elevationMap = [];
    
    // Initialize the elevation map with base values
    for (let y = 0; y < mapHeight; y++) {
      elevationMap[y] = [];
      for (let x = 0; x < mapWidth; x++) {
        // Base elevation using multiple sine waves for natural-looking terrain
        let elevation = 0;
        
        // Use multiple frequencies for natural terrain
        const frequencies = [0.005, 0.01, 0.02, 0.04];
        const amplitudes = [100, 50, 25, 12.5];
        
        for (let f = 0; f < frequencies.length; f++) {
          const freq = frequencies[f];
          const amp = amplitudes[f];
          elevation += Math.sin(x * freq + hash * 0.1) * Math.cos(y * freq + hash * 0.2) * amp;
        }
        
        // Add some randomized terrain features based on hash
        if ((x + y + hash) % 100 < 10) {
          elevation += ((x + y + hash) % 100) * 2;
        }
        
        elevationMap[y][x] = elevation;
      }
    }
    
    // Generate contour lines for each elevation level
    for (let level = 0; level < elevationLevels; level++) {
      const elevationThreshold = level * contourSpacing;
      const isIndex = level % 5 === 0; // Every 5th contour is an index contour
      const strokeWidth = isIndex ? 2 : 0.8;
      const color = isIndex ? indexContourColor : contourColor;
      
      // Find contour segments
      const segments = [];
      
      // Simplified contour finding algorithm - horizontal scan
      for (let y = 0; y < mapHeight; y += 4) { // Step by 4 for performance
        let inSegment = false;
        let currentSegment = '';
        
        for (let x = 0; x < mapWidth; x += 4) { // Step by 4 for performance
          const elevation = elevationMap[y][x];
          
          if (Math.abs(elevation - elevationThreshold) < 2) {
            // We're on a contour line
            if (!inSegment) {
              inSegment = true;
              currentSegment = `M ${x} ${y}`;
            } else {
              currentSegment += ` L ${x} ${y}`;
            }
          } else if (inSegment) {
            // End of a segment
            inSegment = false;
            segments.push(currentSegment);
            currentSegment = '';
          }
        }
        
        // Don't forget the last segment in a row
        if (inSegment) {
          segments.push(currentSegment);
        }
      }
      
      // Add all segments for this contour level
      segments.forEach(segment => {
        contours.push(`<path d="${segment}" stroke="${color}" stroke-width="${strokeWidth}" fill="none"/>`);
      });
    }
  
    // Generate grid (UTM/coordinate grid common in topo maps)
    const gridLines = [];
    const gridSpacing = 100; // Wider spacing for topo map look
    
    // Vertical grid lines
    for (let x = 0; x <= 1200; x += gridSpacing) {
      gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="${gridColor}" stroke-width="0.5" opacity="0.4"/>`);
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= 630; y += gridSpacing) {
      gridLines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${gridColor}" stroke-width="0.5" opacity="0.4"/>`);
    }
    
    // Add coordinate labels at grid intersections
    const labels = [];
    for (let x = gridSpacing; x < 1200; x += gridSpacing) {
      for (let y = gridSpacing; y < 630; y += gridSpacing) {
        // Generate coordinate-like labels based on position and hash
        const eastingLabel = Math.floor(((x / 1200) * 5) + (hash % 30)) * 100;
        const northingLabel = Math.floor(((y / 630) * 5) + ((hash >> 8) % 40)) * 100;
        
        // Only add labels at some intersections to avoid clutter
        if ((x + y + hash) % 300 < 100) {
          labels.push(`<text x="${x + 5}" y="${y - 5}" fill="${indexContourColor}" font-size="8" font-family="monospace">${eastingLabel}E ${northingLabel}N</text>`);
        }
      }
    }
  
    // Generate feature lines (like rivers, roads, trails)
    const features = [];
    
    // Generate a river (blue, meandering line)
    const riverSeed = hash + 137;
    let riverPath = `M ${riverSeed % 300} 0`; // Start from top edge
    let riverX = riverSeed % 300;
    let riverY = 0;
    
    // Create a meandering river path
    while (riverY < 630) {
      // Rivers tend to flow downward with some meandering
      riverY += 10 + (Math.sin(riverY * 0.05 + riverSeed) * 5);
      riverX += Math.sin(riverY * 0.03 + riverSeed) * 15;
      
      // Keep river within bounds
      riverX = Math.max(0, Math.min(1200, riverX));
      
      riverPath += ` L ${riverX} ${riverY}`;
      
      // Occasionally create a tributary
      if (riverY % 100 < 10 && riverY > 100) {
        const tributaryLength = 50 + (riverSeed % 100);
        let tribX = riverX;
        let tribY = riverY;
        let tributaryPath = `M ${tribX} ${tribY}`;
        
        for (let t = 0; t < tributaryLength; t += 10) {
          tribX += (Math.sin(t * 0.1 + riverSeed) * 10) - 5;
          tribY += (Math.sin(t * 0.2 + riverSeed) * 6) - 3;
          tributaryPath += ` L ${tribX} ${tribY}`;
        }
        
        features.push(`<path d="${tributaryPath}" stroke="${waterColor}" stroke-width="1.5" fill="none" opacity="0.7"/>`);
      }
    }
    
    features.push(`<path d="${riverPath}" stroke="${waterColor}" stroke-width="3" fill="none" opacity="0.8"/>`);
    
    // Add a road (red line with consistent style)
    const roadSeed = hash + 257;
    let roadPath = `M 0 ${200 + (roadSeed % 200)}`;
    
    // Create a winding road that follows terrain somewhat
    for (let x = 0; x <= 1200; x += 20) {
      // Roads tend to have smoother curves than rivers
      const y = 200 + (roadSeed % 200) +
                Math.sin(x * 0.002 + roadSeed) * 100 +
                Math.sin(x * 0.0005 + roadSeed * 0.3) * 50;
      roadPath += ` L ${x} ${y}`;
      
      // Occasionally add small side roads
      if (x % 200 < 20 && x > 100 && x < 1000) {
        const sideRoadLength = 30 + (roadSeed % 50);
        const angle = (roadSeed + x) % 360 * (Math.PI / 180);
        let sideX = x;
        let sideY = y;
        let sideRoadPath = `M ${sideX} ${sideY}`;
        
        for (let s = 0; s < sideRoadLength; s += 5) {
          sideX += Math.cos(angle) * 5;
          sideY += Math.sin(angle) * 5;
          sideRoadPath += ` L ${sideX} ${sideY}`;
        }
        
        features.push(`<path d="${sideRoadPath}" stroke="${roadColor}" stroke-width="1.5" fill="none" stroke-dasharray="5,2" opacity="0.7"/>`);
      }
    }
    
    features.push(`<path d="${roadPath}" stroke="${roadColor}" stroke-width="2.5" fill="none" opacity="0.8"/>`);
    
    // Add hiking trails (dotted lines)
    const trailSeed = hash + 373;
    let trailPath = `M ${trailSeed % 1000} 0`;
    
    // Create a winding trail
    for (let y = 0; y <= 630; y += 15) {
      const x = (trailSeed % 1000) +
                Math.sin(y * 0.01 + trailSeed) * 100 +
                Math.sin(y * 0.03 + trailSeed * 0.7) * 50;
      trailPath += ` L ${x} ${y}`;
    }
    
    features.push(`<path d="${trailPath}" stroke="${indexContourColor}" stroke-width="1" fill="none" stroke-dasharray="2,4" opacity="0.7"/>`);
  
    // Add topographic map symbols
    const symbols = [];
    
    // Add mountain peaks with elevation markers
    const numPeaks = 2 + (Math.abs(hash) % 3);
    for (let p = 0; p < numPeaks; p++) {
      const peakSeed = hash + p * 97;
      const peakX = 200 + (peakSeed % 800);
      const peakY = 150 + (peakSeed % 300);
      
      // Triangle symbol for peak
      const triangleSize = 8;
      const trianglePoints = `${peakX},${peakY-triangleSize} ${peakX-triangleSize},${peakY+triangleSize} ${peakX+triangleSize},${peakY+triangleSize}`;
      
      // Generate an elevation number
      const elevation = 1000 + (peakSeed % 3000);
      
      symbols.push(`<polygon points="${trianglePoints}" fill="${indexContourColor}" stroke="none"/>`);
      symbols.push(`<text x="${peakX + 10}" y="${peakY}" fill="${indexContourColor}" font-size="8" font-family="monospace">${elevation}m</text>`);
    }
    
    // Add some vegetation symbols
    const numVegPatches = 5 + (Math.abs(hash) % 10);
    for (let v = 0; v < numVegPatches; v++) {
      const vegSeed = hash + v * 123;
      const centerX = 100 + (vegSeed % 1000);
      const centerY = 100 + (vegSeed % 430);
      const patchSize = 30 + (vegSeed % 50);
      
      // Create a cluster of small circles representing vegetation
      for (let i = 0; i < 10; i++) {
        const offsetX = (vegSeed + i * 7) % patchSize - (patchSize / 2);
        const offsetY = (vegSeed + i * 13) % patchSize - (patchSize / 2);
        const dotSize = 1 + (i % 2);
        
        symbols.push(`<circle cx="${centerX + offsetX}" cy="${centerY + offsetY}" r="${dotSize}" fill="green" opacity="0.5"/>`);
      }
    }
    
    // Add some settlement markers
    const numSettlements = 1 + (Math.abs(hash) % 3);
    for (let s = 0; s < numSettlements; s++) {
      const settleSeed = hash + s * 211;
      const settleX = 300 + (settleSeed % 600);
      const settleY = 200 + (settleSeed % 200);
      
      // Square symbol for settlement
      symbols.push(`<rect x="${settleX-4}" y="${settleY-4}" width="8" height="8" fill="${roadColor}" stroke="none"/>`);
      
      // Settlement name
      const settlementNames = ['Hillcrest', 'Riverdale', 'Oakwood', 'Pineville', 'Meadowbrook', 'Lakeview'];
      const nameIndex = settleSeed % settlementNames.length;
      
      symbols.push(`<text x="${settleX + 10}" y="${settleY + 4}" fill="${indexContourColor}" font-size="10" font-family="serif">${settlementNames[nameIndex]}</text>`);
    }
    
    // Add a compass rose
    const compassX = 1100;
    const compassY = 550;
    const compassSize = 40;
    
    symbols.push(`<circle cx="${compassX}" cy="${compassY}" r="${compassSize}" fill="none" stroke="${indexContourColor}" stroke-width="1"/>`);
    symbols.push(`<line x1="${compassX}" y1="${compassY-compassSize}" x2="${compassX}" y2="${compassY+compassSize}" stroke="${indexContourColor}" stroke-width="1"/>`);
    symbols.push(`<line x1="${compassX-compassSize}" y1="${compassY}" x2="${compassX+compassSize}" y2="${compassY}" stroke="${indexContourColor}" stroke-width="1"/>`);
    symbols.push(`<text x="${compassX}" y="${compassY-compassSize-5}" text-anchor="middle" fill="${indexContourColor}" font-size="12" font-family="serif">N</text>`);
    symbols.push(`<text x="${compassX+compassSize+5}" y="${compassY}" text-anchor="start" fill="${indexContourColor}" font-size="12" font-family="serif">E</text>`);
    symbols.push(`<text x="${compassX}" y="${compassY+compassSize+12}" text-anchor="middle" fill="${indexContourColor}" font-size="12" font-family="serif">S</text>`);
    symbols.push(`<text x="${compassX-compassSize-5}" y="${compassY}" text-anchor="end" fill="${indexContourColor}" font-size="12" font-family="serif">W</text>`);
  
    // Create SVG content with title
    const mapTitle = post.title || 'Topographic Map';
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="${bgColor}"/>
  
  <!-- Map border -->
  <rect x="10" y="10" width="1180" height="610" fill="none" stroke="${indexContourColor}" stroke-width="2"/>
  
  <!-- Grid -->
  ${gridLines.join('\n  ')}
  
  <!-- Grid labels -->
  ${labels.join('\n  ')}
  
  <!-- Contour lines -->
  ${contours.join('\n  ')}
  
  <!-- Feature lines (rivers, roads, trails) -->
  ${features.join('\n  ')}
  
  <!-- Map symbols -->
  ${symbols.join('\n  ')}
  
  <!-- Title -->
  <rect x="400" y="20" width="400" height="40" fill="${bgColor}" stroke="${indexContourColor}" stroke-width="1"/>
  <text x="600" y="45" text-anchor="middle" fill="${indexContourColor}" font-size="16" font-family="serif">${mapTitle}</text>
  
  <!-- Scale bar -->
  <line x1="50" y1="580" x2="250" y2="580" stroke="${indexContourColor}" stroke-width="2"/>
  <line x1="50" y1="575" x2="50" y2="585" stroke="${indexContourColor}" stroke-width="2"/>
  <line x1="150" y1="575" x2="150" y2="585" stroke="${indexContourColor}" stroke-width="2"/>
  <line x1="250" y1="575" x2="250" y2="585" stroke="${indexContourColor}" stroke-width="2"/>
  <text x="150" y="570" text-anchor="middle" fill="${indexContourColor}" font-size="10" font-family="monospace">5 km</text>
</svg>`;
  
      try {
      fs.writeFileSync(outputPath, svg);
    } catch (writeError) {
      console.error(`Error writing SVG file to ${outputPath}: ${writeError.message}`);
    }
  } catch (error) {
    console.error(`Error generating SVG for ${post && post.title ? post.title : 'unknown post'}: ${error.message}`);
  }
}

// Function to parse front matter
function parseFrontMatter(content) {
  if (!content || typeof content !== 'string') {
    console.warn('Invalid content provided to parseFrontMatter');
    return {};
  }

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
      try {
        const [key, ...valueParts] = line.split(':');
        if (key) {
          const value = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
          frontMatter[key.trim()] = value;
        }
      } catch (err) {
        console.warn(`Error parsing front matter line: ${line}`);
      }
    }
  }
  
  return frontMatter;
}

// Function to process blog posts
function processBlogPosts() {
  try {
    const postsDir = path.join(__dirname, '../../_posts');
    console.log('Posts directory:', postsDir);
    
    if (!fs.existsSync(postsDir)) {
      console.error('Posts directory does not exist:', postsDir);
      return;
    }
    
    const posts = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    console.log(`Found ${posts.length} posts`);
    
    posts.forEach(postFile => {
      try {
        console.log(`Processing ${postFile}...`);
        const postPath = path.join(postsDir, postFile);
        
        // Safely read file
        let postContent;
        try {
          postContent = fs.readFileSync(postPath, 'utf8');
        } catch (readError) {
          console.error(`Error reading ${postFile}: ${readError.message}`);
          return;
        }
        
        const frontMatter = parseFrontMatter(postContent);
        
        // Skip if post has a header image
        if (frontMatter.header) {
          console.log(`Skipping ${postFile} - has header image`);
          return;
        }
        
        // Skip if post has no title
        if (!frontMatter.title) {
          console.warn(`Skipping ${postFile} - no title found in front matter`);
          return;
        }
        
        // Generate filename using the post slug from translations URL
        let postSlug = null;
        
        // Try to extract slug from translations
        if (frontMatter.translations) {
          try {
            const translations = Array.isArray(frontMatter.translations) 
              ? frontMatter.translations 
              : JSON.parse(frontMatter.translations);
            
            // Find the Turkish translation URL
            const turkishTranslation = translations.find(t => t && t.lang === 'tr');
            if (turkishTranslation && turkishTranslation.url) {
              // Extract slug from URL like "/blog/docker-ile-osrm-kurulumu/"
              const urlParts = turkishTranslation.url.split('/').filter(Boolean);
              postSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2]; // Get the last non-empty part
            }
          } catch (parseError) {
            console.warn(`Error parsing translations for ${postFile}: ${parseError.message}`);
          }
        }
        
        // Fallback: generate slug from title if no translation found
        if (!postSlug && frontMatter.title) {
          postSlug = frontMatter.title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        }
        
        // Final fallback: use filename without extension
        if (!postSlug) {
          postSlug = postFile.replace(/\.md$/, '');
        }
        
        const filename = `${postSlug}-placeholder.svg`;
        const outputPath = path.join(placeholdersDir, filename);
        
        console.log('Generating placeholder:', filename);
        
        // Generate placeholder
        generatePlaceholderSVG({
          title: frontMatter.title || postFile,
          date: frontMatter.date ? new Date(frontMatter.date).toLocaleDateString() : null
        }, outputPath);
        
        console.log(`Generated placeholder for ${postFile}: ${filename}`);
      } catch (postError) {
        console.error(`Error processing post ${postFile}: ${postError.message}`);
      }
    });
  } catch (error) {
    console.error(`Error in processBlogPosts: ${error.message}`);
  }
}

// Run the script
try {
  processBlogPosts();
  console.log('Placeholder generation completed successfully!');
} catch (error) {
  console.error('Error generating placeholders:', error);
  process.exit(1);
}
