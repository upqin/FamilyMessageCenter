#------modules-----#
{ViewNavigationController}= require 'ViewNavigationController'
h1 = require 'highlightr'
ui = require "StatusBar"

#-------vnc-------#
vnc = new ViewNavigationController
bg = new BackgroundLayer

vnc.animationOptions =
	curve: "ease-in-out"
	time: 0.4

#-----------layers------------#
homeScreen = new Layer
	name: "initialView"
	width: 750
	height: 1334
	image: "https://raw.githubusercontent.com/upqin/FamilyMessageCenter/master/bg.png"
	superLayer: vnc

logo = new Layer
	x: 225
	width: 300
	height: 300
	y: 335
	borderRadius: 150
	image: "https://raw.githubusercontent.com/upqin/FamilyMessageCenter/master/LOGO.png"
	shadowBlur: 20
	shadowColor: "#555"
	superLayer: homeScreen

ImP = new Layer
	width: 460
	height: 100
	x: 145
	y: 940
	borderRadius: 20
	backgroundColor: "#32936F"
	shadowBlur: 20
	shadowColor: "#555"
	html: "<p style='text-align: center; line-height: 100px; font-size: 40px; font-family: Circular, Avenir Next, Arial, sans-serif; font-weight: 500; letter-spacing: 2px;'>I am a Parent</p>"
	superLayer: homeScreen
	
ImC = new Layer
	width: 460
	height: 100
	x: 145
	y: 1100
	borderRadius: 20
	borderColor: "#32936F"
	borderWidth: 5
	backgroundColor: "#fff"
	shadowBlur: 20
	shadowColor: "#555"
	html: "<p style='text-align: center; line-height: 100px; font-size: 40px; color: #32936F; font-family: Circular, Avenir Next, Arial, sans-serif; font-weight: 500; letter-spacing: 2px;'>I am a Child</p>"	
	superLayer: homeScreen
	
taskView = new Layer
	width: 750
	height: 2500
	y: 1334
	backgroundColor: "#888"	
	superLayer: vnc
	
header = new Layer
	width: 750
	height: 128
	backgroundColor: "#32936F"
	superLayer: taskView

stBar = new Layer
	width: 740
	height: 20
	x: 5
	y: 10
	image: "https://raw.githubusercontent.com/upqin/FamilyMessageCenter/master/StatusBarWhite0.png"
	superLayer: taskView
	
#-----buttons-------#
btP = new Layer	
	width: 460
	height: 100
	x: 145
	y: 940
	backgroundColor: null
	superLayer: homeScreen
	highlight: true

btC = new Layer	
	width: 460
	height: 100
	x: 145
	y: 1100
	backgroundColor: null
	superLayer: homeScreen
	highlight: true
	
#-----animation----#	
btP.on Events.Click, ->
	vnc.transition taskView

btC.on Events.Click, ->
	vnc.transition taskView