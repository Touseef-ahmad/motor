import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";

const SALT_ROUNDS = 12;

const signAccess = (payload: { id: string; email: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "15m") as any,
  });

const signRefresh = (payload: { id: string; email: string }) =>
  jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
  });

// ─── Register ─────────────────────────────────────────────────────────────────

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }

  if (password.length < 8) {
    res
      .status(400)
      .json({ error: "Password must be at least 8 characters long." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await User.findOne({ where: { email: normalizedEmail } });
  if (existing) {
    res
      .status(409)
      .json({ error: "An account with that email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ email: normalizedEmail, passwordHash });

  const tokenPayload = { id: user.id, email: user.email };
  const accessToken = signAccess(tokenPayload);
  const refreshToken = signRefresh(tokenPayload);

  res.status(201).json({
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
  });
};

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ where: { email: normalizedEmail } });

  // Use the same error for "not found" and "wrong password" to prevent user enumeration
  const invalidCredentials = () => {
    res.status(401).json({ error: "Invalid email or password." });
  };

  if (!user) {
    invalidCredentials();
    return;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    invalidCredentials();
    return;
  }

  const tokenPayload = { id: user.id, email: user.email };
  const accessToken = signAccess(tokenPayload);
  const refreshToken = signRefresh(tokenPayload);

  res.json({
    user: { id: user.id, email: user.email },
    accessToken,
    refreshToken,
  });
};

// ─── Refresh ──────────────────────────────────────────────────────────────────

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body as { refreshToken?: string };

  if (!refreshToken) {
    res.status(400).json({ error: "refreshToken is required." });
    return;
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
    ) as { id: string; email: string };

    const user = await User.findByPk(payload.id);
    if (!user) {
      res.status(401).json({ error: "User no longer exists." });
      return;
    }

    const accessToken = signAccess({ id: user.id, email: user.email });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: "Invalid or expired refresh token." });
  }
};

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = async (_req: Request, res: Response): Promise<void> => {
  // Stateless JWT — client is responsible for discarding tokens.
  // Extend here with a token-blacklist table if needed.
  res.status(204).send();
};

// ─── Me ───────────────────────────────────────────────────────────────────────

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  const user = await User.findByPk(req.user!.id, {
    attributes: ["id", "email", "createdAt"],
  });

  if (!user) {
    res.status(404).json({ error: "User not found." });
    return;
  }

  res.json(user);
};
