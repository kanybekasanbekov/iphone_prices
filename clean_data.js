const fs = require('fs');

const database = require('./database.json'); 

const cleanData = {};
for (const key in database) {
  const entry = database[key];
  if (
    entry.model &&
    entry.capacity !== undefined &&
    entry.battery_health !== undefined &&
    entry.price !== undefined &&
    entry.link &&
    entry.date
  ) {
    cleanData[key] = entry;
  }
}

fs.writeFileSync('clean_data.json', JSON.stringify(cleanData, null, 2));

console.log('Data cleaned successfully');
