import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar';
import { Input } from './components/ui/input';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './components/ui/dialog';
import { useToast } from './hooks/use-toast';
import { 
  Search, Send, Paperclip, Camera, Star, Phone, Video, 
  MoreVertical, ArrowLeft, Home, Users, Plus, Bell, 
  MessageCircle, Calendar, CreditCard, X, Check, Copy
} from 'lucide-react';

const mockConversations = [
  {
    id: '1',
    userId: '1', // ID do usuário para redirecionar ao perfil correto
    name: 'Massimiliano S.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    service: 'Manutenção',
    lastMessage: 'Aqui está minha solicitação privada. Aguardo sua resposta.',
    date: '05/03/2025',
    unread: false,
    messages: [
      {
        id: 'm1',
        type: 'request',
        title: 'Solicitação privada',
        text: 'Aqui está minha solicitação privada. Aguardo sua resposta.',
        time: '10:11',
        fromMe: false
      }
    ]
  },
  {
    id: '2',
    userId: '2', // ID do usuário para redirecionar ao perfil correto
    name: 'Usuário removido',
    avatar: '',
    rating: 0,
    service: 'Mudanças e ajuda com mudança',
    lastMessage: 'Obrigado, mas não vou dar continuidade.',
    date: '29/12/2024',
    unread: false,
    messages: []
  },
  {
    id: '3',
    userId: '3', // ID do usuário para redirecionar ao perfil correto
    name: 'Lídia C.',
    avatar: 'https://i.pravatar.cc/150?img=45',
    rating: 5,
    service: 'Manutenção',
    lastMessage: 'Aqui está minha solicitação privada. Aguardo sua resposta.',
    date: '26/12/2024',
    unread: false,
    messages: []
  },
  {
    id: '4',
    userId: '1', // ID do usuário para redirecionar ao perfil correto
    name: 'Alexandra N.',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 5,
    service: 'Manutenção',
    lastMessage: 'Aqui está minha solicitação privada. Aguardo sua resposta.',
    date: '06/12/2024',
    unread: false,
    messages: []
  },
  {
    id: '5',
    userId: '2', // ID do usuário para redirecionar ao perfil correto
    name: 'Carlos M.',
    avatar: 'https://i.pravatar.cc/150?img=15',
    rating: 4,
    service: 'Encanamento',
    lastMessage: 'Obrigado pelo serviço!',
    date: '01/12/2024',
    unread: false,
    messages: []
  },
  {
    id: '6',
    userId: '3', // ID do usuário para redirecionar ao perfil correto
    name: 'Marina P.',
    avatar: 'https://i.pravatar.cc/150?img=27',
    rating: 5,
    service: 'Limpeza',
    lastMessage: 'Quando você pode vir?',
    date: '28/11/2024',
    unread: true,
    messages: []
  }
];

