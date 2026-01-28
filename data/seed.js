import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Syndrome from '../models/Syndrome.js';
import Acupuncture from '../models/Acupuncture.js';
import SymptomComparison from '../models/SymptomComparison.js';
import Knowledge from '../models/Knowledge.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const syndromesData = [
  {
    name: '风寒感冒',
    description: '恶寒重，发热轻，无汗，头痛，肢体酸痛，鼻塞声重，或流清涕，喉痒咳嗽，痰稀色白，口不渴或渴喜热饮，舌苔薄白而润，脉浮或浮紧。',
    treatment_principle: '辛温解表，宣肺散寒',
    lifestyle_advice: '注意保暖，避免吹风；多喝温开水；饮食宜清淡，可适量饮用姜汤。',
    rules: [
      { field: 'chills', value: 'heavy' },
      { field: 'sweat', value: 'none' }
    ],
    prescriptions: [{ name: '荆防败毒散' }]
  },
  {
    name: '风热感冒',
    description: '发热重，微恶风寒，有汗不解，头痛，鼻塞，流黄浊涕，口渴，咽喉红肿疼痛，咳嗽，痰粘或黄，舌苔薄黄，脉浮数。',
    treatment_principle: '辛凉解表，宣肺清热',
    lifestyle_advice: '保持室内通风；多饮水，饮食清淡；忌辛辣油腻及烟酒。',
    rules: [],
    prescriptions: [{ name: '银翘散' }]
  },
  {
    name: '暑湿感冒',
    description: '发生于夏季，发热，汗出不解，鼻塞流涕，头昏重胀痛，肢体困倦，胸闷恶心，口中黏腻，小便短赤，舌苔黄腻，脉濡数。',
    treatment_principle: '清暑祛湿，解表和中',
    lifestyle_advice: '注意防暑降温；饮食宜清淡利湿，如绿豆汤、冬瓜汤。',
    rules: [],
    prescriptions: [{ name: '藿香正气散' }]
  },
  {
    name: '气虚感冒',
    description: '恶寒较甚，发热，无汗，身楚倦怠，咳嗽低微，咳痰无力，舌淡苔白，脉浮而无力。',
    treatment_principle: '益气解表',
    lifestyle_advice: '注意休息，不可劳累；加强营养，适当食用补气之品，如山药、大枣。',
    rules: [],
    prescriptions: [{ name: '参苏饮' }]
  },
  {
    name: '阴虚感冒',
    description: '身微热，微恶风寒，少汗，头痛，口干咽燥，干咳少痰，舌红少苔，脉细数。',
    treatment_principle: '滋阴解表',
    lifestyle_advice: '多食滋阴润燥之品，如百合、银耳；避免熬夜，保持情绪平稳。',
    rules: [],
    prescriptions: [{ name: '加减葳蕤汤' }]
  },
  {
    name: '痰热郁肺 (咳嗽)',
    description: '咳嗽气息粗促，或喉中有痰声，痰多质黏厚或稠黄，咯吐不爽，或有腥臭味，甚至吐血痰，胸胁胀满，咳时引痛，面赤，或有身热，口干而黏，欲饮水，舌质红，苔薄黄腻，脉滑数。',
    treatment_principle: '清热肃肺，豁痰止咳',
    lifestyle_advice: '饮食宜清淡，忌辛辣、肥甘厚味；多喝水，可适量食用梨、枇杷等清肺润燥之品。',
    rules: [
      { field: 'cough', value: 'heavy' },
      { field: 'phlegm', value: 'yellow' }
    ],
    prescriptions: [{ name: '清金化痰汤' }]
  },
  {
    name: '肝气犯胃 (胃痛)',
    description: '胃脘胀满，攻撑作痛，痛连两胁，嗳气频繁，大便不畅，每因情志因素而加重，舌苔薄白，脉弦。',
    treatment_principle: '疏肝解郁，理气止痛',
    lifestyle_advice: '保持心情舒畅，避免情绪激动；饮食有节，忌生冷及易产气食物。',
    rules: [
      { field: 'stomach', value: 'bloating' }
    ],
    prescriptions: [{ name: '柴胡疏肝散' }]
  },
  {
    name: '心脾两虚 (失眠)',
    description: '多梦易醒，或入睡困难，心悸健忘，神疲食少，头晕目眩，腹胀便溏，面色少华，舌淡苔薄，脉细无力。',
    treatment_principle: '补益心脾，养血安神',
    lifestyle_advice: '睡前避免兴奋活动，可用温水泡脚；饮食宜补益心脾，如桂圆、莲子、大枣。',
    rules: [
      { field: 'sleep', value: 'dreamy' }
    ],
    prescriptions: [{ name: '归脾汤' }]
  },
  {
    name: '脾胃虚寒 (腹痛)',
    description: '腹痛绵绵，时作时止，喜温喜按，饥饿劳累后加重，得食休息后减轻，神疲乏力，气短懒言，形寒肢冷，胃纳不佳，大便溏薄，舌淡苔白，脉沉细。',
    treatment_principle: '温中健脾，和里缓急',
    lifestyle_advice: '注意腹部保暖，忌食生冷；少食多餐，细嚼慢咽。',
    rules: [],
    prescriptions: [{ name: '小建中汤' }]
  },
  {
    name: '肝火上炎 (头痛)',
    description: '头胀痛而眩，心烦易怒，夜寐不宁，面赤口苦，或兼胁痛，舌红苔黄，脉弦数。',
    treatment_principle: '清肝泻火',
    lifestyle_advice: '保持心情平和，规律作息；忌食辛辣烟酒，多吃新鲜蔬菜水果。',
    rules: [],
    prescriptions: [{ name: '龙胆泻肝汤' }]
  },
  {
    name: '痰湿蕴肺 (咳嗽)',
    description: '咳嗽反复发作，咳声重浊，痰多，因痰而嗽，痰出咳止，痰色白或灰，质黏腻或稠厚成块，早晨及食后加重，胸闷脘痞，呕恶食少，舌苔白腻，脉濡滑。',
    treatment_principle: '燥湿化痰，理气止咳',
    lifestyle_advice: '饮食宜清淡，忌油腻及甜食；注意脾胃调理。',
    rules: [
      { field: 'cough', value: 'heavy' },
      { field: 'phlegm', value: 'white' }
    ],
    prescriptions: [{ name: '二陈汤合三子养亲汤' }]
  },
  {
    name: '冷哮 (哮病)',
    description: '喉中哮鸣如水鸡声，呼吸急促，不能平卧，咯痰稀白，面色晦滞带青，渴喜热饮，舌苔白滑，脉浮紧。',
    treatment_principle: '宣肺散寒，豁痰利气',
    lifestyle_advice: '注意背部保暖，避免接触过敏原。',
    rules: [
      { field: 'cough', value: 'heavy' }
    ],
    prescriptions: [{ name: '射干麻黄汤' }]
  },
  {
    name: '脾胃虚弱 (胃痛)',
    description: '胃脘隐痛，喜暖喜按，空腹痛甚，得食痛减，纳后脘胀，呕吐清水，神疲乏力，手足不温，大便溏薄，舌淡苔白，脉虚弱。',
    treatment_principle: '健脾益气，温中和胃',
    lifestyle_advice: '规律饮食，细嚼慢咽，忌食生冷。',
    rules: [
      { field: 'stomach', value: 'bloating' }
    ],
    prescriptions: [{ name: '香砂六君子汤' }]
  },
  {
    name: '湿热下注 (泄泻)',
    description: '腹痛即泻，泻下急迫，或泻而不爽，粪色黄褐，气味臭秽，肛门灼热，烦热口渴，小便短赤，舌质红，苔黄腻，脉滑数。',
    treatment_principle: '清热利湿',
    lifestyle_advice: '注意饮食卫生，禁食辛辣油腻。',
    rules: [
      { field: 'stool', value: 'diarrhea' }
    ],
    prescriptions: [{ name: '葛根芩连汤' }]
  },
  {
    name: '肠道实热 (便秘)',
    description: '大便干结，腹胀腹痛，面赤身热，口干口臭，小便短赤，舌红苔黄燥，脉滑实。',
    treatment_principle: '泻热导滞，润肠通便',
    lifestyle_advice: '多吃纤维蔬菜，多饮水，建立定时排便习惯。',
    rules: [
      { field: 'stool', value: 'constipated' }
    ],
    prescriptions: [{ name: '麻子仁丸' }]
  },
  {
    name: '痰浊中阻 (眩晕)',
    description: '眩晕，头重如蒙，胸闷恶心，食少多寐，舌苔白腻，脉濡滑。',
    treatment_principle: '燥湿祛痰，健脾和胃',
    lifestyle_advice: '饮食宜清淡，忌肥甘厚味。',
    rules: [
      { field: 'dizzy', value: 'heavy' }
    ],
    prescriptions: [{ name: '半夏白术天麻汤' }]
  },
  {
    name: '阴虚火旺 (心悸)',
    description: '心悸易惊，心烦失眠，五心烦热，口干，盗汗，思虑过度即发，舌红少津，苔少，脉细数。',
    treatment_principle: '滋阴降火，养心安神',
    lifestyle_advice: '保证充足睡眠，避免过度思虑。',
    rules: [
      { field: 'heart', value: 'palpitation' }
    ],
    prescriptions: [{ name: '天王补心丹' }]
  },
  {
    name: '气阴两虚 (消渴)',
    description: '口渴引饮，能食而瘦，气短乏力，自汗，心悸不寐，舌红少津，苔薄白，脉细数。',
    treatment_principle: '益气养阴',
    lifestyle_advice: '严格控制饮食糖分，加强体育锻炼。',
    rules: [],
    prescriptions: [{ name: '玉液汤' }]
  },
  {
    name: '痰湿内阻 (肥胖)',
    description: '形体肥胖，肢体沉重，倦怠乏力，胸闷脘痞，痰多，舌苔白腻，脉滑。',
    treatment_principle: '燥湿化痰，理气减肥',
    lifestyle_advice: '控制热量摄入，坚持有氧运动。',
    rules: [],
    prescriptions: [{ name: '防风通圣散' }]
  },
  {
    name: '风寒湿痹 (腰痛)',
    description: '腰痛冷痛重着，转侧不利，遇冷及阴雨天加重，虽居暖室疼痛不减，舌苔白腻，脉沉迟。',
    treatment_principle: '散寒祛湿，温经通络',
    lifestyle_advice: '腰部保暖，避免久坐久站。',
    rules: [],
    prescriptions: [{ name: '独活寄生汤' }]
  },
  {
    name: '气滞血瘀 (颈椎病)',
    description: '颈项刺痛，痛有定处，活动受限，或见上肢麻木，舌质暗红或有瘀点，脉弦。',
    treatment_principle: '活血化瘀，理气止痛',
    lifestyle_advice: '避免长期低头，适当做颈部保健操。',
    rules: [
      { field: 'neck', value: 'pain' }
    ],
    prescriptions: [{ name: '身痛逐瘀汤' }]
  },
  {
    name: '寒湿凝滞 (痛经)',
    description: '经前或经期小腹冷痛，得热痛减，按之痛甚，经色紫黯有块，畏寒便溏，舌苔白腻，脉沉紧。',
    treatment_principle: '温经散寒，化瘀止痛',
    lifestyle_advice: '经期严禁生冷，注意腹部保暖。',
    rules: [
      { field: 'period_pain', value: 'heavy' }
    ],
    prescriptions: [{ name: '少腹逐瘀汤' }]
  },
  {
    name: '脾失健运 (小儿厌食)',
    description: '食欲不振，甚至拒食，面色少华，形体偏瘦，大便不调，舌苔薄白，脉尚有力。',
    treatment_principle: '调理脾胃，助运开胃',
    lifestyle_advice: '定时定量进食，少吃零食冷饮。',
    rules: [],
    prescriptions: [{ name: '资生健脾丸' }]
  },
  {
    name: '风热毒蕴 (痤疮)',
    description: '皮疹以红丘疹为主，伴有脓疱，局部红肿疼痛，舌红苔黄，脉浮数。',
    treatment_principle: '疏风清热，解毒散结',
    lifestyle_advice: '勤洗脸，禁食辛辣油腻，保证睡眠。',
    rules: [],
    prescriptions: [{ name: '枇杷清肺饮' }]
  }
];

