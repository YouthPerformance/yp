import { Router } from 'express'
import db from '../db/schema.js'

const router = Router()

// Get all courses
router.get('/', (req, res) => {
  try {
    const { discipline, search, sort = 'newest', limit = 50, offset = 0 } = req.query

    let query = `
      SELECT c.*, i.name as instructor_name, i.photo_url as instructor_photo
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      WHERE c.is_published = 1
    `
    const params = []

    if (discipline) {
      query += `
        AND c.id IN (
          SELECT cd.course_id FROM course_disciplines cd
          JOIN disciplines d ON cd.discipline_id = d.id
          WHERE d.slug = ?
        )
      `
      params.push(discipline)
    }

    if (search) {
      query += ` AND (c.title LIKE ? OR c.description LIKE ? OR i.name LIKE ?)`
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    // Sorting
    switch (sort) {
      case 'popular':
        query += ` ORDER BY c.is_featured DESC, c.created_at DESC`
        break
      case 'az':
        query += ` ORDER BY c.title ASC`
        break
      default: // newest
        query += ` ORDER BY c.created_at DESC`
    }

    query += ` LIMIT ? OFFSET ?`
    params.push(parseInt(limit), parseInt(offset))

    const courses = db.prepare(query).all(...params)

    // Get disciplines for each course
    const coursesWithDisciplines = courses.map(course => {
      const disciplines = db.prepare(`
        SELECT d.* FROM disciplines d
        JOIN course_disciplines cd ON d.id = cd.discipline_id
        WHERE cd.course_id = ?
      `).all(course.id)

      return { ...course, disciplines }
    })

    res.json(coursesWithDisciplines)
  } catch (error) {
    console.error('Get courses error:', error)
    res.status(500).json({ error: 'Failed to get courses' })
  }
})

// Get featured courses
router.get('/featured', (req, res) => {
  try {
    const courses = db.prepare(`
      SELECT c.*, i.name as instructor_name, i.photo_url as instructor_photo
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      WHERE c.is_published = 1 AND c.is_featured = 1
      ORDER BY c.created_at DESC
      LIMIT 6
    `).all()

    res.json(courses)
  } catch (error) {
    console.error('Get featured courses error:', error)
    res.status(500).json({ error: 'Failed to get featured courses' })
  }
})

// Get single course
router.get('/:id', (req, res) => {
  try {
    const course = db.prepare(`
      SELECT c.*, i.name as instructor_name, i.photo_url as instructor_photo,
             i.title as instructor_title, i.biography as instructor_bio
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      WHERE c.id = ?
    `).get(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Course not found' })
    }

    // Get disciplines
    const disciplines = db.prepare(`
      SELECT d.* FROM disciplines d
      JOIN course_disciplines cd ON d.id = cd.discipline_id
      WHERE cd.course_id = ?
    `).all(course.id)

    // Get lecture count
    const lectureCount = db.prepare('SELECT COUNT(*) as count FROM lectures WHERE course_id = ?').get(course.id)

    res.json({
      ...course,
      disciplines,
      lecture_count: lectureCount.count
    })
  } catch (error) {
    console.error('Get course error:', error)
    res.status(500).json({ error: 'Failed to get course' })
  }
})

// Get course lectures
router.get('/:id/lectures', (req, res) => {
  try {
    const lectures = db.prepare(`
      SELECT * FROM lectures
      WHERE course_id = ?
      ORDER BY sort_order ASC
    `).all(req.params.id)

    res.json(lectures)
  } catch (error) {
    console.error('Get lectures error:', error)
    res.status(500).json({ error: 'Failed to get lectures' })
  }
})

export default router
