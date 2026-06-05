# Part 5: CMS Implementation

This step gives users the ability to create content.

### 1. The Rich Text Editor
We use **Tiptap**.

**How to code it (`src/components/editor/RichTextEditor.tsx`):**

```tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function RichTextEditor({ content, onChange }) {
  // 1. Initialize the editor
  const editor = useEditor({
    extensions: [StarterKit], // The basic set of tools (bold, lists, etc.)
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()); // 2. Send the content back when changed
    },
  });

  return (
    <div className="border p-4 rounded-lg">
      <EditorContent editor={editor} />
    </div>
  );
}
```

### 2. The Publishing Portal (`src/app/publish/page.tsx`)
This page handles the form where data is collected and sent to the database.

**How to code it:**
```tsx
"use client";
import { useState } from "react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

export default function PublishPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    // 1. Send data to our API
    await fetch("/api/articles", {
      method: "POST",
      body: JSON.stringify({ title, content, published: true }),
    });
    alert("Published!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-8">
      <input 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Title" 
      />
      <RichTextEditor content={content} onChange={setContent} />
      <button type="submit">Publish Article</button>
    </form>
  );
}
```

**The Breakdown:**
*   `useState()`: Tracks the data the user types into the form.
*   `fetch()`: Sends the data to your server/API route.
*   `onChange`: This is a "prop" that passes the text from the editor back up to the form component.
