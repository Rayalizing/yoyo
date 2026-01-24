/**
 * WordRules 词组编码规则组件
 * 设计风格：武侠水墨 - 词组取码规则展示
 */

import { motion } from "framer-motion";

export default function WordRules() {
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
            如何打出一个词
          </h2>
          <p className="text-lg text-muted-foreground">
            全码取码规则
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* 核心说明 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <p className="text-lg leading-relaxed mb-6">
              构成词的基本单位是单字。词的全码是<strong>四码定长</strong>，可按下面规则从组成单字的编码中取出。
            </p>

            <div className="space-y-4">
              {/* 二字词 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    二字词
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  第一个字的前两码 + 第二个字的前两码
                </p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">松鼠</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">oX</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">As</code>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-accent border">oXAs</code>
                </div>
              </div>

              {/* 三字词 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    三字词
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  第一字首码 + 第二字首码 + 第三字前两码
                </p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">动物园</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">N</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">m</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">UE</code>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-accent border">NmUE</code>
                </div>
              </div>

              {/* 四字词 */}
              <div className="p-4 border border-border bg-background">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 text-sm font-medium bg-foreground text-background">
                    四字词
                  </span>
                </div>
                <p className="text-muted-foreground mb-3">
                  第一二三四字的首码
                </p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-muted-foreground">例：</span>
                  <span className="font-serif text-lg">一心一意</span>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-secondary border">f</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">:</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">f</code>
                  <span className="text-muted-foreground">+</span>
                  <code className="px-2 py-1 bg-secondary border">S</code>
                  <span className="text-muted-foreground">=</span>
                  <code className="px-2 py-1 bg-accent border">f:fS</code>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 简码说明 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-6 md:p-8"
          >
            <h3 className="text-xl font-serif font-semibold mb-6">
              简码、顶功与选重
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              字和词都设有一简、二简，词还有三简。一简/二简输入后，不需要空格确认：下一键会触发顶屏，默认上屏首选。
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-2">一简字示例</strong>
                <p className="text-sm text-muted-foreground">
                  的 → <code className="px-2 py-1 bg-secondary">d</code>
                </p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-2">一简词示例</strong>
                <p className="text-sm text-muted-foreground">
                  知道 → <code className="px-2 py-1 bg-secondary">D</code>
                </p>
              </div>
            </div>

            <div className="p-4 bg-foreground/5 border-l-4 border-foreground">
              <p className="text-sm">
                若候选不是首选，按 <code className="px-2 py-1 bg-background border">'</code>(单引号) 或数字 2，选二选并立即上屏（一简没有设三选）。
              </p>
            </div>
          </motion.div>

          {/* 一简字词列表 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="ink-card p-6 md:p-8 mt-8"
          >
            <h3 className="text-xl font-serif font-semibold mb-6">
              一键上屏字/词（30 个）
            </h3>
            <p className="text-muted-foreground mb-6">
              只按一个键即可上屏（可能是单字，也可能是词），无需空格。
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">一简字（30 个）</h4>
                <p className="text-sm leading-loose font-mono bg-background p-4 border border-border">
                  都是在人我要会有日用 你了的一很更与三就他 也和不这中吃对还上来
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-3">一简词（30 个）</h4>
                <p className="text-sm leading-loose font-mono bg-background p-4 border border-border">
                  都是 时间 真的 数据 我们 非常 个人 有点 时候 用户 什么 就是 其他 一个 自己 很多 一些 其实 了解 使用 也是 可以 不错 这个 中国 味道 这样 还是 可能 未来
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
