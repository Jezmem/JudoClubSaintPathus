import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { galleryAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const GalleryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const { data: galleryData, loading, error, refetch } = useApi(
    () => galleryAPI.getAll({ limit: 50 }),
    []
  );
  
  const photos = galleryData || [];
  const categories = ['Toutes', ...Array.from(new Set(photos.map((photo: any) => photo.category)))];
  
  const filteredPhotos = selectedCategory === 'Toutes' 
    ? photos 
    : photos.filter((photo: any) => photo.category === selectedCategory);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredPhotos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredPhotos.length - 1 : selectedImage - 1);
    }
  };

  return (
    <div className="pt-16">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Galerie photos</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plongez dans l'univers de notre club à travers ces moments capturés lors 
              de nos entraînements, compétitions et événements.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={refetch}
              className="mb-8"
            />
          )}

          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error} 
              onRetry={refetch}
              className="mb-8"
            />
          )}

          {/* Photo Grid */}
          {filteredPhotos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPhotos.map((photo: any, index: number) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                    <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                      <p className="text-sm opacity-90">{photo.description}</p>
                      <span className="inline-block bg-red-600 text-xs px-2 py-1 rounded-full mt-2">
                        {photo.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {selectedImage !== null && filteredPhotos[selectedImage] && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-full">
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-white" />
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                >
                  <ChevronLeft className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                >
                  <ChevronRight className="h-6 w-6 text-white" />
                </button>

                {/* Image */}
                <img
                  src={filteredPhotos[selectedImage].url}
                  alt={filteredPhotos[selectedImage].alt}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Image Info */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4 text-white">
                  <h3 className="text-xl font-semibold mb-2">{filteredPhotos[selectedImage].title}</h3>
                  <p className="text-gray-200">{filteredPhotos[selectedImage].description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;