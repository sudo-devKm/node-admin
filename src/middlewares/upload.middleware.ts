import multer from "multer";
import multerS3 from "multer-s3";
import { UploadOptions } from "@app/types";
import { IMAGE_MIME_TYPES, MAX_IMAGE_SIZE } from "@app/constants/upload.constants";
import { HttpException } from "@app/exceptions/http.exception";
import { StatusCodes } from "http-status-codes";
import { S3Client } from "@aws-sdk/client-s3";
import { envs } from "@app/config/envs.validate";

export const s3 = new S3Client({
    region: envs.AWS_REGION,
})

export const createS3Upload = ({ folder, allowedMimeTypes = IMAGE_MIME_TYPES, maxSize = MAX_IMAGE_SIZE }: UploadOptions) => {
    return multer({
        limits: {
            fileSize: maxSize
        },
        fileFilter: (req, file, cb) => {
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return cb(new HttpException({ status: StatusCodes.BAD_REQUEST, message: `Invalid file type: ${file.mimetype}` }))
            };
            cb(null, true);
        },
        storage: multerS3({
            s3,
            bucket: envs.S3_BUCKET,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (_req, file, callback) => {
                const key = `${folder}/${Date.now()}-${file.originalname}`;
                callback(null, key)
            },
        })
    });
}