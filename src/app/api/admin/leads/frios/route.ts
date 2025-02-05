import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Busca todos os leads ordenados por data
    const allLeads = await prisma.whatsappFrio.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Cria um Map para armazenar leads únicos usando phone+countryCode como chave
    const uniqueLeadsMap = new Map();
    
    allLeads.forEach(lead => {
      const key = `${lead.countryCode}${lead.phone}`;
      // Mantém apenas a primeira ocorrência (mais recente, devido à ordenação)
      if (!uniqueLeadsMap.has(key)) {
        uniqueLeadsMap.set(key, lead);
      }
    });

    // Converte o Map de volta para array
    const uniqueLeads = Array.from(uniqueLeadsMap.values());

    return NextResponse.json(uniqueLeads);
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar leads' },
      { status: 500 }
    );
  }
} 