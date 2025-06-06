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

    // Check if file exists and is a File-like object
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In Node.js environment, FormData file is a Blob-like object, not File
    // We need to check for the properties we need
    if (typeof file === 'string') {
      return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
    }

    // Cast to any to access blob properties in Node.js environment
    const fileBlob = file as any;
    
    if (!fileBlob.stream || !fileBlob.type) {
      return NextResponse.json({ error: "Invalid file object" }, { status: 400 });
    }

    // Validate file type
    if (!fileBlob.type.startsWith('image/')) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Read file into buffer
    const arrayBuffer = await fileBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary, placing under folder "books/{bookId}"
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `books/${bookId}`,
          resource_type: 'image',
          transformation: [
            { width: 400, height: 600, crop: 'fill', quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // If upload failed or no result, return error
    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // Extract secure URL from Cloudinary response
    const secureUrl: string = uploadResult.secure_url;

    // Update book's coverImage field in database
    await db
      .update(books)
      .set({ coverImage: secureUrl })
      .where(eq(books.id, bookId));

    return NextResponse.json(
      { 
        message: "Image uploaded successfully", 
        coverImage: secureUrl,
        public_id: uploadResult.public_id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading book image:", error);
    
    // Provide more specific error messages
    let errorMessage = "Internal server error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}