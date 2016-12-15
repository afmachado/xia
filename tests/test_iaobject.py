#!/usr/bin/python
# -*- coding: utf-8 -*-
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>
#
# @author : pascal.fautrero@ac-versailles.fr

from xiaconverter.iaobject import iaObject
from xiaconverter.logger import Logger
from nose.tools import *
from xml.dom import minidom
import tempfile
import os

class LoggerMock(Logger):
    def display(self, msg):
        pass

class TestiaObject:

    def test_extractRaster(self):
        console = LoggerMock()
        ia = iaObject(console)
        # XIA logo 16x16
        originalRaster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gofDSYCgyL5zAAAAlVJREFUOMttk01IVFEUx3/3zodjZoVJWpuytDSS3kMSKneRRtuSdq2sUSGYje3aZNGHm9EyTRetIhUiCAkjC8KgFsJ7JBgKSUE5KpNo2TjOzLu3xczTl/hf3Xu+z/+cI8jBiFrYERMjalUC14CzQFlOPQOMAt12xJx0bQHEJud+oMkNKgN5qEwatMKDPjtihl0f4XEeB2pcK+2kmbrXSOn5VnYZ9WzCZ8AAtPRkrvFaqFSStYXv/By6zRaoBnrsiInM9dyEkCDkuoXOpEEIZF4+ybmvOKt/vHoBhI2oVe4rPdd8U0jfifmRHhIzFqG95TiJZaY7GtGZNCr5l/iHQeZHnyD9QQoOmt5KpDCi1rQM5ldMtNXirK6glQIBQvrwhQrYadSD1ixZI6hUkpKGq5Q0hEFrgIwwolYKCAgpmX3ZyeLH5zjJFQKFxRy99Q6dSWVr9geZvHGG/ZfvsK3MBHRW7gbIFiRZeP2Y2KtHHGkbJLTvMPGxARCC4rpLW5GJBL5tMCNI/44DkLfnAFopluwRZl90uCVvhiOBN+vMK8WOqjqEkMSGuxBScqi1n+r7n0CIbDtCeAP0SqB7468pqKhFKUV8bIBfY8/whQrxhbYTG+5i4vpJfgy1e8fZ6a5yH3DFla7NzfDl7gWklIhAELTOjlQpjrW/xV9YBNBrR8wW7ypbwPHskgicxDLx909ZHB9GSj9Fpy+y+1QjMhgCmAIq/zum3LsHCK+TKiUIX44fxz2qXjtitriJJeCeprYjZnMu8gMgoZVCO2m0k06g1UOgyusM8A8PqAKAYqQluwAAAABJRU5ErkJggg=='
        rasterExtracted = ia.extractRaster(originalRaster)
        assert_equal(rasterExtracted, originalRaster)


    def test_fixRaster(self):
        console = LoggerMock()
        ia = iaObject(console)
        # XIA logo 16x16
        originalRaster = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gofDSYCgyL5zAAAAlVJREFUOMttk01IVFEUx3/3zodjZoVJWpuytDSS3kMSKneRRtuSdq2sUSGYje3aZNGHm9EyTRetIhUiCAkjC8KgFsJ7JBgKSUE5KpNo2TjOzLu3xczTl/hf3Xu+z/+cI8jBiFrYERMjalUC14CzQFlOPQOMAt12xJx0bQHEJud+oMkNKgN5qEwatMKDPjtihl0f4XEeB2pcK+2kmbrXSOn5VnYZ9WzCZ8AAtPRkrvFaqFSStYXv/By6zRaoBnrsiInM9dyEkCDkuoXOpEEIZF4+ybmvOKt/vHoBhI2oVe4rPdd8U0jfifmRHhIzFqG95TiJZaY7GtGZNCr5l/iHQeZHnyD9QQoOmt5KpDCi1rQM5ldMtNXirK6glQIBQvrwhQrYadSD1ixZI6hUkpKGq5Q0hEFrgIwwolYKCAgpmX3ZyeLH5zjJFQKFxRy99Q6dSWVr9geZvHGG/ZfvsK3MBHRW7gbIFiRZeP2Y2KtHHGkbJLTvMPGxARCC4rpLW5GJBL5tMCNI/44DkLfnAFopluwRZl90uCVvhiOBN+vMK8WOqjqEkMSGuxBScqi1n+r7n0CIbDtCeAP0SqB7468pqKhFKUV8bIBfY8/whQrxhbYTG+5i4vpJfgy1e8fZ6a5yH3DFla7NzfDl7gWklIhAELTOjlQpjrW/xV9YBNBrR8wW7ypbwPHskgicxDLx909ZHB9GSj9Fpy+y+1QjMhgCmAIq/zum3LsHCK+TKiUIX44fxz2qXjtitriJJeCeprYjZnMu8gMgoZVCO2m0k06g1UOgyusM8A8PqAKAYqQluwAAAABJRU5ErkJggg=='
        rasterFixed = ia.fixRaster(originalRaster, 16, 16)
        assert_equal(rasterFixed, originalRaster)

    def test_imageDimensions(self):
        console = LoggerMock()
        ia = iaObject(console)
        maxNumPixels = 5 * 1024 * 1024
        currentDir  = os.path.dirname(os.path.realpath(__file__))
        ia.analyzeSVG(currentDir + "/fixtures/inkscape1.svg", maxNumPixels)
        assert_equal(ia.scene['width'], '30')
        assert_equal(ia.scene['height'], '30')
        assert_equal(ia.scene['image'], 'data:image/png;base64,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\nfm7v/wNsPMfhskwLeQAAAABJRU5ErkJggg==\n')
        assert_equal(ia.scene['creator'], 'creator')
        assert_equal(ia.scene['description'], 'description')
        assert_equal(ia.scene['title'], 'fixture 1')

    def test_analyzeSVG2(self):

        tempDirSvg = tempfile.gettempdir()
        maxNumPixels = 5 * 1024 * 1024
        currentDir  = os.path.dirname(os.path.realpath(__file__))
        with open(currentDir + "/fixtures/generic1.svg", "r") as genericSvg:
            tempContent = genericSvg.read()
            tempContent = tempContent.replace("file://fixtures", "file://" + currentDir + "/fixtures")

        with open(tempDirSvg + "/generic1.svg", "w") as tempSvg:
            tempSvg.write(tempContent)
        console = LoggerMock()
        ia = iaObject(console)
        ia.analyzeSVG(tempSvg.name, maxNumPixels)

        assert_equal(ia.scene['width'], '10')
        assert_equal(ia.scene['height'], '10')
        assert_equal(ia.details[0]['width'], 205.97977516275924)
        assert_equal(ia.details[0]['height'], 210.30661948701845)

    def test_analyzeSVG3(self):
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <desc>description</desc>")
        desc = dom1.getElementsByTagName('desc')
        assert_equal("description", ia.get_tag_value(desc[0]))

        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?><desc></desc>")
        desc = dom1.getElementsByTagName('desc')
        assert_equal("",ia.get_tag_value(desc[0]))

    def test_analyzeSVG4(self):

        # check root path
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <svg>\
                <path d='M 0,0 L 10,0 L 10,10 L 0,10 L 0,0 z' />\
            </svg>")
        path = dom1.getElementsByTagName('path')
        newrecord = ia.extract_path(path[0], "")
        assert_equal(newrecord['path'], '"M0.0 0.0C0.0 0.0 10.0 0.0 10.0 0.0C10.0 0.0 10.0 10.0 10.0 10.0C10.0 10.0 0.0 10.0 0.0 10.0C0.0 10.0 0.0 0.0 0.0 0.0C0.0 0.0 0.0 0.0 0.0 0.0 z"')
        assert_equal(newrecord['maxX'], '10.0')
        assert_equal(newrecord['maxY'], '10.0')
        assert_equal(newrecord['minX'], '0.0')
        assert_equal(newrecord['minY'], '0.0')
        assert_equal(newrecord['x'], '0')
        assert_equal(newrecord['y'], '0')

    def test_analyzeSVG4(self):
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <svg>\
                <path \
                    transform='translate(10)'\
                    x='10'\
                    y='30'\
                    d='M 0,0 L 10,0 L 10,10 L 0,10 L 0,0 z' />\
            </svg>")
        path = dom1.getElementsByTagName('path')
        newrecord = ia.extract_path(path[0], "")
        assert_equal(newrecord['path'], '"M10.0 10.0C10.0 10.0 20.0 10.0 20.0 10.0C20.0 10.0 20.0 20.0 20.0 20.0C20.0 20.0 10.0 20.0 10.0 20.0C10.0 20.0 10.0 10.0 10.0 10.0C10.0 10.0 10.0 10.0 10.0 10.0 z"')
        assert_equal(newrecord['maxX'], '20.0')
        assert_equal(newrecord['maxY'], '20.0')
        assert_equal(newrecord['minX'], '10.0')
        assert_equal(newrecord['minY'], '10.0')
        assert_equal(newrecord['x'], '10')
        assert_equal(newrecord['y'], '30')

    def test_analyzeSVG4(self):

        # check path included in a group
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <g>\
                <path \
                    transform='translate(10)'\
                    x='10'\
                    y='30'\
                    d='M 0,0 L 10,0 L 10,10 L 0,10 L 0,0 z' />\
            </g>")
        group = dom1.getElementsByTagName('g')
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord["group"][0]['path'], '"M10.0 10.0C10.0 10.0 20.0 10.0 20.0 10.0C20.0 10.0 20.0 20.0 20.0 20.0C20.0 20.0 10.0 20.0 10.0 20.0C10.0 20.0 10.0 10.0 10.0 10.0C10.0 10.0 10.0 10.0 10.0 10.0 z"')
        assert_equal(newrecord["group"][0]['maxX'], '20.0')
        assert_equal(newrecord["group"][0]['maxY'], '20.0')
        assert_equal(newrecord["group"][0]['minX'], '10.0')
        assert_equal(newrecord["group"][0]['minY'], '10.0')
        assert_equal(newrecord["group"][0]['x'], '10')
        assert_equal(newrecord["group"][0]['y'], '30')

    def test_analyzeSVG5(self):

        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <g transform='rotate(40)'>\
                <path \
                    transform='rotate(10)' \
                    x='10' \
                    y='30' \
                    d='M 0,0 L 10,0 L 10,10 L 0,10 L 0,0 z' />\
            </g>")
        group = dom1.getElementsByTagName('g')
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord["group"][0]['path'], '"M0.0 0.0C0.0 0.0 9.64966028492 -2.62374853704 9.64966028492 -2.62374853704C9.64966028492 -2.62374853704 12.273408822 7.02591174788 12.273408822 7.02591174788C12.273408822 7.02591174788 2.62374853704 9.64966028492 2.62374853704 9.64966028492C2.62374853704 9.64966028492 0.0 0.0 0.0 0.0C0.0 0.0 0.0 0.0 0.0 0.0 z"')
        assert_equal(newrecord["group"][0]['maxX'], '12.273408822')
        assert_equal(newrecord["group"][0]['maxY'], '9.64966028492')
        assert_equal(newrecord["group"][0]['minX'], '0.0')
        assert_equal(newrecord["group"][0]['minY'], '-2.62374853704')
        assert_equal(newrecord["group"][0]['x'], '10')
        assert_equal(newrecord["group"][0]['y'], '30')

    def test_analyzeSVG6(self):

        # check image included in a group
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString('<?xml version="1.0" ?> \
            <svg xmlns:xlink="http://www.w3.org/1999/xlink">\
                <g>\
                    <image \
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gofDSYCgyL5zAAAAlVJREFUOMttk01IVFEUx3/3zodjZoVJWpuytDSS3kMSKneRRtuSdq2sUSGYje3aZNGHm9EyTRetIhUiCAkjC8KgFsJ7JBgKSUE5KpNo2TjOzLu3xczTl/hf3Xu+z/+cI8jBiFrYERMjalUC14CzQFlOPQOMAt12xJx0bQHEJud+oMkNKgN5qEwatMKDPjtihl0f4XEeB2pcK+2kmbrXSOn5VnYZ9WzCZ8AAtPRkrvFaqFSStYXv/By6zRaoBnrsiInM9dyEkCDkuoXOpEEIZF4+ybmvOKt/vHoBhI2oVe4rPdd8U0jfifmRHhIzFqG95TiJZaY7GtGZNCr5l/iHQeZHnyD9QQoOmt5KpDCi1rQM5ldMtNXirK6glQIBQvrwhQrYadSD1ixZI6hUkpKGq5Q0hEFrgIwwolYKCAgpmX3ZyeLH5zjJFQKFxRy99Q6dSWVr9geZvHGG/ZfvsK3MBHRW7gbIFiRZeP2Y2KtHHGkbJLTvMPGxARCC4rpLW5GJBL5tMCNI/44DkLfnAFopluwRZl90uCVvhiOBN+vMK8WOqjqEkMSGuxBScqi1n+r7n0CIbDtCeAP0SqB7468pqKhFKUV8bIBfY8/whQrxhbYTG+5i4vpJfgy1e8fZ6a5yH3DFla7NzfDl7gWklIhAELTOjlQpjrW/xV9YBNBrR8wW7ypbwPHskgicxDLx909ZHB9GSj9Fpy+y+1QjMhgCmAIq/zum3LsHCK+TKiUIX44fxz2qXjtitriJJeCeprYjZnMu8gMgoZVCO2m0k06g1UOgyusM8A8PqAKAYqQluwAAAABJRU5ErkJggg=="\
                        width="50"\
                        height="50">\
                    </image>\
                </g>\
            </svg>')
        group = dom1.getElementsByTagName('g')
        ia.backgroundNode = 0
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord["group"][0]['x'],'0')
        assert_equal(newrecord["group"][0]['y'],'0')
        assert_equal(newrecord["group"][0]['width'],'50')
        assert_equal(newrecord["group"][0]['height'],'50')

    def test_analyzeSVG7(self):

        # check rect included in a group
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString('<?xml version="1.0" ?>\
            <svg>\
                <g>\
                    <rect width="50" height="50"></rect>\
                </g>\
            </svg>')
        group = dom1.getElementsByTagName('g')
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord["group"][0]['x'], '0')
        assert_equal(newrecord["group"][0]['y'], '0')
        assert_equal(newrecord["group"][0]['width'], '50')
        assert_equal(newrecord["group"][0]['height'], '50')

    def test_analyzeSVG8(self):

        # check groups included in a group
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString('<?xml version="1.0" ?> \
            <svg> \
                <g> \
                    <rect width="50" height="50"></rect> \
                    <g> \
                        <desc>description</desc> \
                        <title>title</title> \
                    </g> \
                </g> \
            </svg>')
        group = dom1.getElementsByTagName('g')
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord['detail'], 'description')
        assert_equal(newrecord['title'], 'title')

    def test_analyzeSVG9(self):

        # check metadatas
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString('<?xml version="1.0" ?> \
            <svg \
                xmlns:dc="http://purl.org/dc/elements/1.1/" \
                xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" > \
                <metadata> \
                    <rdf:RDF> \
                        <dc:title>title</dc:title>\
                        <dc:date>16/06/2014</dc:date>\
                        <dc:creator><dc:title>creator</dc:title></dc:creator>\
                        <dc:rights><dc:title>GPL</dc:title></dc:rights>\
                        <dc:publisher><dc:title>publisher</dc:title></dc:publisher>\
                        <dc:language>FR</dc:language>\
                        <dc:subject>\
                            <rdf:li>keyword1</rdf:li>\
                            <rdf:li>keyword2</rdf:li>\
                        </dc:subject>\
                        <dc:contributor><dc:title>contributor</dc:title></dc:contributor>\
                    </rdf:RDF> \
                </metadata> \
            </svg>')
        ia.extractMetadatas(dom1)
        assert_equal(ia.scene['title'], 'title')
        assert_equal(ia.scene['date'], '16/06/2014')
        assert_equal(ia.scene['creator'], 'creator')
        assert_equal(ia.scene['rights'], 'GPL')
        assert_equal(ia.scene['publisher'], 'publisher')
        assert_equal(ia.scene['language'], 'FR')
        assert_equal(ia.scene['keywords'], 'keyword1,keyword2')
        assert_equal(ia.scene['contributor'], 'contributor')

    def test_analyzeSVG10(self):

        # check invalid path
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <svg>\
                <path d='' />\
            </svg>")
        path = dom1.getElementsByTagName('path')
        newrecord = ia.extract_path(path[0], "")
        assert_equal(newrecord, None)

    def test_analyzeSVG11(self):

        # check invalid rectangle
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString("<?xml version='1.0' ?>\
            <svg>\
                <rect width='' height='' />\
            </svg>")
        detail = dom1.getElementsByTagName('rect')
        newrecord = ia.extract_rect(detail[0], "")
        assert_equal(newrecord, None)


    def test_analyzeSVG12(self):

        # must resist if style is void
        console = LoggerMock()
        ia = iaObject(console)
        dom1 = minidom.parseString('<?xml version="1.0" ?> \
            <svg xmlns:xlink="http://www.w3.org/1999/xlink">\
                <g>\
                    <image \
                        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gofDSYCgyL5zAAAAlVJREFUOMttk01IVFEUx3/3zodjZoVJWpuytDSS3kMSKneRRtuSdq2sUSGYje3aZNGHm9EyTRetIhUiCAkjC8KgFsJ7JBgKSUE5KpNo2TjOzLu3xczTl/hf3Xu+z/+cI8jBiFrYERMjalUC14CzQFlOPQOMAt12xJx0bQHEJud+oMkNKgN5qEwatMKDPjtihl0f4XEeB2pcK+2kmbrXSOn5VnYZ9WzCZ8AAtPRkrvFaqFSStYXv/By6zRaoBnrsiInM9dyEkCDkuoXOpEEIZF4+ybmvOKt/vHoBhI2oVe4rPdd8U0jfifmRHhIzFqG95TiJZaY7GtGZNCr5l/iHQeZHnyD9QQoOmt5KpDCi1rQM5ldMtNXirK6glQIBQvrwhQrYadSD1ixZI6hUkpKGq5Q0hEFrgIwwolYKCAgpmX3ZyeLH5zjJFQKFxRy99Q6dSWVr9geZvHGG/ZfvsK3MBHRW7gbIFiRZeP2Y2KtHHGkbJLTvMPGxARCC4rpLW5GJBL5tMCNI/44DkLfnAFopluwRZl90uCVvhiOBN+vMK8WOqjqEkMSGuxBScqi1n+r7n0CIbDtCeAP0SqB7468pqKhFKUV8bIBfY8/whQrxhbYTG+5i4vpJfgy1e8fZ6a5yH3DFla7NzfDl7gWklIhAELTOjlQpjrW/xV9YBNBrR8wW7ypbwPHskgicxDLx909ZHB9GSj9Fpy+y+1QjMhgCmAIq/zum3LsHCK+TKiUIX44fxz2qXjtitriJJeCeprYjZnMu8gMgoZVCO2m0k06g1UOgyusM8A8PqAKAYqQluwAAAABJRU5ErkJggg=="\
                        width="50"\
                        height="50"\
                        style="">\
                    </image>\
                </g>\
            </svg>')
        group = dom1.getElementsByTagName('g')
        ia.backgroundNode = 0
        newrecord = ia.extract_g(group[0], "")
        assert_equal(newrecord["group"][0]['x'],'0')
        assert_equal(newrecord["group"][0]['y'],'0')
        assert_equal(newrecord["group"][0]['width'],'50')
        assert_equal(newrecord["group"][0]['height'],'50')

    def test_generateJSON(self):

        # check generateJSON
        tempDirSvg = tempfile.gettempdir()
        maxNumPixels = 5 * 1024 * 1024
        currentDir  = os.path.dirname(os.path.realpath(__file__))
        with open(currentDir + "/fixtures/generic1.svg", "r") as genericSvg:
            tempContent = genericSvg.read()
            tempContent = tempContent.replace("file://fixtures", "file://" + currentDir + "/fixtures")

        with open(tempDirSvg + "/generic1.svg", "w") as tempSvg:
            tempSvg.write(tempContent)

        console = LoggerMock()
        ia = iaObject(console)
        ia.analyzeSVG(tempSvg.name, maxNumPixels)

        ia.generateJSON()
        temp_content = ia.jsonContent
        #with open(currentDir + '/fixtures/temp.js', 'w') as js:
        #    js.write(temp_content)
        with open(currentDir + '/fixtures/generic1.js') as js:
            assert_equal(js.read(),temp_content)
