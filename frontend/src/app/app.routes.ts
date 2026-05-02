import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { TransactionsComponent } from './transactions/transactions';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: '**', redirectTo: '' }
];
