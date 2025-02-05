'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

interface Lead {
  id: number;
  phone: string;
  countryCode: string;
  createdAt: string;
  isGroupMember?: boolean;
}

export default function AdminLeads() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsQuentes, setLeadsQuentes] = useState<Lead[]>([]);
  const [leadsFrios, setLeadsFrios] = useState<Lead[]>([]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchLeads();
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      
      if (response.ok) {
        const data = await response.json();
        setLeadsQuentes(data.quentes);
        setLeadsFrios(data.frios);
      }
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
    }
  };

  const downloadCSV = (leads: Lead[], filename: string) => {
    const headers = ['ID', 'Telefone', 'País', 'Data', 'Membro do Grupo'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.id,
        lead.phone,
        lead.countryCode,
        new Date(lead.createdAt).toLocaleString('pt-BR'),
        lead.isGroupMember ? 'Sim' : 'Não'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de administrador"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-4 py-2 text-white"
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-black px-4 py-2 rounded"
          >
            Acessar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl text-white mb-4">Leads Quentes</h1>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400">
                Total: {leadsQuentes.length} leads
              </span>
              <button
                onClick={() => downloadCSV(leadsQuentes, 'leads-quentes.csv')}
                className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded text-sm"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-neutral-400">
                    <th className="p-2">ID</th>
                    <th className="p-2">Telefone</th>
                    <th className="p-2">País</th>
                    <th className="p-2">Data</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {leadsQuentes.map((lead) => (
                    <tr key={lead.id} className="border-t border-neutral-800">
                      <td className="p-2">{lead.id}</td>
                      <td className="p-2">+{lead.countryCode} {lead.phone}</td>
                      <td className="p-2">+{lead.countryCode}</td>
                      <td className="p-2">
                        {new Date(lead.createdAt).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-2xl text-white mb-4">Leads Frios</h1>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-neutral-400">
                Total: {leadsFrios.length} leads
              </span>
              <button
                onClick={() => downloadCSV(leadsFrios, 'leads-frios.csv')}
                className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded text-sm"
              >
                <Download className="h-4 w-4" />
                Exportar CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-neutral-400">
                    <th className="p-2">ID</th>
                    <th className="p-2">Telefone</th>
                    <th className="p-2">País</th>
                    <th className="p-2">Data</th>
                    <th className="p-2">Membro</th>
                  </tr>
                </thead>
                <tbody className="text-white">
                  {leadsFrios.map((lead) => (
                    <tr key={lead.id} className="border-t border-neutral-800">
                      <td className="p-2">{lead.id}</td>
                      <td className="p-2">+{lead.countryCode} {lead.phone}</td>
                      <td className="p-2">+{lead.countryCode}</td>
                      <td className="p-2">
                        {new Date(lead.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-2">
                        {lead.isGroupMember ? 'Sim' : 'Não'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 