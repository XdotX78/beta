import { UAParser } from 'ua-parser-js';
import { createHash } from 'crypto';

export interface DeviceInfo {
    browser: string;
    browserVersion: string;
    os: string;
    osVersion: string;
    device: string;
    screenResolution?: string;
    timezone?: string;
    language?: string;
}

export function generateDeviceFingerprint(userAgent: string, additionalData: Partial<DeviceInfo> = {}): string {
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const deviceInfo: DeviceInfo = {
        browser: browser.name || 'unknown',
        browserVersion: browser.version || 'unknown',
        os: os.name || 'unknown',
        osVersion: os.version || 'unknown',
        device: device.model || device.type || 'unknown',
        ...additionalData
    };

    // Create a hash of the device information
    const fingerprintData = JSON.stringify(deviceInfo);
    return createHash('sha256').update(fingerprintData).digest('hex');
}

export function isKnownDevice(userId: string, deviceFingerprint: string): Promise<boolean> {
    // TODO: Implement device verification against stored user devices
    return Promise.resolve(false);
}

export async function trackDeviceLogin(
    userId: string,
    deviceFingerprint: string,
    deviceInfo: DeviceInfo,
    ip: string
): Promise<void> {
    // TODO: Store device login information in the database
    // This would typically include:
    // - Device fingerprint
    // - Device info
    // - IP address
    // - Timestamp
    // - User ID
    // - Login success/failure
}

export function getDeviceRiskScore(
    userId: string,
    deviceFingerprint: string,
    ip: string,
    deviceInfo: DeviceInfo
): Promise<number> {
    // TODO: Calculate risk score based on:
    // - Is this a known device for the user?
    // - How often has this device been used?
    // - Is this IP associated with known malicious activity?
    // - Is this an unusual login time/location for the user?
    // - Has this device been associated with suspicious activity?
    return Promise.resolve(0);
} 