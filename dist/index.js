(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-bootstrap/lib/FormControl"), require("classnames"), require("fbjs/lib/shallowEqual"), require("react-bootstrap-date-picker"), require("react-bootstrap/lib/Button"), require("react-bootstrap/lib/Radio"), require("react-select"), require("react-select/lib/Value"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-bootstrap/lib/FormControl", "classnames", "fbjs/lib/shallowEqual", "react-bootstrap-date-picker", "react-bootstrap/lib/Button", "react-bootstrap/lib/Radio", "react-select", "react-select/lib/Value"], factory);
	else if(typeof exports === 'object')
		exports["ReactPowerTable"] = factory(require("react"), require("react-bootstrap/lib/FormControl"), require("classnames"), require("fbjs/lib/shallowEqual"), require("react-bootstrap-date-picker"), require("react-bootstrap/lib/Button"), require("react-bootstrap/lib/Radio"), require("react-select"), require("react-select/lib/Value"));
	else
		root["ReactPowerTable"] = factory(root["react"], root["react-bootstrap/lib/FormControl"], root["classnames"], root["fbjs/lib/shallowEqual"], root["react-bootstrap-date-picker"], root["react-bootstrap/lib/Button"], root["react-bootstrap/lib/Radio"], root["react-select"], root["react-select/lib/Value"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdateReactPowerTable"];
/******/ 	this["webpackHotUpdateReactPowerTable"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "37b650598af4c0952d41"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/index.ts")(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ReactPowerTable.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__("./src/utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Column__ = __webpack_require__("./src/components/Column.tsx");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ReactPowerTable; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};



var ReactPowerTable = function (_React$Component) {
    _inherits(ReactPowerTable, _React$Component);

    function ReactPowerTable(props) {
        _classCallCheck(this, ReactPowerTable);

        var _this = _possibleConstructorReturn(this, (ReactPowerTable.__proto__ || Object.getPrototypeOf(ReactPowerTable)).call(this, props));

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('constructor', props);
        _this.transformProps(props);
        return _this;
    }

    _createClass(ReactPowerTable, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('componentWillReceiveProps', nextProps);
            this.transformProps(nextProps, this.props);
        }
    }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            var result = !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* shallowEqual */])(this.props, nextProps);
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('shouldComponentUpdate returned ' + result);
            return result;
        }
    }, {
        key: 'transformProps',
        value: function transformProps(newProps, oldProps) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('transformProps', { newProps: newProps, oldProps: oldProps });
            if (!oldProps || !__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["c" /* shallowEqual */])(newProps.columns, oldProps.columns)) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('transforming columns', newProps.columns);
                this.columns = newProps.columns.map(function (c) {
                    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__components_Column__["b" /* transformColumn */])(c, newProps);
                });
            }
            if (!oldProps || newProps.rowProps != oldProps.rowProps) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('transforming getRowProps');
                this.getRowProps = typeof newProps.rowProps == 'function' ? newProps.rowProps : function () {
                    return newProps.rowProps;
                };
            }
            if (!oldProps || newProps.keyColumn != oldProps.keyColumn) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('transforming getRowKey');
                this.getRowKey = typeof newProps.keyColumn == 'function' ? newProps.keyColumn : function (row) {
                    return row[newProps.keyColumn];
                };
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var _props = this.props,
                tableProps = _props.tableProps,
                footerComponent = _props.footerComponent,
                rows = _props.rows;

            var columns = this.columns;
            //const HeaderRowComponent = headerRowComponent || HeaderRow;
            var FooterComponent = footerComponent;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("table", Object.assign({}, tableProps), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("thead", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](HeaderRow, { columns: columns })), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tbody", null, rows.map(function (row) {
                var rowProps = _this2.getRowProps(row);
                var key = _this2.getRowKey(row);
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('DataRow map');
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](DataRow, { key: key, columns: columns, rowProps: rowProps, row: row });
            })), FooterComponent && __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](FooterComponent, null));
        }
    }]);

    return ReactPowerTable;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
ReactPowerTable.defaultProps = {};

var HeaderRow = function (_React$Component2) {
    _inherits(HeaderRow, _React$Component2);

    function HeaderRow(props) {
        _classCallCheck(this, HeaderRow);

        var _this3 = _possibleConstructorReturn(this, (HeaderRow.__proto__ || Object.getPrototypeOf(HeaderRow)).call(this, props));

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('HeaderRowComponent constructor');
        return _this3;
    }

    _createClass(HeaderRow, [{
        key: 'render',
        value: function render() {
            var columns = this.props.columns;

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('HeaderRowComponent render', this.props);
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", null, columns.map(function (c) {
                var headerProps = Object.assign({}, c.headerCellProps);
                headerProps.style = Object.assign({ textAlign: 'left', whiteSpace: 'nowrap' }, headerProps.style);
                var HeaderComponent = c.headerComponent;
                var headerComponentProps = c.headerComponentPropsProvider && c.headerComponentPropsProvider({ column: c }) || { column: c };
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("th", Object.assign({ key: c.key }, headerProps), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](HeaderComponent, Object.assign({}, headerComponentProps)));
            }));
        }
    }]);

    return HeaderRow;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

var DataRow = function (_React$PureComponent) {
    _inherits(DataRow, _React$PureComponent);

    function DataRow(props) {
        _classCallCheck(this, DataRow);

        var _this4 = _possibleConstructorReturn(this, (DataRow.__proto__ || Object.getPrototypeOf(DataRow)).call(this, props));

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('DataRowComponent constructor');
        return _this4;
    }

    _createClass(DataRow, [{
        key: 'render',
        value: function render() {
            var _a = this.props,
                row = _a.row,
                columns = _a.columns,
                rowProps = _a.rowProps,
                extra = __rest(_a, ["row", "columns", "rowProps"]);
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('DataRowComponent render', this.props);
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", Object.assign({}, rowProps), columns.map(function (col) {
                var CellComponent = col.cellComponent;
                var value = col.formatter ? col.formatter(col.field(row), row) : col.field(row);
                var rowValueProps = Object.assign({ row: row, column: col, value: value }, extra);
                var cellProps = col.cellProps(rowValueProps);
                var cellComponentProps = col.cellComponentProps(rowValueProps);
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", Object.assign({ key: col.key }, cellProps), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](CellComponent, Object.assign({}, cellComponentProps)));
            }));
        }
    }]);

    return DataRow;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

/***/ }),

/***/ "./src/components/Column.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__("./src/utils.ts");
/* unused harmony export defaultHeaderComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return defaultCellComponent; });
/* harmony export (immutable) */ __webpack_exports__["b"] = transformColumn;


var defaultHeaderComponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* makePure */])(function (props) {
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, props.column.headerText);
});
var defaultCellComponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* makePure */])(function (props) {
    //log('Render cellComponent column: ' + props.column.key + ' value: ' + props.value);
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, props.value);
});
function transformColumn(options, gridProps) {
    if (typeof options === 'string') {
        options = { field: options };
    }
    //const { key, field } = getKeyAndField(options);
    var core = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* getColumnCore */])(options);

    var _getCellAndHeaderProp = getCellAndHeaderProps(options),
        cellProps = _getCellAndHeaderProp.cellProps,
        headerProps = _getCellAndHeaderProp.headerProps;

    var result = Object.assign({ __transformed: true }, options, core, { headerText: options.headerText || core.fieldName, cellProps: cellProps, headerCellProps: headerProps, formatter: options.formatter || null });
    if (options.cellComponent) {
        result.cellComponent = options.cellComponent;
        result.cellComponentProps = options.cellComponentProps || function (props) {
            return props;
        };
    } else {
        result.cellComponent = defaultCellComponent;
        result.cellComponentProps = options.cellComponentProps || function (props) {
            return { column: props.column, value: props.value };
        };
    }
    result.headerComponent = options.headerComponent || gridProps.defaultHeaderComponent || defaultHeaderComponent;
    return result;
}
function getCellAndHeaderProps(options) {
    var cssClass = options.cssClass;
    var headerProps = Object.assign({}, options.headerCellProps);
    var cellProps = void 0;
    var cellStaticProps = typeof options.cellProps === 'function' ? {} : Object.assign({}, options.cellProps);
    var cellPropsFunc = typeof options.cellProps === 'function' ? options.cellProps : function () {
        return null;
    };
    //var cssClassFunc: (row: T) => string;
    if (options.width) {
        cellStaticProps.style = Object.assign({}, cellStaticProps.style, { width: options.width });
        headerProps.style = Object.assign({}, headerProps.style, { width: options.width });
    }
    if (options.maxWidth) {
        cellStaticProps.style = Object.assign({}, cellStaticProps.style, { maxWidth: options.maxWidth });
        headerProps.style = Object.assign({}, headerProps.style, { maxWidth: options.maxWidth });
    }
    if (typeof cssClass === 'function') {
        cellProps = function cellProps(row) {
            return Object.assign({}, cellStaticProps, cellPropsFunc(row), { className: cssClass(row) });
        };
    } else if (typeof cssClass === "string") {
        cellStaticProps.className = cssClass;
        cellProps = function cellProps(row) {
            return Object.assign({}, cellStaticProps, cellPropsFunc(row));
        };
    } else {
        cellProps = function cellProps(row) {
            return Object.assign({}, cellStaticProps, cellPropsFunc(row));
        };
    }
    if (options.headerCssClass) {
        headerProps.className = options.headerCssClass;
    }
    if (options.textAlign) {
        cellStaticProps.style = Object.assign({}, cellStaticProps.style, { textAlign: options.textAlign });
        headerProps.style = Object.assign({}, headerProps.style, { textAlign: options.textAlign });
    }
    return { cellProps: cellProps, headerProps: headerProps };
}

