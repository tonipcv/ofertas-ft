import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { whatsapp, countryCode } = await request.json();
    
    if (!whatsapp || !countryCode) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Verifica se o número já existe
    const existingLead = await prisma.whatsappLead.findFirst({
      where: {
        phone: whatsapp,
        countryCode: countryCode.toString(),
      },
    });

    return NextResponse.json({ exists: !!existingLead });
  } catch (error) {
    console.error('Erro ao verificar WhatsApp:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar WhatsApp' },
      { status: 500 }
    );
  }
} 