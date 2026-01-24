#!/usr/bin/env python3
"""
麓鸣字根练习工具
"""

import yaml
import json
import os

class yoyoCodePracticeTool:
    def __init__(self, mapping_file):
        with open(mapping_file, 'r', encoding='utf-8') as f:
            self.data = yaml.safe_load(f)
        
        self.mapping = self.data.get('mapping', {})
        self.grouping = self.data.get('grouping', {})
        
        # 合并grouping中的字根到主映射（使用is_sub_of对应的字根编码）
        for char, info in self.grouping.items():
            if 'is_sub_of' in info:
                parent_char = info['is_sub_of']
                if parent_char in self.mapping:
                    self.mapping[char] = {
                        'code': self.mapping[parent_char]['code'],
                        'name': info.get('name', '')
                    }
    
    def generate_javascript_data(self):
        """生成JavaScript字根数据"""
        js_data = "{\n"
        for i, (char, info) in enumerate(self.mapping.items()):
            code = info.get('code', '')
            name = info.get('name', char)
            js_data += f'    "{char}": {{"code": "{code}", "name": "{name}"}}'
            if i < len(self.mapping) - 1:
                js_data += ",\n"
            else:
                js_data += "\n"
        js_data += "};"
        return js_data
    
    def generate_html(self):
        """生成完整的HTML练习页面"""
        
        html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🦌 麓鸣字根练习工具</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0c1929 0%, #1a365d 50%, #0c1929 100%);
            min-height: 100vh;
            color: #e2e8f0;
        }
        
        .navbar {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(56, 189, 248, 0.2);
        }
        
        .nav-link {
            color: #94a3b8;
            transition: all 0.3s ease;
        }
        
        .nav-link:hover, .nav-link.active {
            color: #38bdf8;
        }
        
        .practice-card {
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(56, 189, 248, 0.1);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .char-display {
            font-family: 'Noto Sans SC', serif;
            text-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
            animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        .code-input {
            background: rgba(15, 23, 42, 0.8);
            border: 2px solid #334155;
            transition: all 0.3s ease;
        }
        
        .code-input:focus {
            border-color: #38bdf8;
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
            outline: none;
        }
        
        .code-input.correct {
            border-color: #22c55e;
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
        }
        
        .code-input.incorrect {
            border-color: #ef4444;
            box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
            animation: shake 0.5s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);
        }
        
        .btn-secondary {
            background: #334155;
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: #475569;
        }
        
        .stat-card {
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(56, 189, 248, 0.1);
        }
        
        .tab-btn {
            transition: all 0.3s ease;
            border-bottom: 2px solid transparent;
        }
        
        .tab-btn.active {
            border-bottom-color: #38bdf8;
            color: #38bdf8;
        }
        
        .progress-bar {
            background: linear-gradient(90deg, #0ea5e9, #38bdf8);
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
        }
        
        .feedback {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .zigen-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
            gap: 8px;
        }
        
        .zigen-item {
            background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
            border: 1px solid rgba(56, 189, 248, 0.1);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .zigen-item:hover {
            transform: scale(1.05);
            border-color: #38bdf8;
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
        }
        
        .rank-badge {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .segment-badge {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
        }
        
        .mode-selector {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        
        .mode-btn {
            padding: 8px 20px;
            border-radius: 20px;
            background: #1e293b;
            border: 1px solid #334155;
            color: #94a3b8;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .mode-btn.active {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            border-color: transparent;
            color: white;
        }
        
        .streak-fire {
            display: inline-block;
            animation: burn 0.5s ease infinite;
        }
        
        @keyframes burn {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .login-modal {
            background: rgba(15, 23, 42, 0.98);
            backdrop-filter: blur(10px);
        }
    </style>
</head>
<body class="min-h-screen">
    <!-- 导航栏 -->
    <nav class="navbar fixed top-0 w-full z-50 py-3">
        <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div class="flex items-center gap-8">
                <a href="#" class="text-2xl font-bold text-sky-400">🦌 麓鸣</a>
                <div class="hidden md:flex items-center gap-6">
                    <a href="#" class="nav-link hover:text-sky-400">Home</a>
                    <a href="#" class="nav-link hover:text-sky-400">中文文档</a>
                    <a href="#" class="nav-link hover:text-sky-400">拆分查询</a>
                    <a href="#" class="nav-link hover:text-sky-400 active">麓鸣练习</a>
                    <a href="#" class="nav-link hover:text-sky-400">木易跟打</a>
                    <a href="#" class="nav-link hover:text-sky-400">资源下载</a>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <div id="user-info" class="hidden md:flex items-center gap-3">
                    <span class="text-sky-400 font-medium" id="username">--</span>
                    <button onclick="logout()" class="text-slate-400 hover:text-white text-sm">退出</button>
                </div>
                <button onclick="showLoginModal()" id="login-btn" class="bg-sky-500 hover:bg-sky-400 px-4 py-2 rounded-lg text-white text-sm font-medium transition">
                    登录
                </button>
            </div>
        </div>
    </nav>
    
    <!-- 主内容区 -->
    <main class="pt-20 pb-10 px-4">
        <div class="max-w-4xl mx-auto">
            <!-- 标题区 -->
            <div class="text-center mb-8">
                <h1 class="text-3xl md:text-4xl font-bold mb-2">
                    <span class="text-sky-400">字根练习</span>
                    <span id="mode-title" class="text-slate-300">- 基础模式</span>
                </h1>
            </div>
            
            <!-- 标签页 -->
            <div class="flex justify-center gap-8 mb-6">
                <button onclick="switchTab('base')" id="tab-base" class="tab-btn active pb-2 text-lg font-medium">
                    基础练习
                </button>
                <button onclick="switchTab('advanced')" id="tab-advanced" class="tab-btn pb-2 text-lg font-medium text-slate-400">
                    进阶练习
                </button>
                <button onclick="switchTab('table')" id="tab-table" class="tab-btn pb-2 text-lg font-medium text-slate-400">
                    字根表
                </button>
            </div>
            
            <!-- 练习卡片 -->
            <div class="practice-card rounded-2xl p-6 md:p-8">
                <!-- 统计栏 -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div class="stat-card rounded-xl p-4 text-center">
                        <div class="text-3xl font-bold text-sky-400" id="streak">0</div>
                        <div class="text-sm text-slate-400 mt-1">连击</div>
                    </div>
                    <div class="stat-card rounded-xl p-4 text-center">
                        <div class="text-3xl font-bold text-emerald-400" id="accuracy">0%</div>
                        <div class="text-sm text-slate-400 mt-1">正确率</div>
                    </div>
                    <div class="stat-card rounded-xl p-4 text-center">
                        <div class="text-3xl font-bold text-amber-400" id="speed">0</div>
                        <div class="text-sm text-slate-400 mt-1">速度(字/分)</div>
                    </div>
                    <div class="stat-card rounded-xl p-4 text-center">
                        <div class="text-3xl font-bold text-purple-400" id="score">0</div>
                        <div class="text-sm text-slate-400 mt-1">得分</div>
                    </div>
                </div>
                
                <!-- 用户排行信息 -->
                <div class="bg-slate-800/50 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-6">
                        <div>
                            <span class="text-slate-400">当前排行</span>
                            <span class="text-sky-400 font-bold text-xl ml-2" id="rank">--</span>
                        </div>
                        <div>
                            <span class="text-slate-400">距上一名</span>
                            <span class="text-amber-400 font-bold ml-2" id="rank-diff">--</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="segment-badge">
                            <span class="text-slate-400">段位:</span>
                            <span class="text-white font-bold" id="segment">黄金1</span>
                        </div>
                        <div>
                            <span class="text-slate-400">最高连击</span>
                            <span class="text-orange-400 font-bold ml-2" id="max-streak">--</span>
                        </div>
                    </div>
                </div>
                
                <!-- 基础练习模式 -->
                <div id="practice-base" class="mode-content">
                    <!-- 进度条 -->
                    <div class="mb-6">
                        <div class="flex justify-between text-sm text-slate-400 mb-2">
                            <span>练习进度</span>
                            <span id="progress-text">0/0</span>
                        </div>
                        <div class="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div class="progress-bar h-full rounded-full transition-all duration-300" id="progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <!-- 字根显示 -->
                    <div class="text-center py-8">
                        <div class="text-slate-400 mb-4" id="char-hint">请输入该字根的编码 (按空格显示提示)</div>
                        <div class="char-display text-8xl md:text-9xl font-bold text-white mb-6" id="current-char">
                            加载中...
                        </div>
                    </div>
                    
                    <!-- 输入区域 -->
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <input type="text" id="code-input" 
                            class="code-input px-6 py-4 rounded-xl text-center text-2xl text-white w-full sm:w-48"
                            placeholder="输入编码" autocomplete="off" autofocus>
                        <div class="flex gap-3">
                            <button onclick="submitCode()" class="btn-primary px-6 py-4 rounded-xl text-white font-medium flex-1 sm:flex-none">
                                确认
                            </button>
                            <button onclick="skipCharacter()" class="btn-secondary px-6 py-4 rounded-xl text-white font-medium flex-1 sm:flex-none">
                                跳过
                            </button>
                        </div>
                    </div>
                    
                    <!-- 反馈信息 -->
                    <div id="feedback" class="hidden text-center py-3 rounded-lg mb-4"></div>
                </div>
                
                <!-- 进阶练习模式 -->
                <div id="practice-advanced" class="mode-content hidden">
                    <div class="mb-6">
                        <div class="flex justify-center gap-3 mb-4">
                            <button onclick="setAdvDifficulty('easy')" class="mode-btn active" id="btn-easy">简单</button>
                            <button onclick="setAdvDifficulty('medium')" class="mode-btn" id="btn-medium">中等</button>
                            <button onclick="setAdvDifficulty('hard')" class="mode-btn" id="btn-hard">困难</button>
                        </div>
                    </div>
                    
                    <div class="text-center py-8">
                        <div class="text-slate-400 mb-4" id="adv-char-hint">请拆分并输入编码</div>
                        <div class="char-display text-8xl md:text-9xl font-bold text-white mb-6" id="adv-current-char">
                            点击开始
                        </div>
                        <div class="text-sm text-slate-500" id="char-analysis"></div>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                        <input type="text" id="adv-code-input" 
                            class="code-input px-6 py-4 rounded-xl text-center text-2xl text-white w-full sm:w-48"
                            placeholder="输入编码" autocomplete="off">
                        <div class="flex gap-3">
                            <button onclick="submitAdvCode()" class="btn-primary px-6 py-4 rounded-xl text-white font-medium flex-1 sm:flex-none">
                                确认
                            </button>
                            <button onclick="showAdvHint()" class="btn-secondary px-6 py-4 rounded-xl text-white font-medium flex-1 sm:flex-none">
                                提示
                            </button>
                        </div>
                    </div>
                    
                    <div id="adv-feedback" class="hidden text-center py-3 rounded-lg mb-4"></div>
                </div>
                
                <!-- 字根表模式 -->
                <div id="practice-table" class="mode-content hidden">
                    <div class="mb-4">
                        <input type="text" id="zigen-search" 
                            class="code-input w-full px-4 py-2 rounded-lg text-base"
                            placeholder="搜索字根..." oninput="filterZigen()">
                    </div>
                    <div class="zigen-grid" id="zigen-grid"></div>
                </div>
            </div>
        </div>
    </main>
    
    <!-- 登录模态框 -->
    <div id="login-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="login-modal absolute inset-0" onclick="hideLoginModal()"></div>
        <div class="relative bg-slate-800 rounded-2xl p-8 w-full max-w-md border border-slate-700">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">登录麓鸣账号</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-slate-400 mb-2">用户名</label>
                    <input type="text" id="login-username" class="code-input w-full px-4 py-3 rounded-lg text-white" placeholder="请输入用户名">
                </div>
                <div>
                    <label class="block text-slate-400 mb-2">密码</label>
                    <input type="password" id="login-password" class="code-input w-full px-4 py-3 rounded-lg text-white" placeholder="请输入密码">
                </div>
                <button onclick="login()" class="btn-primary w-full py-3 rounded-lg text-white font-medium mt-6">
                    登录
                </button>
                <button onclick="register()" class="w-full py-3 rounded-lg text-slate-400 hover:text-white transition">
                    没有账号？去注册
                </button>
            </div>
            <button onclick="hideLoginModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>
    
    <!-- 字根数据 -->
    <script>
        const ZIGEN_DATA = ''' + self.generate_javascript_data() + '''
        
        // 练习状态
        let state = {
            mode: 'base',
            currentChar: null,
            queue: [],
            index: 0,
            streak: 0,
            maxStreak: 0,
            total: 0,
            correct: 0,
            startTime: null,
            user: null,
            advDifficulty: 'easy',
            advCurrentChar: null
        };
        
        // 初始化
        document.addEventListener('DOMContentLoaded', function() {
            initBasePractice();
            initZigenTable();
            loadUserData();
            
            // 绑定事件
            document.getElementById('code-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') submitCode();
            });
            
            document.getElementById('adv-code-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') submitAdvCode();
            });
        });
        
        // 切换标签页
        function switchTab(mode) {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-slate-400');
            });
            document.querySelectorAll('.mode-content').forEach(content => content.classList.add('hidden'));
            
            document.getElementById('tab-' + mode).classList.add('active');
            document.getElementById('tab-' + mode).classList.remove('text-slate-400');
            document.getElementById('practice-' + mode).classList.remove('hidden');
            
            state.mode = mode;
            
            if (mode === 'base') {
                initBasePractice();
                document.getElementById('mode-title').textContent = '- 基础模式';
            } else if (mode === 'advanced') {
                document.getElementById('mode-title').textContent = '- 进阶模式';
            } else {
                document.getElementById('mode-title').textContent = '- 字根表';
            }
        }
        
        // 初始化基础练习
        function initBasePractice() {
            state.queue = Object.keys(ZIGEN_DATA).sort(() => Math.random() - 0.5);
            state.index = 0;
            state.streak = 0;
            state.total = 0;
            state.correct = 0;
            state.startTime = Date.now();
            nextChar();
        }
        
        // 显示下一个字根
        function nextChar() {
            if (state.index >= state.queue.length) {
                state.queue = Object.keys(ZIGEN_DATA).sort(() => Math.random() - 0.5);
                state.index = 0;
            }
            
            state.currentChar = state.queue[state.index];
            document.getElementById('current-char').textContent = state.currentChar;
            document.getElementById('code-input').value = '';
            document.getElementById('code-input').focus();
            
            updateProgress();
        }
        
        // 提交编码
        function submitCode() {
            const input = document.getElementById('code-input');
            const userCode = input.value.trim().toLowerCase();
            const correctCode = ZIGEN_DATA[state.currentChar].code.toLowerCase();
            
            state.total++;
            
            if (userCode === correctCode) {
                state.correct++;
                state.streak++;
                if (state.streak > state.maxStreak) state.maxStreak = state.streak;
                
                showFeedback('correct', '✓ 正确！编码: ' + correctCode);
                input.classList.add('correct');
                setTimeout(() => {
                    input.classList.remove('correct');
                    state.index++;
                    nextChar();
                    updateStats();
                }, 500);
            } else {
                state.streak = 0;
                showFeedback('error', '✗ 错误！正确编码: ' + correctCode);
                input.classList.add('incorrect');
                setTimeout(() => input.classList.remove('incorrect'), 1000);
            }
            
            updateStats();
            saveUserData();
        }
        
        // 跳过字根
        function skipCharacter() {
            state.streak = 0;
            state.index++;
            nextChar();
            updateStats();
        }
        
        // 显示反馈
        function showFeedback(type, message) {
            const feedback = document.getElementById('feedback');
            feedback.textContent = message;
            feedback.className = 'text-center py-3 rounded-lg mb-4';
            
            if (type === 'correct') {
                feedback.classList.add('bg-green-500/20', 'text-green-400');
            } else {
                feedback.classList.add('bg-red-500/20', 'text-red-400');
            }
            
            feedback.classList.remove('hidden');
            setTimeout(() => feedback.classList.add('hidden'), 1500);
        }
        
        // 更新统计
        function updateStats() {
            const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
            const timeElapsed = (Date.now() - state.startTime) / 1000 / 60;
            const speed = timeElapsed > 0 ? Math.round(state.correct / timeElapsed) : 0;
            const score = state.correct * 10 + state.streak * 5;
            
            document.getElementById('streak').innerHTML = state.streak > 0 ? 
                `<span class="streak-fire">🔥</span> ${state.streak}` : '0';
            document.getElementById('accuracy').textContent = accuracy + '%';
            document.getElementById('speed').textContent = speed;
            document.getElementById('score').textContent = score;
            document.getElementById('max-streak').textContent = state.maxStreak;
        }
        
        // 更新进度
        function updateProgress() {
            const total = state.queue.length;
            const current = state.index + 1;
            const percent = (current / total) * 100;
            
            document.getElementById('progress-bar').style.width = percent + '%';
            document.getElementById('progress-text').textContent = current + '/' + total;
        }
        
        // 进阶练习设置难度
        function setAdvDifficulty(difficulty) {
            state.advDifficulty = difficulty;
            document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('btn-' + difficulty).classList.add('active');
        }
        
        // 生成进阶练习字根
        function generateAdvChar() {
            const chars = Object.keys(ZIGEN_DATA);
            state.advCurrentChar = chars[Math.floor(Math.random() * chars.length)];
            document.getElementById('adv-current-char').textContent = state.advCurrentChar;
            
            const info = ZIGEN_DATA[state.advCurrentChar];
            document.getElementById('char-analysis').textContent = info.name || '';
            
            document.getElementById('adv-code-input').value = '';
            document.getElementById('adv-code-input').focus();
        }
        
        // 进阶练习提交
        function submitAdvCode() {
            if (!state.advCurrentChar) {
                generateAdvChar();
                return;
            }
            
            const input = document.getElementById('adv-code-input');
            const userCode = input.value.trim().toLowerCase();
            const correctCode = ZIGEN_DATA[state.advCurrentChar].code.toLowerCase();
            
            if (userCode === correctCode) {
                showAdvFeedback('correct', '✓ 正确！');
                state.streak++;
            } else {
                showAdvFeedback('error', '✗ 错误！正确编码: ' + correctCode);
                state.streak = 0;
            }
            
            updateStats();
            setTimeout(generateAdvChar, 1000);
        }
        
        // 进阶练习显示提示
        function showAdvHint() {
            if (state.advCurrentChar) {
                const code = ZIGEN_DATA[state.advCurrentChar].code;
                showAdvFeedback('correct', '提示: ' + code);
            }
        }
        
        // 进阶练习反馈
        function showAdvFeedback(type, message) {
            const feedback = document.getElementById('adv-feedback');
            feedback.textContent = message;
            feedback.className = 'text-center py-3 rounded-lg mb-4';
            
            if (type === 'correct') {
                feedback.classList.add('bg-green-500/20', 'text-green-400');
            } else {
                feedback.classList.add('bg-red-500/20', 'text-red-400');
            }
            
            feedback.classList.remove('hidden');
            setTimeout(() => feedback.classList.add('hidden'), 1500);
        }
        
        // 初始化字根表
        function initZigenTable() {
            const grid = document.getElementById('zigen-grid');
            grid.innerHTML = '';
            
            for (const [char, info] of Object.entries(ZIGEN_DATA)) {
                const item = document.createElement('div');
                item.className = 'zigen-item rounded-lg p-3 text-center';
                item.innerHTML = `
                    <div class="text-2xl font-bold text-white mb-1">${char}</div>
                    <div class="text-sm text-sky-400">${info.code}</div>
                `;
                item.onclick = () => {
                    state.currentChar = char;
                    document.getElementById('current-char').textContent = char;
                    document.getElementById('code-input').value = '';
                    switchTab('base');
                };
                grid.appendChild(item);
            }
        }
        
        // 搜索字根
        function filterZigen() {
            const search = document.getElementById('zigen-search').value.toLowerCase();
            const items = document.querySelectorAll('.zigen-item');
            
            items.forEach(item => {
                const char = item.querySelector('.text-2xl').textContent;
                const code = item.querySelector('.text-sm').textContent;
                
                if (char.toLowerCase().includes(search) || code.includes(search)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }
        
        // 用户相关功能
        function showLoginModal() {
            document.getElementById('login-modal').classList.remove('hidden');
        }
        
        function hideLoginModal() {
            document.getElementById('login-modal').classList.add('hidden');
        }
        
        function login() {
            const username = document.getElementById('login-username').value;
            if (username) {
                state.user = {
                    username: username,
                    stats: {
                        streak: state.streak,
                        accuracy: state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0,
                        score: state.correct * 10 + state.streak * 5
                    }
                };
                
                document.getElementById('login-btn').classList.add('hidden');
                document.getElementById('user-info').classList.remove('hidden');
                document.getElementById('username').textContent = username;
                
                hideLoginModal();
                saveUserData();
            }
        }
        
        function logout() {
            state.user = null;
            document.getElementById('login-btn').classList.remove('hidden');
            document.getElementById('user-info').classList.add('hidden');
            localStorage.removeItem('yoyoCodeUser');
        }
        
        function register() {
            alert('注册功能开发中...');
        }
        
        function saveUserData() {
            if (state.user) {
                state.user.stats = {
                    streak: state.maxStreak,
                    accuracy: state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0,
                    score: state.correct * 10 + state.maxStreak * 5
                };
                localStorage.setItem('yoyoCodeUser', JSON.stringify(state.user));
            }
        }
        
        function loadUserData() {
            const saved = localStorage.getItem('yoyoCodeUser');
            if (saved) {
                state.user = JSON.parse(saved);
                document.getElementById('login-btn').classList.add('hidden');
                document.getElementById('user-info').classList.remove('hidden');
                document.getElementById('username').textContent = state.user.username;
                
                if (state.user.stats) {
                    document.getElementById('max-streak').textContent = state.user.stats.streak || 0;
                }
            }
        }
    </script>
</body>
</html>'''
        
        return html
    
    def save_html(self, output_file='practice.html'):
        html_content = self.generate_html()
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        print(f"✓ 已生成练习页面: {output_file}")
        return output_file

if __name__ == '__main__':
    tool = yoyoCodePracticeTool('../zigen_table/mapping.yaml')
    output_file = tool.save_html('practice.html')
    
    print(f"\n🦌 麓鸣字根练习工具已创建！")
    print(f"文件位置: {os.path.abspath(output_file)}")
    print(f"\n功能特点:")
    print(f"  • 基础练习模式 - 练习所有字根编码")
    print(f"  • 进阶练习模式 - 随机字根快速练习")
    print(f"  • 字根表模式 - 查看完整字根编码对照")
    print(f"  • 统计功能 - 连击、正确率、速度、得分")
    print(f"  • 用户系统 - 登录保存学习进度")
    print(f"  • 排行榜 - 模拟排行和段位系统")
    print(f"\n请在浏览器中打开 practice.html 开始练习！")
