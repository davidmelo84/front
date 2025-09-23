export interface AlertRule {
  id?: number;
  coinSymbol: string;
  alertType: AlertType;
  targetValue: number;
  email: string;
  active?: boolean;
}

export enum AlertType {
  PRICE_INCREASE = 'PRICE_INCREASE',
  PRICE_DECREASE = 'PRICE_DECREASE',
  VOLUME_SPIKE = 'VOLUME_SPIKE',
  PERCENT_CHANGE_24H = 'PERCENT_CHANGE_24H',
  MARKET_CAP = 'MARKET_CAP'
}

export interface AlertRuleDTO {
  coinSymbol: string;
  alertType: AlertType;
  targetValue: number;
  email: string;
}
