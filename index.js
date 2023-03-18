import getPixels from "get-pixels";
import * as fs from 'fs';
import { parseArgs } from "node:util";
import { exec } from 'child_process';
//const execProm = promisify(exec);

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

	console.log("Generating heightmap from image.")

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
	stream.close((error) => {
		if (error) {
			console.error("An error occurred: " + error);
		} else {
			console.log("Finished generating heightmap.\nGenerating model, please wait" +
				" until you see \"Finished!\" in the console. It can take quite a while...");
			const scadProc = exec("\"C://Program Files/OpenSCAD/openscad\" -o output.stl heightmapToRing.scad", (error, stdout, stderr) => {
				if (error) {
					console.error("An error occurred: " + error);
				} else {
					console.log("Finished! See output.stl for results.");
				}
			});
			scadProc.stdout.on('data', (data) => {
				console.log(data); 
			});
		}
	});
});
