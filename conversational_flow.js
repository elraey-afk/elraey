// الأسئلة المتسلسلة لكل خدمة
const serviceFlows = {
  BUY: {
    name: 'شراء عقار',
    questions: [
      {
        id: 'property_type',
        question: '🏠 ما نوع العقار اللي بتدور عليه؟\n\nأختار من:\n• شقة\n• فيلا\n• أرض\n• محل\n• مكتب',
        validation: (answer) => ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'].some(type => answer.includes(type)),
        errorMessage: 'الرجاء اختيار نوع عقار صحيح من القائمة'
      },
      {
        id: 'location',
        question: '📍 في أي منطقة بتدور عليه؟ (مثال: المعادي، الشيخ زايد، إلخ)',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة اسم المنطقة بشكل واضح'
      },
      {
        id: 'area',
        question: '📐 كم المساحة تقريباً؟ (بالمتر المربع)',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال رقم صحيح للمساحة'
      },
      {
        id: 'budget',
        question: '💰 كم الميزانية؟ (بالجنيه المصري)',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال رقم صحيح للميزانية'
      },
      {
        id: 'rooms',
        question: '🛏️ كم عدد الغرف المطلوبة؟',
        validation: (answer) => !isNaN(answer) && parseInt(answer) >= 0,
        errorMessage: 'الرجاء إدخال رقم صحيح لعدد الغرف'
      },
      {
        id: 'phone',
        question: '📱 رقم هاتفك للتواصل؟',
        validation: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
        errorMessage: 'الرجاء إدخال رقم هاتف مصري صحيح'
      }
    ]
  },

  RESAL: {
    name: 'بيع عقار',
    questions: [
      {
        id: 'property_type',
        question: '🏠 ما نوع العقار اللي تريد بيعه؟\n\n• شقة\n• فيلا\n• أرض\n• محل\n• مكتب',
        validation: (answer) => ['شقة', 'فيلا', 'أرض', 'محل', 'مكتب'].some(type => answer.includes(type)),
        errorMessage: 'الرجاء اختيار نوع عقار صحيح'
      },
      {
        id: 'location',
        question: '📍 في أي منطقة؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة المنطقة بشكل واضح'
      },
      {
        id: 'area',
        question: '📐 المساحة بالمتر المربع؟',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال رقم صحيح'
      },
      {
        id: 'price',
        question: '💰 السعر المطلوب؟ (بالجنيه)',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال السعر بشكل صحيح'
      },
      {
        id: 'rooms',
        question: '🏢 عدد الغرف والأدوار إن وجدت؟',
        validation: (answer) => answer.trim().length >= 1,
        errorMessage: 'الرجاء الإجابة على هذا السؤال'
      },
      {
        id: 'property_condition',
        question: '📄 حالة العقار والأوراق المتاحة؟\n\n• عقد ملكية\n• تصرفات\n• فاتورة مياه/كهرباء\n• خريطة',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء وصف حالة العقار والأوراق'
      },
      {
        id: 'phone',
        question: '📱 رقم هاتفك؟',
        validation: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
        errorMessage: 'الرجاء إدخال رقم هاتف صحيح'
      }
    ]
  },

  RENT: {
    name: 'إيجار عقار',
    questions: [
      {
        id: 'property_type',
        question: '🏠 نوع العقار المطلوب؟\n\n• شقة\n• فيلا\n• محل\n• مكتب',
        validation: (answer) => ['شقة', 'فيلا', 'محل', 'مكتب'].some(type => answer.includes(type)),
        errorMessage: 'الرجاء اختيار نوع عقار صحيح'
      },
      {
        id: 'location',
        question: '📍 الحي أو المنطقة المفضلة؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة المنطقة'
      },
      {
        id: 'budget',
        question: '💰 الميزانية الشهرية؟ (بالجنيه)',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال رقم صحيح'
      },
      {
        id: 'rooms',
        question: '🛏️ عدد الغرف المطلوبة؟',
        validation: (answer) => !isNaN(answer) && parseInt(answer) >= 0,
        errorMessage: 'الرجاء إدخال رقم صحيح'
      },
      {
        id: 'furnished',
        question: '🪑 مفروش أو غير مفروش؟\n\n• مفروش\n• غير مفروش\n• لا يهم',
        validation: (answer) => ['مفروش', 'غير مفروش', 'لا يهم'].some(type => answer.includes(type)),
        errorMessage: 'الرجاء الاختيار من الخيارات'
      },
      {
        id: 'phone',
        question: '📱 رقم التواصل؟',
        validation: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
        errorMessage: 'الرجاء إدخال رقم هاتف صحيح'
      }
    ]
  },

  INVEST: {
    name: 'استثمار عقاري',
    questions: [
      {
        id: 'budget',
        question: '💰 رأس المال المتاح؟ (بالجنيه)',
        validation: (answer) => !isNaN(answer) && parseInt(answer) > 0,
        errorMessage: 'الرجاء إدخال رقم صحيح'
      },
      {
        id: 'location',
        question: '📍 المنطقة المفضلة؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة المنطقة'
      },
      {
        id: 'property_type',
        question: '🏠 نوع العقار المفضل للاستثمار؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة نوع العقار'
      },
      {
        id: 'investment_goal',
        question: '🎯 ما هدفك من الاستثمار؟\n\n• تأجير (دخل شهري)\n• إعادة بيع (مكسب رأسمالي)\n• الاثنين معاً',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء توضيح الهدف'
      },
      {
        id: 'duration',
        question: '⏳ المدة المتوقعة للاستثمار؟ (سنة، سنتين، إلخ)',
        validation: (answer) => answer.trim().length >= 1,
        errorMessage: 'الرجاء إدخال المدة'
      },
      {
        id: 'phone',
        question: '📱 رقم هاتفك؟',
        validation: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
        errorMessage: 'الرجاء إدخال رقم هاتف صحيح'
      }
    ]
  },

  ENGINEERING: {
    name: 'استشارة هندسية',
    questions: [
      {
        id: 'location',
        question: '📍 موقع العقار؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة الموقع'
      },
      {
        id: 'property_type',
        question: '🏠 نوع العقار؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء كتابة نوع العقار'
      },
      {
        id: 'service_type',
        question: '🛠️ نوع الخدمة المطلوبة؟\n\n• تشطيبات\n• ترخيص بناء\n• استخراج أوراق\n• استشارة هندسية\n• أخرى',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء تحديد نوع الخدمة'
      },
      {
        id: 'documents',
        question: '📄 الأوراق المتوفرة حالياً؟',
        validation: (answer) => answer.trim().length >= 3,
        errorMessage: 'الرجاء وصف الأوراق المتوفرة'
      },
      {
        id: 'details',
        question: '📝 تفاصيل إضافية أو ملاحظات؟',
        validation: (answer) => answer.trim().length >= 1,
        errorMessage: 'الرجاء إدخال بعض التفاصيل'
      },
      {
        id: 'phone',
        question: '📱 رقم هاتفك للتواصل؟',
        validation: (answer) => /^01[0-9]{9}$/.test(answer.replace(/\s/g, '')),
        errorMessage: 'الرجاء إدخال رقم هاتف صحيح'
      }
    ]
  }
};

