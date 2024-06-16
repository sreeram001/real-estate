import { Router } from "express";
import userRoutes from "./user.routes";
import dashboardRoutes from "./dashboard.routes";
import { ApiHeaderAuthentication } from "../middleware/authentication";

const router = Router();

router.use("/user", userRoutes);
router.use("/dashboard", ApiHeaderAuthentication, dashboardRoutes);

export default router;
