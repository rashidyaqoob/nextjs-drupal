import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function EditArticleForm({ post, onSubmitSuccess }) {
  const [title, setTitle] = useState(post.title);
  const [bodyContent, setBodyContent] = useState(post.body.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/edit-article/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, bodyContent }),
      });

      const result = await response.json();

      if (response.ok) {
        setTimeout(() => {
          onSubmitSuccess();
        }, 3000);
        toast.success("Article updated successfully!");
      } else {
        toast.error("Error updating article");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update article");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="heading">Edit Article</h2>
        <div className="formGroup">
          <label htmlFor="title" className="label">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="formGroup">
          <label htmlFor="bodyContent" className="label">Body</label>
          <textarea
            id="bodyContent"
            value={bodyContent}
            onChange={(e) => setBodyContent(e.target.value)}
            required
            className="textarea"
          />
        </div>

        <button type="submit" className="button">Update Article</button>
      </form>


      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
