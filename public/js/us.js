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
//  let MN_1=[],IA_1=[],MO_1=[],AR_1=[],LA_1=[],MS_1=[],AL_1=[],GA_1=[],SC_1=[],NC_1=[],VA_1=[],TN_1=[],KY_1=[],IN_1=[],IL_1=[],OH_1=[],WV_1=[],MD_1=[],PA_1=[],WI_1=[],MI_1=[],NY_1=[],ME_1=[],MA_1=[],FL_1=[],TX_1=[],OK_1=[],KS_1=[],NE_1=[],SD_1=[],ND_1=[],MT_1=[],WY_1=[],CO_1=[],NM_1=[],AZ_1=[],UT_1=[],ID_1=[],NV_1=[],CA_1=[],OR_1=[],WA_1=[],AK_1=[],HI_1=[],NJ_1=[],DE_1=[],DC_1=[],CT_1=[],RI_1=[],VT_1=[],NH_1=[],AS_1=[],MP_1=[],GU_1=[],VI_1=[],PR_1=[];

 function count(data){
	let state = {MN_1:0,IA_1:0,MO_1:0,AR_1:0,LA_1:0,MS_1:0,AL_1:0,GA_1:0,SC_1:0,NC_1:0,VA_1:0,TN_1:0,KY_1:0,IN_1:0,IL_1:0,OH_1:0,WV_1:0,MD_1:0,PA_1:0,WI_1:0,MI_1:0,NY_1:0,ME_1:0,MA_1:0,FL_1:0,TX_1:0,OK_1:0,KS_1:0,NE_1:0,SD_1:0,ND_1:0,MT_1:0,WY_1:0,CO_1:0,NM_1:0,AZ_1:0,UT_1:0,ID_1:0,NV_1:0,CA_1:0,OR_1:0,WA_1:0,AK_1:0,HI_1:0,NJ_1:0,DE_1:0,DC_1:0,CT_1:0,RI_1:0,VT_1:0,NH_1:0,AS_1:0,MP_1:0,GU_1:0,VI_1:0,PR_1:0};
	for(i=0;i<data.length;i++){
		for(let key in state){
			if(key==data[i].stateCode+'_1'){
				state[key]++;
			}
		}
	}
	return state;
 }
 function link(){
	let state = {MN_1:"Minnesota",IA_1:'Iowa',MO_1:'Missouri',AR_1:'Arkansas',LA_1:'Louisiana',MS_1:'Mississippi',AL_1:'Alabama',GA_1:'Georgia',SC_1:'South_Carolina',NC_1:'North_Carolina',VA_1:'Virginia',TN_1:'Tennessee',KY_1:'Kentucky',IN_1:'Indiana',IL_1:'Illinois',OH_1:'Ohio',WV_1:'West Virginia',MD_1:'Maryland',PA_1:'Pennsylvania',WI_1:'Wisconsin',MI_1:'Michigan',NY_1:'New York',ME_1:'Maine',MA_1:'Massachusetts:',FL_1:'Florida',TX_1:'Texas',OK_1:'Oklahoma',KS_1:'Kansas',NE_1:'Nebraska',SD_1:'South_Dakota',ND_1:'North_Dakota',MT_1:'Montana',WY_1:'Wyoming',CO_1:'Colorado',NM_1:'New_Mexico',AZ_1:'Arizona',UT_1:'Utah:',ID_1:'Idaho',NV_1:'Nevada',CA_1:'California',OR_1:'Oregon',WA_1:'Washington',AK_1:'Alaska',HI_1:'Hawaii',NJ_1:'New_Jersey',DE_1:'Delaware',DC_1:'DC',CT_1:'',RI_1:'Rhode_Island',VT_1:'Vermont',NH_1:'New Hampshire',AS_1:'American_Samoa',MP_1:'Northern_Mariana_Islands',GU_1:'Guam',VI_1:'US_Virgin_Islands',PR_1:'Puerto_Rico'};
	return state;
 }
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

