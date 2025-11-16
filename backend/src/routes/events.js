import {
  getTotalViews,
  getDailyViews,
  getDailyDurations,
  trackEvent,
} from '../services/events.js'

// ❌ we no longer need to check that the id is a Post
// import { getPostById } from '../services/posts.js'

export function eventRoutes(app) {
  // Track an event (startView / endView)
  app.post('/api/v1/events', async (req, res) => {
    try {
      const { postId, session, action } = req.body

      // Basic validation: we just need an id and an action
      if (!postId || !action) {
        return res.status(400).json({ error: 'postId and action are required' })
      }

      const event = await trackEvent({ postId, session, action })
      return res.json({ session: event.session })
    } catch (err) {
      console.error('error tracking action', err)
      return res.status(500).end()
    }
  })

  // Total views for a given id (post or recipe)
  app.get('/api/v1/events/totalViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      if (!postId) {
        return res.status(400).json({ error: 'postId is required' })
      }

      const stats = await getTotalViews(postId)
      // stats is { views: number }, even if views = 0
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })

  // Daily views for a given id (post or recipe)
  app.get('/api/v1/events/dailyViews/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      if (!postId) {
        return res.status(400).json({ error: 'postId is required' })
      }

      const stats = await getDailyViews(postId)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })

  // Daily average durations for a given id (post or recipe)
  app.get('/api/v1/events/dailyDurations/:postId', async (req, res) => {
    try {
      const { postId } = req.params
      if (!postId) {
        return res.status(400).json({ error: 'postId is required' })
      }

      const stats = await getDailyDurations(postId)
      return res.json(stats)
    } catch (err) {
      console.error('error getting stats', err)
      return res.status(500).end()
    }
  })
}
