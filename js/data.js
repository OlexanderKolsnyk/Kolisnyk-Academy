/* Дані, які найчастіше змінюються. Редагуйте картки тут, не торкаючись розмітки. */
window.SITE_DATA = {
  links: [
    { icon: "play", title: "Ефіри в TikTok", description: "Математика з нуля до НМТ — безкоштовно", href: "https://www.tiktok.com/@kolisnyk_academy", category: "free-live", accent: true },
    { icon: "telegram", title: "Канал ефірів", description: "Розклад, конспекти й домашні завдання", href: "https://t.me/tiktok_K_academy", category: "live-channel" },
    { icon: "function", title: "Ефіри про параметри", description: "Складна математика з Олександром", href: "https://www.tiktok.com/@kolisnyk_academy", category: "parameter-live" },
    { icon: "telegram", title: "Telegram «Параметри»", description: "Матеріали та анонси відкритих занять", href: "https://t.me/parametry_online", category: "advanced-math" },
    { icon: "target", title: "Підготовка до НМТ", description: "Індивідуально, у парі або мінігрупі", href: "#lead-form", category: "nmt", goal: "Підготовка до НМТ" },
    { icon: "check", title: "Пробне НМТ", description: "Формат реального тесту та результат у балах", href: "https://olexanderkolsnyk.github.io/PNMT/", category: "trial-nmt" },
    { icon: "people", title: "Наші викладачі", description: "Познайомтеся з командою академії", href: "#teachers", category: "teachers" },
    { icon: "wallet", title: "Формати й ціни", description: "Порівняйте варіанти навчання", href: "#prices", category: "prices" }
  ],
  teachers: [
    { name: "Вероніка", subject: "Математика", image: "assets/images/teachers/teacher-01.jpg", trait: "Пояснює простою мовою та помічає, коли учень соромиться перепитати." },
    { name: "Оксана", subject: "Математика", image: "assets/images/teachers/teacher-02.jpg", trait: "Допомагає замінити страх перед складними завданнями на впевненість." },
    { name: "Катерина", subject: "Математика · співзасновниця", image: "assets/images/teachers/teacher-03.jpg", trait: "Знаходить інший підхід і приклад, доки тема не стане зрозумілою." },
    { name: "Олександр", subject: "Математика · співзасновник", image: "assets/images/teachers/teacher-04.jpg", trait: "Показує логіку й підтримує учня, навіть коли задача здається нереальною." },
    { name: "Еліна", subject: "Математика · англійська", image: "assets/images/teachers/teacher-05.jpg", trait: "Вчить мислити самостійно, а не просто запам’ятовувати формули." },
    { name: "Юля", subject: "Математика · фізика", image: "assets/images/teachers/teacher-06.jpg", trait: "Поєднує логіку, практику та реальні приклади з життя." },
    { name: "Марія", subject: "Математика · інформатика", image: "assets/images/teachers/teacher-07.jpg", trait: "Робить складні теми зрозумілими й комфортними для кожного учня." },
    { name: "Руслана", subject: "Математика", image: "assets/images/teachers/teacher-08.jpg", trait: "Знаходить ту саму ниточку — інший спосіб, приклад або аналогію." },
    { name: "Дар’я", subject: "Математика", image: "assets/images/teachers/teacher-09.jpg", trait: "Цінує простоту, структуру та практичність без зайвої складності." },
    { name: "Артем", subject: "Математика · вища математика", image: "assets/images/teachers/teacher-10.jpg", trait: "Навчає без страху перед екзаменом і показує зв’язки між темами." },
    { name: "Вікторія", subject: "Математика", image: "assets/images/teachers/teacher-11.jpg", trait: "Пояснює на зрозумілих прикладах із практичним застосуванням." },
    { name: "Єлизавета", subject: "Математика", image: "assets/images/teachers/teacher-12.jpg", trait: "Створює атмосферу, де помилки — це крок до успіху." },
    { name: "Інна", subject: "Математика", image: "assets/images/teachers/teacher-13.jpg", trait: "Перетворює складне на зрозуміле й допомагає побачити логіку." }
  ],
  lessons: [
    { image: "assets/images/lessons/material-01-parameter-equations.jpg", alt: "Рівняння з параметрами — основні типи та методи розв’язання", format: "wide" },
    { image: "assets/images/lessons/material-02-parameters-homework.jpg", alt: "Домашнє завдання з параметрів", format: "tall" },
    { image: "assets/images/lessons/material-03-domain-restrictions.jpg", alt: "ОДЗ та основні обмеження", format: "wide" },
    { image: "assets/images/lessons/material-04-geometry-homework.jpg", alt: "Домашнє завдання з олімпіадної геометрії", format: "tall" },
    { image: "assets/images/lessons/material-05-quadratic-parameters.jpg", alt: "Квадратні рівняння з параметром", format: "wide" },
    { image: "assets/images/lessons/material-06-linear-parameters.jpg", alt: "Лінійні рівняння з параметрами", format: "wide" },
    { image: "assets/images/lessons/material-07-systems-parameters.jpg", alt: "Системи рівнянь з параметрами", format: "wide" },
    { image: "assets/images/lessons/material-08-olympiad-tasks.jpg", alt: "Завдання для підготовки до олімпіади", format: "wide" },
    { image: "assets/images/lessons/material-09-powers-homework.jpg", alt: "Домашнє завдання: степені та їхні властивості", format: "tall" },
    { image: "assets/images/lessons/material-10-nmt-geometry.jpg", alt: "Тренувальне завдання НМТ з геометрії", format: "wide" },
    { image: "assets/images/lessons/material-11-powers-table.jpg", alt: "Таблиця степенів", format: "tall" },
    { image: "assets/images/lessons/lesson-01.png", alt: "Домашнє завдання із систем рівнянь", format: "wide" }
  ],
  reviews: Array.from({ length: 17 }, (_, index) => ({
    image: `assets/images/reviews/review-${String(index + 1).padStart(2, "0")}.jpg`,
    alt: `Відгук учня або батьків Kolisnyk Academy ${index + 1}`
  })),
  free: [
    { kicker: "Щомісяця", symbol: "НМТ", title: "Безкоштовне пробне НМТ", text: "Формат реального тесту, результат у балах і можливість отримати розбір.", href: "https://olexanderkolsnyk.github.io/PNMT/", category: "free-nmt", image: "assets/images/lessons/material-10-nmt-geometry.jpg" },
    { kicker: "TikTok · безкоштовно", symbol: "▶", title: "Математика з нуля до НМТ", text: "Відкриті ефіри Катерини, а в Telegram — розклад, конспекти та домашні завдання.", href: "https://t.me/tiktok_K_academy", category: "kateryna-live", image: "assets/images/lessons/material-09-powers-homework.jpg" },
    { kicker: "З Олександром", symbol: "ƒ(x)", title: "Рівняння з параметрами", text: "Безкоштовні ефіри зі складної математики та окремий канал з матеріалами.", href: "https://t.me/parametry_online", category: "oleksandr-live", image: "assets/images/lessons/material-01-parameter-equations.jpg" }
  ],
  prices: [
    { title: "Індивідуальні заняття", description: "Уся увага — лише тобі", price: "550–600 грн", unit: "за заняття", benefits: ["особистий план, темп і домашні завдання", "легко змінити час або перенести заняття", "максимум практики саме під твою ціль"] },
    { title: "Парні заняття", description: "Удвох цікавіше й уже не так страшно", price: "425 грн", unit: "за учня", benefits: ["можна прийти разом із другом", "помітно дешевше за індивідуальний формат", "достатньо персональної уваги кожному"] },
    { title: "Мінігрупа", description: "Більше поглядів на кожну задачу", price: "300 грн", unit: "за учня", benefits: ["сильний формат для підготовки до НМТ", "вчимося на своїх і чужих помилках", "одну задачу бачимо з 4–5 різних боків"] }
  ],
  faq: [
    { q: "Що буде на пробному занятті?", a: "Знайомимося, уточнюємо ціль, дивимося поточний рівень і показуємо, як проходить робота з викладачем. Після цього команда пропонує подальший план." },
    { q: "Як ви підбираєте викладача?", a: "Враховуємо навчальну ціль, рівень, бажаний темп, стиль комунікації та зручний графік. Якщо маєте побажання щодо конкретного викладача, їх можна залишити у формі." },
    { q: "Чи можна змінити викладача?", a: "Так. Якщо формат або стиль не підійшов, менеджер допоможе підібрати інший варіант." },
    { q: "Чи можна почати з низького рівня?", a: "Так. Ми визначаємо точку старту без осуду й будуємо послідовний план від бази до вашої цілі." },
    { q: "Скільки разів на тиждень потрібно займатися?", a: "Залежить від цілі, терміну та стартового рівня. Найчастіше комфортний ритм — 1–2 заняття на тиждень із самостійною практикою між ними." },
    { q: "Як проходять заняття?", a: "Онлайн із викладачем: презентації, спільна дошка, розбір задач, практика та зворотний зв’язок. Матеріали залишаються в учня." },
    { q: "Чи є домашні завдання?", a: "Так, обсяг узгоджується з ціллю й навантаженням учня. Роботи перевіряються, а помилки розбираються." },
    { q: "Що робити у випадку відключення світла?", a: "Викладачі готують стабільне робоче місце й резервне живлення. Якщо форс-мажор усе ж трапився, менеджер допоможе організувати перенесення." },
    { q: "Як відбувається оплата?", a: "Менеджер пояснить актуальний порядок після вибору формату та викладача. Жодних прихованих тарифів у формі немає." },
    { q: "Як контролюється результат?", a: "Викладач фіксує роботу на заняттях, методист контролює якість і програму, а команда відстежує прогрес щодо поставленої цілі." }
  ]
};
