const mongoose = require('mongoose');
// mongoose.Promise = global.Promise;

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/MernTask', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    } catch (error) {
        console.info(error);
        process.exit(1); //detiene la app
    }
}

module.exports = conectarDB;