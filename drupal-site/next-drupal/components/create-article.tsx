import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CreateArticleForm({ onSubmitSuccess }) {
  const [title, setTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/create-article", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, bodyContent }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Article created successfully!");
        setTitle("");
        setBodyContent("");
        setTimeout(() => {
          onSubmitSuccess();
        }, 3000);

      } else {
        toast.error("Error creating article");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create article");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="heading">Create a New Article</h2>
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

        <button type="submit" className="button">Create Article</button>
      </form>

      {/* Toast container to display notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
