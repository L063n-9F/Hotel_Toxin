var plugin = function(){
  return function(style){
    style.define('upperCase', function(fontStyle) {
      if (!fontStyle) return fontStyle;
      return fontStyle.string[0].toUpperCase() + fontStyle.string.slice(1);
    });
  };
};
module.exports = plugin;
