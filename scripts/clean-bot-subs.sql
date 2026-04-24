-- clean-bot-subs.sql
-- Preview suspected bot subscriptions:
-- Pattern: unverified Gmail addresses with dots (likely dot-variant spam)

-- Step 1: Preview (run this first)
SELECT id, email, school, verified, "createdAt"
FROM "EmailSubscription"
WHERE verified = false
  AND (email LIKE '%@gmail.com' OR email LIKE '%@googlemail.com')
  AND SPLIT_PART(email, '@', 1) LIKE '%.%'
ORDER BY "createdAt" DESC
LIMIT 4;

-- Step 2: Delete (uncomment to execute)
-- DELETE FROM "EmailSubscription"
-- WHERE verified = false
--   AND (email LIKE '%@gmail.com' OR email LIKE '%@googlemail.com')
--   AND SPLIT_PART(email, '@', 1) LIKE '%.%';
