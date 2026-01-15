const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to databse');
    } catch (error) {
    console.error(error.message);
    }
}

module.exports = connectToDatabase;