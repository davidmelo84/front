import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'crypto-monitor-frontend';
  isGlobalLoading = false;
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  shouldShowNavbar(): boolean {
    return this.currentRoute.includes('/dashboard');
  }

  shouldShowFooter(): boolean {
    return !this.currentRoute.includes('/login') &&
           !this.currentRoute.includes('/register');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser(): User | null {
    return this.isLoggedIn() ? { username: 'Usuário' } as User : null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setGlobalLoading(loading: boolean): void {
    this.isGlobalLoading = loading;
  }
}
