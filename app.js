//require('babel-core').transform("")
//require('babel-polyfill');

var SensorTag = require('sensortag');
var st;
var Client = require('ibmiotf');
var config = {
    "org" : "n51ak2",
    "id" : "pitisensor",
    "domain": "internetofthings.ibmcloud.com",
    "type" : "BoardTISensor",
    "auth-method" : "token",
    "auth-token" : "WVyA?xLITypI9TBXh@"
};

var deviceClient = new Client.IotfDevice(config);
var sensordata = {};

var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};


function showID(sensorTag){
	console.log("Heureka! A new TI Sensor Tag was found!");
	console.log("ID: " + sensorTag.id);
	console.log("Type: " + sensorTag.type);


}

function errorFunc(error){
	if(error) console.log(error);
}


function prettyPrint(jsondata){

}

function onDiscover(sensorTag){
console.log("Connected to THE ONE. (ID: "+sensorTag.id+")");
st=sensorTag;
console.log("Connecting to wiotf...");
deviceClient.connect();
  
 deviceClient.on("connect", function () {
	console.log("Connected to wiotf.");
	
	sensorTag.connectAndSetUp(function(error){
		if(error) console.log(error);
		console.log("Enabeling acceleration sensor...");
		sensorTag.enableAccelerometer(function(error2){
			if(error2) console.log(error2);
			console.log("Set Period...");
			sensorTag.setAccelerometerPeriod(100, function(error3){
				if(error3) console.log(error3);
				console.log("Register Notification function...");
				sensorTag.notifyAccelerometer(function(error4){
					if(error4) console.log(error4);
					console.log("Enabeling Gyroscope sensor...");
					sensorTag.enableGyroscope(function(error2){
						if(error2) console.log(error2);
						console.log("Set Period...");
						sensorTag.setGyroscopePeriod(100, function(error3){
							if(error3) console.log(error3);
							console.log("Register Notification function...");
							sensorTag.notifyGyroscope(function(error4){
								if(error4) console.log(error4);
								console.log(" -------- DONE SETTING UP -------- ");
								var gyrox, gyroy, gyroz = 0.0;
								var logline="";
								st.on('accelerometerChange', function (x,y,z){
									accx=x;
									accy=y;
									accz=z;
									
									sensordata = {'accx':accx,'accy':accy,'accz':accz,'gyrox':gyrox,'gyroy':gyroy,'gyroz':gyroz}
									
										console.log("");
										
										logline="";
										logline+="｜";
										if (sensordata.accx>0.0) logline+=" ";
										logline+=sensordata.accx;
										logline+="｜";
										if (sensordata.accy>0.0) logline+=" ";
										logline+=sensordata.accy;
										logline+="｜";
										if (sensordata.accz>0.0) logline+=" ";	
										logline+=sensordata.accz;
										logline+="｜";
										if (sensordata.gyrox>0.0) logline+=" ";
										logline+=sensordata.gyrox;
										logline+="｜";
										if (sensordata.gyroy>0.0) logline+=" ";
										logline+=sensordata.gyroy;
										logline+="｜";
										if (sensordata.gyroz>0.0) logline+=" ";
										logline+=sensordata.gyroz;
										logline+="｜";
										
										console.log(logline);
										
									//console.log("accX,accY,1accZ, gyroX, gyroY, gyroZ :  [ "+x+" ] " + " [ "+y+" ] " + " [ "+z+" ] " + " [ "+gyrox+" ] " + " [ "+gyroy+" ] "+ " [ "+gyroz+" ] ");
									deviceClient.publish("status","json",JSON.stringify(sensordata));
								});

								st.on('gyroscopeChange', function (x,y,z){
									gyrox=x;
									gyroy=y;
									gyroz=z;
									//deviceClient.publish("status","json",'{"d" : { "a" : 2, "b" : 500 }}');
								});

							});
						});
					});
				});
			});
		});
				
	});
    //publishing event using the default quality of service
    //deviceClient.publish("status","json",'{"d" : { "a" : 2, "b" : 500 }}');
});

}






SensorTag.discoverAll(showID);
SensorTag.discoverById("247189e71a87", onDiscover);

console.log("Looking for TI Sensor Tags...");
