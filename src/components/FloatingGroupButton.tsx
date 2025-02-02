import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function FloatingGroupButton() {
  return (
    <Link
      href="https://t.me/+mZs1t5_biYFmMTBh"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-green-500 text-black p-3 rounded-full shadow-lg hover:bg-green-400 transition-colors z-50 flex items-center gap-2 group"
    >
      <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
      <span className="hidden md:block text-xs font-medium max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
        Acesso ao Grupo
      </span>
    </Link>
  );
} 