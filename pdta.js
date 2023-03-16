
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(Module = {})  {

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject});var moduleOverrides=Object.assign({},Module);var arguments_=[];var thisProgram="./this.program";var quit_=(status,toThrow)=>{throw toThrow};var ENVIRONMENT_IS_WEB=true;var ENVIRONMENT_IS_WORKER=false;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(_scriptDir){scriptDirectory=_scriptDir}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText}catch(err){var data=tryParseAsDataURI(url);if(data){return intArrayToString(data)}throw err}};if(ENVIRONMENT_IS_WORKER){readBinary=url=>{try{var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}catch(err){var data=tryParseAsDataURI(url);if(data){return data}throw err}}}readAsync=(url,onload,onerror)=>{var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=()=>{if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}var data=tryParseAsDataURI(url);if(data){onload(data.buffer);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=title=>document.title=title}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||false;if(typeof WebAssembly!="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}var HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=HEAP16=new Int16Array(b);Module["HEAP32"]=HEAP32=new Int32Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=HEAPU16=new Uint16Array(b);Module["HEAPU32"]=HEAPU32=new Uint32Array(b);Module["HEAPF32"]=HEAPF32=new Float32Array(b);Module["HEAPF64"]=HEAPF64=new Float64Array(b)}var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;callRuntimeCallbacks(__ATINIT__)}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what="Aborted("+what+")";err(what);ABORT=true;EXITSTATUS=1;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,AGFzbQEAAAABMAlgAX8Bf2ADf39/AGAAAX9gAn9/AX9gA39/fwF/YAF/AGACf38AYAN/fn8BfmAAAAIZBAFhAWEAAAFhAWIAAQFhAWMABgFhAWQAAQMQDwADAAAIAQMCAgQABQIFAAQFAXABAQEFBgEBgAiACAYIAX8BQeCVBAsHOQ4BZQIAAWYACAFnABIBaAAKAWkABwFqAA0BawAMAWwACwFtAQABbgAGAW8AEQFwABABcQAPAXIADgqGTA9PAQJ/QfgIKAIAIgEgAEEHakF4cSICaiEAAkAgAkEAIAAgAU0bDQAgAD8AQRB0SwRAIAAQAEUNAQtB+AggADYCACABDwtB0BFBMDYCAEF/CzMBAn9B+AAhAyAAIQIDQCACIAEtAAA6AAAgAkEBaiECIAFBAWohASADQQFrIgMNAAsgAAvoAQEDfyAARQRAQdgVKAIABEBB2BUoAgAQBiEBC0HYFSgCAARAQdgVKAIAEAYgAXIhAQtB1BUoAgAiAARAA0AgACgCTBogACgCFCAAKAIcRwRAIAAQBiABciEBCyAAKAI4IgANAAsLIAEPCyAAKAJMQQBOIQICQAJAIAAoAhQgACgCHEYNACAAQQBBACAAKAIkEQQAGiAAKAIUDQBBfyEBDAELIAAoAgQiASAAKAIIIgNHBEAgACABIANrrEEBIAAoAigRBwAaC0EAIQEgAEEANgIcIABCADcDECAAQgA3AgQgAkUNAAsgAQuLKAELfyMAQRBrIgskAAJAAkACQAJAAkACQAJAAkACQCAAQfQBTQRAQdQRKAIAIgZBECAAQQtqQXhxIABBC0kbIgVBA3YiAHYiAUEDcQRAAkAgAUF/c0EBcSAAaiICQQN0IgFB/BFqIgAgAUGEEmooAgAiASgCCCIERgRAQdQRIAZBfiACd3E2AgAMAQsgBCAANgIMIAAgBDYCCAsgAUEIaiEAIAEgAkEDdCICQQNyNgIEIAEgAmoiASABKAIEQQFyNgIEDAoLIAVB3BEoAgAiB00NASABBEACQEECIAB0IgJBACACa3IgASAAdHEiAEEAIABrcWgiAUEDdCIAQfwRaiICIABBhBJqKAIAIgAoAggiBEYEQEHUESAGQX4gAXdxIgY2AgAMAQsgBCACNgIMIAIgBDYCCAsgACAFQQNyNgIEIAAgBWoiCCABQQN0IgEgBWsiBEEBcjYCBCAAIAFqIAQ2AgAgBwRAIAdBeHFB/BFqIQFB6BEoAgAhAgJ/IAZBASAHQQN2dCIDcUUEQEHUESADIAZyNgIAIAEMAQsgASgCCAshAyABIAI2AgggAyACNgIMIAIgATYCDCACIAM2AggLIABBCGohAEHoESAINgIAQdwRIAQ2AgAMCgtB2BEoAgAiCkUNASAKQQAgCmtxaEECdEGEFGooAgAiAigCBEF4cSAFayEDIAIhAQNAAkAgASgCECIARQRAIAEoAhQiAEUNAQsgACgCBEF4cSAFayIBIAMgASADSSIBGyEDIAAgAiABGyECIAAhAQwBCwsgAigCGCEJIAIgAigCDCIERwRAQeQRKAIAGiACKAIIIgAgBDYCDCAEIAA2AggMCQsgAkEUaiIBKAIAIgBFBEAgAigCECIARQ0DIAJBEGohAQsDQCABIQggACIEQRRqIgEoAgAiAA0AIARBEGohASAEKAIQIgANAAsgCEEANgIADAgLQX8hBSAAQb9/Sw0AIABBC2oiAEF4cSEFQdgRKAIAIghFDQBBACAFayEDAkACQAJAAn9BACAFQYACSQ0AGkEfIAVB////B0sNABogBUEmIABBCHZnIgBrdkEBcSAAQQF0a0E+agsiB0ECdEGEFGooAgAiAUUEQEEAIQAMAQtBACEAIAVBGSAHQQF2a0EAIAdBH0cbdCECA0ACQCABKAIEQXhxIAVrIgYgA08NACABIQQgBiIDDQBBACEDIAEhAAwDCyAAIAEoAhQiBiAGIAEgAkEddkEEcWooAhAiAUYbIAAgBhshACACQQF0IQIgAQ0ACwsgACAEckUEQEEAIQRBAiAHdCIAQQAgAGtyIAhxIgBFDQMgAEEAIABrcWhBAnRBhBRqKAIAIQALIABFDQELA0AgACgCBEF4cSAFayICIANJIQEgAiADIAEbIQMgACAEIAEbIQQgACgCECIBBH8gAQUgACgCFAsiAA0ACwsgBEUNACADQdwRKAIAIAVrTw0AIAQoAhghByAEIAQoAgwiAkcEQEHkESgCABogBCgCCCIAIAI2AgwgAiAANgIIDAcLIARBFGoiASgCACIARQRAIAQoAhAiAEUNAyAEQRBqIQELA0AgASEGIAAiAkEUaiIBKAIAIgANACACQRBqIQEgAigCECIADQALIAZBADYCAAwGCyAFQdwRKAIAIgRNBEBB6BEoAgAhAAJAIAQgBWsiAUEQTwRAIAAgBWoiAiABQQFyNgIEIAAgBGogATYCACAAIAVBA3I2AgQMAQsgACAEQQNyNgIEIAAgBGoiASABKAIEQQFyNgIEQQAhAkEAIQELQdwRIAE2AgBB6BEgAjYCACAAQQhqIQAMCAsgBUHgESgCACICSQRAQeARIAIgBWsiATYCAEHsEUHsESgCACIAIAVqIgI2AgAgAiABQQFyNgIEIAAgBUEDcjYCBCAAQQhqIQAMCAtBACEAIAVBL2oiAwJ/QawVKAIABEBBtBUoAgAMAQtBuBVCfzcCAEGwFUKAoICAgIAENwIAQawVIAtBDGpBcHFB2KrVqgVzNgIAQcAVQQA2AgBBkBVBADYCAEGAIAsiAWoiBkEAIAFrIghxIgEgBU0NB0GMFSgCACIEBEBBhBUoAgAiByABaiIJIAdNIAQgCUlyDQgLAkBBkBUtAABBBHFFBEACQAJAAkACQEHsESgCACIEBEBBlBUhAANAIAQgACgCACIHTwRAIAcgACgCBGogBEsNAwsgACgCCCIADQALC0EAEAQiAkF/Rg0DIAEhBkGwFSgCACIAQQFrIgQgAnEEQCABIAJrIAIgBGpBACAAa3FqIQYLIAUgBk8NA0GMFSgCACIABEBBhBUoAgAiBCAGaiIIIARNIAAgCElyDQQLIAYQBCIAIAJHDQEMBQsgBiACayAIcSIGEAQiAiAAKAIAIAAoAgRqRg0BIAIhAAsgAEF/Rg0BIAYgBUEwak8EQCAAIQIMBAtBtBUoAgAiAiADIAZrakEAIAJrcSICEARBf0YNASACIAZqIQYgACECDAMLIAJBf0cNAgtBkBVBkBUoAgBBBHI2AgALIAEQBCICQX9GQQAQBCIAQX9GciAAIAJNcg0FIAAgAmsiBiAFQShqTQ0FC0GEFUGEFSgCACAGaiIANgIAQYgVKAIAIABJBEBBiBUgADYCAAsCQEHsESgCACIDBEBBlBUhAANAIAIgACgCACIBIAAoAgQiBGpGDQIgACgCCCIADQALDAQLQeQRKAIAIgBBACAAIAJNG0UEQEHkESACNgIAC0EAIQBBmBUgBjYCAEGUFSACNgIAQfQRQX82AgBB+BFBrBUoAgA2AgBBoBVBADYCAANAIABBA3QiAUGEEmogAUH8EWoiBDYCACABQYgSaiAENgIAIABBAWoiAEEgRw0AC0HgESAGQShrIgBBeCACa0EHcUEAIAJBCGpBB3EbIgFrIgQ2AgBB7BEgASACaiIBNgIAIAEgBEEBcjYCBCAAIAJqQSg2AgRB8BFBvBUoAgA2AgAMBAsgAC0ADEEIcSABIANLciACIANNcg0CIAAgBCAGajYCBEHsESADQXggA2tBB3FBACADQQhqQQdxGyIAaiIBNgIAQeARQeARKAIAIAZqIgIgAGsiADYCACABIABBAXI2AgQgAiADakEoNgIEQfARQbwVKAIANgIADAMLQQAhBAwFC0EAIQIMAwtB5BEoAgAgAksEQEHkESACNgIACyACIAZqIQFBlBUhAAJAAkACQAJAAkACQANAIAEgACgCAEcEQCAAKAIIIgANAQwCCwsgAC0ADEEIcUUNAQtBlBUhAANAIAMgACgCACIBTwRAIAEgACgCBGoiBCADSw0DCyAAKAIIIQAMAAsACyAAIAI2AgAgACAAKAIEIAZqNgIEIAJBeCACa0EHcUEAIAJBCGpBB3EbaiIHIAVBA3I2AgQgAUF4IAFrQQdxQQAgAUEIakEHcRtqIgYgBSAHaiIFayEAIAMgBkYEQEHsESAFNgIAQeARQeARKAIAIABqIgA2AgAgBSAAQQFyNgIEDAMLQegRKAIAIAZGBEBB6BEgBTYCAEHcEUHcESgCACAAaiIANgIAIAUgAEEBcjYCBCAAIAVqIAA2AgAMAwsgBigCBCIDQQNxQQFGBEAgA0F4cSEJAkAgA0H/AU0EQCAGKAIMIgEgBigCCCICRgRAQdQRQdQRKAIAQX4gA0EDdndxNgIADAILIAIgATYCDCABIAI2AggMAQsgBigCGCEIAkAgBiAGKAIMIgJHBEAgBigCCCIBIAI2AgwgAiABNgIIDAELAkAgBkEUaiIDKAIAIgENACAGQRBqIgMoAgAiAQ0AQQAhAgwBCwNAIAMhBCABIgJBFGoiAygCACIBDQAgAkEQaiEDIAIoAhAiAQ0ACyAEQQA2AgALIAhFDQACQCAGKAIcIgFBAnRBhBRqIgQoAgAgBkYEQCAEIAI2AgAgAg0BQdgRQdgRKAIAQX4gAXdxNgIADAILIAhBEEEUIAgoAhAgBkYbaiACNgIAIAJFDQELIAIgCDYCGCAGKAIQIgEEQCACIAE2AhAgASACNgIYCyAGKAIUIgFFDQAgAiABNgIUIAEgAjYCGAsgBiAJaiIGKAIEIQMgACAJaiEACyAGIANBfnE2AgQgBSAAQQFyNgIEIAAgBWogADYCACAAQf8BTQRAIABBeHFB/BFqIQECf0HUESgCACICQQEgAEEDdnQiAHFFBEBB1BEgACACcjYCACABDAELIAEoAggLIQAgASAFNgIIIAAgBTYCDCAFIAE2AgwgBSAANgIIDAMLQR8hAyAAQf///wdNBEAgAEEmIABBCHZnIgFrdkEBcSABQQF0a0E+aiEDCyAFIAM2AhwgBUIANwIQIANBAnRBhBRqIQECQEHYESgCACICQQEgA3QiBHFFBEBB2BEgAiAEcjYCACABIAU2AgAMAQsgAEEZIANBAXZrQQAgA0EfRxt0IQMgASgCACECA0AgAiIBKAIEQXhxIABGDQMgA0EddiECIANBAXQhAyABIAJBBHFqIgQoAhAiAg0ACyAEIAU2AhALIAUgATYCGCAFIAU2AgwgBSAFNgIIDAILQeARIAZBKGsiAEF4IAJrQQdxQQAgAkEIakEHcRsiAWsiCDYCAEHsESABIAJqIgE2AgAgASAIQQFyNgIEIAAgAmpBKDYCBEHwEUG8FSgCADYCACADIARBJyAEa0EHcUEAIARBJ2tBB3EbakEvayIAIAAgA0EQakkbIgFBGzYCBCABQZwVKQIANwIQIAFBlBUpAgA3AghBnBUgAUEIajYCAEGYFSAGNgIAQZQVIAI2AgBBoBVBADYCACABQRhqIQADQCAAQQc2AgQgAEEIaiECIABBBGohACACIARJDQALIAEgA0YNAyABIAEoAgRBfnE2AgQgAyABIANrIgJBAXI2AgQgASACNgIAIAJB/wFNBEAgAkF4cUH8EWohAAJ/QdQRKAIAIgFBASACQQN2dCICcUUEQEHUESABIAJyNgIAIAAMAQsgACgCCAshASAAIAM2AgggASADNgIMIAMgADYCDCADIAE2AggMBAtBHyEAIAJB////B00EQCACQSYgAkEIdmciAGt2QQFxIABBAXRrQT5qIQALIAMgADYCHCADQgA3AhAgAEECdEGEFGohAQJAQdgRKAIAIgRBASAAdCIGcUUEQEHYESAEIAZyNgIAIAEgAzYCAAwBCyACQRkgAEEBdmtBACAAQR9HG3QhACABKAIAIQQDQCAEIgEoAgRBeHEgAkYNBCAAQR12IQQgAEEBdCEAIAEgBEEEcWoiBigCECIEDQALIAYgAzYCEAsgAyABNgIYIAMgAzYCDCADIAM2AggMAwsgASgCCCIAIAU2AgwgASAFNgIIIAVBADYCGCAFIAE2AgwgBSAANgIICyAHQQhqIQAMBQsgASgCCCIAIAM2AgwgASADNgIIIANBADYCGCADIAE2AgwgAyAANgIIC0HgESgCACIAIAVNDQBB4BEgACAFayIBNgIAQewRQewRKAIAIgAgBWoiAjYCACACIAFBAXI2AgQgACAFQQNyNgIEIABBCGohAAwDC0HQEUEwNgIAQQAhAAwCCwJAIAdFDQACQCAEKAIcIgBBAnRBhBRqIgEoAgAgBEYEQCABIAI2AgAgAg0BQdgRIAhBfiAAd3EiCDYCAAwCCyAHQRBBFCAHKAIQIARGG2ogAjYCACACRQ0BCyACIAc2AhggBCgCECIABEAgAiAANgIQIAAgAjYCGAsgBCgCFCIARQ0AIAIgADYCFCAAIAI2AhgLAkAgA0EPTQRAIAQgAyAFaiIAQQNyNgIEIAAgBGoiACAAKAIEQQFyNgIEDAELIAQgBUEDcjYCBCAEIAVqIgIgA0EBcjYCBCACIANqIAM2AgAgA0H/AU0EQCADQXhxQfwRaiEAAn9B1BEoAgAiAUEBIANBA3Z0IgNxRQRAQdQRIAEgA3I2AgAgAAwBCyAAKAIICyEBIAAgAjYCCCABIAI2AgwgAiAANgIMIAIgATYCCAwBC0EfIQAgA0H///8HTQRAIANBJiADQQh2ZyIAa3ZBAXEgAEEBdGtBPmohAAsgAiAANgIcIAJCADcCECAAQQJ0QYQUaiEBAkACQCAIQQEgAHQiBnFFBEBB2BEgBiAIcjYCACABIAI2AgAMAQsgA0EZIABBAXZrQQAgAEEfRxt0IQAgASgCACEFA0AgBSIBKAIEQXhxIANGDQIgAEEddiEGIABBAXQhACABIAZBBHFqIgYoAhAiBQ0ACyAGIAI2AhALIAIgATYCGCACIAI2AgwgAiACNgIIDAELIAEoAggiACACNgIMIAEgAjYCCCACQQA2AhggAiABNgIMIAIgADYCCAsgBEEIaiEADAELAkAgCUUNAAJAIAIoAhwiAEECdEGEFGoiASgCACACRgRAIAEgBDYCACAEDQFB2BEgCkF+IAB3cTYCAAwCCyAJQRBBFCAJKAIQIAJGG2ogBDYCACAERQ0BCyAEIAk2AhggAigCECIABEAgBCAANgIQIAAgBDYCGAsgAigCFCIARQ0AIAQgADYCFCAAIAQ2AhgLAkAgA0EPTQRAIAIgAyAFaiIAQQNyNgIEIAAgAmoiACAAKAIEQQFyNgIEDAELIAIgBUEDcjYCBCACIAVqIgQgA0EBcjYCBCADIARqIAM2AgAgBwRAIAdBeHFB/BFqIQBB6BEoAgAhAQJ/QQEgB0EDdnQiBSAGcUUEQEHUESAFIAZyNgIAIAAMAQsgACgCCAshBiAAIAE2AgggBiABNgIMIAEgADYCDCABIAY2AggLQegRIAQ2AgBB3BEgAzYCAAsgAkEIaiEACyALQRBqJAAgAAsDAAELwwEBAX8CQAJAAkACQAJAIAAODQEBAQECBAQEBAQEBAIACwJAIABBK2sOCAAAAgQEBAQCAwsgASAAQQF0aiIAIAAuAQAiAEEIdSIBIAJBCHUiAyABIANIG0EIdCAAQf8AcSIAIAJB/wBxIgEgACABSxtyOwEADwsgASAAQQF0aiIAIAAvAQAgAmo7AQAPCyABIABBAXRqIgAgAC8BACACQQ90ajsBAA8LIABBOUcNACABIAI7AXILIAEgAEEBdGogAjsBAAtkAQV/QYAJKAIAIgJBACACQQBKGyEFQYQJKAIAIQRBACECAkADQCACIAVGDQECQCAAIAQgAkEmbGoiBi8BFEYEQCAGLwEWIAFGDQELIAJBAWohAgwBCwsgBCACQSZsaiEDCyADCwUAQdAJCwgAQcQJKAIAC5oBAQJ/AkADQCAAIQMDQAJAIANFDQAgAy8BakH//wNGDQACQCACQf8BcSIEBEAgAy0AWCAESw0BIAMtAFkgBEkNAQsgAUH/AXEiBEUNBCADLQBWIARLDQAgAy0AVyAETw0ECyADQfgAaiEDDAELCyACQf8BcSEDQQAhAiADDQAgAUH/AXEhA0EAIQEgAw0AC0HMESgCACEDCyADCxAAIwAgAGtBcHEiACQAIAALBgAgACQACwQAIwALywsBB38CQCAARQ0AIABBCGsiAiAAQQRrKAIAIgFBeHEiAGohBQJAIAFBAXENACABQQNxRQ0BIAIgAigCACIBayICQeQRKAIASQ0BIAAgAWohAEHoESgCACACRwRAIAFB/wFNBEAgAUEDdiEBIAIoAgwiAyACKAIIIgRGBEBB1BFB1BEoAgBBfiABd3E2AgAMAwsgBCADNgIMIAMgBDYCCAwCCyACKAIYIQYCQCACIAIoAgwiAUcEQCACKAIIIgMgATYCDCABIAM2AggMAQsCQCACQRRqIgQoAgAiAw0AIAJBEGoiBCgCACIDDQBBACEBDAELA0AgBCEHIAMiAUEUaiIEKAIAIgMNACABQRBqIQQgASgCECIDDQALIAdBADYCAAsgBkUNAQJAIAIoAhwiBEECdEGEFGoiAygCACACRgRAIAMgATYCACABDQFB2BFB2BEoAgBBfiAEd3E2AgAMAwsgBkEQQRQgBigCECACRhtqIAE2AgAgAUUNAgsgASAGNgIYIAIoAhAiAwRAIAEgAzYCECADIAE2AhgLIAIoAhQiA0UNASABIAM2AhQgAyABNgIYDAELIAUoAgQiAUEDcUEDRw0AQdwRIAA2AgAgBSABQX5xNgIEIAIgAEEBcjYCBCAAIAJqIAA2AgAPCyACIAVPDQAgBSgCBCIBQQFxRQ0AAkAgAUECcUUEQEHsESgCACAFRgRAQewRIAI2AgBB4BFB4BEoAgAgAGoiADYCACACIABBAXI2AgQgAkHoESgCAEcNA0HcEUEANgIAQegRQQA2AgAPC0HoESgCACAFRgRAQegRIAI2AgBB3BFB3BEoAgAgAGoiADYCACACIABBAXI2AgQgACACaiAANgIADwsgAUF4cSAAaiEAAkAgAUH/AU0EQCABQQN2IQEgBSgCDCIDIAUoAggiBEYEQEHUEUHUESgCAEF+IAF3cTYCAAwCCyAEIAM2AgwgAyAENgIIDAELIAUoAhghBgJAIAUgBSgCDCIBRwRAQeQRKAIAGiAFKAIIIgMgATYCDCABIAM2AggMAQsCQCAFQRRqIgQoAgAiAw0AIAVBEGoiBCgCACIDDQBBACEBDAELA0AgBCEHIAMiAUEUaiIEKAIAIgMNACABQRBqIQQgASgCECIDDQALIAdBADYCAAsgBkUNAAJAIAUoAhwiBEECdEGEFGoiAygCACAFRgRAIAMgATYCACABDQFB2BFB2BEoAgBBfiAEd3E2AgAMAgsgBkEQQRQgBigCECAFRhtqIAE2AgAgAUUNAQsgASAGNgIYIAUoAhAiAwRAIAEgAzYCECADIAE2AhgLIAUoAhQiA0UNACABIAM2AhQgAyABNgIYCyACIABBAXI2AgQgACACaiAANgIAIAJB6BEoAgBHDQFB3BEgADYCAA8LIAUgAUF+cTYCBCACIABBAXI2AgQgACACaiAANgIACyAAQf8BTQRAIABBeHFB/BFqIQECf0HUESgCACIDQQEgAEEDdnQiAHFFBEBB1BEgACADcjYCACABDAELIAEoAggLIQAgASACNgIIIAAgAjYCDCACIAE2AgwgAiAANgIIDwtBHyEEIABB////B00EQCAAQSYgAEEIdmciAWt2QQFxIAFBAXRrQT5qIQQLIAIgBDYCHCACQgA3AhAgBEECdEGEFGohBwJAAkACQEHYESgCACIDQQEgBHQiAXFFBEBB2BEgASADcjYCACAHIAI2AgAgAiAHNgIYDAELIABBGSAEQQF2a0EAIARBH0cbdCEEIAcoAgAhAQNAIAEiAygCBEF4cSAARg0CIARBHXYhASAEQQF0IQQgAyABQQRxaiIHQRBqKAIAIgENAAsgByACNgIQIAIgAzYCGAsgAiACNgIMIAIgAjYCCAwBCyADKAIIIgAgAjYCDCADIAI2AgggAkEANgIYIAIgAzYCDCACIAA2AggLQfQRQfQRKAIAQQFrIgBBfyAAGzYCAAsLxRECGH8BfSAAKAIEIQJBhAkgAEEIaiIANgIAQYAJIAJBJm42AgAgACACaiIEKAIEIQJBjAkgBEEIaiIANgIAQYgJIAJBAnY2AgAgACAEKAIEaiIEKAIEIQJBlAkgBEEIaiIANgIAQZAJIAJBCm42AgAgACAEKAIEaiIEKAIEIQJBnAkgBEEIaiIANgIAQZgJIAJBAnY2AgAgACAEKAIEaiIEKAIEIQJBpAkgBEEIaiIANgIAQaAJIAJBFm42AgAgACAEKAIEaiIEKAIEIQJBrAkgBEEIaiIANgIAQagJIAJBAnY2AgAgACAEKAIEaiIEKAIEIQJBtAkgBEEIaiIANgIAQbAJIAJBCm42AgAgACAEKAIEaiIEKAIEIQJBvAkgBEEIaiIANgIAQbgJIAJBAnY2AgAgACAEKAIEaiICKAIEIQBBxAkgAkEIajYCAEHACSAAQS5uNgIAQQAhAANAIABBgAFHBEAgAEEAEAoiAgRAQQAhEiACIgsvARgiASACLwE+IgIgASACSxshF0GkCSgCACIYQRZqIQNBqAkoAgBBAWshBUGYCSgCAEEBayETQYgJKAIAQQFrIQdBvAkoAgAiFUG4CSgCAEECdGpBBGshCkHACSgCACEIQawJKAIAIQlBnAkoAgAhFEGMCSgCACEWA0AgASAXRwRAIAFBAWohBCAWIAFBAnRqLwEAIQYgEyECIAEgB0gEQCAWIARBAnRqLwEAIQILIAIgBiACIAZKGyEMQQAhDkH/ACEPA0AgBiAMRgRAIAQhAQwDBQJAAkACQCAGQStrDgIBAgALIA8gDkH/AXFGBEAgDyEODAILIBQgBkECdGoiAi8BAEEpRw0BIBggAi8BAkEWbCICai8BFCINIAIgA2ovARQiAiACIA1JGyEQA0AgDSAQRg0CIAkgDUECdGohASAKIQIgBSANSgRAIBUgAS8BBEECdGohAgsgFSABLwEAQQJ0aiEBA0ACQCABLwEAIhFBPEYgASACRnJFBEAgEUE1Rw0BIBIgCCABLwECSmohEgsgDUEBaiENDAILIAFBBGohAQwACwALAAsgFC0ArwEhDyAULQCuASEOCyAGQQFqIQYMAQsACwALC0EAIQwjAEGAA2siByQAIBJB+ABsQfgAahAHIRAgCy8BGCECA0AgCy8BPiACSwRAIAJBAWohBEGMCSgCACIBIAJBAnRqLwEAIQkCf0GICSgCAEEBayACSgRAIAEgBEECdGovAQAMAQtBmAkoAgBBAWsLIQEgB0GAAmohCkH4ACECA0AgCkEAOgAAIApBAWohCiACQQFrIgINAAsgB0H//wM7AdICIAEgCSABIAlKGyEOA0AgCSAORgRAIAQhAgwDBUGcCSgCACAJQQJ0aiIRLwEAIgIgB0GAAmogES4BAiIBEAkCQCACQSlHDQAgByABOwHSAkGkCSgCACABQRZsaiICLwEUIQYgAi8BKiECIAdBgAFqQYAIEAUaIAYgAiACIAZJGyEPIAlBK2shEwNAIAYgD0YNASAHIAdBgAFqEAUhA0G8CSgCACIBQawJKAIAIAZBAnRqIgIvAQBBAnRqIQggASACLwEEQQJ0aiEKA0ACQCAIIApGDQACQCATQQFNBEAgCC0AAyIBIBEtAAJJDQEgCC0AAiICIBEtAANLIAEgAkZyDQELIAgvAQAiAkE1RgRAIAgvAQIiAkHACSgCAE4NAiADIAI7AWpBACECA0AgAkE8RgRAIAMuAWoiAUUNAyAQIAxB+ABsaiADEAUhAiALLwEUIAIQAiADLgFSIAFBxAkoAgAgAUEubGoQASAMQQFqIQwMAwUgAkEBdCIBIANBgAJqai4BACEFAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCACDjEAAAAADQgIDQkKCAgNCA0NDQQNDQ0BCwELAQIBAgYCAwMBAgECBwIDAwwNDQ0NDQ0FDQsgASADaiIBIAEvAQAgBWo7AQAMDAsgASADaiIBQYgnQaCifyABLgEAIAVqIgEgAUGgon9MGyIBIAFBiCdOGzsBAAwLCyABIANqIgFBwD5BoKJ/IAEuAQAgBWoiASABQaCif0wbIgEgAUHAPk4bOwEADAoLIAEgA2oiAUGwCUGgon8gAS4BACAFaiIBIAFBoKJ/TBsiASABQbAJThs7AQAMCQsgAwJ/QwAAAD9DAAAAvyAFskNvEoM6lCADLgEispIiGSAZQwAAAL9dGyAZQwAAAD9eGyIZi0MAAABPXQRAIBmoDAELQYCAgIB4CzsBIgwICyADAn9DAAAQQ0MAAAAAIAWyQ83MzD2UIAMuAWCykiIZIBlDAAAAAF0bIBlDAAAQQ14bIhmLQwAAAE9dBEAgGagMAQtBgICAgHgLOwFgDAcLIANB6AcgAy4BOiAFaiIBQQAgAUEAShsiASABQegHTxs7AToMBgsgAwJ/QwAAr0RDAAAAACAFsiADLgFKspIiGSAZQwAAAABdGyAZQwAAr0ReGyIZi0MAAABPXQRAIBmoDAELQYCAgIB4CzsBSgwFCyABIANqIgFB4N0AQaCifyABLgEAIAVqIgEgAUGgon9MGyIBIAFB4N0AThs7AQAMBAsgA0G86QBB3AsgAy4BECAFaiIBIAFB3AtMGyIBIAFBvOkATxs7ARAMAwsgA0HAByADLgESIAVqIgFBACABQQBKGyIBIAFBwAdPGzsBEgwCCyABIANqIgFBlCNBgIN/IAEuAQAgBWoiASABQYCDf0wbIgEgAUGUI04bOwEADAELIAMgBTsBUgsgAkEBaiECDAELAAsACyACIAMgCC4BAhAJCyAIQQRqIQgMAQsLIAMvAWpB//8DRgRAIANBgAFqIAMQBRoLIAZBAWohBgwACwALIAlBAWohCQwBCwALAAsLIBAgDEH4AGxqQf//AzsBaiAHQYADaiQAIABBAnRB0AlqIBA2AgAgCy8BFCALLwEWIAsQAwsgAEEBaiEADAELC0EEEAcLC1gEAEGQCAsCvDQAQbIICy4g0SDRINEg0QAAINEAAAAAINEg0SDRINEAACDRAAAAAP//AAAAfwB/AAD/////AEHqCAsM//8BAAAAZAAAAP//AEH4CAsD4AoB";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary){return readBinary(file)}throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function getBinaryPromise(binaryFile){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+binaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(binaryFile)})}}return Promise.resolve().then(function(){return getBinary(binaryFile)})}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(function(binary){return WebAssembly.instantiate(binary,imports)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(binary,binaryFile,imports,callback){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(binaryFile)&&typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,imports);return result.then(callback,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(binaryFile,imports,callback)})})}else{return instantiateArrayBuffer(binaryFile,imports,callback)}}function createWasm(){var info={"a":wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["e"];updateMemoryViews();wasmTable=Module["asm"]["m"];addOnInit(Module["asm"]["f"]);removeRunDependency("wasm-instantiate");return exports}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e)}}instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult).catch(readyPromiseReject);return{}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module)}}function intArrayToString(array){var ret=[];for(var i=0;i<array.length;i++){var chr=array[i];if(chr>255){chr&=255}ret.push(String.fromCharCode(chr))}return ret.join("")}function _emitHeader(pid,bid,offset){Module.onHeader(pid,bid,Module.AsciiToString(offset))}function _emitSample(shdr,id,offset){Module.onSample(shdr,id,Module.AsciiToString(offset))}function _emitZone(pid,ref){Module.onZone(pid,ref,new Int16Array(Module.HEAPU8.buffer,ref,60))}function abortOnCannotGrowMemory(requestedSize){abort("OOM")}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;abortOnCannotGrowMemory(requestedSize)}function getCFunc(ident){var func=Module["_"+ident];return func}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function AsciiToString(ptr){var str="";while(1){var ch=HEAPU8[ptr++>>0];if(!ch)return str;str+=String.fromCharCode(ch)}}var decodeBase64=typeof atob=="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2)}if(enc4!==64){output=output+String.fromCharCode(chr3)}}while(i<input.length);return output};function intArrayFromBase64(s){try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i)}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var wasmImports={"d":_emitHeader,"b":_emitSample,"c":_emitZone,"a":_emscripten_resize_heap};var asm=createWasm();var ___wasm_call_ctors=function(){return(___wasm_call_ctors=Module["asm"]["f"]).apply(null,arguments)};var _loadpdta=Module["_loadpdta"]=function(){return(_loadpdta=Module["_loadpdta"]=Module["asm"]["g"]).apply(null,arguments)};var _findPreset=Module["_findPreset"]=function(){return(_findPreset=Module["_findPreset"]=Module["asm"]["h"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["i"]).apply(null,arguments)};var _filterForZone=Module["_filterForZone"]=function(){return(_filterForZone=Module["_filterForZone"]=Module["asm"]["j"]).apply(null,arguments)};var _shdrref=Module["_shdrref"]=function(){return(_shdrref=Module["_shdrref"]=Module["asm"]["k"]).apply(null,arguments)};var _presetRef=Module["_presetRef"]=function(){return(_presetRef=Module["_presetRef"]=Module["asm"]["l"]).apply(null,arguments)};var ___errno_location=function(){return(___errno_location=Module["asm"]["__errno_location"]).apply(null,arguments)};var ___funcs_on_exit=function(){return(___funcs_on_exit=Module["asm"]["__funcs_on_exit"]).apply(null,arguments)};var _fflush=Module["_fflush"]=function(){return(_fflush=Module["_fflush"]=Module["asm"]["n"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["o"]).apply(null,arguments)};var stackSave=function(){return(stackSave=Module["asm"]["p"]).apply(null,arguments)};var stackRestore=function(){return(stackRestore=Module["asm"]["q"]).apply(null,arguments)};var stackAlloc=function(){return(stackAlloc=Module["asm"]["r"]).apply(null,arguments)};Module["ccall"]=ccall;Module["AsciiToString"]=AsciiToString;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}run();


  return Module.ready
}

);
})();
export default Module;