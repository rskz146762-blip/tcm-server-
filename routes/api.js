import express from 'express';
import tcmService from '../services/tcmService.js';

const router = express.Router();

/**
 * @api {post} /api/chat AI 聊天问诊接口
 */
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ code: 400, message: '消息格式错误' });
    }
    const result = await tcmService.processChat(messages);
    res.json({ code: 200, data: result });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ code: 500, message: '咨询失败，请稍后再试' });
  }
});

/**
 * @api {post} /api/analyze 辨证分析接口
 */
router.post('/analyze', async (req, res) => {
  try {
    const symptomData = req.body;
    let result;
    
    if (symptomData.mode === 'constitution') {
      result = await tcmService.analyzeConstitution(symptomData);
    } else {
      result = await tcmService.analyze(symptomData);
    }
    
    res.json({ code: 200, data: result });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ code: 500, message: '分析失败，请稍后再试' });
  }
});

/**
 * @api {post} /api/constitution-quiz 九种体质问卷识别接口
 */
router.post('/constitution-quiz', async (req, res) => {
  try {
    const quizAnswers = req.body;
    if (!quizAnswers || typeof quizAnswers !== 'object') {
      return res.status(400).json({ code: 400, message: '问卷数据格式错误' });
    }
    const result = await tcmService.analyzeConstitutionByQuiz(quizAnswers);
    res.json(result);
  } catch (error) {
    console.error('Constitution quiz error:', error);
    res.status(500).json({ code: 500, message: '判定失败，请稍后再试' });
  }
});

/**
 * @api {get} /api/symptom-comparison 症状对照自查接口
 */
router.get('/symptom-comparison', async (req, res) => {
  try {
    const { symptom } = req.query;
    if (!symptom) {
      return res.status(400).json({ code: 400, message: '症状不能为空' });
    }
    const result = await tcmService.analyzeSymptomComparison(symptom);
    res.json({ code: 200, data: result });
  } catch (error) {
    console.error('Symptom comparison error:', error);
    res.status(500).json({ code: 500, message: '分析失败，请稍后再试' });
  }
});

/**
 * @api {get} /api/admin/syndromes 分页获取证型列表（Admin）
 */
router.get('/admin/syndromes', async (req, res) => {
  try {
    const { current = 1, pageSize = 10, keyword = '' } = req.query;
    const result = await tcmService.getAllSyndromes({
      current: parseInt(current),
      pageSize: parseInt(pageSize),
      keyword
    });
    res.json({ code: 200, data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取列表失败' });
  }
});

/**
 * @api {post} /api/admin/syndrome 更新或添加证型（Admin）
 */
router.post('/admin/syndrome', async (req, res) => {
  try {
    const data = req.body;
    if (!data.name) {
      return res.status(400).json({ code: 400, message: '证型名称不能为空' });
    }
    await tcmService.saveSyndrome(data);
    res.json({ code: 200, message: '保存成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '保存失败' });
  }
});

/**
 * @api {delete} /api/admin/syndromes 批量删除证型（Admin）
 */
router.delete('/api/admin/syndromes', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ code: 400, message: '参数错误' });
    }
    await tcmService.deleteSyndromes(ids);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '删除失败' });
  }
});

/**
 * @api {get} /api/admin/patient-stats 获取真实患者发病率统计（Admin）
 */
router.get('/admin/patient-stats', async (req, res) => {
  try {
    const { timeRange = 'all' } = req.query;
    const stats = await tcmService.getPatientStats(timeRange);
    res.json({ code: 200, data: stats });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取统计失败' });
  }
});

/**
 * @api {get} /api/admin/constitution-stats 获取测试人体质统计（Admin）
 */
router.get('/admin/constitution-stats', async (req, res) => {
  try {
    const { timeRange = 'all' } = req.query;
    const stats = await tcmService.getConstitutionStats(timeRange);
    res.json({ code: 200, data: stats });
  } catch (error) {
    console.error('Constitution stats error:', error);
    res.status(500).json({ code: 500, message: '获取体质统计失败' });
  }
});

/**
 * @api {get} /api/admin/diagnosis-records 获取详细诊断记录（Admin）
 */
