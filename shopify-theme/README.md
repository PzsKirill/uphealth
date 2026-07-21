# UpHealth — Shopify theme (live backup)

Полный снимок **живой** темы магазина UpHealth. Выгружен через Shopify CLI
из темы `#199451771221` (`UpHealth`, база — Horizon) 21 июля 2026 г.

| | |
|---|---|
| Store | `uphealth-nqs6iukl.myshopify.com` |
| Live theme ID | `199451771221` |
| Admin | https://uphealth-nqs6iukl.myshopify.com/admin/themes/199451771221/editor |
| Базовая тема | Shopify Horizon |

## Как работать с темой

```bash
# скачать текущее состояние live-темы поверх этой папки
shopify theme pull --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme

# залить локальные изменения обратно в live
shopify theme push --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme --allow-live

# локальный дев-сервер с hot reload
shopify theme dev --store uphealth-nqs6iukl.myshopify.com \
  --theme 199451771221 --path shopify-theme
```

`--allow-live` обязателен: тема опубликована. Отдельной sandbox-темы сейчас
нет (прежняя `#199442563413` истекла) — при крупных правках имеет смысл
сначала сделать `shopify theme push --unpublished` и проверить на копии.

## Что здесь наше, а что от Horizon

Всё кастомное имеет префикс `uphealth-`:

- `sections/uphealth-*.liquid` — 45 секций (header, footer, hero, каталог,
  страница товара, quiz, loyalty, отзывы, FAQ, аккаунт-страницы и т.д.)
- `snippets/uphealth-*.liquid` — карточка товара, JSON-LD для Product и
  Organization
- `assets/uphealth.css`, `assets/uphealth-responsive.css` — вся вёрстка бренда
- `templates/*.json` — собраны из наших секций

Остальные `sections/`, `blocks/`, `snippets/`, `locales/` — стоковый Horizon,
трогать без нужды не стоит.

## Ключевые механики

**Страница товара** рендерится секцией `uphealth-product-universal.liquid`.
Весь контент (заголовки, буллеты, состав, график, FAQ) берётся из **одного
метаполя товара `custom.content`** типа JSON. Готовые payload'ы на ~60 товаров
лежат в [`../product-content/`](../product-content/) — раскатка сводится к
«взять JSON из файла → вставить в метаполе товара».

**Каталог** — секция `uphealth-states-shop.liquid`. Пилюли `PICK AN OUTCOME`
завязаны на 10 outcome-коллекций; хэндлы и цвета зашиты в секции.

**Паки** реализованы как варианты товара, **подписка** — selling plan из
приложения Shopify Subscriptions (в коде темы только рендер).

## Оговорки

- `config/settings_data.json` — настройки темы на момент выгрузки; при push
  перезапишет то, что мерчант мог накликать в редакторе позже.
- Медиа, загруженные через Shopify Files и метаполя (а не в `assets/`),
  здесь **не** лежат — они живут в админке магазина.
- Папка [`../theme/`](../theme/) в корне репозитория — ранний скаффолд темы,
  он **не** деплоится. Актуальный код только здесь.
- Несколько картинок в `assets/` (`avatar2.png`, `avatr3.png`, `bcomplex.png`,
  `magnesiumcalm.png`, `matchalatte.png`, `newavatar.png`) есть локально, но
  отсутствуют на live-теме — остатки от прошлых итераций.
