@echo off
chcp 65001 > nul
title AI Web Server

cd d:\data_vis\projectwork

echo.
echo =============================================
echo Web Server for AI Color Analysis
echo =============================================
echo.
echo Starting web server at http://localhost:8000
echo.

D:/ananconda/Scripts/conda.exe run -n closeai_env python -m http.server 8000

pause
