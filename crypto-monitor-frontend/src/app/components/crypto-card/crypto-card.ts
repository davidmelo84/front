import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoCurrency } from '../../models/crypto.model';

@Component({
  selector: 'app-crypto-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crypto-card.html',
  styleUrls: ['./crypto-card.css']
})
export class CryptoCardComponent {
  @Input() crypto!: CryptoCurrency;
}
