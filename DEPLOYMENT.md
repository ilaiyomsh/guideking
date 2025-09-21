# 🚀 מדריך פריסה לענן - Vercel + Redis

מדריך זה מסביר כיצד לפרוס את פלטפורמת המדריכים האינטראקטיביים ל-Vercel עם Redis.

## 📋 דרישות מקדימות

1. **חשבון Vercel** - https://vercel.com
2. **חשבון Redis** - https://redis.com או Upstash
3. **Git repository** - GitHub, GitLab או Bitbucket

## 🔧 הגדרת בסיס הנתונים

### שלב 1: יצירת Redis Database

1. **היכנס ל-Upstash** (מומלץ עבור Vercel): https://upstash.com
2. **צור Redis database חדש**
3. **העתק את פרטי החיבור:**
   - `REDIS_URL`
   - `REDIS_TOKEN`

### שלב 2: הגדרת משתני סביבה ב-Vercel

ב-Vercel Dashboard של הפרויקט שלך:

1. לך ל-**Settings** → **Environment Variables**
2. הוסף את המשתנים הבאים:

```
KV_URL=your-redis-url
KV_REST_API_URL=your-redis-rest-url
KV_REST_API_TOKEN=your-redis-token
KV_REST_API_READ_ONLY_TOKEN=your-redis-readonly-token
NODE_ENV=production
```

## 🌐 הגדרת הפרויקט ב-Vercel (Monorepo)

הפרויקט שלך הוא monorepo עם 3 applications נפרדים. תצטרך ליצור **3 פרויקטים נפרדים** ב-Vercel:

### שלב 1: פריסת Backend API

1. **היכנס ל-Vercel.com** והתחבר עם GitHub
2. **לחץ "Add New..." → Project**
3. **Import** את `ilaiyomsh/guideking`
4. **הגדרות פרויקט:**
   - **Project Name**: `guideking-api`
   - **Framework Preset**: Other
   - **Root Directory**: `packages/server`
   - **Build Command**: `npm install`
   - **Output Directory**: לא צריך
   - **Install Command**: `npm install`

5. **Environment Variables** (חובה!):
   ```
   NODE_ENV=production
   KV_URL=your-redis-url
   KV_REST_API_URL=your-redis-rest-url
   KV_REST_API_TOKEN=your-redis-token
   KV_REST_API_READ_ONLY_TOKEN=your-redis-readonly-token
   ```

### שלב 2: פריסת Admin Panel

1. **לחץ "Add New..." → Project** (פרויקט חדש)
2. **Import** את אותו repository `ilaiyomsh/guideking`
3. **הגדרות פרויקט:**
   - **Project Name**: `guideking-admin`
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/client-admin`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://guideking-server.vercel.app
   VITE_VIEWER_URL=https://guideking-client-viewer.vercel.app
   ```

### שלב 3: פריסת Viewer App

1. **לחץ "Add New..." → Project** (פרויקט שלישי)
2. **Import** את אותו repository `ilaiyomsh/guideking`
3. **הגדרות פרויקט:**
   - **Project Name**: `guideking-viewer`
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/client-viewer`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   VITE_API_URL=https://guideking-server.vercel.app
   ```

### שלב 3: הגדרת Domains

לאחר הפריסה הראשונה:

1. **Admin Panel**: `https://your-project-admin.vercel.app`
2. **Viewer**: `https://your-project.vercel.app`

## 🔄 משתני סביבה לפרודקשן

### Admin App משתנים:
```
VITE_API_URL=https://your-project.vercel.app
VITE_VIEWER_URL=https://your-project.vercel.app
```

### Viewer App משתנים:
```
VITE_API_URL=https://your-project.vercel.app
```

## 🧪 בדיקת הפריסה

לאחר הפריסה, בדוק:

1. **API Health Check**: `https://your-project.vercel.app/api/health`
2. **Admin Panel**: `https://your-project-admin.vercel.app`
3. **Viewer**: `https://your-project.vercel.app`

## 🔧 פתרון בעיות נפוצות

### בעיה: "KV is not defined"
**פתרון**: ודא שמשתני ה-KV מוגדרים נכון ב-Vercel Environment Variables.

### בעיה: CORS Errors
**פתרון**: עדכן את הגדרות CORS בשרת לכלול את הדומיינים של Vercel.

### בעיה: Build Failures
**פתרון**: ודא שכל ה-dependencies מותקנים ושהבניה עובדת מקומית.

## 📊 מעקב וניטור

### Vercel Analytics
הפעל Analytics ב-Vercel Dashboard לקבלת נתונים על ביצועים.

### Logs
צפה בלוגים ב-Vercel Dashboard → Functions → View Function Logs.

## 🔄 עדכונים עתידיים

כל push ל-main branch יפעיל פריסה אוטומטית ב-Vercel.

---

## 🌐 כתובות הפרודקשן הסופיות

לאחר הפריסה המוצלחת, הפלטפורמה שלך זמינה בכתובות הבאות:

- **🖥️ Server API**: [https://guideking-server.vercel.app](https://guideking-server.vercel.app)
  - Health Check: [https://guideking-server.vercel.app/health](https://guideking-server.vercel.app/health)
  - API Guides: [https://guideking-server.vercel.app/api/guides](https://guideking-server.vercel.app/api/guides)

- **📝 Admin Panel**: [https://guideking-client-admin.vercel.app](https://guideking-client-admin.vercel.app)
  - יצירה ועריכה של מדריכים אינטראקטיביים

- **👁️ Viewer App**: [https://guideking-client-viewer.vercel.app](https://guideking-client-viewer.vercel.app)
  - צפייה במדריכים לקהל הרחב

---

**🎉 מזל טוב! הפלטפורמה שלך כעת רצה בענן!**
