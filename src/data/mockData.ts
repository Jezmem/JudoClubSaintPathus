import { News, Schedule, Instructor, Photo, Event, FAQ } from '../types';

export const newsData: News[] = [
  {
    id: 1,
    title: "Reprise des cours - Septembre 2024",
    excerpt: "Les cours reprennent le lundi 2 septembre pour tous les niveaux. Inscriptions ouvertes !",
    content: "Nous sommes ravis d'annoncer la reprise des cours pour la saison 2024-2025. Les inscriptions sont ouvertes et nous accueillons de nouveaux membres dans toutes les catégories d'âge. N'hésitez pas à venir nous rencontrer pour un cours d'essai gratuit.",
    date: "2024-08-25",
    image: "https://images.pexels.com/photos/7045754/pexels-photo-7045754.jpeg",
    category: "Actualités",
    important: true,
    author: "Direction du club",
    tags: ["rentrée", "inscriptions", "cours"]
  },
  {
    id: 2,
    title: "Stage avec Maître Tanaka",
    excerpt: "Stage exceptionnel avec le maître japonais Hiroshi Tanaka les 15 et 16 octobre.",
    content: "Le club organise un stage exceptionnel avec Maître Hiroshi Tanaka, 8e dan, direct du Japon. Ce stage s'adresse à tous les niveaux à partir de ceinture verte. Inscriptions limitées à 40 participants.",
    date: "2024-09-10",
    image: "https://images.pexels.com/photos/7045766/pexels-photo-7045766.jpeg",
    category: "Stages",
    important: true,
    author: "Sensei Martin",
    tags: ["stage", "maître", "technique"]
  },
  {
    id: 3,
    title: "Résultats du championnat départemental",
    excerpt: "Nos judokas brillent au championnat départemental avec 8 médailles remportées.",
    content: "Félicitations à tous nos compétiteurs pour leurs excellents résultats au championnat départemental. Marie Dupont remporte l'or en -57kg, Pierre Martin l'argent en -73kg, et bien d'autres médailles pour notre club.",
    date: "2024-09-05",
    image: "https://images.pexels.com/photos/7045758/pexels-photo-7045758.jpeg",
    category: "Compétitions",
    important: false,
    author: "Coach Pierre",
    tags: ["compétition", "médailles", "résultats"]
  }
];

export const scheduleData: Schedule[] = [
  {
    id: 1,
    day: "Lundi",
    timeSlot: "17h30 - 18h30",
    level: "Baby Judo (4-6 ans)",
    instructor: "Sophie Martin",
    price: 25,
    description: "Éveil corporel et initiation aux valeurs du judo",
    active: true
  },
  {
    id: 2,
    day: "Lundi",
    timeSlot: "18h30 - 19h30",
    level: "Mini Poussins (7-9 ans)",
    instructor: "Pierre Durand",
    price: 30,
    description: "Apprentissage des techniques de base",
    active: true
  },
  {
    id: 3,
    day: "Mercredi",
    timeSlot: "14h00 - 15h00",
    level: "Poussins (10-12 ans)",
    instructor: "Marie Leblanc",
    price: 35,
    description: "Perfectionnement technique et compétition",
    active: true
  },
  {
    id: 4,
    day: "Mercredi",
    timeSlot: "15h00 - 16h30",
    level: "Benjamins (13-15 ans)",
    instructor: "Jean Moreau",
    price: 40,
    description: "Judo sportif et préparation compétition",
    active: true
  },
  {
    id: 5,
    day: "Vendredi",
    timeSlot: "19h00 - 20h30",
    level: "Adultes débutants",
    instructor: "Pierre Durand",
    price: 45,
    description: "Apprentissage des bases du judo",
    active: true
  },
  {
    id: 6,
    day: "Vendredi",
    timeSlot: "20h30 - 22h00",
    level: "Adultes confirmés",
    instructor: "Jean Moreau",
    price: 45,
    description: "Perfectionnement et combat",
    active: true
  }
];

