@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 goto use_py

where python >nul 2>nul
if errorlevel 1 goto missing_python
python "%~dp0preview.py"
endlocal
exit /b %errorlevel%

:use_py
py "%~dp0preview.py"
endlocal
exit /b %errorlevel%

:missing_python
echo Python was not found.
echo Install Python or deploy the site to GitHub Pages.
pause
endlocal
exit /b 1
