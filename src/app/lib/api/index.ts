// Re-export all API services
export * from './newsApi';
export * from './historyApi';
export * from './mysteriesApi';

// Export a common function to check if the API services are ready
export const checkApiServicesReady = async (): Promise<{
    ready: boolean;
    services: {
        news: boolean;
        history: boolean;
        mysteries: boolean;
    };
    missing: string[];
}> => {
    try {
        const missingServices: string[] = [];

        // Check news API
        try {
            const newsResponse = await fetch('/api/health/news');
            const newsStatus = await newsResponse.json();
            if (!newsStatus.ready) {
                missingServices.push('News API');
            }
        } catch (error) {
            missingServices.push('News API');
        }

        // Check historical data
        try {
            const historyResponse = await fetch('/historical/periods.json');
            if (!historyResponse.ok) {
                missingServices.push('Historical Data');
            }
        } catch (error) {
            missingServices.push('Historical Data');
        }

        // Check mysteries data
        try {
            const mysteriesResponse = await fetch('/mysteries/data.json');
            if (!mysteriesResponse.ok) {
                missingServices.push('Mysteries Data');
            }
        } catch (error) {
            missingServices.push('Mysteries Data');
        }

        return {
            ready: missingServices.length === 0,
            services: {
                news: !missingServices.includes('News API'),
                history: !missingServices.includes('Historical Data'),
                mysteries: !missingServices.includes('Mysteries Data'),
            },
            missing: missingServices,
        };
    } catch (error) {
        console.error('Error checking API services:', error);
        return {
            ready: false,
            services: {
                news: false,
                history: false,
                mysteries: false,
            },
            missing: ['Unable to check API services'],
        };
    }
}; 