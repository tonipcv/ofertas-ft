'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function AcessoIG() {
  const router = useRouter();
  const [step, setStep] = useState<'whatsapp' | 'quiz' | 'loading'>('whatsapp');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    dialCode: '55'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);

  const countries = [
    { code: 'BR', name: 'Brasil', flag: '🇧🇷', dialCode: '55' },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '351' },
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '1' },
    { code: 'ES', name: 'España', flag: '🇪🇸', dialCode: '34' },
  ];

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsappNumber.length < 11) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/whatsapp/frio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          whatsapp: whatsappNumber,
          countryCode: selectedCountry.dialCode
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar WhatsApp');
      }

      setStep('quiz');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuizResponse = async (isMember: boolean) => {
    if (isMember) {
      router.push('/');
    } else {
      setStep('loading');
      setTimeout(() => {
        window.location.href = 'https://t.me/+mZs1t5_biYFmMTBh';
      }, 3000);
    }
  };

  const formatWhatsApp = (value: string) => {
    return value.replace(/\D/g, '');
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p className="text-green-500 text-sm">Redirecionando para o grupo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-black border border-neutral-800 rounded-lg p-6 md:p-8 w-full max-w-md">
        <div className="text-center">
          <Image
            src="/fip.jpg"
            alt="FIP"
            width={80}
            height={80}
            className="mx-auto mb-6 rounded"
          />

          {step === 'whatsapp' ? (
            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <p className="text-sm text-neutral-400 mb-8">
                Adicione seu WhatsApp para Liberar o seu Acesso:
              </p>

              <div className="relative">
                <div className="flex">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountrySelect(!showCountrySelect)}
                      className="flex items-center gap-2 bg-black border border-neutral-800 rounded-l px-3 py-3 text-white hover:bg-neutral-900 transition-colors"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-xs text-neutral-400">+{selectedCountry.dialCode}</span>
                    </button>

                    {showCountrySelect && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-50">
                        {countries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountrySelect(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 hover:bg-neutral-800 transition-colors"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm text-neutral-400">{country.name}</span>
                            <span className="text-xs text-neutral-500 ml-auto">+{country.dialCode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(formatWhatsApp(e.target.value))}
                    placeholder="11999999999"
                    className="flex-1 bg-black border border-l-0 border-neutral-800 rounded-r px-4 py-3 text-white focus:outline-none focus:border-green-500/50 text-center"
                    maxLength={11}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={whatsappNumber.length < 11 || isSubmitting}
                className={`w-full px-6 py-3 rounded text-sm font-medium transition-colors ${
                  whatsappNumber.length >= 11 && !isSubmitting
                    ? 'bg-green-500 text-black hover:bg-green-400'
                    : 'bg-neutral-800 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Liberando...' : 'Liberar Acesso'}
              </button>
            </form>
          ) : step === 'quiz' ? (
            <div className="space-y-6">
              <p className="text-sm text-neutral-400">
                Você já faz parte do grupo premium do Telegram?
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleQuizResponse(true)}
                  className="px-6 py-3 rounded text-sm font-medium bg-green-500 text-black hover:bg-green-400 transition-colors"
                >
                  Sim
                </button>
                <button
                  onClick={() => handleQuizResponse(false)}
                  className="px-6 py-3 rounded text-sm font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  Não
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 