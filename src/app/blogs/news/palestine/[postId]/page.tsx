"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaShare, FaTwitter, FaFacebook, FaLinkedin, FaPrint, FaTags, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Sample Palestine posts data - in a real application this would come from a database or API
const palestinePosts = [
  {
    id: "8",
    title: "Humanitarian Aid Reaches Gaza as Ceasefire Holds",
    excerpt: "Aid convoys have successfully delivered critical supplies to civilians in Gaza as the temporary ceasefire enters its second week...",
    content: `
      <p>Aid convoys have successfully delivered critical supplies to civilians in Gaza as the temporary ceasefire enters its second week, bringing much-needed relief to areas most affected by the conflict.</p>
      
      <p>The United Nations Office for the Coordination of Humanitarian Affairs (OCHA) reported that over 200 trucks carrying food, medicine, fuel, and water purification equipment have entered Gaza through the Rafah and Kerem Shalom crossings since the ceasefire began on January 20.</p>
      
      <h2>Distribution Challenges</h2>
      
      <p>Despite the increase in aid deliveries, humanitarian organizations continue to face significant challenges in distributing supplies to those in need. Many roads remain impassable due to damage from airstrikes, and security concerns persist in certain areas.</p>
      
      <p>"The logistics of getting aid from the crossing points to the people who need it most remains our biggest challenge," said Marco Rotelli, the World Food Programme's regional coordinator. "We've established distribution points in key locations, but reaching remote areas or neighborhoods with severe infrastructure damage requires careful planning and coordination."</p>
      
      <p>The International Committee of the Red Cross (ICRC) has deployed mobile distribution teams to reach isolated communities, particularly in northern Gaza where destruction has been most extensive.</p>
      
      <h2>Medical Supplies Priority</h2>
      
      <p>Medical supplies constitute a significant portion of recent aid deliveries, responding to the critical shortages reported by hospitals and healthcare facilities throughout Gaza.</p>
      
      <p>The World Health Organization (WHO) confirmed that essential medications, surgical kits, and emergency medical equipment have been delivered to six major hospitals, though shortages of specialized equipment and medications persist.</p>
      
      <p>"We've prioritized emergency medical supplies and equipment needed for trauma care," said Dr. Ayala Rahman, WHO's emergency response coordinator. "But the healthcare system still faces immense challenges with damaged infrastructure and overwhelming patient numbers."</p>
      
      <h2>Ceasefire Stability</h2>
      
      <p>The current ceasefire, brokered by a coalition of regional and international mediators, has largely held despite several reported minor violations. Both sides have expressed cautious commitment to extending the agreement beyond its initial one-month timeline.</p>
      
      <p>International observers remain stationed at key positions to monitor compliance with ceasefire terms, while diplomatic efforts continue to establish a framework for more permanent arrangements.</p>
      
      <p>"The stability of this ceasefire is what allows the humanitarian response to function effectively," noted UN Special Envoy Marta Ruiz. "Every day without fighting means more aid reaching those who need it, more infrastructure repairs, and progress on addressing urgent public health concerns."</p>
      
      <h2>Looking Forward</h2>
      
      <p>As aid deliveries continue, attention is gradually shifting toward medium-term recovery needs, particularly in the areas of shelter, water infrastructure, and restoring basic services.</p>
      
      <p>The UN Development Programme has begun preliminary damage assessments in accessible areas to prepare for eventual reconstruction efforts, though officials emphasize that immediate humanitarian needs remain the priority.</p>
      
      <p>"While we're focused on the emergency response, we must also begin planning for what comes next," said UNDP Regional Director Khalida Bouzar. "The scale of destruction means recovery will be a long-term process requiring sustained international support and cooperation."</p>
    `,
    imageUrl: "/images/blog/gaza-aid.jpg",
    category: "humanitarian",
    author: "Tariq Masri",
    authorTitle: "Middle East Correspondent",
    authorBio: "Tariq Masri has covered humanitarian crises throughout the Middle East for over a decade, with extensive experience reporting from conflict zones.",
    authorImageUrl: "/images/authors/tariq-masri.jpg",
    date: "February 22, 2025",
    readTime: "5 min read",
    location: "Gaza City",
    featured: true,
    tags: ["humanitarian aid", "ceasefire", "gaza", "medical supplies"],
    relatedPosts: ["12", "21", "24"]
  },
  {
    id: "12",
    title: "UN Security Council Votes on New Resolution for Gaza Reconstruction",
    excerpt: "A United Nations resolution for comprehensive rebuilding efforts in Gaza has received widespread support in the Security Council...",
    content: `
      <p>A United Nations resolution for comprehensive rebuilding efforts in Gaza has received widespread support in the Security Council, paving the way for coordinated international action on reconstruction.</p>
      
      <p>The resolution, which passed with 14 votes in favor and one abstention, establishes a framework for addressing the extensive damage to civilian infrastructure throughout the Gaza Strip following months of conflict.</p>
      
      <h2>Key Resolution Elements</h2>
      
      <p>The resolution calls for the establishment of an international Gaza Reconstruction Mechanism that will oversee the delivery of building materials, coordinate donor contributions, and ensure transparency in the rebuilding process.</p>
      
      <p>It also mandates the creation of a comprehensive damage assessment report to be completed within 60 days, which will serve as the foundation for prioritizing reconstruction projects.</p>
      
      <p>"This resolution represents a critical step toward addressing both the immediate humanitarian needs and long-term recovery requirements in Gaza," said UN Secretary-General António Guterres. "It provides a clear pathway for the international community to support rebuilding in a coordinated and effective manner."</p>
      
      <h2>Funding Commitments</h2>
      
      <p>Several nations announced financial commitments during the Security Council session, with pledges for the initial phase of reconstruction already exceeding $1.2 billion.</p>
      
      <p>The European Union pledged €400 million, while the United States committed $300 million specifically for critical infrastructure repairs. Gulf states including Qatar, Saudi Arabia, and the United Arab Emirates collectively pledged $450 million, focusing on housing reconstruction and utility restoration.</p>
      
      <p>"These initial commitments demonstrate the international community's recognition of both the scale of damage and the importance of timely action," noted Sarah Montgomery, UN Assistant Secretary-General for Humanitarian Affairs. "However, sustained support will be needed as full reconstruction is estimated to require several years and significantly more resources."</p>
      
      <h2>Implementation Challenges</h2>
      
      <p>Despite broad international support, significant challenges remain for implementing the reconstruction plan, including ongoing security concerns, material delivery logistics, and coordination among multiple stakeholders.</p>
      
      <p>The resolution acknowledges these challenges by establishing a monitoring mechanism to ensure building materials are used for their intended civilian purposes, addressing concerns that contributed to delays in previous reconstruction efforts.</p>
      
      <p>"The verification procedures have been carefully designed to balance security considerations with the urgent need to proceed with rebuilding," explained Security Council President Ambassador Carlos Jimenez. "We've incorporated lessons from past reconstruction efforts to create a more streamlined and effective approach."</p>
      
      <h2>Priority Projects</h2>
      
      <p>While the comprehensive assessment is still pending, the resolution identifies several immediate priority areas including water treatment facilities, electrical infrastructure, healthcare facilities, and schools.</p>
      
      <p>Preliminary assessments indicate approximately 60% of critical infrastructure requires significant repairs or complete rebuilding, with water and sanitation systems being particularly devastated.</p>
      
      <p>"The focus on water infrastructure is especially important as it directly impacts public health," said Dr. Helena Sandberg of the World Health Organization. "Restoring clean water access will significantly reduce the risk of waterborne disease outbreaks that currently threaten the population."</p>
      
      <h2>Next Steps</h2>
      
      <p>Following the resolution's passage, an international donors' conference is scheduled for March 15 in Cairo, where specific projects will be presented and additional funding commitments sought.</p>
      
      <p>The Gaza Reconstruction Mechanism is expected to be operational by early April, with preliminary work on critical infrastructure projects potentially beginning before the comprehensive assessment is completed.</p>
    `,
    imageUrl: "/images/blog/gaza-reconstruction.jpg",
    category: "diplomacy",
    author: "Layla Hassan",
    authorTitle: "UN Affairs Correspondent",
    authorBio: "Layla Hassan specializes in United Nations diplomatic initiatives and international development policy, with particular focus on conflict resolution in the Middle East.",
    authorImageUrl: "/images/authors/layla-hassan.jpg",
    date: "February 18, 2025",
    readTime: "6 min read",
    location: "New York",
    featured: true,
    tags: ["United Nations", "reconstruction", "international aid", "diplomacy"],
    relatedPosts: ["8", "21", "23"]
  },
  {
    id: "21",
    title: "Water Infrastructure Restoration Project Launches in Southern Gaza",
    excerpt: "International NGOs begin work on critical water treatment facilities to address ongoing public health concerns...",
    imageUrl: "/images/blog/gaza-water.jpg",
    category: "infrastructure",
    author: "Mohammed Khalil",
    date: "February 15, 2025",
    readTime: "4 min read",
    location: "Rafah",
    featured: false,
    tags: ["water", "infrastructure", "public health", "reconstruction"],
    relatedPosts: ["8", "12", "22"]
  },
  {
    id: "22",
    title: "Medical Supplies Shortage Persists Despite Aid Deliveries",
    excerpt: "Hospitals report continued difficulties obtaining specialized equipment and medications despite increased aid flow...",
    imageUrl: "/images/blog/gaza-medical.jpg",
    category: "healthcare",
    author: "Dr. Sarah Ahmad",
    date: "February 12, 2025",
    readTime: "7 min read",
    location: "Khan Younis",
    featured: false,
    tags: ["healthcare", "medical supplies", "hospitals", "humanitarian aid"],
    relatedPosts: ["8", "21", "25"]
  },
  {
    id: "23",
    title: "Regional Summit on Palestinian-Israeli Peace Negotiations Set for March",
    excerpt: "Egypt announces diplomatic conference aimed at establishing framework for comprehensive peace talks...",
    imageUrl: "/images/blog/palestine-peace.jpg",
    category: "diplomacy",
    author: "Ibrahim Maalouf",
    date: "February 8, 2025",
    readTime: "5 min read",
    location: "Cairo",
    featured: false,
    tags: ["diplomacy", "peace process", "negotiations", "summit"],
    relatedPosts: ["12", "8", "24"]
  },
  {
    id: "24",
    title: "Refugee Return Program Pilot Launched in Northern Gaza",
    excerpt: "First phase of coordinated resettlement begins for families displaced during recent conflict...",
    imageUrl: "/images/blog/gaza-return.jpg",
    category: "rehabilitation",
    author: "Fatima Nour",
    date: "February 5, 2025",
    readTime: "6 min read",
    location: "Northern Gaza",
    featured: false,
    tags: ["refugees", "resettlement", "displacement", "rehabilitation"],
    relatedPosts: ["8", "12", "25"]
  },
  {
    id: "25",
    title: "Education Emergency: Schools Struggle to Reopen Across Gaza",
    excerpt: "UNICEF reports that over 70% of educational facilities remain damaged or repurposed as shelters...",
    imageUrl: "/images/blog/gaza-education.jpg",
    category: "education",
    author: "Hana Jabari",
    date: "January 30, 2025",
    readTime: "5 min read",
    location: "Gaza City",
    featured: false,
    tags: ["education", "schools", "children", "UNICEF"],
    relatedPosts: ["21", "22", "26"]
  },
  {
    id: "26",
    title: "Agricultural Recovery Plan Unveiled for Gaza Strip",
    excerpt: "FAO and Palestinian Authority announce joint initiative to restore farming capacity and food security...",
    imageUrl: "/images/blog/gaza-agriculture.jpg",
    category: "economy",
    author: "Omar Suleiman",
    date: "January 26, 2025",
    readTime: "4 min read",
    location: "Ramallah",
    featured: false,
    tags: ["agriculture", "food security", "economy", "recovery"],
    relatedPosts: ["21", "24", "25"]
  }
];

