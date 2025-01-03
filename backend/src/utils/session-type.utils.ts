// src/utils/session-type.utils.ts

import { Request } from 'express';
import { SessionType, SessionTypeInfo } from '../types/session.types.js';

export class SessionTypeDetector {
    static detectSessionType(req: Request): SessionType {
        console.log('Detecting session type with headers:', {
            userAgent: req.headers['user-agent'],
            accept: req.headers['accept'],
            contentType: req.headers['content-type']
        });

        // Check if its a mobile request
        const userAgentRequest = req.useragent;

        if (userAgentRequest) {
            const isMobileDevice =
                userAgentRequest.isMobile ||
                userAgentRequest.isAndroid ||
                userAgentRequest.isiPhone ||
                userAgentRequest.isWindowsPhone ||
                userAgentRequest.isBlackberry ||
                userAgentRequest.isAndroidTablet ||
                userAgentRequest.isiPad ||
                userAgentRequest.isMobileNative;
            
            if (isMobileDevice) {
                console.log('Mobile device detected via useragent');
                return 'mobile';
            }
        }

        // Fallback mobile check using user-agent string
        const userAgent = req.headers['user-agent'] || '';
        if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
            console.log('Mobile device detected via user-agent string');
            return 'mobile';
        }

        // API request detection
        const isApiRequest = (
            req.headers['x-requested-with'] === 'XMLHttpRequest' ||
            req.headers['postman-token'] !== undefined ||
            req.headers['x-api-key'] !== undefined ||
            (req.headers['accept'] === 'application/json' &&
             !req.headers['accept']?.includes('text/html')) ||
            req.headers['authorization']?.startsWith('Bearer ') ||
            req.headers['x-api-version'] !== undefined
        );

        if (isApiRequest) {
            console.log('API request detected');
            return 'api';
        }

        console.log('Defaulting to web session');
        return 'web';
    }
}

export const getSessionTypeInfo = (req: Request): SessionTypeInfo => {
    return {
        detectedType: SessionTypeDetector.detectSessionType(req),
        headers: {
            accept: getHeaderValue(req.headers['accept']),
            contentType: getHeaderValue(req.headers['content-type']),
            secFetchDest: getHeaderValue(req.headers['sec-fetch-dest']),
            secFetchMode: getHeaderValue(req.headers['sec-fetch-mode']),
            xRequestedWith: getHeaderValue(req.headers['x-requested-with'])
        },
        userAgent: {
            isMobile: req.useragent?.isMobile,
            isTablet: req.useragent?.isTablet,
            isDesktop: req.useragent?.isDesktop,
            browser: req.useragent?.browser,
            platform: req.useragent?.platform,
            os: req.useragent?.os,
            source: req.useragent?.source
        }
    }
}

function getHeaderValue(header: string | string[] | undefined): string | undefined {
    if (Array.isArray(header)) {
        return header[0];
    }
    return header;
}
