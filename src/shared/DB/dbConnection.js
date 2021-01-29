const mongoose = require('mongoose');

module.exports = (() => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      poolSize: 2,
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err, "couldn't connect"));
})();
