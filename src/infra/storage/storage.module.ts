import { Module } from '@nestjs/common'
import Uploader from '@/domain/forum/application/storage/uploader'
import TebiStorage from '@/infra/storage/tebi-storage'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  providers: [
    {
      provide: Uploader,
      useClass: TebiStorage,
    },
  ],
  exports: [Uploader],
  imports: [EnvModule],
})
export class StorageModule {}
