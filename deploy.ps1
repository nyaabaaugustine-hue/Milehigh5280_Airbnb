# Milehigh5280 Deploy Script
# Run: powershell -ExecutionPolicy Bypass -File .\deploy.ps1

Set-Location $PSScriptRoot
$ErrorActionPreference = "Stop"

Write-Host "=== Milehigh5280 Deploy ===" -ForegroundColor Cyan

# Setup UTF8 without BOM encoding
$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

# Step 1: Remove git lock if stuck
$lockFile = ".git\index.lock"
if (Test-Path $lockFile) {
    Remove-Item $lockFile -Force
    Write-Host "Removed stale git lock file" -ForegroundColor Yellow
}

# Step 2: Create missing page directories
$dirs = @("src/app/privacy", "src/app/terms", "src/app/cancellation")
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Force -Path $d | Out-Null
        Write-Host "Created: $d" -ForegroundColor Green
    }
}

# Step 3: Write privacy page
$privacy = @"
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Milehigh5280',
  description: 'How we handle your data at Milehigh5280.',
};

export default function PrivacyPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Privacy Policy</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">1. Information We Collect</h2>
          <p>We collect your name, email, phone, and payment details when you book or contact us.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">2. How We Use It</h2>
          <p>Your data is used only to process bookings and improve our service. We never sell personal information.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">3. Security</h2>
          <p>We use SSL encryption and process payments securely via Paystack and Stripe.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">4. Contact</h2>
          <p>Questions: <a href="mailto:herbertprempeh@gmail.com" className="text-[var(--gold)] hover:underline">herbertprempeh@gmail.com</a></p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/terms" className="btn-ghost">Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}
"@
[System.IO.File]::WriteAllText("$PSScriptRoot/src/app/privacy/page.tsx", $privacy, $Utf8NoBom)
Write-Host "OK: privacy page" -ForegroundColor Green

# Step 4: Write terms page
$terms = @"
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Milehigh5280',
  description: 'Terms and conditions for Milehigh5280 stays.',
};

export default function TermsPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Terms of Service</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">1. Bookings</h2>
          <p>All reservations are subject to availability and require written confirmation from Milehigh Properties.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">2. Payment</h2>
          <p>Full payment is required to secure a reservation. We accept USD and GHS via Paystack and Stripe.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">3. Check-in</h2>
          <p>Standard check-in is 2:00 PM and check-out is 11:00 AM. Early/late arrangements subject to availability.</p>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">4. Governing Law</h2>
          <p>These terms are governed by the laws of the Republic of Ghana.</p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/cancellation" className="btn-ghost">Cancellation Policy</Link>
        </div>
      </div>
    </main>
  );
}
"@
[System.IO.File]::WriteAllText("$PSScriptRoot/src/app/terms/page.tsx", $terms, $Utf8NoBom)
Write-Host "OK: terms page" -ForegroundColor Green

# Step 5: Write cancellation page
$cancel = @"
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cancellation Policy | Milehigh5280',
  description: 'Cancellation and refund policy for Milehigh5280.',
};

export default function CancellationPage() {
  return (
    <main className="pt-40 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
      <p className="section-label mb-4">Legal</p>
      <h1 className="font-serif font-light text-white mb-12">Cancellation Policy</h1>
      <div className="space-y-8 text-[var(--text-muted)] leading-relaxed">
        <section>
          <h2 className="font-serif text-2xl text-white mb-5">Refund Schedule</h2>
          <div className="space-y-3">
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">7 or more days before check-in</span>
              <span className="text-[var(--gold)] font-medium">Full refund</span>
            </div>
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">3 to 6 days before check-in</span>
              <span className="text-[var(--gold)] font-medium">50% refund</span>
            </div>
            <div className="flex justify-between border border-[var(--border)] p-4">
              <span className="text-white">Less than 48 hours</span>
              <span className="text-[var(--gold)] font-medium">No refund</span>
            </div>
          </div>
        </section>
        <section>
          <h2 className="font-serif text-2xl text-white mb-3">How to Cancel</h2>
          <p>Contact us via WhatsApp or email. Refunds are processed within 5 to 10 business days.</p>
        </section>
        <div className="pt-8 border-t border-[var(--border)] flex gap-4">
          <Link href="/" className="btn-ghost">Back Home</Link>
          <Link href="/contact" className="btn-ghost">Contact Us</Link>
        </div>
      </div>
    </main>
  );
}
"@
[System.IO.File]::WriteAllText("$PSScriptRoot/src/app/cancellation/page.tsx", $cancel, $Utf8NoBom)
Write-Host "OK: cancellation page" -ForegroundColor Green

# Step 6: Build
Write-Host ""
Write-Host "Building..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED - fix errors above" -ForegroundColor Red
    exit 1
}

# Step 7: Git push
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git add -A
$changes = git status --porcelain
if ([string]::IsNullOrWhiteSpace($changes)) {
    Write-Host "Nothing to commit - already up to date" -ForegroundColor Yellow
} else {
    git commit -m "fix: metadata in client component, GhanaTourAd JSX, remove stray page files, add legal pages"
    git push
    Write-Host ""
    Write-Host "DONE - Pushed! Vercel will deploy automatically." -ForegroundColor Green
}
