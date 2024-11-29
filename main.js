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
    td.classList.add("flowTableTd");
    const div=document.createElement('div');
    div.classList.add("tableDiv");
    const input=document.createElement('textarea');
    input.classList.add("pasteInput");
    input.placeholder="이미지를 붙여넣으세요";
    const divPaste=document.createElement('div');
    divPaste.classList.add("pasteArea");
    divPaste.innerHTML="Window Key+Shift Key+ S Key<br>으로 클립보드 저장된 이미지";
    tr.appendChild(td);
    td.appendChild(div);
    div.appendChild(input);
    div.appendChild(divPaste);
    td.addEventListener('click',()=>{
        td.classList.toggle("tdSelected");
      })
    divPaste.addEventListener('paste', (event) => {
            const items = event.clipboardData.items;
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        divPaste.replaceChildren();
                        divPaste.appendChild(img);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    
      
}

function delEvent(){
    document.querySelectorAll('.tdSelected').forEach((e)=>{
        e.remove();
    })
}
function delImg(){
    const selected=document.querySelectorAll('.tdSelected');
    if(selected.length>1){
        alert("한개의 이미지만 선택 가능합니다.");
        return;
    }
    console.log(selected.length);
    img = document.querySelectorAll('.tdSelected img');

}
function detailImg(){

}
