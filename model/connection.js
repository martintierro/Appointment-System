const mongoose = require('mongoose');
const databaseURL = "mongodb+srv://Secade:j5e3f3f3@cluster0.iggb6.mongodb.net/Cluster0?retryWrites=true&w=majority";


const options = { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false};

mongoose.connect(databaseURL, options);

module.exports = mongoose;