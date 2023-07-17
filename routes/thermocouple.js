const express = require('express')
const router = express.Router()
const Thermocouple = require('../models/thermocouple')
const secondsOfWeek = getSecondsOfWeek();

// GET all
router.get('/', async (req, res) => {
    try{
      const thermocouple = await Thermocouple.find()
      res.json(thermocouple)
    } catch (err) {
      res.status(500).json({message: err.message}) // client error
    }
})

// GET one
router.get('/:id', getThermStats, (req, res) => {
    res.json(res.thermocouple)
})

// CREATE -> one (POST/PUT)
router.post('/', async (req, res) => { // requests by ID
  // res.send('Hello World')
    const thermocouple = new Thermocouple({
        // body = json, thermSN property
        thermSN: req.body.thermSN,
        thermSetPoint: req.body.thermSetPoint,
        thermSetPointTimeofWeek: req.body.thermSetPointTimeofWeek

})

try { 
    const newSetting = await thermocouple.save()
    res.status(201).json(newSetting) // success
} catch(err) {
  res.status(400) // user bad data error
}
   
})

// UPDATE one (not PUT, but for updates)
router.patch('/:id', getThermStats, async (req, res) => {
    if (req.body.thermSN != null) {
        res.thermocouple.thermSN = req.body.thermSN
    }
    if (req.body.thermSetPoint != null) {
        res.thermocouple.thermSetPoint = req.body.thermSetPoint
        res.thermSetPointTimeofWeek = req.body.thermSetPointTimeofWeek
    }
    try {
      const updatedSettings = await res.thermocouple.save()
      res.json(updatedSettings)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})

// DELETE one

router.delete('/:id', async (req, res) => {
    try {
      const removedSetting = await Thermocouple.findByIdAndRemove(req.params.id);
      if (!removedSetting) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'Deleted settings' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

async function getThermStats(req, res, next) {
  let thermocouple
  try {
    thermocouple = await Thermocouple.findById(req.params.id) // pass the id
    if (thermocouple == null) {
      return res.status(404).json({ message: 'Cannot find setting' }) // if not able to find
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

    res.thermocouple = thermocouple
  next()
}

// Get time in seconds of week
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

module.exports = router