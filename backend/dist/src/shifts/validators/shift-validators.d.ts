import { ValidationOptions } from 'class-validator';
export declare function IsTimeFormat(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
export declare function IsEndTimeAfterStart(...propertyNames: string[]): (object: Object, propertyName: string) => void;
export declare function IsValidWorkingDays(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