const acupunctureData = [
  {
    name: '风池',
    meridian: '足少阳胆经',
    location: '在项部，胸锁乳突肌与斜方肌上端之间的凹陷中。',
    function: '疏风散寒，清头目。',
    indication: '感冒、头痛、颈项强痛、目眩。',
    method: '双手拇指按揉，向对侧眼睛方向用力。',
    caution: '严禁垂直向内深刺或过度用力。'
  },
  {
    name: '合谷',
    meridian: '手阳明大肠经',
    location: '在手背，第1、2掌骨间，当第2掌骨桡侧的中点处。',
    function: '解表散寒，止痛。',
    indication: '感冒、头痛、牙痛、腹痛。',
    method: '用力按揉，有明显酸胀感为宜。',
    caution: '孕妇禁用。'
  },
  {
    name: '足三里',
    meridian: '足阳明胃经',
    location: '在小腿外侧，犊鼻下3寸，犊鼻与解溪连线上。',
    function: '健脾和胃，扶正培元。',
    indication: '胃痛、腹胀、呕吐、泄泻、便秘、疲劳。',
    method: '指压、按揉或艾灸。',
    caution: '空腹或饱食后不宜立即进行。'
  }
];

const symptomComparisonData = [
  {
    symptomName: '咽痛',
    title: '偏风热',
    feature: '咽喉红肿疼痛明显，吞咽时加重',
    accompanying_signs: '发热、口渴、痰黄',
    self_observation_tip: '观察咽喉是否红肿，是否渴望喝冷水',
    diet_advice: '宜食清凉生津之品，如梨、荸荠、罗汉果。忌辛辣烟酒。',
    living_advice: '保持室内空气湿润，多饮温开水，减少用嗓。',
    treatment_suggestion: '辛凉清解。可参考使用板蓝根颗粒、牛黄解毒片等。'
  },
  {
    symptomName: '咽痛',
    title: '偏阴虚',
    feature: '咽干隐痛，夜间或多言后加重',
    accompanying_signs: '手足心热、盗汗、干咳少痰',
    self_observation_tip: '注意是否伴有口干舌燥，且喝水难解',
    diet_advice: '宜食滋阴润燥之品，如百合、银耳、蜂蜜。',
    living_advice: '避免熬夜，保持充足睡眠，忌食辛辣干燥食物。',
    treatment_suggestion: '滋阴降火。可参考使用知柏地黄丸、玄麦甘桔颗粒。'
  }
];

const knowledgeData = [
  {
    title: '基础理论 (理)',
    icon: '☯️',
    sections: [
      {
        title: '阴阳五行',
        content: '阴阳是宇宙万物对立统一的总规律，用于阐释人体组织结构、生理功能及病理变化。五行（木、火、土、金、水）则通过生克乘侮关系，揭示脏腑间的动态平衡。'
      },
      {
        title: '脏腑藏象',
        content: '“藏”指内在脏腑，“象”指外在征象。五脏（心肝脾肺肾）主藏精气，六腑（胆胃大肠小肠膀胱三焦）主传化物，通过“象”来察知内部脏腑的盈虚。'
      }
    ]
  }
];

async function seed() {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // 清理旧数据
    await Syndrome.deleteMany({});
    await Acupuncture.deleteMany({});
    await SymptomComparison.deleteMany({});
    await Knowledge.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // 插入新数据
    await Syndrome.insertMany(syndromesData);
    await Acupuncture.insertMany(acupunctureData);
    await SymptomComparison.insertMany(symptomComparisonData);
    await Knowledge.insertMany(knowledgeData);
    
    console.log('🚀 Successfully seeded data into MongoDB');

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();