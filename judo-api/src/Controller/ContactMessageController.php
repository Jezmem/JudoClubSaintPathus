<?php

namespace App\Controller;

use App\Entity\ContactMessage;
use App\Repository\ContactMessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/contact-messages')]
class ContactMessageController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ContactMessageRepository $contactMessageRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_contact_message_index', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function index(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 20)));
        $status = $request->query->get('status');

        $queryBuilder = $this->contactMessageRepository->createQueryBuilder('cm');

        if ($status) {
            $queryBuilder->andWhere('cm.status = :status')
                        ->setParameter('status', $status);
        }

        $queryBuilder->orderBy('cm.createdAt', 'DESC');

        $totalItems = count($queryBuilder->getQuery()->getResult());
        $messages = $queryBuilder->setFirstResult(($page - 1) * $limit)
                                ->setMaxResults($limit)
                                ->getQuery()
                                ->getResult();

        $messagesData = array_map(function(ContactMessage $message) {
            return $this->serializeContactMessage($message);
        }, $messages);

        return new JsonResponse([
            'data' => $messagesData,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalItems,
                'pages' => ceil($totalItems / $limit)
            ]
        ]);
    }

    #[Route('/{id}', name: 'api_contact_message_show', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function show(int $id): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);

        if (!$message) {
            return new JsonResponse(['message' => 'Contact message not found'], 404);
        }

        // Mark as read when viewed
        if ($message->getStatus() === 'unread') {
            $message->setStatus('read');
            $this->entityManager->flush();
        }

        return new JsonResponse($this->serializeContactMessage($message));
    }

    #[Route('', name: 'api_contact_message_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $message = new ContactMessage();
        $this->updateContactMessageFromData($message, $data);

        $errors = $this->validator->validate($message);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeContactMessage($message), 201);
    }

    #[Route('/{id}/status', name: 'api_contact_message_update_status', methods: ['PATCH'])]
    #[IsGranted('ROLE_ADMIN')]
    public function updateStatus(int $id, Request $request): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);

        if (!$message) {
            return new JsonResponse(['message' => 'Contact message not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        
        if (isset($data['status'])) {
            $message->setStatus($data['status']);
        }

        $errors = $this->validator->validate($message);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeContactMessage($message));
    }

    #[Route('/{id}', name: 'api_contact_message_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $message = $this->contactMessageRepository->find($id);

        if (!$message) {
            return new JsonResponse(['message' => 'Contact message not found'], 404);
        }

        $this->entityManager->remove($message);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateContactMessageFromData(ContactMessage $message, array $data): void
    {
        if (isset($data['name'])) {
            $message->setName($data['name']);
        }
        if (isset($data['email'])) {
            $message->setEmail($data['email']);
        }
        if (isset($data['phone'])) {
            $message->setPhone($data['phone']);
        }
        if (isset($data['subject'])) {
            $message->setSubject($data['subject']);
        }
        if (isset($data['message'])) {
            $message->setMessage($data['message']);
        }
    }

    private function serializeContactMessage(ContactMessage $message): array
    {
        return [
            'id' => $message->getId(),
            'name' => $message->getName(),
            'email' => $message->getEmail(),
            'phone' => $message->getPhone(),
            'subject' => $message->getSubject(),
            'message' => $message->getMessage(),
            'status' => $message->getStatus(),
            'createdAt' => $message->getCreatedAt()?->format('Y-m-d H:i:s')
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