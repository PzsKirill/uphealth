# UpHealth — путеводный лист по проекту

Онбординг-документ. Что за проект, из чего собран, кто что делает, и —
подробно — как устроен пайплайн генерации товарного контента (JSON).

Состояние на **21 июля 2026 г.**

---

## 1. Что это

Shopify-магазин нутрицевтиков **UpHealth**. Товары поставляет **Supliful**
(print-on-demand для БАДов) — оттуда же приходят названия, описания, фото и
варианты. Структурный референс витрины — refeel.ru: двумерный каталог,
где товар выбирают не по формату, а по **состоянию/цели** (outcome).

| | |
|---|---|
| Store | `uphealth-nqs6iukl.myshopify.com` |
| Live theme | `#199451771221` («UpHealth», база — Shopify **Horizon**) |
| Admin темы | https://uphealth-nqs6iukl.myshopify.com/admin/themes/199451771221/editor |
| Юрлицо | DCK D. GLOBAL LTD, Company No. 15076839 |

Отдельной sandbox-темы **нет** (прежняя `#199442563413` истекла) — вся работа
идёт по живой теме с флагом `--allow-live`.

---

## 2. Топология репозитория

Репо: https://github.com/PzsKirill/uphealth

| Ветка | Что внутри |
|---|---|
| `main` | старый статический прототип (HTML/CSS/JS), исторический |
| `backup/shopify-theme` | **выгрузка живой темы** → [`shopify-theme/`](shopify-theme/) + этот гайд |
| `feature/shopify-real-product-range` | контент-пак [`product-content/`](product-content/), ассеты real-product/lifestyle, правки прототипа |

> **Первое, что стоит сделать новому разработчику** — смёржить обе ветки в
> `main`, чтобы дерево было одно. Конфликтов между ними нет: они трогают
> разные папки. Пока этого не сделано, `product-content/` и `shopify-theme/`
> лежат в **разных** ветках, и относительные ссылки между ними не работают.

### Папки

| Папка | Статус |
|---|---|
| [`shopify-theme/`](shopify-theme/) | **актуальный код темы.** Всё редактирование — здесь. См. [shopify-theme/README.md](shopify-theme/README.md) |
| `product-content/` | 55 JSON-пейлоадов для метаполя `custom.content` + `CATALOG-SORTING.md` + `tags-import.csv` |
| `theme/` | ⚠️ **мёртвый** ранний скаффолд темы. Не деплоится, не синхронизирован. Кандидат на удаление |
| корневые `*.html`, `css/`, `js/` | статический прототип-первоисточник. Дизайн-эталон, но не собирается и не деплоится |
| `assets/image/` | исходники картинок прототипа (~119 МБ) |

### Команды

```bash
shopify theme pull --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme
shopify theme push --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme --allow-live
shopify theme dev  --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme
```

---

## 3. Архитектура темы

База — стоковый Horizon. Всё наше имеет префикс `uphealth-`:
**45 секций**, сниппеты (`uphealth-product-card`, `uphealth-icon`,
`uphealth-jsonld-product`, `uphealth-jsonld-org`), стили
`assets/uphealth.css` + `assets/uphealth-responsive.css`.
Стоковые `sections/`, `blocks/`, `snippets/`, `locales/` лучше не трогать.

### Шаблоны товара — их четыре, и это важно

| Шаблон | Секция | Когда применять |
|---|---|---|
| `product` (дефолт) | `uphealth-product-simple` + highlights/details/benefits/related | Авто-богатая страница из данных Shopify. **Ноль заполнения на товар** |
| `product.universal` | `uphealth-product-universal` | Богатая страница из метаполя `custom.content`. **Основной путь для раскатки** |
| `product.seamoss`, `product.energy-powder`, `product.digestive-strips` | `uphealth-product-showcase` | Легаси-флагманы с захардкоженным контентом. Новые так не делать |

### Метаполя

| Метаполе | Тип | Назначение |
|---|---|---|
| `custom.content` | JSON | **Весь контент** universal-страницы. Главное поле проекта |
| `custom.ingredients` | — | карточки ингредиентов для дефолтного шаблона |
| `custom.rating` | — | рейтинг на карточке товара |
| `custom.card_badge`, `custom.card_subtitle` | — | бейдж/подзаголовок карточки в каталоге |
| `custom.accent`, `custom.bg`, `custom.ink` | Color | цветовая тема товара |
| `custom.servings`, `custom.js` | — | вспомогательные |
| `custom.pack_note` | — | **на варианте**, подпись под паком в buy-box |

