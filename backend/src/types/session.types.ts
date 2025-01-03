// src/types/session.types.ts

export type SessionType = 'web' | 'mobile' | 'api';

export interface Session {
    session_id: string;
    user_id: string;
    session_token: string;
    session_expiry: Date;
    session_type: 'web' | 'mobile' | 'api';
    session_creation_time: Date;
    session_last_accessed: Date;
}

export interface SessionTypeInfo {
    detectedType: SessionType;
    headers: {
        accept: string | undefined;
        contentType: string | undefined;
        secFetchDest: string | undefined;
        secFetchMode: string | undefined;
        xRequestedWith: string | undefined;
    };
    userAgent: {
        isMobile?: boolean;
        isTablet?: boolean;
        isDesktop?: boolean;
        browser?: string;
        platform?: string;
        os?: string;
        source?: string;
    };
}