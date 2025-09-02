<?php

namespace App\Controller;

use App\Entity\News;
use App\Repository\NewsRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/news')]
class NewsController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private NewsRepository $newsRepository,
        private ValidatorInterface $validator
    ) {}

    #[Route('', name: 'api_news_index', methods: ['GET'])]
    public function index(Request $request): JsonResponse
    {
        $page = max(1, $request->query->getInt('page', 1));
        $limit = min(50, max(1, $request->query->getInt('limit', 10)));
        $category = $request->query->get('category');
        $upcoming = $request->query->getBoolean('upcoming', false);

        $criteria = [];
        if ($category) {
            $criteria['category'] = $category;
        }

        $queryBuilder = $this->newsRepository->createQueryBuilder('n');
        
        if ($category) {
            $queryBuilder->andWhere('n.category = :category')
                        ->setParameter('category', $category);
        }

        if ($upcoming) {
            $queryBuilder->andWhere('n.eventDate > :now')
                        ->setParameter('now', new \DateTime());
        }

        $queryBuilder->orderBy('n.createdAt', 'DESC');

        $totalItems = count($queryBuilder->getQuery()->getResult());
        $news = $queryBuilder->setFirstResult(($page - 1) * $limit)
                            ->setMaxResults($limit)
                            ->getQuery()
                            ->getResult();

        $newsData = array_map(function(News $newsItem) {
            return $this->serializeNews($newsItem);
        }, $news);

        return new JsonResponse([
            'data' => $newsData,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalItems,
                'pages' => ceil($totalItems / $limit)
            ]
        ]);
    }

    #[Route('/{id}', name: 'api_news_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $news = $this->newsRepository->find($id);

        if (!$news) {
            return new JsonResponse(['message' => 'News not found'], 404);
        }

        return new JsonResponse($this->serializeNews($news));
    }

    #[Route('', name: 'api_news_create', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $news = new News();
        $this->updateNewsFromData($news, $data);

        $errors = $this->validator->validate($news);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->persist($news);
        $this->entityManager->flush();

        return new JsonResponse($this->serializeNews($news), 201);
    }

    #[Route('/{id}', name: 'api_news_update', methods: ['PUT'])]
    #[IsGranted('ROLE_ADMIN')]
    public function update(int $id, Request $request): JsonResponse
    {
        $news = $this->newsRepository->find($id);

        if (!$news) {
            return new JsonResponse(['message' => 'News not found'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $this->updateNewsFromData($news, $data);

        $errors = $this->validator->validate($news);
        if (count($errors) > 0) {
            return $this->getValidationErrorResponse($errors);
        }

        $this->entityManager->flush();

        return new JsonResponse($this->serializeNews($news));
    }

    #[Route('/{id}', name: 'api_news_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function delete(int $id): JsonResponse
    {
        $news = $this->newsRepository->find($id);

        if (!$news) {
            return new JsonResponse(['message' => 'News not found'], 404);
        }

        $this->entityManager->remove($news);
        $this->entityManager->flush();

        return new JsonResponse(null, 204);
    }

    private function updateNewsFromData(News $news, array $data): void
    {
        if (isset($data['title'])) {
            $news->setTitle($data['title']);
        }
        if (isset($data['content'])) {
            $news->setContent($data['content']);
        }
        if (isset($data['excerpt'])) {
            $news->setExcerpt($data['excerpt']);
        }
        if (isset($data['imageUrl'])) {
            $news->setImageUrl($data['imageUrl']);
        }
        if (isset($data['category'])) {
            $news->setCategory($data['category']);
        }
        if (isset($data['important'])) {
            $news->setImportant($data['important']);
        }
        if (isset($data['author'])) {
            $news->setAuthor($data['author']);
        }
        if (isset($data['tags'])) {
            $news->setTags($data['tags']);
        }
        if (isset($data['eventDate'])) {
            $news->setEventDate(new \DateTime($data['eventDate']));
        }
    }

    private function serializeNews(News $news): array
    {
        return [
            'id' => $news->getId(),
            'title' => $news->getTitle(),
            'content' => $news->getContent(),
            'excerpt' => $news->getExcerpt(),
            'createdAt' => $news->getCreatedAt()?->format('Y-m-d H:i:s'),
            'imageUrl' => $news->getImageUrl(),
            'category' => $news->getCategory(),
            'important' => $news->isImportant(),
            'author' => $news->getAuthor(),
            'tags' => $news->getTags(),
            'eventDate' => $news->getEventDate()?->format('Y-m-d H:i:s')
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