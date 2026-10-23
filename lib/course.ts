import type { PlaybackSpec } from './notation.ts';

export type PracticeBlock = {
  label: string;
  minutes: number;
  instruction: string;
};

export type WeekPlan = {
  week: number;
  phase: string;
  title: string;
  objective: string;
  key: string;
  outcome: string;
  chords: string;
  notation: string;
  playback: PlaybackSpec;
  notationNote: string;
  dailyFocus: string[];
  technique: string;
};

export type PracticeSession = {
  title: string;
  focus: string;
  blocks: PracticeBlock[];
  notation: string;
  playback: PlaybackSpec;
  chords: string;
  cue: string;
  recordingPrompt: string;
};

const dayNames = ['一', '二', '三', '四', '五', '六', '七'];

export const weeks: WeekPlan[] = [
  {
    week: 1,
    phase: '定位',
    title: '让音级变得听得见',
    objective: '在 C 大调里唱出、找到并使用 1、3、5；建立第一段旋律素材。',
    key: 'C 大调 · 4/4',
    outcome: '录下 C–G–Am–F 循环上的 4 小节回应句。',
    chords: 'C | G | Am | F',
    notation: '1 — 3 5 | 3 2 1 — | 2 3 5 — | 3 2 1 —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调 · 1 = C4（中央 C）' },
    notationNote: '原创 C 大调回应句。每个数字都是音级；“—”表示延长一拍。',
    dailyFocus: ['建立基线与拍点', '唱后找音', '和弦内音落点', '电吉他音准', '旋律结尾', '4 小节回应', '录音复盘'],
    technique: '原声：交替拨弦；电吉他：半音/全音推弦先比对目标音。',
  },
  {
    week: 2,
    phase: '定位',
    title: '用旋律穿过和弦',
    objective: '把音阶的横向记忆换成“当前和弦该落在哪个音”。',
    key: 'G 大调 · 4/4',
    outcome: '不依赖六线谱，弹出一段主旋律并准确标出落点。',
    chords: 'G | D | Em | C',
    notation: '5 1 2 3 | 2 — 1 6 | 5 — 3 2 | 1 — — —',
    playback: { tonicMidi: 55, meter: '4/4', label: 'G 大调 · 1 = G3' },
    notationNote: '原创 G 大调练习句。先听唱，再找到和弦变化处的稳定音。',
    dailyFocus: ['G 调根音地图', '主旋律听唱', 'I–V–vi–IV 的 1/3/5', '推弦与揉弦', '句尾替换', '八小节串联', '基线对比'],
    technique: '原声：滑音连接；电吉他：慢速推弦到 2 或 3，再加窄揉弦。',
  },
  {
    week: 3,
    phase: '和声',
    title: '只用三和弦，也能像 solo',
    objective: '在高音三根弦找到 C、G、Am、F 的 1、3、5。',
    key: 'C 大调 · 4/4',
    outcome: '在每次和弦变化的强拍，稳定落到正确的和弦内音。',
    chords: 'C | G | Am | F',
    notation: '3 5 3 2 | 5 2 5 — | 3 1 3 5 | 4 3 2 1',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调 · 1 = C4' },
    notationNote: '原创练习：圈出每小节第一个音，说明它属于哪个和弦。',
    dailyFocus: ['高音区三和弦', '每小节一个落点', '上行连接音', '下行连接音', '删掉多余音', '伴奏上即兴', '一遍完成'],
    technique: '原声：双音的力度平衡；电吉他：右手静音，避免失真下的杂音。',
  },
  {
    week: 4,
    phase: '和声',
    title: '旋律不是音阶的随机抽样',
    objective: '学会先唱一句，再选和弦内音落脚，用经过音连接。',
    key: 'A 小调 · 4/4',
    outcome: '完成一段有开始、回答和结束的 8 小节短 solo。',
    chords: 'Am | G | F | E',
    notation: '5 ♭6 5 ♭3 | 2 — ♭3 2 | 1 ♭3 5 ♭6 | 5 ♭3 2 1',
    playback: { tonicMidi: 57, meter: '4/4', label: 'A 小调 · 1 = A3（主音记为 1）' },
    notationNote: '原创 A 小调乐句，采用主音为 1 的记法：1=A、♭3=C、♭6=F。听出 ♭6 到 5 的回落感。',
    dailyFocus: ['小调的 1/♭3/5', '哼唱问句', '哼唱答句', 'E 和弦的导向音', '留空拍', '八小节结构', '音色选择'],
    technique: '原声：击勾弦要与拍点一致；电吉他：推弦与揉弦只用在长音。',
  },
  {
    week: 5,
    phase: '表达',
    title: '让一小句真正说话',
    objective: '用节奏、留白和力度代替无止境的音符。',
    key: 'G 大调 · 4/4',
    outcome: '同一动机能弹出三种明显不同的情绪。',
    chords: 'Em | D | C | B7',
    notation: '3 — 5 6 | 5 — 3 — | 2 3 5 — | 6 5 3 —',
    playback: { tonicMidi: 55, meter: '4/4', label: 'E 小调 · 1 = G3，6 = E4' },
    notationNote: '原创 E 小调动机，沿用 G 大调音级记法（6=E）。分别用平直、滑音、留白三种方式处理。',
    dailyFocus: ['一拍留白', '同节奏换结尾', '轻重对比', '滑音入口', '揉弦出口', '问答重复', '录音比较'],
    technique: '电吉他先用干净或轻过载；不要让效果器代替音准和节奏。',
  },
  {
    week: 6,
    phase: '表达',
    title: '用技巧服务旋律',
    objective: '将滑音、击勾弦、推弦和揉弦放在有意义的长音上。',
    key: 'C 大调 · 6/8',
    outcome: '完成一段 8–12 小节、可辨认且有高潮的旋律 solo。',
    chords: 'C | G | Am | F · G',
    notation: '1 3 5 1 3 5 | 6 5 3 6 5 3 | 2 3 5 2 3 5 | 3 — — — — —',
    playback: { tonicMidi: 60, meter: '6/8', label: 'C 大调 · 1 = C4' },
    notationNote: '原创 6/8 上行句；每格是一个八分音符，三格一大拍。数“1-la-li 2-la-li”，横线延长一格。',
    dailyFocus: ['6/8 摇摆感', '滑音到目标音', '击勾弦不抢拍', '推弦音准', '高潮位置', '完成一遍', '低压复盘'],
    technique: '原声做触弦与动态；电吉他做推弦、延音与结束揉弦。',
  },
  {
    week: 7,
    phase: '构作',
    title: '把熟歌变成自己的 solo',
    objective: '从你喜欢的流行/民谣歌里提炼旋律骨架和和弦落点。',
    key: '自选调 · 4/4',
    outcome: '完成第一首自选曲的 8–16 小节 solo 草稿。',
    chords: 'I | V | vi | IV（按自选歌曲转调）',
    notation: '3 5 — 3 | 2 — 5 — | 6 5 3 2 | 1 — — —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调试听示例 · 1 = C4' },
    notationNote: '原创四和弦骨架；先把数字换成自选曲所在调的音。',
    dailyFocus: ['写下和弦', '找副歌旋律', '圈稳定音', '删到骨架', '加入连接音', '写高潮', '录草稿'],
    technique: '只保留一个主技巧，避免每个音都加装饰。',
  },
  {
    week: 8,
    phase: '构作',
    title: '从旋律到完整段落',
    objective: '让 solo 有清晰结构：引用、变化、高潮、收束。',
    key: '自选调 · 4/4',
    outcome: '完成第一首自选曲的可演奏版本并录制。',
    chords: '沿用第 7 周的和弦循环',
    notation: '3 5 3 2 | 3 — 5 — | 6 5 3 2 | 1 — — —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调试听示例 · 1 = C4' },
    notationNote: '原创结构练习：第 1 句和第 2 句相似，但结尾必须不同。',
    dailyFocus: ['引用主旋律', '重复并变化', '低音区开场', '高音区高潮', '留白转场', '完整演奏', '复盘与修订'],
    technique: '电吉他可用轻过载；原声须让旋律音比伴奏音更突出。',
  },
  {
    week: 9,
    phase: '即兴',
    title: '先在限制中即兴',
    objective: '不用预写音符，也能在和弦变化上做出可信的 8 小节。',
    key: 'C / G 大调 · 4/4',
    outcome: '录下第一段只用和弦内音的 8 小节即兴。',
    chords: 'C | G | Am | F',
    notation: '1 3 5 — | 5 2 5 — | 6 1 3 — | 4 6 4 —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调试听示例 · 1 = C4' },
    notationNote: '原创“只用 1/3/5”练习。先模仿节奏，再换你自己的落点。',
    dailyFocus: ['只用 1/3/5', '每小节三音', '固定一种节奏', '先哼后弹', '两小节问答', '八小节录音', '选出最好一遍'],
    technique: '慢速伴奏比高速伴奏更适合检查和弦跟随。',
  },
  {
    week: 10,
    phase: '即兴',
    title: '重复一个动机，再让它变化',
    objective: '把即兴从“找音”推进到“发展一句话”。',
    key: 'G 大调 · 4/4',
    outcome: '在同一循环中用一个动机完成 8 小节叙述。',
    chords: 'G | D | Em | C',
    notation: '3 2 1 — | 5 3 2 — | 6 5 3 — | 2 1 — —',
    playback: { tonicMidi: 55, meter: '4/4', label: 'G 大调 · 1 = G3' },
    notationNote: '原创动机。后四小节只改节奏或最后一个音，不要换掉整句话。',
    dailyFocus: ['定义三音动机', '同音高重复', '改节奏', '改结尾', '八度转移', '加一个技巧', '连续两遍'],
    technique: '变化来自节奏与结尾，技巧只为长音添色。',
  },
  {
    week: 11,
    phase: '整合',
    title: '把两把琴都用在表达上',
    objective: '让原声版本和电吉他版本说同一句旋律，但有不同音色。',
    key: '自选调 · 4/4',
    outcome: '录下同一段 solo 的原声版与电吉他版。',
    chords: '从歌曲副歌写下 4–8 小节循环',
    notation: '5 — 3 2 | 3 5 — — | 6 5 3 2 | 1 — — —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调试听示例 · 1 = C4' },
    notationNote: '原创长音练习：原声用触弦变化，电吉他用推弦/揉弦完成长音。',
    dailyFocus: ['原声旋律音色', '电吉他干净音', '轻过载对比', '动态层次', '推弦取舍', '双版本录制', '听感笔记'],
    technique: '同一乐句两种琴各录一遍；先比较节奏与音准，再比较音色。',
  },
  {
    week: 12,
    phase: '呈现',
    title: '做出可回看的结业作品',
    objective: '把方法固化为作品与下一阶段的选择，而不只是完成一张清单。',
    key: '自选调 · 4/4 或 6/8',
    outcome: '交付 2–3 段歌曲 solo 与一段 8–16 小节即兴。',
    chords: '由你的作品决定',
    notation: '1 3 5 — | 3 2 1 — | 5 6 5 3 | 2 1 — —',
    playback: { tonicMidi: 60, meter: '4/4', label: 'C 大调试听示例 · 1 = C4' },
    notationNote: '原创收束句：最后一小节必须落到主和弦的稳定音。',
    dailyFocus: ['选曲与结构', '作品一修订', '作品二修订', '即兴限制练习', '完整彩排', '正式录制', '复盘与下周期'],
    technique: '正式录制时不追求零失误，优先节奏、音准和完整表达。',
  },
];

