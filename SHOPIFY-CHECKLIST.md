# UpHealth → Shopify — чек-лист переноса

Тема **UpHealth** (#199451771221) опубликована на dev-store `uphealth-nqs6iukl.myshopify.com`.
Рабочая копия: `shopify-theme/`. Легенда: ✅ готово · 🔸 частично · ⬜ осталось.

---

## 1. Базис темы
- ✅ Horizon запулен, тема UpHealth создана и опубликована
- ✅ Наш CSS (`uphealth.css` + responsive) + шрифт Inter подключены глобально (через header)
- ✅ Глобальные ресеты (list-style, кнопки, и т.п.)
- ✅ Scroll-анимации (reveal fade-up + stagger) — глобально через `uphealth-anim.js`, авто-таргет компонентов, no-flash + фолбэк + reduced-motion
- ⬜ Перенести Slick/jQuery/Inter с CDN на self-host (ассеты темы) — стабильность + скорость
- ⬜ Favicon, meta-теги (`settings.favicon`, OG-теги), заголовки страниц

## 2. Header / Footer / навигация
- ✅ Header (лого, мега-меню Catalog/Outcomes/About, поиск, аккаунт, избранное, корзина), бургер
- ✅ Footer (марки, колонки, комплаенс, соцсети) — редактируемый
- ✅ Мега-меню Catalog: 2 карточки-разводящие (Shop the range → каталог · Gift cards → настройка `gift_url`, по умолчанию каталог)
- ✅ Соцсети в шапке: Instagram/YouTube скрыты, если URL пуст (настройки хедера `social_instagram/youtube`); WhatsApp активен
- 🔸 Ссылки меню/футера разведены на реальные коллекции/страницы (Contacts→`/pages/contact`). Активируются по мере создания страниц/коллекций в админке. Осталось: `wellness-test`, format-коллекции

## 3. Корзина / избранное
- ✅ Cart drawer на Shopify AJAX (qty/remove/checkout, оптимистичные обновления)
- ✅ Избранное (сердечко + localStorage + drawer, структура `fav-item`)
- 🔸 Страница `/cart` — сейчас дефолтная Horizon (своя кастомная отменена по решению)
- ⬜ Промокод в drawer/cart — сейчас редирект на `/discount/CODE` (проверить UX)

## 4. Главная
- ✅ Все 13 секций перенесены модульно (hero-Slick, marquee×3, featured, bonus, why, perfect-day, statement, video, gang, reviews-карусель, press) — редактируются в конструкторе
- ⬜ Залить реальные медиа в hero/bonus/gang (сейчас часть на ассетах-фолбэках / Mixkit)
- ⬜ featured-сетка наполнится, когда будут товары/коллекция

## 5. Товары
- ✅ **Авто-богатый дефолтный PDP** (`uphealth-product-simple` + highlights + details + benefits + science + related): реальные данные Shopify, варианты, add-to-cart→drawer, описание Supliful — 0 заполнения на товар
- ✅ Метаполе `custom.ingredients` → карточки ингредиентов (заполнять по товару ~2 мин, скрыто если пусто)
- ✅ Богатый `uphealth-product-showcase` — для флагманов (Sea Moss, шаблон `seamoss`)
- ✅ Карточка товара `up-card`
- 🔸 Товары льются из **Supliful** (импорт в 1 клик: name/type/описание/фото/варианты). Осталось: публиковать в **Online Store** + раскладывать по коллекциям
- ⬜ (опц.) метаполя `usage`/`facts`, card-метафилды (`card_badge / card_subtitle / rating`)

## 6. Каталог и коллекции
- 🔸 Завести коллекции: 6 `state-*` созданы (handle выставлены). Осталось — по формату (`sticks/gummies/drinks/protein/bundles`)
- 🔸 Протегировать товары — Sea Moss в Immune; Type=Capsules. Остальным товарам — по мере добавления
- ✅ Страница каталога/коллекции (`uphealth-collection` + `templates/collection.json`): хлебные крошки, заголовок=имя коллекции, сортировка, пилюли-состояния (скролл на адаптиве), grid `up-card` (квадрат+cover, hover=последнее медиа), пагинация
- 🔸 Search & Discovery установлен (Availability/Price/Type) — фасеты-сайдбар убран по решению, оставлен чистый toolbar

## 7. Информационные страницы
- ✅ **About** (`/pages/about`) — `templates/page.about.json`, 12 секций 1:1 (page-hero, story, science, why, science-rating, stats, statement, ingredients-карусель, ticker, marquee, states-shop с табами, loyalty)
- ✅ **Contact** (`/pages/contact`) — `page.contact.json`: page-hero + контакт-инфо + рабочая Shopify-форма
- ✅ **Ingredients** (`/pages/ingredients`) — `page.ingredients.json`: SVG-карта мира с пинами (позиция пина = слайдеры pin_x/pin_y в редакторе) + грид ингредиентов, hover пин ↔ карточка. Кнопка «See all ingredients» на About ведёт сюда
- ✅ **Delivery / Shipping** (`/pages/delivery`) — `page.delivery.json`: doc-секция `uphealth-content` (TOC + 5 блоков) с scrollspy
- ✅ **Bonuses / Loyalty** (`/pages/bonuses`) — `page.bonuses.json`: page-hero + steps + tiers (Bronze/Silver/Gold) + ways-to-earn (story reverse)
- ✅ **FAQ** (`/pages/faq`) — `page.faq.json`: `uphealth-faq` (TOC по категориям + Q/A-аккордеоны, 15 вопросов)
- ✅ **Wellness test** (`/pages/wellness-test`) — `page.wellness-test.json`: интерактивный квиз `uphealth-quiz` (4 вопроса → подбор outcome → результат с кнопкой на коллекцию `state-*`). Вопросы/варианты/результаты редактируются блоками
- ⬜ Каждую — секцией(ями) Liquid + Shopify-страница с нужным шаблоном

## 8. Прочие страницы
- ✅ **Search results** (`templates/search` → `uphealth-search`): форма + результаты `up-card` + пагинация + пустое состояние (фильтр `type=product`)
- ✅ **Account** (классические customer-шаблоны под бренд): login (+ recover), register, account-дашборд (заказы+адрес), reset_password, activate_account, addresses (селектор стран), order-detail. **Требует Classic customer accounts** в Settings
- ✅ **404** (`templates/404` → `uphealth-404`): крупный код, поиск, CTA (Home/Shop), быстрые ссылки
- ⬜ **Policies** (terms, privacy, refund, shipping) — заполнить в Settings → Policies

## 9. Коммерция / приложения
- ⬜ **Паки** (1/3 бутылки) → варианты товара с ценами; UI пак-селектора на странице товара
- ⬜ **Подписка** «Subscribe & save» → selling plan (Shopify Subscriptions) + блок на странице товара
- ⬜ **Отзывы** → приложение (Judge.me / Loox) + рейтинг-метафилды для карточек
- ⬜ **Гифт-карты** → native Shopify Gift Cards (+ маршрут в мега-меню)
- ⬜ **Лояльность/бонусы** → приложение (Smile.io) — связать с `/bonuses`
- ⬜ **Рассрочка** (опц.) — Shop Pay Installments / провайдер

## 10. Настройки магазина
- ⬜ Валюта/регион, налоги, зоны доставки
- ⬜ Платёжные провайдеры (+ бизнес-данные: DCK D. GLOBAL LTD, Company No. 15076839)
- ⬜ Email-уведомления (брендирование)
- ⬜ Аналитика (GA4 / пиксели)

## 11. Go-live
- ⬜ Проверить весь чек-аут end-to-end
- ⬜ Снять пароль витрины (Online Store → Preferences) — когда готовы
- ⬜ Подключить домен
- ⬜ Финальный кросс-браузер/мобайл-тест, скорость (Lighthouse)
- ⬜ Бэкап темы (git/экспорт)

---

### Ближайший логичный шаг
**Каталог + коллекции** (п.6) — оживит ссылки меню/футера/главной и наполнит featured-сетку. Затем — **раскатка 7 товаров** (п.5), потом инфо-страницы (п.7) и коммерция (п.9).

_Обновлять по мере выполнения._
