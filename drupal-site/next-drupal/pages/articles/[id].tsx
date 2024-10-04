import { DrupalClient } from 'next-drupal'
import Image from 'next/image'
import { absoluteUrl } from 'lib/utils'
import { GetStaticPropsContext } from 'next'

const client = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL)

// Generate the static paths
export async function getStaticPaths() {
  const posts = await client.getResourceCollection('node--article');

  const paths = posts.map((post) => ({
    params: { id: post.path.alias.replace('/blog/', '') }, // Replace as per your path
  }));

  console.log('Paths:', paths);

  return {
    paths,
    fallback: false,
  };
}


// export async function getStaticProps({ params }) {
//   console.log(params.id)
//   const post = await client.getResource('node--article', params.id, {
//     params: {
//       include: 'field_image',
//     },
//   })

//   return {
//     props: {
//       post,
//     },
//   }
// }

export async function getStaticProps(context) {
  const { id } = context.params;

  // Step 1: Fetch the path alias to get the corresponding system path (e.g., /node/4)
  const aliasResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/path_alias/path_alias?filter[alias]=/blog/${id}`
  );
  const aliasJson = await aliasResponse.json();

  if (aliasJson.data.length === 0) {
    return {
      notFound: true, // If no alias is found, return a 404 page
    };
  }

  // Step 2: Extract the internal node ID (nid) from the alias response
  const nodeId = aliasJson.data[0].attributes.path.replace('/node/', '');

  // Step 3: Fetch the node to get the UUID using the node ID
  // You need to query Drupal to get the UUID for the node
  const nodeUuidResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article?filter[drupal_internal__nid]=${nodeId}`
  );
  const nodeUuidJson = await nodeUuidResponse.json();

  if (!nodeUuidJson.data || nodeUuidJson.data.length === 0) {
    return {
      notFound: true,
    };
  }

  // Step 4: Fetch the article using the UUID
  const nodeUuid = nodeUuidJson.data[0].id; // The UUID of the node
  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article/${nodeUuid}`
  );
   const post = await postResponse.json();

  // Step 5: Fetch the image URL using the "related" link from the article
  const imageUrlResponse = await fetch(post.data.relationships.field_image.links.related.href);
  const imageUrlJson = await imageUrlResponse.json();
  const imageUrl = imageUrlJson.data.attributes.uri.url; // This contains the file URL for the image
console.log(imageUrl)
  return {
    props: {
      post: post,
      imageUrl: imageUrl,
    },
  };
}





export default function ArticlePage({ post, imageUrl }) {

  return (

    <div className="article-container">
      <h1>{post.data.attributes.title}</h1>
<div>
      {post.data.relationships.field_image.data && (
        <Image
          src={absoluteUrl(imageUrl)}
          alt={post.data.relationships.field_image.data.meta.alt || 'Blog Image'}
          width={600}
          height={400}
        />
      )}
      </div>
      <div className="article-body">
        <div dangerouslySetInnerHTML={{ __html: post.data.attributes.body.processed }} />
      </div>
    </div>
  )
}
