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

## 🌐 הגדרת הפרויקט

### שלב 1: העלאה ל-Git

```bash
# אתחול Git (אם עדיין לא קיים)
git init

# הוספת קבצים
git add .
git commit -m "Initial commit - Interactive Guides Platform"

# חיבור לrepository
git remote add origin <your-repo-url>
git push -u origin main
```

### שלב 2: פריסה ב-Vercel

1. **היכנס ל-Vercel** והתחבר ל-Git provider
2. **Import Project** - בחר את הrepository
3. **הגדרות פריסה:**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: לא צריך (מוגדר ב-vercel.json)

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

**🎉 מזל טוב! הפלטפורמה שלך כעת רצה בענן!**
