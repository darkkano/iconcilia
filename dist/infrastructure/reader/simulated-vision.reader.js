var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SimulatedVisionReader_1;
import { Injectable, Logger } from '@nestjs/common';
let SimulatedVisionReader = SimulatedVisionReader_1 = class SimulatedVisionReader {
    logger = new Logger(SimulatedVisionReader_1.name);
    async read(input) {
        const text = input.rawText.replace(/\r\n/g, '\n').trim();
        const pages = input.kind === 'pdf' ? Math.max(1, Math.ceil(text.length / 900)) : 1;
        const note = input.kind === 'pdf'
            ? 'OCR/visión simulada sobre PDF'
            : 'Parser de Excel/CSV simulado';
        this.logger.log(`${note} file=${input.filename} pages=${pages}`);
        return { text, pages, note };
    }
};
SimulatedVisionReader = SimulatedVisionReader_1 = __decorate([
    Injectable()
], SimulatedVisionReader);
export { SimulatedVisionReader };
//# sourceMappingURL=simulated-vision.reader.js.map