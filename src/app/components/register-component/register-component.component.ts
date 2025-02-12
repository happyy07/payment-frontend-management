import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-register",
  templateUrl: "./register-component.component.html",
  styleUrls: ["./register-component.component.scss"],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    });
  }

  // passwordMatchValidator(form: FormGroup): void {
  //   const password = form.get("password");
  //   const confirmPassword = form.get("confirmPassword");
  //   if (
  //     password &&
  //     confirmPassword &&
  //     password.value !== confirmPassword.value
  //   ) {
  //     confirmPassword.setErrors({ mismatch: true });
  //   } else {
  //     confirmPassword?.setErrors(null);
  //   }
  // }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log("Form Submitted", this.registerForm.value);
      // Handle form submission logic here
    }
  }
}
