var util = {
    /**
     * 判断传入的 arr 对象 是否是一个数列实例
     * @param  {[type]}  arr 待判断的对象
     * @return {Boolean}     true 为是  false 为否
     */
    isArray: function(arr) {
        return Object.prototype.toString.call(arr) == '[object Array]';
        return (arr instanceof Array);
    },
    /**
     * 判断传入的 对象是不是 函数 实例
     * @param  {Function} fn [待判断的对象]
     * @return {Boolean}     [description]
     */
    isFunction: function(fn) {
        return Object.prototype.toString.call(fn) == '[object Function]';

    },
    /**
     * 深度克隆对象除 function 以外的属性
     * @param  {[type]} obj [description]
     * @return {[type]}     [description]
     */
    cloneObject: function(obj) {
        var resultObj = isArray(obj) ? [] : {}; //判断当前对象类型是数组还是对象
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                //如果当前属性是对象，则递归调用函数
                resultObj[key] = cloneObject(obj[key]);

            } else if (typeof obj[key] === 'function') { //不复制function
                continue;
            } else {
                resultObj[key] = obj[key]; //否则 为值类型，直接复制  
            }
        }

        return resultObj;
    },
    cloneObject1: function(obj) {
        var resultObj = isArray(obj) ? [] : {}; //判断当前对象类型是数组还是对象
        for (var key in obj) {
            if (typeof obj[key] === 'object') {
                //如果当前属性是对象，则递归调用函数
                resultObj[key] = cloneObject(obj[key]);

            } else if (typeof obj[key] === 'function') { //不复制function
                continue;
            } else {
                resultObj[key] = obj[key]; //否则 为值类型，直接复制  
            }
        }

        return resultObj;
    },
    /**
     * 数组去重，去除数组中相同的元素
     * @param  {[type]} arr 要去重的数组
     * @return {[type]}     [返回去重后的数组]
     */
    uniqArray: function(arr) {
        var len = arr.length,
            result = [], //结果数组
            hashCode = {}; //hashTable ,用来存储 已经存储在 result数组中的 元素值

        for (var i = 0; i < len; i++) {
            if (!hashCode[arr[i]]) { //如果hashTable中没有，则将当前元素压入result中，否则跳过
                result.push(arr[i]);
                hashCode[arr[i]] = true;
            }
        }

        return result;
    },
    /**
     * 数组去重，去除数组中相同的元素  ， 先排序，然后与result中最后一个元素比较，不相等加入，相等跳过
     * @param  {[type]} arr 要去重的数组
     * @return {[type]}     [返回去重后的数组]
     */
    uniqArray1: function(arr) {
        var len = arr.length,
            result = []; //结果数组
        //先排序
        arr.sort();
        //压入排序后第一个元素到结果数组中
        //从第二个元素开始，与result数组中的最后一个元素开始比较，不相等则加入result数组，否则跳过
        result.push(arr[0]);
        for (var i = 1; i < len; i++) {
            if (result[result.length - 1] != arr[i]) {
                result.push(arr[i]);
            }
        }

        return result;
    },

    uniqArray2: function(arr) {
        var len = arr.length,
            result = [],
            hashCode = {};

        for (var i = 0; i < len; i++) {
            if (!hashCode[arr[i]]) {
                result.push(arr[i]);
                hashCode[arr[i]] = true;
            }
        }
        return result;
    },
    /**
     * 实现一个遍历数组的方法，针对数组中每一个元素执行fn函数，并将数组索引和元素作为参数传递
     * @param  {[type]}   arr [description]
     * @param  {Function} fn  [description]
     * @return {[type]}       [description]
     */
    each: function(arr, fn) {
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            fn(i, arr[i]);
        }
    },
    /**
     * 实现一个简单的trim函数，用于去除一个字符串，头部和尾部的空白字符
     * @param  {[type]} str [description]
     * @return {[type]}     [description]
     */
    trim: function(str) {
        return str.replace(/^\s+(.*)\s+$/, '$1');
    },
    /**
     * 匹配符合邮箱规则的字符串
     * @param  {[type]}  emailStr [description]
     * @return {Boolean}          [返回 输入字符串是否符合规定的 boolean 值]
     */
    isEmail: function(emailStr) {
        // /^\w+((-\w+)|(\.\w+))*\@[a-zA-Z0-9]+((\.|-)[a-zA-Z0-9]+)*\.[a-zA-Z0-9]+$/g
        var emailPattern = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/g;

        return emailPattern.test(emailStr);
    },
    /**
     * 匹配手机号
     * @param  {[type]}  phoneNumberStr [description]
     * @return {Boolean}                [description]
     */
    isPhoneNumber: function(phoneNumberStr) {
        var numberPattern = /^1[3578]\d{9}$/g;

        return numberPattern.test(phoneNumberStr);
    },
    addClass: function(element, newClassName) {
        element.classList.add(newClassName);

        return element;
    },
    removeClass: function(element, newClassName) {
        element.classList.remove(newClassName);
    },
    /**
     * 清除元素所有子元素
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    clearChildren: function(element) {
        if (!element.nodeType || element.nodeType != 1) {
            return Error('no element in');
        }
        var child = element.firstElementChild;
        while (!!child) {
            element.removeChild(child);
            child = element.firstElementChild;
        }
    },
    /**
     * 判断siblingNode和element是否为同一个父元素下的同一级的元素，返回bool值
     * @param  {[type]}  element     [description]
     * @param  {[type]}  siblingNode [description]
     * @return {Boolean}             [description]
     */
    isSiblingNode: function(element, siblingNode) {
        var parentEl = element.parentNode;
        if (parentEl != siblingNode.parentNode) return false;

        var i, len, child = parentEl.firstElementChild;
        while (child != parentEl.lastElementChild) {
            if (child == siblingNode) return true;
            child = child.nextElementSibling;
        }
        return false;
    },
    /**
     * 获取实际样式函数
     * @param   {HTMLElement}   element  需要寻找的样式的html节点
     * @param   {String]} attr 在对象中寻找的样式属性
     * @returns {String} 获取到的属性
     */
    getStyle: function(element, attr) {
        //IE写法
        if (element.currentStyle) {
            return element.currentStyle[attr];
            //标准
        } else {
            return getComputedStyle(element, false)[attr];
        }
    },
    /**
     * 获取element相对于浏览器窗口的位置，返回一个对象{x, y}
     * @param  {[type]} element [description]
     * @return {[type]}         [description]
     */
    getPosition: function(element) {
        return '{' + element.offsetLeft + ' ，' + element.offsetTop + '}';
    },
    /**
     * 实现一个简单的Query
     * @param  {[type]} selector [description]
     * @return {[type]}          [description]
     */
    $: function(selector) {
        var currentEl = this;

        if (typeof selector != 'string') return false;

        // var selectorList = selector.split(' ');
        // while(selectorList.length != 1){
        //     var currentSelector = selectorList.shift();
        //     var currentGroup = $(currentSelector);
        //     console.log($(selectorList.join()));
        //     ($(selectorList.join()).bind(currentGroup))();
        // }

        var idPattern = /^#(\w|-)+/,
            classPattern = /^\.[\w-]+/,
            attriPattern = /\[([\w-]+)\]/;
        attriValuePattern = /\[([\w-]+)=([\w-]+)\]/;

        if (idPattern.test(selector)) {
            selector = selector.replace(/^#/, '');
            console.log(selector);
            return document.getElementById(selector);
        }
        if (classPattern.test(selector)) {
            selector = selector.replace(/^\./, '');
            return document.getElementsByClassName(selector)[0];
        }
        if (attriPattern.test(selector)) {
            selector = selector.replace(attriPattern, '$1');
            console.log(selector);
            var filter = function(node) {
                return node.hasAttribute(selector) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

            }
            var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, filter, false);
            return iterator.nextNode();
        }
        if (attriValuePattern.test(selector)) {
            var attri, value;
            selector.replace(attriValuePattern, function(match, p1, p2) {
                attri = p1;
                value = p2;
            });
            var filter = function(node) {
                return node.hasAttribute(attri) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;

            }
            var iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, filter, false);
            var node = iterator.nextNode();
            while (node != null) {
                if (node.getAttribute(attri) == value) {
                    return node;
                }
                node = iterator.nextNode();
            }

            return null;
        }
        return null;
    },
    /**
     * 给一个element绑定一个针对event事件的响应，响应函数为listener
     * @param {[type]} element  [description]
     * @param {[type]} event    [description]
     * @param {[type]} listener [description]
     */
    addEvent: function(element, event, listener) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, listener);
        } else {
            element["on" + event] = listener;
        }
    },
    /**
     * 取消一个element 已绑定的事件
     * @param  {[type]} element  [description]
     * @param  {[type]} event    [description]
     * @param  {[type]} listener [description]
     * @return {[type]}          [description]
     */
    removeEvent: function(element, event, listener) {
        if (element.removeEventListener) {
            element.removeEventListener(event, listener, false);
        } else if (element.detachEvent) {
            element.detachEvent('on' + event, listener);
        } else {
            element['on' + event] = null;
        }
    },
    delegateEvent: function(element, tag, eventName, listener) {
        this.addEvent(element, eventName, function(e) {
            console.log(e);
            if (e.target.tagName == tag.toUpperCase()) {
                listener(e);
            }
        })
    },
    /**
     * 学习Ajax，并尝试自己封装一个Ajax方法
     * @param  {[type]} url     [description]
     * @param  {[type]} options options是一个对象，里面可以包括的参数为：
                                    type: post或者get，可以有一个默认值
                                    data: 发送的数据，为一个键值对象或者为一个用&连接的赋值字符串
                                    onsuccess: 成功时的调用函数
                                    onfail: 失败时的调用函数
     * @return {[type]}         [description]
     */
    ajax: function(url, options) {
        var defaultOpt = {
            url: options.url || '',
            method: options.type.toUpperCase() || 'GET',
            data: options.data || '',
            onsuccess: options.onsuccess || function() {},
            onfail: options.onfail || function() {},
        }

        if (typeof defaultOpt.data == 'object') {
            var str = '';
            for (var key in defaultOpt.data) {
                str += key + '=' + defaultOpt.data[key] + '&';
            }
            defaultOpt.data = str.substring(0, str.length - 1);
        }
        if (defaultOpt.method == 'GET') {
            defaultOpt.url += '?' + defaultOpt.data;
        }

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    defaultOpt.onsuccess(xhr.responseText);
                } else {
                    defaultOpt.onfail(xhr.responseText);
                }
            }
        }
        xhr.open(defaultOpt.method, defaultOpt.url, true);
        if (defaultOpt.method = 'GET') {
            xhr.send(null);
        } else {
            xhr.send(defaultOpt.data);
        }
    },
    /**
     * 指定整数位数，当不足时用0补全
     * @param  {[type]} num  [description]
     * @param  {[type]} fill [description]
     * @return {[type]}      [description]
     */
    prevNumber: function(num, fill) {
        var len = ('' + num).length;
        return (Array(
            fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num);
    },
    /**
     * 指定整数位数，使用正则表达式完成
     * @param  {[type]} num  [description]
     * @param  {[type]} fill [description]
     * @return {[type]}      [description]
     */
    parseIntNumber: function(parseNum, fill) {
        parseNum += '';
        var intPattern = eval('/^\\d{' + fill + '}$/');

        while (!intPattern.test(parseNum)) {
            parseNum = '0' + parseNum;
        }

        return parseNum;
    },
    /**
     * 元素运动函数，支持多种属性同时变化
     * @param  {[HTMLElement]}   element  [运动元素]
     * @param  {[object]}   json     [变化属性名值对]
     * @param  {[number]}   interval [运动间隔时间,单位:毫秒]
     * @param  {Function} callback [回调函数]
     * @return {[type]}            [description]
     */
    startmove: function(element, json, interval, callback) {
        var self = this;
        interval = interval || 30;
        var flag = true;
        !!element.timer && clearInterval(element.timer); //清除元素之前定义的计时器
        element.timer = setInterval(function() {
            for (var arr in json) { //对json对象中的每个属性进行计算
                //1.取当前的属性值
                var iCurrent = 0;
                if (arr == 'opacity') {
                    iCurrent = Math.round(self.getStyle(element, 'opacity') * 100);
                } else {
                    iCurrent = parseInt(self.getStyle(element, arr)); //得到元素最终呈现的属性值
                }

                //2.算当前速度
                var iSpeed = (json[arr] - iCurrent) / 10;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                //3.未达到条件时，继续执行
                if (iCurrent != json[arr]) {
                    flag = false;
                    if (arr == 'opacity') {
                        element.style.filter = 'alpha(opacity:' + (iCurrent + iSpeed) + ')'; //IE
                        element.style.opacity = (iCurrent + iSpeed) / 100; //标准
                    } else {
                        element.style[arr] = iCurrent + iSpeed + 'px';
                    }
                } else {
                    //终止条件
                    flag = true;
                }
            }
            //4.达到条件，执行回调
            if (flag) {
                clearInterval(element.timer);
                if (!!callback) {
                    callback(element);
                }
            }
        }, interval);
    },
    randomNumber: function(range) {
        var random = Math.floor(Math.random() * range);
        return random;
    }
}

module.exports = util;
