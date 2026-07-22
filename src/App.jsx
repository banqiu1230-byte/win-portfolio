import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const filters = [
  ["all", "全部"],
  ["about", "关于"],
  ["work", "工作"],
  ["resume", "简历"],
];

const projects = [
  {
    id: "temu",
    category: "work",
    title: "TEMU 售后体验系统",
    label: "复杂业务体验",
    period: "2022 — 2024",
    cover: "/assets/posters/temu-aftersales-first-frame.webp",
    size: "wide",
    tone: "ink",
    intro: "将退款、退货、物流和异常规则，转译为用户可执行、团队可复用的售后体验框架。",
    summary: "从 0 参与复杂售后场景 UI 设计，覆盖退款、退货、物流、补偿与异常处理。负责核心页面、设计审核、规范沉淀与开发对齐，搭建稳定、可复用的售后体验框架。",
    role: "C 端售后 UI 负责人",
    outcome: "团队效率提高，并通过审核、走查和规范化机制长期保证多人协作下的体验质量。",
    stats: [["覆盖", "退款 / 退货 / 物流 / 补偿"], ["职责", "设计 / 审核 / 验收"], ["方法", "任务引导 / 状态表达"]],
    sections: [
      {
        eyebrow: "业务挑战",
        title: "难点不在页面数量，而在规则、状态和任务高度复杂。",
        body: "不同订单状态对应不同售后方式，也对应多入口、多流程、多结果页与异常分支。用户需要知道下一步做什么，团队则需要保证多人协作后的输出一致。",
        points: ["页面多：多入口、多流程、多结果页", "状态多：待处理、处理中、已完成与异常中", "任务多：打印 Label、Drop off、Pick up 与补充信息", "异常多：错货、缺货、物流失败、超时与退款失败", "协作多：产品、交互、开发、客服与多位设计师共同参与"],
        image: "/assets/temu-system-overview.png",
      },
      {
        eyebrow: "组织职责",
        title: "把个人判断转化为多人协作的设计质量闭环。",
        body: "作为售后 UI 负责人，我不仅完成页面设计，也负责检查视觉层级、组件使用、状态表达和场景完整性，并将这些判断沉淀为可执行的协作规则。",
        points: ["需求理解与设计输出", "UI 审核", "交付规则", "验收还原", "体验走查", "排期优化"],
        image: "/assets/temu-role-map.png",
      },
      {
        eyebrow: "长期建设",
        title: "用小步、持续的走查机制保证线上体验。",
        body: "定期组织设计师进行一小时体验走查，把页面问题、信息问题和链路问题分配到人。每周每个人可能只处理一至两个小修改，但长期累积形成稳定的体验改进。",
        points: ["建立问题记录与负责人机制", "覆盖不同机型、弱网、大字体和异常状态", "由设计验收并推动产品与开发排期", "让体验问题可以持续被发现、追踪和解决"],
        image: "/assets/temu-role-map.png",
      },
      {
        eyebrow: "核心任务",
        title: "把复杂规则转译为用户可理解、可执行的界面。",
        body: "多状态、多任务和异常分支不应直接暴露给用户。设计需要把规则重新组织为清晰的信息层级、及时的状态反馈、明确的操作引导和可靠的兜底方案。",
        points: ["复杂规则 → 信息层级", "多状态 → 状态反馈", "多任务 → 操作引导", "异常分支 → 兜底方案"],
        image: "/assets/temu-system-overview.png",
      },
      {
        eyebrow: "问题分析",
        title: "退货寄出前的信息混乱，已经引发用户客诉。",
        body: "原页面信息堆叠、步骤不清，用户容易漏看打包、Label 和寄出要求。问题并非用户不知道要退货，而是不知道下一步做什么、先做什么，以及做错会有什么后果。",
        points: ["第一屏没有露出需要打包的商品", "步骤信息层级不清", "Label 使用规则不清楚", "关键信息强调不足", "操作按钮不明显", "打包信息和打印信息关联弱"],
        image: "/assets/temu-page-before-after.png",
      },
      {
        eyebrow: "业务理解",
        title: "退货不是一个页面问题，而是一组连续任务。",
        body: "设计目标是把阅读型说明改造成执行型任务流程，让用户按顺序完成确认商品、打包、打印 Label、正确贴 Label 和寄出包裹。",
        points: ["确认退货商品：避免漏寄、错寄", "打包商品：所有商品放入一个包裹，并带有对应 Barcode", "打印 Label：一个 Label 只能使用一次", "正确贴 Label：覆盖或撕掉原 Label", "携带包裹去邮寄：提供附近邮寄点入口"],
        image: "/assets/temu-page-before-after.png",
      },
      {
        eyebrow: "设计策略",
        title: "让用户按正确顺序完成退货。",
        body: "页面从说明文档变成任务清单，关键信息贴近当前动作，用户不需要在大段文字中自行寻找下一步。",
        points: ["信息分层：先看下一步，再看补充说明", "任务前置：把关键动作放在用户决策前", "风险提示：在容易出错处提前提醒", "行动闭环：让每一步都有明确完成标准"],
        image: "/assets/temu-page-before-after.png",
      },
      {
        eyebrow: "方案与结果",
        title: "从信息说明转为任务引导，降低理解成本与误操作风险。",
        body: "改版后用户可以清楚知道退什么、怎么打包、如何贴 Label 和去哪里寄出。由于该场景无法直接获取数据，我通过后续反馈验证方案；改版后未再出现同类高频客诉。",
        points: ["对用户：知道下一步做什么，降低退货失败风险", "对业务：减少客服咨询和异常退货成本", "对团队：形成可复用的售后任务型页面方法"],
        image: "/assets/temu-page-before-after.png",
      },
      {
        eyebrow: "规范沉淀",
        title: "让售后 UI 从零散交付走向稳定建设。",
        body: "补充常用组件、实时更新常用页面，并统一出图规格、需求背景、负责人和时间信息。组件、审核与走查协同后，核心场景的表达更统一，交付更稳定，优化也能持续推进。",
        points: ["常用组件及时补充，保持设计统一", "常用页面实时更新，避免业务变化造成出图错误", "交付信息可追溯，降低状态遗漏和沟通成本", "沉淀售后常用组件与页面模板，减少重复设计"],
        image: "/assets/temu-system-overview.png",
      },
    ],
  },
  {
    id: "system",
    category: "work",
    title: "设计系统建设",
    label: "团队协作",
    period: "2019 — 2024",
    cover: "/assets/cover-design-system.png",
    size: "standard",
    tone: "blue",
    intro: "从拼小圈 UI Kit 到 TEMU 组件站点，把个人经验沉淀为团队协作标准。",
    summary: "从拼小圈 UI Kit 搭建到 TEMU 组件站点落地，参与规则制定、核心组件视觉与交互定义，并推动规范进入设计与开发协作链路。",
    role: "拼小圈 UI Kit 负责人 / TEMU 组件站点负责人之一",
    outcome: "设计资产从个人稿件变成团队可理解、可调用和可维护的协作标准。",
    stats: [["12", "设计师"], ["33", "开发组件"], ["27", "规范站点"]],
    sections: [
      {
        eyebrow: "协作痛点",
        title: "多人协作的阻力，不是产出慢，而是标准不统一。",
        body: "当设计师、产品和开发对同一组件的理解不一致，会带来重复沟通、反复走查与体验不统一。设计系统的作用，是把个人经验沉淀为团队可复用标准。",
        points: ["Before：各自画组件 → 反复走查 → 样式不一致", "After：调用组件 → 规范说明 → 设计开发统一"],
        image: "/assets/design-system-standard.jpg",
      },
      {
        eyebrow: "组件体系",
        title: "从常用元素延伸到产品级组件规范。",
        body: "梳理 TEMU 与拼多多现有常用设计元素，参考 Google、Apple、Ant Design 等规范，并结合真实业务场景进行分类整理。",
        points: ["Elements：基础元素", "Templates：常用模板", "Guide：使用规则", "Pages：页面范式"],
        image: "/assets/design-system-efficiency.jpg",
      },
      {
        eyebrow: "我的职责",
        title: "让组件既可复用，也能被团队正确理解。",
        body: "参与组件规则制定，负责核心组件的视觉输出与交互定义，协助文档站点内容整理，并持续推动组件在业务项目中的复用。",
        points: ["拼小圈 UI Kit 由我负责建设", "TEMU 组件库与三位同事共同建设", "统一颜色、图标、按钮、提示、标签、导航与动态样式", "将组件、模板、指南和页面范式组织为可查询站点"],
        image: "/assets/design-system-standard.jpg",
      },
      {
        eyebrow: "推动落地",
        title: "规范只有进入协作链路，才真正产生价值。",
        body: "通过规范宣讲帮助设计师理解并使用组件库；与开发 Leader 沟通，推动开发优先调用组件样式；同时明确维护人和对接人，保证问题能够被持续解答。",
        points: ["降低设计走查成本", "减少重复开发", "保障体验与实现一致性", "让设计师把时间投入更有价值的体验思考"],
        image: "/assets/design-system-handoff.jpg",
      },
    ],
  },
  {
    id: "redpacket",
    category: "work",
    title: "拼小圈红包增长设计",
    label: "增长与社交互动",
    period: "2019 — 2022",
    cover: "/assets/posters/redpacket-first-frame.webp",
    size: "wide",
    tone: "red",
    intro: "从认知建立到互动增长、内容消费与交易转化，持续推动红包场景演进。",
    summary: "红包的价值不只是发钱，而是把利益刺激转化为互动、内容消费与交易机会。项目随业务阶段持续演进，从建立红包认知，到承接情绪表达、连续对话与 GMV 转化。",
    role: "UI / UX Design",
    outcome: "互动数据 +1089%，聊天流互动 +20.3%，红包动态评论占全站 45%，场景 GMV +30.2%。",
    stats: [["+1089%", "互动数据"], ["+20.3%", "聊天流互动"], ["45%", "动态评论占比"]],
    sections: [
      {
        eyebrow: "机制判断",
        title: "红包不只是奖励，也是社交互动的触发器。",
        body: "用户带货或发布内容后生成红包动态，好友领取红包，再进入社交互动、留存、内容消费与 GMV 转化。设计需要把利益刺激后的首次点击，继续承接为关系互动。",
        points: ["建立信任，降低红包机制的理解成本", "降低表达成本，承接领取后的情绪高点", "提升互动质量，让一次触发进入持续对话", "扩展内容消费与交易路径"],
        image: "/assets/redpacket-evolution.jpg",
      },
      {
        eyebrow: "阶段演进",
        title: "业务目标变化，设计关注点也随之迁移。",
        body: "拼小圈带货红包并非一次页面改版，而是在不同业务阶段持续演进的增长场景。我需要理解每个阶段的目标变化，并调整设计判断与方案。",
        points: ["1.0 建立信任期：借用成熟红包认知，降低理解成本", "2.0 互动增长期：前置评论入口，互动数据 +1089%", "3.0 互动质量期：从模板化表达进入聊天场景，互动 +20.3%", "4.0 内容消费期：红包互动数据占全站 45%", "5.0 GMV 转化期：强化商品、利益点与转化路径，场景 GMV +30.2%"],
        image: "/assets/redpacket-stage-map.jpg",
      },
      {
        eyebrow: "行为路径",
        title: "领取结果页的情绪高点没有被承接。",
        body: "原路径是看到红包、抢红包、查看结果，然后回到 Timeline 或离开。评论入口留在 Timeline，结果页没有顺手表达的出口，用户还需要思考说什么。",
        points: ["评论入口距离情绪发生点太远", "打字成本高", "用户不知道该说什么", "完成红包后，情绪表达没有被继续承接"],
        image: "/assets/redpacket-path-analysis.jpg",
      },
      {
        eyebrow: "方案取舍",
        title: "从表达自由，转向更高效的低成本表达。",
        body: "输入框表达自由，但打字成本高；纯 Emoji 操作轻量，却难以形成准确互动。最终采用 Emoji + 评论词，让表达既轻量又明确。",
        points: ["点一下即可发送", "评论词比纯 Emoji 更准确", "Emoji 提供情绪感", "保留主动评论入口，兼顾自由表达"],
        image: "/assets/redpacket-result.jpg",
      },
      {
        eyebrow: "情绪匹配",
        title: "不同结果，对应不同的情绪与表达。",
        body: "抢到红包的用户更接近开心、炫耀与轻松；没抢到的用户更接近失落、吐槽和共鸣。用结果差异匹配话术，让不同用户都能自然地有话可说。",
        points: ["抢到：红包到账了 / 手快没办法 / 一个不够抢", "没抢到：每次都抢不到 / 还是没抢到 / 哇，你们手真快", "强化金额、红包质感、头像和好友露出，增加奖励感与社交氛围"],
        image: "/assets/redpacket-result.jpg",
      },
      {
        eyebrow: "连续对话",
        title: "一键评论解决开口难，聊天流承接持续互动。",
        body: "产品形态会影响用户行为。页面从结果反馈转为交流场域后，用户更容易产生主动、真实的互动，聊天流互动提升 20.3%。",
        points: ["聊天流承接评论，增强对话感", "强化带货商品与内容承接", "保留一键评论入口", "把一次性触发转化为关系沉淀"],
        image: "/assets/redpacket-review.jpg",
      },
      {
        eyebrow: "结果验证",
        title: "带货红包成为拼小圈新增动态中平均互动最高的内容。",
        body: "改版后互动数据提升 1089%，显著超过产品预期。带货红包跑通后，机制进一步扩展到照片红包、影集红包与勋章红包等内容场景。",
        points: ["红包动态量占全站 2.2%", "红包被互动占全站 16%", "红包动态评论占全站 45%", "数据截图已脱敏，仅保留排序、比例与对比关系"],
        image: "/assets/redpacket-extension.jpg",
      },
      {
        eyebrow: "项目复盘",
        title: "增长设计不是单点转化优化，而是把一次点击转化为后续机会。",
        body: "项目的关键不是增加一个按钮，而是找准行为与情绪节点，降低表达成本，并随业务目标持续调整机制。",
        points: ["找准情绪高点：在领取结果页承接表达", "降低表达成本：让用户无需组织语言", "匹配场景情绪：减少模板感", "按阶段调整目标：从互动增长延伸到内容消费与交易"],
        image: "/assets/redpacket-review.jpg",
      },
    ],
  },
  {
    id: "message",
    category: "work",
    title: "多多视频消息体系",
    label: "信息架构",
    period: "2024 — 2025",
    cover: "/assets/cover-message-system.png",
    size: "standard",
    tone: "violet",
    intro: "通过角色分层与优先级重排，提升普通用户与创作者的消息获取效率。",
    summary: "消息页同时承载普通用户、创作者和平台通知。项目通过数据判断高价值入口，再以角色识别、任务分层和状态规范重组页面，让用户更快到达当前最重要的信息。",
    role: "交互 / UI 设计",
    outcome: "全站活跃 +0.35%，视频播放时长 +0.30%，短剧时长 +0.78%。",
    stats: [["+0.35%", "全站活跃"], ["+0.30%", "播放时长"], ["+0.78%", "短剧时长"]],
    sections: [
      {
        eyebrow: "问题拆解",
        title: "角色混杂、模块无序，重要消息无法快速被看见。",
        body: "消息页同时承载普通用户、创作者和平台通知，信息类型复杂且优先级混杂。界面还存在颜色过多、对齐规则混乱、图标精致度不足和信息层级不合理等问题。",
        points: ["普通用户功能与创作者功能混在统一列表", "高价值入口缺少明确优先级", "分类、红点与落点状态不统一", "用户难以快速找到此刻最重要的消息"],
        image: "/assets/message-problem.jpg",
      },
      {
        eyebrow: "数据判断",
        title: "用真实访问数据识别页面的核心流量点。",
        body: "消息页总 UV 为 1700w+；作者红包 UV 为 1000w+；好友红包 UV 为 800w+。不同入口用户存在重叠，数据用于判断入口优先级，不作为互斥流量占比。",
        points: ["作者红包与好友红包是高价值入口", "优先优化核心入口的展示和触达效率", "数据用于设计判断，而不是简单按数值堆砌模块"],
        image: "/assets/message-entrance.jpg",
      },
      {
        eyebrow: "交互策略",
        title: "用访问频率、行动价值与时效性重组消息优先级。",
        body: "消息页不是功能入口集合，而是帮助用户快速找到此刻最需要处理的信息。方案从统一列表改为按角色与任务分层。",
        points: ["普通用户高优先级：好友红包 / 作者红包", "普通用户次优先级：互动消息 / 活动通知", "创作者高优先级：创作者中心 / 活动信息", "创作者次优先级：评论 / 回复 / 粉丝互动", "信息流继续承接最新内容反馈"],
        image: "/assets/message-system-overview.jpg",
      },
      {
        eyebrow: "交互细节",
        title: "从页面结构继续深入到回复、点赞和状态反馈。",
        body: "梳理消息页原有交互环节，统一评论、回复、提及和点赞的动作与回显状态，减少用户对按钮含义和操作结果的猜测。",
        points: ["回复动作改为更直接、易理解的表达", "点赞后显示“已赞”，强化回显状态", "提及消息补齐回复与点赞能力", "统一列表卡片、文案、红点和信息状态"],
        image: "/assets/message-feedback.jpg",
      },
      {
        eyebrow: "优化结果",
        title: "只调整信息结构、规则和优先级，也能带来核心指标增长。",
        body: "改版对全站活跃时长、短视频场景总时长和短剧时长均产生正向影响，并完成全量上线。数据帮助设计判断优先级，视觉优化服务于信息效率。",
        points: ["全站活跃时长 +0.35%", "短视频场景总时长 +0.30%", "短剧时长 +0.78%"],
        image: "/assets/message-result.jpg",
      },
    ],
  },
  {
    id: "ai",
    category: "work",
    title: "AI 辅助设计与产品探索",
    label: "AI 意识与原型验证",
    period: "2025 — 2026",
    cover: "/assets/cover-ai-workflow.png",
    size: "wide",
    tone: "lime",
    intro: "从产品判断、体验设计到可点击 Demo，探索 AI 如何缩短设计与原型之间的距离。",
    summary: "AI 主要辅助页面与组件实现、基础交互和快速修改；产品判断、信息层级、视觉规则、体验走查与最终决策仍由设计师负责。并以“息心”和“地球 Online”两款个人产品概念完成验证。",
    role: "产品定义 / 体验设计 / 原型验证",
    outcome: "完成两套高保真界面与可交互 Demo，把抽象需求转化为可以实际点击、体验和验证的产品原型。",
    stats: [["2", "独立产品概念"], ["4", "协作阶段"], ["Demo", "可点击验证"]],
    sections: [
      {
        eyebrow: "协作工作流",
        title: "AI 缩短从设计到原型的距离，但产品判断始终由设计师负责。",
        body: "我先定义问题与核心路径，完成信息层级、视觉规则和交互状态，再借助 AI 将明确的设计要求快速实现为可点击 Demo，最后从真实使用路径走查并迭代。",
        points: ["定义问题：明确用户场景、核心问题与关键路径", "设计体验：完成信息层级、核心界面、视觉规则与交互状态", "AI 辅助开发：实现页面、组件、基础交互与状态切换", "走查迭代：检查反馈、文案、状态和流程并快速调整"],
        image: "/assets/ai-workflow-detail.jpg",
      },
      {
        eyebrow: "产品探索",
        title: "从两种真实但容易被忽略的用户状态出发。",
        body: "当情绪很乱时，人需要先恢复一点稳定；当想改变却无从下手时，人需要一个足够具体的起点。围绕这两类问题，我完成产品定义、核心体验、视觉系统和可交互原型。",
        points: ["息心：情绪很乱时，不要求用户立刻想明白", "地球 Online：把人生当作一场持续推进的开放世界游戏"],
        image: "/assets/ai-product-exploration.jpg",
      },
      {
        eyebrow: "息心",
        title: "把情绪调节收敛为短、轻、可随时退出的步骤。",
        body: "焦虑、疲惫或情绪上来时，用户通常没有余力完成复杂选择，也很难立刻分析问题。息心帮助用户从情绪高峰中恢复一点稳定，再决定是否继续整理感受。",
        points: ["识别此刻状态：无需长篇解释，只选择最接近的状态", "让身体回到当下：通过呼吸与五感着陆暂时抽离反复担心", "把担心先放一放：记录脑中的担心、感受和下一步"],
        image: "/assets/ai-core-experience.jpg",
      },
      {
        eyebrow: "地球 Online",
        title: "把复杂的人生命题，重新组织为可以探索和推进的个人地图。",
        body: "每个人拥有不同起点、资源与现实处境。人生不是一条标准主线，成长也不是变成别人，而是在有限精力中持续投入真正重要的方向。",
        points: ["创建角色：建立当前存档", "人生扫描：看见状态与资源分布", "选择主线：给“想改变”一个明确起点", "推进任务：把长期目标拆成今天能完成的动作", "周度回顾：根据现实重新校准节奏与方向"],
        image: "/assets/ai-mainline.jpg",
      },
      {
        eyebrow: "设计映射",
        title: "用游戏语言承载现实成长，但不把人生简单任务化。",
        body: "主线任务对应当前最值得推进的人生议题，支线任务对应兴趣与探索，能力值记录长期积累，每日任务提供可完成的一小步，周度复盘帮助用户重新校准。",
        points: ["主线任务：当前最值得集中推进的议题", "支线任务：兴趣、习惯与探索性小目标", "能力值：执行力、专注、职业能力与生活节奏", "成就与勋章：阶段性的投入和成长痕迹"],
        image: "/assets/ai-visual-demo.jpg",
      },
      {
        eyebrow: "能力沉淀",
        title: "从模糊感受，到一套可以被体验的产品。",
        body: "这两个项目关注的不是功能堆叠，而是用户在复杂状态下会卡在哪一步，以及产品应该如何降低开始的成本。",
        points: ["从真实状态出发定义问题", "把抽象需求转化为清晰体验路径", "把概念落成可点击、可验证的原型", "让用户真正能够开始，并感受到自己正在向前推进"],
        image: "/assets/ai-product-summary.jpg",
      },
    ],
  },
  {
    id: "emoji",
    category: "work",
    title: "多多 Emoji 与视觉作品",
    label: "情绪表达与视觉设计",
    period: "上线 5 年+",
    cover: "/assets/posters/emoji-first-frame.webp",
    size: "standard",
    tone: "yellow",
    intro: "一套跨越评论、聊天、评价和内部沟通场景的情绪表达资产。",
    summary: "通过统一角色语言与丰富情绪动作，让同一套 Emoji 在拼小圈评论、短视频、商品评价、商家与好友聊天和内部沟通中持续复用，并延伸展示活动视觉、图标和插画能力。",
    role: "视觉设计",
    outcome: "形成拼多多体系内一致、低门槛的情绪表达资产，并持续应用超过五年。",
    stats: [["5 年+", "持续上线"], ["多场景", "跨产品复用"], ["统一", "情绪资产"]],
    sections: [
      {
        eyebrow: "Emoji 资产",
        title: "让表情保持统一角色感，也拥有足够的情绪跨度。",
        body: "整套资产覆盖开心、疑惑、喜爱、惊讶、墨镜、哭、怒、坏笑、点赞、握手、爱心、红包等情绪与动作，让用户用更低成本表达语气和态度。",
        image: "/assets/posters/emoji-first-frame.webp",
      },
      {
        eyebrow: "实际应用",
        title: "同一套情绪语言，在不同产品关系中持续复用。",
        body: "Emoji 已应用于商家聊天、拼小圈互动、好友聊天、商品评价体系、多多视频、行家社区和拼多多内部工作沟通软件。",
        points: ["拼小圈评论", "短视频互动", "评价与行家精选", "商家与好友聊天", "内部工作沟通"],
        image: "/assets/images/其他.webp",
      },
      {
        eyebrow: "视觉延伸",
        title: "从活动视觉到工作日图标和系列插画。",
        body: "作品还包含春节摇骰子拉新活动、工作日生活图标和“一周有八天”系列插画，体现不同场景下的视觉叙事与风格控制。",
        points: ["春节摇骰子：把线下好友互动与拉新奖励结合", "Icon 设计：围绕睡觉、闹钟、早餐、骑车、上班与下班等工作日场景", "系列插画：用统一构图表达一周八天的设计日常"],
        image: "/assets/images/其他.webp",
      },
    ],
  },
];