### Каталог — 10 outcome-коллекций

Пилюли `PICK AN OUTCOME` в `uphealth-states-shop.liquid`. Фильтр читает
**коллекции товара**, не теги:

| Пилюля | slug | handle коллекции |
|---|---|---|
| Energy & Stamina | `energy` | `state-energy` |
| Immune Support | `immune` | `state-immune` |
| Strength & Muscle Recovery | `strength` | `state-strength` |
| Memory, Focus & Cognitive Support | `focus` | `state-focus` |
| Mood & Relaxation | `mood` | `state-mood` |
| Sleep & Rest | `sleep` | `state-sleep` |
| Metabolic Health & Weight Support | `metabolic` | `metabolic-health-weight-support` |
| Liver Health | `liver` | `liver-health` |
| Joint & Bone Health | `joint` | `joint-bone-health` |
| Hair, Skin & Nail Health | `beauty` | `hair-skin-nail-health` |

Первые шесть следуют схеме `state-*` (разбор в Liquid — `handle contains 'state-'`),
последние четыре захардкожены отдельными ветками `elsif`. **Добавляя новый
outcome, либо назови коллекцию `state-<slug>`, либо допиши ветку в секции** —
иначе пилюля будет пустой.

### Коммерция

- **Паки** (1 / 3 бутылки) — обычные варианты товара. Название варианта
  **обязано начинаться с числа**: Liquid считает цену за штуку через
  `title | split: ' ' | first | plus: 0`. Формат: `3 bottles · the 90-day protocol`.
- **Подписка** — selling plan, **только** через приложение Shopify
  Subscriptions. В теме лежит лишь рендер.
- Отзывы, лояльность, гифт-карты — приложения, ещё не подключены.

---

## 4. Кто что делает

### Что делаю я (Claude)

- **Генерация товарного JSON** по этикетке/описанию — основной объём, см. §5
- Liquid-секции и сниппеты, CSS, JS темы
- Массовые правки через Admin API (мутации метаполей, SEO-поля, alt-тексты,
  теги, создание вариантов) — по написанному и проверенному раннеру
- Пул/пуш темы через Shopify CLI, диффы, бэкапы
- Документация, чек-листы, runbook'и

### Что должен делать разработчик

- **Проверять сгенерированный контент против этикетки.** Я работаю с тем
  текстом, который мне дали; сверка с реальной банкой — на человеке. См.
  чек-лист в §5.4
- **Всё в админке, что не покрывается кодом:** импорт из Supliful, публикация
  товаров в Online Store, создание коллекций, применение шаблона
  `product.universal` к товару, установка и настройка приложений
- **Платежи, налоги, зоны доставки, домен, policies** — юридические и
  финансовые настройки
- **Ревью и мёрж моих изменений.** Sandbox-темы нет: `push --allow-live`
  ставит правку на живой магазин. Перед крупными изменениями — сделать
  `push --unpublished` и проверить на копии
- **Решения о claim'ах.** Формулировки про здоровье — зона регуляторного
  риска, финальное слово за человеком

### Что не могу физически

Зайти в Shopify-админку кликами, установить приложение, привязать домен,
загрузить медиа в Files, подтвердить платёжный аккаунт. Всё, что не
покрывается Admin API или CLI, — руками.

---

## 5. Пайплайн генерации товарного JSON

Это ядро проекта: одна rich-страница товара = **один JSON** в метаполе
`custom.content`. В `product-content/` уже лежит **55 готовых файлов**.

### 5.1 Как это делалось

1. **Вход** — с товара из Supliful: название, тип, описание, состав и
   Supplement Facts с этикетки, размер порции, число порций, предупреждения.
2. **Генерация** — я пишу JSON по схеме ниже: маркетинговая копия (lead,
   benefits, science, format, absorb, usage, marquee, FAQ) сочиняется, а
   **числовая часть — `facts.rows`, дозировки, `serving`, `servings`,
   `other`, `warning` — переносится с этикетки один-в-один.**
3. **Цветовая тема** — `colors.accent` / `colors.bg` подбираются под упаковку
   и вкус (Beetroot — розово-пурпурный `#bb5189` / `#fbe9f0`).
