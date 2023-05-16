"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, tagof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new tagError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var csv = require("fast-csv");
function scrapeWebsite(url) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var response, html, $, links, text;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, axios_1.default.get(url)];
                case 1:
                    response = _b.sent();
                    html = response.data;
                    $ = cheerio.load(html);
                    links = [];
                    $("a").each(function (index, element) {
                        var link = $(element).attr("href");
                        if (link) {
                            links.push(link);
                        }
                    });
                    text = ((_a = $("body").html()) === null || _a === void 0 ? void 0 : _a.toString().replace(/(<([^>]+)>)/gi, "")) || "";
                    return [2 /*return*/, { links: links, text: text }];
            }
        });
    });
}
function storeScrapedDataAsJSON(data, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    content = JSON.stringify(data);
                    return [4 /*yield*/, fs.promises.writeFile(filename, content)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function storeScrapedDataAsCSV(data, filename) {
    return __awaiter(this, void 0, void 0, function () {
        var writeStream;
        return __generator(this, function (_a) {
            writeStream = fs.createWriteStream(filename);
            csv.writeToStream(writeStream, [data], { headers: true }).on("finish", function () {
                console.log("Scraped data saved to ".concat(filename));
            });
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, jsonFilename, csvFilename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = process.argv[2];
                    if (!url) {
                        console.error("Please provide a URL as an argument");
                        process.exit(1);
                    }
                    return [4 /*yield*/, scrapeWebsite(url)];
                case 1:
                    data = _a.sent();
                    jsonFilename = "scraped-data.json";
                    return [4 /*yield*/, storeScrapedDataAsJSON(data, jsonFilename)];
                case 2:
                    _a.sent();
                    csvFilename = "scraped-data.csv";
                    return [4 /*yield*/, storeScrapedDataAsCSV(data, csvFilename)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
