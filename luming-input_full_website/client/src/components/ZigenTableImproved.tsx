/**
 * 字根表组件 - 美化版本
 * 设计风格：武侠水墨 - 与主网站风格融合
 * 
 * 特性：
 * - 水墨色系配色
 * - 键盘布局展示
 * - 字根详情弹窗
 * - 搜索过滤功能
 * - 响应式设计
 */

import { useState, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ZigenData {
  [key: string]: string;
}

interface GroupingData {
  [key: string]: string;
}

interface KeyData {
  key: string;
  chars: Array<{
    main: string;
    code: string;
    subs: string[];
  }>;
}

const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
];

export default function ZigenTableImproved() {
  const [zigenData, setZigenData] = useState<ZigenData>({});
  const [groupingData, setGroupingData] = useState<GroupingData>({});
  const [keyData, setKeyData] = useState<Map<string, KeyData>>(new Map());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKey, setSelectedKey] = useState<KeyData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/mapping.yaml');
        const text = await response.text();
        
        // 简单的 YAML 解析（仅用于 mapping 部分）
        const lines = text.split('\n');
        const mapping: ZigenData = {};
        const grouping: GroupingData = {};
        
        let inMapping = false;
        let inGrouping = false;
        
        for (const line of lines) {
          if (line.trim() === 'mapping:') {
            inMapping = true;
            inGrouping = false;
            continue;
          }
          if (line.trim() === 'grouping:') {
            inMapping = false;
            inGrouping = true;
            continue;
          }
          
          if (inMapping && line.startsWith('  ') && line.includes(':')) {
            const match = line.match(/^\s+(.+?):\s*['\"]?(.+?)['\"]?\s*$/);
            if (match) {
              mapping[match[1]] = match[2];
            }
          }
          
          if (inGrouping && line.startsWith('  ') && line.includes(':')) {
            const match = line.match(/^\s+(.+?):\s*(.+?)\s*$/);
            if (match) {
              grouping[match[1]] = match[2];
            }
          }
        }
        
        setZigenData(mapping);
        setGroupingData(grouping);
        buildKeyData(mapping, grouping);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load zigen data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // 构建键位数据
  const buildKeyData = (mapping: ZigenData, grouping: GroupingData) => {
    const mainToSubs = new Map<string, string[]>();
    
    // 建立主字根到从属字根的映射
    for (const [subChar, mainChar] of Object.entries(grouping)) {
      if (!mainToSubs.has(mainChar)) {
        mainToSubs.set(mainChar, []);
      }
      mainToSubs.get(mainChar)!.push(subChar);
    }
    
    // 按大码分组
    const newKeyData = new Map<string, KeyData>();
    
    for (const [char, code] of Object.entries(mapping)) {
      if (code.length >= 1) {
        const bigCode = code[0];
        const smallCode = code.substring(1);
        const subs = mainToSubs.get(char) || [];
        
        if (!newKeyData.has(bigCode)) {
          newKeyData.set(bigCode, { key: bigCode, chars: [] });
        }
        
        newKeyData.get(bigCode)!.chars.push({
          main: char,
          code: smallCode,
          subs: subs,
        });
      }
    }
    
    setKeyData(newKeyData);
  };

  // 过滤键位
  const getFilteredKeyData = () => {
    if (!searchTerm) return keyData;
    
    const filtered = new Map<string, KeyData>();
    
    const entries = Array.from(keyData.entries());
    for (const [key, data] of entries) {
      const matchedChars = data.chars.filter(
        (char: typeof data.chars[0]) =>
          char.main.includes(searchTerm) ||
          char.code.includes(searchTerm) ||
          char.subs.some((sub: string) => sub.includes(searchTerm))
      );
      
      if (matchedChars.length > 0) {
        filtered.set(key, { key, chars: matchedChars });
      }
    }
    
    return filtered;
  };

  const displayKeyData = getFilteredKeyData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">加载字根表中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-foreground">字根表</h2>
          <p className="text-muted-foreground">麓鸣码 1218 终版 v1.2</p>
        </div>

        {/* 搜索框 */}
        <div className="mb-8 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="搜索字根、编码或从属字根..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-2 border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-sm text-muted-foreground mt-2">
              找到 {displayKeyData.size} 个键位的匹配结果
            </p>
          )}
        </div>

        {/* 键盘布局 */}
        <div className="space-y-3">
          {Array.from(KEY_ROWS).map((row: typeof KEY_ROWS[0], rowIdx: number) => (
            <div key={rowIdx} className="flex gap-2 justify-center flex-wrap">
              {Array.from(row).map((key) => {
                const data = displayKeyData.get(key);
                const hasChars = data && data.chars.length > 0;
                
                return (
                  <button
                    key={key}
                    onClick={() => {
                      if (hasChars) {
                        setSelectedKey(data);
                        setIsDialogOpen(true);
                      }
                    }}
                    disabled={!hasChars}
                    className={`
                      relative w-20 h-20 rounded-lg border-2 transition-all duration-200
                      ${
                        hasChars
                          ? 'bg-card border-border hover:border-primary hover:shadow-lg hover:-translate-y-1 cursor-pointer'
                          : 'bg-muted border-border/50 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    {/* 键位标签 */}
                    <div className="absolute top-1 left-1 text-xs font-bold text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded">
                      {key === '<' ? '&lt;' : key === '>' ? '&gt;' : key}
                    </div>
                    
                    {/* 字根数量 */}
                    {hasChars && (
                      <div className="absolute bottom-1 right-1 text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                        {data.chars.length}
                      </div>
                    )}
                    
                    {/* 预览字根 */}
                    {hasChars && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="text-lg font-bold text-foreground truncate">
                            {data.chars[0]?.main}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {data.chars[0]?.code}
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* 图例 */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary/20 rounded border border-primary"></div>
              <span>可点击键位</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted rounded border border-border/50"></div>
              <span>无字根键位</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary font-semibold">大字</span>
              <span>主字根</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs">小字</span>
              <span>从属字根</span>
            </div>
          </div>
        </div>
      </div>

      {/* 详情弹窗 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              键位 <span className="text-primary font-mono">{selectedKey?.key}</span> 的字根
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedKey?.chars.map((char: typeof selectedKey.chars[0], idx: number) => (
              <div
                key={idx}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-2xl font-bold text-foreground mb-2">
                      {char.main}
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">编码：</span>
                        <span className="font-mono text-primary font-semibold">
                          {selectedKey.key}
                          {char.code}
                        </span>
                      </div>
                      {char.subs.length > 0 && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">从属字根：</span>
                          <span className="ml-2">
                            {char.subs.map((sub: string, i: number) => (
                              <span key={i} className="inline-block mr-2 text-base">
                                {sub}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
