import { toast } from 'sonner'
import { playSound } from './sounds'
import type { SoundEffect } from '@/shared/types'

interface NotificationOptions {
    title: string
    description?: string
    duration?: number
    sound?: SoundEffect
    icon?: string
}

// Success notification with sound
export function showSuccess(options: NotificationOptions) {
    const { title, description, duration = 3000, sound = 'success', icon } = options

    if (sound) playSound(sound, 0.5)

    toast.success(title, {
        description,
        duration,
        icon,
    })
}

// Error notification with sound
export function showError(options: NotificationOptions) {
    const { title, description, duration = 3000, sound = 'error', icon } = options

    if (sound) playSound(sound, 0.6)

    toast.error(title, {
        description,
        duration,
        icon,
    })
}

// Achievement notification with special styling
export function showAchievement(title: string, description: string, icon: string = '🏆', xp: number = 0) {
    playSound('achievement', 0.7)

    toast.success(title, {
        description: `${description} ${xp > 0 ? `+${xp} XP` : ''}`,
        duration: 5000,
        icon,
        className: 'achievement-toast',
    })
}

// Level up notification
export function showLevelUp(newLevel: number, rank: string) {
    playSound('levelup', 0.8)

    toast.success(`Level ${newLevel}!`, {
        description: `You've reached ${rank} rank!`,
        duration: 5000,
        icon: '📈',
        className: 'levelup-toast',
    })
}

// XP gained notification
export function showXPGained(xp: number, reason?: string) {
    toast.success(`+${xp} XP`, {
        description: reason,
        duration: 2000,
        icon: '⭐',
    })
}

// Daily challenge completed
export function showDailyChallengeComplete(xp: number) {
    playSound('perfect', 0.7)

    toast.success('Daily Challenge Complete!', {
        description: `Earned ${xp} XP bonus!`,
        duration: 4000,
        icon: '🎯',
    })
}

// Streak notification
export function showStreakUpdate(days: number, isNew: boolean = true) {
    if (isNew && days > 1) {
        playSound('success', 0.5)
    }

    toast.success(`${days} Day Streak! 🔥`, {
        description: 'Keep it up! Come back tomorrow!',
        duration: 3000,
    })
}

// Personal best notification
export function showPersonalBest(value: string) {
    playSound('perfect', 0.6)

    toast.success('New Personal Best!', {
        description: value,
        duration: 4000,
        icon: '🏆',
    })
}

// Info notification
export function showInfo(title: string, description?: string) {
    toast.info(title, {
        description,
        duration: 3000,
    })
}
