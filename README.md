# image-to-ring
This is a command line utility that allows you to wrap an image (interpreted as a grayscale heightmap with black = 0 and white = 255) around a cylinder in order to create a 3D model (an STL file). This is primarily useful for creating rings and texture rollers.

# Installation
1. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) this repository.
1. Install [OpenSCAD](http://openscad.org/downloads.html).
	* These instructions assume you are running Windows. If you install somewhere other than the default location (`C:\Program Files\OpenSCAD\openscad`), you'll have to update the path in [image-to-ring.js](image-to-ring.js) with the installation directory.
	* On MacOS you might have to follow [these instructions](https://en.wikibooks.org/wiki/OpenSCAD_User_Manual/Using_OpenSCAD_in_a_command_line_environment#MacOS_notes) to get the command line interface to OpenSCAD working. You'll also have to update the path in [image-to-ring.js](image-to-ring.js) with the correct installation directory.
1. Install [Node.js](https://nodejs.org/en/download).
1. Run `npm install` from the root directory of this repo.

# How to Use
As a quick start, or to check if everything is installed correctly
```
node image-to-ring.js
```

## Options
The following are the available command line options in this project. Please refer to this diagram for the bolded terms used in this document:
![Ring diagram](assets/RingDiagram.svg)

* `-i <image-path>`\
`--image <image-path>`\
Specify the path to the raster image (`png` files recommended) you want used as a heightmap for the model. Make sure to surround the path with quotation marks.
	* Defaults to `"input.png"`.
* `-r <radius>`\
`--radius <radius>`\
Define the **radius** of the cylinder (in mm) that the image heightmap should be built on top of.
	* Defaults to `8.545`.
* `-t <heightmap-thickness>`\
`--thickness <heightmap-thickness>`\
What is the desired **heightmap thickness** in mm? That is, given an image that contains at least one pixel of full white (`#ffffff`), how thick should the heightmap be from the highest point to the **radius** of the cylinder.
	* Defaults to `0.5`.
* `-h <hole-radius>`\
`--hole-radius <hole-radius>`\
How big should the ring **hole radius** be in mm? Set this to 0 to have no hole at all (a full cylinder).
	* Defaults to `0`.

# Examples
Here are some model screenshots and the images/commands used to create them.

### William Morris Venetian Ring
![William Morris Venetian](assets/william-morris-venetian.png)
![William Morris Venetian Result](assets/william-morris-venetian-result.png)
```
node image-to-ring.js -i assets/william-morris-venetian.png
```
### Maze Ring
![Maze](assets/maze.png)
![Maze Result](assets/maze-result.png)
```
node image-to-ring.js -i assets/maze.png -h 7.445
```
### Sinusoid Pattern Ring
![Sinusoid Pattern](assets/sinusoid.png)
![Sinusoid Pattern Result](assets/sinusoid-result.png)
```
node image-to-ring.js -i assets/sinusoid.png -h 7.445
```
### Minkowski Curve Ring
![Minkowski Curve](assets/minkowski-curve.png)
![Minkowski Curve Result](assets/minkowski-curve-result.png)
```
node image-to-ring.js -i assets/minkowski-curve.png -h 7.445
```
### Circles Ring
![Circles](assets/circles.png)
![Circles Result](assets/circles-result.png)
```
node image-to-ring.js -i assets/circles.png -h 7.445 -t 2 -r 6.945
```
### Brick Texture Roller
![Brick Texture Roller](assets/brick-texture-roller.png)
![Brick Texture Roller Result](assets/brick-texture-roller-result.png)
```
node image-to-ring.js -i assets/brick-texture-roller.png -r 25 -t 2
```

# Notes
* Generating the 3D model is extremely slow (especially if **hole radius** != 0). If you are iterating quickly, I recommend using a reduced resolution version of your image during the design process.
	* In the future, I'm hoping to move to a different technology to improve performance.
* By making the **hole radius** > **radius**, the bottom of the heightmap (darkest areas) will cut all the way through the ring, allowing for some interesting results.
	* If you do this, make sure **hole radius** - **radius** > 0.001 or the design might not actually cut through the surface.
* If you are intending to make a ring, this [table of ring sizes](https://en.wikipedia.org/wiki/Ring_size#Equivalency_table) in several different measurement systems is useful.
* The height of the cylinder that's generated depends on the aspect ratio of the input image and the cylinder **radius** specified. As such, you may need to compute a good aspect ratio for the image to get the desired **ring width**.
	* To compute the image aspect ratio `a` for a desired **ring width** `w`, you can do:
		* `a = 2 * radius * π / w`
	* As an example, let's say I want to create a US size 4 ring with a total **ring thickness** of 1.6mm and a **width** of 5mm. If we assume a **heightmap thickness** of 0.5mm, that means we need a **base thickness** of 1.6mm - 0.5mm = 1.1mm. A US size 4 ring has an internal diameter of 14.89mm or a **hole radius** of half that: 7.445mm. That means the cylinder **radius** is 7.445mm + 1.1mm = 8.545mm. Plug that into the equation and we get: `a = 2 * 8.545 * π / 5 ≈ 10.7`. That means the image aspect ratio needs to be about 10.7:1.
* Using [GIMP](https://www.gimp.org/)'s Bloom filter (Filters -> Light and Shadow -> Bloom) can create nice gradients in designs that result in a scalloped effect.
* There are various services that will 3D print a ring in metal for you from a model. However, be aware of the use of [conflict minerals](https://en.wikipedia.org/wiki/Conflict_minerals_law) in this process before you decide to proceed.