@echo off
echo.
echo ========================================
echo   Milehigh5280 - Fix and Push to GitHub
echo ========================================
echo.

cd /d "C:\Users\TGNE\Desktop\bnb"

echo [1/4] Checking git status...
git status --short
echo.

echo [2/4] Staging all changes...
git add -A
echo.

echo [3/4] Committing...
git commit -m "fix: resolve Vercel build errors - BlogSection apostrophe syntax, Hero/Footer JSX, node engine version"
echo.

echo [4/4] Pushing to GitHub (triggers new Vercel deploy)...
git push origin main
echo.

echo ========================================
echo   Done! Check Vercel dashboard in ~2 min
echo   https://vercel.com/craftsmann06s-projects/milehigh5280-airbnb
echo ========================================
echo.
pause
