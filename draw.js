var cv=new Array();
var ct=[];
for(i=0;i<=9;i++){
	cv[i]=document.getElementById("canvas"+i);
	ct[i]=cv[i].getContext("2d");
}

function changeSize(){//定义浏览器窗口大小改变时画布的大小
	var width=document.body.clientWidth;
	var height=document.body.clientHeight;
	for(i=0;i<=9;i++){
		cv[i].setAttribute("width",width);
		cv[i].setAttribute("height",height);
	}
}


function getcol(bit='#',alpha=''){//随机获取颜色的函数
	if(bit=="rgb"){
		var rgb=[
			Math.floor(256*Math.random()),
			Math.floor(256*Math.random()),
			Math.floor(256*Math.random())
		]
		var col="rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
	}
	if(bit=="rgba"){
		var rgb=[
			Math.floor(256*Math.random()),
			Math.floor(256*Math.random()),
			Math.floor(256*Math.random())
		]
		var col="rgba("+rgb[0]+","+rgb[1]+","+rgb[2]+","+alpha+")";
	}
	if(bit=="#"){
		col="#"+Math.floor(Math.random()*0xffffff).toString(16);
		//toString(),可以转换2~32进制
	}
	return col;
}

function draw_cv0(){
	var y=50+Math.floor(Math.random()*(cv[0].height-100));//控制出现在y轴的范围，顶边50和底边50不画
	var x0=0,x1=-cv[0].width;//线的长度为x1
	var stop;
	var col=getcol("#");//获取随机颜色
	function drawline(){
		ct[0].beginPath();
		ct[0].fillStyle=col;
		ct[0].fillRect(x0,y,50,20);//画矩形fillrect(x,y,width,height)
		ct[0].clearRect(x1,y,50,20);//矩形清除
		ct[0].save();
		x0=x0+50;
		x1=x1+50;
		if(x1>=cv[0].width){clearInterval(stop)}
	}
	stop=setInterval(drawline,10);//每10毫秒执行一次
}

function draw_cv1(){
		var x=Math.floor(Math.random()*cv[1].width);
		var y=Math.floor(Math.random()*cv[1].height);
		var y0=0,y1=-200;
		var stop;
		var col=getcol("#");
		function drawline(){
			ct[1].beginPath();
			ct[1].fillStyle=col;
			ct[1].fillRect(x,y0,20,10);
			ct[1].clearRect(x,y1,20,10);
			ct[1].save();
			y0=y0+20;
			y1=y1+20;
			if(y1>=cv[1].height){clearInterval(stop)}
		}
		stop=setInterval(drawline,10);
}

//draw_cv2,8,9内容一样
var running_cv2=false;//判断是否在画cv2。true为正在画。
var stop_cv2;//控制画停止
function draw_cv2(){
	//画圆arc(x,y,r,sAngle,eAngle,clockwise)
	var x=cv[2].width/2;//圆心坐标(x,y)
	var y=cv[2].height/2;
	var r=40+Math.floor(Math.random()*(cv[2].height/2-40));//圆半径大于40,直径小于画布高度
	var sAngle=2*Math.floor(360*Math.random())/360*Math.PI;//起始角，弧度计
	var Ang=20/360*Math.PI;//角度偏移量
	var clockwise=(Math.random()*10)>=5?true:false;//false顺时针，true逆时针
	
	var col=getcol("rgba",0.7);//获取随机颜色
	
	//检测是否已经在画圆。若正在画时按下对应键则删除上一幅画开始新画
	if(!running_cv2){
		stop_cv2=setInterval(drawArc,10);
		running_cv2=true;
	}else{
		clearInterval(stop_cv2);
		ct[2].clearRect(0,0,cv[2].width,cv[2].height);
		running_cv2=false;
		draw_cv2();
		return 0;
	}
	var sA=sAngle;
	function drawArc(){
		ct[2].clearRect(0,0,cv[2].width,cv[2].height);
		ct[2].fillStyle=col;
		ct[2].beginPath();
		
		//画第一条线
		ct[2].moveTo(x,y);
		ct[2].lineTo(x+r*Math.cos(sAngle),y+r*Math.sin(sAngle));
		
		//画弧形
		if(!clockwise){//顺时针
			ct[2].arc(x,y,r,sAngle,sAngle+Ang,clockwise);
		}else{//逆时针
			ct[2].arc(x,y,r,sAngle,sAngle-Ang,clockwise);
		}
		
		//画第二条线
		ct[2].lineTo(x,y);
		
		//填充颜色
		ct[2].fill();
		
		Ang+=(20/360*Math.PI);
		if(Ang>=2*Math.PI){
			clearInterval(stop_cv2);
			Ang=20/360*Math.PI;
			stop_cv2=setInterval(clearArc,10);
			function clearArc(){
				ct[2].clearRect(0,0,cv[2].width,cv[2].height);
				ct[2].beginPath();
				ct[2].moveTo(x,y);
				ct[2].lineTo(x+r*Math.cos(sAngle),y+r*Math.sin(sAngle));
				if(clockwise==false){
					ct[2].arc(x,y,r,sAngle,sAngle+Ang,!clockwise);//反向画等于删除
				}else{
					ct[2].arc(x,y,r,sAngle,sAngle-Ang,!clockwise);
				}
				ct[2].lineTo(x,y);
				ct[2].fill();
				Ang+=(20/360*Math.PI);
				if(Ang>=2*Math.PI){
					clearInterval(stop_cv2);
					ct[2].clearRect(0,0,cv[2].width,cv[2].height);
					running_cv2=false;
				}
			}
		}
	}
}

