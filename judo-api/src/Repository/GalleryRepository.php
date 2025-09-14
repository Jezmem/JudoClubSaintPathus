<?php

namespace App\Repository;

use App\Entity\Gallery;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Gallery>
 */
class GalleryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Gallery::class);
    }

    public function findAllWithPagination(int $page = 1, int $limit = 10, ?string $category = null, ?string $type = null): array
    {
        $qb = $this->createQueryBuilder('g')
            ->orderBy('g.createdAt', 'DESC');

        if ($category) {
            $qb->andWhere('g.category = :category')
               ->setParameter('category', $category);
        }

        if ($type) {
            $qb->andWhere('g.type = :type')
               ->setParameter('type', $type);
        }

        $totalQuery = clone $qb;
        $total = $totalQuery->select('COUNT(g.id)')->getQuery()->getSingleScalarResult();

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $photos = $qb->getQuery()->getResult();

        return [
            'data' => $photos,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findByCategory(string $category): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.category = :category')
            ->setParameter('category', $category)
            ->orderBy('g.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findActive(): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.active = :active')
            ->setParameter('active', true)
            ->orderBy('g.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findLatest(int $limit = 6): array
    {
        return $this->createQueryBuilder('g')
            ->andWhere('g.active = :active')
            ->setParameter('active', true)
            ->orderBy('g.createdAt', 'DESC')
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();
    }
}