/***/ }),

/***/ "./src/components/CustomSelectValue.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_select_lib_Value__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_select_lib_Value___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_select_lib_Value__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_classnames__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomSelectValue; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var CustomSelectValue = function (_SelectValue) {
    _inherits(CustomSelectValue, _SelectValue);

    function CustomSelectValue() {
        _classCallCheck(this, CustomSelectValue);

        return _possibleConstructorReturn(this, (CustomSelectValue.__proto__ || Object.getPrototypeOf(CustomSelectValue)).apply(this, arguments));
    }

    _createClass(CustomSelectValue, [{
        key: 'render',
        value: function render() {
            var t = this;
            var props = this.props;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: __WEBPACK_IMPORTED_MODULE_2_classnames__('Select-value', props.value.className), style: props.value.style, title: props.value.title }, t.renderLabel(), t.renderRemoveIcon());
        }
    }]);

    return CustomSelectValue;
}(__WEBPACK_IMPORTED_MODULE_1_react_select_lib_Value___default.a);

/***/ }),

/***/ "./src/components/NumericInput.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NumericInput; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var NumericInput = function (_React$Component) {
    _inherits(NumericInput, _React$Component);

    function NumericInput(props) {
        _classCallCheck(this, NumericInput);

        var _this = _possibleConstructorReturn(this, (NumericInput.__proto__ || Object.getPrototypeOf(NumericInput)).call(this, props));

        var initialValue = props.initialValue;
        _this.state = { value: initialValue };
        _this.onChange = _this.onChange.bind(_this);
        _this.onKeyPress = _this.onKeyPress.bind(_this);
        return _this;
    }

    _createClass(NumericInput, [{
        key: "isValid",
        value: function isValid() {
            return !isNaN(parseInt(this.state.value));
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.initialValue != this.props.initialValue) {
                this.setState({ value: nextProps.initialValue });
            }
        }
    }, {
        key: "onChange",
        value: function onChange(e) {
            var ivalue = parseInt(e.currentTarget.value);
            var isValid = !isNaN(ivalue);
            if (isValid) {
                this.props.onValueChange(ivalue);
            }
            this.setState({ value: e.currentTarget.value });
        }
    }, {
        key: "onKeyPress",
        value: function onKeyPress(evt) {
            //console.log('onKeyPress which: ' + evt.which, evt);
            this.props.onKeyPress && this.props.onKeyPress(evt);
            if (evt.metaKey || evt.which <= 0 || evt.which == 8 || evt.which == 45 || evt.which >= 48 && evt.which <= 57 || evt.which == 46 && this.props.allowDecimal) {} else {
                evt.preventDefault();
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _a = this.props,
                initialValue = _a.initialValue,
                onValueChange = _a.onValueChange,
                allowDecimal = _a.allowDecimal,
                rest = __rest(_a, ["initialValue", "onValueChange", "allowDecimal"]);
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: this.isValid() ? null : 'has-error' }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("input", Object.assign({ type: "text" }, rest, { value: this.state.value, onKeyPress: this.onKeyPress, onChange: this.onChange })));
        }
    }]);

    return NumericInput;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/***/ }),

/***/ "./src/components/Paging.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NumericInput__ = __webpack_require__("./src/components/NumericInput.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils__ = __webpack_require__("./src/utils.ts");
/* harmony export (immutable) */ __webpack_exports__["a"] = withInternalPaging;
/* harmony export (immutable) */ __webpack_exports__["b"] = withPaging;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return Paging; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};



