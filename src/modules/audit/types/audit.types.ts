export type AuditLogRecord = {
  id: string;
  actor_id?: string | null;
  action: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
};