export function getPracticeSession(week: WeekPlan, day: number): PracticeSession {
  const focus = week.dailyFocus[day - 1] ?? week.dailyFocus[0];
  const dayName = dayNames[day - 1] ?? '一';

  return {
    title: `课程第 ${week.week} 周 · 第${dayName}天｜${focus}`,
    focus,
    blocks: [
      { label: '节奏开机', minutes: 5, instruction: week.playback.meter === '6/8' ? '节拍器 60–72 BPM，每次点击是一大拍。先拍手数“1-la-li 2-la-li”，再弹单音。' : '节拍器 60–72 BPM。先拍手数 4 小节，再弹单音；每一拍都能说出“1 和 2 和”。' },
      { label: '听唱与定位', minutes: 7, instruction: `按下方试听标注的调性唱出稳定音，再在琴上找到它们。今天特别留意：${focus}。` },
      { label: '技巧微练', minutes: 8, instruction: week.technique },
      { label: '旋律任务', minutes: 10, instruction: `在下方原创简谱上完成今天目标：${focus}。先唱一句，再弹一句。` },
      { label: '创作与记录', minutes: 5, instruction: '在伴奏循环上弹 4 小节；手机录一遍，并写下一个最想明天修正的地方。' },
    ],
    notation: week.notation,
    playback: week.playback,
    chords: week.chords,
    cue: week.notationNote,
    recordingPrompt: day === 7 ? '本周复盘：节奏、音准、和弦落点各打 1–5 分。下周只保留一个要改的重点。' : '录音只需一遍；听完后用一句话描述“哪一拍最不稳”或“哪一个音最有情绪”。',
  };
}

export const coursePrinciples = [
  '先唱后弹：找不到、唱不出的旋律，不用手指碰运气。',
  '和弦变化时优先落在 1、3、5；其余音负责连接。',
  '每周录音一次：手上“会了”不等于听起来像音乐。',
];
