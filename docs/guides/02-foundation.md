# Part 2: Project Anatomy

How do we actually build the website?

### 1. Initialize the Project
Navigate to your desired folder in the terminal (e.g., `cd Desktop`) and run:
```bash
npx create-next-app@latest catalyst-web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
*What this does:* It automatically downloads a pre-made template of a Next.js project, saving you from setting up thousands of files manually.

### 2. Understanding the Folders
Open the folder in VS Code (`File > Open Folder...`). You will see this:
- **`src/app`**: This is the "brain." Every file here maps to a web page (e.g., `src/app/about/page.tsx` is the `yourwebsite.com/about` page).
- **`src/components`**: These are "LEGO bricks." They are reusable pieces like buttons, headers, or footers.
- **`src/lib`**: Short for "library." This holds utility code that isn't a page or a component, like your database connection code.
- **`package.json`**: This is your "shopping list." It tells Node.js which libraries (like Tiptap or Prisma) your project needs to function.

### 3. Creating a File
To "code it" yourself:
1. Right-click in the VS Code file explorer (left panel).
2. Select **New File**.
3. Name it `test.tsx`.
4. Paste the code:
   ```tsx
   export default function TestPage() {
     return <h1>Hello, Catalyst!</h1>;
   }
   ```
5. Save it. You have just created a functional component!

---
Let's move on to [Part 3: Initialization](03-initialization.md) to understand how to put it all together.
