require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"ViewNavigationController":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvUWluL09uZURyaXZlL3dlYi9xaW5saS9GYW1pbHlNZXNzYWdlQ2VudGVyL0ZNUy5mcmFtZXIvbW9kdWxlcy9WaWV3TmF2aWdhdGlvbkNvbnRyb2xsZXIuY29mZmVlIiwiL1VzZXJzL1Fpbi9PbmVEcml2ZS93ZWIvcWlubGkvRmFtaWx5TWVzc2FnZUNlbnRlci9GTVMuZnJhbWVyL21vZHVsZXMvaGlnaGxpZ2h0ci5jb2ZmZWUiLCIvVXNlcnMvUWluL09uZURyaXZlL3dlYi9xaW5saS9GYW1pbHlNZXNzYWdlQ2VudGVyL0ZNUy5mcmFtZXIvbW9kdWxlcy9teU1vZHVsZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOzs7QUFBTSxPQUFPLENBQUM7QUFHYixNQUFBOzs7O0VBQUEsaUJBQUEsR0FBb0I7O0VBQ3BCLG9CQUFBLEdBQXVCOztFQUN2QixpQkFBQSxHQUNDO0lBQUEsSUFBQSxFQUFNLEdBQU47SUFDQSxLQUFBLEVBQU8sYUFEUDs7O0VBRUQsaUJBQUEsR0FDQztJQUFBLENBQUEsRUFBRyxDQUFIO0lBQ0EsQ0FBQSxFQUFHLEVBREg7SUFFQSxLQUFBLEVBQU8sRUFGUDtJQUdBLE1BQUEsRUFBUSxFQUhSOzs7RUFJRCxJQUFBLEdBQ0M7SUFBQSxFQUFBLEVBQVEsUUFBUjtJQUNBLElBQUEsRUFBUSxVQURSO0lBRUEsSUFBQSxFQUFRLFVBRlI7SUFHQSxLQUFBLEVBQVEsV0FIUjtJQUlBLE1BQUEsRUFBUSxZQUpSOzs7RUFLRCxHQUFBLEdBQ0M7SUFBQSxFQUFBLEVBQU8sSUFBUDtJQUNBLElBQUEsRUFBTyxNQURQO0lBRUEsSUFBQSxFQUFPLE1BRlA7SUFHQSxLQUFBLEVBQU8sT0FIUDs7O0VBSUQsVUFBQSxHQUFhOztFQUdBLGtDQUFDLE9BQUQ7QUFFWixRQUFBO0lBRmEsSUFBQyxDQUFB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Q2xGQSxPQUFPLENBQUMsS0FBUixHQUFnQjs7QUFFaEIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsU0FBQTtTQUNwQixLQUFBLENBQU0sdUJBQU47QUFEb0I7O0FBR3JCLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIGV4cG9ydHMuVmlld05hdmlnYXRpb25Db250cm9sbGVyIGV4dGVuZHMgTGF5ZXJcblxuXHQjIFNldHVwIENsYXNzIENvbnN0YW50c1xuXHRJTklUSUFMX1ZJRVdfTkFNRSA9IFwiaW5pdGlhbFZpZXdcIlxuXHRCQUNLQlVUVE9OX1ZJRVdfTkFNRSA9IFwidm5jLWJhY2tCdXR0b25cIlxuXHRBTklNQVRJT05fT1BUSU9OUyA9IFxuXHRcdHRpbWU6IDAuM1xuXHRcdGN1cnZlOiBcImVhc2UtaW4tb3V0XCJcblx0QkFDS19CVVRUT05fRlJBTUUgPSBcblx0XHR4OiAwXG5cdFx0eTogNDBcblx0XHR3aWR0aDogODhcblx0XHRoZWlnaHQ6IDg4XG5cdFBVU0ggPVxuXHRcdFVQOiAgICAgXCJwdXNoVXBcIlxuXHRcdERPV046ICAgXCJwdXNoRG93blwiXG5cdFx0TEVGVDogICBcInB1c2hMZWZ0XCJcblx0XHRSSUdIVDogIFwicHVzaFJpZ2h0XCJcblx0XHRDRU5URVI6IFwicHVzaENlbnRlclwiXG5cdERJUiA9XG5cdFx0VVA6ICAgIFwidXBcIlxuXHRcdERPV046ICBcImRvd25cIlxuXHRcdExFRlQ6ICBcImxlZnRcIlxuXHRcdFJJR0hUOiBcInJpZ2h0XCJcblx0REVCVUdfTU9ERSA9IGZhbHNlXG5cdFx0XG5cdCMgU2V0dXAgSW5zdGFuY2UgYW5kIEluc3RhbmNlIFZhcmlhYmxlc1x0XG5cdGNvbnN0cnVjdG9yOiAoQG9wdGlvbnM9e30pIC0+XG5cblx0XHRAdmlld3MgPSBAaGlzdG9yeSA9IEBpbml0aWFsVmlldyA9IEBjdXJyZW50VmlldyA9IEBwcmV2aW91c1ZpZXcgPSBAYW5pbWF0aW9uT3B0aW9ucyA9IEBpbml0aWFsVmlld05hbWUgPSBudWxsXG5cdFx0QG9wdGlvbnMud2lkdGggICAgICAgICAgID89IFNjcmVlbi53aWR0aFxuXHRcdEBvcHRpb25zLmhlaWdodCAgICAgICAgICA/PSBTY3JlZW4uaGVpZ2h0XG5cdFx0QG9wdGlvbnMuY2xpcCAgICAgICAgICAgID89IHRydWVcblx0XHRAb3B0aW9ucy5iYWNrZ3JvdW5kQ29sb3IgPz0gXCIjOTk5XCJcblx0XHRcblx0XHRzdXBlciBAb3B0aW9uc1xuXHRcdFxuXHRcdEB2aWV3cyAgID0gW11cblx0XHRAaGlzdG9yeSA9IFtdXG5cdFx0QGFuaW1hdGlvbk9wdGlvbnMgPSBAb3B0aW9ucy5hbmltYXRpb25PcHRpb25zIG9yIEFOSU1BVElPTl9PUFRJT05TXG5cdFx0QGluaXRpYWxWaWV3TmFtZSAgPSBAb3B0aW9ucy5pbml0aWFsVmlld05hbWUgIG9yIElOSVRJQUxfVklFV19OQU1FXG5cdFx0QGJhY2tCdXR0b25GcmFtZSAgPSBAb3B0aW9ucy5iYWNrQnV0dG9uRnJhbWUgIG9yIEJBQ0tfQlVUVE9OX0ZSQU1FXG5cblx0XHRAZGVidWdNb2RlID0gaWYgQG9wdGlvbnMuZGVidWdNb2RlPyB0aGVuIEBvcHRpb25zLmRlYnVnTW9kZSBlbHNlIERFQlVHX01PREVcblx0XHRcblx0XHRALm9uIFwiY2hhbmdlOnN1YkxheWVyc1wiLCAoY2hhbmdlTGlzdCkgLT5cblx0XHRcdEBhZGRWaWV3IHN1YkxheWVyLCB0cnVlIGZvciBzdWJMYXllciBpbiBjaGFuZ2VMaXN0LmFkZGVkXG5cblx0YWRkVmlldzogKHZpZXcsIHZpYUludGVybmFsQ2hhbmdlRXZlbnQpIC0+XG5cdFx0XG5cdFx0dm5jV2lkdGggID0gQG9wdGlvbnMud2lkdGhcblx0XHR2bmNIZWlnaHQgPSBAb3B0aW9ucy5oZWlnaHRcblxuXHRcdHZpZXcuc3RhdGVzLmFkZChcblx0XHRcdFwiI3sgUFVTSC5VUCB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogLXZuY0hlaWdodFxuXHRcdFx0XCIjeyBQVVNILkxFRlQgfVwiOlxuXHRcdFx0XHR4OiAtdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkNFTlRFUiB9XCI6XG5cdFx0XHRcdHg6IDBcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILlJJR0hUIH1cIjpcblx0XHRcdFx0eDogdm5jV2lkdGhcblx0XHRcdFx0eTogMFxuXHRcdFx0XCIjeyBQVVNILkRPV04gfVwiOlxuXHRcdFx0XHR4OiAwXG5cdFx0XHRcdHk6IHZuY0hlaWdodFxuXHRcdClcblxuXHRcdFx0XG5cdFx0dmlldy5zdGF0ZXMuYW5pbWF0aW9uT3B0aW9ucyA9IEBhbmltYXRpb25PcHRpb25zXG5cdFx0XG5cdFx0aWYgdmlldy5uYW1lIGlzIEBpbml0aWFsVmlld05hbWVcblx0XHRcdEBpbml0aWFsVmlldyA9IHZpZXdcblx0XHRcdEBjdXJyZW50VmlldyA9IHZpZXdcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5DRU5URVJcblx0XHRcdEBoaXN0b3J5LnB1c2ggdmlld1xuXHRcdGVsc2Vcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgUFVTSC5SSUdIVFxuXHRcdFxuXHRcdHVubGVzcyB2aWV3LnN1cGVyTGF5ZXIgaXMgQCBvciB2aWFJbnRlcm5hbENoYW5nZUV2ZW50XG5cdFx0XHR2aWV3LnN1cGVyTGF5ZXIgPSBAXG5cdFx0XHRcblx0XHRAX2FwcGx5QmFja0J1dHRvbiB2aWV3IHVubGVzcyB2aWV3Lm5hbWUgaXMgQGluaXRpYWxWaWV3TmFtZVxuXHRcdFx0XG5cdFx0QHZpZXdzLnB1c2ggdmlld1xuXG5cdHRyYW5zaXRpb246ICh2aWV3LCBkaXJlY3Rpb24gPSBESVIuUklHSFQsIHN3aXRjaEluc3RhbnQgPSBmYWxzZSwgcHJldmVudEhpc3RvcnkgPSBmYWxzZSkgLT5cblxuXHRcdHJldHVybiBmYWxzZSBpZiB2aWV3IGlzIEBjdXJyZW50Vmlld1xuXHRcdFxuXHRcdCMgU2V0dXAgVmlld3MgZm9yIHRoZSB0cmFuc2l0aW9uXG5cdFx0XG5cdFx0aWYgZGlyZWN0aW9uIGlzIERJUi5SSUdIVFxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCAgUFVTSC5SSUdIVFxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5MRUZUXG5cdFx0ZWxzZSBpZiBkaXJlY3Rpb24gaXMgRElSLkRPV05cblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guRE9XTlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2ggUFVTSC5VUFxuXHRcdGVsc2UgaWYgZGlyZWN0aW9uIGlzIERJUi5MRUZUXG5cdFx0XHR2aWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50ICBQVVNILkxFRlRcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guUklHSFRcblx0XHRlbHNlIGlmIGRpcmVjdGlvbiBpcyBESVIuVVBcblx0XHRcdHZpZXcuc3RhdGVzLnN3aXRjaEluc3RhbnQgIFBVU0guVVBcblx0XHRcdEBjdXJyZW50Vmlldy5zdGF0ZXMuc3dpdGNoIFBVU0guRE9XTlxuXHRcdGVsc2Vcblx0XHRcdCMgSWYgdGhleSBzcGVjaWZpZWQgc29tZXRoaW5nIGRpZmZlcmVudCBqdXN0IHN3aXRjaCBpbW1lZGlhdGVseVxuXHRcdFx0dmlldy5zdGF0ZXMuc3dpdGNoSW5zdGFudCBQVVNILkNFTlRFUlxuXHRcdFx0QGN1cnJlbnRWaWV3LnN0YXRlcy5zd2l0Y2hJbnN0YW50IFBVU0guTEVGVFxuXHRcdFxuXHRcdCMgUHVzaCB2aWV3IHRvIENlbnRlclxuXHRcdHZpZXcuc3RhdGVzLnN3aXRjaCBQVVNILkNFTlRFUlxuXHRcdCMgY3VycmVudFZpZXcgaXMgbm93IG91ciBwcmV2aW91c1ZpZXdcblx0XHRAcHJldmlvdXNWaWV3ID0gQGN1cnJlbnRWaWV3XG5cdFx0IyBTZXQgb3VyIGN1cnJlbnRWaWV3IHRvIHRoZSB2aWV3IHdlJ3JlIGJyaW5naW5nIGluXG5cdFx0QGN1cnJlbnRWaWV3ID0gdmlld1xuXG5cdFx0IyBTdG9yZSB0aGUgbGFzdCB2aWV3IGluIGhpc3Rvcnlcblx0XHRAaGlzdG9yeS5wdXNoIEBwcmV2aW91c1ZpZXcgaWYgcHJldmVudEhpc3RvcnkgaXMgZmFsc2Vcblx0XHRcblx0XHRAZW1pdCBFdmVudHMuQ2hhbmdlXG5cblx0cmVtb3ZlQmFja0J1dHRvbjogKHZpZXcpIC0+XG5cdFx0VXRpbHMuZGVsYXkgMCwgPT5cblx0XHRcdHZpZXcuc3ViTGF5ZXJzQnlOYW1lKEJBQ0tCVVRUT05fVklFV19OQU1FKVswXS52aXNpYmxlID0gZmFsc2VcblxuXHRiYWNrOiAoKSAtPlxuXHRcdEB0cmFuc2l0aW9uKEBfZ2V0TGFzdEhpc3RvcnlJdGVtKCksIGRpcmVjdGlvbiA9IERJUi5MRUZULCBzd2l0Y2hJbnN0YW50ID0gZmFsc2UsIHByZXZlbnRIaXN0b3J5ID0gdHJ1ZSlcblx0XHRAaGlzdG9yeS5wb3AoKVxuXG5cdF9nZXRMYXN0SGlzdG9yeUl0ZW06ICgpIC0+XG5cdFx0cmV0dXJuIEBoaXN0b3J5W0BoaXN0b3J5Lmxlbmd0aCAtIDFdXG5cblx0X2FwcGx5QmFja0J1dHRvbjogKHZpZXcsIGZyYW1lID0gQGJhY2tCdXR0b25GcmFtZSkgLT5cblx0XHRVdGlscy5kZWxheSAwLCA9PlxuXHRcdFx0aWYgdmlldy5iYWNrQnV0dG9uIGlzbnQgZmFsc2Vcblx0XHRcdFx0YmFja0J1dHRvbiA9IG5ldyBMYXllclxuXHRcdFx0XHRcdG5hbWU6IEJBQ0tCVVRUT05fVklFV19OQU1FXG5cdFx0XHRcdFx0d2lkdGg6IDgwXG5cdFx0XHRcdFx0aGVpZ2h0OiA4MFxuXHRcdFx0XHRcdHN1cGVyTGF5ZXI6IHZpZXdcblxuXHRcdFx0XHRpZiBAZGVidWdNb2RlIGlzIGZhbHNlXG5cdFx0XHRcdFx0YmFja0J1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgPSBcInRyYW5zcGFyZW50XCJcblxuXHRcdFx0XHRiYWNrQnV0dG9uLmZyYW1lID0gZnJhbWVcblxuXHRcdFx0XHRiYWNrQnV0dG9uLm9uIEV2ZW50cy5DbGljaywgPT5cblx0XHRcdFx0XHRAYmFjaygpXG5cdFx0XG4gICAgXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIFVTQUdFIEVYQU1QTEUgMSAtIERlZmluZSBJbml0aWFsVmlld05hbWUgIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuXG4jIGluaXRpYWxWaWV3S2V5ID0gXCJ2aWV3MVwiXG4jIFxuIyB2bmMgPSBuZXcgVmlld05hdmlnYXRpb25Db250cm9sbGVyIGluaXRpYWxWaWV3TmFtZTogaW5pdGlhbFZpZXdLZXlcbiMgdmlldzEgPSBuZXcgTGF5ZXJcbiMgXHRuYW1lOiBpbml0aWFsVmlld0tleVxuIyBcdHdpZHRoOiAgU2NyZWVuLndpZHRoXG4jIFx0aGVpZ2h0OiBTY3JlZW4uaGVpZ2h0XG4jIFx0YmFja2dyb3VuZENvbG9yOiBcInJlZFwiXG4jIFx0c3VwZXJMYXllcjogdm5jXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG4jIFVTQUdFIEVYQU1QTEUgMiAtIFVzZSBkZWZhdWx0IGluaXRpYWxWaWV3TmFtZSBcImluaXRpYWxWaWV3XCIgIyMjIyMjIyMjIyMjIyMjIyMjXG5cbiMgdm5jID0gbmV3IFZpZXdOYXZpZ2F0aW9uQ29udHJvbGxlclxuXG4jIHZpZXcxID0gbmV3IExheWVyXG4jIFx0bmFtZTogXCJpbml0aWFsVmlld1wiXG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwicmVkXCJcbiMgXHRzdXBlckxheWVyOiB2bmNcblx0XG4jIHZpZXcyID0gbmV3IExheWVyXG4jIFx0d2lkdGg6ICBTY3JlZW4ud2lkdGhcbiMgXHRoZWlnaHQ6IFNjcmVlbi5oZWlnaHRcbiMgXHRiYWNrZ3JvdW5kQ29sb3I6IFwiZ3JlZW5cIlxuIyBcdHN1cGVyTGF5ZXI6IHZuY1xuXG4jIHZpZXcxLm9uIEV2ZW50cy5DbGljaywgLT4gdm5jLnRyYW5zaXRpb24gdmlldzJcbiMgdmlldzIub24gRXZlbnRzLkNsaWNrLCAtPiB2bmMuYmFjaygpXG5cdCIsIiMjI1xuIHwgSGlnaGxpZ2h0ciB2MS4wLjAgLSAyMDE1LTA5LTAyIFxuIHwgQSBjdXN0b20gRnJhbWVyLmpzIG1vZHVsZSB0aGF0IHNob3dzIGhvdHNwb3RzIG92ZXIgY2xpY2thYmxlIExheWVycyBpbiB5b3VyIHByb3RvdHlwZVxuIHwgaHR0cHM6Ly9naXRodWIuY29tL2pvbmFodnN3ZWIvRnJhbWVyLUhpZ2hsaWdodHJcbiB8IFxuIHwgQ29weXJpZ2h0IChjKSAyMDE1IEpvbmFoIEJpdGF1dGFzIDxqb25haHZzd2ViQGdtYWlsLmNvbT4gXG4gfCBcbiB8IFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBcbiMjI1xuY2xhc3Mgd2luZG93LkxheWVyIGV4dGVuZHMgTGF5ZXJcblxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnM9e30pIC0+XG5cdFx0b3B0aW9ucy5oaWdobGlnaHQgPz0gZmFsc2Vcblx0XHRzdXBlciBvcHRpb25zXG5cblx0XHRpZiBvcHRpb25zLmhpZ2hsaWdodFxuXHRcdFx0QF9kaXNwYXRjaCgpXG5cblx0YWRkTGlzdGVuZXI6IChldmVudE5hbWVzLi4uLCBvcmlnaW5hbExpc3RlbmVyKSA9PlxuXHRcdHN1cGVyXG5cdFx0QF9lbGVtZW50LmNsYXNzTGlzdC5hZGQgJ3BpdGNocidcblxuXHRfZGlzcGF0Y2g6IC0+XG5cdFx0dGhpcy5hZGRMaXN0ZW5lciBleHBvcnRzLmNsaWNrVGFwLCAoZSkgLT5cblx0XHRcdGV2dCA9IG5ldyBDdXN0b21FdmVudCAncGl0Y2hyJywgXG5cdFx0XHRcdGRldGFpbDogXG5cdFx0XHRcdFx0bWVzc2FnZTogXG5cdFx0XHRcdFx0XHR0YXJnOiBlLmN1cnJlbnRUYXJnZXRcblx0XHRcdFx0XHRcdHg6IHRoaXMueFxuXHRcdFx0XHRcdFx0eTogdGhpcy55XG5cdFx0XHRcdFx0XHR3aWR0aDogdGhpcy53aWR0aFxuXHRcdFx0XHRcdFx0aGVpZ2h0OiB0aGlzLmhlaWdodFxuXHRcdFx0XHRidWJibGVzOiB0cnVlXG5cdFx0XHRcdGNhbmNlbGFibGU6IHRydWVcblxuXHRcdFx0ZS5jdXJyZW50VGFyZ2V0LmRpc3BhdGNoRXZlbnQgZXZ0XG5cbmV4cG9ydHMuY2xpY2tUYXAgPSBpZiAnb250b3VjaHN0YXJ0JyBvZiB3aW5kb3cgdGhlbiAndG91Y2hzdGFydCcgZWxzZSAnY2xpY2snXG5leHBvcnRzLmtpbGxBbGxIaWdobGlnaHRzID0gZmFsc2VcblxuZXhwb3J0cy5oaWdobGlnaHRyID0gLT5cblx0aGFzUGl0Y2hyID0gZmFsc2Vcblx0cGl0Y2hycyA9IFtdXG5cblx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIgJ3BpdGNocicsIChlKSAtPlxuXHRcdGlmICFleHBvcnRzLmtpbGxBbGxIaWdobGlnaHRzIFxuXHRcdFx0bGF5ZXJMaXN0ID0gd2luZG93LkZyYW1lci5DdXJyZW50Q29udGV4dC5nZXRMYXllcnMoKVxuXHRcdFx0cGl0Y2hycyA9IFtdXG5cblx0XHRcdGZvciBsYXllciBpbiBsYXllckxpc3Rcblx0XHRcdFx0aWYgbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zICdwaXRjaHInXG5cdFx0XHRcdFx0cGl0Y2hycy5wdXNoIGxheWVyXG5cdFx0XHRcdFx0aGFzUGl0Y2hyID0gdHJ1ZVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyIGV4cG9ydHMuY2xpY2tUYXAsIChlKSAtPlxuXHRcdGlmICFleHBvcnRzLmtpbGxBbGxIaWdobGlnaHRzIFxuXHRcdFx0aWYgcGl0Y2hycy5sZW5ndGggPD0gMFxuXHRcdFx0XHRsYXllckxpc3QgPSB3aW5kb3cuRnJhbWVyLkN1cnJlbnRDb250ZXh0LmdldExheWVycygpXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGxheWVyTGlzdCA9IHBpdGNocnNcblxuXHRcdFx0Zm9yIGxheWVyLCBpIGluIGxheWVyTGlzdFxuXHRcdFx0XHRpZiBsYXllci5jbGFzc0xpc3QuY29udGFpbnMgJ3BpdGNocidcblx0XHRcdFx0XHRpZiBoYXNQaXRjaHJcblx0XHRcdFx0XHRcdGlmIGkgPT0gbGF5ZXJMaXN0Lmxlbmd0aCAtIDFcblx0XHRcdFx0XHRcdFx0aGFzUGl0Y2hyID0gZmFsc2Vcblx0XHRcdFx0XHRlbHNlIFxuXHRcdFx0XHRcdFx0aG90U3BvdCA9IG5ldyBMYXllciBcblx0XHRcdFx0XHRcdFx0bmFtZTogJ2hvdFNwb3QnICsgaVxuXHRcdFx0XHRcdFx0XHRzdXBlckxheWVyOiBsYXllci5zdXBlckxheWVyXG5cdFx0XHRcdFx0XHRcdHg6IGxheWVyLnggLSAxMFxuXHRcdFx0XHRcdFx0XHR5OiBsYXllci55IC0gMTBcblx0XHRcdFx0XHRcdFx0d2lkdGg6IGxheWVyLndpZHRoICsgMjBcblx0XHRcdFx0XHRcdFx0aGVpZ2h0OiBsYXllci5oZWlnaHQgKyAyMFxuXHRcdFx0XHRcdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDEwMCwgMjQwLCAyNDQsIDAuNSknXG5cblx0XHRcdFx0XHRcdGhvdFNwb3QuYW5pbWF0ZSBcblx0XHRcdFx0XHRcdFx0cHJvcGVydGllczpcblx0XHRcdFx0XHRcdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHRcdFx0XHRcdHRpbWU6IDAuNFxuXHRcdFx0XHRcdFx0XHRjdXJ2ZTogJ2Vhc2UtaW4tb3V0J1xuXHRcdFx0XHRcdFx0XHRkZWxheTogMC4yXG5cblx0XHRcdFx0XHRcdGhvdFNwb3Qub24gRXZlbnRzLkFuaW1hdGlvblN0b3AsIC0+IFxuXHRcdFx0XHRcdFx0XHR0aGlzLmRlc3Ryb3koKVxuXG5leHBvcnRzLmhpZ2hsaWdodHIoKVxuXG4iLCIjIEFkZCB0aGUgZm9sbG93aW5nIGxpbmUgdG8geW91ciBwcm9qZWN0IGluIEZyYW1lciBTdHVkaW8uIFxuIyBteU1vZHVsZSA9IHJlcXVpcmUgXCJteU1vZHVsZVwiXG4jIFJlZmVyZW5jZSB0aGUgY29udGVudHMgYnkgbmFtZSwgbGlrZSBteU1vZHVsZS5teUZ1bmN0aW9uKCkgb3IgbXlNb2R1bGUubXlWYXJcblxuZXhwb3J0cy5teVZhciA9IFwibXlWYXJpYWJsZVwiXG5cbmV4cG9ydHMubXlGdW5jdGlvbiA9IC0+XG5cdHByaW50IFwibXlGdW5jdGlvbiBpcyBydW5uaW5nXCJcblxuZXhwb3J0cy5teUFycmF5ID0gWzEsIDIsIDNdIl19
