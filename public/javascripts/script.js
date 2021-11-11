$(document).ready(function() {
    $("#but_upload").click(function () {
            var fd = new FormData();
            var files = $('#file')[0].files;
            var isWorking = false
            // Check file selected or not
            if (files.length > 0 && !isWorking) {
                document.getElementById('but_upload').value = '...Uploading'
                document.getElementById('data').style.visibility = 'hidden'
        
                for (let i = 0; i < files.length; i++) {
                    isWorking = true
                    fd.append('files', files[i])
                }
        
                $.ajax({
                    url: '/upload',
                    type: 'post',
                    data: fd,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        if (response) {
                            isWorking = false
                            document.getElementById('but_upload').value = 'Upload'
                            document.getElementById('data').style.visibility = 'visible'
                            document.getElementById('data').innerHTML = response.urls.map((url, i) => `<a href="${url}" target="_blank"> Image ${i+1}</a> <br>`).join('');
                        } else {
                            alert('Something went wrong');
                        }
                    },
                });
            } else {
                alert("Please select a file.");
            }
        });
})