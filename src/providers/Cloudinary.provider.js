import cloudinary from 'cloudinary'
import streamifier from 'streamifier'
import { env } from '~/config/environment'

const cloudinaryv2 = cloudinary.v2
cloudinaryv2.config({
  cloud_name: env.CLOUNDINARY_NAME,
  api_key: env.CLOUNDINARY_API_KEY,
  api_secret: env.CLOUNDINARY_API_SECRET
})

/* Khởi tạo một cái function để thực hiện upload file lên Cloudinary */
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    /* Tạo một luồng stream upload lên cloudinary */
    let stream = cloudinaryv2.uploader.upload_stream({ folder: folderName }, (error, result) => {
      if (result) resolve(result)
      else reject(error)
    })
    /* Thực hiện upload cái luồng trên bằng lib streamifier */
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

export const CloundinaryProvider = { streamUpload }
