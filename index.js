const getPixels = require("get-pixels");
const fs = require("fs");

const src = "input.png";
const startContent = "imageHeightmap = [";
const endContent = "];";

getPixels(src, (err, pixels) => {
	if(err) {
		console.error("Bad image path");
		return;
	}

	const stream = fs.createWriteStream("heightmap.scad");
	stream.write(startContent);

	const width = pixels.shape[0];
	const height = pixels.shape[1];
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
	console.log("Finished!");
});
