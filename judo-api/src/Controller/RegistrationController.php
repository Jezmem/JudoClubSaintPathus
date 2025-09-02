<?php

namespace App\Controller;

use App\Entity\Registration;
use App\Repository\RegistrationRepository;
use App\Repository\ScheduleRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/registrations')]
class RegistrationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RegistrationRepository $registrationRepository,
        private ScheduleRepository $scheduleRepository,
        private UserRepository $userRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_registration_index', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function index(Request $request): JsonResponse
    {
        $user = $this->getUser();
        
        if ($this->isGranted('ROLE_ADMIN')) {
            // Admin can see all registrations
            $page = max(1, $request->query->getInt('page', 1));
            $limit = min(50, max(1, $request->query->getInt('limit', 20)));
            $status = $request->query->get('status');

            $queryBuilder = $this->registrationRepository->createQueryBuilder('r')
                ->leftJoin('r.user', 'u')
                ->leftJoin('r.schedule', 's')
                ->leftJoin('s.instructor', 'i');

            if ($status) {
                $queryBuilder->andWhere('r.status = :status')
                            ->setParameter('status', $status);
            }

            $queryBuilder->orderBy('r.createdAt', 'DESC');

            $totalItems = count($queryBuilder->getQuery()->getResult());
            $registrations = $queryBuilder->setFirstResult(($page - 1) * $limit)
                                        ->setMaxResults($limit)
                                        ->getQuery()
                                        ->getResult();

            $registrationsData = array_map(function(Registration $registration) {
                return $this->serializeRegistration($registration, true);
            }, $registrations);

            return new JsonResponse([
                'data' => $registrationsData,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $totalItems,
                    'pages' => ceil($totalItems / $limit)
                ]
            ]);
        } else {
            // Regular users can only see their own registrations
            $registrations = $this->registrationRepository->findBy(['user' => $user]);
            
            $registrationsData = array_map(function(Registration $registration) {
                return $this->serializeRegistration($registration, false);
            }, $registrations);

            return new JsonResponse($registrationsData);
        }
    }

    #[Route('/{id}', name: 'api_registration_show', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function show(int $id): JsonResponse
    {
        $registration = $this->registrationRepository->find($id);

        if (!$registration) {
            return new JsonResponse(['message' => 'Registration not found'], 404);
        }

        $user = $this->getUser();
        
        // Users can only see their own registrations, admins can see all
        if (!$this->isGranted('ROLE_ADMIN') && $registration->getUser() !== $user) {
            return new JsonResponse(['message' => 'Access denied'], 403);
        }

        return new JsonResponse($this->serializeRegistration($registration, $this->isGranted('ROLE_ADMIN')));
    }

    #[Route('', name: 'api_registration_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $registration = new Registration();
        $registration->setUser($user);
        
        $this->updateRegistrationFromData($registration, $data);

        $errors = $this->validator->validate($registration);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($registration);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeRegistration($registration, false), 201);
    }

    #[Route('/{id}', name: 'api_registration_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(int $id, Request $request): JsonResponse
    {
        $registration = $this->registrationRepository->find($id);

        if (!$registration) {
            return new JsonResponse(['message' => 'Registration not found'], 404);
        }

        $user = $this->getUser();
        
        // Users can only update their own registrations, admins can update all
        if (!$this->isGranted('ROLE_ADMIN') && $registration->getUser() !== $user) {
            return new JsonResponse(['message' => 'Access denied'], 403);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateRegistrationFromData($registration, $data);

        $errors = $this->validator->validate($registration);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeRegistration($registration, $this->isGranted('ROLE_ADMIN')));
    }

    #[Route('/{id}', name: 'api_registration_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $registration = $this->registrationRepository->find($id);

        if (!$registration) {
            return new JsonResponse(['message' => 'Registration not found'], 404);
        }

        $this->entityManager->remove($registration);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateRegistrationFromData(Registration $registration, array $data): void
    {
        if (isset($data['scheduleId'])) {
            $schedule = $this->scheduleRepository->find($data['scheduleId']);
            $registration->setSchedule($schedule);
        }
        if (isset($data['status']) && $this->isGranted('ROLE_ADMIN')) {
            $registration->setStatus($data['status']);
        }
        if (isset($data['medicalCertificateFile'])) {
            $registration->setMedicalCertificateFile($data['medicalCertificateFile']);
        }
        if (isset($data['notes']) && $this->isGranted('ROLE_ADMIN')) {
            $registration->setNotes($data['notes']);
        }
        if (isset($data['experience'])) {
            $registration->setExperience($data['experience']);
        }
        if (isset($data['newsletter'])) {
            $registration->setNewsletter($data['newsletter']);
        }
    }

    private function serializeRegistration(Registration $registration, bool $isAdmin): array
    {
        $data = [
            'id' => $registration->getId(),
            'status' => $registration->getStatus(),
            'experience' => $registration->getExperience(),
            'newsletter' => $registration->isNewsletter(),
            'createdAt' => $registration->getCreatedAt()?->format('Y-m-d H:i:s'),
            'schedule' => $registration->getSchedule() ? [
                'id' => $registration->getSchedule()->getId(),
                'dayOfWeek' => $registration->getSchedule()->getDayOfWeek(),
                'startTime' => $registration->getSchedule()->getStartTime()?->format('H:i'),
                'endTime' => $registration->getSchedule()->getEndTime()?->format('H:i'),
                'level' => $registration->getSchedule()->getLevel()
            ] : null
        ];

        if ($isAdmin) {
            $data['user'] = [
                'id' => $registration->getUser()->getId(),
                'firstName' => $registration->getUser()->getFirstName(),
                'lastName' => $registration->getUser()->getLastName(),
                'email' => $registration->getUser()->getEmail(),
                'phone' => $registration->getUser()->getPhone(),
                'dateOfBirth' => $registration->getUser()->getDateOfBirth()?->format('Y-m-d')
            ];
            $data['notes'] = $registration->getNotes();
            $data['medicalCertificateFile'] = $registration->getMedicalCertificateFile();
        }

        return $data;
    }

    private function getValidationErrorResponse($errors): JsonResponse
    {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = $error->getMessage();
        }
        return new JsonResponse(['errors' => $errorMessages], 400);
    }
}