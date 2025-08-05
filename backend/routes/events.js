const express = require('express');
const db = require('../database/connection');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { date, category, location, page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('events')
      .select(
        'events.*',
        'locations.name as location_name',
        'locations.address',
        'locations.city',
        'locations.state',
        'locations.country',
        'users.name as created_by_name',
        db.raw('(SELECT COUNT(*) FROM event_registrations WHERE event_registrations.event_id = events.id AND event_registrations.status = ?) AS registrations_count', ['registered'])
      )
      .leftJoin('locations', 'events.location_id', 'locations.id')
      .leftJoin('users', 'events.created_by', 'users.id');

    if (date) {
      query = query.where('events.date', date);
    }
    
    if (category) {
      query = query.where('events.category', 'like', `%${category}%`);
    }
    
    if (location) {
      query = query.where(function() {
        this.where('locations.name', 'like', `%${location}%`)
            .orWhere('locations.city', 'like', `%${location}%`)
            .orWhere('locations.state', 'like', `%${location}%`);
      });
    }

    // Create a separate count query without the joins to avoid GROUP BY issues
    let countQuery = db('events');
    
    if (date) {
      countQuery = countQuery.where('events.date', date);
    }
    
    if (category) {
      countQuery = countQuery.where('events.category', 'like', `%${category}%`);
    }
    
    if (location) {
      countQuery = countQuery
        .leftJoin('locations', 'events.location_id', 'locations.id')
        .where(function() {
          this.where('locations.name', 'like', `%${location}%`)
              .orWhere('locations.city', 'like', `%${location}%`)
              .orWhere('locations.state', 'like', `%${location}%`);
        });
    }
    
    const total = await countQuery.count('events.id as count').first();
    const totalEvents = total.count;

    const events = await query
      .limit(parseInt(limit))
      .offset(parseInt(offset))
      .orderBy('events.date', 'asc');

    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalEvents,
        pages: Math.ceil(totalEvents / limit)
      }
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await db('events')
      .select(
        'events.*',
        'locations.name as location_name',
        'locations.address',
        'locations.city',
        'locations.state',
        'locations.country',
        'users.name as created_by_name'
      )
      .leftJoin('locations', 'events.location_id', 'locations.id')
      .leftJoin('users', 'events.created_by', 'users.id')
      .where('events.id', id)
      .first();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await db('event_registrations')
      .count('* as count')
      .where('event_id', id)
      .where('status', 'registered')
      .first();

    event.registrations_count = registrations.count;

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { title, description, date, category, location_id } = req.body;

    if (!title || !description || !date || !category || !location_id) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [eventId] = await db('events').insert({
      title,
      description,
      date,
      category,
      location_id,
      created_by: req.user.id
    });

    const event = await db('events')
      .select(
        'events.*',
        'locations.name as location_name',
        'locations.address',
        'locations.city',
        'locations.state',
        'locations.country'
      )
      .leftJoin('locations', 'events.location_id', 'locations.id')
      .where('events.id', eventId)
      .first();

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, category, location_id } = req.body;

    const existingEvent = await db('events').where({ id }).first();
    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await db('events')
      .where({ id })
      .update({
        title: title || existingEvent.title,
        description: description || existingEvent.description,
        date: date || existingEvent.date,
        category: category || existingEvent.category,
        location_id: location_id || existingEvent.location_id
      });

    const updatedEvent = await db('events')
      .select(
        'events.*',
        'locations.name as location_name',
        'locations.address',
        'locations.city',
        'locations.state',
        'locations.country'
      )
      .leftJoin('locations', 'events.location_id', 'locations.id')
      .where('events.id', id)
      .first();

    res.json({
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    const event = await db('events').where({ id }).first();
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await db.transaction(async (trx) => {
      await trx('event_registrations').where({ event_id: id }).del();
      await trx('events').where({ id }).del();
    });

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;