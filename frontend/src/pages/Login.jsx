import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft, X, Eye, EyeOff, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Choose type, 2: Register form
  const [accountType, setAccountType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    profession: '',
    postalAddress: '',
    mobile: '',
    email: '',
    password: '',
    receiveInfo: false,
    acceptTerms: false
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      localStorage.setItem('user', JSON.stringify({ 
        email: loginData.email,
        name: 'Usuário'
      }));
      toast({
        title: 'Login realizado!',
        description: 'Bem-vindo de volta'
      });
      navigate('/feed');
    }
  };

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    
    if (!("geolocation" in navigator)) {
      toast({
        title: 'Geolocalização não suportada',
        description: 'Seu navegador não suporta detecção de localização',
        variant: 'destructive'
      });
      setLoadingLocation(false);
      return;
    }

    // Mostrar mensagem informativa antes de solicitar permissão
    toast({
      title: 'Solicitando permissão...',
      description: 'Por favor, permita acesso à sua localização quando o navegador solicitar',
      duration: 3000
    });

    try {
      // Tentar primeiro com alta precisão
      let position;
      try {
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject,
            {
              enableHighAccuracy: true,
              timeout: 30000,
              maximumAge: 60000
            }
          );
        });
      } catch (highAccError) {
        // Se falhar com alta precisão, tentar com baixa precisão
        console.log('⚠️ Alta precisão falhou, tentando baixa precisão...');
        position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve, 
            reject,
            {
              enableHighAccuracy: false,
              timeout: 15000,
              maximumAge: 300000
            }
          );
        });
      }

      const { latitude, longitude } = position.coords;
      
      console.log('✅ Localização obtida:', latitude, longitude);
      
      // Usar API BigDataCloud
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`,
          { signal: AbortSignal.timeout(10000) }
        );
        
        if (!response.ok) {
          throw new Error('Falha na API de geocoding');
        }
        
        const data = await response.json();
        
        console.log('📍 Dados da API:', data);
        
        if (data) {
          const addressParts = [];
          
          if (data.localityInfo?.administrative?.[3]?.name) {
            addressParts.push(data.localityInfo.administrative[3].name);
          } else if (data.locality) {
            addressParts.push(data.locality);
          }
          
          if (data.city) addressParts.push(data.city);
          if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
          if (data.postcode) addressParts.push(data.postcode);
          
          const address = addressParts.filter(part => part).join(', ');
          
          console.log('🏠 Endereço montado:', address);
          
          if (address) {
            setRegisterData(prev => ({ ...prev, postalAddress: address }));
            
            toast({
              title: 'Localização detectada! ✅',
              description: address,
              duration: 4000
            });
          } else {
            throw new Error('Endereço não encontrado');
          }
        }
      } catch (apiError) {
        console.error('❌ Erro na API de geocoding:', apiError);
        
        toast({
          title: 'Localização aproximada obtida',
          description: 'Por favor, complete seu endereço completo',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('❌ Erro ao obter localização:', error);
      
      let errorTitle = 'Permissão necessária';
      let errorMessage = 'Para usar este recurso, você precisa permitir acesso à sua localização nas configurações do navegador.';
      
      if (error.code === 1) {
        errorTitle = '🔒 Permissão negada';
        errorMessage = 'Você negou o acesso. Para ativar:\n1. Clique no ícone 🔒 ao lado da URL\n2. Permitir "Localização"\n3. Recarregue a página';
      } else if (error.code === 2) {
        errorTitle = '📍 GPS indisponível';
        errorMessage = 'Ative o GPS do seu celular e tente novamente.';
      } else if (error.code === 3) {
        errorTitle = '⏱️ Timeout';
        errorMessage = 'A localização demorou muito. Verifique se o GPS está ativo e tente novamente.';
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: 'destructive',
        duration: 8000
      });
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!registerData.acceptTerms) {
      toast({
        title: 'Termos obrigatórios',
        description: 'Você deve aceitar os termos e condições',
        variant: 'destructive'
      });
      return;
    }

    const requiredFields = accountType === 'particular' 
      ? ['firstName', 'lastName', 'postalAddress', 'mobile', 'email', 'password']
      : ['businessName', 'profession', 'postalAddress', 'mobile', 'email', 'password'];

    const missingFields = requiredFields.filter(field => !registerData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos',
        variant: 'destructive'
      });
      return;
    }

    localStorage.setItem('user', JSON.stringify({ 
      email: registerData.email,
      name: registerData.firstName ? `${registerData.firstName} ${registerData.lastName}` : registerData.businessName,
      accountType: accountType,
      ...registerData
    }));
    
    toast({
      title: 'Cadastro realizado!',
      description: 'Bem-vindo ao AlloVoisins'
    });
    
    navigate('/feed');
  };

  const handleTypeSelect = (type) => {
    setAccountType(type);
    setModalStep(2);
  };

  const getFieldsByType = () => {
    if (accountType === 'particular') {
      return (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Primeiro nome"
              value={registerData.firstName}
              onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
              className="h-11"
              required
            />
            <Input
              placeholder="Sobrenome"
              value={registerData.lastName}
              onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
              className="h-11"
              required
            />
          </div>
        </>
      );
    } else {
      return (
        <>
          <Input
            placeholder="Nome comercial"
            value={registerData.businessName}
            onChange={(e) => setRegisterData({ ...registerData, businessName: e.target.value })}
            className="h-11"
            required
          />
          <Input
            placeholder="Profissão"
            value={registerData.profession}
            onChange={(e) => setRegisterData({ ...registerData, profession: e.target.value })}
            className="h-11"
            required
          />
        </>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1920&h=1080&fit=crop)',
        }}
      />

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-green-500">Jataí</span>
              <span className="text-orange-500"> Região Trabalho</span>
            </span>
            <p className="text-xs text-gray-500 hidden sm:block">FACILITADOR DE PROJETOS</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowModal(true)}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              S'inscrire
            </button>
            <Button
              onClick={() => setShowModal(true)}
              variant="outline"
              className="rounded-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Se connecter
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Prestações de serviços
            <br />
            <span className="text-orange-500">e aluguel de material</span>
          </h1>
          <p className="text-lg text-gray-700">
            Mais de 3 milhões de profissionais por toda a França
          </p>
        </div>

        {/* Quick Login Card */}
        <Card className="max-w-md mx-auto p-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-center mb-6">Fazer login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="E-mail"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className="h-11"
              required
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="h-11 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white h-11 rounded-full font-semibold"
            >
              Entrar
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowModal(true);
                  setModalStep(1);
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Criar uma conta
              </button>
            </div>
          </form>
        </Card>
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                {modalStep === 2 && (
                  <button
                    onClick={() => setModalStep(1)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="flex-1" />
                <button
                  onClick={() => {
                    setShowModal(false);
                    setModalStep(1);
                    setAccountType('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step 1: Choose Account Type */}
              {modalStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-center">Eu me inscrevo como:</h2>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleTypeSelect('particular')}
                      variant="outline"
                      className="w-full h-12 text-base border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full"
                    >
                      Particular
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-300" />
                      <span className="text-sm text-gray-500">ou</span>
                      <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    <Button
                      onClick={() => handleTypeSelect('auto-entrepreneur')}
                      variant="outline"
                      className="w-full h-12 text-base border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full"
                    >
                      Auto-empresário
                    </Button>

                    <Button
                      onClick={() => handleTypeSelect('enterprise')}
                      variant="outline"
                      className="w-full h-12 text-base border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 rounded-full"
                    >
                      Empresa
                    </Button>
                  </div>

                  <p className="text-center text-sm text-gray-500">Etapa 1/2</p>
                </div>
              )}

              {/* Step 2: Registration Form */}
              {modalStep === 2 && (
                <form onSubmit={handleRegister} className="space-y-4">
                  {getFieldsByType()}

                  <div className="relative">
                    <Input
                      placeholder="Endereço postal"
                      value={registerData.postalAddress}
                      onChange={(e) => setRegisterData({ ...registerData, postalAddress: e.target.value })}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loadingLocation}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-600 hover:text-orange-700"
                      title="Detectar localização automaticamente"
                    >
                      {loadingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <MapPin className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <Input
                    type="tel"
                    placeholder="Celular"
                    value={registerData.mobile}
                    onChange={(e) => setRegisterData({ ...registerData, mobile: e.target.value })}
                    className="h-11"
                    required
                  />

                  <Input
                    type="email"
                    placeholder="E-mail"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="h-11"
                    required
                  />

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Senha"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="h-11 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={registerData.receiveInfo}
                        onCheckedChange={(checked) => setRegisterData({ ...registerData, receiveInfo: checked })}
                        id="receiveInfo"
                      />
                      <label htmlFor="receiveInfo" className="text-sm text-gray-700 cursor-pointer">
                        Receber informações dos nossos parceiros
                      </label>
                    </div>

                    <div className="flex items-start gap-2">
                      <Checkbox
                        checked={registerData.acceptTerms}
                        onCheckedChange={(checked) => setRegisterData({ ...registerData, acceptTerms: checked })}
                        id="acceptTerms"
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-700 cursor-pointer">
                        Eu aceito{' '}
                        <a href="#" className="text-orange-600 hover:underline">
                          as condições gerais de venda e utilização
                        </a>
                      </label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-full font-semibold text-base"
                  >
                    M'inscrire
                  </Button>

                  <p className="text-center text-sm text-gray-500">Etapa 2/2</p>
                </form>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Footer Ratings */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4].map((i) => (
                <span key={i} className="text-yellow-500 text-xl">★</span>
              ))}
              <span className="text-gray-300 text-xl">★</span>
              <span className="text-lg font-bold ml-2">4.6/5</span>
            </div>
            <p className="text-sm text-gray-600">Calculado a partir de 47.488 avaliações</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1,2,3,4].map((i) => (
                <span key={i} className="text-yellow-500 text-xl">★</span>
              ))}
              <span className="text-gray-300 text-xl">★</span>
              <span className="text-lg font-bold ml-2">4.6/5</span>
            </div>
            <p className="text-sm text-gray-600">Calculado a partir de 66.500 avaliações</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
