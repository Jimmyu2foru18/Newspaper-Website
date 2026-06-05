# Part 9: Deployment

When you are ready to share the Catalyst with the world, you need a hosting provider.

### 1. Choose a Platform
For Next.js projects, **Vercel** is the easiest to use.
- Sign up for a free account at [vercel.com](https://vercel.com/).
- Install the Vercel CLI in your terminal: `npm i -g vercel`

### 2. Prepare for Deployment
- Make sure your project is pushed to a **GitHub repository**.
- On Vercel, connect your GitHub account.
- Select your Catalyst repository.

### 3. Configure Database for Production
You cannot use `localhost` for a live website. You will need a cloud database.
- Use a service like [Supabase](https://supabase.com/) to host your PostgreSQL database.
- Get the connection string from your Supabase dashboard.
- In Vercel's project settings, add this string to the "Environment Variables" section under the key `DATABASE_URL`.

### 4. Deploy!
- Click **Deploy** in the Vercel dashboard.
- Vercel will build your project and provide a public URL for your platform.

Congratulations! Now let's enhance it with [Part 10: Engagement & Search](10-engagement.md).
