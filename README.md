# PingMe

**PingMe** е платформа, която свързва пътешественици от различни страни чрез AI съвпадение по интереси. Създаваш профил, описваш кой си и какво те интересува, и системата те свързва с хора, с които имаш нещо общо — идеални спътници за съвместно пътуване или обмен на знания и преживявания.

### Основни функции

- **AI съвпадение** — алгоритъм, базиран на Google Gemini embeddings, свързва те с най-подходящите хора
- **Профили** — снимка, биография, локация, контакти
- **Заявки за връзка** — изпращаш покана, другият приема или отказва
- **Рейтинг система** — при приета връзка получавате точки, а свързаните потребители могат да си дават оценка (0–5 звезди). На базата на точките получаваш ниво: Newcomer → Explorer → Connector → Networker → Influencer → Ambassador → Legend
- **Известия** — виждаш входящи заявки и статус на изпратените в акаунта си

### Технологии

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js + Express
- **База данни и auth:** Supabase (PostgreSQL)
- **AI:** Google Gemini (`gemini-embedding-001`, pgvector)
- **Хостинг:** Railway

---

Можете да посетите websitе-а по 2 начина:
 1. Да последвате този линк: https://pingme-production-d18b.up.railway.app/

 2. Да го хостнете локално:

---

## Локално хостване

### Какво трябва да имаш инсталирано

1. **Node.js** (версия 18 или по-нова)
   - Свали от: https://nodejs.org
   - Избери "LTS" версията
   - След инсталацията провери в терминал: `node -v`

2. **Git**
   - Свали от: https://git-scm.com
   - След инсталацията провери: `git --version`

---

### Стъпки

**1. Клонирай репото**
```bash
git clone https://github.com/Nikolay833/PingMe.git
cd PingMe
```

**2. Инсталирай пакетите**
```bash
npm install
```

**3. Създай `.env` файл**

В папката `PingMe/` създай файл с име `.env` и добави следното:
```
SUPABASE_URL=https://tyobxckhkewittrxywvi.supabase.co
PORT=3000
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b2J4Y2toa2V3aXR0cnh5d3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Mzc0NDAsImV4cCI6MjA5MDExMzQ0MH0.MPjprqG538HnhqeVfnFpsECGWeUcFB2p7mzZV6mrNz4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5b2J4Y2toa2V3aXR0cnh5d3ZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDUzNzQ0MCwiZXhwIjoyMDkwMTEzNDQwfQ.m6gC7jVrnmULqtodzAEqVocpHnMXe54fqE7G_WqtS_o
VECTOR_API_KEY=AIzaSyBxvyH0Bu4m9b34C7yu8W8yBhV793oDOPU
```
> Ключовете ги намираш в Supabase → Project Settings → API

**4. Стартирай сървъра**
```bash
node server.js
```

**5. Отвори сайта**

Отиди на: http://localhost:3000

---

> **Забележка:** `.env` файлът не е качен в GitHub по сигурност — трябва да го създадеш ръчно всеки път на нов компютър.


