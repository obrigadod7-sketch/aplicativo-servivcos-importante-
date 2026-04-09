import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Mensagens from './Mensagens';
import Inicio from './pages/Inicio';
import Feed from './pages/Feed';
import Ofertantes from './pages/Ofertantes';
import Assinatura from './pages/Assinatura';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Dashboard from './pages/Dashboard';
import PublicarDemanda from './pages/PublicarDemanda';
import EditarPerfil from './pages/EditarPerfil';
import BottomNav from './components/BottomNav';
import { Toaster } from './components/ui/toaster';
import './App.css';

function BottomNavWrapper() {
  const location = useLocation();
  const showBottomNav = ['/feed', '/mensagens', '/ofertantes', '/dashboard', '/perfil'].includes(location.pathname);
  
  return showBottomNav ? <BottomNav /> : null;
}

function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mensagens"
            element={
              <ProtectedRoute>
                <Mensagens />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ofertantes"
            element={
              <ProtectedRoute>
                <Ofertantes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assinatura"
            element={
              <ProtectedRoute>
                <Assinatura />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/publicar"
            element={
              <ProtectedRoute>
                <PublicarDemanda />
              </ProtectedRoute>
            }
          />
          <Route
            path="/editar-perfil"
            element={
              <ProtectedRoute>
                <EditarPerfil />
              </ProtectedRoute>
            }
          />
        </Routes>
        <BottomNavWrapper />
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
