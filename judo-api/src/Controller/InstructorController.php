<?php

namespace App\Controller;

use App\Entity\Instructor;
use App\Repository\InstructorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/instructors')]
class InstructorController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private InstructorRepository $instructorRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_instructor_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $instructors = $this->instructorRepository->findAll();

        $instructorsData = array_map(function(Instructor $instructor) {
            return $this->serializeInstructor($instructor);
        }, $instructors);

        return new JsonResponse($instructorsData);
    }

    #[Route('/{id}', name: 'api_instructor_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $instructor = $this->instructorRepository->find($id);

        if (!$instructor) {
            return new JsonResponse(['message' => 'Instructor not found'], 404);
        }

        return new JsonResponse($this->serializeInstructor($instructor));
    }

    #[Route('', name: 'api_instructor_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $instructor = new Instructor();
        $this->updateInstructorFromData($instructor, $data);

        $errors = $this->validator->validate($instructor);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($instructor);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeInstructor($instructor), 201);
    }

    #[Route('/{id}', name: 'api_instructor_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request): JsonResponse
    {
        $instructor = $this->instructorRepository->find($id);

        if (!$instructor) {
            return new JsonResponse(['message' => 'Instructor not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateInstructorFromData($instructor, $data);

        $errors = $this->validator->validate($instructor);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeInstructor($instructor));
    }

    #[Route('/{id}', name: 'api_instructor_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $instructor = $this->instructorRepository->find($id);

        if (!$instructor) {
            return new JsonResponse(['message' => 'Instructor not found'], 404);
        }

        $this->entityManager->remove($instructor);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateInstructorFromData(Instructor $instructor, array $data): void
    {
        if (isset($data['name'])) {
            $instructor->setName($data['name']);
        }
        if (isset($data['bio'])) {
            $instructor->setBio($data['bio']);
        }
        if (isset($data['beltRank'])) {
            $instructor->setBeltRank($data['beltRank']);
        }
        if (isset($data['photoUrl'])) {
            $instructor->setPhotoUrl($data['photoUrl']);
        }
    }

    private function serializeInstructor(Instructor $instructor): array
    {
        return [
            'id' => $instructor->getId(),
            'name' => $instructor->getName(),
            'bio' => $instructor->getBio(),
            'beltRank' => $instructor->getBeltRank(),
            'photoUrl' => $instructor->getPhotoUrl()
        ];
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