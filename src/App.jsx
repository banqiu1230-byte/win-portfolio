import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { figmaProjectContent } from "./figmaContent";

const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const filters = [
  ["all", "全部"],
  ["about", "关于"],
  ["work", "工作"],
  ["resume", "简历"],
];

const projectDrafts = [
  {
    id: "temu",
    category: "work",
    title: "TEMU 售后体验系统",
    label: "复杂业务体验",
    period: "2022 — 2024",
    cover: "/assets/posters/temu-aftersales-poster.webp",
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
        image: "/assets/temu-01-business-objectives.png",
      },
      {
        eyebrow: "组织职责",
        title: "把个人判断转化为多人协作的设计质量闭环。",
        body: "作为售后 UI 负责人，我不仅完成页面设计，也负责检查视觉层级、组件使用、状态表达和场景完整性，并将这些判断沉淀为可执行的协作规则。",
        points: ["需求理解与设计输出", "UI 审核", "交付规则", "验收还原", "体验走查", "排期优化"],
        image: "/assets/temu-12-standards-collaboration.png",
      },
      {
        eyebrow: "长期建设",
        title: "用小步、持续的走查机制保证线上体验。",
        body: "定期组织设计师进行一小时体验走查，把页面问题、信息问题和链路问题分配到人。每周每个人可能只处理一至两个小修改，但长期累积形成稳定的体验改进。",
        points: ["建立问题记录与负责人机制", "覆盖不同机型、弱网、大字体和异常状态", "由设计验收并推动产品与开发排期", "让体验问题可以持续被发现、追踪和解决"],
        image: "/assets/temu-12-standards-collaboration.png",
      },
      {
        eyebrow: "核心任务",
        title: "把复杂规则转译为用户可理解、可执行的界面。",
        body: "多状态、多任务和异常分支不应直接暴露给用户。设计需要把规则重新组织为清晰的信息层级、及时的状态反馈、明确的操作引导和可靠的兜底方案。",
        points: ["复杂规则 → 信息层级", "多状态 → 状态反馈", "多任务 → 操作引导", "异常分支 → 兜底方案"],
        image: "/assets/temu-03-return-complexity.png",
      },
      {
        eyebrow: "问题分析",
        title: "退货寄出前的信息混乱，已经引发用户客诉。",
        body: "原页面信息堆叠、步骤不清，用户容易漏看打包、Label 和寄出要求。问题并非用户不知道要退货，而是不知道下一步做什么、先做什么，以及做错会有什么后果。",
        points: ["第一屏没有露出需要打包的商品", "步骤信息层级不清", "Label 使用规则不清楚", "关键信息强调不足", "操作按钮不明显", "打包信息和打印信息关联弱"],
        image: "/assets/temu-06-issue-diagnosis.png",
      },
      {
        eyebrow: "业务理解",
        title: "退货不是一个页面问题，而是一组连续任务。",
        body: "设计目标是把阅读型说明改造成执行型任务流程，让用户按顺序完成确认商品、打包、打印 Label、正确贴 Label 和寄出包裹。",
        points: ["确认退货商品：避免漏寄、错寄", "打包商品：所有商品放入一个包裹，并带有对应 Barcode", "打印 Label：一个 Label 只能使用一次", "正确贴 Label：覆盖或撕掉原 Label", "携带包裹去邮寄：提供附近邮寄点入口"],
        image: "/assets/temu-07-project-understanding.png",
      },
      {
        eyebrow: "设计策略",
        title: "让用户按正确顺序完成退货。",
        body: "页面从说明文档变成任务清单，关键信息贴近当前动作，用户不需要在大段文字中自行寻找下一步。",
        points: ["信息分层：先看下一步，再看补充说明", "任务前置：把关键动作放在用户决策前", "风险提示：在容易出错处提前提醒", "行动闭环：让每一步都有明确完成标准"],
        image: "/assets/temu-08-design-strategy.png",
      },
      {
        eyebrow: "方案与结果",
        title: "从信息说明转为任务引导，降低理解成本与误操作风险。",
        body: "改版后用户可以清楚知道退什么、怎么打包、如何贴 Label 和去哪里寄出。由于该场景无法直接获取数据，我通过后续反馈验证方案；改版后未再出现同类高频客诉。",
        points: ["对用户：知道下一步做什么，降低退货失败风险", "对业务：减少客服咨询和异常退货成本", "对团队：形成可复用的售后任务型页面方法"],
        image: "/assets/temu-09-before-after.png",
      },
      {
        eyebrow: "规范沉淀",
        title: "让售后 UI 从零散交付走向稳定建设。",
        body: "补充常用组件、实时更新常用页面，并统一出图规格、需求背景、负责人和时间信息。组件、审核与走查协同后，核心场景的表达更统一，交付更稳定，优化也能持续推进。",
        points: ["常用组件及时补充，保持设计统一", "常用页面实时更新，避免业务变化造成出图错误", "交付信息可追溯，降低状态遗漏和沟通成本", "沉淀售后常用组件与页面模板，减少重复设计"],
        image: "/assets/temu-12-standards-collaboration.png",
      },
      {
        eyebrow: "阶段成果",
        title: "从完成页面，走向一套可以长期运转的售后 UI 建设方式。",
        body: "项目最终沉淀的不只是若干页面，而是覆盖设计、审核、验收和持续优化的协作方式。售后核心场景拥有了更统一的表达、更稳定的交付质量，以及可以持续更新的组件和页面规范。",
        points: ["统一表达：常用组件与页面模板减少同类场景差异", "稳定交付：审核与验收机制降低多人协作中的质量波动", "持续优化：体验走查让线上问题被长期发现、追踪与修正"],
        image: "/assets/temu-13-retrospective.png",
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
      {
        eyebrow: "建设结果",
        title: "设计资产从个人稿件，变成团队可查询、可调用、可维护的标准。",
        body: "拼小圈 UI Kit 完成了个人经验的结构化沉淀；TEMU 组件站点进一步把设计规则、组件说明和开发实现连接起来。团队可以在统一入口理解规范、复用资产，并持续补充新的业务能力。",
        points: ["设计侧：减少重复绘制与反复走查", "开发侧：优先复用已有组件，降低重复建设", "协作侧：规则、维护人和问题对接方式更加清晰", "体验侧：跨页面、跨业务的视觉与交互表达更一致"],
        image: "/assets/design-system-efficiency.jpg",
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
        eyebrow: "视觉表达",
        title: "用奖励感和好友关系，放大领取结果页的情绪高点。",
        body: "视觉重点集中在金额、红包氛围和参与好友。金色描边强化奖励感，头像居中建立社交关系，手写感评论承接轻松语气，让结果页不只是在告知金额，而是在制造一次值得回应的社交时刻。",
        points: ["金额成为第一视觉焦点", "红包氛围强化获得奖励的感受", "好友头像与领取列表补充社交在场感", "轻量评论样式降低正式感，鼓励继续互动"],
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
        eyebrow: "机制扩展",
        title: "从带货红包，延伸到更多内容消费与交易场景。",
        body: "当红包机制验证了互动价值后，它不再只服务带货动态，而是扩展到照片、影集、勋章等内容。设计关注点也从单次领取，逐步转向内容浏览、关系互动和交易转化。",
        points: ["照片红包：以轻内容承接好友互动", "影集红包：把领取动作带入连续内容消费", "勋章红包：结合身份与成就感强化参与", "带货红包：突出商品、利益点与转化路径，场景 GMV 提升 30.2%"],
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
    label: "消息分层 / 优先级策略",
    period: "2024 — 2025",
    cover: "/assets/message-cover-20260806.png",
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
        eyebrow: "视觉梳理",
        title: "先收敛颜色、对齐和图标，再让信息优先级真正被看见。",
        body: "原页面颜色使用过多、模块对齐规则不统一，图标和红点也缺少一致标准。视觉优化不以装饰为目标，而是减少噪音，让角色、任务、状态和优先级拥有稳定的表达方式。",
        points: ["收敛颜色数量，避免多个模块争夺注意力", "统一列表、图标、文字与红点的对齐规则", "提高图标精致度与同一性", "用层级和留白区分信息，而不是持续增加颜色"],
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
    title: "AI设计",
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
    cover: "/assets/posters/emoji-last-frame.webp",
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
        image: "/assets/posters/emoji-last-frame.webp",
      },
      {
        eyebrow: "实际应用",
        title: "同一套情绪语言，在不同产品关系中持续复用。",
        body: "Emoji 已应用于商家聊天、拼小圈互动、好友聊天、商品评价体系、多多视频、行家社区和拼多多内部工作沟通软件。",
        points: ["拼小圈评论", "短视频互动", "评价与行家精选", "商家与好友聊天", "内部工作沟通"],
        image: "/assets/images/其他.webp",
      },
      {
        eyebrow: "活动视觉",
        title: "用春节摇骰子，把线下好友互动与拉新奖励连接起来。",
        body: "围绕春节聚会场景设计摇骰子活动，让用户与身边好友共同参与，并通过红包奖励承接拉新与活跃目标。视觉需要同时具备节日氛围、游戏感和清晰的参与反馈。",
        points: ["以线下好友聚会作为自然触发场景", "通过摇骰子建立即时互动与结果期待", "用红包奖励承接新用户获取与活跃"],
        image: "/assets/images/其他.webp",
      },
      {
        eyebrow: "图标设计",
        title: "把工作日里的重复片段，整理成统一的生活图标语言。",
        body: "图标围绕睡觉、早起、通勤、工作、吃饭和下班等日常状态展开，在保持识别效率的同时，用一致的轮廓、体积和节奏建立系列感。",
        points: ["睡觉 / 起床 / 闹钟", "早餐 / 午餐 / 晚餐", "步行 / 骑车 / 通勤", "上班 / 下班 / 工作状态"],
        image: "/assets/images/其他.webp",
      },
      {
        eyebrow: "系列插画",
        title: "用“一周有八天”的想象，表达设计工作的日常情绪。",
        body: "系列插画使用统一构图和角色语言，把工作中的疲惫、专注、自我调侃与继续前进组织为连续叙事，在轻松表达中保持完整的视觉识别。",
        points: ["统一构图保证系列辨识度", "用角色动作表达不同工作状态", "在轻松语气中保留视觉节奏与叙事连续性"],
        image: "/assets/images/其他.webp",
      },
    ],
  },
];

