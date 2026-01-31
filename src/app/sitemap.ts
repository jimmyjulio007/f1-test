import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://f1-test-nine.vercel.app' // Replace with actual domain

    const routes = [
        '',
        '/dashboard',
        '/leaderboard',
        '/achievements',
        '/multiplayer',
        '/training',
        '/tests/reaction',
        '/tests/decision',
        '/tests/f1',
        '/tests/sequence',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    return routes
}
