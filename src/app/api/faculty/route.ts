import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const faculty = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: "FACULTY"
            }
          }
        }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true
      }
    });
    return NextResponse.json(faculty);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
