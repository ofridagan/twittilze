const { Writable } = require('stream');
const Heap = require('heap');

const compare = (a, b) => a.count - b.count
const compareInv = (a, b) => -compare(a,b)

// A topper-stream is a writable-stream implementation which reads string "values",
// counts them and keeps track of the most frequent ones.
// size - the number of "top" values to keep track of (probably 10).
module.exports = (size) => {

  // all values are stored here as keys, using JS native hash
  // what we store are 'entry' objects {value: <string>, count: <integer>}
  const values = {};

  // The top (most frequent) entries are stored in a MIN Heap
  // This means when a new value comes in, we only need to compare its 'count' to the count on top of the heap
  const minHeap = new Heap(compare);

  // given a new entry (or a count update to an existing entry), we update the heap if needed.
  // note we mark entries which are currently in the heap with 'isTop' flag... we could have just searched the heap, but it's a little faster.
  const updateHeap = (entry) => {
    if (entry.isTop) { // if entry is in the heap, we just tell the heap to rearrage this entry
      minHeap.updateItem(entry);
    } else if (minHeap.size() < size) { // if we don't yet have 'size' items in the heap - push any new entry to the heap
      entry.isTop = true;
      minHeap.push(entry);
    } else if (minHeap.peek().count < entry.count) { // otherwise, check the top of the heap and replace it with our entry if needed
      entry.isTop = true;
      const popped = minHeap.replace(entry);
      delete popped.isTop;
    }
  }

  // storing a new value.
  // creating an 'entry' for new values and updating the 'values' object and the heap
  const addValue = (value) => {
    if (!(value in values)) {
      values[value] = {value, count: 0};
    }
    const entry = values[value];
    entry.count++;
    updateHeap(entry);
  };

  stream = new Writable({
    objectMode: true,
    write(value, encoding, callback) {
      addValue(value);
      callback();
    }
  });

  // return a nice sorted top entries
  stream.getTop = () => minHeap.toArray().map(({value, count}) => ({value, count})).sort(compareInv);

  return stream;

}
