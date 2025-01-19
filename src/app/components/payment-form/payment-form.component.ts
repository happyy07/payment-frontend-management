import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Payment } from '../../models/payment.model';
import { PaymentService } from '../../services/payment.service';
import { LocationService } from '../../services/location.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit {
  paymentForm!: FormGroup;
  countries: { name: string; code: string }[] = [];
  cities: string[] = [];
  states: string[] = [];
  isLoading = false;
  selectedFile: File | null = null;
  isCompleted: boolean = false;
  evidence_file_id?: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Payment,
    private paymentService: PaymentService,
    private locationService: LocationService,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCountries();
    if (this.data) {
      this.paymentForm.patchValue(this.data);
      this.isCompleted = this.data.payee_payment_status === 'completed';
      if (this.isCompleted) {
        this.paymentForm.disable();
      }
    }

    this.paymentForm.get('payee_country')?.valueChanges.subscribe(country => {
      if (country) {
        this.loadStates(country);
        this.paymentForm.patchValue({
          payee_province_or_state: '',
          payee_city: ''
        });
      }
    });

    this.paymentForm.get('payee_province_or_state')?.valueChanges.subscribe(state => {
      const country = this.paymentForm.get('payee_country')?.value;
      if (country && state) {
        this.loadCities(country, state);
        this.paymentForm.patchValue({
          payee_city: ''
        });
      }
    });
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      payee_first_name: [{value: '', disabled: true}],
      payee_last_name: [{value: '', disabled: true}],
      payee_payment_status: ['pending', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: [{value: '', disabled: true}],
      payee_address_line_2: [{value: '', disabled: true}],
      payee_city: [{value: '', disabled: true}],
      payee_country: [{value: '', disabled: true}],
      payee_province_or_state: [{value: '', disabled: true}],
      payee_postal_code: [{value: '', disabled: true}],
      payee_phone_number: [{value: '', disabled: true}],
      payee_email: [{value: '', disabled: true}],
      currency: [{value: 'USD', disabled: true}],
      discount_percent: [{value: 0, disabled: true}],
      tax_percent: [{value: 0, disabled: true}],
      due_amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadCountries(): void {
    this.locationService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  loadStates(country: string): void {
    this.locationService.getStates(country).subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (error) => {
        console.error('Error loading states:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load states'
        });
      }
    });
  }

  loadCities(country: string, state: string): void {
    this.locationService.getCities(country, state).subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load cities'
        });
      }
    });
  }

  loadCitiesAndStates(country: string, state?: string): void {
    this.loadStates(country);
    if (state) {
      this.loadCities(country, state);
    }
  }

  onCountryChange(country: string): void {
    this.loadCitiesAndStates(country);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  private formatFormData(formData: any): any {
    return {
      ...formData,
      payee_postal_code: Number(formData.payee_postal_code),
      payee_phone_number: Number(formData.payee_phone_number),
      discount_percent: Number(formData.discount_percent),
      tax_percent: Number(formData.tax_percent),
      due_amount: Number(formData.due_amount)
    };
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) {
      return;
    }

    this.isLoading = true;
    const formData = {
      payee_payment_status: this.paymentForm.get('payee_payment_status')?.value,
      payee_due_date: this.paymentForm.get('payee_due_date')?.value,
      due_amount: Number(this.paymentForm.get('due_amount')?.value)
    };

    try {
      if (this.data?._id) {
        let evidenceId: string | undefined;
        
        if (this.selectedFile && formData.payee_payment_status === 'completed') {
          const response = await this.paymentService.uploadEvidence(this.data._id, this.selectedFile).toPromise();
          evidenceId = response?.evidence_id;
        }

        await this.paymentService.updatePayment(this.data._id, {
          ...formData,
          evidence_file_id: evidenceId
        }).toPromise();

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Payment updated successfully'
        });
        this.dialogRef.close(true);
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while updating the payment'
      });
    } finally {
      this.isLoading = false;
    }
  }

  downloadEvidence(): void {
    if (this.data?._id) {
      this.paymentService.downloadEvidence(this.data._id).then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Evidence downloaded successfully'
        });
      }).catch(error => {
        console.error('Error downloading evidence:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to download evidence'
        });
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
} 