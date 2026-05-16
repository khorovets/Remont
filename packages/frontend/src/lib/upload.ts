import multer from 'multer';
import path from 'path';
import { Readable } from 'stream';
import type { NextRequest } from 'next/server';
import { UPLOAD } from '@remont/shared';

// =============================================================================
// Конфигурация diskStorage
// =============================================================================

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public', 'uploads', 'portfolio'),
  filename: (_req, file, cb) => {
    const contractorId = _req.body?.contractor_id ?? 'unknown';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${contractorId}_${timestamp}${ext}`);
  },
});

// =============================================================================
// Фильтр файлов: только изображения
// =============================================================================

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if ((UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Недопустимый тип файла: ${file.mimetype}. Разрешены: ${UPLOAD.ALLOWED_TYPES.join(', ')}`));
  }
};

// =============================================================================
// Multer instance
// =============================================================================

export const upload = multer({
  storage,
  limits: {
    fileSize: UPLOAD.MAX_SIZE,
    files: 1,
  },
  fileFilter,
});

// =============================================================================
// parseUpload — адаптер multer для Next.js App Router (NextRequest)
// =============================================================================

/**
 * Разбирает multipart/form-data из NextRequest через multer.
 * Возвращает поля формы и массив загруженных файлов.
 *
 * @example
 * ```ts
 * export async function POST(req: NextRequest) {
 *   const { fields, files } = await parseUpload(req);
 *   const photo = files[0]; // Express.Multer.File
 * }
 * ```
 */
export async function parseUpload(
  req: NextRequest,
): Promise<{
  fields: Record<string, string>;
  files: Express.Multer.File[];
}> {
  const contentType = req.headers.get('content-type') ?? '';

  const bytes = await req.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const stream = Readable.from(buffer);

  // Mock Node.js IncomingMessage, совместимый с multer
  const mockReq: Record<string, unknown> = Object.create(stream);
  mockReq.headers = {
    'content-type': contentType,
    'content-length': buffer.length,
  };

  return new Promise((resolve, reject) => {
    upload.any()(mockReq as any, {} as any, (err: any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        fields: (mockReq as any).body ?? {},
        files: (mockReq as any).files ?? [],
      });
    });
  });
}
