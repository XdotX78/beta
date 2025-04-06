# HistoryMap Component Documentation

## Overview

The HistoryMap component is a complex interactive visualization that displays historical events on both a 3D globe (using Three.js) and a 2D map (using React-Leaflet). Users can explore different historical eras by using a timeline slider, and view historical events as markers on the globe/map.

## Key Features

- **3D Globe View**: Renders a detailed Earth globe with textures that change based on the selected time period
- **Timeline Control**: Slider to navigate through different historical time periods from 3000 BCE to 2000 CE
- **Era Filtering**: Filter historical events by era (Ancient, Classical, Medieval, Renaissance, Industrial, Modern)
- **Category Filtering**: Filter events by category (Political, Military, Cultural, Scientific, Religious)
- **Search Functionality**: Search for specific historical events by name or description
- **Event Details**: View detailed information about historical events as markers
- **Responsive Design**: Adapts to different screen sizes and devices

## Component Structure

The HistoryMap component follows a complex structure:

1. **State Management**:
   - `viewMode`: Switches between "globe" (3D) and "detail" (2D) views
   - `currentYear`: Tracks the currently selected year on the timeline
   - `selectedEra`/`selectedCategory`: Tracks filter selections
   - Map state variables for center and zoom levels

2. **Three.js Integration**:
   - Uses refs to manage the Three.js scene, camera, renderer, and controls
   - Custom animation loop for continuous globe rotation
   - Dynamic texture loading based on the selected time period

3. **Leaflet Integration**:
   - Uses React-Leaflet for 2D map view
   - Custom marker icons for different historical eras
   - Interactive popups for event details

4. **Data Handling**:
   - Filters historical events based on year, era, and category
   - Tracks active empires for the selected time period
   - Formats dates with BCE/CE notation

## Required Assets

### Texture Files (in `/public/textures/`)

- **Base Earth Textures**:
  - `earth_texture.jpg` - Default earth texture
  - `earth_normal.jpg` - Normal map for surface relief
  - `earth_specular.jpg` - Specular map for light reflection
  - `earth_clouds.jpg` - Cloud layer overlay

- **Era-Specific Earth Textures**:
  - `earth_ancient.jpg` - Ancient era (3000 BCE - 500 CE)
  - `earth_classical.jpg` - Classical era (800 BCE - 500 CE)
  - `earth_medieval.jpg` - Medieval era (500 CE - 1400 CE)
  - `earth_renaissance.jpg` - Renaissance era (1400 CE - 1700 CE)
  - `earth_industrial.jpg` - Industrial era (1700 CE - 1900 CE)
  - `earth_modern.jpg` - Modern era (1900 CE - present)

### Marker Icons (in `/public/icons/`)

- **Era-Specific Markers**:
  - `ancient-marker.png`
  - `classical-marker.png`
  - `medieval-marker.png`
  - `renaissance-marker.png`
  - `industrial-marker.png`
  - `modern-marker.png`

- **Category-Specific Markers**:
  - `marker-political.png`
  - `marker-military.png`
  - `marker-cultural.png`
  - `marker-scientific.png`
  - `marker-religious.png`

### Leaflet Required Assets (in `/public/leaflet/`)

- `marker-icon.png` - Default Leaflet marker icon
- `marker-shadow.png` - Shadow image for markers

## Implementation Details

### Globe Initialization

The 3D globe is initialized using Three.js in a useEffect hook that runs when the component mounts and when the viewMode is set to "globe". Key steps include:

1. Creating a scene, camera, and renderer
2. Setting up orbit controls for user interaction
3. Creating the globe mesh with appropriate materials and textures
4. Adding lighting (ambient and directional)
5. Setting up a starfield background
6. Implementing an animation loop for continuous rendering and globe rotation

### Timeline Control

The timeline slider allows users to explore different historical periods:

1. The slider range is set from -3000 (3000 BCE) to 2000 (2000 CE)
2. Historical eras are displayed as colored segments below the slider
3. The current year is displayed prominently on the globe
4. When the year changes:
   - The filtered events are updated
   - Active empires for that time period are shown
   - The globe texture may change based on the era

### Event Filtering

Events are filtered based on multiple criteria:

1. Timeline year (only shows events that occurred on or before the selected year)
2. Selected era (if specified)
3. Selected category (if specified)

### View Mode Switching

The component supports two view modes:

1. **Globe View** (3D): Shows the Earth as a globe with the current year displayed
2. **Detail View** (2D): Shows a traditional map with event markers and popups

### Performance Considerations

- The component uses `useLayoutEffect` to preload assets before rendering
- The globe is only initialized when in "globe" view mode
- A cleanup function properly disposes of Three.js resources when unmounting
- The globe scene and textures are cached to prevent unnecessary reinitialization

## Common Issues

1. **Missing Textures**: Check the browser console for 404 errors related to texture files
2. **Globe Not Rendering**: Ensure Three.js and its dependencies are properly installed
3. **High CPU/GPU Usage**: The 3D globe can be resource-intensive; consider optimizing texture sizes or rotation speed
4. **Missing Markers**: Check that marker icon files are in the correct location
5. **TypeScript Errors**: Install `@types/three` for Three.js type definitions

## Example Usage

The component is typically used in a page layout like this:

```tsx
// pages/maps/history/page.tsx
import dynamic from 'next/dynamic';
import LoadingSpinner from '../../components/LoadingSpinner';

// Use dynamic import to prevent server-side rendering issues with browser APIs
const HistoryMap = dynamic(
  () => import('../../components/maps/HistoryMap'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

export default function HistoryMapPage() {
  return (
    <div className="w-full h-[calc(100vh-64px)]">
      <HistoryMap />
    </div>
  );
}
```

