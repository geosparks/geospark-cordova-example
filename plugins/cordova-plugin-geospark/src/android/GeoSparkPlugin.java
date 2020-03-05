package com.geospark.cordova;

import android.Manifest;
import android.app.Activity;
import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.os.Build;
import android.provider.Settings;

import com.geospark.lib.GeoSpark;
import com.geospark.lib.callback.GeoSparkCallBack;
import com.geospark.lib.callback.GeoSparkEventsCallback;
import com.geospark.lib.callback.GeoSparkLocationCallback;
import com.geospark.lib.callback.GeoSparkLogoutCallBack;
import com.geospark.lib.callback.GeoSparkTripCallBack;
import com.geospark.lib.callback.GeoSparkTripsCallBack;
import com.geospark.lib.services.GeoSparkReceiver;
import com.geospark.lib.model.GeoSparkActiveTrips;
import com.geospark.lib.model.GeoSparkError;
import com.geospark.lib.model.GeoSparkEvents;
import com.geospark.lib.model.GeoSparkTrip;
import com.geospark.lib.model.GeoSparkUser;
import com.google.gson.GsonBuilder;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;

public class GeoSparkPlugin extends CordovaPlugin {
    private static CallbackContext eventsCallbackContext;
    private static CallbackContext errorCallbackContext;
    private static CallbackContext permissionCallbackContext;
    private Activity context;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        context = this.cordova.getActivity();
        Application application = this.cordova.getActivity().getApplication();
        GeoSpark.initialize(application, "YOUR-PUBLISHABLE-KEY");
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        switch (action) {
            case "disableBatteryOptimization":
                this.disableBatteryOptimization();
                return true;

            case "isBatteryOptimizationEnabled":
                this.isBatteryOptimizationEnabled(callbackContext);
                return true;

            case "checkActivityPermission":
                this.checkActivityPermission(callbackContext);
                return true;

            case "requestActivityPermission":
                this.requestActivityPermission(callbackContext);
                return true;

            case "checkLocationPermission":
                this.checkLocationPermission(callbackContext);
                return true;

            case "requestLocationPermission":
                this.requestLocationPermission(callbackContext);
                return true;

            case "checkLocationServices":
                this.checkLocationServices(callbackContext);
                return true;

            case "requestLocationServices":
                this.requestLocationServices(callbackContext);
                return true;

            case "checkBackgroundLocationPermission":
                this.checkBackgroundLocationPermission(callbackContext);
                return true;

            case "requestBackgroundLocationPermission":
                this.requestBackgroundLocationPermission(callbackContext);
                return true;

            case "getDeviceToken":
                this.getDeviceToken(callbackContext);
                return true;

            case "createUser":
                String description = args.getString(0);
                this.createUser(description, callbackContext);
                return true;

            case "setDescription":
                String desc = args.getString(0);
                this.setDescription(desc, callbackContext);
                return true;

            case "getUser":
                String userId = args.getString(0);
                this.getUser(userId, callbackContext);
                return true;

            case "toggleEvents":
                boolean geofenceEvents = args.getBoolean(0);
                boolean tripEvents = args.getBoolean(1);
                boolean activityEvents = args.getBoolean(2);
                this.toggleEvents(geofenceEvents, tripEvents, activityEvents, callbackContext);
                return true;

            case "getEventsStatus":
                this.getEventsStatus(callbackContext);
                return true;

            case "startTrip":
                String tripId = args.getString(0);
                String tripDescription = args.getString(1);
                this.startTrip(tripId, tripDescription, callbackContext);
                return true;

            case "resumeTrip":
                String resumeTripId = args.getString(0);
                this.resumeTrip(resumeTripId, callbackContext);
                return true;

            case "pauseTrip":
                String pauseTripId = args.getString(0);
                this.pauseTrip(pauseTripId, callbackContext);
                return true;

            case "endTrip":
                String endTripId = args.getString(0);
                this.endTrip(endTripId, callbackContext);
                return true;

            case "activeTrips":
                this.activeTrips(callbackContext);
                return true;

            case "getCurrentLocation":
                int accuracy = args.getInt(0);
                this.getCurrentLocation(accuracy, callbackContext);
                return true;

            case "updateCurrentLocation":
                int updateAccuracy = args.getInt(0);
                this.updateCurrentLocation(updateAccuracy);
                return true;

            case "startTracking":
                this.startTracking();
                return true;

            case "stopTracking":
                this.stopTracking();
                return true;

            case "isLocationTracking":
                this.isLocationTracking(callbackContext);
                return true;

            case "logout":
                this.logout(callbackContext);
                return true;

            case "setTrackingInAppState":
                this.setTrackingInAppState(arrayToEnum(args));
                return true;

            case "setTrackingInMotion":
                this.setTrackingInMotion(arrayToEnum(args));
                return true;

            case "onEvents":
                this.onEvents(callbackContext);
                return true;

            case "onError":
                this.onError(callbackContext);
                return true;

            case "offEvents":
                this.offEvents();
                return true;

            case "offError":
                this.offError();
                return true;
        }
        return false;
    }

    private void disableBatteryOptimization() {
        GeoSpark.disableBatteryOptimization(context);
    }

    private void isBatteryOptimizationEnabled(CallbackContext callbackContext) {
        String status = enabledStatus(GeoSpark.isBatteryOptimizationEnabled(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void checkActivityPermission(CallbackContext callbackContext) {
        String status = permissionsStatus(GeoSpark.checkActivityPermission(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void requestActivityPermission(CallbackContext callbackContext) {
        permissionCallbackContext = callbackContext;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            String[] permissions = {Manifest.permission.ACTIVITY_RECOGNITION};
            cordova.requestPermissions(this, GeoSpark.REQUEST_CODE_ACTIVITY, permissions);
        } else {
            permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "UNKNOWN"));
        }
    }

    private void checkLocationPermission(CallbackContext callbackContext) {
        String status = permissionsStatus(GeoSpark.checkLocationPermission(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void requestLocationPermission(CallbackContext callbackContext) {
        permissionCallbackContext = callbackContext;
        String[] permissions = {Manifest.permission.ACCESS_FINE_LOCATION};
        cordova.requestPermissions(this, GeoSpark.REQUEST_CODE_LOCATION_PERMISSION, permissions);
    }

    private void checkLocationServices(CallbackContext callbackContext) {
        String status = enabledStatus(GeoSpark.checkLocationServices(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void requestLocationServices(CallbackContext callbackContext) {
        permissionCallbackContext = callbackContext;
        cordova.startActivityForResult(this, new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS), GeoSpark.REQUEST_CODE_LOCATION_ENABLED);
    }

    private void checkBackgroundLocationPermission(CallbackContext callbackContext) {
        String status = permissionsStatus(GeoSpark.checkBackgroundLocationPermission(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void requestBackgroundLocationPermission(CallbackContext callbackContext) {
        permissionCallbackContext = callbackContext;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            String[] permissions = {Manifest.permission.ACCESS_BACKGROUND_LOCATION};
            cordova.requestPermissions(this, GeoSpark.REQUEST_CODE_BACKGROUND_LOCATION, permissions);
        } else {
            permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, "UNKNOWN"));
        }
    }

    private void getDeviceToken(CallbackContext callbackContext) {
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, GeoSpark.getDeviceToken(context)));
    }

    private void createUser(String description, final CallbackContext callbackContext) {
        GeoSpark.createUser(context, description, new GeoSparkCallBack() {
            @Override
            public void onSuccess(GeoSparkUser geoSparkUser) {
                String serializedUser = new GsonBuilder().create().toJson(geoSparkUser);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void setDescription(String description, final CallbackContext callbackContext) {
        GeoSpark.setDescription(context, description, new GeoSparkCallBack() {
            @Override
            public void onSuccess(GeoSparkUser geoSparkUser) {
                String serializedUser = new GsonBuilder().create().toJson(geoSparkUser);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void getUser(String userId, final CallbackContext callbackContext) {
        GeoSpark.getUser(context, userId, new GeoSparkCallBack() {
            @Override
            public void onSuccess(GeoSparkUser geoSparkUser) {
                String serializedUser = new GsonBuilder().create().toJson(geoSparkUser);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void toggleEvents(boolean geofenceEvents, boolean tripEvents, boolean activityEvents, final CallbackContext callbackContext) {
        GeoSpark.toggleEvents(context, geofenceEvents, tripEvents, activityEvents, new GeoSparkEventsCallback() {
            @Override
            public void onSuccess(GeoSparkEvents geoSparkEvents) {
                String serializedUser = new GsonBuilder().create().toJson(geoSparkEvents);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void getEventsStatus(final CallbackContext callbackContext) {
        GeoSpark.getEventsStatus(context, new GeoSparkEventsCallback() {
            @Override
            public void onSuccess(GeoSparkEvents geoSparkEvents) {
                String serializedUser = new GsonBuilder().create().toJson(geoSparkEvents);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void startTrip(String tripId, String description, final CallbackContext callbackContext) {
        GeoSpark.startTrip(context, tripId, description, new GeoSparkTripCallBack() {
            @Override
            public void onSuccess(GeoSparkTrip geoSparkTrip) {
                callbackContext.success(geoSparkTrip.getMsg());
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void resumeTrip(String tripId, final CallbackContext callbackContext) {
        GeoSpark.resumeTrip(context, tripId, new GeoSparkTripCallBack() {
            @Override
            public void onSuccess(GeoSparkTrip geoSparkTrip) {
                callbackContext.success(geoSparkTrip.getMsg());
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void pauseTrip(String tripId, final CallbackContext callbackContext) {
        GeoSpark.pauseTrip(context, tripId, new GeoSparkTripCallBack() {
            @Override
            public void onSuccess(GeoSparkTrip geoSparkTrip) {
                callbackContext.success(geoSparkTrip.getMsg());
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void endTrip(String tripId, final CallbackContext callbackContext) {
        GeoSpark.endTrip(context, tripId, new GeoSparkTripCallBack() {
            @Override
            public void onSuccess(GeoSparkTrip geoSparkTrip) {
                callbackContext.success(geoSparkTrip.getMsg());
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void activeTrips(final CallbackContext callbackContext) {
        GeoSpark.activeTrips(context, new GeoSparkTripsCallBack() {
            @Override
            public void onSuccess(List<GeoSparkActiveTrips> list) {
                String serializedUser = new GsonBuilder().create().toJson(list);
                callbackContext.success(serializedUser);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void getCurrentLocation(int accuracy, final CallbackContext callbackContext) {
        GeoSpark.getCurrentLocation(context, accuracy, new GeoSparkLocationCallback() {

            @Override
            public void location(double latitude, double longitude, double accuracy) {
                try {
                    JSONObject obj = new JSONObject();
                    obj.put("latitude", latitude);
                    obj.put("longitude", longitude);
                    obj.put("accuracy", accuracy);
                    callbackContext.success(obj.toString());
                } catch (JSONException e) {
                    callbackContext.error("JSON error");
                }
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void updateCurrentLocation(int accuracy) {
        GeoSpark.updateCurrentLocation(context, accuracy);
    }

    private void startTracking() {
        GeoSpark.startTracking(context);
    }

    private void stopTracking() {
        GeoSpark.stopTracking(context);
    }

    private void isLocationTracking(CallbackContext callbackContext) {
        String status = enabledStatus(GeoSpark.isLocationTracking(context));
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, status));
    }

    private void logout(final CallbackContext callbackContext) {
        GeoSpark.logout(context, new GeoSparkLogoutCallBack() {
            @Override
            public void onSuccess(String s) {
                callbackContext.success(s);
            }

            @Override
            public void onFailure(GeoSparkError geoSparkError) {
                String serializedError = new GsonBuilder().create().toJson(geoSparkError);
                callbackContext.error(serializedError);
            }
        });
    }

    private void setTrackingInAppState(GeoSpark.Type[] types) {
        GeoSpark.setTrackingInAppState(context, types);
    }

    private void setTrackingInMotion(GeoSpark.Type[] types) {
        GeoSpark.setTrackingInMotion(context, types);
    }

    private void onEvents(final CallbackContext callbackContext) {
        eventsCallbackContext = callbackContext;
    }

    private void onError(final CallbackContext callbackContext) {
        errorCallbackContext = callbackContext;
    }

    private void offEvents() {
        eventsCallbackContext = null;
    }

    private void offError() {
        errorCallbackContext = null;
    }

    private static GeoSpark.Type[] arrayToEnum(JSONArray args) throws JSONException {
        JSONArray obj = args.getJSONArray(0);
        GeoSpark.Type[] typeArray = new GeoSpark.Type[obj.length()];
        if (obj.length() != 0) {
            for (int i = 0; i < obj.length(); i++) {
                typeArray[i] = stringToEnum(obj.getString(i));
            }
        }
        return typeArray;
    }

    private static GeoSpark.Type stringToEnum(String type) {
        return Enum.valueOf(GeoSpark.Type.class, type);
    }

    private static String enabledStatus(boolean hasEnabled) {
        if (hasEnabled) {
            return "ENABLED";
        }
        return "DISABLED";
    }

    private static String permissionsStatus(boolean hasPermissionsGranted) {
        if (hasPermissionsGranted)
            return "GRANTED";
        return "DENIED";
    }

    private static JSONObject jsonLocation(Location location) throws JSONException {
        JSONObject obj = new JSONObject();
        obj.put("latitude", location.getLatitude());
        obj.put("longitude", location.getLongitude());
        obj.put("accuracy", location.getAccuracy());
        return obj;
    }

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
        super.onRequestPermissionResult(requestCode, permissions, grantResults);
        if (permissionCallbackContext == null) {
            return;
        }
        switch (requestCode) {
            case GeoSpark.REQUEST_CODE_ACTIVITY:
                permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, permissionsStatus(GeoSpark.checkActivityPermission(context))));
                break;

            case GeoSpark.REQUEST_CODE_LOCATION_PERMISSION:
                permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, permissionsStatus(GeoSpark.checkLocationPermission(context))));
                break;

            case GeoSpark.REQUEST_CODE_BACKGROUND_LOCATION:
                permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, permissionsStatus(GeoSpark.checkBackgroundLocationPermission(context))));
                break;
        }
        permissionCallbackContext = null;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);
        if (permissionCallbackContext == null) {
            return;
        }
        if (requestCode == GeoSpark.REQUEST_CODE_LOCATION_ENABLED) {
            permissionCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, enabledStatus(GeoSpark.checkLocationServices(context))));
        }
        permissionCallbackContext = null;
    }

    public static class GeoSparkCordovaReceiver extends GeoSparkReceiver {

        @Override
        public void onLocationUpdated(Context context, Location location, GeoSparkUser geoSparkUser, String activity) {
            if (eventsCallbackContext == null)
                return;
            try {
                JSONObject obj = new JSONObject();
                obj.put("userId", geoSparkUser.getUserId());
                obj.put("location", jsonLocation(location));
                obj.put("activity", activity);
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, obj.toString());
                pluginResult.setKeepCallback(true);
                eventsCallbackContext.sendPluginResult(pluginResult);
            } catch (JSONException e) {
                eventsCallbackContext.sendPluginResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION));
            }
        }

        @Override
        public void onError(Context context, GeoSparkError geoSparkError) {
            if (errorCallbackContext == null)
                return;
            String error = new GsonBuilder().create().toJson(geoSparkError);
            PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, error);
            pluginResult.setKeepCallback(true);
            errorCallbackContext.sendPluginResult(pluginResult);
        }
    }
}
