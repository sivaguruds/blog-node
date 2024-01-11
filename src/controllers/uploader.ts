import { Request, Response } from 'express';
import cloudinary from '../configs/cloundinary';

export const fileUploader = async (req: any, res: Response) => {
  const file = req.file;
  console.log(file);
  try {
    if (!file) {
      return res.status(400).json({ error: 'No File Selected' });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
    });
    console.log(result);
    return res.status(200).send({
      public_id: result.public_id,
      url: result.secure_url,
    });
  } catch (error: any) {
    return res.status(500).send(error.message);
  }
};
