let sub = $();
$('#sub').click(function(){
    let data = [];
    let string = null;
    let i = 0;
    while($('#'+i+' option:selected').val()!=undefined){
        string = $('#'+i+' option:selected').val();
        string=string.trim().replace(/["+]/g,"");
        let p = string.split('@');
        if(p.length<2){
          alert('Something went wrong, please refresh the page!');
          return;
        }
        if(p[1]!='havebeen'&&p[1]!='never'&&p[1]!='wish'){
          alert('Something went wrong, please refresh the page!');
          return;
        }
        data.push(string);
        i++;
    }
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
        let p = string.split('@');
        if(p.length<2){
          alert('Something went wrong, please refresh the page!');
          return;
        }
        if(p[1]!='havebeen'&&p[1]!='never'&&p[1]!='wish'){
          alert('Something went wrong, please refresh the page!');
          return;
        }
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