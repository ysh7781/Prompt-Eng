-- ── TryHackMe Cyber Platform Schema & Seeds ─────────────────────────────────

-- 1. Learning Paths Table
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced
    estimated_hours INT NOT NULL DEFAULT 10,
    icon VARCHAR(100) NOT NULL DEFAULT 'Shield',
    order_idx INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Rooms / Labs Table
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID REFERENCES learning_paths(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Easy', -- Walkthrough, Easy, Medium, Hard, Insane
    room_type VARCHAR(50) NOT NULL DEFAULT 'free', -- free, vip, challenge
    points INT NOT NULL DEFAULT 100,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Room Tasks Table (Walkthrough steps)
CREATE TABLE IF NOT EXISTS room_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    task_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_markdown TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(room_id, task_number)
);

-- 4. Task Questions & Flags Table
CREATE TABLE IF NOT EXISTS task_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES room_tasks(id) ON DELETE CASCADE,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    hint TEXT,
    answer VARCHAR(255) NOT NULL, -- Exact answer or flag e.g. THM{...} (case insensitive comparison)
    points INT NOT NULL DEFAULT 15,
    is_flag BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(task_id, question_number)
);

-- 5. Active Simulated Target Machine Instances (IP + countdown timer)
CREATE TABLE IF NOT EXISTS active_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    target_ip VARCHAR(50) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- starting, active, terminated, expired
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, room_id)
);

-- 6. User Question Answers
CREATE TABLE IF NOT EXISTS user_question_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES task_questions(id) ON DELETE CASCADE,
    submitted_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    points_awarded INT NOT NULL DEFAULT 0,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 7. User Room Progress
CREATE TABLE IF NOT EXISTS user_room_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT false,
    score_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    last_interaction TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, room_id)
);

-- 8. User Streaks & Global Rank Telemetry
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak INT NOT NULL DEFAULT 1,
    max_streak INT NOT NULL DEFAULT 1,
    total_points INT NOT NULL DEFAULT 0,
    last_activity_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- ── SEED INITIAL TRYHACKME DATA ──────────────────────────────────────────────

-- 1. Insert Learning Paths
INSERT INTO learning_paths (id, title, slug, description, difficulty, estimated_hours, icon, order_idx) VALUES
('11111111-1111-1111-1111-111111111111', 'Pre Security Fundamentals', 'pre-security', 'Foundational cybersecurity concepts: networking protocols, web architecture, and linux command line skills for aspiring hackers.', 'Beginner', 15, 'Terminal', 1),
('22222222-2222-2222-2222-222222222222', 'Web Hacking & Exploitation', 'web-hacking', 'Hands-on practice finding OWASP Top 10 vulnerabilities, exploiting SQL injections, XSS attacks, and bypassing authentication mechanisms.', 'Intermediate', 25, 'Globe', 2),
('33333333-3333-3333-3333-333333333333', 'Cyber Defense & SOC Analyst', 'cyber-defense', 'Investigate real security incidents, dissect malicious phishing email headers, query SIEM event logs, and analyze indicators of compromise (IoCs).', 'Intermediate', 20, 'ShieldCheck', 3)
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Rooms
INSERT INTO rooms (id, path_id, title, slug, description, difficulty, room_type, points, tags, image_url) VALUES
(
    'a1111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    'Web Fundamentals & SQL Injection',
    'web-fundamentals',
    'Learn how modern web applications communicate and exploit input validation flaws using authentication bypass techniques.',
    'Easy',
    'free',
    100,
    ARRAY['web', 'sql-injection', 'owasp', 'authentication'],
    '/assets/rooms/web-fundamentals.png'
),
(
    'b2222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'Phishing & Email Header Analysis',
    'phishing-analysis',
    'Dissect deceptive phishing campaigns. Analyze SPF, DKIM, and DMARC headers, and extract weaponized macro attachments.',
    'Easy',
    'free',
    150,
    ARRAY['email', 'phishing', 'forensics', 'soc'],
    '/assets/rooms/phishing.png'
),
(
    'c3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'SOC Analyst Incident Response',
    'soc-incident-response',
    'A high-profile enterprise database has triggered security alerts. Triage firewall events, locate the attacker IP, and contain the breach.',
    'Medium',
    'free',
    200,
    ARRAY['soc', 'incident-response', 'siem', 'brute-force'],
    '/assets/rooms/soc.png'
),
(
    'd4444444-4444-4444-4444-444444444444',
    '11111111-1111-1111-1111-111111111111',
    'Network Security & Nmap Recon',
    'network-nmap',
    'Master network reconnaissance with Nmap. Scan target ports, detect service banners, and enumerate operating system fingerprints.',
    'Walkthrough',
    'free',
    120,
    ARRAY['nmap', 'networking', 'ports', 'recon'],
    '/assets/rooms/nmap.png'
)
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert Tasks & Questions for Room 1: Web Fundamentals
INSERT INTO room_tasks (id, room_id, task_number, title, content_markdown) VALUES
(
    'aa111111-1111-1111-1111-111111111111',
    'a1111111-1111-1111-1111-111111111111',
    1,
    'Introduction to Web Requests & HTTP Verbs',
    'Every time your browser visits a website, it sends an HTTP request specifying a method (GET, POST, PUT, DELETE) and headers.

### HTTP Response Codes
- `200 OK`: Request succeeded.
- `401 Unauthorized`: Authentication required.
- `403 Forbidden`: Access denied.
- `500 Internal Server Error`: Server failure.'
),
(
    'aa222222-2222-2222-2222-222222222222',
    'a1111111-1111-1111-1111-111111111111',
    2,
    'Deploy Your Target & SQL Injection Exploration',
    'Click the **Start Machine** button at the top of the room to boot your isolated vulnerable web target. Once deployed, note down the target IP.

SQL Injection (SQLi) occurs when untrusted user input is directly concatenated into a dynamic SQL query string without parameterized queries or sanitization:

```sql
SELECT * FROM users WHERE username = '' OR 1=1 --'' AND password = ''
```

Entering `admin'' OR 1=1 --` tricks the database query into evaluating true for all rows, returning the primary administrator account.'
)
ON CONFLICT (room_id, task_number) DO NOTHING;

