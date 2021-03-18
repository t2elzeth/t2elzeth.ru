const path = require("path");
const fs = require('fs');
const readlineSync = require('readline-sync');
const inkjet = require('inkjet');
const im = require('imagemagick');
const PNG = require('pngjs').PNG;
let Module = require('./libs/NftMarkerCreator_wasm.js');

let validImageExt = [".jpg",".jpeg",".png"];
let srcImage, buffer;
// let outputPath = '../main_backend/static/img-tracking/data/nft/';
let outputPath = "/output/"
let foundInputPath = {
    b: false,
    i: -1
}

let imageData = {
    sizeX: 0,
    sizeY: 0,
    nc: 0,
    dpi: 0,
    array: []
}

Module.onRuntimeInitialized = async function(){
    for (let j = 2; j < process.argv.length; j++) {
        if(process.argv[j].indexOf('-i') !== -1 || process.argv[j].indexOf('-I') !== -1){
            foundInputPath.b = true;
            foundInputPath.i = j+1;
            j++;
        }
    }

    if(!foundInputPath.b){
        console.log("\nERROR: No image in INPUT command!\n e.g:(-i /PATH/TO/IMAGE)\n");
        process.exit(1);
    }else{
        srcImage = path.join(__dirname, process.argv[foundInputPath.i]);
    }

    let fileNameWithExt = path.basename(srcImage);
    let fileName = path.parse(fileNameWithExt).name;
    let extName = path.parse(fileNameWithExt).ext.toLowerCase();

    if(validImageExt.indexOf(extName) === -1){
        console.log("\nERROR: Invalid image TYPE!\n Valid types:(jpg,JPG,jpeg,JPEG,png,PNG)\n");
        process.exit(1);
    }

    if(!fs.existsSync(srcImage)){
        console.log("\nERROR: Not possible to read image, probably invalid image PATH!\n");
        process.exit(1);
    }else{
        buffer = fs.readFileSync(srcImage);
    }

    console.log('Check output path: ' + path.join(__dirname, outputPath));
    if(!fs.existsSync(path.join(__dirname, outputPath))){
        fs.mkdirSync(path.join(__dirname, outputPath));
    }

    if (extName === ".jpg" || extName === ".jpeg") {
        await useJPG(buffer)
    } else if (extName === ".png") {
        usePNG(buffer);
    }

    let StrBuffer = Module._malloc(1);
    Module.writeStringToMemory("", StrBuffer);

    let heapSpace = Module._malloc(imageData.array.length * imageData.array.BYTES_PER_ELEMENT);
    Module.HEAPU8.set(imageData.array, heapSpace);

    Module._createImageSet(heapSpace, imageData.dpi, imageData.sizeX, imageData.sizeY, imageData.nc, StrBuffer)
    
    Module._free(heapSpace);
    Module._free(StrBuffer);

    let filenameIset = "asa.iset";
    let filenameFset = "asa.fset";
    let filenameFset3 = "asa.fset3";

    let ext = ".iset";
    let ext2 = ".fset";
    let ext3 = ".fset3";

    let content = Module.FS.readFile(filenameIset);
    let contentFset = Module.FS.readFile(filenameFset);
    let contentFset3 = Module.FS.readFile(filenameFset3);

    fs.writeFileSync(path.join(__dirname, outputPath) + fileName + ext, content);
    fs.writeFileSync(path.join(__dirname, outputPath) + fileName + ext2, contentFset);
    fs.writeFileSync(path.join(__dirname, outputPath) + fileName + ext3, contentFset3);

    process.exit(0);
}

