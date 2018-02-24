const RandomGenerator = function(total, n) {
  var self = this;
  self.calls = {};
  self.counter = 0;

  var i = 0;
  while (i < n) {
    var x = parseInt(Math.random() * total);

    if (!(x in self.calls)) {
      self.calls[x] = true;
      i++;
    }
  }

  self.get = function() {
    // after "total" calls, will have returned true n times and false the otherwise
    var result = false;
    if (self.counter in self.calls) {
      result = self.calls[self.counter];
    }

    self.counter++;
    return result;
  };

  return {get: self.get};
};

export default RandomGenerator;
