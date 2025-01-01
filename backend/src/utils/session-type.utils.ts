import { Request } from 'express';

export type SessionType = 'web' | 'mobile' | 'api';

export class SessionTypeDetector {
    static detectSessionType(req: Request): SessionType {
        // Checking if its an API request
        const isApiRequest = (
            req.headers['accept']?.includes('application/json') &&
            !req.headers['sec-fetch-dest']?.includes('document') &&
            !req.headers['sec-fetch-mode']?.includes('navigate')
        ) || (
            req.headers['x-requested-with'] === 'XMLHttpRequest' ||
            req.headers['content-type']?.includes('application/json')
        );

        if (isApiRequest) {
            return 'api';
        }

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
                userAgentRequest.isMobileNative ||
                userAgentRequest.isMobileNative;
            
                if (isMobileDevice) {
                    return 'mobile';
                }

        }

        // Default to web
        return 'web';
    }
}

export const getSessionTypeInfo = (req: Request): any => {
    return {
        detectedType: SessionTypeDetector.detectSessionType(req),
        headers: {
            accept: req.headers['accept'],
            contentType: req.headers['content-type'],
            secFetchDest: req.headers['sec-fetch-dest'],
            secFetchMode: req.headers['sec-fetch-mode'],
            xRequestedWith: req.headers['x-requested-with']
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
