import { NextResponse } from 'next/server';

// Define the User type
interface User {
  userId: string;
  fullName: string;
  emailAddress: string;
}

// Endpoint to return Aya Ahlam Feliachi's profile
export async function GET() {
  try {
    // Returning the hardcoded data for Aya Ahlam Feliachi
    const ayaProfile: User = {
      userId: "user1011",
      fullName: "Aya Ahlam Feliachi",
      emailAddress: "ayaahlam@example.com",
    };

    return NextResponse.json(
      {
        user: ayaProfile
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}
