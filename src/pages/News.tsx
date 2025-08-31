import React, { useState } from 'react';
import { Calendar, User, Tag, ArrowRight, Clock, X } from 'lucide-react';
import { newsData } from '../data/mockData';

const NewsPage: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Merci pour votre inscription à la newsletter !');
    setEmail('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  const filteredNews = newsData.filter(news => {
    if (selectedFilter === 'upcoming') return isUpcoming(news.date);
    if (selectedFilter === 'past') return !isUpcoming(news.date);
    return true;
  });

  return (
    <div className="pt-16">
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Actualités</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Restez informés de toute l'actualité du club : événements, compétitions, 
              stages et nouvelles importantes.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedFilter === 'all'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Toutes les actualités
            </button>
            <button
              onClick={() => setSelectedFilter('upcoming')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedFilter === 'upcoming'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              À venir
            </button>
            <button
              onClick={() => setSelectedFilter('past')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedFilter === 'past'
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Passées
            </button>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                  news.important ? 'ring-2 ring-red-500' : ''
                }`}
              >
                {news.important && (
                  <div className="bg-red-500 text-white text-center py-2 text-sm font-medium">
                    ACTUALITÉ IMPORTANTE
                  </div>
                )}

                {isUpcoming(news.date) && (
                  <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium flex items-center justify-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>À VENIR</span>
                  </div>
                )}
                
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                />
                
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{news.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{news.title}</h3>
                  <p className="text-gray-600 mb-4">{news.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {news.category}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedNews(news.id)}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1 transition-colors duration-200"
                    >
                      <span>Lire plus</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  
                  {news.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {news.tags.map((tag, index) => (
                          <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-red-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Restez informés avec notre newsletter
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Recevez directement dans votre boîte mail toutes les actualités du club, 
              les dates importantes et les événements à ne pas manquer.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                S'abonner
              </button>
            </form>
          </div>

          {/* News Detail Modal */}
          {selectedNews && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
                {(() => {
                  const news = newsData.find(n => n.id === selectedNews);
                  if (!news) return null;
                  
                  return (
                    <>
                      <div className="relative">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-64 object-cover"
                        />
                        <button
                          onClick={() => setSelectedNews(null)}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 transition-colors duration-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
                        {isUpcoming(news.date) && (
                          <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>À VENIR</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(news.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{news.author}</span>
                          </div>
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            {news.category}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{news.title}</h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {news.content}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NewsPage;