import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../../services/alert.service';
import { CryptoCurrency } from '../../models/crypto.model';
import { AlertType, AlertRuleDTO } from '../../models/alert.model';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alert-modal.html',
  styleUrls: ['./alert-modal.css']
})
export class AlertModalComponent {
  @Input() crypto!: CryptoCurrency;
  @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  alertForm: FormGroup;
  loading = false;
  error = '';

  alertTypes = [
    { value: AlertType.PRICE_INCREASE, label: 'Preço Acima de', icon: '📈' },
    { value: AlertType.PRICE_DECREASE, label: 'Preço Abaixo de', icon: '📉' },
    { value: AlertType.PERCENT_CHANGE_24H, label: 'Variação 24h Acima de (%)', icon: '📊' }
  ];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService
  ) {
    this.alertForm = this.fb.group({
      alertType: [AlertType.PRICE_INCREASE, Validators.required],
      targetValue: ['', [Validators.required, Validators.min(0.01)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.alertForm.valid) {
      this.loading = true;
      this.error = '';

      const alertData: AlertRuleDTO = {
        coinSymbol: this.crypto.symbol,
        alertType: this.alertForm.value.alertType,
        targetValue: parseFloat(this.alertForm.value.targetValue),
        email: this.alertForm.value.email
      };

      this.alertService.createAlertRule(alertData).subscribe({
        next: () => {
          this.created.emit();
          this.loading = false;
        },
        error: () => {
          this.error = 'Erro ao criar alerta. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  onClose(): void {
    this.close.emit();
  }

  getPlaceholder(): string {
    const alertType = this.alertForm.get('alertType')?.value;

    switch (alertType) {
      case AlertType.PRICE_INCREASE:
      case AlertType.PRICE_DECREASE:
        return `Ex: ${this.crypto.currentPrice.toFixed(2)}`;
      case AlertType.PERCENT_CHANGE_24H:
        return 'Ex: 5.0';
      default:
        return 'Digite o valor';
    }
  }

  getCurrentPrice(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(this.crypto.currentPrice);
  }
}