router.get('/admin/diagnosis-records', async (req, res) => {
  try {
    const { current = 1, pageSize = 10 } = req.query;
    const result = await tcmService.getDiagnosisRecords({
      current: parseInt(current),
      pageSize: parseInt(pageSize)
    });
    res.json({ code: 200, data: result });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取记录失败' });
  }
});

/**
 * @api {get} /api/solar-term 获取当前最近的节气建议
 */
router.get('/solar-term', async (req, res) => {
  try {
    const term = await tcmService.getNearestSolarTerm();
    res.json({ code: 200, data: term });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取节气建议失败' });
  }
});

/**
 * @api {get} /api/ai/health-context 获取 AI 健康助手上下文（金句、提醒等）
 */
router.get('/ai/health-context', async (req, res) => {
  try {
    const goldSentence = await tcmService.getDailyGoldSentence();
    const nightReminder = await tcmService.getNightReminder();
    res.json({ 
      code: 200, 
      data: { 
        goldSentence, 
        nightReminder,
        basePrompt: tcmService.aiConfig.basePrompt 
      } 
    });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取 AI 上下文失败' });
  }
});

/**
 * @api {post} /api/daily-status 提交并分析每日状态
 */
router.post('/daily-status', async (req, res) => {
  try {
    const status = req.body;
    const analysis = await tcmService.analyzeDailyStatus(status);
    res.json({ code: 200, data: analysis });
  } catch (error) {
    res.status(500).json({ code: 500, message: '分析每日状态失败' });
  }
});

/**
 * @api {get} /api/acupuncture-data 获取穴位百科公开数据
 */
router.get('/acupuncture-data', async (req, res) => {
  try {
    const data = await tcmService.getAcupunctureData();
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取穴位数据失败' });
  }
});

/**
 * @api {get} /api/symptom-list 获取支持对照分析的症状列表
 */
router.get('/symptom-list', async (req, res) => {
  try {
    const data = await tcmService.getSymptomComparisonData();
    const list = Object.keys(data);
    res.json({ code: 200, data: list });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取症状列表失败' });
  }
});

/**
 * @api {get} /api/knowledge 获取中医基础知识
 */
router.get('/knowledge', async (req, res) => {
  try {
    const data = await tcmService.getKnowledgeData();
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取基础知识失败' });
  }
});

/**
 * @api {get} /api/admin/acupuncture-data 获取穴位百科数据（Admin）
 */
router.get('/admin/acupuncture-data', async (req, res) => {
  try {
    const data = await tcmService.getAcupunctureData();
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取穴位数据失败' });
  }
});

/**
 * @api {post} /api/admin/acupuncture-data 更新穴位百科数据（Admin）
 */
router.post('/admin/acupuncture-data', async (req, res) => {
  try {
    const data = req.body;
    await tcmService.updateAcupunctureData(data);
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
});

/**
 * @api {get} /api/admin/symptom-comparison 获取症状对照数据（Admin）
 */
router.get('/admin/symptom-comparison', async (req, res) => {
  try {
    const data = await tcmService.getSymptomComparisonData();
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取症状对照数据失败' });
  }
});

/**
 * @api {post} /api/admin/symptom-comparison 更新症状对照数据（Admin）
 */
router.post('/admin/symptom-comparison', async (req, res) => {
  try {
    const data = req.body;
    await tcmService.updateSymptomComparisonData(data);
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
});

/**
 * @api {get} /api/admin/knowledge 获取中医常识数据（Admin）
 */
router.get('/admin/knowledge', async (req, res) => {
  try {
    const data = await tcmService.getKnowledgeData();
    res.json({ code: 200, data });
  } catch (error) {
    res.status(500).json({ code: 500, message: '获取中医常识数据失败' });
  }
});

/**
 * @api {post} /api/admin/knowledge 更新中医常识数据（Admin）
 */
router.post('/admin/knowledge', async (req, res) => {
  try {
    const data = req.body;
    await tcmService.updateKnowledgeData(data);
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    res.status(500).json({ code: 500, message: '更新失败' });
  }
});

export default router;