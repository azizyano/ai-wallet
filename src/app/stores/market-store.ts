import { create } from 'zustand';
import { MarketService } from '@/app/services/market-service';
import { MarketData, SUPPORTED_TOKENS } from '@/app/types/market';

interface MarketStore {
  marketData: { [key: string]: MarketData };
  isLoading: boolean;
  error: string | null;
  fetchMarketData: (tokenIds: string[]) => Promise<void>;
}

export const useMarketStore = create<MarketStore>((set, get) => ({
  marketData: {},
  isLoading: false,
  error: null,
  fetchMarketData: async (tokenIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const validTokenIds = tokenIds.filter(id => 
        SUPPORTED_TOKENS.some(token => token.coingeckoId === id)
      );

      if (validTokenIds.length === 0) {
        throw new Error('No valid tokens provided');
      }

      const data = await MarketService.getMultipleTokensData(validTokenIds);
      const marketDataMap = data.reduce((acc, token) => {
        acc[token.id] = token;
        return acc;
      }, {} as { [key: string]: MarketData });
      
      set({ marketData: marketDataMap, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch market data',
        isLoading: false 
      });
    }
  },
}));