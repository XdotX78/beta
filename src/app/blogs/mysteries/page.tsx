import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaCalendarAlt, FaUser, FaArrowRight } from "react-icons/fa";

// Define the expected structure of the frontmatter
interface PostFrontmatter {
  title: string;
  date: string;
  author: string;
  description?: string;
  tags?: string[];
  featured?: boolean;
  imageUrl?: string; // Optional image URL from frontmatter
}

// Define the structure of the post object we'll use
interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  excerpt: string;
}

// Function to get posts - this runs on the server
function getMysteryPosts(): Post[] {
  const postsDirectory = path.join(process.cwd(), 'src/app/blogs/mysteries');

  try {
    const filenames = fs.readdirSync(postsDirectory);

    const mdxFiles = filenames.filter(
      (filename) => filename.endsWith('.mdx') && filename !== 'page.tsx'
    );

    const posts = mdxFiles.map((filename) => {
      const slug = filename.replace('.mdx', '');
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      // Basic excerpt generation (first 150 chars of content, replacing newlines)
      const excerpt = content.substring(0, 150).replace(/\n/g, ' ') + '...';

      return {
        slug,
        frontmatter: data as PostFrontmatter,
        excerpt,
      };
    });

    // Sort posts by date (newest first) - requires valid date strings
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

    return posts;
  } catch (error) {
    console.error("Error reading mystery posts:", error);
    return []; // Return empty array on error
  }
}

// Mystery categories with icons and descriptions
const categories = [
  { name: "Ancient Mysteries", slug: "ancient-mysteries", count: 42 },
  { name: "Unexplained Phenomena", slug: "unexplained-phenomena", count: 38 },
  { name: "Cryptids & Legends", slug: "cryptids", count: 27 },
  { name: "Paranormal", slug: "paranormal", count: 31 },
  { name: "Conspiracy Theories", slug: "conspiracy", count: 24 },
  { name: "Historical Enigmas", slug: "historical", count: 35 },
];

