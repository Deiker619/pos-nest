import { PartialType } from '@nestjs/mapped-types';
import { CreateLogPoDto } from './create-log-po.dto';

export class UpdateLogPoDto extends PartialType(CreateLogPoDto) {}
