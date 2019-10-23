/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        var string = device.platform;
        if(string == 'Android'){
             cordova.plugins.geospark.disableBatteryOptimization();
        }
        app.init();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
    },

     init: function(){
        var localStorage = window.localStorage; 
        if(localStorage.getItem('INIT') == null){
            app.setLocalStorage('INIT', 'TRUE');
            app.setLocalStorage('USER_ID', null);
            app.setLocalStorage('TRACKING', null);
        }
        app.buttonStatus();
    },

  
    activityPermissionIOS: function(){
         cordova.plugins.geospark.checkActivityPermission(function(status){
            if (status == 'DENIED') {
                cordova.plugins.geospark.requestActivityPermission(function(status){
                    if (status == 'DENIED') {
                        alert('Please grant Activity permission');
                    }else{
                        app.locationPermissionIOS();
                    }
                });
            } else{
                app.locationPermissionIOS();
            }
        });
    },

    locationPermissionIOS: function(){
         cordova.plugins.geospark.checkLocationPermission(function(status){
            if (status == 'DENIED') {
                cordova.plugins.geospark.requestLocationPermission(function(status){
                    if (status == 'DENIED') {
                        alert('Please grant Location permission');
                    }else{
                        app.setLocalStorage('TRACKING', 'TRUE');
                        cordova.plugins.geospark.startTracking();
                        app.buttonStatus();
                    }
                });
            } else{
                app.setLocalStorage('TRACKING', 'TRUE');
                cordova.plugins.geospark.startTracking();
                app.buttonStatus();  
            }
        });
    },

    activtityPermission: function(){
        cordova.plugins.geospark.checkActivityPermission(function(status){
           if (status == 'DENIED') {
               cordova.plugins.geospark.requestActivityPermission(function(status){
                   if (status == 'DENIED') {
                       alert('Please grant Activity permission');
                   }else{
                       app.locationPermission();
                   }
               });
           } else{
               app.locationPermission();  
           }
       });
   },

    locationPermission: function(){
    	 var vers = device.version;
         cordova.plugins.geospark.checkLocationPermission(function(status){
            if (status == 'DENIED') {
                cordova.plugins.geospark.requestLocationPermission(function(status){
                    if (status == 'DENIED') {
                        alert('Please grant Location permission');
                    }else{
        				if(vers == 10){
                        	app.backgroundLocationPermission();
                        }else{
                        	 app.locationService();
                        }
                    }
                });
            } else{
                if(vers == 10){
                    app.backgroundLocationPermission();
				}else{
					app.locationService();
				}
            }
        });
    },

    backgroundLocationPermission: function(){
        cordova.plugins.geospark.checkBackgroundLocationPermission(function(status){
           if (status == 'DENIED') {
               cordova.plugins.geospark.requestBackgroundLocationPermission(function(status){
                   if (status == 'DENIED') {
                       alert('Please grant Background Location permission');
                   }else{
                       app.locationService();
                   }
               });
           } else{
               app.locationService();  
           }
       });
   },

    locationService: function(){
         cordova.plugins.geospark.checkLocationServices(function(status){
            if (status == 'DISABLED') {
                cordova.plugins.geospark.requestLocationServices(function(status){
                    if (status == 'DISABLED') {
                        alert('Please enable Location Service permission');
                    }else{
                        app.setLocalStorage('TRACKING', 'TRUE');
                        cordova.plugins.geospark.startTracking();
                        app.buttonStatus();
                    }
                });
            } else{
                app.setLocalStorage('TRACKING', 'TRUE');
                cordova.plugins.geospark.startTracking();
                app.buttonStatus();
            }
        });
    },

    checkLocationPermission: function () {
         cordova.plugins.geospark.checkLocationPermission(function(status){
            if (status == 'DENIED') {
                cordova.plugins.geospark.requestLocationPermission(function(status){
                    if (status == 'DENIED') {
                        alert('Please grant Location permission');
                    }else{
                        app.getCurrentLocation();
                    }
                });
            } else{
               app.getCurrentLocation();
            }
        });
    },

    getCurrentLocation: function(){
        var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show();
        }else{
            SpinnerDialog.show(null,'Getting current location..',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
        cordova.plugins.geospark.getCurrentLocation(30, function(success){
             SpinnerDialog.hide();
                if(os == 'Android'){
                    var json = JSON.parse(success);
                        alert('Latitude '+ json['latitude'] +
                                'longitude '+ json['longitude'] +
                                'Accuracy '+ json['accuracy'] );
                } else {
                     alert('Latitude '+ success['latitude'] +
                                'longitude '+ success['longitude'] +
                                'Accuracy '+ success['accuracy'] );
                }
        }, function(error){
            SpinnerDialog.hide();
            console.log(error);
        });
    },

    updateCurrentLocation: function(){
        cordova.plugins.geospark.updateCurrentLocation(30);
    },

    setUserId: function(userId){
        document.getElementById("userIdlabel").innerHTML = 'UserId: '+ userId;
    },

    createUser: function() {
        var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show();
        }else{
            SpinnerDialog.show(null,'Creating user..',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
        var desc=document.getElementById("dname").value;
        if(desc.length != 0){
            cordova.plugins.geospark.createUser(desc, function(success){
                 var userId='';
                 if(os == 'Android'){
                    var json = JSON.parse(success);
                    userId=json['userId'];
                 }else{
                    userId=success['userId'];
                 }
                cordova.plugins.geospark.toggleEvents(true,true,true, function(success){
                    SpinnerDialog.hide();
                    app.setLocalStorage('USER_ID', userId);
                    app.buttonStatus(); 
                    alert('User created.')
                }, function(error){
                    SpinnerDialog.hide();
                    console.log(error);
                });
            }, function(error){
                 SpinnerDialog.hide();
                console.log(error);
            });
        }  else{
             alert('Enter description');
        }
    },

    setDescription: function() {
        var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show();
        }else{
            SpinnerDialog.show(null,'Setting description..',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
        var desc=document.getElementById("dname").value
        if(desc.length != 0){
            cordova.plugins.geospark.setDescription(desc, function(success){
                SpinnerDialog.hide();
                alert('Successfully Added');
            }, function(error){
                SpinnerDialog.hide();
                console.log(error);
            });
        }  else{
             alert('Enter description');
        }
    },

    getUser: function() {
        var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show();
        }else{
            SpinnerDialog.show(null,'Initializing user..',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
        var userId=document.getElementById("usrId").value
        if(userId.length != 0){
            cordova.plugins.geospark.getUser(userId, function(success){
                var user='';
                if(os == 'Android'){
                    var json = JSON.parse(success);
                    user=json['userId'];
                }else{
                    user=success['userId'];
                }
                cordova.plugins.geospark.toggleEvents(true,true,true, function(success){
                    SpinnerDialog.hide();
                    app.setLocalStorage('USER_ID', user);
                    app.buttonStatus();
                    alert('User initialized.');

                }, function(error){
                    SpinnerDialog.hide();
                    console.log(error);

                });
            }, function(error){
                SpinnerDialog.hide();
                console.log(error);
            });
        }  else{
             alert('Enter User Id');
        }
    },

    startTracking: function () {
        var os = device.platform;
        if( os == 'iOS'){
            app.activityPermissionIOS();
        }else{
        	var vers = device.version;
        	if(vers == 10){
            	app.activtityPermission();
        	}else{
				app.locationPermission();
        	}
        }
         app.buttonStatus();
    },

    stopTracking: function () {
         app.setLocalStorage('TRACKING', 'FALSE');
         cordova.plugins.geospark.stopTracking();
         app.buttonStatus();
    },

    logout: function() {
        var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show();
        }else{
            SpinnerDialog.show(null,'Logout..',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
        cordova.plugins.geospark.logout(function(success){
            SpinnerDialog.hide();
            app.clearStorage();
            app.buttonStatus();
            alert('Successfully logout');
        }, function(error){
            SpinnerDialog.hide();
            console.log(error);
        });
    },

    buttonStatus: function(){
         var localStorage = window.localStorage; 
         if(localStorage.getItem('USER_ID') != 'null') {
            app.setUserId(localStorage.getItem('USER_ID'));
            console.log(localStorage.getItem('USER_ID'));
            document.getElementById("createUserBtn").disabled = true;
            document.getElementById("getUserBtn").disabled = true;
            document.getElementById("logoutBtn").disabled = false;
            document.getElementById("setDescBtn").disabled = false;
            if(localStorage.getItem('TRACKING') == 'null' || localStorage.getItem('TRACKING') == 'FALSE'){
                document.getElementById("startTrackBtn").disabled = false;
                document.getElementById("stopTrackBtn").disabled = true;
            }else{
                document.getElementById("startTrackBtn").disabled = true;
                document.getElementById("stopTrackBtn").disabled = false;
            }
         }else{
            document.getElementById("createUserBtn").disabled = false;
            document.getElementById("getUserBtn").disabled = false;
            document.getElementById("startTrackBtn").disabled = true;
            document.getElementById("stopTrackBtn").disabled = true;
            document.getElementById("setDescBtn").disabled = true;
            document.getElementById("logoutBtn").disabled = true;
         }
    },

    trip: function(){
        window.location = "trip.html";
    },

    setLocalStorage: function(tag, text) { 
        var localStorage = window.localStorage; 
        localStorage.setItem(tag, text); 
    },

    clearStorage: function() {
        app.setUserId(' ')
        app.setLocalStorage('USER_ID',null);
        app.setLocalStorage('TRACKING',null);
    },
};

app.initialize();