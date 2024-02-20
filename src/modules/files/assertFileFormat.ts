import { BadRequestException } from '@nestjs/common';
import config from '../../config';
import { WRONG_FILE } from '../../shared/errors/errorMessages';
import { FileType } from '../../shared/types/fileType';

export const assertFileFormat = (
  req: any,
  file: FileType,
  callback: (error: Error, aceptFile: boolean) => void,
): void => {
  if (!file.originalname.match(config.regExpImageType)) {
    const error = new BadRequestException(WRONG_FILE);
    return callback(error, false);
  }
  return callback(null, true);
};
