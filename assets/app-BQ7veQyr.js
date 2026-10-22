const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/go_rust_hybrid_architecture.html-DseWuJvN.js","assets/console-online-C1F69Doz.js","assets/go_wind_admin_ai_module.html-DECaGOxq.js","assets/dashboard-QiVseJUK.js","assets/go_wind_admin_audit_compliance.html-CZ8xLNTE.js","assets/online-sessions-D6c6BXYI.js","assets/go_wind_admin_authentication.html-N3rJUavJ.js","assets/go_wind_admin_multi_tenant_isolation.html-DMjLji9i.js","assets/tenants-CpoQ-JnL.js","assets/go_wind_admin_plan_billing.html-DCeLGMHZ.js","assets/rushwind_admin_contract_driven.html-C7zkrQ6W.js","assets/redoc-DXdiiiEo.js","assets/rushwind_admin_intro.html-C92kBo1K.js"])))=>i.map(i=>d[i]);
/**
* @vue/shared v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Ao(t){const e=Object.create(null);for(const n of t.split(","))e[n]=1;return n=>n in e}const yt={},On=[],Oe=()=>{},Ii=()=>!1,ya=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&(t.charCodeAt(2)>122||t.charCodeAt(2)<97),gs=t=>t.startsWith("onUpdate:"),Kt=Object.assign,xo=(t,e)=>{const n=t.indexOf(e);n>-1&&t.splice(n,1)},np=Object.prototype.hasOwnProperty,vt=(t,e)=>np.call(t,e),st=Array.isArray,Gn=t=>Ta(t)==="[object Map]",Oi=t=>Ta(t)==="[object Set]",ir=t=>Ta(t)==="[object Date]",ct=t=>typeof t=="function",Ot=t=>typeof t=="string",ge=t=>typeof t=="symbol",ht=t=>t!==null&&typeof t=="object",Gi=t=>(ht(t)||ct(t))&&ct(t.then)&&ct(t.catch),Bi=Object.prototype.toString,Ta=t=>Bi.call(t),ap=t=>Ta(t).slice(8,-1),Vi=t=>Ta(t)==="[object Object]",_s=t=>Ot(t)&&t!=="NaN"&&t[0]!=="-"&&""+parseInt(t,10)===t,fn=Ao(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),ms=t=>{const e=Object.create(null);return n=>e[n]||(e[n]=t(n))},sp=/-\w/g,$t=ms(t=>t.replace(sp,e=>e.slice(1).toUpperCase())),op=/\B([A-Z])/g,ln=ms(t=>t.replace(op,"-$1").toLowerCase()),Aa=ms(t=>t.charAt(0).toUpperCase()+t.slice(1)),Gs=ms(t=>t?`on${Aa(t)}`:""),Ie=(t,e)=>!Object.is(t,e),Bs=(t,...e)=>{for(let n=0;n<t.length;n++)t[n](...e)},Wi=(t,e,n,a=!1)=>{Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:a,value:n})},rp=t=>{const e=parseFloat(t);return isNaN(e)?t:e},ip=t=>{const e=Ot(t)?Number(t):NaN;return isNaN(e)?t:e};let lr;const hs=()=>lr||(lr=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function qn(t){if(st(t)){const e={};for(let n=0;n<t.length;n++){const a=t[n],s=Ot(a)?dp(a):qn(a);if(s)for(const o in s)e[o]=s[o]}return e}else if(Ot(t)||ht(t))return t}const lp=/;(?![^(]*\))/g,cp=/:([^]+)/,pp=/\/\*[^]*?\*\//g;function dp(t){const e={};return t.replace(pp,"").split(lp).forEach(n=>{if(n){const a=n.split(cp);a.length>1&&(e[a[0].trim()]=a[1].trim())}}),e}function oe(t){let e="";if(Ot(t))e=t;else if(st(t))for(let n=0;n<t.length;n++){const a=oe(t[n]);a&&(e+=a+" ")}else if(ht(t))for(const n in t)t[n]&&(e+=n+" ");return e.trim()}function Vs(t){if(!t)return null;let{class:e,style:n}=t;return e&&!Ot(e)&&(t.class=oe(e)),n&&(t.style=qn(n)),t}const up="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",gp=Ao(up);function Mi(t){return!!t||t===""}function _p(t,e){if(t.length!==e.length)return!1;let n=!0;for(let a=0;n&&a<t.length;a++)n=Po(t[a],e[a]);return n}function Po(t,e){if(t===e)return!0;let n=ir(t),a=ir(e);if(n||a)return n&&a?t.getTime()===e.getTime():!1;if(n=ge(t),a=ge(e),n||a)return t===e;if(n=st(t),a=st(e),n||a)return n&&a?_p(t,e):!1;if(n=ht(t),a=ht(e),n||a){if(!n||!a)return!1;const s=Object.keys(t).length,o=Object.keys(e).length;if(s!==o)return!1;for(const r in t){const l=t.hasOwnProperty(r),c=e.hasOwnProperty(r);if(l&&!c||!l&&c||!Po(t[r],e[r]))return!1}}return String(t)===String(e)}const Fi=t=>!!(t&&t.__v_isRef===!0),mt=t=>Ot(t)?t:t==null?"":st(t)||ht(t)&&(t.toString===Bi||!ct(t.toString))?Fi(t)?mt(t.value):JSON.stringify(t,Ni,2):String(t),Ni=(t,e)=>Fi(e)?Ni(t,e.value):Gn(e)?{[`Map(${e.size})`]:[...e.entries()].reduce((n,[a,s],o)=>(n[Ws(a,o)+" =>"]=s,n),{})}:Oi(e)?{[`Set(${e.size})`]:[...e.values()].map(n=>Ws(n))}:ge(e)?Ws(e):ht(e)&&!st(e)&&!Vi(e)?String(e):e,Ws=(t,e="")=>{var n;return ge(t)?`Symbol(${(n=t.description)!=null?n:e})`:t};/**
* @vue/reactivity v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let Xt;class mp{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this.__v_skip=!0,this.parent=Xt,!e&&Xt&&(this.index=(Xt.scopes||(Xt.scopes=[])).push(this)-1)}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].pause();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,n;if(this.scopes)for(e=0,n=this.scopes.length;e<n;e++)this.scopes[e].resume();for(e=0,n=this.effects.length;e<n;e++)this.effects[e].resume()}}run(e){if(this._active){const n=Xt;try{return Xt=this,e()}finally{Xt=n}}}on(){++this._on===1&&(this.prevScope=Xt,Xt=this)}off(){this._on>0&&--this._on===0&&(Xt=this.prevScope,this.prevScope=void 0)}stop(e){if(this._active){this._active=!1;let n,a;for(n=0,a=this.effects.length;n<a;n++)this.effects[n].stop();for(this.effects.length=0,n=0,a=this.cleanups.length;n<a;n++)this.cleanups[n]();if(this.cleanups.length=0,this.scopes){for(n=0,a=this.scopes.length;n<a;n++)this.scopes[n].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function Ki(){return Xt}function hp(t,e=!1){Xt&&Xt.cleanups.push(t)}let wt;const Ms=new WeakSet;class Hi{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Xt&&Xt.active&&Xt.effects.push(this)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ms.has(this)&&(Ms.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Ui(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,cr(this),Zi(this);const e=wt,n=Ee;wt=this,Ee=!0;try{return this.fn()}finally{qi(this),wt=e,Ee=n,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Ro(e);this.deps=this.depsTail=void 0,cr(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ms.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){oo(this)&&this.run()}get dirty(){return oo(this)}}let ji=0,oa,ra;function Ui(t,e=!1){if(t.flags|=8,e){t.next=ra,ra=t;return}t.next=oa,oa=t}function wo(){ji++}function So(){if(--ji>0)return;if(ra){let e=ra;for(ra=void 0;e;){const n=e.next;e.next=void 0,e.flags&=-9,e=n}}let t;for(;oa;){let e=oa;for(oa=void 0;e;){const n=e.next;if(e.next=void 0,e.flags&=-9,e.flags&1)try{e.trigger()}catch(a){t||(t=a)}e=n}}if(t)throw t}function Zi(t){for(let e=t.deps;e;e=e.nextDep)e.version=-1,e.prevActiveLink=e.dep.activeLink,e.dep.activeLink=e}function qi(t){let e,n=t.depsTail,a=n;for(;a;){const s=a.prevDep;a.version===-1?(a===n&&(n=s),Ro(a),fp(a)):e=a,a.dep.activeLink=a.prevActiveLink,a.prevActiveLink=void 0,a=s}t.deps=e,t.depsTail=n}function oo(t){for(let e=t.deps;e;e=e.nextDep)if(e.dep.version!==e.version||e.dep.computed&&($i(e.dep.computed)||e.dep.version!==e.version))return!0;return!!t._dirty}function $i(t){if(t.flags&4&&!(t.flags&16)||(t.flags&=-17,t.globalVersion===ga)||(t.globalVersion=ga,!t.isSSR&&t.flags&128&&(!t.deps&&!t._dirty||!oo(t))))return;t.flags|=2;const e=t.dep,n=wt,a=Ee;wt=t,Ee=!0;try{Zi(t);const s=t.fn(t._value);(e.version===0||Ie(s,t._value))&&(t.flags|=128,t._value=s,e.version++)}catch(s){throw e.version++,s}finally{wt=n,Ee=a,qi(t),t.flags&=-3}}function Ro(t,e=!1){const{dep:n,prevSub:a,nextSub:s}=t;if(a&&(a.nextSub=s,t.prevSub=void 0),s&&(s.prevSub=a,t.nextSub=void 0),n.subs===t&&(n.subs=a,!a&&n.computed)){n.computed.flags&=-5;for(let o=n.computed.deps;o;o=o.nextDep)Ro(o,!0)}!e&&!--n.sc&&n.map&&n.map.delete(n.key)}function fp(t){const{prevDep:e,nextDep:n}=t;e&&(e.nextDep=n,t.prevDep=void 0),n&&(n.prevDep=e,t.nextDep=void 0)}let Ee=!0;const zi=[];function Qe(){zi.push(Ee),Ee=!1}function Xe(){const t=zi.pop();Ee=t===void 0?!0:t}function cr(t){const{cleanup:e}=t;if(t.cleanup=void 0,e){const n=wt;wt=void 0;try{e()}finally{wt=n}}}let ga=0;class vp{constructor(e,n){this.sub=e,this.dep=n,this.version=n.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class fs{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!wt||!Ee||wt===this.computed)return;let n=this.activeLink;if(n===void 0||n.sub!==wt)n=this.activeLink=new vp(wt,this),wt.deps?(n.prevDep=wt.depsTail,wt.depsTail.nextDep=n,wt.depsTail=n):wt.deps=wt.depsTail=n,Qi(n);else if(n.version===-1&&(n.version=this.version,n.nextDep)){const a=n.nextDep;a.prevDep=n.prevDep,n.prevDep&&(n.prevDep.nextDep=a),n.prevDep=wt.depsTail,n.nextDep=void 0,wt.depsTail.nextDep=n,wt.depsTail=n,wt.deps===n&&(wt.deps=a)}return n}trigger(e){this.version++,ga++,this.notify(e)}notify(e){wo();try{for(let n=this.subs;n;n=n.prevSub)n.sub.notify()&&n.sub.dep.notify()}finally{So()}}}function Qi(t){if(t.dep.sc++,t.sub.flags&4){const e=t.dep.computed;if(e&&!t.dep.subs){e.flags|=20;for(let a=e.deps;a;a=a.nextDep)Qi(a)}const n=t.dep.subs;n!==t&&(t.prevSub=n,n&&(n.nextSub=t)),t.dep.subs=t}}const es=new WeakMap,vn=Symbol(""),ro=Symbol(""),_a=Symbol("");function Jt(t,e,n){if(Ee&&wt){let a=es.get(t);a||es.set(t,a=new Map);let s=a.get(n);s||(a.set(n,s=new fs),s.map=a,s.key=n),s.track()}}function Ze(t,e,n,a,s,o){const r=es.get(t);if(!r){ga++;return}const l=c=>{c&&c.trigger()};if(wo(),e==="clear")r.forEach(l);else{const c=st(t),p=c&&_s(n);if(c&&n==="length"){const d=Number(a);r.forEach((u,g)=>{(g==="length"||g===_a||!ge(g)&&g>=d)&&l(u)})}else switch((n!==void 0||r.has(void 0))&&l(r.get(n)),p&&l(r.get(_a)),e){case"add":c?p&&l(r.get("length")):(l(r.get(vn)),Gn(t)&&l(r.get(ro)));break;case"delete":c||(l(r.get(vn)),Gn(t)&&l(r.get(ro)));break;case"set":Gn(t)&&l(r.get(vn));break}}So()}function bp(t,e){const n=es.get(t);return n&&n.get(e)}function Pn(t){const e=ut(t);return e===t?e:(Jt(e,"iterate",_a),ue(t)?e:e.map(Te))}function vs(t){return Jt(t=ut(t),"iterate",_a),t}function Le(t,e){return Je(t)?Kn(sn(t)?Te(e):e):Te(e)}const kp={__proto__:null,[Symbol.iterator](){return Fs(this,Symbol.iterator,t=>Le(this,t))},concat(...t){return Pn(this).concat(...t.map(e=>st(e)?Pn(e):e))},entries(){return Fs(this,"entries",t=>(t[1]=Le(this,t[1]),t))},every(t,e){return Me(this,"every",t,e,void 0,arguments)},filter(t,e){return Me(this,"filter",t,e,n=>n.map(a=>Le(this,a)),arguments)},find(t,e){return Me(this,"find",t,e,n=>Le(this,n),arguments)},findIndex(t,e){return Me(this,"findIndex",t,e,void 0,arguments)},findLast(t,e){return Me(this,"findLast",t,e,n=>Le(this,n),arguments)},findLastIndex(t,e){return Me(this,"findLastIndex",t,e,void 0,arguments)},forEach(t,e){return Me(this,"forEach",t,e,void 0,arguments)},includes(...t){return Ns(this,"includes",t)},indexOf(...t){return Ns(this,"indexOf",t)},join(t){return Pn(this).join(t)},lastIndexOf(...t){return Ns(this,"lastIndexOf",t)},map(t,e){return Me(this,"map",t,e,void 0,arguments)},pop(){return Xn(this,"pop")},push(...t){return Xn(this,"push",t)},reduce(t,...e){return pr(this,"reduce",t,e)},reduceRight(t,...e){return pr(this,"reduceRight",t,e)},shift(){return Xn(this,"shift")},some(t,e){return Me(this,"some",t,e,void 0,arguments)},splice(...t){return Xn(this,"splice",t)},toReversed(){return Pn(this).toReversed()},toSorted(t){return Pn(this).toSorted(t)},toSpliced(...t){return Pn(this).toSpliced(...t)},unshift(...t){return Xn(this,"unshift",t)},values(){return Fs(this,"values",t=>Le(this,t))}};function Fs(t,e,n){const a=vs(t),s=a[e]();return a!==t&&!ue(t)&&(s._next=s.next,s.next=()=>{const o=s._next();return o.done||(o.value=n(o.value)),o}),s}const Ep=Array.prototype;function Me(t,e,n,a,s,o){const r=vs(t),l=r!==t&&!ue(t),c=r[e];if(c!==Ep[e]){const u=c.apply(t,o);return l?Te(u):u}let p=n;r!==t&&(l?p=function(u,g){return n.call(this,Le(t,u),g,t)}:n.length>2&&(p=function(u,g){return n.call(this,u,g,t)}));const d=c.call(r,p,a);return l&&s?s(d):d}function pr(t,e,n,a){const s=vs(t),o=s!==t&&!ue(t);let r=n,l=!1;s!==t&&(o?(l=a.length===0,r=function(p,d,u){return l&&(l=!1,p=Le(t,p)),n.call(this,p,Le(t,d),u,t)}):n.length>3&&(r=function(p,d,u){return n.call(this,p,d,u,t)}));const c=s[e](r,...a);return l?Le(t,c):c}function Ns(t,e,n){const a=ut(t);Jt(a,"iterate",_a);const s=a[e](...n);return(s===-1||s===!1)&&Es(n[0])?(n[0]=ut(n[0]),a[e](...n)):s}function Xn(t,e,n=[]){Qe(),wo();const a=ut(t)[e].apply(t,n);return So(),Xe(),a}const yp=Ao("__proto__,__v_isRef,__isVue"),Xi=new Set(Object.getOwnPropertyNames(Symbol).filter(t=>t!=="arguments"&&t!=="caller").map(t=>Symbol[t]).filter(ge));function Tp(t){ge(t)||(t=String(t));const e=ut(this);return Jt(e,"has",t),e.hasOwnProperty(t)}class Ji{constructor(e=!1,n=!1){this._isReadonly=e,this._isShallow=n}get(e,n,a){if(n==="__v_skip")return e.__v_skip;const s=this._isReadonly,o=this._isShallow;if(n==="__v_isReactive")return!s;if(n==="__v_isReadonly")return s;if(n==="__v_isShallow")return o;if(n==="__v_raw")return a===(s?o?sl:al:o?nl:el).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(a)?e:void 0;const r=st(e);if(!s){let c;if(r&&(c=kp[n]))return c;if(n==="hasOwnProperty")return Tp}const l=Reflect.get(e,n,Gt(e)?e:a);if((ge(n)?Xi.has(n):yp(n))||(s||Jt(e,"get",n),o))return l;if(Gt(l)){const c=r&&_s(n)?l:l.value;return s&&ht(c)?Nn(c):c}return ht(l)?s?Nn(l):yn(l):l}}class Yi extends Ji{constructor(e=!1){super(!1,e)}set(e,n,a,s){let o=e[n];const r=st(e)&&_s(n);if(!this._isShallow){const p=Je(o);if(!ue(a)&&!Je(a)&&(o=ut(o),a=ut(a)),!r&&Gt(o)&&!Gt(a))return p||(o.value=a),!0}const l=r?Number(n)<e.length:vt(e,n),c=Reflect.set(e,n,a,Gt(e)?e:s);return e===ut(s)&&(l?Ie(a,o)&&Ze(e,"set",n,a):Ze(e,"add",n,a)),c}deleteProperty(e,n){const a=vt(e,n);e[n];const s=Reflect.deleteProperty(e,n);return s&&a&&Ze(e,"delete",n,void 0),s}has(e,n){const a=Reflect.has(e,n);return(!ge(n)||!Xi.has(n))&&Jt(e,"has",n),a}ownKeys(e){return Jt(e,"iterate",st(e)?"length":vn),Reflect.ownKeys(e)}}class tl extends Ji{constructor(e=!1){super(!0,e)}set(e,n){return!0}deleteProperty(e,n){return!0}}const Ap=new Yi,xp=new tl,Pp=new Yi(!0),wp=new tl(!0),io=t=>t,Va=t=>Reflect.getPrototypeOf(t);function Sp(t,e,n){return function(...a){const s=this.__v_raw,o=ut(s),r=Gn(o),l=t==="entries"||t===Symbol.iterator&&r,c=t==="keys"&&r,p=s[t](...a),d=n?io:e?Kn:Te;return!e&&Jt(o,"iterate",c?ro:vn),Kt(Object.create(p),{next(){const{value:u,done:g}=p.next();return g?{value:u,done:g}:{value:l?[d(u[0]),d(u[1])]:d(u),done:g}}})}}function Wa(t){return function(...e){return t==="delete"?!1:t==="clear"?void 0:this}}function Rp(t,e){const n={get(s){const o=this.__v_raw,r=ut(o),l=ut(s);t||(Ie(s,l)&&Jt(r,"get",s),Jt(r,"get",l));const{has:c}=Va(r),p=e?io:t?Kn:Te;if(c.call(r,s))return p(o.get(s));if(c.call(r,l))return p(o.get(l));o!==r&&o.get(s)},get size(){const s=this.__v_raw;return!t&&Jt(ut(s),"iterate",vn),s.size},has(s){const o=this.__v_raw,r=ut(o),l=ut(s);return t||(Ie(s,l)&&Jt(r,"has",s),Jt(r,"has",l)),s===l?o.has(s):o.has(s)||o.has(l)},forEach(s,o){const r=this,l=r.__v_raw,c=ut(l),p=e?io:t?Kn:Te;return!t&&Jt(c,"iterate",vn),l.forEach((d,u)=>s.call(o,p(d),p(u),r))}};return Kt(n,t?{add:Wa("add"),set:Wa("set"),delete:Wa("delete"),clear:Wa("clear")}:{add(s){const o=ut(this),r=Va(o),l=ut(s),c=!e&&!ue(s)&&!Je(s)?l:s;return r.has.call(o,c)||Ie(s,c)&&r.has.call(o,s)||Ie(l,c)&&r.has.call(o,l)||(o.add(c),Ze(o,"add",c,c)),this},set(s,o){!e&&!ue(o)&&!Je(o)&&(o=ut(o));const r=ut(this),{has:l,get:c}=Va(r);let p=l.call(r,s);p||(s=ut(s),p=l.call(r,s));const d=c.call(r,s);return r.set(s,o),p?Ie(o,d)&&Ze(r,"set",s,o):Ze(r,"add",s,o),this},delete(s){const o=ut(this),{has:r,get:l}=Va(o);let c=r.call(o,s);c||(s=ut(s),c=r.call(o,s)),l&&l.call(o,s);const p=o.delete(s);return c&&Ze(o,"delete",s,void 0),p},clear(){const s=ut(this),o=s.size!==0,r=s.clear();return o&&Ze(s,"clear",void 0,void 0),r}}),["keys","values","entries",Symbol.iterator].forEach(s=>{n[s]=Sp(s,t,e)}),n}function bs(t,e){const n=Rp(t,e);return(a,s,o)=>s==="__v_isReactive"?!t:s==="__v_isReadonly"?t:s==="__v_raw"?a:Reflect.get(vt(n,s)&&s in a?n:a,s,o)}const Dp={get:bs(!1,!1)},Cp={get:bs(!1,!0)},Lp={get:bs(!0,!1)},Ip={get:bs(!0,!0)},el=new WeakMap,nl=new WeakMap,al=new WeakMap,sl=new WeakMap;function Op(t){switch(t){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Gp(t){return t.__v_skip||!Object.isExtensible(t)?0:Op(ap(t))}function yn(t){return Je(t)?t:ks(t,!1,Ap,Dp,el)}function ol(t){return ks(t,!1,Pp,Cp,nl)}function Nn(t){return ks(t,!0,xp,Lp,al)}function Bp(t){return ks(t,!0,wp,Ip,sl)}function ks(t,e,n,a,s){if(!ht(t)||t.__v_raw&&!(e&&t.__v_isReactive))return t;const o=Gp(t);if(o===0)return t;const r=s.get(t);if(r)return r;const l=new Proxy(t,o===2?a:n);return s.set(t,l),l}function sn(t){return Je(t)?sn(t.__v_raw):!!(t&&t.__v_isReactive)}function Je(t){return!!(t&&t.__v_isReadonly)}function ue(t){return!!(t&&t.__v_isShallow)}function Es(t){return t?!!t.__v_raw:!1}function ut(t){const e=t&&t.__v_raw;return e?ut(e):t}function Vp(t){return!vt(t,"__v_skip")&&Object.isExtensible(t)&&Wi(t,"__v_skip",!0),t}const Te=t=>ht(t)?yn(t):t,Kn=t=>ht(t)?Nn(t):t;function Gt(t){return t?t.__v_isRef===!0:!1}function zt(t){return rl(t,!1)}function kt(t){return rl(t,!0)}function rl(t,e){return Gt(t)?t:new Wp(t,e)}class Wp{constructor(e,n){this.dep=new fs,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=n?e:ut(e),this._value=n?e:Te(e),this.__v_isShallow=n}get value(){return this.dep.track(),this._value}set value(e){const n=this._rawValue,a=this.__v_isShallow||ue(e)||Je(e);e=a?e:ut(e),Ie(e,n)&&(this._rawValue=e,this._value=a?e:Te(e),this.dep.trigger())}}function H(t){return Gt(t)?t.value:t}function Tt(t){return ct(t)?t():H(t)}const Mp={get:(t,e,n)=>e==="__v_raw"?t:H(Reflect.get(t,e,n)),set:(t,e,n,a)=>{const s=t[e];return Gt(s)&&!Gt(n)?(s.value=n,!0):Reflect.set(t,e,n,a)}};function il(t){return sn(t)?t:new Proxy(t,Mp)}class Fp{constructor(e){this.__v_isRef=!0,this._value=void 0;const n=this.dep=new fs,{get:a,set:s}=e(n.track.bind(n),n.trigger.bind(n));this._get=a,this._set=s}get value(){return this._value=this._get()}set value(e){this._set(e)}}function ll(t){return new Fp(t)}function cl(t){const e=st(t)?new Array(t.length):{};for(const n in t)e[n]=dl(t,n);return e}class Np{constructor(e,n,a){this._object=e,this._defaultValue=a,this.__v_isRef=!0,this._value=void 0,this._key=ge(n)?n:String(n),this._raw=ut(e);let s=!0,o=e;if(!st(e)||ge(this._key)||!_s(this._key))do s=!Es(o)||ue(o);while(s&&(o=o.__v_raw));this._shallow=s}get value(){let e=this._object[this._key];return this._shallow&&(e=H(e)),this._value=e===void 0?this._defaultValue:e}set value(e){if(this._shallow&&Gt(this._raw[this._key])){const n=this._object[this._key];if(Gt(n)){n.value=e;return}}this._object[this._key]=e}get dep(){return bp(this._raw,this._key)}}class Kp{constructor(e){this._getter=e,this.__v_isRef=!0,this.__v_isReadonly=!0,this._value=void 0}get value(){return this._value=this._getter()}}function pl(t,e,n){return Gt(t)?t:ct(t)?new Kp(t):ht(t)&&arguments.length>1?dl(t,e,n):zt(t)}function dl(t,e,n){return new Np(t,e,n)}class Hp{constructor(e,n,a){this.fn=e,this.setter=n,this._value=void 0,this.dep=new fs(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=ga-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!n,this.isSSR=a}notify(){if(this.flags|=16,!(this.flags&8)&&wt!==this)return Ui(this,!0),!0}get value(){const e=this.dep.track();return $i(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}}function jp(t,e,n=!1){let a,s;return ct(t)?a=t:(a=t.get,s=t.set),new Hp(a,s,n)}const Ma={},ns=new WeakMap;let gn;function Up(t,e=!1,n=gn){if(n){let a=ns.get(n);a||ns.set(n,a=[]),a.push(t)}}function Zp(t,e,n=yt){const{immediate:a,deep:s,once:o,scheduler:r,augmentJob:l,call:c}=n,p=k=>s?k:ue(k)||s===!1||s===0?qe(k,1):qe(k);let d,u,g,m,v=!1,b=!1;if(Gt(t)?(u=()=>t.value,v=ue(t)):sn(t)?(u=()=>p(t),v=!0):st(t)?(b=!0,v=t.some(k=>sn(k)||ue(k)),u=()=>t.map(k=>{if(Gt(k))return k.value;if(sn(k))return p(k);if(ct(k))return c?c(k,2):k()})):ct(t)?e?u=c?()=>c(t,2):t:u=()=>{if(g){Qe();try{g()}finally{Xe()}}const k=gn;gn=d;try{return c?c(t,3,[m]):t(m)}finally{gn=k}}:u=Oe,e&&s){const k=u,M=s===!0?1/0:s;u=()=>qe(k(),M)}const y=Ki(),R=()=>{d.stop(),y&&y.active&&xo(y.effects,d)};if(o&&e){const k=e;e=(...M)=>{k(...M),R()}}let A=b?new Array(t.length).fill(Ma):Ma;const h=k=>{if(!(!(d.flags&1)||!d.dirty&&!k))if(e){const M=d.run();if(s||v||(b?M.some((J,V)=>Ie(J,A[V])):Ie(M,A))){g&&g();const J=gn;gn=d;try{const V=[M,A===Ma?void 0:b&&A[0]===Ma?[]:A,m];A=M,c?c(e,3,V):e(...V)}finally{gn=J}}}else d.run()};return l&&l(h),d=new Hi(u),d.scheduler=r?()=>r(h,!1):h,m=k=>Up(k,!1,d),g=d.onStop=()=>{const k=ns.get(d);if(k){if(c)c(k,4);else for(const M of k)M();ns.delete(d)}},e?a?h(!0):A=d.run():r?r(h.bind(null,!0),!0):d.run(),R.pause=d.pause.bind(d),R.resume=d.resume.bind(d),R.stop=R,R}function qe(t,e=1/0,n){if(e<=0||!ht(t)||t.__v_skip||(n=n||new Map,(n.get(t)||0)>=e))return t;if(n.set(t,e),e--,Gt(t))qe(t.value,e,n);else if(st(t))for(let a=0;a<t.length;a++)qe(t[a],e,n);else if(Oi(t)||Gn(t))t.forEach(a=>{qe(a,e,n)});else if(Vi(t)){for(const a in t)qe(t[a],e,n);for(const a of Object.getOwnPropertySymbols(t))Object.prototype.propertyIsEnumerable.call(t,a)&&qe(t[a],e,n)}return t}/**
* @vue/runtime-core v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function xa(t,e,n,a){try{return a?t(...a):t()}catch(s){Pa(s,e,n)}}function Ae(t,e,n,a){if(ct(t)){const s=xa(t,e,n,a);return s&&Gi(s)&&s.catch(o=>{Pa(o,e,n)}),s}if(st(t)){const s=[];for(let o=0;o<t.length;o++)s.push(Ae(t[o],e,n,a));return s}}function Pa(t,e,n,a=!0){const s=e?e.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:r}=e&&e.appContext.config||yt;if(e){let l=e.parent;const c=e.proxy,p=`https://vuejs.org/error-reference/#runtime-${n}`;for(;l;){const d=l.ec;if(d){for(let u=0;u<d.length;u++)if(d[u](t,c,p)===!1)return}l=l.parent}if(o){Qe(),xa(o,null,10,[t,c,p]),Xe();return}}qp(t,n,s,a,r)}function qp(t,e,n,a=!0,s=!1){if(s)throw t;console.error(t)}const se=[];let Re=-1;const Bn=[];let nn=null,Dn=0;const ul=Promise.resolve();let as=null;function wa(t){const e=as||ul;return t?e.then(this?t.bind(this):t):e}function $p(t){let e=Re+1,n=se.length;for(;e<n;){const a=e+n>>>1,s=se[a],o=ma(s);o<t||o===t&&s.flags&2?e=a+1:n=a}return e}function Do(t){if(!(t.flags&1)){const e=ma(t),n=se[se.length-1];!n||!(t.flags&2)&&e>=ma(n)?se.push(t):se.splice($p(e),0,t),t.flags|=1,gl()}}function gl(){as||(as=ul.then(_l))}function zp(t){st(t)?Bn.push(...t):nn&&t.id===-1?nn.splice(Dn+1,0,t):t.flags&1||(Bn.push(t),t.flags|=1),gl()}function dr(t,e,n=Re+1){for(;n<se.length;n++){const a=se[n];if(a&&a.flags&2){if(t&&a.id!==t.uid)continue;se.splice(n,1),n--,a.flags&4&&(a.flags&=-2),a(),a.flags&4||(a.flags&=-2)}}}function ss(t){if(Bn.length){const e=[...new Set(Bn)].sort((n,a)=>ma(n)-ma(a));if(Bn.length=0,nn){nn.push(...e);return}for(nn=e,Dn=0;Dn<nn.length;Dn++){const n=nn[Dn];n.flags&4&&(n.flags&=-2),n.flags&8||n(),n.flags&=-2}nn=null,Dn=0}}const ma=t=>t.id==null?t.flags&2?-1:1/0:t.id;function _l(t){try{for(Re=0;Re<se.length;Re++){const e=se[Re];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),xa(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;Re<se.length;Re++){const e=se[Re];e&&(e.flags&=-2)}Re=-1,se.length=0,ss(),as=null,(se.length||Bn.length)&&_l()}}let qt=null,ml=null;function os(t){const e=qt;return qt=t,ml=t&&t.type.__scopeId||null,e}function Et(t,e=qt,n){if(!e||t._n)return t;const a=(...s)=>{a._d&&cs(-1);const o=os(e);let r;try{r=t(...s)}finally{os(o),a._d&&cs(1)}return r};return a._n=!0,a._c=!0,a._d=!0,a}function rs(t,e){if(qt===null)return t;const n=xs(qt),a=t.dirs||(t.dirs=[]);for(let s=0;s<e.length;s++){let[o,r,l,c=yt]=e[s];o&&(ct(o)&&(o={mounted:o,updated:o}),o.deep&&qe(r),a.push({dir:o,instance:n,value:r,oldValue:void 0,arg:l,modifiers:c}))}return t}function De(t,e,n,a){const s=t.dirs,o=e&&e.dirs;for(let r=0;r<s.length;r++){const l=s[r];o&&(l.oldValue=o[r].value);let c=l.dir[a];c&&(Qe(),Ae(c,n,8,[t.el,l,t,e]),Xe())}}function on(t,e){if(Zt){let n=Zt.provides;const a=Zt.parent&&Zt.parent.provides;a===n&&(n=Zt.provides=Object.create(a)),n[t]=e}}function Qt(t,e,n=!1){const a=Ve();if(a||kn){let s=kn?kn._context.provides:a?a.parent==null||a.ce?a.vnode.appContext&&a.vnode.appContext.provides:a.parent.provides:void 0;if(s&&t in s)return s[t];if(arguments.length>1)return n&&ct(e)?e.call(a&&a.proxy):e}}function hl(){return!!(Ve()||kn)}const Qp=Symbol.for("v-scx"),Xp=()=>Qt(Qp);function Jp(t,e){return Co(t,null,e)}function Yt(t,e,n){return Co(t,e,n)}function Co(t,e,n=yt){const{immediate:a,deep:s,flush:o,once:r}=n,l=Kt({},n),c=e&&a||!e&&o!=="post";let p;if(Hn){if(o==="sync"){const m=Xp();p=m.__watcherHandles||(m.__watcherHandles=[])}else if(!c){const m=()=>{};return m.stop=Oe,m.resume=Oe,m.pause=Oe,m}}const d=Zt;l.call=(m,v,b)=>Ae(m,d,v,b);let u=!1;o==="post"?l.scheduler=m=>{ie(m,d&&d.suspense)}:o!=="sync"&&(u=!0,l.scheduler=(m,v)=>{v?m():Do(m)}),l.augmentJob=m=>{e&&(m.flags|=4),u&&(m.flags|=2,d&&(m.id=d.uid,m.i=d))};const g=Zp(t,e,l);return Hn&&(p?p.push(g):c&&g()),g}function Yp(t,e,n){const a=this.proxy,s=Ot(t)?t.includes(".")?fl(a,t):()=>a[t]:t.bind(a,a);let o;ct(e)?o=e:(o=e.handler,n=e);const r=Ra(this),l=Co(s,o.bind(a),n);return r(),l}function fl(t,e){const n=e.split(".");return()=>{let a=t;for(let s=0;s<n.length&&a;s++)a=a[n[s]];return a}}const td=Symbol("_vte"),vl=t=>t.__isTeleport,Ce=Symbol("_leaveCb"),Jn=Symbol("_enterCb");function ed(){const t={isMounted:!1,isLeaving:!1,isUnmounting:!1,leavingVNodes:new Map};return re(()=>{t.isMounted=!0}),Io(()=>{t.isUnmounting=!0}),t}const _e=[Function,Array],bl={mode:String,appear:Boolean,persisted:Boolean,onBeforeEnter:_e,onEnter:_e,onAfterEnter:_e,onEnterCancelled:_e,onBeforeLeave:_e,onLeave:_e,onAfterLeave:_e,onLeaveCancelled:_e,onBeforeAppear:_e,onAppear:_e,onAfterAppear:_e,onAppearCancelled:_e},kl=t=>{const e=t.subTree;return e.component?kl(e.component):e},nd={name:"BaseTransition",props:bl,setup(t,{slots:e}){const n=Ve(),a=ed();return()=>{const s=e.default&&Tl(e.default(),!0);if(!s||!s.length)return;const o=El(s),r=ut(t),{mode:l}=r;if(a.isLeaving)return Ks(o);const c=ur(o);if(!c)return Ks(o);let p=lo(c,r,a,n,u=>p=u);c.type!==Ut&&ha(c,p);let d=n.subTree&&ur(n.subTree);if(d&&d.type!==Ut&&!mn(d,c)&&kl(n).type!==Ut){let u=lo(d,r,a,n);if(ha(d,u),l==="out-in"&&c.type!==Ut)return a.isLeaving=!0,u.afterLeave=()=>{a.isLeaving=!1,n.job.flags&8||n.update(),delete u.afterLeave,d=void 0},Ks(o);l==="in-out"&&c.type!==Ut?u.delayLeave=(g,m,v)=>{const b=yl(a,d);b[String(d.key)]=d,g[Ce]=()=>{m(),g[Ce]=void 0,delete p.delayedLeave,d=void 0},p.delayedLeave=()=>{v(),delete p.delayedLeave,d=void 0}}:d=void 0}else d&&(d=void 0);return o}}};function El(t){let e=t[0];if(t.length>1){for(const n of t)if(n.type!==Ut){e=n;break}}return e}const ad=nd;function yl(t,e){const{leavingVNodes:n}=t;let a=n.get(e.type);return a||(a=Object.create(null),n.set(e.type,a)),a}function lo(t,e,n,a,s){const{appear:o,mode:r,persisted:l=!1,onBeforeEnter:c,onEnter:p,onAfterEnter:d,onEnterCancelled:u,onBeforeLeave:g,onLeave:m,onAfterLeave:v,onLeaveCancelled:b,onBeforeAppear:y,onAppear:R,onAfterAppear:A,onAppearCancelled:h}=e,k=String(t.key),M=yl(n,t),J=(D,I)=>{D&&Ae(D,a,9,I)},V=(D,I)=>{const F=I[1];J(D,I),st(D)?D.every(T=>T.length<=1)&&F():D.length<=1&&F()},x={mode:r,persisted:l,beforeEnter(D){let I=c;if(!n.isMounted)if(o)I=y||c;else return;D[Ce]&&D[Ce](!0);const F=M[k];F&&mn(t,F)&&F.el[Ce]&&F.el[Ce](),J(I,[D])},enter(D){if(M[k]===t)return;let I=p,F=d,T=u;if(!n.isMounted)if(o)I=R||p,F=A||d,T=h||u;else return;let B=!1;D[Jn]=j=>{B||(B=!0,j?J(T,[D]):J(F,[D]),x.delayedLeave&&x.delayedLeave(),D[Jn]=void 0)};const W=D[Jn].bind(null,!1);I?V(I,[D,W]):W()},leave(D,I){const F=String(t.key);if(D[Jn]&&D[Jn](!0),n.isUnmounting)return I();J(g,[D]);let T=!1;D[Ce]=W=>{T||(T=!0,I(),W?J(b,[D]):J(v,[D]),D[Ce]=void 0,M[F]===t&&delete M[F])};const B=D[Ce].bind(null,!1);M[F]=t,m?V(m,[D,B]):B()},clone(D){const I=lo(D,e,n,a,s);return s&&s(I),I}};return x}function Ks(t){if(Sa(t))return t=rn(t),t.children=null,t}function ur(t){if(!Sa(t))return vl(t.type)&&t.children?El(t.children):t;if(t.component)return t.component.subTree;const{shapeFlag:e,children:n}=t;if(n){if(e&16)return n[0];if(e&32&&ct(n.default))return n.default()}}function ha(t,e){t.shapeFlag&6&&t.component?(t.transition=e,ha(t.component.subTree,e)):t.shapeFlag&128?(t.ssContent.transition=e.clone(t.ssContent),t.ssFallback.transition=e.clone(t.ssFallback)):t.transition=e}function Tl(t,e=!1,n){let a=[],s=0;for(let o=0;o<t.length;o++){let r=t[o];const l=n==null?r.key:String(n)+String(r.key!=null?r.key:o);r.type===bt?(r.patchFlag&128&&s++,a=a.concat(Tl(r.children,e,l))):(e||r.type!==Ut)&&a.push(l!=null?rn(r,{key:l}):r)}if(s>1)for(let o=0;o<a.length;o++)a[o].patchFlag=-2;return a}function dt(t,e){return ct(t)?Kt({name:t.name},e,{setup:t}):t}function sd(){const t=Ve();return t?(t.appContext.config.idPrefix||"v")+"-"+t.ids[0]+t.ids[1]++:""}function Lo(t){t.ids=[t.ids[0]+t.ids[2]+++"-",0,0]}function gr(t){const e=Ve(),n=kt(null);if(e){const s=e.refs===yt?e.refs={}:e.refs;Object.defineProperty(s,t,{enumerable:!0,get:()=>n.value,set:o=>n.value=o})}return n}function _r(t,e){let n;return!!((n=Object.getOwnPropertyDescriptor(t,e))&&!n.configurable)}const is=new WeakMap;function Vn(t,e,n,a,s=!1){if(st(t)){t.forEach((b,y)=>Vn(b,e&&(st(e)?e[y]:e),n,a,s));return}if(bn(a)&&!s){a.shapeFlag&512&&a.type.__asyncResolved&&a.component.subTree.component&&Vn(t,e,n,a.component.subTree);return}const o=a.shapeFlag&4?xs(a.component):a.el,r=s?null:o,{i:l,r:c}=t,p=e&&e.r,d=l.refs===yt?l.refs={}:l.refs,u=l.setupState,g=ut(u),m=u===yt?Ii:b=>_r(d,b)?!1:vt(g,b),v=(b,y)=>!(y&&_r(d,y));if(p!=null&&p!==c){if(mr(e),Ot(p))d[p]=null,m(p)&&(u[p]=null);else if(Gt(p)){const b=e;v(p,b.k)&&(p.value=null),b.k&&(d[b.k]=null)}}if(ct(c))xa(c,l,12,[r,d]);else{const b=Ot(c),y=Gt(c);if(b||y){const R=()=>{if(t.f){const A=b?m(c)?u[c]:d[c]:v()||!t.k?c.value:d[t.k];if(s)st(A)&&xo(A,o);else if(st(A))A.includes(o)||A.push(o);else if(b)d[c]=[o],m(c)&&(u[c]=d[c]);else{const h=[o];v(c,t.k)&&(c.value=h),t.k&&(d[t.k]=h)}}else b?(d[c]=r,m(c)&&(u[c]=r)):y&&(v(c,t.k)&&(c.value=r),t.k&&(d[t.k]=r))};if(r){const A=()=>{R(),is.delete(t)};A.id=-1,is.set(t,A),ie(A,n)}else mr(t),R()}}}function mr(t){const e=is.get(t);e&&(e.flags|=8,is.delete(t))}let hr=!1;const wn=()=>{hr||(console.error("Hydration completed but contains mismatches."),hr=!0)},od=t=>t.namespaceURI.includes("svg")&&t.tagName!=="foreignObject",rd=t=>t.namespaceURI.includes("MathML"),Fa=t=>{if(t.nodeType===1){if(od(t))return"svg";if(rd(t))return"mathml"}},Ln=t=>t.nodeType===8;function id(t){const{mt:e,p:n,o:{patchProp:a,createText:s,nextSibling:o,parentNode:r,remove:l,insert:c,createComment:p}}=t,d=(h,k)=>{if(!k.hasChildNodes()){n(null,h,k),ss(),k._vnode=h;return}u(k.firstChild,h,null,null,null),ss(),k._vnode=h},u=(h,k,M,J,V,x=!1)=>{x=x||!!k.dynamicChildren;const D=Ln(h)&&h.data==="[",I=()=>b(h,k,M,J,V,D),{type:F,ref:T,shapeFlag:B,patchFlag:W}=k;let j=h.nodeType;k.el=h,W===-2&&(x=!1,k.dynamicChildren=null);let P=null;switch(F){case En:j!==3?k.children===""?(c(k.el=s(""),r(h),h),P=h):P=I():(h.data!==k.children&&(wn(),h.data=k.children),P=o(h));break;case Ut:A(h)?(P=o(h),R(k.el=h.content.firstChild,h,M)):j!==8||D?P=I():P=o(h);break;case la:if(D&&(h=o(h),j=h.nodeType),j===1||j===3){P=h;const Y=!k.children.length;for(let U=0;U<k.staticCount;U++)Y&&(k.children+=P.nodeType===1?P.outerHTML:P.data),U===k.staticCount-1&&(k.anchor=P),P=o(P);return D?o(P):P}else I();break;case bt:D?P=v(h,k,M,J,V,x):P=I();break;default:if(B&1)(j!==1||k.type.toLowerCase()!==h.tagName.toLowerCase())&&!A(h)?P=I():P=g(h,k,M,J,V,x);else if(B&6){k.slotScopeIds=V;const Y=r(h);if(D?P=y(h):Ln(h)&&h.data==="teleport start"?P=y(h,h.data,"teleport end"):P=o(h),e(k,Y,null,M,J,Fa(Y),x),bn(k)&&!k.type.__asyncResolved){let U;D?(U=it(bt),U.anchor=P?P.previousSibling:Y.lastChild):U=h.nodeType===3?Ge(""):it("div"),U.el=h,k.component.subTree=U}}else B&64?j!==8?P=I():P=k.type.hydrate(h,k,M,J,V,x,t,m):B&128&&(P=k.type.hydrate(h,k,M,J,Fa(r(h)),V,x,t,u))}return T!=null&&Vn(T,null,J,k),P},g=(h,k,M,J,V,x)=>{x=x||!!k.dynamicChildren;const{type:D,props:I,patchFlag:F,shapeFlag:T,dirs:B,transition:W}=k,j=D==="input"||D==="option";if(j||F!==-1){B&&De(k,null,M,"created");let P=!1;if(A(h)){P=Nl(null,W)&&M&&M.vnode.props&&M.vnode.props.appear;const U=h.content.firstChild;if(P){const ot=U.getAttribute("class");ot&&(U.$cls=ot),W.beforeEnter(U)}R(U,h,M),k.el=h=U}if(T&16&&!(I&&(I.innerHTML||I.textContent))){let U=m(h.firstChild,k,h,M,J,V,x);for(;U;){Na(h,1)||wn();const ot=U;U=U.nextSibling,l(ot)}}else if(T&8){let U=k.children;U[0]===`
`&&(h.tagName==="PRE"||h.tagName==="TEXTAREA")&&(U=U.slice(1));const{textContent:ot}=h;ot!==U&&ot!==U.replace(/\r\n|\r/g,`
`)&&(Na(h,0)||wn(),h.textContent=k.children)}if(I){if(j||!x||F&48){const U=h.tagName.includes("-");for(const ot in I)(j&&(ot.endsWith("value")||ot==="indeterminate")||ya(ot)&&!fn(ot)||ot[0]==="."||U&&!fn(ot))&&a(h,ot,null,I[ot],void 0,M)}else if(I.onClick)a(h,"onClick",null,I.onClick,void 0,M);else if(F&4&&sn(I.style))for(const U in I.style)I.style[U]}let Y;(Y=I&&I.onVnodeBeforeMount)&&me(Y,M,k),B&&De(k,null,M,"beforeMount"),((Y=I&&I.onVnodeMounted)||B||P)&&Zl(()=>{Y&&me(Y,M,k),P&&W.enter(h),B&&De(k,null,M,"mounted")},J)}return h.nextSibling},m=(h,k,M,J,V,x,D)=>{D=D||!!k.dynamicChildren;const I=k.children,F=I.length;for(let T=0;T<F;T++){const B=D?I[T]:I[T]=fe(I[T]),W=B.type===En;h?(W&&!D&&T+1<F&&fe(I[T+1]).type===En&&(c(s(h.data.slice(B.children.length)),M,o(h)),h.data=B.children),h=u(h,B,J,V,x,D)):W&&!B.children?c(B.el=s(""),M):(Na(M,1)||wn(),n(null,B,M,null,J,V,Fa(M),x))}return h},v=(h,k,M,J,V,x)=>{const{slotScopeIds:D}=k;D&&(V=V?V.concat(D):D);const I=r(h),F=m(o(h),k,I,M,J,V,x);return F&&Ln(F)&&F.data==="]"?o(k.anchor=F):(wn(),c(k.anchor=p("]"),I,F),F)},b=(h,k,M,J,V,x)=>{if(Na(h.parentElement,1)||wn(),k.el=null,x){const F=y(h);for(;;){const T=o(h);if(T&&T!==F)l(T);else break}}const D=o(h),I=r(h);return l(h),n(null,k,I,D,M,J,Fa(I),V),M&&(M.vnode.el=k.el,Ll(M,k.el)),D},y=(h,k="[",M="]")=>{let J=0;for(;h;)if(h=o(h),h&&Ln(h)&&(h.data===k&&J++,h.data===M)){if(J===0)return o(h);J--}return h},R=(h,k,M)=>{const J=k.parentNode;J&&J.replaceChild(h,k);let V=M;for(;V;)V.vnode.el===k&&(V.vnode.el=V.subTree.el=h),V=V.parent},A=h=>h.nodeType===1&&h.tagName==="TEMPLATE";return[d,u]}const fr="data-allow-mismatch",ld={0:"text",1:"children",2:"class",3:"style",4:"attribute"};function Na(t,e){if(e===0||e===1)for(;t&&!t.hasAttribute(fr);)t=t.parentElement;const n=t&&t.getAttribute(fr);if(n==null)return!1;if(n==="")return!0;{const a=n.split(",");return e===0&&a.includes("children")?!0:a.includes(ld[e])}}hs().requestIdleCallback;hs().cancelIdleCallback;function cd(t,e){if(Ln(t)&&t.data==="["){let n=1,a=t.nextSibling;for(;a;){if(a.nodeType===1){if(e(a)===!1)break}else if(Ln(a))if(a.data==="]"){if(--n===0)break}else a.data==="["&&n++;a=a.nextSibling}}else e(t)}const bn=t=>!!t.type.__asyncLoader;function pd(t){ct(t)&&(t={loader:t});const{loader:e,loadingComponent:n,errorComponent:a,delay:s=200,hydrate:o,timeout:r,suspensible:l=!0,onError:c}=t;let p=null,d,u=0;const g=()=>(u++,p=null,m()),m=()=>{let v;return p||(v=p=e().catch(b=>{if(b=b instanceof Error?b:new Error(String(b)),c)return new Promise((y,R)=>{c(b,()=>y(g()),()=>R(b),u+1)});throw b}).then(b=>v!==p&&p?p:(b&&(b.__esModule||b[Symbol.toStringTag]==="Module")&&(b=b.default),d=b,b)))};return dt({name:"AsyncComponentWrapper",__asyncLoader:m,__asyncHydrate(v,b,y){let R=!1;(b.bu||(b.bu=[])).push(()=>R=!0);const A=()=>{R||y()},h=o?()=>{const k=o(A,M=>cd(v,M));k&&(b.bum||(b.bum=[])).push(k)}:A;d?h():m().then(()=>!b.isUnmounted&&h())},get __asyncResolved(){return d},setup(){const v=Zt;if(Lo(v),d)return()=>Ka(d,v);const b=h=>{p=null,Pa(h,v,13,!a)};if(l&&v.suspense||Hn)return m().then(h=>()=>Ka(h,v)).catch(h=>(b(h),()=>a?it(a,{error:h}):null));const y=zt(!1),R=zt(),A=zt(!!s);return s&&setTimeout(()=>{A.value=!1},s),r!=null&&setTimeout(()=>{if(!y.value&&!R.value){const h=new Error(`Async component timed out after ${r}ms.`);b(h),R.value=h}},r),m().then(()=>{y.value=!0,v.parent&&Sa(v.parent.vnode)&&v.parent.update()}).catch(h=>{b(h),R.value=h}),()=>{if(y.value&&d)return Ka(d,v);if(R.value&&a)return it(a,{error:R.value});if(n&&!A.value)return Ka(n,v)}}})}function Ka(t,e){const{ref:n,props:a,children:s,ce:o}=e.vnode,r=it(t,a,s);return r.ref=n,r.ce=o,delete e.vnode.ce,r}const Sa=t=>t.type.__isKeepAlive;function dd(t,e){Al(t,"a",e)}function ud(t,e){Al(t,"da",e)}function Al(t,e,n=Zt){const a=t.__wdc||(t.__wdc=()=>{let s=n;for(;s;){if(s.isDeactivated)return;s=s.parent}return t()});if(ys(e,a,n),n){let s=n.parent;for(;s&&s.parent;)Sa(s.parent.vnode)&&gd(a,e,n,s),s=s.parent}}function gd(t,e,n,a){const s=ys(e,t,a,!0);Ts(()=>{xo(a[e],s)},n)}function ys(t,e,n=Zt,a=!1){if(n){const s=n[t]||(n[t]=[]),o=e.__weh||(e.__weh=(...r)=>{Qe();const l=Ra(n),c=Ae(e,n,t,r);return l(),Xe(),c});return a?s.unshift(o):s.push(o),o}}const Ye=t=>(e,n=Zt)=>{(!Hn||t==="sp")&&ys(t,(...a)=>e(...a),n)},_d=Ye("bm"),re=Ye("m"),md=Ye("bu"),hd=Ye("u"),Io=Ye("bum"),Ts=Ye("um"),fd=Ye("sp"),vd=Ye("rtg"),bd=Ye("rtc");function kd(t,e=Zt){ys("ec",t,e)}const Ed="components";function xl(t,e){return Td(Ed,t,!0,e)||t}const yd=Symbol.for("v-ndc");function Td(t,e,n=!0,a=!1){const s=qt||Zt;if(s){const o=s.type;{const l=ou(o,!1);if(l&&(l===e||l===$t(e)||l===Aa($t(e))))return o}const r=vr(s[t]||o[t],e)||vr(s.appContext[t],e);return!r&&a?o:r}}function vr(t,e){return t&&(t[e]||t[$t(e)]||t[Aa($t(e))])}function xe(t,e,n,a){let s;const o=n,r=st(t);if(r||Ot(t)){const l=r&&sn(t);let c=!1,p=!1;l&&(c=!ue(t),p=Je(t),t=vs(t)),s=new Array(t.length);for(let d=0,u=t.length;d<u;d++)s[d]=e(c?p?Kn(Te(t[d])):Te(t[d]):t[d],d,void 0,o)}else if(typeof t=="number"){s=new Array(t);for(let l=0;l<t;l++)s[l]=e(l+1,l,void 0,o)}else if(ht(t))if(t[Symbol.iterator])s=Array.from(t,(l,c)=>e(l,c,void 0,o));else{const l=Object.keys(t);s=new Array(l.length);for(let c=0,p=l.length;c<p;c++){const d=l[c];s[c]=e(t[d],d,c,o)}}else s=[];return s}function Ad(t,e){for(let n=0;n<e.length;n++){const a=e[n];if(st(a))for(let s=0;s<a.length;s++)t[a[s].name]=a[s].fn;else a&&(t[a.name]=a.key?(...s)=>{const o=a.fn(...s);return o&&(o.key=a.key),o}:a.fn)}return t}function Rt(t,e,n={},a,s){if(qt.ce||qt.parent&&bn(qt.parent)&&qt.parent.ce){const p=Object.keys(n).length>0;return e!=="default"&&(n.name=e),N(),At(bt,null,[it("slot",n,a&&a())],p?-2:64)}let o=t[e];o&&o._c&&(o._d=!1),N();const r=o&&Pl(o(n)),l=n.key||r&&r.key,c=At(bt,{key:(l&&!ge(l)?l:`_${e}`)+(!r&&a?"_fb":"")},r||(a?a():[]),r&&t._===1?64:-2);return c.scopeId&&(c.slotScopeIds=[c.scopeId+"-s"]),o&&o._c&&(o._d=!0),c}function Pl(t){return t.some(e=>va(e)?!(e.type===Ut||e.type===bt&&!Pl(e.children)):!0)?t:null}const co=t=>t?zl(t)?xs(t):co(t.parent):null,ia=Kt(Object.create(null),{$:t=>t,$el:t=>t.vnode.el,$data:t=>t.data,$props:t=>t.props,$attrs:t=>t.attrs,$slots:t=>t.slots,$refs:t=>t.refs,$parent:t=>co(t.parent),$root:t=>co(t.root),$host:t=>t.ce,$emit:t=>t.emit,$options:t=>Sl(t),$forceUpdate:t=>t.f||(t.f=()=>{Do(t.update)}),$nextTick:t=>t.n||(t.n=wa.bind(t.proxy)),$watch:t=>Yp.bind(t)}),Hs=(t,e)=>t!==yt&&!t.__isScriptSetup&&vt(t,e),xd={get({_:t},e){if(e==="__v_skip")return!0;const{ctx:n,setupState:a,data:s,props:o,accessCache:r,type:l,appContext:c}=t;if(e[0]!=="$"){const g=r[e];if(g!==void 0)switch(g){case 1:return a[e];case 2:return s[e];case 4:return n[e];case 3:return o[e]}else{if(Hs(a,e))return r[e]=1,a[e];if(s!==yt&&vt(s,e))return r[e]=2,s[e];if(vt(o,e))return r[e]=3,o[e];if(n!==yt&&vt(n,e))return r[e]=4,n[e];po&&(r[e]=0)}}const p=ia[e];let d,u;if(p)return e==="$attrs"&&Jt(t.attrs,"get",""),p(t);if((d=l.__cssModules)&&(d=d[e]))return d;if(n!==yt&&vt(n,e))return r[e]=4,n[e];if(u=c.config.globalProperties,vt(u,e))return u[e]},set({_:t},e,n){const{data:a,setupState:s,ctx:o}=t;return Hs(s,e)?(s[e]=n,!0):a!==yt&&vt(a,e)?(a[e]=n,!0):vt(t.props,e)||e[0]==="$"&&e.slice(1)in t?!1:(o[e]=n,!0)},has({_:{data:t,setupState:e,accessCache:n,ctx:a,appContext:s,props:o,type:r}},l){let c;return!!(n[l]||t!==yt&&l[0]!=="$"&&vt(t,l)||Hs(e,l)||vt(o,l)||vt(a,l)||vt(ia,l)||vt(s.config.globalProperties,l)||(c=r.__cssModules)&&c[l])},defineProperty(t,e,n){return n.get!=null?t._.accessCache[e]=0:vt(n,"value")&&this.set(t,e,n.value,null),Reflect.defineProperty(t,e,n)}};function br(t){return st(t)?t.reduce((e,n)=>(e[n]=null,e),{}):t}let po=!0;function Pd(t){const e=Sl(t),n=t.proxy,a=t.ctx;po=!1,e.beforeCreate&&kr(e.beforeCreate,t,"bc");const{data:s,computed:o,methods:r,watch:l,provide:c,inject:p,created:d,beforeMount:u,mounted:g,beforeUpdate:m,updated:v,activated:b,deactivated:y,beforeDestroy:R,beforeUnmount:A,destroyed:h,unmounted:k,render:M,renderTracked:J,renderTriggered:V,errorCaptured:x,serverPrefetch:D,expose:I,inheritAttrs:F,components:T,directives:B,filters:W}=e;if(p&&wd(p,a,null),r)for(const Y in r){const U=r[Y];ct(U)&&(a[Y]=U.bind(n))}if(s){const Y=s.call(n,n);ht(Y)&&(t.data=yn(Y))}if(po=!0,o)for(const Y in o){const U=o[Y],ot=ct(U)?U.bind(n,n):ct(U.get)?U.get.bind(n,n):Oe,Ct=!ct(U)&&ct(U.set)?U.set.bind(n):Oe,Wt=G({get:ot,set:Ct});Object.defineProperty(a,Y,{enumerable:!0,configurable:!0,get:()=>Wt.value,set:Bt=>Wt.value=Bt})}if(l)for(const Y in l)wl(l[Y],a,n,Y);if(c){const Y=ct(c)?c.call(n):c;Reflect.ownKeys(Y).forEach(U=>{on(U,Y[U])})}d&&kr(d,t,"c");function P(Y,U){st(U)?U.forEach(ot=>Y(ot.bind(n))):U&&Y(U.bind(n))}if(P(_d,u),P(re,g),P(md,m),P(hd,v),P(dd,b),P(ud,y),P(kd,x),P(bd,J),P(vd,V),P(Io,A),P(Ts,k),P(fd,D),st(I))if(I.length){const Y=t.exposed||(t.exposed={});I.forEach(U=>{Object.defineProperty(Y,U,{get:()=>n[U],set:ot=>n[U]=ot,enumerable:!0})})}else t.exposed||(t.exposed={});M&&t.render===Oe&&(t.render=M),F!=null&&(t.inheritAttrs=F),T&&(t.components=T),B&&(t.directives=B),D&&Lo(t)}function wd(t,e,n=Oe){st(t)&&(t=uo(t));for(const a in t){const s=t[a];let o;ht(s)?"default"in s?o=Qt(s.from||a,s.default,!0):o=Qt(s.from||a):o=Qt(s),Gt(o)?Object.defineProperty(e,a,{enumerable:!0,configurable:!0,get:()=>o.value,set:r=>o.value=r}):e[a]=o}}function kr(t,e,n){Ae(st(t)?t.map(a=>a.bind(e.proxy)):t.bind(e.proxy),e,n)}function wl(t,e,n,a){let s=a.includes(".")?fl(n,a):()=>n[a];if(Ot(t)){const o=e[t];ct(o)&&Yt(s,o)}else if(ct(t))Yt(s,t.bind(n));else if(ht(t))if(st(t))t.forEach(o=>wl(o,e,n,a));else{const o=ct(t.handler)?t.handler.bind(n):e[t.handler];ct(o)&&Yt(s,o,t)}}function Sl(t){const e=t.type,{mixins:n,extends:a}=e,{mixins:s,optionsCache:o,config:{optionMergeStrategies:r}}=t.appContext,l=o.get(e);let c;return l?c=l:!s.length&&!n&&!a?c=e:(c={},s.length&&s.forEach(p=>ls(c,p,r,!0)),ls(c,e,r)),ht(e)&&o.set(e,c),c}function ls(t,e,n,a=!1){const{mixins:s,extends:o}=e;o&&ls(t,o,n,!0),s&&s.forEach(r=>ls(t,r,n,!0));for(const r in e)if(!(a&&r==="expose")){const l=Sd[r]||n&&n[r];t[r]=l?l(t[r],e[r]):e[r]}return t}const Sd={data:Er,props:yr,emits:yr,methods:aa,computed:aa,beforeCreate:ne,created:ne,beforeMount:ne,mounted:ne,beforeUpdate:ne,updated:ne,beforeDestroy:ne,beforeUnmount:ne,destroyed:ne,unmounted:ne,activated:ne,deactivated:ne,errorCaptured:ne,serverPrefetch:ne,components:aa,directives:aa,watch:Dd,provide:Er,inject:Rd};function Er(t,e){return e?t?function(){return Kt(ct(t)?t.call(this,this):t,ct(e)?e.call(this,this):e)}:e:t}function Rd(t,e){return aa(uo(t),uo(e))}function uo(t){if(st(t)){const e={};for(let n=0;n<t.length;n++)e[t[n]]=t[n];return e}return t}function ne(t,e){return t?[...new Set([].concat(t,e))]:e}function aa(t,e){return t?Kt(Object.create(null),t,e):e}function yr(t,e){return t?st(t)&&st(e)?[...new Set([...t,...e])]:Kt(Object.create(null),br(t),br(e??{})):e}function Dd(t,e){if(!t)return e;if(!e)return t;const n=Kt(Object.create(null),t);for(const a in e)n[a]=ne(t[a],e[a]);return n}function Rl(){return{app:null,config:{isNativeTag:Ii,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Cd=0;function Ld(t,e){return function(a,s=null){ct(a)||(a=Kt({},a)),s!=null&&!ht(s)&&(s=null);const o=Rl(),r=new WeakSet,l=[];let c=!1;const p=o.app={_uid:Cd++,_component:a,_props:s,_container:null,_context:o,_instance:null,version:iu,get config(){return o.config},set config(d){},use(d,...u){return r.has(d)||(d&&ct(d.install)?(r.add(d),d.install(p,...u)):ct(d)&&(r.add(d),d(p,...u))),p},mixin(d){return o.mixins.includes(d)||o.mixins.push(d),p},component(d,u){return u?(o.components[d]=u,p):o.components[d]},directive(d,u){return u?(o.directives[d]=u,p):o.directives[d]},mount(d,u,g){if(!c){const m=p._ceVNode||it(a,s);return m.appContext=o,g===!0?g="svg":g===!1&&(g=void 0),u&&e?e(m,d):t(m,d,g),c=!0,p._container=d,d.__vue_app__=p,xs(m.component)}},onUnmount(d){l.push(d)},unmount(){c&&(Ae(l,p._instance,16),t(null,p._container),delete p._container.__vue_app__)},provide(d,u){return o.provides[d]=u,p},runWithContext(d){const u=kn;kn=p;try{return d()}finally{kn=u}}};return p}}let kn=null;const Id=(t,e)=>e==="modelValue"||e==="model-value"?t.modelModifiers:t[`${e}Modifiers`]||t[`${$t(e)}Modifiers`]||t[`${ln(e)}Modifiers`];function Od(t,e,...n){if(t.isUnmounted)return;const a=t.vnode.props||yt;let s=n;const o=e.startsWith("update:"),r=o&&Id(a,e.slice(7));r&&(r.trim&&(s=n.map(d=>Ot(d)?d.trim():d)),r.number&&(s=n.map(rp)));let l,c=a[l=Gs(e)]||a[l=Gs($t(e))];!c&&o&&(c=a[l=Gs(ln(e))]),c&&Ae(c,t,6,s);const p=a[l+"Once"];if(p){if(!t.emitted)t.emitted={};else if(t.emitted[l])return;t.emitted[l]=!0,Ae(p,t,6,s)}}const Gd=new WeakMap;function Dl(t,e,n=!1){const a=n?Gd:e.emitsCache,s=a.get(t);if(s!==void 0)return s;const o=t.emits;let r={},l=!1;if(!ct(t)){const c=p=>{const d=Dl(p,e,!0);d&&(l=!0,Kt(r,d))};!n&&e.mixins.length&&e.mixins.forEach(c),t.extends&&c(t.extends),t.mixins&&t.mixins.forEach(c)}return!o&&!l?(ht(t)&&a.set(t,null),null):(st(o)?o.forEach(c=>r[c]=null):Kt(r,o),ht(t)&&a.set(t,r),r)}function As(t,e){return!t||!ya(e)?!1:(e=e.slice(2).replace(/Once$/,""),vt(t,e[0].toLowerCase()+e.slice(1))||vt(t,ln(e))||vt(t,e))}function js(t){const{type:e,vnode:n,proxy:a,withProxy:s,propsOptions:[o],slots:r,attrs:l,emit:c,render:p,renderCache:d,props:u,data:g,setupState:m,ctx:v,inheritAttrs:b}=t,y=os(t);let R,A;try{if(n.shapeFlag&4){const k=s||a,M=k;R=fe(p.call(M,k,d,u,m,g,v)),A=l}else{const k=e;R=fe(k.length>1?k(u,{attrs:l,slots:r,emit:c}):k(u,null)),A=e.props?l:Bd(l)}}catch(k){ca.length=0,Pa(k,t,1),R=it(Ut)}let h=R;if(A&&b!==!1){const k=Object.keys(A),{shapeFlag:M}=h;k.length&&M&7&&(o&&k.some(gs)&&(A=Vd(A,o)),h=rn(h,A,!1,!0))}return n.dirs&&(h=rn(h,null,!1,!0),h.dirs=h.dirs?h.dirs.concat(n.dirs):n.dirs),n.transition&&ha(h,n.transition),R=h,os(y),R}const Bd=t=>{let e;for(const n in t)(n==="class"||n==="style"||ya(n))&&((e||(e={}))[n]=t[n]);return e},Vd=(t,e)=>{const n={};for(const a in t)(!gs(a)||!(a.slice(9)in e))&&(n[a]=t[a]);return n};function Wd(t,e,n){const{props:a,children:s,component:o}=t,{props:r,children:l,patchFlag:c}=e,p=o.emitsOptions;if(e.dirs||e.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return a?Tr(a,r,p):!!r;if(c&8){const d=e.dynamicProps;for(let u=0;u<d.length;u++){const g=d[u];if(Cl(r,a,g)&&!As(p,g))return!0}}}else return(s||l)&&(!l||!l.$stable)?!0:a===r?!1:a?r?Tr(a,r,p):!0:!!r;return!1}function Tr(t,e,n){const a=Object.keys(e);if(a.length!==Object.keys(t).length)return!0;for(let s=0;s<a.length;s++){const o=a[s];if(Cl(e,t,o)&&!As(n,o))return!0}return!1}function Cl(t,e,n){const a=t[n],s=e[n];return n==="style"&&ht(a)&&ht(s)?!Po(a,s):a!==s}function Ll({vnode:t,parent:e,suspense:n},a){for(;e;){const s=e.subTree;if(s.suspense&&s.suspense.activeBranch===t&&(s.suspense.vnode.el=s.el=a,t=s),s===t)(t=e.vnode).el=a,e=e.parent;else break}n&&n.activeBranch===t&&(n.vnode.el=a)}const Il={},Ol=()=>Object.create(Il),Gl=t=>Object.getPrototypeOf(t)===Il;function Md(t,e,n,a=!1){const s={},o=Ol();t.propsDefaults=Object.create(null),Bl(t,e,s,o);for(const r in t.propsOptions[0])r in s||(s[r]=void 0);n?t.props=a?s:ol(s):t.type.props?t.props=s:t.props=o,t.attrs=o}function Fd(t,e,n,a){const{props:s,attrs:o,vnode:{patchFlag:r}}=t,l=ut(s),[c]=t.propsOptions;let p=!1;if((a||r>0)&&!(r&16)){if(r&8){const d=t.vnode.dynamicProps;for(let u=0;u<d.length;u++){let g=d[u];if(As(t.emitsOptions,g))continue;const m=e[g];if(c)if(vt(o,g))m!==o[g]&&(o[g]=m,p=!0);else{const v=$t(g);s[v]=go(c,l,v,m,t,!1)}else m!==o[g]&&(o[g]=m,p=!0)}}}else{Bl(t,e,s,o)&&(p=!0);let d;for(const u in l)(!e||!vt(e,u)&&((d=ln(u))===u||!vt(e,d)))&&(c?n&&(n[u]!==void 0||n[d]!==void 0)&&(s[u]=go(c,l,u,void 0,t,!0)):delete s[u]);if(o!==l)for(const u in o)(!e||!vt(e,u))&&(delete o[u],p=!0)}p&&Ze(t.attrs,"set","")}function Bl(t,e,n,a){const[s,o]=t.propsOptions;let r=!1,l;if(e)for(let c in e){if(fn(c))continue;const p=e[c];let d;s&&vt(s,d=$t(c))?!o||!o.includes(d)?n[d]=p:(l||(l={}))[d]=p:As(t.emitsOptions,c)||(!(c in a)||p!==a[c])&&(a[c]=p,r=!0)}if(o){const c=ut(n),p=l||yt;for(let d=0;d<o.length;d++){const u=o[d];n[u]=go(s,c,u,p[u],t,!vt(p,u))}}return r}function go(t,e,n,a,s,o){const r=t[n];if(r!=null){const l=vt(r,"default");if(l&&a===void 0){const c=r.default;if(r.type!==Function&&!r.skipFactory&&ct(c)){const{propsDefaults:p}=s;if(n in p)a=p[n];else{const d=Ra(s);a=p[n]=c.call(null,e),d()}}else a=c;s.ce&&s.ce._setProp(n,a)}r[0]&&(o&&!l?a=!1:r[1]&&(a===""||a===ln(n))&&(a=!0))}return a}const Nd=new WeakMap;function Vl(t,e,n=!1){const a=n?Nd:e.propsCache,s=a.get(t);if(s)return s;const o=t.props,r={},l=[];let c=!1;if(!ct(t)){const d=u=>{c=!0;const[g,m]=Vl(u,e,!0);Kt(r,g),m&&l.push(...m)};!n&&e.mixins.length&&e.mixins.forEach(d),t.extends&&d(t.extends),t.mixins&&t.mixins.forEach(d)}if(!o&&!c)return ht(t)&&a.set(t,On),On;if(st(o))for(let d=0;d<o.length;d++){const u=$t(o[d]);Ar(u)&&(r[u]=yt)}else if(o)for(const d in o){const u=$t(d);if(Ar(u)){const g=o[d],m=r[u]=st(g)||ct(g)?{type:g}:Kt({},g),v=m.type;let b=!1,y=!0;if(st(v))for(let R=0;R<v.length;++R){const A=v[R],h=ct(A)&&A.name;if(h==="Boolean"){b=!0;break}else h==="String"&&(y=!1)}else b=ct(v)&&v.name==="Boolean";m[0]=b,m[1]=y,(b||vt(m,"default"))&&l.push(u)}}const p=[r,l];return ht(t)&&a.set(t,p),p}function Ar(t){return t[0]!=="$"&&!fn(t)}const Oo=t=>t==="_"||t==="_ctx"||t==="$stable",Go=t=>st(t)?t.map(fe):[fe(t)],Kd=(t,e,n)=>{if(e._n)return e;const a=Et((...s)=>Go(e(...s)),n);return a._c=!1,a},Wl=(t,e,n)=>{const a=t._ctx;for(const s in t){if(Oo(s))continue;const o=t[s];if(ct(o))e[s]=Kd(s,o,a);else if(o!=null){const r=Go(o);e[s]=()=>r}}},Ml=(t,e)=>{const n=Go(e);t.slots.default=()=>n},Fl=(t,e,n)=>{for(const a in e)(n||!Oo(a))&&(t[a]=e[a])},Hd=(t,e,n)=>{const a=t.slots=Ol();if(t.vnode.shapeFlag&32){const s=e._;s?(Fl(a,e,n),n&&Wi(a,"_",s,!0)):Wl(e,a)}else e&&Ml(t,e)},jd=(t,e,n)=>{const{vnode:a,slots:s}=t;let o=!0,r=yt;if(a.shapeFlag&32){const l=e._;l?n&&l===1?o=!1:Fl(s,e,n):(o=!e.$stable,Wl(e,s)),r=e}else e&&(Ml(t,e),r={default:1});if(o)for(const l in s)!Oo(l)&&r[l]==null&&delete s[l]},ie=Zl;function Ud(t){return Zd(t,id)}function Zd(t,e){const n=hs();n.__VUE__=!0;const{insert:a,remove:s,patchProp:o,createElement:r,createText:l,createComment:c,setText:p,setElementText:d,parentNode:u,nextSibling:g,setScopeId:m=Oe,insertStaticContent:v}=t,b=(_,f,E,C=null,w=null,L=null,$=void 0,Z=null,K=!!f.dynamicChildren)=>{if(_===f)return;_&&!mn(_,f)&&(C=S(_),Bt(_,w,L,!0),_=null),f.patchFlag===-2&&(K=!1,f.dynamicChildren=null);const{type:O,ref:rt,shapeFlag:X}=f;switch(O){case En:y(_,f,E,C);break;case Ut:R(_,f,E,C);break;case la:_==null&&A(f,E,C,$);break;case bt:T(_,f,E,C,w,L,$,Z,K);break;default:X&1?M(_,f,E,C,w,L,$,Z,K):X&6?B(_,f,E,C,w,L,$,Z,K):(X&64||X&128)&&O.process(_,f,E,C,w,L,$,Z,K,et)}rt!=null&&w?Vn(rt,_&&_.ref,L,f||_,!f):rt==null&&_&&_.ref!=null&&Vn(_.ref,null,L,_,!0)},y=(_,f,E,C)=>{if(_==null)a(f.el=l(f.children),E,C);else{const w=f.el=_.el;f.children!==_.children&&p(w,f.children)}},R=(_,f,E,C)=>{_==null?a(f.el=c(f.children||""),E,C):f.el=_.el},A=(_,f,E,C)=>{[_.el,_.anchor]=v(_.children,f,E,C,_.el,_.anchor)},h=({el:_,anchor:f},E,C)=>{let w;for(;_&&_!==f;)w=g(_),a(_,E,C),_=w;a(f,E,C)},k=({el:_,anchor:f})=>{let E;for(;_&&_!==f;)E=g(_),s(_),_=E;s(f)},M=(_,f,E,C,w,L,$,Z,K)=>{if(f.type==="svg"?$="svg":f.type==="math"&&($="mathml"),_==null)J(f,E,C,w,L,$,Z,K);else{const O=_.el&&_.el._isVueCE?_.el:null;try{O&&O._beginPatch(),D(_,f,w,L,$,Z,K)}finally{O&&O._endPatch()}}},J=(_,f,E,C,w,L,$,Z)=>{let K,O;const{props:rt,shapeFlag:X,transition:at,dirs:lt}=_;if(K=_.el=r(_.type,L,rt&&rt.is,rt),X&8?d(K,_.children):X&16&&x(_.children,K,null,C,w,Us(_,L),$,Z),lt&&De(_,null,C,"created"),V(K,_,_.scopeId,$,C),rt){for(const xt in rt)xt!=="value"&&!fn(xt)&&o(K,xt,null,rt[xt],L,C);"value"in rt&&o(K,"value",null,rt.value,L),(O=rt.onVnodeBeforeMount)&&me(O,C,_)}lt&&De(_,null,C,"beforeMount");const gt=Nl(w,at);gt&&at.beforeEnter(K),a(K,f,E),((O=rt&&rt.onVnodeMounted)||gt||lt)&&ie(()=>{try{O&&me(O,C,_),gt&&at.enter(K),lt&&De(_,null,C,"mounted")}finally{}},w)},V=(_,f,E,C,w)=>{if(E&&m(_,E),C)for(let L=0;L<C.length;L++)m(_,C[L]);if(w){let L=w.subTree;if(f===L||Ul(L.type)&&(L.ssContent===f||L.ssFallback===f)){const $=w.vnode;V(_,$,$.scopeId,$.slotScopeIds,w.parent)}}},x=(_,f,E,C,w,L,$,Z,K=0)=>{for(let O=K;O<_.length;O++){const rt=_[O]=Z?Ue(_[O]):fe(_[O]);b(null,rt,f,E,C,w,L,$,Z)}},D=(_,f,E,C,w,L,$)=>{const Z=f.el=_.el;let{patchFlag:K,dynamicChildren:O,dirs:rt}=f;K|=_.patchFlag&16;const X=_.props||yt,at=f.props||yt;let lt;if(E&&cn(E,!1),(lt=at.onVnodeBeforeUpdate)&&me(lt,E,f,_),rt&&De(f,_,E,"beforeUpdate"),E&&cn(E,!0),(X.innerHTML&&at.innerHTML==null||X.textContent&&at.textContent==null)&&d(Z,""),O?I(_.dynamicChildren,O,Z,E,C,Us(f,w),L):$||U(_,f,Z,null,E,C,Us(f,w),L,!1),K>0){if(K&16)F(Z,X,at,E,w);else if(K&2&&X.class!==at.class&&o(Z,"class",null,at.class,w),K&4&&o(Z,"style",X.style,at.style,w),K&8){const gt=f.dynamicProps;for(let xt=0;xt<gt.length;xt++){const Pt=gt[xt],Vt=X[Pt],Ft=at[Pt];(Ft!==Vt||Pt==="value")&&o(Z,Pt,Vt,Ft,w,E)}}K&1&&_.children!==f.children&&d(Z,f.children)}else!$&&O==null&&F(Z,X,at,E,w);((lt=at.onVnodeUpdated)||rt)&&ie(()=>{lt&&me(lt,E,f,_),rt&&De(f,_,E,"updated")},C)},I=(_,f,E,C,w,L,$)=>{for(let Z=0;Z<f.length;Z++){const K=_[Z],O=f[Z],rt=K.el&&(K.type===bt||!mn(K,O)||K.shapeFlag&198)?u(K.el):E;b(K,O,rt,null,C,w,L,$,!0)}},F=(_,f,E,C,w)=>{if(f!==E){if(f!==yt)for(const L in f)!fn(L)&&!(L in E)&&o(_,L,f[L],null,w,C);for(const L in E){if(fn(L))continue;const $=E[L],Z=f[L];$!==Z&&L!=="value"&&o(_,L,Z,$,w,C)}"value"in E&&o(_,"value",f.value,E.value,w)}},T=(_,f,E,C,w,L,$,Z,K)=>{const O=f.el=_?_.el:l(""),rt=f.anchor=_?_.anchor:l("");let{patchFlag:X,dynamicChildren:at,slotScopeIds:lt}=f;lt&&(Z=Z?Z.concat(lt):lt),_==null?(a(O,E,C),a(rt,E,C),x(f.children||[],E,rt,w,L,$,Z,K)):X>0&&X&64&&at&&_.dynamicChildren&&_.dynamicChildren.length===at.length?(I(_.dynamicChildren,at,E,w,L,$,Z),(f.key!=null||w&&f===w.subTree)&&Kl(_,f,!0)):U(_,f,E,rt,w,L,$,Z,K)},B=(_,f,E,C,w,L,$,Z,K)=>{f.slotScopeIds=Z,_==null?f.shapeFlag&512?w.ctx.activate(f,E,C,$,K):W(f,E,C,w,L,$,K):j(_,f,K)},W=(_,f,E,C,w,L,$)=>{const Z=_.component=tu(_,C,w);if(Sa(_)&&(Z.ctx.renderer=et),eu(Z,!1,$),Z.asyncDep){if(w&&w.registerDep(Z,P,$),!_.el){const K=Z.subTree=it(Ut);R(null,K,f,E),_.placeholder=K.el}}else P(Z,_,f,E,w,L,$)},j=(_,f,E)=>{const C=f.component=_.component;if(Wd(_,f,E))if(C.asyncDep&&!C.asyncResolved){Y(C,f,E);return}else C.next=f,C.update();else f.el=_.el,C.vnode=f},P=(_,f,E,C,w,L,$)=>{const Z=()=>{if(_.isMounted){let{next:X,bu:at,u:lt,parent:gt,vnode:xt}=_;{const le=Hl(_);if(le){X&&(X.el=xt.el,Y(_,X,$)),le.asyncDep.then(()=>{ie(()=>{_.isUnmounted||O()},w)});return}}let Pt=X,Vt;cn(_,!1),X?(X.el=xt.el,Y(_,X,$)):X=xt,at&&Bs(at),(Vt=X.props&&X.props.onVnodeBeforeUpdate)&&me(Vt,gt,X,xt),cn(_,!0);const Ft=js(_),be=_.subTree;_.subTree=Ft,b(be,Ft,u(be.el),S(be),_,w,L),X.el=Ft.el,Pt===null&&Ll(_,Ft.el),lt&&ie(lt,w),(Vt=X.props&&X.props.onVnodeUpdated)&&ie(()=>me(Vt,gt,X,xt),w)}else{let X;const{el:at,props:lt}=f,{bm:gt,m:xt,parent:Pt,root:Vt,type:Ft}=_,be=bn(f);if(cn(_,!1),gt&&Bs(gt),!be&&(X=lt&&lt.onVnodeBeforeMount)&&me(X,Pt,f),cn(_,!0),at&&_t){const le=()=>{_.subTree=js(_),_t(at,_.subTree,_,w,null)};be&&Ft.__asyncHydrate?Ft.__asyncHydrate(at,_,le):le()}else{Vt.ce&&Vt.ce._hasShadowRoot()&&Vt.ce._injectChildStyle(Ft,_.parent?_.parent.type:void 0);const le=_.subTree=js(_);b(null,le,E,C,_,w,L),f.el=le.el}if(xt&&ie(xt,w),!be&&(X=lt&&lt.onVnodeMounted)){const le=f;ie(()=>me(X,Pt,le),w)}(f.shapeFlag&256||Pt&&bn(Pt.vnode)&&Pt.vnode.shapeFlag&256)&&_.a&&ie(_.a,w),_.isMounted=!0,f=E=C=null}};_.scope.on();const K=_.effect=new Hi(Z);_.scope.off();const O=_.update=K.run.bind(K),rt=_.job=K.runIfDirty.bind(K);rt.i=_,rt.id=_.uid,K.scheduler=()=>Do(rt),cn(_,!0),O()},Y=(_,f,E)=>{f.component=_;const C=_.vnode.props;_.vnode=f,_.next=null,Fd(_,f.props,C,E),jd(_,f.children,E),Qe(),dr(_),Xe()},U=(_,f,E,C,w,L,$,Z,K=!1)=>{const O=_&&_.children,rt=_?_.shapeFlag:0,X=f.children,{patchFlag:at,shapeFlag:lt}=f;if(at>0){if(at&128){Ct(O,X,E,C,w,L,$,Z,K);return}else if(at&256){ot(O,X,E,C,w,L,$,Z,K);return}}lt&8?(rt&16&&jt(O,w,L),X!==O&&d(E,X)):rt&16?lt&16?Ct(O,X,E,C,w,L,$,Z,K):jt(O,w,L,!0):(rt&8&&d(E,""),lt&16&&x(X,E,C,w,L,$,Z,K))},ot=(_,f,E,C,w,L,$,Z,K)=>{_=_||On,f=f||On;const O=_.length,rt=f.length,X=Math.min(O,rt);let at;for(at=0;at<X;at++){const lt=f[at]=K?Ue(f[at]):fe(f[at]);b(_[at],lt,E,null,w,L,$,Z,K)}O>rt?jt(_,w,L,!0,!1,X):x(f,E,C,w,L,$,Z,K,X)},Ct=(_,f,E,C,w,L,$,Z,K)=>{let O=0;const rt=f.length;let X=_.length-1,at=rt-1;for(;O<=X&&O<=at;){const lt=_[O],gt=f[O]=K?Ue(f[O]):fe(f[O]);if(mn(lt,gt))b(lt,gt,E,null,w,L,$,Z,K);else break;O++}for(;O<=X&&O<=at;){const lt=_[X],gt=f[at]=K?Ue(f[at]):fe(f[at]);if(mn(lt,gt))b(lt,gt,E,null,w,L,$,Z,K);else break;X--,at--}if(O>X){if(O<=at){const lt=at+1,gt=lt<rt?f[lt].el:C;for(;O<=at;)b(null,f[O]=K?Ue(f[O]):fe(f[O]),E,gt,w,L,$,Z,K),O++}}else if(O>at)for(;O<=X;)Bt(_[O],w,L,!0),O++;else{const lt=O,gt=O,xt=new Map;for(O=gt;O<=at;O++){const ce=f[O]=K?Ue(f[O]):fe(f[O]);ce.key!=null&&xt.set(ce.key,O)}let Pt,Vt=0;const Ft=at-gt+1;let be=!1,le=0;const Qn=new Array(Ft);for(O=0;O<Ft;O++)Qn[O]=0;for(O=lt;O<=X;O++){const ce=_[O];if(Vt>=Ft){Bt(ce,w,L,!0);continue}let Se;if(ce.key!=null)Se=xt.get(ce.key);else for(Pt=gt;Pt<=at;Pt++)if(Qn[Pt-gt]===0&&mn(ce,f[Pt])){Se=Pt;break}Se===void 0?Bt(ce,w,L,!0):(Qn[Se-gt]=O+1,Se>=le?le=Se:be=!0,b(ce,f[Se],E,null,w,L,$,Z,K),Vt++)}const sr=be?qd(Qn):On;for(Pt=sr.length-1,O=Ft-1;O>=0;O--){const ce=gt+O,Se=f[ce],or=f[ce+1],rr=ce+1<rt?or.el||jl(or):C;Qn[O]===0?b(null,Se,E,rr,w,L,$,Z,K):be&&(Pt<0||O!==sr[Pt]?Wt(Se,E,rr,2):Pt--)}}},Wt=(_,f,E,C,w=null)=>{const{el:L,type:$,transition:Z,children:K,shapeFlag:O}=_;if(O&6){Wt(_.component.subTree,f,E,C);return}if(O&128){_.suspense.move(f,E,C);return}if(O&64){$.move(_,f,E,et);return}if($===bt){a(L,f,E);for(let X=0;X<K.length;X++)Wt(K[X],f,E,C);a(_.anchor,f,E);return}if($===la){h(_,f,E);return}if(C!==2&&O&1&&Z)if(C===0)Z.beforeEnter(L),a(L,f,E),ie(()=>Z.enter(L),w);else{const{leave:X,delayLeave:at,afterLeave:lt}=Z,gt=()=>{_.ctx.isUnmounted?s(L):a(L,f,E)},xt=()=>{L._isLeaving&&L[Ce](!0),X(L,()=>{gt(),lt&&lt()})};at?at(L,gt,xt):xt()}else a(L,f,E)},Bt=(_,f,E,C=!1,w=!1)=>{const{type:L,props:$,ref:Z,children:K,dynamicChildren:O,shapeFlag:rt,patchFlag:X,dirs:at,cacheIndex:lt,memo:gt}=_;if(X===-2&&(w=!1),Z!=null&&(Qe(),Vn(Z,null,E,_,!0),Xe()),lt!=null&&(f.renderCache[lt]=void 0),rt&256){f.ctx.deactivate(_);return}const xt=rt&1&&at,Pt=!bn(_);let Vt;if(Pt&&(Vt=$&&$.onVnodeBeforeUnmount)&&me(Vt,f,_),rt&6)Mt(_.component,E,C);else{if(rt&128){_.suspense.unmount(E,C);return}xt&&De(_,null,f,"beforeUnmount"),rt&64?_.type.remove(_,f,E,et,C):O&&!O.hasOnce&&(L!==bt||X>0&&X&64)?jt(O,f,E,!1,!0):(L===bt&&X&384||!w&&rt&16)&&jt(K,f,E),C&&ee(_)}const Ft=gt!=null&&lt==null;(Pt&&(Vt=$&&$.onVnodeUnmounted)||xt||Ft)&&ie(()=>{Vt&&me(Vt,f,_),xt&&De(_,null,f,"unmounted"),Ft&&(_.el=null)},E)},ee=_=>{const{type:f,el:E,anchor:C,transition:w}=_;if(f===bt){ve(E,C);return}if(f===la){k(_);return}const L=()=>{s(E),w&&!w.persisted&&w.afterLeave&&w.afterLeave()};if(_.shapeFlag&1&&w&&!w.persisted){const{leave:$,delayLeave:Z}=w,K=()=>$(E,L);Z?Z(_.el,L,K):K()}else L()},ve=(_,f)=>{let E;for(;_!==f;)E=g(_),s(_),_=E;s(f)},Mt=(_,f,E)=>{const{bum:C,scope:w,job:L,subTree:$,um:Z,m:K,a:O}=_;xr(K),xr(O),C&&Bs(C),w.stop(),L&&(L.flags|=8,Bt($,_,f,E)),Z&&ie(Z,f),ie(()=>{_.isUnmounted=!0},f)},jt=(_,f,E,C=!1,w=!1,L=0)=>{for(let $=L;$<_.length;$++)Bt(_[$],f,E,C,w)},S=_=>{if(_.shapeFlag&6)return S(_.component.subTree);if(_.shapeFlag&128)return _.suspense.next();const f=g(_.anchor||_.el),E=f&&f[td];return E?g(E):f};let z=!1;const q=(_,f,E)=>{let C;_==null?f._vnode&&(Bt(f._vnode,null,null,!0),C=f._vnode.component):b(f._vnode||null,_,f,null,null,null,E),f._vnode=_,z||(z=!0,dr(C),ss(),z=!1)},et={p:b,um:Bt,m:Wt,r:ee,mt:W,mc:x,pc:U,pbc:I,n:S,o:t};let pt,_t;return e&&([pt,_t]=e(et)),{render:q,hydrate:pt,createApp:Ld(q,pt)}}function Us({type:t,props:e},n){return n==="svg"&&t==="foreignObject"||n==="mathml"&&t==="annotation-xml"&&e&&e.encoding&&e.encoding.includes("html")?void 0:n}function cn({effect:t,job:e},n){n?(t.flags|=32,e.flags|=4):(t.flags&=-33,e.flags&=-5)}function Nl(t,e){return(!t||t&&!t.pendingBranch)&&e&&!e.persisted}function Kl(t,e,n=!1){const a=t.children,s=e.children;if(st(a)&&st(s))for(let o=0;o<a.length;o++){const r=a[o];let l=s[o];l.shapeFlag&1&&!l.dynamicChildren&&((l.patchFlag<=0||l.patchFlag===32)&&(l=s[o]=Ue(s[o]),l.el=r.el),!n&&l.patchFlag!==-2&&Kl(r,l)),l.type===En&&(l.patchFlag===-1&&(l=s[o]=Ue(l)),l.el=r.el),l.type===Ut&&!l.el&&(l.el=r.el)}}function qd(t){const e=t.slice(),n=[0];let a,s,o,r,l;const c=t.length;for(a=0;a<c;a++){const p=t[a];if(p!==0){if(s=n[n.length-1],t[s]<p){e[a]=s,n.push(a);continue}for(o=0,r=n.length-1;o<r;)l=o+r>>1,t[n[l]]<p?o=l+1:r=l;p<t[n[o]]&&(o>0&&(e[a]=n[o-1]),n[o]=a)}}for(o=n.length,r=n[o-1];o-- >0;)n[o]=r,r=e[r];return n}function Hl(t){const e=t.subTree.component;if(e)return e.asyncDep&&!e.asyncResolved?e:Hl(e)}function xr(t){if(t)for(let e=0;e<t.length;e++)t[e].flags|=8}function jl(t){if(t.placeholder)return t.placeholder;const e=t.component;return e?jl(e.subTree):null}const Ul=t=>t.__isSuspense;function Zl(t,e){e&&e.pendingBranch?st(t)?e.effects.push(...t):e.effects.push(t):zp(t)}const bt=Symbol.for("v-fgt"),En=Symbol.for("v-txt"),Ut=Symbol.for("v-cmt"),la=Symbol.for("v-stc"),ca=[];let de=null;function N(t=!1){ca.push(de=t?null:[])}function $d(){ca.pop(),de=ca[ca.length-1]||null}let fa=1;function cs(t,e=!1){fa+=t,t<0&&de&&e&&(de.hasOnce=!0)}function ql(t){return t.dynamicChildren=fa>0?de||On:null,$d(),fa>0&&de&&de.push(t),t}function tt(t,e,n,a,s,o){return ql(nt(t,e,n,a,s,o,!0))}function At(t,e,n,a,s){return ql(it(t,e,n,a,s,!0))}function va(t){return t?t.__v_isVNode===!0:!1}function mn(t,e){return t.type===e.type&&t.key===e.key}const $l=({key:t})=>t??null,Qa=({ref:t,ref_key:e,ref_for:n})=>(typeof t=="number"&&(t=""+t),t!=null?Ot(t)||Gt(t)||ct(t)?{i:qt,r:t,k:e,f:!!n}:t:null);function nt(t,e=null,n=null,a=0,s=null,o=t===bt?0:1,r=!1,l=!1){const c={__v_isVNode:!0,__v_skip:!0,type:t,props:e,key:e&&$l(e),ref:e&&Qa(e),scopeId:ml,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:a,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:qt};return l?(Bo(c,n),o&128&&t.normalize(c)):n&&(c.shapeFlag|=Ot(n)?8:16),fa>0&&!r&&de&&(c.patchFlag>0||o&6)&&c.patchFlag!==32&&de.push(c),c}const it=zd;function zd(t,e=null,n=null,a=0,s=null,o=!1){if((!t||t===yd)&&(t=Ut),va(t)){const l=rn(t,e,!0);return n&&Bo(l,n),fa>0&&!o&&de&&(l.shapeFlag&6?de[de.indexOf(t)]=l:de.push(l)),l.patchFlag=-2,l}if(ru(t)&&(t=t.__vccOpts),e){e=Xa(e);let{class:l,style:c}=e;l&&!Ot(l)&&(e.class=oe(l)),ht(c)&&(Es(c)&&!st(c)&&(c=Kt({},c)),e.style=qn(c))}const r=Ot(t)?1:Ul(t)?128:vl(t)?64:ht(t)?4:ct(t)?2:0;return nt(t,e,n,a,s,r,o,!0)}function Xa(t){return t?Es(t)||Gl(t)?Kt({},t):t:null}function rn(t,e,n=!1,a=!1){const{props:s,ref:o,patchFlag:r,children:l,transition:c}=t,p=e?Xd(s||{},e):s,d={__v_isVNode:!0,__v_skip:!0,type:t.type,props:p,key:p&&$l(p),ref:e&&e.ref?n&&o?st(o)?o.concat(Qa(e)):[o,Qa(e)]:Qa(e):o,scopeId:t.scopeId,slotScopeIds:t.slotScopeIds,children:l,target:t.target,targetStart:t.targetStart,targetAnchor:t.targetAnchor,staticCount:t.staticCount,shapeFlag:t.shapeFlag,patchFlag:e&&t.type!==bt?r===-1?16:r|16:r,dynamicProps:t.dynamicProps,dynamicChildren:t.dynamicChildren,appContext:t.appContext,dirs:t.dirs,transition:c,component:t.component,suspense:t.suspense,ssContent:t.ssContent&&rn(t.ssContent),ssFallback:t.ssFallback&&rn(t.ssFallback),placeholder:t.placeholder,el:t.el,anchor:t.anchor,ctx:t.ctx,ce:t.ce};return c&&a&&ha(d,c.clone(d)),d}function Ge(t=" ",e=0){return it(En,null,t,e)}function Qd(t,e){const n=it(la,null,t);return n.staticCount=e,n}function St(t="",e=!1){return e?(N(),At(Ut,null,t)):it(Ut,null,t)}function fe(t){return t==null||typeof t=="boolean"?it(Ut):st(t)?it(bt,null,t.slice()):va(t)?Ue(t):it(En,null,String(t))}function Ue(t){return t.el===null&&t.patchFlag!==-1||t.memo?t:rn(t)}function Bo(t,e){let n=0;const{shapeFlag:a}=t;if(e==null)e=null;else if(st(e))n=16;else if(typeof e=="object")if(a&65){const s=e.default;s&&(s._c&&(s._d=!1),Bo(t,s()),s._c&&(s._d=!0));return}else{n=32;const s=e._;!s&&!Gl(e)?e._ctx=qt:s===3&&qt&&(qt.slots._===1?e._=1:(e._=2,t.patchFlag|=1024))}else ct(e)?(e={default:e,_ctx:qt},n=32):(e=String(e),a&64?(n=16,e=[Ge(e)]):n=8);t.children=e,t.shapeFlag|=n}function Xd(...t){const e={};for(let n=0;n<t.length;n++){const a=t[n];for(const s in a)if(s==="class")e.class!==a.class&&(e.class=oe([e.class,a.class]));else if(s==="style")e.style=qn([e.style,a.style]);else if(ya(s)){const o=e[s],r=a[s];r&&o!==r&&!(st(o)&&o.includes(r))?e[s]=o?[].concat(o,r):r:r==null&&o==null&&!gs(s)&&(e[s]=r)}else s!==""&&(e[s]=a[s])}return e}function me(t,e,n,a=null){Ae(t,e,7,[n,a])}const Jd=Rl();let Yd=0;function tu(t,e,n){const a=t.type,s=(e?e.appContext:t.appContext)||Jd,o={uid:Yd++,vnode:t,type:a,parent:e,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new mp(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:e?e.provides:Object.create(s.provides),ids:e?e.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:Vl(a,s),emitsOptions:Dl(a,s),emit:null,emitted:null,propsDefaults:yt,inheritAttrs:a.inheritAttrs,ctx:yt,data:yt,props:yt,attrs:yt,slots:yt,refs:yt,setupState:yt,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=e?e.root:o,o.emit=Od.bind(null,o),t.ce&&t.ce(o),o}let Zt=null;const Ve=()=>Zt||qt;let ps,_o;{const t=hs(),e=(n,a)=>{let s;return(s=t[n])||(s=t[n]=[]),s.push(a),o=>{s.length>1?s.forEach(r=>r(o)):s[0](o)}};ps=e("__VUE_INSTANCE_SETTERS__",n=>Zt=n),_o=e("__VUE_SSR_SETTERS__",n=>Hn=n)}const Ra=t=>{const e=Zt;return ps(t),t.scope.on(),()=>{t.scope.off(),ps(e)}},Pr=()=>{Zt&&Zt.scope.off(),ps(null)};function zl(t){return t.vnode.shapeFlag&4}let Hn=!1;function eu(t,e=!1,n=!1){e&&_o(e);const{props:a,children:s}=t.vnode,o=zl(t);Md(t,a,o,e),Hd(t,s,n||e);const r=o?nu(t,e):void 0;return e&&_o(!1),r}function nu(t,e){const n=t.type;t.accessCache=Object.create(null),t.proxy=new Proxy(t.ctx,xd);const{setup:a}=n;if(a){Qe();const s=t.setupContext=a.length>1?su(t):null,o=Ra(t),r=xa(a,t,0,[t.props,s]),l=Gi(r);if(Xe(),o(),(l||t.sp)&&!bn(t)&&Lo(t),l){if(r.then(Pr,Pr),e)return r.then(c=>{wr(t,c)}).catch(c=>{Pa(c,t,0)});t.asyncDep=r}else wr(t,r)}else Ql(t)}function wr(t,e,n){ct(e)?t.type.__ssrInlineRender?t.ssrRender=e:t.render=e:ht(e)&&(t.setupState=il(e)),Ql(t)}function Ql(t,e,n){const a=t.type;t.render||(t.render=a.render||Oe);{const s=Ra(t);Qe();try{Pd(t)}finally{Xe(),s()}}}const au={get(t,e){return Jt(t,"get",""),t[e]}};function su(t){const e=n=>{t.exposed=n||{}};return{attrs:new Proxy(t.attrs,au),slots:t.slots,emit:t.emit,expose:e}}function xs(t){return t.exposed?t.exposeProxy||(t.exposeProxy=new Proxy(il(Vp(t.exposed)),{get(e,n){if(n in e)return e[n];if(n in ia)return ia[n](t)},has(e,n){return n in e||n in ia}})):t.proxy}function ou(t,e=!0){return ct(t)?t.displayName||t.name:t.name||e&&t.__name}function ru(t){return ct(t)&&"__vccOpts"in t}const G=(t,e)=>jp(t,e,Hn);function Q(t,e,n){try{cs(-1);const a=arguments.length;return a===2?ht(e)&&!st(e)?va(e)?it(t,null,[e]):it(t,e):it(t,null,e):(a>3?n=Array.prototype.slice.call(arguments,2):a===3&&va(n)&&(n=[n]),it(t,e,n))}finally{cs(1)}}const iu="3.5.31";/**
* @vue/runtime-dom v3.5.31
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let mo;const Sr=typeof window<"u"&&window.trustedTypes;if(Sr)try{mo=Sr.createPolicy("vue",{createHTML:t=>t})}catch{}const Xl=mo?t=>mo.createHTML(t):t=>t,lu="http://www.w3.org/2000/svg",cu="http://www.w3.org/1998/Math/MathML",je=typeof document<"u"?document:null,Rr=je&&je.createElement("template"),pu={insert:(t,e,n)=>{e.insertBefore(t,n||null)},remove:t=>{const e=t.parentNode;e&&e.removeChild(t)},createElement:(t,e,n,a)=>{const s=e==="svg"?je.createElementNS(lu,t):e==="mathml"?je.createElementNS(cu,t):n?je.createElement(t,{is:n}):je.createElement(t);return t==="select"&&a&&a.multiple!=null&&s.setAttribute("multiple",a.multiple),s},createText:t=>je.createTextNode(t),createComment:t=>je.createComment(t),setText:(t,e)=>{t.nodeValue=e},setElementText:(t,e)=>{t.textContent=e},parentNode:t=>t.parentNode,nextSibling:t=>t.nextSibling,querySelector:t=>je.querySelector(t),setScopeId(t,e){t.setAttribute(e,"")},insertStaticContent(t,e,n,a,s,o){const r=n?n.previousSibling:e.lastChild;if(s&&(s===o||s.nextSibling))for(;e.insertBefore(s.cloneNode(!0),n),!(s===o||!(s=s.nextSibling)););else{Rr.innerHTML=Xl(a==="svg"?`<svg>${t}</svg>`:a==="mathml"?`<math>${t}</math>`:t);const l=Rr.content;if(a==="svg"||a==="mathml"){const c=l.firstChild;for(;c.firstChild;)l.appendChild(c.firstChild);l.removeChild(c)}e.insertBefore(l,n)}return[r?r.nextSibling:e.firstChild,n?n.previousSibling:e.lastChild]}},tn="transition",Yn="animation",ba=Symbol("_vtc"),Jl={name:String,type:String,css:{type:Boolean,default:!0},duration:[String,Number,Object],enterFromClass:String,enterActiveClass:String,enterToClass:String,appearFromClass:String,appearActiveClass:String,appearToClass:String,leaveFromClass:String,leaveActiveClass:String,leaveToClass:String},du=Kt({},bl,Jl),uu=t=>(t.displayName="Transition",t.props=du,t),Vo=uu((t,{slots:e})=>Q(ad,gu(t),e)),pn=(t,e=[])=>{st(t)?t.forEach(n=>n(...e)):t&&t(...e)},Dr=t=>t?st(t)?t.some(e=>e.length>1):t.length>1:!1;function gu(t){const e={};for(const T in t)T in Jl||(e[T]=t[T]);if(t.css===!1)return e;const{name:n="v",type:a,duration:s,enterFromClass:o=`${n}-enter-from`,enterActiveClass:r=`${n}-enter-active`,enterToClass:l=`${n}-enter-to`,appearFromClass:c=o,appearActiveClass:p=r,appearToClass:d=l,leaveFromClass:u=`${n}-leave-from`,leaveActiveClass:g=`${n}-leave-active`,leaveToClass:m=`${n}-leave-to`}=t,v=_u(s),b=v&&v[0],y=v&&v[1],{onBeforeEnter:R,onEnter:A,onEnterCancelled:h,onLeave:k,onLeaveCancelled:M,onBeforeAppear:J=R,onAppear:V=A,onAppearCancelled:x=h}=e,D=(T,B,W,j)=>{T._enterCancelled=j,dn(T,B?d:l),dn(T,B?p:r),W&&W()},I=(T,B)=>{T._isLeaving=!1,dn(T,u),dn(T,m),dn(T,g),B&&B()},F=T=>(B,W)=>{const j=T?V:A,P=()=>D(B,T,W);pn(j,[B,P]),Cr(()=>{dn(B,T?c:o),Fe(B,T?d:l),Dr(j)||Lr(B,a,b,P)})};return Kt(e,{onBeforeEnter(T){pn(R,[T]),Fe(T,o),Fe(T,r)},onBeforeAppear(T){pn(J,[T]),Fe(T,c),Fe(T,p)},onEnter:F(!1),onAppear:F(!0),onLeave(T,B){T._isLeaving=!0;const W=()=>I(T,B);Fe(T,u),T._enterCancelled?(Fe(T,g),Gr(T)):(Gr(T),Fe(T,g)),Cr(()=>{T._isLeaving&&(dn(T,u),Fe(T,m),Dr(k)||Lr(T,a,y,W))}),pn(k,[T,W])},onEnterCancelled(T){D(T,!1,void 0,!0),pn(h,[T])},onAppearCancelled(T){D(T,!0,void 0,!0),pn(x,[T])},onLeaveCancelled(T){I(T),pn(M,[T])}})}function _u(t){if(t==null)return null;if(ht(t))return[Zs(t.enter),Zs(t.leave)];{const e=Zs(t);return[e,e]}}function Zs(t){return ip(t)}function Fe(t,e){e.split(/\s+/).forEach(n=>n&&t.classList.add(n)),(t[ba]||(t[ba]=new Set)).add(e)}function dn(t,e){e.split(/\s+/).forEach(a=>a&&t.classList.remove(a));const n=t[ba];n&&(n.delete(e),n.size||(t[ba]=void 0))}function Cr(t){requestAnimationFrame(()=>{requestAnimationFrame(t)})}let mu=0;function Lr(t,e,n,a){const s=t._endId=++mu,o=()=>{s===t._endId&&a()};if(n!=null)return setTimeout(o,n);const{type:r,timeout:l,propCount:c}=hu(t,e);if(!r)return a();const p=r+"end";let d=0;const u=()=>{t.removeEventListener(p,g),o()},g=m=>{m.target===t&&++d>=c&&u()};setTimeout(()=>{d<c&&u()},l+1),t.addEventListener(p,g)}function hu(t,e){const n=window.getComputedStyle(t),a=v=>(n[v]||"").split(", "),s=a(`${tn}Delay`),o=a(`${tn}Duration`),r=Ir(s,o),l=a(`${Yn}Delay`),c=a(`${Yn}Duration`),p=Ir(l,c);let d=null,u=0,g=0;e===tn?r>0&&(d=tn,u=r,g=o.length):e===Yn?p>0&&(d=Yn,u=p,g=c.length):(u=Math.max(r,p),d=u>0?r>p?tn:Yn:null,g=d?d===tn?o.length:c.length:0);const m=d===tn&&/\b(?:transform|all)(?:,|$)/.test(a(`${tn}Property`).toString());return{type:d,timeout:u,propCount:g,hasTransform:m}}function Ir(t,e){for(;t.length<e.length;)t=t.concat(t);return Math.max(...e.map((n,a)=>Or(n)+Or(t[a])))}function Or(t){return t==="auto"?0:Number(t.slice(0,-1).replace(",","."))*1e3}function Gr(t){return(t?t.ownerDocument:document).body.offsetHeight}function fu(t,e,n){const a=t[ba];a&&(e=(e?[e,...a]:[...a]).join(" ")),e==null?t.removeAttribute("class"):n?t.setAttribute("class",e):t.className=e}const ds=Symbol("_vod"),Yl=Symbol("_vsh"),us={name:"show",beforeMount(t,{value:e},{transition:n}){t[ds]=t.style.display==="none"?"":t.style.display,n&&e?n.beforeEnter(t):ta(t,e)},mounted(t,{value:e},{transition:n}){n&&e&&n.enter(t)},updated(t,{value:e,oldValue:n},{transition:a}){!e!=!n&&(a?e?(a.beforeEnter(t),ta(t,!0),a.enter(t)):a.leave(t,()=>{ta(t,!1)}):ta(t,e))},beforeUnmount(t,{value:e}){ta(t,e)}};function ta(t,e){t.style.display=e?t[ds]:"none",t[Yl]=!e}const vu=Symbol(""),bu=/(?:^|;)\s*display\s*:/;function ku(t,e,n){const a=t.style,s=Ot(n);let o=!1;if(n&&!s){if(e)if(Ot(e))for(const r of e.split(";")){const l=r.slice(0,r.indexOf(":")).trim();n[l]==null&&Ja(a,l,"")}else for(const r in e)n[r]==null&&Ja(a,r,"");for(const r in n)r==="display"&&(o=!0),Ja(a,r,n[r])}else if(s){if(e!==n){const r=a[vu];r&&(n+=";"+r),a.cssText=n,o=bu.test(n)}}else e&&t.removeAttribute("style");ds in t&&(t[ds]=o?a.display:"",t[Yl]&&(a.display="none"))}const Br=/\s*!important$/;function Ja(t,e,n){if(st(n))n.forEach(a=>Ja(t,e,a));else if(n==null&&(n=""),e.startsWith("--"))t.setProperty(e,n);else{const a=Eu(t,e);Br.test(n)?t.setProperty(ln(a),n.replace(Br,""),"important"):t[a]=n}}const Vr=["Webkit","Moz","ms"],qs={};function Eu(t,e){const n=qs[e];if(n)return n;let a=$t(e);if(a!=="filter"&&a in t)return qs[e]=a;a=Aa(a);for(let s=0;s<Vr.length;s++){const o=Vr[s]+a;if(o in t)return qs[e]=o}return e}const Wr="http://www.w3.org/1999/xlink";function Mr(t,e,n,a,s,o=gp(e)){a&&e.startsWith("xlink:")?n==null?t.removeAttributeNS(Wr,e.slice(6,e.length)):t.setAttributeNS(Wr,e,n):n==null||o&&!Mi(n)?t.removeAttribute(e):t.setAttribute(e,o?"":ge(n)?String(n):n)}function Fr(t,e,n,a,s){if(e==="innerHTML"||e==="textContent"){n!=null&&(t[e]=e==="innerHTML"?Xl(n):n);return}const o=t.tagName;if(e==="value"&&o!=="PROGRESS"&&!o.includes("-")){const l=o==="OPTION"?t.getAttribute("value")||"":t.value,c=n==null?t.type==="checkbox"?"on":"":String(n);(l!==c||!("_value"in t))&&(t.value=c),n==null&&t.removeAttribute(e),t._value=n;return}let r=!1;if(n===""||n==null){const l=typeof t[e];l==="boolean"?n=Mi(n):n==null&&l==="string"?(n="",r=!0):l==="number"&&(n=0,r=!0)}try{t[e]=n}catch{}r&&t.removeAttribute(s||e)}function yu(t,e,n,a){t.addEventListener(e,n,a)}function Tu(t,e,n,a){t.removeEventListener(e,n,a)}const Nr=Symbol("_vei");function Au(t,e,n,a,s=null){const o=t[Nr]||(t[Nr]={}),r=o[e];if(a&&r)r.value=a;else{const[l,c]=xu(e);if(a){const p=o[e]=Su(a,s);yu(t,l,p,c)}else r&&(Tu(t,l,r,c),o[e]=void 0)}}const Kr=/(?:Once|Passive|Capture)$/;function xu(t){let e;if(Kr.test(t)){e={};let a;for(;a=t.match(Kr);)t=t.slice(0,t.length-a[0].length),e[a[0].toLowerCase()]=!0}return[t[2]===":"?t.slice(3):ln(t.slice(2)),e]}let $s=0;const Pu=Promise.resolve(),wu=()=>$s||(Pu.then(()=>$s=0),$s=Date.now());function Su(t,e){const n=a=>{if(!a._vts)a._vts=Date.now();else if(a._vts<=n.attached)return;Ae(Ru(a,n.value),e,5,[a])};return n.value=t,n.attached=wu(),n}function Ru(t,e){if(st(e)){const n=t.stopImmediatePropagation;return t.stopImmediatePropagation=()=>{n.call(t),t._stopped=!0},e.map(a=>s=>!s._stopped&&a&&a(s))}else return e}const Hr=t=>t.charCodeAt(0)===111&&t.charCodeAt(1)===110&&t.charCodeAt(2)>96&&t.charCodeAt(2)<123,Du=(t,e,n,a,s,o)=>{const r=s==="svg";e==="class"?fu(t,a,r):e==="style"?ku(t,n,a):ya(e)?gs(e)||Au(t,e,n,a,o):(e[0]==="."?(e=e.slice(1),!0):e[0]==="^"?(e=e.slice(1),!1):Cu(t,e,a,r))?(Fr(t,e,a),!t.tagName.includes("-")&&(e==="value"||e==="checked"||e==="selected")&&Mr(t,e,a,r,o,e!=="value")):t._isVueCE&&(Lu(t,e)||t._def.__asyncLoader&&(/[A-Z]/.test(e)||!Ot(a)))?Fr(t,$t(e),a,o,e):(e==="true-value"?t._trueValue=a:e==="false-value"&&(t._falseValue=a),Mr(t,e,a,r))};function Cu(t,e,n,a){if(a)return!!(e==="innerHTML"||e==="textContent"||e in t&&Hr(e)&&ct(n));if(e==="spellcheck"||e==="draggable"||e==="translate"||e==="autocorrect"||e==="sandbox"&&t.tagName==="IFRAME"||e==="form"||e==="list"&&t.tagName==="INPUT"||e==="type"&&t.tagName==="TEXTAREA")return!1;if(e==="width"||e==="height"){const s=t.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return Hr(e)&&Ot(n)?!1:e in t}function Lu(t,e){const n=t._def.props;if(!n)return!1;const a=$t(e);return Array.isArray(n)?n.some(s=>$t(s)===a):Object.keys(n).some(s=>$t(s)===a)}const Iu={esc:"escape",space:" ",up:"arrow-up",left:"arrow-left",right:"arrow-right",down:"arrow-down",delete:"backspace"},Ou=(t,e)=>{const n=t._withKeys||(t._withKeys={}),a=e.join(".");return n[a]||(n[a]=s=>{if(!("key"in s))return;const o=ln(s.key);if(e.some(r=>r===o||Iu[r]===o))return t(s)})},Gu=Kt({patchProp:Du},pu);let zs,jr=!1;function Bu(){return zs=jr?zs:Ud(Gu),jr=!0,zs}const Vu=(...t)=>{const e=Bu().createApp(...t),{mount:n}=e;return e.mount=a=>{const s=Mu(a);if(s)return n(s,!0,Wu(s))},e};function Wu(t){if(t instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&t instanceof MathMLElement)return"mathml"}function Mu(t){return Ot(t)?document.querySelector(t):t}var Da=t=>/^[a-z][a-z0-9+.-]*:/.test(t)||t.startsWith("//"),Fu=/.md((\?|#).*)?$/,Nu=(t,e="/")=>Da(t)||t.startsWith("/")&&!t.startsWith(e)&&!Fu.test(t),Ca=t=>/^(https?:)?\/\//.test(t),Ur=t=>{if(!t||t.endsWith("/"))return t;let e=t.replace(/(^|\/)README.md$/i,"$1index.html");return e.endsWith(".md")?e=`${e.substring(0,e.length-3)}.html`:e.endsWith(".html")||(e=`${e}.html`),e.endsWith("/index.html")&&(e=e.substring(0,e.length-10)),e},Ku="http://.",Hu=(t,e)=>{if(!t.startsWith("/")&&e){const n=e.slice(0,e.lastIndexOf("/"));return Ur(new URL(`${n}/${t}`,Ku).pathname)}return Ur(t)},ju=(t,e)=>{const n=Object.keys(t).sort((a,s)=>{const o=s.split("/").length-a.split("/").length;return o!==0?o:s.length-a.length});for(const a of n)if(e.startsWith(a))return a;return"/"},Uu=/(#|\?)/,tc=t=>{const[e,...n]=t.split(Uu);return{pathname:e,hashAndQueries:n.join("")}},Zu=["link","meta","script","style","noscript","template"],qu=["title","base"],$u=([t,e,n])=>qu.includes(t)?t:Zu.includes(t)?t==="meta"&&e.name?`${t}.${e.name}`:t==="template"&&e.id?`${t}.${e.id}`:JSON.stringify([t,Object.entries(e).map(([a,s])=>typeof s=="boolean"?s?[a,""]:null:[a,s]).filter(a=>a!=null).sort(([a],[s])=>a.localeCompare(s)),n]):null,zu=t=>{const e=new Set,n=[];return t.forEach(a=>{const s=$u(a);s&&!e.has(s)&&(e.add(s),n.push(a))}),n},Qu=t=>t.endsWith("/")||t.endsWith(".html")?t:`${t}/`,ec=t=>t.endsWith("/")?t.slice(0,-1):t,nc=t=>t.startsWith("/")?t.slice(1):t,Xu=t=>typeof t=="function",Wo=t=>Object.prototype.toString.call(t)==="[object Object]",ye=t=>typeof t=="string";const Ju="modulepreload",Yu=function(t){return"/"+t},Zr={},i=function(e,n,a){let s=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),l=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));s=Promise.allSettled(n.map(c=>{if(c=Yu(c),c in Zr)return;Zr[c]=!0;const p=c.endsWith(".css"),d=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${d}`))return;const u=document.createElement("link");if(u.rel=p?"stylesheet":Ju,p||(u.as="script"),u.crossOrigin="",u.href=c,l&&u.setAttribute("nonce",l),document.head.appendChild(u),p)return new Promise((g,m)=>{u.addEventListener("load",g),u.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(r){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=r,window.dispatchEvent(l),!l.defaultPrevented)throw r}return s.then(r=>{for(const l of r||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})},t0=JSON.parse("{}"),e0=Object.fromEntries([["/",{loader:()=>i(()=>import("./index.html-BhKCXyaX.js"),[]),meta:{title:"TX7DO"}}],["/get-started.html",{loader:()=>i(()=>import("./get-started.html-CSV5CDAe.js"),[]),meta:{title:"新手导览"}}],["/posts/5_anti_inflammatory_medicine.html",{loader:()=>i(()=>import("./5_anti_inflammatory_medicine.html-DxUDq5h4.js"),[]),meta:{_blog:{title:"5大类“抗发炎食物”",author:"",date:"2020-01-01T00:00:00.000Z",category:["健康养生"],tag:["健康养生"],excerpt:`
<p>天气变化大总觉得特别容易感冒，尤其在冷冷的冬天医背将茶喝下肚全身就暖活了起来，不过并不是所有时候都可以喝姜茶，喝错时间还可能让喉咙越喝越痛。所以说到底该吃什么才能提高免疫力，减少感冒呢？</p>
<h2>1. 维生素C</h2>
<p>维生素C能够增强免疫系统，因为是水溶性维生素，需要不断透过饮食补充。可以吃：菠菜、芭乐、奇异果、木瓜、彩椒。</p>
<h2>2. 姜辣素</h2>
<p>姜中的姜辣素能够减缓发炎、促进血液循环、加速新陈代谢。不过要注意如果已经在感冒中，喉咙红肿疼痛，此时就不要再吃姜来刺激喉咙。(也就是重感冒不要喝姜茶！)</p>
<h2>3. 花青素</h2>
<p>花青素能够加强泌尿系统、减少发炎症状。可以吃：蓝莓、葡萄、黑梅、蔓越莓、茄子。</p>`},title:"5大类“抗发炎食物”"}}],["/posts/9_fastapi_resources_you_need_to_know.html",{loader:()=>i(()=>import("./9_fastapi_resources_you_need_to_know.html-Dz0zTE3z.js"),[]),meta:{_blog:{title:"9 个 FastAPI 的必知资源",author:"",date:"2020-01-01T00:00:00.000Z",category:["Python编程"],tag:["fastapi"],excerpt:`
<p>FastAPI 是 Python 开发人员最新、最流行的 API 框架之一。我们的工程师一次又一次需要将一个或多个第三方库与我们的 API 结合使用，以附加额外的功能和特性来丰富我们的项目。</p>
<p>在今天的这篇文章中，我想与您分享一些对于常规 FastAPI 从业者非常有用的资源。我已经在自己的项目中使用了其中的大部分，并且还包括我计划在不久的将来使用的一些。</p>
<p>那么让我们深入看看吧！</p>
<h2>FastAPI-pagination</h2>
<p>该库允许您从 API 路由发送简单的分页响应。这在main.py中的几行代码中使用非常方便，而不是自己编写整个分页逻辑。</p>`},title:"9 个 FastAPI 的必知资源"}}],["/posts/about_live_and_death.html",{loader:()=>i(()=>import("./about_live_and_death.html-CQ5m7qti.js"),[]),meta:{_blog:{title:"生与死",author:"",date:"2020-01-01T00:00:00.000Z",category:["随笔日志"],tag:["随笔日志"],excerpt:`
<p>迄今为止（2023年5月22日），我看过了太多的天灾人祸，太多的死亡：</p>
<ul>
<li>1998年，夏季，大水灾；</li>
<li>2008年，1月10日，大雪灾；</li>
<li>2008年，5月12日，汶川大地震；</li>
<li>2014年，3月8日，马航MH370空难；</li>
<li>2014年，4月16日，韩国世越号沉默事故；</li>
<li>2015年，6月1日，东方之星号客轮翻沉实践；</li>
<li>2022年，3月21日，东方航空5735空难；</li>
<li>2022年，10月29日，韩国梨泰院踩踏事故；</li>
<li>2023年，2月11日，土耳其和叙利亚大地震；</li>
</ul>`},title:"生与死"}}],["/posts/admin_permission.html",{loader:()=>i(()=>import("./admin_permission.html-oTVGolx_.js"),[]),meta:{_blog:{title:"后台权限系统",author:"",date:"2020-01-01T00:00:00.000Z",category:["产品设计"],tag:["产品设计"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://www.woshipm.com/pd/4091148.html" target="_blank" rel="noopener noreferrer">后台权限管理设计思路：三种模型分析</a></li>
<li><a href="https://www.woshipm.com/pd/5790063.html" target="_blank" rel="noopener noreferrer">关于系统后台的用户权限设计与思考</a></li>
</ul>
`},title:"后台权限系统"}}],["/posts/architecture-evolution-core-cms-shop.html",{loader:()=>i(()=>import("./architecture-evolution-core-cms-shop.html-DxbLrCLW.js"),[]),meta:{_blog:{title:"技术复盘：基于 go-wind-cms 的官网+商城双业务渐进拆分实战",author:"",date:"2026-06-18T00:00:00.000Z",category:["Go编程"],tag:["Golang","架构"],excerpt:`
<h2>一、项目原始架构与初期设计取舍</h2>
<h3>1.1 初始架构：go-wind-cms 原生三层设计</h3>
<p>项目初期，我们直接引入 <a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">go-wind-cms</a> 作为技术底座。其原生的目录结构完美契合了我们定下的<strong>硬性分层规范</strong>：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">backend/app/</span>
<span class="line">├── admin/service/   <span class="token comment"># Admin-BFF：管理后台聚合层</span></span>
<span class="line">├── app/service/     <span class="token comment"># App-BFF：前台应用聚合层</span></span>
<span class="line">└── core/service/    <span class="token comment"># Core大包：核心业务服务</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"技术复盘：基于 go-wind-cms 的官网+商城双业务渐进拆分实战"}}],["/posts/asio_post_and_dispatch.html",{loader:()=>i(()=>import("./asio_post_and_dispatch.html-BizD2Rve.js"),[]),meta:{_blog:{title:"ASIO的post和dispatch方法",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["ASIO"],excerpt:`
<p>关于这两个方法，我去网上找了一大堆资料，都没有讲清楚是怎么一回事。还是读了ASIO的源代码这才理解。</p>
<p>要提到这两个方法，不得不提一下Windows的两个API：<code>SendMessage</code>和<code>PostMessage</code>。</p>
<p><code>io_context::post</code>跟<code>PostMessage</code>的行为差不多，投递完消息立即返回，Handler的执行跟它没有半毛钱的关系。</p>
<p><code>io_context::dispatch</code>可以认为是<code>SendMessage</code>的超集，<code>SendMessage</code>是阻塞的，必须要在消息处理完成之后才返回，当<code>io_context::dispatch</code>在<code>io_context</code>的工作线程中被调用的时候，<code>io_context::dispatch</code>的行为和<code>SendMessage</code>是一致的，必须要在Handler调用完成之后才返回。但是，如果不是io_context的工作线程中调用，则执行了<code>io_context::post</code>一样的行为：将Handler投递到<code>io_context</code>的事件队列中去。</p>`},title:"ASIO的post和dispatch方法"}}],["/posts/asio_timer.html",{loader:()=>i(()=>import("./asio_timer.html-gbQHY_KF.js"),[]),meta:{_blog:{title:"ASIO 定时器完全指南：类型解析、API 用法与实战示例",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["ASIO"],excerpt:`
<p>ASIO（Boost.Asio 或独立的 Asio）作为高性能异步 IO 库，提供了灵活且高效的定时器组件，适用于网络编程、异步任务调度、定时触发等场景。本文将系统梳理 ASIO 定时器的核心类型、底层实现、核心 API、实战示例及常见问题，帮助开发者快速掌握其使用方法。</p>
<h2>一、ASIO 定时器核心类型解析</h2>
<p>ASIO 提供 4 种常用定时器，均基于底层模板类实现，核心差异在于 <strong>时钟类型</strong>（决定精度、是否受系统时间影响）和 <strong>适用场景</strong>。先纠正一个常见误区：<code>high_resolution_timer</code> 并非 <code>system_timer</code>，二者是 <code>basic_waitable_timer</code> 的不同时钟特例化，属于并列关系。</p>`},title:"ASIO 定时器完全指南：类型解析、API 用法与实战示例"}}],["/posts/automated_backups_with_%20cron_and_rclone.html",{loader:()=>i(()=>import("./automated_backups_with_ cron_and_rclone.html-CniNMFCv.js"),[]),meta:{_blog:{title:"使用 cron 和 RClone 实现自动备份文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["cron","rclone"],excerpt:`
<p>本文将向您展示如何在 Linux 操作系统中使用 RClone 和 cron 来自动进行文件备份。</p>
<p>现在是星期五下午 6 点，我需要将一些工作和学校文件备份到 Google 云端硬盘。是的，我使用 git 进行编码项目，但这种工作最好保存在 Google Drive 中。所以我想知道是否有一种更快、简单、自动化的方法来备份到 Google Drive，有趣的是，我发现了 RClone。</p>
<p>在本文中您将了解到：</p>
<ul>
<li>什么是 RClone？</li>
<li>什么是 cron？</li>
<li>RClone 和 cron 的基本用法</li>
<li>如何在每周五下午 6:30 自动备份文件</li>
<li>Cron日志记录</li>
<li>如何卸载 RClone</li>
</ul>`},title:"使用 cron 和 RClone 实现自动备份文件"}}],["/posts/bloc_a_reactive_approach_using_rxdart_streams.html",{loader:()=>i(()=>import("./bloc_a_reactive_approach_using_rxdart_streams.html-BqHCSYgI.js"),[]),meta:{_blog:{title:"Flutter 使用 RxDart & Streams 实现 BLoC模式",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["flutter","RxDart"],excerpt:`
<p><img src="/assets/images/flutter/rxdart_bloc.png" alt=""></p>
<p>我将从本系列的第一部分开始构建一个简单的简短应用程序实现，该实现可以从 API 获取最新的技术新闻。在开始之前，我将简要介绍一些关键术语及其含义。</p>
<h2>什么是反应式编程？</h2>
<p>响应式编程基本上是 <strong>使用异步可观察流进行编程</strong>。在 Dart 中，流提供异步数据序列。</p>
<p><a href="https://pub.dev/packages/rxdart" target="_blank" rel="noopener noreferrer">RxDart</a> 是基于 Dart 的反应式编程实现。如果您来自 Android 开发领域，RxJava + RxAndroid、Coroutines 可能非常适合您。Dart 编程语言中已经实现了类似的概念。RxDart 是 Dart 语言的 ReactiveX 支持的反应式函数式编程库。Dart 已经有一个很好的用于处理 Streams 的包，但 RxDart 用新功能对其进行了扩展。</p>`},title:"Flutter 使用 RxDart & Streams 实现 BLoC模式"}}],["/posts/build_system.html",{loader:()=>i(()=>import("./build_system.html-Du5KrPAc.js"),[]),meta:{_blog:{title:"构建系统",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Make","CMake","Ninja"],excerpt:`
<h2>Make</h2>
<ul>
<li>官方网站：<a href="https://www.gnu.org/software/make/" target="_blank" rel="noopener noreferrer">https://www.gnu.org/software/make/</a></li>
<li>开源代码库：<a href="https://github.com/gitGNU/gnu_make" target="_blank" rel="noopener noreferrer">https://github.com/gitGNU/gnu_make</a></li>
<li>开发语言：C</li>
</ul>`},title:"构建系统"}}],["/posts/cache_pattern.html",{loader:()=>i(()=>import("./cache_pattern.html-CdZqzwQM.js"),[]),meta:{_blog:{title:"5种服务端缓存设计模式",author:"",date:"2020-01-01T00:00:00.000Z",category:["设计模式"],tag:["设计模式","Cache Aside Pattern","缓存设计模式"],excerpt:`
<h2>Cache Aside Pattern</h2>
<p>Cache Aside Pattern是最经典的缓存 + 数据库读写的模式。</p>
<ol>
<li>读的时候，先读缓存，缓存没有的话，那么就读数据库，然后取出数据后放入缓存，同时返回响应</li>
<li>更新的时候，先更新缓存，然后再更新数据库（缓存和数据库双写）</li>
</ol>
<p>最大的缺点就是需要应用程序侧来编排读写流程。</p>
<h3>读取的步骤</h3>
<ol>
<li>先从缓存中读取数据；</li>
<li>如果缓存数据不存在，那么从数据库中读取数据；</li>
<li>写入缓存。</li>
</ol>`},title:"5种服务端缓存设计模式"}}],["/posts/car_drive.html",{loader:()=>i(()=>import("./car_drive.html-eYryjOzK.js"),[]),meta:{_blog:{title:"汽车驱动",author:"",date:"2020-01-01T00:00:00.000Z",category:["汽车"],tag:["汽车"],excerpt:`
<h2>两轮驱动（Two-Wheel Drive，2WD）</h2>
<p>两轮驱动，即是由发动机通过变速箱等直接驱动前轮或者后轮，使汽车前进。</p>
<ul>
<li><strong>前轮驱动（Front-Wheel Drive）</strong> - 发动机驱动前面一对车轮</li>
<li><strong>后轮驱动（Rear-Wheel Drive）</strong> - 发动机驱动后面一对车轮</li>
</ul>
<h2>四轮驱动（4-Wheel Drive，4WD）</h2>
<p>四轮驱动，是指汽车前后轮都有动力，可按行驶路面状态不同而将发动机输出扭矩按不同比例分布在前后所有的轮子上，以提高汽车的行驶能力。一般用<code>4X4</code>或<code>4WD</code>来表示。</p>`},title:"汽车驱动"}}],["/posts/cdc_for_postgresql_using_go_golang.html",{loader:()=>i(()=>import("./cdc_for_postgresql_using_go_golang.html-C-6f1QA6.js"),[]),meta:{_blog:{title:"使用 Go (Golang) 为 postgresql 实施 更改数据捕获 (CDC)",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["go","CDC","PostgreSQL"],excerpt:`
<h2>Change Data Capture介绍</h2>
<p>变更数据捕获 (CDC) 是一种用于跟踪对数据库中的数据所做的更改的技术，使您能够跟踪数据的演变。在 PostgreSQL 中，CDC 是使用逻辑复制（Logical Replication）功能实现的，它可以选择性地复制对特定表或列所做的更改。</p>
<p>Golang 是一种编程语言，近年来因其速度和简单性而受到欢迎。它也非常适合处理数据库，因为它内置了对 SQL 数据库的支持以及许多用于处理这些数据库的强大库。</p>
<p>在 PostgreSQL 中使用 Golang 和 CDC 是一个强大的组合，因为它允许您轻松地实时捕获和处理对数据库所做的更改。以下是开始在 PostgreSQL 中使用 Golang 和 CDC 需要遵循的基本步骤：</p>`},title:"使用 Go (Golang) 为 postgresql 实施 更改数据捕获 (CDC)"}}],["/posts/centos_install_golang.html",{loader:()=>i(()=>import("./centos_install_golang.html-BnW6KGQG.js"),[]),meta:{_blog:{title:"Centos 安装 Golang",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["go","Centos"],excerpt:`
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">vim</span> install_golang.sh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Centos 安装 Golang"}}],["/posts/clear_docker_junk_file.html",{loader:()=>i(()=>import("./clear_docker_junk_file.html-C5mAnHk5.js"),[]),meta:{_blog:{title:"清除Docker产生的垃圾文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["docker"],excerpt:`
<p>通过命令<code>df -h</code>查看磁盘空间占用，发现Docker的overlay对磁盘的占用极高。</p>
<p>通过<code>docker system prune -a</code>命令清除掉Docker的无用镜像、缓存、挂载数据，也并没有太多的改善。</p>
<p>通过<code>du -h --max-depth=1</code>或者<code>du -sh *</code>命令查看大文件的占用情况。</p>
<h2>参考资料</h2>
<ul>
<li><a href="https://hhbbz.github.io/2018/03/28/Docker%E5%AE%B9%E5%99%A8%E5%8D%A0%E7%94%A8%E7%A3%81%E7%9B%98%E5%86%85%E5%AD%98%E8%BF%87%E5%A4%A7%E7%9A%84%E9%97%AE%E9%A2%98%E6%8E%92%E6%9F%A5/" target="_blank" rel="noopener noreferrer">Docker容器占用磁盘内存过大的问题排查</a></li>
<li><a href="https://blog.csdn.net/weixin_41945228/article/details/104331479" target="_blank" rel="noopener noreferrer">Docker 容器磁盘占用100%(/var/lib/docker/overlay2空间占用很大)</a></li>
</ul>`},title:"清除Docker产生的垃圾文件"}}],["/posts/clear_kdevtmpfsi_kinsing.html",{loader:()=>i(()=>import("./clear_kdevtmpfsi_kinsing.html-CAZjdn8z.js"),[]),meta:{_blog:{title:"实用教程：kdevtmpfsi + kinsing挖矿病毒一键清理脚本（含Docker容器查杀）",author:"",date:"202026-04-17",category:["运维技术"],tag:["杀毒"],excerpt:`
<p>在Linux服务器运维过程中，kdevtmpfsi与kinsing挖矿病毒是极为常见且隐蔽的恶意程序，一旦入侵会疯狂占用服务器CPU、内存资源，导致服务卡顿、宕机，甚至窃取服务器敏感信息，给个人和企业带来巨大损失。本文将详细解析一款高效的一键清理脚本，涵盖病毒进程查杀、文件删除、自启清理及Docker容器内病毒查杀，帮助运维人员快速摆脱病毒困扰，同时提供后续防护建议，从根源减少病毒再次入侵的可能。</p>
<h2>一、挖矿病毒kdevtmpfsi + kinsing 危害解析</h2>
<p>kdevtmpfsi与kinsing通常成对出现，kinsing作为守护进程，负责监控kdevtmpfsi挖矿进程，一旦kdevtmpfsi被杀死，kinsing会立即重启该进程，形成“不死循环”，难以彻底清理。其主要危害体现在三个方面：</p>`},title:"实用教程：kdevtmpfsi + kinsing挖矿病毒一键清理脚本（含Docker容器查杀）"}}],["/posts/clion_switch_h_cpp.html",{loader:()=>i(()=>import("./clion_switch_h_cpp.html-Bw15FWfS.js"),[]),meta:{_blog:{title:"CLion 在头文件和源文件之间切换",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["CLion"],excerpt:`
<p>该快捷方式在键盘图中称为“相关符号”。</p>
<h2>MAC</h2>
<p>Ctrl + Cmd + Up</p>
<h2>Windows、Linux</h2>
<p>Ctrl + Alt + Home</p>
`},title:"CLion 在头文件和源文件之间切换"}}],["/posts/cloud_phone.html",{loader:()=>i(()=>import("./cloud_phone.html-DnBLq0vL.js"),[]),meta:{_blog:{title:"云手机",author:"",date:"2020-01-01T00:00:00.000Z",category:["架构设计"],tag:["云手机"],excerpt:`
<ul>
<li>Waydroid只能单开一个Android实例，所以要批量部署，可能需要部署多个宿主Ubuntu；</li>
<li>Redroid基于Docker部署，一个宿主可以部署多个。</li>
</ul>
<h2>虚拟手机开源方案</h2>
<ul>
<li><a href="https://github.com/remote-android/redroid-doc" target="_blank" rel="noopener noreferrer">ReDroid (Remote anDroid)</a> Docker + AnBox</li>
<li><a href="https://waydro.id/" target="_blank" rel="noopener noreferrer">Waydroid</a> LXC + AnBox</li>
<li><a href="https://www.android-x86.org/" target="_blank" rel="noopener noreferrer">Android-x86</a></li>
<li><a href="https://blissos.org/index.html#download" target="_blank" rel="noopener noreferrer">BlissOS</a></li>
</ul>`},title:"云手机"}}],["/posts/cmake_lib_gtest.html",{loader:()=>i(()=>import("./cmake_lib_gtest.html-CQy7WPRy.js"),[]),meta:{_blog:{title:"使用CMake编译库，并使用GoogleTest测试库",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["GoogleTest"],excerpt:`
<h2>安装依赖</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token function">install</span> libgtest-dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"使用CMake编译库，并使用GoogleTest测试库"}}],["/posts/cocos2dx_tile_map.html",{loader:()=>i(()=>import("./cocos2dx_tile_map.html-DopY2yQx.js"),[]),meta:{_blog:{title:"Cococs2dx 瓦片地图",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Cococs2dx"],excerpt:`
<h2>渲染方式</h2>
<ul>
<li>Rectangle/Orthogonal：正交，正常矩形瓦片</li>
<li>Isometric：等距瓦片，45度</li>
<li>Hexagon：六边形</li>
</ul>
<h2>参考资料</h2>
<ul>
<li><a href="https://www.kodeco.com/2684-cocos2d-x-tile-map-tutorial-part-1" target="_blank" rel="noopener noreferrer">Cocos2D-X Tile Map Tutorial: Part 1</a></li>
<li><a href="https://www.kodeco.com/2683-cocos2d-x-tile-map-tutorial-part-2" target="_blank" rel="noopener noreferrer">Cocos2D-X Tile Map Tutorial: Part 2</a></li>
<li><a href="https://gamedevelopment.tutsplus.com/tutorials/introduction-to-tiled-map-editor-a-platform-agnostic-tool-for-level-maps--gamedev-2838" target="_blank" rel="noopener noreferrer">Introduction to Tiled Map Editor: A Platform-Agnostic Tool for Level Maps</a></li>
<li><a href="https://forum.cocos.org/t/topic/87840" target="_blank" rel="noopener noreferrer">笔记：TileMap坐标转换</a></li>
<li><a href="https://www.gcores.com/articles/164744" target="_blank" rel="noopener noreferrer">韩版《传奇2》源码分析与 Unity 重制（四）服务端地图对象管理</a></li>
</ul>`},title:"Cococs2dx 瓦片地图"}}],["/posts/cocos_creator_problem.html",{loader:()=>i(()=>import("./cocos_creator_problem.html-Chs24VPX.js"),[]),meta:{_blog:{title:"Cocos Creator问题集",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Cocos Creator"],excerpt:`
<h2>小程序真机无法显示ttf字体</h2>
<p>根据论坛里面说的是，主要的原因是因为字体的<code>font-family</code>名字里面带有空格。</p>
<p>需要使用字体修改工具<a href="https://www.high-logic.com/font-editor/fontcreator" target="_blank" rel="noopener noreferrer">High-Logic FontCreator</a>来修改<code>font-family</code>名，修改之后，确实生效了。</p>
<ol>
<li>打开<code>FontCreator</code>，将<code>ttf文件</code>拖到FontCreator打开。</li>
<li>菜单项选择：<code>Font</code> -&gt; <code>Properties</code>，打开<code>Font Properties</code>弹窗。</li>
<li>在弹窗里面看到有几个子标签页，其中Identification标签页里面的 Font Family即为字体的英文名，自行修改成自己需要的值。</li>
<li>在Custom标签页里面，可以看到列表里面的第一列是语言ID，第二列是Name ID，简体中文系统上，找到行 <code>Chinese-People's Republic of China  Font Family</code>，</li>
<li>繁体中文或者其他语言的系统下，应该是修改对应的行，没有的也可以Add添加新的行，这个我没有测试，猜测是这样。</li>
<li>修改完毕后点击OK保存。</li>
<li>菜单项选择：<code>File</code> -&gt; <code>Export Font As...</code> -&gt; <code>Export as Desktop Font(ttf/otf)</code>，弹出<code>Export as Desktop Font(ttf/otf)</code>窗口。</li>
<li>在弹出窗口中将Outline Format项，通过下拉选择TrueType，不建议选CFF（测试时这个选项可能Identification标签页里面字体名不生效）。</li>
<li>底部三个按钮点击<code>Export</code>即可。最终保存文件窗口自己选择文件格式。</li>
</ol>`},title:"Cocos Creator问题集"}}],["/posts/code_special_comment.html",{loader:()=>i(()=>import("./code_special_comment.html-BQEaG1XQ.js"),[]),meta:{_blog:{title:"代码特殊注释完整规范：IDE 支持、使用示例与团队协作指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["代码注释","IDE"],excerpt:`
<h2>一、完整注释表格</h2>
<table>
<thead>
<tr>
<th>注释名</th>
<th>核心作用说明</th>
<th>适用场景细分</th>
<th>VSC</th>
<th>VS</th>
<th>JetBrains</th>
<th>优先级建议</th>
</tr>
</thead>
<tbody>
<tr>
<td>TODO</td>
<td>功能未实现（尚未启动开发）</td>
<td>新需求、未动工的模块 / 接口</td>
<td>[x]</td>
<td>[x]</td>
<td>[x]</td>
<td>中 - 高</td>
</tr>
<tr>
<td>TODO:HIGH/MID/LOW</td>
<td>带优先级的未实现功能</td>
<td>需区分紧急程度（如 HIGH = 迭代必做，LOW = 后续优化）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>自定义</td>
</tr>
<tr>
<td>UNDONE</td>
<td>功能未完成（已开发部分，待收尾）</td>
<td>开发中被打断、需补充细节 / 边界处理的功能</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>FIXME</td>
<td>已发现明确 Bug，需修复</td>
<td>可复现、定位清晰的缺陷（含潜在风险未复现的问题）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>高</td>
</tr>
<tr>
<td>FIXME:URGENT</td>
<td>紧急 Bug 修复</td>
<td>线上故障、阻塞测试的核心流程缺陷</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>最高</td>
</tr>
<tr>
<td>BUG</td>
<td>已确认的具体缺陷</td>
<td>区别于 FIXME：更侧重 “已复现 + 影响范围明确” 的 Bug（如 “用户 ID&gt;1000 时查询失败”）</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>高</td>
</tr>
<tr>
<td>HACK</td>
<td>临时解决方案 / 取巧实现</td>
<td>功能可用，但代码不优雅（如硬编码、规避框架限制），待重构</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>XXX</td>
<td>待优化问题（设计 / 实现不规范）</td>
<td>非紧急缺陷，如命名不规范、冗余代码、逻辑可简化（优先级低于 HACK/FIXME）</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>低 - 中</td>
</tr>
<tr>
<td>UnresolvedMergeConflict</td>
<td>未解决的代码合并冲突</td>
<td>Git 合并分支时产生的冲突，需手动对比处理</td>
<td>[]</td>
<td>[x]</td>
<td>[]</td>
<td>最高</td>
</tr>
<tr>
<td>NOTE</td>
<td>重要说明 / 备注</td>
<td>记录设计思路、依赖条件、使用限制（如 “依赖第三方 SDK v2.3.0，升级需改签名”）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>-</td>
</tr>
<tr>
<td>DEPRECATED</td>
<td>已废弃的代码 / 接口</td>
<td>不建议继续使用，后续版本会删除（需标注替代方案）</td>
<td>[]</td>
<td>[]</td>
<td>[x]</td>
<td>-</td>
</tr>
<tr>
<td>REVIEW</td>
<td>需代码审查 / 复核</td>
<td>复杂逻辑、高风险模块（如权限控制、支付流程），需团队复核</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>中</td>
</tr>
<tr>
<td>OPTIMIZE</td>
<td>性能 / 结构优化</td>
<td>代码可运行，但效率低（如 O (n²) 循环）或结构混乱，需重构</td>
<td>[]</td>
<td>[]</td>
<td>[]</td>
<td>低 - 中</td>
</tr>
</tbody>
</table>`},title:"代码特殊注释完整规范：IDE 支持、使用示例与团队协作指南"}}],["/posts/compute_trc20_address.html",{loader:()=>i(()=>import("./compute_trc20_address.html-cTaRhd00.js"),[]),meta:{_blog:{title:"计算TRC20地址",author:"",date:"2020-01-01T00:00:00.000Z",category:["Python编程"],tag:["Python","TRC20"],excerpt:`
<h2>Python</h2>
<h3>使用tronpy软件包</h3>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre><code><span class="line"><span class="token keyword">from</span> tronpy<span class="token punctuation">.</span>keys <span class="token keyword">import</span> PrivateKey</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定私钥（请替换为你实际的私钥）</span></span>
<span class="line">private_key_hex <span class="token operator">=</span> <span class="token string">"your_private_key_hex_string"</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 将十六进制私钥转换为PrivateKey对象</span></span>
<span class="line">private_key <span class="token operator">=</span> PrivateKey<span class="token punctuation">(</span><span class="token builtin">bytes</span><span class="token punctuation">.</span>fromhex<span class="token punctuation">(</span>private_key_hex<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从私钥派生公钥</span></span>
<span class="line">public_key <span class="token operator">=</span> private_key<span class="token punctuation">.</span>public_key</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 从公钥生成TRC地址</span></span>
<span class="line">address <span class="token operator">=</span> public_key<span class="token punctuation">.</span>to_base58check_address<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"私钥 (十六进制):"</span><span class="token punctuation">,</span> private_key_hex<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"公钥 (十六进制):"</span><span class="token punctuation">,</span> public_key<span class="token punctuation">.</span><span class="token builtin">hex</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">"TRC地址:"</span><span class="token punctuation">,</span> address<span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">'\\n'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"计算TRC20地址"}}],["/posts/cpp_embed_python_protobuf_sigsegv_error.html",{loader:()=>i(()=>import("./cpp_embed_python_protobuf_sigsegv_error.html-CL4yHqN1.js"),[]),meta:{_blog:{title:"关于C++嵌入Python引用protobuf引起的一个SIGSEGV错误的解决过程",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","Python"],excerpt:`
<p>首先，我的应用场景是这样的，我是一个C++为宿主的程序，内嵌了Python，我C++里边有引用C++版的protobuf动态链接库。Python里边也有用到Python版的Protobuf。两者都用了同一版本的protobuf: 3.13.0。</p>
<p>因为我是插件式的系统，我单独测试Python脚本系统插件的时候，一切都是完美的。然后，我将插件集成到主程序里边去，就完犊子了。只要我在Python中import到protobuf的协议，主程序就会以SIGSEGV信号崩掉。</p>
<p>最终堆栈挂在了<code>_message.cpython-35m-x86_64-linux-gnu.so</code>的<code>google::protobuf::DescriptorPool::FindFileByName()</code>这里：</p>`},title:"关于C++嵌入Python引用protobuf引起的一个SIGSEGV错误的解决过程"}}],["/posts/cpp_ide.html",{loader:()=>i(()=>import("./cpp_ide.html-CCA1kCsz.js"),[]),meta:{_blog:{title:"C++ IDE：最适合 C++ 初学者的 IDE 是什么？",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","IDE"],excerpt:`
<p>C++ 创建于 1985 年，是一种流行的编程语言，已经使用了 30 多年。这种面向对象的编程语言设计有多种功能设施，包括编译功能。它最初是为系统编程而构建的，但如今它已成为软件开发行业许多项目的绝佳选择。它可用于创建高性能应用程序，例如桌面应用程序、游戏和服务器。</p>
<p>C++ 作为 C 语言的扩展而构建，采用类进行设计，使其代码可重用。C++ 编程语言支持多种操作系统和集成开发环境 (IDE)。作为想要构建令人印象深刻的软件应用程序的初学者，您可能正在寻找 C++ 的最佳 IDE 来轻松构建和启动您的产品。使用本指南为初学者找到最好的 C++ IDE。</p>
<h2>什么是 IDE？</h2>`},title:"C++ IDE：最适合 C++ 初学者的 IDE 是什么？"}}],["/posts/cpp_type_cast_4.html",{loader:()=>i(()=>import("./cpp_type_cast_4.html-DtwSB9kA.js"),[]),meta:{_blog:{title:"C++ 类型转换：旧风格与四种新风格详解",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","类型转换"],excerpt:`
<p>在 C++ 编程中，类型转换是连接不同数据类型的重要手段。C++ 同时支持兼容 C 语言的旧风格强制转型，以及针对特定场景设计的四种新风格强制转型，后者在可读性、安全性和规范性上更具优势。本文将详细解析各类转换的语法、用途及核心差异。</p>
<h2>一、旧风格（C-style）强制转型</h2>
<p>C 风格强制转型包含两种语法形式，本质功能完全一致，仅括号位置不同：</p>
<ul>
<li>格式 1：<code>(T) expression</code>（将表达式转换为 <code>T</code> 类型）</li>
<li>格式 2：<code>T(expression)</code>（函数式语法，效果同上）</li>
</ul>`},title:"C++ 类型转换：旧风格与四种新风格详解"}}],["/posts/cqrs_pattern_with_kafka_streams_part_1.html",{loader:()=>i(()=>import("./cqrs_pattern_with_kafka_streams_part_1.html-BwgT0XrE.js"),[]),meta:{_blog:{title:"Kafka Streams 实现 CQRS 模式 — 第 1 部分",author:"",date:"2020-01-01T00:00:00.000Z",category:["架构设计"],tag:["CQRS","Kafka Streams"],excerpt:`
<p>CQRS 代表：<strong>命令查询职责分离(Command Query Responsibility Segregation)</strong>。它提倡分离“命令(Command)”和“查询(Query)”的“职责(Responsibility)”。在本文中，我将尝试回答以下问题：</p>
<ul>
<li>什么是 CQRS？</li>
<li>为什么 Kafka Streams 是实现 CQRS 很自然的选择？</li>
<li>如何使用 Kafka Streams 实现 CQRS 模式？</li>
</ul>
<h2>案例研究：在线订购系统</h2>
<p>让我们从一个经典示例开始：零售在线订购系统。它有两个主要用例：</p>`},title:"Kafka Streams 实现 CQRS 模式 — 第 1 部分"}}],["/posts/create_container_images_with_bazel.html",{loader:()=>i(()=>import("./create_container_images_with_bazel.html-DjxEh8xP.js"),[]),meta:{_blog:{title:"使用 Bazel 创建Go应用程序的Docker容器镜像",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Bazel","Docker","Go"],excerpt:`
<p>如果你知道<a href="https://bazel.build/" target="_blank" rel="noopener noreferrer">Bazel</a>，你就会知道它有多棒：它快速可靠。当您在使用多种服务的项目中工作时，甚至可能使用不同的语言，拥有一个快速可靠的构建系统，更重要的是，生成<a href="https://bazel.build/faq.html#why-would-i-want-to-use-bazel" target="_blank" rel="noopener noreferrer">确定性构建</a>是关键。</p>
<p>但是，您可能不知道使用它<code>bazel</code>来构建容器镜像是多么容易。您将从使用<code>bazel</code>应用到您的镜像构建过程中获得所有好处。另外，您不必处理丑陋的<code>Dockerfiles</code>。</p>`},title:"使用 Bazel 创建Go应用程序的Docker容器镜像"}}],["/posts/crontab.html",{loader:()=>i(()=>import("./crontab.html-CurJiFTR.js"),[]),meta:{_blog:{title:"crontab",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["crontab"],excerpt:`
<h2>什么是cron表达式？</h2>
<p>cron表达式是一个具有时间含义的字符串，一般用于定义定时任务的执行时间。</p>
<h2>cron表达式的格式</h2>
<p>cron使用6-7位制的格式：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">{秒数} {分钟} {小时} {日期} {月份} {星期} {年份（可为空）}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"crontab"}}],["/posts/customer_retention_rate.html",{loader:()=>i(()=>import("./customer_retention_rate.html-B89_OyrF.js"),[]),meta:{_blog:{title:"客户留存率",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["客户留存率"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://www.zendesk.hk/blog/calculate-customer-retention-rate/" target="_blank" rel="noopener noreferrer">甚麼是客戶保留率？ 如何計算客戶保留率？</a></li>
<li><a href="https://www.zesmob.com/blog/42434.html" target="_blank" rel="noopener noreferrer">APP用户留存率计算公式和预估方法</a></li>
<li><a href="http://www.gupowang.com/article/view/5099" target="_blank" rel="noopener noreferrer">用户留存|教你统计日留存、周留存、月留存率更准确的方法</a></li>
<li><a href="https://www.adjust.com/zh/blog/what-makes-a-good-retention-rate/#%E4%B8%8D%E5%90%8C%E5%A4%A9%E6%95%B0%E5%92%8C%E8%A1%8C%E4%B8%9A%E7%9A%84%E7%95%99%E5%AD%98%E7%8E%87%E8%AF%A6%E8%A7%A3" target="_blank" rel="noopener noreferrer">出色的应用留存率是如何炼成的？</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/34835494" target="_blank" rel="noopener noreferrer">关于游戏的留存</a></li>
<li><a href="https://www.facebook.com/fbgaminghome/blog/instant-games-strategies-for-player-retention" target="_blank" rel="noopener noreferrer">小游戏玩家留存策略</a></li>
<li><a href="https://zh.mistplay.com/resources/mobile-game-retention-metrics" target="_blank" rel="noopener noreferrer">6 个重要的移动游戏留存指标及计算方法</a></li>
<li><a href="https://zhuanlan.zhihu.com/p/28080379" target="_blank" rel="noopener noreferrer">App的留存率多少才合格？行业App留存参考</a></li>
<li><a href="https://news.16p.com/872554.html" target="_blank" rel="noopener noreferrer">微信小游戏大盘留存数据：益智、模拟品类次留高于40%</a></li>
<li><a href="https://developers.weixin.qq.com/community/develop/doc/000c0600674528cfcd9ce904b5140d?highLine=%25E6%2590%259E%25E5%25AF%25B9%25E8%25B1%25A1%25E4%25B8%258D%25E5%25A6%2582%25E8%2580%2583%25E6%25B8%2585%25E5%258D%258E%25E6%259E%2597%25E5%2598%2589%25E9%25B2%25A4txt%25E7%2599%25BE%25E5%25BA%25A6%25E4%25BA%2591_%25E3%2580%2590%25E2%2596%258A%25EF%25BC%25B1%25EF%25BC%2591%25EF%25BC%2590%25E2%2592%2588%25E2%2592%258D%25EF%25BC%2599%25E2%2592%258C%25E2%2592%2589%25D0%25B1%25E2%2596%258A%25E3%2580%2591" target="_blank" rel="noopener noreferrer">留存：4 大策略提升 2 类留存官方</a></li>
<li><a href="https://www.thinkingdata.cn/thinking/blog/knowledge/833.html" target="_blank" rel="noopener noreferrer">如何提升网赚游戏的用户留存率，我们总结出了可复用的分析方法</a></li>
</ul>`},title:"客户留存率"}}],["/posts/deploy_efk.html",{loader:()=>i(()=>import("./deploy_efk.html-C2LMvlof.js"),[]),meta:{_blog:{title:"部署EFK",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["EFK"],excerpt:`
<ul>
<li>ElasticSearch</li>
<li>Fluentd</li>
<li>Kibana</li>
</ul>
<h2>Docker Run</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> network create app-tier <span class="token parameter variable">--driver</span> bridge</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"部署EFK"}}],["/posts/deploy_rust_desk_server.html",{loader:()=>i(()=>import("./deploy_rust_desk_server.html-CE-vHGh8.js"),[]),meta:{_blog:{title:"部署RustDesk服务器",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["RustDesk"],excerpt:`
<p>两个可执行程序：</p>
<ul>
<li><code>hbbs</code> - RustDesk ID注册服务器，是管各个客户端 ID 的，每个客户端都有一个唯一的 ID 。</li>
<li><code>hbbr</code> - RustDesk中继服务器，是负责检测、中转各个客户端连接和数据传输。</li>
</ul>
<p>端口占用情况：</p>
<ul>
<li>TCP(21115, 21116, 21117, 21118, 21119)</li>
<li>UDP(21116)</li>
</ul>
<p>进程占用端口情况：</p>
<ul>
<li><code>hbbs</code> - 21115(tcp), 21116(tcp/udp), 21118(tcp)</li>
<li><code>hbbr</code> - 21117(tcp), 21119(tcp)</li>
</ul>`},title:"部署RustDesk服务器"}}],["/posts/develop_docker_deploy.html",{loader:()=>i(()=>import("./develop_docker_deploy.html-C-OrsAAz.js"),[]),meta:{_blog:{title:"本地部署Docker开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<hr>
<ul>
<li>
<p>Bash的换行符为 <code>\\</code></p>
</li>
<li>
<p>CMD的换行符为 <code>^</code></p>
</li>
<li>
<p>Powershell的换行符为 <code>\`</code></p>
</li>
</ul>
<p>参数简析：</p>
<ul>
<li>-p 宿主机端口:容器端口</li>
</ul>
<p>需要设置Host：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line"># Added by Docker Desktop</span>
<span class="line">192.168.1.6 host.docker.internal</span>
<span class="line">192.168.1.6 gateway.docker.internal</span>
<span class="line"># To allow the same kube context to work on the host and the container:</span>
<span class="line">192.168.1.6 kubernetes.docker.internal</span>
<span class="line"># End of section</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"本地部署Docker开发环境"}}],["/posts/develop_jitsi_meet.html",{loader:()=>i(()=>import("./develop_jitsi_meet.html-CondmSvv.js"),[]),meta:{_blog:{title:"部署Jitsi Meet",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Jitsi Meet"],excerpt:`
<h2>Jitsi项目组成</h2>
<ul>
<li><strong>Jitsi Meet</strong>，与WebRTC兼容的JavaScript应用程序，使用Jitsi Videobridge提供高质量、可扩展的视频会议。基于React和React Native构建</li>
<li><strong>Jitsi Videobridge（JVB）</strong> - 与WebRTC兼容的服务器，用于在会议参与者之间路由视频流。</li>
<li><strong>Jitsi Conference Focus (jicofo)</strong> - 用于Jitsi会议的服务器端焦点组件，用于管理媒体会话，并充当每个参与者和视频桥之间的负载平衡器。</li>
<li><strong>Jitsi Gateway to SIP (jigasi)</strong> - 允许常规SIP客户端加入Jitsi会议的服务器端应用程序</li>
<li><strong>Jitsi Broadcasting Infrastructure (jibri)</strong> - 用于录制和/或流式传输Jitsi会议的一组工具，通过启动虚拟帧缓冲区中呈现的Chrome实例，并使用ffmpeg捕获和编码输出来工作</li>
</ul>`},title:"部署Jitsi Meet"}}],["/posts/docker_deploy_simple_traefik_microservice_gateway.html",{loader:()=>i(()=>import("./docker_deploy_simple_traefik_microservice_gateway.html-CcqKUcw3.js"),[]),meta:{_blog:{title:"Docker简单部署Traefik微服务网关",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Traefik","Docker"],excerpt:`
<h2>什么是Traefik?</h2>
<p>Traefik 是一款开源的反向代理与负载均衡工具，它监听后端的变化并自动更新服务配置。Traefik 最大的优点是能够与常见的微服务系统直接整合，可以实现自动化动态配置。目前支持 Docker、Swarm,Marathon、Mesos、Kubernetes、Consul、Etcd、Zookeeper、BoltDB 和 Rest API 等后端模型。</p>
<h2>什么是微服务网关?</h2>
<p>微服务网关是整个微服务API请求的入口，可以实现过滤Api接口。并且可以实现用户的验证登录、解决跨域、日志拦截、权限控制、限流、熔断、负载均衡、黑名单与白名单机制等。</p>`},title:"Docker简单部署Traefik微服务网关"}}],["/posts/docker_deploy_swagger.html",{loader:()=>i(()=>import("./docker_deploy_swagger.html-C0MsSS3R.js"),[]),meta:{_blog:{title:"用Docker轻松搭建Swagger环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Swagger","Docker"],excerpt:`
<h2>概要</h2>
<p>我将介绍如何构建运行在 Docker 上的 Swagger 环境。</p>
<h2>成果</h2>
<h3>Swagger Editor</h3>
<p>网页的左侧是编辑器，右侧是Swagger UI，可以实时查看notation和查看定义文档。
如果将稍后描述的示例复制并粘贴到左侧，结果将显示在右侧，所以请尝试一下。</p>
<p><img src="/assets/images/swagger/swagger_editor.png" alt="swagger_editor"></p>
<h3>Swagger UI</h3>
<p><img src="/assets/images/swagger/swagger_ui.png" alt="swagger_ui"></p>`},title:"用Docker轻松搭建Swagger环境"}}],["/posts/docker_hub_registry_mirrors.html",{loader:()=>i(()=>import("./docker_hub_registry_mirrors.html-D4XnZo_l.js"),[]),meta:{_blog:{title:"Docker Hub 镜像源",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker Hub","Docker"],excerpt:`
<table>
<thead>
<tr>
<th>提供商</th>
<th>公共镜像</th>
<th>私有镜像</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://sf.163.com/help/documents/56918246390157312" target="_blank" rel="noopener noreferrer">网易云</a></td>
<td>http://hub-mirror.c.163.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://cloud.baidu.com/doc/CCE/s/Yjxppt74z" target="_blank" rel="noopener noreferrer">百度云</a></td>
<td>https://mirror.baidubce.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://cloud.tencent.com/document/product/1141/50332" target="_blank" rel="noopener noreferrer">腾讯云</a></td>
<td>https://ccr.ccs.tencentyun.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://dockerproxy.com/docs" target="_blank" rel="noopener noreferrer">Docker Proxy</a></td>
<td>https://dockerproxy.com</td>
<td></td>
</tr>
<tr>
<td><a href="https://support.huaweicloud.com/topic/85789-1-H" target="_blank" rel="noopener noreferrer">华为云</a></td>
<td>https://05f073ad3c0010ea0f4bc00b7105ec20.mirror.swr.myhuaweicloud.com</td>
<td>https://{你的ID}.mirror.swr.myhuaweicloud.com</td>
</tr>
<tr>
<td><a href="https://cr.console.aliyun.com/" target="_blank" rel="noopener noreferrer">阿里云</a></td>
<td>https://1nj0zren.mirror.aliyuncs.com</td>
<td>http://{你的ID}.mirror.aliyuncs.com</td>
</tr>
<tr>
<td><a href="https://www.daocloud.io/mirror" target="_blank" rel="noopener noreferrer">DaoCloud</a></td>
<td><s>http://f1361db2.m.daocloud.io</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://kirk-enterprise.github.io/hub-docs/#/user-guide/mirror" target="_blank" rel="noopener noreferrer">七牛云</a></td>
<td><s>https://reg-mirror.qiniu.com</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/Azure/container-service-for-azure-china/blob/master/aks/README.md#22-container-registry-proxy" target="_blank" rel="noopener noreferrer">Azure</a></td>
<td><s>https://dockerhub.azk8s.cn</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://docker-cn.com/registry-mirror" target="_blank" rel="noopener noreferrer">Docker中国区官方</a></td>
<td><s>https://registry.docker-cn.com</s></td>
<td></td>
</tr>
<tr>
<td><a href="https://mirrors.ustc.edu.cn/help/dockerhub.html" target="_blank" rel="noopener noreferrer">中国科学技术大学</a>（适用于校园网）</td>
<td><s>http://docker.mirrors.ustc.edu.cn</s></td>
<td></td>
</tr>
</tbody>
</table>`},title:"Docker Hub 镜像源"}}],["/posts/docker_inner_install_software.html",{loader:()=>i(()=>import("./docker_inner_install_software.html-BUr7q2bW.js"),[]),meta:{_blog:{title:"Docker内部安装软件",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token punctuation">{</span>容器名<span class="token punctuation">}</span> <span class="token string">"apt update"</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-it</span> <span class="token punctuation">{</span>容器名<span class="token punctuation">}</span> <span class="token string">"apt install {软件名}"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Docker内部安装软件"}}],["/posts/docker_install_vim.html",{loader:()=>i(()=>import("./docker_install_vim.html-DOnVh__z.js"),[]),meta:{_blog:{title:"Docker 容器中安装VIM",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","VIM"],excerpt:`
<p>Docker的容器当中一般是没有安装任何编辑器的,vi和vim神马的都没有.如果想要在容器中使用编辑器,需要自己去安装.<br>
但是,在 Docker 中执行：<code>apt-get update</code>报错:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">E: List directory /var/lib/apt/lists/partial is missing. - Acquire <span class="token punctuation">(</span><span class="token number">13</span>: Permission denied<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Docker 容器中安装VIM"}}],["/posts/docker_no_proxy_solution.html",{loader:()=>i(()=>import("./docker_no_proxy_solution.html-CoC4ZVJC.js"),[]),meta:{_blog:{title:"Docker在国内没有代理的解决方案",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<p>Docker的国内代理都失效了，不抱怨，只讲如何解决问题。</p>
<p>简单来说，就是把本地的镜像导出来，然后打成压缩包，再拷贝到服务器上去，然后再导入。</p>
<h2>导出镜像</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> save bitnami/minio:latest <span class="token parameter variable">-o</span> minio.tar</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Docker在国内没有代理的解决方案"}}],["/posts/docker_port_bind_forbidden.html",{loader:()=>i(()=>import("./docker_port_bind_forbidden.html-xjC6jo5v.js"),[]),meta:{_blog:{title:"Windows11 启动 Docker 提示端口被占用 无法启动",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<p>今天Windows11升级重启了,我启动RabbitMQ,然后提示端口被占用,而无法启动Docker.
提示信息如下:</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">listen tcp <span class="token number">0.0</span>.0.0:1883: bind: An attempt was made to access a socket <span class="token keyword">in</span> a way forbidden by its access permissions.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Windows11 启动 Docker 提示端口被占用 无法启动"}}],["/posts/docker_postgresql_install_extension.html",{loader:()=>i(()=>import("./docker_postgresql_install_extension.html-CS6Focqj.js"),[]),meta:{_blog:{title:"为Docker容器运行的PostgreSQL安装插件",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","PostgreSQL"],excerpt:`
<h2>准备</h2>
<p>查看PostgreSQL的版本号（有些插件带大版本号）：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">SELECT version<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"为Docker容器运行的PostgreSQL安装插件"}}],["/posts/docker_prune.html",{loader:()=>i(()=>import("./docker_prune.html-B_wj_qF8.js"),[]),meta:{_blog:{title:"Docker修剪未使用对象",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<p>Docker 采用保守的方法来清理未使用的对象，例如镜像(Image)、容器(Container)、数据卷(volume)和网络(Network)。也就是说，除非您明确告诉 Docker 这样做，否则每个对象都永远不会被删除。结果导致了 Docker 最终使用了大量的磁盘空间。对于每种类型的对象，Docker 都提供了一个 prune（删除）命令。此外，您可以一次清理多个对象类型。本主题介绍如何使用每个命令。</p>
<h2>镜像(Image)修剪</h2>
<p><code>docker image prune</code>该命令可以清理未使用的镜像。默认情况下，该命令仅删除挂起的镜像。挂起的镜像是没有标签且不被其他容器引用的镜像。要删除挂起的镜像，只需要键入：<code>docker image prune</code></p>`},title:"Docker修剪未使用对象"}}],["/posts/docker_publish_static_website.html",{loader:()=>i(()=>import("./docker_publish_static_website.html-BlpBxQvj.js"),[]),meta:{_blog:{title:"使用Docker发布静态网站",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<h2>创建Dockerfile</h2>
<h2>注册Docker Hub账号</h2>
`},title:"使用Docker发布静态网站"}}],["/posts/docker_release_disk.html",{loader:()=>i(()=>import("./docker_release_disk.html-CPAmf7-E.js"),[]),meta:{_blog:{title:"Docker清理磁盘空间",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker"],excerpt:`
<p>在日常运维当中，Docker会产生一些运行时的临时文件，我们需要定时的清理掉他们，不然将会对磁盘造成极大的压力。</p>
<h2>探查命令</h2>
<p>查看整个Docker系统的磁盘占用情况：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> system <span class="token function">df</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Docker清理磁盘空间"}}],["/posts/docx_add_pinyin.html",{loader:()=>i(()=>import("./docx_add_pinyin.html-NHMwQ0qq.js"),[]),meta:{_blog:{title:"如何在Word文档中批量添加汉字注音",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Word","VBA","Go"],excerpt:`
<p>所谓的汉字注音，就是给汉字上方加注拼音。</p>
<p><img src="/assets/images/office/pinyin.jpeg" alt="汉字注音"></p>
<p>在Office里面，这个功能叫做 <strong>“拼音指南”（Phonetic Guide）</strong>。</p>
<p><img src="/assets/images/office/pinyinzhinan.jpeg" alt="拼音指南"></p>
<p>拼音指南一次只能够处理最多30个字，一篇文章不可能只有30个字，上百个字是很正常的，人工处理就会很累。所以，需要做到自动化，做到自动化有两种方式可以做到：</p>`},title:"如何在Word文档中批量添加汉字注音"}}],["/posts/doris4_quantitative_trading.html",{loader:()=>i(()=>import("./doris4_quantitative_trading.html-C1H4Xd6j.js"),[]),meta:{_blog:{title:"Apache Doris 4.x 在量化交易中的完整应用实践",author:"",date:"2026-04-01T00:00:00.000Z",category:["量化开发"],tag:["Doris","量化交易"],excerpt:`
<h2>前言</h2>
<p>在量化交易场景中，<strong>实时行情接入、多维度 K 线聚合、技术指标计算、策略回测与绩效监控</strong>是核心能力诉求。Apache Doris 4.x 凭借高性能 OLAP 引擎、实时物化视图、标准 SQL 兼容、Kafka 实时接入等特性，成为量化投研与实盘交易的理想存储计算引擎。</p>
<p>本文基于 Doris 4.x 构建<strong>一站式量化交易数据平台</strong>，覆盖分钟级行情存储、实时聚合、技术指标、策略选股、AI 辅助决策、回测复盘全流程，可直接用于生产环境部署。</p>
<h2>一、整体架构设计</h2>
<p>本方案采用分层量化数仓架构，兼顾实时性、查询性能与投研易用性：</p>`},title:"Apache Doris 4.x 在量化交易中的完整应用实践"}}],["/posts/efficient_communication_between_parent_and_child_widgets_in_flutter.html",{loader:()=>i(()=>import("./efficient_communication_between_parent_and_child_widgets_in_flutter.html-CB7bpkyF.js"),[]),meta:{_blog:{title:"Flutter中父子Widget之间如何进行高效通信",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","Widget"],excerpt:`
<p>Flutter 的 widget系统 允许 父widget 和 子widget 之间无缝通信。了解如何双向调用方法可以显著增强应用的架构和性能。在本文中，我们将探讨如何从 父widget 调用 子widget 的方法，反之亦然。</p>
<h2>从父部件调用子部件的方法</h2>
<p>在 Flutter 中，可以使用属于子<code>State</code>类型的全局键<code>GlobalKey</code>来从父级调用子Widget中定义的方法。</p>
<p>例如：假设我们有一个名为<code>ChildWidget</code>的子窗口小部件</p>
<div class="language-dart line-numbers-mode" data-highlighter="prismjs" data-ext="dart"><pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidget</span> <span class="token keyword">extends</span> <span class="token class-name">StatefulWidget</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> <span class="token class-name">ChildWidget</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token keyword">super</span><span class="token punctuation">.</span>key<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidget</span><span class="token punctuation">&gt;</span></span> <span class="token function">createState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=</span><span class="token operator">&gt;</span> <span class="token class-name">ChildWidgetState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">ChildWidgetState</span> <span class="token keyword">extends</span> <span class="token class-name">State</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ChildWidget</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span></span>
<span class="line">  int value <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token metadata function">@override</span></span>
<span class="line">  <span class="token class-name">Widget</span> <span class="token function">build</span><span class="token punctuation">(</span><span class="token class-name">BuildContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token class-name">Card</span><span class="token punctuation">(</span></span>
<span class="line">      elevation<span class="token punctuation">:</span> <span class="token number">10</span><span class="token punctuation">,</span></span>
<span class="line">      child<span class="token punctuation">:</span> <span class="token class-name">Container</span><span class="token punctuation">(</span></span>
<span class="line">        height<span class="token punctuation">:</span> <span class="token number">200</span><span class="token punctuation">,</span></span>
<span class="line">        decoration<span class="token punctuation">:</span> <span class="token class-name">BoxDecoration</span><span class="token punctuation">(</span></span>
<span class="line">          borderRadius<span class="token punctuation">:</span> <span class="token class-name">BorderRadius</span><span class="token punctuation">.</span><span class="token function">circular</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          color<span class="token punctuation">:</span> <span class="token class-name">Colors</span><span class="token punctuation">.</span>green<span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">        child<span class="token punctuation">:</span> <span class="token class-name">Column</span><span class="token punctuation">(</span></span>
<span class="line">          children<span class="token punctuation">:</span> <span class="token punctuation">[</span></span>
<span class="line">            <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">              <span class="token string-literal"><span class="token string">"Child Widget"</span></span><span class="token punctuation">,</span></span>
<span class="line">              style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span>headline1<span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">ElevatedButton</span><span class="token punctuation">(</span>onPressed<span class="token punctuation">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> child<span class="token punctuation">:</span> <span class="token keyword">const</span> <span class="token class-name">Text</span><span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"Call Parent"</span></span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token class-name">Center</span><span class="token punctuation">(</span></span>
<span class="line">              child<span class="token punctuation">:</span> <span class="token class-name">Text</span><span class="token punctuation">(</span></span>
<span class="line">                <span class="token string-literal"><span class="token string">'Child value:  </span><span class="token interpolation"><span class="token punctuation">$</span><span class="token expression">value</span></span><span class="token string">'</span></span><span class="token punctuation">,</span></span>
<span class="line">                style<span class="token punctuation">:</span> <span class="token class-name">DemoTextStyle</span><span class="token punctuation">.</span><span class="token function">copyWith</span><span class="token punctuation">(</span></span>
<span class="line">                    fontSize<span class="token punctuation">:</span> <span class="token number">18</span><span class="token punctuation">,</span> fontWeight<span class="token punctuation">:</span> <span class="token class-name">FontWeight</span><span class="token punctuation">.</span>normal<span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">              <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">          <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      value<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">void</span> <span class="token function">changeValueDynamic</span><span class="token punctuation">(</span>int val<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      value <span class="token operator">=</span> val<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Flutter中父子Widget之间如何进行高效通信"}}],["/posts/entgo_code_generate_tools.html",{loader:()=>i(()=>import("./entgo_code_generate_tools.html-BI0lOhg0.js"),[]),meta:{_blog:{title:"Ent代码生成工具链",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Go","Ent","SQL"],excerpt:`
<p>Ent是Facebook开源的一个GO语言的ORM框架。它提供了一系列的工具，可以做到：</p>
<ol>
<li>SQL生成schema；</li>
<li>schema生成protobuf的message；</li>
<li>schema生成gPRC的service。</li>
</ol>
<h2>创建go项目</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">go mod init entimport-example</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Ent代码生成工具链"}}],["/posts/entgo_soft_delete.html",{loader:()=>i(()=>import("./entgo_soft_delete.html-FtpPnTm4.js"),[]),meta:{_blog:{title:"Entgo 实现 软删除（Soft Delete）",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Go","Ent","SQL"],excerpt:`
<p>我们在开发程序的过程中，会遇到一个常见的需求——删除表中的数据。</p>
<p>但是有时候，业务需求要求不能永久删除数据库中的数据。比如一些敏感信息，我们需要留着以方便做历史追踪。
这个时候，我们便会用到软删除。</p>
<p>Entgo本身是不直接支持的，但是，要实现也并不是很难的事情。</p>
<h2>什么是软删除？</h2>
<p><strong>软删除（Soft Delete）</strong> 是相对于 <strong>硬删除（Hard Delete）</strong> 来说的，它又可以叫做 <strong>逻辑删除</strong> 或者 <strong>标记删除</strong>。</p>`},title:"Entgo 实现 软删除（Soft Delete）"}}],["/posts/excel_7_style.html",{loader:()=>i(()=>import("./excel_7_style.html-DNJqU3Pg.js"),[]),meta:{_blog:{title:"Excel表格七种配色组合",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Excel","配色"],excerpt:`
<p><img src="/assets/images/excel/excel_style_title.jpg" alt="excel_style_title.jpg"></p>
<p><img src="/assets/images/excel/excel_style_1.jpg" alt="excel_style_1.jpg"></p>
<p><img src="/assets/images/excel/excel_style_2.jpg" alt="excel_style_2.jpg"></p>
<p><img src="/assets/images/excel/excel_style_3.jpg" alt="excel_style_3.jpg"></p>`},title:"Excel表格七种配色组合"}}],["/posts/execel_transfer_column_number_letter.html",{loader:()=>i(()=>import("./execel_transfer_column_number_letter.html-CY92gWQj.js"),[]),meta:{_blog:{title:"Excel列数和列字母的转换",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Excel","TypeScript","C#","Go"],excerpt:`
<h2>TypeScript版</h2>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code><span class="line"><span class="token comment">// 列数 -&gt; 列字母</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">ColumnNumberToName</span><span class="token punctuation">(</span>num<span class="token operator">:</span> <span class="token builtin">number</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>num <span class="token operator">&lt;</span> <span class="token number">1</span> <span class="token operator">||</span> num <span class="token operator">&gt;</span> <span class="token number">16384</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token string">''</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>num <span class="token operator">&gt;</span> <span class="token number">26</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> digit1 <span class="token operator">=</span> String<span class="token punctuation">.</span><span class="token function">fromCharCode</span><span class="token punctuation">(</span><span class="token punctuation">(</span>num <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">26</span> <span class="token operator">+</span> <span class="token number">64</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">const</span> digit2 <span class="token operator">=</span> String<span class="token punctuation">.</span><span class="token function">fromCharCode</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>num <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token number">26</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">65</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> digit1 <span class="token operator">+</span> digit2</span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> String<span class="token punctuation">.</span><span class="token function">fromCharCode</span><span class="token punctuation">(</span>num <span class="token operator">+</span> <span class="token number">64</span><span class="token punctuation">)</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 列字母 -&gt; 列数</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">ColumnNameToNumber</span><span class="token punctuation">(</span>name<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">number</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">let</span> num <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>name<span class="token punctuation">.</span>length <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    num <span class="token operator">=</span> <span class="token function">Number</span><span class="token punctuation">(</span>name<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">charCodeAt</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">64</span></span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>name<span class="token punctuation">.</span>length <span class="token operator">==</span> <span class="token number">2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    num <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token function">Number</span><span class="token punctuation">(</span>name<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">charCodeAt</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">64</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">26</span> <span class="token operator">+</span> <span class="token function">Number</span><span class="token punctuation">(</span>name<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">charCodeAt</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">64</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  <span class="token keyword">return</span> num</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNumberToName</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNumberToName</span><span class="token punctuation">(</span><span class="token number">26</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNumberToName</span><span class="token punctuation">(</span><span class="token number">27</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNameToNumber</span><span class="token punctuation">(</span><span class="token string">'A'</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNameToNumber</span><span class="token punctuation">(</span><span class="token string">'Z'</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token builtin">console</span><span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">ColumnNameToNumber</span><span class="token punctuation">(</span><span class="token string">'AA'</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Excel列数和列字母的转换"}}],["/posts/exploring_sealed_classes_in_flutter.html",{loader:()=>i(()=>import("./exploring_sealed_classes_in_flutter.html-C3sTpKk6.js"),[]),meta:{_blog:{title:"探索 Flutter 中的 Sealed Class",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","Sealed Class"],excerpt:`
<p><code>Dart 3</code> 在 <code>Flutter</code> 中引入了 <code>密封类(Sealed Class)</code>。如果您来自于类似 <code>Kotlin</code> 这样的现代编程语言，您可能已经知道它们有多么强大。如果没有，在本文结束时您将了解到关于密封类的全部内容。</p>
<blockquote>
<p>密封类(Sealed Class)是一项强大的功能，使开发人员能够创建受限制的类层次结构。与常规类不同，密封类只能在同一文件中扩展，这使得它们成为表示有限相关类集的绝佳选择。</p>
</blockquote>
<h2>了解密封类</h2>`},title:"探索 Flutter 中的 Sealed Class"}}],["/posts/extract_wechat_applet_resources.html",{loader:()=>i(()=>import("./extract_wechat_applet_resources.html-U9TZBDZH.js"),[]),meta:{_blog:{title:"如何获取微信小程序的资源",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["微信小程序"],excerpt:`
<p>之前，都是找的Andriod的文件，但是，这很麻烦，因为需要Root，不然无法访问。找到文件，拷贝也是一件很麻烦的事情。</p>
<p>现在，电脑版的微信也是可以使用小程序的，所以，从电脑上去寻找小程序的资源就变得切实可行。</p>
<h2>小程序所在的位置</h2>
<p>首先，它有两个路径：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">C:<span class="token punctuation">\\</span>Users<span class="token punctuation">\\</span><span class="token punctuation">{</span>Windows用户名<span class="token punctuation">}</span><span class="token punctuation">\\</span>Documents<span class="token punctuation">\\</span>WeChat Files<span class="token punctuation">\\</span>Applet<span class="token punctuation">\\</span><span class="token punctuation">{</span>小程序ID<span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"如何获取微信小程序的资源"}}],["/posts/face_recognition.html",{loader:()=>i(()=>import("./face_recognition.html-CJEOy-wB.js"),[]),meta:{_blog:{title:"Python 人脸识别",author:"",date:"2020-01-01T00:00:00.000Z",category:["Python编程"],tag:["人脸识别"],excerpt:`
<h2>人脸识别十大关键技术</h2>
<h3>1. <strong>人脸检测(Face Detection)</strong></h3>
<p>“人脸检测”的作用就是要检测出图像中人脸所在位置。人脸检测算法的原理简单来说是一个“扫描”加“判定”的过程。即首先在整个图像范围内扫描，再逐个判定候选区域是否是人脸的过程。因此人脸检测算法的计算速度会跟图像尺寸大小以及图像内容相关。在实际算法时，我们可以通过设置“输入图像尺寸”、或“最小脸尺寸限制”、“人脸数量上限”的方式来加速算法。</p>
<h3>2. <strong>人脸配准(Face Alignment)</strong></h3>
<p>“人脸配准”所实现的目的是定位出人脸上五官关键点坐标。当前效果的较好的一些人脸配准技术基本通过深度学习框架实现。这些方法都是基于人脸检测的坐标框，按某种事先设定规则将人脸区域抠取出来，缩放到固定尺寸，然后进行关键点位置的计算。另外，相对于人脸检测，或者是后面将提到的人脸特征提取的过程，人脸配准算法的计算耗时都要少很多。</p>`},title:"Python 人脸识别"}}],["/posts/firefly_roc_rk3588s_pc.html",{loader:()=>i(()=>import("./firefly_roc_rk3588s_pc.html-Dd_JKZ3y.js"),[]),meta:{_blog:{title:"Firefly ROC-RK3588S-PC",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["RK3588S"],excerpt:`
<p>默认安装的是Android系统，我们不需要，我们需要一个Ubuntu Desktop。</p>
<h2>安装工具</h2>
<ul>
<li>安装RK USB驱动 DriverAssistant</li>
<li>安装运行 RKDevTool</li>
<li>下载固件：Ubuntu、Debian、Buildroot……</li>
</ul>
<h2>开发板进入到Loader模式</h2>
<ol>
<li>先断开电源；</li>
<li>USB线一端插入到OTG口，另外一端插入到电脑；</li>
<li>按住<code>RECOVERY 键</code>（需要注意，为了防止误触，它的按钮被隐藏在侧面，手指头探下，将黑色的按钮往白色的按钮基座抠）；</li>
<li>接通电源；</li>
<li><code>RECOVERY 键</code>持续摁住大约2秒。</li>
</ol>`},title:"Firefly ROC-RK3588S-PC"}}],["/posts/fix_build_bug_android_studio_upgrade_to_ladybug.html",{loader:()=>i(()=>import("./fix_build_bug_android_studio_upgrade_to_ladybug.html-CIkDhNNs.js"),[]),meta:{_blog:{title:"解决 Flutter 项目更新至 Android Studio Ladybug (2024.2.1) 后出现的问题",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","Android Studio"],excerpt:`
<p>升级到Android Studio Ladybug | 2024.2.1后，我在 Flutter 项目中遇到了一些问题。幸运的是，我通过修改一些配置文件找到了一个简单的解决方案。如果您面临类似的挑战，请按照以下步骤让您的项目重回正轨。</p>
<p>修改<code>settings.gradle</code>：</p>
<div class="language-gradle line-numbers-mode" data-highlighter="prismjs" data-ext="gradle"><pre><code><span class="line">id <span class="token interpolation-string"><span class="token string">"com.android.application"</span></span> version <span class="token interpolation-string"><span class="token string">"8.3.2"</span></span> <span class="token keyword">apply</span> <span class="token boolean">false</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"解决 Flutter 项目更新至 Android Studio Ladybug (2024.2.1) 后出现的问题"}}],["/posts/fix_flutter_ios_build_errors.html",{loader:()=>i(()=>import("./fix_flutter_ios_build_errors.html-CgRCVm3k.js"),[]),meta:{_blog:{title:"修复Flutter一些iOS编译错误",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","iOS"],excerpt:`
<h2>Сocoapods trunk URL couldn’t be downloaded</h2>
<p>逐行运行此命令</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">gem uninstall cocoapods </span>
<span class="line">arch <span class="token parameter variable">-x86_64</span> brew <span class="token function">install</span> cocoapods </span>
<span class="line">arch <span class="token parameter variable">-x86_64</span> brew reinstall cocoapods </span>
<span class="line"><span class="token builtin class-name">cd</span> ios </span>
<span class="line">pod cache clean <span class="token parameter variable">--all</span> </span>
<span class="line">pod <span class="token function">install</span> （如果m1 macOS 运行这个“arch <span class="token parameter variable">-x86_64</span> pod install”）</span>
<span class="line">pod update</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"修复Flutter一些iOS编译错误"}}],["/posts/flutter_getx_is_not_a_good_choose.html",{loader:()=>i(()=>import("./flutter_getx_is_not_a_good_choose.html-B2KmgELK.js"),[]),meta:{_blog:{title:"刚进入Flutter吗？适合初学者食用，GetX是否适合你呢？",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","GetX"],excerpt:`
<p>是否使用 GetX？</p>
<p><img src="/assets/images/flutter/flutter_getx_dont_try_at_beginning.png" alt=""></p>
<p>看到有许多人在讨论 GetX 如何如何，通常很多人是刚进入 Flutter 的初学者，一眼望去，有许多状态管理可以选择，感觉无从下手，所以提出自己的询问，我觉得这些人做得很好，他们在决定投入之前，会先尝试一下询问社群。</p>
<p>在这里，我先给出个我的意见：</p>
<blockquote>
<p>不建议你使用，尤其在专业以及大型的产品上更不应该使用，而且它也无法帮助你的职业发展。</p>
</blockquote>`},title:"刚进入Flutter吗？适合初学者食用，GetX是否适合你呢？"}}],["/posts/flutter_newbie.html",{loader:()=>i(()=>import("./flutter_newbie.html-C0Di8-Wo.js"),[]),meta:{_blog:{title:"Flutter学习实录",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter"],excerpt:`
<h2>数字格式化</h2>
<p>可以使用<code>intl</code>实现该功能。</p>
<p>首先安装库：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">flutter pub <span class="token function">add</span> intl</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Flutter学习实录"}}],["/posts/flutter_ohos.html",{loader:()=>i(()=>import("./flutter_ohos.html-B-yxUJpB.js"),[]),meta:{_blog:{title:"搭建Flutter的鸿蒙开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","鸿蒙"],excerpt:`
<h2>安装鸿蒙开发环境</h2>
<p>首先，需要下载安装两个东西：<code>DevEco Studio</code>和<code>command-line-tools</code>，在这个<a href="https://developer.huawei.com/consumer/cn/download/" target="_blank" rel="noopener noreferrer">网址</a>去下载。</p>
<p><code>DevEco Studio</code>是Jetbrains定制的IDE，使用起来和Android Studio也差不太多。</p>
<p>安装好之后，然后通过内置的SDK管理器去下载SDK，进入SDK管理器的路径是：<code>File -&gt; Settings -&gt; OpenHarony SDK</code>。找一个合适的版本下载。默认本地安装路径：<code>C:\\Users\\{用户名}\\AppData\\Local\\OpenHarmony\\Sdk</code>。</p>`},title:"搭建Flutter的鸿蒙开发环境"}}],["/posts/flutter_source_list.html",{loader:()=>i(()=>import("./flutter_source_list.html-BNFxnZUy.js"),[]),meta:{_blog:{title:"Flutter切换源",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter"],excerpt:`
<h2>国内镜像列表</h2>
<table>
<thead>
<tr>
<th>提供商</th>
<th>PUB_HOSTED_URL</th>
<th>FLUTTER_STORAGE_BASE_URL</th>
</tr>
</thead>
<tbody>
<tr>
<td>上海交大</td>
<td>https://mirror.sjtu.edu.cn/dart-pub</td>
<td>https://mirror.sjtu.edu.cn</td>
</tr>
<tr>
<td>清华大学</td>
<td>https://mirrors.tuna.tsinghua.edu.cn/dart-pub</td>
<td>https://mirrors.tuna.tsinghua.edu.cn/flutter</td>
</tr>
<tr>
<td>OpenTUNA</td>
<td>https://opentuna.cn/dart-pub</td>
<td>https://opentuna.cn/flutter</td>
</tr>
<tr>
<td>CNNIC</td>
<td>http://mirrors.cnnic.cn/dart-pub</td>
<td>http://mirrors.cnnic.cn/flutter</td>
</tr>
<tr>
<td>Flutter中国（七牛云）</td>
<td>https://pub.flutter-io.cn</td>
<td>https://storage.flutter-io.cn</td>
</tr>
<tr>
<td>腾讯云</td>
<td>https://mirrors.cloud.tencent.com/dart-pub</td>
<td>https://mirrors.cloud.tencent.com/flutter</td>
</tr>
</tbody>
</table>`},title:"Flutter切换源"}}],["/posts/flutter_use_sealed_class_made_class_stronger.html",{loader:()=>i(()=>import("./flutter_use_sealed_class_made_class_stronger.html-BL3FCsHX.js"),[]),meta:{_blog:{title:"Flutter使用Sealed Class让状态类更强大",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","Sealed Class"],excerpt:`
<p>记得之前在写Kotlin的时候，对于Kotlin所提供的<code>Sealed Class</code>的功能感到惊喜，我还给Sealed Class封上了enum 2.0的称号，它拥有Class的特性，可以将状态封装起来，使用<code>when</code>语法的时候，还可以详尽列出所有的子项，而在Flutter当中，其实也有<code>sealed class</code>可以用，在Dart 3.0中，也已经将sealed class加入到了Dart的武器库。</p>
<h2>enum</h2>
<p>假如，我们现在要实现一个 收音机 功能，我们可以使用enum声明其状态，代码如下：</p>`},title:"Flutter使用Sealed Class让状态类更强大"}}],["/posts/font_rendering.html",{loader:()=>i(()=>import("./font_rendering.html-CbcYsNM0.js"),[]),meta:{_blog:{title:"字体渲染",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["字体渲染"],excerpt:`
<h2>位图字体(Bitmap Font)</h2>
<p>最简单的文本渲染方式是：<code>点阵字体 (Dot-matrix-fonts)</code> 也叫<code>位图字体 (Bitmap-fonts)</code>。</p>
<p>位图字体通过将所需的独特字形光栅化为单个纹理（称为 <a href="https://en.wikipedia.org/wiki/Texture_atlas" target="_blank" rel="noopener noreferrer">纹理图集(Texture atlas)</a>），使用的时候再找到对应的字符的 UV，再绘制文本。</p>
<p><img src="/assets/images/font_rendering/bitmap_font_sampling.png" alt="位图字体(Bitmap Font)"></p>`},title:"字体渲染"}}],["/posts/futures.html",{loader:()=>i(()=>import("./futures.html-B4pM6Ajh.js"),[]),meta:{_blog:{title:"期货相关",author:"",date:"2020-01-01T00:00:00.000Z",category:["量化开发"],tag:["期货","Futures"],excerpt:`
<h2>期货合约（Futures Contract）</h2>
<p>期货合约（英语：futures
contract），简称期货（英语：futures），是一种跨越时间的交易方式，金融衍生工具的一种。买卖双方透过签订合约，同意按指定的时间、价格与其他交易条件，交收指定数量的现货。通常期货集中在期货交易所，以标准化合约进行买卖，但亦有部分期货合约可透过柜台交易进行买卖，称为场外交易合约。交易的资产通常是商品或金融工具。双方同意购买和出售资产的预定价格被称为远期价格。未来的指定时间 -
即交付和付款发生时 - 称为交货日期。因为它是标的资产的函数，期货合约是衍生工具。</p>
<h2>期货的基本制度</h2>`},title:"期货相关"}}],["/posts/gaode_geofence.html",{loader:()=>i(()=>import("./gaode_geofence.html-B4yljNDL.js"),[]),meta:{_blog:{title:"使用高德地图实现地理围栏",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["地理围栏"],excerpt:`
<h2>什么是地理围栏(Geo-fencing)?</h2>
<p>地理围栏（Geo-fencing）是LBS的一种新应用，就是用一个虚拟的栅栏围出一个虚拟地理边界。当手机进入、离开某个特定地理区域，或在该区域内活动时，手机可以接收自动通知和警告。有了地理围栏技术，位置社交网站就可以帮助用户在进入某一地区时自动登记。</p>
<h2>地理坐标系</h2>
<p>我们通常用经纬度来表示一个地理位置，但是由于一些原因，我们从不同渠道得到的经纬度信息可能并不是在同一个坐标系下。</p>
<ul>
<li>高德地图、腾讯地图以及谷歌中国区地图使用的是<strong>GCJ-02</strong>坐标系</li>
<li>百度地图使用的是<strong>BD-09</strong>坐标系</li>
<li>底层接口(HTML5 Geolocation或ios、安卓API)通过GPS设备获取的坐标使用的是<strong>WGS-84</strong>坐标系</li>
</ul>`},title:"使用高德地图实现地理围栏"}}],["/posts/geo_db.html",{loader:()=>i(()=>import("./geo_db.html-BERahXC2.js"),[]),meta:{_blog:{title:"地理空间搜索",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["GEO"],excerpt:`
<h2>Redis</h2>
<p>Redis 3.2.0版本开始，提供了<code>GEO</code>系列命令，可以用搜索、索引地理位置信息。</p>
<h3>索引地理位置信息</h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">GEOADD Sicily <span class="token number">13.361389</span> <span class="token number">38.115556</span> <span class="token string">"Palermo"</span> <span class="token number">15.087269</span> <span class="token number">37.502669</span> <span class="token string">"Catania"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"地理空间搜索"}}],["/posts/git_set_proxy.html",{loader:()=>i(()=>import("./git_set_proxy.html-C8CV1GOR.js"),[]),meta:{_blog:{title:"Git设置网络代理",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Git"],excerpt:`
<h2>设置HTTP代理</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> config <span class="token parameter variable">--global</span> http.proxy http://127.0.0.1:1080</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Git设置网络代理"}}],["/posts/git_submodule.html",{loader:()=>i(()=>import("./git_submodule.html-DiN-iKGH.js"),[]),meta:{_blog:{title:"git submodule",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Git"],excerpt:`
<h2>添加子模块</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">git</span> submodule <span class="token function">add</span> <span class="token operator">&lt;</span>url<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>path<span class="token operator">&gt;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"git submodule"}}],["/posts/go-wind-admin-notify-39-channels.html",{loader:()=>i(()=>import("./go-wind-admin-notify-39-channels.html-BhjAmtSP.js"),[]),meta:{_blog:{title:"GoWind Admin 拆解：一个 Sender 接口接 39 个通知渠道",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","通知系统","设计模式"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>通知渠道从"邮件/短信/Webhook"老三样扩到 39 种（钉钉、飞书、Slack、Telegram、Bark、极光、Twilio、PagerDuty……），代码量为什么没有翻 13 倍——配置面是怎么设计的？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">GoWind Admin</a> 的通知渠道扩展（1.4.0）把接入渠道数从 3 种推到 39 种，但真正值得拆的不是"接了多少平台"，而是这条扩展曲线背后的三个设计决策：<strong>投递能力下沉为独立库</strong>（管"怎么发"）、<strong>schema 驱动的注册表</strong>（新渠道 = 一份声明 + 一份 builder）、<strong>配置存储从多列切到整包 JSON</strong>（39 种渠道共用一个 settings 列）。加上敏感字段的"加密落库 / 回显脱敏 / 留空不修改"三段闭环，这一套组合是可以直接搬走的通知渠道扩展方案。</p>`},title:"GoWind Admin 拆解：一个 Sender 接口接 39 个通知渠道"}}],["/posts/go-wind-ai-development-framework-scaffold-value.html",{loader:()=>i(()=>import("./go-wind-ai-development-framework-scaffold-value.html-0KUZrtfY.js"),[]),meta:{_blog:{title:"AI重构软件开发范式：框架与脚手架为何仍是生产级开发的刚需？",author:"",date:"2026-05-31T00:00:00.000Z",category:["GoWind风行"],tag:["Vue3","React","Protobuf","GoWind","AI"],excerpt:`
<h2>前言</h2>
<p>大模型技术高速迭代，正在深层次重塑软件开发的作业模式。当前编码类大模型已成熟支持单文件编写、批量CRUD生成、业务逻辑拼装等能力，部分低复杂度业务模块，甚至可全程交由AI独立完成开发与交付。</p>
<p>行业内随之滋生出一种极具迷惑性的论调：<strong>AI普及编码之后，开发框架与脚手架的价值将会彻底消亡。未来开发者仅依靠Prompt即可完成全流程开发，标准化工程基建终将沦为时代冗余产物</strong>。</p>
<p>站在生产级微服务、企业级中后台项目的落地视角来看，该观点存在根本性认知误区，其混淆了<strong>碎片化代码生成</strong>与<strong>系统化工程交付</strong>两个完全不同的概念。直白来说：<strong>会写代码不等于能搭建生产级系统</strong>，这也是当下绝大多数开发者对AI编码最大的认知盲区。</p>`},title:"AI重构软件开发范式：框架与脚手架为何仍是生产级开发的刚需？"}}],["/posts/go-wind-cms-flutter-tech-guide.html",{loader:()=>i(()=>import("./go-wind-cms-flutter-tech-guide.html-B21SD2E9.js"),[]),meta:{_blog:{title:"基于 Flutter 的 Headless CMS 全平台前端架构：技术解析与二次开发导引",author:"",date:"2026-06-07T00:00:00.000Z",category:["GoWind风行"],tag:["Flutter","Dart","CMS","GoWind"],excerpt:`
<blockquote>
<p>本文面向希望基于此项目进行二次开发的 Flutter 工程师，从技术栈选型、核心架构设计、关键模块实现到二开实践路径，提供一份完整的技术地图。</p>
</blockquote>
<hr>
<h2>一、技术栈总览</h2>
<p>本项目是一个 <strong>Flutter 全平台</strong> CMS 内容展示前端，一套 Dart 代码同时编译为 iOS、Android、Web、macOS、Windows 等多端应用：</p>
<table>
<thead>
<tr>
<th>层面</th>
<th>技术</th>
<th>版本</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td>框架</td>
<td>Flutter</td>
<td>3.x (Dart 3.12+)</td>
<td>全平台 UI 框架</td>
</tr>
<tr>
<td>语言</td>
<td>Dart</td>
<td>3.x</td>
<td>类型安全 + 空安全</td>
</tr>
<tr>
<td>状态管理</td>
<td>flutter_bloc + Cubit</td>
<td>9.x</td>
<td>响应式状态（Cubit 模式）</td>
</tr>
<tr>
<td>服务定位</td>
<td>GetIt</td>
<td>9.x</td>
<td>轻量 IoC 容器（单例管理）</td>
</tr>
<tr>
<td>路由</td>
<td>GoRouter</td>
<td>17.x</td>
<td>声明式路由 + ShellRoute</td>
</tr>
<tr>
<td>国际化</td>
<td>flutter_intl (intl)</td>
<td>0.21.x</td>
<td>ARB 翻译文件 + 代码生成</td>
</tr>
<tr>
<td>HTTP 客户端</td>
<td>Dio + Retrofit</td>
<td>5.x / 4.x</td>
<td>REST 通信 + 类型安全客户端</td>
</tr>
<tr>
<td>API 代码生成</td>
<td>swagger_parser</td>
<td>1.43.x</td>
<td>OpenAPI → Dart 模型 + 客户端</td>
</tr>
<tr>
<td>数据缓存</td>
<td>cached_query</td>
<td>3.x</td>
<td>Query/Mutation 缓存管理</td>
</tr>
<tr>
<td>响应式适配</td>
<td>flutter_screenutil</td>
<td>5.x</td>
<td>手机端设计稿适配（Web 端禁用）</td>
</tr>
<tr>
<td>Markdown</td>
<td>flutter_markdown</td>
<td>0.7.x</td>
<td>内容解析</td>
</tr>
<tr>
<td>HTML 渲染</td>
<td>flutter_widget_from_html</td>
<td>0.17.x</td>
<td>富文本渲染</td>
</tr>
<tr>
<td>加密</td>
<td>encrypt + crypto</td>
<td>5.x / 3.x</td>
<td>AES 加密（Token 持久化）</td>
</tr>
<tr>
<td>JWT</td>
<td>jose</td>
<td>0.3.x</td>
<td>JWT Token 解析</td>
</tr>
<tr>
<td>图片缓存</td>
<td>cached_network_image</td>
<td>3.x</td>
<td>网络图片缓存</td>
</tr>
<tr>
<td>骨架屏</td>
<td>shimmer</td>
<td>3.x</td>
<td>加载占位动画</td>
</tr>
<tr>
<td>环境变量</td>
<td>flutter_dotenv</td>
<td>6.x</td>
<td>.env 文件管理</td>
</tr>
<tr>
<td>日志</td>
<td>logger</td>
<td>2.x</td>
<td>结构化日志</td>
</tr>
</tbody>
</table>`},title:"基于 Flutter 的 Headless CMS 全平台前端架构：技术解析与二次开发导引"}}],["/posts/go-wind-cms-microservice-why-choose-kratos.html",{loader:()=>i(()=>import("./go-wind-cms-microservice-why-choose-kratos.html-CDx1kozf.js"),[]),meta:{_blog:{title:"go-wind-cms 微服务架构设计：为什么基于 Kratos？",author:"",date:"2026-04-09T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在内容管理系统（CMS）向微服务、云原生升级的浪潮中，技术框架的选型直接决定架构的稳定性、扩展性与开发效率。作为基于 Go 语言打造的企业级 Headless CMS，go-wind-cms 摒弃了传统单体架构的局限，采用微服务架构设计，而其核心技术底座，选择了由 B 站开源、社区共建的 Kratos 微服务框架。</p>
<p>很多开发者会疑惑：Go 语言生态中不乏 Go-Zero、Go-Micro 等优秀微服务框架，go-wind-cms 为何独选 Kratos？答案并非单一维度的技术偏好，而是 Kratos 的设计理念、核心特性与 go-wind-cms 的业务场景、产品定位高度契合——从标准化治理到可观测性，从生态协同到业务适配，Kratos 为 go-wind-cms 提供了“开箱即用、可扩展、易维护”的微服务解决方案，完美解决了 CMS 微服务化过程中的核心痛点。</p>`},title:"go-wind-cms 微服务架构设计：为什么基于 Kratos？"}}],["/posts/go-wind-cms-nextjs-tech-guide.html",{loader:()=>i(()=>import("./go-wind-cms-nextjs-tech-guide.html-NWXUgRQH.js"),[]),meta:{_blog:{title:"基于 Next.js 的 Headless CMS 前端架构：技术解析与二次开发导引",author:"",date:"2026-06-03T00:00:00.000Z",category:["GoWind风行"],tag:["React","React.js","CMS","GoWind"],excerpt:`
<blockquote>
<p>本文面向希望基于此项目进行二次开发的前端工程师，从技术栈选型、核心架构设计、关键模块实现到二开实践路径，提供一份完整的技术地图。</p>
</blockquote>
<hr>
<h2>一、技术栈总览</h2>
<p>本项目是一个<strong>静态导出型</strong> CMS 内容展示前端，采用以下核心技术栈：</p>
<table>
<thead>
<tr>
<th>层面</th>
<th>技术</th>
<th>版本</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td>框架</td>
<td>Next.js (App Router)</td>
<td>16.x</td>
<td>静态导出、路由、SSG</td>
</tr>
<tr>
<td>UI 库</td>
<td>React</td>
<td>19.x</td>
<td>视图层</td>
</tr>
<tr>
<td>语言</td>
<td>TypeScript</td>
<td>5.x</td>
<td>类型安全</td>
</tr>
<tr>
<td>样式</td>
<td>Tailwind CSS</td>
<td>4.x</td>
<td>原子化 CSS</td>
</tr>
<tr>
<td>组件库</td>
<td>shadcn/ui (Radix UI)</td>
<td>最新</td>
<td>无障碍 UI 原语</td>
</tr>
<tr>
<td>状态管理</td>
<td>Zustand</td>
<td>5.x</td>
<td>轻量响应式 Store</td>
</tr>
<tr>
<td>数据层</td>
<td>TanStack React Query</td>
<td>5.x</td>
<td>服务端状态管理</td>
</tr>
<tr>
<td>国际化</td>
<td>next-intl</td>
<td>4.x</td>
<td>多语言路由与翻译</td>
</tr>
<tr>
<td>HTTP 客户端</td>
<td>Axios</td>
<td>1.x</td>
<td>REST 通信</td>
</tr>
<tr>
<td>代码高亮</td>
<td>Shiki</td>
<td>4.x</td>
<td>双主题语法着色</td>
</tr>
<tr>
<td>Markdown</td>
<td>marked</td>
<td>17.x</td>
<td>内容解析</td>
</tr>
<tr>
<td>数学公式</td>
<td>KaTeX</td>
<td>0.16.x</td>
<td>LaTeX 渲染</td>
</tr>
<tr>
<td>流程图</td>
<td>Mermaid</td>
<td>11.x</td>
<td>图表渲染</td>
</tr>
<tr>
<td>富文本编辑</td>
<td>Tiptap</td>
<td>3.x</td>
<td>评论编辑器</td>
</tr>
<tr>
<td>实时通信</td>
<td>SSE (fetch-event-source)</td>
<td>2.x</td>
<td>服务端推送</td>
</tr>
</tbody>
</table>`},title:"基于 Next.js 的 Headless CMS 前端架构：技术解析与二次开发导引"}}],["/posts/go-wind-cms-nl2sql-four-guards.html",{loader:()=>i(()=>import("./go-wind-cms-nl2sql-four-guards.html-DOVijYjR.js"),[]),meta:{_blog:{title:"GoWind CMS 拆解：给 NL2SQL 上四把锁——智能问数的安全边界",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","AI","LLM","数据安全"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>让大模型把自然语言翻译成 SQL 直接在公司数据库上执行，怎么才能不把生产库拖垮、不把别人的数据泄露出去？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">GoWind CMS</a> 的智能问数（NL2SQL）功能允许用户输入"最近 30 天哪个分类的文章评论最多"，系统让模型生成 SQL、在库上执行、再把结果喂回模型生成自然语言结论。这件事的工程本质不是"让模型写对 SQL"——<strong>是假设模型一定会写错、会幻觉、会被提示注入的前提下，如何在执行路径上保证它只能造成无害的错误</strong>。</p>`},title:"GoWind CMS 拆解：给 NL2SQL 上四把锁——智能问数的安全边界"}}],["/posts/go-wind-cms-nuxt-tech-guide.html",{loader:()=>i(()=>import("./go-wind-cms-nuxt-tech-guide.html-D_8llRig.js"),[]),meta:{_blog:{title:"基于 Nuxt 4 的现代 Headless CMS 前端：架构深度解析与二次开发指南",author:"",date:"2026-06-03T00:00:00.000Z",category:["GoWind风行"],tag:["Vue","Nuxt","CMS","GoWind"],excerpt:`
<blockquote>
<p>本文面向希望基于此项目进行二次开发的前端工程师，系统性地讲解项目的技术选型、架构设计与模块划分，并提供扩展开发的实操指引。</p>
</blockquote>
<hr>
<h2>一、项目概览</h2>
<p>本项目是一个<strong>面向内容管理的现代前端应用</strong>，使用 Nuxt 4（Vue 3）构建，支持 SSR/SSG 双模式部署，提供文章、分类、标签、评论等完整的内容管理功能，并内置多语言（中英文）和暗色模式支持。</p>
<h3>核心特性一览</h3>
<table>
<thead>
<tr>
<th>特性</th>
<th>技术方案</th>
</tr>
</thead>
<tbody>
<tr>
<td>框架</td>
<td>Nuxt 4（Vue 3.5+）</td>
</tr>
<tr>
<td>样式</td>
<td>Tailwind CSS v4 + CSS 变量主题系统</td>
</tr>
<tr>
<td>UI 组件库</td>
<td>shadcn-vue（基于 Reka UI）</td>
</tr>
<tr>
<td>状态管理</td>
<td>Pinia + 持久化插件</td>
</tr>
<tr>
<td>数据请求</td>
<td>Axios + TanStack Vue Query</td>
</tr>
<tr>
<td>国际化</td>
<td>@nuxtjs/i18n（prefix 路由策略）</td>
</tr>
<tr>
<td>内容渲染</td>
<td>marked + Shiki + KaTeX + Mermaid</td>
</tr>
<tr>
<td>富文本编辑</td>
<td>Tiptap</td>
</tr>
<tr>
<td>API 协议</td>
<td>Protobuf 生成 TypeScript HTTP 客户端</td>
</tr>
<tr>
<td>部署</td>
<td>SSG 静态生成 + SPA fallback</td>
</tr>
</tbody>
</table>`},title:"基于 Nuxt 4 的现代 Headless CMS 前端：架构深度解析与二次开发指南"}}],["/posts/go-wind-cms-social-distribution-engine.html",{loader:()=>i(()=>import("./go-wind-cms-social-distribution-engine.html-CrGtfo74.js"),[]),meta:{_blog:{title:"GoWind CMS 拆解：社交分发引擎——10 平台适配器、状态闸门与自愈定时任务",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","分布式任务","CMS"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>"把这篇文章一键发到 10 个平台、明早 9 点准时发、失败自动重试、发布后还能回拉互动数据"——这句话拆成工程问题，一共有几层？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">GoWind CMS</a> 的社交分发功能连接 10 个平台（Bluesky / Mastodon / DEV.to / Telegram / WordPress / 微信公众号 / Nostr / 微博 / LinkedIn / 博客园），支持内容一键分发、定时发布、改期重排、失败重试、互动统计回拉，并把这些能力以 MCP 工具的形式暴露给 AI 代理。这篇文章拆它的五层：<strong>平台适配器、凭据生命周期、发布状态机、定时自愈、统计回拉</strong>——每一层都有可以直接迁移的工程决策。</p>`},title:"GoWind CMS 拆解：社交分发引擎——10 平台适配器、状态闸门与自愈定时任务"}}],["/posts/go-wind-cms-taro-tech-guide.html",{loader:()=>i(()=>import("./go-wind-cms-taro-tech-guide.html-BaaWCoQi.js"),[]),meta:{_blog:{title:"基于 Taro 的 Headless CMS 多端前端架构：技术解析与二次开发导引",author:"",date:"2026-06-04T00:00:00.000Z",category:["GoWind风行"],tag:["Taro","React","CMS","GoWind"],excerpt:`
<blockquote>
<p>本文面向希望基于此项目进行二次开发的前端工程师，从技术栈选型、核心架构设计、关键模块实现到二开实践路径，提供一份完整的技术地图。</p>
</blockquote>
<hr>
<h2>一、技术栈总览</h2>
<p>本项目是一个 <strong>Taro 多端</strong> CMS 内容展示前端，一套代码同时编译为 H5、微信/支付宝/抖音小程序等多端应用：</p>
<table>
<thead>
<tr>
<th>层面</th>
<th>技术</th>
<th>版本</th>
<th>用途</th>
</tr>
</thead>
<tbody>
<tr>
<td>框架</td>
<td>Taro</td>
<td>4.1.x</td>
<td>多端统一框架</td>
</tr>
<tr>
<td>UI 库</td>
<td>React</td>
<td>18.x</td>
<td>视图层</td>
</tr>
<tr>
<td>语言</td>
<td>TypeScript</td>
<td>5.x</td>
<td>类型安全</td>
</tr>
<tr>
<td>构建</td>
<td>Vite</td>
<td>4.x</td>
<td>编译打包</td>
</tr>
<tr>
<td>样式</td>
<td>Tailwind CSS</td>
<td>3.x</td>
<td>原子化 CSS</td>
</tr>
<tr>
<td>小程序适配</td>
<td>weapp-tailwindcss</td>
<td>4.x</td>
<td>小程序端 Tailwind rem→rpx 转换</td>
</tr>
<tr>
<td>状态管理</td>
<td>Zustand</td>
<td>5.x</td>
<td>轻量响应式 Store（Context 模式）</td>
</tr>
<tr>
<td>数据层</td>
<td>TanStack React Query</td>
<td>5.x</td>
<td>服务端状态管理</td>
</tr>
<tr>
<td>国际化</td>
<td>i18next + react-i18next</td>
<td>25.x / 16.x</td>
<td>多语言翻译</td>
</tr>
<tr>
<td>HTTP 客户端</td>
<td>Axios</td>
<td>1.x</td>
<td>REST 通信</td>
</tr>
<tr>
<td>代码高亮</td>
<td>highlight.js</td>
<td>11.x</td>
<td>语法着色</td>
</tr>
<tr>
<td>Markdown</td>
<td>marked</td>
<td>17.x</td>
<td>内容解析</td>
</tr>
<tr>
<td>数学公式</td>
<td>KaTeX</td>
<td>0.16.x</td>
<td>LaTeX 渲染</td>
</tr>
<tr>
<td>流程图</td>
<td>Mermaid</td>
<td>11.x</td>
<td>图表渲染</td>
</tr>
<tr>
<td>实时通信</td>
<td>SSE (fetch-event-source)</td>
<td>2.x</td>
<td>服务端推送</td>
</tr>
</tbody>
</table>`},title:"基于 Taro 的 Headless CMS 多端前端架构：技术解析与二次开发导引"}}],["/posts/go-wind-cms-yjs-collab-backend.html",{loader:()=>i(()=>import("./go-wind-cms-yjs-collab-backend.html-eBRJNSMs.js"),[]),meta:{_blog:{title:"GoWind CMS 拆解：在 Go 里给 TipTap 搭一套 Yjs 协同后端",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","CRDT","协同编辑","CMS"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>两个人同时编辑同一篇富文本，从浏览器到 Go 服务端再到数据库，中间要处理哪些协议、锁、持久化与竞态？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">GoWind CMS</a> 的帖子/页面编辑页支持多人同编：在线光标、无冲突合并、断线恢复、离线内容回流。后端没有用任何现成的协同 SaaS，而是在 Go 侧搭了一套 Yjs 兼容的 WebSocket 服务（<code>COLLAB_ADDR</code>，默认 <code>:6602</code>），与 TipTap 的 Collaboration 扩展直连。这个功能的实现从 v1 到 v2.5 演进了三版（编辑锁 → 持久化自愈 → 服务端权威种子化），每一版解决一类问题，踩过的坑都留在了代码注释里——这篇按演进顺序拆。</p>`},title:"GoWind CMS 拆解：在 Go 里给 TipTap 搭一套 Yjs 协同后端"}}],["/posts/go-wind-erp-consistency-levels.html",{loader:()=>i(()=>import("./go-wind-erp-consistency-levels.html-C1U9GrhU.js"),[]),meta:{_blog:{title:"GoWind ERP 拆解：一个 ERP 里的三种一致性等级",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","ERP","数据一致性"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>"审批完的采购单自动生成应付、收货自动回写库存、低库存自动起草补货单"——同一句"数据全打通"，为什么有的链路用硬事务、有的用软失败、有的用事务后 defer？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-erp" target="_blank" rel="noopener noreferrer">GoWind ERP</a>（采购/库存/财务三大模块）的 README 把"单据驱动单据"当核心卖点，而代码里真正值得学的是它对<strong>一致性等级的分层</strong>：不同链路按"失败的代价"选了三种不同的机制——硬同事务、软失败人工补、单体 SAGA 缝。这篇文章把这三种机制各拆到底，再补一刀贯穿全库的并发武器：SQL 条件更新。</p>`},title:"GoWind ERP 拆解：一个 ERP 里的三种一致性等级"}}],["/posts/go-wind-iam-build-or_thirdparty-decision.html",{loader:()=>i(()=>import("./go-wind-iam-build-or_thirdparty-decision.html-BM9TXDHC.js"),[]),meta:{_blog:{title:"选择第三方IAM还是自建权限体系？中小型后台系统权限架构决策指南",author:"",date:"2026-05-31T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","IAM","JWT","Casbin","OPA","GoWind"],excerpt:`
<p>搭建后台管理系统、业务中台时，几乎所有开发团队都会遇到同一个问题：<strong>究竟是直接接入成熟的第三方IAM（身份与访问管理）系统，还是结合业务场景自建认证授权体系？</strong></p>
<p>尤其对于基于 Go 语言开发的中小型后台（例如 go-wind-admin 这类通用管理框架），这道选择题没有绝对标准答案，核心取决于<strong>系统规模、业务场景、维护成本、长期演进规划</strong>。本文结合实战经验，拆解两种方案的优劣、适用场景、落地风险，同时提供从单体到微服务的平滑演进方案，帮助团队做出最合适的技术决策。</p>
<h2>一、认清两种方案的本质区别</h2>`},title:"选择第三方IAM还是自建权限体系？中小型后台系统权限架构决策指南"}}],["/posts/go-wind-kanban-lexorank-realtime.html",{loader:()=>i(()=>import("./go-wind-kanban-lexorank-realtime.html-_tPkHj9L.js"),[]),meta:{_blog:{title:"GoWind Kanban 拆解：看板拖拽背后——LexoRank、乐观锁与尽力而为广播",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","实时协作","算法"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>把一张卡片从"进行中"拖到"已完成"的第三行，要让所有在线用户的屏幕一致地变化——排序、并发、同步这三件事分别怎么解？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-kanban" target="_blank" rel="noopener noreferrer">GoWind Kanban</a>（风行看板）的实时协作没有用 CRDT、没有用协同算法库，是"服务端权威排序 + 乐观锁 + 尽力而为广播 + 差量兜底"的四层务实组合。这篇拆这四层，外加一条 WebSocket 准入的安全演进线。</p>`},title:"GoWind Kanban 拆解：看板拖拽背后——LexoRank、乐观锁与尽力而为广播"}}],["/posts/go-wind-ledger-balance-consistency.html",{loader:()=>i(()=>import("./go-wind-ledger-balance-consistency.html-PMPyXmzh.js"),[]),meta:{_blog:{title:"GoWind Ledger 拆解：单式记账的余额一致性——confirm、补偿，以及没进事务的那些缝隙",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","记账","数据一致性"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>记账 App 的"账户余额"到底是算出来的还是存出来的？选了"存出来的"，删除、修改、确认这些操作要付出什么代价？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-ledger" target="_blank" rel="noopener noreferrer">GoWind Ledger</a>（风行记账，单式记账：支出/收入/转账/调整四类流水）的核心设计是<strong>冗余余额列</strong>——账户表上存 <code>balance</code>，流水增删改时手工维护它。这篇拆它的余额维护机制（confirm 确认流、RefundBalance 补偿、copy-then-delete 更新），也如实拆它的三条裂缝——<strong>一条没能回滚的调整流水、两段没进事务的余额操作</strong>。设计取舍与已知缺陷放在一起讲，比只讲光鲜面有用得多。</p>`},title:"GoWind Ledger 拆解：单式记账的余额一致性——confirm、补偿，以及没进事务的那些缝隙"}}],["/posts/go-wind-oa-workflow-engine.html",{loader:()=>i(()=>import("./go-wind-oa-workflow-engine.html-3Rl5UdvS.js"),[]),meta:{_blog:{title:"GoWind OA 拆解：用 3000 行 Go 写一个够用的审批工作流引擎",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","工作流","审批流"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>不引入 Camunda/Flowable，自己写一个支持条件分支、并行会签、子流程、回退环的审批引擎，核心复杂度到底在哪几处？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-oa" target="_blank" rel="noopener noreferrer">GoWind OA</a>（协同办公：审批流转、请假报销、考勤）内置了一个自研的轻量级工作流引擎——约 3000 行核心 Go 代码（不含生成物），7 张表，28 个图模型单测 + service 层集成测试，配一篇 358 行的设计文档。它不追求 BPMN 兼容，只追求"把审批这件事的边界情况全部想清楚"。这篇按引擎的六个机制拆：图契约、编译期校验、运行期推进、会签或签、寻人与委托、业务挂钩——每一段都有真实的取舍可讲。</p>`},title:"GoWind OA 拆解：用 3000 行 Go 写一个够用的审批工作流引擎"}}],["/posts/go-wind-ops-architecture-deep-dive.html",{loader:()=>i(()=>import("./go-wind-ops-architecture-deep-dive.html-C02eVU5R.js"),[]),meta:{_blog:{title:"GoWind Ops 深度拆解：纯出站 Agent + MQTT 信令，把「管机器、跑项目、发脚本、构建分发」做扎实",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","MQTT","运维平台"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>当你点下「分发到 20 台机器」，从浏览器到目标机磁盘落定，中间经过了哪些服务、哪些协议、哪些状态机与哪些防呆设计？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-ops" target="_blank" rel="noopener noreferrer">GoWind Ops</a> 是一个多节点运维平台，Go 后端（Kratos 微服务 + Ent + PostgreSQL/Redis/MinIO）+ React 19 管理台。它不做大而全的 K8s 替代品，聚焦四件事：<strong>管机器、跑项目、发脚本、构建分发</strong>，组织权限、审计日志、数据字典作为系统底座内置。</p>`},title:"GoWind Ops 深度拆解：纯出站 Agent + MQTT 信令，把「管机器、跑项目、发脚本、构建分发」做扎实"}}],["/posts/go-wind-ops-multi-replica-coordination.html",{loader:()=>i(()=>import("./go-wind-ops-multi-replica-coordination.html-Bxad-MSp.js"),[]),meta:{_blog:{title:"GoWind Ops 拆解：不引入分布式锁的多副本协调",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","分布式","运维平台"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>core 服务水平扩到多副本之后，定时任务、指令回执、构建触发、告警外呼，靠什么保证不重复执行——而又不引入 Redlock、etcd concurrency、ZooKeeper 分布式锁里的任何一种？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-ops" target="_blank" rel="noopener noreferrer">GoWind Ops</a> 的 core 是唯一连库的领域服务，天然想水平扩：多副本分摊 MQTT 信令、多副本跑定时调度。但多副本立刻带来一组经典问题——同一分钟的双 cron 触发、同一指令的重复回执、同一配置的并发构建。常见的答案是上一把分布式锁，GoWind Ops 的选择是把协调拆散进它已经在用的三个层：<strong>MQTT broker 的投递语义、数据库条件更新、Redis 原子操作</strong>。全仓找不到 redsync / etcd concurrency / 抢占式锁服务里的任何一种"锁服务"。</p>`},title:"GoWind Ops 拆解：不引入分布式锁的多副本协调"}}],["/posts/go-wind-shop-architecture-deep-dive.html",{loader:()=>i(()=>import("./go-wind-shop-architecture-deep-dive.html-CV-eVLRY.js"),[]),meta:{_blog:{title:"GoWind Shop 架构剖析:一个 REST 请求穿越三服务 BFF 的七环链路",author:"",date:"2026-08-11T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","Vue","Shop"],excerpt:`
<h2>这篇在讲什么</h2>
<p>大多数微服务架构的文章停在"我们用了 BFF 模式"这种结论性描述,不讲 BFF 具体怎么装配、一个请求实际穿过了哪些代码、依赖图是怎么织起来的。这篇文章反过来:用一条真实的 <code>POST /admin/v1/mall/brands</code> 请求,把它从 HTTP 入站到 Ent 落库的每一个环节用代码钉死,再把支撑这条链路的 Wire 依赖注入和运行时配置逐行拆解。</p>
<p>文中所有代码和配置都来自一个真实仓库 go-wind-shop(GitHub: <a href="https://github.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/go-wind-shop</a>, Gitee: <a href="https://gitee.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://gitee.com/tx7do/go-wind-shop</a>),标注了文件路径可核对。读完你会清楚三件事:这条链路怎么走、它由哪些配置决定、依赖图怎么从代码生成。</p>`},title:"GoWind Shop 架构剖析:一个 REST 请求穿越三服务 BFF 的七环链路"}}],["/posts/go-wind-shop-internationalization-and-going-global.html",{loader:()=>i(()=>import("./go-wind-shop-internationalization-and-going-global.html-ClDiPZaM.js"),[]),meta:{_blog:{title:"GoWind Shop 出海实战:多语言商品内容怎么存、怎么录、怎么按 locale 取",author:"",date:"2026-08-11T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","Vue","Shop"],excerpt:`
<h2>一个常见误解</h2>
<p>很多团队对"国际化"的理解停留在前端字符串翻译——<code>zh.json</code>/<code>en.json</code> 切换一下 <code>t('hello')</code> 就完事。但对电商而言,真正的难点不在 UI 文案,而在<strong>商品内容的多语言化</strong>。</p>
<p>一件商品的中文名、英文名、商品描述、类目路径——这些是入库的业务数据,不是 UI 文案。你不能把它们塞进 <code>zh.json</code>,因为:</p>
<ul>
<li>不同语言的商品描述要分别审核、分别上下架。</li>
<li>同一件商品的"主数据"(SKU、价格、库存、类目归属)是语言无关的,只有"展示文案"按语言分叉。</li>
<li>后台编辑时,运营要在同一界面同时维护所有语言版本,而不是切来切去。</li>
<li>店铺前台要能按 URL 里的 locale 一次性取到对应语言版本,而不是取全量再前端过滤。</li>
</ul>`},title:"GoWind Shop 出海实战:多语言商品内容怎么存、怎么录、怎么按 locale 取"}}],["/posts/go-wind-shop-order-timeout.html",{loader:()=>i(()=>import("./go-wind-shop-order-timeout.html-Bn_uc_U2.js"),[]),meta:{_blog:{title:"GoWind Shop 拆解：订单超时关单——一个事务里的四联动",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","电商","订单系统"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>用户下单后 30 分钟没付款，系统要收回什么、按什么顺序收、怎么防重防并发？"超时关单"这个电商标配功能，值得写 450 行吗？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">GoWind Shop</a> 的未支付订单 30 分钟自动过期（<code>ExpireOrderByTimeout</code>，约 150 行核心逻辑），是全仓库把"事务边界设计"体现得最完整的一条链路：<strong>释放库存、状态推进、孤儿支付清理、优惠券返还四件事在一个数据库事务里完成</strong>，外层有延迟任务的投递去重与幂等闸门。拆它之前先看它的对照面——下单事务，因为超时收回的每一样东西，都是下单时锁定的。</p>`},title:"GoWind Shop 拆解：订单超时关单——一个事务里的四联动"}}],["/posts/go-wind-shop-overview-and-positioning.html",{loader:()=>i(()=>import("./go-wind-shop-overview-and-positioning.html-ayembT8Z.js"),[]),meta:{_blog:{title:"GoWind Shop:一个 proto 文件如何生成后端、前端、文档、校验六路代码",author:"",date:"2026-08-11T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","Vue","Shop"],excerpt:`
<h2>为什么再聊"契约驱动"</h2>
<p>"契约驱动(contract-driven)"这个词被用滥了。大多数项目里它的实际含义是:后端写完接口,用 Swagger 注解生成一份文档,前端照着文档手写 fetch。文档和实现谁是事实源?没人说得清。接口改了文档没改,文档改了实现没改,前后端各自演进直到某天线上 404。</p>
<p>这篇文章不讲概念,讲一个<strong>可运行的工程闭环</strong>:以 <code>.proto</code> 为唯一事实源,一次 <code>buf generate</code> 同时产出六路产物——后端 gRPC 桩、后端 HTTP 桩、错误码 helper、请求校验器、PII 脱敏器、OpenAPI 文档,以及给前端的 TypeScript 客户端。文中所有配置和代码都来自一个真实仓库 go-wind-shop(GitHub: <a href="https://github.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/go-wind-shop</a>, Gitee: <a href="https://gitee.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://gitee.com/tx7do/go-wind-shop</a>),你可以逐行核对。</p>`},title:"GoWind Shop:一个 proto 文件如何生成后端、前端、文档、校验六路代码"}}],["/posts/go-wind-shop-security-and-production-readiness.html",{loader:()=>i(()=>import("./go-wind-shop-security-and-production-readiness.html-Dp43vtB9.js"),[]),meta:{_blog:{title:"GoWind Shop 安全设计:JWT 鉴权、Ent 行级隔离、防篡改审计与四个真实漏洞修复",author:"",date:"2026-08-11T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","Vue","Shop"],excerpt:`
<h2>为什么写这篇</h2>
<p>安全这件事,讲概念的多(纵深防御、最小权限、fail-closed),讲工程落地的少。一篇好的安全文章应该能回答:<strong>这些概念具体落在哪几行代码里、它们怎么串成一条链、出过什么洞、怎么修的。</strong></p>
<p>这篇文章拆解一个真实仓库 go-wind-shop(GitHub: <a href="https://github.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/go-wind-shop</a>, Gitee: <a href="https://gitee.com/tx7do/go-wind-shop" target="_blank" rel="noopener noreferrer">https://gitee.com/tx7do/go-wind-shop</a>)的安全实现。它不讲"应该做什么",讲"实际做了什么、实际踩过什么坑、实际怎么修的"。文中会引用四个真实的 git commit,每个都是一个被修的安全洞——从漏洞存在、到发现、到修复代码,完整还原。</p>`},title:"GoWind Shop 安全设计:JWT 鉴权、Ent 行级隔离、防篡改审计与四个真实漏洞修复"}}],["/posts/go-wind-shortplay-architecture-deep-dive.html",{loader:()=>i(()=>import("./go-wind-shortplay-architecture-deep-dive.html-86OQw5lU.js"),[]),meta:{_blog:{title:"GoWind ShortPlay 深度拆解：三服务 BFF + Core，一条请求的完整工程链路",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","Flutter","短视频"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一次上下滑、一次发布、一次审核驳回，在 GoWind ShortPlay 里分别走过了哪些代码、哪些状态与哪些取舍？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-shortplay" target="_blank" rel="noopener noreferrer">GoWind ShortPlay</a> 是一个短视频社区的完整实现：上下滑沉浸式 Feed、拍摄发布、互动社区、后台审核闭环。后端 Go 1.26 + Kratos v2.9 + Ent v0.14 + PostgreSQL/Redis/MinIO，前端 React 19 管理台 + Flutter 跨平台 App，与 <a href="https://github.com/tx7do/go-wind-cms" target="_blank" rel="noopener noreferrer">go-wind-cms</a> 同构——同一套基座，换一个业务域长出一个新产品。</p>`},title:"GoWind ShortPlay 深度拆解：三服务 BFF + Core，一条请求的完整工程链路"}}],["/posts/go-wind-shortplay-ent-multi-tenant-isolation.html",{loader:()=>i(()=>import("./go-wind-shortplay-ent-multi-tenant-isolation.html-CMUm5M3l.js"),[]),meta:{_blog:{title:"GoWind ShortPlay 拆解：Ent privacy/viewer 多租户隔离——从中间件到 SQL 的零信任链",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","Ent","多租户"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一条 SQL 都没手写的情况下，租户 A 的用户为什么绝不可能查到租户 B 的视频——连"漏一次"的机会都没有？</strong></p>
</blockquote>
<p>多租户隔离最常见的死法是<strong>应用层 WHERE</strong>：每个仓储方法都记得写 <code>tenant_id = ?</code>，直到某天一个新同事写的接口忘了——于是租户 B 拉到了租户 A 的数据，没有任何报错。<a href="https://github.com/tx7do/go-wind-shortplay" target="_blank" rel="noopener noreferrer">GoWind ShortPlay</a> 不信任任何人的记性：它把隔离下沉到 ORM 层（Ent 的 privacy 机制），<strong>查询根本到不了 SQL 就被拦下补条件或直接拒绝</strong>。全仓 51 张业务表的 schema 里没有一行手写的租户过滤代码，隔离却无处不在。</p>`},title:"GoWind ShortPlay 拆解：Ent privacy/viewer 多租户隔离——从中间件到 SQL 的零信任链"}}],["/posts/go-wind-shortplay-flutter-immersive-feed.html",{loader:()=>i(()=>import("./go-wind-shortplay-flutter-immersive-feed.html-D3VHC6nk.js"),[]),meta:{_blog:{title:"GoWind ShortPlay 拆解：Flutter 沉浸式 Feed 的播放器工程——生命周期、手势状态机与游客降级",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Flutter","GoWind","短视频","移动端"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一个"上下滑短视频"App，把抖音的手感做对，Flutter 端到底要处理哪些细节？</strong></p>
</blockquote>
<p>上下滑短视频 App 的代码量错觉很强：看起来就是"一个 PageView + 一个播放器"，但 <a href="https://github.com/tx7do/go-wind-shortplay" target="_blank" rel="noopener noreferrer">GoWind ShortPlay</a> 的 Flutter 端（BLoC + media_kit，一套代码 iOS/Android/Windows 同源）真正下功夫的全是看不见的地方——<strong>页面切换时播放器状态的精确交接、单击秒响应与双击点赞并存的判定、游客刷得动但互动要登录的静默降级</strong>。这篇拆 Flutter 端三个最值得学的板块：播放器生命周期、手势状态机、401 游客降级。</p>`},title:"GoWind ShortPlay 拆解：Flutter 沉浸式 Feed 的播放器工程——生命周期、手势状态机与游客降级"}}],["/posts/go-wind-shortplay-rule-based-recommendation-loop.html",{loader:()=>i(()=>import("./go-wind-shortplay-rule-based-recommendation-loop.html-OC8TJAPx.js"),[]),meta:{_blog:{title:"GoWind ShortPlay 拆解：不用模型的推荐闭环——埋点回流、三路召回与已看去重",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind","Flutter","推荐系统"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>没有算法团队、没有特征平台、没有模型服务，一个短视频 Feed 的"推荐"要怎么做才不是自欺欺人？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-shortplay" target="_blank" rel="noopener noreferrer">GoWind ShortPlay</a> 的 Feed 有一套完整的推荐链路：Flutter 播放器实时上报观看行为 → core 防刷入库 → 三路召回 + 热度加权排序 → 已看去重 → 召回理由随内容回传。全程一个模型都没有，但<strong>闭环的每一环都是真的</strong>——埋的是真数据、算的是真信号、去重是真去重。</p>`},title:"GoWind ShortPlay 拆解：不用模型的推荐闭环——埋点回流、三路召回与已看去重"}}],["/posts/go-wind-toolkit-backend-full-code-generation.html",{loader:()=>i(()=>import("./go-wind-toolkit-backend-full-code-generation.html-CQMKrRVg.js"),[]),meta:{_blog:{title:"GoWind Toolkit Go后端代码生成 完整全流程实战",author:"",date:"2026-06-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","GoWind Toolkit","代码生成","GoWind"],excerpt:`
<h2>前言</h2>
<p>做Go微服务开发，大部分开发者每天都在做无用功：新建项目、搭建目录、手写实体类、反复写DAO、Service、Proto文件，还有枯燥的CRUD基础代码。不仅浪费时间，团队每个人编码风格不一样，还会导致项目结构混乱、维护成本飙升。</p>
<p><strong>go-wind-toolkit</strong> 完美解决CRUD重复开发的痛点！一站式搞定项目创建、数据库导入、业务分包、全自动代码生成，直接产出可直接运行的 gRPC + BFF 完整后端项目。这篇图文手把手带你从零上手，一篇吃透后端全部生成功能。</p>
<h2>一、整体流程速览</h2>
<p>后端代码生成全程只需要4步，单体、微服务项目全部通用，新手也能轻松上手：</p>`},title:"GoWind Toolkit Go后端代码生成 完整全流程实战"}}],["/posts/go-wind-toolkit-frontend-full-code-generation.html",{loader:()=>i(()=>import("./go-wind-toolkit-frontend-full-code-generation.html-BD-H3qji.js"),[]),meta:{_blog:{title:"GoWind Toolkit 前端代码生成｜Vue3(ElementPlus/Vben)、React(AntDesign)全自动一键生成教程",author:"",date:"2026-06-01T00:00:00.000Z",category:["GoWind风行"],tag:["Vue3","React","Element Plus","Ant Design","GoWind Toolkit","代码生成","GoWind"],excerpt:`
<h2>前言</h2>
<p>开发中后台管理系统，最耗费精力的不是业务开发，而是重复机械的CRUD工作：编写数据列表、封装接口、写搜索条件、制作新增编辑弹窗、配置路由菜单。</p>
<p>很多代码生成工具需要人工反复微调字段、配置页面功能，依然繁琐。而 <strong>go-wind-toolkit</strong> 前端生成器主打全自动模式，依托 OpenAPI 元数据自动解析生成页面，几乎零人工介入。</p>
<p>工具内置三套主流开发模板：<strong>Vue3 ElementPlus、Vue3 Vben Admin、React AntDesign</strong>。全程无需精细化手动配置，导入文件即可一键产出完整可用的后台CRUD项目。</p>`},title:"GoWind Toolkit 前端代码生成｜Vue3(ElementPlus/Vben)、React(AntDesign)全自动一键生成教程"}}],["/posts/go-wind-uba-architecture-overview.html",{loader:()=>i(()=>import("./go-wind-uba-architecture-overview.html--EsJEmgX.js"),[]),meta:{_blog:{title:"Go Wind UBA 拆解系列 - 架构总览：三服务、数据流与契约优先",author:"",date:"2026-07-02T00:00:00.000Z",category:["GoWind风行"],tag:["UBA","大数据分析","Golang","GoWind"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>当一个用户行为从浏览器发出，到最终在 Vue 看板上变成一条留存曲线，中间经过了哪些服务、哪些代码、哪些取舍？</strong></p>
</blockquote>
<h2>一、先看全貌：四个角色的接力</h2>
<p>GoWind UBA 不是单体，也不是"微服务为了微服务"。它把用户行为分析的链路切成职责清晰的三段服务，外加一个采集 SDK：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">SDK 上报 ──HTTP──▶ Collector ──Publish──▶ Kafka ──▶ Core ──▶ OLAP</span>
<span class="line">                                                       │</span>
<span class="line">                  Vue 看板 ◀──HTTP/SSE── Admin ◀──gRPC──┘</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Go Wind UBA 拆解系列 - 架构总览：三服务、数据流与契约优先"}}],["/posts/go-wind-uba-clickhouse-doris-parity.html",{loader:()=>i(()=>import("./go-wind-uba-clickhouse-doris-parity.html-Bfq9Fi79.js"),[]),meta:{_blog:{title:"GoWind UBA 拆解：把 Doris UNIQUE KEY 翻译成 ClickHouse——读数正确性对齐实录",author:"",date:"2026-10-22T00:00:00.000Z",category:["GoWind风行"],tag:["ClickHouse","Doris","GoWind","OLAP","数据架构"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一套围绕 Doris <code>UNIQUE KEY</code> 模型建起来的行为分析系统（upsert 去重、随时可查的聚合结果），要支持 ClickHouse 二选一部署，需要翻译的到底是什么——建几张表就够了吗？</strong></p>
</blockquote>
<p><a href="https://github.com/tx7do/go-wind-uba" target="_blank" rel="noopener noreferrer">GoWind UBA</a> 的 OLAP 层原本只跑 Doris。为了适配"已有 ClickHouse 集群、不想再养一套 Doris"的部署环境，项目做了第二个引擎实现：<code>backend/sql/clickhouse/</code> 的全套 DDL、<code>internal/data/clickhouse/</code> 的 13 个同名仓储文件、<code>uba-ingest ch-etl</code> 回算工具。CHANGELOG 里那句"ClickHouse 引擎的读数正确性（事件去重 / FINAL 读 / 派生表按天回算）已与 Doris 对齐"，背后是四幕真实的语义翻译——<strong>每一段 DDL 注释都是一次数据丢失模式的防御记录</strong>。</p>`},title:"GoWind UBA 拆解：把 Doris UNIQUE KEY 翻译成 ClickHouse——读数正确性对齐实录"}}],["/posts/go-wind-uba-multi-tenant-security.html",{loader:()=>i(()=>import("./go-wind-uba-multi-tenant-security.html-Dn7as9ty.js"),[]),meta:{_blog:{title:"Go Wind UBA 拆解系列 - 多租户与安全：两套隔离机制的边界",author:"",date:"2026-07-02T00:00:00.000Z",category:["GoWind风行"],tag:["UBA","大数据分析","Golang","GoWind"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一个 SaaS 级 UBA 平台，怎么保证租户 A 绝对看不到租户 B 的数据？</strong> 答案藏在两层完全不同的机制里——而它们的边界差异，恰恰是最值得讲的部分。</p>
</blockquote>
<h2>一、两套机制，一个真相</h2>
<p>先说结论：GoWind UBA 的多租户隔离<strong>不是一套统一机制，而是两套独立的、设计哲学迥异的机制</strong>：</p>
<table>
<thead>
<tr>
<th>数据层</th>
<th>隔离机制</th>
<th>哲学</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>关系层（PostgreSQL + ent）</strong></td>
<td><code>TenantPrivacy</code> 行级隐私策略</td>
<td><strong>fail-closed</strong>（缺上下文直接拒绝）</td>
</tr>
<tr>
<td><strong>OLAP 层（ClickHouse/Doris）</strong></td>
<td>手工拼 <code>tenant_id = ?</code> 条件</td>
<td><strong>opt-in</strong>（请求带 appId 才裁剪）</td>
</tr>
</tbody>
</table>`},title:"Go Wind UBA 拆解系列 - 多租户与安全：两套隔离机制的边界"}}],["/posts/go-wind-uba-olap-sql-deep-dive.html",{loader:()=>i(()=>import("./go-wind-uba-olap-sql-deep-dive.html-BCOIWQQU.js"),[]),meta:{_blog:{title:"Go Wind UBA 拆解系列 - OLAP 与 SQL 硬核：25 个分析模型怎么落地",author:"",date:"2026-07-02T00:00:00.000Z",category:["GoWind风行"],tag:["UBA","大数据分析","Golang","GoWind"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>25 个分析模型（漏斗 / 留存 / LTV / 归因 / 路径……）在 ClickHouse 和 Doris 上，到底是用什么 SQL 写出来的？双引擎又是怎么做到"一份业务模型，两份实现"的？</strong></p>
</blockquote>
<h2>一、为什么是双引擎？</h2>
<p>先说结论：GoWind UBA 支持 <strong>ClickHouse 和 Apache Doris 二选一</strong>，部署时按需选其一，运行时通过一个开关切换。这是一个很有意思的工程选择——为什么不让用户自己写 SQL，而要维护两份？</p>`},title:"Go Wind UBA 拆解系列 - OLAP 与 SQL 硬核：25 个分析模型怎么落地"}}],["/posts/go-wind-uba-sdk-and-collector.html",{loader:()=>i(()=>import("./go-wind-uba-sdk-and-collector.html-5ZqLLYS6.js"),[]),meta:{_blog:{title:"Go Wind UBA 拆解系列 - SDK 与采集层：从浏览器到 Kafka",author:"",date:"2026-07-02T00:00:00.000Z",category:["GoWind风行"],tag:["UBA","大数据分析","Golang","GoWind"],excerpt:`
<blockquote>
<p>本文回答一个问题：<strong>一个埋点事件，从用户在浏览器里点了一下，到最终被 Kafka 接住，中间的 SDK 和 Collector 做了多少你看不见的工程？</strong> 答案是：比你想象的多得多。</p>
</blockquote>
<h2>一、为什么"采集"这件事很难</h2>
<p>很多人以为埋点 SDK 就是 <code>fetch('/report', { body: event })</code>。这在 demo 里成立，在生产里不成立。真实的采集层要回答这些问题：</p>
<ul>
<li><strong>页面随时可能关闭</strong>——用户点完就关 tab，残留事件怎么办？</li>
<li><strong>网络随时可能抖动</strong>——一次失败就丢数据？还是重试？重试几次？退避多久？</li>
<li><strong>服务端可能限流</strong>——429 要重试，但 401（鉴权失败）不该重试，怎么区分？</li>
<li><strong>批量还是单条</strong>——单条上报开销大，批量要攒多久、攒多少？</li>
<li><strong>客户端环境千差万别</strong>——浏览器的 sendBeacon、Unity WebGL 不能用 HttpClient、小程序没有 localStorage……</li>
<li><strong>凭证放哪</strong>——放 Header 还是 body？前者标准但不支持 sendBeacon。</li>
</ul>`},title:"Go Wind UBA 拆解系列 - SDK 与采集层：从浏览器到 Kafka"}}],["/posts/go-wind-uba-user-behavior-full-link-analysis.html",{loader:()=>i(()=>import("./go-wind-uba-user-behavior-full-link-analysis.html-tDUXr8y0.js"),[]),meta:{_blog:{title:"从埋点到决策：Go Wind UBA 帮你一站式搞定用户行为全链路分析",author:"",date:"2026-04-09T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","UBA"],excerpt:`
<p>在数字化时代，用户行为数据早已成为企业突破增长瓶颈、优化产品体验、防范业务风险的核心资产。无论是互联网产品的迭代优化、营销活动的精准落地，还是企业内部的安全管控，都离不开对用户行为的深度洞察。然而，传统用户行为分析流程中，埋点繁琐、数据割裂、分析滞后、决策脱节等痛点，往往让企业陷入“数据多而无用”的困境——花费大量精力采集数据，最终却无法将数据转化为可落地的业务决策。</p>
<p>Go Wind UBA（User Behavior Analytics，用户行为分析）的出现，正是为了破解这一行业痛点。作为基于Go语言研发的一站式用户行为全链路分析工具，它以“埋点轻量化、数据一体化、分析智能化、决策场景化”为核心，打通从数据采集（埋点）、数据处理、智能分析到决策落地的全流程，让企业无需搭建复杂的技术架构，就能快速挖掘用户行为背后的价值，实现“数据驱动业务”的核心目标。</p>`},title:"从埋点到决策：Go Wind UBA 帮你一站式搞定用户行为全链路分析"}}],["/posts/go_algorithm_search.html",{loader:()=>i(()=>import("./go_algorithm_search.html-qi4th0Y-.js"),[]),meta:{_blog:{title:"搜索算法实现 - Golang版",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","算法"],excerpt:`
<hr>
<h2>算法列表</h2>
<ul>
<li>[X] <a href="#SequentialSearch">顺序查找（Sequential Search）</a></li>
<li>[X] <a href="#BinarySearch">二叉树查找（Binary Search）</a></li>
<li>[X] <a href="#TernarySearch">三叉树查找（Ternary Search）</a></li>
<li>[X] <a href="#InterpolationSearch">插值查找（Interpolation Search）</a></li>
<li>[X] <a href="#FibonacciSearch">斐波那契查找（Fibonacci Search）</a></li>
<li>[X] <a href="#ExponentialSearch">指数查找（Exponential Search）</a></li>
<li>[X] <a href="#TreeTableSearch">树表查找（Tree table lookup）</a></li>
<li>[X] <a href="#BlockingSearch">分块查找（Blocking Search）</a></li>
<li>[ ] <a href="#HashSearch">哈希查找（Hash Search）</a></li>
</ul>`},title:"搜索算法实现 - Golang版"}}],["/posts/go_algorithm_sort.html",{loader:()=>i(()=>import("./go_algorithm_sort.html-CFyGrkAu.js"),[]),meta:{_blog:{title:"排序算法实现 - Golang版",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","算法"],excerpt:`
<hr>
<h2>算法列表</h2>
<ul>
<li>[X] <a href="#BubbleSort">冒泡排序（Bubble Sort）</a></li>
<li>[X] <a href="#CocktailSort">鸡尾酒排序（Cocktail Sort）</a></li>
<li>[X] <a href="#SelectionSort">选择排序（Selection Sort）</a></li>
<li>[X] <a href="#InsertionSort">插入排序（Insertion Sort）</a></li>
<li>[X] <a href="#MergeSort">归并排序（Merge Sort）</a></li>
<li>[X] <a href="#InPlaceMergeSort">原地归并排序（In-place Merge Sort）</a></li>
<li>[X] <a href="#HeapSort">堆排序（Heap Sort）</a></li>
<li>[X] <a href="#QuickSort">快速排序（Quick Sort）</a></li>
<li>[X] <a href="#ShellSort">希尔排序（Shell Sort）</a></li>
<li>[X] <a href="#CountingSort">计数排序（Counting Sort）</a></li>
<li>[X] <a href="#RadixSort">基数排序（Radix Sort）</a></li>
<li>[X] <a href="#BucketSort">桶排序（Bucket Sort）</a></li>
<li>[X] <a href="#BinaryTreeSort">二叉排序树排序（Binary Tree Sort）</a></li>
<li>[X] <a href="#PigeonholeSort">鸽巢排序（Pigeonhole Sort）</a></li>
<li>[X] <a href="#GnomeSort">侏儒排序（Gnome Sort）</a></li>
<li>[ ] <a href="#BlockSort">块排序（Block Sort）</a></li>
</ul>`},title:"排序算法实现 - Golang版"}}],["/posts/go_event_loop.html",{loader:()=>i(()=>import("./go_event_loop.html-PHc_Q_ft.js"),[]),meta:{_blog:{title:"Go单协程事件调度器：游戏后端的无锁有序与响应时间掌控",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","算法"],excerpt:`
<p>在游戏后端架构设计中，<strong>单协程（单线程）事件调度器（Event Loop）</strong> 是实现 “<strong>绝对消息顺序</strong>” 与 “<strong>无锁状态管理</strong>” 的核心方案。</p>
<p>相较于多线程模型所面临的锁竞争、竞态条件、数据一致性等复杂问题，单协程调度器通过 完全串行化执行 所有核心逻辑，从根本上规避了并发安全风险——这一特性对于对状态准确性要求极高的游戏场景（如玩家血量、金币、技能释放结果、战斗胜负判定）具有决定性意义。</p>
<p>然而，串行执行也带来了严苛的约束：<strong>任何一个事件的处理延迟，都会直接放大为全服玩家的体验损耗</strong>。因此，单协程调度器的核心设计目标，是在保证逻辑有序性的前提下，<strong>极致控制响应时间，守住系统稳定性红线</strong>。</p>`},title:"Go单协程事件调度器：游戏后端的无锁有序与响应时间掌控"}}],["/posts/go_inheritance.html",{loader:()=>i(()=>import("./go_inheritance.html-ngroZZJg.js"),[]),meta:{_blog:{title:"Go 接口与代码复用：替代继承的设计哲学",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang"],excerpt:`
<h2>一、前言</h2>
<p>Go 是 Google 设计的类 C 静态类型语言，兼顾底层性能与开发效率。它并非传统意义上的面向对象（OOP）语言 —— 没有 class 关键字，也不支持传统的 “继承” 语法，但通过 <strong>接口的隐式实现</strong> 和 <strong>结构体组合（嵌入）</strong>，Go 能灵活实现 OOP 的核心特性（多态、代码复用），且设计更简洁、无继承带来的耦合问题。
与 C++ 相比，Go 的设计哲学是 “<strong>组合优于继承</strong>”：用接口实现多态，用结构体嵌入实现代码复用，既避免了继承的复杂语法，又解决了多重继承的歧义问题。本文将通过类比 C++ 的接口 / 继承逻辑，详解 Go 如何实现类似效果。</p>`},title:"Go 接口与代码复用：替代继承的设计哲学"}}],["/posts/go_kratos_beginners_guide_implementing_ent_crud_operations_in_go_kratos_with_go_crud.html",{loader:()=>i(()=>import("./go_kratos_beginners_guide_implementing_ent_crud_operations_in_go_kratos_with_go_crud.html-B0ReL1IU.js"),[]),meta:{_blog:{title:"初学者友好：Go-Kratos 集成 go-crud，Ent ORM CRUD 无需重复编码，轻松上手",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>对于刚接触 Go 微服务开发的初学者来说，直接上手 “框架 + ORM” 的组合常显复杂。而 <code>kratos-ent-example</code> 项目已为我们搭建好了 <code>Go-Kratos</code> 与 <code>Ent</code> 的基础集成框架，本文将基于该项目，聚焦如何快速接入 <code>go-curd</code> 工具简化 CRUD（增删改查）操作，全程以 step-by-step 的方式讲解，新手也能轻松跟随实操。</p>
<p>先明确核心工具关系：<code>kratos-ent-example</code>是 “基础骨架”（已整合 Kratos 与 Ent），<code>go-curd</code>是 “效率工具”（封装重复 CRUD 逻辑），我们的核心目标是 “在现有骨架上装工具，让数据操作更简单”。</p>`},title:"初学者友好：Go-Kratos 集成 go-crud，Ent ORM CRUD 无需重复编码，轻松上手"}}],["/posts/go_kratos_beginners_guide_implementing_gorm_crud_operations_in_go_kratos_with_go_crud.html",{loader:()=>i(()=>import("./go_kratos_beginners_guide_implementing_gorm_crud_operations_in_go_kratos_with_go_crud.html-0X1pT065.js"),[]),meta:{_blog:{title:"初学者友好：Go-Kratos 集成 go-crud，GORM ORM CRUD 无需重复编码，轻松上手",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>对于刚接触Go微服务开发的初学者来说，直接上手“框架+ORM”的组合常显复杂。而kratos-gorm-example项目已为我们搭建好了Go-Kratos与GORM的基础集成框架，本文将基于该项目，聚焦如何快速接入go-curd工具简化CRUD（增删改查）操作，全程以step-by-step的方式讲解，新手也能轻松跟随实操。</p>
<p>先明确核心工具关系：<code>kratos-gorm-example</code>是“基础骨架”（已整合Kratos与GORM），<code>go-curd</code>是“效率工具”（封装重复CRUD逻辑），我们的核心目标是“在现有骨架上装工具，让数据操作更简单”。</p>`},title:"初学者友好：Go-Kratos 集成 go-crud，GORM ORM CRUD 无需重复编码，轻松上手"}}],["/posts/go_proxy.html",{loader:()=>i(()=>import("./go_proxy.html-CRtkTior.js"),[]),meta:{_blog:{title:"Golang设置网络代理",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang"],excerpt:`
<h2>打开模块支持</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">go <span class="token function">env</span> <span class="token parameter variable">-w</span> <span class="token assign-left variable">GO111MODULE</span><span class="token operator">=</span>on</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Golang设置网络代理"}}],["/posts/go_rust_hybrid_architecture.html",{loader:()=>i(()=>import("./go_rust_hybrid_architecture.html-DseWuJvN.js"),__vite__mapDeps([0,1])),meta:{_blog:{title:"Go 写业务，Rust 扛底盘：一套可落地的混合架构",author:"",date:"2026-10-01T00:00:00.000Z",category:["架构设计"],tag:["Go","Rust","微服务","架构设计"],excerpt:`
<blockquote>
<p>"Go 还是 Rust"吵了十年，大多停留在语言层面互喷，产不出架构决策。工程上更有价值的问法是三段论：**两者的成本模型差在哪？边界应该画在哪？用什么方式接起来？**本文按这三段展开：先把 Go 的 GC 税与 Rust 的优势边界算成账（含"怎么量自己系统里的这笔税"），再给出"变化频率 × 延迟敏感度"的切分准则，然后把四种集成模式（进程边界 / sidecar / FFI / WASM）按集成成本排序逐一拆解——每种都给到代价清单与适用判据，最后落到一个真实样本：用 Rust 实现的中后台平台（<a href="https://gitee.com/tx7do/rushwind-admin" target="_blank" rel="noopener noreferrer">RushWind Admin</a>）与 Go 业务服务如何共享同一份 proto 契约协同。反例与不适用场景一并摆出来，量化表述尽量给可核对的量级与出处。</p>
</blockquote>`},title:"Go 写业务，Rust 扛底盘：一套可落地的混合架构"}}],["/posts/go_webrtc.html",{loader:()=>i(()=>import("./go_webrtc.html-CD973um8.js"),[]),meta:{_blog:{title:"Golang WebRTC",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","WebRTC"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://dev.to/piterweb/golang-webrtc-how-to-use-pion-remote-controller-1j00" target="_blank" rel="noopener noreferrer">Golang WebRTC. How to use Pion 🌐Remote Controller</a></li>
<li><a href="https://medium.com/securemeeting/getting-web-development-right-webrtc-tutorial-golang-and-react-2c87a6eaf3ff" target="_blank" rel="noopener noreferrer">Getting Web Development Right: WebRTC Tutorial — Golang and React.</a></li>
<li><a href="https://medium.com/@ramezemadaiesec/from-zero-to-fully-functional-video-conference-app-using-go-and-webrtc-7d073c9287da" target="_blank" rel="noopener noreferrer">From zero to fully functional video conference app using Go and webRTC</a></li>
</ul>`},title:"Golang WebRTC"}}],["/posts/go_wind_admin_access_key.html",{loader:()=>i(()=>import("./go_wind_admin_access_key.html-CSegfmQ3.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：AK/SK 机器凭证",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","Security"],excerpt:`
<blockquote>
<p>管理系统的账号是人用的。但当监控平台要拉数据、CI 流水线要触发任务、第三方系统要对接时，团队最常见的做法是把管理员账号密码写进对方的配置文件——这是一次凭据泄漏事故的预约：密码改一轮就得通知所有对接方、那个人还有正常登录和会话、泄漏了都不知道从哪漏的。风行（GoWind Admin）提供 AK/SK 机器凭证体系：给"系统对系统"的调用发独立身份，人机分治、各自设防。</p>
</blockquote>
<h2>一、模型：机器是机器，人是人</h2>
<p>AK/SK（Access Key / Secret Key）与云厂商开放 API 的凭证同构，任何对接过 AWS/阿里云 API 的开发者零学习成本：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：AK/SK 机器凭证"}}],["/posts/go_wind_admin_ai_module.html",{loader:()=>i(()=>import("./go_wind_admin_ai_module.html-DECaGOxq.js"),__vite__mapDeps([2,3])),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：AI 模块",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","AI"],excerpt:`
<blockquote>
<p>当"接个大模型"成为每个管理系统的标配需求，多数团队的选择是在业务代码里散落一堆 SDK 调用：密钥写死在配置文件、用量没人记账、租户之间无隔离、换一家模型供应商就要发版。风行（GoWind Admin）把 AI 当作<strong>平台的一等公民模块</strong>来做：提供商是数据不是配置、对话走流式推送、用量进配额体系、知识库 RAG 开箱即用，甚至自然语言问数也带四重安全护栏。本文带你完整过一遍这套 AI 能力的设计与实践。</p>
</blockquote>
<h2>一、能力全景：五个子域，一张图看懂</h2>
<table>
<thead>
<tr>
<th>能力</th>
<th>入口</th>
<th>一句话说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>模型提供商</td>
<td>管理页「AI 提供商」</td>
<td>一行 = 一个 OpenAI 兼容端点（云端 API 或本地 Ollama）；api_key 加密落库</td>
</tr>
<tr>
<td>流式对话</td>
<td>分析页 → AI 助手</td>
<td>SSE 实时推送增量 token；同步响应携带完整回复</td>
</tr>
<tr>
<td>知识库 RAG</td>
<td>管理页「知识库」</td>
<td>文档切片 → 向量化（pgvector）→ 检索注入对话上下文</td>
</tr>
<tr>
<td>智能问数</td>
<td>AI 助手 → 智能问数</td>
<td>自然语言 → 只读 SQL → 结果表格 + 自然语言结论</td>
</tr>
<tr>
<td>用量配额</td>
<td>套餐配额 <code>AI_TOKENS</code></td>
<td>每次调用记账，月度配额超限拒绝</td>
</tr>
<tr>
<td>安全与异常洞察</td>
<td>分析页卡片</td>
<td>规则预筛审计明细，LLM 只写总评</td>
</tr>
</tbody>
</table>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：AI 模块"}}],["/posts/go_wind_admin_api_management.html",{loader:()=>i(()=>import("./go_wind_admin_api_management.html-BUgiZWYK.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：API管理",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>开门见山，<a href="https://go-kratos.dev/" target="_blank" rel="noopener noreferrer">Kratos</a>内置的RPC是<a href="https://grpc.io/" target="_blank" rel="noopener noreferrer">gRPC</a>，而gRPC是基于<a href="https://protobuf.dev/" target="_blank" rel="noopener noreferrer">Protobuf</a>作为 <strong>接口规范的描述语言（IDL，Interface Description Language）</strong>。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：API管理"}}],["/posts/go_wind_admin_audit_compliance.html",{loader:()=>i(()=>import("./go_wind_admin_audit_compliance.html-CZ8xLNTE.js"),__vite__mapDeps([4,5,3])),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：六类审计日志与等保合规",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","Security"],excerpt:`
<blockquote>
<p>接到等保测评或客户安全问卷的那天，很多管理系统的团队才发现：登录有没有记录？操作可不可追溯？数据被谁改过能查到吗？口令策略符合要求吗？——这些能力补起来往往要动中间件、改 ORM、加表，动静不小。风行（GoWind Admin）把六类审计日志、身份鉴别三件套、留存归档做成了平台内置能力，开箱即得。本文盘点这套审计与合规体系。</p>
</blockquote>
<h2>一、六类审计日志：两层采集，各司其职</h2>
<table>
<thead>
<tr>
<th>日志</th>
<th>记什么</th>
<th>采集层</th>
</tr>
</thead>
<tbody>
<tr>
<td>登录审计</td>
<td>登录尝试：成败、IP、归属地、失败原因</td>
<td>transport 中间件</td>
</tr>
<tr>
<td>操作审计</td>
<td>谁对哪个资源做了什么写操作（resource_type / action）</td>
<td>transport 中间件</td>
</tr>
<tr>
<td>API 审计</td>
<td>每次 API 调用的 method/path/耗时/IP</td>
<td>transport 中间件</td>
</tr>
<tr>
<td>数据访问审计</td>
<td>SQL 级：sql_text（<strong>词法脱敏后</strong>）、SHA256 指纹、影响行数、时延</td>
<td>数据库驱动包装器</td>
</tr>
<tr>
<td>权限变更审计</td>
<td>权限对象的 grant/revoke/assign 变更</td>
<td>transport 中间件</td>
</tr>
<tr>
<td>策略评估日志</td>
<td>每次 authz 判定的策略匹配过程与请求号</td>
<td>authz 引擎包装器</td>
</tr>
</tbody>
</table>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：六类审计日志与等保合规"}}],["/posts/go_wind_admin_authentication.html",{loader:()=>i(()=>import("./go_wind_admin_authentication.html-N3rJUavJ.js"),__vite__mapDeps([6,5])),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：认证与会话管理实战",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","Security"],excerpt:`
<blockquote>
<p>登录是管理系统被攻击最多的面：撞库、爆破、凭证枚举、会话劫持。很多项目的登录只有"验密码、发 token"两步，其余全靠运气。风行（GoWind Admin）把认证做成了<strong>纵深防御的完整链路</strong>：限流、验证码、登录策略、防枚举、MFA、令牌轮换、会话吊销层层设卡。本文拆解这条链路的设计与取舍。</p>
</blockquote>
<h2>一、登录链路：十一道闸门按序把关</h2>
<p>一次 <code>POST /admin/v1/login</code> 背后的完整链路（按执行顺序）：</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line"> 1 限流预检      IP + 用户名双维度 Redis 计数，锁定中直接 400（被封锁 IP 连用户表都不查）</span>
<span class="line"> 2 图形验证码    Header 携带，Redis verify-and-delete（单次有效）</span>
<span class="line"> 3 租户解析      tenant_code 空=平台登录；非 ON 租户统一文案拒绝</span>
<span class="line"> 4 登录策略·全局段  IP / 时间窗 / 设备黑名单（白名单反向约束）</span>
<span class="line"> 5 标识符反查    输入含 @ 走邮箱、纯数字走手机号，反查真实用户名</span>
<span class="line"> 6 凭证校验      AES 解密入参 → bcrypt 比对；用户不存在也跑一次假 bcrypt（恒定时间防枚举）</span>
<span class="line"> 7 纵深校验      凭证行租户必须等于用户行租户</span>
<span class="line"> 8 登录策略·用户段  定向到具体用户的策略条目</span>
<span class="line"> 9 授权丰富      角色链 → 权限码 → 管理员旗标 → 数据范围/字段黑名单进令牌</span>
<span class="line">10 MFA 闸门      绑有 TOTP 则不发令牌，签发一次性挑战走二次验证</span>
<span class="line">11 签发          access + refresh 双令牌（jti 关联，Redis 令牌对缓存）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：认证与会话管理实战"}}],["/posts/go_wind_admin_backend_access_control.html",{loader:()=>i(()=>import("./go_wind_admin_backend_access_control.html-XLI-2vuc.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端权限控制",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>后端的权限控制主要分为两种：</p>
<ul>
<li>API权限控制；</li>
<li>数据权限控制。</li>
</ul>
<p>在本文，我们不讨论数据权限的控制，主要讲API的权限控制。</p>
<p>在GO的世界里面，我们能够使用到的解决方案有：</p>
<ul>
<li><a href="https://casbin.org/" target="_blank" rel="noopener noreferrer">Casbin</a></li>
<li><a href="https://www.openpolicyagent.org/" target="_blank" rel="noopener noreferrer">Open Policy Agent(OPA)</a></li>
<li><a href="https://research.google/pubs/zanzibar-googles-consistent-global-authorization-system/" target="_blank" rel="noopener noreferrer">Zanzibar</a></li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端权限控制"}}],["/posts/go_wind_admin_backend_project_struct.html",{loader:()=>i(()=>import("./go_wind_admin_backend_project_struct.html-BxUChch-.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端项目结构说明",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">├─.docker</span>
<span class="line">│  └─compose</span>
<span class="line">├─api</span>
<span class="line">│  ├─gen</span>
<span class="line">│  │  └─go</span>
<span class="line">│  │      ├─admin</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      ├─file</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      ├─system</span>
<span class="line">│  │      │  └─service</span>
<span class="line">│  │      │      └─v1</span>
<span class="line">│  │      └─user</span>
<span class="line">│  │          └─service</span>
<span class="line">│  │              └─v1</span>
<span class="line">│  └─protos</span>
<span class="line">│      ├─admin</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      ├─file</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      ├─system</span>
<span class="line">│      │  └─service</span>
<span class="line">│      │      └─v1</span>
<span class="line">│      └─user</span>
<span class="line">│          └─service</span>
<span class="line">│              └─v1</span>
<span class="line">├─app</span>
<span class="line">│  └─admin</span>
<span class="line">│      └─service</span>
<span class="line">│          ├─cmd</span>
<span class="line">│          │  └─server</span>
<span class="line">│          │      └─assets</span>
<span class="line">│          ├─configs</span>
<span class="line">│          └─internal</span>
<span class="line">│              ├─data</span>
<span class="line">│              │  └─ent</span>
<span class="line">│              ├─server</span>
<span class="line">│              └─service</span>
<span class="line">├─pkg</span>
<span class="line">├─script</span>
<span class="line">└─sql</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：后端项目结构说明"}}],["/posts/go_wind_admin_bootstrap.html",{loader:()=>i(()=>import("./go_wind_admin_bootstrap.html-DjFWfMb-.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：kratos-bootstrap 入门教程（类比 Spring Boot）",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>kratos-bootstrap 是 GoWind Admin 底层核心的应用引导框架，承担着类似 Java 生态中 Spring Boot 的角色 —— 通过标准化初始化流程、统一配置管理、简化组件集成，为开发者屏蔽基础设施搭建的复杂性。借助它，开发者无需重复编写微服务启动、配置加载、中间件注册等样板代码，可直接聚焦业务逻辑开发。本文将详细讲解如何在 GoWind Admin 中通过 kratos-bootstrap 完成应用初始化、配置管理、组件集成等关键操作，并对比 Spring 等主流框架的设计理念，帮助开发者快速上手。</p>
<h2>一、kratos-bootstrap 在 GoWind Admin 中的角色：类比 Spring Boot 的「基础设施引擎」</h2>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：kratos-bootstrap 入门教程（类比 Spring Boot）"}}],["/posts/go_wind_admin_casbin.html",{loader:()=>i(()=>import("./go_wind_admin_casbin.html-C-T_fnd7.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Casbin集成指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>GoWind Admin（风行）作为开箱即用的企业级前后端一体中后台框架，致力于解决中后台系统开发中的通用问题，而权限管理作为中后台系统的核心安全能力，是框架设计的重中之重。Casbin 作为一款功能强大、灵活易用的开源访问控制框架，能够完美适配 GoWind Admin 的权限管理需求。本文将详细讲解 Casbin 的核心原理、配置规则，并完整呈现其在 GoWind Admin 中的集成流程与最佳实践。</p>
<h2>一、Casbin 简介：企业级权限管理的优选方案</h2>
<p>Casbin（<a href="https://github.com/casbin/casbin" target="_blank" rel="noopener noreferrer">https://github.com/casbin/casbin</a>）是一款专注于访问控制的开源库，核心目标是帮助复杂系统解决权限管理的灵活性与安全性难题，也是国内开源项目中的优秀代表。其最大优势在于采用<strong>元模型设计思想</strong>，不局限于固定的权限模型，而是支持 ACL（访问控制列表）、RBAC（基于角色访问控制）、ABAC（基于属性访问控制）、RESTful 等多种经典访问控制模型，同时允许开发者根据业务需求自定义权限规则，具备极强的扩展性。
凭借卓越的设计与稳定性，Casbin 已获得全球众多企业的认可：Intel、IBM、腾讯云、VMware、RedHat、T-Mobile 等企业将其用于开源项目，Cisco、Verizon 等企业在闭源系统中采用。项目由北京大学罗杨博士于 2017 年 4 月发起，罗杨博士长期深耕云计算访问控制领域，发表数十篇相关学术论文，并在 ICWS、IEEE CLOUD、ICICS 等顶级学术会议宣讲研究成果，Casbin 正是其学术研究与工程实践结合的核心产物。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Casbin集成指南"}}],["/posts/go_wind_admin_clickhouse.html",{loader:()=>i(()=>import("./go_wind_admin_clickhouse.html-Bl1wqlOr.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：ClickHouse集成指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>ClickHouse 是一款由俄罗斯搜索引擎公司 <strong>Yandex</strong> 开发的开源列式存储数据库，专为<strong>海量数据实时分析</strong>设计。它以<strong>极致的查询性能</strong>和<strong>高吞吐写入能力</strong>著称，尤其擅长处理PB 级别的结构化数据，并能在毫秒到秒级内完成复杂的聚合分析（如多维度统计、漏斗计算、用户行为分析等），是大数据分析、数据仓库、实时报表等场景的核心工具。</p>
<h2>ClickHouse 的核心概念</h2>
<table>
<thead>
<tr>
<th>概念</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>表（Table）</td>
<td>类似关系型数据库的表，存储结构化数据，但底层按列存储。</td>
</tr>
<tr>
<td>引擎（Engine）</td>
<td>决定表的存储方式、查询特性和分布式行为，是 ClickHouse 的核心设计。例如：<br>- <code>MergeTree</code> 系列：最常用，支持索引、分区、副本，适合海量数据存储；<br>- <code>Log</code> 系列：轻量无索引，适合临时小表；<br>- <code>Distributed</code>：分布式表，用于管理集群分片。</td>
</tr>
<tr>
<td>分区（Partition）</td>
<td>按规则（如时间、地区）将表数据拆分，查询时可快速过滤分区，减少扫描范围（如按 “日期” 分区，查询 “2023 年 10 月数据” 仅需扫描对应分区）。</td>
</tr>
<tr>
<td>主键（Primary Key）</td>
<td>用于排序和快速查找，不同于关系型数据库的唯一约束，ClickHouse 主键允许重复，主要作用是优化查询性能。</td>
</tr>
<tr>
<td>跳数索引（Skip Index）</td>
<td>辅助索引，用于快速判断某一范围内是否存在符合条件的数据（如 “数值是否在 100-200 之间”），进一步减少扫描量。</td>
</tr>
<tr>
<td>分片（Shard）</td>
<td>集群中数据的物理拆分单位，每个分片存储表的一部分数据，分布在不同节点，实现并行处理。</td>
</tr>
<tr>
<td>副本（Replica）</td>
<td>同一分片的冗余备份，用于故障恢复和负载均衡（查询可分散到不同副本），保证数据不丢失。</td>
</tr>
</tbody>
</table>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：ClickHouse集成指南"}}],["/posts/go_wind_admin_code_gen.html",{loader:()=>i(()=>import("./go_wind_admin_code_gen.html-CC3h1ty0.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：代码生成工具集",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>我们为<a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">go-wind-admin</a>这个项目打造了一个代码生成工具集。</p>
<ul>
<li>cfgexp 用于将服务本地配置导入到远程配置系统，支持：Etd、Consul、Nacos……</li>
<li>sql2orm 用于把数据库的表结构导入，并且生成为ORM代码，支持：ENT、GORM……</li>
<li>sql2proto 用于把数据的表结构导入，并且生成gRPC、REST的Protobuf代码。</li>
<li>sql2kratos 用于把数据的表结构导入，并且生成一整套的Kratos服务代码。</li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：代码生成工具集"}}],["/posts/go_wind_admin_deploy_docker_image.html",{loader:()=>i(()=>import("./go_wind_admin_deploy_docker_image.html-ubomiRBA.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何进行Docker部署后端",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>Docker 部署具备环境一致性、可移植性强、部署高效等优势，是企业级应用落地的优选方案。风行·GoWind Admin 后端已将所有Docker部署相关操作封装至 Makefile 中，实现极简部署体验。本文将详细介绍两种核心部署方式、服务增减时的配置调整方法，助力开发者快速完成后端服务的容器化部署。</p>
<h2>一、部署前提</h2>
<ul>
<li>本地环境已安装 Docker（建议版本 20.10+）及 Docker Compose（建议版本 2.10+），可通过 <code>docker -v\`\`、docker compose version</code> 命令验证安装。</li>
<li>已获取 GoWind Admin 项目源码，进入后端项目根目录（即 <code>backend</code> 目录），所有部署命令均在此目录执行（特殊说明除外）。</li>
<li>确保部署环境网络通畅，可正常拉取 Docker Hub 公共镜像（如 postgres、redis 等依赖组件）。</li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何进行Docker部署后端"}}],["/posts/go_wind_admin_development_environment_preparation.html",{loader:()=>i(()=>import("./go_wind_admin_development_environment_preparation.html-DlaR2lHf.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何搭建开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>开发环境的稳定与规范是高效开发的基础。风行·GoWind Admin 作为前后端一体的企业级中后台框架，需搭建适配的前端、后端开发环境以保障开发流程顺畅。本文将详细拆解前端、后端开发环境的搭建步骤，涵盖工具安装、插件配置、网络代理设置等核心内容，适配 Windows/macOS 主流系统，助力开发者快速完成环境初始化。</p>
<h2>一、前端开发环境搭建</h2>
<p>前端基于 Vue + TypeScript 技术栈，需安装代码管理、开发IDE、运行环境及依赖管理工具，同时配置 Protobuf 相关插件以支持接口定义解析。</p>
<h3>1. 必备开发工具清单</h3>
<p>以下工具为前端开发核心依赖，确保代码拉取、项目编译、依赖管理等流程正常运行：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何搭建开发环境"}}],["/posts/go_wind_admin_elasticsearch.html",{loader:()=>i(()=>import("./go_wind_admin_elasticsearch.html-3Bcn9XFY.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：ElasticSearch集成指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>ElasticSearch（简称 ES）是 Elastic 技术栈的核心组件，一款开源分布式全文搜索引擎，基于 Lucene 引擎构建，兼具实时数据存储、检索与分析能力。其分布式架构天然支持水平扩展，能轻松应对海量数据场景，凭借高吞吐、低延迟、高可用的特性，广泛应用于中后台系统的日志分析、全文检索、业务监控、数据可视化等核心模块。</p>
<p>GoWind Admin（风行）作为企业级前后端一体中后台框架，已对 ElasticSearch SDK 进行封装，提供标准化配置、依赖注入、通用 CRUD 封装等能力，开发者可快速集成 ES 实现数据检索与分析需求。本指南将从核心概念、环境部署、框架集成、实战示例四个维度，完整讲解 ES 与 GoWind Admin 的集成过程。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：ElasticSearch集成指南"}}],["/posts/go_wind_admin_excel_import_export.html",{loader:()=>i(()=>import("./go_wind_admin_excel_import_export.html-CCsO5dlv.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Excel 导入导出",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>"这个列表能导出 Excel 吗？""能不能批量导入？"——做管理系统交付的两个必问题。很多开源脚手架的答案是"请自行实现"，于是一个导出按钮在几十个列表页被复制粘贴几十遍，格式五花八门。风行（GoWind Admin）把导入导出做成了<strong>统一的封装 + 全面的铺面</strong>：管理页批量挂上导入导出能力，体验一致、代码零重复。</p>
</blockquote>
<h2>一、导出：一个按钮组件铺满全站</h2>
<p>列表页工具栏的「导出」按钮来自统一的 <code>TableExportButton</code> 封装：当前搜索条件、当前列结构一键导出为 <code>.xlsx</code>，文件即点即得。这个封装已经铺满了三端的主要列表页：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Excel 导入导出"}}],["/posts/go_wind_admin_frontend_access_control.html",{loader:()=>i(()=>import("./go_wind_admin_frontend_access_control.html-C7QiS4TM.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：前端权限控制",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统中，前端权限控制是保障数据安全、规范用户操作边界的核心能力。风行·GoWind Admin 前端权限控制核心聚焦于<strong>功能权限管控</strong>，根据控制粒度的不同，分为「页面级权限」和「按钮级权限」两大模块，覆盖从“页面访问”到“操作执行”的全链路权限管控需求。本文将详细拆解两种权限的实现原理、启用方式、核心代码及最佳实践，助力开发者快速落地权限管控方案。</p>
<h2>一、页面级权限：管控页面访问边界</h2>
<p>页面级权限的核心目标是控制用户能否访问特定页面，主要通过「菜单隐藏」和「路由拦截」两种手段实现——未授权用户既无法在侧边栏看到目标菜单，也无法通过直接输入URL跳过菜单访问页面，进而实现对用户访问“财务报表”“人事管理”等核心页面的精准管控。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：前端权限控制"}}],["/posts/go_wind_admin_gow.html",{loader:()=>i(()=>import("./go_wind_admin_gow.html-BWMYNblx.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：极速搭建微服务应用",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统开发中，开发者常常面临两大痛点：一是微服务架构搭建繁琐，从项目初始化到多服务协同需要大量手动配置；二是前后端协同成本高，接口定义、数据模型同步往往耗时费力。而 <strong>GoWind Admin</strong>（简称「风行」）的出现，正是为了解决这些问题 —— 它基于 <code>gow</code> CLI 工具，提供了一套开箱即用的企业级前后端一体中后台框架，让开发者能以极低成本快速搭建微服务体系。</p>
<h2>什么是 GoWind Admin？</h2>
<p>GoWind Admin 是一套聚焦企业级中后台场景的微服务开发框架，基于 Go 语言生态（依托 <a href="https://go-kratos.dev/" target="_blank" rel="noopener noreferrer">go-kratos</a> 微服务框架）打造，整合了前后端开发所需的核心工具链。其核心优势在于「<strong>一键生成</strong>」与「<strong>高度可配置</strong>」：通过 <code>gow</code> 命令行工具，开发者可以快速初始化项目、创建微服务、生成接口与数据层代码，无需从零搭建架构，极大缩短开发周期。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：极速搭建微服务应用"}}],["/posts/go_wind_admin_impl_new_service_with_ent.html",{loader:()=>i(()=>import("./go_wind_admin_impl_new_service_with_ent.html-D8TVsPtY.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：基于 Ent 从零实现新服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>本文将指导开发者在 GoWind Admin 企业级前后端一体中后台框架中，从零开始构建一个完整的 gRPC 服务。我们所指的 “服务” 即 gRPC 中的 service，通常包含特定数据集的 CRUD（增删改查）操作，遵循框架规范实现高可维护性与可扩展性。</p>
<h2>前置准备</h2>
<p>在开始前，请确保已完成以下环境准备：</p>
<h3>开发环境</h3>
<ul>
<li>Go 1.19+（推荐 1.21+，支持最新语言特性）</li>
<li>Git（版本控制）</li>
<li>Protobuf 编译器（<code>protoc</code>，用于编译 proto 文件）</li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：基于 Ent 从零实现新服务"}}],["/posts/go_wind_admin_impl_new_service_with_gorm.html",{loader:()=>i(()=>import("./go_wind_admin_impl_new_service_with_gorm.html-B4X6BR06.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：基于 GORM 从零实现新服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>本文将指导开发者在 GoWind Admin 企业级前后端一体中后台框架中，从零开始构建一个完整的 gRPC 服务。我们所指的 “服务” 即 gRPC 中的 service，通常包含特定数据集的 CRUD（增删改查）操作，遵循框架规范实现高可维护性与可扩展性。</p>
<h2>前置准备</h2>
<p>在开始前，请确保已完成以下环境准备：</p>
<h3>开发环境</h3>
<ul>
<li>Go 1.19+（推荐 1.21+，支持最新语言特性）</li>
<li>Git（版本控制）</li>
<li>Protobuf 编译器（<code>protoc</code>，用于编译 proto 文件）</li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：基于 GORM 从零实现新服务"}}],["/posts/go_wind_admin_in_depth_analysis_of_the_tech_stack_why_choose_the_golang_vue3_combination.html",{loader:()=>i(()=>import("./go_wind_admin_in_depth_analysis_of_the_tech_stack_why_choose_the_golang_vue3_combination.html-B0oLMoWy.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：为什么选 Golang+Vue3 这套组合？",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>企业级 Admin 系统的技术选型，既要兼顾<strong>高性能</strong>与<strong>稳定性</strong>，也要平衡<strong>开发效率</strong>与<strong>可扩展性</strong>。go-wind-admin 作为开箱即用的全栈 Admin 解决方案，最终选定 <strong>Golang 生态（后端）</strong> + <strong>Vue3 生态（前端）</strong> 的技术组合，并非偶然 —— 而是精准匹配企业级管理系统核心需求的必然选择。本文将深度拆解这套技术栈的选型逻辑，以及它如何为项目赋能。</p>
<h2>一、后端技术栈：Golang 生态的 “精准狙击”</h2>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：为什么选 Golang+Vue3 这套组合？"}}],["/posts/go_wind_admin_influxdb.html",{loader:()=>i(()=>import("./go_wind_admin_influxdb.html-DtLsq43T.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：InfluxDB集成指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>InfluxDB 是一款采用 Go 语言开发的开源分布式时序数据库，专为时间序列数据的高效存储、查询与分析设计，由 InfluxData 公司主导开发。其核心优势在于高频写入性能、时序数据索引优化及原生聚合分析能力，广泛应用于 IoT 设备监控、系统性能指标采集、日志时序分析、金融行情跟踪等场景。在企业级中后台系统中，InfluxDB 可快速对接 GoWind Admin 框架，为实时监控面板、历史数据追溯、趋势预测分析等功能提供稳定的数据存储支撑。</p>
<h2>一、InfluxDB 核心概念深度解析</h2>
<p>InfluxDB 的数据模型与传统关系型数据库存在显著差异，理解以下核心概念是实现高效集成的基础。可通过与 MySQL 概念的类比快速建立认知：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：InfluxDB集成指南"}}],["/posts/go_wind_admin_internal_message.html",{loader:()=>i(()=>import("./go_wind_admin_internal_message.html-7gMWgWUG.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：站内信",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级后台管理系统中，站内信是核心沟通组件之一，承担着系统通知、用户互动、业务提醒等关键场景需求。基于 Go 语言微服务框架 <a href="https://github.com/go-kratos/kratos" target="_blank" rel="noopener noreferrer">Kratos</a> 构建的 <a href="https://github.com/tx7do/go-wind-admin" target="_blank" rel="noopener noreferrer">Go Wind Admin</a>，将站内信模块封装为「开箱即用」的标准化组件，无需从零开发即可快速集成，大幅降低开发成本。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：站内信"}}],["/posts/go_wind_admin_intro.html",{loader:()=>i(()=>import("./go_wind_admin_intro.html-CTrzhqP0.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：介绍",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>风行（GoWind Admin）是一款开箱即用的企业级Golang全栈中后台管理框架，品牌slogan：<code>让中后台开发如风般自由</code>。</p>
<p>系统后端基于GO微服务框架<a href="https://go-kratos.dev/" target="_blank" rel="noopener noreferrer">go-kratos</a>，前端基于Vue微服务框架<a href="https://doc.vben.pro/" target="_blank" rel="noopener noreferrer">Vben Admin</a>，兼顾微服务的扩展性与单体部署的便捷性。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：介绍"}}],["/posts/go_wind_admin_jwt.html",{loader:()=>i(()=>import("./go_wind_admin_jwt.html-t18q1IPU.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：JWT 集成指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统开发中，身份认证与授权是核心安全能力。JWT（JSON Web Token）凭借其无状态、轻量化、跨平台的特性，成为分布式系统中身份校验的优选方案。GoWind Admin 作为企业级前后端一体中后台框架，已将 JWT 核心逻辑封装至 <a href="https://github.com/tx7do/kratos-authn" target="_blank" rel="noopener noreferrer">github.com/tx7do/kratos-authn</a> 组件中，彻底简化了底层引擎初始化、策略加载、签名验证等重复开发工作。开发者只需遵循以下标准化步骤，即可快速完成 JWT 集成，无缝对接框架的 OPA 权限管控体系，构建安全可靠的身份认证链路。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：JWT 集成指南"}}],["/posts/go_wind_admin_layer_desigin.html",{loader:()=>i(()=>import("./go_wind_admin_layer_desigin.html-zHlVbQ39.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：分层设计的取舍之道（从 “简单粗暴” 到依赖倒置）",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在后端开发领域，分层设计是破解系统复杂度、提升可维护性的“核心心法”。对于 GoWind Admin 这类企业级中后台框架而言，API 层、Service 层（业务逻辑层）与 Data 层（数据访问层）的交互模式，直接决定了框架的灵活性、开发效率与长期演进能力。其中，Service 层与 Data 层的耦合程度，更是架构设计的“关键胜负手”。​</p>
<p>本文将聚焦 GoWind Admin 的实际开发场景，深入剖析“Service 层直接引用 Data 层 Repo”（简单粗暴方案）、“基于依赖倒置的接口解耦”（工程化方案）以及“新增 biz 层的进阶方案”三种核心模式，拆解分层设计的取舍逻辑——架构设计没有“最优解”，只有“最适配当前场景的解”，尤其对于需要兼顾“开箱即用效率”与“企业级扩展需求”的中后台框架而言，平衡感至关重要。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：分层设计的取舍之道（从 “简单粗暴” 到依赖倒置）"}}],["/posts/go_wind_admin_list_query_rule.html",{loader:()=>i(()=>import("./go_wind_admin_list_query_rule.html-qcSgv9L-.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：列表查询规则指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统中，列表查询是贯穿“数据管理、业务审核、统计分析”的核心高频场景——从用户列表的多条件筛选，到订单数据的时间区间查询，再到报表的排序分页，其易用性与灵活性直接决定研发效率与业务操作体验。风行·GoWind Admin 作为开箱即用的 Go 语言后台管理系统，以“降低开发成本、提升研发效率”为核心设计理念，针对性打造了一套“配置化、高兼容、可扩展”的列表查询规则，让开发者无需关注底层 SQL 实现，仅通过简单配置即可完成复杂查询需求。</p>
<h2>一、核心设计理念：声明式语法与 Go 生态适配</h2>
<p>GoWind Admin 列表查询规则的设计，深度借鉴了 Python 生态中 Django ORM、SQLAlchemy 等优秀框架的“声明式语法”核心思想——通过贴近自然语言的配置方式屏蔽底层数据访问细节，让开发者聚焦业务逻辑而非 SQL 拼接。但不同于简单照搬，我们基于 Go 语言“强类型、高性能”的特性做了全链路适配，最终实现“简洁直观”与“原生兼容”的平衡：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：列表查询规则指南"}}],["/posts/go_wind_admin_makefile.html",{loader:()=>i(()=>import("./go_wind_admin_makefile.html-Df89zrA2.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Makefile 在后端开发中的应用与 Windows 环境配置",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台框架的开发过程中，高效的工程化管理是提升团队协作效率、保障开发流程规范的核心。GoWind Admin（风行）作为一款基于 Go 微服务框架 go-kratos 和 Vue 前端框架 Vben Admin 的全栈解决方案，其后端工程化体系中，Makefile 扮演了至关重要的角色 —— 它通过统一的命令集简化了复杂的构建流程，实现了环境初始化、依赖管理、代码生成、服务部署等操作的自动化，让开发者能够聚焦业务逻辑而非繁琐的工具链配置。本文将系统介绍 Windows 环境下 make 工具的安装方法、Makefile 的分层设计逻辑，以及核心命令的实战应用。</p>
<h2>一、Makefile 在 GoWind Admin 后端开发中的核心价值</h2>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：Makefile 在后端开发中的应用与 Windows 环境配置"}}],["/posts/go_wind_admin_mongodb.html",{loader:()=>i(()=>import("./go_wind_admin_mongodb.html--6vlba2s.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：MongoDB集成指南（从部署到实战全攻略）",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>MongoDB 是一款开源的文档型 NoSQL 数据库，以<strong>灵活的 Schema 设计</strong>、<strong>原生 JSON/BSON 支持</strong>、<strong>高可扩展性</strong>和<strong>高性能查询</strong>著称，非常适合处理中后台系统中的非结构化 / 半结构化数据（如用户行为日志、动态表单配置、多维度报表、个性化配置等）。</p>
<p>GoWind Admin（风行）是面向企业级场景的前后端一体中后台框架，本文将从「环境部署→配置集成→模型设计→仓储实现→最佳实践」全流程讲解如何在 GoWind Admin 中优雅集成 MongoDB，覆盖开发、部署、调优全环节。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：MongoDB集成指南（从部署到实战全攻略）"}}],["/posts/go_wind_admin_multi_tenant_isolation.html",{loader:()=>i(()=>import("./go_wind_admin_multi_tenant_isolation.html-DMjLji9i.js"),__vite__mapDeps([7,8])),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：多租户与行级数据隔离",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>SaaS 化的第一道坎就是数据隔离：租户 A 的运营人员绝不能看到租户 B 的一行数据——这不是"前端藏好按钮"能解决的事，而是要从 HTTP 入口一路压实到 SQL 的 WHERE 子句。多数自研方案的做法是在每个查询里手写 <code>tenant_id</code> 条件，写漏一处就是一次数据泄露事故。风行（GoWind Admin）把租户隔离做成了<strong>编译进数据访问层的默认行为</strong>：查询自动注入租户谓词、跨租户变更必扑空、伪造租户 ID 直接被覆盖，配合 HTTP 层的 Api 表闸门形成纵深防御。本文拆解这套隔离体系的三道防线与覆盖边界。</p>
</blockquote>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：多租户与行级数据隔离"}}],["/posts/go_wind_admin_notification_domain.html",{loader:()=>i(()=>import("./go_wind_admin_notification_domain.html-DLiZbbtT.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：通知域实战",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>大多数管理系统的"通知"长成这样：站内信是一张表、邮件发送散落在某个 service 里、Webhook 是临时加的一段 curl——三个互不相认的半成品。想回答"这条通知发了没有、为什么失败"时，只能翻日志。风行（GoWind Admin）把通知做成了一个完整的域：<strong>业务代码一个入口发通知，路由规则决定走哪个渠道，投递台账记录每一次的成败与原因</strong>。本文拆解这套统一投递体系。</p>
</blockquote>
<h2>一、痛点对话：两个互不相认的半个域</h2>
<p>风行在设计通知域之前，面对的正是多数项目的现状：</p>
<ul>
<li><strong>站内信</strong>成熟，但只能站内投递；</li>
<li><strong>通知渠道</strong>（SMTP 邮箱配置）能发站外，但没有调度层——谁在什么时候该发什么，没人管。</li>
</ul>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：通知域实战"}}],["/posts/go_wind_admin_opa.html",{loader:()=>i(()=>import("./go_wind_admin_opa.html-YgX0B8YQ.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：OPA 集成指南：从原理到实践",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>Open Policy Agent（简称 OPA）是一款开源的通用策略引擎，核心价值在于实现“策略即代码”（Policy as Code），将分散在各系统中的权限控制、资源访问规则等策略逻辑抽离出来，进行统一管理、版本控制与执行。如今，OPA 已成为云原生生态中策略管控的事实标准，被 Netflix、Cloudflare、Pinterest、Chef 等巨头广泛应用——从内部 API 权限管控、Kubernetes 集群资源调度，到终端产品的 IAM 功能实现，均能看到其身影。</p>
<p>OPA 由 Styra 公司于 2016 年开源，2018 年加入 CNCF（云原生计算基金会）成为沙箱项目，2021 年 2 月正式毕业，其快速晋升的背后，是社区的高度活跃与行业对统一策略管控需求的迫切性。本文将从 OPA 核心原理、Rego 语言入门，逐步深入到 GoWind Admin 企业级中后台框架的完整集成流程，帮助开发者快速落地权限管控能力。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：OPA 集成指南：从原理到实践"}}],["/posts/go_wind_admin_plan_billing.html",{loader:()=>i(()=>import("./go_wind_admin_plan_billing.html-DCeLGMHZ.js"),__vite__mapDeps([9,8])),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：套餐与计费管控",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind","SaaS"],excerpt:`
<blockquote>
<p>把一套管理系统卖给多家客户（SaaS 化），光有租户隔离还不够——你得回答这三个商业问题：**免费版能用哪些功能？套餐到期了怎么办？用量怎么计量？**多数项目在接第一单时才想起这些，然后用手写 SQL 改库、人工停账号的方式勉强运转。风行（GoWind Admin）把套餐体系做成了平台原生的三层结构：套餐目录、模块白名单、配额计量，配合三档到期处置策略全自动执行。本文拆解这套 SaaS 化运营能力。</p>
</blockquote>
<h2>一、三层模型：目录、白名单、配额</h2>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">配置面    sys_plans（套餐目录：版本 / 到期策略 / 描述）</span>
<span class="line">          sys_plan_modules（套餐 → 功能模块白名单）</span>
<span class="line">          sys_plan_quotas（套餐 → 配额）</span>
<span class="line">                      │ 管理页维护（租户管理 → 套餐管理 / 配额管理）</span>
<span class="line">                      ▼</span>
<span class="line">绑定面    sys_tenants.plan（套餐外键）+ expired_at（到期时间）</span>
<span class="line">                      ▼</span>
<span class="line">执行面    模块白名单 → HTTP 租户闸门（fail-closed）</span>
<span class="line">          到期处置   → 三档策略全自动执行</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：套餐与计费管控"}}],["/posts/go_wind_admin_quick_start_guide_from_environment_setup_to_service_launch_windows_macos_linux_universal.html",{loader:()=>i(()=>import("./go_wind_admin_quick_start_guide_from_environment_setup_to_service_launch_windows_macos_linux_universal.html-T3zRhrQB.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：5 分钟快速启动",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>go-wind-admin 作为开箱即用的企业级 Admin 全栈解决方案，核心优势之一是通过 <code>backend/script</code> 目录的 <strong>自动化脚本</strong> 降低跨系统部署门槛。本文以 “脚本驱动 + 实操验证” 为核心，优化步骤连贯性与细节提示，补充用户高频踩坑点，帮你更顺畅地完成从环境到服务的全流程搭建。</p>
<p><strong>前置检查清单（启动前必看）</strong></p>
<p>避免因基础条件缺失导致流程中断，启动前确认以下事项：</p>
<ol>
<li>操作系统权限：Windows 需 管理员身份 打开 PowerShell；Linux/macOS 需拥有 <code>sudo</code> 权限（执行脚本时可能需要）。</li>
<li>网络状态：确保能访问 <code>GitHub</code>、<code>Docker Hub</code>、<code>Homebrew</code>/<code>Scoop</code> 源（建议提前配置国内镜像，见各系统备注）。</li>
<li>磁盘空间：预留至少 <strong>10GB</strong> 空间（用于存储 Docker 镜像、依赖包、编译产物）。</li>
</ol>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：5 分钟快速启动"}}],["/posts/go_wind_admin_redact.html",{loader:()=>i(()=>import("./go_wind_admin_redact.html-z5qMlUAf.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据脱敏和隐私保护",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>Go Wind Admin 的数据脱敏能力，是基于 Protobuf 生态下的<a href="https://github.com/arrakis-digital/protoc-gen-redact" target="_blank" rel="noopener noreferrer">arrakis-digital/protoc-gen-redact</a>插件实现的 —— 通过在 Protobuf 消息定义中为敏感字段（如手机号、身份证号）添加脱敏注解（如(<code>(redact.custom).string = "r*d@ct*d"</code>)），由插件自动生成适配业务的脱敏方法（如 Go 语言的Redact()方法），无需侵入业务逻辑即可完成敏感数据的遮挡处理，同时保持与 Protobuf 消息结构的强绑定，避免跨层配置不一致问题。配微服务接口、日志打印、数据存储等场景的隐私保护需求。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据脱敏和隐私保护"}}],["/posts/go_wind_admin_script_engine.html",{loader:()=>i(()=>import("./go_wind_admin_script_engine.html-BkKWeFPv.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用 JavaScript/Lua 解锁动态业务扩展能力",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统开发领域，「业务规则频繁迭代」与「个性化需求快速响应」始终是困扰开发团队的核心痛点。试想这样的场景：电商平台的促销规则需随节日实时调整， SaaS 系统需为不同行业客户定制专属审批流程，风控系统需根据最新风险模型动态更新校验逻辑…… 传统「代码开发 - 编译打包 - 部署上线」的全流程，往往需要数小时甚至数天才能完成迭代，严重滞后于业务节奏。</p>
<p>脚本引擎的嵌入式集成，为这一困境提供了优雅的破局思路——通过动态执行脚本代码，实现业务逻辑的「热更新、热部署」，无需重启服务即可完成规则迭代与需求适配。GoWind Admin（风行）作为一款主打「开箱即用」的企业级前后端一体中后台框架，精准洞察这一需求，深度整合 <code>kratos-bootstrap</code> 生态中的 <code>script_engine</code> 组件（<a href="https://github.com/tx7do/kratos-bootstrap/tree/main/script_engine" target="_blank" rel="noopener noreferrer">https://github.com/tx7do/kratos-bootstrap/tree/main/script_engine</a>），实现了对 JavaScript、Lua 两种主流脚本语言的无缝支持，让开发者能够以极低成本嵌入动态逻辑，为中后台系统注入「随需而变」的灵活基因。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用 JavaScript/Lua 解锁动态业务扩展能力"}}],["/posts/go_wind_admin_script_system.html",{loader:()=>i(()=>import("./go_wind_admin_script_system.html-B2UeDdBi.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：脚本系统实战",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>"新用户注册后自动发一封欢迎语""租户创建后写一条审计流水""每天凌晨清理一次过期文件"——这些小逻辑每个项目都有，但为它们走一遍「改代码 → 编译 → 发版」的流程，性价比低到令人发指。风行（GoWind Admin）内建了一套脚本级插件系统：用 JavaScript/Lua 写扩展逻辑，在管理页在线编辑、试运行、一键启用，<strong>不发版、不重启、即时生效</strong>。本文讲这套系统的扩展点、安全模型与管理页工作流。</p>
</blockquote>
<h2>一、先对号入座：什么需求该用脚本</h2>
<p>风行把"行为扩展"分成三档，脚本系统卡在中间那一档：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：脚本系统实战"}}],["/posts/go_wind_admin_sse_architecture.html",{loader:()=>i(()=>import("./go_wind_admin_sse_architecture.html-BHPb0Q6S.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：SSE 实时推送架构",author:"",date:"2026-09-30T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>管理系统的"实时"需求比想象中多：站内信到达要立即亮起铃铛、协同操作要互相感知、AI 对话要逐字流式输出。轮询能做但难看，WebSocket 重但得自己管心跳与重连。风行（GoWind Admin）选择了 Server-Sent Events——HTTP 之上的单向服务端推送，并把它做成了<strong>独立网关 + 统一事件通道</strong>的平台基础设施。本文拆解这套推送架构。</p>
</blockquote>
<h2>一、拓扑：推送是一个独立端口</h2>
<p>SSE 服务独立监听 <code>:7789</code>，与 REST 的 <code>:7788</code> 分离：</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：SSE 实时推送架构"}}],["/posts/go_wind_admin_swagger.html",{loader:()=>i(()=>import("./go_wind_admin_swagger.html-CRrIueow.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：集成 Swagger UI 打造交互式 API 文档",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台系统开发中，接口调试、测试与文档同步始终是困扰前后端团队的核心痛点：接口变更后文档未及时更新、手动编写文档效率低下、调试工具切换繁琐等问题，严重影响开发协作效率。而 OpenAPI 规范（原 Swagger 规范）及其配套工具 Swagger UI，正是解决这些问题的最优解之一。</p>
<p>笔者在使用 Python 生态的 FastAPI 框架时，发现其内置的 Swagger UI 体验极佳——开发者可直接通过 <a href="http://127.0.0.1:8000/docs" target="_blank" rel="noopener noreferrer">http://127.0.0.1:8000/docs</a> 访问交互式 API 文档，实现接口可视化调试与测试，无需额外部署工具。受此启发，我们将这一方案借鉴到 GoWind Admin（基于 Kratos 框架的企业级前后端一体中后台框架）中，实现了 API 文档的自动化生成与嵌入式访问。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：集成 Swagger UI 打造交互式 API 文档"}}],["/posts/go_wind_admin_task.html",{loader:()=>i(()=>import("./go_wind_admin_task.html-D6l6jG6z.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：定时任务",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在后台管理系统中，定时任务是一个很实用的功能，可以帮助我们自动执行一些周期性的任务，比如定期清理数据、发送邮件提醒等。</p>
<p>在go里面，如果想要简单的实现一个周期性任务，我们可以用<a href="https://github.com/robfig/cron" target="_blank" rel="noopener noreferrer">cron</a>或者<a href="https://github.com/roylee0704/gron" target="_blank" rel="noopener noreferrer">gron</a>等仿linux的crontab的库。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：定时任务"}}],["/posts/go_wind_admin_upload_file.html",{loader:()=>i(()=>import("./go_wind_admin_upload_file.html-B4LeDO8H.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何上传文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在一个CMS和Admin系统里面，文件上传是一个极其重要的功能之一。</p>
<p>在Kraots-Admin里面，我们把所有的文件都落地到MinIO。MinIO是一个非常优秀的分布式文件管理系统。</p>
<p>通常，后端可用的有两种上传方式：</p>
<ol>
<li>通过Kratos的服务向MinIO申请预签名URL，然后通过预签名URL向MinIO上传文件。</li>
<li>直接向Kratos的服务上传文件，然后，微服务再将文件落地到MinIO。</li>
</ol>
<p>方式一，这是最优的解决方案，因为文件不会经过微服务，直接上传到MinIO，减轻了微服务的压力。并且，MinIO支持分布式部署，可以很好的扩展。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：如何上传文件"}}],["/posts/go_wind_admin_user_table_evolution.html",{loader:()=>i(()=>import("./go_wind_admin_user_table_evolution.html-BkFU8ogA.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用户表从简单到租户的演进",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>先解决有没有，再解决好不好</p>
<h2>极简User</h2>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> users <span class="token punctuation">(</span></span>
<span class="line">    id <span class="token keyword">BIGINT</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span><span class="token punctuation">,</span></span>
<span class="line">    authority <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">50</span><span class="token punctuation">)</span><span class="token punctuation">,</span></span>
<span class="line">    password <span class="token keyword">VARCHAR</span><span class="token punctuation">(</span><span class="token number">255</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：用户表从简单到租户的演进"}}],["/posts/go_wind_admin_wire.html",{loader:()=>i(()=>import("./go_wind_admin_wire.html-CGvJ01pf.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：深度解析 Wire 依赖注入集成实践",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台框架开发中，依赖管理是贯穿全生命周期的核心挑战 —— 随着项目规模扩张，手动创建对象、传递依赖会导致代码耦合度陡增、测试成本居高不下、维护难度指数级上升。依赖注入（DI）通过 “控制反转” 机制，将对象的创建与依赖传递解耦，成为解决这一问题的最优解之一。本文以 GoWind Admin（风行）框架为实践载体，深度解析 Google 开源的编译期依赖注入工具 Wire，并完整呈现其在企业级中后台框架中的标准化集成方案。</p>
<h2>一、基础认知：什么是依赖注入（DI）？</h2>
<p>依赖注入（Dependency Injection，DI）是实现控制反转（IoC）的核心技术，其核心思想可概括为：<strong>对象的依赖由外部容器提供，而非对象自身创建</strong>。这里的 “依赖” 指对象运行所需的其他组件（如数据库连接、配置实例、业务服务等），“注入” 则是外部容器将依赖主动传递给目标对象的过程。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：深度解析 Wire 依赖注入集成实践"}}],["/posts/go_wind_admin_with_protoc_gen_typescript_http.html",{loader:()=>i(()=>import("./go_wind_admin_with_protoc_gen_typescript_http.html-CWwhZe11.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：自动化解放双手，初学者快速搭建系统并自动生成前端接口",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>作为后端开发者，你是否曾为前后端接口联调反复沟通？作为前端新手，是否觉得手动封装 Rest 接口繁琐又易出错？今天就为大家推荐一套高效组合拳——GoWind Admin（开箱即用的全栈中后台框架）+ protoc-gen-typescript-http（Protobuf 驱动的 TS 接口生成器），让你从零到一快速搭建企业级管理系统，还能自动生成类型安全的前端接口，生产力直接翻倍！</p>
<h2>一、先搞懂：这两个工具到底是什么？</h2>
<p>动手实操前，我们先理清核心工具的定位，避免盲目上手：</p>
<h3>1. GoWind Admin：企业级中后台的「脚手架王者」</h3>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：自动化解放双手，初学者快速搭建系统并自动生成前端接口"}}],["/posts/go_wind_api_aggregator.html",{loader:()=>i(()=>import("./go_wind_api_aggregator.html-DOXHHNfz.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架・内置微服务接口数据聚合能力",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<blockquote>
<p>让复杂归于简单，让聚合成为本能。</p>
</blockquote>
<p>在微服务架构盛行的今天，企业中后台系统正面临前所未有的开发与性能双重挑战：前端需从数十个独立服务中零散拉取数据，网络请求冗余、状态管理繁琐；后端逻辑分散、接口复用性差、N+1 查询问题泛滥，既拖累开发效率，也让系统性能持续承压。如何在坚守系统解耦原则的同时，高效组装业务视图、简化开发链路？<strong>GoWind Admin（风行）</strong> 应运而生——一款专为现代企业打造的全栈中后台框架，以“<strong>开箱即用 + 内置智能聚合</strong>”为核心理念，彻底破解微服务时代的数据拼装难题，让开发者从接口拼接的繁琐工作中解放出来。</p>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架・内置微服务接口数据聚合能力"}}],["/posts/go_wind_cms_headless_architecture_advantages.html",{loader:()=>i(()=>import("./go_wind_cms_headless_architecture_advantages.html-CUX64l3I.js"),[]),meta:{_blog:{title:"Headless 架构优势：内容与展示解耦，一套 API 打通全端生态",author:"",date:"2026-04-09T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在前端技术飞速迭代的当下，用户触点早已从单一的 Web 端，延伸至小程序、APP、平板、智能设备等多元场景。传统的 “前后端一体” 架构（如
PHP/Java 渲染模板）在面对多端适配时，暴露出<strong>耦合严重、开发效率低、体验不统一</strong>等核心痛点。</p>
<p>而 <strong>Headless（无头）架构</strong> 作为一种<strong>以 API 为核心、内容与展示完全解耦</strong>的架构模式，正成为企业级应用、内容平台与数字化系统的主流解决方案。结合
风行 GoWind 等基于 Go 语言的 Headless CMS / 后端架构，其能实现<strong>一套 API 同时支撑 Web、小程序、APP、React/Vue、Taro
等全端开发</strong>，在效率、灵活性、扩展性上形成降维打击。</p>`},title:"Headless 架构优势：内容与展示解耦，一套 API 打通全端生态"}}],["/posts/go_wind_cms_intro.html",{loader:()=>i(()=>import("./go_wind_cms_intro.html-DQPYgErE.js"),[]),meta:{_blog:{title:"GoWind Content Hub｜风行，开箱即用的企业级前后端一体内容中台",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>风行（GoWind HCH）是一款基于 Golang 全栈构建的企业级 Headless 内容中台（HCH=Headless Content Hub，无头内容中枢），以开箱即用的产品形态、灵活可扩展的架构设计，为企业打造全域内容管理与分发的一体化解决方案，助力企业打破内容孤岛，实现全场景内容高效运营。</p>
<h2>为什么选择风行内容中台？</h2>
<p>在数字化时代，企业内容资产的价值愈发凸显，但传统内容管理模式普遍面临「架构僵化、多端适配难、权限管控粗、运营效率低」等痛点。风行内容中台从企业实际业务场景出发，构建了「轻量化部署、全能力覆盖、高灵活拓展」的产品体系：</p>
<ul>
<li><strong>全栈技术底座</strong>：基于 Golang 高性能后端框架打造，兼顾稳定性与并发能力，多前端技术栈适配满足不同团队技术选型需求；</li>
<li><strong>Headless 核心架构</strong>：内容生产与展示层解耦，通过标准化 API 实现内容跨端、跨平台无缝分发，适配 Web、小程序、APP 等全终端场景；</li>
<li><strong>企业级权限体系</strong>：从租户、部门、角色到按钮级权限的全维度管控，满足大型组织复杂的权限划分与数据隔离需求；</li>
<li><strong>可视化高效运营</strong>：无需代码开发，通过可视化配置完成内容建模、菜单管理、站点配置等核心操作，大幅降低运营成本，提升内容上线效率。</li>
</ul>`},title:"GoWind Content Hub｜风行，开箱即用的企业级前后端一体内容中台"}}],["/posts/go_wind_cms_vs_php_java_cms.html",{loader:()=>i(()=>import("./go_wind_cms_vs_php_java_cms.html-BjLKNi3H.js"),[]),meta:{_blog:{title:"Go 语言 CMS 横评：风行 GoWind 对比传统 PHP/Java CMS 核心优势",author:"",date:"2026-04-09T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<h2>一、前言</h2>
<p>在内容管理系统（CMS）领域，PHP（如 WordPress、织梦、帝国 CMS）与 Java（如
Jeecms、SiteServer）长期占据主流市场，前者以低成本、易上手著称，后者以企业级稳定性立足。但随着 Go 语言在高并发、云原生、微服务场景的爆发式普及，基于
Go 开发的轻量高性能 CMS 开始成为中小站点、企业官网、资讯平台、跨境独立站的新选择，其中<strong>风行 GoWind</strong> 作为国产优质 Go 原生
CMS
代表，凭借 Go 语言底层优势和轻量化设计，在性能、部署、运维、成本等维度对传统 PHP/Java CMS 形成了差异化竞争力。</p>`},title:"Go 语言 CMS 横评：风行 GoWind 对比传统 PHP/Java CMS 核心优势"}}],["/posts/go_wind_data_permission.html",{loader:()=>i(()=>import("./go_wind_data_permission.html-B0RT2LXX.js"),[]),meta:{_blog:{title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据权限体系设计与实现",author:"",date:"2020-01-01T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业级中后台应用的建设中，<strong>数据权限</strong>是保障信息安全、符合业务合规要求的核心能力，更是平衡系统安全性与业务灵活性的关键支点。它不仅要精准解决 “谁能看到什么数据” 的核心问题，更需兼顾系统的可维护性、可扩展性与用户体验。GoWind Admin（风行）作为开箱即用的企业级全栈中后台框架，内置<strong>多层次、细粒度、高可扩展的一体化数据权限体系</strong>，从租户全局隔离到动态策略维度全面覆盖，原生支持单租户 / 多租户 SaaS 部署，让企业级应用的权限管理从 “重复开发” 变为 “开箱即用”。</p>
<h2>一、数据权限的五大核心粒度层级</h2>`},title:"GoWind Admin｜风行 — 开箱即用的企业级全栈中后台框架：数据权限体系设计与实现"}}],["/posts/golang_concurrency_patterns_fanin_fanout.html",{loader:()=>i(()=>import("./golang_concurrency_patterns_fanin_fanout.html-pApsaX9p.js"),[]),meta:{_blog:{title:"Golang 并发模式：扇入、扇出",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","设计模式"],excerpt:`
<p>个人喜爱 Golang 的最突出原因之一是：我们可以轻松构建高可用且非阻塞的程序。</p>
<p>在本系列文章中，我将尝试回忆 Golang 中可用的模式。我将采用每种模式，并详细讨论它们适合的位置以及如何有效地使用它们。</p>
<blockquote>
<p>什么是扇入扇出。这是一种将数据从多个流或从一个流汇聚到多个流或管道的单一数据流的方法。</p>
</blockquote>
<h2>generate函数</h2>
<p>为了讨论这个模式，我们首先需要一个数据源。这是一个可以用作数据源的数据生成器。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">generate</span><span class="token punctuation">(</span> data <span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token operator">&lt;-</span><span class="token keyword">chan</span> <span class="token builtin">string</span><span class="token punctuation">{</span></span>
<span class="line">    channel <span class="token operator">:=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">chan</span> <span class="token builtin">string</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">    <span class="token keyword">go</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">{</span></span>
<span class="line">            channel <span class="token operator">&lt;-</span> data</span>
<span class="line">            time<span class="token punctuation">.</span><span class="token function">Sleep</span><span class="token punctuation">(</span>time<span class="token punctuation">.</span><span class="token function">Duration</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Millisecond<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">    </span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> channel</span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Golang 并发模式：扇入、扇出"}}],["/posts/golang_face_recognition.html",{loader:()=>i(()=>import("./golang_face_recognition.html-BqdO_bXV.js"),[]),meta:{_blog:{title:"Golang 人脸识别",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","人脸识别"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://www.agora.io/cn/community/blog-120-category-21736" target="_blank" rel="noopener noreferrer">手把手 Golang 实现静态图像与视频流人脸识别</a></li>
<li><a href="https://golangexample.com/golangren-lian-shi-bie/" target="_blank" rel="noopener noreferrer">Golang人脸识别</a></li>
</ul>`},title:"Golang 人脸识别"}}],["/posts/golang_module_manage.html",{loader:()=>i(()=>import("./golang_module_manage.html-FnfE76ok.js"),[]),meta:{_blog:{title:"Golang模块版本管理",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang"],excerpt:`
<h2>GO模块版本号</h2>
<p>模块的开发人员使用模块版本号的每个部分来表示版本的稳定性和向后兼容性。对于每个新版本，模块的发布版本号具体反映了自上一版本以来模块更改的性质。</p>
<p>当您开发使用外部模块的代码时，您可以在考虑升级时使用版本号来了解外部模块的稳定性。当您开发自己的模块时，您的版本号将向其他开发人员表明您的模块的稳定性和向后兼容性。</p>
<p>发布的模块在语义版本控制模型中使用版本号发布，如下图所示：</p>
<p><img src="/assets/images/golang/version-number.png" alt="version-number"></p>`},title:"Golang模块版本管理"}}],["/posts/golang_mongodb_query_examples.html",{loader:()=>i(()=>import("./golang_mongodb_query_examples.html-D04JW3Rm.js"),[]),meta:{_blog:{title:"如何使用 Golang 查询 MongoDB",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","MongoDB"],excerpt:`
<h2>如何使用 Golang 连接 MongoDB</h2>
<p>连接 MongoDB 非常简单，只需连接 MongoDB 生成的 uri。</p>
<p>然后我们可以使用 <a href="https://pkg.go.dev/go.mongodb.org/mongo-driver/mongo#Client.Database" target="_blank" rel="noopener noreferrer">client.Database()</a> 函数来确保我们连接到正确的数据库。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">package</span> main</span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">(</span></span>
<span class="line">	<span class="token string">"context"</span></span>
<span class="line">	<span class="token string">"log"</span></span>
<span class="line">	<span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo"</span></span>
<span class="line">	<span class="token string">"go.mongodb.org/mongo-driver/mongo/options"</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	ctx<span class="token punctuation">,</span> cancel <span class="token operator">:=</span> context<span class="token punctuation">.</span><span class="token function">WithTimeout</span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">Background</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10</span><span class="token operator">*</span>time<span class="token punctuation">.</span>Second<span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	client<span class="token punctuation">,</span> err <span class="token operator">:=</span> mongo<span class="token punctuation">.</span><span class="token function">Connect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">,</span> options<span class="token punctuation">.</span><span class="token function">Client</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">ApplyURI</span><span class="token punctuation">(</span><span class="token string">"mongodb://localhost:27017"</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">if</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		log<span class="token punctuation">.</span><span class="token function">Fatal</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	db <span class="token operator">:=</span> client<span class="token punctuation">.</span><span class="token function">Database</span><span class="token punctuation">(</span><span class="token string">"testdb"</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">	<span class="token comment">// disconnect the mongo client when main is completed</span></span>
<span class="line">	<span class="token keyword">defer</span> <span class="token keyword">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">if</span> err <span class="token operator">=</span> client<span class="token punctuation">.</span><span class="token function">Disconnect</span><span class="token punctuation">(</span>ctx<span class="token punctuation">)</span><span class="token punctuation">;</span> err <span class="token operator">!=</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token function">panic</span><span class="token punctuation">(</span>err<span class="token punctuation">)</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">	<span class="token punctuation">}</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"如何使用 Golang 查询 MongoDB"}}],["/posts/golang_out_param.html",{loader:()=>i(()=>import("./golang_out_param.html-BZkZthkl.js"),[]),meta:{_blog:{title:"Golang在func中分配的变量通过参数传递出函数域之后变nil的问题",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang"],excerpt:`
<p>最近在Go上面碰到了一个传出参数的问题：</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">func</span> <span class="token function">testOutString</span><span class="token punctuation">(</span>out <span class="token operator">*</span><span class="token builtin">string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">if</span> out <span class="token operator">==</span> <span class="token boolean">nil</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token comment">// str := "hellow"</span></span>
<span class="line">		<span class="token comment">// out = &amp;str</span></span>
<span class="line">		out <span class="token operator">=</span> <span class="token function">new</span><span class="token punctuation">(</span><span class="token builtin">string</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	<span class="token operator">*</span>out <span class="token operator">=</span> <span class="token string">"hello"</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> str <span class="token operator">*</span><span class="token builtin">string</span></span>
<span class="line">	<span class="token function">testOutString</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Golang在func中分配的变量通过参数传递出函数域之后变nil的问题"}}],["/posts/golang_with_bazel.html",{loader:()=>i(()=>import("./golang_with_bazel.html-BgMSYEY0.js"),[]),meta:{_blog:{title:"使用Bazel构建Golang程序",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Bazel"],excerpt:`
<p>在这篇简短的文章中，我们将介绍如何将 Golang 与 Bazel 构建系统结合使用。</p>
<p>具体来说，我们将讨论三个场景：</p>
<ol>
<li>从头开始一个 Golang 项目；</li>
<li>将一个现有的 Golang 项目转换为 Bazel 构建；</li>
<li>以及将一个第三方 Golang 项目引入到您的 Bazel 构建系统。</li>
</ol>
<h2>从头开始一个 Golang 项目</h2>
<p>让我们从将 Go 与 Bazel 结合使用的基础知识开始。</p>
<p>为此，我们需要从 <a href="https://github.com/bazelbuild/rules_go" target="_blank" rel="noopener noreferrer">https://github.com/bazelbuild/rules_go</a> 获取 Go 语言的官方构建规则。</p>`},title:"使用Bazel构建Golang程序"}}],["/posts/gowind-admin-go-vue-react-dev-practice.html",{loader:()=>i(()=>import("./gowind-admin-go-vue-react-dev-practice.html-syw3snbK.js"),[]),meta:{_blog:{title:"Go + Vue/React 全栈开发实践",author:"",date:"2026-05-25T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>在企业中后台开发场景中，长期存在两大痛点：臃肿单体项目难以横向拓展，纯微服务架构对中小型团队过重；同时团队技术栈不统一，Vue、React 技术偏好并存，提升项目统一搭建成本。为解决以上问题，我基于 Go 语言打造双模后端基座，并配套三套差异化前端模板，封装出开箱即用的全栈脚手架 <strong>GoWind Admin（风行）</strong>。</p>
<p>本文从架构设计、技术选型、底层原理、工程化脚本、落地体验等维度，完整分享整套脚手架的全站开发实践。</p>
<hr>
<h2>一、整体架构设计</h2>
<h3>1.1 设计理念：一套代码，两种部署模式</h3>
<p>后端基于 Kratos 微服务规范开发，创新性实现<strong>单体/微服务双模适配</strong>：既支持集群化微服务部署，满足大型业务拓展需求；也可直接编译为独立二进制文件，以单体模式运行。小团队可直接单体部署快速上线，后续业务增长无需重构，即可平滑拆分微服务。</p>`},title:"Go + Vue/React 全栈开发实践"}}],["/posts/gowind-admin-kratos-monorepo-lightweight-practice.html",{loader:()=>i(()=>import("./gowind-admin-kratos-monorepo-lightweight-practice.html-C8UeX4n1.js"),[]),meta:{_blog:{title:"技术复盘：基于 GoWind Admin 实现 Kratos 框架单体轻量化落地",author:"",date:"2026-06-06T00:00:00.000Z",category:["GoWind风行"],tag:["Kratos","CRUD","GORM","Ent","Wire","Protobuf","GoWind"],excerpt:`
<p>在 Go 开发社区中，长期存在一个普遍认知误区：以 Kratos 为代表的微服务框架配置流程繁琐、工程模板冗余、上手门槛较高，仅适合大型分布式项目，用于中小单体业务属于大材小用。同时 Protobuf IDL、Wire 依赖注入等配套技术的学习成本，也让大量初学者、外包开发者望而却步。原生 Kratos 本身具备单体运行能力，但官方默认模板面向分布式场景设计，存在组件冗余、初始化流程繁杂、单体适配不友好等问题，直接用于单体项目改造成本较高。而 <strong>GoWind Admin 通过自研 Kratos-Bootstrap 封装层，重构原生框架的启动机制、组件组装逻辑、分层规范与工程工具体系</strong>，借鉴 Java Spring Boot 配置驱动的极简设计思想，实现了微服务框架的轻量化、标准化单体落地。本文将基于 GoWind Admin 原生架构，从架构革新、工具链工程化赋能、数据源拓展能力、渐进式架构演进四个维度，拆解其低门槛、高规范、可拓展的核心技术优势。</p>`},title:"技术复盘：基于 GoWind Admin 实现 Kratos 框架单体轻量化落地"}}],["/posts/gowind-admin-vue-crud-best-practice.html",{loader:()=>i(()=>import("./gowind-admin-vue-crud-best-practice.html-DPPeGCzR.js"),[]),meta:{_blog:{title:"拒绝过度封装！GoWind Admin：基于Element Plus重塑中后台CRUD开发范式",author:"",date:"2026-05-28T00:00:00.000Z",category:["GoWind风行"],tag:["Vue3","GoWind"],excerpt:`
<h2>前言：为什么越来越多人厌倦传统Admin脚手架？</h2>
<p>在 Golang + Vue 中后台开发领域，成熟一体化脚手架早已成为企业项目开发的首选方案。标准化脚手架能够完成项目初始化、权限封装、基础页面搭建等重复性工作，大幅提升项目落地速度。但在实际业务迭代过程中，不少开发者都会遇到同一个普遍性痛点：<strong>部分脚手架过度封装底层组件，固化编码范式，变相约束开发者的编码自由度</strong>。</p>
<p>这类脚手架为了统一团队编码规范、降低入门门槛，对页面布局、请求逻辑、弹窗交互、表格渲染等底层能力做深层次封装。该方案对简单标准化CRUD页面十分友好，但适配复杂企业级业务时，弊端会逐步凸显：</p>`},title:"拒绝过度封装！GoWind Admin：基于Element Plus重塑中后台CRUD开发范式"}}],["/posts/gowind-backend-permission-architecture-vue3-react.html",{loader:()=>i(()=>import("./gowind-backend-permission-architecture-vue3-react.html-CbcHUlSR.js"),[]),meta:{_blog:{title:"吃透后台权限系统：从架构设计到 Vue3/React 双框架完整落地",author:"",date:"2026-05-28T00:00:00.000Z",category:["GoWind风行"],tag:["React","Vue3","GoWind"],excerpt:`
<h2>前言</h2>
<p>权限模块是企业级中后台系统的基础设施，也是前端工程化进阶必备知识点。当前市面上绝大多数权限教程普遍存在两个痛点：仅讲解表层API调用，缺少顶层架构思维；Vue、React两套实现方案割裂，无法复用。</p>
<p>从工程化角度来讲，<strong>权限本质与UI框架无关</strong>。无论Vue3还是React，权限的数据模型、鉴权逻辑、执行链路完全一致。</p>
<p>本文立足于企业级项目标准，拆解通用权限架构，同时提供<strong>Vue3 + React</strong>双框架生产级落地代码，统一路由/菜单/页面/按钮四级权限，适配前端静态、后端动态两种模式，帮助开发者搭建标准化、可复用的权限体系。</p>`},title:"吃透后台权限系统：从架构设计到 Vue3/React 双框架完整落地"}}],["/posts/gowind-cms-core-bff-architecture.html",{loader:()=>i(()=>import("./gowind-cms-core-bff-architecture.html-C9PmoCzB.js"),[]),meta:{_blog:{title:"单体项目如何“无感”演进微服务？GoWind的Core+BFF分层实践",author:"",date:"2026-05-18T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>很多技术团队的微服务改造都陷入两难：<strong>单体架构臃肿难维护，但全量拆微服务风险高、工期长、上线易崩</strong>。绝大多数从单体转型的开发者，都害怕“为了架构升级而重构”，导致业务停摆、Bug激增、迭代停滞。</p>
<p>行业内普遍存在一个误区：微服务 = 彻底拆分、全量重构、多服务乱堆砌。而 GoWind 风行 CMS 给出了一套<strong>低风险、无感演进</strong>的落地答案：<strong>不推翻单体、不一次性大重构，通过 Core 核心下沉 + 双 BFF 分层剥离，实现单体架构平滑、无感升级为企业级微服务内容中台</strong>。</p>
<p>本文结合 GoWind 真实架构实践，讲透单体项目如何零感知、低风险演进微服务，拆解 <strong>Core + Admin BFF + App BFF</strong> 分层架构的核心价值、底层通信原理、代码规范与落地优势，彻底解决单体转微服务的转型焦虑。</p>`},title:"单体项目如何“无感”演进微服务？GoWind的Core+BFF分层实践"}}],["/posts/gowind-headless-golang-enterprise-admin.html",{loader:()=>i(()=>import("./gowind-headless-golang-enterprise-admin.html-D0T1iKDr.js"),[]),meta:{_blog:{title:"Headless 后端实践：基于Go的企业级多栈管理系统脚手架",author:"",date:"2026-05-31T00:00:00.000Z",category:["GoWind风行"],tag:["Vue3","React","Protobuf","GoWind"],excerpt:`
<h2>一、前言</h2>
<p>在企业级中后台系统、SaaS平台以及内部运维平台的开发过程中，架构选型直接决定项目的扩展性、维护成本与迭代效率。传统MVC单体架构长期存在视图与业务高度耦合、前端技术栈绑定僵化、无法适配多终端业务等痛点；而原生Headless架构虽解决了解耦问题，但仅提供基础API能力，团队仍需从零完成前端工程搭建、权限封装、页面开发，大幅抬高项目落地门槛。</p>
<p>基于此，行业内逐渐衍生出一种新型开发方案：<strong>纯Headless API服务 + 多套可选前端模板</strong>。该方案既坚守无头架构前后端解耦的核心特性，又通过预制主流技术栈前端模板，补齐纯无头架构落地效率低的短板。本文将详细拆解这套以Go语言为底层底座的企业级开发方案，从架构原理、技术构成、核心优势到实操教程，全方位解析该方案的应用价值。</p>`},title:"Headless 后端实践：基于Go的企业级多栈管理系统脚手架"}}],["/posts/gowind-unified-paradigm-standardized-admin-api.html",{loader:()=>i(()=>import("./gowind-unified-paradigm-standardized-admin-api.html-4UBqStdG.js"),[]),meta:{_blog:{title:"统一范式：中后台Admin项目标准化API分层开发方案（Vue/React通用）",author:"",date:"2026-05-28T00:00:00.000Z",category:["GoWind风行"],tag:["Vue3","React","Protobuf","GoWind"],excerpt:`
<h2>前言</h2>
<p>在中后台Admin系统开发过程中，API层开发是所有业务功能的基石，用户列表、权限配置、字典管理、审计日志、文件上传等几乎所有后台业务，都离不开前后端接口的数据交互。</p>
<p>在传统的开发模式中，团队往往存在诸多痛点：接口调用方式混乱、数据缓存无统一方案、组件与非组件环境调用逻辑割裂、重复编写请求与TS类型、Vue与React技术栈开发规范不统一、新增业务模块无固定标准。不仅拉高新人上手成本，还极易产生冗余代码、隐性BUG，严重影响迭代效率。</p>
<p>为解决以上问题，我们基于<strong>Axios（底层请求）+ **<strong>TanStack Query</strong>（原React Query/Vue Query，异步状态管理）、TypeScript强类型约束，结合gRPC后端接口体系，设计了一套</strong>三层分层API架构**。该架构完美适配Vue、React双技术栈，统一中后台项目API开发规范，分离网络请求、缓存管理、业务逻辑、UI渲染的职责，实现类型全覆盖、调用方式标准化、业务开发轻量化，下文将完整介绍这套框架的设计理念、分层逻辑、使用方式与开发规范。</p>`},title:"统一范式：中后台Admin项目标准化API分层开发方案（Vue/React通用）"}}],["/posts/headless_cms.html",{loader:()=>i(()=>import("./headless_cms.html-C0gLIT9l.js"),[]),meta:{_blog:{title:"无头内容管理系统 Headless CMS",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Headless CMS"],excerpt:`
<h2>什么是 Headless CMS？</h2>
<p>Headless CMS 是一种 <strong>内容管理系统（Content Management System）</strong>，它将<code>【头部Head】表示层（内容呈现的地方）</code>与【身体Body】<code>后端（内容管理的地方）</code>分离开来。即，把表示层和后端信息层分离开了。</p>
<p>这样，我们可以根据需要在 Web、移动和数字媒体平台上重复使用和重新混合内容。您甚至可以在印刷品中重复使用您的内容。</p>
<p>与格式无关的内容为所有参与者（作者、开发人员和用户）提供了变革性的体验。</p>`},title:"无头内容管理系统 Headless CMS"}}],["/posts/how_to_compile_cpp_to_wasm.html",{loader:()=>i(()=>import("./how_to_compile_cpp_to_wasm.html-BR2vQ8-x.js"),[]),meta:{_blog:{title:"怎样把C++代码编译成WASM",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","WASM"],excerpt:`
`},title:"怎样把C++代码编译成WASM"}}],["/posts/how_to_complie_and_install_extension_in_postgresql_containor.html",{loader:()=>i(()=>import("./how_to_complie_and_install_extension_in_postgresql_containor.html-C06Ha9jn.js"),[]),meta:{_blog:{title:"怎样编译PostgreSQL扩展并安装到容器中去",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","PostgreSQL"],excerpt:`
<p>通常PostgreSQL容器当中会内置一些扩展，一般存放在：<code>/usr/lib/postgresql/{PostgreSQL版本号}/lib</code>，扩展的实体都是<code>.so</code>文件，如果容器当中存在着扩展的so文件，那么就可以顺利的通过SQL语句进行安装，否则，则不能够顺利的安装，这时候，就需要编译扩展并拷贝进容器。</p>
<p>https://yum.postgresql.org/repopackages/</p>
`},title:"怎样编译PostgreSQL扩展并安装到容器中去"}}],["/posts/how_to_dockerize_a_go_application.html",{loader:()=>i(()=>import("./how_to_dockerize_a_go_application.html-DxCAv0FS.js"),[]),meta:{_blog:{title:"如何 Docker 化一个 GO 应用程序",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","Go"],excerpt:`
<p>使用 Golang，可以构建小到简单的可执行工具大到完整的 Web 服务器的任何东西。为了交付应用程序，使用 Docker 是首选，它允许我们创建一个包含项目运行所需的一切的自包含环境。值得一提的是，Docker 命令行界面本身也是使用 GO 所开发。</p>
<h2>为任何 GO 应用程序编写 Docker 镜像</h2>
<p>通常，从一个尽可能小且具有所需基本依赖项的基本镜像开始，是一个好主意。alpine 镜像通常是一个可靠的选择，因为它们仅包含操作系统所需的最低限度。</p>
<p>所以，我们可以这样写 <code>Dockerfile</code>：</p>
<div class="language-docker line-numbers-mode" data-highlighter="prismjs" data-ext="docker"><pre><code><span class="line"><span class="token instruction"><span class="token keyword">FROM</span> golang:alpine3.15</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"如何 Docker 化一个 GO 应用程序"}}],["/posts/how_to_generate_rand_seed_for_golang.html",{loader:()=>i(()=>import("./how_to_generate_rand_seed_for_golang.html-BaieoUbz.js"),[]),meta:{_blog:{title:"怎样在Go语言中生成随机种子",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","随机种子"],excerpt:`
<h2>time.Now().UnixNano</h2>
<p>这是用的最多的，但是，也是安全隐患最大的方法。</p>
<p>从表面上看go的时间方法最大精度到纳秒，但是好像其实并不能到达的绝对的纳秒精度。</p>
<p>测试结果很不好，碰撞很高。</p>
<div class="language-go line-numbers-mode" data-highlighter="prismjs" data-ext="go"><pre><code><span class="line"><span class="token keyword">import</span> <span class="token string">"time"</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">func</span> <span class="token function">TestSeedNanoTime</span><span class="token punctuation">(</span>t <span class="token operator">*</span>testing<span class="token punctuation">.</span>T<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">	<span class="token keyword">var</span> seeds <span class="token operator">=</span> <span class="token function">make</span><span class="token punctuation">(</span><span class="token keyword">map</span><span class="token punctuation">[</span><span class="token builtin">int64</span><span class="token punctuation">]</span><span class="token builtin">bool</span><span class="token punctuation">)</span></span>
<span class="line">	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100000</span><span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span></span>
<span class="line">		seed <span class="token operator">:=</span> time<span class="token punctuation">.</span><span class="token function">Now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">UnixNano</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">		seeds<span class="token punctuation">[</span>seed<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token boolean">true</span></span>
<span class="line">		fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span>seed<span class="token punctuation">)</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line">	fmt<span class="token punctuation">.</span><span class="token function">Println</span><span class="token punctuation">(</span><span class="token function">len</span><span class="token punctuation">(</span>seeds<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"怎样在Go语言中生成随机种子"}}],["/posts/how_to_install_flutter_on_macos.html",{loader:()=>i(()=>import("./how_to_install_flutter_on_macos.html-lo-sJ64Z.js"),[]),meta:{_blog:{title:"如何在MacOS下安装Flutter开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter","MacOS"],excerpt:`
<p>通过Google推出的Flutter framework，我们可以更为方便的开发跨平台APP，开发出来的APP能够在iOS、Android、Web、macOS、Windows和Linux上都可以执行。</p>
<p>在开发 Flutter App 之前，我们必须要先准备好开发环境，下面我将介绍如何在Mac环境下从零开始Flutter App的开发环境。</p>
<ul>
<li>安装Xcode；</li>
<li>安装Android Studio；</li>
<li>安装VS Code；</li>
<li>安装CocoaPods；</li>
</ul>
<h2>安装Xcode</h2>`},title:"如何在MacOS下安装Flutter开发环境"}}],["/posts/how_to_install_gcc_on_ubuntu.html",{loader:()=>i(()=>import("./how_to_install_gcc_on_ubuntu.html-4UqUTK_3.js"),[]),meta:{_blog:{title:"怎样在Ubuntu下面安装GCC",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Ubuntu","GCC"],excerpt:`
<h2>获取系统版本信息</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">lsb_release <span class="token parameter variable">-a</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"怎样在Ubuntu下面安装GCC"}}],["/posts/how_to_install_godot_4_on_a_mac.html",{loader:()=>i(()=>import("./how_to_install_godot_4_on_a_mac.html-B6KQlFzw.js"),[]),meta:{_blog:{title:"怎样在MacOS下安装游戏引擎Godot 4",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["MacOS","Godot"],excerpt:`
<p>在本文中，我将向您展示如何在 Mac 上安装Godot 4 游戏引擎。</p>
<p>在MacOS下面有两种安装途径可供使用：</p>
<ol>
<li>Godot官网下载软件包安装；</li>
<li>brew安装。</li>
</ol>
<h2>1. Godot官网下载软件包安装</h2>
<h3>步骤 1. 安装 .Net SDK（可选）</h3>
<p>Godot从4.0版本开始支持C#作为其脚本语言。</p>
<p>如果您希望能够使用 C# 编写和构建 Godot 项目，则需要先安装 .Net SDK。</p>
<p>从微软官方下载页面下载并安装：<a href="https://dotnet.microsoft.com/zh-cn/download" target="_blank" rel="noopener noreferrer">https://dotnet.microsoft.com/zh-cn/download</a></p>`},title:"怎样在MacOS下安装游戏引擎Godot 4"}}],["/posts/how_to_install_llvm_on_ubuntu.html",{loader:()=>i(()=>import("./how_to_install_llvm_on_ubuntu.html-BacPrzfJ.js"),[]),meta:{_blog:{title:"怎样在Ubuntu下面安装Clang",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Ubuntu","Clang"],excerpt:`
<p>LLVM项目是一个模块化的、可重用的编译器和工具链集合。尽管它的名字-LLVM与传统虚拟机（low level virtual machine）名字相似。但“LLVM”这个名字本身不是一个缩略词，它就是这个项目的全称。所以，不要再把LLVM叫做low level virtual machine。</p>
<p>LLVM开始于伊利诺斯大学的一个研究项目。目的是提供一个现代的、基于SSA的、能够支持任意静态和动态编译的编程语言的编译策略。此后，LLVM成长为伞项目下的一个子项目。其中许多是被广泛用于各种各样的商业生产和开源代码项目以及学术研究中。LLVM项目源码采用“Apache 2.0许可协议”。</p>`},title:"怎样在Ubuntu下面安装Clang"}}],["/posts/how_to_install_mysql_driver_in_superset_docker_container.html",{loader:()=>i(()=>import("./how_to_install_mysql_driver_in_superset_docker_container.html-D_0wgzr7.js"),[]),meta:{_blog:{title:"如何在 Superset Docker 容器中安装 MySQL 驱动",author:"",date:"2026-04-09T00:00:00.000Z",category:["运维技术"],tag:["Docker","Superset"],excerpt:`
<p>Apache Superset 是一款功能强大的开源数据挖掘与可视化平台，支持多种数据源连接、自定义仪表盘和细粒度权限控制，广泛应用于数据运维与分析场景。由于
Superset 官方 Docker 镜像未默认集成 MySQL 驱动，在实际运维中，需手动安装驱动才能实现与 MySQL 数据库的正常连接。本文将详细介绍两种
Docker 部署方式（Docker run 和 Docker Compose）下，MySQL 驱动的完整安装流程，同时兼顾 Apache Doris
驱动安装（适配多数据源需求），并提供数据库配置方法和常见注意事项。</p>
<h2>一、前置说明</h2>
<p>可能是因为MySQL是使用的GPL协议，所以Superset官方镜像中未包含MySQL驱动，需要手动安装。</p>`},title:"如何在 Superset Docker 容器中安装 MySQL 驱动"}}],["/posts/how_to_install_opencv_on_centos7.html",{loader:()=>i(()=>import("./how_to_install_opencv_on_centos7.html-jeD3_opp.js"),[]),meta:{_blog:{title:"如何在 CentOS 7 上安装 OpenCV",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["CentOS","OpenCV"],excerpt:`
<h2>第 1 步：安装 OpenCV 的依赖项</h2>
<p>使用以下命令安装编译 OpenCV 所需的所有依赖项：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">yum groupinstall <span class="token string">"Development Tools"</span> <span class="token parameter variable">-y</span></span>
<span class="line"></span>
<span class="line">yum <span class="token function">install</span> cmake3 gcc gtk2-devel numpy pkconfig <span class="token parameter variable">-y</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"如何在 CentOS 7 上安装 OpenCV"}}],["/posts/how_to_make_drip_bag_coffee.html",{loader:()=>i(()=>import("./how_to_make_drip_bag_coffee.html-CYPyBS3g.js"),[]),meta:{_blog:{title:"沖咖啡｜咖啡掛耳包更好喝貼士",author:"",date:"2020-01-01T00:00:00.000Z",category:["健康养生"],tag:["咖啡"],excerpt:`
<p>平日冲咖啡挂耳包/滤挂式咖啡时，如果把挂耳包直接挂在杯边，有可能会挂耳会滑落。UCC分享能将挂耳包固定在原位的简单方法。</p>
<h2>冲咖啡挂耳包正确步骤▼▼</h2>
<p><img src="https://tx7do.github.io/assets/images/coffee/how_to_make_drip_bag_coffee_step_1.jpg" alt="冲咖啡挂耳包正确步骤▼▼"></p>
<h3>1. 先将咖啡挂耳包向下轻甩2至3下，让咖啡粉沉底。</h3>
<p><img src="https://tx7do.github.io/assets/images/coffee/how_to_make_drip_bag_coffee_step_2.jpg" alt="先将咖啡挂耳包向下轻甩2至3下，让咖啡粉沉底。"></p>`},title:"沖咖啡｜咖啡掛耳包更好喝貼士"}}],["/posts/how_to_publish_android_app_to_google_play.html",{loader:()=>i(()=>import("./how_to_publish_android_app_to_google_play.html-BbyxPQOB.js"),[]),meta:{_blog:{title:"如何发布Android APP到Google Play",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Android","Google Play"],excerpt:`
<h2>生成签名</h2>
<p>在项目的android目录下执行以下命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">keytool  <span class="token parameter variable">-genkey</span> <span class="token parameter variable">-v</span> <span class="token parameter variable">-keystore</span> ./app_key.jks <span class="token parameter variable">-keyalg</span> RSA <span class="token parameter variable">-keysize</span> <span class="token number">4096</span> <span class="token parameter variable">-validity</span> <span class="token number">10000</span> <span class="token parameter variable">-alias</span> flutter_key</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"如何发布Android APP到Google Play"}}],["/posts/how_to_unpack_unitywebdata1_0_in_unity_webgl_games.html",{loader:()=>i(()=>import("./how_to_unpack_unitywebdata1_0_in_unity_webgl_games.html-Lbg84WRb.js"),[]),meta:{_blog:{title:"如何解压Unity WebGL游戏的UnityWebData1.0资源包",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Unity WebGL"],excerpt:`
<h2>什么是 UnityWebData</h2>
<p>UnityWebData 文件是在 WebGL 游戏中与 WebAssembly 文件一起加载和使用的文件，主要是组合所有资产(Asset)、资源(Resource)和元数据(Meta)文件的文件。</p>
<p><img src="/assets/images/unity/unity_webdata_file_struct_image.png" alt="UnityWebData"></p>
<h2>UnityWebData的结构体</h2>
<p>本节介绍基于UnityWebData1.0的二进制文件的结构进行介绍。</p>
<p>需要注意：int值必须以Little Endian方式读取。</p>`},title:"如何解压Unity WebGL游戏的UnityWebData1.0资源包"}}],["/posts/how_to_use_dexie_with_typescript.html",{loader:()=>i(()=>import("./how_to_use_dexie_with_typescript.html-rEWrVn-k.js"),[]),meta:{_blog:{title:"使用Dexie操作前端数据库IndexedDB 教程",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Dexie","IndexedDB"],excerpt:`
<p>Dexie.js 是对前端本地数据库 IndexedDB 的 API 进行封装的轻量级库，它简化了 IndexedDB 复杂的原生操作，提供了更简洁、直观的语法，便于开发者快速实现前端本地数据的持久化存储。</p>
<h2>一、为什么选择 IndexedDB？</h2>
<p>前端常见的本地存储方案（Cookie、LocalStorage、SessionStorage）均存在存储容量限制，无法满足大数据量的存储需求。IndexedDB 作为浏览器原生的本地数据库，具备大容量存储优势，具体对比如下：</p>
<ul>
<li>Cookie：存储容量不超过 4KB，主要用于存储会话标识等少量信息；</li>
<li>LocalStorage：存储容量介于 2.5MB ~ 10MB 之间，仅支持字符串存储；</li>
<li>SessionStorage：存储容量与 LocalStorage 相当，但仅在当前会话有效，页面关闭后数据丢失；</li>
<li>IndexedDB：存储容量不低于 250MB，支持占用本地磁盘空间的 50%，可存储大量结构化数据，支持事务、索引等数据库核心特性。</li>
</ul>`},title:"使用Dexie操作前端数据库IndexedDB 教程"}}],["/posts/how_to_use_make_golang_app_in_windows.html",{loader:()=>i(()=>import("./how_to_use_make_golang_app_in_windows.html-B7KOmqcX.js"),[]),meta:{_blog:{title:"怎么样在Windows下使用Make编译Golang程序",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Make"],excerpt:`
<p>GNU的Make是一个又古老又强大的构建工具，在我们的开发当中用得普遍。就Makefile的语法而言也不算复杂，没有特别复杂的需求的话，很容易就上手了，维护起来也容易，拿Make来做程序构建是一个好主意。</p>
<p>更复杂一点的项目构建可以选择Google的<a href="https://bazel.build/" target="_blank" rel="noopener noreferrer">Bazel</a>，但是通常的项目(至少70%-80%的项目)都没有这么复杂的需求。</p>
<p>在Unix、Linux、BSD、macOS等xNix下面使用Make是很方便的，很自然的，因为是出厂自带。</p>`},title:"怎么样在Windows下使用Make编译Golang程序"}}],["/posts/htop_desc.html",{loader:()=>i(()=>import("./htop_desc.html-ltfiP4Il.js"),[]),meta:{_blog:{title:"你一定用过htop，但你有看懂每个选项吗？",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["htop"],excerpt:`
<p><img src="/assets/images/htop/main.webp" alt="main.webp"></p>
<p>身为一个工程师，不管你写的是前端、后端、全端还是什么端，一定多少用过htop，就算真的没用过也会听同事说过。htop 是一个process manager，他可以让你看到执行中的process、系统资源的使用量，也可以让你轻松kill 掉任何一个process，总之，你想得到的功能统统都有～</p>
<p>虽然，大家都说htop 很好用，但许多人打开htop 也只看得懂CPU、Mem、PID、Command 这些简单的选项，对于Load average、NI、State、SHR 就没那么熟悉。</p>`},title:"你一定用过htop，但你有看懂每个选项吗？"}}],["/posts/im_system_design.html",{loader:()=>i(()=>import("./im_system_design.html-CEDc9MTL.js"),[]),meta:{_blog:{title:"大群组IM设计",author:"",date:"2020-01-01T00:00:00.000Z",category:["架构设计"],tag:["IM"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://www.infoq.cn/article/the-road-of-the-growth-weixin-background" target="_blank" rel="noopener noreferrer">从无到有：微信后台系统的演进之路</a></li>
<li><a href="https://doc.yunxin.163.com/messaging-enhanced/guide/TY3MzM1ODg?platform=web" target="_blank" rel="noopener noreferrer">网易云信 - 超大群概述</a></li>
<li><a href="https://cloud.tencent.com/developer/article/1869748" target="_blank" rel="noopener noreferrer">IM技术分享：万人群聊消息投递方案的思考和实践</a></li>
<li><a href="http://www.52im.net/thread-1230-1-1.html" target="_blank" rel="noopener noreferrer">现代IM系统中聊天消息的同步和存储方案探讨</a></li>
</ul>`},title:"大群组IM设计"}}],["/posts/install_extensions_in_postgres_docker_container.html",{loader:()=>i(()=>import("./install_extensions_in_postgres_docker_container.html-CSaN0KPb.js"),[]),meta:{_blog:{title:"在 Postgres Docker 容器中安装扩展",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Postgresql","Docker"],excerpt:`
<p>最近，我想使用 Fluent 迁移器来为我的 postgres 数据库做种，该数据库作为 Docker 容器运行。我基本上有一个表 User，它有一个需要自动生成的 UUID 类型的主键。</p>
<p>我的迁移代码如下所示。</p>
<div class="language-csharp line-numbers-mode" data-highlighter="prismjs" data-ext="cs"><pre><code><span class="line">Create<span class="token punctuation">.</span><span class="token function">Table</span><span class="token punctuation">(</span>User<span class="token punctuation">.</span>TABLE_NAME<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span><span class="token function">WithColumn</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AsGuid</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">NotNullable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">WithDefaultValue</span><span class="token punctuation">(</span>SystemMethods<span class="token punctuation">.</span>NewGuid<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">PrimaryKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span><span class="token function">WithColumn</span><span class="token punctuation">(</span><span class="token string">"username"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AsString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">NotNullable</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">.</span><span class="token function">WithColumn</span><span class="token punctuation">(</span><span class="token string">"password"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">AsString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">NotNullable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"在 Postgres Docker 容器中安装扩展"}}],["/posts/install_mattermost_using_docker_compose.html",{loader:()=>i(()=>import("./install_mattermost_using_docker_compose.html-B4fu_dwb.js"),[]),meta:{_blog:{title:"使用 Docker Compose 安装 Mattermost",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Mattermost","Docker"],excerpt:`
<p>本文适合那些正在寻找使用 Docker Compose 安装 Mattermost 的详细且简单的指南的人。</p>
<p><a href="https://mattermost.com/" target="_blank" rel="noopener noreferrer">Mattermost</a>是一种开源、可自托管的在线聊天服务，具有文件共享、搜索和集成功能。它被设计为组织和公司的内部聊天工具，主要将自己定位为 Slack 和 Microsoft Teams 的开源替代品。</p>
<p>💾您可以在<a href="https://github.com/heyValdemar/mattermost-traefik-letsencrypt-docker-compose" target="_blank" rel="noopener noreferrer">GitHub</a>上找到本指南中使用的存储库。</p>`},title:"使用 Docker Compose 安装 Mattermost"}}],["/posts/install_qt_ide.html",{loader:()=>i(()=>import("./install_qt_ide.html-BCZhtPVy.js"),[]),meta:{_blog:{title:"安装QT开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Qt"],excerpt:`
<p>Qt（发音同 “cute”）是一套跨平台的 C++ 应用程序开发框架，由挪威公司 Trolltech（后被诺基亚、Digia 收购，现为 The Qt Company）开发，核心目标是让开发者用 “一次编写，到处运行”（Write Once, Run Everywhere）的方式，高效开发出在不同平台上（Windows、Linux、macOS、Android、iOS、嵌入式系统等）具有一致功能和体验的应用程序。</p>
<p>官方下载网址：<a href="http://download.qt.io/" target="_blank" rel="noopener noreferrer">http://download.qt.io/</a></p>`},title:"安装QT开发环境"}}],["/posts/interesting_english_abbreviations.html",{loader:()=>i(()=>import("./interesting_english_abbreviations.html-Cu5BIUjW.js"),[]),meta:{_blog:{title:"「TL;DR = 太长了，懒得看」：几个很实用，你却不一定知道的网络英文缩写",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["TL;DR"],excerpt:`
<h2>OTP = One True Pairing = 天生一對</h2>
<p>用来表示你认为是天生一对的两个角色。</p>
<p>ex.</p>
<ul>
<li>The Weeknd and Bella Hadid are my OTP. （The Weekend 和Bella Hadid 是我心目中的天生一对。）</li>
</ul>
<h2>DFTBA = Don’t Forget To Be Awesome = 记得要棒棒的！</h2>
<p>通常用在与朋友道别的时候。平常我们可能会祝愿对方有个美好的一天，但比较熟的朋友之间说DFTBA 反而有种戏谑趣味感。</p>
<p>ex.</p>`},title:"「TL;DR = 太长了，懒得看」：几个很实用，你却不一定知道的网络英文缩写"}}],["/posts/iot_and_homekit.html",{loader:()=>i(()=>import("./iot_and_homekit.html-DOODFydu.js"),[]),meta:{_blog:{title:"使用 Swift 和 HomeKit 释放物联网和家庭自动化的力量",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["Swift"],excerpt:`
<p><strong>IoT（物联网）</strong> 是指由物理设备、车辆、家用电器和其他嵌入电子设备、软件、传感器和连接功能的物品组成的互连网络，使这些对象能够连接和交换数据。</p>
<p><strong>HomeKit</strong> 是Apple 的家庭自动化框架，为智能家居设备之间的通信提供了通用平台。它使开发人员能够轻松创建可以从中央位置控制智能家居设备（例如灯、锁、恒温器等）的应用程序。</p>
<p><strong>Swift</strong> 是 Apple Inc. 为 iOS、iPadOS、macOS、watchOS 和 tvOS 开发的一种功能强大的开源编程语言。 Swift 广泛用于为 Apple 平台开发应用程序，并已成为许多开发人员的首选语言。</p>`},title:"使用 Swift 和 HomeKit 释放物联网和家庭自动化的力量"}}],["/posts/javascript_repleace_function.html",{loader:()=>i(()=>import("./javascript_repleace_function.html-DB0ejv3D.js"),[]),meta:{_blog:{title:"Javascript弃用方法的替换方法",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Javascript"],excerpt:`
<p><code>substr</code>替换成<code>slice</code>；</p>
`},title:"Javascript弃用方法的替换方法"}}],["/posts/jetbrains_ide_shortcuts.html",{loader:()=>i(()=>import("./jetbrains_ide_shortcuts.html-enZi14z4.js"),[]),meta:{_blog:{title:"",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["JetBrains","IDE"],excerpt:`<h2>JetBrains IDE 基本快捷键</h2>
<hr>
<h3>导航快捷键</h3>
<table>
<thead>
<tr>
<th>快捷键</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Tab</kbd>（^ <kbd>Tab</kbd>）</td>
<td>切换标签页（还要进行此选择，效率差些）</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>E</kbd>（⌘ E）</td>
<td>查看最近打开的文件</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd>+<kbd>B</kbd> 或 <kbd>Ctrl</kbd>+单击 （⌘ B 或 ⌘ + 单击）</td>
<td>立即跳转到符号的定义</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>B</kbd></td>
<td>立即跳转到符号的实现</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd> （⇧ ⌘ T）</td>
<td>跳转至测试</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>F7</kbd> （⌘ ⌥ F7）</td>
<td>显示用例</td>
</tr>
<tr>
<td><kbd>Shift</kbd> + <kbd>Shift</kbd>（⇧⇧）</td>
<td>快速查找任意内容</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>A</kbd></td>
<td>快速查找并使用编辑器所有功能（必记)</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>N</kbd> （⌘ O）</td>
<td>快速查找类</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> （⌘ ⇧ O）</td>
<td>通过文件名快速查找工程内的文件（必记）</td>
</tr>
<tr>
<td><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>N</kbd> （⌘ ⇧ ⌥ O）</td>
<td>通过一个字符快速查找位置（必记）</td>
</tr>
</tbody>
</table>`},title:""}}],["/posts/js_ts_async_await_use_filereader.html",{loader:()=>i(()=>import("./js_ts_async_await_use_filereader.html-CWQZyFp4.js"),[]),meta:{_blog:{title:"Javascript和Typescript下如何通过 async/await 优雅地使用 FileReader",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Javascript","Typescript"],excerpt:`
<p><code>FileReader</code>的使用机会很多，但是它是异步的，因此很容易出现回调地狱。</p>
<p>我们可以使用async/await特性，它允许我们以同步的方式调用异步代码。</p>
<h2>封装成方法</h2>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre><code><span class="line"><span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">readTextFile</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">file</span><span class="token operator">:</span> File</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> reader <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileReader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    reader<span class="token punctuation">.</span><span class="token function">readAsText</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onload</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">resolve</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">reject</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">readBinaryFile</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">file</span><span class="token operator">:</span> File</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> reader <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileReader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    reader<span class="token punctuation">.</span><span class="token function">readAsArrayBuffer</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onload</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">resolve</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">reject</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">async</span> <span class="token keyword">function</span> <span class="token function">readAsText</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">file</span><span class="token operator">:</span> File</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> reader <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileReader</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    reader<span class="token punctuation">.</span><span class="token function">readAsText</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Promise</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">resolve<span class="token punctuation">,</span> reject</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onload</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">resolve</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>result<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        reader<span class="token punctuation">.</span><span class="token function-variable function">onerror</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">reject</span><span class="token punctuation">(</span>reader<span class="token punctuation">.</span>error<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Javascript和Typescript下如何通过 async/await 优雅地使用 FileReader"}}],["/posts/kratos_api_design_guide.html",{loader:()=>i(()=>import("./kratos_api_design_guide.html-DYxk7ZME.js"),[]),meta:{_blog:{title:"Kratos微服务框架API工程化指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>Kratos的RPC默认使用的是<a href="https://github.com/grpc/grpc" target="_blank" rel="noopener noreferrer">gRPC</a>，与此同时我们还可以通过gRPC的<a href="https://github.com/grpc-ecosystem/grpc-gateway" target="_blank" rel="noopener noreferrer">grpc-gateway</a>功能对RESTfull进行支持。这样，我们就可以同时支持gRPC和REST了。而这一切Kratos都已经封装好，无需知道底层的一切，用就好了。</p>`},title:"Kratos微服务框架API工程化指南"}}],["/posts/kratos_asynq.html",{loader:()=>i(()=>import("./kratos_asynq.html-l6_5xFky.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用分布式计划任务队列Asynq",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>
<p>任务队列的输入是称为<code>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>
<p>在Golang语言里面，我们有像<a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a>和<a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a>这样的类似于<code>Celery</code>的分布式任务队列。</p>`},title:"Golang微服务框架Kratos应用分布式计划任务队列Asynq"}}],["/posts/kratos_auth_authz.html",{loader:()=>i(()=>import("./kratos_auth_authz.html-DEV2xe7A.js"),[]),meta:{_blog:{title:"Kratos微服务框架下的认证和鉴权",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>从单体应用迁移到微服务架构，虽能收获松耦合、可扩展等诸多优势，但也引入了新的安全挑战。微服务通过开放 API 实现服务间通信，与单体应用相比：​</p>
<ul>
<li>攻击面显著扩大：每个独立服务都需单独保障安全性，风险点呈指数级增加​</li>
<li>通信安全性要求更高：API 调用不仅要验证身份，还需保障传输安全与可用性​</li>
</ul>
<p>因此，微服务架构需要一套与单体应用截然不同的安全解决方案，核心聚焦于认证（Authentication） 与鉴权（Authorization） 两大核心能力。</p>
<h2>一、认证与鉴权的核心区别​</h2>
<p><img src="/assets/images/authn_vs_authz.jpg" alt="认证和授权的区别"></p>`},title:"Kratos微服务框架下的认证和鉴权"}}],["/posts/kratos_bazel_build_guide.html",{loader:()=>i(()=>import("./kratos_bazel_build_guide.html-CJ33krg8.js"),[]),meta:{_blog:{title:"使用Bazel构建你的Kratos微服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>Kratos是一个微服务框架，既然是微服务，那么一个工程下肯定会存在不少的服务，一个服务就是一个二进制可执行程序，那么我们将会面对一个问题：如何去构建（Build）这些服务程序。这件事情，通常都交由构建系统去做。我们能够选择的构建系统有很多：Make、CMake、Bazel……那么，我们又该如何选择一个构建系统呢？</p>
<p>项目结构简单，服务少，我们完全可以使用Make来进行构建。要学会使用Make，您需要学会使用Makefile来编写构建脚本，如果整个构建只是组织一些简单的编译命令，那还好，学习和使用都会是简单轻松的事情。</p>
<p>但是，理想很丰满，现实很骨感。在实际的工程实践中，一切都会朝着复杂的方向发展。服务的数量肯定不会少，工程的组织结构也肯定不会简单，那么，构建也就会变得相应的复杂起来，需要编写大量的Makefile，Makefile的复杂度也越来越大了。另外还有，构建环境的搭建问题，持续集成的问题，自动构建的问题，构建时间变长的问题……抱歉，面对这样复杂的工程环境，Make难以满足我们的需求。</p>`},title:"使用Bazel构建你的Kratos微服务"}}],["/posts/kratos_casbin.html",{loader:()=>i(()=>import("./kratos_casbin.html-d5NF5QqA.js"),[]),meta:{_blog:{title:"Kratos微服务框架实现权鉴 - Casbin",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>Casbin（<a href="https://github.com/casbin/casbin" target="_blank" rel="noopener noreferrer">https://github.com/casbin/casbin</a>）是一套访问控制开源库，致力于帮助复杂系统解决权限管理的难题。同时也是一个国产开源项目。Casbin采用了元模型的设计思想，既支持ACL（访问控制列表），RBAC（基于角色访问控制），ABAC（基于属性访问控制）等经典的访问控制模型，也支持用户按照自身需求灵活定义权限。Casbin已经被Intel、IBM、腾讯云、VMware、RedHat、T-Mobile等公司开源使用，被Cisco、Verizon等公司闭源使用。具体详见Casbin主页（<a href="https://casbin.org/" target="_blank" rel="noopener noreferrer">https://casbin.org/</a>）。</p>`},title:"Kratos微服务框架实现权鉴 - Casbin"}}],["/posts/kratos_cfg.html",{loader:()=>i(()=>import("./kratos_cfg.html-DL7r0yuB.js"),[]),meta:{_blog:{title:"Kratos 微服务轻松对接 CFG 日志系统",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<ul>
<li><a href="https://clickhouse.com/" target="_blank" rel="noopener noreferrer">ClickHouse</a></li>
<li><a href="https://fluentbit.io/" target="_blank" rel="noopener noreferrer">Fluent Bit</a></li>
<li><a href="https://grafana.com/" target="_blank" rel="noopener noreferrer">Grafana</a></li>
</ul>`},title:"Kratos 微服务轻松对接 CFG 日志系统"}}],["/posts/kratos_cms.html",{loader:()=>i(()=>import("./kratos_cms.html-DpAesH_E.js"),[]),meta:{_blog:{title:"跟我一起用Golang微服务框架实现一个CMS系统",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>微服务，是一种分布式软件架构。采用了分而治之的方法去解决复杂的应用问题。我们可以把复杂的系统拆解成不同的服务，并使之可以方便的进行横向扩容，提升整个系统的负载。</p>
<p>任何一个系统，它都需要一个管理系统，即便是使用微服务的架构也是需要的。在本文里，我们将使用<a href="https://www.bilibili.com/" target="_blank" rel="noopener noreferrer">B站</a>开源的<a href="https://go.dev/" target="_blank" rel="noopener noreferrer">Golang</a>语言微服务框架<a href="https://go-kratos.dev/en/" target="_blank" rel="noopener noreferrer">Kratos</a>去实现一个最简单的CMS：博客系统。</p>`},title:"跟我一起用Golang微服务框架实现一个CMS系统"}}],["/posts/kratos_cqrs.html",{loader:()=>i(()=>import("./kratos_cqrs.html-CcyfnLbR.js"),[]),meta:{_blog:{title:"Kratos微服务框架下实现CQRS架构模式",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p><strong>命令查询的责任分离Command Query Responsibility Segregation</strong> 通常被简化为 <strong>命令查询分离</strong>，即读写分离。</p>
<p>在特定的场景下，它可以提供更好的性能。但是，在强一致性方面，它并不能够保证。而且，还会带来认知负担。所以，实际运用上，需要谨慎。</p>
<h2>什么是 CQRS</h2>
<p>这个概念出自于 <strong>命令与查询分离（CQS, Command Query Separation）</strong>，出自于1987 年 Bertrand Meyer 的 《面向对象软件构造》(Object-Oriented Software Construction)一书，其原始概念是我们可以把对象操作分为：命令（Command）和 查询（Query）两种形式。</p>`},title:"Kratos微服务框架下实现CQRS架构模式"}}],["/posts/kratos_efk.html",{loader:()=>i(()=>import("./kratos_efk.html-DyXX1yGb.js"),[]),meta:{_blog:{title:"Kratos微服务轻松对接EFK日志系统",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>在早期的单体服务时代，如果想要在生产环境中通过日志去定位业务逻辑的Bug或者性能问题，那么我们需要让运维人员逐个远程登入服务器，逐个服务实例去查询日志文件，这样排查问题的效率是相当的低，当线上发生了紧急状况的时候，人都要急死，却又无法有效率的排查出问题所在，更不用说解决问题。</p>
<p>而在微服务时代，服务实例部署在不同的物理机上，各个微服务的日志也被分散储存在不同的物理机上。当服务集群足够大，成百上千，甚至上万，此时再使用上述的传统方式查阅日志，那已经是不可完成的任务。因此，我们需要集中化管理分布式系统中的日志，其中有开源的组件如Syslog，用于将所有服务器上的所有服务的日志进行收集、汇总。</p>`},title:"Kratos微服务轻松对接EFK日志系统"}}],["/posts/kratos_faq.html",{loader:()=>i(()=>import("./kratos_faq.html-D4q25T9y.js"),[]),meta:{_blog:{title:"Kratos微服务框架常见问题解答",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>为什么Protobuf定义成int64，转成json之后却变成了string类型？</h2>
<p>比如说，定义了一个proto文件</p>
<div class="language-protobuf line-numbers-mode" data-highlighter="prismjs" data-ext="protobuf"><pre><code><span class="line"><span class="token keyword">message</span> <span class="token class-name">PartyMusicSearchItem</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token builtin">string</span> name <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int32</span>  fileSize <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> author <span class="token operator">=</span> <span class="token number">3</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">string</span> musicId <span class="token operator">=</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int32</span> type <span class="token operator">=</span> <span class="token number">6</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int64</span> createdAt <span class="token operator">=</span> <span class="token number">7</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token builtin">int64</span> lastTime <span class="token operator">=</span> <span class="token number">8</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Kratos微服务框架常见问题解答"}}],["/posts/kratos_field_mask.html",{loader:()=>i(()=>import("./kratos_field_mask.html-CwYm6UOM.js"),[]),meta:{_blog:{title:"Kratos 下使用 Protobuf FieldMask 完全指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>当我们使用 gRPC 进行跨服务通讯时，调用方往往只需要响应中的部分字段 —— 冗余字段不仅会增加网络传输成本，更可能触发不必要的下游依赖调用（比如为了返回一个非核心字段，需要额外调用 2 个服务）。​</p>
<p>在微服务场景中，这种「无效计算 + 无效传输」的开销会被放大：一次 RPC 级联 3~5 个下游是常态，而响应体中 60% 以上的字段可能都是调用方不需要的。​</p>
<p>此时，我们需要一种「字段按需筛选」机制：</p>
<ul>
<li><code>GraphQL</code> 用「字段选择器」实现​</li>
<li><code>JSON:API</code> 用「稀疏字段集」实现​</li>
<li>而 gRPC 生态中，<code>Protobuf FieldMask</code> 是标准且高效的解决方案。</li>
</ul>`},title:"Kratos 下使用 Protobuf FieldMask 完全指南"}}],["/posts/kratos_friend_dtm.html",{loader:()=>i(()=>import("./kratos_friend_dtm.html-CbGfNrtt.js"),[]),meta:{_blog:{title:"Golang微服框架Kratos与它的小伙伴系列 - 分布式事务框架 - DTM",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>在 GO 语言生态中，<strong>DTM（Distributed Transaction Manager）</strong>
是一个开源的分布式事务管理服务，专门用于解决微服务架构下分布式事务的一致性问题。它以轻量、易用、高性能为特点，支持多种分布式事务模式，是
GO 语言开发者在处理跨服务数据一致性时的常用工具。</p>
<h2>DTM 的核心功能与特点</h2>
<h3>1. 支持多种事务模式</h3>
<p>DTM 针对不同业务场景，实现了主流的分布式事务协议，包括：</p>
<ul>
<li><strong>TCC（Try-Confirm-Cancel）</strong>：适用于核心业务场景，通过拆分业务为 “<code>尝试</code>”、“<code>确认</code>”、“<code>取消</code>” 三个阶段，保证最终一致性。</li>
<li><strong>SAGA</strong>：适用于长事务场景，将分布式事务拆分为多个本地事务步骤，每个步骤对应一个补偿操作，若某步失败则执行反向补偿。</li>
<li><strong>本地消息表（Local Message Table）</strong>：基于消息的异步确认机制，通过本地事务与消息发送的原子性，确保跨服务操作的最终一致。</li>
<li><strong>事务消息</strong>：结合消息队列实现，通过 “半消息”、“确认发送”、“消费确认” 等机制，保证消息可靠投递与业务操作的一致性。</li>
<li><strong>XA</strong>：基于数据库的 XA 协议（如 MySQL 的 XA 事务），适用于对强一致性要求高且支持 XA 协议的数据库场景。</li>
</ul>`},title:"Golang微服框架Kratos与它的小伙伴系列 - 分布式事务框架 - DTM"}}],["/posts/kratos_friend_ent.html",{loader:()=>i(()=>import("./kratos_friend_ent.html-pIkPGp-a.js"),[]),meta:{_blog:{title:"Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - Ent",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是ORM？</h2>
<p>面向对象编程和关系型数据库，都是目前最流行的技术，但是它们的模型是不一样的。</p>
<p>面向对象编程把所有实体看成对象（object），关系型数据库则是采用实体之间的关系（relation）连接数据。很早就有人提出，关系也可以用对象表达，这样的话，就能使用面向对象编程，来操作关系型数据库。</p>
<p>简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping） 的缩写。</p>
<p>ORM 把数据库映射成对象。</p>
<ul>
<li>数据库的表（table） --&gt; 类（class）</li>
<li>记录（record，行数据）--&gt; 对象（object）</li>
<li>字段（field）--&gt; 对象的属性（attribute）</li>
</ul>`},title:"Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - Ent"}}],["/posts/kratos_friend_gorm.html",{loader:()=>i(()=>import("./kratos_friend_gorm.html-BPOD6UTm.js"),[]),meta:{_blog:{title:"Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - GORM",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是ORM？</h2>
<p>面向对象编程和关系型数据库，都是目前最流行的技术，但是它们的模型是不一样的。</p>
<p>面向对象编程把所有实体看成对象（object），关系型数据库则是采用实体之间的关系（relation）连接数据。很早就有人提出，关系也可以用对象表达，这样的话，就能使用面向对象编程，来操作关系型数据库。</p>
<p>简单说，ORM 就是通过实例对象的语法，完成关系型数据库的操作的技术，是"对象-关系映射"（Object/Relational Mapping） 的缩写。</p>
<p>ORM 把数据库映射成对象。</p>
<ul>
<li>数据库的表（table） --&gt; 类（class）</li>
<li>记录（record，行数据）--&gt; 对象（object）</li>
<li>字段（field）--&gt; 对象的属性（attribute）</li>
</ul>`},title:"Golang微服框架Kratos与它的小伙伴系列 - ORM框架 - GORM"}}],["/posts/kratos_friend_wire.html",{loader:()=>i(()=>import("./kratos_friend_wire.html-DCRbsT37.js"),[]),meta:{_blog:{title:"Kratos微服务与它的小伙伴系列 - 依赖注入库 - Wire",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是依赖注入？</h2>
<p>依赖注入 (Dependency Injection，缩写为 DI)，是一种软件设计模式，也是实现控制反转(Inversion of Control)的其中一种技术。这种模式能让一个物件接收它所依赖的其他物件。“依赖”是指接收方所需的对象。“注入”是指将“依赖”传递给接收方的过程。在“注入”之后，接收方才会调用该“依赖”。此模式确保了任何想要使用给定服务的物件不需要知道如何建立这些服务。取而代之的是，连接收方物件（像是 client）也不知道它存在的外部代码（注入器）提供接收方所需的服务。</p>
<p>依赖注入涉及四个概念：</p>
<ol>
<li>服务：任何类，提供了有用功能。</li>
<li>客户：使用服务的类。</li>
<li>接口：客户不应该知道服务实现的细节，只需要知道服务的名称和 API。</li>
<li>注入器：Injector，也称 assembler、container、provider 或 factory。负责把服务引入给客户。
依赖注入把对象构建与对象注入分开。因此创建对象的 new 关键字也可消失了。</li>
</ol>`},title:"Kratos微服务与它的小伙伴系列 - 依赖注入库 - Wire"}}],["/posts/kratos_graphql.html",{loader:()=>i(()=>import("./kratos_graphql.html-_bae2oSQ.js"),[]),meta:{_blog:{title:"golang微服务框架Kratos实现GraphQL服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>GraphQL 是一种用于应用编程接口（API）的查询语言和服务器端运行时，它可以使客户端准确地获得所需的数据，没有任何冗余。</p>
<p>GraphQL 由 Facebook 开发，并于 2012 年首次应用于移动应用。GraphQL 规范于 2015 年实现开源。现在，它受 GraphQL 基金会监管。</p>
<h2>GraphQL有什么用？</h2>
<p>GraphQL 旨在让 API 变得快速、灵活并且为开发人员提供便利。它甚至可以部署在名为 GraphiQL 的集成开发环境（IDE）中。作为 REST 的替代方案，GraphQL 允许开发人员构建相应的请求，从而通过单个 API 调用从多个数据源中提取数据。</p>`},title:"golang微服务框架Kratos实现GraphQL服务"}}],["/posts/kratos_hotpot.html",{loader:()=>i(()=>import("./kratos_hotpot.html-BDJHNRR2.js"),[]),meta:{_blog:{title:"Kratos 大乱炖 —— 整合其他Web框架：Gin、FastHttp、Hertz",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>Kratos默认的RPC框架使用的是gRPC，支持REST和protobuf两种通讯协议。其API都是使用protobuf定义的，REST协议是通过<a href="https://github.com/grpc-ecosystem/grpc-gateway" target="_blank" rel="noopener noreferrer">grpc-gateway</a>转译实现的。使用protobuf定义API是具有极大优点的，具有很强的可读性、可维护性，以及工程性。工程再大，人员再多，也不会乱。</p>
<p>一切看起来都是很美好的。那么，问题来了，我们现在使用的是其他的Web框架，迁移就会有成本，有风险，不可能一下子就把历史存在的代码一口气转换过来到Kratos框架。那我可以在Kratos中整合其他的Web框架做过渡吗？答案是：可以的。Kratos是基于的插件化设计，万物皆可插。</p>`},title:"Kratos 大乱炖 —— 整合其他Web框架：Gin、FastHttp、Hertz"}}],["/posts/kratos_hptimer_cron.html",{loader:()=>i(()=>import("./kratos_hptimer_cron.html-Doh7zkfx.js"),[]),meta:{_blog:{title:"Kratos 生态双定时器中间件：高精度 hptimer 与标准 cron 选型与实践",author:"",date:"2026-05-17T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>前言</h2>
<p>在基于 Go 语言的 Kratos 微服务架构开发中，定时任务是<strong>后台数据清理、报表统计、消息推送、心跳检测、超时管控</strong>等业务场景的基础能力。</p>
<p>kratos-transport 生态内置了两款定位互补、风格统一的定时器中间件：</p>
<ul>
<li>
<p><code>hptimer</code>：<strong>毫秒级高精度定时器</strong></p>
</li>
<li>
<p><code>cron</code>：<strong>标准秒级周期定时器</strong></p>
</li>
</ul>
<p>二者均遵循 Kratos <code>transport.Server</code> 标准规范，无缝适配框架生命周期，同时覆盖<strong>毫秒级高频调度</strong>与<strong>秒级常规周期任务</strong>两大场景。本文完整解析设计原理、特性差异、代码实践、性能表现与业务选型。</p>`},title:"Kratos 生态双定时器中间件：高精度 hptimer 与标准 cron 选型与实践"}}],["/posts/kratos_iot_realtime_map.html",{loader:()=>i(()=>import("./kratos_iot_realtime_map.html-D9SyCdRu.js"),[]),meta:{_blog:{title:"Kratos微服务框架物联网IoT实战：设备实时地图",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>IoT，也就是物联网，万物互联，在未来肯定是一个热点——实际上，现在物联网已经很热了。</p>
<p>那好，既然这一块这么有前途。那我们就来学习怎么开发物联网系统吧。可是，作为一个小白，两眼一抹黑：我想学，可是我该如何开始？这玩意儿到底该咋整呢？</p>
<p>于是，我各种找资料，各种学习——此处省略一亿个字，其中的艰辛，其中的曲折，总之就是：说来都是泪，欲哭却无声——总算是有了基础的认知，有了一个模糊的方向。我知道了物联网设备通讯协议MQTT、CoAP、LwM2M，知道了微服务，知道了MQ，知道了Websocket，知道了REST，知道了gRPC……有了这些认知，看起来可以开始做技术选型了。</p>`},title:"Kratos微服务框架物联网IoT实战：设备实时地图"}}],["/posts/kratos_kafka.html",{loader:()=>i(()=>import("./kratos_kafka.html-C4JTr97v.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用Kafka消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是Kafka？怎样在微服务框架Kratos当中应用Kafka进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>`},title:"Golang微服务框架Kratos应用Kafka消息队列"}}],["/posts/kratos_kcp.html",{loader:()=>i(()=>import("./kratos_kcp.html-CMYz6wKV.js"),[]),meta:{_blog:{title:"Kratos KCP 传输中间件：游戏开发低延迟网络通信实战指南",author:"",date:"2026-05-17T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>前言</h2>
<p>在多人在线游戏开发场景中，网络质量是决定玩家体验的核心命脉。无论是 FPS、MOBA 类帧同步重度游戏，还是棋牌、休闲对战类轻量实时游戏，都对网络通信有着<strong>低延迟、抗丢包、高实时、高可靠</strong>的严苛要求。</p>
<p>传统 TCP 协议基于拥塞优先的设计理念，重传机制保守、延迟累积严重，在 4G/5G 波动、Wi-Fi 干扰等弱网环境下极易出现卡顿、瞬移、技能延迟等问题；而原生 UDP 虽延迟极低，但完全不保障数据可靠性，无法承载游戏指令、帧同步数据、玩家状态等核心业务数据。</p>
<p><strong>KCP 协议</strong>作为基于 UDP 实现的可靠快速传输协议，完美平衡了低延迟与数据可靠性，是目前游戏实时通信的行业最优方案之一。而 <strong>kratos-transport KCP 中间件</strong> 基于标准 KCP 协议深度封装，完整适配 Kratos 微服务生态，提供开箱即用的服务端、客户端、会话管理能力，大幅降低 Go 语言游戏服务器的网络层开发成本。</p>`},title:"Kratos KCP 传输中间件：游戏开发低延迟网络通信实战指南"}}],["/posts/kratos_machinery.html",{loader:()=>i(()=>import("./kratos_machinery.html-DKPUshp7.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用分布式任务队列Machinery",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>
<p>任务队列的输入是称为<code>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>
<p>在Golang语言里面，我们有像<a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a>和<a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a>这样的类似于<code>Celery</code>的分布式任务队列。</p>`},title:"Golang微服务框架Kratos应用分布式任务队列Machinery"}}],["/posts/kratos_mcp.html",{loader:()=>i(()=>import("./kratos_mcp.html-BnbrALHd.js"),[]),meta:{_blog:{title:"基于 Go-Kratos 与 MCP 的推荐服务实战指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>在微服务与多模块协同场景下，实现服务间的标准化通信与流程调度是核心挑战。本文聚焦 <code>go-kratos-mcp-demo</code> 项目，讲解如何基于
<code>Go-Kratos</code> 框架与 <code>MCP</code>（模块化协同协议）构建可扩展的推荐服务，涵盖服务契约设计（proto）、模块化流程编排、召回/过滤/排序等关键模块的实现与测试，并展示实战部署与可观测性方案。</p>
<h2>技术基石：Go-Kratos 与 MCP 的协同架构</h2>
<p>项目技术选型围绕 “模块化协同” 核心需求展开，<code>Go-Kratos</code> 与 <code>MCP</code> 构成架构的两大支柱，形成 “框架赋能 + 协议规范” 的协同模式：</p>`},title:"基于 Go-Kratos 与 MCP 的推荐服务实战指南"}}],["/posts/kratos_monolith_architecture.html",{loader:()=>i(()=>import("./kratos_monolith_architecture.html-DxRGUUZn.js"),[]),meta:{_blog:{title:"Golang微服务框架居然可以开发单体应用？—— Kratos单体架构实践",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>TL;DR</h2>
<p>微服务框架也是可以用于开发单体架构(monolith architecture)的应用。并且，单体应用也是最小的、最原始的、最初的项目状态，经过渐进式的开发演进，单体应用能够逐步的演变成微服务架构，并且不断的细分服务粒度。微服务框架开发的单体架构应用，既然是一个最小化的实施，那么它只需要使用到微服务框架最小的技术，也就意味着它只需要用到微服务框架最少的知识点，拿它来学习微服务框架是极佳的。</p>
<p>本文将围绕着一个我写的demo项目：<a href="https://gitee.com/tx7do/kratos-monolithic-demo" target="_blank" rel="noopener noreferrer">kratos-monolithic-demo</a>开展，它既是一个微服务框架Kratos的最小化实践，也是一个工程化实践的完全体。从中你可以学习到：</p>`},title:"Golang微服务框架居然可以开发单体应用？—— Kratos单体架构实践"}}],["/posts/kratos_mq.html",{loader:()=>i(()=>import("./kratos_mq.html-DGHanmdZ.js"),[]),meta:{_blog:{title:"golang微服务框架Kratos实现消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是消息队列</h2>
<p>MQ就是消息队列，是Message Queue的缩写。消息队列是一种通信方式。消息的本质就是一种数据结构。因为MQ把项目中的消息集中式的处理和存储，所以MQ主要有解耦，并发，和削峰的功能。</p>
<h2>为什么要使用消息队列</h2>
<h3>1. 异步</h3>
<p>通常的微服务实现里面，都是通过RPC进行微服务之间的相互调用，这是同步的。如果消息队列的话，可以实现异步的调用。至于异步有啥好处呢，主要是为了削峰。</p>
<h3>2. 削峰</h3>
<p>同步的调用会带来一个问题：瞬时流量。客户的调用同步接口节奏，你是无法把控的，流量将会是忽高忽低的，猛的来一波，搞不好系统就崩了溃了。</p>`},title:"golang微服务框架Kratos实现消息队列"}}],["/posts/kratos_mqtt.html",{loader:()=>i(()=>import("./kratos_mqtt.html-BYxNUXxl.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用MQTT消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是MQTT？怎样在微服务框架Kratos当中应用MQTT进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>`},title:"Golang微服务框架Kratos应用MQTT消息队列"}}],["/posts/kratos_mtls.html",{loader:()=>i(()=>import("./kratos_mtls.html-Dy_ZcITQ.js"),[]),meta:{_blog:{title:"Kratos微服务框架下的TLS单向和双向认证",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是SSL</h2>
<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p>`},title:"Kratos微服务框架下的TLS单向和双向认证"}}],["/posts/kratos_nats.html",{loader:()=>i(()=>import("./kratos_nats.html-BMc4q8O8.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用NATS消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是NATS</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>
<p>消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。</p>`},title:"Golang微服务框架Kratos应用NATS消息队列"}}],["/posts/kratos_nsq.html",{loader:()=>i(()=>import("./kratos_nsq.html-DaFj42IR.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用NSQ消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是NSQ？怎样在微服务框架Kratos当中应用NSQ进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。
消息中间件是指利用高效可靠的消息传递机制进行与平台无关的数据交流，并基于数据通信来进行分布式系统的构建。</p>`},title:"Golang微服务框架Kratos应用NSQ消息队列"}}],["/posts/kratos_opa.html",{loader:()=>i(()=>import("./kratos_opa.html-CLX2tptM.js"),[]),meta:{_blog:{title:"Kratos微服务框架实现权鉴 - OPA",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p><a href="https://www.openpolicyagent.org/" target="_blank" rel="noopener noreferrer">Open Policy Agent</a>，官方简称OPA，旨在统一不同技术和系统的策略执行。今天，OPA 被科技行业内的巨头们所使用。例如，Netflix 使用 OPA 来控制对其内部 API 资源的访问。Chef 用它来为他们的终端用户产品提供 IAM 功能。此外，许多其他公司，如 Cloudflare、Pinterest 等，都使用 OPA 在他们的平台上执行策略（如 Kubernetes 集群）。</p>
<p>OPA 最初是由 Styra 公司在 2016 年创建并开源的项目，目前该公司的主要产品就是提供可视化策略控制及策略执行的可视化 Dashboard 服务的。</p>`},title:"Kratos微服务框架实现权鉴 - OPA"}}],["/posts/kratos_pulsar.html",{loader:()=>i(()=>import("./kratos_pulsar.html-B_S3AwzB.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用Pulsar消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是Pulsar？怎样在微服务框架Kratos当中应用Pulsar进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>`},title:"Golang微服务框架Kratos应用Pulsar消息队列"}}],["/posts/kratos_rabbitmq.html",{loader:()=>i(()=>import("./kratos_rabbitmq.html-C_5yO5MW.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用RabbitMQ消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是RabbitMQ？怎样在微服务框架Kratos当中应用RabbitMQ进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>`},title:"Golang微服务框架Kratos应用RabbitMQ消息队列"}}],["/posts/kratos_rocketmq.html",{loader:()=>i(()=>import("./kratos_rocketmq.html-Bw7uzyar.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos应用RocketMQ消息队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>消息队列是一种异步的服务间通信方式，适用于无服务器和微服务架构。消息在被处理和删除之前一直存储在队列上。每条消息仅可被一位用户处理一次。消息队列可被用于分离重量级处理、缓冲或批处理工作以及缓解高峰期工作负载。</p>
<p>消息队列是大型分布式系统不可缺少的中间件，也是高并发系统的基石中间件，所以掌握好消息队列MQ就变得极其重要。</p>
<p>在本文当中，您将了解到：什么是消息队列？什么是RocketMQ？怎样在微服务框架Kratos当中应用RocketMQ进行业务开发。</p>
<h2>什么是消息队列</h2>
<p>消息队列（Message Queue，简称MQ）指保存消息的一个容器，其实本质就是一个保存数据的队列。</p>`},title:"Golang微服务框架Kratos应用RocketMQ消息队列"}}],["/posts/kratos_server_run_as_daemon.html",{loader:()=>i(()=>import("./kratos_server_run_as_daemon.html-DQUv5NfP.js"),[]),meta:{_blog:{title:"将Kratos微服务程序运行为Linux守护进程",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>supervisor</h2>
<h3>安装supervisor</h3>
<p>Centos：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 先安装 EPEL</span></span>
<span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> epel-release</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 安装supervisor</span></span>
<span class="line"><span class="token function">sudo</span> yum <span class="token parameter variable">-y</span> <span class="token function">install</span> supervisor</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 设置为开机启动</span></span>
<span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> supervisord</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动进程</span></span>
<span class="line"><span class="token function">sudo</span> systemctl start supervisord</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"将Kratos微服务程序运行为Linux守护进程"}}],["/posts/kratos_signalr.html",{loader:()=>i(()=>import("./kratos_signalr.html-hzK22qH2.js"),[]),meta:{_blog:{title:"Golang微服务框架kratos实现SignalR服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>基于 SignalR 可以实现客户端和服务器之间进行即时通信。</p>
<p>适合 SignalR 的应用场景：</p>
<p>需要从服务器进行高频率更新的应用。 示例包括游戏、社交网络、投票、拍卖、地图和 GPS 应用。
仪表板和监视应用。
协作应用。 协作应用的示例包括白板应用和团队会议软件。
需要通知的应用。 社交网络、电子邮件、聊天、游戏、旅行警报和很多其他应用都需使用通知。</p>
<p>SignalR 自动选择服务器和客户端能力范围内的最佳传输方法，如WebSockets、Server-Sent Events、长轮询。Hub 是一种高级管道，允许客户端和服务器相互调用方法。 SignalR 自动处理跨计算机边界的调度，并允许客户端调用服务器上的方法，反之亦然。SignalR 提供两个内置协议：基于 JSON 的文本协议和基于 MessagePack 的二进制协议。</p>`},title:"Golang微服务框架kratos实现SignalR服务"}}],["/posts/kratos_socketio.html",{loader:()=>i(()=>import("./kratos_socketio.html-B-Vp9bhC.js"),[]),meta:{_blog:{title:"Golang微服务框架kratos实现Socket.IO服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>Socket.IO 是一个面向实时 web 应用的 实时通讯库。它使得服务器和客户端之间实时双向的通信成为可能。底层使用EngineIO。SocketIO的的客户端使用Engine.IO-Client，服务端使用Engine.IO实现。</p>
<p>Socket.IO 主要使用WebSocket协议。但是如果需要的话，Socket.IO 可以回退到几种其它方法，例如Adobe Flash Sockets，JSONP拉取，或是传统的AJAX拉取，并且在同时提供完全相同的接口。尽管它可以被用作WebSocket的包装库，它还是提供了许多其它功能，比如广播至多个套接字，存储与不同客户有关的数据，和异步IO操作。</p>`},title:"Golang微服务框架kratos实现Socket.IO服务"}}],["/posts/kratos_sse.html",{loader:()=>i(()=>import("./kratos_sse.html-BWDOWm9N.js"),[]),meta:{_blog:{title:"Golang微服务框架kratos实现SSE服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>我也是最近才知道SSE的，问了下周围的人，发现知道的人也着实不多的。我是怎么知道SSE的呢？我看了下OpenAI的API，有一个Stream模式，就是使用的SSE实现的。说白了，这就是一个HTTP长连接通过服务端持续发送数据到前端的协议。在网络不稳定的情况下，它比Websocket要更好。</p>
<h2>什么是SSE</h2>
<p>Server-Sent Events（简称 SSE）</p>
<p>严格地说，HTTP 协议无法做到服务器主动推送信息。但是，有一种变通方法，就是服务器向客户端声明，接下来要发送的是流信息（streaming）。</p>
<p>也就是说，发送的不是一次性的数据包，而是一个数据流，会连续不断地发送过来。这时，客户端不会关闭连接，会一直等着服务器发过来的新的数据流，视频播放就是这样的例子。本质上，这种通信就是以流信息的方式，完成一次用时很长的下载。</p>`},title:"Golang微服务框架kratos实现SSE服务"}}],["/posts/kratos_swagger_ui.html",{loader:()=>i(()=>import("./kratos_swagger_ui.html-D2wtv4xu.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos轻松集成并使用Swagger UI",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>在我们的开发当中，调试接口，测试接口，提供接口文档给前端，那都是非常频繁的工作内容。</p>
<p>那么，我们需要用什么方法和工具来实施这些工作内容呢？</p>
<p>Swagger，或者说OpenAPI。</p>
<p>下面先让我们了解一下下什么是Swagger，什么是OpenAPI。</p>
<h2>什么是 OpenAPI</h2>
<p>OpenAPI 是编写 RESTful API 的全球标准。它是一种规范，使得全球开发人员可以标准化 API 的设计，并在从头开始编写 REST API 时遵守所有安全、版本控制、错误处理和其他最佳实践。不仅仅是从头开始，即使现有的 API 也可以进行微调以符合全球标准。</p>`},title:"Golang微服务框架Kratos轻松集成并使用Swagger UI"}}],["/posts/kratos_task_queue.html",{loader:()=>i(()=>import("./kratos_task_queue.html-CgC2MK2t.js"),[]),meta:{_blog:{title:"golang微服务框架Kratos实现分布式任务队列",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p><strong>任务队列（Task Queue）</strong> 一般用于跨线程或跨计算机分配工作的一种机制。其本质是生产者消费者模型，生产者发送任务到消息队列，消费者负责处理任务。</p>
<p>任务队列的输入是称为<code>任务(Task)</code>的工作单元。专用的工作进程不断监视任务队列以查找要执行的新工作。</p>
<p>在Golang语言里面，我们有像<a href="https://github.com/hibiken/asynq" target="_blank" rel="noopener noreferrer">Asynq</a>和<a href="https://github.com/RichardKnop/machinery" target="_blank" rel="noopener noreferrer">Machinery</a>这样的类似于<code>Celery</code>的分布式任务队列。</p>`},title:"golang微服务框架Kratos实现分布式任务队列"}}],["/posts/kratos_thrift.html",{loader:()=>i(()=>import("./kratos_thrift.html-BrE4pRHt.js"),[]),meta:{_blog:{title:"Golang微服务框架Kratos实现Thrift服务",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是Thrift</h2>
<p>Thrift是Facebook于2007年开发的跨语言的rpc服框架，提供多语言的编译功能，并提供多种服务器工作模式；用户通过Thrift的IDL（接口定义语言）来描述接口函数及数据类型，然后通过Thrift的编译环境生成各种语言类型的接口文件，用户可以根据自己的需要采用不同的语言开发客户端代码和服务器端代码。2007年由facebook贡献到apache基金，是apache下的顶级项目，具备如下特点：</p>
<ul>
<li>支持多语言：C、C++ 、C# 、D 、Delphi 、Erlang 、Go 、Haxe 、Haskell 、Java 、JavaScript、node.js 、OCaml 、Perl 、PHP 、Python 、Ruby 、SmallTalk</li>
<li>消息定义文件支持注释，数据结构与传输表现的分离，支持多种消息格式</li>
<li>包含完整的客户端/服务端堆栈，可快速实现RPC，支持同步和异步通信</li>
</ul>`},title:"Golang微服务框架Kratos实现Thrift服务"}}],["/posts/kratos_uba.html",{loader:()=>i(()=>import("./kratos_uba.html-B-ssstdZ.js"),[]),meta:{_blog:{title:"跟我一起用Golang微服务框架Kratos实现一个用户行为分析系统（UBA）",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>本文将带你了解什么是 <strong>BI（商业智能）</strong> 和 <strong>UBA（用户行为分析）</strong>，并且使用go语言和微服务框架kratos去实现一个UBA系统。</p>
<p>这个系统简单的描述就是：前端通过埋点SDK上报前端采集到的埋点数据，后端的代理服务（Agent Service）接收到了埋点数据之后，将数据入列到Kafka当中，然后我们消费Kafka当中的消息，入库到ClickHouse当中，分析服务对入库的埋点数据进行分析并且生成报表，最后在前端页面进行展示。</p>
<h2>什么是BI？</h2>
<p>BI，即商业智能，指利用大数据分析、现代数据仓库等技术收集企业最新数据、形成BI报表并及时为企业员工提供BI数据分析报告，实现对业务数据的深入挖掘以获取更多商业价值。大多数企业每天都会收集海量业务数据，这些数据来自其 ERP 软件、电商平台、供应链以及许多其他内部和外部数据源。要想充分利用这些数据，制定由数据驱动的决策，现代商业智能 (BI) 系统必不可少。</p>`},title:"跟我一起用Golang微服务框架Kratos实现一个用户行为分析系统（UBA）"}}],["/posts/kratos_upload_file.html",{loader:()=>i(()=>import("./kratos_upload_file.html-DWGg4e3P.js"),[]),meta:{_blog:{title:"GO微服务框架Kratos上传文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>首先，我们需要知道：Kratos能够上传文件。</p>
<p>其次，我们需要知道：需要一些手工代码来支撑（不能够代码生成一波流）。</p>
<p>最后，我们所有的文件都落地到MinIO当中。对于使用过各种上传方案的我而言，MinIO是一个非常完美的文件解决方案。</p>
<p>在这里，我们不讨论前端的上传，我们只讨论后端的上传。我另外有一篇偏向于前端的文章，有兴趣的同学可以阅读它：<a href="https://juejin.cn/post/7153078635551784990" target="_blank" rel="noopener noreferrer">JavaScript/TypeScript前端实现文件上传到MinIO</a>。</p>`},title:"GO微服务框架Kratos上传文件"}}],["/posts/kratos_webrtc.html",{loader:()=>i(()=>import("./kratos_webrtc.html-CSS1rL7g.js"),[]),meta:{_blog:{title:"Kratos WebRTC 传输中间件：H5游戏P2P实时音视频与数据通信实战",author:"",date:"2026-05-17T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>前言</h2>
<p>在 H5 联机游戏、网页实时对战、浏览器语音开黑、在线互动课堂等实时业务场景中，传统 TCP/UDP 服务端中转架构存在天然短板：链路转发延迟高、服务器带宽压力大、弱网适应性差、规模化扩容成本高昂，难以满足低延迟、高互动的业务诉求。</p>
<p>WebRTC 是 W3C 与 IETF 标准化的浏览器原生实时通信方案，基于 UDP 协议构建，具备毫秒级低延迟、完整 NAT 穿透、端对端 P2P 直连能力，同时支持<strong>音视频媒体流 + 二进制数据通道</strong>双通路并行传输，是当前网页端实时交互场景的最优落地方案。</p>
<p><strong>kratos-transport/webrtc</strong> 是适配 Kratos 微服务生态的生产级 WebRTC 传输中间件。它对原生 WebRTC 繁杂的信令协商、SDP 交换、ICE 穿透、会话生命周期管理、异常重连等底层逻辑做了高度工程化封装，完全契合 Kratos 标准生命周期规范，支持优雅启停、自动会话回收、事件驱动回调、媒体流传输与自定义二进制协议，大幅降低 Go 语言 WebRTC 服务的开发与落地成本。</p>`},title:"Kratos WebRTC 传输中间件：H5游戏P2P实时音视频与数据通信实战"}}],["/posts/kratos_websocket_chat_room.html",{loader:()=>i(()=>import("./kratos_websocket_chat_room.html-DSJIlZVo.js"),[]),meta:{_blog:{title:"golang微服务框架Kratos实现Websocket聊天室",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<h2>什么是WebSocket</h2>
<p>WebSocket 协议主要为了解决基于 HTTP/1.x 的 Web 应用无法实现服务端向客户端主动推送的问题, 为了兼容现有的设施, WebSocket 协议使用与 HTTP 协议相同的端口, 并使用 HTTP Upgrade 机制来进行 WebSocket 握手, 当握手完成之后, 通信双方便可以按照 WebSocket 协议的方式进行交互</p>
<p>WebSocket 使用 TCP 作为传输层协议, 与 HTTP 类似, WebSocket 也支持在 TCP 上层引入 TLS 层, 以建立加密数据传输通道, 即 WebSocket over TLS, WebSocket 的 URI 与 HTTP URI 的结构类似, 对于使用 80 端口的 WebSocket over TCP, 其 URI 的一般形式为 <code>ws://host:port/path/query</code> 对于使用 443 端口的 WebSocket over TLS, 其 URI 的一般形式为 <code>wss://host:port/path/query</code></p>`},title:"golang微服务框架Kratos实现Websocket聊天室"}}],["/posts/kratos_zanzibar.html",{loader:()=>i(()=>import("./kratos_zanzibar.html-FsPxCUuS.js"),[]),meta:{_blog:{title:"Kratos微服务框架实现权鉴 - Zanzibar",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>用户的权限管理对每个项目来说都至关重要。不同的业务场景决定了不同的权限管理需求，不同的技术栈也有不同的解决方案：</p>
<ol>
<li>如果你在写一个<code>Ruby On Rails</code>应用，那你可能会选择<a href="https://github.com/ryanb/cancan" target="_blank" rel="noopener noreferrer">cancan</a>；</li>
<li>如果你在写一个<code>Java Spring</code>应用，那你可能会选择<a href="https://spring.io/projects/spring-security" target="_blank" rel="noopener noreferrer">Spring Security</a> 或者 <a href="https://shiro.apache.org/" target="_blank" rel="noopener noreferrer">Apache Shiro</a>；</li>
<li>如果你正在使用<code>K8S</code>，那你很可能需要与K8S的<a href="https://kubernetes.io/zh-cn/docs/reference/access-authn-authz/authorization/" target="_blank" rel="noopener noreferrer">鉴权模块</a>打交道。</li>
</ol>`},title:"Kratos微服务框架实现权鉴 - Zanzibar"}}],["/posts/libuv_timer.html",{loader:()=>i(()=>import("./libuv_timer.html-JVFZ-I6t.js"),[]),meta:{_blog:{title:"libuv实现定时器Timer",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","libuv"],excerpt:`
`},title:"libuv实现定时器Timer"}}],["/posts/linux_show_lib_exported_table.html",{loader:()=>i(()=>import("./linux_show_lib_exported_table.html-Dz_Cig3B.js"),[]),meta:{_blog:{title:"Linux库导出信息查看",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Linux"],excerpt:`
<p>nm</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token comment"># 查看静态库或动态库定义了哪些函数</span></span>
<span class="line">nm <span class="token parameter variable">-n</span> --defined-only xxxx.a</span>
<span class="line">nm <span class="token parameter variable">-g</span> <span class="token parameter variable">-C</span> --defined-only xxxx.so</span>
<span class="line">nm <span class="token parameter variable">-D</span> xxxx.so</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 显示hello.a 中的未定义符号，需要和其他对象文件进行链接.</span></span>
<span class="line">nm <span class="token parameter variable">-u</span> hello.o</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 在 ./ 目录下找出哪个库文件定义了close_socket函数. </span></span>
<span class="line">nm <span class="token parameter variable">-A</span> ./* <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>/dev/null <span class="token operator">|</span> <span class="token function">grep</span> <span class="token string">"T close_socket"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Linux库导出信息查看"}}],["/posts/localization_vs_internationalization.html",{loader:()=>i(()=>import("./localization_vs_internationalization.html-BFe-Jgiw.js"),[]),meta:{_blog:{title:"游戏的本地化和国际化",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["本地化","国际化"],excerpt:`
<p>有3个专有名词：</p>
<ul>
<li>I18N - 国际化，internationalization，缩写源自于在I和N之间有18个字母。</li>
<li>L10N - 本地化，localization，缩写源自于在L和N之间有10个字母。</li>
<li>M17N - 多语言化，multilingualization，缩写源自于在M和N之间有17个字母。</li>
</ul>
<h2>国际化 (I18N)</h2>
<p>该术语用于设计、分析和采用支持本地市场甚至全球市场多语言的软件。</p>
<p>国际化是指去本地化，移除本地语言写的提示信息，异常信息，区域信息等，采用国际标准或者提取资源。</p>`},title:"游戏的本地化和国际化"}}],["/posts/lockstep_and_state_sync.html",{loader:()=>i(()=>import("./lockstep_and_state_sync.html-DaqztPd4.js"),[]),meta:{_blog:{title:"帧同步和状态同步",author:"",date:"2026-09-30T00:00:00.000Z",category:["游戏开发"],tag:["状态同步","帧同步"],excerpt:`
<p>多人网络游戏的第一性问题只有一个：<strong>若干台分布在不同网络环境里的客户端，如何各自跑出"同一场对局"</strong>。业界几十年的实践收敛出两条主路线——</p>
<ul>
<li><strong>帧同步（lockstep）</strong>：只同步玩家的操作指令，每个客户端各自把整场战斗模拟出来；</li>
<li><strong>状态同步（state synchronization）</strong>：服务器算出结果，把结果状态广播给各客户端。</li>
</ul>
<p>两条路线没有绝对优劣，只有与具体玩法、团队结构和运营目标的匹配度差异。本文梳理两种模型的原理、工程要点、衍生形态与选型逻辑。至于传输层（KCP / WebRTC / WebSocket）怎么选，那是与同步模型正交的另一个问题，展开在<a href="/posts/real-time-game-network-protocol-kcp-vs-webrtc-vs-websocket.html" target="_blank">《实时游戏网络协议深度对比：KCP vs WebRTC vs WebSocket》</a>，本文不涉及。</p>`},title:"帧同步和状态同步"}}],["/posts/mac_delete.html",{loader:()=>i(()=>import("./mac_delete.html-CvNF6ku0.js"),[]),meta:{_blog:{title:"Mac 删除键(Delete) 这三招你会吗？可大幅加快打字速度！",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["MacOS"],excerpt:`
<p>在Windows 上有<code>「Delete」</code>跟<code>「Backspace」</code>两个按键，一个是往左删除字符，一个是往右删除字符；可是在Mac 上却只有一个<code>delete 键</code>，要怎样灵活的用它，让它变得跟Windows 一样好用呢？</p>
<h2>fn + delete，删除右边文字</h2>
<p><img src="/assets/images/mac/fn_delete.png" alt="fn + delete"></p>
<p><code>fn + delete</code> 可以让光标向右边删除文字，跟Windows 的 <code>del 键</code>功能一样。</p>`},title:"Mac 删除键(Delete) 这三招你会吗？可大幅加快打字速度！"}}],["/posts/make_bubble_water.html",{loader:()=>i(()=>import("./make_bubble_water.html-BlbOpJXA.js"),[]),meta:{_blog:{title:"如何配制泡泡水",author:"",date:"2020-01-01T00:00:00.000Z",category:["生活杂记"],tag:["泡泡水"],excerpt:`
<h2>基础泡泡水</h2>
<ul>
<li>950毫升温水</li>
<li>115克白砂糖</li>
<li>120毫升洗碗液</li>
</ul>
<h2>超级泡泡水</h2>
<ul>
<li>1400毫升水</li>
<li>65克玉米淀粉</li>
<li>120毫升洗碗液</li>
<li>13克泡打粉</li>
<li>15毫升甘油或玉米糖浆</li>
</ul>
<h2>彩色泡泡水</h2>
<ul>
<li>300毫升温水</li>
<li>30克白砂糖</li>
<li>80毫升洗碗液</li>
<li>食用色素</li>
</ul>
<h2>芳香泡泡水</h2>
<ul>
<li>240毫升温水</li>
<li>120毫升温和的，或者无香型洗手液</li>
<li>精油</li>
<li>30到60毫升甘油或玉米淀粉（可选）</li>
</ul>`},title:"如何配制泡泡水"}}],["/posts/markdown_tutorial.html",{loader:()=>i(()=>import("./markdown_tutorial.html-Cpc8J4oG.js"),[]),meta:{_blog:{title:"Markdown简易教程",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Markdown"],excerpt:`
<hr>
<h2>一、Markdown</h2>
<h3>简介</h3>
<img src="/assets/images/markdown.png" width="120px">  
\`Markdown\` 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档。
<h3>应用</h3>
<p>当前许多网站都广泛使用 <code>Markdown</code> 来撰写帮助文档或是用于论坛上发表消息。例如：GitHub、简书、知乎等</p>
<h3>编辑器</h3>
<p>推荐使用<code>Typora</code>，官网：<a href="https://typora.io/" target="_blank" rel="noopener noreferrer">https://typora.io/</a></p>`},title:"Markdown简易教程"}}],["/posts/microservice_technology_selection_why_go_kratos.html",{loader:()=>i(()=>import("./microservice_technology_selection_why_go_kratos.html-kHbZhDJR.js"),[]),meta:{_blog:{title:"微服务技术选型：从生态架构视角看go-kratos的不可替代性",author:"",date:"2020-01-01T00:00:00.000Z",category:["Go编程"],tag:["Golang","Go-Kratos"],excerpt:`
<p>在 Go 语言微服务生态中，单一框架的能力边界往往决定项目上限，而 “核心框架 + 生态扩展” 的架构协同性，才是长期支撑业务迭代的关键。面对 Gin、Go-Micro、Kitex 等选项，go-kratos 不仅自身架构卓越，更通过<a href="(https://github.com/tx7do/kratos-transport)">kratos-transport</a>（通信扩展）、<a href="(https://github.com/tx7do/kratos-authn)">kratos-authn</a>/<a href="(https://github.com/tx7do/kratos-authz)">authz</a>（安全扩展）、<a href="(https://github.com/tx7do/kratos-cli)">kratos-cli</a>（工具扩展）及<a href="(https://github.com/tx7do/go-wind-admin)">go-wind-admin</a>/<a href="(https://github.com/tx7do/go-kratos-cms)">cms</a>/<a href="(https://github.com/tx7do/go-crud)">go-crud</a>（应用模板），构建了 “核心定义标准、扩展补全能力、应用落地业务” 的全链路架构体系。本文从架构视角拆解这一生态，解析技术选型优先选择 <a href="(https://github.com/go-kratos/kratos)">go-kratos</a> 的深层逻辑。</p>`},title:"微服务技术选型：从生态架构视角看go-kratos的不可替代性"}}],["/posts/ml_lab.html",{loader:()=>i(()=>import("./ml_lab.html-B9zSBtkq.js"),[]),meta:{_blog:{title:"机器学习有关的库",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["机器学习"],excerpt:`
<h2>基础概念</h2>
<h3>机器学习</h3>
<p>机器学习 (ML) 是人工智能 (AI) 的一部分，属于计算科学领域，专门分析和解释数据的模式及结构，以实现无需人工交互即可完成学习、推理和决策等行为的目的。简单来说，机器学习即支持用户向计算机算法馈送大量数据，然后让计算机分析这些数据，并仅根据输入数据给出数据驱动型建议和决策。如果算法识别出任何更正，它会整合更正信息，改进未来决策。</p>
<p>机器学习由三个部分组成：</p>
<ul>
<li>属于决策核心的计算算法。</li>
<li>组成决策的变量和特征。</li>
<li>支持（训练）系统学习的具有已知答案的相关基础知识。</li>
</ul>`},title:"机器学习有关的库"}}],["/posts/mqtt_http_auth.html",{loader:()=>i(()=>import("./mqtt_http_auth.html-4IPDIDp9.js"),[]),meta:{_blog:{title:"MQTT服务器使用HTTP进行用户认证",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["QTT"],excerpt:`
<p>MQTT开源服务器有不少,我只用了两个Erlang开发的开源服务器:</p>
<ul>
<li><a href="https://www.rabbitmq.com/" target="_blank" rel="noopener noreferrer">RabbitMQ</a></li>
<li><a href="https://www.emqx.io/" target="_blank" rel="noopener noreferrer">EMQX</a>.</li>
</ul>
<p>现实中,我们需要提供一个HTTP认证服务器,来认证我们的MQTT客户端.</p>
<h2>Docker部署开发服务器</h2>`},title:"MQTT服务器使用HTTP进行用户认证"}}],["/posts/mqtt_lwt.html",{loader:()=>i(()=>import("./mqtt_lwt.html-DqSn6jEL.js"),[]),meta:{_blog:{title:"MQTT 协议下的Last Will and Testament（LWT，遗嘱消息）",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["MQTT"],excerpt:`
<p>Last Will and Testament（LWT，遗嘱消息）其作用是当客户端异常断开（如网络中断）时，EMQ X 自动发布一条预设的遗嘱消息，通知系统该用户离线。</p>
<p>该消息由MQTT的服务端（Broker）发出。</p>
<p>该消息，在客户端正常离线的时候不会被发出，只有客户端非正常断开网络连接的时候才会发出。</p>
<p>LWT的Topic设计上，从两个维度设计分别为：</p>
<ol>
<li>用户维度：<code>user/status/{user_id}</code></li>
<li>设备维度：<code>device/status/{device_id}</code></li>
</ol>`},title:"MQTT 协议下的Last Will and Testament（LWT，遗嘱消息）"}}],["/posts/mqtt_x509.html",{loader:()=>i(()=>import("./mqtt_x509.html-CsNUAMgm.js"),[]),meta:{_blog:{title:"MQTT用X509进行认证",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["MQTT"],excerpt:`
<h2>什么是SSL</h2>
<p><strong>SSL（安全套接字层）</strong> 及其后继者 <strong>TLS（传输层安全性）</strong> 是用于在联网计算机之间建立经过身份验证和加密的链接的协议。 尽管SSL协议已随着以下版本的发布而被弃用 TLS 1.0，在1999年，将这些相关技术称为“ SSL”或“ SSL /TLS。” 最新版本是 TLS 1.3，定义于 <a href="https://tools.ietf.org/html/rfc8446" target="_blank" rel="noopener noreferrer">RFC 8446</a> （八月2018）。</p>`},title:"MQTT用X509进行认证"}}],["/posts/msb_lsb.html",{loader:()=>i(()=>import("./msb_lsb.html-DUFPK6h1.js"),[]),meta:{_blog:{title:"MSB 和 LSB",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["MSB","LSB"],excerpt:`
<h2>MSB 最高有效位（The Most Significant Bit）</h2>
<h2>LSB 最低有效位（The Least Significant Bit）</h2>
<h2>参考资料</h2>
<ul>
<li><a href="https://www.sciencedirect.com/topics/computer-science/most-significant-bit" target="_blank" rel="noopener noreferrer">Most Significant Bit</a></li>
<li><a href="https://www.sciencedirect.com/topics/computer-science/least-significant-bit" target="_blank" rel="noopener noreferrer">Least Significant Bit</a></li>
</ul>`},title:"MSB 和 LSB"}}],["/posts/my_favorite_top-5_1_flutter_packages_in_2024_to_enhance_apps.html",{loader:()=>i(()=>import("./my_favorite_top-5_1_flutter_packages_in_2024_to_enhance_apps.html-hXrI9nNy.js"),[]),meta:{_blog:{title:"2024年Flutter必知必会的5+1个降本增效软件包",author:"",date:"2020-01-01T00:00:00.000Z",category:["Flutter编程"],tag:["Flutter"],excerpt:`
<p>我从 2018 年初就开始使用 Flutter，我仍然对自己为客户和公司开发和部署应用程序的速度感到惊讶。由于我的开发周期的重点是提供有价值的产品，因此我避免重新发明轮子，这就是为什么我有一个在大多数项目中使用的安全和流行的软件包列表。今天我将分享我最常用的 5+1 个 Flutter 包，以帮助您完成下一个项目。</p>
<h2>1. cached_network_image</h2>
<p>随着移动应用程序对富媒体内容的需求不断增长，高效的图像加载和缓存变得至关重要。 <code>cached_network_image</code> 是一个可靠的解决方案，可以无缝处理图像加载、缓存和错误处理。通过在本地智能缓存图像，即使在具有挑战性的网络条件下，该软件包也能确保流畅且响应迅速的用户体验。凭借其简单性和性能，<code>cached_network_image</code> 几乎在我所有的应用程序中使用，以最佳效率提供具有迷人视觉的应用程序。</p>`},title:"2024年Flutter必知必会的5+1个降本增效软件包"}}],["/posts/mysql_ibd_to_sql.html",{loader:()=>i(()=>import("./mysql_ibd_to_sql.html-Cwz-2YXo.js"),[]),meta:{_blog:{title:"MySQL 运维实战：ibd 文件批量转换为 SQL 完整指南（基于 ibd2sql）",author:"",date:"2026-04-16T00:00:00.000Z",category:["运维技术"],tag:["MySQL"],excerpt:`
<p>在 MySQL 数据库运维、数据恢复、迁移场景中，<strong>仅存 ibd 文件、丢失表结构 / 备份</strong> 是最棘手的问题之一。InnoDB 的独立表空间文件 <code>.ibd</code> 存储了表的全部数据和结构，但无法直接读取使用。</p>
<p>基于开源工具 <code>ibd2sql</code>，我们可以<strong>离线解析 ibd 文件</strong>，直接导出完整的 <code>CREATE TABLE</code>（DDL）和 <code>INSERT</code>（DML）语句。本文整合** Windows PowerShell 批量脚本** + <strong>Linux Shell 自动转换</strong> + 导入脚本，实现一键批量处理，彻底解决 ibd 恢复难题。</p>`},title:"MySQL 运维实战：ibd 文件批量转换为 SQL 完整指南（基于 ibd2sql）"}}],["/posts/npm_yarn_pnpm_change_source.html",{loader:()=>i(()=>import("./npm_yarn_pnpm_change_source.html-CrzOKUdY.js"),[]),meta:{_blog:{title:"npm/pnpm/yarn切换源",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["npm","pnpm","yarn"],excerpt:`
<ul>
<li>国内镜像</li>
</ul>
<table>
<thead>
<tr>
<th>提供商</th>
<th>搜索地址</th>
<th>registry地址</th>
</tr>
</thead>
<tbody>
<tr>
<td>淘宝</td>
<td>https://npmmirror.com/</td>
<td>https://registry.npmmirror.com</td>
</tr>
<tr>
<td>腾讯云</td>
<td></td>
<td>http://mirrors.cloud.tencent.com/npm/</td>
</tr>
<tr>
<td>华为云</td>
<td></td>
<td>https://mirrors.huaweicloud.com/repository/npm</td>
</tr>
<tr>
<td>浙江大学</td>
<td></td>
<td>http://mirrors.zju.edu.cn/npm/</td>
</tr>
<tr>
<td>南京邮电</td>
<td></td>
<td>https://mirrors.njupt.edu.cn/nexus/repository/npm/</td>
</tr>
</tbody>
</table>`},title:"npm/pnpm/yarn切换源"}}],["/posts/ocr.html",{loader:()=>i(()=>import("./ocr.html-BzvOF3ai.js"),[]),meta:{_blog:{title:"OCR",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["OCR"],excerpt:`
<ol>
<li>Tesseract <a href="https://github.com/tesseract-ocr/tesseract" target="_blank" rel="noopener noreferrer">https://github.com/tesseract-ocr/tesseract</a></li>
<li>PaddleOCR <a href="https://github.com/PaddlePaddle/PaddleOCR" target="_blank" rel="noopener noreferrer">https://github.com/PaddlePaddle/PaddleOCR</a></li>
<li>EasyOCR <a href="https://github.com/JaidedAI/EasyOCR" target="_blank" rel="noopener noreferrer">https://github.com/JaidedAI/EasyOCR</a></li>
<li>chineseocr <a href="https://github.com/chineseocr/chineseocr" target="_blank" rel="noopener noreferrer">https://github.com/chineseocr/chineseocr</a></li>
<li>chineseocr_lite <a href="https://github.com/DayBreak-u/chineseocr_lite" target="_blank" rel="noopener noreferrer">https://github.com/DayBreak-u/chineseocr_lite</a></li>
<li>CnOCR <a href="https://github.com/breezedeus/cnocr" target="_blank" rel="noopener noreferrer">https://github.com/breezedeus/cnocr</a></li>
<li>TrWebOCR <a href="https://github.com/alisen39/TrWebOCR" target="_blank" rel="noopener noreferrer">https://github.com/alisen39/TrWebOCR</a></li>
</ol>`},title:"OCR"}}],["/posts/ohlc.html",{loader:()=>i(()=>import("./ohlc.html-DegoOo5n.js"),[]),meta:{_blog:{title:"OHLC",author:"",date:"2020-01-01T00:00:00.000Z",category:["量化开发"],tag:["OHLC"],excerpt:`
<h2>OHLC</h2>
<ul>
<li>开盘价（Open）：这被视为特定时间段或时间范围开始时资产或加密代币的开盘价。</li>
<li>最高价（High）：这是给定时间范围内资产交易的最高价格</li>
<li>最低价（Low）：这是指定时间段内资产的最低交易价格。</li>
<li>收盘价（Close）：这是指定时间结束时资产的最后交易价格。</li>
</ul>
<h2>OHLCV</h2>
<ul>
<li>Open: opening price</li>
<li>High: highest price</li>
<li>Low: lowest price</li>
<li>Close: closing price</li>
<li>Volume: volume of transactions</li>
</ul>`},title:"OHLC"}}],["/posts/oltp_olap.html",{loader:()=>i(()=>import("./oltp_olap.html-CJ5SdAny.js"),[]),meta:{_blog:{title:"OLTP 和 OLAP",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["OLTP","OLAP"],excerpt:`
<p>OLTP 和 OLAP：这两个术语看起来相似，但指的是不同类型的系统。在线事务处理 (OLTP) 实时捕获、存储和处理来自事务的数据。在线分析处理 (OLAP) 使用复杂的查询来分析来自 OLTP 系统的汇总历史数据。</p>
<h2>OLTP</h2>
<h3>什么是OLTP？</h3>
<p>OLTP 是指Online Transactional Processing 的简称，这个词中 Transactional 是非常重要的，代表的是说他的处理通常包含了读以及写，通常OLTP 是指系统能够处理大量的更新以及新增的查询。所以在传统的OLTP 系统中，数据的正确性以及一致性是首要要达到的目标之一。所以一般的OLTP 中会常常听到ACID (Atomatic, Consistent, Isolated, Durable) 合规。这代表他们遵循着一个事务(Transaction) 完成后才会执行下一笔，确保整个系统的数据一致性。</p>`},title:"OLTP 和 OLAP"}}],["/posts/openai_assistants_api.html",{loader:()=>i(()=>import("./openai_assistants_api.html-4_7o81FA.js"),[]),meta:{_blog:{title:"OpenAI 助手API",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["OpenAI"],excerpt:`
<h2>添加依赖库</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">go get github.com/Azure/azure-sdk-for-go</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"OpenAI 助手API"}}],["/posts/openapi_to_typescript_dts.html",{loader:()=>i(()=>import("./openapi_to_typescript_dts.html-CwzE2Sf1.js"),[]),meta:{_blog:{title:"从OpenAPI文档生成Typescript的d.ts文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["OpenAPI"],excerpt:`
<p>一开始我走入了误区，应该从Protobuf生成dts，但是，现在来看，通过OpenAPI文档生成dts文件会更好一些。</p>
<p>首先，Protobuf对于前端来说，知识面几乎没有交集。你要找出知道Protobuf的前端，这并不是一件很容易的事情。但是，你要问前端OpenAPI，Swagger，他一定能够会告诉你，必须的知道。</p>
<p>其次，Protobuf通常都是后端定义，后端使用，要开放VSC的权限给前端，有时候会是一个很艰难的问题。那么，现实是，通常生成的工作都要后端去做——这就给工作中带来了极大的不便。</p>
<p>综上，通过Protobuf生成dts其实并不是一个明智之举。</p>`},title:"从OpenAPI文档生成Typescript的d.ts文件"}}],["/posts/picross_nonogram.html",{loader:()=>i(()=>import("./picross_nonogram.html-BTPHs7nX.js"),[]),meta:{_blog:{title:"数织 (Nonogram)",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["数织"],excerpt:`
<h2>什么是数织？</h2>
<p>数织是一种逻辑游戏，以猜谜的方式绘画黑白位图。在一个网格中，每一行和列都有一组数，玩家需根据它们来填满或留空格子，最后就可以由此得出一幅图画。例如，“4 8 3”的意思就是指该行或列上有三条独立的线，分别占了4、8和3格，而每条线最少要由一个空格分开。传统上，玩家是以黑色填满格子，和以“×”号标记一定不需要填充的格子。数织是一个NP完全的问题。</p>
<p>数织是在1987年由日本人西尾彻也发明的。数织的日文名称是“お絵かきロジック”，意思是“绘画逻辑”。数织初见于日本的谜题杂志，玩家用纸和笔来玩。随后，任天堂以“Mario's Picross”为名推出了两款Game Boy和九款超级任天堂游戏。现时NDS上亦有名为Picross DS的同款游戏。2015年十二月，任天堂推出了名为“Pokemon Picross”的3DS游戏。</p>`},title:"数织 (Nonogram)"}}],["/posts/ping_regex.html",{loader:()=>i(()=>import("./ping_regex.html-DhuZC9dv.js"),[]),meta:{_blog:{title:"Ping结果正则表达式解析",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Ping"],excerpt:`
<h2>Windows</h2>
<h3>ping结果示例</h3>
<p>中文：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">ping</span> www.baidu.com <span class="token parameter variable">-n</span> <span class="token number">3</span></span>
<span class="line"></span>
<span class="line">正在 Ping www.a.shifen.com <span class="token punctuation">[</span><span class="token number">120.232</span>.145.185<span class="token punctuation">]</span> 具有 <span class="token number">32</span> 字节的数据:</span>
<span class="line">来自 <span class="token number">120.232</span>.145.185 的回复: 字节<span class="token operator">=</span><span class="token number">32</span> 时间<span class="token operator">=</span>45ms <span class="token assign-left variable">TTL</span><span class="token operator">=</span><span class="token number">49</span></span>
<span class="line">来自 <span class="token number">120.232</span>.145.185 的回复: 字节<span class="token operator">=</span><span class="token number">32</span> 时间<span class="token operator">=</span>627ms <span class="token assign-left variable">TTL</span><span class="token operator">=</span><span class="token number">49</span></span>
<span class="line">来自 <span class="token number">120.232</span>.145.185 的回复: 字节<span class="token operator">=</span><span class="token number">32</span> 时间<span class="token operator">=</span>49ms <span class="token assign-left variable">TTL</span><span class="token operator">=</span><span class="token number">49</span></span>
<span class="line"></span>
<span class="line"><span class="token number">120.232</span>.145.185 的 Ping 统计信息:</span>
<span class="line">    数据包: 已发送 <span class="token operator">=</span> <span class="token number">3</span>，已接收 <span class="token operator">=</span> <span class="token number">3</span>，丢失 <span class="token operator">=</span> <span class="token number">0</span> <span class="token punctuation">(</span><span class="token number">0</span>% 丢失<span class="token punctuation">)</span>，</span>
<span class="line">往返行程的估计时间<span class="token punctuation">(</span>以毫秒为单位<span class="token punctuation">)</span>:</span>
<span class="line">    最短 <span class="token operator">=</span> 45ms，最长 <span class="token operator">=</span> 627ms，平均 <span class="token operator">=</span> 240ms</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Ping结果正则表达式解析"}}],["/posts/pose_estimation.html",{loader:()=>i(()=>import("./pose_estimation.html-YhLzxrPM.js"),[]),meta:{_blog:{title:"人体姿态识别",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["人体姿态识别"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://www.jianshu.com/p/3aa810b35a5d" target="_blank" rel="noopener noreferrer">Github开源人体姿态识别项目OpenPose中文文档</a></li>
<li><a href="https://google.github.io/mediapipe/solutions/pose.html" target="_blank" rel="noopener noreferrer">MediaPipe Pose</a></li>
<li><a href="https://bcxiaobai.eu.org/post/11019.html" target="_blank" rel="noopener noreferrer">基于人体姿态识别的AI健身系统</a></li>
<li><a href="https://www.modb.pro/db/379092" target="_blank" rel="noopener noreferrer">基于深度学习的人体姿态估计技术与应用</a></li>
<li><a href="https://ai.googleblog.com/2020/08/on-device-real-time-body-pose-tracking.html" target="_blank" rel="noopener noreferrer">On-device, Real-time Body Pose Tracking with MediaPipe BlazePose</a></li>
</ul>`},title:"人体姿态识别"}}],["/posts/postgres_full_text_search_a_search_engine_in_a_database.html",{loader:()=>i(()=>import("./postgres_full_text_search_a_search_engine_in_a_database.html-WHopKPrB.js"),[]),meta:{_blog:{title:"Postgres 全文搜索：数据库中的搜索引擎",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["全文搜索"],excerpt:`
<p>在我的 SQL 之旅的早期，我认为在数据库中搜索一段文本主要涉及这样的查询：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">SELECT</span> col <span class="token keyword">FROM</span> <span class="token keyword">table</span> <span class="token keyword">WHERE</span> col <span class="token operator">LIKE</span> <span class="token string">'%some_value%'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Postgres 全文搜索：数据库中的搜索引擎"}}],["/posts/postgresql_cross_table_query.html",{loader:()=>i(()=>import("./postgresql_cross_table_query.html-DaN-MIA4.js"),[]),meta:{_blog:{title:"PostgreSQL查询交叉表",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["PostgreSQL","交叉表"],excerpt:`
<h2>什么是交叉表？</h2>
<p><strong>交叉表（Cross Tabulations）</strong> 是一种常用的分类汇总表格。利用交叉表查询数据非常直观明了，被广泛应用。交叉表查询也是数据库的一个特点。</p>
<h3>概念</h3>
<p>在统计学中，交叉表是矩阵格式的一种表格，显示变量的（多变量）频率分布。交叉表被广泛用于调查研究，商业智能，工程和科学研究。它们提供了两个变量之间的相互关系的基本画面，可以帮助他们发现它们之间的相互作用。卡尔·皮尔逊（Karl Pearson）首先在“关于应变的理论及其关联理论与正常相关性”中使用了交叉表。</p>
<p>多元统计学的一个关键问题是找到高维应变表中包含的变量的（直接）依赖结构。如果某些有条件的独立性被揭示，那么甚至可以以更智能的方式来完成数据的存储。为了做到这一点，可以使用信息理论概念，它只能从概率分布中获得信息，这可以通过相对频率从交叉表中容易地表示。</p>`},title:"PostgreSQL查询交叉表"}}],["/posts/postgresql_docker_container_change_timezone.html",{loader:()=>i(()=>import("./postgresql_docker_container_change_timezone.html-DihGD-9x.js"),[]),meta:{_blog:{title:"PostgreSQL Docker容器修改时区",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["PostgreSQL","Docker"],excerpt:`
<p>做了一些配置的修改之后，查询到的数据倒是显示的是+8的时区，可是，执行<code>show timezone;</code>之后，不论怎么样都是显示的是<code>UTC</code>时间。</p>
<h2>环境变量</h2>
<p>docker-compose的相关配置如下：</p>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code><span class="line"><span class="token key atrule">services</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">postgres</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">environment</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> TZ=Asia/Shanghai</span>
<span class="line">      <span class="token punctuation">-</span> PGTZ=Asia/Shanghai</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"PostgreSQL Docker容器修改时区"}}],["/posts/postgresql_timestamp_group_query.html",{loader:()=>i(()=>import("./postgresql_timestamp_group_query.html-BVCGR1hc.js"),[]),meta:{_blog:{title:"Postgresql按时间分组统计查询（年月日周时分秒）",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["PostgreSQL"],excerpt:`
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre><code><span class="line"><span class="token keyword">create</span> <span class="token keyword">table</span> <span class="token keyword">public</span><span class="token punctuation">.</span><span class="token string">"user"</span> <span class="token punctuation">(</span></span>
<span class="line">  id <span class="token keyword">integer</span> <span class="token keyword">primary</span> <span class="token keyword">key</span> <span class="token operator">not</span> <span class="token boolean">null</span><span class="token punctuation">,</span> <span class="token comment">-- id</span></span>
<span class="line">  create_time <span class="token keyword">bigint</span><span class="token punctuation">,</span> <span class="token comment">-- 创建时间</span></span>
<span class="line">  update_time <span class="token keyword">bigint</span><span class="token punctuation">,</span> <span class="token comment">-- 更新时间</span></span>
<span class="line">  delete_time <span class="token keyword">bigint</span><span class="token punctuation">,</span> <span class="token comment">-- 删除时间</span></span>
<span class="line"></span>
<span class="line">  created_at <span class="token keyword">TIMESTAMP</span><span class="token punctuation">,</span> <span class="token comment">-- 创建时间</span></span>
<span class="line">  updated_at <span class="token keyword">TIMESTAMP</span><span class="token punctuation">,</span> <span class="token comment">-- 更新时间</span></span>
<span class="line">  deleted_at <span class="token keyword">TIMESTAMP</span>  <span class="token comment">-- 删除时间</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Postgresql按时间分组统计查询（年月日周时分秒）"}}],["/posts/prometheus_metrics_type.html",{loader:()=>i(()=>import("./prometheus_metrics_type.html-CDkKbj9E.js"),[]),meta:{_blog:{title:"Prometheus的四大指标类型",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Prometheus"],excerpt:`
<p>Prometheus有4大指标类型（Metrics Type），分别是：</p>
<ol>
<li>Counter（计数器）</li>
<li>Gauge（仪表盘）</li>
<li>Histogram（直方图）</li>
<li>Summary（摘要）</li>
</ol>
<h2>1. Counter（计数器）</h2>
<p>计数器表示一种单调递增的指标，除非发生重置的情况下下只增不减，其样本值应该是不断增大的。</p>
<p>例如，可以使用Counter类型的指标来表示服务的请求数、已完成的任务数、错误发生的次数等。</p>
<h2>2. Gauge（仪表盘）</h2>
<p>仪表盘类型代表一种。它可以理解为状态的快照，Gauge通常用于表示温度或者内存使用率这种指标数据，也可以表示能随时增加或减少的“总数”，例如当前并发请求的数量node_memory_MemFree（主机当前空闲的内容大小）、node_memory_MemAvailable（可用内存大小）等。在使用Gauge时，用户往往希望使用它们等。</p>`},title:"Prometheus的四大指标类型"}}],["/posts/protobuf_generate_golang_code_4ways.html",{loader:()=>i(()=>import("./protobuf_generate_golang_code_4ways.html-CtIs7DOZ.js"),[]),meta:{_blog:{title:"Protobuf生成golang代码的4种方法",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Protobuf"],excerpt:`
<p>要将Protobuf协议生成目标语言的代码，必须要通过生成器<a href="https://grpc.io/docs/protoc-installation/" target="_blank" rel="noopener noreferrer">protoc</a>来实现，protoc是通过插件机制来实现各种语言的生成功能。</p>
<h2>插件生成文件一览表</h2>
<table>
<thead>
<tr>
<th>插件名</th>
<th>生成文件名</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="google.golang.org/protobuf/cmd/protoc-gen-go">protoc-gen-go</a></td>
<td>XXXXX.pb.go</td>
</tr>
<tr>
<td><a href="google.golang.org/grpc/cmd/protoc-gen-go-grpc">protoc-gen-go-grpc</a></td>
<td>XXXXXX_grpc.pb.go</td>
</tr>
<tr>
<td><a href="github.com/go-kratos/kratos/cmd/protoc-gen-go-http">protoc-gen-go-http</a></td>
<td>XXXXXX_http.pb.go</td>
</tr>
<tr>
<td><a href="github.com/go-kratos/kratos/cmd/protoc-gen-go-errors">protoc-gen-go-errors</a></td>
<td>XXXXXX_errors.pb.go</td>
</tr>
<tr>
<td><a href="github.com/bufbuild/protoc-gen-validate">protoc-gen-validate</a></td>
<td>XXXXXX.pb.validate.go</td>
</tr>
<tr>
<td><a href="github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2">protoc-gen-openapiv2</a></td>
<td>XXXXXX.swagger.json</td>
</tr>
<tr>
<td><a href="github.com/google/gnostic/cmd/protoc-gen-openapi">protoc-gen-openapi</a></td>
<td>openapi.yaml</td>
</tr>
</tbody>
</table>`},title:"Protobuf生成golang代码的4种方法"}}],["/posts/protobufjs.html",{loader:()=>i(()=>import("./protobufjs.html-BuvXXxKb.js"),[]),meta:{_blog:{title:"Protobufjs",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Protobuf"],excerpt:`
<h2>7.x.x和6.x.x差异</h2>
<p>6是运行时和CLI都在一起，7则拆分开来了。</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">pnpm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> protobufjs</span>
<span class="line"><span class="token function">pnpm</span> <span class="token function">install</span> <span class="token parameter variable">-D</span> protobufjs-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Protobufjs"}}],["/posts/python_docx.html",{loader:()=>i(()=>import("./python_docx.html-DWYdZtsB.js"),[]),meta:{_blog:{title:"Python如何操作Docx文档",author:"",date:"2020-01-01T00:00:00.000Z",category:["Python编程"],tag:["Python","Docx"],excerpt:`
<p>python下面关于文档操作的工具倒是多的，比如：</p>
<ul>
<li><a href="https://pypi.org/project/pywin32/" target="_blank" rel="noopener noreferrer">win32com</a></li>
<li><a href="https://python-docx.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">python-docx</a></li>
<li><a href="https://pydocx.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">pydocx</a></li>
<li><a href="https://pypi.org/project/docx2pdf/" target="_blank" rel="noopener noreferrer">docx2pdf</a></li>
<li><a href="https://products.aspose.com/words/python-net/" target="_blank" rel="noopener noreferrer">Aspose.Words</a></li>
<li><a href="https://docxtpl.readthedocs.io/en/latest/" target="_blank" rel="noopener noreferrer">python-docx-template</a></li>
</ul>`},title:"Python如何操作Docx文档"}}],["/posts/python_pip_source.html",{loader:()=>i(()=>import("./python_pip_source.html-Bjn7HTe5.js"),[]),meta:{_blog:{title:"Python修改pip的软件源",author:"",date:"2020-01-01T00:00:00.000Z",category:["Python编程"],tag:["Python"],excerpt:`
<h2>国内常用软件源列表</h2>
<table>
<thead>
<tr>
<th>提供者</th>
<th>地址</th>
</tr>
</thead>
<tbody>
<tr>
<td>豆瓣</td>
<td>https://pypi.doubanio.com/simple/</td>
</tr>
<tr>
<td>腾讯</td>
<td>https://mirrors.cloud.tencent.com/pypi/simple/</td>
</tr>
<tr>
<td>阿里</td>
<td>https://mirrors.aliyun.com/pypi/simple/</td>
</tr>
<tr>
<td>网易</td>
<td>https://mirrors.163.com/pypi/simple/</td>
</tr>
<tr>
<td>清华</td>
<td>https://pypi.tuna.tsinghua.edu.cn/simple/</td>
</tr>
<tr>
<td>中国科学技术大学</td>
<td>https://pypi.mirrors.ustc.edu.cn/simple/</td>
</tr>
<tr>
<td>北京外国语大学</td>
<td>https://mirrors.bfsu.edu.cn/pypi/web/simple/</td>
</tr>
</tbody>
</table>`},title:"Python修改pip的软件源"}}],["/posts/qt_cpp_call_qml_callback.html",{loader:()=>i(()=>import("./qt_cpp_call_qml_callback.html-DH-EqKI1.js"),[]),meta:{_blog:{title:"Qt 6 实战：C++ 调用 QML 回调方法（异步场景完整实现）",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","Qt"],excerpt:`
<p>在 Qt 6 开发中，C++ 与 QML 混合编程是常见场景。当 C++ 处理异步操作（如登录验证、网络请求、数据库查询）时，需要将结果通知给 QML 界面，<strong>回调函数</strong>是最直观的通信方式之一。本文将基于你提供的代码框架，补充关键细节、修复潜在问题，并完整实现从 C++ 调用 QML 回调的全流程。</p>
<h2>一、核心场景说明</h2>
<p>我们需要实现：</p>
<ol>
<li>QML 调用 C++ 的 <code>login</code> 方法（传入用户名、密码和两个回调函数：成功回调 <code>onSuccess</code>、失败回调 <code>onFailure</code>）；</li>
<li>C++ 异步处理登录逻辑（模拟耗时操作）；</li>
<li>登录完成后，C++ 调用对应的 QML 回调函数，将结果（成功响应 / 错误信息）传递给 QML。</li>
</ol>`},title:"Qt 6 实战：C++ 调用 QML 回调方法（异步场景完整实现）"}}],["/posts/qt_qml_date_time_picker.html",{loader:()=>i(()=>import("./qt_qml_date_time_picker.html-Ca-izQ1x.js"),[]),meta:{_blog:{title:"Qt6 QML 自定义 DateTimePicker 组件：完整实现与使用指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","Qt"],excerpt:`
<p>在 Qt 开发中，原生的日期时间选择组件往往难以满足个性化的 UI 设计和交互需求（如深色主题、自定义时间范围、键盘导航等）。本文基于 Qt6.10 版本，从零实现一款功能完整、交互友好的 DateTimePicker 组件，支持日期 + 时间联动选择、时间范围限制、键盘 / 鼠标双交互、深色主题适配等特性，可直接集成到 QML 项目中。</p>
<h2>一、组件核心特性</h2>
<table>
<thead>
<tr>
<th>特性</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>深色主题适配</td>
<td>内置统一的深色系样式常量，支持快速切换主题</td>
</tr>
<tr>
<td>完整时间维度选择</td>
<td>支持年、月、日、时、分、秒全维度选择，日历网格可视化展示</td>
</tr>
<tr>
<td>时间范围限制</td>
<td>通过 <code>minDateTime</code>/<code>maxDateTime</code> 限制可选时间范围，禁用超出范围的选项</td>
</tr>
<tr>
<td>双交互模式</td>
<td>支持鼠标点击 / 悬停、键盘方向键 / Tab/Enter/Escape 操作</td>
</tr>
<tr>
<td>智能视觉反馈</td>
<td>选中状态高亮、禁用状态灰显、悬停效果、焦点区域提示</td>
</tr>
<tr>
<td>快捷操作</td>
<td>内置「今天」快捷按钮，一键恢复当前系统时间</td>
</tr>
<tr>
<td>自动月份切换</td>
<td>点击非当前月日期时，自动切换到对应月份</td>
</tr>
</tbody>
</table>`},title:"Qt6 QML 自定义 DateTimePicker 组件：完整实现与使用指南"}}],["/posts/qt_singleton.html",{loader:()=>i(()=>import("./qt_singleton.html-C5j5Uzx4.js"),[]),meta:{_blog:{title:"Qt 优雅实现线程安全单例模式（模板化 + 自动清理）",author:"",date:"2020-01-01T00:00:00.000Z",category:["C++编程"],tag:["C++","Qt"],excerpt:`
<p>在 Qt 开发中，单例模式是高频使用的设计模式，用于全局共享一个实例（如配置管理、网络服务、日志系统等）。一个健壮的 Qt 单例需要满足 <strong>线程安全、自动清理、通用性强、支持任意构造参数</strong> 等核心需求。本文将基于模板封装 + 管理器的设计思路，实现一套可直接复用的单例框架，并详细讲解其设计原理与最佳实践。</p>
<h2>一、单例模式的核心诉求</h2>
<p>在 Qt 环境中，单例的设计需要解决以下关键问题：</p>
<ol>
<li><strong>线程安全：</strong> 多线程并发调用时避免创建多个实例；</li>
<li><strong>自动清理：</strong> 程序退出时自动释放资源，避免内存泄漏（尤其配合 Qt 的 QCoreApplication::aboutToQuit 机制）；</li>
<li><strong>通用性：</strong> 支持任意类作为单例，无需重复编写单例逻辑；</li>
<li><strong>灵活构造：</strong> 支持带参数的构造函数，且不丢失参数语义；</li>
<li><strong>安全校验：</strong> 避免未初始化就调用实例的错误；</li>
<li><strong>可手动控制：</strong> 支持主动初始化 / 销毁单例。</li>
</ol>`},title:"Qt 优雅实现线程安全单例模式（模板化 + 自动清理）"}}],["/posts/quantitative_trading.html",{loader:()=>i(()=>import("./quantitative_trading.html-BdY-wZCp.js"),[]),meta:{_blog:{title:"量化交易",author:"",date:"2020-01-01T00:00:00.000Z",category:["量化开发"],tag:["量化交易"],excerpt:`
<p>「程序交易」（Program Trading）也可以称为「量化交易」（Quantitative Trading） ，投资人通过计算机程序「全自动」执行投资交易。</p>
<p>其优势在于可以大量节省时间盯盘，也可以同时关注多种商品。程序交易可以避免人性的主观影响，透过软件严格执行保持交易的一致性。</p>
<h2>什么是量化交易？起源为何？</h2>
<ul>
<li>
<p>量化交易简单来说就是将自己的金融操作方式，用很明确的方式去定义和描述，透过程序去回测验证，评估后确认方法具有交易优势后，让程序依照所设定的规则去执行交易。</p>
</li>
<li>
<p>量化交易开始于1980年代初，大型投资机构利用程序设计的方式将交易规则明确的以程序语言定义，将交易流程系统化，至今有大多数的对冲基金（hedge
fund）用到量化交易。在华尔街，传统的主观操盘手，将面临淘汰的压力，已经很少对冲基金利用基本面来选股了。</p>
</li>
</ul>`},title:"量化交易"}}],["/posts/quic_open_source.html",{loader:()=>i(()=>import("./quic_open_source.html-D1hS4sY9.js"),[]),meta:{_blog:{title:"QUIC协议开源实现列表",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["QUIC"],excerpt:`
<h2>框架和开源实现</h2>
<h3>C/C++</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>Version</th>
<th>Roles</th>
<th>Handshake</th>
</tr>
</thead>
<tbody>
<tr>
<td>Microsoft's <a href="https://github.com/microsoft/msquic" target="_blank" rel="noopener noreferrer">MsQuic</a></td>
<td>draft-27/28/29/30/31/32</td>
<td>client, server</td>
<td>TLS 1.3 RFC</td>
</tr>
<tr>
<td>Facebook's <a href="https://github.com/facebookincubator/mvfst" target="_blank" rel="noopener noreferrer">mvfst</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>Google's <a href="https://www.chromium.org/quic/playing-with-quic" target="_blank" rel="noopener noreferrer">Chromium</a></td>
<td>Q043, Q046, Q050, T050, T051, draft-27, draft-29</td>
<td>library, client, server</td>
<td>QUIC Crypto, TLS</td>
</tr>
<tr>
<td><a href="https://cwiki.apache.org/confluence/display/TS/QUIC" target="_blank" rel="noopener noreferrer">ats</a> (Apache Traffic Server)</td>
<td>draft-29</td>
<td>client. server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>LiteSpeed's <a href="https://github.com/litespeedtech/lsquic" target="_blank" rel="noopener noreferrer">lsquic</a></td>
<td>Draft-32, Draft-29, Draft-28, Draft-27, Q043, Q046, and Q050.</td>
<td>library, client, server</td>
<td>QUIC Crypto, RFC 8446</td>
</tr>
<tr>
<td><a href="https://github.com/ngtcp2/ngtcp2" target="_blank" rel="noopener noreferrer">ngtcp2</a></td>
<td>draft-29, draft-30, draft-31, and draft-32</td>
<td>library, client, server</td>
<td>TLSv1.3 (RFC 8446)</td>
</tr>
<tr>
<td>Cloudflare's <a href="https://github.com/cloudflare/quiche/tree/master/extras/nginx" target="_blank" rel="noopener noreferrer">nginx-cloudflare</a></td>
<td>draft-27, draft-28, draft-29</td>
<td>server</td>
<td>TLSv1.3 (RFC8446)</td>
</tr>
<tr>
<td><a href="https://github.com/private-octopus/picoquic" target="_blank" rel="noopener noreferrer">picoquic</a></td>
<td>draft-32/31/30/29/28/27</td>
<td>library and test tools, test client, test server</td>
<td>TLS 1.3 (using picotls)</td>
</tr>
<tr>
<td><a href="https://github.com/p-quic/pquic" target="_blank" rel="noopener noreferrer">Pluginized QUIC</a></td>
<td>draft-29</td>
<td>library, client, server</td>
<td>TLS 1.3 (using picotls)</td>
</tr>
<tr>
<td><a href="https://github.com/NTAP/quant" target="_blank" rel="noopener noreferrer">quant</a></td>
<td>draft-33, draft-34, v1</td>
<td>library, client, server</td>
<td>TLS 1.3</td>
</tr>
<tr>
<td>Fastly's <a href="https://github.com/h2o/quicly" target="_blank" rel="noopener noreferrer">quicly</a></td>
<td>draft-27</td>
<td>client, server</td>
<td>TLS 1.3 (final)</td>
</tr>
<tr>
<td><a href="https://hg.nginx.org/nginx-quic/" target="_blank" rel="noopener noreferrer">nginx-quic</a></td>
<td>draft-27 .. draft-32</td>
<td>server</td>
<td>TLSv1.3 (RFC8446)</td>
</tr>
<tr>
<td>Alibaba's <a href="https://github.com/alibaba/xquic" target="_blank" rel="noopener noreferrer">xquic</a></td>
<td>draft-29</td>
<td>library</td>
<td>TLSv1.3</td>
</tr>
<tr>
<td>Google's <a href="https://github.com/google/quiche" target="_blank" rel="noopener noreferrer">quiche</a></td>
<td>draft-29</td>
<td>library</td>
<td>TLSv1.3</td>
</tr>
</tbody>
</table>`},title:"QUIC协议开源实现列表"}}],["/posts/reactor.html",{loader:()=>i(()=>import("./reactor.html-BDKyP9bK.js"),[]),meta:{_blog:{title:"Reactor模式",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Reactor"],excerpt:`
<h2>参考资料</h2>
<ul>
<li><a href="https://segmentfault.com/a/1190000041306642" target="_blank" rel="noopener noreferrer">《Go组件设计与实现》-netpoll的总结</a></li>
<li><a href="https://www.infoq.cn/article/boeavgkiqmvcj8qjnbxk" target="_blank" rel="noopener noreferrer">Go netpoll I/O 多路复用构建原生网络模型之源码深度解析</a></li>
<li><a href="https://strikefreedom.top/archives/go-netpoll-io-multiplexing-reactor#toc-head-21" target="_blank" rel="noopener noreferrer">Go netpoller 原生网络模型之源码全面揭秘</a></li>
<li><a href="https://segmentfault.com/a/1190000038994423" target="_blank" rel="noopener noreferrer">epoll在Golang中的应用</a></li>
<li><a href="https://colobu.com/2019/02/23/1m-go-tcp-connection/" target="_blank" rel="noopener noreferrer">百万 Go TCP 连接的思考: epoll方式减少资源占用</a></li>
</ul>`},title:"Reactor模式"}}],["/posts/real-time-game-network-protocol-kcp-vs-webrtc-vs-websocket.html",{loader:()=>i(()=>import("./real-time-game-network-protocol-kcp-vs-webrtc-vs-websocket.html-Cmjn26XZ.js"),[]),meta:{_blog:{title:"实时游戏网络协议深度对比：KCP vs WebRTC vs WebSocket",author:"",date:"2026-06-08T00:00:00.000Z",category:["游戏开发"],tag:["WebRTC","Websocket","KCP","Kratos-Transport"],excerpt:`
<blockquote>
<p>本文基于 <a href="https://github.com/tx7do/kratos-transport" target="_blank" rel="noopener noreferrer">kratos-transport</a> 项目的实际架构，深入分析三种主流实时通信协议在游戏场景下的性能差异与选型策略。</p>
</blockquote>
<h2>1. 三种协议的协议栈全景</h2>
<h3>1.1 KCP</h3>
<p>KCP 是一个基于 UDP 的可靠传输协议，由 skywind3000 开发。其核心思想是<strong>用带宽换延迟</strong>——通过更激进的重传策略和拥塞控制，在弱网环境下获得远低于 TCP 的延迟。</p>`},title:"实时游戏网络协议深度对比：KCP vs WebRTC vs WebSocket"}}],["/posts/redis_keyspace_notifications.html",{loader:()=>i(()=>import("./redis_keyspace_notifications.html-BL1XflAa.js"),[]),meta:{_blog:{title:"Redis键空间通知",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Redis"],excerpt:`
<p>有需求，Key到期的时候需要一个通知给服务器端用于感知数据的改变。刚好Redis提供了一个Keyspace Notifications功能，可以让服务器端监听某个Key的到期事件。</p>
<p>官方文档说，这个功能是很耗费CPU的，所以，默认是关闭的。需要开启的话，可以使用命令：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">config <span class="token builtin class-name">set</span> notify-keyspace-events KEA</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Redis键空间通知"}}],["/posts/rest_design_principles.html",{loader:()=>i(()=>import("./rest_design_principles.html-BoNAysp9.js"),[]),meta:{_blog:{title:"REST 设计原则",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["REST"],excerpt:`
<p>我交谈过的大多数开发人员最终都会谈论 REST，他们都希望构建尽可能最好的 REST API。这当然会引发关于什么是好的 REST API 的常见讨论，或者您应该如何确保您的 API 是 REST风格的。有时，气氛会很紧张，所以我决定写一篇文章来解决这个问题。</p>
<p>这篇文章旨在收集我所认为的 REST 背后的主要设计原则。我当然会更新该文档，以反映我的任何不足或任何可以帮助任何有疑问的人的新想法。</p>
<h2>什么是REST</h2>
<p>REST 或“表述性状态传输”是一种架构风格，它定义了 Web 服务的设计和行为方式。REST 定义了一组必须遵循的约束，以便在互联网上的系统之间提供更好的互操作性。遵循这些原则的 Web 服务被认为是 REST风格的。</p>`},title:"REST 设计原则"}}],["/posts/roc_rk3588s_pc_deploy_ai_model.html",{loader:()=>i(()=>import("./roc_rk3588s_pc_deploy_ai_model.html-vpiEdopW.js"),[]),meta:{_blog:{title:"ROC-RK3588S-PC部署AI模型",author:"",date:null,category:[],tag:[],excerpt:`
<h2>硬件基础</h2>
<ul>
<li><strong>CPU</strong>：4×A76@2.4GHz + 4×A55@1.8GHz</li>
<li><strong>NPU</strong>：6TOPS INT8，支持<strong>w8a8/w4a16</strong>量化</li>
<li><strong>内存</strong>：32GB LPDDR5（足够跑 7B 量化模型）</li>
<li><strong>GPU</strong>：Mali-G610 MP4，支持 Vulkan/OpenCL 加速</li>
</ul>
<h2>可跑模型清单（按大小 / 场景）</h2>`},title:"ROC-RK3588S-PC部署AI模型"}}],["/posts/running_coturn_in_docker_a_step_by_step_guide.html",{loader:()=>i(()=>import("./running_coturn_in_docker_a_step_by_step_guide.html-Cy8--U36.js"),[]),meta:{_blog:{title:"使用 Docker 部署 CoTURN 新手指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","CoTURN"],excerpt:`
<p>在本指南中，我们将学习如何在 Docker 容器中运行 CoTURN。COTURN 是一款免费的开源 TURN 服务器，可用于 WebRTC 视频和音频通信以及 VoIP 服务</p>
<h2>先决条件</h2>
<ul>
<li>您应该在系统上安装 docker。了解如何在系统上安装 docker 超出了本文的范围</li>
<li>建议但不要求具备一些 docker 基础知识</li>
</ul>
<h2>安装</h2>
<p>Docker 提供了 CoTURN 镜像，可用于在容器中轻松设置 CoTURN 服务器</p>
<h3>步骤 1 拉取 Docker 镜像</h3>
<p>安装docker coturn。从云存储库Docker Hub中拉取coturn的docker镜像。</p>`},title:"使用 Docker 部署 CoTURN 新手指南"}}],["/posts/rushwind_admin_contract_driven.html",{loader:()=>i(()=>import("./rushwind_admin_contract_driven.html-C7zkrQ6W.js"),__vite__mapDeps([10,11])),meta:{_blog:{title:"RushWind Admin — 契约驱动：203 条路由零手写的工程化拆解",author:"",date:"2026-10-01T00:00:00.000Z",category:["Rust编程"],tag:["Rust","RushWind","Protobuf","代码生成","契约测试"],excerpt:`
<blockquote>
<p>大多数后端项目的 API 层是"人肉维护的目录"：路由注册、参数解析、错误码映射、文档注释——四份东西描述同一个事实，靠人保证一致，于是永远不完全一致。RushWind Admin 把这层做成了<strong>编译产物</strong>：Protobuf 是唯一契约，构建期确定性生成路由、错误映射、服务接口与绑定计划——203 条路由、441 条错误状态映射、198 个服务接口方法，零手写；前端 TypeScript 客户端同源于契约，三套前端字节相同。本文拆解这条生成流水线的设计与治理，以及三个真实踩到的暗礁——每一个都值得写成生成器作者的检查清单。</p>
</blockquote>`},title:"RushWind Admin — 契约驱动：203 条路由零手写的工程化拆解"}}],["/posts/rushwind_admin_intro.html",{loader:()=>i(()=>import("./rushwind_admin_intro.html-C92kBo1K.js"),__vite__mapDeps([12,1,11])),meta:{_blog:{title:"RushWind Admin — 用 Rust 写的企业级中后台，开源了",author:"",date:"2026-10-01T00:00:00.000Z",category:["Rust编程"],tag:["Rust","RushWind","中后台","开源项目"],excerpt:`
<blockquote>
<p>中后台大概是世界上被写得最多、也最不被认真对待的软件品类：几乎每家公司都要再写一遍用户、角色、租户、审计，写完还要为它们的安全性、性能与多前端适配反复买单。更麻烦的是，这块代码谁都不敢动——它不产生差异化价值，却出不起事故。<strong>RushWind Admin</strong>（中文名：锐风）把这套底座用 Rust 完整做了一遍：112 个 proto 契约文件、构建期生成 203 条路由、六类审计日志、存储层多租户隔离、TOTP 多因素认证、异步任务队列、SSE 实时推送、脚本级插件系统，外加 React / Vue Element / Vue Vben 三套前端共享同一份生成客户端。本文是它的自我介绍；至于"Go 写业务、Rust 扛平台"的混合架构论证，另有一篇硬核文专门展开。</p>
</blockquote>`},title:"RushWind Admin — 用 Rust 写的企业级中后台，开源了"}}],["/posts/saas_rbac.html",{loader:()=>i(()=>import("./saas_rbac.html-B976LFSq.js"),[]),meta:{_blog:{title:"SaaS系统RBAC后台权限管理",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["RBAC"],excerpt:`
<p>RBAC 是基于角色的访问控制（Role-Based Access Control ）在 RBAC 中，权限与角色相关联，用户通过成为适当角色的成员而得到这些角色的权限。这就极大地简化了权限的管理。这样管理都是层级相互依赖的，权限赋予给角色，而把角色又赋予用户，这样的权限设计很清楚，管理起来很方便。</p>
<h2>RBAC 简介</h2>
<p>RBAC 认为授权实际上是 <code>Who</code> 、<code>What</code> 、<code>How</code> 三元组之间的关系，也就是 Who 对 What 进行 How 的操作，也就是“主体”对“客体”的操作。</p>`},title:"SaaS系统RBAC后台权限管理"}}],["/posts/schema-driven-kratos-codegen.html",{loader:()=>i(()=>import("./schema-driven-kratos-codegen.html-BghCTCZv.js"),[]),meta:{_blog:{title:"一套Schema，生成全部代码｜Kratos高效开发新范式",author:"",date:"2026-05-16T00:00:00.000Z",category:["编程技术"],tag:["SDD","Kratos"],excerpt:`
<h2>前言：Kratos微服务开发的长期痛点</h2>
<p>在 Go-Kratos 微服务的日常开发中，开发者始终被<strong>重复编码、多端同步困难、团队规范混乱</strong>三大核心问题困扰，极大拖累了项目迭代效率与工程质量。</p>
<p>传统 Kratos 开发链路十分繁琐：开发者先设计数据库表结构、编写 SQL DDL，再手动编写 ORM 模型、Data 层仓储代码、Service 层基础代码，逐一定义 Protobuf 接口契约，最后还要同步适配前端接口与类型。整条链路高度依赖人工维护，环节多、链路长、极易出错。</p>
<p>长期人工迭代，会衍生一系列顽固的工程化问题：</p>`},title:"一套Schema，生成全部代码｜Kratos高效开发新范式"}}],["/posts/selenium_stale_element_reference.html",{loader:()=>i(()=>import("./selenium_stale_element_reference.html-BYzjCY3b.js"),[]),meta:{_blog:{title:"解决Selenium的报错：stale element reference: element is not attached to the page document",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Selenium"],excerpt:`
<p>第一次使用Selenium后，在循环处理时，我遇到了一个莫名其妙的错误，我被卡住了一阵子，故而我留下本文作为备忘录。</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code><span class="line">stale element reference: element is not attached to the page document</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"解决Selenium的报错：stale element reference: element is not attached to the page document"}}],["/posts/server_benchmark.html",{loader:()=>i(()=>import("./server_benchmark.html-Btn-gJw7.js"),[]),meta:{_blog:{title:"服务器基准测试",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["基准测试"],excerpt:`
<p>基准测试（benchmark）是针对系统设计的一种压力测试，目标是为了掌握系统的行为。</p>
<h2>利特尔法则(Little’s law)</h2>
<p>利特尔法则（英语：Little's law），基于等候理论，由约翰·利特尔在1954年提出。利特尔法则可用于一个稳定的、非占先式的系统中。</p>
<p>利特尔法则可用来确定在途存货的数量。此法则认为，系统中的平均存货等于存货单位离开系统的比率（亦即平均需求率）与存货单位在系统中平均时间的乘积。</p>
<p>利特尔法则的公式描述为：</p>
<p><strong>Lead Time(产出时间) = 存货数量 × 生产节拍</strong> 或 <strong>TH(生产效率) = WIP(存货数量) / CT(周期时间)</strong></p>`},title:"服务器基准测试"}}],["/posts/spine_downgrading_version.html",{loader:()=>i(()=>import("./spine_downgrading_version.html-DNf9pMWJ.js"),[]),meta:{_blog:{title:"Spine骨骼动画版本降级",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Spine"],excerpt:`
<h2>下载Skeleton Viewer</h2>
<p>下载页面：<a href="https://zh.esotericsoftware.com/spine-skeleton-viewer" target="_blank" rel="noopener noreferrer">https://zh.esotericsoftware.com/spine-skeleton-viewer</a></p>
<h2>打开界面</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">java</span> <span class="token parameter variable">-jar</span> skeletonViewer.jar</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Spine骨骼动画版本降级"}}],["/posts/stock.html",{loader:()=>i(()=>import("./stock.html-BbXpAW9F.js"),[]),meta:{_blog:{title:"股票",author:"",date:"2020-01-01T00:00:00.000Z",category:["量化开发"],tag:["股票"],excerpt:`
<h2>交易制度</h2>
<ul>
<li>竞价制度</li>
<li>做市商制度</li>
</ul>
<h3>竞价制度</h3>
<p>撮合交易也叫竞价交易，它由买卖双方直接进行交易，或将委托交给各自的代理经纪商，由代理经纪商将委托者的委托呈交到交易市场，在市场的交易中心以买卖双向价格为基准实行撮合，达成交易。 撮合交易（竞价交易）的类型包括：连续竞价方式和集合竞价方式。</p>
<ul>
<li>集合竞价交易制度（Call Auction Mechanism）</li>
<li>连续竞价交易制度（Continues Auction Mechanism）</li>
</ul>
<h4>集合竞价交易制度（Call Auction Mechanism）</h4>`},title:"股票"}}],["/posts/stupid_robber_problem.html",{loader:()=>i(()=>import("./stupid_robber_problem.html-DzrJqTjK.js"),[]),meta:{_blog:{title:"笨贼问题",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["算法"],excerpt:`
<p>3月24日上午10点30分左右，罗某保存了贩卖机上原本的收款码，并将两张伪造二维码贴在了口罩自动贩卖机上。只要有人扫码，他支付宝收到转账，就用自己手机扫一下事先拍好的贩卖机二维码照片完成购买，这样虽然有个时间差，但顾客也能拿到口罩，自己又轻松赚到了差价，为了以假乱真，罗某还设置了首单减一块钱的优惠，买一个口罩需要14元，两个29元。截止到24日下午6时，贩卖机上的二维码被民警发现并撕除，罗某通过此方法共非法获利74元。</p>
<p>新闻来源: <a href="https://www.sohu.com/a/533994769_162758" target="_blank" rel="noopener noreferrer">都要注意！6元口罩突然涨到14元？这个自动贩卖机，一查果然有猫腻！</a></p>`},title:"笨贼问题"}}],["/posts/the_24_best_roguelikes.html",{loader:()=>i(()=>import("./the_24_best_roguelikes.html-BzlBFQHU.js"),[]),meta:{_blog:{title:"24款最佳Roguelike游戏",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Roguelike"],excerpt:`
<p>roguelike 的魅力在于：重复奖励和诱人的希望，无论是因为你收集的新工具、你开发的新技能，还是你增强的新统计数据，你的下一次运行都会更加成功比最后一次。Roguelike 游戏很难停止，因为通常情况下，你会在某些方面有所进步。</p>
<p>尽管 Roguelike 的流行是最近才出现的现象，但其历史可以追溯到 40 多年前——准确地说，是从 1980 年开始。</p>
<p>尽管如此，Roguelike 游戏直到最近十年左右才进入主流。事实上，它们已经变得如此流行。天哪，2021 年最好的游戏之一是 PlayStation 工作室的 Roguelike 游戏。这导致了市场的某种程度的饱和，通常很难知道数百种游戏中哪一款最适合您。这就是我们进来的地方。</p>`},title:"24款最佳Roguelike游戏"}}],["/posts/thingsboard_device_credentials.html",{loader:()=>i(()=>import("./thingsboard_device_credentials.html-Brzlz27O.js"),[]),meta:{_blog:{title:"ThingsBoard设备登陆认证",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["ThingsBoard"],excerpt:`
<h2>ThingsBoard设备有关的表</h2>
<p><img src="/assets/images/thingsboard/thingsboard_device_table.png" alt="thingsboard_device_table"></p>
<ul>
<li><strong>device_profile</strong> 这个表相当于国内的“产品”的概念</li>
<li><strong>ota_package</strong> 这个表是OTA升级包相关的数据</li>
<li><strong>device</strong> 这个表是设备的数据</li>
<li><strong>device_credentials</strong> 这个表是设备的登陆验证凭证信息</li>
</ul>`},title:"ThingsBoard设备登陆认证"}}],["/posts/thingsboard_device_provision.html",{loader:()=>i(()=>import("./thingsboard_device_provision.html-BNY4purn.js"),[]),meta:{_blog:{title:"ThingsBoard设备激活",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["ThingsBoard"],excerpt:`
<ul>
<li>HTTP POST <code>/provision</code></li>
</ul>
<p>递交给<code>HttpTransportContext</code></p>
<p>传递到了<code>DefaultTransportService::process</code>当中做处理。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">DeviceProfileProvisionType</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token constant">DISABLED</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token constant">ALLOW_CREATE_NEW_DEVICES</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token constant">CHECK_PRE_PROVISIONED_DEVICES</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"ThingsBoard设备激活"}}],["/posts/thingsboard_rule_engine.html",{loader:()=>i(()=>import("./thingsboard_rule_engine.html-CbIgTyiU.js"),[]),meta:{_blog:{title:"ThingsBoard 规则引擎分析",author:"",date:"2020-01-01T00:00:00.000Z",category:["物联网开发"],tag:["ThingsBoard"],excerpt:`
<hr>
<h2>微服务系统架构</h2>
<p><img src="/assets/images/thingsboard/thingsboard_microservices_architecture.png" alt="系统架构"></p>
<h2>规则引擎系统架构</h2>
<p><img src="/assets/images/thingsboard/rule-engine-architecture.svg" alt="系统架构"></p>
<h2>系统默认的规则链</h2>
<p><img src="/assets/images/thingsboard/thingsboard_defualt_rule_chain.svg" alt="规则链"></p>`},title:"ThingsBoard 规则引擎分析"}}],["/posts/timestamp.html",{loader:()=>i(()=>import("./timestamp.html-mKJrnymW.js"),[]),meta:{_blog:{title:"Unix时间戳",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["时间戳"],excerpt:`
<hr>
<h2>关于Unix时间戳(Unix timestamp)</h2>
<p><code>时间戳(Timestamp)</code> 也被称作为 <code>Unix时间戳(Unix timestamp)</code>，或称<code>Unix时间(Unix time)</code>、<code>POSIX时间(POSIX time)</code>，是一种时间表示方式，定义为从<code>世界协调时间（Coordinated Universal Time，即UTC）</code>或称 <code>格林威治时间</code>的 <code>1970年01月01日00时00分00秒（00:00:00 GMT）</code> 起至现在的总秒数。Unix时间戳不仅被使用在Unix系统、类Unix系统中，也在许多其他操作系统中被广泛采用。</p>`},title:"Unix时间戳"}}],["/posts/traditional-cms-heavy-try-gowind-headless.html",{loader:()=>i(()=>import("./traditional-cms-heavy-try-gowind-headless.html-CgmTtJJQ.js"),[]),meta:{_blog:{title:"传统 CMS 太笨重？试试 Headless 架构的 GoWind，轻量又强大",author:"",date:"2026-04-09T00:00:00.000Z",category:["GoWind风行"],tag:["Golang","Go-Kratos","GoWind"],excerpt:`
<p>做企业官网、资讯平台、多端内容分发，你是否也被传统 CMS 的“笨重”折磨？部署时要配置一堆环境，启动慢到让人耐心耗尽，多端适配还要重复开发，稍微调整一下页面就要动后端代码，内存占用居高不下，运维起来更是费心费力。</p>
<p>在“轻量高效、多端融合”成为主流需求的今天，传统 CMS（如 PHP 系的 WordPress、织梦，Java 系的 Jeecms）的单体架构早已跟不上节奏。而 <strong>Headless 架构（无头架构）</strong> 的风行 GoWind，凭借 Go 语言原生优势与 Headless 核心设计，彻底打破传统 CMS 的桎梏，用“轻量不简陋、强大不复杂”的体验，成为中小企业、开发者的首选 CMS 解决方案。</p>`},title:"传统 CMS 太笨重？试试 Headless 架构的 GoWind，轻量又强大"}}],["/posts/tsdb_es.html",{loader:()=>i(()=>import("./tsdb_es.html-88r5yUr-.js"),[]),meta:{_blog:{title:"时序数据库应用 - ElasticSearch",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["时序数据库"],excerpt:`
<h2>数据库简介</h2>
<h2>搭建本地Docker数据库</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> pull bitnami/elasticsearch:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">--name</span> elasticsearch-test <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">9200</span>:9200 <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">9300</span>:9300 <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_USERNAME</span><span class="token operator">=</span>elastic <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">ELASTICSEARCH_PASSWORD</span><span class="token operator">=</span>elastic <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">xpack.security.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">discovery.type</span><span class="token operator">=</span>single-node <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> <span class="token assign-left variable">http.cors.enabled</span><span class="token operator">=</span>true <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-origin<span class="token operator">=</span>http://localhost:13580,http://127.0.0.1:13580 <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-headers<span class="token operator">=</span>X-Requested-With,X-Auth-Token,Content-Type,Content-Length,Authorization <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-e</span> http.cors.allow-credentials<span class="token operator">=</span>true <span class="token punctuation">\\</span></span>
<span class="line">bitnami/elasticsearch:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> pull appbaseio/dejavu:latest</span>
<span class="line"></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">--name</span> dejavu-test <span class="token punctuation">\\</span></span>
<span class="line"><span class="token parameter variable">-p</span> <span class="token number">13580</span>:1358 <span class="token punctuation">\\</span></span>
<span class="line">appbaseio/dejavu:latest</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">http://localhost:13580/</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"时序数据库应用 - ElasticSearch"}}],["/posts/tsdb_mongo.html",{loader:()=>i(()=>import("./tsdb_mongo.html-CP8MF8_B.js"),[]),meta:{_blog:{title:"时序数据库应用 - MongoDB",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["时序数据库"],excerpt:`
<h2>数据库简介</h2>
<h2>搭建本地Docker数据库</h2>
<h2>参考资料</h2>
`},title:"时序数据库应用 - MongoDB"}}],["/posts/tsdb_timescale.html",{loader:()=>i(()=>import("./tsdb_timescale.html-CFg3Dd1M.js"),[]),meta:{_blog:{title:"时序数据库应用 -TimeScaleDB",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["时序数据库"],excerpt:`
<hr>
<h2>数据库简介</h2>
<img src="https://www.timescale.com/images/icon.png" width="120px">
<p>TimescaleDB是基于PostgreSQL的时序数据库插件，完全继承了PostgreSQL的功能，TimescaleDB是一个开放源代码的时间序列数据库，针对快速提取和复杂查询进行了优化。它使用“完整的SQL”，并且与传统的关系数据库一样易于使用，但是扩展的方式以前只适用于NoSQL数据库。与这两种方案(关系型和NoSQL)所要求的权衡相比，TimescaleDB为时间序列数据提供了两种方案的最佳选择:</p>`},title:"时序数据库应用 -TimeScaleDB"}}],["/posts/types_of_exchanges_stock_options_crypto_and_more.html",{loader:()=>i(()=>import("./types_of_exchanges_stock_options_crypto_and_more.html-CDffIfw4.js"),[]),meta:{_blog:{title:"交易所类型：股票、期权、加密货币等",author:"",date:"2020-01-01T00:00:00.000Z",category:["量化开发"],tag:["交易所"],excerpt:`
<p>有多种类型的交易所可以促进金融工具的交易。最常见的交易所类型是：</p>
<h2>股票(Stock) 和 ETF 交易所</h2>
<p>股票和 ETF 交易所受美国证券交易委员会( SEC )监管，是最常见和最知名的资产交易所类型。股票和 ETF 交易所允许投资者和交易者买卖股票和交易所交易基金 ( ETF )。</p>
<p>股票代表着对公司的所有权，可以像任何其他类型的资产一样买卖。ETF 是在证券交易所交易的投资基金，由股票、债券、商品和/或其他资产的投资组合组成。</p>
<h2>期权(Options)交易所</h2>
<p>期权交易所受美国商品期货交易委员会 ( CFTC )监管，是一种衍生资产交易所。期权交易所允许交易者买卖期权合约。</p>`},title:"交易所类型：股票、期权、加密货币等"}}],["/posts/typescript_ip_computer.html",{loader:()=>i(()=>import("./typescript_ip_computer.html-DhMK2pMu.js"),[]),meta:{_blog:{title:"TypeScript IP 计算器",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["TypeScript"],excerpt:`
<h2>验证IP有效性</h2>
<div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code><span class="line"><span class="token comment">// 验证IP有效性</span></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">isValidIP</span><span class="token punctuation">(</span>ip<span class="token operator">:</span> <span class="token builtin">string</span><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">boolean</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">const</span> reg <span class="token operator">=</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$</span><span class="token regex-delimiter">/</span></span></span>
<span class="line">  <span class="token keyword">return</span> reg<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span>ip<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"TypeScript IP 计算器"}}],["/posts/typescript_minio_upload_file.html",{loader:()=>i(()=>import("./typescript_minio_upload_file.html-DUvgerWW.js"),[]),meta:{_blog:{title:"JavaScript/TypeScript 前端实现文件上传到 MinIO 完整指南",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["TypeScript"],excerpt:`
<p>以往前端实现文件上传到服务端，常用方案为 HTTP 上传或 FTP 上传，但这两种方式均存在明显短板：HTTP 上传易受网络波动影响，可靠性较差；FTP 配置复杂且安全性不足。随着对象存储服务（Object Storage Service, OSS）的普及，这一问题得到了有效解决。
对象存储（基于对象的存储）是一种专为海量非结构化数据设计的存储架构。与传统存储不同，它将数据封装为独立对象，捆绑元数据和唯一标识符，便于快速查找与访问。OSS 提供与平台无关的 RESTful API 接口，支持在任意应用、任意时间、任意地点存储和访问各类数据。</p>
<p>目前主流的开源 OSS 方案包括 <a href="(https://min.io/)">MinIO</a>和<a href="(https://ceph.io/en/)">Ceph</a>。其中 MinIO 凭借轻量、易用、兼容 S3 接口等优势，使用率持续攀升，成为开源对象存储的首选方案之一。本文将详细介绍如何基于 JavaScript/TypeScript 前端实现文件上传到 MinIO。</p>`},title:"JavaScript/TypeScript 前端实现文件上传到 MinIO 完整指南"}}],["/posts/ubuntu_install_cmake.html",{loader:()=>i(()=>import("./ubuntu_install_cmake.html-Cnx4qALt.js"),[]),meta:{_blog:{title:"Ubuntu安装CMake",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["CMake"],excerpt:`
<h2>1. 使用Apt安装</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> update<span class="token punctuation">;</span> <span class="token function">sudo</span> <span class="token function">apt</span> upgrade<span class="token punctuation">;</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> cmake<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Ubuntu安装CMake"}}],["/posts/ubuntu_install_coturn.html",{loader:()=>i(()=>import("./ubuntu_install_coturn.html-DKi1s0bz.js"),[]),meta:{_blog:{title:"Ubuntu 安装 CoTURN",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["CoTURN"],excerpt:`
<h2>使用apt安装</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token parameter variable">-y</span> update</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> <span class="token parameter variable">-y</span> <span class="token function">install</span> coturn</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Ubuntu 安装 CoTURN"}}],["/posts/unity_asset_bundle_file_format.html",{loader:()=>i(()=>import("./unity_asset_bundle_file_format.html-C7fsK6L3.js"),[]),meta:{_blog:{title:"Unity AssetBundle文件",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Unity"],excerpt:`
<h2>什么是AssetBundle</h2>
<p>AssetBundle 为资源的集合，可包含贴图(Textures)，材质(Materials)，声音(Audio)，动画资源(Animation Clips &amp; Animator controllers)，文字(Text assets)，甚至场景(Scenes) 等各式资源，允许游戏在运行时向远端服务器(Remote server)，要求载入AssetBundle 并且使用里头的资源。</p>
<p>因此可以利用AssetBundle 功能来制作关卡更新资源包，下载新的关卡资源，即是DLC (Downloadable content)。亦可用来更新游戏，例如特殊节庆时，更新游戏贴图材质，让游戏与玩家一同过节。</p>`},title:"Unity AssetBundle文件"}}],["/posts/upgrade_unity_project.html",{loader:()=>i(()=>import("./upgrade_unity_project.html-CDTcw1QY.js"),[]),meta:{_blog:{title:"升级旧版本的Unity项目",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Unity"],excerpt:`
<h2>UnityEngine.Application' does not contain a definition for bundleIdentifier'</h2>
<p>把 <code>Application.bundleIdentifier</code>修改为<code>Application.identifier</code>。</p>
<h2>升级粒子系统</h2>
<p>Unity2018.2.x之后，旧版 Particle System 相关API就完全移除掉了，这个升级器是Unity官方发布的，它可以<code>ParticleEmitter</code>, <code>ParticleAnimator</code>, <code>ParticleRenderer</code>等组件转换为<code>ParticleSystem</code> 和 <code>ParticleSystemRenderer</code>组件。</p>`},title:"升级旧版本的Unity项目"}}],["/posts/user_portrait.html",{loader:()=>i(()=>import("./user_portrait.html-BKK4ecfc.js"),[]),meta:{_blog:{title:"用户画像",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["用户画像"],excerpt:`
<h2>用户画像的3种标签类型</h2>
<p>用户画像建模其实就是对用户“打标签”，从对用户打标签的方式来看，一般分为3种类型：①统计类标签；②规则类标签；③机器学习挖掘类标签。</p>
<p>下面我们介绍这3种类型的标签的区别：</p>
<ol>
<li>
<p>统计类标签</p>
<p>这类标签是最为基础也最为常见的标签类型，例如，对于某个用户来说，其性别、年龄、城市、星座、近7日活跃时长、近7日活跃天数、近7日活跃次数等字段可以从用户注册数据、用户访问、消费数据中统计得出。该类标签构成了用户画像的基础。</p>
</li>
<li>
<p>规则类标签</p>
<p>该类标签基于用户行为及确定的规则产生。例如，对平台上“消费活跃”用户这一口径的定义为“近30天交易次数≥2”。在实际开发画像的过程中，由于运营人员对业务更为熟悉，而数据人员对数据的结构、分布、特征更为熟悉，因此规则类标签的规则由运营人员和数据人员共同协商确定；</p>
</li>
<li>
<p>机器学习挖掘类标签</p>
<p>该类标签通过机器学习挖掘产生，用于对用户的某些属性或某些行为进行预测判断。例如，根据一个用户的行为习惯判断该用户是男性还是女性、根据一个用户的消费习惯判断其对某商品的偏好程度。该类标签需要通过算法挖掘产生。</p>
</li>
</ol>`},title:"用户画像"}}],["/posts/using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.html",{loader:()=>i(()=>import("./using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.html-DJcZprYc.js"),[]),meta:{_blog:{title:"使用 PgBouncer 提高性能并减少 PostgreSQL 的负载",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["PgBouncer"],excerpt:`
<p><img src="/assets/images/postgresql/pgbouncer.png" alt="如何改进 PostgreSQL 数据库服务器架构连接管理"></p>
<p>这篇博文将会逐步介绍如何使用 PgBouncer 连接池来改进 PostgreSQL 数据库服务器架构连接管理、减少 PostgreSQL 服务器上的负载并提高性能。</p>
<p>以下是我们在本文中将要讲解的内容的细分主题：</p>
<ul>
<li>PostgreSQL 数据库服务器如何工作</li>
<li>使用 PgBouncer 池化器提高效率</li>
<li>如何安装和配置 PgBouncer</li>
</ul>`},title:"使用 PgBouncer 提高性能并减少 PostgreSQL 的负载"}}],["/posts/vite_permission_denied.html",{loader:()=>i(()=>import("./vite_permission_denied.html-bKUiGj-4.js"),[]),meta:{_blog:{title:"Vite permission denied 问题",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Vite"],excerpt:`
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"> ERROR  error when starting dev server:                                                                                                                                                                                                                                <span class="token number">11</span>:51:39  </span>
<span class="line">Error: listen EACCES: permission denied <span class="token number">0.0</span>.0.0:3100</span>
<span class="line">    at Server.setupListenHandle <span class="token punctuation">[</span>as _listen2<span class="token punctuation">]</span> <span class="token punctuation">(</span>node:net:1723:21<span class="token punctuation">)</span></span>
<span class="line">    at listenInCluster <span class="token punctuation">(</span>node:net:1788:12<span class="token punctuation">)</span></span>
<span class="line">    at Server.listen <span class="token punctuation">(</span>node:net:1876:7<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"Vite permission denied 问题"}}],["/posts/vue_low_version_problem.html",{loader:()=>i(()=>import("./vue_low_version_problem.html-CpCjFlxE.js"),[]),meta:{_blog:{title:"Vue低版本引起的问题",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Vue"],excerpt:`
<h2>Sass在v4.3.0版本之前使用node-sass需要原生编译libsass导致的问题</h2>
<p><code>Sass</code>在<code>v4.3.0</code>版本之前都是使用的<code>node-sass</code>，而<code>node-sass</code>的底层依赖 <code>libsass</code>，<code>libsass</code>是一个原生库，因此，在Windows下面需要强制用户必须安装<code>python2</code>和<code>Visual Studio</code>才能编译成功。这并不是一件很友好的事情，而且经常导致编译不成功。</p>`},title:"Vue低版本引起的问题"}}],["/posts/webgl_engine.html",{loader:()=>i(()=>import("./webgl_engine.html-DPZZIJu9.js"),[]),meta:{_blog:{title:"WebGL的图形引擎",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["WebGL"],excerpt:`
<h2>引擎列表</h2>
<table>
<thead>
<tr>
<th>名称</th>
<th>语言</th>
<th>特点</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/mrdoob/three.js/" target="_blank" rel="noopener noreferrer">ThreeJS</a></td>
<td>ES5</td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/BabylonJS/Babylon.js" target="_blank" rel="noopener noreferrer">BabylonJS</a></td>
<td>TypeScript</td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/daybrush/scenejs" target="_blank" rel="noopener noreferrer">SceneJS</a></td>
<td>TypeScript</td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/CesiumGS/cesium" target="_blank" rel="noopener noreferrer">CesiumJS</a></td>
<td>ES5</td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/playcanvas/engine" target="_blank" rel="noopener noreferrer">PlayCanvas</a></td>
<td>ES5</td>
<td></td>
</tr>
<tr>
<td><a href="https://www.egret.com/" target="_blank" rel="noopener noreferrer">Egret</a></td>
<td>ES5</td>
<td></td>
</tr>
<tr>
<td><a href="https://www.layabox.com/" target="_blank" rel="noopener noreferrer">LayaBox</a></td>
<td>ES5</td>
<td></td>
</tr>
<tr>
<td><a href="https://github.com/potree/potree//" target="_blank" rel="noopener noreferrer">potree</a></td>
<td>ES5</td>
<td></td>
</tr>
</tbody>
</table>`},title:"WebGL的图形引擎"}}],["/posts/webrtc_video_calling_with_flutter.html",{loader:()=>i(()=>import("./webrtc_video_calling_with_flutter.html-CqDU1_jF.js"),[]),meta:{_blog:{title:"使用 Flutter 进行 WebRTC 视频通话",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["WebRTC"],excerpt:`
<h2>介绍</h2>
<p>Flutter 上的 WebRTC 通常通过flutter_webrtc 库实现，该库包含 Flutter 支持的所有平台所需的 WebRTC 代码。该插件抽象出了 WebRTC 中几个难以实现的部分，本文构建的应用程序基于插件中给出的示例代码。</p>
<p>在本教程中，我们将向 Flutter 应用程序添加基于 WebRTC 的通话解决方案。</p>
<h2>设置 flutter_webrtc 插件</h2>
<p>必须设置各种组件才能实现完整的视频通话体验。第一个是将基础 WebRTC 插件添加到您的 Flutter 应用。在本课中，我们仅关注 Android 和 iOS，但请注意，可能需要进行额外设置才能在其他平台上设置类似的体验。</p>`},title:"使用 Flutter 进行 WebRTC 视频通话"}}],["/posts/weight_random_algorithm.html",{loader:()=>i(()=>import("./weight_random_algorithm.html-7toWrth4.js"),[]),meta:{_blog:{title:"加权随机（Weight random）算法",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["加权随机","算法"],excerpt:`
<ol>
<li>Linear Scan（线性扫描）</li>
<li>Binary Search（二叉查找）</li>
<li>Hopscotch Selection（跳房子）</li>
<li>Alias Method（别名方法）</li>
</ol>
<h2>Linear Scan（线性扫描）</h2>
<h2>Binary Search（二叉查找）</h2>
<h2>Hopscotch Selection（跳房子）</h2>
<h2>Walker-Vose Alias Method（别名方法）</h2>
<p>别名采样方法分为两个步骤：</p>
<ol>
<li>做表；</li>
<li>根据表进行采样。</li>
</ol>`},title:"加权随机（Weight random）算法"}}],["/posts/what_is_bi.html",{loader:()=>i(()=>import("./what_is_bi.html-72hTeZ3W.js"),[]),meta:{_blog:{title:"什么是BI",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["BI"],excerpt:`
<h2>BI的定义</h2>
<p><strong>BI</strong>全称：<strong>商业智能（Business Intelligence）</strong>，在传统企业中，它是一套完整的解决方案。将企业的数据有效整合，快速制作出报表以作出决策。商业智能BI在数据架构中处于前端分析的位置，其核心作用是对获取数据的多维度分析、数据的切片、数据的上钻和下钻、cube等。通过ETL数据抽取、转化形成一个完整的数据仓库、然后对数据仓库的数据进行抽取，而后是商业智能的前端分析和展示。</p>
<h2>BI的用途</h2>
<p>BI工具主要有两种用途。一种是利用BI制作自动化报表，数据类工作每天都会接触大量数据，并且需要整理汇总，这是一块很大的工作量。这部分工作可以交给BI自动化完成，从数据规整、建模到下载。</p>`},title:"什么是BI"}}],["/posts/what_is_data_lineage.html",{loader:()=>i(()=>import("./what_is_data_lineage.html-BFFiSxTj.js"),[]),meta:{_blog:{title:"什么是数据血缘",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["数据血缘"],excerpt:`
<p>大数据时代，数据的来源极其广泛，各种类型的数据在快速产生，数据也是爆发性增长。从数据的产生，通过加工融合流转产生新的数据，到最终消亡，数据之间的关联关系可以称之为数据血缘关系。在数据中台的大背景下，数仓的开发者经常需要解决以下问题：</p>
<p>面对成百上千张的数据表，不知道该如何关联，也不知道这些表具有什么业务价值</p>
<p>执行过长，慢的无法忍受的SQL脚本，却不敢轻易进行整改</p>
<p>数据表是否包含机密数据需要被清理，以及这些机密数据是否被转存导致权限放大</p>
<p>其实，以上的这些问题都可以统一归类为数据发现问题。大部分企业会针对离线数仓任务进行SQL分析，构建表和字段的血缘关系，数据发现包括但不限于: 数据 表/列的业务分类分级和机密字段识别等。</p>`},title:"什么是数据血缘"}}],["/posts/what_is_roguelike_roguelite.html",{loader:()=>i(()=>import("./what_is_roguelike_roguelite.html-BScqi-yx.js"),[]),meta:{_blog:{title:"Roguelike与Roguelite究竟是什么？",author:"",date:"2020-01-01T00:00:00.000Z",category:["游戏开发"],tag:["Roguelike","Roguelite"],excerpt:`
<p>如果有留意独立游戏，应该不时会看到「<code>Roguelike</code>」或「<code>Roguelite</code>」等字眼，我们介绍过的独立游戏中亦不乏此类作品。下文会为大家科普「Roguelike」的种种，以后看到游戏介绍中有这些字眼时，便知道是否自己想玩的类型了。</p>
<h2>《Rogue》的诞生</h2>
<p>原来「Roguelike」并不是一个生字，而是由「Rogue」及「like」两字组成，指的是「像Rogue的游戏」。《Rogue》，全名《Rogue: Exploring the Dungeons of Doom》，是由Michael Toy 和Glenn Wichman开发的地下城冒险游戏，当时两人都是加州大学克鲁兹分校的学生。</p>`},title:"Roguelike与Roguelite究竟是什么？"}}],["/posts/why_is_protobbuf_3_design_such_like_this.html",{loader:()=>i(()=>import("./why_is_protobbuf_3_design_such_like_this.html-CmLdqxhr.js"),[]),meta:{_blog:{title:"设计思考 - Protocol Buffers 3 为什么这样设计",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Protocol"],excerpt:`
<p>简单是一件非常困难的事！而深思熟虑的简单，可以给我们与学习最多的思考</p>
<p>Protocol Buffer 的第 3 版删除了一些特性（required, optional...），并且在默认值的设计上，做出了一个看起来很危险的重要决定。乍看之下匪夷所思，网路上也引起多人<a href="https://github.com/google/protobuf/issues/359" target="_blank" rel="noopener noreferrer">讨论</a>。通常这种去掉重要功能的决定，都有非常的理由，尝试理解别人的设计，可以让我们看得更远。现在，就让我们尝试从google的角度，思考一下Protocol Buffer的设计吧！</p>`},title:"设计思考 - Protocol Buffers 3 为什么这样设计"}}],["/posts/wifi_crack.html",{loader:()=>i(()=>import("./wifi_crack.html-HxCP5oiy.js"),[]),meta:{_blog:{title:"破解 WiFi 密码",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["WiFi"],excerpt:`
<h2>查看网卡名称</h2>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">ifconfig</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"破解 WiFi 密码"}}],["/posts/windows_docker_desktop_release_disk.html",{loader:()=>i(()=>import("./windows_docker_desktop_release_disk.html-CM6ORf_3.js"),[]),meta:{_blog:{title:"Windows下释放Docker所占用的WSL磁盘空间",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Docker","WSL"],excerpt:`
<p>使用下面的命令清理镜像：</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line"><span class="token function">docker</span> system prune</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Windows下释放Docker所占用的WSL磁盘空间"}}],["/posts/windows_install_flutter.html",{loader:()=>i(()=>import("./windows_install_flutter.html-BYw4VJxc.js"),[]),meta:{_blog:{title:"Windows安裝Flutter开发环境",author:"",date:"2020-01-01T00:00:00.000Z",category:["编程技术"],tag:["Windows","Flutter"],excerpt:`
<h2>安装Flutter</h2>
<div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell"><pre><code><span class="line">scoop install flutter</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div>`},title:"Windows安裝Flutter开发环境"}}],["/posts/windows_server_deploy_docker.html",{loader:()=>i(()=>import("./windows_server_deploy_docker.html-ChBKQ4Zt.js"),[]),meta:{_blog:{title:"Windows Server 部署 Docker",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Windows","Flutter"],excerpt:`
<p>Docker Desktop安装不了，只能安装Docker Toolbox。</p>
<p>通过国内镜像站下载：</p>
<ul>
<li>阿里云：<a href="https://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/" target="_blank" rel="noopener noreferrer">https://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/</a></li>
<li>DaoCloud： <a href="https://get.daocloud.io/toolbox/" target="_blank" rel="noopener noreferrer">https://get.daocloud.io/toolbox/</a></li>
</ul>`},title:"Windows Server 部署 Docker"}}],["/posts/wsl2_reboot.html",{loader:()=>i(()=>import("./wsl2_reboot.html-Y20tSlIG.js"),[]),meta:{_blog:{title:"WSL2重启",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Windows","WSL"],excerpt:`
<p>列出WSL子系统</p>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code><span class="line">wslconfig /list</span>
<span class="line">wsl <span class="token parameter variable">--list</span></span>
<span class="line">wsl <span class="token parameter variable">-l</span> <span class="token parameter variable">-v</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`},title:"WSL2重启"}}],["/posts/wsl2_set_proxy.html",{loader:()=>i(()=>import("./wsl2_set_proxy.html-CUez58MQ.js"),[]),meta:{_blog:{title:"WSL2设置网络代理",author:"",date:"2020-01-01T00:00:00.000Z",category:["运维技术"],tag:["Windows","WSL"],excerpt:`
<p>为了生计所迫，有时候不得不需要在WSL2下面使用代理。</p>
<h2>获取到宿主的访问IP地址</h2>
<p>WSL2要访问宿主的服务，并没有那么容易，并不能简单的通过127.0.0.1来访问，需要获取到宿主的访问IP地址。有两种办法可以访问宿主的IP：</p>
<ol>
<li><code>cat /etc/resolv.conf</code>命令获取<code>nameserver</code>；</li>
<li>如果安装了Docker，可以获取<code>host.docker.internal</code>。</li>
</ol>
<p>推荐使用第一种方法。</p>
<h2>配置代理</h2>`},title:"WSL2设置网络代理"}}],["/404.html",{loader:()=>i(()=>import("./404.html-DK2VotYe.js"),[]),meta:{title:""}}],["/category/",{loader:()=>i(()=>import("./index.html-DsxKylkp.js"),[]),meta:{title:"Categories"}}],["/category/%E5%81%A5%E5%BA%B7%E5%85%BB%E7%94%9F/",{loader:()=>i(()=>import("./index.html-qCfqOVMK.js"),[]),meta:{title:"Category 健康养生"}}],["/category/python%E7%BC%96%E7%A8%8B/",{loader:()=>i(()=>import("./index.html-CXTfGOmw.js"),[]),meta:{title:"Category Python编程"}}],["/category/%E9%9A%8F%E7%AC%94%E6%97%A5%E5%BF%97/",{loader:()=>i(()=>import("./index.html-pbnX1-Os.js"),[]),meta:{title:"Category 随笔日志"}}],["/category/%E4%BA%A7%E5%93%81%E8%AE%BE%E8%AE%A1/",{loader:()=>i(()=>import("./index.html-Bq9YcOO5.js"),[]),meta:{title:"Category 产品设计"}}],["/category/go%E7%BC%96%E7%A8%8B/",{loader:()=>i(()=>import("./index.html-C-0viXfZ.js"),[]),meta:{title:"Category Go编程"}}],["/category/c__%E7%BC%96%E7%A8%8B/",{loader:()=>i(()=>import("./index.html-CwdAwmJu.js"),[]),meta:{title:"Category C++编程"}}],["/category/%E8%BF%90%E7%BB%B4%E6%8A%80%E6%9C%AF/",{loader:()=>i(()=>import("./index.html-HuI8tquk.js"),[]),meta:{title:"Category 运维技术"}}],["/category/flutter%E7%BC%96%E7%A8%8B/",{loader:()=>i(()=>import("./index.html-DMiHm4NF.js"),[]),meta:{title:"Category Flutter编程"}}],["/category/%E7%BC%96%E7%A8%8B%E6%8A%80%E6%9C%AF/",{loader:()=>i(()=>import("./index.html-B_Lq48uk.js"),[]),meta:{title:"Category 编程技术"}}],["/category/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/",{loader:()=>i(()=>import("./index.html-CEgb34Oc.js"),[]),meta:{title:"Category 设计模式"}}],["/category/%E6%B1%BD%E8%BD%A6/",{loader:()=>i(()=>import("./index.html-6PQcOMKz.js"),[]),meta:{title:"Category 汽车"}}],["/category/%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1/",{loader:()=>i(()=>import("./index.html-Qn8VdMtt.js"),[]),meta:{title:"Category 架构设计"}}],["/category/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/",{loader:()=>i(()=>import("./index.html-DngU4dTm.js"),[]),meta:{title:"Category 游戏开发"}}],["/category/%E9%87%8F%E5%8C%96%E5%BC%80%E5%8F%91/",{loader:()=>i(()=>import("./index.html-CN6JdNC6.js"),[]),meta:{title:"Category 量化开发"}}],["/category/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91/",{loader:()=>i(()=>import("./index.html-CfLRgY11.js"),[]),meta:{title:"Category 物联网开发"}}],["/category/gowind%E9%A3%8E%E8%A1%8C/",{loader:()=>i(()=>import("./index.html-DdQ3F1on.js"),[]),meta:{title:"Category GoWind风行"}}],["/category/%E7%94%9F%E6%B4%BB%E6%9D%82%E8%AE%B0/",{loader:()=>i(()=>import("./index.html-v6Q5VoOz.js"),[]),meta:{title:"Category 生活杂记"}}],["/category/rust%E7%BC%96%E7%A8%8B/",{loader:()=>i(()=>import("./index.html-Dc46khKE.js"),[]),meta:{title:"Category Rust编程"}}],["/tag/",{loader:()=>i(()=>import("./index.html-pB3RTDhY.js"),[]),meta:{title:"Tags"}}],["/tag/%E5%81%A5%E5%BA%B7%E5%85%BB%E7%94%9F/",{loader:()=>i(()=>import("./index.html-LPR8E_SR.js"),[]),meta:{title:"Tag 健康养生"}}],["/tag/fastapi/",{loader:()=>i(()=>import("./index.html-B8pdweM0.js"),[]),meta:{title:"Tag fastapi"}}],["/tag/%E9%9A%8F%E7%AC%94%E6%97%A5%E5%BF%97/",{loader:()=>i(()=>import("./index.html-C63Pa4qc.js"),[]),meta:{title:"Tag 随笔日志"}}],["/tag/%E4%BA%A7%E5%93%81%E8%AE%BE%E8%AE%A1/",{loader:()=>i(()=>import("./index.html-d7uesi5I.js"),[]),meta:{title:"Tag 产品设计"}}],["/tag/golang/",{loader:()=>i(()=>import("./index.html-D4wDA6b6.js"),[]),meta:{title:"Tag Golang"}}],["/tag/%E6%9E%B6%E6%9E%84/",{loader:()=>i(()=>import("./index.html-Dm1x0oIu.js"),[]),meta:{title:"Tag 架构"}}],["/tag/asio/",{loader:()=>i(()=>import("./index.html-Bi3d9zE3.js"),[]),meta:{title:"Tag ASIO"}}],["/tag/cron/",{loader:()=>i(()=>import("./index.html-_DuPyZIq.js"),[]),meta:{title:"Tag cron"}}],["/tag/rclone/",{loader:()=>i(()=>import("./index.html-CJeQHb6u.js"),[]),meta:{title:"Tag rclone"}}],["/tag/flutter/",{loader:()=>i(()=>import("./index.html-DnfwnCFw.js"),[]),meta:{title:"Tag flutter"}}],["/tag/rxdart/",{loader:()=>i(()=>import("./index.html-CN5Vn8Aq.js"),[]),meta:{title:"Tag RxDart"}}],["/tag/make/",{loader:()=>i(()=>import("./index.html-BJVVQYG3.js"),[]),meta:{title:"Tag Make"}}],["/tag/cmake/",{loader:()=>i(()=>import("./index.html-RdfpXJQ1.js"),[]),meta:{title:"Tag CMake"}}],["/tag/ninja/",{loader:()=>i(()=>import("./index.html-D6IrLEaR.js"),[]),meta:{title:"Tag Ninja"}}],["/tag/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/",{loader:()=>i(()=>import("./index.html-Cj3rKgDv.js"),[]),meta:{title:"Tag 设计模式"}}],["/tag/cache-aside-pattern/",{loader:()=>i(()=>import("./index.html-ahnCIKSp.js"),[]),meta:{title:"Tag Cache Aside Pattern"}}],["/tag/%E7%BC%93%E5%AD%98%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/",{loader:()=>i(()=>import("./index.html-BwgRXRNk.js"),[]),meta:{title:"Tag 缓存设计模式"}}],["/tag/%E6%B1%BD%E8%BD%A6/",{loader:()=>i(()=>import("./index.html-HV1kmEKt.js"),[]),meta:{title:"Tag 汽车"}}],["/tag/go/",{loader:()=>i(()=>import("./index.html-baaen4SW.js"),[]),meta:{title:"Tag go"}}],["/tag/cdc/",{loader:()=>i(()=>import("./index.html-XfZySdIM.js"),[]),meta:{title:"Tag CDC"}}],["/tag/postgresql/",{loader:()=>i(()=>import("./index.html-CXYg6gd2.js"),[]),meta:{title:"Tag PostgreSQL"}}],["/tag/centos/",{loader:()=>i(()=>import("./index.html-BNIMHsTO.js"),[]),meta:{title:"Tag Centos"}}],["/tag/docker/",{loader:()=>i(()=>import("./index.html-BbweKyfC.js"),[]),meta:{title:"Tag docker"}}],["/tag/%E6%9D%80%E6%AF%92/",{loader:()=>i(()=>import("./index.html-D2MqKv9M.js"),[]),meta:{title:"Tag 杀毒"}}],["/tag/clion/",{loader:()=>i(()=>import("./index.html-NO3A-Yk5.js"),[]),meta:{title:"Tag CLion"}}],["/tag/%E4%BA%91%E6%89%8B%E6%9C%BA/",{loader:()=>i(()=>import("./index.html-D34jPRzv.js"),[]),meta:{title:"Tag 云手机"}}],["/tag/googletest/",{loader:()=>i(()=>import("./index.html-DJc66OMN.js"),[]),meta:{title:"Tag GoogleTest"}}],["/tag/cococs2dx/",{loader:()=>i(()=>import("./index.html-DmmeIIg3.js"),[]),meta:{title:"Tag Cococs2dx"}}],["/tag/cocos-creator/",{loader:()=>i(()=>import("./index.html-B7LzrnAu.js"),[]),meta:{title:"Tag Cocos Creator"}}],["/tag/%E4%BB%A3%E7%A0%81%E6%B3%A8%E9%87%8A/",{loader:()=>i(()=>import("./index.html-D7fjSnOZ.js"),[]),meta:{title:"Tag 代码注释"}}],["/tag/ide/",{loader:()=>i(()=>import("./index.html-BFeVkUZh.js"),[]),meta:{title:"Tag IDE"}}],["/tag/python/",{loader:()=>i(()=>import("./index.html-BG2ZH0wk.js"),[]),meta:{title:"Tag Python"}}],["/tag/trc20/",{loader:()=>i(()=>import("./index.html-BCTflzEF.js"),[]),meta:{title:"Tag TRC20"}}],["/tag/c__/",{loader:()=>i(()=>import("./index.html-x2wcLwkS.js"),[]),meta:{title:"Tag C++"}}],["/tag/%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2/",{loader:()=>i(()=>import("./index.html-DPjtUuKe.js"),[]),meta:{title:"Tag 类型转换"}}],["/tag/cqrs/",{loader:()=>i(()=>import("./index.html-TZx-EVs_.js"),[]),meta:{title:"Tag CQRS"}}],["/tag/kafka-streams/",{loader:()=>i(()=>import("./index.html-CTy3QJL1.js"),[]),meta:{title:"Tag Kafka Streams"}}],["/tag/bazel/",{loader:()=>i(()=>import("./index.html-OX6satVC.js"),[]),meta:{title:"Tag Bazel"}}],["/tag/docker/",{loader:()=>i(()=>import("./index.html-BbweKyfC.js"),[]),meta:{title:"Tag Docker"}}],["/tag/go/",{loader:()=>i(()=>import("./index.html-baaen4SW.js"),[]),meta:{title:"Tag Go"}}],["/tag/crontab/",{loader:()=>i(()=>import("./index.html-CcyWBHLZ.js"),[]),meta:{title:"Tag crontab"}}],["/tag/%E5%AE%A2%E6%88%B7%E7%95%99%E5%AD%98%E7%8E%87/",{loader:()=>i(()=>import("./index.html-CnjQtcyt.js"),[]),meta:{title:"Tag 客户留存率"}}],["/tag/efk/",{loader:()=>i(()=>import("./index.html-BEPc9mYx.js"),[]),meta:{title:"Tag EFK"}}],["/tag/rustdesk/",{loader:()=>i(()=>import("./index.html-ClbcZHA4.js"),[]),meta:{title:"Tag RustDesk"}}],["/tag/jitsi-meet/",{loader:()=>i(()=>import("./index.html-DzRPFl0v.js"),[]),meta:{title:"Tag Jitsi Meet"}}],["/tag/traefik/",{loader:()=>i(()=>import("./index.html-C3wReRLY.js"),[]),meta:{title:"Tag Traefik"}}],["/tag/swagger/",{loader:()=>i(()=>import("./index.html-D4Ojofk2.js"),[]),meta:{title:"Tag Swagger"}}],["/tag/docker-hub/",{loader:()=>i(()=>import("./index.html-Du1zTCa0.js"),[]),meta:{title:"Tag Docker Hub"}}],["/tag/vim/",{loader:()=>i(()=>import("./index.html-8q9QAeww.js"),[]),meta:{title:"Tag VIM"}}],["/tag/word/",{loader:()=>i(()=>import("./index.html-Ce1BBj6U.js"),[]),meta:{title:"Tag Word"}}],["/tag/vba/",{loader:()=>i(()=>import("./index.html-CltWEPYc.js"),[]),meta:{title:"Tag VBA"}}],["/tag/doris/",{loader:()=>i(()=>import("./index.html-CcJmaHc9.js"),[]),meta:{title:"Tag Doris"}}],["/tag/%E9%87%8F%E5%8C%96%E4%BA%A4%E6%98%93/",{loader:()=>i(()=>import("./index.html-RvRRaMX6.js"),[]),meta:{title:"Tag 量化交易"}}],["/tag/flutter/",{loader:()=>i(()=>import("./index.html-DnfwnCFw.js"),[]),meta:{title:"Tag Flutter"}}],["/tag/widget/",{loader:()=>i(()=>import("./index.html-LtR4G70k.js"),[]),meta:{title:"Tag Widget"}}],["/tag/ent/",{loader:()=>i(()=>import("./index.html-CVILXTx1.js"),[]),meta:{title:"Tag Ent"}}],["/tag/sql/",{loader:()=>i(()=>import("./index.html-0ZeZN28x.js"),[]),meta:{title:"Tag SQL"}}],["/tag/excel/",{loader:()=>i(()=>import("./index.html-CajkjV20.js"),[]),meta:{title:"Tag Excel"}}],["/tag/%E9%85%8D%E8%89%B2/",{loader:()=>i(()=>import("./index.html-C0rDdpuG.js"),[]),meta:{title:"Tag 配色"}}],["/tag/typescript/",{loader:()=>i(()=>import("./index.html-Xg6JXsRG.js"),[]),meta:{title:"Tag TypeScript"}}],["/tag/c_/",{loader:()=>i(()=>import("./index.html-B4jXCDyh.js"),[]),meta:{title:"Tag C#"}}],["/tag/sealed-class/",{loader:()=>i(()=>import("./index.html-CphxOvGz.js"),[]),meta:{title:"Tag Sealed Class"}}],["/tag/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F/",{loader:()=>i(()=>import("./index.html-iXQGBaX_.js"),[]),meta:{title:"Tag 微信小程序"}}],["/tag/%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB/",{loader:()=>i(()=>import("./index.html-BPr1oD_c.js"),[]),meta:{title:"Tag 人脸识别"}}],["/tag/rk3588s/",{loader:()=>i(()=>import("./index.html-BGnxzSYX.js"),[]),meta:{title:"Tag RK3588S"}}],["/tag/android-studio/",{loader:()=>i(()=>import("./index.html-DZwHs1se.js"),[]),meta:{title:"Tag Android Studio"}}],["/tag/ios/",{loader:()=>i(()=>import("./index.html-mweNbgG1.js"),[]),meta:{title:"Tag iOS"}}],["/tag/getx/",{loader:()=>i(()=>import("./index.html-C8Htv5SV.js"),[]),meta:{title:"Tag GetX"}}],["/tag/%E9%B8%BF%E8%92%99/",{loader:()=>i(()=>import("./index.html-CvDixrAK.js"),[]),meta:{title:"Tag 鸿蒙"}}],["/tag/%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93/",{loader:()=>i(()=>import("./index.html-BBgwsidM.js"),[]),meta:{title:"Tag 字体渲染"}}],["/tag/%E6%9C%9F%E8%B4%A7/",{loader:()=>i(()=>import("./index.html-6uiN9wux.js"),[]),meta:{title:"Tag 期货"}}],["/tag/futures/",{loader:()=>i(()=>import("./index.html-_1R4HGE5.js"),[]),meta:{title:"Tag Futures"}}],["/tag/%E5%9C%B0%E7%90%86%E5%9B%B4%E6%A0%8F/",{loader:()=>i(()=>import("./index.html-BlGI_nab.js"),[]),meta:{title:"Tag 地理围栏"}}],["/tag/geo/",{loader:()=>i(()=>import("./index.html-PeqGF8s4.js"),[]),meta:{title:"Tag GEO"}}],["/tag/git/",{loader:()=>i(()=>import("./index.html-C92gsd3O.js"),[]),meta:{title:"Tag Git"}}],["/tag/gowind/",{loader:()=>i(()=>import("./index.html-C16Vpv52.js"),[]),meta:{title:"Tag GoWind"}}],["/tag/%E9%80%9A%E7%9F%A5%E7%B3%BB%E7%BB%9F/",{loader:()=>i(()=>import("./index.html-DieF1sYn.js"),[]),meta:{title:"Tag 通知系统"}}],["/tag/vue3/",{loader:()=>i(()=>import("./index.html-Dxs4f1dC.js"),[]),meta:{title:"Tag Vue3"}}],["/tag/react/",{loader:()=>i(()=>import("./index.html-E4TTXYZH.js"),[]),meta:{title:"Tag React"}}],["/tag/protobuf/",{loader:()=>i(()=>import("./index.html-Doucd7el.js"),[]),meta:{title:"Tag Protobuf"}}],["/tag/ai/",{loader:()=>i(()=>import("./index.html-B_1-iiPu.js"),[]),meta:{title:"Tag AI"}}],["/tag/dart/",{loader:()=>i(()=>import("./index.html-DtjnIbIX.js"),[]),meta:{title:"Tag Dart"}}],["/tag/cms/",{loader:()=>i(()=>import("./index.html-DdvfPdwk.js"),[]),meta:{title:"Tag CMS"}}],["/tag/go-kratos/",{loader:()=>i(()=>import("./index.html-CUT46SP7.js"),[]),meta:{title:"Tag Go-Kratos"}}],["/tag/react.js/",{loader:()=>i(()=>import("./index.html-_WpcZal9.js"),[]),meta:{title:"Tag React.js"}}],["/tag/llm/",{loader:()=>i(()=>import("./index.html-CGyA0aTN.js"),[]),meta:{title:"Tag LLM"}}],["/tag/%E6%95%B0%E6%8D%AE%E5%AE%89%E5%85%A8/",{loader:()=>i(()=>import("./index.html-B3VPikDW.js"),[]),meta:{title:"Tag 数据安全"}}],["/tag/vue/",{loader:()=>i(()=>import("./index.html-DZs5kdHQ.js"),[]),meta:{title:"Tag Vue"}}],["/tag/nuxt/",{loader:()=>i(()=>import("./index.html-DrQBGiSn.js"),[]),meta:{title:"Tag Nuxt"}}],["/tag/%E5%88%86%E5%B8%83%E5%BC%8F%E4%BB%BB%E5%8A%A1/",{loader:()=>i(()=>import("./index.html-McvQkzSp.js"),[]),meta:{title:"Tag 分布式任务"}}],["/tag/taro/",{loader:()=>i(()=>import("./index.html-CZrO3mtV.js"),[]),meta:{title:"Tag Taro"}}],["/tag/crdt/",{loader:()=>i(()=>import("./index.html-CSZ6jlzk.js"),[]),meta:{title:"Tag CRDT"}}],["/tag/%E5%8D%8F%E5%90%8C%E7%BC%96%E8%BE%91/",{loader:()=>i(()=>import("./index.html-CAgI5P_n.js"),[]),meta:{title:"Tag 协同编辑"}}],["/tag/erp/",{loader:()=>i(()=>import("./index.html-D9H5bknu.js"),[]),meta:{title:"Tag ERP"}}],["/tag/%E6%95%B0%E6%8D%AE%E4%B8%80%E8%87%B4%E6%80%A7/",{loader:()=>i(()=>import("./index.html-CADIp9GW.js"),[]),meta:{title:"Tag 数据一致性"}}],["/tag/iam/",{loader:()=>i(()=>import("./index.html-DjSQ-DNr.js"),[]),meta:{title:"Tag IAM"}}],["/tag/jwt/",{loader:()=>i(()=>import("./index.html-DN8OuZah.js"),[]),meta:{title:"Tag JWT"}}],["/tag/casbin/",{loader:()=>i(()=>import("./index.html-CgaPKdde.js"),[]),meta:{title:"Tag Casbin"}}],["/tag/opa/",{loader:()=>i(()=>import("./index.html-CUvAKVVq.js"),[]),meta:{title:"Tag OPA"}}],["/tag/%E5%AE%9E%E6%97%B6%E5%8D%8F%E4%BD%9C/",{loader:()=>i(()=>import("./index.html-DzyjvCGa.js"),[]),meta:{title:"Tag 实时协作"}}],["/tag/%E7%AE%97%E6%B3%95/",{loader:()=>i(()=>import("./index.html-C3i6bFL9.js"),[]),meta:{title:"Tag 算法"}}],["/tag/%E8%AE%B0%E8%B4%A6/",{loader:()=>i(()=>import("./index.html-BYw0Gf0s.js"),[]),meta:{title:"Tag 记账"}}],["/tag/%E5%B7%A5%E4%BD%9C%E6%B5%81/",{loader:()=>i(()=>import("./index.html-CMdrJJG1.js"),[]),meta:{title:"Tag 工作流"}}],["/tag/%E5%AE%A1%E6%89%B9%E6%B5%81/",{loader:()=>i(()=>import("./index.html-B6fIK6WV.js"),[]),meta:{title:"Tag 审批流"}}],["/tag/mqtt/",{loader:()=>i(()=>import("./index.html-B45wP6d4.js"),[]),meta:{title:"Tag MQTT"}}],["/tag/%E8%BF%90%E7%BB%B4%E5%B9%B3%E5%8F%B0/",{loader:()=>i(()=>import("./index.html-DvHfLxOK.js"),[]),meta:{title:"Tag 运维平台"}}],["/tag/%E5%88%86%E5%B8%83%E5%BC%8F/",{loader:()=>i(()=>import("./index.html-jY7oZU0d.js"),[]),meta:{title:"Tag 分布式"}}],["/tag/shop/",{loader:()=>i(()=>import("./index.html-CoU9pC1K.js"),[]),meta:{title:"Tag Shop"}}],["/tag/%E7%94%B5%E5%95%86/",{loader:()=>i(()=>import("./index.html-C3hoRpK9.js"),[]),meta:{title:"Tag 电商"}}],["/tag/%E8%AE%A2%E5%8D%95%E7%B3%BB%E7%BB%9F/",{loader:()=>i(()=>import("./index.html-DcZs5YaQ.js"),[]),meta:{title:"Tag 订单系统"}}],["/tag/%E7%9F%AD%E8%A7%86%E9%A2%91/",{loader:()=>i(()=>import("./index.html-BFtE39Ua.js"),[]),meta:{title:"Tag 短视频"}}],["/tag/%E5%A4%9A%E7%A7%9F%E6%88%B7/",{loader:()=>i(()=>import("./index.html-Bw-Sm-FX.js"),[]),meta:{title:"Tag 多租户"}}],["/tag/%E7%A7%BB%E5%8A%A8%E7%AB%AF/",{loader:()=>i(()=>import("./index.html-DzTQ1sbg.js"),[]),meta:{title:"Tag 移动端"}}],["/tag/%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F/",{loader:()=>i(()=>import("./index.html-BGerJRKx.js"),[]),meta:{title:"Tag 推荐系统"}}],["/tag/gowind-toolkit/",{loader:()=>i(()=>import("./index.html-B8200qdg.js"),[]),meta:{title:"Tag GoWind Toolkit"}}],["/tag/%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90/",{loader:()=>i(()=>import("./index.html-DazEUxNS.js"),[]),meta:{title:"Tag 代码生成"}}],["/tag/element-plus/",{loader:()=>i(()=>import("./index.html-CC3zVgIA.js"),[]),meta:{title:"Tag Element Plus"}}],["/tag/ant-design/",{loader:()=>i(()=>import("./index.html-BMIIOmIG.js"),[]),meta:{title:"Tag Ant Design"}}],["/tag/uba/",{loader:()=>i(()=>import("./index.html-BSNddowp.js"),[]),meta:{title:"Tag UBA"}}],["/tag/%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90/",{loader:()=>i(()=>import("./index.html-CfwykZ1j.js"),[]),meta:{title:"Tag 大数据分析"}}],["/tag/clickhouse/",{loader:()=>i(()=>import("./index.html-B4cupyxa.js"),[]),meta:{title:"Tag ClickHouse"}}],["/tag/olap/",{loader:()=>i(()=>import("./index.html-C78zJu8u.js"),[]),meta:{title:"Tag OLAP"}}],["/tag/%E6%95%B0%E6%8D%AE%E6%9E%B6%E6%9E%84/",{loader:()=>i(()=>import("./index.html-KKO-Zvj1.js"),[]),meta:{title:"Tag 数据架构"}}],["/tag/rust/",{loader:()=>i(()=>import("./index.html-CyFmzif1.js"),[]),meta:{title:"Tag Rust"}}],["/tag/%E5%BE%AE%E6%9C%8D%E5%8A%A1/",{loader:()=>i(()=>import("./index.html-Cs8AbYK3.js"),[]),meta:{title:"Tag 微服务"}}],["/tag/%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1/",{loader:()=>i(()=>import("./index.html-BHA9vamQ.js"),[]),meta:{title:"Tag 架构设计"}}],["/tag/webrtc/",{loader:()=>i(()=>import("./index.html-COjoYKlb.js"),[]),meta:{title:"Tag WebRTC"}}],["/tag/security/",{loader:()=>i(()=>import("./index.html-DFqPcz5k.js"),[]),meta:{title:"Tag Security"}}],["/tag/saas/",{loader:()=>i(()=>import("./index.html-CtUYZptM.js"),[]),meta:{title:"Tag SaaS"}}],["/tag/mongodb/",{loader:()=>i(()=>import("./index.html-qCF0vlQu.js"),[]),meta:{title:"Tag MongoDB"}}],["/tag/kratos/",{loader:()=>i(()=>import("./index.html-CsQzz7Bs.js"),[]),meta:{title:"Tag Kratos"}}],["/tag/crud/",{loader:()=>i(()=>import("./index.html-_4c0RzQP.js"),[]),meta:{title:"Tag CRUD"}}],["/tag/gorm/",{loader:()=>i(()=>import("./index.html-KaVRIo9B.js"),[]),meta:{title:"Tag GORM"}}],["/tag/wire/",{loader:()=>i(()=>import("./index.html-4tAPyQSG.js"),[]),meta:{title:"Tag Wire"}}],["/tag/headless-cms/",{loader:()=>i(()=>import("./index.html-DR7bLnr0.js"),[]),meta:{title:"Tag Headless CMS"}}],["/tag/wasm/",{loader:()=>i(()=>import("./index.html-CKDvh4m5.js"),[]),meta:{title:"Tag WASM"}}],["/tag/%E9%9A%8F%E6%9C%BA%E7%A7%8D%E5%AD%90/",{loader:()=>i(()=>import("./index.html-CDmWhGcZ.js"),[]),meta:{title:"Tag 随机种子"}}],["/tag/macos/",{loader:()=>i(()=>import("./index.html-BTOUrL7Q.js"),[]),meta:{title:"Tag MacOS"}}],["/tag/ubuntu/",{loader:()=>i(()=>import("./index.html-DQXJBeF5.js"),[]),meta:{title:"Tag Ubuntu"}}],["/tag/gcc/",{loader:()=>i(()=>import("./index.html-CcjYqId0.js"),[]),meta:{title:"Tag GCC"}}],["/tag/godot/",{loader:()=>i(()=>import("./index.html-CyIufILk.js"),[]),meta:{title:"Tag Godot"}}],["/tag/clang/",{loader:()=>i(()=>import("./index.html-DAehOvdP.js"),[]),meta:{title:"Tag Clang"}}],["/tag/superset/",{loader:()=>i(()=>import("./index.html-Czq4Q2tL.js"),[]),meta:{title:"Tag Superset"}}],["/tag/centos/",{loader:()=>i(()=>import("./index.html-BNIMHsTO.js"),[]),meta:{title:"Tag CentOS"}}],["/tag/opencv/",{loader:()=>i(()=>import("./index.html-Bc4D3wnz.js"),[]),meta:{title:"Tag OpenCV"}}],["/tag/%E5%92%96%E5%95%A1/",{loader:()=>i(()=>import("./index.html-795aFcmX.js"),[]),meta:{title:"Tag 咖啡"}}],["/tag/android/",{loader:()=>i(()=>import("./index.html-DXxRSmBj.js"),[]),meta:{title:"Tag Android"}}],["/tag/google-play/",{loader:()=>i(()=>import("./index.html-D9abngeZ.js"),[]),meta:{title:"Tag Google Play"}}],["/tag/unity-webgl/",{loader:()=>i(()=>import("./index.html-DeIqiiUP.js"),[]),meta:{title:"Tag Unity WebGL"}}],["/tag/dexie/",{loader:()=>i(()=>import("./index.html-T1GvDR_j.js"),[]),meta:{title:"Tag Dexie"}}],["/tag/indexeddb/",{loader:()=>i(()=>import("./index.html-BBEPWGZ5.js"),[]),meta:{title:"Tag IndexedDB"}}],["/tag/htop/",{loader:()=>i(()=>import("./index.html-1xCt_Luh.js"),[]),meta:{title:"Tag htop"}}],["/tag/im/",{loader:()=>i(()=>import("./index.html-D4JIBEfh.js"),[]),meta:{title:"Tag IM"}}],["/tag/postgresql/",{loader:()=>i(()=>import("./index.html-CXYg6gd2.js"),[]),meta:{title:"Tag Postgresql"}}],["/tag/mattermost/",{loader:()=>i(()=>import("./index.html-CrhRn8sL.js"),[]),meta:{title:"Tag Mattermost"}}],["/tag/qt/",{loader:()=>i(()=>import("./index.html-DJovpyeK.js"),[]),meta:{title:"Tag Qt"}}],["/tag/tl_dr/",{loader:()=>i(()=>import("./index.html-BEL7g42J.js"),[]),meta:{title:"Tag TL;DR"}}],["/tag/swift/",{loader:()=>i(()=>import("./index.html-BZmnv0Dv.js"),[]),meta:{title:"Tag Swift"}}],["/tag/javascript/",{loader:()=>i(()=>import("./index.html-DlAG5gio.js"),[]),meta:{title:"Tag Javascript"}}],["/tag/jetbrains/",{loader:()=>i(()=>import("./index.html-79-7PFVh.js"),[]),meta:{title:"Tag JetBrains"}}],["/tag/typescript/",{loader:()=>i(()=>import("./index.html-Xg6JXsRG.js"),[]),meta:{title:"Tag Typescript"}}],["/tag/libuv/",{loader:()=>i(()=>import("./index.html-KQDhfNuM.js"),[]),meta:{title:"Tag libuv"}}],["/tag/linux/",{loader:()=>i(()=>import("./index.html-7GPmsZW0.js"),[]),meta:{title:"Tag Linux"}}],["/tag/%E6%9C%AC%E5%9C%B0%E5%8C%96/",{loader:()=>i(()=>import("./index.html-Drj-G6IB.js"),[]),meta:{title:"Tag 本地化"}}],["/tag/%E5%9B%BD%E9%99%85%E5%8C%96/",{loader:()=>i(()=>import("./index.html-CBtHTc38.js"),[]),meta:{title:"Tag 国际化"}}],["/tag/%E7%8A%B6%E6%80%81%E5%90%8C%E6%AD%A5/",{loader:()=>i(()=>import("./index.html-CHdr9e-e.js"),[]),meta:{title:"Tag 状态同步"}}],["/tag/%E5%B8%A7%E5%90%8C%E6%AD%A5/",{loader:()=>i(()=>import("./index.html-CAsxNYPH.js"),[]),meta:{title:"Tag 帧同步"}}],["/tag/%E6%B3%A1%E6%B3%A1%E6%B0%B4/",{loader:()=>i(()=>import("./index.html-BdCiTijR.js"),[]),meta:{title:"Tag 泡泡水"}}],["/tag/markdown/",{loader:()=>i(()=>import("./index.html-Bah51zJb.js"),[]),meta:{title:"Tag Markdown"}}],["/tag/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/",{loader:()=>i(()=>import("./index.html-BQXthZTY.js"),[]),meta:{title:"Tag 机器学习"}}],["/tag/qtt/",{loader:()=>i(()=>import("./index.html-ByAtJVMi.js"),[]),meta:{title:"Tag QTT"}}],["/tag/msb/",{loader:()=>i(()=>import("./index.html-CkpCOi4x.js"),[]),meta:{title:"Tag MSB"}}],["/tag/lsb/",{loader:()=>i(()=>import("./index.html-h8IaMeVo.js"),[]),meta:{title:"Tag LSB"}}],["/tag/mysql/",{loader:()=>i(()=>import("./index.html-Y1eC0G5n.js"),[]),meta:{title:"Tag MySQL"}}],["/tag/npm/",{loader:()=>i(()=>import("./index.html-R_VIjEWn.js"),[]),meta:{title:"Tag npm"}}],["/tag/pnpm/",{loader:()=>i(()=>import("./index.html-Bot1xssn.js"),[]),meta:{title:"Tag pnpm"}}],["/tag/yarn/",{loader:()=>i(()=>import("./index.html-BA68y9nr.js"),[]),meta:{title:"Tag yarn"}}],["/tag/ocr/",{loader:()=>i(()=>import("./index.html-BGlBUi6d.js"),[]),meta:{title:"Tag OCR"}}],["/tag/ohlc/",{loader:()=>i(()=>import("./index.html-CQ-Uf8M5.js"),[]),meta:{title:"Tag OHLC"}}],["/tag/oltp/",{loader:()=>i(()=>import("./index.html-BLLaamZB.js"),[]),meta:{title:"Tag OLTP"}}],["/tag/openai/",{loader:()=>i(()=>import("./index.html--kb8eW8N.js"),[]),meta:{title:"Tag OpenAI"}}],["/tag/openapi/",{loader:()=>i(()=>import("./index.html-C67MssBO.js"),[]),meta:{title:"Tag OpenAPI"}}],["/tag/%E6%95%B0%E7%BB%87/",{loader:()=>i(()=>import("./index.html-DhXM2oEr.js"),[]),meta:{title:"Tag 数织"}}],["/tag/ping/",{loader:()=>i(()=>import("./index.html-BGTdTNxO.js"),[]),meta:{title:"Tag Ping"}}],["/tag/%E4%BA%BA%E4%BD%93%E5%A7%BF%E6%80%81%E8%AF%86%E5%88%AB/",{loader:()=>i(()=>import("./index.html-C32h0nBa.js"),[]),meta:{title:"Tag 人体姿态识别"}}],["/tag/%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2/",{loader:()=>i(()=>import("./index.html-DcB-TPDn.js"),[]),meta:{title:"Tag 全文搜索"}}],["/tag/%E4%BA%A4%E5%8F%89%E8%A1%A8/",{loader:()=>i(()=>import("./index.html-DNyMns5-.js"),[]),meta:{title:"Tag 交叉表"}}],["/tag/prometheus/",{loader:()=>i(()=>import("./index.html-pEni5nIN.js"),[]),meta:{title:"Tag Prometheus"}}],["/tag/docx/",{loader:()=>i(()=>import("./index.html-CpDUhhde.js"),[]),meta:{title:"Tag Docx"}}],["/tag/quic/",{loader:()=>i(()=>import("./index.html-C8TMUXqC.js"),[]),meta:{title:"Tag QUIC"}}],["/tag/reactor/",{loader:()=>i(()=>import("./index.html-0V6TXOLt.js"),[]),meta:{title:"Tag Reactor"}}],["/tag/websocket/",{loader:()=>i(()=>import("./index.html-DYkYTTab.js"),[]),meta:{title:"Tag Websocket"}}],["/tag/kcp/",{loader:()=>i(()=>import("./index.html-CvPums-p.js"),[]),meta:{title:"Tag KCP"}}],["/tag/kratos-transport/",{loader:()=>i(()=>import("./index.html-LyYLxdvT.js"),[]),meta:{title:"Tag Kratos-Transport"}}],["/tag/redis/",{loader:()=>i(()=>import("./index.html-Cnjca6oN.js"),[]),meta:{title:"Tag Redis"}}],["/tag/rest/",{loader:()=>i(()=>import("./index.html-BLISjjYy.js"),[]),meta:{title:"Tag REST"}}],["/tag/coturn/",{loader:()=>i(()=>import("./index.html-B2cGtA_8.js"),[]),meta:{title:"Tag CoTURN"}}],["/tag/rushwind/",{loader:()=>i(()=>import("./index.html-DV_w7PHH.js"),[]),meta:{title:"Tag RushWind"}}],["/tag/%E5%A5%91%E7%BA%A6%E6%B5%8B%E8%AF%95/",{loader:()=>i(()=>import("./index.html-CzHXgxtK.js"),[]),meta:{title:"Tag 契约测试"}}],["/tag/%E4%B8%AD%E5%90%8E%E5%8F%B0/",{loader:()=>i(()=>import("./index.html-mkzMOuW9.js"),[]),meta:{title:"Tag 中后台"}}],["/tag/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/",{loader:()=>i(()=>import("./index.html-x-P7PNUx.js"),[]),meta:{title:"Tag 开源项目"}}],["/tag/rbac/",{loader:()=>i(()=>import("./index.html-BCVq4h_s.js"),[]),meta:{title:"Tag RBAC"}}],["/tag/sdd/",{loader:()=>i(()=>import("./index.html-Biq8e5BS.js"),[]),meta:{title:"Tag SDD"}}],["/tag/selenium/",{loader:()=>i(()=>import("./index.html-5Ns06fWE.js"),[]),meta:{title:"Tag Selenium"}}],["/tag/%E5%9F%BA%E5%87%86%E6%B5%8B%E8%AF%95/",{loader:()=>i(()=>import("./index.html-92_c3Tv3.js"),[]),meta:{title:"Tag 基准测试"}}],["/tag/spine/",{loader:()=>i(()=>import("./index.html-32ommPDw.js"),[]),meta:{title:"Tag Spine"}}],["/tag/%E8%82%A1%E7%A5%A8/",{loader:()=>i(()=>import("./index.html-BArSKRFL.js"),[]),meta:{title:"Tag 股票"}}],["/tag/roguelike/",{loader:()=>i(()=>import("./index.html-CdEVLa5C.js"),[]),meta:{title:"Tag Roguelike"}}],["/tag/thingsboard/",{loader:()=>i(()=>import("./index.html-Dbqb0szc.js"),[]),meta:{title:"Tag ThingsBoard"}}],["/tag/%E6%97%B6%E9%97%B4%E6%88%B3/",{loader:()=>i(()=>import("./index.html-U6XFeJKo.js"),[]),meta:{title:"Tag 时间戳"}}],["/tag/%E6%97%B6%E5%BA%8F%E6%95%B0%E6%8D%AE%E5%BA%93/",{loader:()=>i(()=>import("./index.html-CugH9liO.js"),[]),meta:{title:"Tag 时序数据库"}}],["/tag/%E4%BA%A4%E6%98%93%E6%89%80/",{loader:()=>i(()=>import("./index.html-npq5verw.js"),[]),meta:{title:"Tag 交易所"}}],["/tag/unity/",{loader:()=>i(()=>import("./index.html-CUs_-jaD.js"),[]),meta:{title:"Tag Unity"}}],["/tag/%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F/",{loader:()=>i(()=>import("./index.html-De0I-ckF.js"),[]),meta:{title:"Tag 用户画像"}}],["/tag/pgbouncer/",{loader:()=>i(()=>import("./index.html-BWnidgF1.js"),[]),meta:{title:"Tag PgBouncer"}}],["/tag/vite/",{loader:()=>i(()=>import("./index.html-BsRhUNEu.js"),[]),meta:{title:"Tag Vite"}}],["/tag/webgl/",{loader:()=>i(()=>import("./index.html-BhZMm9yF.js"),[]),meta:{title:"Tag WebGL"}}],["/tag/%E5%8A%A0%E6%9D%83%E9%9A%8F%E6%9C%BA/",{loader:()=>i(()=>import("./index.html-BHJwEs9I.js"),[]),meta:{title:"Tag 加权随机"}}],["/tag/bi/",{loader:()=>i(()=>import("./index.html-DFTsn6o1.js"),[]),meta:{title:"Tag BI"}}],["/tag/%E6%95%B0%E6%8D%AE%E8%A1%80%E7%BC%98/",{loader:()=>i(()=>import("./index.html-B3RIHbq8.js"),[]),meta:{title:"Tag 数据血缘"}}],["/tag/roguelite/",{loader:()=>i(()=>import("./index.html-DPA2TKO4.js"),[]),meta:{title:"Tag Roguelite"}}],["/tag/protocol/",{loader:()=>i(()=>import("./index.html-Bi_wCSjF.js"),[]),meta:{title:"Tag Protocol"}}],["/tag/wifi/",{loader:()=>i(()=>import("./index.html-YYrm4_dH.js"),[]),meta:{title:"Tag WiFi"}}],["/tag/wsl/",{loader:()=>i(()=>import("./index.html-q-f14pDv.js"),[]),meta:{title:"Tag WSL"}}],["/tag/windows/",{loader:()=>i(()=>import("./index.html-QPZ_IBDB.js"),[]),meta:{title:"Tag Windows"}}],["/article/",{loader:()=>i(()=>import("./index.html-Dkw_zs5q.js"),[]),meta:{title:"Articles"}}],["/timeline/",{loader:()=>i(()=>import("./index.html-VfqEE8ls.js"),[]),meta:{title:"Timeline"}}]]);/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */const Cn=typeof document<"u";function ac(t){return typeof t=="object"||"displayName"in t||"props"in t||"__vccOpts"in t}function n0(t){return t.__esModule||t[Symbol.toStringTag]==="Module"||t.default&&ac(t.default)}const ft=Object.assign;function Qs(t,e){const n={};for(const a in e){const s=e[a];n[a]=Pe(s)?s.map(t):t(s)}return n}const pa=()=>{},Pe=Array.isArray;function qr(t,e){const n={};for(const a in t)n[a]=a in e?e[a]:t[a];return n}const sc=/#/g,a0=/&/g,s0=/\//g,o0=/=/g,r0=/\?/g,oc=/\+/g,i0=/%5B/g,l0=/%5D/g,rc=/%5E/g,c0=/%60/g,ic=/%7B/g,p0=/%7C/g,lc=/%7D/g,d0=/%20/g;function Mo(t){return t==null?"":encodeURI(""+t).replace(p0,"|").replace(i0,"[").replace(l0,"]")}function u0(t){return Mo(t).replace(ic,"{").replace(lc,"}").replace(rc,"^")}function ho(t){return Mo(t).replace(oc,"%2B").replace(d0,"+").replace(sc,"%23").replace(a0,"%26").replace(c0,"`").replace(ic,"{").replace(lc,"}").replace(rc,"^")}function g0(t){return ho(t).replace(o0,"%3D")}function _0(t){return Mo(t).replace(sc,"%23").replace(r0,"%3F")}function m0(t){return _0(t).replace(s0,"%2F")}function ka(t){if(t==null)return null;try{return decodeURIComponent(""+t)}catch{}return""+t}const h0=/\/$/,f0=t=>t.replace(h0,"");function Xs(t,e,n="/"){let a,s={},o="",r="";const l=e.indexOf("#");let c=e.indexOf("?");return c=l>=0&&c>l?-1:c,c>=0&&(a=e.slice(0,c),o=e.slice(c,l>0?l:e.length),s=t(o.slice(1))),l>=0&&(a=a||e.slice(0,l),r=e.slice(l,e.length)),a=E0(a??e,n),{fullPath:a+o+r,path:a,query:s,hash:ka(r)}}function v0(t,e){const n=e.query?t(e.query):"";return e.path+(n&&"?")+n+(e.hash||"")}function $r(t,e){return!e||!t.toLowerCase().startsWith(e.toLowerCase())?t:t.slice(e.length)||"/"}function b0(t,e,n){const a=e.matched.length-1,s=n.matched.length-1;return a>-1&&a===s&&jn(e.matched[a],n.matched[s])&&cc(e.params,n.params)&&t(e.query)===t(n.query)&&e.hash===n.hash}function jn(t,e){return(t.aliasOf||t)===(e.aliasOf||e)}function cc(t,e){if(Object.keys(t).length!==Object.keys(e).length)return!1;for(var n in t)if(!k0(t[n],e[n]))return!1;return!0}function k0(t,e){return Pe(t)?zr(t,e):Pe(e)?zr(e,t):(t==null?void 0:t.valueOf())===(e==null?void 0:e.valueOf())}function zr(t,e){return Pe(e)?t.length===e.length&&t.every((n,a)=>n===e[a]):t.length===1&&t[0]===e}function E0(t,e){if(t.startsWith("/"))return t;if(!t)return e;const n=e.split("/"),a=t.split("/"),s=a[a.length-1];(s===".."||s===".")&&a.push("");let o=n.length-1,r,l;for(r=0;r<a.length;r++)if(l=a[r],l!==".")if(l==="..")o>1&&o--;else break;return n.slice(0,o).join("/")+"/"+a.slice(r).join("/")}const He={path:"/",name:void 0,params:{},query:{},hash:"",fullPath:"/",matched:[],meta:{},redirectedFrom:void 0};let fo=function(t){return t.pop="pop",t.push="push",t}({}),Js=function(t){return t.back="back",t.forward="forward",t.unknown="",t}({});function y0(t){if(!t)if(Cn){const e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^\w+:\/\/[^\/]+/,"")}else t="/";return t[0]!=="/"&&t[0]!=="#"&&(t="/"+t),f0(t)}const T0=/^[^#]+#/;function A0(t,e){return t.replace(T0,"#")+e}function x0(t,e){const n=document.documentElement.getBoundingClientRect(),a=t.getBoundingClientRect();return{behavior:e.behavior,left:a.left-n.left-(e.left||0),top:a.top-n.top-(e.top||0)}}const Ps=()=>({left:window.scrollX,top:window.scrollY});function P0(t){let e;if("el"in t){const n=t.el,a=typeof n=="string"&&n.startsWith("#"),s=typeof n=="string"?a?document.getElementById(n.slice(1)):document.querySelector(n):n;if(!s)return;e=x0(s,t)}else e=t;"scrollBehavior"in document.documentElement.style?window.scrollTo(e):window.scrollTo(e.left!=null?e.left:window.scrollX,e.top!=null?e.top:window.scrollY)}function Qr(t,e){return(history.state?history.state.position-e:-1)+t}const vo=new Map;function w0(t,e){vo.set(t,e)}function S0(t){const e=vo.get(t);return vo.delete(t),e}function R0(t){return typeof t=="string"||t&&typeof t=="object"}function pc(t){return typeof t=="string"||typeof t=="symbol"}let It=function(t){return t[t.MATCHER_NOT_FOUND=1]="MATCHER_NOT_FOUND",t[t.NAVIGATION_GUARD_REDIRECT=2]="NAVIGATION_GUARD_REDIRECT",t[t.NAVIGATION_ABORTED=4]="NAVIGATION_ABORTED",t[t.NAVIGATION_CANCELLED=8]="NAVIGATION_CANCELLED",t[t.NAVIGATION_DUPLICATED=16]="NAVIGATION_DUPLICATED",t}({});const dc=Symbol("");It.MATCHER_NOT_FOUND+"",It.NAVIGATION_GUARD_REDIRECT+"",It.NAVIGATION_ABORTED+"",It.NAVIGATION_CANCELLED+"",It.NAVIGATION_DUPLICATED+"";function Un(t,e){return ft(new Error,{type:t,[dc]:!0},e)}function Ne(t,e){return t instanceof Error&&dc in t&&(e==null||!!(t.type&e))}const D0=["params","query","hash"];function C0(t){if(typeof t=="string")return t;if(t.path!=null)return t.path;const e={};for(const n of D0)n in t&&(e[n]=t[n]);return JSON.stringify(e,null,2)}function L0(t){const e={};if(t===""||t==="?")return e;const n=(t[0]==="?"?t.slice(1):t).split("&");for(let a=0;a<n.length;++a){const s=n[a].replace(oc," "),o=s.indexOf("="),r=ka(o<0?s:s.slice(0,o)),l=o<0?null:ka(s.slice(o+1));if(r in e){let c=e[r];Pe(c)||(c=e[r]=[c]),c.push(l)}else e[r]=l}return e}function Xr(t){let e="";for(let n in t){const a=t[n];if(n=g0(n),a==null){a!==void 0&&(e+=(e.length?"&":"")+n);continue}(Pe(a)?a.map(s=>s&&ho(s)):[a&&ho(a)]).forEach(s=>{s!==void 0&&(e+=(e.length?"&":"")+n,s!=null&&(e+="="+s))})}return e}function I0(t){const e={};for(const n in t){const a=t[n];a!==void 0&&(e[n]=Pe(a)?a.map(s=>s==null?null:""+s):a==null?a:""+a)}return e}const O0=Symbol(""),Jr=Symbol(""),ws=Symbol(""),Fo=Symbol(""),bo=Symbol("");function ea(){let t=[];function e(a){return t.push(a),()=>{const s=t.indexOf(a);s>-1&&t.splice(s,1)}}function n(){t=[]}return{add:e,list:()=>t.slice(),reset:n}}function an(t,e,n,a,s,o=r=>r()){const r=a&&(a.enterCallbacks[s]=a.enterCallbacks[s]||[]);return()=>new Promise((l,c)=>{const p=g=>{g===!1?c(Un(It.NAVIGATION_ABORTED,{from:n,to:e})):g instanceof Error?c(g):R0(g)?c(Un(It.NAVIGATION_GUARD_REDIRECT,{from:e,to:g})):(r&&a.enterCallbacks[s]===r&&typeof g=="function"&&r.push(g),l())},d=o(()=>t.call(a&&a.instances[s],e,n,p));let u=Promise.resolve(d);t.length<3&&(u=u.then(p)),u.catch(g=>c(g))})}function Ys(t,e,n,a,s=o=>o()){const o=[];for(const r of t)for(const l in r.components){let c=r.components[l];if(!(e!=="beforeRouteEnter"&&!r.instances[l]))if(ac(c)){const p=(c.__vccOpts||c)[e];p&&o.push(an(p,n,a,r,l,s))}else{let p=c();o.push(()=>p.then(d=>{if(!d)throw new Error(`Couldn't resolve component "${l}" at "${r.path}"`);const u=n0(d)?d.default:d;r.mods[l]=d,r.components[l]=u;const g=(u.__vccOpts||u)[e];return g&&an(g,n,a,r,l,s)()}))}}return o}function G0(t,e){const n=[],a=[],s=[],o=Math.max(e.matched.length,t.matched.length);for(let r=0;r<o;r++){const l=e.matched[r];l&&(t.matched.find(p=>jn(p,l))?a.push(l):n.push(l));const c=t.matched[r];c&&(e.matched.find(p=>jn(p,c))||s.push(c))}return[n,a,s]}/*!
 * vue-router v4.6.4
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */let B0=()=>location.protocol+"//"+location.host;function uc(t,e){const{pathname:n,search:a,hash:s}=e,o=t.indexOf("#");if(o>-1){let r=s.includes(t.slice(o))?t.slice(o).length:1,l=s.slice(r);return l[0]!=="/"&&(l="/"+l),$r(l,"")}return $r(n,t)+a+s}function V0(t,e,n,a){let s=[],o=[],r=null;const l=({state:g})=>{const m=uc(t,location),v=n.value,b=e.value;let y=0;if(g){if(n.value=m,e.value=g,r&&r===v){r=null;return}y=b?g.position-b.position:0}else a(m);s.forEach(R=>{R(n.value,v,{delta:y,type:fo.pop,direction:y?y>0?Js.forward:Js.back:Js.unknown})})};function c(){r=n.value}function p(g){s.push(g);const m=()=>{const v=s.indexOf(g);v>-1&&s.splice(v,1)};return o.push(m),m}function d(){if(document.visibilityState==="hidden"){const{history:g}=window;if(!g.state)return;g.replaceState(ft({},g.state,{scroll:Ps()}),"")}}function u(){for(const g of o)g();o=[],window.removeEventListener("popstate",l),window.removeEventListener("pagehide",d),document.removeEventListener("visibilitychange",d)}return window.addEventListener("popstate",l),window.addEventListener("pagehide",d),document.addEventListener("visibilitychange",d),{pauseListeners:c,listen:p,destroy:u}}function Yr(t,e,n,a=!1,s=!1){return{back:t,current:e,forward:n,replaced:a,position:window.history.length,scroll:s?Ps():null}}function W0(t){const{history:e,location:n}=window,a={value:uc(t,n)},s={value:e.state};s.value||o(a.value,{back:null,current:a.value,forward:null,position:e.length-1,replaced:!0,scroll:null},!0);function o(c,p,d){const u=t.indexOf("#"),g=u>-1?(n.host&&document.querySelector("base")?t:t.slice(u))+c:B0()+t+c;try{e[d?"replaceState":"pushState"](p,"",g),s.value=p}catch(m){console.error(m),n[d?"replace":"assign"](g)}}function r(c,p){o(c,ft({},e.state,Yr(s.value.back,c,s.value.forward,!0),p,{position:s.value.position}),!0),a.value=c}function l(c,p){const d=ft({},s.value,e.state,{forward:c,scroll:Ps()});o(d.current,d,!0),o(c,ft({},Yr(a.value,c,null),{position:d.position+1},p),!1),a.value=c}return{location:a,state:s,push:l,replace:r}}function M0(t){t=y0(t);const e=W0(t),n=V0(t,e.state,e.location,e.replace);function a(o,r=!0){r||n.pauseListeners(),history.go(o)}const s=ft({location:"",base:t,go:a,createHref:A0.bind(null,t)},e,n);return Object.defineProperty(s,"location",{enumerable:!0,get:()=>e.location.value}),Object.defineProperty(s,"state",{enumerable:!0,get:()=>e.state.value}),s}let hn=function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.Group=2]="Group",t}({});var Nt=function(t){return t[t.Static=0]="Static",t[t.Param=1]="Param",t[t.ParamRegExp=2]="ParamRegExp",t[t.ParamRegExpEnd=3]="ParamRegExpEnd",t[t.EscapeNext=4]="EscapeNext",t}(Nt||{});const F0={type:hn.Static,value:""},N0=/[a-zA-Z0-9_]/;function K0(t){if(!t)return[[]];if(t==="/")return[[F0]];if(!t.startsWith("/"))throw new Error(`Invalid path "${t}"`);function e(m){throw new Error(`ERR (${n})/"${p}": ${m}`)}let n=Nt.Static,a=n;const s=[];let o;function r(){o&&s.push(o),o=[]}let l=0,c,p="",d="";function u(){p&&(n===Nt.Static?o.push({type:hn.Static,value:p}):n===Nt.Param||n===Nt.ParamRegExp||n===Nt.ParamRegExpEnd?(o.length>1&&(c==="*"||c==="+")&&e(`A repeatable param (${p}) must be alone in its segment. eg: '/:ids+.`),o.push({type:hn.Param,value:p,regexp:d,repeatable:c==="*"||c==="+",optional:c==="*"||c==="?"})):e("Invalid state to consume buffer"),p="")}function g(){p+=c}for(;l<t.length;){if(c=t[l++],c==="\\"&&n!==Nt.ParamRegExp){a=n,n=Nt.EscapeNext;continue}switch(n){case Nt.Static:c==="/"?(p&&u(),r()):c===":"?(u(),n=Nt.Param):g();break;case Nt.EscapeNext:g(),n=a;break;case Nt.Param:c==="("?n=Nt.ParamRegExp:N0.test(c)?g():(u(),n=Nt.Static,c!=="*"&&c!=="?"&&c!=="+"&&l--);break;case Nt.ParamRegExp:c===")"?d[d.length-1]=="\\"?d=d.slice(0,-1)+c:n=Nt.ParamRegExpEnd:d+=c;break;case Nt.ParamRegExpEnd:u(),n=Nt.Static,c!=="*"&&c!=="?"&&c!=="+"&&l--,d="";break;default:e("Unknown state");break}}return n===Nt.ParamRegExp&&e(`Unfinished custom RegExp for param "${p}"`),u(),r(),s}const ti="[^/]+?",H0={sensitive:!1,strict:!1,start:!0,end:!0};var ae=function(t){return t[t._multiplier=10]="_multiplier",t[t.Root=90]="Root",t[t.Segment=40]="Segment",t[t.SubSegment=30]="SubSegment",t[t.Static=40]="Static",t[t.Dynamic=20]="Dynamic",t[t.BonusCustomRegExp=10]="BonusCustomRegExp",t[t.BonusWildcard=-50]="BonusWildcard",t[t.BonusRepeatable=-20]="BonusRepeatable",t[t.BonusOptional=-8]="BonusOptional",t[t.BonusStrict=.7000000000000001]="BonusStrict",t[t.BonusCaseSensitive=.25]="BonusCaseSensitive",t}(ae||{});const j0=/[.+*?^${}()[\]/\\]/g;function U0(t,e){const n=ft({},H0,e),a=[];let s=n.start?"^":"";const o=[];for(const p of t){const d=p.length?[]:[ae.Root];n.strict&&!p.length&&(s+="/");for(let u=0;u<p.length;u++){const g=p[u];let m=ae.Segment+(n.sensitive?ae.BonusCaseSensitive:0);if(g.type===hn.Static)u||(s+="/"),s+=g.value.replace(j0,"\\$&"),m+=ae.Static;else if(g.type===hn.Param){const{value:v,repeatable:b,optional:y,regexp:R}=g;o.push({name:v,repeatable:b,optional:y});const A=R||ti;if(A!==ti){m+=ae.BonusCustomRegExp;try{`${A}`}catch(k){throw new Error(`Invalid custom RegExp for param "${v}" (${A}): `+k.message)}}let h=b?`((?:${A})(?:/(?:${A}))*)`:`(${A})`;u||(h=y&&p.length<2?`(?:/${h})`:"/"+h),y&&(h+="?"),s+=h,m+=ae.Dynamic,y&&(m+=ae.BonusOptional),b&&(m+=ae.BonusRepeatable),A===".*"&&(m+=ae.BonusWildcard)}d.push(m)}a.push(d)}if(n.strict&&n.end){const p=a.length-1;a[p][a[p].length-1]+=ae.BonusStrict}n.strict||(s+="/?"),n.end?s+="$":n.strict&&!s.endsWith("/")&&(s+="(?:/|$)");const r=new RegExp(s,n.sensitive?"":"i");function l(p){const d=p.match(r),u={};if(!d)return null;for(let g=1;g<d.length;g++){const m=d[g]||"",v=o[g-1];u[v.name]=m&&v.repeatable?m.split("/"):m}return u}function c(p){let d="",u=!1;for(const g of t){(!u||!d.endsWith("/"))&&(d+="/"),u=!1;for(const m of g)if(m.type===hn.Static)d+=m.value;else if(m.type===hn.Param){const{value:v,repeatable:b,optional:y}=m,R=v in p?p[v]:"";if(Pe(R)&&!b)throw new Error(`Provided param "${v}" is an array but it is not repeatable (* or + modifiers)`);const A=Pe(R)?R.join("/"):R;if(!A)if(y)g.length<2&&(d.endsWith("/")?d=d.slice(0,-1):u=!0);else throw new Error(`Missing required param "${v}"`);d+=A}}return d||"/"}return{re:r,score:a,keys:o,parse:l,stringify:c}}function Z0(t,e){let n=0;for(;n<t.length&&n<e.length;){const a=e[n]-t[n];if(a)return a;n++}return t.length<e.length?t.length===1&&t[0]===ae.Static+ae.Segment?-1:1:t.length>e.length?e.length===1&&e[0]===ae.Static+ae.Segment?1:-1:0}function gc(t,e){let n=0;const a=t.score,s=e.score;for(;n<a.length&&n<s.length;){const o=Z0(a[n],s[n]);if(o)return o;n++}if(Math.abs(s.length-a.length)===1){if(ei(a))return 1;if(ei(s))return-1}return s.length-a.length}function ei(t){const e=t[t.length-1];return t.length>0&&e[e.length-1]<0}const q0={strict:!1,end:!0,sensitive:!1};function $0(t,e,n){const a=U0(K0(t.path),n),s=ft(a,{record:t,parent:e,children:[],alias:[]});return e&&!s.record.aliasOf==!e.record.aliasOf&&e.children.push(s),s}function z0(t,e){const n=[],a=new Map;e=qr(q0,e);function s(u){return a.get(u)}function o(u,g,m){const v=!m,b=ai(u);b.aliasOf=m&&m.record;const y=qr(e,u),R=[b];if("alias"in u){const k=typeof u.alias=="string"?[u.alias]:u.alias;for(const M of k)R.push(ai(ft({},b,{components:m?m.record.components:b.components,path:M,aliasOf:m?m.record:b})))}let A,h;for(const k of R){const{path:M}=k;if(g&&M[0]!=="/"){const J=g.record.path,V=J[J.length-1]==="/"?"":"/";k.path=g.record.path+(M&&V+M)}if(A=$0(k,g,y),m?m.alias.push(A):(h=h||A,h!==A&&h.alias.push(A),v&&u.name&&!si(A)&&r(u.name)),_c(A)&&c(A),b.children){const J=b.children;for(let V=0;V<J.length;V++)o(J[V],A,m&&m.children[V])}m=m||A}return h?()=>{r(h)}:pa}function r(u){if(pc(u)){const g=a.get(u);g&&(a.delete(u),n.splice(n.indexOf(g),1),g.children.forEach(r),g.alias.forEach(r))}else{const g=n.indexOf(u);g>-1&&(n.splice(g,1),u.record.name&&a.delete(u.record.name),u.children.forEach(r),u.alias.forEach(r))}}function l(){return n}function c(u){const g=J0(u,n);n.splice(g,0,u),u.record.name&&!si(u)&&a.set(u.record.name,u)}function p(u,g){let m,v={},b,y;if("name"in u&&u.name){if(m=a.get(u.name),!m)throw Un(It.MATCHER_NOT_FOUND,{location:u});y=m.record.name,v=ft(ni(g.params,m.keys.filter(h=>!h.optional).concat(m.parent?m.parent.keys.filter(h=>h.optional):[]).map(h=>h.name)),u.params&&ni(u.params,m.keys.map(h=>h.name))),b=m.stringify(v)}else if(u.path!=null)b=u.path,m=n.find(h=>h.re.test(b)),m&&(v=m.parse(b),y=m.record.name);else{if(m=g.name?a.get(g.name):n.find(h=>h.re.test(g.path)),!m)throw Un(It.MATCHER_NOT_FOUND,{location:u,currentLocation:g});y=m.record.name,v=ft({},g.params,u.params),b=m.stringify(v)}const R=[];let A=m;for(;A;)R.unshift(A.record),A=A.parent;return{name:y,path:b,params:v,matched:R,meta:X0(R)}}t.forEach(u=>o(u));function d(){n.length=0,a.clear()}return{addRoute:o,resolve:p,removeRoute:r,clearRoutes:d,getRoutes:l,getRecordMatcher:s}}function ni(t,e){const n={};for(const a of e)a in t&&(n[a]=t[a]);return n}function ai(t){const e={path:t.path,redirect:t.redirect,name:t.name,meta:t.meta||{},aliasOf:t.aliasOf,beforeEnter:t.beforeEnter,props:Q0(t),children:t.children||[],instances:{},leaveGuards:new Set,updateGuards:new Set,enterCallbacks:{},components:"components"in t?t.components||null:t.component&&{default:t.component}};return Object.defineProperty(e,"mods",{value:{}}),e}function Q0(t){const e={},n=t.props||!1;if("component"in t)e.default=n;else for(const a in t.components)e[a]=typeof n=="object"?n[a]:n;return e}function si(t){for(;t;){if(t.record.aliasOf)return!0;t=t.parent}return!1}function X0(t){return t.reduce((e,n)=>ft(e,n.meta),{})}function J0(t,e){let n=0,a=e.length;for(;n!==a;){const o=n+a>>1;gc(t,e[o])<0?a=o:n=o+1}const s=Y0(t);return s&&(a=e.lastIndexOf(s,a-1)),a}function Y0(t){let e=t;for(;e=e.parent;)if(_c(e)&&gc(t,e)===0)return e}function _c({record:t}){return!!(t.name||t.components&&Object.keys(t.components).length||t.redirect)}function oi(t){const e=Qt(ws),n=Qt(Fo),a=G(()=>{const c=H(t.to);return e.resolve(c)}),s=G(()=>{const{matched:c}=a.value,{length:p}=c,d=c[p-1],u=n.matched;if(!d||!u.length)return-1;const g=u.findIndex(jn.bind(null,d));if(g>-1)return g;const m=ri(c[p-2]);return p>1&&ri(d)===m&&u[u.length-1].path!==m?u.findIndex(jn.bind(null,c[p-2])):g}),o=G(()=>s.value>-1&&sg(n.params,a.value.params)),r=G(()=>s.value>-1&&s.value===n.matched.length-1&&cc(n.params,a.value.params));function l(c={}){if(ag(c)){const p=e[H(t.replace)?"replace":"push"](H(t.to)).catch(pa);return t.viewTransition&&typeof document<"u"&&"startViewTransition"in document&&document.startViewTransition(()=>p),p}return Promise.resolve()}return{route:a,href:G(()=>a.value.href),isActive:o,isExactActive:r,navigate:l}}function tg(t){return t.length===1?t[0]:t}const eg=dt({name:"RouterLink",compatConfig:{MODE:3},props:{to:{type:[String,Object],required:!0},replace:Boolean,activeClass:String,exactActiveClass:String,custom:Boolean,ariaCurrentValue:{type:String,default:"page"},viewTransition:Boolean},useLink:oi,setup(t,{slots:e}){const n=yn(oi(t)),{options:a}=Qt(ws),s=G(()=>({[ii(t.activeClass,a.linkActiveClass,"router-link-active")]:n.isActive,[ii(t.exactActiveClass,a.linkExactActiveClass,"router-link-exact-active")]:n.isExactActive}));return()=>{const o=e.default&&tg(e.default(n));return t.custom?o:Q("a",{"aria-current":n.isExactActive?t.ariaCurrentValue:null,href:n.href,onClick:n.navigate,class:s.value},o)}}}),ng=eg;function ag(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget&&t.currentTarget.getAttribute){const e=t.currentTarget.getAttribute("target");if(/\b_blank\b/i.test(e))return}return t.preventDefault&&t.preventDefault(),!0}}function sg(t,e){for(const n in e){const a=e[n],s=t[n];if(typeof a=="string"){if(a!==s)return!1}else if(!Pe(s)||s.length!==a.length||a.some((o,r)=>o.valueOf()!==s[r].valueOf()))return!1}return!0}function ri(t){return t?t.aliasOf?t.aliasOf.path:t.path:""}const ii=(t,e,n)=>t??e??n,og=dt({name:"RouterView",inheritAttrs:!1,props:{name:{type:String,default:"default"},route:Object},compatConfig:{MODE:3},setup(t,{attrs:e,slots:n}){const a=Qt(bo),s=G(()=>t.route||a.value),o=Qt(Jr,0),r=G(()=>{let p=H(o);const{matched:d}=s.value;let u;for(;(u=d[p])&&!u.components;)p++;return p}),l=G(()=>s.value.matched[r.value]);on(Jr,G(()=>r.value+1)),on(O0,l),on(bo,s);const c=zt();return Yt(()=>[c.value,l.value,t.name],([p,d,u],[g,m,v])=>{d&&(d.instances[u]=p,m&&m!==d&&p&&p===g&&(d.leaveGuards.size||(d.leaveGuards=m.leaveGuards),d.updateGuards.size||(d.updateGuards=m.updateGuards))),p&&d&&(!m||!jn(d,m)||!g)&&(d.enterCallbacks[u]||[]).forEach(b=>b(p))},{flush:"post"}),()=>{const p=s.value,d=t.name,u=l.value,g=u&&u.components[d];if(!g)return li(n.default,{Component:g,route:p});const m=u.props[d],v=m?m===!0?p.params:typeof m=="function"?m(p):m:null,y=Q(g,ft({},v,e,{onVnodeUnmounted:R=>{R.component.isUnmounted&&(u.instances[d]=null)},ref:c}));return li(n.default,{Component:y,route:p})||y}}});function li(t,e){if(!t)return null;const n=t(e);return n.length===1?n[0]:n}const rg=og;function ig(t){const e=z0(t.routes,t),n=t.parseQuery||L0,a=t.stringifyQuery||Xr,s=t.history,o=ea(),r=ea(),l=ea(),c=kt(He);let p=He;Cn&&t.scrollBehavior&&"scrollRestoration"in history&&(history.scrollRestoration="manual");const d=Qs.bind(null,S=>""+S),u=Qs.bind(null,m0),g=Qs.bind(null,ka);function m(S,z){let q,et;return pc(S)?(q=e.getRecordMatcher(S),et=z):et=S,e.addRoute(et,q)}function v(S){const z=e.getRecordMatcher(S);z&&e.removeRoute(z)}function b(){return e.getRoutes().map(S=>S.record)}function y(S){return!!e.getRecordMatcher(S)}function R(S,z){if(z=ft({},z||c.value),typeof S=="string"){const f=Xs(n,S,z.path),E=e.resolve({path:f.path},z),C=s.createHref(f.fullPath);return ft(f,E,{params:g(E.params),hash:ka(f.hash),redirectedFrom:void 0,href:C})}let q;if(S.path!=null)q=ft({},S,{path:Xs(n,S.path,z.path).path});else{const f=ft({},S.params);for(const E in f)f[E]==null&&delete f[E];q=ft({},S,{params:u(f)}),z.params=u(z.params)}const et=e.resolve(q,z),pt=S.hash||"";et.params=d(g(et.params));const _t=v0(a,ft({},S,{hash:u0(pt),path:et.path})),_=s.createHref(_t);return ft({fullPath:_t,hash:pt,query:a===Xr?I0(S.query):S.query||{}},et,{redirectedFrom:void 0,href:_})}function A(S){return typeof S=="string"?Xs(n,S,c.value.path):ft({},S)}function h(S,z){if(p!==S)return Un(It.NAVIGATION_CANCELLED,{from:z,to:S})}function k(S){return V(S)}function M(S){return k(ft(A(S),{replace:!0}))}function J(S,z){const q=S.matched[S.matched.length-1];if(q&&q.redirect){const{redirect:et}=q;let pt=typeof et=="function"?et(S,z):et;return typeof pt=="string"&&(pt=pt.includes("?")||pt.includes("#")?pt=A(pt):{path:pt},pt.params={}),ft({query:S.query,hash:S.hash,params:pt.path!=null?{}:S.params},pt)}}function V(S,z){const q=p=R(S),et=c.value,pt=S.state,_t=S.force,_=S.replace===!0,f=J(q,et);if(f)return V(ft(A(f),{state:typeof f=="object"?ft({},pt,f.state):pt,force:_t,replace:_}),z||q);const E=q;E.redirectedFrom=z;let C;return!_t&&b0(a,et,q)&&(C=Un(It.NAVIGATION_DUPLICATED,{to:E,from:et}),Wt(et,et,!0,!1)),(C?Promise.resolve(C):I(E,et)).catch(w=>Ne(w)?Ne(w,It.NAVIGATION_GUARD_REDIRECT)?w:Ct(w):U(w,E,et)).then(w=>{if(w){if(Ne(w,It.NAVIGATION_GUARD_REDIRECT))return V(ft({replace:_},A(w.to),{state:typeof w.to=="object"?ft({},pt,w.to.state):pt,force:_t}),z||E)}else w=T(E,et,!0,_,pt);return F(E,et,w),w})}function x(S,z){const q=h(S,z);return q?Promise.reject(q):Promise.resolve()}function D(S){const z=ve.values().next().value;return z&&typeof z.runWithContext=="function"?z.runWithContext(S):S()}function I(S,z){let q;const[et,pt,_t]=G0(S,z);q=Ys(et.reverse(),"beforeRouteLeave",S,z);for(const f of et)f.leaveGuards.forEach(E=>{q.push(an(E,S,z))});const _=x.bind(null,S,z);return q.push(_),jt(q).then(()=>{q=[];for(const f of o.list())q.push(an(f,S,z));return q.push(_),jt(q)}).then(()=>{q=Ys(pt,"beforeRouteUpdate",S,z);for(const f of pt)f.updateGuards.forEach(E=>{q.push(an(E,S,z))});return q.push(_),jt(q)}).then(()=>{q=[];for(const f of _t)if(f.beforeEnter)if(Pe(f.beforeEnter))for(const E of f.beforeEnter)q.push(an(E,S,z));else q.push(an(f.beforeEnter,S,z));return q.push(_),jt(q)}).then(()=>(S.matched.forEach(f=>f.enterCallbacks={}),q=Ys(_t,"beforeRouteEnter",S,z,D),q.push(_),jt(q))).then(()=>{q=[];for(const f of r.list())q.push(an(f,S,z));return q.push(_),jt(q)}).catch(f=>Ne(f,It.NAVIGATION_CANCELLED)?f:Promise.reject(f))}function F(S,z,q){l.list().forEach(et=>D(()=>et(S,z,q)))}function T(S,z,q,et,pt){const _t=h(S,z);if(_t)return _t;const _=z===He,f=Cn?history.state:{};q&&(et||_?s.replace(S.fullPath,ft({scroll:_&&f&&f.scroll},pt)):s.push(S.fullPath,pt)),c.value=S,Wt(S,z,q,_),Ct()}let B;function W(){B||(B=s.listen((S,z,q)=>{if(!Mt.listening)return;const et=R(S),pt=J(et,Mt.currentRoute.value);if(pt){V(ft(pt,{replace:!0,force:!0}),et).catch(pa);return}p=et;const _t=c.value;Cn&&w0(Qr(_t.fullPath,q.delta),Ps()),I(et,_t).catch(_=>Ne(_,It.NAVIGATION_ABORTED|It.NAVIGATION_CANCELLED)?_:Ne(_,It.NAVIGATION_GUARD_REDIRECT)?(V(ft(A(_.to),{force:!0}),et).then(f=>{Ne(f,It.NAVIGATION_ABORTED|It.NAVIGATION_DUPLICATED)&&!q.delta&&q.type===fo.pop&&s.go(-1,!1)}).catch(pa),Promise.reject()):(q.delta&&s.go(-q.delta,!1),U(_,et,_t))).then(_=>{_=_||T(et,_t,!1),_&&(q.delta&&!Ne(_,It.NAVIGATION_CANCELLED)?s.go(-q.delta,!1):q.type===fo.pop&&Ne(_,It.NAVIGATION_ABORTED|It.NAVIGATION_DUPLICATED)&&s.go(-1,!1)),F(et,_t,_)}).catch(pa)}))}let j=ea(),P=ea(),Y;function U(S,z,q){Ct(S);const et=P.list();return et.length?et.forEach(pt=>pt(S,z,q)):console.error(S),Promise.reject(S)}function ot(){return Y&&c.value!==He?Promise.resolve():new Promise((S,z)=>{j.add([S,z])})}function Ct(S){return Y||(Y=!S,W(),j.list().forEach(([z,q])=>S?q(S):z()),j.reset()),S}function Wt(S,z,q,et){const{scrollBehavior:pt}=t;if(!Cn||!pt)return Promise.resolve();const _t=!q&&S0(Qr(S.fullPath,0))||(et||!q)&&history.state&&history.state.scroll||null;return wa().then(()=>pt(S,z,_t)).then(_=>_&&P0(_)).catch(_=>U(_,S,z))}const Bt=S=>s.go(S);let ee;const ve=new Set,Mt={currentRoute:c,listening:!0,addRoute:m,removeRoute:v,clearRoutes:e.clearRoutes,hasRoute:y,getRoutes:b,resolve:R,options:t,push:k,replace:M,go:Bt,back:()=>Bt(-1),forward:()=>Bt(1),beforeEach:o.add,beforeResolve:r.add,afterEach:l.add,onError:P.add,isReady:ot,install(S){S.component("RouterLink",ng),S.component("RouterView",rg),S.config.globalProperties.$router=Mt,Object.defineProperty(S.config.globalProperties,"$route",{enumerable:!0,get:()=>H(c)}),Cn&&!ee&&c.value===He&&(ee=!0,k(s.location).catch(et=>{}));const z={};for(const et in He)Object.defineProperty(z,et,{get:()=>c.value[et],enumerable:!0});S.provide(ws,Mt),S.provide(Fo,ol(z)),S.provide(bo,c);const q=S.unmount;ve.add(S),S.unmount=function(){ve.delete(S),ve.size<1&&(p=He,B&&B(),B=null,c.value=He,ee=!1,Y=!1),q()}}};function jt(S){return S.reduce((z,q)=>z.then(()=>D(q)),Promise.resolve())}return Mt}function La(){return Qt(ws)}function $n(t){return Qt(Fo)}var No=Symbol(""),we=()=>{const t=Qt(No);if(!t)throw new Error("useClientData() is called without provider.");return t},lg=()=>we().pageComponent,Ss=()=>we().pageData,xn=()=>we().pageFrontmatter,cg=()=>we().pageHead,Ko=()=>we().pageLang,pg=()=>we().pageLayout,Ho=()=>we().routeLocale,Rs=()=>we().routePath,dg=()=>we().routes,ug=()=>we().siteData,Ya=kt([]),Ia=t=>{Ya.value.push(t),Ts(()=>{Ya.value=Ya.value.filter(e=>e!==t)})},gg=Symbol(""),ko=kt(t0),Wn=kt(e0),mc=(t,e)=>{const n=Hu(t,e);if(Wn.value[n])return n;const a=encodeURI(n);if(Wn.value[a])return a;const s=ko.value[n]||ko.value[a];return s||n},Tn=(t,e)=>{const{pathname:n,hashAndQueries:a}=tc(t),s=mc(n,e),o=s+a;return Wn.value[s]?{...Wn.value[s],path:o,notFound:!1}:{...Wn.value["/404.html"],path:o,notFound:!0}},_g=(t,e)=>{const{pathname:n,hashAndQueries:a}=tc(t);return mc(n,e)+a},mg=t=>{if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey)&&!t.defaultPrevented&&!(t.button!==void 0&&t.button!==0)){if(t.currentTarget){const e=t.currentTarget.getAttribute("target");if(e!=null&&e.match(/\b_blank\b/i))return}return t.preventDefault(),!0}},zn=dt({name:"RouteLink",props:{to:{type:String,required:!0},active:Boolean,activeClass:{type:String,default:"route-link-active"}},slots:Object,setup(t,{slots:e}){const n=La(),a=$n(),s=G(()=>t.to.startsWith("#")||t.to.startsWith("?")?t.to:`/${_g(t.to,a.path).substring(1)}`);return()=>Q("a",{class:["route-link",{[t.activeClass]:t.active}],href:s.value,onClick:(o={})=>{mg(o)&&n.push(t.to).catch()}},e.default())}}),hg=dt({name:"AutoLink",props:{config:{type:Object,required:!0}},slots:Object,setup(t,{slots:e}){const n=pl(t,"config"),a=$n(),s=ug(),o=G(()=>Da(n.value.link)),r=G(()=>n.value.target||(o.value?"_blank":void 0)),l=G(()=>r.value==="_blank"),c=G(()=>!o.value&&!l.value),p=G(()=>n.value.rel||(l.value?"noopener noreferrer":null)),d=G(()=>n.value.ariaLabel??n.value.text),u=G(()=>{if(n.value.exact)return!1;const m=Object.keys(s.value.locales);return m.length?m.every(v=>v!==n.value.link):n.value.link!=="/"}),g=G(()=>c.value?n.value.activeMatch?(n.value.activeMatch instanceof RegExp?n.value.activeMatch:new RegExp(n.value.activeMatch,"u")).test(a.path):u.value?a.path.startsWith(n.value.link):a.path===n.value.link:!1);return()=>{const{before:m,after:v,default:b}=e,y=(b==null?void 0:b(n.value))??[m==null?void 0:m(n.value),n.value.text,v==null?void 0:v(n.value)];return c.value?Q(zn,{class:"auto-link",to:n.value.link,active:g.value,"aria-label":d.value},()=>y):Q("a",{class:"auto-link external-link",href:n.value.link,"aria-label":d.value,rel:p.value,target:r.value},y)}}}),jo=dt({name:"ClientOnly",setup(t,e){const n=zt(!1);return re(()=>{n.value=!0}),()=>{var a,s;return n.value?(s=(a=e.slots).default)==null?void 0:s.call(a):null}}}),Ha=t=>{Ya.value.forEach(e=>e(t))},Uo=dt({name:"Content",props:{path:{type:String,required:!1,default:""}},setup(t){const e=lg(),n=G(()=>{if(!t.path)return e.value;const s=Tn(t.path);return pd(async()=>s.loader().then(({comp:o})=>o))}),a=xn();return Yt(a,()=>{Ha("updated")},{deep:!0,flush:"post"}),()=>Q(n.value,{onVnodeMounted:()=>{Ha("mounted")},onVnodeUpdated:()=>{Ha("updated")},onVnodeBeforeUnmount:()=>{Ha("beforeUnmount")}})}}),fg="Layout",vg="en-US",un=yn({resolveLayouts:t=>t.reduce((e,n)=>({...e,...n.layouts}),{}),resolvePageHead:(t,e,n)=>{const a=ye(e.description)?e.description:n.description,s=[...Array.isArray(e.head)?e.head:[],...n.head,["title",{},t],["meta",{name:"description",content:a}]];return zu(s)},resolvePageHeadTitle:(t,e)=>[t.title,e.title].filter(n=>!!n).join(" | "),resolvePageLang:(t,e)=>t.lang||e.lang||vg,resolvePageLayout:(t,e)=>{const n=ye(t.frontmatter.layout)?t.frontmatter.layout:fg;if(!e[n])throw new Error(`[vuepress] Cannot resolve layout: ${n}`);return e[n]},resolveRouteLocale:(t,e)=>ju(t,decodeURI(e)),resolveSiteLocaleData:({base:t,locales:e,...n},a)=>{var s;return{...n,...e[a],head:[...((s=e[a])==null?void 0:s.head)??[],...n.head]}}}),We=(t={})=>t,Zo=t=>Ca(t)?t:`/${nc(t)}`,bg=Object.defineProperty,kg=(t,e)=>{for(var n in e)bg(t,n,{get:e[n],enumerable:!0})},Eg={};kg(Eg,{COMPONENT_STATE_TYPE:()=>yg,INSPECTOR_ID:()=>Tg,INSPECTOR_LABEL:()=>Ag,INSPECTOR_NODES:()=>xg,INSPECTOR_STATE_SECTION_NAME:()=>Pg,PLUGIN_ID:()=>hc,PLUGIN_LABEL:()=>qo});var hc="org.vuejs.vuepress",qo="VuePress",yg=qo,Tg=hc,Ag=qo,ci={id:"INTERNAL",label:"Internal",keys:["layouts","routes","redirects"]},pi={id:"SITE",label:"Site",keys:["siteData","siteLocaleData"]},di={id:"ROUTE",label:"Route",keys:["routePath","routeLocale"]},ui={id:"PAGE",label:"Page",keys:["pageData","pageFrontmatter","pageLang","pageHead","pageHeadTitle","pageLayout","pageComponent"]},xg={[ci.id]:ci,[pi.id]:pi,[di.id]:di,[ui.id]:ui},Pg="State";function Ds(t){return Ki()?(hp(t),!0):!1}const Mn=new WeakMap,fc=(...t)=>{var e;const n=t[0],a=(e=Ve())==null?void 0:e.proxy;if(a==null&&!hl())throw new Error("injectLocal must be called in setup");return a&&Mn.has(a)&&n in Mn.get(a)?Mn.get(a)[n]:Qt(...t)};function wg(t,e){var n;const a=(n=Ve())==null?void 0:n.proxy;if(a==null)throw new Error("provideLocal must be called in setup");Mn.has(a)||Mn.set(a,Object.create(null));const s=Mn.get(a);return s[t]=e,on(t,e)}const $o=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Sg=t=>t!=null,Rg=Object.prototype.toString,Dg=t=>Rg.call(t)==="[object Object]",An=()=>{};function Cg(...t){if(t.length!==1)return pl(...t);const e=t[0];return typeof e=="function"?Nn(ll(()=>({get:e,set:An}))):zt(e)}function zo(t,e){function n(...a){return new Promise((s,o)=>{Promise.resolve(t(()=>e.apply(this,a),{fn:e,thisArg:this,args:a})).then(s).catch(o)})}return n}const vc=t=>t();function Lg(t,e={}){let n,a,s=An;const o=c=>{clearTimeout(c),s(),s=An};let r;return c=>{const p=Tt(t),d=Tt(e.maxWait);return n&&o(n),p<=0||d!==void 0&&d<=0?(a&&(o(a),a=void 0),Promise.resolve(c())):new Promise((u,g)=>{s=e.rejectOnCancel?g:u,r=c,d&&!a&&(a=setTimeout(()=>{n&&o(n),a=void 0,u(r())},d)),n=setTimeout(()=>{a&&o(a),a=void 0,u(c())},p)})}}function Ig(...t){let e=0,n,a=!0,s=An,o,r,l,c,p;!Gt(t[0])&&typeof t[0]=="object"?{delay:r,trailing:l=!0,leading:c=!0,rejectOnCancel:p=!1}=t[0]:[r,l=!0,c=!0,p=!1]=t;const d=()=>{n&&(clearTimeout(n),n=void 0,s(),s=An)};return g=>{const m=Tt(r),v=Date.now()-e,b=()=>o=g();return d(),m<=0?(e=Date.now(),b()):(v>m&&(c||!a)?(e=Date.now(),b()):l&&(o=new Promise((y,R)=>{s=p?R:y,n=setTimeout(()=>{e=Date.now(),a=!0,y(b()),d()},Math.max(0,m-v))})),!c&&!n&&(n=setTimeout(()=>a=!0,m)),a=!1,o)}}function Og(t=vc,e={}){const{initialState:n="active"}=e,a=Cg(n==="active");function s(){a.value=!1}function o(){a.value=!0}return{isActive:Nn(a),pause:s,resume:o,eventFilter:(...l)=>{a.value&&t(...l)}}}function Gg(t){let e;function n(){return e||(e=t()),e}return n.reset=async()=>{const a=e;e=void 0,a&&await a},n}function gi(t){return t.endsWith("rem")?Number.parseFloat(t)*16:Number.parseFloat(t)}function da(t){return Array.isArray(t)?t:[t]}function Bg(t){return Ve()}function bc(t,e=200,n={}){return zo(Lg(e,n),t)}function Vg(t,e=200,n=!1,a=!0,s=!1){return zo(Ig(e,n,a,s),t)}function Wg(t,e,n={}){const{eventFilter:a=vc,...s}=n;return Yt(t,zo(a,e),s)}function Mg(t,e,n={}){const{eventFilter:a,initialState:s="active",...o}=n,{eventFilter:r,pause:l,resume:c,isActive:p}=Og(a,{initialState:s});return{stop:Wg(t,e,{...o,eventFilter:r}),pause:l,resume:c,isActive:p}}function Cs(t,e=!0,n){Bg()?re(t,n):e?t():wa(t)}function Fg(t,e,n={}){const{immediate:a=!0,immediateCallback:s=!1}=n,o=kt(!1);let r;function l(){r&&(clearTimeout(r),r=void 0)}function c(){o.value=!1,l()}function p(...d){s&&t(),l(),o.value=!0,r=setTimeout(()=>{o.value=!1,r=void 0,t(...d)},Tt(e))}return a&&(o.value=!0,$o&&p()),Ds(c),{isPending:Bp(o),start:p,stop:c}}function Qo(t=!1,e={}){const{truthyValue:n=!0,falsyValue:a=!1}=e,s=Gt(t),o=kt(t);function r(l){if(arguments.length)return o.value=l,o.value;{const c=Tt(n);return o.value=o.value===c?Tt(a):c,o.value}}return s?r:[o,r]}function Ls(t,e,n){return Yt(t,e,{...n,immediate:!0})}const Be=$o?window:void 0,kc=$o?window.navigator:void 0;function $e(t){var e;const n=Tt(t);return(e=n==null?void 0:n.$el)!=null?e:n}function te(...t){const e=[],n=()=>{e.forEach(l=>l()),e.length=0},a=(l,c,p,d)=>(l.addEventListener(c,p,d),()=>l.removeEventListener(c,p,d)),s=G(()=>{const l=da(Tt(t[0])).filter(c=>c!=null);return l.every(c=>typeof c!="string")?l:void 0}),o=Ls(()=>{var l,c;return[(c=(l=s.value)==null?void 0:l.map(p=>$e(p)))!=null?c:[Be].filter(p=>p!=null),da(Tt(s.value?t[1]:t[0])),da(H(s.value?t[2]:t[1])),Tt(s.value?t[3]:t[2])]},([l,c,p,d])=>{if(n(),!(l!=null&&l.length)||!(c!=null&&c.length)||!(p!=null&&p.length))return;const u=Dg(d)?{...d}:d;e.push(...l.flatMap(g=>c.flatMap(m=>p.map(v=>a(g,m,v,u)))))},{flush:"post"}),r=()=>{o(),n()};return Ds(n),r}function Ng(){const t=kt(!1),e=Ve();return e&&re(()=>{t.value=!0},e),t}function Oa(t){const e=Ng();return G(()=>(e.value,!!t()))}function Ec(t,e,n={}){const{window:a=Be,...s}=n;let o;const r=Oa(()=>a&&"MutationObserver"in a),l=()=>{o&&(o.disconnect(),o=void 0)},c=G(()=>{const g=Tt(t),m=da(g).map($e).filter(Sg);return new Set(m)}),p=Yt(c,g=>{l(),r.value&&g.size&&(o=new MutationObserver(e),g.forEach(m=>o.observe(m,s)))},{immediate:!0,flush:"post"}),d=()=>o==null?void 0:o.takeRecords(),u=()=>{p(),l()};return Ds(u),{isSupported:r,stop:u,takeRecords:d}}const Kg=Symbol("vueuse-ssr-width");function Hg(){const t=hl()?fc(Kg,null):null;return typeof t=="number"?t:void 0}function Xo(t,e={}){const{window:n=Be,ssrWidth:a=Hg()}=e,s=Oa(()=>n&&"matchMedia"in n&&typeof n.matchMedia=="function"),o=kt(typeof a=="number"),r=kt(),l=kt(!1),c=p=>{l.value=p.matches};return Jp(()=>{if(o.value){o.value=!s.value;const p=Tt(t).split(",");l.value=p.some(d=>{const u=d.includes("not all"),g=d.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/),m=d.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);let v=!!(g||m);return g&&v&&(v=a>=gi(g[1])),m&&v&&(v=a<=gi(m[1])),u?!v:v});return}s.value&&(r.value=n.matchMedia(Tt(t)),l.value=r.value.matches)}),te(r,"change",c,{passive:!0}),G(()=>l.value)}function _i(t,e={}){const{controls:n=!1,navigator:a=kc}=e,s=Oa(()=>a&&"permissions"in a),o=kt(),r=typeof t=="string"?{name:t}:t,l=kt(),c=()=>{var d,u;l.value=(u=(d=o.value)==null?void 0:d.state)!=null?u:"prompt"};te(o,"change",c,{passive:!0});const p=Gg(async()=>{if(s.value){if(!o.value)try{o.value=await a.permissions.query(r)}catch{o.value=void 0}finally{c()}if(n)return ut(o.value)}});return p(),n?{state:l,isSupported:s,query:p}:l}function jg(t={}){const{navigator:e=kc,read:n=!1,source:a,copiedDuring:s=1500,legacy:o=!1}=t,r=Oa(()=>e&&"clipboard"in e),l=_i("clipboard-read"),c=_i("clipboard-write"),p=G(()=>r.value||o),d=kt(""),u=kt(!1),g=Fg(()=>u.value=!1,s,{immediate:!1});async function m(){let A=!(r.value&&R(l.value));if(!A)try{d.value=await e.clipboard.readText()}catch{A=!0}A&&(d.value=y())}p.value&&n&&te(["copy","cut"],m,{passive:!0});async function v(A=Tt(a)){if(p.value&&A!=null){let h=!(r.value&&R(c.value));if(!h)try{await e.clipboard.writeText(A)}catch{h=!0}h&&b(A),d.value=A,u.value=!0,g.start()}}function b(A){const h=document.createElement("textarea");h.value=A??"",h.style.position="absolute",h.style.opacity="0",document.body.appendChild(h),h.select(),document.execCommand("copy"),h.remove()}function y(){var A,h,k;return(k=(h=(A=document==null?void 0:document.getSelection)==null?void 0:A.call(document))==null?void 0:h.toString())!=null?k:""}function R(A){return A==="granted"||A==="prompt"}return{isSupported:p,text:d,copied:u,copy:v}}const ja=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ua="__vueuse_ssr_handlers__",Ug=Zg();function Zg(){return Ua in ja||(ja[Ua]=ja[Ua]||{}),ja[Ua]}function qg(t,e){return Ug[t]||e}function $g(t){return Xo("(prefers-color-scheme: dark)",t)}function zg(t){return t==null?"any":t instanceof Set?"set":t instanceof Map?"map":t instanceof Date?"date":typeof t=="boolean"?"boolean":typeof t=="string"?"string":typeof t=="object"?"object":Number.isNaN(t)?"any":"number"}const Qg={boolean:{read:t=>t==="true",write:t=>String(t)},object:{read:t=>JSON.parse(t),write:t=>JSON.stringify(t)},number:{read:t=>Number.parseFloat(t),write:t=>String(t)},any:{read:t=>t,write:t=>String(t)},string:{read:t=>t,write:t=>String(t)},map:{read:t=>new Map(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t.entries()))},set:{read:t=>new Set(JSON.parse(t)),write:t=>JSON.stringify(Array.from(t))},date:{read:t=>new Date(t),write:t=>t.toISOString()}},mi="vueuse-storage";function Jo(t,e,n,a={}){var s;const{flush:o="pre",deep:r=!0,listenToStorageChanges:l=!0,writeDefaults:c=!0,mergeDefaults:p=!1,shallow:d,window:u=Be,eventFilter:g,onError:m=W=>{console.error(W)},initOnMounted:v}=a,b=(d?kt:zt)(typeof e=="function"?e():e),y=G(()=>Tt(t));if(!n)try{n=qg("getDefaultStorage",()=>{var W;return(W=Be)==null?void 0:W.localStorage})()}catch(W){m(W)}if(!n)return b;const R=Tt(e),A=zg(R),h=(s=a.serializer)!=null?s:Qg[A],{pause:k,resume:M}=Mg(b,W=>I(W),{flush:o,deep:r,eventFilter:g});Yt(y,()=>T(),{flush:o});let J=!1;const V=W=>{v&&!J||T(W)},x=W=>{v&&!J||B(W)};u&&l&&(n instanceof Storage?te(u,"storage",V,{passive:!0}):te(u,mi,x)),v?Cs(()=>{J=!0,T()}):T();function D(W,j){if(u){const P={key:y.value,oldValue:W,newValue:j,storageArea:n};u.dispatchEvent(n instanceof Storage?new StorageEvent("storage",P):new CustomEvent(mi,{detail:P}))}}function I(W){try{const j=n.getItem(y.value);if(W==null)D(j,null),n.removeItem(y.value);else{const P=h.write(W);j!==P&&(n.setItem(y.value,P),D(j,P))}}catch(j){m(j)}}function F(W){const j=W?W.newValue:n.getItem(y.value);if(j==null)return c&&R!=null&&n.setItem(y.value,h.write(R)),R;if(!W&&p){const P=h.read(j);return typeof p=="function"?p(P,R):A==="object"&&!Array.isArray(P)?{...R,...P}:P}else return typeof j!="string"?j:h.read(j)}function T(W){if(!(W&&W.storageArea!==n)){if(W&&W.key==null){b.value=R;return}if(!(W&&W.key!==y.value)){k();try{const j=h.write(b.value);(W===void 0||(W==null?void 0:W.newValue)!==j)&&(b.value=F(W))}catch(j){m(j)}finally{W?wa(M):M()}}}}function B(W){T(W.detail)}return b}function Xg(t,e,n={}){const{window:a=Be,...s}=n;let o;const r=Oa(()=>a&&"ResizeObserver"in a),l=()=>{o&&(o.disconnect(),o=void 0)},c=G(()=>{const u=Tt(t);return Array.isArray(u)?u.map(g=>$e(g)):[$e(u)]}),p=Yt(c,u=>{if(l(),r.value&&a){o=new ResizeObserver(e);for(const g of u)g&&o.observe(g,s)}},{immediate:!0,flush:"post"}),d=()=>{l(),p()};return Ds(d),{isSupported:r,stop:d}}function Jg(t,e={width:0,height:0},n={}){const{window:a=Be,box:s="content-box"}=n,o=G(()=>{var u,g;return(g=(u=$e(t))==null?void 0:u.namespaceURI)==null?void 0:g.includes("svg")}),r=kt(e.width),l=kt(e.height),{stop:c}=Xg(t,([u])=>{const g=s==="border-box"?u.borderBoxSize:s==="content-box"?u.contentBoxSize:u.devicePixelContentBoxSize;if(a&&o.value){const m=$e(t);if(m){const v=m.getBoundingClientRect();r.value=v.width,l.value=v.height}}else if(g){const m=da(g);r.value=m.reduce((v,{inlineSize:b})=>v+b,0),l.value=m.reduce((v,{blockSize:b})=>v+b,0)}else r.value=u.contentRect.width,l.value=u.contentRect.height},n);Cs(()=>{const u=$e(t);u&&(r.value="offsetWidth"in u?u.offsetWidth:e.width,l.value="offsetHeight"in u?u.offsetHeight:e.height)});const p=Yt(()=>$e(t),u=>{r.value=u?e.width:0,l.value=u?e.height:0});function d(){c(),p()}return{width:r,height:l,stop:d}}const hi=1;function Yg(t,e={}){const{throttle:n=0,idle:a=200,onStop:s=An,onScroll:o=An,offset:r={left:0,right:0,top:0,bottom:0},observe:l={mutation:!1},eventListenerOptions:c={capture:!1,passive:!0},behavior:p="auto",window:d=Be,onError:u=D=>{console.error(D)}}=e,g=typeof l=="boolean"?{mutation:l}:l,m=kt(0),v=kt(0),b=G({get(){return m.value},set(D){R(D,void 0)}}),y=G({get(){return v.value},set(D){R(void 0,D)}});function R(D,I){var F,T,B,W;if(!d)return;const j=Tt(t);if(!j)return;(B=j instanceof Document?d.document.body:j)==null||B.scrollTo({top:(F=Tt(I))!=null?F:y.value,left:(T=Tt(D))!=null?T:b.value,behavior:Tt(p)});const P=((W=j==null?void 0:j.document)==null?void 0:W.documentElement)||(j==null?void 0:j.documentElement)||j;b!=null&&(m.value=P.scrollLeft),y!=null&&(v.value=P.scrollTop)}const A=kt(!1),h=yn({left:!0,right:!1,top:!0,bottom:!1}),k=yn({left:!1,right:!1,top:!1,bottom:!1}),M=D=>{A.value&&(A.value=!1,k.left=!1,k.right=!1,k.top=!1,k.bottom=!1,s(D))},J=bc(M,n+a),V=D=>{var I;if(!d)return;const F=((I=D==null?void 0:D.document)==null?void 0:I.documentElement)||(D==null?void 0:D.documentElement)||$e(D),{display:T,flexDirection:B,direction:W}=getComputedStyle(F),j=W==="rtl"?-1:1,P=F.scrollLeft;k.left=P<m.value,k.right=P>m.value;const Y=Math.abs(P*j)<=(r.left||0),U=Math.abs(P*j)+F.clientWidth>=F.scrollWidth-(r.right||0)-hi;T==="flex"&&B==="row-reverse"?(h.left=U,h.right=Y):(h.left=Y,h.right=U),m.value=P;let ot=F.scrollTop;D===d.document&&!ot&&(ot=d.document.body.scrollTop),k.top=ot<v.value,k.bottom=ot>v.value;const Ct=Math.abs(ot)<=(r.top||0),Wt=Math.abs(ot)+F.clientHeight>=F.scrollHeight-(r.bottom||0)-hi;T==="flex"&&B==="column-reverse"?(h.top=Wt,h.bottom=Ct):(h.top=Ct,h.bottom=Wt),v.value=ot},x=D=>{var I;if(!d)return;const F=(I=D.target.documentElement)!=null?I:D.target;V(F),A.value=!0,J(D),o(D)};return te(t,"scroll",n?Vg(x,n,!0,!1):x,c),Cs(()=>{try{const D=Tt(t);if(!D)return;V(D)}catch(D){u(D)}}),g!=null&&g.mutation&&t!=null&&t!==d&&t!==document&&Ec(t,()=>{const D=Tt(t);D&&V(D)},{attributes:!0,childList:!0,subtree:!0}),te(t,"scrollend",M,c),{x:b,y,isScrolling:A,arrivedState:h,directions:k,measure(){const D=Tt(t);d&&D&&V(D)}}}function t_(t={}){const{window:e=Be,...n}=t;return Yg(e,n)}function e_(t={}){const{window:e=Be,initialWidth:n=Number.POSITIVE_INFINITY,initialHeight:a=Number.POSITIVE_INFINITY,listenOrientation:s=!0,includeScrollbar:o=!0,type:r="inner"}=t,l=kt(n),c=kt(a),p=()=>{if(e)if(r==="outer")l.value=e.outerWidth,c.value=e.outerHeight;else if(r==="visual"&&e.visualViewport){const{width:u,height:g,scale:m}=e.visualViewport;l.value=Math.round(u*m),c.value=Math.round(g*m)}else o?(l.value=e.innerWidth,c.value=e.innerHeight):(l.value=e.document.documentElement.clientWidth,c.value=e.document.documentElement.clientHeight)};p(),Cs(p);const d={passive:!0};if(te("resize",p,d),e&&r==="visual"&&e.visualViewport&&te(e.visualViewport,"resize",p,d),s){const u=Xo("(orientation: portrait)");Yt(u,()=>p())}return{width:l,height:c}}const fi=async(t,e)=>{const{path:n,query:a}=t.currentRoute.value,{scrollBehavior:s}=t.options;t.options.scrollBehavior=void 0,await t.replace({path:n,query:a,hash:e}),t.options.scrollBehavior=s},n_=({headerLinkSelector:t,headerAnchorSelector:e,delay:n,offset:a=5})=>{const s=La();te("scroll",bc(()=>{var v,b;const r=Math.max(window.scrollY,document.documentElement.scrollTop,document.body.scrollTop);if(Math.abs(r-0)<a){fi(s,"");return}const c=window.innerHeight+r,p=Math.max(document.documentElement.scrollHeight,document.body.scrollHeight),d=Math.abs(p-c)<a,u=Array.from(document.querySelectorAll(t)),m=Array.from(document.querySelectorAll(e)).filter(y=>u.some(R=>R.hash===y.hash));for(let y=0;y<m.length;y++){const R=m[y],A=m[y+1],h=r>=(((v=R.parentElement)==null?void 0:v.offsetTop)??0)-a,k=!A||r<(((b=A.parentElement)==null?void 0:b.offsetTop)??0)-a;if(!(h&&k))continue;const J=decodeURIComponent(s.currentRoute.value.hash),V=decodeURIComponent(R.hash);if(J===V)return;if(d){for(let x=y+1;x<m.length;x++)if(J===decodeURIComponent(m[x].hash))return}fi(s,V);return}},n))},a_="a.vp-sidebar-item",s_=".header-anchor",o_=300,r_=5,i_=We({setup(){n_({headerLinkSelector:a_,headerAnchorSelector:s_,delay:o_,offset:r_})}}),l_=Object.freeze(Object.defineProperty({__proto__:null,default:i_},Symbol.toStringTag,{value:"Module"}));var pe=Uint8Array,In=Uint16Array,c_=Int32Array,yc=new pe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Tc=new pe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),p_=new pe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ac=function(t,e){for(var n=new In(31),a=0;a<31;++a)n[a]=e+=1<<t[a-1];for(var s=new c_(n[30]),a=1;a<30;++a)for(var o=n[a];o<n[a+1];++o)s[o]=o-n[a]<<5|a;return{b:n,r:s}},xc=Ac(yc,2),Pc=xc.b,d_=xc.r;Pc[28]=258,d_[258]=28;var u_=Ac(Tc,0),g_=u_.b,Eo=new In(32768);for(var Dt=0;Dt<32768;++Dt){var en=(Dt&43690)>>1|(Dt&21845)<<1;en=(en&52428)>>2|(en&13107)<<2,en=(en&61680)>>4|(en&3855)<<4,Eo[Dt]=((en&65280)>>8|(en&255)<<8)>>1}var ua=function(t,e,n){for(var a=t.length,s=0,o=new In(e);s<a;++s)t[s]&&++o[t[s]-1];var r=new In(e);for(s=1;s<e;++s)r[s]=r[s-1]+o[s-1]<<1;var l;if(n){l=new In(1<<e);var c=15-e;for(s=0;s<a;++s)if(t[s])for(var p=s<<4|t[s],d=e-t[s],u=r[t[s]-1]++<<d,g=u|(1<<d)-1;u<=g;++u)l[Eo[u]>>c]=p}else for(l=new In(a),s=0;s<a;++s)t[s]&&(l[s]=Eo[r[t[s]-1]++]>>15-t[s]);return l},Ga=new pe(288);for(var Dt=0;Dt<144;++Dt)Ga[Dt]=8;for(var Dt=144;Dt<256;++Dt)Ga[Dt]=9;for(var Dt=256;Dt<280;++Dt)Ga[Dt]=7;for(var Dt=280;Dt<288;++Dt)Ga[Dt]=8;var wc=new pe(32);for(var Dt=0;Dt<32;++Dt)wc[Dt]=5;var __=ua(Ga,9,1),m_=ua(wc,5,1),to=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},ke=function(t,e,n){var a=e/8|0;return(t[a]|t[a+1]<<8)>>(e&7)&n},eo=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},h_=function(t){return(t+7)/8|0},Sc=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new pe(t.subarray(e,n))},f_=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],he=function(t,e,n){var a=new Error(e||f_[t]);if(a.code=t,Error.captureStackTrace&&Error.captureStackTrace(a,he),!n)throw a;return a},v_=function(t,e,n,a){var s=t.length,o=0;if(!s||e.f&&!e.l)return n||new pe(0);var r=!n,l=r||e.i!=2,c=e.i;r&&(n=new pe(s*3));var p=function(pt){var _t=n.length;if(pt>_t){var _=new pe(Math.max(_t*2,pt));_.set(n),n=_}},d=e.f||0,u=e.p||0,g=e.b||0,m=e.l,v=e.d,b=e.m,y=e.n,R=s*8;do{if(!m){d=ke(t,u,1);var A=ke(t,u+1,3);if(u+=3,A)if(A==1)m=__,v=m_,b=9,y=5;else if(A==2){var J=ke(t,u,31)+257,V=ke(t,u+10,15)+4,x=J+ke(t,u+5,31)+1;u+=14;for(var D=new pe(x),I=new pe(19),F=0;F<V;++F)I[p_[F]]=ke(t,u+F*3,7);u+=V*3;for(var T=to(I),B=(1<<T)-1,W=ua(I,T,1),F=0;F<x;){var j=W[ke(t,u,B)];u+=j&15;var h=j>>4;if(h<16)D[F++]=h;else{var P=0,Y=0;for(h==16?(Y=3+ke(t,u,3),u+=2,P=D[F-1]):h==17?(Y=3+ke(t,u,7),u+=3):h==18&&(Y=11+ke(t,u,127),u+=7);Y--;)D[F++]=P}}var U=D.subarray(0,J),ot=D.subarray(J);b=to(U),y=to(ot),m=ua(U,b,1),v=ua(ot,y,1)}else he(1);else{var h=h_(u)+4,k=t[h-4]|t[h-3]<<8,M=h+k;if(M>s){c&&he(0);break}l&&p(g+k),n.set(t.subarray(h,M),g),e.b=g+=k,e.p=u=M*8,e.f=d;continue}if(u>R){c&&he(0);break}}l&&p(g+131072);for(var Ct=(1<<b)-1,Wt=(1<<y)-1,Bt=u;;Bt=u){var P=m[eo(t,u)&Ct],ee=P>>4;if(u+=P&15,u>R){c&&he(0);break}if(P||he(2),ee<256)n[g++]=ee;else if(ee==256){Bt=u,m=null;break}else{var ve=ee-254;if(ee>264){var F=ee-257,Mt=yc[F];ve=ke(t,u,(1<<Mt)-1)+Pc[F],u+=Mt}var jt=v[eo(t,u)&Wt],S=jt>>4;jt||he(3),u+=jt&15;var ot=g_[S];if(S>3){var Mt=Tc[S];ot+=eo(t,u)&(1<<Mt)-1,u+=Mt}if(u>R){c&&he(0);break}l&&p(g+131072);var z=g+ve;if(g<ot){var q=o-ot,et=Math.min(ot,z);for(q+g<0&&he(3);g<et;++g)n[g]=a[q+g]}for(;g<z;++g)n[g]=n[g-ot]}}e.l=m,e.p=Bt,e.b=g,e.f=d,m&&(d=1,e.m=b,e.d=v,e.n=y)}while(!d);return g!=n.length&&r?Sc(n,0,g):n.subarray(0,g)},b_=new pe(0),k_=function(t,e){return((t[0]&15)!=8||t[0]>>4>7||(t[0]<<8|t[1])%31)&&he(6,"invalid zlib data"),(t[1]>>5&1)==1&&he(6,"invalid zlib data: "+(t[1]&32?"need":"unexpected")+" dictionary"),(t[1]>>3&4)+2};function E_(t,e){return v_(t.subarray(k_(t),-4),{i:2},e,e)}var yo=typeof TextDecoder<"u"&&new TextDecoder,y_=0;try{yo.decode(b_,{stream:!0}),y_=1}catch{}var T_=function(t){for(var e="",n=0;;){var a=t[n++],s=(a>127)+(a>223)+(a>239);if(n+s>t.length)return{s:e,r:Sc(t,n-1)};s?s==3?(a=((a&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|a>>10,56320|a&1023)):s&1?e+=String.fromCharCode((a&31)<<6|t[n++]&63):e+=String.fromCharCode((a&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(a)}};function A_(t,e){{for(var n=new pe(t.length),a=0;a<t.length;++a)n[a]=t.charCodeAt(a);return n}for(var s=t.length,a=0;a<s;++a);}function x_(t,e){var n;if(yo)return yo.decode(t);var a=T_(t),s=a.s,n=a.r;return n.length&&he(8),s}const Rc=[...new Array(6)].map((t,e)=>`[vp-content] h${e+1}`).join(","),P_=(t,e=2)=>{if(e===!1)return[];const[n,a]=typeof e=="number"?[e,e]:e==="deep"?[2,6]:e,s=t.filter(r=>r.level>=n&&r.level<=a),o=[];t:for(let r=0;r<s.length;r++){const l=s[r];if(r===0)o.push(l);else{for(let c=r-1;c>=0;c--){const p=s[c];if(p.level<l.level){p.children.push(l);continue t}}o.push(l)}}return o},w_=(t,e=[])=>{let n;if(e.length){const a=t.cloneNode(!0);a.querySelectorAll(e.join(",")).forEach(s=>{s.remove()}),n=a.textContent||""}else n=t.textContent||"";return n.trim()},S_=(t=Rc,e=[])=>Array.from(document.querySelectorAll(t)).filter(n=>n.id&&n.hasChildNodes()).map(n=>({element:n,title:w_(n,e),link:`#${n.id}`,slug:n.id,level:Number(n.tagName[1]),children:[]})),R_=({selector:t=Rc,levels:e=2,ignore:n=[]}={})=>P_(S_(t,n),e),Dc=(t,e)=>{var a;const n=(a=Ve())==null?void 0:a.appContext.components;return n?t in n||$t(t)in n||Aa($t(t))in n:!1},Yo=t=>{const e=Ho();return G(()=>Tt(t)[e.value]??{})},D_=()=>{const t=dg();return G(()=>Object.keys(t.value))},C_=t=>typeof t<"u",Cc=(t,e)=>ye(t)&&t.startsWith(e),{keys:L_}=Object,Lc=t=>Cc(t,"/")&&t[1]!=="/",Ic=t=>!Nu(t)&&!Da(t);var I_={"/":{backToTop:"返回顶部"}};const O_=dt({name:"BackToTop",setup(){const t=xn(),e=Yo(I_),n=kt(),{height:a}=Jg(n),{height:s}=e_(),{y:o}=t_(),r=G(()=>(t.value.backToTop??!0)&&o.value>100),l=G(()=>o.value/(a.value-s.value)*100);return re(()=>{n.value=document.body}),()=>Q(Vo,{name:"back-to-top"},()=>r.value?Q("button",{type:"button",class:"vp-back-to-top-button","aria-label":e.value.backToTop,onClick:()=>{window.scrollTo({top:0,behavior:"smooth"})}},[Q("span",{class:"vp-scroll-progress",role:"progressbar","aria-labelledby":"loadinglabel","aria-valuenow":l.value},Q("svg",Q("circle",{cx:"26",cy:"26",r:"24",fill:"none",stroke:"currentColor","stroke-width":"4","stroke-dasharray":`${Math.PI*l.value*.48} ${Math.PI*(100-l.value)*.48}`}))),Q("div",{class:"back-to-top-icon"})]):null)}}),G_=We({rootComponents:[O_]}),B_=Object.freeze(Object.defineProperty({__proto__:null,default:G_},Symbol.toStringTag,{value:"Module"})),V_=/language-(shellscript|shell|bash|sh|zsh)/,W_=({duration:t=2e3,locales:e,selector:n,showInMobile:a,ignoreSelector:s=[],transform:o})=>{const r=Xo("(max-width: 419px)"),l=G(()=>!r.value||a),c=Yo(e),p=v=>{var y;if(v.hasAttribute("copy-code"))return;const b=document.createElement("button");b.type="button",b.classList.add("vp-copy-code-button"),b.setAttribute("aria-label",c.value.copy),b.setAttribute("data-copied",c.value.copied),(y=v.parentElement)==null||y.insertBefore(b,v),v.setAttribute("copy-code","")},d=()=>{document.body.classList.toggle("no-copy-code",!l.value),l.value&&document.querySelectorAll(n.join(",")).forEach(p)};Ls(l,d,{flush:"post"}),Ia(v=>{v!=="beforeUnmount"&&d()});const{copy:u}=jg({legacy:!0}),g=new WeakMap,m=async(v,b,y)=>{const R=b.cloneNode(!0);s.length&&R.querySelectorAll(s.join(",")).forEach(k=>{k.remove()}),o&&o(R);let A=R.textContent||"";if(V_.test(v.className)&&(A=A.replace(/^ *(\$|>) /gm,"")),await u(A),t<=0)return;y.classList.add("copied"),clearTimeout(g.get(y));const h=setTimeout(()=>{y.classList.remove("copied"),y.blur(),g.delete(y)},t);g.set(y,h)};te("click",v=>{const b=v.target;if(l.value&&b.matches('div[class*="language-"] > button.vp-copy-code-button')){const y=b.parentElement,R=b.nextElementSibling;if(!y||!R)return;m(y,R,b)}})};var M_=[],F_={"/":{copy:"复制代码",copied:"已复制"}},N_=['[vp-content] div[class*="language-"] pre'];const K_=We({setup:()=>{W_({selector:N_,ignoreSelector:M_,locales:F_,duration:2e3,showInMobile:!1})}}),H_=Object.freeze(Object.defineProperty({__proto__:null,default:K_},Symbol.toStringTag,{value:"Module"})),j_=We({setup(){te("beforeprint",()=>{document.querySelectorAll("details").forEach(t=>{t.open=!0})})}}),U_=Object.freeze(Object.defineProperty({__proto__:null,default:j_},Symbol.toStringTag,{value:"Module"}));var vi={provider:"github",pattern:{commit:":repo/commit/:hash",issue:":repo/issues/:issue",tag:":repo/releases/tag/:tag"},repo:""};const bi=typeof vi>"u"?{}:vi,Z_=(t,e)=>!t||Ca(t)?t:e==="github"?`https://github.com/${t}`:e==="gitee"?`https://gitee.com/${t}`:t,q_=/#(\d+)/g,$_=(t=!0)=>{const e=xn(),n=Ko(),a=Ss(),{pattern:s={},provider:o}=bi,r=Z_(bi.repo,o);return G(()=>{var c;if(e.value.changelog===!1||!Tt(t))return[];const l=new Intl.DateTimeFormat(n.value,{dateStyle:"short"});return(((c=a.value.git)==null?void 0:c.changelog)??[]).map(p=>{const d={date:l.format(p.time),...p};return s.issue&&r&&(d.message=d.message.replace(q_,(u,g)=>`<a href="${s.issue.replace(":issue",g).replace(":repo",r)}" target="_blank" rel="noopener noreferrer">${u}</a>`)),s.commit&&r&&(d.commitUrl=s.commit.replace(":hash",d.hash).replace(":repo",r)),s.tag&&r&&d.tag&&(d.tagUrl=s.tag.replace(":tag",d.tag).replace(":repo",r)),d})})},Oc=(t=!0)=>{const e=xn(),n=Ss();return G(()=>{var a;return e.value.contributors===!1||!Tt(t)?[]:((a=n.value.git)==null?void 0:a.contributors)??[]})};var ki={"/":{contributors:"贡献者",changelog:"更新日志",timeOn:"于",viewChangelog:"查看所有更新日志",latestUpdateAt:"最近更新："}};const z_=typeof ki>"u"?{}:ki,tr=()=>Yo(z_),Gc=(t=!0)=>{const e=Ko(),n=tr(),a=Ss();return G(()=>{var l,c,p;if(!Tt(t))return null;const s=((l=a.value.git)==null?void 0:l.updatedTime)??((p=(c=a.value.git)==null?void 0:c.changelog)==null?void 0:p[0].time);if(!s)return null;const o=new Date(s),r=new Intl.DateTimeFormat(e.value,{dateStyle:"short",timeStyle:"short"}).format(s);return{date:o,text:r,iso:o.toISOString(),locale:n.value.latestUpdateAt}})},Bc=({level:t=2,text:e,anchor:n})=>Q(`h${t||2}`,{id:n,tabindex:"-1"},Q("a",{href:`#${n}`,class:"header-anchor"},Q("span",e))),Q_=({name:t,url:e,avatar:n})=>Q(e?"a":"span",{href:e,target:"_blank",rel:"noreferrer",class:"vp-contributor"},[n?Q("img",{src:n,alt:"",class:"vp-contributor-avatar"}):null,Q("span",{class:"vp-contributor-name"},t)]),X_=dt({name:"GitContributors",props:{title:String,headerLevel:{type:Number,default:2}},setup(t){const e=Oc(),n=tr();return()=>e.value.length?[Q(Bc,{level:t.headerLevel,anchor:"doc-contributors",text:t.title||n.value.contributors}),Q("div",{class:"vp-contributors"},e.value.map(a=>Q(Q_,a)))]:null}}),J_=dt({name:"GitChangelog",props:{title:String,headerLevel:{type:Number,default:2}},setup(t){const e=$_(),n=tr(),a=Gc(),[s,o]=Qo(),r=()=>Q("div",{class:"vp-changelog-header",onClick:()=>o()},[Q("div",{class:"vp-latest-updated"},[Q("span",{class:"vp-changelog-icon"}),Q("span",{"data-allow-mismatch":""},a.value.text)]),Q("div",[Q("span",{class:"vp-changelog-menu-icon"}),Q("span",n.value.viewChangelog)])]),l=({item:p})=>Q("li",{class:"vp-changelog-item-tag"},Q("div",[Q("a",{class:"vp-changelog-tag"},Q("code",p.tag)),Q("span",{class:"vp-changelog-date","data-allow-mismatch":""},[n.value.timeOn," ",Q("time",{datetime:new Date(p.time).toISOString()},p.date)])])),c=({item:p})=>Q("li",{class:"vp-changelog-item-commit"},[Q(p.commitUrl?"a":"span",{class:"vp-changelog-hash",href:p.commitUrl,target:"_blank",rel:"noreferrer"},[Q("code",p.hash.slice(0,5))]),Q("span",{class:"vp-changelog-divider"},"-"),Q("span",{class:"vp-changelog-message",innerHTML:p.message}),Q("span",{class:"vp-changelog-date","data-allow-mismatch":""},[n.value.timeOn||"on"," ",Q("time",{datetime:new Date(p.time).toISOString()},p.date)])]);return()=>e.value.length?[Q(Bc,{level:t.headerLevel,anchor:"doc-changelog",text:t.title||n.value.changelog}),Q("div",{class:["vp-changelog-wrapper",{active:s.value}]},[Q(r),Q("ul",{class:"vp-changelog-list"},[e.value.map(p=>p.tag?Q(l,{item:p,key:p.tag}):Q(c,{item:p,key:p.hash}))])])]:null}}),Y_={enhance:({app:t})=>{t.component("GitContributors",X_),t.component("GitChangelog",J_)}},tm=Object.freeze(Object.defineProperty({__proto__:null,default:Y_},Symbol.toStringTag,{value:"Module"}));/*! medium-zoom 1.1.0 | MIT License | https://github.com/francoischalifour/medium-zoom */var _n=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a])}return t},Za=function(e){return e.tagName==="IMG"},em=function(e){return NodeList.prototype.isPrototypeOf(e)},ts=function(e){return e&&e.nodeType===1},Ei=function(e){var n=e.currentSrc||e.src;return n.substr(-4).toLowerCase()===".svg"},yi=function(e){try{return Array.isArray(e)?e.filter(Za):em(e)?[].slice.call(e).filter(Za):ts(e)?[e].filter(Za):typeof e=="string"?[].slice.call(document.querySelectorAll(e)).filter(Za):[]}catch{throw new TypeError(`The provided selector is invalid.
Expects a CSS selector, a Node element, a NodeList or an array.
See: https://github.com/francoischalifour/medium-zoom`)}},nm=function(e){var n=document.createElement("div");return n.classList.add("medium-zoom-overlay"),n.style.background=e,n},am=function(e){var n=e.getBoundingClientRect(),a=n.top,s=n.left,o=n.width,r=n.height,l=e.cloneNode(),c=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0,p=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;return l.removeAttribute("id"),l.style.position="absolute",l.style.top=a+c+"px",l.style.left=s+p+"px",l.style.width=o+"px",l.style.height=r+"px",l.style.transform="",l},Sn=function(e,n){var a=_n({bubbles:!1,cancelable:!1,detail:void 0},n);if(typeof window.CustomEvent=="function")return new CustomEvent(e,a);var s=document.createEvent("CustomEvent");return s.initCustomEvent(e,a.bubbles,a.cancelable,a.detail),s},sm=function t(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=window.Promise||function(T){function B(){}T(B,B)},s=function(T){var B=T.target;if(B===D){v();return}h.indexOf(B)!==-1&&b({target:B})},o=function(){if(!(M||!x.original)){var T=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;Math.abs(J-T)>V.scrollOffset&&setTimeout(v,150)}},r=function(T){var B=T.key||T.keyCode;(B==="Escape"||B==="Esc"||B===27)&&v()},l=function(){var T=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},B=T;if(T.background&&(D.style.background=T.background),T.container&&T.container instanceof Object&&(B.container=_n({},V.container,T.container)),T.template){var W=ts(T.template)?T.template:document.querySelector(T.template);B.template=W}return V=_n({},V,B),h.forEach(function(j){j.dispatchEvent(Sn("medium-zoom:update",{detail:{zoom:I}}))}),I},c=function(){var T=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return t(_n({},V,T))},p=function(){for(var T=arguments.length,B=Array(T),W=0;W<T;W++)B[W]=arguments[W];var j=B.reduce(function(P,Y){return[].concat(P,yi(Y))},[]);return j.filter(function(P){return h.indexOf(P)===-1}).forEach(function(P){h.push(P),P.classList.add("medium-zoom-image")}),k.forEach(function(P){var Y=P.type,U=P.listener,ot=P.options;j.forEach(function(Ct){Ct.addEventListener(Y,U,ot)})}),I},d=function(){for(var T=arguments.length,B=Array(T),W=0;W<T;W++)B[W]=arguments[W];x.zoomed&&v();var j=B.length>0?B.reduce(function(P,Y){return[].concat(P,yi(Y))},[]):h;return j.forEach(function(P){P.classList.remove("medium-zoom-image"),P.dispatchEvent(Sn("medium-zoom:detach",{detail:{zoom:I}}))}),h=h.filter(function(P){return j.indexOf(P)===-1}),I},u=function(T,B){var W=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return h.forEach(function(j){j.addEventListener("medium-zoom:"+T,B,W)}),k.push({type:"medium-zoom:"+T,listener:B,options:W}),I},g=function(T,B){var W=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};return h.forEach(function(j){j.removeEventListener("medium-zoom:"+T,B,W)}),k=k.filter(function(j){return!(j.type==="medium-zoom:"+T&&j.listener.toString()===B.toString())}),I},m=function(){var T=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},B=T.target,W=function(){var P={width:document.documentElement.clientWidth,height:document.documentElement.clientHeight,left:0,top:0,right:0,bottom:0},Y=void 0,U=void 0;if(V.container)if(V.container instanceof Object)P=_n({},P,V.container),Y=P.width-P.left-P.right-V.margin*2,U=P.height-P.top-P.bottom-V.margin*2;else{var ot=ts(V.container)?V.container:document.querySelector(V.container),Ct=ot.getBoundingClientRect(),Wt=Ct.width,Bt=Ct.height,ee=Ct.left,ve=Ct.top;P=_n({},P,{width:Wt,height:Bt,left:ee,top:ve})}Y=Y||P.width-V.margin*2,U=U||P.height-V.margin*2;var Mt=x.zoomedHd||x.original,jt=Ei(Mt)?Y:Mt.naturalWidth||Y,S=Ei(Mt)?U:Mt.naturalHeight||U,z=Mt.getBoundingClientRect(),q=z.top,et=z.left,pt=z.width,_t=z.height,_=Math.min(Math.max(pt,jt),Y)/pt,f=Math.min(Math.max(_t,S),U)/_t,E=Math.min(_,f),C=(-et+(Y-pt)/2+V.margin+P.left)/E,w=(-q+(U-_t)/2+V.margin+P.top)/E,L="scale("+E+") translate3d("+C+"px, "+w+"px, 0)";x.zoomed.style.transform=L,x.zoomedHd&&(x.zoomedHd.style.transform=L)};return new a(function(j){if(B&&h.indexOf(B)===-1){j(I);return}var P=function Wt(){M=!1,x.zoomed.removeEventListener("transitionend",Wt),x.original.dispatchEvent(Sn("medium-zoom:opened",{detail:{zoom:I}})),j(I)};if(x.zoomed){j(I);return}if(B)x.original=B;else if(h.length>0){var Y=h;x.original=Y[0]}else{j(I);return}if(x.original.dispatchEvent(Sn("medium-zoom:open",{detail:{zoom:I}})),J=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0,M=!0,x.zoomed=am(x.original),document.body.appendChild(D),V.template){var U=ts(V.template)?V.template:document.querySelector(V.template);x.template=document.createElement("div"),x.template.appendChild(U.content.cloneNode(!0)),document.body.appendChild(x.template)}if(x.original.parentElement&&x.original.parentElement.tagName==="PICTURE"&&x.original.currentSrc&&(x.zoomed.src=x.original.currentSrc),document.body.appendChild(x.zoomed),window.requestAnimationFrame(function(){document.body.classList.add("medium-zoom--opened")}),x.original.classList.add("medium-zoom-image--hidden"),x.zoomed.classList.add("medium-zoom-image--opened"),x.zoomed.addEventListener("click",v),x.zoomed.addEventListener("transitionend",P),x.original.getAttribute("data-zoom-src")){x.zoomedHd=x.zoomed.cloneNode(),x.zoomedHd.removeAttribute("srcset"),x.zoomedHd.removeAttribute("sizes"),x.zoomedHd.removeAttribute("loading"),x.zoomedHd.src=x.zoomed.getAttribute("data-zoom-src"),x.zoomedHd.onerror=function(){clearInterval(ot),console.warn("Unable to reach the zoom image target "+x.zoomedHd.src),x.zoomedHd=null,W()};var ot=setInterval(function(){x.zoomedHd.complete&&(clearInterval(ot),x.zoomedHd.classList.add("medium-zoom-image--opened"),x.zoomedHd.addEventListener("click",v),document.body.appendChild(x.zoomedHd),W())},10)}else if(x.original.hasAttribute("srcset")){x.zoomedHd=x.zoomed.cloneNode(),x.zoomedHd.removeAttribute("sizes"),x.zoomedHd.removeAttribute("loading");var Ct=x.zoomedHd.addEventListener("load",function(){x.zoomedHd.removeEventListener("load",Ct),x.zoomedHd.classList.add("medium-zoom-image--opened"),x.zoomedHd.addEventListener("click",v),document.body.appendChild(x.zoomedHd),W()})}else W()})},v=function(){return new a(function(T){if(M||!x.original){T(I);return}var B=function W(){x.original.classList.remove("medium-zoom-image--hidden"),document.body.removeChild(x.zoomed),x.zoomedHd&&document.body.removeChild(x.zoomedHd),document.body.removeChild(D),x.zoomed.classList.remove("medium-zoom-image--opened"),x.template&&document.body.removeChild(x.template),M=!1,x.zoomed.removeEventListener("transitionend",W),x.original.dispatchEvent(Sn("medium-zoom:closed",{detail:{zoom:I}})),x.original=null,x.zoomed=null,x.zoomedHd=null,x.template=null,T(I)};M=!0,document.body.classList.remove("medium-zoom--opened"),x.zoomed.style.transform="",x.zoomedHd&&(x.zoomedHd.style.transform=""),x.template&&(x.template.style.transition="opacity 150ms",x.template.style.opacity=0),x.original.dispatchEvent(Sn("medium-zoom:close",{detail:{zoom:I}})),x.zoomed.addEventListener("transitionend",B)})},b=function(){var T=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},B=T.target;return x.original?v():m({target:B})},y=function(){return V},R=function(){return h},A=function(){return x.original},h=[],k=[],M=!1,J=0,V=n,x={original:null,zoomed:null,zoomedHd:null,template:null};Object.prototype.toString.call(e)==="[object Object]"?V=e:(e||typeof e=="string")&&p(e),V=_n({margin:0,background:"#fff",scrollOffset:40,container:null,template:null},V);var D=nm(V.background);document.addEventListener("click",s),document.addEventListener("keyup",r),document.addEventListener("scroll",o),window.addEventListener("resize",v);var I={open:m,close:v,toggle:b,update:l,clone:c,attach:p,detach:d,on:u,off:g,getOptions:y,getImages:R,getZoomedImage:A};return I};function om(t,e){e===void 0&&(e={});var n=e.insertAt;if(!(typeof document>"u")){var a=document.head||document.getElementsByTagName("head")[0],s=document.createElement("style");s.type="text/css",n==="top"&&a.firstChild?a.insertBefore(s,a.firstChild):a.appendChild(s),s.styleSheet?s.styleSheet.cssText=t:s.appendChild(document.createTextNode(t))}}var rm=".medium-zoom-overlay{position:fixed;top:0;right:0;bottom:0;left:0;opacity:0;transition:opacity .3s;will-change:opacity}.medium-zoom--opened .medium-zoom-overlay{cursor:pointer;cursor:zoom-out;opacity:1}.medium-zoom-image{cursor:pointer;cursor:zoom-in;transition:transform .3s cubic-bezier(.2,0,.2,1)!important}.medium-zoom-image--hidden{visibility:hidden}.medium-zoom-image--opened{position:relative;cursor:pointer;cursor:zoom-out;will-change:transform}";om(rm);const Vc=Symbol("mediumZoom"),im=()=>{const t=Qt(Vc);if(!t)throw new Error("useMediumZoom() is called without provider.");return t};var lm={};const cm="[vp-content] > img, [vp-content] :not(a) > img",pm=lm,dm=We({enhance({app:t}){const e=sm(pm);e.refresh=(n=cm)=>{e.detach(),e.attach(n)},t.provide(Vc,e)},setup(){const t=im();Ia(e=>{e!=="beforeUnmount"&&t.refresh()})}}),um=Object.freeze(Object.defineProperty({__proto__:null,default:dm},Symbol.toStringTag,{value:"Module"}));/**
 * NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
 * @license MIT
 */const Ti=(t,e)=>{t.classList.add(e)},Ai=(t,e)=>{t.classList.remove(e)},gm=t=>{var e;(e=t==null?void 0:t.parentNode)==null||e.removeChild(t)},no=(t,e,n)=>t<e?e:t>n?n:t,xi=t=>(-1+t)*100,_m=(()=>{const t=[],e=()=>{const n=t.shift();n&&n(e)};return n=>{t.push(n),t.length===1&&e()}})(),mm=t=>t.replace(/^-ms-/,"ms-").replace(/-([\da-z])/gi,(e,n)=>n.toUpperCase()),qa=(()=>{const t=["Webkit","O","Moz","ms"],e={},n=o=>{const{style:r}=document.body;if(o in r)return o;const l=o.charAt(0).toUpperCase()+o.slice(1);let c=t.length;for(;c--;){const p=`${t[c]}${l}`;if(p in r)return p}return o},a=o=>{const r=mm(o);return e[r]??(e[r]=n(r))},s=(o,r,l)=>{o.style[a(r)]=l};return(o,r)=>{for(const l in r){const c=r[l];Object.hasOwn(r,l)&&C_(c)&&s(o,l,c)}}})(),Ke={minimum:.08,easing:"ease",speed:200,trickleRate:.02,trickleSpeed:800,barSelector:'[role="bar"]',parent:"body",template:'<div class="bar" role="bar"></div>'},Lt={percent:null,isRendered:()=>!!document.getElementById("nprogress"),set:t=>{const{speed:e,easing:n}=Ke,a=Lt.isStarted(),s=no(t,Ke.minimum,1);Lt.percent=s===1?null:s;const o=Lt.render(!a),r=o.querySelector(Ke.barSelector);return o.offsetWidth,_m(l=>{qa(r,{transform:`translate3d(${xi(s)}%,0,0)`,transition:`all ${e}ms ${n}`}),s===1?(qa(o,{transition:"none",opacity:"1"}),o.offsetWidth,setTimeout(()=>{qa(o,{transition:`all ${e}ms linear`,opacity:"0"}),setTimeout(()=>{Lt.remove(),l()},e)},e)):setTimeout(()=>{l()},e)}),Lt},isStarted:()=>typeof Lt.percent=="number",start:()=>{Lt.percent||Lt.set(0);const t=()=>{setTimeout(()=>{Lt.percent&&(Lt.trickle(),t())},Ke.trickleSpeed)};return t(),Lt},done:t=>!t&&!Lt.percent?Lt:Lt.increase(.3+.5*Math.random()).set(1),increase:t=>{let{percent:e}=Lt;return e?(e=no(e+(typeof t=="number"?t:(1-e)*no(Math.random()*e,.1,.95)),0,.994),Lt.set(e)):Lt.start()},trickle:()=>Lt.increase(Math.random()*Ke.trickleRate),render:t=>{if(Lt.isRendered())return document.getElementById("nprogress");Ti(document.documentElement,"nprogress-busy");const e=document.createElement("div");e.id="nprogress",e.innerHTML=Ke.template;const n=e.querySelector(Ke.barSelector),a=document.querySelector(Ke.parent),s=t?"-100":xi(Lt.percent??0);return qa(n,{transition:"all 0 linear",transform:`translate3d(${s}%,0,0)`}),a&&(a!==document.body&&Ti(a,"nprogress-custom-parent"),a.appendChild(e)),e},remove:()=>{Ai(document.documentElement,"nprogress-busy"),Ai(document.querySelector(Ke.parent),"nprogress-custom-parent"),gm(document.getElementById("nprogress"))}},hm=()=>{re(()=>{const t=La(),e=new Set;e.add(t.currentRoute.value.path),t.beforeEach(n=>{e.has(n.path)||Lt.start()}),t.afterEach(n=>{e.add(n.path),Lt.done()})})},fm=We({setup(){hm()}}),vm=Object.freeze(Object.defineProperty({__proto__:null,default:fm},Symbol.toStringTag,{value:"Module"})),bm=({selector:t='div[class*="language-"].has-collapsed-lines > .collapsed-lines'}={})=>{te("click",e=>{const n=e.target;if(n.matches(t)){const a=n.parentElement;a!=null&&a.classList.toggle("collapsed")&&a.scrollIntoView({block:"center",behavior:"instant"})}})},km={setup(){bm()}},Em=Object.freeze(Object.defineProperty({__proto__:null,default:km},Symbol.toStringTag,{value:"Module"})),ym="VUEPRESS_CODE_TAB_STORE",$a=Jo(ym,{}),Tm=dt({name:"CodeTabs",props:{active:{type:Number,default:0},data:{type:Array,required:!0},id:{type:String,required:!0},tabId:String},slots:Object,setup(t,{slots:e}){const n=zt(t.active),a=kt([]),s=()=>{t.tabId&&($a.value[t.tabId]=t.data[n.value].id)},o=(p=n.value)=>{n.value=p<a.value.length-1?p+1:0,a.value[n.value].focus()},r=(p=n.value)=>{n.value=p>0?p-1:a.value.length-1,a.value[n.value].focus()},l=(p,d)=>{p.key===" "||p.key==="Enter"?(p.preventDefault(),n.value=d):p.key==="ArrowRight"?(p.preventDefault(),o()):p.key==="ArrowLeft"&&(p.preventDefault(),r()),t.tabId&&($a.value[t.tabId]=t.data[n.value].id)},c=()=>{if(t.tabId){const p=t.data.findIndex(({id:d})=>$a.value[t.tabId]===d);if(p!==-1)return p}return t.active};return re(()=>{n.value=c(),Yt(()=>t.tabId&&$a.value[t.tabId],(p,d)=>{if(t.tabId&&p!==d){const u=t.data.findIndex(({id:g})=>g===p);u!==-1&&(n.value=u)}})}),()=>t.data.length?Q("div",{class:"vp-code-tabs"},[Q("div",{class:"vp-code-tabs-nav",role:"tablist"},t.data.map(({id:p},d)=>{const u=d===n.value;return Q("button",{type:"button",ref:g=>{g&&(a.value[d]=g)},class:["vp-code-tab-nav",{active:u}],role:"tab","aria-controls":`codetab-${t.id}-${d}`,"aria-selected":u,onClick:()=>{n.value=d,s()},onKeydown:g=>{l(g,d)}},e[`title${d}`]({value:p,isActive:u}))})),t.data.map(({id:p},d)=>{const u=d===n.value;return Q("div",{class:["vp-code-tab",{active:u}],id:`codetab-${t.id}-${d}`,role:"tabpanel","aria-expanded":u},[Q("div",{class:"vp-code-tab-title"},e[`title${d}`]({value:p,isActive:u})),e[`tab${d}`]({value:p,isActive:u})])})]):null}}),Am="VUEPRESS_TAB_STORE",ao=Jo(Am,{}),xm=dt({name:"Tabs",props:{active:{type:Number,default:0},data:{type:Array,required:!0},id:{type:String,required:!0},tabId:String},slots:Object,setup(t,{slots:e}){const n=zt(t.active),a=kt([]),s=()=>{t.tabId&&(ao.value[t.tabId]=t.data[n.value].id)},o=(p=n.value)=>{n.value=p<a.value.length-1?p+1:0,a.value[n.value].focus()},r=(p=n.value)=>{n.value=p>0?p-1:a.value.length-1,a.value[n.value].focus()},l=(p,d)=>{p.key===" "||p.key==="Enter"?(p.preventDefault(),n.value=d):p.key==="ArrowRight"?(p.preventDefault(),o()):p.key==="ArrowLeft"&&(p.preventDefault(),r()),s()},c=()=>{if(t.tabId){const p=t.data.findIndex(({id:d})=>ao.value[t.tabId]===d);if(p!==-1)return p}return t.active};return re(()=>{n.value=c(),Yt(()=>t.tabId&&ao.value[t.tabId],(p,d)=>{if(t.tabId&&p!==d){const u=t.data.findIndex(({id:g})=>g===p);u!==-1&&(n.value=u)}})}),()=>t.data.length?Q("div",{class:"vp-tabs"},[Q("div",{class:"vp-tabs-nav",role:"tablist"},t.data.map(({id:p},d)=>{const u=d===n.value;return Q("button",{type:"button",ref:g=>{g&&(a.value[d]=g)},class:["vp-tab-nav",{active:u}],role:"tab","aria-controls":`tab-${t.id}-${d}`,"aria-selected":u,onClick:()=>{n.value=d,s()},onKeydown:g=>{l(g,d)}},e[`title${d}`]({value:p,isActive:u}))})),t.data.map(({id:p},d)=>{const u=d===n.value;return Q("div",{class:["vp-tab",{active:u}],id:`tab-${t.id}-${d}`,role:"tabpanel","aria-expanded":u},[Q("div",{class:"vp-tab-title"},e[`title${d}`]({value:p,isActive:u})),e[`tab${d}`]({value:p,isActive:u})])})]):null}}),Pm={enhance:({app:t})=>{t.component("CodeTabs",Tm),t.component("Tabs",xm)}},wm=Object.freeze(Object.defineProperty({__proto__:null,default:Pm},Symbol.toStringTag,{value:"Module"})),Sm=JSON.parse(`{"logo":"/logo.png","navbar":["/",{"text":"文章列表","link":"/article/"},{"text":"文章分类","link":"/category/"},{"text":"文章标签","link":"/tag/"},{"text":"时间线","link":"/timeline/"}],"locales":{"/":{"selectLanguageName":"English"}},"colorMode":"auto","colorModeSwitch":true,"repo":null,"selectLanguageText":"Languages","selectLanguageAriaLabel":"Select language","sidebar":"heading","sidebarDepth":2,"editLink":true,"editLinkText":"Edit this page","lastUpdated":true,"contributors":true,"contributorsText":"Contributors","notFound":["There's nothing here.","How did we get here?","That's a Four-Oh-Four.","Looks like we've got some broken links."],"backToHome":"Take me home","openInNewWindow":"open in new window","toggleColorMode":"toggle color mode","toggleSidebar":"toggle sidebar"}`),Rm=zt(Sm),Wc=()=>Rm,Mc=Symbol(""),Dm=()=>{const t=Qt(Mc);if(!t)throw new Error("useThemeLocaleData() is called without provider.");return t},Cm=(t,e)=>{const{locales:n,...a}=t;return{...a,...n==null?void 0:n[e]}},Lm=We({enhance({app:t}){const e=Wc(),n=t._context.provides[No],a=G(()=>Cm(e.value,n.routeLocale.value));t.provide(Mc,a),Object.defineProperties(t.config.globalProperties,{$theme:{get(){return e.value}},$themeLocale:{get(){return a.value}}})}}),Im=Object.freeze(Object.defineProperty({__proto__:null,default:Lm},Symbol.toStringTag,{value:"Module"})),Ht=()=>{const{pageData:t,pageFrontmatter:e,pageLang:n,siteData:a,siteLocaleData:s,...o}=we();return{...o,page:t,frontmatter:e,lang:n,site:a,siteLocale:s,theme:Wc(),themeLocale:Dm()}},Fc=Symbol(""),Om=t=>{const e=(n=t.value)=>{const a=window.document.documentElement;a.dataset.theme=n?"dark":"light"};re(()=>{Ls(t,e)}),Ts(()=>{e()})},er=()=>{const t=Qt(Fc);if(!t)throw new Error("useDarkMode() is called without provider.");return t},Gm=()=>{const{themeLocale:t}=Ht(),e=$g(),n=Jo("vuepress-color-scheme",t.value.colorMode),a=G({get(){return t.value.colorModeSwitch?n.value==="auto"?e.value:n.value==="dark":t.value.colorMode==="dark"},set(s){s===e.value?n.value="auto":n.value=s?"dark":"light"}});on(Fc,a),Om(a)},Nc=Symbol("headers"),Bm=()=>{const t=fc(Nc);if(!t)throw new Error("useHeaders() is called without provider.");return t},Vm=()=>{const{frontmatter:t,themeLocale:e}=Ht(),n=zt([]),a=G(()=>t.value.sidebarDepth??e.value.sidebarDepth??2),s=()=>{if(a.value<=0){n.value=[];return}n.value=R_({levels:[2,a.value+1],ignore:[".vp-badge"]})};wg(Nc,n),Ia(o=>{o==="beforeUnmount"?n.value=[]:s()})};let so=null,na=null;const Wm={wait:()=>so,pending:()=>{so=new Promise(t=>{na=t})},resolve:()=>{na==null||na(),so=null,na=null}},Kc=()=>Wm,Zn=(t,e)=>{const{notFound:n,meta:a,path:s}=Tn(t,e);return n?{text:s,link:s}:{text:a.title||s,link:s}},Fn=(t="",e="")=>Lc(e)||Da(e)?e:`${Qu(t)}${e}`,Mm=t=>({text:t.title,link:t.link,children:nr(t.children)}),nr=t=>t?t.map(e=>Mm(e)):[],Hc=(t,e)=>[{text:t.title,children:nr(e)}],jc=(t,e,n,a="")=>{const s=(o,r)=>{var c;const l=ye(o)?Zn(Fn(r,o)):ye(o.link)?{...o,link:Ic(o.link)?Zn(Fn(r,o.link)).link:o.link}:o;if("children"in l)return{...l,children:l.children.map(p=>s(p,Fn(r,l.prefix)))};if(l.link===n){const p=((c=e[0])==null?void 0:c.level)===1?e[0].children:e;return{...l,children:nr(p)}}return l};return t.map(o=>s(o,a))},Fm=(t,e,n,a)=>{const s=L_(t).sort((o,r)=>r.length-o.length);for(const o of s)if(Cc(decodeURI(a),o)){const r=t[o];return r?r==="heading"?Hc(e,n):jc(r,n,a,o):[]}return console.warn(`${decodeURI(a)} is missing sidebar config.`),[]},Uc=Symbol("sidebarItems"),ar=()=>{const t=Qt(Uc);if(!t)throw new Error("useSidebarItems() is called without provider.");return t},Nm=(t,e,n,a,s)=>t===!1?[]:t==="heading"?Hc(e,s):Array.isArray(t)?jc(t,s,n,a):Wo(t)?Fm(t,e,s,n):[],Km=()=>{const{frontmatter:t,page:e,routeLocale:n,themeLocale:a}=Ht(),s=Bm(),o=Rs(),r=G(()=>t.value.home?!1:t.value.sidebar??a.value.sidebar??"heading"),l=G(()=>Nm(r.value,e.value,o.value,n.value,s.value));on(Uc,l)},Hm=dt({__name:"Badge",props:{type:{default:"tip"},text:{default:""},vertical:{default:void 0}},setup(t){return(e,n)=>(N(),tt("span",{class:oe(["vp-badge",t.type]),style:qn({verticalAlign:t.vertical})},[Rt(e.$slots,"default",{},()=>[Ge(mt(t.text),1)])],6))}}),jm=dt({__name:"VPFadeSlideYTransition",emits:["beforeEnter","beforeLeave"],setup(t){return(e,n)=>(N(),At(Vo,{name:"vp-fade-slide-y",mode:"out-in",onBeforeEnter:n[0]||(n[0]=a=>e.$emit("beforeEnter")),onBeforeLeave:n[1]||(n[1]=a=>e.$emit("beforeLeave"))},{default:Et(()=>[Rt(e.$slots,"default")]),_:3}))}}),Um={key:0,class:"vp-features"},Zm=dt({__name:"VPHomeFeatures",setup(t){const{frontmatter:e}=Ht(),n=G(()=>e.value.features??[]);return(a,s)=>n.value.length?(N(),tt("div",Um,[(N(!0),tt(bt,null,xe(n.value,o=>(N(),tt("div",{key:o.title,class:"vp-feature"},[nt("h2",null,mt(o.title),1),nt("p",null,mt(o.details),1)]))),128))])):St("",!0)}}),qm=["innerHTML"],$m=["textContent"],zm=dt({__name:"VPHomeFooter",setup(t){const e=xn(),n=G(()=>e.value.footer),a=G(()=>e.value.footerHtml);return(s,o)=>n.value?(N(),tt(bt,{key:0},[a.value?(N(),tt("div",{key:0,class:"vp-footer","vp-footer":"",innerHTML:n.value},null,8,qm)):(N(),tt("div",{key:1,class:"vp-footer","vp-footer":"",textContent:mt(n.value)},null,8,$m))],64)):St("",!0)}}),ze=dt({__name:"VPAutoLink",props:{config:{}},setup(t){return(e,n)=>(N(),At(H(hg),{config:t.config},Ad({before:Et(()=>[Rt(e.$slots,"before",Vs(Xa(t.config)))]),after:Et(()=>[Rt(e.$slots,"after",Vs(Xa(t.config)))]),_:2},[e.$slots.default?{name:"default",fn:Et(()=>[Rt(e.$slots,"default",Vs(Xa(t.config)))]),key:"0"}:void 0]),1032,["config"]))}}),Qm={class:"vp-hero"},Xm={key:0,id:"main-title"},Jm={key:1,class:"vp-hero-description"},Ym={key:2,class:"vp-hero-actions"},th=dt({__name:"VPHomeHero",setup(t){const{frontmatter:e,siteLocale:n}=Ht(),a=er(),s=G(()=>e.value.heroText===null?null:e.value.heroText||n.value.title||"Hello"),o=G(()=>e.value.tagline===null?null:e.value.tagline||n.value.description||"Welcome to your VuePress site"),r=G(()=>a.value&&e.value.heroImageDark!==void 0?e.value.heroImageDark:e.value.heroImage),l=G(()=>e.value.heroAlt||s.value||"hero"),c=G(()=>e.value.heroHeight??280),p=G(()=>Array.isArray(e.value.actions)?e.value.actions.map(({type:u="primary",...g})=>({type:u,...g})):[]),d=()=>{if(!r.value)return null;const u=Q("img",{class:"vp-hero-image",src:Zo(r.value),alt:l.value,height:c.value});return e.value.heroImageDark===void 0?u:Q(jo,()=>u)};return(u,g)=>(N(),tt("header",Qm,[it(d),s.value?(N(),tt("h1",Xm,mt(s.value),1)):St("",!0),o.value?(N(),tt("p",Jm,mt(o.value),1)):St("",!0),p.value.length?(N(),tt("p",Ym,[(N(!0),tt(bt,null,xe(p.value,m=>(N(),At(ze,{key:m.text,class:oe(["vp-hero-action-button",[m.type]]),config:m},null,8,["class","config"]))),128))])):St("",!0)]))}}),eh={class:"vp-home"},nh={"vp-content":""},ah=dt({__name:"VPHome",setup(t){return(e,n)=>(N(),tt("main",eh,[it(th),it(Zm),nt("div",nh,[it(H(Uo))]),it(zm)]))}}),sh=["aria-hidden"],oh=dt({__name:"VPNavbarBrand",setup(t){const{routeLocale:e,siteLocale:n,themeLocale:a}=Ht(),s=er(),o=G(()=>a.value.home||e.value),r=G(()=>n.value.title),l=G(()=>s.value&&a.value.logoDark!==void 0?a.value.logoDark:a.value.logo),c=G(()=>a.value.logoAlt??r.value),p=G(()=>r.value.toLocaleUpperCase().trim()===c.value.toLocaleUpperCase().trim()),d=()=>{if(!l.value)return null;const u=Q("img",{class:"vp-site-logo",src:Zo(l.value),alt:c.value});return a.value.logoDark===void 0?u:Q(jo,()=>u)};return(u,g)=>(N(),At(H(zn),{to:o.value},{default:Et(()=>[it(d),r.value?(N(),tt("span",{key:0,class:oe(["vp-site-name",{"vp-hide-mobile":l.value}]),"aria-hidden":p.value},mt(r.value),11,sh)):St("",!0)]),_:1},8,["to"]))}}),Zc=dt({__name:"VPDropdownTransition",setup(t){const e=a=>{a.style.height=`${a.scrollHeight}px`},n=a=>{a.style.height=""};return(a,s)=>(N(),At(Vo,{name:"vp-dropdown",onEnter:e,onAfterEnter:n,onBeforeLeave:e},{default:Et(()=>[Rt(a.$slots,"default")]),_:3}))}}),rh=["aria-label"],ih={class:"title"},lh=["aria-label"],ch={class:"title"},ph={class:"vp-navbar-dropdown"},dh={class:"vp-navbar-dropdown-subtitle"},uh={key:1},gh={class:"vp-navbar-dropdown-subitem-wrapper"},_h=dt({__name:"VPNavbarDropdown",props:{config:{}},setup(t){const e=t,{config:n}=cl(e),[a,s]=Qo(),o=G(()=>n.value.ariaLabel||n.value.text),r=(c,p)=>p[p.length-1]===c,l=c=>{c.detail===0?s():s(!1)};return Ia(()=>{s(!1)}),(c,p)=>(N(),tt("div",{class:oe(["vp-navbar-dropdown-wrapper",{open:H(a)}])},[nt("button",{class:"vp-navbar-dropdown-title",type:"button","aria-label":o.value,onClick:l},[nt("span",ih,mt(H(n).text),1),p[1]||(p[1]=nt("span",{class:"arrow down"},null,-1))],8,rh),nt("button",{class:"vp-navbar-dropdown-title-mobile",type:"button","aria-label":o.value,onClick:p[0]||(p[0]=()=>H(s)())},[nt("span",ch,mt(H(n).text),1),nt("span",{class:oe(["arrow",H(a)?"down":"right"])},null,2)],8,lh),it(Zc,null,{default:Et(()=>[rs(nt("ul",ph,[(N(!0),tt(bt,null,xe(H(n).children,d=>(N(),tt("li",{key:d.text,class:"vp-navbar-dropdown-item"},["children"in d?(N(),tt(bt,{key:0},[nt("h4",dh,[d.link?(N(),At(ze,{key:0,config:d,onFocusout:()=>{r(d,H(n).children)&&d.children.length===0&&(a.value=!1)}},null,8,["config","onFocusout"])):(N(),tt("span",uh,mt(d.text),1))]),nt("ul",gh,[(N(!0),tt(bt,null,xe(d.children,u=>(N(),tt("li",{key:u.link,class:"vp-navbar-dropdown-subitem"},[it(ze,{config:u,onFocusout:()=>{r(u,d.children)&&r(d,H(n).children)&&H(s)(!1)}},null,8,["config","onFocusout"])]))),128))])],64)):(N(),At(ze,{key:1,config:d,onFocusout:()=>{r(d,H(n).children)&&H(s)(!1)}},null,8,["config","onFocusout"]))]))),128))],512),[[us,H(a)]])]),_:1})],2))}}),qc=(t,e="")=>ye(t)?Zn(Fn(e,t)):"children"in t?{...t,children:t.children.map(n=>qc(n,Fn(e,t.prefix)))}:{...t,link:Ic(t.link)?Zn(Fn(e,t.link)).link:t.link},mh=()=>{const{themeLocale:t}=Ht();return G(()=>(t.value.navbar||[]).map(e=>qc(e)))},$c=t=>!Ca(t)||t.includes("github.com")?"GitHub":t.includes("bitbucket.org")?"Bitbucket":t.includes("gitlab.com")?"GitLab":t.includes("gitee.com")?"Gitee":null,hh=()=>{const{themeLocale:t}=Ht(),e=G(()=>t.value.repo),n=G(()=>e.value?$c(e.value):null),a=G(()=>e.value&&!Ca(e.value)?`https://github.com/${e.value}`:e.value),s=G(()=>a.value?t.value.repoLabel?t.value.repoLabel:n.value===null?"Source":n.value:null);return G(()=>!a.value||!s.value?[]:[{text:s.value,link:a.value}])},fh=()=>{const t=$n(),e=D_(),{routeLocale:n,site:a,siteLocale:s,theme:o,themeLocale:r}=Ht();return G(()=>{const l=Object.keys(a.value.locales);if(l.length<2)return[];const c=t.path,p=t.fullPath;return[{text:`${r.value.selectLanguageText}`,ariaLabel:`${r.value.selectLanguageAriaLabel??r.value.selectLanguageText}`,children:l.map(u=>{var R,A;const g=((R=a.value.locales)==null?void 0:R[u])??{},m=((A=o.value.locales)==null?void 0:A[u])??{},v=`${g.lang}`,b=m.selectLanguageName??v;if(v===s.value.lang)return{text:b,activeMatch:".",link:t.fullPath};const y=c.replace(n.value,u);return{text:b,link:e.value.some(h=>h===y)?p.replace(c,y):m.home??u}})}]})},vh="719px",bh={mobile:vh};var Ea;(function(t){t.Mobile="mobile"})(Ea||(Ea={}));const kh={[Ea.Mobile]:Number.parseInt(bh.mobile.replace("px",""),10)},zc=(t,e)=>{const n=kh[t];Number.isInteger(n)&&(te("orientationchange",()=>{e(n)},!1),te("resize",()=>{e(n)},!1),re(()=>{e(n)}))},Eh=["aria-label"],Qc=dt({__name:"VPNavbarItems",setup(t){const{themeLocale:e}=Ht(),n=mh(),a=fh(),s=hh(),o=zt(!1),r=G(()=>e.value.navbarLabel??"site navigation"),l=G(()=>[...n.value,...a.value,...s.value]);return zc(Ea.Mobile,c=>{o.value=window.innerWidth<c}),(c,p)=>l.value.length?(N(),tt("nav",{key:0,class:"vp-navbar-items","aria-label":r.value},[(N(!0),tt(bt,null,xe(l.value,d=>(N(),tt("div",{key:d.text,class:"vp-navbar-item"},["children"in d?(N(),At(_h,{key:0,class:oe({mobile:o.value}),config:d},null,8,["class","config"])):(N(),At(ze,{key:1,config:d},null,8,["config"]))]))),128))],8,Eh)):St("",!0)}}),Is=(t,e)=>{const n=t.__vccOpts||t;for(const[a,s]of e)n[a]=s;return n},yh={},Th={class:"dark-icon",viewBox:"0 0 32 32"};function Ah(t,e){return N(),tt("svg",Th,[...e[0]||(e[0]=[nt("path",{d:"M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3z",fill:"currentColor"},null,-1)])])}const xh=Is(yh,[["render",Ah]]),Ph={},wh={class:"light-icon",viewBox:"0 0 32 32"};function Sh(t,e){return N(),tt("svg",wh,[...e[0]||(e[0]=[Qd('<path d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z" fill="currentColor"></path><path d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z" fill="currentColor"></path><path d="M2 15.005h5v2H2z" fill="currentColor"></path><path d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z" fill="currentColor"></path><path d="M15 25.005h2v5h-2z" fill="currentColor"></path><path d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z" fill="currentColor"></path><path d="M25 15.005h5v2h-5z" fill="currentColor"></path><path d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z" fill="currentColor"></path><path d="M15 2.005h2v5h-2z" fill="currentColor"></path>',9)])])}const Rh=Is(Ph,[["render",Sh]]),Dh=["title"],Ch=dt({__name:"VPToggleColorModeButton",setup(t){const{themeLocale:e}=Ht(),n=er(),a=()=>{n.value=!n.value};return(s,o)=>(N(),tt("button",{type:"button",class:"vp-toggle-color-mode-button",title:H(e).toggleColorMode,onClick:a},[rs(it(Rh,null,null,512),[[us,!H(n)]]),rs(it(xh,null,null,512),[[us,H(n)]])],8,Dh))}}),Lh=["title"],Ih=dt({__name:"VPToggleSidebarButton",emits:["toggle"],setup(t){const{themeLocale:e}=Ht();return(n,a)=>(N(),tt("div",{class:"vp-toggle-sidebar-button",title:H(e).toggleSidebar,"aria-expanded":"false",role:"button",tabindex:"0",onClick:a[0]||(a[0]=s=>n.$emit("toggle"))},[...a[1]||(a[1]=[nt("div",{class:"icon","aria-hidden":"true"},[nt("span"),nt("span"),nt("span")],-1)])],8,Lh))}}),Oh={ref:"navbar-brand"},Gh=dt({__name:"VPNavbar",emits:["toggleSidebar"],setup(t){const e=Dc("SearchBox")?xl("SearchBox"):()=>null,{themeLocale:n}=Ht(),a=gr("navbar"),s=gr("navbar-brand"),o=zt(0),r=G(()=>o.value?{maxWidth:`${o.value}px`}:{}),l=(c,p)=>{var g;const d=(g=c==null?void 0:c.ownerDocument.defaultView)==null?void 0:g.getComputedStyle(c,null)[p],u=Number.parseInt(d,10);return Number.isNaN(u)?0:u};return zc(Ea.Mobile,c=>{var d;const p=l(a.value,"paddingLeft")+l(a.value,"paddingRight");window.innerWidth<c?o.value=0:o.value=a.value.offsetWidth-p-(((d=s.value)==null?void 0:d.offsetWidth)??0)}),(c,p)=>(N(),tt("header",{ref_key:"navbar",ref:a,class:"vp-navbar","vp-navbar":""},[it(Ih,{onToggle:p[0]||(p[0]=d=>c.$emit("toggleSidebar"))}),nt("span",Oh,[it(oh)],512),nt("div",{class:"vp-navbar-items-wrapper",style:qn(r.value)},[Rt(c.$slots,"before"),it(Qc,{class:"vp-hide-mobile"}),Rt(c.$slots,"after"),H(n).colorModeSwitch?(N(),At(Ch,{key:0})):St("",!0),it(H(e))],4)],512))}}),Bh={},Vh={class:"edit-icon",viewBox:"0 0 1024 1024"};function Wh(t,e){return N(),tt("svg",Vh,[...e[0]||(e[0]=[nt("g",{fill:"currentColor"},[nt("path",{d:"M430.818 653.65a60.46 60.46 0 0 1-50.96-93.281l71.69-114.012 7.773-10.365L816.038 80.138A60.46 60.46 0 0 1 859.225 62a60.46 60.46 0 0 1 43.186 18.138l43.186 43.186a60.46 60.46 0 0 1 0 86.373L588.879 565.55l-8.637 8.637-117.466 68.234a60.46 60.46 0 0 1-31.958 11.229z"}),nt("path",{d:"M728.802 962H252.891A190.883 190.883 0 0 1 62.008 771.98V296.934a190.883 190.883 0 0 1 190.883-192.61h267.754a60.46 60.46 0 0 1 0 120.92H252.891a69.962 69.962 0 0 0-69.098 69.099V771.98a69.962 69.962 0 0 0 69.098 69.098h475.911A69.962 69.962 0 0 0 797.9 771.98V503.363a60.46 60.46 0 1 1 120.922 0V771.98A190.883 190.883 0 0 1 728.802 962z"})],-1)])])}const Mh=Is(Bh,[["render",Wh]]),Fh={GitHub:":repo/edit/:branch/:path",GitLab:":repo/-/edit/:branch/:path",Gitee:":repo/edit/:branch/:path",Bitbucket:":repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default"},Nh=({docsRepo:t,editLinkPattern:e})=>{if(e)return e;const n=$c(t);return n!==null?Fh[n]:null},Kh=({docsRepo:t,docsBranch:e,docsDir:n,filePathRelative:a,editLinkPattern:s})=>{if(!a)return null;const o=Nh({docsRepo:t,editLinkPattern:s});return o?o.replace(/:repo/,Ca(t)?t:`https://github.com/${t}`).replace(/:branch/,e).replace(/:path/,nc(`${ec(n)}/${a}`)):null},Hh=()=>{const{frontmatter:t,page:e,themeLocale:n}=Ht();return G(()=>{if(!(t.value.editLink??n.value.editLink??!0))return null;const{repo:s,docsRepo:o=s,docsBranch:r="main",docsDir:l="",editLinkText:c}=n.value;if(!o)return null;const p=Kh({docsRepo:o,docsBranch:r,docsDir:l,filePathRelative:e.value.filePathRelative,editLinkPattern:t.value.editLinkPattern??n.value.editLinkPattern});return p?{text:c??"Edit this page",link:p}:null})},jh={class:"vp-page-meta"},Uh={key:0,class:"vp-meta-item edit-link"},Zh={class:"vp-meta-item git-info"},qh={key:0,class:"vp-meta-item last-updated"},$h={class:"meta-item-label"},zh=["datetime"],Qh={key:1,class:"vp-meta-item contributors"},Xh={class:"meta-item-label"},Jh={class:"meta-item-info"},Yh=["title"],tf=dt({__name:"VPPageMeta",setup(t){const{frontmatter:e,themeLocale:n}=Ht(),a=Oc(()=>e.value.contributors??n.value.contributors??!0),s=Hh(),o=Gc(()=>e.value.lastUpdated??n.value.lastUpdated??!0);return(r,l)=>(N(),tt("footer",jh,[H(s)?(N(),tt("div",Uh,[it(ze,{class:"label",config:H(s)},{before:Et(()=>[it(Mh)]),_:1},8,["config"])])):St("",!0),nt("div",Zh,[H(o)?(N(),tt("div",qh,[nt("span",$h,mt(H(n).lastUpdatedText??H(o).locale)+": ",1),nt("time",{class:"meta-item-info",datetime:H(o).iso,"data-allow-mismatch":""},mt(H(o).text),9,zh)])):St("",!0),H(a).length?(N(),tt("div",Qh,[nt("span",Xh,mt(H(n).contributorsText)+": ",1),nt("span",Jh,[(N(!0),tt(bt,null,xe(H(a),(c,p)=>(N(),tt(bt,{key:p},[nt("span",{class:"contributor",title:`email: ${c.email}`},mt(c.name),9,Yh),p!==H(a).length-1?(N(),tt(bt,{key:0},[Ge(", ")],64)):St("",!0)],64))),128))])])):St("",!0)])]))}}),ef=()=>{const t=La(),e=$n();return n=>{n&&(Lc(n)?e.fullPath!==n&&t.push(n):Da(n)?window.open(n):t.push(encodeURI(n)))}},Pi=(t,e)=>t===!1?!1:ye(t)?Zn(t,e):Wo(t)?{...t,link:Zn(t.link,e).link}:null,To=(t,e,n)=>{const a=t.findIndex(o=>o.link===e);if(a!==-1){const o=t[a+n];return o?o.link?o:"prefix"in o&&!Tn(o.prefix).notFound?{...o,link:o.prefix}:null:null}for(const o of t)if("children"in o){const r=To(o.children,e,n);if(r)return r}const s=t.findIndex(o=>"prefix"in o&&o.prefix===e);if(s!==-1){const o=t[s+n];return o?o.link?o:"prefix"in o&&!Tn(o.prefix).notFound?{...o,link:o.prefix}:null:null}return null},nf=()=>{const{frontmatter:t,themeLocale:e}=Ht(),n=ar(),a=Rs(),s=G(()=>{const r=Pi(t.value.prev,a.value);return r===!1?null:r??(e.value.prev===!1?null:To(n.value,a.value,-1))}),o=G(()=>{const r=Pi(t.value.next,a.value);return r===!1?null:r??(e.value.next===!1?null:To(n.value,a.value,1))});return{prevLink:s,nextLink:o}},af=["aria-label"],sf={class:"hint"},of={class:"link"},rf={class:"external-link"},lf={class:"hint"},cf={class:"link"},pf={class:"external-link"},df=dt({__name:"VPPageNav",setup(t){const{themeLocale:e}=Ht(),n=ef(),{prevLink:a,nextLink:s}=nf(),o=G(()=>e.value.pageNavbarLabel??"page navigation");return te("keydown",r=>{r.altKey&&(r.key==="ArrowRight"?s.value&&(n(s.value.link),r.preventDefault()):r.key==="ArrowLeft"&&a.value&&(n(a.value.link),r.preventDefault()))}),(r,l)=>H(a)||H(s)?(N(),tt("nav",{key:0,class:"vp-page-nav","aria-label":o.value},[H(a)?(N(),At(ze,{key:0,class:"prev",config:H(a)},{default:Et(()=>[nt("div",sf,[l[0]||(l[0]=nt("span",{class:"arrow left"},null,-1)),Ge(" "+mt(H(e).prev??"Prev"),1)]),nt("div",of,[nt("span",rf,mt(H(a).text),1)])]),_:1},8,["config"])):St("",!0),H(s)?(N(),At(ze,{key:1,class:"next",config:H(s)},{default:Et(()=>[nt("div",lf,[Ge(mt(H(e).next??"Next")+" ",1),l[1]||(l[1]=nt("span",{class:"arrow right"},null,-1))]),nt("div",cf,[nt("span",pf,mt(H(s).text),1)])]),_:1},8,["config"])):St("",!0)],8,af)):St("",!0)}}),uf={class:"vp-page"},gf={"vp-content":""},_f=dt({__name:"VPPage",setup(t){return(e,n)=>(N(),tt("main",uf,[Rt(e.$slots,"top"),nt("div",gf,[Rt(e.$slots,"content-top"),it(H(Uo)),Rt(e.$slots,"content-bottom")]),it(tf),it(df),Rt(e.$slots,"bottom")]))}}),wi=t=>decodeURI(t).replace(/#.*$/,"").replace(/(index)?\.(md|html)$/,""),mf=(t,e)=>{if(e.hash===t)return!0;const n=wi(e.path),a=wi(t);return n===a},Xc=(t,e)=>t.link&&mf(t.link,e)?!0:"children"in t?t.children.some(n=>Xc(n,e)):!1,hf={class:"vp-sidebar-children"},ff=dt({__name:"VPSidebarItem",props:{item:{},depth:{default:0}},setup(t){const e=t,{item:n,depth:a}=cl(e),s=$n(),o=La(),r=G(()=>n.value.collapsible),l=G(()=>Xc(n.value,s)),c=G(()=>({"vp-sidebar-item":!0,"vp-sidebar-heading":a.value===0,active:l.value,collapsible:r.value})),p=G(()=>r.value?l.value:!0),[d,u]=Qo(p.value),g=v=>{r.value&&(v.preventDefault(),u())},m=o.afterEach(()=>{wa(()=>{d.value=p.value})});return Io(()=>{m()}),(v,b)=>{const y=xl("VPSidebarItem",!0);return N(),tt("li",null,[H(n).link?(N(),At(ze,{key:0,class:oe(c.value),config:H(n)},{after:Et(()=>[r.value?(N(),tt("span",{key:0,class:oe(["arrow",H(d)?"down":"right"])},null,2)):St("",!0)]),_:1},8,["class","config"])):(N(),tt("p",{key:1,tabindex:"0",class:oe(c.value),onClick:g,onKeydown:Ou(g,["enter"])},[Ge(mt(H(n).text)+" ",1),r.value?(N(),tt("span",{key:0,class:oe(["arrow",H(d)?"down":"right"])},null,2)):St("",!0)],34)),"children"in H(n)&&H(n).children.length?(N(),At(Zc,{key:2},{default:Et(()=>[rs(nt("ul",hf,[(N(!0),tt(bt,null,xe(H(n).children,R=>(N(),At(y,{key:`${H(a)}${R.text}${R.link}`,item:R,depth:H(a)+1},null,8,["item","depth"]))),128))],512),[[us,H(d)]])]),_:1})):St("",!0)])}}}),vf={key:0,class:"vp-sidebar-items"},bf=dt({__name:"VPSidebarItems",setup(t){const e=$n(),n=ar();return re(()=>{Yt(()=>e.hash,a=>{const s=document.querySelector(".vp-sidebar");if(!s)return;const o=document.querySelector(`.vp-sidebar .vp-sidebar-item.auto-link[href="${e.path}${a}"]`);if(!o)return;const{top:r,height:l}=s.getBoundingClientRect(),{top:c,height:p}=o.getBoundingClientRect();c<r?o.scrollIntoView(!0):c+p>r+l&&o.scrollIntoView(!1)})}),(a,s)=>H(n).length?(N(),tt("ul",vf,[(N(!0),tt(bt,null,xe(H(n),o=>(N(),At(ff,{key:`${o.text}${o.link}`,item:o},null,8,["item"]))),128))])):St("",!0)}}),kf={class:"vp-sidebar","vp-sidebar":""},Ef=dt({__name:"VPSidebar",setup(t){return(e,n)=>(N(),tt("aside",kf,[it(Qc),Rt(e.$slots,"top"),it(bf),Rt(e.$slots,"bottom")]))}}),Ba=dt({__name:"Layout",setup(t){const{frontmatter:e,page:n,themeLocale:a}=Ht(),s=G(()=>e.value.navbar??a.value.navbar??!0),o=ar(),r=zt(!1),l=y=>{r.value=typeof y=="boolean"?y:!r.value},c={x:0,y:0},p=y=>{c.x=y.changedTouches[0].clientX,c.y=y.changedTouches[0].clientY},d=y=>{const R=y.changedTouches[0].clientX-c.x,A=y.changedTouches[0].clientY-c.y;Math.abs(R)>Math.abs(A)&&Math.abs(R)>40&&(R>0&&c.x<=80?l(!0):l(!1))},u=G(()=>e.value.externalLinkIcon??a.value.externalLinkIcon??!0),g=G(()=>[{"no-navbar":!s.value,"no-sidebar":!o.value.length,"sidebar-open":r.value,"external-link-icon":u.value},e.value.pageClass]);Ia(()=>{l(!1)});const m=Kc(),v=m.resolve,b=m.pending;return(y,R)=>(N(),tt("div",{class:oe(["vp-theme-container",g.value]),"vp-container":"",onTouchstart:p,onTouchend:d},[Rt(y.$slots,"navbar",{},()=>[s.value?(N(),At(Gh,{key:0,onToggleSidebar:l},{before:Et(()=>[Rt(y.$slots,"navbar-before")]),after:Et(()=>[Rt(y.$slots,"navbar-after")]),_:3})):St("",!0)]),nt("div",{class:"vp-sidebar-mask",onClick:R[0]||(R[0]=A=>l(!1))}),Rt(y.$slots,"sidebar",{},()=>[it(Ef,null,{top:Et(()=>[Rt(y.$slots,"sidebar-top")]),bottom:Et(()=>[Rt(y.$slots,"sidebar-bottom")]),_:3})]),Rt(y.$slots,"page",{},()=>[it(jm,{onBeforeEnter:H(v),onBeforeLeave:H(b)},{default:Et(()=>[H(e).home?(N(),At(ah,{key:0})):(N(),At(_f,{key:H(n).path},{top:Et(()=>[Rt(y.$slots,"page-top")]),"content-top":Et(()=>[Rt(y.$slots,"page-content-top")]),"content-bottom":Et(()=>[Rt(y.$slots,"page-content-bottom")]),bottom:Et(()=>[Rt(y.$slots,"page-bottom")]),_:3}))]),_:3},8,["onBeforeEnter","onBeforeLeave"])])],34))}}),yf={class:"vp-theme-container","vp-container":""},Tf={class:"page"},Af={"vp-content":""},xf=dt({__name:"NotFound",setup(t){const{routeLocale:e,themeLocale:n}=Ht(),a=G(()=>n.value.notFound??["Not Found"]),s=()=>a.value[Math.floor(Math.random()*a.value.length)],o=G(()=>n.value.home??e.value),r=G(()=>n.value.backToHome??"Back to home");return(l,c)=>(N(),tt("div",yf,[nt("main",Tf,[nt("div",Af,[c[0]||(c[0]=nt("h1",null,"404",-1)),nt("blockquote",null,mt(s()),1),it(H(zn),{to:o.value},{default:Et(()=>[Ge(mt(r.value),1)]),_:1},8,["to"])])])]))}}),Pf=Is(xf,[["__scopeId","data-v-ec9917b8"]]),wf=We({enhance({app:t,router:e}){Dc("Badge")||t.component("Badge",Hm);const n=e.options.scrollBehavior;e.options.scrollBehavior=async(...a)=>(await Kc().wait(),n(...a))},setup(){Gm(),Vm(),Km()},layouts:{Layout:Ba,NotFound:Pf}}),Sf=Object.freeze(Object.defineProperty({__proto__:null,default:wf},Symbol.toStringTag,{value:"Module"})),Si=t=>typeof t=="number"?`${t}px`:t,Jc=({size:t=48,stroke:e=4,wrapper:n=!0,height:a=2*t})=>{const s=Q("span",{style:`--loading-icon: url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMidYMid' viewBox='25 25 50 50'%3E%3CanimateTransform attributeName='transform' type='rotate' dur='2s' keyTimes='0;1' repeatCount='indefinite' values='0;360'%3E%3C/animateTransform%3E%3Ccircle cx='50' cy='50' r='20' fill='none' stroke='currentColor' stroke-width='${e}' stroke-linecap='round'%3E%3Canimate attributeName='stroke-dasharray' dur='1.5s' keyTimes='0;0.5;1' repeatCount='indefinite' values='1,200;90,200;1,200'%3E%3C/animate%3E%3Canimate attributeName='stroke-dashoffset' dur='1.5s' keyTimes='0;0.5;1' repeatCount='indefinite' values='0;-35px;-125px'%3E%3C/animate%3E%3C/circle%3E%3C/svg%3E");--icon-size: ${Si(t)};display: inline-block;width: var(--icon-size);height: var(--icon-size);background-color: currentcolor;-webkit-mask-image: var(--loading-icon);mask-image: var(--loading-icon)`});return n?Q("div",{style:`display: flex;align-items: center;justify-content: center;height: ${Si(a)}`},s):s};Jc.displayName="LoadingIcon";const Ri=t=>{const e=atob(t);return x_(E_(A_(e)))},Di=()=>document.documentElement.getAttribute("data-theme")==="dark";let Rf=null;const Df=()=>{const t=zt(!1);return re(()=>{t.value=Di(),Ec(document.documentElement,()=>{t.value=Di()},{attributeFilter:["data-theme"],attributes:!0})}),Nn(t)},Cf=()=>Rf??(Rf=Df());let Lf={};const If=()=>Lf,Of=t=>`data:image/svg+xml;charset=utf8,${t.replace(/<br>/g,"<br />").replace(/%/g,"%25").replace(/"/g,"%22").replace(/'/g,"%27").replace(/&/g,"%26").replace(/#/g,"%23").replace(/{/g,"%7B").replace(/}/g,"%7D").replace(/</g,"%3C").replace(/>/g,"%3E")}`,Gf='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1316 1024" fill="currentColor"><path d="M658.286 0C415.89 0 0 297.106 0 512c0 214.82 415.89 512 658.286 512 242.322 0 658.285-294.839 658.285-512S900.608 0 658.286 0zm0 877.714c-161.573 0-512-221.769-512-365.714 0-144.018 350.427-365.714 512-365.714 161.572 0 512 217.16 512 365.714s-350.428 365.714-512 365.714z"/><path d="M658.286 292.571a219.429 219.429 0 1 0 0 438.858 219.429 219.429 0 0 0 0-438.858zm0 292.572a73.143 73.143 0 1 1 0-146.286 73.143 73.143 0 0 1 0 146.286z"/></svg>',Bf='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor"><path d="M828.976 894.125H190.189c-70.55 0-127.754-57.185-127.754-127.753V606.674c0-17.634 14.31-31.933 31.933-31.933h63.889c17.634 0 31.932 14.299 31.932 31.933v95.822c0 35.282 28.596 63.877 63.877 63.877h511.033c35.281 0 63.877-28.595 63.877-63.877v-95.822c0-17.634 14.298-31.933 31.943-31.933h63.878c17.635 0 31.933 14.299 31.933 31.933v159.7c0 70.566-57.191 127.751-127.754 127.751zM249.939 267.51c12.921-12.92 33.885-12.92 46.807 0l148.97 148.972V94.893c0-17.634 14.302-31.947 31.934-31.947h63.876c17.638 0 31.946 14.313 31.946 31.947v321.589l148.97-148.972c12.922-12.92 33.876-12.92 46.797 0l46.814 46.818c12.922 12.922 12.922 33.874 0 46.807L552.261 624.93c-1.14 1.138-21.664 13.684-42.315 13.693-20.877.01-41.88-12.542-43.021-13.693L203.122 361.135c-12.923-12.934-12.923-33.885 0-46.807l46.817-46.818z"/></svg>',Rn={useMaxWidth:!1};var Vf=dt({name:"Mermaid",props:{code:{type:String,required:!0},title:String},setup(t){const e=sd(),n=Cf(),{themeVariables:a,...s}=If(),o=kt(),r=G(()=>Ri(t.code)),l=zt(""),c=async()=>{const{default:u}=await i(async()=>{const{default:g}=await import("./mermaid.esm.min-DdUGx6An.js").then(m=>m.b0);return{default:g}},[]);u.initialize({theme:n.value?"dark":"default",themeVariables:{dark:n.value,...Xu(a)?a(n.value):a},flowchart:Rn,sequence:Rn,journey:Rn,gantt:Rn,er:Rn,pie:Rn,...s,startOnLoad:!1}),l.value=(await u.render(e,r.value)).svg},p=()=>{const{body:u}=document,g=document.createElement("div");g.classList.add("mermaid-preview"),g.innerHTML=l.value,u.appendChild(g),g.addEventListener("click",()=>{u.removeChild(g)})},d=()=>{const u=Of(l.value),g=document.createElement("a");g.setAttribute("href",u),g.setAttribute("download",`${t.title?Ri(t.title):e}.svg`),g.click()};return re(()=>{Ls(n,c,{flush:"post"})}),()=>[Q("div",{class:"mermaid-actions"},[Q("button",{class:"preview-button",title:"preview",innerHTML:Gf,onClick:p}),Q("button",{class:"download-button",title:"download",innerHTML:Bf,onClick:d})]),Q("div",{ref:o,class:"mermaid-wrapper"},l.value?Q("div",{class:"mermaid-content",innerHTML:l.value}):Q(Jc,{class:"mermaid-loading",height:96}))]}});const Wf=We({enhance:({app:t})=>{t.component("Mermaid",Vf)}}),Mf=Object.freeze(Object.defineProperty({__proto__:null,default:Wf},Symbol.toStringTag,{value:"Module"})),Ff=JSON.parse('{"category":{"/":{"path":"/category/","map":{"健康养生":{"path":"/category/%E5%81%A5%E5%BA%B7%E5%85%BB%E7%94%9F/","indexes":[0,1]},"Python编程":{"path":"/category/python%E7%BC%96%E7%A8%8B/","indexes":[2,3,4,5,6]},"随笔日志":{"path":"/category/%E9%9A%8F%E7%AC%94%E6%97%A5%E5%BF%97/","indexes":[7]},"产品设计":{"path":"/category/%E4%BA%A7%E5%93%81%E8%AE%BE%E8%AE%A1/","indexes":[8]},"Go编程":{"path":"/category/go%E7%BC%96%E7%A8%8B/","indexes":[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76]},"C++编程":{"path":"/category/c__%E7%BC%96%E7%A8%8B/","indexes":[77,78,79,80,81,82,83,84,85,86]},"运维技术":{"path":"/category/%E8%BF%90%E7%BB%B4%E6%8A%80%E6%9C%AF/","indexes":[87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122]},"Flutter编程":{"path":"/category/flutter%E7%BC%96%E7%A8%8B/","indexes":[123,124,125,126,127,128,129,130,131,132,133,134]},"编程技术":{"path":"/category/%E7%BC%96%E7%A8%8B%E6%8A%80%E6%9C%AF/","indexes":[135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202]},"设计模式":{"path":"/category/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/","indexes":[203]},"汽车":{"path":"/category/%E6%B1%BD%E8%BD%A6/","indexes":[204]},"架构设计":{"path":"/category/%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1/","indexes":[205,206,207,208]},"游戏开发":{"path":"/category/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/","indexes":[209,210,211,212,213,214,215,216,217,218,219,220,221,222]},"量化开发":{"path":"/category/%E9%87%8F%E5%8C%96%E5%BC%80%E5%8F%91/","indexes":[223,224,225,226,227,228]},"物联网开发":{"path":"/category/%E7%89%A9%E8%81%94%E7%BD%91%E5%BC%80%E5%8F%91/","indexes":[229,230,231,232,233,234,235]},"GoWind风行":{"path":"/category/gowind%E9%A3%8E%E8%A1%8C/","indexes":[236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325]},"生活杂记":{"path":"/category/%E7%94%9F%E6%B4%BB%E6%9D%82%E8%AE%B0/","indexes":[326]},"Rust编程":{"path":"/category/rust%E7%BC%96%E7%A8%8B/","indexes":[327,328]}}}},"tag":{"/":{"path":"/tag/","map":{"健康养生":{"path":"/tag/%E5%81%A5%E5%BA%B7%E5%85%BB%E7%94%9F/","indexes":[1]},"fastapi":{"path":"/tag/fastapi/","indexes":[6]},"随笔日志":{"path":"/tag/%E9%9A%8F%E7%AC%94%E6%97%A5%E5%BF%97/","indexes":[7]},"产品设计":{"path":"/tag/%E4%BA%A7%E5%93%81%E8%AE%BE%E8%AE%A1/","indexes":[8]},"Golang":{"path":"/tag/golang/","indexes":[236,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,239,243,57,58,59,60,61,62,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,63,64,65,66,67,68,69,70,292,293,294,295,297,299,300,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,318,320,322,325,76]},"架构":{"path":"/tag/%E6%9E%B6%E6%9E%84/","indexes":[76]},"ASIO":{"path":"/tag/asio/","indexes":[85,86]},"cron":{"path":"/tag/cron/","indexes":[122]},"rclone":{"path":"/tag/rclone/","indexes":[122]},"flutter":{"path":"/tag/flutter/","indexes":[134]},"RxDart":{"path":"/tag/rxdart/","indexes":[134]},"Make":{"path":"/tag/make/","indexes":[55,202]},"CMake":{"path":"/tag/cmake/","indexes":[146,202]},"Ninja":{"path":"/tag/ninja/","indexes":[202]},"设计模式":{"path":"/tag/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/","indexes":[62,325,203]},"Cache Aside Pattern":{"path":"/tag/cache-aside-pattern/","indexes":[203]},"缓存设计模式":{"path":"/tag/%E7%BC%93%E5%AD%98%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/","indexes":[203]},"汽车":{"path":"/tag/%E6%B1%BD%E8%BD%A6/","indexes":[204]},"go":{"path":"/tag/go/","indexes":[74,75]},"CDC":{"path":"/tag/cdc/","indexes":[75]},"PostgreSQL":{"path":"/tag/postgresql/","indexes":[165,94,166,102,106,75]},"Centos":{"path":"/tag/centos/","indexes":[74]},"docker":{"path":"/tag/docker/","indexes":[121]},"杀毒":{"path":"/tag/%E6%9D%80%E6%AF%92/","indexes":[120]},"CLion":{"path":"/tag/clion/","indexes":[201]},"云手机":{"path":"/tag/%E4%BA%91%E6%89%8B%E6%9C%BA/","indexes":[208]},"GoogleTest":{"path":"/tag/googletest/","indexes":[200]},"Cococs2dx":{"path":"/tag/cococs2dx/","indexes":[222]},"Cocos Creator":{"path":"/tag/cocos-creator/","indexes":[221]},"代码注释":{"path":"/tag/%E4%BB%A3%E7%A0%81%E6%B3%A8%E9%87%8A/","indexes":[199]},"IDE":{"path":"/tag/ide/","indexes":[184,83,199]},"Python":{"path":"/tag/python/","indexes":[2,3,84,5]},"TRC20":{"path":"/tag/trc20/","indexes":[5]},"C++":{"path":"/tag/c__/","indexes":[77,78,79,80,81,82,83,84]},"类型转换":{"path":"/tag/%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2/","indexes":[82]},"CQRS":{"path":"/tag/cqrs/","indexes":[207]},"Kafka Streams":{"path":"/tag/kafka-streams/","indexes":[207]},"Bazel":{"path":"/tag/bazel/","indexes":[57,73]},"Docker":{"path":"/tag/docker/","indexes":[90,93,94,96,97,99,101,102,103,104,105,106,107,108,109,110,111,112,113,115,73]},"Go":{"path":"/tag/go/","indexes":[101,206,196,71,72,198,73]},"crontab":{"path":"/tag/crontab/","indexes":[119]},"客户留存率":{"path":"/tag/%E5%AE%A2%E6%88%B7%E7%95%99%E5%AD%98%E7%8E%87/","indexes":[118]},"EFK":{"path":"/tag/efk/","indexes":[117]},"RustDesk":{"path":"/tag/rustdesk/","indexes":[116]},"Jitsi Meet":{"path":"/tag/jitsi-meet/","indexes":[114]},"Traefik":{"path":"/tag/traefik/","indexes":[113]},"Swagger":{"path":"/tag/swagger/","indexes":[112]},"Docker Hub":{"path":"/tag/docker-hub/","indexes":[111]},"VIM":{"path":"/tag/vim/","indexes":[109]},"Word":{"path":"/tag/word/","indexes":[198]},"VBA":{"path":"/tag/vba/","indexes":[198]},"Doris":{"path":"/tag/doris/","indexes":[296,228]},"量化交易":{"path":"/tag/%E9%87%8F%E5%8C%96%E4%BA%A4%E6%98%93/","indexes":[225,228]},"Flutter":{"path":"/tag/flutter/","indexes":[89,135,123,124,300,301,303,323,125,126,127,128,129,130,131,132,133]},"Widget":{"path":"/tag/widget/","indexes":[133]},"Ent":{"path":"/tag/ent/","indexes":[242,302,71,72]},"SQL":{"path":"/tag/sql/","indexes":[71,72]},"Excel":{"path":"/tag/excel/","indexes":[196,197]},"配色":{"path":"/tag/%E9%85%8D%E8%89%B2/","indexes":[197]},"TypeScript":{"path":"/tag/typescript/","indexes":[147,148,196]},"C#":{"path":"/tag/c_/","indexes":[196]},"Sealed Class":{"path":"/tag/sealed-class/","indexes":[125,132]},"微信小程序":{"path":"/tag/%E5%BE%AE%E4%BF%A1%E5%B0%8F%E7%A8%8B%E5%BA%8F/","indexes":[195]},"人脸识别":{"path":"/tag/%E4%BA%BA%E8%84%B8%E8%AF%86%E5%88%AB/","indexes":[61,4]},"RK3588S":{"path":"/tag/rk3588s/","indexes":[235]},"Android Studio":{"path":"/tag/android-studio/","indexes":[131]},"iOS":{"path":"/tag/ios/","indexes":[130]},"GetX":{"path":"/tag/getx/","indexes":[129]},"鸿蒙":{"path":"/tag/%E9%B8%BF%E8%92%99/","indexes":[127]},"字体渲染":{"path":"/tag/%E5%AD%97%E4%BD%93%E6%B8%B2%E6%9F%93/","indexes":[220]},"期货":{"path":"/tag/%E6%9C%9F%E8%B4%A7/","indexes":[227]},"Futures":{"path":"/tag/futures/","indexes":[227]},"地理围栏":{"path":"/tag/%E5%9C%B0%E7%90%86%E5%9B%B4%E6%A0%8F/","indexes":[234]},"GEO":{"path":"/tag/geo/","indexes":[233]},"Git":{"path":"/tag/git/","indexes":[193,194]},"GoWind":{"path":"/tag/gowind/","indexes":[236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325]},"通知系统":{"path":"/tag/%E9%80%9A%E7%9F%A5%E7%B3%BB%E7%BB%9F/","indexes":[325]},"Vue3":{"path":"/tag/vue3/","indexes":[237,238,240,241,298,324]},"React":{"path":"/tag/react/","indexes":[237,238,240,298,317,321,324]},"Protobuf":{"path":"/tag/protobuf/","indexes":[328,162,163,237,238,242,324]},"AI":{"path":"/tag/ai/","indexes":[290,320,324]},"Dart":{"path":"/tag/dart/","indexes":[323]},"CMS":{"path":"/tag/cms/","indexes":[316,317,318,319,321,323]},"Go-Kratos":{"path":"/tag/go-kratos/","indexes":[236,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,239,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,65,66,292,302,303,309,310,322]},"React.js":{"path":"/tag/react.js/","indexes":[321]},"LLM":{"path":"/tag/llm/","indexes":[320]},"数据安全":{"path":"/tag/%E6%95%B0%E6%8D%AE%E5%AE%89%E5%85%A8/","indexes":[320]},"Vue":{"path":"/tag/vue/","indexes":[143,304,305,307,308,319]},"Nuxt":{"path":"/tag/nuxt/","indexes":[319]},"分布式任务":{"path":"/tag/%E5%88%86%E5%B8%83%E5%BC%8F%E4%BB%BB%E5%8A%A1/","indexes":[318]},"Taro":{"path":"/tag/taro/","indexes":[317]},"CRDT":{"path":"/tag/crdt/","indexes":[316]},"协同编辑":{"path":"/tag/%E5%8D%8F%E5%90%8C%E7%BC%96%E8%BE%91/","indexes":[316]},"ERP":{"path":"/tag/erp/","indexes":[315]},"数据一致性":{"path":"/tag/%E6%95%B0%E6%8D%AE%E4%B8%80%E8%87%B4%E6%80%A7/","indexes":[312,315]},"IAM":{"path":"/tag/iam/","indexes":[314]},"JWT":{"path":"/tag/jwt/","indexes":[314]},"Casbin":{"path":"/tag/casbin/","indexes":[314]},"OPA":{"path":"/tag/opa/","indexes":[314]},"实时协作":{"path":"/tag/%E5%AE%9E%E6%97%B6%E5%8D%8F%E4%BD%9C/","indexes":[313]},"算法":{"path":"/tag/%E7%AE%97%E6%B3%95/","indexes":[140,153,68,69,70,313]},"记账":{"path":"/tag/%E8%AE%B0%E8%B4%A6/","indexes":[312]},"工作流":{"path":"/tag/%E5%B7%A5%E4%BD%9C%E6%B5%81/","indexes":[311]},"审批流":{"path":"/tag/%E5%AE%A1%E6%89%B9%E6%B5%81/","indexes":[311]},"MQTT":{"path":"/tag/mqtt/","indexes":[176,177,310]},"运维平台":{"path":"/tag/%E8%BF%90%E7%BB%B4%E5%B9%B3%E5%8F%B0/","indexes":[309,310]},"分布式":{"path":"/tag/%E5%88%86%E5%B8%83%E5%BC%8F/","indexes":[309]},"Shop":{"path":"/tag/shop/","indexes":[304,305,307,308]},"电商":{"path":"/tag/%E7%94%B5%E5%95%86/","indexes":[306]},"订单系统":{"path":"/tag/%E8%AE%A2%E5%8D%95%E7%B3%BB%E7%BB%9F/","indexes":[306]},"短视频":{"path":"/tag/%E7%9F%AD%E8%A7%86%E9%A2%91/","indexes":[301,303]},"多租户":{"path":"/tag/%E5%A4%9A%E7%A7%9F%E6%88%B7/","indexes":[302]},"移动端":{"path":"/tag/%E7%A7%BB%E5%8A%A8%E7%AB%AF/","indexes":[301]},"推荐系统":{"path":"/tag/%E6%8E%A8%E8%8D%90%E7%B3%BB%E7%BB%9F/","indexes":[300]},"GoWind Toolkit":{"path":"/tag/gowind-toolkit/","indexes":[298,299]},"代码生成":{"path":"/tag/%E4%BB%A3%E7%A0%81%E7%94%9F%E6%88%90/","indexes":[328,298,299]},"Element Plus":{"path":"/tag/element-plus/","indexes":[298]},"Ant Design":{"path":"/tag/ant-design/","indexes":[298]},"UBA":{"path":"/tag/uba/","indexes":[292,293,294,295,297]},"大数据分析":{"path":"/tag/%E5%A4%A7%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90/","indexes":[293,294,295,297]},"ClickHouse":{"path":"/tag/clickhouse/","indexes":[296]},"OLAP":{"path":"/tag/olap/","indexes":[172,296]},"数据架构":{"path":"/tag/%E6%95%B0%E6%8D%AE%E6%9E%B6%E6%9E%84/","indexes":[296]},"Rust":{"path":"/tag/rust/","indexes":[327,328,206]},"微服务":{"path":"/tag/%E5%BE%AE%E6%9C%8D%E5%8A%A1/","indexes":[206]},"架构设计":{"path":"/tag/%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1/","indexes":[206]},"WebRTC":{"path":"/tag/webrtc/","indexes":[141,214,63]},"Security":{"path":"/tag/security/","indexes":[287,288,291]},"SaaS":{"path":"/tag/saas/","indexes":[260]},"MongoDB":{"path":"/tag/mongodb/","indexes":[59]},"Kratos":{"path":"/tag/kratos/","indexes":[156,242]},"CRUD":{"path":"/tag/crud/","indexes":[242]},"GORM":{"path":"/tag/gorm/","indexes":[242]},"Wire":{"path":"/tag/wire/","indexes":[242]},"Headless CMS":{"path":"/tag/headless-cms/","indexes":[192]},"WASM":{"path":"/tag/wasm/","indexes":[81]},"随机种子":{"path":"/tag/%E9%9A%8F%E6%9C%BA%E7%A7%8D%E5%AD%90/","indexes":[56]},"MacOS":{"path":"/tag/macos/","indexes":[181,219,124]},"Ubuntu":{"path":"/tag/ubuntu/","indexes":[191,100]},"GCC":{"path":"/tag/gcc/","indexes":[100]},"Godot":{"path":"/tag/godot/","indexes":[219]},"Clang":{"path":"/tag/clang/","indexes":[191]},"Superset":{"path":"/tag/superset/","indexes":[99]},"CentOS":{"path":"/tag/centos/","indexes":[190]},"OpenCV":{"path":"/tag/opencv/","indexes":[190]},"咖啡":{"path":"/tag/%E5%92%96%E5%95%A1/","indexes":[0]},"Android":{"path":"/tag/android/","indexes":[189]},"Google Play":{"path":"/tag/google-play/","indexes":[189]},"Unity WebGL":{"path":"/tag/unity-webgl/","indexes":[218]},"Dexie":{"path":"/tag/dexie/","indexes":[188]},"IndexedDB":{"path":"/tag/indexeddb/","indexes":[188]},"htop":{"path":"/tag/htop/","indexes":[98]},"IM":{"path":"/tag/im/","indexes":[205]},"Postgresql":{"path":"/tag/postgresql/","indexes":[97]},"Mattermost":{"path":"/tag/mattermost/","indexes":[96]},"Qt":{"path":"/tag/qt/","indexes":[77,78,79,187]},"TL;DR":{"path":"/tag/tl_dr/","indexes":[186]},"Swift":{"path":"/tag/swift/","indexes":[232]},"Javascript":{"path":"/tag/javascript/","indexes":[183,185]},"JetBrains":{"path":"/tag/jetbrains/","indexes":[184]},"Typescript":{"path":"/tag/typescript/","indexes":[183]},"libuv":{"path":"/tag/libuv/","indexes":[80]},"Linux":{"path":"/tag/linux/","indexes":[182]},"本地化":{"path":"/tag/%E6%9C%AC%E5%9C%B0%E5%8C%96/","indexes":[217]},"国际化":{"path":"/tag/%E5%9B%BD%E9%99%85%E5%8C%96/","indexes":[217]},"状态同步":{"path":"/tag/%E7%8A%B6%E6%80%81%E5%90%8C%E6%AD%A5/","indexes":[216]},"帧同步":{"path":"/tag/%E5%B8%A7%E5%90%8C%E6%AD%A5/","indexes":[216]},"泡泡水":{"path":"/tag/%E6%B3%A1%E6%B3%A1%E6%B0%B4/","indexes":[326]},"Markdown":{"path":"/tag/markdown/","indexes":[180]},"机器学习":{"path":"/tag/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/","indexes":[179]},"QTT":{"path":"/tag/qtt/","indexes":[178]},"MSB":{"path":"/tag/msb/","indexes":[175]},"LSB":{"path":"/tag/lsb/","indexes":[175]},"MySQL":{"path":"/tag/mysql/","indexes":[95]},"npm":{"path":"/tag/npm/","indexes":[174]},"pnpm":{"path":"/tag/pnpm/","indexes":[174]},"yarn":{"path":"/tag/yarn/","indexes":[174]},"OCR":{"path":"/tag/ocr/","indexes":[173]},"OHLC":{"path":"/tag/ohlc/","indexes":[226]},"OLTP":{"path":"/tag/oltp/","indexes":[172]},"OpenAI":{"path":"/tag/openai/","indexes":[171]},"OpenAPI":{"path":"/tag/openapi/","indexes":[170]},"数织":{"path":"/tag/%E6%95%B0%E7%BB%87/","indexes":[215]},"Ping":{"path":"/tag/ping/","indexes":[169]},"人体姿态识别":{"path":"/tag/%E4%BA%BA%E4%BD%93%E5%A7%BF%E6%80%81%E8%AF%86%E5%88%AB/","indexes":[168]},"全文搜索":{"path":"/tag/%E5%85%A8%E6%96%87%E6%90%9C%E7%B4%A2/","indexes":[167]},"交叉表":{"path":"/tag/%E4%BA%A4%E5%8F%89%E8%A1%A8/","indexes":[166]},"Prometheus":{"path":"/tag/prometheus/","indexes":[164]},"Docx":{"path":"/tag/docx/","indexes":[3]},"QUIC":{"path":"/tag/quic/","indexes":[161]},"Reactor":{"path":"/tag/reactor/","indexes":[160]},"Websocket":{"path":"/tag/websocket/","indexes":[214]},"KCP":{"path":"/tag/kcp/","indexes":[214]},"Kratos-Transport":{"path":"/tag/kratos-transport/","indexes":[214]},"Redis":{"path":"/tag/redis/","indexes":[159]},"REST":{"path":"/tag/rest/","indexes":[158]},"CoTURN":{"path":"/tag/coturn/","indexes":[92,93]},"RushWind":{"path":"/tag/rushwind/","indexes":[327,328]},"契约测试":{"path":"/tag/%E5%A5%91%E7%BA%A6%E6%B5%8B%E8%AF%95/","indexes":[328]},"中后台":{"path":"/tag/%E4%B8%AD%E5%90%8E%E5%8F%B0/","indexes":[327]},"开源项目":{"path":"/tag/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/","indexes":[327]},"RBAC":{"path":"/tag/rbac/","indexes":[157]},"SDD":{"path":"/tag/sdd/","indexes":[156]},"Selenium":{"path":"/tag/selenium/","indexes":[155]},"基准测试":{"path":"/tag/%E5%9F%BA%E5%87%86%E6%B5%8B%E8%AF%95/","indexes":[154]},"Spine":{"path":"/tag/spine/","indexes":[213]},"股票":{"path":"/tag/%E8%82%A1%E7%A5%A8/","indexes":[224]},"Roguelike":{"path":"/tag/roguelike/","indexes":[209,212]},"ThingsBoard":{"path":"/tag/thingsboard/","indexes":[229,230,231]},"时间戳":{"path":"/tag/%E6%97%B6%E9%97%B4%E6%88%B3/","indexes":[152]},"时序数据库":{"path":"/tag/%E6%97%B6%E5%BA%8F%E6%95%B0%E6%8D%AE%E5%BA%93/","indexes":[149,150,151]},"交易所":{"path":"/tag/%E4%BA%A4%E6%98%93%E6%89%80/","indexes":[223]},"Unity":{"path":"/tag/unity/","indexes":[210,211]},"用户画像":{"path":"/tag/%E7%94%A8%E6%88%B7%E7%94%BB%E5%83%8F/","indexes":[145]},"PgBouncer":{"path":"/tag/pgbouncer/","indexes":[91]},"Vite":{"path":"/tag/vite/","indexes":[144]},"WebGL":{"path":"/tag/webgl/","indexes":[142]},"加权随机":{"path":"/tag/%E5%8A%A0%E6%9D%83%E9%9A%8F%E6%9C%BA/","indexes":[140]},"BI":{"path":"/tag/bi/","indexes":[139]},"数据血缘":{"path":"/tag/%E6%95%B0%E6%8D%AE%E8%A1%80%E7%BC%98/","indexes":[138]},"Roguelite":{"path":"/tag/roguelite/","indexes":[209]},"Protocol":{"path":"/tag/protocol/","indexes":[137]},"WiFi":{"path":"/tag/wifi/","indexes":[136]},"WSL":{"path":"/tag/wsl/","indexes":[87,88,90]},"Windows":{"path":"/tag/windows/","indexes":[87,88,89,135]}}}}}'),Yc=JSON.parse('["/posts/how_to_make_drip_bag_coffee.html","/posts/5_anti_inflammatory_medicine.html","/posts/python_pip_source.html","/posts/python_docx.html","/posts/face_recognition.html","/posts/compute_trc20_address.html","/posts/9_fastapi_resources_you_need_to_know.html","/posts/about_live_and_death.html","/posts/admin_permission.html","/posts/microservice_technology_selection_why_go_kratos.html","/posts/kratos_zanzibar.html","/posts/kratos_websocket_chat_room.html","/posts/kratos_webrtc.html","/posts/kratos_upload_file.html","/posts/kratos_uba.html","/posts/kratos_thrift.html","/posts/kratos_task_queue.html","/posts/kratos_swagger_ui.html","/posts/kratos_sse.html","/posts/kratos_socketio.html","/posts/kratos_signalr.html","/posts/kratos_server_run_as_daemon.html","/posts/kratos_rocketmq.html","/posts/kratos_rabbitmq.html","/posts/kratos_pulsar.html","/posts/kratos_opa.html","/posts/kratos_nsq.html","/posts/kratos_nats.html","/posts/kratos_mtls.html","/posts/kratos_mqtt.html","/posts/kratos_mq.html","/posts/kratos_monolith_architecture.html","/posts/kratos_mcp.html","/posts/kratos_machinery.html","/posts/kratos_kcp.html","/posts/kratos_kafka.html","/posts/kratos_iot_realtime_map.html","/posts/kratos_hptimer_cron.html","/posts/kratos_hotpot.html","/posts/kratos_graphql.html","/posts/kratos_friend_wire.html","/posts/kratos_friend_gorm.html","/posts/kratos_friend_ent.html","/posts/kratos_friend_dtm.html","/posts/kratos_field_mask.html","/posts/kratos_faq.html","/posts/kratos_efk.html","/posts/kratos_cqrs.html","/posts/kratos_cms.html","/posts/kratos_cfg.html","/posts/kratos_casbin.html","/posts/kratos_bazel_build_guide.html","/posts/kratos_auth_authz.html","/posts/kratos_asynq.html","/posts/kratos_api_design_guide.html","/posts/how_to_use_make_golang_app_in_windows.html","/posts/how_to_generate_rand_seed_for_golang.html","/posts/golang_with_bazel.html","/posts/golang_out_param.html","/posts/golang_mongodb_query_examples.html","/posts/golang_module_manage.html","/posts/golang_face_recognition.html","/posts/golang_concurrency_patterns_fanin_fanout.html","/posts/go_webrtc.html","/posts/go_proxy.html","/posts/go_kratos_beginners_guide_implementing_gorm_crud_operations_in_go_kratos_with_go_crud.html","/posts/go_kratos_beginners_guide_implementing_ent_crud_operations_in_go_kratos_with_go_crud.html","/posts/go_inheritance.html","/posts/go_event_loop.html","/posts/go_algorithm_sort.html","/posts/go_algorithm_search.html","/posts/entgo_soft_delete.html","/posts/entgo_code_generate_tools.html","/posts/create_container_images_with_bazel.html","/posts/centos_install_golang.html","/posts/cdc_for_postgresql_using_go_golang.html","/posts/architecture-evolution-core-cms-shop.html","/posts/qt_singleton.html","/posts/qt_qml_date_time_picker.html","/posts/qt_cpp_call_qml_callback.html","/posts/libuv_timer.html","/posts/how_to_compile_cpp_to_wasm.html","/posts/cpp_type_cast_4.html","/posts/cpp_ide.html","/posts/cpp_embed_python_protobuf_sigsegv_error.html","/posts/asio_timer.html","/posts/asio_post_and_dispatch.html","/posts/wsl2_set_proxy.html","/posts/wsl2_reboot.html","/posts/windows_server_deploy_docker.html","/posts/windows_docker_desktop_release_disk.html","/posts/using_pgbouncer_to_improve_performance_and_reduce_the_load_on_postgresql.html","/posts/ubuntu_install_coturn.html","/posts/running_coturn_in_docker_a_step_by_step_guide.html","/posts/postgresql_docker_container_change_timezone.html","/posts/mysql_ibd_to_sql.html","/posts/install_mattermost_using_docker_compose.html","/posts/install_extensions_in_postgres_docker_container.html","/posts/htop_desc.html","/posts/how_to_install_mysql_driver_in_superset_docker_container.html","/posts/how_to_install_gcc_on_ubuntu.html","/posts/how_to_dockerize_a_go_application.html","/posts/how_to_complie_and_install_extension_in_postgresql_containor.html","/posts/docker_release_disk.html","/posts/docker_publish_static_website.html","/posts/docker_prune.html","/posts/docker_postgresql_install_extension.html","/posts/docker_port_bind_forbidden.html","/posts/docker_no_proxy_solution.html","/posts/docker_install_vim.html","/posts/docker_inner_install_software.html","/posts/docker_hub_registry_mirrors.html","/posts/docker_deploy_swagger.html","/posts/docker_deploy_simple_traefik_microservice_gateway.html","/posts/develop_jitsi_meet.html","/posts/develop_docker_deploy.html","/posts/deploy_rust_desk_server.html","/posts/deploy_efk.html","/posts/customer_retention_rate.html","/posts/crontab.html","/posts/clear_kdevtmpfsi_kinsing.html","/posts/clear_docker_junk_file.html","/posts/automated_backups_with_%20cron_and_rclone.html","/posts/my_favorite_top-5_1_flutter_packages_in_2024_to_enhance_apps.html","/posts/how_to_install_flutter_on_macos.html","/posts/flutter_use_sealed_class_made_class_stronger.html","/posts/flutter_source_list.html","/posts/flutter_ohos.html","/posts/flutter_newbie.html","/posts/flutter_getx_is_not_a_good_choose.html","/posts/fix_flutter_ios_build_errors.html","/posts/fix_build_bug_android_studio_upgrade_to_ladybug.html","/posts/exploring_sealed_classes_in_flutter.html","/posts/efficient_communication_between_parent_and_child_widgets_in_flutter.html","/posts/bloc_a_reactive_approach_using_rxdart_streams.html","/posts/windows_install_flutter.html","/posts/wifi_crack.html","/posts/why_is_protobbuf_3_design_such_like_this.html","/posts/what_is_data_lineage.html","/posts/what_is_bi.html","/posts/weight_random_algorithm.html","/posts/webrtc_video_calling_with_flutter.html","/posts/webgl_engine.html","/posts/vue_low_version_problem.html","/posts/vite_permission_denied.html","/posts/user_portrait.html","/posts/ubuntu_install_cmake.html","/posts/typescript_minio_upload_file.html","/posts/typescript_ip_computer.html","/posts/tsdb_timescale.html","/posts/tsdb_mongo.html","/posts/tsdb_es.html","/posts/timestamp.html","/posts/stupid_robber_problem.html","/posts/server_benchmark.html","/posts/selenium_stale_element_reference.html","/posts/schema-driven-kratos-codegen.html","/posts/saas_rbac.html","/posts/rest_design_principles.html","/posts/redis_keyspace_notifications.html","/posts/reactor.html","/posts/quic_open_source.html","/posts/protobufjs.html","/posts/protobuf_generate_golang_code_4ways.html","/posts/prometheus_metrics_type.html","/posts/postgresql_timestamp_group_query.html","/posts/postgresql_cross_table_query.html","/posts/postgres_full_text_search_a_search_engine_in_a_database.html","/posts/pose_estimation.html","/posts/ping_regex.html","/posts/openapi_to_typescript_dts.html","/posts/openai_assistants_api.html","/posts/oltp_olap.html","/posts/ocr.html","/posts/npm_yarn_pnpm_change_source.html","/posts/msb_lsb.html","/posts/mqtt_x509.html","/posts/mqtt_lwt.html","/posts/mqtt_http_auth.html","/posts/ml_lab.html","/posts/markdown_tutorial.html","/posts/mac_delete.html","/posts/linux_show_lib_exported_table.html","/posts/js_ts_async_await_use_filereader.html","/posts/jetbrains_ide_shortcuts.html","/posts/javascript_repleace_function.html","/posts/interesting_english_abbreviations.html","/posts/install_qt_ide.html","/posts/how_to_use_dexie_with_typescript.html","/posts/how_to_publish_android_app_to_google_play.html","/posts/how_to_install_opencv_on_centos7.html","/posts/how_to_install_llvm_on_ubuntu.html","/posts/headless_cms.html","/posts/git_submodule.html","/posts/git_set_proxy.html","/posts/extract_wechat_applet_resources.html","/posts/execel_transfer_column_number_letter.html","/posts/excel_7_style.html","/posts/docx_add_pinyin.html","/posts/code_special_comment.html","/posts/cmake_lib_gtest.html","/posts/clion_switch_h_cpp.html","/posts/build_system.html","/posts/cache_pattern.html","/posts/car_drive.html","/posts/im_system_design.html","/posts/go_rust_hybrid_architecture.html","/posts/cqrs_pattern_with_kafka_streams_part_1.html","/posts/cloud_phone.html","/posts/what_is_roguelike_roguelite.html","/posts/upgrade_unity_project.html","/posts/unity_asset_bundle_file_format.html","/posts/the_24_best_roguelikes.html","/posts/spine_downgrading_version.html","/posts/real-time-game-network-protocol-kcp-vs-webrtc-vs-websocket.html","/posts/picross_nonogram.html","/posts/lockstep_and_state_sync.html","/posts/localization_vs_internationalization.html","/posts/how_to_unpack_unitywebdata1_0_in_unity_webgl_games.html","/posts/how_to_install_godot_4_on_a_mac.html","/posts/font_rendering.html","/posts/cocos_creator_problem.html","/posts/cocos2dx_tile_map.html","/posts/types_of_exchanges_stock_options_crypto_and_more.html","/posts/stock.html","/posts/quantitative_trading.html","/posts/ohlc.html","/posts/futures.html","/posts/doris4_quantitative_trading.html","/posts/thingsboard_rule_engine.html","/posts/thingsboard_device_provision.html","/posts/thingsboard_device_credentials.html","/posts/iot_and_homekit.html","/posts/geo_db.html","/posts/gaode_geofence.html","/posts/firefly_roc_rk3588s_pc.html","/posts/traditional-cms-heavy-try-gowind-headless.html","/posts/gowind-unified-paradigm-standardized-admin-api.html","/posts/gowind-headless-golang-enterprise-admin.html","/posts/gowind-cms-core-bff-architecture.html","/posts/gowind-backend-permission-architecture-vue3-react.html","/posts/gowind-admin-vue-crud-best-practice.html","/posts/gowind-admin-kratos-monorepo-lightweight-practice.html","/posts/gowind-admin-go-vue-react-dev-practice.html","/posts/go_wind_data_permission.html","/posts/go_wind_cms_vs_php_java_cms.html","/posts/go_wind_cms_intro.html","/posts/go_wind_cms_headless_architecture_advantages.html","/posts/go_wind_api_aggregator.html","/posts/go_wind_admin_with_protoc_gen_typescript_http.html","/posts/go_wind_admin_wire.html","/posts/go_wind_admin_user_table_evolution.html","/posts/go_wind_admin_upload_file.html","/posts/go_wind_admin_task.html","/posts/go_wind_admin_swagger.html","/posts/go_wind_admin_sse_architecture.html","/posts/go_wind_admin_script_system.html","/posts/go_wind_admin_script_engine.html","/posts/go_wind_admin_redact.html","/posts/go_wind_admin_quick_start_guide_from_environment_setup_to_service_launch_windows_macos_linux_universal.html","/posts/go_wind_admin_plan_billing.html","/posts/go_wind_admin_opa.html","/posts/go_wind_admin_notification_domain.html","/posts/go_wind_admin_multi_tenant_isolation.html","/posts/go_wind_admin_mongodb.html","/posts/go_wind_admin_makefile.html","/posts/go_wind_admin_list_query_rule.html","/posts/go_wind_admin_layer_desigin.html","/posts/go_wind_admin_jwt.html","/posts/go_wind_admin_intro.html","/posts/go_wind_admin_internal_message.html","/posts/go_wind_admin_influxdb.html","/posts/go_wind_admin_in_depth_analysis_of_the_tech_stack_why_choose_the_golang_vue3_combination.html","/posts/go_wind_admin_impl_new_service_with_gorm.html","/posts/go_wind_admin_impl_new_service_with_ent.html","/posts/go_wind_admin_gow.html","/posts/go_wind_admin_frontend_access_control.html","/posts/go_wind_admin_excel_import_export.html","/posts/go_wind_admin_elasticsearch.html","/posts/go_wind_admin_development_environment_preparation.html","/posts/go_wind_admin_deploy_docker_image.html","/posts/go_wind_admin_code_gen.html","/posts/go_wind_admin_clickhouse.html","/posts/go_wind_admin_casbin.html","/posts/go_wind_admin_bootstrap.html","/posts/go_wind_admin_backend_project_struct.html","/posts/go_wind_admin_backend_access_control.html","/posts/go_wind_admin_authentication.html","/posts/go_wind_admin_audit_compliance.html","/posts/go_wind_admin_api_management.html","/posts/go_wind_admin_ai_module.html","/posts/go_wind_admin_access_key.html","/posts/go-wind-uba-user-behavior-full-link-analysis.html","/posts/go-wind-uba-sdk-and-collector.html","/posts/go-wind-uba-olap-sql-deep-dive.html","/posts/go-wind-uba-multi-tenant-security.html","/posts/go-wind-uba-clickhouse-doris-parity.html","/posts/go-wind-uba-architecture-overview.html","/posts/go-wind-toolkit-frontend-full-code-generation.html","/posts/go-wind-toolkit-backend-full-code-generation.html","/posts/go-wind-shortplay-rule-based-recommendation-loop.html","/posts/go-wind-shortplay-flutter-immersive-feed.html","/posts/go-wind-shortplay-ent-multi-tenant-isolation.html","/posts/go-wind-shortplay-architecture-deep-dive.html","/posts/go-wind-shop-security-and-production-readiness.html","/posts/go-wind-shop-overview-and-positioning.html","/posts/go-wind-shop-order-timeout.html","/posts/go-wind-shop-internationalization-and-going-global.html","/posts/go-wind-shop-architecture-deep-dive.html","/posts/go-wind-ops-multi-replica-coordination.html","/posts/go-wind-ops-architecture-deep-dive.html","/posts/go-wind-oa-workflow-engine.html","/posts/go-wind-ledger-balance-consistency.html","/posts/go-wind-kanban-lexorank-realtime.html","/posts/go-wind-iam-build-or_thirdparty-decision.html","/posts/go-wind-erp-consistency-levels.html","/posts/go-wind-cms-yjs-collab-backend.html","/posts/go-wind-cms-taro-tech-guide.html","/posts/go-wind-cms-social-distribution-engine.html","/posts/go-wind-cms-nuxt-tech-guide.html","/posts/go-wind-cms-nl2sql-four-guards.html","/posts/go-wind-cms-nextjs-tech-guide.html","/posts/go-wind-cms-microservice-why-choose-kratos.html","/posts/go-wind-cms-flutter-tech-guide.html","/posts/go-wind-ai-development-framework-scaffold-value.html","/posts/go-wind-admin-notify-39-channels.html","/posts/make_bubble_water.html","/posts/rushwind_admin_intro.html","/posts/rushwind_admin_contract_driven.html","/posts/roc_rk3588s_pc_deploy_ai_model.html"]'),Nf=JSON.parse('{"article":{"/":{"path":"/article/","indexes":[1,6,7,8,76,86,85,122,134,202,203,204,75,74,121,120,201,208,200,222,221,199,5,84,83,82,207,73,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,198,228,133,72,71,197,196,132,195,4,235,131,130,129,128,127,126,125,220,227,234,233,194,193,325,324,323,322,321,320,319,318,317,316,315,314,313,312,311,310,309,308,307,306,305,304,303,302,301,300,299,298,297,296,295,294,293,292,70,69,68,67,66,65,64,206,63,291,290,289,288,287,286,285,284,283,282,281,280,279,278,277,276,275,274,273,272,271,270,269,268,267,266,265,264,263,262,261,260,259,258,257,256,255,254,253,252,251,250,249,248,247,246,245,244,62,61,60,59,58,57,243,242,241,240,239,238,237,192,81,102,101,56,124,100,219,191,99,190,0,189,218,188,55,98,205,97,96,187,186,232,185,184,183,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,37,36,35,34,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,80,182,217,216,181,326,180,9,179,178,177,176,175,123,95,174,173,226,172,171,170,215,169,168,167,166,94,165,164,163,162,3,2,79,78,77,225,161,160,214,159,158,93,328,327,157,156,155,154,213,224,153,212,231,230,229,152,236,151,150,149,223,148,147,146,92,211,210,145,91,144,143,142,141,140,139,138,209,137,136,90,135,89,88,87,329]}},"timeline":{"/":{"path":"/timeline/","indexes":[325,320,318,316,315,313,312,311,310,309,306,303,302,301,300,296,206,328,327,291,290,288,287,277,263,262,260,256,255,216,308,307,305,304,297,295,294,293,76,214,323,242,317,321,319,299,298,324,314,238,241,240,237,243,239,37,34,12,156,95,322,292,247,245,99,236,228,1,6,7,8,86,85,122,134,202,203,204,75,74,121,201,208,200,222,221,199,5,84,83,82,207,73,119,118,117,116,115,114,113,112,111,110,109,108,107,106,105,104,103,198,133,72,71,197,196,132,195,4,235,131,130,129,128,127,126,125,220,227,234,233,194,193,70,69,68,67,66,65,64,63,289,286,285,284,283,282,281,280,279,278,276,275,274,273,272,271,270,269,268,267,266,265,264,261,259,258,257,254,253,252,251,250,249,248,246,244,62,61,60,59,58,57,192,81,102,101,56,124,100,219,191,190,0,189,218,188,55,98,205,97,96,187,186,232,185,184,183,54,53,52,51,50,49,48,47,46,45,44,43,42,41,40,39,38,36,35,33,32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,11,10,80,182,217,181,326,180,9,179,178,177,176,175,123,174,173,226,172,171,170,215,169,168,167,166,94,165,164,163,162,3,2,79,78,77,225,161,160,159,158,93,157,155,154,213,224,153,212,231,230,229,152,151,150,149,223,148,147,146,92,211,210,145,91,144,143,142,141,140,139,138,209,137,136,90,135,89,88,87]}}}'),Ci=kt(Ff),tp=t=>{const e=Ss(),n=xn(),a=Ho();return G(()=>{var l;const s=t??((l=n.value.blog)==null?void 0:l.key)??"";if(!s)return console.warn("useBlogCategory: key not found"),{path:"/",map:{}};if(!(s in Ci.value))throw new Error(`useBlogCategory: key ${s} is invalid`);const o=Ci.value[s][a.value],r={path:o.path,map:{}};for(const c in o.map){const p=o.map[c];r.map[c]={path:p.path,items:[]};for(const d of p.indexes){const{path:u,meta:g}=Tn(Yc[d]);r.map[c].items.push({path:u,info:g._blog})}e.value.path===p.path&&(r.currentItems=r.map[c].items)}return r})},Li=kt(Nf),ep=t=>{const e=xn(),n=Ho();return G(()=>{var r;const a=t??((r=e.value.blog)==null?void 0:r.key)??"";if(!a)return console.warn("useBlogType: key not found"),{path:"/",items:[]};if(!(a in Li.value))throw new Error(`useBlogType: key ${t} is invalid`);const s=Li.value[a][n.value],o={path:s.path,items:[]};for(const l of s.indexes){const{path:c,meta:p}=Tn(Yc[l]);o.items.push({path:c,info:p._blog})}return o})},Kf={class:"article-wrapper"},Hf={key:0},jf=["onClick"],Uf={class:"title"},Zf={class:"article-info"},qf={key:0,class:"author"},$f={key:1,class:"date"},zf={key:2,class:"category"},Qf={key:3,class:"tag"},Xf=["innerHTML"],Os={__name:"ArticleList",props:{items:{type:Array,required:!0},isTimeline:Boolean},setup(t){return(e,n)=>(N(),tt("div",Kf,[t.items.length?St("",!0):(N(),tt("div",Hf,"Nothing in here.")),(N(!0),tt(bt,null,xe(t.items,({info:a,path:s})=>(N(),tt("article",{key:s,class:"article",onClick:o=>e.$router.push(s)},[nt("header",Uf,mt((t.isTimeline?`${new Date(a.date).toLocaleDateString()}: `:"")+a.title),1),n[0]||(n[0]=nt("hr",null,null,-1)),nt("div",Zf,[a.author?(N(),tt("span",qf,"Author: "+mt(a.author),1)):St("",!0),a.date&&!t.isTimeline?(N(),tt("span",$f,"Date: "+mt(new Date(a.date).toLocaleDateString()),1)):St("",!0),a.category?(N(),tt("span",zf,"Category: "+mt(a.category.join(", ")),1)):St("",!0),a.tag?(N(),tt("span",Qf,"Tag: "+mt(a.tag.join(", ")),1)):St("",!0)]),a.excerpt?(N(),tt("div",{key:0,class:"excerpt",innerHTML:a.excerpt},null,8,Xf)):St("",!0)],8,jf))),128))]))}},Jf={class:"page"},Yf={__name:"Article",setup(t){const e=ep("article");return(n,a)=>(N(),At(Ba,null,{page:Et(()=>[nt("main",Jf,[it(Os,{items:H(e).items},null,8,["items"])])]),_:1}))}},tv={class:"page"},ev={class:"category-wrapper"},nv={class:"category-num"},av={__name:"Category",setup(t){const e=tp("category"),n=Rs();return(a,s)=>(N(),At(Ba,null,{page:Et(()=>[nt("main",tv,[nt("div",ev,[(N(!0),tt(bt,null,xe(H(e).map,({items:o,path:r},l)=>(N(),At(H(zn),{key:l,to:r,active:H(n)===r,class:"category"},{default:Et(()=>[Ge(mt(l)+" ",1),nt("span",nv,mt(o.length),1)]),_:2},1032,["to","active"]))),128))]),it(Os,{items:H(e).currentItems??[]},null,8,["items"])])]),_:1}))}},sv={class:"page"},ov={class:"tag-wrapper"},rv={class:"tag-num"},iv={__name:"Tag",setup(t){const e=tp("tag"),n=Rs();return(a,s)=>(N(),At(Ba,null,{page:Et(()=>[nt("main",sv,[nt("div",ov,[(N(!0),tt(bt,null,xe(H(e).map,({items:o,path:r},l)=>(N(),At(H(zn),{key:l,to:r,active:H(n)===r,class:"tag"},{default:Et(()=>[Ge(mt(l)+" ",1),nt("span",rv,mt(o.length),1)]),_:2},1032,["to","active"]))),128))]),it(Os,{items:H(e).currentItems??[]},null,8,["items"])])]),_:1}))}},lv={class:"page"},cv={__name:"Timeline",setup(t){const e=ep("timeline");return(n,a)=>(N(),At(Ba,null,{page:Et(()=>[nt("main",lv,[a[0]||(a[0]=nt("h1",{class:"timeline-title"},"Timeline",-1)),it(Os,{items:H(e).items,"is-timeline":""},null,8,["items"])])]),_:1}))}},pv=We({layouts:{Article:Yf,Category:av,Tag:iv,Timeline:cv}}),dv=Object.freeze(Object.defineProperty({__proto__:null,default:pv},Symbol.toStringTag,{value:"Module"})),za=[l_,B_,H_,U_,tm,um,vm,Em,wm,Im,Sf,Mf,dv].map(t=>t.default).filter(Boolean),uv=JSON.parse('{"base":"/","lang":"zh-CN","title":"喵个咪的博客","description":"喵个咪","head":[["link",{"rel":"icon","href":"/favicon.ico"}]],"locales":{}}');var sa=kt(uv),gv=M0,_v=()=>{const t=ig({history:gv(ec("/")),routes:[{name:"vuepress-route",path:"/:catchAll(.*)",components:{}}],scrollBehavior:(e,n,a)=>a||(e.hash?{el:e.hash}:{top:0})});return t.beforeResolve(async(e,n)=>{if(e.path!==n.path||n===He){const a=Tn(e.fullPath);if(a.path!==e.fullPath)return a.path;const s=await a.loader();e.meta={...a.meta,_pageChunk:s}}else e.path===n.path&&(e.meta=n.meta)}),t},mv=t=>{t.component("ClientOnly",jo),t.component("Content",Uo),t.component("RouteLink",zn)},hv=(t,e,n)=>{const a=G(()=>e.currentRoute.value.path),s=ll((y,R)=>({get(){return y(),e.currentRoute.value.meta._pageChunk},set(A){e.currentRoute.value.meta._pageChunk=A,R()}})),o=G(()=>un.resolveLayouts(n)),r=G(()=>un.resolveRouteLocale(sa.value.locales,a.value)),l=G(()=>un.resolveSiteLocaleData(sa.value,r.value)),c=G(()=>s.value.comp),p=G(()=>s.value.data),d=G(()=>p.value.frontmatter),u=G(()=>un.resolvePageHeadTitle(p.value,l.value)),g=G(()=>un.resolvePageHead(u.value,d.value,l.value)),m=G(()=>un.resolvePageLang(p.value,l.value)),v=G(()=>un.resolvePageLayout(p.value,o.value)),b={layouts:o,pageData:p,pageComponent:c,pageFrontmatter:d,pageHead:g,pageHeadTitle:u,pageLang:m,pageLayout:v,redirects:ko,routeLocale:r,routePath:a,routes:Wn,siteData:sa,siteLocaleData:l};return t.provide(No,b),Object.defineProperties(t.config.globalProperties,{$frontmatter:{get:()=>d.value},$head:{get:()=>g.value},$headTitle:{get:()=>u.value},$lang:{get:()=>m.value},$page:{get:()=>p.value},$routeLocale:{get:()=>r.value},$site:{get:()=>sa.value},$siteLocale:{get:()=>l.value},$withBase:{get:()=>Zo}}),b},fv=([t,e,n=""])=>{const a=Object.entries(e).map(([l,c])=>ye(c)?`[${l}=${JSON.stringify(c)}]`:c?`[${l}]`:"").join(""),s=`head > ${t}${a}`;return Array.from(document.querySelectorAll(s)).find(l=>l.innerText===n)??null},vv=([t,e,n])=>{if(!ye(t))return null;const a=document.createElement(t);return Wo(e)&&Object.entries(e).forEach(([s,o])=>{ye(o)?a.setAttribute(s,o):o&&a.setAttribute(s,"")}),ye(n)&&a.appendChild(document.createTextNode(n)),a},bv=()=>{const t=cg(),e=Ko();let n=[];const a=()=>{t.value.forEach(r=>{const l=fv(r);l&&n.push(l)})},s=()=>{const r=[];return t.value.forEach(l=>{const c=vv(l);c&&r.push(c)}),r},o=()=>{document.documentElement.lang=e.value;const r=s();n.forEach((l,c)=>{const p=r.findIndex(d=>l.isEqualNode(d));p===-1?(l.remove(),delete n[c]):r.splice(p,1)}),r.forEach(l=>document.head.appendChild(l)),n=[...n.filter(l=>!!l),...r]};on(gg,o),re(()=>{a(),Yt(t,o,{immediate:!1})})},kv=Vu,Ev=async()=>{var n;const t=kv({name:"Vuepress",setup(){var o;bv();for(const r of za)(o=r.setup)==null||o.call(r);const a=za.flatMap(({rootComponents:r=[]})=>r.map(l=>Q(l))),s=pg();return()=>[Q(s.value),a]}}),e=_v();mv(t),hv(t,e,za);for(const a of za)await((n=a.enhance)==null?void 0:n.call(a,{app:t,router:e,siteData:sa}));return t.use(e),{app:t,router:e}};Ev().then(({app:t,router:e})=>{e.isReady().then(()=>{t.mount("#app")})});export{Is as _,nt as a,it as b,tt as c,Ev as createVueApp,Qd as d,Ge as e,i as f,N as o,xl as r,Et as w};
