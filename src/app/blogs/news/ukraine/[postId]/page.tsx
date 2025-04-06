"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaShare, FaTwitter, FaFacebook, FaLinkedin, FaPrint, FaTags, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample Ukraine posts data - in a real application this would come from a database or API
const ukrainePosts = [
  {
    id: "1",
    title: "Major Breakthrough: Peace Talks Progress as Sides Agree to Comprehensive Negotiation Framework",
    excerpt: "Ukrainian and Russian negotiators have reached preliminary agreement on key discussion points for future peace negotiations...",
    content: `
      <p>Ukrainian and Russian negotiators have reached preliminary agreement on key discussion points for future peace negotiations, marking a significant step forward in diplomatic efforts to end the conflict that has persisted since February 2022.</p>
      
      <p>The breakthrough came during the fifth round of preparatory talks hosted by Switzerland, where representatives agreed on a structured agenda addressing territorial integrity, security guarantees, and gradual withdrawal of forces.</p>
      
      <p><strong>Update (March 5, 2025):</strong> Following the initial announcement, both Ukrainian and Russian officials have confirmed that the first formal round of negotiations will begin on March 20 in Geneva, with additional technical teams meeting earlier to prepare detailed documentation on each agenda item.</p>
      
      <h2>Key Framework Elements</h2>
      
      <p>According to diplomatic sources close to the negotiations, the framework consists of seven main discussion areas that will form the basis for substantive peace talks scheduled to begin next month:</p>
      
      <ol>
        <li>Security arrangements and demilitarized zones</li>
        <li>Phased withdrawal of forces from contested areas</li>
        <li>Constitutional arrangements for regions with special status</li>
        <li>International guarantees and monitoring mechanisms</li>
        <li>Economic recovery and reconstruction funding</li>
        <li>Restoration of civilian infrastructure</li>
        <li>Transitional justice and accountability measures</li>
      </ol>
      
      <p>"This framework provides the structure needed to move into substantive negotiations," said Swiss Foreign Minister Alain Berset, who has been facilitating the talks. "While significant differences remain on the details within each area, agreeing on the agenda itself is an important milestone."</p>
      
      <h2>Cautious Optimism</h2>
      
      <p>Both Ukrainian and Russian officials have expressed cautious optimism about the development, though each side has been careful to manage public expectations.</p>
      
      <p>"We view this as progress, but we remain realistic about the challenges ahead," said Andriy Yermak, head of the Ukrainian presidential administration. "Ukraine's position on territorial integrity and sovereignty remains unchanged and non-negotiable."</p>
      
      <p>Russian Foreign Ministry spokesperson Maria Zakharova characterized the framework as "a positive step" but emphasized that "implementation will depend on Ukraine's willingness to acknowledge certain realities on the ground."</p>
      
      <h2>International Reaction</h2>
      
      <p>The announcement has been welcomed by international partners, with the United Nations Secretary-General António Guterres calling it "a much-needed ray of hope in a conflict that has caused immense suffering."</p>
      
      <p>European Union foreign policy chief Josep Borrell described the development as "encouraging" while emphasizing that any sustainable peace must respect Ukraine's sovereignty and territorial integrity within its internationally recognized borders.</p>
      
      <p>U.S. Secretary of State Antony Blinken said the framework represents "a potentially significant diplomatic opening" but stressed that the United States would continue supporting Ukraine "for as long as it takes to achieve a just and durable peace."</p>
      
      <h2>Military Situation</h2>
      
      <p>The diplomatic progress comes against a backdrop of relative stalemate along the front lines in eastern Ukraine, where neither side has made significant territorial gains in recent months despite continued fighting.</p>
      
      <p>Military analysts suggest the battlefield situation may have contributed to both sides' willingness to engage more seriously in diplomatic efforts.</p>
      
      <p>"We're seeing conflict fatigue on both sides," said Dr. Elena Korosteleva, Professor of International Politics at the University of Kent. "The human and economic costs of sustaining this conflict indefinitely have become increasingly difficult to justify domestically for both countries."</p>
      
      <h2>Next Steps</h2>
      
      <p>Preparations are now underway for the first round of formal peace negotiations, scheduled to take place in Geneva on March 15. The talks will involve higher-level officials from both countries and will build on the agreed framework.</p>
      
      <p>Diplomatic sources indicate that the initial phase of negotiations is expected to last several weeks, with follow-up sessions planned if progress is made.</p>
      
      <p>Civil society organizations have urged negotiators to ensure that humanitarian concerns, including prisoner exchanges and civilian protection, remain priorities regardless of progress on other fronts.</p>
    `,
    imageUrl: "/images/blog/ukraine-peace-talks.jpg",
    category: "diplomacy",
    author: "Natalia Kovalenko",
    authorTitle: "Eastern Europe Correspondent",
    authorBio: "Natalia Kovalenko has covered Eastern European politics for over fifteen years, with particular expertise in Ukraine-Russia relations and conflict resolution processes.",
    authorImageUrl: "/images/authors/natalia-kovalenko.jpg",
    date: "February 25, 2025",
    readTime: "5 min read",
    location: "Zurich",
    featured: true,
    tags: ["peace talks", "diplomacy", "negotiations", "conflict resolution"],
    relatedPosts: ["2", "4", "7"]
  },
  {
    id: "2",
    title: "Russian Forces Begin Partial Withdrawal from Eastern Territories",
    excerpt: "Military observers confirm the withdrawal of Russian heavy artillery and armor from key positions in eastern Ukraine...",
    content: `
      <p>Military observers from the Organization for Security and Cooperation in Europe (OSCE) have confirmed the withdrawal of Russian heavy artillery and armor from key positions in eastern Ukraine, a move described as the most significant military de-escalation since the conflict began.</p>
      
      <p>Satellite imagery and ground reports verified by OSCE monitors show the removal of multiple rocket launcher systems, self-propelled artillery, and main battle tanks from forward positions near Avdiivka, Bakhmut, and Vuhledar.</p>
      
      <h2>Verification Process</h2>
      
      <p>International monitoring teams have been granted expanded access to verify the withdrawals, working alongside Ukrainian military observers in a carefully structured verification protocol established during recent talks.</p>
      
      <p>"Our teams have documented the removal of approximately 30% of heavy weapons systems from these sectors," said General Magnus Petersen, head of the OSCE Special Monitoring Mission. "The withdrawal appears systematic and corresponds with the commitments outlined in the preliminary disengagement agreement."</p>
      
      <p>Independent analysts using commercial satellite imagery have corroborated these findings, noting significant reductions in military hardware visible at forward bases and assembly areas.</p>
      
      <h2>Diplomatic Context</h2>
      
      <p>The withdrawals come two weeks after both sides agreed to implement "confidence-building measures" as part of preparations for substantive peace negotiations scheduled to begin next month.</p>
      
      <p>While Russian officials have characterized the move as a gesture of goodwill to facilitate diplomacy, Ukrainian authorities have been more cautious in their assessment, describing it as a "tactical repositioning" that requires continued verification.</p>
      
      <p>"We welcome any reduction in offensive capabilities along the front line," said Ukrainian Defense Minister Oleksii Reznikov. "However, we remain vigilant and continue to monitor these movements closely. True de-escalation must be irreversible and comprehensive."</p>
      
      <h2>Military Implications</h2>
      
      <p>Military analysts suggest the withdrawal significantly reduces the immediate threat of large-scale offensive operations in the eastern sectors, though substantial forces remain within striking distance.</p>
      
      <p>"This is a meaningful reduction in forward-deployed heavy weapons, but not a complete withdrawal of combat capability," explained Colonel (Ret.) Mykhailo Samus, Director of the New Geopolitics Research Network. "Russian forces maintain significant reserves in rear areas that could be redeployed if political conditions change."</p>
      
      <p>Ukrainian forces have maintained their defensive positions but have reportedly adjusted their posture to reflect the reduced threat level, including scaling back certain counter-battery operations.</p>
      
      <h2>Civilian Impact</h2>
      
      <p>The reduction in heavy weapons has already resulted in a marked decrease in artillery exchanges, bringing relief to civilians in frontline communities who have endured years of shelling.</p>
      
      <p>In Chasiv Yar, a town that has seen some of the most intense artillery duels, residents reported the first night without explosions in over a year.</p>
      
      <p>"We still hear distant sounds sometimes, but nothing like before," said Iryna Bondarenko, a resident who has refused to evacuate despite the dangers. "For the first time, I'm allowing myself to think about rebuilding rather than just surviving."</p>
      
      <h2>Next Steps</h2>
      
      <p>According to the preliminary agreement, the current withdrawals represent the first phase of a potential three-stage disengagement plan. Further withdrawals would be contingent on the progress of peace negotiations and continued adherence to ceasefire provisions.</p>
      
      <p>International partners, including the United States and European Union, have welcomed the development while emphasizing the need for continued verification and monitoring.</p>
      
      <p>"This represents a potentially significant step toward de-escalation," said NATO Secretary General Mark Rutte. "However, a sustainable peace will require good faith implementation of all agreed measures and genuine progress in resolving the underlying issues that led to conflict."</p>
    `,
    imageUrl: "/images/blog/russian-withdrawal.jpg",
    category: "military",
    author: "Viktor Petrov",
    authorTitle: "Defense Analyst",
    authorBio: "Viktor Petrov specializes in military affairs and security policy in Eastern Europe, with particular focus on military strategy and conflict dynamics in the Ukraine-Russia war.",
    authorImageUrl: "/images/authors/viktor-petrov.jpg",
    date: "February 20, 2025",
    readTime: "6 min read",
    location: "Kyiv",
    featured: true,
    tags: ["military withdrawal", "de-escalation", "eastern ukraine", "OSCE"],
    relatedPosts: ["1", "3", "5"]
  },
  {
    id: "3",
    title: "EU Announces €5 Billion Package for Ukrainian Energy Infrastructure",
    excerpt: "The European Commission has approved an emergency funding package to repair and reinforce Ukraine's power grid ahead of next winter...",
    imageUrl: "/images/blog/ukraine-energy.jpg",
    category: "infrastructure",
    author: "Martin Schulz",
    date: "February 18, 2025",
    readTime: "4 min read",
    location: "Brussels",
    featured: false,
    tags: ["energy", "infrastructure", "European Union", "reconstruction"],
    relatedPosts: ["6", "10", "11"]
  },
  {
    id: "4",
    title: "Humanitarian Corridors Established for Civilian Evacuation in Donbas",
    excerpt: "Joint agreement allows for temporary civilian passage from conflict-affected areas under international monitoring...",
    imageUrl: "/images/blog/ukraine-corridors.jpg",
    category: "humanitarian",
    author: "Sophia Kovalchuk",
    date: "February 15, 2025",
    readTime: "5 min read",
    location: "Kramatorsk",
    featured: false,
    tags: ["humanitarian corridors", "civilian evacuation", "Donbas", "Red Cross"],
    relatedPosts: ["7", "9", "12"]
  },
  {
    id: "5",
    title: "Ukrainian Forces Successfully Deploy New Air Defense Systems",
    excerpt: "Western-supplied air defense platforms have significantly reduced the effectiveness of Russian missile attacks...",
    imageUrl: "/images/blog/ukraine-air-defense.jpg",
    category: "military",
    author: "Ivan Shevchenko",
    date: "February 12, 2025",
    readTime: "4 min read",
    location: "Dnipro",
    featured: false,
    tags: ["air defense", "military technology", "missile defense", "western aid"],
    relatedPosts: ["2", "8", "10"]
  },
  {
    id: "6",
    title: "Agricultural Exports from Ukraine Hit Post-Invasion High",
    excerpt: "Black Sea shipping lanes fully operational as grain and sunflower oil exports reach pre-war levels...",
    imageUrl: "/images/blog/ukraine-agriculture.jpg",
    category: "economy",
    author: "Olena Bondarenko",
    date: "February 8, 2025",
    readTime: "4 min read",
    location: "Odesa",
    featured: false,
    tags: ["agriculture", "exports", "economy", "Black Sea"],
    relatedPosts: ["3", "10", "12"]
  },
  {
    id: "7",
    title: "Joint Demining Operations Begin in Southern Ukraine",
    excerpt: "International teams support Ukrainian efforts to clear explosive remnants of war from agricultural and residential areas...",
    imageUrl: "/images/blog/ukraine-demining.jpg",
    category: "reconstruction",
    author: "Dmitry Kovalev",
    date: "February 5, 2025",
    readTime: "4 min read",
    location: "Kherson",
    featured: false,
    tags: ["demining", "explosive ordnance", "reconstruction", "international aid"],
    relatedPosts: ["4", "9", "11"]
  },
  {
    id: "8",
    title: "Ukraine's Historical Context: From Kyivan Rus to Modern Nation",
    excerpt: "Understanding the complex historical forces that shaped Ukraine helps illuminate the current conflict and the nation's struggle for sovereignty...",
    content: `
      <p class="lead">Ukraine's rich and complex history spans over a millennium, from the powerful medieval state of Kyivan Rus to its emergence as a modern independent nation. This historical context is essential for understanding the current conflict and the deep-rooted forces that continue to shape Ukraine's national identity and geopolitical challenges.</p>
      
      <h2>Kyivan Rus: The Shared Medieval Origin (9th-13th Centuries)</h2>
      
      <p>Ukraine's historical narrative begins with Kyivan Rus, an Eastern Slavic state founded in the late 9th century with its capital in Kyiv. This powerful medieval federation, ruled by the Rurikid dynasty, became a cultural and political center in Eastern Europe, adopting Orthodox Christianity in 988 under Prince Volodymyr the Great.</p>
      
      <p>Kyivan Rus represented the common ancestral state for modern Ukraine, Russia, and Belarus, though each nation interprets this shared heritage differently. For Ukrainians, Kyiv's position as the original political and cultural capital underscores their claim to an independent historical identity predating Moscow's rise. This competing historical narrative about Kyivan Rus's legacy remains a source of tension in contemporary Ukrainian-Russian relations.</p>
      
      <h2>Foreign Domination and the Cossack Era (14th-18th Centuries)</h2>
      
      <p>After Kyivan Rus's collapse following the Mongol invasion in the 13th century, Ukrainian territories came under the control of various powers, including the Grand Duchy of Lithuania and later the Polish-Lithuanian Commonwealth. This period saw the emergence of the Ukrainian Cossacks, semi-autonomous military communities that established the Zaporizhian Sich, a proto-state that would play a crucial role in Ukrainian historical identity.</p>
      
      <p>In 1654, seeking protection against Polish rule, Cossack Hetman Bohdan Khmelnytsky signed the Treaty of Pereyaslav with Muscovy (later the Russian Empire). While initially conceived as a military alliance, this agreement was later reinterpreted by Russian rulers as Ukraine's submission to Moscow, beginning centuries of Russian imperial control over much of Ukrainian territory.</p>
      
      <blockquote>
        "The history of Ukrainian statehood is not a straight line but rather a series of attempts, moments of independence, and long periods of foreign domination that have nonetheless preserved a distinct Ukrainian cultural and national identity."
        <cite>— Dr. Yaroslav Hrytsak, Ukrainian Historian</cite>
      </blockquote>
      
      <h2>Imperial Rule and National Revival (19th-Early 20th Centuries)</h2>
      
      <p>By the late 18th century, Ukrainian lands were divided primarily between the Russian and Austrian (later Austro-Hungarian) empires. Under Russian imperial rule, Ukrainian language and cultural expression faced severe restrictions, including the Valuev Circular (1863) and Ems Ukase (1876), which limited the publication and teaching of Ukrainian.</p>
      
      <p>Despite these challenges, the 19th century witnessed a Ukrainian national revival, with intellectuals like Taras Shevchenko, Ivan Franko, and Lesya Ukrainka developing modern Ukrainian literature and articulating visions of national identity. This cultural renaissance laid the intellectual groundwork for future independence movements.</p>
      
      <h2>Brief Independence and Soviet Era (1917-1991)</h2>
      
      <p>The collapse of the Russian Empire in 1917 created a brief window for Ukrainian independence. The Ukrainian People's Republic declared independence in January 1918, but this young state was soon crushed between multiple forces: the Russian Bolsheviks, White Russian forces, and Polish armies. By 1922, most of Ukraine was incorporated into the Soviet Union as the Ukrainian Soviet Socialist Republic.</p>
      
      <p>The Soviet period brought modernization and industrialization but also tremendous suffering. The Holodomor, a man-made famine in 1932-1933 engineered by Stalin's policies, killed millions of Ukrainians and is now recognized by many countries as genocide. This trauma, along with Stalinist purges of Ukrainian intellectuals and forced Russification, deepened Ukrainian resistance to outside control.</p>
      
      <p>Western Ukrainian territories, which had been under Polish and later Nazi occupation, were annexed to Soviet Ukraine after World War II, bringing all major Ukrainian ethnic territories under a single political entity for the first time in centuries—albeit under Soviet control.</p>
      
      <h2>Independence and Nation-Building (1991-2013)</h2>
      
      <p>Ukraine declared independence in August 1991 amid the Soviet Union's collapse, confirmed by an overwhelming majority in a December referendum. The newly independent state faced enormous challenges: building democratic institutions, transitioning from a command economy, and forging a unified national identity among regions with different historical experiences and linguistic practices.</p>
      
      <p>The post-Soviet period was marked by economic hardship, corruption, and a delicate balancing act between Russia and the West. The Orange Revolution in 2004-2005, triggered by electoral fraud, represented a pivotal moment when Ukrainians mobilized to defend democratic principles and pursue closer ties with Europe.</p>
      
      <h2>Euromaidan, Annexation, and War (2013-Present)</h2>
      
      <p>In late 2013, President Viktor Yanukovych's decision to abandon an Association Agreement with the European Union in favor of closer ties with Russia sparked massive protests known as Euromaidan or the Revolution of Dignity. These demonstrations evolved into a broader movement against corruption and for democratic reforms, culminating in Yanukovych's ouster in February 2014.</p>
      
      <p>Russia responded by annexing Crimea in March 2014 and supporting separatist movements in eastern Ukraine's Donbas region, leading to a protracted conflict. This Russian aggression intensified in February 2022 with a full-scale invasion that has devastated Ukrainian cities, displaced millions, and fundamentally altered European security architecture.</p>
      
      <h2>Historical Narratives and the Current Conflict</h2>
      
      <p>The ongoing war has deep historical dimensions. Russian President Vladimir Putin has explicitly denied Ukraine's historical legitimacy as an independent nation, claiming it is an artificial creation and naturally part of the Russian sphere. This narrative directly challenges Ukraine's understanding of its historical development as a distinct nation with its own cultural traditions and right to self-determination.</p>
      
      <p>For Ukrainians, the current struggle represents the latest chapter in a centuries-long fight for national sovereignty. References to historical figures like the Cossacks appear in contemporary Ukrainian military symbols, while the country's diverse historical experience—including periods under Polish, Lithuanian, Austrian, and Ottoman influence—underscores Ukraine's multiethnic, multicultural European identity distinct from Russia.</p>
      
      <h2>Conclusion: History as a Battleground</h2>
      
      <p>Ukraine's complex history reveals a nation that has persisted despite centuries of foreign domination, with a distinct cultural identity that transcended long periods without independent statehood. This history is not merely academic—it actively shapes current events, with competing historical narratives serving as powerful tools in the information war accompanying the physical conflict.</p>
      
      <p>Understanding Ukraine's historical journey provides crucial context for the current crisis. The nation's struggle for sovereignty represents not a recent geopolitical development but the continuation of a centuries-long process of national formation, interrupted repeatedly by more powerful neighbors but never extinguished.</p>
      
      <p>As Ukraine defends its independence today, it does so with a profound awareness of this historical context, fighting not only for its present sovereignty but for its right to interpret its own past and determine its future path.</p>
    `,
    imageUrl: "/images/blog/ukraine-history.jpg",
    category: "historical",
    author: "xdotdx",
    authorTitle: "Professor of Eastern European History",
    authorBio: "xdotdx specializes in Ukrainian and Eastern European history at the Ukrainian Institute of Historical Research. He has published extensively on the formation of national identity in post-Soviet states and the historical relations between Ukraine and Russia.",
    authorImageUrl: "/images/authors/mikhail-hrushevsky.jpg",
    date: "March 2, 2025",
    readTime: "10 min read",
    location: "Kyiv",
    featured: true,
    tags: ["ukrainian history", "kyivan rus", "national identity", "historical context", "sovereignty"],
    relatedPosts: ["1", "2", "7"]
  }
];

