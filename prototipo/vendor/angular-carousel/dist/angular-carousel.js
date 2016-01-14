angular.module("angular-carousel",["ngTouch","angular-carousel.shifty"]),angular.module("angular-carousel").directive("rnCarouselAutoSlide",["$interval",function(t){return{restrict:"A",link:function(e,n,r){var i=function(){e.autoSlider&&(t.cancel(e.autoSlider),e.autoSlider=null)},a=function(){e.autoSlide()};e.$watch("carouselIndex",a),r.hasOwnProperty("rnCarouselPauseOnHover")&&"false"!==r.rnCarouselPauseOnHover&&(n.on("mouseenter",i),n.on("mouseleave",a)),e.$on("$destroy",function(){i(),n.off("mouseenter",i),n.off("mouseleave",a)})}}}]),angular.module("angular-carousel").directive("rnCarouselIndicators",["$parse",function(t){return{restrict:"A",scope:{slides:"=",index:"=rnCarouselIndex"},templateUrl:"carousel-indicators.html",link:function(e,n,r){var i=t(r.rnCarouselIndex);e.goToSlide=function(t){i.assign(e.$parent.$parent,t)}}}}]),angular.module("angular-carousel").run(["$templateCache",function(t){t.put("carousel-indicators.html",'<div class="rn-carousel-indicator">\n<span ng-repeat="slide in slides" ng-class="{active: $index==index}" ng-click="goToSlide($index)">●</span></div>')}]),function(){"use strict";angular.module("angular-carousel").service("DeviceCapabilities",function(){function t(){var t="transform",e="webkitTransform";return"undefined"!=typeof document.body.style[t]?["webkit","moz","o","ms"].every(function(e){var n="-"+e+"-transform";return"undefined"!=typeof document.body.style[n]?(t=n,!1):!0}):t="undefined"!=typeof document.body.style[e]?"-webkit-transform":void 0,t}function e(){var t,e=document.createElement("p"),n={webkitTransform:"-webkit-transform",msTransform:"-ms-transform",transform:"transform"};document.body.insertBefore(e,null);for(var r in n)void 0!==e.style[r]&&(e.style[r]="translate3d(1px,1px,1px)",t=window.getComputedStyle(e).getPropertyValue(n[r]));return document.body.removeChild(e),void 0!==t&&t.length>0&&"none"!==t}return{has3d:e(),transformProperty:t()}}).service("computeCarouselSlideStyle",["DeviceCapabilities",function(t){return function(e,n,r){var i,a={display:"inline-block"},o=100*e+n,u=t.has3d?"translate3d("+o+"%, 0, 0)":"translate3d("+o+"%, 0)",s=(100-Math.abs(o))/100;if(t.transformProperty)if("fadeAndSlide"==r)a[t.transformProperty]=u,i=0,Math.abs(o)<100&&(i=.3+.7*s),a.opacity=i;else if("hexagon"==r){var c=100,l=0,f=60*(s-1);c=-100*e>n?100:0,l=-100*e>n?f:-f,a[t.transformProperty]=u+" rotateY("+l+"deg)",a[t.transformProperty+"-origin"]=c+"% 50%"}else if("zoom"==r){a[t.transformProperty]=u;var h=1;Math.abs(o)<100&&(h=1+2*(1-s)),a[t.transformProperty]+=" scale("+h+")",a[t.transformProperty+"-origin"]="50% 50%",i=0,Math.abs(o)<100&&(i=.3+.7*s),a.opacity=i}else a[t.transformProperty]=u;else a["margin-left"]=o+"%";return a}}]).service("createStyleString",function(){return function(t){var e=[];return angular.forEach(t,function(t,n){e.push(n+":"+t)}),e.join(";")}}).directive("rnCarousel",["$swipe","$window","$document","$parse","$compile","$timeout","$interval","computeCarouselSlideStyle","createStyleString","Tweenable",function(t,e,n,r,i,a,o,u,s,c){function l(t,e,n){var r=n;return t.every(function(t,n){return angular.equals(t,e)?(r=n,!1):!0}),r}var f=0;e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame;return{restrict:"A",scope:!0,compile:function(h,d){var p,m,g=h[0].querySelector("li"),v=g?g.attributes:[],w=!1,y=!1;return["ng-repeat","data-ng-repeat","ng:repeat","x-ng-repeat"].every(function(t){var e=v[t];if(angular.isDefined(e)){var n=e.value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),r=n[3];if(p=n[1],m=n[2],p)return angular.isDefined(d.rnCarouselBuffered)&&(y=!0,e.value=p+" in "+m+"|carouselSlice:carouselBufferIndex:carouselBufferSize",r&&(e.value+=" track by "+r)),w=!0,!1}return!0}),function(h,d,p,g){function v(){return d[0].querySelectorAll("ul[rn-carousel] > li")}function _(t){R=!0,F({x:t.clientX,y:t.clientY},t)}function S(t){var e=100*h.carouselBufferIndex+t;angular.forEach(v(),function(t,n){t.style.cssText=s(u(n,e,q.transitionType))})}function I(t,e){if(void 0===t&&(t=h.carouselIndex),e=e||{},e.animate===!1||"none"===q.transitionType)return Y=!1,E=-100*t,h.carouselIndex=t,void P();Y=!0;var n=new c;n.tween({from:{x:E},to:{x:-100*t},duration:q.transitionDuration,easing:q.transitionEasing,step:function(t){S(t.x)},finish:function(){h.$apply(function(){h.carouselIndex=t,E=-100*t,P(),a(function(){Y=!1},0,!1)})}})}function x(){var t=d[0].getBoundingClientRect();return t.width?t.width:t.right-t.left}function b(){H=x()}function C(){j||(j=!0,n.bind("mouseup",_))}function M(){j&&(j=!1,n.unbind("mouseup",_))}function T(t,e){return Y||N.length<=1?void 0:(b(),Q=d[0].querySelector("li").getBoundingClientRect().left,$=!0,O=t.x,!1)}function k(t,e){var n,r;if(C(),$&&(n=t.x,r=O-n,r>2||-2>r)){R=!0;var i=E+100*-r/H;S(i)}return!1}function F(t,e,n){if((!e||R)&&(M(),$=!1,R=!1,D=O-t.x,0!==D&&!Y))if(E+=100*-D/H,q.isSequential){var r=q.moveTreshold*H,i=-D,a=-Math[i>=0?"ceil":"floor"](i/H),o=Math.abs(i)>r;N&&a+h.carouselIndex>=N.length&&(a=N.length-1-h.carouselIndex),a+h.carouselIndex<0&&(a=-h.carouselIndex);var u=o?a:0;D=h.carouselIndex+u,I(D)}else h.$apply(function(){h.carouselIndex=parseInt(-E/100,10),P()})}function P(){var t=0,e=(h.carouselBufferSize-1)/2;y?(t=h.carouselIndex<=e?0:N&&N.length<h.carouselBufferSize?0:N&&h.carouselIndex>N.length-h.carouselBufferSize?N.length-h.carouselBufferSize:h.carouselIndex-e,h.carouselBufferIndex=t,a(function(){S(E)},0,!1)):a(function(){S(E)},0,!1)}function A(){b(),I()}f++;var $,O,D,B={transitionType:p.rnCarouselTransition||"slide",transitionEasing:p.rnCarouselEasing||"easeTo",transitionDuration:parseInt(p.rnCarouselDuration,10)||300,isSequential:!0,autoSlideDuration:3,bufferSize:5,moveTreshold:.1},q=angular.extend({},B),z=!1,E=0,R=!1,N=[],H=null,Q=null,j=!1,Y=!1;t.bind(d,{start:T,move:k,end:F,cancel:function(t){F({},t)}}),h.nextSlide=function(t){var e=h.carouselIndex+1;e>N.length-1&&(e=0),Y||I(e,t)},h.prevSlide=function(t){var e=h.carouselIndex-1;0>e&&(e=N.length-1),I(e,t)};var L=!0;if(h.carouselIndex=0,w||(N=[],angular.forEach(v(),function(t,e){N.push({id:e})})),void 0!==p.rnCarouselControls){var U=w?m.replace("::","")+".length - 1":N.length-1,W='<div class="rn-carousel-controls">\n  <span class="rn-carousel-control rn-carousel-control-prev" ng-click="prevSlide()" ng-if="carouselIndex > 0"></span>\n  <span class="rn-carousel-control rn-carousel-control-next" ng-click="nextSlide()" ng-if="carouselIndex < '+U+'"></span>\n</div>';d.append(i(angular.element(W))(h))}if(void 0!==p.rnCarouselAutoSlide){var G=parseInt(p.rnCarouselAutoSlide,10)||q.autoSlideDuration;h.autoSlide=function(){h.autoSlider&&(o.cancel(h.autoSlider),h.autoSlider=null),h.autoSlider=o(function(){Y||$||h.nextSlide()},1e3*G)}}if(p.rnCarouselIndex){var V=function(t){X.assign(h.$parent,t)},X=r(p.rnCarouselIndex);angular.isFunction(X.assign)?(h.$watch("carouselIndex",function(t){V(t)}),h.$parent.$watch(X,function(t,e){void 0!==t&&null!==t&&(N&&t>=N.length?(t=N.length-1,V(t)):N&&0>t&&(t=0,V(t)),Y||I(t,{animate:!L}),L=!1)}),z=!0):isNaN(p.rnCarouselIndex)||I(parseInt(p.rnCarouselIndex,10),{animate:!1})}else I(0,{animate:!L}),L=!1;if(p.rnCarouselLocked&&h.$watch(p.rnCarouselLocked,function(t,e){Y=t===!0?!0:!1}),w){var J=void 0!==p.rnCarouselDeepWatch;h[J?"$watch":"$watchCollection"](m,function(t,e){if(N=t,J&&angular.isArray(t)){var n=e[h.carouselIndex],r=l(t,n,h.carouselIndex);I(r,{animate:!1})}else I(h.carouselIndex,{animate:!1})},!0)}h.$on("$destroy",function(){M()}),h.carouselBufferIndex=0,h.carouselBufferSize=q.bufferSize;var K=angular.element(e);K.bind("orientationchange",A),K.bind("resize",A),h.$on("$destroy",function(){M(),K.unbind("orientationchange",A),K.unbind("resize",A)})}}}}])}(),angular.module("angular-carousel.shifty",[]).factory("Tweenable",function(){return function(t){var e=function(){"use strict";function e(){}function n(t,e){var n;for(n in t)Object.hasOwnProperty.call(t,n)&&e(n)}function r(t,e){return n(e,function(n){t[n]=e[n]}),t}function i(t,e){n(e,function(n){"undefined"==typeof t[n]&&(t[n]=e[n])})}function a(t,e,n,r,i,a,u){var s,c=(t-a)/i;for(s in e)e.hasOwnProperty(s)&&(e[s]=o(n[s],r[s],f[u[s]],c));return e}function o(t,e,n,r){return t+(e-t)*n(r)}function u(t,e){var r=l.prototype.filter,i=t._filterArgs;n(r,function(n){"undefined"!=typeof r[n][e]&&r[n][e].apply(t,i)})}function s(t,e,n,r,i,o,s,c,l){w=e+n,y=Math.min(v(),w),_=y>=w,S=n-(w-y),t.isPlaying()&&!_?(t._scheduleId=l(t._timeoutHandler,m),u(t,"beforeTween"),a(y,r,i,o,n,e,s),u(t,"afterTween"),c(r,t._attachment,S)):_&&(c(o,t._attachment,S),t.stop(!0))}function c(t,e){var r={};return"string"==typeof e?n(t,function(t){r[t]=e}):n(t,function(t){r[t]||(r[t]=e[t]||d)}),r}function l(t,e){this._currentState=t||{},this._configured=!1,this._scheduleFunction=h,"undefined"!=typeof e&&this.setConfig(e)}var f,h,d="linear",p=500,m=1e3/60,g=Date.now?Date.now:function(){return+new Date},v="undefined"!=typeof SHIFTY_DEBUG_NOW?SHIFTY_DEBUG_NOW:g;h="undefined"!=typeof window?window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||window.mozCancelRequestAnimationFrame&&window.mozRequestAnimationFrame||setTimeout:setTimeout;var w,y,_,S;return l.prototype.tween=function(t){return this._isTweening?this:(void 0===t&&this._configured||this.setConfig(t),this._timestamp=v(),this._start(this.get(),this._attachment),this.resume())},l.prototype.setConfig=function(t){t=t||{},this._configured=!0,this._attachment=t.attachment,this._pausedAtTime=null,this._scheduleId=null,this._start=t.start||e,this._step=t.step||e,this._finish=t.finish||e,this._duration=t.duration||p,this._currentState=t.from||this.get(),this._originalState=this.get(),this._targetState=t.to||this.get();var n=this._currentState,r=this._targetState;return i(r,n),this._easing=c(n,t.easing||d),this._filterArgs=[n,this._originalState,r,this._easing],u(this,"tweenCreated"),this},l.prototype.get=function(){return r({},this._currentState)},l.prototype.set=function(t){this._currentState=t},l.prototype.pause=function(){return this._pausedAtTime=v(),this._isPaused=!0,this},l.prototype.resume=function(){this._isPaused&&(this._timestamp+=v()-this._pausedAtTime),this._isPaused=!1,this._isTweening=!0;var t=this;return this._timeoutHandler=function(){s(t,t._timestamp,t._duration,t._currentState,t._originalState,t._targetState,t._easing,t._step,t._scheduleFunction)},this._timeoutHandler(),this},l.prototype.seek=function(t){return this._timestamp=v()-t,this.isPlaying()||(this._isTweening=!0,this._isPaused=!1,s(this,this._timestamp,this._duration,this._currentState,this._originalState,this._targetState,this._easing,this._step,this._scheduleFunction),this._timeoutHandler(),this.pause()),this},l.prototype.stop=function(n){return this._isTweening=!1,this._isPaused=!1,this._timeoutHandler=e,(t.cancelAnimationFrame||t.webkitCancelAnimationFrame||t.oCancelAnimationFrame||t.msCancelAnimationFrame||t.mozCancelRequestAnimationFrame||t.clearTimeout)(this._scheduleId),n&&(r(this._currentState,this._targetState),u(this,"afterTweenEnd"),this._finish.call(this,this._currentState,this._attachment)),this},l.prototype.isPlaying=function(){return this._isTweening&&!this._isPaused},l.prototype.setScheduleFunction=function(t){this._scheduleFunction=t},l.prototype.dispose=function(){var t;for(t in this)this.hasOwnProperty(t)&&delete this[t]},l.prototype.filter={},l.prototype.formula={linear:function(t){return t}},f=l.prototype.formula,r(l,{now:v,each:n,tweenProps:a,tweenProp:o,applyFilter:u,shallowCopy:r,defaults:i,composeEasingObject:c}),t.Tweenable=l,l}();!function(){e.shallowCopy(e.prototype.formula,{easeInQuad:function(t){return Math.pow(t,2)},easeOutQuad:function(t){return-(Math.pow(t-1,2)-1)},easeInOutQuad:function(t){return(t/=.5)<1?.5*Math.pow(t,2):-.5*((t-=2)*t-2)},easeInCubic:function(t){return Math.pow(t,3)},easeOutCubic:function(t){return Math.pow(t-1,3)+1},easeInOutCubic:function(t){return(t/=.5)<1?.5*Math.pow(t,3):.5*(Math.pow(t-2,3)+2)},easeInQuart:function(t){return Math.pow(t,4)},easeOutQuart:function(t){return-(Math.pow(t-1,4)-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeInQuint:function(t){return Math.pow(t,5)},easeOutQuint:function(t){return Math.pow(t-1,5)+1},easeInOutQuint:function(t){return(t/=.5)<1?.5*Math.pow(t,5):.5*(Math.pow(t-2,5)+2)},easeInSine:function(t){return-Math.cos(t*(Math.PI/2))+1},easeOutSine:function(t){return Math.sin(t*(Math.PI/2))},easeInOutSine:function(t){return-.5*(Math.cos(Math.PI*t)-1)},easeInExpo:function(t){return 0===t?0:Math.pow(2,10*(t-1))},easeOutExpo:function(t){return 1===t?1:-Math.pow(2,-10*t)+1},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return-(Math.sqrt(1-t*t)-1)},easeOutCirc:function(t){return Math.sqrt(1-Math.pow(t-1,2))},easeInOutCirc:function(t){return(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeOutBounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},easeInBack:function(t){var e=1.70158;return t*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack:function(t){var e=1.70158;return(t/=.5)<1?.5*(t*t*(((e*=1.525)+1)*t-e)):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},elastic:function(t){return-1*Math.pow(4,-8*t)*Math.sin((6*t-1)*(2*Math.PI)/2)+1},swingFromTo:function(t){var e=1.70158;return(t/=.5)<1?.5*(t*t*(((e*=1.525)+1)*t-e)):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},swingFrom:function(t){var e=1.70158;return t*t*((e+1)*t-e)},swingTo:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},bounce:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},bouncePast:function(t){return 1/2.75>t?7.5625*t*t:2/2.75>t?2-(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?2-(7.5625*(t-=2.25/2.75)*t+.9375):2-(7.5625*(t-=2.625/2.75)*t+.984375)},easeFromTo:function(t){return(t/=.5)<1?.5*Math.pow(t,4):-.5*((t-=2)*Math.pow(t,3)-2)},easeFrom:function(t){return Math.pow(t,4)},easeTo:function(t){return Math.pow(t,.25)}})}(),function(){function t(t,e,n,r,i,a){function o(t){return((d*t+p)*t+m)*t}function u(t){return((g*t+v)*t+w)*t}function s(t){return(3*d*t+2*p)*t+m}function c(t){return 1/(200*t)}function l(t,e){return u(h(t,e))}function f(t){return t>=0?t:0-t}function h(t,e){var n,r,i,a,u,c;for(i=t,c=0;8>c;c++){if(a=o(i)-t,f(a)<e)return i;if(u=s(i),f(u)<1e-6)break;i-=a/u}if(n=0,r=1,i=t,n>i)return n;if(i>r)return r;for(;r>n;){if(a=o(i),f(a-t)<e)return i;t>a?n=i:r=i,i=.5*(r-n)+n}return i}var d=0,p=0,m=0,g=0,v=0,w=0;return m=3*e,p=3*(r-e)-m,d=1-m-p,w=3*n,v=3*(i-n)-w,g=1-w-v,l(t,c(a))}function n(e,n,r,i){return function(a){return t(a,e,n,r,i,1)}}e.setBezierFunction=function(t,r,i,a,o){var u=n(r,i,a,o);return u.x1=r,u.y1=i,u.x2=a,u.y2=o,e.prototype.formula[t]=u},e.unsetBezierFunction=function(t){delete e.prototype.formula[t]}}(),function(){function t(t,n,r,i,a){return e.tweenProps(i,n,t,r,1,0,a)}var n=new e;n._filterArgs=[],e.interpolate=function(r,i,a,o){var u=e.shallowCopy({},r),s=e.composeEasingObject(r,o||"linear");n.set({});var c=n._filterArgs;c.length=0,c[0]=u,c[1]=r,c[2]=i,c[3]=s,e.applyFilter(n,"tweenCreated"),e.applyFilter(n,"beforeTween");var l=t(r,u,i,a,s);return e.applyFilter(n,"afterTween"),l}}(),function(t){function e(t,e){T.length=0;var n,r=t.length;for(n=0;r>n;n++)T.push("_"+e+"_"+n);return T}function n(t){var e=t.match(S);return e?(1===e.length||t[0].match(_))&&e.unshift(""):e=["",""],e.join(M)}function r(e){t.each(e,function(t){var n=e[t];"string"==typeof n&&n.match(C)&&(e[t]=i(n))})}function i(t){return s(C,t,a)}function a(t){var e=o(t);return"rgb("+e[0]+","+e[1]+","+e[2]+")"}function o(t){return t=t.replace(/#/,""),3===t.length&&(t=t.split(""),t=t[0]+t[0]+t[1]+t[1]+t[2]+t[2]),k[0]=u(t.substr(0,2)),k[1]=u(t.substr(2,2)),k[2]=u(t.substr(4,2)),k}function u(t){return parseInt(t,16)}function s(t,e,n){var r=e.match(t),i=e.replace(t,M);if(r)for(var a,o=r.length,u=0;o>u;u++)a=r.shift(),i=i.replace(M,n(a));return i}function c(t){return s(x,t,l)}function l(t){for(var e=t.match(I),n=e.length,r=t.match(b)[0],i=0;n>i;i++)r+=parseInt(e[i],10)+",";return r=r.slice(0,-1)+")"}function f(r){var i={};return t.each(r,function(t){var a=r[t];if("string"==typeof a){var o=v(a);i[t]={formatString:n(a),chunkNames:e(o,t)}}}),i}function h(e,n){t.each(n,function(t){for(var r=e[t],i=v(r),a=i.length,o=0;a>o;o++)e[n[t].chunkNames[o]]=+i[o];delete e[t]})}function d(e,n){t.each(n,function(t){var r=e[t],i=p(e,n[t].chunkNames),a=m(i,n[t].chunkNames);r=g(n[t].formatString,a),e[t]=c(r)})}function p(t,e){for(var n,r={},i=e.length,a=0;i>a;a++)n=e[a],r[n]=t[n],delete t[n];return r}function m(t,e){F.length=0;for(var n=e.length,r=0;n>r;r++)F.push(t[e[r]]);return F}function g(t,e){for(var n=t,r=e.length,i=0;r>i;i++)n=n.replace(M,+e[i].toFixed(4));return n}function v(t){return t.match(I)}function w(e,n){t.each(n,function(t){for(var r=n[t],i=r.chunkNames,a=i.length,o=e[t].split(" "),u=o[o.length-1],s=0;a>s;s++)e[i[s]]=o[s]||u;delete e[t]})}function y(e,n){t.each(n,function(t){for(var r=n[t],i=r.chunkNames,a=i.length,o="",u=0;a>u;u++)o+=" "+e[i[u]],delete e[i[u]];e[t]=o.substr(1)})}var _=/(\d|\-|\.)/,S=/([^\-0-9\.]+)/g,I=/[0-9.\-]+/g,x=new RegExp("rgb\\("+I.source+/,\s*/.source+I.source+/,\s*/.source+I.source+"\\)","g"),b=/^.*\(/,C=/#([0-9]|[a-f]){3,6}/gi,M="VAL",T=[],k=[],F=[];t.prototype.filter.token={tweenCreated:function(t,e,n,i){r(t),r(e),r(n),this._tokenData=f(t)},beforeTween:function(t,e,n,r){w(r,this._tokenData),h(t,this._tokenData),h(e,this._tokenData),h(n,this._tokenData)},afterTween:function(t,e,n,r){d(t,this._tokenData),d(e,this._tokenData),d(n,this._tokenData),y(r,this._tokenData)}}}(e)}(window),window.Tweenable}),function(){"use strict";angular.module("angular-carousel").filter("carouselSlice",function(){return function(t,e,n){return angular.isArray(t)?t.slice(e,e+n):angular.isObject(t)?t:void 0}})}();