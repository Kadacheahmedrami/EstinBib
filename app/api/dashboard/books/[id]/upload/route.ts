// app/api/dashboard/books/[id]/upload/route.ts

import { NextRequest, NextResponse } from "next/server";
import { books } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",  
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const bookId = (await params).id;

    // Parse incoming form data
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file into buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary, placing under folder "books/{bookId}"
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `books/${bookId}` },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // If upload failed or no result, return error
    if (!uploadResult || typeof uploadResult !== "object") {
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // Extract secure URL from Cloudinary response
    // @ts-ignore
    const secureUrl: string = uploadResult.secure_url;

    // Update book's coverImage field in database
    await db
      .update(books)
      .set({ coverImage: secureUrl })
      .where(eq(books.id, bookId));

    return NextResponse.json(
      { message: "Image uploaded successfully", coverImage: secureUrl },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading book image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
