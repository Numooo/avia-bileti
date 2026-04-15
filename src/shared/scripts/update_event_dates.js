const fs = require('fs');
const path = require('path');

const locales = ['ru', 'en', 'kg'];

const eventDates = {
  "wc2026": { "startDate": "2026-07-19" },
  "f1dubai": { "startDate": "2026-12-06" },
  "wng2026": { "startDate": "2026-09-08" }
};

locales.forEach(lang => {
    const filePath = path.join(process.cwd(), `src/i18n/messages/${lang}.json`);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (content.Events && content.Events.items) {
        content.Events.items = content.Events.items.map(item => {
            if (eventDates[item.id]) {
                return { ...item, ...eventDates[item.id] };
            }
            return item;
        });
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        console.log(`Updated event dates in ${lang}.json`);
    }
});
