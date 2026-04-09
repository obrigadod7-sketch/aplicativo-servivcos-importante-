import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Camera, ArrowLeft, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const EditarPerfil = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: 'Você',
    profession: 'Profissional autônomo',
    location: 'São Paulo, SP',
    phone: '',
    email: '',
    bio: '',
    avatar: 'https://i.pravatar.cc/200?img=33',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop'
  });

  const [workPhotos, setWorkPhotos] = useState([
    'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop'
  ]);

  const handleAddWorkPhoto = () => {
    if (workPhotos.length < 6) {
      const newPhoto = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop`;
      setWorkPhotos([...workPhotos, newPhoto]);
      toast({
        title: 'Foto adicionada',
        description: 'Foto de trabalho adicionada com sucesso'
      });
    }
  };

  const handleRemoveWorkPhoto = (index) => {
    setWorkPhotos(workPhotos.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    
    toast({
      title: 'Sucesso!',
      description: 'Seu perfil foi atualizado'
    });
    
    setTimeout(() => {
      navigate('/perfil');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[900px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/perfil')}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Editar Perfil</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-4 py-6 space-y-6">
        {/* Cover Image */}
        <Card className="p-0 overflow-hidden">
          <div className="relative h-48 bg-gray-200">
            <img 
              src={profileData.coverImage} 
              alt="Capa" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => {
                const newCover = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=1200&h=400&fit=crop`;
                setProfileData({ ...profileData, coverImage: newCover });
                toast({ title: 'Imagem de capa atualizada' });
              }}
              className="absolute bottom-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100 shadow-lg flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Alterar imagem de capa
            </button>
          </div>
        </Card>

        <Card className="p-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="bg-gray-300 text-gray-600 text-4xl">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-2 right-2 bg-green-500 text-white p-2 rounded-full hover:bg-green-600">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Clique para alterar foto</p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Nome</label>
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Seu nome"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Profissão</label>
              <Input
                value={profileData.profession}
                onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                placeholder="Sua profissão"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Localização</label>
              <Input
                value={profileData.location}
                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                placeholder="Cidade, Estado"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Telefone</label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="(11) 98765-4321"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Email</label>
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="seu@email.com"
                type="email"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Sobre você</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Conte um pouco sobre você e seus serviços..."
                className="w-full h-32 text-sm bg-white border border-gray-300 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500</p>
            </div>
          </div>
        </Card>

        {/* Work Photos Section */}
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Fotos do seu trabalho</h3>
          <p className="text-sm text-gray-600 mb-4">
            Adicione até 6 fotos dos seus trabalhos realizados para aumentar sua credibilidade
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {workPhotos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img 
                  src={photo} 
                  alt={`Trabalho ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveWorkPhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {workPhotos.length < 6 && (
              <button
                onClick={handleAddWorkPhoto}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 flex flex-col items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">Adicionar foto</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            {workPhotos.length}/6 fotos adicionadas
          </p>
        </Card>

        {/* Action Buttons Card */}
        <Card className="p-6">
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/perfil')}
              variant="outline"
              className="flex-1 rounded-full h-11"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-full h-11 font-semibold"
            >
              Salvar alterações
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EditarPerfil;
