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
        setStats({ todayCount: 42 });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStats();
    const interval = setInterval(fetchTodayStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const count = stats?.todayCount || 42;

  if (loading) {
    return (
      <p className="text-center text-sm text-[#a0978a]">
        <span className="inline-block w-3 h-3 border border-[#c9a96e] border-t-transparent rounded-full animate-spin mr-2 align-middle" />
        Loading...
      </p>
    );
  }

  return (
    <p className="text-center text-sm text-[#a0978a]">
      🔮 {t("todayCounterText", {
        count: String(count),
        highlight: (chunks: React.ReactNode) => (
          <span className="text-[#c9a96e] font-bold">{chunks}</span>
        ),
      })}
    </p>
  );
}