var running_cv3=false;//判断是否在画cv3
var stop_cv3;//控制画停止
function draw_cv3(){
	//检测是否已经在画圆。若正在画时按下对应键则删除上一幅画开始新画
	if(!running_cv3){
		stop_cv3=setInterval(drawCircles,10);
		running_cv3=true;
	}else{
		clearInterval(stop_cv3);
		ct[3].clearRect(0,0,cv[3].width,cv[3].height);
		running_cv3=false;
		draw_cv3();
	}
	var circlenums=3+Math.floor(Math.random()*7);//小圆的个数
	var pos=[];
	for(i=0;i<circlenums;i++){//每个圆的属性
		pos[i]={
			x : Math.floor(Math.random()*cv[3].width),
			y : Math.floor(Math.random()*cv[3].height),
			r : 10+Math.floor(Math.random()*cv[3].height/20),
			col : getcol("rgba",0.7)
		};
	}
	var i=0;
	var r_increment;//半径的增量
	var n=0;
	function drawCircles(){
		r_increment=n/10*pos[i].r;
		ct[3].beginPath();
		ct[3].fillStyle=pos[i].col;
		ct[3].moveTo(pos[i].x, pos[i].y);
		ct[3].arc(pos[i].x, pos[i].y, r_increment, 0, 2*Math.PI);
		ct[3].fill();
		ct[3].save();
		n++;
		if(n>10){
			//画完一个圆，条件改变画另一个
			n=1;
			i++;
			if(i>=circlenums){
				clearInterval(stop_cv3);
				n=10;
				i=0;
				stop_cv3=setInterval(clearCircles,10);
			}
		}
	}
	
	function clearCircles(){
			r_increment=n/10*pos[i].r;
			ct[3].clearRect((pos[i].x-pos[i].r) ,(pos[i].y-pos[i].r), 
						(2*pos[i].r), (2*pos[i].r));
			ct[3].beginPath();
			ct[3].fillStyle=pos[i].col;
			ct[3].moveTo(pos[i].x, pos[i].y);
			ct[3].arc(pos[i].x, pos[i].y, r_increment, 0, 2*Math.PI);
			ct[3].fill();
			ct[3].save();
			n--;
			if(n<0){
				//消除完一个开始消除下一个
				n=10;
				i++;
				if(i>=circlenums){
					clearInterval(stop_cv3);
					ct[3].clearRect(0,0,cv[3].width,cv[3].height);
					running_cv3=false;
				}
			}
	}
}

