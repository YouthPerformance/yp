import { db, initializeDatabase } from './db/schema.js'
import bcrypt from 'bcryptjs'

console.log('Initializing database...')
initializeDatabase()

console.log('Clearing existing data...')
// Clear existing data (in reverse order of dependencies)
db.exec('DELETE FROM user_bookmarks')
db.exec('DELETE FROM user_progress')
db.exec('DELETE FROM user_courses')
db.exec('DELETE FROM certificates')
db.exec('DELETE FROM subscriptions')
db.exec('DELETE FROM newsletter_subscribers')
db.exec('DELETE FROM faq_items')
db.exec('DELETE FROM lectures')
db.exec('DELETE FROM course_disciplines')
db.exec('DELETE FROM courses')
db.exec('DELETE FROM disciplines')
db.exec('DELETE FROM instructors')
db.exec('DELETE FROM users')

console.log('Seeding disciplines...')
const disciplines = [
  { name: 'Psychology', slug: 'psychology', description: 'Explore the human mind and behavior', icon: 'brain', color: '#9333EA', display_order: 1 },
  { name: 'Philosophy', slug: 'philosophy', description: 'Examine fundamental questions about existence and knowledge', icon: 'lightbulb', color: '#3B82F6', display_order: 2 },
  { name: 'Science', slug: 'science', description: 'Discover the natural world through empirical investigation', icon: 'flask', color: '#10B981', display_order: 3 },
  { name: 'History', slug: 'history', description: 'Learn from the past to understand the present', icon: 'book', color: '#F59E0B', display_order: 4 },
  { name: 'Social Sciences', slug: 'social-sciences', description: 'Study society and human relationships', icon: 'users', color: '#EC4899', display_order: 5 },
  { name: 'Humanities', slug: 'humanities', description: 'Explore human culture and expression', icon: 'pen', color: '#8B5CF6', display_order: 6 },
  { name: 'Mathematics', slug: 'mathematics', description: 'The language of logic and patterns', icon: 'calculator', color: '#06B6D4', display_order: 7 }
]

const insertDiscipline = db.prepare(`
  INSERT INTO disciplines (name, slug, description, icon, color, display_order)
  VALUES (?, ?, ?, ?, ?, ?)
`)

for (const d of disciplines) {
  insertDiscipline.run(d.name, d.slug, d.description, d.icon, d.color, d.display_order)
}

