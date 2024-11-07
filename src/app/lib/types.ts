export interface Chain {
    name: string;
    balance: number;
  }
  
  export interface Token {
    id: number;
    name: string;
    balance: number;
    price: number;
    change: number;
    chain: string;
  }
  
  export interface AISuggestion {
    token: string;
    action: 'Stake' | 'Sell' | 'Buy';
    reason: string;
  }
  
  export interface WalletData {
    totalBalance: number;
    chains: Chain[];
    tokens: Token[];
  }