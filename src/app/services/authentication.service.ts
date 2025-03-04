import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { User, UserCredentials } from "../models/payment.model";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthenticationService {
  // private apiUrl = "http://localhost:5000";
  private apiUrl = "http://3.98.142.118:5000";

  private isLoggedIn = false;
  token: string | null = null;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("token");
    this.isLoggedIn = !!this.token;
  }

  createUser(userData: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/createUser`, userData);
  }

  login(userCredentials: UserCredentials): Observable<any> {
    return this.http
      .post<{ token: string }>(
        `${this.apiUrl}/users/loginUser`,
        userCredentials
      )
      .pipe(
        map((response) => {
          console.log("response=>", response);
          if (response && response.token) {
            this.token = response.token;
            localStorage.setItem("token", this.token);
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
          }
          return response;
        }),
        catchError((error) => {
          console.error("Login failed", error);
          this.isLoggedIn = false;
          return throwError(
            () => new Error("Login failed; please try again later.")
          );
        })
      );
  }

  logout(): void {
    this.token = null;
    this.isLoggedIn = false;
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    console.log("isAuthenticated=>", this.isLoggedIn);
    return this.isLoggedIn;
  }
}
