export interface Location {
    lat: number;
    lng: number;
    name?: string;
    country?: string;
    region?: string;
}

export interface Article {
    id: string;
    title: string;
    content: string;
    source: string;
    url: string;
    date?: string;
    timestamp?: number;
    category?: string;
    showOnMap?: boolean;
    location?: Location;
    image?: string;
    keywords?: string[];
} 