import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertRule, AlertRuleDTO } from '../models/alert.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = `${environment.apiUrl}/api/crypto/alerts`;

  constructor(private http: HttpClient) {}

  createAlertRule(alertRule: AlertRuleDTO): Observable<AlertRule> {
    return this.http.post<AlertRule>(this.apiUrl, alertRule);
  }

  getActiveAlertRules(): Observable<AlertRule[]> {
    return this.http.get<AlertRule[]>(this.apiUrl);
  }

  deactivateAlertRule(ruleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ruleId}`);
  }
}
