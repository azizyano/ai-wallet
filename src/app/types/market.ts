export interface MarketData {
    id: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    price_change_7d?: number;
    price_change_30d?: number;
    market_cap: number;
    total_volume: number;
    circulating_supply: number;
  }
  
  export interface TokenInfo {
    coingeckoId: string;
    symbol: string;
    name: string;
  }
  
  // List of supported tokens
  export const SUPPORTED_TOKENS: TokenInfo[] = [
    { coingeckoId: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
    { coingeckoId: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
    { coingeckoId: 'binancecoin', symbol: 'BNB', name: 'BNB' },
    { coingeckoId: 'uniswap', symbol: 'UNI', name: 'Uniswap' },
    { coingeckoId: 'chainlink', symbol: 'LINK', name: 'Chainlink' },
    { coingeckoId: 'cardano', symbol: 'ADA', name: 'Cardano' }
  ];