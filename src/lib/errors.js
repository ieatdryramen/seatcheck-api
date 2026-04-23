// Centralized error handling.
// Throw AppError(status, message) from anywhere; errorHandler translates to HTTP.

export class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const errorHandler = (err, req, res, _next) => {
  // Zod validation errors
  if (err?.name === "ZodError") {
    return res.status(400).json({ error: "ValidationError", issues: err.errors });
  }
  // Prisma unique-constraint
  if (err?.code === "P2002") {
    return res.status(409).json({ error: "Conflict", message: "Record already exists", target: err.meta?.target });
  }
  // Prisma not-found
  if (err?.code === "P2025") {
    return res.status(404).json({ error: "NotFound", message: err.meta?.cause ?? "Record not found" });
  }
  // Custom AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  // Fallback
  console.error("[unhandled]", err);
  res.status(500).json({ error: "InternalServerError", message: err?.message ?? "Something went wrong" });
};

// Async route wrapper — Express 4 doesn't auto-catch async rejections
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