async function useJPG(buf) {
    inkjet.decode(buf, function (err, decoded) {
        if (err) {
            console.log("\n" + err + "\n");
            process.exit(1);
        } else {
            let newArr = [];

            let verifyColorSpace = detectColorSpace(decoded.data);

            if (verifyColorSpace === 1) {
                for (let j = 0; j < decoded.data.length; j += 4) {
                    newArr.push(decoded.data[j]);
                }
            } else if (verifyColorSpace === 3) {
                for (let j = 0; j < decoded.data.length; j += 4) {
                    newArr.push(decoded.data[j]);
                    newArr.push(decoded.data[j + 1]);
                    newArr.push(decoded.data[j + 2]);
                }
            }

            let uint = new Uint8Array(newArr);
            imageData.nc = verifyColorSpace;
            imageData.array = uint;
        }
    });
    
    await extractExif(buf);
    // console.log('after extractExif')
}

function extractExif(buf) {
    return new Promise((resolve)=>{
        inkjet.exif(buf, async function (err, metadata) {
            if (err) {
                console.log("\n" + err + "\n");
                process.exit(1);
            } else {
                if (metadata === null || metadata === undefined || Object.keys(metadata).length === undefined || Object.keys(metadata).length <= 0) {
                    // console.log(metadata);
                    let ret = await imageMagickIdentify(srcImage);
                    console.log('ret:', ret);
                    {
                    if(ret.err){
                        console.log(ret.err);
                        let answer = readlineSync.question('The EXIF info of this image is empty or it does not exist. Do you want to inform its properties manually?[y/n]\n');
        
                        if (answer === "y") {
                            let answerWH = readlineSync.question('Inform the width and height: e.g W=200 H=400\n');
        
                            let valWH = getValues(answerWH, "wh");
                            imageData.sizeX = valWH.w;
                            imageData.sizeY = valWH.h;
        
                            let answerDPI = readlineSync.question('Inform the DPI: e.g DPI=220 [Default = 72](Press enter to use default)\n');
        
                            if (!answerDPI) {
                                imageData.dpi = 72;
                            } else {
                                imageData.dpi = getValues(answerDPI, "dpi");
                            }
                        } else {
                            console.log("Exiting process!")
                            process.exit(1);
                        }
                    } else {
                        //console.log(ret.features);
                        imageData.sizeX = ret.features.width;
                        imageData.sizeY = ret.features.height;
                        let resolution = ret.features.resolution;
                        let dpi = null;
                        if(resolution) {
                            let resolutions = resolution.split('x');
                            if(resolutions.length === 2) {
                                dpi = Math.min(parseInt(resolutions[0]), parseInt(resolutions[1]));
                                if (dpi === null || dpi === undefined || isNaN(dpi)) {
                                    // console.log("\nWARNING: No DPI value found! Using 72 as default value!\n")
                                    dpi = 72;
                                }
                            }
                            
                        } else {
                            dpi = 72;
                        }
                        
                        imageData.dpi = dpi;
                        // console.log(imageData);
                    }
                }
                } else {
                    let dpi = Math.min(parseInt(metadata["Image Width"].value), parseInt(metadata["Image Height"].value));

                    if (dpi === null || dpi === undefined || isNaN(dpi)) {
                        console.log("\nWARNING: No DPI value found! Using 72 as default value!\n")
                        dpi = 72;
                    }
    
                    if (metadata["Image Width"].value === null || metadata["Image Width"] === undefined) {
                        if (metadata.PixelXDimension === null || metadata.PixelXDimension === undefined) {
                            let answer = readlineSync.question('The image does not contain any width or height info, do you want to inform them?[y/n]\n');
                            if (answer === "y") {
                                let answer2 = readlineSync.question('Inform the width and height: e.g W=200 H=400\n');
    
                                let vals = getValues(answer2, "wh");
                                imageData.sizeX = vals.w;
                                imageData.sizeY = vals.h;
                            } else {
                                console.log("It's not possible to proceed without width or height info!")
                                process.exit(1);
                            }
                        } else {
                            imageData.sizeX = metadata.PixelXDimension.value;
                            imageData.sizeY = metadata.PixelYDimension.value;
                        }
                    } else {
                        imageData.sizeX = metadata["Image Width"].value;
                        imageData.sizeY = metadata["Image Height"].value;
                    }
    
                    if (metadata.SamplesPerPixel === null || metadata.ImageWidth === undefined) {
                        // let answer = readlineSync.question('The image does not contain the number of channels(nc), do you want to inform it?[y/n]\n');
    
                        // if(answer === "y"){
                        //     let answer2 = readlineSync.question('Inform the number of channels(nc):(black and white images have NC=1, colored images have NC=3) e.g NC=3 \n');
    
                        //     let vals = getValues(answer2, "nc");
                        //     imageData.nc = vals;
                        // }else{
                        //     console.log("It's not possible to proceed without the number of channels!")
                        //     process.exit(1);
                        // }
                    } else {
                        imageData.nc = metadata.SamplesPerPixel.value;
                    }
                    imageData.dpi = dpi;
                }
            }
            resolve(true);
        });
    })
    
}

