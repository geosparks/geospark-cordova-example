cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-plugin-headercolor.HeaderColor",
      "file": "plugins/cordova-plugin-headercolor/www/HeaderColor.js",
      "pluginId": "cordova-plugin-headercolor",
      "clobbers": [
        "cordova.plugins.headerColor"
      ]
    },
    {
      "id": "cordova-plugin-native-spinner.SpinnerDialog",
      "file": "plugins/cordova-plugin-native-spinner/www/SpinnerDialog.js",
      "pluginId": "cordova-plugin-native-spinner",
      "clobbers": [
        "SpinnerDialog"
      ]
    },
    {
      "id": "cordova-plugin-geospark.geospark",
      "file": "plugins/cordova-plugin-geospark/www/geospark.js",
      "pluginId": "cordova-plugin-geospark",
      "clobbers": [
        "cordova.plugins.geospark"
      ]
    },
    {
      "id": "cordova-plugin-geospark.geospark",
      "file": "plugins/cordova-plugin-geospark/www/geospark.js",
      "pluginId": "cordova-plugin-geospark",
      "clobbers": [
        "cordova.plugins.geospark"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-device": "2.0.3",
    "cordova-plugin-headercolor": "1.0",
    "cordova-plugin-native-spinner": "1.1.3",
    "cordova-plugin-geospark": "1.0.0"
  };
});