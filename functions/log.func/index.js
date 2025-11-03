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

async function handler(req, recordedAt) {
  const data = {
    recorded_at: recordedAt,
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
  const recordedAt = new Date();

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  } else if (req.headers['content-type'] !== 'application/json') {
    res.status(400).json({ error: 'Invalid Content-Type' });
    return;
  }

  const errors = [];
  if (isNaN(req.body.requested_at)) {
    errors.push('requested_at must be a valid timestamp');
  }
  if (isNaN(req.body.loaded_at)) {
    errors.push('loaded_at must be a valid timestamp');
  }
  if (req.body.fcp !== undefined && (isNaN(req.body.fcp) || req.body.fcp < 0)) {
    errors.push('fcp must be a positive number');
  }
  if (typeof req.body.path !== 'string' || req.body.path.length === 0) {
    errors.push('path must be a non-empty string');
  }
  if (typeof req.body.queries !== 'object' || req.body.queries === null) {
    errors.push('queries must be a valid object');
  }
  if (typeof req.body.window_width !== 'number' || req.body.window_width <= 0) {
    errors.push('window_width must be a positive number');
  }
  if (typeof req.body.window_height !== 'number' || req.body.window_height <= 0) {
    errors.push('window_height must be a positive number');
  }
  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  waitUntil(handler(req, recordedAt));

  res.status(201).send();
}
