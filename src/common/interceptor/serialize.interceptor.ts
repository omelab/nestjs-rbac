import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly excludedKeys: string[]) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          // Serialize an array of objects
          return data.map((item) => this.serializeObject(item));
        } else {
          // Serialize a single object
          return this.serializeObject(data);
        }
      }),
    );
  }

  serializeObject(data: any): any {
    const { ...rest } = data;
    this.excludedKeys.forEach((key) => {
      delete rest[key];
    });
    return {
      ...rest,
      // Add any additional metadata here
    };
  }
}
