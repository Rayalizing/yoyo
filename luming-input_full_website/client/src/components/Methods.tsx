/**
 * Methods 两套功法介绍组件
 * 设计风格：武侠水墨 - 北冥与无相功法展示
 */

import { motion } from "framer-motion";

export default function Methods() {
  return (
    <section id="methods" className="py-24 md:py-32 bg-background">
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
            字/词打法「两套功法」
          </h2>
          <p className="text-lg text-muted-foreground font-serif italic">
            充分发挥顶功特性
          </p>
        </motion.div>

        {/* 集合分组说明 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <div className="ink-card p-6 md:p-8">
            <h3 className="text-xl font-serif font-semibold mb-4">集合分组和定义</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              不同的按法会进入不同的"输入通道"，用 <code className="px-1 bg-secondary">A/a/B/b/C/c</code> 来区分它们。
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-background border border-border">
                <strong>大写</strong>：不按 Space
              </div>
              <div className="p-3 bg-background border border-border">
                <strong>小写</strong>：带 Space
              </div>
              <div className="p-3 bg-background border border-border">
                <strong>A/a</strong>：双手并击
              </div>
              <div className="p-3 bg-background border border-border">
                <strong>B/b</strong>：左手单手并击
              </div>
              <div className="p-3 bg-background border border-border">
                <strong>C/c</strong>：右手单手并击
              </div>
              <div className="p-3 bg-background border border-border">
                双手一击输出<strong>两码</strong>，单手一击输出<strong>一码</strong>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 两套功法 */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 北冥 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="ink-card p-6 md:p-8 h-full">
              {/* 功法图 */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/images/beiming-card.png"
                  alt="北冥神功"
                  className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full opacity-90"
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                  北冥
                </h3>
                <p className="text-muted-foreground font-serif italic">
                  单字派 · 并击主单
                </p>
              </div>

              <blockquote className="border-l-4 border-foreground/30 pl-4 mb-6 text-sm text-muted-foreground italic">
                段誉所赠，逍遥派绝学。逍遥武功，以积蓄内力为第一要义；内力既厚，犹之北冥，天下武功无不为我所用。
              </blockquote>

              <div className="space-y-4 text-sm">
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">打单字</strong>
                  <p className="text-muted-foreground">
                    <code className="px-1 bg-secondary">A</code> 为第一击，一击若没出首选，则补一个 <code className="px-1 bg-secondary">b/c</code>，再之后的下一键触发顶屏上屏。
                  </p>
                </div>
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">打词</strong>
                  <p className="text-muted-foreground">
                    如果 <code className="px-1 bg-secondary">a</code> 作为第一击，则只会打词。词为四码定长模式。
                  </p>
                </div>
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">一简字/词</strong>
                  <p className="text-muted-foreground">
                    <code className="px-1 bg-secondary">B/C</code> 直出一简字/词，按下后会立即上屏。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 无相 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="ink-card p-6 md:p-8 h-full">
              {/* 功法图 */}
              <div className="mb-6 flex justify-center">
                <img
                  src="/images/wuxiang-card.png"
                  alt="小无相功"
                  className="w-40 h-40 md:w-48 md:h-48 object-cover rounded-full opacity-90"
                />
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                  无相
                </h3>
                <p className="text-muted-foreground font-serif italic">
                  主词派 · 并击主词
                </p>
              </div>

              <blockquote className="border-l-4 border-foreground/30 pl-4 mb-6 text-sm text-muted-foreground italic">
                逍遥李秋水亲授。适配兼容，顺逆自如，不着形相，精微渊深。并击连击可无缝转换，既是「过渡体」，也是「究极体」。
              </blockquote>

              <div className="space-y-4 text-sm">
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">打词</strong>
                  <p className="text-muted-foreground">
                    <code className="px-1 bg-secondary">A</code> 为第一击，一击若没出首选，可补 <code className="px-1 bg-secondary">B/C</code> 或 <code className="px-1 bg-secondary">A</code>；每输入满四码，下一键触发顶屏。
                  </p>
                </div>
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">打单字</strong>
                  <p className="text-muted-foreground">
                    前两码可选 <code className="px-1 bg-secondary">B/C</code> 连击或 <code className="px-1 bg-secondary">a</code> 直出；第三码用 <code className="px-1 bg-secondary">b/c</code> 补。
                  </p>
                </div>
                <div className="p-4 bg-background border border-border">
                  <strong className="block mb-2">一简字/词</strong>
                  <p className="text-muted-foreground">
                    第一击为 <code className="px-1 bg-secondary">b/c</code> 直出一简字词。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 示例说明 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="ink-card p-6 md:p-8">
            <h3 className="text-xl font-serif font-semibold mb-6 text-center">
              打字示例：以「鸣」字为例
            </h3>
            <div className="p-4 bg-foreground/5 border-l-4 border-foreground mb-6">
              <p className="text-sm">
                已知：<code className="px-2 py-1 bg-background border">鸣 = bXn</code>，且"鸣"为左右结构 <code className="px-1">⿰</code>（口 + 鸟），所以第三码走通道 <code className="px-1">"b"</code>。
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 border border-border">
                <h4 className="font-semibold mb-3">北冥打法</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>用 <code className="px-1 bg-secondary">A</code> 输出前两码 <code className="px-1">bX</code></li>
                  <li>若首选是"鸣"：继续输入下一键，触发顶屏</li>
                  <li>若首选不是：用 <code className="px-1 bg-secondary">"b"</code> 补第三码 <code className="px-1">n</code></li>
                </ol>
              </div>
              <div className="p-4 border border-border">
                <h4 className="font-semibold mb-3">无相打法</h4>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>方案1：<code className="px-1 bg-secondary">B或C</code> 出 <code className="px-1">b</code> → <code className="px-1 bg-secondary">B或C</code> 出 <code className="px-1">X</code> → <code className="px-1 bg-secondary">b</code> 出 <code className="px-1">n</code></li>
                  <li>方案2：<code className="px-1 bg-secondary">a</code> 先出 <code className="px-1">bX</code> → <code className="px-1 bg-secondary">b</code> 补 <code className="px-1">n</code></li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
