"use client";

import { BarChart, Briefcase, Book, ChevronDown, PieChart, TrendingUp, ChevronRight, Globe, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from 'next/link';
import { translations } from '@/translations';
import FloatingGroupButton from '@/components/FloatingGroupButton';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { trackFacebookEvent } from '@/lib/facebook';

type Country = {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
};

export default function Home() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number>(1);
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const t = translations[language];
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const monthsList = [
    { number: 8, name: 'Agosto' },
    { number: 9, name: 'Setembro' },
    { number: 10, name: 'Outubro' },
    { number: 11, name: 'Novembro' },
    { number: 12, name: 'Dezembro' },
    { number: 1, name: 'Janeiro' }
  ];

  const monthlyResults = {
    8: { winRate: "81.0", wins: "45/55", total: "11.917" },
    9: { winRate: "85.0", wins: "68/80", total: "13.254" },
    10: { winRate: "87.0", wins: "95/109", total: "14.122" },
    11: { winRate: "88.0", wins: "88/100", total: "15.345" },
    12: { winRate: "89.0", wins: "137/154", total: "11.917" },
    1: { winRate: "90.4", wins: "151/167", total: "13.134" }
  };

  const currentResults = monthlyResults[selectedMonth as keyof typeof monthlyResults];

  const resultadosMensais = [2292, 1148, 495, 1338, 755, 476, 503, 305, 1907, 875, 1462, 426];

  const [showCalculator, setShowCalculator] = useState(false);
  const [investimento, setInvestimento] = useState('');
  const [meses, setMeses] = useState('1');
  const [alavancagem, setAlavancagem] = useState(10);
  const [resultado, setResultado] = useState<{ valor: string; percentual: string } | null>(null);

  const calcularRetorno = () => {
    const investimentoNum = parseFloat(investimento);
    const mesesNum = parseInt(meses);
    const alavancagemDecimal = alavancagem / 100;

    if (isNaN(investimentoNum) || mesesNum < 1 || mesesNum > 12) return;

    let capitalFinal = investimentoNum;
    let percentualTotal = 0;

    for (let i = 0; i < mesesNum; i++) {
      const percentualMes = (resultadosMensais[i] / 100) * alavancagemDecimal;
      capitalFinal += capitalFinal * percentualMes;
      percentualTotal += resultadosMensais[i];
    }

    const percentualMedio = percentualTotal / mesesNum;

    setResultado({
      valor: capitalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      percentual: percentualMedio.toFixed(2)
    });
  };

  const toggleQuestion = (index: number) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

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

  // Add redirect effect
  useEffect(() => {
    window.location.href = 'https://ai.k17.com.br';
  }, []);

  const countries: Country[] = [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', dialCode: '55' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '351' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '1' },
    { code: 'ES', name: 'España', flag: '🇪🇸', dialCode: '34' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '54' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '61' },
    { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '32' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '1' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '56' },
    { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '86' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '57' },
    { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '45' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '33' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '49' },
    { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', dialCode: '852' },
    { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '91' },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '62' },
    { code: 'IE', name: 'Ireland', flag: '🇪🇪', dialCode: '353' },
    { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '972' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '39' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '81' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '60' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '52' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '31' },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '64' },
    { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '47' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '51' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '63' },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '48' },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '7' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '65' },
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '27' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '82' },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '46' },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '41' },
    { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '886' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '66' },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '90' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', dialCode: '971' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '44' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '598' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '58' },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '84' }
  ].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="font-montserrat bg-black text-white min-h-screen relative">
      <div className="relative">
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

            {/* Botão Ver Relatório Completo */}
            <div className="mt-8">
              <Link 
                href="/resultados" 
                className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 px-6 py-2 text-xs hover:bg-white/5 transition-colors"
              >
                <BarChart className="h-4 w-4" />
                {language === 'pt' ? 'Ver Relatório Completo' : 'View Full Report'}
              </Link>
            </div>
          </div>
        </section>

        {/* Hero Section com Vídeo */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <Image
              src="/fip.jpg"
              alt="FIP"
              width={120}
              height={120}
              className="mx-auto mb-8"
            />

            {/* Video Embed */}
            <div className="aspect-video w-full mb-12">
              <iframe
                src="https://player-vz-7b6cf9e4-8bf.tv.pandavideo.com.br/embed/?v=6a82bc71-be86-4d83-be38-99cf230e7298"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* Preview dos Resultados - Movido para cima */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-light text-center mb-12 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
              {language === 'pt' ? 'Resultados Comprovados' : 'Verified Results'}
            </h2>

            {/* Seletor de Mês */}
            <div className="flex justify-center mb-8">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-transparent border border-neutral-800 text-neutral-300 px-4 py-2 text-xs rounded-lg focus:outline-none focus:border-neutral-700"
              >
                {monthsList.map((month) => (
                  <option key={month.number} value={month.number} className="bg-black">
                    {month.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-8">
              <div className="bg-black border border-neutral-800 rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <PieChart className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                  <span className="text-sm text-neutral-400">Win Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light text-white">{currentResults.winRate}%</span>
                  <span className="text-xs text-neutral-500">{currentResults.wins}</span>
                </div>
              </div>

              <div className="bg-black border border-neutral-800 rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-emerald-400" strokeWidth={1.5} />
                  <span className="text-sm text-neutral-400">Resultado Total</span>
                </div>
                <div className="text-2xl font-light text-white">
                  +{currentResults.total}%
                </div>
              </div>

              <div className="bg-black border border-neutral-800 rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart className="h-4 w-4 text-green-400" strokeWidth={1.5} />
                  <span className="text-sm text-neutral-400">Total de Entradas</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light text-white">{currentResults.wins.split('/')[1]}</span>
                  <span className="text-xs text-neutral-500">operações</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/resultados" 
                className="inline-flex items-center gap-2 border border-neutral-800 text-neutral-300 px-6 py-2 text-xs hover:bg-white/5 transition-colors"
              >
                <BarChart className="h-4 w-4" />
                {language === 'pt' ? 'Ver Relatório Completo' : 'View Full Report'}
              </Link>
            </div>
          </div>
        </section>

        {/* Calculadora Section - Movida para cima */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light mb-2 bg-gradient-to-r from-neutral-400 to-white bg-clip-text text-transparent">
                {language === 'pt' ? 'Calculadora de Retorno' : 'Return Calculator'}
              </h2>
              <p className="text-sm text-neutral-400">
                {language === 'pt' 
                  ? 'Simule seus possíveis resultados'
                  : 'Simulate your potential returns'}
              </p>
            </div>

            <div className="bg-white/[0.02] border border-neutral-800 rounded-lg p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  {language === 'pt' ? 'Investimento Inicial (R$)' : 'Initial Investment (R$)'}
                </label>
                <input
                  type="number"
                  value={investimento}
                  onChange={(e) => setInvestimento(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  {language === 'pt' ? 'Período (meses)' : 'Period (months)'}
                </label>
                <select
                  value={meses}
                  onChange={(e) => setMeses(e.target.value)}
                  className="w-full bg-black border border-neutral-800 rounded px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-black">
                      {i + 1} {language === 'pt' ? 'meses' : 'months'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  {language === 'pt' ? 'Alavancagem' : 'Leverage'}: {alavancagem}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={alavancagem}
                  onChange={(e) => setAlavancagem(parseInt(e.target.value))}
                  className="w-full accent-green-500"
                />
              </div>

              <button
                onClick={calcularRetorno}
                className="w-full bg-green-500/10 border border-green-500/20 text-green-400 py-3 rounded hover:bg-green-500/20 transition-colors"
              >
                {language === 'pt' ? 'Calcular' : 'Calculate'}
              </button>

              {resultado && (
                <div className="mt-6 p-4 bg-green-500/5 border border-green-500/10 rounded-lg">
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm text-neutral-400">
                        {language === 'pt' ? 'Resultado Financeiro' : 'Financial Result'}
                      </div>
                      <div className="text-xl text-green-400">{resultado.valor}</div>
                    </div>
                    <div>
                      <div className="text-sm text-neutral-400">
                        {language === 'pt' ? 'Média Mensal' : 'Monthly Average'}
                      </div>
                      <div className="text-xl text-green-400">{resultado.percentual}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Section - Movida para baixo */}
        <section className="py-16 px-4 bg-black">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {/* Valor Original */}
              <div className="border border-neutral-800 p-8 rounded-lg">
                <div className="text-sm text-neutral-400 mb-4">
                  {language === 'pt' ? 'Valor Normal' : 'Regular Price'}
                </div>
                <div className="text-3xl font-light text-white mb-2">R$ 1.997</div>
                <div className="text-sm text-neutral-400 mb-6">
                  {language === 'pt' ? 'Acesso Individual' : 'Individual Access'}
                </div>
                <ul className="space-y-3 text-sm text-neutral-400 mb-8">
                  <li>✓ {language === 'pt' ? 'Acesso ao FIP' : 'FIP Access'}</li>
                  <li className="text-neutral-600">✕ {language === 'pt' ? 'Sem acesso ao Futuros Tech' : 'No Futuros Tech access'}</li>
                  <li className="text-neutral-600">✕ {language === 'pt' ? 'Sem BlackBook Digital' : 'No Digital BlackBook'}</li>
                </ul>
                <button 
                  disabled
                  className="w-full border border-neutral-800 text-neutral-500 px-6 py-3 text-sm cursor-not-allowed"
                >
                  {language === 'pt' ? 'Disponível Agora' : 'Available Now'}
                </button>
              </div>

              {/* Oferta Especial - Bloqueada */}
              <div className="relative border border-green-500/20 bg-green-500/[0.02] p-8 rounded-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500/10 backdrop-blur-sm text-green-400 px-4 py-1 rounded-full text-xs border border-green-500/20">
                    {language === 'pt' ? 'Abertura: 05/02 às 19h' : 'Opens: 02/05 at 7PM'}
                  </span>
                </div>

                <div className="text-sm text-green-400 mb-4">
                  {language === 'pt' ? 'Oferta Especial - 37 vagas' : 'Special Offer - 37 spots'}
                </div>
                <div className="text-3xl font-light text-white mb-2">
                  <span className="text-green-400">R$ 997</span>
                </div>
                <div className="text-sm text-neutral-400 mb-6">
                  {language === 'pt' ? 'ou ' : 'or '}
                  <span className="text-green-400">12x de R$ 97</span>
                </div>

                <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-4 mb-8">
                  <div className="text-sm font-medium text-green-400 mb-3">
                    {language === 'pt' ? 'Bônus que serão liberados:' : 'Bonuses to be released:'}
                  </div>
                  <ul className="space-y-3 text-sm text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong className="block text-green-400">Futuros Tech</strong>
                        {language === 'pt' 
                          ? '12 meses de acesso à tecnologia de sinais mais assertiva do mundo '
                          : '12 months access to the most accurate signal technology '}
                        <span className="text-green-400">(R$2.997 de valor)</span>
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong className="block text-green-400">BlackBook Digital</strong>
                        {language === 'pt' 
                          ? 'O livro digital mais completo do mercado'
                          : 'The most complete digital book in the market'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">✓</span>
                      <span>
                        <strong className="block text-green-400">FIP</strong>
                        {language === 'pt' 
                          ? 'Acesso completo à formação '
                          : 'Complete access to training '}
                        <span className="text-green-400">(R$1.997 de valor)</span>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="text-xs text-green-400/80 mb-8 text-center">
                  {language === 'pt' 
                    ? 'Oferta válida somente no dia 05/02. Após este período, o valor volta para R$1.997 sem os bônus.'
                    : 'Offer valid only on 02/05. After this period, price returns to R$1,997 without bonuses.'}
                </div>

                <button 
                  disabled
                  className="w-full bg-neutral-800 text-neutral-400 px-6 py-3 text-sm cursor-not-allowed"
                >
                  {language === 'pt' ? 'Abre em 05/02 às 19h' : 'Opens on 02/05 at 7PM'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Disclaimer Section */}
        <section className="py-8 px-4 bg-black border-t border-neutral-900">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-neutral-400 leading-relaxed">
              {language === 'pt' 
                ? 'O valor reduzido com acesso a todos os bônus é exclusivo para os primeiros inscritos, não nos comprometemos em abaixar o valor após acabar a vaga novamente, essa pode ser a última vez, então esteja preparado, espero que consiga entrar!'
                : 'The reduced price with access to all bonuses is exclusive to early subscribers, we do not commit to lowering the price after spots are filled again, this may be the last time, so be prepared, I hope you can join!'}
            </p>
          </div>
        </section>
      </div>

      <FloatingGroupButton />
    </div>
  );
}
