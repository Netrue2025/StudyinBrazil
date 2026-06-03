# StudyinBrazil

StudyinBrazil is a Next.js application for helping international students discover Brazilian universities, postgraduate programs, open applications, and paid application-support services.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- MongoDB Atlas
- Admin dashboard with simple password authentication
- Manual payment mode with a provider abstraction ready for Paystack

## Environment Variables

Create `.env` locally and add the same values in Vercel Project Settings.

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/studyinbrazil?retryWrites=true&w=majority"
ADMIN_EMAIL="admin@studyinbrazil.com"
ADMIN_PASSWORD="replace-with-a-strong-password"
ADMIN_SESSION_SECRET="replace-with-a-long-random-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PAYMENT_MODE="paystack"
PAYMENT_PROVIDER="paystack"
PAYSTACK_SECRET_KEY=""
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=""
RESEND_API_KEY=""
EMAIL_FROM="StudyinBrazil <no-reply@your-domain.com>"
```

For Vercel, set `NEXT_PUBLIC_APP_URL` to your deployed URL.

## Local Setup

Install dependencies:

```bash
npm install
```

Generate Prisma Client:

```bash
npm run db:generate
```

Push the MongoDB schema:

```bash
npm run db:push
```

Seed the database:

```bash
npm run db:seed
```

Run locally:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Admin Dashboard

Visit:

```text
/admin
```

Use the password from `ADMIN_PASSWORD`.

## Vercel Deployment

1. Create a MongoDB Atlas database.
2. Add your MongoDB connection string to Vercel as `DATABASE_URL`.
3. Add all required environment variables in Vercel.
4. Deploy from GitHub.
5. After deployment, seed MongoDB from your local machine using the same Atlas `DATABASE_URL`:

```bash
npm run db:push
npm run db:seed
```

Do not use Prisma migrations for MongoDB. Use `prisma db push`.

## Paystack

The app includes a Paystack provider in `lib/payments.ts`. To go live with Paystack, add these values locally and in Vercel:

```env
PAYMENT_PROVIDER="paystack"
PAYMENT_MODE="paystack"
PAYSTACK_SECRET_KEY="sk_live_or_test_xxx"
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_live_or_test_xxx"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
RESEND_API_KEY="re_xxx"
EMAIL_FROM="StudyinBrazil <receipts@your-domain.com>"
```

The callback URL is generated automatically as:

```text
https://your-domain.com/api/payments/paystack/callback
```

After a successful Paystack payment, the callback verifies the transaction, marks the service order as paid, emails the customer their order details when `RESEND_API_KEY` and `EMAIL_FROM` are configured, stores a receipt cookie for the order status page, and redirects the user to a downloadable PDF receipt.
