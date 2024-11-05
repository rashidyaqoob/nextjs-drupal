import { drupal } from 'lib/drupal';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const { title, bodyContent } = req.body;
      const updatedArticle = await drupal.updateResource('node--article', id, {
        data: {
          attributes: {
            title: title,
            body: {
              value: bodyContent,
              format: 'full_html',
            },
          },
        },
      });

      return res.status(200).json(updatedArticle);
    } catch (error) {
      console.error('Error updating article:', error);
      return res.status(500).json({ error: 'Failed to update article' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
