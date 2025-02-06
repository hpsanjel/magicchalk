"use client";
import Image from "next/image";
import { Calendar } from "lucide-react";
import useFetchData from "@/hooks/useFetchData";
import Link from "next/link";

export default function Blog() {
	const { data: blogs, loading } = useFetchData("/api/blogs", "blogs");

	if (loading) {
		return (
			<section id="blog" className="bg-white">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
					<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
						Loading <span className="text-red-500">Blogs</span>...
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Featured Article Skeleton */}
						<div className="flex flex-col justify-between mb-6 md:mb-0 h-96 sm:h-[400px] md:h-[745px] lg:h-[385px]">
							<h3 className="text-2xl font-bold mb-2">Featured</h3>
							<div className="group relative flex-1 overflow-hidden rounded-lg bg-gray-200 animate-pulse"></div>
						</div>

						{/* Recent Blogs Skeleton */}
						<div className="flex flex-col">
							<h3 className="text-2xl font-bold mb-2">Recent</h3>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{[...Array(4)].map((_, index) => (
									<div key={index} className="group bg-gray-200 rounded-lg shadow overflow-hidden animate-pulse">
										<div className="flex items-center p-3">
											<div className="relative w-20 h-20 flex-shrink-0 bg-gray-300 rounded"></div>
											<div className="ml-4 flex-1 space-y-2">
												<div className="h-4 bg-gray-300 rounded w-3/4"></div>
												<div className="h-3 bg-gray-300 rounded w-1/2"></div>
											</div>
										</div>
									</div>
								))}
							</div>
							<div className="mt-4 flex justify-end">
								<div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="blog" className="">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				<h2 className="text-3xl font-bold text-center mb-6 sm:mb-12">
					Our <span className="text-red-500">Blogs</span>
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{" "}
					{/* Featured Article */}
					<div className="flex flex-col justify-between mb-6 md:mb-0 h-96 sm:h-[400px] md:h-[745px] lg:h-[385px]">
						{" "}
						<h3 className="text-2xl font-bold mb-2">Featured</h3>
						<div className="group relative flex-1 overflow-hidden rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg">
							<Image src={blogs[0]?.blogMainPicture || "/placeholder.jpg"} alt={blogs[0]?.blogTitle || "alt"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
								<div className="absolute bottom-0 p-4 text-slate-200">
									<h1 className="text-xl md:text-2xl font-bold mb-2 cursor-pointer group-hover:text-red-300">
										<Link href={`/blogs/${blogs[0]?._id}`}>{blogs[0]?.blogTitle}</Link>
									</h1>{" "}
									<div className="flex items-center text-gray-300">
										<Calendar className="w-4 h-4 mr-2" />
										<span className="text-sm">{blogs[0]?.blogDate}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
					{/* Recent Blogs */}
					<div className="flex flex-col">
						<h3 className="text-2xl font-bold mb-2">Recent</h3>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							{blogs &&
								blogs.slice(1, 7).map((blog) => (
									<div key={blog._id} className="group bg-white rounded-lg shadow overflow-hidden transition-all duration-300 hover:shadow-md">
										<div className="flex items-center p-3">
											<div className="relative w-20 h-20 flex-shrink-0">
												<Image src={blog?.blogMainPicture || "/placeholder.jpg"} alt={blog?.blogTitle || "alt"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover rounded" />
											</div>
											<div className="ml-4 flex-1">
												<h2 className="text-md font-semibold text-gray-800 line-clamp-2 cursor-pointer group-hover:text-red-700 transition-colors duration-100 ease-in">{blog.blogTitle}</h2>
												<div className="flex items-center text-gray-500 mt-1">
													<Calendar className="w-3 h-3 mr-1" />
													<span className="text-xs">{blog?.blogDate}</span>
												</div>
											</div>
										</div>
									</div>
								))}
						</div>
						<div className="mt-4 flex justify-end">
							<Link href="/blogs" className="w-max underline">
								View All Blogs
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

// const advertisements = [
// 	{
// 		id: 1,
// 		image: "/event2.png",
// 		alt: "Advertisement 1",
// 		title: "Concert craze is increasing",
// 	},
// 	{
// 		id: 2,
// 		image: "/event3.png",
// 		alt: "Advertisement 2",
// 		title: "Standup Comedy has gained popularity",
// 	},
// ];

{
	/* Advertisements - Right Column */
}
{
	/* <div>
						<h3 className="text-2xl font-bold mb-2">Most Popular</h3>
						<div className="space-y-4">
							{advertisements.map((ad) => (
								<div key={ad.id} className="relative w-full h-56 aspect-[3/2] rounded-lg overflow-hidden shadow-md">
									<Image src={ad.image || "/placeholder.jpg"} alt={ad.alt || "alt"} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
									<p className="absolute bottom-4 bg-black bg-opacity-50 text-white hover:text-red-200 text-lg md:text-xl px-6 hover:scale-105 cursor-pointer transition-all ease-in-out duration-100">{ad.title}</p>
								</div>
							))}
							<Button variant="outline" href="/news" className="w-full text-center">
								View More Popular Blogs
							</Button>
						</div>
					</div> */
}
