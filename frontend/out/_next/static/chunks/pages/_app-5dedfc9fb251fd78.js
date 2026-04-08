(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{1118:function(e,t,o){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return o(5148)}])},3350:function(e,t){"use strict";async function o(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},{method:o="GET",body:a,auth:r=!0}=t,i={"Content-Type":"application/json"};if(r){let e=localStorage.getItem("token");e&&(i.Authorization="Bearer ".concat(e))}let s=await fetch("".concat("https://abstracts-tips-amanda-mystery.trycloudflare.com/api").concat(e),{method:o,headers:i,body:a?JSON.stringify(a):void 0}),n=await s.json();if(!s.ok)throw Error(n.error||"Request failed");return n}t.Z={register:e=>o("/auth/register",{method:"POST",body:e,auth:!1}),login:(e,t)=>o("/auth/login",{method:"POST",body:{email:e,password:t},auth:!1}),getMe:()=>o("/auth/me"),updateProfile:e=>o("/auth/profile",{method:"PUT",body:e}),addAddress:e=>o("/auth/address",{method:"POST",body:e}),getCategories:()=>o("/services/categories",{auth:!1}),getCategoryServices:e=>o("/services/category/".concat(e),{auth:!1}),getPopular:()=>o("/services/popular",{auth:!1}),search:e=>o("/services/search?q=".concat(encodeURIComponent(e)),{auth:!1}),getService:e=>o("/services/".concat(e),{auth:!1}),createBooking:e=>o("/bookings",{method:"POST",body:e}),getBookings:e=>o("/bookings".concat(e?"?status=".concat(e):"")),getBooking:e=>o("/bookings/".concat(e)),cancelBooking:(e,t)=>o("/bookings/".concat(e,"/cancel"),{method:"PUT",body:{reason:t}}),reviewBooking:(e,t,a)=>o("/bookings/".concat(e,"/review"),{method:"POST",body:{rating:t,comment:a}}),getStats:()=>o("/stats",{auth:!1})}},8259:function(e,t,o){"use strict";o.d(t,{H:function(){return l},a:function(){return c}});var a=o(5893),r=o(7294),i=o(1163),s=o(3350);let n=(0,r.createContext)(null);function l(e){let{children:t}=e,[o,l]=(0,r.useState)(null),[c,d]=(0,r.useState)(!0),u=(0,i.useRouter)();(0,r.useEffect)(()=>{localStorage.getItem("token")?s.Z.getMe().then(e=>l(e)).catch(()=>localStorage.removeItem("token")).finally(()=>d(!1)):d(!1)},[]);let p=async(e,t)=>{let o=await s.Z.login(e,t);return localStorage.setItem("token",o.token),l(o.user),o},f=async e=>{let t=await s.Z.register(e);return localStorage.setItem("token",t.token),l(t.user),t};return(0,a.jsx)(n.Provider,{value:{user:o,setUser:l,login:p,register:f,logout:()=>{localStorage.removeItem("token"),l(null),u.push("/")},loading:c},children:t})}let c=()=>(0,r.useContext)(n)},5148:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return s}});var a=o(5893);o(876);var r=o(8259),i=o(6501);function s(e){let{Component:t,pageProps:o}=e;return(0,a.jsxs)(r.H,{children:[(0,a.jsx)(t,{...o}),(0,a.jsx)(i.x7,{position:"bottom-center",toastOptions:{style:{background:"#111125",color:"#fff",borderRadius:"14px",fontWeight:600,fontSize:"14px"}}})]})}},876:function(){},1163:function(e,t,o){e.exports=o(3079)},6501:function(e,t,o){"use strict";let a,r;o.d(t,{x7:function(){return ep},ZP:function(){return ef}});var i,s=o(7294);let n={data:""},l=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||n},c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,p=(e,t)=>{let o="",a="",r="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?o=i+" "+s+";":a+="f"==i[1]?p(s,i):i+"{"+p(s,"k"==i[1]?"":t)+"}":"object"==typeof s?a+=p(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=p.p?p.p(i,s):i+":"+s+";")}return o+(t&&r?t+"{"+r+"}":r)+a},f={},m=e=>{if("object"==typeof e){let t="";for(let o in e)t+=o+m(e[o]);return t}return e},g=(e,t,o,a,r)=>{var i;let s=m(e),n=f[s]||(f[s]=(e=>{let t=0,o=11;for(;t<e.length;)o=101*o+e.charCodeAt(t++)>>>0;return"go"+o})(s));if(!f[n]){let t=s!==e?e:(e=>{let t,o,a=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(o=t[3].replace(u," ").trim(),a.unshift(a[0][o]=a[0][o]||{})):a[0][t[1]]=t[2].replace(u," ").trim();return a[0]})(e);f[n]=p(r?{["@keyframes "+n]:t}:t,o?"":"."+n)}let l=o&&f.g?f.g:null;return o&&(f.g=f[n]),i=f[n],l?t.data=t.data.replace(l,i):-1===t.data.indexOf(i)&&(t.data=a?i+t.data:t.data+i),n},h=(e,t,o)=>e.reduce((e,a,r)=>{let i=t[r];if(i&&i.call){let e=i(o),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+a+(null==i?"":i)},"");function y(e){let t=this||{},o=e.call?e(t.p):e;return g(o.unshift?o.raw?h(o,[].slice.call(arguments,1),t.p):o.reduce((e,o)=>Object.assign(e,o&&o.call?o(t.p):o),{}):o,l(t.target),t.g,t.o,t.k)}y.bind({g:1});let b,v,x,w=y.bind({k:1});function k(e,t){let o=this||{};return function(){let a=arguments;function r(i,s){let n=Object.assign({},i),l=n.className||r.className;o.p=Object.assign({theme:v&&v()},n),o.o=/ *go\d+/.test(l),n.className=y.apply(o,a)+(l?" "+l:""),t&&(n.ref=s);let c=e;return e[0]&&(c=n.as||e,delete n.as),x&&c[0]&&x(n),b(c,n)}return t?t(r):r}}var E=e=>"function"==typeof e,C=(e,t)=>E(e)?e(t):e,O=(a=0,()=>(++a).toString()),S=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},P="default",j=(e,t)=>{let{toastLimit:o}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,o)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return j(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},_=[],$={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},I={},N=(e,t=P)=>{I[t]=j(I[t]||$,e),_.forEach(([e,o])=>{e===t&&o(I[t])})},T=e=>Object.keys(I).forEach(t=>N(e,t)),D=e=>Object.keys(I).find(t=>I[t].toasts.some(t=>t.id===e)),A=(e=P)=>t=>{N(t,e)},z={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},M=(e={},t=P)=>{let[o,a]=(0,s.useState)(I[t]||$),r=(0,s.useRef)(I[t]);(0,s.useEffect)(()=>(r.current!==I[t]&&a(I[t]),_.push([t,a]),()=>{let e=_.findIndex(([e])=>e===t);e>-1&&_.splice(e,1)}),[t]);let i=o.toasts.map(t=>{var o,a,r;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(o=e[t.type])?void 0:o.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||z[t.type],style:{...e.style,...null==(r=e[t.type])?void 0:r.style,...t.style}}});return{...o,toasts:i}},B=(e,t="blank",o)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...o,id:(null==o?void 0:o.id)||O()}),H=e=>(t,o)=>{let a=B(t,e,o);return A(a.toasterId||D(a.id))({type:2,toast:a}),a.id},R=(e,t)=>H("blank")(e,t);R.error=H("error"),R.success=H("success"),R.loading=H("loading"),R.custom=H("custom"),R.dismiss=(e,t)=>{let o={type:3,toastId:e};t?A(t)(o):T(o)},R.dismissAll=e=>R.dismiss(void 0,e),R.remove=(e,t)=>{let o={type:4,toastId:e};t?A(t)(o):T(o)},R.removeAll=e=>R.remove(void 0,e),R.promise=(e,t,o)=>{let a=R.loading(t.loading,{...o,...null==o?void 0:o.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?C(t.success,e):void 0;return r?R.success(r,{id:a,...o,...null==o?void 0:o.success}):R.dismiss(a),e}).catch(e=>{let r=t.error?C(t.error,e):void 0;r?R.error(r,{id:a,...o,...null==o?void 0:o.error}):R.dismiss(a)}),e};var L=1e3,Z=(e,t="default")=>{let{toasts:o,pausedAt:a}=M(e,t),r=(0,s.useRef)(new Map).current,i=(0,s.useCallback)((e,t=L)=>{if(r.has(e))return;let o=setTimeout(()=>{r.delete(e),n({type:4,toastId:e})},t);r.set(e,o)},[]);(0,s.useEffect)(()=>{if(a)return;let e=Date.now(),r=o.map(o=>{if(o.duration===1/0)return;let a=(o.duration||0)+o.pauseDuration-(e-o.createdAt);if(a<0){o.visible&&R.dismiss(o.id);return}return setTimeout(()=>R.dismiss(o.id,t),a)});return()=>{r.forEach(e=>e&&clearTimeout(e))}},[o,a,t]);let n=(0,s.useCallback)(A(t),[t]),l=(0,s.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,s.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,s.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,s.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:r=8,defaultPosition:i}=t||{},s=o.filter(t=>(t.position||i)===(e.position||i)&&t.height),n=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<n&&e.visible).length;return s.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+r,0)},[o]);return(0,s.useEffect)(()=>{o.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=r.get(e.id);t&&(clearTimeout(t),r.delete(e.id))}})},[o,i]),{toasts:o,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},F=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,U=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,q=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,X=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${F} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${U} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${q} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,G=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,J=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${G} 1s linear infinite;
`,W=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,K=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=k("div")`
  position: absolute;
`,V=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,eo=({toast:e})=>{let{icon:t,type:o,iconTheme:a}=e;return void 0!==t?"string"==typeof t?s.createElement(et,null,t):t:"blank"===o?null:s.createElement(V,null,s.createElement(J,{...a}),"loading"!==o&&s.createElement(Q,null,"error"===o?s.createElement(X,{...a}):s.createElement(K,{...a})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,er=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ei=k("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,es=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let o=e.includes("top")?1:-1,[a,r]=S()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(o),er(o)];return{animation:t?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(r)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=s.memo(({toast:e,position:t,style:o,children:a})=>{let r=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},i=s.createElement(eo,{toast:e}),n=s.createElement(es,{...e.ariaProps},C(e.message,e));return s.createElement(ei,{className:e.className,style:{...r,...o,...e.style}},"function"==typeof a?a({icon:i,message:n}):s.createElement(s.Fragment,null,i,n))});i=s.createElement,p.p=void 0,b=i,v=void 0,x=void 0;var ec=({id:e,className:t,style:o,onHeightUpdate:a,children:r})=>{let i=s.useCallback(t=>{if(t){let o=()=>{a(e,t.getBoundingClientRect().height)};o(),new MutationObserver(o).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return s.createElement("div",{ref:i,className:t,style:o},r)},ed=(e,t)=>{let o=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:S()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(o?1:-1)}px)`,...o?{top:0}:{bottom:0},...a}},eu=y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:o,gutter:a,children:r,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=Z(o,i);return s.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(o=>{let i=o.position||t,n=ed(i,d.calculateOffset(o,{reverseOrder:e,gutter:a,defaultPosition:t}));return s.createElement(ec,{id:o.id,key:o.id,onHeightUpdate:d.updateHeight,className:o.visible?eu:"",style:n},"custom"===o.type?C(o.message,o):r?r(o):s.createElement(el,{toast:o,position:i}))}))},ef=R}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(1118),t(3079)}),_N_E=e.O()}]);