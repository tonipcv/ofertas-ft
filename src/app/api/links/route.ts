import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId, title, url, order } = await request.json();
    
    const link = await prisma.link.create({
      data: {
        title,
        url,
        order,
        userId,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Error creating link' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, title, url, order, isActive } = await request.json();
    
    const link = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        order,
        isActive,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json(
      { error: 'Error updating link' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    
    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json(
      { error: 'Error deleting link' },
      { status: 500 }
    );
  }
} 