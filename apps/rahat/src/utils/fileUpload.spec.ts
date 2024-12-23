import { AssetAvailableUploaders } from 'rs-asset-uploader/dist/types';
import { uploadFileToS3 } from './fileUpload';
import { AssetUploader } from 'rs-asset-uploader';

jest.mock('rs-asset-uploader', () => ({
    AssetUploader: {
        set: jest.fn(),
        upload: jest.fn().mockResolvedValue('url')
    }
}));

describe('uploadFileToS3', () => {
    const file = Buffer.from('Test');
    const mimeType = 'text/plain';
    const fileName = 'test.txt';
    const folderName = 'uploads';
    const rootFolderName = 'root';
    const mockUrl = 'url';
    const awsConfig = {
        accessKey: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET,
    };

    it('should call AssetUploader.set with correct config', async () => {
        const result = await uploadFileToS3(file, mimeType, fileName, folderName, rootFolderName);
        expect(AssetUploader.set).toHaveBeenCalledTimes(1);
        expect(AssetUploader.set).toHaveBeenCalledWith(AssetAvailableUploaders.S3, awsConfig);
        expect(AssetUploader.upload).toHaveBeenCalledWith({
          file, mimeType, fileName, folderName, rootFolderName
        });
        expect(result).toEqual(mockUrl);
    });
});