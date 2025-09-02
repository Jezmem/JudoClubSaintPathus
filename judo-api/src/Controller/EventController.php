<?php

namespace App\Controller;

use App\Entity\Event;
use App\Repository\EventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/events')]
class EventController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private EventRepository $eventRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_event_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $upcoming = $request->query->getBoolean('upcoming', false);
        $type = $request->query->get('type');

        $queryBuilder = $this->eventRepository->createQueryBuilder('e');

        if ($upcoming) {
            $queryBuilder->andWhere('e.date > :now')
                        ->setParameter('now', new \DateTime());
        }

        if ($type) {
            $queryBuilder->andWhere('e.type = :type')
                        ->setParameter('type', $type);
        }

        $queryBuilder->orderBy('e.date', 'ASC');

        $events = $queryBuilder->getQuery()->getResult();

        $eventsData = array_map(function(Event $event) {
            return $this->serializeEvent($event);
        }, $events);

        return new JsonResponse($eventsData);
    }

    #[Route('/{id}', name: 'api_event_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return new JsonResponse(['message' => 'Event not found'], 404);
        }

        return new JsonResponse($this->serializeEvent($event));
    }

    #[Route('', name: 'api_event_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $event = new Event();
        $this->updateEventFromData($event, $data);

        $errors = $this->validator->validate($event);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($event);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeEvent($event), 201);
    }

    #[Route('/{id}', name: 'api_event_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return new JsonResponse(['message' => 'Event not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateEventFromData($event, $data);

        $errors = $this->validator->validate($event);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeEvent($event));
    }

    #[Route('/{id}', name: 'api_event_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $event = $this->eventRepository->find($id);

        if (!$event) {
            return new JsonResponse(['message' => 'Event not found'], 404);
        }

        $this->entityManager->remove($event);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateEventFromData(Event $event, array $data): void
    {
        if (isset($data['title'])) {
            $event->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $event->setDescription($data['description']);
        }
        if (isset($data['date'])) {
            $event->setDate(new \DateTime($data['date']));
        }
        if (isset($data['location'])) {
            $event->setLocation($data['location']);
        }
        if (isset($data['imageUrl'])) {
            $event->setImageUrl($data['imageUrl']);
        }
        if (isset($data['type'])) {
            $event->setType($data['type']);
        }
    }

    private function serializeEvent(Event $event): array
    {
        return [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'description' => $event->getDescription(),
            'date' => $event->getDate()?->format('Y-m-d H:i:s'),
            'location' => $event->getLocation(),
            'imageUrl' => $event->getImageUrl(),
            'type' => $event->getType()
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