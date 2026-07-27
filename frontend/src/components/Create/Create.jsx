import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config";
import "./Create.css";

export default function Create() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.category.trim()) {
      toast.error("Please enter a category");
      return;
    }
    if (!image) {
      toast.error("Please upload an image");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }

    setSubmitting(true);

    const data = new FormData();
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", image);

    try {
      const token = localStorage.getItem("token");
      if (!token || token === "null" || token === "undefined") {
        toast.error("You must be logged in to create a post.");
        navigate("/login");
        setSubmitting(false);
        return;
      }

      const res = await fetch(`${BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.status === 401 || res.status === 403) {
        const errData = await res.json().catch(() => ({}));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        toast.error(errData.error || "Session expired. Please log in again.");
        navigate("/login");
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to create post");
      }

      const newPost = await res.json();
      toast.success("Post created successfully!");
      navigate(`/posts/${newPost._id}`);
    } catch (err) {
      toast.error("Error creating post: " + err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="col-md-6 offset-3 mt-5 mb-5">
        <h2 className="create-title">Create a New Post</h2>

        <form onSubmit={handleSubmit} className="create-form" noValidate>
          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label create-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              name="category"
              placeholder="Enter category (e.g. Technology, Education)"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label create-label">
              Image
            </label>
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label create-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="4"
              placeholder="Write something about your post..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn create-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Creating...
              </>
            ) : (
              <>
                Create Post
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
