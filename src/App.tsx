/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './lib/wagmi';
import Header from './components/Header';
import Shop from './components/Shop';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection-accent overflow-hidden font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto bg-background/50 relative px-6 pb-24">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}></div>
        
        <div className="relative z-10 w-full">
          <Shop />
        </div>
      </main>
      
      {/* Footer Bar */}
      <footer className="h-14 border-t border-white/10 bg-background/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 relative z-50">
        <div className="flex gap-6 items-center">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Network: <span className="text-primary ml-1">Arc Testnet</span></span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold hidden sm:inline border-l border-white/10 pl-6">Gas: <span className="text-foreground ml-1">Native USDC</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <a 
            href="https://x.com/SamirAhame96036" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-muted-foreground hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center gap-1 border-r border-white/10 pr-4 mr-1"
          >
            Built by @SamirAhame96036
          </a>
          <span className="text-[10px] text-muted-foreground font-mono font-bold tracking-widest uppercase">v1.2.0-SHOP</span>
          <div className="flex gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(39,117,202,0.8)]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-75 shadow-[0_0_8px_rgba(39,117,202,0.8)]"></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-150 shadow-[0_0_8px_rgba(39,117,202,0.8)]"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#ffffff',
          accentColorForeground: '#000000',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}>
          <Dashboard />
          <Toaster position="bottom-right" theme="dark" closeButton />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
