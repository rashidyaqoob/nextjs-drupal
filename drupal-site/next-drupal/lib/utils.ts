export function formatDate(input: string): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(input: string) {
  return `${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${input}`
}

export async function fetchWithAuth(endpoint) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.DRUPAL_USERNAME}:${process.env.DRUPAL_PASSWORD}`),
        'Content-Type': 'application/vnd.api+json',
      },
    }
  )
  return response.json();
}
