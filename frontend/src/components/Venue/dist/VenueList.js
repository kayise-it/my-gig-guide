"use strict";
exports.__esModule = true;
// file location: frontend/src/components/Venue/VenueList.jsx
var react_1 = require("react");
var VenueList = function (_a) {
    var venues = _a.venues, onDelete = _a.onDelete;
    return (react_1["default"].createElement("ul", { className: "divide-y divide-gray-200 bg-white shadow rounded" }, venues.map(function (venue) { return (react_1["default"].createElement("li", { key: venue.id, className: "p-4 hover:bg-gray-50 transition" },
        react_1["default"].createElement("div", { className: "font-semibold text-sm" }, venue.name),
        react_1["default"].createElement("div", { className: "text-gray-600 text-xs" }, venue.address),
        react_1["default"].createElement("button", { onClick: function (e) {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this venue?')) {
                    onDelete(venue.id);
                }
            }, className: "text-red-600 hover:text-red-900 text-xs font-medium" }, "Delete"))); })));
};
exports["default"] = VenueList;
