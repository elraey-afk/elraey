// ============================================
// Sequential Question-Answer Flow Handler
// ============================================

// خطة العمل:
// 1. العميل يختار الخدمة (BUY, RESAL, RENT, INVEST, ENGINEERING)
// 2. ننشئ SESSION جديد للعميل
// 3. نسأل سؤال واحد فقط
// 4. العميل يجيب
// 5. نتحقق من الإجابة
// 6. إذا صحيحة → نحفظ الإجابة ونسأل السؤال التالي
// 7. إذا غلط → نطلب منه يجاوب صح على نفس السؤال
// 8. عند انتهاء الأسئلة → نجمع كل البيانات ونرسلها

const questionsFlows = {
  BUY: [
    {
      step: 1,
      key: 'property_type',
      question: '🏠 ما نوع العقار اللي بتدور عليه؟',
      options: ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'],
      example: 'مثال: اكتب "شقة"',
      validate: (answer) => ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'].some(type => answer.includes(type)),
      error: '❌ اختر من: شقة / فيلا / أرض / محل / مكتب'
    },
    {
      step: 2,
      key: 'location',
      question: '📍 في أي منطقة بتدور عليه؟',
      example: 'مثال: المعادي، الشيخ زايد، النيل',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب اسم المنطقة بشكل واضح (3 أحرف على الأقل)'
    },
    {
      step: 3,
      key: 'area',
      question: '📐 كم المساحة بالمتر المربع؟',
      example: 'مثال: 120 أو 250',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب رقم صحيح للمساحة'
    },
    {
      step: 4,
      key: 'budget',
      question: '💰 كم الميزانية؟ (بالجنيه)',
      example: 'مثال: 500000',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب رقم صحيح للميزانية'
    },
    {
      step: 5,
      key: 'rooms',
      question: '🛏️ كم عدد الغرف المطلوبة؟',
      example: 'مثال: 2 أو 3',
      validate: (answer) => !isNaN(answer) && parseInt(answer) >= 0,
      error: '❌ اكتب رقم صحيح'
    },
    {
      step: 6,
      key: 'phone',
      question: '📱 رقم هاتفك للتواصل؟',
      example: 'مثال: 01012345678',
      validate: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
      error: '❌ اكتب رقم مصري صحيح (01XXXXXXXXX)'
    }
  ],

  RESAL: [
    {
      step: 1,
      key: 'property_type',
      question: '🏠 ما نوع العقار اللي تريد بيعه؟',
      options: ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'],
      validate: (answer) => ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'].some(type => answer.includes(type)),
      error: '❌ اختر من القائمة: شقة / فيلا / أرض / محل / مكتب'
    },
    {
      step: 2,
      key: 'location',
      question: '📍 في أي منطقة؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب اسم المنطقة'
    },
    {
      step: 3,
      key: 'area',
      question: '📐 المساحة بالمتر المربع؟',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب رقم صحيح'
    },
    {
      step: 4,
      key: 'price',
      question: '💰 السعر المطلوب؟ (بالجنيه)',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب السعر بشكل صحيح'
    },
    {
      step: 5,
      key: 'rooms',
      question: '🏢 عدد الغرف والأدوار؟',
      validate: (answer) => answer.trim().length >= 1,
      error: '❌ اكتب عدد الغرف'
    },
    {
      step: 6,
      key: 'phone',
      question: '📱 رقم هاتفك؟',
      validate: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
      error: '❌ اكتب رقم هاتف صحيح'
    }
  ],

  RENT: [
    {
      step: 1,
      key: 'property_type',
      question: '🏠 نوع العقار المطلوب؟',
      options: ['شقة', 'فيلا', 'محل', 'مكتب'],
      validate: (answer) => ['شقة', 'فيلا', 'محل', 'مكتب'].some(type => answer.includes(type)),
      error: '❌ اختر: شقة / فيلا / محل / مكتب'
    },
    {
      step: 2,
      key: 'location',
      question: '📍 المنطقة المفضلة؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب المنطقة'
    },
    {
      step: 3,
      key: 'budget',
      question: '💰 الميزانية الشهرية؟ (بالجنيه)',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب رقم صحيح'
    },
    {
      step: 4,
      key: 'rooms',
      question: '🛏️ عدد الغرف؟',
      validate: (answer) => !isNaN(answer) && parseInt(answer) >= 0,
      error: '❌ اكتب رقم صحيح'
    },
    {
      step: 5,
      key: 'furnished',
      question: '🪑 مفروش أو غير مفروش؟',
      options: ['مفروش', 'غير مفروش', 'لا يهم'],
      validate: (answer) => ['مفروش', 'غير مفروش', 'لا يهم'].some(type => answer.includes(type)),
      error: '❌ اختر: مفروش / غير مفروش / لا يهم'
    },
    {
      step: 6,
      key: 'phone',
      question: '📱 رقم التواصل؟',
      validate: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
      error: '❌ اكتب رقم هاتف صحيح'
    }
  ],

  INVEST: [
    {
      step: 1,
      key: 'budget',
      question: '💰 رأس المال المتاح؟ (بالجنيه)',
      validate: (answer) => !isNaN(answer) && parseInt(answer) > 0,
      error: '❌ اكتب رقم صحيح'
    },
    {
      step: 2,
      key: 'location',
      question: '📍 المنطقة المفضلة؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب المنطقة'
    },
    {
      step: 3,
      key: 'property_type',
      question: '🏠 نوع العقار للاستثمار؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب نوع العقار'
    },
    {
      step: 4,
      key: 'investment_goal',
      question: '🎯 الهدف؟ (تأجير / بيع / الاثنين)',
      options: ['تأجير', 'بيع', 'الاثنين'],
      validate: (answer) => answer.trim().length >= 2,
      error: '❌ اكتب الهدف'
    },
    {
      step: 5,
      key: 'duration',
      question: '⏳ المدة المتوقعة؟',
      validate: (answer) => answer.trim().length >= 1,
      error: '❌ اكتب المدة'
    },
    {
      step: 6,
      key: 'phone',
      question: '📱 رقم هاتفك؟',
      validate: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
      error: '❌ اكتب رقم هاتف صحيح'
    }
  ],

  ENGINEERING: [
    {
      step: 1,
      key: 'location',
      question: '📍 موقع العقار؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب الموقع'
    },
    {
      step: 2,
      key: 'property_type',
      question: '🏠 نوع العقار؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب نوع العقار'
    },
    {
      step: 3,
      key: 'service_type',
      question: '🛠️ نوع الخدمة؟\n(تشطيبات / ترخيص / أوراق / استشارة)',
      options: ['تشطيبات', 'ترخيص بناء', 'استخراج أوراق', 'استشارة هندسية'],
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب نوع الخدمة'
    },
    {
      step: 4,
      key: 'documents',
      question: '📄 الأوراق المتوفرة؟',
      validate: (answer) => answer.trim().length >= 3,
      error: '❌ اكتب الأوراق'
    },
    {
      step: 5,
      key: 'phone',
      question: '📱 رقم هاتفك؟',
      validate: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
      error: '❌ اكتب رقم هاتف صحيح'
    }
  ]
};

