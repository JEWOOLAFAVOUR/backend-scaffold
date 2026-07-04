export type AuditEvent =
  | "auth.signup"
  | "auth.login"
  | "auth.logout"
  | "auth.failed_login";
