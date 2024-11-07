"use client";

import React, { useEffect, useState } from "react";
import { formatEther } from "viem";
import {
  ConnectButton,
  useAccount,
  usePublicClient,
  useParticleAuth,
  useWallets,
  useModal,
} from "@particle-network/connectkit";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Loader2, ArrowRight, RefreshCcw } from "lucide-react";
import { useMarketStore } from "@/app/stores/market-store";
import { useAIStore } from "@/app/stores/ai-store";
import { SUPPORTED_TOKENS } from "@/app/types/market";
import { formatBalance, truncateAddress, copyToClipboard } from "@/app/utils/utils";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { getUserInfo } = useParticleAuth();
  const publicClient = usePublicClient();
  const [primaryWallet] = useWallets();
  const { isOpen, setOpen } = useModal({});
  const { analyzeTokens, isAnalyzing } = useAIStore();
  const { marketData, fetchMarketData, isLoading: isLoadingMarket } = useMarketStore();

  // State
  const [balance, setBalance] = useState<string>("");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
      fetchUserInfo();
      // Fetch market data for all supported tokens
      fetchMarketData(SUPPORTED_TOKENS.map(t => t.coingeckoId));
    }
  }, [address, isConnected]);

  const fetchBalance = async () => {
    try {
      if (!address) return;
      const balanceResponse = await publicClient?.getBalance({ address });
      const balanceInEther = formatEther(balanceResponse!);
      setBalance(formatBalance(balanceInEther));
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      if (primaryWallet?.connector?.walletConnectorType === "particleAuth") {
        const info = getUserInfo();
        setUserInfo(info);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleTokenSelect = async (tokenId: string) => {
    setSelectedToken(tokenId);
    try {
      const tokenMarketData = marketData[tokenId];
      if (tokenMarketData) {
        const [suggestion] = await analyzeTokens([tokenMarketData]);
        setAiSuggestion(suggestion);
      }
    } catch (error) {
      console.error("Error getting AI suggestion:", error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">AI Wallet Dashboard</h1>
          <p className="text-gray-400">Connect your wallet to get started</p>
        </div>
        <ConnectButton label="Connect Wallet" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 bg-black text-white">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">AI Wallet Dashboard</h1>
          <ConnectButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Wallet Info */}
          <Card className="bg-gray-800 border-purple-500">
            <CardHeader>
              <CardTitle>Wallet Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {userInfo && (
                <div className="flex items-center mb-4">
                  {userInfo.avatar && (
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{userInfo.name}</p>
                    <p className="text-sm text-gray-400">{userInfo.email}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Address:</span>
                  <span className="font-mono">
                    {truncateAddress(address)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => copyToClipboard(address)}
                    >
                      📋
                    </Button>
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Network:</span>
                  <span>{chain?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span>Balance:</span>
                  <span>{balance} ETH</span>
                </div>
              </div>

              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={() => setOpen(true)}
                >
                  Open Wallet
                </Button>
              </div>

              {/* Token List */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Select Token for Analysis</h3>
                <div className="space-y-3">
                  {SUPPORTED_TOKENS.map((token) => (
                    <div
                      key={token.coingeckoId}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedToken === token.coingeckoId
                          ? 'bg-purple-900/40 border border-purple-500'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => handleTokenSelect(token.coingeckoId)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{token.name}</span>
                          <span className="ml-2 text-sm text-gray-400">
                            {token.symbol}
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - AI Analysis */}
          <Card className="bg-gray-800 border-purple-500">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>AI Analysis</CardTitle>
                {isLoadingMarket && (
                  <RefreshCcw className="h-5 w-5 animate-spin text-purple-500" />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-4" />
                  <p className="text-gray-400">Analyzing market data...</p>
                </div>
              ) : selectedToken && aiSuggestion ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">{aiSuggestion.token}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        aiSuggestion.action === 'Buy' ? 'bg-green-600' :
                        aiSuggestion.action === 'Sell' ? 'bg-red-600' :
                        'bg-blue-600'
                      }`}>
                        {aiSuggestion.action}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-300">{aiSuggestion.reason}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-400">Confidence</p>
                        <p className="font-semibold">{aiSuggestion.confidence}%</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-400">Risk Level</p>
                        <p className="font-semibold">{aiSuggestion.details.riskLevel}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-400">Time Frame</p>
                        <p className="font-semibold">{aiSuggestion.details.timeFrame}</p>
                      </div>
                      <div className="bg-gray-800 p-3 rounded">
                        <p className="text-sm text-gray-400">Potential Return</p>
                        <p className="font-semibold">{aiSuggestion.details.potentialReturn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <p>Select a token to see AI analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}