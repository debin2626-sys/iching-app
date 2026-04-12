"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Review {
  id: string;
  userName: string;
  userInitial: string;
  content: string;
  rating: number;
  time: string;
  locale: string;
}

export default function UserReviews() {
  const t = useTranslations("Home");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/today');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.reviews && data.data.reviews.length > 0) {
          setReviews(data.data.reviews);
        } else {
          // No real reviews available
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    
    const interval = setInterval(fetchReviews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // 自动轮播
  useEffect(() => {
    if (reviews.length <= 1) return;
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  // API failed or no reviews → don't render
  if (loading || error || reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return time.toLocaleDateString();
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "text-gold fill-gold" : "text-[var(--theme-text-secondary)]"}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-gold/5 border border-[var(--theme-border)] rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote size={20} className="text-gold" />
          <h3 className="text-lg font-bold text-[var(--theme-text-primary)]">
            {t('reviewsTitle') || 'User Reviews'}
          </h3>
        </div>
        
        {reviews.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={prevReview}
              className="p-1.5 rounded-lg bg-[var(--theme-bg-card)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-gold hover:border-[var(--theme-border-hover)] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextReview}
              className="p-1.5 rounded-lg bg-[var(--theme-bg-card)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] hover:text-gold hover:border-[var(--theme-border-hover)] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
              <span className="text-gold font-bold">
                {currentReview.userInitial}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--theme-text-primary)]">
                {currentReview.userName}
              </p>
              <p className="text-xs text-[var(--theme-text-secondary)]">
                {formatTime(currentReview.time)}
              </p>
            </div>
          </div>
          {renderStars(currentReview.rating)}
        </div>

        <div className="relative">
          <div className="absolute -left-2 top-0 text-4xl text-gold/20">&ldquo;</div>
          <p className="text-sm text-[var(--theme-text-secondary)] leading-relaxed pl-4">
            {currentReview.content}
          </p>
          <div className="absolute -right-2 bottom-0 text-4xl text-gold/20">&rdquo;</div>
        </div>
      </div>

      {reviews.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-gold w-4'
                  : 'bg-[var(--theme-text-secondary)] hover:bg-gold'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
