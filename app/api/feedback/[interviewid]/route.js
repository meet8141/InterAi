import { db } from '@/utils/db';
import { userAnswers } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET feedback for an interview
export async function GET(request, { params }) {
  try {
    const { interviewid } = params;

    if (!interviewid) {
      return NextResponse.json({ error: 'Interview ID is required' }, { status: 400 });
    }

    const result = await db.select()
      .from(userAnswers)
      .where(eq(userAnswers.mockidRef, interviewid))
      .orderBy(userAnswers.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

// POST save user answer
export async function POST(request, { params }) {
  try {
    const body = await request.json();
    
    const result = await db.insert(userAnswers)
      .values(body)
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error saving answer:', error);
    return NextResponse.json({ error: 'Failed to save answer' }, { status: 500 });
  }
}
