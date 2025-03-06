@echo off
echo Starting Bamaram Frontend...

:: Set execution policy for PowerShell
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force"

:: Run npm start directly
call npm start

pause 