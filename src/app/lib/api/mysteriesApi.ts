/**
 * Mysteries API Service
 * Handles loading mysterious locations and phenomena data
 */

export interface Mystery {
    id: string;
    title: string;
    description: string;
    fullDescription?: string;
    location: {
        name: string;
        lat: number;
        lng: number;
    };
    category: 'paranormal' | 'archaeological' | 'natural' | 'conspiracy' | 'ufo' | 'cryptid' | 'other';
    year?: number; // When it was first reported/discovered
    imageUrl?: string;
    sources?: Array<{
        title: string;
        url: string;
    }>;
}

/**
 * Fetch mysteries data
 * In a real application, this would be an API call to a backend service
 * For now, we'll simulate a fetch request with local data
 */
export async function fetchMysteries(
    category?: string,
    searchQuery?: string
): Promise<Mystery[]> {
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        // Load the data from a local JSON file
        const response = await fetch('/mysteries/data.json');

        if (!response.ok) {
            throw new Error(`Failed to load mysteries data: ${response.status}`);
        }

        const data: { mysteries: Mystery[] } = await response.json();
        let filteredMysteries = data.mysteries;

        // Filter by category if specified
        if (category) {
            filteredMysteries = filteredMysteries.filter(mystery =>
                mystery.category === category
            );
        }

        // Filter by search query if specified
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredMysteries = filteredMysteries.filter(mystery =>
                mystery.title.toLowerCase().includes(query) ||
                mystery.description.toLowerCase().includes(query) ||
                (mystery.fullDescription && mystery.fullDescription.toLowerCase().includes(query))
            );
        }

        return filteredMysteries;
    } catch (error) {
        console.error('Error fetching mysteries data:', error);
        return [];
    }
}

/**
 * Fetch a single mystery by ID
 */
export async function fetchMysteryById(id: string): Promise<Mystery | null> {
    try {
        const mysteries = await fetchMysteries();
        return mysteries.find(mystery => mystery.id === id) || null;
    } catch (error) {
        console.error(`Error fetching mystery with ID ${id}:`, error);
        return null;
    }
}

/**
 * Fetch mystery categories
 */
export async function fetchMysteryCategories(): Promise<{ id: string, name: string }[]> {
    return [
        { id: 'paranormal', name: 'Paranormal' },
        { id: 'archaeological', name: 'Archaeological' },
        { id: 'natural', name: 'Natural Phenomena' },
        { id: 'conspiracy', name: 'Conspiracies' },
        { id: 'ufo', name: 'UFO Sightings' },
        { id: 'cryptid', name: 'Cryptids' },
        { id: 'other', name: 'Other Mysteries' },
    ];
} 