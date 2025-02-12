import { Component } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { AuthenticationService } from "../../services/authentication.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
// import { AuthService } from '../services/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.createForm();
  }

  private createForm(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    console.log("Form submitted", this.loginForm.value);

    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        console.log("Login successful", response);
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "You have logged in successfully",
        });
        this.router.navigate(["/payments"]); // Navigate to payments page on successful login
      },
      error: (error) => {
        console.error("Login failed", error);
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Login failed; please try again later.",
        });
      },
    });
  }
}
