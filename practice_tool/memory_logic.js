/**
 * 麓鸣网站字根练习记忆逻辑模块
 * 基于间隔重复的记忆算法
 */

class MemoryLogic {
    constructor() {
        // 进度列表存储结构，按模式存储
        this.progressByMode = {};
        
        // 当前使用的模式
        this.currentMode = null;
        
        // 积分
        this.points = 0;
        
        // 初始化状态
        this.isInitComplete = false;
        this.isFirstTime = true;
        
        // 提示设置
        this.showPrompt = true;
        this.showNextPrompt = true;
        
        // 基础字根数量
        this.baseZigenCount = 241;
        
        // 高级字根数量
        this.advancedZigenCount = 462;
        
        // 加载本地存储的进度
        this.loadProgress();
    }
    
    /**
     * 设置当前使用的模式
     * @param {string} mode - 练习模式
     */
    setCurrentMode(mode) {
        this.currentMode = mode;
    }

    /**
     * 获取当前进度列表
     */
    getCurrentProgressList() {
        if (!this.currentMode) return [];
        return this.progressByMode[this.currentMode] || [];
    }

    /**
     * 设置当前进度列表
     * @param {Array} progressList - 进度列表
     */
    setCurrentProgressList(progressList) {
        if (!this.currentMode) return;
        this.progressByMode[this.currentMode] = progressList;
    }

    /**
     * 初始化基础字根进度列表
     * @param {number} count - 字根数量
     */
    initProgressList(count = this.baseZigenCount) {
        if (!this.currentMode) return;
        
        this.progressByMode[this.currentMode] = Array.from({length: count}, (_, index) => ({
            index: index,
            count: -1  // -1表示未开始练习
        }));
        this.isInitComplete = true;
        this.isFirstTime = false;
    }
    
    /**
     * 从本地加载进度
     * @param {Array} zigenList - 字根列表
     */
    loadLocalProgress(zigenList) {
        if (!this.currentMode) return;
        
        // 如果该模式的进度不存在，初始化进度列表
        if (!this.progressByMode[this.currentMode]) {
            this.initProgressList(zigenList.length);
        }
    }
    
    /**
     * 保存进度到本地存储
     */
    saveProgress() {
        const progressData = {
            progressByMode: this.progressByMode,
            points: this.points,
            isInitComplete: this.isInitComplete,
            isFirstTime: this.isFirstTime
        };
        localStorage.setItem('zigenPracticeProgress', JSON.stringify(progressData));
    }
    
    /**
     * 从本地存储加载进度
     */
    loadProgress() {
        const savedData = localStorage.getItem('zigenPracticeProgress');
        if (savedData) {
            try {
                const progressData = JSON.parse(savedData);
                this.progressByMode = progressData.progressByMode || {};
                this.points = progressData.points || 0;
                this.isInitComplete = progressData.isInitComplete || false;
                this.isFirstTime = progressData.isFirstTime || true;
            } catch (error) {
                console.error('加载本地进度失败:', error);
            }
        }
    }
    
    /**
     * 设置显示下一个提示
     * @param {boolean} show - 是否显示
     */
    setShowNextPrompt(show) {
        this.showNextPrompt = show;
    }
    
    /**
     * 设置显示提示
     * @param {boolean} show - 是否显示
     */
    setShowPrompt(show) {
        this.showPrompt = show;
    }
    
    /**
     * 设置进度列表
     * @param {Array} progressList - 进度列表
     */
    setProgress(progressList) {
        this.setCurrentProgressList(progressList);
    }
    
    /**
     * 根据连续正确次数获取下一个间隔位置
     * @param {number} correctCount - 连续正确次数
     * @param {boolean} isBaseMode - 是否是基础模式
     * @returns {number} 下一个间隔位置
     */
    getNextInterval(correctCount, isBaseMode = true) {
        const progressList = this.getCurrentProgressList();
        if (progressList.length === 0) {
            return 0;
        }
        
        if (isBaseMode) {
            // 基础模式的间隔映射表
            const intervals = {0: 2, 1: 4, 2: 8, 3: 12, 4: 20, 5: 40, 6: 60, 7: 100};
            const nextPosition = intervals[correctCount] || progressList.length - 1;
            return Math.min(nextPosition, progressList.length - 1);
        } else {
            // 高级模式的间隔映射表
            const intervals = {0: 2, 1: 4, 2: 8, 3: 12, 4: 20, 5: 60, 6: 100};
            const nextPosition = intervals[correctCount] || progressList.length - 1;
            return Math.min(nextPosition, progressList.length - 1);
        }
    }
    
