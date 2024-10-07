import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      "Welcome to Echoes": "مرحبًا بك في إيكوز",
      "Discover voices, share stories": "اكتشف الأصوات، شارك القصص",
      "Home": "الرئيسية",
      "Record": "تسجيل",
      "Notifications": "الإشعارات",
      "Car Mode": "وضع السيارة",
      "Trending": "الأكثر رواجًا",
      "Newest": "الأحدث",
      "Most Liked": "الأكثر إعجابًا",
      "Echo Feed": "تغذية الصدى",
      "Select country...": "اختر الدولة...",
      "Play": "تشغيل",
      "Like": "إعجاب",
      "Reply": "رد",
      "Share": "مشاركة",
      "Report": "إبلاغ",
      "Save": "حفظ",
      "Unsave": "إلغاء الحفظ",
      "Create New Echo": "إنشاء صدى جديد",
      "Echo Title": "عنوان الصدى",
      "Enter a title for your echo": "أدخل عنوانًا لصداك",
      "Country": "الدولة",
      "Share Echo": "مشاركة الصدى",
      "You are currently offline. Some features may be limited.": "أنت حاليًا غير متصل بالإنترنت. قد تكون بعض الميزات محدودة.",
      "Loading...": "جاري التحميل...",
      "No echoes found": "لم يتم العثور على أصداء",
      "Something went wrong": "حدث خطأ ما",
      "Try Again": "حاول مرة أخرى",
      "Echo of Voices": "صدى الأصوات"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
