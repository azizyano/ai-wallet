import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
//import { Button } from "@/components/ui/button";
import { 
  Coins, 
  Lock, 
  CircleDollarSign, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAIStore } from '@/app/stores/ai-store';
import { Progress } from "@/app/components/ui/progress";

export const SuggestionsScreen = () => {
  const { analyses, isAnalyzing, error } = useAIStore();

  if (error) {
    return (
      <Card className="bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-600">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-600">Analyzing market data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {analyses.map((analysis, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span className="flex items-center space-x-2">
                <Coins className="h-6 w-6" />
                <span>{analysis.token}</span>
              </span>
              <span className="text-lg font-normal">
                Confidence: {analysis.confidence}%
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Action Section */}
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {analysis.action === 'Buy' && <TrendingUp className="h-6 w-6 text-green-500" />}
                  {analysis.action === 'Sell' && <CircleDollarSign className="h-6 w-6 text-red-500" />}
                  {analysis.action === 'Hold' && <Clock className="h-6 w-6 text-blue-500" />}
                  {analysis.action === 'Stake' && <Lock className="h-6 w-6 text-purple-500" />}
                  <span className="font-semibold">{analysis.action}</span>
                </div>
                <Progress 
                  value={analysis.confidence} 
                  className="w-32"
                  indicatorClassName={
                    analysis.confidence > 75 ? "bg-green-500" :
                    analysis.confidence > 50 ? "bg-blue-500" :
                    "bg-yellow-500"
                  }
                />
              </div>

              {/* Reason */}
              <p className="text-gray-600">{analysis.reason}</p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Risk Level</div>
                  <div className="font-medium">
                    {analysis.details.riskLevel}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Time Frame</div>
                  <div className="font-medium">
                    {analysis.details.timeFrame}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Potential Return</div>
                  <div className="font-medium">
                    {analysis.details.potentialReturn}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-500">Market Sentiment</div>
                  <div className="font-medium">
                    {analysis.details.marketSentiment}
                  </div>
                </div>
              </div>

              {/* Risk Warning */}
              {analysis.details.riskLevel === 'High' && (
                <div className="flex items-center space-x-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="text-sm">High risk - Please invest responsibly</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};