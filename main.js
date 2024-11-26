document.getElementById('pasteArea').addEventListener('paste', function(event) {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                document.getElementById('imageContainer').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    }
});
function addEvent(){
    const tr=document.querySelectorAll('tr')[0];
    console.log(tr);

}