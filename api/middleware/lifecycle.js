/**
 * Middleware with support for running callbacks before and after handlers.
 * 
 * The setup function's return is passed to the cleanup function,
 * potentially useful for connect/disconnect.
 */
export default function lifecycle({ setup, cleanup }) {
  return async (req, res, next) => {
    const props = await setup()
    res.on('finish', async () => await cleanup(props))
    next()
  }
}