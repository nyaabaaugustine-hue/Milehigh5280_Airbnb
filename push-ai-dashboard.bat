@echo off
echo.
echo ============================================
echo   Milehigh5280 — Push AI Admin Dashboard
echo ============================================
echo.
cd /d "C:\Users\TGNE\Desktop\air"
git add -A
git commit -m "feat: AI chat-driven admin dashboard with Airtable CMS integration

- Add /admin/chat — AI Content Assistant page
- Add /api/ai/interpret — Claude AI message interpreter
- Add /api/ai/execute — Confirmed action executor (Airtable mutations)
- Add /api/ai/logs — Action history with before/after audit trail
- Add src/lib/ai/types.ts — Full TypeScript type system
- Add src/lib/ai/tools.ts — Tool catalogue + system prompt builder
- Add src/lib/ai/logger.ts — Persistent action log with undo support
- Add src/lib/ai/executor.ts — Safe tool execution against Airtable
- Add src/lib/ai/airtable-mutations.ts — Write-only Airtable client
- Add src/components/admin/AdminChat.tsx — Full chat UI
- Update admin layout with AI Assistant nav item (NEW badge)
- Require ANTHROPIC_API_KEY in .env.local"

git push origin main
echo.
echo Done! Check Vercel in ~2 minutes.
echo Visit /admin/chat after deploy.
echo.
echo IMPORTANT: Add ANTHROPIC_API_KEY to Vercel env vars:
echo https://vercel.com/craftsmann06s-projects/milehigh5280-airbnb/settings/environment-variables
echo.
pause
