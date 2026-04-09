import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { ArrowLeft, Mail, Lock, User, Phone, MapPin } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Password/Register choice, 3: Register form
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: ''
  });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (formData.email) {
      setStep(2);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.password) {
      // Mock login - store user in localStorage
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email,
        name: formData.name || 'Usuário'
      }));
      navigate('/feed');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.address) {
      // Mock register
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      }));
      navigate('/feed');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setIsRegistering(false);
    } else if (step === 3) {
      setStep(2);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {step > 1 && (
            <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <span className="text-lg font-bold">
              <span className="text-green-500">allo</span>
              <span className="text-pink-500">voisins</span>
            </span>
          </div>
          {step > 1 && <div className="w-9" />}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md p-6 bg-white border border-gray-200 shadow-sm">
          {/* Step 1: Email Entry */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Bem-vindo ao AlloVoisins
                </h2>
                <p className="text-sm text-gray-600">
                  Conecte-se com vizinhos e prestadores de serviços
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">
                  Endereço de e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu.email@exemplo.com"
                    className="h-10 pl-10 text-sm bg-white border-gray-300"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-10 font-semibold shadow-sm text-sm"
              >
                Continuar
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Ao continuar, você concorda com nossos{' '}
                  <a href="#" className="text-green-600 hover:underline">Termos de Serviço</a>
                  {' '}e{' '}
                  <a href="#" className="text-green-600 hover:underline">Política de Privacidade</a>
                </p>
              </div>
            </form>
          )}

          {/* Step 2: Login or Register Choice */}
          {step === 2 && !isRegistering && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {formData.email}
                </h2>
                <p className="text-sm text-gray-600">
                  Escolha como deseja continuar
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Digite sua senha"
                      className="h-10 pl-10 text-sm bg-white border-gray-300"
                      required
                    />
                  </div>
                  <a href="#" className="text-xs text-green-600 hover:underline block text-right">
                    Esqueceu sua senha?
                  </a>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-10 font-semibold shadow-sm text-sm"
                >
                  Entrar
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <Button 
                type="button"
                onClick={() => {
                  setIsRegistering(true);
                  setStep(3);
                }}
                variant="outline"
                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-full h-10 font-semibold text-sm"
              >
                Criar nova conta
              </Button>
            </div>
          )}

          {/* Step 3: Registration Form */}
          {step === 3 && isRegistering && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Criar sua conta
                </h2>
                <p className="text-sm text-gray-600">
                  Preencha seus dados para começar
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="João Silva"
                      className="h-10 pl-10 text-sm bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Telefone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="h-10 pl-10 text-sm bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Endereço
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Rua, número - Bairro, Cidade"
                      className="h-10 pl-10 text-sm bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-700 block">
                    Criar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Mínimo 6 caracteres"
                      className="h-10 pl-10 text-sm bg-white border-gray-300"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full h-10 font-semibold shadow-sm text-sm"
              >
                Criar conta
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Ao criar sua conta, você concorda com nossos{' '}
                  <a href="#" className="text-green-600 hover:underline">Termos</a>
                  {' '}e{' '}
                  <a href="#" className="text-green-600 hover:underline">Privacidade</a>
                </p>
              </div>
            </form>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-md mx-auto text-center">
          <p className="text-xs text-gray-500">
            © 2026 AlloVoisins. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
