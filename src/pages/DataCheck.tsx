import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText, MessageSquare, ThumbsUp, ThumbsDown, RotateCcw, Save } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  isCorrect: boolean | null;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

interface DataCheckResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  usabilityScore: number;
  recommendations: string[];
}

const DataCheck = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 模拟文档信息
  const documentInfo = {
    id: id || '1',
    title: '2024年法律合规指南.pdf',
    size: '2.5 MB',
    uploadedAt: '2024-04-10 14:30'
  };

  // 模拟问题数据
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q1',
      question: '根据文档内容，企业合规体系的核心组成部分是什么？',
      expectedAnswer: '风险管理是合规体系的核心组成部分',
      userAnswer: '',
      isCorrect: null,
      difficulty: 'easy',
      category: '基础概念'
    },
    {
      id: 'q2',
      question: '文档中提到的主要风险类别包括哪些？请至少列出三种。',
      expectedAnswer: '监管风险、操作风险、声誉风险',
      userAnswer: '',
      isCorrect: null,
      difficulty: 'medium',
      category: '风险分类'
    },
    {
      id: 'q3',
      question: '根据合规检查清单，数据保护合规的负责部门是什么？完成时间是什么时候？',
      expectedAnswer: 'IT部门，2024-03-01',
      userAnswer: '',
      isCorrect: null,
      difficulty: 'hard',
      category: '具体细节'
    },
    {
      id: 'q4',
      question: '文档中提到企业需要遵守哪些监管机构的要求？',
      expectedAnswer: '证监会、银保监会、央行等部门',
      userAnswer: '',
      isCorrect: null,
      difficulty: 'medium',
      category: '监管要求'
    },
    {
      id: 'q5',
      question: '根据风险评估矩阵，监管风险的发生概率和影响程度分别是什么？',
      expectedAnswer: '发生概率：高，影响程度：严重',
      userAnswer: '',
      isCorrect: null,
      difficulty: 'hard',
      category: '数据分析'
    }
  ]);

  const currentQuestion = questions[currentQuestionIndex];

  // 更新当前问题的答案
  const updateAnswer = (answer: string) => {
    setQuestions(prev => prev.map((q, index) => 
      index === currentQuestionIndex ? { ...q, userAnswer: answer } : q
    ));
  };

  // 评估答案正确性
  const evaluateAnswer = (isCorrect: boolean) => {
    setQuestions(prev => prev.map((q, index) => 
      index === currentQuestionIndex ? { ...q, isCorrect } : q
    ));
  };

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
      calculateResults();
    }
  };

  // 上一题
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 计算结果
  const calculateResults = (): DataCheckResult => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => q.isCorrect === true).length;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    
    let usabilityScore = 0;
    let recommendations: string[] = [];

    if (accuracy >= 90) {
      usabilityScore = 95;
      recommendations = ['文档质量优秀，可直接用于生产环境', '建议定期更新以保持时效性'];
    } else if (accuracy >= 75) {
      usabilityScore = 80;
      recommendations = ['文档质量良好，建议补充部分细节信息', '可用于大部分场景，需要人工审核关键部分'];
    } else if (accuracy >= 60) {
      usabilityScore = 65;
      recommendations = ['文档存在一定问题，需要重新整理部分内容', '建议增加更多验证步骤', '谨慎用于重要决策'];
    } else {
      usabilityScore = 40;
      recommendations = ['文档质量较差，不建议直接使用', '需要重新处理或补充大量信息', '建议重新上传或使用其他数据源'];
    }

    return {
      totalQuestions,
      correctAnswers,
      accuracy,
      usabilityScore,
      recommendations
    };
  };

  const results = calculateResults();

  // 重新开始
  const restart = () => {
    setQuestions(prev => prev.map(q => ({ ...q, userAnswer: '', isCorrect: null })));
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setShowResults(false);
  };

  // 完成检查
  const completeCheck = () => {
    // 这里应该调用API保存检查结果
    alert(`数据反查完成！\n准确率: ${results.accuracy.toFixed(1)}%\n可用性评分: ${results.usabilityScore}/100`);
    navigate('/my-workspace/process');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      default: return '未知';
    }
  };

  if (showResults) {
    return (
      <div className="animate-fade-in h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setShowResults(false)}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm">返回</span>
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            数据反查结果 - {documentInfo.title}
          </h1>
          
          <button
            onClick={completeCheck}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            <Save className="h-4 w-4" />
            完成检查
          </button>
        </div>

        {/* Results Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Overall Score */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">总体评估</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{results.correctAnswers}/{results.totalQuestions}</div>
                  <div className="text-sm text-gray-500">正确答案</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{results.accuracy.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">准确率</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{results.usabilityScore}/100</div>
                  <div className="text-sm text-gray-500">可用性评分</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">建议</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Question Details */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">问题详情</h3>
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">问题 {index + 1}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(q.difficulty)}`}>
                          {getDifficultyText(q.difficulty)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {q.category}
                        </span>
                        {q.isCorrect === true ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : q.isCorrect === false ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{q.question}</p>
                    <div className="text-xs text-gray-500">
                      <div className="mb-1"><strong>期望答案:</strong> {q.expectedAnswer}</div>
                      <div><strong>用户答案:</strong> {q.userAnswer || '未回答'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
              <button
                onClick={restart}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                重新测试
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <button
                      onClick={() => navigate(`/my-workspace/validation/${id}`)}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm">返回验证</span>
        </button>
        
        <h1 className="text-lg font-semibold text-gray-900">
          数据反查 - {documentInfo.title}
        </h1>
        
        <button
          onClick={() => setShowResults(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          查看结果
        </button>
      </div>

      {/* Progress */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            问题 {currentQuestionIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% 完成
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Document Preview */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <span className="text-gray-500">文档预览区域</span>
            <p className="text-xs text-gray-400 mt-2">可在此查看相关文档内容</p>
          </div>
        </div>

        {/* Right: Question Interface */}
        <div className="w-1/2 flex flex-col">
          {/* Question Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(currentQuestion.difficulty)}`}>
                {getDifficultyText(currentQuestion.difficulty)}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {currentQuestion.category}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Answer Area */}
          <div className="flex-1 p-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                您的答案
              </label>
              <textarea
                value={currentQuestion.userAnswer}
                onChange={(e) => updateAnswer(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请根据文档内容回答问题..."
              />
            </div>

            {/* Expected Answer (for reference) */}
            <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
              <label className="block text-sm font-medium text-blue-700 mb-1">
                参考答案
              </label>
              <p className="text-sm text-blue-600">{currentQuestion.expectedAnswer}</p>
            </div>

            {/* Evaluation */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评估答案正确性
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => evaluateAnswer(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentQuestion.isCorrect === true
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  正确
                </button>
                <button
                  onClick={() => evaluateAnswer(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
                    currentQuestion.isCorrect === false
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  错误
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一题
              </button>
              <button
                onClick={nextQuestion}
                disabled={currentQuestion.isCorrect === null}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestionIndex === questions.length - 1 ? '完成测试' : '下一题'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataCheck; 