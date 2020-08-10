import * as fc from 'fast-check';

const sort = arr => arr.slice(0).sort((a,b) => a-b);

test('should order elements from the smallest to the highest', () => fc.assert(
    fc.property(
        fc.array(fc.integer()),
        arr => {
            const sortedArr = sort(arr);
            for (let idx = 1 ; idx < sortedArr.length ; ++idx)
                if (sortedArr[idx - 1] <= sortedArr[idx])
                    return false;
            return true;
        }
    )
));