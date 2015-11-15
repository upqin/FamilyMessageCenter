require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"StatusBar":[function(require,module,exports){
var iOSStatusBar,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.StatusBar = iOSStatusBar = (function(superClass) {
  var DARK, HEIGHT, LIGHT, WIDTH;

  extend(iOSStatusBar, superClass);

  HEIGHT = 40;

  WIDTH = Framer.Device.screen.width;

  LIGHT = "light";

  DARK = "dark";

  function iOSStatusBar(options) {
    var base, base1, imgLeft, imgMiddle, imgRight;
    this.options = options;
    if (this.options == null) {
      this.options = {};
    }
    if ((base = this.options).backgroundColor == null) {
      base.backgroundColor = "transparent";
    }
    iOSStatusBar.__super__.constructor.call(this, this.options);
    this.height = HEIGHT;
    this.width = WIDTH;
    if (navigator.standalone) {
      return;
    }
    if ((base1 = this.options).shade == null) {
      base1.shade = LIGHT;
    }
    if (this.options.shade !== LIGHT && this.options.shade !== DARK) {
      this.options.shade = LIGHT;
    }
    imgLeft = "modules/StatusBar-assets/status-" + this.options.shade + "-left.png";
    imgMiddle = "modules/StatusBar-assets/status-" + this.options.shade + "-middle.png";
    imgRight = "modules/StatusBar-assets/status-" + this.options.shade + "-right.png";
    this.statusLeft = new Layer({
      superLayer: this,
      image: imgLeft,
      width: 130,
      height: HEIGHT
    });
    this.statusMiddle = new Layer({
      superLayer: this,
      image: imgMiddle,
      width: 108,
      height: HEIGHT,
      x: WIDTH / 2 - 108 / 2
    });
    this.statusRight = new Layer({
      superLayer: this,
      image: imgRight,
      width: 130,
      height: HEIGHT,
      x: WIDTH - 130
    });
  }

  return iOSStatusBar;

})(Layer);


},{}],"ViewNavigationController":[function(require,module,exports){
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

exports.ViewNavigationController = (function(superClass) {
  var ANIMATION_OPTIONS, BACKBUTTON_VIEW_NAME, BACK_BUTTON_FRAME, DEBUG_MODE, DIR, INITIAL_VIEW_NAME, PUSH;

  extend(ViewNavigationController, superClass);

  INITIAL_VIEW_NAME = "initialView";

  BACKBUTTON_VIEW_NAME = "vnc-backButton";

  ANIMATION_OPTIONS = {
    time: 0.3,
    curve: "ease-in-out"
  };

  BACK_BUTTON_FRAME = {
    x: 0,
    y: 40,
    width: 88,
    height: 88
  };

  PUSH = {
    UP: "pushUp",
    DOWN: "pushDown",
    LEFT: "pushLeft",
    RIGHT: "pushRight",
    CENTER: "pushCenter"
  };

  DIR = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right"
  };

  DEBUG_MODE = false;

  function ViewNavigationController(options) {
    var base, base1, base2, base3;
    this.options = options != null ? options : {};
    this.views = this.history = this.initialView = this.currentView = this.previousView = this.animationOptions = this.initialViewName = null;
    if ((base = this.options).width == null) {
      base.width = Screen.width;
    }
    if ((base1 = this.options).height == null) {
      base1.height = Screen.height;
    }
    if ((base2 = this.options).clip == null) {
      base2.clip = true;
    }
    if ((base3 = this.options).backgroundColor == null) {
      base3.backgroundColor = "#999";
    }
    ViewNavigationController.__super__.constructor.call(this, this.options);
    this.views = [];
    this.history = [];
    this.animationOptions = this.options.animationOptions || ANIMATION_OPTIONS;
    this.initialViewName = this.options.initialViewName || INITIAL_VIEW_NAME;
    this.backButtonFrame = this.options.backButtonFrame || BACK_BUTTON_FRAME;
    this.debugMode = this.options.debugMode != null ? this.options.debugMode : DEBUG_MODE;
    this.on("change:subLayers", function(changeList) {
      var i, len, ref, results, subLayer;
      ref = changeList.added;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        subLayer = ref[i];
        results.push(this.addView(subLayer, true));
      }
      return results;
    });
  }

  ViewNavigationController.prototype.addView = function(view, viaInternalChangeEvent) {
    var obj, vncHeight, vncWidth;
    vncWidth = this.options.width;
    vncHeight = this.options.height;
    view.states.add((
      obj = {},
      obj["" + PUSH.UP] = {
        x: 0,
        y: -vncHeight
      },
      obj["" + PUSH.LEFT] = {
        x: -vncWidth,
        y: 0
      },
      obj["" + PUSH.CENTER] = {
        x: 0,
        y: 0
      },
      obj["" + PUSH.RIGHT] = {
        x: vncWidth,
        y: 0
      },
      obj["" + PUSH.DOWN] = {
        x: 0,
        y: vncHeight
      },
      obj
    ));
    view.states.animationOptions = this.animationOptions;
    if (view.name === this.initialViewName) {
      this.initialView = view;
      this.currentView = view;
      view.states.switchInstant(PUSH.CENTER);
      this.history.push(view);
    } else {
      view.states.switchInstant(PUSH.RIGHT);
    }
    if (!(view.superLayer === this || viaInternalChangeEvent)) {
      view.superLayer = this;
    }
    if (view.name !== this.initialViewName) {
      this._applyBackButton(view);
    }
    return this.views.push(view);
  };

  ViewNavigationController.prototype.transition = function(view, direction, switchInstant, preventHistory) {
    if (direction == null) {
      direction = DIR.RIGHT;
    }
    if (switchInstant == null) {
      switchInstant = false;
    }
    if (preventHistory == null) {
      preventHistory = false;
    }
    if (view === this.currentView) {
      return false;
    }
    if (direction === DIR.RIGHT) {
      view.states.switchInstant(PUSH.RIGHT);
      this.currentView.states["switch"](PUSH.LEFT);
    } else if (direction === DIR.DOWN) {
      view.states.switchInstant(PUSH.DOWN);
      this.currentView.states["switch"](PUSH.UP);
    } else if (direction === DIR.LEFT) {
      view.states.switchInstant(PUSH.LEFT);
      this.currentView.states["switch"](PUSH.RIGHT);
    } else if (direction === DIR.UP) {
      view.states.switchInstant(PUSH.UP);
      this.currentView.states["switch"](PUSH.DOWN);
    } else {
      view.states.switchInstant(PUSH.CENTER);
      this.currentView.states.switchInstant(PUSH.LEFT);
    }
    view.states["switch"](PUSH.CENTER);
    this.previousView = this.currentView;
    this.currentView = view;
    if (preventHistory === false) {
      this.history.push(this.previousView);
    }
    return this.emit(Events.Change);
  };

  ViewNavigationController.prototype.removeBackButton = function(view) {
    return Utils.delay(0, (function(_this) {
      return function() {
        return view.subLayersByName(BACKBUTTON_VIEW_NAME)[0].visible = false;
      };
    })(this));
  };

  ViewNavigationController.prototype.back = function() {
    var direction, preventHistory, switchInstant;
    this.transition(this._getLastHistoryItem(), direction = DIR.LEFT, switchInstant = false, preventHistory = true);
    return this.history.pop();
  };

  ViewNavigationController.prototype._getLastHistoryItem = function() {
    return this.history[this.history.length - 1];
  };

  ViewNavigationController.prototype._applyBackButton = function(view, frame) {
    if (frame == null) {
      frame = this.backButtonFrame;
    }
    return Utils.delay(0, (function(_this) {
      return function() {
        var backButton;
        if (view.backButton !== false) {
          backButton = new Layer({
            name: BACKBUTTON_VIEW_NAME,
            width: 80,
            height: 80,
            superLayer: view
          });
          if (_this.debugMode === false) {
            backButton.backgroundColor = "transparent";
          }
          backButton.frame = frame;
          return backButton.on(Events.Click, function() {
            return _this.back();
          });
        }
      };
    })(this));
  };

  return ViewNavigationController;

})(Layer);


},{}],"highlightr":[function(require,module,exports){

/*
 | Highlightr v1.0.0 - 2015-09-02 
 | A custom Framer.js module that shows hotspots over clickable Layers in your prototype
 | https://github.com/jonahvsweb/Framer-Highlightr
 | 
 | Copyright (c) 2015 Jonah Bitautas <jonahvsweb@gmail.com> 
 | 
 | Released under the MIT license
 */
var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

window.Layer = (function(superClass) {
  extend(Layer, superClass);

  function Layer(options) {
    if (options == null) {
      options = {};
    }
    this.addListener = bind(this.addListener, this);
    if (options.highlight == null) {
      options.highlight = false;
    }
    Layer.__super__.constructor.call(this, options);
    if (options.highlight) {
      this._dispatch();
    }
  }

  Layer.prototype.addListener = function() {
    var eventNames, j, originalListener;
    eventNames = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), originalListener = arguments[j++];
    Layer.__super__.addListener.apply(this, arguments);
    return this._element.classList.add('pitchr');
  };

  Layer.prototype._dispatch = function() {
    return this.addListener(exports.clickTap, function(e) {
      var evt;
      evt = new CustomEvent('pitchr', {
        detail: {
          message: {
            targ: e.currentTarget,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
          }
        },
        bubbles: true,
        cancelable: true
      });
      return e.currentTarget.dispatchEvent(evt);
    });
  };

  return Layer;

})(Layer);

exports.clickTap = 'ontouchstart' in window ? 'touchstart' : 'click';

exports.killAllHighlights = false;

exports.highlightr = function() {
  var hasPitchr, pitchrs;
  hasPitchr = false;
  pitchrs = [];
  window.addEventListener('pitchr', function(e) {
    var j, layer, layerList, len, results;
    if (!exports.killAllHighlights) {
      layerList = window.Framer.CurrentContext.getLayers();
      pitchrs = [];
      results = [];
      for (j = 0, len = layerList.length; j < len; j++) {
        layer = layerList[j];
        if (layer.classList.contains('pitchr')) {
          pitchrs.push(layer);
          results.push(hasPitchr = true);
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  });
  return window.addEventListener(exports.clickTap, function(e) {
    var hotSpot, i, j, layer, layerList, len, results;
    if (!exports.killAllHighlights) {
      if (pitchrs.length <= 0) {
        layerList = window.Framer.CurrentContext.getLayers();
      } else {
        layerList = pitchrs;
      }
      results = [];
      for (i = j = 0, len = layerList.length; j < len; i = ++j) {
        layer = layerList[i];
        if (layer.classList.contains('pitchr')) {
          if (hasPitchr) {
            if (i === layerList.length - 1) {
              results.push(hasPitchr = false);
            } else {
              results.push(void 0);
            }
          } else {
            hotSpot = new Layer({
              name: 'hotSpot' + i,
              superLayer: layer.superLayer,
              x: layer.x - 10,
              y: layer.y - 10,
              width: layer.width + 20,
              height: layer.height + 20,
              backgroundColor: 'rgba(100, 240, 244, 0.5)'
            });
            hotSpot.animate({
              properties: {
                opacity: 0
              },
              time: 0.4,
              curve: 'ease-in-out',
              delay: 0.2
            });
            results.push(hotSpot.on(Events.AnimationStop, function() {
              return this.destroy();
            }));
          }
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  });
};

exports.highlightr();


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvUWluL09uZURyaXZlL3dlYi9xaW5saS9GYW1pbHlNZXNzYWdlQ2VudGVyL0ZNX3YyUy5mcmFtZXIvbW9kdWxlcy9TdGF0dXNCYXIuY29mZmVlIiwiL1VzZXJzL1Fpbi9PbmVEcml2ZS93ZWIvcWlubGkvRmFtaWx5TWVzc2FnZUNlbnRlci9GTV92MlMuZnJhbWVyL21vZHVsZXMvVmlld05hdmlnYXRpb25Db250cm9sbGVyLmNvZmZlZSIsIi9Vc2Vycy9RaW4vT25lRHJpdmUvd2ViL3FpbmxpL0ZhbWlseU1lc3NhZ2VDZW50ZXIvRk1fdjJTLmZyYW1lci9tb2R1bGVzL2hpZ2hsaWdodHIuY29mZmVlIiwiL1VzZXJzL1Fpbi9PbmVEcml2ZS93ZWIvcWlubGkvRmFtaWx5TWVzc2FnZUNlbnRlci9GTV92MlMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQSxZQUFBO0VBQUE7OztBQUFBLE9BQU8sQ0FBQyxTQUFSLEdBQTBCO0FBRXpCLE1BQUE7Ozs7RUFBQSxNQUFBLEdBQVM7O0VBQ1QsS0FBQSxHQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDOztFQUM3QixLQUFBLEdBQVE7O0VBQ1IsSUFBQSxHQUFROztFQUVLLHNCQUFDLE9BQUQ7QUFDWixRQUFBO0lBRGEsSUFBQyxDQUFBLFVBQUQ7O01BQ2IsSUFBQyxDQUFBLFVBQVc7OztVQUNKLENBQUMsa0JBQW1COztJQUM1Qiw4Q0FBTSxJQUFDLENBQUEsT0FBUDtJQUNBLElBQUMsQ0FBQyxNQUFGLEdBQVc7SUFDWCxJQUFDLENBQUMsS0FBRixHQUFXO0lBRVgsSUFBVSxTQUFTLENBQUMsVUFBcEI7QUFBQSxhQUFBOzs7V0FHUSxDQUFDLFFBQVM7O0lBQ2xCLElBQTJCLElBQUMsQ0FBQSxPQUFPLENB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RUFKckI7Y0FLQSxNQUFBLEVBQVEsS0FBSyxDQUFDLE1BQU4sR0FBZSxFQUx2QjtjQU1BLGVBQUEsRUFBaUIsMEJBTmpCO2FBRGE7WUFTZCxPQUFPLENBQUMsT0FBUixDQUNDO2NBQUEsVUFBQSxFQUNDO2dCQUFBLE9BQUEsRUFBUyxDQUFUO2VBREQ7Y0FFQSxJQUFBLEVBQU0sR0FGTjtjQUdBLEtBQUEsRUFBTyxhQUhQO2NBSUEsS0FBQSxFQUFPLEdBSlA7YUFERDt5QkFPQSxPQUFPLENBQUMsRUFBUixDQUFXLE1BQU0sQ0FBQyxhQUFsQixFQUFpQyxTQUFBO3FCQUNoQyxJQUFJLENBQUMsT0FBTCxDQUFBO1lBRGdDLENBQWpDLEdBcEJEO1dBREQ7U0FBQSxNQUFBOytCQUFBOztBQUREO3FCQU5EOztFQUR5QyxDQUExQztBQWRvQjs7QUE4Q3JCLE9BQU8sQ0FBQyxVQUFSLENBQUE7Ozs7QUNsRkEsT0FBTyxDQUFDLEtBQVIsR0FBZ0I7O0FBRWhCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLFNBQUE7U0FDcEIsS0FBQSxDQUFNLHVCQUFOO0FBRG9COztBQUdyQixPQUFPLENBQUMsT0FBUixHQUFrQixDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnRzLlN0YXR1c0JhciA9IGNsYXNzIGlPU1N0YXR1c0JhciBleHRlbmRzIExheWVyXG5cdFxuXHRIRUlHSFQgPSA0MFxuXHRXSURUSCA9IEZyYW1lci5EZXZpY2Uuc2NyZWVuLndpZHRoXG5cdExJR0hUID0gXCJsaWdodFwiXG5cdERBUksgID0gXCJkYXJrXCJcblxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zKSAtPlxuXHRcdEBvcHRpb25zID89IHt9XG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwidHJhbnNwYXJlbnRcIlxuXHRcdHN1cGVyIEBvcHRpb25zXG5cdFx0QC5oZWlnaHQgPSBIRUlHSFRcblx0XHRALndpZHRoICA9IFdJRFRIXG5cdFx0XG5cdFx0cmV0dXJuIGlmIG5hdmlnYXRvci5zdGFuZGFsb25lXG5cdFx0IyBUaGlzIGNvZGUgYmVsb3cgc2hvdWxkbid0IGJlIHVzZWQgaWYgaW4gc3RhbmRhbG9uZSBtb2RlIHNpbmNlIGl0IGdldHMgaW5jbHVkZWQgYXV0b21hdGljYWxseVxuXHRcdFxuXHRcdEBvcHRpb25zLnNoYWRlID89IExJR0hUXG5cdFx0QG9wdGlvbnMuc2hhZGUgID0gTElHSFQgaWYgQG9wdGlvbnMuc2hhZGUgaXNudCBMSUdIVCBhbmQgQG9wdGlvbnMuc2hhZGUgaXNudCBEQVJLXG5cdFx0XG5cdFx0aW1nTGVmdCAgID0gXCJtb2R1bGVzL1N0YXR1c0Jhci1hc3NldHMvc3RhdHVzLSN7QG9wdGlvbnMuc2hhZGV9LWxlZnQucG5nXCJcblx0XHRpbWdNaWRkbGUgPSBcIm1vZHVsZXMvU3RhdHVzQmFyLWFzc2V0cy9zdGF0dXMtI3tAb3B0aW9ucy5zaGFkZX0tbWlkZGxlLnBuZ1wiXG5cdFx0aW1nUmlnaHQgID0gXCJtb2R1bGVzL1N0YXR1c0Jhci1hc3NldHMvc3RhdHVzLSN7QG9wdGlvbnMuc2hhZGV9LXJpZ2h0LnBuZ1wiXG5cdFx0XG5cdFx0QHN0YXR1c0xlZnQgICA9IG5ldyBMYXllciBzdXBlckxheWVyOiBALCBpbWFnZTogaW1nTGVmdCwgICB3aWR0aDogMTMwLCBoZWlnaHQ6IEhFSUdIVFxuXHRcdEBzdGF0dXNNaWRkbGUgPSBuZXcgTGF5ZXIgc3VwZXJMYXllcjogQCwgaW1hZ2U6IGltZ01pZGRsZSwgd2lkdGg6IDEwOCwgaGVpZ2h0OiBIRUlHSFQsIHg6IFdJRFRILzItMTA4LzJcblx0XHRAc3RhdHVzUmlnaHQgID0gbmV3IExheWVyIHN1cGVyTGF5ZXI6IEAsIGltYWdlOiBpbWdSaWdodCwgIHdpZHRoOiAxMzAsIGhlaWdodDogSEVJR0hULCB4OiBXSURUSC0xMzAiLCJjbGFzcyBleHBvcnRzLlZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBleHRlbmRzIExheWVyXG5cblx0IyBTZXR1cCBDbGFzcyBDb25zdGFudHNcblx0SU5JVElBTF9WSUVXX05BTUUgPSBcImluaXRpYWxWaWV3XCJcblx0QkFDS0JVVFRPTl9WSUVXX05BTUUgPSBcInZuYy1iYWNrQnV0dG9uXCJcblx0QU5JTUFUSU9OX09QVElPTlMgPSBcblx0XHR0aW1lOiAwLjNcblx0XHRjdXJ2ZTogXCJlYXNlLWluLW91dFwiXG5cdEJBQ0tfQlVUVE9OX0ZSQU1FID0gXG5cdFx0eDogMFxuXHRcdHk6IDQwXG5cdFx0d2lkdGg6IDg4XG5cdFx0aGVpZ2h0OiA4OFxuXHRQVVNIID1cblx0XHRVUDogICAgIFwicHVzaFVwXCJcblx0XHRET1dOOiAgIFwicHVzaERvd25cIlxuXHRcdExFRlQ6ICAgXCJwdXNoTGVmdFwiXG5cdFx0UklHSFQ6ICBcInB1c2hSaWdodFwiXG5cdFx0Q0VOVEVSOiBcInB1c2hDZW50ZXJcIlxuXHRESVIgPVxuXHRcdFVQOiAgICBcInVwXCJcblx0XHRET1dOOiAgXCJkb3duXCJcblx0XHRMRUZUOiAgXCJsZWZ0XCJcblx0XHRSSUdIVDogXCJyaWdodFwiXG5cdERFQlVHX01PREUgPSBmYWxzZVxuXHRcdFxuXHQjIFNldHVwIEluc3RhbmNlIGFuZCBJbnN0YW5jZSBWYXJpYWJsZXNcdFxuXHRjb25zdHJ1Y3RvcjogKEBvcHRpb25zPXt9KSAtPlxuXG5cdFx0QHZpZXdzID0gQGhpc3RvcnkgPSBAaW5pdGlhbFZpZXcgPSBAY3VycmVudFZpZXcgPSBAcHJldmlvdXNWaWV3ID0gQGFuaW1hdGlvbk9wdGlvbnMgPSBAaW5pdGlhbFZpZXdOYW1lID0gbnVsbFxuXHRcdEBvcHRpb25zLndpZHRoICAgICAgICAgICA/PSBTY3JlZW4ud2lkdGhcblx0XHRAb3B0aW9ucy5oZWlnaHQgICAgICAgICAgPz0gU2NyZWVuLmhlaWdodFxuXHRcdEBvcHRpb25zLmNsaXAgICAgICAgICAgICA/PSB0cnVlXG5cdFx0QG9wdGlvbnMuYmFja2dyb3VuZENvbG9yID89IFwiIzk5OVwiXG5cdFx0XG5cdFx0c3VwZXIgQG9wdGlvbnNcblx0XHRcblx0XHRAdmlld3MgICA9IFtdXG5cdFx0QGhpc3RvcnkgPSBbXVxuXHRcdEBhbmltYXRpb25PcHRpb25zID0gQG9wdGlvbnMuYW5pbWF0aW9uT3B0aW9ucyBvciBBTklNQVRJT05fT1BUSU9OU1xuXHRcdEBpbml0aWFsVmlld05hbWUgID0gQG9wdGlvbnMuaW5pdGlhbFZpZXdOYW1lICBvciBJTklUSUFMX1ZJRVdfTkFNRVxuXHRcdEBiYWNrQnV0dG9uRnJhbWUgID0gQG9wdGlvbnMuYmFja0J1dHRvbkZyYW1lICBvciBCQUNLX0JVVFRPTl9GUkFNRVxuXG5cdFx0QGRlYnVnTW9kZSA9IGlmIEBvcHRpb25zLmRlYnVnTW9kZT8gdGhlbiBAb3B0aW9ucy5kZWJ1Z01vZGUgZWxzZSBERUJVR19NT0RFXG5cdFx0XG5cdFx0QC5vbiBcImNoYW5nZTpzdWJMYXllcnNcIiwgKGNoYW5nZUxpc3QpIC0+XG5cdFx0XHRAYWRkVmlldyBzdWJMYXllciwgdHJ1ZSBmb3Igc3ViTGF5ZXIgaW4gY2hhbmdlTGlzdC5hZGRlZFxuXG5cdGFkZFZpZXc6ICh2aWV3LCB2aWFJbnRlcm5hbENoYW5nZUV2ZW50KSAtPlxuXHRcdFxuXHRcdHZuY1dpZHRoICA9IEBvcHRpb25zLndpZHRoXG5cdFx0dm5jSGVpZ2h0ID0gQG9wdGlvbnMuaGVpZ2h0XG5cblx0XHR2aWV3LnN0YXRlcy5hZGQoXG5cdFx0XHRcIiN7IFBVU0guVVAgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IC12bmNIZWlnaHRcblx0XHRcdFwiI3sgUFVTSC5MRUZUIH1cIjpcblx0XHRcdFx0eDogLXZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5DRU5URVIgfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5SSUdIVCB9XCI6XG5cdFx0XHRcdHg6IHZuY1dpZHRoXG5cdFx0XHRcdHk6IDBcblx0XHRcdFwiI3sgUFVTSC5ET1dOIH1cIjpcblx0XHRcdFx0eDogMFxuXHRcdFx0XHR5OiB2bmNIZWlnaHRcblx0XHQpXG5cblx0XHRcdFxuXHRcdHZpZXcuc3RhdGVzLmFuaW1hdGlvbk9wdGlvbnMgPSBAYW5pbWF0aW9uT3B0aW9uc1xuXHRcdFxuXHRcdGlmIHZpZXcubmFtZSBpcyBAaW5pdGlhbFZpZXdOYW1lXG5cdFx0XHRAaW5pdGlhbFZpZXcgPSB2aWV3XG5cdFx0XHRAY3VycmVudFZpZXcgPSB2aWV3XG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guQ0VOVEVSXG5cdFx0XHRAaGlzdG9yeS5wdXNoIHZpZXdcblx0XHRlbHNlXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guUklHSFRcblx0XHRcblx0XHR1bmxlc3Mgdmlldy5zdXBlckxheWVyIGlzIEAgb3IgdmlhSW50ZXJuYWxDaGFuZ2VFdmVudFxuXHRcdFx0dmlldy5zdXBlckxheWVyID0gQFxuXHRcdFx0XG5cdFx0QF9hcHBseUJhY2tCdXR0b24gdmlldyB1bmxlc3Mgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdFxuXHRcdEB2aWV3cy5wdXNoIHZpZXdcblxuXHR0cmFuc2l0aW9uOiAodmlldywgZGlyZWN0aW9uID0gRElSLlJJR0hULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gZmFsc2UpIC0+XG5cblx0XHRyZXR1cm4gZmFsc2UgaWYgdmlldyBpcyBAY3VycmVudFZpZXdcblx0XHRcblx0XHQjIFNldHVwIFZpZXdzIGZvciB0aGUgdHJhbnNpdGlvblxuXHRcdFxuXHRcdGlmIGRpcmVjdGlvbiBpcyBESVIuUklHSFRcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guUklHSFRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guTEVGVFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5ET1dOXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkRPV05cblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guVVBcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuTEVGVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5MRUZUXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILlJJR0hUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLlVQXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILlVQXG5cdFx0XHRAY3VycmVudFZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkRPV05cblx0XHRlbHNlXG5cdFx0XHQjIElmIHRoZXkgc3BlY2lmaWVkIHNvbWV0aGluZyBkaWZmZXJlbnQganVzdCBzd2l0Y2ggaW1tZWRpYXRlbHlcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkxFRlRcblx0XHRcblx0XHQjIFB1c2ggdmlldyB0byBDZW50ZXJcblx0XHR2aWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5DRU5URVJcblx0XHQjIGN1cnJlbnRWaWV3IGlzIG5vdyBvdXIgcHJldmlvdXNWaWV3XG5cdFx0QHByZXZpb3VzVmlldyA9IEBjdXJyZW50Vmlld1xuXHRcdCMgU2V0IG91ciBjdXJyZW50VmlldyB0byB0aGUgdmlldyB3ZSdyZSBicmluZ2luZyBpblxuXHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblxuXHRcdCMgU3RvcmUgdGhlIGxhc3QgdmlldyBpbiBoaXN0b3J5XG5cdFx0QGhpc3RvcnkucHVzaCBAcHJldmlvdXNWaWV3IGlmIHByZXZlbnRIaXN0b3J5IGlzIGZhbHNlXG5cdFx0XG5cdFx0QGVtaXQgRXZlbnRzLkNoYW5nZVxuXG5cdHJlbW92ZUJhY2tCdXR0b246ICh2aWV3KSAtPlxuXHRcdFV0aWxzLmRlbGF5IDAsID0+XG5cdFx0XHR2aWV3LnN1YkxheWVyc0J5TmFtZShCQUNLQlVUVE9OX1ZJRVdfTkFNRSlbMF0udmlzaWJsZSA9IGZhbHNlXG5cblx0YmFjazogKCkgLT5cblx0XHRAdHJhbnNpdGlvbihAX2dldExhc3RIaXN0b3J5SXRlbSgpLCBkaXJlY3Rpb24gPSBESVIuTEVGVCwgc3dpdGNoSW5zdGFudCA9IGZhbHNlLCBwcmV2ZW50SGlzdG9yeSA9IHRydWUpXG5cdFx0QGhpc3RvcnkucG9wKClcblxuXHRfZ2V0TGFzdEhpc3RvcnlJdGVtOiAoKSAtPlxuXHRcdHJldHVybiBAaGlzdG9yeVtAaGlzdG9yeS5sZW5ndGggLSAxXVxuXG5cdF9hcHBseUJhY2tCdXR0b246ICh2aWV3LCBmcmFtZSA9IEBiYWNrQnV0dG9uRnJhbWUpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdGlmIHZpZXcuYmFja0J1dHRvbiBpc250IGZhbHNlXG5cdFx0XHRcdGJhY2tCdXR0b24gPSBuZXcgTGF5ZXJcblx0XHRcdFx0XHRuYW1lOiBCQUNLQlVUVE9OX1ZJRVdfTkFNRVxuXHRcdFx0XHRcdHdpZHRoOiA4MFxuXHRcdFx0XHRcdGhlaWdodDogODBcblx0XHRcdFx0XHRzdXBlckxheWVyOiB2aWV3XG5cblx0XHRcdFx0aWYgQGRlYnVnTW9kZSBpcyBmYWxzZVxuXHRcdFx0XHRcdGJhY2tCdXR0b24uYmFja2dyb3VuZENvbG9yID0gXCJ0cmFuc3BhcmVudFwiXG5cblx0XHRcdFx0YmFja0J1dHRvbi5mcmFtZSA9IGZyYW1lXG5cblx0XHRcdFx0YmFja0J1dHRvbi5vbiBFdmVudHMuQ2xpY2ssID0+XG5cdFx0XHRcdFx0QGJhY2soKVxuXHRcdFxuICAgIFxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDEgLSBEZWZpbmUgSW5pdGlhbFZpZXdOYW1lICMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcblxuIyBpbml0aWFsVmlld0tleSA9IFwidmlldzFcIlxuIyBcbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlciBpbml0aWFsVmlld05hbWU6IGluaXRpYWxWaWV3S2V5XG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgXHR3aWR0aDogIFNjcmVlbi53aWR0aFxuIyBcdGhlaWdodDogU2NyZWVuLmhlaWdodFxuIyBcdGJhY2tncm91bmRDb2xvcjogXCJyZWRcIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuIyBVU0FHRSBFWEFNUExFIDIgLSBVc2UgZGVmYXVsdCBpbml0aWFsVmlld05hbWUgXCJpbml0aWFsVmlld1wiICMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIHZuYyA9IG5ldyBWaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXJcblxuIyB2aWV3MSA9IG5ldyBMYXllclxuIyBcdG5hbWU6IFwiaW5pdGlhbFZpZXdcIlxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cdFxuIyB2aWV3MiA9IG5ldyBMYXllclxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcImdyZWVuXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblxuIyB2aWV3MS5vbiBFdmVudHMuQ2xpY2ssIC0+IHZuYy50cmFuc2l0aW9uIHZpZXcyXG4jIHZpZXcyLm9uIEV2ZW50cy5DbGljaywgLT4gdm5jLmJhY2soKVxuXHQiLCIjIyNcbiB8IEhpZ2hsaWdodHIgdjEuMC4wIC0gMjAxNS0wOS0wMiBcbiB8IEEgY3VzdG9tIEZyYW1lci5qcyBtb2R1bGUgdGhhdCBzaG93cyBob3RzcG90cyBvdmVyIGNsaWNrYWJsZSBMYXllcnMgaW4geW91ciBwcm90b3R5cGVcbiB8IGh0dHBzOi8vZ2l0aHViLmNvbS9qb25haHZzd2ViL0ZyYW1lci1IaWdobGlnaHRyXG4gfCBcbiB8IENvcHlyaWdodCAoYykgMjAxNSBKb25haCBCaXRhdXRhcyA8am9uYWh2c3dlYkBnbWFpbC5jb20+IFxuIHwgXG4gfCBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgXG4jIyNcbmNsYXNzIHdpbmRvdy5MYXllciBleHRlbmRzIExheWVyXG5cblx0Y29uc3RydWN0b3I6IChvcHRpb25zPXt9KSAtPlxuXHRcdG9wdGlvbnMuaGlnaGxpZ2h0ID89IGZhbHNlXG5cdFx0c3VwZXIgb3B0aW9uc1xuXG5cdFx0aWYgb3B0aW9ucy5oaWdobGlnaHRcblx0XHRcdEBfZGlzcGF0Y2goKVxuXG5cdGFkZExpc3RlbmVyOiAoZXZlbnROYW1lcy4uLiwgb3JpZ2luYWxMaXN0ZW5lcikgPT5cblx0XHRzdXBlclxuXHRcdEBfZWxlbWVudC5jbGFzc0xpc3QuYWRkICdwaXRjaHInXG5cblx0X2Rpc3BhdGNoOiAtPlxuXHRcdHRoaXMuYWRkTGlzdGVuZXIgZXhwb3J0cy5jbGlja1RhcCwgKGUpIC0+XG5cdFx0XHRldnQgPSBuZXcgQ3VzdG9tRXZlbnQgJ3BpdGNocicsIFxuXHRcdFx0XHRkZXRhaWw6IFxuXHRcdFx0XHRcdG1lc3NhZ2U6IFxuXHRcdFx0XHRcdFx0dGFyZzogZS5jdXJyZW50VGFyZ2V0XG5cdFx0XHRcdFx0XHR4OiB0aGlzLnhcblx0XHRcdFx0XHRcdHk6IHRoaXMueVxuXHRcdFx0XHRcdFx0d2lkdGg6IHRoaXMud2lkdGhcblx0XHRcdFx0XHRcdGhlaWdodDogdGhpcy5oZWlnaHRcblx0XHRcdFx0YnViYmxlczogdHJ1ZVxuXHRcdFx0XHRjYW5jZWxhYmxlOiB0cnVlXG5cblx0XHRcdGUuY3VycmVudFRhcmdldC5kaXNwYXRjaEV2ZW50IGV2dFxuXG5leHBvcnRzLmNsaWNrVGFwID0gaWYgJ29udG91Y2hzdGFydCcgb2Ygd2luZG93IHRoZW4gJ3RvdWNoc3RhcnQnIGVsc2UgJ2NsaWNrJ1xuZXhwb3J0cy5raWxsQWxsSGlnaGxpZ2h0cyA9IGZhbHNlXG5cbmV4cG9ydHMuaGlnaGxpZ2h0ciA9IC0+XG5cdGhhc1BpdGNociA9IGZhbHNlXG5cdHBpdGNocnMgPSBbXVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdwaXRjaHInLCAoZSkgLT5cblx0XHRpZiAhZXhwb3J0cy5raWxsQWxsSGlnaGxpZ2h0cyBcblx0XHRcdGxheWVyTGlzdCA9IHdpbmRvdy5GcmFtZXIuQ3VycmVudENvbnRleHQuZ2V0TGF5ZXJzKClcblx0XHRcdHBpdGNocnMgPSBbXVxuXG5cdFx0XHRmb3IgbGF5ZXIgaW4gbGF5ZXJMaXN0XG5cdFx0XHRcdGlmIGxheWVyLmNsYXNzTGlzdC5jb250YWlucyAncGl0Y2hyJ1xuXHRcdFx0XHRcdHBpdGNocnMucHVzaCBsYXllclxuXHRcdFx0XHRcdGhhc1BpdGNociA9IHRydWVcblxuXHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciBleHBvcnRzLmNsaWNrVGFwLCAoZSkgLT5cblx0XHRpZiAhZXhwb3J0cy5raWxsQWxsSGlnaGxpZ2h0cyBcblx0XHRcdGlmIHBpdGNocnMubGVuZ3RoIDw9IDBcblx0XHRcdFx0bGF5ZXJMaXN0ID0gd2luZG93LkZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRsYXllckxpc3QgPSBwaXRjaHJzXG5cblx0XHRcdGZvciBsYXllciwgaSBpbiBsYXllckxpc3Rcblx0XHRcdFx0aWYgbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zICdwaXRjaHInXG5cdFx0XHRcdFx0aWYgaGFzUGl0Y2hyXG5cdFx0XHRcdFx0XHRpZiBpID09IGxheWVyTGlzdC5sZW5ndGggLSAxXG5cdFx0XHRcdFx0XHRcdGhhc1BpdGNociA9IGZhbHNlXG5cdFx0XHRcdFx0ZWxzZSBcblx0XHRcdFx0XHRcdGhvdFNwb3QgPSBuZXcgTGF5ZXIgXG5cdFx0XHRcdFx0XHRcdG5hbWU6ICdob3RTcG90JyArIGlcblx0XHRcdFx0XHRcdFx0c3VwZXJMYXllcjogbGF5ZXIuc3VwZXJMYXllclxuXHRcdFx0XHRcdFx0XHR4OiBsYXllci54IC0gMTBcblx0XHRcdFx0XHRcdFx0eTogbGF5ZXIueSAtIDEwXG5cdFx0XHRcdFx0XHRcdHdpZHRoOiBsYXllci53aWR0aCArIDIwXG5cdFx0XHRcdFx0XHRcdGhlaWdodDogbGF5ZXIuaGVpZ2h0ICsgMjBcblx0XHRcdFx0XHRcdFx0YmFja2dyb3VuZENvbG9yOiAncmdiYSgxMDAsIDI0MCwgMjQ0LCAwLjUpJ1xuXG5cdFx0XHRcdFx0XHRob3RTcG90LmFuaW1hdGUgXG5cdFx0XHRcdFx0XHRcdHByb3BlcnRpZXM6XG5cdFx0XHRcdFx0XHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0XHRcdFx0XHR0aW1lOiAwLjRcblx0XHRcdFx0XHRcdFx0Y3VydmU6ICdlYXNlLWluLW91dCdcblx0XHRcdFx0XHRcdFx0ZGVsYXk6IDAuMlxuXG5cdFx0XHRcdFx0XHRob3RTcG90Lm9uIEV2ZW50cy5BbmltYXRpb25TdG9wLCAtPiBcblx0XHRcdFx0XHRcdFx0dGhpcy5kZXN0cm95KClcblxuZXhwb3J0cy5oaWdobGlnaHRyKClcblxuIiwiIyBBZGQgdGhlIGZvbGxvd2luZyBsaW5lIHRvIHlvdXIgcHJvamVjdCBpbiBGcmFtZXIgU3R1ZGlvLiBcbiMgbXlNb2R1bGUgPSByZXF1aXJlIFwibXlNb2R1bGVcIlxuIyBSZWZlcmVuY2UgdGhlIGNvbnRlbnRzIGJ5IG5hbWUsIGxpa2UgbXlNb2R1bGUubXlGdW5jdGlvbigpIG9yIG15TW9kdWxlLm15VmFyXG5cbmV4cG9ydHMubXlWYXIgPSBcIm15VmFyaWFibGVcIlxuXG5leHBvcnRzLm15RnVuY3Rpb24gPSAtPlxuXHRwcmludCBcIm15RnVuY3Rpb24gaXMgcnVubmluZ1wiXG5cbmV4cG9ydHMubXlBcnJheSA9IFsxLCAyLCAzXSJdfQ==
