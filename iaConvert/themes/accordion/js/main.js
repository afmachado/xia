//   This program is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or
//   (at your option) any later version.
//   This program is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//   You should have received a copy of the GNU General Public License
//   along with this program.  If not, see <http://www.gnu.org/licenses/>
//   
//   
// @author : pascal.fautrero@crdp.ac-versailles.fr

/*
 * Main
 * Initialization
 * 
 * 1rst layer : div "detect" - if clicked, enable canvas events
 * 2nd layer : bootstrap accordion
 * 3rd layer : div "canvas" containing images and paths
 * 4th layer : div "disablearea" - if clicked, disable events canvas  
 */

function main() {
    "use strict";
    var that=this;

    that.canvas = document.getElementById("canvas");

    // area located under the canvas. If mouse over is detected, 
    // we must re-activate mouse events on canvas
    var detect = document.getElementById("detect");
    detect.addEventListener("mouseover", function()
        {
            that.canvas.style.pointerEvents="auto";

            if ((iaScene.element !== 0) && (typeof(iaScene.element) !== 'undefined')) {
                for (var i in iaScene.element.kineticElement) {
                    iaScene.element.kineticElement[i].fillPriority('color');
                    iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
                }
            }
        }, false);			
    detect.addEventListener("touchstart", function()
        {   
            that.canvas.style.pointerEvents="auto";

            if ((iaScene.element !== 0) && (typeof(iaScene.element) !== 'undefined')) {
                for (var i in iaScene.element.kineticElement) {
                    iaScene.element.kineticElement[i].fillPriority('color');
                    iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
                }
            }
        }, false);	

    $("#collapsecomment").collapse("show");


    // Load background image

    that.imageObj = new Image();
    that.imageObj.src = scene.image;
    that.imageObj.onload = function() {
        // define the maximum number of pixels allowed in the image
        // iPad can't manage images up to 5MB pixels
        var maxNumberPixels = 2 * 1024 * 1024;
        var ratio = 1;
        if (parseFloat(scene.width) * parseFloat(scene.height) >= maxNumberPixels) {
            ratio = Math.sqrt(maxNumberPixels/(parseFloat(scene.width) * parseFloat(scene.height)));
            console.log("Background Image is resized on the fly with ratio = " + ratio.toString());
        }
        else {
            console.log("Background Image is used without being resized");
        }
        //console.log(ratio);
        that.newwidth = parseFloat(scene.width) * ratio;
        that.newheight = parseFloat(scene.height) * ratio;
        that.scaleCanvas = document.createElement('canvas');
        that.scaleCanvas.setAttribute('width', that.newwidth);
        that.scaleCanvas.setAttribute('height', that.newheight);
        that.scaleCtx = that.scaleCanvas.getContext('2d');
        that.scaleCtx.drawImage(
            that.imageObj, 
            0, 
            0,
            that.newwidth,
            that.newheight
        );
        //document.body.appendChild(this.scaleCanvas);
        var dataUrl = that.scaleCanvas.toDataURL();
        delete that.scaleCanvas;
        delete that.imageObj;
        var scaledImage = new Image();
        scaledImage.src = dataUrl;
        scaledImage.onload = function() {

            //scene.width = that.newwidth;
            //scene.height = that.newheight;
            var mainScene = new iaScene(scene.width,scene.height);
            mainScene.scale = that.newwidth / scene.width; 
            mainScene.scaleScene(mainScene);

            var stage = new Kinetic.Stage({
                container: 'canvas',
                width: mainScene.width,
                height: mainScene.height
            });

            // area containing image background    
            var baseImage = new Kinetic.Image({
                x: 0,
                y: mainScene.y,
                width: scene.width,
                height: scene.height,
                scale: {x:mainScene.coeff,y:mainScene.coeff},
                image: scaledImage
            });

            // define area to disable canvas events management when
            // mouse is over. Thus, we can reach div located under canvas 
            var disableArea = new Kinetic.Rect({
                x: mainScene.width  * mainScene.ratio,
                y: mainScene.y,
                width: mainScene.width * (1 - mainScene.ratio),
                height: mainScene.height
            });		
            disableArea.on('mouseover touchstart', function() {
                canvas.style.pointerEvents="none";
            });
            var layers = new Array();
            layers[0] = new Kinetic.FastLayer();	
            layers[1] = new Kinetic.Layer();

            layers[0].add(baseImage);
            layers[1].add(disableArea);	
            stage.add(layers[0]);
            stage.add(layers[1]);

            for (var i in details) {
                var indice = parseInt(i+2);
                layers[indice] = new Kinetic.Layer();
                stage.add(layers[indice]);
                var iaObj = new iaObject(scaledImage, details[i], layers[indice], "collapse" + i, baseImage, mainScene, layers[0]);
            }

            $("#collapsecomment-heading").on('click touchstart',function(){
                if (mainScene.zoomActive === 0) {
                    $('.collapse.in').each(function (index) {
                        if ($(this).attr("id") !== "collapsecomment") $(this).collapse("toggle");
                    });
                    if ((mainScene.element !== 0) && (typeof(mainScene.element) !== 'undefined')) {
                        for (var i in mainScene.element.kineticElement) {
                            mainScene.element.kineticElement[i].fillPriority('color');
                            mainScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
                            mainScene.element.layer.draw();
                        }
                    }
                    baseImage.opacity(1);
                    mainScene.element = that;
                    layers[0].draw();
                }
            });

            // FullScreen ability
            // source code from http://blogs.sitepointstatic.com/examples/tech/full-screen/index.html
            var e = document.getElementById("title");
            var div_container = document.getElementById("container");
            e.onclick = function() {
                if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
                    RunPrefixMethod(document, "CancelFullScreen");
                }
                else {
                    RunPrefixMethod(div_container, "RequestFullScreen");
                }
            };

            var pfx = ["webkit", "moz", "ms", "o", ""];
            function RunPrefixMethod(obj, method) {
                var p = 0, m, t;
                while (p < pfx.length && !obj[m]) {
                    m = method;
                    if (pfx[p] == "") {
                        m = m.substr(0,1).toLowerCase() + m.substr(1);
                    }
                    m = pfx[p] + m;
                    t = typeof obj[m];
                    if (t != "undefined") {
                        pfx = [pfx[p]];
                        return (t == "function" ? obj[m]() : obj[m]);
                    }
                    p++;
                }
            };

        };

    };    
    
}

launch = new main();
