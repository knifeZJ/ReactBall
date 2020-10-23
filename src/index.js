import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class CanvasComponent extends React.Component {
  constructor(props){
    super(props);
    this.canvas = React.createRef();
    this.state={f:null};
  }


  componentWillUpdate(){
    if(this.state.f)
    {
      clearInterval(this.state.f);
    }
  }


  componentDidUpdate() {
      this.updateCanvas();
  }
  updateCanvas() {
    console.log(this.props.game);
    console.log(this.props.difficulty);
    const canvas = this.canvas.current;
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");
        var game=this.props.game;  //用于判定游戏开始和游戏结束
        var win=-1;  //用于判定是否胜利
        var comspeed=Number(this.props.difficulty);  //用于设定游戏难度，实际上就是电脑的反应速度
        var reccomputer={x:canvas.width/2-50,y:0,width:100,height:30,speed:comspeed};
        var recplayer={x:canvas.width/2-50,y:canvas.height-30,width:100,height:30};
        var ball={x:canvas.width/2, y:canvas.height-60,radius:30,speed:5,
        angle:-1*Math.floor(Math.random()*30+30)-90*Math.floor(2*Math.random()),
        radians:0,xunits:0,yunits:0}; //设定球的相关参数
            
        updateBall(); //初始化方向

        var rec={  //设置矩形障碍的值
          x:Math.random()*(canvas.width-(Math.random()*50+100)-300)+150,
          y:100+Math.random()*(canvas.height-(Math.random()*50+100)-200),
          width:Math.random()*50+100,height:Math.random()*50+100,
          color:"#"+Math.floor(Math.random()*0xffffff).toString(16),
          flag:false};  //flag是在放置矩形时用来判断矩形是否和球重合

        //设置鼠标移动响应函数，更新玩家矩形的x坐标值
        canvas.addEventListener("mousemove",move);
      

        this.state.f=window.setInterval(drawScreen, 20);

        function  drawScreen () {
          if(game===false)
          {
            ctx.fillStyle = '#EEEEEE';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //Box
            ctx.strokeStyle = '#000000'; 
            ctx.strokeRect(1,  1, canvas.width-2, canvas.height-2);
            
            
            ctx.fontSize = 100;
            ctx.font ="normal normal 100px sans-serif";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            if(win===1){
              ctx.fillStyle = 'yellow';
              ctx.fillText("You Win!!!",  canvas.width/2 ,canvas.height/2);
            }
            else if(win===0){
              ctx.fillStyle = 'red';
              ctx.fillText("You Lose!!!",  canvas.width/2 ,canvas.height/2);
            }
          }
          else{
            ctx.fillStyle = '#EEEEEE';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //Box
            ctx.strokeStyle = '#000000'; 
            ctx.strokeRect(1,  1, canvas.width-2, canvas.height-2);
            ball.x += ball.xunits;
            ball.y += ball.yunits;
            ctx.fillStyle = "#000000";
            //画圆
            ctx.beginPath();
            ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,true);
            ctx.closePath();
            ctx.fill();
            //放置障碍矩形
            placerect();
            ctx.fillStyle = rec.color;
            ctx.fillRect(rec.x,rec.y,rec.width,rec.height);
            //更新电脑矩形的坐标
            updatecomputer();
            //画出电脑矩形和玩家矩形
            ctx.fillStyle = "#000000";
            ctx.fillRect(reccomputer.x,reccomputer.y,reccomputer.width,reccomputer.height);
            ctx.fillRect(recplayer.x,recplayer.y,recplayer.width,recplayer.height);
            //碰撞检测
            collide();
            
            if (ball.x > canvas.width-ball.radius || ball.x < 0+ball.radius ) {
              ball.angle = 180 - ball.angle;
              updateBall();
            } 
            if (ball.y > canvas.height-ball.radius) {
              game=false;
              win=0;
            }
            if (ball.y < 0+ball.radius) {
              game=false;
              win=1;
            }
            }
                
          }
          function updateBall() {
            ball.speed++; //与矩形发生碰撞后增加球的运动速度
            ball.radians = ball.angle * Math.PI/ 180;
            ball.xunits = Math.cos(ball.radians) * ball.speed;
            ball.yunits = Math.sin(ball.radians) * ball.speed;
          }
          function move(e){
            recplayer.x=e.clientX-canvas.getBoundingClientRect().left-recplayer.width/2;
          }

        function placerect(){
            while(rec.flag===false){
              updaterect();
          }
        }
        function updaterect(){
          rec={
            x:Math.random()*(canvas.width-(Math.random()*50+100)-300)+150,
            y:100+Math.random()*(canvas.height-(Math.random()*50+100)-200),
            width:Math.random()*50+100,height:Math.random()*50+100,
            color:"#"+Math.floor(Math.random()*0xffffff).toString(16),
            flag:false
          };  
          var d1=Math.sqrt((rec.width/2)*(rec.width/2)+(rec.height/2)*(rec.height/2));
          var d2=Math.sqrt((rec.x+rec.width/2-ball.x)*(rec.x+rec.width/2-ball.x)+(rec.y+rec.height/2-ball.y)*(rec.y+rec.height/2-ball.y));
          var d3=ball.radius;
          if( d1+d3< d2){
            rec.flag=true;
          }
        }
        function updatecomputer(){
          if(ball.x>reccomputer.x+reccomputer.width/2)
          {
            if(ball.speed<comspeed){
              reccomputer.x=ball.x-reccomputer.width/2;
            }
            else{
              reccomputer.x+=comspeed;
            }
          }
          else if(ball.x<reccomputer.x+reccomputer.width/2){
              if(ball.speed<comspeed){
                reccomputer.x=ball.x-reccomputer.width/2;
            }
            else{
                reccomputer.x-=comspeed;
            }
          }
        }

        function collide(){
        //玩家方块的碰撞检测
            //上下
            if(ball.x>recplayer.x&&ball.x<(recplayer.x+recplayer.width)){
              if(ball.y+ball.radius>=recplayer.y&&ball.y-ball.radius<=recplayer.y+recplayer.height){
              ball.angle = 360 - ball.angle;
              updateBall();
            }
          }
              //左右
          else if(ball.y>recplayer.y&&ball.y<(recplayer.y+recplayer.height)){
              if(ball.x+ball.radius>=recplayer.x&&ball.x-ball.radius<=recplayer.x+recplayer.width){
              ball.angle = 180 - ball.angle;
              updateBall();
            }
          }
              //左上
          else if(ball.x<recplayer.x&&ball.y<recplayer.y){
            var h1=ball.radius*ball.radius;
            var h2=(recplayer.x-ball.x)*(recplayer.x-ball.x);
            var h3=(recplayer.y-ball.y)*(recplayer.y-ball.y);
            if(h1>h2+h3){
              if(h2>=h3){
                ball.angle = 180 - ball.angle;
              }
              else{
                  ball.angle = 360 - ball.angle;
              }
              updateBall();
            }
          }
          //右上
          else if(ball.x>recplayer.x+recplayer.width&&ball.y<recplayer.y){
              var d1=ball.radius*ball.radius;
            var d2=(ball.x-recplayer.x-recplayer.width)*(ball.x-recplayer.x-recplayer.width);
            var d3=(recplayer.y-ball.y)*(recplayer.y-ball.y);
              if(d1>d2+d3){
                if(d2>=d3){
                  ball.angle = 180 - ball.angle;
              }
              else{
                  ball.angle = 360 - ball.angle;
              }
              updateBall();
            }
          }
          
        //电脑方块的碰撞检测
          //上下
            if(ball.x>reccomputer.x&&ball.x<(reccomputer.x+reccomputer.width)){
              if(ball.y+ball.radius>=reccomputer.y&&ball.y-ball.radius<=reccomputer.y+reccomputer.height){
              ball.angle = 360 - ball.angle;
              updateBall();
            }
          }
              //左右
          else if(ball.y>reccomputer.y&&ball.y<(reccomputer.y+reccomputer.height)){
              if(ball.x+ball.radius>=reccomputer.x&&ball.x-ball.radius<=reccomputer.x+reccomputer.width){
              ball.angle = 180 - ball.angle;
              updateBall();
            }
          }
          
          
          
          //左下
          else if(ball.x<reccomputer.x&&ball.y>reccomputer.y+reccomputer.height){
              var d1_=ball.radius*ball.radius;
            var d2_=(reccomputer.x-ball.x)*(reccomputer.x-ball.x);
            var d3_=(ball.y-reccomputer.y-reccomputer.height)*(ball.y-reccomputer.y-reccomputer.height);
              if(d1_>d2_+d3_){
                if(d2_>d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                  ball.angle = 360 - ball.angle;
              }
              updateBall();
            }
          }
          //右下
          else if(ball.x>reccomputer.x+reccomputer.width&&ball.y>reccomputer.y+reccomputer.height){
              var d1_=ball.radius*ball.radius;
            var d2_=(ball.x-reccomputer.x-reccomputer.width)*(ball.x-reccomputer.x-reccomputer.width);
            var d3_=(ball.y-reccomputer.y-reccomputer.height)*(ball.y-reccomputer.y-reccomputer.height);
              if(d1_>d2_+d3_){
                if(d2_>d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                  ball.angle = 360 - ball.angle;
              }
              updateBall();
            }
          }
          
          //障碍矩形的碰撞检测
          if(ball.x>rec.x&&ball.x<(rec.x+rec.width)){
              if(ball.y+ball.radius>=rec.y&&ball.y-ball.radius<=rec.y+rec.height){
                rec.flag=false;
              ball.angle = 360 - ball.angle;
              updateBall();
              placerect();
            }
          }
      
          else if(ball.y>rec.y&&ball.y<(rec.y+rec.height)){
              if(ball.x+ball.radius>=rec.x&&ball.x-ball.radius<=rec.x+rec.width){
                rec.flag=false;
              ball.angle = 180 - ball.angle;
              updateBall();
              placerect();
            }
          }
      
          else if(ball.x<rec.x&&ball.y<rec.y){
              var d1_=ball.radius*ball.radius;
            var d2_=(rec.x-ball.x)*(rec.x-ball.x);
            var d3_=(rec.y-ball.y)*(rec.y-ball.y);
              if(d1_>d2_+d3_){
                rec.flag=false;
                if(d2_>=d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                ball.angle = 360 - ball.angle;
              }
              updateBall();
              placerect();
            }
          }
          else if(ball.x>rec.x+rec.width&&ball.y<rec.y){
              var d1_=ball.radius*ball.radius;
            var d2_=(ball.x-rec.x-rec.width)*(ball.x-rec.x-rec.width);
            var d3_=(rec.y-ball.y)*(rec.y-ball.y);
              if(d1_>d2_+d3_){
                rec.flag=false;
                if(d2_>=d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                ball.angle = 360 - ball.angle;
              }
              updateBall();
              placerect();
            }
          }
          else if(ball.x<rec.x&&ball.y>rec.y+rec.height){
              var d1_=ball.radius*ball.radius;
            var d2_=(rec.x-ball.x)*(rec.x-ball.x);
            var d3_=(ball.y-rec.y-rec.height)*(ball.y-rec.y-rec.height);
              if(d1_>d2_+d3_){
                rec.flag=false;
                if(d2_>d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                ball.angle = 360 - ball.angle;
              }
              updateBall();
              placerect();
            }
          }
          else if(ball.x>rec.x+rec.width&&ball.y>rec.y+rec.height){
              var d1_=ball.radius*ball.radius;
            var d2_=(ball.x-rec.x-rec.width)*(ball.x-rec.x-rec.width);
            var d3_=(ball.y-rec.y-rec.height)*(ball.y-rec.y-rec.height);
              if(d1_>d2_+d3_){
                rec.flag=false;
                if(d2_>d3_){
                  ball.angle = 180 - ball.angle;
              }
              else{
                ball.angle = 360 - ball.angle;
              }
              updateBall();
              placerect();
            }
          }
        }
      }
        
  }
  render() {
      return (
        <canvas ref={this.canvas} width="1000" height="800">
        Your browser does not support the HTML 5 Canvas.
        </canvas>
      );
  }   
}

