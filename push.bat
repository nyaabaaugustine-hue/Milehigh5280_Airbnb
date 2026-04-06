@echo off
cd /d "%~dp0"
git add -A
git commit -m "fix: art banner 60%%, blog images show fix, trust icon matched to bnb logo size"
git push
echo.
echo Done! Check GitHub and Vercel for deployment.
pause
