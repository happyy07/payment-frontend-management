import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Payment Management System</span>
    </mat-toolbar>
    <router-outlet></router-outlet>
    <p-toast></p-toast>
  `
})
export class AppComponent {} 