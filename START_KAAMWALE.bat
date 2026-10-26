@echo off
title KaamWale.com - 1-Click Launch
color 0A
cls
echo ========================================================
echo         🚀 STARTING KAAMWALE.COM LOCAL SERVER
echo ========================================================
echo.
echo [1/2] Opening http://localhost:3000 in your browser...
cd /d "%~dp0"
start "" "http://localhost:3000"

echo [2/2] Running Node.js backend server (Port 3000)...
node server.js
pause
