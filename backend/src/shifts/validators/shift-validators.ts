import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
          return timeRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid time in HH:mm format (24-hour)`;
        },
      },
    });
  };
}

export function IsEndTimeAfterStart(...propertyNames: string[]) {
  return function (object: Object, propertyName: string) {
    const startProp = propertyNames[0] || 'startTime';
    registerDecorator({
      name: 'isEndTimeAfterStart',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== 'string') return true;
          const obj = args.object as any;
          const startTime = obj[startProp];
          if (!startTime || typeof startTime !== 'string') return true;

          const [startH, startM] = startTime.split(':').map(Number);
          const [endH, endM] = value.split(':').map(Number);

          if (
            Number.isNaN(startH) ||
            Number.isNaN(startM) ||
            Number.isNaN(endH) ||
            Number.isNaN(endM)
          ) {
            return false;
          }

          const startTotal = startH * 60 + startM;
          const endTotal = endH * 60 + endM;

          return endTotal > startTotal;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be after ${startProp}`;
        },
      },
    });
  };
}

export function IsValidWorkingDays(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidWorkingDays',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') return false;
          const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          const days = value
            .split(',')
            .map((d) => d.trim())
            .filter(Boolean);
          return days.every((day) => validDays.includes(day));
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be comma-separated valid days (Mon, Tue, Wed, Thu, Fri, Sat, Sun)`;
        },
      },
    });
  };
}
