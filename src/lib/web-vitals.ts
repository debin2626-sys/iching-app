// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reportWebVitals(metric: any) {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    metric_id: metric.id,
    metric_delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
    metric_rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
  });
}
