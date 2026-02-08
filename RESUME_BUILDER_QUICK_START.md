# Resume Builder - Quick Setup (2 Minutes)

## Installation

```bash
# 1. Install pdfmake for PDF export
npm install pdfmake
npm install --save-dev @types/pdfmake
```

## Configuration

Add to `angular.json` in the scripts section:

```json
"scripts": [
  "node_modules/pdfmake/build/pdfmake.js",
  "node_modules/pdfmake/build/vfs_fonts.js"
]
```

## Start Using

```bash
# 2. Restart your dev server
ng serve

# 3. Navigate to Profile page
# Click "Create Resume" and start building!
```

---

## Features at a Glance

✨ **Create Resume**
- Personal Information (name, email, phone, location)
- Professional Summary
- Social Links (LinkedIn, GitHub, Portfolio)

✨ **Add Experience**
- Job Title, Company, Dates
- Description of responsibilities
- List of achievements

✨ **Add Education**
- Institution, Degree, Field
- Graduation Date, GPA
- Academic achievements

✨ **Add Skills**
- Skill categories
- Multiple skills per category
- Easy management

✨ **Download PDF**
- Professional formatting
- One-click download
- Filename: YourName.pdf

---

## Data Saved Automatically

Resume data is saved to your browser's local storage. It persists across sessions!

---

## Files Structure

```
src/app/profile/
├── services/
│   ├── resume.service.ts           (Resume management & CRUD)
│   └── resume-pdf.service.ts       (PDF generation)
├── components/
│   └── resume-builder/
│       ├── resume-builder.ts       (Component logic)
│       ├── resume-builder.html     (4 tabs interface)
│       └── resume-builder.scss     (Professional styling)
├── profile.ts                      (Updated - resume integration)
├── profile.html                    (Updated - functional buttons)
└── profile.scss                    (Updated - styling)
```

---

## Usage

### Create Resume
1. Go to Profile page
2. Click **Create Resume**
3. Fill in your information
4. Save each section

### Edit Resume
1. Click **Edit Resume** (enabled when you have data)
2. Modify any section
3. Changes save automatically

### Download
1. Click **Download PDF** (enabled when you have data)
2. Your resume is downloaded instantly
3. Share it with recruiters!

---

## Troubleshooting

**PDF not downloading?**
- Install pdfmake: `npm install pdfmake`
- Update angular.json
- Restart `ng serve`

**Data not saving?**
- Check browser console for errors
- Clear cache: Ctrl+Shift+Delete
- Try again in a new browser window

**Button not working?**
- Check TypeScript errors: `ng build`
- Verify Material modules imported
- Check browser console

---

## Next Steps

1. ✅ Install pdfmake
2. ✅ Update angular.json
3. ✅ Restart dev server
4. ✅ Test on Profile page
5. 🎉 Start building resumes!

---

For detailed documentation, see:
- [RESUME_BUILDER_GUIDE.md](RESUME_BUILDER_GUIDE.md)
- [RESUME_BUILDER_IMPLEMENTATION.md](RESUME_BUILDER_IMPLEMENTATION.md)
