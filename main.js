const firebaseConfig = {
    apiKey: "AIzaSyDLzmZyt5nZwCk98iZ6wi01y7Jxio1ppZQ",
    authDomain: "fine-bondedwarehouse.firebaseapp.com",
    databaseURL: "https://fine-bondedwarehouse-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fine-bondedwarehouse",
    storageBucket: "fine-bondedwarehouse.appspot.com",
    messagingSenderId: "415417723331",
    appId: "1:415417723331:web:15212f190062886281b576",
    measurementId: "G-SWBR4359JQ"
};
if(firebase.apps.length==0){
  firebase.initializeApp(firebaseConfig);
}
const database_f = firebase.database();
const messaging = firebase.messaging();
const storage_f = firebase.storage();
const deptName = "WareHouseDept2";
const divPaste = document.querySelectorAll('.pasteArea');
const tr=document.querySelectorAll('tr')[0];
const tdList =tr.querySelectorAll('td');

let data = {};
const clientName = document.querySelector('#clientName');
init();
function init(){
    database_f.ref("FineManual/").once('value').then((snapshot)=>{
        const data = snapshot.val();
        const keyList = Object.keys(data);
        for(let i=0;i<keyList.length;i++){
                const option = document.createElement('option');
                option.value=keyList[i];
                option.innerHTML=keyList[i];
                clientName.appendChild(option);
        }
        const valueList = Object.values(data);
        
    });

}
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
    div.classList.add("tdDiv");
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
        td.querySelector('.tdDiv').classList.toggle("tdSelected");
        toastOn(document.querySelectorAll('.tdSelected').length+" 개 선택되었습니다.",3000);
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
        e.parentNode.remove();
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
function toastOn(msg,t){
    if(t == null){
      t=2000;
    }
    const toastMessage = document.createElement("div");
    toastMessage.id="tost_message";
    toastMessage.innerHTML = msg; 
    toastMessage.classList.add('active');
    document.body.appendChild(toastMessage);
    setTimeout(function(){
        toastMessage.classList.remove('active');
    },t);
  }
function submitUpLoad(e){
    let selectedTabDiv;
    document.querySelectorAll('[role="tabpanel"]').forEach(tab => {
        if(tab.hidden ==false){ 
            selectedTabDiv=tab;
        }});
        const managerDiv = selectedTabDiv.querySelector('.bi_manager');
        if(selectedTabDiv.id=="panel1"){
            const pKey = selectedTabDiv.querySelectorAll('h6');
            const pValue = selectedTabDiv.querySelectorAll('input');
            let basicObj = {};
            for(let i=0;i<pKey.length;i++){
                basicObj[pKey[i].innerHTML]=pValue[i].value;
            }
            basicObj["remark"]=parentNode.querySelector('#biRemark').value;
            const refPath="FineManual/"+basicObj["업체명"]+"/basicInfo/";
            database_f.ref(refPath).update(basicObj).then(()=>{alert("업로드 성공")}).catch((e)=>{alert("업로드 실패")});
        }else {
            let refPath;
            let managerObj = {};
            let processObj = {};
            let upObj = {};
            if(selectedTabDiv.id=="panel2"){
                refPath="FineManual/"+clientName.value+"/in/";
            }else if(selectedTabDiv.id=="panel3"){
                refPath="FineManual/"+clientName.value+"/out/";
            }else if(selectedTabDiv.id=="panel4"){
                refPath="FineManual/"+clientName.value+"/adj/";
            }
            const managerKey =managerDiv.querySelectorAll('label');
            const managerValue = managerDiv.querySelectorAll('input');
            for(let i=0;i<managerKey.length;i++){
                managerObj[managerKey[i].innerHTML]=managerValue[i].value;
            }
            const processDiv=selectedTabDiv.querySelectorAll('.tdDiv');
            for(let i=0;i<processDiv.length;i++){
                const processKey =processDiv[i].querySelector('textarea');
                const processValue = processDiv[i].querySelector('img');
                if(processValue==null){
                    processObj[i]={"contents":processKey.value,"img":"No Image"};
                }
                else{
                    processObj[i]={"contents":processKey.value,"img":processValue.src};
                }
                upObj["manager"]=managerObj;
                upObj["process"]=processObj;
            database_f.ref(refPath).update(upObj).then(()=>{
                if(i==processDiv.length-1){alert("업로드 성공")}})
            .catch((e)=>{alert("업로드 실패")});
            }
    }
}
function searchInit(){
    const clientName = document.querySelector('#clientName').value;
    const refPath="FineManual/"+clientName+"/";
    const biList=["업체명","업체 사업자 등록번호","업체 대표자","업체 주소","업체 운영화물","remark"]
        database_f.ref(refPath).once('value').then((snapshot)=>{
        const basicInfo = snapshot.val()["basicInfo"];
        const inInfo = snapshot.val()["in"];
        const outInfo = snapshot.val()["out"];
        console.log(data);
        let basicInput = document.querySelectorAll('#panel1 input,textarea');
        for(let i=0;i<basicInput.length;i++){
                    basicInput[i].value=basicInfo[biList[i]];

            }
    });

}
