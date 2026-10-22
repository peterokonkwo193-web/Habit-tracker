# HabitFlow Deployment Guide

## Prerequisites
- Node.js 18+
- A Supabase account
- A Vercel account
- A Telegram Bot token (from @BotFather)

---

## Phase 1: Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com and create an account
2. Click "New Project" and fill in details
3. Choose a strong database password and save it

### 2. Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase/migrations/001_initial_schema.sql`
3. Paste the entire content and click **Run**

### 3. Configure Auth
1. Go to **Authentication → Settings**
2. Set your **Site URL** to your production domain
3. Add redirect URLs:
   - `http://localhost:3000/**` (development)
   - `https://your-domain.com/**` (production)

### 4. Get API Keys
Go to **Project Settings → API** and copy:
- Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- service_role key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Phase 2: Telegram Bot Setup

### 1. Create Bot
1. Open Telegram and message @BotFather
2. Send `/newbot`
3. Follow prompts to name your bot
4. Copy the token → `TELEGRAM_BOT_TOKEN`

### 2. Set Webhook (after deployment)
After deploying to Vercel, set the webhook:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/api/telegram/webhook",
    "secret_token": "your-webhook-secret"
  }'
```

---

## Phase 3: Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy
```bash
cd habit-tracker-app
vercel
```

### 3. Set Environment Variables
In your Vercel dashboard → Project → Settings → Environment Variables, add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL |
| `TELEGRAM_BOT_TOKEN` | From BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Random string |
| `CRON_SECRET` | Random string |

### 4. Cron Jobs
`/api/cron/reminders` must be called every minute. It sends each user up to three Telegram
reminders a day (morning, midday, evening), at the times they set in Settings and in their
own profile timezone.

Vercel Hobby only allows daily crons, so use a free external scheduler such as
https://cron-job.org:
- URL: `https://your-domain.com/api/cron/reminders`
- Schedule: every minute
- Request header: `Authorization: Bearer <CRON_SECRET>`

Run `supabase/migrations/002_daily_reminders.sql` in the SQL Editor to add the midday and evening columns.

---

## Phase 4: Create Admin User

After your first signup, run this in Supabase SQL Editor:
```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'your-email@example.com'
);
```

---

## Local Development

```bash
# Clone and install
npm install

# Copy env file
cp .env.local.example .env.local
# Fill in your values

# Start dev server
npm run dev
```

Open http://localhost:3000

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ��� | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (admin) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your app's base URL |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Optional | Secret for webhook verification |
| `CRON_SECRET` | Optional | Secret for cron job authorization |