const experience = [
  ["多多视频", "交互 / UI 设计师", "2024 — 2025"],
  ["TEMU", "C 端售后 UI 负责人", "2022 — 2024"],
  ["拼小圈", "UI 设计师", "2019 — 2022"],
];

function runViewTransition(update, type = "page") {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  root.dataset.viewTransition = type;

  const finish = (promise) => promise.finally(() => {
    if (root.dataset.viewTransition === type) delete root.dataset.viewTransition;
  });

  if (typeof document.startViewTransition !== "function" || reduceMotion) {
    flushSync(update);
    return finish(Promise.resolve());
  }

  return finish(document.startViewTransition(() => flushSync(update)).finished.catch(() => {}));
}

function prepareDetailClose(projectId) {
  const layer = document.querySelector(".detail-layer");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = layer?.querySelector(".detail-hero");

  if (reduceMotion || typeof document.startViewTransition !== "function" || !hero) return null;

  hero.style.viewTransitionName = "none";
  const snapshot = hero.cloneNode(true);
  snapshot.classList.add("detail-close-snapshot");
  snapshot.style.viewTransitionName = `project-cover-${projectId}`;
  document.body.append(snapshot);

  return {
    node: snapshot,
    ready: new Promise((resolve) => requestAnimationFrame(resolve)),
  };
}