const projects = projectDrafts.map((project) => ({
  ...project,
  ...figmaProjectContent[project.id],
}));

const videoCoverProjectIds = new Set(["temu", "redpacket", "ai", "emoji"]);

const aboutIntro = "6 年拼多多 C 端产品设计经验，覆盖跨境电商、社交增长与短视频业务；擅长复杂业务体验、增长转化与设计系统建设。";

const aboutDetailIntro = "C 端与增长体验，擅长流程梳理、规则表达与设计规范建设，让复杂业务更清晰、更易执行。持续探索 AI 设计和 AI 产品实践。";

const aboutSkills = ["UI / 交互设计", "设计系统", "产品思维", "增长设计", "AI 设计", "Vibe Coding"];

const experience = [
  ["多多视频", "高级 UI/UX 设计师", "2024 — 2025"],
  ["TEMU", "C 端售后 UI 负责人", "2022 — 2024"],
  ["拼小圈", "UI/UX 设计师", "2019 — 2022"],
];

const aboutExperience = [
  {
    company: "多多视频",
    role: "高级 UI/UX 设计师",
    period: "2024 — 2025",
    summary: "团队提效设计规范搭建；自驱消息页体验优化，改版上线后全站活跃时长提升 0.35%，短剧场景总时长提升 0.78%。",
  },
  {
    company: "TEMU",
    role: "C 端售后 UI 负责人",
    period: "2022 — 2024",
    summary: "推动并参与 TEMU 设计团队规范搭建，0→1 参与 C 端售后 UI 体验建设，协同 3 位 UI 设计师，团队协作效率提升约 20%。",
  },
  {
    company: "拼小圈",
    role: "UI/UX 设计师",
    period: "2019 — 2022",
    summary: "参与产品从 0 到 1 建设，主导带货红包和社交互动机制设计，推动红包场景互动与留存增长。",
  },
];

const detailIds = new Set(["about", ...projects.map((project) => project.id)]);
const videoPlaybackTimes = new Map();
let activeViewTransition = null;

