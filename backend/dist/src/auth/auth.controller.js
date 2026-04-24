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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
let AuthController = class AuthController {
    auth;
    config;
    constructor(auth, config) {
        this.auth = auth;
        this.config = config;
    }
    async login(dto, res) {
        const user = await this.auth.validateUser(dto.email, dto.password);
        const token = await this.auth.signToken({ id: user.id, role: user.role });
        const cookieName = this.config.get('COOKIE_NAME') ?? 'eas_token';
        const secure = (this.config.get('COOKIE_SECURE') ?? 'false') === 'true';
        const sameSiteRaw = (this.config.get('COOKIE_SAME_SITE') ?? 'lax').toLowerCase();
        const sameSite = sameSiteRaw === 'strict' || sameSiteRaw === 'none' ? sameSiteRaw : 'lax';
        const cookieSecure = sameSite === 'none' ? true : secure;
        res.cookie(cookieName, token, {
            httpOnly: true,
            secure: cookieSecure,
            sameSite,
            path: '/',
            maxAge: 8 * 60 * 60 * 1000,
        });
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        };
    }
    logout(res) {
        const cookieName = this.config.get('COOKIE_NAME') ?? 'eas_token';
        const secure = (this.config.get('COOKIE_SECURE') ?? 'false') === 'true';
        const sameSiteRaw = (this.config.get('COOKIE_SAME_SITE') ?? 'lax').toLowerCase();
        const sameSite = sameSiteRaw === 'strict' || sameSiteRaw === 'none' ? sameSiteRaw : 'lax';
        const cookieSecure = sameSite === 'none' ? true : secure;
        res.clearCookie(cookieName, { path: '/', secure: cookieSecure, sameSite });
        return { ok: true };
    }
    me(req) {
        return { user: req.user };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map