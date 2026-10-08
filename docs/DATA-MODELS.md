# Data models (CMS / Laravel-ready)

Each `src/_data/*.json` file is shaped like a future database table. When the Laravel backend exists, each file becomes a model + API resource and the Eleventy data file is replaced by an API fetch at build time (or the site is rendered by Blade). Field names use `snake_case` in the database; the JSON uses `camelCase`.

Common to every model: `id`, `created_at`, `updated_at`, and where it makes sense `is_published` (bool), `sort_order` (int), `slug` (unique).

| Model | Fields |
|---|---|
| **School** (`site.json`) | name, short_name, tagline, description, url, logo, favicon, og_image, primary/secondary/accent color, heading_font, body_font, phone, email, address, city, country, office_hours (json), map_link, map_embed_url, social (json), established_year, announcement (json), admission_open (bool), admission_session |
| **Department** | name, slug, description, head_teacher_id |
| **Subject** | name, slug, department_id, class_levels (json) |
| **Teacher** | name, slug, photo, designation, department_id, subject_ids, qualification, experience_years, joined_on, email (optional), short_bio, is_published, sort_order |
| **Staff** | name, photo, designation, section, phone (optional), sort_order |
| **Student** (future SMS) | student_code, name, class, section, roll, guardian_name, guardian_phone, dob, status. Not shown publicly. |
| **Notice** | title, slug, category, published_on, summary, body, attachment_path, attachment_size, is_pinned, is_published |
| **Event** | title, slug, starts_at, ends_at, location, summary, body, cover_image, is_published |
| **GalleryAlbum** | title, slug, category, cover_image, description, sort_order |
| **GalleryImage** | album_id, path, alt_text, caption, sort_order |
| **Facility** | title, slug, summary, body, image, sort_order |
| **Achievement** | title, category (academic/sports/cultural/competition), year, student_name (optional), description, image |
| **Testimonial** | author_name, relation (parent/alumni/student), quote, photo (optional), is_published |
| **Admission** | session, classes (json), eligibility, documents (json), process_steps (json), important_dates (json), fees (json), faqs (json) |
| **ContactMessage** (write-only from site) | type (contact/admission_inquiry), name, guardian_name, phone, email, class_applying, previous_institution, message, status (new/read/replied), ip_address, created_at |

## Form submission contract

`POST {formEndpoint}` with JSON, `Accept: application/json`. Success: `201 {"message": "..."}`. Validation failure: `422 {"errors": {"field": ["message"]}}` (Laravel's default shape), which the front-end maps onto each field's error element.
