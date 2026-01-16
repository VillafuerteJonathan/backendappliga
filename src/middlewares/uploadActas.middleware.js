import multer from 'multer';
import fs from 'fs';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.params;

    const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'actas',
      id
    );

    // Crear carpeta si no existe
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const tipo = file.fieldname; // 'frente' | 'dorso'
    cb(null, `${tipo}.jpg`);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    cb(new Error('Solo se permiten imágenes'), false);
  }
  cb(null, true);
};

export const uploadActas = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
export default uploadActas;