var linkStyle = { textDecoration: 'none' };
var disabledStyle = Object.assign({}, linkStyle, { color: 'silver', cursor: 'default' });
function withInternalPaging(WrappedComponent) {
    if (WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalSorting|WithSorting/)) {
        console.error('Warning: You are applying sorting after paging which will cause the sorting to only affect the current page. You should probably apply sorting first then paging');
    }
    return _a = function (_React$Component) {
        _inherits(_a, _React$Component);

        function _a(props) {
            _classCallCheck(this, _a);

            //log('withInternalPaging constructor', props);
            var _this = _possibleConstructorReturn(this, (_a.__proto__ || Object.getPrototypeOf(_a)).call(this, props));

            _this.state = { currentPage: props.paging && props.paging.currentPage || 1, pageSize: props.paging && props.paging.pageSize || 20 };
            _this.gotoPage = _this.gotoPage.bind(_this);
            return _this;
        }

        _createClass(_a, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* debuglog */])('Paging componentWillReceiveProps', nextProps);
                if (nextProps.paging && nextProps.paging.currentPage && nextProps.paging.currentPage != this.state.currentPage) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* debuglog */])('Paging setting state currentPage to ' + nextProps.paging.currentPage);
                    this.setState({ currentPage: nextProps.paging.currentPage });
                }
                if (nextProps.paging && nextProps.paging.pageSize && nextProps.paging.pageSize != this.state.pageSize) {
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* debuglog */])('Paging setting state pageSize to ' + nextProps.paging.pageSize);
                    this.setState({ pageSize: nextProps.paging.pageSize });
                }
            }
        }, {
            key: 'gotoPage',
            value: function gotoPage(currentPage, pageSize) {
                if (pageSize) {
                    this.setState({
                        currentPage: currentPage,
                        pageSize: pageSize
                    });
                } else {
                    this.setState({
                        currentPage: currentPage
                    });
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _a = this.props,
                    paging = _a.paging,
                    rows = _a.rows,
                    extra = __rest(_a, ["paging", "rows"]);var _state = this.state,
                    currentPage = _state.currentPage,
                    pageSize = _state.pageSize;

                var skip = (currentPage - 1) * pageSize;
                var pageRows = rows.slice(skip, skip + pageSize);
                var pageSizes = paging && paging.pageSizes;
                var columnCount = this.props.columns.length;
                var pagingProps = { currentPage: currentPage, pageSize: pageSize, pageSizes: pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length };
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["d" /* debuglog */])('Paging render() currentPage is ' + currentPage);
                //return <PagingComponent rows={pageRows} {...extra} paging={{ currentPage: currentPage, pageSize: pageSize, pageSizes: pageSizes, gotoPage: this.gotoPage, totalRowCount: rows.length }} />
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](WrappedComponent, Object.assign({ rows: pageRows }, extra, { footerComponent: function footerComponent() {
                        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tfoot", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { colSpan: columnCount }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Paging, Object.assign({}, pagingProps)))));
                    } }));
            }
        }]);

        return _a;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]), _a.displayName = 'WithInternalPaging(' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["g" /* getComponentDisplayName */])(WrappedComponent) + ')', _a;
    var _a;
}
function withPaging(WrappedComponent) {
    var WithPaging = function WithPaging(props) {
        var _a = props,
            paging = _a.paging,
            extra = __rest(_a, ["paging"]);
        var columnCount = props.columns.length;
        //const pagingProps = { ...paging };
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](WrappedComponent, Object.assign({}, extra, { footerComponent: function footerComponent() {
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tfoot", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { colSpan: columnCount }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](Paging, Object.assign({}, paging)))));
            } }));
    };
    WithPaging.displayName = 'WithPaging(' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["g" /* getComponentDisplayName */])(WrappedComponent) + ')';
    return WithPaging;
}
var Paging = function (_React$PureComponent) {
    _inherits(Paging, _React$PureComponent);

    function Paging() {
        _classCallCheck(this, Paging);

        return _possibleConstructorReturn(this, (Paging.__proto__ || Object.getPrototypeOf(Paging)).apply(this, arguments));
    }

    _createClass(Paging, [{
        key: 'gotoPage',
        value: function gotoPage(page) {
            if (page >= 1 && page <= this.pageCount && page != this.props.currentPage) {
                this.props.gotoPage(page);
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var props = this.props;
            var pageSizes = props.pageSizes || [10, 20, 50, 100, 500];
            var pageSize = props.pageSize || 20;
            if (pageSizes.indexOf(pageSize) == -1) {
                pageSizes = [].concat(_toConsumableArray(pageSizes), [pageSize]);
                pageSizes.sort(function (a, b) {
                    return b - a;
                });
            }
            var pageCount = this.pageCount;
            var currentPage = props.currentPage;
            var backStyle = currentPage == 1 ? disabledStyle : linkStyle;
            var forwardStyle = currentPage == pageCount ? disabledStyle : linkStyle;
            if (typeof props.totalRowCount === 'undefined') {
                return null;
            }
            var rowCount = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* numberWithCommas */])(props.totalRowCount) + ' Records';
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("table", { width: "100%", className: "form-inline" }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tbody", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { width: "33%", style: { fontWeight: 'bold' } }, rowCount), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { width: "34%", style: { textAlign: 'center' } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", className: "glyphicon glyphicon-fast-backward", style: backStyle, onClick: function onClick(e) {
                    e.preventDefault();_this3.gotoPage(1);
                } }), '\xA0', __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", className: "glyphicon glyphicon-backward", style: backStyle, onClick: function onClick(e) {
                    e.preventDefault();_this3.gotoPage(currentPage - 1);
                } }), '\xA0', __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", null, 'Page \xA0', __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__NumericInput__["a" /* NumericInput */], { className: "form-control input-sm", style: { width: 60 }, initialValue: currentPage, onValueChange: function onValueChange(v) {
                    return _this3.gotoPage(v);
                } }), '\xA0 of ', __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__utils__["b" /* numberWithCommas */])(pageCount)), '\xA0', __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", className: "glyphicon glyphicon-forward", style: forwardStyle, onClick: function onClick(e) {
                    e.preventDefault();_this3.gotoPage(currentPage + 1);
                } }), '\xA0', __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", className: "glyphicon glyphicon-fast-forward", style: forwardStyle, onClick: function onClick(e) {
                    e.preventDefault();_this3.gotoPage(pageCount);
                } })), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { width: "33%", style: { textAlign: 'right' } }, "Show:", __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("select", { className: "form-control input-sm", style: { width: 80 }, value: pageSize, onChange: function onChange(e) {
                    return props.gotoPage(1, parseInt(e.currentTarget.value));
                } }, pageSizes.map(function (m) {
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("option", { key: m, value: m }, m);
            }))))));
        }
    }, {
        key: 'pageCount',
        get: function get() {
            var pageSize = this.props.pageSize || 20;
            return Math.ceil(this.props.totalRowCount / pageSize);
        }
    }]);

    return Paging;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

/***/ }),

/***/ "./src/components/Sorting.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__("./src/utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Column__ = __webpack_require__("./src/components/Column.tsx");
/* harmony export (immutable) */ __webpack_exports__["a"] = withInternalSorting;
/* harmony export (immutable) */ __webpack_exports__["b"] = withSorting;
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

//import { Paging, PagingProps } from './components/Paging';


var sortableHeaderComponent = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["h" /* makePure */])(function (props) {
    var col = props.column;
    //console.log('sortableHeaderComponent render', props);
    if (props.sorting) {
        var sortComponent = props.sortAsc ? col.sortAscComponent || defaultSortAscComponent : col.sortDescComponent || defaultSortDescComponent;
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { paddingRight: 15, position: 'relative' } }, col.headerText, " ", sortComponent);
    }
    var divStyle = col.headerCellProps.style && col.headerCellProps.style.textAlign == 'right' ? { paddingRight: 15 } : null;
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: divStyle }, col.headerText);
});
function transformColumn(options, changeSort, getCurrentSort) {
    var col = typeof options == 'string' ? { field: options } : Object.assign({}, options);
    col.sortable = col.sortable || col.sortable == undefined;
    if (!col.sortable) {
        return col;
    }
    if (typeof col.sortExpression === 'function') {
        col.sortKey = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["f" /* getExpression */])(col.sortExpression);
        col.sortExpression = col.sortExpression;
    } else if (typeof col.sortExpression === "string") {
        var sortField = col.sortExpression;
        col.sortExpression = function (row) {
            return row[sortField];
        };
        col.sortKey = sortField;
    } else {
        var core = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["e" /* getColumnCore */])(options);
        col.sortKey = core.key.toString();
        col.sortExpression = core.field;
    }
    var headerProps = Object.assign({}, col.headerCellProps, { onClick: function onClick() {
            var sorting = getCurrentSort();
            changeSort({ Column: col.sortKey, Ascending: sorting.Column != col.sortKey || !sorting.Ascending });
        } });
    headerProps.style = Object.assign({}, headerProps.style, { cursor: 'pointer' });
    col.headerCellProps = headerProps;
    col.headerComponentPropsProvider = function (props) {
        var currentSort = getCurrentSort();
        var sorting = col.sortKey == currentSort.Column;
        var sortAsc = sorting && currentSort.Ascending;
        return Object.assign({}, props, { sorting: sorting, sortAsc: sortAsc });
    };
    col.headerComponent = sortableHeaderComponent;
    var cellProps = col.cellProps;

    if (col.textAlign == 'right' || cellProps && typeof cellProps != 'function' && cellProps.style && cellProps.style.textAlign == 'right') {
        //this is needed to pad right-aligned cells so they line up with header text right side and don't appear under the sort icon
        var CellComponent = col.cellComponent || __WEBPACK_IMPORTED_MODULE_2__Column__["a" /* defaultCellComponent */];
        col.cellComponent = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](SortableCellComponentWrapper, null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](CellComponent, Object.assign({}, props)));
        };
    }
    return col;
}
function withInternalSorting(WrappedComponent) {
    var WrappedPagingComponent = WrappedComponent.displayName && WrappedComponent.displayName.match(/^WithInternalPaging/) && WrappedComponent;
    return _a = function (_React$Component) {
        _inherits(_a, _React$Component);

        function _a(props) {
            _classCallCheck(this, _a);

            var _this = _possibleConstructorReturn(this, (_a.__proto__ || Object.getPrototypeOf(_a)).call(this, props));

            var sorting = props.sorting;

            var currentSort = __rest(sorting, []);
            _this.changeSort = _this.changeSort.bind(_this);
            _this.columns = props.columns.map(function (c) {
                return transformColumn(c, _this.changeSort, function () {
                    return _this.state.currentSort;
                });
            });
            var sortedRows = _this.performSort(props.rows, sorting);
            _this.state = {
                sortedRows: sortedRows, currentSort: currentSort
            };
            return _this;
        }

        _createClass(_a, [{
            key: 'componentWillReceiveProps',
            value: function componentWillReceiveProps(nextProps) {
                var _this2 = this;

                if (this.props.rows != nextProps.rows) {
                    this.setState(function (prev) {
                        return {
                            sortedRows: _this2.performSort(nextProps.rows, prev.currentSort)
                        };
                    });
                }
            }
        }, {
            key: 'performSort',
            value: function performSort(rows, sort) {
                var sortCol = this.columns.find(function (m) {
                    return m.sortKey == sort.Column;
                });
                if (!sortCol) {
                    throw new Error('Could not find a column with sortKey=' + sort.Column);
                }
                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["i" /* sortArray */])(rows, sortCol.sortExpression, { descending: !sort.Ascending, caseInsensitive: true });
            }
        }, {
            key: 'changeSort',
            value: function changeSort(sort) {
                var _this3 = this;

                var _props$sorting = this.props.sorting,
                    onSortChanging = _props$sorting.onSortChanging,
                    onSortChanged = _props$sorting.onSortChanged;

                if (onSortChanging) {
                    onSortChanging(sort);
                }
                var callback = onSortChanged && function () {
                    return onSortChanged(sort);
                };
                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('changeSort', sort);
                this.sortChangedSinceLastRender = true;
                this.setState(function (prev) {
                    return {
                        sortedRows: _this3.performSort(prev.sortedRows, sort),
                        currentSort: sort
                    };
                }, callback);
            }
        }, {
            key: 'render',
            value: function render() {
                var _a = this.props,
                    sorting = _a.sorting,
                    columns = _a.columns,
                    rows = _a.rows,
                    extra = __rest(_a, ["sorting", "columns", "rows"]);
                //console.log('withInternalSorting render()', this.currentSort);
                if (this.sortChangedSinceLastRender) {
                    this.sortChangedSinceLastRender = false;
                    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('sortChangedSinceLastRender');
                    if (WrappedPagingComponent) {
                        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["d" /* debuglog */])('sortChangedSinceLastRender wrapped with paging component, so setting currentPage to 1');
                        var paging = extra.paging;

                        var pagingProps = Object.assign({}, paging, { currentPage: 1 });
                        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](WrappedPagingComponent, Object.assign({}, extra, { columns: this.columns, paging: pagingProps, rows: this.sortedRows }));
                    }
                }
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](WrappedComponent, Object.assign({}, extra, { columns: this.columns, rows: this.sortedRows }));
            }
        }, {
            key: 'currentSort',
            get: function get() {
                return this.state.currentSort || this.props.sorting;
            }
        }, {
            key: 'sortedRows',
            get: function get() {
                return this.state.sortedRows || this.props.rows;
            }
        }]);

        return _a;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]), _a.displayName = 'WithInternalSorting(' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* getComponentDisplayName */])(WrappedComponent) + ')', _a;
    var _a;
}
function withSorting(WrappedComponent) {
    return _a = function (_React$Component2) {
        _inherits(_a, _React$Component2);

        function _a(props) {
            _classCallCheck(this, _a);

            var _this4 = _possibleConstructorReturn(this, (_a.__proto__ || Object.getPrototypeOf(_a)).call(this, props));

            _this4.columns = props.columns.map(function (c) {
                return transformColumn(c, _this4.props.sorting.changeSort, function () {
                    return { Column: _this4.props.sorting.Column, Ascending: _this4.props.sorting.Ascending };
                });
            });
            return _this4;
        }

        _createClass(_a, [{
            key: 'render',
            value: function render() {
                var _a = this.props,
                    sorting = _a.sorting,
                    extra = __rest(_a, ["sorting"]);
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](WrappedComponent, Object.assign({}, extra, { columns: this.columns }));
            }
        }]);

        return _a;
    }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]), _a.displayName = 'WithSorting(' + __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__utils__["g" /* getComponentDisplayName */])(WrappedComponent) + ')', _a;
    var _a;
}
var sortableCellComponentWrapperStyle = { marginRight: 15 };
var SortableCellComponentWrapper = function SortableCellComponentWrapper(props) {
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: sortableCellComponentWrapperStyle }, props.children);
};
var defaultSortAscComponent = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { style: {
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: '5px solid gray',
        position: 'absolute',
        top: 'calc(50% - 3px)',
        marginLeft: 5
    } });
