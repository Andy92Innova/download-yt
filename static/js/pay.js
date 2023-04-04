let radio = document.getElementsByName('flexRadioDefault');
let inputMore = document.getElementById('inputMore');

document.addEventListener("DOMContentLoaded", function(event) {
    radio.forEach(element => {
        element.addEventListener('click', function (e) {
            inputMore.text = '';
            if(e.target.id == 'flexRadioDefault4'){
                inputMore.removeAttribute('disabled');
            }else{
                inputMore.setAttribute('disabled', true);
            }
        });
    });

    radio[0].click();
    inputMore.setAttribute('disabled', true);
})