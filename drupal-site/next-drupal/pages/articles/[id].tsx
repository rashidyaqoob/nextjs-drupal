import { DrupalClient } from 'next-drupal'
import Image from 'next/image'
import { absoluteUrl } from 'lib/utils'

const client = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)

// Generate the static paths
export async function getStaticPaths() {
  const posts = await client.getResourceCollection('node--article')

  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))


  return {
    paths,
    fallback: false,
  }
}


export async function getStaticProps({ params }) {
  console.log(params.id)
  const post = await client.getResource('node--article', params.id, {
    params: {
      include: 'field_image',
    },
  })

  return {
    props: {
      post,
    },
  }
}

export default function ArticlePage({ post }) {
  console.log(post)
  return (
    <div className="article-container">
      <h1>{post.title}</h1>
      {post.field_image && (
        <Image
          src={absoluteUrl(post.field_image.uri.url)}
          alt={post.field_image.resourceIdObjMeta?.alt || 'Blog Image'}
          width={600}
          height={400}
        />
      )}
      <div className="article-body">
        <p>{post.body?.value.replace(/<\/?[^>]+(>|$)/g, '')}</p>
      </div>
    </div>
  )
}
