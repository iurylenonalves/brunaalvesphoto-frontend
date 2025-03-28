export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export function validateSMTPConfig(): SMTPConfig {
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    throw new Error("Missing required SMTP credentials.");
  }

  return { host: smtpHost, port: smtpPort, user: smtpUser, pass: smtpPass };
}