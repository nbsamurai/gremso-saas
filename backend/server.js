require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const app = express();
const http = require('http');
const { Server } = require('socket.io');
const allowedOrigins = [
    'http://localhost:5173',
    'https://buxton-saas-new.vercel.app',
    'https://zentivoratech.com',
    'https://www.zentivoratech.com'
];
const corsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    optionsSuccessStatus: 204
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: corsOptions
});

app.locals.io = io;

io.on('connection', (socket) => {
    socket.on('register', (userId) => {
        socket.join(userId);
    });
});

// Connect Database
connectDB();

const path = require('path');

// Init Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 10000 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// Define Routes
app.get('/', (req, res) => {
    res.send('ZENTIVORA Backend API Running');
});
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend connected successfully' });
});
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/dashboard', require('./routes/statsRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/tasks', require('./routes/taskMessageRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/invites', require('./routes/inviteRoutes'));
app.use('/api', require('./routes/mailRoutes'));

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log('---');
    console.log('Server running successfully');
    console.log(`Backend API: http://localhost:${PORT}`);
    console.log('Frontend App: http://localhost:5173');
});
