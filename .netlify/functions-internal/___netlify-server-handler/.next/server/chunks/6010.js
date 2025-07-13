"use strict";exports.id=6010,exports.ids=[6010],exports.modules={50169:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,n.Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},67932:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,n.Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},75183:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,n.Z)("ThumbsUp",[["path",{d:"M7 10v12",key:"1qc93n"}],["path",{d:"M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",key:"emmmcr"}]])},93680:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,n.Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},24484:(e,t,r)=>{/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var n=r(9885),a="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=n.useState,u=n.useEffect,i=n.useLayoutEffect,s=n.useDebugValue;function d(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!a(e,r)}catch(e){return!0}}var l="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var r=t(),n=o({inst:{value:r,getSnapshot:t}}),a=n[0].inst,l=n[1];return i(function(){a.value=r,a.getSnapshot=t,d(a)&&l({inst:a})},[e,r,t]),u(function(){return d(a)&&l({inst:a}),e(function(){d(a)&&l({inst:a})})},[e]),s(r),r};t.useSyncExternalStore=void 0!==n.useSyncExternalStore?n.useSyncExternalStore:l},61928:(e,t,r)=>{e.exports=r(24484)},69382:(e,t,r)=>{r.d(t,{NY:()=>Z,Ee:()=>L,fC:()=>E});var n=r(9885),a=r(8718),o=r(32285),u=r(95852),i=r(43979),s=r(61928);function d(){return()=>{}}var l=r(60080),c="Avatar",[v,f]=(0,a.b)(c),[p,m]=v(c),y=n.forwardRef((e,t)=>{let{__scopeAvatar:r,...a}=e,[o,u]=n.useState("idle");return(0,l.jsx)(p,{scope:r,imageLoadingStatus:o,onImageLoadingStatusChange:u,children:(0,l.jsx)(i.WV.span,{...a,ref:t})})});y.displayName=c;var g="AvatarImage",S=n.forwardRef((e,t)=>{let{__scopeAvatar:r,src:a,onLoadingStatusChange:c=()=>{},...v}=e,f=m(g,r),p=function(e,{referrerPolicy:t,crossOrigin:r}){let a=(0,s.useSyncExternalStore)(d,()=>!0,()=>!1),o=n.useRef(null),i=a?(o.current||(o.current=new window.Image),o.current):null,[l,c]=n.useState(()=>x(i,e));return(0,u.b)(()=>{c(x(i,e))},[i,e]),(0,u.b)(()=>{let e=e=>()=>{c(e)};if(!i)return;let n=e("loaded"),a=e("error");return i.addEventListener("load",n),i.addEventListener("error",a),t&&(i.referrerPolicy=t),"string"==typeof r&&(i.crossOrigin=r),()=>{i.removeEventListener("load",n),i.removeEventListener("error",a)}},[i,r,t]),l}(a,v),y=(0,o.W)(e=>{c(e),f.onImageLoadingStatusChange(e)});return(0,u.b)(()=>{"idle"!==p&&y(p)},[p,y]),"loaded"===p?(0,l.jsx)(i.WV.img,{...v,ref:t,src:a}):null});S.displayName=g;var w="AvatarFallback",h=n.forwardRef((e,t)=>{let{__scopeAvatar:r,delayMs:a,...o}=e,u=m(w,r),[s,d]=n.useState(void 0===a);return n.useEffect(()=>{if(void 0!==a){let e=window.setTimeout(()=>d(!0),a);return()=>window.clearTimeout(e)}},[a]),s&&"loaded"!==u.imageLoadingStatus?(0,l.jsx)(i.WV.span,{...o,ref:t}):null});function x(e,t){return e?t?(e.src!==t&&(e.src=t),e.complete&&e.naturalWidth>0?"loaded":"loading"):"error":"idle"}h.displayName=w;var E=y,L=S,Z=h}};