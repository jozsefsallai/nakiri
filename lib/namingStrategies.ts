import { DefaultNamingStrategy } from 'typeorm';
import camelCase from 'camelcase';

export class CamelCaseNamingStrategy extends DefaultNamingStrategy {
  tableName(className: string, customName?: string): string {
    return customName || camelCase(`${className}s`);
  }
}
