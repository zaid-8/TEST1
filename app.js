const translations = {
  ar: {
    home: "الرئيسية", profile: "الملف الشخصي", about: "من نحن", subjects: "المواد",
    welcome: "أهلاً وسهلاً بكم في منصتنا التعليمية", heroText: "منصتك للوصول إلى المواد الدراسية والملفات التي تحتاجها خلال مسيرتك الجامعية.",
    explore: "استكشف المواد", studentInfo: "معلومات الطالب", hello: "مرحباً، الطالب 👋",
    majorLabel: "التخصص:", major: "هندسة البرمجيات", idLabel: "الرقم الجامعي:", yearLabel: "السنة الدراسية:", year: "الثانية",
    yourSubjects: "موادك الدراسية", openSubject: "عرض المادة", contact: "تواصل معنا",
    contactText: "إذا كان لديك أي استفسار أو تحتاج إلى مساعدة، يمكنك التواصل معنا.", platform: "منصتك التعليمية الجامعية",
    back: "العودة للمواد", download: "تحميل ملف PDF", pdfFallback: "لا يدعم متصفحك عرض PDF داخل الصفحة.",
    openPdf: "افتح الملف مباشرة", missingSubject: "المادة غير موجودة", theme: "تبديل المظهر", language: "English",
    aboutTitle: "من نحن", aboutText: "منصة تعليمية تساعد طلبة جامعة الإسراء على الوصول إلى موادهم بطريقة سهلة ومنظمة.", contactIntro: "إذا كان لديك استفسار أو ملاحظة، يمكنك التواصل معنا عبر المعلومات التالية.", email: "البريد الإلكتروني", phone: "رقم الهاتف", location: "موقع الجامعة", locationValue: "عمّان — الأردن — طريق المطار", academic: "المعلومات الأكاديمية", level: "المستوى الدراسي", count: "عدد المواد", countValue: "3 مواد", universityLabel: "الجامعة"
  },
  en: {
    home: "Home", profile: "Profile", about: "About", subjects: "Subjects",
    welcome: "Welcome to our learning platform", heroText: "Your place to access course materials and the files you need throughout university.",
    explore: "Explore subjects", studentInfo: "Student information", hello: "Welcome, student 👋",
    majorLabel: "Major:", major: "Software Engineering", idLabel: "Student ID:", yearLabel: "Academic year:", year: "Second",
    yourSubjects: "Your subjects", openSubject: "View subject", contact: "Contact us",
    contactText: "If you have a question or need help, you can contact us.", platform: "Your university learning platform",
    back: "Back to subjects", download: "Download PDF", pdfFallback: "Your browser cannot display PDFs inline.",
    openPdf: "Open the file directly", missingSubject: "Subject not found", theme: "Toggle theme", language: "العربية",
    aboutTitle: "About us", aboutText: "A learning platform that helps Al-Isra University students access their materials easily and clearly.", contactIntro: "If you have a question or note, reach us through the details below.", email: "Email", phone: "Phone number", location: "University location", locationValue: "Amman — Jordan — Airport Road", academic: "Academic information", level: "Study level", count: "Number of subjects", countValue: "3 subjects", universityLabel: "University"
  }
};

let language = localStorage.getItem("iu-language") || "ar";
const savedTheme = localStorage.getItem("iu-theme");
const initialTheme = savedTheme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

function applyPreferences() {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.dataset.theme = initialTheme;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const value = translations[language][el.dataset.i18n];
    if (value) el.textContent = value;
  });
  const langButton = document.querySelector("[data-language-toggle]");
  if (langButton) langButton.textContent = translations[language].language;
}

function renderSubjects() {
  const container = document.querySelector("[data-subject-list]");
  if (!container) return;
  container.innerHTML = window.SUBJECTS.map(subject => `
    <article class="subject-card">
      <div class="subject-icon" aria-hidden="true">${subject.icon}</div>
      <h3>${subject.name[language]}</h3>
      <p>${subject.description[language]}</p>
      <a href="subject.html?id=${encodeURIComponent(subject.id)}" class="subject-button">${translations[language].openSubject}</a>
    </article>`).join("");
}

function renderSubjectPage() {
  const root = document.querySelector("[data-subject-page]");
  if (!root) return;
  const subject = window.SUBJECTS.find(item => item.id === new URLSearchParams(location.search).get("id"));
  if (!subject) {
    root.innerHTML = `<h1>${translations[language].missingSubject}</h1>`;
    return;
  }
  document.title = `${subject.name[language]} — IU`;
  root.querySelector("[data-subject-icon]").textContent = subject.icon;
  root.querySelector("[data-subject-name]").textContent = subject.name[language];
  root.querySelector("[data-subject-description]").textContent = subject.description[language];
  const frame = root.querySelector("[data-pdf-frame]");
  frame.src = `${subject.pdf}#view=FitH`;
  frame.title = subject.name[language];
  root.querySelector("[data-download]").href = subject.pdf;
  root.querySelector("[data-open-pdf]").href = subject.pdf;
}

function setupBook() {
  if (!document.querySelector(".book-stage") || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const timeline = gsap.timeline({
    scrollTrigger: { trigger: ".hero-section", start: "top top", end: "+=650", scrub: 1.15 }
  });
  timeline.to(".book", { rotateY: language === "ar" ? 28 : -28, rotateX: 5, y: 80, scale: .92, ease: "power2.inOut" }, 0)
    .to(".book-page.one", { rotateY: language === "ar" ? -155 : 155, ease: "power1.inOut" }, .08)
    .to(".book-page.two", { rotateY: language === "ar" ? -142 : 142, ease: "power1.inOut" }, .3)
    .to(".book-shadow", { scaleX: .72, opacity: .35 }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  applyPreferences(); renderSubjects(); renderSubjectPage(); setupBook();
  document.querySelector("[data-language-toggle]")?.addEventListener("click", () => {
    language = language === "ar" ? "en" : "ar";
    localStorage.setItem("iu-language", language);
    location.reload();
  });
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("iu-theme", next);
  });
});