4. **Файл** — `product-content/<handle>.json`, имя = handle товара.
5. **Раскатка** — содержимое файла вставляется в метаполе `custom.content`
   товара (руками в админке или мутацией Admin API), товару ставится шаблон
   `product.universal`.

Файлов (55) **больше, чем товаров** (~40): вкусовые вариации получают
отдельные JSON — `energy-powder-lychee.json`, `energy-powder-cotton-candy.json`
и т.д.

### 5.2 Схема JSON

Все ключи опциональны — секция скрывает блок, если данных нет. Порядок ключей
= порядок блоков на странице.

| Ключ | Тип | Что рендерит |
|---|---|---|
| `colors` | `{accent, bg}` | цветовая тема страницы (hex) |
| `eyebrow` | строка | надзаголовок: `Capsules · Blood Pressure & Circulation` |
| `rating` | строка | `4.7 · 540 reviews` |
| `lead` | строка | абзац-обещание под заголовком |
| `benefits` | массив строк | 3 буллета в buy-box |
| `note` | строка | `30 servings · 60 vegan capsules · ships in 1–2 days` |
| `marquee_top` | массив строк | бегущая строка над контентом |
| `science` | `{eyebrow, title, text, button}` | блок «почему это работает» |
| `format` | `{eyebrow, title, text, list[]}` | блок формата/дозировки |
| `absorb` | `{eyebrow, title, lead, shell_tag, core, core_tag, points[{title,text}]}` | блок механизма действия |
| `ingredients` | `{eyebrow, title, lead, items[{icon,name,latin,amount,text}]}` | карточки ингредиентов |
| `facts` | `{serving, servings, note, other, side_title, side_text, warning, rows[{label,amount,dv}]}` | **Supplement Facts** |
| `usage` | `{eyebrow, title, dose_num, dose_label, steps[{icon,title,text}]}` | как принимать |
| `marquee_bottom` | массив строк | нижняя бегущая строка |
| `chart` | `{eyebrow, title, line_a, line_b, series[]}` | интерактивный график |
| `faq` | `{title, items[{q,a}]}` | аккордеон вопросов |

`chart.series[]` — элемент: `{label, legend_a, legend_b, title, text, values_a[], values_b[]}`.
`values_*` — **по 5 чисел** (5 точек на оси, ~8 недель). `line_a`/`line_b` —
hex-цвета линий, обычно затемнённый и осветлённый `accent`.

### 5.3 Словарь иконок

`icon` в `ingredients.items[]` и `usage.steps[]` принимает **только** эти
значения (`snippets/uphealth-icon.liquid`):

```
waves  leaf  sprout  spark  shield  atom  pulse  drop
flame  clock  sun  dumbbell  shaker  check
```

Неизвестное значение молча падает в `spark` — опечатка не сломает страницу,
но иконка будет неправильной. **Проверять глазами.**

### 5.4 Что обязательно проверить — чек-лист

Цифры сочинять нельзя. Перед публикацией товара сверить с этикеткой:

- [ ] `facts.rows` — каждая строка: название, количество, % DV. Совпадает с
      Supplement Facts буква в букву
- [ ] `facts.serving` / `facts.servings` — размер порции и число порций
- [ ] `facts.other` — Other Ingredients полностью, включая оболочку капсулы
- [ ] `facts.warning` — предупреждения с реальной упаковки, не придуманные
- [ ] `ingredients.items[].amount` и `.latin` — дозировки и латынь
- [ ] `note` — число порций/капсул не расходится с `facts`
- [ ] `usage.dose_num` / `dose_label` — совпадает с инструкцией на банке
- [ ] Аллергены и противопоказания не потеряны
- [ ] `icon` — из словаря §5.3
- [ ] JSON валиден (`python -m json.tool <file>`), метаполе типа JSON не
      примет битый

### 5.5 Что стоит добавить для точности

Слабые места текущего пака — их имеет смысл закрыть:

1. **Рейтинги вымышлены.** `"rating": "4.7 · 540 reviews"` — плейсхолдер, а не
   реальные отзывы. До подключения Judge.me / Loox это **фиктивный
   социальный proof**; в ряде юрисдикций — нарушение. Либо убрать `rating` из
   всех JSON, либо подключить приложение и брать реальные цифры.
2. **Данные графика синтетические.** `chart.values_*` — иллюстрация динамики,
   а не результат исследования. Стоит добавить в блок графика видимую
   подпись «illustrative, not clinical data», иначе он читается как
   клинический результат.
