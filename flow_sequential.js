// ============================================
// SEQUENTIAL QUESTION-ANSWER FLOW
// استخدم هذا الكود بدل serviceContent الحالي
// ============================================

const questionFlows = {
  BUY: [
    { key: 'property_type', q: '🏠 ما نوع العقار؟ (شقة/فيلا/أرض/محل/مكتب)', validate: v => ['شقة','فيلا','أرض','محل','مكتب'].some(x => v.includes(x)) },
    { key: 'location', q: '📍 في أي منطقة؟', validate: v => v.trim().length >= 3 },
    { key: 'area', q: '📐 المساحة بالمتر؟', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'budget', q: '💰 الميزانية؟ (بالجنيه)', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'rooms', q: '🛏️ عدد الغرف؟', validate: v => !isNaN(v) && parseInt(v) >= 0 },
    { key: 'phone', q: '📱 رقم الهاتف؟', validate: v => /^01[0-9]{9}$/.test(v.replace(/\s/g,'')) }
  ],
  
  RESAL: [
    { key: 'property_type', q: '🏠 نوع العقار؟ (شقة/فيلا/أرض/محل/مكتب)', validate: v => ['شقة','فيلا','أرض','محل','مكتب'].some(x => v.includes(x)) },
    { key: 'location', q: '📍 المنطقة؟', validate: v => v.trim().length >= 3 },
    { key: 'area', q: '📐 المساحة؟', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'price', q: '💰 السعر المطلوب؟', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'rooms', q: '🏢 عدد الغرف والأدوار؟', validate: v => v.trim().length >= 1 },
    { key: 'phone', q: '📱 رقم الهاتف؟', validate: v => /^01[0-9]{9}$/.test(v.replace(/\s/g,'')) }
  ],
  
  RENT: [
    { key: 'property_type', q: '🏠 نوع العقار؟ (شقة/فيلا/محل/مكتب)', validate: v => ['شقة','فيلا','محل','مكتب'].some(x => v.includes(x)) },
    { key: 'location', q: '📍 المنطقة؟', validate: v => v.trim().length >= 3 },
    { key: 'budget', q: '💰 الميزانية الشهرية؟', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'rooms', q: '🛏️ عدد الغرف؟', validate: v => !isNaN(v) && parseInt(v) >= 0 },
    { key: 'furnished', q: '🪑 مفروش أم غير مفروش؟', validate: v => ['مفروش','غير مفروش','لا يهم'].some(x => v.includes(x)) },
    { key: 'phone', q: '📱 رقم الهاتف؟', validate: v => /^01[0-9]{9}$/.test(v.replace(/\s/g,'')) }
  ],
  
  INVEST: [
    { key: 'budget', q: '💰 رأس المال؟', validate: v => !isNaN(v) && parseInt(v) > 0 },
    { key: 'location', q: '📍 المنطقة المفضلة؟', validate: v => v.trim().length >= 3 },
    { key: 'property_type', q: '🏠 نوع الاستثمار؟', validate: v => v.trim().length >= 3 },
    { key: 'goal', q: '🎯 الهدف؟ (تأجير/بيع/الاثنين)', validate: v => v.trim().length >= 2 },
    { key: 'duration', q: '⏳ المدة المتوقعة؟', validate: v => v.trim().length >= 1 },
    { key: 'phone', q: '📱 رقم الهاتف؟', validate: v => /^01[0-9]{9}$/.test(v.replace(/\s/g,'')) }
  ],
  
  ENGINEERING: [
    { key: 'location', q: '📍 موقع العقار؟', validate: v => v.trim().length >= 3 },
    { key: 'property_type', q: '🏠 نوع العقار؟', validate: v => v.trim().length >= 3 },
    { key: 'service_type', q: '🛠️ نوع الخدمة؟ (تشطيبات/ترخيص/أوراق/استشارة)', validate: v => v.trim().length >= 3 },
    { key: 'documents', q: '📄 الأوراق المتوفرة؟', validate: v => v.trim().length >= 3 },
    { key: 'phone', q: '📱 رقم الهاتف؟', validate: v => /^01[0-9]{9}$/.test(v.replace(/\s/g,'')) }
  ]
};

const sessionStore = {};

function startFlow(userId, serviceType) {
  if (!questionFlows[serviceType]) {
    return { error: true, message: 'خدمة غير معروفة' };
  }
  
  sessionStore[userId] = {
    service: serviceType,
    step: 0,
    data: {}
  };
  
  const firstQuestion = questionFlows[serviceType][0];
  return {
    error: false,
    reply_text: firstQuestion.q,
    step: 1,
    total: questionFlows[serviceType].length,
    status: 'waiting_answer'
  };
}

function processAnswer(userId, userAnswer) {
  if (!sessionStore[userId]) {
    return { error: true, message: 'لا توجد جلسة نشطة' };
  }
  
  const session = sessionStore[userId];
  const questions = questionFlows[session.service];
  const currentQuestion = questions[session.step];
  
  // تحقق من صحة الإجابة
  if (!currentQuestion.validate(userAnswer)) {
    return {
      error: true,
      reply_text: '❌ إجابة غير صحيحة\n\n' + currentQuestion.q,
      step: session.step + 1,
      total: questions.length,
      status: 'retry'
    };
  }
  
  // حفظ الإجابة الصحيحة
  session.data[currentQuestion.key] = userAnswer.trim();
  session.step++;
  
  // هل انتهت كل الأسئلة؟
  if (session.step >= questions.length) {
    const finalData = {
      serviceType: session.service,
      ...session.data,
      timestamp: new Date()
    };
    delete sessionStore[userId];
    
    return {
      error: false,
      reply_text: '✅ تم جمع البيانات بنجاح! شكراً لك',
      completed: true,
      data: finalData,
      status: 'completed'
    };
  }
  
  // انتقل للسؤال التالي
  const nextQuestion = questions[session.step];
  return {
    error: false,
    reply_text: nextQuestion.q,
    step: session.step + 1,
    total: questions.length,
    status: 'waiting_answer'
  };
}

module.exports = {
  questionFlows,
  sessionStore,
  startFlow,
  processAnswer
};