class Menu extends React.Component{
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.props.handleClick();
  }
  handleChange(event){
    this.props.handleChange(event);
  }

  render() {
    
    return(
      <div>
      <input type="button" value="Play game" onClick={this.handleClick}/>
      Difficulty:
      <select value={this.props.difficulty} onChange={this.handleChange}>
        <option value="10">easy</option>
        <option value="20">medium</option>
        <option value="30">hard</option>
      </select>
      </div>
    );
  }
}

class Interface extends React.Component {
  constructor(props){
    super(props);
    this.state = {game:false,difficulty:'10'};
    this.handleChange=this.handleChange.bind(this);
    this.handleClick=this.handleClick.bind(this);
  }

  handleChange(event){
    this.setState({difficulty:event.target.value});
  }
  handleClick(){
    this.setState({game:true});
  }

  render() {
    return (
      <div style={{position: 'absolute', top: '50px', left: '50px',border:'1px solid'}}>
        <CanvasComponent 
        difficulty={this.state.difficulty}
        game={this.state.game}
        />
        <Menu 
        difficulty={this.state.difficulty} 
        game={this.state.game}
        handleChange={this.handleChange} 
        handleClick={this.handleClick} 
        />
      </div>
    );
  }
}

ReactDOM.render(
  <Interface />,
  document.getElementById('root')
);