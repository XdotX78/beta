/**
 * History API Service
 * Handles loading historical event data
 */

export interface HistoricalEvent {
    id: string;
    title: string;
    description: string;
    year: number;
    month?: number;
    day?: number;
    location: {
        name: string;
        lat: number;
        lng: number;
    };
    category: 'politics' | 'science' | 'war' | 'culture' | 'discovery' | 'other';
    imageUrl?: string;
    sourceUrl?: string;
}

export interface HistoricalPeriod {
    id: string;
    name: string;
    startYear: number;
    endYear: number;
    events: HistoricalEvent[];
}

/**
 * Fetch historical events data
 * In a real application, this would be an API call to a backend service
 * For now, we'll simulate a fetch request with local data
 */
export async function fetchHistoricalEvents(
    period?: string,
    category?: string
): Promise<HistoricalEvent[]> {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Load the data from a local JSON file
        const response = await fetch('/historical/events.json');

        if (!response.ok) {
            throw new Error(`Failed to load historical data: ${response.status}`);
        }

        const data = await response.json();

        // Filter by period if specified
        let filteredEvents = data.events;

        if (period) {
            const periodData = data.periods.find((p: HistoricalPeriod) => p.id === period);
            if (periodData) {
                filteredEvents = filteredEvents.filter((event: HistoricalEvent) =>
                    event.year >= periodData.startYear && event.year <= periodData.endYear
                );
            }
        }

        // Filter by category if specified
        if (category) {
            filteredEvents = filteredEvents.filter((event: HistoricalEvent) =>
                event.category === category
            );
        }

        return filteredEvents;
    } catch (error) {
        console.error('Error fetching historical data:', error);
        return [];
    }
}

/**
 * Fetch historical periods
 */
export async function fetchHistoricalPeriods(): Promise<HistoricalPeriod[]> {
    try {
        // Load the data from a local JSON file
        const response = await fetch('/historical/periods.json');

        if (!response.ok) {
            throw new Error(`Failed to load historical periods: ${response.status}`);
        }

        const data = await response.json();
        return data.periods;
    } catch (error) {
        console.error('Error fetching historical periods:', error);
        return [];
    }
} 