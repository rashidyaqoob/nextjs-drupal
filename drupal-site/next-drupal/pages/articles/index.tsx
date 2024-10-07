import Image from 'next/image';
import Link from 'next/link';
import { absoluteUrl } from 'lib/utils';
import { drupal } from 'lib/drupal';

// Fetch the articles with images using getStaticProps
export async function getStaticProps() {
  try {
    const posts = await drupal.getResourceCollection('node--article',
      {
      params: {
        include: 'field_image',
      },
      });
    console.log("POSTS", posts)
    console.log(process.env.DRUPAL_CLIENT_ID, process.env.DRUPAL_CLIENT_SECRET)


    return {
      props: {
        posts,
      },
    };
  } catch (error) {
    console.error('Error fetching articles:', error);

    return {
      props: {
        posts: [],
        error: 'Failed to fetch articles. Please check your credentials.',
      },
    };
  }
}

export default function ArticlesPage({ posts }) {
  return (
    <div className="blog-container">
      <h1 className="font-bold text-3xl mb-4">Blog Articles</h1>
      <ul className="post-list">
        {posts?.map((post) => (
          <li key={post.id} className="post-card__item">
            <div className="post-card">
              {/* Display image if available */}
              {post.field_image && (
                <div className="post-image">
                  <Image
                    src={absoluteUrl(post.field_image.uri.url)}  // Use absolute URL for the image
                    alt={post.field_image.resourceIdObjMeta?.alt || 'Blog Image'}
                    width={150}
                    height={150}

                  />
                </div>
              )}

              <div className="post-content">
                <h2>{post.title}</h2>
                <p>{post.body?.summary || 'No summary available'}</p>
                <p>{post.body?.value.replace(/<\/?[^>]+(>|$)/g, '')}</p>

                <Link href={`/articles/${post.path.alias.replace('/blog/', '')}`}>
                  <span className="read-more">Read More</span>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
