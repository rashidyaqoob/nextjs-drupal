import { DrupalClient } from 'next-drupal';

export const drupal = new DrupalClient(process.env.NEXT_PUBLIC_DRUPAL_BASE_URL, {
  auth: {
    username: process.env.DRUPAL_USERNAME,
    password: process.env.DRUPAL_PASSWORD,
  },
});
