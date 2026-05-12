/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useSendTransaction, useBalance, useWaitForTransactionReceipt, useSwitchChain, useWriteContract } from 'wagmi';
import { ShoppingBag, Star, Zap, Check, ArrowRight, ShieldCheck, Gem, Wallet, RefreshCw, ArrowLeftRight, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { parseEther, parseUnits, erc20Abi } from 'viem';
import { toast } from 'sonner';
import { ARC_TESTNET, ARC_TOKENS } from '../constants';

import { ArcLogo } from './ArcLogo';

const PRODUCTS = [
  {
    id: 'arc-hoodie',
    name: 'Arc Genesis Hoodie',
    description: 'Premium heavyweight cotton blend with reflective Arc branding. Limited to 500 pieces.',
    price: 2.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Limited'],
    rating: 4.9,
    reviews: 128
  },
  {
    id: 'arc-metal-card',
    name: 'Obsidian Metal Card',
    description: 'Black brushed titanium card connecting your on-chain identity to the physical world.',
    price: 1.50,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop',
    tags: ['Hardware', 'NFC'],
    rating: 5.0,
    reviews: 42
  },
  {
    id: 'arc-pass',
    name: 'Early Access Pass',
    description: 'Digital asset granting beta access to upcoming Arc network features and airdrop multipliers.',
    price: 1.00,
    image: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop',
    tags: ['Digital', 'Utility'],
    rating: 4.8,
    reviews: 315
  },
  {
    id: 'arc-tshirt',
    name: 'Arc Protocol Tee',
    description: 'Ultra-soft eco-friendly cotton tee featuring the Arc protocol core architecture diagram.',
    price: 1.25,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Apparel'],
    rating: 4.7,
    reviews: 89
  },
  {
    id: 'arc-cap',
    name: 'Operator Cap',
    description: 'Low-profile tactical cap with a subtle embroidered Arc glyph. Adjustable fit.',
    price: 0.80,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Apparel'],
    rating: 4.6,
    reviews: 56
  },
  {
    id: 'arc-hardware-wallet',
    name: 'Cold Storage Vault',
    description: 'Military-grade hardware wallet pre-configured for the Arc Network natively.',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff0f?q=80&w=800&auto=format&fit=crop',
    tags: ['Hardware', 'Security'],
    rating: 5.0,
    reviews: 211
  },
  {
    id: 'arc-sticker-pack',
    name: 'Holo Sticker Pack',
    description: 'Set of 5 premium die-cut holographic stickers of Arc Network branding.',
    price: 0.50,
    image: 'https://images.unsplash.com/photo-1588666309990-d68f08e3d4a6?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Accessories'],
    rating: 4.5,
    reviews: 14
  },
  {
    id: 'arc-journal',
    name: 'Developer Journal',
    description: 'Premium dot-grid notebook with Arc embossed cover and lay-flat binding.',
    price: 2.50,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Office'],
    rating: 4.8,
    reviews: 62
  },
  {
    id: 'arc-coffee-mug',
    name: 'Matt Black Mug',
    description: 'Double-walled ceramic mug with stealth Arc logo for your late night coding sessions.',
    price: 0.90,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=800&auto=format&fit=crop',
    tags: ['Physical', 'Home'],
    rating: 4.6,
    reviews: 213
  },
  {
    id: 'arc-led-sign',
    name: 'Neon Node Sign',
    description: 'Custom molded LED neon sign featuring the Arc Protocol symbol. USB-C powered.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    tags: ['Hardware', 'Decor'],
    rating: 4.9,
    reviews: 45
  }
];

