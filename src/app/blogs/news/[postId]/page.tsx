"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaEnvelope,
  FaArrowLeft,
  FaArrowRight,
  FaBookmark,
  FaGlobe
} from "react-icons/fa";

// Sample news blog posts data
const newsPosts = [
  {
    id: 1,
    title: "Global Summit on Climate Change Reaches Historic Agreement",
    excerpt: "World leaders have committed to ambitious new targets for carbon reduction, marking a turning point in international climate policy...",
    content: `
      <p class="lead">After two weeks of intense negotiations, representatives from 195 nations reached a landmark agreement on aggressive new climate targets, potentially marking a decisive turning point in global efforts to combat climate change.</p>
      
      <p>The summit, held in Singapore, concluded with a commitment to reduce global carbon emissions by 60% from 2010 levels by 2035 – a substantially more ambitious target than previous international agreements. The pact also established a $100 billion annual fund to assist developing nations in transitioning to renewable energy sources.</p>
      
      <h2>Breaking the Climate Deadlock</h2>
      
      <p>The breakthrough came after years of stalled climate negotiations, with developing nations and developed economies often at odds over responsibility and financing. This time, a coalition of middle-income countries led by Brazil, Indonesia, and South Africa presented a compromise framework that helped bridge the divide.</p>
      
      <p>"What we've witnessed here is nothing short of historic," said UN Secretary-General António Guterres. "For the first time, we have a truly global commitment that acknowledges both differentiated responsibilities and the urgent need for unprecedented action by all nations."</p>
      
      <p>Key elements of the agreement include:</p>
      
      <ul>
        <li>Mandatory five-year reviews of national climate policies with binding adjustment mechanisms</li>
        <li>A new international carbon pricing framework set to begin implementation in 2027</li>
        <li>Commitment to phase out coal power in developed nations by 2030 and globally by 2040</li>
        <li>Enhanced protections for climate-vulnerable communities and ecosystems</li>
        <li>Technology transfer provisions to accelerate clean energy adoption worldwide</li>
      </ul>
      
      <h2>Unprecedented Cooperation</h2>
      
      <p>In a significant shift from previous climate summits, both the United States and China – the world's largest carbon emitters – took leadership roles in the negotiations. Their joint announcement of accelerated domestic decarbonization targets early in the proceedings set a cooperative tone that helped drive consensus.</p>
      
      <blockquote>
        "We've moved beyond the era of finger-pointing to one of shared commitment. Every nation represented here understands that climate change threatens our collective future, and only collective action will suffice in addressing it."
        <cite>— Dr. Mei Chen, Lead Climate Negotiator for China</cite>
      </blockquote>
      
      <p>The European Union also played a pivotal role by offering to increase its climate finance contributions by 40% and implementing the continent's most stringent emissions trading system to date.</p>
      
      <h2>Market Response</h2>
      
      <p>Financial markets responded positively to the agreement, with renewable energy stocks surging across global exchanges. The MSCI Global Alternative Energy Index rose 7.2% in the day following the announcement, while major fossil fuel company shares experienced modest declines.</p>
      
      <p>Investment analysts project that the agreement will accelerate the already rapid growth in clean energy infrastructure spending, which reached $1.1 trillion globally in 2024. Morgan Stanley estimates that implementation of the agreement's provisions could drive that figure to over $2 trillion annually by 2030.</p>
      
      <h2>Implementation Challenges</h2>
      
      <p>Despite the diplomatic achievement, significant challenges remain in translating the agreement into effective policy action. Many nations will need to substantially revise their domestic energy and industrial policies, potentially facing resistance from affected industries and communities.</p>
      
      <p>"The hard work begins now," noted Fatima Ndiaye, climate minister for Senegal. "These targets are what science demands, but meeting them will require unprecedented economic transformation, particularly for developing nations still working to lift their populations out of poverty."</p>
      
      <p>Critics also point out that even if fully implemented, the agreement may not be sufficient to limit global warming to 1.5 degrees Celsius above pre-industrial levels – the threshold scientists consider necessary to avoid the most catastrophic climate impacts.</p>
      
      <h2>Looking Ahead</h2>
      
      <p>The agreement establishes a series of technical working groups to begin developing implementation frameworks immediately. A follow-up ministerial conference is scheduled for November in Nairobi to assess early progress and address emerging challenges.</p>
      
      <p>Perhaps most significantly, the agreement includes legally binding enforcement mechanisms through the International Court of Justice, representing a new level of accountability in international climate governance.</p>
      
      <p>Environmental advocacy groups have generally welcomed the agreement while emphasizing the need for vigilant monitoring of implementation. "This is the climate agreement we've been waiting for," said Greenpeace International Director Juan Moreno. "But promises without action won't save our planet. We'll be watching closely to ensure governments deliver on these historic commitments."</p>
    `,
    imageUrl: "/images/blog/climate-summit.jpg",
    category: "world",
    subcategory: "environment",
    author: "Sarah Johnson",
    authorTitle: "Environmental Policy Correspondent",
    authorBio: "Sarah Johnson specializes in international environmental policy, with a focus on climate agreements and sustainable development.",
    authorImageUrl: "/images/authors/sarah-johnson.jpg",
    date: "March 1, 2025",
    readTime: "5 min read",
    featured: true,
    location: "Singapore",
    relatedPosts: [3, 10]
  },
  {
    id: 2,
    title: "Breakthrough in Quantum Computing Challenges Encryption Standards",
    excerpt: "Researchers have achieved quantum supremacy in a new domain, raising urgent questions about the security of current encryption methods...",
    imageUrl: "/images/blog/quantum-computing.jpg",
    category: "technology",
    subcategory: "cybersecurity",
    author: "Dr. Michael Chen",
    date: "February 28, 2025",
    readTime: "7 min read",
    featured: true,
    relatedPosts: [9, 4]
  },
  {
    id: 3,
    title: "Market Volatility Continues as Central Banks Adjust Policies",
    excerpt: "Global markets reacted sharply to unexpected policy shifts from major central banks, with tech stocks experiencing significant fluctuations...",
    imageUrl: "/images/blog/market-volatility.jpg",
    category: "business",
    subcategory: "finance",
    author: "Robert Kumar",
    date: "February 27, 2025",
    readTime: "4 min read",
    featured: true,
    relatedPosts: [1, 5]
  },
  {
    id: 4,
    title: "New Research Challenges Understanding of Dark Matter",
    excerpt: "Astronomical observations from the James Webb Space Telescope have led scientists to reconsider fundamental theories about dark matter...",
    imageUrl: "/images/blog/dark-matter.jpg",
    category: "science",
    subcategory: "astronomy",
    author: "Dr. Elena Vasquez",
    date: "February 26, 2025",
    readTime: "6 min read",
    featured: false,
    relatedPosts: [2, 9]
  },
  {
    id: 5,
    title: "EU Passes Landmark Digital Rights Legislation",
    excerpt: "The European Union has approved comprehensive new laws governing AI, data protection, and online content moderation...",
    imageUrl: "/images/blog/eu-legislation.jpg",
    category: "politics",
    subcategory: "regulation",
    author: "Hans Müller",
    date: "February 25, 2025",
    readTime: "5 min read",
    featured: false,
    relatedPosts: [3, 9]
  },
  {
    id: 6,
    title: "Breakthrough Treatment Shows Promise for Alzheimer's Disease",
    excerpt: "Clinical trials of a novel immunotherapy approach have demonstrated significant cognitive improvements in early-stage Alzheimer's patients...",
    imageUrl: "/images/blog/alzheimers-research.jpg",
    category: "health",
    subcategory: "research",
    author: "Dr. James Wilson",
    date: "February 24, 2025",
    readTime: "8 min read",
    featured: false,
    relatedPosts: [4, 9]
  },
  {
    id: 7,
    title: "Ukraine Peace Talks Resume After Military Stalemate",
    excerpt: "Diplomatic negotiations have restarted following a prolonged stalemate on the eastern front, with cautious optimism from international observers...",
    imageUrl: "/images/blog/ukraine-talks.jpg",
    category: "world",
    subcategory: "conflict",
    author: "Olena Kovalenko",
    date: "February 23, 2025",
    readTime: "6 min read",
    featured: false,
    subBlog: "ukraine",
    relatedPosts: [8, 11]
  },
  {
    id: 8,
    title: "Humanitarian Aid Reaches Gaza as Ceasefire Holds",
    excerpt: "Aid convoys have successfully delivered critical supplies to civilians in Gaza as the temporary ceasefire enters its second week...",
    imageUrl: "/images/blog/gaza-aid.jpg",
    category: "world",
    subcategory: "humanitarian",
    author: "Tariq Masri",
    date: "February 22, 2025",
    readTime: "5 min read",
    featured: false,
    subBlog: "palestine",
    relatedPosts: [7, 12]
  },
  {
    id: 9,
    title: "Major Tech Companies Announce Collaborative Approach to AI Safety",
    excerpt: "Leading technology firms have formed an unprecedented alliance to address safety and ethical concerns in advanced AI development...",
    imageUrl: "/images/blog/ai-safety.jpg",
    category: "technology",
    subcategory: "ai",
    author: "Jessica Wong",
    date: "February 21, 2025",
    readTime: "6 min read",
    featured: false,
    relatedPosts: [2, 5]
  },
  {
    id: 10,
    title: "Record-Breaking Renewable Energy Adoption in Developing Nations",
    excerpt: "Several developing countries have surpassed expectations in renewable energy deployment, creating new models for sustainable development...",
    imageUrl: "/images/blog/renewable-energy.jpg",
    category: "environment",
    subcategory: "sustainability",
    author: "Carlos Mendoza",
    date: "February 20, 2025",
    readTime: "5 min read",
    featured: false,
    relatedPosts: [1, 3]
  },
  {
    id: 11,
    title: "Russian Forces Withdraw from Key Ukrainian Border Region",
    excerpt: "Strategic redeployment signals a shift in Russian military strategy as international sanctions continue to impact logistics...",
    imageUrl: "/images/blog/russian-withdrawal.jpg",
    category: "world",
    subcategory: "military",
    author: "Viktor Petrov",
    date: "February 19, 2025",
    readTime: "7 min read",
    featured: false,
    subBlog: "ukraine",
    relatedPosts: [7, 8]
  },
  {
    id: 12,
    title: "UN Security Council Votes on New Resolution for Gaza Reconstruction",
    excerpt: "A United Nations resolution for comprehensive rebuilding efforts in Gaza has received widespread support in the Security Council...",
    imageUrl: "/images/blog/gaza-reconstruction.jpg",
    category: "world",
    subcategory: "diplomacy",
    author: "Layla Hassan",
    date: "February 18, 2025",
    readTime: "6 min read",
    featured: false,
    subBlog: "palestine",
    relatedPosts: [8, 7]
  }
];

