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

/**
 * 
 * @param {type} originalWidth
 * @param {type} originalHeight
 * @constructor create image active scene
 */
function iaScene(originalWidth, originalHeight) {
    "use strict";
    var that = this;
    /*
     *  define scene dimensions on the page
     */
    this.width = 1000;
    this.height = 800;
    
    
    this.y = 0;
    
    this.zoomActive = 0;
    this.element = 0;
    this.originalWidth = originalWidth;
    this.originalHeight = originalHeight;
    this.coeff = (this.width * 0.55) / parseFloat(originalWidth);
    this.cursorState=""
    this.overColor = 'rgba(66, 133, 244,0.4)';
}

/*
 * 
 * @param {type} imageObj
 * @param {type} detail
 * @param {type} layer
 * @param {type} idText
 * @param {type} baseImage
 * @param {type} iaScene
 * @constructor create image active object
 */
function iaObject(imageObj, detail, layer, idText, baseImage, iaScene, background_layer, layer_ghost) {
    "use strict";
    var that = this;
    this.path = new Array();
    this.kineticElement = new Array();
    this.backgroundImage = new Array();
    this.originalX = new Array();
    this.originalY = new Array();
    this.layer = layer;
    this.background_layer = background_layer;
    this.imageObj = imageObj;
    this.agrandissement = 0;
    this.zoomActive = 0;
    this.minX = 10000;
    this.minY = 10000;
    this.maxX = -1;
    this.maxY = -1;
    this.tween = new Array(); 
    this.tween_group = 0;
    this.group = 0;
    this.group_ghost = 0;
    this.layer_ghost = layer_ghost;


    /*
     * 
     * @param {type} index
     * @returns {undefined}
     */
    var definePathBoxSize = function(detail, index) {
        "use strict";
        if (  (typeof(detail.minX) != 'undefined') &&
              (typeof(detail.minY) != 'undefined') &&
              (typeof(detail.maxX) != 'undefined') &&
              (typeof(detail.maxY) != 'undefined')) {
            that.minX = detail.minX;
            that.minY = detail.minY;
            that.maxX = detail.maxX;
            that.maxY = detail.maxY;
        }
        else {
            var element = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            element.setAttribute('d', that.path[index]);
            var len = element.getTotalLength();
            var point = element.getPointAtLength(0);
            if (that.minX === 10000) that.minX = point.x;
            if (that.minY === 10000) that.minY = point.y;
            if (that.maxX === -1) that.maxX = point.x;
            if (that.maxY === -1) that.maxY = point.y;
            for (var percent =0; percent<100;percent++) {
                var curve_length = parseFloat(len * percent/100);
                if (!isNaN(curve_length)) {
                    var point = element.getPointAtLength(curve_length);
                    if (point.x < that.minX) that.minX = point.x;
                    if (point.x > that.maxX) that.maxX = point.x;
                    if (point.y < that.minY) that.minY = point.y;
                    if (point.y > that.maxY) that.maxY = point.y;
                }
            }                    
        }

    }
    
    /*
     * 
     * @param {type} index
     * @returns {undefined}
     */
    var defineImageBoxSize = function(detail) {
        "use strict";
       
        if (that.minX === -1) that.minX = (parseFloat(detail.x));
        if (that.maxY === 10000) that.maxY = parseFloat(detail.y) + parseFloat(detail.height);
        if (that.maxX === -1) that.maxX = (parseFloat(detail.x) + parseFloat(detail.width));
        if (that.minY === 10000) that.minY = (parseFloat(detail.y));

        if (parseFloat(detail.x) < that.minX) that.minX = parseFloat(detail.x);
        if (parseFloat(detail.x) + parseFloat(detail.width) > that.maxX) that.maxX = parseFloat(detail.x) + parseFloat(detail.width);
        if (parseFloat(detail.y) < that.minY) that.miny = parseFloat(detail.y);        
        if (parseFloat(detail.y) + parseFloat(detail.height) > that.maxY) that.maxY = parseFloat(detail.y) + parseFloat(detail.height);
    }    
    /*
     * Define mouse events on the current KineticElement
     * @param {type} i KineticElement index
     * @returns {undefined}
     */
    
    var addEventsManagement = function(i, zoomable, detail) {

        /*
         * if mouse is over element, fill the element with semi-transparency
         */
        that.kineticElement[i].on('mouseover', function() {
            if (iaScene.cursorState.indexOf("ZoomOut.cur") != -1) {

            }
            else if (iaScene.cursorState.indexOf("HandPointer.cur") == -1) {
                document.body.style.cursor = "url(img/HandPointer.cur),auto";
                iaScene.cursorState = "url(img/HandPointer.cur),auto";
                for (var i in that.kineticElement) {
                    that.kineticElement[i].fill(iaScene.overColor);
                    that.kineticElement[i].scale(iaScene.coeff);
                }
                that.layer.batchDraw();
            }
        });
        /*
         * if we click in this element, manage zoom-in, zoom-out
         */
        that.kineticElement[i].on('click touchstart', function() {
            // let's zoom
            if ((iaScene.cursorState.indexOf("ZoomIn.cur") != -1) && (iaScene.element == that)) {
                console.log("let's zoom !");
                iaScene.zoomActive = 1;
                document.body.style.cursor = "url(img/ZoomOut.cur),auto";
                iaScene.cursorState = "url(img/ZoomOut.cur),auto";
                that.layer.moveToTop();
                
                that.group.zoomActive = 1;
                //that.group.clearCache();
                that.originalX[0] = that.group.x();
                that.originalY[0] = that.group.y();
                that.group.draw();

                //that.group.cache();
                //that.tween[i].play();
                that.tween_group.play();

                /*for (var i in that.kineticElement) {
                    that.kineticElement[i].zoomActive = 1;
                    that.originalX[i] = that.kineticElement[i].x();
                    that.originalY[i] = that.kineticElement[i].y();
                    that.kineticElement[i].draw();
                    //that.tween[i].play();
                    that.tween_group.play();
                }*/
            }
            // let's unzoom
            else if (iaScene.cursorState.indexOf("ZoomOut.cur") != -1) {

                if ((that.group.zoomActive == 1) && (that.group.scaleX().toFixed(5) == (that.agrandissement).toFixed(5))) {
                    iaScene.zoomActive = 0;
                    that.group.zoomActive = 0;
                    that.group.scale({x:iaScene.coeff,y:iaScene.coeff});
                    
                    that.group.x(that.originalX[0]);
                    that.group.y(that.originalY[0]);
                    that.tween_group.reset();
                    baseImage.opacity(1);
                    document.body.style.cursor = "default";
                    iaScene.cursorState = "default";

                    for (var i in that.kineticElement) {
                        that.kineticElement[i].clearCache();
                    }                    
                    that.layer.draw();
                    that.background_layer.draw();
                }

                
                /*for (var i in that.kineticElement) {
                    console.log(that.group.scaleX().toFixed(5));
                    console.log((that.agrandissement).toFixed(5));
                    if ((that.kineticElement[i].zoomActive == 1) && (that.kineticElement[i].scaleX().toFixed(5) == (that.agrandissement * iaScene.coeff).toFixed(5))) {
                        iaScene.zoomActive = 0;
                        that.kineticElement[i].zoomActive = 0;
                        that.kineticElement[i].scale({x:iaScene.coeff,y:iaScene.coeff});
                        that.kineticElement[i].setZIndex(100);
                        that.kineticElement[i].x(that.originalX[i]);
                        that.kineticElement[i].y(that.originalY[i]);
                        that.tween[i].reset();
                        that.kineticElement[i].fillPriority('color');
                        baseImage.opacity(1);
                        that.kineticElement[i].setFill('rgba(0, 0, 0, 0)');
                        that.kineticElement[i].stroke('rgba(0,0,0,0)');                                                                        
                        document.body.style.cursor = "default";
                        iaScene.cursorState = "default";
                        that.layer.draw();
                        that.background_layer.draw();
                    }
                }*/
            }
            // let's focus
            else {
                if (iaScene.zoomActive == 0) {
                    if ((iaScene.element != 0) && (typeof(iaScene.element) != 'undefined')) {
                        for (var i in iaScene.element.kineticElement) {
                            iaScene.element.kineticElement[i].fillPriority('color');
                            iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
                            iaScene.element.kineticElement[i].stroke('rgba(0,0,0,0)');                                                
                        }
                    }                    
                    if (zoomable == true) {
                        document.body.style.cursor = 'url("img/ZoomIn.cur"),auto';
                        iaScene.cursorState = 'url("img/ZoomIn.cur"),auto';
                    }
                    $('.collapse.in').each(function (index) {
                            if ($(this).attr("id") != idText) $(this).collapse("toggle");
                    });
                    $('#' + idText).collapse("show");
                    baseImage.opacity(0.3);
                    //baseImage.brightness(-10);
                    that.background_layer.draw();
                    for (var i in that.kineticElement) {
                        that.kineticElement[i].fillPriority('pattern');
                        that.kineticElement[i].fillPatternImage(that.backgroundImage[i]);
                        that.kineticElement[i].fillPatternOffset({x:0, y:0});
                    }
                    for (var i in that.kineticElement) {
                        that.kineticElement[i].cache();
                    }
                    
                    that.layer.draw(); 
                    //that.group.cache();
                    iaScene.element = that;
                }
            }
        });
        /*
         * if we leave this element, just clear the scene
         */
        that.kineticElement[i].on('mouseleave', function() {
            if (iaScene.cursorState.indexOf("ZoomOut.cur") != -1) {

            }
            else {
                baseImage.opacity(1);
                //baseImage.brightness(0);
                that.background_layer.draw();
                for (var i in that.kineticElement) {
                    that.kineticElement[i].clearCache();
                    that.kineticElement[i].fillPriority('color');
                    that.kineticElement[i].fill('rgba(0, 0, 0, 0)');
                    that.kineticElement[i].stroke('rgba(0,0,0,0)');                    
                }
                document.body.style.cursor = "default";
                iaScene.cursorState = "default";
                that.layer.draw();						
            }
        });        
    }
    
    /*
     * 
     * @param {type} path
     * @param {type} i KineticElement index
     * @returns {undefined}
     */
    var includePath = function(detail, i) {
        that.path[i] = detail.path;
        that.backgroundImage[i] = imageObj;
        that.kineticElement[i] = new Kinetic.Path({
            data: detail.path,
            x: parseFloat(detail.x) * iaScene.coeff,
            y: parseFloat(detail.y) * iaScene.coeff + iaScene.y,
            scale: {x:iaScene.coeff,y:iaScene.coeff},
            fill: 'rgba(0, 0, 0, 0)'
        });
        /*var test = new Kinetic.Path({
            data: detail.path,
            x: parseFloat(detail.x) * iaScene.coeff,
            y: parseFloat(detail.y) * iaScene.coeff + iaScene.y,
            scale: {x:iaScene.coeff,y:iaScene.coeff},
            fill: 'rgba(100, 100, 100, 100)',
            stroke: 'red',
            strokeWidth: '1'
        });*/        
        definePathBoxSize(detail, i);
        var zoomable = true;
        if ((typeof(detail.fill) !== 'undefined') && (detail.fill == "#000000")) {
            zoomable = false;
        }
        addEventsManagement(i, zoomable, detail);
        

        
        //that.layer.add(test);
        /*test.toImage({
            callback: function(imgxx) {
                
                that.kineticElement[i] = new Kinetic.Image({
                    image: imgxx,
                    x:0,
                    y:0
                });
                
                that.group.add(that.kineticElement[i]);
                
                addEventsManagement(i, true, detail);
                that.group.draw();
            }
            
        });*/
        
        
        that.group.add(that.kineticElement[i]);
        that.group.draw();
    };

    /*
     * 
     * @param {type} detail
     * @param {type} i KineticElement index
     * @returns {undefined}
     */
    var includeImage = function(detail, i) {
        defineImageBoxSize(detail);
        var rasterObj = new Image();
        rasterObj.src = detail.image;                
        that.backgroundImage[i] = rasterObj;
        that.kineticElement[i] = new Kinetic.Rect({
            x: parseFloat(detail.x) * iaScene.coeff,
            y: parseFloat(detail.y) * iaScene.coeff + iaScene.y,
            width: detail.width,
            height: detail.height,
            scale: {x:iaScene.coeff,y:iaScene.coeff},
            fill: 'rgba(0, 0, 0, 0)',
            stroke: '',
            strokeWidth: 0	
        });
        rasterObj.onload = function() {
            /*that.kineticElement[i] = new Kinetic.Image({
                image: rasterObj,
                x: parseFloat(detail.x) * iaScene.coeff,
                y: parseFloat(detail.y) * iaScene.coeff + iaScene.y,
                width: detail.width,
                height: detail.height,
                scale: {x: iaScene.coeff, y: iaScene.coeff}

            });*/

            var zoomable = true;
            if ((typeof(detail.fill) !== 'undefined') && (detail.fill == "#000000")) {
                zoomable = false;
            }
            addEventsManagement(i,zoomable, detail);
            that.group.add(that.kineticElement[i]);

            // buggy on kinetic 5.1.0
            //that.kineticElement[i].cache();
            //that.kineticElement[i].drawHitFromCache();
            that.group.draw();        
        }

    }    
    /*
     * Define zoom rate and define tween effect for each kineticElement
     * @returns {undefined}
     */
    
    var defineTweens = function() {

        that.minX = that.minX * iaScene.coeff;
        that.minY = that.minY * iaScene.coeff;
        that.maxX = that.maxX * iaScene.coeff;
        that.maxY = that.maxY * iaScene.coeff;    

        var largeur = that.maxX - that.minX;
        var hauteur = that.maxY - that.minY;
        that.agrandissement1  = (iaScene.height - iaScene.y) / hauteur;   // beta
        that.agrandissement2  = iaScene.width / largeur;    // alpha

        if (hauteur * that.agrandissement2 > iaScene.height) {
            that.agrandissement = that.agrandissement1;
            
            that.tween_group = new Kinetic.Tween({
                  node: that.group, 
                  duration: 1,
                  x: (0 - (that.minX)) * that.agrandissement + (iaScene.width - largeur * that.agrandissement) / 2,
                  y: (0 - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y,
                  easing: Kinetic.Easings.BackEaseIn,
                  scaleX: that.agrandissement,
                  scaleY: that.agrandissement
            });
            
            /*for (var i in that.kineticElement) {
                var new_x = (that.kineticElement[i].x() - (that.minX)) * that.agrandissement + (iaScene.width - largeur * that.agrandissement) / 2;
                var new_y = (that.kineticElement[i].y() - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y;
                that.tween[i] = new Kinetic.Tween({
                  node: that.kineticElement[i], 
                  duration: 1,
                  x: new_x,
                  y: new_y,
                  easing: Kinetic.Easings.BackEaseIn,
                  scaleX: that.agrandissement * iaScene.coeff,
                  scaleY: that.agrandissement * iaScene.coeff
                });
            }*/
        }
        else {
            that.agrandissement = that.agrandissement2;
            
            that.tween_group = new Kinetic.Tween({
                  node: that.group, 
                  duration: 1,
                  x: (0 - (that.minX)) * that.agrandissement,
                  y: 1 * ((0 - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y + (iaScene.height - hauteur * that.agrandissement) / 2),
                  easing: Kinetic.Easings.BackEaseIn,
                  scaleX: that.agrandissement,
                  scaleY: that.agrandissement
            });            
            
            /*for (var i in that.kineticElement) {
                var new_x = (that.kineticElement[i].x() - (that.minX)) * that.agrandissement;
                var new_y = 1 * ((that.kineticElement[i].y() - iaScene.y - (that.minY)) * that.agrandissement + iaScene.y + (iaScene.height - hauteur * that.agrandissement) / 2);
                that.tween[i] = new Kinetic.Tween({
                  node: that.kineticElement[i], 
                  duration: 1,
                  x: new_x,
                  y: new_y,
                  easing: Kinetic.Easings.BackEaseIn,
                  scaleX: that.agrandissement * iaScene.coeff,
                  scaleY: that.agrandissement * iaScene.coeff
                });
            }*/
        }        
    }    
    
    // Create kineticElements and include them in a group
    
    that.group = new Kinetic.Group();
    that.group_ghost = new Kinetic.Group();
    that.layer_ghost.add(that.group_ghost);
    that.layer.add(that.group);
    
    if (typeof(detail.path) !== 'undefined') {
        includePath(detail, 0);
    }
    else if (typeof(detail.image) !== 'undefined') {
        includeImage(detail, 0);
    }
    else if (typeof(detail.group) !== 'undefined') {
        for (var i in detail.group) {
            if (typeof(detail.group[i].path) != 'undefined') {
                includePath(detail.group[i], i);
            }
            else if (typeof(detail.group[i].image) != 'undefined') {
                includeImage(detail.group[i], i);
            }
        }
    }
    else {
        console.log(detail);
    }

    defineTweens();
    
    /*
     *  manage accordion events related to this element
     */
    $("#" + idText + "-heading").on('click touchstart',function(){
        if (iaScene.zoomActive == 0) {
            $('.collapse.in').each(function (index) {
                if ($(this).attr("id") != idText) $(this).collapse("toggle");
            });
            if ((iaScene.element != 0) && (typeof(iaScene.element) != 'undefined')) {
                for (var i in iaScene.element.kineticElement) {
                    iaScene.element.kineticElement[i].fillPriority('color');
                    iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
                    iaScene.element.layer.draw();
                }
            }
            baseImage.opacity(0.3);
            for (var i in that.kineticElement) {
                that.kineticElement[i].fillPriority('pattern');
                that.kineticElement[i].fillPatternImage(that.backgroundImage[i]);
                that.kineticElement[i].fillPatternOffset({x:0, y:0});
            }
            iaScene.element = that;
            that.layer.draw();				
            that.background_layer.draw();
        }
    });
}
/*
 * Main
 * Initialization
 * 
 * 1rst layer : div "detect" - if clicked, enable canvas events
 * 2nd layer : bootstrap accordion
 * 3rd layer : div "canvas" containing images and paths
 * 4th layer : div "disablearea" - if clicked, disable events canvas  
 */

imageObj = new Image();
canvas = document.getElementById("canvas");

// area located under the canvas. If mouse over is detected, we must re-activate mouse events on canvas
detect = document.getElementById("detect");
detect.addEventListener("mouseover", function()
    {
        canvas.style.pointerEvents="auto";

        if ((iaScene.element != 0) && (typeof(iaScene.element) != 'undefined')) {
            for (var i in iaScene.element.kineticElement) {
                iaScene.element.kineticElement[i].fillPriority('color');
                iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
            }
        }
    }, false);			
detect.addEventListener("touchstart", function()
    {   
        canvas.style.pointerEvents="auto";

        if ((iaScene.element != 0) && (typeof(iaScene.element) != 'undefined')) {
            for (var i in iaScene.element.kineticElement) {
                iaScene.element.kineticElement[i].fillPriority('color');
                iaScene.element.kineticElement[i].fill('rgba(0,0,0,0)');
            }
        }
    }, false);	

$("#collapsecomment").collapse("show");

/*
 * Scale entire scene
 *  
 */
scaleScene = function(mainScene){
    var viewportWidth = $(window).width();
    var viewportHeight = $(window).height();
    var new_height = scene.height * mainScene.coeff + $('#canvas').offset().top - $('#container').offset().top;
    $('#container').css({"height": new_height + 'px'});
    $('#canvas').css({"height": mainScene.originalHeight * mainScene.coeff + 'px'});
    
    if (viewportWidth < 1000) {
        mainScene.width = viewportWidth - mainScene.y;
        mainScene.coeff = (mainScene.width / 2) / parseFloat(mainScene.originalWidth);
        $('#container').css({"width": viewportWidth - mainScene.y});
    }
    if (viewportHeight < 755) {
        mainScene.height = viewportHeight - mainScene.y;
        $('#detect').css({"height": viewportHeight - mainScene.y});
    }
}

// Load background image
imageObj.onload = function() {
    var that = this;
    var mainScene = new iaScene(scene.width,scene.height);
    
    scaleScene(mainScene);
    
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
            //fillPatternImage: imageObj,
            image: imageObj,
            //stroke: '',
            //strokeWidth: 0
    });

    // define area to disable canvas events management when
    // mouse is over. Thus, we can reach div located under canvas 
    var disableArea = new Kinetic.Rect({
            x: mainScene.width  * 0.55,
            y: mainScene.y,
            width: mainScene.width * (1 - 0.55),
            height: mainScene.height,
            stroke: '',
            strokeWidth: 0
    });		
    disableArea.on('mouseover touchstart', function() {
        canvas.style.pointerEvents="none";
    });
    var layers = new Array();
    layers[0] = new Kinetic.FastLayer();	
    layers[1] = new Kinetic.Layer();
    layer_ghost = new Kinetic.Layer();
    
    layers[0].add(baseImage);
    // buggy on kinetic 5.1.0
    //baseImage.cache();
    //baseImage.filters([Kinetic.Filters.Brighten]);
    
    layers[1].add(disableArea);	
    
    stage.add(layer_ghost);
    layer_ghost.hide();
    stage.add(layers[0]);
    stage.add(layers[1]);
    
    for (var i in details) {
        layers[i+2] = new Kinetic.Layer();
        stage.add(layers[i+2]);
        iaObj = new iaObject(imageObj, details[i], layers[i+2], "collapse" + i, baseImage, mainScene, layers[0], layer_ghost);
    }
};
imageObj.src = scene.image;