# Production Readiness Fixes TODO

## 1. Update MongoDB Connection (api/db.js)
- [x] Replace `let cachedDb = null;` with `global.mongoose` cache
- [x] Implement conn + promise pattern
- [x] Ensure anti-reconnect storm protection

## 2. Update Database Initialization (api/app.js)
- [x] Import `connectDB` from `./db`
- [x] Call `connectDB()` at the top, before routes
- [x] Remove the `app.get('/')` route

## 3. Repo Cleanup
- [ ] Delete `frontend/package.json`
- [ ] Delete `frontend/package-lock.json`
- [ ] Delete `assets copy/` folder

## 4. Final Validation
- [x] Ensure `/api/health` endpoint works
- [x] Ensure report endpoints work
- [x] Confirm frontend fetches to `/api/*`

## Followup
- [ ] List final folder structure
- [ ] Show final contents of `api/db.js` and `api/app.js`
- [ ] Provide deploy checklist
