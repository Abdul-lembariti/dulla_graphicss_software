# DULLA portfolio refinement

## Baseline

The original checkout was clean at commit `aa1938e`. A source archive was saved to `%TEMP%\dulla-portfolio-aa1938e.zip` before edits. The audit covered the tracked source, the asset folders, hosting configuration, and the live public URL.

| Area | Findings |
| --- | --- |
| Architecture | One static page with anchor navigation, plain CSS and ES modules. `projects.js` held 20 records with local media and four live links. GitHub Pages required relative asset paths. Replit used the Python static server. |
| Identity and layout | The original hero had a clear introduction and two calls to action. Its small CSS monogram and grouped labels competed with an already oversized headline. Later sections repeated labels and rules across the page. |
| Work | The filter worked for Software, and the catalog retained original artwork. Branding and Motion filters had zero results. The two independent redesigns had bracketed case study prompts, and several entries depended on generic preview artwork. |
| Assets and speed | The original catalog referenced a 9 MB poster and multiple images over 1 MB. Fonts were requested from Google. The hero was drawn in CSS and had no 3D mesh. |
| Interaction and access | The initial site had a skip link, labelled form fields, keyboard focus styles, reduced-motion CSS and an Escape handler for the mobile menu. Tiny secondary labels, empty filters, and pending social links weakened the path from browsing to contact. |
| SEO and contact | The page had descriptive metadata and Person structured data. It used an SVG social image and FormSubmit for delivery. The profile links still needed verified destinations. |
| Maintenance | Adding a project required changing a JavaScript module. Static hosting provided no authentication service. Legacy artwork and the supplied source CV remain in the checkout. |
| Links | The public portfolio loaded. Love in Action, Duka Janja, Artisan Coffee, and Dream of Nature Safari opened in Chrome. The safari redesign's hero media did not settle into a usable capture. |

Baseline evidence includes the [desktop hero](screenshots/before-1440.jpg), [mobile hero](screenshots/before-390.jpg), and [Software filter](screenshots/before-work-1440.jpg), reproduced from the checkpoint.

## Genes benchmark

The benchmark's [intro](screenshots/genes-intro-1440.jpg) uses a full-screen wordmark reveal and a skip control. The [desktop hero](screenshots/genes-1440.jpg) pairs a confident identification block with a layered portrait and a wall of project images. The [tablet](screenshots/genes-768.jpg) and [mobile](screenshots/genes-390.jpg) layouts replace that wall with horizontal thumbnail strips and bring the contact actions forward. The [work screen](screenshots/genes-work-1440.jpg) aligns a large live project preview with its description, technology labels, category filters, and thumbnail navigation.

In Chrome, skipping the intro revealed the hero, the main work action changed to the work panel, and Work with me opened an inquiry drawer. The page exposed a downloadable-profile control and registered a service worker with a manifest. A programmatic profile-control activation did not open print in the tested headless session, and offline installation and form delivery were outside the verified benchmark behavior.

Its main strengths are the large composition, a consistent baseline across controls, and project proof near the introduction. Full-screen navigation asks visitors to learn additional controls and the intro can add time before the work appears. DULLA uses an open first frame, native page scroll, large outlined DULLA lettering, and imagery from the owner's project archive. Source: [Genes](https://genes.outshine.co.tz/).

## Additional research and design direction

- Lusion uses a clear relationship between immersive visuals and labelled project work. The portfolio adopts that split between a large opening artwork and a skimmable archive. [Lusion](https://lusion.co/) · [CSS Design Awards case](https://www.cssdesignawards.com/wotm/lusion-v3/44311/)
- Bruno Simon uses the 3D environment as a demonstration of creative development. In the final portfolio the direct-manipulation idea is used for the project previews, which tilt in response to pointer movement. [Bruno Simon](https://bruno-simon.com/)
- Brittany Chiang makes role, proof, projects and contact easy to locate. DULLA gives the full name and role immediate visual prominence and puts contact and the profile one action away. [Brittany Chiang](https://brittanychiang.com/)
- Dennis Snellenberg and Paco Coursey give the project or practice label just enough context to scan work. The case-study views use actual previews, links, and the facts available for each entry. [Dennis Snellenberg](https://dennissnellenberg.com/) · [Paco Coursey](https://paco.me/)
- Roman Jean-Elie's case study connects spatial motion to the page layout. DULLA uses scroll-linked reveals and perspective on project previews for precise pointers. [Codrops case study](https://tympanus.net/codrops/2025/11/27/letting-the-creative-process-shape-a-webgl-portfolio/)

Charcoal `#11100f`, warm paper `#f3eee5`, and coral `#ff7457` retain the selected palette. DM Sans drives hierarchy, Instrument Serif distinguishes editorial emphasis, and DM Mono marks small labels. The masthead and footer use a shared alignment grid. The desktop work index stays in reach while browsing. On small screens the outlined lettering, introduction, work controls and galleries follow a vertical layout.

## Implementation roadmap and completion

1. **Audit and research** completed. Checkpoint, original checkout, public pages, benchmark captures, and additional portfolios reviewed.
2. **Design** completed. Reworked the split hero into a centered composition with outlined DULLA lettering, verified name and role, and the selected coral palette. Two WebGL concepts were evaluated. The owner's final direction restored the earlier hero layout and removed the rolling object and experimental 3D wordmark.
3. **Public implementation** completed. CSS and browser animation APIs handle entrances, scroll reveals, gallery state changes and detail transitions. Project covers use perspective in response to pointer movement. The page honors reduced-motion settings. The catalog preserves all 20 projects and categorizes self-initiated work.
4. **Content** completed. Verified experience and capabilities, including Code Africa and Jambo Team, are reflected on the site and a tagged one-page profile. Project cards use optimized WebP artwork and captures from actual live projects where available.
5. **Private editor** completed locally. The launcher uses a random path and loopback, and the browser works with a repository-scoped GitHub token. Cover and gallery uploads and catalog updates share a non-forced draft commit. The compare link allows deliberate publication after review.
6. **Verification** covers the checks below. Publishing awaits the owner's approval.

The static stack remains appropriate for a single portfolio and GitHub Pages. The showcase uses shared catalog validation. The editor uses GitHub's native Git object API, so a separate database, credentials in public scripts, and a public admin route are unnecessary. The design uses a brief nonblocking entrance. A command palette, analytics, and PWA installation were evaluated and deferred to keep the single-page browsing flow focused. [GitHub Git database documentation](https://docs.github.com/en/rest/git)

## Evidence

- [Refined desktop](screenshots/after-1440.jpg), [tablet](screenshots/after-768.jpg), and [mobile](screenshots/after-390.jpg)
- [Selected work](screenshots/after-work-1440.jpg) and [project detail](screenshots/after-project-1440.jpg)
- [Local project editor](screenshots/studio-1220.jpg)

## Verification and limitations

Chrome and Edge were used on the local server. The public implementation was tested under the same `/dulla_graphicss_software/` subpath used by GitHub Pages. See the [verification results](verification.md) for the exact runs and metrics. The application has no build step.

Live GitHub writes require the portfolio owner's token. The editor was tested using browser-intercepted GitHub responses, including picture conversion, branch creation, duplicate validation, conflict recovery, and disconnect. Form validation and the FormSubmit POST were tested using interception. Inbox delivery requires an active FormSubmit endpoint. Public deployment and live writes were outside the local rollout.

For further refinement, collect original screenshots for portfolio entries lacking them and add specific challenge, role, technology, and outcome notes as they become available. Replace the safari preview fallback when an authoritative visual is available. Safari and Firefox engine testing, assistive-technology testing, and field Core Web Vitals remain open.
