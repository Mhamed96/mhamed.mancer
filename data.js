/* ======================================================================
   THIS IS THE ONLY FILE YOU NEED TO EDIT.

   Every page of the site is built from the information below.

   Common tasks
   - New publication: copy one { year: ... } block in `publications` and change it.
   - New week of teaching: use tools/new-week.html, or copy one week block
     inside the right course, and change it. Put your PDF files in the `files`
     folder and write their path in `url`, for example "files/math201/week05-notes.pdf".
   - Show a file later: add release: "2026-10-12" to a file. Until that day it
     shows as "available 12 Oct" with no link (good for solutions).
   - A file with url: "" shows as "coming soon".
   - Dates are written year-month-day, for example "2026-10-04".
   - The NEW badge appears by itself for a week after the date of a teaching week.

   The text below is sample content. Replace it with your own.
   ====================================================================== */
const SITE = {
  name: "Dr. Firstname Lastname",
  authorName: "F. Lastname",            // how your name appears in author lists (shown in bold)
  initials: "FL",
  role: "Associate Professor of Mathematics",
  institution: "University Name",
  department: "Department of Mathematics",
  photo: "",                            // for example "assets/photo.jpg". Empty shows your initials.
  email: "name@university.edu",
  cv: "files/sample.pdf",               // your CV as a PDF
  siteUrl: "",                          // for example "https://yourname.github.io" (helps search engines)
  description: "Research, publications and weekly course materials of Dr. Firstname Lastname, University Name.",
  lede: "I study numerical methods for partial differential equations and teach mathematics to undergraduate and master's students.",
  bio: [
    "I am a researcher and lecturer at University Name. My work connects the analysis of partial differential equations with algorithms that solve them quickly and reliably.",
    "I supervise master's and doctoral students and coordinate the first-year calculus programme. On this site you will find my research, my publications and the weekly material for my courses."
  ],
  interests: ["Finite element methods", "Multigrid solvers", "Scientific computing"],
  ids: [
    { label: "Google Scholar", url: "https://scholar.google.com/" },
    { label: "ORCID", url: "https://orcid.org/" },
    { label: "ResearchGate", url: "https://www.researchgate.net/" },
    { label: "GitHub", url: "https://github.com/" }
  ],
  figures: [                            // extra numbers shown next to the bio (optional)
    { value: "10", label: "years of teaching" },
    { value: "8", label: "students supervised" }
  ],

  news: [
    { date: "2026-09-12", text: "New preprint on adaptive convection-diffusion solvers posted on arXiv.", url: "publications.html" },
    { date: "2026-06-18", text: "Invited plenary talk accepted for the ENUMATH conference." },
    { date: "2026-03-02", text: "Research grant awarded by the National Science Fund." }
  ],

  opening: {
    title: "Join the group",
    text: "I am looking for a doctoral student to work on multigrid methods for transport problems. A background in numerical analysis and some programming experience in Python or C++ is expected. Write to me with your CV and a short description of your interests."
  },

  positions: [
    { years: "2021 to present", title: "Associate Professor", place: "University Name, Department of Mathematics", note: "" },
    { years: "2016 to 2021", title: "Assistant Professor", place: "University Name, Department of Mathematics", note: "" },
    { years: "2015 to 2016", title: "Postdoctoral researcher", place: "Research Institute X", note: "Fast solvers group" }
  ],
  education: [
    { years: "2011 to 2015", title: "PhD in Applied Mathematics", place: "University A", note: "Thesis: Stabilised finite element methods for transport problems" },
    { years: "2009 to 2011", title: "MSc in Mathematics", place: "University B", note: "" }
  ],

  research: [
    { title: "Finite element methods", text: "Stable discretisations for convection-dominated problems, and a posteriori error estimates that tell a solver where to refine.", kw: ["stabilisation", "error estimates", "adaptivity"] },
    { title: "Fast solvers", text: "Multigrid and domain decomposition preconditioners for large sparse systems arising from anisotropic and heterogeneous media.", kw: ["multigrid", "preconditioning"] },
    { title: "Scientific computing", text: "Reproducible numerical software for diffusion and transport models, released as open source with the papers it supports.", kw: ["Python", "reproducibility"] }
  ],
  projects: [
    { years: "2025 to 2028", title: "Adaptive solvers for transport problems", text: "Error-controlled adaptive methods for transport-dominated models, with open-source reference code.", funding: "National Science Fund, principal investigator" },
    { years: "2022 to 2025", title: "Multigrid for anisotropic media", text: "Robust smoothers and coarse-grid corrections for strongly anisotropic diffusion.", funding: "University research grant, principal investigator" },
    { years: "2023 to present", title: "Numerical software for teaching", text: "Interactive notebooks that accompany the master's course in numerical methods.", funding: "Faculty innovation fund, co-investigator" }
  ],

  /* type: "Journal", "Conference", "Preprint" (anything else also works).
     selected: true puts a paper in "Selected publications" on the home page.
     links: any buttons you like, for example PDF, DOI, Code, arXiv. */
  publications: [
    { year: 2026, type: "Preprint", title: "A posteriori error estimates for adaptive convection-diffusion solvers", authors: "F. Lastname, A. Coauthor", venue: "arXiv:2601.00000", selected: true, links: [{ label: "PDF", url: "https://arxiv.org/" }, { label: "Code", url: "https://github.com/" }] },
    { year: 2025, type: "Journal", title: "Robust multigrid smoothers for anisotropic diffusion", authors: "F. Lastname, B. Coauthor, C. Coauthor", venue: "SIAM Journal on Scientific Computing, 47(3)", selected: true, links: [{ label: "DOI", url: "https://doi.org/" }, { label: "PDF", url: "files/sample.pdf" }] },
    { year: 2024, type: "Conference", title: "Stabilised finite elements on anisotropic meshes", authors: "A. Coauthor, F. Lastname", venue: "Proceedings of ENUMATH 2023", links: [{ label: "DOI", url: "https://doi.org/" }] },
    { year: 2022, type: "Journal", title: "Convergence of a two-level method for transport problems", authors: "F. Lastname", venue: "Numerische Mathematik, 150", selected: true, links: [{ label: "DOI", url: "https://doi.org/" }] },
    { year: 2020, type: "Journal", title: "Preconditioning strategies for saddle point systems", authors: "F. Lastname, D. Coauthor", venue: "Applied Numerical Mathematics, 148", links: [{ label: "DOI", url: "https://doi.org/" }] }
  ],

  /* kind: Lecture, Exercises, Solutions, Lab, Syllabus, Slides, Exam, Reading.
     "TD" is accepted and shown as Exercises. */
  courses: [
    {
      id: "la2", code: "MATH 201", title: "Linear Algebra II", term: "Autumn 2026, second year", color: "indigo",
      folder: "files/math201",
      about: "Eigenvalues, diagonalisation, inner product spaces and the spectral theorem.",
      schedule: [
        { label: "Lectures", value: "Sunday 10:00 to 11:30, room A3" },
        { label: "Tutorials", value: "Wednesday 14:00 to 15:30, room B12" },
        { label: "Office hours", value: "Tuesday and Thursday 14:00 to 16:00, B214" }
      ],
      announcements: [
        { date: "2026-09-30", text: "The midterm test is on 25 October. It covers weeks 1 to 5." }
      ],
      weeks: [
        { n: 4, date: "2026-09-27", topic: "Diagonalisation", files: [
          { kind: "Lecture", label: "Chapter 3 notes", url: "files/sample.pdf" },
          { kind: "Exercises", label: "Exercise sheet 4", url: "files/sample.pdf" },
          { kind: "Solutions", label: "Sheet 4 solutions", url: "files/sample.pdf", release: "2026-10-07" } ] },
        { n: 3, date: "2026-09-20", topic: "Eigenvalues and eigenvectors", files: [
          { kind: "Lecture", label: "Chapter 2 notes", url: "files/sample.pdf" },
          { kind: "Exercises", label: "Exercise sheet 3", url: "files/sample.pdf" },
          { kind: "Solutions", label: "Sheet 3 solutions", url: "files/sample.pdf" } ] },
        { n: 2, date: "2026-09-13", topic: "Determinants and invariants", files: [
          { kind: "Lecture", label: "Chapter 1 notes", url: "files/sample.pdf" },
          { kind: "Exercises", label: "Exercise sheet 2", url: "files/sample.pdf" },
          { kind: "Solutions", label: "Sheet 2 solutions", url: "files/sample.pdf" } ] },
        { n: 1, date: "2026-09-06", topic: "Course introduction and review", files: [
          { kind: "Syllabus", label: "Course syllabus", url: "files/sample.pdf" },
          { kind: "Exercises", label: "Exercise sheet 1", url: "files/sample.pdf" } ] }
      ]
    },
    {
      id: "nm", code: "MATH 540", title: "Numerical Methods for PDEs", term: "Autumn 2026, master 1", color: "coral",
      folder: "files/math540",
      about: "Finite differences and finite elements, stability, and implementation in Python.",
      schedule: [
        { label: "Lectures and lab", value: "Monday 09:00 to 12:00, computer room 2" },
        { label: "Office hours", value: "Tuesday and Thursday 14:00 to 16:00, B214" }
      ],
      announcements: [],
      weeks: [
        { n: 4, date: "2026-09-28", topic: "Weak formulations", files: [
          { kind: "Slides", label: "Slides, week 4", url: "files/sample.pdf" },
          { kind: "Lab", label: "Notebook 4", url: "files/sample.pdf" } ] },
        { n: 3, date: "2026-09-21", topic: "Stability and the CFL condition", files: [
          { kind: "Slides", label: "Slides, week 3", url: "files/sample.pdf" },
          { kind: "Lab", label: "Notebook 3", url: "files/sample.pdf" },
          { kind: "Solutions", label: "Notebook 3 solutions", url: "files/sample.pdf" } ] },
        { n: 2, date: "2026-09-14", topic: "Finite difference schemes", files: [
          { kind: "Slides", label: "Slides, week 2", url: "files/sample.pdf" },
          { kind: "Lab", label: "Notebook 2", url: "files/sample.pdf" } ] },
        { n: 1, date: "2026-09-07", topic: "Introduction and model problems", files: [
          { kind: "Syllabus", label: "Course syllabus", url: "files/sample.pdf" },
          { kind: "Slides", label: "Slides, week 1", url: "files/sample.pdf" } ] }
      ]
    }
  ],
  archive: [                            // past terms (optional). url may be "" for plain text.
    { term: "Spring 2026", items: [{ code: "MATH 102", title: "Calculus II", url: "" }, { code: "MATH 330", title: "Numerical Analysis", url: "" }] },
    { term: "Autumn 2025", items: [{ code: "MATH 201", title: "Linear Algebra II", url: "" }, { code: "MATH 540", title: "Numerical Methods for PDEs", url: "" }] }
  ],

  awards: [
    { year: "2025", text: "Research grant, National Science Fund", note: "Adaptive solvers for transport problems" },
    { year: "2023", text: "Teaching excellence award", note: "Faculty of Sciences" },
    { year: "2018", text: "Best paper award", note: "Numerical Analysis Symposium" }
  ],
  talks: [
    { year: "2026", text: "ENUMATH conference", note: "Plenary talk on adaptive solvers" },
    { year: "2025", text: "Applied Mathematics Seminar, University C", note: "Invited seminar" },
    { year: "2024", text: "Summer School on Scientific Computing", note: "Lecture series, 4 hours" }
  ],
  students: [
    { year: "PhD", text: "Student Name One", note: "Multigrid methods, since 2024" },
    { year: "MSc", text: "Student Name Two", note: "Finite elements for transport, 2025" },
    { year: "MSc", text: "Student Name Three", note: "Mesh adaptation, 2023" }
  ],
  service: [
    { year: "2024 to present", text: "Associate editor", note: "Journal of Computational Methods" },
    { year: "2022 to present", text: "Reviewer", note: "SIAM journals, Numerische Mathematik" },
    { year: "2023", text: "Organiser", note: "Workshop on Fast Solvers, University Name" }
  ],
  contact: [
    { label: "Office", value: "Building B, room 214, University Name" },
    { label: "Office hours", value: "Tuesday and Thursday, 14:00 to 16:00" },
    { label: "Address", value: "Department of Mathematics, University Name, City, Country" }
  ]
};
