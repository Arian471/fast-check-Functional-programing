const fc = require('fast-check');

module.exports = {
stringArb: () => {
    return fc.constant(String(fc.oneof(
        fc.string(1000), fc.boolean(), fc.integer(), fc.object(),
        fc.oneof(
            fc.constant(null), fc.constant(undefined)
        ),
        fc.oneof(
            fc.double(), fc.constant(-0), fc.constant(0), 
            fc.constant(Number.MIN_VALUE), fc.constant(Number.MAX_VALUE),
            fc.constant(Number.POSITIVE_INFINITY), 
            fc.constant(Number.NEGATIVE_INFINITY),
            fc.constant(Number.MIN_SAFE_INTEGER), 
            fc.constant(Number.MAX_SAFE_INTEGER),
            fc.constant(Number.NaN),
            fc.constant(Number.EPSILON)
        )
)));
},

randArb: () => {
    return fc.oneof(
        fc.string(1000), fc.boolean(), fc.integer(), fc.object(),
        fc.oneof(
            fc.constant(null), fc.constant(undefined)
        ),
        fc.oneof(
            fc.double(), fc.constant(-0), fc.constant(0), 
            fc.constant(Number.MIN_VALUE), fc.constant(Number.MAX_VALUE),
            fc.constant(Number.POSITIVE_INFINITY), 
            fc.constant(Number.NEGATIVE_INFINITY),
            fc.constant(Number.MIN_SAFE_INTEGER), 
            fc.constant(Number.MAX_SAFE_INTEGER),
            fc.constant(Number.NaN),
            fc.constant(Number.EPSILON)
        )
);
}

}


