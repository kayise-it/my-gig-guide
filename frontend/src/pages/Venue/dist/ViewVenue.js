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
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.__esModule = true;
// frontend/src/pages/Venue/ViewVenue.tsx
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var venueService_1 = require("../../api/venueService");
var DashboardBreadCrumb_1 = require("../../components/Includes/DashboardBreadCrumb");
var react_router_dom_2 = require("react-router-dom");
var GoogleMapComponent_1 = require("../../components/Map/GoogleMapComponent");
function ViewVenue() {
    var _this = this;
    var id = react_router_dom_1.useParams().id;
    var _a = react_1.useState(null), venue = _a[0], setVenue = _a[1];
    var _b = react_1.useState(null), venues = _b[0], setVenues = _b[1];
    var _c = react_1.useState(null), apiError = _c[0], setApiError = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    var breadcrumbs = [
        { label: 'Dashboard', path: '/organiser/dashboard' },
        { label: (venue === null || venue === void 0 ? void 0 : venue.name) || "Venue", path: "/organiser/dashboard/venues/edit/" + id },
    ];
    react_1.useEffect(function () {
        function fetchVenue() {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, 3, 4]);
                            return [4 /*yield*/, venueService_1.venueService.getVenueById(id)];
                        case 1:
                            response = _a.sent();
                            setVenue(response.venue);
                            return [3 /*break*/, 4];
                        case 2:
                            error_1 = _a.sent();
                            console.error("Error fetching venue:", error_1);
                            setError("Failed to load venue data");
                            return [3 /*break*/, 4];
                        case 3:
                            setLoading(false);
                            return [7 /*endfinally*/];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        var fetchVenues = function () { return __awaiter(_this, void 0, void 0, function () {
            var user, response, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        user = JSON.parse(localStorage.getItem('user') || '{}');
                        if (!(user === null || user === void 0 ? void 0 : user.id)) return [3 /*break*/, 2];
                        return [4 /*yield*/, venueService_1.venueService.getOrganisersVenues(user.id)];
                    case 1:
                        response = _a.sent();
                        setVenues(response);
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Failed to fetch venues:", error_2);
                        setApiError("Failed to fetch venues.");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        if (id) {
            fetchVenue();
            fetchVenues();
        }
    }, [id]);
    if (loading)
        return react_1["default"].createElement("div", null, "Loading...");
    if (!venue)
        return react_1["default"].createElement("div", null, "Venue not found");
    return (react_1["default"].createElement("div", { className: "" },
        react_1["default"].createElement(DashboardBreadCrumb_1["default"], { breadcrumbs: breadcrumbs }),
        react_1["default"].createElement("div", { className: "max-w-7xl mx-auto p-3 space-y-3 sm:space-y-0 sm:px-6 lg:px-8" },
            react_1["default"].createElement("div", { className: "w-full h-64 rounded-lg overflow-hidden mb-4" },
                react_1["default"].createElement(GoogleMapComponent_1["default"], { gigs: [{
                            id: venue.id,
                            name: venue.name,
                            venue: {
                                name: venue.name,
                                address: venue.address
                            }
                        }], apiKey: "AIzaSyDVfOS0l8Tv59v8WTgUO231X2FtmBQCc2Y" })),
            react_1["default"].createElement("div", { className: "grid space-y-6 md:grid-cols-6 gap-4 max-w-4xl mx-auto border p-6 rounded-lg shadow-md bg-white" },
                react_1["default"].createElement("div", { className: "md:col-span-4 grid grid-cols-1" },
                    react_1["default"].createElement("div", { className: "space-y-2" },
                        react_1["default"].createElement("h1", { className: "text-2xl font-bold mb-4" }, venue.name),
                        react_1["default"].createElement("p", { className: "text-gray-700 mb-2" },
                            react_1["default"].createElement("strong", null, "Location:"),
                            " ",
                            venue.location),
                        react_1["default"].createElement("p", { className: "text-gray-700 mb-2" },
                            react_1["default"].createElement("strong", null, "Address:"),
                            " ",
                            venue.address),
                        react_1["default"].createElement("p", { className: "text-gray-700 mb-2" },
                            react_1["default"].createElement("strong", null, "Capacity:"),
                            " ",
                            venue.capacity),
                        react_1["default"].createElement("p", { className: "text-gray-700 mb-2" },
                            react_1["default"].createElement("strong", null, "Phone:"),
                            " ",
                            venue.phone_number),
                        react_1["default"].createElement("p", { className: "text-gray-700 mb-2" },
                            react_1["default"].createElement("strong", null, "Email:"),
                            " ",
                            venue.contact_email),
                        venue.website && (react_1["default"].createElement("p", { className: "text-gray-700 mb-4" },
                            react_1["default"].createElement("strong", null, "Website:"),
                            " ",
                            react_1["default"].createElement("a", { href: venue.website, className: "text-blue-500 underline", target: "_blank", rel: "noopener noreferrer" }, venue.website))))),
                react_1["default"].createElement("div", { className: "md:col-span-2" },
                    react_1["default"].createElement("div", { className: "bg-white p-3 rounded-lg" },
                        react_1["default"].createElement("div", { className: "bg-white overflow-hidden sm:rounded-lg mb-8" },
                            react_1["default"].createElement("div", { className: "sm:px-6 border-b border-gray-200 flex justify-between items-center" },
                                react_1["default"].createElement("h2", { className: "text-lg font-semibold mb-2" }, "Other Venues")),
                            react_1["default"].createElement("div", { className: "divide-y divide-gray-200 mt-4" },
                                apiError && react_1["default"].createElement("div", { className: "text-red-500" }, apiError),
                                venues && venues.length > 0 ? (react_1["default"].createElement("ul", { className: "space-y-2" }, venues.map(function (v) { return (react_1["default"].createElement("li", { key: v.id, className: "m-0 p-0" },
                                    react_1["default"].createElement(react_router_dom_2.Link, { to: "/organiser/dashboard/venues/" + v.id, className: "text-blue-500 hover:underline" }, v.name))); }))) : (react_1["default"].createElement("p", { className: "text-gray-500" }, "No other venues available."))))))))));
}
exports["default"] = ViewVenue;
