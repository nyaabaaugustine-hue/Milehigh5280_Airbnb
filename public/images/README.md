# Auth Background Image Setup

This folder should contain the auth background image.

## Setup

1. Add your background image to this folder as `auth-bg.jpg`
   - Recommended: Use one of the portfolio images from `/assets/*.jpeg`
   - Or upload to Cloudinary and use the CDN URL

2. **Option A: Copy from assets**
   ```bash
   cp assets/3.jpeg public/images/auth-bg.jpg
   ```

3. **Option B: Use Cloudinary URL**
   Update `src/app/(auth)/login/page.tsx` and `src/app/(auth)/signup/page.tsx`:
   ```jsx
   backgroundImage: 'url("https://res.cloudinary.com/your-cloud/image/upload/...")',
   ```

Current fallback: Gradient background with dark overlay
Next.js will serve any image placed here at `/images/filename`
