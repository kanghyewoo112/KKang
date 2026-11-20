(function(){var K='coco-progress-v1',N='coco-name';
function get(){try{return JSON.parse(localStorage.getItem(K)||'{}')}catch(e){return {}}}
function put(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}
window.COCO={get:get,put:put,name:function(v){try{if(v!==undefined)localStorage.setItem(N,v);return localStorage.getItem(N)||''}catch(e){return ''}}};
})();