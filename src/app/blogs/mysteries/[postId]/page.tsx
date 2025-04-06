"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { FaCalendarAlt, FaUser, FaClock, FaFacebookF, FaTwitter, FaLinkedinIn, FaRedditAlien, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdBookmark } from "react-icons/md";

// Sample mystery blog posts data (same as in the main page)
const mysteryPosts = [
  {
    id: 1,
    title: "The Voynich Manuscript: History's Most Mysterious Text",
    excerpt: "Explore the enigmatic 15th century manuscript that has confounded linguists, cryptographers and historians for centuries...",
    content: `
      <p class="lead">For centuries, the Voynich Manuscript has defied understanding, a medieval codex written in an undecipherable script and illustrated with bizarre imagery that continues to baffle experts to this day.</p>
      
      <p>Discovered in 1912 by Polish book dealer Wilfrid Voynich, the manuscript's 240 vellum pages contain text in an unknown writing system alongside illustrations of unidentifiable plants, astronomical diagrams, and nude women bathing in strange, interconnected pools of green liquid. Carbon dating has placed its origin between 1404 and 1438, but despite over a century of scrutiny by the world's top cryptographers, linguists, and computer scientists, the text remains undeciphered.</p>
      
      <h2>The World's Most Mysterious Book</h2>
      
      <p>The manuscript's journey through history is almost as enigmatic as its contents. Records suggest it belonged to Emperor Rudolf II of Habsburg, who purchased it for 600 gold ducats believing it was the work of friar and philosopher Roger Bacon. It later passed through the hands of Jesuit scholars before disappearing for nearly 250 years, only to resurface in a Jesuit college near Rome where Voynich discovered it.</p>
      
      <p>What makes the Voynich Manuscript particularly baffling is that it displays all the characteristics of a genuine language – statistical analyses reveal patterns consistent with natural languages, suggesting it's not simply random gibberish. The text appears to follow specific linguistic rules, with recurring patterns and what seem to be grammar structures.</p>
      
      <blockquote>
        "The Voynich Manuscript represents one of the most elegant and persistent puzzles in historical cryptography. It's not just the script that's mysterious – the illustrations depict plants that don't exist and cosmological models that don't correspond to any known medieval understanding of the universe."
        <cite>— Dr. Lisa Fagin Davis, Medieval Manuscript Expert</cite>
      </blockquote>
      
      <h2>Modern Attempts at Deciphering</h2>
      
      <p>The manuscript has withstood decryption attempts by some of history's most accomplished code-breakers, including cryptographers who worked on breaking the Nazi Enigma code during World War II. In recent years, artificial intelligence and computer algorithms have been deployed in various attempts to crack its code.</p>
      
      <p>In 2023, a team from the University of Alberta claimed a breakthrough using quantum linguistics and deep learning algorithms, suggesting the manuscript might be written in a constructed symbolic language designed for alchemical notation. However, as with previous claims of decipherment, the academic community remains skeptical, and no consensus has been reached.</p>
      
      <h2>Theories About Its Origin and Purpose</h2>
      
      <p>Numerous theories have been proposed about the manuscript's creator and purpose:</p>
      
      <ul>
        <li>A medical treatise written in a custom shorthand by a medieval physician</li>
        <li>An elaborate hoax created either in the Middle Ages or by Voynich himself</li>
        <li>A religious text written in a constructed sacred language</li>
        <li>An alchemical guide with deliberately obscured knowledge</li>
        <li>A product of glossolalia (speaking in tongues), representing someone's psychotic episode</li>
        <li>A genuine attempt to record information from a lost or marginal culture</li>
      </ul>
      
      <p>Modern analysis has at least confirmed the manuscript was not a 20th-century forgery – the vellum, ink, and pigments are consistent with early 15th-century European production methods.</p>
      
      <h2>The Allure of the Unsolvable</h2>
      
      <p>What makes the Voynich Manuscript so captivating is not just its resistance to understanding, but the possibility that it might contain lost knowledge or insights. The illustrated plants, which don't correspond to known species, could represent extinct flora or symbolic representations of medicinal compounds. The astronomical charts might preserve alternative cosmological models lost to mainstream history.</p>
      
      <p>Or perhaps its greatest value lies in being unsolved – a reminder that despite our technological advancement, some mysteries from the past remain beyond our grasp, continuing to challenge our assumptions about human communication and knowledge preservation.</p>
      
      <p>The manuscript now resides in Yale University's Beinecke Rare Book and Manuscript Library (catalog number MS 408), where researchers continue to study it, and the curious can view digitized copies online, ensuring that new generations can attempt to unravel its secrets.</p>
    `,
    imageUrl: "/images/blog/voynich-manuscript.jpg",
    category: "ancient-mysteries",
    author: "Dr. Elena Fortham",
    authorTitle: "Professor of Medieval History",
    authorBio: "Dr. Elena Fortham is a leading expert in medieval manuscripts and cryptography, with a focus on undeciphered historical texts.",
    authorImageUrl: "/images/authors/elena-fortham.jpg",
    date: "February 28, 2025",
    readTime: "8 min read",
    tags: ["manuscripts", "cryptography", "medieval", "unsolved"],
    featured: true,
    relatedPosts: [3, 6]
  },
  {
    id: 2,
    title: "Bermuda Triangle: New Theories on the World's Deadliest Waters",
    excerpt: "Recent scientific investigations offer compelling explanations for the mysterious disappearances that have made this region infamous...",
    content: `
      <p class="lead">For decades, the Bermuda Triangle has captured the public imagination as a zone of mystery where ships and aircraft seem to disappear without explanation. Recent scientific research offers new insights into this legendary maritime enigma.</p>
      
      <p>Stretching between Bermuda, Florida, and Puerto Rico, this roughly triangular section of the Atlantic Ocean has been associated with unexplained disappearances since the mid-20th century. While popular culture attributes these incidents to paranormal or extraterrestrial causes, scientists have been working to understand the natural phenomena that might explain the Triangle's deadly reputation.</p>
      
      <h2>The Mystery Takes Shape</h2>
      
      <p>The legend of the Bermuda Triangle began to take shape in 1950 when Associated Press reporter E.V.W. Jones compiled a story about mysterious disappearances in the area. The term "Bermuda Triangle" was coined two years later by writer George X. Sand in an article for Fate magazine. The legend was cemented in public consciousness by Charles Berlitz's 1974 bestseller "The Bermuda Triangle," which sold over 20 million copies.</p>
      
      <p>Among the most famous incidents is the disappearance of Flight 19, a group of five Navy TBM Avenger torpedo bombers that vanished during a training mission in December 1945, along with a search plane sent to find them – a total loss of 27 men. No wreckage from these aircraft has ever been definitively identified.</p>
      
      <h2>New Scientific Explanations</h2>
      
      <p>Recent research has identified several natural phenomena that may contribute to the area's dangers:</p>
      
      <h3>Methane Hydrate Eruptions</h3>
      
      <p>Scientists have discovered extensive deposits of methane hydrates (a form of natural gas) on the continental shelf off the North American Atlantic coast. Studies suggest that these deposits can destabilize and release large amounts of gas, dramatically reducing water density and causing ships to sink rapidly without warning. This could explain some of the mysterious disappearances where vessels vanished without distress calls or debris.</p>
      
      <h3>Rogue Waves</h3>
      
      <p>Once dismissed as sailors' myths, satellite observations have confirmed the existence of "rogue waves" that can reach heights of 100 feet or more. These massive, unpredictable waves form when smaller waves combine their energy, creating a wall of water capable of overwhelming even large vessels. The geography and currents of the Bermuda Triangle area create conditions particularly conducive to rogue wave formation.</p>
      
      <blockquote>
        "What makes the Bermuda Triangle particularly dangerous is the combination of intense maritime traffic, sudden severe weather patterns, and unique geological features that can create deceptively hazardous conditions."
        <cite>— Dr. Simon Boxhall, Oceanographer</cite>
      </blockquote>
      
      <h3>Electronic Fog and Compass Variations</h3>
      
      <p>Meteorological research has identified unusual electromagnetic phenomena in the region that some researchers call "electronic fog." This atmospheric condition can cause instrumentation malfunctions and disorientation. Additionally, the Bermuda Triangle is one of the few places on Earth where magnetic north and true north align, creating a "compass rose" effect that has historically caused navigational confusion.</p>
      
      <h2>Human Factors</h2>
      
      <p>Beyond natural phenomena, analysis of incident reports reveals human factors that contribute to the Triangle's reputation:</p>
      
      <ul>
        <li>The area experiences extremely high traffic volumes of both vessels and aircraft</li>
        <li>Many inexperienced sailors navigate these waters due to their proximity to popular vacation destinations</li>
        <li>Rapid weather changes are common but were less predictable before modern forecasting</li>
        <li>The deep waters of the Puerto Rico Trench (up to 27,500 feet) make recovery of wreckage extremely difficult</li>
      </ul>
      
      <h2>Statistical Reality</h2>
      
      <p>When considering actual statistics, many experts argue there is no "Bermuda Triangle mystery" at all. Lloyd's of London, the world's leading maritime insurance market, does not recognize the Bermuda Triangle as an especially hazardous zone, and insurance rates for shipping in the area are no higher than comparable regions.</p>
      
      <p>The U.S. Coast Guard maintains that the number of incidents in the area is proportional to the high volume of traffic it sees, stating: "The Coast Guard does not recognize the existence of the so-called Bermuda Triangle as a geographic area of specific hazard to ships or planes. In a review of many aircraft and vessel losses in the area over the years, there has been nothing discovered that would indicate that casualties were the result of anything other than physical causes."</p>
      
      <p>Nevertheless, the legend persists and continues to evolve as new scientific understanding sheds light on previously unexplained phenomena, reminding us that sometimes the most enduring mysteries have natural, if complex, explanations.</p>
    `,
    imageUrl: "/images/blog/bermuda-triangle.jpg",
    category: "unexplained-phenomena",
    author: "Marcus Chen",
    authorTitle: "Marine Geologist",
    authorBio: "Marcus Chen specializes in oceanographic anomalies and has conducted extensive research in the Bermuda Triangle region.",
    authorImageUrl: "/images/authors/marcus-chen.jpg",
    date: "February 25, 2025",
    readTime: "6 min read",
    tags: ["ocean", "navigation", "disappearances", "theories"],
    featured: true,
    relatedPosts: [4, 5]
  },
  {
    id: 3,
    title: "The Nazca Lines: Messages to the Sky Gods?",
    excerpt: "New drone footage reveals previously undiscovered patterns in Peru's ancient geoglyphs, raising questions about their true purpose...",
    imageUrl: "/images/blog/nazca-lines.jpg",
    category: "ancient-mysteries",
    author: "Sofia Rodriguez",
    date: "February 21, 2025",
    readTime: "7 min read",
    featured: false,
    relatedPosts: [1, 6]
  },
  {
    id: 4,
    title: "The Dyatlov Pass Incident: Case Reopened",
    excerpt: "Russian investigators have uncovered new evidence about the mysterious deaths of nine hikers in the Ural Mountains in 1959...",
    imageUrl: "/images/blog/dyatlov-pass.jpg",
    category: "unexplained-phenomena",
    author: "Ivan Petrov",
    date: "February 18, 2025",
    readTime: "10 min read",
    featured: false,
    relatedPosts: [2, 5]
  },
  {
    id: 5,
    title: "The Search for Cryptids: Science Meets Folklore",
    excerpt: "How modern scientific methods are being used to investigate legendary creatures from around the world...",
    imageUrl: "/images/blog/cryptids.jpg",
    category: "cryptids",
    author: "Dr. James Woodward",
    date: "February 15, 2025",
    readTime: "5 min read",
    featured: false,
    relatedPosts: [2, 4]
  },
  {
    id: 6,
    title: "Easter Island's Moai: The Statues That Walked?",
    excerpt: "Archaeological experiments demonstrate how ancient Polynesians might have transported the massive stone figures...",
    imageUrl: "/images/blog/easter-island.jpg",
    category: "ancient-mysteries",
    author: "Dr. Laura Hansen",
    date: "February 12, 2025",
    readTime: "9 min read",
    featured: false,
    relatedPosts: [1, 3]
  },
  {
    id: 7,
    title: "Jack the Ripper: The Enduring Mystery of Victorian London",
    excerpt: "London's most infamous serial killer remains unidentified over a century later, despite modern forensic analysis and countless investigations...",
    content: `
      <p class="lead">Jack the Ripper remains one of history's most infamous and enigmatic figures, his identity shrouded in mystery for over a century. Operating in the impoverished Whitechapel district of London in 1888, this unidentified serial killer's brutal crimes have captivated the public imagination and spurred countless investigations. Recent developments, including DNA analyses, have reignited discussions about his true identity.</p>
      
      <h2>The Whitechapel Murders: A Grim Chronicle</h2>
      
      <p>Between August and November 1888, a series of gruesome murders unfolded in London's East End, specifically in the Whitechapel area. The victims, all women, were subjected to horrific mutilations, indicating a perpetrator with a disturbing level of anatomical knowledge. The canonical five victims are:</p>
      
      <ul>
        <li><strong>Mary Ann Nichols:</strong> Discovered on August 31, 1888, her throat was slashed, and her abdomen mutilated.</li>
        <li><strong>Annie Chapman:</strong> Found on September 8, 1888, with similar injuries, including the removal of internal organs.</li>
        <li><strong>Elizabeth Stride:</strong> Killed on September 30, 1888; her throat was cut, but the absence of further mutilation suggests the murderer may have been interrupted.</li>
        <li><strong>Catherine Eddowes:</strong> Also murdered on September 30, 1888, her body exhibited severe facial and abdominal mutilations.</li>
        <li><strong>Mary Jane Kelly:</strong> The final canonical victim, found on November 9, 1888, her body was extensively mutilated in her own room.</li>
      </ul>
      
      <p>These murders instilled terror in the local community and garnered extensive media attention, leading to widespread speculation about the killer's identity.</p>
      
      <h2>The Moniker "Jack the Ripper"</h2>
      
      <p>The name "Jack the Ripper" originated from a letter sent to the Central News Agency, purportedly by the killer. Dated September 25, 1888, and dubbed the "Dear Boss" letter, it taunted the police and threatened further violence. While its authenticity remains debated, the letter popularized the chilling alias that endures to this day.</p>
      
      <blockquote>
        "I am down on whores and I shan't quit ripping them till I do get buckled. Grand work the last job was. I gave the lady no time to squeal. How can they catch me now..."
        <cite>— Excerpt from the "Dear Boss" letter</cite>
      </blockquote>
      
      <h2>Investigative Challenges</h2>
      
      <p>The Metropolitan Police faced immense pressure to apprehend the murderer, but several factors hindered their efforts:</p>
      
      <ul>
        <li><strong>Forensic Limitations:</strong> In 1888, forensic science was in its infancy. Techniques like fingerprint analysis and DNA profiling were nonexistent, severely restricting investigative capabilities.</li>
        <li><strong>Overwhelming Public Response:</strong> The police received thousands of letters, many from individuals claiming to be the killer or offering dubious leads, complicating the investigation.</li>
        <li><strong>Social Prejudices:</strong> The victims, often labeled as prostitutes, were marginalized, and societal biases may have influenced the urgency and direction of the investigation.</li>
      </ul>
      
      <h2>Suspects: A Myriad of Theories</h2>
      
      <p>Over the years, numerous individuals have been proposed as Jack the Ripper, ranging from local butchers to members of the royal family. Notable suspects include:</p>
      
      <h3>Aaron Kosminski</h3>
      
      <p>A Polish immigrant and barber, Kosminski was institutionalized due to mental illness. Recent DNA analysis from a shawl found at one of the crime scenes has linked him to the murders, though some experts question the evidence's reliability.</p>
      
      <h3>Montague John Druitt</h3>
      
      <p>A barrister and teacher, Druitt's suicide shortly after the last canonical murder led some to suspect him, though concrete evidence is lacking.</p>
      
      <h3>Walter Sickert</h3>
      
      <p>A British painter, Sickert was accused based on controversial theories suggesting his artworks contained hidden clues. Most scholars dismiss these claims due to a lack of substantive evidence.</p>
      
      <h2>Cultural Impact and Modern Fascination</h2>
      
      <p>Jack the Ripper's gruesome legacy has permeated popular culture, inspiring countless books, films, and documentaries. The case's enduring mystery continues to captivate the public, with recent developments sparking renewed interest. For instance, a 2025 article discusses how the Ripper's identity has been a subject of ongoing debate, with various theories emerging over the years.</p>
      
      <h2>Recent Developments</h2>
      
      <p>In recent months, several major breakthroughs have been claimed in the Jack the Ripper case:</p>
      
      <ul class="recent-developments-list space-y-3">
        <li>A researcher has claimed a <a href="https://people.com/jack-the-ripper-identified-with-dna-match-according-to-researcher-seeking-closure-11680644" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">"100% DNA match" identifying the Ripper</a>, seeking closure for the historical case.</li>
        <li>Analysis of a victim's <a href="https://www.the-sun.com/news/13425898/jack-ripper-dna-victim-shawl/" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">100-year-old shawl purportedly confirms</a> one of the prime suspects.</li>
        <li>After 137 years of mystery, <a href="https://www.news.com.au/lifestyle/real-life/news-life/we-may-finally-know-the-true-identity-of-jack-the-ripper-after-137-years-of-mystery/news-story/14f22046597546a64113567752d972c9" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">new evidence suggests we may finally know</a> the true identity of London's most notorious serial killer.</li>
        <li>New computational methods are being applied to historical evidence, yielding fresh insights into the killer's movements and potential identity.</li>
      </ul>
      
      <p>However, as with previous claims of resolution, the academic and forensic communities remain cautious, emphasizing the challenges of analyzing historical evidence with modern techniques.</p>
      
      <h2>Conclusion</h2>
      
      <p>The enigma of Jack the Ripper endures, a dark chapter in criminal history that continues to fascinate and horrify. Despite modern advancements and ongoing investigations, the true identity of this notorious killer remains unresolved, a testament to the complexities and challenges inherent in unraveling historical mysteries.</p>
      
      <p>As we approach the 140th anniversary of these crimes, the shadow of Jack the Ripper continues to loom over Whitechapel's foggy streets, reminding us that some questions may never find definitive answers—and perhaps it is this very uncertainty that ensures the Ripper's place in our collective imagination.</p>
    `,
    imageUrl: "/images/blog/jack-the-ripper.jpg",
    category: "historical",
    author: "xdotx",
    authorTitle: "Professor of Victorian History and Criminology",
    authorBio: "xdotx specializes in unsolved historical crimes with a focus on Victorian London and has published numerous papers on the socioeconomic context of the Whitechapel murders.",
    authorImageUrl: "/images/authors/arthur-sullivan.jpg",
    date: "March 5, 2025",
    readTime: "12 min read",
    tags: ["victorian", "london", "true crime", "unsolved", "historical mystery"],
    featured: true,
    relatedPosts: [1, 4]
  },
];

