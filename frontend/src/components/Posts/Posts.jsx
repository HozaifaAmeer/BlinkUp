import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiFetch, PRIMARY_URL } from "../../config";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Loading posts...");
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const fetchPosts = async (attempt = 1) => {
    setLoading(true);
    setError(null);

    if (attempt > 1) {
      setStatusMessage(`Waking up server, please wait a moment (attempt ${attempt}/3)...`);
    } else {
      setStatusMessage("Loading posts... (waking up server if inactive)");
    }

    try {
      // Use apiFetch helper which tries primary URL and falls back to localhost if primary fails
      const res = await apiFetch("/posts");

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch posts attempt", attempt, "failed:", err);

      if (attempt < 3) {
        setStatusMessage(`Server is waking up, retrying in 2 seconds...`);
        setTimeout(() => {
          fetchPosts(attempt + 1);
        }, 2000);
      } else {
        setError(
          "Unable to connect to the backend server. If using local dev, ensure the backend is running (`npm start` in /backend on port 8000). If deployed, the server may take up to 45 seconds to wake up on Render."
        );
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts by category (case-insensitive partial match)
  const filteredPosts = searchQuery
    ? posts.filter((post) =>
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const clearSearch = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="posts-loading-container text-center py-5">
        <div className="posts-spinner mb-3"></div>
        <p className="posts-loading-text fw-medium text-secondary">{statusMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posts-error-container text-center py-5">
        <i className="fa-solid fa-triangle-exclamation posts-error-icon mb-3 text-warning fs-1"></i>
        <h3>Something went wrong</h3>
        <p className="text-muted mb-4">{error}</p>
        <button
          className="btn btn-primary px-4 py-2"
          onClick={() => fetchPosts(1)}
          style={{ borderRadius: "8px", fontWeight: "600" }}
        >
          <i className="fa-solid fa-rotate-right me-2"></i> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="posts-page">
      {/* Header */}
      <div className="posts-header">
        <div className="container">
          <div className="posts-header-content">
            <h1 className="posts-header-title">
              Explore <span className="gradient-text">All Posts</span>
            </h1>
            <p className="posts-header-subtitle">
              Discover what the community is sharing — from education to entertainment and everything in between.
            </p>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="container posts-grid-wrapper">
        {/* Active search filter indicator */}
        {searchQuery && (
          <div className="posts-search-filter">
            <span>
              Showing results for category: <strong>"{searchQuery}"</strong>
              {" "}({filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"})
            </span>
            <button className="posts-clear-search-btn" onClick={clearSearch}>
              <i className="fa-solid fa-xmark"></i> Clear
            </button>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="posts-empty">
            <i className="fa-regular fa-face-meh posts-empty-icon"></i>
            <h3>{searchQuery ? "No posts found" : "No posts yet"}</h3>
            <p>
              {searchQuery
                ? `No posts match the category "${searchQuery}".`
                : "Be the first to share something with the community!"}
            </p>
            {searchQuery && (
              <button className="btn btn-primary mt-2" onClick={clearSearch}>
                View All Posts
              </button>
            )}
          </div>
        ) : (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <Link to={`/posts/${post._id}`} className="post-card-link" key={post._id}>
                <div className="post-card">
                  {post.image && post.image.url && (
                    <div className="post-card-img-wrapper">
                      <img
                        src={`${post.image.url}?w=400&auto=format&fit=crop&q=75`}
                        alt={post.category}
                        className="post-card-img"
                        loading="lazy"
                      />
                      <div className="post-card-img-overlay"></div>
                    </div>
                  )}
                  <div className="post-card-body">
                    <span className="post-card-category">{post.category}</span>
                    {/* <p className="post-card-description">{post.description}</p> */}
                    <div className="post-card-footer">
                      <span className="post-card-date">
                        <i className="fa-regular fa-clock"></i>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

