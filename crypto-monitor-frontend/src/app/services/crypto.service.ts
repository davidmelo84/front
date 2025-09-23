import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CryptoCurrency } from '../models/crypto.model';
import { SystemStatus } from '../models/status.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private apiUrl = `${environment.apiUrl}/api/crypto`;

  constructor(private http: HttpClient) {}

  getCurrentPrices(): Observable<CryptoCurrency[]> {
    return this.http.get<CryptoCurrency[]>(`${this.apiUrl}/current`);
  }

  getCryptoByCoinId(coinId: string): Observable<CryptoCurrency> {
    return this.http.get<CryptoCurrency>(`${this.apiUrl}/current/${coinId}`);
  }

  getSavedCryptos(): Observable<CryptoCurrency[]> {
    return this.http.get<CryptoCurrency[]>(`${this.apiUrl}/saved`);
  }

  forceUpdate(): Observable<any> {
    return this.http.post(`${this.apiUrl}/update`, {});
  }

  getSystemStatus(): Observable<SystemStatus> {
    return this.http.get<SystemStatus>(`${this.apiUrl}/status`);
  }

  sendTestNotification(): Observable<any> {
    return this.http.post(`${this.apiUrl}/test-notification`, {});
  }
}
