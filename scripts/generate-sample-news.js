const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Get current timestamp in milliseconds
const getCurrentTimestamp = () => {
    return Date.now();
};

// Generate a random timestamp within the last 7 days
const getRandomRecentTimestamp = () => {
    const now = getCurrentTimestamp();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    return Math.floor(Math.random() * (now - oneWeekAgo) + oneWeekAgo);
};

// Generate a short ID from a title
const generateId = (title) => {
    return crypto.createHash('md5').update(title).digest('hex').substring(0, 10);
};

// Sample data for each conflict
const conflictSampleData = {
    ukraine: {
        titles: [
            "Russian forces advance in eastern Ukraine as ammunition shortage hits defenders",
            "Ukraine strikes Russian oil depot in major cross-border attack",
            "Zelensky appeals for more Western air defense systems amid increased bombardment",
            "NATO countries pledge $5 billion in additional military aid for Ukraine",
            "Ukraine's new mobilization law takes effect amid controversy"
        ],
        contents: [
            "Ukrainian forces are facing ammunition shortages as Russian troops make incremental gains in the Donetsk region. Military analysts report that Russian forces have advanced up to 3 kilometers in some areas over the past week.",
            "Ukraine launched a major drone strike against a Russian oil refinery in Rostov region, causing significant damage to fuel storage facilities. Russia has vowed to retaliate against what it called 'terrorist actions'.",
            "President Volodymyr Zelensky has issued an urgent appeal to Western allies for additional air defense systems as Russia increases its bombing campaign against Ukrainian infrastructure.",
            "NATO member countries have announced a new $5 billion military aid package for Ukraine, including artillery shells, anti-tank weapons, and advanced radar systems to counter Russian air superiority.",
            "Ukraine's controversial new mobilization law has come into effect, lowering the draft age from 27 to 25 and introducing stricter penalties for evading military service."
        ],
        location: { lat: 49.4871968, lng: 31.2718321, name: "Ukraine", country: "Ukraine" }
    },
    palestine: {
        titles: [
            "Israeli forces advance deeper into Rafah despite international pressure",
            "Humanitarian crisis worsens as aid deliveries to Gaza plummet",
            "Ceasefire talks stall again as Hamas and Israel reject new proposals",
            "Protesters worldwide demand end to Gaza conflict as death toll rises",
            "UN agencies warn of 'catastrophic' famine conditions across Gaza Strip"
        ],
        contents: [
            "Israeli military forces have pushed further into eastern Rafah despite international calls for restraint, with officials stating they are targeting Hamas infrastructure while trying to minimize civilian casualties.",
            "The delivery of humanitarian aid to Gaza has decreased by 80% since the Rafah crossing operations were disrupted, leaving hundreds of thousands without access to essential supplies, according to the UN Office for Humanitarian Affairs.",
            "The latest round of ceasefire negotiations in Cairo has ended without agreement as both Hamas and Israel rejected compromises on key issues including prisoner exchanges and military withdrawal from certain areas.",
            "Hundreds of thousands of protesters in major cities worldwide called for an immediate ceasefire in Gaza as Palestinian health authorities reported the death toll has surpassed 35,000 since the conflict began in October.",
            "The World Food Programme and other UN agencies have issued an urgent warning that 'catastrophic' famine conditions now exist across much of the Gaza Strip, with children particularly vulnerable to malnutrition and disease."
        ],
        location: { lat: 31.5, lng: 34.45, name: "Gaza Strip", country: "Palestine" }
    },
    sudan: {
        titles: [
            "Fighting intensifies in Darfur as Sudan's civil war shows no signs of abating",
            "Millions displaced as Sudan's humanitarian crisis reaches 'apocalyptic' levels",
            "Sudan's warring generals reject peace initiative despite diplomatic pressure",
            "Civilian massacres reported in El Fasher as RSF tightens control",
            "UN peacekeeping mission proposed amid escalating ethnic violence in Sudan"
        ],
        contents: [
            "Heavy fighting has erupted again between the Sudanese Armed Forces (SAF) and the Rapid Support Forces (RSF) in the Darfur region, with both sides claiming control of strategic areas while civilian casualties continue to mount.",
            "The number of internally displaced people in Sudan has reached 9 million, with another 1.7 million refugees fleeing to neighboring countries as humanitarian organizations describe conditions as 'apocalyptic'.",
            "Generals Abdel Fattah al-Burhan and Mohamed Hamdan Dagalo have rejected the latest peace initiative proposed by the African Union, despite growing diplomatic pressure from regional and international powers.",
            "Human rights groups have reported mass killings of civilians in El Fasher, the last major city in Darfur not fully controlled by the RSF, as fighting for control of the strategic location intensifies.",
            "The United Nations Security Council is considering a proposal for a peacekeeping mission in Sudan as reports of ethnically motivated violence increase, particularly in the western regions of the country."
        ],
        location: { lat: 15.5007, lng: 32.5599, name: "Khartoum", country: "Sudan" }
    },
    myanmar: {
        titles: [
            "Rebel alliance captures major Myanmar city as junta forces retreat",
            "Myanmar's shadow government gains international recognition amid military setbacks",
            "Humanitarian crisis deepens as fighting displaces thousands in Myanmar's Shan State",
            "Myanmar junta increases airstrikes against civilian areas in desperate response",
            "Evidence of war crimes mounts as Myanmar's civil war intensifies"
        ],
        contents: [
            "A coalition of ethnic armed organizations and pro-democracy forces has captured a major city in northern Myanmar, marking one of the most significant military setbacks for the ruling junta since the 2021 coup.",
            "Several countries have begun formal diplomatic engagement with Myanmar's National Unity Government (NUG) as the military regime faces increasing territorial losses and international isolation.",
            "UN agencies report that over 50,000 people have been newly displaced in Myanmar's Shan State as fighting between the military and resistance forces intensifies, creating severe shortages of food and medicine.",
            "Myanmar's military junta has dramatically increased airstrikes against civilian areas in regions controlled by resistance forces, with human rights organizations documenting dozens of attacks on schools, hospitals, and residential areas.",
            "A UN fact-finding mission has collected substantial evidence of war crimes and crimes against humanity committed by Myanmar military forces, including systematic torture, extrajudicial killings, and the deliberate targeting of civilians."
        ],
        location: { lat: 21.9162, lng: 95.956, name: "Myanmar", country: "Myanmar" }
    },
    ethiopia: {
        titles: [
            "Fighting erupts in Ethiopia's Amhara region as new rebel group emerges",
            "Drought and conflict create 'perfect storm' in Ethiopia's Tigray region",
            "Ethiopia's fragile peace deal threatened by resurgence of violence",
            "Mass detention of civilians reported in Ethiopia's restive regions",
            "Ethiopia's economic crisis deepens amid ongoing regional conflicts"
        ],
        contents: [
            "A new armed group calling itself the 'Amhara Defense Forces' has emerged in Ethiopia's second-largest region, clashing with federal troops and threatening the country's already fragile stability.",
            "The combination of severe drought and lingering effects of the civil war has created what aid agencies are calling a 'perfect storm' of humanitarian crisis in Ethiopia's Tigray region, with millions facing food insecurity.",
            "The peace agreement that ended Ethiopia's devastating civil war is under increasing strain as reports of violations by both government forces and Tigrayan fighters continue to emerge.",
            "Human rights organizations have documented the mass detention of civilians in Ethiopia's Oromia and Amhara regions, with thousands reportedly held without charges in military camps.",
            "Ethiopia's economy is facing severe challenges as regional conflicts continue to disrupt agriculture, trade, and foreign investment, with inflation reaching its highest level in a decade."
        ],
        location: { lat: 9.145, lng: 40.4897, name: "Ethiopia", country: "Ethiopia" }
    },
    taiwan: {
        titles: [
            "China conducts largest military drills around Taiwan in recent years",
            "Taiwan increases defense budget amid growing cross-strait tensions",
            "US approves $1.8 billion arms sale to Taiwan despite Chinese protests",
            "Taiwan reports record number of Chinese military aircraft incursions",
            "Diplomatic tensions rise as more countries strengthen ties with Taiwan"
        ],
        contents: [
            "China has launched its largest military exercises around Taiwan in recent years, including live-fire drills and simulated blockade operations that Taiwanese officials described as 'preparation for invasion'.",
            "Taiwan's parliament has approved a record defense budget of $19 billion for the coming year, representing the island's largest military spending increase in decades amid growing threats from China.",
            "The United States has approved a $1.8 billion arms sale to Taiwan, including missile systems and reconnaissance sensors, prompting strong protests from Beijing and threats of sanctions against American defense contractors.",
            "Taiwan's Ministry of Defense reported that a record 103 Chinese military aircraft entered its air defense identification zone in a 24-hour period, calling the incursions a 'deliberate escalation of cross-strait tensions'.",
            "Several European and Asian countries have strengthened unofficial ties with Taiwan through trade agreements and diplomatic visits, despite increasing pressure from Beijing to isolate the self-governing island."
        ],
        location: { lat: 23.6978, lng: 120.9605, name: "Taiwan", country: "Taiwan" }
    }
};

