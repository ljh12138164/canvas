// @ts-ignore
import PostCard from '@/app/(components)/PostCard';
// @ts-ignore
import { allPosts } from 'contentlayer/generated';
import { compareDesc, format, parseISO } from 'date-fns';

export default function Page() {
  const posts = allPosts.sort((a: any, b: any) => compareDesc(new Date(a.date), new Date(b.date)));

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-black">Next.js + Contentlayer Example</h1>
      {posts.map((post: any, idx: number) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}