console.log('Seeding instructors...')
const instructors = [
  {
    name: 'Dr. Jordan B. Peterson',
    title: 'Professor of Psychology',
    credentials: 'Ph.D. Clinical Psychology',
    university_affiliations: JSON.stringify(['University of Toronto', 'Harvard University']),
    biography: 'Dr. Jordan B. Peterson is a professor of psychology at the University of Toronto, a clinical psychologist, and the author of the bestselling book "12 Rules for Life: An Antidote to Chaos." He is one of the most influential public intellectuals of our time, known for his lectures on mythology, religion, and the psychological significance of ancient stories. His courses on personality and its transformations have reached millions of students worldwide.',
    photo_url: '/images/instructors/peterson.jpg',
    social_links: JSON.stringify({ twitter: 'jordanbpeterson', youtube: 'JordanBPeterson' })
  },
  {
    name: 'Dr. Keith Campbell',
    title: 'Professor of Psychology',
    credentials: 'Ph.D. Social Psychology',
    university_affiliations: JSON.stringify(['University of Georgia']),
    biography: 'Dr. Keith Campbell is a professor of psychology at the University of Georgia and a leading researcher on narcissism, self-esteem, and generational differences. He is the author of "The Narcissism Epidemic" and has published extensively on the psychology of self-perception and social behavior.',
    photo_url: '/images/instructors/campbell.jpg',
    social_links: JSON.stringify({ twitter: 'wkeithcampbell' })
  },
  {
    name: 'Dr. John Vervaeke',
    title: 'Professor of Cognitive Science',
    credentials: 'Ph.D. Cognitive Science',
    university_affiliations: JSON.stringify(['University of Toronto']),
    biography: 'Dr. John Vervaeke is a professor at the University of Toronto specializing in cognitive science, consciousness, and the psychology of wisdom. His acclaimed lecture series "Awakening from the Meaning Crisis" has become a cornerstone of modern philosophy and psychology education, exploring how we can address our cultural sense of disconnection and malaise.',
    photo_url: '/images/instructors/vervaeke.jpg',
    social_links: JSON.stringify({ youtube: 'johnvervaeke' })
  },
  {
    name: 'Dr. David Eagleman',
    title: 'Neuroscientist & Author',
    credentials: 'Ph.D. Neuroscience',
    university_affiliations: JSON.stringify(['Stanford University', 'Baylor College of Medicine']),
    biography: 'Dr. David Eagleman is a neuroscientist at Stanford University, a Guggenheim Fellow, and a New York Times bestselling author. His work spans perception, time, synesthesia, and neurolaw. He has written several popular science books including "Incognito: The Secret Lives of the Brain" and has hosted PBS and BBC science documentaries.',
    photo_url: '/images/instructors/eagleman.jpg',
    social_links: JSON.stringify({ twitter: 'davideagleman', website: 'eagleman.com' })
  },
  {
    name: 'Dr. Heather Heying',
    title: 'Evolutionary Biologist',
    credentials: 'Ph.D. Biology',
    university_affiliations: JSON.stringify(['Evergreen State College', 'Princeton University']),
    biography: 'Dr. Heather Heying is an evolutionary biologist, author, and former professor. She conducted extensive fieldwork in Madagascar studying poison frogs and has published research on evolution, ecology, and behavior. She co-authored "A Hunter-Gatherer\'s Guide to the 21st Century" with her husband Bret Weinstein.',
    photo_url: '/images/instructors/heying.jpg',
    social_links: JSON.stringify({ twitter: 'HeatherEHeying' })
  },
  {
    name: 'Dr. Stephen R.C. Hicks',
    title: 'Professor of Philosophy',
    credentials: 'Ph.D. Philosophy',
    university_affiliations: JSON.stringify(['Rockford University']),
    biography: 'Dr. Stephen R.C. Hicks is a professor of philosophy at Rockford University and the author of "Explaining Postmodernism: Skepticism and Socialism from Rousseau to Foucault." He specializes in the history of philosophy, with a focus on the Enlightenment and its critics. His work traces the intellectual roots of contemporary philosophical movements.',
    photo_url: '/images/instructors/hicks.jpg',
    social_links: JSON.stringify({ twitter: 'SRCHicks', website: 'stephenhicks.org' })
  },
  {
    name: 'Dr. Bret Weinstein',
    title: 'Evolutionary Biologist',
    credentials: 'Ph.D. Biology',
    university_affiliations: JSON.stringify(['Evergreen State College', 'University of Michigan']),
    biography: 'Dr. Bret Weinstein is an evolutionary biologist and public intellectual known for his work on telomeres and trade-offs in evolution. He is co-host of the DarkHorse podcast and co-author of "A Hunter-Gatherer\'s Guide to the 21st Century." His research focuses on applying evolutionary theory to modern challenges.',
    photo_url: '/images/instructors/weinstein.jpg',
    social_links: JSON.stringify({ twitter: 'BretWeinstein', youtube: 'BretWeinstein' })
  },
  {
    name: 'Max Lugavere',
    title: 'Health & Science Journalist',
    credentials: 'Bestselling Author',
    university_affiliations: JSON.stringify([]),
    biography: 'Max Lugavere is a health and science journalist, filmmaker, and author of the New York Times bestseller "Genius Foods." His work focuses on the connection between nutrition and brain health. After his mother was diagnosed with a rare form of dementia, he dedicated his career to understanding neurodegenerative disease prevention.',
    photo_url: '/images/instructors/lugavere.jpg',
    social_links: JSON.stringify({ twitter: 'maxlugavere', instagram: 'maxlugavere' })
  }
]

const insertInstructor = db.prepare(`
  INSERT INTO instructors (name, title, credentials, university_affiliations, biography, photo_url, social_links)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`)

const instructorIds = {}
for (const i of instructors) {
  const result = insertInstructor.run(i.name, i.title, i.credentials, i.university_affiliations, i.biography, i.photo_url, i.social_links)
  instructorIds[i.name] = result.lastInsertRowid
}

