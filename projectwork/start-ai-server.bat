@echo off
chcp 65001 > nul
title AI Color Analysis Server

cd d:\data_vis\projectwork

echo.
echo =============================================
echo AI Color Analysis Server
echo =============================================
echo.
echo Starting server at http://localhost:5000
echo.

D:\ananconda\envs\closeai_env\python.exe ai_server.py

pause
