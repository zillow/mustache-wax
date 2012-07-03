/**
 * Random utility functions
 */

/**
Mixes _supplier_'s properties into _receiver_.

Properties on _receiver_ or _receiver_'s prototype will not be overwritten or
shadowed unless the _overwrite_ parameter is `true`, and will not be merged
unless the _merge_ parameter is `true`.

In the default mode (0), only properties the supplier owns are copied (prototype
properties are not copied). The following copying modes are available:

  * `0`: _Default_. Object to object.
  * `1`: Prototype to prototype.
  * `2`: Prototype to prototype and object to object.
  * `3`: Prototype to object.
  * `4`: Object to prototype.

@method mix
@param {Function|Object} receiver The object or function to receive the mixed
  properties.
@param {Function|Object} supplier The object or function supplying the
  properties to be mixed.
@param {Boolean} [overwrite=false] If `true`, properties that already exist
  on the receiver will be overwritten with properties from the supplier.
@param {String[]} [whitelist] An array of property names to copy. If
  specified, only the whitelisted properties will be copied, and all others
  will be ignored.
@param {Number} [mode=0] Mix mode to use. See above for available modes.
@param {Boolean} [merge=false] If `true`, objects and arrays that already
  exist on the receiver will have the corresponding object/array from the
  supplier merged into them, rather than being skipped or overwritten. When
  both _overwrite_ and _merge_ are `true`, _merge_ takes precedence.
@return {Function|Object|YUI} The receiver, or the YUI instance if the
  specified receiver is falsy.
**/
Y.mix = function(receiver, supplier, overwrite, whitelist, mode, merge) {
    var alwaysOverwrite, exists, from, i, key, len, to;

    // If no supplier is given, we return the receiver. If no receiver is given,
    // we return Y. Returning Y doesn't make much sense to me, but it's
    // grandfathered in for backcompat reasons.
    if (!receiver || !supplier) {
        return receiver || Y;
    }

    if (mode) {
        // In mode 2 (prototype to prototype and object to object), we recurse
        // once to do the proto to proto mix. The object to object mix will be
        // handled later on.
        if (mode === 2) {
            Y.mix(receiver.prototype, supplier.prototype, overwrite,
                    whitelist, 0, merge);
        }

        // Depending on which mode is specified, we may be copying from or to
        // the prototypes of the supplier and receiver.
        from = mode === 1 || mode === 3 ? supplier.prototype : supplier;
        to   = mode === 1 || mode === 4 ? receiver.prototype : receiver;

        // If either the supplier or receiver doesn't actually have a
        // prototype property, then we could end up with an undefined `from`
        // or `to`. If that happens, we abort and return the receiver.
        if (!from || !to) {
            return receiver;
        }
    } else {
        from = supplier;
        to   = receiver;
    }

    // If `overwrite` is truthy and `merge` is falsy, then we can skip a
    // property existence check on each iteration and save some time.
    alwaysOverwrite = overwrite && !merge;

    if (whitelist) {
        for (i = 0, len = whitelist.length; i < len; ++i) {
            key = whitelist[i];

            // We call `Object.prototype.hasOwnProperty` instead of calling
            // `hasOwnProperty` on the object itself, since the object's
            // `hasOwnProperty` method may have been overridden or removed.
            // Also, some native objects don't implement a `hasOwnProperty`
            // method.
            if (!hasOwn.call(from, key)) {
                continue;
            }

            // The `key in to` check here is (sadly) intentional for backwards
            // compatibility reasons. It prevents undesired shadowing of
            // prototype members on `to`.
            exists = alwaysOverwrite ? false : key in to;

            if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                // If we're in merge mode, and the key is present on both
                // objects, and the value on both objects is either an object or
                // an array (but not a function), then we recurse to merge the
                // `from` value into the `to` value instead of overwriting it.
                //
                // Note: It's intentional that the whitelist isn't passed to the
                // recursive call here. This is legacy behavior that lots of
                // code still depends on.
                Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else if (overwrite || !exists) {
                // We're not in merge mode, so we'll only copy the `from` value
                // to the `to` value if we're in overwrite mode or if the
                // current key doesn't exist on the `to` object.
                to[key] = from[key];
            }
        }
    } else {
        for (key in from) {
            // The code duplication here is for runtime performance reasons.
            // Combining whitelist and non-whitelist operations into a single
            // loop or breaking the shared logic out into a function both result
            // in worse performance, and Y.mix is critical enough that the byte
            // tradeoff is worth it.
            if (!hasOwn.call(from, key)) {
                continue;
            }

            // The `key in to` check here is (sadly) intentional for backwards
            // compatibility reasons. It prevents undesired shadowing of
            // prototype members on `to`.
            exists = alwaysOverwrite ? false : key in to;

            if (merge && exists && isObject(to[key], true)
                    && isObject(from[key], true)) {
                Y.mix(to[key], from[key], overwrite, null, 0, merge);
            } else if (overwrite || !exists) {
                to[key] = from[key];
            }
        }

        // If this is an IE browser with the JScript enumeration bug, force
        // enumeration of the buggy properties by making a recursive call with
        // the buggy properties as the whitelist.
        if (Y.Object._hasEnumBug) {
            Y.mix(to, from, overwrite, Y.Object._forceEnum, mode, merge);
        }
    }

    return receiver;
};

exports.mix = mix;
