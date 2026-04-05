import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-8">
        <Home className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-black text-gray-800 mb-6">Página Não Encontrada</h2>
      <p className="text-gray-500 font-medium max-w-md mb-8">
        Ops! Parece que você se perdeu pelo caminho. A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/">
        <Button className="rounded-2xl px-8 py-4 flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Voltar para o Início
        </Button>
      </Link>
    </div>
  );
};
