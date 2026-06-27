/**
 * 钻石田径图鉴 — 田径项目数据
 *
 * ⚠️ 声明：项目描述为科普性质，技术细节来自公开田径教学资料。
 */

import type { TrackEvent } from '../../domain/athletics/types';

export const trackEvents: TrackEvent[] = [
  {
    id: '100m',
    name: '100 米',
    englishName: '100 Metres',
    category: 'sprints',
    gender: 'both',
    description:
      '100 米是田径最受关注的"飞人大战"，是纯粹速度的比拼。从起跑到冲线，运动员需要在 10 秒左右（男子）/ 11 秒以内（女子）完成比赛。它考验运动员的起跑反应、加速能力、最大速度和维持速度的能力。',
    keyTechniques: [
      '起跑反应：听到枪声到离开起跑器的反应时间（通常 0.1-0.15 秒）',
      '加速阶段（0-30m）：身体前倾，低姿驱动，逐步提高步频和步幅',
      '途中跑（30-80m）：达到最大速度，保持高重心、高步频',
      '冲刺阶段（80-100m）：保持放松，避免僵硬，维持速度到终点',
    ],
    watchingPoints: [
      '谁在 30 米处领先？起跑好的选手会建立早期优势',
      '谁在 50-60 米达到最高速？这是决定胜负的关键段',
      '最后 20 米是否有人掉速？体能分配很重要',
      '冲线瞬间——有时差距仅百分之几秒',
    ],
    commonTerms: [
      { term: '起跑反应时', explanation: '从枪响到离开起跑器的时间，低于 0.1 秒即判抢跑' },
      { term: '步频', explanation: '单位时间内的步数，短跑选手步频通常在 4.5-5 步/秒' },
      { term: '步幅', explanation: '每一步的长度，顶尖选手可达 2.5 米以上' },
      { term: '风速', explanation: '顺风超过 2.0m/s 的成绩不被承认为纪录' },
      { term: 'PB/SB', explanation: '个人最好成绩 / 赛季最好成绩' },
    ],
    representativeAthleteIds: [
      'noah-lyles',
      'fred-kerley',
      'sha-carri-richardson',
      'shelly-ann-fraser-pryce',
    ],
    diamondLeagueEvent: true,
  },
  {
    id: '200m',
    name: '200 米',
    englishName: '200 Metres',
    category: 'sprints',
    gender: 'both',
    description:
      '200 米结合了速度与弯道技术。运动员需要在弯道建立节奏，然后在直道全力冲刺。这条"半圈"的距离让比赛充满了战术和技术的变化。优秀的 200 米选手往往也是出色的 100 米选手。',
    keyTechniques: [
      '弯道起跑：起跑器斜放，利用倾斜角度快速进入弯道',
      '弯道跑（0-120m）：身体向内倾斜，保持平衡和速度',
      '出弯加速（120-150m）：从弯道进入直道时顺势加速',
      '直道冲刺（150-200m）：全力维持最高速度',
    ],
    watchingPoints: [
      '弯道阶段谁领先？好的弯道选手能在这里建立优势',
      '出弯时谁处于有利位置？出弯位置往往决定最终名次',
      '最后 50 米的冲刺——200m 的后程往往有人加速有人掉速',
      '对比同一选手的 100m 和 200m 成绩，200m 成绩通常略低于 100m×2',
    ],
    commonTerms: [
      { term: '弯道优势', explanation: '在弯道上领先意味着出弯后占据了最有利的直道位置' },
      { term: '出弯加速', explanation: '从弯道过渡到直道时，利用离心力释放顺势加速' },
    ],
    representativeAthleteIds: ['noah-lyles', 'letsile-tebogo', 'erriyon-knighton'],
    diamondLeagueEvent: true,
  },
  {
    id: '400m',
    name: '400 米',
    englishName: '400 Metres',
    category: 'sprints',
    gender: 'both',
    description:
      '400 米是"长距离短跑"，也被称为最痛苦的项目之一。运动员需要在一圈跑道上全力冲刺，但又要合理分配体能。最后 100 米往往是"乳酸地狱"——双腿燃烧般的痛苦中咬牙坚持。',
    keyTechniques: [
      '起跑（0-50m）：快速加速，但不过度——需要保留体能',
      '放松跑（50-250m）：保持高速但不透支，用大步伐和好节奏"巡航"',
      '调整阶段（250-350m）：乳酸开始堆积，需要保持技术',
      '全力冲刺（350-400m）：榨干最后一丝能量',
    ],
    watchingPoints: [
      '第一个 200 米的分段成绩——起跑太快往往导致后程崩溃',
      '250-300 米是"疼痛区"，看谁在这里开始掉速',
      '最后 100 米谁能维持姿态——动作变形意味着速度会大幅下降',
    ],
    commonTerms: [
      { term: '乳酸', explanation: '无氧代谢产生的物质，导致肌肉酸痛和疲劳感' },
      { term: '分段配速', explanation: '每 100m 或 200m 的用时，反映体能分配策略' },
      { term: '后程掉速', explanation: '最后阶段速度明显下降，是 400m 选手最需要克服的问题' },
    ],
    representativeAthleteIds: ['fred-kerley'],
    diamondLeagueEvent: true,
  },
  {
    id: '110mH',
    name: '110 米栏',
    englishName: '110 Metres Hurdles',
    category: 'hurdles',
    gender: 'male',
    description:
      '110 米栏是速度与技术完美结合的项目。运动员需要在高速奔跑中跨越 10 个 1.067 米高的栏架。好的跨栏技术能最大限度地减少速度损失，让跨越栏架"像跑过去一样流畅"。',
    keyTechniques: [
      '起跑到第一栏（7-8 步）：建立节奏，准确攻栏',
      '栏间三步节奏：三步一跨是顶级选手的标准栏间步数',
      '攻栏技术：身体前倾、攻栏腿低摆、尽量不"跳"栏',
      '下栏衔接：落地即刻进入下一步跑动，减少停顿',
    ],
    watchingPoints: [
      '数栏间步数——顶级选手全程栏间三步',
      '看跨栏动作是否流畅——好的技术几乎没有"跳"的感觉',
      '最后两栏是否有人碰栏——疲劳时技术容易走形',
      '冲线前的最后几步——栏已过，纯拼速度',
    ],
    commonTerms: [
      { term: '栏间步', explanation: '两个栏之间的步数，顶级选手通常是三步' },
      { term: '攻栏', explanation: '跨栏时身体前倾、主动进攻栏架的技术动作' },
      { term: '碰栏', explanation: '跨栏时碰到栏架，不犯规但会损失速度' },
    ],
    representativeAthleteIds: ['grant-holloway', 'hansle-parchment'],
    diamondLeagueEvent: true,
  },
  {
    id: '400mH',
    name: '400 米栏',
    englishName: '400 Metres Hurdles',
    category: 'hurdles',
    gender: 'both',
    description:
      '400 米栏是田径中最考验全面能力的项目之一。它需要 400 米的速度耐力，同时还要在疲劳中精确跨越 10 个栏架。顶级 400 米栏选手往往也是出色的 400 米平跑选手。',
    keyTechniques: [
      '栏间节奏：男子通常 13-15 步、女子 15-17 步栏间',
      '双侧跨栏能力：能用任意一条腿作为攻栏腿，灵活调整',
      '疲劳管理：后程在极度疲劳下仍要保持跨栏技术',
      '最后冲刺：最后一个栏到终点之间全力冲刺',
    ],
    watchingPoints: [
      '数栏间步数——全程能保持相同栏间步数吗？',
      '250-300 米处是"疲劳转折点"，看技术是否开始变形',
      '最后一个栏到终点的 40 米冲刺——很多比赛在这里决出胜负',
      '瓦尔霍姆 vs 本杰明 vs 多斯桑托斯的对决是近年最大看点',
    ],
    commonTerms: [
      { term: '栏间节奏', explanation: '栏间的步数和节奏，是 400mH 最核心的技术要素' },
      { term: '换腿跨栏', explanation: '能用左右腿分别攻栏，灵活应对不同栏间步数' },
    ],
    representativeAthleteIds: [
      'karsten-warholm',
      'sydney-mclaughlin-levrone',
      'femke-bol',
      'rai-benjamin',
      'alison-dos-santos',
    ],
    diamondLeagueEvent: true,
  },
  {
    id: '800m',
    name: '800 米',
    englishName: '800 Metres',
    category: 'middle-distance',
    gender: 'both',
    description:
      '800 米是"最短的中距离"，也是"最长的冲刺"。它要求运动员既有接近 400 米的速度，又有 1500 米的耐力。800 米的战术非常丰富——可以前领、可以跟跑、也可以最后冲刺。',
    keyTechniques: [
      '400 米分段：通常第一圈比第二圈快 2-4 秒',
      '位置争夺：第一圈抢占有利位置很重要',
      '变速能力：在 500-600 米段发力加速往往能拉开差距',
      '冲刺决胜：最后 200 米是纯粹的速度比拼',
    ],
    watchingPoints: [
      '第一圈 400 米用时——太快可能崩盘，太慢可能追不上',
      '500-600 米是谁先动？能在这个点加速并维持到终点的选手往往能赢',
      '最后 100 米谁还有力？800 米的最后直道充满了戏剧性',
    ],
    commonTerms: [
      { term: '正分配速', explanation: '前半程比后半程快的配速策略' },
      { term: '负分配速', explanation: '后半程比前半程快的配速策略，对 800m 来说极具挑战' },
      { term: '切线跑', explanation: '过弯时贴近内道，跑最短距离' },
    ],
    representativeAthleteIds: ['emmanuel-wanyonyi'],
    diamondLeagueEvent: true,
  },
  {
    id: '1500m',
    name: '1500 米',
    englishName: '1500 Metres',
    category: 'middle-distance',
    gender: 'both',
    description:
      '1500 米是"中距离之王"——战术性最强的田径项目之一。比赛约 3.75 圈，选手需要在速度和耐力之间找到完美平衡。1500 米的比赛节奏可以快如计时赛，也可以慢到变成一场"冲刺决斗"。',
    keyTechniques: [
      '战术选择：前领、跟跑、加速、冲刺，因人而异',
      '节奏控制：保持高效的跑步经济性，不过度消耗',
      '位置意识：在队伍中保持不被包围，有随时加速的空间',
      '最后一圈：通常从 300m 开始加速，最后 100m 全力冲刺',
    ],
    watchingPoints: [
      '前 800 米的整体节奏——快还是慢？这决定了比赛的性质',
      '比赛还剩 300 米时谁动了？通常这是比赛真正的开始',
      '最后一圈的圈速——顶级选手能跑进 52 秒',
      '英格布里格森（前领型）vs 科尔（冲刺型）的比赛风格对比',
    ],
    commonTerms: [
      { term: '前领', explanation: '在队伍最前面领跑，控制比赛节奏' },
      { term: '跟跑', explanation: '跟随在领先者后面，利用其遮挡风阻' },
      { term: 'kick', explanation: '最后阶段的爆发冲刺，是 1500m 最具观赏性的部分' },
    ],
    representativeAthleteIds: ['jakob-ingebrigtsen', 'faith-kipyegon', 'josh-kerr', 'sifan-hassan'],
    diamondLeagueEvent: true,
  },
  {
    id: '5000m',
    name: '5000 米',
    englishName: '5000 Metres',
    category: 'long-distance',
    gender: 'both',
    description:
      '5000 米是长跑的"速度版本"——12.5 圈的比赛既需要超强的有氧基础，又能在最后阶段展现出惊人的速度。5000 米的战术变化丰富，可以全程快节奏甩开对手，也可以留到最后一圈决胜负。',
    keyTechniques: [
      '集团跑节省体力：在大集团中减少风阻',
      '配速控制：保持均匀的圈速，不过早发力',
      '变速能力：在中段变速可以打破对手节奏',
      '最后一公里：通常从最后 4 圈开始加速',
    ],
    watchingPoints: [
      '每圈的分段时间——是否保持了稳定的配速？',
      '还剩 1 公里时谁开始加速？这是比赛的分水岭',
      '最后一圈的冲刺速度——有时能跑进 55 秒',
      '注意被套圈的选手——领先者需要在人群中穿行',
    ],
    commonTerms: [
      { term: '套圈', explanation: '领先者追上了落后一整圈的选手' },
      { term: '兔子', explanation: '专门设置的领跑员，按预设配速领跑前半程，然后退出' },
    ],
    representativeAthleteIds: ['jakob-ingebrigtsen', 'faith-kipyegon', 'gudaf-tsegay', 'sifan-hassan'],
    diamondLeagueEvent: true,
  },
  {
    id: 'high-jump',
    name: '跳高',
    englishName: 'High Jump',
    category: 'jumps',
    gender: 'both',
    description:
      '跳高是最纯粹的身体对抗重力项目。运动员通过弧线助跑加速，在起跳点将水平速度转化为垂直高度，然后用背越式过杆。跳高的魅力在于：每次横杆升高，都在挑战人类极限。',
    keyTechniques: [
      'J 形弧线助跑：直段建立速度，弧线段向心倾斜准备起跳',
      '起跳：最后一步快速有力，将水平速度转化为向上的力',
      '背越式过杆：身体形成反弓，头、肩、臀、腿依次过杆',
      '横杆处理：在空中感知横杆位置，调整身体曲线',
    ],
    watchingPoints: [
      '助跑弧线是否流畅——弧线质量决定了起跳质量',
      '起跳点是否准确——太远或太近都会影响过杆',
      '过杆时身体是否"包裹"着横杆——好的技术让身体曲线与横杆完美贴合',
      '关键高度的心理博弈——一次不过，第二次压力倍增',
    ],
    commonTerms: [
      { term: 'J 形助跑', explanation: '先直线后弧线的助跑方式，标准跳高技术' },
      { term: '背越式 / Fosbury Flop', explanation: '背部先过杆的技术，由 Dick Fosbury 在 1968 年首创' },
      { term: '起跳高度 / 递升高度', explanation: '比赛横杆从起跳高度开始，每次升高 2-5cm' },
    ],
    representativeAthleteIds: ['yaroslava-mahuchikh', 'mutaz-essa-barshim'],
    diamondLeagueEvent: true,
  },
  {
    id: 'pole-vault',
    name: '撑竿跳高',
    englishName: 'Pole Vault',
    category: 'jumps',
    gender: 'both',
    description:
      '撑竿跳高是田径中最具视觉冲击力的项目之一。运动员手持一根约 5 米长的弹性撑竿，通过高速助跑、精准插竿，将自己"弹射"到空中，越过横杆。它是力量、速度、技巧和勇气的完美结合。',
    keyTechniques: [
      '高速助跑（约 40m）：手持撑竿加速，竿尖逐渐下降对准插竿穴',
      '插竿与起跳：将撑竿精准插入穴中，同时全力起跳',
      '摆体与倒立：利用撑竿弯曲储存的能量，将身体向上摆',
      '过杆与推竿：身体呈倒立姿势越过横杆，推开撑竿',
    ],
    watchingPoints: [
      '撑竿的弯曲程度——竿弯得越深，弹射力越大',
      '摆体动作是否流畅——好的摆体一气呵成',
      '过杆瞬间身体与横杆的距离——越高过杆越稳',
      '杜普兰蒂斯每次挑战世界纪录都是"必看时刻"',
    ],
    commonTerms: [
      { term: '插竿穴', explanation: '跑道尽头的金属槽，撑竿需要精准插入' },
      { term: '竿的磅数', explanation: '撑竿的硬度等级，根据运动员体重和技术选择' },
      { term: '摆体', explanation: '起跳后身体顺着撑竿反弹向上摆动的动作' },
    ],
    representativeAthleteIds: ['mondo-duplantis'],
    diamondLeagueEvent: true,
  },
  {
    id: 'long-jump',
    name: '跳远',
    englishName: 'Long Jump',
    category: 'jumps',
    gender: 'both',
    description:
      '跳远是最原始的田径项目之一——简单来说就是：助跑、起跳、在空中飞、尽可能远地落地。但简单的规则背后，是极其精细的技术要求。起跳板只有 20 厘米宽，踩过线即犯规。',
    keyTechniques: [
      '高速助跑（约 40-45m）：逐步加速到接近最大速度',
      '踏板起跳：精准踩在起跳板上，将水平速度转化为向前的抛物线',
      '空中技术（挺身式 / 走步式）：在空中维持平衡和控制姿态',
      '落地：双腿前伸，尽量在沙坑中留下最远的印记',
    ],
    watchingPoints: [
      '助跑节奏和踏板精度——差 1 厘米就可能损失 10+ 厘米的距离',
      '起跳角度——太陡牺牲速度、太平飞不起来',
      '空中姿态——走步式技术是最顶级选手的选择',
      '落地时双腿能伸多远——落地技术直接影响成绩',
    ],
    commonTerms: [
      { term: '起跳板', explanation: '20cm 宽的白色踏板，起跳脚必须在其后方起跳' },
      { term: '犯规', explanation: '脚超过起跳板前沿起跳即犯规，该次成绩无效' },
      { term: '挺身式', explanation: '空中技术之一，身体在空中呈弓形' },
      { term: '走步式', explanation: '空中技术之一，像在空中跑步，技术难度最高' },
    ],
    representativeAthleteIds: ['malaika-mihambo'],
    diamondLeagueEvent: true,
  },
  {
    id: 'triple-jump',
    name: '三级跳远',
    englishName: 'Triple Jump',
    category: 'jumps',
    gender: 'both',
    description:
      '三级跳远是田径中最具节奏感的项目——单脚跳（hop）、跨步跳（step）、跳跃（jump），三跳连贯完成。它对运动员的节奏感、协调性和爆发力要求极高，常常被称为"田径中的舞蹈"。',
    keyTechniques: [
      '单脚跳（第一跳）：起跳腿起跳后用同一条腿落地，约占 35-38% 总距离',
      '跨步跳（第二跳）：换腿落地，约占 28-30% 总距离',
      '跳跃（第三跳）：最后全力起跳落入沙坑，约占 32-35% 总距离',
      '三跳节奏：关键是保持水平速度，不让每跳损失太多动能',
    ],
    watchingPoints: [
      '三跳的比例分配——优秀选手三跳距离比较接近',
      '第二跳（跨步跳）通常最短，看谁在这里不掉太多距离',
      '第三跳的技术与跳远类似——谁在空中姿态最好',
    ],
    commonTerms: [
      { term: '三跳比例', explanation: 'hop:step:jump 的距离比，理想的男子比例约为 35:29:36' },
      { term: '节奏', explanation: '三跳之间的衔接节奏，对最终成绩影响巨大' },
    ],
    representativeAthleteIds: ['yulimar-rojas', 'pedro-pichardo'],
    diamondLeagueEvent: true,
  },
  {
    id: 'shot-put',
    name: '铅球',
    englishName: 'Shot Put',
    category: 'throws',
    gender: 'both',
    description:
      '铅球是最直接的"力量展示"项目。运动员在一个直径 2.135 米的投掷圈内，将 7.26kg（男子）/ 4kg（女子）的铅球推出，以球落地的最远点为成绩。从外表看是纯粹力量，但技术细节极其丰富。',
    keyTechniques: [
      '滑步推球：背对投掷方向，通过滑步移动产生初速度',
      '旋转推球：身体旋转一周，利用角动量增加出手速度（目前主流）',
      '出手角度：理想的出手角度约为 37-41 度',
      '力量传递：从腿部→躯干→手臂的"鞭打式"发力链',
    ],
    watchingPoints: [
      '运动员用滑步还是旋转技术？两种技术的视觉差异很大',
      '出手角度是否理想——抛物线太平或太陡都会影响距离',
      '投掷圈内的动作是否流畅——任何停顿都意味着能量损失',
    ],
    commonTerms: [
      { term: '投掷圈', explanation: '直径 2.135m 的圆形区域，运动员必须在圈内完成投掷' },
      { term: '抵趾板', explanation: '投掷圈前端的弧形挡板，防止运动员越界' },
      { term: '旋转技术', explanation: '运动员旋转身体以增加出手速度的技术' },
    ],
    representativeAthleteIds: ['ryan-crouser', 'joe-kovacs'],
    diamondLeagueEvent: true,
  },
  {
    id: 'javelin',
    name: '标枪',
    englishName: 'Javelin Throw',
    category: 'throws',
    gender: 'both',
    description:
      '标枪是田径中最具"原始狩猎感"的项目。运动员手持一根 2.6-2.7 米的长枪，在 30+ 米长的助跑道上加速、引枪、出手——标枪在空中划出优美的弧线，飞向远处。',
    keyTechniques: [
      '助跑（15-20 步）：逐步加速，标枪保持在头侧',
      '引枪与交叉步：将标枪向后引，身体形成"张弓"姿态',
      '出手爆发：像鞭子一样从腿→腰→肩→手依次发力',
      '出手角度：理想的出手角度约为 32-38 度',
    ],
    watchingPoints: [
      '交叉步的节奏——引枪和脚步配合是否协调',
      '出手瞬间的"鞭打"效果——流畅的发力链意味着更远的距离',
      '标枪的飞行姿态——枪尖是否稳定指向飞行方向',
      '标枪落在草坪上的瞬间——枪尖必须先着地才算有效',
    ],
    commonTerms: [
      { term: '交叉步', explanation: '引枪阶段的特殊脚步动作，身体侧对投掷方向' },
      { term: '引枪', explanation: '将标枪向后拉的准备动作，形成身体张力' },
      { term: '出手角度', explanation: '标枪离开手时与地面的夹角' },
    ],
    representativeAthleteIds: ['neeraj-chopra', 'anderson-peters'],
    diamondLeagueEvent: true,
  },
  {
    id: '100mH',
    name: '100 米栏',
    englishName: '100 Metres Hurdles',
    category: 'hurdles',
    gender: 'female',
    description:
      '女子 100 米栏是速度与技术的高度结合。与男子 110 米栏不同，女子栏高 0.838 米，距离缩短 10 米。10 个栏架、冲刺到终点——每一步都关乎分秒之争。顶级选手能在 12.5 秒以内完赛，跨栏动作流畅得像"跑过栏架"。',
    keyTechniques: [
      '起跑到第一栏（8 步）：精确的步数确保在第一栏前达到最佳位置',
      '栏间三步节奏：与男子 110mH 一样，三步是最优栏间步数',
      '低空过栏：减少腾空时间，最大化水平速度',
      '冲刺终点：最后一栏到终点全力加速',
    ],
    watchingPoints: [
      '起跑到第一栏的步数和节奏——差的起步会毁掉整场比赛',
      '栏间三步是否稳定——任何调整都会损失时间',
      '最后两栏后的冲刺——所有栏过的瞬间就是冲刺的开始',
      '托比·阿穆桑的世界纪录 12.12s 是近年最大看点',
    ],
    commonTerms: [
      { term: '栏间三步', explanation: '两个栏间用三步完成，是顶级选手的标准节奏' },
      { term: '攻栏腿', explanation: '首先过栏的腿，通常选择力量更强的一侧' },
      { term: '碰栏', explanation: '碰到栏架不犯规，但会显著降低速度' },
    ],
    representativeAthleteIds: ['tobi-amusan', 'jasmine-camacho-quinn'],
    diamondLeagueEvent: true,
  },
  {
    id: '3000mSC',
    name: '3000 米障碍赛',
    englishName: '3000 Metres Steeplechase',
    category: 'long-distance',
    gender: 'both',
    description:
      '3000 米障碍赛是田径中最"狂野"的项目。选手需要在 7.5 圈的赛跑中跨越 28 次栏架和 7 次水上障碍。水坑、栏架、泥泞 —— 这项源于英国越野赛马的项目充满了原始的运动魅力。',
    keyTechniques: [
      '过栏技术：障碍栏比跨栏栏架更宽更重，不能"碰倒"',
      '水上障碍：越过栏架后落入水池，快速从水中恢复跑动',
      '体能分配：7.5 圈的比赛需要精心管理体力',
      '最后一公里加速：从最后 1000 米开始逐步提速',
    ],
    watchingPoints: [
      '看水上障碍——这是最精彩的环节，水花四溅',
      '过障碍时谁的技术最流畅——好的选手几乎不损失速度',
      '最后两圈谁开始加速——3000mSC 的决战通常在此时开始',
      '肯尼亚vs摩洛哥的对决是近年最大看点',
    ],
    commonTerms: [
      { term: '水上障碍', explanation: '跑道内侧的水坑+栏架组合，比赛中最有挑战性的障碍' },
      { term: '障碍栏', explanation: '比标准跨栏更重更宽的栏架，无法被撞倒' },
    ],
    representativeAthleteIds: ['soufiane-el-bakkali'],
    diamondLeagueEvent: true,
  },
  {
    id: '10000m',
    name: '10000 米',
    englishName: '10000 Metres',
    category: 'long-distance',
    gender: 'both',
    description:
      '10000 米是田径场上最长的径赛项目 —— 整整 25 圈。这是一场关于耐心、战术和极限耐力的考验。选手们需要在接近 30 分钟的持续奔跑中保持专注和速度。好的万米比赛节奏感极强，每一圈的分段都经过精心计算。',
    keyTechniques: [
      '均匀配速：在长距离中保持稳定的圈速至关重要',
      '集团合作：多名选手轮流领跑，分摊风阻和体力消耗',
      '最后 1000 米：通常在最后 2.5 圈开始加速淘汰对手',
      '补给策略：比赛中不设补给站，全靠赛前准备',
    ],
    watchingPoints: [
      '每 1000 米的分段时间——匀速还是有变速？',
      '还剩 5 圈时队伍开始分化——谁能跟住领先集团？',
      '最后一圈的冲刺——万米最后一圈有时能跑进 60 秒',
      '埃塞俄比亚和肯尼亚选手之间的团队战术博弈',
    ],
    commonTerms: [
      { term: '配速', explanation: '每公里或每圈的时间，是长跑最重要的指标' },
      { term: '套圈', explanation: '领先者追上了落后的选手，在万米中很常见' },
    ],
    representativeAthleteIds: ['sifan-hassan', 'gudaf-tsegay'],
    diamondLeagueEvent: true,
  },
  {
    id: 'discus',
    name: '铁饼',
    englishName: 'Discus Throw',
    category: 'throws',
    gender: 'both',
    description:
      '铁饼是田径中最古老的项目之一，可以追溯到古希腊奥运会。运动员在一个直径 2.5 米的投掷圈内，通过旋转将 2kg（男子）/ 1kg（女子）的铁饼抛出。铁饼飞行的优美弧线、全身旋转发力的技术美感，让这个项目充满了古典美学。',
    keyTechniques: [
      '起始姿势：背对投掷方向，铁饼握于手中',
      '旋转加速：通过 1.5 圈旋转积累角动量',
      '发力出手：从脚→腿→腰→肩→臂的力量传递链',
      '出手角度与旋转：铁饼需要以特定角度和旋转速度出手以获得最佳空气动力',
    ],
    watchingPoints: [
      '投掷圈内的旋转是否流畅——任何脚步不稳都会损失距离',
      '出手时铁饼的旋转和角度——这决定了飞行姿态',
      '铁饼在空中像 UFO 一样旋转——飞得好时极有观赏性',
      '看选手如何在狭小的投掷圈内不犯规地完成全部动作',
    ],
    commonTerms: [
      { term: '投掷圈', explanation: '直径 2.5m 的圆形投掷区域' },
      { term: '旋转技术', explanation: '通过身体旋转增加出手速度的核心技术' },
      { term: '出手角度', explanation: '铁饼离手时与水平面的夹角，理想约为 35 度' },
    ],
    representativeAthleteIds: ['daniel-stahl', 'valarie-allman'],
    diamondLeagueEvent: true,
  },
];

export const getEventById = (id: string): TrackEvent | undefined =>
  trackEvents.find((e) => e.id === id);

export const getEventsByCategory = (category: string): TrackEvent[] =>
  trackEvents.filter((e) => e.category === category);

export const getDiamondLeagueEvents = (): TrackEvent[] =>
  trackEvents.filter((e) => e.diamondLeagueEvent);
