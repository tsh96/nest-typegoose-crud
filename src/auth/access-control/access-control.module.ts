import { Module } from '@nestjs/common';
import { AccessControl } from './access-control.schema';
import { AccessControlService } from './access-control.service';
import { AccessControlController } from './access-control.controller';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([AccessControl]),
  ],
  providers: [AccessControlService],
  exports: [AccessControlService],
  controllers: [AccessControlController]
})
export class AccessControlModule { }