var defaultSortDescComponent = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { style: {
        width: 0,
        height: 0,
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid gray',
        position: 'absolute',
        top: 'calc(50% - 3px)',
        marginLeft: 5
    } });

/***/ }),

/***/ "./src/filters/AddEditFilter.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap_lib_Radio__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap_lib_Radio___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_bootstrap_lib_Radio__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_Button__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_Button___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_Button__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__("./src/utils.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AddEditFilter; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var AddEditFilter = function (_React$PureComponent) {
    _inherits(AddEditFilter, _React$PureComponent);

    function AddEditFilter(props) {
        _classCallCheck(this, AddEditFilter);

        var _this = _possibleConstructorReturn(this, (AddEditFilter.__proto__ || Object.getPrototypeOf(AddEditFilter)).call(this, props));

        var value = props.initialValue || props.filter.defaultValue || '';
        _this.state = { value: value, operation: props.initialOperation };
        _this.selectedOperationChange = _this.selectedOperationChange.bind(_this);
        _this.handleFilterValueChange = _this.handleFilterValueChange.bind(_this);
        _this.applyFilter = _this.applyFilter.bind(_this);
        return _this;
    }

    _createClass(AddEditFilter, [{
        key: 'selectedOperationChange',
        value: function selectedOperationChange(e) {
            var prevOperation = this.state.operation;
            var operationKey = e.currentTarget.value;
            var operation = this.props.filter.operations[operationKey];
            var newState = { operation: operation };
            if (prevOperation.key == 'between' && operation.key != prevOperation.key && typeof this.state.value === 'string') {
                newState.value = this.state.value.split(' ')[0];
            }
            this.setState(newState);
        }
    }, {
        key: 'handleFilterValueChange',
        value: function handleFilterValueChange(value) {
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["d" /* debuglog */])('AddEditFilter.filterValueChange', value);
            this.setState({
                value: value
            });
        }
    }, {
        key: 'applyFilter',
        value: function applyFilter() {
            this.props.onApplyFilter({ filter: this.props.filter, operation: this.state.operation, value: this.state.value });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__utils__["d" /* debuglog */])('AddEditFilter.render', this.props);
            var filter = this.props.filter;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { margin: '10px 0' } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("b", null, filter.displayName)), filter.operations.all.map(function (op) {
                var selectedFilterComponentProps = void 0;
                var SelectedFilterComponent = null;
                if (op.key == _this2.state.operation.key) {
                    selectedFilterComponentProps = {
                        filter: _this2.props.filter,
                        operation: op,
                        value: _this2.state.value,
                        onValueChange: _this2.handleFilterValueChange,
                        onEnterKeyPress: _this2.applyFilter
                    };
                    SelectedFilterComponent = op.filterComponent || filter.filterComponent;
                }
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { key: op.key }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_bootstrap_lib_Radio___default.a, { checked: op.key == _this2.state.operation.key, onChange: _this2.selectedOperationChange, value: op.key }, filter.radioButtonLabel ? filter.radioButtonLabel({
                    filter: _this2.props.filter,
                    operation: op
                }) : op.displayName), SelectedFilterComponent && __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { marginLeft: 20 } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](SelectedFilterComponent, Object.assign({}, selectedFilterComponentProps))));
            }), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { marginTop: 20 } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_Button___default.a, { bsStyle: "primary", bsSize: "sm", onClick: this.applyFilter }, "Apply Filter")));
        }
    }]);

    return AddEditFilter;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

/***/ }),

