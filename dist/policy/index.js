"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIFO = exports.policyFactory = void 0;
const fifo_1 = __importDefault(require("./fifo"));
exports.FIFO = fifo_1.default;
const policy_1 = __importDefault(require("./policy"));
exports.policyFactory = policy_1.default;
