// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { AssetUploader } from 'rs-asset-uploader';
import {
  AssetAvailableUploaders,
  UploadAssetParams
} from 'rs-asset-uploader/dist/types';

const awsConfig = {
  accessKey: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
};

export const uploadFileToS3 = async (
  file: Buffer,
  mimeType: string,
  fileName: string,
  folderName: string,
  rootFolderName: string
) => {

  AssetUploader.set(AssetAvailableUploaders.S3, awsConfig);

  const uploadData: UploadAssetParams = {
    file,
    mimeType,
    folderName,
    fileName,
    rootFolderName,
  };

  const url = await AssetUploader.upload(uploadData);
  return url;
};
