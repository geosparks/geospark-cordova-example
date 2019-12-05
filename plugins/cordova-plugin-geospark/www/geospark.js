var exec = require('cordova/exec');
var geospark = {};

geospark.disableBatteryOptimization = function(callback) {
     exec( callback, null, 'geospark', "disableBatteryOptimization",[]);
};

geospark.isBatteryOptimizationEnabled = function(callback) {
     exec( callback, null, 'geospark', "isBatteryOptimizationEnabled",[]);
};

geospark.checkActivityPermission = function(callback) {
     exec( callback, null, 'geospark', "checkActivityPermission",[]);
};

geospark.requestActivityPermission = function(callback) {
     exec( callback, null, 'geospark', "requestActivityPermission",[]);
};

geospark.checkLocationPermission = function(callback) {
     exec( callback, null, 'geospark', "checkLocationPermission",[]);
};

geospark.requestLocationPermission = function(callback) {
     exec( callback, null, 'geospark', "requestLocationPermission",[]);
};

geospark.checkLocationServices = function(callback) {
     exec( callback, null, 'geospark', "checkLocationServices",[]);
};

geospark.requestLocationServices = function(callback) {
     exec( callback, null, 'geospark', "requestLocationServices",[]);
};

geospark.checkBackgroundLocationPermission = function(callback) {
     exec( callback, null, 'geospark', "checkBackgroundLocationPermission",[]);
};

geospark.requestBackgroundLocationPermission = function(callback) {
     exec( callback, null, 'geospark', "requestBackgroundLocationPermission",[]);
};

geospark.getDeviceToken = function(callback) {
     exec( callback, null, 'geospark', "getDeviceToken",[]);
};

geospark.createUser = function(description, success, error) {
     exec( success, error, 'geospark', "createUser",[description]);
};

geospark.setDescription = function(description, success, error) {
     exec( success, error, 'geospark', "setDescription",[description]);
};

geospark.getUser = function(userId, success, error) {
     exec( success, error, 'geospark', "getUser",[userId]);
};

geospark.toggleEvents = function(geofenceEvents,tripEvents, activityEvents, success, error) {
     exec( success, error, 'geospark', "toggleEvents",[geofenceEvents, tripEvents, activityEvents]);
};

geospark.getEventsStatus = function(success, error) {
     exec( success, error, 'geospark', "getEventsStatus",[]);
};

geospark.startTrip = function(tripId,tripDescription, success, error) {
     exec( success, error, 'geospark', "startTrip",[tripId, tripDescription]);
};

geospark.resumeTrip = function(tripId, success, error) {
     exec( success, error, 'geospark', "resumeTrip",[tripId]);
};

geospark.pauseTrip = function(tripId, success, error) {
     exec( success, error, 'geospark', "pauseTrip",[tripId]);
};

geospark.endTrip = function(tripId, success, error) {
     exec( success, error, 'geospark', "endTrip",[tripId]);
};

geospark.activeTrips = function(success, error) {
     exec( success, error, 'geospark', "activeTrips",[]);
};

geospark.getCurrentLocation = function(accuracy, success, error) {
     exec( success, error, 'geospark', "getCurrentLocation",[accuracy]);
};

geospark.updateCurrentLocation = function(accuracy) {
     exec( null, null, 'geospark', "updateCurrentLocation",[accuracy]);
};

geospark.startTracking = function() {
     exec( null, null, 'geospark', "startTracking",[]);
};

geospark.stopTracking = function() {
     exec( null, null, 'geospark', "stopTracking",[]);
};

geospark.isLocationTracking = function(callback) {
     exec( callback, null,' geospark', "isLocationTracking",[]);
};

geospark.logout = function(success, error) {
     exec( success, error, 'geospark', "logout",[]);
};

geospark.setTrackingInAppState = function(jsonarray) {
     exec( null, null, 'geospark', "setTrackingInAppState",[jsonarray]);
};

geospark.setTrackingInMotion = function(jsonarray) {
     exec( null, null, 'geospark', "setTrackingInMotion",[jsonarray]);
};

geospark.onEvents = function(callback) {
	exec( callback, null, 'geospark', "onEvents", []);
};

geospark.onError = function(callback) {
	exec( callback, null, 'geospark', "onError", []);
};

geospark.offEvents = function() {
	exec( null, null, 'geospark', "offEvents", []);
};

geospark.offError = function() {
	exec( null, null, 'geospark', "offError", []);
};

module.exports = geospark;