import { db } from '@/utils/db';
import { mockinterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { interviewid } = params;

    if (!interviewid) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    const result = await db.select()
      .from(mockinterview)
      .where(eq(mockinterview.mockid, interviewid));

    if (result.length === 0) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json({ error: 'Failed to fetch interview' }, { status: 500 });
  }
}
