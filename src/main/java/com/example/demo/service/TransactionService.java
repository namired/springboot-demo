package com.example.demo.service;

import com.example.demo.model.Transaction;
import com.example.demo.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class TransactionService {

    private final TransactionRepository repo;

    public TransactionService(TransactionRepository repo) {
        this.repo = repo;
    }

    public List<Transaction> findAll() {
        return repo.findAll();
    }

    public List<Transaction> findRecent() {
        return repo.findTop10ByOrderByTransactionDateDesc();
    }

    public Transaction save(Transaction t) {
        return repo.save(t);
    }

    public Map<String, Object> getSpendingByCategory() {
        List<Object[]> rows = repo.findSpendingByCategory();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> data = new ArrayList<>();
        for (Object[] row : rows) {
            labels.add((String) row[0]);
            data.add((BigDecimal) row[1]);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }

    public Map<String, Object> getMonthlySpending() {
        List<Object[]> rows = repo.findMonthlySpending();
        List<String> labels = new ArrayList<>();
        List<BigDecimal> data = new ArrayList<>();
        String[] months = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue();
            int year = ((Number) row[1]).intValue();
            labels.add(months[month] + " " + year);
            data.add((BigDecimal) row[2]);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }

    public Map<String, Object> getSummary() {
        List<Transaction> all = repo.findAll();
        BigDecimal totalSpent = all.stream()
                .filter(t -> "DEBIT".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalIncome = all.stream()
                .filter(t -> "CREDIT".equals(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long totalTransactions = all.size();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalSpent", totalSpent);
        summary.put("totalIncome", totalIncome);
        summary.put("balance", totalIncome.subtract(totalSpent));
        summary.put("totalTransactions", totalTransactions);
        return summary;
    }
}
