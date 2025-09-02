<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Instructor;
use App\Entity\Schedule;
use App\Entity\News;
use App\Entity\Event;
use App\Entity\GalleryItem;
use App\Entity\Registration;
use App\Entity\ContactMessage;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // Create admin user
        $admin = new User();
        $admin->setEmail('admin@judoclubsaintpathus.fr');
        $admin->setFirstName('Admin');
        $admin->setLastName('Club');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $manager->persist($admin);

        // Create regular user
        $user = new User();
        $user->setEmail('user@example.com');
        $user->setFirstName('Jean');
        $user->setLastName('Dupont');
        $user->setPhone('06 12 34 56 78');
        $user->setAddress('123 Rue de la Paix, 77178 Saint Pathus');
        $user->setDateOfBirth(new \DateTime('1985-05-15'));
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'user123'));
        $manager->persist($user);

        // Create instructors
        $instructor1 = new Instructor();
        $instructor1->setName('Pierre Durand');
        $instructor1->setBio('Pratiquant depuis plus de 30 ans, Pierre est diplômé d\'État et enseigne le judo avec passion depuis 15 ans.');
        $instructor1->setBeltRank('6e Dan');
        $instructor1->setPhotoUrl('https://images.pexels.com/photos/8611192/pexels-photo-8611192.jpeg');
        $manager->persist($instructor1);

        $instructor2 = new Instructor();
        $instructor2->setName('Sophie Martin');
        $instructor2->setBio('Spécialisée dans l\'enseignement aux enfants, Sophie développe la motricité et les valeurs du judo.');
        $instructor2->setBeltRank('4e Dan');
        $instructor2->setPhotoUrl('https://images.pexels.com/photos/8611230/pexels-photo-8611230.jpeg');
        $manager->persist($instructor2);

        // Create schedules
        $schedule1 = new Schedule();
        $schedule1->setDayOfWeek('monday');
        $schedule1->setStartTime(new \DateTime('17:30'));
        $schedule1->setEndTime(new \DateTime('18:30'));
        $schedule1->setLevel('kids');
        $schedule1->setDescription('Baby Judo (4-6 ans) - Éveil corporel et initiation aux valeurs du judo');
        $schedule1->setPrice('25.00');
        $schedule1->setInstructor($instructor2);
        $manager->persist($schedule1);

        $schedule2 = new Schedule();
        $schedule2->setDayOfWeek('friday');
        $schedule2->setStartTime(new \DateTime('19:00'));
        $schedule2->setEndTime(new \DateTime('20:30'));
        $schedule2->setLevel('adults');
        $schedule2->setDescription('Adultes débutants - Apprentissage des bases du judo');
        $schedule2->setPrice('45.00');
        $schedule2->setInstructor($instructor1);
        $manager->persist($schedule2);

        // Create news
        $news1 = new News();
        $news1->setTitle('Reprise des cours - Septembre 2024');
        $news1->setExcerpt('Les cours reprennent le lundi 2 septembre pour tous les niveaux. Inscriptions ouvertes !');
        $news1->setContent('Nous sommes ravis d\'annoncer la reprise des cours pour la saison 2024-2025. Les inscriptions sont ouvertes et nous accueillons de nouveaux membres dans toutes les catégories d\'âge.');
        $news1->setCategory('Actualités');
        $news1->setImportant(true);
        $news1->setAuthor('Direction du club');
        $news1->setImageUrl('https://images.pexels.com/photos/7045754/pexels-photo-7045754.jpeg');
        $news1->setTags(['rentrée', 'inscriptions', 'cours']);
        $manager->persist($news1);

        $news2 = new News();
        $news2->setTitle('Stage avec Maître Tanaka');
        $news2->setExcerpt('Stage exceptionnel avec le maître japonais Hiroshi Tanaka les 15 et 16 octobre.');
        $news2->setContent('Le club organise un stage exceptionnel avec Maître Hiroshi Tanaka, 8e dan, direct du Japon. Ce stage s\'adresse à tous les niveaux à partir de ceinture verte.');
        $news2->setCategory('Stages');
        $news2->setImportant(true);
        $news2->setAuthor('Sensei Martin');
        $news2->setImageUrl('https://images.pexels.com/photos/7045766/pexels-photo-7045766.jpeg');
        $news2->setTags(['stage', 'maître', 'technique']);
        $news2->setEventDate(new \DateTime('2024-10-15'));
        $manager->persist($news2);

        // Create events
        $event1 = new Event();
        $event1->setTitle('Championnat régional');
        $event1->setDescription('Championnat régional toutes catégories');
        $event1->setDate(new \DateTime('2024-11-03 08:00:00'));
        $event1->setLocation('Gymnase Pierre de Coubertin, Meaux');
        $event1->setType('competition');
        $event1->setImageUrl('https://images.pexels.com/photos/7045758/pexels-photo-7045758.jpeg');
        $manager->persist($event1);

        // Create gallery items
        $gallery1 = new GalleryItem();
        $gallery1->setTitle('Entraînement enfants');
        $gallery1->setType('photo');
        $gallery1->setUrl('https://images.pexels.com/photos/7045754/pexels-photo-7045754.jpeg');
        $gallery1->setDescription('Cours des mini-poussins avec Sensei Sophie');
        $gallery1->setCategory('Entraînements');
        $gallery1->setAlt('Enfants pratiquant le judo');
        $manager->persist($gallery1);

        $gallery2 = new GalleryItem();
        $gallery2->setTitle('Dojo principal');
        $gallery2->setType('photo');
        $gallery2->setUrl('https://images.pexels.com/photos/8611192/pexels-photo-8611192.jpeg');
        $gallery2->setDescription('Notre magnifique dojo de 400m²');
        $gallery2->setCategory('Installations');
        $gallery2->setAlt('Dojo de judo');
        $manager->persist($gallery2);

        // Create registration
        $registration = new Registration();
        $registration->setUser($user);
        $registration->setSchedule($schedule2);
        $registration->setStatus('pending');
        $registration->setExperience('debutant');
        $registration->setNewsletter(true);
        $manager->persist($registration);

        // Create contact message
        $contactMessage = new ContactMessage();
        $contactMessage->setName('Marie Dubois');
        $contactMessage->setEmail('marie.dubois@email.com');
        $contactMessage->setPhone('06 12 34 56 78');
        $contactMessage->setSubject('inscription');
        $contactMessage->setMessage('Bonjour, je souhaiterais inscrire mon fils de 8 ans au judo. Pourriez-vous me donner plus d\'informations sur les horaires et les tarifs ? Merci.');
        $manager->persist($contactMessage);

        $manager->flush();
    }
}