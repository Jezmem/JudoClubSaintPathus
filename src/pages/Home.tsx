import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Award, Users, Clock, ArrowRight, Calendar, Trophy, MapPin, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { newsAPI, instructorAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Home: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Fetch latest news
  const { data: latestNews, loading: newsLoading, error: newsError, refetch: refetchNews } = useApi(
    () => newsAPI.getAll({ limit: 3 }),
    []
  );

  // Fetch instructors
  const { data: instructors, loading: instructorsLoading, error: instructorsError, refetch: refetchInstructors } = useApi(
    () => instructorAPI.getAll(),
    []
  );

  const values = [
    { icon: Star, title: 'Respect', description: 'Envers soi-même et les autres' },
    { icon: Award, title: 'Courage', description: 'Face aux défis quotidiens' },
    { icon: Users, title: 'Amitié', description: 'Des liens qui se créent' },
  ];

  const stats = [
    { number: '150+', label: 'Licenciés' },
    { number: '25', label: 'Années d\'expérience' },
    { number: '6', label: 'Professeurs diplômés' },
    { number: '400m²', label: 'Dojo moderne' },
  ];

  const highlights = [
    { icon: MapPin, title: 'Installations modernes', description: 'Dojo de 400m² avec tatamis professionnels' },
    { icon: Clock, title: '25 ans d\'expérience', description: 'Un quart de siècle au service du judo' },
    { icon: Trophy, title: 'Palmarès exceptionnel', description: 'Nombreux champions formés dans notre club' },
    { icon: Users, title: 'Équipe pédagogique', description: 'Professeurs diplômés d\'État passionnés' },
  ];

  const faqData = [
    {
      id: 1,
      question: "À partir de quel âge peut-on commencer le judo ?",
      answer: "Nous accueillons les enfants à partir de 4 ans dans notre cours de Baby Judo. C'est l'âge idéal pour développer la motricité et découvrir les valeurs du judo dans un environnement ludique.",
      category: "Général"
    },
    {
      id: 2,
      question: "Faut-il un certificat médical pour s'inscrire ?",
      answer: "Oui, un certificat médical de non contre-indication à la pratique du judo est obligatoire pour tous les licenciés. Pour les compétiteurs, un certificat spécifique est requis.",
      category: "Inscription"
    },
    {
      id: 3,
      question: "Quel équipement faut-il pour commencer ?",
      answer: "Pour débuter, un kimono blanc (judogi) et une ceinture blanche suffisent. Nous pouvons vous conseiller sur les marques et les magasins partenaires pour bénéficier de tarifs préférentiels.",
      category: "Équipement"
    },
    {
      id: 4,
      question: "Peut-on faire un cours d'essai ?",
      answer: "Absolument ! Nous proposons un cours d'essai gratuit pour tous les nouveaux adhérents. Il suffit de nous contacter pour convenir d'un rendez-vous.",
      category: "Inscription"
    },
    {
      id: 5,
      question: "Quels sont les horaires d'ouverture du secrétariat ?",
      answer: "Le secrétariat est ouvert les lundis, mercredis et vendredi de 17h à 20h, ainsi que le samedi matin de 9h à 12h pendant la période scolaire.",
      category: "Pratique"
    },
    {
      id: 6,
      question: "Le club organise-t-il des compétitions ?",
      answer: "Oui, nous participons régulièrement aux compétitions départementales et régionales. La participation n'est pas obligatoire mais nous encourageons nos judokas à découvrir cette dimension du judo.",
      category: "Compétition"
    }
  ];


  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7045754/pexels-photo-7045754.jpeg)'
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Judo Club <span className="text-red-400">Saint Pathus</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Découvrez l'art martial japonais dans un environnement convivial et respectueux. 
              Du baby judo aux adultes, chacun trouve sa place dans notre dojo.
            </p>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <value.icon className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                to="/registration"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Cours d'essai gratuit
              </Link>
              <Link
                to="/schedule"
                className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 backdrop-blur-sm"
              >
                Voir les horaires
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-4xl w-full px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <p className="text-white italic mb-4">
              "Le judo a transformé la vie de mon fils. Il a gagné en confiance et en discipline. 
              L'équipe pédagogique est exceptionnelle !"
            </p>
            <div className="flex items-center justify-center space-x-2">
              <img 
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg" 
                alt="Marie Dubois" 
                className="w-10 h-10 rounded-full"
              />
              <div className="text-left">
                <p className="text-white font-semibold">Marie Dubois</p>
                <p className="text-gray-300 text-sm">Maman de Lucas, 8 ans</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">À propos du club</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Depuis 1999, le Judo Club Saint Pathus forme des judokas de tous âges dans un esprit 
              de respect, de discipline et de convivialité.
            </p>
          </div>

          {/* Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Notre histoire</h3>
              <p className="text-gray-600 mb-4">
                Fondé en 1999 par Maître Pierre Durand, le Judo Club Saint Pathus s'est rapidement 
                imposé comme une référence dans la région. Notre club, affilié à la Fédération 
                Française de Judo, accueille aujourd'hui plus de 150 licenciés.
              </p>
              <p className="text-gray-600 mb-4">
                Notre mission est de transmettre les valeurs fondamentales du judo : le respect, 
                le courage, la sincérité, l'honneur, la modestie, le contrôle de soi, l'amitié 
                et la politesse. Ces valeurs guident notre enseignement au quotidien.
              </p>
              <p className="text-gray-600">
                Que vous soyez débutant ou confirmé, enfant ou adulte, notre équipe pédagogique 
                vous accompagne dans votre progression avec patience et expertise.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8611192/pexels-photo-8611192.jpeg" 
                alt="Dojo du club" 
                className="rounded-lg shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-red-600 text-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold">150+</div>
                <div className="text-sm">Licenciés actifs</div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {highlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <highlight.icon className="h-12 w-12 text-red-600 mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h4>
                <p className="text-gray-600">{highlight.description}</p>
              </div>
            ))}
          </div>

          {/* Instructors */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Notre équipe pédagogique</h3>
            
            {instructorsLoading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {instructorsError && (
              <ErrorMessage 
                message={instructorsError} 
                onRetry={refetchInstructors}
                className="mb-8"
              />
            )}

            {instructors && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {instructors.map((instructor: any) => (
                  <div key={instructor.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img 
                      src={instructor.photoUrl} 
                      alt={instructor.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {instructor.name}
                      </h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                          {instructor.beltRank}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{instructor.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi choisir notre club ?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Depuis 1999, nous formons des judokas de tous âges dans un esprit de respect, 
              de discipline et de convivialité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Excellence sportive</h3>
              <p className="text-gray-600 mb-6">
                Nos judokas brillent dans les compétitions départementales et régionales 
                grâce à un encadrement de qualité.
              </p>
              <Link 
                to="/schedule" 
                className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center space-x-1"
              >
                <span>Voir les horaires</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pour tous les âges</h3>
              <p className="text-gray-600 mb-6">
                Du baby judo (4 ans) aux adultes, nous proposons des cours adaptés 
                à chaque tranche d'âge et niveau.
              </p>
              <Link 
                to="/schedule" 
                className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center space-x-1"
              >
                <span>Voir les horaires</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Installations modernes</h3>
              <p className="text-gray-600 mb-6">
                Dojo de 400m² avec tatamis professionnels, vestiaires et parking gratuit 
                dans un cadre accueillant.
              </p>
              <Link 
                to="/registration" 
                className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center space-x-1"
              >
                <span>Nous trouver</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dernières actualités</h2>
              <p className="text-gray-600">Restez informés de la vie du club</p>
            </div>
            <Link 
              to="/news"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Toutes les actualités
            </Link>
          </div>

          {newsLoading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {newsError && (
            <ErrorMessage 
              message={newsError} 
              onRetry={refetchNews}
              className="mb-8"
            />
          )}

          {latestNews.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestNews.map((news: any) => (
                <article key={news.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {news.important && (
                    <div className="bg-red-500 text-white text-center py-2 text-sm font-medium">
                      ACTUALITÉ IMPORTANTE
                    </div>
                  )}

                  {isUpcoming(news.eventDate || news.createdAt) && (
                    <div className="bg-blue-500 text-white text-center py-2 text-sm font-medium flex items-center justify-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>À VENIR</span>
                    </div>
                  )}
                  
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(news.eventDate || news.createdAt)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{news.title}</h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    
                    <Link 
                      to="/news"
                      className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                    >
                      <span>Lire la suite</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Questions fréquentes</h2>
            <p className="text-xl text-gray-600">
              Trouvez rapidement les réponses aux questions les plus courantes 
              concernant notre club et la pratique du judo.
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                >
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </h3>
                  </div>
                  {openFAQ === faq.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                
                {openFAQ === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="pl-8 border-l-2 border-red-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                      <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Vous ne trouvez pas votre réponse ?
            </p>
            <Link
              to="/registration"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer votre aventure judo ?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Rejoignez notre communauté et découvrez les valeurs du judo dans un environnement bienveillant.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registration"
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              S'inscrire maintenant
            </Link>
            <Link
              to="/schedule"
              className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200"
            >
              Voir les horaires
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;