var running_cv4=false;//判断是否在画cv4
var stop_cv4;//控制画停止
function draw_cv4(){
	if(!running_cv4){
		stop_cv4=setInterval(drawpolygon,10);
		running_cv4=true;
	}else{
		clearInterval(stop_cv4);
		ct[4].clearRect(0,0,cv[4].width,cv[4].height);
		running_cv4=false;
		draw_cv4();
	}
	var sidenums=3+Math.floor(Math.random()*8);//随机3~10边形
	var degree=2*Math.PI/sidenums;//角度
	//多边形外接圆的圆心x,y,半径r
	var x=cv[4].width/2;
	var y=cv[4].height/2;
	var r=cv[4].height/5;
	var sAng=2*Math.PI*Math.random()//随机初始角
	
	var clockwise=Math.floor(Math.random()*2)>0?true:false;//false顺时针,true逆时针
	var pos=[];//坐标数组
	for(i=0;i<sidenums;i++){
		if(!clockwise){//顺
			pos[i]={
				x : x+r*Math.cos(sAng+i*degree),
				y : y+r*Math.sin(sAng+i*degree)
			}
		}else{//逆
			pos[i]={
				x : x+r*Math.cos(sAng-i*degree),
				y : y+r*Math.sin(sAng-i*degree)
			}
		}
	}
	var i=0;
	var n=1;
	//画多边形每条边的速度，边数越大每条边画的段数越少,vx,vy为每一段的增量
	var sidespeed=13-sidenums;//描边速度
	var vx;
	var vy;
	var strokewid=14;//定义描边粗细
	ct[4].strokeStyle=getcol("#");

	function drawpolygon(){//画多边形polygon的函数
		if(i<sidenums-1){
			vx=n/sidespeed*(pos[i+1].x-pos[i].x);
			vy=n/sidespeed*(pos[i+1].y-pos[i].y);
		}else{
			sidespeed=15;//最后一段减速以残留更多时间
			vx=n/sidespeed*(pos[0].x-pos[i].x);
			vy=n/sidespeed*(pos[0].y-pos[i].y);
		}
		ct[4].beginPath();
		ct[4].lineWidth=strokewid;
		ct[4].lineCap="round";
		ct[4].moveTo(pos[i].x,pos[i].y);
		ct[4].lineTo(pos[i].x+vx,pos[i].y+vy);
		ct[4].stroke();
		n++;
		if(n>sidespeed){
			n=1;
			i++;
			if(i>=sidenums){
				clearInterval(stop_cv4);
				stop_cv4=setInterval(clearpolygon,10);
			}
		}
	}
	function clearpolygon(){//清除多边形polygon的函数
		ct[4].clearRect(0,0,cv[4].width,cv[4].height);
		//改变多边形外接圆的半径和描边的粗细
		r=r+18;
		ct[4].lineWidth=strokewid;
		strokewid+=2;
		for(i=0;i<sidenums;i++){
			if(!clockwise){//顺
				pos[i]={
					x : x+r*Math.cos(sAng+i*degree),
					y : y+r*Math.sin(sAng+i*degree)
				}
			}else{//逆
				pos[i]={
					x : x+r*Math.cos(sAng-i*degree),
					y : y+r*Math.sin(sAng-i*degree)
				}
			}
		}
		//一次性画完多边形
		ct[4].beginPath();
		for(i in pos){
			ct[4].lineTo(pos[i].x,pos[i].y);
		}
		ct[4].closePath();
		ct[4].stroke();
		if(r>cv[4].width){
			clearInterval(stop_cv4);
			ct[4].clearRect(0,0,cv[4].width,cv[4].height);
			running_cv4=false;
		}
	}
}

//draw_cv5,7内容一样
var running_cv5=false;
var stop_cv5;
function draw_cv5(){
	if(!running_cv5){
		stop_cv5=setInterval(drawflash,10);
		running_cv5=true;
	}else{
		clearInterval(stop_cv5);
		ct[5].clearRect(0,0,cv[5].width,cv[5].height);
		running_cv5=false;
		draw_cv5();
	}
	var y=0;
	var col=getcol("#");
	function drawflash(){
		ct[5].clearRect(0,0,cv[5].width,cv[5].height);
		ct[5].save();//保存状态
		
		if(y%2==1){	
			ct[5].fillStyle=col;
			ct[5].fillRect(0,0,cv[5].width,cv[5].height);
		}
		y++;
		if(y>30){
			clearInterval(stop_cv5);
			running_cv5=false;
		}
		
		ct[5].beginPath();//清空之前的路径	
		ct[5].restore();//回复状态
	}
}

