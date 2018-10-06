/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory */import e from"./prefix.mjs";import{Component as t,createPortal as r,h as n}from"./react.mjs";var s=(e=>e)(new Map),a=()=>Array.from(s.entries()).reduce((e,[t,r])=>({...e,[t]:Array.from(r.values()).map(({rule:e})=>e).join("")}),{}),o=(()=>{const e=parseInt("ad",36),t=parseInt("zz",36),r=parseInt("aaa",36),n=parseInt("zzz",36);let s=e;return e=>{if(e){const t=parseInt(e,36);return s=Math.max(s,t),t.toString(36)}if((s+=s<t||s>=r?1:r-t)>n)throw new RangeError;return s.toString(36)}})(),c=(e=>({pub:t=>e.map(e=>e(t)),sub:t=>{let r=e.push(t)-1;return()=>delete e[r]}}))([]),i=(e="")=>(s.has(e)||s.set(e,new Map),(t,{id:r,rule:n}={})=>(s.get(e).has(t)||void 0===r||(s.get(e).set(t,{id:r,key:t,media:e,rule:n}),c.pub(a())),s.get(e).get(t))),u=e=>e.replace(/[A-Z]/g,"-$&").toLowerCase().replace(/^ms-/,"-ms-"),d=e=>Object.entries(e).reduce((e,[t,r])=>{switch(!0){case/^(number|string)$/.test(typeof r):return e.concat(`${u(t)}:${r}`);default:throw new TypeError}},[]).join(";");const l=(t,r="",n="")=>{if("object"!=typeof t)throw new TypeError;return Object.entries(t).reduce((t,[a,c])=>{switch(!0){case/^\$.*( |>|\+|~)\$.*$/.test(a):return((e,t,r="")=>{const n=Array.from(/(?:(\$[^:{]+)(:[^ +>{~]+)?)([ +>~])(?:(\$[^:{]+)(:[^{]+)?)/.exec(e)),[,a,c="",u,l,$=""]=n,m=d(t);i(r);const h=s.get(r).has(`${c}${a}`)?s.get(r).get(`${c}${a}`).id:i(r)(`${c}${a}`,{id:o()}).id,f=s.get(r).has(`${$}${l}`)?s.get(r).get(`${$}${l}`).id:i(r)(`${$}${l}`,{id:o()}).id,p=[].concat(c,u,$,m).join(""),g=n.slice(1,6),y=`.${h}${c}${u}.${f}${$}{${m}}`;i(r)(p,{id:g,rule:y})})(a,c,r),t;case/^\$(?:(?!( |>|\+|~|\$)).)*$/.test(a):return t.concat(((e,t="",r="")=>{const n=`${r}${e}`;if(i(t),!s.get(t).has(n)){const e=o();i(t)(n,{id:e})}return s.get(t).get(n)})(a,r,n).id);case"@media"===a.substring(0,6):return t.concat(l(c,a.substr(7),n));case":"===a[0]:return t.concat(l(c,r,`${n}${a}`));case"object"!=typeof c:{const d=((t,r)=>Object.entries(e({[t]:r})).reduce((e,[t,r])=>{switch(!0){case Array.isArray(r):r.forEach(r=>{const n=`${u(t)}:${r}`;e.includes(n)||e.splice(-1,0,n)});break;case/^(number|string)$/.test(typeof r):{const n=`${u(t)}:${r}`;e.includes(n)||e.splice(-1,0,n);break}}return e},[`${u(t)}:${r}`]).join(";"))(a,c);return t.concat(((e,t="",r="")=>{const n=`${r}${e}`;if(i(t),!s.get(t).has(n)){const s=o(),a=`.${s}${r}{${e}}`;i(t)(n,{id:s,rule:a})}return s.get(t).get(n)})(d,r,n).id)}}},[]).join(" ")};var $=e=>{const t=(e=>Object.entries(e).reduce((e,[t,r])=>e.concat(`${t}{${d(r)}}`),[]).join(""))(e);if(i(),!s.get("").has(t)){const e=o(),r=`@keyframes ${e}{${t}}`;i()(t,{id:e,rule:r})}return s.get("").get(t)};const m=e=>Object.entries(e).reduce((e,[t,r])=>("fontFamily"===t&&"string"!=typeof r?e.fontFamily=(e=>{const t=d(e);if(i(),!s.get("").has(t)){const e=o(),r=`@font-face{font-family:${e};${t}}`;i()(t,{id:e,rule:r})}return s.get("").get(t)})(r).id:"animationName"===t&&"string"!=typeof r?e.animationName=$(r).id:"object"==typeof r&&null!==r&&m(r),e),e);var h=e=>l(m(e)),f=e=>{const t=[/@font-face\{font-family:([^;]+)()?()?()?()?;([^}]*?)\}/,/@keyframes ([^{]+)()?()?()?()?\{((?:[^{]+\{[^}]*\})*?)\}/,/(?:\.([^:{]+)(:[^ +>{~]+)?)([ +>~])?(?:\.([^:{]+)(:[^{]+)?)?{([^}]*)}/];return Array.from(e).map(e=>{const{media:r}=e;let{textContent:n}=e;return t.reduce((e,t)=>{for(;t.exec(n);){const s=Array.from(t.exec(n)),a=s[3]?[].concat(s[2],s[3],s[5],s[6]).join(""):[].concat(s[2],s[6]).join(""),c=s[3]?s.slice(1,6):o(s[1]),u=s[0];e.push(i(r)(a,{id:c,rule:u})),n=n.replace(t,"")}return e},[])})};export default class extends t{constructor(e){super(e),this.canUseDOM=Boolean("undefined"!=typeof window&&window.document&&window.document.createElement),this.canUseDOM&&(this.nodes=document.head.querySelectorAll("style.rehydrate"),f(this.nodes),window.css=h),this.state={value:a()},this._hasUnmounted=!1,this.unsub=(()=>null)}componentDidMount(){this.nodes.forEach(e=>e.remove()),this.subscribe()}componentWillUnmount(){this.unsub(),this._hasUnmounted=!0}subscribe(){this.unsub=c.sub(e=>{this._hasUnmounted||this.setState(t=>e===t.value?null:{value:e})});const e=a();e!==this.state.value&&this.setState({value:e})}render(){const{render:e}=this.props,{value:t}=this.state,s=Object.entries(t).map(([e,t])=>n("style",{className:"rehydrate",dangerouslySetInnerHTML:{__html:`/*<![CDATA[*/${t}/*]]>*/`},media:e||null}));switch(!0){case this.canUseDOM:return r(s,document.head);case e:return s;default:return null}}}export{h as css,a as getCss};