export default function MysteriesBlogPage() {
  const posts = getMysteryPosts(); // Fetch posts on the server

  // TODO: Re-implement search/filtering. 
  // For server components, filtering usually happens based on searchParams 
  // or requires a client component wrapper for interactive state.
  // For simplicity, showing all posts for now.
  const filteredPosts = posts;
  const featuredPosts = posts.filter(post => post.frontmatter.featured);

  // TODO: Dynamically generate categories from post tags if needed
  // const allTags = posts.flatMap(post => post.frontmatter.tags || []);
  // const categories = [...new Set(allTags)].map(tag => ({ name: tag, slug: tag, count: allTags.filter(t => t === tag).length }));

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Hero Section with Featured Posts */}
      <div className="relative bg-cover bg-center h-[60vh]"
        style={{
          backgroundImage: "url('/images/blog/mysteries-background.svg')",
          backgroundPosition: "center 20%"
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/30 to-gray-900/90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: "url('/images/blog/fog-overlay.svg')",
          backgroundSize: "cover",
          opacity: 0.4,
          mixBlendMode: "screen"
        }}></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center z-10">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white drop-shadow-lg"
          >
            Mysteries of the Unknown
          </h1>
          <p
            className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300 drop-shadow-md"
          >
            Exploring the unexplained, the enigmatic, and the extraordinary from around the world
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row">
          {/* Main Content */}
          <div className="w-full md:w-2/3 md:pr-8">
            {/* Featured Articles Carousel */}
            {featuredPosts.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-purple-300 border-b border-purple-800 pb-2">Featured Mysteries</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredPosts.map(post => (
                    <Link href={`/blogs/mysteries/${post.slug}`} key={post.slug}>
                      <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.01] hover:shadow-purple-900/30 hover:shadow-lg">
                        <div className="relative h-48">
                          <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                          {/* Placeholder for image - load from post.frontmatter.imageUrl if available */}
                          {post.frontmatter.imageUrl && (
                            <Image
                              src={post.frontmatter.imageUrl}
                              alt={post.frontmatter.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-3">
                            {/* Display tags if available */}
                            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                              <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-purple-900 text-purple-300">
                                {post.frontmatter.tags[0]} {/* Show first tag */}
                              </span>
                            )}
                            <span className="text-xs text-gray-400 flex items-center">
                              <FaCalendarAlt className="mr-1" size={10} />
                              {new Date(post.frontmatter.date).toLocaleDateString()} {/* Format date */}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2 text-white">{post.frontmatter.title}</h3>
                          <p className="text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400 flex items-center">
                              <FaUser className="mr-1" size={12} />
                              {post.frontmatter.author}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles Grid */}
            <h2 className="text-2xl font-bold mb-6 text-purple-300 border-b border-purple-800 pb-2">Latest Articles</h2>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-400">No mysteries found.</p> {/* Updated message */}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredPosts.map(post => (
                  <Link href={`/blogs/mysteries/${post.slug}`} key={post.slug}>
                    <div className="bg-gray-800 rounded-lg overflow-hidden h-full flex flex-col transition-transform hover:scale-[1.01] hover:shadow-purple-900/30 hover:shadow-lg">
                      <div className="relative h-40">
                        <div className="absolute inset-0 bg-gray-700 animate-pulse"></div>
                        {/* Placeholder for image - load from post.frontmatter.imageUrl if available */}
                        {post.frontmatter.imageUrl && (
                          <Image
                            src={post.frontmatter.imageUrl}
                            alt={post.frontmatter.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4 flex-grow flex flex-col">
                        <div className="flex items-center mb-2">
                          {/* Display tags */}
                          {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                            <span className="text-xs font-medium mr-2 px-2.5 py-0.5 rounded bg-purple-900 text-purple-300">
                              {post.frontmatter.tags[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-white">{post.frontmatter.title}</h3>
                        <p className="text-gray-400 mb-3 text-sm line-clamp-2 flex-grow">{post.excerpt}</p>
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-auto">
                          <span className="flex items-center">
                            <FaCalendarAlt className="mr-1" size={10} />
                            {new Date(post.frontmatter.date).toLocaleDateString()} {/* Format date */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">Previous</button>
                <button className="px-3 py-1 rounded bg-purple-700 text-white">1</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">2</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">3</button>
                <button className="px-3 py-1 rounded border border-purple-700 text-purple-400 hover:bg-purple-900 transition-colors">Next</button>
              </nav>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-1/3 mt-10 md:mt-0">
            {/* Categories */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Categories</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center bg-gray-700 text-gray-300" 
                      }`}
                  >
                    <span>All Categories</span>
                    <span className="text-sm bg-gray-600 px-2 py-0.5 rounded-full">
                      {posts.length}
                    </span>
                  </button>
                </li>
                {[...new Set(posts.flatMap(p => p.frontmatter.tags || []))].map(tag => (
                  <li key={tag}>
                    <button
                      className={`w-full text-left px-3 py-2 rounded transition-colors flex justify-between items-center text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      <span>{tag}</span>
                      <span className="text-sm bg-gray-700 px-2 py-0.5 rounded-full">
                        {posts.filter(p => p.frontmatter.tags?.includes(tag)).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-white">Popular Posts</h3>
              <ul className="space-y-4">
                {(featuredPosts.length > 0 ? featuredPosts : posts).slice(0, 3).map(post => (
                  <li key={post.slug} className="flex space-x-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                      {/* Use a placeholder div if no image */}
                      {!post.frontmatter.imageUrl && (
                        <div className="absolute inset-0 bg-gray-700 flex items-center justify-center text-gray-500">
                          No Image
                        </div>
                      )}
                      {post.frontmatter.imageUrl && (
                        <Image
                          src={post.frontmatter.imageUrl}
                          alt={post.frontmatter.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <Link href={`/blogs/mysteries/${post.slug}`} className="hover:text-purple-300 transition-colors duration-200">
                      <h4 className="text-sm font-semibold text-gray-200">{post.frontmatter.title}</h4>
                      <span className="text-xs text-gray-400">{new Date(post.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                <button type="submit" className="w-full py-2 px-4 bg-purple-700 hover:bg-purple-600 text-white rounded font-medium transition-colors flex justify-center items-center">
                  Subscribe
                  <FaArrowRight className="ml-2" size={14} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Related Content - Map Link */}
      <div className="bg-gray-800 py-10">
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