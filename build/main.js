"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
class Main {
    constructor() {
        this.cache = Cache.get();
        this.homeIp = '';
        this.getHomeIp().then(_ => this.homeIp = _);
        setInterval(() => {
            this.cache = Cache.get();
            this.getHomeIp().then(_ => this.homeIp = _);
            if (this.homeIp != this.cache) {
                this.getToken().forEach(tokenData => {
                    fetch(`https://${tokenData.user}:${tokenData.pass}@domains.google.com/nic/update?hostname=${tokenData.domain}&myip=${this.getHomeIp}`);
                });
            }
        }, 60 * 1000);
    }
    getHomeIp() {
        return __awaiter(this, void 0, void 0, function* () {
            let ip = '';
            ip = yield (yield fetch('https://api.ipify.org')).text();
            return ip;
        });
    }
    getToken() {
        let data = fs.readFileSync('./data/token.json', { encoding: 'utf8', flag: 'w+' });
        if (data != '') {
            return JSON.parse(data);
        }
        else {
            return [];
        }
    }
}
class Cache {
    static get() {
        let data = fs.readFileSync('./data/cache.json', { encoding: 'utf8', flag: 'w+' });
        if (data != '') {
            return JSON.parse(data);
        }
        else {
            return '';
        }
    }
    static write(data) {
        fs.writeFileSync('./data/cache.json', JSON.stringify(data), { encoding: 'utf8', flag: 'w+' });
    }
}
const main = () => new Main();
main();