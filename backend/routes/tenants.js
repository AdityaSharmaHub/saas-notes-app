const express = require('express');
const { param, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken, requireRole, enforceTenantIsolation } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /tenants/:slug/upgrade - Upgrade tenant subscription (Admin only)
router.post('/:slug/upgrade', [
  param('slug').isString().trim().isLength({ min: 1 }),
], enforceTenantIsolation, requireRole('admin'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { slug } = req.params;

    // Find and update tenant
    const tenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    if (tenant.subscription === 'pro') {
      return res.status(400).json({
        error: 'Already subscribed',
        message: 'Tenant is already on Pro plan',
        currentPlan: 'pro',
      });
    }

    // Upgrade to Pro
    const updatedTenant = await prisma.tenant.update({
      where: { slug },
      data: { subscription: 'pro' },
    });

    // Get updated note count for confirmation
    const noteCount = await prisma.note.count({
      where: { tenantId: tenant.id },
    });

    res.json({
      message: 'Subscription upgraded successfully',
      tenant: {
        id: updatedTenant.id,
        slug: updatedTenant.slug,
        name: updatedTenant.name,
        subscription: updatedTenant.subscription,
      },
      noteCount,
      limits: {
        previous: 3,
        current: 'unlimited',
      },
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /tenants/:slug/info - Get tenant information (Admin only)
router.get('/:slug/info', [
  param('slug').isString().trim().isLength({ min: 1 }),
], enforceTenantIsolation, requireRole('admin'), async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { slug } = req.params;

    const tenant = await prisma.tenant.findUnique({
      where: { slug },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            notes: true,
            users: true,
          },
        },
      },
    });

    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }

    res.json({
      tenant: {
        id: tenant.id,
        slug: tenant.slug,
        name: tenant.name,
        subscription: tenant.subscription,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      stats: {
        totalNotes: tenant._count.notes,
        totalUsers: tenant._count.users,
        noteLimit: tenant.subscription === 'free' ? 3 : 'unlimited',
      },
      users: tenant.users,
      limits: {
        notes: tenant.subscription === 'free' ? 3 : null,
        currentUsage: tenant._count.notes,
      },
    });
  } catch (error) {
    console.error('Get tenant info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;