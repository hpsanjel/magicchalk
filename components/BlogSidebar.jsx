import Link from "next/link";
import Image from "next/image";
import ShareLinks from "./ShareLinks";

export default function BlogSidebar({ blog, blogs }) {
	return (
		<div className="space-y-6">
			{/* Share Box */}
			<ShareLinks title={blog?.blogTitle} />

			{/* Other Blogs */}
			<div className="bg-white rounded-lg shadow-sm p-6">
				<h3 className="text-lg font-semibold text-gray-800 mb-4">Other posts</h3>
				<div className="space-y-4">
					{blogs.map((relBlog) => (
						<Link href={`/blog/${relBlog._id}`} key={relBlog._id} className="flex space-x-4 group">
							<div className="relative w-16 h-16 flex-shrink-0">
								<Image src={relBlog?.blogMainPicture || "Image"} alt={relBlog.blogTitle || "Blog Title"} fill className="object-cover rounded-md" />
							</div>
							<div>
								<h4 className="font-medium text-gray-800 group-hover:text-blue-600 transition duration-200">{relBlog.blogTitle}</h4>
								<p className="text-sm text-gray-500">{relBlog?.blogDate}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
