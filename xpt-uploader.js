(function( $ ) {


  $.fn.xptUploader = function() {
    return this.each(function  () {
    var fileFieldID = $(this).data('fileupload-id');
    $(this).fileupload({
      url: $.cloud_assets.config_upload_api,
      dataType: 'json',
      add: function(e, data) {
        /*          console.log(data);*/
        var uploadErrors = [];
        var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
        if((data.originalFiles[0]['type'] && !acceptFileTypes.test(data.originalFiles[0]['type'])) || !data.originalFiles[0]['type']) {
          uploadErrors.push('Not an accepted file type');
        }
        if(data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 1024*1024*2) {
          uploadErrors.push('Filesize is too big');
        }
        if(uploadErrors.length > 0) {
          alert(uploadErrors.join("\n"));
        } else {
          /* check if exist img src is exist or not*/
          $.ajax({
            /* Request method.*/
            method: "POST",
            /* Request URL.*/
            url: $.cloud_assets.config_upload_api_del,
            /* Request params.*/
            data: {
              src: $('#'+fileFieldID+'-img').prop('src')
            }
          })
            .done (function (data) {
              console.log ('image was deleted');
            })
            .fail (function () {
              console.log ('image delete problem');
            });
          data.submit();
        }
      },
      done: function (e, data) {
        var link = data.result.link;
        var rtlink = data.result.ref_url_path;
        $('#'+fileFieldID+'-progress .progress-bar').css(
          'width','0%'
        );
        $('#'+fileFieldID+'-img').prop('src',link).trigger('change');
        $('#form_'+fileFieldID).val(rtlink).trigger('change');
      },
      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#'+fileFieldID+'-progress .progress-bar').css(
          'width',
          progress + '%'
        );
      }
    }).prop('disabled', !$.support.fileInput)
      .parent().addClass($.support.fileInput ? undefined : 'disabled');

    /*
    .bind('fileuploadadd', function (e, data) { console.log('trigger event : add');})
    .bind('fileuploadsubmit', function (e, data) { console.log('trigger event : submit');})
    .bind('fileuploadsend', function (e, data) { console.log('trigger event : send');})
    .bind('fileuploaddone', function (e, data) { console.log('trigger event : done');})
    .bind('fileuploadfail', function (e, data) { console.log('trigger event : fail');})
    .bind('fileuploadalways', function (e, data) { console.log('trigger event : always');})
    .bind('fileuploadprogress', function (e, data) { console.log('trigger event : progress');})
    .bind('fileuploadprogressall', function (e, data) { console.log('trigger event : progressall');})
    .bind('fileuploadstart', function (e) { console.log('trigger event : start');})
    .bind('fileuploadstop', function (e) { console.log('trigger event : stop');})
    .bind('fileuploadchange', function (e, data) { console.log('trigger event : change');})
    .bind('fileuploadpaste', function (e, data) { console.log('trigger event : paste');})
    .bind('fileuploaddrop', function (e, data) { console.log('trigger event : drop');})
    .bind('fileuploaddragover', function (e) { console.log('trigger event : dragover');})
    .bind('fileuploadchunksend', function (e, data) { console.log('trigger event : chunksend');})
    .bind('fileuploadchunkdone', function (e, data) { console.log('trigger event : chunkdone');})
    .bind('fileuploadchunkfail', function (e, data) { console.log('trigger event : chunkfail');})
    .bind('fileuploadchunkalways', function (e, data) { console.log('trigger event : chunkalways');});
    */

  });
  }
  $.fn.xptUploadRemove = function() {
    return this.each(function  () {
    $(this).click(function  () {
      var fileFieldID = $(this).data('fileupload-id');
      $('#'+fileFieldID+'-img').prop('src',"").trigger('change');
      $('#form_'+fileFieldID).val("").trigger('change');
    });
  });
  }
}( jQuery ));
