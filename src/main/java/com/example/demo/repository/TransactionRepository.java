package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.type = 'DEBIT' GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> findSpendingByCategory();

    @Query("SELECT FUNCTION('MONTH', t.transactionDate), FUNCTION('YEAR', t.transactionDate), SUM(t.amount) " +
           "FROM Transaction t WHERE t.type = 'DEBIT' " +
           "GROUP BY FUNCTION('YEAR', t.transactionDate), FUNCTION('MONTH', t.transactionDate) " +
           "ORDER BY FUNCTION('YEAR', t.transactionDate), FUNCTION('MONTH', t.transactionDate)")
    List<Object[]> findMonthlySpending();

    List<Transaction> findTop10ByOrderByTransactionDateDesc();
}
