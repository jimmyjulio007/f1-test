"use client"

import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { RARITY_COLORS, RARITY_LABELS } from '@/shared/constants/achievements'
import type { Achievement } from '@/shared/types'
import { Lock, Trophy } from 'lucide-react'

interface AchievementCardProps {
    achievement: Achievement
    unlocked: boolean
    unlockedAt?: Date
    progress?: number
}

export function AchievementCard({ achievement, unlocked, unlockedAt, progress = 0 }: AchievementCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: unlocked ? 1.05 : 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                className={`p-4 relative overflow-hidden border-2 transition-all ${unlocked
                        ? `${RARITY_COLORS[achievement.rarity]} bg-gradient-to-br from-white/5 to-transparent`
                        : 'border-gray-700 bg-black/20 opacity-60'
                    }`}
            >
                {/* Rarity badge */}
                <div className="absolute top-2 right-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${unlocked ? RARITY_COLORS[achievement.rarity] : 'text-gray-500'
                        } bg-black/50`}>
                        {RARITY_LABELS[achievement.rarity]}
                    </span>
                </div>

                {/* Icon */}
                <div className="flex items-start gap-4 mb-3">
                    <div className={`text-4xl ${unlocked ? '' : 'grayscale opacity-40'}`}>
                        {achievement.icon}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                            {achievement.title}
                            {!unlocked && <Lock className="w-4 h-4 text-gray-500" />}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {achievement.description}
                        </p>
                    </div>
                </div>

                {/* Progress bar for locked achievements */}
                {!unlocked && progress > 0 && (
                    <div className="mt-3">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{progress}/{achievement.requirement}</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${(progress / achievement.requirement) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                )}

                {/* Unlock info */}
                {unlocked && unlockedAt && (
                    <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            Unlocked {new Date(unlockedAt).toLocaleDateString()}
                        </span>
                        <span className="text-primary font-bold">+{achievement.xpReward} XP</span>
                    </div>
                )}

                {/* XP reward for locked */}
                {!unlocked && (
                    <div className="mt-3 text-center">
                        <span className="text-xs text-muted-foreground">
                            Reward: <span className="text-primary font-bold">+{achievement.xpReward} XP</span>
                        </span>
                    </div>
                )}
            </Card>
        </motion.div>
    )
}
