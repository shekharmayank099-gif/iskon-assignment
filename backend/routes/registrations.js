const express = require('express');
const db = require('../database/connection');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/:eventId/register', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await db('events').where({ id: eventId }).first();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingRegistration = await db('event_registrations')
      .where({ user_id: userId, event_id: eventId })
      .first();

    if (existingRegistration) {
      if (existingRegistration.status === 'registered') {
        return res.status(400).json({ message: 'Already registered for this event' });
      } else {
        await db('event_registrations')
          .where({ user_id: userId, event_id: eventId })
          .update({ status: 'registered', registration_date: db.fn.now() });
        
        return res.json({ message: 'Successfully re-registered for the event' });
      }
    }

    await db('event_registrations').insert({
      user_id: userId,
      event_id: eventId,
      status: 'registered'
    });

    res.status(201).json({ message: 'Successfully registered for the event' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:eventId/register', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await db('event_registrations')
      .where({ user_id: userId, event_id: eventId, status: 'registered' })
      .first();

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await db('event_registrations')
      .where({ user_id: userId, event_id: eventId })
      .update({ status: 'cancelled' });

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/registrations', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    const registrations = await db('event_registrations')
      .select(
        'event_registrations.*',
        'events.title',
        'events.description',
        'events.date',
        'events.category',
        'locations.name as location_name',
        'locations.address',
        'locations.city',
        'locations.state',
        'locations.country'
      )
      .leftJoin('events', 'event_registrations.event_id', 'events.id')
      .leftJoin('locations', 'events.location_id', 'locations.id')
      .where('event_registrations.user_id', userId)
      .where('event_registrations.status', 'registered')
      .orderBy('events.date', 'asc');

    res.json({ registrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:eventId/registrations', authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const registrations = await db('event_registrations')
      .select(
        'event_registrations.*',
        'users.name as user_name',
        'users.email as user_email'
      )
      .leftJoin('users', 'event_registrations.user_id', 'users.id')
      .where('event_registrations.event_id', eventId)
      .where('event_registrations.status', 'registered')
      .orderBy('event_registrations.registration_date', 'desc');

    res.json({ registrations });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;