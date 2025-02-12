import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "./services/authentication.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(["/login"]);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }
}
