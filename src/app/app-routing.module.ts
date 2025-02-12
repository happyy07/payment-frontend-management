import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentListComponent } from "./components/payment-list/payment-list.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register-component/register-component.component";
import { HomeComponent } from "./components/home/home.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "payments", component: PaymentListComponent },
  { path: "register", component: RegisterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
