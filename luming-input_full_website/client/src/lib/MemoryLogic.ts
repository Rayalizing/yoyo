/**
 * 字根练习记忆逻辑模块
 * 基于间隔重复的记忆算法
 */

export interface ProgressItem {
  index: number;
  count: number;
}

export interface ProgressData {
  progressByMode: Record<string, ProgressItem[]>;
  points: number;
  isInitComplete: boolean;
  isFirstTime: boolean;
}

export class MemoryLogic {
  private progressByMode: Record<string, ProgressItem[]> = {};
  private currentMode: string | null = null;
  private points: number = 0;
  private isInitComplete: boolean = false;
  private isFirstTime: boolean = true;
  private showPrompt: boolean = true;
  private showNextPrompt: boolean = true;
  private baseZigenCount: number = 241;
  private advancedZigenCount: number = 462;

  constructor() {
    this.loadProgress();
  }

  setCurrentMode(mode: string) {
    this.currentMode = mode;
  }

  getCurrentProgressList(): ProgressItem[] {
    if (!this.currentMode) return [];
    return this.progressByMode[this.currentMode] || [];
  }

  setCurrentProgressList(progressList: ProgressItem[]) {
    if (!this.currentMode) return;
    this.progressByMode[this.currentMode] = progressList;
  }

  initProgressList(count: number = this.baseZigenCount) {
    if (!this.currentMode) return;
    this.progressByMode[this.currentMode] = Array.from({ length: count }, (_, index) => ({
      index: index,
      count: -1 // -1表示未开始练习
    }));
    this.isInitComplete = true;
    this.isFirstTime = false;
    this.saveProgress();
  }

  loadLocalProgress(zigenList: any[]) {
    if (!this.currentMode) return;
    if (!this.progressByMode[this.currentMode]) {
      this.initProgressList(zigenList.length);
    }
  }

  saveProgress() {
    const progressData: ProgressData = {
      progressByMode: this.progressByMode,
      points: this.points,
      isInitComplete: this.isInitComplete,
      isFirstTime: this.isFirstTime
    };
    localStorage.setItem('zigenPracticeProgress', JSON.stringify(progressData));
  }

  loadProgress() {
    if (typeof localStorage === 'undefined') return;
    const savedData = localStorage.getItem('zigenPracticeProgress');
    if (savedData) {
      try {
        const progressData: ProgressData = JSON.parse(savedData);
        this.progressByMode = progressData.progressByMode || {};
        this.points = progressData.points || 0;
        this.isInitComplete = progressData.isInitComplete || false;
        this.isFirstTime = progressData.isFirstTime || true;
      } catch (error) {
        console.error('加载本地进度失败:', error);
      }
    }
  }

  setShowNextPrompt(show: boolean) {
    this.showNextPrompt = show;
  }

  setShowPrompt(show: boolean) {
    this.showPrompt = show;
  }

  setProgress(progressList: ProgressItem[]) {
    this.setCurrentProgressList(progressList);
  }

  getNextInterval(correctCount: number, isBaseMode: boolean = true): number {
    const progressList = this.getCurrentProgressList();
    if (isBaseMode) {
      // 基础模式的间隔映射表
      if (correctCount >= 8) return progressList.length - 1;
      const intervals: Record<number, number> = { 0: 2, 1: 4, 2: 8, 3: 12, 4: 20, 5: 30, 6: 60, 7: 100 };
      return intervals[correctCount] || 2;
    } else {
      // 高级模式的间隔映射表
      if (correctCount >= 7) return progressList.length - 1;
      const intervals: Record<number, number> = { 0: 2, 1: 4, 2: 8, 3: 12, 4: 20, 5: 60, 6: 100 };
      return intervals[correctCount] || 2;
    }
  }

  nextRoot(isBaseMode: boolean = true): ProgressItem[] {
    const progressList = this.getCurrentProgressList();
    if (progressList.length === 0) return progressList;

    const currentCount = progressList[0].count + 1;
    const nextPosition = this.getNextInterval(currentCount, isBaseMode);
    return this.rearrangeProgressList(nextPosition);
  }

  rearrangeProgressList(nextPosition: number): ProgressItem[] {
    let progressList = this.getCurrentProgressList();
    if (progressList.length === 0 || nextPosition < 0) return progressList;
    
    const newProgressList = [...progressList];
    const firstItem = newProgressList.shift();
    if (!firstItem) return progressList;

    firstItem.count += 1;
    const actualPosition = Math.min(nextPosition, newProgressList.length);
    newProgressList.splice(actualPosition, 0, firstItem);

    this.setCurrentProgressList(newProgressList);
    this.saveProgress();
    return newProgressList;
  }

  handleCodingError(): ProgressItem[] {
    let progressList = this.getCurrentProgressList();
    if (progressList.length === 0) return progressList;

    const newProgressList = [...progressList];
    newProgressList[0] = { ...newProgressList[0], count: -1 };

    this.setCurrentProgressList(newProgressList);
    this.saveProgress();
    return newProgressList;
  }

  getCompletedTotal(): number {
    const progressList = this.getCurrentProgressList();
    if (progressList.length === 0) return -1;

    let maxIndex = -1;
    for (const item of progressList) {
      if (item.count !== -1 && item.index > maxIndex) {
        maxIndex = item.index;
      }
    }
    return maxIndex + 1;
  }

  reset() {
    this.progressByMode = {};
    this.points = 0;
    this.isFirstTime = true;
    this.showPrompt = true;
    this.showNextPrompt = true;
    localStorage.removeItem('zigenPracticeProgress');
  }

  getProgressList(): ProgressItem[] {
    return this.getCurrentProgressList();
  }

  getPoints(): number {
    return this.points;
  }

  isInitialized(): boolean {
    return this.isInitComplete;
  }

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
}

export const memoryLogic = new MemoryLogic();
