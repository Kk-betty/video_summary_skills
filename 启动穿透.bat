@echo off
chcp 65001 >nul
title 视频总结网站 - 内网穿透
echo ================================================
echo 🌐 视频总结网站 - 内网穿透工具
echo ================================================
echo.

echo [1/2] 临时解除 PowerShell 执行策略限制...
powershell -Command "Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass"

echo.
echo [2/2] 正在启动内网穿透...
echo.

node start-tunnel.cjs

echo.
echo 穿透服务已停止
pause