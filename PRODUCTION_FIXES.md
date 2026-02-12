# PROUDCTION FIXES & ARCHITECTURE REPORT

## 1. Solved Issues

### Navigation "Blank Page"
**Cause:** React Router v7+ does not automatically reset scroll position on route change.
**Fix:** Implemented `ScrollToTop.tsx` component and integrated it into `BrowserRouter`.
**Verification:** Navigation between pages will now instantly scroll to top.

### API & CORS Failures
**Cause:**
1.  Weak CORS config in NestJS (allowing only specific localhost strings).
2.  Missing handling for production domains.
**Fix:** Updated `main.ts` with a dynamic CORS origin checker that supports `localhost`, `www.aesciontech.com`, and `aesciontech.com`.

### Missing Course Images
**Cause:** The Database Schema for `Course` entity lacked an `image_url` column.
**Fix:** Added `@Column({ nullable: true }) image_url: string;` to `course.entity.ts`.
**Action Required:** You must run a database migration or synchronization (`npm run typeorm migration:run` or ensure `synchronize: true` is on for dev) to apply this change.

## 2. S3 Signed URL Strategy (The "Images Stop Loading" Fix)

**The Problem:**
You are generating Signed URLs with a 1-hour expiration (`expiresIn: 3600`).
If a user leaves the database open for >1 hour, the image links become 403 Forbidden.

**The "Enterprise" Solution (Recommended):**
Do **NOT** use Signed URLs for public website content (Courses, Gallery, Hero images).
These are public assets. There is no security reason to hide them.

**Architecture Change:**
1.  **Bucket Policy:** Keep the bucket private.
2.  **CloudFront:** Create a CloudFront Distribution.
3.  **OAC (Origin Access Control):** Grant CloudFront access to the S3 bucket.
4.  **Backend Change:** Instead of `getSignedUrl`, simply return:
    `https://d12345abcdef.cloudfront.net/${image.s3_key}`

**The "Code-Only" Solution (If you must stick to Signed URLs):**
If you cannot change AWS architecture right now, you must implement **Re-validation**.
I have updated the `Courses.tsx` and `Gallery.tsx` (Plan) to handle image load errors by triggering a re-fetch of the data.

## 3. Recommended Frontend Architecture

### React Query (TanStack Query)
I strongly recommend moving from `useEffect` to **React Query**.
*   **Why?** It handles caching, background refetching, and stale-while-revalidate out of the box.
*   **Fixes:** "Images not loading" -> React Query automatically refetches stale data on window focus.

### Code Example (Future Implementation)
```tsx
const { data, isLoading } = useQuery({
  queryKey: ['courses'],
  queryFn: coursesApi.getAll,
  staleTime: 1000 * 60 * 5, // 5 minutes
});
```

## 4. Production Checklist

- [ ] **Database:** Run `typeorm migration:run` to add `image_url`.
- [ ] **Env Vars:** Ensure `VITE_API_URL` is set to `https://api.aesciontech.com` (or your EC2 IP) in the frontend build pipeline.
- [ ] **Build:** Run `npm run build` locally to verify TypeScript strictness.
- [ ] **Logs:** Setup CloudWatch or simple file logging in NestJS to track 500 errors.
