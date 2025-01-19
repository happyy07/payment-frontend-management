import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from '../../services/payment.service';
import { LocationService } from '../../services/location.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-payment-add',
  templateUrl: './payment-add.component.html',
  styleUrls: ['./payment-add.component.scss']
})
export class PaymentAddComponent implements OnInit {
  paymentForm!: FormGroup;
  countries: { name: string; code: string }[] = [];
  cities: string[] = [];
  states: string[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaymentAddComponent>,
    private paymentService: PaymentService,
    private locationService: LocationService,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCountries();

    // Subscribe to country and state changes
    this.paymentForm.get('payee_country')?.valueChanges.subscribe(countryCode => {
      const selectedCountry = this.countries.find(country => country.code === countryCode);
      if (selectedCountry) {
        this.loadStates(selectedCountry.name);
        this.paymentForm.patchValue({
          payee_province_or_state: '',
          payee_city: ''
        });
      }
    });

    this.paymentForm.get('payee_province_or_state')?.valueChanges.subscribe(state => {
      const countryCode = this.paymentForm.get('payee_country')?.value;
      const selectedCountry = this.countries.find(country => country.code === countryCode);
      if (selectedCountry && state) {
        this.loadCities(selectedCountry.name, state);
        this.paymentForm.patchValue({
          payee_city: ''
        });
      }
    });
  }

  createForm(): void {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_payment_status: ['pending', Validators.required],
      payee_due_date: ['', Validators.required],
      payee_address_line_1: ['', Validators.required],
      payee_address_line_2: [''],
      payee_city: ['', Validators.required],
      payee_country: ['', Validators.required],
      payee_province_or_state: [''],
      payee_postal_code: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      payee_phone_number: ['', [Validators.required, Validators.pattern(/^\+\d{1,3}\d{4,14}$/)]],
      payee_email: ['', [Validators.required, Validators.email]],
      currency: ['USD', Validators.required],
      discount_percent: [0, [Validators.min(0), Validators.max(100)]],
      tax_percent: [0, [Validators.min(0), Validators.max(100)]],
      due_amount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  loadCountries(): void {
    this.locationService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load countries'
        });
      }
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

  private formatFormData(formData: any): any {
    return {
      ...formData,
      payee_country: formData.payee_country,
      payee_postal_code: String(formData.payee_postal_code),
      payee_phone_number: String(formData.payee_phone_number),
      discount_percent: Number(formData.discount_percent),
      tax_percent: Number(formData.tax_percent),
      due_amount: Number(formData.due_amount),
      payee_added_date_utc: new Date().toISOString()
    };
  }

  async onSubmit(): Promise<void> {
    if (this.paymentForm.invalid) return;

    this.isLoading = true;
    try {
      const formData = this.formatFormData(this.paymentForm.value);
      formData.payee_added_date_utc = new Date().toISOString();

      await this.paymentService.createPayment(formData).toPromise();

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Payment created successfully'
      });
      this.dialogRef.close(true);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while creating the payment'
      });
    } finally {
      this.isLoading = false;
    }
  }
} 