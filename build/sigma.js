(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sigma"] = factory();
	else
		root["Sigma"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiGraph = exports.Sigma = exports.MouseCaptor = exports.QuadTree = exports.Camera = void 0;
/**
 * Sigma.js Library Endpoint
 * ==========================
 *
 * The library endpoint.
 * @module
 */
var camera_1 = __importDefault(__webpack_require__(1));
exports.Camera = camera_1.default;
var quadtree_1 = __importDefault(__webpack_require__(8));
exports.QuadTree = quadtree_1.default;
var mouse_1 = __importDefault(__webpack_require__(10));
exports.MouseCaptor = mouse_1.default;
var sigma_1 = __importDefault(__webpack_require__(12));
exports.Sigma = sigma_1.default;
var graphology_1 = __webpack_require__(42);
Object.defineProperty(exports, "MultiGraph", ({ enumerable: true, get: function () { return graphology_1.MultiGraph; } }));


/***/ }),
/* 1 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
var events_1 = __webpack_require__(2);
var animate_1 = __webpack_require__(3);
var easings_1 = __importDefault(__webpack_require__(7));
var utils_1 = __webpack_require__(4);
/**
 * Defaults.
 */
var DEFAULT_ZOOMING_RATIO = 1.5;
// TODO: animate options = number polymorphism?
// TODO: pan, zoom, unzoom, reset, rotate, zoomTo
// TODO: add width / height to camera and add #.resize
// TODO: bind camera to renderer rather than sigma
// TODO: add #.graphToDisplay, #.displayToGraph, batch methods later
/**
 * Camera class
 *
 * @constructor
 */
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.x = 0.5;
        _this.y = 0.5;
        _this.angle = 0;
        _this.ratio = 1;
        _this.nextFrame = null;
        _this.enabled = true;
        // State
        _this.previousState = _this.getState();
        return _this;
    }
    /**
     * Static method used to create a Camera object with a given state.
     *
     * @param state
     * @return {Camera}
     */
    Camera.from = function (state) {
        var camera = new Camera();
        return camera.setState(state);
    };
    /**
     * Method used to enable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.enable = function () {
        this.enabled = true;
        return this;
    };
    /**
     * Method used to disable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.disable = function () {
        this.enabled = false;
        return this;
    };
    /**
     * Method used to retrieve the camera's current state.
     *
     * @return {object}
     */
    Camera.prototype.getState = function () {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            ratio: this.ratio,
        };
    };
    /**
     * Method used to retrieve the camera's previous state.
     *
     * @return {object}
     */
    Camera.prototype.getPreviousState = function () {
        var state = this.previousState;
        return {
            x: state.x,
            y: state.y,
            angle: state.angle,
            ratio: state.ratio,
        };
    };
    /**
     * Method used to check whether the camera is currently being animated.
     *
     * @return {boolean}
     */
    Camera.prototype.isAnimated = function () {
        return !!this.nextFrame;
    };
    /**
     * Method returning the coordinates of a point from the framed graph system to the
     * viewport system.
     * 方法将点的坐标从框架图形系统返回到视口系统
     *
     * @param  {object} dimensions  - Dimensions of the viewport.
     * @param  {object} coordinates - Coordinates of the point.
     * @return {object}             - The point coordinates in the viewport.
     */
    Camera.prototype.framedGraphToViewport = function (dimensions, coordinates) {
        var smallestDimension = Math.min(dimensions.width, dimensions.height);
        var dx = smallestDimension / dimensions.width;
        var dy = smallestDimension / dimensions.height;
        var ratio = this.ratio / smallestDimension;
        // Align with center of the graph:
        var x1 = (coordinates.x - this.x) / ratio;
        var y1 = (this.y - coordinates.y) / ratio;
        // Rotate:
        var x2 = x1 * Math.cos(this.angle) - y1 * Math.sin(this.angle);
        var y2 = y1 * Math.cos(this.angle) + x1 * Math.sin(this.angle);
        return {
            // Translate to center of screen
            x: x2 + smallestDimension / 2 / dx,
            y: y2 + smallestDimension / 2 / dy,
        };
    };
    /**
     * Method returning the coordinates of a point from the viewport system to the
     * framed graph system.
     *
     * @param  {object} dimensions  - Dimensions of the viewport.
     * @param  {object} coordinates - Coordinates of the point.
     * @return {object}             - The point coordinates in the graph frame.
     */
    Camera.prototype.viewportToFramedGraph = function (dimensions, coordinates) {
        var _a;
        var smallestDimension = Math.min(dimensions.width, dimensions.height);
        var dx = smallestDimension / dimensions.width;
        var dy = smallestDimension / dimensions.height;
        var ratio = this.ratio / smallestDimension;
        // Align with center of the graph:
        var x = coordinates.x - smallestDimension / 2 / dx;
        var y = coordinates.y - smallestDimension / 2 / dy;
        // Rotate:
        _a = __read([
            x * Math.cos(-this.angle) - y * Math.sin(-this.angle),
            y * Math.cos(-this.angle) + x * Math.sin(-this.angle),
        ], 2), x = _a[0], y = _a[1];
        return {
            x: x * ratio + this.x,
            y: -y * ratio + this.y,
        };
    };
    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     * 方法根据相机的状态返回包含图形的抽象矩形。
     *
     * @return {object} - The view's rectangle.
     */
    Camera.prototype.viewRectangle = function (dimensions) {
        // TODO: reduce relative margin?
        var marginX = (0 * dimensions.width) / 8, marginY = (0 * dimensions.height) / 8;
        var p1 = this.viewportToFramedGraph(dimensions, { x: 0 - marginX, y: 0 - marginY }), p2 = this.viewportToFramedGraph(dimensions, { x: dimensions.width + marginX, y: 0 - marginY }), h = this.viewportToFramedGraph(dimensions, { x: 0, y: dimensions.height + marginY });
        return {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            height: p2.y - h.y,
        };
    };
    /**
     * Method used to set the camera's state.
     *
     * @param  {object} state - New state.
     * @return {Camera}
     */
    Camera.prototype.setState = function (state) {
        if (!this.enabled)
            return this;
        // TODO: validations
        // TODO: update by function
        // Keeping track of last state
        this.previousState = this.getState();
        if (state.x)
            this.x = state.x;
        if (state.y)
            this.y = state.y;
        if (state.angle)
            this.angle = state.angle;
        if (state.ratio)
            this.ratio = state.ratio;
        // Emitting
        // TODO: don't emit if nothing changed?
        this.emit("updated", this.getState());
        return this;
    };
    /**
     * Method used to (un)zoom, while preserving the position of a viewport point.
     * Used for instance to
     *
     * @param viewportTarget
     * @param dimensions
     * @param ratio
     * @return {CameraState}
     */
    Camera.prototype.getViewportZoomedState = function (viewportTarget, dimensions, ratio) {
        // TODO: handle max zoom
        var ratioDiff = ratio / this.ratio;
        var center = {
            x: dimensions.width / 2,
            y: dimensions.height / 2,
        };
        var graphMousePosition = this.viewportToFramedGraph(dimensions, viewportTarget);
        var graphCenterPosition = this.viewportToFramedGraph(dimensions, center);
        return __assign(__assign({}, this.getState()), { x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + this.x, y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + this.y, ratio: ratio });
    };
    /**
     * Method used to animate the camera.
     *
     * @param  {object}                    state      - State to reach eventually.
     * @param  {object}                    opts       - Options:
     * @param  {number}                      duration - Duration of the animation.
     * @param  {string | number => number}   easing   - Easing function or name of an existing one
     * @param  {function}                  callback   - Callback
     */
    Camera.prototype.animate = function (state, opts, callback) {
        var _this = this;
        if (!this.enabled)
            return;
        var options = Object.assign({}, animate_1.ANIMATE_DEFAULTS, opts);
        var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
        // State
        var start = Date.now(), initialState = this.getState();
        // Function performing the animation
        var fn = function () {
            var t = (Date.now() - start) / options.duration;
            // The animation is over:
            if (t >= 1) {
                _this.nextFrame = null;
                _this.setState(state);
                if (_this.animationCallback) {
                    _this.animationCallback.call(null);
                    _this.animationCallback = undefined;
                }
                return;
            }
            var coefficient = easing(t);
            var newState = {};
            if (state.x)
                newState.x = initialState.x + (state.x - initialState.x) * coefficient;
            if (state.y)
                newState.y = initialState.y + (state.y - initialState.y) * coefficient;
            if (state.angle)
                newState.angle = initialState.angle + (state.angle - initialState.angle) * coefficient;
            if (state.ratio)
                newState.ratio = initialState.ratio + (state.ratio - initialState.ratio) * coefficient;
            _this.setState(newState);
            _this.nextFrame = utils_1.requestFrame(fn);
        };
        if (this.nextFrame) {
            utils_1.cancelFrame(this.nextFrame);
            if (this.animationCallback)
                this.animationCallback.call(null);
            this.nextFrame = utils_1.requestFrame(fn);
        }
        else {
            fn();
        }
        this.animationCallback = callback;
    };
    /**
     * Method used to zoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */
    Camera.prototype.animatedZoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio / factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to unzoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     */
    Camera.prototype.animatedUnzoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio * factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to reset the camera.
     *
     * @param  {object} options - Options.
     */
    Camera.prototype.animatedReset = function (options) {
        this.animate({
            x: 0.5,
            y: 0.5,
            ratio: 1,
            angle: 0,
        }, options);
    };
    /**
     * Returns a new Camera instance, with the same state as the current camera.
     *
     * @return {Camera}
     */
    Camera.prototype.copy = function () {
        return Camera.from(this.getState());
    };
    return Camera;
}(events_1.EventEmitter));
exports.default = Camera;


/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),
/* 3 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.animateNodes = exports.ANIMATE_DEFAULTS = void 0;
var index_1 = __webpack_require__(4);
var easings_1 = __importDefault(__webpack_require__(7));
exports.ANIMATE_DEFAULTS = {
    easing: "quadraticInOut",
    duration: 150,
};
/**
 * Function used to animate the nodes.
 */
function animateNodes(graph, targets, opts, callback) {
    var options = Object.assign({}, exports.ANIMATE_DEFAULTS, opts);
    var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
    var start = Date.now();
    var startPositions = {};
    for (var node in targets) {
        var attrs = targets[node];
        startPositions[node] = {};
        for (var k in attrs)
            startPositions[node][k] = graph.getNodeAttribute(node, k);
    }
    var frame = null;
    var step = function () {
        var p = (Date.now() - start) / options.duration;
        if (p >= 1) {
            // Animation is done
            for (var node in targets) {
                var attrs = targets[node];
                for (var k in attrs)
                    graph.setNodeAttribute(node, k, attrs[k]);
            }
            if (typeof callback === "function")
                callback();
            return;
        }
        p = easing(p);
        for (var node in targets) {
            var attrs = targets[node];
            var s = startPositions[node];
            for (var k in attrs)
                graph.setNodeAttribute(node, k, attrs[k] * p + s[k] * (1 - p));
        }
        frame = index_1.requestFrame(step);
    };
    step();
    return function () {
        if (frame)
            index_1.cancelFrame(frame);
    };
}
exports.animateNodes = animateNodes;


/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateGraph = exports.canUse32BitsIndices = exports.extractPixel = exports.matrixFromCamera = exports.floatColor = exports.zIndexOrdering = exports.createNormalizationFunction = exports.getPixelRatio = exports.createElement = exports.cancelFrame = exports.requestFrame = exports.assignDeep = exports.isPlainObject = void 0;
var is_graph_1 = __importDefault(__webpack_require__(5));
var matrices_1 = __webpack_require__(6);
/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isPlainObject(value) {
    return typeof value === "object" && value !== null && value.constructor === Object;
}
exports.isPlainObject = isPlainObject;
/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignDeep(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        for (var k in o) {
            if (isPlainObject(o[k])) {
                target[k] = assignDeep(target[k], o[k]);
            }
            else {
                target[k] = o[k];
            }
        }
    }
    return target;
}
exports.assignDeep = assignDeep;
/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
exports.requestFrame = typeof requestAnimationFrame !== "undefined"
    ? function (callback) { return requestAnimationFrame(callback); }
    : function (callback) { return setTimeout(callback, 0); };
exports.cancelFrame = typeof cancelAnimationFrame !== "undefined"
    ? function (requestID) { return cancelAnimationFrame(requestID); }
    : function (requestID) { return clearTimeout(requestID); };
/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
function createElement(tag, style, attributes) {
    var element = document.createElement(tag);
    if (style) {
        for (var k in style) {
            element.style[k] = style[k];
        }
    }
    if (attributes) {
        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }
    }
    return element;
}
exports.createElement = createElement;
/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
function getPixelRatio() {
    if (typeof window.devicePixelRatio !== "undefined")
        return window.devicePixelRatio;
    return 1;
}
exports.getPixelRatio = getPixelRatio;
function createNormalizationFunction(extent) {
    var _a = __read(extent.x, 2), minX = _a[0], maxX = _a[1], _b = __read(extent.y, 2), minY = _b[0], maxY = _b[1];
    var ratio = Math.max(maxX - minX, maxY - minY);
    if (ratio === 0)
        ratio = 1;
    var dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
    var fn = function (data) {
        return {
            x: 0.5 + (data.x - dX) / ratio,
            y: 0.5 + (data.y - dY) / ratio,
        };
    };
    // TODO: possibility to apply this in batch over array of indices
    fn.applyTo = function (data) {
        data.x = 0.5 + (data.x - dX) / ratio;
        data.y = 0.5 + (data.y - dY) / ratio;
    };
    fn.inverse = function (data) {
        return {
            x: dX + ratio * (data.x - 0.5),
            y: dY + ratio * (data.y - 0.5),
        };
    };
    fn.ratio = ratio;
    return fn;
}
exports.createNormalizationFunction = createNormalizationFunction;
/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
function zIndexOrdering(extent, getter, elements) {
    // If k is > n, we'll use a standard sort
    return elements.sort(function (a, b) {
        var zA = getter(a) || 0, zB = getter(b) || 0;
        if (zA < zB)
            return -1;
        if (zA > zB)
            return 1;
        return 0;
    });
    // TODO: counting sort optimization
}
exports.zIndexOrdering = zIndexOrdering;
/**
 * WebGL utils
 * ===========
 */
/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
var FLOAT_COLOR_CACHE = {};
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function floatColor(val) {
    // If the color is already computed, we yield it
    if (typeof FLOAT_COLOR_CACHE[val] !== "undefined")
        return FLOAT_COLOR_CACHE[val];
    var r = 0, g = 0, b = 0, a = 1;
    // Handling hexadecimal notation
    if (val[0] === "#") {
        if (val.length === 4) {
            r = parseInt(val.charAt(1) + val.charAt(1), 16);
            g = parseInt(val.charAt(2) + val.charAt(2), 16);
            b = parseInt(val.charAt(3) + val.charAt(3), 16);
        }
        else {
            r = parseInt(val.charAt(1) + val.charAt(2), 16);
            g = parseInt(val.charAt(3) + val.charAt(4), 16);
            b = parseInt(val.charAt(5) + val.charAt(6), 16);
        }
    }
    // Handling rgb notation
    else if (RGBA_TEST_REGEX.test(val)) {
        var match = val.match(RGBA_EXTRACT_REGEX);
        if (match) {
            r = +match[1];
            g = +match[2];
            b = +match[3];
            if (match[4])
                a = +match[4];
        }
    }
    a = (a * 255) | 0;
    INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;
    var color = FLOAT32[0];
    FLOAT_COLOR_CACHE[val] = color;
    return color;
}
exports.floatColor = floatColor;
/**
 * Function returning a matrix from the current state of the camera.
 */
// TODO: it's possible to optimize this drastically!
function matrixFromCamera(state, dimensions) {
    var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
    var width = dimensions.width, height = dimensions.height;
    var matrix = matrices_1.identity();
    var smallestDimension = Math.min(width, height);
    var cameraCentering = matrices_1.translate(matrices_1.identity(), -x, -y), cameraScaling = matrices_1.scale(matrices_1.identity(), 1 / ratio), cameraRotation = matrices_1.rotate(matrices_1.identity(), -angle), viewportScaling = matrices_1.scale(matrices_1.identity(), 2 * (smallestDimension / width), 2 * (smallestDimension / height));
    // Logical order is reversed
    matrices_1.multiply(matrix, viewportScaling);
    matrices_1.multiply(matrix, cameraRotation);
    matrices_1.multiply(matrix, cameraScaling);
    matrices_1.multiply(matrix, cameraCentering);
    return matrix;
}
exports.matrixFromCamera = matrixFromCamera;
/**
 * Function extracting the color at the given pixel.
 */
function extractPixel(gl, x, y, array) {
    var data = array || new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return data;
}
exports.extractPixel = extractPixel;
/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
function canUse32BitsIndices(gl) {
    var webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    return webgl2 || !!gl.getExtension("OES_element_index_uint");
}
exports.canUse32BitsIndices = canUse32BitsIndices;
/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
function validateGraph(graph) {
    // check if it's a valid graphology instance
    if (!is_graph_1.default(graph))
        throw new Error("Sigma: invalid graph instance.");
    // check if nodes have x/y attributes
    graph.forEachNode(function (key, attributes) {
        if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
            throw new Error("Sigma: Coordinates of node " + key + " are invalid. A node must have a numeric 'x' and 'y' attribute.");
        }
    });
}
exports.validateGraph = validateGraph;


/***/ }),
/* 5 */
/***/ ((module) => {

/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function' &&
    typeof value.multi === 'boolean'
  );
};


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Sigma.js WebGL Matrices Helpers
 * ================================
 *
 * Matrices-related helper functions used by sigma's WebGL renderer.
 * @module
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.multiply = exports.translate = exports.rotate = exports.scale = exports.identity = void 0;
function identity() {
    return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
exports.identity = identity;
// TODO: optimize
function scale(m, x, y) {
    m[0] = x;
    m[4] = typeof y === "number" ? y : x;
    return m;
}
exports.scale = scale;
function rotate(m, r) {
    var s = Math.sin(r), c = Math.cos(r);
    m[0] = c;
    m[1] = s;
    m[3] = -s;
    m[4] = c;
    return m;
}
exports.rotate = rotate;
function translate(m, x, y) {
    m[6] = x;
    m[7] = y;
    return m;
}
exports.translate = translate;
function multiply(a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2];
    var a10 = a[3], a11 = a[4], a12 = a[5];
    var a20 = a[6], a21 = a[7], a22 = a[8];
    var b00 = b[0], b01 = b[1], b02 = b[2];
    var b10 = b[3], b11 = b[4], b12 = b[5];
    var b20 = b[6], b21 = b[7], b22 = b[8];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return a;
}
exports.multiply = multiply;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cubicInOut = exports.cubicOut = exports.cubicIn = exports.quadraticInOut = exports.quadraticOut = exports.quadraticIn = exports.linear = void 0;
/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 * @module
 */
var linear = function (k) { return k; };
exports.linear = linear;
var quadraticIn = function (k) { return k * k; };
exports.quadraticIn = quadraticIn;
var quadraticOut = function (k) { return k * (2 - k); };
exports.quadraticOut = quadraticOut;
var quadraticInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
};
exports.quadraticInOut = quadraticInOut;
var cubicIn = function (k) { return k * k * k; };
exports.cubicIn = cubicIn;
var cubicOut = function (k) { return --k * k * k + 1; };
exports.cubicOut = cubicOut;
var cubicInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
};
exports.cubicInOut = cubicInOut;
var easings = {
    linear: exports.linear,
    quadraticIn: exports.quadraticIn,
    quadraticOut: exports.quadraticOut,
    quadraticInOut: exports.quadraticInOut,
    cubicIn: exports.cubicIn,
    cubicOut: exports.cubicOut,
    cubicInOut: exports.cubicInOut,
};
exports.default = easings;


/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rectangleCollidesWithQuad = exports.squareCollidesWithQuad = exports.getCircumscribedAlignedRectangle = exports.isRectangleAligned = void 0;
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 * @module
 */
/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
var extend_1 = __importDefault(__webpack_require__(9));
// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.
// TODO: a square can be represented as topleft + width, saying for the quad blocks (reduce mem)
// TODO: jsdoc
// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size
// TODO: filtering unwanted labels beforehand through the filter function
// NOTE: this is basically a MX-CIF Quadtree at this point 
// NOTE: need to explore R-Trees for edges
// NOTE: need to explore 2d segment tree for edges
// NOTE: probably can do faster using spatial hashing
/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
var BLOCKS = 4, MAX_LEVEL = 5;
var X_OFFSET = 0, Y_OFFSET = 1, WIDTH_OFFSET = 2, HEIGHT_OFFSET = 3;
var TOP_LEFT = 1, TOP_RIGHT = 2, BOTTOM_LEFT = 3, BOTTOM_RIGHT = 4;
/**
 * Geometry helpers.
 */
/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {Rectangle} rect
 * @return {boolean}
 */
function isRectangleAligned(rect) {
    return rect.x1 === rect.x2 || rect.y1 === rect.y2;
}
exports.isRectangleAligned = isRectangleAligned;
/**
 * Function returning the smallest rectangle that contains the given rectangle, and that is aligned with the axis.
 *
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function getCircumscribedAlignedRectangle(rect) {
    var width = Math.sqrt(Math.pow(rect.x2 - rect.x1, 2) + Math.pow(rect.y2 - rect.y1, 2));
    var heightVector = {
        x: ((rect.y1 - rect.y2) * rect.height) / width,
        y: ((rect.x2 - rect.x1) * rect.height) / width,
    };
    // Compute all corners:
    var tl = { x: rect.x1, y: rect.y1 };
    var tr = { x: rect.x2, y: rect.y2 };
    var bl = {
        x: rect.x1 + heightVector.x,
        y: rect.y1 + heightVector.y,
    };
    var br = {
        x: rect.x2 + heightVector.x,
        y: rect.y2 + heightVector.y,
    };
    var xL = Math.min(tl.x, tr.x, bl.x, br.x);
    var xR = Math.max(tl.x, tr.x, bl.x, br.x);
    var yT = Math.min(tl.y, tr.y, bl.y, br.y);
    var yB = Math.max(tl.y, tr.y, bl.y, br.y);
    return {
        x1: xL,
        y1: yT,
        x2: xR,
        y2: yT,
        height: yB - yT,
    };
}
exports.getCircumscribedAlignedRectangle = getCircumscribedAlignedRectangle;
/**
 *
 * @param x1
 * @param y1
 * @param w
 * @param qx
 * @param qy
 * @param qw
 * @param qh
 */
