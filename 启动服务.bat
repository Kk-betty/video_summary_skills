@echo off
chcp 65001 >nul
title 视频总结网站 - 一键启动
echo ================================================
echo 🚀 视频总结网站 - 一键启动
echo ================================================
echo.

echo [1/2] 临时解除 PowerShell 执行策略限制...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

echo.
echo [2/2] 正在启动服务...
echo.

node start-all.cjs

echo.
echo 服务已停止
pause