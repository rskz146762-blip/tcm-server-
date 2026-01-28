/**
 * 中医九种体质判定算法 (基于《中医体质分类与判定》标准)
 * 核心逻辑层：计算原始分、转化分，并判定体质类型
 */

const CONSTITUTION_CONFIG = {
  qi_deficiency: {
    name: '气虚质',
    items: [2, 3, 4, 14, 19, 25, 26, 30],
    advice: '补气养血，适宜运动如八段锦。多食山药、大枣、扁豆。'
  },
  yang_deficiency: {
    name: '阳虚质',
    items: [7, 8, 9, 10, 11, 12, 13],
    advice: '温阳补虚，注意腹部保暖。多食羊肉、姜、胡椒，少食冷饮。'
  },
  yin_deficiency: {
    name: '阴虚质',
    items: [15, 16, 17, 18, 20, 21, 22, 23],
    advice: '滋阴润燥，忌辛辣燥烈。多食银耳、百合、梨，保证充足睡眠。'
  },
  damp_phlegm: {
    name: '痰湿质',
    items: [24, 27, 28, 29, 31, 32, 33, 34],
    advice: '健脾祛湿，饮食清淡。多食赤小豆、薏米、荷叶，忌肥甘厚味。'
  },
  damp_heat: {
    name: '湿热质',
    items: [35, 36, 37, 38, 39, 40, 41],
    advice: '清热利湿，保持心情平和。多食绿豆、苦瓜、芹菜，忌烟酒。'
  },
  blood_stasis: {
    name: '血瘀质',
    items: [42, 43, 44, 45, 46, 47, 48],
    advice: '活血化瘀，保持情绪舒畅。多食黑豆、山楂、红糖，避免久坐。'
  },
  qi_stagnation: {
    name: '气郁质',
    items: [5, 6, 49, 50, 51, 52, 53],
    advice: '疏肝理气，多参加社交活动。多食玫瑰花、佛手、柑橘。'
  },
  special_diathesis: {
    name: '特禀质',
    items: [54, 55, 56, 57, 58, 59, 60],
    advice: '扶正固表，避开过敏原。饮食宜清淡，生活有规律。'
  },
  neutral: {
    name: '平和质',
    items: [1, 2, 4, 5, 13, 19, 25, 26],
    advice: '饮食有节，起居有常。继续保持良好的生活习惯和心态。'
  }
};

/**
 * 计算九种体质得分及判定结果
 * @param {Object} answers - 键为 q1-q60，值为 1-5 (5分制)
 * @returns {Object} - 包含判定结果及建议
 */
function analyzeConstitution(answers) {
  const scores = {};
  const results = [];

  // 1. 计算各体质的原始分和转化分
  for (const key in CONSTITUTION_CONFIG) {
    const config = CONSTITUTION_CONFIG[key];
    const numItems = config.items.length;
    
    // 原始分：各项得分相加
    let originalScore = 0;
    config.items.forEach(idx => {
      const val = parseInt(answers[`q${idx}`]) || 1; // 默认最轻
      originalScore += val;
    });

    // 转化分：[(原始分 - 题目数) / (题目数 * 4)] * 100
    // 题目数 * 4 是因为每题最高5分，原始分最小为题目数（每题1分）
    const convertedScore = Math.round(((originalScore - numItems) / (numItems * 4)) * 100);
    
    scores[key] = {
      name: config.name,
      originalScore,
      convertedScore,
      advice: config.advice
    };
  }

  // 2. 判定逻辑
  // 判断非平和质的体质
  const unbalancedList = [];
  for (const key in scores) {
    if (key === 'neutral') continue;
    
    if (scores[key].convertedScore >= 40) {
      unbalancedList.push({ key, ...scores[key], status: '是' });
    } else if (scores[key].convertedScore >= 30) {
      unbalancedList.push({ key, ...scores[key], status: '倾向是' });
    }
  }

  // 判断平和质
  const neutralScore = scores.neutral.convertedScore;
  const otherScores = Object.keys(scores)
    .filter(k => k !== 'neutral')
    .map(k => scores[k].convertedScore);
  
  const allOthersBelow30 = otherScores.every(s => s < 30);
  const allOthersBelow40 = otherScores.every(s => s < 40);

  let isNeutral = false;
  if (neutralScore >= 60 && allOthersBelow30) {
    isNeutral = true;
    results.push({ key: 'neutral', ...scores.neutral, status: '是' });
  } else if (neutralScore >= 60 && allOthersBelow40) {
    // results.push({ key: 'neutral', ...scores.neutral, status: '基本是' });
    // 如果没有明确的偏向体质，则视为基本平和
    if (unbalancedList.length === 0) {
      isNeutral = true;
      results.push({ key: 'neutral', ...scores.neutral, status: '基本是' });
    }
  }

  // 3. 筛选输出结果 (1-2 种最明显的体质)
  // 如果是平和质且没有其他偏向，只返回平和质
  if (isNeutral && unbalancedList.length === 0) {
    return {
      main_constitutions: results,
      all_scores: scores
    };
  }

  // 否则，按得分从高到低排序偏向体质
  const sortedUnbalanced = unbalancedList.sort((a, b) => b.convertedScore - a.convertedScore);
  
  // 取前2个
  const mainConstitutions = sortedUnbalanced.slice(0, 2);

  return {
    main_constitutions: mainConstitutions,
    all_scores: scores,
    summary: mainConstitutions.map(c => `${c.name}(${c.status})`).join('、'),
    advice: mainConstitutions.map(c => c.advice).join(' ')
  };
}

export {
  analyzeConstitution,
  CONSTITUTION_CONFIG
};