// Generate a sample article
const generateArticle = (category, index) => {
    const conflict = conflictSampleData[category];

    // Use index to select title and content, cycling through available options
    const titleIndex = index % conflict.titles.length;
    const title = conflict.titles[titleIndex];
    const content = conflict.contents[titleIndex];

    const timestamp = getRandomRecentTimestamp();
    const date = new Date(timestamp).toISOString();

    return {
        id: generateId(title),
        title,
        content,
        source: `Sample ${category.charAt(0).toUpperCase() + category.slice(1)} News`,
        url: `https://example.com/news/${category}/${Date.now()}`,
        date,
        timestamp,
        category: 'wars',
        showOnMap: true,
        location: conflict.location
    };
};

// General news samples for other categories
const generalNewsSamples = [
    {
        category: 'economy',
        titles: [
            "Global markets tumble as recession fears grow",
            "Central banks coordinate interest rate hikes to combat inflation",
            "Oil prices surge amid Middle East tensions and supply concerns",
            "Tech sector faces major layoffs as investment slows",
            "International trade disrupted by shipping crisis in Red Sea"
        ],
        contents: [
            "Stock markets worldwide experienced significant drops as new economic data suggests a higher probability of recession in major economies.",
            "Central banks from seven major economies announced coordinated interest rate increases in an unprecedented effort to combat persistent inflation.",
            "Oil prices have jumped to $95 per barrel amid growing tensions in the Middle East and concerns about supply disruptions in key shipping routes.",
            "Major technology companies have announced a combined 35,000 layoffs as investment in the sector slows and pressure for profitability increases.",
            "International shipping costs have doubled as vessels avoid the Red Sea route due to ongoing attacks, causing significant disruption to global trade."
        ],
        locations: [
            { lat: 40.7128, lng: -74.0060, name: "New York", country: "USA" },
            { lat: 51.5074, lng: -0.1278, name: "London", country: "UK" },
            { lat: 25.2048, lng: 55.2708, name: "Dubai", country: "UAE" },
            { lat: 37.7749, lng: -122.4194, name: "San Francisco", country: "USA" },
            { lat: 29.9511, lng: 32.5503, name: "Suez Canal", country: "Egypt" }
        ]
    },
    {
        category: 'disaster',
        titles: [
            "Massive earthquake strikes coastal region, triggering tsunami warnings",
            "Hurricane approaches southeastern coastline with record wind speeds",
            "Devastating floods displace thousands as rivers overflow",
            "Wildfire spreads rapidly across drought-stricken forest region",
            "Volcanic eruption forces evacuation of nearby communities"
        ],
        contents: [
            "A 7.8 magnitude earthquake has struck the coastal region, triggering tsunami warnings across multiple countries and causing significant damage to infrastructure.",
            "Meteorologists are warning that the approaching hurricane could be the strongest to hit the region in decades, with sustained winds exceeding 150 mph.",
            "Record rainfall has caused catastrophic flooding, with multiple rivers overflowing their banks and forcing thousands of residents to evacuate to higher ground.",
            "A massive wildfire has already consumed over 50,000 acres of forest and is spreading rapidly due to strong winds and exceptionally dry conditions after months of drought.",
            "The volcano began erupting in the early morning hours, sending ash clouds 15,000 feet into the atmosphere and forcing the evacuation of communities within a 20-mile radius."
        ],
        locations: [
            { lat: -33.8688, lng: 151.2093, name: "Sydney Region", country: "Australia" },
            { lat: 25.7617, lng: -80.1918, name: "Miami", country: "USA" },
            { lat: 23.8103, lng: 90.4125, name: "Dhaka", country: "Bangladesh" },
            { lat: 39.5501, lng: -119.8483, name: "Nevada", country: "USA" },
            { lat: -8.4095, lng: 115.1889, name: "Bali", country: "Indonesia" }
        ]
    },
    {
        category: 'world-politics',
        titles: [
            "UN Security Council deadlocked over resolution on regional conflict",
            "Mass protests erupt in capital following disputed election results",
            "Leaders of world's largest economies gather for G20 summit",
            "Constitutional crisis deepens as court rules against government",
            "Regional alliance announces expansion with three new member states"
        ],
        contents: [
            "The United Nations Security Council failed to pass a resolution addressing the regional conflict after two permanent members exercised their veto power.",
            "Hundreds of thousands of protesters have filled the streets of the capital for the third consecutive day, demanding a recount following contested election results.",
            "Leaders from the G20 nations have gathered for their annual summit with climate change, global economic instability, and regional conflicts topping the agenda.",
            "The country's highest court has ruled that recent government actions violated the constitution, triggering a political crisis as the administration refuses to acknowledge the ruling.",
            "The regional security alliance has formally invited three additional countries to join, significantly expanding its geographical reach and military capabilities."
        ],
        locations: [
            { lat: 40.7128, lng: -74.0060, name: "United Nations", country: "USA" },
            { lat: -34.6037, lng: -58.3816, name: "Buenos Aires", country: "Argentina" },
            { lat: 41.9028, lng: 12.4964, name: "Rome", country: "Italy" },
            { lat: -15.7801, lng: -47.9292, name: "Brasilia", country: "Brazil" },
            { lat: 50.8503, lng: 4.3517, name: "Brussels", country: "Belgium" }
        ]
    }
];

