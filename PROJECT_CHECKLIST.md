# Doctor Directory - Project Checklist

## Project Name Suggestions
1. **DocFind** - Simple, memorable, action-oriented
2. **MedConnect** - Emphasizes connection between patients and doctors
3. **HealthHive** - Community-focused (similar to your inspiration)
4. **CareLocator** - Emphasizes finding care providers
5. **DocSpot** - Short, catchy, easy to remember
6. **FindMyDoc** - Direct and user-friendly
7. **MediSearch** - Professional and search-focused
8. **ProviderHub** - B2B friendly name
9. **DocDirectory** - Straightforward and descriptive
10. **CareConnect** - Patient-centric

---

## MVP Status Checklist

### Core Features
- [x] Homepage with hero section
- [x] Doctor search functionality
- [x] Doctor profile pages
- [x] Specialty landing pages
- [x] Location landing pages
- [x] Search filters (specialty, location, verified, featured)
- [x] Pagination
- [x] Sort functionality (Best Match, A-Z, Featured, Verified)

### Data Layer
- [x] Google Sheets integration
- [x] Data caching (5 minutes)
- [x] Doctor data parsing
- [ ] Database layer (Phase 2 - Turso)
- [ ] Data sync from Google Sheets to DB

### Admin Features
- [x] Admin sync button (password protected)
- [ ] Admin dashboard
- [ ] Manual data editing

### SEO
- [x] SEO-friendly URLs (/doctor/[slug], /specialty/[slug], /location/[state]/[city])
- [x] Meta tags on all pages
- [x] Semantic HTML structure
- [ ] Sitemap generation
- [ ] robots.txt
- [ ] Schema.org markup (JSON-LD)

### UI/UX
- [x] Responsive design
- [x] Doctor cards with badges (Featured, Verified)
- [x] Search bar component
- [x] Filter sidebar
- [x] Location browse section
- [x] Specialty grid
- [ ] Loading skeletons
- [ ] Error boundaries

---

## Environment Setup Checklist

### Google Cloud
- [ ] Create Google Cloud project
- [ ] Enable Google Sheets API
- [ ] Create service account
- [ ] Download JSON key file
- [ ] Share Google Sheet with service account email

### Vercel Deployment
- [ ] Connect GitHub repo to Vercel
- [ ] Add environment variables:
  - [ ] `GOOGLE_SHEET_ID`
  - [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - [ ] `GOOGLE_PRIVATE_KEY` (full PEM format with headers)
  - [ ] `ADMIN_PASSWORD`

### Google Sheet Structure
Ensure your Google Sheet has these columns (A-O):
| Column | Field |
|--------|-------|
| A | NPI |
| B | Full Name |
| C | Specialty |
| D | Sub Specialty |
| E | Practice Name |
| F | Website |
| G | City |
| H | State |
| I | Email |
| J | Phone |
| K | LinkedIn |
| L | Profile Status (Active/Inactive) |
| M | Verified (TRUE/FALSE) |
| N | Featured (TRUE/FALSE) |
| O | Priority (0-100) |

---

## Testing Checklist

### Pages
- [ ] Homepage loads correctly
- [ ] /doctors page shows all doctors
- [ ] /doctor/[slug] shows individual doctor
- [ ] /specialty/[slug] shows doctors by specialty
- [ ] /location/[state]/[city] shows doctors by location
- [ ] /api/debug returns success

### Functionality
- [ ] Search works
- [ ] Filters work
- [ ] Pagination works
- [ ] Sort works
- [ ] Admin sync button works

### Responsive
- [ ] Mobile (320px-480px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px+)

---

## Phase 2 Features (Future)

### Database Integration
- [ ] Set up Turso database
- [ ] Migrate from direct Sheets fetch to DB
- [ ] Implement sync cron job
- [ ] Add sync logging

### Enhanced Features
- [ ] Doctor reviews/ratings
- [ ] Appointment booking integration
- [ ] Doctor claiming/verification flow
- [ ] Email notifications
- [ ] Analytics dashboard

### Performance
- [ ] Image optimization
- [ ] Edge caching
- [ ] ISR (Incremental Static Regeneration)
- [ ] API rate limiting

### Marketing
- [ ] Blog section
- [ ] Newsletter signup
- [ ] Social sharing
- [ ] Google Analytics

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | Framework |
| React 19 | UI Library |
| TypeScript | Type Safety |
| Tailwind CSS 4 | Styling |
| Google Sheets API | Data Source (MVP) |
| Turso (libSQL) | Database (Phase 2) |
| Vercel | Hosting |

---

## File Structure

```
doctor-directory/
├── app/
│   ├── page.tsx              # Homepage
│   ├── doctors/page.tsx      # Search results
│   ├── doctor/[slug]/page.tsx # Doctor profile
│   ├── specialty/[slug]/page.tsx
│   ├── location/[state]/[city]/page.tsx
│   └── api/
│       ├── debug/route.ts    # Debug endpoint
│       ├── search/route.ts   # Search API
│       ├── seed/route.ts     # Seed API
│       └── sync/route.ts     # Sync API
├── components/
│   ├── home/
│   ├── doctors/
│   ├── search/
│   ├── ui/
│   └── layout/
├── lib/
│   ├── data/sheets.ts        # Google Sheets data layer
│   ├── db/                   # Database layer (Phase 2)
│   ├── types/index.ts        # TypeScript types
│   └── utils/
└── public/
```

---

## Quick Commands

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Test debug endpoint
curl https://your-site.vercel.app/api/debug
```

---

## Troubleshooting

### "DECODER routines::unsupported" error
- Private key format is wrong
- Make sure to include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Copy the ENTIRE `private_key` value from Google JSON file

### 500 Internal Server Error
- Check Vercel logs
- Visit /api/debug to see detailed error
- Verify all environment variables are set

### No doctors showing
- Check if Google Sheet has data
- Verify Sheet is shared with service account
- Check column order matches expected format
