String.prototype.hashCode = function () { // eslint-disable-line no-extend-native
  var hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    let ch = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + ch;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};
