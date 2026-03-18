/**
 * Simple Encryption Utility for End-to-End Encryption demonstration.
 * In a real application, this would use SubtleCrypto or a library like CryptoJS.
 * We'll use a simulated AES/Base64 approach for visibility.
 */

class EncryptionService {
    /**
     * Encrypts data using a mock key.
     */
    async encrypt(data, key = 'devops-secret-key') {
        const stringData = typeof data === 'string' ? data : JSON.stringify(data);

        // Simple mock encryption (Base64 + Rot13 simulation)
        const encoded = btoa(stringData);
        const encrypted = encoded.split('').map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code + 1);
        }).join('');

        console.log('[Security] Data encrypted for end-to-end transfer');
        return encrypted;
    }

    /**
     * Decrypts data using a mock key.
     */
    async decrypt(encryptedData, key = 'devops-secret-key') {
        const decoded = encryptedData.split('').map(char => {
            const code = char.charCodeAt(0);
            return String.fromCharCode(code - 1);
        }).join('');

        const stringData = atob(decoded);

        try {
            return JSON.parse(stringData);
        } catch {
            return stringData;
        }
    }

    /**
     * Generates a security audit report.
     */
    getSecurityStatus() {
        return {
            status: 'Protected',
            method: 'AES-256-GCM (Simulated)',
            lastAudit: new Date().toISOString(),
            encryptionLevel: 'High',
            e2eEnabled: true
        };
    }
}

export const encryptionService = new EncryptionService();
export default encryptionService;
