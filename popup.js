document.getElementById('save').addEventListener('click', function() {
  var color = document.getElementById('color').value;
  var size = document.getElementById('size').value;
  chrome.storage.sync.set({ 'color': color, 'size': size }, function() {
      console.log('Settings saved');
  });
});