    /**
     * 计算下一个要练习的字根位置（核心间隔重复算法）
     * @param {boolean} isBaseMode - 是否是基础模式
     * @returns {Array} 更新后的进度列表
     */
    nextRoot(isBaseMode = true) {
        const progressList = this.getCurrentProgressList();
        if (progressList.length === 0) {
            return progressList;
        }
        
        // 获取当前字根的连续正确次数
        const currentCount = progressList[0].count + 1;
        
        // 计算下一个间隔位置
        const nextPosition = this.getNextInterval(currentCount, isBaseMode);
        
        // 重新排列进度列表
        return this.rearrangeProgressList(nextPosition);
    }
    
    /**
     * 重新排列进度列表
     * @param {number} nextPosition - 下一个位置
     * @returns {Array} 更新后的进度列表
     */
    rearrangeProgressList(nextPosition) {
        let progressList = this.getCurrentProgressList();
        if (progressList.length === 0 || nextPosition < 0 || nextPosition >= progressList.length) {
            return progressList;
        }
        
        // 创建进度列表的副本
        const newProgressList = [...progressList];
        
        // 移除第一个元素
        const firstItem = newProgressList.shift();
        
        // 更新连续正确次数
        firstItem.count += 1;
        
        // 将元素插入到新位置
        newProgressList.splice(nextPosition, 0, firstItem);
        
        // 更新进度列表
        this.setCurrentProgressList(newProgressList);
        
        // 保存进度到本地存储
        this.saveProgress();
        
        return newProgressList;
    }
    
    /**
     * 处理输入错误
     * @returns {Array} 更新后的进度列表
     */
    handleCodingError() {
        let progressList = this.getCurrentProgressList();
        if (progressList.length === 0) {
            return progressList;
        }
        
        // 重置当前字根的连续正确次数
        progressList[0].count = -1;
        
        // 更新进度列表
        this.setCurrentProgressList(progressList);
        
        // 保存进度到本地存储
        this.saveProgress();
        
        return progressList;
    }
    
    /**
     * 获取已完成的总数
     * @returns {number} 已完成的总数
     */
    getCompletedTotal() {
        const progressList = this.getCurrentProgressList();
        if (progressList.length === 0) {
            return -1;
        }
        
        let maxIndex = progressList[0];
        
        // 查找已完成的最大索引
        for (const item of progressList) {
            if (item.count !== -1 && item.index > maxIndex.index) {
                maxIndex = item;
            }
        }
        
        return maxIndex.index + 1;
    }
    
    /**
     * 重置进度
     * @param {boolean} reloadPage - 是否重新加载页面
     */
    reset(reloadPage = true) {
        // 重置所有模式的进度
        this.progressByMode = {};
        this.points = 0;
        this.isFirstTime = true;
        this.showPrompt = true;
        this.showNextPrompt = true;
        
        // 清除本地存储
        localStorage.removeItem('zigenPracticeProgress');
        
        if (reloadPage) {
            window.location.reload();
        }
    }
    
    /**
     * 获取当前进度列表
     * @returns {Array} 进度列表
     */
    getProgressList() {
        return this.getCurrentProgressList();
    }
    
    // getContinuous方法已移除，连续正确次数由StateManager管理
    
    /**
     * 获取积分
     * @returns {number} 积分
     */
    getPoints() {
        return this.points;
    }
    
    /**
     * 获取初始化状态
     * @returns {boolean} 是否已初始化完成
     */
    isInitialized() {
        return this.isInitComplete;
    }
    
    /**
     * 获取所有进度数据
     * @returns {Object} 包含所有进度信息的数据对象
     */
    getProgress() {
        return {
            progressByMode: this.progressByMode,
            currentMode: this.currentMode,
            points: this.points,
            isInitComplete: this.isInitComplete,
            isFirstTime: this.isFirstTime,
            showPrompt: this.showPrompt,
            showNextPrompt: this.showNextPrompt,
            baseZigenCount: this.baseZigenCount,
            advancedZigenCount: this.advancedZigenCount
        };
    }
    
    /**
     * 从进度数据恢复状态
     * @param {Object} progressData - 包含进度信息的数据对象
     */
    restoreProgress(progressData) {
        if (progressData) {
            this.progressByMode = progressData.progressByMode || this.progressByMode;
            this.currentMode = progressData.currentMode || this.currentMode;
            this.points = progressData.points || this.points;
            this.isInitComplete = progressData.isInitComplete || this.isInitComplete;
            this.isFirstTime = progressData.isFirstTime || this.isFirstTime;
            this.showPrompt = progressData.showPrompt !== undefined ? progressData.showPrompt : this.showPrompt;
            this.showNextPrompt = progressData.showNextPrompt !== undefined ? progressData.showNextPrompt : this.showNextPrompt;
            this.baseZigenCount = progressData.baseZigenCount || this.baseZigenCount;
            this.advancedZigenCount = progressData.advancedZigenCount || this.advancedZigenCount;
            
            // 保存恢复后的进度到本地存储
            this.saveProgress();
        }
    }
}

// 创建实例
const memoryLogic = new MemoryLogic();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = memoryLogic;
} else if (typeof window !== 'undefined') {
    window.memoryLogic = memoryLogic;
}