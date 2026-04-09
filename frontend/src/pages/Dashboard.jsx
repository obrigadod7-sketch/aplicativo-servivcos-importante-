import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, MessageSquare, FileText, TrendingUp, 
  Calendar, DollarSign, Star, Activity 
} from 'lucide-react';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7days');

  // Mock statistics
  const stats = {
    totalUsers: 1247,
    activeUsers: 823,
    totalPosts: 3456,
    totalMessages: 8932,
    revenue: 45678,
    avgRating: 4.8,
    newUsersToday: 42,
    responseRate: 94
  };

  const recentActivities = [
    { id: 1, type: 'user', message: 'Novo usuário registrado: Linda L.', time: 'há 5 minutos' },
    { id: 2, type: 'post', message: 'Nova demanda publicada: Instalação elétrica', time: 'há 15 minutos' },
    { id: 3, type: 'message', message: '23 novas mensagens trocadas', time: 'há 30 minutos' },
    { id: 4, type: 'review', message: 'Nova avaliação 5 estrelas para Armandeep S.', time: 'há 1 hora' },
    { id: 5, type: 'user', message: 'Novo prestador verificado: Mahoutondji Paulin T.', time: 'há 2 horas' }
  ];

  const topProviders = [
    { name: 'Armandeep S.', rating: 4.8, services: 91, revenue: 4500 },
    { name: 'Emmanuel D.', rating: 5.0, services: 161, revenue: 8900 },
    { name: 'Mahoutondji Paulin T.', rating: 4.9, services: 45, revenue: 3200 },
    { name: 'Linda L.', rating: 5.0, services: 2, revenue: 450 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, Helvetica Neue, Arial, sans-serif' }}>
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">
                <span className="text-green-500">allo</span>
                <span className="text-pink-500">voisins</span>
              </span>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="today">Hoje</option>
                <option value="7days">Últimos 7 dias</option>
                <option value="30days">Últimos 30 dias</option>
                <option value="year">Este ano</option>
              </select>
              <Button 
                onClick={() => window.location.href = '/feed'}
                variant="outline" 
                className="border-gray-300"
              >
                Ir para Feed
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Total de Usuários</h3>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+{stats.newUsersToday} hoje</span>
            </div>
          </Card>

          {/* Active Users */}
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Usuários Ativos</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% do total
              </span>
            </div>
          </Card>

          {/* Total Posts */}
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Total de Posts</h3>
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPosts.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600">+12% esta semana</span>
            </div>
          </Card>

          {/* Messages */}
          <Card className="p-6 bg-white border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Mensagens</h3>
              <MessageSquare className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-500">{stats.responseRate}% taxa de resposta</span>
            </div>
          </Card>
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Revenue */}
          <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Receita Total</h3>
              <DollarSign className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">€{stats.revenue.toLocaleString()}</p>
            <p className="text-sm opacity-75 mt-2">Últimos 30 dias</p>
          </Card>

          {/* Average Rating */}
          <Card className="p-6 bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Avaliação Média</h3>
              <Star className="w-5 h-5 opacity-90 fill-white" />
            </div>
            <p className="text-3xl font-bold">{stats.avgRating}/5</p>
            <p className="text-sm opacity-75 mt-2">Baseado em 1,234 avaliações</p>
          </Card>

          {/* Services Completed */}
          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium opacity-90">Serviços Concluídos</h3>
              <Calendar className="w-5 h-5 opacity-90" />
            </div>
            <p className="text-3xl font-bold">2,847</p>
            <p className="text-sm opacity-75 mt-2">Este mês</p>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="p-6 bg-white border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'user' ? 'bg-blue-100' :
                      activity.type === 'post' ? 'bg-purple-100' :
                      activity.type === 'message' ? 'bg-orange-100' :
                      'bg-yellow-100'
                    }`}>
                      {activity.type === 'user' && <Users className="w-5 h-5 text-blue-600" />}
                      {activity.type === 'post' && <FileText className="w-5 h-5 text-purple-600" />}
                      {activity.type === 'message' && <MessageSquare className="w-5 h-5 text-orange-600" />}
                      {activity.type === 'review' && <Star className="w-5 h-5 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Top Providers */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Top Prestadores</h2>
              <div className="space-y-4">
                {topProviders.map((provider, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <span className="text-sm font-semibold text-gray-900">{provider.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{provider.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{provider.services} serviços</span>
                      <span className="font-semibold text-green-600">€{provider.revenue}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Chart Placeholder */}
        <Card className="p-6 bg-white border border-gray-200 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Crescimento de Usuários</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Gráfico de crescimento</p>
              <p className="text-sm text-gray-400">Visualização de dados ao longo do tempo</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
