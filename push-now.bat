@echo off
cd /d "%~dp0"
echo === Staging all changes ===
git add -A
echo === Committing ===
git commit -m "feat: force logo as OG share image on WhatsApp/iMessage/Telegram/X; belt-and-suspenders meta tags in <head>"
echo === Pushing to GitHub ===
git push
echo === Done! Check Vercel for auto-deploy ===
pause
