import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Image, 
  MessageSquare, 
  UserPlus,
  TrendingUp,
  Calendar,
  Eye,
  Clock
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { newsAPI, galleryAPI, contactAPI, registrationAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Fetch data for stats
  const { data: newsResponse, loading: newsLoading } = useApi(() => newsAPI.getAll({ limit: 1 }));
  const { data: galleryResponse, loading: galleryLoading } = useApi(() => galleryAPI.getAll({ limit: 1 }));
  const { data: messagesResponse, loading: messagesLoading } = useApi(() => contactAPI.getAll({ limit: 1 }));
  const { data: registrationsResponse, loading: registrationsLoading } = useApi(() => registrationAPI.getAll({ limit: 1 }));

  const isLoading = newsLoading || galleryLoading || messagesLoading || registrationsLoading;
  
  // Calculate stats from API responses
  const stats = {
    totalNews: newsResponse?.pagination?.total || 0,
    totalPhotos: galleryResponse?.pagination?.total || 0,
    totalMessages: messagesResponse?.pagination?.total || 0,
    totalRegistrations: registrationsResponse?.pagination?.total || 0,
    pendingMessages: messagesResponse?.data?.filter((m: any) => m.status === 'unread').length || 0,
    pendingRegistrations: registrationsResponse?.data?.filter((r: any) => r.status === 'pending').length || 0,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'news': return FileText;
      case 'photo': return Image;
      case 'message': return MessageSquare;
      case 'registration': return UserPlus;
      default: return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'news': return 'text-blue-600 bg-blue-100';
      case 'photo': return 'text-green-600 bg-green-100';
      case 'message': return 'text-purple-600 bg-purple-100';
      case 'registration': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue {user?.name}, voici un aperçu de l'activité du site.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actualités</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalNews}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+2 ce mois</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Photos</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalPhotos}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Image className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>+8 cette semaine</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Messages</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalMessages}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{stats.pendingMessages} en attente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inscriptions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-orange-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{stats.pendingRegistrations} en attente</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200">
            <FileText className="h-6 w-6 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Nouvelle actualité</h3>
            <p className="text-sm text-gray-600">Publier une news</p>
          </button>
          
          <button className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-left transition-colors duration-200">
            <Image className="h-6 w-6 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Ajouter des photos</h3>
            <p className="text-sm text-gray-600">Enrichir la galerie</p>
          </button>
          
          <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors duration-200">
            <MessageSquare className="h-6 w-6 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Messages</h3>
            <p className="text-sm text-gray-600">{stats.pendingMessages} non lus</p>
          </button>
          
          <button className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-left transition-colors duration-200">
            <UserPlus className="h-6 w-6 text-orange-600 mb-2" />
            <h3 className="font-medium text-gray-900">Inscriptions</h3>
            <p className="text-sm text-gray-600">{stats.pendingRegistrations} en attente</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
        {/* Site Analytics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques du site</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Visiteurs aujourd'hui</span>
              </div>
              <span className="font-bold text-gray-900">127</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Visiteurs ce mois</span>
              </div>
              <span className="font-bold text-gray-900">2,341</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Pages vues</span>
              </div>
              <span className="font-bold text-gray-900">8,923</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">Taux de conversion</span>
              </div>
              <span className="font-bold text-green-600">12.3%</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;