// ============================================
// دالة البدء: عند اختيار الخدمة
// ============================================
function startConversationalFlow(serviceType) {
  // serviceType = "BUY" أو "RESAL" أو "RENT" أو "INVEST" أو "ENGINEERING"
  
  if (!questionsFlows[serviceType]) {
    return {
      json: {
        error: true,
        message: 'خدمة غير معروفة'
      }
    };
  }

  // إنشاء session جديد
  const sessionData = {
    serviceType: serviceType,
    currentStep: 0, // نبدأ من السؤال الأول
    collectedData: {}, // تخزين الإجابات
    startedAt: new Date()
  };

  // حفظ الـ session في المتغيرات (سيتم استخدامه لاحقاً)
  const firstQuestion = questionsFlows[serviceType][0];

  return {
    json: {
      sessionData: sessionData,
      currentQuestion: firstQuestion,
      totalQuestions: questionsFlows[serviceType].length,
      currentStep: 1,
      question: firstQuestion.question,
      options: firstQuestion.options || null,
      example: firstQuestion.example || ''
    }
  };
}

// ============================================
// دالة معالجة الإجابة
// ============================================
function processUserAnswer(sessionData, userAnswer) {
  // sessionData = البيانات المحفوظة من قبل
  // userAnswer = إجابة العميل الجديدة

  const serviceType = sessionData.serviceType;
  const currentStep = sessionData.currentStep;
  const questions = questionsFlows[serviceType];

  if (!questions || currentStep >= questions.length) {
    return {
      json: {
        error: true,
        message: 'انتهت الأسئلة بالفعل'
      }
    };
  }

  const currentQuestion = questions[currentStep];

  // التحقق من صحة الإجابة
  if (!currentQuestion.validate(userAnswer)) {
    // الإجابة غلط → نطلب نفس السؤال مرة أخرى
    return {
      json: {
        isValid: false,
        error: currentQuestion.error,
        currentQuestion: currentQuestion,
        totalQuestions: questions.length,
        currentStep: currentStep + 1,
        question: currentQuestion.question,
        options: currentQuestion.options || null,
        example: currentQuestion.example || ''
      }
    };
  }

  // الإجابة صحيحة → حفظ الإجابة
  sessionData.collectedData[currentQuestion.key] = userAnswer;
  sessionData.currentStep++;

  // هل انتهينا من كل الأسئلة؟
  if (sessionData.currentStep >= questions.length) {
    // نعم → إرجاع ملخص البيانات
    return {
      json: {
        isValid: true,
        completed: true,
        message: '✅ شكراً على إجاباتك!',
        allData: sessionData.collectedData,
        sessionData: sessionData
      }
    };
  }

  // لا → انتقل للسؤال التالي
  const nextQuestion = questions[sessionData.currentStep];
  return {
    json: {
      isValid: true,
      completed: false,
      savedAnswer: userAnswer,
      currentQuestion: nextQuestion,
      totalQuestions: questions.length,
      currentStep: sessionData.currentStep + 1,
      question: nextQuestion.question,
      options: nextQuestion.options || null,
      example: nextQuestion.example || '',
      sessionData: sessionData
    }
  };
}

module.exports = {
  questionsFlows,
  startConversationalFlow,
  processUserAnswer
};
