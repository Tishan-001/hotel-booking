import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "../middleware/auth";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:7001";
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:7002";
const HOTEL_SERVICE_URL = process.env.HOTEL_SERVICE_URL || "http://localhost:7003";
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://localhost:7004";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
    console.log(`🔄 API Gateway: ${req.method} ${req.originalUrl}`);
    next();
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'API Gateway',
        timestamp: new Date().toISOString(),
        services: {
            auth: AUTH_SERVICE_URL,
            user: USER_SERVICE_URL,
            hotel: HOTEL_SERVICE_URL,
            booking: BOOKING_SERVICE_URL
        }
    });
});

// Auth routes (no authentication needed)
router.use(
    "/api/auth",
    createProxyMiddleware({
        target: AUTH_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/auth": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`🔐 Proxying to Auth Service: ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
            console.error('Auth Service Error:', err.message);
            res.status(503).json({ error: 'Auth service unavailable' });
        }
    })
);

// User registration (public)
router.use(
    "/api/users/register",
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`👤 Proxying registration to User Service: ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
            console.error('User Service Error (Register):', err.message);
            res.status(503).json({ error: 'User service unavailable' });
        }
    })
);

// User login (public)
router.use(
    "/api/users/login",
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`👤 Proxying login to User Service: ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
            console.error('User Service Error (Login):', err.message);
            res.status(503).json({ error: 'User service unavailable' });
        }
    })
);

// Protected user routes (like /me endpoint)
router.use(
    "/api/users",
    verifyToken,
    createProxyMiddleware({
        target: USER_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`👤 Proxying to User Service (Protected): ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
            console.error('User Service Error (Protected):', err.message);
            res.status(503).json({ error: 'User service unavailable' });
        }
    })
);

// Hotel booking routes (create payment intent, create booking)
router.use(
    "/api/hotels/:hotelId/bookings",
    verifyToken,
    createProxyMiddleware({
        target: BOOKING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: (path, req) =>
        path.replace(/^\/api\/hotels\/[^/]+\/bookings/, "/bookings"),
        onProxyReq: (proxyReq, req: any, res) => {
        console.log(`💳 Proxying to Booking Service (Hotel Bookings): ${req.method} ${req.originalUrl}`);
        if (req.userId) proxyReq.setHeader("x-user-id", req.userId);

        const match = req.originalUrl.match(/\/api\/hotels\/([^/]+)\/bookings/);
        if (match) proxyReq.setHeader("x-hotel-id", match[1]);
        },
        onError: (err, req, res) => {
        console.error('Booking Service Error (Hotel Bookings):', err.message);
        res.status(503).json({ error: 'Booking service unavailable' });
        }
    })
);

// Public hotel routes (search, get all hotels, get hotel by id)
router.use(
    "/api/hotels",
    createProxyMiddleware({
        target: HOTEL_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/hotels": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`🏨 Proxying to Hotel Service: ${req.method} ${req.originalUrl}`);
        },
        onError: (err, req, res) => {
            console.error('Hotel Service Error:', err.message);
            res.status(503).json({ error: 'Hotel service unavailable' });
        }
    })
);

// Protected hotel routes (user's hotels)
router.use(
    "/api/my-hotels",
    verifyToken,
    createProxyMiddleware({
        target: HOTEL_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/my-hotels": "" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`🏨 Proxying to Hotel Service (My Hotels): ${req.method} ${req.originalUrl}`);

            if (req.userId) {
                proxyReq.setHeader("x-user-id", req.userId);
            } else {
                console.warn("⚠️ No userId found in request, header not set!");
            }
        },
        onError: (err, req, res) => {
            console.error('Hotel Service Error (My Hotels):', err.message);
            res.status(503).json({ error: 'Hotel service unavailable' });
        }
    })
);

// Protected booking routes
router.use(
    "/api/my-bookings",
    verifyToken,
    createProxyMiddleware({
        target: BOOKING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: { "^/api/my-bookings": "bookings" },
        onProxyReq: (proxyReq, req, res) => {
            console.log(`📅 Proxying to Booking Service: ${req.method} ${req.originalUrl}`);

            if (req.userId) {
                proxyReq.setHeader("x-user-id", req.userId);
            } else {
                console.warn("⚠️ No userId found in request, header not set!");
            }
        },
        onError: (err, req, res) => {
            console.error('Booking Service Error:', err.message);
            res.status(503).json({ error: 'Booking service unavailable' });
        }
    })
);

export default router;