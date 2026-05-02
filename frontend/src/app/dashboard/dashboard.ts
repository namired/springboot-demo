import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { TransactionService, Summary, Transaction } from '../services/transaction.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  summary: Summary | null = null;
  recentTransactions: Transaction[] = [];
  loading = true;
  error = '';

  categoryChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#e2e8f0', font: { size: 13 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${(ctx.raw as number).toFixed(2)}`
        }
      }
    }
  };

  monthlyChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  monthlyChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${(ctx.raw as number).toFixed(2)}`
        }
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.1)' } },
      y: {
        ticks: { color: '#94a3b8', callback: (v) => '$' + v },
        grid: { color: 'rgba(148,163,184,0.1)' }
      }
    }
  };

  constructor(private svc: TransactionService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading = true;
    let loaded = 0;
    const done = () => { if (++loaded === 4) this.loading = false; };

    this.svc.getSummary().subscribe({
      next: (s) => { this.summary = s; done(); },
      error: () => { this.error = 'Could not reach backend at localhost:8080'; done(); }
    });

    this.svc.getRecent().subscribe({
      next: (t) => { this.recentTransactions = t; done(); },
      error: () => done()
    });

    this.svc.getSpendingByCategory().subscribe({
      next: (d) => {
        this.categoryChartData = {
          labels: d.labels,
          datasets: [{
            data: d.data,
            backgroundColor: [
              '#6366f1','#f59e0b','#10b981','#ef4444',
              '#3b82f6','#8b5cf6','#ec4899','#14b8a6'
            ],
            borderWidth: 2,
            borderColor: '#1e293b'
          }]
        };
        done();
      },
      error: () => done()
    });

    this.svc.getMonthlySpending().subscribe({
      next: (d) => {
        this.monthlyChartData = {
          labels: d.labels,
          datasets: [{
            data: d.data,
            backgroundColor: 'rgba(99,102,241,0.8)',
            borderColor: '#6366f1',
            borderWidth: 2,
            borderRadius: 6
          }]
        };
        done();
      },
      error: () => done()
    });
  }
}
