import {load} from "./index.js";
import {mkcanvas,chart,resetCanvas} from "https://unpkg.com/draw-canvas-60fps@1.0.1/chart.js";
document.body.id = "mocha";
mocha.setup("bdd");
const expect = globalThis.chai.expect;
const cctx=mkcanvas(244,230,document.body);

describe("pdtaquery", () => {
	it("parswes file and loads zones",()=>{
		load("file.sf2").then(({zoneSampleHeaders,setProgram,noteOn})=>{
			const sf=	setProgram(0,2);
			console.log(noteOn(2,44,33));//;noteOn(2,44,33);
			for(const sh of zoneSampleHeaders(sf)){
				expect(sh[1]>sh[0]);
			}
		});
	})
});
describe("pdtaquery", () => {
	it("parswes file and loads zones", () => {
    load("file.sf2").then(
      ({ zoneSampleHeaders, setProgram, noteOn, zref2Zone }) => {
        const sf = setProgram(0, 2);
        const iter = zoneSampleHeaders(sf);
        for (const sh of iter) {
          expect(sh.range).exists;
          fetch("file.sf2", { headers: { Range: sh.range } })
            .then((res) => res.arrayBuffer())
            .then((ab) => {
              const b16 = new Int16Array(ab);
              const f32 = new Float32Array(ab.byteLength / 2);
              let i = 0;
              for (let i = 0; i < b16.length; i++) {
                //} of b16){
                f32[i] = b16[i] / 0xffff;
              }
              chart(mkcanvas(330, 420, document.body), f32);
            });
        }
        const zref = noteOn(2, 45, 22);
      }
    );
  });
});

mocha.run();
