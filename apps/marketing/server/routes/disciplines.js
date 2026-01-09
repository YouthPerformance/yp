import { Router } from "express";
import db from "../db/schema.js";

const router = Router();

// Get all disciplines
router.get("/", (_req, res) => {
  try {
    const disciplines = db
      .prepare(`
      SELECT d.*, COUNT(cd.course_id) as course_count
      FROM disciplines d
      LEFT JOIN course_disciplines cd ON d.id = cd.discipline_id
      GROUP BY d.id
      ORDER BY d.display_order ASC
    `)
      .all();

    res.json(disciplines);
  } catch (error) {
    console.error("Get disciplines error:", error);
    res.status(500).json({ error: "Failed to get disciplines" });
  }
});

// Get single discipline by slug
router.get("/:slug", (req, res) => {
  try {
    const discipline = db.prepare("SELECT * FROM disciplines WHERE slug = ?").get(req.params.slug);

    if (!discipline) {
      return res.status(404).json({ error: "Discipline not found" });
    }

    res.json(discipline);
  } catch (error) {
    console.error("Get discipline error:", error);
    res.status(500).json({ error: "Failed to get discipline" });
  }
});

// Get courses in a discipline
router.get("/:slug/courses", (req, res) => {
  try {
    const discipline = db.prepare("SELECT id FROM disciplines WHERE slug = ?").get(req.params.slug);

    if (!discipline) {
      return res.status(404).json({ error: "Discipline not found" });
    }

    const courses = db
      .prepare(`
      SELECT c.*, i.name as instructor_name, i.photo_url as instructor_photo
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      JOIN course_disciplines cd ON c.id = cd.course_id
      WHERE cd.discipline_id = ? AND c.is_published = 1
      ORDER BY c.created_at DESC
    `)
      .all(discipline.id);

    res.json(courses);
  } catch (error) {
    console.error("Get discipline courses error:", error);
    res.status(500).json({ error: "Failed to get discipline courses" });
  }
});

export default router;
