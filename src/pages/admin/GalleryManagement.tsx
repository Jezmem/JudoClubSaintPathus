import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Upload,
  Eye
} from 'lucide-react';
import { Photo } from '../../types';
import { galleryData } from '../../data/mockData';

const GalleryManagement: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>(galleryData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState<Partial<Photo>>({});
  const [previewImage, setPreviewImage] = useState<string>('');

  const itemsPerPage = 8;
  const categories = ['all', ...Array.from(new Set(photos.map(p => p.category)))];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || photo.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPhotos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPhotos = filteredPhotos.slice(startIndex, startIndex + itemsPerPage);

  const openModal = (photo?: Photo) => {
    if (photo) {
      setEditingPhoto(photo);
      setFormData(photo);
      setPreviewImage(photo.url);
    } else {
      setEditingPhoto(null);
      setFormData({
        title: '',
        description: '',
        category: 'Entraînements',
        alt: '',
        url: '',
        active: true
      });
      setPreviewImage('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    setFormData({});
    setPreviewImage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPhoto) {
      setPhotos(prev => prev.map(photo => 
        photo.id === editingPhoto.id ? { ...photo, ...formData } as Photo : photo
      ));
    } else {
      const newPhoto: Photo = {
        id: Math.max(...photos.map(p => p.id)) + 1,
        ...formData as Photo
      };
      setPhotos(prev => [newPhoto, ...prev]);
    }
    
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette photo ?')) {
      setPhotos(prev => prev.filter(photo => photo.id !== id));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Update preview for image URL
      if (name === 'url') {
        setPreviewImage(value);
      }
    }
  };

  const toggleActive = (id: number) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, active: !photo.active } : photo
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion de la galerie</h1>
          <p className="text-gray-600">Gérez les photos et images du club</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ajouter une photo</span>
        </button>
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
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Toutes les catégories</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center">
            {filteredPhotos.length} photo(s) trouvée(s)
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paginatedPhotos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openModal(photo)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full transition-colors duration-200"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full transition-colors duration-200"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {!photo.active && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    Masquée
                  </div>
                )}
              </div>
              
              <div className="mt-3">
                <h3 className="font-medium text-gray-900 truncate">{photo.title}</h3>
                <p className="text-sm text-gray-600 truncate">{photo.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                    {photo.category}
                  </span>
                  <button
                    onClick={() => toggleActive(photo.id)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors duration-200 ${
                      photo.active 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {photo.active ? 'Visible' : 'Masquée'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredPhotos.length)} sur {filteredPhotos.length} résultats
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPhoto ? 'Modifier la photo' : 'Ajouter une photo'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image *
                </label>
                <input
                  type="url"
                  name="url"
                  required
                  value={formData.url || ''}
                  onChange={handleFormChange}
                  placeholder="https://images.pexels.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {previewImage && (
                  <div className="mt-3">
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={() => setPreviewImage('')}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie *
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category || ''}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Entraînements">Entraînements</option>
                    <option value="Compétitions">Compétitions</option>
                    <option value="Stages">Stages</option>
                    <option value="Événements">Événements</option>
                    <option value="Installations">Installations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texte alternatif *
                  </label>
                  <input
                    type="text"
                    name="alt"
                    required
                    value={formData.alt || ''}
                    onChange={handleFormChange}
                    placeholder="Description pour l'accessibilité"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active || false}
                  onChange={handleFormChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Photo visible sur le site
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPhoto ? 'Modifier' : 'Ajouter'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;