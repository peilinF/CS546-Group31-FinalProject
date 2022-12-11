// const state = require('./park_state.js');
// document.write("<script language=javascript src='/public/js/park_state.js’></script>");
function formSubmit(url) {
    var turnForm = document.createElement("form");     
    document.body.appendChild(turnForm);
    turnForm.method = 'get';
 	turnForm.action = url;
 	// turnForm.target = '_blank'; 你妹的原来这样会打开一个新网页
    turnForm.submit();
}	
// let MN_1=[],IA_1=[],MO_1=[],AR_1=[],LA_1=[],MS_1=[],AL_1=[],GA_1=[],SC_1=[],NC_1=[],VA_1=[],TN_1=[],KY_1=[],IN_1=[],IL_1=[],OH_1=[],WV_1=[],MD_1=[],PA_1=[],WI_1=[],MI_1=[],NY_1=[],ME_1=[],MA_1=[],FL_1=[],TX_1=[],OK_1=[],KS_1=[],NE_1=[],SD_1=[],ND_1=[],MT_1=[],WY_1=[],CO_1=[],NM_1=[],AZ_1=[],UT_1=[],ID_1=[],NV_1=[],CA_1=[],OR_1=[],WA_1=[],AK_1=[],HI_1=[],NJ_1=[],DE_1=[],DC_1=[],CT_1=[],RI_1=[],VT_1=[],NH_1=[],AS_1=[],MP_1=[],GU_1=[],VI_1=[],PR_1=[];

// function createlist(){
// 	let list = document.createElement("div");
// 	list.setAttribute("width",300);
// 	list.setAttribute("height",400);
// 	list.setAttribute("background-color","white");
// 	let map = document.getElementById("地区");
// 	$("地区").append(list);
// }

//创建表单并添加
// function formsubmit(url){
// 	let form = document.createElement('form');
// 	$(form).attr('action',url);
// 	let select = document.createElement('select');
// 	let havebeen = document.createElement('option');
// 	let never = document.createElement('option');
// 	let wish = document.createElement('option');
// 	$(havebeen).attr('value','HAVEBEEN');
// 	$(never).attr('value','NEVER');
// 	$(wish).attr('value','WISHTOGO');
// 	$(havebeen).html('HAVE BEEN');
// 	$(never).html('NEVER');
// 	$(wish).html('WISH TO GO');
// 	$(select).append(havebeen);
// 	$(select).append(never);
// 	$(select).append(wish);
// 	$(form).append(select);
// 	$(form).attr('method','post');
// 	$(form).addClass('form');
// 	return form;
// }

// //创建选择菜单
// function appendText(){
//     let list=document.createElement("div");
// 	$(list).addClass('center');
// 	$(list).attr('id','list');       
//     $("#map").append(list);      
// }

// let AK = document.getElementById("Alaska");
// AK.onclick=function(){
// 	$.ajax({
// 		type:"get",
// 		url:"http://localhost:3000/AK",
// 		dataType:'json',
// 		success: function(data){
// 			AK_1=data;
// 			console.info(AK_1.length);
// 			appendText();  
// 			for(i=0;i<AK_1.length;i++){
// 			let park = document.createElement('div');
// 			let text = document.createElement('span');
// 			$(text).html(AK_1[i].parkName);
// 			$(park).append(text);
// 			$(park).addClass('park');
// 			$('#list').append(park);
// 			$(park).attr('id','park'+[i]);
// 			$('#park'+[i]).append(formsubmit('http://localhost:3000/updatepark'));
// 	}
// 		}
// 	});
// }

// let WA = document.getElementById("Washington");
// WA.onclick=function(){
// 	$.ajax({
// 		type:"get",
// 		url:"http://localhost:3000/WA",
// 		dataType:'json',
// 		success: function(data){
// 			AK_1=data;
// 		}
// 	});
// }