// Sample news categories mapping
const categoryLabels = {
  "world": "World",
  "politics": "Politics",
  "business": "Business",
  "technology": "Technology",
  "science": "Science",
  "health": "Health",
  "arts": "Arts & Culture",
  "sports": "Sports",
  "environment": "Environment",
};

// Category colors
const categoryColors = {
  "world": "bg-blue-600",
  "politics": "bg-red-600",
  "business": "bg-green-600",
  "technology": "bg-purple-600",
  "science": "bg-yellow-600",
  "health": "bg-teal-600",
  "arts": "bg-pink-600",
  "sports": "bg-orange-600",
  "environment": "bg-emerald-600",
};

export default function NewsPostPage({ params }: { params?: { postId?: string } }) {
  const postId = params?.postId ? Number(params.postId) : 0;

  // Find the current post
  const post = newsPosts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="mb-6 text-gray-600">The article you&apos;re looking for could not be found.</p>
        <Link href="/blogs/news" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Return to News
        </Link>
      </div>
    );
  }

  // Find related posts
  const relatedPosts = post.relatedPosts ? post.relatedPosts.map(id =>
    newsPosts.find(p => p.id === id)
  ).filter(Boolean) : [];

  // Get category info
  const categoryName = categoryLabels[post.category as keyof typeof categoryLabels] || post.category;
  const categoryColor = categoryColors[post.category as keyof typeof categoryColors] || "bg-gray-700";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/blogs/news" className="hover:text-blue-600 transition-colors">
              News
            </Link>
            <span>/</span>
            <Link
              href={`/blogs/news?category=${post.category}`}
              className="hover:text-blue-600 transition-colors"
            >
              {categoryName}
            </Link>
            {post.subcategory && (
              <>
                <span>/</span>
                <Link
                  href={`/blogs/news?subcategory=${post.subcategory}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
                </Link>
              </>
            )}
            {post.subBlog && (
              <>
                <span>/</span>
                <Link
                  href={`/blogs/news/${post.subBlog}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.subBlog.charAt(0).toUpperCase() + post.subBlog.slice(1)}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-3 mb-4">
                <Link
                  href={`/blogs/news?category=${post.category}`}
                  className={`text-xs font-bold px-2 py-1 rounded-md text-white ${categoryColor}`}
                >
                  {categoryName}
                </Link>

                {post.subcategory && (
                  <Link
                    href={`/blogs/news?subcategory=${post.subcategory}`}
                    className="text-xs font-medium px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    {post.subcategory.charAt(0).toUpperCase() + post.subcategory.slice(1)}
                  </Link>
                )}

                {post.subBlog && (
                  <Link
                    href={`/blogs/news/${post.subBlog}`}
                    className="text-xs font-medium px-2 py-1 rounded-md bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    {post.subBlog.charAt(0).toUpperCase() + post.subBlog.slice(1)}
                  </Link>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {post.title}
              </h1>

              <p className="text-xl text-gray-600 mb-6">{post.excerpt}</p>

              <div className="flex flex-wrap gap-6 items-center text-sm text-gray-600 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 mr-3 relative">
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
                    <p className="font-medium text-gray-900">{post.author}</p>
                    {post.authorTitle && <p className="text-xs text-gray-500">{post.authorTitle}</p>}
                  </div>
                </div>

                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  {post.date}
                </div>

                <div className="flex items-center">
                  <FaClock className="mr-2 text-gray-400" />
                  {post.readTime}
                </div>

                {post.location && (
                  <div className="flex items-center">
                    <FaGlobe className="mr-2 text-gray-400" />
                    {post.location}
                  </div>
                )}
              </div>

              {/* Social Sharing */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Share:</span>
                  <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <FaFacebookF className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors">
                    <FaTwitter className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors">
                    <FaLinkedinIn className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <FaEnvelope className="text-white" size={14} />
                  </button>
                </div>
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
                  <FaBookmark className="mr-1" size={14} />
                  Save Article
                </button>
              </div>
            </header>

            {/* Main Article Image */}
            <div className="relative h-[400px] mb-8 overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
              {/* Replace with actual image when available */}
              {/* <Image 
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
              /> */}
              <div className="absolute bottom-4 right-4 text-xs bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded">
                Source: Reuters
              </div>
            </div>

            {/* Article Content */}
            <article>
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-sm prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content || '<p>Content coming soon...</p>' }}
              />
            </article>

            {/* Tags and Author Bio */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              {/* Author Bio */}
              {post.authorBio && (
                <div className="mb-8 p-6 bg-gray-100 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 relative flex-shrink-0">
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
                      <h3 className="text-xl font-bold text-gray-900 mb-1">About {post.author}</h3>
                      {post.authorTitle && <p className="text-sm text-blue-600 mb-2">{post.authorTitle}</p>}
                      <p className="text-gray-700">{post.authorBio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Sharing - Bottom */}
              <div className="flex items-center justify-between py-4 border-y border-gray-200 mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Share this article:</span>
                  <button className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                    <FaFacebookF className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-sky-500 hover:bg-sky-600 flex items-center justify-center transition-colors">
                    <FaTwitter className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors">
                    <FaLinkedinIn className="text-white" size={14} />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 flex items-center justify-center transition-colors">
                    <FaEnvelope className="text-white" size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(relatedPost => (
                    <Link href={`/blogs/news/${relatedPost?.id}`} key={relatedPost?.id} className="group">
                      <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition-shadow h-full flex flex-col">
                        <div className="relative h-40">
                          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                          {/* Replace with actual image when available */}
                          {/* <Image 
                            src={relatedPost.imageUrl}
                            alt={relatedPost.title}
                            fill
                            className="object-cover"
                          /> */}
                          <div className="absolute top-3 left-3">
                            <span className={`text-xs font-bold px-2 py-1 rounded-md text-white ${categoryColors[relatedPost?.category as keyof typeof categoryColors] || 'bg-gray-700'
                              }`}>
                              {categoryLabels[relatedPost?.category as keyof typeof categoryLabels] || relatedPost?.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                            {relatedPost?.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 flex-grow line-clamp-2">
                            {relatedPost?.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                            <span>{relatedPost?.author}</span>
                            <span>{relatedPost?.date}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Previous/Next Navigation */}
            <div className="mt-12 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                {post.id > 1 ? (
                  <Link href={`/blogs/news/${post.id - 1}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors mb-4 sm:mb-0">
                    <FaArrowLeft className="mr-2" />
                    <span>Previous Article</span>
                  </Link>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}

                <Link href="/blogs/news" className="text-blue-600 hover:text-blue-800 transition-colors mb-4 sm:mb-0">
                  View All News
                </Link>

                {post.id < newsPosts.length ? (
                  <Link href={`/blogs/news/${post.id + 1}`} className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                    <span>Next Article</span>
                    <FaArrowRight className="ml-2" />
                  </Link>
                ) : (
                  <div></div> // Empty div to maintain spacing
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            {/* Latest News */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Latest News</h3>
              <ul className="space-y-4">
                {newsPosts.slice(0, 5).map(post => (
                  <li key={post.id}>
                    <Link href={`/blogs/news/${post.id}`} className="flex space-x-3 group">
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                        {/* Replace with actual image when available */}
                        {/* <Image 
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover"
                        /> */}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center mt-1">
                          <FaCalendarAlt className="text-gray-400 mr-1" size={10} />
                          <span className="text-xs text-gray-500">{post.date}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <li key={key}>
                    <Link
                      href={`/blogs/news?category=${key}`}
                      className="flex justify-between items-center py-2 px-3 rounded hover:bg-gray-200 transition-colors"
                    >
                      <span>{label}</span>
                      <span className={`text-xs text-white px-2 py-1 rounded-full ${categoryColors[key as keyof typeof categoryColors] || 'bg-gray-600'}`}>
                        {key === post.category ? 'Current' : ''}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Coverage */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white">
                <h3 className="text-lg font-bold">Special Coverage</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-3">
                  <li>
                    <Link href="/blogs/news/ukraine" className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Ukraine Conflict</span>
                      <FaArrowRight className="text-blue-600" size={12} />
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs/news/palestine" className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-100 transition-colors">
                      <span className="font-medium">Palestine Crisis</span>
                      <FaArrowRight className="text-blue-600" size={12} />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
              <p className="text-blue-100 text-sm mb-4">Get breaking news and analysis delivered to your inbox daily.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full py-2 px-4 rounded bg-white bg-opacity-20 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="terms" className="rounded text-blue-800" />
                  <label htmlFor="terms">I agree to the terms of service</label>
                </div>
                <button className="w-full py-2 px-4 bg-white text-blue-700 hover:bg-blue-50 rounded font-medium transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map CTA */}
      <div className="bg-gray-100 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 md:p-12 md:w-1/2">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Explore the News Map</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Visualize global news and events with our interactive News Map. Track developments in real time across the world.
                </p>
                <Link href="/maps/news" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  View Global News Map
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-80 relative">
                <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                {/* Replace with actual image when available */}
                {/* <Image 
                  src="/images/news-map-preview.jpg" 
                  alt="News Map Preview" 
                  fill
                  className="object-cover"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 