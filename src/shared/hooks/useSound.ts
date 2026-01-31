"use client";

import { useEffect, useRef } from 'react';

// Preload audio files
const sounds = {
    start: '/sounds/start.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    countdown: '/sounds/countdown.mp3',
    perfect: '/sounds/perfect.mp3',
    levelup: '/sounds/levelup.mp3'
} as const;

type SoundName = keyof typeof sounds;

export function useSound() {
    const audioRefs = useRef<Record<SoundName, HTMLAudioElement | null>>({
        start: null,
        success: null,
        error: null,
        countdown: null,
        perfect: null,
        levelup: null
    });

    useEffect(() => {
        // Initialize audio objects
        Object.entries(sounds).forEach(([key, path]) => {
            const audio = new Audio(path);
            audio.preload = 'auto';
            audioRefs.current[key as SoundName] = audio;
        });
    }, []);

    const play = (name: SoundName) => {
        const audio = audioRefs.current[name];
        if (audio) {
            audio.currentTime = 0; // Reset to start
            audio.play().catch(err => {
                // Autoplay policy might block this if user hasn't interacted yet
                console.warn("Audio playback blocked", err);
            });
        }
    };

    return { play };
}
