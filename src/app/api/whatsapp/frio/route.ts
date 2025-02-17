import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { whatsapp, countryCode } = await request.json();
    
    if (!whatsapp || whatsapp.length < 11 || !countryCode) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    await prisma.whatsappFrio.create({
      data: {
        phone: whatsapp,
        countryCode: countryCode.toString(),
        isGroupMember: false
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erro ao salvar WhatsApp' },
      { status: 500 }
    );
  }
} 