function squareCollidesWithQuad(x1, y1, w, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}
exports.squareCollidesWithQuad = squareCollidesWithQuad;
function rectangleCollidesWithQuad(x1, y1, w, h, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}
exports.rectangleCollidesWithQuad = rectangleCollidesWithQuad;
function pointIsInQuad(x, y, qx, qy, qw, qh) {
    var xmp = qx + qw / 2, ymp = qy + qh / 2, top = y < ymp, left = x < xmp;
    return top ? (left ? TOP_LEFT : TOP_RIGHT) : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}
/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {
    // [block, level]
    var stack = [0, 0];
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var x = data[block + X_OFFSET], y = data[block + Y_OFFSET], width = data[block + WIDTH_OFFSET], height = data[block + HEIGHT_OFFSET], hw = width / 2, hh = height / 2;
        data[topLeftBlock + X_OFFSET] = x;
        data[topLeftBlock + Y_OFFSET] = y;
        data[topLeftBlock + WIDTH_OFFSET] = hw;
        data[topLeftBlock + HEIGHT_OFFSET] = hh;
        data[topRightBlock + X_OFFSET] = x + hw;
        data[topRightBlock + Y_OFFSET] = y;
        data[topRightBlock + WIDTH_OFFSET] = hw;
        data[topRightBlock + HEIGHT_OFFSET] = hh;
        data[bottomLeftBlock + X_OFFSET] = x;
        data[bottomLeftBlock + Y_OFFSET] = y + hh;
        data[bottomLeftBlock + WIDTH_OFFSET] = hw;
        data[bottomLeftBlock + HEIGHT_OFFSET] = hh;
        data[bottomRightBlock + X_OFFSET] = x + hw;
        data[bottomRightBlock + Y_OFFSET] = y + hh;
        data[bottomRightBlock + WIDTH_OFFSET] = hw;
        data[bottomRightBlock + HEIGHT_OFFSET] = hh;
        if (level < maxLevel - 1) {
            stack.push(bottomRightBlock, level + 1);
            stack.push(bottomLeftBlock, level + 1);
            stack.push(topRightBlock, level + 1);
            stack.push(topLeftBlock, level + 1);
        }
    }
}
function insertNode(maxLevel, data, containers, key, x, y, size) {
    var x1 = x - size, y1 = y - size, w = size * 2;
    var level = 0, block = 0;
    while (true) {
        // If we reached max level
        if (level >= maxLevel) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = squareCollidesWithQuad(x1, y1, w, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = squareCollidesWithQuad(x1, y1, w, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = squareCollidesWithQuad(x1, y1, w, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = squareCollidesWithQuad(x1, y1, w, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        var collisions = [
            collidingWithTopLeft,
            collidingWithTopRight,
            collidingWithBottomLeft,
            collidingWithBottomRight,
        ].reduce(function (acc, current) {
            if (current)
                return acc + 1;
            else
                return acc;
        }, 0);
        // If we don't have at least a collision, there is an issue
        if (collisions === 0)
            throw new Error("sigma/quadtree.insertNode: no collision (level: " + level + ", key: " + key + ", x: " + x + ", y: " + y + ", size: " + size + ").");
        // If we have 3 collisions, we have a geometry problem obviously
        if (collisions === 3)
            throw new Error("sigma/quadtree.insertNode: 3 impossible collisions (level: " + level + ", key: " + key + ", x: " + x + ", y: " + y + ", size: " + size + ").");
        // If we have more that one collision, we stop here and store the node
        // in the relevant containers
        if (collisions > 1) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        else {
            level++;
        }
        // Else we recurse into the correct quads
        if (collidingWithTopLeft)
            block = topLeftBlock;
        if (collidingWithTopRight)
            block = topRightBlock;
        if (collidingWithBottomLeft)
            block = bottomLeftBlock;
        if (collidingWithBottomRight)
            block = bottomRightBlock;
    }
}
function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {
    // [block, level]
    var stack = [0, 0];
    var collectedNodes = [];
    var container;
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        // Collecting nodes
        container = containers[block];
        if (container)
            extend_1.default(collectedNodes, container);
        // If we reached max level
        if (level >= maxLevel)
            continue;
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = rectangleCollidesWithQuad(x1, y1, w, h, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        if (collidingWithTopLeft)
            stack.push(topLeftBlock, level + 1);
        if (collidingWithTopRight)
            stack.push(topRightBlock, level + 1);
        if (collidingWithBottomLeft)
            stack.push(bottomLeftBlock, level + 1);
        if (collidingWithBottomRight)
            stack.push(bottomRightBlock, level + 1);
    }
    return collectedNodes;
}
/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */
var QuadTree = /** @class */ (function () {
    function QuadTree(params) {
        if (params === void 0) { params = {}; }
        this.containers = {};
        this.cache = null;
        this.lastRectangle = null;
        // Allocating the underlying byte array
        var L = Math.pow(4, MAX_LEVEL);
        this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
        if (params.boundaries)
            this.resize(params.boundaries);
        else
            this.resize({
                x: 0,
                y: 0,
                width: 1,
                height: 1,
            });
    }
    QuadTree.prototype.add = function (key, x, y, size) {
        insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);
        return this;
    };
    QuadTree.prototype.resize = function (boundaries) {
        this.clear();
        // Building the quadrants
        this.data[X_OFFSET] = boundaries.x;
        this.data[Y_OFFSET] = boundaries.y;
        this.data[WIDTH_OFFSET] = boundaries.width;
        this.data[HEIGHT_OFFSET] = boundaries.height;
        buildQuadrants(MAX_LEVEL, this.data);
    };
    QuadTree.prototype.clear = function () {
        this.containers = {};
        return this;
    };
    QuadTree.prototype.point = function (x, y) {
        var nodes = [];
        var block = 0, level = 0;
        do {
            if (this.containers[block])
                nodes.push.apply(nodes, __spreadArray([], __read(this.containers[block])));
            var quad = pointIsInQuad(x, y, this.data[block + X_OFFSET], this.data[block + Y_OFFSET], this.data[block + WIDTH_OFFSET], this.data[block + HEIGHT_OFFSET]);
            block = 4 * block + quad * BLOCKS;
            level++;
        } while (level <= MAX_LEVEL);
        return nodes;
    };
    QuadTree.prototype.rectangle = function (x1, y1, x2, y2, height) {
        var lr = this.lastRectangle;
        if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
            return this.cache;
        }
        this.lastRectangle = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            height: height,
        };
        // If the rectangle is shifted, we use the smallest aligned rectangle that contains the shifted one:
        if (!isRectangleAligned(this.lastRectangle))
            this.lastRectangle = getCircumscribedAlignedRectangle(this.lastRectangle);
        this.cache = getNodesInAxisAlignedRectangleArea(MAX_LEVEL, this.data, this.containers, x1, y1, Math.abs(x1 - x2) || Math.abs(y1 - y2), height);
        return this.cache;
    };
    return QuadTree;
}());
exports.default = QuadTree;


/***/ }),
/* 9 */
/***/ ((module) => {

/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 *
 * Its strategy is to mutate target array's length then setting the new indices
 * to be the values to add.
 *
 * A benchmark proved that it is faster than the following strategies:
 *   1) `array.push.apply(array, values)`.
 *   2) A loop of pushes.
 *   3) `array = array.concat(values)`, obviously.
 *
 * Intuitively, this is correct because when adding a lot of elements, the
 * chosen strategies does not need to handle the `arguments` object to
 * execute #.apply's variadicity and because the array know its final length
 * at the beginning, avoiding potential multiple reallocations of the underlying
 * contiguous array. Some engines may be able to optimize the loop of push
 * operations but empirically they don't seem to do so.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - Values to add.
 */
module.exports = function extend(array, values) {
  var l2 = values.length;

  if (l2 === 0)
    return;

  var l1 = array.length;

  array.length += l2;

  for (var i = 0; i < l2; i++)
    array[l1 + i] = values[i];
};


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(11));
/**
 * Constants.
 */
var DRAG_TIMEOUT = 200;
var DRAGGED_EVENTS_TOLERANCE = 3;
var MOUSE_INERTIA_DURATION = 200;
var MOUSE_INERTIA_RATIO = 3;
var MOUSE_ZOOM_DURATION = 250;
var ZOOMING_RATIO = 1.7;
var DOUBLE_CLICK_TIMEOUT = 300;
var DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
var DOUBLE_CLICK_ZOOMING_DURATION = 200;
/**
 * Mouse captor class.
 *
 * @constructor
 */
var MouseCaptor = /** @class */ (function (_super) {
    __extends(MouseCaptor, _super);
    function MouseCaptor(container, camera) {
        var _this = _super.call(this, container, camera) || this;
        // State
        _this.enabled = true;
        _this.draggedEvents = 0;
        _this.downStartTime = null;
        _this.lastMouseX = null;
        _this.lastMouseY = null;
        _this.isMouseDown = false;
        _this.isMoving = false;
        _this.movingTimeout = null;
        _this.startCameraState = null;
        _this.clicks = 0;
        _this.doubleClickTimeout = null;
        _this.currentWheelDirection = 0;
        // Binding methods
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRightClick = _this.handleRightClick.bind(_this);
        _this.handleDown = _this.handleDown.bind(_this);
        _this.handleUp = _this.handleUp.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        _this.handleWheel = _this.handleWheel.bind(_this);
        _this.handleOut = _this.handleOut.bind(_this);
        // Binding events
        container.addEventListener("click", _this.handleClick, false);
        container.addEventListener("contextmenu", _this.handleRightClick, false);
        container.addEventListener("mousedown", _this.handleDown, false);
        container.addEventListener("mousemove", _this.handleMove, false);
        container.addEventListener("wheel", _this.handleWheel, false);
        container.addEventListener("mouseout", _this.handleOut, false);
        document.addEventListener("mouseup", _this.handleUp, false);
        return _this;
    }
    MouseCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("click", this.handleClick);
        container.removeEventListener("contextmenu", this.handleRightClick);
        container.removeEventListener("mousedown", this.handleDown);
        container.removeEventListener("mousemove", this.handleMove);
        container.removeEventListener("wheel", this.handleWheel);
        container.removeEventListener("mouseout", this.handleOut);
        document.removeEventListener("mouseup", this.handleUp);
    };
    MouseCaptor.prototype.handleClick = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        this.clicks++;
        if (this.clicks === 2) {
            this.clicks = 0;
            if (typeof this.doubleClickTimeout === "number") {
                clearTimeout(this.doubleClickTimeout);
                this.doubleClickTimeout = null;
            }
            return this.handleDoubleClick(e);
        }
        setTimeout(function () {
            _this.clicks = 0;
            _this.doubleClickTimeout = null;
        }, DOUBLE_CLICK_TIMEOUT);
        // NOTE: this is here to prevent click events on drag
        if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE)
            this.emit("click", captor_1.getMouseCoords(e));
    };
    MouseCaptor.prototype.handleRightClick = function (e) {
        if (!this.enabled)
            return;
        this.emit("rightClick", captor_1.getMouseCoords(e));
    };
    MouseCaptor.prototype.handleDoubleClick = function (e) {
        if (!this.enabled)
            return;
        var newRatio = this.camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO;
        this.camera.animate(this.camera.getViewportZoomedState({ x: captor_1.getX(e), y: captor_1.getY(e) }, {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        }, newRatio), {
            easing: "quadraticInOut",
            duration: DOUBLE_CLICK_ZOOMING_DURATION,
        });
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
        e.stopPropagation();
        return false;
    };
    MouseCaptor.prototype.handleDown = function (e) {
        if (!this.enabled)
            return;
        this.startCameraState = this.camera.getState();
        this.lastMouseX = captor_1.getX(e);
        this.lastMouseY = captor_1.getY(e);
        this.draggedEvents = 0;
        this.downStartTime = Date.now();
        // TODO: dispatch events
        switch (e.which) {
            default:
                // Left button pressed
                this.isMouseDown = true;
                this.emit("mousedown", captor_1.getMouseCoords(e));
        }
    };
    MouseCaptor.prototype.handleUp = function (e) {
        var _this = this;
        if (!this.enabled || !this.isMouseDown)
            return;
        this.isMouseDown = false;
        if (typeof this.movingTimeout === "number") {
            clearTimeout(this.movingTimeout);
            this.movingTimeout = null;
        }
        var x = captor_1.getX(e), y = captor_1.getY(e);
        var cameraState = this.camera.getState(), previousCameraState = this.camera.getPreviousState();
        if (this.isMoving) {
            this.camera.animate({
                x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
            }, {
                duration: MOUSE_INERTIA_DURATION,
                easing: "quadraticOut",
            });
        }
        else if (this.lastMouseX !== x || this.lastMouseY !== y) {
            this.camera.setState({
                x: cameraState.x,
                y: cameraState.y,
            });
        }
        this.isMoving = false;
        setTimeout(function () { return (_this.draggedEvents = 0); }, 0);
        this.emit("mouseup", captor_1.getMouseCoords(e));
    };
    MouseCaptor.prototype.handleMove = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        this.emit("mousemove", captor_1.getMouseCoords(e));
        if (this.isMouseDown) {
            // TODO: dispatch events
            this.isMoving = true;
            this.draggedEvents++;
            if (typeof this.movingTimeout === "number") {
                clearTimeout(this.movingTimeout);
            }
            this.movingTimeout = window.setTimeout(function () {
                _this.movingTimeout = null;
                _this.isMoving = false;
            }, DRAG_TIMEOUT);
            var dimensions = {
                width: this.container.offsetWidth,
                height: this.container.offsetHeight,
            };
            var eX = captor_1.getX(e), eY = captor_1.getY(e);
            var lastMouse = this.camera.viewportToFramedGraph(dimensions, {
                x: this.lastMouseX,
                y: this.lastMouseY,
            });
            var mouse = this.camera.viewportToFramedGraph(dimensions, { x: eX, y: eY });
            var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
            var cameraState = this.camera.getState();
            var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
            this.camera.setState({ x: x, y: y });
            this.lastMouseX = eX;
            this.lastMouseY = eY;
        }
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
        e.stopPropagation();
        return false;
    };
    MouseCaptor.prototype.handleWheel = function (e) {
        var _this = this;
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false;
        e.stopPropagation();
        if (!this.enabled)
            return false;
        var delta = captor_1.getWheelDelta(e);
        if (!delta)
            return false;
        var ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
        var newRatio = this.camera.getState().ratio * ratioDiff;
        var wheelDirection = delta > 0 ? 1 : -1;
        var now = Date.now();
        // Cancel events that are too close too each other and in the same direction:
        if (this.currentWheelDirection === wheelDirection &&
            this.lastWheelTriggerTime &&
            now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5) {
            return false;
        }
        this.camera.animate(this.camera.getViewportZoomedState({ x: captor_1.getX(e), y: captor_1.getY(e) }, {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        }, newRatio), {
            easing: "quadraticOut",
            duration: MOUSE_ZOOM_DURATION,
        }, function () {
            _this.currentWheelDirection = 0;
        });
        this.currentWheelDirection = wheelDirection;
        this.lastWheelTriggerTime = now;
        return false;
    };
    MouseCaptor.prototype.handleOut = function () {
        // TODO: dispatch event
    };
    return MouseCaptor;
}(captor_1.default));
exports.default = MouseCaptor;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWheelDelta = exports.getTouchCoords = exports.getTouchesArray = exports.getMouseCoords = exports.getPosition = exports.getY = exports.getX = void 0;
/**
 * Sigma.js Captor Class  事件捕获
 * ======================
 * @module
 */
var events_1 = __webpack_require__(2);
/**
 * Captor utils functions
 * ======================
 */
/**
 * Extract the local X position from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local X value of the mouse.
 */
function getX(e) {
    if (typeof e.offsetX !== "undefined")
        return e.offsetX;
    if (typeof e.clientX !== "undefined")
        return e.clientX;
    throw new Error("Captor: could not extract x from event.");
}
exports.getX = getX;
/**
 * Extract the local Y position from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local Y value of the mouse.
 */
function getY(e) {
    if (typeof e.offsetY !== "undefined")
        return e.offsetY;
    if (typeof e.clientY !== "undefined")
        return e.clientY;
    throw new Error("Captor: could not extract y from event.");
}
exports.getY = getY;
/**
 * Extract the local X and Y coordinates from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The local Y value of the mouse.
 */
function getPosition(e) {
    return {
        x: getX(e),
        y: getY(e),
    };
}
exports.getPosition = getPosition;
/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}   e   - A mouse event or touch object.
 *
 * @return {object}
 */
function getMouseCoords(e) {
    return {
        x: getX(e),
        y: getY(e),
        clientX: e.clientX,
        clientY: e.clientY,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        // TODO: this is not ideal... But I am wondering why we don't just pass the event through
        preventDefault: e.preventDefault.bind(e),
        original: e,
    };
}
exports.getMouseCoords = getMouseCoords;
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
    var arr = [];
    for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++)
        arr.push(touches[i]);
    return arr;
}
exports.getTouchesArray = getTouchesArray;
/**
 * Convert touch coords to sigma coords.
 */
function getTouchCoords(e) {
    return {
        touches: getTouchesArray(e.touches).map(getPosition),
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        // TODO: same as for getMouseCoords
        preventDefault: e.preventDefault.bind(e),
        original: e,
    };
}
exports.getTouchCoords = getTouchCoords;
/**
 * Extract the wheel delta from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The wheel delta of the mouse.
 */
function getWheelDelta(e) {
    // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
    if (typeof e.deltaY !== "undefined")
        return (e.deltaY * -3) / 360;
    if (typeof e.detail !== "undefined")
        return e.detail / -9;
    throw new Error("Captor: could not extract delta from event.");
}
exports.getWheelDelta = getWheelDelta;
/**
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
var Captor = /** @class */ (function (_super) {
    __extends(Captor, _super);
    function Captor(container, camera) {
        var _this = _super.call(this) || this;
        // Properties
        _this.container = container;
        _this.camera = camera;
        return _this;
    }
    return Captor;
}(events_1.EventEmitter));
exports.default = Captor;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js
 * ========
 * @module
 */
var events_1 = __webpack_require__(2);
var extent_1 = __importDefault(__webpack_require__(13));
var camera_1 = __importDefault(__webpack_require__(1));
var mouse_1 = __importDefault(__webpack_require__(10));
var quadtree_1 = __importDefault(__webpack_require__(8));
var utils_1 = __webpack_require__(4);
var labels_1 = __webpack_require__(15);
var settings_1 = __webpack_require__(16);
var touch_1 = __importDefault(__webpack_require__(41));
var nodeExtent = extent_1.default.nodeExtent, edgeExtent = extent_1.default.edgeExtent;
/**
 * Constants.
 */
var PIXEL_RATIO = utils_1.getPixelRatio();
var WEBGL_OVERSAMPLING_RATIO = utils_1.getPixelRatio();
/**
 * Important functions.
 */
