export const throwInlineError = (input: Error | string) => {
  const error = typeof input === "string" ? new Error(input) : input;
  throw error;
};

export const requiredEnvVar = (name: string) =>
  process.env[name] ?? throwInlineError(`No ${name} in environment`);
