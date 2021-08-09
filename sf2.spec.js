/* eslint-disable no-undef */
import { load } from "./read.js";
import {
  mkcanvas,
  chart,
  resetCanvas,
  renderFrames,
} from "https://unpkg.com/mk-60fps/chart.js";
document.body.id = "mocha";
// eslint-disable-next-line no-undef
mocha.setup("bdd");
const expect = globalThis.chai.expect;
const cctx = mkcanvas(244, 230, document.body);

describe("pdtaquery", () => {
  it("parswes file and loads zones", () => {
    load("file.sf2").then(async ({ loadProgram, getFont }) => {
      const sfz = loadProgram(0, 0);
      const z = sfz.filterKV(55, 64);
      renderFrames(mkcanvas(), await sfz.filterKV(55, 22).shift().pcm);
      renderFrames(mkcanvas(), await sfz.filterKV(55, 66).shift().pcm);
      renderFrames(mkcanvas(), await sfz.filterKV(55, 98).shift().pcm);
    });
  });
});
// describe("pdtaquery", () => {
//   it("parswes file and loads zones", () => {
//     load("file.sf2").then(({ loadZone, setProgram, noteOn, zref2Zone }) => {
//       const sf = setProgram(0, 2);
//       const iter = loadZone(0);
//       for (const sh of iter) {
//         expect(sh.range).exists;
//         fetch("file.sf2", { headers: { Range: sh.range } })
//           .then((res) => res.arrayBuffer())
//           .then((ab) => {
//             const b16 = new Int16Array(ab);
//             const f32 = new Float32Array(ab.byteLength / 2);
//             let i = 0;
//             for (let i = 0; i < b16.length; i++) {
//               //} of b16){
//               f32[i] = b16[i] / 0xffff;
//             }
//             chart(mkcanvas(330, 420, document.body), f32);
//           });
//       }
//       const zref = noteOn(2, 45, 22);
//     });
//   });
// });

mocha.run();
