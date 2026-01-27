import { NextRequest, NextResponse } from 'next/server';
import { searchDoctors, getSpecialties } from '@/lib/db/queries';
import { SortOption } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get('q') || undefined;
    const specialty = searchParams.get('specialty') || undefined;
    const state = searchParams.get('state') || undefined;
    const city = searchParams.get('city') || undefined;
    const verifiedOnly = searchParams.get('verified') === 'true';
    const featuredOnly = searchParams.get('featured') === 'true';
    const sort = (searchParams.get('sort') as SortOption) || 'best_match';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);

    // Search doctors
    const results = searchDoctors({
      query,
      specialty,
      state,
      city,
      verifiedOnly,
      featuredOnly,
      sort,
      page,
      limit,
    });

    // Get specialties for filter options
    const specialties = getSpecialties();

    return NextResponse.json({
      ...results,
      filters: {
        specialties,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search doctors' },
      { status: 500 }
    );
  }
}
