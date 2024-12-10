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
const trList=document.querySelectorAll('tr');
const tdList =document.querySelectorAll('td');
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
      e.querySelector("div").classList.toggle("tdSelected");
    })
});

function addEvent(e){
    console.log(e);
    let tr;
    if(e.classList !="bi_title"){
        const par =e.parentNode.parentNode.parentNode;
        if(par.id=="panel2"){
            tr =trList[0];
        }else if(par.id=="panel3"){
            tr =trList[1];  
        }else if(par.id=="panel4"){
            tr =trList[2];
        }
    }else{
        tr =e.parentNode.parentNode.querySelector('tr');
    }
    const td=document.createElement('td');
    td.classList.add("flowTableTd");
    const div=document.createElement('div');
    div.classList.add("tdDiv");
    const input=document.createElement('textarea');
    input.classList.add("pasteInput");
    input.placeholder="업무진행 상황을 입력 바랍니다.";
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
        if(e.id!=""){
            const delPath= e.id;
            database_f.ref(delPath).remove().then(()=>{
            alert("Deleted Server Data")})
        .catch((e)=>{alert("삭제 실패")});
        }
        
    })
}
function delImg(){
    const selected=document.querySelectorAll('.tdSelected');
    if(selected.length>1){
        alert("한개의 이미지만 선택 가능합니다.");
        return;
    }
    console.log(selected.length);
    img = document.querySelector('.tdSelected img');
    img.remove();

}
function detailImg(){
    const img = document.querySelector('.tdSelected img');
    if (img) {
        const newWindow = window.open();
        newWindow.document.write(`<img src="${img.src}" alt="Image">`);
    } else {
        console.log('No image found');
    }


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
    let imgObj=[];
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
            basicObj["remark"]=selectedTabDiv.querySelector('#biRemark').value;
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
                managerObj[i+"_"+managerKey[i].innerHTML]=managerValue[i].value;
            }
            const processDiv=selectedTabDiv.querySelectorAll('.tdDiv');
            for(let j=0;j<processDiv.length;j++){
                const processKey =processDiv[j].querySelector('textarea');
                const processValue = processDiv[j].querySelector('img');
                if(processValue==null){
                    processObj[j]={"contents":processKey.value,"img":"No Image"};
                }
                else{
                    processObj[j]={"contents":processKey.value,"img":processValue.src};
                }
                upObj["manager"]=managerObj;
                upObj["process"]=processObj;
            database_f.ref(refPath).update({"manager":upObj["manager"]}).then(()=>{
                alert("Manager 업로드 성공")})
            .catch((e)=>{console.log(e)
                alert("Manager 업로드 실패")});
            }
            database_f.ref(refPath).update({"process":upObj["process"]}).then(()=>{
                alert("Process 업로드 성공")})
            .catch((e)=>{alert("Process 업로드 실패")});
            }
            for(let k in processObj){
                    imgObj.push(processObj[k]["img"]);
                }
            console.log(imgObj);

            imgObj.forEach((imgUrl, index) => {
                if(imgUrl=="No Image"){

                }else{
                    fetch(imgUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        // const fileName = imgUrl.split('/').pop(); // Extract file name from URL
                        const file = new File([blob], index, { type: blob.type });
                        console.log(refPath,index);
                        const fileRef = storage_f.ref(refPath+"/pI").child(index.toString());
                        fileRef.put(file).then((snapshot) => {
                            if (index === imgObj.length - 1) {
                                console.log("업로드 완료");
                            }
                        });
                    })
                    .catch(error => {
                      console.error("Error uploading file:", error);
                  });
                  
                }
            });
          }
        
function searchInit(){
    const tr = document.querySelectorAll('tr');
    tr.forEach((e)=>{
        e.replaceChildren();
    });
    const clientName = document.querySelector('#clientName').value;
    const refPath="FineManual/"+clientName+"/";
    const biList=["업체명","업체 사업자 등록번호","업체 대표자","업체 주소","업체 운영화물","remark"]
        database_f.ref(refPath).once('value').then((snapshot)=>{
        const basicInfo = snapshot.val()["basicInfo"];
        const inInfo = snapshot.val()["in"];
        const outInfo = snapshot.val()["out"];
        const adjInfo = snapshot.val()["adj"];
        let basicInput = document.querySelectorAll('#panel1 input,textarea');
        const inInput = document.querySelectorAll('#panel2 input');
        const outInput = document.querySelectorAll('#panel3 input');
        const adjInput = document.querySelectorAll('#panel4 input');
        for(let i=0;i<basicInput.length;i++){
                    basicInput[i].value=basicInfo[biList[i]];
        }
            try{
            const infoIn = Object.values(inInfo["manager"]);
            for(let j=0;j<inInput.length;j++){
                inInput[j].value=infoIn[j];
            }}catch (e) {
                console.log(e);
            }
            try{
                const infoOut = Object.values(outInfo["manager"]);
                for(let k=0;k<outInput.length;k++){
                    outInput[k].value=infoOut[k];
                }}catch (e) {
                    console.log(e);
                }
            try{
                const infoAdj = Object.values(adjInfo["manager"]);
            for(let l=0;l<adjInput.length;l++){
                inInput[l].value=infoAdj[l];
            }}catch (e) {
                console.log(e);
            }    
        
        const processTable=()=>{
            const pIn = inInfo["process"];
            const ch= document.querySelectorAll('.bi_title');
            for(let c in pIn){
                addEvent(ch[0]);
                const textA = document.querySelectorAll('.pasteInput')[c];
                const imgDiv = document.querySelectorAll('.pasteArea')[c];
                const div= textA.parentNode;
                div.id="/FineManual/(주)시노로지스/in/process/"+c;
                textA.value=pIn[c]["contents"];
                if(pIn[c]["img"]=="No Image"){
                    imgDiv.innerHTML="No Image";}else{
                     img = document.createElement('img');
                        img.src=pIn[c]["img"];
                        imgDiv.appendChild(img);   
                    }
            }
            const pOut = outInfo["process"];
            for(let c in pOut){
                addEvent(ch[1]);
                const textA = document.querySelectorAll('.pasteInput')[c];
                const imgDiv = document.querySelectorAll('.pasteArea')[c];
                const div= textA.parentNode;
                div.id="/FineManual/(주)시노로지스/out/process/"+c;
                textA.value=pOut[c]["contents"];
                if(pIn[c]["img"]=="No Image"){
                    imgDiv.innerHTML="No Image";}else{
                     img = document.createElement('img');
                        img.src=pIn[c]["img"];
                        imgDiv.appendChild(img);   
                    }
            }
            const pAdj = adjInfo["process"];
            for(let c in pAdj){
                addEvent(ch[2]);
                const textA = document.querySelectorAll('.pasteInput')[c];
                const imgDiv = document.querySelectorAll('.pasteArea')[c];
                const div= textA.parentNode;
                div.id="/FineManual/(주)시노로지스/adj/process/"+c;
                textA.value=pAdj[c]["contents"];
                if(pIn[c]["img"]=="No Image"){
                    imgDiv.innerHTML="No Image";}else{
                     img = document.createElement('img');
                        img.src=pIn[c]["img"];
                        imgDiv.appendChild(img);   
                    }
            }
        }    
        processTable();
            

    });
}

function returnTime(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
  }