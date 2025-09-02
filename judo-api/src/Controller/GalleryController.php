<?php

namespace App\Controller;

use App\Entity\GalleryItem;
use App\Repository\GalleryItemRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/gallery')]
class GalleryController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private GalleryItemRepository $galleryRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_gallery_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 20)));
        $category = $request->query->get('category');
        $type = $request->query->get('type');

        $queryBuilder = $this->galleryRepository->createQueryBuilder('g');
        
        // Only show active items for public access
        if (!$this->isGranted('ROLE_ADMIN')) {
            $queryBuilder->andWhere('g.active = true');
        }

        if ($category) {
            $queryBuilder->andWhere('g.category = :category')
                        ->setParameter('category', $category);
        }

        if ($type) {
            $queryBuilder->andWhere('g.type = :type')
                        ->setParameter('type', $type);
        }

        $queryBuilder->orderBy('g.createdAt', 'DESC');

        $totalItems = count($queryBuilder->getQuery()->getResult());
        $items = $queryBuilder->setFirstResult(($page - 1) * $limit)
                             ->setMaxResults($limit)
                             ->getQuery()
                             ->getResult();

        $itemsData = array_map(function(GalleryItem $item) {
            return $this->serializeGalleryItem($item);
        }, $items);

        return new JsonResponse([
            'data' => $itemsData,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalItems,
                'pages' => ceil($totalItems / $limit)
            ]
        ]);
    }

    #[Route('/{id}', name: 'api_gallery_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $item = $this->galleryRepository->find($id);

        if (!$item) {
            return new JsonResponse(['message' => 'Gallery item not found'], 404);
        }

        // Check if item is active for non-admin users
        if (!$this->isGranted('ROLE_ADMIN') && !$item->isActive()) {
            return new JsonResponse(['message' => 'Gallery item not found'], 404);
        }

        return new JsonResponse($this->serializeGalleryItem($item));
    }

    #[Route('', name: 'api_gallery_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $item = new GalleryItem();
        $this->updateGalleryItemFromData($item, $data);

        $errors = $this->validator->validate($item);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($item);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeGalleryItem($item), 201);
    }

    #[Route('/{id}', name: 'api_gallery_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request): JsonResponse
    {
        $item = $this->galleryRepository->find($id);

        if (!$item) {
            return new JsonResponse(['message' => 'Gallery item not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateGalleryItemFromData($item, $data);

        $errors = $this->validator->validate($item);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeGalleryItem($item));
    }

    #[Route('/{id}', name: 'api_gallery_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $item = $this->galleryRepository->find($id);

        if (!$item) {
            return new JsonResponse(['message' => 'Gallery item not found'], 404);
        }

        $this->entityManager->remove($item);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateGalleryItemFromData(GalleryItem $item, array $data): void
    {
        if (isset($data['title'])) {
            $item->setTitle($data['title']);
        }
        if (isset($data['type'])) {
            $item->setType($data['type']);
        }
        if (isset($data['url'])) {
            $item->setUrl($data['url']);
        }
        if (isset($data['description'])) {
            $item->setDescription($data['description']);
        }
        if (isset($data['category'])) {
            $item->setCategory($data['category']);
        }
        if (isset($data['alt'])) {
            $item->setAlt($data['alt']);
        }
        if (isset($data['active'])) {
            $item->setActive($data['active']);
        }
    }

    private function serializeGalleryItem(GalleryItem $item): array
    {
        return [
            'id' => $item->getId(),
            'title' => $item->getTitle(),
            'type' => $item->getType(),
            'url' => $item->getUrl(),
            'description' => $item->getDescription(),
            'category' => $item->getCategory(),
            'alt' => $item->getAlt(),
            'active' => $item->isActive(),
            'createdAt' => $item->getCreatedAt()?->format('Y-m-d H:i:s')
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