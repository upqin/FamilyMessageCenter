Framer.Defaults.Animation = curve: "spring(400,40,0)"

#-----------launching------------#
bg = new Layer
	width:750
	height:1334
	backgroundColor: "#fff"

homeScreen = new Layer
	x: 187.5
	y: 333.5
	width: 375
	height: 667
	image: "https://raw.githubusercontent.com/upqin/FamilyMessageCenter/master/bg.png"

logo = new Layer
	x: 225
	y: -300
	width: 300
	height: 300
	borderRadius: 150
	image: "https://raw.githubusercontent.com/upqin/FamilyMessageCenter/master/LOGO.png"
	shadowBlur: 50
	shadowColor: "#555"
	
buttonP = new Layer
	width: 460
	height: 100
	x: 145
	y: 1334
	borderRadius: 100
	backgroundColor: "#32936F"
	shadowBlur: 50
	shadowColor: "#555"
	html: "<p style='text-align: center; line-height: 100px; font-size: 40px; font-family: Circular, Avenir Next, Arial, sans-serif; font-weight: 500; letter-spacing: 2px;'>I am a Parent</p>"
	
buttonC = new Layer
	width: 460
	height: 100
	x: 145
	y: 1334
	borderRadius: 100
	borderColor: "#32936F"
	borderWidth: 6
	backgroundColor: "#fff"
	shadowBlur: 50
	shadowColor: "#555"
	html: "<p style='text-align: center; line-height: 100px; font-size: 40px; color: #32936F; font-family: Circular, Avenir Next, Arial, sans-serif; font-weight: 500; letter-spacing: 2px;'>I am a Child</p>"	

homeScreen.animate
	properties: 
		scale: 2
		curve: "spring(200,0,0)"
		
logo.animate
	properties: 
		y: 363
	curve: "spring(200,16,0)"	
	delay: 0.5
buttonP.animate
	properties: 
		y: 866
	curve: "spring(200,20,0)"	
	delay: 1	
buttonC.animate
	properties: 
		y: 1060
	curve: "spring(200,20,0)"	
	delay: 1.2	
taskView = new Layer
	width: 750
	height: 2500
	y: 1334
	backgroundColor: "#888"	
	
ui = require "StatusBar"
statusBar = new ui.StatusBar

buttonP.on Events.TouchStart, ->
	buttonP.animate
		properties: scale: 0.9
		curve: "spring(100,10,0)"
buttonP.on Events.TouchEnd, ->
	buttonP.animate
		properties: 
			scale: 3
			opacity: 0
			blur: 10
		time: 0.2
	status.animate
		properties: 
			y: 10
	taskView.animate
		properties: 
			y: 0
		curve: "spring(400, 40, 0)"
	
buttonC.on Events.TouchStart, ->
	buttonC.animate
		properties: scale: 0.9
		curve: "spring(100,10,0)"
buttonC.on Events.TouchEnd, ->
	buttonC.animate
		properties: 
			scale: 3
			opacity: 0
			blur: 10
		time: 0.2
	status.animate
		properties: 
			y: 10
	taskView.animate
		properties: 
			y: 0
		curve: "spring(400, 40, 0)"

	
