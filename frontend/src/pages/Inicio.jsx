import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Search, Wrench, MapPin } from 'lucide-react';

const Inicio = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('PT');

  return (
    <div className="min-h-screen bg-white pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-400 rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="text-green-500">Jataí</span>
                <span className="text-orange-500"> Região</span>
              </span>
              <span className="text-xs text-gray-500 uppercase">Facilitador de Trabalho</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              {['PT', 'EN', 'ES'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded ${language === lang ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-600 hover:text-green-600'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => navigate('/login')} className="border-gray-300">
              Entrar
            </Button>
            <Button onClick={() => navigate('/login')} className="bg-gray-900 hover:bg-gray-800 text-white">
              Cadastrar-se
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full mb-4">
                <span className="text-green-600 font-semibold flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span>4.8/5</span>
                </span>
                <span className="text-gray-600 text-sm">420k avaliações</span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Conectando profissionais
              <br />
              <span className="text-green-600">em todo Brasil</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              A maior plataforma de serviços e empregos do Brasil
            </p>
            <div className="flex items-center space-x-2 mb-8 text-sm text-gray-600">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Disponível em todo território nacional</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button onClick={() => navigate('/login')} className="bg-gray-900 hover:bg-gray-800 text-white h-14 px-8 text-base">
                <Search className="w-5 h-5 mr-2" />
                Preciso de um serviço
              </Button>
              <Button onClick={() => navigate('/login')} variant="outline" className="border-2 border-green-500 text-green-600 hover:bg-green-50 h-14 px-8 text-base">
                <Wrench className="w-5 h-5 mr-2" />
                Busco emprego
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">50k+</p>
                <p className="text-sm text-gray-600">Profissionais</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">8.5k+</p>
                <p className="text-sm text-gray-600">Vagas</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">120k+</p>
                <p className="text-sm text-gray-600">Serviços realizados</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1Mjh8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXJzfGVufDB8fHx8MTc3NTcwMDMxOHww&ixlib=rb-4.1.0&q=85" 
                alt="Profissionais trabalhando em Jataí" 
                className="w-full h-[500px] object-cover" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-green-500 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-white text-lg font-medium mb-1">
              Junte-se a milhares de profissionais em Jataí Região Trabalho
            </p>
            <p className="text-green-50 text-sm">
              Encontre serviços e empregos perto de você
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/login')} className="bg-white text-green-600 hover:bg-gray-100 px-8">
              Cadastrar-se Grátis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inicio;