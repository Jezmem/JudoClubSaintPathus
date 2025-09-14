<?php

namespace App\Repository;

use App\Entity\News;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\QueryBuilder;

/**
 * @extends ServiceEntityRepository<News>
 */
class NewsRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, News::class);
    }

    public function findAllWithPagination(int $page = 1, int $limit = 10, ?string $category = null, ?bool $upcoming = null): array
    {
        $qb = $this->createQueryBuilder('n')
            ->orderBy('n.createdAt', 'DESC');

        if ($category) {
            $qb->andWhere('n.category = :category')
               ->setParameter('category', $category);
        }

        if ($upcoming !== null) {
            if ($upcoming) {
                $qb->andWhere('n.eventDate > :now OR (n.eventDate IS NULL AND n.createdAt > :now)')
                   ->setParameter('now', new \DateTime());
            } else {
                $qb->andWhere('n.eventDate <= :now OR (n.eventDate IS NULL AND n.createdAt <= :now)')
                   ->setParameter('now', new \DateTime());
            }
        }

        $totalQuery = clone $qb;
        $total = $totalQuery->select('COUNT(n.id)')->getQuery()->getSingleScalarResult();

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $news = $qb->getQuery()->getResult();

        return [
            'data' => $news,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findLatest(int $limit = 3): array
    {
        return $this->createQueryBuilder('n')
            ->orderBy('n.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }

    public function findByCategory(string $category): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.category = :category')
            ->setParameter('category', $category)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findUpcoming(): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.eventDate > :now')
            ->setParameter('now', new \DateTime())
            ->orderBy('n.eventDate', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findImportant(): array
    {
        return $this->createQueryBuilder('n')
            ->andWhere('n.important = :important')
            ->setParameter('important', true)
            ->orderBy('n.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}