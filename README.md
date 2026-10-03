# Academic website

A fast, free website for a researcher and lecturer: home, research, publications, weekly teaching materials, and CV.
It has no build step and no server. It runs on GitHub Pages as it is.

## Put it online (about 10 minutes)

1. Create a free account at github.com.
2. Create a new repository.
   - Name it `YOURUSERNAME.github.io` (your username, then `.github.io`). Your site will then be at `https://YOURUSERNAME.github.io`.
   - Choose **Public**. Free GitHub Pages needs a public repository.
3. Unzip this folder on your computer. In the new repository click **Add file, then Upload files**, and drag in everything that is inside the unzipped folder (the files and folders, not the zip itself). Click **Commit changes**.
   - Make sure the hidden file `.nojekyll` is uploaded too. If your system hides it, it is fine to skip it: the site works without it.
4. Open **Settings, then Pages**. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and **Save**.
5. Wait one or two minutes, then open `https://YOURUSERNAME.github.io`.

## Make it yours

Open `data.js` on GitHub and click the pencil icon. Replace the sample text with your own: name, role, biography, research themes, publications, courses. Click **Commit changes**. The site updates within a minute.

- **Photo:** upload your photo to the `assets` folder as `photo.jpg`, then in `data.js` set `photo: "assets/photo.jpg"`.
- **CV:** upload your CV to the `files` folder and set `cv: "files/your-cv.pdf"`.
- **Address of your site:** set `siteUrl: "https://YOURUSERNAME.github.io"`. It helps search engines.
- **Colours and fonts:** the first lines of `assets/style.css`.

## Every week: add new course material

1. Upload the new PDFs to the course folder, for example `files/math201/`. On GitHub: open the folder, **Add file, then Upload files**.
2. Open `tools/new-week.html` on your site (`https://YOURUSERNAME.github.io/tools/new-week.html`). Choose the course, fill in the form, and click **Copy result**.
3. Open `data.js`, find the course, and paste the result on the line after `weeks: [`. Commit.

That is all. The newest week appears first, with a New badge for eight days, and it also appears under Latest on the home page.

Tips:
- Solutions can be released later: give the file a `release: "2026-10-12"` date. Until that day it shows as “available 12 Oct” without a link.
- A file with `url: ""` shows as “coming soon”.
- Use the same file names every week (`week05-notes.pdf`, `week05-sheet.pdf`) and you will never get lost.

## Add a publication or a news item

In `data.js`, copy one block in `publications` (or `news`), paste it above the others, and edit it. Publications are sorted by year automatically. Visitors can copy a citation and a BibTeX record for each paper. Put `selected: true` on the papers you want on the home page.

## Good to know

- Everything in the repository is public, including PDFs. Do not upload anything you would not want a stranger to read. A release date hides the link, not the file.
- A custom domain such as `yourname.com` can be added in **Settings, then Pages, then Custom domain**.
- The 404 page assumes your site is at the root of the address (`YOURUSERNAME.github.io`). If you use a project repository such as `YOURUSERNAME.github.io/website`, delete the `<base href="/">` line in `404.html`.
- The sample files and the folder `files/sample.pdf` are placeholders. Delete them when you have your own.

## What is in the folder

| File or folder | Purpose |
| --- | --- |
| `data.js` | All your content. The only file you normally edit. |
| `index.html`, `research.html`, `publications.html`, `teaching.html`, `cv.html`, `404.html` | The pages. They only load the shared code. |
| `assets/style.css` | Design: colours, fonts, layout. |
| `assets/site.js` | Builds the pages from `data.js`. |
| `files/` | Your PDFs and other downloads. |
| `tools/new-week.html` | Form that writes the weekly entry for you. |
