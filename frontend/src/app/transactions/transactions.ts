import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TransactionService, Transaction } from '../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css'
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  filtered: Transaction[] = [];
  loading = true;
  searchTerm = '';
  selectedType = 'ALL';

  constructor(private svc: TransactionService) {}

  ngOnInit(): void {
    this.svc.getAll().subscribe({
      next: (t) => {
        this.transactions = t.sort((a, b) =>
          new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
        );
        this.filtered = this.transactions;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  filter(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }

  filterByType(type: string): void {
    this.selectedType = type;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filtered = this.transactions.filter(t => {
      const matchSearch = !this.searchTerm ||
        t.description.toLowerCase().includes(this.searchTerm) ||
        t.category.toLowerCase().includes(this.searchTerm);
      const matchType = this.selectedType === 'ALL' || t.type === this.selectedType;
      return matchSearch && matchType;
    });
  }
}
