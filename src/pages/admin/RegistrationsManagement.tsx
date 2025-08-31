import React, { useState } from 'react';
import { 
  UserPlus, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  X,
  XCircle,
  FileText
} from 'lucide-react';

interface RegistrationData {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  parentName?: string;
  parentEmail?: string;
  experience: string;
  medicalCertificate: boolean;
  newsletter: boolean;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

const RegistrationsManagement: React.FC = () => {
  const [registrations, setRegistrations] = useState<RegistrationData[]>([
    {
      id: 1,
      firstName: 'Lucas',
      lastName: 'Dubois',
      birthDate: '2015-03-15',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      parentName: 'Marie Dubois',
      parentEmail: 'marie.dubois@email.com',
      experience: 'debutant',
      medicalCertificate: false,
      newsletter: true,
      date: '2024-01-15T10:30:00Z',
      status: 'pending',
      notes: ''
    },
    {
      id: 2,
      firstName: 'Pierre',
      lastName: 'Martin',
      birthDate: '1985-07-22',
      email: 'p.martin@email.com',
      phone: '06 98 76 54 32',
      experience: 'initie',
      medicalCertificate: true,
      newsletter: false,
      date: '2024-01-14T16:45:00Z',
      status: 'approved',
      notes: 'Ancien pratiquant, bon niveau'
    },
    {
      id: 3,
      firstName: 'Emma',
      lastName: 'Leroy',
      birthDate: '2010-11-08',
      email: 'sophie.leroy@email.com',
      phone: '01 23 45 67 89',
      parentName: 'Sophie Leroy',
      parentEmail: 'sophie.leroy@email.com',
      experience: 'intermediate',
      medicalCertificate: true,
      newsletter: true,
      date: '2024-01-13T14:20:00Z',
      status: 'approved',
      notes: 'Pratique depuis 2 ans dans un autre club'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const itemsPerPage = 10;

  const filteredRegistrations = registrations.filter(registration => {
    const matchesSearch = registration.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         registration.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || registration.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const isMinor = (birthDate: string) => {
    return calculateAge(birthDate) < 18;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Refusée';
      default: return status;
    }
  };

  const getExperienceLabel = (experience: string) => {
    switch (experience) {
      case 'debutant': return 'Débutant complet';
      case 'initie': return 'Quelques notions';
      case 'intermediate': return 'Niveau intermédiaire';
      case 'avance': return 'Niveau avancé';
      default: return experience;
    }
  };

  const openDetail = (registration: RegistrationData) => {
    setSelectedRegistration(registration);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedRegistration(null);
  };

  const updateStatus = (id: number, status: 'approved' | 'rejected') => {
    setRegistrations(prev => prev.map(reg => 
      reg.id === id ? { ...reg, status } : reg
    ));
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Âge', 'Expérience', 'Statut', 'Date inscription'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        reg.lastName,
        reg.firstName,
        reg.email,
        reg.phone,
        calculateAge(reg.birthDate),
        getExperienceLabel(reg.experience),
        getStatusLabel(reg.status),
        formatDate(reg.date)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inscriptions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des inscriptions</h1>
          <p className="text-gray-600">Consultez et gérez les demandes d'inscription</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Download className="h-5 w-5" />
          <span>Exporter CSV</span>
        </button>
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
                {registrations.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">En attente</p>
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
                {registrations.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Approuvées</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Refusées</p>
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
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Refusées</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            {filteredRegistrations.length} inscription(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Candidat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expérience
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
              {paginatedRegistrations.map((registration) => (
                <tr 
                  key={registration.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${
                    registration.status === 'pending' ? 'bg-orange-50' : ''
                  }`}
                  onClick={() => openDetail(registration)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {registration.firstName} {registration.lastName}
                      </h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{registration.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{registration.phone}</span>
                      </div>
                      {registration.parentName && (
                        <div className="text-xs text-gray-500 mt-1">
                          Parent: {registration.parentName}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-medium text-gray-900">{calculateAge(registration.birthDate)} ans</span>
                      {isMinor(registration.birthDate) && (
                        <div className="text-xs text-blue-600 mt-1">Mineur</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                      {getExperienceLabel(registration.experience)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{formatDate(registration.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                        {getStatusLabel(registration.status)}
                      </span>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-3 w-3 text-gray-400" />
                        <span className={`text-xs ${registration.medicalCertificate ? 'text-green-600' : 'text-red-600'}`}>
                          {registration.medicalCertificate ? 'Certificat OK' : 'Certificat manquant'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(registration);
                        }}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Voir le détail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {registration.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(registration.id, 'approved');
                            }}
                            className="text-green-600 hover:text-green-700 p-1"
                            title="Approuver"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(registration.id, 'rejected');
                            }}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Refuser"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
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
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredRegistrations.length)} sur {filteredRegistrations.length} résultats
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

      {/* Registration Detail Modal */}
      {isDetailOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Détail de l'inscription</h2>
              <button
                onClick={closeDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Nom complet : </span>
                    <span className="text-gray-900">{selectedRegistration.firstName} {selectedRegistration.lastName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Âge : </span>
                    <span className="text-gray-900">{calculateAge(selectedRegistration.birthDate)} ans</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date de naissance : </span>
                    <span className="text-gray-900">{new Date(selectedRegistration.birthDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Expérience : </span>
                    <span className="text-gray-900">{getExperienceLabel(selectedRegistration.experience)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Contact</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{selectedRegistration.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{selectedRegistration.phone}</span>
                  </div>
                </div>
              </div>

              {/* Parent Info (if minor) */}
              {isMinor(selectedRegistration.birthDate) && selectedRegistration.parentName && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Représentant légal</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Nom : </span>
                      <span className="text-gray-900">{selectedRegistration.parentName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedRegistration.parentEmail}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Status & Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Statut et options</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Statut : </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRegistration.status)}`}>
                      {getStatusLabel(selectedRegistration.status)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Certificat médical : </span>
                    <span className={selectedRegistration.medicalCertificate ? 'text-green-600' : 'text-red-600'}>
                      {selectedRegistration.medicalCertificate ? 'Fourni' : 'À fournir'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Newsletter : </span>
                    <span className="text-gray-900">{selectedRegistration.newsletter ? 'Oui' : 'Non'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date d'inscription : </span>
                    <span className="text-gray-900">{formatDate(selectedRegistration.date)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {selectedRegistration.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          updateStatus(selectedRegistration.id, 'approved');
                          closeDetail();
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approuver</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          updateStatus(selectedRegistration.id, 'rejected');
                          closeDetail();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Refuser</span>
                      </button>
                    </>
                  )}
                  
                  <a
                    href={`mailto:${selectedRegistration.email}?subject=Inscription Judo Club Saint Pathus&body=Bonjour ${selectedRegistration.firstName},%0D%0A%0D%0AMerci pour votre demande d'inscription.%0D%0A%0D%0ACordialement,%0D%0AJudo Club Saint Pathus`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Contacter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationsManagement;