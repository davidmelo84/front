export interface SystemStatus {
  status: string;
  timestamp: number;
  cryptos_monitored: number;
  active_alert_rules: number;
  last_update?: Date;
}
