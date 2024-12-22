// src/types/session.types.ts

export interface Session {
    session_id: string;
    user_id: string;
    session_token: string;
    session_expiry: Date;
    session_type: 'web' | 'mobile' | 'api';
    session_refresh_token: string | null;
    session_creation_time: Date;
    session_last_accessed: Date;
}