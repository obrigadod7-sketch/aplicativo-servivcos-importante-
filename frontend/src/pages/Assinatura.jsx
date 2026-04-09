import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { 
  ArrowLeft, MapPin, Check, ChevronDown, Bell, 
  ChevronRight, Eye, Edit, Star, FileText, Users, 
  Package, BarChart, Receipt, Settings, MessageSquare 
} from 'lucide-react';
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
  const [activeView, setActiveView] = useState('manage');
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [location, setLocation] = useState('54 Avenue de New York 75016 Paris');
  const [radius, setRadius] = useState([2]);
  const [selectedCategories, setSelectedCategories] = useState(['bricolagem', 'mudanca']);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [servicesExpanded, setServicesExpanded] = useState(false);
  const [objectsExpanded, setObjectsExpanded] = useState(false);

  const currentPlan = plans.find(p => p.id === selectedPlan);

  const selectedServices = serviceCategories.filter(cat => 
    selectedCategories.includes(cat.id)
  );

  const totalSelectedItems = selectedServices.reduce((acc, cat) => 
    acc + cat.items.length, 0
  );

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleFreeTrial = () => {
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

  const handleUpdatePerimeter = () => {
    toast({
      title: 'Perímetro atualizado!',
      description: 'Suas preferências foram salvas com sucesso'
    });
  };

  const menuItems = [
    {
      title: 'Meu perímetro de intervenção',
      items: [
        { icon: MessageSquare, label: 'Ver as demandas', onClick: () => navigate('/feed') },
        { icon: MapPin, label: 'Gerenciar meu perímetro', active: true, onClick: () => setActiveView('manage') }
      ]
    },
    {
      title: 'Minha visibilidade',
      items: [
        { icon: Eye, label: 'Ver minha página de perfil', onClick: () => navigate('/perfil') },
        { icon: Edit, label: 'Modificar minha página de perfil', onClick: () => navigate('/editar-perfil') },
        { icon: Star, label: 'Gerenciar meus comentários' },
        { icon: FileText, label: 'Meu referenciamento Google' },
        { icon: MessageSquare, label: 'Meus suportes de comunicação' }
      ]
    },
    {
      title: 'Minha empresa',
      badge: 'PRO',
      items: [
        { icon: BarChart, label: 'Painel de controle' },
        { icon: FileText, label: 'Orçamentos' },
        { icon: Receipt, label: 'Faturas' },
        { icon: Package, label: 'Cobranças' },
        { icon: Users, label: 'Diretório de clientes' },
        { icon: Package, label: 'Catálogo de artigos' },
        { icon: Settings, label: 'Parâmetros' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full lg:hidden">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Assinatura</h1>
              <p className="text-sm text-gray-600">Encontre todos os serviços inclusos na sua assinatura Standard.</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              {menuItems.map((section, idx) => (
                <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-bold text-sm">{section.title}</h3>
                    {section.badge && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-bold">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {section.items.map((item, itemIdx) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={itemIdx}
                          onClick={item.onClick}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            item.active 
                              ? 'bg-pink-50 text-pink-700 font-medium' 
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Gerenciar meu perímetro</h2>

              {/* Intervention Radius */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">Meu raio de intervenção:</Label>
                <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Slider
                          value={radius}
                          onValueChange={setRadius}
                          max={50}
                          min={1}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold text-pink-600 w-16 text-right">
                          {radius[0]}km
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intervention Domains */}
              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">Meus domínios de intervenção:</Label>
                
                {/* Services Dropdown */}
                <div className="bg-white border border-gray-300 rounded-lg mb-3">
                  <button
                    onClick={() => setServicesExpanded(!servicesExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">Serviços ({totalSelectedItems})</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${servicesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {servicesExpanded && (
                    <div className="border-t border-gray-200 p-3 space-y-2">
                      {serviceCategories.map((category) => (
                        <div key={category.id} className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                            id={`service-${category.id}`}
                          />
                          <label htmlFor={`service-${category.id}`} className="text-sm cursor-pointer flex-1">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Objects Dropdown */}
                <div className="bg-white border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setObjectsExpanded(!objectsExpanded)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">Objetos (3)</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${objectsExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {objectsExpanded && (
                    <div className="border-t border-gray-200 p-3 space-y-2">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox checked={true} id="obj1" />
                          <label htmlFor="obj1">Móveis e eletrodomésticos</label>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Checkbox checked={true} id="obj2" />
                          <label htmlFor="obj2">Ferramentas e equipamentos</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox checked={true} id="obj3" />
                          <label htmlFor="obj3">Materiais de construção</label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="mb-6">
                <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium">Notificações ativadas</span>
                  </div>
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              </div>

              {/* Update Button */}
              <Button
                onClick={handleUpdatePerimeter}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-11 font-semibold"
              >
                Modificar meu perímetro
              </Button>
            </Card>
          </div>

          {/* Upgrade Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-orange-400 to-pink-500 text-white">
              <h3 className="text-xl font-bold mb-4">Passe para a velocidade superior!</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Responder às demandas ilimitadas</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Publicar até 50 fotos das minhas realizações</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Aumentar a visibilidade do meu perfil</span>
                </div>
              </div>

              <Button
                onClick={handleFreeTrial}
                className="w-full bg-white text-pink-600 hover:bg-gray-100 rounded-full h-11 font-bold mb-3"
              >
                Eu me inscrevo
              </Button>

              <p className="text-xs text-center text-white/90">
                A partir de 9,99€ / mês, sem compromisso
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assinatura;
