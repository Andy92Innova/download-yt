const btnFilters = document.getElementById('btnGetFilters');
const btnDownload = document.getElementById('btnDownload');

let  inputVideoUrl = '';

btnFilters.addEventListener('click', ()=>{
    inputVideoUrl = document.getElementById('inputVideoUrl').value;

    fetch('/getFilters', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            url:inputVideoUrl
        })
    })  
    .then(response => response.text())
    .then(data =>{
        let result = JSON.parse(data);

        console.log('datos',result.data);

        const selectFormat = document.getElementById('selectFormat')

        selectFormat.innerHTML='';

        result.data.forEach(element => {
            let option = document.createElement('option')
            option.setAttribute('value',element.itag);

            let texto = ''

            if(element.type=="audio"){
                texto = `${element.type} | ${element.desc} | ${element.mime_type} | ${element.abr}`
            }
            else{
                texto = `${element.type} | ${element.desc} | ${element.mime_type} | ${element.res}`
            }

            option.innerText = texto;

            selectFormat.appendChild(option);
        });

        /*
        {
            "itag": 139,
            "mime_type": "audio/mp4",
            "res": null,
            "subtype": "mp4",
            "type": "audio"
            },
        */

    })
    .catch(error => console.error(error));
});


btnDownload.addEventListener('click', ()=>{
    const itag = document.getElementById('selectFormat').value;

    fetch('/download',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            url:inputVideoUrl,
            itag
        })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error(error));
});