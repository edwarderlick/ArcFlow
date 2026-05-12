/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  type: 'send' | 'bridge' | 'swap';
  status: 'pending' | 'completed' | 'failed';
  fromChain: string;
  toChain?: string;
  amount: string;
  token: string;
  timestamp: number;
  hash: string;
}

export interface ChainBalance {
  chainId: number;
  chainName: string;
  amount: string;
  symbol: string;
  logoUrl?: string;
}

export interface UnifiedBalance {
  total: string;
  symbol: string;
  balances: ChainBalance[];
}
