@echo off
cd /d "%~dp0"
echo === Staging all changes ===
git add -A
echo === Committing ===
git commit -m "fix: new art banner image, flush on footer, click links to /contact; fix Vercel build errors (route.ts, lib/page.tsx, next.config.mjs serverExternalPackages, unused files)"
echo === Pushing to GitHub ===
git push
echo === Done! ===
pause