//创建选择菜单
function appendVisitText(){
    // let list=document.createElement("div");
	// $(list).addClass('center');
	// $(list).attr('id','list');       
    // $("#map").append(list);   
	let list = document.createElement('div');
	$(list).attr('id','list');
	$(list).addClass('center');
	$('#btn').append(list);
	$('#list').html('You have visited:');
	$('#list').first().css('color','#0f7ce2')
}

function appendWishText(){
    // let list=document.createElement("div");
	// $(list).addClass('center');
	// $(list).attr('id','list');       
    // $("#map").append(list);   
	let list = document.createElement('div');
	$(list).attr('id','list');
	$(list).addClass('center');
	$('#btn').append(list);
	$('#list').html('You wish to go:');
	$('#list').first().css('color','#f3488f')
}

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

let visited = document.getElementById("btn_visited");
visited.onclick=function(){
	$.ajax({
		type:"get",
		url:"http://localhost:3000/parkvisited",
		dataType:'json',
		success: function(data){
			let link = {MN_1:"Minnesota",IA_1:'Iowa',MO_1:'Missouri',AR_1:'Arkansas',LA_1:'Louisiana',MS_1:'Mississippi',AL_1:'Alabama',GA_1:'Georgia',SC_1:'South_Carolina',NC_1:'North_Carolina',VA_1:'Virginia',TN_1:'Tennessee',KY_1:'Kentucky',IN_1:'Indiana',IL_1:'Illinois',OH_1:'Ohio',WV_1:'West Virginia',MD_1:'Maryland',PA_1:'Pennsylvania',WI_1:'Wisconsin',MI_1:'Michigan',NY_1:'New York',ME_1:'Maine',MA_1:'Massachusetts:',FL_1:'Florida',TX_1:'Texas',OK_1:'Oklahoma',KS_1:'Kansas',NE_1:'Nebraska',SD_1:'South_Dakota',ND_1:'North_Dakota',MT_1:'Montana',WY_1:'Wyoming',CO_1:'Colorado',NM_1:'New_Mexico',AZ_1:'Arizona',UT_1:'Utah:',ID_1:'Idaho',NV_1:'Nevada',CA_1:'California',OR_1:'Oregon',WA_1:'Washington',AK_1:'Alaska',HI_1:'Hawaii',NJ_1:'New_Jersey',DE_1:'Delaware',DC_1:'DC',CT_1:'Connecticut',RI_1:'Rhode_Island',VT_1:'Vermont',NH_1:'New Hampshire',AS_1:'American_Samoa',MP_1:'Northern_Mariana_Islands',GU_1:'Guam',VI_1:'US_Virgin_Islands',PR_1:'Puerto_Rico'};
			let state = count(data);
			$("#list").remove();
			for(let key in link){
				let st = document.getElementById(link[key]);
				$(st).removeClass('st2');
				$(st).removeClass('st3');
				$(st).removeClass('st4');
				$(st).removeClass('st5');
				$(st).removeClass('st6');
				$(st).removeClass('st7');
				$(st).removeClass('st16');
				$(st).removeClass('st17');
				$(st).removeClass('st18');
				$(st).removeClass('st19');
				$(st).addClass('st1');
				if(state[key]==1){
					$(st).removeClass('st1');
					$(st).addClass('st2');
				}else if(state[key]==2){
					$(st).removeClass('st1');
					$(st).addClass('st3');
				}else if(state[key]==3){
					$(st).removeClass('st1');
					$(st).addClass('st4');
				}else if(state[key]==4){
					$(st).removeClass('st1');
					$(st).addClass('st5');
				}else if(state[key]>=5){
					$(st).removeClass('st1');
					$(st).addClass('st6');
				}
			}
			appendVisitText();
			console.info(data);
			if(data.length==0){
				let park = document.createElement('div');
				let text = document.createElement('span');
				$(text).html('No record in your list!');
				$(park).append(text);
				$(park).addClass('park');
				$('#list').append(park);
				return 0;
			}
			for(let key in data){
				let park = document.createElement('div');
				let text = document.createElement('span');
				$(text).html(data[key].parkName);
				$(park).append(text);
				$(park).addClass('park');
				$('#list').append(park);
			}
		},
		error:function(e){
			alert(e.responseText);
		}
	});
}

