"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users } from 'lucide-react';

interface TodayStats {
  todayCount: number;
}

export default function TodayCounter() {
  const t = useTranslations("Home");
  const [stats, setStats] = useState<TodayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/today');
        
        if (!response.ok) {
          throw new Error('Failed to fetch today stats');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching today stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load stats');
        // 设置默认值
        setStats({ todayCount: 42 });
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStats();
    
    // 每5分钟刷新一次数据
    const interval = setInterval(fetchTodayStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-xl">
        <div className="w-5 h-5 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm text-[#a0978a]">Loading...</span>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="p-4 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-xl">
        <p className="text-sm text-[#a0978a] text-center">
          {stats?.todayCount || 42} people consulted today
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 p-4 bg-[rgba(201,169,110,0.05)] border border-[rgba(201,169,110,0.15)] rounded-xl">
      <Users size={18} className="text-[#c9a96e]" />
      <span className="text-sm text-[#f5f0e8] font-medium">
        <span className="text-[#c9a96e] font-bold">{stats?.todayCount || 42}</span>
        <span className="text-[#a0978a] ml-1">people consulted today</span>
      </span>
    </div>
  );
}