import { Router } from 'express';
import { fileUploader } from '../controllers/uploader';
import uploader from '../configs/multer';

const router = Router();

router.post('/file', uploader.single('file'), fileUploader);

export default router;
