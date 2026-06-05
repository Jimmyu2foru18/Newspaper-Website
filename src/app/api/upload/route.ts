import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const filename = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const path = join(process.cwd(), "public/uploads", filename);
    await writeFile(path, buffer);

    return NextResponse.json({ path: `/uploads/${filename}` });
  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
