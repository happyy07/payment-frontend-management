import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentListComponent } from './components/payment-list/payment-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'payments', pathMatch: 'full' },
  { path: 'payments', component: PaymentListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 