const Fastify = require('fastify');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Fastify
const app = Fastify({ logger: true });

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Define Routes
app.get('/', async (request, reply) => {
    return { status: 'success', message: 'Fastify backend is running on Vercel!' };
});

app.get('/users', async (request, reply) => {
    // Fetch data from your Supabase 'users' table
    const { data, error } = await supabase.from('users').select('*');

    if (error) {
        return reply.status(500).send({ error: error.message });
    }

    return { data };
});

// Export a Vercel Serverless Function wrapper
module.exports = async (req, res) => {
    await app.ready();
    // Pass the serverless request and response to Fastify's internal server
    app.server.emit('request', req, res);
};
