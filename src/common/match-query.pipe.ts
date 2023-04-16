import { Injectable, PipeTransform } from '@nestjs/common';
import * as _ from 'underscore';

@Injectable()
export class MatchQueryPipe implements PipeTransform {
  constructor(private keys: string[]) {}
  transform(value: any) {
    this.keys.forEach((key) => {
      if (value[key]) {
        value.options[key] = new RegExp(
          value[key].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'gi',
        );
      }
    });
    return value;
  }
}
