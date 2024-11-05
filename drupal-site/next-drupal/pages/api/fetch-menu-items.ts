export async function fetchMenuItems() {
  const response = await fetch("https://drupal-site.ddev.site/jsonapi/menu_link_content/menu_link_content");
  if (!response.ok) {
    throw new Error("Failed to fetch menu items");
  }

  const data = await response.json();

  data.data.map(item=> console.log(item))

  return data.data.map(item => ({
    title: item.attributes.title,
    url: item.attributes.link.uri.replace('internal:', '')
  }));
}