// فئة إدارة الـ State والـ Flow
class ConversationalFlowManager {
  constructor() {
    this.userSessions = new Map(); // تخزين جلسات المستخدمين
  }

  // بدء جلسة جديدة لمستخدم
  startSession(userId, serviceType) {
    const flow = serviceFlows[serviceType];
    if (!flow) {
      return { error: 'خدمة غير معروفة' };
    }

    const session = {
      userId,
      serviceType,
      serviceName: flow.name,
      currentQuestionIndex: 0,
      collectedData: {},
      startedAt: new Date(),
      status: 'in_progress'
    };

    this.userSessions.set(userId, session);
    return this.getCurrentQuestion(userId);
  }

  // الحصول على السؤال الحالي
  getCurrentQuestion(userId) {
    const session = this.userSessions.get(userId);
    if (!session) {
      return { error: 'لا توجد جلسة نشطة' };
    }

    const flow = serviceFlows[session.serviceType];
    const questionIndex = session.currentQuestionIndex;

    if (questionIndex >= flow.questions.length) {
      return this.completeSession(userId);
    }

    const currentQuestion = flow.questions[questionIndex];
    return {
      success: true,
      questionNumber: questionIndex + 1,
      totalQuestions: flow.questions.length,
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      collectedData: session.collectedData
    };
  }

  // معالجة إجابة المستخدم
  processAnswer(userId, answer) {
    const session = this.userSessions.get(userId);
    if (!session) {
      return { error: 'لا توجد جلسة نشطة', action: 'start_new' };
    }

    const flow = serviceFlows[session.serviceType];
    const currentQuestion = flow.questions[session.currentQuestionIndex];

    // التحقق من صحة الإجابة
    if (!currentQuestion.validation(answer)) {
      return {
        success: false,
        isValid: false,
        errorMessage: currentQuestion.errorMessage,
        questionId: currentQuestion.id,
        question: currentQuestion.question
      };
    }

    // حفظ الإجابة
    session.collectedData[currentQuestion.id] = answer;
    session.currentQuestionIndex++;

    // الانتقال للسؤال التالي
    return this.getCurrentQuestion(userId);
  }

  // إكمال الجلسة وجمع البيانات
  completeSession(userId) {
    const session = this.userSessions.get(userId);
    if (!session) {
      return { error: 'لا توجد جلسة نشطة' };
    }

    session.status = 'completed';
    session.completedAt = new Date();

    const summary = {
      success: true,
      status: 'completed',
      serviceName: session.serviceName,
      allData: session.collectedData,
      duration: new Date() - session.startedAt
    };

    return summary;
  }

  // إلغاء الجلسة
  cancelSession(userId) {
    if (this.userSessions.has(userId)) {
      this.userSessions.delete(userId);
      return { success: true, message: 'تم إلغاء الجلسة' };
    }
    return { error: 'لا توجد جلسة لإلغاءها' };
  }

  // الحصول على جلسة المستخدم (للفحص)
  getSession(userId) {
    return this.userSessions.get(userId);
  }
}

// إنشاء instance واحد لإدارة الجلسات
const flowManager = new ConversationalFlowManager();

module.exports = {
  serviceFlows,
  ConversationalFlowManager,
  flowManager
};
