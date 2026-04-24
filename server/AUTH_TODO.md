# Server Authentication & Authorization — TODO

This document tracks all backend changes required to replace the
current dev-mode client-side auth with real JWT-based authentication.

---

## 1. Dependencies to install

```bash
npm install bcrypt jsonwebtoken
npm install --save-dev @types/bcrypt @types/jsonwebtoken
```

---

## 2. Environment variables to add

Add to `.env` (and Render dashboard secrets):

```
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## 3. New: User model `src/models/User.ts`

Create a Sequelize model with the following fields:

| Column         | Type   | Constraints                 |
| -------------- | ------ | --------------------------- |
| `id`           | UUID   | PK, default UUIDV4          |
| `email`        | STRING | unique, not null, lowercase |
| `passwordHash` | STRING | not null                    |
| `createdAt`    | DATE   | auto                        |
| `updatedAt`    | DATE   | auto                        |

- Hash passwords with `bcrypt` (salt rounds = 12) — **never store plain text**.
- Add a `User.hasMany(CarDetails)` association (one user → many cars).
- Add `CarDetails.belongsTo(User)`.

---

## 4. Update: `CarDetails` model `src/models/CarDetails.ts`

- [ ] Change `userId` from `allowNull: true` → `allowNull: false`.
- [ ] Add a proper FK reference to `User.id` with `onDelete: 'CASCADE'`.

---

## 5. New: Auth controller `src/controllers/authController.ts`

Implement the following exported functions:

### `POST /api/auth/register`

```
Body: { email, password }
- Validate email format and password length (≥ 8 chars).
- Check that no User with that email exists (return 409 if duplicate).
- Hash password with bcrypt.
- Create User record.
- Issue accessToken (JWT, 15 min) and refreshToken (JWT, 7 days).
- Return: { user: { id, email }, accessToken, refreshToken }
```

### `POST /api/auth/login`

```
Body: { email, password }
- Find user by email (case-insensitive).
- Return 401 for both "user not found" and "wrong password" (avoid user enumeration).
- Compare password with bcrypt.compare().
- Issue accessToken and refreshToken.
- Return: { user: { id, email }, accessToken, refreshToken }
```

### `POST /api/auth/refresh`

```
Body: { refreshToken }
- Verify the refresh token (jwt.verify with JWT_SECRET).
- Look up the user by id embedded in the token.
- Issue a new accessToken.
- Return: { accessToken }
```

### `POST /api/auth/logout`

```
- (Optional) If implementing token blacklisting, add the refresh token to a
  Redis set or a DB table.
- Return 204 No Content.
```

### `GET /api/auth/me`

```
- Requires: Authorization: Bearer <accessToken>
- Return the authenticated user's profile: { id, email, createdAt }
```

---

## 6. New: Auth middleware `src/middleware/authenticate.ts`

```typescript
// Pseudocode
export const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, email }
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
```

---

## 7. New: Auth routes `src/routes/authRoutes.ts`

```
POST /api/auth/register   → authController.register
POST /api/auth/login      → authController.login
POST /api/auth/refresh    → authController.refresh
POST /api/auth/logout     → authController.logout
GET  /api/auth/me         → authenticate, authController.me
```

Register the router in `src/index.ts`:

```typescript
app.use("/api/auth", authRoutes);
```

---

## 8. Update: All existing routes — scope to authenticated user

Apply the `authenticate` middleware to every route that touches car data.

### `src/routes/carRoutes.ts`

- [ ] `GET /` — filter `CarDetails.findAll({ where: { userId: req.user.id } })`
- [ ] `POST /` — set `userId: req.user.id` on create
- [ ] `GET /:carId` — verify `car.userId === req.user.id` (403 if not)
- [ ] `PUT /:carId` — same ownership check before update
- [ ] `DELETE /:carId`— same ownership check before delete

### `src/routes/oilChangeRoutes.ts`

- [ ] Verify the parent car belongs to `req.user.id` on all endpoints.

### `src/routes/fuelLogRoutes.ts`

- [ ] Same ownership check via parent car.

### `src/routes/expenseRoutes.ts`

- [ ] Same ownership check via parent car.

---

## 9. Update: Client-side `services/api.ts` — attach JWT

Once the server endpoints exist:

1. Store the `accessToken` returned from login in `SecureStore` (not AsyncStorage).
2. Add the token to every request header:
   ```typescript
   headers: {
     'Authorization': `Bearer ${token}`,
     'Content-Type': 'application/json',
   }
   ```
3. Implement a 401 interceptor that calls `POST /api/auth/refresh` and
   retries the original request with the new token.
4. On refresh failure, call `AuthContext.logout()`.

---

## 10. Update: `AuthContext.tsx` — replace dev login

Replace the dev-mode `login()` stub with:

```typescript
const { accessToken, refreshToken, user } = await AuthAPI.login(
  email,
  password,
);
await SecureStore.setItemAsync("motor_access_token", accessToken);
await SecureStore.setItemAsync("motor_refresh_token", refreshToken);
```

---

## 11. Security checklist

- [ ] Never log or return `passwordHash` in any API response.
- [ ] Use `helmet()` (already in place) to set security headers.
- [ ] Validate and sanitize all request bodies with a library such as `zod` or `joi`.
- [ ] Rate-limit auth endpoints (`express-rate-limit`) to prevent brute-force.
- [ ] Store `JWT_SECRET` only in environment variables — never in source code.
- [ ] Use HTTPS in production (Render handles TLS termination).
- [ ] Consider short-lived access tokens (15 min) + rotating refresh tokens.

---

## 12. Migration note

The existing `CarDetails` rows in the database have `userId = null`.
After adding the User model and making `userId` non-nullable, run a
data migration to either:

- Delete orphaned rows, or
- Assign them to a designated "legacy" user account.
