import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const i18n = new I18n({
  en: {
    // Navigation
    home: 'Home',
    jobs: 'Jobs',
    messages: 'Messages',
    profile: 'Profile',
    search: 'Search',
    
    // Authentication
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    name: 'Full Name',
    phone: 'Phone Number',
    forgotPassword: 'Forgot Password?',
    loginButton: 'Login',
    registerButton: 'Create Account',
    registeringAs: 'Registering as',
    
    // User Types
    worker: 'Worker',
    client: 'Client',
    selectUserType: 'I am a...',
    workerDescription: 'Looking for work opportunities',
    clientDescription: 'Need to hire workers',
    
    // Worker Profile
    skills: 'Skills',
    experience: 'Experience',
    availability: 'Availability',
    hourlyRate: 'Hourly Rate',
    dailyRate: 'Daily Rate',
    serviceRadius: 'Service Radius',
    workHistory: 'Work History',
    ratings: 'Ratings',
    addSkill: 'Add Skill',
    
    // Job Posting
    postJob: 'Post a Job',
    jobTitle: 'Job Title',
    jobDescription: 'Job Description',
    requiredSkills: 'Required Skills',
    budget: 'Budget',
    duration: 'Duration (hours)',
    urgency: 'Urgency',
    location: 'Location',
    photos: 'Photos',
    findJobs: 'Find Jobs',
    
    // Job Status
    open: 'Open',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    
    // Messages
    typeMessage: 'Type a message...',
    send: 'Send',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    apply: 'Apply',
    hire: 'Hire',
    complete: 'Complete',
    rate: 'Rate',
    review: 'Review',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Greetings
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    
    // Location
    currentLocation: 'Current Location',
    selectLocation: 'Select Location',
    
    // Verification
    verifyIdentity: 'Verify Identity',
    uploadId: 'Upload ID Document',
    verified: 'Verified',
    pending: 'Pending Verification',
    
    // Payment
    payment: 'Payment',
    amount: 'Amount',
    currency: 'Currency',
    payNow: 'Pay Now',
    paymentSecured: 'Payment Secured',
    
    // Time
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    
    // Days
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  },
  ar: {
    // Navigation
    home: 'الرئيسية',
    jobs: 'الوظائف',
    messages: 'الرسائل',
    profile: 'الملف الشخصي',
    search: 'البحث',
    
    // Authentication
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    name: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    forgotPassword: 'نسيت كلمة المرور؟',
    loginButton: 'تسجيل الدخول',
    registerButton: 'إنشاء حساب',
    registeringAs: 'التسجيل كـ',
    
    // User Types
    worker: 'عامل',
    client: 'عميل',
    selectUserType: 'أنا...',
    workerDescription: 'أبحث عن فرص عمل',
    clientDescription: 'أحتاج إلى توظيف عمال',
    
    // Worker Profile
    skills: 'المهارات',
    experience: 'الخبرة',
    availability: 'التوفر',
    hourlyRate: 'الأجر بالساعة',
    dailyRate: 'الأجر اليومي',
    serviceRadius: 'نطاق الخدمة',
    workHistory: 'تاريخ العمل',
    ratings: 'التقييمات',
    addSkill: 'إضافة مهارة',
    
    // Job Posting
    postJob: 'نشر وظيفة',
    jobTitle: 'عنوان الوظيفة',
    jobDescription: 'وصف الوظيفة',
    requiredSkills: 'المهارات المطلوبة',
    budget: 'الميزانية',
    duration: 'المدة (ساعات)',
    urgency: 'الأولوية',
    location: 'الموقع',
    photos: 'الصور',
    findJobs: 'البحث عن وظائف',
    
    // Job Status
    open: 'مفتوح',
    assigned: 'معين',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    
    // Messages
    typeMessage: 'اكتب رسالة...',
    send: 'إرسال',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    apply: 'تطبيق',
    hire: 'توظيف',
    complete: 'إكمال',
    rate: 'تقييم',
    review: 'مراجعة',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
    
    // Greetings
    goodMorning: 'صباح الخير',
    goodAfternoon: 'مساء الخير',
    goodEvening: 'مساء الخير',
    
    // Location
    currentLocation: 'الموقع الحالي',
    selectLocation: 'اختيار الموقع',
    
    // Verification
    verifyIdentity: 'التحقق من الهوية',
    uploadId: 'رفع وثيقة الهوية',
    verified: 'محقق',
    pending: 'في انتظار التحقق',
    
    // Payment
    payment: 'الدفع',
    amount: 'المبلغ',
    currency: 'العملة',
    payNow: 'ادفع الآن',
    paymentSecured: 'الدفع مضمون',
    
    // Time
    today: 'اليوم',
    tomorrow: 'غداً',
    yesterday: 'أمس',
    
    // Days
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
  }
});

i18n.defaultLocale = 'en';
i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;