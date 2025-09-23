import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

import { CryptoService } from '../../services/crypto.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';

import { CryptoCurrency } from '../../models/crypto.model';
import { AlertRule } from '../../models/alert.model';
import { SystemStatus } from '../../models/status.model';

import { AlertModalComponent } from '../alert-modal/alert-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  cryptos: CryptoCurrency[] = [];
  alerts: AlertRule[] = [];
  systemStatus: SystemStatus | null = null;
  loading: boolean = false;
  error: string = '';
  private refreshSubscription?: Subscription;
  selectedCrypto: CryptoCurrency | null = null;
  showAlertModal: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  loadData(): void {
    this.loading = true;
    this.error = '';

    this.cryptoService.getCurrentPrices().subscribe({
      next: (data) => {
        this.cryptos = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erro ao carregar criptomoedas';
        this.loading = false;
      }
    });

    this.alertService.getActiveAlertRules().subscribe({
      next: (data) => (this.alerts = data),
      error: (err) => console.error('Erro ao carregar alertas:', err)
    });

    this.cryptoService.getSystemStatus().subscribe({
      next: (data) => (this.systemStatus = data),
      error: (err) => console.error('Erro ao carregar status:', err)
    });
  }

  forceUpdate(): void {
    this.cryptoService.forceUpdate().subscribe({
      next: () => this.loadData(),
      error: () => (this.error = 'Erro ao atualizar dados')
    });
  }

  openAlertModal(crypto: CryptoCurrency): void {
    this.selectedCrypto = crypto;
    this.showAlertModal = true;
  }

  closeAlertModal(): void {
    this.showAlertModal = false;
    this.selectedCrypto = null;
  }

  deleteAlert(alertId: number | undefined): void {
    if (!alertId) return;
    if (confirm('Deseja realmente desativar este alerta?')) {
      this.alertService.deactivateAlertRule(alertId).subscribe({
        next: () => this.loadData(),
        error: () => (this.error = 'Erro ao desativar alerta')
      });
    }
  }

  testNotification(): void {
    this.cryptoService.sendTestNotification().subscribe({
      next: () => alert('Notificação de teste enviada!'),
      error: () => (this.error = 'Erro ao enviar notificação')
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatPercentage(value: number | undefined): string {
    if (value === undefined) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  getPercentageClass(value: number | undefined): string {
    if (value === undefined) return '';
    return value > 0 ? 'positive' : 'negative';
  }

  onAlertCreated(): void {
    this.closeAlertModal();
    this.loadData();
  }
}