export default function Shop() {
  const { isConnected, address, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { data: arcBalance } = useBalance({ address, chainId: ARC_TESTNET.id });
  const { data: eurcBalance } = useBalance({ address, token: ARC_TOKENS.EURC as `0x${string}`, chainId: ARC_TESTNET.id });
  
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [paymentCurrency, setPaymentCurrency] = useState<'USDC' | 'EURC'>('USDC');
  
  const { sendTransaction, data: hash, isPending: isConfirming } = useSendTransaction();
  const { writeContractAsync, data: writeHash, isPending: isErc20Confirming } = useWriteContract();

  const currentHash = paymentCurrency === 'USDC' ? hash : writeHash;
  const { isLoading: isTxPending, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: currentHash });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txState, setTxState] = useState<'idle' | 'wallet' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (isErc20Confirming || isConfirming) {
      setTxState('wallet');
      setIsModalOpen(true);
    } else if (isTxPending) {
      setTxState('processing');
    } else if (isTxSuccess) {
      setTxState('success');
      // Auto close after 3s
      const t = setTimeout(() => {
        setIsModalOpen(false);
        setTxState('idle');
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [isErc20Confirming, isConfirming, isTxPending, isTxSuccess]);

  const isCorrectNetwork = chainId === ARC_TESTNET.id;

  const handleSwitchNetwork = () => {
    if (switchChain) {
      switchChain({ chainId: ARC_TESTNET.id });
    }
  };

  const currentPending = isConfirming || isErc20Confirming || isTxPending;

  const handleBuy = async (product: typeof PRODUCTS[0]) => {
    if (!isConnected) {
      toast.error('Connect your wallet to purchase');
      return;
    }
    
    // Check if we have enough balance
    const currentUSDC = parseFloat(arcBalance?.formatted || '0');
    const currentEURC = parseFloat(eurcBalance?.formatted || '0');
    
    if (paymentCurrency === 'USDC' && currentUSDC < product.price) {
      toast.error('Insufficient funds', { description: `You have ${currentUSDC.toFixed(2)} USDC, but need ${product.price} USDC.` });
      return;
    } else if (paymentCurrency === 'EURC' && currentEURC < product.price) {
      toast.error('Insufficient funds', { description: `You have ${currentEURC.toFixed(2)} EURC, but need ${product.price} EURC.` });
      return;
    }

    setSelectedProduct(product);
    
    // Send native USDC on Arc Testnet to the user's provided receiver address
    const merchantAddress = "0x7E4E1f7DcC3DA063F9110477Ad348C90E8599253" as `0x${string}`;
    
    try {
      if (paymentCurrency === 'USDC') {
        sendTransaction({
          to: merchantAddress,
          value: parseEther(product.price.toString()),
        }, {
          onSuccess: (txHash) => {
            // Toast will be shown or we just rely on modal
          },
          onError: (err) => {
            setTxState('error');
            toast.error('Transaction failed', { description: err.message.substring(0, 100) });
          }
        });
      } else {
        // EURC is an ERC20. Most fiat backed are 6 decimals.
        await writeContractAsync({
          address: ARC_TOKENS.EURC as `0x${string}`,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [merchantAddress, parseUnits(product.price.toString(), 6)],
        } as any, {
          onSuccess: (txHash) => {
             // Logic handled in effects
          },
          onError: (err) => {
             setTxState('error');
             toast.error('Transaction failed', { description: err.message.substring(0, 100) });
          }
        } as any);
      }
    } catch (err: any) {
      toast.error('Transaction error', { description: err.message });
      setSelectedProduct(null);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-12">
      {!isCorrectNetwork && isConnected ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-32 text-center"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 bg-[#020817] rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 border border-white/10 overflow-hidden p-6">
            <ArcLogo className="w-full h-full drop-shadow-xl" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-white">
            Switch to Arc Testnet
          </h2>
          <p className="text-muted-foreground max-w-sm mx-auto mb-10 text-sm md:text-base">
            To browse the shop and make purchases using native USDC, please switch your wallet to the Arc Testnet.
          </p>
          <Button 
            onClick={handleSwitchNetwork}
            className="px-8 py-6 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-all uppercase tracking-widest shadow-xl shadow-amber-500/20 text-lg"
          >
            Switch Network
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Shop Header showing Balance */}
          <div className="flex justify-between items-end pt-8">
        <div className="space-y-4">
          <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/10 text-primary mb-2 backdrop-blur-sm uppercase tracking-widest gap-2 font-bold text-[10px]">
            <Zap className="w-3 h-3" /> Arc Network Native Store
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/40">
            The <span className="text-primary border-b-[3px] border-primary pb-1">Origin</span> Collection
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed mix-blend-plus-lighter">
              Exclusive drops settled instantly on the Arc Network. No bridging, no swapping. Just seamless native payments.
            </p>
            {isConnected && (
              <div className="flex items-center gap-2 p-1.5 bg-secondary/40 rounded-full border border-border/50 backdrop-blur-sm">
                <button
                  onClick={() => setPaymentCurrency('USDC')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    paymentCurrency === 'USDC' 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  USDC
                </button>
                <div className="w-px h-4 bg-border"></div>
                <button
                  onClick={() => setPaymentCurrency('EURC')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                    paymentCurrency === 'EURC' 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  EURC
                </button>
              </div>
            )}
          </div>
        </div>
        
        {isConnected && (
          <div className="hidden md:flex flex-col items-end gap-2 bg-secondary/20 p-4 rounded-3xl border border-border/50">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] flex items-center gap-2">
              <Wallet className="w-3 h-3" /> {paymentCurrency} Balance
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-bold tracking-tighter">
                {paymentCurrency === 'USDC' 
                  ? (arcBalance?.formatted ? parseFloat(arcBalance.formatted).toFixed(2) : '0.00')
                  : (eurcBalance?.formatted ? parseFloat(eurcBalance.formatted).toFixed(2) : '0.00')}
              </span>
              <span className="text-primary font-bold">{paymentCurrency}</span>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PRODUCTS.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
            className="group"
          >
            <Card className="bg-card/40 backdrop-blur-xl border border-white/5 hover:bg-card/60 hover:border-primary/40 transition-all duration-500 overflow-hidden rounded-[2rem] group-hover:shadow-[0_0_60px_-15px_rgba(39,117,202,0.4)] group-hover:-translate-y-2 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none rounded-[2rem]" />
              <div className="relative h-72 overflow-hidden bg-muted/20">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10" />
                <motion.img 
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700"
                />
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  {product.tags.map(tag => (
                    <Badge key={tag} className="bg-background/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-background/90 border border-white/10 shadow-lg">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-8 relative z-20 -mt-16">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-black tracking-tight drop-shadow-md decoration-primary/50 group-hover:underline underline-offset-4">{product.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
                  <div className="flex items-center gap-1.5 bg-background/50 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/5">
                    <Star className="w-3 h-3 fill-primary text-primary" />
                    <span className="text-foreground">{product.rating}</span>
                  </div>
                      <span className="opacity-60">({product.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground/90 mb-8 min-h-[60px] leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between pb-2 border-t border-white/10 pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className={`text-4xl font-mono font-black tracking-tighter text-white transition-colors`}>{product.price.toFixed(2)}</span>
                      <span className={`font-bold text-sm transition-colors ${paymentCurrency === 'EURC' ? 'text-blue-500' : 'text-primary'}`}>{paymentCurrency}</span>
                    </div>
                  </div>
                  
                  <Button 
                     onClick={() => handleBuy(product)}
                     disabled={currentPending}
                     className={`text-white transition-all font-bold px-6 py-6 rounded-2xl group/btn hover:scale-105 active:scale-95 shadow-xl ${
                      paymentCurrency === 'EURC' 
                        ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20' 
                        : 'bg-white hover:bg-primary text-black hover:text-white shadow-primary/20'
                     }`}
                  >
                     {currentPending && selectedProduct?.id === product.id ? 'Processing...' : 
                      isTxSuccess && selectedProduct?.id === product.id ? 'Success!' :
                      <span className={`flex items-center gap-2 ${paymentCurrency === 'USDC' ? 'text-black group-hover/btn:text-white' : 'text-white'}`}>Buy Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></span>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-16 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        
        <div className="bg-card/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-card/50 transition-colors">
          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]">
            <ShieldCheck className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight mb-2 uppercase">On-Chain Settlement</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Transactions are settled instantly on the Arc Testnet. High speed, zero friction.</p>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-card/50 transition-colors mt-0 md:mt-8">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 shadow-[0_0_30px_-5px_rgba(39,117,202,0.3)]">
            <Check className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight mb-2 uppercase">Verified Authentic</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Every item includes a cryptographic certificate of authenticity linked to your wallet.</p>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-md border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center gap-4 hover:bg-card/50 transition-colors">
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
            <Gem className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h4 className="text-lg font-black tracking-tight mb-2 uppercase">Arc Exclusive</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">Limited edition drops available only within the Arc Network ecosystem.</p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-2xl border-border/50 shadow-2xl p-0 overflow-hidden">
          <div className="relative p-8 flex flex-col items-center text-center">
            {txState === 'wallet' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"></div>
                  <Wallet className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Confirm in Wallet</h3>
                <p className="text-muted-foreground text-sm">Please approve the transaction in your wallet to continue purchasing {selectedProduct?.name}.</p>
              </motion.div>
            )}
            
            {txState === 'processing' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-[spin_2s_linear_infinite]"></div>
                  <RefreshCw className="w-10 h-10 text-amber-500 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2">Processing on Arc</h3>
                <p className="text-muted-foreground text-sm">Your transaction is being settled on the Arc Testnet. This usually takes just a few seconds.</p>
                {currentHash && (
                  <div className="mt-4 p-3 bg-secondary/50 rounded-xl font-mono text-xs text-muted-foreground break-all border border-border/50">
                    {currentHash}
                  </div>
                )}
              </motion.div>
            )}

            {txState === 'success' && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                  >
                    <Check className="w-12 h-12 text-green-500" />
                  </motion.div>
                </div>
                <h3 className="text-3xl font-black tracking-tight mb-2 text-green-400">Payment Successful!</h3>
                <p className="text-muted-foreground text-base">You are now the proud owner of the <span className="font-bold text-white">{selectedProduct?.name}</span>.</p>
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-8 bg-green-500 hover:bg-green-400 text-black font-bold uppercase tracking-widest px-8"
                >
                  Continue Shopping
                </Button>
              </motion.div>
            )}

            {txState === 'error' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black tracking-tight mb-2 text-red-400">Transaction Failed</h3>
                <p className="text-muted-foreground text-sm">The payment could not be processed. Please try again or check your balance.</p>
                <Button 
                  onClick={() => setIsModalOpen(false)}
                  variant="outline"
                  className="mt-8 font-bold"
                >
                  Close
                </Button>
              </motion.div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
