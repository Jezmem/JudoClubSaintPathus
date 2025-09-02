<?php

namespace App\Controller;

use App\Entity\Schedule;
use App\Repository\ScheduleRepository;
use App\Repository\InstructorRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/schedules')]
class ScheduleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ScheduleRepository $scheduleRepository,
        private InstructorRepository $instructorRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_schedule_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $dayOfWeek = $request->query->get('dayOfWeek');
        $level = $request->query->get('level');

        $criteria = [];
        if ($dayOfWeek) {
            $criteria['dayOfWeek'] = $dayOfWeek;
        }
        if ($level) {
            $criteria['level'] = $level;
        }

        $schedules = $this->scheduleRepository->findBy($criteria, ['dayOfWeek' => 'ASC', 'startTime' => 'ASC']);

        $schedulesData = array_map(function(Schedule $schedule) {
            return $this->serializeSchedule($schedule);
        }, $schedules);

        return new JsonResponse($schedulesData);
    }

    #[Route('/{id}', name: 'api_schedule_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $schedule = $this->scheduleRepository->find($id);

        if (!$schedule) {
            return new JsonResponse(['message' => 'Schedule not found'], 404);
        }

        return new JsonResponse($this->serializeSchedule($schedule));
    }

    #[Route('', name: 'api_schedule_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $schedule = new Schedule();
        $this->updateScheduleFromData($schedule, $data);

        $errors = $this->validator->validate($schedule);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($schedule);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeSchedule($schedule), 201);
    }

    #[Route('/{id}', name: 'api_schedule_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request): JsonResponse
    {
        $schedule = $this->scheduleRepository->find($id);

        if (!$schedule) {
            return new JsonResponse(['message' => 'Schedule not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateScheduleFromData($schedule, $data);

        $errors = $this->validator->validate($schedule);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeSchedule($schedule));
    }

    #[Route('/{id}', name: 'api_schedule_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $schedule = $this->scheduleRepository->find($id);

        if (!$schedule) {
            return new JsonResponse(['message' => 'Schedule not found'], 404);
        }

        $this->entityManager->remove($schedule);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateScheduleFromData(Schedule $schedule, array $data): void
    {
        if (isset($data['dayOfWeek'])) {
            $schedule->setDayOfWeek($data['dayOfWeek']);
        }
        if (isset($data['startTime'])) {
            $schedule->setStartTime(new \DateTime($data['startTime']));
        }
        if (isset($data['endTime'])) {
            $schedule->setEndTime(new \DateTime($data['endTime']));
        }
        if (isset($data['level'])) {
            $schedule->setLevel($data['level']);
        }
        if (isset($data['description'])) {
            $schedule->setDescription($data['description']);
        }
        if (isset($data['price'])) {
            $schedule->setPrice($data['price']);
        }
        if (isset($data['instructorId'])) {
            $instructor = $this->instructorRepository->find($data['instructorId']);
            $schedule->setInstructor($instructor);
        }
    }

    private function serializeSchedule(Schedule $schedule): array
    {
        return [
            'id' => $schedule->getId(),
            'dayOfWeek' => $schedule->getDayOfWeek(),
            'startTime' => $schedule->getStartTime()?->format('H:i'),
            'endTime' => $schedule->getEndTime()?->format('H:i'),
            'level' => $schedule->getLevel(),
            'description' => $schedule->getDescription(),
            'price' => $schedule->getPrice(),
            'instructor' => $schedule->getInstructor() ? [
                'id' => $schedule->getInstructor()->getId(),
                'name' => $schedule->getInstructor()->getName(),
                'beltRank' => $schedule->getInstructor()->getBeltRank()
            ] : null
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