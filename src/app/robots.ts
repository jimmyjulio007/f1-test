import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://neurodrive-f1.com' // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/api/'], // Standard disallows
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