function usePNG(buf) {
    let data;
    let png = PNG.sync.read(buf);

    let arrByte = new Uint8Array(png.data);
    if (png.alpha) {
        data = rgbaToRgb(arrByte);
    } else {
        data = arrByte;
    }

    let newArr = [];

    let verifyColorSpace = detectColorSpace(data);

    if (verifyColorSpace === 1) {
        for (let j = 0; j < data.length; j += 4) {
            newArr.push(data[j]);
        }
    } else if (verifyColorSpace === 3) {
        for (let j = 0; j < data.length; j += 4) {
            newArr.push(data[j]);
            newArr.push(data[j + 1]);
            newArr.push(data[j + 2]);
        }
    }

    imageData.array = new Uint8Array(newArr);
    imageData.nc = verifyColorSpace;
    imageData.sizeX = png.width;
    imageData.sizeY = png.height;
    imageData.dpi = 72;
}

function imageMagickIdentify(srcImage) {
    return new Promise((resolve) => {
        im.identify(srcImage, function(err, features){
            //console.log(err, features);
            resolve({err: err, features: features});
        })
    })
}

function getValues(str, type) {
    let values;
    if (type === "wh") {
        let Wstr = "W=";
        let Hstr = "H=";
        let doesContainW = str.indexOf(Wstr);
        let doesContainH = str.indexOf(Hstr);

        let valW = parseInt(str.slice(doesContainW + 2, doesContainH));
        let valH = parseInt(str.slice(doesContainH + 2));

        values = {
            w: valW,
            h: valH
        }
    } else if (type === "nc") {
        let nc = "NC=";
        let doesContainNC = str.indexOf(nc);
        values = parseInt(str.slice(doesContainNC + 3));
    } else if (type === "dpi") {
        let dpi = "DPI=";
        let doesContainDPI = str.indexOf(dpi);
        values = parseInt(str.slice(doesContainDPI + 4));
    }

    return values;
}

function detectColorSpace(arr) {
    let target = parseInt(String(arr.length / 4));

    let counter = 0;

    for (let j = 0; j < arr.length; j += 4) {
        let r = arr[j];
        let g = arr[j + 1];
        let b = arr[j + 2];

        if (r === g && r === b) {
            counter++;
        }
    }

    if (target === counter) {
        return 1;
    } else {
        return 3;
    }
}

function rgbaToRgb(arr) {
    let newArr = [];
    let BGColor = {
        R: 255,
        G: 255,
        B: 255
    }

    for (let i = 0; i < arr.length; i += 4) {

        let r = parseInt(String(255 * (((1 - arr[i + 3]) * BGColor.R) + (arr[i + 3] * arr[i]))));
        let g = parseInt(String(255 * (((1 - arr[i + 3]) * BGColor.G) + (arr[i + 3] * arr[i + 1]))));
        let b = parseInt(String(255 * (((1 - arr[i + 3]) * BGColor.B) + (arr[i + 3] * arr[i + 2]))));

        newArr.push(r);
        newArr.push(g);
        newArr.push(b);
    }
    return newArr;
}
