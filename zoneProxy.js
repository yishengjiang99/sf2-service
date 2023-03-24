/* eslint-disable no-unused-vars */
export const attributeKeys = [
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

export function newSFZoneMap(ref, attrs) {
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

/**
 * proxys comma-separated str of attributes into
 * dot-accessing objects to make beter autocompletes in vscode
 * @param attrs csv strings
 * @returns Proxy<string,number>
 */
export function newSFZone(zone) {
  let lastUpdate = new Date();
  let lastSync = 0;
  return new Proxy(zone, {
    get: (target, key) => {
      if (key == "arr") return zone.arr;
      if (key == "ref") return zone.ref;
      if (key == "sample" || key == "shdr") return zone.sample;
      if (key == "isDirty") return lastUpdate > lastSync;
      const idx = attributeKeys.indexOf(key);
      if (idx > -1) return target.arr[idx];
      if (key == "calcPitchRatio") return target.calcPitchRatio;
    },
    set: (target, key, val) => {
      const idx = attributeKeys.indexOf(key);
      if (idx > -1) {
        lastUpdate = new Date();
        target.arr[idx] = parseInt(val);
        return true;
      }
      return false;
    },
  });
}
export function semitone2hz(c) {
  return Math.pow(2, (c - 6900) / 1200) * 440;
}
