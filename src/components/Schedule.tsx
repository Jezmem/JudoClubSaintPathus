import React from 'react';
import { Clock, Euro, User, Info } from 'lucide-react';
import { scheduleData } from '../data/mockData';

const Schedule: React.FC = () => {
  const groupedSchedule = scheduleData.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, typeof scheduleData>);

  const pricing = [
    {
      category: 'Baby Judo (4-6 ans)',
      price: 180,
      includes: ['Licence FFJ', 'Assurance', 'Kimono de démarrage']
    },
    {
      category: 'Enfants (7-15 ans)',
      price: 220,
      includes: ['Licence FFJ', 'Assurance', 'Stages techniques']
    },
    {
      category: 'Adultes',
      price: 280,
      includes: ['Licence FFJ', 'Assurance', 'Accès libre tatami']
    },
    {
      category: 'Famille (3+ membres)',
      price: 500,
      includes: ['Réduction familiale', 'Tous les avantages inclus']
    }
  ];

  return (
    <section id="schedule" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Horaires & Tarifs</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos créneaux d'entraînement adaptés à tous les âges et nos tarifs 
            compétitifs pour la saison 2024-2025.
          </p>
        </div>

        {/* Schedule */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Planning des cours</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(groupedSchedule).map(([day, classes]) => (
              <div key={day} className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-xl font-bold text-red-600 mb-6 text-center">{day}</h4>
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="font-semibold text-gray-900">{classItem.timeSlot}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Euro className="h-4 w-4 text-green-600" />
                          <span className="text-green-600 font-medium">{classItem.price}€/mois</span>
                        </div>
                      </div>
                      <h5 className="font-bold text-gray-900 mb-1">{classItem.level}</h5>
                      <div className="flex items-center space-x-1 mb-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600 text-sm">{classItem.instructor}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{classItem.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Tarifs annuels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricing.map((price, index) => (
              <div key={index} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-red-600 transition-colors duration-300">
                <h4 className="text-lg font-bold text-gray-900 mb-4">{price.category}</h4>
                <div className="text-3xl font-bold text-red-600 mb-4">
                  {price.price}€
                  <span className="text-base text-gray-600 font-normal">/an</span>
                </div>
                <ul className="space-y-2">
                  {price.includes.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Info className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Informations importantes</h4>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• <strong>Cours d'essai gratuit</strong> pour tous les nouveaux adhérents</li>
                <li>• <strong>Réduction famille :</strong> -20% à partir du 3ème membre de la famille</li>
                <li>• <strong>Paiement échelonné :</strong> possibilité de régler en 3 fois sans frais</li>
                <li>• <strong>Vacances scolaires :</strong> stages optionnels organisés pendant les congés</li>
                <li>• <strong>Matériel :</strong> kimono obligatoire (conseil d'achat fourni)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Schedule;