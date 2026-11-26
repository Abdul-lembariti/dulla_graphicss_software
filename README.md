# DULLA portfolio

Personal portfolio of Abdulaziz H. Lembariti. The public site uses static HTML, CSS, and JavaScript. On Windows, double-click [Start-Portfolio-Preview.cmd](_studio/Start-Portfolio-Preview.cmd). You can also start the preview from this folder with Python.

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open `http://127.0.0.1:8000/`.

## Add a project

1. Open [Open-Project-Editor.cmd](_studio/Open-Project-Editor.cmd) on Windows, or run `python _studio/launch.py`. Each launch opens a new random URL bound to your own computer.
2. Connect with a [fine-grained GitHub token](https://github.com/settings/personal-access-tokens/new). Select only `Abdul-lembariti/dulla_graphicss_software` and grant **Contents: Read and write**. The editor keeps the token in the tab's memory.
3. Enter the project details, select a cover and optional gallery images, then choose **Save to GitHub**. The editor converts images to WebP and saves them with the catalog in one Git commit.
4. Follow **Review on GitHub** to open the comparison. Create and merge the pull request when you want the changes to go live. Multiple saves in one session use the same draft branch. Start a fresh session after merging.

The first use requires `projects.json` on the repository's default branch. Draft commits follow the existing repository's visibility. The editor itself runs on localhost and is excluded from GitHub Pages.

## Deploy

The revised portfolio is ready for the existing GitHub Pages project URL. Review the changes locally, then merge the portfolio source to the configured Pages source branch when ready to publish. Keep the current Pages source folder and relative asset URLs. For branch-based Pages publishing, `_config.yml` excludes the editor, authored source assets, and verification artifacts. For a future workflow-based deployment, publish an equivalent allow-listed output.

The source of the downloadable one-page profile is [profile.txt](profile.txt). The enquiry form uses the existing FormSubmit endpoint. Confirm inbox activation before testing a live delivery.

See [the refinement and verification report](docs/portfolio-refinement.md) and [the before-and-after captures](docs/screenshots).
