@echo off
echo.
echo ============================================
echo   Fix AI Chatbot — Push to GitHub
echo ============================================
echo.
cd /d "C:\Users\TGNE\Desktop\air"
git add src/app/api/ai/interpret/route.ts src/components/admin/AdminChat.tsx
git status
git commit -m "fix: AI chatbot not responding

Bugs fixed:
1. ruleBasedParser default now returns action=null so unrecognised
   commands show as plain assistant messages, not broken action cards
2. handleSend now validates action + data before showing action card
3. interpret/route.ts now tries Anthropic first, Groq second, rules fallback
4. Groq model changed to llama3-8b-8192 (more reliable than mixtral)
5. Improved greeting detection so 'hello' returns a helpful message
6. Better prompts in rule-based parser for all supported commands"

git push origin main
echo.
echo Done! Vercel will redeploy in ~2 min.
echo.
echo OPTIONAL: To get full AI (not just rule-based), add to Vercel env vars:
echo   ANTHROPIC_API_KEY = your real key from console.anthropic.com
echo   https://vercel.com/craftsmann06s-projects/milehigh5280-airbnb/settings/environment-variables
echo.
pause