// let OR = document.getElementById("Oregon");
// OR.onclick=function(){
// 	$.ajax({
// 		type:"get",
// 		url:"http://localhost:3000/OR",
// 		dataType:'json',
// 		success: function(data){
// 			AK_1=data;
// 		}
// 	});
// }

let AK = document.getElementById("Alaska");
AK.onclick=function(){
	formSubmit('http://localhost:3000/AK');
}

let OR = document.getElementById("Oregon");
OR.onclick=function(){
	formSubmit('http://localhost:3000/OR');
}

let WA = document.getElementById("Washington");
WA.onclick=function(){
	formSubmit('http://localhost:3000/wA');
}

let CA = document.getElementById("California");
CA.onclick=function(){
	formSubmit('http://localhost:3000/CA');
}

let UT = document.getElementById("Utah");
UT.onclick=function(){
	formSubmit('http://localhost:3000/UT');
}

let TX = document.getElementById("Texas");
TX.onclick=function(){
	formSubmit('http://localhost:3000/TX');
}

let NM = document.getElementById("New_Mexico");
NM.onclick=function(){
	formSubmit('http://localhost:3000/NM');
}

let AZ = document.getElementById("Arizona");
AZ.onclick=function(){
	formSubmit('http://localhost:3000/AZ');
}

let NV = document.getElementById("Nevada");
NV.onclick=function(){
	formSubmit('http://localhost:3000/NV');
}

let CO = document.getElementById("Colorado");
CO.onclick=function(){
	formSubmit('http://localhost:3000/CO');
}

let WY = document.getElementById("Wyoming");
WY.onclick=function(){
	formSubmit('http://localhost:3000/WY');
}

let MT = document.getElementById("Montana");
MT.onclick=function(){
	formSubmit('http://localhost:3000/MT');
}

let ME = document.getElementById("Maine");
ME.onclick=function(){
	formSubmit('http://localhost:3000/ME');
}

let SD = document.getElementById("South_Dakota");
SD.onclick=function(){
	formSubmit('http://localhost:3000/SD');
}

let OH = document.getElementById("Ohio");
OH.onclick=function(){
	formSubmit('http://localhost:3000/OH');
}

let MO = document.getElementById("Missouri");
MO.onclick=function(){
	formSubmit('http://localhost:3000/MO');
}

let AR = document.getElementById("Arkansas");
AR.onclick=function(){
	formSubmit('http://localhost:3000/AR');
}

let IN = document.getElementById("Indiana");
IN.onclick=function(){
	formSubmit('http://localhost:3000/IN');
}

let MI = document.getElementById("Michigan");
MI.onclick=function(){
	formSubmit('http://localhost:3000/MI');
}

let NY = document.getElementById("New_York");
NY.onclick=function(){
	formSubmit('http://localhost:3000/NY');
}

let VA = document.getElementById("Virginia");
VA.onclick=function(){
	formSubmit('http://localhost:3000/VA');
}

let ND = document.getElementById("North_Dakota");
ND.onclick=function(){
	formSubmit('http://localhost:3000/ND');
}

let MN = document.getElementById("Minnesota");
MN.onclick=function(){
	formSubmit('http://localhost:3000/MN');
}

let FL = document.getElementById("Florida");
FL.onclick=function(){
	formSubmit('http://localhost:3000/FL');
}

let SC = document.getElementById("South_Carolina");
SC.onclick=function(){
	formSubmit('http://localhost:3000/SC');
}

let TN = document.getElementById("Tennessee");
TN.onclick=function(){
	formSubmit('http://localhost:3000/TN');
}

let KY = document.getElementById("Kentucky");
KY.onclick=function(){
	formSubmit('http://localhost:3000/KY');
}

let WV = document.getElementById("West_Virginia");
WV.onclick=function(){
	formSubmit('http://localhost:3000/WV');
}

let VI = document.getElementById("US_Virgin_Islands");
VI.onclick=function(){
	formSubmit('http://localhost:3000/VI');
}

