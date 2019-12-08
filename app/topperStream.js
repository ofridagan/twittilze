const { Writable } = require('stream');
const Heap = require('heap');

module.exports = (size) => {

  const compare = (a, b) => a.count - b.count
  const compareInv = (a, b) => -compare(a,b)

  const heap = new Heap(compare);
  const values = {};

  const updateHeap = (entry) => {
    if (entry.isTop) {
      heap.updateItem(entry);
    } else if (heap.size() < size) {
      entry.isTop = true;
      heap.push(entry);
    } else if (heap.peek().count < entry.count) {
      entry.isTop = true;
      const popped = heap.replace(entry);
      delete popped.isTop;
    }
  }

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

  stream.getTop = () => heap.toArray().map(({value, count}) => ({value, count})).sort(compareInv);

  return stream;

}
