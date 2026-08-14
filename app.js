const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin.split(',') }));
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Backend do sistema de portaria de frota online',
    docs: {
      health: '/api/health',
      login: '/api/auth/login',
      me: '/api/auth/me',
      users: '/api/users',
      vehicles: '/api/vehicles',
      drivers: '/api/drivers',
      schedules: '/api/schedules',
      suppliers: '/api/suppliers',
      people: '/api/people',
      accesses: '/api/accesses',
      departures: '/api/movements/departures',
      entries: '/api/movements/entries',
      alerts: '/api/alerts',
      dashboard: '/api/dashboard/summary'
    }
  });
});

app.use('/api', routes);
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  return res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});
app.use(notFound);
app.use(errorHandler);

module.exports = app;
