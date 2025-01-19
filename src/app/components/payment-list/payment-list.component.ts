import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { Payment, PaymentFilter } from '../../models/payment.model';
import { MatDialog } from '@angular/material/dialog';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { PaymentAddComponent } from '../payment-add/payment-add.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: Payment[] = [];
  totalItems = 0;
  loading = false;
  error: string | null = null;
  
  filter: PaymentFilter = {
    page: 1,
    limit: 10
  };

  displayedColumns = [
    'payee_name',
    'payee_payment_status',
    'payee_due_date',
    'total_due',
    'actions'
  ];

  constructor(
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.error = null;
    
    this.paymentService.getPayments(this.filter).subscribe({
      next: (response) => {
        console.log('Payments response:', response); // Debug log
        this.payments = response.data;
        this.totalItems = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.error = 'Failed to load payments';
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load payments'
        });
      }
    });
  }

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.filter.search = target.value;
    this.filter.page = 1;
    this.loadPayments();
  }

  onPageChange(event: any): void {
    this.filter.page = event.pageIndex + 1;
    this.filter.limit = event.pageSize;
    this.loadPayments();
  }

  openPaymentForm(payment?: Payment): void {
    if (payment) {
      const dialogRef = this.dialog.open(PaymentFormComponent, {
        width: '600px',
        data: payment
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadPayments();
      });
    } else {
      const dialogRef = this.dialog.open(PaymentAddComponent, {
        width: '600px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) this.loadPayments();
      });
    }
  }

  deletePayment(id: string): void {
    if (confirm('Are you sure you want to delete this payment?')) {
      this.paymentService.deletePayment(id).subscribe({
        next: () => {
          this.loadPayments();
        },
        error: (error) => {
          console.error('Error deleting payment:', error);
        }
      });
    }
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please upload a CSV file'
        });
        return;
      }

      this.loading = true;
      this.paymentService.uploadPaymentsFile(file).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Payments file uploaded successfully'
          });
          this.loadPayments();
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to upload payments file'
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 