function applyNodeDefaults(settings, key, data) {
    if (!data.hasOwnProperty("x") || !data.hasOwnProperty("y"))
        throw new Error("Sigma: could not find a valid position (x, y) for node \"" + key + "\". All your nodes must have a number \"x\" and \"y\". Maybe your forgot to apply a layout or your \"nodeReducer\" is not returning the correct data?");
    if (!data.color)
        data.color = settings.defaultNodeColor;
    if (!data.label)
        data.label = "";
    if (!data.size)
        data.size = 2;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("highlighted"))
        data.highlighted = false;
}
function applyEdgeDefaults(settings, key, data) {
    if (!data.color)
        data.color = settings.defaultEdgeColor;
    if (!data.label)
        data.label = "";
    if (!data.size)
        data.size = 0.5;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
}
/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
var Sigma = /** @class */ (function (_super) {
    __extends(Sigma, _super);
    function Sigma(graph, container, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this) || this;
        _this.elements = {};
        _this.canvasContexts = {};
        _this.webGLContexts = {};
        _this.activeListeners = {};
        _this.quadtree = new quadtree_1.default();
        _this.nodeDataCache = {};
        _this.edgeDataCache = {};
        _this.nodeKeyToIndex = {};
        _this.edgeKeyToIndex = {};
        _this.nodeExtent = null;
        _this.edgeExtent = null;
        _this.normalizationFunction = utils_1.createNormalizationFunction({
            x: [-Infinity, Infinity],
            y: [-Infinity, Infinity],
        });
        // Starting dimensions
        _this.width = 0;
        _this.height = 0;
        // State
        _this.highlightedNodes = new Set();
        _this.displayedLabels = new Set();
        _this.hoveredNode = null;
        _this.renderFrame = null;
        _this.renderHighlightedNodesFrame = null;
        _this.needToProcess = false;
        _this.needToSoftProcess = false;
        // programs
        _this.nodePrograms = {};
        _this.edgePrograms = {};
        _this.settings = utils_1.assignDeep({}, settings_1.DEFAULT_SETTINGS, settings);
        // Validating
        settings_1.validateSettings(_this.settings);
        utils_1.validateGraph(graph);
        if (!(container instanceof HTMLElement))
            throw new Error("Sigma: container should be an html element.");
        // Properties
        _this.graph = graph;
        _this.container = container;
        _this.initializeCache();
        // Initializing contexts
        _this.createWebGLContext("edges");
        _this.createWebGLContext("nodes");
        _this.createCanvasContext("edgeLabels");
        _this.createCanvasContext("labels");
        _this.createCanvasContext("hovers");
        _this.createCanvasContext("mouse");
        // Blending
        var gl = _this.webGLContexts.nodes;
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl = _this.webGLContexts.edges;
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        // Loading programs
        for (var type in _this.settings.nodeProgramClasses) {
            var NodeProgramClass = _this.settings.nodeProgramClasses[type];
            _this.nodePrograms[type] = new NodeProgramClass(_this.webGLContexts.nodes);
        }
        for (var type in _this.settings.edgeProgramClasses) {
            var EdgeProgramClass = _this.settings.edgeProgramClasses[type];
            _this.edgePrograms[type] = new EdgeProgramClass(_this.webGLContexts.edges);
        }
        // Initial resize
        _this.resize();
        // Initializing the camera
        _this.camera = new camera_1.default();
        // Binding camera events
        _this.bindCameraHandlers();
        // Initializing captors
        _this.mouseCaptor = new mouse_1.default(_this.elements.mouse, _this.camera);
        _this.touchCaptor = new touch_1.default(_this.elements.mouse, _this.camera);
        // Binding event handlers
        _this.bindEventHandlers();
        // Binding graph handlers
        _this.bindGraphHandlers();
        // Processing data for the first time & render
        _this.process();
        _this.render();
        return _this;
    }
    /**---------------------------------------------------------------------------
     * Internal methods.
     **---------------------------------------------------------------------------
     */
    /**
     * Internal function used to create a canvas element.
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvas = function (id) {
        var canvas = utils_1.createElement("canvas", {
            position: "absolute",
        }, {
            class: "sigma-" + id,
        });
        this.elements[id] = canvas;
        this.container.appendChild(canvas);
        return canvas;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvasContext = function (id) {
        var canvas = this.createCanvas(id);
        var contextOptions = {
            preserveDrawingBuffer: false,
            antialias: false,
        };
        this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
        return this;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createWebGLContext = function (id) {
        var canvas = this.createCanvas(id);
        var contextOptions = {
            preserveDrawingBuffer: false,
            antialias: false,
        };
        var context;
        // First we try webgl2 for an easy performance boost
        context = canvas.getContext("webgl2", contextOptions);
        // Else we fall back to webgl
        if (!context)
            context = canvas.getContext("webgl", contextOptions);
        // Edge, I am looking right at you...
        if (!context)
            context = canvas.getContext("experimental-webgl", contextOptions);
        this.webGLContexts[id] = context;
        return this;
    };
    /**
     * Method used to initialize display data cache.
     *
     * @return {Sigma}
     */
    Sigma.prototype.initializeCache = function () {
        var _this = this;
        var graph = this.graph;
        // NOTE: the data caches are never reset to avoid paying a GC cost
        // But this could prove to be a bad decision. In which case just "reset"
        // them here.
        var i = 0;
        graph.forEachNode(function (key) {
            _this.nodeKeyToIndex[key] = i++;
            _this.nodeDataCache[key] = {};
        });
        i = 0;
        graph.forEachEdge(function (key) {
            _this.edgeKeyToIndex[key] = i++;
            _this.edgeDataCache[key] = {};
        });
    };
    /**
     * Method binding camera handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindCameraHandlers = function () {
        var _this = this;
        this.activeListeners.camera = function () {
            _this._scheduleRefresh();
        };
        this.camera.on("updated", this.activeListeners.camera);
        return this;
    };
    /**
     * Method binding event handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindEventHandlers = function () {
        var _this = this;
        // Handling window resize
        this.activeListeners.handleResize = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        window.addEventListener("resize", this.activeListeners.handleResize);
        // Function checking if the mouse is on the given node
        var mouseIsOnNode = function (mouseX, mouseY, nodeX, nodeY, size) {
            return (mouseX > nodeX - size &&
                mouseX < nodeX + size &&
                mouseY > nodeY - size &&
                mouseY < nodeY + size &&
                Math.sqrt(Math.pow(mouseX - nodeX, 2) + Math.pow(mouseY - nodeY, 2)) < size);
        };
        // Function returning the nodes in the mouse's quad
        var getQuadNodes = function (mouseX, mouseY) {
            var mouseGraphPosition = _this.camera.viewportToFramedGraph({ width: _this.width, height: _this.height }, { x: mouseX, y: mouseY });
            // TODO: minus 1? lol
            return _this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
        };
        // Handling mouse move
        this.activeListeners.handleMove = function (e) {
            // NOTE: for the canvas renderer, testing the pixel's alpha should
            // give some boost but this slows things down for WebGL empirically.
            // TODO: this should be a method from the camera (or can be passed to graph to display somehow)
            var sizeRatio = Math.pow(_this.camera.getState().ratio, 0.5);
            var quadNodes = getQuadNodes(e.x, e.y);
            var dimensions = { width: _this.width, height: _this.height };
            // We will hover the node whose center is closest to mouse
            var minDistance = Infinity, nodeToHover = null;
            for (var i = 0, l = quadNodes.length; i < l; i++) {
                var node = quadNodes[i];
                var data = _this.nodeDataCache[node];
                var pos = _this.camera.framedGraphToViewport(dimensions, data);
                var size = data.size / sizeRatio;
                if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
                    var distance = Math.sqrt(Math.pow(e.x - pos.x, 2) + Math.pow(e.y - pos.y, 2));
                    // TODO: sort by min size also for cases where center is the same
                    if (distance < minDistance) {
                        minDistance = distance;
                        nodeToHover = node;
                    }
                }
            }
            if (nodeToHover && _this.hoveredNode !== nodeToHover && !_this.nodeDataCache[nodeToHover].hidden) {
                // Handling passing from one node to the other directly
                if (_this.hoveredNode)
                    _this.emit("leaveNode", { node: _this.hoveredNode });
                _this.hoveredNode = nodeToHover;
                _this.emit("enterNode", { node: nodeToHover });
                _this.scheduleHighlightedNodesRender();
                return;
            }
            // Checking if the hovered node is still hovered
            if (_this.hoveredNode) {
                var data = _this.nodeDataCache[_this.hoveredNode];
                var pos = _this.camera.framedGraphToViewport(dimensions, data);
                var size = data.size / sizeRatio;
                if (!mouseIsOnNode(e.x, e.y, pos.x, pos.y, size)) {
                    var node = _this.hoveredNode;
                    _this.hoveredNode = null;
                    _this.emit("leaveNode", { node: node });
                    return _this.scheduleHighlightedNodesRender();
                }
            }
        };
        // Handling click
        var createClickListener = function (eventType) {
            return function (e) {
                var sizeRatio = Math.pow(_this.camera.getState().ratio, 0.5);
                var quadNodes = getQuadNodes(e.x, e.y);
                var dimensions = { width: _this.width, height: _this.height };
                for (var i = 0, l = quadNodes.length; i < l; i++) {
                    var node = quadNodes[i];
                    var data = _this.nodeDataCache[node];
                    var pos = _this.camera.framedGraphToViewport(dimensions, data);
                    var size = data.size / sizeRatio;
                    if (mouseIsOnNode(e.x, e.y, pos.x, pos.y, size))
                        return _this.emit(eventType + "Node", { node: node, captor: e, event: e });
                }
                // 点击边待添加   已知所有顶点 求符合顶点的线段的其中一个顶点  然后按边遍历 遍历所有节点坐标
                return _this.emit(eventType + "Stage", { event: e });
            };
        };
        this.activeListeners.handleClick = createClickListener("click");
        this.activeListeners.handleRightClick = createClickListener("rightClick");
        this.activeListeners.handleDown = createClickListener("down");
        this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
        this.mouseCaptor.on("click", this.activeListeners.handleClick);
        this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
        this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
        // TODO
        // Deal with Touch captor events
        return this;
    };
    /**
     * Method binding graph handlers
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindGraphHandlers = function () {
        var _this = this;
        var graph = this.graph;
        this.activeListeners.graphUpdate = function () {
            _this.needToProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.softGraphUpdate = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.addNodeGraphUpdate = function (e) {
            // Adding entry to cache
            _this.nodeKeyToIndex[e.key] = graph.order - 1;
            _this.nodeDataCache[e.key] = {};
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.addEdgeGraphUpdate = function (e) {
            // Adding entry to cache
            _this.nodeKeyToIndex[e.key] = graph.order - 1;
            _this.edgeDataCache[e.key] = {};
            _this.activeListeners.graphUpdate();
        };
        // TODO: clean cache on drop!
        // TODO: bind this on composed state events
        // TODO: it could be possible to update only specific node etc. by holding
        // a fixed-size pool of updated items
        graph.on("nodeAdded", this.activeListeners.addNodeGraphUpdate);
        graph.on("nodeDropped", this.activeListeners.graphUpdate);
        graph.on("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
        graph.on("edgeDropped", this.activeListeners.graphUpdate);
        graph.on("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgesCleared", this.activeListeners.graphUpdate);
        graph.on("cleared", this.activeListeners.graphUpdate);
        return this;
    };
    /**
     * Method used to process the whole graph's data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.process = function (keepArrays) {
        if (keepArrays === void 0) { keepArrays = false; }
        var graph = this.graph, settings = this.settings;
        // Clearing the quad
        this.quadtree.clear();
        // Clear the highlightedNodes
        this.highlightedNodes = new Set();
        // Computing extents
        var nodeExtentProperties = ["x", "y", "z"];
        if (this.settings.zIndex) {
            nodeExtentProperties.push("z");
            this.edgeExtent = edgeExtent(graph, ["z"]);
        }
        this.nodeExtent = nodeExtent(graph, nodeExtentProperties);
        // Rescaling function
        this.normalizationFunction = utils_1.createNormalizationFunction(this.nodeExtent);
        var nodeProgram = this.nodePrograms[this.settings.defaultNodeType];
        if (!keepArrays)
            nodeProgram.allocate(graph.order);
        var nodes = graph.nodes();
        // Handling node z-index
        // TODO: z-index needs us to compute display data before hand
        if (this.settings.zIndex)
            nodes = utils_1.zIndexOrdering(this.nodeExtent.z, function (node) { return graph.getNodeAttribute(node, "z"); }, nodes);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            // Node display data resolution:
            //   1. First we get the node's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            //   4. We apply the normalization function
            var data = graph.getNodeAttributes(node);
            if (settings.nodeReducer)
                data = settings.nodeReducer(node, data);
            // We shallow copy the data to avoid mutating both the graph and the reducer's result
            data = Object.assign(this.nodeDataCache[node], data);
            applyNodeDefaults(this.settings, node, data);
            this.normalizationFunction.applyTo(data);
            this.quadtree.add(node, data.x, 1 - data.y, data.size / this.width);
            nodeProgram.process(data, data.hidden, i);
            // Save the node in the highlighted set if needed
            if (data.highlighted && !data.hidden)
                this.highlightedNodes.add(node);
            this.nodeKeyToIndex[node] = i;
        }
        // TODO: maybe we should bind and buffer as part of rendering?
        // We also need to find when it is useful and when it's really not
        nodeProgram.bind();
        nodeProgram.bufferData();
        var edgeProgram = this.edgePrograms[this.settings.defaultEdgeType];
        if (!keepArrays)
            edgeProgram.allocate(graph.size);
        var edges = graph.edges();
        // Handling edge z-index
        if (this.settings.zIndex && this.edgeExtent)
            edges = utils_1.zIndexOrdering(this.edgeExtent.z, function (edge) { return graph.getEdgeAttribute(edge, "z"); }, edges);
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            // Edge display data resolution:
            //   1. First we get the edge's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            var data = graph.getEdgeAttributes(edge);
            if (settings.edgeReducer)
                data = settings.edgeReducer(edge, data);
            // We shallow copy the data to avoid mutating both the graph and the reducer's result
            data = Object.assign(this.edgeDataCache[edge], data);
            applyEdgeDefaults(this.settings, edge, data);
            var extremities = graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
            var hidden = data.hidden || sourceData.hidden || targetData.hidden;
            edgeProgram.process(sourceData, targetData, data, hidden, i);
            this.nodeKeyToIndex[edge] = i;
        }
        // Computing edge indices if necessary
        if (!keepArrays && typeof edgeProgram.computeIndices === "function")
            edgeProgram.computeIndices();
        // TODO: maybe we should bind and buffer as part of rendering?
        // We also need to find when it is useful and when it's really not
        edgeProgram.bind();
        edgeProgram.bufferData();
        return this;
    };
    /**
     * Method that decides whether to reprocess graph or not, and then render the
     * graph.
     *
     * @return {Sigma}
     */
    Sigma.prototype._refresh = function () {
        // Do we need to process data?
        if (this.needToProcess) {
            this.process();
        }
        else if (this.needToSoftProcess) {
            this.process(true);
        }
        // Resetting state
        this.needToProcess = false;
        this.needToSoftProcess = false;
        // Rendering
        this.render();
        return this;
    };
    /**
     * Method that schedules a `_refresh` call if none has been scheduled yet. It
     * will then be processed next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype._scheduleRefresh = function () {
        var _this = this;
        if (!this.renderFrame) {
            this.renderFrame = utils_1.requestFrame(function () {
                _this._refresh();
                _this.renderFrame = null;
            });
        }
        return this;
    };
    /**
     * Method used to render labels.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderLabels = function () {
        if (!this.settings.renderLabels)
            return this;
        var cameraState = this.camera.getState();
        var dimensions = { width: this.width, height: this.height };
        // Finding visible nodes to display their labels
        var visibleNodes;
        // console.log(cameraState.ratio)
        // if (cameraState.ratio >= 1) {
        if (cameraState.ratio >= 1) {
            // Camera is unzoomed so no need to ask the quadtree for visible nodes
            visibleNodes = this.graph.nodes();
        }
        else {
            // Let's ask the quadtree
            var viewRectangle = this.camera.viewRectangle(dimensions);
            visibleNodes = this.quadtree.rectangle(viewRectangle.x1, 1 - viewRectangle.y1, viewRectangle.x2, 1 - viewRectangle.y2, viewRectangle.height);
        }
        // Selecting labels to draw
        var gridSettings = this.settings.labelGrid;
        var labelsToDisplay = labels_1.labelsToDisplayFromGrid({
            cache: this.nodeDataCache,
            camera: this.camera,
            cell: gridSettings.cell,
            dimensions: dimensions,
            displayedLabels: this.displayedLabels,
            fontSize: this.settings.labelSize,
            graph: this.graph,
            renderedSizeThreshold: gridSettings.renderedSizeThreshold,
            visibleNodes: visibleNodes,
        });
        // Drawing labels
        var context = this.canvasContexts.labels;
        var sizeRatio = Math.pow(cameraState.ratio, 0.5);
        for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
            var data = this.nodeDataCache[labelsToDisplay[i]];
            var _a = this.camera.framedGraphToViewport(dimensions, data), x = _a.x, y = _a.y;
            // TODO: we can cache the labels we need to render until the camera's ratio changes
            // TODO: this should be computed in the canvas components?
            var size = data.size / sizeRatio;
            // console.log(size)
            // 当视口分辨率很低的时候没必要显示
            if (data.size / sizeRatio > 5) {
                this.settings.labelRenderer(context, {
                    key: labelsToDisplay[i],
                    label: data.label,
                    color: "#000",
                    size: size,
                    sizeRatio: sizeRatio,
                    x: x,
                    y: y,
                    icon: data.icon,
                }, this.settings);
            }
        }
        // Caching visible nodes and displayed labels
        this.displayedLabels = new Set(labelsToDisplay);
        return this;
    };
    /**
     * Method used to render edge labels, based on which node labels were
     * rendered.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderEdgeLabels = function () {
        if (!this.settings.renderEdgeLabels)
            return this;
        var cameraState = this.camera.getState();
        var sizeRatio = Math.pow(cameraState.ratio, 0.5);
        var context = this.canvasContexts.edgeLabels;
        var dimensions = { width: this.width, height: this.height };
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        var edgeLabelsToDisplay = labels_1.edgeLabelsToDisplayFromNodes({
            nodeDataCache: this.nodeDataCache,
            edgeDataCache: this.edgeDataCache,
            graph: this.graph,
            hoveredNode: this.hoveredNode,
            displayedNodeLabels: this.displayedLabels,
            highlightedNodes: this.highlightedNodes,
        });
        for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
            var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edgeLabelsToDisplay[i]];
            var _a = this.camera.framedGraphToViewport(dimensions, sourceData), sourceX = _a.x, sourceY = _a.y;
            var _b = this.camera.framedGraphToViewport(dimensions, targetData), targetX = _b.x, targetY = _b.y;
            // TODO: we can cache the labels we need to render until the camera's ratio changes
            // TODO: this should be computed in the canvas components?
            var size = edgeData.size / sizeRatio;
            this.settings.edgeLabelRenderer(context, {
                key: edge,
                label: edgeData.label,
                color: edgeData.color,
                size: size,
                index: edgeData.index,
            }, {
                key: extremities[0],
                x: sourceX,
                y: sourceY,
            }, {
                key: extremities[1],
                x: targetX,
                y: targetY,
            }, this.settings);
        }
        return this;
    };
    /**
     * Method used to render the highlighted nodes.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderHighlightedNodes = function () {
        var _this = this;
        var camera = this.camera;
        var sizeRatio = Math.pow(camera.getState().ratio, 0.5);
        var context = this.canvasContexts.hovers;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        // Rendering
        var render = function (node) {
            var data = _this.nodeDataCache[node];
            var _a = camera.framedGraphToViewport({ width: _this.width, height: _this.height }, data), x = _a.x, y = _a.y;
            var size = data.size / sizeRatio;
            _this.settings.hoverRenderer(context, {
                key: node,
                label: data.label,
                color: data.color,
                size: size,
                x: x,
                y: y,
                icon: data.icon
            }, _this.settings);
        };
        if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
            render(this.hoveredNode);
        }
        this.highlightedNodes.forEach(render);
    };
    /**
     * Method used to schedule a hover render.
     *
     */
    Sigma.prototype.scheduleHighlightedNodesRender = function () {
        var _this = this;
        if (this.renderHighlightedNodesFrame || this.renderFrame)
            return;
        this.renderHighlightedNodesFrame = utils_1.requestFrame(function () {
            // Resetting state
            _this.renderHighlightedNodesFrame = null;
            // Rendering
            _this.renderHighlightedNodes();
            _this.renderEdgeLabels();
        });
    };
    /**
     * Method used to render.
     *
     * @return {Sigma}
     */
    Sigma.prototype.render = function () {
        // If a render was scheduled, we cancel it
        if (this.renderFrame) {
            utils_1.cancelFrame(this.renderFrame);
            this.renderFrame = null;
            this.needToProcess = false;
            this.needToSoftProcess = false;
        }
        // First we need to resize
        this.resize();
        // Clearing the canvases
        this.clear();
        // If we have no nodes we can stop right there
        if (!this.graph.order)
            return this;
        // TODO: improve this heuristic or move to the captor itself?
        // TODO: deal with the touch captor here as well
        var mouseCaptor = this.mouseCaptor;
        var moving = this.camera.isAnimated() ||
            mouseCaptor.isMoving ||
            mouseCaptor.draggedEvents ||
            mouseCaptor.currentWheelDirection;
        // Then we need to extract a matrix from the camera
        var cameraState = this.camera.getState(), cameraMatrix = utils_1.matrixFromCamera(cameraState, {
            width: this.width,
            height: this.height,
        });
        var program;
        // Drawing nodes
        program = this.nodePrograms[this.settings.defaultNodeType];
        program.render({
            matrix: cameraMatrix,
            width: this.width,
            height: this.height,
            ratio: cameraState.ratio,
            nodesPowRatio: 0.5,
            scalingRatio: WEBGL_OVERSAMPLING_RATIO,
        });
        // Drawing edges
        if (!this.settings.hideEdgesOnMove || !moving) {
            program = this.edgePrograms[this.settings.defaultEdgeType];
            program.render({
                matrix: cameraMatrix,
                width: this.width,
                height: this.height,
                ratio: cameraState.ratio,
                edgesPowRatio: 0.5,
                scalingRatio: WEBGL_OVERSAMPLING_RATIO,
            });
        }
        // Do not display labels on move per setting
        if (this.settings.hideLabelsOnMove && moving)
            return this;
        this.renderLabels();
        this.renderEdgeLabels();
        this.renderHighlightedNodes();
        return this;
    };
    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */
    Sigma.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Method returning the renderer's contexts
     * return canvasContexts  wlove
     *
     */
    Sigma.prototype.getCanvasContexts = function () {
        return this.canvasContexts;
    };
    /**
     * Method returning the renderer's graph.
     *
     * @return {Graph}
     */
    Sigma.prototype.getGraph = function () {
        return this.graph;
    };
    /**
     * Method returning the mouse captor.
     *
     * @return {MouseCaptor}
     */
    Sigma.prototype.getMouseCaptor = function () {
        return this.mouseCaptor;
    };
    /**
     * Method returning the touch captor.
     *
     * @return {TouchCaptor}
     */
    Sigma.prototype.getTouchCaptor = function () {
        return this.touchCaptor;
    };
    /**
     * Method returning the current renderer's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getDimensions = function () {
        return { width: this.width, height: this.height };
    };
    /**
     * Method used to get all the sigma node attributes.
     * It's usefull for example to get the position of a node
     * and to get values that are set by the nodeReducer
     *
     * @param  {string} key - The node's key.
     * @return {Partial<NodeAttributes>} A copy of the desired node's attribute or undefined if not found
     */
    Sigma.prototype.getNodeAttributes = function (key) {
        var node = this.nodeDataCache[key];
        return node ? Object.assign({}, node) : undefined;
    };
    /**
     * Method used to get all the sigma edge attributes.
     * It's usefull for example to get values that are set by the edgeReducer.
     *
     * @param  {string} key - The edge's key.
     * @return {Partial<EdgeAttributes> | undefined} A copy of the desired edge's attribute or undefined if not found
     */
    Sigma.prototype.getEdgeAttributes = function (key) {
        var edge = this.edgeDataCache[key];
        return edge ? Object.assign({}, edge) : undefined;
    };
    /**
     * Method returning the current value for a given setting key.
     *
     * @param  {string} key - The setting key to get.
     * @return {any} The value attached to this setting key or undefined if not found
     */
    Sigma.prototype.getSetting = function (key) {
        return this.settings[key];
    };
    /**
     * Method setting the value of a given setting key. Note that this will schedule
     * a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
    Sigma.prototype.setSetting = function (key, value) {
        this.settings[key] = value;
        settings_1.validateSettings(this.settings);
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method updating the value of a given setting key using the provided function.
     * Note that this will schedule a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
    Sigma.prototype.updateSetting = function (key, updater) {
        this.settings[key] = updater(this.settings[key]);
        settings_1.validateSettings(this.settings);
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to resize the renderer.
     *
     * @return {Sigma}
     */
    Sigma.prototype.resize = function () {
        var previousWidth = this.width, previousHeight = this.height;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        if (this.width === 0)
            throw new Error("Sigma: container has no width.");
        if (this.height === 0)
            throw new Error("Sigma: container has no height.");
        // If nothing has changed, we can stop right here
        if (previousWidth === this.width && previousHeight === this.height)
            return this;
        // Sizing dom elements
        for (var id in this.elements) {
            var element = this.elements[id];
            element.style.width = this.width + "px";
            element.style.height = this.height + "px";
        }
        // Sizing canvas contexts
        for (var id in this.canvasContexts) {
            this.elements[id].setAttribute("width", this.width * PIXEL_RATIO + "px");
            this.elements[id].setAttribute("height", this.height * PIXEL_RATIO + "px");
            if (PIXEL_RATIO !== 1)
                this.canvasContexts[id].scale(PIXEL_RATIO, PIXEL_RATIO);
        }
        // Sizing WebGL contexts
        for (var id in this.webGLContexts) {
            this.elements[id].setAttribute("width", this.width * WEBGL_OVERSAMPLING_RATIO + "px");
            this.elements[id].setAttribute("height", this.height * WEBGL_OVERSAMPLING_RATIO + "px");
            this.webGLContexts[id].viewport(0, 0, this.width * WEBGL_OVERSAMPLING_RATIO, this.height * WEBGL_OVERSAMPLING_RATIO);
        }
        return this;
    };
    /**
     * Method used to clear all the canvases.
     *
     * @return {Sigma}
     */
    Sigma.prototype.clear = function () {
        this.webGLContexts.nodes.clear(this.webGLContexts.nodes.COLOR_BUFFER_BIT);
        this.webGLContexts.edges.clear(this.webGLContexts.edges.COLOR_BUFFER_BIT);
        this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
        return this;
    };
    /**
     * Method used to refresh all computed data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.refresh = function () {
        this.needToProcess = true;
        this._refresh();
        return this;
    };
    /**
     * Method used to refresh all computed data, at the next available frame.
     * If this method has already been called this frame, then it will only render once at the next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype.scheduleRefresh = function () {
        this.needToProcess = true;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
     * stage) to the graph system (the reference system of data as they are in the given graph instance).
     *
     * @param {Coordinates} viewportPoint
     */
    Sigma.prototype.viewportToGraph = function (viewportPoint) {
        return this.normalizationFunction.inverse(this.camera.viewportToFramedGraph(this.getDimensions(), viewportPoint));
    };
    /**
     * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
     * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
     *
     * @param {Coordinates} graphPoint
     */
    Sigma.prototype.graphToViewport = function (graphPoint) {
        return this.camera.framedGraphToViewport(this.getDimensions(), this.normalizationFunction(graphPoint));
    };
    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */
    Sigma.prototype.kill = function () {
        var graph = this.graph;
        // Emitting "kill" events so that plugins and such can cleanup
        this.emit("kill");
        // Releasing events
        this.removeAllListeners();
        // Releasing camera handlers
        this.camera.removeListener("updated", this.activeListeners.camera);
        // Releasing DOM events & captors
        window.removeEventListener("resize", this.activeListeners.handleResize);
        this.mouseCaptor.kill();
        this.touchCaptor.kill();
        // Releasing graph handlers
        graph.removeListener("nodeAdded", this.activeListeners.addNodeGraphUpdate);
        graph.removeListener("nodeDropped", this.activeListeners.graphUpdate);
        graph.removeListener("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgeAdded", this.activeListeners.addEdgeGraphUpdate);
        graph.removeListener("edgeDropped", this.activeListeners.graphUpdate);
        graph.removeListener("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgesCleared", this.activeListeners.graphUpdate);
        graph.removeListener("cleared", this.activeListeners.graphUpdate);
        // Releasing cache & state
        this.quadtree = new quadtree_1.default();
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        this.highlightedNodes = new Set();
        this.displayedLabels = new Set();
        // Clearing frames
        if (this.renderFrame) {
            utils_1.cancelFrame(this.renderFrame);
            this.renderFrame = null;
        }
        if (this.renderHighlightedNodesFrame) {
            utils_1.cancelFrame(this.renderHighlightedNodesFrame);
            this.renderHighlightedNodesFrame = null;
        }
        // Destroying canvases
        var container = this.container;
        while (container.firstChild)
            container.removeChild(container.firstChild);
    };
    return Sigma;
}(events_1.EventEmitter));
exports.default = Sigma;


