'use client';

import { useSearchParams } from 'next/navigation';
import DetailedGame from '@/features/detailed-game/DetailedGame';

export default function GamePage() {
    const searchParams = useSearchParams();
    const slug = (searchParams.get('slug') || '').trim();

    if (!slug) {
        return (
            <div className="flex justify-center items-center h-screen text-white bg-[#151515]">
                Falta el parametro slug
            </div>
        );
    }

    return <DetailedGame gameSlug={slug} />;
}