/***/ "./src/filters/DataTypes/Boolean.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Boolean; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var verbs = [['is', 'is not'], ['has', 'does not have'], ['had', 'did not have'], ['can', 'cannot'], ['will', 'will not'], ['was', 'was not']];
var Boolean = function (_FilterDefinition) {
    _inherits(Boolean, _FilterDefinition);

    function Boolean(options) {
        _classCallCheck(this, Boolean);

        var _this = _possibleConstructorReturn(this, (Boolean.__proto__ || Object.getPrototypeOf(Boolean)).call(this, options));

        _this.appliedFilterLabel = function (props) {
            return props.operation.displayName;
        };
        return _this;
    }

    _createClass(Boolean, [{
        key: 'getOperations',
        value: function getOperations() {
            var _this2 = this;

            var matchingVerb = verbs.find(function (m) {
                var name = _this2.displayName.toLowerCase();
                return m[0] == name || name.startsWith(m[0] + ' ');
            });
            var verb = matchingVerb || verbs[0];
            var displayName = matchingVerb ? this.displayName.substring(matchingVerb[0].length + 1) : this.displayName;
            var trueName = verb[0] + ' ' + displayName;
            var falseName = verb[1] + ' ' + displayName;
            return {
                'eq': { key: 'eq', displayName: trueName, test: function test(source) {
                        return source;
                    } },
                'ne': { key: 'ne', displayName: falseName, test: function test(source) {
                        return !source;
                    } }
            };
        }
    }]);

    return Boolean;
}(__WEBPACK_IMPORTED_MODULE_0__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/DataType.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__("./src/utils.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__defaultBetweenComponent__ = __webpack_require__("./src/filters/DataTypes/defaultBetweenComponent.tsx");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FilterDefinition; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var defaultOperations = function defaultOperations() {
    var result = {
        'eq': { key: 'eq', displayName: 'is equal to', test: function test(source, filterValue) {
                return source == filterValue;
            } },
        'ne': { key: 'ne', displayName: 'is not equal to', test: function test(source, filterValue) {
                return source == filterValue;
            } },
        'lt': { key: 'lt', displayName: 'is less than', test: function test(source, filterValue) {
                return source < filterValue;
            } },
        'gt': { key: 'gt', displayName: 'is greater than', test: function test(source, filterValue) {
                return source > filterValue;
            } },
        'between': { key: 'between', displayName: 'is between', filterComponent: __WEBPACK_IMPORTED_MODULE_1__defaultBetweenComponent__["a" /* BetweenFilterComponent */], appliedFilterLabel: __WEBPACK_IMPORTED_MODULE_1__defaultBetweenComponent__["b" /* BetweenAppliedFilterLabel */], test: function test(source, filterValue) {
                return source >= filterValue && source <= filterValue;
            } }
    };
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__utils__["m" /* createKeyedMap */])(result);
};
// export interface IFilterDefinition<T> extends FilterDefinitionOptions {
//     operations: KeyedMap<OperationDefinition<T>>;
//     radioButtonLabel: (props: RadioButtonLabelProps<T>) => React.ReactType;
//     filterComponent: (props: FilterComponentProps<T>) => JSX.Element;
//     defaultValue: T;
//     appliedFilterLabel?: (filter: AppliedFilter<T>) => string | Promise<string>;
//     applyFilter<TData>(data: TData[], field: string, operation: OperationDefinition<T>, value: T);
// }
var FilterDefinition = function () {
    function FilterDefinition(options) {
        _classCallCheck(this, FilterDefinition);

        this._defaultOperations = new __WEBPACK_IMPORTED_MODULE_0__utils__["n" /* Lazy */](defaultOperations);
        if (typeof options === 'string') {
            this.fieldName = options;
            this.displayName = options;
        } else {
            this.fieldName = options.fieldName;
            this.displayName = options.displayName || options.fieldName;
            this.canBeNull = options.canBeNull;
        }
        var operations = this.getOperations();
        if (this.canBeNull) {
            operations.notnull = {
                key: 'notnull',
                displayName: 'has a value',
                appliedFilterLabel: function appliedFilterLabel(filter) {
                    return filter.filter.displayName + ' ' + filter.operation.displayName;
                },
                filterComponent: function filterComponent() {
                    return null;
                },
                test: function test(source, _filterValue) {
                    return source != null && source != undefined && source != '';
                }
            };
            operations.null = {
                key: 'null',
                displayName: 'does not have a value',
                appliedFilterLabel: function appliedFilterLabel(filter) {
                    return filter.filter.displayName + ' ' + filter.operation.displayName;
                },
                filterComponent: function filterComponent() {
                    return null;
                },
                test: function test(source, _filterValue) {
                    return source == null || source == undefined || source == '';
                }
            };
        }
        operations.all = Object.keys(operations).filter(function (m) {
            return m != 'all';
        }).map(function (m) {
            return operations[m];
        });
        this.operations = operations;
    }

    _createClass(FilterDefinition, [{
        key: "applyFilter",
        value: function applyFilter(data, field, operation, filterValue) {
            var test = operation.test;

            var parsedValue = this.parseValue(filterValue);
            console.group('applyFilter ' + operation.displayName + ' ' + filterValue + ' parsedValue: ' + parsedValue);
            if (operation.key == 'between') {
                test = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__defaultBetweenComponent__["c" /* BetweenApplyFilterTest */])(this.parseValue, filterValue);
            }
            var result = data.filter(function (d) {
                var result = test(d[field], parsedValue);
                console.log('test ' + d[field] + ' returned ' + result);
                return result;
            });
            console.groupEnd();
            return result;
        }
    }, {
        key: "parseValue",
        value: function parseValue(str) {
            return str;
        }
    }, {
        key: "defaultOperations",
        get: function get() {
            return this._defaultOperations.value;
        }
    }], [{
        key: "defaultAppliedFilterLabel",
        value: function defaultAppliedFilterLabel(filter) {
            return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value;
        }
    }]);

    return FilterDefinition;
}();

/***/ }),

/***/ "./src/filters/DataTypes/Date.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_date_picker__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_date_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_date_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils__ = __webpack_require__("./src/utils.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Date; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};




var Date = function (_FilterDefinition) {
    _inherits(Date, _FilterDefinition);

    function Date(options) {
        _classCallCheck(this, Date);

        var _this = _possibleConstructorReturn(this, (Date.__proto__ || Object.getPrototypeOf(Date)).call(this, options));

        _this.filterComponent = function (props) {
            var value = props.value,
                onValueChange = props.onValueChange,
                filter = props.filter,
                operation = props.operation,
                rest = __rest(props, ["value", "onValueChange", "filter", "operation"]);

            var dateValue = value ? new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* GlobalDate */](value).toISOString() : '';
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_date_picker__, Object.assign({ value: dateValue, onChange: function onChange(_value, formattedValue) {
                    return props.onValueChange(formattedValue);
                }, showClearButton: false }, rest));
        };
        return _this;
    }

    _createClass(Date, [{
        key: "parseValue",
        value: function parseValue(str) {
            if (str) {
                var d = new __WEBPACK_IMPORTED_MODULE_3__utils__["a" /* GlobalDate */](str);
                if (!isNaN(d.getTime())) {
                    return d.toISOString();
                }
            }
            return '';
        }
    }, {
        key: "getOperations",
        value: function getOperations() {
            return {
                eq: this.defaultOperations.eq,
                lt: Object.assign({}, this.defaultOperations.lt, { displayName: 'is before' }),
                gt: Object.assign({}, this.defaultOperations.gt, { displayName: 'is after' }),
                between: this.defaultOperations.between
            };
        }
    }]);

    return Date;
}(__WEBPACK_IMPORTED_MODULE_1__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/Decimal.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_NumericInput__ = __webpack_require__("./src/components/NumericInput.tsx");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Decimal; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};



var Decimal = function (_FilterDefinition) {
    _inherits(Decimal, _FilterDefinition);

    function Decimal(options) {
        _classCallCheck(this, Decimal);

        var _this = _possibleConstructorReturn(this, (Decimal.__proto__ || Object.getPrototypeOf(Decimal)).call(this, options));

        _this.filterComponent = function (props) {
            var value = props.value,
                _onValueChange = props.onValueChange,
                filter = props.filter,
                operation = props.operation,
                onEnterKeyPress = props.onEnterKeyPress,
                rest = __rest(props, ["value", "onValueChange", "filter", "operation", "onEnterKeyPress"]);

            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__components_NumericInput__["a" /* NumericInput */], Object.assign({ type: "number", initialValue: value, onValueChange: function onValueChange(v) {
                    return _onValueChange(v);
                }, autoFocus: true, className: "form-control input-sm", onKeyPress: function onKeyPress(e) {
                    if (e.charCode == 13) onEnterKeyPress();
                } }, rest));
        };
        return _this;
    }

    _createClass(Decimal, [{
        key: "getOperations",
        value: function getOperations() {
            return this.defaultOperations;
        }
    }, {
        key: "parseValue",
        value: function parseValue(str) {
            return parseFloat(str);
        }
    }]);

    return Decimal;
}(__WEBPACK_IMPORTED_MODULE_1__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/Int.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_NumericInput__ = __webpack_require__("./src/components/NumericInput.tsx");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Int; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};



