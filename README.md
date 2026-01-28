# 中医智能问诊小程序 - 后台系统架构说明

## 1. 整体架构
本系统采用 **Node.js (Express)** 作为后端框架，结合 **SQLite** 轻量级数据库，实现了一个高效、解耦的辨证分析引擎。

- **Controller 层 (Routes)**: 负责 API 路由分发、请求参数验证与响应格式化。
- **Service 层**: 核心业务逻辑，包括基于规则的辨证算法。
- **Data 层**: 负责数据库交互，存储证型规则、方剂库及科普文案。

## 2. 数据库设计 (SQLite)

### 2.1 证型表 (syndromes)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER | 主键 |
| name | TEXT | 证型名称 (如：风寒感冒) |
| description | TEXT | 证型描述/辨证要点 |
| treatment_principle | TEXT | 治法原则 |
| lifestyle_advice | TEXT | 生活方式建议 |

### 2.2 方剂表 (prescriptions)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER | 主键 |
| syndrome_id | INTEGER | 关联证型 ID |
| name | TEXT | 方剂名称 |
| usage_instructions | TEXT | 用法参考 |

### 2.3 辨证规则表 (rules)
| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| id | INTEGER | 主键 |
| syndrome_id | INTEGER | 关联证型 ID |
| field | TEXT | 症状字段名 (如：fever, chills) |
| value | TEXT | 匹配值 (如：high, severe) |

## 3. 核心 API 接口

### 3.1 症状分析
- **URL**: `/api/analyze`
- **Method**: `POST`
- **Body**:
```json
{
  "fever": "high",
  "chills": "mild",
  "soreThroat": "severe",
  "nasal": "yellow",
  "otherSymptoms": ["headache"]
}
```
- **Success Response**:
```json
{
  "code": 200,
  "data": {
    "syndrome": "风热感冒",
    "syndromeDesc": "外感风热，肺卫失宣",
    "treatment": "疏风清热，宣肺解表",
    "prescriptions": ["银翘散", "桑菊饮"],
    "lifestyle": ["多喝温开水", "避免辛辣"],
    "disclaimer": "..."
  }
}
```

## 4. 辨证逻辑伪代码
```javascript
function analyze(userSymptoms) {
  let scores = {}; // 记录每个证型的匹配分数
  
  for (let rule in allRules) {
    if (userSymptoms[rule.field] === rule.value) {
      scores[rule.syndrome_id]++;
    }
  }
  
  let bestSyndrome = findMaxScore(scores);
  return getSyndromeDetails(bestSyndrome);
}
```

## 5. 开发与部署
1. 进入 `server` 目录
2. 运行 `npm install` 安装依赖
3. 运行 `npm run seed` 初始化数据库数据
4. 运行 `npm start` 启动服务 (默认端口 3000)
