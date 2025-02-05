import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Busca todos os leads de ambas as tabelas
    const [leadsQuentes, leadsFrios] = await Promise.all([
      prisma.whatsappLead.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.whatsappFrio.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Set para rastrear números já processados
    const processedNumbers = new Set();
    
    // Processa leads quentes primeiro
    const uniqueLeadsQuentes = leadsQuentes.filter(lead => {
      const key = `${lead.countryCode}${lead.phone}`;
      if (processedNumbers.has(key)) return false;
      processedNumbers.add(key);
      return true;
    });

    // Processa leads frios, excluindo números que já apareceram nos quentes
    const uniqueLeadsFrios = leadsFrios.filter(lead => {
      const key = `${lead.countryCode}${lead.phone}`;
      if (processedNumbers.has(key)) return false;
      processedNumbers.add(key);
      return true;
    });

    return NextResponse.json({
      quentes: uniqueLeadsQuentes,
      frios: uniqueLeadsFrios
    });
  } catch (error) {
    console.error('Erro ao buscar leads:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar leads' },
      { status: 500 }
    );
  }
} 