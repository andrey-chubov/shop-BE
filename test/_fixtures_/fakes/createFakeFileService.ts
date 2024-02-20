import { FilesService } from '../../../src/modules/files/file.service';

export const createFakeFileService = (): Record<
  keyof FilesService,
  jest.Mock
> => ({
  createImage: jest.fn().mockReturnValue(mockFile.filename),
  createImages: jest.fn().mockReturnValue([mockFile.filename]),
  deleteImage: jest.fn().mockReturnValue(''),
  deleteImages: jest.fn().mockReturnValue([]),
});

const mockFile = {
  fieldname: 'file',
  originalname: 'TradeHistory.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  buffer: Buffer.from(__dirname + '/../../TradeHistory.csv', 'utf8'),
  size: 51828,
} as Express.Multer.File;
