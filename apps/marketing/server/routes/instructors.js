import { Router } from "express";
import db from "../db/schema.js";

const router = Router();

// Get all instructors
router.get("/", (_req, res) => {
  try {
    const instructors = db
      .prepare(`
      SELECT i.*, COUNT(c.id) as course_count
      FROM instructors i
      LEFT JOIN courses c ON i.id = c.instructor_id AND c.is_published = 1
      GROUP BY i.id
      ORDER BY i.name ASC
    `)
      .all();

    // Parse JSON fields
    const parsed = instructors.map((i) => ({
      ...i,
      university_affiliations: JSON.parse(i.university_affiliations || "[]"),
      social_links: JSON.parse(i.social_links || "{}"),
    }));

    res.json(parsed);
  } catch (error) {
    console.error("Get instructors error:", error);
    res.status(500).json({ error: "Failed to get instructors" });
  }
});

// Get single instructor
router.get("/:id", (req, res) => {
  try {
    const instructor = db.prepare("SELECT * FROM instructors WHERE id = ?").get(req.params.id);

    if (!instructor) {
      return res.status(404).json({ error: "Instructor not found" });
    }

    // Parse JSON fields
    const parsed = {
      ...instructor,
      university_affiliations: JSON.parse(instructor.university_affiliations || "[]"),
      social_links: JSON.parse(instructor.social_links || "{}"),
    };

    res.json(parsed);
  } catch (error) {
    console.error("Get instructor error:", error);
    res.status(500).json({ error: "Failed to get instructor" });
  }
});

// Get instructor's courses
router.get("/:id/courses", (req, res) => {
  try {
    const courses = db
      .prepare(`
      SELECT c.*, i.name as instructor_name
      FROM courses c
      JOIN instructors i ON c.instructor_id = i.id
      WHERE c.instructor_id = ? AND c.is_published = 1
      ORDER BY c.created_at DESC
    `)
      .all(req.params.id);

    res.json(courses);
  } catch (error) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({ error: "Failed to get instructor courses" });
  }
});

export default router;
