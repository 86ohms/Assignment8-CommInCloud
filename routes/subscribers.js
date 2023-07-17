const express = require('express')
const router = express.Router()
const Subscriber = require('../models/subscriber')

// GET all
router.get('/', async (req, res) => {
    try{
      const subscriber = await Subscriber.find()
      res.json(subscriber)
    } catch (err) {
      res.status(500).json({message: err.message}) // client error
    }
})

// GET one
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
})

// CREATE -> one (POST/PUT)
router.post('/', async (req, res) => { // requests by ID
    const subscriber = new Subscriber({
        // body = json, name property
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
})

try { 
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber) // success
} catch(err) {
  res.status(400) // user bad data error
}
   
})

// UPDATE one (not PUT, but for updates)
router.patch('/:id', getSubscriber, async (req, res) => {
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null) {
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try {
      const updatedSubscriber = await res.subscriber.save()
      res.json(updatedSubscriber)
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
})

// DELETE one

router.delete('/:id', async (req, res) => {
    try {
      const removedSubscriber = await Subscriber.findByIdAndRemove(req.params.id);
      if (!removedSubscriber) {
        return res.status(404).json({ message: 'Not found' });
      }
      res.json({ message: 'Deleted xyz' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

async function getSubscriber(req, res, next) {
  let subscriber
  try {
    subscriber = await Subscriber.findById(req.params.id) // pass the id
    if (subscriber == null) {
      return res.status(404).json({ message: 'Cannot find' }) // if not able to find
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

    res.subscriber = subscriber
  next()
}

module.exports = router