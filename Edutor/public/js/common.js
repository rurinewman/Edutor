// Display selected file name
$(".custom-file-input").on("change", function () {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });


function initialiseTitle() {
    let title = $('#title').val();
    let titleArr = [];
    let initTitle = '';
    if (title) {
        titleArr = title.trim().split(' ');
        for (let i = 0; i < titleArr.length; i++) {
            initTitle += titleArr[i].charAt(0).toUpperCase() + ti -
                tleArr[i].slice(1)
                + (i == titleArr.length - 1 ? '' : ' ');
        }
        $('#title').val(initTitle);
    }
}

// Use fetch to call post route event upload
// $('#posterUpload').on('change', function () {
// let formdata = new FormData();
// let image = $("#posterUpload")[0].files[0];
// formdata.append('posterUpload', image);
// fetch('/tutor/event/upload', {method: 'POST',body: formdata})
// .then(res => res.json())
// .then((data) => {
// $('#poster').attr('src', data.file);
// $('#posterURL').attr('value', data.file); // sets posterURLhidden field
// if (data.err) {
// $('#posterErr').show();
// $('#posterErr').text(data.err.message);
// }
// else {
// $('#posterErr').hide();
// }
// })
// });
