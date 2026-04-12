import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Star, MapPin, Phone, X, Check, User, Users, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Mock profile data for different providers
const profilesData = {
  '1': {
    name: 'Armandeep S.',
    avatar: 'https://i.pravatar.cc/200?img=12',
    verified: true,
    profession: 'Eletricista, faz-tudo',
    location: 'Guarulhos (Bairro Novo)',
    type: 'Particular',
    rating: 4.8,
    reviews: 91,
    joinDate: '15 março 2024',
    connections: 156,
    description: 'Profissional experiente em serviços elétricos e reparos gerais. Trabalho com qualidade e pontualidade.',
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop'
    ]
  },
  '2': {
    name: 'Emanuel D.',
    avatar: 'https://i.pravatar.cc/200?img=33',
    verified: false,
    profession: 'Engenheiro',
    location: 'São Paulo (Consolação)',
    type: 'Particular',
    rating: 5.0,
    reviews: 161,
    joinDate: '8 janeiro 2024',
    connections: 203,
    description: 'Engenheiro civil com experiência em reformas e projetos residenciais.',
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop'
    ]
  },
  '3': {
    name: 'Paulo M.',
    avatar: 'https://i.pravatar.cc/200?img=15',
    verified: true,
    profession: 'Montador de móveis',
    location: 'Osasco (Jardim Novo)',
    type: 'Particular',
    rating: 4.9,
    reviews: 45,
    joinDate: '22 fevereiro 2024',
    connections: 78,
    description: 'Especialista em montagem de móveis planejados, cozinhas e closets.',
    photos: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop'
    ]
  },
  '4': {
    name: 'Juliana S.',
    avatar: 'https://i.pravatar.cc/200?img=45',
    verified: true,
    profession: 'Proprietária',
    location: 'São Paulo (Vila Mariana)',
    type: 'Particular',
    rating: 5.0,
    reviews: 28,
    joinDate: '10 fevereiro 2024',
    connections: 89,
    description: 'Sempre procurando profissionais de confiança para manutenção e reparos em minha residência.',
    photos: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=400&h=300&fit=crop'
    ]
  }
};

const Perfil = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('presentation');
  const profileId = searchParams.get('id');
  
  // Get current logged user
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  // If no ID or ID matches current user, show their profile
  const isOwnProfile = !profileId || profileId === currentUser.email;
  
  // Use current user data or mock data
  const profile = isOwnProfile ? {
    name: currentUser.name || 'Usuário',
    avatar: currentUser.avatar || 'https://i.pravatar.cc/200?img=33',
    verified: false,
    profession: currentUser.profession || currentUser.accountType || 'Membro',
    location: currentUser.postalAddress || 'Localização não definida',
    type: currentUser.accountType || 'Particular',
    rating: 5.0,
    reviews: 0,
    joinDate: currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
    connections: 0,
    description: `Membro desde ${currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('pt-BR') : 'hoje'}`,
    photos: []
  } : (profilesData[profileId] || profilesData['1']);

  const handleLogout = () => {
    // Limpar todos os dados do localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('userPlan');
    localStorage.removeItem('planExpiry');
    localStorage.removeItem('planName');
    localStorage.removeItem('userProfile');
    
    // Mostrar notificação
    toast({
      title: 'Logout realizado!',
      description: 'Você saiu da sua conta com sucesso',
    });
    
    // Redirecionar para a página de login
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Top Navigation - Desktop */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center lg:justify-start">
              <span className="text-base font-bold">
                <span className="text-green-500">Jataí</span>
                <span className="text-orange-500"> Região Trabalho</span>
              </span>
              <p className="hidden lg:block text-[10px] text-gray-500 ml-2">Paris (Chaillot 1)</p>
            </div>

            <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
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
              <a href="/mensagens" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <span className="text-[10px]">Messages</span>
              </a>
            </nav>

            <div className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="hidden lg:block text-xs">
                <p className="font-medium">Francês Da France F.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-[900px] mx-auto">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-b from-gray-300 to-gray-400 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-4xl">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute top-2 right-2 bg-gray-500 text-white px-3 py-1 rounded text-xs font-semibold">
                {profile.type}
              </div>
              {profile.verified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white px-4 sm:px-6 lg:px-8 pt-20 pb-6 border-b border-gray-200 overflow-x-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="w-full md:w-auto">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{profile.name}</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-2 break-words">{profile.profession}</p>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm break-words">{profile.location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button
                onClick={() => window.location.href = '/editar-perfil'}
                variant="outline"
                className="border-2 border-gray-900 text-gray-900 rounded-full px-6 hover:bg-gray-900 hover:text-white w-full sm:w-auto"
              >
                Editar perfil
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-2 border-red-500 text-red-500 rounded-full px-6 hover:bg-red-500 hover:text-white flex items-center gap-2 justify-center w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 sm:gap-8 border-b border-gray-200 overflow-x-auto hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              onClick={() => setActiveTab('presentation')}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'presentation'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Présentation
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'photos'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('avis')}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'avis'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Avis
            </button>
            <button
              onClick={() => setActiveTab('activite')}
              className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'activite'
                  ? 'border-b-2 border-gray-900 text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Activité
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white">
          {activeTab === 'presentation' && (
            <div className="px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Rating */}
                  <Card className="p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      <span className="text-3xl font-bold">{profile.rating}/5</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Baseado em {profile.reviews} avaliações</p>
                    <Button variant="outline" className="border-2 border-gray-900 text-gray-900 rounded-full">
                      Ver avaliações
                    </Button>
                  </Card>

                  {/* Stats */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">{profile.joinDate}</p>
                        <p className="text-sm text-gray-600">data de inscrição</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold">{profile.connections}</p>
                        <p className="text-sm text-gray-600">conexões realizadas</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Description */}
                  <Card className="p-6">
                    <h3 className="font-semibold text-base mb-3">Sobre</h3>
                    <p className="text-sm text-gray-700">
                      {profile.description || '« Ainda não preenchi minha apresentação »'}
                    </p>
                  </Card>

                  {/* Photos */}
                  {profile.photos && profile.photos.length > 0 && (
                    <Card className="p-6">
                      <h3 className="font-semibold text-base mb-3">Fotos do trabalho</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {profile.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo}
                            alt={`Trabalho ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </Card>
                  )}

                  {/* Map */}
                  <Card className="p-0 overflow-hidden">
                    <div className="h-64 bg-gray-200 flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                  </Card>

                  {/* Verifications */}
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Vérifications
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-blue-500" />
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span className="text-gray-700">Numéro de téléphone vérifié</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <X className="w-4 h-4 text-red-500" />
                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                        <span className="text-gray-700">Pièce d'identité vérifiée</span>
                      </div>
                    </div>
                  </Card>

                  {/* Report */}
                  <button className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-6">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                    Signaler ce profil
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'photos' && (
            <div className="px-8 py-6">
              <p className="text-center text-gray-500">Aucune photo pour le moment</p>
            </div>
          )}

          {activeTab === 'avis' && (
            <div className="px-8 py-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  <span className="text-4xl font-bold">5/5</span>
                </div>
                <p className="text-gray-600">Basé sur 2 avis</p>
              </div>
              <p className="text-center text-gray-500">Avis en cours de chargement...</p>
            </div>
          )}

          {activeTab === 'activite' && (
            <div className="px-8 py-6">
              <p className="text-center text-gray-500">Aucune activité récente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil;
