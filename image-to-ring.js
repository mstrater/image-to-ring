import getPixels from "get-pixels";
import * as fs from 'fs';
import { parseArgs } from "node:util";
import { exec } from 'child_process';

const startContent = "imageHeightmap = [";
const endContent = "];\n";

// Handle CLI args
const {
	values: { imagePath, radius, thickness, holeRadius },
} = parseArgs({
	options: {
		imagePath: {
			type: "string",
			short: "i",
		},
		radius: {
			type: "string",
			short: "r",
		},
		thickness: {
			type: "string",
			short: "t",
		},
		holeRadius: {
			type: "string",
			short: "h",
		},
	},
});

// Parse CLI args and use default values if needed
let imagePathArg = imagePath ?? "input.png";
let radiusArg = parseFloat(radius);
radiusArg = isNaN(radiusArg) ? 8.545 : radiusArg;
let thicknessArg = parseFloat(thickness);
thicknessArg = isNaN(thicknessArg) ? 0.5 : thicknessArg;
let holeRadiusArg = parseFloat(holeRadius);
holeRadiusArg = isNaN(holeRadiusArg) ? 7.445 : holeRadiusArg;

getPixels(imagePathArg, (err, pixels) => {
	if(err) {
		console.error(err);
		return;
	}

	console.log("Generating heightmap from image.");

	// Generate the parameter/heightmap scad file
	const stream = fs.createWriteStream("heightmap.scad");
	// Write out the CLI args
	const rString = "radius = " + radiusArg + ";\n";
	const tString = "thickness = " + thicknessArg + ";\n";
	const hString = "holeRadius = " + holeRadiusArg + ";\n";
	const argsString = rString + tString + hString;
	console.log(argsString)
	stream.write(argsString);

	const width = pixels.shape[0];
	const height = pixels.shape[1];

	// Write out the image size
	const widthString = "imageWidth = " + width + ";\n";
	const heightString = "imageHeight = " + height + ";\n";
	const sizeString = widthString + heightString;
	console.log(sizeString);
	stream.write(sizeString);

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
