(window.webpackJsonp=window.webpackJsonp||[]).push([[69],{735:function(e,t,n){!function(e){"use strict";function t(e){for(var t={},n=e.split(" "),r=0;r<n.length;++r)t[n[r]]=!0;return t}e.defineMode("modelica",function(t,n){var r=t.indentUnit,o=n.keywords||{},i=n.builtin||{},a=n.atoms||{},l=/[;=\(:\),{}.*<>+\-\/^\[\]]/,u=/(:=|<=|>=|==|<>|\.\+|\.\-|\.\*|\.\/|\.\^)/,s=/[0-9]/,c=/[_a-zA-Z]/;function f(e,t){return e.skipToEnd(),t.tokenize=null,"comment"}function p(e,t){for(var n,r=!1;n=e.next();){if(r&&"/"==n){t.tokenize=null;break}r="*"==n}return"comment"}function k(e,t){for(var n,r=!1;null!=(n=e.next());){if('"'==n&&!r){t.tokenize=null,t.sol=!1;break}r=!r&&"\\"==n}return"string"}function m(e,t){for(e.eatWhile(s);e.eat(s)||e.eat(c););var n=e.current();return!t.sol||"package"!=n&&"model"!=n&&"when"!=n&&"connector"!=n?t.sol&&"end"==n&&t.level>0&&t.level--:t.level++,t.tokenize=null,t.sol=!1,o.propertyIsEnumerable(n)?"keyword":i.propertyIsEnumerable(n)?"builtin":a.propertyIsEnumerable(n)?"atom":"variable"}function d(e,t){for(;e.eat(/[^']/););return t.tokenize=null,t.sol=!1,e.eat("'")?"variable":"error"}function h(e,t){return e.eatWhile(s),e.eat(".")&&e.eatWhile(s),(e.eat("e")||e.eat("E"))&&(e.eat("-")||e.eat("+"),e.eatWhile(s)),t.tokenize=null,t.sol=!1,"number"}return{startState:function(){return{tokenize:null,level:0,sol:!0}},token:function(e,t){if(null!=t.tokenize)return t.tokenize(e,t);if(e.sol()&&(t.sol=!0),e.eatSpace())return t.tokenize=null,null;var n=e.next();if("/"==n&&e.eat("/"))t.tokenize=f;else if("/"==n&&e.eat("*"))t.tokenize=p;else{if(u.test(n+e.peek()))return e.next(),t.tokenize=null,"operator";if(l.test(n))return t.tokenize=null,"operator";if(c.test(n))t.tokenize=m;else if("'"==n&&e.peek()&&"'"!=e.peek())t.tokenize=d;else if('"'==n)t.tokenize=k;else{if(!s.test(n))return t.tokenize=null,"error";t.tokenize=h}}return t.tokenize(e,t)},indent:function(t,n){if(null!=t.tokenize)return e.Pass;var o=t.level;return/(algorithm)/.test(n)&&o--,/(equation)/.test(n)&&o--,/(initial algorithm)/.test(n)&&o--,/(initial equation)/.test(n)&&o--,/(end)/.test(n)&&o--,o>0?r*o:0},blockCommentStart:"/*",blockCommentEnd:"*/",lineComment:"//"}}),function(t,n){"string"==typeof t&&(t=[t]);var r=[];function o(e){if(e)for(var t in e)e.hasOwnProperty(t)&&r.push(t)}o(n.keywords),o(n.builtin),o(n.atoms),r.length&&(n.helperType=t[0],e.registerHelper("hintWords",t[0],r));for(var i=0;i<t.length;++i)e.defineMIME(t[i],n)}(["text/x-modelica"],{name:"modelica",keywords:t("algorithm and annotation assert block break class connect connector constant constrainedby der discrete each else elseif elsewhen encapsulated end enumeration equation expandable extends external false final flow for function if import impure in initial inner input loop model not operator or outer output package parameter partial protected public pure record redeclare replaceable return stream then true type when while within"),builtin:t("abs acos actualStream asin atan atan2 cardinality ceil cos cosh delay div edge exp floor getInstanceName homotopy inStream integer log log10 mod pre reinit rem semiLinear sign sin sinh spatialDistribution sqrt tan tanh"),atoms:t("Real Boolean Integer String")})}(n(35))}}]);
//# sourceMappingURL=69.744372d3.chunk.js.map