/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { type Chain } from 'viem';

export const ARC_TESTNET: Chain = {
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.arc.network'] },
  },
  blockExplorers: {
    default: { name: 'ArcScan', url: 'https://explorer.testnet.arc.network' },
  },
  testnet: true,
};

export const SUPPORTED_CHAINS = [
  ARC_TESTNET,
];

export const TOKENS = {
  USDC: 'USDC',
  EURC: 'EURC',
};

export const ARC_TOKENS = {
  USDC: '0x1c7D4B196Cb0232bE14839Cae3C597Def00E678d', // Native gas token on Arc Testnet, also Circle Sepolia USDC
  EURC: '0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a', // Arc Testnet EURC provided by user
};
