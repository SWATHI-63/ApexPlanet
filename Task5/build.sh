#!/bin/bash

# TechSphere Web Application - Production Build Script
# This script optimizes the application for production deployment

echo "🚀 Starting TechSphere production build..."

# Create directories
mkdir -p dist
mkdir -p reports

# Copy HTML file
echo "📄 Processing HTML files..."
cp index.html dist/

# Minify CSS
echo "🎨 Minifying CSS..."
if command -v cleancss &> /dev/null; then
    cleancss -o dist/style.min.css style.css
    echo "✅ CSS minified successfully"
else
    echo "⚠️  clean-css not found, copying original CSS"
    cp style.css dist/
fi

# Minify JavaScript
echo "⚡ Minifying JavaScript..."
if command -v terser &> /dev/null; then
    terser script.js -o dist/script.min.js -c -m
    echo "✅ JavaScript minified successfully"
else
    echo "⚠️  terser not found, copying original JavaScript"
    cp script.js dist/
fi

# Copy additional files
echo "📋 Copying additional files..."
cp manifest.json dist/
cp sw.js dist/
cp README.md dist/

# Update HTML references to minified files
if [ -f dist/style.min.css ] && [ -f dist/script.min.js ]; then
    echo "🔄 Updating file references in HTML..."
    sed -i 's/style\.css/style.min.css/g' dist/index.html
    sed -i 's/script\.js/script.min.js/g' dist/index.html
    echo "✅ File references updated"
fi

# Generate sitemap
echo "🗺️  Generating sitemap..."
cat > dist/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://your-domain.com/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#about</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#services</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#products</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#contact</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
EOF

# Generate robots.txt
echo "🤖 Generating robots.txt..."
cat > dist/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
EOF

# Generate .htaccess for Apache servers
echo "⚙️  Generating .htaccess..."
cat > dist/.htaccess << 'EOF'
# TechSphere Web Application - Apache Configuration

# Enable Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Set cache headers
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/json "access plus 1 day"
    ExpiresByType text/html "access plus 1 hour"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
    
    # HTTPS redirect
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
</IfModule>

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Remove trailing slashes
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{THE_REQUEST} /+[^\s?]*?/?(\?[^\s]*)?\s
RewriteRule ^(.*)/?$ /$1 [R=301,L]

# Add trailing slash to directories
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^(.+[^/])$ $1/ [R=301,L]

# Custom error pages
ErrorDocument 404 /404.html
ErrorDocument 500 /500.html
EOF

# Calculate file sizes and compression ratios
echo "📊 Build statistics:"
echo "========================"

# Original sizes
if [ -f style.css ]; then
    original_css_size=$(stat -c%s style.css)
    echo "Original CSS size: ${original_css_size} bytes"
fi

if [ -f script.js ]; then
    original_js_size=$(stat -c%s script.js)
    echo "Original JS size: ${original_js_size} bytes"
fi

# Minified sizes
if [ -f dist/style.min.css ]; then
    minified_css_size=$(stat -c%s dist/style.min.css)
    css_savings=$((original_css_size - minified_css_size))
    css_percentage=$((css_savings * 100 / original_css_size))
    echo "Minified CSS size: ${minified_css_size} bytes (${css_percentage}% reduction)"
fi

if [ -f dist/script.min.js ]; then
    minified_js_size=$(stat -c%s dist/script.min.js)
    js_savings=$((original_js_size - minified_js_size))
    js_percentage=$((js_savings * 100 / original_js_size))
    echo "Minified JS size: ${minified_js_size} bytes (${js_percentage}% reduction)"
fi

echo "========================"

# Validate HTML
echo "🔍 Validating HTML..."
if command -v html-validate &> /dev/null; then
    html-validate dist/index.html
    if [ $? -eq 0 ]; then
        echo "✅ HTML validation passed"
    else
        echo "❌ HTML validation failed"
    fi
else
    echo "⚠️  html-validate not found, skipping validation"
fi

# Test with local server if serve is available
if command -v serve &> /dev/null; then
    echo "🌐 Testing with local server..."
    serve -s dist -l 8080 &
    SERVER_PID=$!
    sleep 2
    
    if command -v curl &> /dev/null; then
        if curl -s http://localhost:8080 > /dev/null; then
            echo "✅ Local server test passed"
        else
            echo "❌ Local server test failed"
        fi
    fi
    
    kill $SERVER_PID 2>/dev/null
fi

echo ""
echo "🎉 Build completed successfully!"
echo "📁 Production files are in the 'dist' directory"
echo ""
echo "🚀 Deployment options:"
echo "   • Static hosting: Upload 'dist' folder contents"
echo "   • Netlify: npm run deploy-netlify"
echo "   • Vercel: npm run deploy-vercel"
echo "   • GitHub Pages: Push 'dist' contents to gh-pages branch"
echo ""
echo "⚡ Performance tips:"
echo "   • Enable Gzip compression on your server"
echo "   • Use a CDN for global content delivery"
echo "   • Set up proper cache headers"
echo "   • Monitor with Google PageSpeed Insights"
echo ""
echo "🔍 Quality assurance:"
echo "   • Test in multiple browsers"
echo "   • Validate accessibility with axe-core"
echo "   • Run Lighthouse performance audit"
echo "   • Test responsive design on various devices"
