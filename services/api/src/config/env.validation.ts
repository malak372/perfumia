export function validateEnv(
  config: Record<string, unknown>,
) {
  const required = [
    'DATABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_PUBLISHABLE_KEY',
    'SUPABASE_SECRET_KEY',
  ];

  for (
    const key of required
  ) {
    if (!config[key]) {
      throw new Error(
        `Missing environment variable: ${key}`,
      );
    }
  }

  const port =
    Number(
      config['PORT'] ??
        3000,
    );

  if (
    Number.isNaN(port)
  ) {
    throw new Error(
      'PORT must be a valid number',
    );
  }

  return {
    ...config,

    PORT: port,

    CORS_ORIGINS:
      config[
        'CORS_ORIGINS'
      ] ??
      'http://localhost:5173',
  };
}