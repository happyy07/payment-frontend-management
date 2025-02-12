import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Payment, PaymentFilter, PaymentUpdate } from "../models/payment.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  // private apiUrl = "https://payment-backend-management.onrender.com"; // adjust based on your backend URL
  private apiUrl = "http://localhost:5000";

  constructor(private http: HttpClient) {}

  getPayments(
    filter: PaymentFilter
  ): Observable<{ data: Payment[]; total: number }> {
    let params = new HttpParams()
      .set("page", filter.page.toString())
      .set("limit", filter.limit.toString());

    if (filter.search) params = params.set("search", filter.search);
    if (filter.status) params = params.set("status", filter.status);
    if (filter.fromDate) params = params.set("fromDate", filter.fromDate);
    if (filter.toDate) params = params.set("toDate", filter.toDate);

    return this.http
      .get<any>(`${this.apiUrl}/payments/getAllPayments`, { params })
      .pipe(
        map((response) => ({
          data: Array.isArray(response) ? response : response.data || [],
          total:
            response.total || (Array.isArray(response) ? response.length : 0),
        }))
      );
  }

  createPayment(payment: Payment): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.apiUrl}/payments/createPayment`,
      payment
    );
  }

  updatePayment(id: string, payment: PaymentUpdate): Observable<Payment> {
    return this.http.put<Payment>(
      `${this.apiUrl}/payments/updatePayment/${id}`,
      payment
    );
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/payments/deletePayment/${id}`
    );
  }

  uploadEvidence(id: string, file: File): Observable<{ evidence_id: string }> {
    const formData = new FormData();
    formData.append("uploadFile", file);
    return this.http.post<{ evidence_id: string }>(
      `${this.apiUrl}/payments/${id}/evidence`,
      formData
    );
  }

  downloadEvidence(paymentId: string): Promise<void> {
    return this.http
      .get(`${this.apiUrl}/payments/${paymentId}/downloadEvidence`, {
        responseType: "blob",
      })
      .pipe(
        map((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `evidence-${paymentId}`; // The actual filename will be set by the server
          link.click();
          window.URL.revokeObjectURL(url);
        })
      )
      .toPromise();
  }

  uploadPaymentsFile(file: File): Observable<void> {
    const formData = new FormData();
    formData.append("paymentCSVFile", file);
    return this.http.post<void>(`${this.apiUrl}/payments/uploadCSV`, formData);
  }
}
