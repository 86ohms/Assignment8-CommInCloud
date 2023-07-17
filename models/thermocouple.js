const mongoose = require('mongoose')
const secondsOfWeek = getSecondsOfWeek();

// Get time in seconds of week TBD
function getSecondsOfWeek() {
    const millisecondsInSecond = 1000;
    const millisecondsInMinute = 60 * millisecondsInSecond;
    const millisecondsInHour = 60 * millisecondsInMinute;
    const millisecondsInDay = 24 * millisecondsInHour;
    const millisecondsInWeek = 7 * millisecondsInDay;
  
    const currentTimestamp = Date.now();
    const daysElapsed = Math.floor(currentTimestamp / millisecondsInDay) % 7;
    const secondsElapsed = Math.floor((currentTimestamp % millisecondsInDay) / millisecondsInSecond);
  
    const secondsOfWeek = (daysElapsed * 24 * 60 * 60) + secondsElapsed;
    return secondsOfWeek;
}

const thermocoupleSchema = new mongoose.Schema({
    thermSN: {
        type: String,
        required: true
    },

    thermSetPoint: {
        type: Number,
        required: true
    },
    thermSetPointTimeofWeek: {
        type: String,
        required: true,
        default: secondsOfWeek
        // default: Date.now       
    },
    thermUserUpdate: {
        type: Date,
        required: true,
        default: Date.now       
    }
    
})
  
  // Usage
  
//   console.log(secondsOfWeek);

// args are database name and database schema
module.exports = mongoose.model('Thermocouple', thermocoupleSchema)