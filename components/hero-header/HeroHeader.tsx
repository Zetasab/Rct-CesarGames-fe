"use client";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface GameItem {
    id: number;
    name: string;
    backgroundImage: string;
}

interface HeroHeaderProps {
    items: GameItem[];
}

const HeroHeader = ({ items }: HeroHeaderProps) => {
    const router = useRouter();
    const [offset, setOffset] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                setOffset(window.scrollY);
                ticking = false;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (items.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, 10000);

        return () => clearInterval(interval);
    }, [items.length]);

    const currentGame = items[currentIndex];

    if (!currentGame) return null;

    return (
        <div className="relative w-full h-[40vh] min-h-[300px] md:h-[60vh] md:min-h-[500px] overflow-hidden transition-all duration-1000">
            {/* Background Image */}
            <div 
                key={currentGame.id} 
                className="absolute inset-0 w-full h-full"
                style={{ transform: `translateY(${offset * 0.5}px)` }}
            >
                <Image
                    src={currentGame.backgroundImage} 
                    alt={`${currentGame.name} Hero Background`}
                    fill
                    className="object-cover object-top z-0"
                    priority
                    sizes="100vw"
                    quality={72}
                />
            </div>
            
            {/* Content Container - Optional: Add text/buttons here later */}
            <div className="absolute inset-0  z-21 flex flex-col justify-end items-start px-8 pb-12 md:px-16 md:pb-24 lg:px-24">
               <h1 className="text-2xl md:text-6xl font-bold text-white mb-2 md:mb-4 drop-shadow-lg transition-all duration-500">{currentGame.name}</h1>
               <button 
                   className="p-button font-bold hover:brightness-110 mt-2 md:mt-4 text-sm px-4 py-2 md:text-base md:px-6 md:py-3"
                   onClick={() => router.push(`/game/${currentGame.id}`)}
               >
                   Ver detalles
               </button>
            </div>

            {/* Gradient Overlay for Fade Effect */}
            {/* Creates a smooth transition from transparent to the #151515 background */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-[rgba(21,21,21,0.4)] to-[#151515]"></div>
        </div>
    );
};

export default HeroHeader;
