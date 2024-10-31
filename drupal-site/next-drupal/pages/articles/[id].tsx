import Image from 'next/image';
import { absoluteUrl, fetchWithAuth } from 'lib/utils';
import { GetStaticPropsContext } from 'next';

// Generate the static paths
export async function getStaticPaths() {
  try {
    const postsResponse = await fetchWithAuth(`/jsonapi/node/article`)

    const posts = await postsResponse;

    if (!posts.data || posts.data.length === 0) {
      console.log('No posts found');
      return {
        paths: [],
        fallback: false,
      };
    }

    const paths = posts.data.map((post) => ({
      params: { id: post.path.alias.replace('/blog/', '') },
    }));
      console.log('jvg', paths)

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps(context) {
  const { id } = context.params;

  // Step 1: Fetch the alias using Basic Authentication
  const aliasResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/path_alias/path_alias?filter[alias]=/blog/${id}`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`),
        'Content-Type': 'application/vnd.api+json',
      },
    }
  );
  const aliasJson = await aliasResponse.json();
  console.log(aliasJson);

  if (!aliasJson.data || aliasJson.data.length === 0) {
    return {
      notFound: true,
    };
  }

  const nodeId = aliasJson?.data[0].attributes.path.replace('/node/', '');

  // Step 2: Fetch the node (article) using the internal node ID
  const nodeUuidResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article?filter[drupal_internal__nid]=${nodeId}`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`),
        'Content-Type': 'application/vnd.api+json',
      },
    }
  );
  const nodeUuidJson = await nodeUuidResponse.json();
  console.log(nodeUuidJson);

  if (!nodeUuidJson.data || nodeUuidJson.data.length === 0) {
    return {
      notFound: true,
    };
  }

  const nodeUuid = nodeUuidJson.data[0].id;

  // Step 3: Fetch the full article data using the UUID
  const postResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article/${nodeUuid}`,
    {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`),
        'Content-Type': 'application/vnd.api+json',
      },
    }
  );
  const post = await postResponse.json();

  // Step 4: Fetch the image URL using the "related" link from the article
  // const imageUrlResponse = await fetch(post.data.relationships.field_image.links.related.href, {
  //   headers: {
  //     'Authorization': 'Basic ' + btoa(`${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`),
  //     'Content-Type': 'application/vnd.api+json',
  //   },
  // });
  // const imageUrlJson = await imageUrlResponse.json();
  // const imageUrl = imageUrlJson.data.attributes.uri.url;

  return {
    props: {
      post,
      // imageUrl,
    },
  };
}

export default function ArticlePage({ post, imageUrl }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        {post?.data.attributes.title}
      </h1>

      <div className="mb-8">
        {/*  */}
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <div dangerouslySetInnerHTML={{ __html: post?.data.attributes.body.processed }} />
      </div>
    </div>
  );
}
