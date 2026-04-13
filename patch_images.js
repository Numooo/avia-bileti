const fs = require('fs');
const path = require('path');

const expandImagesList = (dataList) => {
  if (!Array.isArray(dataList)) return;
  const imageCollections = [
    // Goa / Beach
    [
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800",
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800",
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800",
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"
    ],
    // Mountains
    [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800",
      "https://images.unsplash.com/photo-1522163723043-478ef79a5bb4?w=800",
      "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800"
    ],
    // Heritage/Culture
    [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=800",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.unsplash.com/photo-1585135431697-3f9b2b528c1c?w=800",
      "https://images.unsplash.com/photo-1564507592208-02728362cb28?w=800"
    ]
  ];

  dataList.forEach((item, i) => {
    if (item.images && item.images.length > 0) {
      const originalImage = item.images[0];
      const collection = imageCollections[i % imageCollections.length];
      item.images = [originalImage, ...collection];
    } else {
      item.images = imageCollections[i % imageCollections.length];
    }
  });
};

['en.json', 'ru.json'].forEach(file => {
  const filePath = path.join(__dirname, 'messages', file);
  if (!fs.existsSync(filePath)) return;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (data.Holidays && data.Holidays.mockData) {
    expandImagesList(data.Holidays.mockData);
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log('Images successfully patched to Holidays mockData');
