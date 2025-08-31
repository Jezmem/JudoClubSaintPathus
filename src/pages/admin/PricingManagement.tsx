import React, { useState } from 'react';
import { 
  Euro, 
  Edit, 
  Save,
  X,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { Schedule } from '../../types';
import { scheduleData } from '../../data/mockData';

interface PricingCategory {
  id: number;
  category: string;
  price: number;
  includes: string[];
  description: string;
  active: boolean;
}

const PricingManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(scheduleData);
  const [pricingCategories, setPricingCategories] = useState<PricingCategory[]>([
    {
      id: 1,
      category: 'Baby Judo (4-6 ans)',
      price: 180,
      includes: ['Licence FFJ', 'Assurance', 'Kimono de démarrage'],
      description: 'Éveil corporel et initiation aux valeurs du judo',
      active: true
    },
    {
      id: 2,
      category: 'Enfants (7-15 ans)',
      price: 220,
      includes: ['Licence FFJ', 'Assurance', 'Stages techniques'],
      description: 'Apprentissage progressif des techniques',
      active: true
    },
    {
      id: 3,
      category: 'Adultes',
      price: 280,
      includes: ['Licence FFJ', 'Assurance', 'Accès libre tatami'],
      description: 'Judo traditionnel et moderne',
      active: true
    },
    {
      id: 4,
      category: 'Famille (3+ membres)',
      price: 500,
      includes: ['Réduction familiale', 'Tous les avantages inclus'],
      description: 'Tarif préférentiel pour les familles',
      active: true
    }
  ]);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editingPricing, setEditingPricing] = useState<PricingCategory | null>(null);
  const [scheduleFormData, setScheduleFormData] = useState<Partial<Schedule>>({});
  const [pricingFormData, setPricingFormData] = useState<Partial<PricingCategory>>({});

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  const openScheduleModal = (schedule?: Schedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleFormData(schedule);
    } else {
      setEditingSchedule(null);
      setScheduleFormData({
        day: 'Lundi',
        timeSlot: '',
        level: '',
        instructor: '',
        price: 0,
        description: '',
        active: true
      });
    }
    setIsScheduleModalOpen(true);
  };

  const openPricingModal = (pricing?: PricingCategory) => {
    if (pricing) {
      setEditingPricing(pricing);
      setPricingFormData(pricing);
    } else {
      setEditingPricing(null);
      setPricingFormData({
        category: '',
        price: 0,
        includes: [],
        description: '',
        active: true
      });
    }
    setIsPricingModalOpen(true);
  };

  const closeScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setEditingSchedule(null);
    setScheduleFormData({});
  };

  const closePricingModal = () => {
    setIsPricingModalOpen(false);
    setEditingPricing(null);
    setPricingFormData({});
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingSchedule) {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === editingSchedule.id ? { ...schedule, ...scheduleFormData } as Schedule : schedule
      ));
    } else {
      const newSchedule: Schedule = {
        id: Math.max(...schedules.map(s => s.id)) + 1,
        ...scheduleFormData as Schedule
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    
    closeScheduleModal();
  };

  const handlePricingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPricing) {
      setPricingCategories(prev => prev.map(pricing => 
        pricing.id === editingPricing.id ? { ...pricing, ...pricingFormData } as PricingCategory : pricing
      ));
    } else {
      const newPricing: PricingCategory = {
        id: Math.max(...pricingCategories.map(p => p.id)) + 1,
        ...pricingFormData as PricingCategory
      };
      setPricingCategories(prev => [...prev, newPricing]);
    }
    
    closePricingModal();
  };

  const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setScheduleFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setScheduleFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setScheduleFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setPricingFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setPricingFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setPricingFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const deleteSchedule = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    }
  };

  const deletePricing = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie tarifaire ?')) {
      setPricingCategories(prev => prev.filter(pricing => pricing.id !== id));
    }
  };

  const groupedSchedule = schedules.reduce((acc, item) => {
    if (!acc[item.day]) {
      acc[item.day] = [];
    }
    acc[item.day].push(item);
    return acc;
  }, {} as Record<string, Schedule[]>);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des tarifs</h1>
        <p className="text-gray-600">Gérez les horaires, créneaux et tarifications du club</p>
      </div>

      {/* Schedule Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Planning des cours</h2>
          <button
            onClick={() => openScheduleModal()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau créneau</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-red-600 mb-4 text-center">{day}</h3>
              <div className="space-y-3">
                {groupedSchedule[day]?.map((schedule) => (
                  <div key={schedule.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{schedule.timeSlot}</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => openScheduleModal(schedule)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSchedule(schedule.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 text-sm">{schedule.level}</h4>
                    <p className="text-xs text-gray-600">{schedule.instructor}</p>
                    <p className="text-xs text-green-600 font-medium">{schedule.price}€/mois</p>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 py-4">
                    <p className="text-sm">Aucun cours ce jour</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Categories */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Catégories tarifaires</h2>
          <button
            onClick={() => openPricingModal()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle catégorie</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pricingCategories.map((pricing) => (
            <div key={pricing.id} className="border border-gray-200 rounded-lg p-6 hover:border-red-600 transition-colors duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">{pricing.category}</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openPricingModal(pricing)}
                    className="text-blue-600 hover:text-blue-700 p-1"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deletePricing(pricing.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="text-3xl font-bold text-red-600 mb-4">
                {pricing.price}€
                <span className="text-base text-gray-600 font-normal">/an</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{pricing.description}</p>
              
              <ul className="space-y-2">
                {pricing.includes.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              {!pricing.active && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-2">
                  <span className="text-red-700 text-xs">Catégorie désactivée</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingSchedule ? 'Modifier le créneau' : 'Nouveau créneau'}
              </h2>
              <button
                onClick={closeScheduleModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jour *
                  </label>
                  <select
                    name="day"
                    required
                    value={scheduleFormData.day || ''}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horaire *
                  </label>
                  <input
                    type="text"
                    name="timeSlot"
                    required
                    placeholder="ex: 17h30 - 18h30"
                    value={scheduleFormData.timeSlot || ''}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau/Groupe *
                </label>
                <input
                  type="text"
                  name="level"
                  required
                  placeholder="ex: Baby Judo (4-6 ans)"
                  value={scheduleFormData.level || ''}
                  onChange={handleScheduleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Professeur *
                  </label>
                  <input
                    type="text"
                    name="instructor"
                    required
                    value={scheduleFormData.instructor || ''}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix mensuel (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={scheduleFormData.price || ''}
                    onChange={handleScheduleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={scheduleFormData.description || ''}
                  onChange={handleScheduleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="scheduleActive"
                  name="active"
                  checked={scheduleFormData.active || false}
                  onChange={handleScheduleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="scheduleActive" className="text-sm text-gray-700">
                  Créneau actif
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeScheduleModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingSchedule ? 'Modifier' : 'Créer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {isPricingModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPricing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h2>
              <button
                onClick={closePricingModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handlePricingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  name="category"
                  required
                  placeholder="ex: Baby Judo (4-6 ans)"
                  value={pricingFormData.category || ''}
                  onChange={handlePricingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix annuel (€) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  value={pricingFormData.price || ''}
                  onChange={handlePricingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={pricingFormData.description || ''}
                  onChange={handlePricingChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inclusions (une par ligne)
                </label>
                <textarea
                  name="includes"
                  rows={4}
                  placeholder="Licence FFJ&#10;Assurance&#10;Kimono de démarrage"
                  value={Array.isArray(pricingFormData.includes) ? pricingFormData.includes.join('\n') : ''}
                  onChange={(e) => {
                    const includes = e.target.value.split('\n').filter(item => item.trim());
                    setPricingFormData(prev => ({ ...prev, includes }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="pricingActive"
                  name="active"
                  checked={pricingFormData.active || false}
                  onChange={handlePricingChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="pricingActive" className="text-sm text-gray-700">
                  Catégorie active
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closePricingModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPricing ? 'Modifier' : 'Créer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingManagement;