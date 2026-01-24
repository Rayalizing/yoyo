/**
 * Fingering 折梅指法介绍组件
 * 设计风格：武侠水墨 - 指法系统展示
 */

import { motion } from "framer-motion";

export default function Fingering() {
  return (
    <section id="fingering" className="py-24 md:py-32 bg-secondary/30">
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
            通用指法「折梅」
          </h2>
          <p className="text-lg text-muted-foreground font-serif italic">
            平移 & 镜像
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* 功法图 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-12"
          >
            <img
              src="/images/liumai-card.png"
              alt="折梅"
              className="w-48 h-48 md:w-64 md:h-64 object-cover opacity-90"
            />
          </motion.div>

          {/* 核心说明 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="ink-card p-6 md:p-8 mb-8"
          >
            <blockquote className="border-l-4 border-foreground/30 pl-4 mb-6 text-lg font-serif italic">
              逍遥派核心武学，六路折梅手包罗万有，可化用天下武功招数。
            </blockquote>
            <p className="text-lg leading-relaxed mb-6">
              <strong>指法更固定：</strong>每一行码元的指法都是一致的。只需记住基于 <code className="px-2 py-1 bg-secondary border">QWERT</code> 五个键的指法，通过<strong>平移和镜像</strong>的推理即可记住其它码位。
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-2">按键更省力</strong>
                <p className="text-sm text-muted-foreground">
                  单手最多同时按两个键来确定一个码元
                </p>
              </div>
              <div className="p-4 bg-background border border-border">
                <strong className="block mb-2">指法更固定</strong>
                <p className="text-sm text-muted-foreground">
                  基于 QWERT 五键，平移和镜像推理其他码位
                </p>
              </div>
            </div>
          </motion.div>

          {/* 指法表格 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="ink-card p-6 md:p-8 overflow-x-auto"
          >
            <h3 className="text-xl font-serif font-semibold mb-6">
              码元指法对照表
            </h3>
            
            <div className="min-w-[600px]">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-foreground">
                    <th className="py-3 px-2 text-left font-semibold">行</th>
                    <th className="py-3 px-2 text-center font-semibold" colSpan={5}>左手区</th>
                    <th className="py-3 px-2 text-center font-semibold">右手区</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 第0行 */}
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 font-medium" rowSpan={2}>第0行<br/><span className="text-xs text-muted-foreground">基于12345</span></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">1</code><sub className="text-xs"> 1</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">2</code><sub className="text-xs"> 2</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">3</code><sub className="text-xs"> 3</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">4</code><sub className="text-xs"> 4</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">5</code><sub className="text-xs"> 5</sub></td>
                    <td className="py-2 px-2 text-center text-muted-foreground" rowSpan={2}>
                      把左手区<br/>指法镜像<br/>过来即可
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">0</code><sub className="text-xs"> 14</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">9</code><sub className="text-xs"> 21</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">8</code><sub className="text-xs"> 34</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">7</code><sub className="text-xs"> 42</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">6</code><sub className="text-xs"> 54</sub></td>
                  </tr>
                  
                  {/* 第一行 */}
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 font-medium" rowSpan={4}>第一行<br/><span className="text-xs text-muted-foreground">基于qwert</span></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">q</code><sub className="text-xs">  q</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">w</code><sub className="text-xs">  w</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">e</code><sub className="text-xs">  e</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">r</code><sub className="text-xs">  r</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">t</code><sub className="text-xs">  t</sub></td>
                    <td className="py-2 px-2 text-center text-muted-foreground" rowSpan={4}>
                      镜像
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">p</code><sub className="text-xs"> qr</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">o</code><sub className="text-xs"> wq</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">i</code><sub className="text-xs"> er</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">u</code><sub className="text-xs"> rw</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-accent">y</code><sub className="text-xs"> tr</sub></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">Q</code><sub className="text-xs"> q4</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">W</code><sub className="text-xs"> w4</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">E</code><sub className="text-xs"> ew</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">R</code><sub className="text-xs"> r2</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">T</code><sub className="text-xs"> t3</sub></td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">P</code><sub className="text-xs"> q3</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">O</code><sub className="text-xs"> w3</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">I</code><sub className="text-xs"> eq</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">U</code><sub className="text-xs"> r3</sub></td>
                    <td className="py-2 px-2 text-center"><code className="px-2 py-1 bg-foreground text-background">Y</code><sub className="text-xs"> t4</sub></td>
                  </tr>

                  {/* 第二行 */}
                  <tr className="border-b border-border">
                    <td className="py-3 px-2 font-medium">第二行<br/><span className="text-xs text-muted-foreground">基于asdfg</span></td>
                    <td className="py-2 px-2 text-center text-muted-foreground" colSpan={6}>
                      第一行指法下移即可
                    </td>
                  </tr>

                  {/* 第三行 */}
                  <tr>
                    <td className="py-3 px-2 font-medium">第三行<br/><span className="text-xs text-muted-foreground">基于zxcvb</span></td>
                    <td className="py-2 px-2 text-center text-muted-foreground" colSpan={6}>
                      第二行指法下移即可
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              <strong>PS：</strong>考虑到左右键位其实不太是轴对称（整体向左斜），所以不用 r4 和 t5 这一左手最好按的组合（因为镜像到右手就是 u7 和 y6，有点反人类）
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
