// backend/src/middleware/jwt.js
import jwt from 'jsonwebtoken'

export function optionalAuth(req, res, next) {
  // 1️⃣ Let the CORS preflight through untouched
  if (req.method === 'OPTIONS') {
    return next()
  }

  const authHeader = req.get('Authorization')

  // 2️⃣ No header? Just mark unauthenticated, don't 401.
  if (!authHeader) {
    req.auth = null
    return next()
  }

  const token = authHeader.replace(/^Bearer\s+/i, '')

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.auth = {
      sub: payload.sub,
      username: payload.username,
    }
  } catch (err) {
    console.error('JWT verify failed', err.message)
    // 3️⃣ Bad token: also just treat as unauthenticated here
    req.auth = null
  }

  return next()
}

/**
 * Hard auth: use this on routes that *must* be logged in.
 * This keeps your old `requireAuth` import working.
 */
export function requireAuth(req, res, next) {
  optionalAuth(req, res, () => {
    if (!req.auth) {
      return res.status(401).end()
    }
    next()
  })
}
