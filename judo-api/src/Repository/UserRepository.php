<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    public function findByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByRole(string $role): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('JSON_CONTAINS(u.roles, :role) = 1')
            ->setParameter('role', json_encode($role))
            ->getQuery()
            ->getResult();
    }

    public function findAdmins(): array
    {
        return $this->findByRole('ROLE_ADMIN');
    }

    public function findActiveUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.isActive = :active')
            ->setParameter('active', true)
            ->orderBy('u.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findRecentUsers(int $days = 30): array
    {
        $date = new \DateTime();
        $date->modify("-{$days} days");

        return $this->createQueryBuilder('u')
            ->andWhere('u.createdAt >= :date')
            ->setParameter('date', $date)
            ->orderBy('u.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByAgeRange(int $minAge, int $maxAge): array
    {
        $maxBirthDate = new \DateTime();
        $maxBirthDate->modify("-{$minAge} years");
        
        $minBirthDate = new \DateTime();
        $minBirthDate->modify("-{$maxAge} years");

        return $this->createQueryBuilder('u')
            ->andWhere('u.dateOfBirth BETWEEN :minBirthDate AND :maxBirthDate')
            ->setParameter('minBirthDate', $minBirthDate)
            ->setParameter('maxBirthDate', $maxBirthDate)
            ->orderBy('u.dateOfBirth', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findMinors(): array
    {
        $eighteenYearsAgo = new \DateTime();
        $eighteenYearsAgo->modify('-18 years');

        return $this->createQueryBuilder('u')
            ->andWhere('u.dateOfBirth > :eighteenYearsAgo')
            ->setParameter('eighteenYearsAgo', $eighteenYearsAgo)
            ->orderBy('u.dateOfBirth', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findAdults(): array
    {
        $eighteenYearsAgo = new \DateTime();
        $eighteenYearsAgo->modify('-18 years');

        return $this->createQueryBuilder('u')
            ->andWhere('u.dateOfBirth <= :eighteenYearsAgo')
            ->setParameter('eighteenYearsAgo', $eighteenYearsAgo)
            ->orderBy('u.dateOfBirth', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function searchByName(string $searchTerm): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.firstName LIKE :searchTerm OR u.lastName LIKE :searchTerm')
            ->setParameter('searchTerm', '%' . $searchTerm . '%')
            ->orderBy('u.lastName', 'ASC')
            ->addOrderBy('u.firstName', 'ASC')
            ->getQuery()
            ->getResult();
    }
}