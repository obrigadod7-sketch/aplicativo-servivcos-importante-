import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, MapPin, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';

const serviceCategories = [
  { id: 'bricolagem', name: 'Bricolagem - Trabalhos', items: ['Montagem de móveis em kit', 'Pequenos reparos'] },
  { id: 'mudanca', name: 'Mudança - Manutenção', items: ['Mudanças e ajuda com mudança', 'Manutenção'] },
  { id: 'veiculos', name: 'Manutenção - Reparação veículos', items: ['Lavagem de carro', 'Reparação de veículo'] },
  { id: 'servicos', name: 'Serviços gerais', items: ['Retirada de lixo - Entulho', 'Jardinagem'] }
];

const plans = [
  {
    id: 'basic',
    name: 'Básico',
    price: 29.90,
    demandas: '50 demandas por mês'
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 79.90,
    demandas: '120 demandas por mês',
    popular: true
  },
  {
    id: 'premier',
    name: 'Premier',
    price: 199.90,
    demandas: '294 demandas por mês'
  }
];

const Assinatura = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [location, setLocation] = useState('São Paulo, SP');
  const [radius, setRadius] = useState([5]);
  const [selectedCategories, setSelectedCategories] = useState(['bricolagem', 'mudanca']);

  const currentPlan = plans.find(p => p.id === selectedPlan);

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFreeTrial = () => {
    // Set 3-day free trial
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);
    
    localStorage.setItem('userPlan', 'trial');
    localStorage.setItem('planExpiry', expiryDate.toISOString());
    localStorage.setItem('planName', 'Teste Grátis (3 dias)');
    
    toast({
      title: 'Teste Grátis Ativado!',
      description: '3 dias de acesso total a todas as funcionalidades',
    });
    
    setTimeout(() => {
      navigate('/feed');
    }, 2000);
  };

  const handleFinalize = () => {
    // Set paid plan
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    localStorage.setItem('userPlan', selectedPlan);
    localStorage.setItem('planExpiry', expiryDate.toISOString());
    localStorage.setItem('planName', currentPlan.name);
    
    toast({
      title: 'Assinatura Confirmada!',
      description: `Plano ${currentPlan.name} ativado por 1 mês`,
    });
    
    setTimeout(() => {
      navigate('/feed');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Criar meu perímetro Premier</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-4">
            {/* Section 1: Location */}
            <Card className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-base mb-1">Até onde você deseja atuar?</h2>
                  <p className="text-sm text-gray-600">
                    Quanto maior o raio de atuação, mais demandas você receberá
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-10"
                    placeholder="Seu endereço"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm">Num raio de:</Label>
                    <span className="font-semibold text-green-600">{radius[0]} km</span>
                  </div>
                  <Slider
                    value={radius}
                    onValueChange={setRadius}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>

            {/* Section 2: Categories */}
            <Card className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h2 className="font-bold text-base mb-1">Em quais categorias?</h2>
                  <p className="text-sm text-gray-600">
                    Quanto mais categorias você selecionar, mais demandas receberá
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {serviceCategories.map((category) => (
                  <Card key={category.id} className="p-3 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                          id={category.id}
                        />
                        <label htmlFor={category.id} className="font-semibold text-sm cursor-pointer">
                          {category.name}
                        </label>
                      </div>
                    </div>
                    <ul className="ml-7 space-y-1">
                      {category.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600">• {item}</li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar - Summary */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <h3 className="font-bold text-base mb-3">Recapitulativo</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">{location}, +/- {radius[0]}km</span>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Serviços: {selectedCategories.length} categorias</p>
                </div>
              </div>

              <Card className="p-3 bg-pink-50 border-pink-200 mb-4">
                <p className="text-sm font-semibold text-pink-900 mb-1">
                  {currentPlan.demandas}*
                </p>
                <p className="text-xs text-pink-700">
                  * Média nos últimos 12 meses
                </p>
              </Card>

              <div className="mb-4">
                <Label className="text-sm mb-2 block">Selecione seu plano:</Label>
                <div className="space-y-2">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedPlan === plan.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-sm">{plan.name}</p>
                          <p className="text-xs text-gray-600">{plan.demandas}</p>
                        </div>
                        <p className="text-lg font-bold text-green-600">
                          R$ {plan.price.toFixed(2)}
                        </p>
                      </div>
                      {plan.popular && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded mt-1 inline-block">
                          Mais Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center mb-3">
                <p className="text-2xl font-bold text-gray-900">
                  R$ {currentPlan.price.toFixed(2)} <span className="text-base font-normal text-gray-600">/ mês</span>
                </p>
                <p className="text-xs text-gray-500">Sem compromisso</p>
              </div>

              <Button
                onClick={handleFinalize}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white h-11"
              >
                Finalizar Assinatura
              </Button>

              <Button
                onClick={handleFreeTrial}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 h-11 font-semibold mt-3"
              >
                🎁 Iniciar Teste Grátis (3 dias)
              </Button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Cancele quando quiser</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Sem taxas de cancelamento</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Suporte prioritário 24/7</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assinatura;