console.log('Seeding courses...')
const courses = [
  {
    instructor: 'Dr. Jordan B. Peterson',
    title: 'Maps of Meaning',
    course_code: 'PSYC 434',
    description: 'This course explores the significance of mythology, religion, and story in the development of personal meaning and psychological stability. Using sources ranging from ancient myths to modern literature, Dr. Peterson examines the archetypal patterns that underlie human experience and guide our actions. Students will learn to recognize these patterns in their own lives and understand how they shape culture and individual psychology.',
    short_description: 'Explore the profound significance of mythology and story in human psychology.',
    thumbnail_url: '/images/courses/maps-of-meaning.jpg',
    total_duration_minutes: 2400,
    is_featured: 1,
    disciplines: ['Psychology', 'Philosophy', 'Humanities']
  },
  {
    instructor: 'Dr. Jordan B. Peterson',
    title: 'Personality and Its Transformations',
    course_code: 'PSYC 310',
    description: 'A comprehensive examination of personality psychology, this course covers major theories from Freud to the Big Five, exploring how personality develops, functions, and can be transformed. Dr. Peterson integrates clinical experience with research findings to provide a deep understanding of human character and its potential for change.',
    short_description: 'Understand the major theories of personality psychology and human transformation.',
    thumbnail_url: '/images/courses/personality.jpg',
    total_duration_minutes: 1800,
    is_featured: 1,
    disciplines: ['Psychology']
  },
  {
    instructor: 'Dr. Keith Campbell',
    title: 'On Narcissism',
    course_code: 'PSYC 215',
    description: 'Dr. Campbell, a leading researcher on narcissism, provides a comprehensive exploration of narcissistic personality traits and their impact on individuals and society. The course covers the spectrum from healthy self-esteem to pathological narcissism, examining causes, consequences, and cultural factors.',
    short_description: 'A deep dive into narcissistic personality and its societal implications.',
    thumbnail_url: '/images/courses/narcissism.jpg',
    total_duration_minutes: 900,
    is_featured: 1,
    disciplines: ['Psychology', 'Social Sciences']
  },
  {
    instructor: 'Dr. Keith Campbell',
    title: 'Introduction to Psychology',
    course_code: 'PSYC 101',
    description: 'A foundational course covering the major topics in psychology including perception, learning, memory, emotion, personality, and social behavior. This course provides the essential framework for understanding human thought and behavior.',
    short_description: 'Build a solid foundation in the science of mind and behavior.',
    thumbnail_url: '/images/courses/intro-psych.jpg',
    total_duration_minutes: 1200,
    is_featured: 0,
    disciplines: ['Psychology']
  },
  {
    instructor: 'Dr. David Eagleman',
    title: 'Brain Plasticity',
    course_code: 'SCI 201',
    description: 'Explore the remarkable ability of the brain to change and adapt throughout life. Dr. Eagleman presents cutting-edge neuroscience research on neuroplasticity, demonstrating how experience shapes brain structure and function. Learn about the implications for learning, recovery from injury, and cognitive enhancement.',
    short_description: 'Discover how the brain adapts and changes throughout life.',
    thumbnail_url: '/images/courses/brain-plasticity.jpg',
    total_duration_minutes: 800,
    is_featured: 1,
    disciplines: ['Science', 'Psychology']
  },
  {
    instructor: 'Dr. John Vervaeke',
    title: 'Awakening from the Meaning Crisis',
    course_code: 'PHIL 401',
    description: 'This landmark lecture series examines the historical and psychological origins of our cultural meaning crisis. Dr. Vervaeke traces the development of wisdom, spirituality, and meaning-making from ancient Greece to the present day, offering insights into how we might address our collective sense of disconnection.',
    short_description: 'Explore the roots and remedies for our modern meaning crisis.',
    thumbnail_url: '/images/courses/meaning-crisis.jpg',
    total_duration_minutes: 3600,
    is_featured: 1,
    disciplines: ['Philosophy', 'Psychology', 'Humanities']
  },
  {
    instructor: 'Dr. John Vervaeke',
    title: 'Introduction to Intelligence',
    course_code: 'PSYC 220',
    description: 'What does it mean to be intelligent? This course examines the nature of intelligence from cognitive, developmental, and evolutionary perspectives. Topics include IQ, multiple intelligences, artificial intelligence, and the relationship between intelligence and wisdom.',
    short_description: 'Understand the many dimensions of human and artificial intelligence.',
    thumbnail_url: '/images/courses/intelligence.jpg',
    total_duration_minutes: 720,
    is_featured: 0,
    disciplines: ['Psychology', 'Science']
  },
  {
    instructor: 'Dr. Stephen R.C. Hicks',
    title: 'Ancient Philosophy',
    course_code: 'PHIL 101',
    description: 'Journey through the foundations of Western thought from the Pre-Socratics to the Hellenistic schools. This course examines the ideas of Socrates, Plato, Aristotle, and their predecessors and successors, establishing the philosophical framework that continues to shape our world.',
    short_description: 'Explore the origins of Western philosophical thought.',
    thumbnail_url: '/images/courses/ancient-philosophy.jpg',
    total_duration_minutes: 1500,
    is_featured: 0,
    disciplines: ['Philosophy', 'History']
  },
  {
    instructor: 'Dr. Stephen R.C. Hicks',
    title: 'Logic',
    course_code: 'PHIL 110',
    description: 'Master the principles of sound reasoning. This course covers formal and informal logic, argument analysis, fallacy identification, and critical thinking skills essential for academic and everyday life.',
    short_description: 'Develop rigorous critical thinking and argument analysis skills.',
    thumbnail_url: '/images/courses/logic.jpg',
    total_duration_minutes: 600,
    is_featured: 0,
    disciplines: ['Philosophy', 'Mathematics']
  },
  {
    instructor: 'Dr. Stephen R.C. Hicks',
    title: 'Explaining Postmodernism',
    course_code: 'PHIL 320',
    description: 'Trace the intellectual roots of postmodernism from the Counter-Enlightenment to its contemporary manifestations. Dr. Hicks examines how postmodern philosophy emerged and why it has become influential in academia and beyond.',
    short_description: 'Understand the origins and implications of postmodern thought.',
    thumbnail_url: '/images/courses/postmodernism.jpg',
    total_duration_minutes: 900,
    is_featured: 1,
    disciplines: ['Philosophy', 'History', 'Social Sciences']
  },
  {
    instructor: 'Dr. Heather Heying',
    title: 'Evolutionary Biology',
    course_code: 'SCI 210',
    description: 'Explore the principles of evolution and their application to understanding life on Earth. Dr. Heying covers natural selection, adaptation, speciation, and the evolutionary approach to understanding behavior, drawing on her extensive field research.',
    short_description: 'Understand the principles of evolution and their implications.',
    thumbnail_url: '/images/courses/evolutionary-biology.jpg',
    total_duration_minutes: 1100,
    is_featured: 0,
    disciplines: ['Science']
  },
  {
    instructor: 'Dr. Bret Weinstein',
    title: 'Game Theory and Evolution',
    course_code: 'SCI 305',
    description: 'Examine how game theory illuminates evolutionary processes and social behavior. Dr. Weinstein explores cooperation, competition, and the evolution of social strategies using mathematical and biological frameworks.',
    short_description: 'Apply game theory to understand evolution and behavior.',
    thumbnail_url: '/images/courses/game-theory.jpg',
    total_duration_minutes: 750,
    is_featured: 0,
    disciplines: ['Science', 'Mathematics', 'Social Sciences']
  },
  {
    instructor: 'Max Lugavere',
    title: 'Nutrition and Brain Health',
    course_code: 'SCI 180',
    description: 'Discover the science connecting nutrition to cognitive function and brain health. Max Lugavere presents evidence-based strategies for optimizing brain performance and reducing dementia risk through diet and lifestyle choices.',
    short_description: 'Learn how nutrition affects cognitive function and brain health.',
    thumbnail_url: '/images/courses/nutrition-brain.jpg',
    total_duration_minutes: 540,
    is_featured: 0,
    disciplines: ['Science']
  },
  {
    instructor: 'Dr. Keith Campbell',
    title: 'The Psychology of Wealth',
    course_code: 'PSYC 250',
    description: 'Examine the psychological dimensions of money, status, and material success. This course explores how wealth affects happiness, relationships, and personal development, drawing on research in social psychology and behavioral economics.',
    short_description: 'Explore the psychology of money, status, and success.',
    thumbnail_url: '/images/courses/psychology-wealth.jpg',
    total_duration_minutes: 480,
    is_featured: 0,
    disciplines: ['Psychology', 'Social Sciences']
  },
  {
    instructor: 'Dr. Jordan B. Peterson',
    title: 'Biblical Series',
    course_code: 'HUM 301',
    description: 'A psychological exploration of the biblical stories of Genesis. Dr. Peterson examines these ancient narratives as profound psychological documents, revealing timeless wisdom about human nature, morality, and meaning.',
    short_description: 'A psychological exploration of the stories of Genesis.',
    thumbnail_url: '/images/courses/biblical-series.jpg',
    total_duration_minutes: 2100,
    is_featured: 1,
    disciplines: ['Humanities', 'Psychology', 'Philosophy']
  }
]

