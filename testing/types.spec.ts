import { expect } from "chai";
import SF2Service from "../index.js";
import type { SF2Program, SF2State, ZMap, Shdr } from "../sf2-service.js";

// Type inference tests - these should compile without errors
describe("TypeScript type inference", () => {
  it("should properly infer SF2Service types", () => {
    const url = "https://example.com/test.sf2";
    const sf2: SF2Service = new SF2Service(url);
    
    // Type checking - these properties should exist and have correct types
    const urlCheck: string = sf2.url;
    expect(urlCheck).to.equal(url);
  });

  it("should infer load method return type", async () => {
    const sf2 = new SF2Service("https://example.com/test.sf2");
    
    // The load method should return Promise<SF2State>
    // This test just checks that TypeScript can infer the types correctly
    const loadOptions = {
      onHeader: (pid: number, bid: number, name: string) => {
        console.log(`Header: ${pid}, ${bid}, ${name}`);
      },
      onSample: (...args: any[]) => {
        console.log("Sample:", args);
      }
    };
    
    // Type checking - load should accept options
    expect(typeof sf2.load).to.equal("function");
  });

  it("should infer SF2State properties", () => {
    // This is a type-checking test - it verifies the structure compiles
    const mockState: Partial<SF2State> = {
      programNames: ["Piano", "Guitar"],
      infos: [["INFO", "Test"]],
      sdtaStart: 0
    };
    
    expect(mockState.programNames).to.exist;
    expect(mockState.infos).to.exist;
  });

  it("should infer SF2Program properties", () => {
    // Type-checking test for SF2Program
    const mockProgram: Partial<SF2Program> = {
      pid: 0,
      bkid: 0,
      name: "Test Program",
      url: "https://example.com/test.sf2",
      zMap: []
    };
    
    expect(mockProgram.pid).to.exist;
    expect(mockProgram.name).to.exist;
  });

  it("should infer ZMap properties", () => {
    // Type-checking test for ZMap
    const mockZone: Partial<ZMap> = {
      pid: 0,
      bkid: 0,
      SampleId: 1,
      KeyRange: { lo: 0, hi: 127 },
      VelRange: { lo: 0, hi: 127 }
    };
    
    expect(mockZone.SampleId).to.exist;
    expect(mockZone.KeyRange).to.exist;
  });

  it("should infer Shdr properties and methods", () => {
    // Type-checking test for Shdr
    const mockShdr: Partial<Shdr> = {
      nsamples: 1000,
      range: [0, 2000],
      loops: [100, 900],
      SampleId: 1,
      sampleRate: 44100,
      originalPitch: 60,
      name: "Test Sample",
      url: "https://example.com/test.sf2"
    };
    
    expect(mockShdr.nsamples).to.exist;
    expect(mockShdr.sampleRate).to.exist;
  });

  it("should allow method calls with correct signatures", () => {
    const sf2 = new SF2Service("https://example.com/test.sf2");
    
    // These should type-check correctly
    expect(typeof sf2.loadProgram).to.equal("function");
    
    // loadProgram should accept two numbers
    // This is a compile-time type check
    const checkProgramLoad = (pid: number, bkid: number) => {
      return sf2.loadProgram(pid, bkid);
    };
    
    expect(checkProgramLoad).to.exist;
  });
});
