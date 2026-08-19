import { prisma } from './prisma'

// Re-export as `db` to match existing imports
export const db = prisma

export default db
