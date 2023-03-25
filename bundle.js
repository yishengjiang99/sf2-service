
[36m[1m//→ index.js:[22m[39m
async function sfbkstream(url) {
  const res = await fetch(url, { headers: { Range: "bytes=0-6400" } });

  const ab = await res.arrayBuffer();

  const [infos, readOffset, meta] = readInfoSection(ab);
  const sdtaSize = readOffset.get32();
  console.assert(bytesToString(readOffset.readNString(4)) === "sdta");
  console.assert(bytesToString(readOffset.readNString(4)) === "smpl");

  const sdtaStart = readOffset.offset;
  const pdtastart = sdtaStart + sdtaSize + 4;

  const pdtaHeader = {
    headers: { Range: "bytes=" + pdtastart + "-" },
  };

  return {
    nsamples: (pdtastart - sdtaStart) / 2,
    sdtaStart,
    infos,
    meta,
    pdtaBuffer: new Uint8Array(await (await fetch(url, pdtaHeader)).arrayBuffer()),
    fullUrl: res.url,
  };
}
function readInfoSection(ab) {
  const infosection = new Uint8Array(ab);
  const r = readAB(infosection);
  const [riff, filesize, sig, list] = [r.readNString(4), r.get32(), r.readNString(4), r.readNString(4)];
  console.log([riff, filesize, sig, list]);
  let infosize = r.get32();
  console.assert(bytesToString(r.readNString(4)) === "INFO");

  const infos = [];
  console.assert(infosize < 10000);
  while (infosize >= 8) {
    const [sb, size] = [r.readNString(4), r.get32()];
    const section = bytesToString(sb);
    const val = bytesToString(r.readNString(size));

    infos.push([section, val]);
    infosize = infosize - 8 - size;
  }
  const meta = {
    riff: bytesToString(riff),
    filesize,
    sig,
  };

  console.assert(bytesToString(r.readNString(4)) === "LIST");
  return [infos, r, meta];
}
function bytesToString(ab) {
  let str = "";
  for (const b of Object.values(ab)) {
    if (!b) break;
    if (b < 10) str += b.toString();
    else str += String.fromCharCode(b);
  }
  return str;
}
function readAB(arb) {
  const u8b = new Uint8Array(arb);
  let _offset = 0;
  function get8() {
    return u8b[_offset++];
  }
  function getStr(n) {
    const str = u8b.subarray(_offset, _offset + n); //.map((v) => atob(v));
    _offset += n;
    return str;
  }
  function get32() {
    return get8() | (get8() << 8) | (get8() << 16) | (get8() << 24);
  }
  const get16 = () => get8() | (get8() << 8);
  const getS16 = () => {
    const u16 = get16();
    if (u16 & 0x8000) return -0x10000 + u16;
    else return u16;
  };
  const readN = (n) => {
    const ret = u8b.slice(_offset, n);
    _offset += n;
    return ret;
  };
  function varLenInt() {
    let n = get8();
    while (n & 0x80) {
      n = get8();
    }
    return n;
  }
  const skip = (n) => {
    _offset = _offset + n;
  };
  const read32String = () => getStr(4);
  const readNString = (n) => getStr(n);
  return {
    skip,
    get8,
    get16,
    getS16,
    readN,
    read32String,
    varLenInt,
    get32,
    readNString,
    get offset() {
      return _offset;
    },
    set offset(n) {
      _offset = n;
    },
  };
}

/* eslint-disable no-unused-vars */
const attributeKeys = [
  "StartAddrOfs",
  "EndAddrOfs",
  "StartLoopAddrOfs",
  "EndLoopAddrOfs",
  "StartAddrCoarseOfs",
  "ModLFO2Pitch",
  "VibLFO2Pitch",
  "ModEnv2Pitch",
  "FilterFc",
  "FilterQ",
  "ModLFO2FilterFc",
  "ModEnv2FilterFc",
  "EndAddrCoarseOfs",
  "ModLFO2Vol",
  "Unused1",
  "ChorusSend",
  "ReverbSend",
  "Pan",
  "Unused2",
  "Unused3",
  "Unused4",
  "ModLFODelay",
  "ModLFOFreq",
  "VibLFODelay",
  "VibLFOFreq",
  "ModEnvDelay",
  "ModEnvAttack",
  "ModEnvHold",
  "ModEnvDecay",
  "ModEnvSustain",
  "ModEnvRelease",
  "Key2ModEnvHold",
  "Key2ModEnvDecay",
  "VolEnvDelay",
  "VolEnvAttack",
  "VolEnvHold",
  "VolEnvDecay",
  "VolEnvSustain",
  "VolEnvRelease",
  "Key2VolEnvHold",
  "Key2VolEnvDecay",
  "Instrument",
  "Reserved1",
  "KeyRange",
  "VelRange",
  "StartLoopAddrCoarseOfs",
  "Keynum",
  "Velocity",
  "Attenuation",
  "Reserved2",
  "EndLoopAddrCoarseOfs",
  "CoarseTune",
  "FineTune",
  "SampleId",
  "SampleModes",
  "Reserved3",
  "ScaleTune",
  "ExclusiveClass",
  "OverrideRootKey",
  "Dummy",
];

function newSFZoneMap(ref, attrs) {
  var obj = { ref };
  for (let i = 0; i < 60; i++) {
    if (attributeKeys[i] == "VelRange" || attributeKeys[i] == "KeyRange") {
      obj[attributeKeys[i]] = {
        hi: (attrs[i] & 0x7f00) >> 8,
        lo: attrs[i] & 0x007f,
      };
    } else {
      obj[attributeKeys[i]] = attrs[i];
    }
  }
  obj.arr = attrs;
  return obj;
}

function s16ArrayBuffer2f32(ab) {
  const b16 = new Int16Array(ab);

  const f32 = new Float32Array(ab.byteLength / 2);
  for (let i = 0; i < b16.length; i++) {
    //} of b16){
    f32[i] = b16[i] / 0xffff;
  }
  return f32;
}

class SF2Service {
  constructor(url) {
    this.url = url;
  }
  async load({ onHeader, onSample, onZone } = {}) {
    const Module = await import('./pdta-8191cea7.js');
    const module = await Module.default();
    const { pdtaBuffer, sdtaStart, infos } = await sfbkstream(this.url);
    const programNames = [];

    function devnull() {}
    const pdtaRef = module._malloc(pdtaBuffer.byteLength);

    module.onHeader = (pid, bid, name) => {
      programNames[pid | bid] = name;
      if (onHeader) onHeader(pid, bid, name);
    };
    module.onSample = (...args) => {
      if (onSample) onSample(args);
    };
    module.onZone = onZone || devnull;
    module.HEAPU8.set(pdtaBuffer, pdtaRef);
    const memend = module._loadpdta(pdtaRef);
    const instRef = (instrumentID) => module._instRef();
    const shdrref = module._shdrref(pdtaRef);
    const presetRefs = new Uint32Array(module.HEAPU32.buffer, module._presetRef(), 255);
    const heap = module.HEAPU8.buffer.slice(0, memend);
    const heapref = new WeakRef(heap);
    this.state = {
      pdtaRef,
      heapref,
      instRef,
      presetRefs,
      heap,
      shdrref,
      programNames,
      sdtaStart,
      infos,
    };
    return this.state;
  }
  get meta() {
    return this.state.infos;
  }
  get programNames() {
    return this.state.programNames;
  }
  get presets() {
    return this.state.presetRefs;
  }
  loadProgram(pid, bkid) {
    const { presetRefs, heap, shdrref, sdtaStart, programNames } = this.state;
    const rootRef = presetRefs[pid | bkid];

    const zMap = [];
    const shdrMap = {};
    let url = this.url;
    for (let zref = rootRef, zone = zref2Zone(zref); zone && zone.SampleId != -1; zone = zref2Zone((zref += 120))) {
      if (zone.SampleId == 0) continue;
      const mapKey = zone.SampleId;
      if (!shdrMap[mapKey]) {
        shdrMap[mapKey] = getShdr(zone.SampleId);
      }
      zMap.push({
        ...zone,
        get shdr() {
          return shdrMap[zone.SampleId];
        },
        get pcm() {
          return shdrMap[zone.SampleId].data();
        },
        get instrument() {
          const instREf = this.state.instRef(zone.Instrument);
          return readASCIIHIlariously(heap, instREf);
        },
        calcPitchRatio(key, sr) {
          const rootkey = zone.OverrideRootKey > -1 ? zone.OverrideRootKey : shdrMap[zone.SampleId].originalPitch;
          const samplePitch = rootkey * 100 + zone.CoarseTune * 100 + zone.FineTune * 1;
          const pitchDiff = (key * 100 - samplePitch) / 1200;
          const r = Math.pow(2, pitchDiff) * (shdrMap[zone.SampleId].sampleRate / sr);
          return r;
        },
      });
    }
    async function preload() {
      await Promise.all(Object.keys(shdrMap).map((sampleId) => shdrMap[sampleId].data()));
    }
    function zref2Zone(zref) {
      const zone = new Int16Array(heap, zref, 60);
      return newSFZoneMap(zref, zone);
    }
    function getShdr(SampleId) {
      const hdrRef = shdrref + SampleId * 46;
      const dv = heap.slice(hdrRef, hdrRef + 46);
      const ascii = new Uint8Array(dv, 0, 20);

      let nameStr = "";
      for (const b of ascii) {
        if (!b) break;
        nameStr += String.fromCharCode(b);
      }
      const [start, end, startloop, endloop, sampleRate] = new Uint32Array(dv, 20, 5);
      const [originalPitch] = new Uint8Array(dv, 20 + 5 * 4, 1);
      const range = [sdtaStart + start * 2, sdtaStart + end * 2 + 1];
      const loops = [startloop - start, endloop - start];
      return {
        nsamples: end - start + 1,
        range,
        loops,
        SampleId,
        sampleRate,
        originalPitch,
        url,
        name: nameStr,
        data: async () => {
          if (shdrMap[SampleId].pcm) return shdrMap[SampleId].pcm;
          const res = await fetch(url, {
            headers: {
              Range: `bytes=${shdrMap[SampleId].range.join("-")}`,
            },
          });
          const ab = await res.arrayBuffer();
          shdrMap[SampleId].pcm = s16ArrayBuffer2f32(ab);
          return shdrMap[SampleId].pcm;
        },
      };
    }
    return {
      zMap,
      preload,
      shdrMap,
      url: this.url,
      zref: rootRef,
      get name() {
        return programNames[pid | bkid];
      },
      filterKV: function (key, vel) {
        return zMap.filter(
          (z) =>
            (vel == -1 || (z.VelRange.lo <= vel && z.VelRange.hi >= vel)) && (key == -1 || (z.KeyRange.lo <= key && z.KeyRange.hi >= key))
        );
      },
    };
  }
}
function readASCIIHIlariously(heap, instREf) {
  const dv = heap.slice(instREf, instREf + 20);
  const ascii = new Uint8Array(dv, 0, 20);
  let nameStr = "";
  for (const b of ascii) {
    if (!b) break;
    nameStr += String.fromCharCode(b);
  }
  return nameStr;
}

export { SF2Service as default };

[36m[1m//→ pdta-8191cea7.js:[22m[39m
var Module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(Module = {})  {

var Module=typeof Module!="undefined"?Module:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides=Object.assign({},Module);var ENVIRONMENT_IS_WEB=true;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readBinary;{if(typeof document!="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(_scriptDir){scriptDirectory=_scriptDir;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.replace(/[?#].*/,"").lastIndexOf("/")+1);}else {scriptDirectory="";}}Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);Object.assign(Module,moduleOverrides);moduleOverrides=null;if(Module["arguments"])Module["arguments"];if(Module["thisProgram"])Module["thisProgram"];if(Module["quit"])Module["quit"];var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];Module["noExitRuntime"]||false;if(typeof WebAssembly!="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;var UTF8Decoder=typeof TextDecoder!="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heapOrArray,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heapOrArray[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heapOrArray.buffer&&UTF8Decoder){return UTF8Decoder.decode(heapOrArray.subarray(idx,endPtr))}var str="";while(idx<endPtr){var u0=heapOrArray[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heapOrArray[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heapOrArray[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heapOrArray[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}var HEAP8,HEAPU8;function updateMemoryViews(){var b=wasmMemory.buffer;Module["HEAP8"]=HEAP8=new Int8Array(b);Module["HEAP16"]=new Int16Array(b);Module["HEAP32"]=new Int32Array(b);Module["HEAPU8"]=HEAPU8=new Uint8Array(b);Module["HEAPU16"]=new Uint16Array(b);Module["HEAPU32"]=new Uint32Array(b);Module["HEAPF32"]=new Float32Array(b);Module["HEAPF64"]=new Float64Array(b);}var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnInit(cb){__ATINIT__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}what="Aborted("+what+")";err(what);ABORT=true;what+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;wasmBinaryFile="data:application/octet-stream;base64,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";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}var binary=tryParseAsDataURI(file);if(binary){return binary}if(readBinary);throw "both async and sync fetching of the wasm failed"}catch(err){abort(err);}}function getBinaryPromise(binaryFile){if(!wasmBinary&&(ENVIRONMENT_IS_WEB)){if(typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+binaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(binaryFile)})}}return Promise.resolve().then(function(){return getBinary(binaryFile)})}function instantiateArrayBuffer(binaryFile,imports,receiver){return getBinaryPromise(binaryFile).then(function(binary){return WebAssembly.instantiate(binary,imports)}).then(function(instance){return instance}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(binary,binaryFile,imports,callback){if(!binary&&typeof WebAssembly.instantiateStreaming=="function"&&!isDataURI(binaryFile)&&typeof fetch=="function"){return fetch(binaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,imports);return result.then(callback,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(binaryFile,imports,callback)})})}else {return instantiateArrayBuffer(binaryFile,imports,callback)}}function createWasm(){var info={"a":wasmImports};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["d"];updateMemoryViews();Module["asm"]["l"];addOnInit(Module["asm"]["e"]);removeRunDependency();return exports}addRunDependency();function receiveInstantiationResult(result){receiveInstance(result["instance"]);}if(Module["instantiateWasm"]){try{return Module["instantiateWasm"](info,receiveInstance)}catch(e){err("Module.instantiateWasm callback failed with error: "+e);readyPromiseReject(e);}}instantiateAsync(wasmBinary,wasmBinaryFile,info,receiveInstantiationResult).catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){callbacks.shift()(Module);}}function _emitHeader(pid,bid,offset){Module.onHeader(pid,bid,Module.AsciiToString(offset));}function _emitZone(pid,ref){Module.onZone(pid,ref,new Int16Array(Module.HEAPU8.buffer,ref,60));}function abortOnCannotGrowMemory(requestedSize){abort("OOM");}function _emscripten_resize_heap(requestedSize){HEAPU8.length;abortOnCannotGrowMemory();}function getCFunc(ident){var func=Module["_"+ident];return func}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer);}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":str=>{var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len);}return ret},"array":arr=>{var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string"){return UTF8ToString(ret)}if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i]);}else {cArgs[i]=args[i];}}}var ret=func.apply(null,cArgs);function onDone(ret){if(stack!==0)stackRestore(stack);return convertReturnValue(ret)}ret=onDone(ret);return ret}function AsciiToString(ptr){var str="";while(1){var ch=HEAPU8[ptr++>>0];if(!ch)return str;str+=String.fromCharCode(ch);}}var decodeBase64=typeof atob=="function"?atob:function(input){var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");do{enc1=keyStr.indexOf(input.charAt(i++));enc2=keyStr.indexOf(input.charAt(i++));enc3=keyStr.indexOf(input.charAt(i++));enc4=keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!==64){output=output+String.fromCharCode(chr2);}if(enc4!==64){output=output+String.fromCharCode(chr3);}}while(i<input.length);return output};function intArrayFromBase64(s){try{var decoded=decodeBase64(s);var bytes=new Uint8Array(decoded.length);for(var i=0;i<decoded.length;++i){bytes[i]=decoded.charCodeAt(i);}return bytes}catch(_){throw new Error("Converting base64 string to bytes failed.")}}function tryParseAsDataURI(filename){if(!isDataURI(filename)){return}return intArrayFromBase64(filename.slice(dataURIPrefix.length))}var wasmImports={"a":_emitHeader,"c":_emitZone,"b":_emscripten_resize_heap};createWasm();Module["_loadpdta"]=function(){return (Module["_loadpdta"]=Module["asm"]["f"]).apply(null,arguments)};Module["_findPreset"]=function(){return (Module["_findPreset"]=Module["asm"]["g"]).apply(null,arguments)};Module["_malloc"]=function(){return (Module["_malloc"]=Module["asm"]["h"]).apply(null,arguments)};Module["_filterForZone"]=function(){return (Module["_filterForZone"]=Module["asm"]["i"]).apply(null,arguments)};Module["_shdrref"]=function(){return (Module["_shdrref"]=Module["asm"]["j"]).apply(null,arguments)};Module["_presetRef"]=function(){return (Module["_presetRef"]=Module["asm"]["k"]).apply(null,arguments)};Module["_fflush"]=function(){return (Module["_fflush"]=Module["asm"]["m"]).apply(null,arguments)};Module["_free"]=function(){return (Module["_free"]=Module["asm"]["n"]).apply(null,arguments)};var stackSave=function(){return (stackSave=Module["asm"]["o"]).apply(null,arguments)};var stackRestore=function(){return (stackRestore=Module["asm"]["p"]).apply(null,arguments)};var stackAlloc=function(){return (stackAlloc=Module["asm"]["q"]).apply(null,arguments)};Module["ccall"]=ccall;Module["AsciiToString"]=AsciiToString;var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}run();


  return Module.ready
}

);
})();

export { Module as default };
