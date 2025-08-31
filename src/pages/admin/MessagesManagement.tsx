import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  X,
  Reply
} from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
  category: string;
}

const MessagesManagement: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      subject: 'inscription',
      message: 'Bonjour, je souhaiterais inscrire mon fils de 8 ans au judo. Pourriez-vous me donner plus d\'informations sur les horaires et les tarifs ? Merci.',
      date: '2024-01-15T10:30:00Z',
      status: 'unread',
      category: 'Inscription / Cours d\'essai'
    },
    {
      id: 2,
      name: 'Pierre Martin',
      email: 'p.martin@email.com',
      subject: 'horaires',
      message: 'Bonjour, est-ce que vous avez des cours pour adultes débutants le soir ? Je travaille en journée. Cordialement.',
      date: '2024-01-14T16:45:00Z',
      status: 'read',
      category: 'Horaires et tarifs'
    },
    {
      id: 3,
      name: 'Sophie Leroy',
      email: 'sophie.leroy@email.com',
      phone: '01 23 45 67 89',
      subject: 'competition',
      message: 'Ma fille participe aux compétitions. Pouvez-vous me donner le calendrier des prochains tournois ? Merci beaucoup.',
      date: '2024-01-13T14:20:00Z',
      status: 'replied',
      category: 'Compétition'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMessages = filteredMessages.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-orange-100 text-orange-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unread': return 'Non lu';
      case 'read': return 'Lu';
      case 'replied': return 'Répondu';
      default: return status;
    }
  };

  const openDetail = (message: Message) => {
    setSelectedMessage(message);
    setIsDetailOpen(true);
    
    // Mark as read if unread
    if (message.status === 'unread') {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'read' } : m
      ));
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedMessage(null);
  };

  const markAsReplied = (id: number) => {
    setMessages(prev => prev.map(message => 
      message.id === id ? { ...message, status: 'replied' } : message
    ));
  };

  const deleteMessage = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      setMessages(prev => prev.filter(message => message.id !== id));
      if (selectedMessage?.id === id) {
        closeDetail();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des messages</h1>
        <p className="text-gray-600">Consultez et gérez les messages reçus via le formulaire de contact</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'unread').length}
              </p>
              <p className="text-sm text-gray-600">Messages non lus</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'read').length}
              </p>
              <p className="text-sm text-gray-600">Messages lus</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {messages.filter(m => m.status === 'replied').length}
              </p>
              <p className="text-sm text-gray-600">Messages traités</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="unread">Non lus</option>
              <option value="read">Lus</option>
              <option value="replied">Traités</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            {filteredMessages.length} message(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expéditeur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sujet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMessages.map((message) => (
                <tr 
                  key={message.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${
                    message.status === 'unread' ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => openDetail(message)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{message.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{message.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{message.category}</p>
                      <p className="text-sm text-gray-600 mt-1 truncate max-w-xs">
                        {message.message}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(message.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                      {getStatusLabel(message.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(message);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Voir le détail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message.id);
                        }}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredMessages.length)} sur {filteredMessages.length} résultats
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {isDetailOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Détail du message</h2>
              <button
                onClick={closeDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Message Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informations de contact</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Nom :</span>
                        <span className="text-gray-900">{selectedMessage.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">{selectedMessage.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Détails du message</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{formatDate(selectedMessage.date)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Catégorie : </span>
                        <span className="text-gray-900">{selectedMessage.category}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Statut : </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedMessage.status)}`}>
                          {getStatusLabel(selectedMessage.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Message</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.category}&body=Bonjour ${selectedMessage.name},%0D%0A%0D%0AMerci pour votre message.%0D%0A%0D%0ACordialement,%0D%0AJudo Club Saint Pathus`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Reply className="h-4 w-4" />
                    <span>Répondre par email</span>
                  </a>
                  
                  {selectedMessage.status !== 'replied' && (
                    <button
                      onClick={() => markAsReplied(selectedMessage.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Marquer comme traité</span>
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => deleteMessage(selectedMessage.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                  title="Supprimer"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesManagement;