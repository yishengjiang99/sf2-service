export async function sfbkstream(url) {
	const ab = await (await fetch(url, { headers: { Range: "bytes=0-6400" } })).arrayBuffer();
	const [preample, r] = skipToSDTA(ab);
	const sdtaSize = r.get32();
	const sdtaStart = r.offset + 8;
	const pdtastart = sdtaStart + sdtaSize + 4;

	const pdtaHeader = {
		headers: { Range: "bytes=" + pdtastart + "-" },
	};

	return {
		nsamples: (pdtastart - sdtaStart) / 2,
		sdtaStart,
		infos: preample,
		pdtaBuffer: new Uint8Array(await (await fetch(url, pdtaHeader)).arrayBuffer()),
	};
}
function skipToSDTA(ab) {
	const infosection = new Uint8Array(ab);
	const r = readAB(infosection);
	const [riff, filesize, sig, list] = [
		r.readNString(4),
		r.get32(),
		r.readNString(4),
		r.readNString(4),
	];
	console.assert(riff == "RIFF" && sig == "sfbk");
	let infosize = r.get32();

	const infos = [];
	while (infosize >= 8) {
		const [section, size] = [r.readNString(4), r.get32()];
		infos.push({ section, text: r.readNString(size) });
		infosize = infosize - 8 - size;
	}
	console.assert(r.readNString(4) == "LIST");
	return [infos, r];
}
export function readAB(arb) {
	const u8b = new Uint8Array(arb);
	let _offset = 0;
	function get8() {
		return u8b[_offset++];
	}
	function getStr(n) {
		let str = "";
		let nullterm = 0;
		for (let i = 0; i < n; i++) {
			const c = get8();
			if (c == 0x00) nullterm = 1;
			if (nullterm == 0) str += String.fromCharCode(c);
		}
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