import { useEffect, useRef, useState, useCallback } from "react";

export default function ZigenTableStandalone() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("800px");

  const handleIframeResize = useCallback((event: MessageEvent) => {
    if (event.data.type === "zigen-table-height") {
      setIframeHeight(`${event.data.height}px`);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", handleIframeResize);
    return () => window.removeEventListener("message", handleIframeResize);
  }, [handleIframeResize]);

  return (
    <section id="zigen" className="py-24 md:py-32 bg-background">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            麓鸣·字根表
          </h2>
        </div>

        <div className="w-full mx-auto px-2">
          <div className="ink-card p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                作者：Rayalizing
              </div>
            </div>

            <iframe
              ref={iframeRef}
              src="/zigen-table.html"
              width="100%"
              height={iframeHeight}
              style={{
                border: "none",
                background: "transparent",
              }}
              title="字根表"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16">
          <div className="ink-card p-6 md:p-8">
            <h3 className="text-xl font-serif font-semibold mb-6">
              术语速查
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">字根</strong>
                <p className="text-muted-foreground">把字按书写结构拆出来的部件</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">码元</strong>
                <p className="text-muted-foreground">编码里允许出现的基本符号（a-z、数字、符号等）</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">双编码</strong>
                <p className="text-muted-foreground">一个字根对应两位字母（大码 + 小码）</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">简码</strong>
                <p className="text-muted-foreground">用更短的码直接打出的高频字/词</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">顶功 / 顶屏</strong>
                <p className="text-muted-foreground">继续输入下一键时，候选框当前选中项会自动上屏</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-1">并击</strong>
                <p className="text-muted-foreground">一次同时按下多个键，输出一个或多个码元</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
