import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import {
  ArrowLeft, Send, User, MapPin, Image as ImageIcon, Video, Paperclip, Lock,
  Phone, MessageCircle, CheckCheck, MoreVertical, Camera, Search, Star,
  Home as HomeIcon, Users as UsersIcon, Plus, BarChart3, MessageSquare,
  Video as VideoIcon, X as XIcon, Calendar, CreditCard, Star as StarIcon,
  Share2, Pin, Archive, Flag, Ban, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import MapPreview from '../components/MapPreview';

const CATEGORY_INFO = {
  food: { icon: '🍽️', label: 'Alimentação', color: 'bg-green-100 text-green-700' },
  legal: { icon: '⚖️', label: 'Jurídico', color: 'bg-blue-100 text-blue-700' },
  health: { icon: '🏥', label: 'Saúde', color: 'bg-red-100 text-red-700' },
  housing: { icon: '🏠', label: 'Moradia', color: 'bg-purple-100 text-purple-700' },
  work: { icon: '💼', label: 'Emprego', color: 'bg-yellow-100 text-yellow-700' },
  education: { icon: '📚', label: 'Educação', color: 'bg-indigo-100 text-indigo-700' },
  social: { icon: '🤝', label: 'Social', color: 'bg-pink-100 text-pink-700' },
  clothes: { icon: '👕', label: 'Roupas', color: 'bg-orange-100 text-orange-700' },
  furniture: { icon: '🪑', label: 'Móveis', color: 'bg-teal-100 text-teal-700' },
  transport: { icon: '🚗', label: 'Transporte', color: 'bg-cyan-100 text-cyan-700' },
  repairs: { icon: '🔧', label: 'Manutenção', color: 'bg-gray-200 text-gray-700' }
};

const formatRelativeDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return ''; }
};

