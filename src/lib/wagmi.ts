/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { ARC_TESTNET } from '../constants';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID || '044601f65212393083ed23f69e64e525';

export const config = getDefaultConfig({
  appName: 'ArcShop',
  projectId,
  chains: [
    {
      ...ARC_TESTNET,
      iconUrl: "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' rx='20' fill='%23020817' /%3E%3Cpath d='M 20 80 C 20 35 38 20 50 20 C 62 20 80 35 80 80' stroke='white' stroke-width='22' stroke-linecap='butt' /%3E%3Cpath d='M 35 60 L 80 66 V 80 C 80 80 60 78 35 75 Z' fill='%23cbd5e1' /%3E%3C/svg%3E",
      iconBackground: '#020817'
    } as any,
    mainnet,
    sepolia,
  ],
  ssr: true,
});
