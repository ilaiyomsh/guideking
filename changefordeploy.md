# רשימת שינויים בקוד לקראת פריסה לענן (Vercel)

מסמך זה מרכז את כל שינויי הקוד הנדרשים בפרויקט המקומי כדי להתאים אותו לסביבת ענן. בצע את השלבים הבאים לפני העלאת הקוד ל-GitHub.

## 1. שינויים בשרת ה-Backend (packages/server)

מטרה: להחליף את האחסון המקומי (קובץ JSON) בבסיס נתונים בענן (Vercel KV) ולייצר ID ייחודי לכל מדריך חדש.

### משימה 1.1: התקנת ספריות חדשות

פתחו טרמינל בתיקיית השורש של הפרויקט והריצו את הפקודה הבאה:

```bash
npm install @vercel/kv nanoid --workspace=server
```

- **@vercel/kv**: מאפשר לנו לתקשר עם בסיס הנתונים של Vercel.
- **nanoid**: ספרייה קטנה ומהירה ליצירת מזהים ייחודיים (ID).

### משימה 1.2: עדכון לוגיקת הנתונים

יש לערוך את הקבצים בתיקייה `packages/server/src/controllers/` (או היכן שהלוגיקה של ה-API נמצאת) ולהחליף את כל הקוד שמשתמש ב-fs (File System) בקוד המשתמש ב-@vercel/kv.

דוגמה לעדכון הקובץ `guideController.js`:

```javascript
// packages/server/src/controllers/guideController.js

import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';

// GET /api/guides - מחזיר רשימה מקוצרת ומהירה
export const getAllGuides = async (req, res) => {
    try {
        const guideIndex = await kv.get('guides_index');
        res.json(guideIndex || []);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guide index' });
    }
};

// GET /api/guides/:id - מחזיר מדריך בודד
export const getGuideById = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await kv.get(`guide:${id}`);
        if (!guide) {
            return res.status(404).json({ message: 'Guide not found' });
        }
        res.json(guide);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching guide' });
    }
};

// POST /api/guides - יוצר מדריך חדש
export const createGuide = async (req, res) => {
    try {
        const newGuide = { _id: nanoid(10), ...req.body };
        
        await kv.set(`guide:${newGuide._id}`, newGuide);

        const guideIndex = await kv.get('guides_index') || [];
        guideIndex.push({ _id: newGuide._id, title: newGuide.title });
        await kv.set('guides_index', guideIndex);

        res.status(201).json(newGuide);
    } catch (error) {
        res.status(500).json({ message: 'Error creating guide' });
    }
};

// ... יש לעדכן גם את פונקציות העדכון (PUT) והמחיקה (DELETE) בהתאם ...
```

## 2. שינויים באפליקציות ה-Frontend (client-admin & client-viewer)

מטרה: להפסיק להשתמש בכתובות API קבועות (localhost) ולהתבסס על משתני סביבה.

### משימה 2.1: יצירת קובץ .env

בכל אחת מתיקיות הפרונטאנד (`packages/client-admin` ו-`packages/client-viewer`), צרו קובץ חדש בשם `.env`.

תוכן הקובץ צריך להיות זהה בשתיהן:

```
VITE_API_URL=http://localhost:3001
```

קובץ זה ישמש אתכם רק בפיתוח המקומי. Vercel תדרוס את הערך הזה עם הכתובת האמיתית של השרת בסביבת הפרודקשן.

### משימה 2.2: עדכון קריאות ה-API בקוד

עברו על כל המקומות בקוד שבהם אתם מבצעים קריאות לשרת (באמצעות fetch או axios).
החליפו את הכתובת הקבועה (`http://localhost:3001`) במשתנה הסביבה החדש.

דוגמה לעדכון:

**קוד ישן:**
```javascript
const response = await fetch(`http://localhost:3001/api/guides/${guideId}`);
```

**קוד חדש:**
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
const response = await fetch(`${apiUrl}/api/guides/${guideId}`);
```

### משימה 2.3: הוספת קובץ .gitignore

ודאו שבקובץ ה-`.gitignore` הראשי של הפרויקט (או בקבצים נפרדים בכל חבילה) קיימת השורה הבאה. זה ימנע העלאה של קבצי ה-`.env` המקומיים ל-GitHub.

```
.env
```
