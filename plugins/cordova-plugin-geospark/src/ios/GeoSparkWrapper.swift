import GeoSpark


@objc(GeoSparkWrapper) class GeoSparkWrapper : CDVPlugin{
    
    // Checking motion permission is enable or not
    
    @objc(checkActivityPermission:)
    func checkActivityPermission(command: CDVInvokedUrlCommand) {
        let status = self.permissionStatus(GeoSpark.isMotionEnabled())
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: status)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    // Requesting Core Motion permission
    
    @objc(requestActivityPermission:)
    func requestActivityPermission(command: CDVInvokedUrlCommand) {
        GeoSpark.requestMotion()
        let status = self.permissionStatus(GeoSpark.isMotionEnabled())
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: status)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    // Checking location permission is enable or not
    
    @objc(checkLocationPermission:)
    func checkLocationPermission(command: CDVInvokedUrlCommand) {
        let status = self.permissionStatus(GeoSpark.isLocationEnabled())
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: status)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    // Requesting Core Location permission
    
    @objc(requestLocationPermission:)
    func requestLocationPermission(command: CDVInvokedUrlCommand) {
        GeoSpark.requestLocation()
        let status = self.permissionStatus(GeoSpark.isLocationEnabled())
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: status)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    //  User
    @objc(createUser:)
    func createUser(command: CDVInvokedUrlCommand) {
        let userDesc = command.arguments[0] as? String ?? ""
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.createUser(userDesc, { (user) in
            let userDict = self.userDictionary(user)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: userDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(setDescription:)
    func setDescription(command: CDVInvokedUrlCommand) {
        let userDesc = command.arguments[0] as? String ?? ""
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.setDescription(userDesc, { (user) in
            let userDict = self.userDictionary(user)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: userDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(getUser:)
    func getUser(command: CDVInvokedUrlCommand) {
        let userId = (command.arguments[0] as? String)!
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.getUser(userId, { (user) in
            let userDict = self.userDictionary(user)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: userDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    // Events
    
    @objc(toggleEvents:)
    func toggleEvents(command: CDVInvokedUrlCommand) {
        let toggleEvents = (command.arguments[0] as? Bool)!
        let toggleEvent1 = (command.arguments[1] as? Bool)!
        let toggleEvent2 = (command.arguments[2] as? Bool)!
        
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.toggleEvents(Geofence: toggleEvents, Trip: toggleEvent1, Activity: toggleEvent2, { (events) in
            let eventDict = self.eventsDictionary(events)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: eventDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(getEventsStatus:)
    func getEventsStatus(command: CDVInvokedUrlCommand) {
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.getEventsStatus({ (events) in
            let eventDict = self.eventsDictionary(events)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: eventDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    
    // Trip
    
    @objc(startTrip:)
    func startTrip(command: CDVInvokedUrlCommand) {
        let tripId = command.arguments[0] as? String
        let tripDesc = command.arguments[1] as? String ?? ""
        var pluginResult : CDVPluginResult? = nil
        
        GeoSpark.startTrip(tripId!, tripDesc, { (trip) in
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: trip.msg)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(resumeTrip:)
    func resumeTrip(command: CDVInvokedUrlCommand) {
        let tripId = (command.arguments[0] as? String)!
        var pluginResult : CDVPluginResult? = nil
        
        GeoSpark.resumeTrip(tripId, { (trip) in
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: trip.msg)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(pauseTrip:)
    func pauseTrip(command: CDVInvokedUrlCommand) {
        let tripId = (command.arguments[0] as? String)!
        var pluginResult : CDVPluginResult? = nil
        
        GeoSpark.pauseTrip(tripId, { (trip) in
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: trip.msg)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(endTrip:)
    func endTrip(command: CDVInvokedUrlCommand) {
        let tripId = (command.arguments[0] as? String)!
        var pluginResult : CDVPluginResult? = nil
        
        GeoSpark.endTrip(tripId, { (trip) in
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: trip.msg)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(activeTrips:)
    func activeTrips(command: CDVInvokedUrlCommand) {
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.activeTrips({ (trips) in
            let activeDict = self.activeTripArray(trips)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: activeDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    // Current Location
    
    @objc(getCurrentLocation:)
    func getCurrentLocation(command: CDVInvokedUrlCommand) {
        let accuracy = command.arguments[0] as? Int ?? 100
        GeoSpark.getCurrentLocation(accuracy) { (location) in
            let locationDict = self.currentLocationDictionary(location)
            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: locationDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(updateCurrentLocation:)
    func updateCurrentLocation(command: CDVInvokedUrlCommand) {
        let accuracy = (command.arguments[0] as? Int)!
        GeoSpark.updateCurrentLocation(accuracy)
    }
    
    // Tracking
    
    @objc(startTracking:)
    func startTracking(command: CDVInvokedUrlCommand) {
        GeoSpark.startTracking()
    }
    
    @objc(stopTracking:)
    func stopTracking(command: CDVInvokedUrlCommand) {
        GeoSpark.stopTracking()
    }
    
    @objc(isLocationTracking:)
    func isLocationTracking(command: CDVInvokedUrlCommand) {
        let status = self.locationStatus(GeoSpark.isLocationTracking())
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: status)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    @objc(logout:)
    func logout(command: CDVInvokedUrlCommand) {
        var pluginResult : CDVPluginResult? = nil
        GeoSpark.logout({ (message) in
            pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: message)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }) { (error) in
            let errorDict = self.errorDictionary(error)
            pluginResult = CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: errorDict)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
    }
    
    @objc(setTrackingInAppState:)
    func setTrackingInAppState(command: CDVInvokedUrlCommand) {
        let appState = command.arguments[0] as? [String]
        GeoSpark.trackLocationInAppState(appState!)
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    @objc(setTrackingInMotion:)
    func setTrackingInMotion(command: CDVInvokedUrlCommand) {
        let motionState = command.arguments[0] as? [String]
        GeoSpark.trackLocationInMotion(motionState!)
        let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK)
        self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
    }
    
    
    // Utility Methods.
    
    internal func userDictionary(_ user:GeoSparkUser) -> Dictionary<String,Any>{
        return  ["userId":user.userId,"description":user.userDescription!,"activity":user.activityEvents,"geofence":user.geofenceEvents,"trip":user.tripsEvents]
    }
    
    internal func errorDictionary(_ error:GeoSparkError) -> Dictionary<String,Any>{
        return  ["errorCode":error.errorCode,"errorMessage":error.errorMessage]
    }
    
    internal func activeTripArray(_ trips:GeoSparkActiveTrips) -> [Dictionary<String,Any>]{
        var tripsData:[Dictionary<String,Any>] = []
        for trip in trips.trips{
            var dict:Dictionary<String,Any> = [:]
            dict["createAt"]  = trip.createdAt
            dict["updatedAt"] = trip.updatedAt
            dict["started"]    = trip.isStarted
            dict["deleted"]   = trip.isDeleted
            dict["ended"]     = trip.isEnded
            dict["paused"]    = trip.isPaused
            dict["tripId"]    = trip.trip_id
            tripsData.append(dict)
        }
        return tripsData
    }
    internal func eventsDictionary(_ user:GeoSparkUser) -> Dictionary<String,Any>{
        return  ["userId":user.userId,"description":user.userDescription!,"activity":user.activityEvents,"geofence":user.geofenceEvents,"trip":user.tripsEvents]
    }
    
    internal func permissionStatus(_ bool:Bool) ->  String{
        if bool{
            return "GRANTED"
        }
        return "DENIED"
    }
    
    internal func currentLocationDictionary(_ location:GSLocation) -> Dictionary<String,Any>{
        return  ["latitude":location.latitude,"longitude":location.longitude,"accuracy":location.accuracy]
    }
    
    internal func locationStatus(_ bool:Bool) ->  String{
        if bool{
            return "ENABLED"
        }
        return "DISABLED"
    }
    
}