let wishlist = document.getElementById("btn_wishlist");
wishlist.onclick=function(){
	$.ajax({
		type:"get",
		url:"http://localhost:3000/parkwish",
		dataType:'json',
		success: function(data){
			let link = {MN_1:"Minnesota",IA_1:'Iowa',MO_1:'Missouri',AR_1:'Arkansas',LA_1:'Louisiana',MS_1:'Mississippi',AL_1:'Alabama',GA_1:'Georgia',SC_1:'South_Carolina',NC_1:'North_Carolina',VA_1:'Virginia',TN_1:'Tennessee',KY_1:'Kentucky',IN_1:'Indiana',IL_1:'Illinois',OH_1:'Ohio',WV_1:'West Virginia',MD_1:'Maryland',PA_1:'Pennsylvania',WI_1:'Wisconsin',MI_1:'Michigan',NY_1:'New York',ME_1:'Maine',MA_1:'Massachusetts:',FL_1:'Florida',TX_1:'Texas',OK_1:'Oklahoma',KS_1:'Kansas',NE_1:'Nebraska',SD_1:'South_Dakota',ND_1:'North_Dakota',MT_1:'Montana',WY_1:'Wyoming',CO_1:'Colorado',NM_1:'New_Mexico',AZ_1:'Arizona',UT_1:'Utah:',ID_1:'Idaho',NV_1:'Nevada',CA_1:'California',OR_1:'Oregon',WA_1:'Washington',AK_1:'Alaska',HI_1:'Hawaii',NJ_1:'New_Jersey',DE_1:'Delaware',DC_1:'DC',CT_1:'Connecticut',RI_1:'Rhode_Island',VT_1:'Vermont',NH_1:'New Hampshire',AS_1:'American_Samoa',MP_1:'Northern_Mariana_Islands',GU_1:'Guam',VI_1:'US_Virgin_Islands',PR_1:'Puerto_Rico'};
			let state = count(data);
			$("#list").remove();
			for(let key in link){
				let st = document.getElementById(link[key]);
				$(st).removeClass('st2');
				$(st).removeClass('st3');
				$(st).removeClass('st4');
				$(st).removeClass('st5');
				$(st).removeClass('st6');
				$(st).removeClass('st7');
				$(st).removeClass('st16');
				$(st).removeClass('st17');
				$(st).removeClass('st18');
				$(st).removeClass('st19');
				$(st).addClass('st1');
				if(state[key]==1){
					$(st).removeClass('st1');
					$(st).addClass('st7');
				}else if(state[key]==2){
					$(st).removeClass('st1');
					$(st).addClass('st16');
				}else if(state[key]==3){
					$(st).removeClass('st1');
					$(st).addClass('st17');
				}else if(state[key]==4){
					$(st).removeClass('st1');
					$(st).addClass('st18');
				}else if(state[key]>=5){
					$(st).removeClass('st1');
					$(st).addClass('st19');
				}
			}
			appendWishText();
			if(data.length==0){
				let park = document.createElement('div');
				let text = document.createElement('span');
				$(text).html('No record in your list!');
				$(park).append(text);
				$(park).addClass('park');
				$('#list').append(park);
				return 0;
			}
			for(let key in data){
				let park = document.createElement('div');
				let text = document.createElement('span');
				$(text).html(data[key].parkName);
				$(park).append(text);
				$(park).addClass('park');
				$('#list').append(park);
			}
		},
		error:function(e){
			alert(e.responseText);
		}
	});
}

let getRecordButton = document.getElementById("btn-record-data")
getRecordButton.addEventListener('click',() => {
	$.ajax({
		type:"get",
		url:"http://localhost:3000/record",
		dataType: 'json',
		success: (record) => {
			let wishedRecord = document.querySelector(".wished-data")
			wishedRecord.innerText = `Wish to go Park: ${record.wishedAmount}/63`
			let visitedRecord = document.querySelector(".visited-data")
			visitedRecord.innerText = `Visited Park: ${record.visitedAmount}/63`
		},
		error: (e) => {
			alert(e.responseText);
		}
	});
})