INSERT INTO task_questions (id, task_id, question_number, question_text, hint, answer, points, is_flag) VALUES
(
    'f1111111-1111-1111-1111-111111111111',
    'aa111111-1111-1111-1111-111111111111',
    1,
    'Which HTTP status code signifies that a client request successfully retrieved content?',
    'Three digit status code starting with 2',
    '200',
    20,
    false
),
(
    'f2222222-2222-2222-2222-222222222222',
    'aa222222-2222-2222-2222-222222222222',
    1,
    'Exploit the login portal on your Target IP using SQL injection authentication bypass. What is the admin flag?',
    'Try injecting admin'' OR 1=1 -- into the username field',
    'THM{sql_injection_master}',
    80,
    true
)
ON CONFLICT (task_id, question_number) DO NOTHING;

-- 4. Insert Tasks & Questions for Room 2: Phishing & Email Analysis
INSERT INTO room_tasks (id, room_id, task_number, title, content_markdown) VALUES
(
    'bb111111-1111-1111-1111-111111111111',
    'b2222222-2222-2222-2222-222222222222',
    1,
    'Email Header Forensic Architecture',
    'When analyzing fraudulent communications or spoofed identity messages, looking at the visual sender name is insufficient. The raw email headers provide an immutable transit audit trail.

### Key Authentication Headers
- `Received:` Lists every Mail Transfer Agent (MTA) server the message traversed, starting from the original sender IP.
- `Authentication-Results:` Reports whether SPF (Sender Policy Framework) and DKIM (DomainKeys Identified Mail) verified successfully.
- `Return-Path:` The true bounce address where non-delivery receipts are routed.'
),
(
    'bb222222-2222-2222-2222-222222222222',
    'b2222222-2222-2222-2222-222222222222',
    2,
    'Extracting the Threat Flag from Suspicious Headers',
    'Inspect the malicious email sample on your target machine at `/home/ubuntu/samples/phish_sample_01.eml`.
Search for anomaly flags in the custom MIME payload.'
)
ON CONFLICT (room_id, task_number) DO NOTHING;

INSERT INTO task_questions (id, task_id, question_number, question_text, hint, answer, points, is_flag) VALUES
(
    'f3333333-3333-3333-3333-333333333333',
    'bb111111-1111-1111-1111-111111111111',
    1,
    'Which email header records the chronological sequence of mail servers and the originating sender IP?',
    'Begins with "Rec..."',
    'Received',
    30,
    false
),
(
    'f4444444-4444-4444-4444-444444444444',
    'bb222222-2222-2222-2222-222222222222',
    1,
    'What is the forensic flag embedded inside the malicious email attachment?',
    'Check the attachment base64 decode or metadata',
    'THM{ph1sh1ng_h3ad3r_d3t3ct3d}',
    120,
    true
)
ON CONFLICT (task_id, question_number) DO NOTHING;
