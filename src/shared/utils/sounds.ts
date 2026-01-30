import type { SoundEffect } from "@/shared/types"

// Sound file paths
const SOUND_PATHS: Record<SoundEffect, string> = {
    start: '/sounds/start.mp3',
    success: '/sounds/success.mp3',
    error: '/sounds/error.mp3',
    levelup: '/sounds/levelup.mp3',
    achievement: '/sounds/achievement.mp3',
    countdown: '/sounds/countdown.mp3',
    perfect: '/sounds/perfect.mp3',
}

// Sound cache to avoid reloading
const soundCache = new Map<SoundEffect, HTMLAudioElement>()

// Preload a sound
function preloadSound(effect: SoundEffect): HTMLAudioElement {
    if (soundCache.has(effect)) {
        return soundCache.get(effect)!
    }

    const audio = new Audio(SOUND_PATHS[effect])
    audio.preload = 'auto'
    soundCache.set(effect, audio)
    return audio
}

// Preload all sounds (call this on app init)
export function preloadAllSounds(): void {
    if (typeof window === 'undefined') return

    Object.keys(SOUND_PATHS).forEach((effect) => {
        preloadSound(effect as SoundEffect)
    })
}

// Play a sound effect
export function playSound(effect: SoundEffect, volume: number = 0.5): void {
    if (typeof window === 'undefined') return

    try {
        const audio = preloadSound(effect)
        audio.volume = Math.max(0, Math.min(1, volume))

        // Clone the audio to allow overlapping sounds
        const clone = audio.cloneNode(true) as HTMLAudioElement
        clone.volume = audio.volume

        // Play and clean up
        clone.play().catch(err => {
            console.warn(`Failed to play sound: ${effect}`, err)
        })

        // Remove from memory after playing
        clone.addEventListener('ended', () => {
            clone.remove()
        })
    } catch (error) {
        console.warn(`Sound effect error: ${effect}`, error)
    }
}

// Countdown sequence (3, 2, 1, GO!)
export async function playCountdown(callback?: () => void): Promise<void> {
    return new Promise((resolve) => {
        let count = 3

        const interval = setInterval(() => {
            playSound('countdown', 0.7)
            count--

            if (count === 0) {
                clearInterval(interval)
                setTimeout(() => {
                    playSound('start', 0.8)
                    if (callback) callback()
                    resolve()
                }, 1000)
            }
        }, 1000)
    })
}

// Sound settings (can be stored in localStorage)
export interface SoundSettings {
    enabled: boolean
    volume: number
}

const DEFAULT_SETTINGS: SoundSettings = {
    enabled: true,
    volume: 0.5,
}

export function getSoundSettings(): SoundSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS

    try {
        const stored = localStorage.getItem('sound-settings')
        return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
    } catch {
        return DEFAULT_SETTINGS
    }
}

export function setSoundSettings(settings: Partial<SoundSettings>): void {
    if (typeof window === 'undefined') return

    const current = getSoundSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem('sound-settings', JSON.stringify(updated))
}
