import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  transactionDate: string;
  type: 'DEBIT' | 'CREDIT';
}

export interface ChartData {
  labels: string[];
  data: number[];
}

export interface Summary {
  totalSpent: number;
  totalIncome: number;
  balance: number;
  totalTransactions: number;
}

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private base = 'http://localhost:8080/api/transactions';

  constructor(private http: HttpClient) {}

  getRecent(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.base}/recent`);
  }

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.base);
  }

  getSpendingByCategory(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.base}/spending-by-category`);
  }

  getMonthlySpending(): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.base}/monthly-spending`);
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.base}/summary`);
  }
}