function rememberVideoPosition(video) {
  const playbackKey = video?.dataset.playbackKey;
  if (!playbackKey || !Number.isFinite(video.currentTime)) return;
  videoPlaybackTimes.set(playbackKey, video.currentTime);
}

function prepareAboutOpen(source) {
  const sourceCard = document.querySelector(`[data-project-id="about-${source}"]`);
  if (!sourceCard || typeof document.startViewTransition !== "function") return null;

  const rect = sourceCard.getBoundingClientRect();
  const snapshot = sourceCard.cloneNode(true);
  snapshot.removeAttribute("data-project-id");
  snapshot.removeAttribute("aria-label");
  snapshot.querySelector(".about-card-surface")?.remove();
  snapshot.querySelector(".intro-open-icon")?.remove();
  snapshot.classList.add("about-open-snapshot");
  snapshot.style.left = `${rect.left}px`;
  snapshot.style.top = `${rect.top}px`;
  snapshot.style.width = `${rect.width}px`;
  snapshot.style.height = `${rect.height}px`;
  snapshot.style.viewTransitionName = "project-content-about";
  document.body.append(snapshot);
  snapshot.getBoundingClientRect();
  return snapshot;
}

async function runViewTransition(update, type = "page") {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  if (typeof document.startViewTransition !== "function" || reduceMotion) {
    flushSync(update);
    return;
  }

  if (activeViewTransition) {
    activeViewTransition.skipTransition();
    await activeViewTransition.finished.catch(() => {});
  }

  root.dataset.viewTransition = type;
  let updateCommitted = false;

  try {
    const transition = document.startViewTransition(() => {
      updateCommitted = true;
      flushSync(update);
    });
    activeViewTransition = transition;
    await transition.finished.catch(() => {});
  } catch (_) {
    // A fast second click can race the browser's View Transition teardown.
    // Keep navigation reliable even when the native transition cannot start.
    if (!updateCommitted) flushSync(update);
  } finally {
    activeViewTransition = null;
    if (root.dataset.viewTransition === type) delete root.dataset.viewTransition;
  }
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
    ready: new Promise((resolve) => window.requestAnimationFrame(resolve)),
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

function ZoomIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4M10.5 8v5M8 10.5h5" /></svg>;
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

const detailImageAspectRatios = {
  "/assets/temu-20260806-06.png": "2792 / 2160",
  "/assets/redpacket-20260806-05.png": "3202 / 2160",
  "/assets/redpacket-20260806-06.png": "2300 / 2160",
  "/assets/redpacket-20260806-13.png": "3352 / 2160",
  "/assets/message-20260804-01-problem.png": "1920 / 2160",
  "/assets/message-20260804-02-data.png": "1920 / 1666",
  "/assets/message-20260804-03-priority.png": "1920 / 1256",
  "/assets/message-20260804-04-after.png": "1920 / 2160",
  "/assets/message-20260804-05-interaction.png": "1920 / 2160",
  "/assets/message-20260806-05-interaction.png": "1920 / 2160",
  "/assets/message-20260806-07-outcome.png": "3416 / 1312",
  "/assets/system-20260804-01.png": "2022 / 1748",
  "/assets/system-20260804-02.png": "2468 / 2988",
  "/assets/system-20260804-03.png": "3360 / 838",
  "/assets/emoji-detail-58-v3.png": "3484 / 3352",
  "/assets/ai-detail/home.png": "1170 / 2532",
  "/assets/ai-detail/studio.png": "1170 / 2532",
  "/assets/ai-detail/studio-color.png": "1170 / 2532",
  "/assets/ai-detail/studio-tire.png": "1170 / 2532",
  "/assets/ai-detail/community-loading.png": "1170 / 2532",
  "/assets/ai-detail/vehicle-loading.png": "1170 / 2532",
};

function getDetailImageAspectRatio(src) {
  return detailImageAspectRatios[src] || "16 / 9";
}

function DecodedImage({ src, alt = "", className = "", wrapperClassName = "", loading = "lazy", fetchPriority, aspectRatio }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    setStatus("loading");
  }, [src]);

  async function revealImage(event) {
    const image = event.currentTarget;
    try {
      await image.decode?.();
    } catch {
      // A completed image can still be displayed when decode() is unavailable or rejects.
    }
    setStatus("ready");
  }

  return (
    <span
      className={`decoded-image is-${status}${wrapperClassName ? ` ${wrapperClassName}` : ""}`}
      style={aspectRatio ? { "--media-aspect-ratio": aspectRatio } : undefined}
    >
      <span className="media-shimmer" aria-hidden="true" />
      <img
        className={className}
        src={assetUrl(src)}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onLoad={revealImage}
        onError={() => setStatus("error")}
      />
    </span>
  );
}

function DownloadLink({ href, fileName, className = "", children, ariaLabel }) {
  const [status, setStatus] = useState("idle");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const feedbackTimerRef = useRef(null);
  const statusTimerRef = useRef(null);

  useEffect(() => () => {
    window.clearTimeout(feedbackTimerRef.current);
    window.clearTimeout(statusTimerRef.current);
  }, []);

  function showFeedbackFor(duration = 3000) {
    window.clearTimeout(feedbackTimerRef.current);
    setFeedbackVisible(true);
    feedbackTimerRef.current = window.setTimeout(() => setFeedbackVisible(false), duration);
  }

  async function handleDownload(event) {
    event.preventDefault();
    if (status === "loading") {
      showFeedbackFor();
      return;
    }
    setStatus("loading");
    showFeedbackFor();

    try {
      const response = await fetch(assetUrl(href));
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setStatus("success");
      showFeedbackFor(2600);
    } catch {
      setStatus("error");
      showFeedbackFor(2600);
    }

    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatus("idle"), 2600);
  }

  const feedback = status === "loading"
    ? "简历/作品集资源正在加载中，请稍后再试"
    : status === "success"
      ? "下载已开始"
      : status === "error"
        ? "文件加载失败，请稍后重试"
        : "";

  return (
    <a
      className={className}
      href={assetUrl(href)}
      download={fileName}
      onClick={handleDownload}
      aria-label={ariaLabel}
      aria-busy={status === "loading"}
    >
      {children}
      {feedback && feedbackVisible ? <span className={`download-feedback is-${status}`} role="status">{feedback}</span> : null}
    </a>
  );
}

