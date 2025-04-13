# Gaia Project Troubleshooting Guide

## Common Issues and Solutions

### Application Loads Landing Page But No Other Pages

If you experience the issue where the landing page loads successfully but subsequent navigation fails with no visible error, check the following:

1. **Check for 404 Errors in Browser Console**

   Open your browser developer tools (F12) and look for 404 errors in the Network or Console tabs. Common missing files include:
   
   - Missing texture files: 
     ```
     /textures/earth_texture.jpg
     /textures/earth_normal.jpg
     /textures/earth_specular.jpg
     /textures/earth_clouds.jpg
     ```
   
   - Missing icon files:
     ```
     /icons/ancient-marker.png
     /icons/classical-marker.png
     /icons/medieval-marker.png
     /icons/renaissance-marker.png
     /icons/industrial-marker.png
     /icons/modern-marker.png
     ```

2. **Restart the Development Server**

   Sometimes the Next.js development server can get into a bad state. Try stopping and restarting:
   
   ```bash
   # Press Ctrl+C to stop the current server
   cd C:\Users\fcarp\Desktop\Projects\beta
   npm run dev
   ```

3. **Clear Next.js Cache**

   ```bash
   cd C:\Users\fcarp\Desktop\Projects\beta
   rm -rf .next
   npm run dev
   ```

4. **Check for Multiple Server Instances**

   If you see multiple port attempts (3000, 3001, 3002, etc.), you likely have multiple Next.js instances running:
   
   ```bash
   # For Windows, terminate all node processes
   taskkill /F /IM node.exe /T
   
   # Or kill specific process by ID (in PowerShell)
   Stop-Process -Id [PID] -Force
   ```

5. **Fix Three.js OrbitControls Errors**

   If you're seeing errors related to Three.js OrbitControls:
   
   ```bash
   npm install @types/three
   ```

6. **Webpack Cache Strategy Errors**

   If you see errors like `[webpack.cache.PackFileCacheStrategy] Caching failed for pack`, this indicates filesystem permissions or disk space issues. Try:
   
   ```bash
   # Check disk space (Windows)
   Get-PSDrive C
   
   # Clear temporary files
   Remove-Item -Path C:\Users\fcarp\Desktop\Projects\beta\.next\cache -Recurse -Force
   ```

7. **Missing Page.js Error**

   For errors like `ENOENT: no such file or directory, open 'C:\Users\fcarp\Desktop\Projects\beta\.next\server\app\page.js'`:
   
   - Make sure all component imports in your files are correct
   - Check that your page.tsx file in the app directory is valid
   - Clear the .next cache directory and rebuild

8. **Port Already in Use**

   If you see multiple "Port XXXX is in use, trying XXXX instead" messages:
   
   ```powershell
   # In PowerShell, find processes using specific ports:
   Get-NetTCPConnection -LocalPort 3000,3001,3002,3003 | Where-Object State -eq Listen

   # Kill specific process
   Stop-Process -Id [PID] -Force
   ```

### Google Font Content Security Policy (CSP) Errors

If you see errors in the browser console like:
`Refused to load the stylesheet 'https://fonts.googleapis.com/...' because it violates the following Content Security Policy directive: "style-src 'self' 'unsafe-inline'"`

This means the browser is trying to load fonts directly from Google Fonts, but the default security policy prevents it. This usually happens if the standard Next.js font optimization (`next/font`) is being bypassed.

1. **Check for Direct Font Imports:**
   Ensure you are **not** using `@import url('https://fonts.googleapis.com/...')` rules in any CSS files (especially `src/app/fonts.css` or `src/app/globals.css`). The preferred method is using `next/font/google` imports within your layout or components.
   
   ```javascript
   // Example in src/app/layout.tsx (Correct)
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   // ... use inter.className
   ```

2. **Check for Manual `<link>` Tags:**
   Verify that you haven't manually added `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` tags to the `<head>` section of your `src/app/layout.tsx` or other pages. `next/font` handles this automatically.

3. **Clear Caches:**
   If the imports seem correct, persistent caching might be the issue.
   - Clear the Next.js cache: `Remove-Item -Recurse -Force .next` (PowerShell) or `rm -rf .next` (Bash/Zsh)
   - Clear your browser's cache thoroughly.
   - Restart the development server (`npm run dev`).

4. **Check Browser Extensions:**
   Rarely, a browser extension might interfere or inject font links. Try running the application in an Incognito/Private window to see if the error persists.

## Next.js Config Issues

Your current Next.js config has warnings:

```javascript
// next.config.js
const nextConfig = {
  // Disable automatic font optimization to prevent preload warnings
  optimizeFonts: false,
  experimental: {
    // Enable the app directory 
    appDir: true,
  }
};
```

These options are no longer needed in Next.js 15+ since App Router is the default and font optimization settings have changed. You can update to:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Any current settings you need
};

module.exports = nextConfig;
```

## File Path Problems

Ensure that your path references in code match the actual file structure:

- Assets in the public folder should be referenced with paths like: `/textures/file.jpg` (not `/public/textures/file.jpg`)
- Check all `import` statements for correct paths
- Verify that case sensitivity matches for all file paths

## Server-Side Errors

If your server logs show errors but the browser doesn't, check the terminal where the Next.js server is running for:

- TypeScript errors
- Import errors
- Server component errors

## Isolating Component Issues

If the app loads the landing page but not other routes:

1. Create a minimal test page to see if the issue is route-specific
2. Comment out heavy components like 3D globes to see if they're causing issues
3. Check for client-side only code that might be running during server rendering

## Out of Memory Issues

3D rendering with Three.js can be memory-intensive. If the application crashes:

1. Reduce the complexity of 3D scenes
2. Consider adding `?quality=medium` parameters to texture URLs to load smaller versions
3. Use dynamic imports with loading states for heavy components

## React Version Compatibility

You're using React 19 which is very new. Ensure all your dependencies are compatible:

```bash
npm ls react
npm ls react-dom
```

If you see warnings about peer dependencies, you may need to downgrade React or update other packages. 