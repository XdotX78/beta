# Gaia Explorer

## Overview
Gaia Explorer is an interactive web application that allows users to explore global news, historical events, and mysteries through interactive maps and informative blogs.

## Features
- Interactive maps showing real-time news events
- Historical timeline maps
- Mysteries and unexplained phenomena maps
- Comprehensive blogs about current events and historical mysteries

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: React-Leaflet

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development
Run the development server:
```bash
npm run dev
```
Or specify a custom port:
```bash
npx next dev -p 3500
```

### Environment Variables
The project uses environment variables for configuration. Create a `.env.local` file based on the `.env.example` template:

```bash
# Copy the example file
cp .env.example .env.local

# Then edit .env.local to add your API keys and configuration
```

Required API keys:
- OpenWeather API key: For weather data on maps
- News API key: For fetching real-time news
- MapBox token (optional): For enhanced map features

### Build
Create a production build:
```bash
npm run build
```

### Production
Start the production server:
```bash
npm start
```

### Testing
The project uses Jest and React Testing Library for testing. Run tests with:

```bash
# Run all tests
npm test

# Run tests in watch mode (good for development)
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

Test files are located next to the components they test in `__tests__` directories.

## Data Fetching Strategy

The application uses a structured approach to data fetching:

### API Services

API services are organized in `src/app/lib/api/` and follow these conventions:

- **News API**: Fetches real-time news data from external news sources using the News API
- **History API**: Loads historical event data from static JSON files
- **Mysteries API**: Provides data about mysterious locations and phenomena

### Environment Variables

API keys are managed through environment variables. Create a `.env.local` file based on the `.env.example` template.

### Caching Strategy

- News data is cached for 1 hour using `revalidate: 3600`
- Historical and mystery data is stored in static JSON files for faster loading

## Project Structure
```
/
├── public/             # Static assets
│   ├── images/         # Image assets
│   │   ├── enhanced/   # Enhanced images for the homepage
│   │   ├── blog/       # Blog-related images
│   │   ├── clouds/     # Background textures
│   │   └── authors/    # Author profile images
│   ├── icons/          # Icon assets
│   ├── textures/       # Texture files for effects
│   ├── leaflet/        # Map library assets
│   ├── historical/     # Historical event assets
│   └── fonts/          # Font files
├── src/
│   ├── app/            # App router pages and layouts
│   │   ├── components/ # Shared components
│   │   │   ├── home/   # Homepage components
│   │   │   ├── maps/   # Map-related components
│   │   │   ├── blogs/  # Blog-related components
│   │   │   ├── layout/ # Layout components
│   │   │   └── effects/# Visual effects components
│   │   ├── lib/        # Utility functions and helpers
│   │   ├── maps/       # Map-related pages
│   │   ├── blogs/      # Blog-related pages
│   │   ├── globals.css # Global CSS
│   │   ├── fonts.css   # Font definitions
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Homepage
├── .gitignore
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
This project is licensed under the MIT License.

## Asset Management

### Image Optimization
- All page images are stored in `/public/images/` with subdirectories for different sections
- Enhanced images for the homepage are in `/public/images/enhanced/`
- Use Next.js Image component with appropriate sizes for better performance:
  ```jsx
  import Image from 'next/image';
  
  <Image
    src="/images/enhanced/example.jpg"
    alt="Description"
    width={800}
    height={600}
    sizes="(max-width: 768px) 100vw, 50vw"
    quality={80}
  />
  ```

### Best Practices
- Compress images before adding to the repository (aim for <200KB for most images)
- Use WebP format where possible for better compression
- Don't commit duplicate images to different directories
- Use appropriate image sizes based on their usage (don't use 2000px wide images for 400px containers)
- For large assets, consider using a CDN and referencing via URL instead of storing in the repo

### Remote Images
The application is configured to support images from the following external sources:
- Unsplash
- Pexels
- Imgur

To add support for additional external domains, update the `remotePatterns` in `next.config.js`.

## News Scraping System

The application includes a sophisticated news scraping system that collects and categorizes global news from various sources, with a special focus on major global conflicts and important events.

### News Sources

News is collected from multiple sources through three different methods:
- **RSS Feeds**: Primary method for most news sites with structured feeds
- **HTTP Scraping**: Direct HTML scraping for simple sites that don't require JavaScript
- **Puppeteer**: For sites with dynamic JavaScript content that requires a browser to render

### Major Conflicts Coverage

The system includes dedicated tracking and display of major global conflicts:
- Ukraine War
- Gaza-Israel Conflict
- Sudan Civil War
- Myanmar Civil War
- Ethiopian Conflicts
- Taiwan Strait Tensions

Each conflict has:
- Dedicated keyword detection for article categorization
- Geographic coordinates for map display
- Custom display pages with filtered content

### News Categorization

Articles are automatically categorized into:
- Wars & Conflicts (⚔️)
- World Politics (📰)
- Economy (💹)
- Disasters & Crises (🌪️)
- Science & Technology (🧠)
- Planet & People (🌿)
- Culture & Curiosities (🎭)

### Map Integration

The news system integrates with the map components to:
- Display important news events geographically
- Highlight conflict zones
- Show the global distribution of different news categories

### Running the News Scraper

To update the news database:
```bash
npm run update-news
```

This will fetch the latest news from all configured sources and update the `public/news/data.json` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.