var running_cv6=false;
var stop_cv6;
function draw_cv6(){
	if(!running_cv6){
		stop_cv6=setInterval(draw,10);
		running_cv6=true;
	}else{
		clearInterval(stop_cv6);
		ct[6].clearRect(0,0,cv[6].width,cv[6].height);
		running_cv6=false;
		draw_cv6();
	}
	//x0,y0不变的基本坐标
	var x0=cv[6].width/4;
	var y0=cv[6].height/4;
	
	//cx,cy记录x,y的增量
	var cx;
	var cy;
	var x=x0;
	var y=0;
	
	var i=1;//控制画的循环
	var c=1;//控制清除的循环
	
	var sides=Math.floor(5+Math.random()*15);//随机坐标的数量,最多20
	var nums=(40-sides)/4;//每条线的绘画次数
	var lx=Math.floor(20+Math.random()*cv[6].width/20);//x的偏移量
	var ly=cv[6].height/2/(sides-3);//驼峰上两点之间y的距离
	//驼峰数等于sides-4,除数为驼峰数+1，因为两端驼峰较宽
	var post=[];
	post[0]={x:x0, y:0};
	post[1]={x:x0, y:y0};
	for(let i=2;i<sides-2;i++){
		if(i%2==0){
			post[i]={x:x0+lx, y:y0+(i-1)*ly};
		}else{
			post[i]={x:x0-lx, y:y0+(i-1)*ly};
		}
	}
	post[sides-2]={x:x0, y:3*y0};
	post[sides-1]={x:x0, y:cv[6].height};
	
	//方向控制
	var direction=Math.floor(Math.random()*4);
	switch(direction){
		case 0:{//正常绘制，左上到左下
			break;
		}
		case 1:{//旋转绘制，右下到右上
			ct[6].translate(cv[6].width,cv[6].height);//移动画布(0,0)点
			ct[6].rotate(Math.PI);//以画布(0,0)点旋转
			break;
		}
		case 2:{//x翻转绘制，右上到右下
			ct[6].translate(cv[6].width,0);
			ct[6].scale(-1,1);//缩放画布
			break;
		}
		case 3:{//y翻转绘制，左下到左上
			ct[6].translate(0,cv[6].height);
			ct[6].scale(1,-1);//缩放画布
			break;
		}
	}
	
	var col=getcol();
	ct[6].lineCap="round";
	ct[6].lineJoin="bevel";//线交接处的交点样式
	ct[6].lineWidth=cv[6].width/80;
	ct[6].strokeStyle=col;
	function draw(){
		ct[6].clearRect(0,0,cv[6].width,cv[6].height);
		ct[6].save();
		ct[6].beginPath();
		for(let j=1;j<=i;j++){
			ct[6].lineTo(post[j-1].x, post[j-1].y);
		}
		cx=(post[i].x-post[i-1].x)/nums;
		cy=(post[i].y-post[i-1].y)/nums;
		x=x+cx;
		y=y+cy;
		if(i!=9){
			ct[6].lineTo(x, y);
		}else{
			ct[6].lineTo(x0, y);
		}
		ct[6].stroke();
		ct[6].restore();
		if(y>=post[i].y){
			i++;
			if(i==sides){
				x=x0;
				y=0;
				clearInterval(stop_cv6);
				stop_cv6=setInterval(cleardraw,10);
			}
		}
	}
	
	function cleardraw(){
		ct[6].clearRect(0,0,cv[6].width,cv[6].height);
		ct[6].save();
		ct[6].beginPath();
		cx=(post[c].x-post[c-1].x)/nums;
		cy=(post[c].y-post[c-1].y)/nums;
		x=x+cx;
		y=y+cy;
		if(c!=9){
			ct[6].moveTo(x,y);	
		}else{
			ct[6].moveTo(x0,y);
		}
		for(let j=c+1;j<=i;j++){
			ct[6].lineTo(post[j-1].x, post[j-1].y);
		}
		ct[6].stroke();
		ct[6].restore();
		if(y>=post[c].y){
			c++;
			if(c==sides){
				ct[6].clearRect(0,0,cv[6].width,cv[6].height);
				clearInterval(stop_cv6);
				running_cv6=false;
			}
		}
	}
}

var running_cv7=false;
var stop_cv7;
function draw_cv7(){
	if(!running_cv7){
		stop_cv7=setInterval(drawflash,10);
		running_cv7=true;
	}else{
		clearInterval(stop_cv7);
		ct[7].clearRect(0,0,cv[7].width,cv[7].height);
		running_cv7=false;
		draw_cv7();
	}
	var y=0;
	var col=getcol("#");
	function drawflash(){
		ct[7].clearRect(0,0,cv[7].width,cv[7].height);
		ct[7].save();//保存状态
		
		if(y%2==1){	
			ct[7].fillStyle=col;
			ct[7].fillRect(0,0,cv[7].width,cv[7].height);
		}
		y++;
		if(y>30){
			clearInterval(stop_cv7);
			running_cv7=false;
		}
		
		ct[7].beginPath();//清空之前的路径	
		ct[7].restore();//回复状态
	}
}