function VideoCover({ src, poster, className, playbackKey }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [posterReady, setPosterReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const canLoadVideo = shouldLoad && (posterReady || posterFailed);

  const updateStarted = (nextValue) => {
    setHasStarted(nextValue);
  };

  const revealRenderedFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof video.requestVideoFrameCallback === "function") {
      video.requestVideoFrameCallback(() => updateStarted(true));
      return;
    }

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      updateStarted(true);
    }
  };

  const restorePlaybackPosition = () => {
    const video = videoRef.current;
    const savedTime = videoPlaybackTimes.get(playbackKey);
    if (!video || !Number.isFinite(savedTime) || savedTime <= 0) return;
    const targetTime = Number.isFinite(video.duration) && video.duration > 0
      ? savedTime % video.duration
      : savedTime;
    if (Math.abs(video.currentTime - targetTime) > 0.08) video.currentTime = targetTime;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    if (!("IntersectionObserver" in window)) {
      setShouldLoad(true);
      setIsVisible(true);
      return undefined;
    }

    const preloadObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        preloadObserver.unobserve(container);
      }
    }, { rootMargin: "320px 0px" });

    const playbackObserver = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.12);
    }, { threshold: [0, 0.12] });

    preloadObserver.observe(container);
    playbackObserver.observe(container);

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setPosterReady(false);
    setHasStarted(false);
    setPosterFailed(false);
    setVideoFailed(false);
  }, [src, poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncPlayback = () => {
      if (motionPreference.matches) {
        video.pause();
      } else if (isVisible && !document.hidden) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    syncPlayback();
    document.addEventListener("visibilitychange", syncPlayback);
    motionPreference.addEventListener("change", syncPlayback);
    return () => {
      document.removeEventListener("visibilitychange", syncPlayback);
      motionPreference.removeEventListener("change", syncPlayback);
      rememberVideoPosition(video);
      video.pause();
    };
  }, [isVisible, canLoadVideo, src, playbackKey]);

  return (
    <div
      ref={containerRef}
      className={`video-cover${posterReady ? " has-poster" : ""}${hasStarted ? " has-started" : ""}${posterFailed && videoFailed ? " has-media-error" : ""}`}
      data-video-owner={playbackKey}
    >
      <img
        className="video-cover-poster"
        src={assetUrl(poster)}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={async (event) => {
          try {
            await event.currentTarget.decode?.();
          } catch {
            // The poster is still usable when decode() is unsupported.
          }
          setPosterReady(true);
          setPosterFailed(false);
        }}
        onError={() => {
          setPosterReady(false);
          setPosterFailed(true);
        }}
      />
      <span className="video-cover-shimmer" />
      {canLoadVideo && (
        <video
          ref={videoRef}
          className={className}
          src={assetUrl(src)}
          muted
          loop
          playsInline
          preload="auto"
          data-playback-key={playbackKey}
          onLoadedMetadata={restorePlaybackPosition}
          onLoadedData={() => {
            setVideoFailed(false);
            revealRenderedFrame();
          }}
          onCanPlay={revealRenderedFrame}
          onPlaying={revealRenderedFrame}
          onTimeUpdate={() => {
            rememberVideoPosition(videoRef.current);
            revealRenderedFrame();
          }}
          onPause={() => {
            rememberVideoPosition(videoRef.current);
          }}
          onError={() => {
            setVideoFailed(true);
            updateStarted(false);
          }}
        />
      )}
    </div>
  );
}

