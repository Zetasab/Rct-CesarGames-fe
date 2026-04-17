'use client';

import React from 'react';
import { ADMIN_SOCIAL_LINKS } from './social-links-data';

interface SocialLinksProps {
    showLabels?: boolean;
    compact?: boolean;
    className?: string;
    size?: 'normal' | 'small';
}

export default function SocialLinks({ showLabels = true, compact = false, className = '', size = 'normal' }: SocialLinksProps) {
    const buttonSizeClasses = size === 'small'
        ? 'px-2 py-1.5 text-xs gap-1.5'
        : 'px-3 py-2 text-sm gap-2';
    const iconSizeClasses = size === 'small' ? 'text-xs' : 'text-sm';

    return (
        <div className={`flex ${compact ? 'flex-row' : 'flex-col'} gap-2 ${className}`}>
            {ADMIN_SOCIAL_LINKS.map((social) => (
                <a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center rounded-md border border-[#ff4200]/50 text-[#ff4200] hover:bg-[#ff4200] hover:text-white transition-colors ${buttonSizeClasses}`}
                    aria-label={social.label}
                >
                    <i className={`${social.iconClass} ${iconSizeClasses}`} aria-hidden="true" />
                    {showLabels && <span>{social.label}</span>}
                </a>
            ))}
        </div>
    );
}