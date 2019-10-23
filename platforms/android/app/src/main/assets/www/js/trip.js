
var app = {    
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        app.activeTrips();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
    },

    activeTrips: function() {
       var os = device.platform;
        if(os == 'Android'){
            SpinnerDialog.show("Trip","Loading trips...", true);
        }else{
            SpinnerDialog.show(null,'Loading trips...',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
            cordova.plugins.geospark.activeTrips(function(success){
            	    SpinnerDialog.hide();
                    if(os == 'Android'){
                        var json = JSON.parse(success);
                        var html = '<ul id="listHotelsOption" class="triplist-container" data-role="listview" style="margin-left:0px;padding:5px 10px;">';
                        $.each(json,function(i,val){
                        html += '<div style="border-bottom: 0.5px solid; width: 100%; display: flex;margin-left:0px;margin-right:auto;padding:10px 0px;"> <div>'+
                        '<p style="padding-left:0px;">Trip Id: <span>'+val.tripId+'</span></p>' +
                        '<p>Date: <span>'+val.updatedAt+'</p></div>'
                        	if(val.started == true){
                               		html +='<div style="display: inline-grid;">'+
                               		'<button class="start-btn" id="'+val.tripId+'" style="width: 12em; background-color: #E0E0E0; color: black;" onclick=app.starTrip("'+val.tripId+'") disabled>Start Trip</button>'+
                               		'<button id="endTripBtn" style="width: 12em; background-color: #1c87c9; color: white;" onclick=app.endTrip("'+val.tripId+'")>End Trip</button></div></div>'
                                
                        	}else{
                        	 		html +='<div style="display: inline-grid;">'+
                               		'<button class="start-btn" id="'+val.tripId+'" style="width: 12em; background-color: #1c87c9; color: white;" onclick=app.starTrip("'+val.tripId+'")>Start Trip</button>'+
                               		'<button id="'+val.tripId+'" style="width: 12em; background-color: #E0E0E0; color: black;" disabled onclick=app.endTrip("'+val.tripId+'")>End Trip</button></div></div>'
                        	}    
                        });
                        html += '</ul>';
                        $("#content").html(html);
                    }else{
                        var html = '<ul id="listHotelsOption" class="triplist-container" data-role="listview" style="margin-left:0px;padding:5px 10px;">';
                        $.each(success,function(i,val){
                        html += '<div style="border-bottom: 0.5px solid; width: 100%; display: flex;margin-left:0px;margin-right:auto;padding:10px 0px;"> <div>'+
                        '<p style="padding-left:0px;">Trip Id: <span>'+val.tripId+'</span></p>' +
                        '<p>Date: <span>'+val.updatedAt+'</p></div>'
                            if(val.started == true){
                                    html +='<div style="display: inline-grid;">'+
                                    '<button class="start-btn" id="'+val.tripId+'" style="width: 12em; background-color: #E0E0E0; color: black;" onclick=app.starTrip("'+val.tripId+'") disabled>Start Trip</button>'+
                                    '<button id="endTripBtn" style="width: 12em; background-color: #1c87c9; color: white;" onclick=app.endTrip("'+val.tripId+'")>End Trip</button></div></div>'
                                
                            }else{
                                    html +='<div style="display: inline-grid;">'+
                                    '<button class="start-btn" id="'+val.tripId+'" style="width: 12em; background-color: #1c87c9; color: white;" onclick=app.starTrip("'+val.tripId+'")>Start Trip</button>'+
                                    '<button id="'+val.tripId+'" style="width: 12em; background-color: #E0E0E0; color: black;" disabled onclick=app.endTrip("'+val.tripId+'")>End Trip</button></div></div>'
                            }    
                        });
                        html += '</ul>';
                        $("#content").html(html);
                    }
            }, function(error){
            	SpinnerDialog.hide();
                console.log(error);
            });
    },
    
    starTrip: function(tripId) {
        var os = device.platform;
        if(os == 'Android'){
           SpinnerDialog.show("Trip","starting....", true);
        }else{
            SpinnerDialog.show(null,'starting...',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
            cordova.plugins.geospark.startTrip(tripId, "desp", function(success){
               SpinnerDialog.hide();
               app.activeTrips();          
            }, function(error){
            	 SpinnerDialog.hide();
                console.log(error);
            });
    },

    endTrip: function(tripId) {
        var os = device.platform;
        if(os == 'Android'){
           SpinnerDialog.show("Trip","ending....", true);
        }else{
            SpinnerDialog.show(null,'ending...',true, { textColorRed: 0.1, textColorGreen: 0.1, textColorBlue: 1 });
        }
            cordova.plugins.geospark.endTrip(tripId, function(success){
            	SpinnerDialog.hide();
                app.activeTrips();
            }, function(error){
            	 SpinnerDialog.hide();
                console.log(error);
            });
    },

    index: function(){
        window.location = "index.html";
    },

};

app.initialize();