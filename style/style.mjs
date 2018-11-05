/*! @copyright Peter T Bosse II | @license MIT | @link github.com/ptb/amory *//* eslint-disable */import{createElement as e,PureComponent as t,createPortal as n}from"./react.mjs";var r=(e=>e)(new Map),i=()=>Array.from(r.entries()).reduce((e,[t,n])=>({...e,[t]:Array.from(n.values()).map(({rule:e})=>e).join("")}),{}),o=(e=>({pub:t=>e.map(e=>e(t)),sub:t=>{let n=e.push(t)-1;return()=>delete e[n]}}))([]),a=(e="")=>(r.has(e)||r.set(e,new Map),(t,{id:n,rule:a}={})=>(r.get(e).has(t)||void 0===n||(r.get(e).set(t,{id:n,key:t,media:e,rule:a}),o.pub(i())),r.get(e).get(t)));const s=(()=>{const e=parseInt("ad",36),t=parseInt("zz",36),n=parseInt("aaa",36),r=parseInt("zzz",36);let i=e;return e=>{if(e){const t=parseInt(e,36);return i=Math.max(i,t),t.toString(36)}if((i+=i<t||i>=n?1:n-t)>r)throw new RangeError;return i.toString(36)}})();var c=e=>e.replace(/[A-Z]/g,"-$&").toLowerCase().replace(/^ms-/,"-ms-"),l=e=>Object.entries(e).reduce((e,[t,n])=>{switch(!0){case/^(number|string)$/.test(typeof n):return e.concat(`${c(t)}:${n}`);default:throw new TypeError}},[]).join(";");var u=e=>e.match(/(?:((?:element|isolate-override|plaintext))|((?:calc|cross-fade|filter|grab(?:bing)?|image-set|sticky|zoom-(?:in|out)))|((?:fill(?:-available)?|fit-content|isolate|(?:max|min)-content|stretch))|((?:pixelated)))/);const d=e=>e.replace(/[A-Z]/g,"-$&").toLowerCase();var p=e=>Object.entries(e).reduce((e,[t,n])=>{if("string"==typeof n)if(u(n)){const r=u(n).slice(1,5).filter(Boolean)[0];e[t]=(e=>[["Moz"],["Webkit"],["Webkit","Moz"],["Webkit","Moz","O"]][u(r).slice(1,5).findIndex(e=>e)])().map(e=>n.replace(r,`${d(e)}-${d(r)}`).trim()).concat(n)}else e[t]=n;return e},e),m=e=>[e=>{const t=new Map([["alignItems","WebkitBoxAlign"],["flexGrow","WebkitBoxFlex"],["flexWrap","WebkitBoxLines"],["justifyContent","WebkitBoxPack"]]),n=new Map([["flex",["-webkit-box","-webkit-flex","flex"]],["flex-end","end"],["flex-start","start"],["inline-flex",["-webkit-inline-box","-webkit-inline-flex","inline-flex"]],["nowrap","single"],["space-around","justify"],["space-between","justify"],["wrap","multiple"],["wrap-reverse","multiple"]]);return Object.entries(e).reduce((e,[r,i])=>("display"===r&&n.has(i)&&(e.display=n.get(i)),"flexDirection"===r&&"string"==typeof i&&(e.WebkitBoxDirection=i.match(/reverse/)?"reverse":"normal",e.WebkitBoxOrient=i.match(/column/)?"vertical":"horizontal"),t.has(r)&&(e[t.get(r)]=n.get(i)||i),e),e)},e=>{const t=["-webkit-",""],n=/((?:repeating-)?(?:linear|radial)-gradient)/gi;return Object.entries(e).reduce((e,[r,i])=>("string"==typeof i&&i.match(n)&&(e[r]=t.map(e=>i.replace(n,t=>e+t))),e),e)},e=>Object.entries(e).reduce((e,[t,n])=>((e=>{const t=(e=>e.match(/(?:((?:boxSizing|textAlignLast))|((?:tabSize))|((?:imageRendering|overscrollBehavior|textSpacing))|((?:object(?:Fit|Position)))|((?:align(?:Content|Items|Self)|animation(?:Delay|Direction|Duration|FillMode|IterationCount|Name|PlayState|TimingFunction)?|back(?:dropFilter|faceVisibility|groundClip)|borderBlock(?:End|Start)|boxDecorationBreak|break(?:After|Before|Inside)|clipPath|colorAdjust|filter|flex(?:Basis|Direction|Flow|Grow|Shrink|Wrap)?|fontKerning|justifyContent|marginBlock(?:End|Start)|mask(?:Border(?:Outset|Repeat|Slice|Source|Width)?(?:Clip|Composite|Image|Origin|Position|Repeat|Size)?)?|order|paddingBlock(?:End|Start)|perspective(?:Origin)?|shape(?:ImageThreshold|Margin|Outside)|text(?:DecorationSkip|Emphasis(?:Color|Position|Style))|transform(?:Origin|Style)?|transition(?:Delay|Duration|Property|TimingFunction)?))|((?:appearance|border(?:Inline(?:End|Start))|column(?:s|Count|Fill|Gap|Rule(?:Color|Style|Width)?|Span|Width)|font(?:FeatureSettings|LanguageOverride|VariantLigatures)|marginInline(?:End|Start)|padding(?:Inline(?:End|Start))|textDecoration(?:Color|Line|Style)?))|((?:hyphens|textSizeAdjust|userSelect))|((?:flow(?:From|Into)|regionFragment|scrollSnap(?:Coordinate|Destination|Points(?:X|Y)|Type)|writingMode))|((?:borderImage)))/))(e);return t?[["Moz"],["Moz","O"],["Ms"],["O"],["Webkit"],["Webkit","Moz"],["Webkit","Moz","Ms"],["Webkit","Ms"],["Webkit","O"]][t.slice(1,10).findIndex(e=>e)]:[]})(t).forEach(r=>{e[r+(e=>e.charAt(0).toUpperCase()+e.slice(1))(t)]=n}),e),e),e=>Object.entries(e).reduce((e,[t,n])=>{const r=t.replace(/[A-Z]/g,"-$&").toLowerCase();return e[r]=n,r!==t&&delete e[t],e},e),p].reduce((e,t)=>t(e),e),f=(e,t)=>Object.entries(m({[e]:t})).reduce((e,[t,n])=>{switch(!0){case Array.isArray(n):n.forEach(n=>{const r=`${c(t)}:${n}`;e.includes(r)||e.splice(-1,0,r)});break;case/^(number|string)$/.test(typeof n):{const r=`${c(t)}:${n}`;e.includes(r)||e.splice(-1,0,r);break}}return e},[`${c(e)}:${t}`]).join(";");const g=(e,t="",n="",i="")=>{if("object"!=typeof e)throw new TypeError;return Object.entries(e).reduce((e,[o,c])=>{switch(!0){case/^\$.*( |\+|>|~)/.test(o):return((e,t,n="",i="")=>{const o=Array.from(/(?:(\$[^[:{]+)([[:][^ +>{~]+]?)?)([ +>~])(?:(\$[^[:{]+)([[:][^{]+]?)?)/.exec(e)),[,c,u="",d,p,m=""]=o,f=l(t),g=`${i}${u}${c}`,h=`${i}${m}${p}`;a(n);const b=r.get(n).has(g)?r.get(n).get(g).id:a(n)(g,{id:`${i}${s()}`}).id,$=r.get(n).has(h)?r.get(n).get(h).id:a(n)(h,{id:`${i}${s()}`}).id,y=[].concat(i,u,d,i,m,f).join(""),x=o.slice(1,6),w=[".",b,u,d,".",$,m,"{",f,"}"].join("");a(n)(y,{id:x,rule:w})})(o,c,t,i),e;case/^\$/.test(o):return e.concat(((e,t="",n="",i="")=>{const o=`${i}${n}${e}`;if(a(t),!r.get(t).has(o)){const e=`${i}${s()}`;a(t)(o,{id:e})}return r.get(t).get(o)})(o,t,n,i).id);case/^@media/.test(o):return e.concat(g(c,o.substr(7),n,i));case/^[[:]/.test(o):return e.concat(g(c,t,`${n}${o}`,i));case"object"!=typeof c:{const l=f(o,c);return e.concat(((e,t="",n="",i="")=>{const o=`${i}${n}${e}`;if(a(t),!r.get(t).has(o)){const r=`${i}${s()}`,c=`.${r}${n}{${e}}`;a(t)(o,{id:r,rule:c})}return r.get(t).get(o)})(l,t,n,i).id)}}},[]).join(" ")};var h=(e,t="")=>{const n=(e=>Object.entries(e).reduce((e,[t,n])=>e.concat(`${t}{${l(n)}}`),[]).join(""))(e);if(a(),!r.get("").has(n)){const e=`${t}${s()}`,r=`@keyframes ${e}{${n}}`;a()(n,{id:e,rule:r})}return r.get("").get(n)};const b=(e,t="")=>Object.entries(e).reduce((e,[n,i])=>("fontFamily"===n&&"string"!=typeof i?e.fontFamily=((e,t="")=>{const n=l(e);if(a(),!r.get("").has(n)){const e=`${t}${s()}`,r=`@font-face{font-family:${e};${n}}`;a()(n,{id:e,rule:r})}return r.get("").get(n)})(i,t).id:"animationName"===n&&"string"!=typeof i?e.animationName=h(i,t).id:"object"==typeof i&&null!==i&&b(i,t),e),e);var $=(e,t="")=>g(b(e,t),"","",t),y=e=>{const t=[/@font-face\{font-family:([^;]+)()?()?()?()?;([^}]*?)\}/,/@keyframes ([^{]+)()?()?()?()?\{((?:[^{]+\{[^}]*\})*?)\}/,/(?:\.([^:{]+)(:[^ +>{~]+)?)([ +>~])?(?:\.([^:{]+)(:[^{]+)?)?{([^}]*)}/];return Array.from(e).map(e=>{const{media:n}=e;let{textContent:r}=e;return t.reduce((e,t)=>{for(;t.exec(r);){const i=Array.from(t.exec(r)),o=i[3]?[].concat(i[2],i[3],i[5],i[6]).join(""):[].concat(i[2],i[6]).join(""),c=i[3]?i.slice(1,6):s(i[1]),l=i[0];e.push(a(n)(o,{id:c,rule:l})),r=r.replace(t,"")}return e},[])})};class Style extends t{constructor(e){super(e),this.canUseDOM=Boolean("undefined"!=typeof window&&window.document&&window.document.createElement),this.canUseDOM&&(this.nodes=document.head.querySelectorAll("style.rehydrate"),y(this.nodes),window.css=$),this.state={value:i()},this._hasUnmounted=!1,this.unsub=(()=>null)}componentDidMount(){this.nodes.forEach(e=>e.remove()),this.subscribe()}componentWillUnmount(){this.unsub(),this._hasUnmounted=!0}subscribe(){this.unsub=o.sub(e=>{this._hasUnmounted||this.setState(t=>e===t.value?null:{value:e})});const e=i();e!==this.state.value&&this.setState({value:e})}render(){const{render:t}=this.props,{value:r}=this.state,i=Object.entries(r).map(([t,n])=>e("style",{className:"rehydrate",dangerouslySetInnerHTML:{__html:`/*<![CDATA[*/${n}/*]]>*/`},media:t||null}));switch(!0){case this.canUseDOM:return n(i,document.head);case t:return i;default:return null}}}export{$ as css,i as getCss,Style};