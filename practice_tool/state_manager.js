// 状态管理模块
const StateManager = (function() {
    // 初始状态
    let state = {
        mode: 'base',
        practiceMode: 'finger', // 'finger', 'base' 或 'advanced'
        currentChar: null,
        queue: [],
        index: 0,
        streak: 0,
        maxStreak: 0,
        total: 0,
        correct: 0,
        startTime: null,
        isComposing: false,
        zigenGroupOccurrences: {},
        // 进度跟踪相关状态
        learnedCount: 0,  // 已经学完的字根/码元数量
        totalCount: 0,    // 总字根/码元数量
        progress: 0       // 进度百分比
    };

    // 获取当前状态
    function getState() {
        return state;
    }

    // 更新状态
    function updateState(newState) {
        state = { ...state, ...newState };
    }

    // 重置状态
    function resetState() {
        state = {
            mode: 'base',
            practiceMode: 'finger',
            currentChar: null,
            queue: [],
            index: 0,
            streak: 0,
            maxStreak: 0,
            total: 0,
            correct: 0,
            startTime: null,
            isComposing: false,
            zigenGroupOccurrences: {},
            // 重置进度跟踪相关状态
            learnedCount: 0,
            totalCount: 0,
            progress: 0
        };
    }

    // 初始化练习状态
    function initPracticeState(practiceKeys) {
        const currentMode = state.practiceMode;
        memoryLogic.setCurrentMode(currentMode);
        
        // 初始化进度列表（如果该模式还没有进度）
        const progressData = memoryLogic.getProgress();
        if (!memoryLogic.isInitialized() || !progressData.progressByMode[currentMode]) {
            memoryLogic.initProgressList(practiceKeys.length);
        }
        
        state.queue = practiceKeys;
        state.queue.sort(() => Math.random() - 0.5);
        state.index = 0;
        state.streak = 0;
        state.total = 0;
        state.correct = 0;
        state.startTime = Date.now();
        state.zigenGroupOccurrences = {};
        
        // 加载已保存的进度，而不是重置
        loadModeProgress(currentMode);
    }

    // 更新连击数
    function updateStreak(isCorrect) {
        if (isCorrect) {
            // 正确时，全局连续正确次数+1
            state.streak++;
            if (state.streak > state.maxStreak) {
                state.maxStreak = state.streak;
            }
        } else {
            // 错误时，全局连续正确次数重置为0
            state.streak = 0;
        }
    }

    // 更新练习统计
    function updatePracticeStats(isCorrect) {
        state.total++;
        if (isCorrect) {
            state.correct++;
        }
    }

    // 更新当前字符
    function updateCurrentChar(char) {
        state.currentChar = char;
        
        // 记录字根出现次数
        if (!state.zigenGroupOccurrences[char]) {
            state.zigenGroupOccurrences[char] = 1;
        } else {
            state.zigenGroupOccurrences[char]++;
        }
    }

    // 更新练习模式
    function updatePracticeMode(mode) {
        state.practiceMode = mode;
        // 设置memoryLogic的当前模式
        memoryLogic.setCurrentMode(mode);
        // 加载该模式的进度
        loadModeProgress(mode);
    }

    // 更新标签页模式
    function updateTabMode(mode) {
        state.mode = mode;
    }

    // 更新学习进度
    function updateLearningProgress(completedCount) {
        state.learnedCount = completedCount;
        state.progress = Math.round((state.learnedCount / state.totalCount) * 100);
        // 保存进度到本地存储
        memoryLogic.saveProgress();
    }

    // 加载指定模式的进度
    function loadModeProgress(mode) {
        // 获取当前模式的进度数据
        const completedCount = memoryLogic.getCompletedTotal();
        if (completedCount !== -1) {
            state.learnedCount = completedCount;
            // 根据模式获取总数量
            const progressList = memoryLogic.getProgressList();
            state.totalCount = progressList.length;
            state.progress = Math.round((state.learnedCount / state.totalCount) * 100);
            // 更新进度条显示
            if (typeof UIUpdater !== 'undefined' && UIUpdater.updateProgressBar) {
                UIUpdater.updateProgressBar();
            }
        }
    }

    // 检查是否所有都已学完
    function isAllLearned() {
        return state.learnedCount >= state.totalCount;
    }

    return {
        getState: getState,
        updateState: updateState,
        resetState: resetState,
        initPracticeState: initPracticeState,
        updateStreak: updateStreak,
        updatePracticeStats: updatePracticeStats,
        updateCurrentChar: updateCurrentChar,
        updatePracticeMode: updatePracticeMode,
        updateTabMode: updateTabMode,
        updateLearningProgress: updateLearningProgress,
        isAllLearned: isAllLearned
    };
})();
