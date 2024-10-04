import { DrupalClient } from 'next-drupal'
import Image from 'next/image'
import { absoluteUrl } from 'lib/utils'
import Link from 'next/link'
import { drupal } from 'lib/drupal'
import { GetStaticPropsContext } from 'next'

const client = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)

export async function getStaticProps() {
  const posts = await client.getResourceCollection('node--article', {
    params: {
      include: 'field_image',
       sort: "-created",
    },
  })

  return {
    props: {
      posts,
    },
  }
}

export default function ArticlesPage({ posts }) {

  return (
    <div className="blog-container ">
      <h1 className='font-bold text-3xl mb-4'>Blog Articles</h1>
      <ul className="post-list">
        {posts?.map((post) => (
          <li key={post.id} className="post-card__item">
            <div className="post-card">
              {post.field_image && (
                <div className="post-image">
                  <Image
                    src={absoluteUrl(post.field_image.uri.url)}
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
  )
}