// Mystery categories mapping
const categoryLabels = {
  "ancient-mysteries": "Ancient Mysteries",
  "unexplained-phenomena": "Unexplained Phenomena",
  "cryptids": "Cryptids & Legends",
  "paranormal": "Paranormal",
  "conspiracy": "Conspiracy Theories",
  "historical": "Historical Enigmas"
};

export default function MysteryPostPage() {
  // Using traditional params access for now, but with a comment about future migration
  // TODO: Update to use React.use(params) when TypeScript types are properly aligned
  const params = useParams();
  const postId = params?.postId ? Number(params.postId) : 0;

  // Find the current post
  const post = mysteryPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Mystery Not Found</h1>
        <p className="mb-6 text-gray-400">This mystery seems to have vanished without a trace...</p>
        <Link href="/blogs/mysteries" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors">
          Return to Mysteries
        </Link>
      </div>
    );
  }

  // Find related posts
  const relatedPosts = post.relatedPosts ? post.relatedPosts.map(id =>
    mysteryPosts.find(p => p.id === id)
  ).filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Header */}
      <div className="relative bg-cover bg-center h-[60vh]"
        style={{ backgroundImage: `url("${post.imageUrl}")` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-gray-900"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-16 z-10">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/blogs/mysteries" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center">
              <FaArrowLeft className="mr-1" size={14} />
              Back to All Mysteries
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              href={`/blogs/mysteries?category=${post.category}`}
              className="text-xs font-medium px-2.5 py-0.5 rounded bg-purple-900 text-purple-300"
            >
              {categoryLabels[post.category as keyof typeof categoryLabels] || post.category}
            </Link>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white max-w-4xl"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap items-center gap-6 text-sm text-gray-300"
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 mr-3 relative">
                {post.authorImageUrl && (
                  <Image
                    src={post.authorImageUrl}
                    alt={post.author}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{post.author}</p>
                {post.authorTitle && <p className="text-xs text-gray-400">{post.authorTitle}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              {post.date}
            </div>

            <div className="flex items-center">
              <FaClock className="mr-2" />
              {post.readTime}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article Content */}
      <div className="relative">
        {/* Decorative elements */}
        <div className="hidden lg:block absolute left-0 top-40 w-40 h-80 bg-purple-900/20 rounded-full blur-3xl -z-10"></div>
        <div className="hidden lg:block absolute right-0 top-80 w-60 h-60 bg-indigo-900/20 rounded-full blur-3xl -z-10"></div>

        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row lg:gap-12">
            {/* Article Content */}
            <article className="w-full lg:w-2/3">
              {/* Social Sharing - Top */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Share this:</span>
                  <button className="w-8 h-8 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <FaFacebookF className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-colors">
                    <FaTwitter className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                    <FaLinkedinIn className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <FaRedditAlien className="text-white" />
                  </button>
                </div>
                <button className="flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  <MdBookmark className="mr-1" size={16} />
                  Save for Later
                </button>
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg prose-invert max-w-none prose-headings:text-purple-300 prose-headings:font-bold prose-p:text-gray-300 prose-a:text-purple-400 prose-blockquote:border-purple-700 prose-blockquote:bg-gray-800 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-sm prose-li:text-gray-300 prose-img:rounded-lg"
                dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-6 border-t border-gray-800">
                  <h3 className="text-lg font-bold mb-3 text-white">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        href={`/blogs/mysteries?tag=${tag}`}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full text-sm transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Author Bio */}
              {post.authorBio && (
                <div className="mt-12 p-6 bg-gray-800 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 relative flex-shrink-0">
                      {post.authorImageUrl && (
                        <Image
                          src={post.authorImageUrl}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{post.author}</h3>
                      {post.authorTitle && <p className="text-sm text-purple-300 mb-2">{post.authorTitle}</p>}
                      <p className="text-gray-300">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Sharing - Bottom */}
              <div className="mt-8 pt-4 border-t border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Share this:</span>
                  <button className="w-8 h-8 rounded-full bg-blue-800 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <FaFacebookF className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center transition-colors">
                    <FaTwitter className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors">
                    <FaLinkedinIn className="text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 flex items-center justify-center transition-colors">
                    <FaRedditAlien className="text-white" />
                  </button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="w-full lg:w-1/3 mt-12 lg:mt-0">
              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-bold mb-4 text-white">Related Mysteries</h3>
                  <ul className="space-y-4">
                    {relatedPosts.map(relatedPost => relatedPost && (
                      <li key={relatedPost.id}>
                        <Link href={`/blogs/mysteries/${relatedPost.id}`} className="flex space-x-3 group">
                          <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                            <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                            {/* Replace with actual image when available */}
                            {/* <Image 
                              src={relatedPost.imageUrl}
                              alt={relatedPost.title}
                              fill
                              className="object-cover"
                            /> */}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                              {relatedPost.title}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{relatedPost.excerpt}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Posts */}
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 text-white">Popular Mysteries</h3>
                <ul className="space-y-4">
                  {mysteryPosts.slice(0, 3).map(popularPost => (
                    <li key={popularPost.id} className={popularPost.id === post.id ? 'opacity-50' : ''}>
                      <Link href={`/blogs/mysteries/${popularPost.id}`} className="flex space-x-3 group">
                        <div className="relative h-20 w-20 flex-shrink-0 rounded overflow-hidden">
                          <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                          {/* Replace with actual image when available */}
                          {/* <Image 
                            src={popularPost.imageUrl}
                            alt={popularPost.title}
                            fill
                            className="object-cover"
                          /> */}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                            {popularPost.title}
                          </h4>
                          <div className="flex items-center mt-1">
                            <FaCalendarAlt className="text-gray-500 mr-1" size={10} />
                            <span className="text-xs text-gray-400">{popularPost.date}</span>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-white">Subscribe to Mysteries</h3>
                <p className="text-gray-300 text-sm mb-4">Get the latest unexplained phenomena delivered to your inbox.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full py-2 px-4 rounded bg-gray-800 bg-opacity-50 text-white border border-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded font-medium transition-colors flex justify-center items-center">
                    Subscribe
                    <FaArrowRight className="ml-2" size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous/Next Navigation */}
      <div className="bg-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            {post.id > 1 ? (
              <Link href={`/blogs/mysteries/${post.id - 1}`} className="flex items-center text-gray-300 hover:text-white transition-colors mb-4 sm:mb-0">
                <FaArrowLeft className="mr-2" />
                <span>Previous Mystery</span>
              </Link>
            ) : (
              <div></div> // Empty div to maintain spacing
            )}

            <Link href="/blogs/mysteries" className="text-purple-400 hover:text-purple-300 transition-colors mb-4 sm:mb-0">
              View All Mysteries
            </Link>

            {post.id < mysteryPosts.length ? (
              <Link href={`/blogs/mysteries/${post.id + 1}`} className="flex items-center text-gray-300 hover:text-white transition-colors">
                <span>Next Mystery</span>
                <FaArrowRight className="ml-2" />
              </Link>
            ) : (
              <div></div> // Empty div to maintain spacing
            )}
          </div>
        </div>
      </div>

      {/* Related Content - Map Link */}
      <div className="bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-10">
              <h3 className="text-2xl font-bold mb-2 text-white">Explore the Mystery Map</h3>
              <p className="text-gray-400 max-w-xl">
                See the locations of the world&apos;s greatest mysteries with our interactive global explorer.
              </p>
            </div>
            <Link href="/maps/mysteries" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center">
              View Mystery Map
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 