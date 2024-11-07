'use client';

import React from 'react';
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Bitcoin,
  Gem,
  Coins,
  Link as LinkIcon,
  Binary
} from 'lucide-react';
import { SUPPORTED_TOKENS } from '@/app/types/market';

const getTokenIcon = (symbol: string) => {
  switch (symbol) {
    case 'BTC':
      return <Bitcoin className="h-6 w-6" />;
    case 'ETH':
      return <Gem className="h-6 w-6" />;
    case 'BNB':
      return <Binary className="h-6 w-6" />;
    case 'LINK':
      return <LinkIcon className="h-6 w-6" />;
    default:
      return <Coins className="h-6 w-6" />;
  }
};

interface TokenSelectionProps {
  selectedTokens: string[];
  onTokenSelect: (coingeckoId: string) => void;
}

export const TokenSelection = ({ selectedTokens, onTokenSelect }: TokenSelectionProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {SUPPORTED_TOKENS.map((token) => (
        <Card
          key={token.coingeckoId}
          className={`p-4 cursor-pointer transition-all hover:border-purple-500 ${
            selectedTokens.includes(token.coingeckoId)
              ? 'bg-purple-900/20 border-purple-500'
              : 'bg-gray-800 border-gray-700'
          }`}
          onClick={() => onTokenSelect(token.coingeckoId)}
        >
          <div className="flex items-center space-x-3">
            <div className="text-purple-400">
              {getTokenIcon(token.symbol)}
            </div>
            <div>
              <h3 className="font-semibold text-white">{token.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {token.symbol}
              </Badge>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};