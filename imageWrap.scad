include <heightmap.scad>

$vpt = [0, 0, 50];
$vpr = [60, 0, 360 * $t];
$vpd = 330;

function cylindricalToCartesian(point) =
	let (r = point[0])
	let (theta = point[1])
	let (z = point[2])
	// Returned as [x,y,z]
	[r*cos(theta), r*sin(theta), z];

function cartesianToCylindrical(point) =
	let (x = point[0])
	let (y = point[1])
	let (z = point[2])
	// Returned as [r,theta,z]
	[sqrt(x^2 + y^2), atan(y/x), z];

// Heightmap should be one long list of individual numbers representing the image values from bottom left in rows going up
function heightmapToCylinderPolyhedronPoints(heightmap, imgWidth, imgHeight, depthFactor, cylHeight, cylBaseRadius) =
	let (heightIncrement = cylHeight/imgHeight)
	let (thetaIncrement = 360/imgWidth)
	[
		for (y = [0 : imgHeight - 1], x = [0 : imgWidth - 1])
			let (val = heightmap[y * imgWidth + x])
			cylindricalToCartesian(
				[
					cylBaseRadius + depthFactor * val,
					x * thetaIncrement,
					y * heightIncrement
				]
			)
	];

function cylinderPolyhedronCurvedFaces(imgWidth, imgHeight) =
	[
		// imgHeight - 2 to account for hitting the top edge
		for (y = [0 : imgHeight - 2], x = [0 : imgWidth - 1])
			let (currentRowIndex = y * imgWidth)
			let (currentIndex = currentRowIndex + x)
			// p1 p2
			// p0 p3
			let (p0 = currentIndex)
			let (p1 = currentIndex + imgWidth)
			let (p2 = currentIndex + 1 + imgWidth)
			let (p2_1 = p2 >= currentRowIndex + 2 * imgWidth ? p2 - imgWidth : p2)
			let (p3 = currentIndex + 1)
			let (p3_1 = p3 >= currentRowIndex + imgWidth ? p3 - imgWidth : p3)
			[p0, p1, p2_1, p3_1]
	];

function cylinderPolyhedronCapFaces(imgWidth, imgHeight) =
	[
		[for (i = [0 : imgWidth - 1]) i],
		[for (i = [imgHeight * imgWidth - 1 : -1 : (imgHeight - 1) * imgWidth]) i]
	];

module HeightmapCylinderPolyhedron(heightmap, imgWidth, imgHeight, depthFactor, cylHeight, cylBaseRadius) {
	polyhedron(
		points = heightmapToCylinderPolyhedronPoints(heightmap, imgWidth, imgHeight, depthFactor, cylHeight, cylBaseRadius),
		faces = concat(cylinderPolyhedronCurvedFaces(imgWidth, imgHeight),
			cylinderPolyhedronCapFaces(imgWidth, imgHeight))
	);
}

// totalPoints = 600;
// random = rands(0, 1, totalPoints);
// hm = [for (x = [0 : totalPoints]) random[x]];
// HeightmapCylinderPolyhedron(hm, 30, 20, 1, 10, 5);
HeightmapCylinderPolyhedron(imageHeightmap, 150, 100, 0.03, 100, 150/PI/2);
