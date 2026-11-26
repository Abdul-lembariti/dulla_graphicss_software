# Verification report

Verified on 26 November 2026. The final hero uses the earlier outlined DULLA layout. The UI and the preview screenshot reflect the removal of the rolling object and experimental 3D wordmark.

| Check | Result |
| --- | --- |
| Responsive | Chrome passed all eight widths, 320, 375, 390, 430, 768, 1024, 1440 and 1920 px. An 844 × 390 landscape viewport also passed. No horizontal overflow was detected. |
| Navigation | Mobile menu open and close, Escape, anchor navigation, and keyboard focus transfer passed. |
| Archive | Five selected projects and all 20 archive entries rendered. Filters returned 5 Software, 11 Design and branding, and 4 Photography and creative results. |
| Details | Project links, three-image Artworks gallery, direct URL fragments, back and forward, Escape dismissal, and focus restoration passed. |
| Motion | Chrome verified that pointer movement produces a 3D transform on cover images. Reduced-motion mode passed the navigation and gallery checks. |
| Accessibility | axe reported zero violations for the desktop and mobile landing views and the mobile Love in Action detail dialog. [Raw results](accessibility.json) |
| Browser compatibility | Chrome full checks and Edge mobile navigation and layout smoke test passed. Both are Chromium-based. |
| Contact and profile | Required-field validation and a FormSubmit POST passed with interception. The profile returned a valid one-page tagged PDF under the repository subpath and lists the two teams. A desktop or mobile end-user download action was outside the confirmed headless results. |
| Private editor | Browser tests verified the random local route, token handling, image previews, WebP optimization, atomic catalog and image commit payload, duplicate detection, non-forced branch update and conflict retry. GitHub responses were mocked. |
| Links and static hosting | The GitHub Pages subpath served the site, modules, images and profile. Local dependencies and project IDs were verified. All four live project sites opened in Chrome. The final run recorded zero uncaught page errors or 4xx/5xx responses. |

## Performance

The final build was measured in three fresh Chrome browser contexts emulating a 390 × 844 mobile viewport. On the unthrottled local server, median first contentful paint and largest contentful paint were **352 ms**, and cumulative layout shift was **0**. These are local measurements. Production network performance and field INP remain unmeasured. [Raw measurements](local-performance.json)

The earlier rolling-hero iteration scored **89 performance**, **100 accessibility**, **100 best practices** and **100 SEO** in Lighthouse mobile simulation, with 2.29 s LCP and 0.001 CLS rounded to three decimals. The final Lighthouse rerun did not receive permission. The scores describe that earlier iteration. [Archived Lighthouse report](lighthouse-rolling-iteration.json)

Public publishing and live write access with the owner's GitHub token remain separate from these local checks.
