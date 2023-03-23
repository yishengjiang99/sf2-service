import { mkcanvas, chart } from "https://unpkg.com/mk-60fps@1.1.0/chart.js";
import { mkdiv, wrapList } from "https://unpkg.com/mkdiv@3.1.0/mkdiv.js";
import { SpinNode } from "../node_modules/sf2rend/spin/spin.js";

import SF2Service from "../index.js";
const sf2url = "../file.sf2";

const sf2file = new SF2Service(sf2url);
const loadWait = sf2file.load();
renderMain();
window.addEventListener("click", start, { once: true });
window.addEventListener("hashchange", renderMain);
async function start() {
  const ctx = new AudioContext();
  if (ctx.state == "suspended") {
    await ctx.resume();
  }

  const { spinner } = await mkpath(ctx);
  const sf2 = new SF2Service("file.sf2");
  await sf2.load();
  const p = sf2.loadProgram(4, 0);
  await spinner.shipProgram(sf2.loadProgram(p, 0), 4);
  const zones = p.filterKV(50, 50).filter((z) => z.SampleId !== 0);
  let i = 0;
  while (zones.length) {
    spinner.keyOn(0, zones.shift(), i + 50, i + 30);
    spinner.KeyOff(9, i + 50, i + 70);
    console.log(zones.length);
    i++;
  }
  console.log(zones);
  window.addEventListener("click", start, { once: true });
}
export default async function mkpath(ctx) {
  if (ctx.state !== "running") {
    await ctx.resume();
  }
  await SpinNode.init(ctx);
  const spinner = new SpinNode(ctx, 16);
  const merger = new GainNode(ctx);
  const masterMixer = new GainNode(ctx, { gain: 1.0 });
  for (let i = 0; i < 16; i++) {
    spinner.connect(merger, i, 0);
  }
  merger.connect(masterMixer).connect(ctx.destination);

  return {
    spinner,
    masterMixer,
    merger,
  };
}

async function renderMain() {
  await loadWait;
  document.body.innerHTML = "";
  const progList = mkdiv(
    "ul",
    { class: "notes-list" },
    sf2file.programNames.map((n, presetId) =>
      mkdiv(
        "div",
        { class: "menu-link" },
        mkdiv("a", { href: `#${presetId}` }, n)
      )
    )
  );
  const [leftNav, rightPanel] = [
    mkdiv(
      "section",
      {
        class: "col sidebar",
      },
      [
        mkdiv(
          "section",
          { class: "sidebar-header" },
          sf2file.url.split("/").pop()
        ),
        mkdiv("nav", {}, progList),
      ]
    ),
    mkdiv("div", { class: "col note-viewer" }),
  ];
  const main = mkdiv("div", { class: "main" }, [leftNav, rightPanel]);
  const [presetId, zref] = document.location.hash.substring(1).split("|");
  const intpre = parseInt(presetId);
  const pid = intpre;
  const bid = 0;
  const program = sf2file.loadProgram(pid, bid);
  const kRangeList = program.zMap.map(
    (z) =>
      `<option value=${z.ref} ${z.ref + "" == zref ? "selected" : ""}>${
        z.SampleId
      } ${
        "key " +
        [z.KeyRange.lo, z.KeyRange.hi].join("-") +
        " vel " +
        [z.VelRange.lo, z.VelRange.hi].join("-")
      }</option>`
  );
  const articleHeader = mkdiv("div", { class: "note-header" }, [
    mkdiv(
      "div",
      { class: "note-menu" },
      mkdiv(
        "select",
        {
          oninput(e) {
            document.location.hash = [presetId, e.target.value].join("|");
          },
        },
        kRangeList
      )
    ),
  ]);
  main.attachTo(document.body);

  let zoneSelect = zref
    ? program.zMap.find((z) => z.ref + "" == zref)
    : program.zMap[0];

  if (zoneSelect) {
    const zattrs = Object.entries(zoneSelect).filter(
      ([attr, val], idx) => val && idx < 60
    );

    const articleMain = mkdiv("div", { class: "note-preview" }, [
      mkdiv(
        "div",
        {
          style:
            "display:flex flex-direction:row; max-height:50vh; overflow-y:scroll; gap:0 20px 20px",
        },
        [
          mkdiv("div", [
            "smpl: ",
            zoneSelect.shdr.SampleId,
            " ",
            zoneSelect.shdr.name,
            "<br>nsample: ",
            zoneSelect.shdr.nsamples,
            "<br>srate: " + zoneSelect.shdr.originalPitch,
            "<br>Range: ",
            zoneSelect.shdr.range.join("-"),
            "<br>",
            "loop: ",
            zoneSelect.shdr.loops.join("-"),

            JSON.stringify(zoneSelect.KeyRange),
          ]),
          ..."Addr,KeyRange,Attenuation,VolEnv,Filter,LFO"
            .split(",")
            .map((keyword) =>
              mkdiv(
                "div",
                { style: "padding:10px;color:gray;" },
                zattrs
                  .filter(([k]) => k.includes(keyword))
                  .map(([k, v]) => k + ": " + v)
                  .join("<br>")
              )
            ),
        ]
      ),
    ]);
    const pcm = await zoneSelect.shdr.data();
    const canvas = mkcanvas({ container: articleHeader });
    chart(canvas, pcm);
    const mainRight = mkdiv("div", { class: "note" }, [
      mkdiv("div", { class: "note-title" }, [sf2file.programNames[presetId]]),
      articleHeader,
      articleMain,
    ]);

    mainRight.attachTo(main);
  }
  console.log(program);
  await program.preload();
}
