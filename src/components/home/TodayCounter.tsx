"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface TodayStats {
  todayCount: number;
}

export default function TodayCounter() {
  const t = useTranslations("Home");
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/today');
        
        if (!response.ok) {
          throw new Error('Failed to fetch today stats');
        }
        
        const data: any = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching today stats:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStats();
    
    // 每5分钟刷新一次数据
    const interval = setInterval(fetchTodayStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Loading or error or no data → don't render
  if (loading || error || !stats) {
    return null;
  }

  return (
    <p className="text-xs text-[#a0978a] text-center mt-2">
      {t("todayCounterPrefix")}
      <span className="text-[#c9a96e] font-bold">{stats.todayCount}</span>
      {t("todayCounterSuffix")}
    </p>
  );
}