//const dataType = 'int';
var Int = function (_FilterDefinition) {
    _inherits(Int, _FilterDefinition);

    //static readonly dataType = dataType;
    function Int(options) {
        _classCallCheck(this, Int);

        var _this = _possibleConstructorReturn(this, (Int.__proto__ || Object.getPrototypeOf(Int)).call(this, options));

        _this.filterComponent = function (props) {
            var value = props.value,
                _onValueChange = props.onValueChange,
                filter = props.filter,
                operation = props.operation,
                onEnterKeyPress = props.onEnterKeyPress,
                rest = __rest(props, ["value", "onValueChange", "filter", "operation", "onEnterKeyPress"]);

            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2__components_NumericInput__["a" /* NumericInput */], Object.assign({ type: "number", initialValue: value, onValueChange: function onValueChange(v) {
                    return _onValueChange(v);
                }, autoFocus: true, className: "form-control input-sm", onKeyPress: function onKeyPress(e) {
                    if (e.charCode == 13) onEnterKeyPress();
                } }, rest));
        };
        return _this;
    }

    _createClass(Int, [{
        key: "getOperations",
        value: function getOperations() {
            return this.defaultOperations;
        }
    }, {
        key: "parseValue",
        value: function parseValue(str) {
            return parseInt(str);
        }
    }]);

    return Int;
}(__WEBPACK_IMPORTED_MODULE_1__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/List.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_select__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_select___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_select__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_CustomSelectValue__ = __webpack_require__("./src/components/CustomSelectValue.tsx");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return List; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





//const valueDelimiter = ';';
var List = function (_FilterDefinition) {
    _inherits(List, _FilterDefinition);

    function List(options, items) {
        _classCallCheck(this, List);

        var _this = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, options));

        _this.filterComponent = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_select__, { value: props.value ? props.value : [], multi: true, options: items, onChange: function onChange(e) {
                    return props.onValueChange(e.map(function (m) {
                        return m.value || m.label;
                    }));
                }, valueComponent: __WEBPACK_IMPORTED_MODULE_3__components_CustomSelectValue__["a" /* CustomSelectValue */], className: "small" });
        };
        //this.defaultFormat = (filter) => filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"'
        return _this;
    }

    _createClass(List, [{
        key: 'getOperations',
        value: function getOperations() {
            return {
                'in': {
                    key: 'in',
                    displayName: 'is any of',
                    test: function test(sourceValue, filterValue) {
                        return filterValue.indexOf(sourceValue) > -1;
                    },
                    appliedFilterLabel: function appliedFilterLabel(filter) {
                        return filter.filter.displayName + ' is ' + filter.value.join(' or ');
                    }
                }
            };
        }
    }]);

    return List;
}(__WEBPACK_IMPORTED_MODULE_1__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/String.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return String; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var String = function (_FilterDefinition) {
    _inherits(String, _FilterDefinition);

    function String(options) {
        _classCallCheck(this, String);

        var _this = _possibleConstructorReturn(this, (String.__proto__ || Object.getPrototypeOf(String)).call(this, options));

        _this.filterComponent = function (props) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl___default.a, { value: props.value, autoFocus: true, onChange: function onChange(e) {
                    return props.onValueChange(e.currentTarget.value);
                }, onKeyPress: function onKeyPress(e) {
                    if (e.charCode == 13) props.onEnterKeyPress();
                } });
        };
        _this.appliedFilterLabel = function (filter) {
            return filter.filter.displayName + ' ' + filter.operation.displayName + ' "' + filter.value + '"';
        };
        return _this;
    }

    _createClass(String, [{
        key: 'getOperations',
        value: function getOperations() {
            return {
                'contains': { key: 'contains', displayName: 'contains', test: function test(source, value) {
                        return source.indexOf && source.toLowerCase().indexOf(value) > -1;
                    } },
                'notcontains': { key: 'notcontains', displayName: 'does not contain', test: function test(source, value) {
                        return source.indexOf && source.toLowerCase().indexOf(value) == -1;
                    } },
                'eq': this.defaultOperations.eq,
                'ne': this.defaultOperations.ne
            };
        }
    }, {
        key: 'applyFilter',
        value: function applyFilter(data, field, operation, value) {
            var valueLower = value.toLowerCase();
            return _get(String.prototype.__proto__ || Object.getPrototypeOf(String.prototype), 'applyFilter', this).call(this, data, field, operation, valueLower);
        }
    }]);

    return String;
}(__WEBPACK_IMPORTED_MODULE_1__DataType__["a" /* FilterDefinition */]);

/***/ }),

/***/ "./src/filters/DataTypes/defaultBetweenComponent.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BetweenFilterComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return BetweenAppliedFilterLabel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return BetweenApplyFilterTest; });
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }return t;
};

var valueDelimiter = ' ';
var BetweenFilterComponent = function BetweenFilterComponent(props) {
    var value = props.value,
        _onValueChange = props.onValueChange,
        rest = __rest(props, ["value", "onValueChange"]);

    var values = value.toString().split(valueDelimiter);
    var min = values[0];
    var max = values.length >= 2 ? values[1] : '';
    var FilterComponent = props.filter.filterComponent;
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("table", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tbody", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("tr", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](FilterComponent, Object.assign({ value: min, onValueChange: function onValueChange(v) {
            return _onValueChange(v + valueDelimiter + max);
        }, placeholder: "min" }, rest))), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", { style: { padding: '0 5px' } }, "and"), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("td", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](FilterComponent, Object.assign({ value: max, onValueChange: function onValueChange(v) {
            return _onValueChange(min + valueDelimiter + v);
        }, placeholder: "max" }, rest, { autoFocus: false })))))));
};
var BetweenAppliedFilterLabel = function BetweenAppliedFilterLabel(filter) {
    return filter.filter.displayName + ' ' + filter.operation.displayName + ' ' + filter.value.toString().split(valueDelimiter).join(' and ');
};
var BetweenApplyFilterTest = function BetweenApplyFilterTest(parseValue, filterValue) {
    var values = filterValue.split(valueDelimiter);
    var min = parseValue(values[0]);
    var max = parseValue(values[1]);
    return function (source, _filterValue) {
        return source >= min && source <= max;
    };
};

/***/ }),

