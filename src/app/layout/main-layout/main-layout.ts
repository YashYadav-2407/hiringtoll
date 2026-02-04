import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, MatIconModule, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit {
  showSidenav = signal(false);

  constructor(private router: Router, private authService: Auth) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.showSidenav.set(this.router.url === '/' || this.router.url === '/dashboard' || this.router.url === '/login');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
