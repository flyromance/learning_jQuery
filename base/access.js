// 分发器入口函数
// chainable = true : 表示set设置操作，返回this : set集合中的每个元素
// chainable = false : 标识get获取操作，返回要获取的值 : 获取集合中的某个元素
$.access = function(elems, fn, key, value, chainable, emptyGet, raw) {

    var i = 0,
        length = elems.length,
        bulk = key == null;

    // Sets many values
    if (jQuery.type(key) === "object") {
        chainable = true;
        for (i in key) {
            jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
        }

        // Sets one value
    } else if (value !== undefined) {
        chainable = true;

        if (!jQuery.isFunction(value)) {
            raw = true;
        }

        if (bulk) {
            // Bulk operations run against the entire set
            if (raw) {
                fn.call(elems, value);
                fn = null;

                // ...except when executing function values
            } else {
                bulk = fn;
                fn = function(elem, key, value) {
                    return bulk.call(jQuery(elem), value);
                };
            }
        }

        if (fn) {
            for (; i < length; i++) {
                fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
            }
        }
    }

    return chainable ?
        elems :

        // Gets
        bulk ?
        fn.call(elems) :
        length ? fn(elems[0], key) : emptyGet;
}
