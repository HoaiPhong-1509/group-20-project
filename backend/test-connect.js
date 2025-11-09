const mongoose = require('mongoose');

const uri = process.argv[2];
if (!uri) {
  console.error('Usage: node test-connect.js "<mongo-uri>"');
  process.exit(1);
}

mongoose.connect(uri, { })
  .then(() => {
    console.log('OK connected');
    process.exit(0);
  })
  .catch(err => {
    console.error('CONNECT ERROR', err);
    process.exit(1);
  });
