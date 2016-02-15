angular.module('app.controllers', [])

	.controller('blueTestCtrl', function($scope, $rootScope, $cordovaBluetoothLE, $cordovaToast) {
		$rootScope.devices = {};
		$scope.errors_list = [];
		$scope.loading = false;

		$scope.showToast = function(message, duration, location) {
			$cordovaToast.show(message, duration, location).then(function(success) {
				console.log("The toast was shown");
			}, function (error) {
				console.log("The toast was not shown due to " + error);
			});
		}


		$scope.isEmpty = function() {
			if (Object.keys($rootScope.devices).length === 0) {
				return true;
			}
			return false;
		};

		$rootScope.initialize = function() {
			var params = {request:true};

			console.log("Initialize : " + JSON.stringify(params));

			$cordovaBluetoothLE.initialize(params).then(null, null, function(obj) {
				console.log("Initialize Success : " + JSON.stringify(obj));
				//$scope.showToast("Initialize : " + params.request, 'short', 'bottom');

			});
		};

		$rootScope.isInitialized = function() {
			console.log("Is Initialized");


			$cordovaBluetoothLE.isInitialized().then(function(obj) {
				console.log("Is Initialized Success : " + JSON.stringify(obj));
			});
		};

		$rootScope.enable = function() {
			console.log("Enable");
			$cordovaBluetoothLE.enable().then(null, function(obj) {
				console.log("Enable Error : " + JSON.stringify(obj));
				$scope.showToast(obj.message, 'short', 'bottom');
				
			});
		};

		$rootScope.isEnabled = function() {
			console.log("Is Enabled");

			$cordovaBluetoothLE.isEnabled().then(function(obj) {
				console.log("Is Enabled Success : " + JSON.stringify(obj));
				$scope.errors_list.push("Is Enabled Success : " + JSON.stringify(obj));
			});
		};

		$rootScope.disable = function() {
			console.log("Disable");
			$scope.loading = false;


			$cordovaBluetoothLE.disable().then(null, function(obj) {
				console.log("Disable Error : " + JSON.stringify(obj));
			});
		};

		$rootScope.startScan = function() {
			$scope.loading = true;
			$scope.errors_list.push("Initialising Scan");
			var params = {
				services:[],
				allowDuplicates: false,
				scanMode: bluetoothle.SCAN_MODE_LOW_POWER,
				matchMode: bluetoothle.MATCH_MODE_STICKY,
				matchNum: bluetoothle.MATCH_NUM_ONE_ADVERTISEMENT,
				//callbackType: bluetoothle.CALLBACK_TYPE_FIRST_MATCH,
				scanTimeout: 10000,
			};

			console.log("Start Scan : " + JSON.stringify(params));

			$cordovaBluetoothLE.startScan(params).then(function(obj) {
				console.log("Start Scan Auto Stop : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Start Scan Error : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Start Scan Success : " + JSON.stringify(obj));

				addDevice(obj);
			});
			
		};

		$rootScope.isScanning = function() {
			console.log("Is Scanning");
			$cordovaBluetoothLE.isScanning().then(function(obj) {
				console.log("Is Scanning Success : " + JSON.stringify(obj));
			});
		};

		
		$rootScope.stopScan = function() {
			console.log("Stop Scan");
			$scope.loading = false;
			$cordovaBluetoothLE.stopScan().then(function(obj) {
				console.log("Stop Scan Success : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Stop Scan Error : " + JSON.stringify(obj));
			});
		};


		function addDevice(obj) {
			if (obj.status == "scanStarted") {
				return;
			}
			if ($rootScope.devices[obj.address] !== undefined) {
				return;
			}
			obj.services = {};
			$rootScope.devices[obj.address] = obj;
		}


	})


	.controller('blueConnectCtrl', function($scope, $rootScope, $cordovaBluetoothLE, $cordovaToast, $stateParams, $ionicHistory){
		$scope.errors_l = [];
		$scope.serial_service_uuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
		$scope.serial_service_uuid_tx = "6e400002-b5a3-f393-e0a9-e50e24dcca9e"
		$scope.serial_service_uuid_rx = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
		$scope.$on("$ionicView.beforeEnter", function () {
			$rootScope.selectedDevice = $rootScope.devices[$stateParams.address];
		});


		$rootScope.connect = function(address) {
			var params = {address:address, timeout: 5000};

			console.log("Connect : " + JSON.stringify(params));
			$scope.errors_l.push("Connect : " + JSON.stringify(params));

			$cordovaBluetoothLE.connect(params).then(null, function(obj) {
				console.log("Connect Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Connect Error : " + JSON.stringify(obj));
				$rootScope.close(address); //Best practice is to close on connection error
			}, function(obj) {
				console.log("Connect Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Connect Success : " + JSON.stringify(obj));
			});
		};

		$rootScope.reconnect =function(address) {
			var params = {address:address, timeout: 5000};

			console.log("Reconnect : " + JSON.stringify(params));

			$cordovaBluetoothLE.reconnect(params).then(null, function(obj) {
				console.log("Reconnect Error : " + JSON.stringify(obj));
				$rootScope.close(address); //Best practice is to close on connection error
			}, function(obj) {
				console.log("Reconnect Success : " + JSON.stringify(obj));
			});
		};

		$rootScope.disconnect = function(address) {
			var params = {address:address};

			console.log("Disconnect : " + JSON.stringify(params));
			$scope.errors_l.push("Disconnect : " + JSON.stringify(params));

			$cordovaBluetoothLE.disconnect(params).then(function(obj) {
				$rootScope.close(address);
				console.log("Disconnect Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Disconnect Success : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Disconnect Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Disconnect Error : " + JSON.stringify(obj));
			});
		};

		$rootScope.close = function(address) {
			var params = {address:address};

			console.log("Close : " + JSON.stringify(params));
			$scope.errors_l.push("Close : " + JSON.stringify(params));

			$cordovaBluetoothLE.close(params).then(function(obj) {
				console.log("Close Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Close Success : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Close Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Close Error : " + JSON.stringify(obj));
			});

			var device = $rootScope.devices[address];
			device.services = {};
		};

		$rootScope.characteristics = function(address, service) {
			var params = {address:address, service:service, characteristics:[]};

			console.log("Characteristics : " + JSON.stringify(params));
			$scope.errors_l.push("Characteristics : " + JSON.stringify(params));

			$cordovaBluetoothLE.characteristics(params).then(function(obj) {
				console.log("Characteristics Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Characteristics Success : " + JSON.stringify(obj));

				var device = $rootScope.devices[obj.address];
				var service = device.services[obj.service];

				for (var i = 0; i < obj.characteristics.length; i++) {
					addCharacteristic(obj.characteristics[i], service);
				}
			}, function(obj) {
				console.log("Characteristics Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Characteristics Error : " + JSON.stringify(obj));
			});
		};

		$rootScope.descriptors = function(address, service, characteristic) {
			var params = {address:address, service:service, characteristic:characteristic};

			console.log("Descriptors : " + JSON.stringify(params));
			$scope.errors_l.push("Descriptors : " + JSON.stringify(params));

			$cordovaBluetoothLE.descriptors(params).then(function(obj) {
				console.log("Descriptors Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Descriptors Success : " + JSON.stringify(obj));

				var device = $rootScope.devices[obj.address];
				var service = device.services[obj.service];
				var characteristic = service.characteristics[obj.characteristic];

				var descriptors = obj.descriptors;

				for (var i = 0; i < descriptors.length; i++) {
					addDescriptor({uuid: descriptors[i]}, characteristic);
				}
			}, function(obj) {
				console.log("Descriptors Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Descriptors Error : " + JSON.stringify(obj));
			});
		};

		$rootScope.services = function(address) {
			var params = {address:address, services:[]};
			$scope.errors_l.push(params);

			console.log("Services : " + JSON.stringify(params));
			$scope.errors_l.push("Services : " + JSON.stringify(params));

			$cordovaBluetoothLE.services(params)
				.then(function(obj) {
					console.log("Services Success : " + JSON.stringify(obj));
					$scope.errors_l.push("Services Success : " + JSON.stringify(obj));

					var device = $rootScope.devices[obj.address];

					for (var i = 0; i < obj.services.length; i++) {
						addService({uuid: obj.services[i]}, device);
					}
				}, function(error) {
					console.log("Services Error : " + JSON.stringify(error));
					$scope.errors_l.push("Services Error : " + JSON.stringify(error));
				});
		};

		$rootScope.discover = function(address) {
			var params = {
				address:address,
				timeout: 5000
			};

			console.log("Discover : " + JSON.stringify(params));
			$scope.errors_l.push("Discover : " + JSON.stringify(params));

			$cordovaBluetoothLE.discover(params).then(function(obj) {
				console.log("Discover Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Discover Success : " + JSON.stringify(obj));

				var device = $rootScope.devices[obj.address];

				var services = obj.services;

				for (var i = 0; i < services.length; i++) {
					var service = services[i];
					addService(service, device);

					var serviceNew = device.services[service.uuid];

					var characteristics = service.characteristics;

					for (var j = 0; j < characteristics.length; j++) {
						var characteristic = characteristics[j];

						addCharacteristic(characteristic, serviceNew);

						var characteristicNew = serviceNew.characteristics[characteristic.uuid];

						var descriptors = characteristic.descriptors;

						for (var k = 0; k < descriptors.length; k++) {
							var descriptor = descriptors[k];

							addDescriptor(descriptor, characteristicNew);
						}
					}
				}
			}, function(obj) {
				console.log("Discover Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Discover Error : " + JSON.stringify(obj));
			});
		};

		function addService(service, device) {
			if (device.services[service.uuid] !== undefined) {
				return;
			}
			device.services[service.uuid] = {uuid : service.uuid, characteristics: {}};
		}

		function addCharacteristic(characteristic, service) {
			if (service.characteristics[characteristic.uuid] !== undefined) {
				$scope.errors_l.push("Caracteristica =>" + JSON.stringify(service.characteristics[characteristic.uuid]));
				return;
			}
			service.characteristics[characteristic.uuid] = {uuid: characteristic.uuid, descriptors: {}, properties: characteristic.properties};
		}

		function addDescriptor(descriptor, characteristic) {
			if (characteristic.descriptors[descriptor.uuid] !== undefined) {
				return;
			}
			characteristic.descriptors[descriptor.uuid] = {uuid : descriptor.uuid};
		}

		function addDescriptor(descriptor, characteristic) {
			if (characteristic.descriptors[descriptor.uuid] !== undefined) {
				return;
			}
			characteristic.descriptors[descriptor.uuid] = {uuid : descriptor.uuid};
		}

		
	})

	.controller('blueServiceCtrl', function($scope, $rootScope, $stateParams, $cordovaBluetoothLE) {
		$scope.errors_l = [];
		$scope.errors_l.push($stateParams.service);
		$scope.$on("$ionicView.beforeEnter", function () {
			$rootScope.selectedService = $rootScope.selectedDevice.services[$stateParams.service];
		})

		$scope.clean = function(){
			$scope.errors_l = [];
		};

	})

	.controller('blueCharactCtrl', function($scope, $rootScope, $stateParams, $cordovaBluetoothLE) {
		$scope.errors_l = [];
		$scope.errors_l.push($stateParams.characteristic);
		$scope.$on("$ionicView.beforeEnter", function () {
			$scope.selectedCharacteristic = $rootScope.selectedService.characteristics[$stateParams.characteristic];
		});

		$rootScope.read = function(address, service, characteristic) {
			var params = {address:address, service:service, characteristic:characteristic, timeout:2000};

			console.log("Read : " + JSON.stringify(params));
			$scope.errors_l.push("Read : " + JSON.stringify(params));

			$cordovaBluetoothLE.read(params).then(function(obj) {
				console.log("Read Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Read Success : " + JSON.stringify(obj));

				var bytes = $cordovaBluetoothLE.encodedStringToBytes(obj.value);
				console.log("Read : " + bytes[0]);
				$scope.errors_l.push("Read : " + bytes[0]);
			}, function(obj) {
				console.log("Read Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Read Error : " + JSON.stringify(obj));
			});
		};

		$scope.msg = {message:''};
		$scope.write_ble = function(address, service, characteristic){
			$scope.bytes = bluetoothle.stringToBytes($scope.msg.message);
			$scope.encodedString = bluetoothle.bytesToEncodedString($scope.bytes);
			$rootScope.write(address, service, characteristic, $scope.encodedString);
			$scope.msg.message = "";
		};

		$rootScope.write =function(address, service, characteristic, value) {;
			var params = {address:address, service:service, characteristic:characteristic, value:value, timeout: 2000};


			console.log("Write : " + JSON.stringify(params));
			$scope.errors_l.push("Write : " + JSON.stringify(params));

			$cordovaBluetoothLE.write(params).then(function(obj) {
				console.log("Write Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Write Success : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Write Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Write Error : " + JSON.stringify(obj));
			});
		};

		$rootScope.writeDescriptor = function(address, service, characteristic, descriptor, value) {
			var params = {address:address, service:service, characteristic:characteristic, descriptor:descriptor, value:value, timeout: 2000};

			console.log("Write Descriptor : " + JSON.stringify(params));
			$scope.errors_l.push("Write Descriptor : " + JSON.stringify(params));

			$cordovaBluetoothLE.writeDescriptor(params).then(function(obj) {
				console.log("Write Descriptor Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Write Descriptor Success : " + JSON.stringify(obj));
			}, function(obj) {
				console.log("Write Descriptor Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Write Descriptor Error : " + JSON.stringify(obj));
			});
		};
		
		$rootScope.readDescriptor = function(address, service, characteristic, descriptor) {
			var params = {address:address, service:service, characteristic:characteristic, descriptor:descriptor, timeout: 2000};

			console.log("Read Descriptor : " + JSON.stringify(params));
			$scope.errors_l.push("Read Descriptor : " + JSON.stringify(params));

			$cordovaBluetoothLE.readDescriptor(params).then(function(obj) {
				console.log("Read Descriptor Success : " + JSON.stringify(obj));
				$scope.errors_l.push("Read Descriptor Success : " + JSON.stringify(obj));
				var bytes = $cordovaBluetoothLE.encodedStringToBytes(obj.value);
				console.log("Read : " + bytes[0]);
				$scope.errors_l.push("Read : " + $cordovaBluetoothLE.bytesToString(bytes));
			}, function(obj) {
				console.log("Read Descriptor Error : " + JSON.stringify(obj));
				$scope.errors_l.push("Read Descriptor Error : " + JSON.stringify(obj));
			});
		};


		$scope.clean = function(){
			$scope.errors_l = [];
		};


	})
