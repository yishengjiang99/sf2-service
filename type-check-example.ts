// This file demonstrates that the module can be imported and used in TypeScript
// It serves as a type-checking example that verifies all type definitions work correctly

import SF2Service from "./index.js";

// Create an instance with type inference
const service = new SF2Service("https://example.com/soundfont.sf2");

// Access properties - TypeScript should infer correct types
const url: string = service.url;

// Call methods - TypeScript should validate signatures
async function example() {
  // Load with options
  const state = await service.load({
    onHeader: (pid: number, bid: number, name: string) => {
      console.log(`Preset ${pid}:${bid} - ${name}`);
    },
    onSample: (...args: any[]) => {
      console.log("Sample loaded:", args);
    },
    onZone: (...args: any[]) => {
      console.log("Zone:", args);
    }
  });

  // Access state properties with type inference
  const programNames: string[] = state.programNames;
  const presets: Uint32Array = state.presetRefs;
  const infos: [string, string][] = state.infos;

  // Load a program
  const program = service.loadProgram(0, 0);
  
  // Access program properties with type inference
  const pid: number = program.pid;
  const bkid: number = program.bkid;
  const programName: string = program.name;
  const programUrl: string = program.url;
  
  // Use program methods
  const zones = program.filterKV(60, 100);
  await program.preload();
  
  // Access zones with type inference
  for (const zone of program.zMap) {
    const sampleId: number = zone.SampleId;
    const keyRange = zone.KeyRange;
    const pitchRatio = zone.calcPitchRatio(60, 44100);
    
    // Access sample header
    const shdr = zone.shdr;
    const sampleData = await shdr.data();
  }
}

// This file doesn't need to run, it just needs to compile
// to verify that TypeScript can properly infer all types
console.log("Type checking successful");
