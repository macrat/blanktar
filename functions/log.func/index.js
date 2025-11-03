const crypto = require('crypto');

const { BigQuery } = require('@google-cloud/bigquery');
const { waitUntil } = require('@vercel/functions');

const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const DATASET = process.env.BQ_DATASET;
const TABLE = process.env.BQ_TABLE;

async function handler(req) {
  const data = {
    recorded_at: new Date(),
    requested_at: new Date(req.body.requested_at),
    loaded_at: new Date(req.body.loaded_at),
    fcp: req.body.fcp,
    path: req.body.path,
    queries: JSON.stringify(req.body.queries),
    user_agent: req.headers['user-agent'] ?? '',
    window_width: req.body.window_width,
    window_height: req.body.window_height,
  };

  try {
    await bigquery
      .dataset(DATASET)
      .table(TABLE)
      .insert(data);
  } catch (e) {
    if (e.errors) {
      for (const err of e.errors) {
        console.error('BigQuery insert error:', err);
      }
    } else {
      console.error('Error inserting rows into BigQuery:', e);
    }
  }
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  } else if (req.headers['content-type'] !== 'application/json') {
    res.status(400).send('Bad Request: Content-Type must be application/json');
    return;
  }

  waitUntil(handler(req));

  res.status(201).send();
}
