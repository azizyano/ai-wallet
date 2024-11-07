import { create } from 'zustand';
import { AIAnalysis, AIService } from '@/app/services/ai-service';
import { MarketData } from '@/app/types/market';

interface AIStore {
  analyses: AIAnalysis[];
  isAnalyzing: boolean;
  error: string | null;
  analyzeTokens: (marketData: MarketData[]) => Promise<AIAnalysis[]>;
}

export const useAIStore = create<AIStore>((set, get) => ({
  analyses: [],
  isAnalyzing: false,
  error: null,
  analyzeTokens: async (marketData: MarketData[]) => {
    set({ isAnalyzing: true, error: null });
    
    try {
      console.log('Starting token analysis:', marketData);
      
      if (!marketData.length) {
        throw new Error('No market data provided for analysis');
      }

      const analyses = await AIService.analyzeMultipleTokens(marketData);
      
      console.log('Analysis completed:', analyses);
      
      set({ analyses, isAnalyzing: false });
      return analyses;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze tokens';
      console.error('AI analysis error:', errorMessage);
      
      set({ 
        error: errorMessage,
        isAnalyzing: false,
        analyses: [] 
      });
      
      return [];
    }
  },
}));