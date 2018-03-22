(function(t){"use strict";if("function"==typeof bootstrap)bootstrap("promise",t);else if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else if("undefined"!=typeof ses)ses.ok()&&(ses.makeQ=t);else{if("undefined"==typeof window&&"undefined"==typeof self)throw new Error("This environment was not anticipated by Q. Please file a bug.");var n="undefined"!=typeof window?window:self,e=n.Q;n.Q=t(),n.Q.noConflict=function(){return n.Q=e,this}}})(function(){"use strict";function t(t){return function(){return z.apply(t,arguments)}}function n(t){return t===Object(t)}function e(t){return"[object StopIteration]"===et(t)||t instanceof G}function r(t,n){if($&&n.stack&&"object"==typeof t&&null!==t&&t.stack){for(var e=[],r=n;r;r=r.source)r.stack&&(!t.__minimumStackCounter__||t.__minimumStackCounter__>r.stackCounter)&&(Z(t,"__minimumStackCounter__",{value:r.stackCounter,configurable:!0}),e.unshift(r.stack));e.unshift(t.stack);var i=e.join("\n"+rt+"\n"),u=o(i);Z(t,"stack",{value:u,configurable:!0})}}function o(t){for(var n=t.split("\n"),e=[],r=0;r<n.length;++r){var o=n[r];c(o)||i(o)||!o||e.push(o)}return e.join("\n")}function i(t){return t.indexOf("(module.js:")!==-1||t.indexOf("(node.js:")!==-1}function u(t){var n=/at .+ \((.+):(\d+):(?:\d+)\)$/.exec(t);if(n)return[n[1],Number(n[2])];var e=/at ([^ ]+):(\d+):(?:\d+)$/.exec(t);if(e)return[e[1],Number(e[2])];var r=/.*@(.+):(\d+)$/.exec(t);return r?[r[1],Number(r[2])]:void 0}function c(t){var n=u(t);if(!n)return!1;var e=n[0],r=n[1];return e===V&&r>=H&&r<=st}function f(){if($)try{throw new Error}catch(r){var t=r.stack.split("\n"),n=t[0].indexOf("@")>0?t[1]:t[2],e=u(n);if(!e)return;return V=e[0],e[1]}}function s(t,n,e){return function(){return"undefined"!=typeof console&&"function"==typeof console.warn&&console.warn(n+" is deprecated, use "+e+" instead.",new Error("").stack),t.apply(t,arguments)}}function p(t){return t instanceof h?t:k(t)?E(t):S(t)}function a(){function t(t){n=t,p.longStackSupport&&$&&(i.source=t),K(e,function(n,e){p.nextTick(function(){t.promiseDispatch.apply(t,e)})},void 0),e=void 0,r=void 0}var n,e=[],r=[],o=Y(a.prototype),i=Y(h.prototype);if(i.promiseDispatch=function(t,o,i){var u=J(arguments);e?(e.push(u),"when"===o&&i[1]&&r.push(i[1])):p.nextTick(function(){n.promiseDispatch.apply(n,u)})},i.valueOf=function(){if(e)return i;var t=v(n);return m(t)&&(n=t),t},i.inspect=function(){return n?n.inspect():{state:"pending"}},p.longStackSupport&&$)try{throw new Error}catch(t){i.stack=t.stack.substring(t.stack.indexOf("\n")+1),i.stackCounter=ot++}return o.promise=i,o.resolve=function(e){n||t(p(e))},o.fulfill=function(e){n||t(S(e))},o.reject=function(e){n||t(R(e))},o.notify=function(t){n||K(r,function(n,e){p.nextTick(function(){e(t)})},void 0)},o}function l(t){if("function"!=typeof t)throw new TypeError("resolver must be a function.");var n=a();try{t(n.resolve,n.reject,n.notify)}catch(t){n.reject(t)}return n.promise}function d(t){return l(function(n,e){for(var r=0,o=t.length;r<o;r++)p(t[r]).then(n,e)})}function h(t,n,e){void 0===n&&(n=function(t){return R(new Error("Promise does not support operation: "+t))}),void 0===e&&(e=function(){return{state:"unknown"}});var r=Y(h.prototype);if(r.promiseDispatch=function(e,o,i){var u;try{u=t[o]?t[o].apply(r,i):n.call(r,o,i)}catch(t){u=R(t)}e&&e(u)},r.inspect=e,e){var o=e();"rejected"===o.state&&(r.exception=o.reason),r.valueOf=function(){var t=e();return"pending"===t.state||"rejected"===t.state?r:t.value}}return r}function y(t,n,e,r){return p(t).then(n,e,r)}function v(t){if(m(t)){var n=t.inspect();if("fulfilled"===n.state)return n.value}return t}function m(t){return t instanceof h}function k(t){return n(t)&&"function"==typeof t.then}function w(t){return m(t)&&"pending"===t.inspect().state}function j(t){return!m(t)||"fulfilled"===t.inspect().state}function g(t){return m(t)&&"rejected"===t.inspect().state}function b(){it.length=0,ut.length=0,ft||(ft=!0)}function x(t,n){ft&&("object"==typeof process&&"function"==typeof process.emit&&p.nextTick.runAfter(function(){W(ut,t)!==-1&&(process.emit("unhandledRejection",n,t),ct.push(t))}),ut.push(t),n&&"undefined"!=typeof n.stack?it.push(n.stack):it.push("(no stack) "+n))}function T(t){if(ft){var n=W(ut,t);n!==-1&&("object"==typeof process&&"function"==typeof process.emit&&p.nextTick.runAfter(function(){var e=W(ct,t);e!==-1&&(process.emit("rejectionHandled",it[n],t),ct.splice(e,1))}),ut.splice(n,1),it.splice(n,1))}}function R(t){var n=h({when:function(n){return n&&T(this),n?n(t):this}},function(){return this},function(){return{state:"rejected",reason:t}});return x(n,t),n}function S(t){return h({when:function(){return t},get:function(n){return t[n]},set:function(n,e){t[n]=e},delete:function(n){delete t[n]},post:function(n,e){return null===n||void 0===n?t.apply(void 0,e):t[n].apply(t,e)},apply:function(n,e){return t.apply(n,e)},keys:function(){return nt(t)}},void 0,function(){return{state:"fulfilled",value:t}})}function E(t){var n=a();return p.nextTick(function(){try{t.then(n.resolve,n.reject,n.notify)}catch(t){n.reject(t)}}),n.promise}function O(t){return h({isDef:function(){}},function(n,e){return D(t,n,e)},function(){return p(t).inspect()})}function C(t,n,e){return p(t).spread(n,e)}function Q(t){return function(){function n(t,n){var u;if("undefined"==typeof StopIteration){try{u=r[t](n)}catch(t){return R(t)}return u.done?p(u.value):y(u.value,o,i)}try{u=r[t](n)}catch(t){return e(t)?p(t.value):R(t)}return y(u,o,i)}var r=t.apply(this,arguments),o=n.bind(n,"next"),i=n.bind(n,"throw");return o()}}function _(t){p.done(p.async(t)())}function N(t){throw new G(t)}function P(t){return function(){return C([this,A(arguments)],function(n,e){return t.apply(n,e)})}}function D(t,n,e){return p(t).dispatch(n,e)}function A(t){return y(t,function(t){var n=0,e=a();return K(t,function(r,o,i){var u;m(o)&&"fulfilled"===(u=o.inspect()).state?t[i]=u.value:(++n,y(o,function(r){t[i]=r,0===--n&&e.resolve(t)},e.reject,function(t){e.notify({index:i,value:t})}))},void 0),0===n&&e.resolve(t),e.promise})}function I(t){if(0===t.length)return p.resolve();var n=p.defer(),e=0;return K(t,function(r,o,i){function u(t){n.resolve(t)}function c(t){if(e--,0===e){var r=t||new Error(""+t);r.message="Q can't get fulfillment value from any promise, all promises were rejected. Last error message: "+r.message,n.reject(r)}}function f(t){n.notify({index:i,value:t})}var s=t[i];e++,y(s,u,c,f)},void 0),n.promise}function U(t){return y(t,function(t){return t=X(t,p),y(A(X(t,function(t){return y(t,L,L)})),function(){return t})})}function F(t){return p(t).allSettled()}function M(t,n){return p(t).then(void 0,void 0,n)}function B(t,n){return p(t).nodeify(n)}var $=!1;try{throw new Error}catch(t){$=!!t.stack}var V,G,H=f(),L=function(){},q=function(){function t(){for(var t,r;e.next;)e=e.next,t=e.task,e.task=void 0,r=e.domain,r&&(e.domain=void 0,r.enter()),n(t,r);for(;c.length;)t=c.pop(),n(t);o=!1}function n(n,e){try{n()}catch(n){if(u)throw e&&e.exit(),setTimeout(t,0),e&&e.enter(),n;setTimeout(function(){throw n},0)}e&&e.exit()}var e={task:void 0,next:null},r=e,o=!1,i=void 0,u=!1,c=[];if(q=function(t){r=r.next={task:t,domain:u&&process.domain,next:null},o||(o=!0,i())},"object"==typeof process&&"[object process]"===process.toString()&&process.nextTick)u=!0,i=function(){process.nextTick(t)};else if("function"==typeof setImmediate)i="undefined"!=typeof window?setImmediate.bind(window,t):function(){setImmediate(t)};else if("undefined"!=typeof MessageChannel){var f=new MessageChannel;f.port1.onmessage=function(){i=s,f.port1.onmessage=t,t()};var s=function(){f.port2.postMessage(0)};i=function(){setTimeout(t,0),s()}}else i=function(){setTimeout(t,0)};return q.runAfter=function(t){c.push(t),o||(o=!0,i())},q}(),z=Function.call,J=t(Array.prototype.slice),K=t(Array.prototype.reduce||function(t,n){var e=0,r=this.length;if(1===arguments.length)for(;;){if(e in this){n=this[e++];break}if(++e>=r)throw new TypeError}for(;e<r;e++)e in this&&(n=t(n,this[e],e));return n}),W=t(Array.prototype.indexOf||function(t){for(var n=0;n<this.length;n++)if(this[n]===t)return n;return-1}),X=t(Array.prototype.map||function(t,n){var e=this,r=[];return K(e,function(o,i,u){r.push(t.call(n,i,u,e))},void 0),r}),Y=Object.create||function(t){function n(){}return n.prototype=t,new n},Z=Object.defineProperty||function(t,n,e){return t[n]=e.value,t},tt=t(Object.prototype.hasOwnProperty),nt=Object.keys||function(t){var n=[];for(var e in t)tt(t,e)&&n.push(e);return n},et=t(Object.prototype.toString);G="undefined"!=typeof ReturnValue?ReturnValue:function(t){this.value=t};var rt="From previous event:";p.resolve=p,p.nextTick=q,p.longStackSupport=!1;var ot=1;"object"==typeof process&&process&&process.env&&process.env.Q_DEBUG&&(p.longStackSupport=!0),p.defer=a,a.prototype.makeNodeResolver=function(){var t=this;return function(n,e){n?t.reject(n):arguments.length>2?t.resolve(J(arguments,1)):t.resolve(e)}},p.Promise=l,p.promise=l,l.race=d,l.all=A,l.reject=R,l.resolve=p,p.passByCopy=function(t){return t},h.prototype.passByCopy=function(){return this},p.join=function(t,n){return p(t).join(n)},h.prototype.join=function(t){return p([this,t]).spread(function(t,n){if(t===n)return t;throw new Error("Q can't join: not the same: "+t+" "+n)})},p.race=d,h.prototype.race=function(){return this.then(p.race)},p.makePromise=h,h.prototype.toString=function(){return"[object Promise]"},h.prototype.then=function(t,n,e){function o(n){try{return"function"==typeof t?t(n):n}catch(t){return R(t)}}function i(t){if("function"==typeof n){r(t,c);try{return n(t)}catch(t){return R(t)}}return R(t)}function u(t){return"function"==typeof e?e(t):t}var c=this,f=a(),s=!1;return p.nextTick(function(){c.promiseDispatch(function(t){s||(s=!0,f.resolve(o(t)))},"when",[function(t){s||(s=!0,f.resolve(i(t)))}])}),c.promiseDispatch(void 0,"when",[void 0,function(t){var n,e=!1;try{n=u(t)}catch(t){if(e=!0,!p.onerror)throw t;p.onerror(t)}e||f.notify(n)}]),f.promise},p.tap=function(t,n){return p(t).tap(n)},h.prototype.tap=function(t){return t=p(t),this.then(function(n){return t.fcall(n).thenResolve(n)})},p.when=y,h.prototype.thenResolve=function(t){return this.then(function(){return t})},p.thenResolve=function(t,n){return p(t).thenResolve(n)},h.prototype.thenReject=function(t){return this.then(function(){throw t})},p.thenReject=function(t,n){return p(t).thenReject(n)},p.nearer=v,p.isPromise=m,p.isPromiseAlike=k,p.isPending=w,h.prototype.isPending=function(){return"pending"===this.inspect().state},p.isFulfilled=j,h.prototype.isFulfilled=function(){return"fulfilled"===this.inspect().state},p.isRejected=g,h.prototype.isRejected=function(){return"rejected"===this.inspect().state};var it=[],ut=[],ct=[],ft=!0;p.resetUnhandledRejections=b,p.getUnhandledReasons=function(){return it.slice()},p.stopUnhandledRejectionTracking=function(){b(),ft=!1},b(),p.reject=R,p.fulfill=S,p.master=O,p.spread=C,h.prototype.spread=function(t,n){return this.all().then(function(n){return t.apply(void 0,n)},n)},p.async=Q,p.spawn=_,p.return=N,p.promised=P,p.dispatch=D,h.prototype.dispatch=function(t,n){var e=this,r=a();return p.nextTick(function(){e.promiseDispatch(r.resolve,t,n)}),r.promise},p.get=function(t,n){return p(t).dispatch("get",[n])},h.prototype.get=function(t){return this.dispatch("get",[t])},p.set=function(t,n,e){return p(t).dispatch("set",[n,e])},h.prototype.set=function(t,n){return this.dispatch("set",[t,n])},p.del=p.delete=function(t,n){return p(t).dispatch("delete",[n])},h.prototype.del=h.prototype.delete=function(t){return this.dispatch("delete",[t])},p.mapply=p.post=function(t,n,e){return p(t).dispatch("post",[n,e])},h.prototype.mapply=h.prototype.post=function(t,n){return this.dispatch("post",[t,n])},p.send=p.mcall=p.invoke=function(t,n){return p(t).dispatch("post",[n,J(arguments,2)])},h.prototype.send=h.prototype.mcall=h.prototype.invoke=function(t){return this.dispatch("post",[t,J(arguments,1)])},p.fapply=function(t,n){return p(t).dispatch("apply",[void 0,n])},h.prototype.fapply=function(t){return this.dispatch("apply",[void 0,t])},p.try=p.fcall=function(t){return p(t).dispatch("apply",[void 0,J(arguments,1)])},h.prototype.fcall=function(){return this.dispatch("apply",[void 0,J(arguments)])},p.fbind=function(t){var n=p(t),e=J(arguments,1);return function(){return n.dispatch("apply",[this,e.concat(J(arguments))])}},h.prototype.fbind=function(){var t=this,n=J(arguments);return function(){return t.dispatch("apply",[this,n.concat(J(arguments))])}},p.keys=function(t){return p(t).dispatch("keys",[])},h.prototype.keys=function(){return this.dispatch("keys",[])},p.all=A,h.prototype.all=function(){return A(this)},p.any=I,h.prototype.any=function(){return I(this)},p.allResolved=s(U,"allResolved","allSettled"),h.prototype.allResolved=function(){return U(this)},p.allSettled=F,h.prototype.allSettled=function(){return this.then(function(t){return A(X(t,function(t){function n(){return t.inspect()}return t=p(t),t.then(n,n)}))})},p.fail=p.catch=function(t,n){return p(t).then(void 0,n)},h.prototype.fail=h.prototype.catch=function(t){return this.then(void 0,t)},p.progress=M,h.prototype.progress=function(t){return this.then(void 0,void 0,t)},p.fin=p.finally=function(t,n){return p(t).finally(n)},h.prototype.fin=h.prototype.finally=function(t){if(!t||"function"!=typeof t.apply)throw new Error("Q can't apply finally callback");return t=p(t),this.then(function(n){return t.fcall().then(function(){return n})},function(n){return t.fcall().then(function(){throw n})})},p.done=function(t,n,e,r){return p(t).done(n,e,r)},h.prototype.done=function(t,n,e){var o=function(t){p.nextTick(function(){if(r(t,i),!p.onerror)throw t;p.onerror(t)})},i=t||n||e?this.then(t,n,e):this;"object"==typeof process&&process&&process.domain&&(o=process.domain.bind(o)),i.then(void 0,o)},p.timeout=function(t,n,e){return p(t).timeout(n,e)},h.prototype.timeout=function(t,n){var e=a(),r=setTimeout(function(){n&&"string"!=typeof n||(n=new Error(n||"Timed out after "+t+" ms"),n.code="ETIMEDOUT"),e.reject(n)},t);return this.then(function(t){clearTimeout(r),e.resolve(t)},function(t){clearTimeout(r),e.reject(t)},e.notify),e.promise},p.delay=function(t,n){return void 0===n&&(n=t,t=void 0),p(t).delay(n)},h.prototype.delay=function(t){return this.then(function(n){var e=a();return setTimeout(function(){e.resolve(n)},t),e.promise})},p.nfapply=function(t,n){return p(t).nfapply(n)},h.prototype.nfapply=function(t){var n=a(),e=J(t);return e.push(n.makeNodeResolver()),this.fapply(e).fail(n.reject),n.promise},p.nfcall=function(t){var n=J(arguments,1);return p(t).nfapply(n)},h.prototype.nfcall=function(){var t=J(arguments),n=a();return t.push(n.makeNodeResolver()),this.fapply(t).fail(n.reject),n.promise},p.nfbind=p.denodeify=function(t){if(void 0===t)throw new Error("Q can't wrap an undefined function");var n=J(arguments,1);return function(){var e=n.concat(J(arguments)),r=a();return e.push(r.makeNodeResolver()),p(t).fapply(e).fail(r.reject),r.promise}},h.prototype.nfbind=h.prototype.denodeify=function(){var t=J(arguments);return t.unshift(this),p.denodeify.apply(void 0,t)},p.nbind=function(t,n){var e=J(arguments,2);return function(){function r(){return t.apply(n,arguments)}var o=e.concat(J(arguments)),i=a();return o.push(i.makeNodeResolver()),p(r).fapply(o).fail(i.reject),i.promise}},h.prototype.nbind=function(){var t=J(arguments,0);return t.unshift(this),p.nbind.apply(void 0,t)},p.nmapply=p.npost=function(t,n,e){return p(t).npost(n,e)},h.prototype.nmapply=h.prototype.npost=function(t,n){var e=J(n||[]),r=a();return e.push(r.makeNodeResolver()),this.dispatch("post",[t,e]).fail(r.reject),r.promise},p.nsend=p.nmcall=p.ninvoke=function(t,n){var e=J(arguments,2),r=a();return e.push(r.makeNodeResolver()),p(t).dispatch("post",[n,e]).fail(r.reject),r.promise},h.prototype.nsend=h.prototype.nmcall=h.prototype.ninvoke=function(t){var n=J(arguments,1),e=a();return n.push(e.makeNodeResolver()),this.dispatch("post",[t,n]).fail(e.reject),e.promise},p.nodeify=B,h.prototype.nodeify=function(t){return t?void this.then(function(n){p.nextTick(function(){t(null,n)})},function(n){p.nextTick(function(){t(n)})}):this},p.noConflict=function(){throw new Error("Q.noConflict only works when Q is used as a global")};var st=f();return p});