// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { Injectable } from "@nestjs/common";
import { uploadFileToS3 } from "../utils/fileUpload";

@Injectable()
export class UploadService {
    async uploadFile(file: Buffer, mimeType: string, fileName: string, folderName: string, rootFolderName: string) {
        const url = await uploadFileToS3(
            file,
            mimeType,
            fileName,
            folderName,
            rootFolderName
        );

        if (!url) throw new Error('Error uploading file.')

        const mediaUrl = `https://${process.env.AWS_BUCKET}.s3.us-east-1.amazonaws.com/${rootFolderName}/${folderName}/${url.fileNameHash}`;

        return {
            mediaURL: mediaUrl,
            fileName: fileName
        };

    }
}