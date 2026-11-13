"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "@/styles/reviews.module.css";

export default function ReviewsSectionClient({ initialReviews, userSession }) {
  const { data: session, status } = useSession();
  const resolvedSession =
    session || (userSession ? { user: userSession } : null);

  const [reviews, setReviews] = useState(initialReviews);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [rating, setRating] = useState(5); // default 5 stars

  // Review form state
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Ref to track if we need to open review dialog after session loads
  const pendingOpenReview = useRef(false);

  // On mount only: detect ?openReview=1 and set the pending flag
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("openReview") === "1") {
      // Mark as pending — do NOT strip URL yet, do NOT open dialog yet
      pendingOpenReview.current = true;

      // Scroll to reviews section so it's in view when dialog opens
      const section = document.querySelector("[data-reviews-section]");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Strip URL param immediately so refresh doesn't re-trigger
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("openReview");
      window.history.replaceState({}, "", cleanUrl.toString());
    }
  }, []); // runs only once on mount

  // Whenever session status changes, check if we have a pending open
  useEffect(() => {
    if (!pendingOpenReview.current) return;
    if (status === "loading") return; // still resolving, wait

    // Session is now resolved — open correct dialog
    pendingOpenReview.current = false;

    if (status === "authenticated" && resolvedSession?.user) {
      setReviewDialogOpen(true);
    } else {
      // Session didn't resolve (shouldn't happen after Google login, but be safe)
      setLoginDialogOpen(true);
    }
  }, [status, resolvedSession]);

  // Pre-fill name from session when dialog opens
  useEffect(() => {
    if (reviewDialogOpen && resolvedSession?.user) {
      setFormName(resolvedSession.user.name || "");
      setFormDesc("");
      setError("");
      setSuccess(false);
    }
  }, [reviewDialogOpen]);

  const CLONE_THRESHOLD = 6;
  const displayReviews =
    reviews.length === 0
      ? []
      : reviews.length >= CLONE_THRESHOLD
        ? [...reviews, ...reviews, ...reviews]
        : reviews; // just show as-is, no cloning, no fake duplicates

  // Auto-scroll animation
  useEffect(() => {
    if (!trackRef.current || reviews.length === 0) return;
    const track = trackRef.current;

    // If not cloning, no infinite scroll needed — just stop
    if (reviews.length < CLONE_THRESHOLD) return;

    let animId;
    let paused = false;

    const tick = () => {
      if (!paused && !isDragging.current) {
        track.scrollLeft += 0.6;
        const oneSetWidth = track.scrollWidth / 3;
        if (track.scrollLeft >= oneSetWidth * 2) {
          track.scrollLeft -= oneSetWidth;
        }
        if (track.scrollLeft <= 0) {
          track.scrollLeft += oneSetWidth;
        }
      }
      animId = requestAnimationFrame(tick);
    };

    track.scrollLeft = track.scrollWidth / 3;
    animId = requestAnimationFrame(tick);

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", resume);

    return () => {
      cancelAnimationFrame(animId);
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", resume);
    };
  }, [reviews]);

  // Drag-to-scroll (mouse)
  const onMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
    trackRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const stopDrag = () => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  // Touch support
  const onTouchStart = (e) => {
    startX.current = e.touches[0].pageX;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onTouchMove = (e) => {
    const x = e.touches[0].pageX;
    const walk = (startX.current - x) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current + walk;
  };

  const handlePostClick = () => {
    if (!resolvedSession?.user) {
      setLoginDialogOpen(true);
    } else {
      setReviewDialogOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // hard guard — block any re-entry
    setError("");

    if (!formName.trim() || !formDesc.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDesc.trim(),
          rating: rating,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review.");
        return; // finally will still run setSubmitting(false) ✓
      }

      const newReview = {
        _id: data.review._id,
        name: data.review.name,
        image: data.review.image || "",
        rating: data.review.rating,
        description: data.review.description,
        createdAt: data.review.createdAt,
      };

      // Dedupe guard: only add if this _id isn't already in state
      setReviews((prev) =>
        prev.some((r) => r._id === newReview._id) ? prev : [newReview, ...prev],
      );

      setSuccess(true);
      setTimeout(() => {
        setReviewDialogOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className={styles.reviewsSection} data-reviews-section>
      <div className={styles.sectionHeader}>
        <div className={styles.headerContent}>
          <h2 className={`section-title ${styles.sectionTitle}`}>
            What Our Clients Say
          </h2>
          <p className={`section-subtitle ${styles.sectionSubtitle}`}>
            Real experiences from farmers, builders, and landowners across
            Maharashtra
          </p>
        </div>
        <button className={styles.postReviewBtn} onClick={handlePostClick}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Post a Review
        </button>
      </div>

      {/* Carousel */}
      <div
        className={`${styles.carouselWrapper} ${reviews.length >= CLONE_THRESHOLD ? styles.carouselWrapperMasked : ""}`}
      >
        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div
            className={styles.track}
            ref={trackRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
          >
            {displayReviews.map((review, idx) => (
              <div className={styles.card} key={`${review._id}-${idx}`}>
                <div className={styles.cardTop}>
                  {review.image ? (
                    <img
                      src={review.image}
                      alt={review.name}
                      width={60}
                      height={60}
                      loading="lazy"
                      decoding="async"
                      className={styles.avatar}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className={styles.cardMeta}>
                    <span className={styles.reviewerName}>{review.name}</span>
                    <span className={styles.reviewDate}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={styles.star}>
                      ★
                    </span>
                  ))}
                  <span className={styles.ratingNum}>{review.rating}</span>
                </div>
                <p className={styles.reviewText}>{review.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Login Dialog */}
      {loginDialogOpen && (
        <div
          className={styles.overlay}
          onClick={() => setLoginDialogOpen(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeBtn}
              onClick={() => setLoginDialogOpen(false)}
              aria-label="Close"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className={styles.dialogIcon}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h3 className={styles.dialogTitle}>Share Your Experience</h3>
            <p className={styles.dialogSubtitle}>
              Sign in with your Google account to post a review. We&apos;ll use
              your Google profile to get started — no separate registration
              needed.
            </p>
            <button
              className={styles.googleBtn}
              disabled={signingIn}
              onClick={() => {
                setSigningIn(true);
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set("openReview", "1");
                signIn("google", { callbackUrl: currentUrl.toString() });
                // Note: we do NOT close the dialog here — page will navigate away
              }}
            >
              {signingIn ? (
                <>
                  <span
                    className={styles.spinner}
                    style={{
                      borderTopColor: "#4285F4",
                      borderColor: "rgba(66,133,244,0.2)",
                    }}
                  />
                  Redirecting to Google...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Review Submit Dialog */}
      {reviewDialogOpen && (
        <div
          className={styles.overlay}
          onClick={() => {
            if (!submitting) setReviewDialogOpen(false);
          }}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            {!success ? (
              <>
                <button
                  className={styles.closeBtn}
                  onClick={() => setReviewDialogOpen(false)}
                  disabled={submitting}
                  aria-label="Close"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
                <div className={styles.dialogUserRow}>
                  {resolvedSession?.user?.image ? (
                    <img
                      src={resolvedSession.user.image}
                      alt={resolvedSession.user.name}
                      width={48}
                      height={48}
                      className={styles.dialogAvatar}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className={styles.avatarFallback}
                      style={{ width: 48, height: 48, fontSize: 20 }}
                    >
                      {resolvedSession?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className={styles.dialogUserName}>
                      {resolvedSession?.user?.name}
                    </p>
                    <p className={styles.dialogUserEmail}>
                      {resolvedSession?.user?.email}
                    </p>
                  </div>
                </div>
                <h3 className={styles.dialogTitle}>Write Your Review</h3>
                {error && <p className={styles.formError}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles.reviewForm}>
                  <div className={styles.formField}>
                    <label htmlFor="reviewName">Your Name</label>
                    <input
                      id="reviewName"
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="How should we display your name?"
                      maxLength={80}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.label}>Rating</label>
                    <div className={styles.starsContainer}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`${styles.starBtn} ${star <= rating ? styles.filled : styles.empty}`}
                          onClick={() => setRating(star)}
                          disabled={submitting}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <span className={styles.ratingText}>
                      {rating} star{rating !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className={styles.formField}>
                    <label htmlFor="reviewDesc">
                      Your Experience
                      <span className={styles.charCount}>
                        {formDesc.length}/600
                      </span>
                    </label>
                    <textarea
                      id="reviewDesc"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Share your experience with M.M.S Water Diviners..."
                      rows={4}
                      minLength={10}
                      maxLength={600}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className={styles.spinner} />
                        Posting your review...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </button>
                  {submitting && (
                    <p className={styles.processingHint}>
                      Please wait, do not close this window
                    </p>
                  )}
                </form>
                <button
                  className={styles.signOutLink}
                  onClick={() => signOut({ callbackUrl: window.location.href })}
                  disabled={submitting}
                >
                  Not you? Sign out
                </button>
              </>
            ) : (
              <div className={styles.successState}>
                <div className={styles.successIcon}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <h3>Thank You!</h3>
                <p>
                  Your review has been posted and is now visible to everyone.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