3. **Нет FDA-дисклеймера.** Для БАД на рынке США нужен
   *"These statements have not been evaluated by the Food and Drug
   Administration. This product is not intended to diagnose, treat, cure or
   prevent any disease."* Сейчас в JSON есть только звёздочки `*` / `**` без
   расшифровки. Правильнее — добавить в схему ключ `disclaimer` и вывести его
   в секции один раз, а не дублировать в каждом файле.
4. **Формулировки claim'ов.** Держаться structure/function-языка
   («supports healthy blood pressure **already in the normal range**»), не
   скатываясь в лечение болезней. В текущих файлах это в основном соблюдено —
   но проверять надо каждый новый.
5. **Нет источника данных в файле.** Стоит добавить служебные поля —
   `_source` (откуда взята этикетка), `_verified` (дата и кто сверил),
   `_supliful_id`. Ключи с `_` секция игнорирует, а разработчик видит, что
   проверено, а что нет.
6. **Нет схемы для валидации.** Один JSON Schema файл + `ajv` в CI отловил бы
   опечатки в ключах, неверные иконки и `values_*` не из 5 элементов до
   заливки в Shopify.
7. **`product-content/CATALOG-SORTING.md` устарел.** Он описывает **6**
   категорий на тегах `goal:*`, а живая тема фильтрует по **10** коллекциям
   `state-*` (§3). `tags-import.csv` — из той же старой схемы. Тегирование по
   этому файлу ничего не даст: **тема теги не читает**. Файлы либо обновить,
   либо удалить, пока по ним не начали работать.

### 5.6 Как добавить новый товар

1. Импортировать из Supliful → опубликовать в Online Store
2. Собрать данные с этикетки
3. Сгенерировать `product-content/<handle>.json` по схеме §5.2
4. Прогнать чек-лист §5.4
5. Вставить в метаполе `custom.content`, поставить шаблон `product.universal`
6. Задать `custom.accent` / `custom.bg`, если нужна тема и в других местах
7. Добавить товар в соответствующую outcome-коллекцию (§3) — иначе он не
   попадёт ни под одну пилюлю каталога
8. Если есть паки — создать варианты с названиями, начинающимися с числа

---

## 6. Грабли

- **Цвета читаются из двух разных мест.** `uphealth-product-universal` берёт
  их из JSON (`d.colors`), а сниппет `uphealth-product-theme.liquid` — из
  метаполей `custom.accent`/`custom.bg`. Сниппет сейчас **никем не
  рендерится** — мёртвый код. Не потратить час, правя не тот файл.
- **`theme/` в корне репо — не тема.** Живой код только в `shopify-theme/`.
- **Название варианта должно начинаться с цифры**, иначе цена за штуку в
  buy-box посчитается неверно.
- **Sandbox-темы нет** — `push` идёт на живой магазин.
- **`config/settings_data.json` при push перезапишет** то, что мерчант мог
  накликать в редакторе после последнего pull. Перед push — сделать pull.
- **Аккаунт-страницы требуют Classic customer accounts** в настройках стора;
  на новых Customer Accounts кастомные шаблоны не применятся.
- **Медиа из Shopify Files и значения метаполей в git не выгружаются.**
  Бэкап темы — это код, но не контент магазина. Полный хендофф требует
  отдельного экспорта товаров/коллекций (CSV) из админки.
- **Slick, jQuery и шрифт Inter грузятся с CDN** — их планировалось
  перенести в ассеты темы, но не перенесли.

---

## 7. Что осталось

Живой чек-лист — `SHOPIFY-CHECKLIST.md` (в ветке
`feature/shopify-real-product-range`). Крупными мазками:

**Контент**
- раскатать 55 JSON по товарам (метаполе + шаблон `product.universal`)
- разложить товары по 10 outcome-коллекциям
- реальные медиа в hero / bonus / gang вместо фолбэков

**Коммерция**
- варианты-паки на товарах
- Shopify Subscriptions → selling plans
- приложение отзывов (Judge.me / Loox) + рейтинг-метаполя
- гифт-карты, лояльность (Smile.io)

**Магазин**
- платежи, налоги, зоны доставки, валюта
- Policies (terms, privacy, refund, shipping)
- брендирование email-уведомлений, аналитика GA4

**Go-live**
- self-host Slick/jQuery/Inter, favicon и OG-теги
- end-to-end тест чек-аута, Lighthouse
- снять пароль витрины, подключить домен
