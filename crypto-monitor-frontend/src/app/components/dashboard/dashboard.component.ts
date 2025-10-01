import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { CryptoService } from '../../services/crypto.service';
import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { MonitoringService, MonitoringStatus } from '../../services/monitoring.service';

import { CryptoCurrency } from '../../models/crypto.model';
import { AlertRule } from '../../models/alert.model';
import { SystemStatus } from '../../models/status.model';

import { AlertModalComponent } from '../alert-modal/alert-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AlertModalComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  cryptos: CryptoCurrency[] = [];
  alerts: AlertRule[] = [];
  systemStatus: SystemStatus | null = null;
  monitoringStatus: MonitoringStatus | null = null;
  loading: boolean = false;
  error: string = '';
  successMessage: string = '';

  // Controle de monitoramento
  monitoringActive: boolean = false;
  userEmail: string = '';

  private refreshSubscription?: Subscription;
  selectedCrypto: CryptoCurrency | null = null;
  showAlertModal: boolean = false;

  constructor(
    private cryptoService: CryptoService,
    private alertService: AlertService,
    private authService: AuthService,
    private monitoringService: MonitoringService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.checkMonitoringStatus();

    // Atualização automática de status a cada 30 segundos
    this.refreshSubscription = interval(30000).subscribe(() => {
      this.loadData();
      this.checkMonitoringStatus();
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription?.unsubscribe();
  }

  /**
   * Verifica status do monitoramento
   */
  checkMonitoringStatus(): void {
    this.monitoringService.getStatus().subscribe({
      next: (status) => {
        this.monitoringStatus = status;
        this.monitoringActive = status.active;
      },
      error: (err) => console.error('Erro ao verificar status:', err)
    });
  }

  /**
   * Inicia o monitoramento
   */
  startMonitoring(): void {
    if (!this.userEmail || this.userEmail.trim() === '') {
      this.error = 'Por favor, insira um email válido';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.monitoringService.startMonitoring(this.userEmail).subscribe({
      next: (response) => {
        this.monitoringActive = true;
        this.successMessage = 'Monitoramento iniciado com sucesso! Você receberá alertas no email: ' + this.userEmail;
        this.loading = false;
        this.checkMonitoringStatus();
      },
      error: (err) => {
        this.error = 'Erro ao iniciar monitoramento: ' + (err.error?.message || err.message);
        this.loading = false;
      }
    });
  }

  /**
   * Para o monitoramento
   */
  stopMonitoring(): void {
    if (confirm('Deseja realmente parar o monitoramento?')) {
      this.loading = true;
      this.error = '';
      this.successMessage = '';

      this.monitoringService.stopMonitoring().subscribe({
        next: (response) => {
          this.monitoringActive = false;
          this.successMessage = 'Monitoramento parado com sucesso!';
          this.loading = false;
          this.checkMonitoringStatus();
        },
        error: (err) => {
          this.error = 'Erro ao parar monitoramento: ' + (err.error?.message || err.message);
          this.loading = false;
        }
      });
    }
  }

  loadData(): void {
    this.cryptoService.getCurrentPrices().subscribe({
      next: (data) => {
        this.cryptos = data;
      },
      error: () => {
        this.error = 'Erro ao carregar criptomoedas';
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
      next: () => {
        this.loadData();
        this.successMessage = 'Dados atualizados com sucesso!';
      },
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
      next: () => {
        this.successMessage = 'Notificação de teste enviada!';
      },
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

  /**
   * Limpa mensagens após 5 segundos
   */
  clearMessages(): void {
    setTimeout(() => {
      this.error = '';
      this.successMessage = '';
    }, 5000);
  }
}
