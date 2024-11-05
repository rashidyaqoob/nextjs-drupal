
import { drupal } from "lib/drupal";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { title, bodyContent } = req.body;


      const article = await drupal.createResource("node--article", {
        data: {
          attributes: {
            title: title,
            body: {
              value: bodyContent,
              format: "full_html",
            },
          },
        },
      });

      // Return success response
      res.status(200).json({ article });
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
