import { MarketData } from '@/app/types/market';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with error checking
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Gemini API key is not set');
}
const genAI = new GoogleGenerativeAI(API_KEY || '');

export interface AIAnalysis {
  token: string;
  action: 'Buy' | 'Sell' | 'Hold' | 'Stake';
  confidence: number;
  reason: string;
  details: {
    riskLevel: 'Low' | 'Medium' | 'High';
    timeFrame: 'Short' | 'Medium' | 'Long';
    potentialReturn: string;
    marketSentiment: string;
  };
}

export class AIService {
  private static generatePrompt(tokenData: MarketData): string {
    return `Analyze the following crypto market data and provide investment advice:

Token: ${tokenData.symbol}
Current Price: $${tokenData.current_price}
24h Change: ${tokenData.price_change_percentage_24h}%
7d Change: ${tokenData.price_change_7d}%
30d Change: ${tokenData.price_change_30d}%
Market Cap: $${tokenData.market_cap}
24h Volume: $${tokenData.total_volume}
Circulating Supply: ${tokenData.circulating_supply}

Provide a JSON response in this exact format:
{
  "action": "Buy|Sell|Hold|Stake",
  "confidence": <number between 0-100>,
  "reason": "<brief explanation>",
  "details": {
    "riskLevel": "Low|Medium|High",
    "timeFrame": "Short|Medium|Long",
    "potentialReturn": "<percentage range>",
    "marketSentiment": "<brief market sentiment>"
  }
}

Consider these factors:
1. Price trends and momentum
2. Volume and market cap changes
3. Market sentiment and volatility
4. Supply metrics

Provide ONLY the JSON response, no additional text.`;
  }

  public static async analyzeTokenData(marketData: MarketData): Promise<AIAnalysis> {
    if (!API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      console.log('Analyzing token:', marketData.symbol);
      
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = this.generatePrompt(marketData);
      
      console.log('Sending prompt to Gemini:', prompt);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Received response from Gemini:', text);
      
      try {
        const parsed = JSON.parse(text);
        return {
          token: marketData.symbol,
          ...parsed
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        console.log('Raw AI response:', text);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error in AI analysis:', error);
      return {
        token: marketData.symbol,
        action: 'Hold',
        confidence: 50,
        reason: `Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: {
          riskLevel: 'Medium',
          timeFrame: 'Medium',
          potentialReturn: 'Unknown',
          marketSentiment: 'Uncertain'
        }
      };
    }
  }

  public static async analyzeMultipleTokens(marketDataArray: MarketData[]): Promise<AIAnalysis[]> {
    if (!marketDataArray.length) {
      console.warn('No tokens provided for analysis');
      return [];
    }

    console.log('Analyzing multiple tokens:', marketDataArray.map(d => d.symbol));

    try {
      const analysisPromises = marketDataArray.map(data => this.analyzeTokenData(data));
      const results = await Promise.all(analysisPromises);
      
      console.log('Analysis results:', results);
      return results;
    } catch (error) {
      console.error('Error analyzing multiple tokens:', error);
      return marketDataArray.map(data => ({
        token: data.symbol,
        action: 'Hold',
        confidence: 50,
        reason: 'Multiple analysis error - defaulting to hold position',
        details: {
          riskLevel: 'Medium',
          timeFrame: 'Medium',
          potentialReturn: 'Unknown',
          marketSentiment: 'Uncertain'
        }
      }));
    }
  }
}