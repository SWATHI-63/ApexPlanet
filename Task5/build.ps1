# TechSphere Web Application - Production Build Script (PowerShell)
# This script optimizes the application for production deployment on Windows

Write-Host "🚀 Starting TechSphere production build..." -ForegroundColor Green

# Create directories
if (!(Test-Path "dist")) { New-Item -ItemType Directory -Path "dist" }
if (!(Test-Path "reports")) { New-Item -ItemType Directory -Path "reports" }

# Copy HTML file
Write-Host "📄 Processing HTML files..." -ForegroundColor Yellow
Copy-Item "index.html" "dist/"

# Copy CSS and JS (minification would require additional tools)
Write-Host "📋 Copying CSS and JavaScript files..." -ForegroundColor Yellow
Copy-Item "style.css" "dist/"
Copy-Item "script.js" "dist/"

# Copy additional files
Write-Host "📋 Copying additional files..." -ForegroundColor Yellow
Copy-Item "manifest.json" "dist/"
Copy-Item "sw.js" "dist/"
Copy-Item "README.md" "dist/"

# Generate sitemap
Write-Host "🗺️  Generating sitemap..." -ForegroundColor Yellow
$currentDate = Get-Date -Format "yyyy-MM-dd"
$sitemapContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://your-domain.com/</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#about</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#services</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#products</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://your-domain.com/#contact</loc>
        <lastmod>$currentDate</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>
"@

$sitemapContent | Out-File -FilePath "dist/sitemap.xml" -Encoding UTF8

# Generate robots.txt
Write-Host "🤖 Generating robots.txt..." -ForegroundColor Yellow
$robotsContent = @"
User-agent: *
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
"@

$robotsContent | Out-File -FilePath "dist/robots.txt" -Encoding UTF8

# Generate web.config for IIS servers
Write-Host "⚙️  Generating web.config for IIS..." -ForegroundColor Yellow
$webConfigContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <!-- URL Rewrite for SPA -->
        <rewrite>
            <rules>
                <rule name="Force HTTPS" enabled="true">
                    <match url="(.*)" ignoreCase="false" />
                    <conditions>
                        <add input="{HTTPS}" pattern="off" ignoreCase="true" />
                    </conditions>
                    <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" appendQueryString="true" redirectType="Permanent" />
                </rule>
            </rules>
        </rewrite>
        
        <!-- Static file caching -->
        <staticContent>
            <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="31536000" />
        </staticContent>
        
        <!-- Compression -->
        <httpCompression>
            <dynamicTypes>
                <add mimeType="text/*" enabled="true" />
                <add mimeType="message/*" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="application/json" enabled="true" />
                <add mimeType="*/*" enabled="false" />
            </dynamicTypes>
            <staticTypes>
                <add mimeType="text/*" enabled="true" />
                <add mimeType="message/*" enabled="true" />
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="application/atom+xml" enabled="true" />
                <add mimeType="application/xaml+xml" enabled="true" />
                <add mimeType="application/json" enabled="true" />
                <add mimeType="*/*" enabled="false" />
            </staticTypes>
        </httpCompression>
        
        <!-- Security headers -->
        <httpProtocol>
            <customHeaders>
                <add name="X-Content-Type-Options" value="nosniff" />
                <add name="X-Frame-Options" value="DENY" />
                <add name="X-XSS-Protection" value="1; mode=block" />
                <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
                <add name="Strict-Transport-Security" value="max-age=63072000; includeSubDomains; preload" />
            </customHeaders>
        </httpProtocol>
        
        <!-- Custom error pages -->
        <httpErrors>
            <remove statusCode="404" subStatusCode="-1" />
            <error statusCode="404" prefixLanguageFilePath="" path="/404.html" responseMode="ExecuteURL" />
        </httpErrors>
    </system.webServer>
</configuration>
"@

$webConfigContent | Out-File -FilePath "dist/web.config" -Encoding UTF8

# Calculate file sizes
Write-Host ""
Write-Host "📊 Build statistics:" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

if (Test-Path "style.css") {
    $originalCssSize = (Get-Item "style.css").Length
    Write-Host "Original CSS size: $originalCssSize bytes" -ForegroundColor White
}

if (Test-Path "script.js") {
    $originalJsSize = (Get-Item "script.js").Length
    Write-Host "Original JS size: $originalJsSize bytes" -ForegroundColor White
}

if (Test-Path "index.html") {
    $htmlSize = (Get-Item "index.html").Length
    Write-Host "HTML size: $htmlSize bytes" -ForegroundColor White
}

Write-Host "========================" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Production files are in the 'dist' directory" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 Deployment options:" -ForegroundColor Cyan
Write-Host "   • Static hosting: Upload 'dist' folder contents" -ForegroundColor White
Write-Host "   • Azure Static Web Apps: Use Azure CLI" -ForegroundColor White
Write-Host "   • GitHub Pages: Push 'dist' contents to gh-pages branch" -ForegroundColor White
Write-Host "   • Netlify: Drag and drop 'dist' folder to Netlify dashboard" -ForegroundColor White
Write-Host ""
Write-Host "⚡ Performance tips:" -ForegroundColor Cyan
Write-Host "   • Enable compression on your server" -ForegroundColor White
Write-Host "   • Use a CDN for global content delivery" -ForegroundColor White
Write-Host "   • Set up proper cache headers" -ForegroundColor White
Write-Host "   • Monitor with Google PageSpeed Insights" -ForegroundColor White
Write-Host ""
Write-Host "🔍 Quality assurance:" -ForegroundColor Cyan
Write-Host "   • Test in multiple browsers" -ForegroundColor White
Write-Host "   • Validate accessibility" -ForegroundColor White
Write-Host "   • Run Lighthouse performance audit" -ForegroundColor White
Write-Host "   • Test responsive design on various devices" -ForegroundColor White
Write-Host ""
Write-Host "💡 To minify files, install Node.js and run:" -ForegroundColor Yellow
Write-Host "   npm install -g clean-css-cli terser" -ForegroundColor White
Write-Host "   npx clean-css-cli -o dist/style.min.css style.css" -ForegroundColor White
Write-Host "   npx terser script.js -o dist/script.min.js -c -m" -ForegroundColor White
