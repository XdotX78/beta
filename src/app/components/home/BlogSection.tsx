import BlogCard from "./BlogCard";

export default function BlogSection() {
    const blogPreviews = [
        {
            title: "Understanding Today's Headlines",
            description: "In-depth coverage and analysis of current events, global politics, technology trends, and more.",
            imageSrc: "/images/enhanced/news-blog-preview.jpg",
            linkHref: "/blogs/news",
            category: "News & Analysis",
            categoryColor: "bg-indigo-600",
            accentColor: "text-indigo-600 hover:text-indigo-800"
        },
        {
            title: "Exploring the Unexplained",
            description: "Dive into conspiracy theories, unsolved mysteries, supernatural phenomena, and hidden histories.",
            imageSrc: "/images/enhanced/mysteries-blog-preview.jpg",
            linkHref: "/blogs/mysteries",
            category: "Mysteries & Enigmas",
            categoryColor: "bg-teal-600",
            accentColor: "text-teal-600 hover:text-teal-800"
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">Latest From Our Blogs</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Dive deeper with our thought-provoking articles and analysis.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {blogPreviews.map((blog, index) => (
                        <BlogCard
                            key={index}
                            title={blog.title}
                            description={blog.description}
                            imageSrc={blog.imageSrc}
                            linkHref={blog.linkHref}
                            category={blog.category}
                            categoryColor={blog.categoryColor}
                            accentColor={blog.accentColor}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 