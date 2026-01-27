import { NextRequest, NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/db/seed';
import { getTotalDoctorCount } from '@/lib/db/queries';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { password } = body;

    // Validate password
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Admin password not configured' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Seed database
    const result = seedDatabase();

    return NextResponse.json({
      success: true,
      message: `Database seeded with ${result.count} sample doctors`,
      count: result.count,
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Seed failed',
      },
      { status: 500 }
    );
  }
}

// GET to check status
export async function GET() {
  try {
    const count = getTotalDoctorCount();
    return NextResponse.json({
      success: true,
      count,
      isEmpty: count === 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check database',
      },
      { status: 500 }
    );
  }
}
