// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reportWebVitals(metric: any) {
  // Log to console for now; plug into analytics platform later
  console.log(`[Web Vitals] ${metric.name}:`, {
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  })
}
