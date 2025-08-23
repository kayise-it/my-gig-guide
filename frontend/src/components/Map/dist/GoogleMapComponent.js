"use strict";
// file: frontend/src/components/Map/GoogleMapComponent.tsx
exports.__esModule = true;
var react_1 = require("react");
var api_1 = require("@react-google-maps/api");
var containerStyle = {
    width: '100%',
    height: '100%'
};
var GoogleMapComponent = function (_a) {
    var gigs = _a.gigs, apiKey = _a.apiKey;
    var _b = react_1.useState({ lat: -25.4658, lng: 30.9853 }), center = _b[0], setCenter = _b[1]; // Default to Mbombela
    var _c = react_1.useState(null), marker = _c[0], setMarker = _c[1];
    // Load and geocode the address when the map is ready
    var onLoad = function () {
        var _a, _b;
        if (!window.google || !window.google.maps) {
            console.error('Google Maps is not loaded');
            return;
        }
        var geocoder = new window.google.maps.Geocoder();
        var address = (_b = (_a = gigs[0]) === null || _a === void 0 ? void 0 : _a.venue) === null || _b === void 0 ? void 0 : _b.address;
        if (address) {
            geocoder.geocode({ address: address }, function (results, status) {
                if (status === 'OK' && results[0]) {
                    var location = results[0].geometry.location;
                    var latLng = {
                        lat: location.lat(),
                        lng: location.lng()
                    };
                    setCenter(latLng);
                    setMarker(latLng);
                }
                else {
                    console.error('Geocoding failed:', status);
                }
            });
        }
    };
    return (react_1["default"].createElement(api_1.LoadScript, { googleMapsApiKey: apiKey, libraries: ['places'] },
        react_1["default"].createElement(api_1.GoogleMap, { mapContainerStyle: containerStyle, center: center, zoom: 14, onLoad: onLoad }, marker && react_1["default"].createElement(api_1.Marker, { position: marker }))));
};
exports["default"] = GoogleMapComponent;
