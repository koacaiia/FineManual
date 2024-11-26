const divPaste = document.querySelectorAll('.pasteArea');
const tr=document.querySelectorAll('tr')[0];
const tdList =tr.querySelectorAll('td');
divPaste.forEach((e)=>{
    e.addEventListener('paste', (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const file = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function(event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    e.replaceChildren();
                    e.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });
})

tdList.forEach((e)=>{
    e.addEventListener('click',()=>{
      e.classList.toggle("tdSelected");
    })
});

function addEvent(){
    const td=document.createElement('td');
    const div=document.createElement('div');
    div.classList.add("tableDiv");
    const input=document.createElement('input');
    const divPaste=document.createElement('div');
    divPaste.classList.add("pasteArea");
    divPaste.innerHTML="Paste your image here";
    tr.appendChild(td);
    td.appendChild(div);
    div.appendChild(input);
    div.appendChild(divPaste);
    td.addEventListener('click',()=>{
        td.classList.toggle("tdSelected");
      })
}

function delEvent(){
    document.querySelectorAll('.tdSelected').forEach((e)=>{
        e.remove();
    })
}