/***/ "./src/filters/DataTypes/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__String__ = __webpack_require__("./src/filters/DataTypes/String.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Boolean__ = __webpack_require__("./src/filters/DataTypes/Boolean.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Date__ = __webpack_require__("./src/filters/DataTypes/Date.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Decimal__ = __webpack_require__("./src/filters/DataTypes/Decimal.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Int__ = __webpack_require__("./src/filters/DataTypes/Int.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__List__ = __webpack_require__("./src/filters/DataTypes/List.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_6__DataType__["a"]; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DataTypes; });







var types = {
    'string': __WEBPACK_IMPORTED_MODULE_0__String__["a" /* String */],
    'boolean': __WEBPACK_IMPORTED_MODULE_1__Boolean__["a" /* Boolean */],
    'date': __WEBPACK_IMPORTED_MODULE_2__Date__["a" /* Date */],
    'decimal': __WEBPACK_IMPORTED_MODULE_3__Decimal__["a" /* Decimal */],
    'int': __WEBPACK_IMPORTED_MODULE_4__Int__["a" /* Int */],
    'list': __WEBPACK_IMPORTED_MODULE_5__List__["a" /* List */]
};
var DataTypes = types;

/***/ }),

/***/ "./src/filters/GridFilters.tsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__AddEditFilter__ = __webpack_require__("./src/filters/AddEditFilter.tsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__DataTypes_DataType__ = __webpack_require__("./src/filters/DataTypes/DataType.ts");
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GridFilters; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var BackLink = function BackLink(props) {
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { marginBottom: 10 } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: function onClick(e) {
            e.preventDefault();
            props.onClick();
        } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "glyphicon glyphicon-chevron-left", "aria-hidden": "true" }), "Back"));
};
var GridAppliedFilters = function GridAppliedFilters(props) {
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "small" }, props.appliedFilters.map(function (appliedFilter) {
        var formatFunc = appliedFilter.operation.appliedFilterLabel || appliedFilter.filter.appliedFilterLabel || __WEBPACK_IMPORTED_MODULE_3__DataTypes_DataType__["a" /* FilterDefinition */].defaultAppliedFilterLabel;
        var formatResult = formatFunc(appliedFilter);
        var displayText = void 0;
        if (typeof formatResult == 'string') {
            displayText = formatResult;
        } else {
            formatResult.then(function () {
                return props.onOptionLoaded();
            });
            displayText = 'Loading...';
        }
        return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "well well-sm", style: { marginBottom: 10 }, key: appliedFilter.filter.fieldName }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("button", { type: "button", className: "close", "aria-label": "Remove", onClick: function onClick() {
                return props.removeFilter(appliedFilter);
            } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { "aria-hidden": "true" }, '\xD7')), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: function onClick(e) {
                e.preventDefault();props.editFilter(appliedFilter);
            } }, displayText));
    }));
};
var GridFilters = function (_React$Component) {
    _inherits(GridFilters, _React$Component);

    function GridFilters(props) {
        _classCallCheck(this, GridFilters);

        var _this = _possibleConstructorReturn(this, (GridFilters.__proto__ || Object.getPrototypeOf(GridFilters)).call(this, props));

        _this.state = {};
        _this.hideAddFilter = _this.hideAddFilter.bind(_this);
        _this.applyNewfilter = _this.applyNewfilter.bind(_this);
        _this.removeFilter = _this.removeFilter.bind(_this);
        _this.editFilter = _this.editFilter.bind(_this);
        _this.cancelEditFilter = _this.cancelEditFilter.bind(_this);
        _this.applyEditFilter = _this.applyEditFilter.bind(_this);
        return _this;
    }

    _createClass(GridFilters, [{
        key: 'showAddFilter',
        value: function showAddFilter() {
            this.setState({
                addingFilter: true
            });
        }
    }, {
        key: 'hideAddFilter',
        value: function hideAddFilter() {
            this.setState({
                addingFilter: false
            });
        }
    }, {
        key: 'applyNewfilter',
        value: function applyNewfilter(filter) {
            var newFilters = [].concat(_toConsumableArray(this.props.appliedFilters), [filter]);
            this.props.onFiltersChange(newFilters);
            this.setState({
                addingFilter: false
            });
        }
    }, {
        key: 'removeFilter',
        value: function removeFilter(filter) {
            var newFilters = this.props.appliedFilters.filter(function (m) {
                return m.filter.fieldName != filter.filter.fieldName;
            });
            this.props.onFiltersChange(newFilters);
        }
    }, {
        key: 'editFilter',
        value: function editFilter(filter) {
            this.setState({
                editingFilter: filter,
                addingFilter: false
            });
        }
    }, {
        key: 'cancelEditFilter',
        value: function cancelEditFilter() {
            this.setState({
                editingFilter: null
            });
        }
    }, {
        key: 'applyEditFilter',
        value: function applyEditFilter(filter) {
            var newFilters = this.props.appliedFilters.map(function (m) {
                return m.filter.fieldName != filter.filter.fieldName ? m : filter;
            });
            this.props.onFiltersChange(newFilters);
            this.setState({
                editingFilter: null
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var editingFilter = this.state.editingFilter;
            var _props = this.props,
                availableFilters = _props.availableFilters,
                appliedFilters = _props.appliedFilters;

            if (editingFilter) {
                var filter = editingFilter.filter,
                    operation = editingFilter.operation,
                    value = editingFilter.value;

                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](BackLink, { onClick: this.cancelEditFilter }), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__AddEditFilter__["a" /* AddEditFilter */], { filter: filter, initialOperation: operation, initialValue: value, onApplyFilter: this.applyEditFilter })));
            }
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "flex-column" }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](GridAppliedFilters, { appliedFilters: appliedFilters, availableFilters: availableFilters, removeFilter: this.removeFilter, editFilter: this.editFilter, onOptionLoaded: function onOptionLoaded() {
                    return _this2.forceUpdate();
                } }), this.state.addingFilter ? __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](AddFilter, { cancelAddFilter: this.hideAddFilter, appliedFilters: appliedFilters, availableFilters: availableFilters, onApplyFilter: this.applyNewfilter }) : __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: function onClick(e) {
                    e.preventDefault();
                    _this2.showAddFilter();
                } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("span", { className: "glyphicon glyphicon-plus", style: { marginRight: 5 } }), "Add Filter")));
        }
    }]);

    return GridFilters;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

var AddFilter = function (_React$PureComponent) {
    _inherits(AddFilter, _React$PureComponent);

    function AddFilter(props) {
        _classCallCheck(this, AddFilter);

        var _this3 = _possibleConstructorReturn(this, (AddFilter.__proto__ || Object.getPrototypeOf(AddFilter)).call(this, props));

        _this3.state = { searchText: '' };
        _this3.onSearchTextChanged = _this3.onSearchTextChanged.bind(_this3);
        _this3.backToPrev = _this3.backToPrev.bind(_this3);
        return _this3;
    }

    _createClass(AddFilter, [{
        key: 'onSearchTextChanged',
        value: function onSearchTextChanged(e) {
            this.setState({
                searchText: e.currentTarget.value
            });
        }
    }, {
        key: 'newFilterSelected',
        value: function newFilterSelected(key) {
            this.setState({
                selectedFilterKey: key
            });
        }
    }, {
        key: 'backToPrev',
        value: function backToPrev() {
            if (this.state.selectedFilterKey) {
                this.setState({ selectedFilterKey: null });
            } else {
                this.props.cancelAddFilter();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var props = this.props;
            var _state = this.state,
                searchText = _state.searchText,
                selectedFilterKey = _state.selectedFilterKey;

            if (selectedFilterKey) {
                var filter = props.availableFilters[selectedFilterKey];
                var initialOperation = filter.operations.all[0];
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](BackLink, { onClick: this.backToPrev }), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__AddEditFilter__["a" /* AddEditFilter */], { filter: filter, initialOperation: initialOperation, onApplyFilter: this.props.onApplyFilter })));
            }
            var unusedFilters = props.availableFilters.all.filter(function (m) {
                return props.appliedFilters.every(function (c) {
                    return c.filter.fieldName != m.fieldName;
                });
            });
            var regex = new RegExp(searchText, 'i');
            var availableFilters = searchText ? unusedFilters.filter(function (m) {
                return m.displayName.match(regex);
            }) : unusedFilters;
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "flex-column" }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](BackLink, { onClick: this.backToPrev }), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", null, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_2_react_bootstrap_lib_FormControl___default.a, { placeholder: "Filter by", value: searchText, onChange: this.onSearchTextChanged, autoFocus: true })), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "small flex-column" }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { style: { margin: '10px 0' } }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("b", null, "Available Filters")), __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "available-filters" }, __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("div", { className: "list-group" }, availableFilters.map(function (m) {
                return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]("a", { href: "#", onClick: function onClick(e) {
                        e.preventDefault();
                        _this4.newFilterSelected(m.fieldName);
                    }, className: "list-group-item", key: m.fieldName }, m.displayName);
            })))));
        }
    }]);

    return AddFilter;
}(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);

/***/ }),

