import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config";
import "./ShowPage.css";

export default function ShowPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Get logged-in user from localStorage
  const stored = localStorage.getItem("user");
  const currentUser = stored ? JSON.parse(stored) : null;

  const fetchPostDetails = (attempt = 1) => {
    setLoading(true);
    setError(null);
    fetch(`${BASE_URL}/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found or server is starting up");
        return res.json();
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        if (attempt < 2) {
          setTimeout(() => fetchPostDetails(attempt + 1), 2000);
        } else {
          setError(err.message || "Failed to fetch post details");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchPostDetails();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeleting(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/posts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          throw new Error(errData.error || "Failed to delete post");
        }
        toast.success("Post deleted successfully!");
        navigate("/posts");
      } catch (err) {
        toast.error("Error deleting post: " + err.message);
        setDeleting(false);
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!currentUser) {
      toast.error("Please login to comment");
      return;
    }
    setSubmittingComment(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: commentText }),
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
        throw new Error(errData.error || "Failed to add comment");
      }
      const newComment = await res.json();
      setPost((prev) => ({
        ...prev,
        comment: [...(prev.comment || []), newComment],
      }));
      setCommentText("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
        throw new Error(errData.error || "Failed to delete comment");
      }
      setPost((prev) => ({
        ...prev,
        comment: prev.comment.filter((c) => c._id !== commentId),
      }));
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Check if current user is the owner of the post
  const isOwner =
    currentUser &&
    post &&
    post.owner &&
    (post.owner._id === currentUser.id || post.owner === currentUser.id);

  if (loading) {
    return (
      <div className="show-loading-container text-center py-5">
        <div className="show-spinner mb-3"></div>
        <p className="show-loading-text text-muted">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="show-error-container text-center py-5">
        <i className="fa-solid fa-triangle-exclamation show-error-icon text-warning mb-3 fs-1"></i>
        <h3>Something went wrong</h3>
        <p className="text-muted mb-4">{error}</p>
        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-primary px-4"
            onClick={() => fetchPostDetails(1)}
          >
            <i className="fa-solid fa-rotate-right me-2"></i> Try Again
          </button>
          <Link to="/posts" className="btn btn-outline-secondary px-4">
            <i className="fa-solid fa-arrow-left me-2"></i> Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
      <div className="container">
          <div className="col-md-6 offset-3 mt-5 mb-5">
            {/* Back link */}
            <Link to="/posts" className="show-back-link">
              <i className="fa-solid fa-arrow-left"></i> Back to Posts
            </Link>

            <div className="display-flex mt-3 mb-2">
          {post.owner && post.owner.username && (
                    <span className="show-author" style={{opacity: 0.8}} >
                      <i className="fa-regular fa-user"></i>
                      {post.owner.username}
                    </span>
                  )}
        </div>

            {/* Post Card */}
            <div className="show-card">
              {post.image && post.image.url && (
                <div className="show-img-wrapper">
                  <img
                    src={post.image.url}
                    alt={post.category}
                    className="show-img"
                  />
                </div>
              )}

              <div className="show-card-body mt-3">
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span className="show-category">{post.category}</span>
                </div>
                <p className="show-description">{post.description}</p>
                <div className="show-meta">
                  <span className="show-date">
                    <i className="fa-regular fa-calendar"></i>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  
                </div>
              </div>
            </div>

            {/* Only show Edit/Delete buttons if the logged-in user is the owner */}
            {isOwner && (
              <div className="d-flex gap-2 mt-4">
                <Link to={`/posts/${id}/edit`} className="btn btn-primary">Edit</Link>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}

            {/* ── Divider ── */}
            <hr className="show-section-divider" />

            {/* ── Leave a Comment Section ── */}
            <div className="show-comment-form-section">
              <h5 className="show-section-title">Leave a Comment</h5>
              {currentUser ? (
                <form onSubmit={handleCommentSubmit}>
                  <textarea
                    className="show-comment-textarea"
                    rows="4"
                    placeholder="Write your comment here..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <button
                    type="submit"
                    className="btn mt-2"
                    disabled={submittingComment}
                    style={{background:"linear-gradient(135deg, #6366f1 0%, #a855f7 100%)"}}
                  >
                    {submittingComment ? "Posting..." : "Submit"}
                  </button>
                </form>
              ) : (
                <p className="show-login-prompt">
                  <Link to="/login">Login</Link> to leave a comment.
                </p>
              )}
            </div>

            {/* ── Divider ── */}
            <hr className="show-section-divider" />

            {/* ── All Comments Section ── */}
            <div className="show-comments-section">
              <h5 className="show-section-title">
                All Comments
              </h5>

              {post.comment && post.comment.length > 0 ? (
                post.comment.map((c) => (
                  <div className="show-comment-card" key={c._id}>
                    <div className="show-comment-header">
                      <span className="show-comment-username">
                        <i className="fa-regular fa-user"></i>
                        {c.author && c.author.username
                          ? c.author.username
                          : "Unknown"}
                      </span>
                      <span className="show-comment-date">
                        {new Date(c.CreatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="show-comment-text">{c.comment}</p>
                    {currentUser && c.author && c.author._id === currentUser.id && (
                      <button
                        className="show-comment-delete-btn"
                        onClick={() => handleDeleteComment(c._id)}
                      >
                        <i className="fa-regular fa-trash-can"></i> Delete
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="show-no-comments">No comments yet. Be the first to comment!</p>
              )}
            </div>
    
        </div>
      </div>
  );
}

