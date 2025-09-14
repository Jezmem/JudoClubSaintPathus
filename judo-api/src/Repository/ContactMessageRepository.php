<?php

namespace App\Repository;

use App\Entity\ContactMessage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ContactMessage>
 */
class ContactMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ContactMessage::class);
    }

    public function findAllWithPagination(int $page = 1, int $limit = 10, ?string $status = null): array
    {
        $qb = $this->createQueryBuilder('cm')
            ->orderBy('cm.createdAt', 'DESC');

        if ($status) {
            $qb->andWhere('cm.status = :status')
               ->setParameter('status', $status);
        }

        $totalQuery = clone $qb;
        $total = $totalQuery->select('COUNT(cm.id)')->getQuery()->getSingleScalarResult();

        $offset = ($page - 1) * $limit;
        $qb->setFirstResult($offset)
           ->setMaxResults($limit);

        $messages = $qb->getQuery()->getResult();

        return [
            'data' => $messages,
            'pagination' => [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public function findByStatus(string $status): array
    {
        return $this->createQueryBuilder('cm')
            ->andWhere('cm.status = :status')
            ->setParameter('status', $status)
            ->orderBy('cm.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findUnread(): array
    {
        return $this->findByStatus('unread');
    }

    public function findRead(): array
    {
        return $this->findByStatus('read');
    }

    public function findReplied(): array
    {
        return $this->findByStatus('replied');
    }

    public function findBySubject(string $subject): array
    {
        return $this->createQueryBuilder('cm')
            ->andWhere('cm.subject = :subject')
            ->setParameter('subject', $subject)
            ->orderBy('cm.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findByEmail(string $email): array
    {
        return $this->createQueryBuilder('cm')
            ->andWhere('cm.email = :email')
            ->setParameter('email', $email)
            ->orderBy('cm.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findRecent(int $days = 7): array
    {
        $date = new \DateTime();
        $date->modify("-{$days} days");

        return $this->createQueryBuilder('cm')
            ->andWhere('cm.createdAt >= :date')
            ->setParameter('date', $date)
            ->orderBy('cm.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function countByStatus(): array
    {
        $result = $this->createQueryBuilder('cm')
            ->select('cm.status, COUNT(cm.id) as count')
            ->groupBy('cm.status')
            ->getQuery()
            ->getResult();

        $counts = [];
        foreach ($result as $row) {
            $counts[$row['status']] = (int) $row['count'];
        }

        return $counts;
    }

    public function countUnread(): int
    {
        return $this->createQueryBuilder('cm')
            ->select('COUNT(cm.id)')
            ->andWhere('cm.status = :status')
            ->setParameter('status', 'unread')
            ->getQuery()
            ->getSingleScalarResult();
    }
}