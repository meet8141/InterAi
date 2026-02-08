import { db } from '@/utils/db';
import { mockinterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET all interviews for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const interviews = await db.select()
      .from(mockinterview)
      .where(eq(mockinterview.createdby, email))
      .orderBy(desc(mockinterview.id));

    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Failed to fetch interviews' }, { status: 500 });
  }
}

// POST create new interview
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      mockid,
      jsonmockresp,
      jobposition,
      jobdescription,
      jobexp,
      difficulty,
      createdby,
    } = body ?? {};

    if (!mockid || !jsonmockresp || !jobposition || !jobdescription || !jobexp || !createdby) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await db
      .insert(mockinterview)
      .values({
        mockid,
        jsonmockresp,
        jobposition,
        jobdescription,
        jobexp,
        difficulty,
        createdby,
      })
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      {
        error: 'Failed to create interview',
        ...(process.env.NODE_ENV !== 'production'
          ? { details: error?.message ?? String(error) }
          : {}),
      },
      { status: 500 }
    );
  }
}
