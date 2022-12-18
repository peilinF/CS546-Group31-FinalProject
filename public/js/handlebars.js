let sub = $();
$('#sub').click(function(){
    let data = [];
    let string = null;
    let i = 0;
    while($('#'+i+' option:selected').val()!=undefined){
        string = $('#'+i+' option:selected').val();
        string=string.trim().replace(/["+]/g,"");
        data.push(string);
        i++;
    }
    console.info(data);
    $.ajax({
        url:"/updatepark",
        type:"POST",
        dataType:"JSON",
        data:{data},
        success:function (data) {
          // selss = data.data
        },
        error:function(){
          alert('Something went wrong, please refresh the page!');
        }
      })
      window.location.href = "/";
});

$(document).keyup(function(e){
  let key = e.which;
  if(key==13&&document.getElementById('sub')){
    let data = [];
    let string = null;
    let i = 0;
    while($('#'+i+' option:selected').val()!=undefined){
        string = $('#'+i+' option:selected').val();
        string=string.trim().replace(/["+]/g,"");
        data.push(string);
        i++;
    }
    console.info(data);
    $.ajax({
        url:"/updatepark",
        type:"POST",
        dataType:"JSON",
        data:{data},
        success:function (data) {
          // selss = data.data
        },
        error:function(){
          alert('Something went wrong, please refresh the page!');
        }
      })
      window.location.href = "/";
  }
});