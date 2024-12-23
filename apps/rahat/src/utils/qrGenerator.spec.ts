import QRCode from 'qrcode';
import { generateQRCode } from './qrGenerator';

jest.mock('QRCode', () => ({
    toBuffer: jest.fn()
}));

describe('generateQRCode', () => {
    it('should return a buffer when input is a string', async () => {
        const input = 'Jest Test';
        const mockBuffer = Buffer.from('mock-buffer');
        QRCode.toBuffer.mockResolvedValue(mockBuffer);
        const result = await generateQRCode(input);
        expect(result).toBe(mockBuffer);
        expect(QRCode.toBuffer).toHaveBeenCalledWith(input.toString());
    });

    it('should throw an error when input is not a string', async () => {
        const input = 12345;
        await expect(generateQRCode(input)).rejects.toThrow('abc');
        expect(QRCode.toBuffer).not.toHaveBeenCalled(); 
    });
});