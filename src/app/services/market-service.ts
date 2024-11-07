import axios from 'axios';
import { MarketData, SUPPORTED_TOKENS } from '@/app/types/market';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export class MarketService {
  private static async fetchTokenData(coingeckoId: string): Promise<MarketData | null> {
    try {
      const response = await axios.get(
        `${COINGECKO_API}/coins/${coingeckoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );

      const data = response.data;
      const marketData = data.market_data;

      return {
        id: data.id,
        symbol: data.symbol.toUpperCase(),
        current_price: marketData.current_price.usd,
        price_change_percentage_24h: marketData.price_change_percentage_24h,
        price_change_7d: marketData.price_change_percentage_7d,
        price_change_30d: marketData.price_change_percentage_30d,
        market_cap: marketData.market_cap.usd,
        total_volume: marketData.total_volume.usd,
        circulating_supply: marketData.circulating_supply
      };
    } catch (error) {
      console.error(`Error fetching data for ${coingeckoId}:`, error);
      return null;
    }
  }

  public static async getMultipleTokensData(coingeckoIds: string[]): Promise<MarketData[]> {
    try {
      console.log('Fetching data for tokens:', coingeckoIds);
      const promises = coingeckoIds.map(id => this.fetchTokenData(id));
      const results = await Promise.all(promises);
      const validResults = results.filter((data): data is MarketData => data !== null);
      console.log('Fetched market data:', validResults);
      return validResults;
    } catch (error) {
      console.error('Error fetching multiple tokens:', error);
      return [];
    }
  }
}