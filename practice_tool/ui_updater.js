// UI更新模块
const UIUpdater = (function() {


    // 更新统计信息
    function updateStats() {
        const state = StateManager.getState();
        const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
        const timeElapsed = (Date.now() - state.startTime) / 1000 / 60;
        const speed = timeElapsed > 0 ? Math.round(state.correct / timeElapsed) : 0;
        const score = state.correct * 10 + state.streak * 5;
        
        const streakEl = document.getElementById('streak');
        const accuracyEl = document.getElementById('accuracy');
        const speedEl = document.getElementById('speed');
        const scoreEl = document.getElementById('score');
        const maxStreakEl = document.getElementById('max-streak');
        
        if (streakEl) {
            streakEl.innerHTML = state.streak > 0 ? 
                `<span class="streak-fire">🔥</span> ${state.streak}` : '0';
        }
        if (accuracyEl) accuracyEl.textContent = accuracy + '%';
        if (speedEl) speedEl.textContent = speed;
        if (scoreEl) scoreEl.textContent = score;
        if (maxStreakEl) maxStreakEl.textContent = state.maxStreak;
    }



    // 显示编码提示信息
    function showCodeHint() {
        const state = StateManager.getState();
        const codeHint = document.getElementById('code-hint');
        const hintsContainer = document.getElementById('hints-container');
        if (!codeHint) return;
        
        if (hintsContainer) {
            hintsContainer.style.minHeight = '0';
        }
        
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



    // 更新当前字符显示
    function updateCurrentCharDisplay() {
        const state = StateManager.getState();
        const currentCharEl = document.getElementById('current-char');
        if (!currentCharEl) return;
        
        // 设置固定高度，确保显示位置不变
        currentCharEl.style.height = '240px';
        
        if (state.practiceMode === 'finger') {
            // 指法练习模式：直接显示码元
            currentCharEl.innerHTML = `<div class="char-display">
                                        <div>${state.currentChar}</div>
                                      </div>`;
        } else {
            // 其他模式：显示字根及其从属字根
            const zigenGroup = Utils.getZigenGroup(state.currentChar);
            let displayHTML = '<div class="flex flex-col items-center justify-center h-full gap-4">';
            
            const mainImageUrl = Utils.getCharImageUrl(zigenGroup.main);
            displayHTML += `<div class="main-char">
                                <img src="${mainImageUrl}" alt="${zigenGroup.main}">
                            </div>`;
            
            if (zigenGroup.sub.length > 0) {
                displayHTML += '<div class="sub-chars">';
                zigenGroup.sub.forEach(subChar => {
                    const subImageUrl = Utils.getCharImageUrl(subChar);
                    displayHTML += `<div class="sub-char">
                                        <img src="${subImageUrl}" alt="${subChar}">
                                    </div>`;
                });
                displayHTML += '</div>';
            }
            
            displayHTML += '</div>';
            currentCharEl.innerHTML = displayHTML;
        }
    }

    // 更新输入区域
    function updateInputArea() {
        const state = StateManager.getState();
        const inputContainerEl = document.querySelector('.input-row');
        if (!inputContainerEl) return;
        
        inputContainerEl.style.minHeight = '80px';
        
        if (state.practiceMode === 'finger') {
            if (inputContainerEl.children.length !== 1) {
                while (inputContainerEl.firstChild) {
                    inputContainerEl.removeChild(inputContainerEl.firstChild);
                }
                
                const inputEl = document.createElement('input');
                inputEl.type = 'text';
                inputEl.id = 'code-input';
                inputEl.className = 'code-input';
                inputEl.placeholder = '';
                inputEl.autocomplete = 'off';
                inputEl.maxLength = 2;
                inputEl.autofocus = true;
                inputContainerEl.appendChild(inputEl);
                
                InputHandler.bindInputEvents();
            }
        } else {
            if (inputContainerEl.children.length !== 2) {
                while (inputContainerEl.firstChild) {
                    inputContainerEl.removeChild(inputContainerEl.firstChild);
                }
                
                const input1 = document.createElement('input');
                input1.type = 'text';
                input1.id = 'code-input-1';
                input1.className = 'code-input';
                input1.placeholder = '';
                input1.autocomplete = 'off';
                input1.maxLength = 2;
                input1.autofocus = true;
                inputContainerEl.appendChild(input1);
                
                const input2 = document.createElement('input');
                input2.type = 'text';
                input2.id = 'code-input-2';
                input2.className = 'code-input';
                input2.placeholder = '';
                input2.autocomplete = 'off';
                input2.maxLength = 1;
                inputContainerEl.appendChild(input2);
                
                InputHandler.bindInputEvents();
            }
        }
        
        if (state.practiceMode === 'finger') {
            const inputEl = document.getElementById('code-input');
            if (inputEl) {
                inputEl.value = '';
                inputEl.focus();
            }
        } else {
            const input1 = document.getElementById('code-input-1');
            const input2 = document.getElementById('code-input-2');
            if (input1 && input2) {
                input1.value = '';
                input2.value = '';
                input1.focus();
            }
        }
    }

    // 切换标签页UI
    function switchTabUI(mode) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.mode-content').forEach(content => content.classList.add('hidden'));
        
        const tabEl = document.getElementById('tab-' + mode);
        const practiceEl = document.getElementById('practice-base');
        
        if (tabEl) {
            tabEl.classList.add('active');
        }
        if (practiceEl) {
            practiceEl.classList.remove('hidden');
        }
        
        const modeTitleEl = document.getElementById('mode-title');
        
        if (modeTitleEl) {
            if (mode === 'finger') {
                modeTitleEl.textContent = '- 指法模式';
            } else if (mode === 'base') {
                modeTitleEl.textContent = '- 基础模式';
            } else if (mode === 'advanced') {
                modeTitleEl.textContent = '- 进阶模式';
            } else {
                modeTitleEl.textContent = '- 字根表';
            }
        }
    }

    // 显示编码提示（首次出现时）
    function showFirstCodeHint() {
        const state = StateManager.getState();
        const codeHint = document.getElementById('code-hint');
        const charHintEl = document.getElementById('char-hint');
        const hintsContainer = document.getElementById('hints-container');
        
        if (hintsContainer) {
            hintsContainer.style.minHeight = '0';
        }
        
        if (charHintEl) {
            if (state.practiceMode === 'finger') {
                charHintEl.textContent = '请输入该码元的编码 (按空格显示提示)';
            } else {
                charHintEl.textContent = '请输入该字根的编码 (按空格显示提示)';
            }
        }
        
        if (state.zigenGroupOccurrences[state.currentChar] === 1) {
            let hintContent;
            if (state.practiceMode === 'finger') {
                hintContent = MAYUAN[state.currentChar].code;
            } else {
                hintContent = ZIGEN_DATA[state.currentChar].code;
            }
            
            if (codeHint) {
                codeHint.textContent = `编码提示：${hintContent}`;
                codeHint.classList.add('show');
                
                setTimeout(() => {
                    codeHint.classList.remove('show');
                }, 1000);
            }
        } else {
            if (codeHint) {
                codeHint.classList.remove('show');
            }
        }
    }

    // 更新输入框样式
    function updateInputStyles(inputElements, isCorrect) {
        if (isCorrect) {
            inputElements.forEach(input => input.classList.add('correct'));
            
            setTimeout(() => {
                inputElements.forEach(input => input.classList.remove('correct'));
            }, 150);
        } else {
            inputElements.forEach(input => input.classList.add('incorrect'));
            
            setTimeout(() => {
                inputElements.forEach(input => {
                    input.classList.remove('incorrect');
                    input.value = '';
                });
                
                // 聚焦第一个输入框
                inputElements[0].focus();
            }, 300);
        }
    }

    // 更新进度条
    function updateProgressBar() {
        const state = StateManager.getState();
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('progress-text');
        
        if (progressBar) {
            progressBar.style.width = state.progress + '%';
        }
        
        if (progressText) {
            progressText.textContent = `${state.learnedCount}/${state.totalCount} (${state.progress}%)`;
        }
    }

    // 显示完成学习的恭喜信息
    function showCompletionMessage() {
        const completionMessage = document.getElementById('completion-message');
        if (completionMessage) {
            completionMessage.classList.remove('hidden');
        }
    }

    // 隐藏完成学习的恭喜信息
    function hideCompletionMessage() {
        const completionMessage = document.getElementById('completion-message');
        if (completionMessage) {
            completionMessage.classList.add('hidden');
        }
    }

    return {
        updateStats: updateStats,
        showCodeHint: showCodeHint,
        updateCurrentCharDisplay: updateCurrentCharDisplay,
        updateInputArea: updateInputArea,
        switchTabUI: switchTabUI,
        showFirstCodeHint: showFirstCodeHint,
        updateInputStyles: updateInputStyles,
        updateProgressBar: updateProgressBar,
        showCompletionMessage: showCompletionMessage,
        hideCompletionMessage: hideCompletionMessage
    };
})();
