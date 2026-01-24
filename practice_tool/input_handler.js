// 输入处理模块
const InputHandler = (function() {
    // 绑定输入事件
    function bindInputEvents() {
        const state = StateManager.getState();
        
        if (state.practiceMode === 'finger') {
            // 指法练习模式：单个输入框
            bindFingerInputEvents();
        } else {
            // 其他模式：两个输入框
            bindRegularInputEvents();
        }
    }

    // 绑定指法练习输入事件
    function bindFingerInputEvents() {
        const input = document.getElementById('code-input');
        if (!input) return;
        
        function handleCompositionStart(e) {
            StateManager.updateState({ isComposing: true });
        }
        
        function handleCompositionEnd(e) {
            const state = StateManager.getState();
            state.isComposing = false;
            
            // 忽略空格字符
            if (input.value.length >= 1 && input.value.trim() !== '') {
                submitCode();
            } else if (input.value.trim() === '') {
                // 如果只有空格，清空输入框
                input.value = '';
            }
        }
        
        function handleInput(e) {
            const state = StateManager.getState();
            // 忽略空格字符
            if (!state.isComposing && this.value.length >= 1 && this.value.trim() !== '') {
                submitCode();
            } else if (this.value.trim() === '') {
                // 如果只有空格，清空输入框
                this.value = '';
            }
        }
        
        function handleKeypress(e) {
            if (e.key === 'Enter') {
                submitCode();
            } else if (e.key === ' ') {
                // 空格键显示提示信息
                e.preventDefault(); // 阻止默认的空格输入
                console.log('空格键被按下，正在显示提示...');
                
                const state = StateManager.getState();
                const codeHint = document.getElementById('code-hint');
                if (!codeHint) {
                    console.log('code-hint元素未找到');
                    return;
                }
                
                let hintContent;
                if (state.practiceMode === 'finger') {
                    hintContent = MAYUAN[state.currentChar].code;
                } else {
                    hintContent = ZIGEN_DATA[state.currentChar].code;
                }
                
                console.log('提示内容:', hintContent);
                codeHint.textContent = `编码提示：${hintContent}`;
                codeHint.classList.add('show');
                
                setTimeout(() => {
                    codeHint.classList.remove('show');
                }, 5000);
            }
        }
        
        // 添加keydown事件处理
        function handleKeydown(e) {
            if (e.key === ' ') {
                // 空格键显示提示信息
                e.preventDefault(); // 阻止默认的空格输入
                console.log('keydown事件触发空格键');
                
                const state = StateManager.getState();
                const codeHint = document.getElementById('code-hint');
                if (!codeHint) return;
                
                let hintContent;
                if (state.practiceMode === 'finger') {
                    hintContent = MAYUAN[state.currentChar].code;
                } else {
                    hintContent = ZIGEN_DATA[state.currentChar].code;
                }
                
                codeHint.textContent = `编码提示：${hintContent}`;
                codeHint.classList.add('show');
                
                setTimeout(() => {
                    codeHint.classList.remove('show');
                }, 5000);
            }
        }
        
        // 移除现有的事件监听器，避免重复绑定
        input.removeEventListener('compositionstart', handleCompositionStart);
        input.removeEventListener('compositionend', handleCompositionEnd);
        input.removeEventListener('input', handleInput);
        input.removeEventListener('keypress', handleKeypress);
        input.removeEventListener('keydown', handleKeydown);
        
        // 绑定新的事件监听器
        input.addEventListener('compositionstart', handleCompositionStart);
        input.addEventListener('compositionend', handleCompositionEnd);
        input.addEventListener('input', handleInput);
        input.addEventListener('keypress', handleKeypress);
        input.addEventListener('keydown', handleKeydown);
    }

    // 绑定普通练习输入事件
    function bindRegularInputEvents() {
        const input1 = document.getElementById('code-input-1');
        const input2 = document.getElementById('code-input-2');
        
        if (!input1 || !input2) return;
        
        function handleCompositionStart(e) {
            StateManager.updateState({ isComposing: true });
        }
        
        function handleCompositionEnd(e) {
            const state = StateManager.getState();
            state.isComposing = false;
            
            // 忽略空格字符
            if (input1.value.length >= 2 && input1.value.trim() !== '') {
                const text = input1.value;
                input1.value = text[0];
                input2.value = text.slice(1, 2);
                submitCode();
            } else if (input1.value.length === 1 && input2.value.length === 1 && input1.value.trim() !== '' && input2.value.trim() !== '') {
                submitCode();
            } else if (input1.value.length === 1 && input1.value.trim() !== '') {
                input2.focus();
            } else if (input1.value.trim() === '' && input2.value.trim() === '') {
                // 如果两个输入框都是空格，清空它们
                input1.value = '';
                input2.value = '';
            }
        }
        
        function handleInput(e) {
            const state = StateManager.getState();
            if (!state.isComposing) {
                // 忽略空格字符
                if (e.target === input1 && this.value.length === 1 && this.value.trim() !== '') {
                    input2.focus();
                } else if (e.target === input2 && this.value.length === 1 && this.value.trim() !== '') {
                    submitCode();
                } else if (this.value.trim() === '') {
                    // 如果只有空格，清空输入框
                    this.value = '';
                }
            }
        }
        
        function handleKeydown(e) {
            if (e.target === input2 && e.key === 'Backspace' && this.value.length === 0) {
                input1.focus();
            } else if (e.key === ' ') {
                // 空格键显示提示信息
                e.preventDefault(); // 阻止默认的空格输入
                console.log('keydown事件触发空格键');
                
                const state = StateManager.getState();
                const codeHint = document.getElementById('code-hint');
                if (!codeHint) return;
                
                let hintContent;
                if (state.practiceMode === 'finger') {
                    hintContent = MAYUAN[state.currentChar].code;
                } else {
                    hintContent = ZIGEN_DATA[state.currentChar].code;
                }
                
                codeHint.textContent = `编码提示：${hintContent}`;
                codeHint.classList.add('show');
                
                setTimeout(() => {
                    codeHint.classList.remove('show');
                }, 5000);
            }
        }
        
        function handleKeypress(e) {
            if (e.key === 'Enter') {
                submitCode();
            } else if (e.key === ' ') {
                // 空格键显示提示信息
                e.preventDefault(); // 阻止默认的空格输入
                console.log('空格键被按下，正在显示提示...');
                
                const state = StateManager.getState();
                const codeHint = document.getElementById('code-hint');
                if (!codeHint) {
                    console.log('code-hint元素未找到');
                    return;
                }
                
                let hintContent;
                if (state.practiceMode === 'finger') {
                    hintContent = MAYUAN[state.currentChar].code;
                } else {
                    hintContent = ZIGEN_DATA[state.currentChar].code;
                }
                
                console.log('提示内容:', hintContent);
                codeHint.textContent = `编码提示：${hintContent}`;
                codeHint.classList.add('show');
                
                setTimeout(() => {
                    codeHint.classList.remove('show');
                }, 5000);
            }
        }
        
        // 移除现有的事件监听器，避免重复绑定
        [input1, input2].forEach(input => {
            input.removeEventListener('compositionstart', handleCompositionStart);
            input.removeEventListener('compositionend', handleCompositionEnd);
            input.removeEventListener('input', handleInput);
            input.removeEventListener('keydown', handleKeydown);
            input.removeEventListener('keypress', handleKeypress);
        });
        
        // 绑定新的事件监听器
        [input1, input2].forEach(input => {
            input.addEventListener('compositionstart', handleCompositionStart);
            input.addEventListener('compositionend', handleCompositionEnd);
            input.addEventListener('input', handleInput);
            input.addEventListener('keydown', handleKeydown);
            input.addEventListener('keypress', handleKeypress);
        });
    }

    // 提交编码
    function submitCode() {
        const state = StateManager.getState();
        let userCode, correctAnswer, inputElements, hintContent;
        
        if (state.practiceMode === 'finger') {
            // 指法练习模式：单个输入框
            const input = document.getElementById('code-input');
            if (!input) return;
            
            userCode = input.value.trim();
            hintContent = MAYUAN[state.currentChar].code; // 用于显示提示信息
            correctAnswer = MAYUAN[state.currentChar].name; // 用于判断答案
            inputElements = [input];
        } else {
            // 其他模式：两个输入框
            const input1 = document.getElementById('code-input-1');
            const input2 = document.getElementById('code-input-2');
            if (!input1 || !input2) return;
            
            userCode = (input1.value + input2.value).trim();
            hintContent = ZIGEN_DATA[state.currentChar].code; // 用于显示提示信息
            correctAnswer = ZIGEN_DATA[state.currentChar].code; // 用于判断答案
            inputElements = [input1, input2];
        }
        
        // 更新练习统计
        StateManager.updatePracticeStats(userCode === correctAnswer);
        
        if (userCode === correctAnswer) {
            // 更新连击数
            StateManager.updateStreak(true);
            
            // 更新记忆逻辑
            memoryLogic.nextRoot(true);
            
            // 更新输入框样式
            UIUpdater.updateInputStyles(inputElements, true);
            
            // 更新出现次数并检查是否已学完
            if (!state.zigenGroupOccurrences[state.currentChar]) {
                state.zigenGroupOccurrences[state.currentChar] = 1;
            } else {
                state.zigenGroupOccurrences[state.currentChar]++;
            }
            
            // 判定条件：连续正确输入3次认为已学完
            const isLearned = state.zigenGroupOccurrences[state.currentChar] >= 3;
            
            // 如果是第一次学完这个字根/码元，更新进度
            if (isLearned) {
                // 从memoryLogic中获取已完成的数量
                const completedCount = memoryLogic.getCompletedTotal();
                if (completedCount !== -1) {
                    // 更新进度
                    StateManager.updateLearningProgress(completedCount);
                } else {
                    // 兼容旧版本的回退方案
                    const learnedSet = new Set();
                    for (const char in state.zigenGroupOccurrences) {
                        if (state.zigenGroupOccurrences[char] >= 3) {
                            learnedSet.add(char);
                        }
                    }
                    // 更新进度
                    StateManager.updateLearningProgress(learnedSet.size);
                }
                UIUpdater.updateProgressBar();
                
                // 检查是否所有都已学完
                if (StateManager.isAllLearned()) {
                    UIUpdater.showCompletionMessage();
                }
            }
            
            setTimeout(() => {
                // 移动到下一个字符
                StateManager.updateState({ index: state.index + 1 });
                
                // 显示下一个字符
                BasePractice.nextChar();
                
                // 更新统计信息
                UIUpdater.updateStats();
            }, 150);
        } else {
            // 更新连击数
            StateManager.updateStreak(false);
            
            // 更新记忆逻辑
            memoryLogic.handleCodingError();
            
            // 重置该字根/码元的出现次数
            state.zigenGroupOccurrences[state.currentChar] = 0;
            
            // 更新输入框样式
            UIUpdater.updateInputStyles(inputElements, false);
        }
        
        // 更新统计信息
        UIUpdater.updateStats();
    }

    // 跳过当前字符


    // 处理键盘事件（全局）
    function handleGlobalKeyEvents() {
        // 目前没有全局键盘事件需要处理
    }

    return {
        bindInputEvents: bindInputEvents,
        submitCode: submitCode,
        handleGlobalKeyEvents: handleGlobalKeyEvents
    };
})();
