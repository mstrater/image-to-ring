import getPixels from "get-pixels";
//const getPixels = require("get-pixels");
import * as fs from 'fs';
import { parseArgs } from "node:util";

const src = "input.png";
const startContent = "imageHeightmap = [";
const endContent = "];\n";

// Handle CLI args
const {
	values: { name, cool },
} = parseArgs({
	options: {
	name: {
		type: "string",
		short: "n",
	},
	cool: {
		type: "boolean",
		short: "c",
	},
	},
});

getPixels(src, (err, pixels) => {
	if(err) {
		console.error(err);
		return;
	}

	const width = pixels.shape[0];
	const height = pixels.shape[1];

	const stream = fs.createWriteStream("heightmap.scad");
	stream.write("imageWidth = " + width + ";\n");
	stream.write("imageHeight = " + height + ";\n");

	stream.write(startContent);

	for (let y = height - 1; y >= 0; y--) {
		for (let x = 0; x < width; x++) {
			const r = pixels.get(x, y, 0);
			const g = pixels.get(x, y, 1);
			const b = pixels.get(x, y, 2);
			//const a = pixels.get(x, y, 3);
			const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
			stream.write(grayscale.toString());
			if (x !== width - 1 || y !== 0) {
				stream.write(",");
			}
		}
	}

	stream.write(endContent);
	stream.close();
	console.log("Finished generating heightmap");
});
