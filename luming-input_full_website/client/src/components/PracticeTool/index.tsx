import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Zap, BarChart3, RefreshCw, Info } from 'lucide-react';
import { PracticeMode, PracticeState } from './types';
import { memoryLogic, ProgressItem } from '@/lib/MemoryLogic';
import { ZIGEN_DATA, ZIGEN_GROUPS, MAYUAN, getCharImageUrl } from './data';
import './styles.css';

export default function PracticeTool() {
  const [state, setState] = useState<PracticeState>({
    practiceMode: 'finger',
    currentChar: null,
    streak: 0,
    maxStreak: 0,
    total: 0,
    correct: 0,
    startTime: null,
    learnedCount: 0,
    totalCount: 0,
  });

  const [isComposing, setIsComposing] = useState(false);

  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);

  // 初始化练习
  const initPractice = useCallback((mode: PracticeMode) => {
    memoryLogic.setCurrentMode(mode);
    
    let practiceKeys: string[] = [];
    if (mode === 'finger') practiceKeys = Object.keys(MAYUAN);
    else if (mode === 'base') practiceKeys = Object.keys(ZIGEN_GROUPS);
    else practiceKeys = Object.keys(ZIGEN_DATA);

    // 如果没有进度，初始化
    if (!memoryLogic.isInitialized() || memoryLogic.getCurrentProgressList().length === 0) {
      memoryLogic.initProgressList(practiceKeys.length);
    }

    const currentProgress = memoryLogic.getCurrentProgressList();
    setProgressList(currentProgress);
    
    const learned = memoryLogic.getCompletedTotal();
    const firstCharKey = mode === 'finger' ? Object.keys(MAYUAN)[currentProgress[0].index] : 
                         mode === 'base' ? Object.keys(ZIGEN_DATA)[currentProgress[0].index] : 
                         Object.keys(ZIGEN_DATA)[currentProgress[0].index];

    setState(prev => ({
      ...prev,
      practiceMode: mode,
      currentChar: firstCharKey,
      totalCount: practiceKeys.length,
      learnedCount: learned === -1 ? 0 : learned,
      startTime: Date.now(),
      streak: 0, // 切换模式重置连击
    }));
    
    setInput1('');
    setInput2('');
    setShowHint(false);
    setStatus('idle');
    // 移除自动聚焦，避免页面自动滚动到练习区域
  }, []);

  useEffect(() => {
    initPractice('finger');
  }, [initPractice]);

  // 校验逻辑 - 完全保留原版逻辑细节
  const checkAnswer = (v1: string, v2: string) => {
    if (!state.currentChar) return;
    
    const userCode = v1 + v2;
    let isMatch = false;

    if (state.practiceMode === 'finger') {
      const target = MAYUAN[state.currentChar];
      const targetName = target.name;
      
      // 辅助函数：检查两个字符串是否包含相同的字符（顺序不敏感）
      const isSameChars = (s1: string, s2: string) => {
        if (s1.length !== s2.length) return false;
        return s1.split('').sort().join('') === s2.split('').sort().join('');
      };

      // 指法练习：使用 name 字段判定，且顺序不敏感
      isMatch = isSameChars(userCode, targetName);
    } else {
      // 字根练习：使用 code 字段判定，区分大小写
      const target = ZIGEN_DATA[state.currentChar];
      const codes = Array.isArray(target.code) ? target.code : [target.code];
      isMatch = codes.some(c => c === userCode);
    }

    if (isMatch) {
      setStatus('correct');
      setTimeout(() => {
        // 调用原版 memoryLogic 算法
        const newList = memoryLogic.nextRoot(state.practiceMode === 'base');
        setProgressList(newList);

        const keys = state.practiceMode === 'finger' ? Object.keys(MAYUAN) : Object.keys(ZIGEN_DATA);
        const nextCharKey = keys[newList[0].index];
        const learned = memoryLogic.getCompletedTotal();

        setState(prev => ({
          ...prev,
          streak: prev.streak + 1,
          maxStreak: Math.max(prev.maxStreak, prev.streak + 1),
          total: prev.total + 1,
          correct: prev.correct + 1,
          currentChar: nextCharKey,
          learnedCount: learned === -1 ? 0 : learned,
        }));

        setInput1('');
        setInput2('');
        setStatus('idle');
        setShowHint(false);
        input1Ref.current?.focus();
      }, 200);
    } else {
      // 判定错误逻辑
      const expectedLen = state.practiceMode === 'finger' ? (MAYUAN[state.currentChar]?.name.length || 1) : 2;
      if (userCode.length >= expectedLen) {
        setStatus('incorrect');
        setState(prev => ({ ...prev, streak: 0, total: prev.total + 1 }));
        
        // 调用原版错误处理逻辑
        const newList = memoryLogic.handleCodingError();
        setProgressList(newList);

        setTimeout(() => {
          setInput1('');
          setInput2('');
          setStatus('idle');
          input1Ref.current?.focus();
        }, 400);
      }
    }
  };

  // 处理输入法组合结束事件
  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const val = target.value.trim();
    
    if (val === '') return;
    
    if (state.practiceMode === 'finger') {
      // 指法练习模式：直接检查答案
      setInput1(val);
      checkAnswer(val, '');
    } else {
      // 其他模式：两个输入框
      if (target.id === 'input1') {
        // 在第一个输入框完成组合
        if (val.length >= 2) {
          // 输入了完整的两个字符，直接检查
          const char1 = val[0];
          const char2 = val[1];
          setInput1(char1);
          setInput2(char2);
          checkAnswer(char1, char2);
        } else if (val.length === 1) {
          // 只输入了一个字符，聚焦到第二个输入框
          setInput1(val);
          input2Ref.current?.focus();
        }
      } else if (target.id === 'input2') {
        // 在第二个输入框完成组合
        setInput2(val);
        if (input1.trim() !== '') {
          // 如果第一个输入框也有内容，检查答案
          checkAnswer(input1, val);
        }
      }
    }
  };

  const handleInput1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (isComposing) {
      // 输入法组合过程中，让浏览器正常处理输入
      setInput1(val);
      return;
    }
    
    // 非组合状态下的正常处理
    const trimmedVal = val.trim();
    if (trimmedVal.length > 1 && state.practiceMode !== 'finger') {
      setInput1(trimmedVal[0]);
      setInput2(trimmedVal[1]);
      checkAnswer(trimmedVal[0], trimmedVal[1]);
      return;
    }
    setInput1(trimmedVal);
    if (state.practiceMode === 'finger') {
      const targetName = MAYUAN[state.currentChar!]?.name || "";
      if (trimmedVal.length >= targetName.length) checkAnswer(trimmedVal, '');
    } else {
      if (trimmedVal.length === 1) input2Ref.current?.focus();
    }
  };

  const handleInput2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (isComposing) {
      // 输入法组合过程中，让浏览器正常处理输入
      setInput2(val);
      return;
    }
    
    // 非组合状态下的正常处理
    const trimmedVal = val.trim();
    setInput2(trimmedVal);
    if (trimmedVal.length === 1) checkAnswer(input1, trimmedVal);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ') {
      e.preventDefault();
      setShowHint(true);
    } else if (e.key === 'Backspace' && (e.target as HTMLInputElement).id === 'input2' && input2 === '') {
      input1Ref.current?.focus();
    }
  };

  const accuracy = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
  const progress = state.totalCount > 0 ? Math.round((state.learnedCount / state.totalCount) * 100) : 0;

  return (
    <div className="practice-container max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-left">
          <h2 className="ink-title text-5xl mb-2">麓鸣·指法字根</h2>
          <p className="text-muted-foreground font-serif italic">“工欲善其事，必先利其器”</p>
        </div>
        <Tabs value={state.practiceMode} onValueChange={(v) => initPractice(v as PracticeMode)} className="w-full md:w-auto">
          <TabsList className="bg-muted/30 border border-border/50">
            <TabsTrigger value="finger" className="px-6">指法</TabsTrigger>
            <TabsTrigger value="base" className="px-6">基础</TabsTrigger>
            <TabsTrigger value="advanced" className="px-6">进阶</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatItem icon={<Zap className="streak-fire text-cinnabar-red" />} label="当前连击" value={state.streak} />
        <StatItem icon={<Target className="text-ink-medium" />} label="正确率" value={`${accuracy}%`} />
        <StatItem icon={<BarChart3 className="text-ink-medium" />} label="已掌握" value={state.learnedCount} />
        <StatItem icon={<Trophy className="text-cinnabar-red/80" />} label="最高纪录" value={state.maxStreak} />
      </div>

      <Card className="ink-card ancient-border bg-paper-white/50 backdrop-blur-md shadow-2xl">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2 text-xs font-serif tracking-widest text-ink-medium">
            <span>学习进度</span>
            <span>{state.learnedCount} / {state.totalCount}</span>
          </div>
          <Progress value={progress} className="ink-progress" />
        </div>

        <div className="char-display-box">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentChar}
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(3px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.1, filter: 'blur(3px)' }}
              transition={{ duration: 0.05 }}
              className="flex flex-col items-center"
            >
              {state.practiceMode === 'finger' ? (
                <div className="text-9xl font-serif text-ink-black mb-8">{state.currentChar}</div>
              ) : (
                state.currentChar && (
                  <>
                    <img src={getCharImageUrl(state.currentChar)} className="main-char-img mb-8" alt="main" />
                    <div className="sub-chars-container">
                      {ZIGEN_GROUPS[state.currentChar]?.map((sub, i) => (
                        <img key={i} src={getCharImageUrl(sub)} className="sub-char-img" alt="sub" />
                      ))}
                    </div>
                  </>
                )
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-16 flex flex-col items-center w-full">
            <div className="flex gap-4 mb-6">
              <input
                id="input1"
                ref={input1Ref}
                type="text"
                value={input1}
                onChange={handleInput1}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={(e) => {
                  setIsComposing(false);
                  // 在 composition 结束时处理输入
                  handleCompositionEnd(e);
                }}
                className={`w-16 h-20 text-4xl text-center ink-input ${status === 'correct' ? 'correct' : status === 'incorrect' ? 'incorrect' : ''}`}
                // 移除 maxLength 限制，让输入法能够正常工作
                autoComplete="off"

              />
              {state.practiceMode !== 'finger' && (
                <input
                  id="input2"
                  ref={input2Ref}
                  type="text"
                  value={input2}
                  onChange={handleInput2}
                  onKeyDown={handleKeyDown}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={(e) => {
                    setIsComposing(false);
                    // 在 composition 结束时处理输入
                    handleCompositionEnd(e);
                  }}
                  className={`w-16 h-20 text-4xl text-center ink-input ${status === 'correct' ? 'correct' : status === 'incorrect' ? 'incorrect' : ''}`}
                  autoComplete="off"
                />
              )}
            </div>
            
            <div className="h-8 flex items-center justify-center">
              <AnimatePresence>
                {showHint && state.currentChar && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-cinnabar-red font-serif font-bold"
                  >
                    <Info className="w-4 h-4" />
                    <span>编码：{
                      state.practiceMode === 'finger' 
                      ? (Array.isArray(MAYUAN[state.currentChar].code)
                         ? `左手：${MAYUAN[state.currentChar].code[0]}，右手：${MAYUAN[state.currentChar].code[1]}`
                         : MAYUAN[state.currentChar].code)
                      : (Array.isArray(ZIGEN_DATA[state.currentChar].code) 
                         ? (ZIGEN_DATA[state.currentChar].code as string[]).join(' / ')
                         : ZIGEN_DATA[state.currentChar].code)
                    }</span>
                  </motion.div>
                )}
                {!showHint && (
                  <span className="text-xs text-ink-light font-serif tracking-tighter">按 [空格] 开启提示 · 按 [回车] 提交</span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 flex justify-between items-center">
          <div className="text-[10px] text-ink-light font-serif">
            {state.practiceMode === 'finger' ? "码元练习：熟悉基础按键分布" : 
             state.practiceMode === 'base' ? "基础练习：掌握核心字根编码" : "进阶练习：攻克所有生僻字根"}
          </div>
          <button 
            onClick={() => {
              memoryLogic.reset();
              initPractice(state.practiceMode);
            }}
            className="flex items-center gap-2 text-xs text-ink-medium hover:text-ink-black transition-colors font-serif"
          >
            <RefreshCw className="w-3 h-3" /> 重置进度
          </button>
        </div>
      </Card>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-paper-cream/30 border border-border/20">
      <div className="mb-1">{icon}</div>
      <div className="text-3xl font-serif font-bold text-ink-black">{value}</div>
      <div className="text-[10px] uppercase tracking-widest text-ink-light mt-1">{label}</div>
    </div>
  );
}