// Category labels map
const categoryLabels: Record<string, {label: string, color: string}> = {
  diplomacy: { label: "Diplomacy", color: "bg-blue-700" },
  military: { label: "Military", color: "bg-red-700" },
  infrastructure: { label: "Infrastructure", color: "bg-yellow-700" },
  humanitarian: { label: "Humanitarian", color: "bg-green-700" },
  economy: { label: "Economy", color: "bg-purple-700" },
  reconstruction: { label: "Reconstruction", color: "bg-indigo-700" },
  historical: { label: "Historical", color: "bg-pink-700" }
};

export default function UkrainePostPage() {
  // Using traditional params access for now, but with a comment about future migration
  // TODO: Update to use React.use(params) when TypeScript types are properly aligned
  const params = useParams();
  const postId = params?.postId as string;
  
  // Find the post with the matching ID
  const post = ukrainePosts.find(p => p.id === postId);
  
  // If no post found, return 404
  if (!post) {
    notFound();
  }
  
  // Find related posts
  const relatedPostsData = post.relatedPosts
    .map(id => ukrainePosts.find(p => p.id === id))
    .filter(p => p !== undefined);
  
  // Find index of current post to get previous and next
  const currentIndex = ukrainePosts.findIndex(p => p.id === postId);
  const prevPost = currentIndex > 0 ? ukrainePosts[currentIndex - 1] : null;
  const nextPost = currentIndex < ukrainePosts.length - 1 ? ukrainePosts[currentIndex + 1] : null;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/blogs/news" className="hover:text-blue-700">News</Link>
            <span className="mx-2">/</span>
            <Link href="/blogs/news/ukraine" className="hover:text-blue-700">Ukraine Conflict</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{post.title}</span>
          </div>
        </div>
      </div>
      
      {/* Article Header */}
      <header className="bg-white pt-8 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Category */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 text-xs font-semibold text-white rounded-md ${categoryLabels[post.category]?.color || "bg-gray-700"}`}>
                {categoryLabels[post.category]?.label || post.category}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 max-w-4xl">{post.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3">
                  {/* Replace with actual image when available */}
                  {/* <Image 
                    src={post.authorImageUrl}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="object-cover"
                  /> */}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  {post.authorTitle && <p className="text-xs">{post.authorTitle}</p>}
                </div>
              </div>
              
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-700" />
                <span>{post.date}</span>
              </div>
              
              <div className="flex items-center">
                <FaClock className="mr-2 text-blue-700" />
                <span>{post.readTime}</span>
              </div>
              
              {post.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-700" />
                  <span>{post.location}</span>
                </div>
              )}
            </div>
            
            {/* Share buttons */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-sm font-medium text-gray-700 flex items-center">
                <FaShare className="mr-2" />
                Share
              </span>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600">
                <FaTwitter />
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600">
                <FaFacebook />
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-blue-100 flex items-center justify-center text-gray-600 hover:text-blue-600">
                <FaLinkedin />
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600">
                <FaPrint />
              </button>
            </div>
          </motion.div>
          
          {/* Featured Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
            {/* Replace with actual image when available */}
            {/* <Image 
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            /> */}
          </div>
        </div>
      </header>
      
      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <motion.article 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content || post.excerpt }}
            />
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <FaTags className="text-gray-500" />
                  {post.tags.map((tag, index) => (
                    <Link 
                      key={index}
                      href={`/blogs/news?tag=${tag.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1 bg-gray-100 hover:bg-blue-100 rounded-full text-sm text-gray-700 hover:text-blue-700"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Author Bio */}
            {post.authorBio && (
              <div className="mt-12 bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                    {/* Replace with actual image when available */}
                    {/* <Image 
                      src={post.authorImageUrl}
                      alt={post.author}
                      width={64}
                      height={64}
                      className="object-cover"
                    /> */}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{post.author}</h3>
                    {post.authorTitle && <p className="text-sm text-gray-600 mb-2">{post.authorTitle}</p>}
                    <p className="text-gray-700">{post.authorBio}</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Previous/Next Navigation */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost && (
                <Link 
                  href={`/blogs/news/ukraine/${prevPost.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <FaChevronLeft className="text-blue-700 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Previous Article</p>
                    <p className="font-medium text-gray-900 line-clamp-1">{prevPost.title}</p>
                  </div>
                </Link>
              )}
              
              {nextPost && (
                <Link 
                  href={`/blogs/news/ukraine/${nextPost.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-end text-right"
                >
                  <div>
                    <p className="text-sm text-gray-500">Next Article</p>
                    <p className="font-medium text-gray-900 line-clamp-1">{nextPost.title}</p>
                  </div>
                  <FaChevronRight className="text-blue-700 ml-2" />
                </Link>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3 mt-12 lg:mt-0">
            {/* Related Articles */}
            <div className="mb-10">
              <h3 className="text-xl font-bold mb-6 text-gray-900">Related Articles</h3>
              <div className="space-y-6">
                {relatedPostsData.map(relatedPost => relatedPost && (
                  <Link href={`/blogs/news/ukraine/${relatedPost.id}`} key={relatedPost.id} className="group block">
                    <div className="flex gap-4">
                      <div className="w-24 h-20 bg-gray-300 rounded-md overflow-hidden flex-shrink-0">
                        {/* Replace with actual image when available */}
                        {/* <Image 
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          width={96}
                          height={80}
                          className="object-cover"
                        /> */}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-700 line-clamp-2 text-sm">
                          {relatedPost.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{relatedPost.date}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Key Facts */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Conflict Overview</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="text-lg font-semibold">Limited military engagement</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Peace Process</p>
                  <p className="text-lg font-semibold">Framework agreed, talks in March</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">International Aid (2024-25)</p>
                  <p className="text-lg font-semibold">€12.8 billion pledged</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Territory Status</p>
                  <p className="text-lg font-semibold">Eastern front stabilized</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Source: Institute for War Studies, EU (updated February 2025)
              </div>
            </div>
            
            {/* More on Ukraine */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">More on Ukraine Conflict</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/blogs/news/ukraine" className="text-blue-700 hover:text-blue-800 hover:underline font-medium">
                    Latest Updates
                  </Link>
                </li>
                <li>
                  <Link href="/maps/news?region=ukraine" className="text-blue-700 hover:text-blue-800 hover:underline font-medium">
                    Interactive Conflict Map
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/news?tag=ukraine-analysis" className="text-blue-700 hover:text-blue-800 hover:underline font-medium">
                    Analysis & Background
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/news?tag=eastern-europe" className="text-blue-700 hover:text-blue-800 hover:underline font-medium">
                    Eastern European Context
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 