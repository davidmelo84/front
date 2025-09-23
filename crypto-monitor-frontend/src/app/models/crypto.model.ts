export interface CryptoCurrency {
  id?: number;
  coinId: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange1h?: number;
  priceChange24h?: number;
  priceChange7d?: number;
  marketCap?: number;
  totalVolume?: number;
  lastUpdated?: Date;
}
