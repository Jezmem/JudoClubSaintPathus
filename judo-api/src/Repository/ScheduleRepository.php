<?php

namespace App\Repository;

use App\Entity\Schedule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Schedule>
 */
class ScheduleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Schedule::class);
    }

    public function findAllWithFilters(?string $dayOfWeek = null, ?string $level = null): array
    {
        $qb = $this->createQueryBuilder('s')
            ->leftJoin('s.instructor', 'i')
            ->addSelect('i')
            ->andWhere('s.active = :active')
            ->setParameter('active', true)
            ->orderBy('s.dayOfWeek', 'ASC')
            ->addOrderBy('s.startTime', 'ASC');

        if ($dayOfWeek) {
            $qb->andWhere('s.dayOfWeek = :dayOfWeek')
               ->setParameter('dayOfWeek', $dayOfWeek);
        }

        if ($level) {
            $qb->andWhere('s.level = :level')
               ->setParameter('level', $level);
        }

        return $qb->getQuery()->getResult();
    }

    public function findByDay(string $dayOfWeek): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.instructor', 'i')
            ->addSelect('i')
            ->andWhere('s.dayOfWeek = :dayOfWeek')
            ->andWhere('s.active = :active')
            ->setParameter('dayOfWeek', $dayOfWeek)
            ->setParameter('active', true)
            ->orderBy('s.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByLevel(string $level): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.instructor', 'i')
            ->addSelect('i')
            ->andWhere('s.level = :level')
            ->andWhere('s.active = :active')
            ->setParameter('level', $level)
            ->setParameter('active', true)
            ->orderBy('s.dayOfWeek', 'ASC')
            ->addOrderBy('s.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findActive(): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.instructor', 'i')
            ->addSelect('i')
            ->andWhere('s.active = :active')
            ->setParameter('active', true)
            ->orderBy('s.dayOfWeek', 'ASC')
            ->addOrderBy('s.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByInstructor(int $instructorId): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.instructor', 'i')
            ->addSelect('i')
            ->andWhere('s.instructor = :instructorId')
            ->andWhere('s.active = :active')
            ->setParameter('instructorId', $instructorId)
            ->setParameter('active', true)
            ->orderBy('s.dayOfWeek', 'ASC')
            ->addOrderBy('s.startTime', 'ASC')
            ->getQuery()
            ->getResult();
    }
}