export const instructorsData: Instructor[] = [
  {
    id: 1,
    firstName: "Pierre",
    lastName: "Durand",
    role: "Professeur principal",
    grade: "6e Dan",
    bio: "Pratiquant depuis plus de 30 ans, Pierre est diplômé d'État et enseigne le judo avec passion depuis 15 ans.",
    photo: "https://images.pexels.com/photos/8611192/pexels-photo-8611192.jpeg",
    experience: 15,
    specialty: "Judo traditionnel",
    active: true
  },
  {
    id: 2,
    firstName: "Sophie",
    lastName: "Martin",
    role: "Professeur jeunes",
    grade: "4e Dan",
    bio: "Spécialisée dans l'enseignement aux enfants, Sophie développe la motricité et les valeurs du judo.",
    photo: "https://images.pexels.com/photos/8611230/pexels-photo-8611230.jpeg",
    experience: 10,
    specialty: "Éveil judo",
    active: true
  },
  {
    id: 3,
    firstName: "Jean",
    lastName: "Moreau",
    role: "Entraîneur compétition",
    grade: "5e Dan",
    bio: "Ancien compétiteur international, Jean prépare nos judokas aux compétitions de haut niveau.",
    photo: "https://images.pexels.com/photos/8611169/pexels-photo-8611169.jpeg",
    experience: 12,
    specialty: "Compétition",
    active: true
  }
];

export const galleryData: Photo[] = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/7045754/pexels-photo-7045754.jpeg",
    title: "Entraînement enfants",
    description: "Cours des mini-poussins avec Sensei Sophie",
    category: "Entraînements",
    alt: "Enfants pratiquant le judo",
    active: true
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/7045766/pexels-photo-7045766.jpeg",
    title: "Stage technique",
    description: "Stage de perfectionnement avec Maître Tanaka",
    category: "Stages",
    alt: "Stage de judo technique",
    active: true
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/7045758/pexels-photo-7045758.jpeg",
    title: "Compétition départementale",
    description: "Nos champions au tournoi départemental",
    category: "Compétitions",
    alt: "Compétition de judo",
    active: true
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/8611192/pexels-photo-8611192.jpeg",
    title: "Dojo principal",
    description: "Notre magnifique dojo de 400m²",
    category: "Installations",
    alt: "Dojo de judo",
    active: true
  },
  {
    id: 5,
    url: "https://images.pexels.com/photos/8611230/pexels-photo-8611230.jpeg",
    title: "Cérémonie de passage de grade",
    description: "Remise des ceintures de fin d'année",
    category: "Événements",
    alt: "Cérémonie de passage de grade",
    active: true
  },
  {
    id: 6,
    url: "https://images.pexels.com/photos/8611169/pexels-photo-8611169.jpeg",
    title: "Démonstration publique",
    description: "Démonstration lors de la fête de la ville",
    category: "Événements",
    alt: "Démonstration de judo",
    active: true
  }
];

export const eventsData: Event[] = [
  {
    id: 1,
    title: "Stage Maître Tanaka",
    date: "2024-10-15",
    time: "09:00",
    type: "stage",
    description: "Stage exceptionnel avec le maître japonais Hiroshi Tanaka",
    location: "Dojo du club"
  },
  {
    id: 2,
    title: "Championnat régional",
    date: "2024-11-03",
    time: "08:00",
    type: "competition",
    description: "Championnat régional toutes catégories",
    location: "Gymnase Pierre de Coubertin, Meaux"
  },
  {
    id: 3,
    title: "Assemblée générale",
    date: "2024-11-20",
    time: "19:00",
    type: "meeting",
    description: "Assemblée générale annuelle du club",
    location: "Salle des fêtes de Saint Pathus"
  },
  {
    id: 4,
    title: "Démonstration Téléthon",
    date: "2024-12-07",
    time: "14:00",
    type: "demonstration",
    description: "Démonstration de judo pour le Téléthon",
    location: "Place de la mairie"
  }
];

export const faqData: FAQ[] = [
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