/***/ }),
/* 13 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Extent
 * ==================
 *
 * Simple function returning the extent of selected attributes of the graph.
 */
var isGraph = __webpack_require__(14);

/**
 * Function returning the extent of the selected node attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function nodeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/extent: the given graph is not a valid graphology instance.');

  var attributes = [].concat(attribute);

  var value,
      key,
      a;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  graph.forEachNode(function(node, data) {
    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0])
        results[key][0] = value;

      if (value > results[key][1])
        results[key][1] = value;
    }
  });

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Function returning the extent of the selected edge attributes.
 *
 * @param  {Graph}        graph     - Target graph.
 * @param  {string|array} attribute - Single or multiple attributes.
 * @return {array|object}
 */
function edgeExtent(graph, attribute) {
  if (!isGraph(graph))
    throw new Error('graphology-metrics/extent: the given graph is not a valid graphology instance.');

  var attributes = [].concat(attribute);

  var value,
      key,
      a;

  var results = {};

  for (a = 0; a < attributes.length; a++) {
    key = attributes[a];

    results[key] = [Infinity, -Infinity];
  }

  graph.forEachEdge(function(edge, data) {
    for (a = 0; a < attributes.length; a++) {
      key = attributes[a];
      value = data[key];

      if (value < results[key][0])
        results[key][0] = value;

      if (value > results[key][1])
        results[key][1] = value;
    }
  });

  return typeof attribute === 'string' ? results[attribute] : results;
}

/**
 * Exporting.
 */
var extent = nodeExtent;
extent.nodeExtent = nodeExtent;
extent.edgeExtent = edgeExtent;

module.exports = extent;


/***/ }),
/* 14 */
/***/ ((module) => {

/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function' &&
    typeof value.multi === 'boolean'
  );
};


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.edgeLabelsToDisplayFromNodes = exports.labelsToDisplayFromGrid = void 0;
var camera_1 = __importDefault(__webpack_require__(1));
/**
 * Constants.
 */
// Dimensions of a normal cell
var DEFAULT_CELL = {
    width: 250,
    height: 175,
};
// Dimensions of an unzoomed cell. This one is usually larger than the normal
// one to account for the fact that labels will more likely collide.
var DEFAULT_UNZOOMED_CELL = {
    width: 400,
    height: 300,
};
/**
 * Helpers.
 */
function collision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}
// TODO: cache camera position of selected nodes to avoid costly computations
// in anti-collision step
// TOOD: document a little bit more so future people can understand this mess
/**
 * Label grid heuristic selecting labels to display.
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   cache                - Cache storing nodes' data.
 * @param  {Camera}   camera               - The renderer's camera.
 * @param  {Set}      displayedLabels      - Currently displayed labels.
 * @param  {Array}    visibleNodes         - Nodes visible for this render.
 * @param  {Graph}    graph                - The rendered graph.
 * @return {Array}                         - The selected labels.
 */
function labelsToDisplayFromGrid(params) {
    var cache = params.cache, camera = params.camera, userCell = params.cell, dimensions = params.dimensions, displayedLabels = params.displayedLabels, _a = params.fontSize, fontSize = _a === void 0 ? 14 : _a, graph = params.graph, _b = params.renderedSizeThreshold, renderedSizeThreshold = _b === void 0 ? -Infinity : _b, visibleNodes = params.visibleNodes;
    var cameraState = camera.getState(), previousCameraState = camera.getPreviousState();
    var previousCamera = new camera_1.default();
    previousCamera.setState(previousCameraState);
    // TODO: should factorize. This same code is used quite a lot throughout the codebase
    // TODO: POW RATIO is currently default 0.5 and harcoded
    var sizeRatio = Math.pow(cameraState.ratio, 0.5);
    // State
    var zooming = cameraState.ratio < previousCameraState.ratio, panning = cameraState.x !== previousCameraState.x || cameraState.y !== previousCameraState.y, unzooming = cameraState.ratio > previousCameraState.ratio, unzoomedPanning = panning && !zooming && !unzooming && cameraState.ratio >= 1, zoomedPanning = panning && displayedLabels.size && !zooming && !unzooming;
    // Trick to discretize unzooming
    if (unzooming && Math.trunc(cameraState.ratio * 100) % 5 !== 0)
        return Array.from(displayedLabels);
    // If panning while unzoomed, we shouldn't change label selection
    if (unzoomedPanning && displayedLabels.size !== 0)
        return Array.from(displayedLabels);
    // When unzoomed & zooming
    if (zooming && cameraState.ratio >= 1)
        return Array.from(displayedLabels);
    // Adapting cell dimensions
    var cell = userCell ? userCell : DEFAULT_CELL;
    if (cameraState.ratio >= 1.3)
        cell = DEFAULT_UNZOOMED_CELL;
    var cwr = dimensions.width % cell.width;
    var cellWidth = cell.width + cwr / Math.floor(dimensions.width / cell.width);
    var chr = dimensions.height % cell.height;
    var cellHeight = cell.height + chr / Math.floor(dimensions.height / cell.height);
    var adjustedWidth = dimensions.width + cellWidth, adjustedHeight = dimensions.height + cellHeight, adjustedX = -cellWidth, adjustedY = -cellHeight;
    var panningWidth = dimensions.width + cellWidth / 2, panningHeight = dimensions.height + cellHeight / 2, panningX = -(cellWidth / 2), panningY = -(cellHeight / 2);
    var worthyLabels = [];
    var grid = {};
    var maxSize = -Infinity, biggestNode = null;
    for (var i = 0, l = visibleNodes.length; i < l; i++) {
        var node = visibleNodes[i], nodeData = cache[node];
        // We filter hidden nodes
        if (nodeData.hidden)
            continue;
        // We filter nodes having a rendered size less than a certain thresold
        if (nodeData.size / sizeRatio < renderedSizeThreshold)
            continue;
        // Finding our node's cell in the grid
        var pos = camera.framedGraphToViewport(dimensions, nodeData);
        // Node is not actually visible on screen
        // NOTE: can optimize margin on the right side (only if we know where the labels go)
        if (pos.x < adjustedX || pos.x > adjustedWidth || pos.y < adjustedY || pos.y > adjustedHeight)
            continue;
        // Keeping track of the maximum node size for certain cases
        if (nodeData.size > maxSize) {
            maxSize = nodeData.size;
            biggestNode = node;
        }
        // If panning when zoomed, we consider only displayed labels and newly
        // visible nodes
        if (zoomedPanning) {
            var ppos = previousCamera.framedGraphToViewport(dimensions, nodeData);
            // Was node visible earlier?
            if (ppos.x >= panningX && ppos.x <= panningWidth && ppos.y >= panningY && ppos.y <= panningHeight) {
                // Was the label displayed?
                if (!displayedLabels.has(node))
                    continue;
            }
        }
        var xKey = Math.floor(pos.x / cellWidth), yKey = Math.floor(pos.y / cellHeight);
        var key = xKey + "\u00A7" + yKey;
        if (typeof grid[key] === "undefined") {
            // This cell is not yet occupied
            grid[key] = node;
        }
        else {
            // We must solve a conflict in this cell
            var currentNode = grid[key], currentNodeData = cache[currentNode];
            // We prefer already displayed labels
            if (displayedLabels.size > 0) {
                var n1 = displayedLabels.has(node), n2 = displayedLabels.has(currentNode);
                if (!n1 && n2) {
                    continue;
                }
                if (n1 && !n2) {
                    grid[key] = node;
                    continue;
                }
                if ((zoomedPanning || zooming) && n1 && n2) {
                    worthyLabels.push(node);
                    continue;
                }
            }
            // In case of size & degree equality, we use the node's key so that the
            // process remains deterministic
            var won = false;
            if (nodeData.size > currentNodeData.size) {
                won = true;
            }
            else if (nodeData.size === currentNodeData.size) {
                var nodeDegree = graph.degree(node), currentNodeDegree = graph.degree(currentNode);
                if (nodeDegree > currentNodeDegree) {
                    won = true;
                }
                else if (nodeDegree === currentNodeDegree) {
                    if (node > currentNode)
                        won = true;
                }
            }
            if (won)
                grid[key] = node;
        }
    }
    // Compiling the labels
    var biggestNodeShown = worthyLabels.some(function (node) { return node === biggestNode; });
    for (var key in grid) {
        var node = grid[key];
        if (node === biggestNode)
            biggestNodeShown = true;
        worthyLabels.push(node);
    }
    // Always keeping biggest node shown on screen
    if (!biggestNodeShown && biggestNode)
        worthyLabels.push(biggestNode);
    // Basic anti-collision
    var collisions = new Set();
    for (var i = 0, l = worthyLabels.length; i < l; i++) {
        var n1 = worthyLabels[i], d1 = cache[n1], p1 = camera.framedGraphToViewport(dimensions, d1);
        if (collisions.has(n1))
            continue;
        for (var j = i + 1; j < l; j++) {
            var n2 = worthyLabels[j], d2 = cache[n2], p2 = camera.framedGraphToViewport(dimensions, d2);
            var c = collision(
            // First abstract bbox
            p1.x, p1.y, d1.label.length * 8, fontSize, 
            // Second abstract bbox
            p2.x, p2.y, d2.label.length * 8, fontSize);
            if (c) {
                // NOTE: add degree as tie-breaker here if required in the future
                // NOTE: add final stable tie-breaker using node key if required
                if (d1.size < d2.size)
                    collisions.add(n1);
                else
                    collisions.add(n2);
            }
        }
    }
    // console.log(collisions)
    return worthyLabels.filter(function (l) { return !collisions.has(l); });
}
exports.labelsToDisplayFromGrid = labelsToDisplayFromGrid;
/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {object}   nodeDataCache        - Cache storing nodes data.
 * @param  {object}   edgeDataCache        - Cache storing edges data.
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
function edgeLabelsToDisplayFromNodes(params) {
    var nodeDataCache = params.nodeDataCache, edgeDataCache = params.edgeDataCache, graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
    var worthyEdges = new Set();
    var displayedNodeLabelsArray = Array.from(displayedNodeLabels);
    // Each edge connecting a highlighted node has its label displayed if the other extremity is not hidden:
    var highlightedNodesArray = Array.from(highlightedNodes);
    if (hoveredNode && !highlightedNodes.has(hoveredNode))
        highlightedNodesArray.push(hoveredNode);
    for (var i = 0; i < highlightedNodesArray.length; i++) {
        var key = highlightedNodesArray[i];
        var edges = graph.edges(key);
        for (var j = 0; j < edges.length; j++) {
            var edgeKey = edges[j];
            var extremities = graph.extremities(edgeKey), sourceData = nodeDataCache[extremities[0]], targetData = nodeDataCache[extremities[1]], edgeData = edgeDataCache[edgeKey];
            if (edgeData.hidden && sourceData.hidden && targetData.hidden) {
                worthyEdges.add(edgeKey);
            }
        }
    }
    // Each edge connecting two nodes with visible labels has its label displayed:
    for (var i = 0; i < displayedNodeLabelsArray.length; i++) {
        var key = displayedNodeLabelsArray[i];
        var edges = graph.outboundEdges(key);
        for (var j = 0; j < edges.length; j++)
            if (!edgeDataCache[edges[j]].hidden && displayedNodeLabels.has(graph.opposite(key, edges[j])))
                worthyEdges.add(edges[j]);
    }
    return Array.from(worthyEdges);
}
exports.edgeLabelsToDisplayFromNodes = edgeLabelsToDisplayFromNodes;


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_SETTINGS = exports.validateSettings = void 0;
var label_1 = __importDefault(__webpack_require__(17));
var hover_1 = __importDefault(__webpack_require__(18));
var edge_label_1 = __importDefault(__webpack_require__(20));
var node_rect_1 = __importDefault(__webpack_require__(21));
var node_fast_1 = __importDefault(__webpack_require__(27));
var edge_1 = __importDefault(__webpack_require__(30));
var edge_fast_1 = __importDefault(__webpack_require__(34));
var edge_arrow_1 = __importDefault(__webpack_require__(37));
function validateSettings(settings) {
    // Label grid cell
    if (settings.labelGrid &&
        settings.labelGrid.cell &&
        typeof settings.labelGrid.cell === "object" &&
        (!settings.labelGrid.cell.width || !settings.labelGrid.cell.height)) {
        throw new Error("Settings: invalid `labelGrid.cell`. Expecting {width, height}.");
    }
}
exports.validateSettings = validateSettings;
exports.DEFAULT_SETTINGS = {
    // Performance
    hideEdgesOnMove: false,
    hideLabelsOnMove: false,
    renderLabels: true,
    renderEdgeLabels: false,
    // Component rendering
    defaultNodeColor: "#999",
    defaultNodeType: "circle",
    defaultEdgeColor: "#ccc",
    defaultEdgeType: "line",
    labelFont: "Arial",
    labelSize: 14,
    labelWeight: "normal",
    edgeLabelFont: "Arial",
    edgeLabelSize: 10,
    edgeLabelWeight: "normal",
    // Labels
    labelGrid: {
        cell: null,
        renderedSizeThreshold: -Infinity,
    },
    // Reducers
    nodeReducer: null,
    edgeReducer: null,
    // Features
    zIndex: false,
    // Renderers
    labelRenderer: label_1.default,
    hoverRenderer: hover_1.default,
    edgeLabelRenderer: edge_label_1.default,
    // Program classes
    nodeProgramClasses: {
        circle: node_fast_1.default,
        rect: node_rect_1.default
    },
    edgeProgramClasses: {
        arrow: edge_arrow_1.default,
        line: edge_1.default,
        // triangles:TriangleEdgeProgram,
        fast: edge_fast_1.default,
        // bezier:BezierEdgeProgram,
    },
};


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
// var img = new Image();   // 创建img元素
// img.src = "https://sf6-ttcdn-tos.pstatp.com/img/user-avatar/b67f2c7290f5cd5dac9d322b8af250ab~300x300.image";
// img.src = "http://localhost:8000/account.svg";
function drawLabel(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    // fill backgroud
    // context.fillStyle = "#fff";
    // context.fillRect(data.x - data.label.length / 2 - data.size, data.y + data.size,data.label.length * 12 * data.sizeRatio,20);
    context.fillStyle = "#000";
    context.font = weight + " " + size + "px " + font;
    // if(data.sizeRatio < 0.3){
    // 左侧
    // context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
    // 下
    // context.fillText(data.label, data.x, data.y + (size / 3 / data.sizeRatio));
    context.fillText(data.label, data.x - data.label.length * 4, data.y + data.size + 14);
    if (data.icon != undefined) {
        var img = new Image();
        img.src = "./img/icon/" + data.icon + ".svg";
        context.drawImage(img, data.x - data.size / 2, data.y - data.size / 2, data.size, data.size);
    }
    // }
}
exports.default = drawLabel;


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var node_1 = __importDefault(__webpack_require__(19));
var label_1 = __importDefault(__webpack_require__(17));
function drawHover(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    context.font = weight + " " + size + "px " + font;
    if (data.label == "")
        return;
    // Then we draw the label background
    context.beginPath();
    context.fillStyle = "#fff";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = "#000";
    // const textWidth = context.measureText(data.label).width;
    // const x = Math.round(data.x - size / 2 - 2),
    //   y = Math.round(data.y - size / 2 - 2),
    //   w = Math.round(textWidth + size / 2 + data.size + 9),
    //   h = Math.round(size + 4),
    //   e = Math.round(size / 2 + 2);
    // context.moveTo(x, y + e);
    // context.moveTo(x, y + e);
    // context.arcTo(x, y, x + e, y, e);
    // context.lineTo(x + w, y);
    // context.lineTo(x + w, y + h);
    // context.lineTo(x + e, y + h);
    // context.arcTo(x, y + h, x, y + h - e, e);
    // context.lineTo(x, y + e);
    // context.closePath();
    // context.fill();
    var MARGIN = 3;
    var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 9), boxHeight = Math.round(size + 2 * MARGIN), radious = Math.max(data.size, size / 2) + MARGIN;
    var angleRadian = Math.asin(boxHeight / 2 / radious);
    var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radious, 2) - Math.pow(boxHeight / 2, 2)));
    context.beginPath();
    // context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
    // context.lineTo(data.x + radious + boxWidth, data.y + boxHeight / 2);
    // context.lineTo(data.x + radious + boxWidth, data.y - boxHeight / 2);
    // context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
    // context.arc(data.x, data.y, radious, angleRadian, -angleRadian);
    context.arc(data.x, data.y, radious, 0, Math.PI * 2);
    context.closePath();
    context.fill();
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    // Then we need to draw the node
    node_1.default(context, data);
    // And finally we draw the label
    label_1.default(context, data, settings);
}
exports.default = drawHover;


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var PI_TIMES_2 = Math.PI * 2;
function drawNode(context, data) {
    context.fillStyle = data.color;
    context.beginPath();
    context.arc(data.x, data.y, data.size, 0, PI_TIMES_2, true);
    // console.log(data)
    context.closePath();
    context.fill();
    // if(data.key.split("_")[1] == "account"){
    // 	context.drawImage(img,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size )
    // }else{
    // 	context.drawImage(img_ip,  data.x - data.size/2 , data.y - data.size/2 ,data.size ,data.size )
    // }
    if (data.icon != undefined) {
        var img = new Image();
        img.src = "./img/icon/" + data.icon + ".svg";
        context.drawImage(img, data.x - data.size / 2, data.y - data.size / 2, data.size, data.size);
    }
}
exports.default = drawNode;


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawEdgeLabel(context, edgeData, sourceData, targetData, settings) {
    var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, label = edgeData.label;
    context.fillStyle = edgeData.color;
    context.font = weight + " " + size + "px " + font;
    var textWidth = context.measureText(label).width;
    // console.log(edgeData)
    if (edgeData.index == 0) {
        var cx = (sourceData.x + targetData.x) / 2;
        var cy = (sourceData.y + targetData.y) / 2;
    }
    else {
        if (edgeData.index % 2 != 0) {
            var cx = (sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / (edgeData.index + 7);
            var cy = (sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / (edgeData.index + 7);
        }
        else {
            var cx = (sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / -(edgeData.index + 9);
            var cy = (sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / -(edgeData.index + 9);
        }
        // if(data.index % 2 == 0){
        //    array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
        //    array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
        //    array[i++] = color;
        //    // middle
        //    array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
        //    array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
        //    array[i++] = color;
        //  }else{
        //    array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
        //    array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
        //    array[i++] = color;
        //    // middle
        //    array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
        //    array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
        //    array[i++] = color;
        //  }
    }
    // array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 4);
    // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 4);
    var dx = targetData.x - sourceData.x;
    var dy = targetData.y - sourceData.y;
    var d = Math.sqrt(dx * dx + dy * dy);
    var angle;
    if (dx > 0) {
        if (dy > 0)
            angle = Math.acos(dx / d);
        else
            angle = Math.asin(dy / d);
    }
    else {
        if (dy > 0)
            angle = Math.acos(dx / d) + Math.PI;
        else
            angle = Math.asin(dx / d) + Math.PI / 2;
    }
    context.save();
    context.translate(cx, cy);
    // context.translate(
    //           Math.abs((sourceData.x + targetData.x) / 2 + (targetData.y - sourceData.y) / 4), 
    //           Math.abs((sourceData.y + targetData.y) / 2 + (sourceData.x - targetData.x) / 4)
    // );
    context.rotate(angle);
    context.fillText(label, -textWidth / 2, edgeData.size + size);
    context.restore();
}
exports.default = drawEdgeLabel;


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(4);
var node_rect_vert_glsl_1 = __importDefault(__webpack_require__(22));
var node_rect_frag_glsl_1 = __importDefault(__webpack_require__(23));
var node_1 = __webpack_require__(24);
var POINTS = 1, ATTRIBUTES = 4;
var NodeProgramFast = /** @class */ (function (_super) {
    __extends(NodeProgramFast, _super);
    function NodeProgramFast(gl) {
        var _this = _super.call(this, gl, node_rect_vert_glsl_1.default, node_rect_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        _this.bind();
        return _this;
    }
    NodeProgramFast.prototype.process = function (data, hidden, offset) {
        var array = this.array;
        var i = offset * POINTS * ATTRIBUTES;
        if (hidden) {
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            return;
        }
        var color = utils_1.floatColor(data.color);
        array[i++] = data.x;
        array[i++] = data.y;
        array[i++] = data.size;
        array[i] = color;
    };
    NodeProgramFast.prototype.render = function (params) {
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    };
    return NodeProgramFast;
}(node_1.AbstractNodeProgram));
exports.default = NodeProgramFast;


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 a_position;\r\nattribute float a_size;\r\nattribute vec4 a_color;\r\n\r\nuniform float u_ratio;\r\nuniform float u_scale;\r\nuniform mat3 u_matrix;\r\n\r\nvarying vec4 v_color;\r\nvarying float v_border;\r\n\r\nconst float bias = 255.0 / 254.0;\r\n\r\nvoid main() {\r\n\r\n  gl_Position = vec4(\r\n    (u_matrix * vec3(a_position, 1)).xy,\r\n    0,\r\n    1\r\n  );\r\n\r\n  // Multiply the point size twice:\r\n  //  - x SCALING_RATIO to correct the canvas scaling\r\n  //  - x 2 to correct the formulae \r\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\r\n\r\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\r\n\r\n  // Extract the color:\r\n  v_color = a_color;\r\n  v_color.a *= bias;\r\n}\r\n");

/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\r\n\r\nvarying vec4 v_color;\r\nvarying float v_border;\r\n\r\nconst float radius = 1.0;\r\n\r\nvoid main(void) {\r\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\r\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\r\n  float dist = radius - length(m);\r\n\r\n  float t = 0.0;\r\n  if (dist > v_border)\r\n    t = 1.0;\r\n  else if (dist > 0.0)\r\n    t = dist / v_border;\r\n\r\n  gl_FragColor = mix(color0, v_color, t);\r\n}\r\n ");

/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNodeCompoundProgram = exports.AbstractNodeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(25);
/**
 * Node Program class.
 *
 * @constructor
 */
var AbstractNodeProgram = /** @class */ (function (_super) {
    __extends(AbstractNodeProgram, _super);
    function AbstractNodeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        var _this = _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.sizeLocation = gl.getAttribLocation(_this.program, "a_size");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        // Uniform Location
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("AbstractNodeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var ratioLocation = gl.getUniformLocation(_this.program, "u_ratio");
        if (ratioLocation === null)
            throw new Error("AbstractNodeProgram: error while getting ratioLocation");
        _this.ratioLocation = ratioLocation;
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("AbstractNodeProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        return _this;
    }
    AbstractNodeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.sizeLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, this.attributes * Float32Array.BYTES_PER_ELEMENT, 12);
    };
    return AbstractNodeProgram;
}(program_1.AbstractProgram));
exports.AbstractNodeProgram = AbstractNodeProgram;
/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
function createNodeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function NodeCompoundProgram(gl) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl); });
        }
        NodeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        NodeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        NodeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        NodeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) { return program.render(params); });
        };
        NodeCompoundProgram.prototype.process = function (data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(data, hidden, offset); });
        };
        return NodeCompoundProgram;
    }());
}
exports.createNodeCompoundProgram = createNodeCompoundProgram;


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractProgram = void 0;
/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
var utils_1 = __webpack_require__(26);
/**
 * Abstract Program class.
 *
 * @constructor
 */
