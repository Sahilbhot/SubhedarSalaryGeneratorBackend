'use strict';

const Fastify = require('fastify');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Create Fastify instance
const fastify = Fastify({ logger: false });

// CORS
fastify.addHook('onRequest', async (request, reply) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (request.method === 'OPTIONS') {
        reply.code(204).send();
    }
});

// ─── Health Check ───────────────────────────────────────────────────────────
fastify.get('/', async (request, reply) => {
    return { status: 'ok', message: 'Subhedar Salary Generator API' };
});

fastify.get('/api/health', async (request, reply) => {
    return { status: 'ok' };
});

// ─── GET all employees ───────────────────────────────────────────────────────
fastify.get('/api/employees', async (request, reply) => {
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return reply.code(500).send({ success: false, error: error.message });
    }
    return { success: true, data };
});

// ─── GET single employee ─────────────────────────────────────────────────────
fastify.get('/api/employees/:id', async (request, reply) => {
    const { id } = request.params;
    const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', id)
        .single();

    if (error) {
        return reply.code(404).send({ success: false, error: 'Employee not found' });
    }
    return { success: true, data };
});

// ─── POST create employee ────────────────────────────────────────────────────
fastify.post('/api/employees', async (request, reply) => {
    const { employee_name, phone_number, joining_date, salary } = request.body;

    if (!employee_name || !joining_date || salary === undefined) {
        return reply.code(400).send({
            success: false,
            error: 'employee_name, joining_date, and salary are required',
        });
    }

    const { data, error } = await supabase
        .from('employees')
        .insert([{ employee_name, phone_number, joining_date, salary }])
        .select()
        .single();

    if (error) {
        return reply.code(500).send({ success: false, error: error.message });
    }
    return reply.code(201).send({ success: true, data });
});

// ─── PUT update employee ─────────────────────────────────────────────────────
fastify.put('/api/employees/:id', async (request, reply) => {
    const { id } = request.params;
    const { employee_name, phone_number, joining_date, salary } = request.body;

    const updates = {};
    if (employee_name !== undefined) updates.employee_name = employee_name;
    if (phone_number !== undefined) updates.phone_number = phone_number;
    if (joining_date !== undefined) updates.joining_date = joining_date;
    if (salary !== undefined) updates.salary = salary;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
        .from('employees')
        .update(updates)
        .eq('employee_id', id)
        .select()
        .single();

    if (error) {
        return reply.code(500).send({ success: false, error: error.message });
    }
    return { success: true, data };
});

// ─── DELETE employee ─────────────────────────────────────────────────────────
fastify.delete('/api/employees/:id', async (request, reply) => {
    const { id } = request.params;

    const { error } = await supabase
        .from('employees')
        .delete()
        .eq('employee_id', id);

    if (error) {
        return reply.code(500).send({ success: false, error: error.message });
    }
    return { success: true, message: 'Employee deleted successfully' };
});

// ─── Vercel serverless export ────────────────────────────────────────────────
const handler = async (req, res) => {
    await fastify.ready();
    fastify.server.emit('request', req, res);
};

module.exports = handler;
// Expose the Fastify instance for local standalone runs (see local.js)
module.exports.fastify = fastify;
