import React, { useState } from 'react';
import { Clock, Users, Euro, MapPin, Phone, Mail, Download, FileText, Star } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { scheduleAPI, instructorAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const SchedulePage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');

  const { data: schedules, loading: schedulesLoading, error: schedulesError, refetch: refetchSchedules } = useApi(
    () => scheduleAPI.getAll(),
    []
  );

  const { data: instructors, loading: instructorsLoading, error: instructorsError, refetch: refetchInstructors } = useApi(
    () => instructorAPI.getAll(),
    []
  );

  const levels = ['all', ...Array.from(new Set((schedules || []).map((s: any) => s.level)))];

  const filteredSchedules = selectedLevel === 'all' 
    ? (schedules || [])
    : (schedules || []).filter((s: any) => s.level === selectedLevel);

  const groupedSchedules = filteredSchedules.reduce((acc: any, schedule: any) => {
    const day = schedule.dayOfWeek;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(schedule);
    return acc;
  }, {});

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayNames: { [key: string]: string } = {
    monday: 'Lundi',
    tuesday: 'Mardi', 
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  };

  const levelNames: { [key: string]: string } = {
    kids: 'Enfants',
    teens: 'Adolescents',
    adults: 'Adultes'
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  const pricingCategories = [
    {
      id: 1,
      category: 'Baby Judo (4-6 ans)',
      price: 180,
      includes: ['Licence FFJ', 'Assurance', 'Kimono de démarrage'],
      description: 'Éveil corporel et initiation aux valeurs du judo',
      popular: false
    },
    {
      id: 2,
      category: 'Enfants (7-15 ans)',
      price: 220,
      includes: ['Licence FFJ', 'Assurance', 'Stages techniques'],
      description: 'Apprentissage progressif des techniques',
      popular: true
    },
    {
      id: 3,
      category: 'Adultes',
      price: 280,
      includes: ['Licence FFJ', 'Assurance', 'Accès libre tatami'],
      description: 'Judo traditionnel et moderne',
      popular: false
    },
    {
      id: 4,
      category: 'Famille (3+ membres)',
      price: 500,
      includes: ['Réduction familiale', 'Tous les avantages inclus'],
      description: 'Tarif préférentiel pour les familles',
      popular: false
    }
  ];

  return (
    <div className="pt-16">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Horaires & Tarifs</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez nos créneaux d'entraînement adaptés à tous les âges et nos tarifs compétitifs. 
              Cours d'essai gratuit pour tous les nouveaux adhérents.
            </p>
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedLevel === level
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-md'
                }`}
              >
                {level === 'all' ? 'Tous les niveaux' : levelNames[level] || level}
              </button>
            ))}
          </div>

          {schedulesLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {schedulesError && (
            <ErrorMessage 
              message={schedulesError} 
              onRetry={refetchSchedules}
              className="mb-8"
            />
          )}

          {/* Schedule Grid */}
          {schedules && schedules.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-20">
              {days.map(day => (
                <div key={day} className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-bold text-red-600 mb-4 text-center">
                    {dayNames[day]}
                  </h3>
                  <div className="space-y-3">
                    {groupedSchedules[day]?.map((schedule: any) => (
                      <div key={schedule.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </div>
                        <div className="text-sm text-gray-700 mb-1">
                          {levelNames[schedule.level] || schedule.level}
                        </div>
                        {schedule.instructor && (
                          <div className="text-xs text-gray-600 mb-2">
                            {schedule.instructor.name}
                          </div>
                        )}
                        {schedule.price && (
                          <div className="text-sm font-medium text-green-600">
                            {schedule.price}€/mois
                          </div>
                        )}
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 py-4">
                        <p className="text-sm">Aucun cours</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos tarifs</h2>
              <p className="text-xl text-gray-600">
                Des tarifs adaptés à tous les budgets avec de nombreux avantages inclus
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {pricingCategories.map((pricing) => (
                <div
                  key={pricing.id}
                  className={`relative bg-white rounded-lg shadow-lg p-6 ${
                    pricing.popular ? 'ring-2 ring-red-500 transform scale-105' : ''
                  }`}
                >
                  {pricing.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>Populaire</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pricing.category}</h3>
                    <div className="text-3xl font-bold text-red-600 mb-2">
                      {pricing.price}€
                      <span className="text-base text-gray-600 font-normal">/an</span>
                    </div>
                    <p className="text-gray-600 text-sm">{pricing.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {pricing.includes.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                    Choisir ce tarif
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
              <p className="text-gray-600">
                Toutes les informations utiles pour votre inscription
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Lieu des cours</h4>
                <p className="text-gray-600 text-sm">
                  Gymnase municipal<br />
                  12 Rue des Sports<br />
                  77178 Saint Pathus
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                <p className="text-gray-600 text-sm">
                  01 64 67 89 12<br />
                  contact@judoclubsaintpathus.fr
                </p>
              </div>

              <div className="text-center">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-red-600 hover:text-red-700 text-sm">
                    <Download className="h-4 w-4 inline mr-1" />
                    Dossier d'inscription
                  </a>
                  <a href="#" className="block text-red-600 hover:text-red-700 text-sm">
                    <Download className="h-4 w-4 inline mr-1" />
                    Certificat médical type
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;