// Category labels map
const categoryLabels: Record<string, {label: string, color: string}> = {
  humanitarian: { label: "Humanitarian Aid", color: "bg-green-700" },
  diplomacy: { label: "Diplomacy", color: "bg-blue-700" },
  infrastructure: { label: "Infrastructure", color: "bg-yellow-700" },
  healthcare: { label: "Healthcare", color: "bg-red-700" },
  rehabilitation: { label: "Rehabilitation", color: "bg-purple-700" },
  education: { label: "Education", color: "bg-indigo-700" },
  economy: { label: "Economy", color: "bg-cyan-700" }
};

export default function PalestinePostPage() {
  // Using traditional params access for now, but with a comment about future migration
  // TODO: Update to use React.use(params) when TypeScript types are properly aligned
  const params = useParams();
  const postId = params?.postId as string;
  
  // Find the post with the matching ID
  const post = palestinePosts.find(p => p.id === postId);
  
  // If no post found, return 404
  if (!post) {
    notFound();
  }
  
  // Find related posts
  const relatedPostsData = post.relatedPosts
    .map(id => palestinePosts.find(p => p.id === id))
    .filter(p => p !== undefined);
  
  // Find index of current post to get previous and next
  const currentIndex = palestinePosts.findIndex(p => p.id === postId);
  const prevPost = currentIndex > 0 ? palestinePosts[currentIndex - 1] : null;
  const nextPost = currentIndex < palestinePosts.length - 1 ? palestinePosts[currentIndex + 1] : null;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/blogs/news" className="hover:text-green-700">News</Link>
            <span className="mx-2">/</span>
            <Link href="/blogs/news/palestine" className="hover:text-green-700">Palestine Crisis</Link>
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
                <FaCalendarAlt className="mr-2 text-green-700" />
                <span>{post.date}</span>
              </div>
              
              <div className="flex items-center">
                <FaClock className="mr-2 text-green-700" />
                <span>{post.readTime}</span>
              </div>
              
              {post.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-green-700" />
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
                      className="px-3 py-1 bg-gray-100 hover:bg-green-100 rounded-full text-sm text-gray-700 hover:text-green-700"
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
                  href={`/blogs/news/palestine/${prevPost.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center"
                >
                  <FaChevronLeft className="text-green-700 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Previous Article</p>
                    <p className="font-medium text-gray-900 line-clamp-1">{prevPost.title}</p>
                  </div>
                </Link>
              )}
              
              {nextPost && (
                <Link 
                  href={`/blogs/news/palestine/${nextPost.id}`}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-end text-right"
                >
                  <div>
                    <p className="text-sm text-gray-500">Next Article</p>
                    <p className="font-medium text-gray-900 line-clamp-1">{nextPost.title}</p>
                  </div>
                  <FaChevronRight className="text-green-700 ml-2" />
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
                  <Link href={`/blogs/news/palestine/${relatedPost.id}`} key={relatedPost.id} className="group block">
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
                        <h4 className="font-medium text-gray-900 group-hover:text-green-700 line-clamp-2 text-sm">
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
              <h3 className="text-xl font-bold mb-4 text-gray-900">Key Facts</h3>
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Current Ceasefire Status</p>
                  <p className="text-lg font-semibold">In effect since January 20</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Humanitarian Aid (2024-25)</p>
                  <p className="text-lg font-semibold">$1.2 billion pledged</p>
                </div>
                <div className="border-b border-gray-200 pb-3">
                  <p className="text-sm text-gray-500">Displaced Persons</p>
                  <p className="text-lg font-semibold">1.9 million (internal)</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Infrastructure Damage</p>
                  <p className="text-lg font-semibold">60% of critical facilities</p>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Source: UN, UNRWA, WHO (updated February 2025)
              </div>
            </div>
            
            {/* More on Palestine */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-900">More on Palestine Crisis</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/blogs/news/palestine" className="text-green-700 hover:text-green-800 hover:underline font-medium">
                    Latest Updates
                  </Link>
                </li>
                <li>
                  <Link href="/maps/news?region=palestine" className="text-green-700 hover:text-green-800 hover:underline font-medium">
                    Interactive Crisis Map
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/news?tag=palestine-analysis" className="text-green-700 hover:text-green-800 hover:underline font-medium">
                    Analysis & Background
                  </Link>
                </li>
                <li>
                  <Link href="/blogs/news?tag=humanitarian-response" className="text-green-700 hover:text-green-800 hover:underline font-medium">
                    Aid & Humanitarian Response
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