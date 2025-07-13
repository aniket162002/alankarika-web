"use strict";exports.id=6212,exports.ids=[6212],exports.modules={976:(e,t,r)=>{r.d(t,{Z:()=>s});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]])},51910:(e,t,r)=>{r.d(t,{Z:()=>s});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]])},11922:(e,t,r)=>{r.d(t,{Z:()=>s});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]])},50169:(e,t,r)=>{r.d(t,{Z:()=>s});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},67932:(e,t,r)=>{r.d(t,{Z:()=>s});var n=r(75593);/**
 * @license lucide-react v0.446.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,n.Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},37686:(e,t,r)=>{r.d(t,{M:()=>g});var n=r(60080),s=r(9885),l=r(78549),o=r(34349),i=r(19386),u=r(95248);class a extends s.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function d({children:e,isPresent:t}){let r=(0,s.useId)(),l=(0,s.useRef)(null),o=(0,s.useRef)({width:0,height:0,top:0,left:0}),{nonce:i}=(0,s.useContext)(u._);return(0,s.useInsertionEffect)(()=>{let{width:e,height:n,top:s,left:u}=o.current;if(t||!l.current||!e||!n)return;l.current.dataset.motionPopId=r;let a=document.createElement("style");return i&&(a.nonce=i),document.head.appendChild(a),a.sheet&&a.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${n}px !important;
            top: ${s}px !important;
            left: ${u}px !important;
          }
        `),()=>{document.head.removeChild(a)}},[t]),(0,n.jsx)(a,{isPresent:t,childRef:l,sizeRef:o,children:s.cloneElement(e,{ref:l})})}let h=({children:e,initial:t,isPresent:r,onExitComplete:l,custom:u,presenceAffectsLayout:a,mode:h})=>{let c=(0,o.h)(p),f=(0,s.useId)(),m=(0,s.useCallback)(e=>{for(let t of(c.set(e,!0),c.values()))if(!t)return;l&&l()},[c,l]),v=(0,s.useMemo)(()=>({id:f,initial:t,isPresent:r,custom:u,onExitComplete:m,register:e=>(c.set(e,!1),()=>c.delete(e))}),a?[Math.random(),m]:[r,m]);return(0,s.useMemo)(()=>{c.forEach((e,t)=>c.set(t,!1))},[r]),s.useEffect(()=>{r||c.size||!l||l()},[r]),"popLayout"===h&&(e=(0,n.jsx)(d,{isPresent:r,children:e})),(0,n.jsx)(i.O.Provider,{value:v,children:e})};function p(){return new Map}var c=r(61886);let f=e=>e.key||"";function m(e){let t=[];return s.Children.forEach(e,e=>{(0,s.isValidElement)(e)&&t.push(e)}),t}var v=r(60381);let g=({children:e,custom:t,initial:r=!0,onExitComplete:i,presenceAffectsLayout:u=!0,mode:a="sync",propagate:d=!1})=>{let[p,g]=(0,c.oO)(d),x=(0,s.useMemo)(()=>m(e),[e]),y=d&&!p?[]:x.map(f),C=(0,s.useRef)(!0),Z=(0,s.useRef)(x),E=(0,o.h)(()=>new Map),[M,R]=(0,s.useState)(x),[k,w]=(0,s.useState)(x);(0,v.L)(()=>{C.current=!1,Z.current=x;for(let e=0;e<k.length;e++){let t=f(k[e]);y.includes(t)?E.delete(t):!0!==E.get(t)&&E.set(t,!1)}},[k,y.length,y.join("-")]);let L=[];if(x!==M){let e=[...x];for(let t=0;t<k.length;t++){let r=k[t],n=f(r);y.includes(n)||(e.splice(t,0,r),L.push(r))}"wait"===a&&L.length&&(e=L),w(m(e)),R(x);return}let{forceRender:P}=(0,s.useContext)(l.p);return(0,n.jsx)(n.Fragment,{children:k.map(e=>{let s=f(e),l=(!d||!!p)&&(x===k||y.includes(s));return(0,n.jsx)(h,{isPresent:l,initial:(!C.current||!!r)&&void 0,custom:l?void 0:t,presenceAffectsLayout:u,mode:a,onExitComplete:l?void 0:()=>{if(!E.has(s))return;E.set(s,!0);let e=!0;E.forEach(t=>{t||(e=!1)}),e&&(null==P||P(),w(Z.current),d&&(null==g||g()),i&&i())},children:e},s)})})}}};