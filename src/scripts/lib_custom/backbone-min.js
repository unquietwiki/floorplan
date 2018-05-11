(function(e){var t='object'==typeof self&&self.self===self&&self||'object'==typeof global&&global.global===global&&global;if('undefined'!=typeof exports){var n,a=require('underscore');try{n=require('jquery')}catch(t){}e(t,exports,a,n)}else'function'==typeof define&&define.amd?define(['underscore','jquery','exports'],function(n,a,r){t.Backbone=e(t,r,n,a)}):t.Backbone=e(t,{},t._,t.jQuery||t.Zepto||t.ender||t.$)})(function(e,t,n,a){var r=Math.max,i=e.Backbone,s=Array.prototype.slice;t.VERSION='1.3.3',t.$=a,t.noConflict=function(){return e.Backbone=i,this},t.emulateHTTP=!1,t.emulateJSON=!1;var o=function(e,t,a){return 1===e?function(){return n[t](this[a])}:2===e?function(e){return n[t](this[a],e)}:3===e?function(e,r){return n[t](this[a],l(e,this),r)}:4===e?function(e,r,i){return n[t](this[a],l(e,this),r,i)}:function(){var e=s.call(arguments);return e.unshift(this[a]),n[t].apply(n,e)}},d=function(e,t,a){n.each(t,function(t,r){n[r]&&(e.prototype[r]=o(t,r,a))})},l=function(e,t){return n.isFunction(e)?e:n.isObject(e)&&!t._isModel(e)?c(e):n.isString(e)?function(t){return t.get(e)}:e},c=function(e){var t=n.matches(e);return function(e){return t(e.attributes)}},u=t.Events={},h=/\s+/,g=function(e,t,a,r,s){var o,d=0;if(a&&'object'==typeof a)for(void 0!==r&&('context'in s)&&void 0===s.context&&(s.context=r),o=n.keys(a);d<o.length;d++)t=g(e,t,o[d],a[o[d]],s);else if(a&&h.test(a))for(o=a.split(h);d<o.length;d++)t=e(t,o[d],r,s);else t=e(t,a,r,s);return t};u.on=function(e,t,n){return p(this,e,t,n)};var p=function(e,t,n,a,r){if(e._events=g(m,e._events||{},t,n,{context:a,ctx:e,listening:r}),r){var i=e._listeners||(e._listeners={});i[r.id]=r}return e};u.listenTo=function(e,t,a){if(!e)return this;var r=e._listenId||(e._listenId=n.uniqueId('l')),i=this._listeningTo||(this._listeningTo={}),s=i[r];if(!s){var o=this._listenId||(this._listenId=n.uniqueId('l'));s=i[r]={obj:e,objId:r,id:o,listeningTo:i,count:0}}return p(e,t,a,this,s),this};var m=function(e,t,n,a){if(n){var r=e[t]||(e[t]=[]),i=a.context,s=a.ctx,o=a.listening;o&&o.count++,r.push({callback:n,context:i,ctx:i||s,listening:o})}return e};u.off=function(e,t,n){return this._events?(this._events=g(f,this._events,e,t,{context:n,listeners:this._listeners}),this):this},u.stopListening=function(e,t,a){var r=this._listeningTo;if(!r)return this;for(var s,o=e?[e._listenId]:n.keys(r),d=0;d<o.length&&(s=r[o[d]],!!s);d++)s.obj.off(t,a,this);return this};var f=function(e,t,a,r){if(e){var s,o=0,d=r.context,l=r.listeners;if(!t&&!a&&!d){for(var c=n.keys(l);o<c.length;o++)s=l[c[o]],delete l[s.id],delete s.listeningTo[s.objId];return}for(var u=t?[t]:n.keys(e);o<u.length;o++){t=u[o];var h=e[t];if(!h)break;for(var g,p=[],m=0;m<h.length;m++)g=h[m],a&&a!==g.callback&&a!==g.callback._callback||d&&d!==g.context?p.push(g):(s=g.listening,s&&0==--s.count&&(delete l[s.id],delete s.listeningTo[s.objId]));p.length?e[t]=p:delete e[t]}return e}};u.once=function(e,t,a){var r=g(_,{},e,t,n.bind(this.off,this));return'string'==typeof e&&null==a&&(t=void 0),this.on(r,t,a)},u.listenToOnce=function(e,t,a){var r=g(_,{},t,a,n.bind(this.stopListening,this,e));return this.listenTo(e,r)};var _=function(e,t,a,r){if(a){var i=e[t]=n.once(function(){r(t,i),a.apply(this,arguments)});i._callback=a}return e};u.trigger=function(e){if(!this._events)return this;for(var t=r(0,arguments.length-1),n=Array(t),a=0;a<t;a++)n[a]=arguments[a+1];return g(y,this._events,e,void 0,n),this};var y=function(e,t,n,a){if(e){var r=e[t],i=e.all;r&&i&&(i=i.slice()),r&&b(r,a),i&&b(i,[t].concat(a))}return e},b=function(e,t){var n,a=-1,r=e.length,s=t[0],o=t[1],d=t[2];switch(t.length){case 0:for(;++a<r;)(n=e[a]).callback.call(n.ctx);return;case 1:for(;++a<r;)(n=e[a]).callback.call(n.ctx,s);return;case 2:for(;++a<r;)(n=e[a]).callback.call(n.ctx,s,o);return;case 3:for(;++a<r;)(n=e[a]).callback.call(n.ctx,s,o,d);return;default:for(;++a<r;)(n=e[a]).callback.apply(n.ctx,t);}};u.bind=u.on,u.unbind=u.off,n.extend(t,u);var v=t.Model=function(e,t){var a=e||{};t||(t={}),this.cid=n.uniqueId(this.cidPrefix),this.attributes={},t.collection&&(this.collection=t.collection),t.parse&&(a=this.parse(a,t)||{});var r=n.result(this,'defaults');a=n.defaults(n.extend({},r,a),r),this.set(a,t),this.changed={},this.initialize.apply(this,arguments)};n.extend(v.prototype,u,{changed:null,validationError:null,idAttribute:'id',cidPrefix:'c',initialize:function(){},toJSON:function(){return n.clone(this.attributes)},sync:function(){return t.sync.apply(this,arguments)},get:function(e){return this.attributes[e]},escape:function(e){return n.escape(this.get(e))},has:function(e){return null!=this.get(e)},matches:function(e){return!!n.iteratee(e,this)(this.attributes)},set:function(e,t,a){if(null==e)return this;var r;if('object'==typeof e?(r=e,a=t):(r={})[e]=t,a||(a={}),!this._validate(r,a))return!1;var s=a.unset,o=a.silent,d=[],l=this._changing;this._changing=!0,l||(this._previousAttributes=n.clone(this.attributes),this.changed={});var c=this.attributes,u=this.changed,h=this._previousAttributes;for(var g in r)t=r[g],n.isEqual(c[g],t)||d.push(g),n.isEqual(h[g],t)?delete u[g]:u[g]=t,s?delete c[g]:c[g]=t;if(this.idAttribute in r&&(this.id=this.get(this.idAttribute)),!o){d.length&&(this._pending=a);for(var p=0;p<d.length;p++)this.trigger('change:'+d[p],this,c[d[p]],a)}if(l)return this;if(!o)for(;this._pending;)a=this._pending,this._pending=!1,this.trigger('change',this,a);return this._pending=!1,this._changing=!1,this},unset:function(e,t){return this.set(e,void 0,n.extend({},t,{unset:!0}))},clear:function(e){var t={};for(var a in this.attributes)t[a]=void 0;return this.set(t,n.extend({},e,{unset:!0}))},hasChanged:function(e){return null==e?!n.isEmpty(this.changed):n.has(this.changed,e)},changedAttributes:function(e){if(!e)return!!this.hasChanged()&&n.clone(this.changed);var t=this._changing?this._previousAttributes:this.attributes,a={};for(var r in e){var i=e[r];n.isEqual(t[r],i)||(a[r]=i)}return!!n.size(a)&&a},previous:function(e){return null!=e&&this._previousAttributes?this._previousAttributes[e]:null},previousAttributes:function(){return n.clone(this._previousAttributes)},fetch:function(e){e=n.extend({parse:!0},e);var t=this,a=e.success;return e.success=function(n){var r=e.parse?t.parse(n,e):n;return!!t.set(r,e)&&void(a&&a.call(e.context,t,n,e),t.trigger('sync',t,n,e))},F(this,e),this.sync('read',this,e)},save:function(e,t,a){var r;null==e||'object'==typeof e?(r=e,a=t):(r={})[e]=t,a=n.extend({validate:!0,parse:!0},a);var i=a.wait;if(r&&!i){if(!this.set(r,a))return!1;}else if(!this._validate(r,a))return!1;var s=this,o=a.success,d=this.attributes;a.success=function(e){s.attributes=d;var t=a.parse?s.parse(e,a):e;return i&&(t=n.extend({},r,t)),(!t||s.set(t,a))&&void(o&&o.call(a.context,s,e,a),s.trigger('sync',s,e,a))},F(this,a),r&&i&&(this.attributes=n.extend({},d,r));var l=this.isNew()?'create':a.patch?'patch':'update';'patch'!=l||a.attrs||(a.attrs=r);var c=this.sync(l,this,a);return this.attributes=d,c},destroy:function(e){e=e?n.clone(e):{};var t=this,a=e.success,r=e.wait,i=function(){t.stopListening(),t.trigger('destroy',t,t.collection,e)};e.success=function(n){r&&i(),a&&a.call(e.context,t,n,e),t.isNew()||t.trigger('sync',t,n,e)};var s=!1;return this.isNew()?n.defer(e.success):(F(this,e),s=this.sync('delete',this,e)),r||i(),s},url:function(){var e=n.result(this,'urlRoot')||n.result(this.collection,'url')||U();if(this.isNew())return e;var t=this.get(this.idAttribute);return e.replace(/[^/]$/,'$&/')+encodeURIComponent(t)},parse:function(e){return e},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(e){return this._validate({},n.extend({},e,{validate:!0}))},_validate:function(e,t){if(!t.validate||!this.validate)return!0;e=n.extend({},this.attributes,e);var a=this.validationError=this.validate(e,t)||null;return!a||(this.trigger('invalid',this,a,n.extend(t,{validationError:a})),!1)}});d(v,{keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1},'attributes');var x=t.Collection=function(e,t){t||(t={}),t.model&&(this.model=t.model),void 0!==t.comparator&&(this.comparator=t.comparator),this._reset(),this.initialize.apply(this,arguments),e&&this.reset(e,n.extend({silent:!0},t))},E={add:!0,remove:!0,merge:!0},k={add:!0,remove:!1},S=function(e,t,n){n=Math.min(r(n,0),e.length);var a,s=Array(e.length-n),o=t.length;for(a=0;a<s.length;a++)s[a]=e[a+n];for(a=0;a<o;a++)e[a+n]=t[a];for(a=0;a<s.length;a++)e[a+o+n]=s[a]};n.extend(x.prototype,u,{model:v,initialize:function(){},toJSON:function(e){return this.map(function(t){return t.toJSON(e)})},sync:function(){return t.sync.apply(this,arguments)},add:function(e,t){return this.set(e,n.extend({merge:!1},t,k))},remove:function(e,t){t=n.extend({},t);var a=!n.isArray(e);e=a?[e]:e.slice();var r=this._removeModels(e,t);return!t.silent&&r.length&&(t.changes={added:[],merged:[],removed:r},this.trigger('update',this,t)),a?r[0]:r},set:function(e,t){if(null!=e){t=n.extend({},E,t),t.parse&&!this._isModel(e)&&(e=this.parse(e,t)||[]);var a=!n.isArray(e);e=a?[e]:e.slice();var r=t.at;null!=r&&(r=+r),r>this.length&&(r=this.length),0>r&&(r+=this.length+1);var s,o,d=[],l=[],c=[],u=[],h={},g=t.add,p=t.merge,m=t.remove,f=!1,_=this.comparator&&null==r&&!1!==t.sort,y=n.isString(this.comparator)?this.comparator:null;for(o=0;o<e.length;o++){s=e[o];var b=this.get(s);if(b){if(p&&s!==b){var v=this._isModel(s)?s.attributes:s;t.parse&&(v=b.parse(v,t)),b.set(v,t),c.push(b),_&&!f&&(f=b.hasChanged(y))}h[b.cid]||(h[b.cid]=!0,d.push(b)),e[o]=b}else g&&(s=e[o]=this._prepareModel(s,t),s&&(l.push(s),this._addReference(s,t),h[s.cid]=!0,d.push(s)))}if(m){for(o=0;o<this.length;o++)s=this.models[o],h[s.cid]||u.push(s);u.length&&this._removeModels(u,t)}var x=!1;if(d.length&&!_&&g&&m?(x=this.length!==d.length||n.some(this.models,function(e,t){return e!==d[t]}),this.models.length=0,S(this.models,d,0),this.length=this.models.length):l.length&&(_&&(f=!0),S(this.models,l,null==r?this.length:r),this.length=this.models.length),f&&this.sort({silent:!0}),!t.silent){for(o=0;o<l.length;o++)null!=r&&(t.index=r+o),s=l[o],s.trigger('add',s,this,t);(f||x)&&this.trigger('sort',this,t),(l.length||u.length||c.length)&&(t.changes={added:l,removed:u,merged:c},this.trigger('update',this,t))}return a?e[0]:e}},reset:function(e,t){t=t?n.clone(t):{};for(var a=0;a<this.models.length;a++)this._removeReference(this.models[a],t);return t.previousModels=this.models,this._reset(),e=this.add(e,n.extend({silent:!0},t)),t.silent||this.trigger('reset',this,t),e},push:function(e,t){return this.add(e,n.extend({at:this.length},t))},pop:function(e){var t=this.at(this.length-1);return this.remove(t,e)},unshift:function(e,t){return this.add(e,n.extend({at:0},t))},shift:function(e){var t=this.at(0);return this.remove(t,e)},slice:function(){return s.apply(this.models,arguments)},get:function(e){return null==e?void 0:this._byId[e]||this._byId[this.modelId(e.attributes||e)]||e.cid&&this._byId[e.cid]},has:function(e){return null!=this.get(e)},at:function(e){return 0>e&&(e+=this.length),this.models[e]},where:function(e,t){return this[t?'find':'filter'](e)},findWhere:function(e){return this.where(e,!0)},sort:function(e){var t=this.comparator;if(!t)throw new Error('Cannot sort a set without a comparator');e||(e={});var a=t.length;return n.isFunction(t)&&(t=n.bind(t,this)),1===a||n.isString(t)?this.models=this.sortBy(t):this.models.sort(t),e.silent||this.trigger('sort',this,e),this},pluck:function(e){return this.map(e+'')},fetch:function(e){e=n.extend({parse:!0},e);var t=e.success,a=this;return e.success=function(n){var r=e.reset?'reset':'set';a[r](n,e),t&&t.call(e.context,a,n,e),a.trigger('sync',a,n,e)},F(this,e),this.sync('read',this,e)},create:function(e,t){t=t?n.clone(t):{};var a=t.wait;if(e=this._prepareModel(e,t),!e)return!1;a||this.add(e,t);var r=this,i=t.success;return t.success=function(e,t,n){a&&r.add(e,n),i&&i.call(n.context,e,t,n)},e.save(null,t),e},parse:function(e){return e},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(e){return e[this.model.prototype.idAttribute||'id']},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(e,t){if(this._isModel(e))return e.collection||(e.collection=this),e;t=t?n.clone(t):{},t.collection=this;var a=new this.model(e,t);return a.validationError?(this.trigger('invalid',this,a.validationError,t),!1):a},_removeModels:function(e,t){for(var n,a=[],r=0;r<e.length;r++)if(n=this.get(e[r]),n){var s=this.indexOf(n);this.models.splice(s,1),this.length--,delete this._byId[n.cid];var o=this.modelId(n.attributes);null!=o&&delete this._byId[o],t.silent||(t.index=s,n.trigger('remove',n,this,t)),a.push(n),this._removeReference(n,t)}return a},_isModel:function(e){return e instanceof v},_addReference:function(e){this._byId[e.cid]=e;var t=this.modelId(e.attributes);null!=t&&(this._byId[t]=e),e.on('all',this._onModelEvent,this)},_removeReference:function(e){delete this._byId[e.cid];var t=this.modelId(e.attributes);null!=t&&delete this._byId[t],this===e.collection&&delete e.collection,e.off('all',this._onModelEvent,this)},_onModelEvent:function(e,t,n,a){if(t){if(('add'===e||'remove'===e)&&n!==this)return;if('destroy'===e&&this.remove(t,a),'change'===e){var r=this.modelId(t.previousAttributes()),i=this.modelId(t.attributes);r!==i&&(null!=r&&delete this._byId[r],null!=i&&(this._byId[i]=t))}}this.trigger.apply(this,arguments)}});d(x,{forEach:3,each:3,map:3,collect:3,reduce:0,foldl:0,inject:0,reduceRight:0,foldr:0,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3,findIndex:3,findLastIndex:3},'models');var I=t.View=function(e){this.cid=n.uniqueId('view'),n.extend(this,n.pick(e,w)),this._ensureElement(),this.initialize.apply(this,arguments)},T=/^(\S+)\s*(.*)$/,w=['model','collection','el','id','attributes','className','tagName','events'];n.extend(I.prototype,u,{tagName:'div',$:function(e){return this.$el.find(e)},initialize:function(){},render:function(){return this},remove:function(){return this._removeElement(),this.stopListening(),this},_removeElement:function(){this.$el.remove()},setElement:function(e){return this.undelegateEvents(),this._setElement(e),this.delegateEvents(),this},_setElement:function(e){this.$el=e instanceof t.$?e:t.$(e),this.el=this.$el[0]},delegateEvents:function(e){if(e||(e=n.result(this,'events')),!e)return this;for(var t in this.undelegateEvents(),e){var a=e[t];if(n.isFunction(a)||(a=this[a]),a){var r=t.match(T);this.delegate(r[1],r[2],n.bind(a,this))}}return this},delegate:function(e,t,n){return this.$el.on(e+'.delegateEvents'+this.cid,t,n),this},undelegateEvents:function(){return this.$el&&this.$el.off('.delegateEvents'+this.cid),this},undelegate:function(e,t,n){return this.$el.off(e+'.delegateEvents'+this.cid,t,n),this},_createElement:function(e){return document.createElement(e)},_ensureElement:function(){if(!this.el){var e=n.extend({},n.result(this,'attributes'));this.id&&(e.id=n.result(this,'id')),this.className&&(e['class']=n.result(this,'className')),this.setElement(this._createElement(n.result(this,'tagName'))),this._setAttributes(e)}else this.setElement(n.result(this,'el'))},_setAttributes:function(e){this.$el.attr(e)}}),t.sync=function(e,a,r){var i=P[e];n.defaults(r||(r={}),{emulateHTTP:t.emulateHTTP,emulateJSON:t.emulateJSON});var s={type:i,dataType:'json'};if(r.url||(s.url=n.result(a,'url')||U()),null==r.data&&a&&('create'===e||'update'===e||'patch'===e)&&(s.contentType='application/json',s.data=JSON.stringify(r.attrs||a.toJSON(r))),r.emulateJSON&&(s.contentType='application/x-www-form-urlencoded',s.data=s.data?{model:s.data}:{}),r.emulateHTTP&&('PUT'===i||'DELETE'===i||'PATCH'===i)){s.type='POST',r.emulateJSON&&(s.data._method=i);var o=r.beforeSend;r.beforeSend=function(e){if(e.setRequestHeader('X-HTTP-Method-Override',i),o)return o.apply(this,arguments)}}'GET'===s.type||r.emulateJSON||(s.processData=!1);var d=r.error;r.error=function(e,t,n){r.textStatus=t,r.errorThrown=n,d&&d.call(r.context,e,t,n)};var l=r.xhr=t.ajax(n.extend(s,r));return a.trigger('request',a,l,r),l};var P={create:'POST',update:'PUT',patch:'PATCH',delete:'DELETE',read:'GET'};t.ajax=function(){return t.$.ajax.apply(t.$,arguments)};var H=t.Router=function(e){e||(e={}),e.routes&&(this.routes=e.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},A=/\((.*?)\)/g,j=/(\(\?)?:\w+/g,C=/\*\w+/g,N=/[-{}[\]+?.,\\^$|#\s]/g;n.extend(H.prototype,u,{initialize:function(){},route:function(e,a,r){n.isRegExp(e)||(e=this._routeToRegExp(e)),n.isFunction(a)&&(r=a,a=''),r||(r=this[a]);var i=this;return t.history.route(e,function(n){var s=i._extractParameters(e,n);!1!==i.execute(r,s,a)&&(i.trigger.apply(i,['route:'+a].concat(s)),i.trigger('route',a,s),t.history.trigger('route',i,a,s))}),this},execute:function(e,t){e&&e.apply(this,t)},navigate:function(e,n){return t.history.navigate(e,n),this},_bindRoutes:function(){if(this.routes){this.routes=n.result(this,'routes');for(var e,t=n.keys(this.routes);null!=(e=t.pop());)this.route(e,this.routes[e])}},_routeToRegExp:function(e){return e=e.replace(N,'\\$&').replace(A,'(?:$1)?').replace(j,function(e,t){return t?e:'([^/?]+)'}).replace(C,'([^?]*?)'),new RegExp('^'+e+'(?:\\?([\\s\\S]*))?$')},_extractParameters:function(e,t){var a=e.exec(t).slice(1);return n.map(a,function(e,t){return t===a.length-1?e||null:e?decodeURIComponent(e):null})}});var $=t.History=function(){this.handlers=[],this.checkUrl=n.bind(this.checkUrl,this),'undefined'!=typeof window&&(this.location=window.location,this.history=window.history)},R=/^[#/]|\s+$/g,M=/^\/+|\/+$/g,O=/#.*$/;$.started=!1,n.extend($.prototype,u,{interval:50,atRoot:function(){var e=this.location.pathname.replace(/[^/]$/,'$&/');return e===this.root&&!this.getSearch()},matchRoot:function(){var e=this.decodeFragment(this.location.pathname),t=e.slice(0,this.root.length-1)+'/';return t===this.root},decodeFragment:function(e){return decodeURI(e.replace(/%25/g,'%2525'))},getSearch:function(){var e=this.location.href.replace(/#.*/,'').match(/\?.+/);return e?e[0]:''},getHash:function(e){var t=(e||this).location.href.match(/#(.*)$/);return t?t[1]:''},getPath:function(){var e=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return'/'===e.charAt(0)?e.slice(1):e},getFragment:function(e){return null==e&&(this._usePushState||!this._wantsHashChange?e=this.getPath():e=this.getHash()),e.replace(R,'')},start:function(e){if($.started)throw new Error('Backbone.history has already been started');if($.started=!0,this.options=n.extend({root:'/'},this.options,e),this.root=this.options.root,this._wantsHashChange=!1!==this.options.hashChange,this._hasHashChange='onhashchange'in window&&(void 0===document.documentMode||7<document.documentMode),this._useHashChange=this._wantsHashChange&&this._hasHashChange,this._wantsPushState=!!this.options.pushState,this._hasPushState=!!(this.history&&this.history.pushState),this._usePushState=this._wantsPushState&&this._hasPushState,this.fragment=this.getFragment(),this.root=('/'+this.root+'/').replace(M,'/'),this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var t=this.root.slice(0,-1)||'/';return this.location.replace(t+'#'+this.getPath()),!0}this._hasPushState&&this.atRoot()&&this.navigate(this.getHash(),{replace:!0})}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement('iframe'),this.iframe.src='javascript:0',this.iframe.style.display='none',this.iframe.tabIndex=-1;var a=document.body,r=a.insertBefore(this.iframe,a.firstChild).contentWindow;r.document.open(),r.document.close(),r.location.hash='#'+this.fragment}var i=window.addEventListener||function(e,t){return attachEvent('on'+e,t)};if(this._usePushState?i('popstate',this.checkUrl,!1):this._useHashChange&&!this.iframe?i('hashchange',this.checkUrl,!1):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),!this.options.silent)return this.loadUrl()},stop:function(){var e=window.removeEventListener||function(e,t){return detachEvent('on'+e,t)};this._usePushState?e('popstate',this.checkUrl,!1):this._useHashChange&&!this.iframe&&e('hashchange',this.checkUrl,!1),this.iframe&&(document.body.removeChild(this.iframe),this.iframe=null),this._checkUrlInterval&&clearInterval(this._checkUrlInterval),$.started=!1},route:function(e,t){this.handlers.unshift({route:e,callback:t})},checkUrl:function(){var e=this.getFragment();return e===this.fragment&&this.iframe&&(e=this.getHash(this.iframe.contentWindow)),e!==this.fragment&&void(this.iframe&&this.navigate(e),this.loadUrl())},loadUrl:function(e){return!!this.matchRoot()&&(e=this.fragment=this.getFragment(e),n.some(this.handlers,function(t){if(t.route.test(e))return t.callback(e),!0}))},navigate:function(e,t){if(!$.started)return!1;t&&!0!==t||(t={trigger:!!t}),e=this.getFragment(e||'');var n=this.root;(''===e||'?'===e.charAt(0))&&(n=n.slice(0,-1)||'/');var a=n+e;if(e=this.decodeFragment(e.replace(O,'')),this.fragment!==e){if(this.fragment=e,this._usePushState)this.history[t.replace?'replaceState':'pushState']({},document.title,a);else{if(!this._wantsHashChange)return this.location.assign(a);if(this._updateHash(this.location,e,t.replace),this.iframe&&e!==this.getHash(this.iframe.contentWindow)){var r=this.iframe.contentWindow;t.replace||(r.document.open(),r.document.close()),this._updateHash(r.location,e,t.replace)}}return t.trigger?this.loadUrl(e):void 0}},_updateHash:function(e,t,n){if(n){var a=e.href.replace(/(javascript:|#).*$/,'');e.replace(a+'#'+t)}else e.hash='#'+t}}),t.history=new $;v.extend=x.extend=H.extend=I.extend=$.extend=function(e,t){var a,r=this;return a=e&&n.has(e,'constructor')?e.constructor:function(){return r.apply(this,arguments)},n.extend(a,r,t),a.prototype=n.create(r.prototype,e),a.prototype.constructor=a,a.__super__=r.prototype,a};var U=function(){throw new Error('A "url" property or function must be specified')},F=function(e,t){var n=t.error;t.error=function(a){n&&n.call(t.context,e,a,t),e.trigger('error',e,a,t)}};return t});

//# sourceMappingURL=backbone-min.js.map