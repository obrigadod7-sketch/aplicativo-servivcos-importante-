import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Search, MapPin, Star, Wrench, Hammer, Car, Sparkles } from 'lucide-react';

const profissionais = [
  {
    id: '1',
    name: 'Armandeep S.',
    verified: true,
    profession: 'Eletricista, faz-tudo',
    location: 'Guarulhos (Bairro Novo) - 21,7 km',
    onlineStatus: 'Online há 10 minutos',
    rating: 4.8,
    reviews: 91,
    type: 'Particular',
    boosted: true,
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '2',
    name: 'Emanuel D.',
    verified: false,
    profession: 'Engenheiro 11-98765-4321',
    location: 'São Paulo (Consolação) - 2,9 km',
    onlineStatus: 'Online há 4 minutos',
    rating: 5,
    reviews: 161,
    type: 'Particular',
    boosted: false,
    photos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&h=300&fit=crop'
    ]
  },
  {
    id: '3',
    name: 'Paulo M.',
    verified: true,
    profession: 'Montagem COZINHA, CLOSET, etc.',
    location: 'Osasco (Jardim Novo) - 12,9 km',
    onlineStatus: 'Online há 15 minutos',
    rating: 4.9,
    reviews: 45,
    type: 'Particular',
    boosted: true,
    photos: [
      'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop'
    ]
  }
];

const categories = [
  { id: 'bricolage', name: 'Reparos', icon: Hammer },
  { id: 'menage', name: 'Limpeza', icon: Sparkles },
  { id: 'mecanique', name: 'Mecânica', icon: Car },
  { id: 'jardinage', name: 'Jardinagem', icon: Wrench },
  { id: 'autres', name: 'Outros', icon: null }
];

const Ofertantes = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('bricolage');
  const [searchText, setSearchText] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Top Bar - Desktop */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1200px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Mobile: Avatar */}
            <div className="lg:hidden relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-semibold">1</div>
            </div>

            {/* Center: Logo */}
            <div className="flex items-center justify-center lg:justify-start">
              <span className="text-base font-bold">
                <span className="text-green-500">allo</span>
                <span className="text-pink-500">voisins</span>
              </span>
              <p className="hidden lg:block text-[10px] text-gray-500 ml-2">Paris (Chaillot 1)</p>
            </div>

            {/* Desktop: Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
              <a href="/feed" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="text-[10px]">Accueil</span>
              </a>
              <a href="/ofertantes" className="flex flex-col items-center text-gray-900 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-[10px] font-semibold">Offreurs</span>
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

            {/* Desktop: User Avatar */}
            <div className="hidden lg:flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=68" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="text-xs">
                <p className="font-medium">Francês Da France F.</p>
              </div>
            </div>

            {/* Mobile: Share button */}
            <button className="lg:hidden p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Search & Categories - Below header */}
      <div className="bg-white border-b border-gray-200 sticky top-[52px] z-10">
        <div className="max-w-[1200px] mx-auto px-3 py-2">
          <div className="mb-2 text-center lg:text-left">
            <h1 className="text-sm font-semibold lg:hidden">Contatar prestadores</h1>
            <p className="text-[11px] text-gray-600 flex items-center justify-center lg:justify-start gap-1">
              <MapPin className="w-3 h-3" />
              Av. Paulista, 1000 - São Paulo, SP
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10 h-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg flex-shrink-0 transition-colors ${
                    selectedCategory === cat.id ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {!Icon && <span className="text-lg">•••</span>}
                  <span className="text-[11px] font-medium whitespace-nowrap">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-3 lg:px-4 py-4">
        <div className="space-y-3">
          {/* Bricolage Section */}
          <div>
            <h2 className="text-base font-bold mb-1">Reparos e serviços gerais</h2>
            <p className="text-xs text-gray-600 mb-3">26 Particulares e 23 Profissionais</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {profissionais.map((prof, index) => (
                <Card 
                  key={prof.id} 
                  onClick={() => navigate(`/perfil?id=${prof.id}`)}
                  className={`p-0 overflow-hidden relative cursor-pointer hover:shadow-lg transition-shadow ${prof.boosted ? 'border-2 border-purple-500' : 'border border-gray-200'}`}
                >
                  {prof.boosted && (
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-[10px] font-bold z-10 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      Perfil impulsionado
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="relative">
                        <Avatar className="w-11 h-11">
                          <AvatarImage src={`https://i.pravatar.cc/150?img=${10 + index}`} />
                          <AvatarFallback>{prof.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-semibold">
                          {prof.onlineStatus.includes('10') ? '10' : prof.onlineStatus.includes('4') ? '4' : '15'} min
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-0.5">
                          <h3 className="font-bold text-sm truncate">{prof.name}</h3>
                          {prof.verified && (
                            <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-gray-700 font-medium mb-0.5 truncate">{prof.profession}</p>
                        <p className="text-[10px] text-gray-500 truncate">{prof.location}</p>
                        <p className="text-[10px] text-gray-500">{prof.onlineStatus}</p>
                      </div>

                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0">
                        {prof.type}
                      </span>
                    </div>

                    {/* Photos Grid */}
                    <div className={`grid ${prof.photos.length === 3 ? 'grid-cols-3' : 'grid-cols-2'} gap-1.5 mb-2`}>
                      {prof.photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold">{prof.rating}/5</span>
                      <span className="text-gray-500">({prof.reviews} avis)</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center my-4">
              <Button variant="outline" className="rounded-full px-8 border border-gray-900 text-gray-900 font-semibold text-sm h-10">
                Ver todos
              </Button>
            </div>
          </div>

          {/* Montage meubles Section */}
          <div>
            <h2 className="text-base font-bold mb-1">Montagem de móveis em kit</h2>
            <p className="text-xs text-gray-600 mb-3">40 Particulares e 31 Profissionais</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <Card 
                onClick={() => navigate(`/perfil?id=3`)}
                className="p-0 overflow-hidden border-2 border-purple-500 relative cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 text-[10px] font-bold z-10 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  Perfil impulsionado
                </div>
                
                <div className="p-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="relative">
                      <Avatar className="w-11 h-11">
                        <AvatarImage src="https://i.pravatar.cc/150?img=15" />
                        <AvatarFallback>M</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full px-1.5 py-0.5 text-[9px] font-semibold">
                        15 min
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-0.5">
                        <h3 className="font-bold text-sm truncate">Paulo M.</h3>
                        <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mb-0.5 truncate">Montagem COZINHA, CLOSET, etc.</p>
                      <p className="text-[10px] text-gray-500 truncate">Osasco (Jardim Novo) - 12,9 km</p>
                      <p className="text-[10px] text-gray-500">Online há 15 minutos</p>
                    </div>

                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0">
                      Particulier
                    </span>
                  </div>

                  {/* Photos */}
                  <div className="grid grid-cols-2 gap-1.5 mb-2">
                    <img src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop" alt="Photo 1" className="w-full h-20 object-cover rounded" />
                    <img src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop" alt="Photo 2" className="w-full h-20 object-cover rounded" />
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">4.9/5</span>
                    <span className="text-gray-500">(45 avis)</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* View All Button */}
            <div className="text-center my-4">
              <Button variant="outline" className="rounded-full px-8 border border-gray-900 text-gray-900 font-semibold text-sm h-10">
                Ver todos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Ofertantes;
