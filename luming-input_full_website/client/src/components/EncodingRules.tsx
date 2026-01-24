/**
 * EncodingRules 编码规则介绍组件
 * 设计风格：武侠水墨 - 清晰的教程展示
 */

import { motion } from "framer-motion";

export default function EncodingRules() {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
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
            心法「形码基础」
          </h2>
          <p className="text-lg text-muted-foreground">
            如何打出一个字
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 核心概念 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
              如果你是第一次接触形码/并击，先记两句话：
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-foreground text-background font-bold">
                  1
                </span>
                <p className="text-lg leading-relaxed pt-1">
                  汉字会被拆成若干「<strong>字根</strong>」，每个字根都有自己的编码。
                </p>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-foreground text-background font-bold">
                  2
                </span>
                <p className="text-lg leading-relaxed pt-1">
                  麓鸣打单字只取三个字根来编码：<strong>第一根、第二根、最后一根</strong>（所以单字最高三码）。
                </p>
              </div>
            </div>
          </motion.div>

          {/* 双编码说明 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
              你需要知道的编码长相
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              每个字根是「<strong>双编码</strong>」：大码 + 小码
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-background border border-border">
                <div className="font-semibold mb-2">大码</div>
                <p className="text-sm text-muted-foreground">该字根所在的字母键位</p>
              </div>
              <div className="p-4 bg-background border border-border">
                <div className="font-semibold mb-2">小码</div>
                <p className="text-sm text-muted-foreground">该字根的第二个字母（多数可用"音托"规律联想）</p>
              </div>
            </div>
            <div className="p-4 bg-foreground/5 border-l-4 border-foreground">
              <p className="text-sm">
                <strong>示例：</strong>字根「鹿」的编码是 <code className="px-2 py-1 bg-background border">Al</code>，其中 <code className="px-1">A</code> 是大码、<code className="px-1">l</code> 是小码。
              </p>
            </div>
          </motion.div>

          {/* 取码规则 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ink-card p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-serif font-semibold mb-6">
              单字取码规则
            </h3>
            <p className="text-muted-foreground mb-6">
              为了让单字固定为三码，麓鸣按字根数量分三种情况：
            </p>
            
            <div className="space-y-6">
              {/* 单字根字 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    单字根字
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  全码就是该字根的双编码
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">鹿</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">Al</code>
                </div>
              </div>

              {/* 双字根字 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    双字根字
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  取第一根大码 + 第二根大码 + 第二根小码
                </p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">鸣</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">bXn</code>
                  <span className="text-muted-foreground">（口 <code className="px-1">bk</code>，鸟 <code className="px-1">Xn</code>）</span>
                </div>
              </div>

              {/* 多字根字 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    多字根字
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  取第一根大码 + 第二根大码 + 最后一根大码
                </p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">德</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">ge:</code>
                  <span className="text-muted-foreground">（彳 <code className="px-1">gc</code>，十 <code className="px-1">es</code>，心 <code className="px-1">:x</code>）</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
