import { BrowserProvider, JsonRpcSigner, formatEther } from 'ethers';
import { useEthereum } from '@particle-network/authkit';

export class Web3Service {
  private static async getProvider() {
    const { provider } = useEthereum();
    return new BrowserProvider(provider as any);
  }

  private static async getSigner(): Promise<JsonRpcSigner> {
    const provider = await this.getProvider();
    return provider.getSigner();
  }

  public static async getBalance(address: string): Promise<string> {
    const provider = await this.getProvider();
    const balance = await provider.getBalance(address);
    return formatEther(balance);
  }

  public static async sendTransaction(to: string, amount: string) {
    const signer = await this.getSigner();
    const tx = await signer.sendTransaction({
      to,
      value: amount,
    });
    return tx.wait();
  }

  public static async signMessage(message: string): Promise<string> {
    const signer = await this.getSigner();
    return signer.signMessage(message);
  }
}