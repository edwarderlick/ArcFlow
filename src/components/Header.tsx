/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount } from 'wagmi';
import { BadgeCheck, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArcLogo } from './ArcLogo';

export default function Header() {
  const { isConnected } = useAccount();
  const [username, setUsername] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isConnected) {
      const stored = localStorage.getItem('arc_shop_username');
      if (stored) {
        setUsername(stored);
      } else {
        setIsDialogOpen(true);
      }
    } else {
      setIsDialogOpen(false);
    }
  }, [isConnected]);

  const handleSaveUsername = () => {
    if (inputValue.trim()) {
      const cleanUsername = inputValue.trim().replace('@', '');
      localStorage.setItem('arc_shop_username', cleanUsername);
      setUsername(cleanUsername);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-20 border-b border-white/5 px-6 md:px-8 flex items-center justify-between bg-background/50 backdrop-blur-2xl sticky top-0 z-50 shrink-0"
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#020817] rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl shadow-primary/20 p-2.5">
             <ArcLogo className="w-full h-full drop-shadow-md" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-xl md:text-2xl font-black tracking-tight uppercase leading-none mt-1">Arc<span className="text-primary">Shop</span></span>
            <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em] mt-1">Native Store</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {isConnected && username && (
            <div 
              className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-secondary/20 rounded-2xl border border-white/5 cursor-pointer hover:bg-secondary/40 transition-colors backdrop-blur-md hover:border-primary/20"
              onClick={() => setIsDialogOpen(true)}
            >
              <Avatar className="w-9 h-9 border-2 border-primary/30 shadow-md">
                <AvatarImage src={`https://unavatar.io/twitter/${username}`} />
                <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold leading-none">@{username}</span>
                  <BadgeCheck className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1 opacity-80">Premium Member</span>
              </div>
              <Badge variant="outline" className="ml-2 bg-primary text-white border-none text-[9px] font-black tracking-widest h-5 px-2 uppercase shadow-lg shadow-primary/20">
                LVL 42
              </Badge>
            </div>
          )}
          <div className="scale-90 md:scale-100 origin-right">
            <ConnectButton 
              accountStatus="address"
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </motion.header>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        // If not open, but we have connected without a username, force it open
        if (!open && isConnected && !username) return;
        setIsDialogOpen(open);
      }}>
        <DialogContent 
          onInteractOutside={(e) => {
            if (!username) e.preventDefault();
          }}
          className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <Twitter className="w-6 h-6 text-blue-400" />
              Connect X Profile
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Link your X (Twitter) social profile to show your avatar and unlock early access perks on Arc.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 mt-2">
            <div className="flex items-center gap-4">
              <Input
                id="username"
                placeholder="elonmusk"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="col-span-3 text-lg py-6 font-medium"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            {username && (
               <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="font-bold">Cancel</Button>
            )}
            <Button onClick={handleSaveUsername} className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 rounded-xl shadow-lg shadow-primary/20">
              Save Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
