var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
const DIM = 24;
let HashEmbedderAdapter = class HashEmbedderAdapter {
    async embed(text) {
        const v = Array.from({ length: DIM }, () => 0);
        const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
        for (const token of tokens) {
            let h = 0;
            for (let i = 0; i < token.length; i++) {
                h = (h * 31 + token.charCodeAt(i)) >>> 0;
            }
            v[h % DIM] += 1;
        }
        const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
        return v.map((x) => x / norm);
    }
};
HashEmbedderAdapter = __decorate([
    Injectable()
], HashEmbedderAdapter);
export { HashEmbedderAdapter };
//# sourceMappingURL=hash-embedder.adapter.js.map