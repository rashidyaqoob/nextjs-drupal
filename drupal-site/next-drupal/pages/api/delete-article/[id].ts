import { drupal } from 'lib/drupal';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      // Call the Drupal delete resource method
      await drupal.deleteResource('node--article', id);
      return res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
      console.error('Error deleting article:', error);
      return res.status(500).json({ error: 'Failed to delete article' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
