'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useScrollDirection } from '../hooks';
import { cn } from '@/lib/utils';

interface FloatingWhatsAppProps {
    phoneNumber: string;
    message?: string;
}

export function FloatingWhatsApp({ phoneNumber, message = 'Hi Dusstech! I have a question.' }: FloatingWhatsAppProps) {
    const { direction, scrollY } = useScrollDirection();
    const isVisible = scrollY > 200 && direction !== 'down';

    const href = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                        'fixed bottom-6 left-6 z-40',
                        'flex h-14 w-14 items-center justify-center rounded-full',
                        'bg-[#25D366] text-white shadow-lg',
                        'hover:shadow-xl transition-shadow'
                    )}
                >
                    <MessageCircle className="h-6 w-6" fill="currentColor" />
                    {/* Pulse ring */}
                    <motion.span
                        className="absolute inset-0 rounded-full bg-[#25D366]"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        aria-hidden
                    />
                </motion.a>
            )}
        </AnimatePresence>
    );
}