const Mensagens = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('todas');
  const [conversations, setConversations] = useState(mockConversations);
  const [activeTab, setActiveTab] = useState('messages');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showPrivateRequest, setShowPrivateRequest] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    startTime: '20:15',
    endTime: '21:45',
    type: 'video',
    address: '',
    notes: ''
  });
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  // Check if redirected from Feed with user info
  useEffect(() => {
    const userId = searchParams.get('userId');
    const userName = searchParams.get('userName');
    const userAvatar = searchParams.get('userAvatar');

    if (userId && userName) {
      // Check if conversation already exists
      let existingConv = conversations.find(c => c.userId === userId);
      
      if (!existingConv) {
        // Create new conversation
        const newConv = {
          id: `new-${Date.now()}`,
          userId: userId,
          name: userName,
          avatar: userAvatar || '',
          rating: 5,
          service: 'Serviço solicitado',
          lastMessage: 'Nova conversa iniciada',
          date: new Date().toLocaleDateString('pt-BR'),
          unread: false,
          messages: [
            {
              id: `m-${Date.now()}`,
              type: 'text',
              text: 'Olá! Vi sua solicitação e gostaria de conversar sobre o serviço.',
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              fromMe: true
            }
          ]
        };
        
        setConversations(prev => [newConv, ...prev]);
        setSelectedConvId(newConv.id);
        
        toast({
          title: 'Conversa iniciada!',
          description: `Mensagem enviada para ${userName}`,
        });
      } else {
        // Open existing conversation
        setSelectedConvId(existingConv.id);
        
        toast({
          title: 'Conversa aberta!',
          description: `Continuando conversa com ${userName}`,
        });
      }
      
      // Clear URL parameters
      setSearchParams({});
    }
  }, [searchParams, setSearchParams, conversations, toast]);

  const conv = conversations.find(c => c.id === selectedConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConvId, conv?.messages?.length]);

  const handleSend = () => {
    if (!message.trim() || !conv) return;
    const newMsg = {
      id: `m${Date.now()}`,
      type: 'text',
      text: message,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      fromMe: true
    };
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, messages: [...c.messages, newMsg], lastMessage: `Você: ${message}` } : c
    ));
    setMessage('');
  };

  const handleDecline = () => {
    toast({
      title: 'Solicitação recusada',
      description: 'Você recusou esta solicitação',
    });
  };

  const handleSchedule = () => {
    // Check if user has active plan
    const userPlan = localStorage.getItem('userPlan');
    const planExpiry = localStorage.getItem('planExpiry');
    
    if (!userPlan || (planExpiry && new Date(planExpiry) < new Date())) {
      toast({
        title: 'Plano necessário',
        description: 'Assine um plano para agendar reuniões. Teste grátis por 3 dias!',
        variant: 'destructive'
      });
      setTimeout(() => {
        window.location.href = '/assinatura';
      }, 2000);
      return;
    }
    
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = () => {
    if (!scheduleData.date) {
      toast({
        title: 'Erro',
        description: 'Selecione uma data para o agendamento',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Agendamento enviado!',
      description: `Proposta de reunião enviada para ${conv?.name}`,
    });
    
    setShowScheduleModal(false);
    setScheduleData({
      date: '',
      startTime: '20:15',
      endTime: '21:45',
      type: 'video',
      address: '',
      notes: ''
    });
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
  };

  const handleReview = () => {
    toast({
      title: 'Deixar Avaliação',
      description: 'Dê uma nota de 1 a 5 estrelas para este profissional',
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: 'Chamada de Voz',
      description: `Iniciando chamada de voz com ${conv?.name}...`,
    });
  };

  const handleVideoCall = () => {
    toast({
      title: 'Chamada de Vídeo',
      description: `Iniciando videochamada com ${conv?.name}...`,
    });
  };

  const filtered = filter === 'nao-lidas' 
    ? conversations.filter(c => c.unread) 
    : filter === 'arquivadas' 
    ? [] 
    : conversations;

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden pb-20 lg:pb-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* Top Navigation - Desktop */}
      <header className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center lg:justify-start">
              <span className="text-base font-bold">
                <span className="text-green-500">Jataí</span>
                <span className="text-orange-500"> Região Trabalho</span>
              </span>
              <p className="text-[10px] text-gray-500 ml-2">Paris (Chaillot 1)</p>
            </div>

            <nav className="flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <a href="/feed" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[10px]">Accueil</span>
              </a>
              <a href="/ofertantes" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[10px]">Offreurs</span>
              </a>
              <a href="/assinatura" className="flex flex-col items-center text-green-600 -mt-1">
                <div className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] mt-1">Demande</span>
              </a>
              <a href="/inicio" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px]">Abonnement</span>
              </a>
              <a href="/mensagens" className="flex flex-col items-center text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-[10px] font-semibold">Messages</span>
              </a>
            </nav>

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium">Francês Da France F.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200">
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-4">
            <Avatar className="w-10 h-10 relative">
              <AvatarImage src="https://i.pravatar.cc/150?img=68" />
              <AvatarFallback>U</AvatarFallback>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">1</div>
            </Avatar>
            <h1 className="text-xl font-semibold text-gray-900">Mensagens</h1>
            <button className="text-sm font-normal text-gray-900">Editar</button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar"
              className="pl-9 h-9 bg-gray-100 border-0 rounded-lg text-sm placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 pb-2">
            <button
              onClick={() => setFilter('todas')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === 'todas'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('nao-lidas')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === 'nao-lidas'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-700'
              }`}
            >
              Não lidas
            </button>
            <button
              onClick={() => setFilter('arquivadas')}
              className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === 'arquivadas'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border-2 border-gray-300 text-gray-700'
              }`}
            >
              Arquivadas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Desktop 3 Column Layout */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left: Conversations List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Mensagens</h2>
              <button className="text-sm text-gray-600">Editar</button>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Pesquisar"
                className="pl-9 h-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filter === 'todas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setFilter('nao-lidas')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filter === 'nao-lidas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Não lidas
              </button>
              <button
                onClick={() => setFilter('arquivadas')}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  filter === 'arquivadas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Arquivadas
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className={`px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedConvId === c.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar 
                    className="w-12 h-12 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/perfil?id=${c.userId}`;
                    }}
                  >
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 
                        className="font-semibold text-sm truncate cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/perfil?id=${c.userId}`;
                        }}
                      >
                        {c.name}
                      </h4>
                      <span className="text-xs text-gray-400 ml-2">{c.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-gray-600">{c.rating}/5</span>
                    </div>
                    <p className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded inline-block mb-1">
                      {c.service}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {conv ? (
            <>
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-blue-700">🔒 Solicitação privada</p>
                  <span className="text-xs text-gray-500">postado em 16 junho</span>
                </div>
                <p className="text-xs text-gray-700 mb-2">
                  Olá {conv.name}, Preciso de ajuda para transportar um sofá...
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs h-7 border-blue-400 text-blue-700 hover:bg-blue-50"
                  onClick={() => setShowPrivateRequest(!showPrivateRequest)}
                >
                  {showPrivateRequest ? 'Ocultar' : 'Exibir'}
                </Button>
              </div>

              {showPrivateRequest && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-semibold text-sm mb-2">Detalhes da solicitação privada</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold">Serviço:</span> Transporte de móveis
                    </div>
                    <div>
                      <span className="font-semibold">Descrição:</span> Preciso transportar um sofá de 3 lugares do 18º arrondissement até minha nova casa em Sartouville. O sofá tem aproximadamente 2,5m de comprimento.
                    </div>
                    <div>
                      <span className="font-semibold">Data desejada:</span> 15/04/2026
                    </div>
                    <div>
                      <span className="font-semibold">Orçamento:</span> R$ 150,00 - R$ 250,00
                    </div>
                    <div>
                      <span className="font-semibold">Endereço de origem:</span> Rue de la Convention, Paris 18º
                    </div>
                    <div>
                      <span className="font-semibold">Endereço de destino:</span> Avenue du Général de Gaulle, Sartouville
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 p-4 overflow-y-auto">
                {conv.messages.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 mt-8">Nenhuma mensagem ainda</p>
                ) : (
                  conv.messages.map((msg) => (
                    <div key={msg.id} className={`flex mb-3 ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.fromMe
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white border border-gray-200 rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className={`text-xs mt-1 block ${
                          msg.fromMe ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-4 py-3 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Button 
                    onClick={handleDecline}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Recusar
                  </Button>
                  <Button 
                    onClick={handleSchedule}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                  >
                    <Calendar className="w-4 h-4 mr-1" />
                    Agendar
                  </Button>
                  <Button 
                    onClick={handlePayment}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Pagamento
                  </Button>
                  <Button 
                    onClick={handleReview}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 hover:bg-yellow-50 hover:border-yellow-300 hover:text-yellow-600"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    Avaliar
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-gray-400 cursor-pointer hover:text-gray-600">
                    <Paperclip className="w-5 h-5" />
                    <input type="file" className="hidden" accept="*/*" />
                  </label>
                  <label className="text-gray-400 cursor-pointer hover:text-gray-600">
                    <Camera className="w-5 h-5" />
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                  <Input
                    placeholder="Votre message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 h-9 rounded-full border-gray-300 text-sm"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className="text-blue-500 disabled:text-gray-300"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Selecione uma conversa</p>
            </div>
          )}
        </div>

        {/* Right: Profile Area */}
        {conv && (
          <div className="w-80 border-l border-gray-200 bg-white p-4">
            <div className="text-center mb-4">
              <Avatar className="w-20 h-20 mx-auto mb-2">
                <AvatarImage src={conv.avatar} />
                <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold text-lg">{conv.name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold">{conv.rating}/5</span>
                <span className="text-xs text-gray-500">(2 avis)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 mb-4">
              <button 
                onClick={handleVideoCall}
                className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-green-500 hover:bg-green-50"
              >
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={handleVoiceCall}
                className="p-3 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-blue-500 hover:bg-blue-50"
              >
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <Button 
              onClick={() => window.location.href = `/perfil?id=${conv.userId}`}
              variant="outline" 
              className="w-full mb-4 border-2 border-gray-900 text-gray-900 h-10 rounded-full"
            >
              Ver perfil
            </Button>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Partager ce profil
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Épingler la conversation
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                Archiver la conversation
              </button>
            </div>

            <div className="space-y-2 border-t border-gray-200 pt-4 mt-4">
              <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                Signaler ce profil
              </button>
              <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 w-full">
                Bloquer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Conversations List */}
      {!selectedConvId ? (
        <div className="flex-1 overflow-y-auto bg-white lg:hidden">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-400">Nenhuma conversa</p>
            </div>
          ) : (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedConvId(c.id)}
                className="px-4 py-3 border-b border-gray-100 active:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-14 h-14 flex-shrink-0">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback className="bg-gray-300 text-gray-600">
                      {c.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <h4 className="font-semibold text-[15px] text-gray-900 truncate leading-tight">
                          {c.name}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-blue-500 fill-blue-500" />
                          <span className="text-xs text-gray-500 font-medium">-/{c.rating}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 flex-shrink-0 font-normal">
                        {c.date}
                      </span>
                    </div>
                    <div className="inline-block bg-gray-100 px-2 py-0.5 rounded text-[11px] text-gray-700 mb-1.5 font-normal">
                      {c.service}
                    </div>
                    <p className="text-[13px] text-gray-600 truncate leading-tight">
                      {c.lastMessage}
                    </p>
                  </div>
                  {c.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Mobile: Chat View */
        <div className="flex-1 flex flex-col bg-white lg:hidden">
          {/* Chat Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
            <button onClick={() => setSelectedConvId(null)} className="p-1 -ml-1">
              <ArrowLeft className="w-5 h-5 text-blue-500" />
            </button>
            <Avatar className="w-10 h-10">
              <AvatarImage src={conv.avatar} />
              <AvatarFallback>{conv.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{conv.name}</h3>
              <p className="text-xs text-gray-500 truncate">{conv.service}</p>
            </div>
            <button className="p-1">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {conv.messages.length === 0 ? (
              <p className="text-center text-sm text-gray-400 mt-8">
                Nenhuma mensagem ainda
              </p>
            ) : (
              conv.messages.map((msg) => (
                <div key={msg.id} className={`flex mb-3 ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.fromMe
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : msg.type === 'request'
                      ? 'bg-blue-50 border border-blue-200 rounded-bl-md'
                      : 'bg-white rounded-bl-md'
                  }`}>
                    {msg.type === 'request' && (
                      <>
                        <p className="text-sm font-semibold text-blue-700 mb-1">
                          {msg.title}
                        </p>
                        <p className="text-sm text-gray-700">{msg.text}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 text-xs border-blue-300 text-blue-700 h-7"
                        >
                          Consultar
                        </Button>
                      </>
                    )}
                    {msg.type === 'text' && (
                      <p className="text-sm">{msg.text}</p>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`text-xs ${
                        msg.fromMe ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="px-4 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <button className="text-gray-400">
                <Plus className="w-6 h-6" />
              </button>
              <label className="text-gray-400 cursor-pointer hover:text-gray-600">
                <Camera className="w-6 h-6" />
                <input type="file" className="hidden" accept="image/*" />
              </label>
              <Input
                placeholder="Mensagem"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-9 rounded-full border-gray-300 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="text-blue-500 disabled:text-gray-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agendamento */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Propor um agendamento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Vantagens */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">Vantagens do agendamento:</p>
              <ul className="space-y-1 text-gray-700">
                <li>• Compromisso mútuo</li>
                <li>• Adicione à agenda pessoal</li>
                <li>• Lembrete por SMS antes do encontro</li>
                <li>• Lançamento da navegação GPS</li>
                <li>• Lembrete: Deixar avaliação após o encontro</li>
              </ul>
            </div>

            {/* Data */}
            <div>
              <label className="text-sm font-semibold mb-2 block">Data</label>
              <Input
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                className="h-10"
              />
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Hora de início</label>
                <Input
                  type="time"
                  value={scheduleData.startTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                  className="h-10"
                />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 block">Hora de fim</label>
                <Input
                  type="time"
                  value={scheduleData.endTime}
                  onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            {/* Modalidades */}
            <div>
              <label className="text-sm font-semibold mb-3 block">Modalidades do encontro</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="video"
                    checked={scheduleData.type === 'video'}
                    onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    Chamada vocal ou vídeo 
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded">InterDit</span>
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="demanda"
                    checked={scheduleData.type === 'demanda'}
                    onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Endereço da demanda</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="prestador"
                    checked={scheduleData.type === 'prestador'}
                    onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">
                    Na casa de {conv?.name}
                    <br />
                    <span className="text-xs text-gray-500">54 Avenue de New York, 75016 Paris</span>
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="scheduleType"
                    value="outro"
                    checked={scheduleData.type === 'outro'}
                    onChange={(e) => setScheduleData({ ...scheduleData, type: e.target.value })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Outro endereço</span>
                </label>
              </div>
            </div>

            {/* Informações práticas */}
            <div>
              <label className="text-sm font-semibold mb-2 block">
                Informações práticas 
                <span className="text-gray-400 font-normal ml-2">Opcional</span>
              </label>
              <textarea
                value={scheduleData.notes}
                onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                placeholder="Ex.: Itinerário, etapa, código do interfone..."
                className="w-full h-24 text-sm bg-white border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 text-right mt-1">{scheduleData.notes.length}/500 max.</p>
            </div>

            {/* Aviso */}
            <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
              Compreendo que o endereço e as informações práticas serão comunicadas quando o agendamento for aceito por {conv?.name}.
            </div>

            {/* Botão */}
            <Button
              onClick={handleScheduleSubmit}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full h-11 font-semibold"
            >
              Propor o agendamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pagamento PIX */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Pagamento via PIX</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* QR Code */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-4 border-purple-500 inline-block">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136jonhsondecarvalho@gmail.com520400005303986540551965.655802BR5925JONHSON%20DE%20SOUSA%20CARV6009SAO%20PAULO62290525ERI51965652CARVALHO63041F20"
                  alt="QR Code PIX"
                  className="w-64 h-64"
                />
              </div>
            </div>

            {/* Informações PIX */}
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 font-semibold">Empresa:</p>
                <p className="font-bold">JONHSON DE SOUSA CARVALHO</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">ERI:</p>
                <p className="font-mono">51.965.652</p>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Chave PIX:</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded flex-1 break-all">
                    3ef11200-bebf-4d88-930c-48e84b11cfc4
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText('3ef11200-bebf-4d88-930c-48e84b11cfc4');
                      toast({
                        title: 'Copiado!',
                        description: 'Chave PIX copiada para área de transferência'
                      });
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-gray-600 font-semibold">Instituição:</p>
                <p className="font-bold">NU PAGAMENTOS - IP</p>
              </div>
            </div>

            {/* Instruções */}
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">Como pagar:</p>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Abra o app do seu banco</li>
                <li>Escaneie o QR Code ou copie a chave PIX</li>
                <li>Confirme o pagamento</li>
              </ol>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: 'Pagamento confirmado!',
                    description: 'Aguardando confirmação do banco'
                  });
                  setShowPaymentModal(false);
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                Confirmar Pagamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Mensagens;
