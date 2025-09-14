<?php

namespace App\Repository;

use App\Entity\Instructor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Instructor>
 */
class InstructorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Instructor::class);
    }

    public function findActive(): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.active = :active')
            ->setParameter('active', true)
            ->orderBy('i.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByGrade(string $grade): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.grade = :grade')
            ->andWhere('i.active = :active')
            ->setParameter('grade', $grade)
            ->setParameter('active', true)
            ->orderBy('i.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findBySpecialty(string $specialty): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.specialty = :specialty')
            ->andWhere('i.active = :active')
            ->setParameter('specialty', $specialty)
            ->setParameter('active', true)
            ->orderBy('i.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findWithSchedules(): array
    {
        return $this->createQueryBuilder('i')
            ->leftJoin('i.schedules', 's')
            ->addSelect('s')
            ->andWhere('i.active = :active')
            ->setParameter('active', true)
            ->orderBy('i.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findSeniorInstructors(): array
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.experience >= :minExperience')
            ->andWhere('i.active = :active')
            ->setParameter('minExperience', 5)
            ->setParameter('active', true)
            ->orderBy('i.experience', 'DESC')
            ->getQuery()
            ->getResult();
    }
}