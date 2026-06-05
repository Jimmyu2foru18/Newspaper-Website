# Part 7: Deployment

Your website is currently sitting on your computer. To make it available on the internet, you need to "host" it.

### 1. What is Deployment?
Think of it like moving your project from your private notebook to a public library shelf where everyone can access it.

### 2. The Hosting Platform: Vercel
Vercel is a service specifically designed to host Next.js projects.
- **Why?** It handles all the complex server configuration for you.

### 3. The Database in Production
You cannot use the Docker container on your computer for the live site because the live site needs to run 24/7.
- **The Solution:** Use a managed cloud database like [Supabase](https://supabase.com/).
- **The Step:**
  1. Create a project on Supabase.
  2. Copy the "Connection String" they give you.
  3. In your Vercel project settings, set the `DATABASE_URL` environment variable to this connection string.

### 4. How to Deploy
1. **GitHub:** Push your code to a public or private GitHub repository.
2. **Import:** Connect your GitHub to your Vercel account.
3. **Deploy:** Click "Deploy." Vercel will build your code and give you a public URL.

---
**Congratulations!** You have completed the Old Westbury Catalyst Masterclass. You have successfully built, tested, and deployed a professional full-stack platform from scratch!
