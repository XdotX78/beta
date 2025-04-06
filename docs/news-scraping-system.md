# News Scraping System

This document explains the news scraping system implemented for the NewsMap component.

## Architecture

The system follows a layered approach:

1. **Data Collection**: Web scraper that extracts news from public news sources
2. **Data Processing**: Location detection, categorization, and importance ranking
3. **Data Storage**: JSON storage in the public directory
4. **Data Consumption**: React component that fetches and displays the data

## Components

### 1. News Scraper (`scripts/news-scraper.js`)

- Scrapes news from Reuters, BBC, and Al Jazeera
- Uses JSDOM to parse HTML content
- Extracts article titles, descriptions, and sources
- Processes text to detect locations and categorize news
- Generates a properly formatted JSON file

### 2. API Route (`src/app/api/news/route.ts`)

- Server-side API endpoint
- Returns processed news data with proper caching headers
- Falls back to static JSON if needed

### 3. NewsMap Component (`src/app/components/maps/NewsMap.tsx`)

- Fetches news from multiple sources with fallback strategy:
  1. First tries the API route
  2. Then tries the static JSON file
  3. Falls back to sample data if all else fails
- Displays news on an interactive map
- Provides filtering by category, region, and importance

## Location Detection

The system uses a dictionary-based approach to detect locations mentioned in news articles. Each location is mapped to:

- Latitude and longitude coordinates
- Geographic region

This allows news to be properly placed on the map and filtered by region.

## News Categorization

Articles are categorized into five types:

1. **Conflict**: Wars, attacks, military operations
2. **Politics**: Elections, government actions, diplomatic relations
3. **Disaster**: Natural disasters, accidents, emergencies
4. **Economy**: Financial news, markets, trade
5. **Social**: Health, education, environment, protests

Categories are determined by keyword matching in the article text.

## Importance Ranking

Each article is assigned an importance level:

- **High**: Breaking news, major events, crises
- **Medium**: Significant developments, updates
- **Low**: Regular news, minor developments

## Running the Scraper

To update the news data:

```bash
npm run update-news
```

This will scrape fresh news, process it, and save it to `public/news/data.json`.

## Scheduling

For automated updates, you can set up:

- A cron job on Linux/Mac
- A scheduled task on Windows

Examples are provided in `scripts/cron-schedule.txt`.

## Extending the System

To add more news sources:

1. Add a new entry to the `NEWS_SOURCES` array in `scripts/news-scraper.js`
2. Create a processor function for the new source
3. Update the location dictionary if needed

## Limitations

- Simple text-based location detection (no NLP/entity recognition)
- Limited to sources with consistent HTML structure
- No sentiment analysis or deeper content understanding 