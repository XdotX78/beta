"use client";

import { PalestineCrisisContent } from "./PalestineCrisisContent";

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  location?: string;
  featured: boolean;
  tags?: string[];
}

// Initial posts for demonstration
const initialPosts: Post[] = [
  {
    slug: "gaza-humanitarian-crisis",
    title: "Gaza Humanitarian Crisis Deepens",
    excerpt: "Analysis of the growing humanitarian challenges in Gaza and international aid efforts.",
    imageUrl: "/images/blog/gaza-humanitarian.jpg",
    date: "2024-04-15",
    author: "Sarah Ahmed",
    readTime: "7 min read",
    location: "Gaza City",
    category: "humanitarian",
    tags: ["gaza", "humanitarian", "aid", "crisis"],
    featured: true
  },
  {
    slug: "peace-talks-developments",
    title: "Latest Developments in Peace Negotiations",
    excerpt: "Updates on diplomatic efforts and peace initiatives in the region.",
    imageUrl: "/images/blog/peace-talks.jpg",
    date: "2024-04-14",
    author: "Michael Cohen",
    readTime: "5 min read",
    location: "Cairo",
    category: "diplomacy",
    tags: ["peace-talks", "diplomacy", "negotiations"],
    featured: true
  },
  {
    slug: "healthcare-system-challenges",
    title: "Healthcare System Faces Unprecedented Challenges",
    excerpt: "Report on the current state of healthcare infrastructure and medical aid distribution.",
    imageUrl: "/images/blog/healthcare-crisis.jpg",
    date: "2024-04-13",
    author: "Dr. Emma Wilson",
    readTime: "6 min read",
    location: "Gaza Strip",
    category: "health",
    tags: ["healthcare", "medical-aid", "infrastructure"],
    featured: false
  }
];

export default function PalestineCrisisPage() {
  return <PalestineCrisisContent initialPosts={initialPosts} />;
} 