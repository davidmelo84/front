import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MonitoringStatus {
  username: string;
  active: boolean;
  totalActiveMonitors: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private apiUrl = `${environment.apiUrl}/api/monitoring`;

  constructor(private http: HttpClient) {}

  /**
   * Inicia o monitoramento
   */
  startMonitoring(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, { email });
  }

  /**
   * Para o monitoramento
   */
  stopMonitoring(): Observable<any> {
    return this.http.post(`${this.apiUrl}/stop`, {});
  }

  /**
   * Verifica status do monitoramento
   */
  getStatus(): Observable<MonitoringStatus> {
    return this.http.get<MonitoringStatus>(`${this.apiUrl}/status`);
  }
}
