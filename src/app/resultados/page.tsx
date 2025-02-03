'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3 as BarChart,
  PieChart,
  Search,
  Calendar,
  TrendingUp,
  Filter,
  LineChart,
  X,
  ChevronRight,
  Globe
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { translations } from '@/translations';
import FloatingGroupButton from '@/components/FloatingGroupButton';

// Interface para o tipo Trade
interface Trade {
  data: string;
  ativo: string;
  direcao: string;
  percentual: number;
  alvo: string | number;
}

// Função para formatar a data de maneira consistente
const formatDate = (dateString: string) => {
  // Verifica se a data já está no formato dd/mm/yyyy
  if (dateString.includes('/')) {
    return dateString;
  }
  
  // Se não estiver, converte do formato ISO
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function Home() {
  const [initialTrades, setInitialTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDirection, setSelectedDirection] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [showTargetAnalysis, setShowTargetAnalysis] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [capital, setCapital] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const t = translations[language];
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    async function getTrades() {
      try {
        console.log('Tentando conectar à API...');
        const response = await fetch('https://service-relatorio-server-api.dpbdp1.easypanel.host/api/trades');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar dados da API');
        }
        
        const trades = await response.json();
        console.log(`Encontrados ${trades.length} trades`);
        
        const validTrades = trades.filter((trade: Trade) => {
          return trade.data !== null &&
                 trade.ativo !== null &&
                 trade.direcao !== null &&
                 trade.percentual !== null &&
                 trade.alvo !== null;
        });

        setInitialTrades(validTrades);
        setLoading(false);
      } catch (error) {
        console.error('Erro detalhado:', error);
        setLoading(false);
      }
    }

    getTrades();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      
      // Define a data alvo: 05/02/2025 19:00 GMT-3
      const targetDate = new Date('2025-02-05T22:00:00.000Z'); // 19:00 BRT = 22:00 UTC
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const months = [
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' },
    { number: 1, name: 'Janeiro' }
  ];

  const filteredData = initialTrades.filter(trade => {
    const matchesSearch = trade.ativo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDirection = selectedDirection === 'ALL' || trade.direcao === selectedDirection;
    
    const tradeDate = new Date(trade.data);
    const tradeMonth = tradeDate.getMonth() + 1;
    const matchesMonth = tradeMonth === selectedMonth;
    
    if (selectedMonth !== 11 && selectedMonth !== 12 && selectedMonth !== 1) {
        return matchesSearch && matchesDirection && matchesMonth;
    }
    return false;
  }).concat(
    selectedMonth === 11 ? [
        {"data": "01/11/2024", "ativo": "SUI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "01/11/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
        {"data": "01/11/2024", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "01/11/2024", "ativo": "ENA/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "02/11/2024", "ativo": "OGN/USDT", "direcao": "LONG", "percentual": 180.80, "alvo": "10"},
        {"data": "02/11/2024", "ativo": "RARE/USDT", "direcao": "LONG", "percentual": 21.20, "alvo": "2"},
        {"data": "02/11/2024", "ativo": "NEIRO/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
        {"data": "02/11/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "02/11/2024", "ativo": "SANTOS/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
        {"data": "03/11/2024", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
        {"data": "03/11/2024", "ativo": "APE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "03/11/2024", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "03/11/2024", "ativo": "DODOX/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "03/11/2024", "ativo": "GHTS/USDT", "direcao": "LONG", "percentual": 200.40, "alvo": "11"},
        {"data": "03/11/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
        {"data": "04/11/2024", "ativo": "SCR/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "04/11/2024", "ativo": "ARB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "04/11/2024", "ativo": "UXLINK/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
        {"data": "04/11/2024", "ativo": "SAGA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "04/11/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "05/11/2024", "ativo": "POPCAT/USDT", "direcao": "SHORT", "percentual": 120.00, "alvo": "7"},
        {"data": "05/11/2024", "ativo": "MASK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "05/11/2024", "ativo": "LTC/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "05/11/2024", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "06/11/2024", "ativo": "UXLINK/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
        {"data": "06/11/2024", "ativo": "MANA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "06/11/2024", "ativo": "METIS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "06/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "07/11/2024", "ativo": "RARE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "07/11/2024", "ativo": "SKL/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
        {"data": "07/11/2024", "ativo": "VOXEL/USDT", "direcao": "SHORT", "percentual": 40.40, "alvo": "3"},
        {"data": "08/11/2024", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "08/11/2024", "ativo": "POL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "08/11/2024", "ativo": "NOT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "08/11/2024", "ativo": "STORJ/USDT", "direcao": "LONG", "percentual": 180.40, "alvo": "10"},
        {"data": "09/11/2024", "ativo": "REF/USDT", "direcao": "SHORT", "percentual": 30.10, "alvo": "4"},
        {"data": "09/11/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "09/11/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "12/11/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 80.80, "alvo": "5"},
        {"data": "12/11/2024", "ativo": "NEIRO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "12/11/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "13/11/2024", "ativo": "CETUS/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "13/11/2024", "ativo": "SUI/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "13/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
        {"data": "13/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "14/11/2024", "ativo": "BNX/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "14/11/2024", "ativo": "1000RATS/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
        {"data": "14/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "14/11/2024", "ativo": "PNUT/USDT", "direcao": "SHORT", "percentual": 100.00, "alvo": "6"},
        {"data": "15/11/2024", "ativo": "HMSTR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "16/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "16/11/2024", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "16/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "16/11/2024", "ativo": "1INCH/USDT", "direcao": "SHORT", "percentual": 80.00, "alvo": "5"},
        {"data": "16/11/2024", "ativo": "HIPPO/USDT", "direcao": "SHORT", "percentual": 60.20, "alvo": "4"},
        {"data": "17/11/2024", "ativo": "ALGO/USDT", "direcao": "LONG", "percentual": 201.00, "alvo": "11"},
        {"data": "17/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "17/11/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 205.60, "alvo": "11"},
        {"data": "17/11/2024", "ativo": "GRASS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "17/11/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "18/11/2024", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "18/11/2024", "ativo": "ANKR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "18/11/2024", "ativo": "XVG/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
        {"data": "18/11/2024", "ativo": "GOAT/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "19/11/2024", "ativo": "BRETT/USDT", "direcao": "SHORT", "percentual": 200.00, "alvo": "11"},
        {"data": "19/11/2024", "ativo": "PEOPLE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "19/11/2024", "ativo": "FIO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "19/11/2024", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "20/11/2024", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "21/11/2024", "ativo": "CRV/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
        {"data": "21/11/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "21/11/2024", "ativo": "SUISHI/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
        {"data": "21/11/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
        {"data": "21/11/2024", "ativo": "EIGEN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "21/11/2024", "ativo": "ACT/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "22/11/2024", "ativo": "INJ/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "22/11/2024", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "22/11/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "22/11/2024", "ativo": "1000SATS/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "23/11/2024", "ativo": "LRC/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "23/11/2024", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "23/11/2024", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 40.80, "alvo": "3"},
        {"data": "23/11/2024", "ativo": "MANTA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "24/11/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "24/11/2024", "ativo": "SAGA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "24/11/2024", "ativo": "SANTOS/USDT", "direcao": "SHORT", "percentual": 100.40, "alvo": "6"},
        {"data": "24/11/2024", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "24/11/2024", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "24/11/2024", "ativo": "YGG/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "25/11/2024", "ativo": "AVAX/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "25/11/2024", "ativo": "MKR/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "25/11/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 120.20, "alvo": "7"},
        {"data": "25/11/2024", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 140.60, "alvo": "7"},
        {"data": "26/11/2024", "ativo": "OP/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "26/11/2024", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "26/11/2024", "ativo": "HIFI/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
        {"data": "26/11/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "26/11/2024", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
        {"data": "26/11/2024", "ativo": "IOTX/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
        {"data": "27/11/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "27/11/2024", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "28/11/2024", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "28/11/2024", "ativo": "VANRY/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "28/11/2024", "ativo": "SNX/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
        {"data": "28/11/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 60.60, "alvo": "4"},
        {"data": "28/11/2024", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "28/11/2024", "ativo": "ARKM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "29/11/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : selectedMonth === 1 ? [
      {"data": "01/01/2025", "ativo": "GRT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "01/01/2025", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "01/01/2025", "ativo": "POPCAT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "01/01/2025", "ativo": "ONODO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "02/01/2025", "ativo": "XAI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "02/01/2025", "ativo": "ATA/USDT", "direcao": "SHORT", "percentual": 40.60, "alvo": "3"},
      {"data": "02/01/2025", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "02/01/2025", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "02/01/2025", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 181.20, "alvo": "10"},
      {"data": "03/01/2025", "ativo": "1000CHEEMS/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "03/01/2025", "ativo": "GRIFFAIN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "03/01/2025", "ativo": "1000CAT/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "04/01/2025", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 20.40, "alvo": "2"},
      {"data": "04/01/2025", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "04/01/2025", "ativo": "SXP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "04/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 81.00, "alvo": "4"},
      {"data": "04/01/2025", "ativo": "DF/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "05/01/2025", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "5"},
      {"data": "05/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "05/01/2025", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
      {"data": "05/01/2025", "ativo": "AXS/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "05/01/2025", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "05/01/2025", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "06/01/2025", "ativo": "ONE/USDT", "direcao": "LONG", "percentual": 80.40, "alvo": "5"},
      {"data": "06/01/2025", "ativo": "HIVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "06/01/2025", "ativo": "ZEREBRO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "07/01/2025", "ativo": "ZEN/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "07/01/2025", "ativo": "VANA/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "07/01/2025", "ativo": "APT/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "07/01/2025", "ativo": "ENA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "07/01/2025", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "07/01/2025", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 180.80, "alvo": "10"},
      {"data": "07/01/2025", "ativo": "ACT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/01/2025", "ativo": "FARTCOIN/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/01/2025", "ativo": "AI/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/01/2025", "ativo": "ALCH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/01/2025", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "08/01/2025", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "08/01/2025", "ativo": "DOGS/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "09/01/2025", "ativo": "GAS/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "09/01/2025", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
      {"data": "09/01/2025", "ativo": "GTC/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "09/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "09/01/2025", "ativo": "WAXP/USDT", "direcao": "LONG", "percentual": 40.40, "alvo": "3"},
      {"data": "09/01/2025", "ativo": "POWR/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "09/01/2025", "ativo": "IOST/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
      {"data": "09/01/2025", "ativo": "FARTCOIN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "10/01/2025", "ativo": "RENDER/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "10/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "10/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "10/01/2025", "ativo": "COOKIE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "10/01/2025", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "11/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
      {"data": "11/01/2025", "ativo": "VET/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "11/01/2025", "ativo": "T/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "11/01/2025", "ativo": "AVA/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "11/01/2025", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "12/01/2025", "ativo": "BAN/USDT", "direcao": "SHORT", "percentual": 163.00, "alvo": "9"},
      {"data": "12/01/2025", "ativo": "POPCAT/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "12/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "12/01/2025", "ativo": "WOO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "12/01/2025", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "13/01/2025", "ativo": "BNX/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
      {"data": "13/01/2025", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "13/01/2025", "ativo": "COMP/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "13/01/2025", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
      {"data": "13/01/2025", "ativo": "LQTY/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "14/01/2025", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "15/01/2025", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "15/01/2025", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 179.80, "alvo": "10"},
      {"data": "15/01/2025", "ativo": "AI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "15/01/2025", "ativo": "SFP/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
      {"data": "16/01/2025", "ativo": "ZEREBRO/USDT", "direcao": "LONG", "percentual": 79.80, "alvo": "5"},
      {"data": "16/01/2025", "ativo": "VIDT/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "16/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "16/01/2025", "ativo": "IOST/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "16/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/01/2025", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "16/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "17/01/2025", "ativo": "SPX/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "17/01/2025", "ativo": "MINA/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "17/01/2025", "ativo": "1000BONK/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "17/01/2025", "ativo": "SPELL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "18/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "18/01/2025", "ativo": "UXLINK/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "18/01/2025", "ativo": "BEL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "18/01/2025", "ativo": "LTC/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "18/01/2025", "ativo": "WLD/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "19/01/2025", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "19/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "19/01/2025", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "19/01/2025", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "19/01/2025", "ativo": "1000CAT/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
      {"data": "19/01/2025", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "19/01/2025", "ativo": "KAVA/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "19/01/2025", "ativo": "SOLV/USDT", "direcao": "LONG", "percentual": 81.00, "alvo": "5"},
      {"data": "19/01/2025", "ativo": "DOG/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "20/01/2025", "ativo": "AIXBT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "20/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "20/01/2025", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "20/01/2025", "ativo": "OMNI/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "20/01/2025", "ativo": "SYN/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "20/01/2025", "ativo": "BEL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "20/01/2025", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 21.20, "alvo": "2"},
      {"data": "21/01/2025", "ativo": "SPX/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "21/01/2025", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "21/01/2025", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "21/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 140.20, "alvo": "8"},
      {"data": "22/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "22/01/2025", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "22/01/2025", "ativo": "TRUMP/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "22/01/2025", "ativo": "DENT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "22/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "23/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 61.40, "alvo": "4"},
      {"data": "23/01/2025", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 102.20, "alvo": "6"},
      {"data": "23/01/2025", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "23/01/2025", "ativo": "D/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "23/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "23/01/2025", "ativo": "KSM/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "23/01/2025", "ativo": "ONDO/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "23/01/2025", "ativo": "SWARMS/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "24/01/2025", "ativo": "STEEM/USDT", "direcao": "SHORT", "percentual": 20.00, "alvo": "2"},
      {"data": "24/01/2025", "ativo": "EIGEN/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "24/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
      {"data": "25/01/2025", "ativo": "BB/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
      {"data": "25/01/2025", "ativo": "ACT/USDT", "direcao": "SHORT", "percentual": 80.00, "alvo": "5"},
      {"data": "25/01/2025", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
      {"data": "25/01/2025", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "25/01/2025", "ativo": "COOKIE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "25/01/2025", "ativo": "VINE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "26/01/2025", "ativo": "MELANIA/USDT", "direcao": "LONG", "percentual": 40.40, "alvo": "3"},
      {"data": "26/01/2025", "ativo": "SWARMS/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "26/01/2025", "ativo": "D/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "26/01/2025", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "26/01/2025", "ativo": "SONIC/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "26/01/2025", "ativo": "GRUFFAIN/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
      {"data": "27/01/2025", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "27/01/2025", "ativo": "HOT/USDT", "direcao": "LONG", "percentual": 100.60, "alvo": "6"},
      {"data": "27/01/2025", "ativo": "TRUMP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "27/01/2025", "ativo": "JUP/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "28/01/2025", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "28/01/2025", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "28/01/2025", "ativo": "ACH/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "28/01/2025", "ativo": "RPL/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "28/01/2025", "ativo": "DUSK/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
      {"data": "28/01/2025", "ativo": "ORDI/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
      {"data": "29/01/2025", "ativo": "JUP/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "29/01/2025", "ativo": "AXL/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
      {"data": "29/01/2025", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 160.20, "alvo": "9"},
      {"data": "29/01/2025", "ativo": "TON/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
      {"data": "29/01/2025", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 102.80, "alvo": "6"},
      {"data": "29/01/2025", "ativo": "EOS/USDT", "direcao": "LONG", "percentual": 182.00, "alvo": "10"},
      {"data": "30/01/2025", "ativo": "ARC/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
      {"data": "30/01/2025", "ativo": "VINE/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "30/01/2025", "ativo": "1000CHEEMS/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "30/01/2025", "ativo": "W/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
      {"data": "30/01/2025", "ativo": "RUNE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
      {"data": "31/01/2025", "ativo": "ANIME/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "31/01/2025", "ativo": "TNSR/USDT", "direcao": "LONG", "percentual": 200.20, "alvo": "11"},
      {"data": "31/01/2025", "ativo": "LDO/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
      {"data": "31/01/2025", "ativo": "DEXE/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
      {"data": "31/01/2025", "ativo": "PEOPLE/USDT", "direcao": "SHORT", "percentual": -90.00, "alvo": "-"},
      {"data": "31/01/2025", "ativo": "DYDX/USDT", "direcao": "LONG", "percentual": 61.20, "alvo": "4"},
      {"data": "31/01/2025", "ativo": "SKL/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
      {"data": "31/01/2025", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"}
      
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : selectedMonth === 12 ? [
        {"data": "01/12/2024", "ativo": "BLUR/USDT", "direcao": "SHORT", "percentual": 87.00, "alvo": "11"},
        {"data": "01/12/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "01/12/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "02/12/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "02/12/2024", "ativo": "GTM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "03/12/2024", "ativo": "JASMY/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "03/12/2024", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "03/12/2024", "ativo": "ALT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "03/12/2024", "ativo": "MEW/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "04/12/2024", "ativo": "THE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "04/12/2024", "ativo": "GALA/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "04/12/2024", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "04/12/2024", "ativo": "RLP/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "05/12/2024", "ativo": "OTX/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
        {"data": "05/12/2024", "ativo": "ICP/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
        {"data": "05/12/2024", "ativo": "ARK/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "05/12/2024", "ativo": "SWELL/USDT", "direcao": "LONG", "percentual": 100.20, "alvo": "6"},
        {"data": "06/12/2024", "ativo": "RENDER/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
        {"data": "06/12/2024", "ativo": "FTM/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "06/12/2024", "ativo": "OMNI/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "06/12/2024", "ativo": "XRP/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "07/12/2024", "ativo": "OP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "07/12/2024", "ativo": "WIF/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "08/12/2024", "ativo": "1000PEPE/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "08/12/2024", "ativo": "LOKA/USDT", "direcao": "SHORT", "percentual": 40.00, "alvo": "3"},
        {"data": "09/12/2024", "ativo": "RSR/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "09/12/2024", "ativo": "FIO/USDT", "direcao": "LONG", "percentual": 80.20, "alvo": "5"},
        {"data": "09/12/2024", "ativo": "CELO/USDT", "direcao": "LONG", "percentual": 21.00, "alvo": "2"},
        {"data": "09/12/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "09/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "09/12/2024", "ativo": "DOT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "09/12/2024", "ativo": "1000FLOKI/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "09/12/2024", "ativo": "1MBABYDOGE/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "10/12/2024", "ativo": "ONE/USDT", "direcao": "SHORT", "percentual": 200.00, "alvo": "11"},
        {"data": "10/12/2024", "ativo": "AMB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "10/12/2024", "ativo": "MTL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "10/12/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "10/12/2024", "ativo": "ATOM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "10/12/2024", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "10/12/2024", "ativo": "ATA/USDT", "direcao": "LONG", "percentual": 201.40, "alvo": "11"},
        {"data": "11/12/2024", "ativo": "COTI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "11/12/2024", "ativo": "AAVE/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "11/12/2024", "ativo": "ZRO/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "12/12/2024", "ativo": "DYM/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "12/12/2024", "ativo": "CHESS/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "12/12/2024", "ativo": "TLM/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "12/12/2024", "ativo": "ALPACA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "14/12/2024", "ativo": "BB/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "14/12/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": 140.40, "alvo": "8"},
        {"data": "14/12/2024", "ativo": "ZK/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "14/12/2024", "ativo": "MORPHO/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "14/12/2024", "ativo": "DOGE/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "14/12/2024", "ativo": "ENA/USDT", "direcao": "SHORT", "percentual": 120.00, "alvo": "7"},
        {"data": "14/12/2024", "ativo": "XVG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "21/12/2024", "ativo": "ZRO/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "21/12/2024", "ativo": "CHR/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
        {"data": "21/12/2024", "ativo": "BICO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "21/12/2024", "ativo": "IO/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "21/12/2024", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "21/12/2024", "ativo": "SOL/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "21/12/2024", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "ACH/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "BCH/USDT", "direcao": "LONG", "percentual": 140.00, "alvo": "8"},
        {"data": "22/12/2024", "ativo": "DEGEN/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "PNUT/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "22/12/2024", "ativo": "AGLD/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "22/12/2024", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "22/12/2024", "ativo": "SUSHI/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "REZ/USDT", "direcao": "LONG", "percentual": 200.40, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "C98/USDT", "direcao": "LONG", "percentual": 200.60, "alvo": "11"},
        {"data": "22/12/2024", "ativo": "XLM/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "23/12/2024", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 60.00, "alvo": "4"},
        {"data": "23/12/2024", "ativo": "VIRTUAL/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "23/12/2024", "ativo": "10000MOG/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "23/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 180.00, "alvo": "10"},
        {"data": "23/12/2024", "ativo": "ETH/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "24/12/2024", "ativo": "PENGU/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "24/12/2024", "ativo": "LINK/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "24/12/2024", "ativo": "DYDX/USDT", "direcao": "LONG", "percentual": 120.60, "alvo": "7"},
        {"data": "24/12/2024", "ativo": "SFP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "24/12/2024", "ativo": "HBAR/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "24/12/2024", "ativo": "1000RATS/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
        {"data": "24/12/2024", "ativo": "ADA/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "24/12/2024", "ativo": "LUMIA/USDT", "direcao": "LONG", "percentual": 60.60, "alvo": "4"},
        {"data": "25/12/2024", "ativo": "AIXB/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "25/12/2024", "ativo": "COW/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "25/12/2024", "ativo": "KOMA/USDT", "direcao": "LONG", "percentual": 100.00, "alvo": "6"},
        {"data": "25/12/2024", "ativo": "ME/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "25/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 21.60, "alvo": "2"},
        {"data": "26/12/2024", "ativo": "DODX/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "26/12/2024", "ativo": "ZEC/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "26/12/2024", "ativo": "MOVE/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "26/12/2024", "ativo": "ZEN/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "26/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 80.00, "alvo": "5"},
        {"data": "26/12/2024", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": 201.40, "alvo": "11"},
        {"data": "27/12/2024", "ativo": "STEEM/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "27/12/2024", "ativo": "THE/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "27/12/2024", "ativo": "VIDT/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"},
        {"data": "27/12/2024", "ativo": "NEAR/USDT", "direcao": "LONG", "percentual": 60.20, "alvo": "4"},
        {"data": "28/12/2024", "ativo": "SSV/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "28/12/2024", "ativo": "MOODENG/USDT", "direcao": "LONG", "percentual": 160.00, "alvo": "9"},
        {"data": "28/12/2024", "ativo": "LIT/USDT", "direcao": "LONG", "percentual": -90.00, "alvo": "-"},
        {"data": "29/12/2024", "ativo": "ICP/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "29/12/2024", "ativo": "XTZ/USDT", "direcao": "LONG", "percentual": 20.60, "alvo": "2"},
        {"data": "29/12/2024", "ativo": "CRV/USDT", "direcao": "LONG", "percentual": 20.20, "alvo": "2"},
        {"data": "29/12/2024", "ativo": "AVA/USDT", "direcao": "LONG", "percentual": 120.00, "alvo": "7"},
        {"data": "30/12/2024", "ativo": "NEIROETH/USDT", "direcao": "LONG", "percentual": 40.20, "alvo": "3"},
        {"data": "30/12/2024", "ativo": "SXP/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "30/12/2024", "ativo": "BAN/USDT", "direcao": "LONG", "percentual": 41.60, "alvo": "3"},
        {"data": "30/12/2024", "ativo": "QNT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "30/12/2024", "ativo": "HOOK/USDT", "direcao": "LONG", "percentual": 60.40, "alvo": "4"},
        {"data": "30/12/2024", "ativo": "ALICE/USDT", "direcao": "LONG", "percentual": 80.80, "alvo": "5"},
        {"data": "31/12/2024", "ativo": "ACTION/USDT", "direcao": "LONG", "percentual": 40.00, "alvo": "3"},
        {"data": "31/12/2024", "ativo": "MEU/USDT", "direcao": "LONG", "percentual": 20.40, "alvo": "2"},
        {"data": "31/12/2024", "ativo": "CGPT/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "31/12/2024", "ativo": "1000BONK/USDT", "direcao": "LONG", "percentual": 20.00, "alvo": "2"},
        {"data": "31/12/2024", "ativo": "TROY/USDT", "direcao": "LONG", "percentual": 200.00, "alvo": "11"}
    ].filter(trade => 
        trade.ativo.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedDirection === 'ALL' || trade.direcao === selectedDirection)
    ) : []
  );

  const totalOperacoes = selectedMonth === 12 ? 154 : selectedMonth === 1 ? 167 : filteredData.length;
  const operacoesLucrativas = selectedMonth === 12 ? 137 : selectedMonth === 1 ? 151 : filteredData.filter(t => t.percentual > 0).length;
  const taxaAcerto = selectedMonth === 12 ? 89.0 : selectedMonth === 1 ? 90.4 : (totalOperacoes > 0 ? ((operacoesLucrativas / totalOperacoes) * 100) : 0);
  const valorizacaoTotal = selectedMonth === 12 ? 11917 : selectedMonth === 1 ? 13134 : Number(filteredData.reduce((acc, curr) => {
    const valor = typeof curr.percentual === 'string' 
      ? parseFloat(curr.percentual) 
      : curr.percentual;
    return acc + valor;
  }, 0));

  const calculateResult = () => {
    if (!capital || !selectedTarget) return;
    
    const targetData = (selectedMonth === 8 ? [
      { alvo: "Alvo 2", operacoes: 45, vitoria: 81, lucro: -10 },
      { alvo: "Alvo 3", operacoes: 36, vitoria: 65, lucro: 8 },
      { alvo: "Alvo 4", operacoes: 22, vitoria: 40, lucro: -12 },
      { alvo: "Alvo 5", operacoes: 16, vitoria: 29, lucro: -20 },
      { alvo: "Alvo 6", operacoes: 10, vitoria: 18, lucro: -40 },
      { alvo: "Alvo 7", operacoes: 4, vitoria: 7, lucro: -72 },
      { alvo: "Alvo 8", operacoes: 4, vitoria: 7, lucro: -68 },
      { alvo: "Alvo 9", operacoes: 1, vitoria: 1, lucro: -91 },
      { alvo: "Alvo 10", operacoes: 1, vitoria: 1, lucro: -90 },
      { alvo: "Alvo 11", operacoes: 1, vitoria: 1, lucro: -89 }
    ] : selectedMonth === 9 ? [
      { alvo: "Alvo 2", operacoes: 68, vitoria: 75, lucro: 26 },
      { alvo: "Alvo 3", operacoes: 63, vitoria: 70, lucro: 79 },
      { alvo: "Alvo 4", operacoes: 56, vitoria: 62, lucro: 114 },
      { alvo: "Alvo 5", operacoes: 43, vitoria: 47, lucro: 105 },
      { alvo: "Alvo 6", operacoes: 39, vitoria: 43, lucro: 124 },
      { alvo: "Alvo 7", operacoes: 36, vitoria: 40, lucro: 142 },
      { alvo: "Alvo 8", operacoes: 31, vitoria: 34, lucro: 138 },
      { alvo: "Alvo 9", operacoes: 25, vitoria: 27, lucro: 115 },
      { alvo: "Alvo 10", operacoes: 23, vitoria: 25, lucro: 120 },
      { alvo: "Alvo 11", operacoes: 21, vitoria: 23, lucro: 121 }
    ] : selectedMonth === 10 ? [
      { alvo: "Alvo 2", operacoes: 95, vitoria: 87, lucro: 60 },
      { alvo: "Alvo 3", operacoes: 84, vitoria: 77, lucro: 122 },
      { alvo: "Alvo 4", operacoes: 69, vitoria: 63, lucro: 146 },
      { alvo: "Alvo 5", operacoes: 56, vitoria: 51, lucro: 150 },
      { alvo: "Alvo 6", operacoes: 47, vitoria: 43, lucro: 152 },
      { alvo: "Alvo 7", operacoes: 43, vitoria: 39, lucro: 171 },
      { alvo: "Alvo 8", operacoes: 38, vitoria: 35, lucro: 174 },
      { alvo: "Alvo 9", operacoes: 32, vitoria: 29, lucro: 158 },
      { alvo: "Alvo 10", operacoes: 29, vitoria: 26, lucro: 160 },
      { alvo: "Alvo 11", operacoes: 24, vitoria: 22, lucro: 134 }
    ] : selectedMonth === 11 ? [
      { alvo: "Alvo 2", operacoes: 95, vitoria: 87, lucro: 60 },
      { alvo: "Alvo 3", operacoes: 84, vitoria: 77, lucro: 122 },
      { alvo: "Alvo 4", operacoes: 69, vitoria: 63, lucro: 146 },
      { alvo: "Alvo 5", operacoes: 56, vitoria: 51, lucro: 150 },
      { alvo: "Alvo 6", operacoes: 47, vitoria: 43, lucro: 152 },
      { alvo: "Alvo 7", operacoes: 43, vitoria: 39, lucro: 171 },
      { alvo: "Alvo 8", operacoes: 38, vitoria: 35, lucro: 174 },
      { alvo: "Alvo 9", operacoes: 32, vitoria: 29, lucro: 158 },
      { alvo: "Alvo 10", operacoes: 29, vitoria: 26, lucro: 160 },
      { alvo: "Alvo 11", operacoes: 24, vitoria: 22, lucro: 134 }
    ] : selectedMonth === 12 ? [
      { alvo: "Alvo 2", operacoes: 134, vitoria: 88, lucro: 98 },
      { alvo: "Alvo 3", operacoes: 105, vitoria: 69, lucro: 145 },
      { alvo: "Alvo 4", operacoes: 89, vitoria: 58, lucro: 186 },
      { alvo: "Alvo 5", operacoes: 89, vitoria: 58, lucro: 275 },
      { alvo: "Alvo 6", operacoes: 77, vitoria: 50, lucro: 292 },
      { alvo: "Alvo 7", operacoes: 63, vitoria: 41, lucro: 271 },
      { alvo: "Alvo 8", operacoes: 55, vitoria: 36, lucro: 270 },
      { alvo: "Alvo 9", operacoes: 49, vitoria: 32, lucro: 271 },
      { alvo: "Alvo 10", operacoes: 42, vitoria: 27, lucro: 250 },
      { alvo: "Alvo 11", operacoes: 32, vitoria: 21, lucro: 182 }
    ] : []).find(t => t.alvo === selectedTarget);
    
    if (!targetData) return;

    const initialCapital = parseFloat(capital);
    const profit = targetData.lucro / 100;
    const finalValue = initialCapital * (1 + profit);
    setResult(finalValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <p className="text-white">Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Countdown Section */}
      <section className="py-8 px-4 bg-black/50 backdrop-blur-sm border-b border-green-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-sm text-green-400 mb-4 uppercase tracking-wider font-medium">
            {language === 'pt' 
              ? 'Liberação do Desconto + 1 Ano de Acesso ao Futuros Tech em:' 
              : 'Discount Release + 1 Year Access to Futuros Tech in:'}
          </h3>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-white mb-8">
            <div className="bg-green-500/5 border border-green-500/20 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-light text-green-400">{timeLeft.days}</div>
              <div className="text-[10px] md:text-xs text-neutral-400">{language === 'pt' ? 'Dias' : 'Days'}</div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-light text-green-400">{timeLeft.hours}</div>
              <div className="text-[10px] md:text-xs text-neutral-400">{language === 'pt' ? 'Horas' : 'Hours'}</div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-light text-green-400">{timeLeft.minutes}</div>
              <div className="text-[10px] md:text-xs text-neutral-400">{language === 'pt' ? 'Minutos' : 'Minutes'}</div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 backdrop-blur-sm px-3 py-2 md:px-6 md:py-3 rounded-lg">
              <div className="text-xl md:text-3xl font-light text-green-400">{timeLeft.seconds}</div>
              <div className="text-[10px] md:text-xs text-neutral-400">{language === 'pt' ? 'Segundos' : 'Seconds'}</div>
            </div>
          </div>

          {/* Botão Ver Aula Completa */}
          <div className="mt-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 px-6 py-2 text-xs hover:bg-white/5 transition-colors"
            >
              <BarChart className="h-4 w-4" />
              {language === 'pt' ? 'Ver Aula Completa' : 'Watch Full Class'}
            </Link>
          </div>
        </div>
      </section>

      <main className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Pesquisar Ativo</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex: BTC/USDT"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Direção</label>
              <select
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value as 'ALL' | 'LONG' | 'SHORT')}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300"
              >
                <option value="ALL">Todas</option>
                <option value="LONG">Long</option>
                <option value="SHORT">Short</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">Mês</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300"
              >
                {months.map((month) => (
                  <option key={month.number} value={month.number}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <PieChart className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-400">Win Rate</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white">
                  {taxaAcerto?.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">
                  {operacoesLucrativas}/{totalOperacoes}
                </span>
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-400">Resultado Total</span>
              </div>
              <div className="text-2xl font-light text-white">
                {valorizacaoTotal > 0 ? '+' : ''}{valorizacaoTotal?.toFixed(1)}%
              </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                <span className="text-sm text-gray-400">Total de Sinais</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-white">{totalOperacoes}</span>
                <span className="text-xs text-gray-500">operações</span>
              </div>
            </div>
          </div>

          {/* Tabela responsiva */}
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle px-4 md:px-0">
              <table className="min-w-full divide-y divide-gray-800 text-sm">
                <thead>
                  <tr>
                    <th scope="col" className="py-3 text-left text-xs font-medium text-gray-400">Data</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">Ativo</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">Direção</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">Resultado</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-400">Alvo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredData.map((trade, index) => (
                    <tr key={index} className="hover:bg-gray-800/50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-300 sm:pl-0">
                        {formatDate(trade.data)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-300">
                        {trade.ativo}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          trade.direcao === 'LONG'
                            ? 'bg-green-400/10 text-green-400 ring-green-400/20'
                            : 'bg-red-400/10 text-red-400 ring-red-400/20'
                        }`}>
                          {trade.direcao}
                        </span>
                      </td>
                      <td className={`whitespace-nowrap px-3 py-4 text-sm ${
                        trade.percentual >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {trade.percentual >= 0 ? '+' : ''}{trade.percentual}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {trade.alvo}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botão Grupo Premium */}
          <div className="text-center mt-8">
            <Link 
              href="https://t.me/+mZs1t5_biYFmMTBh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 px-6 py-2 text-xs hover:bg-white/5 transition-colors"
            >
              <BarChart className="h-4 w-4" />
              {language === 'pt' ? 'Grupo Premium' : 'Premium Group'}
            </Link>
          </div>
        </div>
      </main>

      {/* Language Selector */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <Globe className="h-3 w-3" />
          {language.toUpperCase()}
        </button>
      </div>

      <FloatingGroupButton />
    </div>
  );
}