const insertCourse = db.prepare(`
  INSERT INTO courses (instructor_id, title, course_code, description, short_description, thumbnail_url, total_duration_minutes, is_featured)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)

const insertCourseDiscipline = db.prepare(`
  INSERT INTO course_disciplines (course_id, discipline_id)
  SELECT ?, id FROM disciplines WHERE name = ?
`)

for (const c of courses) {
  const result = insertCourse.run(
    instructorIds[c.instructor],
    c.title,
    c.course_code,
    c.description,
    c.short_description,
    c.thumbnail_url,
    c.total_duration_minutes,
    c.is_featured
  )

  for (const d of c.disciplines) {
    insertCourseDiscipline.run(result.lastInsertRowid, d)
  }
}

console.log('Seeding lectures...')
const courseLectures = [
  {
    course_code: 'PSYC 434',
    lectures: [
      { title: 'Introduction: The Problem of Meaning', chapter_name: 'Part I: The Foundations', duration_minutes: 60 },
      { title: 'Mythology, Symbolism, and the Brain', chapter_name: 'Part I: The Foundations', duration_minutes: 55 },
      { title: 'Neuropsychology of Motivation', chapter_name: 'Part I: The Foundations', duration_minutes: 50 },
      { title: 'The Genesis Story', chapter_name: 'Part II: The Stories', duration_minutes: 65 },
      { title: 'Adam and Eve: Consciousness and Death', chapter_name: 'Part II: The Stories', duration_minutes: 70 },
      { title: 'Cain and Abel: Good, Evil, and Identity', chapter_name: 'Part II: The Stories', duration_minutes: 60 },
      { title: 'The Flood: Chaos and Renewal', chapter_name: 'Part II: The Stories', duration_minutes: 55 },
      { title: 'The Tower of Babel', chapter_name: 'Part II: The Stories', duration_minutes: 50 },
      { title: 'Abraham: Individual and Culture', chapter_name: 'Part III: The Individual', duration_minutes: 65 },
      { title: 'Heroism and Meaning', chapter_name: 'Part III: The Individual', duration_minutes: 60 }
    ]
  },
  {
    course_code: 'PSYC 310',
    lectures: [
      { title: 'Introduction to Personality', chapter_name: 'Foundations', duration_minutes: 45 },
      { title: 'Historical Perspectives: Freud', chapter_name: 'Foundations', duration_minutes: 50 },
      { title: 'Historical Perspectives: Jung', chapter_name: 'Foundations', duration_minutes: 55 },
      { title: 'The Big Five: Openness', chapter_name: 'Trait Theory', duration_minutes: 40 },
      { title: 'The Big Five: Conscientiousness', chapter_name: 'Trait Theory', duration_minutes: 40 },
      { title: 'The Big Five: Extraversion', chapter_name: 'Trait Theory', duration_minutes: 40 },
      { title: 'The Big Five: Agreeableness', chapter_name: 'Trait Theory', duration_minutes: 40 },
      { title: 'The Big Five: Neuroticism', chapter_name: 'Trait Theory', duration_minutes: 40 },
      { title: 'Personality and Performance', chapter_name: 'Applications', duration_minutes: 50 },
      { title: 'Personality Transformation', chapter_name: 'Applications', duration_minutes: 55 }
    ]
  },
  {
    course_code: 'PSYC 215',
    lectures: [
      { title: 'What is Narcissism?', chapter_name: 'Introduction', duration_minutes: 45 },
      { title: 'The Narcissism Spectrum', chapter_name: 'Understanding Narcissism', duration_minutes: 50 },
      { title: 'Causes and Development', chapter_name: 'Understanding Narcissism', duration_minutes: 55 },
      { title: 'Narcissism in Relationships', chapter_name: 'Implications', duration_minutes: 45 },
      { title: 'Narcissism and Leadership', chapter_name: 'Implications', duration_minutes: 50 },
      { title: 'The Narcissism Epidemic', chapter_name: 'Cultural Context', duration_minutes: 55 }
    ]
  },
  {
    course_code: 'PHIL 401',
    lectures: [
      { title: 'Introduction: The Meaning Crisis', chapter_name: 'Part I: Ancient Wisdom', duration_minutes: 55 },
      { title: 'Flow, Metaphor, and the Axial Revolution', chapter_name: 'Part I: Ancient Wisdom', duration_minutes: 60 },
      { title: 'Socrates and the Quest for Wisdom', chapter_name: 'Part I: Ancient Wisdom', duration_minutes: 65 },
      { title: 'Plato and the Cave', chapter_name: 'Part I: Ancient Wisdom', duration_minutes: 60 },
      { title: 'Aristotle, Kant, and Wisdom', chapter_name: 'Part I: Ancient Wisdom', duration_minutes: 55 },
      { title: 'The Hellenistic Domicide', chapter_name: 'Part II: The Crisis', duration_minutes: 50 },
      { title: 'Christianity and the Grammar of Meaning', chapter_name: 'Part II: The Crisis', duration_minutes: 60 },
      { title: 'The Scientific Revolution', chapter_name: 'Part II: The Crisis', duration_minutes: 55 },
      { title: 'Descartes and the Meaning Crisis', chapter_name: 'Part II: The Crisis', duration_minutes: 50 },
      { title: 'Hegel and Romanticism', chapter_name: 'Part III: Response', duration_minutes: 60 },
      { title: 'Nietzsche and the Death of God', chapter_name: 'Part III: Response', duration_minutes: 65 },
      { title: 'Awakening: Wisdom and Transformation', chapter_name: 'Part III: Response', duration_minutes: 70 }
    ]
  },
  {
    course_code: 'SCI 201',
    lectures: [
      { title: 'Introduction to Neuroplasticity', chapter_name: 'Foundations', duration_minutes: 40 },
      { title: 'The Dynamic Brain', chapter_name: 'Foundations', duration_minutes: 45 },
      { title: 'Learning and Memory', chapter_name: 'Mechanisms', duration_minutes: 50 },
      { title: 'Sensory Substitution', chapter_name: 'Applications', duration_minutes: 45 },
      { title: 'Recovery from Injury', chapter_name: 'Applications', duration_minutes: 50 },
      { title: 'Cognitive Enhancement', chapter_name: 'Future', duration_minutes: 40 }
    ]
  }
]

const insertLecture = db.prepare(`
  INSERT INTO lectures (course_id, title, chapter_name, duration_minutes, sort_order)
  SELECT c.id, ?, ?, ?, ?
  FROM courses c WHERE c.course_code = ?
`)

for (const cl of courseLectures) {
  let order = 1
  for (const lecture of cl.lectures) {
    insertLecture.run(lecture.title, lecture.chapter_name, lecture.duration_minutes, order++, cl.course_code)
  }
}

console.log('Seeding FAQ items...')
const faqItems = [
  { question: 'How much does a subscription cost?', answer: 'A Peterson Academy subscription costs $399 per year. This gives you unlimited access to all courses, including new courses added throughout the year.', category: 'Pricing', sort_order: 1 },
  { question: 'Can I cancel my subscription?', answer: 'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.', category: 'Pricing', sort_order: 2 },
  { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee. If you are not satisfied with your subscription, contact our support team within 30 days of purchase for a full refund.', category: 'Pricing', sort_order: 3 },
  { question: 'What devices can I use?', answer: 'Peterson Academy is available on any device with a modern web browser, including computers, tablets, and smartphones. We also have iOS and Android apps available.', category: 'Technical', sort_order: 4 },
  { question: 'Can I download videos for offline viewing?', answer: 'Yes, with a subscription you can download lectures for offline viewing through our mobile apps.', category: 'Technical', sort_order: 5 },
  { question: 'Are there certificates?', answer: 'Yes, you receive a certificate of completion when you finish a course. These certificates can be shared on LinkedIn and other platforms.', category: 'Content', sort_order: 6 },
  { question: 'How often is new content added?', answer: 'We add new courses regularly, with new content from world-class professors being added every month. All new content is included in your subscription.', category: 'Content', sort_order: 7 },
  { question: 'Can I gift a subscription?', answer: 'Yes! Gift subscriptions are available and make a wonderful present for the intellectually curious. Visit our gift page to purchase.', category: 'Pricing', sort_order: 8 }
]

const insertFaq = db.prepare(`
  INSERT INTO faq_items (question, answer, category, sort_order)
  VALUES (?, ?, ?, ?)
`)

for (const f of faqItems) {
  insertFaq.run(f.question, f.answer, f.category, f.sort_order)
}

console.log('Creating demo user...')
const demoPasswordHash = await bcrypt.hash('demo123', 10)
db.prepare(`
  INSERT INTO users (name, email, password_hash, subscription_status, email_verified)
  VALUES ('Demo User', 'demo@example.com', ?, 'active', 1)
`).run(demoPasswordHash)

console.log('\n=== Seed completed successfully! ===')
console.log(`Disciplines: ${disciplines.length}`)
console.log(`Instructors: ${instructors.length}`)
console.log(`Courses: ${courses.length}`)
console.log(`FAQ items: ${faqItems.length}`)
console.log('\nDemo user: demo@example.com / demo123')
