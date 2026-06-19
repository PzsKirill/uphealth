# UpHealth × Shopify — точка остановки (на 2026-06-19, пятница)

Продолжаем **в понедельник 2026-06-22**. Этот файл — чтобы быстро вспомнить, где мы.

---

## TL;DR — где мы сейчас
Прототип переехал на **живой Shopify dev store**. Страница товара **Sea Moss** полностью собрана в нашем дизайне и **опубликована** — открывается напрямую, контент правится визуально в редакторе темы. Дальше: брендировать header/footer, добавить коммерцию (паки + подписка), раскатать остальные товары, перенести главную/каталог.

## Боевые ссылки
- Магазин: https://uphealth-nqs6iukl.myshopify.com
- Товар: https://uphealth-nqs6iukl.myshopify.com/products/sea-moss
- ⚠️ Стор закрыт **паролем витрины** (dev store). Показать без пароля: *Online Store → Preferences → Password protection*.

## Темы в магазине
| Тема | ID | Роль |
|---|---|---|
| **UpHealth** | `199451771221` | **LIVE** (наша, опубликована 2026-06-19) |
| Horizon | `199440892245` | unpublished (бывшая дефолтная, откат сюда в 1 клик) |
| Development (6daec8…) | `199442563413` | development-песочница CLI (может истечь через ~7 дней простоя — не страшно, вся работа уже в UpHealth) |

Store handle: `uphealth-nqs6iukl.myshopify.com`. CLI: Shopify CLI, браузер-логин (нужный акк).

---

## Как редактировать контент (для контент-менеджеров)
*Online Store → Themes → **UpHealth** → Customize* → вверху переключить на **Products** → кликнуть секцию **UpHealth product** слева.
- **Настройки секции** (группы): Colours (пипетки accent/bg), Showcase, Science, Absorb popup, Ingredients, Supplement facts, Usage, Chart, FAQ.
- **Блоки** (повторяющееся): Ingredient, Supplement fact row, Usage step, **Chart tab**, FAQ item, Popup point. Клик → правка полей; перетаскивание → порядок; Add block → добавить; корзина → удалить.
- **График**: блок **Chart tab** → Label, Legend A/B, Title, Text + «Line A/B values» (5 чисел через запятую, напр. `2, 6, 10, 15, 18`). Цвета линий — в группе Chart.

## Ключевые файлы (рабочая копия темы — `shopify-theme/`, она в .gitignore)
- `shopify-theme/sections/uphealth-product-showcase.liquid` — ВСЯ страница товара (schema: настройки + 6 типов блоков + JS графика/попапа/галереи).
- `shopify-theme/snippets/uphealth-icon.liquid` — иконки (ключ → SVG).
- `shopify-theme/assets/uphealth.css` (= копия `css/style.css`) + `uphealth-responsive.css` — наши стили. Шрифт **Inter** грузится в секции из Google Fonts.
- `shopify-theme/templates/product.json` — **дефолтный** шаблон товара, сейчас содержит контент **Sea Moss** (т.к. товар один). Его и правит редактор темы.
- `shopify-theme/templates/product.seamoss.json` — пер-товарный шаблон Sea Moss (на будущее, при раскатке).
- `shopify-content/seamoss.json` — исходный контент Sea Moss (из него генерил шаблон). Источник для остальных товаров — `product-<slug>.html` в корне.

---

## ✅ Что сделано
- Подключён CLI к dev-стору, запулен Horizon в `shopify-theme/`.
- Архитектура решена: **контент через редактор темы (settings + blocks)**, НЕ метафилды/JSON — чтобы нетехнические сотрудники правили любой элемент визуально.
- Секция товара собрана полностью: showcase → marquee → science + попап «How it's absorbed» → ingredients → Supplement Facts → usage → marquee → **график с вкладками** → FAQ. Цвета = пипетки → палитра через `color-mix()`.
- Sea Moss предзаполнен, проверен пользователем, **тема UpHealth опубликована на бой**.

## ⏭️ С чего начать в понедельник (next steps)
**Открытый вопрос для старта:** с чего продолжаем — рекомендация **(1) header/footer** (быстрый визуальный эффект, стор станет цельным), либо сразу **(2) коммерция**.

1. **Header/footer под бренд** — заменить дефолтные Horizon на наши (лого, меню, footer-комплаенс DCK D. GLOBAL LTD).
2. **Коммерция на странице товара** — паки (1/3 бутылки) = варианты товара; «Subscribe & save 10%» = selling plan (Shopify Subscriptions). Сейчас на странице простой Add to cart по одной цене.
3. **Раскатка товаров** — для каждого нового товара: сгенерить предзаполненный шаблон (как Sea Moss) + свой цвет; назначить через *Product → Theme template* (теперь тема опубликована — назначение работает штатно).
4. **Главная + каталог** — перенести нашу главную (`index.html`) секциями; коллекции `state-*` + фильтры (Search & Discovery).

---

## ⚙️ Гочи / полезные команды (рабочая папка `shopify-theme/`)
- Пуш файла на тему: `shopify theme push --theme <ID> --store uphealth-nqs6iukl.myshopify.com --only <path>`
  - **ВАЖНО:** несколько `--only` в одной команде применяют только ОДИН файл — пушить файлы **отдельными командами**.
- Забрать правки из редактора темы локально: `shopify theme pull --theme <ID> ... --only templates/product.json`
- Список тем/ролей: `shopify theme list --store ...`
- Опубликовать: `shopify theme publish --theme <ID> --force --store ...`
- **Рекомендуемый воркфлоу правок кода (чтобы не ломать live напрямую):** править локально → пушить на **development-тему `199442563413`** (если истекла — пересоздать) → проверить по `?preview_theme_id=199442563413` → затем `shopify theme push --theme 199451771221` (UpHealth) или publish. Контент-правки текста менеджеры делают прямо в редакторе live-темы.
- Графику НЕ инлайнить через `{{ ... | json }}` в исполняемый JS — данные кладём в `<script type="application/json">` и парсим (уже сделано).

Подробная архитектура — в моей памяти `shopify_migration_architecture.md`.
