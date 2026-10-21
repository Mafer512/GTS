(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=!1,t=!1,n=[],r=-1,i=!1,a=!1;function o(e){l(e)}function s(){a=!0}function c(){a=!1,d()}function l(e){n.includes(e)||(n.push(e),e._x_schedulerPriority!==void 0&&(i=!0)),d()}function u(e){let t=n.indexOf(e);t!==-1&&t>r&&n.splice(t,1)}function d(){if(!t&&!e){if(a)return;e=!0,queueMicrotask(f)}}function f(){e=!1,t=!0;for(let e=0;e<n.length;e++)i&&p(e),n[e](),r=e;n.length=0,r=-1,i=!1,t=!1}function p(e){let t=new Map,r=n.slice(e).sort((e,n)=>m(e,n,t));for(let t=0;t<r.length;t++)n[e+t]=r[t];i=!1}function m(e,t,n){return h(e)?h(t)?g(e._x_schedulerPriority.el,n)-g(t._x_schedulerPriority.el,n)||e._x_schedulerPriority.order-t._x_schedulerPriority.order:-1:+!!h(t)}function h(e){return e._x_schedulerPriority!==void 0}function g(e,t){if(t.has(e))return t.get(e);let n=0,r=e;for(;e;)n++,e=e._x_teleportBack?e._x_teleportBack:typeof ShadowRoot==`function`&&e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentElement;return t.set(r,n),n}var ee,_,te,ne,re=0,ie=!0;function ae(e){ie=!1,e(),ie=!0}function oe(e){ee=e.reactive,te=e.release,_=t=>e.effect(t,{scheduler:e=>{ie?o(e):e()}}),ne=e.raw}function se(e){_=e}function ce(e){let t=()=>{};return[(n,r)=>{let i=r?.priority===`structural`?re++:void 0,a=_(n);return i!==void 0&&a!==void 0&&(a._x_schedulerPriority={el:e,order:i}),e._x_effects||(e._x_effects=new Set,e._x_runEffects=()=>{e._x_effects.forEach(e=>e())}),e._x_effects.add(a),t=()=>{a!==void 0&&(e._x_effects.delete(a),te(a))},a},()=>{t()}]}function le(e,t){let n=!0,r,i,a=_(()=>{let a=e(),o=JSON.stringify(a);if(!n&&(typeof a==`object`||a!==r)){let e=typeof r==`object`?JSON.parse(i):r;queueMicrotask(()=>{t(a,e)})}r=a,i=o,n=!1});return()=>te(a)}async function ue(e){s();try{await e(),await Promise.resolve()}finally{c()}}var de=[],fe=[],pe=[];function me(e){pe.push(e)}function he(e,t){typeof t==`function`?(e._x_cleanups||=[],e._x_cleanups.push(t)):(t=e,fe.push(t))}function ge(e){de.push(e)}function _e(e,t,n){e._x_attributeCleanups||={},e._x_attributeCleanups[t]||(e._x_attributeCleanups[t]=[]),e._x_attributeCleanups[t].push(n)}function ve(e,t){e._x_attributeCleanups&&Object.entries(e._x_attributeCleanups).forEach(([n,r])=>{(t===void 0||t.includes(n))&&(r.forEach(e=>e()),delete e._x_attributeCleanups[n])})}function ye(e){for(e._x_effects?.forEach(u);e._x_cleanups?.length;)e._x_cleanups.pop()()}var be=new MutationObserver(je),xe=!1;function Se(){be.observe(document,{subtree:!0,childList:!0,attributes:!0,attributeOldValue:!0}),xe=!0}function Ce(){Te(),be.disconnect(),xe=!1}var we=[];function Te(){let e=be.takeRecords();we.push(()=>e.length>0&&je(e));let t=we.length;queueMicrotask(()=>{if(we.length===t)for(;we.length>0;)we.shift()()})}function Ee(){for(;we.length>0;)we.shift()();let e=be.takeRecords();e.length>0&&je(e)}function v(e){if(!xe)return e();Ce();let t=e();return Se(),t}var De=!1,Oe=[];function ke(){De=!0}function Ae(){De=!1,je(Oe),Oe=[]}function je(e){if(De){Oe=Oe.concat(e);return}let t=[],n=new Set,r=new Map,i=new Map;for(let a=0;a<e.length;a++)if(!e[a].target._x_ignoreMutationObserver&&(e[a].type===`childList`&&(e[a].removedNodes.forEach(e=>{e.nodeType===1&&e._x_marker&&n.add(e)}),e[a].addedNodes.forEach(e=>{e.nodeType===1&&(n.has(e)?n.delete(e):e._x_marker||t.push(e))})),e[a].type===`attributes`)){let t=e[a].target,n=e[a].attributeName,o=e[a].oldValue,s=()=>{r.has(t)||r.set(t,[]),r.get(t).push({name:n,value:t.getAttribute(n)})},c=()=>{i.has(t)||i.set(t,[]),i.get(t).push(n)};t.hasAttribute(n)&&o===null?s():t.hasAttribute(n)?(c(),s()):c()}i.forEach((e,t)=>{ve(t,e)}),r.forEach((e,t)=>{de.forEach(n=>n(t,e))});for(let e of n)t.some(t=>t.contains(e))||fe.forEach(t=>t(e));for(let e of t)e.isConnected&&pe.forEach(t=>t(e));t=null,n=null,r=null,i=null}function Me(e){return Fe(Pe(e))}function Ne(e,t,n){return e._x_dataStack=[t,...Pe(n||e)],()=>{e._x_dataStack=e._x_dataStack.filter(e=>e!==t)}}function Pe(e){return e._x_dataStack?e._x_dataStack:typeof ShadowRoot==`function`&&e instanceof ShadowRoot?Pe(e.host):e.parentNode?Pe(e.parentNode):[]}function Fe(e){return new Proxy({objects:e},Le)}function Ie(e,t){return e===null||e===Object.prototype?null:Object.prototype.hasOwnProperty.call(e,t)?e:Ie(Object.getPrototypeOf(e),t)}var Le={ownKeys({objects:e}){return Array.from(new Set(e.flatMap(e=>Object.keys(e))))},has({objects:e},t){return t!=Symbol.unscopables&&e.some(e=>Object.prototype.hasOwnProperty.call(e,t)||Reflect.has(e,t))},get({objects:e},t,n){return t==`toJSON`?Re:Reflect.get(e.find(e=>Reflect.has(e,t))||{},t,n)},set({objects:e},t,n,r){let i;for(let n of e)if(i=Ie(n,t),i)break;i||=e[e.length-1];let a=Object.getOwnPropertyDescriptor(i,t);return a?.set&&a?.get?a.set.call(r,n)||!0:Reflect.set(i,t,n)}};function Re(){return Reflect.ownKeys(this).reduce((e,t)=>(e[t]=Reflect.get(this,t),e),{})}function ze(e,t=()=>{}){let n=e=>typeof e==`object`&&!Array.isArray(e)&&e!==null,r=(i,a=``)=>{Object.entries(Object.getOwnPropertyDescriptors(i)).forEach(([o,{value:s,enumerable:c}])=>{if(c===!1||s===void 0||typeof s==`object`&&s&&s.__v_skip)return;let l=a===``?o:`${a}.${o}`;typeof s==`object`&&s&&s._x_interceptor?i[o]=s.initialize(e,l,o,t):n(s)&&s!==i&&!(s instanceof Element)&&r(s,l)})};return r(e)}function Be(e,t=()=>{}){let n={initialValue:void 0,_x_interceptor:!0,initialize(t,n,r,i){return e(this.initialValue,()=>Ve(t,n),e=>He(t,n,e),n,r,i)}};return t(n),e=>{if(typeof e==`object`&&e&&e._x_interceptor){let t=n.initialize.bind(n);n.initialize=(r,i,a,o)=>{let s=e.initialize(r,i,a,o);return n.initialValue=s,t(r,i,a,o)}}else n.initialValue=e;return n}}function Ve(e,t){return t.split(`.`).reduce((e,t)=>e[t],e)}function He(e,t,n){if(typeof t==`string`&&(t=t.split(`.`)),t.length===1)e[t[0]]=n;else if(t.length===0)throw error;else if(e[t[0]])return He(e[t[0]],t.slice(1),n);else return e[t[0]]={},He(e[t[0]],t.slice(1),n)}var Ue={};function We(e,t){Ue[e]=t}function Ge(e,t){let n=Ke(t);return Object.entries(Ue).forEach(([r,i])=>{Object.defineProperty(e,`$${r}`,{get(){return i(t,n)},enumerable:!1})}),e}function Ke(e){let[t,n]=wt(e),r={interceptor:Be,...t};return he(e,n),r}function qe(e,t,n,...r){try{return n(...r)}catch(n){Je(n,e,t)}}function Je(...e){return Ye(...e)}var Ye=Ze;function Xe(e){Ye=e}function Ze(e,t,n=void 0){e=Object.assign(e??{message:`No error message given.`},{el:t,expression:n}),console.warn(`Alpine Expression Error: ${e.message}

${n?`Expression: "`+n+`"

`:``}`,t),setTimeout(()=>{throw e},0)}var Qe=!0;function $e(e){let t=Qe;Qe=!1;let n=e();return Qe=t,n}function et(e,t,n={}){let r;return y(e,t)(e=>r=e,n),r}function y(...e){return tt(...e)}var tt=()=>{};function nt(e){tt=e}var rt;function it(e){rt=e}function at(e,t){let n={};Ge(n,e);let r=[n,...Pe(e)],i=typeof t==`function`?ot(r,t):lt(r,t,e);return qe.bind(null,e,t,i)}function ot(e,t){return(n=()=>{},{scope:r={},params:i=[],context:a}={})=>{Qe?ut(n,t.apply(Fe([r,...e]),i)):ut(n,t,Fe([r,...e]),i)}}var st={};function ct(e,t){if(st[e])return st[e];let n=Object.getPrototypeOf(async function(){}).constructor,r=/^[\n\s]*if.*\(.*\)/.test(e.trim())||/^(let|const)\s/.test(e.trim())?`(async()=>{ ${e} })()`:e,i=(()=>{try{let t=new n([`__self`,`scope`],`with (scope) { __self.result = ${r} }; __self.finished = true; return __self.result;`);return Object.defineProperty(t,"name",{value:`[Alpine] ${e}`}),t}catch(n){return Je(n,t,e),Promise.resolve()}})();return st[e]=i,i}function lt(e,t,n){let r=ct(t,n);return(i=()=>{},{scope:a={},params:o=[],context:s}={})=>{r.result=void 0,r.finished=!1;let c=Fe([a,...e]);if(typeof r==`function`){let e=r.call(s,r,c).catch(e=>Je(e,n,t));r.finished?(ut(i,r.result,c,o,n),r.result=void 0):e.then(e=>{ut(i,e,c,o,n)}).catch(e=>Je(e,n,t)).finally(()=>r.result=void 0)}}}function ut(e,t,n,r,i){if(Qe&&typeof t==`function`){let a=t.apply(n,r);a instanceof Promise?a.then(t=>ut(e,t,n,r)).catch(e=>Je(e,i,t)):e(a)}else typeof t==`object`&&t instanceof Promise?t.then(t=>e(t)):e(t)}function dt(...e){return rt(...e)}function ft(e,t,n={}){let r={};Ge(r,e);let i=[r,...Pe(e)],a=Fe([n.scope??{},...i]),o=n.params??[];if(t.includes(`await`)){let e=Object.getPrototypeOf(async function(){}).constructor;return new e([`scope`],`with (scope) { let __result = ${/^[\n\s]*if.*\(.*\)/.test(t.trim())||/^(let|const)\s/.test(t.trim())?`(async()=>{ ${t} })()`:t}; return __result }`).call(n.context,a)}{let e=/^[\n\s]*if.*\(.*\)/.test(t.trim())||/^(let|const)\s/.test(t.trim())?`(()=>{ ${t} })()`:t,r=Function([`scope`],`with (scope) { let __result = ${e}; return __result }`).call(n.context,a);return typeof r==`function`&&Qe?r.apply(a,o):r}}var pt=`x-`;function mt(e=``){return pt+e}function ht(e){pt=e}var gt={};function b(e,t){return gt[e]=t,{before(t){if(!gt[t]){console.warn(String.raw`Cannot find directive \`${t}\`. \`${e}\` will use the default order of execution`);return}let n=Ft.indexOf(t);Ft.splice(n>=0?n:Ft.indexOf(`DEFAULT`),0,e)}}}function _t(e){return Object.keys(gt).includes(e)}function vt(e,t,n){if(t=Array.from(t),e._x_virtualDirectives){let n=Object.entries(e._x_virtualDirectives).map(([e,t])=>({name:e,value:t})),r=yt(n);n=n.map(e=>r.find(t=>t.name===e.name)?{name:`x-bind:${e.name}`,value:`"${e.value}"`}:e),t=t.concat(n)}let r={};return t.map(Ot((e,t)=>r[e]=t)).filter(jt).map(Nt(r,n)).sort(It).map(t=>Tt(e,t))}function yt(e){return Array.from(e).map(Ot()).filter(e=>!jt(e))}var bt=!1,xt=new Map,St=Symbol();function Ct(e){bt=!0;let t=Symbol();St=t,xt.set(t,[]);let n=()=>{for(;xt.get(t).length;)xt.get(t).shift()();xt.delete(t)};e(n),bt=!1,n()}function wt(e){let t=[],n=e=>t.push(e),[r,i]=ce(e);return t.push(i),[{Alpine:Cr,effect:r,cleanup:n,evaluateLater:y.bind(y,e),evaluate:et.bind(et,e)},()=>t.forEach(e=>e())]}function Tt(e,t){let n=gt[t.type]||(()=>{}),[r,i]=wt(e);_e(e,t.original,i);let a=()=>{e._x_ignore||e._x_ignoreSelf||(n.inline&&n.inline(e,t,r),n=n.bind(n,e,t,r),bt?xt.get(St).push(n):n())};return a.runCleanups=i,a}var Et=(e,t)=>({name:n,value:r})=>(n.startsWith(e)&&(n=n.replace(e,t)),{name:n,value:r}),Dt=e=>e;function Ot(e=()=>{}){return({name:t,value:n})=>{let{name:r,value:i}=kt.reduce((e,t)=>t(e),{name:t,value:n});return r!==t&&e(r,t),{name:r,value:i}}}var kt=[];function At(e){kt.push(e)}function jt({name:e}){return Mt().test(e)}var Mt=()=>RegExp(`^${pt}([^:^.]+)\\b`);function Nt(e,t){return({name:n,value:r})=>{n===r&&(r=``);let i=n.match(Mt()),a=n.match(/:([a-zA-Z0-9\-_:]+)/),o=n.match(/\.[^.\]]+(?=[^\]]*$)/g)||[],s=t||e[n]||n;return{type:i?i[1]:null,value:a?a[1]:null,modifiers:o.map(e=>e.replace(`.`,``)),expression:r,original:s}}}var Pt=`DEFAULT`,Ft=[`ignore`,`ref`,`id`,`data`,`anchor`,`bind`,`init`,`for`,`model`,`modelable`,`transition`,`show`,`if`,Pt,`teleport`];function It(e,t){let n=Ft.indexOf(e.type)===-1?Pt:e.type,r=Ft.indexOf(t.type)===-1?Pt:t.type;return Ft.indexOf(n)-Ft.indexOf(r)}function Lt(e,t){if(typeof ShadowRoot==`function`&&e instanceof ShadowRoot){Array.from(e.children).forEach(e=>Lt(e,t));return}let n=!1;if(t(e,()=>n=!0),n)return;let r=e.firstElementChild;for(;r;)Lt(r,t,!1),r=r.nextElementSibling}var Rt=!1;function zt(e,t=()=>{}){return(...n)=>Rt?t(...n):e(...n)}function Bt(e){return(...t)=>Rt&&e(...t)}var Vt=[];function Ht(e){Vt.push(e)}function Ut(e,t){Vt.forEach(n=>n(e,t)),Rt=!0,qt(()=>{gn(t,(e,t)=>{t(e,()=>{})})}),Rt=!1}var Wt=!1;function Gt(e,t){t._x_dataStack||=e._x_dataStack,Rt=!0,Wt=!0,qt(()=>{Kt(t)}),Rt=!1,Wt=!1}function Kt(e){let t=!1;gn(e,(e,n)=>{Lt(e,(e,r)=>{if(t&&fn(e))return r();t=!0,n(e,r)})})}function qt(e){let t=_;se((e,n)=>{let r=t(e);return te(r),()=>{}}),e(),se(t)}var Jt=0;function Yt(e,t){let n=e._x_deferInit;n||(n=e._x_deferInit={pending:0,ownsIgnore:!e._x_ignore,queuedAttributes:new Map},n.ownsIgnore&&(e._x_ignore=!0),Jt++),n.pending++,Promise.resolve(t).catch(t=>{try{Je(t,e)}catch(e){setTimeout(()=>{throw e},0)}}).then(()=>Xt(e,n))}function Xt(e,t){t.pending--,!(t.pending>0)&&(Ee(),!(t.pending>0)&&e._x_deferInit===t&&(delete e._x_deferInit,t.ownsIgnore&&delete e._x_ignore,Jt--,e.isConnected&&($t(t),gn(e))))}function Zt(e,t){if(Jt===0)return!1;let n=x(e,e=>e._x_deferInit);return n?(Qt(n._x_deferInit,e,t.map(({name:e})=>e)),!0):!1}function Qt(e,t,n){let r=e.queuedAttributes.get(t);(!r||r.marker!==t._x_marker)&&(r={marker:t._x_marker,names:new Set},e.queuedAttributes.set(t,r)),n.forEach(e=>r.names.add(e))}function $t(e){e.queuedAttributes.forEach((e,t)=>{if(!t.isConnected||!t._x_marker||t._x_marker!==e.marker)return;let n=x(t,e=>e._x_deferInit);if(n){Qt(n._x_deferInit,t,Array.from(e.names));return}let r=Array.from(e.names).filter(e=>t.hasAttribute(e)).map(e=>({name:e,value:t.getAttribute(e)}));r.length!==0&&vt(t,r).forEach(e=>e())})}Ht((e,t)=>{Jt!==0&&e&&e.nodeType===1&&t&&t.nodeType===1&&x(e,e=>e._x_deferInit)&&(t._x_ignore=!0)});function en(e,t,n={},r={}){return e.dispatchEvent(new CustomEvent(t,{detail:n,bubbles:!0,composed:!0,cancelable:!0,...r}))}function tn(e,...t){console.warn(`Alpine Warning: ${e}`,...t)}var nn=!1;function rn(){nn&&tn(`Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems.`),nn=!0,document.body||tn("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"),en(document,`alpine:init`),en(document,`alpine:initializing`),Se(),me(e=>gn(e,Lt)),he(e=>_n(e)),ge((e,t)=>{Zt(e,t)||vt(e,t).forEach(e=>e())}),Array.from(document.querySelectorAll(cn().join(`,`))).filter(e=>!dn(e.parentElement,!0)).forEach(e=>{gn(e)}),en(document,`alpine:initialized`),setTimeout(()=>{vn()})}var an=[],on=[];function sn(){return an.map(e=>e())}function cn(){return an.concat(on).map(e=>e())}function ln(e){an.push(e)}function un(e){on.push(e)}function dn(e,t=!1){return x(e,e=>{if((t?cn():sn()).some(t=>e.matches(t)))return!0})}function x(e,t){if(e){if(t(e))return e;if(e._x_teleportBack)return x(e._x_teleportBack,t);if(e.parentNode instanceof ShadowRoot)return x(e.parentNode.host,t);if(e.parentElement)return x(e.parentElement,t)}}function fn(e){return sn().some(t=>e.matches(t))}var pn=[];function mn(e){pn.push(e)}var hn=1;function gn(e,t=Lt,n=()=>{}){x(e,e=>e._x_ignore)||Ct(()=>{t(e,(e,t)=>{e._x_marker||(n(e,t),pn.forEach(n=>n(e,t)),vt(e,e.attributes).forEach(e=>e()),e._x_ignore||(e._x_marker=hn++),e._x_ignore&&t())})})}function _n(e,t=Lt){t(e,e=>{ye(e),ve(e),delete e._x_marker})}function vn(){[[`ui`,`dialog`,[`[x-dialog], [x-popover]`]],[`anchor`,`anchor`,[`[x-anchor]`]],[`sort`,`sort`,[`[x-sort]`]]].forEach(([e,t,n])=>{_t(t)||n.some(t=>{if(document.querySelector(t))return tn(`found "${t}", but missing ${e} plugin`),!0})})}var yn=[],bn=!1;function xn(e=()=>{}){return queueMicrotask(()=>{bn||setTimeout(()=>{Sn()})}),new Promise(t=>{yn.push(()=>{e(),t()})})}function Sn(){for(bn=!1;yn.length;)yn.shift()()}function Cn(){bn=!0}function wn(e,t){return Array.isArray(t)?En(e,t.join(` `)):typeof t==`object`&&t?Dn(e,t):typeof t==`function`?wn(e,t()):En(e,t)}function Tn(e){return e.split(/\s/).filter(Boolean)}function En(e,t){return t=t===!0?t=``:t||``,(t=>(e.classList.add(...t),()=>{e.classList.remove(...t)}))((t=>Tn(t).filter(t=>!e.classList.contains(t)).filter(Boolean))(t))}function Dn(e,t){let n=Object.entries(t).flatMap(([e,t])=>t?Tn(e):!1).filter(Boolean),r=Object.entries(t).flatMap(([e,t])=>!t&&Tn(e)).filter(Boolean),i=[],a=[];return r.forEach(t=>{e.classList.contains(t)&&(e.classList.remove(t),a.push(t))}),n.forEach(t=>{e.classList.contains(t)||(e.classList.add(t),i.push(t))}),()=>{a.forEach(t=>e.classList.add(t)),i.forEach(t=>e.classList.remove(t))}}function On(e,t){return typeof t==`object`&&t?kn(e,t):An(e,t)}function kn(e,t){let n={};return Object.entries(t).forEach(([t,r])=>{n[t]=e.style[t],t.startsWith(`--`)||(t=jn(t)),e.style.setProperty(t,r)}),setTimeout(()=>{e.style.length===0&&e.removeAttribute(`style`)}),()=>{On(e,n)}}function An(e,t){let n=e.getAttribute(`style`,t);return e.setAttribute(`style`,t),()=>{e.setAttribute(`style`,n||``)}}function jn(e){return e.replace(/([a-z])([A-Z])/g,`$1-$2`).toLowerCase()}function Mn(e,t=()=>{}){let n=!1;return function(){n?t.apply(this,arguments):(n=!0,e.apply(this,arguments))}}b(`transition`,(e,{value:t,modifiers:n,expression:r},{evaluate:i})=>{typeof r==`function`&&(r=i(r)),r!==!1&&(!r||typeof r==`boolean`?Pn(e,n,t):Nn(e,r,t))});function Nn(e,t,n){Fn(e,wn,``),{enter:t=>{e._x_transition.enter.during=t},"enter-start":t=>{e._x_transition.enter.start=t},"enter-end":t=>{e._x_transition.enter.end=t},leave:t=>{e._x_transition.leave.during=t},"leave-start":t=>{e._x_transition.leave.start=t},"leave-end":t=>{e._x_transition.leave.end=t}}[n](t)}function Pn(e,t,n){Fn(e,On);let r=!t.includes(`in`)&&!t.includes(`out`)&&!n,i=r||t.includes(`in`)||[`enter`].includes(n),a=r||t.includes(`out`)||[`leave`].includes(n);t.includes(`in`)&&!r&&(t=t.filter((e,n)=>n<t.indexOf(`out`))),t.includes(`out`)&&!r&&(t=t.filter((e,n)=>n>t.indexOf(`out`)));let o=!t.includes(`opacity`)&&!t.includes(`scale`),s=o||t.includes(`opacity`),c=o||t.includes(`scale`),l=+!s,u=c?zn(t,`scale`,95)/100:1,d=zn(t,`delay`,0)/1e3,f=zn(t,`origin`,`center`),p=`opacity, transform`,m=zn(t,`duration`,150)/1e3,h=zn(t,`duration`,75)/1e3,g=`cubic-bezier(0.4, 0.0, 0.2, 1)`;i&&(e._x_transition.enter.during={transformOrigin:f,transitionDelay:`${d}s`,transitionProperty:p,transitionDuration:`${m}s`,transitionTimingFunction:g},e._x_transition.enter.start={opacity:l,transform:`scale(${u})`},e._x_transition.enter.end={opacity:1,transform:`scale(1)`}),a&&(e._x_transition.leave.during={transformOrigin:f,transitionDelay:`${d}s`,transitionProperty:p,transitionDuration:`${h}s`,transitionTimingFunction:g},e._x_transition.leave.start={opacity:1,transform:`scale(1)`},e._x_transition.leave.end={opacity:l,transform:`scale(${u})`})}function Fn(e,t,n={}){e._x_transition||={enter:{during:n,start:n,end:n},leave:{during:n,start:n,end:n},in(n=()=>{},r=()=>{}){Ln(e,t,{during:this.enter.during,start:this.enter.start,end:this.enter.end},n,r)},out(n=()=>{},r=()=>{}){Ln(e,t,{during:this.leave.during,start:this.leave.start,end:this.leave.end},n,r)}}}window.Element.prototype._x_toggleAndCascadeWithTransitions=function(e,t,n,r){let i=document.visibilityState===`visible`?requestAnimationFrame:setTimeout,a=()=>i(n);t?e._x_transition&&(e._x_transition.enter||e._x_transition.leave)?e._x_transition.enter&&(Object.entries(e._x_transition.enter.during).length||Object.entries(e._x_transition.enter.start).length||Object.entries(e._x_transition.enter.end).length)?e._x_transition.in(n):a():e._x_transition?e._x_transition.in(n):a():(e._x_hidePromise=e._x_transition?new Promise((t,n)=>{e._x_transition.out(()=>{},()=>t(r)),e._x_transitioning&&e._x_transitioning.beforeCancel(()=>n({isFromCancelledTransition:!0}))}):Promise.resolve(r),queueMicrotask(()=>{let t=In(e);t?(t._x_hideChildren||=[],t._x_hideChildren.push(e)):i(()=>{let t=e=>{let n=Promise.all([e._x_hidePromise,...(e._x_hideChildren||[]).map(t)]).then(([e])=>e?.());return delete e._x_hidePromise,delete e._x_hideChildren,n};t(e).catch(e=>{if(!e.isFromCancelledTransition)throw e})})}))};function In(e){let t=e.parentNode;if(t)return t._x_hidePromise?t:In(t)}function Ln(e,t,{during:n,start:r,end:i}={},a=()=>{},o=()=>{}){if(e._x_transitioning&&e._x_transitioning.cancel(),Object.keys(n).length===0&&Object.keys(r).length===0&&Object.keys(i).length===0){a(),o();return}let s,c,l;Rn(e,{start(){s=t(e,r)},during(){c=t(e,n)},before:a,end(){s(),l=t(e,i)},after:o,cleanup(){c(),l()}})}function Rn(e,t){let n,r,i,a=Mn(()=>{v(()=>{n=!0,r||t.before(),i||(t.end(),Sn()),t.after(),e.isConnected&&t.cleanup(),delete e._x_transitioning})});e._x_transitioning={beforeCancels:[],beforeCancel(e){this.beforeCancels.push(e)},cancel:Mn(function(){for(;this.beforeCancels.length;)this.beforeCancels.shift()();a()}),finish:a},v(()=>{t.start(),t.during()}),Cn(),requestAnimationFrame(()=>{if(n)return;let a=Number(getComputedStyle(e).transitionDuration.replace(/,.*/,``).replace(`s`,``))*1e3,o=Number(getComputedStyle(e).transitionDelay.replace(/,.*/,``).replace(`s`,``))*1e3;a===0&&(a=Number(getComputedStyle(e).animationDuration.replace(`s`,``))*1e3),v(()=>{t.before()}),r=!0,requestAnimationFrame(()=>{n||(v(()=>{t.end()}),Sn(),setTimeout(e._x_transitioning.finish,a+o),i=!0)})})}function zn(e,t,n){if(e.indexOf(t)===-1)return n;let r=e[e.indexOf(t)+1];if(!r||t===`scale`&&isNaN(r))return n;if(t===`duration`||t===`delay`){let e=r.match(/([0-9]+)ms/);if(e)return e[1]}return t===`origin`&&[`top`,`right`,`left`,`center`,`bottom`].includes(e[e.indexOf(t)+2])?[r,e[e.indexOf(t)+2]].join(` `):r}function Bn(e,t,n,r=[]){switch(e._x_bindings||=ee({}),e._x_bindings[t]=n,t=r.includes(`camel`)?Yn(t):t,t){case`value`:Vn(e,n);break;case`style`:Un(e,n);break;case`class`:Hn(e,n);break;case`selected`:case`checked`:Wn(e,t,n);break;default:Gn(e,t,n)}}function Vn(e,t){if(or(e))e.attributes.value===void 0&&(e.value=t);else if(ar(e))Number.isInteger(t)?e.value=t:!Array.isArray(t)&&typeof t!=`boolean`&&![null,void 0].includes(t)?e.value=String(t):e.checked=Array.isArray(t)?t.some(t=>Xn(t,e.value)):!!t;else if(e.tagName===`SELECT`)Jn(e,t);else if(e.tagName===`OPTION`)Gn(e,`value`,t);else{if(e.value===t&&(typeof t!=`object`||!t))return;e.value=t===void 0?``:t}}function Hn(e,t){e._x_undoAddedClasses&&e._x_undoAddedClasses(),e._x_undoAddedClasses=wn(e,t)}function Un(e,t){e._x_undoAddedStyles&&e._x_undoAddedStyles(),e._x_undoAddedStyles=On(e,t)}function Wn(e,t,n){Gn(e,t,n),qn(e,t,n)}function Gn(e,t,n){[null,void 0,!1].includes(n)&&er(t)?e.removeAttribute(t):($n(t)&&(n=t),tr(n)&&(n=JSON.stringify(n)),Kn(e,t,n))}function Kn(e,t,n){e.getAttribute(t)!=n&&e.setAttribute(t,n)}function qn(e,t,n){e[t]!==n&&(e[t]=n)}function Jn(e,t){let n=[].concat(t).map(e=>e+``);Array.from(e.options).forEach(e=>{e.selected=n.includes(e.value)})}function Yn(e){return e.toLowerCase().replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function Xn(e,t){return e==t}function Zn(e){return[1,`1`,`true`,`on`,`yes`,!0].includes(e)?!0:[0,`0`,`false`,`off`,`no`,!1].includes(e)?!1:e?!!e:null}var Qn=new Set(`allowfullscreen.async.autofocus.autoplay.checked.controls.default.defer.disabled.formnovalidate.inert.ismap.itemscope.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.selected.shadowrootclonable.shadowrootdelegatesfocus.shadowrootserializable`.split(`.`));function $n(e){return Qn.has(e)}function er(e){return![`aria-pressed`,`aria-checked`,`aria-expanded`,`aria-selected`].includes(e)}function tr(e){return typeof e==`object`&&!!e}function nr(e,t,n){return e._x_bindings&&e._x_bindings[t]!==void 0?e._x_bindings[t]:ir(e,t,n)}function rr(e,t,n,r=!0){if(e._x_bindings&&e._x_bindings[t]!==void 0)return e._x_bindings[t];if(e._x_inlineBindings&&e._x_inlineBindings[t]!==void 0){let n=e._x_inlineBindings[t];return n.extract=r,$e(()=>et(e,n.expression))}return ir(e,t,n)}function ir(e,t,n){let r=e.getAttribute(t);return r===null?typeof n==`function`?n():n:r===``?!0:$n(t)?!![t,`true`].includes(r):r}function ar(e){return e.type===`checkbox`||e.localName===`ui-checkbox`||e.localName===`ui-switch`}function or(e){return e.type===`radio`||e.localName===`ui-radio`}function sr(e,t){let n;return function(){let r=this,i=arguments;clearTimeout(n),n=setTimeout(function(){n=null,e.apply(r,i)},t)}}function cr(e,t){let n;return function(){let r=this,i=arguments;n||(e.apply(r,i),n=!0,setTimeout(()=>n=!1,t))}}function lr({get:e,set:t},{get:n,set:r}){let i=!0,a,o=_(()=>{let o=e(),s=n();if(i)r(ur(o)),i=!1;else{let e=JSON.stringify(o),n=JSON.stringify(s);e===a?e!==n&&t(ur(s)):r(ur(o))}a=JSON.stringify(e()),JSON.stringify(n())});return()=>{te(o)}}function ur(e){return typeof e==`object`?JSON.parse(JSON.stringify(e)):e}function dr(e){(Array.isArray(e)?e:[e]).forEach(e=>e(Cr))}var fr={},pr=!1;function mr(e,t){if(pr||=(fr=ee(fr),!0),t===void 0)return fr[e];fr[e]=t,typeof t==`object`&&t&&t._x_interceptor?fr[e]=t.initialize(fr,e,e,()=>{}):ze(fr[e]),typeof t==`object`&&t&&t.hasOwnProperty(`init`)&&typeof t.init==`function`&&fr[e].init()}function hr(){return fr}var gr={};function _r(e,t){let n=typeof t==`function`?t:()=>t;return e instanceof Element?yr(e,n()):(gr[e]=n,()=>{})}function vr(e){return Object.entries(gr).forEach(([t,n])=>{Object.defineProperty(e,t,{get(){return(...e)=>n(...e)}})}),e}function yr(e,t,n){let r=[];for(;r.length;)r.pop()();let i=Object.entries(t).map(([e,t])=>({name:e,value:t})),a=yt(i);return i=i.map(e=>a.find(t=>t.name===e.name)?{name:`x-bind:${e.name}`,value:`"${e.value}"`}:e),vt(e,i,n).map(e=>{r.push(e.runCleanups),e()}),()=>{for(;r.length;)r.pop()()}}var br={};function xr(e,t){br[e]=t}function Sr(e,t){return Object.entries(br).forEach(([n,r])=>{Object.defineProperty(e,n,{get(){return(...e)=>r.bind(t)(...e)},enumerable:!1})}),e}var Cr={get reactive(){return ee},get release(){return te},get effect(){return _},get raw(){return ne},get transaction(){return ue},version:`3.17.2`,flushAndStopDeferringMutations:Ae,dontAutoEvaluateFunctions:$e,disableEffectScheduling:ae,startObservingMutations:Se,stopObservingMutations:Ce,setReactivityEngine:oe,onAttributeRemoved:_e,onAttributesAdded:ge,closestDataStack:Pe,skipDuringClone:zt,onlyDuringClone:Bt,addRootSelector:ln,addInitSelector:un,setErrorHandler:Xe,interceptClone:Ht,addScopeToNode:Ne,deferMutations:ke,mapAttributes:At,evaluateLater:y,interceptInit:mn,initInterceptors:ze,injectMagics:Ge,setEvaluator:nt,setRawEvaluator:it,mergeProxies:Fe,extractProp:rr,findClosest:x,onElRemoved:he,closestRoot:dn,destroyTree:_n,interceptor:Be,transition:Ln,setStyles:On,mutateDom:v,deferInit:Yt,directive:b,entangle:lr,throttle:cr,debounce:sr,evaluate:et,evaluateRaw:dt,initTree:gn,nextTick:xn,prefixed:mt,prefix:ht,plugin:dr,magic:We,store:mr,start:rn,clone:Gt,cloneNode:Ut,bound:nr,$data:Me,watch:le,walk:Lt,data:xr,bind:_r};function wr(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}Object.freeze({}),Object.freeze([]);var Tr=Object.assign,Er=Object.prototype.hasOwnProperty,Dr=(e,t)=>Er.call(e,t),Or=Array.isArray,kr=e=>Pr(e)===`[object Map]`,Ar=e=>typeof e==`string`,jr=e=>typeof e==`symbol`,Mr=e=>typeof e==`object`&&!!e,Nr=Object.prototype.toString,Pr=e=>Nr.call(e),Fr=e=>Pr(e).slice(8,-1),Ir=e=>Ar(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,Lr=(e=>{let t=Object.create(null);return n=>t[n]||(t[n]=e(n))})(e=>e.charAt(0).toUpperCase()+e.slice(1)),Rr=(e,t)=>!Object.is(e,t);function zr(e,...t){console.warn(`[Vue warn] ${e}`,...t)}var S,Br=new WeakSet,Vr=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Br.has(this)&&(Br.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Gr(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,oi(this),Jr(this);let e=S,t=ni;S=this,ni=!0;try{return this.fn()}finally{S!==this&&zr(`Active effect was not restored correctly - this is likely a Vue internal bug.`),Yr(this),S=e,ni=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Qr(e);this.deps=this.depsTail=void 0,oi(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Br.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Xr(this)&&this.run()}get dirty(){return Xr(this)}},Hr=0,Ur,Wr;function Gr(e,t=!1){e.flags|=8,t?(e.next=Wr,Wr=e):(e.next=Ur,Ur=e)}function Kr(){Hr++}function qr(){if(--Hr>0)return;if(Wr){let e=Wr;for(Wr=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Ur;){let t=Ur;for(Ur=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Jr(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Yr(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Qr(r),$r(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Xr(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Zr(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Zr(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===si)||(e.globalVersion=si,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Xr(e))))return;e.flags|=2;let t=e.dep,n=S,r=ni;S=e,ni=!0;try{Jr(e);let n=e.fn(e._value);(t.version===0||Rr(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{S=n,ni=r,Yr(e),e.flags&=-3}}function Qr(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subsHead===e&&(n.subsHead=i),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Qr(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function $r(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}function ei(e,t){e.effect instanceof Vr&&(e=e.effect.fn);let n=new Vr(e);t&&Tr(n,t);try{n.run()}catch(e){throw n.stop(),e}let r=n.run.bind(n);return r.effect=n,r}function ti(e){e.effect.stop()}var ni=!0,ri=[];function ii(){ri.push(ni),ni=!1}function ai(){let e=ri.pop();ni=e===void 0||e}function oi(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=S;S=void 0;try{t()}finally{S=e}}}var si=0,ci=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},li=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0,this.subsHead=void 0}track(e){if(!S||!ni||S===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==S)t=this.activeLink=new ci(S,this),S.deps?(t.prevDep=S.depsTail,S.depsTail.nextDep=t,S.depsTail=t):S.deps=S.depsTail=t,ui(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=S.depsTail,t.nextDep=void 0,S.depsTail.nextDep=t,S.depsTail=t,S.deps===t&&(S.deps=e)}return S.onTrack&&S.onTrack(Tr({effect:S},e)),t}trigger(e){this.version++,si++,this.notify(e)}notify(e){Kr();try{for(let t=this.subsHead;t;t=t.nextSub)t.sub.onTrigger&&!(t.sub.flags&8)&&t.sub.onTrigger(Tr({effect:t.sub},e));for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{qr()}}};function ui(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)ui(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subsHead===void 0&&(e.dep.subsHead=e),e.dep.subs=e}}var di=new WeakMap,fi=Symbol(`Object iterate`),pi=Symbol(`Map keys iterate`),mi=Symbol(`Array iterate`);function C(e,t,n){if(ni&&S){let r=di.get(e);r||di.set(e,r=new Map);let i=r.get(n);i||(r.set(n,i=new li),i.map=r,i.key=n),i.track({target:e,type:t,key:n})}}function hi(e,t,n,r,i,a){let o=di.get(e);if(!o){si++;return}let s=o=>{o&&o.trigger({target:e,type:t,key:n,newValue:r,oldValue:i,oldTarget:a})};if(Kr(),t===`clear`)o.forEach(s);else{let i=Or(e),a=i&&Ir(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===mi||!jr(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(mi)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(fi)),kr(e)&&s(o.get(pi)));break;case`delete`:i||(s(o.get(fi)),kr(e)&&s(o.get(pi)));break;case`set`:kr(e)&&s(o.get(fi))}}qr()}function gi(e){let t=w(e);return t===e?t:(C(t,`iterate`,mi),$i(e)?t:t.map(ta))}function _i(e){return C(e=w(e),`iterate`,mi),e}function vi(e,t){return Qi(e)?Zi(e)?na(ta(t)):na(t):ta(t)}var yi={__proto__:null,[Symbol.iterator](){return bi(this,Symbol.iterator,e=>vi(this,e))},concat(...e){return gi(this).concat(...e.map(e=>Or(e)?gi(e):e))},entries(){return bi(this,`entries`,e=>(e[1]=vi(this,e[1]),e))},every(e,t){return Si(this,`every`,e,t,void 0,arguments)},filter(e,t){return Si(this,`filter`,e,t,e=>e.map(e=>vi(this,e)),arguments)},find(e,t){return Si(this,`find`,e,t,e=>vi(this,e),arguments)},findIndex(e,t){return Si(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return Si(this,`findLast`,e,t,e=>vi(this,e),arguments)},findLastIndex(e,t){return Si(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return Si(this,`forEach`,e,t,void 0,arguments)},includes(...e){return wi(this,`includes`,e)},indexOf(...e){return wi(this,`indexOf`,e)},join(e){return gi(this).join(e)},lastIndexOf(...e){return wi(this,`lastIndexOf`,e)},map(e,t){return Si(this,`map`,e,t,void 0,arguments)},pop(){return Ti(this,`pop`)},push(...e){return Ti(this,`push`,e)},reduce(e,...t){return Ci(this,`reduce`,e,t)},reduceRight(e,...t){return Ci(this,`reduceRight`,e,t)},shift(){return Ti(this,`shift`)},some(e,t){return Si(this,`some`,e,t,void 0,arguments)},splice(...e){return Ti(this,`splice`,e)},toReversed(){return gi(this).toReversed()},toSorted(e){return gi(this).toSorted(e)},toSpliced(...e){return gi(this).toSpliced(...e)},unshift(...e){return Ti(this,`unshift`,e)},values(){return bi(this,`values`,e=>vi(this,e))}};function bi(e,t,n){let r=_i(e),i=r[t]();return r!==e&&!$i(e)&&(i._next=i.next,i.next=()=>{let e=i._next();return e.done||(e.value=n(e.value)),e}),i}var xi=Array.prototype;function Si(e,t,n,r,i,a){let o=_i(e),s=o!==e&&!$i(e),c=o[t];if(c!==xi[t]){let t=c.apply(e,a);return s?ta(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,vi(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function Ci(e,t,n,r){let i=_i(e),a=i!==e&&!$i(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=vi(e,t)),n.call(this,t,vi(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?vi(e,c):c}function wi(e,t,n){let r=w(e);C(r,`iterate`,mi);let i=r[t](...n);return(i===-1||i===!1)&&ea(n[0])?(n[0]=w(n[0]),r[t](...n)):i}function Ti(e,t,n=[]){ii(),Kr();let r=w(e)[t].apply(e,n);return qr(),ai(),r}var Ei=wr(`__proto__,__v_isRef,__isVue`),Di=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(jr));function Oi(e){jr(e)||(e=String(e));let t=w(this);return C(t,`has`,e),t.hasOwnProperty(e)}var ki=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Ki:Gi:i?Wi:Ui).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=Or(e);if(!r){let e;if(a&&(e=yi[t]))return e;if(t===`hasOwnProperty`)return Oi}let o=Reflect.get(e,t,ra(e)?e:n);if((jr(t)?Di.has(t):Ei(t))||(r||C(e,`get`,t),i))return o;if(ra(o)){let e=a&&Ir(t)?o:o.value;return r&&Mr(e)?Yi(e):e}return Mr(o)?r?Yi(o):Ji(o):o}},Ai=class extends ki{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=Or(e)&&Ir(t);if(!this._isShallow){let r=Qi(i);if(!$i(n)&&!Qi(n)&&(i=w(i),n=w(n)),!a&&ra(i)&&!ra(n))return r?(zr(`Set operation on key "${String(t)}" failed: target is readonly.`,e[t]),!0):(i.value=n,!0)}let o=a?Number(t)<e.length:Dr(e,t),s=Reflect.set(e,t,n,ra(e)?e:r);return e===w(r)&&s&&(o?Rr(n,i)&&hi(e,`set`,t,n,i):hi(e,`add`,t,n)),s}deleteProperty(e,t){let n=Dr(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&hi(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!jr(t)||!Di.has(t))&&C(e,`has`,t),n}ownKeys(e){return C(e,`iterate`,Or(e)?`length`:fi),Reflect.ownKeys(e)}},ji=class extends ki{constructor(e=!1){super(!0,e)}set(e,t){return zr(`Set operation on key "${String(t)}" failed: target is readonly.`,e),!0}deleteProperty(e,t){return zr(`Delete operation on key "${String(t)}" failed: target is readonly.`,e),!0}},Mi=new Ai,Ni=new ji,Pi=e=>e,Fi=e=>Reflect.getPrototypeOf(e);function Ii(e,t,n){return function(...r){let i=this.__v_raw,a=w(i),o=kr(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?Pi:t?na:ta;return!t&&C(a,`iterate`,c?pi:fi),Tr(Object.create(l),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}}})}}function Li(e){return function(...t){{let n=t[0]?`on key "${t[0]}" `:``;zr(`${Lr(e)} operation ${n}failed: target is readonly.`,w(this))}return e===`delete`?!1:e===`clear`?void 0:this}}function Ri(e,t){let n={get(n){let r=this.__v_raw,i=w(r),a=w(n);e||(Rr(n,a)&&C(i,`get`,n),C(i,`get`,a));let{has:o}=Fi(i),s=t?Pi:e?na:ta;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&C(w(t),`iterate`,fi),t.size},has(t){let n=this.__v_raw,r=w(n),i=w(t);return e||(Rr(t,i)&&C(r,`has`,t),C(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=w(a),s=t?Pi:e?na:ta;return!e&&C(o,`iterate`,fi),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return Tr(n,e?{add:Li(`add`),set:Li(`set`),delete:Li(`delete`),clear:Li(`clear`)}:{add(e){let n=w(this),r=Fi(n),i=w(e),a=!t&&!$i(e)&&!Qi(e)?i:e;return r.has.call(n,a)||Rr(e,a)&&r.has.call(n,e)||Rr(i,a)&&r.has.call(n,i)||(n.add(a),hi(n,`add`,a,a)),this},set(e,n){!t&&!$i(n)&&!Qi(n)&&(n=w(n));let r=w(this),{has:i,get:a}=Fi(r),o=i.call(r,e);o?Hi(r,i,e):(e=w(e),o=i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?Rr(n,s)&&hi(r,`set`,e,n,s):hi(r,`add`,e,n),this},delete(e){let t=w(this),{has:n,get:r}=Fi(t),i=n.call(t,e);i?Hi(t,n,e):(e=w(e),i=n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&hi(t,`delete`,e,void 0,a),o},clear(){let e=w(this),t=e.size!==0,n=kr(e)?new Map(e):new Set(e),r=e.clear();return t&&hi(e,`clear`,void 0,void 0,n),r}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=Ii(r,e,t)}),n}function zi(e,t){let n=Ri(e,t);return(t,r,i)=>r===`__v_isReactive`?!e:r===`__v_isReadonly`?e:r===`__v_raw`?t:Reflect.get(Dr(n,r)&&r in t?n:t,r,i)}var Bi={get:zi(!1,!1)},Vi={get:zi(!0,!1)};function Hi(e,t,n){let r=w(n);if(r!==n&&t.call(e,r)){let t=Fr(e);zr(`Reactive ${t} contains both the raw and reactive versions of the same object${t===`Map`?` as keys`:``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)}}var Ui=new WeakMap,Wi=new WeakMap,Gi=new WeakMap,Ki=new WeakMap;function qi(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function Ji(e){return Qi(e)?e:Xi(e,!1,Mi,Bi,Ui)}function Yi(e){return Xi(e,!0,Ni,Vi,Gi)}function Xi(e,t,n,r,i){if(!Mr(e))return zr(`value cannot be made ${t?`readonly`:`reactive`}: ${String(e)}`),e;if(e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=qi(Fr(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function Zi(e){return Qi(e)?Zi(e.__v_raw):!!(e&&e.__v_isReactive)}function Qi(e){return!!(e&&e.__v_isReadonly)}function $i(e){return!!(e&&e.__v_isShallow)}function ea(e){return e?!!e.__v_raw:!1}function w(e){let t=e&&e.__v_raw;return t?w(t):e}var ta=e=>Mr(e)?Ji(e):e,na=e=>Mr(e)?Yi(e):e;function ra(e){return e?e.__v_isRef===!0:!1}We(`nextTick`,()=>xn),We(`dispatch`,e=>en.bind(en,e)),We(`watch`,(e,{evaluateLater:t,cleanup:n})=>(e,r)=>{let i=t(e);n(le(()=>{let e;return i(t=>e=t),e},r))}),We(`store`,hr),We(`data`,e=>Me(e)),We(`root`,e=>dn(e)),We(`refs`,e=>(e._x_refs_proxy||=Fe(ia(e)),e._x_refs_proxy));function ia(e){let t=[];return x(e,e=>{e._x_refs&&t.push(e._x_refs)}),t}var aa={};function oa(e){return aa[e]||(aa[e]=0),++aa[e]}function sa(e,t){return x(e,e=>{if(e._x_ids&&e._x_ids[t])return!0})}function ca(e,t){e._x_ids||={},e._x_ids[t]||(e._x_ids[t]=oa(t))}We(`id`,(e,{cleanup:t})=>(n,r=null)=>la(e,`${n}${r?`-${r}`:``}`,t,()=>{let t=sa(e,n),i=t?t._x_ids[n]:oa(n);return r?`${n}-${i}-${r}`:`${n}-${i}`})),Ht((e,t)=>{e._x_id&&(t._x_id=e._x_id)});function la(e,t,n,r){if(e._x_id||={},e._x_id[t])return e._x_id[t];let i=r();return e._x_id[t]=i,n(()=>{delete e._x_id[t]}),i}We(`el`,e=>e),ua(`Focus`,`focus`,`focus`),ua(`Persist`,`persist`,`persist`);function ua(e,t,n){We(t,r=>tn(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`,r))}b(`modelable`,(e,{expression:t},{effect:n,evaluateLater:r,cleanup:i})=>{let a=r(t),o=()=>{let e;return a(t=>e=t),e},s=r(`${t} = __placeholder`),c=e=>s(()=>{},{scope:{__placeholder:e}});c(o()),queueMicrotask(()=>{if(!e._x_model)return;e._x_removeModelListeners.default();let t=e._x_model.get,n=e._x_model.setWithModifiers;i(lr({get(){return t()},set(e){n(e)}},{get(){return o()},set(e){c(e)}}))})}),b(`teleport`,(e,{modifiers:t,expression:n},{cleanup:r})=>{e.tagName.toLowerCase()!==`template`&&tn(`x-teleport can only be used on a <template> tag`,e);let i=fa(n),a=e.content.cloneNode(!0).firstElementChild;e._x_teleport=a,a._x_teleportBack=e,e.setAttribute(`data-teleport-template`,!0),a.setAttribute(`data-teleport-target`,!0),e._x_forwardEvents&&e._x_forwardEvents.forEach(t=>{a.addEventListener(t,t=>{t.stopPropagation(),e.dispatchEvent(new t.constructor(t.type,t))})}),Ne(a,{},e);let o=(e,t,n)=>{n.includes(`prepend`)?t.parentNode.insertBefore(e,t):n.includes(`append`)?t.parentNode.insertBefore(e,t.nextSibling):t.appendChild(e)};v(()=>{zt(()=>{o(a,i,t),gn(a)})()}),e._x_teleportPutBack=()=>{let r=fa(n);v(()=>{o(e._x_teleport,r,t)})},r(()=>v(()=>{a.remove(),_n(a)}))});var da=document.createElement(`div`);function fa(e){let t=zt(()=>document.querySelector(e),()=>da)();return t||tn(`Cannot find x-teleport element for selector: "${e}"`),t}var pa=()=>{};pa.inline=(e,{modifiers:t},{cleanup:n})=>{t.includes(`self`)?e._x_ignoreSelf=!0:e._x_ignore=!0,n(()=>{t.includes(`self`)?delete e._x_ignoreSelf:delete e._x_ignore})},b(`ignore`,pa),b(`effect`,zt((e,{expression:t},{effect:n})=>{n(y(e,t))}));function ma(e,t,n,r){let i=e,a=e=>r(e),o={},s=(e,t)=>n=>t(e,n);return n.includes(`dot`)&&(t=ga(t)),n.includes(`camel`)&&(t=_a(t)),n.includes(`capture`)&&(o.capture=!0),n.includes(`window`)&&(i=window),n.includes(`document`)&&(i=document),n.includes(`passive`)&&(o.passive=n[n.indexOf(`passive`)+1]!==`false`),a=ha(n,a),n.includes(`prevent`)&&(a=s(a,(e,t)=>{t.preventDefault(),e(t)})),n.includes(`stop`)&&(a=s(a,(e,t)=>{t.stopPropagation(),e(t)})),n.includes(`once`)&&(a=s(a,(e,n)=>{e(n),i.removeEventListener(t,a,o)})),(n.includes(`away`)||n.includes(`outside`))&&(i=document,a=s(a,(t,n)=>{e.contains(n.target)||n.target.isConnected!==!1&&(e.offsetWidth<1&&e.offsetHeight<1||e._x_isShown!==!1&&t(n))})),n.includes(`self`)&&(a=s(a,(t,n)=>{n.target===e&&t(n)})),t===`submit`&&(a=s(a,(e,t)=>{t.target._x_pendingModelUpdates&&t.target._x_pendingModelUpdates.forEach(e=>e()),e(t)})),(ba(t)||xa(t))&&(a=s(a,(e,t)=>{Sa(t,n)||e(t)})),i.addEventListener(t,a,o),()=>{i.removeEventListener(t,a,o)}}function ha(e,t){if(e.includes(`debounce`)){let n=e[e.indexOf(`debounce`)+1]||`invalid-wait`,r=va(n.split(`ms`)[0])?Number(n.split(`ms`)[0]):250;t=sr(t,r)}if(e.includes(`throttle`)){let n=e[e.indexOf(`throttle`)+1]||`invalid-wait`,r=va(n.split(`ms`)[0])?Number(n.split(`ms`)[0]):250;t=cr(t,r)}return t}function ga(e){return e.replace(/-/g,`.`)}function _a(e){return e.toLowerCase().replace(/-(\w)/g,(e,t)=>t.toUpperCase())}function va(e){return!Array.isArray(e)&&!isNaN(e)}function ya(e){return[` `,`_`].includes(e)?e:e.replace(/([a-z])([A-Z])/g,`$1-$2`).replace(/[_\s]/,`-`).toLowerCase()}function ba(e){return[`keydown`,`keyup`].includes(e)}function xa(e){return[`contextmenu`,`click`,`mouse`].some(t=>e.includes(t))}function Sa(e,t){let n=t.filter(e=>![`window`,`document`,`prevent`,`stop`,`once`,`capture`,`self`,`away`,`outside`,`passive`,`preserve-scroll`,`blur`,`change`,`lazy`].includes(e));if(n.includes(`debounce`)){let e=n.indexOf(`debounce`);n.splice(e,va((n[e+1]||`invalid-wait`).split(`ms`)[0])?2:1)}if(n.includes(`throttle`)){let e=n.indexOf(`throttle`);n.splice(e,va((n[e+1]||`invalid-wait`).split(`ms`)[0])?2:1)}if(n.length===0||n.length===1&&Ca(e.key).includes(n[0]))return!1;let r=[`ctrl`,`shift`,`alt`,`meta`,`cmd`,`super`].filter(e=>n.includes(e));return n=n.filter(e=>!r.includes(e)),!(r.length>0&&r.filter(t=>((t===`cmd`||t===`super`)&&(t=`meta`),e[`${t}Key`])).length===r.length&&(xa(e.type)||Ca(e.key).includes(n[0])))}function Ca(e){if(!e)return[];e=ya(e);let t={ctrl:`control`,slash:`/`,space:` `,spacebar:` `,cmd:`meta`,esc:`escape`,up:`arrow-up`,down:`arrow-down`,left:`arrow-left`,right:`arrow-right`,period:`.`,comma:`,`,equal:`=`,minus:`-`,underscore:`_`};return t[e]=e,Object.keys(t).map(n=>{if(t[n]===e)return n}).filter(e=>e)}b(`model`,(e,{modifiers:t,expression:n},{effect:r,cleanup:i})=>{let a=e;t.includes(`parent`)&&(a=x(e,t=>t!==e));let o=y(a,n),s;s=typeof n==`string`?y(a,`${n} = __placeholder`):typeof n==`function`&&typeof n()==`string`?y(a,`${n()} = __placeholder`):()=>{};let c=()=>{let e;return o(t=>e=t),Oa(e)?e.get():e},l=e=>{let t;o(e=>t=e),Oa(t)?t.set(e):s(()=>{},{scope:{__placeholder:e}})};typeof n==`string`&&e.type===`radio`&&v(()=>{e.hasAttribute(`name`)||e.setAttribute(`name`,n)});let u=t.includes(`change`)||t.includes(`lazy`),d=t.includes(`blur`),f=t.includes(`enter`),p=u||d||f,m;if(Rt)m=()=>{};else if(p){let n=[],r=n=>l(wa(e,t,n,c()));if(u&&n.push(ma(e,`change`,t,r)),d&&(n.push(ma(e,`blur`,t,r)),e.form)){let t=e.form,n=()=>r({target:e});t._x_pendingModelUpdates||=[],t._x_pendingModelUpdates.push(n),i(()=>{t._x_pendingModelUpdates&&t._x_pendingModelUpdates.splice(t._x_pendingModelUpdates.indexOf(n),1)})}f&&n.push(ma(e,`keydown`,t,e=>{e.key===`Enter`&&r(e)})),m=()=>n.forEach(e=>e())}else m=ma(e,e.tagName.toLowerCase()===`select`||[`checkbox`,`radio`].includes(e.type)?`change`:`input`,t,n=>{l(wa(e,t,n,c()))});if(t.includes(`fill`)&&([void 0,null,``].includes(c())||ar(e)&&Array.isArray(c())||e.tagName.toLowerCase()===`select`&&e.multiple)&&l(wa(e,t,{target:e},c())),e._x_removeModelListeners||={},e._x_removeModelListeners.default=m,i(()=>e._x_removeModelListeners.default()),e.form){let n=ma(e.form,`reset`,[],n=>{xn(()=>e._x_model&&e._x_model.set(wa(e,t,{target:e},c())))});i(()=>n())}if(e._x_model={get(){return c()},set(e){l(e)},setWithModifiers:ha(t,l)},e._x_forceModelUpdate=t=>{t===void 0&&typeof n==`string`&&n.match(/\./)&&(t=``),v(()=>{ar(e)?e.checked=Array.isArray(t)?t.some(t=>t==e.value):!!t:or(e)?e.checked=typeof t==`boolean`?Zn(e.value)===t:e.value==t:Bn(e,`value`,t)})},e.tagName===`SELECT`){let t=new MutationObserver(()=>{e._x_forceModelUpdate(c())});t.observe(e,{childList:!0}),i(()=>t.disconnect())}r(()=>{let n=c();t.includes(`unintrusive`)&&document.activeElement.isSameNode(e)||e._x_forceModelUpdate(n)})});function wa(e,t,n,r){return v(()=>{if(n instanceof CustomEvent&&n.detail!==void 0)return n.detail!==null&&n.detail!==void 0?n.detail:n.target.value;if(ar(e)){if(Array.isArray(r)){let e=null;return e=t.includes(`number`)?Ta(n.target.value):t.includes(`boolean`)?Zn(n.target.value):n.target.value,n.target.checked?r.includes(e)?r:r.concat([e]):r.filter(t=>!Ea(t,e))}return n.target.checked}if(e.tagName.toLowerCase()===`select`&&e.multiple)return t.includes(`number`)?Array.from(n.target.selectedOptions).map(e=>Ta(e.value||e.text)):t.includes(`boolean`)?Array.from(n.target.selectedOptions).map(e=>Zn(e.value||e.text)):Array.from(n.target.selectedOptions).map(e=>e.value||e.text);{let i;return i=or(e)?n.target.checked?n.target.value:r:n.target.value,t.includes(`number`)?Ta(i):t.includes(`boolean`)?Zn(i):t.includes(`trim`)?i.trim():i}})}function Ta(e){let t=e?parseFloat(e):null;return Da(t)?t:e}function Ea(e,t){return e==t}function Da(e){return!Array.isArray(e)&&!isNaN(e)}function Oa(e){return typeof e==`object`&&!!e&&typeof e.get==`function`&&typeof e.set==`function`}b(`cloak`,e=>queueMicrotask(()=>v(()=>e.removeAttribute(mt(`cloak`))))),un(()=>`[${mt(`init`)}]`),b(`init`,zt((e,{expression:t},{evaluate:n})=>typeof t==`string`?!!t.trim()&&n(t,{},!1):n(t,{},!1))),b(`text`,(e,{expression:t},{effect:n,evaluateLater:r})=>{let i=r(t);n(()=>{i(t=>{v(()=>{e.textContent=t})})})}),b(`html`,(e,{expression:t},{effect:n,evaluateLater:r})=>{let i=r(t);n(()=>{i(t=>{v(()=>{Array.from(e.children).forEach(e=>_n(e)),e.innerHTML=t??``,e._x_ignoreSelf=!0,gn(e),delete e._x_ignoreSelf})})},{priority:`structural`})}),At(Et(`:`,Dt(mt(`bind:`))));var ka=(e,{value:t,modifiers:n,expression:r,original:i},{effect:a,cleanup:o})=>{if(!t){let t={};vr(t),y(e,r)(t=>{yr(e,t,i)},{scope:t});return}if(t===`key`)return Aa(e,r);if(e._x_inlineBindings&&e._x_inlineBindings[t]&&e._x_inlineBindings[t].extract)return;let s=y(e,r);a(()=>s(i=>{i===void 0&&typeof r==`string`&&r.match(/\./)&&(i=``),v(()=>Bn(e,t,i,n))})),o(()=>{e._x_undoAddedClasses&&e._x_undoAddedClasses(),e._x_undoAddedStyles&&e._x_undoAddedStyles()})};ka.inline=(e,{value:t,modifiers:n,expression:r})=>{t&&(e._x_inlineBindings||={},e._x_inlineBindings[t]={expression:r,extract:!1})},b(`bind`,ka);function Aa(e,t){e._x_keyExpression=t}ln(()=>`[${mt(`data`)}]`);var ja=Symbol();b(`data`,(e,{expression:t},{cleanup:n})=>{if(Na(e))return;let r=e[ja];if(r?.expression===t)return;t=t===``?`{}`:t;let i={};Ge(i,e);let a={};Sr(a,i);let o=et(e,t,{scope:a});(o===void 0||o===!0)&&(o={}),Ge(o,e);let s;if(r?.reactiveData){s=r.reactiveData,Ma(s,o);let n={expression:t};e[ja]=n,queueMicrotask(()=>{e[ja]===n&&delete e[ja]})}else s=ee(o);ze(s,n);let c=Ne(e,s);s.init&&et(e,s.init),n(()=>{s.destroy&&et(e,s.destroy),c();let t={reactiveData:s};e[ja]=t,queueMicrotask(()=>{e[ja]===t&&delete e[ja]})})});function Ma(e,t){Object.keys(t).forEach(n=>{let r=Object.getOwnPropertyDescriptor(t,n),i=Object.getOwnPropertyDescriptor(e,n);r.get||r.set||i?.get||i?.set?(i&&delete e[n],i||(e[n]=void 0),r.get||r.set?Object.defineProperty(e,n,r):e[n]=t[n]):e[n]=t[n]}),Object.keys(e).filter(e=>!Object.prototype.hasOwnProperty.call(t,e)).forEach(t=>delete e[t])}Ht((e,t)=>{e._x_dataStack&&(t._x_dataStack=e._x_dataStack,t.setAttribute(`data-has-alpine-state`,!0))});function Na(e){return Rt?Wt?!0:e.hasAttribute(`data-has-alpine-state`):!1}b(`show`,(e,{modifiers:t,expression:n},{effect:r})=>{let i=y(e,n);e._x_doHide||=()=>{v(()=>{e.style.setProperty(`display`,`none`,t.includes(`important`)?`important`:void 0)})},e._x_doShow||=()=>{v(()=>{e.style.length===1&&e.style.display===`none`?e.removeAttribute(`style`):e.style.removeProperty(`display`)})};let a=()=>{e._x_doHide(),e._x_isShown=!1},o=()=>{e._x_doShow(),e._x_isShown=!0},s=()=>setTimeout(o),c=Mn(e=>e?o():a(),t=>{typeof e._x_toggleAndCascadeWithTransitions==`function`?e._x_toggleAndCascadeWithTransitions(e,t,o,a):t?s():a()}),l,u=!0;r(()=>i(e=>{(u||e!==l)&&(t.includes(`immediate`)&&(e?s():a()),c(e),l=e,u=!1)}))}),b(`for`,zt((e,{expression:t},{effect:n,cleanup:r})=>{let i=Ia(t),a=y(e,i.items),o=y(e,e._x_keyExpression||`index`);e._x_lookup=new Map,n(()=>Fa(e,i,a,o),{priority:`structural`}),r(()=>{e._x_lookup.forEach(e=>v(()=>{_n(e),e.remove()})),delete e._x_lookup,delete e._x_lastRenderedEl})}));function Pa(e){return t=>{Object.entries(t).forEach(([t,n])=>{e[t]=n})}}function Fa(e,t,n,r){n(n=>{Ra(n)&&(n=Array.from({length:n},(e,t)=>t+1)),n??=[],n instanceof Set&&(n=Array.from(n)),n instanceof Map&&(n=Array.from(n));let i=e._x_lookup,a=new Map;e._x_lookup=a;let o=za(n),s=Object.entries(n).map(([s,c])=>{o||(s=parseInt(s));let l=La(t,c,s,n),u;return r(t=>{typeof t==`object`&&tn(`x-for key cannot be an object, it must be a string or an integer`,e),i.has(t)&&(a.set(t,i.get(t)),i.delete(t)),u=t},{scope:{index:s,...l}}),[u,l]});v(()=>{i.forEach(e=>{_n(e),e.remove()});let t=new Set,n=e;s.forEach(([r,i])=>{if(a.has(r)){let e=a.get(r);e._x_refreshXForScope(i),n.nextElementSibling!==e&&(n.nextElementSibling&&e.replaceWith(n.nextElementSibling),n.after(e)),n=e,e._x_currentIfEl&&(e.nextElementSibling!==e._x_currentIfEl&&n.after(e._x_currentIfEl),n=e._x_currentIfEl);return}e.content.children.length>1&&tn(`x-for templates require a single root element, additional elements will be ignored.`,e);let o=document.importNode(e.content,!0).firstElementChild,s=ee(i);Ne(o,s,e),o._x_refreshXForScope=Pa(s),a.set(r,o),t.add(o),n.after(o),n=o}),t.forEach(e=>gn(e)),n===e?delete e._x_lastRenderedEl:e._x_lastRenderedEl=n})})}function Ia(e){let t=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,n=/^\s*\(|\)\s*$/g,r=e.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);if(!r)return;let i={};i.items=r[2].trim();let a=r[1].replace(n,``).trim(),o=a.match(t);return o?(i.item=a.replace(t,``).trim(),i.index=o[1].trim(),o[2]&&(i.collection=o[2].trim())):i.item=a,i}function La(e,t,n,r){let i={};return/^\[.*\]$/.test(e.item)&&Array.isArray(t)?e.item.replace(`[`,``).replace(`]`,``).split(`,`).map(e=>e.trim()).forEach((e,n)=>{i[e]=t[n]}):/^\{.*\}$/.test(e.item)&&!Array.isArray(t)&&typeof t==`object`?e.item.replace(`{`,``).replace(`}`,``).split(`,`).map(e=>e.trim()).forEach(e=>{i[e]=t[e]}):i[e.item]=t,e.index&&(i[e.index]=n),e.collection&&(i[e.collection]=r),i}function Ra(e){return typeof e!=`object`&&!isNaN(e)}function za(e){return typeof e==`object`&&!Array.isArray(e)}function Ba(){}Ba.inline=(e,{expression:t},{cleanup:n})=>{let r=dn(e);r&&(r._x_refs||={},r._x_refs[t]=e,n(()=>delete r._x_refs[t]))},b(`ref`,Ba),b(`if`,zt((e,{expression:t},{effect:n,cleanup:r})=>{e.tagName.toLowerCase()!==`template`&&tn(`x-if can only be used on a <template> tag`,e);let i=y(e,t),a=()=>{if(e._x_currentIfEl)return e._x_currentIfEl;let t=e.content.cloneNode(!0).firstElementChild;return Ne(t,{},e),v(()=>{e.after(t),gn(t)}),e._x_currentIfEl=t,e._x_lastRenderedEl=t,e._x_undoIf=()=>{v(()=>{_n(t),t.remove()}),delete e._x_currentIfEl,delete e._x_lastRenderedEl},t},o=()=>{e._x_undoIf&&(e._x_undoIf(),delete e._x_undoIf)};n(()=>i(e=>{e?a():o()}),{priority:`structural`}),r(()=>e._x_undoIf&&e._x_undoIf())})),b(`id`,(e,{expression:t},{evaluate:n})=>{n(t).forEach(t=>ca(e,t))}),Ht((e,t)=>{e._x_ids&&(t._x_ids=e._x_ids)}),At(Et(`@`,Dt(mt(`on:`)))),b(`on`,zt((e,{value:t,modifiers:n,expression:r},{cleanup:i})=>{let a=r?y(e,r):()=>{};e.tagName.toLowerCase()===`template`&&(e._x_forwardEvents||=[],e._x_forwardEvents.includes(t)||e._x_forwardEvents.push(t));let o=ma(e,t,n,e=>{a(()=>{},{scope:{$event:e},params:[e]})});i(()=>o())})),Va(`Collapse`,`collapse`,`collapse`),Va(`Intersect`,`intersect`,`intersect`),Va(`Focus`,`trap`,`focus`),Va(`Mask`,`mask`,`mask`);function Va(e,t,n){b(t,r=>tn(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`,r))}Cr.setEvaluator(at),Cr.setRawEvaluator(ft),Cr.setReactivityEngine({reactive:Ji,effect:(e,t={})=>{let n;return n=ei(e,{scheduler:()=>{n&&(t.scheduler?t.scheduler(n):n())}}),n},release:ti,raw:w});var T=Cr,Ha=window.GTS_CONFIG||{},Ua={appName:`GTS - Grupo de Seguridad Tecnológica AIFA`,timezone:`America/Mexico_City`,locale:`es-MX`,supabaseUrl:Ha.supabaseUrl||``,supabaseAnonKey:Ha.supabaseAnonKey||``,authEmailDomain:`gts.local`,evidenceBucket:`evidencias`},Wa=()=>!!(Ua.supabaseUrl&&Ua.supabaseAnonKey),Ga=Symbol.for(`@supabase/supabase-js.traceContextExtractor`);function Ka(){return globalThis[Ga]}function qa(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(e!=null&&typeof Object.getOwnPropertySymbols==`function`)for(var i=0,r=Object.getOwnPropertySymbols(e);i<r.length;i++)t.indexOf(r[i])<0&&Object.prototype.propertyIsEnumerable.call(e,r[i])&&(n[r[i]]=e[r[i]]);return n}function Ja(e,t,n,r){function i(e){return e instanceof n?e:new n(function(t){t(e)})}return new(n||=Promise)(function(n,a){function o(e){try{c(r.next(e))}catch(e){a(e)}}function s(e){try{c(r.throw(e))}catch(e){a(e)}}function c(e){e.done?n(e.value):i(e.value).then(o,s)}c((r=r.apply(e,t||[])).next())})}var Ya=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Xa=class extends Error{constructor(e,t=`FunctionsError`,n){super(e),this.name=t,this.context=n}toJSON(){return{name:this.name,message:this.message,context:this.context}}},Za=class extends Xa{constructor(e){super(`Failed to send a request to the Edge Function`,`FunctionsFetchError`,e)}},Qa=class extends Xa{constructor(e){super(`Relay Error invoking the Edge Function`,`FunctionsRelayError`,e)}},$a=class extends Xa{constructor(e){super(`Edge Function returned a non-2xx status code`,`FunctionsHttpError`,e)}},eo;(function(e){e.Any=`any`,e.ApNortheast1=`ap-northeast-1`,e.ApNortheast2=`ap-northeast-2`,e.ApSouth1=`ap-south-1`,e.ApSoutheast1=`ap-southeast-1`,e.ApSoutheast2=`ap-southeast-2`,e.CaCentral1=`ca-central-1`,e.EuCentral1=`eu-central-1`,e.EuWest1=`eu-west-1`,e.EuWest2=`eu-west-2`,e.EuWest3=`eu-west-3`,e.SaEast1=`sa-east-1`,e.UsEast1=`us-east-1`,e.UsWest1=`us-west-1`,e.UsWest2=`us-west-2`})(eo||={});var to=class{constructor(e,{headers:t={},customFetch:n,region:r=eo.Any}={}){this.url=e,this.headers=t,this.region=r,this.fetch=Ya(n)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return Ja(this,arguments,void 0,function*(e,t={}){var n;let r,i,a;try{let{headers:n,method:o,body:s,signal:c,timeout:l}=t,u={},{region:d}=t;d||=this.region;let f=new URL(`${this.url}/${e}`);d&&d!==`any`&&(u[`x-region`]=d,f.searchParams.set(`forceFunctionRegion`,d));let p,m=!!n&&Object.keys(n).some(e=>e.toLowerCase()===`content-type`);s&&!m?typeof Blob<`u`&&s instanceof Blob||s instanceof ArrayBuffer?(u[`Content-Type`]=`application/octet-stream`,p=s):typeof s==`string`?(u[`Content-Type`]=`text/plain`,p=s):typeof FormData<`u`&&s instanceof FormData?p=s:(u[`Content-Type`]=`application/json`,p=JSON.stringify(s)):p=s&&typeof s!=`string`&&!(typeof Blob<`u`&&s instanceof Blob)&&!(s instanceof ArrayBuffer)&&!(typeof FormData<`u`&&s instanceof FormData)?JSON.stringify(s):s;let h=c;l&&(i=new AbortController,r=setTimeout(()=>i.abort(),l),c?(h=i.signal,a=()=>i.abort(),c.addEventListener(`abort`,a)):h=i.signal);let g=yield this.fetch(f.toString(),{method:o||`POST`,headers:Object.assign(Object.assign(Object.assign({},u),this.headers),n),body:p,signal:h}).catch(e=>{throw new Za(e)}),ee=g.headers.get(`x-relay-error`);if(ee&&ee===`true`)throw new Qa(g);if(!g.ok)throw new $a(g);let _=(g.headers.get(`Content-Type`)??`text/plain`).split(`;`)[0].trim().toLowerCase(),te;return te=_===`application/json`?yield g.json():_===`application/octet-stream`||_===`application/pdf`?yield g.blob():_===`text/event-stream`?g:_===`multipart/form-data`?yield g.formData():yield g.text(),{data:te,error:null,response:g}}catch(e){return{data:null,error:e,response:e instanceof $a||e instanceof Qa?e.context:void 0}}finally{r&&clearTimeout(r),a&&((n=t.signal)==null||n.removeEventListener(`abort`,a))}})}},no=class extends Error{constructor(e){super(e.message),this.name=`PostgrestError`,this.details=e.details,this.hint=e.hint,this.code=e.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}},ro=3,io=e=>Math.min(1e3*2**e,3e4),ao=[520,503],oo=[`GET`,`HEAD`,`OPTIONS`];function so(e){"@babel/helpers - typeof";return so=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},so(e)}function co(e,t){if(so(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(so(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function lo(e){var t=co(e,`string`);return so(t)==`symbol`?t:t+``}function uo(e,t,n){return(t=lo(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function fo(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function po(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?fo(Object(n),!0).forEach(function(t){uo(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):fo(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function mo(e,t){return new Promise(n=>{if(t?.aborted){n();return}let r=setTimeout(()=>{t?.removeEventListener(`abort`,i),n()},e);function i(){clearTimeout(r),n()}t?.addEventListener(`abort`,i)})}function ho(e,t,n,r){return!(!r||n>=ro||!oo.includes(e)||!ao.includes(t))}async function go(e,t,n,r){let i=0;for(;;){let a=po({},n.headers);i>0&&(a[`X-Retry-Count`]=String(i));let o;try{o=await e(t,{method:n.method,headers:a,body:n.body,signal:n.signal})}catch(e){if(e?.name===`AbortError`||e?.code===`ABORT_ERR`||!oo.includes(n.method))throw e;if(r&&i<ro){let e=io(i);i++,await mo(e,n.signal);continue}throw e}if(ho(n.method,o.status,i,r)){let e=o.headers?.get(`Retry-After`)??null,t=e===null?io(i):Math.max(0,parseInt(e,10)||0)*1e3;await o.text(),i++,await mo(t,n.signal)}else return o}}var _o=class{constructor(e){this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=e.shouldThrowOnError??!1,this.signal=e.signal,this.isMaybeSingle=e.isMaybeSingle??!1,this.shouldStripNulls=e.shouldStripNulls??!1,this.urlLengthLimit=e.urlLengthLimit??8e3,this.retryEnabled=e.retry??!0,this.fetch=e.fetch?e.fetch:fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get(`Accept`)===`text/csv`)throw Error(`stripNulls() cannot be used with csv()`);return this.shouldStripNulls=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}retry(e){return this.retryEnabled=e,this}then(e,t){var n=this;if(this.schema===void 0||([`GET`,`HEAD`].includes(this.method)?this.headers.set(`Accept-Profile`,this.schema):this.headers.set(`Content-Profile`,this.schema)),this.method!==`GET`&&this.method!==`HEAD`&&this.headers.set(`Content-Type`,`application/json`),this.shouldStripNulls){let e=this.headers.get(`Accept`);e===`application/vnd.pgrst.object+json`?this.headers.set(`Accept`,`application/vnd.pgrst.object+json;nulls=stripped`):(!e||e===`application/json`)&&this.headers.set(`Accept`,`application/vnd.pgrst.array+json;nulls=stripped`)}let r=this.fetch,i=(async()=>{let e={};n.headers.forEach((t,n)=>{e[n]=t});let t=await go(r,n.url.toString(),{method:n.method,headers:e,body:JSON.stringify(n.body,(e,t)=>typeof t==`bigint`?t.toString():t),signal:n.signal},n.retryEnabled);return await n.processResponse(t)})();return this.shouldThrowOnError||(i=i.catch(e=>{let t=``,n=``,r=``,i=e?.cause;if(i){let n=i?.message??``,r=i?.code??``;t=`${e?.name??`FetchError`}: ${e?.message}`,t+=`\n\nCaused by: ${i?.name??`Error`}: ${n}`,r&&(t+=` (${r})`),i?.stack&&(t+=`\n${i.stack}`)}else t=e?.stack??``;let a=this.url.toString().length;return e?.name===`AbortError`||e?.code===`ABORT_ERR`?(r=``,n=`Request was aborted (timeout or manual cancellation)`,a>this.urlLengthLimit&&(n+=`. Note: Your request URL is ${a} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):(i?.name===`HeadersOverflowError`||i?.code===`UND_ERR_HEADERS_OVERFLOW`)&&(r=``,n=`HTTP headers exceeded server limits (typically 16KB)`,a>this.urlLengthLimit&&(n+=`. Your request URL is ${a} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${e?.name??`FetchError`}: ${e?.message}`,details:t,hint:n,code:r},data:null,count:null,status:0,statusText:``}})),i.then(e,t)}async processResponse(e){var t=this;let n=null,r=null,i=null,a=e.status,o=e.statusText;if(e.ok){if(t.method!==`HEAD`){let i=await e.text();if(i!==``){if(t.headers.get(`Accept`)===`text/csv`)r=i;else if(t.headers.get(`Accept`)&&t.headers.get(`Accept`)?.includes(`application/vnd.pgrst.plan+text`))r=i;else try{r=JSON.parse(i)}catch{if(n={message:i},r=null,t.shouldThrowOnError)throw new no({message:i,details:``,hint:``,code:``})}}}let s=t.headers.get(`Prefer`)?.match(/count=(exact|planned|estimated)/),c=e.headers.get(`content-range`)?.split(`/`);if(s&&c&&c.length>1&&(i=parseInt(c[1])),t.isMaybeSingle&&Array.isArray(r)){if(r.length>1){if(n={code:`PGRST116`,details:`Results contain ${r.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:`JSON object requested, multiple (or no) rows returned`},r=null,i=null,a=406,o=`Not Acceptable`,t.shouldThrowOnError)throw new no(po(po({},n),{},{hint:n.hint??``}))}else r=r.length===1?r[0]:null}}else{let i=await e.text();try{n=JSON.parse(i),Array.isArray(n)&&e.status===404&&(r=[],n=null,a=200,o=`OK`)}catch{e.status===404&&i===``?(a=204,o=`No Content`):n={message:i}}if(n&&t.shouldThrowOnError)throw new no(n)}return{success:n===null,error:n,data:r,count:i,status:a,statusText:o}}returns(){return this}overrideTypes(){return this}},vo=class extends _o{throwOnError(){return super.throwOnError()}select(e){let t=!1,n=(e??`*`).split(``).map(e=>/\s/.test(e)&&!t?``:(e===`"`&&(t=!t),e)).join(``);return this.url.searchParams.set(`select`,n),this.headers.append(`Prefer`,`return=representation`),this}order(e,{ascending:t=!0,nullsFirst:n,foreignTable:r,referencedTable:i=r}={}){let a=i?`${i}.order`:`order`,o=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${o?`${o},`:``}${e}.${t?`asc`:`desc`}${n===void 0?``:n?`.nullsfirst`:`.nullslast`}`),this}limit(e,{foreignTable:t,referencedTable:n=t}={}){let r=n===void 0?`limit`:`${n}.limit`;return this.url.searchParams.set(r,`${e}`),this}range(e,t,{foreignTable:n,referencedTable:r=n}={}){let i=r===void 0?`offset`:`${r}.offset`,a=r===void 0?`limit`:`${r}.limit`;return this.url.searchParams.set(i,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set(`Accept`,`application/vnd.pgrst.object+json`),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set(`Accept`,`text/csv`),this}geojson(){return this.headers.set(`Accept`,`application/geo+json`),this}explain({analyze:e=!1,verbose:t=!1,settings:n=!1,buffers:r=!1,wal:i=!1,format:a=`text`}={}){let o=[e?`analyze`:null,t?`verbose`:null,n?`settings`:null,r?`buffers`:null,i?`wal`:null].filter(Boolean).join(`|`),s=this.headers.get(`Accept`)??`application/json`;return this.headers.set(`Accept`,`application/vnd.pgrst.plan+${a}; for="${s}"; options=${o};`),this}rollback(){return this.headers.append(`Prefer`,`tx=rollback`),this}returns(){return this}maxAffected(e){return this.headers.append(`Prefer`,`handling=strict`),this.headers.append(`Prefer`,`max-affected=${e}`),this}},yo=RegExp(`[,()]`),bo=class extends vo{throwOnError(){return super.throwOnError()}eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(`,`)}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(`,`)}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(`,`)}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(`,`)}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&yo.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`in.(${n})`),this}notIn(e,t){let n=Array.from(new Set(t)).map(e=>typeof e==`string`&&yo.test(e)?`"${e}"`:`${e}`).join(`,`);return this.url.searchParams.append(e,`not.in.(${n})`),this}contains(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t==`string`?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(`,`)}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t==`string`?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(`,`)}}`),this}textSearch(e,t,{config:n,type:r}={}){let i=``;r===`plain`?i=`pl`:r===`phrase`?i=`ph`:r===`websearch`&&(i=`w`);let a=n===void 0?``:`(${n})`;return this.url.searchParams.append(e,`${i}fts${a}.${t}`),this}match(e){return Object.entries(e).filter(([e,t])=>t!==void 0).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(e,t,n){return this.url.searchParams.append(e,`not.${t}.${n}`),this}or(e,{foreignTable:t,referencedTable:n=t}={}){let r=n?`${n}.or`:`or`;return this.url.searchParams.append(r,`(${e})`),this}filter(e,t,n){return this.url.searchParams.append(e,`${t}.${n}`),this}},xo=class{constructor(e,{headers:t={},schema:n,fetch:r,urlLengthLimit:i=8e3,retry:a}){this.url=e,this.headers=new Headers(t),this.schema=n,this.fetch=r,this.urlLengthLimit=i,this.retry=a}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(e,t){let{head:n=!1,count:r}=t??{},i=n?`HEAD`:`GET`,a=!1,o=(e??`*`).split(``).map(e=>/\s/.test(e)&&!a?``:(e===`"`&&(a=!a),e)).join(``),{url:s,headers:c}=this.cloneRequestState();return s.searchParams.set(`select`,o),r&&c.append(`Prefer`,`count=${r}`),new bo({method:i,url:s,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(e,{count:t,defaultToNull:n=!0}={}){let{url:r,headers:i}=this.cloneRequestState();if(t&&i.append(`Prefer`,`count=${t}`),n||i.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);r.searchParams.set(`columns`,e.join(`,`))}}return new bo({method:`POST`,url:r,headers:i,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(e,{onConflict:t,ignoreDuplicates:n=!1,count:r,defaultToNull:i=!0}={}){let{url:a,headers:o}=this.cloneRequestState();if(o.append(`Prefer`,`resolution=${n?`ignore`:`merge`}-duplicates`),t!==void 0&&a.searchParams.set(`on_conflict`,t),r&&o.append(`Prefer`,`count=${r}`),i||o.append(`Prefer`,`missing=default`),Array.isArray(e)){let t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){let e=[...new Set(t)].map(e=>`"${e}"`);a.searchParams.set(`columns`,e.join(`,`))}}return new bo({method:`POST`,url:a,headers:o,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(e,{count:t}={}){let{url:n,headers:r}=this.cloneRequestState();return t&&r.append(`Prefer`,`count=${t}`),new bo({method:`PATCH`,url:n,headers:r,schema:this.schema,body:e,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:e}={}){let{url:t,headers:n}=this.cloneRequestState();return e&&n.append(`Prefer`,`count=${e}`),new bo({method:`DELETE`,url:t,headers:n,schema:this.schema,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function So(e,t){try{let t=JSON.parse(e);if(t&&typeof t==`object`&&!Array.isArray(t))return new no({message:String(t.message??e),details:t.details??``,hint:t.hint??``,code:t.code??``})}catch{}return new no({message:e||t,details:``,hint:``,code:``})}function Co(e,t,n){let r=e;return{success:!1,error:new no({message:`${r?.name??`FetchError`}: ${r?.message}`,details:``,hint:``,code:``}),data:null,count:null,status:t,statusText:n}}var wo=class e{constructor(e,{headers:t={},schema:n,fetch:r,timeout:i,urlLengthLimit:a=8e3,retry:o}={}){this.url=e,this.headers=new Headers(t),this.schemaName=n,this.urlLengthLimit=a;let s=r??globalThis.fetch;this.fetch=i!==void 0&&i>0?(e,t)=>{let n=new AbortController,r=setTimeout(()=>n.abort(),i),a=t?.signal;if(a){if(a.aborted)return clearTimeout(r),s(e,t);let i=()=>{clearTimeout(r),n.abort()};return a.addEventListener(`abort`,i,{once:!0}),s(e,po(po({},t),{},{signal:n.signal})).finally(()=>{clearTimeout(r),a.removeEventListener(`abort`,i)})}return s(e,po(po({},t),{},{signal:n.signal})).finally(()=>clearTimeout(r))}:s,this.retry=o}from(e){if(!e||typeof e!=`string`||e.trim()===``)throw Error(`Invalid relation name: relation must be a non-empty string.`);return new xo(new URL(`${this.url}/${e}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(t){return new e(this.url,{headers:this.headers,schema:t,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}async getOpenApiSpec(){var e=this;let t=new Headers(e.headers);t.set(`Accept`,`application/openapi+json`),e.schemaName&&t.set(`Accept-Profile`,e.schemaName);let n={};t.forEach((e,t)=>{n[t]=e});let r=e.fetch??globalThis.fetch,i;try{i=await go(r,`${e.url}/`,{method:`GET`,headers:n},e.retry??!0)}catch(e){return Co(e,0,``)}let a;try{a=await i.text()}catch(e){return Co(e,i.status,i.statusText)}if(i.ok)try{return{success:!0,error:null,data:JSON.parse(a),count:null,status:i.status,statusText:i.statusText}}catch{}return{success:!1,error:So(a,i.statusText),data:null,count:null,status:i.status,statusText:i.statusText}}rpc(e,t={},{head:n=!1,get:r=!1,count:i}={}){let a,o=new URL(`${this.url}/rpc/${e}`),s,c=e=>typeof e==`object`&&!!e&&(!Array.isArray(e)||e.some(c)),l=n&&Object.values(t).some(c);l?(a=`POST`,s=t):n||r?(a=n?`HEAD`:`GET`,Object.entries(t).filter(([e,t])=>t!==void 0).map(([e,t])=>[e,Array.isArray(t)?`{${t.join(`,`)}}`:`${t}`]).forEach(([e,t])=>{o.searchParams.append(e,t)})):(a=`POST`,s=t);let u=new Headers(this.headers);return l?u.set(`Prefer`,i?`count=${i},return=minimal`:`return=minimal`):i&&u.set(`Prefer`,`count=${i}`),new bo({method:a,url:o,headers:u,schema:this.schemaName,body:s,fetch:this.fetch??fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}},To=class{constructor(){}static detectEnvironment(){if(typeof WebSocket<`u`)return{type:`native`,wsConstructor:WebSocket};let e=globalThis;if(typeof globalThis<`u`&&e.WebSocket!==void 0)return{type:`native`,wsConstructor:e.WebSocket};let t=typeof global<`u`?global:void 0;if(t&&t.WebSocket!==void 0)return{type:`native`,wsConstructor:t.WebSocket};if(typeof globalThis<`u`&&e.WebSocketPair!==void 0&&globalThis.WebSocket===void 0)return{type:`cloudflare`,error:`Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.`,workaround:`Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime.`};if(typeof globalThis<`u`&&e.EdgeRuntime||typeof navigator<`u`&&navigator.userAgent?.includes(`Vercel-Edge`))return{type:`unsupported`,error:`Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.`,workaround:`Use serverless functions or a different deployment target for WebSocket functionality.`};let n=globalThis.process;if(n){let e=n.versions;if(e&&e.node)return{type:`unsupported`,error:`Node.js detected but native WebSocket not found.`,workaround:`Ensure you are running Node.js 22+ or provide a WebSocket implementation via the transport option.`}}return{type:`unsupported`,error:`Unknown JavaScript runtime without WebSocket support.`,workaround:`Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation.`}}static getWebSocketConstructor(){let e=this.detectEnvironment();if(e.wsConstructor)return e.wsConstructor;let t=e.error||`WebSocket not supported in this environment.`;throw e.workaround&&(t+=`\n\nSuggested solution: ${e.workaround}`),Error(t)}static isWebSocketSupported(){try{return this.detectEnvironment().type===`native`}catch{return!1}}},Eo=`realtime-js/2.117.2`,Do=`1.0.0`,Oo=`2.0.0`,ko=Oo,Ao=1e4,jo=15e3,Mo=1e4,No={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},Po={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`,access_token:`access_token`},Fo={connecting:`connecting`,open:`open`,closing:`closing`,closed:`closed`},Io=class{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT=`broadcast`,this.allowedMetadataKeys=[],this.allowedMetadataKeys=e??[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&typeof e.payload.event==`string`)return t(this._binaryEncodeUserBroadcastPush(e));let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}_binaryEncodeUserBroadcastPush(e){return this._isArrayBuffer(e.payload?.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){let t=e.payload?.payload??new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,t)}_encodeJsonUserBroadcastPush(e){let t=e.payload?.payload??{},n=new TextEncoder().encode(JSON.stringify(t)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,n)}_encodeUserBroadcastPush(e,t,n){let r=new TextEncoder,i=r.encode(e.topic),a=r.encode(e.ref??``),o=r.encode(e.join_ref??``),s=r.encode(e.payload.event),c=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},l=r.encode(Object.keys(c).length===0?``:JSON.stringify(c));if(o.length>255)throw Error(`joinRef length ${o.length} exceeds maximum of 255`);if(a.length>255)throw Error(`ref length ${a.length} exceeds maximum of 255`);if(i.length>255)throw Error(`topic length ${i.length} exceeds maximum of 255`);if(s.length>255)throw Error(`userEvent length ${s.length} exceeds maximum of 255`);if(l.length>255)throw Error(`metadata length ${l.length} exceeds maximum of 255`);let u=this.USER_BROADCAST_PUSH_META_LENGTH+o.length+a.length+i.length+s.length+l.length,d=new ArrayBuffer(this.HEADER_LENGTH+u),f=new DataView(d),p=new Uint8Array(d),m=0;f.setUint8(m++,this.KINDS.userBroadcastPush),f.setUint8(m++,o.length),f.setUint8(m++,a.length),f.setUint8(m++,i.length),f.setUint8(m++,s.length),f.setUint8(m++,l.length),f.setUint8(m++,t),p.set(o,m),m+=o.length,p.set(a,m),m+=a.length,p.set(i,m),m+=i.length,p.set(s,m),m+=s.length,p.set(l,m),m+=l.length;var h=new Uint8Array(d.byteLength+n.byteLength);return h.set(new Uint8Array(d),0),h.set(new Uint8Array(n),d.byteLength),h.buffer}decode(e,t){if(this._isArrayBuffer(e))return t(this._binaryDecode(e));if(typeof e==`string`){let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}return t({})}_binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(e,t,r)}}_decodeUserBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+4,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=e.slice(s,e.byteLength),f=o===this.JSON_ENCODING?JSON.parse(n.decode(d)):d,p={type:this.BROADCAST_EVENT,event:l,payload:f};return a>0&&(p.meta=JSON.parse(u)),{join_ref:null,ref:null,topic:c,event:this.BROADCAST_EVENT,payload:p}}_isArrayBuffer(e){return e instanceof ArrayBuffer||e?.constructor?.name===`ArrayBuffer`}_pick(e,t){return!e||typeof e!=`object`?{}:Object.fromEntries(Object.entries(e).filter(([e])=>t.includes(e)))}},E;(function(e){e.abstime=`abstime`,e.bool=`bool`,e.date=`date`,e.daterange=`daterange`,e.float4=`float4`,e.float8=`float8`,e.int2=`int2`,e.int4=`int4`,e.int4range=`int4range`,e.int8=`int8`,e.int8range=`int8range`,e.json=`json`,e.jsonb=`jsonb`,e.money=`money`,e.numeric=`numeric`,e.oid=`oid`,e.reltime=`reltime`,e.text=`text`,e.time=`time`,e.timestamp=`timestamp`,e.timestamptz=`timestamptz`,e.timetz=`timetz`,e.tsrange=`tsrange`,e.tstzrange=`tstzrange`})(E||={});var Lo=(e,t,n={})=>{let r=n.skipTypes??[];return t?Object.keys(t).reduce((n,i)=>(n[i]=Ro(i,e,t,r),n),{}):{}},Ro=(e,t,n,r)=>{let i=t.find(t=>t.name===e)?.type,a=n[e];return i&&!r.includes(i)?zo(i,a):Bo(a)},zo=(e,t)=>{if(e.charAt(0)===`_`)return Wo(t,e.slice(1,e.length));switch(e){case E.bool:return Vo(t);case E.float4:case E.float8:case E.int2:case E.int4:case E.int8:case E.numeric:case E.oid:return Ho(t);case E.json:case E.jsonb:return Uo(t);case E.timestamp:return Go(t);case E.abstime:case E.date:case E.daterange:case E.int4range:case E.int8range:case E.money:case E.reltime:case E.text:case E.time:case E.timestamptz:case E.timetz:case E.tsrange:case E.tstzrange:return Bo(t);default:return Bo(t)}},Bo=e=>e,Vo=e=>{switch(e){case`t`:return!0;case`f`:return!1;default:return e}},Ho=e=>{if(typeof e==`string`){let t=parseFloat(e);if(!Number.isNaN(t))return t}return e},Uo=e=>{if(typeof e==`string`)try{return JSON.parse(e)}catch{return e}return e},Wo=(e,t)=>{if(typeof e!=`string`)return e;let n=e.length-1,r=e[n];if(e[0]===`{`&&r===`}`){let r,i=e.slice(1,n);try{r=JSON.parse(`[`+i+`]`)}catch{r=i?i.split(`,`):[]}return r.map(e=>zo(t,e))}return e},Go=e=>typeof e==`string`?e.replace(` `,`T`):e,Ko=e=>{let t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,`http`),t.pathname=t.pathname.replace(/\/+$/,``).replace(/\/socket\/websocket$/i,``).replace(/\/socket$/i,``).replace(/\/websocket$/i,``),t.pathname===``||t.pathname===`/`?t.pathname=`/api/broadcast`:t.pathname+=`/api/broadcast`,t.href},qo=e=>typeof e==`function`?e:function(){return e},Jo=typeof self<`u`?self:null,Yo=typeof window<`u`?window:null,Xo=Jo||Yo||globalThis,Zo=`2.0.0`,Qo=1e4,$o=1e3,es=100,ts={connecting:0,open:1,closing:2,closed:3},D={closed:`closed`,errored:`errored`,joined:`joined`,joining:`joining`,leaving:`leaving`},ns={close:`phx_close`,error:`phx_error`,join:`phx_join`,reply:`phx_reply`,leave:`phx_leave`},rs={longpoll:`longpoll`,websocket:`websocket`},is={complete:4},as=`base64url.bearer.phx.`,os=class{constructor(e,t,n,r){this.channel=e,this.event=t,this.payload=n||function(){return{}},this.receivedResp=null,this.timeout=r,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(e){this.timeout=e,this.reset(),this.send()}send(){this.hasReceived(`timeout`)||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:e,response:t,_ref:n}){this.recHooks.filter(t=>t.status===e).forEach(e=>e.callback(t))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,e=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=e,this.matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger(`timeout`,{})},this.timeout)}hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}trigger(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}},ss=class{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries+=1,this.callback()},this.timerCalc(this.tries+1))}},cs=class{constructor(e,t,n){this.state=D.closed,this.topic=e,this.params=qo(t||{}),this.socket=n,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new os(this,ns.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new ss(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive(`ok`,()=>{this.state=D.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(e=>e.send()),this.pushBuffer=[]}),this.joinPush.receive(`error`,e=>{this.state=D.errored,this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log(`channel`,`close ${this.topic}`),this.state=D.closed,this.socket.remove(this)}),this.onError(e=>{this.socket.hasLogger()&&this.socket.log(`channel`,`error ${this.topic}`,e),this.isJoining()&&this.joinPush.reset(),this.state=D.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive(`timeout`,()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`timeout ${this.topic}`,this.joinPush.timeout),new os(this,ns.leave,qo({}),this.timeout).send(),this.state=D.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(ns.reply,(e,t)=>{this.trigger(this.replyEventName(t),e)})}join(e=this.timeout){if(this.joinedOnce)throw Error(`tried to join multiple times. 'join' can only be called a single time per channel instance`);return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=D.closed,this.bindings=[]}onClose(e){this.on(ns.close,e)}onError(e){return this.on(ns.error,t=>e(t))}on(e,t){let n=this.bindingRef++;return this.bindings.push({event:e,ref:n,callback:t}),n}off(e,t){this.bindings=this.bindings.filter(n=>n.event!==e||t!==void 0&&t!==n.ref)}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,n=this.timeout){if(t||={},!this.joinedOnce)throw Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let r=new os(this,e,function(){return t},n);return this.canPush()?r.send():(r.startTimeout(),this.pushBuffer.push(r)),r}leave(e=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=D.leaving;let t=()=>{this.socket.hasLogger()&&this.socket.log(`channel`,`leave ${this.topic}`),this.trigger(ns.close,`leave`)},n=new os(this,ns.leave,qo({}),e);return n.receive(`ok`,()=>t()).receive(`timeout`,()=>t()),n.send(),this.canPush()||n.trigger(`ok`,{}),n}onMessage(e,t,n){return t}filterBindings(e,t,n){return!0}isMember(e,t,n,r){return this.topic===e?r&&r!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log(`channel`,`dropping outdated message`,{topic:e,event:t,payload:n,joinRef:r}),!1):!0:!1}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=D.joining,this.joinPush.resend(e))}trigger(e,t,n,r){let i=this.onMessage(e,t,n,r);if(t&&!i)throw Error(`channel onMessage callbacks must return the payload, modified or unmodified`);let a=this.bindings.filter(r=>r.event===e&&this.filterBindings(r,t,n));for(let e=0;e<a.length;e++)a[e].callback(i,n,r||this.joinRef())}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===D.closed}isErrored(){return this.state===D.errored}isJoined(){return this.state===D.joined}isJoining(){return this.state===D.joining}isLeaving(){return this.state===D.leaving}},ls=class{static request(e,t,n,r,i,a,o){if(Xo.XDomainRequest){let n=new Xo.XDomainRequest;return this.xdomainRequest(n,e,t,r,i,a,o)}if(Xo.XMLHttpRequest){let s=new Xo.XMLHttpRequest;return this.xhrRequest(s,e,t,n,r,i,a,o)}if(Xo.fetch&&Xo.AbortController)return this.fetchRequest(e,t,n,r,i,a,o);throw Error(`No suitable XMLHttpRequest implementation found`)}static fetchRequest(e,t,n,r,i,a,o){let s={method:e,headers:n,body:r},c=null;return i&&(c=new AbortController,setTimeout(()=>c.abort(),i),s.signal=c.signal),Xo.fetch(t,s).then(e=>e.text()).then(e=>this.parseJSON(e)).then(e=>o&&o(e)).catch(e=>{e.name===`AbortError`&&a?a():o&&o(null)}),c}static xdomainRequest(e,t,n,r,i,a,o){return e.timeout=i,e.open(t,n),e.onload=()=>{let t=this.parseJSON(e.responseText);o&&o(t)},a&&(e.ontimeout=a),e.onprogress=()=>{},e.send(r),e}static xhrRequest(e,t,n,r,i,a,o,s){e.open(t,n,!0),e.timeout=a;for(let[t,n]of Object.entries(r))e.setRequestHeader(t,n);return e.onerror=()=>s&&s(null),e.onreadystatechange=()=>{e.readyState===is.complete&&s&&s(this.parseJSON(e.responseText))},o&&(e.ontimeout=o),e.send(i),e}static parseJSON(e){if(!e||e===``)return null;try{return JSON.parse(e)}catch{return console&&console.log(`failed to parse JSON response`,e),null}}static serialize(e,t){let n=[];for(var r in e){if(!Object.prototype.hasOwnProperty.call(e,r))continue;let i=t?`${t}[${r}]`:r,a=e[r];typeof a==`object`?n.push(this.serialize(a,i)):n.push(encodeURIComponent(i)+`=`+encodeURIComponent(a))}return n.join(`&`)}static appendParams(e,t){return Object.keys(t).length===0?e:`${e}${e.match(/\?/)?`&`:`?`}${this.serialize(t)}`}},us=e=>{let t=``,n=new Uint8Array(e),r=n.byteLength;for(let e=0;e<r;e++)t+=String.fromCharCode(n[e]);return btoa(t)},ds=class{constructor(e,t){t&&t.length===2&&t[1].startsWith(as)&&(this.authToken=atob(t[1].slice(as.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(e),this.readyState=ts.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(e){return e.replace(`ws://`,`http://`).replace(`wss://`,`https://`).replace(RegExp(`(.*)/`+rs.websocket),`$1/`+rs.longpoll)}endpointURL(){return ls.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(e,t,n){this.close(e,t,n),this.readyState=ts.connecting}ontimeout(){this.onerror(`timeout`),this.closeAndRetry(1005,`timeout`,!1)}isActive(){return this.readyState===ts.open||this.readyState===ts.connecting}poll(){let e={Accept:`application/json`};this.authToken&&(e[`X-Phoenix-AuthToken`]=this.authToken),this.ajax(`GET`,e,null,()=>this.ontimeout(),e=>{if(e){var{status:t,token:n,messages:r}=e;if(t===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,`session_gone`,!1);return}this.token=n}else t=0;switch(t){case 200:r.forEach(e=>{setTimeout(()=>this.onmessage({data:e}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=ts.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,`forbidden`,!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,`internal server error`,500);break;default:throw Error(`unhandled poll status ${t}`)}})}send(e){typeof e!=`string`&&(e=us(e)),this.currentBatch?this.currentBatch.push(e):this.awaitingBatchAck?this.batchBuffer.push(e):(this.currentBatch=[e],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(e,t=0){this.awaitingBatchAck=!0;let n=t+es,r=e.slice(t,n);this.ajax(`POST`,{"Content-Type":`application/x-ndjson`},r.join(`
`),()=>this.onerror(`timeout`),t=>{!t||t.status!==200?(this.awaitingBatchAck=!1,this.onerror(t&&t.status),this.closeAndRetry(1011,`internal server error`,!1)):n<e.length?this.batchSend(e,n):this.batchBuffer.length>0?(this.batchSend(this.batchBuffer),this.batchBuffer=[]):this.awaitingBatchAck=!1})}close(e,t,n){for(let e of this.reqs)e.abort();this.readyState=ts.closed;let r=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:e,reason:t,wasClean:n});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<`u`?this.onclose(new CloseEvent(`close`,r)):this.onclose(r)}ajax(e,t,n,r,i){let a;a=ls.request(e,this.endpointURL(),t,n,this.timeout,()=>{this.reqs.delete(a),r()},e=>{this.reqs.delete(a),this.isActive()&&i(e)}),this.reqs.add(a)}},fs=class e{constructor(t,n={}){let r=n.events||{state:`presence_state`,diff:`presence_diff`};this.state=Object.create(null),this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(r.state,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.joinRef=this.channel.joinRef(),this.state=e.syncState(this.state,t,n,r),this.pendingDiffs.forEach(t=>{this.state=e.syncDiff(this.state,t,n,r)}),this.pendingDiffs=[],i()}),this.channel.on(r.diff,t=>{let{onJoin:n,onLeave:r,onSync:i}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(t):(this.state=e.syncDiff(this.state,t,n,r),i())})}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}list(t){return e.list(this.state,t)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(e,t,n,r){let i=this.toNullProtoObj(this.clone(e));t=this.toNullProtoObj(t);let a=Object.create(null),o=Object.create(null);return this.map(i,(e,n)=>{t[e]||(o[e]=n)}),this.map(t,(e,t)=>{let n=i[e];if(n){let r=t.metas.map(e=>e.phx_ref),i=n.metas.map(e=>e.phx_ref),s=t.metas.filter(e=>i.indexOf(e.phx_ref)<0),c=n.metas.filter(e=>r.indexOf(e.phx_ref)<0);s.length>0&&(a[e]=t,a[e].metas=s),c.length>0&&(o[e]=this.clone(n),o[e].metas=c)}else a[e]=t}),this.syncDiff(i,{joins:a,leaves:o},n,r)}static syncDiff(e,t,n,r){e=this.toNullProtoObj(e);let{joins:i,leaves:a}=this.clone(t);return n||=function(){},r||=function(){},this.map(i,(t,r)=>{let i=e[t];if(e[t]=this.clone(r),i){let n=e[t].metas.map(e=>e.phx_ref),r=i.metas.filter(e=>n.indexOf(e.phx_ref)<0);e[t].metas.unshift(...r)}n(t,i,r)}),this.map(a,(t,n)=>{let i=e[t];if(!i)return;let a=n.metas.map(e=>e.phx_ref);i.metas=i.metas.filter(e=>a.indexOf(e.phx_ref)<0),r(t,i,n),i.metas.length===0&&delete e[t]}),e}static list(e,t){return t||=function(e,t){return t},this.map(e,(e,n)=>t(e,n))}static map(e,t){return Object.getOwnPropertyNames(e).map(n=>t(n,e[n]))}static toNullProtoObj(e){if(Object.getPrototypeOf(e)===null)return e;let t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(n=>{t[n]=e[n]}),t}static clone(e){return JSON.parse(JSON.stringify(e))}},ps={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(e,t){if(e.payload.constructor===ArrayBuffer)return t(this.binaryEncode(e));{let n=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(n))}},decode(e,t){if(e.constructor===ArrayBuffer)return t(this.binaryDecode(e));{let[n,r,i,a,o]=JSON.parse(e);return t({join_ref:n,ref:r,topic:i,event:a,payload:o})}},binaryEncode(e){let{join_ref:t,ref:n,event:r,topic:i,payload:a}=e,o=new TextEncoder,s=o.encode(t),c=o.encode(n),l=o.encode(i),u=o.encode(r);this.assertFieldSize(s.byteLength,`join_ref`),this.assertFieldSize(c.byteLength,`ref`),this.assertFieldSize(l.byteLength,`topic`),this.assertFieldSize(u.byteLength,`event`);let d=this.META_LENGTH+s.byteLength+c.byteLength+l.byteLength+u.byteLength,f=new ArrayBuffer(this.HEADER_LENGTH+d),p=new Uint8Array(f),m=new DataView(f),h=0;m.setUint8(h++,this.KINDS.push),m.setUint8(h++,s.byteLength),m.setUint8(h++,c.byteLength),m.setUint8(h++,l.byteLength),m.setUint8(h++,u.byteLength),p.set(s,h),h+=s.byteLength,p.set(c,h),h+=c.byteLength,p.set(l,h),h+=l.byteLength,p.set(u,h),h+=u.byteLength;var g=new Uint8Array(f.byteLength+a.byteLength);return g.set(p,0),g.set(new Uint8Array(a),f.byteLength),g.buffer},assertFieldSize(e,t){if(e>255)throw Error(`unable to convert ${t} to binary: must be less than or equal to 255 bytes, but is ${e} bytes`)},binaryDecode(e){let t=new DataView(e),n=t.getUint8(0),r=new TextDecoder;switch(n){case this.KINDS.push:return this.decodePush(e,t,r);case this.KINDS.reply:return this.decodeReply(e,t,r);case this.KINDS.broadcast:return this.decodeBroadcast(e,t,r)}},decodePush(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,s=n.decode(e.slice(o,o+r));o+=r;let c=n.decode(e.slice(o,o+i));o+=i;let l=n.decode(e.slice(o,o+a));return o+=a,{join_ref:s,ref:null,topic:c,event:l,payload:e.slice(o,e.byteLength)}},decodeReply(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),s=this.HEADER_LENGTH+this.META_LENGTH,c=n.decode(e.slice(s,s+r));s+=r;let l=n.decode(e.slice(s,s+i));s+=i;let u=n.decode(e.slice(s,s+a));s+=a;let d=n.decode(e.slice(s,s+o));s+=o;let f={status:d,response:e.slice(s,e.byteLength)};return{join_ref:c,ref:l,topic:u,event:ns.reply,payload:f}},decodeBroadcast(e,t,n){let r=t.getUint8(1),i=t.getUint8(2),a=this.HEADER_LENGTH+2,o=n.decode(e.slice(a,a+r));a+=r;let s=n.decode(e.slice(a,a+i));return a+=i,{join_ref:null,ref:null,topic:o,event:s,payload:e.slice(a,e.byteLength)}}},ms=class{constructor(e,t={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=t.timeout||Qo,this.transport=t.transport||Xo.WebSocket||ds,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=t.longPollFallbackMs,this.fallbackTimer=null;let n=null;try{n=Xo&&Xo.sessionStorage}catch{}this.sessionStore=t.sessionStorage||n,this.establishedConnections=0,this.defaultEncoder=ps.encode.bind(ps),this.defaultDecoder=ps.decode.bind(ps),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=t.binaryType||`arraybuffer`,this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport===ds?(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder):(this.encode=t.encode||this.defaultEncoder,this.decode=t.decode||this.defaultDecoder);let r=null;Yo&&Yo.addEventListener&&(Yo.addEventListener(`pagehide`,e=>{this.conn&&(this.disconnect(),r=this.connectClock)}),Yo.addEventListener(`pageshow`,e=>{r===this.connectClock&&(r=null,this.connect())}),Yo.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=t.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=t.autoSendHeartbeat??!0,this.heartbeatCallback=t.heartbeatCallback??(()=>{}),this.rejoinAfterMs=e=>t.rejoinAfterMs?t.rejoinAfterMs(e):[1e3,2e3,5e3][e-1]||1e4,this.reconnectAfterMs=e=>t.reconnectAfterMs?t.reconnectAfterMs(e):[10,50,100,150,200,250,500,1e3,2e3][e-1]||5e3,this.logger=t.logger||null,!this.logger&&t.debug&&(this.logger=(e,t,n)=>{console.log(`${e}: ${t}`,n)}),this.longpollerTimeout=t.longpollerTimeout||2e4,this.params=qo(t.params||{}),this.endPoint=`${e}/${rs.websocket}`,this.vsn=t.vsn||Zo,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new ss(()=>{this.pageHidden?(this.log(`Not reconnecting as page is hidden!`),this.teardown()):this.teardown(async()=>{t.beforeReconnect&&await t.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=t.authToken&&qo(t.authToken)}getLongPollTransport(){return ds}replaceTransport(e){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&=(this.conn.close(),null),this.transport=e}protocol(){return location.protocol.match(/^https/)?`wss`:`ws`}endPointURL(){let e=ls.appendParams(ls.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return e.charAt(0)===`/`?e.charAt(1)===`/`?`${this.protocol()}:${e}`:`${this.protocol()}://${location.host}${e}`:e}disconnect(e,t,n){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,e&&e()},t,n)}connect(e){e&&(console&&console.log(`passing params to connect is deprecated. Instead pass :params to the Socket constructor`),this.params=qo(e)),(!this.conn||this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==ds?this.connectWithFallback(ds,this.longPollFallbackMs):this.transportConnect())}log(e,t,n){this.logger&&this.logger(e,t,n)}hasLogger(){return this.logger!==null}onOpen(e){let t=this.makeRef();return this.stateChangeCallbacks.open.push([t,e]),t}onClose(e){let t=this.makeRef();return this.stateChangeCallbacks.close.push([t,e]),t}onError(e){let t=this.makeRef();return this.stateChangeCallbacks.error.push([t,e]),t}onMessage(e){let t=this.makeRef();return this.stateChangeCallbacks.message.push([t,e]),t}onHeartbeat(e){this.heartbeatCallback=e}ping(e){if(!this.isConnected())return!1;let t=this.makeRef(),n=Date.now();this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:t});let r=this.onMessage(i=>{i.ref===t&&(this.off([r]),e(Date.now()-n))});return!0}transportName(e){switch(e){case ds:return`LongPoll`;default:return e.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let e;this.authToken&&(e=[`phoenix`,`${as}${btoa(this.authToken()).replace(/=/g,``)}`]),this.conn=new this.transport(this.endPointURL(),e),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=e=>this.onConnError(e),this.conn.onmessage=e=>this.onConnMessage(e),this.conn.onclose=e=>this.onConnClose(e)}getSession(e){return this.sessionStore&&this.sessionStore.getItem(e)}storeSession(e,t){this.sessionStore&&this.sessionStore.setItem(e,t)}connectWithFallback(e,t=2500){clearTimeout(this.fallbackTimer);let n=!1,r=!0,i,a,o=this.transportName(e),s=t=>{this.log(`transport`,`falling back to ${o}...`,t),this.off([i,a]),r=!1,this.replaceTransport(e),this.transportConnect()};if(this.getSession(`phx:fallback:${o}`))return s(`memorized`);this.fallbackTimer=setTimeout(s,t),a=this.onError(e=>{this.log(`transport`,`error`,e),r&&!n&&(clearTimeout(this.fallbackTimer),s(e))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(n=!0,!r){let t=this.transportName(e);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${t}`,`true`),this.log(`transport`,`established ${t} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(s,t),this.ping(e=>{this.log(`transport`,`connected to primary after`,e),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log(`transport`,`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks(`open`)}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log(`transport`,`heartbeat timeout. Attempting to re-establish connection`);try{this.heartbeatCallback(`timeout`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.triggerChanError(Error(`heartbeat timeout`)),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),$o,`heartbeat timeout`)}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(e,t,n){if(!this.conn)return e&&e();let r=this.conn;this.waitForBufferDone(r,()=>{t?r.close(t,n||``):r.close(),this.waitForSocketClosed(r,()=>{this.conn===r&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),e&&e()})})}waitForBufferDone(e,t,n=1){n===5||!e.bufferedAmount?t():setTimeout(()=>{this.waitForBufferDone(e,t,n+1)},150*n)}waitForSocketClosed(e,t,n=1){n===5||e.readyState===ts.closed?t():setTimeout(()=>{this.waitForSocketClosed(e,t,n+1)},150*n)}onConnClose(e){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log(`transport`,`close`,e),this.triggerChanError(e),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks(`close`,e)}onConnError(e){this.hasLogger()&&this.log(`transport`,`error`,e);let t=this.transport,n=this.establishedConnections;this.triggerStateCallbacks(`error`,e,t,n),(t===this.transport||n>0)&&this.triggerChanError(e)}triggerChanError(e){this.channels.forEach(t=>{t.isErrored()||t.isLeaving()||t.isClosed()||t.trigger(ns.error,e)})}connectionState(){switch(this.conn&&this.conn.readyState){case ts.connecting:return`connecting`;case ts.open:return`open`;case ts.closing:return`closing`;default:return`closed`}}isConnected(){return this.connectionState()===`open`}remove(e){this.off(e.stateChangeRefs),this.channels=this.channels.filter(t=>t!==e)}off(e){for(let t in this.stateChangeCallbacks)this.stateChangeCallbacks[t]=this.stateChangeCallbacks[t].filter(([t])=>e.indexOf(t)===-1)}channel(e,t={}){let n=new cs(e,t,this);return this.channels.push(n),n}push(e){if(this.hasLogger()){let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;this.log(`push`,`${t} ${n} (${a}, ${i})`,r)}this.isConnected()?this.encode(e,e=>this.conn.send(e)):this.sendBuffer.push(()=>this.encode(e,e=>this.conn.send(e)))}makeRef(){let e=this.ref+1;return this.ref=e===this.ref?0:e,this.ref.toString()}sendHeartbeat(){if(!this.isConnected())try{this.heartbeatCallback(`disconnected`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}else if(this.pendingHeartbeatRef)this.heartbeatTimeout();else{this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:`phoenix`,event:`heartbeat`,payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback(`sent`)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}onConnMessage(e){this.decode(e.data,e=>{let{topic:t,event:n,payload:r,ref:i,join_ref:a}=e;if(i&&i===this.pendingHeartbeatRef){let e=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(r.status===`ok`?`ok`:`error`,e)}catch(e){this.log(`error`,`error in heartbeat callback`,e)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log(`receive`,`${r.status||``} ${t} ${n} ${i&&`(`+i+`)`||``}`.trim(),r);for(let e=0;e<this.channels.length;e++){let o=this.channels[e];o.isMember(t,n,r,a)&&o.trigger(n,r,i,a)}this.triggerStateCallbacks(`message`,e)})}triggerStateCallbacks(e,...t){try{this.stateChangeCallbacks[e].forEach(([n,r])=>{try{r(...t)}catch(t){this.log(`error`,`error in ${e} callback`,t)}})}catch(t){this.log(`error`,`error triggering ${e} callbacks`,t)}}leaveOpenTopic(e){let t=this.channels.find(t=>t.topic===e&&(t.isJoined()||t.isJoining()));t&&(this.hasLogger()&&this.log(`transport`,`leaving duplicate topic "${e}"`),t.leave())}},hs=class e{constructor(t,n){let r=vs(n);this.presence=new fs(t.getChannel(),r),this.presence.onJoin((n,r,i)=>{let a=e.onJoinPayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onLeave((n,r,i)=>{let a=e.onLeavePayload(n,r,i);t.getChannel().trigger(`presence`,a)}),this.presence.onSync(()=>{t.getChannel().trigger(`presence`,{event:`sync`})})}get state(){return e.transformState(this.presence.state)}static transformState(e){return e=_s(e),Object.getOwnPropertyNames(e).reduce((t,n)=>{let r=e[n];return t[n]=gs(r),t},{})}static onJoinPayload(e,t,n){return{event:`join`,key:e,currentPresences:ys(t),newPresences:gs(n)}}static onLeavePayload(e,t,n){return{event:`leave`,key:e,currentPresences:ys(t),leftPresences:gs(n)}}};function gs(e){return e.metas.map(e=>{let t=Object.getOwnPropertyDescriptors(e),n=Object.defineProperties({},t);return n.presence_ref=n.phx_ref,delete n.phx_ref,delete n.phx_ref_prev,n})}function _s(e){return JSON.parse(JSON.stringify(e))}function vs(e){return e?.events&&{events:e.events}}function ys(e){return e?.metas?gs(e):[]}var bs;(function(e){e.SYNC=`sync`,e.JOIN=`join`,e.LEAVE=`leave`})(bs||={});var xs=class{get state(){return this.presenceAdapter.state}constructor(e,t){this.channel=e,this.presenceAdapter=new hs(this.channel.channelAdapter,t)}};function Ss(e){if(e instanceof Error)return e;if(typeof e==`string`)return Error(e);if(e&&typeof e==`object`){let t=e;if(typeof t.code==`number`){let n=typeof t.reason==`string`&&t.reason?` (${t.reason})`:``;return Error(`socket closed: ${t.code}${n}`,{cause:e})}return Error(`channel error: transport failure`,{cause:e})}return Error(`channel error: connection lost`)}var Cs=class{constructor(e,t,n){let r=ws(n);this.channel=e.getSocket().channel(t,r),this.socket=e}get state(){return this.channel.state}set state(e){this.channel.state=e}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(e,t){return this.channel.on(e,t)}off(e,t){this.channel.off(e,t)}subscribe(e){return this.channel.join(e)}unsubscribe(e){return this.channel.leave(e)}teardown(){this.channel.teardown()}onClose(e){this.channel.onClose(e)}onError(e){return this.channel.onError(e)}push(e,t,n){let r;try{r=this.channel.push(e,t,n)}catch{throw Error(`tried to push '${e}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>100){let e=this.channel.pushBuffer.shift();e.cancelTimeout(),this.socket.log(`channel`,`discarded push due to buffer overflow: ${e.event}`,e.payload())}return r}updateJoinPayload(e){let t=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},t),e)}canPush(){return this.socket.isConnected()&&this.state===No.joined}isJoined(){return this.state===No.joined}isJoining(){return this.state===No.joining}isClosed(){return this.state===No.closed}isLeaving(){return this.state===No.leaving}updateFilterBindings(e){this.channel.filterBindings=e}updatePayloadTransform(e){this.channel.onMessage=e}getChannel(){return this.channel}};function ws(e){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},e.config)}}var Ts=/[,()"\\]/,Es=e=>Ts.test(e)||e!==e.trim(),Ds=e=>`"${e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`)}"`,Os=e=>{let t=e===null?`null`:String(e);return Es(t)?Ds(t):t},ks=e=>e===null?`null`:String(e),As=(e,t)=>{if(e===`in`){let e=Array.isArray(t)?t:[t];if(e.length===0)throw Error("Realtime `in` filter requires at least one value.");return`in.(${Array.from(new Set(e)).map(e=>Os(e)).join(`,`)})`}return e===`is`?`is.${ks(t)}`:`${e}.${Os(t)}`},js=class{constructor(){this.filters=[]}add(e,t,n,r=!1){let i=r?`not.`:``;return this.filters.push(`${e}=${i}${As(t,n)}`),this}eq(e,t){return this.add(e,`eq`,t)}neq(e,t){return this.add(e,`neq`,t)}gt(e,t){return this.add(e,`gt`,t)}gte(e,t){return this.add(e,`gte`,t)}lt(e,t){return this.add(e,`lt`,t)}lte(e,t){return this.add(e,`lte`,t)}in(e,t){return this.add(e,`in`,t)}like(e,t){return this.add(e,`like`,t)}ilike(e,t){return this.add(e,`ilike`,t)}match(e,t){return this.add(e,`match`,t)}imatch(e,t){return this.add(e,`imatch`,t)}is(e,t){return this.add(e,`is`,t)}isDistinct(e,t){return this.add(e,`isdistinct`,t)}not(e,t,n){return this.add(e,t,n,!0)}build(){return this.filters.join(`,`)}toString(){return this.build()}},Ms;(function(e){e.ALL=`*`,e.INSERT=`INSERT`,e.UPDATE=`UPDATE`,e.DELETE=`DELETE`})(Ms||={});var Ns;(function(e){e.BROADCAST=`broadcast`,e.PRESENCE=`presence`,e.POSTGRES_CHANGES=`postgres_changes`,e.SYSTEM=`system`})(Ns||={});var Ps;(function(e){e.SUBSCRIBED=`SUBSCRIBED`,e.TIMED_OUT=`TIMED_OUT`,e.CLOSED=`CLOSED`,e.CHANNEL_ERROR=`CHANNEL_ERROR`})(Ps||={});var Fs=class e{get state(){return this.channelAdapter.state}set state(e){this.channelAdapter.state=e}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(e,t={config:{}},n){if(this.topic=e,this.params=t,this.socket=n,this.bindings={},this.subTopic=e.replace(/^realtime:/i,``),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:``,enabled:!1},private:!1},t.config),this.channelAdapter=new Cs(this.socket.socketAdapter,e,this.params),this.presence=new xs(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=Ko(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&this.params.config?.broadcast?.replay)throw Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(e,t=this.timeout){if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){let{config:{broadcast:n,presence:r,private:i,postgres_changes_options:a}}=this.params,o=this.bindings.postgres_changes?.map(e=>e.filter)??[],s=!!this.bindings[Ns.PRESENCE]&&this.bindings[Ns.PRESENCE].length>0||this.params.config.presence?.enabled===!0,c={},l=Object.assign({broadcast:n,presence:Object.assign(Object.assign({},r),{enabled:s}),postgres_changes:o,private:i},a?{postgres_changes_options:a}:{});this.socket.accessTokenValue&&(c.access_token=this.socket.accessTokenValue),this._onError(t=>{e?.(Ps.CHANNEL_ERROR,Ss(t))}),this._onClose(()=>e?.(Ps.CLOSED)),this.updateJoinPayload(Object.assign({config:l},c)),this._updateFilterMessage();let u=a?.wait&&o.length>0?Math.max(t,(a.timeout??jo)+Mo):t;this.channelAdapter.subscribe(u).receive(`ok`,async({postgres_changes:t})=>{this.socket._isManualToken()||this.socket.setAuth(),t===void 0?e?.(Ps.SUBSCRIBED):this._updatePostgresBindings(t,e)}).receive(`error`,t=>{this.state=No.errored;let n=Object.values(t).join(`, `)||`error`;e?.(Ps.CHANNEL_ERROR,Error(n,{cause:t}))}).receive(`timeout`,()=>{e?.(Ps.TIMED_OUT)})}return this}_updatePostgresBindings(t,n){let r=this.bindings.postgres_changes,i=r?.length??0,a=[];for(let o=0;o<i;o++){let i=r[o],{filter:{event:s,schema:c,table:l,filter:u}}=i,d=t&&t[o];if(d&&d.event===s&&e.isFilterValueEqual(d.schema,c)&&e.isFilterValueEqual(d.table,l)&&e.isFilterValueEqual(d.filter,u))a.push(Object.assign(Object.assign({},i),{id:d.id}));else{this.unsubscribe(),this.state=No.errored,n?.(Ps.CHANNEL_ERROR,Error(`mismatch between server and client bindings for postgres changes`));return}}this.bindings.postgres_changes=a,this.state!=No.errored&&n&&n(Ps.SUBSCRIBED)}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:`presence`,event:`track`,payload:e},t)}async untrack(e={}){return await this.send({type:`presence`,event:`untrack`},e)}on(e,t,n){let r=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),i=e===Ns.PRESENCE||e===Ns.POSTGRES_CHANGES;if(r&&i)throw this.socket.log(`channel`,`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`),Error(`cannot add \`${e}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(e,t,n)}async httpSend(e,t,n={}){if(t==null)return Promise.reject(Error(`Payload is required for httpSend()`));let r=t instanceof ArrayBuffer||ArrayBuffer.isView(t),i={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":r?`application/octet-stream`:`application/json`};this.socket.accessTokenValue&&(i.Authorization=`Bearer ${this.socket.accessTokenValue}`);let a=new URL(this.broadcastEndpointURL);a.pathname+=`/${encodeURIComponent(this.subTopic)}/events/${encodeURIComponent(e)}`,this.private&&a.searchParams.set(`private`,`true`);let o={method:`POST`,headers:i,body:r?t:JSON.stringify(t)},s=await this._fetchWithTimeout(a.toString(),o,n.timeout??this.timeout);if(s.status===202)return{success:!0};if(s.status===404)return Promise.reject(Error(`httpSend() requires Realtime server v2.97.0 or newer; the endpoint returned 404. Update your Supabase CLI to a recent version, or upgrade the Realtime server in your self-hosted setup. See https://github.com/supabase/supabase-js/blob/master/packages/core/realtime-js/migrations/httpsend-server-version.md`));let c=s.statusText;try{let e=await s.json();c=e.error||e.message||c}catch{}return Promise.reject(Error(c))}async send(e,t={}){if(!this.channelAdapter.canPush()&&e.type===`broadcast`){let n=`Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.`;this.socket.hasLogger()?this.socket.log(`channel`,n):console.warn(n);let{event:r,payload:i}=e,a={apikey:this.socket.apiKey?this.socket.apiKey:``,"Content-Type":`application/json`};this.socket.accessTokenValue&&(a.Authorization=`Bearer ${this.socket.accessTokenValue}`);let o={method:`POST`,headers:a,body:JSON.stringify({messages:[{topic:this.subTopic,event:r,payload:i,private:this.private}]})};try{let e=await this._fetchWithTimeout(this.broadcastEndpointURL,o,t.timeout??this.timeout);return await e.body?.cancel(),e.ok?`ok`:`error`}catch(e){return e instanceof Error&&e.name===`AbortError`?`timed out`:`error`}}return new Promise(n=>{let r=this.channelAdapter.push(e.type,e,t.timeout||this.timeout);e.type===`broadcast`&&!this.params?.config?.broadcast?.ack&&n(`ok`),r.receive(`ok`,()=>n(`ok`)),r.receive(`error`,()=>n(`error`)),r.receive(`timeout`,()=>n(`timed out`))})}updateJoinPayload(e){this.channelAdapter.updateJoinPayload(e)}async unsubscribe(e=this.timeout){return new Promise(t=>{this.channelAdapter.unsubscribe(e).receive(`ok`,()=>t(`ok`)).receive(`timeout`,()=>t(`timed out`)).receive(`error`,()=>t(`error`))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(e,t,n){let r=new AbortController,i=setTimeout(()=>r.abort(),n),a=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:r.signal}));return clearTimeout(i),a}_on(t,n,r){let i=t.toLocaleLowerCase(),a=n?.filter;if((a instanceof js||typeof a==`object`&&a&&typeof a.build==`function`)&&(n=Object.assign(Object.assign({},n),{filter:a.build()})),i===Ns.POSTGRES_CHANGES&&this.bindings[i]?.find(t=>e.isSamePostgresFilter(t.filter,n)))return this.socket.log(`error`,`duplicate \`postgres_changes\` binding for ${this.topic} ignored`,n),this;let o=this.channelAdapter.on(t,r),s={type:i,filter:n,callback:r,ref:o};return this.bindings[i]?this.bindings[i].push(s):this.bindings[i]=[s],this._updateFilterMessage(),this}_onClose(e){this.channelAdapter.onClose(e)}_onError(e){this.channelAdapter.onError(e)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((e,t,n)=>{let r=e.event.toLocaleLowerCase();if(this._notThisChannelEvent(r,n))return!1;let i=this.bindings[r]?.find(t=>t.ref===e.ref);if(!i)return!0;if([`broadcast`,`presence`,`postgres_changes`].includes(r)){if(`id`in i){let e=i.id,n=i.filter?.event;return e&&t.ids?.includes(e)&&(n===`*`||n?.toLocaleLowerCase()===t.data?.type.toLocaleLowerCase())}{let e=(i?.filter?.event)?.toLocaleLowerCase();return e===`*`||e===(t?.event)?.toLocaleLowerCase()}}return i.type.toLocaleLowerCase()===r})}_notThisChannelEvent(e,t){let{close:n,error:r,leave:i,join:a}=Po;return t&&[n,r,i,a].includes(e)&&t!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((e,t,n)=>{if(typeof t==`object`&&`ids`in t){let e=t.data,{schema:n,table:r,commit_timestamp:i,type:a,errors:o}=e;return Object.assign(Object.assign({},{schema:n,table:r,commit_timestamp:i,eventType:a,new:{},old:{},errors:o}),this._getPayloadRecords(e))}return t})}copyBindings(e){if(this.joinedOnce)throw Error(`cannot copy bindings into joined channel`);for(let t in e.bindings)for(let n of e.bindings[t])this._on(n.type,n.filter,n.callback)}static isFilterValueEqual(e,t){return(e??void 0)===(t??void 0)}static isSamePostgresFilter(t,n){let r=(t?.select)?.join()??void 0,i=(n?.select)?.join()??void 0;return t?.event===n?.event&&e.isFilterValueEqual(t?.schema,n?.schema)&&e.isFilterValueEqual(t?.table,n?.table)&&e.isFilterValueEqual(t?.filter,n?.filter)&&r===i}_getPayloadRecords(e){let t={new:{},old:{}};return(e.type===`INSERT`||e.type===`UPDATE`)&&(t.new=Lo(e.columns,e.record)),(e.type===`UPDATE`||e.type===`DELETE`)&&(t.old=Lo(e.columns,e.old_record)),t}},Is=class{constructor(e,t){this.socket=new ms(e,t)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(e){this.socket.heartbeatCallback=e}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(e,t,n,r=1e4){return new Promise(i=>{setTimeout(()=>i(`timeout`),r),this.socket.disconnect(()=>{e(),i(`ok`)},t,n)})}push(e){this.socket.push(e)}log(e,t,n){this.socket.log(e,t,n)}hasLogger(){return this.socket.hasLogger()}makeRef(){return this.socket.makeRef()}onOpen(e){this.socket.onOpen(e)}onClose(e){this.socket.onClose(e)}onError(e){this.socket.onError(e)}onMessage(e){this.socket.onMessage(e)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==Fo.connecting}isDisconnecting(){return this.socket.connectionState()==Fo.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}},Ls={HEARTBEAT_INTERVAL:25e3,RECONNECT_DELAY:10,HEARTBEAT_TIMEOUT_FALLBACK:100},Rs=[1e3,2e3,5e3,1e4],zs=1e4;function Bs(){let e=new Map;return{get length(){return e.size},clear(){e.clear()},getItem(t){return e.has(t)?e.get(t):null},key(t){return Array.from(e.keys())[t]??null},removeItem(t){e.delete(t)},setItem(t,n){e.set(t,String(n))}}}function Vs(){try{if(typeof globalThis<`u`&&globalThis.sessionStorage)return globalThis.sessionStorage}catch{}return Bs()}var Hs=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`,Us=class{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(e,t){if(this.channels=[],this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint=``,this.headers={},this.params={},this.ref=0,this.serializer=new Io,this._manuallySetToken=!1,this._authPromise=null,this._authGeneration=0,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._pendingDisconnectTimer=null,this._disconnectOnEmptyChannelsAfterMs=0,this._resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),!t?.params?.apikey)throw Error(`API key is required to connect to Realtime`);this.apiKey=t.params.apikey;let n=this._initializeOptions(t);this.socketAdapter=new Is(e,n),this.httpEndpoint=Ko(e),this.fetch=this._resolveFetch(t?.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely(`connect`),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(e){let t=e.message;throw Error(`WebSocket not available: ${t}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(e,t){return this._cancelPendingDisconnect(),this.isDisconnecting()?`ok`:await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},e,t)}getChannels(){return this.channels}async removeChannel(e){let t=await e.unsubscribe();return t===`ok`&&e.teardown(),t}async removeAllChannels(){let e=this.channels.map(async e=>{let t=await e.unsubscribe();return e.teardown(),t}),t=await Promise.all(e);return await this.disconnect(),t}log(e,t,n){this.socketAdapter.log(e,t,n)}hasLogger(){return this.socketAdapter.hasLogger()}connectionState(){return this.socketAdapter.connectionState()||Fo.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(e,t={config:{}}){let n=`realtime:${e}`,r=this.getChannels().find(e=>e.topic===n);if(r)return r;{let n=new Fs(`realtime:${e}`,t,this);return this._cancelPendingDisconnect(),this.channels.push(n),n}}push(e){this.socketAdapter.push(e)}async setAuth(e=null){let t=++this._authGeneration,n=this._performAuth(e,t);t===this._authGeneration&&(this._authPromise=n);try{await n}finally{this._authPromise===n&&(this._authPromise=null)}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(e){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(e)}_makeRef(){return this.socketAdapter.makeRef()}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic),this.channels.length===0&&(this.log(`transport`,`no channels remaining, scheduling disconnect`),this._schedulePendingDisconnect())}_schedulePendingDisconnect(){this._cancelPendingDisconnect(),this._disconnectOnEmptyChannelsAfterMs===0?(this.log(`transport`,`disconnecting immediately - no channels`),this.disconnect()):(this._pendingDisconnectTimer=setTimeout(()=>{this._pendingDisconnectTimer=null,this.channels.length===0&&(this.log(`transport`,`deferred disconnect fired - no channels, disconnecting`),this.disconnect())},this._disconnectOnEmptyChannelsAfterMs),this.log(`transport`,`deferred disconnect scheduled in ${this._disconnectOnEmptyChannelsAfterMs}ms`))}_cancelPendingDisconnect(){this._pendingDisconnectTimer!==null&&(this.log(`transport`,`pending disconnect cancelled - channel activity detected`),clearTimeout(this._pendingDisconnectTimer),this._pendingDisconnectTimer=null)}async _performAuth(e,t){let n,r=!1;if(e)n=e,r=!0;else if(this.accessToken)try{n=await this.accessToken()}catch(e){this.log(`error`,`Error fetching access token from callback`,e),n=this.accessTokenValue}else n=this.accessTokenValue;t===this._authGeneration&&(this.accessToken?this._manuallySetToken=!1:r&&(this._manuallySetToken=!0),this.accessTokenValue!=n&&(this.accessTokenValue=n,this.channels.forEach(e=>{let t={access_token:n,version:Eo};e.updateJoinPayload(t),e.joinedOnce&&e.channelAdapter.isJoined()&&e.channelAdapter.push(Po.access_token,{access_token:n})})))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e=`general`){this._isManualToken()||this.setAuth().catch(t=>{this.log(`error`,`Error setting auth in ${e}`,t)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(e=>{this.log(`error`,`error waiting for auth on connect`,e)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(e=>{e.ref&&e.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(e){return(t,n)=>{t!==`disconnected`&&(t==`sent`&&this._setAuthSafely(),e&&e(t,n))}}_startWorkerHeartbeat(){this.workerUrl?this.log(`worker`,`starting worker for from ${this.workerUrl}`):this.log(`worker`,`starting default worker`);let e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=e=>{this.log(`worker`,`worker error`,e.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=e=>{e.data.event===`keepAlive`&&this.sendHeartbeat()},this.workerRef.postMessage({event:`start`,interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&=(this.log(`worker`,`terminating worker`),this.workerRef.terminate(),void 0)}_workerObjectUrl(e){let t;if(e)t=e;else{let e=new Blob([Hs],{type:`application/javascript`});t=URL.createObjectURL(e)}return t}_initializeOptions(e){this.worker=e?.worker??!1,this.accessToken=e?.accessToken??null;let t={};t.timeout=e?.timeout??Ao,t.heartbeatIntervalMs=e?.heartbeatIntervalMs??Ls.HEARTBEAT_INTERVAL,this._disconnectOnEmptyChannelsAfterMs=e?.disconnectOnEmptyChannelsAfterMs??2*(e?.heartbeatIntervalMs??Ls.HEARTBEAT_INTERVAL),t.transport=e?.transport??To.getWebSocketConstructor(),t.params=e?.params,t.logger=e?.logger,t.heartbeatCallback=this._wrapHeartbeatCallback(e?.heartbeatCallback),t.sessionStorage=e?.sessionStorage??Vs(),t.reconnectAfterMs=e?.reconnectAfterMs??(e=>Rs[e-1]||zs);let n,r,i=e?.vsn??ko;switch(i){case Do:n=(e,t)=>t(JSON.stringify(e)),r=(e,t)=>t(JSON.parse(e));break;case Oo:n=this.serializer.encode.bind(this.serializer),r=this.serializer.decode.bind(this.serializer);break;default:throw Error(`Unsupported serializer version: ${t.vsn}`)}if(t.vsn=i,t.encode=e?.encode??n,t.decode=e?.decode??r,t.beforeReconnect=this._reconnectAuth.bind(this),(e?.logLevel||e?.log_level)&&(this.logLevel=e.logLevel||e.log_level,t.params=Object.assign(Object.assign({},t.params),{log_level:this.logLevel})),this.worker){if(typeof window<`u`&&!window.Worker)throw Error(`Web Worker is not supported`);this.workerUrl=e?.workerUrl,t.autoSendHeartbeat=!this.worker}return t}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}},Ws=class extends Error{constructor(e,t){super(e),this.name=`IcebergError`,this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown=t.icebergType===`CommitStateUnknownException`||[500,502,504].includes(t.status)&&t.icebergType?.includes(`CommitState`)===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function Gs(e,t,n){let r=new URL(t,e);if(n)for(let[e,t]of Object.entries(n))t!==void 0&&r.searchParams.set(e,t);return r.toString()}async function Ks(e){return!e||e.type===`none`?{}:e.type===`bearer`?{Authorization:`Bearer ${e.token}`}:e.type===`header`?{[e.name]:e.value}:e.type===`custom`?await e.getHeaders():{}}function qs(e){let t=e.fetchImpl??globalThis.fetch;return{async request({method:n,path:r,query:i,body:a,headers:o}){let s=Gs(e.baseUrl,r,i),c=await Ks(e.auth),l=await t(s,{method:n,headers:{...a?{"Content-Type":`application/json`}:{},...c,...o},body:a?JSON.stringify(a):void 0}),u=await l.text(),d=(l.headers.get(`content-type`)||``).includes(`application/json`),f=d&&u?JSON.parse(u):u;if(!l.ok){let e=d?f:void 0,t=e?.error;throw new Ws(t?.message??`Request failed with status ${l.status}`,{status:l.status,icebergType:t?.type,icebergCode:t?.code,details:e})}return{status:l.status,headers:l.headers,data:f}}}}function Js(e){return e.join(``)}var Ys=class{constructor(e,t=``){this.client=e,this.prefix=t}async listNamespaces(e){let t=e?{parent:Js(e.namespace)}:void 0;return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(e=>({namespace:e}))}async createNamespace(e,t){let n={namespace:e.namespace,properties:t?.properties};return(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces`,body:n})).data}async dropNamespace(e){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${Js(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Js(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${Js(e.namespace)}`}),!0}catch(e){if(e instanceof Ws&&e.status===404)return!1;throw e}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(e){if(e instanceof Ws&&e.status===409)return;throw e}}};function Xs(e){return e.join(``)}var Zs=class{constructor(e,t=``,n){this.client=e,this.prefix=t,this.accessDelegation=n}async listTables(e){return(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){let n={};return this.accessDelegation&&(n[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables`,body:t,headers:n})).data.metadata}async updateTable(e,t){let n=await this.client.request({method:`POST`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":n.data[`metadata-location`],metadata:n.data.metadata}}async dropTable(e,t){await this.client.request({method:`DELETE`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String(t?.purge??!1)}})}async loadTable(e){let t={};return this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation),(await this.client.request({method:`GET`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){let t={};this.accessDelegation&&(t[`X-Iceberg-Access-Delegation`]=this.accessDelegation);try{return await this.client.request({method:`HEAD`,path:`${this.prefix}/namespaces/${Xs(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(e){if(e instanceof Ws&&e.status===404)return!1;throw e}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(n){if(n instanceof Ws&&n.status===409)return await this.loadTable({namespace:e.namespace,name:t.name});throw n}}},Qs=class{constructor(e){let t=`v1`;e.catalogName&&(t+=`/${e.catalogName}`);let n=e.baseUrl.endsWith(`/`)?e.baseUrl:`${e.baseUrl}/`;this.client=qs({baseUrl:n,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=e.accessDelegation?.join(`,`),this.namespaceOps=new Ys(this.client,t),this.tableOps=new Zs(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};function $s(e){"@babel/helpers - typeof";return $s=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},$s(e)}function ec(e,t){if($s(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if($s(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function tc(e){var t=ec(e,`string`);return $s(t)==`symbol`?t:t+``}function nc(e,t,n){return(t=tc(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function rc(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function O(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?rc(Object(n),!0).forEach(function(t){nc(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):rc(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var ic=class extends Error{constructor(e,t=`storage`,n,r){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t===`vectors`?`StorageVectorsError`:`StorageError`,this.status=n,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function ac(e){return typeof e==`object`&&!!e&&`__isStorageError`in e}var oc=class extends ic{constructor(e,t,n,r=`storage`,i){super(e,r,t,n),this.name=r===`vectors`?`StorageVectorsApiError`:`StorageApiError`,this.status=t,this.statusCode=n,this.code=i}toJSON(){return O(O({},super.toJSON()),{},{code:this.code})}},sc=class extends ic{constructor(e,t,n=`storage`){super(e,n),this.name=n===`vectors`?`StorageVectorsUnknownError`:`StorageUnknownError`,this.originalError=t}};function cc(e,t,n){let r=O({},e),i=t.toLowerCase();for(let e of Object.keys(r))e.toLowerCase()===i&&delete r[e];return r[i]=n,r}function lc(e){let t={};for(let[n,r]of Object.entries(e))t[n.toLowerCase()]=r;return t}var uc=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),dc=e=>{if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},fc=e=>{if(Array.isArray(e))return e.map(e=>fc(e));if(typeof e==`function`||e!==Object(e))return e;let t={};return Object.entries(e).forEach(([e,n])=>{let r=e.replace(/([-_][a-z])/gi,e=>e.toUpperCase().replace(/[-_]/g,``));t[r]=fc(n)}),t},pc=e=>!e||typeof e!=`string`||e.length===0||e.length>100||e.trim()!==e||e.includes(`/`)||e.includes(`\\`)?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(e),mc=e=>e.split(`/`).map(encodeURIComponent).join(`/`),hc=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error;if(typeof t.error==`object`&&t.error!==null){let e=t.error;if(typeof e.message==`string`)return e.message}}return JSON.stringify(e)},gc=async(e,t,n,r)=>{if(typeof e==`object`&&e&&`json`in e&&typeof e.json==`function`){let n=e,i=parseInt(String(n.status),10);Number.isFinite(i)||(i=500),n.json().then(e=>{let n=e?.statusCode||e?.code||i+``;t(new oc(hc(e),i,n,r,e?.code))}).catch(()=>{let e=i+``;t(new oc(n.statusText||`HTTP ${i} error`,i,e,r))})}else t(new sc(hc(e),e,r))},_c=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};if(e===`GET`||e===`HEAD`||!r)return O(O({},i),n);if(dc(r)){let e=t?.headers||{},n;for(let[t,r]of Object.entries(e))t.toLowerCase()===`content-type`&&(n=r);i.headers=cc(e,`Content-Type`,n??`application/json`),i.body=JSON.stringify(r)}else i.body=r;return t?.duplex&&(i.duplex=t.duplex),O(O({},i),n)};async function vc(e,t,n,r,i,a,o){return new Promise((s,c)=>{e(n,_c(t,r,i,a)).then(e=>{if(!e.ok)throw e;if(r?.noResolveJson)return e;if(o===`vectors`){let t=e.headers.get(`content-type`);if(e.headers.get(`content-length`)===`0`||e.status===204||!t||!t.includes(`application/json`))return{}}return e.json()}).then(e=>s(e)).catch(e=>gc(e,c,r,o))})}function yc(e=`storage`){return{get:async(t,n,r,i)=>vc(t,`GET`,n,r,i,void 0,e),post:async(t,n,r,i,a)=>vc(t,`POST`,n,i,a,r,e),put:async(t,n,r,i,a)=>vc(t,`PUT`,n,i,a,r,e),head:async(t,n,r,i)=>vc(t,`HEAD`,n,O(O({},r),{},{noResolveJson:!0}),i,void 0,e),remove:async(t,n,r,i,a)=>vc(t,`DELETE`,n,i,a,r,e)}}var{get:bc,post:xc,put:Sc,head:Cc,remove:wc}=yc(`storage`),k=yc(`vectors`),Tc=class{constructor(e,t={},n,r=`storage`){this.shouldThrowOnError=!1,this.url=e,this.headers=lc(t),this.fetch=uc(n),this.namespace=r}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=cc(this.headers,e,t),this}async handleOperation(e){var t=this;try{return{data:await e(),error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(ac(e))return{data:null,error:e};throw e}}},Ec=Symbol.toStringTag,Dc=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[Ec]=`StreamDownloadBuilder`,this.promise=null}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:(await e.downloadFn()).body,error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(ac(t))return{data:null,error:t};throw t}}},Oc=Symbol.toStringTag,kc=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[Oc]=`BlobDownloadBuilder`,this.promise=null}asStream(){return new Dc(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||=this.execute(),this.promise}async execute(){var e=this;try{return{data:await(await e.downloadFn()).blob(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(ac(t))return{data:null,error:t};throw t}}},Ac={limit:100,offset:0,sortBy:{column:`name`,order:`asc`}},jc={cacheControl:`3600`,contentType:`text/plain;charset=UTF-8`,upsert:!1},Mc=class extends Tc{constructor(e,t={},n,r){super(e,t,r,`storage`),this.bucketId=n}async uploadOrUpdate(e,t,n,r){var i=this;return i.handleOperation(async()=>{let a,o=O(O({},jc),r),s=O(O({},i.headers),e===`POST`&&{"x-upsert":String(o.upsert)}),c=o.metadata;if(typeof Blob<`u`&&n instanceof Blob?(a=new FormData,a.append(`cacheControl`,o.cacheControl),c&&a.append(`metadata`,i.encodeMetadata(c)),a.append(``,n)):typeof FormData<`u`&&n instanceof FormData?(a=n,a.has(`cacheControl`)||a.append(`cacheControl`,o.cacheControl),c&&!a.has(`metadata`)&&a.append(`metadata`,i.encodeMetadata(c))):(a=n,s[`cache-control`]=`max-age=${o.cacheControl}`,s[`content-type`]=o.contentType,c&&(s[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&a instanceof ReadableStream||a&&typeof a==`object`&&`pipe`in a&&typeof a.pipe==`function`)&&!o.duplex&&(o.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))s=cc(s,e,t);let l=i._removeEmptyFolders(t),u=i._getFinalPath(l),d=await(e==`PUT`?Sc:xc)(i.fetch,`${i.url}/object/${u}`,a,O({headers:s},o?.duplex?{duplex:o.duplex}:{}));return{path:l,id:d.Id,fullPath:d.Key}})}async upload(e,t,n){return this.uploadOrUpdate(`POST`,e,t,n)}async uploadToSignedUrl(e,t,n,r){var i=this;let a=i._removeEmptyFolders(e),o=i._getFinalPath(a),s=new URL(i.url+`/object/upload/sign/${o}`);return s.searchParams.set(`token`,t),i.handleOperation(async()=>{let e,t=O(O({},jc),r),o=O(O({},i.headers),{"x-upsert":String(t.upsert)}),c=t.metadata;if(typeof Blob<`u`&&n instanceof Blob?(e=new FormData,e.append(`cacheControl`,t.cacheControl),c&&e.append(`metadata`,i.encodeMetadata(c)),e.append(``,n)):typeof FormData<`u`&&n instanceof FormData?(e=n,e.has(`cacheControl`)||e.append(`cacheControl`,t.cacheControl),c&&!e.has(`metadata`)&&e.append(`metadata`,i.encodeMetadata(c))):(e=n,o[`cache-control`]=`max-age=${t.cacheControl}`,o[`content-type`]=t.contentType,c&&(o[`x-metadata`]=i.toBase64(i.encodeMetadata(c))),(typeof ReadableStream<`u`&&e instanceof ReadableStream||e&&typeof e==`object`&&`pipe`in e&&typeof e.pipe==`function`)&&!t.duplex&&(t.duplex=`half`)),r?.headers)for(let[e,t]of Object.entries(r.headers))o=cc(o,e,t);return{path:a,fullPath:(await Sc(i.fetch,s.toString(),e,O({headers:o},t?.duplex?{duplex:t.duplex}:{}))).Key}})}async createSignedUploadUrl(e,t){var n=this;return n.handleOperation(async()=>{let r=n._getFinalPath(e),i=O({},n.headers);t?.upsert&&(i[`x-upsert`]=`true`);let a=await xc(n.fetch,`${n.url}/object/upload/sign/${r}`,{},{headers:i}),o=new URL(n.url+a.url),s=o.searchParams.get(`token`);if(!s)throw new ic(`No token returned by API`);return{signedUrl:o.toString(),path:e,token:s}})}async update(e,t,n){return this.uploadOrUpdate(`PUT`,e,t,n)}async move(e,t,n){var r=this;return r.handleOperation(async()=>await xc(r.fetch,`${r.url}/object/move`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId},{headers:r.headers}))}async copy(e,t,n){var r=this;return r.handleOperation(async()=>({path:(await xc(r.fetch,`${r.url}/object/copy`,{bucketId:r.bucketId,sourceKey:e,destinationKey:t,destinationBucket:n?.destinationBucket,sourceVersionId:n?.sourceVersionId},{headers:r.headers})).Key}))}async createSignedUrl(e,t,n){var r=this;return r.handleOperation(async()=>{let i=r._getFinalPath(e),a=typeof n?.transform==`object`&&n.transform!==null&&Object.keys(n.transform).length>0,o=await xc(r.fetch,`${r.url}/object/sign/${i}`,O(O({expiresIn:t},a?{transform:n.transform}:{}),n?.versionId==null?{}:{versionId:n.versionId}),{headers:r.headers}),s=new URLSearchParams;n?.download&&s.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&s.set(`cacheNonce`,String(n.cacheNonce));let c=s.toString();return{signedUrl:encodeURI(`${r.url}${o.signedURL}${c?`&${c}`:``}`)}})}async createSignedUrls(e,t,n){var r=this;return r.handleOperation(async()=>{let i=await xc(r.fetch,`${r.url}/object/sign/${r.bucketId}`,{expiresIn:t,paths:e},{headers:r.headers}),a=new URLSearchParams;n?.download&&a.set(`download`,n.download===!0?``:n.download),n?.cacheNonce!=null&&a.set(`cacheNonce`,String(n.cacheNonce));let o=a.toString();return i.map(e=>O(O({},e),{},{signedUrl:e.signedURL?encodeURI(`${r.url}${e.signedURL}${o?`&${o}`:``}`):null}))})}download(e,t,n){let r=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image/authenticated`:`object`,i=new URLSearchParams;t?.transform&&this.applyTransformOptsToQuery(i,t.transform),t?.cacheNonce!=null&&i.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString(),o=this._getFinalPath(e);return new kc(()=>bc(this.fetch,`${this.url}/${r}/${o}${a?`?${a}`:``}`,{headers:this.headers,noResolveJson:!0},n),this.shouldThrowOnError)}async info(e,t){var n=this;let r=n._getFinalPath(e),i=new URLSearchParams;t?.versionId!=null&&i.set(`versionId`,String(t.versionId));let a=i.toString();return n.handleOperation(async()=>fc(await bc(n.fetch,`${n.url}/object/info/${r}${a?`?${a}`:``}`,{headers:n.headers})))}async exists(e){var t=this;let n=t._getFinalPath(e);try{return await Cc(t.fetch,`${t.url}/object/${n}`,{headers:t.headers}),{data:!0,error:null}}catch(e){if(t.shouldThrowOnError)throw e;if(ac(e)){let t=e instanceof oc?e.status:e instanceof sc?e.originalError?.status:void 0;if(t!==void 0&&[400,404].includes(t))return{data:!1,error:e}}throw e}}getPublicUrl(e,t){let n=this._getFinalPath(e),r=new URLSearchParams;t?.download&&r.set(`download`,t.download===!0?``:t.download),t?.transform&&this.applyTransformOptsToQuery(r,t.transform),t?.cacheNonce!=null&&r.set(`cacheNonce`,String(t.cacheNonce)),t?.versionId!=null&&r.set(`versionId`,String(t.versionId));let i=r.toString(),a=typeof t?.transform==`object`&&t.transform!==null&&Object.keys(t.transform).length>0?`render/image`:`object`;return{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${n}`)+(i?`?${i}`:``)}}}async remove(e){var t=this;return t.handleOperation(async()=>await wc(t.fetch,`${t.url}/object/${t.bucketId}`,{prefixes:e},{headers:t.headers}))}async purgeCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=mc(r._getFinalPath(e)),a=new URLSearchParams;t?.transformations&&a.set(`transformations`,`true`);let o=a.toString();return await wc(r.fetch,`${r.url}/cdn/${i}${o?`?${o}`:``}`,{},{headers:r.headers},n)})}async list(e,t,n){var r=this;return r.handleOperation(async()=>{let i=t?.sortBy?O(O({},Ac.sortBy),t.sortBy):Ac.sortBy,a=O(O(O({},Ac),t),{},{sortBy:i,prefix:e||``});return await xc(r.fetch,`${r.url}/object/list/${r.bucketId}`,a,{headers:r.headers},n)})}async listV2(e,t){var n=this;return n.handleOperation(async()=>{let r=O({},e);return await xc(n.fetch,`${n.url}/object/list-v2/${n.bucketId}`,r,{headers:n.headers},t)})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<`u`?Buffer.from(e).toString(`base64`):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,``)}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,``).replace(/\/+/g,`/`)}applyTransformOptsToQuery(e,t){return t.width&&e.set(`width`,t.width.toString()),t.height&&e.set(`height`,t.height.toString()),t.resize&&e.set(`resize`,t.resize),t.format&&e.set(`format`,t.format),t.quality&&e.set(`quality`,t.quality.toString()),e}},Nc={"X-Client-Info":`storage-js/2.117.2`},Pc=class extends Tc{constructor(e,t={},n,r){let i=new URL(e);r?.useNewHostname&&/supabase\.(co|in|red)$/.test(i.hostname)&&!i.hostname.includes(`storage.supabase.`)&&(i.hostname=i.hostname.replace(`supabase.`,`storage.supabase.`));let a=i.href.replace(/\/$/,``),o=O(O({},Nc),t);super(a,o,n,`storage`)}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=t.listBucketOptionsToQueryString(e);return await bc(t.fetch,`${t.url}/bucket${n}`,{headers:t.headers})})}async getBucket(e){var t=this;return t.handleOperation(async()=>await bc(t.fetch,`${t.url}/bucket/${e}`,{headers:t.headers}))}async createBucket(e,t={public:!1}){var n=this;return n.handleOperation(async()=>await xc(n.fetch,`${n.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async updateBucket(e,t){var n=this;return n.handleOperation(async()=>await Sc(n.fetch,`${n.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes,versioning_status:t.versioningStatus},{headers:n.headers}))}async emptyBucket(e){var t=this;return t.handleOperation(async()=>await xc(t.fetch,`${t.url}/bucket/${e}/empty`,{},{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await wc(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}async getBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await bc(t.fetch,t.bucketLifecycleUrl(e),{headers:t.headers}))}async updateBucketLifecycle(e,t){var n=this;return n.handleOperation(async()=>await Sc(n.fetch,n.bucketLifecycleUrl(e),t,{headers:n.headers}))}async deleteBucketLifecycle(e){var t=this;return t.handleOperation(async()=>await wc(t.fetch,t.bucketLifecycleUrl(e),{},{headers:t.headers}))}async purgeBucketCache(e,t,n){var r=this;return r.handleOperation(async()=>{let i=new URLSearchParams;t?.transformations&&i.set(`transformations`,`true`);let a=i.toString();return await wc(r.fetch,`${r.url}/cdn/${mc(e)}${a?`?${a}`:``}`,{},{headers:r.headers},n)})}bucketLifecycleUrl(e){return`${this.url}/bucket/${mc(e)}/lifecycle`}listBucketOptionsToQueryString(e){let t={};return e&&(`limit`in e&&(t.limit=String(e.limit)),`offset`in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?`?`+new URLSearchParams(t).toString():``}},Fc=class extends Tc{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=O(O({},Nc),t);super(r,i,n,`storage`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await xc(t.fetch,`${t.url}/bucket`,{name:e},{headers:t.headers}))}async listBuckets(e){var t=this;return t.handleOperation(async()=>{let n=new URLSearchParams;e?.limit!==void 0&&n.set(`limit`,e.limit.toString()),e?.offset!==void 0&&n.set(`offset`,e.offset.toString()),e?.sortColumn&&n.set(`sortColumn`,e.sortColumn),e?.sortOrder&&n.set(`sortOrder`,e.sortOrder),e?.search&&n.set(`search`,e.search);let r=n.toString(),i=r?`${t.url}/bucket?${r}`:`${t.url}/bucket`;return await bc(t.fetch,i,{headers:t.headers})})}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await wc(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}from(e){var t=this;if(!pc(e))throw new ic(`Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.`);let n=new Qs({baseUrl:this.url,catalogName:e,auth:{type:`custom`,getHeaders:async()=>t.headers},fetch:this.fetch}),r=this.shouldThrowOnError;return new Proxy(n,{get(e,t){let n=e[t];return typeof n==`function`?async(...t)=>{try{return{data:await n.apply(e,t),error:null}}catch(e){if(r)throw e;return{data:null,error:e}}}:n}})}},Ic=class extends Tc{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=O(O({},Nc),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createIndex(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/CreateIndex`,e,{headers:t.headers})||{})}async getIndex(e,t){var n=this;return n.handleOperation(async()=>await k.post(n.fetch,`${n.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers}))}async listIndexes(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListIndexes`,e,{headers:t.headers}))}async deleteIndex(e,t){var n=this;return n.handleOperation(async()=>await k.post(n.fetch,`${n.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:n.headers})||{})}},Lc=class extends Tc{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=O(O({},Nc),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async putVectors(e){var t=this;if(e.vectors.length<1||e.vectors.length>500)throw Error(`Vector batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/PutVectors`,e,{headers:t.headers})||{})}async getVectors(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/GetVectors`,e,{headers:t.headers}))}async listVectors(e){var t=this;if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw Error(`segmentCount must be between 1 and 16`);if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListVectors`,e,{headers:t.headers}))}async queryVectors(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/QueryVectors`,e,{headers:t.headers}))}async deleteVectors(e){var t=this;if(e.keys.length<1||e.keys.length>500)throw Error(`Keys batch size must be between 1 and 500 items`);return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/DeleteVectors`,e,{headers:t.headers})||{})}},Rc=class extends Tc{constructor(e,t={},n){let r=e.replace(/\/$/,``),i=O(O({},Nc),{},{"Content-Type":`application/json`},t);super(r,i,n,`vectors`)}async createBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}async getBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/GetVectorBucket`,{vectorBucketName:e},{headers:t.headers}))}async listBuckets(e={}){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/ListVectorBuckets`,e,{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await k.post(t.fetch,`${t.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}},zc=class extends Rc{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new Bc(this.url,this.headers,e,this.fetch)}async createBucket(e){var t=()=>super.createBucket,n=this;return t().call(n,e)}async getBucket(e){var t=()=>super.getBucket,n=this;return t().call(n,e)}async listBuckets(e={}){var t=()=>super.listBuckets,n=this;return t().call(n,e)}async deleteBucket(e){var t=()=>super.deleteBucket,n=this;return t().call(n,e)}},Bc=class extends Ic{constructor(e,t,n,r){super(e,t,r),this.vectorBucketName=n}async createIndex(e){var t=()=>super.createIndex,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName}))}async listIndexes(e={}){var t=()=>super.listIndexes,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName}))}async getIndex(e){var t=()=>super.getIndex,n=this;return t().call(n,n.vectorBucketName,e)}async deleteIndex(e){var t=()=>super.deleteIndex,n=this;return t().call(n,n.vectorBucketName,e)}index(e){return new Vc(this.url,this.headers,this.vectorBucketName,e,this.fetch)}},Vc=class extends Lc{constructor(e,t,n,r,i){super(e,t,i),this.vectorBucketName=n,this.indexName=r}async putVectors(e){var t=()=>super.putVectors,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async getVectors(e){var t=()=>super.getVectors,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async listVectors(e={}){var t=()=>super.listVectors,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async queryVectors(e){var t=()=>super.queryVectors,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}async deleteVectors(e){var t=()=>super.deleteVectors,n=this;return t().call(n,O(O({},e),{},{vectorBucketName:n.vectorBucketName,indexName:n.indexName}))}},Hc=class extends Pc{constructor(e,t={},n,r){super(e,t,n,r)}from(e){return new Mc(this.url,this.headers,e,this.fetch)}get vectors(){return new zc(this.url+`/vector`,{headers:this.headers,fetch:this.fetch})}get analytics(){return new Fc(this.url+`/iceberg`,this.headers,this.fetch)}},Uc=`2.117.2`,Wc=3e4,Gc=3*Wc,Kc=2*Wc,qc=`http://localhost:9999`,Jc=`supabase.auth.token`,Yc={"X-Client-Info":`gotrue-js/${Uc}`},Xc=`X-Supabase-Api-Version`,Zc={"2024-01-01":{timestamp:Date.parse(`2024-01-01T00:00:00.0Z`),name:`2024-01-01`}},Qc=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,$c=`sb_flow_id`,el=class extends Error{constructor(e,t,n){super(e),this.__isAuthError=!0,this.name=`AuthError`,this.status=t,this.code=n}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}};function A(e){return typeof e==`object`&&!!e&&`__isAuthError`in e}var tl=class extends el{constructor(e,t,n){super(e,t,n),this.name=`AuthApiError`,this.status=t,this.code=n}};function nl(e){return A(e)&&e.name===`AuthApiError`}var rl=class extends el{constructor(e,t){super(e),this.name=`AuthUnknownError`,this.originalError=t}},il=class extends el{constructor(e,t,n,r){super(e,n,r),this.name=t,this.status=n}},j=class extends il{constructor(){super(`Auth session missing!`,`AuthSessionMissingError`,400,void 0)}};function al(e){return A(e)&&e.name===`AuthSessionMissingError`}var ol=class extends il{constructor(){super(`Auth session or user missing`,`AuthInvalidTokenResponseError`,500,void 0)}},sl=class extends il{constructor(e){super(e,`AuthInvalidCredentialsError`,400,void 0)}},cl=class extends il{constructor(e,t=null){super(e,`AuthImplicitGrantRedirectError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}};function ll(e){return A(e)&&e.name===`AuthImplicitGrantRedirectError`}var ul=class extends il{constructor(e,t=null){super(e,`AuthPKCEGrantCodeExchangeError`,500,void 0),this.details=null,this.details=t}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}},dl=class extends il{constructor(){super(`PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.`,`AuthPKCECodeVerifierMissingError`,400,`pkce_code_verifier_not_found`)}},fl=class extends il{constructor(e,t){super(e,`AuthRetryableFetchError`,t,void 0)}};function pl(e){return A(e)&&e.name===`AuthRetryableFetchError`}var ml=class extends il{constructor(e=`Refresh result discarded: session state changed mid-flight (e.g., concurrent signOut)`){super(e,`AuthRefreshDiscardedError`,409,void 0)}};function hl(e){return A(e)&&e.name===`AuthRefreshDiscardedError`}var gl=class extends il{constructor(e,t,n){super(e,`AuthWeakPasswordError`,t,`weak_password`),this.reasons=n}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}},_l=class extends il{constructor(e){super(e,`AuthInvalidJwtError`,400,`invalid_jwt`)}},vl=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`.split(``),yl=` 	
\r=`.split(``),bl=(()=>{let e=Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<yl.length;t+=1)e[yl[t].charCodeAt(0)]=-2;for(let t=0;t<vl.length;t+=1)e[vl[t].charCodeAt(0)]=t;return e})();function xl(e,t,n){if(e!==null)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;)n(vl[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6;else if(t.queuedBits>0)for(t.queue<<=6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;)n(vl[t.queue>>t.queuedBits-6&63]),t.queuedBits-=6}function Sl(e,t,n){let r=bl[e];if(r>-1)for(t.queue=t.queue<<6|r,t.queuedBits+=6;t.queuedBits>=8;)n(t.queue>>t.queuedBits-8&255),t.queuedBits-=8;else if(r===-2)return;else throw Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}function Cl(e){let t=[],n=e=>{t.push(String.fromCodePoint(e))},r={utf8seq:0,codepoint:0},i={queue:0,queuedBits:0},a=e=>{El(e,r,n)};for(let t=0;t<e.length;t+=1)Sl(e.charCodeAt(t),i,a);return t.join(``)}function wl(e,t){if(e<=127)t(e);else if(e<=2047)t(192|e>>6),t(128|e&63);else if(e<=65535)t(224|e>>12),t(128|e>>6&63),t(128|e&63);else if(e<=1114111)t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),t(128|e&63);else throw Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}function Tl(e,t){for(let n=0;n<e.length;n+=1){let r=e.charCodeAt(n);if(r>55295&&r<=56319){let t=(r-55296)*1024&65535;r=(e.charCodeAt(n+1)-56320&65535|t)+65536,n+=1}wl(r,t)}}function El(e,t,n){if(t.utf8seq===0){if(e<=127){n(e);return}for(let n=1;n<6;n+=1)if(!(e>>7-n&1)){t.utf8seq=n;break}if(t.utf8seq===2)t.codepoint=e&31;else if(t.utf8seq===3)t.codepoint=e&15;else if(t.utf8seq===4)t.codepoint=e&7;else throw Error(`Invalid UTF-8 sequence`);--t.utf8seq}else if(t.utf8seq>0){if(e<=127)throw Error(`Invalid UTF-8 sequence`);t.codepoint=t.codepoint<<6|e&63,--t.utf8seq,t.utf8seq===0&&n(t.codepoint)}}function Dl(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};for(let t=0;t<e.length;t+=1)Sl(e.charCodeAt(t),n,r);return new Uint8Array(t)}function Ol(e){let t=[];return Tl(e,e=>t.push(e)),new Uint8Array(t)}function kl(e){let t=[],n={queue:0,queuedBits:0},r=e=>{t.push(e)};return e.forEach(e=>xl(e,n,r)),xl(null,n,r),t.join(``)}function Al(e){return Math.round(Date.now()/1e3)+e}function jl(){return Symbol(`auth-callback`)}var M=()=>typeof window<`u`&&typeof document<`u`,Ml={tested:!1,writable:!1},Nl=()=>{if(!M())return!1;try{if(typeof globalThis.localStorage!=`object`)return!1}catch{return!1}if(Ml.tested)return Ml.writable;let e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),Ml.tested=!0,Ml.writable=!0}catch{Ml.tested=!0,Ml.writable=!1}return Ml.writable};function Pl(e){let t={},n=new URL(e);if(n.hash&&n.hash[0]===`#`)try{new URLSearchParams(n.hash.substring(1)).forEach((e,n)=>{t[n]=e})}catch{}return n.searchParams.forEach((e,n)=>{t[n]=e}),t}var Fl=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Il=e=>typeof e==`object`&&!!e&&`status`in e&&`ok`in e&&`json`in e&&typeof e.json==`function`,Ll=async(e,t,n)=>{await e.setItem(t,JSON.stringify(n))},N=async(e,t)=>{let n=await e.getItem(t);if(!n)return null;try{return JSON.parse(n)}catch{return null}},P=async(e,t)=>{await e.removeItem(t)},Rl=class e{constructor(){this.promise=new e.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}};Rl.promiseConstructor=Promise;function zl(e){let t=e.split(`.`);if(t.length!==3)throw new _l(`Invalid JWT structure`);for(let e=0;e<t.length;e++)if(!Qc.test(t[e]))throw new _l(`JWT not in base64url format`);return{header:JSON.parse(Cl(t[0])),payload:JSON.parse(Cl(t[1])),signature:Dl(t[2]),raw:{header:t[0],payload:t[1]}}}async function Bl(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}function Vl(e,t){return new Promise((n,r)=>{(async()=>{for(let i=0;i<1/0;i++)try{let r=await e(i);if(!t(i,null,r)){n(r);return}}catch(e){if(!t(i,e)){r(e);return}}})()})}function Hl(e){return(`0`+e.toString(16)).substr(-2)}function Ul(){let e=new Uint32Array(56);if(typeof crypto>`u`){let e=``;for(let t=0;t<56;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~`.charAt(Math.floor(Math.random()*66));return e}return crypto.getRandomValues(e),Array.from(e,Hl).join(``)}async function Wl(e){let t=new TextEncoder().encode(e),n=await crypto.subtle.digest(`SHA-256`,t),r=new Uint8Array(n);return Array.from(r).map(e=>String.fromCharCode(e)).join(``)}async function Gl(e){if(typeof crypto>`u`||crypto.subtle===void 0||typeof TextEncoder>`u`)return console.warn(`WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.`),e;let t=await Wl(e);return btoa(t).replace(/\+/g,`-`).replace(/\//g,`_`).replace(/=+$/,``)}var Kl=/^[a-zA-Z0-9_-]{8,64}$/;function ql(e){return typeof e==`string`&&Kl.test(e)?e:null}function Jl(){if(typeof crypto<`u`&&typeof crypto.getRandomValues==`function`){let e=new Uint8Array(16);return crypto.getRandomValues(e),Array.from(e,Hl).join(``)}let e=``;for(let t=0;t<32;t++)e+=Math.floor(Math.random()*16).toString(16);return e}var Yl=(e,t)=>`${e}-flow-${t}-code-verifier`,Xl=e=>`${e}-flows-code-verifier`;async function Zl(e,t){let n=await N(e,Xl(t));return Array.isArray(n)?n.filter(e=>ql(e)!==null):[]}async function Ql(e,t,n,r,i){await Ll(e,Yl(t,n),r);let a=(await Zl(e,t)).filter(e=>e!==n);for(a.push(n);a.length>5;){let n=a.shift();await P(e,Yl(t,n)),i?.(n)}await Ll(e,Xl(t),a),await Ll(e,`${t}-code-verifier`,r)}async function $l(e,t,n){if(n){let r=await N(e,Yl(t,n));return{verifier:typeof r==`string`?r:null,flowId:n}}let r=await N(e,`${t}-code-verifier`);return{verifier:typeof r==`string`?r:null,flowId:null}}async function eu(e,t,n){let r=`${t}-code-verifier`;if(!n){await P(e,r);return}let i=Yl(t,n),a=await N(e,i);await P(e,i);let o=await Zl(e,t),s=o.filter(e=>e!==n);s.length!==o.length&&(s.length>0?await Ll(e,Xl(t),s):await P(e,Xl(t))),a!=null&&a===await N(e,r)&&await P(e,r)}async function tu(e,t){let n=await Zl(e,t);for(let r of n)await P(e,Yl(t,r));await P(e,Xl(t)),await P(e,`${t}-code-verifier`)}function nu(e,t){let n=e.indexOf(`#`),r=n===-1?e:e.slice(0,n),i=n===-1?``:e.slice(n),a=r.indexOf(`?`);if(a!==-1){let e=r.slice(0,a),t=r.slice(a+1).split(`&`).filter(e=>e!==``&&e!==`sb_flow_id`&&!e.startsWith(`sb_flow_id=`));r=t.length>0?`${e}?${t.join(`&`)}`:e}let o=r.includes(`?`)?`&`:`?`;return`${r}${o}${$c}=${encodeURIComponent(t)}${i}`}async function ru(e,t,n=!1,r){let i=Ul(),a=i;n&&(a+=`/recovery`);let o=Jl();await Ql(e,t,o,a,r);let s=await Gl(i);return[s,i===s?`plain`:`s256`,o]}var iu=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function au(e){let t=e.headers.get(Xc);if(!t||!t.match(iu))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch{return null}}function ou(e){if(!e)throw Error(`Missing exp claim`);if(e<=Math.floor(Date.now()/1e3))throw Error(`JWT has expired`)}function su(e){switch(e){case`RS256`:return{name:`RSASSA-PKCS1-v1_5`,hash:{name:`SHA-256`}};case`ES256`:return{name:`ECDSA`,namedCurve:`P-256`,hash:{name:`SHA-256`}};default:throw Error(`Invalid alg claim`)}}var cu=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;function lu(e){if(!cu.test(e))throw Error(`@supabase/auth-js: Expected parameter to be UUID but is not`)}function uu(e){if(!e.recoveryCodes)throw Error("@supabase/auth-js: the MFA recovery codes API is experimental and disabled by default. Enable it by passing `auth: { experimental: { recoveryCodes: true } }` to createClient (or to the GoTrueClient constructor).")}function du(){return new Proxy({},{get:(e,t)=>{if(t===`__isUserNotAvailableProxy`)return!0;if(typeof t==`symbol`){let e=t.toString();if(e===`Symbol(Symbol.toPrimitive)`||e===`Symbol(Symbol.toStringTag)`||e===`Symbol(util.inspect.custom)`)return}throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function fu(e,t){return new Proxy(e,{get:(e,n,r)=>{if(n===`__isInsecureUserWarningProxy`)return!0;if(typeof n==`symbol`){let t=n.toString();if(t===`Symbol(Symbol.toPrimitive)`||t===`Symbol(Symbol.toStringTag)`||t===`Symbol(util.inspect.custom)`||t===`Symbol(nodejs.util.inspect.custom)`)return Reflect.get(e,n,r)}return!t.value&&typeof n==`string`&&(console.warn(`Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.`),t.value=!0),Reflect.get(e,n,r)}})}function pu(e){return JSON.parse(JSON.stringify(e))}var mu=e=>{if(typeof e==`object`&&e){let t=e;if(typeof t.msg==`string`)return t.msg;if(typeof t.message==`string`)return t.message;if(typeof t.error_description==`string`)return t.error_description;if(typeof t.error==`string`)return t.error}return JSON.stringify(e)},hu=[500,501,502,503,504,520,521,522,523,524,525,526,527,528,529,530];async function gu(e){if(!Il(e))throw new fl(mu(e),0);let t;try{t=await e.json()}catch(t){throw hu.includes(e.status)?new fl(e.statusText||`HTTP ${e.status}`,e.status):new rl(mu(t),t)}if(hu.includes(e.status))throw new fl(mu(t),e.status);let n,r=au(e);if(r&&r.getTime()>=Zc[`2024-01-01`].timestamp&&typeof t==`object`&&t&&typeof t.code==`string`?n=t.code:typeof t==`object`&&t&&typeof t.error_code==`string`&&(n=t.error_code),!n){if(typeof t==`object`&&t&&typeof t.weak_password==`object`&&t.weak_password&&Array.isArray(t.weak_password.reasons)&&t.weak_password.reasons.length&&t.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0))throw new gl(mu(t),e.status,t.weak_password.reasons)}else if(n===`weak_password`)throw new gl(mu(t),e.status,t.weak_password?.reasons||[]);else if(n===`session_not_found`)throw new j;throw new tl(mu(t),e.status||500,n)}var _u=(e,t,n,r)=>{let i={method:e,headers:t?.headers||{}};return e===`GET`?i:(i.headers=Object.assign({"Content-Type":`application/json;charset=UTF-8`},t?.headers),i.body=JSON.stringify(r),Object.assign(Object.assign({},i),n))};async function F(e,t,n,r){let i=Object.assign({},r?.headers);i[`X-Supabase-Api-Version`]||(i[Xc]=Zc[`2024-01-01`].name),r?.jwt&&(i.Authorization=`Bearer ${r.jwt}`);let a=r?.query??{};r?.redirectTo&&(a.redirect_to=r.redirectTo);let o=await vu(e,t,n+(Object.keys(a).length?`?`+new URLSearchParams(a).toString():``),{headers:i,noResolveJson:r?.noResolveJson},{},r?.body);return r?.xform?r?.xform(o):{data:Object.assign({},o),error:null}}async function vu(e,t,n,r,i,a){let o=_u(t,r,i,a),s;try{s=await e(n,Object.assign({},o))}catch(e){throw new fl(mu(e),0)}if(s.ok||await gu(s),r?.noResolveJson)return s;try{return await s.json()}catch(e){await gu(e)}}function I(e){let t=null;wu(e)&&(t=Object.assign({},e),e.expires_at||(t.expires_at=Al(e.expires_in)));let n=e.user??(typeof e?.id==`string`?e:null);return{data:{session:t,user:n},error:null}}function yu(e){let t=I(e);return!t.error&&e.weak_password&&typeof e.weak_password==`object`&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&typeof e.weak_password.message==`string`&&e.weak_password.reasons.reduce((e,t)=>e&&typeof t==`string`,!0)&&(t.data.weak_password=e.weak_password),t}function bu(e){return{data:{user:e.user??e},error:null}}function xu(e){return{data:e,error:null}}function Su(e){let{action_link:t,email_otp:n,hashed_token:r,redirect_to:i,verification_type:a}=e,o=qa(e,[`action_link`,`email_otp`,`hashed_token`,`redirect_to`,`verification_type`]);return{data:{properties:{action_link:t,email_otp:n,hashed_token:r,redirect_to:i,verification_type:a},user:Object.assign({},o)},error:null}}function Cu(e){return e}function wu(e){return!!e.access_token&&!!e.refresh_token&&!!e.expires_in}var Tu=[`global`,`local`,`others`],Eu=class{constructor({url:e=``,headers:t={},fetch:n,experimental:r}){this.url=e,this.headers=t,this.fetch=Fl(n),this.experimental=r??{},this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)},this.passkey={listPasskeys:this._adminListPasskeys.bind(this),deletePasskey:this._adminDeletePasskey.bind(this)}}async signOut(e,t=Tu[0]){if(Tu.indexOf(t)<0)throw Error(`@supabase/auth-js: Parameter scope must be one of ${Tu.join(`, `)}`);try{return await F(this.fetch,`POST`,`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async inviteUserByEmail(e,t={}){try{return await F(this.fetch,`POST`,`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:bu})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async generateLink(e){try{let{options:t}=e,n=qa(e,[`options`]),r=Object.assign(Object.assign({},n),t);return`newEmail`in n&&(r.new_email=n?.newEmail,delete r.newEmail),await F(this.fetch,`POST`,`${this.url}/admin/generate_link`,{body:r,headers:this.headers,xform:Su,redirectTo:t?.redirectTo})}catch(e){if(A(e))return{data:{properties:null,user:null},error:e};throw e}}async createUser(e){try{return await F(this.fetch,`POST`,`${this.url}/admin/users`,{body:e,headers:this.headers,xform:bu})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async listUsers(e){try{let t={nextPage:null,lastPage:0,total:0},n=await F(this.fetch,`GET`,`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:Cu});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(A(e))return{data:{users:[]},error:e};throw e}}async getUserById(e){lu(e);try{return await F(this.fetch,`GET`,`${this.url}/admin/users/${e}`,{headers:this.headers,xform:bu})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async updateUserById(e,t){lu(e);try{return await F(this.fetch,`PUT`,`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:bu})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async deleteUser(e,t=!1){lu(e);try{return await F(this.fetch,`DELETE`,`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:bu})}catch(e){if(A(e))return{data:{user:null},error:e};throw e}}async _listFactors(e){lu(e.userId);try{let{data:t,error:n}=await F(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:e=>({data:{factors:e},error:null})});return{data:t,error:n}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteFactor(e){lu(e.userId),lu(e.id);try{return{data:await F(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _listOAuthClients(e){try{let t={nextPage:null,lastPage:0,total:0},n=await F(this.fetch,`GET`,`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(e?.page)?.toString()??``,per_page:(e?.perPage)?.toString()??``},xform:Cu});if(n.error)throw n.error;let r=await n.json(),i=n.headers.get(`x-total-count`)??0,a=n.headers.get(`link`)?.split(`,`)??[];return a.length>0&&(a.forEach(e=>{let n=parseInt(e.split(`;`)[0].split(`=`)[1].substring(0,1)),r=JSON.parse(e.split(`;`)[1].split(`=`)[1]);t[`${r}Page`]=n}),t.total=parseInt(i)),{data:Object.assign(Object.assign({},r),t),error:null}}catch(e){if(A(e))return{data:{clients:[]},error:e};throw e}}async _createOAuthClient(e){try{return await F(this.fetch,`POST`,`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _getOAuthClient(e){try{return await F(this.fetch,`GET`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _updateOAuthClient(e,t){try{return await F(this.fetch,`PUT`,`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteOAuthClient(e){try{return await F(this.fetch,`DELETE`,`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _regenerateOAuthClientSecret(e){try{return await F(this.fetch,`POST`,`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _listCustomProviders(e){try{let t={};return e?.type&&(t.type=e.type),await F(this.fetch,`GET`,`${this.url}/admin/custom-providers`,{headers:this.headers,query:t,xform:e=>({data:{providers:e?.providers??[]},error:null})})}catch(e){if(A(e))return{data:{providers:[]},error:e};throw e}}async _createCustomProvider(e){try{return await F(this.fetch,`POST`,`${this.url}/admin/custom-providers`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _getCustomProvider(e){try{return await F(this.fetch,`GET`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _updateCustomProvider(e,t){try{return await F(this.fetch,`PUT`,`${this.url}/admin/custom-providers/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _deleteCustomProvider(e){try{return await F(this.fetch,`DELETE`,`${this.url}/admin/custom-providers/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}async _adminListPasskeys(e){lu(e.userId);try{return await F(this.fetch,`GET`,`${this.url}/admin/users/${e.userId}/passkeys`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(A(e))return{data:null,error:e};throw e}}async _adminDeletePasskey(e){lu(e.userId),lu(e.passkeyId);try{return await F(this.fetch,`DELETE`,`${this.url}/admin/users/${e.userId}/passkeys/${e.passkeyId}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(A(e))return{data:null,error:e};throw e}}};function Du(e={}){return{getItem:t=>e[t]||null,setItem:(t,n)=>{e[t]=n},removeItem:t=>{delete e[t]}}}globalThis&&Nl()&&globalThis.localStorage&&globalThis.localStorage.getItem(`supabase.gotrue-js.locks.debug`);var Ou=class extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}};function ku(){if(typeof globalThis!=`object`)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<`u`&&(self.globalThis=self)}}function Au(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function ju(e){return parseInt(e,16)}function Mu(e){let t=new TextEncoder().encode(e);return`0x`+Array.from(t,e=>e.toString(16).padStart(2,`0`)).join(``)}function Nu(e){let{chainId:t,domain:n,expirationTime:r,issuedAt:i=new Date,nonce:a,notBefore:o,requestId:s,resources:c,scheme:l,uri:u,version:d}=e;if(!Number.isInteger(t))throw Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${t}`);if(!n)throw Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);if(a&&a.length<8)throw Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${a}`);if(!u)throw Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);if(d!==`1`)throw Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(e.statement?.includes(`
`))throw Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`);let f=Au(e.address),p=`${l?`${l}://${n}`:n} wants you to sign in with your Ethereum account:\n${f}\n\n${e.statement?`${e.statement}\n`:``}`,m=`URI: ${u}\nVersion: ${d}\nChain ID: ${t}${a?`\nNonce: ${a}`:``}\nIssued At: ${i.toISOString()}`;if(r&&(m+=`\nExpiration Time: ${r.toISOString()}`),o&&(m+=`\nNot Before: ${o.toISOString()}`),s&&(m+=`\nRequest ID: ${s}`),c){let e=`
Resources:`;for(let t of c){if(!t||typeof t!=`string`)throw Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`);e+=`\n- ${t}`}m+=e}return`${p}\n${m}`}var L=class extends Error{constructor({message:e,code:t,cause:n,name:r}){super(e,{cause:n}),this.__isWebAuthnError=!0,this.name=r??(n instanceof Error?n.name:void 0)??`Unknown Error`,this.code=t}toJSON(){return{name:this.name,message:this.message,code:this.code}}},Pu=class extends L{constructor(e,t){super({code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:t,message:e}),this.name=`WebAuthnUnknownError`,this.originalError=t}};function Fu({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new L({message:`Registration ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`ConstraintError`){if(n.authenticatorSelection?.requireResidentKey===!0)return new L({message:`Discoverable credentials were required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT`,cause:e});if(t.mediation===`conditional`&&n.authenticatorSelection?.userVerification===`required`)return new L({message:`User verification was required during automatic registration but it could not be performed`,code:`ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE`,cause:e});if(n.authenticatorSelection?.userVerification===`required`)return new L({message:`User verification was required but no available authenticator supported it`,code:`ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT`,cause:e})}else if(e.name===`InvalidStateError`)return new L({message:`The authenticator was previously registered`,code:`ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED`,cause:e});else if(e.name===`NotAllowedError`)return new L({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`NotSupportedError`)return n.pubKeyCredParams.filter(e=>e.type===`public-key`).length===0?new L({message:`No entry in pubKeyCredParams was of type "public-key"`,code:`ERROR_MALFORMED_PUBKEYCREDPARAMS`,cause:e}):new L({message:`No available authenticator supported any of the specified pubKeyCredParams algorithms`,code:`ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!Hu(t))return new L({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rp.id!==t)return new L({message:`The RP ID "${n.rp.id}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`TypeError`){if(n.user.id.byteLength<1||n.user.id.byteLength>64)return new L({message:`User ID was not between 1 and 64 characters`,code:`ERROR_INVALID_USER_ID_LENGTH`,cause:e})}else if(e.name===`UnknownError`)return new L({message:`The authenticator was unable to process the specified options, or could not create a new credential`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new L({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}function Iu({error:e,options:t}){let{publicKey:n}=t;if(!n)throw Error(`options was missing required publicKey property`);if(e.name===`AbortError`){if(t.signal instanceof AbortSignal)return new L({message:`Authentication ceremony was sent an abort signal`,code:`ERROR_CEREMONY_ABORTED`,cause:e})}else if(e.name===`NotAllowedError`)return new L({message:e.message,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e});else if(e.name===`SecurityError`){let t=window.location.hostname;if(!Hu(t))return new L({message:`${window.location.hostname} is an invalid domain`,code:`ERROR_INVALID_DOMAIN`,cause:e});if(n.rpId!==t)return new L({message:`The RP ID "${n.rpId}" is invalid for this domain`,code:`ERROR_INVALID_RP_ID`,cause:e})}else if(e.name===`UnknownError`)return new L({message:`The authenticator was unable to process the specified options, or could not create a new assertion signature`,code:`ERROR_AUTHENTICATOR_GENERAL_ERROR`,cause:e});return new L({message:`a Non-Webauthn related error has occurred`,code:`ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY`,cause:e})}var Lu=new class{createNewAbortSignal(){if(this.controller){let e=Error(`Cancelling existing WebAuthn API call for new one`);e.name=`AbortError`,this.controller.abort(e)}let e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){let e=Error(`Manually cancelling existing WebAuthn API call`);e.name=`AbortError`,this.controller.abort(e),this.controller=void 0}}};function Ru(e){if(!e)throw Error(`Credential creation options are required`);if(typeof PublicKeyCredential<`u`&&`parseCreationOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON==`function`)return PublicKeyCredential.parseCreationOptionsFromJSON(e);let{challenge:t,user:n,excludeCredentials:r}=e,i=qa(e,[`challenge`,`user`,`excludeCredentials`]),a=Dl(t).buffer,o=Object.assign(Object.assign({},n),{id:Dl(n.id).buffer}),s=Object.assign(Object.assign({},i),{challenge:a,user:o});if(r&&r.length>0){s.excludeCredentials=Array(r.length);for(let e=0;e<r.length;e++){let t=r[e];s.excludeCredentials[e]=Object.assign(Object.assign({},t),{id:Dl(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return s}function zu(e){if(!e)throw Error(`Credential request options are required`);if(typeof PublicKeyCredential<`u`&&`parseRequestOptionsFromJSON`in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON==`function`)return PublicKeyCredential.parseRequestOptionsFromJSON(e);let{challenge:t,allowCredentials:n}=e,r=qa(e,[`challenge`,`allowCredentials`]),i=Dl(t).buffer,a=Object.assign(Object.assign({},r),{challenge:i});if(n&&n.length>0){a.allowCredentials=Array(n.length);for(let e=0;e<n.length;e++){let t=n[e];a.allowCredentials[e]=Object.assign(Object.assign({},t),{id:Dl(t.id).buffer,type:t.type||`public-key`,transports:t.transports})}}return a}function Bu(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e;return{id:e.id,rawId:e.id,response:{attestationObject:kl(new Uint8Array(e.response.attestationObject)),clientDataJSON:kl(new Uint8Array(e.response.clientDataJSON))},type:`public-key`,clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:t.authenticatorAttachment??void 0}}function Vu(e){if(`toJSON`in e&&typeof e.toJSON==`function`)return e.toJSON();let t=e,n=e.getClientExtensionResults(),r=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:kl(new Uint8Array(r.authenticatorData)),clientDataJSON:kl(new Uint8Array(r.clientDataJSON)),signature:kl(new Uint8Array(r.signature)),userHandle:r.userHandle?kl(new Uint8Array(r.userHandle)):void 0},type:`public-key`,clientExtensionResults:n,authenticatorAttachment:t.authenticatorAttachment??void 0}}function Hu(e){return e===`localhost`||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function Uu(){return!!(M()&&`PublicKeyCredential`in window&&window.PublicKeyCredential&&`credentials`in navigator&&typeof(navigator==null?void 0:navigator.credentials)?.create==`function`&&typeof(navigator==null?void 0:navigator.credentials)?.get==`function`)}async function Wu(e){try{let t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Pu(`Browser returned unexpected credential type`,t)}:{data:null,error:new Pu(`Empty credential response`,t)}}catch(t){return{data:null,error:Fu({error:t,options:e})}}}async function Gu(e){try{let t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Pu(`Browser returned unexpected credential type`,t)}:{data:null,error:new Pu(`Empty credential response`,t)}}catch(t){return{data:null,error:Iu({error:t,options:e})}}}var Ku={hints:[`security-key`],authenticatorSelection:{authenticatorAttachment:`cross-platform`,requireResidentKey:!1,userVerification:`preferred`,residentKey:`discouraged`},attestation:`direct`},qu={userVerification:`preferred`,hints:[`security-key`],attestation:`direct`};function Ju(...e){let t=e=>typeof e==`object`&&!!e&&!Array.isArray(e),n=e=>e instanceof ArrayBuffer||ArrayBuffer.isView(e),r={};for(let i of e)if(i)for(let e in i){let a=i[e];if(a!==void 0){if(Array.isArray(a))r[e]=a;else if(n(a))r[e]=a;else if(t(a)){let n=r[e];r[e]=t(n)?Ju(n,a):Ju(a)}else r[e]=a}}return r}function Yu(e,t){return Ju(Ku,e,t||{})}function Xu(e,t){return Ju(qu,e,t||{})}var Zu=class{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:`webauthn`}))}async _challenge({factorId:e,webauthn:t,friendlyName:n,signal:r},i){try{let{data:a,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!a)return{data:null,error:o};let s=r??Lu.createNewAbortSignal();if(a.webauthn.type===`create`){let{user:e}=a.webauthn.credential_options.publicKey;if(!e.name){let t=n;if(t)e.name=`${e.id}:${t}`;else{let t=(await this.client.getUser()).data.user,n=t?.user_metadata?.name||t?.email||t?.id||`User`;e.name=`${e.id}:${n}`}}e.displayName||=e.name}switch(a.webauthn.type){case`create`:{let{data:t,error:n}=await Wu({publicKey:Yu(a.webauthn.credential_options.publicKey,i?.create),signal:s});return t?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:t}},error:null}:{data:null,error:n}}case`request`:{let t=Xu(a.webauthn.credential_options.publicKey,i?.request),{data:n,error:r}=await Gu(Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:t,signal:s}));return n?{data:{factorId:e,challengeId:a.id,webauthn:{type:a.webauthn.type,credential_response:n}},error:null}:{data:null,error:r}}}}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new rl(`Unexpected error in challenge`,e)}}}async _verify({challengeId:e,factorId:t,webauthn:n}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:n})}async _authenticate({factorId:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new el(`rpId is required for WebAuthn authentication`)};try{if(!Uu())return{data:null,error:new rl(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:n},signal:r},{request:i});if(!a)return{data:null,error:o};let{webauthn:s}=a;return this._verify({factorId:e,challengeId:a.challengeId,webauthn:{type:s.type,rpId:t,rpOrigins:n,credential_response:s.credential_response}})}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new rl(`Unexpected error in authenticate`,e)}}}async _register({friendlyName:e,webauthn:{rpId:t=typeof window<`u`?window.location.hostname:void 0,rpOrigins:n=typeof window<`u`?[window.location.origin]:void 0,signal:r}={}},i){if(!t)return{data:null,error:new el(`rpId is required for WebAuthn registration`)};try{if(!Uu())return{data:null,error:new rl(`Browser does not support WebAuthn`,null)};let{data:a,error:o}=await this._enroll({friendlyName:e});if(!a)return await this.client.mfa.listFactors().then(t=>t.data?.all.find(t=>t.factor_type===`webauthn`&&t.friendly_name===e&&t.status===`unverified`)).then(e=>e?this.client.mfa.unenroll({factorId:e?.id}):void 0),{data:null,error:o};let{data:s,error:c}=await this._challenge({factorId:a.id,friendlyName:a.friendly_name,webauthn:{rpId:t,rpOrigins:n},signal:r},{create:i});return s?this._verify({factorId:a.id,challengeId:s.challengeId,webauthn:{rpId:t,rpOrigins:n,type:s.webauthn.type,credential_response:s.webauthn.credential_response}}):{data:null,error:c}}catch(e){return A(e)?{data:null,error:e}:{data:null,error:new rl(`Unexpected error in register`,e)}}}};ku();var Qu={url:qc,storageKey:Jc,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:Yc,flowType:`implicit`,debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1,experimental:{}},$u={},ed=!1,td=class e{get jwks(){return $u[this.storageKey]?.jwks??{keys:[]}}set jwks(e){$u[this.storageKey]=Object.assign(Object.assign({},$u[this.storageKey]),{jwks:e})}get jwks_cached_at(){return $u[this.storageKey]?.cachedAt??-(2**53-1)}set jwks_cached_at(e){$u[this.storageKey]=Object.assign(Object.assign({},$u[this.storageKey]),{cachedAt:e})}constructor(t){var n;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.lastRefreshFailure=null,this._sessionRemovalEpoch=0,this.initializePromise=null,this._pendingInitNotifications=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lock=null,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;let r=Object.assign(Object.assign({},Qu),t);if(this.storageKey=r.storageKey,this.instanceID=e.nextInstanceID[this.storageKey]??0,e.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!r.debug,typeof r.debug==`function`&&(this.logger=r.debug),this.instanceID>0&&M()){let e=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(e),this.logDebugMessages&&console.trace(e)}if(this.persistSession=r.persistSession,this.autoRefreshToken=r.autoRefreshToken,this.experimental=r.experimental??{},this.admin=new Eu({url:r.url,headers:r.headers,fetch:r.fetch,experimental:this.experimental}),this.url=r.url,this.headers=r.headers,this.fetch=Fl(r.fetch),this.detectSessionInUrl=r.detectSessionInUrl,this.flowType=r.flowType,this.hasCustomAuthorizationHeader=r.hasCustomAuthorizationHeader,this.throwOnError=r.throwOnError,this.lockAcquireTimeout=r.lockAcquireTimeout,r.lock!=null&&(this.lock=r.lock,ed||(ed=!0,console.warn(`${this._logPrefix()} The "lock" option is deprecated and will be removed in v3. The client now coordinates session refreshes without a lock, so most apps can drop the option. See https://github.com/supabase/supabase-js/blob/master/packages/core/auth-js/migrations/lockless-coordination.md`))),this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=-(2**53-1)),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Zu(this),recoveryCodes:{getStatus:this._getRecoveryCodesStatus.bind(this),generate:this._generateRecoveryCodes.bind(this),verify:this._verifyRecoveryCode.bind(this),regenerate:this._regenerateRecoveryCodes.bind(this),unenroll:this._unenrollRecoveryCodes.bind(this)}},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.passkey={startRegistration:this._startPasskeyRegistration.bind(this),verifyRegistration:this._verifyPasskeyRegistration.bind(this),startAuthentication:this._startPasskeyAuthentication.bind(this),verifyAuthentication:this._verifyPasskeyAuthentication.bind(this),list:this._listPasskeys.bind(this),update:this._updatePasskey.bind(this),delete:this._deletePasskey.bind(this)},this.persistSession?(r.storage?this.storage=r.storage:Nl()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Du(this.memoryStorage)),r.userStorage&&(this.userStorage=r.userStorage)):(this.memoryStorage={},this.storage=Du(this.memoryStorage)),M()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(e){console.error(`Failed to create a new BroadcastChannel, multi-tab state changes will not be available`,e)}(n=this.broadcastChannel)==null||n.addEventListener(`message`,async e=>{this._debug(`received broadcast notification from other tab or client`,e),(e.data.event===`TOKEN_REFRESHED`||e.data.event===`SIGNED_IN`)&&(this.lastRefreshFailure=null);try{await this._notifyAllSubscribers(e.data.event,e.data.session,!1)}catch(e){this._debug(`#broadcastChannel`,`error`,e)}})}r.skipAutoInitialize||this.initialize().catch(e=>{this._debug(`#initialize()`,`error`,e)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${Uc}) ${new Date().toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){if(this.initializePromise)return await this.initializePromise;this._pendingInitNotifications=[],this.initializePromise=(async()=>this.lock==null?await this._initialize():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))();let e=await this.initializePromise,t=this._pendingInitNotifications??[];this._pendingInitNotifications=null;for(let e of t)await this._notifyAllSubscribers(e.event,e.session,e.broadcast);return e}async _initialize(){try{let e={},t=`none`;if(M()&&(e=Pl(window.location.href),this._isImplicitGrantCallback(e)?t=`implicit`:await this._isPKCECallback(e)&&(t=`pkce`)),M()&&this.detectSessionInUrl&&t!==`none`){let{data:n,error:r}=await this._getSessionFromURL(e,t);if(r){if(this._debug(`#_initialize()`,`error detecting session from URL`,r),ll(r)){let e=r.details?.code;if(e===`identity_already_exists`||e===`identity_not_found`||e===`single_identity_not_deletable`)return{error:r}}return{error:r}}let{session:i,redirectType:a}=n;return this._debug(`#_initialize()`,`detected session in URL`,i,`redirect type`,a),await this._saveSession(i),setTimeout(async()=>{a===`recovery`?await this._notifyAllSubscribers(`PASSWORD_RECOVERY`,i):await this._notifyAllSubscribers(`SIGNED_IN`,i)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(e){return A(e)?this._returnResult({error:e}):this._returnResult({error:new rl(`Unexpected error during initialization`,e)})}finally{await this._handleVisibilityChange(),this._debug(`#_initialize()`,`end`)}}async signInAnonymously(e){try{let{data:t,error:n}=await F(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{data:e?.options?.data??{},gotrue_meta_security:{captcha_token:e?.options?.captchaToken}},xform:I});if(n||!t)return this._returnResult({data:{user:null,session:null},error:n});let r=t.session,i=t.user;return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,r)),this._returnResult({data:{user:i,session:r},error:null})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signUp(e){let t=null;try{let n;if(`email`in e){let{email:r,password:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod()),n=await F(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t),body:{email:r,password:i,data:a?.data??{},gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},xform:I})}else if(`phone`in e){let{phone:t,password:r,options:i}=e;n=await F(this.fetch,`POST`,`${this.url}/signup`,{headers:this.headers,body:{phone:t,password:r,data:i?.data??{},channel:i?.channel??`sms`,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:I})}else throw new sl(`You must provide either an email or phone number and a password`);let{data:r,error:i}=n;if(i||!r)return await eu(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:i});let a=r.session,o=r.user;return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(await eu(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithPassword(e){try{let t;if(`email`in e){let{email:n,password:r,options:i}=e;t=await F(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:yu})}else if(`phone`in e){let{phone:n,password:r,options:i}=e;t=await F(this.fetch,`POST`,`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:n,password:r,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:yu})}else throw new sl(`You must provide either an email or phone number and a password`);let{data:n,error:r}=t;if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!n||!n.session||!n.user){let e=new ol;return this._returnResult({data:{user:null,session:null},error:e})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers(`SIGNED_IN`,n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:r})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOAuth(e){return await this._handleProviderSignIn(e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:e.options?.skipBrowserRedirect})}async exchangeCodeForSession(e,t){return await this.initializePromise,this.lock==null?this._exchangeCodeForSession(e,t):this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(e,t))}async signInWithWeb3(e){let{chain:t}=e;switch(t){case`ethereum`:return await this.signInWithEthereum(e);case`solana`:return await this.signInWithSolana(e);default:throw Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!M()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`ethereum`in e&&typeof e.ethereum==`object`&&`request`in e.ethereum&&typeof e.ethereum.request==`function`)s=e.ethereum;else throw Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href),l=await s.request({method:`eth_requestAccounts`}).then(e=>e).catch(()=>{throw Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`)});if(!l||l.length===0)throw Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);let u=Au(l[0]),d=o?.signInWithEthereum?.chainId;d||=ju(await s.request({method:`eth_chainId`})),t=Nu({domain:c.host,address:u,statement:a,uri:c.href,version:`1`,chainId:d,nonce:o?.signInWithEthereum?.nonce,issuedAt:o?.signInWithEthereum?.issuedAt??new Date,expirationTime:o?.signInWithEthereum?.expirationTime,notBefore:o?.signInWithEthereum?.notBefore,requestId:o?.signInWithEthereum?.requestId,resources:o?.signInWithEthereum?.resources}),n=await s.request({method:`personal_sign`,params:[Mu(t),u]})}try{let{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`ethereum`,message:t,signature:n},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:I});if(i)throw i;if(!r||!r.session||!r.user){let e=new ol;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSolana(e){let t,n;if(`message`in e)t=e.message,n=e.signature;else{let{chain:r,wallet:i,statement:a,options:o}=e,s;if(!M()){if(typeof i!=`object`||!o?.url)throw Error(`@supabase/auth-js: Both wallet and url must be specified in non-browser environments.`);s=i}else if(typeof i==`object`)s=i;else{let e=window;if(`solana`in e&&typeof e.solana==`object`&&(`signIn`in e.solana&&typeof e.solana.signIn==`function`||`signMessage`in e.solana&&typeof e.solana.signMessage==`function`))s=e.solana;else throw Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`)}let c=new URL(o?.url??window.location.href);if(`signIn`in s&&s.signIn){let e=await s.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},o?.signInWithSolana),{version:`1`,domain:c.host,uri:c.href}),a?{statement:a}:null)),r;if(Array.isArray(e)&&e[0]&&typeof e[0]==`object`)r=e[0];else if(e&&typeof e==`object`&&`signedMessage`in e&&`signature`in e)r=e;else throw Error(`@supabase/auth-js: Wallet method signIn() returned unrecognized value`);if(`signedMessage`in r&&`signature`in r&&(typeof r.signedMessage==`string`||r.signedMessage instanceof Uint8Array)&&r.signature instanceof Uint8Array)t=typeof r.signedMessage==`string`?r.signedMessage:new TextDecoder().decode(r.signedMessage),n=r.signature;else throw Error(`@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields`)}else{if(!(`signMessage`in s)||typeof s.signMessage!=`function`||!(`publicKey`in s)||typeof s!=`object`||!s.publicKey||!(`toBase58`in s.publicKey)||typeof s.publicKey.toBase58!=`function`)throw Error(`@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API`);t=[`${c.host} wants you to sign in with your Solana account:`,s.publicKey.toBase58(),...a?[``,a,``]:[``],`Version: 1`,`URI: ${c.href}`,`Issued At: ${o?.signInWithSolana?.issuedAt??new Date().toISOString()}`,...o?.signInWithSolana?.notBefore?[`Not Before: ${o.signInWithSolana.notBefore}`]:[],...o?.signInWithSolana?.expirationTime?[`Expiration Time: ${o.signInWithSolana.expirationTime}`]:[],...o?.signInWithSolana?.chainId?[`Chain ID: ${o.signInWithSolana.chainId}`]:[],...o?.signInWithSolana?.nonce?[`Nonce: ${o.signInWithSolana.nonce}`]:[],...o?.signInWithSolana?.requestId?[`Request ID: ${o.signInWithSolana.requestId}`]:[],...o?.signInWithSolana?.resources?.length?[`Resources`,...o.signInWithSolana.resources.map(e=>`- ${e}`)]:[]].join(`
`);let e=await s.signMessage(new TextEncoder().encode(t),`utf8`);if(!e||!(e instanceof Uint8Array))throw Error(`@supabase/auth-js: Wallet signMessage() API returned an recognized value`);n=e}}try{let{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:`solana`,message:t,signature:kl(n)},e.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options?.captchaToken}}:null),xform:I});if(i)throw i;if(!r||!r.session||!r.user){let e=new ol;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers(`SIGNED_IN`,r.session)),this._returnResult({data:Object.assign({},r),error:i})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _exchangeCodeForSession(e,t){let n=t?.flowId!=null,r=n?ql(t?.flowId):M()?ql(Pl(window.location.href)[$c]):null;n&&!r&&this._debug(`#_exchangeCodeForSession()`,`provided flowId is not a valid flow id`,t?.flowId);let{verifier:i,flowId:a}=n&&!r?{verifier:null,flowId:null}:await $l(this.storage,this.storageKey,r),[o,s]=(i??``).split(`/`);try{if(!o&&this.flowType===`pkce`)throw new dl;let{data:t,error:n}=await F(this.fetch,`POST`,`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:o},xform:I});if(await eu(this.storage,this.storageKey,a),n)throw n;if(!t||!t.session||!t.user){let e=new ol;return this._returnResult({data:{user:null,session:null,redirectType:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(s===`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,t.session)),this._returnResult({data:Object.assign(Object.assign({},t),{redirectType:s??null}),error:n})}catch(e){if(await eu(this.storage,this.storageKey,a),A(e))return this._returnResult({data:{user:null,session:null,redirectType:null},error:e});throw e}}async signInWithIdToken(e){try{let{options:t,provider:n,token:r,access_token:i,nonce:a}=e,{data:o,error:s}=await F(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:r,access_token:i,nonce:a,gotrue_meta_security:{captcha_token:t?.captchaToken}},xform:I});if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!o||!o.session||!o.user){let e=new ol;return this._returnResult({data:{user:null,session:null},error:e})}return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers(`SIGNED_IN`,o.session)),this._returnResult({data:o,error:s})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOtp(e){let t=null;try{if(`email`in e){let{email:n,options:r}=e,i=null,a=null;this.flowType===`pkce`&&([i,a,t]=await this._getCodeChallengeAndMethod());let{error:o}=await F(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{email:n,data:r?.data??{},create_user:r?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:r?.captchaToken},code_challenge:i,code_challenge_method:a},redirectTo:this._maybeAppendFlowIdToRedirect(r?.emailRedirectTo,t)});return this._returnResult({data:{user:null,session:null},error:o})}if(`phone`in e){let{phone:t,options:n}=e,{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/otp`,{headers:this.headers,body:{phone:t,data:n?.data??{},create_user:n?.shouldCreateUser??!0,gotrue_meta_security:{captcha_token:n?.captchaToken},channel:n?.channel??`sms`}});return this._returnResult({data:{user:null,session:null,messageId:r?.message_id},error:i})}throw new sl(`You must provide either an email or phone number.`)}catch(e){if(await eu(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async verifyOtp(e){try{let t,n;`options`in e&&(t=e.options?.redirectTo,n=e.options?.captchaToken);let{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:n}}),redirectTo:t,xform:I});if(i)throw i;if(!r)throw Error(`An error occurred on token verification.`);let a=r.session,o=r.user;return a?.access_token&&(await this._saveSession(a),await this._notifyAllSubscribers(e.type==`recovery`?`PASSWORD_RECOVERY`:`SIGNED_IN`,a)),this._returnResult({data:{user:o,session:a},error:null})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSSO(e){let t=null;try{let n=null,r=null;this.flowType===`pkce`&&([n,r,t]=await this._getCodeChallengeAndMethod());let i=await F(this.fetch,`POST`,`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},`providerId`in e?{provider_id:e.providerId}:null),`domain`in e?{domain:e.domain}:null),{redirect_to:this._maybeAppendFlowIdToRedirect(e.options?.redirectTo,t)}),e?.options?.captchaToken?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:n,code_challenge_method:r}),headers:this.headers,xform:xu});return i.data?.url&&M()&&!e.options?.skipBrowserRedirect&&window.location.assign(i.data.url),this._returnResult(i)}catch(e){if(await eu(this.storage,this.storageKey,t),A(e))return this._returnResult({data:null,error:e});throw e}}async reauthenticate(){return await this.initializePromise,this.lock==null?await this._reauthenticate():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)throw n;if(!t)throw new j;let{error:r}=await F(this.fetch,`GET`,`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:r})})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){let t=null;try{let n=`${this.url}/resend`;if(`email`in e){let{email:r,type:i,options:a}=e,o=null,s=null;this.flowType===`pkce`&&([o,s,t]=await this._getCodeChallengeAndMethod());let{error:c}=await F(this.fetch,`POST`,n,{headers:this.headers,body:{email:r,type:i,gotrue_meta_security:{captcha_token:a?.captchaToken},code_challenge:o,code_challenge_method:s},redirectTo:this._maybeAppendFlowIdToRedirect(a?.emailRedirectTo,t)});return c&&await eu(this.storage,this.storageKey,t),this._returnResult({data:{user:null,session:null},error:c})}if(`phone`in e){let{phone:t,type:r,options:i}=e,{data:a,error:o}=await F(this.fetch,`POST`,n,{headers:this.headers,body:{phone:t,type:r,gotrue_meta_security:{captcha_token:i?.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:a?.message_id},error:o})}throw new sl(`You must provide either an email or phone number and a type`)}catch(e){if(await eu(this.storage,this.storageKey,t),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async getSession(){return await this.initializePromise,this.lock==null?await this._useSession(async e=>e):await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async e=>e))}async _acquireLock(e,t){this._debug(`#_acquireLock`,`begin`,e);try{if(this.lockAcquired){let e=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),n=(async()=>(await e,await t()))();return this.pendingInLock.push((async()=>{try{await n}catch{}})()),n}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug(`#_acquireLock`,`lock acquired for storage key`,this.storageKey);try{this.lockAcquired=!0;let e=t();for(this.pendingInLock.push((async()=>{try{await e}catch{}})()),await e;this.pendingInLock.length;){let e=[...this.pendingInLock];await Promise.all(e),this.pendingInLock.splice(0,e.length)}return await e}finally{this._debug(`#_acquireLock`,`lock released for storage key`,this.storageKey),this.lockAcquired=!1}})}finally{this._debug(`#_acquireLock`,`end`)}}async _useSession(e){this._debug(`#_useSession`,`begin`);try{return await e(await this.__loadSession())}finally{this._debug(`#_useSession`,`end`)}}async __loadSession(){this._debug(`#__loadSession()`,`begin`),this.lock!=null&&!this.lockAcquired&&this._debug(`#__loadSession()`,`used outside of an acquired lock!`,Error().stack);try{let e=null,t=await N(this.storage,this.storageKey);if(this._debug(`#getSession()`,`session from storage`,t),t!==null&&(this._isValidSession(t)?e=t:(this._debug(`#getSession()`,`session from storage is not valid`),await this._removeSession())),!e)return{data:{session:null},error:null};let n=e.expires_at?e.expires_at*1e3-Date.now()<Gc:!1;if(this._debug(`#__loadSession()`,`session has${n?``:` not`} expired`,`expires_at`,e.expires_at),!n)return{data:{session:await this._hydrateSessionUser(e)},error:null};let{data:r,error:i}=await this._callRefreshToken(e.refresh_token);if(i){let e=await N(this.storage,this.storageKey);return e&&this._isValidSession(e)&&e.expires_at&&e.expires_at*1e3>Date.now()?this._returnResult({data:{session:await this._hydrateSessionUser(e)},error:null}):this._returnResult({data:{session:null},error:i})}return this._returnResult({data:{session:r},error:null})}finally{this._debug(`#__loadSession()`,`end`)}}async _hydrateSessionUser(e){if(this.userStorage){let t=await N(this.userStorage,this.storageKey+`-user`);e.user=t?.user?t.user:du()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){let t={value:this.suppressGetSessionWarning};e.user=fu(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return e}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;let t;return t=this.lock==null?await this._getUser():await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser()),t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await F(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:e,xform:bu}):await this._useSession(async e=>{let{data:t,error:n}=e;if(n)throw n;return!t.session?.access_token&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new j}:await F(this.fetch,`GET`,`${this.url}/user`,{headers:this.headers,jwt:t.session?.access_token??void 0,xform:bu})})}catch(e){if(A(e))return al(e)&&await this._removeSession(),this._returnResult({data:{user:null},error:e});throw e}}async updateUser(e,t={}){return await this.initializePromise,this.lock==null?await this._updateUser(e,t):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){let n=null;try{return await this._useSession(async r=>{let{data:i,error:a}=r;if(a)throw a;if(!i.session)throw new j;let o=i.session,s=null,c=null;this.flowType===`pkce`&&e.email!=null&&([s,c,n]=await this._getCodeChallengeAndMethod());let{data:l,error:u}=await F(this.fetch,`PUT`,`${this.url}/user`,{headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t?.emailRedirectTo,n),body:Object.assign(Object.assign({},e),{code_challenge:s,code_challenge_method:c}),jwt:o.access_token,xform:bu});if(u)throw u;return o.user=l.user,await this._saveSession(o),await this._notifyAllSubscribers(`USER_UPDATED`,o),this._returnResult({data:{user:o.user},error:null})})}catch(e){if(await eu(this.storage,this.storageKey,n),A(e))return this._returnResult({data:{user:null},error:e});throw e}}async setSession(e){return await this.initializePromise,this.lock==null?await this._setSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new j;let t=Date.now()/1e3,n=t,r=!0,i=null,{payload:a}=zl(e.access_token);if(a.exp&&(n=a.exp,r=n<=t),r){let{data:t,error:n}=await this._callRefreshToken(e.refresh_token);if(n)return this._returnResult({data:{user:null,session:null},error:n});if(!t)return{data:{user:null,session:null},error:null};i=t}else{let{data:r,error:a}=await this._getUser(e.access_token);if(a)return this._returnResult({data:{user:null,session:null},error:a});i={access_token:e.access_token,refresh_token:e.refresh_token,user:r.user,token_type:`bearer`,expires_in:n-t,expires_at:n},await this._saveSession(i),await this._notifyAllSubscribers(`SIGNED_IN`,i)}return this._returnResult({data:{user:i.user,session:i},error:null})}catch(e){if(A(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}}async refreshSession(e){return await this.initializePromise,this.lock==null?await this._refreshSession(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{if(!e){let{data:n,error:r}=t;if(r)throw r;e=n.session??void 0}if(!e?.refresh_token)throw new j;let{data:n,error:r}=await this._callRefreshToken(e.refresh_token);return r?this._returnResult({data:{user:null,session:null},error:r}):n?this._returnResult({data:{user:n.user,session:n},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(e){if(A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _getSessionFromURL(e,t){try{if(!M())throw new cl(`No browser detected.`);if(e.error||e.error_description||e.error_code)throw new cl(e.error_description||`Error in URL with unspecified error_description`,{error:e.error||`unspecified_error`,code:e.error_code||`unspecified_code`});switch(t){case`implicit`:if(this.flowType===`pkce`)throw new ul(`Not a valid PKCE flow url.`);break;case`pkce`:if(this.flowType===`implicit`)throw new cl(`Not a valid implicit grant flow url.`)}if(t===`pkce`){if(this._debug(`#_initialize()`,`begin`,`is PKCE flow`,!0),!e.code)throw new ul(`No code detected.`);let{data:t,error:n}=await this._exchangeCodeForSession(e.code,{flowId:e[$c]});if(n)throw n;let r=new URL(window.location.href);return r.searchParams.delete(`code`),r.searchParams.delete($c),window.history.replaceState(window.history.state,``,r.toString()),{data:{session:t.session,redirectType:t.redirectType??null},error:null}}let{provider_token:n,provider_refresh_token:r,access_token:i,refresh_token:a,expires_in:o,expires_at:s,token_type:c}=e;if(!i||!o||!a||!c)throw new cl(`No session defined in URL`);let l=Math.round(Date.now()/1e3),u=parseInt(o),d=l+u;s&&(d=parseInt(s));let f=d-l;f*1e3<=3e4&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${u}s`);let p=d-u;l-p>=120?console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale`,p,d,l):l-p<0&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew`,p,d,l);let{data:m,error:h}=await this._getUser(i);if(h)throw h;let g={provider_token:n,provider_refresh_token:r,access_token:i,expires_in:u,expires_at:d,refresh_token:a,token_type:c,user:m.user};return window.location.hash=``,this._debug(`#_getSessionFromURL()`,`clearing window.location.hash`),this._returnResult({data:{session:g,redirectType:e.type},error:null})}catch(e){if(A(e))return this._returnResult({data:{session:null,redirectType:null},error:e});throw e}}_isImplicitGrantCallback(e){return typeof this.detectSessionInUrl==`function`?this.detectSessionInUrl(new URL(window.location.href),e):!!(e.access_token||e.error||e.error_description||e.error_code)}async _isPKCECallback(e){if(!e.code)return!1;let t=ql(e[$c]);return t&&await N(this.storage,Yl(this.storageKey,t))?!0:!!await N(this.storage,`${this.storageKey}-code-verifier`)}async signOut(e={scope:`global`}){return await this.initializePromise,this.lock==null?await this._signOut(e):await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:`global`}){return await this._useSession(async t=>{let n=async()=>{await this._removeSession()},{data:r,error:i}=t;if(i&&!al(i))return this._returnResult({error:i});let a=r.session?.access_token;if(a){let{error:t}=await this.admin.signOut(a,e);if(t&&!(nl(t)&&(t.status===404||t.status===401||t.status===403)||al(t)))return e!==`others`&&await n(),this._returnResult({error:t})}return e!==`others`&&await n(),this._returnResult({error:null})})}onAuthStateChange(e){let t=jl(),n={id:t,callback:e,unsubscribe:()=>{this._debug(`#unsubscribe()`,`state change callback with id removed`,t),this.stateChangeEmitters.delete(t)}};return this._debug(`#onAuthStateChange()`,`registered callback with id`,t),this.stateChangeEmitters.set(t,n),(async()=>{await this.initializePromise,this.lock==null?await this._emitInitialSession(t):await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(t)})})(),{data:{subscription:n}}}async _emitInitialSession(e){return await this._useSession(async t=>{try{let{data:{session:n},error:r}=t;if(r)throw r;await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,n),this._debug(`INITIAL_SESSION`,`callback id`,e,`session`,n)}catch(t){if(await this.stateChangeEmitters.get(e)?.callback(`INITIAL_SESSION`,null),this._debug(`INITIAL_SESSION`,`callback id`,e,`error`,t),hl(t))return;al(t)||pl(t)||nl(t)&&(t.code===`refresh_token_not_found`||t.code===`refresh_token_already_used`||t.code===`session_expired`)?console.warn(t):console.error(t)}})}async resetPasswordForEmail(e,t={}){let n=null,r=null,i=null;this.flowType===`pkce`&&([n,r,i]=await this._getCodeChallengeAndMethod(!0));try{return await F(this.fetch,`POST`,`${this.url}/recover`,{body:{email:e,code_challenge:n,code_challenge_method:r,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:this._maybeAppendFlowIdToRedirect(t.redirectTo,i)})}catch(e){if(await eu(this.storage,this.storageKey,i),A(e))return this._returnResult({data:null,error:e});throw e}}async getUserIdentities(){try{let{data:e,error:t}=await this.getUser();if(t)throw t;return this._returnResult({data:{identities:e.user.identities??[]},error:null})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async linkIdentity(e){return`token`in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){let t=null;try{let{data:n,error:r}=await this._useSession(async n=>{let{data:r,error:i}=n;if(i)throw i;let{url:a,flowId:o}=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:e.options?.redirectTo,scopes:e.options?.scopes,queryParams:e.options?.queryParams,skipBrowserRedirect:!0});return t=o,await F(this.fetch,`GET`,a,{headers:this.headers,jwt:r.session?.access_token??void 0})});if(r)throw r;return M()&&!e.options?.skipBrowserRedirect&&window.location.assign(n?.url),this._returnResult({data:{provider:e.provider,url:n?.url,flowId:t},error:null})}catch(n){if(A(n))return this._returnResult({data:{provider:e.provider,url:null,flowId:t},error:n});throw n}}async linkIdentityIdToken(e){return await this._useSession(async t=>{try{let{error:n,data:{session:r}}=t;if(n)throw n;let{options:i,provider:a,token:o,access_token:s,nonce:c}=e,{data:l,error:u}=await F(this.fetch,`POST`,`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:r?.access_token??void 0,body:{provider:a,id_token:o,access_token:s,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:i?.captchaToken}},xform:I});return u?this._returnResult({data:{user:null,session:null},error:u}):!l||!l.session||!l.user?this._returnResult({data:{user:null,session:null},error:new ol}):(l.session&&(await this._saveSession(l.session),await this._notifyAllSubscribers(`USER_UPDATED`,l.session)),this._returnResult({data:l,error:u}))}catch(e){if(await eu(this.storage,this.storageKey,null),A(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)throw r;return await F(this.fetch,`DELETE`,`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:n.session?.access_token??void 0})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _refreshAccessToken(e){let t=`#_refreshAccessToken()`;this._debug(t,`begin`);try{let n=Date.now();return await Vl(async n=>(n>0&&await Bl(200*2**(n-1)),this._debug(t,`refreshing attempt`,n),await F(this.fetch,`POST`,`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:I})),(e,t)=>{let r=200*2**e;return t&&pl(t)&&Date.now()+r-n<3e4})}catch(e){if(this._debug(t,`error`,e),A(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}finally{this._debug(t,`end`)}}_isValidSession(e){return typeof e==`object`&&!!e&&`access_token`in e&&`refresh_token`in e&&`expires_at`in e}async _handleProviderSignIn(e,t){let{url:n,flowId:r}=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug(`#_handleProviderSignIn()`,`provider`,e,`options`,t,`url`,n),M()&&!t.skipBrowserRedirect&&window.location.assign(n),{data:{provider:e,url:n,flowId:r},error:null}}async _recoverAndRefresh(){let e=`#_recoverAndRefresh()`;this._debug(e,`begin`);try{let t=await N(this.storage,this.storageKey);if(t&&this.userStorage){let e=await N(this.userStorage,this.storageKey+`-user`);!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!e&&(e={user:t.user},await Ll(this.userStorage,this.storageKey+`-user`,e)),t.user=e?.user??du()}else if(t&&!t.user&&!t.user){let e=await N(this.storage,this.storageKey+`-user`);e&&e?.user?(t.user=e.user,await P(this.storage,this.storageKey+`-user`),await Ll(this.storage,this.storageKey,t)):t.user=du()}if(this._debug(e,`session from storage`,t),!this._isValidSession(t)){this._debug(e,`session is not valid`),t!==null&&await this._removeSession();return}let n=(t.expires_at??1/0)*1e3-Date.now()<Gc;if(this._debug(e,`session has${n?``:` not`} expired with margin of ${Gc}s`),n){if(this.autoRefreshToken&&t.refresh_token){let{error:n}=await this._callRefreshToken(t.refresh_token);n&&(hl(n)?this._debug(e,`refresh discarded by commit guard`,n):this._debug(e,`refresh failed`,n))}}else if(t.user&&t.user.__isUserNotAvailableProxy===!0)try{let{data:n,error:r}=await this._getUser(t.access_token);!r&&n?.user?(t.user=n.user,await this._saveSession(t),await this._notifyAllSubscribers(`SIGNED_IN`,t)):this._debug(e,`could not get user data, skipping SIGNED_IN notification`)}catch(t){console.error(`Error getting user data:`,t),this._debug(e,`error getting user data, skipping SIGNED_IN notification`,t)}else await this._notifyAllSubscribers(`SIGNED_IN`,t)}catch(t){this._debug(e,`error`,t),pl(t)?console.warn(t):console.error(t);return}finally{this._debug(e,`end`)}}async _callRefreshToken(e){var t,n;if(!e)throw new j;if(this.refreshingDeferred)return this.refreshingDeferred.promise;if(this.lastRefreshFailure&&this.lastRefreshFailure.refreshToken===e&&Date.now()<this.lastRefreshFailure.expiresAt)return this._debug(`#_callRefreshToken()`,`returning cached failure (cooldown active)`),this.lastRefreshFailure.result;let r=`#_callRefreshToken()`;this._debug(r,`begin`);try{this.refreshingDeferred=new Rl,this.refreshingDeferred.promise.then(void 0,()=>{});let t=await N(this.storage,this.storageKey),{data:n,error:i}=await this._refreshAccessToken(e);if(i)throw i;if(!n.session)throw new j;let a=await N(this.storage,this.storageKey);if(t!==null&&(a===null||a.refresh_token!==t.refresh_token)){this._debug(r,`commit guard: storage changed since refresh started, discarding rotated tokens`,{startedWith:`present`,nowHolds:a?`replaced`:`cleared`});let e={data:null,error:new ml};return this.refreshingDeferred.resolve(e),e}let o=this._sessionRemovalEpoch;if(await this._saveSession(n.session),this._sessionRemovalEpoch!==o){this._debug(r,`commit guard (post-save): _removeSession ran during _saveSession, undoing write`),await P(this.storage,this.storageKey),this.userStorage&&await P(this.userStorage,this.storageKey+`-user`);let e={data:null,error:new ml};return this.refreshingDeferred.resolve(e),e}await this._notifyAllSubscribers(`TOKEN_REFRESHED`,n.session);let s={data:n.session,error:null};return this.lastRefreshFailure=null,this.refreshingDeferred.resolve(s),s}catch(i){if(this._debug(r,`error`,i),A(i)){let n={data:null,error:i};if(!pl(i)){let e=await N(this.storage,this.storageKey);e?.expires_at&&e.expires_at*1e3>Date.now()?this._debug(r,`proactive refresh failed, access token still valid — preserving session`):await this._removeSession()}return this.lastRefreshFailure={refreshToken:e,result:n,expiresAt:Date.now()+Kc},(t=this.refreshingDeferred)==null||t.resolve(n),n}throw(n=this.refreshingDeferred)==null||n.reject(i),i}finally{this.refreshingDeferred=null,this._debug(r,`end`)}}async _notifyAllSubscribers(e,t,n=!0){if(this._pendingInitNotifications!==null&&n){this._pendingInitNotifications.push({event:e,session:t,broadcast:n});return}let r=`#_notifyAllSubscribers(${e})`;this._debug(r,`begin`,t,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:e,session:t});let r=[],i=Array.from(this.stateChangeEmitters.values()).map(async n=>{try{await n.callback(e,t)}catch(e){r.push(e)}});if(await Promise.all(i),r.length>0){for(let e=0;e<r.length;e+=1)console.error(r[e]);throw r[0]}}finally{this._debug(r,`end`)}}async _saveSession(e){this._debug(`#_saveSession()`,e),this.suppressGetSessionWarning=!0;let t=Object.assign({},e),n=t.user&&t.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&t.user&&await Ll(this.userStorage,this.storageKey+`-user`,{user:t.user});let e=Object.assign({},t);delete e.user;let r=pu(e);await Ll(this.storage,this.storageKey,r)}else{let e=pu(t);await Ll(this.storage,this.storageKey,e)}}async _removeSession(){this._sessionRemovalEpoch+=1,this._debug(`#_removeSession()`),this.lastRefreshFailure=null,this.suppressGetSessionWarning=!1,await P(this.storage,this.storageKey),await tu(this.storage,this.storageKey),await P(this.storage,this.storageKey+`-user`),this.userStorage&&await P(this.userStorage,this.storageKey+`-user`),await this._notifyAllSubscribers(`SIGNED_OUT`,null)}_removeVisibilityChangedCallback(){this._debug(`#_removeVisibilityChangedCallback()`);let e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&M()&&window!=null&&window.removeEventListener&&window.removeEventListener(`visibilitychange`,e)}catch(e){console.error(`removing visibilitychange callback failed`,e)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug(`#_startAutoRefresh()`);let e=setInterval(()=>this._autoRefreshTokenTick(),Wc);this.autoRefreshTicker=e,e&&typeof e==`object`&&typeof e.unref==`function`?e.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(e);let t=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=t,t&&typeof t==`object`&&typeof t.unref==`function`?t.unref():typeof Deno<`u`&&typeof Deno.unrefTimer==`function`&&Deno.unrefTimer(t)}async _stopAutoRefresh(){this._debug(`#_stopAutoRefresh()`);let e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e);let t=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,t&&clearTimeout(t)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async dispose(){var e;this._removeVisibilityChangedCallback(),await this._stopAutoRefresh(),(e=this.broadcastChannel)==null||e.close(),this.broadcastChannel=null,this.stateChangeEmitters.clear()}async _autoRefreshTokenTick(){if(this._debug(`#_autoRefreshTokenTick()`,`begin`),this.lock!=null)try{await this._acquireLock(0,async()=>{try{let e=Date.now();try{return await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/Wc);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${Wc}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}})}catch(e){if(e instanceof Ou)this._debug(`auto refresh token tick lock not available`);else throw e}else if(this.refreshingDeferred!==null)this._debug(`#_autoRefreshTokenTick()`,`refresh already in flight, skipping`);else try{let e=Date.now();try{await this._useSession(async t=>{let{data:{session:n}}=t;if(!n||!n.refresh_token||!n.expires_at){this._debug(`#_autoRefreshTokenTick()`,`no session`);return}let r=Math.floor((n.expires_at*1e3-e)/Wc);this._debug(`#_autoRefreshTokenTick()`,`access token expires in ${r} ticks, a tick lasts ${Wc}ms, refresh threshold is 3 ticks`),r<=3&&await this._callRefreshToken(n.refresh_token)})}catch(e){console.error(`Auto refresh tick failed with error. This is likely a transient error.`,e)}}finally{this._debug(`#_autoRefreshTokenTick()`,`end`)}}async _handleVisibilityChange(){if(this._debug(`#_handleVisibilityChange()`),!M()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(e){this._debug(`#visibilityChangedCallback`,`error`,e)}},window==null||window.addEventListener(`visibilitychange`,this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error(`_handleVisibilityChange`,e)}}async _onVisibilityChanged(e){let t=`#_onVisibilityChanged(${e})`;if(this._debug(t,`visibilityState`,document.visibilityState),document.visibilityState===`visible`){if(this.autoRefreshToken&&this._startAutoRefresh(),!e){if(await this.initializePromise,this.lock!=null)await this._acquireLock(this.lockAcquireTimeout,async()=>{document.visibilityState===`visible`?await this._recoverAndRefresh():this._debug(t,`acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting`)});else{if(document.visibilityState!==`visible`){this._debug(t,`visibilityState is no longer visible, skipping recovery`);return}await this._recoverAndRefresh()}}}else document.visibilityState===`hidden`&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,n){let r=n?.redirectTo,i=null,a=null,o=null;this.flowType===`pkce`&&([i,a,o]=await this._getCodeChallengeAndMethod(),r=this._maybeAppendFlowIdToRedirect(r,o));let s=[`provider=${encodeURIComponent(t)}`];if(r&&s.push(`redirect_to=${encodeURIComponent(r)}`),n?.scopes&&s.push(`scopes=${encodeURIComponent(n.scopes)}`),i!=null&&a!=null){let e=new URLSearchParams({code_challenge:`${encodeURIComponent(i)}`,code_challenge_method:`${encodeURIComponent(a)}`});s.push(e.toString())}if(n?.queryParams){let e=new URLSearchParams(n.queryParams);s.push(e.toString())}return n?.skipBrowserRedirect&&s.push(`skip_http_redirect=${n.skipBrowserRedirect}`),{url:`${e}?${s.join(`&`)}`,flowId:o}}_maybeAppendFlowIdToRedirect(e,t){return!e||!t||!this.experimental.appendPkceFlowIdToRedirects?e??void 0:nu(e,t)}async _getCodeChallengeAndMethod(e=!1){return ru(this.storage,this.storageKey,e,e=>this._debug(`#_getCodeChallengeAndMethod()`,`evicted oldest pending PKCE verifier slot`,e))}async _unenroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;return r?this._returnResult({data:null,error:r}):await F(this.fetch,`DELETE`,`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:n?.session?.access_token})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _enroll(e){try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},e.factorType===`phone`?{phone:e.phone}:e.factorType===`totp`?{issuer:e.issuer}:{}),{data:a,error:o}=await F(this.fetch,`POST`,`${this.url}/factors`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(e.factorType===`totp`&&a.type===`totp`&&a?.totp?.qr_code&&(a.totp.qr_code=`data:image/svg+xml;utf-8,${a.totp.qr_code}`),this._returnResult({data:a,error:null}))})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verify(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=Object.assign({challenge_id:e.challengeId},`webauthn`in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:e.webauthn.type===`create`?Bu(e.webauthn.credential_response):Vu(e.webauthn.credential_response)})}:{code:e.code}),{data:a,error:o}=await F(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/verify`,{body:i,headers:this.headers,jwt:n?.session?.access_token});return o?this._returnResult({data:null,error:o}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+a.expires_in},a)),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,a),this._returnResult({data:a,error:o}))})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challenge(e){let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let i=await F(this.fetch,`POST`,`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:n?.session?.access_token});if(i.error)return i;let{data:a}=i;if(a.type!==`webauthn`)return{data:a,error:null};switch(a.webauthn.type){case`create`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:Ru(a.webauthn.credential_options.publicKey)})})}),error:null};case`request`:return{data:Object.assign(Object.assign({},a),{webauthn:Object.assign(Object.assign({},a.webauthn),{credential_options:Object.assign(Object.assign({},a.webauthn.credential_options),{publicKey:zu(a.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _challengeAndVerify(e){let{data:t,error:n}=await this._challenge({factorId:e.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){let{data:{user:e},error:t}=await this.getUser();if(t)return{data:null,error:t};let n={all:[],phone:[],totp:[],webauthn:[],recovery_code:[]};for(let t of e?.factors??[])n.all.push(t),t.status===`verified`&&t.factor_type in n&&Array.isArray(n[t.factor_type])&&n[t.factor_type].push(t);return{data:n,error:null}}async _getAuthenticatorAssuranceLevel(e){if(e)try{let{payload:t}=zl(e),n=null;t.aal&&(n=t.aal);let r=n,{data:{user:i},error:a}=await this.getUser(e);if(a)return this._returnResult({data:null,error:a});((i?.factors)?.filter(e=>e.status===`verified`)??[]).length>0&&(r=`aal2`);let o=t.amr||[];return{data:{currentLevel:n,nextLevel:r,currentAuthenticationMethods:o},error:null}}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}let{data:{session:t},error:n}=await this.getSession();if(n)return this._returnResult({data:null,error:n});if(!t)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};let{payload:r}=zl(t.access_token),i=null;r.aal&&(i=r.aal);let a=i;(t.user.factors?.filter(e=>e.status===`verified`)??[]).length>0&&(a=`aal2`);let o=r.amr||[];return{data:{currentLevel:i,nextLevel:a,currentAuthenticationMethods:o},error:null}}async _getRecoveryCodesStatus(){uu(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await F(this.fetch,`GET`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _generateRecoveryCodes(e){uu(this.experimental);try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await F(this.fetch,`POST`,`${this.url}/factors/recovery-codes`,{body:e?.friendlyName?{friendly_name:e.friendlyName}:void 0,headers:this.headers,jwt:n?.session?.access_token});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyRecoveryCode(e){uu(this.experimental);let t=async()=>{try{return await this._useSession(async t=>{let{data:n,error:r}=t;if(r)return this._returnResult({data:null,error:r});let{data:i,error:a}=await F(this.fetch,`POST`,`${this.url}/factors/recovery-codes/verify`,{body:{code:e.code},headers:this.headers,jwt:n?.session?.access_token});if(a)return this._returnResult({data:null,error:a});let o=Object.assign({expires_at:Al(i.expires_in)},i);return await this._saveSession(o),await this._notifyAllSubscribers(`MFA_CHALLENGE_VERIFIED`,o),this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}};return this.lock==null?t():this._acquireLock(this.lockAcquireTimeout,t)}async _regenerateRecoveryCodes(){uu(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/factors/recovery-codes/regenerate`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _unenrollRecoveryCodes(){uu(this.experimental);try{return await this._useSession(async e=>{let{data:t,error:n}=e;if(n)return this._returnResult({data:null,error:n});let{data:r,error:i}=await F(this.fetch,`DELETE`,`${this.url}/factors/recovery-codes`,{headers:this.headers,jwt:t?.session?.access_token});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?await F(this.fetch,`GET`,`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:n.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _approveAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new j});let a=await F(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`approve`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&M()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _denyAuthorization(e,t){try{return await this._useSession(async n=>{let{data:{session:r},error:i}=n;if(i)return this._returnResult({data:null,error:i});if(!r)return this._returnResult({data:null,error:new j});let a=await F(this.fetch,`POST`,`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:r.access_token,body:{action:`deny`},xform:e=>({data:e,error:null})});return a.data&&a.data.redirect_url&&M()&&!t?.skipBrowserRedirect&&window.location.assign(a.data.redirect_url),a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _listOAuthGrants(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;return n?this._returnResult({data:null,error:n}):t?await F(this.fetch,`GET`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;return r?this._returnResult({data:null,error:r}):n?(await F(this.fetch,`DELETE`,`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:n.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new j})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async fetchJwk(e,t={keys:[]}){let n=t.keys.find(t=>t.kid===e);if(n)return n;let r=Date.now();if(n=this.jwks.keys.find(t=>t.kid===e),n&&this.jwks_cached_at+6e5>r)return n;let{data:i,error:a}=await F(this.fetch,`GET`,`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(a)throw a;return!i.keys||i.keys.length===0||(this.jwks=i,this.jwks_cached_at=r,n=i.keys.find(t=>t.kid===e),!n)?null:n}async getClaims(e,t={}){try{let n=e;if(!n){let{data:e,error:t}=await this.getSession();if(t||!e.session)return this._returnResult({data:null,error:t});n=e.session.access_token}let{header:r,payload:i,signature:a,raw:{header:o,payload:s}}=zl(n);if(!t?.allowExpired)try{ou(i.exp)}catch(e){throw new _l(e instanceof Error?e.message:`JWT validation failed`)}let c=!r.alg||r.alg.startsWith(`HS`)||!r.kid||!(`crypto`in globalThis&&`subtle`in globalThis.crypto)?null:await this.fetchJwk(r.kid,t?.keys?{keys:t.keys}:t?.jwks);if(!c){let{error:e}=await this.getUser(n);if(e)throw e;return{data:{claims:i,header:r,signature:a},error:null}}let l=su(r.alg),u=await crypto.subtle.importKey(`jwk`,c,l,!0,[`verify`]);if(!await crypto.subtle.verify(l,u,a,Ol(`${o}.${s}`)))throw new _l(`Invalid JWT signature`);return{data:{claims:i,header:r,signature:a},error:null}}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async signInWithPasskey(e){try{if(!Uu())return this._returnResult({data:null,error:new rl(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyAuthentication({options:{captchaToken:e?.options?.captchaToken}});if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await Gu({publicKey:zu(t.options),signal:e?.options?.signal??Lu.createNewAbortSignal(),mediation:e?.options?.mediation});if(i||!r)return this._returnResult({data:null,error:i??new rl(`WebAuthn ceremony failed`,null)});let a=Vu(r);return this._verifyPasskeyAuthentication({challengeId:t.challenge_id,credential:a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async registerPasskey(e){try{if(!Uu())return this._returnResult({data:null,error:new rl(`Browser does not support WebAuthn`,null)});let{data:t,error:n}=await this._startPasskeyRegistration();if(n||!t)return this._returnResult({data:null,error:n});let{data:r,error:i}=await Wu({publicKey:Ru(t.options),signal:e?.options?.signal??Lu.createNewAbortSignal()});if(i||!r)return this._returnResult({data:null,error:i??new rl(`WebAuthn ceremony failed`,null)});let a=Bu(r);return this._verifyPasskeyRegistration({challengeId:t.challenge_id,credential:a})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyRegistration(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new j});let{data:r,error:i}=await F(this.fetch,`POST`,`${this.url}/passkeys/registration/options`,{headers:this.headers,jwt:t.access_token,body:{}});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyRegistration(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{data:i,error:a}=await F(this.fetch,`POST`,`${this.url}/passkeys/registration/verify`,{headers:this.headers,jwt:n.access_token,body:{challenge_id:e.challengeId,credential:e.credential}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _startPasskeyAuthentication(e){try{let{data:t,error:n}=await F(this.fetch,`POST`,`${this.url}/passkeys/authentication/options`,{headers:this.headers,body:{gotrue_meta_security:{captcha_token:e?.options?.captchaToken}}});return n?this._returnResult({data:null,error:n}):this._returnResult({data:t,error:null})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _verifyPasskeyAuthentication(e){try{let{data:t,error:n}=await F(this.fetch,`POST`,`${this.url}/passkeys/authentication/verify`,{headers:this.headers,body:{challenge_id:e.challengeId,credential:e.credential},xform:I});return n?this._returnResult({data:null,error:n}):(t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers(`SIGNED_IN`,t.session)),this._returnResult({data:t,error:null}))}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _listPasskeys(){try{return await this._useSession(async e=>{let{data:{session:t},error:n}=e;if(n)return this._returnResult({data:null,error:n});if(!t)return this._returnResult({data:null,error:new j});let{data:r,error:i}=await F(this.fetch,`GET`,`${this.url}/passkeys`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})});return i?this._returnResult({data:null,error:i}):this._returnResult({data:r,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _updatePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{data:i,error:a}=await F(this.fetch,`PATCH`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,body:{friendly_name:e.friendlyName}});return a?this._returnResult({data:null,error:a}):this._returnResult({data:i,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}async _deletePasskey(e){try{return await this._useSession(async t=>{let{data:{session:n},error:r}=t;if(r)return this._returnResult({data:null,error:r});if(!n)return this._returnResult({data:null,error:new j});let{error:i}=await F(this.fetch,`DELETE`,`${this.url}/passkeys/${e.passkeyId}`,{headers:this.headers,jwt:n.access_token,noResolveJson:!0});return i?this._returnResult({data:null,error:i}):this._returnResult({data:null,error:null})})}catch(e){if(A(e))return this._returnResult({data:null,error:e});throw e}}};td.nextInstanceID={};var nd=td,rd=`2.117.2`,id=``,ad;if(typeof Deno<`u`)id=`deno`,ad=Deno.version?.deno;else if(typeof document<`u`)id=`web`;else if(typeof navigator<`u`&&navigator.product===`ReactNative`)id=`react-native`;else{var od;id=`node`;let e=globalThis.process;ad=e==null||(od=e.version)==null?void 0:od.replace(/^v/,``)}var sd=[`runtime=${id}`];ad&&sd.push(`runtime-version=${ad}`);var cd={headers:{"X-Client-Info":`supabase-js/${rd}; ${sd.join(`; `)}`}},ld={schema:`public`},ud={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:`implicit`},dd={},fd={enabled:!1,respectSamplingDecision:!0};function pd(e){if(!e||typeof e!=`string`)return null;let t=e.split(`-`);if(t.length!==4)return null;let[n,r,i,a]=t;if(n.length!==2||r.length!==32||i.length!==16||a.length!==2)return null;let o=/^[0-9a-f]+$/i;return!o.test(n)||!o.test(r)||!o.test(i)||!o.test(a)||r===`00000000000000000000000000000000`||i===`0000000000000000`?null:{version:n,traceId:r,parentId:i,traceFlags:a,isSampled:(parseInt(a,16)&1)==1}}function md(e,t){if(!e||!t||t.length===0)return!1;let n;if(e instanceof URL)n=e;else try{n=new URL(e)}catch{return!1}for(let e of t)try{if(typeof e==`string`){if(hd(n.hostname,e))return!0}else if(e instanceof RegExp){if(e.test(n.hostname))return!0}else if(typeof e==`function`&&e(n))return!0}catch{continue}return!1}function hd(e,t){if(t===e)return!0;if(t.startsWith(`*.`)){let n=t.slice(2);if(e.endsWith(n)&&(e===n||e.endsWith(`.`+n)))return!0}return!1}function gd(e){let t=[];try{let n=new URL(e);t.push(n.hostname)}catch{}return t.push(`*.supabase.co`,`*.supabase.in`),t.push(`localhost`,`127.0.0.1`,`[::1]`),t}function _d(e){"@babel/helpers - typeof";return _d=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},_d(e)}function vd(e,t){if(_d(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(_d(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function yd(e){var t=vd(e,`string`);return _d(t)==`symbol`?t:t+``}function bd(e,t,n){return(t=yd(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function xd(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function R(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?xd(Object(n),!0).forEach(function(t){bd(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):xd(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var Sd=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),Cd=()=>Headers,wd=e=>e.startsWith(`sb_publishable_`)||e.startsWith(`sb_secret_`),Td=`sb_temp_`,Ed=new Set,Dd=e=>{if(!e.startsWith(`sb_`)||wd(e)||e.startsWith(Td))return;let t=e.match(/^sb_[a-zA-Z0-9]+_/)?.[0]??`unknown`;Ed.has(t)||(Ed.add(t),console.warn(`@supabase/supabase-js: Unrecognized Supabase API key format. The client will proceed and send this key as-is; if you see authentication errors you may need to upgrade @supabase/supabase-js to a version that recognizes this key type.`))},Od=(e,t,n,r,i,a)=>{let o=Sd(r),s=Cd(),c=i?.enabled===!0,l=i?.respectSamplingDecision!==!1,u=c?gd(t):null,d=!(a?.omitApiKeyAsBearer&&wd(e));return async(t,r)=>{let i=await n(),a=new s(r?.headers);if(a.has(`apikey`)||a.set(`apikey`,e),!a.has(`Authorization`)){let t=i??(d?e:null);t&&a.set(`Authorization`,`Bearer ${t}`)}if(u){let e=jd(t,u,l);e&&(e.traceparent&&!a.has(`traceparent`)&&a.set(`traceparent`,e.traceparent),e.tracestate&&!a.has(`tracestate`)&&a.set(`tracestate`,e.tracestate),e.baggage&&!a.has(`baggage`)&&a.set(`baggage`,e.baggage))}return o(t,R(R({},r),{},{headers:a}))}},kd=!1,Ad=!1;function jd(e,t,n){let r=Ka();if(!r)return kd||(kd=!0,console.warn("@supabase/supabase-js: tracePropagation is enabled but the tracing runtime is not loaded, so trace headers will not be attached. Add `import '@supabase/supabase-js/tracing'` at your application entry point (requires the OpenTelemetry API package to be installed). The CDN/UMD build does not support trace propagation.")),null;if(!md(typeof e==`string`||e instanceof URL?e:e.url,t))return null;let i=r();if(!i||!i.traceparent){var a;if(i!=null&&(a=i.carrierKeys)!=null&&a.length&&!Ad){Ad=!0;let e=i.carrierKeys.includes(`sentry-trace`)?" Sentry detected: set `propagateTraceparent: true` in Sentry.init() to emit it.":` Configure your tracing SDK to emit W3C trace context on outgoing requests.`;console.warn(`@supabase/supabase-js: tracePropagation is enabled and a tracing SDK is active, but its propagator wrote [${i.carrierKeys.join(`, `)}] and no W3C traceparent header, so trace headers will not be attached.`+e)}return null}if(n){let e=pd(i.traceparent);if(e&&!e.isSampled)return{traceparent:i.traceparent}}return i}function Md(e){return typeof e==`boolean`?{enabled:e}:e}function Nd(e){return e.endsWith(`/`)?e:e+`/`}var Pd=!1;function Fd(e){Pd||typeof e==`object`&&e&&`schema`in e&&e.schema!==void 0&&(Pd=!0,console.warn(`@supabase/supabase-js: The "schema" option must be nested under "db", e.g. createClient(url, key, { db: { schema: 'myschema' } }). A top-level "schema" is ignored and queries go to the default schema.`))}function Id(e,t){let{db:n,auth:r,realtime:i,global:a}=e,{db:o,auth:s,realtime:c,global:l}=t,u=Md(e.tracePropagation),d=Md(t.tracePropagation),f={db:R(R({},o),n),auth:R(R({},s),r),realtime:R(R({},c),i),storage:{},global:R(R(R({},l),a),{},{headers:R(R({},l?.headers??{}),a?.headers??{})}),tracePropagation:{enabled:u?.enabled??d?.enabled??!1,respectSamplingDecision:u?.respectSamplingDecision??d?.respectSamplingDecision??!0},accessToken:async()=>``};return e.accessToken?f.accessToken=e.accessToken:delete f.accessToken,f}function Ld(e){let t=e?.trim();if(!t)throw Error(`supabaseUrl is required.`);if(!t.match(/^https?:\/\//i))throw Error(`Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.`);try{return new URL(Nd(t))}catch{throw Error(`Invalid supabaseUrl: Provided URL is malformed.`)}}var Rd=class extends nd{constructor(e){super(e)}},zd=class{constructor(e,t,n){this.supabaseUrl=e,this.supabaseKey=t;let r=Ld(e);if(!t)throw Error(`supabaseKey is required.`);Dd(t),Fd(n),this.realtimeUrl=new URL(`realtime/v1`,r),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace(`http`,`ws`),this.authUrl=new URL(`auth/v1`,r),this.storageUrl=new URL(`storage/v1`,r),this.functionsUrl=new URL(`functions/v1`,r);let i=`sb-${r.hostname.split(`.`)[0]}-auth-token`,a={db:ld,realtime:dd,auth:R(R({},ud),{},{storageKey:i}),global:cd,tracePropagation:fd},o=Id(n??{},a);this.settings=o,this.storageKey=o.auth.storageKey??``,this.headers=o.global.headers??{},o.accessToken?(this.accessToken=o.accessToken,this.auth=new Proxy({},{get:(e,t)=>{throw Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`)}})):this.auth=this._initSupabaseAuthClient(o.auth??{},this.headers,o.global.fetch),this.fetch=Od(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation),this.functionsFetch=Od(t,e,this._getSessionToken.bind(this),o.global.fetch,o.tracePropagation,{omitApiKeyAsBearer:!0}),this.realtime=this._initRealtimeClient(R({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},o.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(e=>this.realtime.setAuth(e)).catch(e=>console.warn(`Failed to set initial Realtime auth token:`,e)),this.rest=new wo(new URL(`rest/v1`,r).href,{headers:this.headers,schema:o.db.schema,fetch:this.fetch,timeout:o.db.timeout,urlLengthLimit:o.db.urlLengthLimit,retry:o.db.retry}),this.storage=new Hc(this.storageUrl.href,this.headers,this.fetch,n?.storage),o.accessToken||this._listenForAuthEvents()}get functions(){return new to(this.functionsUrl.href,{headers:this.headers,customFetch:this.functionsFetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}getOpenApiSpec(){return this.rest.getOpenApiSpec()}rpc(e,t={},n={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,n)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getSessionToken(){var e=this;if(e.accessToken)return await e.accessToken();let{data:t}=await e.auth.getSession();return t.session?.access_token??null}async _getAccessToken(){var e=this;return await e._getSessionToken()??e.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,storageKey:a,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,lockAcquireTimeout:d,skipAutoInitialize:f},p,m){let h={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new Rd({url:this.authUrl.href,headers:R(R({},h),p),storageKey:a,autoRefreshToken:e,persistSession:t,detectSessionInUrl:n,storage:r,userStorage:i,flowType:o,lock:s,debug:c,throwOnError:l,experimental:u,fetch:m,lockAcquireTimeout:d,skipAutoInitialize:f,hasCustomAuthorizationHeader:Object.keys(this.headers).some(e=>e.toLowerCase()===`authorization`)})}_initRealtimeClient(e){return new Us(this.realtimeUrl.href,R(R({},e),{},{params:R(R({},{apikey:this.supabaseKey}),e?.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,`CLIENT`,t?.access_token)})}_handleTokenChanged(e,t,n){(e===`TOKEN_REFRESHED`||e===`SIGNED_IN`||e===`INITIAL_SESSION`)&&this.changedAccessToken!==n?(this.changedAccessToken=n,this.realtime.setAuth(n)):e===`SIGNED_OUT`&&(this.realtime.setAuth(),t==`STORAGE`&&this.auth.signOut(),this.changedAccessToken=void 0)}},Bd=(e,t,n)=>new zd(e,t,n);function Vd(){if(typeof window<`u`||globalThis.Deno!==void 0)return!1;let e=globalThis.process;if(!e)return!1;let t=e.version;if(t==null)return!1;let n=t.match(/^v(\d+)\./);return n?parseInt(n[1],10)<=20:!1}Vd()&&console.warn(`⚠️  Node.js 20 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 22 or later. For more information, visit: https://github.com/orgs/supabase/discussions/45715`);var Hd=`gts.remember`,Ud={getItem(e){try{return window.localStorage.getItem(e)??window.sessionStorage.getItem(e)}catch{return null}},setItem(e,t){try{let n=window.localStorage.getItem(Hd)===`1`;(n?window.localStorage:window.sessionStorage).setItem(e,t),(n?window.sessionStorage:window.localStorage).removeItem(e)}catch{}},removeItem(e){try{window.localStorage.removeItem(e),window.sessionStorage.removeItem(e)}catch{}}};function Wd(e){try{e?window.localStorage.setItem(Hd,`1`):window.localStorage.removeItem(Hd)}catch{}}var z=Wa()?Bd(Ua.supabaseUrl,Ua.supabaseAnonKey,{auth:{storage:Ud,persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!1}}):null,Gd=[],Kd=null;function B(e,t,n=null){let r=[],i=RegExp(`^`+e.replace(/\/:([a-zA-Z_]+)/g,(e,t)=>(r.push(t),`/([^/]+)`))+`/?$`);Gd.push({pattern:e,regex:i,keys:r,handler:t,name:n})}function qd(e){Kd=e}function Jd(e=window.location.hash){let[t,n=``]=(e.replace(/^#/,``)||`/`).split(`?`),r={},i=new URLSearchParams(n);for(let e of new Set(i.keys())){let t=i.getAll(e);r[e]=e.endsWith(`[]`)?t:t[t.length-1]}return{path:decodeURI(t||`/`),query:r}}function Yd(){return Jd()}function Xd(e,t={}){let n=new URLSearchParams;for(let[e,r]of Object.entries(t))r!=null&&r!==``&&(Array.isArray(r)?r.forEach(t=>n.append(e,t)):n.append(e,r));let r=n.toString();return`#${e}${r?`?${r}`:``}`}function V(e,t={}){let n=Xd(e,t);window.location.hash===n?Qd():window.location.hash=n}function Zd(){Qd()}async function Qd(){let{path:e,query:t}=Jd();for(let n of Gd){let r=e.match(n.regex);if(r){let i={};return n.keys.forEach((e,t)=>{i[e]=decodeURIComponent(r[t+1])}),n.handler({path:e,query:t,params:i,name:n.name})}}if(Kd)return Kd({path:e,query:t,params:{}})}function $d(){return window.addEventListener(`hashchange`,Qd),Qd()}var ef=null,tf=e=>{ef=e},H=(...e)=>e.some(e=>e.endsWith(`*`)?(ef||``).startsWith(e.slice(0,-1)):ef===e),U={user:null,permissions:[],flags:{},roleTag:``,taggedName:``,scopes:{view:[],attend:[],assign:[]}};function nf(e){U.user=e?.user??null,U.permissions=e?.permissions??[],U.flags=e?.flags??{},U.roleTag=e?.role_tag??``,U.taggedName=e?.tagged_name??``,U.scopes=e?.scopes??{view:[],attend:[],assign:[]}}var rf=()=>nf(null),af=()=>U.user,of=()=>!!U.user?.id,sf=()=>!!U.user?.is_active,cf=()=>!!U.flags.is_admin,lf=()=>!!U.flags.is_gts,uf=()=>!!U.flags.is_apoc,df=()=>!!U.flags.is_apoc_cco,ff=()=>!!U.flags.is_apoc_csa,pf=e=>cf()||U.permissions.includes(e),mf=(...e)=>cf()||e.flat().some(e=>U.permissions.includes(e));function hf(){return U.user?.role?.name??U.user?.role?.slug??`GTS`}function gf(){return lf()?`GTS • Operaciones`:uf()?`APOC • Control`:cf()?`ADMIN • Sistema`:`${U.user?.role?.name??`Usuario`} • Sistema`}function _f(){return lf()?`Perfil GTS`:uf()?`Perfil APOC`:cf()?`Perfil Admin`:`Perfil ${U.user?.role?.name??`Usuario`}`}function vf(e=U.user?.name??``){let t=e.split(` `);return t.length>=2?(t[0].charAt(0)+t[1].charAt(0)).toUpperCase():e.slice(0,2).toUpperCase()}var W=class extends Error{constructor(e,t=422,n=null){super(e),this.status=t,this.code=n}};function G(e){if(!e)return new W(`Ocurrió un error inesperado.`,500);if(e instanceof W)return e;let t=e.message||`Ocurrió un error inesperado.`;return/Failed to fetch|NetworkError|Load failed/i.test(t)?new W(`Error de conectividad al enviar la solicitud. Por favor intente nuevamente.`,0):/JWT expired|invalid JWT|permission denied for function/i.test(t)?new W(`Su sesión ha expirado. Inicie sesión nuevamente.`,401,e.code):new W(t,e.code===`42501`?403:e.code===`P0002`?404:422,e.code)}async function K(e,t={}){let{data:n,error:r}=await z.rpc(e,t);if(r)throw G(r);return n}var yf={};function q(e,t){yf[e]=t}function bf(){let e=yf;return yf={},e}var xf=class{constructor(e){this.value=e}toString(){return this.value}},Sf={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`,"`":`&#96;`};function Cf(e){return String(e).replace(/[&<>"'`]/g,e=>Sf[e])}function wf(e){return e==null||e===!1?``:e instanceof xf?e.value:Array.isArray(e)?e.map(wf).join(``):Cf(e)}function J(e,...t){let n=``;return e.forEach((e,r)=>{n+=e,r<t.length&&(n+=wf(t[r]))}),new xf(n)}var Tf=e=>new xf(String(e??``)),Y=e=>new xf(Cf(JSON.stringify(e??null))),X=(...e)=>e.flat().filter(Boolean).join(` `),Ef=`Su cuenta institucional se encuentra inactiva. Contacte al Administrador.`,Df=e=>`${String(e||``).trim().toLowerCase()}@${Ua.authEmailDomain}`;async function Of(){let{data:e}=await z.auth.getSession();if(!e.session)return rf(),null;let t=await K(`app_bootstrap`);if(!t)throw await z.auth.signOut(),rf(),new W(`La cuenta no tiene un perfil operativo asignado. Contacte al Administrador.`,403);if(!t.user?.is_active)throw await z.auth.signOut(),rf(),new W(Ef,403);return nf(t),t}async function kf(e,t,n){if(!String(e||``).trim())throw new W(`El campo usuario es obligatorio.`);if(!t)throw new W(`El campo contraseña es obligatorio.`);Wd(!!n);let{error:r}=await z.auth.signInWithPassword({email:Df(e),password:t});if(r){let e=String(r.message||``);throw/banned/i.test(e)||r.code===`user_banned`?new W(Ef,403):r.status===429||/rate limit|too many/i.test(e)?new W(`Demasiados intentos de acceso. Por favor intente de nuevo en unos minutos.`,429):new W(`Estas credenciales no coinciden con nuestros registros.`,422)}return Of()}async function Af(){await z.auth.signOut(),rf()}var jf=()=>sf()&&mf(`incidents.view_all`,`incidents.view_department`,`incidents.view_assigned`),Mf=()=>sf()&&pf(`incidents.create`),Nf=()=>mf(`incidents.view_assigned`,`incidents.view_department`),Pf=()=>pf(`incidents.view_all`),Ff=()=>pf(`reports.view`),If=()=>pf(`reports.export`),Lf=()=>sf()&&pf(`audit.view`),Rf=()=>pf(`users.view`),zf=()=>pf(`roles.view`),Bf=()=>cf()||lf()||pf(`incidents.view_all`),Vf=e=>`./${e}`;function Hf(e){let t=typeof e==`string`?e.toLowerCase():e?.slug??`media`,n=typeof e==`string`?e.charAt(0).toUpperCase()+e.slice(1):e?.name??`Media`;return t===`critica`?J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(216,59,82,0.15)] text-[#E66A7A] border border-[rgba(216,59,82,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#D83B52] animate-pulse"></span>
            ${n}
        </span>`:t===`alta`?J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(224,109,36,0.15)] text-[#E8813C] border border-[rgba(224,109,36,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#E06D24]"></span>
            ${n}
        </span>`:t===`media`?J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(16,185,129,0.15)] text-[#34D399] border border-[rgba(16,185,129,0.30)] shadow-sm whitespace-nowrap">
            <span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            ${n}
        </span>`:J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[rgba(91,134,180,0.15)] text-[#82A8D1] border border-[rgba(91,134,180,0.30)] shadow-sm whitespace-nowrap">
        <span class="w-1.5 h-1.5 rounded-full bg-[#5B86B4]"></span>
        ${n}
    </span>`}function Uf(e){let t=typeof e==`string`?e.toUpperCase():e?.code??`NUEVA`,n=typeof e==`string`?e:e?.name??`Nueva`;return t===`EN_ATENCION`||t===`EN_PROCESO`?J`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(224,162,26,0.15)] text-[#E2B24C] border border-[rgba(224,162,26,0.30)] shadow-sm whitespace-nowrap">En proceso</span>`:t===`RESUELTA`?J`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(32,201,151,0.15)] text-[#20C997] border border-[rgba(32,201,151,0.30)] shadow-sm whitespace-nowrap">Resuelta</span>`:t===`NUEVA`||t===`ASIGNADA`?J`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)] shadow-sm whitespace-nowrap">${n}</span>`:J`<span class="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-medium bg-[#151A21] text-[#9AA5B4] border border-[#252C35] shadow-sm whitespace-nowrap">${n}</span>`}function Wf({showBrandText:e=!1,imgClass:t=`w-9 h-9`,wrapperClass:n=``}={}){return J`<div class="${X(`inline-flex items-center gap-2.5 select-none`,n)}">
        <img src="${Vf(`images/gts-logo.png`)}" alt="GTS - Grupo de Seguridad Tecnológica AIFA" class="${X(t,`object-contain shrink-0`)}" loading="eager" />
        ${e?J`<div class="flex flex-col text-left leading-tight">
                <span class="font-extrabold text-base tracking-wider text-white font-sans">GTS</span>
                <span class="text-[9px] uppercase tracking-wider text-[#8A95A4] font-medium">Grupo de Seguridad Tecnológica</span>
            </div>`:``}
    </div>`}function Gf({imgClass:e=`h-7 lg:h-8`,wrapperClass:t=``,subtext:n=`AEROPUERTO INTERNACIONAL FELIPE ÁNGELES`}={}){return J`<div class="${X(`inline-flex items-center gap-3 select-none`,t)}">
        <img src="${Vf(`images/aifa-logo.png`)}" alt="Aeropuerto Internacional Felipe Ángeles" class="${X(e,`w-auto object-contain shrink-0`)}" loading="eager" />
        <div class="flex items-center gap-2.5">
            <div class="h-6 w-px bg-[#263241]"></div>
            <div class="flex flex-col text-left leading-none">
                <span class="font-extrabold text-sm sm:text-base tracking-widest text-[#F2F5F8] font-sans">AIFA</span>
                ${n?J`<span class="text-[8px] uppercase tracking-wider text-[#8D98A8] font-medium mt-0.5 whitespace-nowrap">${n}</span>`:``}
            </div>
        </div>
    </div>`}function Kf(e,t,n={},r=`page`){if(!e||e.last_page<=1)return``;let i=e.current_page,a=e.last_page,o=e=>Xd(t,{...n,[r]:e}),s=[];for(let e=1;e<=a;e++)e===1||e===a||Math.abs(e-i)<=2?s.push(e):s[s.length-1]!==`…`&&s.push(`…`);let c=`relative inline-flex items-center px-3 py-1.5 text-xs font-medium border border-[#252C35] transition-colors`;return J`<nav role="navigation" aria-label="Paginación" class="flex items-center justify-between w-full gap-3">
        <p class="text-xs text-[#8D98A8]">
            Mostrando <span class="font-semibold text-[#F2F5F8]">${e.from}</span> a
            <span class="font-semibold text-[#F2F5F8]">${e.to}</span> de
            <span class="font-semibold text-[#F2F5F8]">${e.total}</span> resultados
        </p>
        <span class="inline-flex rounded-lg shadow-sm overflow-hidden">
            ${i>1?J`<a href="${o(i-1)}" class="${X(c,`rounded-l-lg bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]`)}" aria-label="Anterior">
                    <span class="material-symbols-outlined text-[16px]">chevron_left</span></a>`:J`<span class="${X(c,`rounded-l-lg bg-[#0B0F14] text-[#505A68] cursor-default`)}"><span class="material-symbols-outlined text-[16px]">chevron_left</span></span>`}
            ${s.map(e=>e===`…`?J`<span class="${X(c,`-ml-px bg-[#11151B] text-[#707B8A]`)}">…</span>`:e===i?J`<span aria-current="page" class="${X(c,`-ml-px bg-[#123A70] text-white font-bold`)}">${e}</span>`:J`<a href="${o(e)}" class="${X(c,`-ml-px bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]`)}">${e}</a>`)}
            ${i<a?J`<a href="${o(i+1)}" class="${X(c,`-ml-px rounded-r-lg bg-[#11151B] text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23]`)}" aria-label="Siguiente">
                    <span class="material-symbols-outlined text-[16px]">chevron_right</span></a>`:J`<span class="${X(c,`-ml-px rounded-r-lg bg-[#0B0F14] text-[#505A68] cursor-default`)}"><span class="material-symbols-outlined text-[16px]">chevron_right</span></span>`}
        </span>
    </nav>`}function qf(e,t){if(!t)return``;let n={success:[`bg-emerald-500/10 border-emerald-500/30 text-emerald-300`,`text-emerald-400`,`check_circle`,`text-emerald-400 hover:text-emerald-200`],error:[`bg-rose-500/10 border-rose-500/30 text-rose-300`,`text-rose-400`,`error`,`text-rose-400 hover:text-rose-200`],warning:[`bg-amber-500/10 border-amber-500/30 text-amber-300`,`text-amber-400`,`warning`,`text-amber-400 hover:text-amber-200`]}[e]??[];return J`<div class="${X(`p-4 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-lg`,n[0])}">
        <div class="flex items-center gap-3">
            <span class="${X(`material-symbols-outlined text-[22px]`,n[1])}">${n[2]}</span>
            <span class="font-medium">${t}</span>
        </div>
        <button type="button" onclick="this.parentElement.remove()" class="${n[3]}">
            <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
    </div>`}function Jf(e,{showUsers:t,showRoles:n}){let r=(t,n,r,i)=>t===e?J`<a href="${n}" class="px-4 py-2 text-xs font-semibold rounded-t-xl bg-[#11151B] border-t border-x border-[#263241] text-[#3D82C6]">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">${r}</span><span>${i}</span></span></a>`:J`<a href="${n}" class="px-4 py-2 text-xs font-semibold rounded-t-xl transition-colors text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#101923]">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-[16px]">${r}</span><span>${i}</span></span></a>`;return J`<div class="flex items-center gap-2 border-b border-[#263241] pb-1 overflow-x-auto">
        ${r(`profile`,`#/perfil`,`account_circle`,`Mi Cuenta`)}
        ${t||e===`users`?r(`users`,`#/configuracion/usuarios`,`group`,`Gestión de Usuarios y Cuadrillas`):``}
        ${n||e===`roles`?r(`roles`,`#/configuracion/roles`,`admin_panel_settings`,`Gestión de Roles y Permisos`):``}
    </div>`}function Yf(e=`Cargando información operativa…`){return J`<div class="w-full py-24 flex items-center justify-center gap-2 text-xs font-mono text-brand-text-muted">
        <span class="material-symbols-outlined animate-spin text-[18px] text-[#3D82C6]">progress_activity</span>
        <span>${e}</span>
    </div>`}var Xf={data:(e=`today`)=>K(`dashboard_data`,{p_period:e}),recent:()=>K(`dashboard_recent_incidents`,{p_limit:6})},Zf={data:e=>K(`indicators_data`,{p_filters:e})},Qf={data:(e,t=1,n=1)=>K(`audit_data`,{p_filters:e,p_incidents_page:Number(t)||1,p_histories_page:Number(n)||1})},$f={list:()=>K(`notifications_list`),markRead:e=>K(`notifications_mark_read`,{p_id:e}),markAllRead:()=>K(`notifications_mark_all_read`)},ep={data:(e,t=1)=>K(`catalogs_data`,{p_filters:e,p_page:Number(t)||1}),store:e=>K(`catalog_store`,{p_data:e}),update:(e,t)=>K(`catalog_update`,{p_id:e,p_data:t}),updateStatus:(e,t,n)=>K(`catalog_update_status`,{p_id:e,p_status:t,p_reason:n||null}),destroy:e=>K(`catalog_destroy`,{p_id:e})},tp={data:(e,t=1)=>K(`users_data`,{p_filters:e,p_page:Number(t)||1}),store:e=>K(`admin_create_user`,{p_name:e.name,p_username:e.username,p_password:e.password,p_role_id:e.role_id?Number(e.role_id):null,p_badge_number:e.badge_number||null}),update:e=>K(`admin_update_user`,{p_id:Number(e.id),p_name:e.name,p_username:e.username,p_email:e.email||null,p_role_id:e.role_id?Number(e.role_id):null,p_badge_number:e.badge_number||null,p_password:e.password||null}),toggleStatus:e=>K(`admin_toggle_user_status`,{p_id:e}),destroy:e=>K(`admin_delete_user`,{p_id:e})},np={data:e=>K(`roles_data`,{p_search:e||null}),detail:e=>K(`role_detail`,{p_role_id:Number(e)}),store:e=>K(`role_store`,{p_name:e.name,p_slug:e.slug,p_description:e.description||null,p_color:e.color}),update:e=>K(`role_update`,{p_id:Number(e.id),p_name:e.name,p_slug:e.slug,p_description:e.description||null,p_color:e.color}),destroy:e=>K(`role_destroy`,{p_id:e}),updatePermissions:(e,t)=>K(`role_update_permissions`,{p_id:Number(e),p_permission_ids:t.map(Number)}),updateScopes:(e,t,n,r)=>K(`role_update_scopes`,{p_id:Number(e),p_view:t.map(Number),p_attend:n.map(Number),p_assign:r.map(Number)})},rp={update:(e,t,n)=>K(`profile_update`,{p_name:e,p_email:t||null,p_username:n??null}),changePassword:(e,t,n)=>K(`profile_change_password`,{p_current:e,p_password:t,p_password_confirmation:n}),destroy:e=>K(`profile_destroy`,{p_password:e})},ip=()=>K(`app_lookups`),ap=new Intl.DateTimeFormat(`en-US`,{timeZone:Ua.timezone,year:`numeric`,month:`2-digit`,day:`2-digit`,hour:`2-digit`,minute:`2-digit`,second:`2-digit`,hourCycle:`h23`}),op=[`Jan`,`Feb`,`Mar`,`Apr`,`May`,`Jun`,`Jul`,`Aug`,`Sep`,`Oct`,`Nov`,`Dec`];function sp(e){if(!e)return null;let t=e instanceof Date?e:new Date(e);return Number.isNaN(t.getTime())?null:t}function cp(e){let t={};for(let{type:n,value:r}of ap.formatToParts(e))t[n]=r;return t.hour===`24`&&(t.hour=`00`),t}function Z(e,t=`d/m/Y H:i`,n=`N/D`){let r=sp(e);if(!r)return n;let i=cp(r),a={d:i.day,m:i.month,Y:i.year,H:i.hour,i:i.minute,s:i.second,M:op[Number(i.month)-1]};return t.replace(/[dmYHisM]/g,e=>a[e])}var lp=new Intl.RelativeTimeFormat(`es`,{numeric:`always`});function up(e){let t=sp(e);if(!t)return``;let n=Math.round((t.getTime()-Date.now())/1e3),r=Math.abs(n);return r<60?lp.format(Math.trunc(n)||-1,`second`):r<3600?lp.format(Math.trunc(n/60),`minute`):r<86400?lp.format(Math.trunc(n/3600),`hour`):r<604800?lp.format(Math.trunc(n/86400),`day`):r<2629800?lp.format(Math.trunc(n/604800),`week`):r<31557600?lp.format(Math.trunc(n/2629800),`month`):lp.format(Math.trunc(n/31557600),`year`)}function dp(e){let t=sp(e);if(!t)return``;let n=Math.abs(Math.round((Date.now()-t.getTime())/1e3));return n<60?`${Math.max(n,1)} s`:n<3600?`${Math.trunc(n/60)} min`:n<86400?`${Math.trunc(n/3600)} h`:n<604800?`${Math.trunc(n/86400)} d`:n<2629800?`${Math.trunc(n/604800)} sem`:n<31557600?`${Math.trunc(n/2629800)} mes`:`${Math.trunc(n/31557600)} año`}var fp=e=>String(e??0).padStart(2,`0`),pp=e=>new Intl.NumberFormat(`en-US`).format(Number(e??0));function mp(e){let t=Number(e||0);if(t<=0)return`0 min`;if(t<60)return`${t} min`;let n=Math.floor(t/60),r=t%60;return r>0?`${n} h ${r} min`:`${n} h`}function hp(e){let t=Number(e||0);return t>=1048576?`${(t/1048576).toFixed(1)} MB`:t>=1024?`${Math.round(t/1024)} KB`:`${t} B`}var gp={critical:{bg:`bg-[#D83B52]/15`,text:`text-[#E66A7A]`,border:`border-[#D83B52]/30`},warning:{bg:`bg-[#E0A21A]/15`,text:`text-[#E2B24C]`,border:`border-[#E0A21A]/30`},success:{bg:`bg-[#20C997]/15`,text:`text-[#20C997]`,border:`border-[#20C997]/30`},info:{bg:`bg-[#123A70]/30`,text:`text-[#3D82C6]`,border:`border-[#164A8A]/40`}};T.data(`appShell`,()=>({sidebarHover:!1,hoverTimeout:null,openSidebar(){clearTimeout(this.hoverTimeout),this.sidebarHover=!0},closeSidebar(){clearTimeout(this.hoverTimeout),this.hoverTimeout=setTimeout(()=>{this.sidebarHover=!1},180)}})),T.data(`notificationsDropdown`,()=>({openNotif:!1,loaded:!1,items:[],unreadCount:0,async init(){await this.refresh()},async refresh(){try{let e=await $f.list();this.items=(e.notifications||[]).map(e=>{let t=e.data||{},n=gp[t.level]?t.level:`info`;return{id:e.id,isUnread:!e.read_at,level:n,colors:gp[n],icon:t.icon||`notifications`,title:t.title||`Alerta Operacional`,message:t.message||``,folio:t.folio||null,url:t.action_url||`#`,ago:dp(e.created_at)}}),this.unreadCount=this.items.filter(e=>e.isUnread).length}catch{}this.loaded=!0},async markAsRead(e,t=null){try{await $f.markRead(e)}catch{}t&&t!==`#`&&(this.openNotif=!1,window.location.hash=t.replace(/^#/,``)),await this.refresh()},async markAllAsRead(){try{await $f.markAllRead()}catch{}await this.refresh()}})),T.data(`userMenu`,()=>({userMenuOpen:!1,async signOut(){await Af(),V(`/login`)}})),T.data(`sidebarSearch`,()=>({searchFocused:!1,term:Yd().query.search||``,submit(){V(`/incidencias`,{search:this.term.trim()})},focusSearch(e){let t=document.activeElement?.tagName;t!==`INPUT`&&t!==`TEXTAREA`&&t!==`SELECT`&&(e.preventDefault(),this.$refs.sidebarSearch.focus())}})),T.data(`accordion`,(e=!1)=>({open:e}));function _p(){return J`<div x-data="notificationsDropdown" class="relative">
        <button @click="openNotif = !openNotif" type="button"
            class="relative p-2 rounded-lg text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#11151B] transition-colors focus:outline-none"
            title="Centro de Notificaciones GTS" aria-label="Notificaciones" :aria-expanded="openNotif">
            <span class="material-symbols-outlined text-[20px]">notifications</span>
            <span x-show="unreadCount > 0" x-cloak x-text="unreadCount > 99 ? '99+' : unreadCount"
                class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D83B52] text-white text-[10px] font-bold flex items-center justify-center font-mono ring-2 ring-[#070A0F] animate-pulse"></span>
        </button>

        <div x-show="openNotif" x-cloak @click.outside="openNotif = false"
            x-transition:enter="transition ease-out duration-150"
            x-transition:enter-start="transform opacity-0 scale-95 -translate-y-1"
            x-transition:enter-end="transform opacity-100 scale-100 translate-y-0"
            x-transition:leave="transition ease-in duration-100"
            x-transition:leave-start="transform opacity-100 scale-100 translate-y-0"
            x-transition:leave-end="transform opacity-0 scale-95 -translate-y-1"
            class="absolute right-0 mt-2 w-80 sm:w-96 bg-[#11151B] border border-[#252C35] rounded-2xl shadow-enterprise z-50 overflow-hidden flex flex-col">
            <div class="px-4 py-3 border-b border-[#1B2129] flex items-center justify-between bg-[#0D1117]">
                <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-[#F2F5F8] tracking-wide">Notificaciones</span>
                    <span x-show="unreadCount > 0" x-cloak class="px-2 py-0.5 text-[10px] font-semibold font-mono rounded-full bg-[#D83B52]/20 text-[#E66A7A] border border-[#D83B52]/30">
                        <span x-text="unreadCount"></span> nuevas
                    </span>
                </div>
                <button x-show="unreadCount > 0" x-cloak @click="markAllAsRead()" type="button"
                    class="text-[11px] font-medium text-[#3D82C6] hover:text-[#5B9FE0] transition-colors focus:outline-none flex items-center gap-1" title="Marcar todas como leídas">
                    <span class="material-symbols-outlined text-[14px]">done_all</span>
                    <span>Marcar todas</span>
                </button>
            </div>

            <div class="max-h-80 overflow-y-auto divide-y divide-[#1B2129] scrollbar-thin">
                <template x-for="notif in items" :key="notif.id">
                    <div class="p-3 transition-colors flex items-start gap-3 group" :class="notif.isUnread ? 'bg-[#151A21]/70 hover:bg-[#18202A]' : 'bg-transparent hover:bg-[#151B23]'">
                        <div class="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 mt-0.5" :class="notif.colors.bg + ' ' + notif.colors.text + ' ' + notif.colors.border">
                            <span class="material-symbols-outlined text-[16px]" x-text="notif.icon"></span>
                        </div>
                        <div @click="markAsRead(notif.id, notif.url)" class="flex-1 min-w-0 cursor-pointer text-left">
                            <div class="flex items-center justify-between gap-1 mb-0.5">
                                <span class="text-xs font-semibold text-[#F2F5F8] truncate leading-tight group-hover:text-[#3D82C6] transition-colors" x-text="notif.title"></span>
                                <span class="text-[10px] font-mono text-[#778394] shrink-0" x-text="notif.ago"></span>
                            </div>
                            <p class="text-[11px] text-[#A8B0BC] leading-snug line-clamp-2" x-text="notif.message"></p>
                            <template x-if="notif.folio">
                                <div class="mt-1 flex items-center gap-2">
                                    <span class="text-[10px] font-mono font-bold text-[#3D82C6] bg-[#123A70]/30 px-1.5 py-0.5 rounded border border-[#164A8A]/40" x-text="notif.folio"></span>
                                    <span x-show="notif.isUnread" class="inline-flex items-center gap-1 text-[9px] font-medium text-[#E2B24C]">
                                        <span class="w-1.5 h-1.5 rounded-full bg-[#E0A21A]"></span>
                                        Sin leer
                                    </span>
                                </div>
                            </template>
                        </div>
                        <button x-show="notif.isUnread" @click.stop="markAsRead(notif.id)" type="button"
                            class="p-1 rounded text-[#778394] hover:text-[#20C997] hover:bg-[#11151B] transition-colors shrink-0 focus:outline-none" title="Marcar como leída">
                            <span class="material-symbols-outlined text-[15px]">check</span>
                        </button>
                    </div>
                </template>

                <template x-if="loaded && items.length === 0">
                    <div class="py-8 px-4 text-center flex flex-col items-center justify-center gap-2 text-[#778394]">
                        <div class="w-10 h-10 rounded-full bg-[#0D1117] border border-[#252C35] flex items-center justify-center text-[#8D98A8]">
                            <span class="material-symbols-outlined text-[20px]">notifications_paused</span>
                        </div>
                        <p class="text-xs font-medium text-[#F2F5F8]">Sin notificaciones pendientes</p>
                        <p class="text-[11px] text-[#707B8A] max-w-[220px]">Las alertas de asignación, resolución y cambios de estado aparecerán aquí.</p>
                    </div>
                </template>
            </div>

            <div class="px-4 py-2 bg-[#0D1117] border-t border-[#1B2129] flex items-center justify-between text-[10px] font-mono text-[#778394]">
                <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#20C997]"></span>
                    <span>GTS • Canal Operacional Seguro</span>
                </span>
                <span class="text-[#8D98A8] font-sans">${_f()}</span>
            </div>
        </div>
    </div>`}function vp(){let e=af();return J`<header class="h-16 px-4 sm:px-6 bg-brand-topbar border-b border-[#1B2129] flex items-center justify-between gap-4 shrink-0 select-none z-30 w-full">
        <div class="flex items-center gap-3 shrink-0">
            <a href="#/dashboard" class="flex items-center gap-3 group focus:outline-none">
                ${Wf({showBrandText:!0,imgClass:`w-10 h-10`})}
            </a>
        </div>

        <div class="hidden md:flex items-center justify-center flex-1 px-4">
            ${Gf({imgClass:`h-7 lg:h-8`})}
        </div>

        <div class="flex items-center gap-3 sm:gap-4 shrink-0">
            ${_p()}

            <div x-data="userMenu" class="relative">
                <button @click="userMenuOpen = !userMenuOpen" @click.outside="userMenuOpen = false" type="button"
                    class="flex items-center gap-2.5 p-1 rounded-lg hover:bg-[#11151B] transition-colors focus:outline-none">
                    <div class="w-8 h-8 rounded-full bg-[#123A70] text-white font-bold text-xs flex items-center justify-center border border-[#164A8A] shrink-0 font-mono shadow-sm">
                        ${vf()}
                    </div>
                    <div class="hidden md:flex flex-col text-left leading-tight">
                        <span class="text-xs font-semibold text-[#F2F5F8]">${e?.name}</span>
                        <span class="text-[10px] text-[#8D98A8] font-medium">${gf()}</span>
                    </div>
                    <span class="material-symbols-outlined text-[16px] text-[#778394] hidden md:inline">expand_more</span>
                </button>

                <div x-show="userMenuOpen" x-cloak
                    x-transition:enter="transition ease-out duration-150"
                    x-transition:enter-start="transform opacity-0 scale-95 -translate-y-1"
                    x-transition:enter-end="transform opacity-100 scale-100 translate-y-0"
                    x-transition:leave="transition ease-in duration-100"
                    x-transition:leave-start="transform opacity-100 scale-100 translate-y-0"
                    x-transition:leave-end="transform opacity-0 scale-95 -translate-y-1"
                    class="absolute right-0 mt-2 w-52 bg-[#11151B] border border-[#252C35] rounded-xl shadow-enterprise py-1.5 z-50 divide-y divide-[#1B2129]">
                    <div class="px-3 py-2">
                        <p class="text-xs font-semibold text-[#F2F5F8]">${e?.name}</p>
                        <p class="text-[10px] text-[#8D98A8] font-mono truncate">${e?.email?e.email:`@${e?.username}`}</p>
                        <div class="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-[#707B8A]">
                            <span>${e?.role?.name??`Usuario`}</span>
                        </div>
                    </div>
                    <div class="py-1">
                        <a href="#/perfil" class="flex items-center gap-2 px-3 py-1.5 text-xs text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23] transition-colors">
                            <span class="material-symbols-outlined text-[16px]">person</span>
                            <span>Mi Perfil</span>
                        </a>
                        ${Lf()?J`<a href="#/auditoria" class="flex items-center gap-2 px-3 py-1.5 text-xs text-[#9AA5B4] hover:text-[#F2F5F8] hover:bg-[#151B23] transition-colors">
                                <span class="material-symbols-outlined text-[16px]">history</span>
                                <span>Bitácora de Auditoría</span>
                            </a>`:``}
                    </div>
                    <div class="py-1">
                        <button type="button" @click="signOut()" class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#E66A7A] hover:bg-[#D83B52]/10 transition-colors">
                            <span class="material-symbols-outlined text-[16px]">logout</span>
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>`}var yp=e=>e?`text-[#F2F5F8] bg-[#11151B] border border-[#263241]`:`border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]`,bp=e=>e?`text-[#F2F5F8] bg-[#101923] border border-[#263241] font-semibold`:`border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]`;function xp(){let{query:e}=Yd(),t=e.search||``,n=H(`incidents.*`);return J`
    <div @mouseenter="openSidebar()" class="fixed top-16 bottom-0 left-0 w-3.5 z-30 pointer-events-auto bg-transparent select-none" aria-hidden="true"></div>

    <aside @mouseenter="openSidebar()" @mouseleave="closeSidebar()" @focusin="openSidebar()" @focusout="closeSidebar()"
        :class="sidebarHover ? 'translate-x-0 shadow-2xl shadow-black/80' : '-translate-x-full shadow-none'"
        class="fixed inset-y-0 left-0 z-40 top-16 w-64 bg-[#070A0F] border-r border-[#1B2129] flex flex-col justify-between -translate-x-full shadow-none transition-transform duration-200 ease-out shrink-0 select-none">

        ${jf()?J`<div class="p-3 border-b border-[#1B2129] shrink-0" x-data="sidebarSearch" @keydown.window.slash="focusSearch($event)" @keydown.window.ctrl.k.prevent="$refs.sidebarSearch.focus()" @keydown.window.cmd.k.prevent="$refs.sidebarSearch.focus()">
                <form @submit.prevent="submit()" class="relative" autocomplete="off">
                    <span class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none transition-colors" :class="searchFocused ? 'text-[#3D82C6]' : 'text-[#707B8A]'">
                        <span class="material-symbols-outlined text-[16px]">search</span>
                    </span>
                    <input x-ref="sidebarSearch" x-model="term" @focus="searchFocused = true" @blur="searchFocused = false"
                        type="search" name="search" placeholder="Buscar incidencias..." autocomplete="off" autocorrect="off" spellcheck="false"
                        class="w-full pl-8 pr-7 py-2 bg-[#0D1117] border border-[#252C35] hover:border-[#344050] focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-xl text-xs text-[#D6DCE4] placeholder-[#6F7A89] transition-all outline-none">
                    ${t?J`<a href="#/incidencias" class="absolute inset-y-0 right-0 pr-2 flex items-center text-[#707B8A] hover:text-[#E66A7A] transition-colors" title="Limpiar búsqueda">
                            <span class="material-symbols-outlined text-[14px]">close</span></a>`:J`<span class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-[#566170] text-[10px] font-mono select-none" title="Presiona / para buscar">/</span>`}
                </form>
            </div>`:``}

        <div class="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-thin p-3.5 space-y-1.5">
            <a href="#/dashboard" class="${X(`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all`,H(`dashboard`)?`bg-gradient-to-r from-[#0E2D56] to-[#123A70] text-[#F2F5F8] border border-[#164A8A]/40 shadow-sm`:`border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]`)}">
                <span class="material-symbols-outlined text-[19px]">home</span>
                <span>Inicio</span>
            </a>

            ${mf(`incidents.create`,`incidents.view_assigned`,`incidents.view_department`,`incidents.view_all`)?J`<div x-data="accordion(${Y(n)})" class="space-y-1">
                    <button @click="open = !open" type="button" class="${X(`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(n))}">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[19px]">confirmation_number</span>
                            <span>Incidencias</span>
                        </div>
                        <span class="material-symbols-outlined text-[16px] text-[#707B8A] transition-transform duration-200" :class="open ? 'rotate-180 text-[#F2F5F8]' : ''">expand_more</span>
                    </button>
                    <div x-show="open" x-cloak
                        x-transition:enter="transition ease-out duration-150" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0"
                        x-transition:leave="transition ease-in duration-100" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-1"
                        class="pl-4 pr-1 py-1 space-y-1">
                        ${Mf()?J`<a href="#/incidencias/nueva" class="${X(`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors`,bp(H(`incidents.create`)))}">
                                <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">add</span>
                                <span>Registrar incidencia</span>
                            </a>`:``}
                        ${Nf()?J`<a href="#/incidencias/mis" class="${X(`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors`,bp(H(`incidents.my`)))}">
                                <span class="material-symbols-outlined text-[16px] text-[#707B8A]">format_list_bulleted</span>
                                <span>Mis incidencias</span>
                            </a>`:``}
                        ${Pf()?J`<a href="#/incidencias" class="${X(`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors`,bp(H(`incidents.index`)))}">
                                <span class="material-symbols-outlined text-[16px] text-[#707B8A]">view_list</span>
                                <span>Todas las incidencias</span>
                            </a>`:``}
                    </div>
                </div>`:``}

            ${Ff()?J`<a href="#/reportes" class="${X(`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(H(`reports.*`)))}" title="Descargar reporte">
                    <span class="material-symbols-outlined text-[19px]">bar_chart</span>
                    <span>Descargar reporte</span>
                </a>`:``}

            <a href="#/indicadores" class="${X(`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(H(`indicators.*`)))}">
                <span class="material-symbols-outlined text-[19px]">speed</span>
                <span>Indicadores</span>
            </a>

            ${Lf()?J`<a href="#/auditoria" class="${X(`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(H(`audit.*`)))}">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[19px]">manage_history</span>
                        <span>Auditoría</span>
                    </div>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-[#93C5FD]">LOG</span>
                </a>`:``}

            ${zf()?J`<a href="#/configuracion/roles" class="${X(`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(H(`roles.*`)))}">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[19px]">admin_panel_settings</span>
                        <span>Roles y Permisos</span>
                    </div>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1E293B] text-[#A78BFA]">SEC</span>
                </a>`:``}

            <a href="#/catalogos" class="${X(`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,yp(H(`catalogs.*`)))}">
                <span class="material-symbols-outlined text-[19px]">layers</span>
                <span>Catálogos</span>
            </a>

            <a href="#/perfil" class="${X(`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all`,H(`profile.*`,`users.*`,`roles.*`)?`bg-gradient-to-r from-[#0E2D56] to-[#123A70] text-[#F2F5F8] border border-[#164A8A]/40 font-semibold shadow-sm`:`border border-transparent text-[#A8B0BC] hover:text-[#F2F5F8] hover:bg-[#101923]`)}">
                <span class="material-symbols-outlined text-[19px]">settings</span>
                <span>Configuración</span>
            </a>
        </div>

        <div class="px-4 py-3 border-t border-[#1B2129] bg-[#070A0F]/60 flex items-center justify-between text-[10px] font-mono text-[#707B8A] shrink-0">
            <span>v1.0.0</span>
            <span class="text-[#707B8A] font-mono text-[10px] uppercase">${hf()}</span>
        </div>
    </aside>`}function Sp(e){return J`<div x-data="appShell" @keydown.escape.window="sidebarHover = false" class="flex h-screen w-screen flex-col overflow-hidden bg-brand-canvas">
        ${vp()}
        <div class="flex-1 flex overflow-hidden min-h-0">
            ${xp()}
            <main id="main" class="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin">${e}</main>
        </div>
    </div>`}function Cp(e){return J`<div class="relative font-sans text-brand-text-primary antialiased bg-brand-canvas min-h-screen flex flex-col justify-center items-center p-4 overflow-hidden selection:bg-brand-primary selection:text-white">
        <!-- Fondo institucional: AIFA nocturno difuminado -->
        <div class="gts-login-bg fixed inset-0 bg-cover bg-center scale-[1.02] blur-[2px] saturate-[1.1]" style="background-image: url('./images/aifa-noche-4k.jpg');" aria-hidden="true"></div>
        <div class="fixed inset-0 bg-gradient-to-b from-[#05070A]/45 via-[#05070A]/15 to-[#05070A]/60" aria-hidden="true"></div>
        <div class="fixed inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,7,10,0.45)_80%)]" aria-hidden="true"></div>

        <div class="relative z-10 w-full sm:max-w-md flex flex-col items-center gap-6">
            <a href="#/login" class="flex flex-col items-center gap-2 group focus:outline-none">
                ${Wf({imgClass:`w-20 h-20 drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)]`})}
                <div class="flex flex-col items-center text-center mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    <span class="text-xl font-bold text-brand-text-primary tracking-wider leading-tight">GTS AIFA</span>
                    <span class="text-xs text-[#C5CED8] mt-0.5">Grupo de Seguridad Tecnológica</span>
                </div>
            </a>
            <div class="w-full bg-[#11151B]/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-enterprise-lg p-6 sm:p-8">${e}</div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-[#A8B0BC] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                <span class="w-1.5 h-1.5 rounded-full bg-[#20C997]"></span>
                <span>NOC / APOC • Sistema Operativo Seguro</span>
            </div>
        </div>
    </div>`}function wp(e,t){return J`<div class="w-full max-w-3xl mx-auto px-4 py-24 flex flex-col items-center text-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-[#11151B] border border-[#252C35] flex items-center justify-center text-[#E66A7A]">
            <span class="material-symbols-outlined text-[34px]">${{403:`gpp_bad`,404:`search_off`,0:`wifi_off`,500:`error`}[e]??`error`}</span>
        </div>
        <span class="font-mono text-xs text-[#707B8A] tracking-widest">${e?`ERROR ${e}`:`ERROR`}</span>
        <h1 class="text-2xl font-bold text-[#F2F5F8]">${{403:`Acceso denegado`,404:`Recurso no encontrado`,0:`Sin conexión`,500:`Error del sistema`}[e]??`Error`}</h1>
        <p class="text-sm text-[#8D98A8] max-w-md">${t}</p>
        <a href="#/dashboard" class="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all">
            <span class="material-symbols-outlined text-[18px]">home</span>
            <span>Volver al inicio</span>
        </a>
    </div>`}var Tp=null;T.data(`loginForm`,()=>({username:``,password:``,remember:!1,error:Tp,submitting:!1,async submit(){if(!this.submitting){this.submitting=!0,this.error=null;try{await kf(this.username,this.password,this.remember),V(`/dashboard`)}catch(e){this.error=G(e).message,this.password=``}finally{this.submitting=!1}}}}));var Ep={name:`login`,title:`Iniciar sesión`,guest:!0,async render(){return of()?(V(`/dashboard`),J``):(Tp=bf().login_error??null,J`<form x-data="loginForm" @submit.prevent="submit()">
            <div>
                <label for="username" class="block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5">Usuario</label>
                <input id="username" x-model="username" class="bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none block mt-1 w-full"
                    type="text" name="username" required autofocus autocomplete="username" placeholder="ej. admin o gts.mendoza" />
                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1 mt-2"><li x-text="error"></li></ul>
            </div>

            <div class="mt-4">
                <label for="password" class="block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5">Contraseña</label>
                <input id="password" x-model="password" class="bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none block mt-1 w-full"
                    type="password" name="password" required autocomplete="current-password" placeholder="••••••••" />
            </div>

            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" x-model="remember" type="checkbox" class="rounded bg-[#0A0D12] border-[#252C35] text-[#123A70] shadow-sm focus:ring-[#164A8A] focus:ring-offset-[#0A0D12]" name="remember">
                    <span class="ms-2 text-xs text-brand-text-muted">Recordarme</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <button type="submit" :disabled="submitting" class="ms-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white text-xs font-semibold rounded-lg shadow-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#164A8A] transition-all duration-150 disabled:opacity-60">
                    <span x-show="submitting" x-cloak class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    <span x-text="submitting ? 'Verificando…' : 'Iniciar sesión'">Iniciar sesión</span>
                </button>
            </div>
        </form>`)}},Dp={name:`setup`,guest:!0,async render(){return J`<div class="flex flex-col gap-4 text-xs text-[#8D98A8]">
            <div class="flex items-center gap-2 text-[#E2B24C] font-semibold text-sm">
                <span class="material-symbols-outlined text-[20px]">settings_alert</span>
                <span>Falta configurar la conexión a Supabase</span>
            </div>
            <p>La aplicación se publicó sin la URL ni la clave pública (<span class="font-mono">anon key</span>) del proyecto de Supabase.</p>
            <ol class="list-decimal list-inside space-y-1.5">
                <li>En GitHub, abra <strong class="text-[#F2F5F8]">Settings → Secrets and variables → Actions → Variables</strong>.</li>
                <li>Cree <span class="font-mono text-[#93C5FD]">SUPABASE_URL</span> y <span class="font-mono text-[#93C5FD]">SUPABASE_ANON_KEY</span> con los datos de <strong class="text-[#F2F5F8]">Project Settings → API</strong> de Supabase.</li>
                <li>Vuelva a ejecutar el flujo <strong class="text-[#F2F5F8]">Desplegar en GitHub Pages</strong> desde la pestaña Actions.</li>
            </ol>
            <p class="text-[11px] text-[#707B8A]">Alternativa: edite <span class="font-mono">config.js</span> en la raíz del sitio publicado.</p>
        </div>`}},Op=e=>e?.origin_group===`CCO`,kp=e=>e?.origin_group===`CSA`;function Ap(e){if(!e?.reported_by)return null;switch(e.origin_group){case`CCO`:return{label:`CCO`,title:`Procedencia: APOC-CCO`,bg:`bg-amber-500/10`,text:`text-amber-400`,border:`border-amber-500/20`};case`CSA`:return{label:`CSA`,title:`Procedencia: APOC-CSA`,bg:`bg-orange-500/10`,text:`text-orange-400`,border:`border-orange-500/20`};case`GTS`:return{label:`GTS`,title:`Procedencia: GTS`,bg:`bg-cyan-500/10`,text:`text-cyan-400`,border:`border-cyan-500/20`};case`ADMIN`:return{label:`ADMIN`,title:`Procedencia: Administrador`,bg:`bg-purple-500/10`,text:`text-purple-400`,border:`border-purple-500/20`};default:{let t=e.reported_by.role,n=t?.name??e.origin_group??`GTS`;return{label:n,title:`Procedencia: ${n}`,bg:t?.badge_bg||`bg-slate-500/10`,text:t?.badge_text||`text-slate-400`,border:t?.badge_border||`border-slate-500/20`}}}}var jp=e=>e?.assigned_specialist===`TICS`||(e?.assigned_areas??[]).some(e=>String(e.area_code).toLowerCase()===`tics`),Mp=e=>(e?.assigned_areas??[]).map(e=>e.area_name),Np=e=>e.area_code===`tics`?`TICS`:e.role?.name??String(e.area_code).toUpperCase();function Pp(e){return e.area_code===`tics`?`bg-blue-500/10 text-blue-400 border-blue-500/20`:e.role?`${e.role.badge_bg??`bg-surface-container-high`} ${e.role.badge_text??`text-primary`} ${e.role.badge_border??`border-border-subtle`}`:`bg-surface-container-high text-on-surface border-border-subtle`}function Fp(e){return e===`NUEVA`||e===`ASIGNADA`?`bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)]`:e===`EN_ATENCION`||e===`EN_PROCESO`?`bg-[rgba(224,162,26,0.15)] text-[#E2B24C] border border-[rgba(224,162,26,0.30)]`:e===`RESUELTA`?`bg-[rgba(32,201,151,0.15)] text-[#20C997] border border-[rgba(32,201,151,0.30)]`:`bg-[#151A21] text-[#9AA5B4] border border-[#252C35]`}var Ip={CREADA:`Creación de Expediente`,ASIGNACION:`Asignación Técnica`,CAMBIO_ESTADO:`Cambio de Estado`,INICIO_ATENCION:`Inicio de Atención`,NOTA_TECNICA:`Nota de Campo`,RESOLUCION:`Resolución Técnica`,RECHAZO_SOLUCION:`Rechazo de Solución`,CERRADA:`Cierre Definitivo (VoBo)`},Lp=e=>Ip[e]??e;function Rp(e){return{CREADA:`add_circle`,ASIGNACION:`person_add`,CAMBIO_ESTADO:`sync_alt`,INICIO_ATENCION:`engineering`,NOTA_TECNICA:`edit_note`,RESOLUCION:`task_alt`,RECHAZO_SOLUCION:`replay`,CERRADA:`verified`}[e]??`info`}function zp(e){return{CREADA:`bg-primary/10 text-primary border border-primary/30`,ASIGNACION:`bg-sky-500/10 text-sky-400 border border-sky-500/30`,CAMBIO_ESTADO:`bg-amber-500/10 text-amber-400 border border-amber-500/30`,INICIO_ATENCION:`bg-indigo-500/10 text-indigo-400 border border-indigo-500/30`,NOTA_TECNICA:`bg-cyan-500/10 text-cyan-400 border border-cyan-500/30`,RESOLUCION:`bg-emerald-500/10 text-emerald-400 border border-emerald-500/30`,RECHAZO_SOLUCION:`bg-rose-500/10 text-rose-400 border border-rose-500/30`,CERRADA:`bg-slate-700/60 text-slate-200 border border-slate-600/50`}[e]??`bg-surface-container-high text-on-surface-variant border border-border-subtle`}var Bp=e=>String(e?.mime_type??``).startsWith(`image/`),Vp=e=>e?.mime_type===`application/pdf`,Hp=e=>hp(e?.file_size_bytes);function Up(e){return Bp(e)?`image`:Vp(e)?`picture_as_pdf`:String(e?.mime_type??``).includes(`text`)?`description`:`attach_file`}function Wp(e){return Bp(e)?`text-cyan-400 bg-cyan-500/10 border-cyan-500/30`:Vp(e)?`text-rose-400 bg-rose-500/10 border-rose-500/30`:`text-amber-400 bg-amber-500/10 border-amber-500/30`}function Gp(e){return e===`cctv`?`videocam`:e===`control-acceso`?`door_front`:e===`fids`?`tv`:`radio`}function Kp(e){return e.length?J`${e.slice(0,5).map(e=>{let t=Ap(e),n=`#/incidencias/${encodeURIComponent(e.folio)}`;return J`<tr onclick="window.location.hash='${n.slice(1)}'" class="hover:bg-[#151B23] cursor-pointer transition-colors group" title="Ver expediente ${e.folio}">
            <td class="py-1.5 px-3.5 font-mono font-bold text-[#3D82C6] whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                    <a href="${n}" class="group-hover:underline">${e.folio}</a>
                    ${t?J`<span class="${X(`inline-flex items-center px-1 py-0.2 rounded text-[8.5px] font-bold font-mono tracking-wider border`,t.bg,t.text,t.border)}" title="${t.title}">${t.label}</span>`:``}
                </div>
            </td>
            <td class="py-1.5 px-3.5 text-[#7E8998] font-mono whitespace-nowrap">${Z(e.created_at,`d/m/Y H:i`)}</td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">
                <span class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[15px] text-[#707B8A]">${Gp(e.category?.slug)}</span>
                    <span>${e.category?.name??`CCTV`}</span>
                </span>
            </td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">${Uf(e.status)}</td>
            <td class="py-1.5 px-3.5 whitespace-nowrap">${Hf(e.priority)}</td>
        </tr>`})}`:J`<tr><td colspan="5" class="py-6 text-center text-xs text-[#7E8998]">No hay incidencias registradas en el sistema.</td></tr>`}T.data(`recentIncidentsPoller`,()=>({timer:null,signature:null,isPolling:!1,onVisible:null,init(){this.timer=setInterval(()=>this.poll(),4e3),this.onVisible=()=>{document.visibilityState===`visible`&&this.poll()},document.addEventListener(`visibilitychange`,this.onVisible)},destroy(){this.timer&&clearInterval(this.timer),document.removeEventListener(`visibilitychange`,this.onVisible)},async poll(){if(!this.isPolling){this.isPolling=!0;try{let e=await Xf.recent(),t=e.map(e=>`${e.id}:${e.updated_at}`).join(`|`);t!==this.signature&&(this.signature!==null&&this.$refs.recentTableBody&&(this.$refs.recentTableBody.innerHTML=String(Kp(e))),this.signature=t)}catch{}finally{this.isPolling=!1}}}})),T.data(`clock`,()=>({timeStr:new Date().toLocaleTimeString(`es-MX`,{hour:`2-digit`,minute:`2-digit`}),dateStr:new Date().toLocaleDateString(`es-MX`,{day:`numeric`,month:`long`,year:`numeric`}),timer:null,init(){this.timer=setInterval(()=>{this.timeStr=new Date().toLocaleTimeString(`es-MX`,{hour:`2-digit`,minute:`2-digit`})},1e3)},destroy(){clearInterval(this.timer)}}));function qp(e,t,n){let r=0;return J`<svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r="38" fill="none" stroke="#1B2129" stroke-width="12" />
        ${e.map(e=>{let i=t>0?Math.round(e.count/t*238.76):0;if(i<=0)return``;let a=J`<circle cx="50" cy="50" r="38" fill="none" stroke="${n(e)}" stroke-width="12" stroke-dasharray="${i} 239" stroke-dashoffset="-${r}" />`;return r+=i,a})}
    </svg>`}var Jp={critica:`#D83B52`,alta:`#F59E0B`,media:`#10B981`,baja:`#1E5FA7`};function Yp(e,t,n,r,i,a){return J`<div class="bg-brand-surface border border-brand-border rounded-xl p-2.5 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
        <div class="flex items-center gap-2.5">
            <div class="${X(`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm`,t)}">
                <span class="material-symbols-outlined text-[18px]">${e}</span>
            </div>
            <div class="flex flex-col leading-tight min-w-0">
                <span class="font-mono text-xl lg:text-2xl font-bold text-[#F2F5F8] tabular-nums">${n}</span>
                <span class="text-[11px] text-[#7F8A99] truncate">${r}</span>
            </div>
        </div>
        <div class="${X(`flex items-center gap-1 mt-1 text-[10px] font-medium`,a)}">
            <span class="truncate">${i}</span>
        </div>
    </div>`}function Xp(e,t,n,r){return J`<a href="${e}" class="w-full p-1.5 rounded-lg bg-[#0F141B] border border-[#252C35] hover:border-[#2A3440] hover:bg-[#151A21] text-[#E2E7ED] flex items-center gap-2.5 transition-all group">
        <div class="w-6 h-6 rounded-md bg-[#151A21] border border-[#252C35] flex items-center justify-center text-[#8A95A4] shrink-0 group-hover:text-white group-hover:bg-[#1A222C] transition-colors">
            <span class="material-symbols-outlined text-[15px]">${t}</span>
        </div>
        <div class="flex flex-col text-left leading-tight">
            <span class="text-xs font-semibold text-[#E2E7ED]">${n}</span>
            <span class="text-[9px] text-[#8A95A4]">${r}</span>
        </div>
    </a>`}var Zp={name:`dashboard`,title:`Inicio`,async render(){let e=await Xf.data(`today`),t=e.metrics,n=e.distribution,r=e.priorities_summary,i=e.systems_health;return J`<div class="min-h-full lg:h-full p-3.5 lg:p-4 flex flex-col justify-between lg:overflow-hidden gap-3 select-none bg-brand-canvas">
            <div class="sr-only" aria-hidden="true">
                <h1>Dashboard Operativo</h1>
                ${e.immediate_attention.map(e=>J`<div>${e.folio} - ${e.title}</div>`)}
            </div>

            <div class="flex items-center justify-between gap-4 shrink-0">
                <div class="flex flex-col">
                    <h1 class="text-lg lg:text-xl font-bold text-white tracking-tight">Bienvenido, ${af()?.name}</h1>
                    <p class="text-xs text-brand-text-muted mt-0.5">Aquí encontrarás el resumen de las incidencias y el estado operativo de los sistemas de seguridad tecnológica.</p>
                </div>
                <div x-data="clock" class="hidden sm:flex flex-col items-end text-right shrink-0 leading-tight">
                    <div class="flex items-center gap-3 text-xs font-mono text-slate-300">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[15px] text-[#707B8A]">calendar_today</span>
                            <span x-text="dateStr"></span>
                        </span>
                        <span class="flex items-center gap-1.5 font-bold text-[#F2F5F8]">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">schedule</span>
                            <span x-text="timeStr"></span>
                        </span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-[#707B8A] font-medium mt-0.5">
                        <span class="material-symbols-outlined text-[12px] text-[#D83B52]">location_on</span>
                        <span>AIFA • Santa Lucía, Edo. de México</span>
                    </div>
                </div>
            </div>

            <div class="flex-1 min-h-0 grid grid-cols-12 gap-3">
                <div class="col-span-12 lg:col-span-9 flex flex-col justify-between gap-3 lg:h-full lg:overflow-hidden">
                    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 shrink-0">
                        ${Yp(`description`,`bg-[#164A8A]`,t.total,`Total incidencias`,`Histórico plataforma`,`text-[#7F8A99]`)}
                        ${Yp(`inbox`,`bg-[#0284C7]`,t.new,`Nuevas`,`Por asignar`,t.new>0?`text-[#38BDF8]`:`text-[#7F8A99]`)}
                        ${Yp(`schedule`,`bg-[#D99A18]`,t.in_process,`En proceso`,`Atención técnica activa`,`text-[#FBBF24]`)}
                        ${Yp(`check_circle`,`bg-[#12B886]`,t.resolved,`Resueltas`,`Cerradas y concluidas`,`text-[#20C997]`)}
                        ${Yp(`warning`,`bg-[#D83B52]`,t.critical,`Críticas`,`Severidad alta activa`,t.critical>0?`text-[#F87171]`:`text-[#7F8A99]`)}
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:h-[152px] shrink-0">
                        <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
                            <div class="flex items-center justify-between border-b border-[#202731] pb-1.5 shrink-0">
                                <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">pie_chart</span>
                                    <span>Incidencias por tipo</span>
                                </h2>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono text-[#7E8998] bg-[#151B23] border border-[#202731]">Categorías AIFA</span>
                            </div>
                            <div class="flex items-center justify-between gap-4 flex-1 min-h-0 pt-1.5">
                                <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                    ${qp(n.categories,n.total_active,e=>e.color)}
                                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                        <span class="font-mono text-sm font-bold text-[#F2F5F8] leading-none">${n.total_active}</span>
                                        <span class="text-[8px] text-[#707B8A] mt-0.5">Activas</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 text-[10.5px] min-w-0 flex-1 overflow-y-auto scrollbar-thin pr-1">
                                    ${n.categories.length?n.categories.map(e=>J`<div class="flex items-center justify-between bg-[#11161D]/50 px-2 py-0.5 rounded border border-[#1A222C]">
                                            <span class="flex items-center gap-1.5 text-[#DDE3EA] truncate" title="${e.name}">
                                                <span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${e.color}"></span>
                                                <span class="truncate text-[10.5px]">${e.name}</span>
                                            </span>
                                            <span class="font-mono text-[#9AA5B4] shrink-0 ml-1 text-[10px]">
                                                <span class="font-bold text-[#F2F5F8]">${e.count}</span>
                                                <span class="text-[#707B8A] text-[9px]">(${e.percentage}%)</span>
                                            </span>
                                        </div>`):J`<div class="col-span-2 text-[10px] text-[#707B8A] py-2 text-center">Sin incidencias activas</div>`}
                                </div>
                            </div>
                        </div>

                        <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm hover:border-[#2A3440] transition-all">
                            <div class="flex items-center justify-between border-b border-[#202731] pb-1.5 shrink-0">
                                <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                    <span class="material-symbols-outlined text-[15px] text-[#F59E0B]">signal_cellular_alt</span>
                                    <span>Incidencias por prioridad</span>
                                </h2>
                                <span class="px-2 py-0.5 rounded text-[10px] font-mono text-[#7E8998] bg-[#151B23] border border-[#202731]">Severidad OACI</span>
                            </div>
                            <div class="flex items-center justify-between gap-4 flex-1 min-h-0 pt-1.5">
                                <div class="relative w-24 h-24 shrink-0 flex items-center justify-center">
                                    ${qp(r.items,r.total,e=>Jp[e.slug]??`#687383`)}
                                    <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                        <span class="font-mono text-sm font-bold text-[#F2F5F8] leading-none">${r.total}</span>
                                        <span class="text-[8px] text-[#707B8A] mt-0.5">Activas</span>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1.5 text-[10.5px] min-w-0 flex-1 pr-1">
                                    ${r.items.length?r.items.map(e=>J`<div class="flex items-center justify-between bg-[#11161D]/50 px-2.5 py-1 rounded border border-[#1A222C]">
                                            <span class="flex items-center gap-1.5 text-[#DDE3EA] truncate">
                                                <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${Jp[e.slug]??`#687383`}"></span>
                                                <span class="truncate font-medium text-[11px]">${e.name}</span>
                                            </span>
                                            <span class="font-mono text-[#9AA5B4] shrink-0 ml-1 text-[10.5px]">
                                                <span class="font-bold text-[#F2F5F8]">${e.count}</span>
                                                <span class="text-[#707B8A] text-[9.5px]">(${e.percentage}%)</span>
                                            </span>
                                        </div>`):J`<div class="col-span-2 text-[10px] text-[#707B8A] text-center">Sin prioridades activas</div>`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div x-data="recentIncidentsPoller" class="bg-brand-surface border border-brand-border rounded-xl shadow-enterprise flex flex-col flex-1 min-h-[220px] overflow-hidden hover:border-[#2A3440] transition-all">
                        <div class="px-3.5 py-1.5 border-b border-[#202731] flex items-center justify-between shrink-0 bg-[#0D1117]">
                            <div class="flex items-center gap-2">
                                <h2 class="text-xs font-bold text-[#F2F5F8]">Últimas incidencias</h2>
                                <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#151B23] text-[10px] font-mono text-[#7E8998] border border-[#202731]">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>En tiempo real</span>
                                </span>
                            </div>
                            ${jf()?J`<a href="#/incidencias" class="text-[11px] font-medium text-[#3D82C6] hover:text-[#6FA2D2] flex items-center gap-1 transition-colors group">
                                    <span>Ver todas las incidencias</span>
                                    <span class="text-[13px] group-hover:translate-x-0.5 transition-transform">→</span>
                                </a>`:``}
                        </div>
                        <div class="flex-1 overflow-x-auto overflow-y-auto scrollbar-thin">
                            <table class="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr class="bg-[#0D1117] text-[10px] font-semibold text-[#7E8998] border-b border-[#202731] sticky top-0 z-10 select-none">
                                        <th class="py-1.5 px-3.5 font-mono">Folio</th>
                                        <th class="py-1.5 px-3.5">Fecha / Hora</th>
                                        <th class="py-1.5 px-3.5">Tipo / Categoría</th>
                                        <th class="py-1.5 px-3.5">Estado</th>
                                        <th class="py-1.5 px-3.5">Prioridad</th>
                                    </tr>
                                </thead>
                                <tbody x-ref="recentTableBody" class="divide-y divide-[#202731] text-[11px] text-[#DDE3EA]">
                                    ${Kp(e.recent_incidents)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-3 flex flex-col justify-between gap-3 lg:h-full lg:overflow-hidden">
                    <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm shrink-0">
                        <div class="flex items-center justify-between mb-2 pb-1.5 border-b border-[#202731]">
                            <h2 class="text-xs font-bold text-[#F2F5F8] flex items-center gap-1.5">
                                <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">hub</span>
                                <span>Estado de sistemas (monitoreo)</span>
                            </h2>
                            ${i.total>0?J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono border"
                                    style="background-color: ${i.badge_bg}; color: ${i.color}; border-color: ${i.badge_border};"
                                    title="Disponibilidad: ${i.active}/${i.total} sistemas operativos">
                                    <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${i.color}"></span>
                                    ${i.state} (${i.percentage}%)
                                </span>`:J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-[#707B8A] bg-[#151B23] border border-[#202731]">Sin registros</span>`}
                        </div>
                        <div class="space-y-1.5 text-xs max-h-48 overflow-y-auto scrollbar-thin pr-1">
                            ${i.systems.length?i.systems.map(e=>J`<div class="flex items-center justify-between py-0.5">
                                    <span class="flex items-center gap-2 text-[#D6DCE4] truncate min-w-0" title="${e.name} (${e.code??`S/C`})">
                                        <span class="material-symbols-outlined text-[17px] text-brand-text-muted shrink-0">${e.icon}</span>
                                        <span class="truncate">${e.name}</span>
                                    </span>
                                    <span class="flex items-center gap-1.5 text-[11px] font-medium shrink-0 ml-1.5" style="color: ${e.status_color}">
                                        <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background-color: ${e.status_color}"></span>
                                        ${e.status_label}
                                    </span>
                                </div>`):J`<div class="py-3 text-center text-xs text-[#707B8A]">No hay sistemas registrados en el catálogo.</div>`}
                        </div>
                        <a href="#/catalogos" class="mt-2 pt-1.5 border-t border-brand-border/60 text-[10px] font-medium text-[#3D82C6] hover:text-[#5B9FE0] flex items-center justify-end gap-1 transition-colors">
                            <span>Ver detalle de sistemas</span>
                            <span class="text-[12px]">→</span>
                        </a>
                    </div>

                    <div class="bg-brand-surface border border-brand-border rounded-xl p-3 flex flex-col justify-between shadow-enterprise-sm flex-1 min-h-0">
                        <div>
                            <h2 class="text-xs font-bold text-[#F2F5F8] mb-1.5">Acciones rápidas</h2>
                            <div class="space-y-1.5">
                                ${Mf()?J`<a href="#/incidencias/nueva" class="w-full p-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] border border-white/10 text-white flex items-center gap-2.5 transition-all shadow-sm group">
                                        <div class="w-7 h-7 rounded-lg bg-[#164A8A] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                                            <span class="material-symbols-outlined text-[18px]">add</span>
                                        </div>
                                        <div class="flex flex-col text-left leading-tight">
                                            <span class="text-xs font-bold">Registrar incidencia</span>
                                            <span class="text-[9px] text-[#A8C4E6]">Crear un nuevo reporte</span>
                                        </div>
                                    </a>`:``}
                                ${jf()?Xp(`#/incidencias`,`search`,`Consultar incidencias`,`Buscar y filtrar reportes`):``}
                                ${Xp(`#/indicadores`,`analytics`,`Ver indicadores`,`Métricas y desempeño`)}
                                ${Ff()?Xp(`#/reportes`,`description`,`Descargar reporte`,`Exportar información`):``}
                            </div>
                        </div>
                        <div class="mt-2 p-2 rounded-xl bg-[#0F141B] border border-[#252C35] flex items-center gap-2.5">
                            ${Wf({imgClass:`w-7 h-7`,wrapperClass:`shrink-0`})}
                            <div class="flex flex-col text-left leading-tight min-w-0">
                                <span class="font-bold text-[11px] text-[#F2F5F8]">GTS</span>
                                <span class="text-[9px] text-[#8A95A4] truncate">Grupo de Seguridad Tecnológica • Operación Crítica AIFA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`}},Qp=[`png`,`jpg`,`jpeg`,`pdf`,`txt`],$p={png:`image/png`,jpg:`image/jpeg`,jpeg:`image/jpeg`,pdf:`application/pdf`,txt:`text/plain`},em=(e={},t=`all`,n=1)=>K(`incidents_list`,{p_filters:e,p_mode:t,p_page:Number(n)||1,p_per_page:15}),tm=e=>K(`incident_detail`,{p_folio:e}),nm=()=>K(`incident_create_form`),rm=(e,t,n,r)=>K(`incident_assign`,{p_incident_id:e,p_areas:t,p_technician_id:n?Number(n):null,p_comment:r||null}),im=(e,t)=>K(`incident_assign`,{p_incident_id:e,p_areas:null,p_technician_id:t,p_comment:`Toma técnica directa por el especialista de guardia.`}),am=(e,t=null)=>K(`incident_start_attention`,{p_incident_id:e,p_comment:t}),om=(e,t)=>K(`incident_add_note`,{p_incident_id:e,p_note:t}),sm=(e,t)=>K(`incident_resolve`,{p_incident_id:e,p_solution_description:t}),cm=(e,t)=>K(`incident_reject_resolution`,{p_incident_id:e,p_rejection_reason:t}),lm=(e,t)=>K(`incident_close`,{p_incident_id:e,p_comment:t||null}),um=e=>String(e).split(`.`).pop().toLowerCase();function dm(e){if(!e.length)throw new W(`Debe seleccionar al menos un archivo de evidencia.`);if(e.length>5)throw new W(`No puede adjuntar más de 5 archivos simultáneamente.`);for(let t of e){if(!Qp.includes(um(t.name)))throw new W(`Solo se admiten evidencias con extensión: JPG, PNG, PDF o TXT.`);if(t.size>10485760)throw new W(`Cada archivo de evidencia no debe superar los 10 MB.`)}}async function fm(e,t,n=`upload`){let r=Array.from(t);dm(r);let i=[];for(let t of r){let n=um(t.name),r=`incidents/${e}/${crypto.randomUUID()}.${n}`,a=$p[n]??t.type??`application/octet-stream`,{error:o}=await z.storage.from(Ua.evidenceBucket).upload(r,t,{contentType:a,upsert:!1});if(o)throw new W(`No fue posible resguardar "${t.name}": ${o.message}`);i.push({original_filename:t.name,stored_path:r,mime_type:a,file_size_bytes:t.size})}return K(`incident_attachments_register`,{p_incident_id:e,p_files:i,p_context:n})}async function pm(e,t=[]){let n=await K(`incident_create`,{p_title:e.title,p_description:e.description,p_location:e.location,p_category_id:e.category_id?Number(e.category_id):null,p_priority_id:e.priority_id?Number(e.priority_id):null}),r=null;if(t.length)try{await fm(n.id,t,`create`)}catch(e){r=`La incidencia se registró, pero las evidencias no pudieron adjuntarse: ${G(e).message}`}return{...n,warning:r}}async function mm(e,t=600){if(!e.length)return{};let{data:n,error:r}=await z.storage.from(Ua.evidenceBucket).createSignedUrls(e,t);if(r)return{};let i={};return(n||[]).forEach(e=>{e.signedUrl&&(i[e.path]=e.signedUrl)}),i}async function hm(e,t){let{data:n,error:r}=await z.storage.from(Ua.evidenceBucket).createSignedUrl(e,120,{download:t||!0});if(r)throw new W(`El archivo físico no se encuentra disponible.`,404);return n.signedUrl}async function gm(e){let t=await K(`incident_attachment_paths`,{p_incident_id:e});if(t?.length){let{error:e}=await z.storage.from(Ua.evidenceBucket).remove([...new Set(t)]);if(e)throw new W(`No fue posible purgar las evidencias del almacenamiento: ${e.message}`)}return K(`incident_destroy`,{p_incident_id:e})}var _m=[`search`,`status_id`,`priority_id`,`category_id`];T.data(`incidentFilters`,(e,t)=>({f:{search:``,status_id:``,priority_id:``,category_id:``,...t},submit(){V(e,this.f)}}));function vm(e,t,n,r,i=`name`){return J`<div class="relative lg:col-span-2 min-w-0">
        <select x-model="f.${e}" class="w-full appearance-none px-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-8 cursor-pointer shadow-inner">
            <option value="">${t}</option>
            ${n.map(e=>J`<option value="${e.id}" ${String(r)===String(e.id)?`selected`:``}>${e[i]}</option>`)}
        </select>
        <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
    </div>`}function ym(e){return e.assigned_to?J`<div class="flex items-center gap-1.5 truncate" title="${e.assigned_to.name} (${e.assigned_to.role?.name??`GTS`})">
            <span class="w-5 h-5 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">${e.assigned_to.name.slice(0,2)}</span>
            <span class="text-on-surface font-medium text-xs truncate">${e.assigned_to.name}</span>
        </div>`:e.assigned_areas.length?J`<div class="flex items-center gap-1 flex-wrap max-w-[170px]" title="${Mp(e).join(`, `)}">
            ${e.assigned_areas.map(e=>J`<span class="${X(`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-medium border`,Pp(e))}">${Np(e)}</span>`)}
        </div>`:jp(e)?J`<div class="flex items-center gap-1 truncate" title="Especialista TICS">
            <span class="w-5 h-5 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">TI</span>
            <span class="text-on-surface font-medium text-xs truncate">TICS</span>
        </div>`:J`<span class="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-mono text-[9.5px] border border-border-subtle whitespace-nowrap">Sin Asignar</span>`}function bm(e,t,n,r,i){return J`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div class="flex flex-col">
            <span class="text-xs text-outline uppercase font-medium">${e}</span>
            <span class="${X(`font-mono text-xl sm:text-2xl font-bold mt-0.5`,n)}">${fp(t)}</span>
        </div>
        <div class="${X(`w-10 h-10 rounded-lg flex items-center justify-center`,r)}">
            <span class="material-symbols-outlined text-[22px]">${i}</span>
        </div>
    </div>`}function xm(e){let t=e===`my`?`/incidencias/mis`:`/incidencias`;return{name:e===`my`?`incidents.my`:`incidents.index`,title:e===`my`?`Mis incidencias`:`Todas las incidencias`,async render({query:n}){let r={};_m.forEach(e=>{n[e]&&(r[e]=n[e])}),n.assigned_to&&(r.assigned_to=n.assigned_to),n.reported_by&&(r.reported_by=n.reported_by);let[i,a]=await Promise.all([em(r,e,n.page||1),ip()]),{data:o,meta:s,metrics:c}=i,l=bf(),u=e===`my`||`assigned_to`in n||`reported_by`in n,d=_m.some(e=>n[e]),f=Bf();return J`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                ${qf(`success`,l.status_message)}

                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs uppercase tracking-widest text-primary font-semibold">Operaciones AIFA</span>
                            <span class="text-outline text-sm">/</span>
                            <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Control APOC & GTS</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">${u?`Mis Incidencias`:`Todas las Incidencias`}</h1>
                            <span class="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold uppercase tracking-wider border border-border-subtle">AIFA-GTS</span>
                        </div>
                        <p class="text-xs sm:text-sm text-on-surface-variant mt-1">
                            <span class="font-semibold text-on-surface">${s.total}</span> incidencias registradas en la plataforma técnica
                        </p>
                    </div>
                    <div class="flex items-center gap-3 self-start md:self-auto">
                        <div class="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface-variant text-xs">
                            <span class="w-2 h-2 rounded-full bg-status-resolved animate-pulse"></span>
                            <span class="font-medium text-on-surface">Canal Operativo Activo</span>
                        </div>
                        ${Mf()?J`<a href="#/incidencias/nueva" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-container hover:bg-primary text-on-primary-container font-semibold text-xs rounded-xl shadow-sm transition-all">
                                <span class="material-symbols-outlined text-[18px]">add</span>
                                <span>Nueva Incidencia</span>
                            </a>`:``}
                    </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${bm(`Nuevas sin atender`,c.nuevas,`text-[#3D82C6]`,`bg-[#123A70]/30 text-[#3D82C6]`,`inbox`)}
                    ${bm(`En Atención GTS`,c.en_atencion,`text-[#E0A21A]`,`bg-[#E0A21A]/15 text-[#E0A21A]`,`pending_actions`)}
                    ${bm(`Críticas Activas`,c.criticas,`text-status-critical`,`bg-status-critical/10 text-status-critical`,`warning`)}
                    ${bm(`Resueltas`,c.resueltas,`text-[#20C997]`,`bg-[#20C997]/15 text-[#20C997]`,`task_alt`)}
                </div>

                <form x-data="incidentFilters(${Y(t)}, ${Y(r)})" @submit.prevent="submit()" class="bg-surface-subtle border border-border-subtle p-4 rounded-xl shadow-sm flex flex-col gap-4" autocomplete="off">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                        <div class="relative lg:col-span-4 min-w-0">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar por folio, asunto o ubicación..." autocomplete="off"
                                class="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner" />
                        </div>
                        ${vm(`status_id`,`Todos los estados`,a.statuses,r.status_id)}
                        ${vm(`priority_id`,`Todas las prioridades`,a.priorities,r.priority_id)}
                        ${vm(`category_id`,`Todas las categorías`,a.categories,r.category_id)}
                        <div class="flex items-center gap-2 lg:col-span-2 min-w-0">
                            <button type="submit" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold rounded-lg border border-border-subtle transition-colors shadow-sm">
                                <span class="material-symbols-outlined text-[16px]">filter_alt</span>
                                <span>Filtrar</span>
                            </button>
                            ${d?J`<a href="#${t}" class="text-xs text-outline hover:text-on-surface px-2.5 py-2 transition-colors whitespace-nowrap">Limpiar</a>`:``}
                        </div>
                    </div>
                </form>

                <div class="bg-surface-subtle border border-border-subtle rounded-xl overflow-hidden shadow-lg flex flex-col">
                    <div class="w-full overflow-x-auto">
                        <table class="w-full min-w-[860px] max-w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr class="bg-surface-container-low border-b border-border-subtle text-outline uppercase font-mono text-[11px] tracking-wider">
                                    <th class="w-[13%] py-2.5 px-2 font-semibold">Folio</th>
                                    <th class="w-[26%] py-2.5 px-2 font-semibold">Título / Asunto</th>
                                    <th class="w-[17%] py-2.5 px-2 font-semibold">Área / Ubicación</th>
                                    <th class="w-[9%] py-2.5 px-2 font-semibold text-center">Prioridad</th>
                                    <th class="w-[10%] py-2.5 px-2 font-semibold text-center">Estado</th>
                                    <th class="w-[11%] py-2.5 px-2 font-semibold">Responsable</th>
                                    <th class="w-[7%] py-2.5 px-2 font-semibold text-center">Fecha</th>
                                    <th class="w-[7%] py-2.5 px-2 text-right font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-border-subtle text-xs" id="incidentsTableBody">
                                ${o.length?o.map(e=>{let t=f?Ap(e):null,n=e.status.code;return J`<tr class="hover:bg-surface-container-low/60 transition-colors group">
                                            <td class="py-2.5 px-2 whitespace-nowrap">
                                                <div class="flex flex-col">
                                                    <span class="font-mono text-[#3D82C6] font-bold tracking-tight text-xs select-all">${e.folio}</span>
                                                    ${t?J`<span class="${X(`inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider border`,t.bg,t.text,t.border)}" title="${t.title}">${t.label}</span>`:``}
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-2">
                                                <div class="font-medium text-on-surface group-hover:text-primary transition-colors truncate" title="${e.title}">${e.title}</div>
                                                <div class="flex items-center gap-1.5 mt-0.5 truncate">
                                                    <span class="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0"></span>
                                                    <span class="text-[10px] text-on-surface-variant font-normal truncate" title="${e.category.name}">${e.category.name}</span>
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-2">
                                                <span class="text-on-surface font-medium block truncate" title="${e.location}">${e.location}</span>
                                                <span class="text-[9.5px] text-outline flex items-center gap-0.5 mt-0.5 truncate">
                                                    <span class="material-symbols-outlined text-[11px] shrink-0">location_on</span>
                                                    <span class="truncate">AIFA Operaciones</span>
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-2 whitespace-nowrap text-center">${Hf(e.priority)}</td>
                                            <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                                <span class="${X(`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap`,Fp(n))}">
                                                    ${n===`EN_ATENCION`?J`<span class="w-1 h-1 rounded-full bg-[#E0A21A] animate-pulse shrink-0"></span>`:``}
                                                    <span>${e.status.name}</span>
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-2 whitespace-nowrap">${ym(e)}</td>
                                            <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[10px] leading-tight text-on-surface-variant text-center">
                                                <span class="block text-on-surface font-medium">${Z(e.created_at,`d/m/Y`)}</span>
                                                <span class="text-outline text-[9.5px]">${Z(e.created_at,`H:i`)} hrs</span>
                                            </td>
                                            <td class="py-2.5 px-2 text-right whitespace-nowrap">
                                                <a href="#/incidencias/${encodeURIComponent(e.folio)}" class="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-lg bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold border border-border-subtle hover:border-primary/40 transition-colors shadow-sm" title="Ver detalle de ${e.folio}">
                                                    <span class="material-symbols-outlined text-[15px]">visibility</span>
                                                    <span>Ver</span>
                                                </a>
                                            </td>
                                        </tr>`}):J`<tr><td colspan="8" class="py-12 text-center">
                                        <div class="flex flex-col items-center justify-center gap-3">
                                            <div class="w-12 h-12 rounded-full bg-surface-container-low border border-border-subtle flex items-center justify-center text-outline">
                                                <span class="material-symbols-outlined text-[28px]">search_off</span>
                                            </div>
                                            <div class="flex flex-col gap-1 max-w-sm">
                                                <h3 class="text-sm font-semibold text-on-surface">No se encontraron incidencias</h3>
                                                <p class="text-xs text-outline">No hay registros que coincidan con los filtros aplicados o aún no se han registrado incidencias en la plataforma.</p>
                                            </div>
                                            ${d?J`<a href="#${t}" class="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-xs font-semibold hover:bg-surface-container transition-colors">Restablecer filtros</a>`:``}
                                        </div>
                                    </td></tr>`}
                            </tbody>
                        </table>
                    </div>
                    ${s.last_page>1?J`<div class="p-4 border-t border-border-subtle bg-surface-container-low flex items-center justify-between">${Kf(s,t,n)}</div>`:``}
                </div>
            </div>`}}}var Sm={all:xm(`all`),mine:xm(`my`)},Cm=``;T.data(`incidentCreateForm`,()=>({form:{title:``,category_id:``,location:``,priority_id:Cm,description:``},errors:[],submitting:!1,files:[],isDragging:!1,errorMessage:``,get charCount(){return this.form.description.length},handleFileSelect(e){this.addFiles(e.target.files),e.target.value=``},handleDrop(e){this.isDragging=!1,e.dataTransfer?.files&&this.addFiles(e.dataTransfer.files)},addFiles(e){this.errorMessage=``;let t=[`png`,`jpg`,`jpeg`,`pdf`,`txt`];for(let n of Array.from(e)){if(this.files.length>=5){this.errorMessage=`Límite alcanzado: solo se admiten hasta 5 archivos de evidencia simultáneamente.`;break}let e=n.name.split(`.`).pop().toLowerCase();t.includes(e)?n.size>10485760?this.errorMessage=`El archivo "${n.name}" excede los 10 MB máximos permitidos.`:this.files.some(e=>e.name===n.name&&e.size===n.size)||this.files.push(n):this.errorMessage=`El archivo "${n.name}" no es válido. Solo se admiten formatos JPG, PNG, PDF o TXT.`}},removeFile(e){this.files.splice(e,1),this.errorMessage=``},clearAll(){this.files=[],this.errorMessage=``},formatBytes(e){if(e===0)return`0 B`;let t=1024,n=[`B`,`KB`,`MB`,`GB`],r=Math.floor(Math.log(e)/Math.log(t));return`${parseFloat((e/t**r).toFixed(1))} ${n[r]}`},getFileIcon(e){let t=e.name.split(`.`).pop().toLowerCase();return[`png`,`jpg`,`jpeg`].includes(t)?`image`:t===`pdf`?`picture_as_pdf`:t===`txt`?`description`:`attach_file`},getFileBadgeClass(e){let t=e.name.split(`.`).pop().toLowerCase();return[`png`,`jpg`,`jpeg`].includes(t)?`text-cyan-400 bg-cyan-500/10 border-cyan-500/30`:t===`pdf`?`text-rose-400 bg-rose-500/10 border-rose-500/30`:`text-amber-400 bg-amber-500/10 border-amber-500/30`},async submit(){if(!this.submitting){this.submitting=!0,this.errors=[];try{let e=await pm(this.form,this.files);q(`success`,e.message),e.warning&&q(`error`,e.warning),V(`/incidencias/${e.folio}`)}catch(e){this.errors=[G(e).message],document.getElementById(`main`)?.scrollTo({top:0,behavior:`smooth`}),this.submitting=!1}}}}));function wm(){return lf()?`Canal GTS Activo`:df()?`Canal APOC-CCO Activo`:ff()?`Canal APOC-CSA Activo`:uf()?`Canal APOC Activo`:cf()?`Canal Administrador Activo`:`Canal ${af()?.role?.name??`Usuario`} Activo`}var Tm={baja:[`text-status-neutral`,`bg-status-neutral`],media:[`text-[#10B981]`,`bg-[#10B981]`],alta:[`text-status-warning`,`bg-status-warning`],critica:[`text-status-critical`,`bg-status-critical`]},Em={name:`incidents.create`,title:`Nueva incidencia`,async render(){let e=await nm();return Cm=String(e.priorities.find(e=>e.slug===`media`)?.id??``),J`<div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="incidentCreateForm">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-primary font-semibold">Módulo de Despacho Operativo</span>
                        <span class="text-outline text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-on-surface-variant font-medium">GTS AIFA</span>
                    </div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Nueva Incidencia</h1>
                    <p class="text-sm text-on-surface-variant mt-1 max-w-2xl">Registro de reporte técnico para asignación y seguimiento inmediato del Grupo de Seguridad Tecnológica (GTS).</p>
                </div>
                <div class="flex items-center gap-2 self-start md:self-auto bg-surface-container-low px-4 py-2 rounded-xl border border-border-subtle shadow-sm">
                    <span class="w-2.5 h-2.5 rounded-full bg-status-resolved animate-pulse"></span>
                    <span class="text-xs text-on-surface uppercase tracking-wider font-semibold">${wm()}</span>
                </div>
            </div>

            <div x-show="errors.length" x-cloak class="mb-6 p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A]">
                <div class="flex items-center gap-2 font-semibold text-sm mb-1">
                    <span class="material-symbols-outlined text-[18px]">error</span>
                    <span>Se detectaron errores en el formulario:</span>
                </div>
                <ul class="list-disc list-inside text-xs space-y-0.5">
                    <template x-for="e in errors"><li x-text="e"></li></template>
                </ul>
            </div>

            <form @submit.prevent="submit()" class="flex flex-col gap-6" id="incidentForm" autocomplete="off">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div class="lg:col-span-8 flex flex-col gap-6">
                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-5">
                            <div class="flex items-center gap-2 pb-1">
                                <span class="material-symbols-outlined text-primary text-[22px]">info</span>
                                <h2 class="text-base font-semibold text-on-surface">Información de la Incidencia</h2>
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-medium text-on-surface flex items-center justify-between" for="title">
                                    <span>Título o Asunto del Problema <span class="text-status-critical">*</span></span>
                                    <span class="text-outline text-xs">Sintético y descriptivo</span>
                                </label>
                                <input x-model="form.title" class="w-full px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner"
                                    id="title" placeholder="ej. Falla en lectura de tarjeta de acceso Puerta 14B" required autocomplete="off" type="text" maxlength="255" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-on-surface" for="category_id">Categoría / Subsistema <span class="text-status-critical">*</span></label>
                                    <div class="relative">
                                        <select x-model="form.category_id" id="category_id" required class="w-full appearance-none px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-10 cursor-pointer">
                                            <option disabled value="">Seleccionar subsistema...</option>
                                            ${e.categories.map(e=>J`<option value="${e.id}">${e.name}</option>`)}
                                        </select>
                                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-[20px]">expand_more</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-xs font-medium text-on-surface" for="location">Ubicación / Área Afectada <span class="text-status-critical">*</span></label>
                                    <div class="relative">
                                        <input x-model="form.location" class="w-full px-4 py-2.5 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors pr-9"
                                            id="location" placeholder="ej. Terminal 1 - Nivel 2, Puerta 14B" required autocomplete="off" type="text" maxlength="255" />
                                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">location_on</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2 pt-1">
                                <label class="text-xs font-medium text-on-surface flex items-center justify-between flex-wrap gap-2">
                                    <span>Prioridad Sugerida <span class="text-status-critical">*</span></span>
                                    <span class="text-outline text-xs">Determina el tiempo de respuesta estimado</span>
                                </label>
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
                                    ${e.priorities.map(e=>{let[t,n]=Tm[e.slug]??[`text-primary`,`bg-primary`];return J`<label class="group relative flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle hover:border-border-active transition-all cursor-pointer has-[:checked]:bg-surface-overlay has-[:checked]:border-primary/50 shadow-sm">
                                            <input class="sr-only peer" x-model="form.priority_id" name="priority_id" type="radio" value="${e.id}" />
                                            <div class="flex items-center justify-between mb-1.5">
                                                <span class="${X(`text-xs font-semibold flex items-center gap-1.5`,t)}">
                                                    <span class="${X(`w-2 h-2 rounded-full inline-block`,n,e.slug===`critica`&&`animate-ping`)}"></span>
                                                    ${e.name}
                                                </span>
                                                <span class="material-symbols-outlined text-[16px] text-primary opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                                            </div>
                                            <span class="text-xs text-on-surface-variant leading-snug">Tiempo de respuesta estimado: ${e.sla_minutes} minutos</span>
                                        </label>`})}
                                </div>
                            </div>
                        </section>

                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[22px]">subject</span>
                                    <h2 class="text-base font-semibold text-on-surface">Descripción del Evento</h2>
                                </div>
                                <span class="text-xs text-outline font-mono" :class="charCount > 2800 ? 'text-status-warning' : ''" x-text="charCount + ' / 3000'">0 / 3000</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <textarea x-model="form.description" class="w-full p-4 bg-surface-container-low border border-border-subtle rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner resize-y leading-relaxed"
                                    id="incident_description" placeholder="Describa detalladamente el síntoma observado, mensajes de error o comportamiento anómalo en el equipo..." required rows="5" maxlength="3000"></textarea>
                                <span class="text-xs text-outline px-1">Incluya números de serie de dispositivos o códigos en pantalla si están disponibles.</span>
                            </div>
                        </section>

                        <section class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[22px]">attach_file</span>
                                    <h2 class="text-base font-semibold text-on-surface">Evidencia o Adjuntos</h2>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span x-show="files.length > 0" x-cloak class="text-xs px-2.5 py-0.5 rounded bg-primary/20 text-primary font-mono font-medium border border-primary/30">
                                        <span x-text="files.length"></span> / 5 seleccionados
                                    </span>
                                    <span class="text-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-border-subtle">Opcional</span>
                                </div>
                            </div>

                            <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop($event)" @click="$refs.fileInput.click()"
                                :class="isDragging ? 'border-primary bg-primary/10 ring-2 ring-primary/40' : 'border-border-subtle hover:border-border-active bg-surface-container-low hover:bg-surface-container'"
                                class="relative border rounded-xl p-6 sm:p-8 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-inner group">
                                <input type="file" x-ref="fileInput" id="attachments" multiple accept=".png,.jpg,.jpeg,.pdf,.txt" @change="handleFileSelect($event)" @click.stop class="sr-only" />
                                <div class="w-12 h-12 rounded-xl bg-surface-container-high border border-border-active flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform shadow-sm pointer-events-none">
                                    <span class="material-symbols-outlined text-[26px]">cloud_upload</span>
                                </div>
                                <p class="text-sm font-medium text-on-surface pointer-events-none">Arrastra y suelta capturas de error, bitácoras o documentos</p>
                                <p class="text-xs text-outline mt-1 pointer-events-none">Formatos admitidos: PNG, JPG, PDF o TXT (Máximo 10 MB por archivo, hasta 5 archivos)</p>
                                <button type="button" class="mt-3 px-3.5 py-1.5 bg-surface-card border border-border-subtle rounded-lg text-primary text-xs font-semibold group-hover:bg-primary group-hover:text-on-primary transition-colors pointer-events-none">Explorar archivos locales</button>
                            </div>

                            <div x-show="errorMessage" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                                <span x-text="errorMessage"></span>
                            </div>

                            <template x-if="files.length > 0">
                                <div class="flex flex-col gap-2 pt-1">
                                    <div class="flex items-center justify-between">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-outline">Evidencias preparadas (<span x-text="files.length"></span>)</span>
                                        <button type="button" @click="clearAll()" class="text-xs text-outline hover:text-[#E66A7A] transition-colors">Quitar todas</button>
                                    </div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <template x-for="(file, index) in files" :key="index + '-' + file.name">
                                            <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between gap-3 shadow-sm hover:border-border-active transition-colors">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <div class="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border" :class="getFileBadgeClass(file)">
                                                        <span class="material-symbols-outlined text-[20px]" x-text="getFileIcon(file)"></span>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-xs font-mono font-medium text-on-surface truncate" x-text="file.name" :title="file.name"></span>
                                                        <span class="text-[11px] font-mono text-outline" x-text="formatBytes(file.size)"></span>
                                                    </div>
                                                </div>
                                                <button type="button" @click.stop="removeFile(index)" class="p-1.5 rounded-lg text-outline hover:text-[#E66A7A] hover:bg-status-critical/10 transition-colors shrink-0" title="Quitar archivo">
                                                    <span class="material-symbols-outlined text-[18px]">close</span>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </section>
                    </div>

                    <div class="lg:col-span-4 flex flex-col gap-6">
                        <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center gap-2 pb-1">
                                <span class="material-symbols-outlined text-primary text-[20px]">admin_panel_settings</span>
                                <h3 class="text-base font-semibold text-on-surface">Datos de Control</h3>
                            </div>
                            <p class="text-xs text-on-surface-variant -mt-2">Valores inmutables de auditoría generados por el motor de telemetría aeroportuaria.</p>
                            <div class="flex flex-col gap-3 pt-2">
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Folio Preliminar Asignado</span>
                                    <div class="flex items-center justify-between mt-1">
                                        <span class="font-mono text-base font-bold text-primary tracking-wider">${e.preliminary_folio}</span>
                                        <span class="text-xs px-2 py-0.5 rounded bg-surface-overlay text-on-surface-variant font-mono border border-border-subtle">AUTOGÉN</span>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Fecha / Hora de Registro</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="material-symbols-outlined text-outline text-[16px]">schedule</span>
                                        <span class="text-xs text-on-surface font-medium">${Z(new Date,`Y-m-d • H:i:s`)} hrs</span>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Operador Responsable</span>
                                    <div class="flex items-center gap-2.5 mt-2">
                                        <div class="w-8 h-8 rounded-full bg-surface-container-high border border-border-active flex items-center justify-center text-primary font-semibold flex-shrink-0">
                                            <span class="material-symbols-outlined text-[18px]">terminal</span>
                                        </div>
                                        <div class="flex flex-col min-w-0">
                                            <span class="text-xs font-semibold text-on-surface truncate">${af()?.name}</span>
                                            <span class="text-xs text-on-surface-variant truncate">${af()?.role?.name??`APOC`}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col p-3 rounded-lg bg-surface-container-low border border-border-subtle shadow-sm">
                                    <span class="text-xs uppercase tracking-wider text-outline font-mono">Despacho Automático: GTS</span>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                                        <span class="text-xs text-on-surface font-medium">GTS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-surface-card border border-border-subtle p-5 rounded-xl shadow-sm flex flex-col gap-2.5">
                            <div class="flex items-center gap-2 text-primary">
                                <span class="material-symbols-outlined text-[18px]">verified_user</span>
                                <span class="text-xs font-semibold tracking-wide uppercase font-mono">Protocolo GTS AIFA</span>
                            </div>
                            <p class="text-xs text-on-surface-variant leading-relaxed">Una vez remitida, la incidencia se encola de forma síncrona en el tablero de radiodespacho y se genera la bitácora criptográfica de trazabilidad en base de datos.</p>
                            <div class="flex items-center gap-2 pt-1 text-outline text-xs">
                                <span class="material-symbols-outlined text-[14px]">call</span>
                                <span>Soporte 55-57-98-98-00 Ext. 13202</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sticky bottom-4 z-30 bg-surface-subtle/95 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-border-subtle shadow-xl flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-2">
                    <div class="flex items-center gap-2 text-outline text-xs">
                        <span class="material-symbols-outlined text-[18px]">lock</span>
                        <span>Transmisión protegida por TLS 1.3 interna AIFA</span>
                    </div>
                    <div class="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button class="flex-1 sm:flex-initial px-5 py-2.5 rounded-lg bg-surface-container-high border border-border-subtle hover:bg-surface-overlay text-on-surface text-sm font-medium transition-colors flex items-center justify-center gap-2" onclick="history.back()" type="button">
                            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                            <span>Cancelar</span>
                        </button>
                        <button :disabled="submitting" :class="submitting ? 'opacity-75 cursor-not-allowed pointer-events-none' : ''"
                            class="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-primary-container hover:bg-primary text-on-primary-container hover:text-on-primary text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer" id="btnSubmit" type="submit">
                            <span class="material-symbols-outlined text-[18px]" :class="submitting ? 'animate-spin' : ''" x-text="submitting ? 'progress_activity' : 'send'">send</span>
                            <span x-text="submitting ? 'Despachando a GTS...' : 'Crear Incidencia'">Crear Incidencia</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>`}},Q=null,Dm=()=>document.getElementById(`main`)?.scrollTo({top:0,behavior:`smooth`});async function Om(e,t,n=null){if(!e.busy){e.busy=!0,e.pageError=``;try{q(`success`,(await t())?.message??`Operación realizada exitosamente.`),n&&(e[n]=!1),Zd()}catch(t){e.pageError=G(t).message,e.busy=!1,n||Dm()}}}T.data(`incidentShowPage`,()=>({showAssignModal:!1,showResolveModal:!1,showRejectModal:!1,showCloseModal:!1,showUploadModal:!1,busy:!1,pageError:``,note:``,solution:``,rejection:``,closeComment:``,take(){return Om(this,()=>im(Q.id,af().id))},startAttention(){return Om(this,()=>am(Q.id))},addNote(){return Om(this,()=>om(Q.id,this.note))},resolve(){return Om(this,()=>sm(Q.id,this.solution),`showResolveModal`)},reject(){return Om(this,()=>cm(Q.id,this.rejection),`showRejectModal`)},closeIncident(){return Om(this,()=>lm(Q.id,this.closeComment),`showCloseModal`)},upload(){let e=this.$refs.uploadInput?.files??[];return Om(this,()=>fm(Q.id,e,`upload`),`showUploadModal`)},async download(e,t){try{window.location.href=await hm(e,t)}catch(e){this.pageError=G(e).message,Dm()}}})),T.data(`assignModal`,()=>({allAreas:Q.assign.areas,allTechnicians:Q.assign.technicians,selectedAreas:[...Q.assign.initialAreas],selectedUserId:Q.assign.initialUserId,areaToAdd:``,isSubmitting:!1,errorMessage:``,comment:``,get filteredTechnicians(){if(this.selectedAreas.length===0)return[];let e=this.selectedAreas.map(e=>e.toLowerCase());return this.allTechnicians.filter(t=>e.includes(t.role_slug))},get unselectedAreas(){let e=this.selectedAreas.map(e=>e.toLowerCase());return this.allAreas.filter(t=>!e.includes(t.code.toLowerCase()))},addArea(e){if(!e)return;let t=e.toLowerCase();this.selectedAreas.map(e=>e.toLowerCase()).includes(t)||this.selectedAreas.push(t),this.areaToAdd=``,this.errorMessage=``},removeArea(e){let t=e.toLowerCase();this.selectedAreas=this.selectedAreas.filter(e=>e.toLowerCase()!==t),this.validateSelectedUser(),this.errorMessage=``},validateSelectedUser(){this.selectedUserId&&!this.filteredTechnicians.some(e=>String(e.id)===String(this.selectedUserId))&&(this.selectedUserId=``)},getAreaMeta(e){let t=e.toLowerCase();return this.allAreas.find(e=>e.code.toLowerCase()===t)||{code:e,name:e.toUpperCase(),badge_bg:`bg-surface-container-high`,badge_text:`text-on-surface`,badge_border:`border-border-subtle`}},async submitAssignment(){if(!(this.selectedAreas.length===0||this.isSubmitting)){this.isSubmitting=!0,this.errorMessage=``;try{q(`success`,(await rm(Q.id,this.selectedAreas,this.selectedUserId||null,this.comment)).message),Zd()}catch(e){this.errorMessage=G(e).message,this.isSubmitting=!1}}}}));function km(e){let t=e.status.step_order,n=(e,n,r,i,a)=>{let o=t>e,s=t===e;return J`<div class="${X(`p-3 rounded-lg flex items-center gap-3`,t>=e?`bg-surface-container-low border border-border-subtle`:`opacity-40`)}">
            <div class="${X(`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs`,o?`bg-status-resolved/20 text-status-resolved`:s?a:`bg-surface-container-high text-outline`)}">
                ${o?J`<span class="material-symbols-outlined text-[18px]">check</span>`:e}
            </div>
            <div class="flex flex-col min-w-0">
                <span class="font-semibold text-xs text-on-surface">${e}. ${n}</span>
                <span class="text-[10px] text-outline truncate font-mono">${r?Z(r,`d M H:i`):i}</span>
            </div>
        </div>`};return J`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl shadow-sm">
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4">
            ${n(1,`Nueva`,e.reported_at,`Pendiente`,`bg-[#123A70]/30 text-[#3D82C6] ring-2 ring-[#164A8A]/40`)}
            ${n(2,`Asignada`,e.assigned_at,t>=2?`En espera`:`Pendiente`,`bg-purple-500/20 text-purple-400 ring-2 ring-purple-500/30`)}
            ${n(3,`En Atención`,e.attended_at,`Pendiente`,`bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/30`)}
            ${n(4,`Resuelta`,e.resolved_at,`Pendiente`,`bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30`)}
            <div class="${X(`p-3 rounded-lg flex items-center gap-3`,t===5?`bg-surface-container-low border border-primary/30`:`opacity-40`)}">
                <div class="${X(`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs`,t===5?`bg-primary/20 text-primary ring-2 ring-primary/40`:`bg-surface-container-high text-outline`)}">
                    ${t===5?J`<span class="material-symbols-outlined text-[18px]">verified</span>`:`5`}
                </div>
                <div class="flex flex-col min-w-0">
                    <span class="font-semibold text-xs text-on-surface">5. Cerrada</span>
                    <span class="text-[10px] text-outline truncate font-mono">${e.closed_at?Z(e.closed_at,`d M H:i`):`Pendiente`}</span>
                </div>
            </div>
        </div>
    </div>`}var Am={NOTA_TECNICA:`border-amber-400 bg-amber-400/30`,RESUELTA:`border-emerald-400 bg-emerald-400/30`,RECHAZO_SOLUCION:`border-rose-500 bg-rose-500/30`,CERRADA:`border-primary bg-primary/30`,CAMBIO_ESTADO:`border-[#3D82C6]`},jm={NOTA_TECNICA:`bg-amber-500/15 text-amber-400 border border-amber-500/30`,RESUELTA:`bg-emerald-500/15 text-emerald-400 border border-emerald-500/30`,RECHAZO_SOLUCION:`bg-rose-500/15 text-rose-400 border border-rose-500/30`,CERRADA:`bg-primary/15 text-primary border border-primary/30`,CAMBIO_ESTADO:`bg-[rgba(61,130,198,0.15)] text-[#6FA2D2] border border-[rgba(61,130,198,0.30)]`,ASIGNADA:`bg-purple-500/15 text-purple-400 border border-purple-500/30`,REASIGNADA:`bg-purple-500/15 text-purple-400 border border-purple-500/30`};function Mm(e){let t=(t,n,r,i,a)=>J`<div class="${X(`p-3.5 rounded-xl border text-xs text-on-surface leading-relaxed mt-1`,t,n)}">
        <div class="${X(`flex items-center gap-1.5 font-semibold text-[11px] mb-1`,r)}">
            <span class="material-symbols-outlined text-[15px]">${i}</span>
            <span>${a}</span>
        </div>
        <p class="whitespace-pre-line text-on-surface-variant font-sans">${e.comment}</p>
    </div>`;switch(e.action){case`NOTA_TECNICA`:return t(`bg-amber-500/5`,`border-amber-500/20`,`text-amber-400`,`engineering`,`Avance / Diagnóstico Técnico:`);case`RESUELTA`:return t(`bg-emerald-500/5`,`border-emerald-500/20`,`text-emerald-400`,`task_alt`,`Solución Técnica Certificada por GTS:`);case`RECHAZO_SOLUCION`:return t(`bg-rose-500/5`,`border-rose-500/20`,`text-rose-400`,`cancel`,`Motivo de Rechazo por APOC:`);case`CERRADA`:return t(`bg-primary/5`,`border-primary/20`,`text-primary`,`verified`,`Conformidad Operacional y Cierre Formal (${e.user?e.user.role_tag:`VoBo`}):`);default:return e.comment?J`<p class="text-xs text-on-surface-variant bg-surface-container-low p-2.5 rounded-lg border border-border-subtle mt-1 font-sans">${e.comment}</p>`:``}}function Nm(e,t,n,r,i,a=`max-w-lg`,o=`bg-surface-base/80`){return J`<div x-show="${e}" x-cloak class="${X(`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm`,o)}" @keydown.escape.window="${e} = false">
        <div class="${X(`bg-surface-subtle border border-border-subtle w-full rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto`,a)}" @click.outside="${e} = false">
            <div class="flex items-center justify-between pb-2 border-b border-border-subtle">
                <div class="flex items-center gap-2">
                    <span class="${X(`material-symbols-outlined text-[22px]`,n)}">${t}</span>
                    <h3 class="text-base font-bold text-on-surface">${r}</h3>
                </div>
                <button type="button" @click="${e} = false" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>
            <div x-show="pageError" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                <span x-text="pageError"></span>
            </div>
            ${i}
        </div>
    </div>`}function Pm(e){return J`<div x-show="showAssignModal" x-cloak x-data="assignModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-base/80 backdrop-blur-sm" @keydown.escape.window="showAssignModal = false">
        <div class="bg-surface-subtle border border-border-subtle w-full max-w-xl rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[92vh] overflow-y-auto" @click.outside="showAssignModal = false">
            <div class="flex items-center justify-between pb-3 border-b border-border-subtle">
                <div class="flex items-center gap-2.5">
                    <span class="material-symbols-outlined text-primary text-[24px]">device_hub</span>
                    <div>
                        <h3 class="text-base font-bold text-on-surface">${e.assigned_to||e.assigned_areas.length?`Reasignar Especialista y Áreas`:`Asignar Especialista y Áreas`}</h3>
                        <p class="text-[11px] text-outline">Gestione las áreas responsables y asigne opcionalmente un especialista técnico.</p>
                    </div>
                </div>
                <button type="button" @click="showAssignModal = false" class="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="submitAssignment()">
                <div x-show="errorMessage" x-cloak class="p-3 rounded-xl bg-status-critical/10 border border-status-critical/30 text-[#E66A7A] text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] shrink-0">error</span>
                    <span x-text="errorMessage"></span>
                </div>

                <div class="flex flex-col gap-2">
                    <label class="text-xs font-semibold text-on-surface flex items-center justify-between">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-primary">domain</span>
                            <span>1. Área Responsable <span class="text-status-critical">*</span></span>
                        </span>
                        <span class="text-[11px] text-outline font-normal">Seleccionadas: <strong class="text-primary font-mono" x-text="selectedAreas.length"></strong></span>
                    </label>
                    <div class="min-h-[46px] p-2.5 bg-surface-container-low border border-border-subtle rounded-xl flex flex-wrap items-center gap-2">
                        <template x-for="code in selectedAreas" :key="code">
                            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all" :class="getAreaMeta(code).badge_bg + ' ' + getAreaMeta(code).badge_text + ' ' + getAreaMeta(code).badge_border">
                                <span class="font-mono text-[11px]" x-text="getAreaMeta(code).name"></span>
                                <button type="button" @click="removeArea(code)" title="Retirar área" class="hover:opacity-75 transition-opacity ml-1 p-0.5 rounded-full hover:bg-black/20 text-current flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[13px] leading-none">close</span>
                                </button>
                            </span>
                        </template>
                        <template x-if="selectedAreas.length === 0">
                            <span class="text-outline text-xs italic flex items-center gap-1.5 px-1">
                                <span class="material-symbols-outlined text-[16px]">info</span>
                                Ninguna área seleccionada. Elija al menos un área responsable.
                            </span>
                        </template>
                    </div>
                    <div class="flex items-center gap-2 mt-0.5">
                        <div class="relative flex-1">
                            <select x-model="areaToAdd" @change="addArea(areaToAdd)" :disabled="unselectedAreas.length === 0"
                                class="w-full bg-none appearance-none px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-9 cursor-pointer shadow-inner disabled:opacity-60 disabled:cursor-not-allowed">
                                <option value="" x-text="unselectedAreas.length === 0 ? 'Todas las áreas autorizadas ya han sido agregadas' : '-- Seleccionar área para agregar --'"></option>
                                <template x-for="area in unselectedAreas" :key="area.code">
                                    <option :value="area.code" x-text="area.name"></option>
                                </template>
                            </select>
                            <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none select-none">expand_more</span>
                        </div>
                    </div>
                    <template x-if="allAreas.length === 0">
                        <p class="text-[11px] text-status-critical flex items-center gap-1 mt-1">
                            <span class="material-symbols-outlined text-[14px]">warning</span>
                            No tiene destinos de asignación autorizados según su rol y alcances operativos.
                        </p>
                    </template>
                </div>

                <div class="flex flex-col gap-1.5 pt-1">
                    <label for="modal_assigned_to_user_id" class="text-xs font-semibold text-on-surface flex items-center justify-between">
                        <span class="flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-primary">person</span>
                            <span>2. Usuario Responsable <span class="text-outline font-normal">(Opcional)</span></span>
                        </span>
                        <span class="text-[11px] text-outline font-normal">Compatibles: <strong class="text-primary font-mono" x-text="filteredTechnicians.length"></strong></span>
                    </label>
                    <div class="relative">
                        <select id="modal_assigned_to_user_id" x-model="selectedUserId" :disabled="filteredTechnicians.length === 0 || selectedAreas.length === 0"
                            class="w-full bg-none appearance-none px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface focus:outline-none focus:border-border-focus transition-colors pr-9 cursor-pointer shadow-inner disabled:opacity-60 disabled:cursor-not-allowed">
                            <option value="" x-text="selectedAreas.length === 0 ? '-- Primero seleccione al menos un área responsable --' : (filteredTechnicians.length === 0 ? '-- Las áreas seleccionadas no cuentan con especialistas individuales --' : '-- Sin usuario asignado (asignar solo a nivel de área) --')"></option>
                            <template x-for="tech in filteredTechnicians" :key="tech.id">
                                <option :value="tech.id" x-text="'[' + tech.role_name + '] ' + tech.name + ' (' + tech.badge + ')'"></option>
                            </template>
                        </select>
                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none select-none">expand_more</span>
                    </div>
                    <p class="text-[11px] text-outline" x-show="selectedAreas.length > 0 && filteredTechnicians.length === 0">* Las áreas seleccionadas operarán sin asignación individual de técnico.</p>
                </div>

                <div class="flex flex-col gap-1.5">
                    <label for="modal_comment" class="text-xs font-semibold text-on-surface">Observaciones de Asignación <span class="text-outline font-normal">(Opcional)</span></label>
                    <textarea id="modal_comment" x-model="comment" rows="2" maxlength="500" placeholder="Motivo de la asignación, instrucciones operativas a pista o consola..."
                        class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-border-focus transition-colors shadow-inner resize-none"></textarea>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-border-subtle">
                    <div class="text-[11px] text-outline">
                        <span x-show="selectedAreas.length === 0" class="text-status-critical flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">error</span>
                            Seleccione al menos un área.
                        </span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button type="button" @click="showAssignModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="selectedAreas.length === 0 || isSubmitting" class="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
                            <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
                            <span x-text="isSubmitting ? 'Asignando...' : 'Confirmar Asignación'"></span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>`}var Fm={name:`incidents.show`,title:`Expediente`,async render({params:e}){let t=await tm(e.folio),n=t.abilities,r=bf(),i=t.status.code,a=await mm(t.attachments.map(e=>e.stored_path)),o=(t.reported_by?.role?.slug??``).toLowerCase(),s=t.assigned_areas.map(e=>String(e.area_code).toLowerCase()).filter(e=>e!==`tics`&&e!==`admin`&&(o===``||e!==o));!s.length&&t.assigned_to?.role&&t.assigned_to.role.slug!==`admin`&&t.assigned_to.role_id!==t.reported_by?.role_id&&(s=[t.assigned_to.role.slug]);let c=t.assigned_to&&t.assigned_to.role?.slug!==`admin`&&t.assigned_to.role_id!==t.reported_by?.role_id?String(t.assigned_to.id):``;Q={id:t.id,assign:{areas:t.available_areas,technicians:t.available_technicians,initialAreas:s,initialUserId:c}};let l=Ap(t),u=t.is_assigned_to_tics?`TICS`:t.assigned_to?.name??`Sin asignar`;return J`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6" x-data="incidentShowPage">
            ${r.success?J`<div class="p-4 rounded-xl bg-status-resolved/10 border border-status-resolved/30 text-status-resolved flex items-center justify-between shadow-sm">
                    <div class="flex items-center gap-2 font-medium text-xs sm:text-sm">
                        <span class="material-symbols-outlined text-[20px]">check_circle</span>
                        <span>${r.success}</span>
                    </div>
                </div>`:``}
            ${r.error?J`<div class="p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-status-critical flex items-center gap-2 shadow-sm font-medium text-xs sm:text-sm">
                    <span class="material-symbols-outlined text-[20px]">error</span><span>${r.error}</span>
                </div>`:``}
            <div x-show="pageError && !showAssignModal && !showResolveModal && !showRejectModal && !showCloseModal && !showUploadModal" x-cloak class="p-4 rounded-xl bg-status-critical/10 border border-status-critical/30 text-status-critical flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-2 font-medium text-xs sm:text-sm">
                    <span class="material-symbols-outlined text-[20px]">error</span>
                    <span x-text="pageError"></span>
                </div>
            </div>

            <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div class="flex flex-col gap-1.5">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span class="font-mono text-xl sm:text-2xl font-bold text-primary tracking-wide">${t.folio}</span>
                        <span class="${X(`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs uppercase tracking-wider`,Fp(i))}">
                            ${i===`EN_ATENCION`?J`<span class="w-2 h-2 rounded-full bg-[#E0A21A] animate-pulse"></span>`:``}
                            ${t.status.name}
                        </span>
                        ${Hf(t.priority)}
                        ${Op(t)?J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Procedencia de la incidencia">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>APOC-CCO</span>`:kp(t)?J`<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30" title="Procedencia de la incidencia">
                                <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>APOC-CSA</span>`:l?J`<span class="${X(`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs font-mono uppercase tracking-wider border`,l.bg,l.text,l.border)}" title="${l.title}">${l.label}</span>`:``}
                        <span class="text-xs text-outline font-mono hidden sm:inline">| ${t.category.name}</span>
                    </div>
                    <h1 class="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">${t.title}</h1>
                </div>

                <div class="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                    ${n.take&&!t.assigned_to?J`<button type="button" @click="take()" :disabled="busy" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">engineering</span>
                            <span>Tomar Incidencia</span>
                        </button>`:``}
                    ${n.assign?J`<button type="button" @click="showAssignModal = true" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container text-primary border border-border-subtle font-semibold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">sync_alt</span>
                            <span>${t.assigned_to||t.is_assigned_to_tics?`Reasignar Especialista`:`Asignar Especialista`}</span>
                        </button>`:``}
                    ${n.startAttention?J`<button type="button" @click="startAttention()" :disabled="busy" class="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">play_arrow</span>
                            <span>Iniciar Atención</span>
                        </button>`:``}
                    ${n.resolve?J`<button type="button" @click="showResolveModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">task_alt</span>
                            <span>Marcar como Resuelta</span>
                        </button>`:``}
                    ${n.rejectResolution?J`<button type="button" @click="showRejectModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">replay</span>
                            <span>Rechazar Solución</span>
                        </button>`:``}
                    ${n.close?J`<button type="button" @click="showCloseModal = true; pageError = ''" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all">
                            <span class="material-symbols-outlined text-[18px]">verified</span>
                            <span>Dar VoBo y Cerrar</span>
                        </button>`:``}
                    ${Mf()?J`<a href="#/incidencias/nueva" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-subtle font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px]">add</span>
                            <span>Nueva</span>
                        </a>`:``}
                </div>
            </div>

            ${i===`CERRADA`?J`<div class="p-4 rounded-xl bg-slate-900/90 border border-slate-700/60 text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                        <span class="material-symbols-outlined text-slate-400 text-[22px]">lock</span>
                        <span>Expediente Cerrado y Archivado — Modo de Solo Lectura Inmutable</span>
                        <span class="text-outline font-normal hidden md:inline">• Visto Bueno otorgado por ${t.closer?.tagged_name??`Operador`}</span>
                    </div>
                    <div class="font-mono text-xs text-outline flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px]">task_alt</span>
                        <span>Cierre: ${Z(t.closed_at,`d/m/Y H:i`)} hrs</span>
                    </div>
                </div>`:``}

            ${t.rejection_reason&&i===`EN_ATENCION`?J`<div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-sm">
                    <div class="flex items-start gap-2.5 text-xs sm:text-sm">
                        <span class="material-symbols-outlined text-rose-400 text-[22px] shrink-0 mt-0.5">warning</span>
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-rose-400">Solución Técnica Previa Rechazada por APOC</span>
                            <p class="text-xs text-rose-200/90 leading-relaxed font-sans">${t.rejection_reason}</p>
                        </div>
                    </div>
                    <span class="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-[11px] font-mono shrink-0 self-start">Reingreso a Diagnóstico</span>
                </div>`:``}

            ${i===`EN_ATENCION`?J`<div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div class="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                        <span>Incidencia en Atención Técnica y Diagnóstico de Campo</span>
                        <span class="text-outline font-normal hidden md:inline">• Responsable: ${u}</span>
                    </div>
                    <div class="font-mono text-xs text-amber-400/80 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Inicio: ${Z(t.attended_at,`H:i`)} hrs</span>
                    </div>
                </div>`:``}

            ${km(t)}

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div class="lg:col-span-8 flex flex-col gap-6">
                    ${t.solution_description?J`<div class="bg-surface-subtle border border-emerald-500/40 p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-border-subtle">
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-emerald-400 text-[20px]">task_alt</span>
                                    <span>Solución Técnica Certificada (GTS)</span>
                                </h2>
                                ${t.resolved_at?J`<span class="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/30">Resuelta: ${Z(t.resolved_at,`d/m/Y H:i`)} hrs</span>`:``}
                            </div>
                            <div class="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line bg-surface-container-low p-4 rounded-xl border border-border-subtle font-sans">${t.solution_description}</div>
                            ${i===`RESUELTA`?J`<div class="p-3 bg-[#123A70]/25 rounded-lg border border-[#164A8A]/40 text-xs text-[#A8C4E6] flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">pending_actions</span>
                                    <span>En espera de validación de servicio y visto bueno para proceder con el cierre formal del ticket.</span>
                                </div>`:``}
                        </div>`:``}

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2">
                            <span class="material-symbols-outlined text-primary text-[18px]">description</span>
                            Descripción del Problema
                        </h2>
                        <div class="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line bg-surface-container-low p-4 rounded-xl border border-border-subtle font-sans">${t.description}</div>
                    </div>

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <div class="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-border-subtle">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[20px]">attach_file</span>
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface">Evidencias y Archivos Adjuntos</h2>
                                <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-xs font-bold border border-border-subtle">${t.attachments.length}</span>
                            </div>
                            ${n.uploadAttachment?J`<button type="button" @click="showUploadModal = true; pageError = ''" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container text-primary text-xs font-semibold rounded-xl border border-border-subtle transition-colors cursor-pointer">
                                    <span class="material-symbols-outlined text-[16px]">cloud_upload</span>
                                    <span>Adjuntar Evidencia</span>
                                </button>`:``}
                        </div>

                        ${t.attachments.length?J`<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                ${t.attachments.map(e=>{let t=a[e.stored_path];return J`<div class="p-3.5 rounded-xl bg-surface-container-low border border-border-subtle hover:border-border-active transition-all flex flex-col justify-between gap-3 shadow-sm">
                                        <div class="flex items-start gap-3">
                                            <div class="${X(`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border`,Wp(e))}">
                                                <span class="material-symbols-outlined text-[20px]">${Up(e)}</span>
                                            </div>
                                            <div class="flex flex-col min-w-0 flex-1">
                                                <span class="font-mono text-xs font-semibold text-on-surface truncate" title="${e.original_filename}">${e.original_filename}</span>
                                                <div class="flex items-center gap-2 text-[11px] text-outline mt-0.5">
                                                    <span class="font-mono">${Hp(e)}</span>
                                                    <span>•</span>
                                                    <span>${Z(e.created_at,`d/m/Y H:i`)}</span>
                                                </div>
                                                <span class="text-[10px] text-on-surface-variant truncate mt-0.5">Por: ${e.uploaded_by?.name??`Usuario`}</span>
                                            </div>
                                        </div>
                                        ${Bp(e)&&t?J`<div class="rounded-lg overflow-hidden border border-border-subtle bg-surface-base max-h-36 flex items-center justify-center">
                                                <a href="${t}" target="_blank" rel="noopener"><img src="${t}" alt="${e.original_filename}" class="w-full h-auto object-cover max-h-36 hover:scale-105 transition-transform duration-200 cursor-pointer" /></a>
                                            </div>`:``}
                                        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle/50">
                                            ${t?J`<a href="${t}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary bg-surface-container-high hover:bg-surface-container rounded-lg border border-border-subtle transition-colors" title="Visualizar en pestaña nueva">
                                                    <span class="material-symbols-outlined text-[14px]">visibility</span>
                                                    <span>Ver</span>
                                                </a>`:``}
                                            <button type="button" @click="download(${Y(e.stored_path)}, ${Y(e.original_filename)})" class="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-on-primary bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-all" title="Descargar archivo físico">
                                                <span class="material-symbols-outlined text-[14px]">download</span>
                                                <span>Descargar</span>
                                            </button>
                                        </div>
                                    </div>`})}
                            </div>`:J`<div class="p-6 rounded-xl bg-surface-container-low border border-border-subtle/70 flex flex-col items-center justify-center text-center gap-2">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
                                    <span class="material-symbols-outlined text-[22px]">folder_open</span>
                                </div>
                                <span class="text-xs font-semibold text-on-surface">No hay evidencias adjuntas</span>
                                <p class="text-[11px] text-outline max-w-sm">Este expediente no cuenta con capturas de error, bitácoras o archivos de respaldo.</p>
                            </div>`}

                        ${i===`CERRADA`?J`<div class="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-400 text-[11px] flex items-center gap-2">
                                <span class="material-symbols-outlined text-[16px] text-slate-400">lock</span>
                                <span>Expediente archivado en modo inmutable. No se permite la carga de nuevas evidencias.</span>
                            </div>`:``}
                    </div>

                    ${n.addNote?J`<div class="bg-surface-subtle border border-amber-500/30 p-6 rounded-xl shadow-sm flex flex-col gap-4">
                            <div class="flex items-center justify-between">
                                <h2 class="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                    <span class="material-symbols-outlined text-amber-400 text-[18px]">engineering</span>
                                    Registrar Avance Técnico de Campo
                                </h2>
                                <span class="text-[11px] text-outline font-mono">GTS Operaciones</span>
                            </div>
                            <form @submit.prevent="addNote()" class="flex flex-col gap-3">
                                <textarea x-model="note" rows="3" required minlength="5" maxlength="1000"
                                    placeholder="Describir pruebas en sitio, diagnóstico con multímetro/OTDR, sustitución de hardware (switch, PoE, cámara, cableado)..."
                                    class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-amber-400/50 transition-colors shadow-inner resize-none"></textarea>
                                <div class="flex items-center justify-between flex-wrap gap-2">
                                    <span class="text-[11px] text-outline">Mínimo 5 caracteres • Registro inmutable en bitácora</span>
                                    <button type="submit" :disabled="busy" class="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all disabled:opacity-60">
                                        <span class="material-symbols-outlined text-[16px]">post_add</span>
                                        <span>Registrar Avance</span>
                                    </button>
                                </div>
                            </form>
                        </div>`:``}

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[18px]">history</span>
                                <span>Bitácora de Trazabilidad y Auditoría (Append-Only)</span>
                            </div>
                            <span class="px-2 py-0.5 rounded bg-surface-container-low text-outline font-mono text-xs">${t.histories.length} evento(s)</span>
                        </h2>
                        <div class="relative pl-6 border-l-2 border-border-subtle flex flex-col gap-5 my-2">
                            ${t.histories.map(e=>J`<div class="relative flex flex-col gap-1">
                                <div class="${X(`absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-surface-base border-2`,Am[e.action]??`border-primary`)}"></div>
                                <div class="flex items-center gap-2 flex-wrap text-xs">
                                    <span class="${X(`font-mono font-bold text-[11px] px-2 py-0.5 rounded uppercase`,jm[e.action]??`bg-surface-container-high text-primary border border-border-subtle`)}">${e.action}</span>
                                    <span class="text-outline">•</span>
                                    <span class="font-medium text-on-surface">${e.user?e.user.tagged_name:`Sistema`}</span>
                                    <span class="text-outline">•</span>
                                    <span class="font-mono text-[11px] text-outline">${Z(e.created_at,`d M Y H:i:s`)}</span>
                                </div>
                                ${Mm(e)}
                                ${e.field_name?J`<div class="text-[11px] text-outline font-mono flex items-center gap-1.5 mt-0.5 flex-wrap">
                                        <span>${e.field_name}:</span>
                                        <span class="line-through text-[#E66A7A]/70">${e.old_value??`ninguno`}</span>
                                        <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                                        <span class="text-status-resolved font-medium">${e.new_value??`ninguno`}</span>
                                    </div>`:``}
                            </div>`)}
                        </div>
                    </div>
                </div>

                <div class="lg:col-span-4 flex flex-col gap-6">
                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 pb-2 border-b border-border-subtle">
                            <span class="material-symbols-outlined text-primary text-[18px]">badge</span>
                            Responsable Técnico
                        </h2>
                        ${t.assigned_areas.length?J`<div class="flex flex-col gap-1.5 pb-2 border-b border-border-subtle/60">
                                <span class="text-[10px] uppercase font-bold text-outline tracking-wider">Área(s) Responsable(s)</span>
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    ${t.assigned_areas.map(e=>J`<span class="${X(`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium border`,Pp(e))}">
                                        <span class="material-symbols-outlined text-[13px]">domain</span>
                                        <span>${Np(e)}</span>
                                    </span>`)}
                                </div>
                            </div>`:``}
                        ${t.assigned_to?J`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono font-bold text-primary text-sm">${t.assigned_to.name.slice(0,2)}</div>
                                <div class="flex flex-col min-w-0">
                                    <span class="font-semibold text-xs text-on-surface truncate">${t.assigned_to.name}</span>
                                    <span class="text-[11px] text-outline font-mono">${t.assigned_to.email??``}</span>
                                    <div class="flex items-center gap-2 mt-1 flex-wrap"><span class="text-[10px] text-outline font-mono">${t.assigned_to.role?.name??`GTS`}</span></div>
                                </div>
                            </div>`:t.is_assigned_to_tics?J`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                <div class="w-10 h-10 rounded-full bg-surface-container-high border border-primary/30 flex items-center justify-center font-mono font-bold text-primary text-sm">TI</div>
                                <div class="flex flex-col min-w-0">
                                    <span class="font-semibold text-xs text-on-surface truncate">TICS</span>
                                    <span class="text-[11px] text-outline font-mono">Especialista de Atención</span>
                                    <div class="flex items-center gap-2 mt-1 flex-wrap"><span class="text-[10px] text-primary font-mono bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">Área TICS</span></div>
                                </div>
                            </div>`:t.assigned_areas.length?J`<div class="flex items-center gap-3 bg-surface-container-low p-3.5 rounded-xl border border-border-subtle">
                                    <div class="w-10 h-10 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono font-bold text-outline text-sm">
                                        <span class="material-symbols-outlined text-[20px]">groups</span>
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-semibold text-xs text-on-surface">Asignación a Nivel de Área</span>
                                        <span class="text-[11px] text-outline">Sin especialista individual asignado</span>
                                        <span class="text-[10px] text-primary mt-0.5">Atención abierta para personal autorizado</span>
                                    </div>
                                </div>`:J`<div class="flex flex-col items-center justify-center gap-2 p-5 bg-surface-container-low rounded-xl border border-border-subtle text-center">
                                    <span class="material-symbols-outlined text-outline text-[28px]">person_off</span>
                                    <span class="text-xs font-semibold text-outline">Sin Especialista Asignado</span>
                                    <p class="text-[11px] text-outline max-w-[200px]">La incidencia se encuentra en espera de toma técnica por GTS.</p>
                                </div>`}
                    </div>

                    <div class="bg-surface-subtle border border-border-subtle p-6 rounded-xl shadow-sm flex flex-col gap-4">
                        <h2 class="text-xs font-semibold uppercase tracking-wider text-on-surface-variant flex items-center gap-2 pb-2 border-b border-border-subtle">
                            <span class="material-symbols-outlined text-primary text-[18px]">info</span>
                            Ficha Técnica Operativa
                        </h2>
                        <dl class="flex flex-col gap-3 text-xs">
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Subsistema:</dt><dd class="text-on-surface font-semibold">${t.category.name}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Ubicación:</dt><dd class="text-on-surface font-semibold text-right max-w-[180px]">${t.location}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50">
                                <dt class="text-outline">Reportado Por:</dt>
                                <dd class="text-on-surface font-semibold flex items-center gap-1.5">
                                    <span>${t.reported_by?.name??`Sistema`}</span>
                                    ${Op(t)?J`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">CCO</span>`:kp(t)?J`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">CSA</span>`:t.origin_group?J`<span class="px-1.5 py-0.2 rounded font-mono text-[9.5px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">${t.origin_group}</span>`:``}
                                </dd>
                            </div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50">
                                <dt class="text-outline">Procedencia:</dt>
                                <dd class="text-on-surface font-semibold font-mono text-xs">
                                    ${Op(t)?J`<span class="text-amber-400 font-bold">APOC-CCO</span>`:kp(t)?J`<span class="text-orange-400 font-bold">APOC-CSA</span>`:J`<span>${t.origin_group??`GTS`}</span>`}
                                </dd>
                            </div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Reporte:</dt><dd class="text-on-surface font-mono">${Z(t.created_at,`Y-m-d H:i:s`)}</dd></div>
                            <div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Asignación:</dt><dd class="text-on-surface font-mono">${Z(t.assigned_at,`Y-m-d H:i:s`,`Pendiente`)}</dd></div>
                            ${t.resolved_at?J`<div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Resolución:</dt><dd class="text-emerald-400 font-mono">${Z(t.resolved_at,`Y-m-d H:i:s`)}</dd></div>`:``}
                            ${t.closed_at?J`<div class="flex justify-between py-1.5 border-b border-border-subtle/50"><dt class="text-outline">Fecha Cierre:</dt><dd class="text-primary font-mono font-semibold">${Z(t.closed_at,`Y-m-d H:i:s`)}</dd></div>`:``}
                            <div class="flex items-center justify-between gap-2 py-1.5"><dt class="text-outline">Tiempo de respuesta estimado:</dt><dd class="text-primary font-mono font-semibold shrink-0">${t.priority.sla_minutes} minutos</dd></div>
                        </dl>
                    </div>
                </div>
            </div>

            ${n.assign?Pm(t):``}

            ${n.resolve?Nm(`showResolveModal`,`task_alt`,`text-emerald-400`,`Resolución Técnica de Incidencia`,J`<form @submit.prevent="resolve()" class="flex flex-col gap-4">
                    <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between text-xs">
                        <span class="text-outline">Folio:</span>
                        <span class="font-mono font-bold text-primary">${t.folio}</span>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_solution_description" class="text-xs font-semibold text-on-surface">Descripción Técnica de la Solución Aplicada <span class="text-status-critical">*</span></label>
                        <textarea id="modal_solution_description" x-model="solution" rows="5" required minlength="15" maxlength="3000"
                            placeholder="Detallar las acciones técnicas ejecutadas: componentes sustituidos (marca, modelo, serial), reconfiguración de puertos/VLANs, pruebas de calibración o telemetría en consola, y confirmación de estabilidad..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-emerald-400/50 transition-colors shadow-inner resize-none"></textarea>
                        <span class="text-[11px] text-outline">Mínimo 15 caracteres obligatorios. La solución quedará registrada de forma inmutable en el expediente de auditoría.</span>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showResolveModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">check_circle</span>
                            <span>Confirmar y Marcar como Resuelta</span>
                        </button>
                    </div>
                </form>`):``}

            ${n.rejectResolution?Nm(`showRejectModal`,`replay`,`text-rose-400`,`Rechazo de Solución Técnica (APOC)`,J`<form @submit.prevent="reject()" class="flex flex-col gap-4">
                    <div class="p-3 rounded-xl bg-surface-container-low border border-border-subtle flex items-center justify-between text-xs">
                        <span class="text-outline">Folio de Expediente:</span>
                        <span class="font-mono font-bold text-primary">${t.folio}</span>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_rejection_reason" class="text-xs font-semibold text-on-surface">Motivo / Hallazgos de Rechazo <span class="text-status-critical">*</span></label>
                        <textarea id="modal_rejection_reason" x-model="rejection" rows="4" required minlength="10" maxlength="1000"
                            placeholder="Explicar detalladamente por qué no se acepta la solución: pruebas en sitio fallidas, persistencia de intermitencia, cámaras aún sin telemetría, errores en e-Gates..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-rose-400/50 transition-colors shadow-inner resize-none"></textarea>
                        <span class="text-[11px] text-outline">Mínimo 10 caracteres obligatorios. Este reporte devolverá el ticket inmediatamente al estado EN ATENCIÓN para nuevo diagnóstico técnico por GTS.</span>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showRejectModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">replay</span>
                            <span>Confirmar Rechazo y Reabrir Atención</span>
                        </button>
                    </div>
                </form>`):``}

            ${n.close?Nm(`showCloseModal`,`verified`,`text-primary`,`Conformidad y Cierre de Incidencia`,J`<form @submit.prevent="closeIncident()" class="flex flex-col gap-4">
                    <div class="p-3.5 rounded-xl bg-surface-container-low border border-border-subtle flex flex-col gap-2 text-xs">
                        <div class="flex items-center justify-between"><span class="text-outline">Folio de Expediente:</span><span class="font-mono font-bold text-primary text-sm">${t.folio}</span></div>
                        <div class="flex items-center justify-between"><span class="text-outline">Especialista:</span><span class="font-semibold text-on-surface">${t.is_assigned_to_tics?`TICS`:t.assigned_to?.name??`GTS de Guardia`}</span></div>
                        <div class="flex items-center justify-between"><span class="text-outline">Subsistema:</span><span class="text-on-surface">${t.category.name}</span></div>
                    </div>
                    <div class="p-3 bg-primary/10 rounded-xl border border-primary/20 text-xs flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
                        <p class="leading-relaxed text-[11px] text-on-surface-variant">Al confirmar, el expediente pasará al estado final inmutable <strong class="text-on-surface">CERRADA</strong>. Se archivará la solución técnica documentada y ningún usuario podrá reactivar ni alterar este registro.</p>
                    </div>
                    <div class="flex flex-col gap-1.5">
                        <label for="modal_close_comment" class="text-xs font-semibold text-on-surface">Observaciones de Conformidad y Servicio <span class="text-outline font-normal">(Opcional)</span></label>
                        <textarea id="modal_close_comment" x-model="closeComment" rows="3" maxlength="1000"
                            placeholder="Detalles de la validación: servicio verificado en sala/pista, pruebas de pasajeros exitosas, visto bueno otorgado..."
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors shadow-inner resize-none"></textarea>
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showCloseModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]">verified</span>
                            <span>Confirmar Cierre y Conformidad</span>
                        </button>
                    </div>
                </form>`):``}

            ${n.uploadAttachment?Nm(`showUploadModal`,`cloud_upload`,`text-primary`,`Adjuntar Nuevas Evidencias — ${t.folio}`,J`<form @submit.prevent="upload()" class="flex flex-col gap-4">
                    <div class="p-3 bg-surface-container-low rounded-xl border border-border-subtle text-xs text-on-surface-variant flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">info</span>
                        <p class="leading-relaxed text-[11px]">Los archivos se resguardarán en almacenamiento privado no accesible públicamente. Formatos permitidos: <strong class="text-on-surface">JPG, PNG, PDF, TXT</strong> (máx. 10 MB por archivo, hasta 5 archivos).</p>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="modal_attachments" class="text-xs font-semibold text-on-surface">Seleccionar Archivos de Respaldo <span class="text-status-critical">*</span></label>
                        <input type="file" id="modal_attachments" x-ref="uploadInput" multiple required accept=".jpg,.jpeg,.png,.pdf,.txt"
                            class="w-full px-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-container-high file:text-primary hover:file:bg-surface-container cursor-pointer shadow-inner" />
                    </div>
                    <div class="flex items-center justify-end gap-3 pt-2">
                        <button type="button" @click="showUploadModal = false" class="px-4 py-2 bg-surface-container-high hover:bg-surface-container text-on-surface font-semibold text-xs rounded-xl border border-border-subtle transition-colors">Cancelar</button>
                        <button type="submit" :disabled="busy" class="px-4 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60">
                            <span class="material-symbols-outlined text-[18px]" :class="busy ? 'animate-spin' : ''" x-text="busy ? 'progress_activity' : 'cloud_upload'">cloud_upload</span>
                            <span x-text="busy ? 'Resguardando...' : 'Subir y Resguardar'">Subir y Resguardar</span>
                        </button>
                    </div>
                </form>`,`max-w-lg`,`bg-black/70`):``}
        </div>`}};T.data(`indicatorFilters`,e=>({f:{category_id:``,date_from:``,date_to:``,...e},submit(){V(`/indicadores`,this.f)}}));function Im(e,t,n){return J`<a href="#/indicadores?period_preset=${e}" class="${X(`px-3 py-2 rounded-xl text-xs font-semibold border transition-all`,n?`bg-[#3D82C6] text-white border-[#3D82C6] shadow-sm`:`bg-[#11151B] text-[#A8B0BC] border-[#263241] hover:text-[#F2F5F8] hover:bg-[#101923]`)}">${t}</a>`}function Lm(e,t){return e<=0?J`<span class="text-[#707B8A] text-[11px]">Sin registros</span>`:t?J`<span class="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Cumple tiempo estimado</span>`:J`<span class="inline-flex items-center gap-1 text-amber-400 font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>En Riesgo</span>`}function Rm(e,t,n,r,i,a){return J`<div class="flex flex-col gap-1">
        <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-[#DDE3EA] flex items-center gap-2">
                <span class="${X(`w-2 h-2 rounded-full`,t.cls)}" style="${t.style??``}"></span>
                ${e}
            </span>
            <span class="font-mono text-[#8D98A8]"><span class="text-[#F2F5F8] font-bold">${n}</span> (${r}%)</span>
        </div>
        <div class="w-full bg-[#101923] h-2 rounded-full overflow-hidden border border-[#263241]/50">
            <div class="${X(`h-full rounded-full`,i)}" style="width: ${r}%;${a??``}"></div>
        </div>
    </div>`}var zm={name:`indicators.index`,title:`Indicadores`,async render({query:e}){let t={};[`period_preset`,`date_from`,`date_to`,`category_id`].forEach(n=>{e[n]&&(t[n]=e[n])});let n=await Zf.data(t),r=!t.date_from,i=n.by_priority;return J`<div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Telemetría de Ingeniería</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">Indicadores</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Indicadores de Rendimiento Tecnológico</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">speed</span>
                            <span>Norma OACI / AFAC</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Telemetría real de tiempos de respuesta, resolución técnica (MTTR), eficiencia operativa y salud de infraestructura aeroportuaria.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    ${Im(`today`,`Hoy`,n.preset===`today`&&r)}
                    ${Im(`week`,`Últimos 7 días`,n.preset===`week`&&r)}
                    ${Im(`month`,`Mes en curso`,n.preset===`month`&&r)}
                    ${Im(`all`,`Histórico`,n.preset===`all`&&r)}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm">
                <form x-data="indicatorFilters(${Y(t)})" @submit.prevent="submit()" class="flex flex-col sm:flex-row items-center justify-between gap-4" autocomplete="off">
                    <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <span class="text-xs font-medium text-[#8D98A8] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">filter_alt</span>
                            <span>Filtro pericial:</span>
                        </span>
                        <select x-model="f.category_id" @change="submit()" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Todos los subsistemas</option>
                            ${n.categories.map(e=>J`<option value="${e.id}" ${String(t.category_id)===String(e.id)?`selected`:``}>${e.name}</option>`)}
                        </select>
                        <div class="flex items-center gap-2">
                            <input type="date" x-model="f.date_from" autocomplete="off" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-2.5 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]" placeholder="Desde">
                            <span class="text-xs text-[#707B8A]">a</span>
                            <input type="date" x-model="f.date_to" autocomplete="off" class="bg-[#0B0F14] border border-[#263241] rounded-xl px-2.5 py-1.5 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]" placeholder="Hasta">
                            <button type="submit" class="px-3 py-1.5 bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-semibold rounded-xl border border-[#334155] transition-colors">Filtrar</button>
                        </div>
                    </div>
                    <div class="text-xs text-[#707B8A] font-mono self-start sm:self-auto">Período: <span class="text-[#F2F5F8] font-bold">${n.period_label}</span></div>
                </form>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">MTTR (Resolución)</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${mp(n.mttr_minutes)}</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-[#3D82C6]/10 text-[#3D82C6] flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">timer</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between flex-wrap gap-1.5 text-xs">
                        <span class="text-[#8D98A8]">Tiempo objetivo estimado: &lt; ${n.mttr_target} min</span>
                        ${Lm(n.resolved_sample_count,n.mttr_within_target)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">MTTA (Primera Respuesta)</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${mp(n.mtta_minutes)}</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">avg_pace</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between flex-wrap gap-1.5 text-xs">
                        <span class="text-[#8D98A8]">Tiempo objetivo estimado: &lt; ${n.mtta_target} min</span>
                        ${Lm(n.attended_sample_count,n.mtta_within_target)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">Eficiencia de Resolución</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${n.resolution_rate}%</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">verified</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
                        <span class="text-[#8D98A8]">${n.resolved_count} de ${n.total} cerradas</span>
                        <div class="w-20 bg-[#1F2937] h-2 rounded-full overflow-hidden"><div class="bg-emerald-500 h-full rounded-full" style="width: ${n.resolution_rate}%"></div></div>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                    <div class="flex items-start justify-between">
                        <div class="flex flex-col">
                            <span class="text-[11px] uppercase tracking-wider text-[#8D98A8] font-bold">Salud de Infraestructura</span>
                            <div class="flex items-baseline gap-2 mt-1"><span class="text-2xl sm:text-3xl font-bold font-mono text-[#F2F5F8]">${n.global_availability}%</span></div>
                        </div>
                        <div class="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[22px]">dns</span></div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-xs">
                        <span class="text-[#8D98A8]">${n.active_assets} / ${n.total_assets} operativos</span>
                        <span class="inline-flex items-center gap-1 text-[#10B981] font-semibold text-[11px]"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>Activo</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">sync_alt</span>
                                <h2 class="text-sm font-bold text-[#F2F5F8]">Distribución por Estado Operacional</h2>
                            </div>
                            <span class="text-xs text-[#8D98A8] font-mono">${n.total} eventos</span>
                        </div>
                        <div class="space-y-3">
                            ${Object.values(n.by_status).sort((e,t)=>e.step_order-t.step_order).map(e=>Rm(e.name,{cls:e.is_terminal?`bg-emerald-400`:`bg-[#3D82C6]`},e.count,e.percentage,e.is_terminal?`bg-emerald-500`:`bg-[#3D82C6]`))}
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#8D98A8]">
                        <span>Activas en curso: <strong class="text-amber-400">${n.open_count}</strong></span>
                        <span>Concluidas (VoBo): <strong class="text-emerald-400">${n.resolved_count}</strong></span>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between border-b border-[#1F2937] pb-3 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[18px] text-amber-400">flag</span>
                                <h2 class="text-sm font-bold text-[#F2F5F8]">Distribución por Nivel de Severidad / Prioridad</h2>
                            </div>
                            <span class="text-xs text-[#8D98A8] font-mono">${n.total} registradas</span>
                        </div>
                        <div class="space-y-3">
                            ${Object.values(i).sort((e,t)=>e.level-t.level).map(e=>Rm(`Prioridad ${e.name}`,{cls:``,style:`background-color: ${e.color}`},e.count,e.percentage,``,` background-color: ${e.color}`))}
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-[#1F2937] flex items-center justify-between text-[11px] text-[#8D98A8]">
                        <span>Críticas + Altas: <strong class="text-rose-400">${(i.critica?.count??0)+(i.alta?.count??0)}</strong></span>
                        <span>Medias + Bajas: <strong class="text-blue-400">${(i.media?.count??0)+(i.baja?.count??0)}</strong></span>
                    </div>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-[#0B0F14] border-b border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">hub</span>
                        <span class="font-bold text-[#F2F5F8]">Matriz de Salud Operacional por Subsistema Tecnológico</span>
                    </div>
                    <div class="text-[11px] text-[#707B8A]">Telemetría en tiempo real cruzada contra base de datos PostgreSQL</div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#101923] border-b border-[#263241] text-[#8D98A8] text-[11px] font-semibold uppercase tracking-wider">
                                <th class="py-3 px-4">Subsistema / Activo</th>
                                <th class="py-3 px-4">Código</th>
                                <th class="py-3 px-4">Ubicación</th>
                                <th class="py-3 px-4 text-center">Estado Parque</th>
                                <th class="py-3 px-4 text-center">Incidencias Totales</th>
                                <th class="py-3 px-4 text-center">Activas</th>
                                <th class="py-3 px-4 text-center">Resueltas</th>
                                <th class="py-3 px-4 text-center">Condición Operativa</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937] text-xs text-[#DDE3EA]">
                            ${n.infrastructure_health.length?n.infrastructure_health.map(e=>J`<tr class="hover:bg-[#151B23] transition-colors">
                                    <td class="py-3 px-4">
                                        <div class="flex items-center gap-2.5">
                                            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border" style="background-color: ${e.color}15; border-color: ${e.color}30; color: ${e.color}">
                                                <span class="material-symbols-outlined text-[18px]">${e.icon}</span>
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="font-bold text-[#F2F5F8]">${e.name}</span>
                                                <span class="text-[10px] text-[#8D98A8]">${e.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4 font-mono text-[11px] text-[#A8B0BC]">${e.code||`—`}</td>
                                    <td class="py-3 px-4 text-[#A8B0BC]">${e.location||`Instalaciones AIFA`}</td>
                                    <td class="py-3 px-4 text-center">
                                        ${e.status===`ACTIVO`?J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>ACTIVO</span>`:e.status===`FUERA DE SERVICIO`?J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>FUERA DE SERVICIO</span>`:J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">${e.status}</span>`}
                                    </td>
                                    <td class="py-3 px-4 text-center font-mono font-bold text-[#F2F5F8]">${e.total_incidents}</td>
                                    <td class="py-3 px-4 text-center font-mono font-semibold">${e.open_incidents>0?J`<span class="text-amber-400">${e.open_incidents}</span>`:J`<span class="text-[#707B8A]">0</span>`}</td>
                                    <td class="py-3 px-4 text-center font-mono font-semibold text-emerald-400">${e.resolved_incidents}</td>
                                    <td class="py-3 px-4 text-center">
                                        ${e.health_state===`optimal`?J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"><span class="material-symbols-outlined text-[14px]">check_circle</span><span>Óptimo 100%</span></span>`:e.health_state===`degraded`?J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30"><span class="material-symbols-outlined text-[14px]">warning</span><span>Con Incidencias</span></span>`:J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30"><span class="material-symbols-outlined text-[14px]">error</span><span>Fuera de Servicio</span></span>`}
                                    </td>
                                </tr>`):J`<tr><td colspan="8" class="py-8 text-center text-[#707B8A]">No hay subsistemas tecnológicos registrados en el catálogo.</td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`}},Bm=(e,t=1)=>K(`reports_data`,{p_filters:e,p_page:Number(t)||1}),Vm=(e,t=null)=>K(`reports_export`,{p_filters:e,p_selected_ids:t&&t.length?t.map(Number):t?[]:null}),Hm={today:`Turno Actual (Hoy)`,last_7_days:`Últimos 7 Días`,week:`Últimos 7 Días`,this_month:`Mes en Curso`,month:`Mes en Curso`};function Um(e,t,n,r=null,i=null){let a=Z(new Date,`d/m/Y H:i`),o=`General (Histórico Completo)`;i?.length?o=`${i.length} Incidencias Seleccionadas`:t.date_from&&t.date_to?o=`Del ${t.date_from} al ${t.date_to}`:t.period_preset&&(o=Hm[t.period_preset]??t.period_preset.charAt(0).toUpperCase()+t.period_preset.slice(1));let s=e?.by_status??{},c=i?.length?`🎯 *Folios Seleccionados:* ${i.slice(0,10).join(`, `)}${i.length>10?` y más...`:``}\n\n`:``,l=r?`\n🔗 *Acceso Seguro:* ${r}`:``;return`🏛️ *AIFA — GTS (Grupo de Seguridad Tecnológica)*
📋 *REPORTE OPERATIVO DE INCIDENCIAS*
🔖 *Folio:* #${n}\n📅 *Emisión:* ${a} hrs\n⏱️ *Período / Criterio:* ${o}\n\n`+c+`📊 *RESUMEN EJECUTIVO:*
• *Total Incidencias:* ${e?.total??0}\n• 🔵 *Nuevas:* ${s.NUEVA??0}\n• 🟣 *Asignadas:* ${s.ASIGNADA??0}\n• 🟡 *En Atención:* ${s.EN_ATENCION??0}\n• 🟢 *Resueltas:* ${s.RESUELTA??0}\n• ⚪ *Cerradas:* ${s.CERRADA??0}\n• ⚡ *Tasa de Eficacia:* ${e?.resolution_rate??0}%\n• ⏳ *MTTR Promedio:* ${e?.avg_resolution_time_formatted??`N/A`}\n`+l+`

🔒 _Control Operativo Aeroportuario AIFA • Sistema GTS_`}function Wm(e){let t=String(e||``).replace(/[^\d+]/g,``);return t.length===10&&!t.startsWith(`+`)&&(t=`52${t}`),t.replace(/^\+/,``)}var Gm=(e,t)=>`https://api.whatsapp.com/send?phone=${Wm(e)}&text=${encodeURIComponent(t)}`;function Km(){let e=crypto.getRandomValues(new Uint8Array(2)),t=Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``).toUpperCase();return`REP-${Z(new Date,`Ymd`)}-${t}`}function qm(e,t,n,r,i,a){let o=Object.entries(r||{}).map(([e,t])=>`• ${e}: ${t}`).join(`
`),s=n?.by_status??{},c=`Reporte Operativo de Incidencias #${t}\nEmitido por: ${i}\nFecha: ${Z(new Date,`d/m/Y H:i`)} hrs\n\nCriterios aplicados:\n${o}\n\nResumen ejecutivo:\n• Total: ${n?.total??0}\n• Nuevas: ${s.NUEVA??0}\n• Asignadas: ${s.ASIGNADA??0}\n• En atención: ${s.EN_ATENCION??0}\n• Resueltas: ${s.RESUELTA??0}\n• Cerradas: ${s.CERRADA??0}\n• Tasa de eficacia: ${n?.resolution_rate??0}%\n• MTTR promedio: ${n?.avg_resolution_time_formatted??`N/D`}\n`+(a?`\nNotas del solicitante:\n${a}\n`:``)+`\nAdjunto: Reporte_GTS_${t}.pdf\n\n— Control Operativo Aeroportuario AIFA • Sistema GTS`,l=`[GTS AIFA] Reporte Operativo de Incidencias #${t}`;return`mailto:${encodeURIComponent(e)}?subject=${encodeURIComponent(l)}&body=${encodeURIComponent(c)}`}var Jm=`
@page { size: A4 portrait; margin: 12mm 12mm 14mm 12mm;
  @bottom-left { content: "AIFA • Grupo de Seguridad Tecnológica | Folio Reporte: __FOLIO__"; font-size: 7px; color: #5A6673; }
  @bottom-right { content: "Página " counter(page) " de " counter(pages); font-size: 7px; color: #5A6673; }
}
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Helvetica, Arial, sans-serif; font-size: 8.5px; color: #0F172A; margin: 0; padding: 0; line-height: 1.3; background: #FFFFFF; }
.sheet { width: 100%; border-collapse: collapse; }
.sheet + .sheet { break-before: page; page-break-before: always; }
.sheet > thead > tr > td { padding-bottom: 7px; }
.header { border-bottom: 2px solid #0F172A; padding-bottom: 3px; margin-bottom: 7px; }
.header-table { width: 100%; border-collapse: collapse; }
.header-left { width: 65px; vertical-align: middle; text-align: left; }
.header-logo-gts { height: 48px; width: auto; max-width: 60px; display: block; }
.header-center { vertical-align: middle; text-align: center; padding: 0 8px; }
.header-logo-aifa { height: 28px; width: auto; max-width: 120px; display: block; margin: 0 auto 2px auto; }
.inst-title { font-size: 8.5px; font-weight: bold; color: #0F172A; letter-spacing: 0.03em; text-transform: uppercase; line-height: 1.15; }
.inst-sub { font-size: 7.5px; font-weight: bold; color: #1D4ED8; letter-spacing: 0.02em; line-height: 1.15; margin-top: 1px; }
.inst-dept { font-size: 6.5px; color: #64748B; text-transform: uppercase; letter-spacing: 0.03em; line-height: 1.15; margin-top: 1px; }
.header-right { width: 195px; vertical-align: middle; text-align: right; }
.control-box { border: 1px solid #CBD5E1; background-color: #F8FAFC; padding: 3px 6px; border-radius: 4px; display: inline-block; text-align: left; width: 100%; }
.control-row { font-size: 7px; margin-bottom: 1px; }
.control-label { color: #64748B; }
.control-val { color: #0F172A; font-weight: bold; font-family: Courier, monospace; }
.classification-badge { display: inline-block; background-color: #0F172A; color: #FFFFFF; font-size: 6.5px; font-weight: bold; padding: 1.5px 5px; border-radius: 2px; letter-spacing: 0.06em; text-transform: uppercase; margin-top: 1px; }
.incident-title-bar { background-color: #0F172A; color: #FFFFFF; padding: 5px 8px; border-radius: 3px; margin-bottom: 7px; width: 100%; overflow: hidden; }
.incident-folio-large { font-size: 11px; font-weight: bold; font-family: Courier, monospace; letter-spacing: 0.05em; color: #93C5FD; }
.incident-status-tag { float: right; font-size: 8px; font-weight: bold; text-transform: uppercase; padding: 2px 6px; border-radius: 2px; background-color: #1E293B; color: #F8FAFC; border: 1px solid #334155; }
.section-box { margin-bottom: 6px; border: 1px solid #E2E8F0; border-radius: 3px; overflow: hidden; break-inside: avoid; }
.section-header { background-color: #F1F5F9; border-bottom: 1px solid #CBD5E1; padding: 3px 6px; font-size: 7.5px; font-weight: bold; text-transform: uppercase; color: #334155; letter-spacing: 0.04em; }
.section-body { padding: 5px 7px; background-color: #FFFFFF; }
.grid-table { width: 100%; border-collapse: collapse; }
.grid-table td { padding: 2.5px 4px; vertical-align: top; font-size: 7.5px; }
.field-label { color: #64748B; font-weight: bold; text-transform: uppercase; font-size: 7px; width: 25%; }
.field-value { color: #0F172A; }
.badge-priority, .badge-status { display: inline-block; padding: 1px 4px; border-radius: 2px; font-size: 7px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.03em; }
.badge-priority-critica { background-color: #FEE2E2; color: #B91C1C; border: 1px solid #FCA5A5; }
.badge-priority-alta { background-color: #FFEDD5; color: #C2410C; border: 1px solid #FDBA74; }
.badge-priority-media { background-color: #D1FAE5; color: #065F46; border: 1px solid #6EE7B7; }
.badge-priority-baja { background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
.badge-status-nueva { background-color: #EFF6FF; color: #1D4ED8; border: 1px solid #BFDBFE; }
.badge-status-asignada { background-color: #F5F3FF; color: #6D28D9; border: 1px solid #DDD6FE; }
.badge-status-en_atencion { background-color: #FEF3C7; color: #B45309; border: 1px solid #FDE68A; }
.badge-status-resuelta { background-color: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; }
.badge-status-cerrada { background-color: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; }
.history-table { width: 100%; border-collapse: collapse; margin-top: 2px; }
.history-table th { background-color: #F8FAFC; color: #475569; font-size: 7px; font-weight: bold; text-transform: uppercase; padding: 3px 5px; border: 1px solid #E2E8F0; text-align: left; }
.history-table td { padding: 3px 5px; border: 1px solid #E2E8F0; font-size: 7.2px; vertical-align: top; }
.history-table tr:nth-child(even) td { background-color: #F8FAFC; }
.action-tag { font-weight: bold; color: #1E293B; font-size: 7px; }
.history-date { font-family: Courier, monospace; color: #475569; white-space: nowrap; font-size: 7px; }
.text-box { font-size: 7.5px; line-height: 1.35; color: #1E293B; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 3px; padding: 4px 6px; margin-top: 2px; white-space: pre-wrap; }
.signatures-table { width: 100%; margin-top: 10px; border-collapse: collapse; break-inside: avoid; }
.signature-cell { width: 48%; text-align: center; vertical-align: bottom; padding: 26px 10px 0 10px; }
.signature-line { border-top: 1px solid #475569; margin-bottom: 3px; }
.signature-name { font-size: 7.5px; font-weight: bold; color: #0F172A; }
.signature-role { font-size: 6.5px; color: #64748B; text-transform: uppercase; }
.footer-note { margin-top: 8px; border-top: 1px solid #E2E8F0; padding-top: 3px; font-size: 6.5px; color: #64748B; text-align: center; }
`;function Ym(e,t){let n=e.requester;return J`<div class="header"><table class="header-table" cellpadding="0" cellspacing="0"><tr>
        <td class="header-left"><img src="${t.gts}" class="header-logo-gts" alt="Logo GTS"></td>
        <td class="header-center">
            <img src="${t.aifa}" class="header-logo-aifa" alt="Logo AIFA">
            <div class="inst-title">Aeropuerto Internacional Felipe Ángeles</div>
            <div class="inst-sub">GTS — Grupo de Seguridad Tecnológica</div>
            <div class="inst-dept">Expediente Técnico Pericial y Dictamen de Falla Tecnológica</div>
        </td>
        <td class="header-right"><div class="control-box">
            <div class="control-row"><span class="control-label">Folio Reporte:</span> <span class="control-val">${e.report_folio}</span></div>
            <div class="control-row"><span class="control-label">Emisión:</span> <span class="control-val">${e.generated_at}</span></div>
            <div class="control-row"><span class="control-label">Solicitante:</span> <span class="control-val">${n?.name} (${n?.badge_number??`S/N`})</span></div>
            <div style="text-align: right;"><span class="classification-badge">Seguridad Operacional • AIFA</span></div>
        </div></td>
    </tr></table></div>`}function Xm(e,t){return Math.floor(Math.abs(new Date(t)-new Date(e))/6e4)}function Zm(e,t,n){let r=(e,t)=>Z(e,`d/m/Y H:i:s`,t),i=jp(e)||e.is_assigned_to_tics,a=J`<span style="color: #64748B;">En curso</span>`;if(e.created_at&&e.resolved_at){let t=Xm(e.created_at,e.resolved_at),n=Math.floor(t/60),r=t%60;a=J`<strong>${n>0?`${n}h ${r}m`:`${r} min`}</strong>`}return J`<table class="sheet"><thead><tr><td>${Ym(t,n)}</td></tr></thead><tbody><tr><td>
        <div class="incident-title-bar">
            <span class="incident-folio-large">EXPEDIENTE: ${e.folio}</span>
            ${Op(e)?Tf(`<span style="font-size: 8px; font-weight: bold; color: #B45309; background-color: #FEF3C7; border: 1px solid #FCD34D; padding: 1px 4px; border-radius: 2px; margin-left: 5px;">ORIGEN: CCO</span>`):``}
            ${kp(e)?Tf(`<span style="font-size: 8px; font-weight: bold; color: #C2410C; background-color: #FFEDD5; border: 1px solid #FDBA74; padding: 1px 4px; border-radius: 2px; margin-left: 5px;">ORIGEN: CSA</span>`):``}
            <span style="font-size: 8px; color: #CBD5E1; margin-left: 8px;">Registrado: ${r(e.created_at)}</span>
            <span class="incident-status-tag">ESTADO: ${e.status?.name??`NUEVA`}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 5px;"><tr>
            <td style="width: 50%; vertical-align: top; padding-right: 4px;">
                <div class="section-box"><div class="section-header">1. Identificación y Generales</div><div class="section-body"><table class="grid-table">
                    <tr><td class="field-label">Folio:</td><td class="field-value"><strong>${e.folio}</strong></td></tr>
                    <tr><td class="field-label">Apertura:</td><td class="field-value">${r(e.created_at)}</td></tr>
                    <tr><td class="field-label">Reportante:</td><td class="field-value">${e.reported_by?.name??`Sistema Automático`} ${e.reported_by?.badge_number?`(${e.reported_by.badge_number})`:``}</td></tr>
                    <tr><td class="field-label">Procedencia:</td><td class="field-value"><strong>${Op(e)?`APOC-CCO (Centro de Control Operativo)`:kp(e)?`APOC-CSA (Centro de Servicios Aeroportuarios)`:e.origin_group??e.reported_by?.role?.name??`GTS`}</strong></td></tr>
                    <tr><td class="field-label">Rol Emisor:</td><td class="field-value">${e.reported_by?.role?.name??`APOC Operador`}</td></tr>
                </table></div></div>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 4px;">
                <div class="section-box"><div class="section-header">2. Clasificación Técnica y Tiempo Estimado</div><div class="section-body"><table class="grid-table">
                    <tr><td class="field-label">Subsistema:</td><td class="field-value"><strong>${e.category?.name??`Sin asignar`}</strong></td></tr>
                    <tr><td class="field-label">Ubicación:</td><td class="field-value">${e.location??`No especificada`}</td></tr>
                    <tr><td class="field-label">Prioridad:</td><td class="field-value"><span class="badge-priority badge-priority-${e.priority?.slug??`media`}">${e.priority?.name??`Media`}</span></td></tr>
                    <tr><td class="field-label">Estado Actual:</td><td class="field-value"><span class="badge-status badge-status-${String(e.status?.code??`nueva`).toLowerCase()}">${e.status?.name??`Nueva`}</span></td></tr>
                </table></div></div>
            </td>
        </tr></table>

        <div class="section-box"><div class="section-header">3. Ciclo de Atención y Cronometría Operativa</div><div class="section-body"><table class="grid-table">
            <tr>
                <td class="field-label" style="width: 20%;">Especialista Asignado:</td>
                <td class="field-value" style="width: 30%;">${i?J`<strong>TICS</strong> (Área Tecnológica)`:e.assigned_to?J`<strong>${e.assigned_to.name}</strong> ${e.assigned_to.badge_number?`(${e.assigned_to.badge_number})`:``}`:J`<strong>Sin asignar a cuadrilla</strong>`}</td>
                <td class="field-label" style="width: 20%;">Fecha Asignación:</td>
                <td class="field-value" style="width: 30%;">${r(e.assigned_at,`Pendiente`)}</td>
            </tr>
            <tr>
                <td class="field-label">Primera Atención:</td><td class="field-value">${r(e.attended_at,`Sin registro de campo`)}</td>
                <td class="field-label">Resolución Técnica:</td><td class="field-value">${r(e.resolved_at,`En proceso técnico`)}</td>
            </tr>
            <tr>
                <td class="field-label">Cierre Formal (VoBo):</td><td class="field-value">${r(e.closed_at,`Pendiente de VoBo APOC`)}</td>
                <td class="field-label">Tiempo Total Solución:</td><td class="field-value">${a}</td>
            </tr>
        </table></div></div>

        <div class="section-box"><div class="section-header">4. Descripción Operativa del Reporte Original</div><div class="section-body">
            <div style="font-weight: bold; color: #0F172A; font-size: 8px; margin-bottom: 2px;">Falla: ${e.title}</div>
            <div class="text-box">${e.description??`Sin descripción adicional registrada.`}</div>
        </div></div>

        <div class="section-box"><div class="section-header">5. Diagnóstico y Dictamen de Solución Técnica</div><div class="section-body">
            <div class="text-box">${e.solution_description?e.solution_description:J`<em style="color: #64748B;">La incidencia no cuenta con solución definitiva registrada. Continúa en protocolo técnico de atención.</em>`}</div>
            ${e.rejection_reason?J`<div style="margin-top: 4px; padding: 4px 6px; background-color: #FEF2F2; border: 1px solid #FECACA; border-radius: 3px; font-size: 7px; color: #991B1B;"><strong>Motivo de rechazo de solución previo por APOC:</strong> ${e.rejection_reason}</div>`:``}
        </div></div>

        <div class="section-box"><div class="section-header">6. Bitácora de Trazabilidad Cronológica (${e.histories.length} Eventos Registrados)</div><div class="section-body" style="padding: 2px 4px;">
            <table class="history-table">
                <thead><tr><th style="width: 19%;">Fecha / Hora</th><th style="width: 18%;">Usuario Responsable</th><th style="width: 21%;">Acción Registrada</th><th style="width: 42%;">Detalle / Comentario de Campo</th></tr></thead>
                <tbody>
                    ${e.histories.length?e.histories.map(e=>J`<tr>
                            <td class="history-date">${r(e.created_at)}</td>
                            <td><strong>${e.user?.name??`Sistema`}</strong> ${e.user?.role?J`<span style="color: #64748B; font-size: 6.5px;">(${e.user.role.name})</span>`:``}</td>
                            <td><span class="action-tag">${Lp(e.action)}</span></td>
                            <td>${e.comment?e.comment:e.field_name?J`<em>Cambio en ${e.field_name}: ${e.old_value??`N/D`} → ${e.new_value??`N/D`}</em>`:J`<span style="color: #94A3B8;">Acción ejecutada sin nota adicional</span>`}</td>
                        </tr>`):J`<tr><td colspan="4" style="text-align: center; color: #64748B; padding: 6px;">Sin registros adicionales en la bitácora pericial de trazabilidad.</td></tr>`}
                </tbody>
            </table>
        </div></div>

        <div class="section-box"><div class="section-header">7. Evidencias Fotográficas y Documentación Adjunta</div><div class="section-body">
            ${e.attachments.length?J`<table class="grid-table">${e.attachments.map(e=>J`<tr>
                    <td style="width: 4%; font-family: monospace;">📎</td>
                    <td style="width: 46%; font-weight: bold; color: #0F172A;">${e.original_filename}</td>
                    <td style="width: 25%; color: #64748B;">${(Math.round((e.file_size_bytes??0)/1024*10)/10).toString()} KB (${e.mime_type??`archivo`})</td>
                    <td style="width: 25%; color: #64748B;">Cargado por: ${e.uploaded_by??`Usuario`}</td>
                </tr>`)}</table>`:J`<span style="color: #64748B; font-size: 7.2px;">No se registraron archivos o evidencias fotográficas anexas a este expediente.</span>`}
        </div></div>

        <table class="signatures-table"><tr>
            <td class="signature-cell">
                <div class="signature-line"></div>
                <div class="signature-name">${i?`Especialista TICS`:e.assigned_to?.name??`Técnico Especialista GTS`}</div>
                <div class="signature-role">${i?`Área de Tecnologías de Información y Comunicaciones`:`Responsable de Atención / Cuadrilla GTS`}</div>
            </td>
            <td class="signature-cell">
                <div class="signature-line"></div>
                <div class="signature-name">${e.reported_by?.name??`Centro APOC`}</div>
                <div class="signature-role">Supervisión y Conformidad Operacional APOC</div>
            </td>
        </tr></table>

        <div class="footer-note">
            Ficha Oficial de Incidencia Técnica emitida por el Sistema de Gestión Tecnológica (GTS) del Aeropuerto Internacional Felipe Ángeles.<br>
            Información clasificada para fines de trazabilidad operativa y mantenimiento de infraestructuras críticas. Control: ${t.report_folio} • ${e.folio}
        </div>
    </td></tr></tbody></table>`}function Qm(e){let t=new URL(`./`,window.location.href).href,n={gts:`${t}images/gts-logo.png`,aifa:`${t}images/aifa-logo.png`},r=e.incidents.length?e.incidents.map(t=>Zm(t,e,n)):J`<div style="text-align: center; padding: 40px;"><h2 style="color: #0F172A;">No se encontraron incidencias</h2>
            <p style="color: #64748B; font-size: 11px;">No se seleccionó ninguna incidencia o los criterios de filtrado actuales no arrojaron resultados en la base de datos.</p></div>`;return`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Reporte_GTS_${e.report_folio}</title>
        <style>${Jm.replace(`__FOLIO__`,e.report_folio)}</style></head><body>${J`${r}`}</body></html>`}function $m(e){return new Promise(t=>{let n=document.createElement(`iframe`);n.setAttribute(`aria-hidden`,`true`),n.style.cssText=`position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;`,document.body.appendChild(n);let r=n.contentWindow.document;r.open(),r.write(Qm(e)),r.close();let i=Array.from(r.images);Promise.all(i.map(e=>e.complete?null:new Promise(t=>{e.onload=t,e.onerror=t}))).then(()=>{let r=document.title;document.title=`Reporte_GTS_${e.report_folio}`,n.contentWindow.focus(),n.contentWindow.print(),setTimeout(()=>{document.title=r,n.remove(),t()},1e3)})})}var eh=[`report_type`,`period_preset`,`date_from`,`date_to`,`status_id`,`priority_id`,`category_id`,`assigned_to`,`reported_by`,`search`,`folio`],th=null;T.data(`reportsPage`,()=>({showEmailModal:!1,showWhatsAppModal:!1,emailRecipient:th.requesterEmail??``,emailNotes:``,whatsAppPhone:``,copiedWhatsApp:!1,selectedIds:[],selectAll:!1,visibleIds:th.visibleIds,generating:!1,actionError:``,actionMessage:``,toggleAll(){this.selectedIds=this.selectAll?[...this.visibleIds]:[]},toggleOne(e){let t=this.selectedIds.indexOf(e);t>-1?this.selectedIds.splice(t,1):this.selectedIds.push(e),this.selectAll=this.visibleIds.length>0&&this.selectedIds.length===this.visibleIds.length},isSelected(e){return this.selectedIds.includes(e)},clearSelection(){this.selectedIds=[],this.selectAll=!1},async fetchReport(){return Vm(th.filters,this.selectedIds.length?this.selectedIds:null)},async generatePdf(){if(!this.generating){this.generating=!0,this.actionError=``;try{await $m(await this.fetchReport())}catch(e){this.actionError=G(e).message}finally{this.generating=!1}}},async sendEmail(){this.actionError=``;try{let e=await this.fetchReport();window.location.href=qm(this.emailRecipient,e.report_folio,e.summary,e.applied_filters,af()?.name,this.emailNotes),this.showEmailModal=!1,this.actionMessage=`Se abrió su cliente de correo con el reporte formal #${e.report_folio}. Adjunte el PDF generado con "Descargar PDF Institucional".`}catch(e){this.actionError=G(e).message}},shareWhatsApp(){let e=this.selectedIds.length?th.rows.filter(e=>this.selectedIds.includes(e.id)).map(e=>e.folio):null,t=Um(th.summary,th.filters,Km(),window.location.href,e);window.open(Gm(this.whatsAppPhone,t),`_blank`,`noopener`),this.showWhatsAppModal=!1},copyPreview(){navigator.clipboard?.writeText(this.$refs.whatsAppText.innerText),this.copiedWhatsApp=!0,setTimeout(()=>this.copiedWhatsApp=!1,2500)}})),T.data(`reportFilters`,e=>({f:{date_from:``,date_to:``,status_id:``,priority_id:``,category_id:``,assigned_to:``,search:``,...e},submit(){V(`/reportes`,this.f)}}));var nh={NUEVA:`bg-blue-500/15 text-blue-400 border-blue-500/30`,ASIGNADA:`bg-purple-500/15 text-purple-400 border-purple-500/30`,EN_ATENCION:`bg-amber-500/15 text-amber-400 border-amber-500/30`,RESUELTA:`bg-emerald-500/15 text-emerald-400 border-emerald-500/30`,CERRADA:`bg-slate-500/15 text-slate-400 border-slate-500/30`};function rh(e,t,n,r,i=`hover:border-[#3D82C6]`){return J`<a href="${e}" class="${X(`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all`,n?r:`bg-[#0B0F14] border-[#263241] text-[#A8B0BC] ${i}`)}">${t}</a>`}function ih(e,t,n,r,i){return J`<div class="flex flex-col gap-1">
        <label class="text-[11px] font-medium text-[#8D98A8]">${e}</label>
        <select x-model="f.${t}" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
            <option value="">${n}</option>
            ${r.map(e=>J`<option value="${e.id}" ${String(i)===String(e.id)?`selected`:``}>${e.name}</option>`)}
        </select>
    </div>`}function ah(e,t,n,r,i,a){return J`<div class="bg-[#11151B] border border-[#263241] p-3.5 rounded-xl flex flex-col justify-between">
        <div class="flex items-center justify-between text-[#8D98A8]">
            <span class="${X(`text-[11px] font-medium uppercase`,t)}">${e}</span>
            ${n}
        </div>
        <div class="mt-2">
            <span class="${X(`text-2xl font-bold font-mono`,i)}">${r}</span>
            <span class="text-[10px] text-[#707B8A] block">${a}</span>
        </div>
    </div>`}var oh={name:`reports.index`,title:`Reportes`,async render({query:e}){let t={};eh.forEach(n=>{e[n]&&(t[n]=e[n])});let[n,r]=await Promise.all([Bm(t,e.page||1),ip()]),i=n.summary,a=If(),o=t=>t in e,s=(e,n)=>{let r={...t};return e.forEach(e=>delete r[e]),Xd(`/reportes`,{...r,...n})};th={filters:t,summary:i,rows:n.data,visibleIds:n.data.map(e=>e.id),requesterEmail:n.requester_email};let c=Um(i,t,`PREV-${Z(new Date,`Ymd`)}`,window.location.href),l=Bf(),u=n.search_warning;return J`<div x-data="reportsPage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            <template x-if="actionMessage"><div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-emerald-400">check_circle</span><span class="font-medium" x-text="actionMessage"></span></div>
                <button type="button" @click="actionMessage = ''" class="text-emerald-400 hover:text-emerald-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>
            <template x-if="actionError"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="actionError"></span></div>
                <button type="button" @click="actionError = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>
            ${qf(`warning`,u)}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Gestión Documental Operativa</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">AIFA & GTS</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Sistema Profesional de Reportes</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">summarize</span><span>Centro Ejecutivo</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Generación de informes técnicos de turno, exportación pericial en PDF (1 ficha por página) y despacho multicanal para APOC y GTS.</p>
                </div>
                ${a?J`<div class="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
                        <button type="button" @click="generatePdf()" :disabled="generating" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#3D82C6] hover:bg-[#316cb0] text-white font-semibold text-xs rounded-xl shadow-md transition-all group disabled:opacity-70" title="Se abrirá el diálogo de impresión: elija «Guardar como PDF»">
                            <span class="material-symbols-outlined text-[18px]" :class="generating ? 'animate-spin' : ''" x-text="generating ? 'progress_activity' : 'picture_as_pdf'">picture_as_pdf</span>
                            <span x-text="selectedIds.length > 0 ? \`Descargar PDF (\${selectedIds.length} seleccionadas)\` : 'Descargar PDF Institucional'"></span>
                        </button>
                        <button type="button" @click="showEmailModal = true" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#11151B] hover:bg-[#151B23] text-[#DDE3EA] border border-[#263241] font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">mail</span>
                            <span x-text="selectedIds.length > 0 ? \`Enviar por Correo (\${selectedIds.length})\` : 'Enviar por Correo'"></span>
                        </button>
                        <button type="button" @click="showWhatsAppModal = true" class="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#11151B] hover:bg-[#151B23] text-[#DDE3EA] border border-[#263241] font-semibold text-xs rounded-xl transition-all">
                            <span class="material-symbols-outlined text-[18px] text-[#20C997]">chat</span>
                            <span x-text="selectedIds.length > 0 ? \`WhatsApp (\${selectedIds.length})\` : 'WhatsApp'"></span>
                        </button>
                    </div>`:``}
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm flex flex-col gap-3">
                <div class="flex items-center justify-between">
                    <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">tune</span>
                        <span>Sección 1 — Presets y Tipos de Reporte</span>
                    </span>
                    ${eh.some(o)?J`<a href="#/reportes" class="text-[11px] text-[#707B8A] hover:text-[#3D82C6] underline flex items-center gap-1">
                            <span class="material-symbols-outlined text-[14px]">refresh</span><span>Restablecer filtros</span></a>`:``}
                </div>
                <div class="flex flex-wrap items-center gap-2">
                    ${rh(`#/reportes`,`🌐 General Completo`,!o(`period_preset`)&&!o(`report_type`)&&!o(`date_from`),`bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold`)}
                    ${rh(s([`date_from`,`date_to`],{period_preset:`today`}),`⏱️ Turno de Hoy`,e.period_preset===`today`,`bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold`)}
                    ${rh(s([`date_from`,`date_to`],{period_preset:`week`}),`📅 Últimos 7 Días`,e.period_preset===`week`,`bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold`)}
                    ${rh(s([`date_from`,`date_to`],{period_preset:`month`}),`📊 Mes en Curso`,e.period_preset===`month`,`bg-[#3D82C6]/20 border-[#3D82C6] text-[#F2F5F8] font-semibold`)}
                    ${rh(s([`priority_id`],{report_type:`critical`}),`🚨 Incidencias Críticas`,e.report_type===`critical`,`bg-rose-500/20 border-rose-500 text-rose-300 font-semibold`,`hover:border-rose-500/50`)}
                    ${rh(s([`status_id`],{report_type:`open`}),`⏳ Pendientes en Atención`,e.report_type===`open`,`bg-amber-500/20 border-amber-500 text-amber-300 font-semibold`,`hover:border-amber-500/50`)}
                    ${rh(s([`status_id`],{report_type:`resolved`}),`✅ Resueltas / VoBo`,e.report_type===`resolved`,`bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold`,`hover:border-emerald-500/50`)}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-5 rounded-2xl shadow-sm">
                <form x-data="reportFilters(${Y({...e.report_type?{report_type:e.report_type}:{},...e.period_preset&&!e.date_from?{period_preset:e.period_preset}:{},...t})})" @submit.prevent="submit()" class="flex flex-col gap-4" autocomplete="off">
                    <div class="flex items-center justify-between border-b border-[#1F2937] pb-2.5 flex-wrap gap-2">
                        <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">filter_list</span>
                            <span>Sección 2 — Filtros Operativos Avanzados</span>
                        </span>
                        <span class="text-[11px] text-[#707B8A]">Los filtros se reflejan de forma idéntica en PDF, Correo y WhatsApp</span>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] font-medium text-[#8D98A8]">Fecha Inicial:</label>
                            <input type="date" x-model="f.date_from" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-[11px] font-medium text-[#8D98A8]">Fecha Final:</label>
                            <input type="date" x-model="f.date_to" class="w-full text-xs px-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                        </div>
                        ${ih(`Estado Operativo:`,`status_id`,`Todos los estados`,r.statuses,t.status_id)}
                        ${ih(`Prioridad:`,`priority_id`,`Todas las prioridades`,r.priorities,t.priority_id)}
                        ${ih(`Subsistema / Área:`,`category_id`,`Todas las áreas`,r.categories,t.category_id)}
                        ${ih(`Técnico GTS:`,`assigned_to`,`Todos los técnicos`,n.gts_users,t.assigned_to)}
                    </div>
                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <div class="w-full sm:max-w-md relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#707B8A] text-[18px]">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar por folio (ej. INC-2026-0106), título, ubicación..."
                                class="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#DDE3EA] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]">
                        </div>
                        <div class="flex items-center gap-2 self-end sm:self-auto">
                            <a href="#/reportes" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151A21] border border-[#263241] text-[#A8B0BC] text-xs font-semibold transition-all">Limpiar</a>
                            <button type="submit" class="px-5 py-2 rounded-xl bg-[#1E293B] hover:bg-[#283548] text-[#3D82C6] hover:text-white border border-[#3D82C6]/40 font-semibold text-xs transition-all flex items-center gap-2 shadow-sm">
                                <span class="material-symbols-outlined text-[17px]">filter_alt</span><span>Aplicar Filtros</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div>
                <div class="flex items-center justify-between mb-2.5 flex-wrap gap-2">
                    <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">analytics</span>
                        <span>Sección 3 — Resumen Ejecutivo Previo (Incidencias Filtradas)</span>
                    </span>
                    <span class="text-xs text-[#707B8A] font-mono">${i.total} registros consolidados</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    ${ah(`Total`,``,J`<span class="material-symbols-outlined text-[18px] text-[#3D82C6]">receipt_long</span>`,i.total,`text-[#F2F5F8]`,`Incidencias en reporte`)}
                    ${ah(`Nuevas`,`text-blue-400`,J`<span class="w-2 h-2 rounded-full bg-blue-500"></span>`,i.by_status.NUEVA??0,`text-blue-400`,`Por asignar`)}
                    ${ah(`En Atención`,`text-amber-400`,J`<span class="w-2 h-2 rounded-full bg-amber-500"></span>`,i.by_status.EN_ATENCION??0,`text-amber-400`,`Técnico en campo`)}
                    ${ah(`Resueltas`,`text-emerald-400`,J`<span class="w-2 h-2 rounded-full bg-emerald-500"></span>`,i.by_status.RESUELTA??0,`text-emerald-400`,`Pendientes VoBo`)}
                    ${ah(`Cerradas`,`text-[#8D98A8]`,J`<span class="w-2 h-2 rounded-full bg-slate-500"></span>`,i.by_status.CERRADA??0,`text-[#DDE3EA]`,`Concluidas con VoBo`)}
                    ${ah(`Eficacia`,`text-[#3D82C6]`,J`<span class="material-symbols-outlined text-[18px] text-[#3D82C6]">speed</span>`,`${i.resolution_rate}%`,`text-[#3D82C6]`,`MTTR: ${i.avg_resolution_time_formatted}`)}
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <div class="p-4 border-b border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="text-xs uppercase tracking-wider text-[#8D98A8] font-bold">Listado Nominal de Incidencias</span>
                        <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-[#151B23] border border-[#263241] text-[#3D82C6]">${n.meta.total} registros</span>
                    </div>
                    <div class="text-[11px] text-[#707B8A]">Página ${n.meta.current_page} de ${n.meta.last_page}</div>
                </div>

                <div x-show="selectedIds.length > 0" x-cloak x-transition class="p-3 bg-[#152336] border-b border-[#263241] flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2 text-[#93C5FD] font-medium">
                        <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">check_box</span>
                        <span class="font-bold text-[#F2F5F8]" x-text="selectedIds.length"></span>
                        <span x-text="selectedIds.length === 1 ? 'incidencia seleccionada para el reporte' : 'incidencias seleccionadas para el reporte'"></span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                        ${a?J`<button type="button" @click="generatePdf()" class="px-3 py-1.5 rounded-lg bg-[#3D82C6] hover:bg-[#316cb0] text-white font-semibold flex items-center gap-1.5 transition-all shadow-sm" title="Descargar reporte con incidencias seleccionadas">
                                <span class="material-symbols-outlined text-[15px]">picture_as_pdf</span><span>Descargar Reporte (<span x-text="selectedIds.length"></span>)</span></button>
                            <button type="button" @click="showEmailModal = true" class="px-3 py-1.5 rounded-lg bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#DDE3EA] font-semibold flex items-center gap-1.5 transition-all">
                                <span class="material-symbols-outlined text-[15px] text-[#3D82C6]">mail</span><span>Correo (<span x-text="selectedIds.length"></span>)</span></button>
                            <button type="button" @click="showWhatsAppModal = true" class="px-3 py-1.5 rounded-lg bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#DDE3EA] font-semibold flex items-center gap-1.5 transition-all">
                                <span class="material-symbols-outlined text-[15px] text-[#20C997]">chat</span><span>WhatsApp (<span x-text="selectedIds.length"></span>)</span></button>`:``}
                        <button type="button" @click="clearSelection()" class="text-[#707B8A] hover:text-[#DDE3EA] underline text-[11px] ml-1">Deseleccionar todas</button>
                    </div>
                </div>

                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[860px] table-fixed text-left text-xs text-[#DDE3EA]">
                        <thead class="bg-[#0B0F14] border-b border-[#263241] text-[10px] uppercase font-bold text-[#8D98A8] tracking-wider">
                            <tr>
                                <th class="py-2.5 px-2.5 w-[4%] text-center">
                                    <input type="checkbox" x-model="selectAll" @change="toggleAll()" class="rounded bg-[#0B0F14] border-[#263241] text-[#3D82C6] focus:ring-0 focus:ring-offset-0 cursor-pointer" title="Seleccionar todas las incidencias visibles">
                                </th>
                                <th class="py-2.5 px-2.5 w-[13%]">Folio</th>
                                <th class="py-2.5 px-2.5 w-[12%]">Apertura</th>
                                <th class="py-2.5 px-2.5 w-[13%]">Subsistema</th>
                                <th class="py-2.5 px-2.5 w-[13%]">Ubicación</th>
                                <th class="py-2.5 px-2.5 w-[23%]">Falla / Título</th>
                                <th class="py-2.5 px-2.5 w-[10%] text-center">Prioridad</th>
                                <th class="py-2.5 px-2.5 w-[12%] text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937]">
                            ${n.data.length?n.data.map(e=>J`<tr :class="isSelected(${e.id}) ? 'bg-[#152336] border-l-2 border-[#3D82C6]' : 'hover:bg-[#151B23]'" class="transition-colors">
                                    <td class="py-2.5 px-2.5 w-[4%] text-center">
                                        <input type="checkbox" :checked="isSelected(${e.id})" @change="toggleOne(${e.id})" class="rounded bg-[#0B0F14] border-[#263241] text-[#3D82C6] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                    </td>
                                    <td class="py-2.5 px-2.5 w-[13%] font-mono font-bold text-[#3D82C6]">
                                        <div class="flex flex-col">
                                            <a href="#/incidencias/${encodeURIComponent(e.folio)}" class="hover:underline flex items-center gap-1 truncate" title="${e.folio}">
                                                <span>${e.folio}</span><span class="material-symbols-outlined text-[13px] text-[#707B8A]">open_in_new</span>
                                            </a>
                                            ${l?Op(e)?J`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20" title="Procedencia: APOC-CCO">CCO</span>`:kp(e)?J`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20" title="Procedencia: APOC-CSA">CSA</span>`:e.origin_group?J`<span class="inline-flex items-center gap-0.5 mt-0.5 w-fit px-1.5 py-0.2 rounded text-[9px] font-bold font-mono tracking-wider bg-slate-500/10 text-slate-400 border border-slate-500/20">${e.origin_group}</span>`:``:``}
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 w-[12%] font-mono text-[#8D98A8] whitespace-nowrap text-[11px]">${Z(e.created_at,`d/m/Y H:i`)}</td>
                                    <td class="py-2.5 px-2.5 w-[13%] font-semibold text-[#F2F5F8] truncate" title="${e.category?.name??`Sin categoría`}">${e.category?.name??`Sin categoría`}</td>
                                    <td class="py-2.5 px-2.5 w-[13%] text-[#A8B0BC] truncate" title="${e.location}">${e.location}</td>
                                    <td class="py-2.5 px-2.5 w-[23%] text-[#DDE3EA] truncate font-medium" title="${e.title}">${e.title}</td>
                                    <td class="py-2.5 px-2.5 w-[10%] text-center whitespace-nowrap">${Hf(e.priority)}</td>
                                    <td class="py-2.5 px-2.5 w-[12%] text-center whitespace-nowrap">
                                        <span class="${X(`px-2 py-0.5 rounded-full text-[10px] font-semibold border`,nh[e.status?.code]??`bg-gray-500/15 text-gray-400 border-gray-500/30`)}">${e.status?.name??`N/D`}</span>
                                    </td>
                                </tr>`):J`<tr><td colspan="8" class="py-12 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center gap-2">
                                        <span class="${X(`material-symbols-outlined text-[36px]`,u?`text-amber-400`:`text-[#263241]`)}">${u?`warning`:`search_off`}</span>
                                        <span class="${X(`text-xs font-medium`,u&&`text-amber-300`)}">${u??`No se encontraron incidencias con los criterios de filtrado seleccionados.`}</span>
                                        <a href="#/reportes" class="text-xs text-[#3D82C6] hover:underline mt-1">Restablecer todos los filtros</a>
                                    </div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${n.meta.last_page>1?J`<div class="p-4 border-t border-[#263241] bg-[#0B0F14]">${Kf(n.meta,`/reportes`,e)}</div>`:``}
            </div>

            ${a?J`<div x-show="showEmailModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div @click.outside="showEmailModal = false" class="w-full max-w-lg bg-[#11151B] border border-[#263241] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#263241] bg-[#151B23] flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-lg bg-[#3D82C6]/15 border border-[#3D82C6]/30 flex items-center justify-center text-[#3D82C6]"><span class="material-symbols-outlined text-[19px]">mail</span></div>
                                <div>
                                    <h3 class="text-sm font-bold text-[#F2F5F8]">Despachar Reporte Oficial por Correo</h3>
                                    <span class="text-[10px] text-[#8D98A8]">Prepara el correo con el resumen ejecutivo del reporte</span>
                                </div>
                            </div>
                            <button type="button" @click="showEmailModal = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[20px]">close</span></button>
                        </div>
                        <form @submit.prevent="sendEmail()" class="p-5 flex flex-col gap-4" autocomplete="off">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Correo Institucional Destinatario:</label>
                                <input type="email" x-model="emailRecipient" required placeholder="destinatario@aifa.aero o usuario@dominio.com"
                                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]">
                                <span class="text-[10px] text-[#707B8A]">Se abrirá su cliente de correo con el resumen ejecutivo y los criterios aplicados.</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Notas u Observaciones del Solicitante (Opcional):</label>
                                <textarea x-model="emailNotes" rows="3" maxlength="1000" placeholder="Ingrese notas aclaratorias sobre el turno, instrucciones para la jefatura de guardia o contexto relevante..."
                                    class="w-full text-xs p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] focus:ring-1 focus:ring-[#3D82C6]"></textarea>
                            </div>
                            <div class="p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[11px] text-[#8D98A8] flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-[18px] text-[#3D82C6]">attach_file</span>
                                <span>Adjunte el PDF institucional (<strong class="text-[#DDE3EA] font-mono">Reporte_GTS_${Z(new Date,`Ymd`)}.pdf</strong>, <span x-text="selectedIds.length > 0 ? \`\${selectedIds.length} incidencias seleccionadas\` : '${i.total} incidencias'"></span>) generado con «Descargar PDF Institucional».</span>
                            </div>
                            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
                                <button type="button" @click="showEmailModal = false" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#A8B0BC] text-xs font-medium transition-all">Cancelar</button>
                                <button type="submit" class="px-5 py-2 rounded-xl bg-[#3D82C6] hover:bg-[#316cb0] text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[16px]">send</span><span>Enviar Reporte Ahora</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div x-show="showWhatsAppModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                    <div @click.outside="showWhatsAppModal = false" class="w-full max-w-lg bg-[#11151B] border border-[#263241] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                        <div class="p-5 border-b border-[#263241] bg-[#151B23] flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400"><span class="material-symbols-outlined text-[19px]">chat</span></div>
                                <div>
                                    <h3 class="text-sm font-bold text-[#F2F5F8]">Compartir Resumen por WhatsApp</h3>
                                    <span class="text-[10px] text-[#8D98A8]">Despacho mediante enlace seguro de WhatsApp Web/Móvil</span>
                                </div>
                            </div>
                            <button type="button" @click="showWhatsAppModal = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[20px]">close</span></button>
                        </div>
                        <form @submit.prevent="shareWhatsApp()" class="p-5 flex flex-col gap-4" autocomplete="off">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-xs font-semibold text-[#DDE3EA]">Número Telefónico del Destinatario (con lada):</label>
                                <input type="tel" x-model="whatsAppPhone" required minlength="10" maxlength="25" placeholder="Ej. +52 55 1234 5678 o 5512345678"
                                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono">
                                <span class="text-[10px] text-[#707B8A]">Formato estándar con 10 dígitos o prefijo internacional (+52 para México).</span>
                            </div>
                            <div class="flex flex-col gap-1.5">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-semibold text-[#8D98A8]">Vista Previa del Mensaje Oficial:</label>
                                    <button type="button" @click="copyPreview()" class="text-[11px] text-[#3D82C6] hover:text-white flex items-center gap-1">
                                        <span class="material-symbols-outlined text-[13px]">content_copy</span>
                                        <span x-text="copiedWhatsApp ? '¡Copiado!' : 'Copiar texto'"></span>
                                    </button>
                                </div>
                                <div x-ref="whatsAppText" class="w-full text-[11px] p-3 rounded-xl bg-[#0B0F14] border border-[#263241] text-[#A8B0BC] font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">${c}</div>
                            </div>
                            <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-[#1F2937]">
                                <button type="button" @click="showWhatsAppModal = false" class="px-4 py-2 rounded-xl bg-[#0B0F14] hover:bg-[#151B23] border border-[#263241] text-[#A8B0BC] text-xs font-medium transition-all">Cancelar</button>
                                <button type="submit" class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[16px]">send</span><span>Enviar por WhatsApp</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>`:``}
        </div>`}},sh=[`search`,`action`,`user_id`,`folio`,`date_from`,`date_to`,`status_id`,`category_id`,`priority_id`];T.data(`auditPage`,e=>({activeTab:e,showDeleteModal:!1,deleteFolio:``,deleteId:null,deleting:!1,deleteError:``,confirmDelete(e,t){this.deleteFolio=e,this.deleteId=t,this.deleteError=``,this.showDeleteModal=!0},async destroy(){if(!this.deleting){this.deleting=!0;try{q(`status_message`,`El expediente de la incidencia #${(await gm(this.deleteId)).folio} y sus archivos asociados han sido eliminados definitivamente del sistema.`),Zd()}catch(e){this.deleteError=G(e).message,this.deleting=!1}}}})),T.data(`auditFilters`,e=>({f:{search:``,action:``,user_id:``,date_from:``,date_to:``,status_id:``,category_id:``,...e},submit(){V(`/auditoria`,this.f)}}));function ch(e,t){return J`<button type="button" @click="confirmDelete(${Y(e)}, ${Y(t)})"
        class="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-all shadow-sm cursor-pointer whitespace-nowrap"
        title="Eliminar definitivamente expediente ${e}">
        <span class="material-symbols-outlined text-[15px] shrink-0">delete</span>
        <span>Eliminar</span>
    </button>`}function lh(e,t,n,r,i){return J`<div class="bg-surface-subtle border border-border-subtle p-4 rounded-xl flex items-center justify-between shadow-sm">
        <div class="flex flex-col">
            <span class="text-xs text-outline uppercase font-medium">${e}</span>
            <span class="${X(`font-mono text-xl sm:text-2xl font-bold mt-0.5`,n)}">${pp(t)}</span>
        </div>
        <div class="${X(`w-10 h-10 rounded-lg flex items-center justify-center`,r)}"><span class="material-symbols-outlined text-[22px]">${i}</span></div>
    </div>`}var uh=(e,t)=>J`<tr><td colspan="8" class="py-12 px-4 text-center">
    <div class="flex flex-col items-center justify-center gap-3">
        <div class="w-12 h-12 rounded-full bg-surface-container-high text-outline flex items-center justify-center"><span class="material-symbols-outlined text-[28px]">search_off</span></div>
        <div class="flex flex-col items-center gap-1">
            <span class="font-semibold text-on-surface text-sm">${e}</span>
            <p class="text-xs text-outline max-w-md">${t}</p>
        </div>
    </div>
</td></tr>`,dh={name:`audit.index`,title:`Auditoría`,async render({query:e}){let t={};sh.forEach(n=>{e[n]&&(t[n]=e[n])});let n=await Qf.data(t,e.incidents_page||1,e.page||1),r=bf(),i=n.statistics;return J`<div x-data="auditPage(${Y(t.action||e.view===`history`?`history`:`incidents`)})" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${qf(`success`,r.status_message)}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Trazabilidad Aeronáutica</span>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#8D98A8] font-medium">Bitácora Pericial</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Bitácora General de Auditoría</h1>
                        <span class="px-2.5 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-semibold uppercase tracking-wider border border-border-subtle flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">lock</span><span>Append-Only</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-on-surface-variant mt-1">Supervisión integral de expedientes del sistema y registro cronológico inmutable de eventos bajo norma OACI / AFAC.</p>
                </div>
                <div class="flex items-center gap-3 self-start md:self-auto">
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low border border-border-subtle text-on-surface-variant text-xs">
                        <span class="w-2 h-2 rounded-full bg-status-resolved animate-pulse"></span>
                        <span class="font-medium text-on-surface">Auditoría en Tiempo Real</span>
                    </div>
                    <a href="#/incidencias" class="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low hover:bg-surface-container text-on-surface border border-border-subtle font-semibold text-xs rounded-xl transition-all">
                        <span class="material-symbols-outlined text-[18px]">confirmation_number</span><span>Ver Incidencias</span>
                    </a>
                </div>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${lh(`Total Expedientes en Sistema`,i.total_incidents,`text-primary`,`bg-primary/10 text-primary`,`folder`)}
                ${lh(`Eventos de Bitácora`,i.total_events,`text-cyan-400`,`bg-cyan-500/10 text-cyan-400`,`history`)}
                ${lh(`Cambios de Estado`,i.state_changes,`text-amber-400`,`bg-amber-500/10 text-amber-400`,`sync_alt`)}
                ${lh(`Resoluciones / Cierres VoBo`,i.resolutions+i.closures,`text-emerald-400`,`bg-emerald-500/10 text-emerald-400`,`verified`)}
            </div>

            <div class="bg-surface-subtle border border-border-subtle p-5 rounded-2xl shadow-sm">
                <form x-data="auditFilters(${Y(t)})" @submit.prevent="submit()" class="flex flex-col gap-4" autocomplete="off">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-center">
                        <div class="lg:col-span-4 relative">
                            <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">search</span>
                            <input type="text" x-model="f.search" placeholder="Buscar en comentario, folio o valores..."
                                class="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary/50 transition-colors shadow-inner" />
                        </div>
                        <div class="lg:col-span-3 relative">
                            <select x-model="f.action" class="w-full pl-3.5 pr-8 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:border-primary/50 cursor-pointer transition-colors shadow-inner">
                                <option value="">Todas las Acciones</option>
                                ${Object.entries(Ip).map(([e,n])=>J`<option value="${e}" ${t.action===e?`selected`:``}>${n}</option>`)}
                            </select>
                            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        <div class="lg:col-span-3 relative">
                            <select x-model="f.user_id" class="w-full pl-3.5 pr-8 py-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-on-surface appearance-none focus:outline-none focus:border-primary/50 cursor-pointer transition-colors shadow-inner">
                                <option value="">Todos los Operadores</option>
                                ${n.users.map(e=>J`<option value="${e.id}" ${String(t.user_id)===String(e.id)?`selected`:``}>${e.name} (${(e.role?.name??`USUARIO`).toUpperCase()})</option>`)}
                            </select>
                            <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">expand_more</span>
                        </div>
                        <div class="lg:col-span-2 flex items-center gap-2">
                            <button type="submit" class="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-sm transition-all">
                                <span class="material-symbols-outlined text-[16px]">filter_list</span><span>Filtrar</span>
                            </button>
                            ${Object.keys(t).length?J`<a href="#/auditoria" class="p-2.5 bg-surface-container-high hover:bg-surface-container text-outline hover:text-on-surface rounded-xl border border-border-subtle transition-colors" title="Limpiar todos los filtros">
                                    <span class="material-symbols-outlined text-[18px]">filter_alt_off</span></a>`:``}
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border-subtle/50 text-xs text-on-surface-variant">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-outline flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">date_range</span><span>Desde:</span></span>
                                <input type="date" x-model="f.date_from" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner" />
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="font-medium text-outline">Hasta:</span>
                                <input type="date" x-model="f.date_to" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner" />
                            </div>
                        </div>
                        <div class="flex flex-wrap items-center gap-3">
                            <div class="flex items-center gap-1.5">
                                <span class="text-outline text-xs">Estado:</span>
                                <select x-model="f.status_id" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner cursor-pointer">
                                    <option value="">Todos los Estados</option>
                                    ${n.statuses.map(e=>J`<option value="${e.id}" ${String(t.status_id)===String(e.id)?`selected`:``}>${e.name}</option>`)}
                                </select>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="text-outline text-xs">Subsistema:</span>
                                <select x-model="f.category_id" class="px-2.5 py-1.5 bg-surface-container-low border border-border-subtle rounded-lg text-xs text-on-surface focus:outline-none focus:border-primary/50 shadow-inner cursor-pointer">
                                    <option value="">Todos los Subsistemas</option>
                                    ${n.categories.map(e=>J`<option value="${e.id}" ${String(t.category_id)===String(e.id)?`selected`:``}>${e.name}</option>`)}
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div class="flex flex-wrap items-center gap-2 p-1.5 bg-surface-container-low border border-border-subtle rounded-2xl self-start">
                <button type="button" @click="activeTab = 'incidents'" :class="activeTab === 'incidents' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container-high/40'" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[17px]">folder_open</span>
                    <span>Expedientes del Sistema (Todas las Incidencias)</span>
                    <span class="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold" :class="activeTab === 'incidents' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-primary'">${n.incidents_meta.total}</span>
                </button>
                <button type="button" @click="activeTab = 'history'" :class="activeTab === 'history' ? 'bg-primary text-on-primary font-bold shadow-md' : 'text-on-surface-variant hover:text-on-surface font-medium hover:bg-surface-container-high/40'" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs transition-all cursor-pointer">
                    <span class="material-symbols-outlined text-[17px]">history_edu</span>
                    <span>Bitácora de Trazabilidad e Historial</span>
                    <span class="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold" :class="activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-surface-container-high text-primary'">${n.histories_meta.total}</span>
                </button>
            </div>

            <div x-show="activeTab === 'incidents'" class="bg-surface-subtle border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-surface-container-low border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-on-surface">Expedientes de Incidencias:</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono font-bold">${n.incidents_meta.total} expedientes registrados</span>
                    </div>
                    <div class="text-outline text-[11px] flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[14px] text-emerald-400">check_circle</span>
                        <span>Conjunto completo del sistema sin exclusión de estados ni restricciones de usuario</span>
                    </div>
                </div>
                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[880px] max-w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr class="bg-surface-container-low/70 border-b border-border-subtle text-outline text-[11px] font-semibold uppercase tracking-wider">
                                <th class="w-[12%] py-2.5 px-2.5 font-semibold">Folio</th>
                                <th class="w-[24%] py-2.5 px-2.5 font-semibold">Asunto / Subsistema</th>
                                <th class="w-[15%] py-2.5 px-2.5 font-semibold">Ubicación</th>
                                <th class="w-[9%] py-2.5 px-2 text-center font-semibold">Prioridad</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Estado</th>
                                <th class="w-[11%] py-2.5 px-2.5 font-semibold">Responsable</th>
                                <th class="w-[9%] py-2.5 px-2 text-center font-semibold">Fecha</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border-subtle/40 text-xs text-on-surface font-normal">
                            ${n.incidents.length?n.incidents.map(e=>J`<tr class="hover:bg-surface-container-low/40 transition-colors">
                                    <td class="py-2.5 px-2.5 whitespace-nowrap min-w-0">
                                        <a href="#/incidencias/${encodeURIComponent(e.folio)}" class="font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs truncate max-w-full">
                                            <span>${e.folio}</span><span class="material-symbols-outlined text-[13px] shrink-0">open_in_new</span>
                                        </a>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <div class="font-semibold text-on-surface truncate text-xs" title="${e.title}">${e.title}</div>
                                        <div class="text-[10.5px] text-on-surface-variant truncate max-w-full mt-0.5 flex items-center gap-1" title="${e.category?.name??`Sin subsistema`}">
                                            <span class="w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0"></span><span class="truncate">${e.category?.name??`General`}</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0"><span class="text-on-surface block truncate text-xs" title="${e.location}">${e.location}</span></td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${Hf(e.priority)}</td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                        <span class="${X(`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-semibold text-[10px] whitespace-nowrap`,Fp(e.status?.code))}">
                                            ${e.status?.code===`EN_ATENCION`?J`<span class="w-1 h-1 rounded-full bg-[#E0A21A] animate-pulse shrink-0"></span>`:``}
                                            <span>${e.status?.name??`Desconocido`}</span>
                                        </span>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${e.assigned_to?J`<div class="flex items-center gap-1 min-w-0" title="Asignado a: ${e.assigned_to.name}">
                                                <span class="w-5 h-5 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center font-mono text-[9px] text-primary font-bold shrink-0">${e.assigned_to.name.slice(0,2)}</span>
                                                <span class="text-on-surface text-xs truncate">${e.assigned_to.name}</span>
                                            </div>`:J`<span class="px-1.5 py-0.5 rounded bg-surface-container-low text-outline font-mono text-[9.5px] border border-border-subtle whitespace-nowrap">Sin Asignar</span>`}
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap font-mono text-[10.5px] text-center text-outline">${Z(e.created_at,`d/m/Y`)}</td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${n.can_delete?ch(e.folio,e.id):J`<span class="text-outline text-[11px]">—</span>`}</td>
                                </tr>`):uh(`No se encontraron expedientes de incidencias`,`No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados en el historial completo del sistema.`)}
                        </tbody>
                    </table>
                </div>
                ${n.incidents_meta.last_page>1?J`<div class="p-4 bg-surface-container-low border-t border-border-subtle">${Kf(n.incidents_meta,`/auditoria`,e,`incidents_page`)}</div>`:``}
            </div>

            <div x-show="activeTab === 'history'" x-cloak class="bg-surface-subtle border border-border-subtle rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-surface-container-low border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div class="flex items-center gap-2">
                        <span class="font-semibold text-on-surface">Eventos de Bitácora:</span>
                        <span class="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono font-bold">${n.histories_meta.total} registros</span>
                    </div>
                    <div class="text-outline text-[11px]">Ordenados en estricto orden cronológico inverso (el más reciente primero)</div>
                </div>
                <div class="w-full overflow-x-auto">
                    <table class="w-full min-w-[920px] max-w-full text-left border-collapse table-fixed">
                        <thead>
                            <tr class="bg-surface-container-low/70 border-b border-border-subtle text-outline text-[11px] font-semibold uppercase tracking-wider">
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Fecha / Hora</th>
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Expediente</th>
                                <th class="w-[13%] py-2.5 px-2.5 font-semibold">Operador / Actor</th>
                                <th class="w-[12%] py-2.5 px-2.5 font-semibold">Acción Auditada</th>
                                <th class="w-[14%] py-2.5 px-2.5 font-semibold">Campo / Diferencial</th>
                                <th class="w-[20%] py-2.5 px-2.5 font-semibold">Observaciones</th>
                                <th class="w-[5%] py-2.5 px-2 text-center font-semibold">Sello</th>
                                <th class="w-[10%] py-2.5 px-2 text-center font-semibold">Acción</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border-subtle/40 text-xs text-on-surface font-normal">
                            ${n.histories.length?n.histories.map(e=>J`<tr class="hover:bg-surface-container-low/40 transition-colors">
                                    <td class="py-2.5 px-2.5 whitespace-nowrap">
                                        <div class="font-mono text-xs font-semibold text-on-surface">${Z(e.created_at,`d/m/Y H:i:s`)}</div>
                                        <div class="text-[10.5px] text-outline mt-0.5">${up(e.created_at)}</div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${e.incident?J`<a href="#/incidencias/${encodeURIComponent(e.incident.folio)}" class="font-mono font-bold text-primary hover:underline inline-flex items-center gap-1 text-xs truncate max-w-full">
                                                <span>${e.incident.folio}</span><span class="material-symbols-outlined text-[13px] shrink-0">open_in_new</span></a>
                                                <div class="text-[10.5px] text-on-surface-variant truncate max-w-full mt-0.5">${e.incident.category?.name??`General`}</div>`:J`<span class="font-mono text-outline text-xs">#${e.incident_id}</span>`}
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <div class="flex items-center gap-1.5 min-w-0">
                                            <div class="w-6 h-6 rounded-full bg-surface-container-high border border-border-subtle flex items-center justify-center text-[10px] font-bold text-primary shrink-0">${(e.user?.name??`S`).slice(0,1)}</div>
                                            <div class="flex flex-col min-w-0 truncate">
                                                <span class="font-semibold text-on-surface text-xs truncate" title="${e.user?.name??`Sistema`}">${e.user?.name??`Sistema`}</span>
                                                <span class="text-[9.5px] text-outline uppercase font-mono truncate">${e.user?.role?.name??`AUDITORÍA`}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        <span class="${X(`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-semibold truncate max-w-full`,zp(e.action))}" title="${Lp(e.action)}">
                                            <span class="material-symbols-outlined text-[13px] shrink-0">${Rp(e.action)}</span>
                                            <span class="truncate">${Lp(e.action)}</span>
                                        </span>
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${e.field_name?J`<div class="font-mono text-[10.5px] text-outline font-semibold truncate" title="${e.field_name}">${e.field_name}</div>
                                                ${e.old_value||e.new_value?J`<div class="flex items-center gap-1 text-[10.5px] mt-0.5 min-w-0">
                                                        ${e.old_value?J`<span class="text-rose-400/90 font-mono bg-rose-500/10 px-1 py-0.5 rounded border border-rose-500/20 truncate max-w-[70px]" title="${e.old_value}">${e.old_value}</span><span class="text-outline text-[9px] font-bold shrink-0">→</span>`:``}
                                                        ${e.new_value?J`<span class="text-emerald-400/90 font-mono bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20 truncate max-w-[70px]" title="${e.new_value}">${e.new_value}</span>`:``}
                                                    </div>`:``}`:J`<span class="text-outline text-[11px]">—</span>`}
                                    </td>
                                    <td class="py-2.5 px-2.5 min-w-0">
                                        ${e.comment?J`<p class="text-xs text-on-surface-variant leading-snug line-clamp-2" title="${e.comment}">${e.comment}</p>`:J`<span class="text-outline text-[11px] italic">Sin observaciones adicionales</span>`}
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">
                                        <div class="inline-flex items-center justify-center p-1 rounded-md text-emerald-400/80 bg-emerald-500/10 border border-emerald-500/20" title="Registro inmutable firmado con timestamp pericial">
                                            <span class="material-symbols-outlined text-[15px]">verified_user</span>
                                        </div>
                                    </td>
                                    <td class="py-2.5 px-2 whitespace-nowrap text-center">${e.incident&&n.can_delete?ch(e.incident.folio,e.incident.id):J`<span class="text-outline text-[11px]">—</span>`}</td>
                                </tr>`):uh(`No se encontraron eventos de auditoría`,`No hay registros que coincidan con los criterios de búsqueda o filtros seleccionados.`)}
                        </tbody>
                    </table>
                </div>
                ${n.histories_meta.last_page>1?J`<div class="p-4 bg-surface-container-low border-t border-border-subtle">${Kf(n.histories_meta,`/auditoria`,{...e,view:`history`})}</div>`:``}
            </div>

            <div x-show="showDeleteModal" x-cloak @keydown.escape.window="showDeleteModal = false" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
                <div class="flex items-center justify-center min-h-screen px-4 py-8">
                    <div x-show="showDeleteModal" x-transition.opacity @click="showDeleteModal = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" aria-hidden="true"></div>
                    <div x-show="showDeleteModal" x-transition class="relative bg-[#11151B] border border-rose-500/30 rounded-2xl text-left overflow-hidden shadow-2xl sm:max-w-lg w-full p-6">
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[28px]">warning</span></div>
                            <div class="flex flex-col">
                                <h3 class="text-base font-bold text-[#F2F5F8]">Confirmar Eliminación Permanente</h3>
                                <p class="text-xs text-[#8D98A8] mt-1.5 leading-relaxed">¿Está completamente seguro de que desea eliminar la incidencia <strong class="font-mono text-rose-400 font-bold" x-text="deleteFolio"></strong>?</p>
                                <div class="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] text-rose-300 leading-relaxed flex flex-col gap-1">
                                    <span class="font-semibold text-rose-400 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">shield</span><span>Consecuencias operacionales irreversibles:</span></span>
                                    <span>• Se purgará el registro de la incidencia de PostgreSQL.</span>
                                    <span>• Se eliminarán permanentemente las evidencias y adjuntos del almacenamiento.</span>
                                    <span>• Se eliminará la traza pericial vinculada a este expediente.</span>
                                </div>
                                <p x-show="deleteError" x-cloak x-text="deleteError" class="mt-3 text-[11px] text-[#E66A7A]"></p>
                            </div>
                        </div>
                        <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
                            <button type="button" @click="showDeleteModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold transition-colors cursor-pointer">Cancelar</button>
                            <button type="button" @click="destroy()" :disabled="deleting" class="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/30 transition-all cursor-pointer disabled:opacity-60">
                                <span class="material-symbols-outlined text-[16px]">delete_forever</span><span x-text="deleting ? 'Eliminando...' : 'Eliminar Definitivamente'">Eliminar Definitivamente</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`}},fh={id:null,name:``,code:``,slug:``,description:``,location:``,technical_specs:``,icon:`hub`,color:`#06B6D4`,status:`ACTIVO`,incidents_count:0,active_incidents_count:0,availability:100};T.data(`catalogsPage`,()=>({showCreateModal:!1,showEditModal:!1,showStatusModal:!1,showViewModal:!1,activeItem:{...fh},createItem:{...fh},reason:``,saving:!1,modalError:``,open(e,t){this.activeItem=JSON.parse(JSON.stringify(t)),this.modalError=``,this[e]=!0},openCreate(){this.createItem={...fh},this.modalError=``,this.showCreateModal=!0},async save(e,t){if(!this.saving){this.saving=!0,this.modalError=``;try{q(`success`,(await e()).message),this[t]=!1,Zd()}catch(e){this.modalError=G(e).message,this.saving=!1}}},store(){return this.save(()=>ep.store(this.createItem),`showCreateModal`)},update(){return this.save(()=>ep.update(this.activeItem.id,this.activeItem),`showEditModal`)},updateStatus(){return this.save(()=>ep.updateStatus(this.activeItem.id,this.activeItem.status,this.reason),`showStatusModal`)}})),T.data(`catalogFilters`,e=>({f:{search:``,category:``,status:``,...e},submit(){V(`/catalogos`,this.f)}}));var ph=`w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]`,mh=`block text-xs font-medium text-[#C5CED8] mb-1`;function hh(e,t,n,r,i,a=`max-w-xl`){return J`<div x-show="${e}" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <div @click.outside="${e} = false" class="${X(`bg-[#11151B] border border-[#263241] rounded-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5`,a)}">
            <div class="flex items-center justify-between border-b border-[#263241] pb-3.5">
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                    <span class="${X(`material-symbols-outlined text-[20px]`,n)}">${t}</span>
                    <span>${r}</span>
                </h3>
                <button type="button" @click="${e} = false" class="text-[#707B8A] hover:text-white"><span class="material-symbols-outlined text-[20px]">close</span></button>
            </div>
            <div x-show="modalError" x-cloak class="p-3 rounded-xl bg-[#45121A]/80 border border-[#D83B52]/40 text-[#FCA5A5] text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-[#D83B52]">error</span><span x-text="modalError"></span>
            </div>
            ${i}
        </div>
    </div>`}function gh(e,t){return J`
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div><label class="${mh}">${t?`Nombre del Subsistema / Recurso *`:`Nombre *`}</label>
                <input type="text" x-model="${e}.name" required maxlength="100" placeholder="${t?`Ej: Megafonía PAS, Cámaras Perimétricas...`:``}" class="${ph}"></div>
            <div><label class="${mh}">${t?`Código de Identificación`:`Código`}</label>
                <input type="text" x-model="${e}.code" maxlength="50" placeholder="${t?`Ej: INF-PAS, INF-CCTV-02...`:``}" class="${ph}"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div><label class="${mh}">${t?`Estado Operativo Inicial *`:`Estado Operacional *`}</label>
                <select x-model="${e}.status" required class="${ph}">
                    <option value="ACTIVO">${t?`🟢 ACTIVO (Operacional)`:`🟢 ACTIVO`}</option>
                    <option value="FUERA DE SERVICIO">${t?`🔴 FUERA DE SERVICIO (Falla / Indisponible)`:`🔴 FUERA DE SERVICIO`}</option>
                    <option value="INACTIVO">${t?`⚪ INACTIVO (Mantenimiento / Pausado)`:`⚪ INACTIVO`}</option>
                </select></div>
            <div><label class="${mh}">${t?`Ubicación / Cobertura Física`:`Ubicación / Cobertura`}</label>
                <input type="text" x-model="${e}.location" maxlength="255" placeholder="${t?`Ej: Terminal de Pasajeros T1, Pistas, Torre...`:``}" class="${ph}"></div>
        </div>
        <div><label class="${mh}">${t?`Descripción General`:`Descripción`}</label>
            <textarea x-model="${e}.description" rows="2" maxlength="1000" placeholder="${t?`Descripción operativa del subsistema y componentes...`:``}" class="${ph}"></textarea></div>
        <div><label class="${mh}">${t?`Especificaciones Técnicas / Topología`:`Especificaciones Técnicas`}</label>
            <textarea x-model="${e}.technical_specs" rows="2" maxlength="2000" placeholder="${t?`Fabricante, modelos, protocolos IP, switches de interconexión...`:``}" class="${ph}"></textarea></div>
        <div class="grid grid-cols-2 gap-3.5">
            <div><label class="${mh}">Icono Material</label>
                <input type="text" x-model="${e}.icon" maxlength="50" placeholder="videocam, fingerprint, tv, radio, hub..." class="${ph}"></div>
            <div><label class="${mh}">${t?`Color Institucional`:`Color Hex`}</label>
                <input type="text" x-model="${e}.color" maxlength="20" placeholder="#06B6D4, #8B5CF6, #3D82C6..." class="${ph}"></div>
        </div>`}function _h(e,t){return J`<div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
        <button @click="${e} = false" type="button" class="px-4 py-2 bg-[#1E293B] hover:bg-[#263241] text-[#A8B0BC] text-xs font-semibold rounded-xl transition-colors">Cancelar</button>
        <button type="submit" :disabled="saving" class="px-5 py-2 bg-[#3D82C6] hover:bg-[#2A65A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all disabled:opacity-60">${t}</button>
    </div>`}function vh(e){return e===`ACTIVO`?J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#063C2E] text-[#10B981] border border-[#10B981]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span><span>ACTIVO</span></span>`:e===`FUERA DE SERVICIO`?J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#45121A] text-[#F87171] border border-[#D83B52]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#D83B52]"></span><span>FUERA DE SERVICIO</span></span>`:J`<span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#1F2732] text-[#94A3B8] border border-[#475569]/30"><span class="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"></span><span>INACTIVO</span></span>`}var yh={text:[`text-[#10B981]`,`text-[#E0A21A]`,`text-[#D83B52]`],bg:[`bg-[#10B981]`,`bg-[#E0A21A]`,`bg-[#D83B52]`]},bh=(e,t)=>yh[t][e>=90?0:e>=70?1:2],xh={name:`catalogs.index`,title:`Catálogos`,async render({query:e}){let t={};[`search`,`category`,`status`].forEach(n=>{e[n]&&(t[n]=e[n])});let n=await ep.data(t,e.page||1),r=bf(),i=238.76,a=0;return J`<div x-data="catalogsPage" class="min-h-screen bg-brand-canvas text-[#F2F5F8] p-4 lg:p-6 space-y-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#263241] pb-5">
                <div>
                    <nav class="flex items-center gap-2 text-xs font-mono text-[#707B8A] mb-1.5" aria-label="Breadcrumb">
                        <a href="#/dashboard" class="hover:text-[#3D82C6] transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">home</span><span>Inicio</span></a>
                        <span>/</span><span class="text-[#A8B0BC]">Infraestructura</span><span>/</span><span class="text-[#3D82C6] font-semibold">Catálogos Tecnológicos</span>
                    </nav>
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-[#0E2D56] border border-[#164A8A]/50 flex items-center justify-center text-[#93C5FD]"><span class="material-symbols-outlined text-[24px]">layers</span></div>
                        <div>
                            <h1 class="text-xl lg:text-2xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2.5">
                                Catálogos e Infraestructura Tecnológica
                                <span class="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#16273B] text-[#93C5FD] border border-[#234269]">AIFA-GTS</span>
                            </h1>
                            <p class="text-xs text-[#8D98A8] mt-0.5">Inventario maestro, disponibilidad operacional y gestión de subsistemas de seguridad y periféricos.</p>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    ${n.can_manage?J`<button @click="openCreate()" type="button" class="px-4 py-2.5 rounded-xl bg-[#3D82C6] hover:bg-[#2A65A0] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95">
                            <span class="material-symbols-outlined text-[18px]">add_circle</span><span>Alta de Infraestructura</span></button>`:J`<div class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#151D28] border border-[#263241] text-xs text-[#8D98A8]">
                            <span class="material-symbols-outlined text-[16px] text-[#3D82C6]">visibility</span><span>Modo Consulta (Solo Lectura)</span></div>`}
                </div>
            </div>

            ${r.success?J`<div class="p-3.5 rounded-xl bg-[#063C2E]/80 border border-[#10B981]/40 text-[#6EE7B7] text-xs flex items-center justify-between">
                    <div class="flex items-center gap-2.5"><span class="material-symbols-outlined text-[18px] text-[#10B981]">check_circle</span><span>${r.success}</span></div>
                    <button type="button" onclick="this.parentElement.remove()" class="text-[#6EE7B7] hover:text-white"><span class="material-symbols-outlined text-[16px]">close</span></button>
                </div>`:``}

            <div class="grid grid-cols-2 md:grid-cols-5 gap-3.5">
                ${[[`Total Infraestructura`,`bg-[#16273B] text-[#93C5FD]`,`domain`,n.total_infrastructure,`text-white`,`subsistemas`],[`Activos Operacionales`,`bg-[#063C2E] text-[#10B981]`,`check_circle`,n.active_infrastructure,`text-[#10B981]`,`en línea`],[`Fuera de Servicio`,`bg-[#45121A] text-[#D83B52]`,`warning`,n.out_of_service,`text-[#D83B52]`,`críticos`],[`Inactivos / Mant.`,`bg-[#1F2732] text-[#94A3B8]`,`pause_circle`,n.inactive_infrastructure,`text-[#94A3B8]`,`pausados`]].map(([e,t,n,r,i,a])=>J`<div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#8D98A8] font-medium">${e}</span>
                        <div class="${X(`w-8 h-8 rounded-lg flex items-center justify-center`,t)}"><span class="material-symbols-outlined text-[18px]">${n}</span></div>
                    </div>
                    <div class="mt-2 flex items-baseline gap-2"><span class="${X(`text-2xl font-bold font-mono`,i)}">${r}</span><span class="text-[11px] text-[#707B8A]">${a}</span></div>
                </div>`)}
                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between shadow-sm col-span-2 md:col-span-1">
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-[#8D98A8] font-medium">Disponibilidad Global</span>
                        <div class="w-8 h-8 rounded-lg bg-[#0E2D56] flex items-center justify-center text-[#06B6D4]"><span class="material-symbols-outlined text-[18px]">speed</span></div>
                    </div>
                    <div class="mt-2 flex items-baseline gap-2">
                        <span class="${X(`text-2xl font-bold font-mono`,n.availability_rate>=80?`text-[#10B981]`:n.availability_rate>=50?`text-[#E0A21A]`:`text-[#D83B52]`)}">${n.availability_rate}%</span>
                        <span class="text-[11px] text-[#707B8A]">Disponibilidad estimada</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#3D82C6]">pie_chart</span><span>Distribución por Categoría</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Inventario Base</span>
                    </div>
                    <div class="flex items-center justify-between gap-3 flex-1 min-h-[130px]">
                        <div class="relative w-28 h-28 shrink-0 flex items-center justify-center">
                            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
                                <circle cx="50" cy="50" r="38" fill="none" stroke="#1F2937" stroke-width="12" />
                                ${n.distribution.map(e=>{let t=e.percentage/100*i,n=J`<circle cx="50" cy="50" r="38" fill="none" stroke="${e.color}" stroke-width="12" stroke-dasharray="${t} ${i}" stroke-dashoffset="-${a}" />`;return a+=t,n})}
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span class="font-mono text-base font-bold text-white leading-none">${n.total_infrastructure}</span>
                                <span class="text-[9px] text-[#707B8A] mt-0.5">Activos</span>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1.5 text-[11px] min-w-0 flex-1">
                            ${n.distribution.map(e=>J`<div class="flex items-center justify-between text-xs">
                                <span class="flex items-center gap-2 text-[#DDE3EA] truncate"><span class="w-2 h-2 rounded-full shrink-0" style="background-color: ${e.color}"></span><span class="truncate">${e.name}</span></span>
                                <span class="font-mono text-[#8D98A8] shrink-0 ml-1">${e.percentage}%</span>
                            </div>`)}
                        </div>
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#10B981]">health_and_safety</span><span>Salud Operativa del Parque</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Disponibilidad</span>
                    </div>
                    <div class="space-y-3 flex-1 flex flex-col justify-center">
                        ${n.status_breakdown.map(e=>J`<div>
                            <div class="flex items-center justify-between text-xs mb-1">
                                <span class="text-[#DDE3EA] flex items-center gap-1.5"><span class="w-2 h-2 rounded-full" style="background-color: ${e.color}"></span><span>${e.label}</span></span>
                                <span class="font-mono text-[#8D98A8]"><strong class="text-white">${e.count}</strong> (${e.percentage}%)</span>
                            </div>
                            <div class="w-full bg-[#1E293B] rounded-full h-2.5 overflow-hidden"><div class="h-full rounded-full transition-all duration-500" style="width: ${e.percentage}%; background-color: ${e.color};"></div></div>
                        </div>`)}
                    </div>
                </div>

                <div class="bg-[#11151B] border border-[#263241] rounded-xl p-4 flex flex-col justify-between">
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xs font-bold text-white flex items-center gap-2"><span class="material-symbols-outlined text-[17px] text-[#E0A21A]">build_circle</span><span>Incidencias por Infraestructura</span></h3>
                        <span class="text-[10px] text-[#707B8A] font-mono">Histórico vs Activas</span>
                    </div>
                    <div class="space-y-2 flex-1 flex flex-col justify-center text-xs">
                        ${n.incidents_by_infrastructure.length?n.incidents_by_infrastructure.map(e=>{let t=e.total>0?e.active/e.total*100:0;return J`<div>
                                    <div class="flex items-center justify-between text-[11px] mb-1">
                                        <span class="text-[#DDE3EA] truncate max-w-[140px]">${e.name}</span>
                                        <span class="font-mono text-[#707B8A]"><span class="text-[#D83B52] font-semibold">${e.active} activas</span> / <span>${e.total} total</span></span>
                                    </div>
                                    <div class="w-full bg-[#1E293B] rounded-full h-2 overflow-hidden flex">
                                        <div class="bg-[#D83B52] h-full" style="width: ${t}%"></div>
                                        <div class="bg-[#10B981]/70 h-full" style="width: ${100-t}%"></div>
                                    </div>
                                </div>`}):J`<div class="text-center text-[#707B8A] py-6 text-xs">Sin datos registrados</div>`}
                    </div>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl p-3.5">
                <form x-data="catalogFilters(${Y(t)})" @submit.prevent="submit()" class="flex flex-col md:flex-row items-center gap-3" autocomplete="off">
                    <div class="relative flex-1 w-full">
                        <span class="material-symbols-outlined absolute left-3 top-2.5 text-[18px] text-[#707B8A]">search</span>
                        <input type="text" x-model="f.search" placeholder="Buscar por código, nombre, ubicación o especificación técnica..." class="w-full pl-9 pr-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] transition-colors">
                    </div>
                    <div class="w-full md:w-56">
                        <select x-model="f.category" class="w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white focus:outline-none focus:border-[#3D82C6] transition-colors">
                            <option value="">Todos los subsistemas</option>
                            ${n.categories_list.map(e=>J`<option value="${e.slug}" ${t.category===e.slug?`selected`:``}>${e.name}</option>`)}
                        </select>
                    </div>
                    <div class="w-full md:w-48">
                        <select x-model="f.status" class="w-full px-3 py-2 bg-[#161F2C] border border-[#263241] rounded-xl text-xs text-white focus:outline-none focus:border-[#3D82C6] transition-colors">
                            <option value="">Todos los estados</option>
                            <option value="ACTIVO">🟢 ACTIVO</option>
                            <option value="FUERA DE SERVICIO">🔴 FUERA DE SERVICIO</option>
                            <option value="INACTIVO">⚪ INACTIVO / MANT.</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2 w-full md:w-auto">
                        <button type="submit" class="w-full md:w-auto px-4 py-2 bg-[#1E293B] hover:bg-[#2A3749] text-[#F2F5F8] text-xs font-semibold rounded-xl border border-[#334155] transition-colors flex items-center justify-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px]">filter_alt</span><span>Filtrar</span>
                        </button>
                        ${Object.keys(t).length?J`<a href="#/catalogos" class="px-3 py-2 bg-[#161F2C] hover:bg-[#1E2732] text-[#8D98A8] hover:text-white text-xs rounded-xl border border-[#263241] transition-colors flex items-center justify-center" title="Limpiar filtros"><span class="material-symbols-outlined text-[16px]">clear_all</span></a>`:``}
                    </div>
                </form>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="bg-[#161F2C] border-b border-[#263241] text-[#8D98A8] font-mono uppercase text-[10px] tracking-wider">
                                <th class="py-3 px-4">Código</th>
                                <th class="py-3 px-4">Subsistema / Infraestructura</th>
                                <th class="py-3 px-4">Cobertura / Ubicación</th>
                                <th class="py-3 px-4 text-center">Incidencias</th>
                                <th class="py-3 px-4 text-center">Disponibilidad</th>
                                <th class="py-3 px-4 text-center">Estado</th>
                                <th class="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1D2533]">
                            ${n.items.length?n.items.map(e=>{let t=e.code||`INF-${String(e.slug).toUpperCase()}`,r={...e,code:t,availability:e.availability_percentage},i=e.availability_percentage;return J`<tr class="hover:bg-[#151D28]/60 transition-colors">
                                        <td class="py-3 px-4 font-mono font-bold text-[#3D82C6] whitespace-nowrap">${t}</td>
                                        <td class="py-3 px-4">
                                            <div class="flex items-center gap-2.5">
                                                <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style="background-color: ${e.color}22; border: 1px solid ${e.color}44; color: ${e.color};">
                                                    <span class="material-symbols-outlined text-[16px]">${e.icon||`hub`}</span>
                                                </div>
                                                <div>
                                                    <div class="font-semibold text-white">${e.name}</div>
                                                    <div class="text-[11px] text-[#707B8A] truncate max-w-xs">${e.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-[#C5CED8]">
                                            <div class="flex items-center gap-1.5"><span class="material-symbols-outlined text-[14px] text-[#707B8A]">location_on</span><span class="truncate max-w-[200px]">${e.location||`Aeropuerto General (Lado Aire / Lado Tierra)`}</span></div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <div class="inline-flex items-center gap-1.5">
                                                <span class="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#1F2937] text-[#9CA3AF] border border-[#374151]">${e.incidents_count} total</span>
                                                ${e.active_incidents_count>0?J`<span class="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#45121A] text-[#F87171] border border-[#7F1D1D]">${e.active_incidents_count} activas</span>`:``}
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">
                                            <div class="inline-flex flex-col items-center">
                                                <span class="${X(`font-mono font-bold text-xs`,bh(i,`text`))}">${i}%</span>
                                                <div class="w-16 bg-[#1F2937] rounded-full h-1.5 mt-1 overflow-hidden"><div class="${X(`h-full rounded-full`,bh(i,`bg`))}" style="width: ${i}%"></div></div>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center whitespace-nowrap">${vh(e.status)}</td>
                                        <td class="py-3 px-4 text-right whitespace-nowrap">
                                            <div class="inline-flex items-center gap-1.5">
                                                <button @click="open('showViewModal', ${Y(r)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#A8B0BC] hover:text-white border border-[#263241] transition-colors" title="Ver Ficha Técnica">
                                                    <span class="material-symbols-outlined text-[16px]">visibility</span></button>
                                                ${n.can_manage?J`<button @click="open('showEditModal', ${Y(r)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#3D82C6] hover:text-[#93C5FD] border border-[#263241] transition-colors" title="Editar Registro">
                                                        <span class="material-symbols-outlined text-[16px]">edit</span></button>
                                                    <button @click="open('showStatusModal', ${Y(r)})" type="button" class="p-1.5 rounded-lg bg-[#161F2C] hover:bg-[#1E293B] text-[#E0A21A] hover:text-[#FCD34D] border border-[#263241] transition-colors" title="Dar de Baja / Cambiar Estado Operacional">
                                                        <span class="material-symbols-outlined text-[16px]">toggle_on</span></button>`:``}
                                            </div>
                                        </td>
                                    </tr>`}):J`<tr><td colspan="7" class="py-8 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center justify-center">
                                        <span class="material-symbols-outlined text-[36px] text-[#475569] mb-2">layers_clear</span>
                                        <p class="font-medium text-white text-sm">No se encontraron recursos de infraestructura</p>
                                        <p class="text-xs text-[#707B8A] mt-1">Pruebe ajustando los filtros de búsqueda o categoría.</p>
                                    </div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${n.meta.last_page>1?J`<div class="p-3.5 border-t border-[#263241] bg-[#161F2C]">${Kf(n.meta,`/catalogos`,e)}</div>`:``}
            </div>

            ${n.can_manage?J`
                ${hh(`showCreateModal`,`add_circle`,`text-[#3D82C6]`,`Dar de Alta Recurso de Infraestructura`,J`<form @submit.prevent="store()" class="space-y-4" autocomplete="off">
                    ${gh(`createItem`,!0)}
                    ${_h(`showCreateModal`,`Guardar en Catálogo`)}
                </form>`)}
                ${hh(`showEditModal`,`edit`,`text-[#3D82C6]`,`Editar Ficha de Infraestructura`,J`<form @submit.prevent="update()" class="space-y-4" autocomplete="off">
                    ${gh(`activeItem`,!1)}
                    ${_h(`showEditModal`,`Actualizar Registro`)}
                </form>`)}
                ${hh(`showStatusModal`,`toggle_on`,`text-[#E0A21A]`,`Gestionar Estado Operacional`,J`
                    <div class="p-3 rounded-xl bg-[#16273B] border border-[#234269] text-xs text-[#93C5FD]">
                        <div class="font-bold mb-1" x-text="activeItem.code + ' — ' + activeItem.name"></div>
                        <p class="text-[11px] text-[#A8B0BC]">ℹ️ <strong>Nota de Seguridad Operativa:</strong> "Dar de baja" o poner fuera de servicio no elimina el registro físico de la base de datos, preservando la trazabilidad pericial e histórico de tickets.</p>
                    </div>
                    <form @submit.prevent="updateStatus()" class="space-y-4">
                        <div>
                            <label class="block text-xs font-medium text-[#C5CED8] mb-1.5">Nuevo Estado *</label>
                            <div class="space-y-2">
                                ${[[`ACTIVO`,`text-[#10B981]`,`🟢 ACTIVO`,`Operativo y disponible para el servicio regular en AIFA.`],[`FUERA DE SERVICIO`,`text-[#D83B52]`,`🔴 FUERA DE SERVICIO`,`Indisponible por falla crítica o degradación estructural.`],[`INACTIVO`,`text-[#94A3B8]`,`⚪ INACTIVO (Dar de Baja)`,`Retirado temporalmente de operación por ventana de mantenimiento.`]].map(([e,t,n,r])=>J`<label class="flex items-center gap-3 p-2.5 rounded-xl border border-[#263241] bg-[#161F2C] hover:bg-[#1E2732] cursor-pointer">
                                    <input type="radio" value="${e}" x-model="activeItem.status" class="${X(t,`focus:ring-0`)}">
                                    <div><div class="${X(`font-semibold text-xs`,t)}">${n}</div><div class="text-[11px] text-[#707B8A]">${r}</div></div>
                                </label>`)}
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-[#C5CED8] mb-1">Motivo / Bitácora del Cambio (Opcional)</label>
                            <input type="text" x-model="reason" maxlength="255" placeholder="Ej: Mantenimiento correctivo mayor programado..." class="${ph}">
                        </div>
                        ${_h(`showStatusModal`,`Aplicar Cambio`)}
                    </form>`,`max-w-md`)}`:``}

            <div x-show="showViewModal" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
                <div @click.outside="showViewModal = false" class="bg-[#11151B] border border-[#263241] rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
                    <div class="flex items-center justify-between border-b border-[#263241] pb-3">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="'background-color: ' + activeItem.color + '22; color: ' + activeItem.color + '; border: 1px solid ' + activeItem.color + '44;'">
                                <span class="material-symbols-outlined text-[18px]" x-text="activeItem.icon || 'hub'"></span>
                            </div>
                            <div>
                                <h3 class="text-base font-bold text-white" x-text="activeItem.name"></h3>
                                <span class="text-[11px] font-mono text-[#3D82C6]" x-text="activeItem.code"></span>
                            </div>
                        </div>
                        <button type="button" @click="showViewModal = false" class="text-[#707B8A] hover:text-white"><span class="material-symbols-outlined text-[20px]">close</span></button>
                    </div>
                    <div class="space-y-3.5 text-xs">
                        <div class="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#161F2C] border border-[#263241]">
                            <div>
                                <span class="text-[#707B8A] text-[10px] block uppercase font-mono">Estado Operacional</span>
                                <span class="font-bold inline-block mt-0.5" :class="activeItem.status === 'ACTIVO' ? 'text-[#10B981]' : (activeItem.status === 'FUERA DE SERVICIO' ? 'text-[#D83B52]' : 'text-[#94A3B8]')" x-text="activeItem.status"></span>
                            </div>
                            <div>
                                <span class="text-[#707B8A] text-[10px] block uppercase font-mono">Disponibilidad Estimada</span>
                                <span class="font-mono font-bold inline-block mt-0.5" :class="activeItem.availability >= 90 ? 'text-[#10B981]' : 'text-[#E0A21A]'" x-text="activeItem.availability + '%'"></span>
                            </div>
                        </div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Ubicación y Cobertura</span><p class="text-white mt-0.5" x-text="activeItem.location || 'Todo el complejo aeroportuario AIFA'"></p></div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Descripción Operativa</span><p class="text-[#C5CED8] mt-0.5 leading-relaxed" x-text="activeItem.description || 'Sin descripción detallada'"></p></div>
                        <div><span class="text-[#707B8A] text-[10px] uppercase font-mono block">Especificaciones Técnicas</span>
                            <div class="p-2.5 rounded-xl bg-[#0F1620] border border-[#263241] text-[#93C5FD] font-mono text-[11px] mt-0.5" x-text="activeItem.technical_specs || 'Equipos IP industriales estándar AIFA.'"></div></div>
                        <div class="flex items-center justify-between p-3 rounded-xl bg-[#161F2C] border border-[#263241]">
                            <span class="text-[#C5CED8]">Incidencias Registradas:</span>
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-white font-bold" x-text="activeItem.incidents_count + ' totales'"></span>
                                <template x-if="activeItem.active_incidents_count > 0"><span class="font-mono text-[#F87171] font-semibold" x-text="'(' + activeItem.active_incidents_count + ' activas)'"></span></template>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end pt-3 border-t border-[#263241]">
                        <button @click="showViewModal = false" type="button" class="px-5 py-2 bg-[#1E293B] hover:bg-[#263241] text-white text-xs font-semibold rounded-xl transition-colors">Cerrar Ficha</button>
                    </div>
                </div>
            </div>
        </div>`}};T.data(`usersPage`,e=>({showCreateModal:!1,showEditModal:!1,showDeleteModal:!1,createUser:{name:``,username:``,role_id:e,badge_number:``,password:``},editUser:{id:null,name:``,username:``,email:``,role_id:``,badge_number:``,password:``},deleteUser:{id:null,name:``},saving:!1,modalError:``,pageError:``,openCreate(){this.createUser={name:``,username:``,role_id:e,badge_number:``,password:``},this.modalError=``,this.showCreateModal=!0},openEdit(e){this.editUser={...e,password:``},this.modalError=``,this.showEditModal=!0},openDelete(e,t){this.deleteUser={id:e,name:t},this.modalError=``,this.showDeleteModal=!0},async run(e,t=null){if(!this.saving){this.saving=!0,this.modalError=``,this.pageError=``;try{q(`status_message`,(await e()).message),t&&(this[t]=!1),Zd()}catch(e){t?this.modalError=G(e).message:this.pageError=G(e).message,this.saving=!1}}},store(){return this.run(()=>tp.store(this.createUser),`showCreateModal`)},update(){return this.run(()=>tp.update(this.editUser),`showEditModal`)},toggle(e){return this.run(()=>tp.toggleStatus(e))},destroy(){return this.run(()=>tp.destroy(this.deleteUser.id),`showDeleteModal`)}})),T.data(`userFilters`,e=>({f:{search:``,role_id:``,is_active:``,...e},submit(){V(`/configuracion/usuarios`,this.f)}}));var Sh=`w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]`,Ch=`block text-xs font-semibold text-[#8D98A8] mb-1`;function wh(e){let t=(e,t,n)=>J`<span class="${X(`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border`,e)}">
        <span class="material-symbols-outlined text-[13px]">${t}</span><span>${n}</span></span>`;if(e.is_admin)return t(`bg-purple-500/10 text-purple-400 border-purple-500/20`,`shield_person`,`ADMINISTRADOR`);if(e.is_gts)return t(`bg-cyan-500/10 text-cyan-400 border-cyan-500/20`,`build`,`TÉCNICO GTS`);if(e.is_apoc_cco)return t(`bg-amber-500/10 text-amber-400 border-amber-500/20`,`desktop_windows`,`APOC-CCO`);if(e.is_apoc_csa)return t(`bg-orange-500/10 text-orange-400 border-orange-500/20`,`desktop_windows`,`APOC-CSA`);if(e.is_apoc)return t(`bg-amber-500/10 text-amber-400 border-amber-500/20`,`desktop_windows`,`OPERADOR APOC`);let n=e.role;return t(n?.badge_bg?`${n.badge_bg} ${n.badge_text} ${n.badge_border}`:`bg-slate-500/10 text-slate-400 border-slate-500/20`,`badge`,n?.name??`USUARIO`)}function Th(e,t,n,r,i=`border-[#263241]`,a=`sm:max-w-md`){return J`<div x-show="${e}" x-cloak class="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" @keydown.escape.window="${e} = false">
        <div class="flex items-center justify-center min-h-screen px-4 py-8">
            <div x-show="${e}" @click="${e} = false" class="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"></div>
            <div x-show="${e}" class="${X(`relative bg-[#11151B] border rounded-2xl text-left overflow-hidden shadow-2xl w-full p-6`,i,a)}">
                ${t?J`<div class="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                        <h3 class="text-base font-bold text-[#F2F5F8] flex items-center gap-2"><span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${n}</span><span>${t}</span></h3>
                        <button type="button" @click="${e} = false" class="text-[#707B8A] hover:text-[#DDE3EA]"><span class="material-symbols-outlined text-[18px]">close</span></button>
                    </div>`:``}
                <div x-show="modalError" x-cloak class="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <span class="material-symbols-outlined text-[18px] text-rose-400">error</span><span x-text="modalError"></span>
                </div>
                ${r}
            </div>
        </div>
    </div>`}var Eh={name:`users.index`,title:`Usuarios`,async render({query:e}){let t={};[`search`,`role_id`,`is_active`].forEach(n=>{e[n]!==void 0&&e[n]!==``&&(t[n]=e[n])});let n=await tp.data(t,e.page||1),r=bf(),i=n.metrics,a=n.roles.map(e=>J`<option value="${e.id}">${e.name}</option>`);return J`<div x-data="usersPage(${Y(String(n.roles[0]?.id??``))})" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${qf(`success`,r.status_message)}
            <template x-if="pageError"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="pageError"></span></div>
                <button type="button" @click="pageError = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>

            ${Jf(`users`,{showUsers:!0,showRoles:zf()})}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/perfil" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Configuración</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Usuarios</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Gestión de Usuarios y Cuadrillas</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#3D82C6] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">admin_panel_settings</span><span>Control de Cuentas</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Administración de personal operativo APOC, especialistas técnicos GTS y administradores del sistema bajo norma aeronáutica.</p>
                </div>
                ${n.can_create?J`<div class="flex items-center gap-3 self-start md:self-auto">
                        <button type="button" @click="openCreate()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all group">
                            <span class="material-symbols-outlined text-[18px]">person_add</span><span>Registrar Usuario</span>
                        </button>
                    </div>`:``}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                ${[[`Total Usuarios`,i.total,`text-[#F2F5F8]`],[`Activos`,i.active,`text-emerald-400`],[`Inactivos`,i.inactive,`text-[#8D98A8]`],[`GTS Técnicos`,i.gts,`text-cyan-400`]].map(([e,t,n])=>J`<div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">${e}</span>
                    <span class="${X(`text-xl font-bold font-mono mt-1`,n)}">${t}</span>
                </div>`)}
                <div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">APOC (CCO / CSA)</span>
                    <span class="text-xl font-bold font-mono text-amber-400 mt-1">${i.apoc_cco} <span class="text-[11px] text-[#8D98A8] font-sans">CCO</span> · ${i.apoc_csa} <span class="text-[11px] text-[#8D98A8] font-sans">CSA</span></span>
                </div>
                <div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">Administradores</span>
                    <span class="text-xl font-bold font-mono text-purple-400 mt-1">${i.admin}</span>
                </div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-2xl shadow-sm">
                <form x-data="userFilters(${Y(t)})" @submit.prevent="submit()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center" autocomplete="off">
                    <div class="lg:col-span-5 relative">
                        <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707B8A] text-[18px] pointer-events-none">search</span>
                        <input type="text" x-model="f.search" placeholder="Buscar por nombre, email o placa..." class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#DDE3EA] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6]">
                    </div>
                    <div class="lg:col-span-3">
                        <select x-model="f.role_id" class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Todos los roles</option>
                            ${n.roles.map(e=>J`<option value="${e.id}" ${String(t.role_id)===String(e.id)?`selected`:``}>${e.name}</option>`)}
                        </select>
                    </div>
                    <div class="lg:col-span-2">
                        <select x-model="f.is_active" class="w-full bg-[#0B0F14] border border-[#263241] rounded-xl px-3 py-2 text-xs text-[#DDE3EA] focus:outline-none focus:border-[#3D82C6]">
                            <option value="">Estado: Todos</option>
                            <option value="1">Solo Activos</option>
                            <option value="0">Solo Inactivos</option>
                        </select>
                    </div>
                    <div class="lg:col-span-2 flex items-center gap-2">
                        <button type="submit" class="flex-1 px-3 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold transition-colors text-center">Filtrar</button>
                        ${Object.keys(t).length?J`<a href="#/configuracion/usuarios" class="p-2 bg-[#1E293B] hover:bg-[#334155] text-[#707B8A] hover:text-[#DDE3EA] rounded-xl transition-colors" title="Limpiar filtros"><span class="material-symbols-outlined text-[18px]">filter_alt_off</span></a>`:``}
                    </div>
                </form>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div class="p-4 bg-[#0B0F14] border-b border-[#263241] flex items-center justify-between text-xs">
                    <span class="font-bold text-[#F2F5F8] flex items-center gap-2"><span class="material-symbols-outlined text-[18px] text-[#3D82C6]">badge</span><span>Usuarios Registrados (${n.meta.total})</span></span>
                    <span class="text-[#707B8A] text-[11px]">Control de acceso basado en roles RBAC</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#101923] border-b border-[#263241] text-[#8D98A8] text-[11px] font-semibold uppercase tracking-wider">
                                <th class="py-3 px-4">Usuario</th><th class="py-3 px-4">Placa / Credencial</th><th class="py-3 px-4">Rol Institucional</th>
                                <th class="py-3 px-4 text-center">Estado</th><th class="py-3 px-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1F2937] text-xs text-[#DDE3EA]">
                            ${n.users.length?n.users.map(e=>{let t=e.id===n.current_user_id,r={id:e.id,name:e.name,username:e.username,email:e.email??``,role_id:String(e.role_id??``),badge_number:e.badge_number??``};return J`<tr class="${X(`hover:bg-[#151B23] transition-colors`,!e.is_active&&`opacity-60 bg-black/20`)}">
                                        <td class="py-3.5 px-4 whitespace-nowrap">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full bg-[#1E293B] border border-[#263241] flex items-center justify-center font-bold text-xs text-[#3D82C6] shrink-0">${e.name.slice(0,1)}</div>
                                                <div class="flex flex-col">
                                                    <span class="font-bold text-[#F2F5F8] flex items-center gap-1.5"><span>${e.name}</span>${t?J`<span class="px-1.5 py-0.2 bg-[#3D82C6]/20 text-[#3D82C6] rounded text-[9px] font-semibold">TÚ</span>`:``}</span>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-[11px] font-mono text-[#3D82C6]">@<span>${e.username}</span></span>
                                                        ${e.email?J`<span class="text-[10px] text-[#707B8A]">(${e.email})</span>`:``}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-[#A8B0BC]">${e.badge_number||`—`}</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap">${wh(e)}</td>
                                        <td class="py-3.5 px-4 whitespace-nowrap text-center">
                                            ${e.is_active?J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ACTIVO</span>`:J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/20">INACTIVO</span>`}
                                        </td>
                                        <td class="py-3.5 px-4 whitespace-nowrap text-center">
                                            <div class="flex items-center justify-center gap-1.5">
                                                ${n.can_edit?J`<button type="button" @click="openEdit(${Y(r)})" class="p-1.5 text-[#8D98A8] hover:text-[#F2F5F8] hover:bg-[#1E293B] rounded-lg transition-colors" title="Editar información"><span class="material-symbols-outlined text-[16px]">edit</span></button>`:``}
                                                ${!t&&n.can_edit?J`<button type="button" @click="toggle(${e.id})" class="${X(`p-1.5 rounded-lg transition-colors`,e.is_active?`text-amber-400 hover:text-amber-200 hover:bg-amber-500/10`:`text-emerald-400 hover:text-emerald-200 hover:bg-emerald-500/10`)}" title="${e.is_active?`Desactivar cuenta`:`Activar cuenta`}">
                                                        <span class="material-symbols-outlined text-[16px]">${e.is_active?`block`:`check_circle`}</span></button>`:``}
                                                ${!t&&n.can_delete?J`<button type="button" @click="openDelete(${e.id}, ${Y(e.name)})" class="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Eliminar cuenta permanentemente"><span class="material-symbols-outlined text-[16px]">delete</span></button>`:``}
                                            </div>
                                        </td>
                                    </tr>`}):J`<tr><td colspan="5" class="py-8 text-center text-[#707B8A]">No se encontraron usuarios que coincidan con los filtros aplicados.</td></tr>`}
                        </tbody>
                    </table>
                </div>
                ${n.meta.last_page>1?J`<div class="p-4 bg-[#0B0F14] border-t border-[#263241]">${Kf(n.meta,`/configuracion/usuarios`,e)}</div>`:``}
            </div>

            ${Th(`showCreateModal`,`Alta de Usuario Institucional`,`person_add`,J`<form @submit.prevent="store()" class="mt-4 flex flex-col gap-4" autocomplete="off">
                <div><label class="${Ch}">Nombre Completo:</label><input type="text" x-model="createUser.name" required maxlength="255" placeholder="Ej. Ing. Juan Pérez" class="${Sh}"></div>
                <div><label class="${Ch}">Nombre de Usuario (Login):</label><input type="text" x-model="createUser.username" required maxlength="50" pattern="[a-zA-Z0-9._\\-]+" placeholder="ej. jperez" class="${Sh}"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${Ch}">Rol Asignado:</label><select x-model="createUser.role_id" required class="${Sh}">${a}</select></div>
                    <div><label class="${Ch}">Placa / Credencial:</label><input type="text" x-model="createUser.badge_number" maxlength="50" placeholder="Ej. GTS-312" class="${Sh}"></div>
                </div>
                <div><label class="${Ch}">Contraseña Inicial:</label><input type="password" x-model="createUser.password" required minlength="8" autocomplete="new-password" placeholder="Mínimo 8 caracteres" class="${Sh}"></div>
                <div class="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-[#1F2937]">
                    <button type="button" @click="showCreateModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-[#123A70] hover:bg-[#164A8A] text-white rounded-xl text-xs font-bold disabled:opacity-60">Guardar Usuario</button>
                </div>
            </form>`)}

            ${Th(`showEditModal`,`Editar Usuario`,`edit`,J`<form @submit.prevent="update()" class="mt-4 flex flex-col gap-4" autocomplete="off">
                <div><label class="${Ch}">Nombre Completo:</label><input type="text" x-model="editUser.name" required maxlength="255" class="${Sh}"></div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${Ch}">Nombre de Usuario (Login):</label><input type="text" x-model="editUser.username" required maxlength="50" pattern="[a-zA-Z0-9._\\-]+" class="${Sh}"></div>
                    <div><label class="${Ch}">Correo Institucional (Opcional):</label><input type="email" x-model="editUser.email" maxlength="255" class="${Sh}"></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div><label class="${Ch}">Rol Asignado:</label><select x-model="editUser.role_id" required class="${Sh}">${a}</select></div>
                    <div><label class="${Ch}">Placa / Credencial:</label><input type="text" x-model="editUser.badge_number" maxlength="50" class="${Sh}"></div>
                </div>
                <div><label class="${Ch}">Nueva Contraseña (Opcional):</label><input type="password" x-model="editUser.password" minlength="8" autocomplete="new-password" placeholder="Dejar en blanco para conservar actual" class="${Sh}"></div>
                <div class="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-[#1F2937]">
                    <button type="button" @click="showEditModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-[#3D82C6] hover:bg-[#316cb0] text-white rounded-xl text-xs font-bold disabled:opacity-60">Actualizar Usuario</button>
                </div>
            </form>`)}

            ${Th(`showDeleteModal`,null,null,J`<div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0"><span class="material-symbols-outlined text-[28px]">warning</span></div>
                    <div class="flex flex-col">
                        <h3 class="text-base font-bold text-[#F2F5F8]">Confirmar Eliminación Permanente de Cuenta</h3>
                        <p class="text-xs text-[#8D98A8] mt-1.5 leading-relaxed">¿Está seguro de que desea eliminar permanentemente al usuario <strong class="text-rose-400 font-bold" x-text="deleteUser.name"></strong>?</p>
                        <div class="mt-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/15 text-[11px] text-rose-300 leading-relaxed flex flex-col gap-1">
                            <span class="font-semibold text-rose-400 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">shield</span><span>Gestión segura de dependencias y auditoría OACI:</span></span>
                            <span>• La cuenta de usuario será purgada físicamente de PostgreSQL de manera definitiva.</span>
                            <span>• Las incidencias y registros históricos vinculados serán reasignados y documentados bajo la administración para resguardar la trazabilidad pericial.</span>
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#1F2937]">
                    <button type="button" @click="showDeleteModal = false" class="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] text-[#DDE3EA] rounded-xl text-xs font-semibold cursor-pointer">Cancelar</button>
                    <button type="button" @click="destroy()" :disabled="saving" class="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-900/30 transition-all cursor-pointer disabled:opacity-60">
                        <span class="material-symbols-outlined text-[16px]">delete_forever</span><span>Eliminar Cuenta Definitivamente</span>
                    </button>
                </div>`,`border-rose-500/30`,`sm:max-w-lg`)}
        </div>`}},Dh={purple:{label:`Púrpura (Admin)`,bg:`bg-purple-500/10`,text:`text-purple-400`,border:`border-purple-500/20`},cyan:{label:`Cian (GTS Técnico)`,bg:`bg-cyan-500/10`,text:`text-cyan-400`,border:`border-cyan-500/20`},amber:{label:`Ámbar (APOC-CCO)`,bg:`bg-amber-500/10`,text:`text-amber-400`,border:`border-amber-500/20`},orange:{label:`Naranja (APOC-CSA)`,bg:`bg-orange-500/10`,text:`text-orange-400`,border:`border-orange-500/20`},emerald:{label:`Esmeralda (Operaciones)`,bg:`bg-emerald-500/10`,text:`text-emerald-400`,border:`border-emerald-500/20`},blue:{label:`Azul (Comunicaciones)`,bg:`bg-blue-500/10`,text:`text-blue-400`,border:`border-blue-500/20`},rose:{label:`Rosa (Seguridad Crítica)`,bg:`bg-rose-500/10`,text:`text-rose-400`,border:`border-rose-500/20`},slate:{label:`Pizarra (Estándar)`,bg:`bg-slate-500/10`,text:`text-slate-400`,border:`border-slate-500/20`}};function Oh(e){return{bg:e?.badge_bg||`bg-slate-500/10`,text:e?.badge_text||`text-slate-400`,border:e?.badge_border||`border-slate-500/20`}}var kh=e=>e?.slug===`admin`,Ah={incidents:`Incidencias Operativas`,users:`Usuarios y Cuadrillas`,roles:`Roles y Permisos`,reports:`Reportes e Indicadores`,audit:`Auditoría y Seguridad`},jh={incidents:`confirmation_number`,users:`group`,roles:`admin_panel_settings`,reports:`bar_chart`,audit:`manage_history`,dashboard:`dashboard`};function Mh(e){return String(e||``).toLowerCase().normalize(`NFD`).replace(/[̀-ͯ]/g,``).replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``)}T.data(`rolesPage`,()=>({showCreateModal:!1,showEditModal:!1,showDeleteModal:!1,createRole:{name:``,slug:``,description:``,color:`emerald`,slugTouched:!1},editRole:{id:null,name:``,slug:``,description:``,color:`slate`,is_protected:!1},deleteRole:{id:null,name:``,usersCount:0},presets:Dh,saving:!1,modalError:``,search:``,generateSlug:Mh,openCreate(){this.createRole={name:``,slug:``,description:``,color:`emerald`,slugTouched:!1},this.modalError=``,this.showCreateModal=!0},openEdit(e){this.editRole={id:e.id,name:e.name,slug:e.slug,description:e.description||``,color:e.color||`slate`,is_protected:!!e.is_protected},this.modalError=``,this.showEditModal=!0},openDelete(e,t,n=0){this.deleteRole={id:e,name:t,usersCount:n},this.modalError=``,this.showDeleteModal=!0},async run(e,t,n=null){if(!this.saving){this.saving=!0,this.modalError=``;try{let r=await e();q(`status_message`,r.message),this[t]=!1,n?n(r):Zd()}catch(e){this.modalError=G(e).message,this.saving=!1}}},store(){return this.run(()=>np.store(this.createRole),`showCreateModal`,e=>V(`/configuracion/roles/${e.id}`))},update(){return this.run(()=>np.update(this.editRole),`showEditModal`)},destroy(){return this.run(()=>np.destroy(this.deleteRole.id),`showDeleteModal`)}}));var Nh=`px-3 py-2 bg-[#0D1117] border border-[#263241] rounded-xl text-xs text-[#F2F5F8] focus:outline-none focus:border-[#3D82C6]`;function Ph(e){return J`<div class="flex flex-col gap-2">
        <label class="font-semibold text-[#8D98A8]">Color e Insignia Táctica *</label>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <template x-for="(data, key) in presets" :key="key">
                <label :class="${e}.color === key ? 'border-[#3D82C6] bg-[#162232]' : 'border-[#263241] bg-[#0D1117] hover:bg-[#161D26]'" class="flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors">
                    <input type="radio" :value="key" x-model="${e}.color" class="hidden">
                    <span :class="data.bg + ' ' + data.text + ' border ' + data.border" class="w-3.5 h-3.5 rounded-full inline-block shrink-0"></span>
                    <span class="text-[11px] font-medium truncate" x-text="data.label.split(' ')[0]"></span>
                </label>
            </template>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0D1117] border border-[#263241] flex items-center justify-between mt-1">
            <span class="text-[11px] text-[#707B8A]">Vista previa del distintivo:</span>
            <span :class="presets[${e}.color]?.bg + ' ' + presets[${e}.color]?.text + ' border ' + presets[${e}.color]?.border" class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider" x-text="${e}.name || 'NUEVO ROL'"></span>
        </div>
    </div>`}function Fh(e,t,n,r,i=`border-[#263241]`,a=`max-w-lg`){return J`<div x-show="${e}" x-cloak class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div @click.outside="${e} = false" class="${X(`bg-[#11151B] border rounded-2xl w-full p-6 shadow-2xl flex flex-col gap-5 text-xs text-[#D6DCE4] max-h-[92vh] overflow-y-auto`,i,a)}">
            ${n?J`<div class="flex items-center justify-between border-b border-[#263241] pb-3">
                    <div class="flex items-center gap-2"><span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${t}</span><h2 class="text-base font-bold text-[#F2F5F8]">${n}</h2></div>
                    <button type="button" @click="${e} = false" class="text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[18px]">close</span></button>
                </div>`:``}
            <div x-show="modalError" x-cloak class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <span class="material-symbols-outlined text-[18px] text-rose-400">error</span><span x-text="modalError"></span>
            </div>
            ${r}
        </div>
    </div>`}var Ih={name:`roles.index`,title:`Roles y Permisos`,async render({query:e}){let t=await np.data(e.search),n=bf(),r=t.metrics;return J`<div x-data="rolesPage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${qf(`success`,n.status_message)}
            ${Jf(`roles`,{showUsers:Rf(),showRoles:!0})}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/perfil" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Configuración</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Roles</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">Gestión de Roles y Permisos</h1>
                        <span class="px-2.5 py-0.5 rounded bg-[#101923] text-[#A78BFA] font-mono text-xs font-semibold uppercase tracking-wider border border-[#263241] flex items-center gap-1.5">
                            <span class="material-symbols-outlined text-[14px]">shield</span><span>Matriz Dinámica</span>
                        </span>
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">Definición de perfiles operativos, capacidades granulares del sistema y alcances de interacción inter-rol (ver, atender y asignar).</p>
                </div>
                ${t.can_create?J`<div class="flex items-center gap-3 self-start md:self-auto">
                        <button type="button" @click="openCreate()" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all group">
                            <span class="material-symbols-outlined text-[18px]">add_moderator</span><span>Nuevo Rol</span>
                        </button>
                    </div>`:``}
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                ${[[`Total Roles`,r.total,`text-[#F2F5F8]`],[`Roles de Sistema`,r.protected,`text-cyan-400`],[`Roles Personalizados`,r.custom,`text-emerald-400`],[`Usuarios Asignados`,r.total_users,`text-purple-400`],[`Permisos Disponibles`,r.total_permissions,`text-amber-400`]].map(([e,t,n])=>J`<div class="bg-[#11151B] border border-[#263241] p-3 rounded-xl flex flex-col shadow-sm">
                    <span class="text-[10px] uppercase tracking-wider text-[#8D98A8] font-bold">${e}</span>
                    <span class="${X(`text-xl font-bold font-mono mt-1`,n)}">${t}</span>
                </div>`)}
            </div>

            <div class="bg-[#11151B] border border-[#263241] p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <form x-data="{ term: ${Y(e.search??``)} }" @submit.prevent="window.location.hash = '#/configuracion/roles' + (term ? '?search=' + encodeURIComponent(term) : '')" class="w-full sm:max-w-md relative flex items-center">
                    <span class="absolute left-3 text-[#707B8A] pointer-events-none"><span class="material-symbols-outlined text-[18px]">search</span></span>
                    <input type="text" x-model="term" placeholder="Buscar rol por nombre, slug o descripción..." class="w-full pl-9 pr-8 py-2 bg-[#0D1117] border border-[#263241] rounded-xl text-xs text-[#F2F5F8] placeholder-[#707B8A] focus:outline-none focus:border-[#3D82C6] transition-colors">
                    ${e.search?J`<a href="#/configuracion/roles" class="absolute right-2.5 text-[#707B8A] hover:text-[#F2F5F8]"><span class="material-symbols-outlined text-[16px]">close</span></a>`:``}
                </form>
                <div class="text-xs text-[#707B8A]">Mostrando <span class="font-bold text-[#F2F5F8]">${t.roles.length}</span> rol(es) configurado(s)</div>
            </div>

            <div class="bg-[#11151B] border border-[#263241] rounded-xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead class="bg-[#0D1117] text-[#8D98A8] uppercase tracking-wider text-[10px] border-b border-[#263241]">
                            <tr>
                                <th class="py-3 px-4 font-semibold">Rol / Identificador</th>
                                <th class="py-3 px-4 font-semibold text-center">Distintivo Táctico</th>
                                <th class="py-3 px-4 font-semibold text-center">Tipo</th>
                                <th class="py-3 px-4 font-semibold text-center">Usuarios</th>
                                <th class="py-3 px-4 font-semibold text-center">Permisos</th>
                                <th class="py-3 px-4 font-semibold text-center">Alcances</th>
                                <th class="py-3 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-[#1D2530] text-[#D6DCE4]">
                            ${t.roles.length?t.roles.map(e=>{let n=Oh(e);return J`<tr class="hover:bg-[#161D26] transition-colors">
                                        <td class="py-3 px-4">
                                            <div class="flex flex-col">
                                                <div class="flex items-center gap-2">
                                                    <span class="font-bold text-sm text-[#F2F5F8]">${e.name}</span>
                                                    <span class="font-mono text-[11px] text-[#707B8A] px-1.5 py-0.2 rounded bg-[#0D1117] border border-[#263241]">${e.slug}</span>
                                                </div>
                                                <p class="text-[11px] text-[#8D98A8] line-clamp-1 mt-0.5">${e.description||`Sin descripción registrada`}</p>
                                            </div>
                                        </td>
                                        <td class="py-3 px-4 text-center"><span class="${X(`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider border`,n.bg,n.text,n.border)}">${e.name}</span></td>
                                        <td class="py-3 px-4 text-center">
                                            ${kh(e)?J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" title="Rol esencial de Administrador protegido contra eliminación"><span class="material-symbols-outlined text-[13px]">lock</span><span>Sistema</span></span>`:J`<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="Rol eliminable"><span class="material-symbols-outlined text-[13px]">tune</span><span>Operativo</span></span>`}
                                        </td>
                                        <td class="py-3 px-4 text-center font-mono"><span class="${X(`px-2 py-0.5 rounded`,e.users_count>0?`bg-[#101923] text-[#3D82C6] font-bold border border-[#263241]`:`text-[#707B8A]`)}">${e.users_count}</span></td>
                                        <td class="py-3 px-4 text-center font-mono">
                                            ${e.slug===`admin`?J`<span class="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-semibold" title="Bypass Total de Permisos">TODOS (Bypass)</span>`:J`<span class="px-2 py-0.5 rounded bg-[#101923] text-[#D6DCE4] border border-[#263241]">${e.permissions_count} / ${r.total_permissions}</span>`}
                                        </td>
                                        <td class="py-3 px-4 text-center font-mono"><span class="px-2 py-0.5 rounded bg-[#101923] text-[#D6DCE4] border border-[#263241]">${e.operational_scopes_count} regla(s)</span></td>
                                        <td class="py-3 px-4 text-right">
                                            <div class="inline-flex items-center gap-1.5 justify-end">
                                                ${t.can_manage?J`<a href="#/configuracion/roles/${e.id}" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#123A70]/60 hover:bg-[#164A8A] text-white text-[11px] font-semibold border border-[#164A8A]/50 transition-colors shadow-sm" title="Configurar Permisos y Alcances Operativos">
                                                        <span class="material-symbols-outlined text-[15px]">security</span><span class="hidden sm:inline">Permisos y Alcances</span></a>`:``}
                                                ${t.can_edit?J`<button type="button" @click="openEdit(${Y(e)})" class="p-1.5 rounded-lg bg-[#101923] hover:bg-[#1B2735] text-[#8D98A8] hover:text-[#F2F5F8] border border-[#263241] transition-colors" title="Editar información básica y apariencia del rol"><span class="material-symbols-outlined text-[16px]">edit</span></button>`:``}
                                                ${t.can_delete?kh(e)?J`<button type="button" disabled class="p-1.5 rounded-lg bg-[#101923]/40 text-[#566170] border border-[#1D2530] cursor-not-allowed opacity-50" title="Rol de Administrador protegido: no se puede eliminar"><span class="material-symbols-outlined text-[16px]">lock</span></button>`:J`<button type="button" @click="openDelete(${e.id}, ${Y(e.name)}, ${e.users_count})" class="p-1.5 rounded-lg bg-[#101923] hover:bg-rose-950/40 text-[#8D98A8] hover:text-rose-400 border border-[#263241] hover:border-rose-900/50 transition-colors" title="Eliminar rol"><span class="material-symbols-outlined text-[16px]">delete</span></button>`:``}
                                            </div>
                                        </td>
                                    </tr>`}):J`<tr><td colspan="7" class="py-8 text-center text-[#707B8A]">
                                    <div class="flex flex-col items-center justify-center gap-2"><span class="material-symbols-outlined text-[32px] text-[#566170]">shield_question</span><span>No se encontraron roles que coincidan con la búsqueda.</span></div>
                                </td></tr>`}
                        </tbody>
                    </table>
                </div>
            </div>

            ${Fh(`showCreateModal`,`add_moderator`,`Crear Nuevo Rol Operativo`,J`<form @submit.prevent="store()" class="flex flex-col gap-4" autocomplete="off">
                <div class="flex flex-col gap-1">
                    <label for="create_name" class="font-semibold text-[#8D98A8]">Nombre del Rol *</label>
                    <input type="text" id="create_name" x-model="createRole.name" @input="if (!createRole.slugTouched) { createRole.slug = generateSlug(createRole.name) }" required maxlength="50" placeholder="Ej. Soporte TICS, Supervisión Operativa" class="${Nh}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="create_slug" class="font-semibold text-[#8D98A8]">Identificador Único (Slug) * <span class="font-normal text-[11px] text-[#707B8A]">(solo minúsculas y guiones)</span></label>
                    <input type="text" id="create_slug" x-model="createRole.slug" @input="createRole.slugTouched = true; createRole.slug = generateSlug(createRole.slug)" required maxlength="30" placeholder="soporte-tics" class="${X(Nh,`font-mono`)}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="create_description" class="font-semibold text-[#8D98A8]">Descripción Funcional</label>
                    <textarea id="create_description" x-model="createRole.description" rows="2" maxlength="255" placeholder="Propósito operacional de este perfil dentro del flujo de incidencias..." class="${Nh}"></textarea>
                </div>
                ${Ph(`createRole`)}
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
                    <button type="button" @click="showCreateModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-5 py-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold transition-all shadow-md disabled:opacity-60">Crear y Configurar Permisos</button>
                </div>
            </form>`)}

            ${Fh(`showEditModal`,`edit_note`,J`Editar Rol: <span x-text="editRole.name"></span>`,J`<form @submit.prevent="update()" class="flex flex-col gap-4" autocomplete="off">
                <div class="flex flex-col gap-1">
                    <label for="edit_name" class="font-semibold text-[#8D98A8]">Nombre del Rol *</label>
                    <input type="text" id="edit_name" x-model="editRole.name" required maxlength="50" class="${Nh}">
                </div>
                <div class="flex flex-col gap-1">
                    <label for="edit_slug" class="font-semibold text-[#8D98A8]">Identificador Único (Slug)</label>
                    <template x-if="editRole.is_protected">
                        <div>
                            <input type="text" :value="editRole.slug" disabled class="w-full px-3 py-2 font-mono bg-[#0D1117]/50 border border-[#1D2530] rounded-xl text-xs text-[#707B8A] cursor-not-allowed">
                            <span class="text-[10px] text-cyan-400 mt-1 block">El identificador de los roles del sistema está protegido para preservar la integridad del software.</span>
                        </div>
                    </template>
                    <template x-if="!editRole.is_protected">
                        <input type="text" id="edit_slug" x-model="editRole.slug" @input="editRole.slug = generateSlug(editRole.slug)" required maxlength="30" class="${X(Nh,`font-mono`)}">
                    </template>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="edit_description" class="font-semibold text-[#8D98A8]">Descripción Funcional</label>
                    <textarea id="edit_description" x-model="editRole.description" rows="2" maxlength="255" class="${Nh}"></textarea>
                </div>
                ${Ph(`editRole`)}
                <div class="flex items-center justify-end gap-3 pt-3 border-t border-[#263241]">
                    <button type="button" @click="showEditModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="submit" :disabled="saving" class="px-5 py-2 rounded-xl bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold transition-all shadow-md disabled:opacity-60">Guardar Cambios</button>
                </div>
            </form>`)}

            ${Fh(`showDeleteModal`,null,null,J`
                <div class="flex items-center gap-3 text-rose-400"><span class="material-symbols-outlined text-[26px]">warning</span><h2 class="text-base font-bold text-[#F2F5F8]">Eliminar Rol</h2></div>
                <p class="text-xs text-[#8D98A8]">¿Está seguro de que desea eliminar permanentemente el rol <strong class="text-[#F2F5F8]" x-text="deleteRole.name"></strong>? Esta acción revocará todos sus permisos y reglas de alcance operativo.</p>
                <template x-if="deleteRole.usersCount > 0">
                    <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-start gap-2.5">
                        <span class="material-symbols-outlined text-[18px] text-amber-400 shrink-0">group</span>
                        <span>Este rol tiene <strong class="text-amber-200" x-text="deleteRole.usersCount"></strong> usuario(s) asignado(s). Al eliminarlo, dichos usuarios quedarán desvinculados del rol, preservando intactas sus cuentas, accesos e incidencias históricas.</span>
                    </div>
                </template>
                <div class="flex items-center justify-end gap-3 mt-2">
                    <button type="button" @click="showDeleteModal = false" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] transition-colors">Cancelar</button>
                    <button type="button" @click="destroy()" :disabled="saving" class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold transition-all shadow-md disabled:opacity-60">Eliminar Definitivamente</button>
                </div>`,`border-rose-900/50`,`max-w-md`)}
        </div>`}},Lh=null;T.data(`roleManagePage`,()=>({activeTab:`permissions`,permissionIds:[...Lh.permissionIds],view:[...Lh.view],attend:[...Lh.attend],assign:[...Lh.assign],saving:!1,error:``,toggleAllModule(e,t){let n=Lh.moduleIds[e]??[],r=new Set(this.permissionIds);n.forEach(e=>t?r.add(e):r.delete(e)),this.permissionIds=[...r]},toggleAllScopes(e,t){this[e]=t?[...Lh.allRoleIds]:[]},async run(e){if(!this.saving){this.saving=!0,this.error=``;try{q(`status_message`,(await e()).message),Zd()}catch(e){this.error=G(e).message,this.saving=!1}}},savePermissions(){return this.run(()=>np.updatePermissions(Lh.roleId,this.permissionIds))},saveScopes(){return this.run(()=>np.updateScopes(Lh.roleId,this.view,this.attend,this.assign))}}));function Rh(e,t,n,r,i,a,o){return J`<div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2734] gap-3">
            <div class="flex items-center gap-2.5">
                <span class="${X(`material-symbols-outlined text-[22px]`,n)}">${t}</span>
                <div><h3 class="text-sm font-bold text-[#F2F5F8]">${r}</h3><p class="text-[11px] text-[#8D98A8]">${i}</p></div>
            </div>
            <div class="flex items-center gap-2 self-end sm:self-auto">
                <button type="button" @click="toggleAllScopes('${e}', true)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#3D82C6] text-[11px] font-semibold border border-[#263241] transition-colors">Seleccionar todos</button>
                <button type="button" @click="toggleAllScopes('${e}', false)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#8D98A8] hover:text-[#F2F5F8] text-[11px] font-semibold border border-[#263241] transition-colors">Limpiar</button>
            </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${o.map(t=>{let n=Oh(t);return J`<label class="flex items-center justify-between p-3 rounded-xl bg-[#0D1117] hover:bg-[#161D26] border border-[#263241] cursor-pointer transition-colors group">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <input type="checkbox" value="${t.id}" x-model.number="${e}" class="rounded bg-[#11151B] border-[#263241] text-[#123A70] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                        <div class="flex flex-col min-w-0">
                            <span class="${X(`font-semibold text-xs text-[#F2F5F8] truncate`,a)}">${t.name}</span>
                            <span class="font-mono text-[10px] text-[#707B8A]">${t.slug}</span>
                        </div>
                    </div>
                    <span class="${X(`inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-bold font-mono tracking-wider border shrink-0`,n.bg,n.text,n.border)}">${t.name}</span>
                </label>`})}
        </div>
    </div>`}function zh(e,t,n,r,i){return J`<div class="sticky bottom-4 p-4 rounded-2xl bg-[#11151B]/95 backdrop-blur-md border border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl z-30">
        <div class="text-xs text-[#8D98A8]">${t} <strong class="text-[#F2F5F8]">${e}</strong>.</div>
        <div class="flex items-center gap-3">
            <a href="#/configuracion/roles" class="px-4 py-2 rounded-xl border border-[#263241] bg-[#101923] text-[#8D98A8] hover:text-[#F2F5F8] text-xs font-semibold transition-colors">Cancelar</a>
            ${i?J`<button type="button" @click="${r}" :disabled="saving" class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#123A70] hover:bg-[#164A8A] text-white font-semibold text-xs rounded-xl shadow-md transition-all disabled:opacity-60">
                    <span class="material-symbols-outlined text-[18px]">save</span><span>${n}</span></button>`:``}
        </div>
    </div>`}var Bh={name:`roles.manage`,title:`Configuración de rol`,async render({params:e}){let t=await np.detail(e.id),n=t.role,r=bf(),i={};t.permissions.forEach(e=>{(i[e.module]||=[]).push(e)}),Lh={roleId:n.id,permissionIds:t.assigned_permission_ids,view:t.view_scope_role_ids,attend:t.attend_scope_role_ids,assign:t.assign_scope_role_ids,allRoleIds:t.all_roles.map(e=>e.id),moduleIds:Object.fromEntries(Object.entries(i).map(([e,t])=>[e,t.map(e=>e.id)]))};let a=Oh(n),o=t.view_scope_role_ids.length+t.attend_scope_role_ids.length+t.assign_scope_role_ids.length;return J`<div x-data="roleManagePage" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${qf(`success`,r.status_message)}
            <template x-if="error"><div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between shadow-lg">
                <div class="flex items-center gap-3"><span class="material-symbols-outlined text-[22px] text-rose-400">error</span><span class="font-medium" x-text="error"></span></div>
                <button type="button" @click="error = ''" class="text-rose-400 hover:text-rose-200"><span class="material-symbols-outlined text-[18px]">close</span></button>
            </div></template>

            ${Jf(`roles`,{showUsers:Rf(),showRoles:!0})}

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <a href="#/dashboard" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Inicio</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <a href="#/configuracion/roles" class="text-xs uppercase tracking-widest text-[#707B8A] hover:text-[#3D82C6] transition-colors">Roles</a>
                        <span class="text-[#707B8A] text-sm">/</span>
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">${n.name}</span>
                    </div>
                    <div class="flex flex-wrap items-center gap-3">
                        <h1 class="text-2xl sm:text-3xl font-bold text-[#F2F5F8] tracking-tight">${n.name}</h1>
                        <span class="${X(`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold font-mono tracking-wider border`,a.bg,a.text,a.border)}">${n.name}</span>
                        <span class="font-mono text-xs text-[#707B8A] px-2 py-0.5 rounded bg-[#101923] border border-[#263241]">slug: ${n.slug}</span>
                        ${n.is_protected?J`<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"><span class="material-symbols-outlined text-[14px]">lock</span><span>Protegido por Sistema</span></span>`:``}
                    </div>
                    <p class="text-xs sm:text-sm text-[#8D98A8] mt-1">${n.description||`Configuración de capacidades operativas y alcances de comunicación.`}</p>
                </div>
                <div class="flex items-center gap-3 self-start md:self-auto">
                    <a href="#/configuracion/roles" class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#101923] hover:bg-[#1B2735] text-[#8D98A8] hover:text-[#F2F5F8] text-xs font-semibold border border-[#263241] transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[16px]">arrow_back</span><span>Volver al Catálogo</span>
                    </a>
                </div>
            </div>

            ${n.slug===`admin`?J`<div class="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-200 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
                    <span class="material-symbols-outlined text-[24px] text-purple-400 shrink-0">admin_panel_settings</span>
                    <div class="flex flex-col gap-0.5">
                        <strong class="text-purple-300 font-bold">Bypass de Seguridad Irrestricto para ADMINISTRADOR</strong>
                        <span>Por arquitectura de seguridad, la cuenta con rol <strong>ADMINISTRADOR</strong> posee acceso total a todos los módulos y funciones del sistema, sin importar si algún checkbox se encuentra desmarcado.</span>
                    </div>
                </div>`:``}

            <div class="flex items-center gap-3 border-b border-[#263241] overflow-x-auto">
                <button type="button" @click="activeTab = 'permissions'" :class="activeTab === 'permissions' ? 'text-[#3D82C6] border-b-2 border-[#3D82C6] font-bold' : 'text-[#8D98A8] hover:text-[#F2F5F8] font-medium'" class="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm transition-all outline-none whitespace-nowrap">
                    <span class="material-symbols-outlined text-[18px]">shield</span><span>Matriz de Permisos Granulares</span>
                    <span class="px-2 py-0.2 rounded-full text-[11px] font-mono bg-[#101923] text-[#D6DCE4] border border-[#263241]">${t.assigned_permission_ids.length} activos</span>
                </button>
                <button type="button" @click="activeTab = 'scopes'" :class="activeTab === 'scopes' ? 'text-[#3D82C6] border-b-2 border-[#3D82C6] font-bold' : 'text-[#8D98A8] hover:text-[#F2F5F8] font-medium'" class="flex items-center gap-2 py-3 px-2 text-xs sm:text-sm transition-all outline-none whitespace-nowrap">
                    <span class="material-symbols-outlined text-[18px]">hub</span><span>Matriz de Alcances Operativos (Inter-Rol)</span>
                    <span class="px-2 py-0.2 rounded-full text-[11px] font-mono bg-[#101923] text-[#D6DCE4] border border-[#263241]">${o} reglas</span>
                </button>
            </div>

            <div x-show="activeTab === 'permissions'" class="flex flex-col gap-6">
                ${Object.entries(Ah).map(([e,t])=>{let n=i[e]??[];return n.length?J`<div class="bg-[#11151B] border border-[#263241] rounded-2xl p-5 shadow-sm flex flex-col gap-4">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#1E2734] gap-3">
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-[20px] text-[#3D82C6]">${jh[e]??`folder`}</span>
                                <h2 class="text-sm sm:text-base font-bold text-[#F2F5F8]">${t}</h2>
                                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0D1117] text-[#8D98A8] border border-[#263241]">${n.length} capacidades</span>
                            </div>
                            <div class="flex items-center gap-2 self-end sm:self-auto">
                                <button type="button" @click="toggleAllModule('${e}', true)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#3D82C6] text-[11px] font-semibold border border-[#263241] transition-colors">Marcar todos</button>
                                <button type="button" @click="toggleAllModule('${e}', false)" class="px-2.5 py-1 rounded-lg bg-[#0D1117] hover:bg-[#162232] text-[#8D98A8] hover:text-[#F2F5F8] text-[11px] font-semibold border border-[#263241] transition-colors">Desmarcar</button>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            ${n.map(e=>J`<label class="flex items-start gap-3 p-3 rounded-xl bg-[#0D1117] hover:bg-[#161D26] border border-[#263241] cursor-pointer transition-colors group">
                                <input type="checkbox" value="${e.id}" x-model.number="permissionIds" class="mt-1 rounded bg-[#11151B] border-[#263241] text-[#123A70] focus:ring-0 focus:ring-offset-0 cursor-pointer">
                                <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                                    <span class="font-semibold text-xs text-[#F2F5F8] group-hover:text-[#3D82C6] transition-colors">${e.name}</span>
                                    <span class="font-mono text-[10px] text-[#707B8A]">${e.slug}</span>
                                    ${e.description?J`<p class="text-[11px] text-[#8D98A8] mt-0.5 leading-tight">${e.description}</p>`:``}
                                </div>
                            </label>`)}
                        </div>
                    </div>`:``})}
                ${zh(n.name,`Los cambios en permisos se aplican de forma inmediata para los usuarios con rol`,`Guardar Matriz de Permisos`,`savePermissions()`,t.can_manage_permissions)}
            </div>

            <div x-show="activeTab === 'scopes'" x-cloak class="flex flex-col gap-6">
                <div class="p-4 rounded-2xl bg-[#0D1117] border border-[#263241] flex flex-col sm:flex-row items-start gap-4">
                    <div class="p-2.5 rounded-xl bg-[#101923] border border-[#263241] text-[#3D82C6] shrink-0"><span class="material-symbols-outlined text-[28px]">hub</span></div>
                    <div class="flex flex-col gap-1 text-xs text-[#8D98A8]">
                        <h3 class="text-sm font-bold text-[#F2F5F8]">Arquitectura de Desacoplamiento Operativo</h3>
                        <p>Esta matriz define las reglas de interacción del rol <strong class="text-[#F2F5F8]">${n.name}</strong> frente a los demás roles del aeropuerto. Los tres tipos de alcance son <strong class="text-cyan-400">totalmente independientes entre sí</strong>:</p>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#93C5FD] block mb-0.5">1. Visualización (Ver)</strong><span>Determina qué incidencias aparecen en listados, tableros y búsquedas del usuario.</span></div>
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#A78BFA] block mb-0.5">2. Atención (Atender)</strong><span>Determina de qué roles puede iniciar diagnóstico, tomar o registrar solución técnica.</span></div>
                            <div class="p-2.5 rounded-xl bg-[#11151B] border border-[#1D2530]"><strong class="text-[#FBBF24] block mb-0.5">3. Asignación (Asignar)</strong><span>Determina hacia qué roles puede transferir o asignar tickets el usuario.</span></div>
                        </div>
                    </div>
                </div>
                ${Rh(`view`,`visibility`,`text-blue-400`,`1. Alcance de Visualización`,`¿Incidencias creadas por qué roles puede ver el usuario con rol ${n.name}?`,`group-hover:text-[#3D82C6]`,t.all_roles)}
                ${Rh(`attend`,`build`,`text-purple-400`,`2. Alcance de Atención Técnica`,`¿Incidencias originadas por qué roles puede atender, diagnosticar y resolver este rol?`,`group-hover:text-purple-300`,t.all_roles)}
                ${Rh(`assign`,`person_add`,`text-amber-400`,`3. Alcance de Asignación`,`¿Hacia usuarios de qué roles puede este perfil delegar o asignar incidencias?`,`group-hover:text-amber-300`,t.all_roles)}
                ${zh(n.name,`Las reglas de alcance delimitan automáticamente los filtros de visualización y asignación del rol`,`Guardar Matriz de Alcances`,`saveScopes()`,t.can_manage_scopes)}
            </div>
        </div>`}};T.data(`profileInfoForm`,e=>({form:{...e},saved:!1,error:``,saving:!1,async submit(){if(!this.saving){this.saving=!0,this.error=``;try{await rp.update(this.form.name,this.form.email,cf()?this.form.username:null),await Of(),this.saved=!0,setTimeout(()=>this.saved=!1,2e3)}catch(e){this.error=G(e).message}finally{this.saving=!1}}}})),T.data(`passwordForm`,()=>({current:``,password:``,confirmation:``,saved:!1,error:``,saving:!1,async submit(){if(!this.saving){this.saving=!0,this.error=``;try{await rp.changePassword(this.current,this.password,this.confirmation),this.current=this.password=this.confirmation=``,this.saved=!0,setTimeout(()=>this.saved=!1,2e3)}catch(e){this.error=G(e).message}finally{this.saving=!1}}}})),T.data(`deleteAccount`,()=>({show:!1,password:``,error:``,async submit(){this.error=``;try{await rp.destroy(this.password),await Af(),V(`/login`)}catch(e){this.error=G(e).message}}}));var Vh=`bg-brand-surface-subtle border border-brand-border text-brand-text-primary placeholder:text-brand-text-muted focus:border-[#164A8A] focus:ring-1 focus:ring-[#164A8A] rounded-lg shadow-sm text-sm px-3 py-2 transition-colors outline-none mt-1 block w-full`,Hh=`block font-medium text-xs text-brand-text-secondary uppercase tracking-wider mb-1.5`,Uh=`inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active text-white text-xs font-semibold rounded-lg shadow-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#164A8A] transition-all duration-150 disabled:opacity-60`,Wh={name:`profile.edit`,title:`Mi perfil`,async render(){await Of();let e=af(),t=cf();return J`<div class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
            ${t||mf(`users.view`,`roles.view`)?Jf(`profile`,{showUsers:Rf(),showRoles:zf()}):``}

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
                <div class="flex flex-col">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs uppercase tracking-widest text-[#3D82C6] font-semibold">Credenciales y Seguridad</span>
                        <span class="text-brand-text-faint">•</span>
                        <span class="text-xs uppercase tracking-widest text-brand-text-muted font-mono">AIFA ID-${e.id}</span>
                    </div>
                    <h1 class="text-2xl font-bold text-brand-text-primary tracking-tight">Perfil de Operador</h1>
                    <p class="text-xs text-brand-text-muted mt-0.5">Gestión de identidad, contraseña y parámetros de cuenta institucional AIFA.</p>
                </div>
                <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border text-xs font-mono text-brand-text-secondary self-start sm:self-auto">
                    <span class="w-2 h-2 rounded-full bg-[#20C997] animate-pulse"></span><span>Sesión Activa</span>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-6">
                <div class="p-6 bg-brand-surface border border-brand-border rounded-xl shadow-enterprise">
                    <div class="max-w-xl">
                        <section x-data="profileInfoForm(${Y({name:e.name,email:e.email??``,username:e.username})})">
                            <header>
                                <h2 class="text-lg font-medium text-brand-text-primary">Información del Perfil</h2>
                                <p class="mt-1 text-sm text-brand-text-muted">Actualice la información de su cuenta y su correo electrónico.</p>
                            </header>
                            <form @submit.prevent="submit()" class="mt-6 space-y-6" autocomplete="off">
                                <div>
                                    <label for="name" class="${Hh}">Nombre</label>
                                    <input id="name" x-model="form.name" type="text" class="${Vh}" required maxlength="255" autocomplete="off" />
                                </div>
                                ${t?J`<div>
                                        <label for="username" class="${Hh}">Usuario (Login)</label>
                                        <input id="username" x-model="form.username" type="text" class="${Vh}" required maxlength="50" autocomplete="off" />
                                    </div>`:J`<div>
                                        <div class="flex items-center justify-between mb-1">
                                            <label for="username" class="${Hh}">Usuario (Login)</label>
                                            <span class="text-[10px] font-mono text-[#707B8A] bg-[#11151B] px-2 py-0.5 rounded border border-[#263241] flex items-center gap-1">
                                                <span class="material-symbols-outlined text-[13px] text-amber-400">lock</span><span>No editable</span>
                                            </span>
                                        </div>
                                        <input id="username" type="text" class="${Vh} bg-[#070A0F] text-[#8D98A8] border-[#1F2937] cursor-not-allowed opacity-80 select-none font-mono" value="${e.username}" readonly disabled />
                                        <p class="mt-1 text-[11px] text-[#707B8A]">El nombre de usuario institucional es permanente y únicamente puede ser gestionado por la Administración del Sistema.</p>
                                    </div>`}
                                <div>
                                    <label for="email" class="${Hh}">Correo Electrónico (Opcional)</label>
                                    <input id="email" x-model="form.email" type="email" class="${Vh}" maxlength="255" autocomplete="off" />
                                </div>
                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1"><li x-text="error"></li></ul>
                                <div class="flex items-center gap-4">
                                    <button type="submit" :disabled="saving" class="${Uh}">Guardar</button>
                                    <p x-show="saved" x-transition x-cloak class="text-sm text-[#20C997] font-medium">Guardado.</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                <div class="p-6 bg-brand-surface border border-brand-border rounded-xl shadow-enterprise">
                    <div class="max-w-xl">
                        <section x-data="passwordForm">
                            <header>
                                <h2 class="text-lg font-medium text-brand-text-primary">Actualizar Contraseña</h2>
                                <p class="mt-1 text-sm text-brand-text-muted">Asegúrese de que su cuenta use una contraseña larga y aleatoria para mantenerla segura.</p>
                            </header>
                            <form @submit.prevent="submit()" class="mt-6 space-y-6">
                                <div><label for="current_password" class="${Hh}">Contraseña Actual</label><input id="current_password" x-model="current" type="password" class="${Vh}" autocomplete="current-password" /></div>
                                <div><label for="new_password" class="${Hh}">Nueva Contraseña</label><input id="new_password" x-model="password" type="password" class="${Vh}" autocomplete="new-password" /></div>
                                <div><label for="password_confirmation" class="${Hh}">Confirmar Contraseña</label><input id="password_confirmation" x-model="confirmation" type="password" class="${Vh}" autocomplete="new-password" /></div>
                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1"><li x-text="error"></li></ul>
                                <div class="flex items-center gap-4">
                                    <button type="submit" :disabled="saving" class="${Uh}">Guardar</button>
                                    <p x-show="saved" x-transition x-cloak class="text-sm text-[#20C997] font-medium">Guardado.</p>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>

                ${t?J`<div class="p-6 bg-brand-surface border border-[#D83B52]/20 rounded-xl shadow-enterprise bg-[#D83B52]/[0.02]">
                        <div class="max-w-xl">
                            <section class="space-y-6" x-data="deleteAccount">
                                <header>
                                    <h2 class="text-lg font-medium text-brand-text-primary">Eliminar Cuenta</h2>
                                    <p class="mt-1 text-sm text-brand-text-muted">Una vez eliminada su cuenta, todos sus recursos y datos se eliminarán de forma permanente. Antes de eliminarla, descargue cualquier información que desee conservar.</p>
                                </header>
                                <button type="button" @click="show = true" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D83B52] hover:bg-[#C23348] active:bg-[#A82B3E] text-white text-xs font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D83B52]/50 transition-all duration-150">Eliminar Cuenta</button>
                                <div x-show="show" x-cloak class="fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50" @keydown.escape.window="show = false">
                                    <div class="fixed inset-0 transform transition-all" @click="show = false"><div class="absolute inset-0 bg-[#05070A]/80 backdrop-blur-sm"></div></div>
                                    <div class="mb-6 bg-brand-surface border border-brand-border rounded-xl overflow-hidden shadow-enterprise-lg transform transition-all sm:w-full sm:max-w-2xl sm:mx-auto relative">
                                        <form @submit.prevent="submit()" class="p-6" autocomplete="off">
                                            <h2 class="text-lg font-medium text-brand-text-primary">¿Está seguro de que desea eliminar su cuenta?</h2>
                                            <p class="mt-1 text-sm text-brand-text-muted">Una vez eliminada su cuenta, todos sus recursos y datos se eliminarán de forma permanente. Ingrese su contraseña para confirmar.</p>
                                            <div class="mt-6">
                                                <input type="password" x-model="password" class="${Vh} w-3/4" placeholder="Contraseña" />
                                                <ul x-show="error" x-cloak class="text-sm text-[#E66A7A] space-y-1 mt-2"><li x-text="error"></li></ul>
                                            </div>
                                            <div class="mt-6 flex justify-end">
                                                <button type="button" @click="show = false" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-surface-subtle hover:bg-brand-surface-hover border border-brand-border text-brand-text-secondary hover:text-brand-text-primary text-xs font-medium rounded-lg shadow-sm transition-all duration-150">Cancelar</button>
                                                <button type="submit" class="ms-3 inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D83B52] hover:bg-[#C23348] text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-150">Eliminar Cuenta</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>`:``}
            </div>
        </div>`}};window.Alpine=T;var Gh=document.getElementById(`app`),Kh=0;function qh(e){Gh.innerHTML=String(e);let t=document.getElementById(`main`);t&&(t.scrollTop=0)}async function Jh(e,t){let n=++Kh;if(tf(e.name),document.title=e.title?`${e.title} · GTS AIFA`:`GTS - Grupo de Seguridad Tecnológica AIFA`,e.guest){qh(Cp(await e.render(t)));return}if(!of()){V(`/login`);return}qh(Sp(Yf()));let r;try{r=await e.render(t)}catch(e){let t=G(e);if(t.status===401){rf(),await z.auth.signOut(),q(`login_error`,t.message),V(`/login`);return}if(/Usuario inactivo|No autenticado/.test(t.message)){rf(),await z.auth.signOut(),q(`login_error`,Ef),V(`/login`);return}r=wp(t.status===422?500:t.status,t.message)}n===Kh&&qh(Sp(r))}var $=e=>t=>Jh(e,t);function Yh(){B(`/login`,$(Ep),`login`),B(`/dashboard`,$(Zp),`dashboard`),B(`/incidencias`,$(Sm.all),`incidents.index`),B(`/incidencias/mis`,$(Sm.mine),`incidents.my`),B(`/incidencias/nueva`,$(Em),`incidents.create`),B(`/incidencias/:folio`,$(Fm),`incidents.show`),B(`/reportes`,$(oh),`reports.index`),B(`/indicadores`,$(zm),`indicators.index`),B(`/auditoria`,$(dh),`audit.index`),B(`/catalogos`,$(xh),`catalogs.index`),B(`/configuracion/usuarios`,$(Eh),`users.index`),B(`/configuracion/roles`,$(Ih),`roles.index`),B(`/configuracion/roles/:id`,$(Bh),`roles.manage`),B(`/perfil`,$(Wh),`profile.edit`),B(`/`,()=>V(of()?`/dashboard`:`/login`)),qd(()=>Jh({name:`error`,render:async()=>wp(404,`La página solicitada no existe.`)},{}))}async function Xh(){if(!Wa())qh(Cp(await Dp.render()));else{try{await Of()}catch(e){q(`login_error`,G(e).message)}z.auth.onAuthStateChange(e=>{e===`SIGNED_OUT`&&(rf(),Yd().path!==`/login`&&V(`/login`))}),Yh(),T.start(),await $d()}}Xh().catch(e=>{Gh.innerHTML=String(J`<div class="p-8 text-sm text-[#E66A7A] font-mono">No fue posible iniciar la aplicación: ${e.message}</div>`)});