// Generate a general news article
const generateGeneralArticle = (categoryInfo, index) => {
    // Use index to select title and content, cycling through available options
    const titleIndex = index % categoryInfo.titles.length;
    const title = categoryInfo.titles[titleIndex];
    const content = categoryInfo.contents[titleIndex];
    const location = categoryInfo.locations[titleIndex];

    const timestamp = getRandomRecentTimestamp();
    const date = new Date(timestamp).toISOString();

    return {
        id: generateId(title),
        title,
        content,
        source: `Sample ${categoryInfo.category.charAt(0).toUpperCase() + categoryInfo.category.slice(1)} News`,
        url: `https://example.com/news/${categoryInfo.category}/${Date.now()}`,
        date,
        timestamp,
        category: categoryInfo.category,
        showOnMap: categoryInfo.category === 'disaster' ? true : Math.random() > 0.5,
        location
    };
};

// Generate sample articles
const generateSampleArticles = (count = 50) => {
    const articles = [];

    // Generate conflict articles (at least 60% of total)
    const conflictCategories = Object.keys(conflictSampleData);
    const conflictCount = Math.max(Math.floor(count * 0.6), conflictCategories.length);

    // Ensure at least one article per conflict
    conflictCategories.forEach((category, i) => {
        articles.push(generateArticle(category, i));
    });

    // Add more conflict articles distributed evenly
    for (let i = conflictCategories.length; i < conflictCount; i++) {
        const category = conflictCategories[i % conflictCategories.length];
        articles.push(generateArticle(category, i));
    }

    // Generate general news articles for the remaining count
    const remainingCount = count - conflictCount;
    if (remainingCount > 0) {
        for (let i = 0; i < remainingCount; i++) {
            const categoryInfo = generalNewsSamples[i % generalNewsSamples.length];
            articles.push(generateGeneralArticle(categoryInfo, i));
        }
    }

    // Sort by timestamp (newest first)
    return articles.sort((a, b) => b.timestamp - a.timestamp);
};

