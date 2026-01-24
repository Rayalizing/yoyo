// 基础练习核心模块
const BasePractice = (function() {
    // 获取下一个字符
    function nextChar() {
        const state = StateManager.getState();
        const progressList = memoryLogic.getProgressList();
        
        if (progressList.length === 0) {
            initBasePractice();
            return;
        }
        
        let currentItem;
        
        if (state.practiceMode === 'finger') {
            // 指法练习模式：使用 MAYUAN 中的码元
            const mayuanKeys = Object.keys(MAYUAN); 
            const currentProgressIndex = progressList[0].index;
            
            if (currentProgressIndex < 0 || currentProgressIndex >= mayuanKeys.length) {
                currentItem = mayuanKeys[0];
            } else {
                currentItem = mayuanKeys[currentProgressIndex];
            }
        } else {
            // 其他模式：使用 ZIGEN_DATA 中的字根
            const zigenKeys = Object.keys(ZIGEN_DATA);
            const currentProgressIndex = progressList[0].index;
            
            if (currentProgressIndex < 0 || currentProgressIndex >= zigenKeys.length) {
                currentItem = zigenKeys[0];
            } else {
                currentItem = zigenKeys[currentProgressIndex];
            }
        }
        
        // 更新当前字符
        StateManager.updateCurrentChar(currentItem);
        
        // 显示编码提示（首次出现时）
        UIUpdater.showFirstCodeHint();
        
        // 更新当前字符显示
        UIUpdater.updateCurrentCharDisplay();
        
        // 更新输入区域
        UIUpdater.updateInputArea();
    }

    // 初始化基础练习
    function initBasePractice() {
        const state = StateManager.getState();
        let practiceKeys;
        
        // 根据练习模式选择要练习的内容
        if (state.practiceMode === 'finger') {
            // 指法练习模式：使用 MAYUAN 的键（码元）
            practiceKeys = Object.keys(MAYUAN);
        } else if (state.practiceMode === 'base') {
            // 基础练习模式：只使用主字根（ZIGEN_GROUPS 的键）
            practiceKeys = Object.keys(ZIGEN_GROUPS);
        } else if (state.practiceMode === 'advanced') {
            // 进阶练习模式：使用所有字根（ZIGEN_DATA 的键）
            practiceKeys = Object.keys(ZIGEN_DATA);
        } else {
            // 默认使用基础练习模式
            state.practiceMode = 'base';
            practiceKeys = Object.keys(ZIGEN_GROUPS);
        }
        
        // 初始化练习状态
        StateManager.initPracticeState(practiceKeys);
        
        // 更新进度条显示
        UIUpdater.updateProgressBar();
        
        // 显示第一个字符
        nextChar();
    }

    // 切换标签页
    function switchTab(mode) {
        // 更新UI
        UIUpdater.switchTabUI(mode);
        
        // 更新状态
        StateManager.updateTabMode(mode);
        
        // 处理不同的练习模式
        if (mode === 'finger' || mode === 'base' || mode === 'advanced') {
            // 设置练习模式
            StateManager.updatePracticeMode(mode);
            
            // 重新初始化练习
            initBasePractice();
        }
    }

    // 获取当前状态
    function getState() {
        return StateManager.getState();
    }

    // 获取当前字根组
    function getCurrentZigenGroup() {
        const state = StateManager.getState();
        return Utils.getZigenGroup(state.currentChar);
    }

    // 初始化模块
    function init() {
        // 绑定全局事件
        InputHandler.handleGlobalKeyEvents();
        
        // 初始化UI
        document.addEventListener('DOMContentLoaded', function() {
            initBasePractice();
            InputHandler.bindInputEvents();
        });
    }

    // 对外暴露的API
    return {
        init: init,
        initBasePractice: initBasePractice,
        nextChar: nextChar,
        switchTab: switchTab,
        getState: getState,
        getCurrentZigenGroup: getCurrentZigenGroup
    };
})();

// 初始化模块
BasePractice.init();
