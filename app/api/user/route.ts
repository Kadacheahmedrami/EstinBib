import { NextResponse } from 'next/server';

// Define the User type
interface User {
  userId: string;
  fullName: string;
  emailAddress: string;
}

// Mock database with user data
const users: User[] = [
  {
    userId: "user123",
    fullName: "John Doe",
    emailAddress: "johndoe@example.com",
  },
  {
    userId: "user456",
    fullName: "Jane Smith",
    emailAddress: "janesmith@example.com",
  },
  {
    userId: "user789",
    fullName: "Alice Johnson",
    emailAddress: "alicejohnson@example.com",
  },
  {
    userId: "user1011",
    fullName: "Aya Ahlam Feliachi",
    emailAddress: "ayaahlam@example.com",
  },
  // Add other users as needed...
];

// GET API route to fetch user data in the desired format
export async function GET() {
  try {
    // Format the data to only include Full Name, User ID, and Email Address
    const formattedUsers = users.map(user => ({
      "Full Name": user.fullName,
      "User's ID": user.userId,
      "Email Address": user.emailAddress,
    }));

    return NextResponse.json(
      {
        users: formattedUsers,
        total: formattedUsers.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
