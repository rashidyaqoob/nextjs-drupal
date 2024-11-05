import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { absoluteUrl } from 'lib/utils';
import { drupal } from 'lib/drupal';
import CreateArticleForm from 'components/create-article';
import EditArticleForm from 'components/edit-article-form';
import { Layout } from 'components/layout';


export async function getStaticProps() {

  try {
    const posts = await drupal.getResourceCollection('node--article', {
      params: {
        include: 'field_image',
      },
    });

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


export default function ArticlesPage({ posts, menuItems }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [articles, setArticles] = useState(posts);
  const [showOptions, setShowOptions] = useState(null);


  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const toggleEditModal = (post) => {
    setCurrentPost(post);
    setEditModalOpen(!isEditModalOpen);
    setShowOptions(null);
  };

  const deleteArticle = async (postId) => {
    const confirmation = confirm('Are you sure you want to delete this article?');

    if (confirmation) {
      try {
        const response = await fetch(`/api/delete-article/${postId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setArticles(articles.filter((article) => article.id !== postId));
          alert('Article deleted successfully!');
        } else {
          alert('Error deleting the article.');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        alert('Failed to delete the article.');
      }
    }
  };



  return (
    <Layout>
    <div className="blog-container">
      <div className="header-container">
        <h1 className="font-bold text-3xl mb-4">Blog Articles</h1>
        <button onClick={toggleModal} className="create-article-button">
          Create New Article
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={toggleModal} className="modal-close-button">
              &times;
            </button>
            <CreateArticleForm onSubmitSuccess={toggleModal} />
          </div>
        </div>
      )}

      {isEditModalOpen && currentPost && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={() => toggleEditModal(null)} className="modal-close-button">
              &times;
            </button>
            <EditArticleForm post={currentPost} onSubmitSuccess={() => toggleEditModal(null)} />
          </div>
        </div>
      )}

      <ul className="post-list">
        {articles?.map((post) => (
          <li key={post.id} className="post-card__item">
            <div className="post-card">
              {/* Three-dot menu for edit/delete */}
              <div className="menu-dots">
                <button
                  className="three-dots-button"
                  onClick={() => setShowOptions(showOptions === post.id ? null : post.id)}
                >
                  &#x22EE;
                </button>
                {showOptions === post.id && (
                  <div className="options-dropdown">
                    <button onClick={() => toggleEditModal(post)} className="edit-option">
                      Edit
                    </button>
                    <button onClick={() => deleteArticle(post.id)} className="delete-option">
                      Delete
                    </button>
                  </div>
                )}
              </div>

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
      </Layout>
  );
}