function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path className="contact-fill" d="M4.6 5.5h14.8A1.6 1.6 0 0 1 21 7.1v9.8a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 16.9V7.1a1.6 1.6 0 0 1 1.6-1.6Z" />
      <path className="contact-fold" d="m4.7 7.3 7.3 5.2 7.3-5.2" />
    </svg>
  );
}

function CopyIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" /></svg>;
}

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4.5-4.5M12 15l-4.5-4.5M5 20h14" /></svg>;
}

function NavArrowIcon({ direction = "next" }) {
  return <svg className={direction === "previous" ? "is-previous" : ""} viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>;
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (_) {
    const field = document.createElement("textarea");
    field.value = value;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
}

function ContactModal({ onClose }) {
  const [copied, setCopied] = useState(null);
  const panelRef = useRef(null);
  const details = [
    ["微信", "KISS_WIN"],
    ["电话", "13772150131"],
    ["邮箱", "banqiu1230@gmail.com"],
  ];

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
    document.documentElement.classList.add("contact-open");
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.documentElement.classList.remove("contact-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  async function handleCopy(label, value) {
    await copyText(value);
    setCopied(label);
  }

  return (
    <div className="contact-modal" role="dialog" aria-modal="true" aria-labelledby="contact-title">
      <button className="contact-modal-backdrop" onClick={onClose} aria-label="关闭联系方式" />
      <section className="contact-panel" ref={panelRef} tabIndex="-1">
        <button className="contact-modal-close" onClick={onClose} aria-label="关闭联系方式"><CloseIcon /></button>
        <h2 id="contact-title">联系我</h2>
        <div className="contact-list">
          {details.map(([label, value]) => (
            <div className="contact-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <button
                className={copied === label ? "is-copied" : ""}
                onClick={() => handleCopy(label, value)}
                aria-label={copied === label ? `${label}复制成功` : `复制${label}`}
              >
                {copied === label ? <CheckIcon /> : <CopyIcon />}
                <span>{copied === label ? "复制成功" : "复制"}</span>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function VideoCover({ src, poster, className }) {
  const videoRef = useRef(null);
  const [posterReady, setPosterReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    setPosterReady(false);
    setPlaying(false);

    const tryPlay = () => {
      const playRequest = video.play();
      if (playRequest) playRequest.catch(() => setPlaying(false));
    };

    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("loadeddata", tryPlay, { once: true });

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, [src]);

  return (
    <div className={`video-cover${posterReady ? " has-poster" : ""}${playing ? " is-playing" : ""}`}>
      <img
        className="video-cover-poster"
        src={assetUrl(poster)}
        alt=""
        onLoad={() => setPosterReady(true)}
      />
      <span className="video-cover-shimmer" />
      <video
        ref={videoRef}
        className={className}
        src={assetUrl(src)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onError={() => setPlaying(false)}
      />
    </div>
  );
}

function ProjectCover({ projectId }) {
  const covers = {
    temu: (
      <VideoCover
        className="cover-temu-video"
        src="/assets/videos/temu-aftersales.mp4?v=8"
        poster="/assets/posters/temu-aftersales-first-frame.webp"
      />
    ),
    system: (
      <>
        <div className="cover-sheet cover-ds-left"><img src={assetUrl("/assets/design-system-standard.jpg")} alt="" /></div>
        <div className="cover-sheet cover-ds-center"><img src={assetUrl("/assets/design-system-efficiency.jpg")} alt="" /></div>
        <div className="cover-sheet cover-ds-right"><img src={assetUrl("/assets/design-system-handoff.jpg")} alt="" /></div>
      </>
    ),
    redpacket: (
      <VideoCover
        className="cover-redpacket-video"
        src="/assets/videos/redpacket.mp4"
        poster="/assets/posters/redpacket-first-frame.webp"
      />
    ),
    message: (
      <>
        <div className="cover-sheet cover-message-before"><img src={assetUrl("/assets/message-system.png")} alt="" /></div>
        <div className="cover-sheet cover-message-after"><img src={assetUrl("/assets/message-system-overview.jpg")} alt="" /></div>
        <div className="cover-status-dot" />
      </>
    ),
    ai: (
      <>
        <div className="cover-sheet cover-ai-main"><img src={assetUrl("/assets/ai-core-experience.jpg")} alt="" /></div>
        <div className="cover-sheet cover-ai-dark"><img src={assetUrl("/assets/ai-product-exploration.jpg")} alt="" /></div>
        <div className="cover-sheet cover-ai-flow"><img src={assetUrl("/assets/ai-mainline.jpg")} alt="" /></div>
      </>
    ),
    emoji: (
      <VideoCover
        className="cover-emoji-video"
        src="/assets/videos/emoji.mp4"
        poster="/assets/posters/emoji-first-frame.webp"
      />
    ),
  };

  return <div className={`cover-art cover-${projectId}`} aria-hidden="true">{covers[projectId]}</div>;
}

function ProjectCard({ project, index, activeId, transitioningId, onOpen }) {
  return (
    <button
      className={`card project-card project-${project.size} tone-${project.tone}${transitioningId === project.id ? " is-transitioning" : ""}`}
      onClick={() => onOpen(project.id)}
      style={{ "--delay": `${index * 55}ms` }}
      data-project-id={project.id}
      aria-label={`打开${project.title}案例`}
    >
      <span
        className="project-surface"
        style={{
          viewTransitionName:
            transitioningId === project.id && activeId !== project.id
              ? `project-shell-${project.id}`
              : "none",
        }}
        aria-hidden="true"
      />
      <div
        className="project-media"
        style={{
          viewTransitionName:
            transitioningId === project.id && activeId !== project.id
              ? `project-cover-${project.id}`
              : "none",
        }}
      >
        <ProjectCover projectId={project.id} />
        <span className="open-icon"><ArrowIcon /></span>
      </div>
      <div className="project-copy">
        <div>
          <span className="card-kicker">{project.label}</span>
          <h2>{project.title}</h2>
        </div>
        <p>{project.intro}</p>
        <span className="project-period">{project.period}</span>
      </div>
    </button>
  );
}

function DownloadCard({ type, title, meta, href, fileName, wide = false }) {
  return (
    <a
      className={`card download-card reveal-card${wide ? " download-wide" : ""}`}
      href={href}
      download={fileName}
      data-project-id={`download-${type}`}
      aria-label={`下载${title}`}
    >
      <div className="download-visual" aria-hidden="true">
        <span className="document-sheet">
          <i /><i /><i /><i />
        </span>
        <span className="download-action"><DownloadIcon /></span>
      </div>
      <div className="download-copy">
        <span className="card-kicker">PDF · {meta}</span>
        <h2>{title}</h2>
        <span className="download-link">下载 <DownloadIcon /></span>
      </div>
    </a>
  );
}

function Detail({ project, previousProject, nextProject, transitioning, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const layerRef = useRef(null);
  const [showBackTop, setShowBackTop] = useState(false);

  useLayoutEffect(() => {
    layerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setShowBackTop(false);
    panelRef.current?.focus({ preventScroll: true });
  }, [project.id]);

  return (
    <div
      className={`detail-layer${transitioning ? " is-transitioning" : ""}`}
      ref={layerRef}
      onScroll={(event) => setShowBackTop(event.currentTarget.scrollTop > Math.max(520, window.innerHeight * 0.65))}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title}项目详情`}
    >
      <div
        className="detail-backdrop"
        style={{ viewTransitionName: `project-shell-${project.id}` }}
        aria-hidden="true"
      />
      <button className="detail-close" onClick={onClose} aria-label="关闭项目详情"><CloseIcon /></button>
      <button className={`detail-back-top${showBackTop ? " is-visible" : ""}`} onClick={() => layerRef.current?.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回详情页顶部" tabIndex={showBackTop ? 0 : -1}>↑</button>
      <article className="detail-page" tabIndex="-1" ref={panelRef}>
        <header
          className={`detail-hero tone-${project.tone}`}
          style={{ viewTransitionName: `project-cover-${project.id}` }}
        >
          <ProjectCover projectId={project.id} />
        </header>
        <section className="detail-intro">
          <span className="detail-index">{project.period} · {project.label}</span>
          <h1>{project.title}</h1>
          <p className="detail-lead">{project.summary}</p>
          <div className="detail-meta">
            <div><span>我的角色</span><strong>{project.role}</strong></div>
            <div><span>项目结果</span><strong>{project.outcome}</strong></div>
          </div>
          <div className="stat-row">
            {project.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </section>
        <div className="detail-sections">
          {project.sections.map((section, index) => (
            <section className="case-section" key={section.title}>
              <div className="case-copy">
                <span>{String(index + 1).padStart(2, "0")} · {section.eyebrow}</span>
                <h2>{section.title}</h2>
                <p>{section.body}</p>
                {section.points?.length ? (
                  <ul className="case-points">
                    {section.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                ) : null}
              </div>
              <figure><img src={assetUrl(section.image)} alt={`${project.title}：${section.eyebrow}`} loading="lazy" /></figure>
            </section>
          ))}
        </div>
        <footer className="detail-footer">
          <button className="detail-project-link is-previous" onClick={() => onNavigate(previousProject.id)}>
            <NavArrowIcon direction="previous" />
            <span><small>上一个项目</small><strong>{previousProject.title}</strong></span>
          </button>
          <button className="detail-project-link is-next" onClick={() => onNavigate(nextProject.id)}>
            <span><small>下一个项目</small><strong>{nextProject.title}</strong></span>
            <NavArrowIcon />
          </button>
        </footer>
      </article>
    </div>
  );
}

export function App() {
  const initialHash = window.location.hash.match(/^#project\/(.+)$/)?.[1];
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(projects.some((p) => p.id === initialHash) ? initialHash : null);
  const [transitioningId, setTransitioningId] = useState(null);
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const [contactOpen, setContactOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const scrollPosition = useRef(0);
  const gridRef = useRef(null);

  const visibleProjects = useMemo(() => {
    if (filter === "all" || filter === "work") {
      return filter === "all" ? projects : projects.filter((item) => item.category === filter);
    }
    return [];
  }, [filter]);

  const activeProject = projects.find((item) => item.id === activeId);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#121310" : "#efede9");
    try {
      window.localStorage.setItem("win-theme", theme);
    } catch (_) {}
  }, [theme]);

  useEffect(() => {
    const updateBackTop = () => setShowBackTop(window.scrollY > Math.max(520, window.innerHeight * 0.65));
    updateBackTop();
    window.addEventListener("scroll", updateBackTop, { passive: true });
    window.addEventListener("resize", updateBackTop);
    return () => {
      window.removeEventListener("scroll", updateBackTop);
      window.removeEventListener("resize", updateBackTop);
    };
  }, []);

  useEffect(() => {
    const onPopState = async () => {
      const id = window.location.hash.match(/^#project\/(.+)$/)?.[1];
      const nextId = projects.some((p) => p.id === id) ? id : null;
      if (nextId && !activeId) scrollPosition.current = window.scrollY;
      const transitionId = activeId || nextId;
      const closeSnapshot = !nextId && activeId ? prepareDetailClose(activeId) : null;
      if (closeSnapshot) await closeSnapshot.ready;
      if (transitionId) flushSync(() => setTransitioningId(transitionId));
      runViewTransition(() => {
        closeSnapshot?.node.remove();
        setActiveId(nextId);
      }, nextId ? "detail-open" : "detail-close").finally(() => setTransitioningId(null));
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape" && activeId) closeProject();
    };
    window.addEventListener("popstate", onPopState);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId]);

  useLayoutEffect(() => {
    if (!activeId) return undefined;

    const html = document.documentElement;
    const body = document.body;
    const lockedY = scrollPosition.current;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    const supportsStableGutter = window.CSS?.supports?.("scrollbar-gutter: stable");
    const previous = {
      paddingRight: body.style.paddingRight,
    };

    html.classList.add("detail-open");
    body.classList.add("detail-open");
    if (!supportsStableGutter && scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      html.classList.remove("detail-open");
      body.classList.remove("detail-open");
      Object.assign(body.style, previous);
      window.scrollTo({ top: lockedY, behavior: "instant" });
    };
  }, [activeId]);

  function openProject(id) {
    scrollPosition.current = window.scrollY;
    flushSync(() => setTransitioningId(id));
    window.history.pushState({ project: id }, "", `#project/${id}`);
    runViewTransition(() => {
      setActiveId(id);
    }, "detail-open").finally(() => setTransitioningId(null));
  }

  async function closeProject() {
    const closingId = activeId;
    const closeSnapshot = prepareDetailClose(closingId);
    if (closeSnapshot) await closeSnapshot.ready;
    flushSync(() => setTransitioningId(closingId));
    if (window.location.hash.startsWith("#project/")) {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
    runViewTransition(() => {
      closeSnapshot?.node.remove();
      setActiveId(null);
    }, "detail-close").finally(() => setTransitioningId(null));
  }

  function navigateProject(id) {
    if (id === activeId) return;
    window.history.pushState({ project: id }, "", `#project/${id}`);
    runViewTransition(() => {
      setActiveId(id);
    }, "detail-switch");
  }

  function changeFilter(nextFilter) {
    if (nextFilter === filter) return;

    const grid = gridRef.current;
    const beforeRects = new Map(
      [...(grid?.querySelectorAll("[data-project-id]") || [])].map((card) => [
        card.dataset.projectId,
        card.getBoundingClientRect(),
      ]),
    );
    // End any previous smooth-scroll correction before changing the layout.
    window.scrollTo({ top: window.scrollY, behavior: "instant" });

    flushSync(() => setFilter(nextFilter));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 0 : 420;
    if (grid && duration) {
      grid.querySelectorAll("[data-project-id]").forEach((card) => {
        const before = beforeRects.get(card.dataset.projectId);
        const after = card.getBoundingClientRect();
        if (!before) return;
        const deltaX = before.left - after.left;
        const deltaY = before.top - after.top;
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
        card.animate(
          [
            { transform: `translate(${deltaX}px, ${deltaY}px)` },
            { transform: "translate(0, 0)" },
          ],
          { duration, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
      });
    }
  }

  return (
    <>
      <header className="site-header">
        <a className="mark" href="#top" aria-label="WIN 首页">WIN</a>
        <nav className="filter-nav" aria-label="作品筛选">
          {filters.map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? "active" : ""}
              onClick={() => changeFilter(value)}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main id="top" className="site-shell">
        <section ref={gridRef} className={`bento-grid filter-${filter}`} aria-live="polite">
          {(filter === "all" || filter === "about") && (
            <>
              <article className="card intro-card reveal-card">
                <img className="avatar" src={assetUrl("/assets/avatar.png")} alt="张文头像" />
                <div><span className="card-kicker">UI/UX 设计师</span><h1>你好，我是张文👋</h1><p>拥有 6 年 C 端产品经验，参与 TEMU、拼小圈和多多视频等产品建设，专注复杂业务体验、增长设计与设计系统。</p></div>
              </article>
              <button
                className={`card theme-card reveal-card${theme === "dark" ? " is-dark" : ""}`}
                onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
                aria-label={`切换到${theme === "dark" ? "浅色" : "深色"}模式`}
                aria-pressed={theme === "dark"}
                data-tooltip={`切换到${theme === "dark" ? "浅色" : "深色"}`}
              >
                <span className="theme-preview" aria-hidden="true" />
              </button>
              <article className="card experience-card reveal-card">
                <div className="section-heading"><span>工作经历</span><strong>6 年</strong></div>
                {experience.map(([company, role, period]) => <div className="experience-row" key={company}><strong>{company}</strong><span>{role}</span><time>{period}</time></div>)}
              </article>
              <article className="card skill-card reveal-card">
                <span className="card-kicker">核心能力</span>
                <div className="skill-cloud"><span>UI 设计</span><span>增长设计</span><span>数据驱动</span><span>复杂流程</span><span>设计系统</span><span>交互设计</span><span>Vibe Coding</span><span>AI 辅助设计</span></div>
              </article>
              <button className="card contact-card reveal-card" onClick={() => setContactOpen(true)} aria-label="打开联系方式" data-tooltip="联系我">
                <span className="contact-symbol"><ContactIcon /></span>
              </button>
              <article className="card philosophy-card reveal-card">
                <span className="card-kicker">设计方向</span>
                <blockquote>在复杂业务里，建立清晰、可信的体验秩序。</blockquote>
              </article>
            </>
          )}

          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              activeId={activeId}
              transitioningId={transitioningId}
              onOpen={openProject}
            />
          ))}

          {(filter === "all" || filter === "resume") && (
            <>
              <DownloadCard
                type="resume"
                title="个人简历"
                meta="3.1 MB"
                href={assetUrl("/assets/wen-zhang-resume.pdf")}
                fileName="张文_UIUX_简历.pdf"
              />
              <DownloadCard
                type="portfolio"
                title="作品集"
                meta="15 MB"
                href={assetUrl("/assets/wen-zhang-portfolio.pdf")}
                fileName="张文_UIUX_作品集.pdf"
                wide
              />
              <article className="card closing-card reveal-card">
                <span className="card-kicker">持续探索</span>
                <h2>工具会变化，设计判断仍然来自对真实问题的理解。</h2>
              </article>
            </>
          )}
        </section>
      </main>

      <footer className="site-footer"><span>WIN · UI/UX DESIGNER</span><span>SHANGHAI · 2026</span></footer>
      <button className={`back-top${showBackTop ? " is-visible" : ""}`} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回顶部" tabIndex={showBackTop ? 0 : -1}>↑</button>

      {activeProject && (
        <Detail
          project={activeProject}
          previousProject={projects[(projects.indexOf(activeProject) - 1 + projects.length) % projects.length]}
          nextProject={projects[(projects.indexOf(activeProject) + 1) % projects.length]}
          transitioning={transitioningId === activeProject.id}
          onClose={closeProject}
          onNavigate={navigateProject}
        />
      )}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}
