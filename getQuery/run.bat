@echo off
:: Navigate to the directory containing the script and files
cd /d %~dp0

:: Run the Node.js script
node extract.js

:: Pause the command window to see the output (optional)
pause