export default function DirectChatPage() {
  const { userId } = useParams();
  const { user: currentUser, token } = useContext(AuthContext);
  const navigate = useNavigate();

  // ====== Estado original preservado ======
  const [otherUser, setOtherUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [canChat, setCanChat] = useState(true);
  const [chatRestrictionReason, setChatRestrictionReason] = useState('');
  const messagesEndRef = useRef(null);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [userPosts, setUserPosts] = useState([]);

  // ====== Estado novo (sidebar de conversas + busca) ======
  const [conversations, setConversations] = useState([]);
  const [convFilter, setConvFilter] = useState('all'); // all | unread | archived
  const [search, setSearch] = useState('');
  const [showPostPreview, setShowPostPreview] = useState(false);

  // ====== Fetchers (lógica original preservada) ======
  useEffect(() => {
    if (!userId) return;
    fetchOtherUser();
    checkCanChat();
    fetchMessages();
    fetchUserPosts();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOtherUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setOtherUser(await response.json());
    } catch (error) { console.error(error); }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserPosts(data.filter(p => p.user_id === userId));
      }
    } catch (error) { console.error(error); }
  };

  const checkCanChat = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/can-chat/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCanChat(data.can_chat);
        if (!data.can_chat) setChatRestrictionReason(data.reason);
      }
    } catch (error) { console.error(error); }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setMessages(await response.json());
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(Array.isArray(data) ? data : []);
      }
    } catch (e) { console.error(e); }
  };

  const sendMessage = async (messageData = {}) => {
    if (!input.trim() && !messageData.location && !messageData.media) return;
    setSending(true);
    try {
      const payload = {
        to_user_id: userId,
        message: input || (messageData.location ? '📍 Localização compartilhada' : '📎 Mídia compartilhada'),
        ...messageData
      };
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setInput('');
        setShowMediaOptions(false);
        fetchMessages();
      } else { toast.error('Erro ao enviar mensagem'); }
    } catch (e) { toast.error('Erro de conexão'); }
    finally { setSending(false); }
  };

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendMessage({ location: { lat: position.coords.latitude, lng: position.coords.longitude } });
          toast.success('Localização enviada!');
        },
        () => toast.error('Erro ao obter localização')
      );
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10000000) { toast.error('Arquivo muito grande! Máximo 10MB'); return; }
    const reader = new FileReader();
    reader.onloadend = () => {
      sendMessage({ media: [reader.result], media_type: type });
      toast.success(`${type === 'image' ? 'Foto' : 'Vídeo'} enviado!`);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'volunteer': return 'Voluntário';
      case 'migrant': return 'Migrante';
      case 'helper': return 'Ajudante';
      case 'admin': return 'Admin';
      default: return role || 'Usuário';
    }
  };

  const getCategoryInfo = (cat) => CATEGORY_INFO[cat] || { icon: '📝', label: cat || 'Geral', color: 'bg-gray-200 text-gray-700' };

  // Agrupar mensagens por data
  const groupMessagesByDate = (msgs) => {
    const groups = {};
    msgs.forEach(msg => {
      const date = new Date(msg.created_at).toLocaleDateString('pt-BR');
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };
  const messageGroups = groupMessagesByDate(messages);

  // Conversas filtradas
  const filteredConversations = conversations.filter(c => {
    if (!c?.user) return false;
    if (search && !(c.user.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Post atual relacionado à conversa
  const currentPost = userPosts.find(p => p.type === 'need') || userPosts[0];

  const avatarUrl = (u) => u?.avatar || `https://i.pravatar.cc/200?u=${u?.id || u?.email || 'user'}`;

  return (
    <div className="min-h-screen bg-[#f4f5f7]" data-testid="direct-chat-page">
      {/* ===== TOP NAVBAR ===== */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              data-testid="logo-home"
              className="text-2xl font-bold tracking-tight"
            >
              <span className="text-[#16a34a]">Jataí</span>{' '}
              <span className="text-amber-500">Região</span>{' '}
              <span className="text-gray-900">Trabalho</span>
            </button>
            <span className="hidden md:inline text-xs text-gray-500 ml-2">Paris (Chaillot 1)</span>
          </div>

          <nav className="flex items-center gap-1">
            <NavBtn label="Acolhida" icon={<HomeIcon size={18} />} onClick={() => navigate('/home')} />
            <NavBtn label="Ofertantes" icon={<UsersIcon size={18} />} onClick={() => navigate('/volunteers')} />
            <button
              onClick={() => navigate('/home')}
              data-testid="nav-demanda"
              className="flex flex-col items-center -mt-3 mx-2"
            >
              <div className="w-12 h-12 rounded-full bg-[#16a34a] text-white grid place-items-center shadow-md shadow-green-500/30 hover:shadow-lg hover:scale-105 transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[11px] text-[#16a34a] font-medium mt-0.5">Demanda</span>
            </button>
            <NavBtn label="Assinatura" icon={<BarChart3 size={18} />} onClick={() => navigate('/profile')} />
            <NavBtn label="Mensagens" icon={<MessageSquare size={18} />} active onClick={() => navigate('/chat')} />
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/profile')}
              data-testid="profile-avatar-top"
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-[#16a34a] transition-all"
            >
              <img src={avatarUrl(currentUser)} alt="me" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </header>

      {/* ===== 3-COLUMN LAYOUT ===== */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-0 px-0 md:px-6 py-0 md:py-6">

        {/* ============ LEFT: CONVERSATIONS LIST ============ */}
        <aside className="col-span-12 md:col-span-3 bg-white md:rounded-2xl md:shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Mensagens</h2>
            <button data-testid="edit-conversations" className="text-sm text-gray-500 hover:text-gray-800">Editar</button>
          </div>
          <div className="px-5 pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                data-testid="conversations-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar"
                className="pl-9 rounded-full bg-gray-50 border-gray-200 h-10"
              />
            </div>
          </div>
          <div className="px-5 pb-3 flex items-center gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'unread', label: 'Não lidas' },
              { key: 'archived', label: 'Arquivadas' }
            ].map(t => (
              <button
                key={t.key}
                data-testid={`tab-${t.key}`}
                onClick={() => setConvFilter(t.key)}
                className={`px-3 py-1.5 text-sm rounded-full font-medium transition ${
                  convFilter === t.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-280px)] divide-y divide-gray-100" data-testid="conversations-list">
            {filteredConversations.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-gray-400">Nenhuma conversa encontrada</div>
            )}
            {filteredConversations.map((c, idx) => {
              const isActive = c.user.id === userId;
              const catBadge = c.user.help_categories?.[0] || c.user.need_categories?.[0];
              const catInfo = catBadge ? getCategoryInfo(catBadge) : null;
              return (
                <button
                  key={c.user.id}
                  data-testid={`conversation-item-${idx}`}
                  onClick={() => navigate(`/direct-chat/${c.user.id}`)}
                  className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition relative ${isActive ? 'bg-emerald-50/40' : ''}`}
                >
                  {isActive && <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#16a34a]" />}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={avatarUrl(c.user)}
                        alt={c.user.name}
                        className="w-12 h-12 rounded-full object-cover bg-gray-200"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-semibold text-gray-900 truncate">{c.user.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">{formatRelativeDate(c.last_message_time)}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs text-gray-700">5/5</span>
                      </div>
                      {catInfo && (
                        <span className="inline-block mt-1.5 text-[11px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {catInfo.label}
                        </span>
                      )}
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {c.last_message || 'Sem mensagens'}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ============ CENTER: CHAT ============ */}
        <main className="col-span-12 md:col-span-6 bg-white md:mx-0 md:rounded-2xl md:shadow-sm border-y md:border border-gray-200 flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>

          {/* Banner: Solicitação privada */}
          {currentPost && (
            <div className="px-6 pt-5 pb-3 border-b border-gray-100">
              <div className="bg-sky-50/70 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[#16a34a] font-semibold text-sm">
                    <Lock size={14} /> Solicitação privada
                  </div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                    <span className="font-medium text-gray-900">{otherUser?.name || 'Olá'},</span>{' '}
                    {currentPost.description || currentPost.title}
                  </p>
                  <button
                    onClick={() => setShowPostPreview(!showPostPreview)}
                    data-testid="toggle-post-preview"
                    className="mt-2 text-xs font-medium px-3 py-1 rounded-full bg-white border border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] transition"
                  >
                    {showPostPreview ? 'Ocultar' : 'Exibir'}
                  </button>
                </div>
                <div className="text-xs text-gray-400 shrink-0 whitespace-nowrap">
                  postado em {currentPost.created_at ? new Date(currentPost.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : '—'}
                </div>
              </div>

              {showPostPreview && (
                <div className="mt-3 rounded-xl border border-gray-200 p-4 bg-white">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 grid place-items-center">
                      <MessageCircle size={18} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{currentPost.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{currentPost.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(currentPost.categories?.length ? currentPost.categories : [currentPost.category]).filter(Boolean).map(cat => {
                          const info = getCategoryInfo(cat);
                          return (
                            <span key={cat} className={`text-[11px] px-2 py-0.5 rounded-full ${info.color}`}>
                              {info.icon} {info.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {!canChat ? (
              <div className="text-center py-12" data-testid="chat-restricted">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 max-w-md mx-auto">
                  <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock size={26} className="text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-amber-800 mb-1">Chat Restrito</h3>
                  <p className="text-sm text-amber-700">{chatRestrictionReason || 'Você não pode conversar com este usuário.'}</p>
                  <Button
                    onClick={() => navigate('/profile')}
                    className="mt-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Atualizar Perfil
                  </Button>
                </div>
              </div>
            ) : loading ? (
              <div className="text-center py-16">
                <div className="animate-spin w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Carregando mensagens...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full grid place-items-center" data-testid="no-messages">
                <p className="text-gray-400 text-sm">Nenhuma mensagem ainda</p>
              </div>
            ) : (
              <div className="space-y-1">
                {Object.entries(messageGroups).map(([date, msgs]) => (
                  <div key={date}>
                    <div className="flex items-center justify-center my-4">
                      <span className="bg-gray-100 text-gray-500 text-[11px] px-3 py-1 rounded-full">
                        {date === new Date().toLocaleDateString('pt-BR') ? 'Hoje' : date}
                      </span>
                    </div>
                    {msgs.map((msg, idx) => {
                      const isMe = msg.from_user_id === currentUser.id;
                      return (
                        <div
                          key={idx}
                          data-testid={`message-${isMe ? 'sent' : 'received'}`}
                          className={`flex gap-2 mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isMe && (
                            <img src={avatarUrl(otherUser)} alt="" className="w-7 h-7 rounded-full object-cover mt-auto" />
                          )}
                          <div
                            className={`max-w-[70%] px-4 py-2.5 ${
                              isMe
                                ? 'bg-[#16a34a] text-white rounded-2xl rounded-br-md'
                                : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                            }`}
                          >
                            {msg.location && (
                              <div className={`mb-2 p-2 rounded-xl ${isMe ? 'bg-white/20' : 'bg-white'}`}>
                                <MapPreview location={msg.location} size="small" />
                              </div>
                            )}
                            {msg.media && msg.media.length > 0 && (
                              <div className="mb-2">
                                {msg.media_type === 'image' ? (
                                  <img src={msg.media[0]} alt="" className="rounded-xl max-w-full max-h-64 cursor-pointer"
                                    onClick={() => window.open(msg.media[0], '_blank')} />
                                ) : (
                                  <video src={msg.media[0]} controls className="rounded-xl max-w-full max-h-64" />
                                )}
                              </div>
                            )}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.message}</p>
                            <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                              <span className="text-[10px]">
                                {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && <CheckCheck size={12} />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Action buttons (Recusar / Agendar / Pagamento / Avaliar) */}
          {canChat && (
            <div className="border-t border-gray-100 px-6 py-3">
              <div className="flex items-center gap-2 flex-wrap">
                <ActionBtn icon={<XIcon size={16} />} label="Recusar" onClick={() => toast.info('Solicitação recusada')} testid="action-refuse" />
                <ActionBtn icon={<Calendar size={16} />} label="Agendar" onClick={() => toast.info('Abrir agenda...')} testid="action-schedule" />
                <ActionBtn icon={<CreditCard size={16} />} label="Pagamento" onClick={() => toast.info('Fluxo de pagamento')} testid="action-payment" />
                <ActionBtn icon={<StarIcon size={16} />} label="Avaliar" onClick={() => toast.info('Avaliação iniciada')} testid="action-rate" />
              </div>
            </div>
          )}

          {/* Input area */}
          {canChat && (
            <div className="border-t border-gray-100 p-4">
              {showMediaOptions && (
                <div className="flex gap-2 mb-3">
                  <Button data-testid="send-location-button" onClick={sendLocation} variant="outline" size="sm" className="rounded-full">
                    <MapPin size={14} className="mr-1" /> Localização
                  </Button>
                  <Button data-testid="send-image-button" onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="rounded-full">
                    <ImageIcon size={14} className="mr-1" /> Foto
                  </Button>
                  <Button data-testid="send-video-button" onClick={() => videoInputRef.current?.click()} variant="outline" size="sm" className="rounded-full">
                    <Video size={14} className="mr-1" /> Vídeo
                  </Button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />
              <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleFileUpload(e, 'image')} className="hidden" />

              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200">
                <button
                  data-testid="toggle-media-button"
                  onClick={() => setShowMediaOptions(!showMediaOptions)}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                  title="Anexar"
                >
                  <Paperclip size={18} className="text-gray-500" />
                </button>
                <button
                  data-testid="open-camera"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-2 hover:bg-gray-200 rounded-full transition"
                  title="Câmera"
                >
                  <Camera size={18} className="text-gray-500" />
                </button>
                <Textarea
                  data-testid="message-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Sua mensagem"
                  rows={1}
                  className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[24px] max-h-32 py-1 text-sm shadow-none"
                />
                <button
                  data-testid="send-message-button"
                  onClick={() => sendMessage()}
                  disabled={sending || !input.trim()}
                  className="w-9 h-9 grid place-items-center rounded-full bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 text-white transition"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                </button>
              </div>
            </div>
          )}
        </main>

        {/* ============ RIGHT: PROFILE PANEL ============ */}
        <aside className="col-span-12 md:col-span-3 md:pl-6">
          <div className="bg-white md:rounded-2xl md:shadow-sm border border-gray-200 p-6">
            {otherUser ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={avatarUrl(otherUser)}
                      alt={otherUser.name}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
                      data-testid="other-user-avatar"
                    />
                    <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-gray-900" data-testid="other-user-name">{otherUser.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-gray-900">5/5</span>
                    <span className="text-gray-500">(2 avaliações)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{getRoleLabel(otherUser.role)}</p>

                  <div className="flex items-center gap-3 mt-4">
                    <button
                      data-testid="video-call-btn"
                      onClick={() => toast.info('Chamada de vídeo em breve')}
                      className="w-11 h-11 rounded-full border border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] grid place-items-center transition"
                    >
                      <VideoIcon size={18} />
                    </button>
                    <button
                      data-testid="phone-call-btn"
                      onClick={() => toast.info('Chamada de voz em breve')}
                      className="w-11 h-11 rounded-full border border-gray-200 hover:border-[#16a34a] hover:text-[#16a34a] grid place-items-center transition"
                    >
                      <Phone size={18} />
                    </button>
                  </div>

                  <button
                    data-testid="view-profile-btn"
                    onClick={() => navigate('/profile')}
                    className="mt-5 w-full px-5 py-2.5 rounded-full border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition"
                  >
                    Ver perfil
                  </button>
                </div>

                <div className="mt-6 space-y-1 border-t pt-4">
                  <PanelLink icon={<Share2 size={16} />} label="Compartilhar perfil" onClick={() => toast.info('Compartilhar')} testid="share-profile" />
                  <PanelLink icon={<Pin size={16} />} label="Fixar conversa" onClick={() => toast.info('Conversa fixada')} testid="pin-conversation" />
                  <PanelLink icon={<Archive size={16} />} label="Arquivar conversa" onClick={() => toast.info('Conversa arquivada')} testid="archive-conversation" />
                </div>

                <div className="mt-4 space-y-1 border-t pt-4">
                  <PanelLink danger icon={<Flag size={16} />} label="Reportar perfil" onClick={() => toast.warning('Perfil reportado')} testid="report-profile" />
                  <PanelLink danger icon={<Ban size={16} />} label="Bloquear" onClick={() => toast.warning('Usuário bloqueado')} testid="block-user" />
                </div>
              </>
            ) : (
              <div className="text-center text-sm text-gray-400 py-10">Carregando perfil...</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

// ===== Helper components =====
const NavBtn = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    data-testid={`nav-${label.toLowerCase()}`}
    className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition ${
      active ? 'text-[#16a34a]' : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    {icon}
    <span className="text-[11px] font-medium">{label}</span>
  </button>
);

const ActionBtn = ({ icon, label, onClick, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-gray-400 hover:bg-gray-50 transition"
  >
    {icon}
    {label}
  </button>
);

const PanelLink = ({ icon, label, onClick, danger, testid }) => (
  <button
    onClick={onClick}
    data-testid={testid}
    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition ${
      danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
    }`}
  >
    <span className={danger ? 'text-red-500' : 'text-gray-500'}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    <ChevronRight size={14} className="text-gray-300" />
  </button>
);
