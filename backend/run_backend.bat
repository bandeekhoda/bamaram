@echo off
echo Starting Bamaram Backend Server...
echo.

REM Set the working directory to the backend folder
cd /d "%~dp0"

REM Run the Python script that handles venv activation and server startup
python run.py

REM Keep the window open if there's an error
if errorlevel 1 (
    echo.
    echo An error occurred while starting the server.
    pause
) 