/***/ "./src/index.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ReactPowerTable__ = __webpack_require__("./src/ReactPowerTable.tsx");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "ReactPowerTable", function() { return __WEBPACK_IMPORTED_MODULE_0__ReactPowerTable__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__components_Paging__ = __webpack_require__("./src/components/Paging.tsx");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "withInternalPaging", function() { return __WEBPACK_IMPORTED_MODULE_1__components_Paging__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "withPaging", function() { return __WEBPACK_IMPORTED_MODULE_1__components_Paging__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Paging", function() { return __WEBPACK_IMPORTED_MODULE_1__components_Paging__["c"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Sorting__ = __webpack_require__("./src/components/Sorting.tsx");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "withInternalSorting", function() { return __WEBPACK_IMPORTED_MODULE_2__components_Sorting__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "withSorting", function() { return __WEBPACK_IMPORTED_MODULE_2__components_Sorting__["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__filters_GridFilters__ = __webpack_require__("./src/filters/GridFilters.tsx");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "GridFilters", function() { return __WEBPACK_IMPORTED_MODULE_3__filters_GridFilters__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__filters_DataTypes___ = __webpack_require__("./src/filters/DataTypes/index.ts");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "FilterDefinition", function() { return __WEBPACK_IMPORTED_MODULE_4__filters_DataTypes___["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "DataTypes", function() { return __WEBPACK_IMPORTED_MODULE_4__filters_DataTypes___["b"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils__ = __webpack_require__("./src/utils.ts");
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "GlobalDate", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["a"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "numberWithCommas", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["b"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "shallowEqual", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["c"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "debuglog", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["d"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "getColumnCore", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["e"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "getExpression", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["f"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "getComponentDisplayName", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["g"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "makePure", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["h"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "sortArray", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["i"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "serializeFilters", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["j"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "deSerializeFilters", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["k"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "groupBy", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["l"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "createKeyedMap", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["m"]; });
/* harmony namespace reexport (by provided) */ __webpack_require__.d(__webpack_exports__, "Lazy", function() { return __WEBPACK_IMPORTED_MODULE_5__utils__["n"]; });







/***/ }),

/***/ "./src/utils.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default.a; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GlobalDate; });
/* harmony export (immutable) */ __webpack_exports__["b"] = numberWithCommas;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return debuglog; });
/* harmony export (immutable) */ __webpack_exports__["e"] = getColumnCore;
/* harmony export (immutable) */ __webpack_exports__["f"] = getExpression;
/* harmony export (immutable) */ __webpack_exports__["g"] = getComponentDisplayName;
/* harmony export (immutable) */ __webpack_exports__["h"] = makePure;
/* harmony export (immutable) */ __webpack_exports__["i"] = sortArray;
/* harmony export (immutable) */ __webpack_exports__["j"] = serializeFilters;
/* harmony export (immutable) */ __webpack_exports__["k"] = deSerializeFilters;
/* harmony export (immutable) */ __webpack_exports__["l"] = groupBy;
/* harmony export (immutable) */ __webpack_exports__["m"] = createKeyedMap;
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "n", function() { return Lazy; });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var GlobalDate = Date;
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var debugMode = false;
var debuglog = debugMode ? console.log : function () {};
function getColumnCore(col) {
    //let fieldName: string;
    //let field: (row) => any;
    if (typeof col == 'string') {
        return {
            key: col,
            field: function field(row) {
                return row[col];
            },
            fieldName: col
        };
    }
    var _field = col.field,
        key = col.key;

    if (typeof _field === 'function') {
        var fieldName = getExpression(_field);
        return {
            key: key || fieldName,
            field: _field,
            fieldName: fieldName
        };
    }
    if (typeof _field === "string") {
        return {
            key: key || _field,
            field: function field(row) {
                return row[_field];
            },
            fieldName: _field
        };
    }
    if (!key) {
        throw new Error('Must specify value for "key" if field is not used');
    }
    //    field = _row => null;
    return {
        key: key,
        field: function field(_row) {
            return null;
        },
        fieldName: null
    };
}
function getExpression(func) {
    var expr = func.toString();
    var myregexp = /(?:return|\w+ => ).*\.(\w+);?/;
    var match = myregexp.exec(expr);
    if (match != null) {
        return match[1];
    }
    return null;
}
function getComponentDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
function makePure(factory) {
    if (debugMode) {
        return function (_React$Component) {
            _inherits(_class, _React$Component);

            function _class() {
                _classCallCheck(this, _class);

                return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
            }

            _createClass(_class, [{
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps) {
                    var result = !__WEBPACK_IMPORTED_MODULE_1_fbjs_lib_shallowEqual___default()(this.props, nextProps);
                    debuglog('shouldComponentUpdate returned ' + result, this.props, nextProps);
                    return result;
                }
            }, {
                key: 'render',
                value: function render() {
                    return factory(this.props);
                }
            }]);

            return _class;
        }(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);
    } else {
        return function (_React$PureComponent) {
            _inherits(_class2, _React$PureComponent);

            function _class2() {
                _classCallCheck(this, _class2);

                return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
            }

            _createClass(_class2, [{
                key: 'render',
                value: function render() {
                    return factory(this.props);
                }
            }]);

            return _class2;
        }(__WEBPACK_IMPORTED_MODULE_0_react__["PureComponent"]);
    }
}
function sortArray(array, expressionOrProperty, options) {
    var sortDirNum = options && options.descending ? -1 : 1;
    var expression = typeof expressionOrProperty === 'string' ? function (m) {
        return m[expressionOrProperty];
    } : expressionOrProperty;
    if (options && options.caseInsensitive) {
        var sortFunc;
        return [].concat(_toConsumableArray(array)).sort(function (a, b) {
            var av = expression(a);
            var bv = expression(b);
            if (av == null) {
                if (bv == null) {
                    return 0;
                } else {
                    return -sortDirNum;
                }
            } else if (bv == null) {
                return sortDirNum;
            }
            if (!sortFunc) {
                var aType = typeof av === 'undefined' ? 'undefined' : _typeof(av);
                var bType = typeof bv === 'undefined' ? 'undefined' : _typeof(bv);
                if (aType === bType && aType === 'string') {
                    sortFunc = function sortFunc(a, b) {
                        return a.localeCompare(b, [], { sensitivity: 'base' }) * sortDirNum;
                    };
                } else {
                    sortFunc = function sortFunc(a, b) {
                        return a < b ? -sortDirNum : a > b ? sortDirNum : 0;
                    };
                }
            }
            return sortFunc(av, bv);
        });
    }
    return [].concat(_toConsumableArray(array)).sort(function (a, b) {
        var av = expression(a);
        var bv = expression(b);
        return av < bv ? -sortDirNum : av > bv ? sortDirNum : 0;
    });
}
function serializeFilters(filters) {
    console.log('serializeFilters', filters);
    return filters.map(function (f) {
        var filter = f.filter,
            operation = f.operation,
            value = f.value;
        // const value = filter.dataType.key == 'string' ? '"' + f.Value + '"' : f.Value;
        // if (filter.canBeNull && (operation.key == 'null' || operation.key == 'notnull')) {
        //     return f.Column.Key + ' ' + f.Operation.key;
        // }
        //TODO: add serialize method to datatype

        return filter.fieldName + ' ' + operation.key + ' ' + value;
    }).join(' and ');
}
function deSerializeFilters(filters, availableFilters) {
    console.log('deSerializeFilters', filters);
    var myregexp = /(?:(.+?)\s+(eq|ne|gt|lt|contains|notcontains|between|in|notin|daterange|notnull|null)(?:\s+"?(.*?)"?)?(?:\s*$|\s+(?:or|and|not)\s+))/ig;
    var match = myregexp.exec(filters);
    var result = [];
    while (match != null) {
        result.push({ key: match[1], operation: match[2], value: match[3] });
        match = myregexp.exec(filters);
    }
    return result.map(function (m) {
        var filter = availableFilters[m.key];
        if (filter) {
            var operation = filter.operations[m.operation];
            if (operation) {
                return { filter: filter, operation: operation, value: m.value };
            }
        }
        return null;
    }).filter(function (m) {
        return m != null;
    });
}
function groupBy(items, keyGen) {
    var result = [];
    for (var i = 0; i < items.length; i++) {
        var key = keyGen(items[i], i);
        var g = result.find(function (a) {
            return a.key === key;
        });
        if (g == null) {
            g = {
                key: key,
                items: []
            };
            result.push(g);
        }
        g.items.push(items[i]);
    }
    return result;
}
;
function createKeyedMap(mapOrArray, keyField) {
    if (Array.isArray(mapOrArray)) {
        var newMap = { all: mapOrArray };
        mapOrArray.forEach(function (m) {
            var k = keyField && keyField(m) || m.key;
            if (newMap[k]) {
                throw new Error('Duplicate key found \'' + k + '\'. Cannot create a keyed map with duplicate keys.');
            }
            newMap[k] = m;
        });
        return newMap;
    }
    // if ((<KeyedMap<T>>mapOrArray).all) {
    //     //already a map        
    //     return mapOrArray;
    // }
    var all = Object.keys(mapOrArray).filter(function (m) {
        return m != 'all';
    }).map(function (m) {
        var v = mapOrArray[m];
        v.key = m;
        return v;
    });
    return Object.assign({}, mapOrArray, { all: all });
}
var Lazy = function () {
    function Lazy(func) {
        var _this3 = this;

        _classCallCheck(this, Lazy);

        this.func = function () {
            _this3.func = function () {
                return _this3._value;
            };
            return _this3._value = func();
        };
    }

    _createClass(Lazy, [{
        key: 'value',
        get: function get() {
            return this.func();
        }
    }]);

    return Lazy;
}();

/***/ }),

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ })

/******/ });
});
//# sourceMappingURL=index.js.map