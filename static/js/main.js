let inputUrl = document.getElementById('inputVideoUrl');
let selectFormat = document.getElementById('selectFormat');
let btnFilters = document.getElementById('btnGetFilters');
let btnDownload = document.getElementById('btnDownload');
let listError = document.getElementById('error');
let loading = document.getElementById('loading');

let inputVideoUrl = '';

document.addEventListener("DOMContentLoaded", function (event) {
    // Aquí puedes agregar el código que deseas ejecutar cuando la página esté lista.
    btnDownload.setAttribute('hidden', true);
    listError.setAttribute('hidden', true);
    selectFormat.setAttribute('disabled', true);
    loading.setAttribute('hidden', true);

});


btnFilters.addEventListener('click', () => {
    inputVideoUrl = inputUrl.value;

    loading.removeAttribute('hidden');

    fetch('/getFilters', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: inputVideoUrl
        })
    })
        .then(response => response.text())
        .then(data => {
            let result = JSON.parse(data);

            loading.setAttribute('hidden', true);

            console.log('datos', result.data);

            selectFormat.innerHTML = '';

            result.data.forEach(element => {
                let option = document.createElement('option')
                option.setAttribute('value', element.itag);

                let texto = ''

                if (element.type == "audio") {
                    texto = `${element.type} || ${element.subtype} || ${element.desc} || ${element.mime_type} || ${element.abr}`
                }
                else {
                    texto = `${element.type} || ${element.subtype} || ${element.desc} || ${element.mime_type} || ${element.res}`
                }

                option.innerText = texto;

                selectFormat.appendChild(option);
            });

            btnDownload.removeAttribute('hidden');
            selectFormat.removeAttribute('disabled');

        })
        .catch(error => {
            console.error(error)
            btnDownload.setAttribute('hidden', true);
            selectFormat.setAttribute('disabled', 'disabled');
            loading.setAttribute('hidden', true);
            listError.removeAttribute('hidden').text = error;
        });
});


btnDownload.addEventListener('click', () => {
    const itag = selectFormat.value;

    loading.removeAttribute('hidden');

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: inputVideoUrl,
            itag
        })
    })
        .then(response => response.blob())
        .then(data => {
            const url = window.URL.createObjectURL(data);

            let option = selectFormat.options[selectFormat.selectedIndex].text;
            let parts = option.split('||')

            const subtype = parts[1].trim();
            const name = parts[2].trim();

            let a = document.createElement('a')
            a.href = url;
            a.download = `${name}.${subtype}`;

            a.click();

            loading.setAttribute('hidden', true);

            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error(error)
            loading.setAttribute('hidden', true);
            listError.removeAttribute('hidden').text = error;
        });
});