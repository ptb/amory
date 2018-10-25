/*! @copyright Facebook, Inc. | @license MIT | @link github.com/facebook/react | @version 16.6.0 */import e from"./react.mjs";var t=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable;var o=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},r=0;r<10;r++)t["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(t).map(function(e){return t[e]}).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach(function(e){n[e]=e}),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(e){return!1}}()?Object.assign:function(e,o){for(var a,i,l=function(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}(e),u=1;u<arguments.length;u++){for(var c in a=Object(arguments[u]))r.call(a,c)&&(l[c]=a[c]);if(t){i=t(a);for(var s=0;s<i.length;s++)n.call(a,i[s])&&(l[i[s]]=a[i[s]])}}return l};function a(e){for(var t=arguments.length-1,r="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=0;n<t;n++)r+="&args[]="+encodeURIComponent(arguments[n+1]);!function(e,t,r,n,o,a,i,l){if(!e){if(e=void 0,void 0===t)e=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var u=[r,n,o,a,i,l],c=0;(e=Error(t.replace(/%s/g,function(){return u[c++]}))).name="Invariant Violation"}throw e.framesToPop=1,e}}(!1,"Minified React error #"+e+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",r)}var i="function"==typeof Symbol&&Symbol.for,l=i?Symbol.for("react.portal"):60106,u=i?Symbol.for("react.fragment"):60107,c=i?Symbol.for("react.strict_mode"):60108,s=i?Symbol.for("react.profiler"):60114,p=i?Symbol.for("react.provider"):60109,f=i?Symbol.for("react.context"):60110,d=i?Symbol.for("react.concurrent_mode"):60111,h=i?Symbol.for("react.forward_ref"):60112,y=i?Symbol.for("react.suspense"):60113,m=i?Symbol.for("react.memo"):60115,v=i?Symbol.for("react.lazy"):60116;function g(e){if(null==e)return null;if("function"==typeof e)return e.displayName||e.name||null;if("string"==typeof e)return e;switch(e){case d:return"ConcurrentMode";case u:return"Fragment";case l:return"Portal";case s:return"Profiler";case c:return"StrictMode";case y:return"Suspense"}if("object"==typeof e)switch(e.$$typeof){case f:return"Context.Consumer";case p:return"Context.Provider";case h:var t=e.render;return t=t.displayName||t.name||"",e.displayName||(""!==t?"ForwardRef("+t+")":"ForwardRef");case m:return g(e.type);case v:if(e=1===e._status?e._result:null)return g(e)}return null}var w=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,x=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,b=Object.prototype.hasOwnProperty,k={},S={};function F(e){return!!b.call(S,e)||!b.call(k,e)&&(x.test(e)?S[e]=!0:(k[e]=!0,!1))}function C(e,t,r,n){if(null==t||function(e,t,r,n){if(null!==r&&0===r.type)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return!n&&(null!==r?!r.acceptsBooleans:"data-"!==(e=e.toLowerCase().slice(0,5))&&"aria-"!==e);default:return!1}}(e,t,r,n))return!0;if(n)return!1;if(null!==r)switch(r.type){case 3:return!t;case 4:return!1===t;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function O(e,t,r,n,o){this.acceptsBooleans=2===t||3===t||4===t,this.attributeName=n,this.attributeNamespace=o,this.mustUseProperty=r,this.propertyName=e,this.type=t}var E={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){E[e]=new O(e,0,!1,e,null)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];E[t]=new O(t,1,!1,e[1],null)}),["contentEditable","draggable","spellCheck","value"].forEach(function(e){E[e]=new O(e,2,!1,e.toLowerCase(),null)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){E[e]=new O(e,2,!1,e,null)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){E[e]=new O(e,3,!1,e.toLowerCase(),null)}),["checked","multiple","muted","selected"].forEach(function(e){E[e]=new O(e,3,!0,e,null)}),["capture","download"].forEach(function(e){E[e]=new O(e,4,!1,e,null)}),["cols","rows","size","span"].forEach(function(e){E[e]=new O(e,6,!1,e,null)}),["rowSpan","start"].forEach(function(e){E[e]=new O(e,5,!1,e.toLowerCase(),null)});var N=/[\-:]([a-z])/g;function M(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(N,M);E[t]=new O(t,1,!1,e,null)}),"xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(N,M);E[t]=new O(t,1,!1,e,"http://www.w3.org/1999/xlink")}),["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(N,M);E[t]=new O(t,1,!1,e,"http://www.w3.org/XML/1998/namespace")}),E.tabIndex=new O("tabIndex",1,!1,"tabindex",null);var _=/["'&<>]/;function I(e){if("boolean"==typeof e||"number"==typeof e)return""+e;e=""+e;var t=_.exec(e);if(t){var r,n="",o=0;for(r=t.index;r<e.length;r++){switch(e.charCodeAt(r)){case 34:t="&quot;";break;case 38:t="&amp;";break;case 39:t="&#x27;";break;case 60:t="&lt;";break;case 62:t="&gt;";break;default:continue}o!==r&&(n+=e.substring(o,r)),o=r+1,n+=t}e=o!==r?n+e.substring(o,r):n}return e}var T={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};var j={area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0},D=o({menuitem:!0},j),P={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},V=["Webkit","ms","Moz","O"];Object.keys(P).forEach(function(e){V.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),P[t]=P[e]})});var L=/([A-Z])/g,W=/^ms-/,A=e.Children.toArray,R=w.ReactCurrentOwner,z={readContext:function(e){return e._currentValue}},$={listing:!0,pre:!0,textarea:!0},H=/^[a-zA-Z][a-zA-Z:_\.\-\d]*$/,U={},q={};var Z={};var B=Object.prototype.hasOwnProperty,G={children:null,dangerouslySetInnerHTML:null,suppressContentEditableWarning:null,suppressHydrationWarning:null};function X(e,t){void 0===e&&a("152",g(t)||"Component")}function Y(t,r){function n(e,n){var i=function(e,t){var r=e.contextType;if("object"==typeof r&&null!==r)return r._currentValue;if(e=e.contextTypes){for(var n in r={},e)r[n]=t[n];t=r}else t=Z;return t}(n,r),l=[],u=!1,c={isMounted:function(){return!1},enqueueForceUpdate:function(){if(null===l)return null},enqueueReplaceState:function(e,t){u=!0,l=[t]},enqueueSetState:function(e,t){if(null===l)return null;l.push(t)}},s=void 0;if(n.prototype&&n.prototype.isReactComponent){if(s=new n(e.props,i,c),"function"==typeof n.getDerivedStateFromProps){var p=n.getDerivedStateFromProps.call(null,e.props,s.state);null!=p&&(s.state=o({},s.state,p))}}else if(null==(s=n(e.props,i,c))||null==s.render)return void X(t=s,n);if(s.props=e.props,s.context=i,s.updater=c,void 0===(c=s.state)&&(s.state=c=null),"function"==typeof s.UNSAFE_componentWillMount||"function"==typeof s.componentWillMount)if("function"==typeof s.componentWillMount&&"function"!=typeof n.getDerivedStateFromProps&&s.componentWillMount(),"function"==typeof s.UNSAFE_componentWillMount&&"function"!=typeof n.getDerivedStateFromProps&&s.UNSAFE_componentWillMount(),l.length){c=l;var f=u;if(l=null,u=!1,f&&1===c.length)s.state=c[0];else{p=f?c[0]:s.state;var d=!0;for(f=f?1:0;f<c.length;f++){var h=c[f];null!=(h="function"==typeof h?h.call(s,p,e.props,i):h)&&(d?(d=!1,p=o({},p,h)):o(p,h))}s.state=p}}else l=null;if(X(t=s.render(),n),e=void 0,"function"==typeof s.getChildContext&&"object"==typeof(i=n.childContextTypes))for(var y in e=s.getChildContext())y in i||a("108",g(n)||"Unknown",y);e&&(r=o({},r,e))}for(;e.isValidElement(t);){var i=t,l=i.type;if("function"!=typeof l)break;n(i,l)}return{child:t,context:r}}var J,K=function(){function t(r,n){if(!(this instanceof t))throw new TypeError("Cannot call a class as a function");e.isValidElement(r)?r.type!==u?r=[r]:(r=r.props.children,r=e.isValidElement(r)?[r]:A(r)):r=A(r),this.stack=[{type:null,domNamespace:T.html,children:r,childIndex:0,context:Z,footer:""}],this.exhausted=!1,this.currentSelectValue=null,this.previousWasTextNode=!1,this.makeStaticMarkup=n,this.contextIndex=-1,this.contextStack=[],this.contextValueStack=[]}return t.prototype.pushProvider=function(e){var t=++this.contextIndex,r=e.type._context,n=r._currentValue;this.contextStack[t]=r,this.contextValueStack[t]=n,r._currentValue=e.props.value},t.prototype.popProvider=function(){var e=this.contextIndex,t=this.contextStack[e],r=this.contextValueStack[e];this.contextStack[e]=null,this.contextValueStack[e]=null,this.contextIndex--,t._currentValue=r},t.prototype.read=function(e){if(this.exhausted)return null;R.currentDispatcher=z;try{for(var t="";t.length<e;){if(0===this.stack.length){this.exhausted=!0;break}var r=this.stack[this.stack.length-1];if(r.childIndex>=r.children.length){var n=r.footer;t+=n,""!==n&&(this.previousWasTextNode=!1),this.stack.pop(),"select"===r.type?this.currentSelectValue=null:null!=r.type&&null!=r.type.type&&r.type.type.$$typeof===p&&this.popProvider(r.type)}else{var o=r.children[r.childIndex++];t+=this.render(o,r.context,r.domNamespace)}}return t}finally{R.currentDispatcher=null}},t.prototype.render=function(t,r,n){if("string"==typeof t||"number"==typeof t)return""===(n=""+t)?"":this.makeStaticMarkup?I(n):this.previousWasTextNode?"\x3c!-- --\x3e"+I(n):(this.previousWasTextNode=!0,I(n));if(t=(r=Y(t,r)).child,r=r.context,null===t||!1===t)return"";if(!e.isValidElement(t)){if(null!=t&&null!=t.$$typeof){var i=t.$$typeof;i===l&&a("257"),a("258",i.toString())}return t=A(t),this.stack.push({type:null,domNamespace:n,children:t,childIndex:0,context:r,footer:""}),""}if("string"==typeof(i=t.type))return this.renderDOM(t,r,n);switch(i){case c:case d:case s:case u:return t=A(t.props.children),this.stack.push({type:null,domNamespace:n,children:t,childIndex:0,context:r,footer:""}),"";case y:a("294")}if("object"==typeof i&&null!==i)switch(i.$$typeof){case h:return t=A(i.render(t.props,t.ref)),this.stack.push({type:null,domNamespace:n,children:t,childIndex:0,context:r,footer:""}),"";case m:return t=[e.createElement(i.type,o({ref:t.ref},t.props))],this.stack.push({type:null,domNamespace:n,children:t,childIndex:0,context:r,footer:""}),"";case p:return n={type:t,domNamespace:n,children:i=A(t.props.children),childIndex:0,context:r,footer:""},this.pushProvider(t),this.stack.push(n),"";case f:return i=A(t.props.children(t.type._currentValue)),this.stack.push({type:t,domNamespace:n,children:i,childIndex:0,context:r,footer:""}),"";case v:a("295")}a("130",null==i?i:typeof i,"")},t.prototype.renderDOM=function(t,r,n){var i=t.type.toLowerCase();U.hasOwnProperty(i)||(H.test(i)||a("65",i),U[i]=!0);var l=t.props;if("input"===i)l=o({type:void 0},l,{defaultChecked:void 0,defaultValue:void 0,value:null!=l.value?l.value:l.defaultValue,checked:null!=l.checked?l.checked:l.defaultChecked});else if("textarea"===i){var u=l.value;if(null==u){u=l.defaultValue;var c=l.children;null!=c&&(null!=u&&a("92"),Array.isArray(c)&&(1>=c.length||a("93"),c=c[0]),u=""+c),null==u&&(u="")}l=o({},l,{value:void 0,children:""+u})}else if("select"===i)this.currentSelectValue=null!=l.value?l.value:l.defaultValue,l=o({},l,{value:void 0});else if("option"===i){c=this.currentSelectValue;var s=function(t){if(null==t)return t;var r="";return e.Children.forEach(t,function(e){null!=e&&(r+=e)}),r}(l.children);if(null!=c){var p=null!=l.value?l.value+"":s;if(u=!1,Array.isArray(c)){for(var f=0;f<c.length;f++)if(""+c[f]===p){u=!0;break}}else u=""+c===p;l=o({selected:void 0,children:void 0},l,{selected:u,children:s})}}for(x in(u=l)&&(D[i]&&(null!=u.children||null!=u.dangerouslySetInnerHTML)&&a("137",i,""),null!=u.dangerouslySetInnerHTML&&(null!=u.children&&a("60"),"object"==typeof u.dangerouslySetInnerHTML&&"__html"in u.dangerouslySetInnerHTML||a("61")),null!=u.style&&"object"!=typeof u.style&&a("62","")),u=l,c=this.makeStaticMarkup,s=1===this.stack.length,p="<"+t.type,u)if(B.call(u,x)){var d=u[x];if(null!=d){if("style"===x){f=void 0;var h="",y="";for(f in d)if(d.hasOwnProperty(f)){var m=0===f.indexOf("--"),v=d[f];if(null!=v){var g=f;if(q.hasOwnProperty(g))g=q[g];else{var w=g.replace(L,"-$1").toLowerCase().replace(W,"-ms-");g=q[g]=w}h+=y+g+":",y=f,h+=m=null==v||"boolean"==typeof v||""===v?"":m||"number"!=typeof v||0===v||P.hasOwnProperty(y)&&P[y]?(""+v).trim():v+"px",y=";"}}d=h||null}f=null;e:if(m=i,v=u,-1===m.indexOf("-"))m="string"==typeof v.is;else switch(m){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":m=!1;break e;default:m=!0}m?G.hasOwnProperty(x)||(f=F(f=x)&&null!=d?f+'="'+I(d)+'"':""):(m=x,f=d,d=E.hasOwnProperty(m)?E[m]:null,(v="style"!==m)&&(v=null!==d?0===d.type:2<m.length&&("o"===m[0]||"O"===m[0])&&("n"===m[1]||"N"===m[1])),v||C(m,f,d,!1)?f="":null!==d?(m=d.attributeName,f=3===(d=d.type)||4===d&&!0===f?m+'=""':m+'="'+I(f)+'"'):f=F(m)?m+'="'+I(f)+'"':""),f&&(p+=" "+f)}}c||s&&(p+=' data-reactroot=""');var x=p;u="",j.hasOwnProperty(i)?x+="/>":(x+=">",u="</"+t.type+">");e:{if(null!=(c=l.dangerouslySetInnerHTML)){if(null!=c.__html){c=c.__html;break e}}else if("string"==typeof(c=l.children)||"number"==typeof c){c=I(c);break e}c=null}return null!=c?(l=[],$[i]&&"\n"===c.charAt(0)&&(x+="\n"),x+=c):l=A(l.children),t=t.type,n=null==n||"http://www.w3.org/1999/xhtml"===n?function(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}(t):"http://www.w3.org/2000/svg"===n&&"foreignObject"===t?"http://www.w3.org/1999/xhtml":n,this.stack.push({domNamespace:n,type:i,children:l,childIndex:0,context:r,footer:u}),this.previousWasTextNode=!1,x},t}(),Q={renderToString:function(e){return new K(e,!1).read(1/0)},renderToStaticMarkup:function(e){return new K(e,!0).read(1/0)},renderToNodeStream:function(){a("207")},renderToStaticNodeStream:function(){a("208")},version:"16.6.0"},ee={default:Q},te=ee&&Q||ee,re=te.default||te,ne=(function(e){e.exports=re}(J={exports:{}},J.exports),J.exports);const{renderToNodeStream:oe,renderToStaticMarkup:ae,renderToStaticNodeStream:ie,renderToString:le,version:ue}=ne;export default ne;export{oe as renderToNodeStream,ae as renderToStaticMarkup,ie as renderToStaticNodeStream,le as renderToString,ue as version};