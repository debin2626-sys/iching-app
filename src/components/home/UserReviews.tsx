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
  const [error, setError] = useState<string | null>(null);

  // 默认评价数据（当API失败时使用）
  const defaultReviews: Review[] = [
    {
      id: '1',
      userName: 'Alex Chen',
      userInitial: 'A',
      content: 'The AI interpretation was surprisingly accurate and insightful. It helped me gain clarity on a difficult career decision.',
      rating: 5,
      time: new Date().toISOString(),
      locale: 'en'
    },
    {
      id: '2',
      userName: '王明',
      userInitial: '王',
      content: '易经占卜结合AI解读，既有传统智慧又有现代视角，对我的问题给出了非常有启发性的建议。',
      rating: 5,
      time: new Date().toISOString(),
      locale: 'zh'
    },
    {
      id: '3',
      userName: 'Sarah Johnson',
      userInitial: 'S',
      content: 'Beautiful interface and meaningful readings. The combination of ancient wisdom with modern technology is fascinating.',
      rating: 4,
      time: new Date().toISOString(),
      locale: 'en'
    },
    {
      id: '4',
      userName: '李芳',
      userInitial: '李',
      content: '作为易经爱好者，这个平台的解读质量让我惊喜。AI能够结合八字和卦象进行综合分析。',
      rating: 5,
      time: new Date().toISOString(),
      locale: 'zh'
    },
    {
      id: '5',
      userName: 'David Lee',
      userInitial: 'D',
      content: 'The coin tossing experience feels authentic, and the AI interpretation provides deep insights. Highly recommended!',
      rating: 5,
      time: new Date().toISOString(),
      locale: 'en'
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/today');
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        
        if (data.success && data.data.reviews.length > 0) {
          setReviews(data.data.reviews);
        } else {
          // 如果没有评价数据，使用默认数据
          setReviews(defaultReviews);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reviews');
        // 使用默认评价数据
        setReviews(defaultReviews);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    
    // 每10分钟刷新一次数据
    const interval = setInterval(fetchReviews, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  // 自动轮播
  useEffect(() => {
    if (reviews.length <= 1) return;
    
    const interval = setInterval(() => {
      nextReview();
    }, 5000); // 每5秒切换一次
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (loading) {
    return (
      <div className="p-6 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-xl">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-5 h-5 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm text-[#a0978a]">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const currentReview = reviews[currentIndex];

  // 格式化时间
  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return time.toLocaleDateString();
    }
  };

  // 渲染星级评分
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? "text-[#c9a96e] fill-[#c9a96e]" : "text-[#a0978a]"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-xl">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote size={20} className="text-[#c9a96e]" />
          <h3 className="text-lg font-bold text-[#f5f0e8]">
            {t('reviewsTitle') || 'User Reviews'}
          </h3>
        </div>
        
        {/* 导航按钮 */}
        {reviews.length > 1 && (
          <div className="flex gap-2">
            <button
              onClick={prevReview}
              className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(201,169,110,0.2)] text-[#a0978a] hover:text-[#c9a96e] hover:border-[rgba(201,169,110,0.4)] transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextReview}
              className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-[rgba(201,169,110,0.2)] text-[#a0978a] hover:text-[#c9a96e] hover:border-[rgba(201,169,110,0.4)] transition-colors"
              aria-label="Next review"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* 当前评价 */}
      <div className="space-y-4">
        {/* 用户信息和评分 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.3)] flex items-center justify-center">
              <span className="text-[#c9a96e] font-bold">
                {currentReview.userInitial}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#f5f0e8]">
                {currentReview.userName}
              </p>
              <p className="text-xs text-[#a0978a]">
                {formatTime(currentReview.time)}
              </p>
            </div>
          </div>
          
          {renderStars(currentReview.rating)}
        </div>

        {/* 评价内容 */}
        <div className="relative">
          <div className="absolute -left-2 top-0 text-4xl text-[rgba(201,169,110,0.2)]">"</div>
          <p className="text-sm text-[#a0978a] leading-relaxed pl-4">
            {currentReview.content}
          </p>
          <div className="absolute -right-2 bottom-0 text-4xl text-[rgba(201,169,110,0.2)]">"</div>
        </div>
      </div>

      {/* 指示器 */}
      {reviews.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[#c9a96e] w-4'
                  : 'bg-[#a0978a] hover:bg-[#c9a96e]'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}