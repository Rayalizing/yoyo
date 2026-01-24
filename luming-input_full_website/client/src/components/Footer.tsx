/**
 * Footer 页脚组件
 * 设计风格：武侠水墨 - 简约优雅的页脚
 */

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            麓鸣
          </h2>
          <p className="text-background/70 mb-8 max-w-xl mx-auto">
            一款兼顾极简规则和极致性能的纯形顶功并击输入法
          </p>

          {/* 分隔线 */}
          <div className="w-24 h-px bg-background/30 mx-auto mb-8" />

          {/* 相关链接 */}
          {/* <p className="text-background/70 mb-8">相关链接：</p> */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
            <a
              href="https://www.tiger-code.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/70 hover:text-background transition-colors"
            >
              虎码输入法
            </a>
            <a
              href="https://shurufa.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/70 hover:text-background transition-colors"
            >
              宇浩输入法
            </a>
            <a
              href="https://ding.tansongchen.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-background/70 hover:text-background transition-colors"
            >
              顶功·集萃
            </a>
          </div>

          {/* 版权信息 */}
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} 麓鸣输入法 · 作者：Rayalizing
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
