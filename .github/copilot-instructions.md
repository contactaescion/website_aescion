# AI Coding Agent Instructions for AESCION Website

## Architecture Overview

This is a full-stack monorepo: **React + Vite** (frontend, port 5173) and **NestJS** (backend, port 3000). The frontend communicates with the backend via Axios, which auto-injects JWT tokens from `sessionStorage.access_token` (see `frontend/src/api/client.ts`). Database defaults to SQLite in dev, MySQL in production.

**Key pattern**: All backend modules follow NestJS structure: `controller → service → repository`. Controllers define routes, services contain business logic, and repositories use TypeORM entities.

## Major Components & Data Flows

### Backend Modules
- **auth/**: JWT authentication with Passport. `RolesGuard` enforces RBAC via `@Roles()` decorator on controllers
- **users/**: User CRUD tied to auth (admin accounts only)
- **courses/**: Course management with search support
- **gallery/**: AWS S3 image uploads with mock fallback (see `uploadFile` method)
- **enquiries/**: Contact form handling; triggers `MailService.sendEnquiryNotification()` after save
- **mail/**: Centralized email service using Nodemailer (SMTP via Gmail)
- **analytics/**: Tracks visitor sessions using `x-session-id` header from frontend
- **search/**: Aggregates results from courses and gallery

### Frontend Architecture
- **api/**: Each resource gets its own file (`courses.ts`, `auth.ts`, etc.) exporting CRUD methods
- **components/**: Organized by type: `common/` (reusable), `layout/` (Navbar/Footer), `sections/` (page blocks), `ui-kit/` (primitives)
- **pages/**: Public landing page (lazy-loaded sections) and `/admin` dashboard (JWT-protected via router)

## Critical Developer Workflows

### Backend Development
```bash
# Terminal commands (from backend/ directory)
npm run start:dev          # Watch mode (recommended for development)
npm run build             # Compile TypeScript to dist/
npm run seed              # Run seed.ts to populate test data
npm run test              # Jest unit tests
npm run test:e2e          # E2E tests from test/
npm run lint              # ESLint with auto-fix
npm run format            # Prettier formatting
```

### Frontend Development
```bash
# Terminal commands (from frontend/ directory)
npm run dev               # Vite dev server
npm run build            # TypeScript + Vite production build
npm run lint             # ESLint check
```

### Database Setup
- **Development**: SQLite auto-syncs on app start (`synchronize: true` in `app.module.ts`)
- **Production**: Set `DB_TYPE=mysql` in `.env`; requires RDS instance configured in app.module.ts

## Project-Specific Conventions

### NestJS Module Pattern
Every feature module imports TypeORM and uses `@InjectRepository(Entity)` to inject repositories. Example from `courses/`:

```typescript
// courses.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}

// courses.service.ts
@Injectable()
export class CoursesService {
  constructor(@InjectRepository(Course) private repo: Repository<Course>) {}
  
  findAll() {
    return this.repo.find();
  }
}
```

### Authentication & Role-Based Access
- JWT secret from `JWT_SECRET` env var
- Guards enforce roles: `@UseGuards(RolesGuard) @Roles(UserRole.ADMIN)` on protected endpoints
- Frontend checks auth via `sessionStorage.access_token`; logout clears token and redirects to `/admin/login`

### API Client Pattern (Frontend)
All frontend API calls follow this structure:

```typescript
export const courses = {
  getAll: async () => {
    const response = await client.get<Course[]>('/courses');
    return response.data;
  },
  create: async (data: Partial<Course>) => {
    const response = await client.post<Course>('/courses', data);
    return response.data;
  },
};
```

**Important**: `client` auto-injects `Authorization: Bearer <token>` and `x-session-id` headers.

### Email Notifications
Services that send emails inject `MailService` and call `sendEnquiryNotification()`. If email fails, it logs a warning but doesn't throw to avoid breaking the main operation (see `enquiries.service.ts`).

### S3 Image Upload Pattern
`GalleryService` detects mock mode via `AWS_ACCESS_KEY_ID === 'mock_key'` and falls back to local storage. In production, images are uploaded to S3 with signed URLs.

## Cross-Component Integration Points

1. **Enquiry → Mail**: When a new enquiry is created, `EnquiriesService` calls `MailService.sendEnquiryNotification()`
2. **Gallery → S3**: Image uploads trigger S3 `PutObjectCommand` (or mock save if credentials are missing)
3. **Frontend → Analytics**: Every API request includes `x-session-id` header for visitor tracking
4. **Auth → Users**: Login verifies user credentials and returns JWT token; frontend stores it for subsequent requests

## External Dependencies & Configuration

- **AWS S3**: Requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET` in `.env`
- **Email (Nodemailer)**: Requires `MAIL_USER` (Gmail address) and `MAIL_PASS` (Gmail app password) in `.env`
- **Database**: `aescion.sqlite` (auto-created in DEV) or MySQL RDS endpoint (PROD)
- **Frontend URL**: Backend uses `FRONTEND_URL` env var for password reset links

## Testing & Quality Assurance

- Jest tests use `*.spec.ts` naming; run with `npm run test` from backend/
- E2E tests in `test/jest-e2e.json`; run with `npm run test:e2e`
- Both frontend and backend use ESLint + Prettier; run `npm run lint` before committing

## When Working on Features

1. **Adding a new module**: Copy `courses/` or `gallery/` structure; always create `.module.ts`, `.controller.ts`, `.service.ts`, and `entities/` folder
2. **Adding an API endpoint**: Define DTOs in `dto/` folder, use validation pipes for request validation
3. **Database changes**: Update the TypeORM entity; `synchronize: true` will auto-migrate in dev
4. **Frontend components**: Place in `components/` organized by type; use TailwindCSS for styling, Framer Motion for animations
5. **Protecting endpoints**: Add `@UseGuards(RolesGuard) @Roles(UserRole.ADMIN)` to the controller method
