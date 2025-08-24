import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Auth routes (no authentication needed)
router.use(
    "/api/auth",
    createProxyMiddleware({
        target: "http://auth-service:7001",
        changeOrigin: true,
        pathRewrite: { "^/api/auth": "" },
    })
);

// User routes (protected)
router.use(
    "/api/users",
    verifyToken,
    createProxyMiddleware({
        target: "http://user-service:7002",
        changeOrigin: true,
        pathRewrite: { "^/api/users": "" },
    })
);

// Public hotel routes
router.use(
    "/api/hotels",
    createProxyMiddleware({
        target: "http://hotel-service:7003",
        changeOrigin: true,
        pathRewrite: { "^/api/hotels": "" },
    })
);

// Protected hotel routes (user's hotels)
router.use(
    "/api/my-hotels",
    verifyToken,
    createProxyMiddleware({
        target: "http://hotel-service:7003",
        changeOrigin: true,
        pathRewrite: { "^/api/my-hotels": "/my" },
    })
);

// Protected booking routes
router.use(
    "/api/my-bookings",
    verifyToken,
    createProxyMiddleware({
        target: "http://booking-service:7004",
        changeOrigin: true,
        pathRewrite: { "^/api/my-bookings": "" },
    })
);

// Hotel booking routes
router.use(
    "/api/hotels/:hotelId/bookings",
    verifyToken,
    createProxyMiddleware({
        target: "http://booking-service:7004",
        changeOrigin: true,
        pathRewrite: { "^/api/hotels/[^/]+/bookings": "/bookings" },
    })
);

export default router;