var AbstractProgram = /** @class */ (function () {
    function AbstractProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        this.array = new Float32Array();
        this.points = points;
        this.attributes = attributes;
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;
        var buffer = gl.createBuffer();
        if (buffer === null)
            throw new Error("AbstractProgram: error while creating the buffer");
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.vertexShader = utils_1.loadVertexShader(gl, this.vertexShaderSource);
        this.fragmentShader = utils_1.loadFragmentShader(gl, this.fragmentShaderSource);
        this.program = utils_1.loadProgram(gl, [this.vertexShader, this.fragmentShader]);
    }
    AbstractProgram.prototype.bufferData = function () {
        var gl = this.gl;
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    };
    AbstractProgram.prototype.allocate = function (capacity) {
        this.array = new Float32Array(this.points * this.attributes * capacity);
    };
    return AbstractProgram;
}());
exports.AbstractProgram = AbstractProgram;


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 * @module
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadProgram = exports.loadFragmentShader = exports.loadVertexShader = void 0;
/**
 * Function used to load a shader.
 */
function loadShader(type, gl, source) {
    var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    // Creating the shader
    var shader = gl.createShader(glType);
    if (shader === null) {
        throw new Error("loadShader: error while creating the shader");
    }
    // Loading source
    gl.shaderSource(shader, source);
    // Compiling the shader
    gl.compileShader(shader);
    // Retrieving compilation status
    var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // Throwing if something went awry
    if (!successfullyCompiled) {
        var infoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("loadShader: error while compiling the shader:\n" + infoLog + "\n" + source);
    }
    return shader;
}
function loadVertexShader(gl, source) {
    return loadShader("VERTEX", gl, source);
}
exports.loadVertexShader = loadVertexShader;
function loadFragmentShader(gl, source) {
    return loadShader("FRAGMENT", gl, source);
}
exports.loadFragmentShader = loadFragmentShader;
/**
 * Function used to load a program.
 */
