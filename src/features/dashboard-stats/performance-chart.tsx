"use client"

import { useEffect, useState } from "react"
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { dbRequest } from "@/shared/lib/db";
import { authService } from "@/features/auth/model/auth-service";
import { calculatePerformanceMetrics, type PerformanceMetrics } from "@/shared/utils/performance";
import { CHART_CONFIG } from "@/shared/constants/app";

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

export function PerformanceRadar() {
    const [performance, setPerformance] = useState<PerformanceMetrics>({
        reaction: 0,
        accuracy: 0,
        consistency: 0,
        speed: 0,
        decision: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPerformanceData() {
            const user = authService.getCurrentUser()
            if (!user) {
                setLoading(false)
                return
            }

            try {
                const scores = await dbRequest.getUserScores(user.id)

                if (scores.length === 0) {
                    setLoading(false)
                    return
                }

                // Calculate all metrics using shared utility
                const metrics = calculatePerformanceMetrics(scores)
                setPerformance(metrics)
            } catch (error) {
                console.error("Failed to calculate performance:", error)
            } finally {
                setLoading(false)
            }
        }

        loadPerformanceData()
    }, [])

    const data = {
        labels: ['Reaction', 'Accuracy', 'Consistency', 'Speed', 'Decision'],
        datasets: [
            {
                label: 'Your Performance',
                data: [
                    performance.reaction,
                    performance.accuracy,
                    performance.consistency,
                    performance.speed,
                    performance.decision
                ],
                backgroundColor: 'rgba(0, 255, 148, 0.2)',
                borderColor: '#00ff94',
                borderWidth: 2,
                pointBackgroundColor: '#00ff94',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00ff94',
            },
        ],
    };

    const options = {
        scales: {
            r: {
                min: CHART_CONFIG.RADAR_MIN,
                max: CHART_CONFIG.RADAR_MAX,
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: '#a1a1aa',
                    font: {
                        size: 12
                    }
                },
                ticks: {
                    backdropColor: 'transparent',
                    display: false
                }
            },
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        return `${context.label}: ${context.parsed.r}/${CHART_CONFIG.RADAR_MAX}`
                    }
                }
            }
        },
        maintainAspectRatio: false,
    };

    if (loading) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-muted-foreground">Analyzing performance...</div>
            </div>
        )
    }

    if (performance.reaction === 0) {
        return (
            <div className="h-[300px] w-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p className="mb-2">No test data yet</p>
                    <p className="text-sm">Complete some tests to see your performance chart</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`h-[${CHART_CONFIG.CHART_HEIGHT}px] w-full flex items-center justify-center`}>
            <Radar data={data} options={options} />
        </div>
    );
}