// Generate sample news with guaranteed valid coordinates
async function generateSampleNews() {
    const sampleNews = [
        // Economy news
        {
            id: "econ1",
            title: "US Federal Reserve considers interest rate cuts",
            content: "The Federal Reserve is evaluating potential interest rate cuts as inflation shows signs of cooling.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 38.8951,
                lng: -77.0364
            },
            type: "economy",
            region: "north_america"
        },
        {
            id: "econ2",
            title: "European markets react to US tariff announcements",
            content: "European markets showed volatility following announcements of new US tariffs on imported goods.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 50.8503,
                lng: 4.3517
            },
            type: "economy",
            region: "western_europe"
        },
        {
            id: "econ3",
            title: "China's economic growth exceeds expectations",
            content: "China reported stronger than expected GDP growth for the quarter, surprising analysts.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 39.9042,
                lng: 116.4074
            },
            type: "economy",
            region: "east_asia"
        },

        // Ukraine conflict
        {
            id: "ukr1",
            title: "Ukraine reports advances in eastern territories",
            content: "Ukrainian forces have made tactical advances in eastern territories according to military sources.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 49.4871,
                lng: 31.2718
            },
            type: "conflict",
            region: "eastern_europe"
        },
        {
            id: "ukr2",
            title: "Russia mobilizes additional troops near border",
            content: "Russian military has reportedly mobilized additional troops near the Ukrainian border.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 55.7558,
                lng: 37.6173
            },
            type: "conflict",
            region: "eastern_europe"
        },

        // Gaza/Palestine
        {
            id: "gaz1",
            title: "Aid convoy reaches northern Gaza",
            content: "Humanitarian aid convoy successfully delivered supplies to northern Gaza communities.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 31.5017,
                lng: 34.4668
            },
            type: "conflict",
            region: "middle_east"
        },
        {
            id: "gaz2",
            title: "UN calls for immediate ceasefire in Gaza",
            content: "United Nations Security Council issued statement calling for immediate ceasefire.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 31.5017,
                lng: 34.4668
            },
            type: "conflict",
            region: "middle_east"
        },
        {
            id: "pal1",
            title: "West Bank tensions rise after settlement expansion",
            content: "Tensions increased in the West Bank following announcement of settlement expansion.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 31.9474,
                lng: 35.3027
            },
            type: "conflict",
            region: "middle_east"
        },

        // Taiwan
        {
            id: "twn1",
            title: "Taiwan conducts military exercises amid rising tensions",
            content: "Taiwan's military conducted scheduled exercises as regional tensions continue.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 23.6978,
                lng: 120.9605
            },
            type: "conflict",
            region: "east_asia"
        },
        {
            id: "twn2",
            title: "China increases naval presence in Taiwan Strait",
            content: "Chinese naval vessels increased presence in the Taiwan Strait according to defense ministry.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 24.4801,
                lng: 118.3737
            },
            type: "conflict",
            region: "east_asia"
        },

        // Politics
        {
            id: "pol1",
            title: "US presidential candidates gear up for debate",
            content: "Presidential candidates finalize preparations for upcoming televised debate.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 38.9072,
                lng: -77.0369
            },
            type: "politics",
            region: "north_america"
        },
        {
            id: "pol2",
            title: "UK parliament approves controversial new legislation",
            content: "British parliament approved new legislation despite significant opposition.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 51.4975,
                lng: -0.1357
            },
            type: "politics",
            region: "western_europe"
        },

        // Disaster
        {
            id: "dis1",
            title: "Typhoon approaches Philippines eastern coast",
            content: "Powerful typhoon approaching the eastern coast of the Philippines prompts evacuations.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 14.5995,
                lng: 120.9842
            },
            type: "disaster",
            region: "southeast_asia"
        },
        {
            id: "dis2",
            title: "Earthquake in Turkey causes minimal damage",
            content: "Moderate earthquake struck Turkey's western region causing minimal damage and no reported casualties.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 38.9637,
                lng: 35.2433
            },
            type: "disaster",
            region: "middle_east"
        },

        // Myanmar (to test our fix)
        {
            id: "mya1",
            title: "Myanmar military increases presence in northern regions",
            content: "Myanmar's military has reportedly increased presence in northern regions amid ongoing conflict.",
            source: "Sample News",
            date: new Date().toISOString(),
            timestamp: Date.now(),
            location: {
                lat: 19.7633,
                lng: 96.0785
            },
            type: "conflict",
            region: "southeast_asia"
        }
    ];

    // Write to sample file
    const outputPath = path.join(__dirname, '../public/news/data.json');
    await fs.writeFile(outputPath, JSON.stringify(sampleNews, null, 2));
    console.log(`Successfully wrote ${sampleNews.length} sample news events to ${outputPath}`);
}

// Run the generator
generateSampleNews().catch(err => {
    console.error("Error generating sample news:", err);
    process.exit(1);
});

module.exports = {
    generateSampleArticles
}; 