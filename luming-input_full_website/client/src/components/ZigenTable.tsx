/**
 * ZigenTable 字根表展示组件
 * 设计风格：武侠水墨 - 字根表图片展示
 */

import { motion } from "framer-motion";
import { Download, ZoomIn } from "lucide-react";
import { useState } from "react";

export default function ZigenTable() {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <section id="zigen" className="py-24 md:py-32 bg-background">
      <div className="container">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            字根表
          </h2>
        </motion.div>

        {/* 字根表图片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="ink-card p-4 md:p-6">
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                作者：Rayalizing
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-secondary transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                  {isZoomed ? "缩小" : "放大"}
                </button>
                <a
                  href="/images/zigen-table.pdf"
                  download="麓鸣字根表.pdf"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-border hover:bg-secondary transition-colors"
                >
                  <Download className="w-4 h-4" />
                  下载 PDF
                </a>
              </div>
            </div>

            {/* 图片容器 */}
            <div
              className={`overflow-auto transition-all duration-300 ${
                isZoomed ? "max-h-none" : "max-h-[600px]"
              }`}
            >
              <img
                src="/images/zigen-table.png"
                alt="麓鸣字根表"
                className={`w-full h-auto transition-transform duration-300 ${
                  isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>
          </div>
        </motion.div>

        {/* 术语速查 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-16"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
