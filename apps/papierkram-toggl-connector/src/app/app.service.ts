import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  do() {
    console.log('AppService service instantiated')
  }
}
