import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config";
import "./EditPost.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPostDetails = (attempt = 1) => {
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load post details");
        return res.json();
      })
      .then((data) => {
        setFormData({
          category: data.category || "",
          description: data.description || "",
        });
        if (data.image && data.image.url) {
          setCurrentImage(data.image.url);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (attempt < 2) {
          setTimeout(() => fetchPostDetails(attempt + 1), 2000);
        } else {
          setError(err.message || "Failed to load post details");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.category) {
      toast.error("Please select a category");
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
    if (newImage) {
      data.append("image", newImage);
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update post");
      }

      const updatedPost = await res.json();
      toast.success("Post updated successfully!");
      navigate(`/posts/${updatedPost._id}`);
    } catch (err) {
      toast.error("Error updating post: " + err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5 mb-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container text-center mt-5 mb-5">
        <i className="fa-solid fa-triangle-exclamation text-warning fs-1 mb-3"></i>
        <h3>Something went wrong</h3>
        <p className="text-danger mb-4">{error}</p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-primary px-4"
            onClick={() => fetchPostDetails(1)}
          >
            <i className="fa-solid fa-rotate-right me-2"></i> Try Again
          </button>
          <Link to="/posts" className="btn btn-secondary px-4">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="col-md-6 offset-md-3 mt-5 mb-5">
        <h2 className="edit-title">Edit Post</h2>
        <p className="edit-subtitle">Update your post details and image below</p>

        <form onSubmit={handleSubmit} className="edit-form" noValidate>
          {/* Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label edit-label">
              Category
            </label>
            <select
              className="form-select"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports &amp; Fitness</option>
              <option value="Gaming">Gaming</option>
              <option value="Games">Games</option>
              <option value="Cultural Event">Cultural Event</option>
            </select>
          </div>

          {/* Current Image & Upload New Image */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label edit-label">
              Post Image
            </label>
            {currentImage && (
              <div className="current-img-preview">
                <span className="current-img-text">Current Image:</span>
                <img src={currentImage} alt="Current post" />
              </div>
            )}
            <input
              type="file"
              className="form-control"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small className="text-muted d-block mt-1">
              Leave empty if you don't want to change the image.
            </small>
          </div>

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label edit-label">
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

          {/* Actions */}
          <div className="edit-actions">
            <button
              type="submit"
              className="btn edit-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Saving Changes...
                </>
              ) : (
                "Update Post"
              )}
            </button>
            <Link to={`/posts/${id}`} className="edit-cancel-btn">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
