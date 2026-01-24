/**
 * Features 优势特性展示组件
 * 设计风格：武侠水墨 - 卡片式特性展示
 */

import { motion } from "framer-motion";
import { Zap, Target, Brain, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "极低击长",
    description: "单字最高三码，94.3% 的字只需一击即可打出。一击顶功，无需空格确认。",
    highlight: "一击字占比 94.3%",
  },
  {
    icon: Target,
    title: "极低重码",
    description: "前 6638 字全码无重！简码和全码都是零重码。前 60000 高频词加权重码率仅 0.25%。",
    highlight: "6638 字零重码",
  },
  {
    icon: Brain,
    title: "思维负担低",
    description: "指法更简单，单手最多同时按两个键。大字根拆分直观，打字规则简单明了。",
    highlight: "规则极简",
  },
  {
    icon: Sparkles,
    title: "独特爽点",
    description: "100% 的确定感，单字零重，词重极低。30 个一键上屏字/词，只按一个键即可上屏。",
    highlight: "确定感满满",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export default function Features() {
  return (
    <section id="intro" className="py-24 md:py-32 bg-background">
      <div className="container">
        {/* 章节标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="ink-title text-3xl sm:text-4xl md:text-5xl mb-4">
            「麓鸣」的优势
          </h2>
          <p className="text-lg text-muted-foreground font-serif italic">
            追求并击的上限
          </p>
        </motion.div>

        {/* 分隔线 */}
        <div className="flex justify-center mb-16">
          <img
            src="/images/section-divider.png"
            alt=""
            className="w-64 h-auto opacity-40"
          />
        </div>

        {/* 特性卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="ink-card p-6 md:p-8 group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border border-foreground/20 group-hover:bg-foreground group-hover:text-background transition-all duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-serif font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="inline-block px-3 py-1 text-sm border border-foreground/30 bg-background/50">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 数据统计 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { value: "6638", label: "零重码字数" },
            { value: "94.3%", label: "一击字占比" },
            { value: "2032", label: "一击即出字" },
            { value: "0.25%", label: "词重码率" },
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
