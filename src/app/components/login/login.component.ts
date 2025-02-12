import { Component } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
// import { AuthService } from '../services/auth.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {
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
    //   this.authService.login(this.email, this.password).subscribe({
    //     next: (response) => {
    //       console.log('Login successful', response);
    //       // Handle successful login, e.g., navigate to another page
    //     },
    //     error: (error) => {
    //       console.error('Login failed', error);
    //       // Handle login error, e.g., show an error message
    //     }
    //   });
  }
}
