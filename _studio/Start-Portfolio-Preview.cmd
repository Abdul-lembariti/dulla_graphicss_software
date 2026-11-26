@echo off
cd /d "%~dp0.."
echo Open http://127.0.0.1:8000/ in your browser.
where py >nul 2>nul
if errorlevel 1 (
  python -m http.server 8000 --bind 127.0.0.1
) else (
  py -3 -m http.server 8000 --bind 127.0.0.1
)
if errorlevel 1 pause
