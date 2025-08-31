import React, { useState } from 'react';
import { Download, FileText, UserPlus, CheckCircle, AlertTriangle, MapPin, Phone, Mail, Clock, Car, Accessibility, Send } from 'lucide-react';
import { Registration, ContactMessage } from '../types';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<Registration>({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    parentName: '',
    parentEmail: '',
    experience: 'debutant',
    medicalCertificate: false,
    newsletter: true
  });

  const [contactData, setContactData] = useState<ContactMessage>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isRegistrationSubmitted, setIsRegistrationSubmitted] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'registration' | 'contact'>('registration');

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistrationSubmitted(true);
    console.log('Registration data:', formData);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsContactSubmitted(true);
    console.log('Contact form data:', contactData);
    
    setTimeout(() => {
      setIsContactSubmitted(false);
      setContactData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const isMinor = () => {
    if (!formData.birthDate) return false;
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 < 18;
    }
    return age < 18;
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adresse',
      details: ['Gymnase municipal', '12 Rue des Sports', '77178 Saint Pathus']
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: ['01 64 67 89 12', '06 12 34 56 78 (urgences)']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contact@judoclubsaintpathus.fr', 'secretaire@judoclubsaintpathus.fr']
    },
    {
      icon: Clock,
      title: 'Horaires secrétariat',
      details: ['Lun, Mer, Ven : 17h - 20h', 'Samedi : 9h - 12h', '(période scolaire uniquement)']
    }
  ];

  const practicalInfo = [
    {
      icon: Car,
      title: 'Parking',
      description: 'Parking gratuit disponible devant le gymnase (50 places)'
    },
    {
      icon: Accessibility,
      title: 'Accessibilité PMR',
      description: 'Gymnase entièrement accessible aux personnes à mobilité réduite'
    }
  ];

  if (isRegistrationSubmitted) {
    return (
      <div className="pt-16">
        <section className="py-20 bg-green-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Merci pour votre pré-inscription !
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Nous avons bien reçu votre demande d'inscription. Notre équipe va l'examiner 
              et vous contacter dans les 48h pour finaliser votre inscription.
            </p>
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Prochaines étapes :</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li>✓ Pré-inscription enregistrée</li>
                <li>📞 Contact téléphonique sous 48h</li>
                <li>📄 Envoi du dossier d'inscription complet</li>
                <li>🥋 Planification de votre cours d'essai</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Inscriptions & Contact</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez notre club et découvrez les valeurs du judo dans un environnement 
              bienveillant et professionnel.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setActiveTab('registration')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'registration'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Inscription
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'contact'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                Contact & Localisation
              </button>
            </div>
          </div>

          {activeTab === 'registration' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Process Steps */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Processus d'inscription</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Pré-inscription</h4>
                        <p className="text-sm text-gray-600">Remplissez le formulaire ci-contre</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Contact</h4>
                        <p className="text-sm text-gray-600">Nous vous contactons sous 48h</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Cours d'essai</h4>
                        <p className="text-sm text-gray-600">Séance gratuite pour découvrir</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Finalisation</h4>
                        <p className="text-sm text-gray-600">Dossier complet et paiement</p>
                      </div>
                    </div>
                  </div>

                  {/* Downloads */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Documents à télécharger</h4>
                    <div className="space-y-3">
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <Download className="h-4 w-4" />
                        <span className="text-sm">Dossier d'inscription (PDF)</span>
                      </a>
                      <a
                        href="#"
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors duration-200"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Certificat médical type</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <UserPlus className="h-6 w-6 text-red-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Formulaire de pré-inscription</h3>
                  </div>

                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleRegistrationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleRegistrationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Date de naissance *
                      </label>
                      <input
                        type="date"
                        id="birthDate"
                        name="birthDate"
                        required
                        value={formData.birthDate}
                        onChange={handleRegistrationChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleRegistrationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleRegistrationChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Parent Information (if minor) */}
                    {isMinor() && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-medium text-yellow-800">Informations du représentant légal</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">
                              Nom du parent/tuteur *
                            </label>
                            <input
                              type="text"
                              id="parentName"
                              name="parentName"
                              required={isMinor()}
                              value={formData.parentName}
                              onChange={handleRegistrationChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                              Email du parent/tuteur *
                            </label>
                            <input
                              type="email"
                              id="parentEmail"
                              name="parentEmail"
                              required={isMinor()}
                              value={formData.parentEmail}
                              onChange={handleRegistrationChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                        Expérience en judo
                      </label>
                      <select
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleRegistrationChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="debutant">Débutant complet</option>
                        <option value="initie">Quelques notions</option>
                        <option value="intermediate">Niveau intermédiaire</option>
                        <option value="avance">Niveau avancé</option>
                      </select>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="medicalCertificate"
                          name="medicalCertificate"
                          checked={formData.medicalCertificate}
                          onChange={handleRegistrationChange}
                          className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="medicalCertificate" className="text-sm text-gray-700">
                          Je m'engage à fournir un certificat médical de non contre-indication 
                          à la pratique du judo avant le premier cours.
                        </label>
                      </div>
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          id="newsletter"
                          name="newsletter"
                          checked={formData.newsletter}
                          onChange={handleRegistrationChange}
                          className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="newsletter" className="text-sm text-gray-700">
                          Je souhaite recevoir les actualités du club par email.
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
                    >
                      Envoyer ma pré-inscription
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      En soumettant ce formulaire, vous acceptez que vos données soient utilisées 
                      pour traiter votre demande d'inscription conformément à notre politique de confidentialité.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8">Nos coordonnées</h3>
                
                <div className="space-y-6 mb-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <info.icon className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{info.title}</h4>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map Placeholder */}
                <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-8">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>Carte Google Maps</p>
                    <p className="text-sm">(Intégration prévue)</p>
                  </div>
                </div>

                {/* Practical Information */}
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h4 className="font-semibold text-gray-900 mb-4">Informations pratiques</h4>
                  <div className="space-y-4">
                    {practicalInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <info.icon className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-900">{info.title}</h5>
                          <p className="text-gray-600 text-sm">{info.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Send className="h-6 w-6 text-red-600" />
                  <h3 className="text-2xl font-bold text-gray-900">Envoyez-nous un message</h3>
                </div>

                {isContactSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Message envoyé !</h4>
                    <p className="text-gray-600">
                      Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          id="contactName"
                          name="name"
                          required
                          value={contactData.name}
                          onChange={handleContactChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="contactEmail"
                          name="email"
                          required
                          value={contactData.email}
                          onChange={handleContactChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        name="phone"
                        value={contactData.phone}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactSubject" className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet *
                      </label>
                      <select
                        id="contactSubject"
                        name="subject"
                        required
                        value={contactData.subject}
                        onChange={handleContactChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="">Choisissez un sujet</option>
                        <option value="inscription">Inscription / Cours d'essai</option>
                        <option value="horaires">Horaires et tarifs</option>
                        <option value="competition">Compétition</option>
                        <option value="stage">Stages</option>
                        <option value="materiel">Matériel / Équipement</option>
                        <option value="autre">Autre question</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contactMessage" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="contactMessage"
                        name="message"
                        required
                        rows={5}
                        value={contactData.message}
                        onChange={handleContactChange}
                        placeholder="Décrivez votre demande ou votre question..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Send className="h-5 w-5" />
                      <span>Envoyer le message</span>
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      Nous nous engageons à répondre à votre message dans les 24h (jours ouvrés).
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default RegistrationPage;