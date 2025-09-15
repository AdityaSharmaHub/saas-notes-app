const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Middleware to check subscription limits
const checkSubscriptionLimits = async (req, res, next) => {
  try {
    const { user } = req;
    
    // Only check limits for free subscriptions on note creation
    if (user.tenant.subscription === 'free' && req.method === 'POST') {
      const noteCount = await prisma.note.count({
        where: { tenantId: user.tenantId },
      });
      
      if (noteCount >= 3) {
        return res.status(403).json({
          error: 'Subscription limit exceeded',
          message: 'Free plan limited to 3 notes. Upgrade to Pro for unlimited notes.',
          currentPlan: 'free',
          limit: 3,
          current: noteCount,
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /notes - List all notes for the current tenant
router.get('/', async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: { tenantId: req.user.tenantId },
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      notes,
      total: notes.length,
      subscription: req.user.tenant.subscription,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /notes/:id - Retrieve a specific note
router.get('/:id', [
  param('id').isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId, // Enforce tenant isolation
      },
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /notes - Create a note
router.post('/', [
  body('title').isString().trim().isLength({ min: 1, max: 200 }),
  body('content').isString().trim().isLength({ min: 1, max: 10000 }),
], checkSubscriptionLimits, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, content } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: req.user.id,
        tenantId: req.user.tenantId,
      },
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /notes/:id - Update a note
router.put('/:id', [
  param('id').isString(),
  body('title').optional().isString().trim().isLength({ min: 1, max: 200 }),
  body('content').optional().isString().trim().isLength({ min: 1, max: 10000 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { title, content } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;

    // Check if note exists and belongs to user's tenant
    const existingNote = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const updatedNote = await prisma.note.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    });

    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /notes/:id - Delete a note
router.delete('/:id', [
  param('id').isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Invalid note ID' });
    }

    // Check if note exists and belongs to user's tenant
    const existingNote = await prisma.note.findFirst({
      where: {
        id: req.params.id,
        tenantId: req.user.tenantId,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    await prisma.note.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;