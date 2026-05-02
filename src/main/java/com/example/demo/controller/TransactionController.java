package com.example.demo.controller;

import com.example.demo.model.Transaction;
import com.example.demo.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Transaction> getAll() {
        return service.findAll();
    }

    @GetMapping("/recent")
    public List<Transaction> getRecent() {
        return service.findRecent();
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return service.save(transaction);
    }

    @GetMapping("/spending-by-category")
    public Map<String, Object> spendingByCategory() {
        return service.getSpendingByCategory();
    }

    @GetMapping("/monthly-spending")
    public Map<String, Object> monthlySpending() {
        return service.getMonthlySpending();
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return service.getSummary();
    }
}
