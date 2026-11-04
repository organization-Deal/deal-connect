-- DEAL! Connect initial D1 schema. Dedicated database only; synthetic/demo rows are not imported.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS customers (
 customer_id TEXT PRIMARY KEY, source_system TEXT NOT NULL DEFAULT 'LARK', source_record_id TEXT NOT NULL,
 customer_type TEXT NOT NULL DEFAULT 'PERSON', display_name TEXT NOT NULL, email_normalized TEXT, phone_normalized TEXT,
 email_verified_at TEXT, phone_verified_at TEXT, status TEXT NOT NULL DEFAULT 'ACTIVE',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE(source_system,source_record_id)
);
CREATE TABLE IF NOT EXISTS customer_accounts (
 account_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(customer_id), provider TEXT NOT NULL,
 provider_user_id TEXT NOT NULL, linked_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, status TEXT NOT NULL DEFAULT 'ACTIVE',
 UNIQUE(provider,provider_user_id)
);
CREATE TABLE IF NOT EXISTS verification_requests (
 request_id TEXT PRIMARY KEY, provider TEXT, provider_user_id TEXT, submitted_name TEXT NOT NULL,
 submitted_email TEXT, submitted_phone TEXT, candidate_customer_id TEXT REFERENCES customers(customer_id),
 match_status TEXT NOT NULL DEFAULT 'PENDING', review_note TEXT, reviewed_by TEXT, reviewed_at TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
 session_id TEXT PRIMARY KEY, provider TEXT NOT NULL, provider_user_id TEXT NOT NULL,
 display_name TEXT, email TEXT, role TEXT NOT NULL DEFAULT 'CUSTOMER', customer_id TEXT REFERENCES customers(customer_id),
 expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS locations (
 loc_id TEXT PRIMARY KEY, source_record_id TEXT NOT NULL UNIQUE, location_name TEXT NOT NULL,
 business_type TEXT, status TEXT NOT NULL DEFAULT 'ACTIVE', updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS holdings (
 holding_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(customer_id),
 loc_id TEXT NOT NULL REFERENCES locations(loc_id), source_record_id TEXT NOT NULL UNIQUE,
 percentage REAL NOT NULL CHECK(percentage>=0 AND percentage<=100), status TEXT NOT NULL DEFAULT 'ACTIVE', effective_at TEXT
);
CREATE TABLE IF NOT EXISTS projects (
 project_id TEXT PRIMARY KEY, project_name TEXT NOT NULL, business_type TEXT,
 status TEXT NOT NULL DEFAULT 'PLANNING', progress INTEGER NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS cases (
 case_id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers(customer_id), loc_id TEXT REFERENCES locations(loc_id),
 title TEXT NOT NULL, description TEXT, category TEXT NOT NULL DEFAULT 'GENERAL', status TEXT NOT NULL DEFAULT 'OPEN',
 priority TEXT NOT NULL DEFAULT 'NORMAL', assigned_team TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, closed_at TEXT
);
CREATE TABLE IF NOT EXISTS votes (
 vote_id TEXT PRIMARY KEY, project_id TEXT REFERENCES projects(project_id), loc_id TEXT REFERENCES locations(loc_id),
 title TEXT NOT NULL, description TEXT, vote_type TEXT NOT NULL DEFAULT 'POLL',
 weighting_rule TEXT NOT NULL DEFAULT 'ONE_PERSON_ONE_VOTE', opens_at TEXT, closes_at TEXT,
 status TEXT NOT NULL DEFAULT 'DRAFT', created_by TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS vote_eligibility (
 vote_id TEXT NOT NULL REFERENCES votes(vote_id), customer_id TEXT NOT NULL REFERENCES customers(customer_id),
 weight REAL NOT NULL DEFAULT 1, PRIMARY KEY(vote_id,customer_id)
);
CREATE TABLE IF NOT EXISTS vote_ballots (
 vote_id TEXT NOT NULL REFERENCES votes(vote_id), customer_id TEXT NOT NULL REFERENCES customers(customer_id),
 choice TEXT NOT NULL, cast_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(vote_id,customer_id)
);
CREATE TABLE IF NOT EXISTS announcements (
 announcement_id TEXT PRIMARY KEY, title TEXT NOT NULL, body TEXT NOT NULL,
 audience_type TEXT NOT NULL DEFAULT 'ALL', audience_ref TEXT, status TEXT NOT NULL DEFAULT 'DRAFT',
 publish_at TEXT, created_by TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS documents (
 document_id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers(customer_id), loc_id TEXT REFERENCES locations(loc_id),
 title TEXT NOT NULL, category TEXT, storage_key TEXT NOT NULL, visibility TEXT NOT NULL DEFAULT 'CUSTOMER',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS finance_entries (
 finance_id TEXT PRIMARY KEY, customer_id TEXT NOT NULL REFERENCES customers(customer_id), loc_id TEXT REFERENCES locations(loc_id),
 entry_type TEXT NOT NULL, description TEXT NOT NULL, amount_minor INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'THB',
 period_label TEXT, status TEXT NOT NULL DEFAULT 'PENDING', source_record_id TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notification_logs (
 notification_id TEXT PRIMARY KEY, customer_id TEXT REFERENCES customers(customer_id), channel TEXT NOT NULL DEFAULT 'LINE',
 event_type TEXT NOT NULL, message_summary TEXT NOT NULL, delivery_status TEXT NOT NULL DEFAULT 'QUEUED',
 provider_message_id TEXT, sent_at TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS staff_users (
 staff_id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, role TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'ACTIVE', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit_logs (
 audit_id TEXT PRIMARY KEY, actor_type TEXT NOT NULL, actor_id TEXT NOT NULL, action TEXT NOT NULL,
 entity_type TEXT NOT NULL, entity_id TEXT NOT NULL, detail_json TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_customer_accounts_customer ON customer_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_verification_status ON verification_requests(match_status,created_at);
CREATE INDEX IF NOT EXISTS idx_holdings_customer ON holdings(customer_id,status);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status,updated_at);
CREATE INDEX IF NOT EXISTS idx_votes_status ON votes(status,closes_at);
CREATE INDEX IF NOT EXISTS idx_finance_customer ON finance_entries(customer_id,created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_customer ON notification_logs(customer_id,created_at);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);
