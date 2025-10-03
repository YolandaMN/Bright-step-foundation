BrightStep Foundation – Volunteer & NGO Platform
A full-stack web platform for the BrightStep Foundation, designed to provide hope, support, and opportunities through shelter, rehabilitation, and education programs.

This platform integrates volunteer management, registration/login, and database management using Supabase as the backend and a clean, accessible React frontend.

🌐 Tech Stack
Frontend: React, JavaScript, HTML, CSS

Backend & Database: Supabase (PostgreSQL, Auth, Storage, API)

Design & Branding:

Teal & turquoise accents
Cream backgrounds
Dark header/footer
Clean, modern typography
Other: Responsive design, accessibility-compliant (contrast, alt-text, screen reader support)

📌 Features
1. Homepage
Hero section with headline: "Restoring Hope. Rebuilding Futures."

Call-to-action buttons: Donate Now & Learn More

Impact statistics:

820+ families supported
400+ volunteers
1,200+ meals served
95% rehabilitation success rate
Mission statement + supporting image

Integrated Longevity Model:

Homeless Shelter
Rehabilitation Center
Education & Training Center
Stories of Transformation section with testimonials

Footer call-to-action: “Ready to Make a Difference?”

2. Volunteer Registration & Login
Register, Login, and Forgot Password flows using Supabase Auth
Secure storage of volunteer data in Supabase (name, contact, volunteer history)
User icon in navbar once logged in → profile page to view/update details
Volunteers must be logged in to apply for positions
3. Volunteer Portal & Programs
Programs divided into 3 sections:

Rehabilitation
Emergency Shelter
Educational Support
When a program is clicked:

Opens a Leaflet Map Modal showing the closest facilities
Facility markers are randomized within a radius for demo purposes
User location marker (if allowed) with nearest facility highlighted
Clicking a marker shows facility details + Apply Now button
Apply flow:

If not logged in → redirected to Register/Login
If logged in → details auto-filled, confirm booking
Application saved to Supabase database under user’s account
4. Accessibility & Child Protection
Report Now button always visible for:

Homeless kids
Children outside school
Abuse cases
Booking appointments for rehab/help services
5. Courses Section
CAPS-aligned curriculum for school integration
Online course structure (Coursera-style)
Vocational skills & training programs
6. Database & Admin Dashboard
Supabase database tables:

users (volunteers, admins)
programs (rehab, shelter, education)
facilities (locations, availability)
applications (user ↔ position ↔ facility)
waiting_list (kids needing shelter/education/rehab)
Admin dashboard to manage waiting list, volunteers, and program data

7. Rehabilitation Centre Features
Extracurricular activities: sports, arts, mentorship, skills training
8. Donations & Contact
Secure donation flow (integrate payment provider later)
Contact form for schools, parents, and partners
⚡ Supabase Integration
Auth:

Email/password registration & login
Protected routes (only logged-in users can apply to volunteer positions)
Database Tables (Core Schema):

users: id, name, email, role, profile info
programs: id, title, description, type
facilities: id, program_id, name, coordinates, description, capacity
applications: id, user_id, facility_id, position, booking_dates, status
waiting_list: id, child_name, age, category (shelter/education/rehab), status
Storage (optional):

Upload volunteer documents or media
🚀 Getting Started
Prerequisites
Node.js & npm/yarn
Supabase account (https://supabase.com)
Installation
# Clone repo
git clone https://github.com/your-org/brightstep-foundation.git
cd brightstep-foundation

# Install dependencies
npm install

# Start dev server
npm run dev
Supabase Setup
Create new project in Supabase

Copy your project URL & anon/public key → add to .env.local:

NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
Create database tables using provided schema (SQL script in /supabase/migrations/).

🎨 Design Guidelines
Use exact palette & fonts from provided screenshot
Keep layout warm, professional, and hopeful
Ensure accessibility (WCAG AA compliance)
About
No description, website, or topics provided.
Resources
 Readme
 Activity
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
Releases
No releases published
Create a new release
Packages
No packages published
Publish your first package
Languages
TypeScript
96.1%
 
PLpgSQL
1.9%
 
CSS
1.2%
 
Other
0.8%
Suggested workflows
Based on your tech stack
Deno logo
Deno
Test your Deno project
Grunt logo
Grunt
Build a NodeJS project with npm and grunt.
Webpack logo
Webpack
Build a NodeJS project with npm and webpack.
More workflows
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Sta
