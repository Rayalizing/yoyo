/**
 * Hero 区域组件
 * 设计风格：武侠水墨 - 大气的首屏展示
 */

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  const scrollToIntro = () => {
    const element = document.querySelector("#intro");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景图 */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.png"
          alt=""
          className="w-full h-full object-cover object-bottom opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      {/* 内容 */}
      <div className="relative z-10 container text-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 印章标签 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: -3 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-8"
          >
            <span className="seal-badge">
              6638 字零重码
            </span>
          </motion.div>

          {/* 主标题 */}
          <h1 className="ink-title text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6">
            麓鸣输入法
          </h1>

          {/* 副标题 */}
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground/70 font-light mb-4 font-serif">
            极简规则，极致性能
          </p>

          {/* 描述 */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mb-12 leading-relaxed">
            一款纯形码、字词混打、三码定长、一击顶功的中文并击输入方案。
            <br className="hidden sm:block" />
            94.3% 的字只需一击即可打出，让打字如行云流水。
          </p>

          {/* 特性标签 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
          >
            {["纯形码", "三码定长", "一击顶功", "60码元", "双编码"].map(
              (tag, index) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm sm:text-base border border-foreground/20 bg-background/50 backdrop-blur-sm"
                >
                  {tag}
                </span>
              )
            )}
          </motion.div>

          {/* CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#intro"
              onClick={(e) => {
                e.preventDefault();
                scrollToIntro();
              }}
              className="ink-button px-8 py-3 text-lg font-medium bg-transparent relative z-10"
            >
              <span className="relative z-10">快速入门</span>
            </a>
            <a
              href="#zigen"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#zigen")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-3 text-lg font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              查看字根表 →
            </a>
          </motion.div>
        </motion.div>

        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToIntro}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-foreground/40 hover:text-foreground/60 transition-colors"
            aria-label="向下滚动"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