var running_cv8=false;//判断是否在画cv8。true为正在画。
var stop_cv8;//控制画停止
function draw_cv8(){
	//画圆arc(x,y,r,sAngle,eAngle,clockwise)
	var x=cv[8].width/2;//圆心坐标(x,y)
	var y=cv[8].height/2;
	var r=40+Math.floor(Math.random()*(cv[8].height/2-40));//圆半径大于40,直径小于画布高度
	var sAngle=2*Math.floor(360*Math.random())/360*Math.PI;//起始角，弧度计
	var Ang=20/360*Math.PI;//角度偏移量
	var clockwise=(Math.random()*10)>=5?true:false;//false顺时针，true逆时针
	
	var col=getcol("rgba",0.7);//获取随机颜色
	
	//检测是否已经在画圆。若正在画时按下对应键则删除上一幅画开始新画
	if(!running_cv8){
		stop_cv8=setInterval(drawArc,10);
		running_cv8=true;
	}else{
		clearInterval(stop_cv8);
		ct[8].clearRect(0,0,cv[8].width,cv[8].height);
		running_cv8=false;
		draw_cv8();
		return 0;
	}
	var sA=sAngle;
	function drawArc(){
		ct[8].clearRect(0,0,cv[8].width,cv[8].height);
		ct[8].fillStyle=col;
		ct[8].beginPath();
		
		//画第一条线
		ct[8].moveTo(x,y);
		ct[8].lineTo(x+r*Math.cos(sAngle),y+r*Math.sin(sAngle));
		
		//画弧形
		if(!clockwise){//顺时针
			ct[8].arc(x,y,r,sAngle,sAngle+Ang,clockwise);
		}else{//逆时针
			ct[8].arc(x,y,r,sAngle,sAngle-Ang,clockwise);
		}
		
		//画第二条线
		ct[8].lineTo(x,y);
		
		//填充颜色
		ct[8].fill();
		
		Ang+=(20/360*Math.PI);
		if(Ang>=2*Math.PI){
			clearInterval(stop_cv8);
			Ang=20/360*Math.PI;
			stop_cv8=setInterval(clearArc,10);
			function clearArc(){
				ct[8].clearRect(0,0,cv[8].width,cv[8].height);
				ct[8].beginPath();
				ct[8].moveTo(x,y);
				ct[8].lineTo(x+r*Math.cos(sAngle),y+r*Math.sin(sAngle));
				if(clockwise==false){
					ct[8].arc(x,y,r,sAngle,sAngle+Ang,!clockwise);//反向画等于删除
				}else{
					ct[8].arc(x,y,r,sAngle,sAngle-Ang,!clockwise);
				}
				ct[8].lineTo(x,y);
				ct[8].fill();
				Ang+=(20/360*Math.PI);
				if(Ang>=2*Math.PI){
					clearInterval(stop_cv8);
					ct[8].clearRect(0,0,cv[8].width,cv[8].height);
					running_cv8=false;
				}
			}
		}
	}
}

function draw_cv9(){
		var x=Math.floor(Math.random()*cv[9].width);
		var y=Math.floor(Math.random()*cv[9].height);
		var y0=0,y1=-200;
		var stop;
		var col=getcol("#");
		function drawline(){
			ct[9].beginPath();
			ct[9].fillStyle=col;
			ct[9].fillRect(x,y0,20,10);
			ct[9].clearRect(x,y1,20,10);
			ct[9].save();
			y0=y0+20;
			y1=y1+20;
			if(y1>=cv[9].height){clearInterval(stop)}
		}
		stop=setInterval(drawline,10);
}

//按下按键执行对应动画
function boxs(event){
	var e = event || window.event;
	switch(true){
		case e.keyCode==48||e.keyCode==96:draw_cv5();break;//0
		case e.keyCode==49||e.keyCode==97:draw_cv1();break;//1
		case e.keyCode==50||e.keyCode==98:draw_cv2();break;//2
		case e.keyCode==51||e.keyCode==99:draw_cv3();break;//3
		case e.keyCode==52||e.keyCode==100:draw_cv4();break;//4
		case e.keyCode==53||e.keyCode==101:draw_cv0();break;//5
		case e.keyCode==54||e.keyCode==102:draw_cv6();break;//6
		case e.keyCode==55||e.keyCode==103:draw_cv7();break;//7
		case e.keyCode==56||e.keyCode==104:draw_cv8();break;//8
		case e.keyCode==57||e.keyCode==105:draw_cv9();break;//9
	}
}

document.onkeydown=boxs;//检测按键按下
window.onload=changeSize;//检测浏览器刷新,改变大小
window.onresize=changeSize;//检测浏览器窗口大小的改变
