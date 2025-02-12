export interface Payment {
  _id: string;
  payee_first_name: string;
  payee_last_name: string;
  payee_payment_status: "completed" | "due_now" | "overdue" | "pending";
  payee_added_date_utc: string;
  payee_due_date: string;
  payee_address_line_1: string;
  payee_address_line_2?: string;
  payee_city: string;
  payee_country: string;
  payee_province_or_state?: string;
  payee_postal_code: number;
  payee_phone_number: number;
  payee_email: string;
  currency: string;
  discount_percent: number;
  tax_percent: number;
  due_amount: number;
  total_due: number;
  evidence_file?: string;
  evidence_file_id?: string;
}

export interface PaymentUpdate {
  payee_payment_status: "completed" | "due_now" | "overdue" | "pending";
  payee_due_date: string;
  due_amount: number;
  evidence_file_id?: string;
}

export interface PaymentFilter {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}