function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    if (program === null) {
        throw new Error("loadProgram: error while creating the program.");
    }
    var i, l;
    // Attaching the shaders
    for (i = 0, l = shaders.length; i < l; i++)
        gl.attachShader(program, shaders[i]);
    gl.linkProgram(program);
    // Checking status
    var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successfullyLinked) {
        gl.deleteProgram(program);
        throw new Error("loadProgram: error while linking the program.");
    }
    return program;
}
exports.loadProgram = loadProgram;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(4);
var node_fast_vert_glsl_1 = __importDefault(__webpack_require__(28));
var node_fast_frag_glsl_1 = __importDefault(__webpack_require__(29));
var node_1 = __webpack_require__(24);
var POINTS = 1, ATTRIBUTES = 4;
var NodeProgramFast = /** @class */ (function (_super) {
    __extends(NodeProgramFast, _super);
    function NodeProgramFast(gl) {
        var _this = _super.call(this, gl, node_fast_vert_glsl_1.default, node_fast_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        _this.bind();
        return _this;
    }
    NodeProgramFast.prototype.process = function (data, hidden, offset) {
        var array = this.array;
        var i = offset * POINTS * ATTRIBUTES;
        if (hidden) {
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            return;
        }
        var color = utils_1.floatColor(data.color);
        array[i++] = data.x;
        array[i++] = data.y;
        array[i++] = data.size;
        array[i] = color;
    };
    NodeProgramFast.prototype.render = function (params) {
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniform1f(this.ratioLocation, 1 / Math.pow(params.ratio, params.nodesPowRatio));
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    };
    return NodeProgramFast;
}(node_1.AbstractNodeProgram));
exports.default = NodeProgramFast;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 a_position;\nattribute float a_size;\nattribute vec4 a_color;\n\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae \n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float radius = 0.5;\n\nvoid main(void) {\n  vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > v_border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / v_border;\n\n  gl_FragColor = mix(color0, v_color, t);\n}\n ");

/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 * @module
 */
var utils_1 = __webpack_require__(4);
var edge_vert_glsl_1 = __importDefault(__webpack_require__(31));
var edge_frag_glsl_1 = __importDefault(__webpack_require__(32));
var edge_1 = __webpack_require__(33);
var POINTS = 4, ATTRIBUTES = 6, STRIDE = POINTS * ATTRIBUTES;
var EdgeProgram = /** @class */ (function (_super) {
    __extends(EdgeProgram, _super);
    function EdgeProgram(gl) {
        var _this = _super.call(this, gl, edge_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeProgram: error while getting resolutionLocation");
        _this.indicesBuffer = indicesBuffer;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.thicknessLocation = gl.getAttribLocation(_this.program, "a_thickness");
        // Uniform locations
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("EdgeProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var cameraRatioLocation = gl.getUniformLocation(_this.program, "u_cameraRatio");
        if (cameraRatioLocation === null)
            throw new Error("EdgeProgram: error while getting cameraRatioLocation");
        _this.cameraRatioLocation = cameraRatioLocation;
        var viewportRatioLocation = gl.getUniformLocation(_this.program, "u_viewportRatio");
        if (viewportRatioLocation === null)
            throw new Error("EdgeProgram: error while getting viewportRatioLocation");
        _this.viewportRatioLocation = viewportRatioLocation;
        var thicknessRatioLocation = gl.getUniformLocation(_this.program, "u_thicknessRatio");
        if (thicknessRatioLocation === null)
            throw new Error("EdgeProgram: error while getting thicknessRatioLocation");
        _this.thicknessRatioLocation = thicknessRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = utils_1.canUse32BitsIndices(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.thicknessLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    };
    EdgeProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeProgram.prototype.bufferData = function () {
        // 绑定this.array
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = utils_1.floatColor(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len;
            n2 = dx * len;
        }
        var i = POINTS * ATTRIBUTES * offset;
        // console.log(i)
        var array = this.array;
        //  赋值
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = thickness; //厚度
        array[i++] = color;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = thickness;
        array[i++] = color;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = thickness;
        array[i++] = color;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = thickness;
        array[i] = color;
        // console.log(array)
    };
    EdgeProgram.prototype.render = function (params) {
        var gl = this.gl;
        var program = this.program;
        // console.log(params)
        gl.useProgram(program);
        // Binding uniforms
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.cameraRatioLocation, params.ratio);
        gl.uniform1f(this.viewportRatioLocation, 1 / Math.min(params.width, params.height));
        gl.uniform1f(this.thicknessRatioLocation, 1 / Math.pow(params.ratio, params.edgesPowRatio));
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeProgram;


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_thickness;\nattribute vec4 a_color;\n\nuniform mat3 u_matrix;\nuniform float u_scale;\nuniform float u_cameraRatio;\nuniform float u_viewportRatio;\nuniform float u_thicknessRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 0.8;\nconst float bias = 255.0 / 254.0; \n\nvoid main() {\n\n  // Computing thickness in screen space:\n  float thickness = a_thickness * u_thicknessRatio * u_scale * u_viewportRatio / 2.0;\n  thickness = max(thickness, minThickness * u_viewportRatio);\n\n  // Add normal vector to the position in screen space, but correct thickness first:\n  vec2 position = (u_matrix * vec3(a_position + a_normal * thickness * u_cameraRatio, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  v_normal = a_normal;\n  v_thickness = thickness;\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n");

/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.001;\nconst vec4 color0 = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, color0, t);\n}\n\n\n");

/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEdgeCompoundProgram = exports.AbstractEdgeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(25);
/**
 * Edge Program class.
 *
 * @constructor
 */
var AbstractEdgeProgram = /** @class */ (function (_super) {
    __extends(AbstractEdgeProgram, _super);
    function AbstractEdgeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        return _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
    }
    return AbstractEdgeProgram;
}(program_1.AbstractProgram));
exports.AbstractEdgeProgram = AbstractEdgeProgram;
function createEdgeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function EdgeCompoundProgram(gl) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl); });
        }
        EdgeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        EdgeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        EdgeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        EdgeCompoundProgram.prototype.computeIndices = function () {
            this.programs.forEach(function (program) { return program.computeIndices(); });
        };
        EdgeCompoundProgram.prototype.render = function (params) {
            // console.log(this.programs)
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        EdgeCompoundProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(sourceData, targetData, data, hidden, offset); });
        };
        return EdgeCompoundProgram;
    }());
}
exports.createEdgeCompoundProgram = createEdgeCompoundProgram;


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(4);
var edge_fast_vert_glsl_1 = __importDefault(__webpack_require__(35));
var edge_fast_frag_glsl_1 = __importDefault(__webpack_require__(36));
var edge_1 = __webpack_require__(33);
var POINTS = 4, ATTRIBUTES = 3;
var EdgeFastProgram = /** @class */ (function (_super) {
    __extends(EdgeFastProgram, _super);
    // resolutionLocation: WebGLUniformLocation;
    function EdgeFastProgram(gl) {
        var _this = _super.call(this, gl, edge_fast_vert_glsl_1.default, edge_fast_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Locations:
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.thicknessLocation = gl.getAttribLocation(_this.program, "a_thickness");
        // Uniform locations:
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeFastProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        // const resolutionLocation = gl.getUniformLocation(this.program, "u_resolution");
        // if (resolutionLocation === null) throw new Error("EdgeFastProgram: error while getting resolutionLocation");
        // this.resolutionLocation = resolutionLocation;
        _this.bind();
        return _this;
    }
    EdgeFastProgram.prototype.bind = function () {
        var gl = this.gl;
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.thicknessLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        //gl.vertexAttribPointer(this.colorLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
    };
    EdgeFastProgram.prototype.computeIndices = function () {
        //nothing to do
    };
    EdgeFastProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        var array = this.array;
        var i = 0;
        if (hidden) {
            for (var l = i + POINTS * ATTRIBUTES; i < l; i++)
                array[i] = 0;
        }
        // console.log(data)
        var x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = utils_1.floatColor(data.color);
        i = POINTS * ATTRIBUTES * offset;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = color;
        // console.log(data.index)
        if (data.index == undefined || data.index == 0) {
            array[i++] = x2;
            array[i++] = y2;
            array[i++] = color;
            // middle
            array[i++] = x1;
            array[i++] = y1;
            array[i++] = color;
        }
        else {
            // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
            // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 2);
            // array[i++] = color;
            // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
            // array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 2);
            // array[i++] = color;
            // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
            // array[i++] = (y1 + y2) / 10 + (x1 - x2) / (data.index + 2);
            // array[i++] = color;
            // array[i++] = (x1 + x2) / 10 + (y2 - y1) / (data.index + 2);
            // array[i++] = (y1 + y2) / 10 + (x1 - x2) / (data.index + 2);
            // array[i++] = color;
            if (data.index % 2 == 0) {
                array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
                array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
                array[i++] = color;
                // middle
                array[i++] = (x1 + x2) / 2 + (y2 - y1) / (data.index + 8);
                array[i++] = (y1 + y2) / 2 + (x1 - x2) / (data.index + 8);
                array[i++] = color;
            }
            else {
                array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
                array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
                array[i++] = color;
                // middle
                array[i++] = (x1 + x2) / 2 + (y2 - y1) / -(data.index + 8);
                array[i++] = (y1 + y2) / 2 + (x1 - x2) / -(data.index + 8);
                array[i++] = color;
            }
        }
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i] = color;
    };
    EdgeFastProgram.prototype.render = function (params) {
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // gl.uniform2f(this.resolutionLocation, params.width, params.height);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.LINES, 0, this.array.length / ATTRIBUTES);
    };
    return EdgeFastProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeFastProgram;


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// attribute vec2 a_position;\n// attribute float a_color;\n\n// uniform vec2 u_resolution;\n// uniform mat3 u_matrix;\n\n// varying vec4 color;\n\n// void main() {\n//   // Scale from [[-1 1] [-1 1]] to the container:\n//   gl_Position = vec4(\n//     ((u_matrix * vec3(a_position, 1)).xy /\n//       u_resolution * 2.0 - 1.0) * vec2(1, -1),\n//     0,\n//     1\n//   );\n\n//   // Extract the color:\n//   float c = a_color;\n//   color.b = mod(c, 256.0); c = floor(c / 256.0);\n//   color.g = mod(c, 256.0); c = floor(c / 256.0);\n//   color.r = mod(c, 256.0); c = floor(c / 256.0); color /= 255.0;\n//   color.a = 1.0;\n// }\n\n\n\nattribute vec2 a_position;\nattribute vec4 a_color;\nattribute float a_thickness;\n// uniform vec2 u_resolution;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\n\nvoid main() {\n  // Scale from [[-1 1] [-1 1]] to the container:\n  // gl_Position = vec4(\n  //   ((u_matrix * vec3(a_position, 1)).xy /\n  //     u_resolution * 2.0 - 1.0) * vec2(1, -1),\n  //   0,\n  //   1\n  // );\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n  // Extract the color:\n  // float c = a_color;\n  // v_color.b = mod(c, 256.0); c = floor(c / 256.0);\n  // v_color.g = mod(c, 256.0); c = floor(c / 256.0);\n  // v_color.r = mod(c, 256.0); c = floor(c / 256.0); v_color /= 255.0;\n  // v_color.a = 1.0;\n  v_color = a_color;\n}\n");

/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n");

/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
var edge_1 = __webpack_require__(33);
var edge_arrowHead_1 = __importDefault(__webpack_require__(38));
var edge_fast_1 = __importDefault(__webpack_require__(34)); // 直线
// import EdgeClampedProgram from "./edge.clamped";  // 直线
// import EdgeClampedProgram from "./edge.quadraticBezier"; // berzier曲线
var program = edge_1.createEdgeCompoundProgram([edge_fast_1.default, edge_arrowHead_1.default]);
exports.default = program;


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(4);
var edge_arrowHead_vert_glsl_1 = __importDefault(__webpack_require__(39));
var edge_arrowHead_frag_glsl_1 = __importDefault(__webpack_require__(40));
var edge_1 = __webpack_require__(33);
var POINTS = 3, ATTRIBUTES = 10, STRIDE = POINTS * ATTRIBUTES;
var EdgeArrowHeadProgram = /** @class */ (function (_super) {
    __extends(EdgeArrowHeadProgram, _super);
    function EdgeArrowHeadProgram(gl) {
        var _this = _super.call(this, gl, edge_arrowHead_vert_glsl_1.default, edge_arrowHead_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.thicknessLocation = gl.getAttribLocation(_this.program, "a_thickness");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        _this.barycentricLocation = gl.getAttribLocation(_this.program, "a_barycentric");
        // Uniform locations
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var cameraRatioLocation = gl.getUniformLocation(_this.program, "u_cameraRatio");
        if (cameraRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting cameraRatioLocation");
        _this.cameraRatioLocation = cameraRatioLocation;
        var viewportRatioLocation = gl.getUniformLocation(_this.program, "u_viewportRatio");
        if (viewportRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting viewportRatioLocation");
        _this.viewportRatioLocation = viewportRatioLocation;
        var thicknessRatioLocation = gl.getUniformLocation(_this.program, "u_thicknessRatio");
        if (thicknessRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting thicknessRatioLocation");
        _this.thicknessRatioLocation = thicknessRatioLocation;
        _this.bind();
        return _this;
    }
    EdgeArrowHeadProgram.prototype.bind = function () {
        var gl = this.gl;
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.thicknessLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.barycentricLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.thicknessLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24);
        // TODO: maybe we can optimize here by packing this in a bit mask
        gl.vertexAttribPointer(this.barycentricLocation, 3, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 28);
    };
    EdgeArrowHeadProgram.prototype.computeIndices = function () {
        // nothing to do
    };
    EdgeArrowHeadProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, radius = targetData.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = utils_1.floatColor(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len;
            n2 = dx * len;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        //(x,y) = (sin(a + N) * L,cos(a + N) * L)
        // 旋转坐标
        // First point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = thickness;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 1;
        array[i++] = 0;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = thickness;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 1;
        array[i++] = 0;
        // Third point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = thickness;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 0;
        array[i] = 1;
    };
    EdgeArrowHeadProgram.prototype.render = function (params) {
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        // console.log(params)
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.cameraRatioLocation, params.ratio);
        gl.uniform1f(this.viewportRatioLocation, 1 / Math.min(params.width, params.height));
        gl.uniform1f(this.thicknessRatioLocation, 1 / Math.pow(params.ratio, params.edgesPowRatio));
        // Drawing:
        gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
    };
    return EdgeArrowHeadProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeArrowHeadProgram;


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_thickness;\nattribute float a_radius;\nattribute vec4 a_color;\nattribute vec3 a_barycentric;\n\nuniform mat3 u_matrix;\nuniform float u_scale;\nuniform float u_cameraRatio;\nuniform float u_viewportRatio;\nuniform float u_thicknessRatio;\n\nvarying vec4 v_color;\n\nconst float arrowHeadLengthThicknessRatio = 2.5;\nconst float arrowHeadWidthLengthRatio = 0.66;\nconst float minThickness = 0.8;\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n\n  // Computing thickness in screen space:\n  float thickness = a_thickness * u_thicknessRatio * u_scale * u_viewportRatio / 2.0;\n  thickness = max(thickness, minThickness * u_viewportRatio);\n\n  float nodeRadius = a_radius * u_thicknessRatio * u_viewportRatio * u_cameraRatio;\n  float arrowHeadLength = thickness * 2.0 * arrowHeadLengthThicknessRatio * u_cameraRatio;\n  float arrowHeadHalfWidth = arrowHeadWidthLengthRatio * arrowHeadLength / 2.0;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * ((nodeRadius) * a_normal.y)\n    + db * ((nodeRadius + arrowHeadLength) * a_normal.y + arrowHeadHalfWidth * a_normal.x)\n    + dc * ((nodeRadius + arrowHeadLength) * a_normal.y - arrowHeadHalfWidth * a_normal.x),\n\n      da * (-(nodeRadius) * a_normal.x)\n    + db * (-(nodeRadius + arrowHeadLength) * a_normal.x + arrowHeadHalfWidth * a_normal.y)\n    + dc * (-(nodeRadius + arrowHeadLength) * a_normal.x - arrowHeadHalfWidth * a_normal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n");

/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(11));
var camera_1 = __importDefault(__webpack_require__(1));
var DRAG_TIMEOUT = 200;
var TOUCH_INERTIA_RATIO = 3;
var TOUCH_INERTIA_DURATION = 200;
/**
 * Touch captor class.
 *
 * @constructor
 */
var TouchCaptor = /** @class */ (function (_super) {
    __extends(TouchCaptor, _super);
    function TouchCaptor(container, camera) {
        var _this = _super.call(this, container, camera) || this;
        _this.enabled = true;
        _this.isMoving = false;
        _this.touchMode = 0; // number of touches down
        // Binding methods:
        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleLeave = _this.handleLeave.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        // Binding events
        container.addEventListener("touchstart", _this.handleStart, false);
        container.addEventListener("touchend", _this.handleLeave, false);
        container.addEventListener("touchcancel", _this.handleLeave, false);
        container.addEventListener("touchmove", _this.handleMove, false);
        return _this;
    }
    TouchCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("touchstart", this.handleStart);
        container.removeEventListener("touchend", this.handleLeave);
        container.removeEventListener("touchcancel", this.handleLeave);
        container.removeEventListener("touchmove", this.handleMove);
    };
    TouchCaptor.prototype.getDimensions = function () {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    };
    TouchCaptor.prototype.dispatchRelatedMouseEvent = function (type, e, position, emitter) {
        var mousePosition = position || captor_1.getPosition(e.touches[0]);
        var mouseEvent = new MouseEvent(type, {
            clientX: mousePosition.x,
            clientY: mousePosition.y,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
        });
        (emitter || this.container).dispatchEvent(mouseEvent);
    };
    TouchCaptor.prototype.handleStart = function (e) {
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousedown", e);
        var touches = captor_1.getTouchesArray(e.touches);
        this.isMoving = true;
        this.touchMode = touches.length;
        this.startCameraState = this.camera.getState();
        this.startTouchesPositions = touches.map(captor_1.getPosition);
        this.lastTouchesPositions = this.startTouchesPositions;
        // When there are two touches down, let's record distance and angle as well:
        if (this.touchMode === 2) {
            var _a = __read(this.startTouchesPositions, 2), _b = _a[0], x0 = _b.x, y0 = _b.y, _c = _a[1], x1 = _c.x, y1 = _c.y;
            this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
            this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }
        this.emit("touchdown", captor_1.getTouchCoords(e));
    };
    TouchCaptor.prototype.handleLeave = function (e) {
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 0 && this.lastTouchesPositions && this.lastTouchesPositions.length) {
            this.dispatchRelatedMouseEvent("mouseup", e, this.lastTouchesPositions[0], document);
            this.dispatchRelatedMouseEvent("click", e, this.lastTouchesPositions[0]);
        }
        if (this.movingTimeout) {
            this.isMoving = false;
            clearTimeout(this.movingTimeout);
        }
        switch (this.touchMode) {
            case 2:
                if (e.touches.length === 1) {
                    this.handleStart(e);
                    e.preventDefault();
                    break;
                }
            /* falls through */
            case 1:
                // TODO
                // Dispatch event
                if (this.isMoving) {
                    var cameraState = this.camera.getState(), previousCameraState = this.camera.getPreviousState();
                    this.camera.animate({
                        x: cameraState.x + TOUCH_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                        y: cameraState.y + TOUCH_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
                    }, {
                        duration: TOUCH_INERTIA_DURATION,
                        easing: "quadraticOut",
                    });
                }
                this.isMoving = false;
                this.touchMode = 0;
                break;
        }
        this.emit("touchup", captor_1.getTouchCoords(e));
    };
    TouchCaptor.prototype.handleMove = function (e) {
        var _a;
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousemove", e);
        var startCameraState = this.startCameraState;
        var touches = captor_1.getTouchesArray(e.touches);
        var touchesPositions = touches.map(captor_1.getPosition);
        this.lastTouchesPositions = touchesPositions;
        this.isMoving = true;
        if (this.movingTimeout)
            clearTimeout(this.movingTimeout);
        this.movingTimeout = window.setTimeout(function () {
            _this.isMoving = false;
        }, DRAG_TIMEOUT);
        switch (this.touchMode) {
            case 1: {
                var _b = this.camera.viewportToFramedGraph(this.getDimensions(), (this.startTouchesPositions || [])[0]), xStart = _b.x, yStart = _b.y;
                var _c = this.camera.viewportToFramedGraph(this.getDimensions(), touchesPositions[0]), x = _c.x, y = _c.y;
                this.camera.setState({
                    x: startCameraState.x + xStart - x,
                    y: startCameraState.y + yStart - y,
                });
                break;
            }
            case 2: {
                /**
                 * Here is the thinking here:
                 *
                 * 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
                 *    of the d'n'd and now
                 *
                 * 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
                 *    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
                 *    position of this same touch now
                 */
                var newCameraState = {};
                var _d = touchesPositions[0], x0 = _d.x, y0 = _d.y;
                var _e = touchesPositions[1], x1 = _e.x, y1 = _e.y;
                var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
                var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
                // 1.
                newCameraState.ratio = startCameraState.ratio / ratioDiff;
                newCameraState.angle = startCameraState.angle + angleDiff;
                // 2.
                var dimensions = this.getDimensions();
                var touchGraphPosition = camera_1.default.from(startCameraState).viewportToFramedGraph(dimensions, (this.startTouchesPositions || [])[0]);
                var smallestDimension = Math.min(dimensions.width, dimensions.height);
                var dx = smallestDimension / dimensions.width;
                var dy = smallestDimension / dimensions.height;
                var ratio = newCameraState.ratio / smallestDimension;
                // Align with center of the graph:
                var x = x0 - smallestDimension / 2 / dx;
                var y = y0 - smallestDimension / 2 / dy;
                // Rotate:
                _a = __read([
                    x * Math.cos(-newCameraState.angle) - y * Math.sin(-newCameraState.angle),
                    y * Math.cos(-newCameraState.angle) + x * Math.sin(-newCameraState.angle),
                ], 2), x = _a[0], y = _a[1];
                newCameraState.x = touchGraphPosition.x - x * ratio;
                newCameraState.y = touchGraphPosition.y + y * ratio;
                this.camera.setState(newCameraState);
                break;
            }
        }
        this.emit("touchmove", captor_1.getTouchCoords(e));
    };
    return TouchCaptor;
}(captor_1.default));
exports.default = TouchCaptor;


/***/ }),
/* 42 */
/***/ (function(module) {

!function(e,t){ true?module.exports=t():0}(this,(function(){"use strict";function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}function t(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}function n(e){return(n=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function r(e,t){return(r=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function o(e,t,n){return(o=i()?Reflect.construct:function(e,t,n){var i=[null];i.push.apply(i,t);var o=new(Function.bind.apply(e,i));return n&&r(o,n.prototype),o}).apply(null,arguments)}function a(e){var t="function"==typeof Map?new Map:void 0;return(a=function(e){if(null===e||(i=e,-1===Function.toString.call(i).indexOf("[native code]")))return e;var i;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,a)}function a(){return o(e,arguments,n(this).constructor)}return a.prototype=Object.create(e.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,e)})(e)}function u(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}var d=function(){for(var e=arguments[0],t=1,n=arguments.length;t<n;t++)if(arguments[t])for(var r in arguments[t])e[r]=arguments[t][r];return e};function c(e,t,n,r){var i=e._nodes.get(t),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function s(t){return null!==t&&"object"===e(t)&&"function"==typeof t.addUndirectedEdgeWithKey&&"function"==typeof t.dropNode}function h(t){return"object"===e(t)&&null!==t&&t.constructor===Object}function f(e){var t;for(t in e)return!1;return!0}function p(e,t,n){Object.defineProperty(e,t,{enumerable:!1,configurable:!1,writable:!0,value:n})}function g(e,t,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(e,t,r)}function l(e){return!!h(e)&&!(e.attributes&&!Array.isArray(e.attributes))}"function"==typeof Object.assign&&(d=Object.assign);var y,v="object"==typeof Reflect?Reflect:null,b=v&&"function"==typeof v.apply?v.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};y=v&&"function"==typeof v.ownKeys?v.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var w=Number.isNaN||function(e){return e!=e};function m(){m.init.call(this)}var _=m,k=function(e,t){return new Promise((function(n,r){function i(){void 0!==o&&e.removeListener("error",o),n([].slice.call(arguments))}var o;"error"!==t&&(o=function(n){e.removeListener(t,i),r(n)},e.once("error",o)),e.once(t,i)}))};m.EventEmitter=m,m.prototype._events=void 0,m.prototype._eventsCount=0,m.prototype._maxListeners=void 0;var G=10;function x(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function E(e){return void 0===e._maxListeners?m.defaultMaxListeners:e._maxListeners}function S(e,t,n,r){var i,o,a,u;if(x(n),void 0===(o=e._events)?(o=e._events=Object.create(null),e._eventsCount=0):(void 0!==o.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),o=e._events),a=o[t]),void 0===a)a=o[t]=n,++e._eventsCount;else if("function"==typeof a?a=o[t]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=E(e))>0&&a.length>i&&!a.warned){a.warned=!0;var d=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");d.name="MaxListenersExceededWarning",d.emitter=e,d.type=t,d.count=a.length,u=d,console&&console.warn&&console.warn(u)}return e}function A(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function L(e,t,n){var r={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=A.bind(r);return i.listener=n,r.wrapFn=i,i}function N(e,t,n){var r=e._events;if(void 0===r)return[];var i=r[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):j(i,i.length)}function D(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function j(e,t){for(var n=new Array(t),r=0;r<t;++r)n[r]=e[r];return n}function U(e){Object.defineProperty(this,"_next",{writable:!1,enumerable:!1,value:e}),this.done=!1}Object.defineProperty(m,"defaultMaxListeners",{enumerable:!0,get:function(){return G},set:function(e){if("number"!=typeof e||e<0||w(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");G=e}}),m.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},m.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||w(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},m.prototype.getMaxListeners=function(){return E(this)},m.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var r="error"===e,i=this._events;if(void 0!==i)r=r&&void 0===i.error;else if(!r)return!1;if(r){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var u=i[e];if(void 0===u)return!1;if("function"==typeof u)b(u,this,t);else{var d=u.length,c=j(u,d);for(n=0;n<d;++n)b(c[n],this,t)}return!0},m.prototype.addListener=function(e,t){return S(this,e,t,!1)},m.prototype.on=m.prototype.addListener,m.prototype.prependListener=function(e,t){return S(this,e,t,!0)},m.prototype.once=function(e,t){return x(t),this.on(e,L(this,e,t)),this},m.prototype.prependOnceListener=function(e,t){return x(t),this.prependListener(e,L(this,e,t)),this},m.prototype.removeListener=function(e,t){var n,r,i,o,a;if(x(t),void 0===(r=this._events))return this;if(void 0===(n=r[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete r[e],r.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===t||n[o].listener===t){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,i),1===n.length&&(r[e]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",e,a||t)}return this},m.prototype.off=m.prototype.removeListener,m.prototype.removeAllListeners=function(e){var t,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(r=t.length-1;r>=0;r--)this.removeListener(e,t[r]);return this},m.prototype.listeners=function(e){return N(this,e,!0)},m.prototype.rawListeners=function(e){return N(this,e,!1)},m.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):D.call(e,t)},m.prototype.listenerCount=D,m.prototype.eventNames=function(){return this._eventsCount>0?y(this._events):[]},_.once=k,U.prototype.next=function(){if(this.done)return{done:!0};var e=this._next();return e.done&&(this.done=!0),e},"undefined"!=typeof Symbol&&(U.prototype[Symbol.iterator]=function(){return this}),U.of=function(){var e=arguments,t=e.length,n=0;return new U((function(){return n>=t?{done:!0}:{done:!1,value:e[n++]}}))},U.empty=function(){var e=new U(null);return e.done=!0,e},U.is=function(e){return e instanceof U||"object"==typeof e&&null!==e&&"function"==typeof e.next};var O=U,C=function(e,t){for(var n,r=arguments.length>1?t:1/0,i=r!==1/0?new Array(r):[],o=0;;){if(o===r)return i;if((n=e.next()).done)return o!==t?i.slice(0,o):i;i[o++]=n.value}},K=function(e){function n(t,n){var r;return(r=e.call(this)||this).name="GraphError",r.message=t||"",r.data=n||{},r}return t(n,e),n}(a(Error)),z=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(i),n.prototype.constructor),i}return t(n,e),n}(K),M=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(i),n.prototype.constructor),i}return t(n,e),n}(K),P=function(e){function n(t,r){var i;return(i=e.call(this,t,r)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(i),n.prototype.constructor),i}return t(n,e),n}(K);function T(e,t){this.key=e,this.attributes=t,this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.directedSelfLoops=0,this.undirectedSelfLoops=0,this.in={},this.out={},this.undirected={}}function R(e,t){this.key=e,this.attributes=t,this.inDegree=0,this.outDegree=0,this.directedSelfLoops=0,this.in={},this.out={}}function F(e,t){this.key=e,this.attributes=t,this.undirectedDegree=0,this.undirectedSelfLoops=0,this.undirected={}}function I(e,t,n,r,i,o){this.key=t,this.attributes=o,this.undirected=e,this.source=r,this.target=i,this.generatedKey=n}function W(e,t,n,r,i,o,a){var u,d,c="out",s="in";if(t&&(c=s="undirected"),e.multi){if(void 0===(d=(u=o[c])[i])&&(d=new Set,u[i]=d),d.add(n),r===i&&t)return;void 0===(u=a[s])[r]&&(u[r]=d)}else{if(o[c][i]=n,r===i&&t)return;a[s][r]=n}}function Y(e,t,n){var r=e.multi,i=n.source,o=n.target,a=i.key,u=o.key,d=i[t?"undirected":"out"],c=t?"undirected":"in";if(u in d)if(r){var s=d[u];1===s.size?(delete d[u],delete o[c][a]):s.delete(n)}else delete d[u];r||delete o[c][a]}R.prototype.upgradeToMixed=function(){this.undirectedDegree=0,this.undirectedSelfLoops=0,this.undirected={}},F.prototype.upgradeToMixed=function(){this.inDegree=0,this.outDegree=0,this.directedSelfLoops=0,this.in={},this.out={}};var J=[{name:function(e){return"get".concat(e,"Attribute")},attacher:function(e,t,n){e.prototype[t]=function(e,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+r;if(r=arguments[2],!(i=c(this,o,a,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&i.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return i.attributes[r]}}},{name:function(e){return"get".concat(e,"Attributes")},attacher:function(e,t,n){e.prototype[t]=function(e){var r;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var i=""+e,o=""+arguments[1];if(!(r=c(this,i,o,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(i,'" - "').concat(o,'").'))}else if(e=""+e,!(r=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&r.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return r.attributes}}},{name:function(e){return"has".concat(e,"Attribute")},attacher:function(e,t,n){e.prototype[t]=function(e,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+r;if(r=arguments[2],!(i=c(this,o,a,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&i.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return i.attributes.hasOwnProperty(r)}}},{name:function(e){return"set".concat(e,"Attribute")},attacher:function(e,t,n){e.prototype[t]=function(e,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,u=""+r;if(r=arguments[2],i=arguments[3],!(o=c(this,a,u,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&o.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(e){return"update".concat(e,"Attribute")},attacher:function(e,t,n){e.prototype[t]=function(e,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+e,u=""+r;if(r=arguments[2],i=arguments[3],!(o=c(this,a,u,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else if(e=""+e,!(o=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("function"!=typeof i)throw new z("Graph.".concat(t,": updater should be a function."));if("mixed"!==n&&o.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(e){return"remove".concat(e,"Attribute")},attacher:function(e,t,n){e.prototype[t]=function(e,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+r;if(r=arguments[2],!(i=c(this,o,a,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if("mixed"!==n&&i.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}},{name:function(e){return"replace".concat(e,"Attributes")},attacher:function(e,t,n){e.prototype[t]=function(e,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+r;if(r=arguments[2],!(i=c(this,o,a,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if(!h(r))throw new z("Graph.".concat(t,": provided attributes are not a plain object."));if("mixed"!==n&&i.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}},{name:function(e){return"merge".concat(e,"Attributes")},attacher:function(e,t,n){e.prototype[t]=function(e,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new P("Graph.".concat(t,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new P("Graph.".concat(t,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+e,a=""+r;if(r=arguments[2],!(i=c(this,o,a,n)))throw new M("Graph.".concat(t,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else if(e=""+e,!(i=this._edges.get(e)))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" edge in the graph.'));if(!h(r))throw new z("Graph.".concat(t,": provided attributes are not a plain object."));if("mixed"!==n&&i.undirected!==("undirected"===n))throw new M("Graph.".concat(t,': could not find the "').concat(e,'" ').concat(n," edge in the graph."));return d(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}}];var q=function(){var e,t=arguments,n=-1;return new O((function r(){if(!e){if(++n>=t.length)return{done:!0};e=t[n]}var i=e.next();return i.done?(e=null,r()):i}))},B=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function H(e,t){for(var n in t)e.push(t[n].key)}function Q(e,t){for(var n in t)t[n].forEach((function(t){return e.push(t.key)}))}function V(e,t,n){for(var r in e)if(r!==n){var i=e[r];t(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected,i.generatedKey)}}function X(e,t,n){for(var r in e)r!==n&&e[r].forEach((function(e){return t(e.key,e.attributes,e.source.key,e.target.key,e.source.attributes,e.target.attributes,e.undirected,e.generatedKey)}))}function Z(e,t,n){for(var r in e)if(r!==n){var i=e[r];if(t(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected,i.generatedKey))return!0}return!1}function $(e,t,n){var r,i,o,a,u;for(var d in e)if(d!==n)for(r=e[d].values();!0!==(i=r.next()).done;)if(a=(o=i.value).source,u=o.target,t(o.key,o.attributes,a.key,u.key,a.attributes,u.attributes,o.undirected,o.generatedKey))return!0;return!1}function ee(e,t){var n=Object.keys(e),r=n.length,i=null,o=0;return new O((function a(){var u;if(i){var d=i.next();if(d.done)return i=null,o++,a();u=d.value}else{if(o>=r)return{done:!0};var c=n[o];if(c===t)return o++,a();if((u=e[c])instanceof Set)return i=u.values(),a();o++}return{done:!1,value:[u.key,u.attributes,u.source.key,u.target.key,u.source.attributes,u.target.attributes]}}))}function te(e,t,n){var r=t[n];r&&e.push(r.key)}function ne(e,t,n){var r=t[n];r&&r.forEach((function(t){return e.push(t.key)}))}function re(e,t,n){var r=e[t];if(r){var i=r.source,o=r.target;n(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected,r.generatedKey)}}function ie(e,t,n){var r=e[t];r&&r.forEach((function(e){return n(e.key,e.attributes,e.source.key,e.target.key,e.source.attributes,e.target.attributes,e.undirected,e.generatedKey)}))}function oe(e,t,n){var r=e[t];if(r){var i=r.source,o=r.target;return n(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected,r.generatedKey)}}function ae(e,t,n){var r=e[t];if(r){for(var i,o,a=r.values();!0!==(i=a.next()).done;)if(n((o=i.value).key,o.attributes,o.source.key,o.target.key,o.source.attributes,o.target.attributes,o.undirected,o.generatedKey))return!0;return!1}}function ue(e,t){var n=e[t];if(n instanceof Set){var r=n.values();return new O((function(){var e=r.next();if(e.done)return e;var t=e.value;return{done:!1,value:[t.key,t.attributes,t.source.key,t.target.key,t.source.attributes,t.target.attributes]}}))}return O.of([n.key,n.attributes,n.source.key,n.target.key,n.source.attributes,n.target.attributes])}function de(e,t){if(0===e.size)return[];if("mixed"===t||t===e.type)return"function"==typeof Array.from?Array.from(e._edges.keys()):C(e._edges.keys(),e._edges.size);for(var n,r,i="undirected"===t?e.undirectedSize:e.directedSize,o=new Array(i),a="undirected"===t,u=e._edges.values(),d=0;!0!==(n=u.next()).done;)(r=n.value).undirected===a&&(o[d++]=r.key);return o}function ce(e,t,n){if(0!==e.size)for(var r,i,o="mixed"!==t&&t!==e.type,a="undirected"===t,u=e._edges.values();!0!==(r=u.next()).done;)if(i=r.value,!o||i.undirected===a){var d=i,c=d.key,s=d.attributes,h=d.source,f=d.target;n(c,s,h.key,f.key,h.attributes,f.attributes,i.undirected,i.generatedKey)}}function se(e,t,n){if(0!==e.size)for(var r,i,o="mixed"!==t&&t!==e.type,a="undirected"===t,u=e._edges.values();!0!==(r=u.next()).done;)if(i=r.value,!o||i.undirected===a){var d=i,c=d.key,s=d.attributes,h=d.source,f=d.target;if(n(c,s,h.key,f.key,h.attributes,f.attributes,i.undirected,i.generatedKey))break}}function he(e,t){if(0===e.size)return O.empty();var n="mixed"!==t&&t!==e.type,r="undirected"===t,i=e._edges.values();return new O((function(){for(var e,t;;){if((e=i.next()).done)return e;if(t=e.value,!n||t.undirected===r)break}return{value:[t.key,t.attributes,t.source.key,t.target.key,t.source.attributes,t.target.attributes],done:!1}}))}function fe(e,t,n,r){var i=[],o=e?Q:H;return"undirected"!==t&&("out"!==n&&o(i,r.in),"in"!==n&&o(i,r.out),!n&&r.directedSelfLoops>0&&i.splice(i.lastIndexOf(r.key),1)),"directed"!==t&&o(i,r.undirected),i}function pe(e,t,n,r,i){var o=e?X:V;"undirected"!==t&&("out"!==n&&o(r.in,i),"in"!==n&&o(r.out,i,n?null:r.key)),"directed"!==t&&o(r.undirected,i)}function ge(e,t,n,r,i){var o=e?$:Z;if("undirected"!==t){if("out"!==n&&o(r.in,i))return;if("in"!==n&&o(r.out,i,n?null:r.key))return}"directed"===t||o(r.undirected,i)}function le(e,t,n){var r=O.empty();return"undirected"!==e&&("out"!==t&&void 0!==n.in&&(r=q(r,ee(n.in))),"in"!==t&&void 0!==n.out&&(r=q(r,ee(n.out,t?null:n.key)))),"directed"!==e&&void 0!==n.undirected&&(r=q(r,ee(n.undirected))),r}function ye(e,t,n,r,i){var o=t?ne:te,a=[];return"undirected"!==e&&(void 0!==r.in&&"out"!==n&&o(a,r.in,i),void 0!==r.out&&"in"!==n&&o(a,r.out,i),!n&&r.directedSelfLoops>0&&a.splice(a.lastIndexOf(r.key),1)),"directed"!==e&&void 0!==r.undirected&&o(a,r.undirected,i),a}function ve(e,t,n,r,i,o){var a=t?ie:re;"undirected"!==e&&(void 0!==r.in&&"out"!==n&&a(r.in,i,o),r.key!==i&&void 0!==r.out&&"in"!==n&&a(r.out,i,o)),"directed"!==e&&void 0!==r.undirected&&a(r.undirected,i,o)}function be(e,t,n,r,i,o){var a=t?ae:oe;if("undirected"!==e){if(void 0!==r.in&&"out"!==n&&a(r.in,i,o))return;if(r.key!==i&&void 0!==r.out&&"in"!==n&&a(r.out,i,o,n?null:r.key))return}"directed"===e||void 0===r.undirected||a(r.undirected,i,o)}function we(e,t,n,r){var i=O.empty();return"undirected"!==e&&(void 0!==n.in&&"out"!==t&&r in n.in&&(i=q(i,ue(n.in,r))),void 0!==n.out&&"in"!==t&&r in n.out&&(i=q(i,ue(n.out,r)))),"directed"!==e&&void 0!==n.undirected&&r in n.undirected&&(i=q(i,ue(n.undirected,r))),i}var me=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function _e(e,t){if(void 0!==t)for(var n in t)e.add(n)}function ke(e,t,n){if("mixed"!==e){if("undirected"===e)return Object.keys(n.undirected);if("string"==typeof t)return Object.keys(n[t])}var r=new Set;return"undirected"!==e&&("out"!==t&&_e(r,n.in),"in"!==t&&_e(r,n.out)),"directed"!==e&&_e(r,n.undirected),C(r.values(),r.size)}function Ge(e,t,n){for(var r in t){var i=t[r];i instanceof Set&&(i=i.values().next().value);var o=i.source,a=i.target,u=o===e?a:o;n(u.key,u.attributes)}}function xe(e,t,n,r){for(var i in n){var o=n[i];o instanceof Set&&(o=o.values().next().value);var a=o.source,u=o.target,d=a===t?u:a;e.has(d.key)||(e.add(d.key),r(d.key,d.attributes))}}function Ee(e,t,n){for(var r in t){var i=t[r];i instanceof Set&&(i=i.values().next().value);var o=i.source,a=i.target,u=o===e?a:o;if(n(u.key,u.attributes))return!0}return!1}function Se(e,t,n,r){for(var i in n){var o=n[i];o instanceof Set&&(o=o.values().next().value);var a=o.source,u=o.target,d=a===t?u:a;if(!e.has(d.key))if(e.add(d.key),r(d.key,d.attributes))return!0}return!1}function Ae(e,t){var n=Object.keys(t),r=n.length,i=0;return new O((function(){if(i>=r)return{done:!0};var o=t[n[i++]];o instanceof Set&&(o=o.values().next().value);var a=o.source,u=o.target,d=a===e?u:a;return{done:!1,value:[d.key,d.attributes]}}))}function Le(e,t,n){var r=Object.keys(n),i=r.length,o=0;return new O((function a(){if(o>=i)return{done:!0};var u=n[r[o++]];u instanceof Set&&(u=u.values().next().value);var d=u.source,c=u.target,s=d===t?c:d;return e.has(s.key)?a():(e.add(s.key),{done:!1,value:[s.key,s.attributes]})}))}function Ne(e,t,n,r,i){var o=e._nodes.get(r);if("undirected"!==t){if("out"!==n&&void 0!==o.in)for(var a in o.in)if(a===i)return!0;if("in"!==n&&void 0!==o.out)for(var u in o.out)if(u===i)return!0}if("directed"!==t&&void 0!==o.undirected)for(var d in o.undirected)if(d===i)return!0;return!1}function De(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);e.prototype[o]=function(e,t){if("mixed"===r||"mixed"===this.type||r===this.type){e=""+e;var n=this._nodes.get(e);if(void 0===n)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));!function(e,t,n,r){if("mixed"!==e){if("undirected"===e)return Ge(n,n.undirected,r);if("string"==typeof t)return Ge(n,n[t],r)}var i=new Set;"undirected"!==e&&("out"!==t&&xe(i,n,n.in,r),"in"!==t&&xe(i,n,n.out,r)),"directed"!==e&&xe(i,n,n.undirected,r)}("mixed"===r?this.type:r,i,n,t)}}}function je(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1)+"Until";e.prototype[o]=function(e,t){if("mixed"===r||"mixed"===this.type||r===this.type){e=""+e;var n=this._nodes.get(e);if(void 0===n)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));!function(e,t,n,r){if("mixed"!==e){if("undirected"===e)return Ee(n,n.undirected,r);if("string"==typeof t)return Ee(n,n[t],r)}var i=new Set;if("undirected"!==e){if("out"!==t&&Se(i,n,n.in,r))return;if("in"!==t&&Se(i,n,n.out,r))return}"directed"===e||Se(i,n,n.undirected,r)}("mixed"===r?this.type:r,i,n,t)}}}function Ue(e,t){var n=t.name,r=t.type,i=t.direction,o=n.slice(0,-1)+"Entries";e.prototype[o]=function(e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();e=""+e;var t=this._nodes.get(e);if(void 0===t)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return function(e,t,n){if("mixed"!==e){if("undirected"===e)return Ae(n,n.undirected);if("string"==typeof t)return Ae(n,n[t])}var r=O.empty(),i=new Set;return"undirected"!==e&&("out"!==t&&(r=q(r,Le(i,n,n.in))),"in"!==t&&(r=q(r,Le(i,n,n.out)))),"directed"!==e&&(r=q(r,Le(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,t)}}function Oe(e,t,n){for(var r,i,o,a,u,d,c,s=t._nodes.values(),h=t.type;!0!==(r=s.next()).done;){if(i=r.value,"undirected"!==h)for(o in a=i.out)if(d=(u=a[o]).target,c=n(i.key,d.key,i.attributes,d.attributes,u.key,u.attributes,u.undirected,u.generatedKey),e&&c)return;if("directed"!==h)for(o in a=i.undirected)if((d=(u=a[o]).target).key!==o&&(d=u.source),c=n(i.key,d.key,i.attributes,d.attributes,u.key,u.attributes,u.undirected,u.generatedKey),e&&c)return}}function Ce(e,t,n){for(var r,i,o,a,u,d,c,s,h,f=t._nodes.values(),p=t.type;!0!==(r=f.next()).done;){if(i=r.value,"undirected"!==p)for(o in d=i.out)for(a=d[o].values();!0!==(u=a.next()).done;)if(s=(c=u.value).target,h=n(i.key,s.key,i.attributes,s.attributes,c.key,c.attributes,c.undirected,c.generatedKey),e&&h)return;if("directed"!==p)for(o in d=i.undirected)for(a=d[o].values();!0!==(u=a.next()).done;)if((s=(c=u.value).target).key!==o&&(s=c.source),h=n(i.key,s.key,i.attributes,s.attributes,c.key,c.attributes,c.undirected,c.generatedKey),e&&h)return}}function Ke(e,t){var n={key:e};return f(t.attributes)||(n.attributes=d({},t.attributes)),n}function ze(e,t){var n={source:t.source.key,target:t.target.key};return t.generatedKey||(n.key=e),f(t.attributes)||(n.attributes=d({},t.attributes)),t.undirected&&(n.undirected=!0),n}function Me(e){return h(e)?"key"in e?!("attributes"in e)||h(e.attributes)&&null!==e.attributes?null:"invalid-attributes":"no-key":"not-object"}function Pe(e){return h(e)?"source"in e?"target"in e?!("attributes"in e)||h(e.attributes)&&null!==e.attributes?"undirected"in e&&"boolean"!=typeof e.undirected?"invalid-undirected":null:"invalid-attributes":"no-target":"no-source":"not-object"}var Te=new Set(["directed","undirected","mixed"]),Re=new Set(["domain","_events","_eventsCount","_maxListeners"]),Fe={allowSelfLoops:!0,edgeKeyGenerator:null,multi:!1,type:"mixed"};function Ie(e,t,n){var r=new e.NodeDataClass(t,n);return e._nodes.set(t,r),e.emit("nodeAdded",{key:t,attributes:n}),r}function We(e,t,n,r,i,o,a,u){if(!r&&"undirected"===e.type)throw new P("Graph.".concat(t,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===e.type)throw new P("Graph.".concat(t,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(u&&!h(u))throw new z("Graph.".concat(t,': invalid attributes. Expecting an object but got "').concat(u,'"'));if(o=""+o,a=""+a,u=u||{},!e.allowSelfLoops&&o===a)throw new P("Graph.".concat(t,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var d=e._nodes.get(o),c=e._nodes.get(a);if(!d)throw new M("Graph.".concat(t,': source node "').concat(o,'" not found.'));if(!c)throw new M("Graph.".concat(t,': target node "').concat(a,'" not found.'));var s={key:null,undirected:r,source:o,target:a,attributes:u};if(n&&(i=e._edgeKeyGenerator(s)),i=""+i,e._edges.has(i))throw new P("Graph.".concat(t,': the "').concat(i,'" edge already exists in the graph.'));if(!e.multi&&(r?void 0!==d.undirected[a]:void 0!==d.out[a]))throw new P("Graph.".concat(t,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var f=new I(r,i,n,d,c,u);return e._edges.set(i,f),o===a?r?(d.undirectedSelfLoops++,e._undirectedSelfLoopCount++):(d.directedSelfLoops++,e._directedSelfLoopCount++):r?(d.undirectedDegree++,c.undirectedDegree++):(d.outDegree++,c.inDegree++),W(e,r,f,o,a,d,c),r?e._undirectedSize++:e._directedSize++,s.key=i,e.emit("edgeAdded",s),i}function Ye(e,t,n,r,i,o,a,u,c){if(!r&&"undirected"===e.type)throw new P("Graph.".concat(t,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===e.type)throw new P("Graph.".concat(t,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(u)if(c){if("function"!=typeof u)throw new z("Graph.".concat(t,': invalid updater function. Expecting a function but got "').concat(u,'"'))}else if(!h(u))throw new z("Graph.".concat(t,': invalid attributes. Expecting an object but got "').concat(u,'"'));var s;if(o=""+o,a=""+a,c&&(s=u,u=void 0),!e.allowSelfLoops&&o===a)throw new P("Graph.".concat(t,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var f,p,g=e._nodes.get(o),l=e._nodes.get(a);if(!n&&(f=e._edges.get(i))){if(f.source.key!==o||f.target.key!==a||r&&(f.source.key!==a||f.target.key!==o))throw new P("Graph.".concat(t,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. ("').concat(f.source.key,'", "').concat(f.target.key,'").'));p=f}if(p||e.multi||!g||(p=r?g.undirected[a]:g.out[a]),p){if(c?!s:!u)return p.key;if(c){var y=p.attributes;p.attributes=s(y),e.emit("edgeAttributesUpdated",{type:"replace",key:p.key,attributes:p.attributes})}else d(p.attributes,u),e.emit("edgeAttributesUpdated",{type:"merge",key:p.key,attributes:p.attributes,data:u});return p.key}u=u||{},c&&s&&(u=s(u));var v={key:null,undirected:r,source:o,target:a,attributes:u};if(n&&(i=e._edgeKeyGenerator(v)),i=""+i,e._edges.has(i))throw new P("Graph.".concat(t,': the "').concat(i,'" edge already exists in the graph.'));return g||(g=Ie(e,o,{}),o===a&&(l=g)),l||(l=Ie(e,a,{})),f=new I(r,i,n,g,l,u),e._edges.set(i,f),o===a?r?(g.undirectedSelfLoops++,e._undirectedSelfLoopCount++):(g.directedSelfLoops++,e._directedSelfLoopCount++):r?(g.undirectedDegree++,l.undirectedDegree++):(g.outDegree++,l.inDegree++),W(e,r,f,o,a,g,l),r?e._undirectedSize++:e._directedSize++,v.key=i,e.emit("edgeAdded",v),i}var Je=function(e){function n(t){var n;if(n=e.call(this)||this,(t=d({},Fe,t)).edgeKeyGenerator&&"function"!=typeof t.edgeKeyGenerator)throw new z("Graph.constructor: invalid 'edgeKeyGenerator' option. Expecting a function but got \"".concat(t.edgeKeyGenerator,'".'));if("boolean"!=typeof t.multi)throw new z("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!Te.has(t.type))throw new z('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new z("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r,i="mixed"===t.type?T:"directed"===t.type?R:F;return p(u(n),"NodeDataClass",i),p(u(n),"_attributes",{}),p(u(n),"_nodes",new Map),p(u(n),"_edges",new Map),p(u(n),"_directedSize",0),p(u(n),"_undirectedSize",0),p(u(n),"_directedSelfLoopCount",0),p(u(n),"_undirectedSelfLoopCount",0),p(u(n),"_edgeKeyGenerator",t.edgeKeyGenerator||(r=0,function(){return"_geid".concat(r++,"_")})),p(u(n),"_options",t),Re.forEach((function(e){return p(u(n),e,n[e])})),g(u(n),"order",(function(){return n._nodes.size})),g(u(n),"size",(function(){return n._edges.size})),g(u(n),"directedSize",(function(){return n._directedSize})),g(u(n),"undirectedSize",(function(){return n._undirectedSize})),g(u(n),"selfLoopCount",(function(){return n._directedSelfLoopCount+n._undirectedSelfLoopCount})),g(u(n),"directedSelfLoopCount",(function(){return n._directedSelfLoopCount})),g(u(n),"undirectedSelfLoopCount",(function(){return n._undirectedSelfLoopCount})),g(u(n),"multi",n._options.multi),g(u(n),"type",n._options.type),g(u(n),"allowSelfLoops",n._options.allowSelfLoops),g(u(n),"implementation",(function(){return"graphology"})),n}t(n,e);var r=n.prototype;return r.hasNode=function(e){return this._nodes.has(""+e)},r.hasDirectedEdge=function(e,t){if("undirected"===this.type)return!1;if(1===arguments.length){var n=""+e,r=this._edges.get(n);return!!r&&!r.undirected}if(2===arguments.length){e=""+e,t=""+t;var i=this._nodes.get(e);if(!i)return!1;var o=i.out[t];return!!o&&(!this.multi||!!o.size)}throw new z("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.hasUndirectedEdge=function(e,t){if("directed"===this.type)return!1;if(1===arguments.length){var n=""+e,r=this._edges.get(n);return!!r&&r.undirected}if(2===arguments.length){e=""+e,t=""+t;var i=this._nodes.get(e);if(!i)return!1;var o=i.undirected[t];return!!o&&(!this.multi||!!o.size)}throw new z("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.hasEdge=function(e,t){if(1===arguments.length){var n=""+e;return this._edges.has(n)}if(2===arguments.length){e=""+e,t=""+t;var r=this._nodes.get(e);if(!r)return!1;var i=void 0!==r.out&&r.out[t];return i||(i=void 0!==r.undirected&&r.undirected[t]),!!i&&(!this.multi||!!i.size)}throw new z("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},r.directedEdge=function(e,t){if("undirected"!==this.type){if(e=""+e,t=""+t,this.multi)throw new P("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(e);if(!n)throw new M('Graph.directedEdge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M('Graph.directedEdge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.out&&n.out[t]||void 0;return r?r.key:void 0}},r.undirectedEdge=function(e,t){if("directed"!==this.type){if(e=""+e,t=""+t,this.multi)throw new P("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(e);if(!n)throw new M('Graph.undirectedEdge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M('Graph.undirectedEdge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.undirected&&n.undirected[t]||void 0;return r?r.key:void 0}},r.edge=function(e,t){if(this.multi)throw new P("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");e=""+e,t=""+t;var n=this._nodes.get(e);if(!n)throw new M('Graph.edge: could not find the "'.concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M('Graph.edge: could not find the "'.concat(t,'" target node in the graph.'));var r=n.out&&n.out[t]||n.undirected&&n.undirected[t]||void 0;if(r)return r.key},r.inDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new z('Graph.inDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.inDegree: could not find the "'.concat(e,'" node in the graph.'));if("undirected"===this.type)return 0;var r=t?n.directedSelfLoops:0;return n.inDegree+r},r.outDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new z('Graph.outDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.outDegree: could not find the "'.concat(e,'" node in the graph.'));if("undirected"===this.type)return 0;var r=t?n.directedSelfLoops:0;return n.outDegree+r},r.directedDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new z('Graph.directedDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.directedDegree: could not find the "'.concat(e,'" node in the graph.'));if("undirected"===this.type)return 0;var r=t?n.directedSelfLoops:0,i=n.inDegree+r,o=n.outDegree+r;return i+o},r.undirectedDegree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new z('Graph.undirectedDegree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.undirectedDegree: could not find the "'.concat(e,'" node in the graph.'));if("directed"===this.type)return 0;var r=t?n.undirectedSelfLoops:0;return n.undirectedDegree+2*r},r.degree=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if("boolean"!=typeof t)throw new z('Graph.degree: Expecting a boolean but got "'.concat(t,'" for the second parameter (allowing self-loops to be counted).'));e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.degree: could not find the "'.concat(e,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(t&&(i=n.undirectedSelfLoops),r+=n.undirectedDegree+2*i),"undirected"!==this.type&&(t&&(i=n.directedSelfLoops),r+=n.inDegree+n.outDegree+2*i),r},r.source=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.source: could not find the "'.concat(e,'" edge in the graph.'));return t.source.key},r.target=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.target: could not find the "'.concat(e,'" edge in the graph.'));return t.target.key},r.extremities=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.extremities: could not find the "'.concat(e,'" edge in the graph.'));return[t.source.key,t.target.key]},r.opposite=function(e,t){e=""+e,t=""+t;var n=this._edges.get(t);if(!n)throw new M('Graph.opposite: could not find the "'.concat(t,'" edge in the graph.'));var r=n.source.key,i=n.target.key;if(e!==r&&e!==i)throw new M('Graph.opposite: the "'.concat(e,'" node is not attached to the "').concat(t,'" edge (').concat(r,", ").concat(i,")."));return e===r?i:r},r.hasExtremity=function(e,t){e=""+e,t=""+t;var n=this._edges.get(e);if(!n)throw new M('Graph.hasExtremity: could not find the "'.concat(e,'" edge in the graph.'));return n.source.key===t||n.target.key===t},r.isUndirected=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.isUndirected: could not find the "'.concat(e,'" edge in the graph.'));return t.undirected},r.isDirected=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.isDirected: could not find the "'.concat(e,'" edge in the graph.'));return!t.undirected},r.isSelfLoop=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.isSelfLoop: could not find the "'.concat(e,'" edge in the graph.'));return t.source===t.target},r.hasGeneratedKey=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.hasGeneratedKey: could not find the "'.concat(e,'" edge in the graph.'));return t.generatedKey},r.addNode=function(e,t){return function(e,t,n){if(n&&!h(n))throw new z('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n,'"'));if(t=""+t,n=n||{},e._nodes.has(t))throw new P('Graph.addNode: the "'.concat(t,'" node already exist in the graph.'));var r=new e.NodeDataClass(t,n);return e._nodes.set(t,r),e.emit("nodeAdded",{key:t,attributes:n}),r}(this,e,t).key},r.mergeNode=function(e,t){if(t&&!h(t))throw new z('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(t,'"'));e=""+e,t=t||{};var n=this._nodes.get(e);return n?(t&&(d(n.attributes,t),this.emit("nodeAttributesUpdated",{type:"merge",key:e,attributes:n.attributes,data:t})),e):(n=new this.NodeDataClass(e,t),this._nodes.set(e,n),this.emit("nodeAdded",{key:e,attributes:t}),e)},r.updateNode=function(e,t){if(t&&"function"!=typeof t)throw new z('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(t,'"'));e=""+e;var n=this._nodes.get(e);if(n){if(t){var r=n.attributes;n.attributes=t(r),this.emit("nodeAttributesUpdated",{type:"replace",key:e,attributes:n.attributes})}return e}var i=t?t({}):{};return n=new this.NodeDataClass(e,i),this._nodes.set(e,n),this.emit("nodeAdded",{key:e,attributes:i}),e},r.dropNode=function(e){var t=this;e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.dropNode: could not find the "'.concat(e,'" node in the graph.'));this.forEachEdge(e,(function(e){t.dropEdge(e)})),this._nodes.delete(e),this.emit("nodeDropped",{key:e,attributes:n.attributes})},r.dropEdge=function(e){var t;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(t=c(this,n,r,this.type)))throw new M('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(e=""+e,!(t=this._edges.get(e)))throw new M('Graph.dropEdge: could not find the "'.concat(e,'" edge in the graph.'));this._edges.delete(t.key);var i=t,o=i.source,a=i.target,u=i.attributes,d=t.undirected;return o===a?d?(o.undirectedSelfLoops--,this._undirectedSelfLoopCount--):(o.directedSelfLoops--,this._directedSelfLoopCount--):d?(o.undirectedDegree--,a.undirectedDegree--):(o.outDegree--,a.inDegree--),Y(this,d,t),d?this._undirectedSize--:this._directedSize--,this.emit("edgeDropped",{key:e,attributes:u,source:o.key,target:a.key,undirected:d}),this},r.clear=function(){this._edges.clear(),this._nodes.clear(),this.emit("cleared")},r.clearEdges=function(){this._edges.clear(),this.clearIndex(),this.emit("edgesCleared")},r.getAttribute=function(e){return this._attributes[e]},r.getAttributes=function(){return this._attributes},r.hasAttribute=function(e){return this._attributes.hasOwnProperty(e)},r.setAttribute=function(e,t){return this._attributes[e]=t,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:e}),this},r.updateAttribute=function(e,t){if("function"!=typeof t)throw new z("Graph.updateAttribute: updater should be a function.");var n=this._attributes[e];return this._attributes[e]=t(n),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:e}),this},r.removeAttribute=function(e){return delete this._attributes[e],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:e}),this},r.replaceAttributes=function(e){if(!h(e))throw new z("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=e,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this},r.mergeAttributes=function(e){if(!h(e))throw new z("Graph.mergeAttributes: provided attributes are not a plain object.");return d(this._attributes,e),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:e}),this},r.getNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.getNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return n.attributes[t]},r.getNodeAttributes=function(e){e=""+e;var t=this._nodes.get(e);if(!t)throw new M('Graph.getNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));return t.attributes},r.hasNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.hasNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return n.attributes.hasOwnProperty(t)},r.setNodeAttribute=function(e,t,n){e=""+e;var r=this._nodes.get(e);if(!r)throw new M('Graph.setNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));if(arguments.length<3)throw new z("Graph.setNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or value, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.");return r.attributes[t]=n,this.emit("nodeAttributesUpdated",{key:e,type:"set",attributes:r.attributes,name:t}),this},r.updateNodeAttribute=function(e,t,n){e=""+e;var r=this._nodes.get(e);if(!r)throw new M('Graph.updateNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));if(arguments.length<3)throw new z("Graph.updateNodeAttribute: not enough arguments. Either you forgot to pass the attribute's name or updater, or you meant to use #.replaceNodeAttributes / #.mergeNodeAttributes instead.");if("function"!=typeof n)throw new z("Graph.updateAttribute: updater should be a function.");var i=r.attributes,o=n(i[t]);return i[t]=o,this.emit("nodeAttributesUpdated",{key:e,type:"set",attributes:r.attributes,name:t}),this},r.removeNodeAttribute=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.hasNodeAttribute: could not find the "'.concat(e,'" node in the graph.'));return delete n.attributes[t],this.emit("nodeAttributesUpdated",{key:e,type:"remove",attributes:n.attributes,name:t}),this},r.replaceNodeAttributes=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.replaceNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));if(!h(t))throw new z("Graph.replaceNodeAttributes: provided attributes are not a plain object.");return n.attributes=t,this.emit("nodeAttributesUpdated",{key:e,type:"replace",attributes:n.attributes}),this},r.mergeNodeAttributes=function(e,t){e=""+e;var n=this._nodes.get(e);if(!n)throw new M('Graph.mergeNodeAttributes: could not find the "'.concat(e,'" node in the graph.'));if(!h(t))throw new z("Graph.mergeNodeAttributes: provided attributes are not a plain object.");return d(n.attributes,t),this.emit("nodeAttributesUpdated",{key:e,type:"merge",attributes:n.attributes,data:t}),this},r.updateEachNodeAttributes=function(e,t){if("function"!=typeof e)throw new z("Graph.updateEachNodeAttributes: expecting an updater function.");if(t&&!l(t))throw new z("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._nodes.values();!0!==(n=i.next()).done;)(r=n.value).attributes=e(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:t||null})},r.updateEachEdgeAttributes=function(e,t){if("function"!=typeof e)throw new z("Graph.updateEachEdgeAttributes: expecting an updater function.");if(t&&!l(t))throw new z("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._edges.values();!0!==(n=i.next()).done;)(r=n.value).attributes=e(r.key,r.attributes);this.emit("eachEdgeAttributesUpdated",{hints:t||null})},r.forEach=function(e){if("function"!=typeof e)throw new z("Graph.forEach: expecting a callback.");this.multi?Ce(!1,this,e):Oe(!1,this,e)},r.forEachUntil=function(e){if("function"!=typeof e)throw new z("Graph.forEach: expecting a callback.");this.multi?Ce(!0,this,e):Oe(!0,this,e)},r.adjacency=function(){return this.multi?(o=(e=this)._nodes.values(),a=e.type,u="outer",d=null,new O((function e(){var c;if("outer"===u)return!0===(c=o.next()).done?c:(t=c.value,u="directed",e());if("directed"===u)return"undirected"===a?(u="undirected",e()):(r=t.out,n=Object.keys(t.out),i=0,u="inner-directed",e());if("undirected"===u){if("directed"===a)return u="outer",e();r=t.undirected,n=Object.keys(t.undirected),i=0,u="inner-undirected"}if(!d&&i>=n.length)return u="inner-undirected"===u?"outer":"undirected",e();if(!d){var s=n[i++];return d=r[s].values(),e()}if((c=d.next()).done)return d=null,e();var h=c.value,f=h.target;return"inner-undirected"===u&&f.key===t.key&&(f=h.source),{done:!1,value:[t.key,f.key,t.attributes,f.attributes,h.key,h.attributes]}}))):function(e){var t,n,r,i,o=e._nodes.values(),a=e.type,u="outer";return new O((function e(){var d;if("outer"===u)return!0===(d=o.next()).done?d:(t=d.value,u="directed",e());if("directed"===u)return"undirected"===a?(u="undirected",e()):(r=t.out,n=Object.keys(t.out),i=0,u="inner-directed",e());if("undirected"===u){if("directed"===a)return u="outer",e();r=t.undirected,n=Object.keys(t.undirected),i=0,u="inner-undirected"}if(i>=n.length)return u="inner-undirected"===u?"outer":"undirected",e();var c=n[i++],s=r[c],h=s.target;return"inner-undirected"===u&&h.key===t.key&&(h=s.source),{done:!1,value:[t.key,h.key,t.attributes,h.attributes,s.key,s.attributes]}}))}(this);var e,t,n,r,i,o,a,u,d},r.nodes=function(){return"function"==typeof Array.from?Array.from(this._nodes.keys()):C(this._nodes.keys(),this._nodes.size)},r.forEachNode=function(e){if("function"!=typeof e)throw new z("Graph.forEachNode: expecting a callback.");this._nodes.forEach((function(t,n){e(n,t.attributes)}))},r.forEachNodeUntil=function(e){if("function"!=typeof e)throw new z("Graph.forEachNode: expecting a callback.");for(var t,n,r=this._nodes.values();!0!==(t=r.next())&&!e((n=t.value).key,n.attributes););},r.nodeEntries=function(){var e=this._nodes.values();return new O((function(){var t=e.next();if(t.done)return t;var n=t.value;return{value:[n.key,n.attributes],done:!1}}))},r.exportNode=function(e){e=""+e;var t=this._nodes.get(e);if(!t)throw new M('Graph.exportNode: could not find the "'.concat(e,'" node in the graph.'));return Ke(e,t)},r.exportEdge=function(e){e=""+e;var t=this._edges.get(e);if(!t)throw new M('Graph.exportEdge: could not find the "'.concat(e,'" edge in the graph.'));return ze(e,t)},r.export=function(){var e=new Array(this._nodes.size),t=0;this._nodes.forEach((function(n,r){e[t++]=Ke(r,n)}));var n=new Array(this._edges.size);return t=0,this._edges.forEach((function(e,r){n[t++]=ze(r,e)})),{attributes:this.getAttributes(),nodes:e,edges:n,options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops}}},r.importNode=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Me(e);if(n){if("not-object"===n)throw new z('Graph.importNode: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if("no-key"===n)throw new z("Graph.importNode: no key provided.");if("invalid-attributes"===n)throw new z("Graph.importNode: invalid attributes. Attributes should be a plain object, null or omitted.")}var r=e.key,i=e.attributes,o=void 0===i?{}:i;return t?this.mergeNode(r,o):this.addNode(r,o),this},r.importEdge=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=Pe(e);if(n){if("not-object"===n)throw new z('Graph.importEdge: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if("no-source"===n)throw new z("Graph.importEdge: missing souce.");if("no-target"===n)throw new z("Graph.importEdge: missing target.");if("invalid-attributes"===n)throw new z("Graph.importEdge: invalid attributes. Attributes should be a plain object, null or omitted.");if("invalid-undirected"===n)throw new z("Graph.importEdge: invalid undirected. Undirected should be boolean or omitted.")}var r=e.source,i=e.target,o=e.attributes,a=void 0===o?{}:o,u=e.undirected,d=void 0!==u&&u;return"key"in e?(t?d?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:d?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,e.key,r,i,a):(t?d?this.mergeUndirectedEdge:this.mergeDirectedEdge:d?this.addUndirectedEdge:this.addDirectedEdge).call(this,r,i,a),this},r.import=function(e){var t,n,r,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(s(e))return this.import(e.export(),i),this;if(!h(e))throw new z("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(e.attributes){if(!h(e.attributes))throw new z("Graph.import: invalid attributes. Expecting a plain object.");i?this.mergeAttributes(e.attributes):this.replaceAttributes(e.attributes)}if(e.nodes){if(r=e.nodes,!Array.isArray(r))throw new z("Graph.import: invalid nodes. Expecting an array.");for(t=0,n=r.length;t<n;t++)this.importNode(r[t],i)}if(e.edges){if(r=e.edges,!Array.isArray(r))throw new z("Graph.import: invalid edges. Expecting an array.");for(t=0,n=r.length;t<n;t++)this.importEdge(r[t],i)}return this},r.nullCopy=function(e){return new n(d({},this._options,e))},r.emptyCopy=function(e){var t=this.nullCopy(e);return this._nodes.forEach((function(e,n){var r=d({},e.attributes);e=new t.NodeDataClass(n,r),t._nodes.set(n,e)})),t},r.copy=function(){var e=new n(this._options);return e.import(this),e},r.upgradeToMixed=function(){return"mixed"===this.type||(this._nodes.forEach((function(e){return e.upgradeToMixed()})),this._options.type="mixed",g(this,"type",this._options.type),p(this,"NodeDataClass",T)),this},r.upgradeToMulti=function(){return this.multi||(this._options.multi=!0,g(this,"multi",!0),(e=this)._nodes.forEach((function(t,n){if(t.out)for(var r in t.out){var i=new Set;i.add(t.out[r]),t.out[r]=i,e._nodes.get(r).in[n]=i}if(t.undirected)for(var o in t.undirected)if(!(o>n)){var a=new Set;a.add(t.undirected[o]),t.undirected[o]=a,e._nodes.get(o).undirected[n]=a}}))),this;var e},r.clearIndex=function(){return this._nodes.forEach((function(e){void 0!==e.in&&(e.in={},e.out={}),void 0!==e.undirected&&(e.undirected={})})),this},r.toJSON=function(){return this.export()},r.toString=function(){return"[object Graph]"},r.inspect=function(){var e=this,t={};this._nodes.forEach((function(e,n){t[n]=e.attributes}));var n={},r={};this._edges.forEach((function(t,i){var o=t.undirected?"--":"->",a="",u="(".concat(t.source.key,")").concat(o,"(").concat(t.target.key,")");t.generatedKey?e.multi&&(void 0===r[u]?r[u]=0:r[u]++,a+="".concat(r[u],". ")):a+="[".concat(i,"]: "),n[a+=u]=t.attributes}));var i={};for(var o in this)this.hasOwnProperty(o)&&!Re.has(o)&&"function"!=typeof this[o]&&(i[o]=this[o]);return i.attributes=this._attributes,i.nodes=t,i.edges=n,p(i,"constructor",this.constructor),i},n}(_.EventEmitter);"undefined"!=typeof Symbol&&(Je.prototype[Symbol.for("nodejs.util.inspect.custom")]=Je.prototype.inspect),[{name:function(e){return"".concat(e,"Edge")},generateKey:!0},{name:function(e){return"".concat(e,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(e){return"".concat(e,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(e){return"".concat(e,"EdgeWithKey")}},{name:function(e){return"".concat(e,"DirectedEdgeWithKey")},type:"directed"},{name:function(e){return"".concat(e,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(e){["add","merge","update"].forEach((function(t){var n=e.name(t),r="add"===t?We:Ye;e.generateKey?Je.prototype[n]=function(i,o,a){return r(this,n,!0,"undirected"===(e.type||this.type),null,i,o,a,"update"===t)}:Je.prototype[n]=function(i,o,a,u){return r(this,n,!1,"undirected"===(e.type||this.type),i,o,a,u,"update"===t)}}))})),"undefined"!=typeof Symbol&&(Je.prototype[Symbol.iterator]=Je.prototype.adjacency),function(e){J.forEach((function(t){var n=t.name,r=t.attacher;r(e,n("Edge"),"mixed"),r(e,n("DirectedEdge"),"directed"),r(e,n("UndirectedEdge"),"undirected")}))}(Je),function(e){B.forEach((function(t){!function(e,t){var n=t.name,r=t.type,i=t.direction;e.prototype[n]=function(e,t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(!arguments.length)return de(this,r);if(1===arguments.length){e=""+e;var o=this._nodes.get(e);if(void 0===o)throw new M("Graph.".concat(n,': could not find the "').concat(e,'" node in the graph.'));return fe(this.multi,"mixed"===r?this.type:r,i,o)}if(2===arguments.length){e=""+e,t=""+t;var a=this._nodes.get(e);if(!a)throw new M("Graph.".concat(n,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M("Graph.".concat(n,':  could not find the "').concat(t,'" target node in the graph.'));return ye(r,this.multi,i,a,t)}throw new z("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(e,t),function(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);e.prototype[o]=function(e,t,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return ce(this,r,n=e);if(2===arguments.length){e=""+e,n=t;var a=this._nodes.get(e);if(void 0===a)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return pe(this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){e=""+e,t=""+t;var u=this._nodes.get(e);if(!u)throw new M("Graph.".concat(o,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M("Graph.".concat(o,':  could not find the "').concat(t,'" target node in the graph.'));return ve(r,this.multi,i,u,t,n)}throw new z("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}}}(e,t),function(e,t){var n=t.name,r=t.type,i=t.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1)+"Until";e.prototype[o]=function(e,t,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return se(this,r,n=e);if(2===arguments.length){e=""+e,n=t;var a=this._nodes.get(e);if(void 0===a)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return ge(this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){e=""+e,t=""+t;var u=this._nodes.get(e);if(!u)throw new M("Graph.".concat(o,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M("Graph.".concat(o,':  could not find the "').concat(t,'" target node in the graph.'));return be(r,this.multi,i,u,t,n)}throw new z("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}}}(e,t),function(e,t){var n=t.name,r=t.type,i=t.direction,o=n.slice(0,-1)+"Entries";e.prototype[o]=function(e,t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();if(!arguments.length)return he(this,r);if(1===arguments.length){e=""+e;var n=this._nodes.get(e);if(!n)throw new M("Graph.".concat(o,': could not find the "').concat(e,'" node in the graph.'));return le(r,i,n)}if(2===arguments.length){e=""+e,t=""+t;var a=this._nodes.get(e);if(!a)throw new M("Graph.".concat(o,':  could not find the "').concat(e,'" source node in the graph.'));if(!this._nodes.has(t))throw new M("Graph.".concat(o,':  could not find the "').concat(t,'" target node in the graph.'));return we(r,i,a,t)}throw new z("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(e,t)}))}(Je),function(e){me.forEach((function(t){!function(e,t){var n=t.name,r=t.type,i=t.direction;e.prototype[n]=function(e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(2===arguments.length){var t=""+arguments[0],o=""+arguments[1];if(!this._nodes.has(t))throw new M("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));if(!this._nodes.has(o))throw new M("Graph.".concat(n,': could not find the "').concat(o,'" node in the graph.'));return Ne(this,r,i,t,o)}if(1===arguments.length){e=""+e;var a=this._nodes.get(e);if(void 0===a)throw new M("Graph.".concat(n,': could not find the "').concat(e,'" node in the graph.'));return ke("mixed"===r?this.type:r,i,a)}throw new z("Graph.".concat(n,": invalid number of arguments (expecting 1 or 2 and got ").concat(arguments.length,")."))}}(e,t),De(e,t),je(e,t),Ue(e,t)}))}(Je);var qe=function(e){function n(t){var n=d({type:"directed"},t);if("multi"in n&&!1!==n.multi)throw new z("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("directed"!==n.type)throw new z('DirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return e.call(this,n)||this}return t(n,e),n}(Je),Be=function(e){function n(t){var n=d({type:"undirected"},t);if("multi"in n&&!1!==n.multi)throw new z("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("undirected"!==n.type)throw new z('UndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return e.call(this,n)||this}return t(n,e),n}(Je),He=function(e){function n(t){var n=d({multi:!0},t);if("multi"in n&&!0!==n.multi)throw new z("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");return e.call(this,n)||this}return t(n,e),n}(Je),Qe=function(e){function n(t){var n=d({type:"directed",multi:!0},t);if("multi"in n&&!0!==n.multi)throw new z("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("directed"!==n.type)throw new z('MultiDirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return e.call(this,n)||this}return t(n,e),n}(Je),Ve=function(e){function n(t){var n=d({type:"undirected",multi:!0},t);if("multi"in n&&!0!==n.multi)throw new z("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("undirected"!==n.type)throw new z('MultiUndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return e.call(this,n)||this}return t(n,e),n}(Je);function Xe(e){e.from=function(t,n){var r=d({},t.options,n),i=new e(r);return i.import(t),i}}return Xe(Je),Xe(qe),Xe(Be),Xe(He),Xe(Qe),Xe(Ve),Je.Graph=Je,Je.DirectedGraph=qe,Je.UndirectedGraph=Be,Je.MultiGraph=He,Je.MultiDirectedGraph=Qe,Je.MultiUndirectedGraph=Ve,Je.InvalidArgumentsGraphError=z,Je.NotFoundGraphError=M,Je.UsageGraphError=P,Je}));
//# sourceMappingURL=graphology.umd.min.js.map


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});