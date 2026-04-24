"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsTimeFormat = IsTimeFormat;
exports.IsEndTimeAfterStart = IsEndTimeAfterStart;
exports.IsValidWorkingDays = IsValidWorkingDays;
const class_validator_1 = require("class-validator");
function IsTimeFormat(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isTimeFormat',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
                    return timeRegex.test(value);
                },
                defaultMessage(args) {
                    return `${args.property} must be a valid time in HH:mm format (24-hour)`;
                },
            },
        });
    };
}
function IsEndTimeAfterStart(...propertyNames) {
    return function (object, propertyName) {
        const startProp = propertyNames[0] || 'startTime';
        (0, class_validator_1.registerDecorator)({
            name: 'isEndTimeAfterStart',
            target: object.constructor,
            propertyName: propertyName,
            validator: {
                validate(value, args) {
                    if (typeof value !== 'string')
                        return true;
                    const obj = args.object;
                    const startTime = obj[startProp];
                    if (!startTime || typeof startTime !== 'string')
                        return true;
                    const [startH, startM] = startTime.split(':').map(Number);
                    const [endH, endM] = value.split(':').map(Number);
                    if (Number.isNaN(startH) ||
                        Number.isNaN(startM) ||
                        Number.isNaN(endH) ||
                        Number.isNaN(endM)) {
                        return false;
                    }
                    const startTotal = startH * 60 + startM;
                    const endTotal = endH * 60 + endM;
                    return endTotal > startTotal;
                },
                defaultMessage(args) {
                    return `${args.property} must be after ${startProp}`;
                },
            },
        });
    };
}
function IsValidWorkingDays(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            name: 'isValidWorkingDays',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value) {
                    if (typeof value !== 'string')
                        return false;
                    const validDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    const days = value
                        .split(',')
                        .map((d) => d.trim())
                        .filter(Boolean);
                    return days.every((day) => validDays.includes(day));
                },
                defaultMessage(args) {
                    return `${args.property} must be comma-separated valid days (Mon, Tue, Wed, Thu, Fri, Sat, Sun)`;
                },
            },
        });
    };
}
//# sourceMappingURL=shift-validators.js.map