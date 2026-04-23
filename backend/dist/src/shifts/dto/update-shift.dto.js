"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShiftDto = void 0;
const class_validator_1 = require("class-validator");
const shift_validators_1 = require("../validators/shift-validators");
class UpdateShiftDto {
    name;
    startTime;
    endTime;
    workingDays;
    graceMinutes;
    description;
}
exports.UpdateShiftDto = UpdateShiftDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, shift_validators_1.IsTimeFormat)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, shift_validators_1.IsTimeFormat)(),
    (0, shift_validators_1.IsEndTimeAfterStart)('startTime'),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, shift_validators_1.IsValidWorkingDays)(),
    __metadata("design:type", String)
], UpdateShiftDto.prototype, "workingDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateShiftDto.prototype, "graceMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], UpdateShiftDto.prototype, "description", void 0);
//# sourceMappingURL=update-shift.dto.js.map