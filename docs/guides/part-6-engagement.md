# Part 6: Engagement & Search

This section builds community interaction.

### 1. Comment System (`src/components/engagement/CommentSection.tsx`)
We want to allow threaded discussions. This means a comment can have *replies*.

**The Database Concept:**
In `schema.prisma`, our `Comment` model has a `parentId` that points to another `Comment`. This creates a tree structure.

**How to code the Form:**
```tsx
export function CommentSection({ articleId }) {
  const [content, setContent] = useState("");

  const postComment = async () => {
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ content, articleId }),
    });
  };

  return (
    <form onSubmit={postComment}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Post Comment</button>
    </form>
  );
}
```

### 2. Search Engine (`src/app/api/search/route.ts`)
Search needs to look into multiple database tables.

**The Code:**
```tsx
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  // Search through all three models simultaneously
  const [articles, videos, papers] = await Promise.all([
    prisma.article.findMany({ where: { title: { contains: query } } }),
    prisma.video.findMany({ where: { title: { contains: query } } }),
    prisma.researchPaper.findMany({ where: { title: { contains: query } } }),
  ]);

  return NextResponse.json({ articles, videos, papers });
}
```

**The Breakdown:**
*   `Promise.all([...])`: This runs all three database searches at the exact same time, making search incredibly fast.
*   `{ contains: query }`: This tells Prisma to find any item where the title *includes* the word the user typed.
