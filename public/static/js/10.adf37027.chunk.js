(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[10],{100:function(e,t,n){},101:function(e,t,n){},102:function(e,t,n){},103:function(e,t,n){"use strict";var a=n(4),r=n(99),c=n(0),o=n.n(c),s=n(97),i=(n(106),function(e,t){switch(t.type){case"CHANGE":return Object(r.a)({},e,{value:t.val,isValid:Object(s.d)(t.val,t.validators)});case"TOUCH":return Object(r.a)({},e,{isTouched:!0});default:return e}});t.a=function(e){var t=function(t){m({type:"CHANGE",val:t.target.value,validators:e.validators})},n=function(e){m({type:"TOUCH"})},r={value:e.initailValue||"",isValid:e.initailValid||!1,isTouched:!1},s=Object(c.useReducer)(i,r),u=Object(a.a)(s,2),l=u[0],m=u[1],d=e.id,f=e.onInput,p=l.value,b=l.isValid;Object(c.useEffect)((function(){f(d,p,b)}),[d,p,b,f]);var v="input"===e.element?o.a.createElement("input",{id:e.id,type:e.type,placeholder:e.placeholder,onChange:t,onBlur:n,value:l.value}):o.a.createElement("textarea",{id:e.id,rows:e.rows||3,onChange:t,onBlur:n,value:l.value});return o.a.createElement("div",{className:"form-control ".concat(!l.isValid&&l.isTouched&&"form-control--invalid")},o.a.createElement("label",{htmlFor:e.id},e.label),v,!l.isValid&&l.isTouched&&o.a.createElement("p",null,e.errorText))}},104:function(e,t,n){"use strict";n.d(t,"a",(function(){return i}));var a=n(4),r=n(98),c=n(99),o=n(0),s=function(e,t){switch(t.type){case"INPUT_CHANGE":var n=!0;for(var a in e.inputs)e.inputs[a]&&(n=a===t.inputId?n&&t.isValid:n&&e.inputs[a].isValid);return Object(c.a)({},e,{inputs:Object(c.a)({},e.inputs,Object(r.a)({},t.inputId,{value:t.value,isValid:t.isValid})),isValid:n});case"SET_DATA":return Object(c.a)({},e,{inputs:t.inputs,isValid:t.formIsValid});default:return e}},i=function(e,t){var n=Object(o.useReducer)(s,{inputs:e,isValid:t}),r=Object(a.a)(n,2),c=r[0],i=r[1];return[c,Object(o.useCallback)((function(e,t,n){i({type:"INPUT_CHANGE",value:t,isValid:n,inputId:e})}),[]),Object(o.useCallback)((function(e,t){i({type:"SET_DATA",inputs:e,formIsValid:t})}),[])]}},105:function(e,t,n){"use strict";n.d(t,"a",(function(){return r}));var a=n(23);function r(e){if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(e=Object(a.a)(e))){var t=0,n=function(){};return{s:n,n:function(){return t>=e.length?{done:!0}:{done:!1,value:e[t++]}},e:function(e){throw e},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var r,c,o=!0,s=!1;return{s:function(){r=e[Symbol.iterator]()},n:function(){var e=r.next();return o=e.done,e},e:function(e){s=!0,c=e},f:function(){try{o||null==r.return||r.return()}finally{if(s)throw c}}}}},106:function(e,t,n){},108:function(e,t,n){"use strict";var a=n(0),r=n.n(a);n(113);t.a=function(e){var t=e.image,n=e.alt,a=e.style,c=e.className,o=e.width;return r.a.createElement("div",{className:"avatar ".concat(c),style:a},r.a.createElement("img",{src:t,alt:n,style:{width:o,height:o}}))}},113:function(e,t,n){},122:function(e,t,n){},123:function(e,t,n){},147:function(e,t,n){"use strict";n.r(t);var a=n(98),r=n(38),c=n(15),o=n.n(c),s=n(22),i=n(4),u=n(0),l=n.n(u),m=n(35),d=n(11),f=n(95),p=n(94),b=n(36),v=(n(122),n(9)),h=n(40),E=n(103),g=n(104),O=n(97),y=n(93),j=(n(123),function(e){var t=e.msg,n=e.messageDeleteHandler,a=e.getUserMessages,r=(e.contacts,Object(u.useContext)(h.a)),c=Object(m.a)().sendRequest,i=Object(u.useContext)(d.a).token,f=function(){var e=Object(s.a)(o.a.mark((function e(t,r){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,c("".concat("https://placesharer.herokuapp.com/api","/user/messages/").concat(t,"/").concat(r),"DELETE",null,{Authorization:"Bearer "+i});case 2:n(r),a(t);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),p=function(e){return new Date(e).toLocaleString("en-NL")};return l.a.createElement("div",{key:t._id,className:"mContainer ".concat(t.isSent?"myMsg":"userMsg")},l.a.createElement("div",{className:"msgInfo ".concat(t.isSent?"toRyt":"toLeft")},t.isSent?l.a.createElement(u.Fragment,null,l.a.createElement("p",null,p(t.date)),l.a.createElement("button",{onClick:function(){return f(r.id,t._id)}},"x")):l.a.createElement(u.Fragment,null,l.a.createElement("button",{onClick:function(){return f(r.id,t._id)}},"x"),l.a.createElement("p",null,p(t.date)))),l.a.createElement("p",null,t.message))}),_=n(108);t.default=function(){var e=Object(u.useState)([]),t=Object(i.a)(e,2),n=t[0],c=t[1],N=Object(m.a)(),x=N.isLoading,k=N.error,w=N.sendRequest,C=N.clearError,S=Object(u.useContext)(d.a).token,T=Object(u.useContext)(h.a),I=Object(u.useState)(T.messagesData),A=Object(i.a)(I,2),V=A[0],D=A[1],P=Object(u.useState)(!0),M=Object(i.a)(P,2),U=M[0],H=M[1],L=Object(u.useState)(T.textedUser),R=Object(i.a)(L,2),B=R[0],G=R[1],z=Object(u.useRef)(),F=function(){z.current.scrollIntoView({behavior:"smooth"})},J=Object(g.a)({message:{value:"",isValid:!1}},!1),X=Object(i.a)(J,2),q=X[0],Q=X[1],K=function(){var e=Object(s.a)(o.a.mark((function e(){var t;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w("".concat("https://placesharer.herokuapp.com/api","/user/messages"),"GET",null,{Authorization:"Bearer ".concat(S)});case 3:t=e.sent,c(t.corresponders),F(),e.next=10;break;case 8:e.prev=8,e.t0=e.catch(0);case 10:case"end":return e.stop()}}),e,null,[[0,8]])})));return function(){return e.apply(this,arguments)}}();Object(u.useEffect)((function(){K()}),[w,S,T.textedUser]);var W=function(){var e=Object(s.a)(o.a.mark((function e(t){var n,a,c;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),n=T.id,a=q.inputs.message.value,e.prev=3,e.next=6,w("".concat("https://placesharer.herokuapp.com/api","/user/messages/").concat(n),"POST",JSON.stringify({message:a}),{Authorization:"Bearer "+S,"Content-Type":"application/json"});case 6:c=e.sent,D([].concat(Object(r.a)(V),[{message:a,isSent:!0,_id:c.messageId}])),F(),$(n),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(3),console.error(e.t0);case 15:case"end":return e.stop()}}),e,null,[[3,12]])})));return function(t){return e.apply(this,arguments)}}(),$=function(){var e=Object(s.a)(o.a.mark((function e(t){var n,a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t,e.prev=1,e.next=4,w("".concat("https://placesharer.herokuapp.com/api","/user/messages/").concat(n),"GET",null,{Authorization:"Bearer "+S});case 4:a=e.sent,K(),D(a.messages),T.id=n,e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),console.error(e.t0);case 13:case"end":return e.stop()}}),e,null,[[1,10]])})));return function(t){return e.apply(this,arguments)}}(),Y=function(){var e=Object(s.a)(o.a.mark((function e(t){var a;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w("".concat("https://placesharer.herokuapp.com/api","/user/messages/").concat(t),"DELETE",null,{Authorization:"Bearer "+S});case 3:a=n.filter((function(e){return e._id!==t})),c(a),t===T.id&&(G(""),T.textedUser=""),D([]),K(),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(t){return e.apply(this,arguments)}}(),Z=function(e){D((function(t){return t.filter((function(t){return t.id!==e}))}))};return l.a.createElement(l.a.Fragment,null,x&&l.a.createElement(b.a,{asOverlay:!0}),l.a.createElement(p.a,{error:k,onClear:C}),!x&&l.a.createElement(f.a,{className:"messages__card"},l.a.createElement("div",{className:U?"contacts__container contact__container-mobile":"contacts__container contact__container-hidden"},l.a.createElement("h2",{className:"header"},"Recent"),l.a.createElement("div",{className:"contacts__box"},n.length>0&&n.map((function(e){return l.a.createElement(f.a,Object(a.a)({className:"user-item__content",key:e.corresponder._id},"className","user-item__content ".concat(T.id===e.corresponder._id&&"activatedContact")),l.a.createElement("div",{onClick:function(){$(e.corresponder._id),e.corresponder&&(G(e.corresponder.name),T.textedUser=e.corresponder.name),H(!1)},className:"cardWidth"},l.a.createElement("div",{className:"user-item__image m-1"},l.a.createElement(_.a,{image:e.corresponder.image,alt:e.corresponder.name}))),l.a.createElement("div",{className:"user-item__info m-1"},l.a.createElement("h3",null,e.corresponder.name)),l.a.createElement("button",{onClick:function(){return Y(e.corresponder._id)}},"X"))}))),l.a.createElement("div",{className:"innerBox"},0===n.length&&l.a.createElement(v.b,{className:"link-text",to:"/"},"Text a user!"))),l.a.createElement("div",{className:U?"message__box message__box-hidden":"message__box message__box-mobile"},l.a.createElement("h2",{className:"header"},"Messages ".concat(B&&"with ".concat(B))),l.a.createElement("a",{onClick:function(){H(!0)},className:"mobile-hidden"},"BACK"),l.a.createElement("div",{className:"msgsContainer"},V.length>0?V.map((function(e,t){return l.a.createElement(j,{key:t,msg:e,messageDeleteHandler:Z,getUserMessages:$,contacts:n})})):l.a.createElement("div",null,"Start a message!"),l.a.createElement("div",{ref:z})),l.a.createElement("form",{onSubmit:W},l.a.createElement(E.a,{id:"message",element:"input",type:"text",validators:[Object(O.c)()],errorText:"Please enter your message",onInput:Q}),l.a.createElement(y.a,{type:"submit"},"Send")))))}},93:function(e,t,n){"use strict";var a=n(0),r=n.n(a),c=n(9);n(102);t.a=function(e){return e.href?r.a.createElement("a",{className:"button button--".concat(e.size||"default"," ").concat(e.inverse&&"button--inverse"," ").concat(e.danger&&"button--danger"),href:e.href},e.children):e.to?r.a.createElement(c.b,{to:e.to,exact:e.exact,className:"button button--".concat(e.size||"default"," ").concat(e.inverse&&"button--inverse"," ").concat(e.danger&&"button--danger")},e.children):r.a.createElement("button",{className:"button button--".concat(e.size||"default"," ").concat(e.inverse&&"button--inverse"," ").concat(e.danger&&"button--danger"),type:e.type,onClick:e.onClick,disabled:e.disabled},e.children)}},94:function(e,t,n){"use strict";var a=n(0),r=n.n(a),c=n(96),o=n(93);t.a=function(e){var t=e.error,n=e.onClear,a=e.header;return r.a.createElement(c.a,{onCancel:n,header:a||"An Error Occurred!!!",show:!!t,footer:r.a.createElement(o.a,{onClick:n},"Okay")},r.a.createElement("div",null,t))}},95:function(e,t,n){"use strict";var a=n(0),r=n.n(a);n(100);t.a=function(e){return r.a.createElement("div",{className:"card ".concat(e.className),style:e.style},e.children)}},96:function(e,t,n){"use strict";var a=n(0),r=n.n(a),c=n(12),o=n.n(c),s=(n(101),n(90)),i=n(37),u=function(e){var t=r.a.createElement("div",{className:"modal ".concat(e.className),style:e.style},r.a.createElement("header",{className:"modal__header ".concat(e.headerClass)},r.a.createElement("h2",null,e.header)),r.a.createElement("form",{onSubmit:e.onSubmit?e.onSubmit:function(e){return e.preventDefault()}},r.a.createElement("div",{className:"modal__content ".concat(e.contentClass)},e.children),r.a.createElement("footer",{className:"modal__footer ".concat(e.footerClass)},e.footer)));return o.a.createPortal(t,document.getElementById("modal-hook"))};t.a=function(e){return r.a.createElement(a.Fragment,null,e.show&&r.a.createElement(i.a,{onClick:e.onCancel}),r.a.createElement(s.a,{in:e.show,mountOnEnter:!0,unmountOnExit:!0,timeout:200,classNames:"modal"},r.a.createElement(u,e)))}},97:function(e,t,n){"use strict";n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return c})),n.d(t,"a",(function(){return o})),n.d(t,"d",(function(){return s}));var a=n(105),r=function(){return{type:"REQUIRE"}},c=function(e){return{type:"MINLENGTH",val:e}},o=function(){return{type:"EMAIL"}},s=function(e,t){var n,r=!0,c=Object(a.a)(t);try{for(c.s();!(n=c.n()).done;){var o=n.value;"REQUIRE"===o.type&&(r=r&&e.trim().length>0),"MINLENGTH"===o.type&&(r=r&&e.trim().length>=o.val),"MAXLENGTH"===o.type&&(r=r&&e.trim().length<=o.val),"MIN"===o.type&&(r=r&&+e>=o.val),"MAX"===o.type&&(r=r&&+e<=o.val),"EMAIL"===o.type&&(r=r&&/^\S+@\S+\.\S+$/.test(e))}}catch(s){c.e(s)}finally{c.f()}return r}},98:function(e,t,n){"use strict";function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n.d(t,"a",(function(){return a}))},99:function(e,t,n){"use strict";n.d(t,"a",(function(){return c}));var a=n(98);function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){Object(a.a)(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}}}]);
//# sourceMappingURL=10.adf37027.chunk.js.map