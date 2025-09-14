<?php

namespace App\Repository;

use App\Entity\Event;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Event>
 */
class EventRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Event::class);
    }

    public function findAllWithFilters(?bool $upcoming = null, ?string $type = null): array
    {
        $qb = $this->createQueryBuilder('e')
            ->orderBy('e.date', 'ASC');

        if ($upcoming !== null) {
            if ($upcoming) {
                $qb->andWhere('e.date >= :now')
                   ->setParameter('now', new \DateTime());
            } else {
                $qb->andWhere('e.date < :now')
                   ->setParameter('now', new \DateTime());
            }
        }

        if ($type) {
            $qb->andWhere('e.type = :type')
               ->setParameter('type', $type);
        }

        return $qb->getQuery()->getResult();
    }

    public function findUpcoming(int $limit = null): array
    {
        $qb = $this->createQueryBuilder('e')
            ->andWhere('e.date >= :now')
            ->setParameter('now', new \DateTime())
            ->orderBy('e.date', 'ASC');

        if ($limit) {
            $qb->setMaxResults($limit);
        }

        return $qb->getQuery()->getResult();
    }

    public function findByType(string $type): array
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.type = :type')
            ->setParameter('type', $type)
            ->orderBy('e.date', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByDateRange(\DateTime $startDate, \DateTime $endDate): array
    {
        return $this->createQueryBuilder('e')
            ->andWhere('e.date BETWEEN :startDate AND :endDate')
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->orderBy('e.date', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findThisMonth(): array
    {
        $startOfMonth = new \DateTime('first day of this month');
        $endOfMonth = new \DateTime('last day of this month');

        return $this->findByDateRange($startOfMonth, $endOfMonth);
    }

    public function findCompetitions(): array
    {
        return $this->findByType('competition');
    }

    public function findStages(): array
    {
        return $this->findByType('stage');
    }
}