## Future Development Plans

The following enhancements are planned for future iterations of the HistoryMap component:

### Timeline Interface Enhancements
- **Time Range Selector**: Allow users to select specific historical periods more intuitively
- **Timeline Scrubber**: Enhance the interactive slider with smoother transitions
- **Historical Eras Visualization**: Improve the color-coded bands representing different eras
- **Key Events Markers**: Add important events highlighted on the timeline as reference points
- **Era Shift Animations**: Create visual transitions when moving between major historical eras
- **Chronological Story Mode**: Add auto-play option that walks through history sequentially

### Map Visualization Improvements
- **Period-Appropriate Maps**: Enhance map styles to better represent different time periods
- **Historical Borders**: Implement dynamic political boundaries that change through time
- **Lost Civilizations**: Highlight regions of forgotten or collapsed civilizations
- **Empire Expansion/Contraction**: Create animated visualization of rising and falling empires
- **Event Clustering**: Improve grouping of nearby events when zoomed out
- **Connection Lines**: Show relationships between concurrent events across regions

### Content Organization
- **Multi-Layered History**: Enhance filtering options for military, cultural, scientific, political, and religious history
- **Primary vs Secondary Events**: Differentiate major events from contextual happenings
- **Local vs Global Significance**: Add toggle between world-changing events and regional history
- **Thematic Collections**: Develop curated journeys through specific historical themes
- **Historical Context Cards**: Implement brief summaries of the time period being viewed
- **Key Figures Database**: Add biographical information on historical figures

### Interactive Elements
- **Interactive Quizzes**: Add features to test knowledge about historical periods
- **Bookmark System**: Implement feature to save interesting events or periods for later reference
- **Personal Timeline**: Allow users to create custom timelines of events
- **Note-Taking Feature**: Add capability for personal observations to historical events
- **Share Specific Views**: Generate shareable links to specific historical snapshots

### Immersive Features
- **Period Music**: Add optional ambient sounds from the historical era being viewed
- **Weather Events**: Display major climate events that impacted history
- **Population Density Heatmap**: Visualize human migration and settlement patterns
- **Historical Quotes**: Display contemporaneous observations about events
- **Multiple Perspectives**: Show different cultural viewpoints on the same events
- **"On This Day" Feature**: Highlight events that occurred on the current calendar date

### Performance and Technical Improvements
- **Progressive Loading**: Load only events relevant to current time view
- **Region-Based Data Chunks**: Load geographical regions on demand
- **Pre-rendered Era Transitions**: Smooth animations between major historical periods
- **Client-Side Caching**: Remember recently viewed time periods
- **Cross-Reference with Mystery Map**: Link historical events to related mysteries
- **News Map Connections**: Show historical precedents for current events

## Future Enhancements

The following ideas represent potential future developments for the History Map component:

### Enhanced Timeline Features
- **Advanced Timeline Scrubber**: Add a more sophisticated timeline with playback controls to animate historical changes over time
- **Timeline Comparisons**: Allow users to compare two different historical periods side by side
- **Historical Trajectories**: Visualize the rise and fall of civilizations with animated paths and territory changes

### Educational Expansions
- **Guided Tours**: Narrated journeys through significant historical periods with expert commentary
- **Historical Scenarios**: "What if" alternative history explorations based on different historical decisions
- **Curriculum Integration**: Lesson plans and educational resources tied to historical events on the map

### Visualization Improvements
- **Empire Boundaries**: Animated territorial changes showing how empires expanded and contracted over time
- **Cultural Diffusion**: Visualize how ideas, technologies, and cultural practices spread across regions
- **Migration Patterns**: Show population movements, diaspora events, and nomadic paths throughout history
- **Trade Routes**: Historical trade networks and their evolution over time

### Technical Enhancements
- **AR Integration**: Allow users to "place" historical events and structures in their physical environment
- **3D Model Integration**: Include detailed 3D models of significant historical structures
- **Natural Disaster Overlay**: Show how environmental changes and natural disasters affected historical events
- **Primary Source Links**: Connect events to digitized historical documents and artifacts

### Interactive Learning
- **Historical Quests**: Gamified exploration challenges to discover connected historical events
- **Personal Timeline**: Allow users to see what was happening across the world during years significant to them
- **Comparative Analysis Tools**: Compare development trajectories of different civilizations with data visualizations
- **Expert Commentary**: Audio and video clips from historians providing context for major events

## Implementation Approach

Based on analysis of existing interactive historical mapping solutions, we're adopting a **hybrid approach** that combines:

- A 3D globe view for global patterns and major historical shifts
- A detailed 2D map view for regional history and specific events
- Seamless transitions between these perspectives based on zoom level

## References

- [GeoACron](http://geacron.com/home-en/) - Interactive World History Atlas with political boundary evolution
- [OpenHistoricalMap](https://www.openhistoricalmap.org) - OSM-based historical mapping project
- [Map Library: Approaches to Interactive Historical Maps](https://www.maplibrary.org/1304/approaches-to-interactive-historical-maps/) - Best practices for interactive historical mapping
- [UW Libraries: Maps and Timelines](https://guides.lib.uw.edu/research/tools/map_timeline) - Research tools for historical mapping

---

*This documentation will be updated as development of the HistoryMap component progresses.* 