function ProjectCover({ projectId, sharedDestination = false }) {
  if (sharedDestination && videoCoverProjectIds.has(projectId)) {
    return (
      <div className={`cover-art cover-${projectId}`} aria-hidden="true">
        <div className="shared-video-slot" data-shared-video-slot={projectId} />
      </div>
    );
  }

  const covers = {
    temu: (
      <VideoCover
        className="cover-temu-video"
        src="/assets/videos/temu-aftersales.mp4?v=8"
        poster="/assets/posters/temu-aftersales-poster.webp"
        playbackKey="temu"
      />
    ),
    system: (
      <DecodedImage
        wrapperClassName="cover-static-media"
        className="cover-system-laptop"
        src="/assets/design-system-laptop.png"
        alt=""
        loading="lazy"
      />
    ),
    redpacket: (
      <VideoCover
        className="cover-redpacket-video"
        src="/assets/videos/redpacket.mp4?v=4"
        poster="/assets/posters/redpacket-first-frame.jpg?v=2"
        playbackKey="redpacket"
      />
    ),
    message: (
      <DecodedImage
        wrapperClassName="cover-static-media cover-message-media"
        className="cover-message-phones"
        src="/assets/message-cover-20260806.png"
        alt=""
        loading="lazy"
      />
    ),
    ai: (
      <VideoCover
        className="cover-ai-video"
        src="/assets/videos/ai-dream-car.mp4"
        poster="/assets/posters/ai-dream-car-fallback.png"
        playbackKey="ai"
      />
    ),
    emoji: (
      <VideoCover
        className="cover-emoji-video"
        src="/assets/videos/emoji-222.mp4"
        poster="/assets/posters/emoji-222-last-frame.png"
        playbackKey="emoji"
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
    <DownloadLink
      className={`card download-card reveal-card${wide ? " download-wide" : ""}`}
      href={href}
      fileName={fileName}
      data-project-id={`download-${type}`}
      ariaLabel={`下载${title}`}
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
    </DownloadLink>
  );
}

function getSectionImages(section) {
  return section.images || (section.image ? [section.image] : []);
}

const emojiCardImages = Array.from(
  { length: 15 },
  (_, index) => `/assets/emoji-cards/emoji-card-${String(index + 1).padStart(2, "0")}.png?v=20260802-2`,
);

function EmojiMarquee() {
  const rows = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 2, 6, 10, 14, 4, 8, 12, 1, 5]
      .map((index) => emojiCardImages[index]),
    [8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 0, 4, 9, 1, 13, 5, 10, 2, 14, 6, 11]
      .map((index) => emojiCardImages[index]),
  ];

  return (
    <div className="emoji-marquee" aria-hidden="true">
      {rows.map((cards, rowIndex) => (
        <div className={`emoji-marquee-row${rowIndex === 1 ? " is-reverse" : ""}`} key={rowIndex}>
          <div className="emoji-marquee-track">
            {[0, 1].map((copyIndex) => (
              <div className="emoji-marquee-group" aria-hidden={copyIndex === 1 ? "true" : undefined} key={copyIndex}>
                {cards.map((image, cardIndex) => (
                  <DecodedImage
                    wrapperClassName="emoji-marquee-card-shell"
                    className="emoji-marquee-card"
                    src={image}
                    alt=""
                    loading="lazy"
                    key={`${copyIndex}-${cardIndex}-${image}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Detail({ project, previousProject, nextProject, transitioning, onClose, onNavigate }) {
  const panelRef = useRef(null);
  const layerRef = useRef(null);
  const lightboxRef = useRef(null);
  const lightboxCloseRef = useRef(null);
  const lightboxImageRef = useRef(null);
  const lightboxDragRef = useRef(null);
  const lastImageTriggerRef = useRef(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [lightboxView, setLightboxView] = useState({ scale: 1, x: 0, y: 0 });
  const [isDraggingLightbox, setIsDraggingLightbox] = useState(false);
  const galleryItems = useMemo(() => project.sections.flatMap((section, sectionIndex) => (
    getSectionImages(section).map((image, imageIndex) => ({ ...section, image, sectionIndex, imageIndex }))
  )), [project.sections]);
  const activeSection = activeImageIndex === null ? null : galleryItems[activeImageIndex];

  useLayoutEffect(() => {
    if (!videoCoverProjectIds.has(project.id)) return undefined;

    const detailSlot = panelRef.current?.querySelector(`[data-shared-video-slot="${project.id}"]`);
    const videoCover = document.querySelector(`[data-video-owner="${project.id}"]`);
    if (!detailSlot || !videoCover) return undefined;

    detailSlot.appendChild(videoCover);

    return () => {
      const homeHost = document.querySelector(`[data-project-id="${project.id}"] .cover-art`);
      if (homeHost?.isConnected) homeHost.appendChild(videoCover);
    };
  }, [project.id]);

  useLayoutEffect(() => {
    layerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setShowBackTop(false);
    setActiveImageIndex(null);
    panelRef.current?.focus({ preventScroll: true });
  }, [project.id]);

  useEffect(() => {
    const lightbox = lightboxRef.current;
    if (!lightbox) return;

    setLightboxView({ scale: 1, x: 0, y: 0 });
    setIsDraggingLightbox(false);
    lightboxDragRef.current = null;

    if (activeImageIndex !== null && !lightbox.open) {
      lightbox.showModal();
      lightboxCloseRef.current?.focus({ preventScroll: true });
    } else if (activeImageIndex === null && lightbox.open) {
      lightbox.close();
    }
  }, [activeImageIndex]);

  function openLightbox(index, trigger) {
    lastImageTriggerRef.current = trigger;
    setActiveImageIndex(index);
  }

  function closeLightbox() {
    setActiveImageIndex(null);
    window.requestAnimationFrame(() => lastImageTriggerRef.current?.focus({ preventScroll: true }));
  }

  function navigateLightbox(direction) {
    setActiveImageIndex((current) => {
      if (current === null) return current;
      return Math.min(Math.max(current + direction, 0), galleryItems.length - 1);
    });
  }

  function clampLightboxPan(x, y, scale) {
    const image = lightboxImageRef.current;
    if (!image || scale <= 1) return { x: 0, y: 0 };
    const maxX = image.clientWidth * (scale - 1) / 2;
    const maxY = image.clientHeight * (scale - 1) / 2;
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    };
  }

  function handleLightboxWheel(event) {
    event.preventDefault();
    const image = lightboxImageRef.current;
    if (!image) return;
    const rect = image.getBoundingClientRect();

    setLightboxView((current) => {
      const nextScale = Math.min(4, Math.max(1, current.scale * Math.exp(-event.deltaY * 0.0015)));
      if (Math.abs(nextScale - current.scale) < 0.001) return current;
      if (nextScale === 1) return { scale: 1, x: 0, y: 0 };

      const baseCenterX = rect.left + rect.width / 2 - current.x;
      const baseCenterY = rect.top + rect.height / 2 - current.y;
      const localX = (event.clientX - baseCenterX - current.x) / current.scale;
      const localY = (event.clientY - baseCenterY - current.y) / current.scale;
      const pan = clampLightboxPan(
        event.clientX - baseCenterX - nextScale * localX,
        event.clientY - baseCenterY - nextScale * localY,
        nextScale,
      );

      return { scale: nextScale, ...pan };
    });
  }

  function startLightboxDrag(event) {
    if (lightboxView.scale <= 1) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    lightboxDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: lightboxView.x,
      originY: lightboxView.y,
    };
    setIsDraggingLightbox(true);
  }

  function moveLightboxDrag(event) {
    const drag = lightboxDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    const pan = clampLightboxPan(
      drag.originX + event.clientX - drag.startX,
      drag.originY + event.clientY - drag.startY,
      lightboxView.scale,
    );
    setLightboxView((current) => ({ ...current, ...pan }));
  }

  function endLightboxDrag(event) {
    const drag = lightboxDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    lightboxDragRef.current = null;
    setIsDraggingLightbox(false);
  }

  function handleLightboxKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigateLightbox(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      navigateLightbox(1);
    }
  }

  return (
    <div
      className={`detail-layer${transitioning ? " is-transitioning" : ""}`}
      ref={layerRef}
      onScroll={(event) => setShowBackTop(event.currentTarget.scrollTop > Math.max(520, window.innerHeight * 0.65))}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.detailTitle || project.title}项目详情`}
    >
      <div
        className="detail-backdrop"
        style={{ viewTransitionName: `project-shell-${project.id}` }}
        aria-hidden="true"
      />
      <button className="detail-close" onClick={onClose} aria-label="关闭项目详情"><CloseIcon /></button>
      <button className={`detail-back-top${showBackTop ? " is-visible" : ""}`} onClick={() => layerRef.current?.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回详情页顶部" tabIndex={showBackTop ? 0 : -1}>↑</button>
      <article className={`detail-page tone-${project.tone}`} data-project-id={project.id} tabIndex="-1" ref={panelRef}>
        <header
          className={`detail-hero tone-${project.tone}${project.id === "message" ? " detail-hero-message" : ""}${videoCoverProjectIds.has(project.id) ? ` has-video-cover video-ratio-${project.id}` : ""}`}
          style={{ viewTransitionName: `project-cover-${project.id}` }}
        >
          <ProjectCover projectId={project.id} sharedDestination />
        </header>
        <section className="detail-intro">
          <span className="detail-index">{project.period} · {project.detailLabel || project.label}</span>
          <h1>{project.detailTitle || project.title}</h1>
          <p className="detail-lead">{project.summary}</p>
          <div className="detail-meta">
            <div><span>我的角色</span><strong>{project.role}</strong></div>
            <div><span>项目结果</span><strong>{project.outcome}</strong></div>
          </div>
          {project.stats.length ? (
            <div className="stat-row">
              {project.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}
            </div>
          ) : null}
        </section>
        <div className="detail-sections">
          {project.sections.map((section, index) => {
            const sectionImages = getSectionImages(section);
            return (
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
                  {section.link ? (
                    <a className="case-link" href={section.link.href} target="_blank" rel="noreferrer">
                      {section.link.label}<ArrowIcon />
                    </a>
                  ) : null}
                </div>
                {section.emojiMarquee ? <EmojiMarquee /> : null}
                {sectionImages.length ? (
                  <div className={`case-images${section.imageLayout ? ` is-${section.imageLayout}` : ""}`}>
                    {sectionImages.map((image, imageIndex) => {
                      const galleryIndex = galleryItems.findIndex((item) => item.sectionIndex === index && item.imageIndex === imageIndex);
                      return (
                        <figure key={image}>
                          <button
                            className="case-image-button"
                            type="button"
                            onClick={(event) => openLightbox(galleryIndex, event.currentTarget)}
                            aria-label={`放大查看：${section.title}${sectionImages.length > 1 ? `（${imageIndex + 1}）` : ""}`}
                          >
                            <DecodedImage
                              wrapperClassName="case-image-loader"
                              src={image}
                              alt={`${project.detailTitle || project.title}：${section.eyebrow}`}
                              loading="lazy"
                              aspectRatio={getDetailImageAspectRatio(image)}
                            />
                            {section.imageLabel && imageIndex === 0 ? <span className="case-image-label">{section.imageLabel}</span> : null}
                            <span className="case-image-zoom" aria-hidden="true"><ZoomIcon /></span>
                          </button>
                        </figure>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
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
      <dialog
        className="image-lightbox"
        ref={lightboxRef}
        aria-label={activeSection ? `大图查看：${activeSection.title}` : "大图查看"}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeLightbox();
        }}
        onKeyDown={handleLightboxKeyDown}
      >
        {activeSection ? (
          <div className={`image-lightbox-content${lightboxView.scale > 1 ? " is-zoomed" : ""}${isDraggingLightbox ? " is-dragging" : ""}`}>
            <button className="image-lightbox-close" ref={lightboxCloseRef} type="button" onClick={closeLightbox} aria-label="关闭大图"><CloseIcon /></button>
            <img
              ref={lightboxImageRef}
              src={assetUrl(activeSection.image)}
              alt={`${project.title}：${activeSection.eyebrow}`}
              draggable={false}
              onWheel={handleLightboxWheel}
              onPointerDown={startLightboxDrag}
              onPointerMove={moveLightboxDrag}
              onPointerUp={endLightboxDrag}
              onPointerCancel={endLightboxDrag}
              onDoubleClick={() => setLightboxView({ scale: 1, x: 0, y: 0 })}
              style={{ transform: `translate3d(${lightboxView.x}px, ${lightboxView.y}px, 0) scale(${lightboxView.scale})` }}
            />
            <button
              className="image-lightbox-nav is-previous"
              type="button"
              onClick={() => navigateLightbox(-1)}
              disabled={activeImageIndex === 0}
              aria-label="查看上一张图片"
            >
              <NavArrowIcon direction="previous" />
            </button>
            <button
              className="image-lightbox-nav is-next"
              type="button"
              onClick={() => navigateLightbox(1)}
              disabled={activeImageIndex === galleryItems.length - 1}
              aria-label="查看下一张图片"
            >
              <NavArrowIcon />
            </button>
            <div className="image-lightbox-caption" aria-live="polite">
              <span>{String(activeImageIndex + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}</span>
              <strong>{activeSection.eyebrow}</strong>
              <span>{Math.round(lightboxView.scale * 100)}%</span>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}

function AboutDetail({ transitioning, source, onClose }) {
  const panelRef = useRef(null);
  const layerRef = useRef(null);
  const [showBackTop, setShowBackTop] = useState(false);
  const [copiedContact, setCopiedContact] = useState(null);

  useLayoutEffect(() => {
    layerRef.current?.scrollTo({ top: 0, behavior: "instant" });
    panelRef.current?.focus({ preventScroll: true });
  }, []);

  async function handleContactCopy(label, value) {
    await copyText(value);
    setCopiedContact(label);
    window.setTimeout(() => setCopiedContact((current) => current === label ? null : current), 1600);
  }

  return (
    <div
      className={`detail-layer about-detail-layer${transitioning ? " is-transitioning" : ""}`}
      ref={layerRef}
      onScroll={(event) => setShowBackTop(event.currentTarget.scrollTop > Math.max(520, window.innerHeight * 0.65))}
      role="dialog"
      aria-modal="true"
      aria-label="关于张文"
    >
      <div className="detail-backdrop" style={{ viewTransitionName: "project-shell-about" }} aria-hidden="true" />
      <button className="detail-close" onClick={onClose} aria-label="关闭关于我"><CloseIcon /></button>
      <button className={`detail-back-top${showBackTop ? " is-visible" : ""}`} onClick={() => layerRef.current?.scrollTo({ top: 0, behavior: "smooth" })} aria-label="返回关于页顶部" tabIndex={showBackTop ? 0 : -1}>↑</button>

      <article className="about-detail-page" tabIndex="-1" ref={panelRef}>
        <div className="about-detail-bento">
          <article
            className={`card intro-card about-profile-card${source === "intro" ? " about-transition-target" : ""}`}
            style={{ viewTransitionName: transitioning && source === "intro" ? "project-content-about" : "none" }}
          >
            <DecodedImage wrapperClassName="avatar-loader" className="avatar" src="/assets/avatar.webp" alt="张文头像" loading="eager" fetchPriority="high" />
            <div>
              <span className="card-kicker">UI/UX 设计师</span>
              <h1>你好，我是张文👋</h1>
              <p>{aboutDetailIntro}</p>
              <div className="about-profile-meta" aria-label="个人信息"><span>1996 年出生</span></div>
            </div>
          </article>

          <article className="card about-education-card about-detail-card">
            <span className="card-kicker">教育背景</span>
            <div>
              <h2>西安交通大学</h2>
              <p>视觉传达设计 · 本科</p>
            </div>
          </article>

          <article
            className={`card experience-card about-detail-experience${source === "experience" ? " about-transition-target" : ""}`}
            style={{ viewTransitionName: transitioning && source === "experience" ? "project-content-about" : "none" }}
          >
            <div className="section-heading"><span>工作经历</span><strong>6 年</strong></div>
            <div className="about-experience-list">
              {aboutExperience.map(({ company, role, period, summary }) => (
                <div className="about-experience-row" key={company}>
                  <div className="about-experience-meta"><strong>{company}</strong><time>{period}</time></div>
                  <div><strong>{role}</strong><p>{summary}</p></div>
                </div>
              ))}
            </div>
          </article>

          <article
            className={`card skill-card about-detail-skills${source === "skills" ? " about-transition-target" : ""}`}
            style={{ viewTransitionName: transitioning && source === "skills" ? "project-content-about" : "none" }}
          >
            <span className="card-kicker">核心能力</span>
            <div className="skill-cloud">{aboutSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
          </article>

          <article className="card about-workflow-card about-detail-card">
            <span className="card-kicker">工作方式</span>
            <div className="about-workflow-list">
              <div><span>01</span><strong>需求理解</strong><p>梳理业务目标、用户场景与问题约束。</p></div>
              <div><span>02</span><strong>方案判断</strong><p>明确优先级、交互路径与视觉表达。</p></div>
              <div><span>03</span><strong>设计交付</strong><p>完成方案、规范、评审与开发对齐。</p></div>
              <div><span>04</span><strong>验证迭代</strong><p>结合数据、走查与反馈持续优化。</p></div>
            </div>
          </article>

          <article className="card about-performance-card about-detail-card">
            <span className="card-kicker">绩效记录</span>
            <div><strong>5 次优评</strong><p>参与 9 次绩效评审</p></div>
          </article>

          <article className="card about-tools-card about-detail-card">
            <span className="card-kicker">设计与 AI 工具</span>
            <div className="skill-cloud"><span>Figma</span><span>Sketch</span><span>ChatGPT</span><span>Codex</span></div>
          </article>

          <section className="card about-detail-contact-card about-detail-card">
            <span className="card-kicker about-contact-kicker">联系方式</span>
            <div className="about-contact-details">
              {[
                ["微信", "KISS_WIN", null],
                ["电话", "13772150131", "tel:13772150131"],
                ["邮箱", "banqiu1230@gmail.com", "mailto:banqiu1230@gmail.com"],
              ].map(([label, value, href]) => (
                <div key={label}>
                  <span>{label}</span>
                  {href ? <a href={href}>{value}</a> : <strong>{value}</strong>}
                  <button
                    type="button"
                    className={copiedContact === label ? "is-copied" : ""}
                    onClick={() => handleContactCopy(label, value)}
                    aria-label={copiedContact === label ? `${label}已复制` : `复制${label}`}
                    title={copiedContact === label ? "已复制" : `复制${label}`}
                  >
                    {copiedContact === label ? <CheckIcon /> : <CopyIcon />}
                    <span>{copiedContact === label ? "已复制" : "复制"}</span>
                  </button>
                </div>
              ))}
            </div>
          </section>

          <article className="card about-downloads-card about-detail-card">
            <span className="card-kicker">下载资料</span>
            <div className="about-download-list">
              <DownloadLink href="/assets/wen-zhang-resume.pdf" fileName="张文_UIUX_简历.pdf" ariaLabel="下载个人简历">
                <span><small>PDF · 347 KB</small><strong>个人简历</strong></span>
                <DownloadIcon />
              </DownloadLink>
              <DownloadLink href="/assets/wen-zhang-portfolio.pdf" fileName="张文_UIUX_作品集.pdf" ariaLabel="下载作品集">
                <span><small>PDF · 17 MB</small><strong>作品集</strong></span>
                <DownloadIcon />
              </DownloadLink>
            </div>
          </article>
        </div>
      </article>
    </div>
  );
}

export function App() {
  const initialHash = window.location.hash.match(/^#project\/(.+)$/)?.[1];
  const [filter, setFilter] = useState("all");
  const [activeId, setActiveId] = useState(detailIds.has(initialHash) ? initialHash : null);
  const [transitioningId, setTransitioningId] = useState(null);
  const [aboutSource, setAboutSource] = useState("intro");
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || "light");
  const [contactOpen, setContactOpen] = useState(false);
  const [showBackTop, setShowBackTop] = useState(false);
  const transitionRun = useRef(0);
  const scrollPosition = useRef(0);

  function finishTransition(promise, runId) {
    return promise.finally(() => {
      if (transitionRun.current === runId) setTransitioningId(null);
    });
  }
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
      const nextId = detailIds.has(id) ? id : null;
      if (nextId && !activeId) scrollPosition.current = window.scrollY;
      const transitionId = activeId || nextId;
      const closeSnapshot = !nextId && activeId ? prepareDetailClose(activeId) : null;
      if (closeSnapshot) await closeSnapshot.ready;
      if (transitionId) flushSync(() => setTransitioningId(transitionId));
      const runId = ++transitionRun.current;
      finishTransition(runViewTransition(() => {
        closeSnapshot?.node.remove();
        setActiveId(nextId);
      }, nextId ? "detail-open" : "detail-close"), runId);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape" && activeId && !document.querySelector(".image-lightbox[open]")) closeProject();
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

  function openProject(id, source = null) {
    scrollPosition.current = window.scrollY;
    const runId = ++transitionRun.current;
    const aboutSnapshot = id === "about" && source ? prepareAboutOpen(source) : null;
    const projectCard = id !== "about" ? document.querySelector(`[data-project-id="${id}"]`) : null;
    rememberVideoPosition(projectCard?.querySelector("video"));
    flushSync(() => {
      setTransitioningId(id);
      if (id === "about" && source) setAboutSource(source);
    });

    // Commit the source card's shared-element names before asking the browser
    // to capture the old frame. This prevents an in-flight media update or a
    // stale transition callback from intermittently dropping the source.
    const sourceCardId = id === "about" && source ? `about-${source}` : id;
    const sourceCard = document.querySelector(`[data-project-id="${sourceCardId}"]`);
    sourceCard?.getBoundingClientRect();

    window.history.pushState({ project: id }, "", `#project/${id}`);
    finishTransition(runViewTransition(() => {
      aboutSnapshot?.remove();
      setActiveId(id);
    }, "detail-open"), runId);
  }

  async function closeProject() {
    const closingId = activeId;
    rememberVideoPosition(document.querySelector(".detail-layer video"));
    const runId = ++transitionRun.current;
    const closeSnapshot = prepareDetailClose(closingId);
    if (closeSnapshot) await closeSnapshot.ready;
    flushSync(() => setTransitioningId(closingId));
    if (window.location.hash.startsWith("#project/")) {
      window.history.replaceState({}, "", window.location.pathname + window.location.search);
    }
    finishTransition(runViewTransition(() => {
      closeSnapshot?.node.remove();
      setActiveId(null);
    }, "detail-close"), runId);
  }

  function navigateProject(id) {
    if (id === activeId) return;
    rememberVideoPosition(document.querySelector(".detail-layer video"));
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
        <a
          className="mark"
          href="#top"
          aria-label="Win 首页"
          onClick={(event) => {
            event.preventDefault();
            window.history.replaceState(null, "", "#top");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Win
        </a>
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
              <button
                className={`card intro-card intro-card-link reveal-card${transitioningId === "about" && activeId !== "about" && aboutSource === "intro" ? " is-transitioning" : ""}`}
                type="button"
                onClick={() => openProject("about", "intro")}
                data-project-id="about-intro"
                aria-label="打开关于张文的详情"
              >
                <span
                  className="about-card-surface"
                  style={{ viewTransitionName: transitioningId === "about" && activeId !== "about" && aboutSource === "intro" ? "project-shell-about" : "none" }}
                  aria-hidden="true"
                />
                <DecodedImage wrapperClassName="avatar-loader" className="avatar" src="/assets/avatar.webp" alt="张文头像" loading="eager" fetchPriority="high" />
                <div><span className="card-kicker">UI/UX 设计师</span><h1>你好，我是张文👋</h1><p>{aboutIntro}</p></div>
                <span className="intro-open-icon" aria-hidden="true"><ArrowIcon /></span>
              </button>
              <button
                className={`card theme-card reveal-card${theme === "dark" ? " is-dark" : ""}`}
                onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
                aria-label={`切换到${theme === "dark" ? "浅色" : "深色"}模式`}
                aria-pressed={theme === "dark"}
                data-tooltip={`切换到${theme === "dark" ? "浅色" : "深色"}`}
              >
                <span className="theme-preview" aria-hidden="true" />
              </button>
              <button
                className={`card experience-card about-summary-card reveal-card${transitioningId === "about" && activeId !== "about" && aboutSource === "experience" ? " is-transitioning" : ""}`}
                type="button"
                onClick={() => openProject("about", "experience")}
                data-project-id="about-experience"
                aria-label="打开工作经历详情"
              >
                <span
                  className="about-card-surface"
                  style={{ viewTransitionName: transitioningId === "about" && activeId !== "about" && aboutSource === "experience" ? "project-shell-about" : "none" }}
                  aria-hidden="true"
                />
                <div className="section-heading"><span>工作经历</span><strong>6 年</strong></div>
                {experience.map(([company, role, period]) => <div className="experience-row" key={company}><strong>{company}</strong><span>{role}</span><time>{period}</time></div>)}
                <span className="intro-open-icon" aria-hidden="true"><ArrowIcon /></span>
              </button>
              <button
                className={`card skill-card about-summary-card reveal-card${transitioningId === "about" && activeId !== "about" && aboutSource === "skills" ? " is-transitioning" : ""}`}
                type="button"
                onClick={() => openProject("about", "skills")}
                data-project-id="about-skills"
                aria-label="打开核心能力详情"
              >
                <span
                  className="about-card-surface"
                  style={{ viewTransitionName: transitioningId === "about" && activeId !== "about" && aboutSource === "skills" ? "project-shell-about" : "none" }}
                  aria-hidden="true"
                />
                <span className="card-kicker">核心能力</span>
                <div className="skill-cloud">{aboutSkills.map((skill) => <span key={skill}>{skill}</span>)}</div>
                <span className="intro-open-icon" aria-hidden="true"><ArrowIcon /></span>
              </button>
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

          {(filter === "all" || filter === "about") && (
            <>
              <button className="card contact-card reveal-card" onClick={() => setContactOpen(true)} aria-label="打开联系方式" data-tooltip="联系我">
                <span className="contact-symbol"><ContactIcon /></span>
              </button>
              <article className="card philosophy-card reveal-card">
                <span className="card-kicker">设计方向</span>
                <blockquote>在复杂业务里，建立清晰、可信的体验秩序。</blockquote>
              </article>
            </>
          )}

          {(filter === "all" || filter === "about" || filter === "resume") && (
            <>
              <article className="card about-downloads-card about-detail-card home-downloads-card reveal-card">
                <span className="card-kicker">下载资料</span>
                <div className="about-download-list">
                  <DownloadLink href="/assets/wen-zhang-resume.pdf" fileName="张文_UIUX_简历.pdf" ariaLabel="下载个人简历">
                    <span><small>PDF · 347 KB</small><strong>个人简历</strong></span>
                    <DownloadIcon />
                  </DownloadLink>
                  <DownloadLink href="/assets/wen-zhang-portfolio.pdf" fileName="张文_UIUX_作品集.pdf" ariaLabel="下载作品集">
                    <span><small>PDF · 17 MB</small><strong>作品集</strong></span>
                    <DownloadIcon />
                  </DownloadLink>
                </div>
              </article>
              <article className="card closing-card closing-with-downloads reveal-card">
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
      {activeId === "about" && (
        <AboutDetail
          transitioning={transitioningId === "about"}
          source={aboutSource}
          onClose={closeProject}
        />
      )}
      {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
    </>
  );
}
