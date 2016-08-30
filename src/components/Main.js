require('normalize.css/normalize.css');
require('styles/App.css');//目前不知道怎么弄呢，改成SCSS就报错了，先按照原始css写吧，完成项目后，再尝试修改成SCSS

import React from 'react';
import ReactDOM from 'react-dom';
let imageDatas = require('json!../data/imageDatas.json');
//let yeomanImage = require('../images/yeoman.png');
//add imageURL property to imageDatas.

// imageDatas = ( (imageDatasArr)=>{
//   for(var i=0,j=imageDatasArr.length;i<j;i++){
//     let singleImageData = imageDatasArr[i];
//     singleImageData.imageURL = require('../images/'+singleImageData.fileName);
//     imageDatasArr[i] = singleImageData;
//   }
//   return imageDatasArr;
// } )(imageDatas);

//get a random number between low and high
var getRangeRandom = (low,high) => Math.floor(Math.random()*(high-low)+low);
//get a positive or negative degree between -30 to 30
var get30DegRandom = () => {
  let symbol = '';
  symbol = (Math.random()>0.5) ? '+' : '-';
  return symbol + Math.ceil(Math.random()*30);
};

class ImgFigure extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);//why???????????????
  }

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse(); //试一下，不加（）可以吗？？？？？？？？？？？？？、
    }else{
      this.props.center();  //试一下，不加（）可以吗？？？？？？？？？？？？？、
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    var styleObj={};
    if(this.props.arrange.pos){
    //  styleObj.pos =
    styleObj = this.props.arrange.pos;
    }
    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach((value) =>{
        styleObj[value] = 'rotate('+this.props.arrange.rotate+'deg)';
      });
    }

   if(this.props.arrange.isCenter){
     styleObj.zIndex = 11;
   }

    let imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse?' is-inverse ':'';
    //我想先把这句注释掉，看看后续会怎样~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={'../images/'+this.props.data.fileName} alt={this.props.data.title}/>
        <figcaption>
          <h2 className='img-title'>{this.props.data.title}</h2>
          <div className='img-back' onClick={this.handleClick}>
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);//why......................
  }

  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse(); // if error ,then you  should add () after inverse
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render(){
    let controllerUnitClassName = 'controller-unit';
    if(this.props.arrange.isCenter){
      controllerUnitClassName += ' is-center ';
      if(this.props.arrange.isInverse){
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class GalleryStage extends React.Component {
  constructor(props){
    super(props);
    this.Constant={
        centerPos:{
          left:0,
          top:0
        },
        hPosRange:{
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        vPosRange:{
          x:[0,0],
          topY:[0,0]
        }
    };
    this.state={
      imgsArrangeArr:[]
    };
  }
//this is a closure function
  inverse(index){
    return ()=>{
      var imgsArrangeArr = this.state.imgsArrangeArr;
      //imgsArrangeArr[index].state.isInverse = ! imgsArrangeArr[index].state.isInverse;
      imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });
    }
  }

 rearrange(centerIndex){
   let imgsArrangeArr = this.state.imgsArrangeArr,
   Constant = this.Constant,
   centerPos = Constant.centerPos,
   hPosRange = Constant.hPosRange,
   vPosRange = Constant.vPosRange,
   hPosRangeLeftSecX = hPosRange.leftSecX,
   hPosRangeRightSecX = hPosRange.rightSecX,
   hPosRangeY = hPosRange.y,
   vPosRangeX = vPosRange.x,
   vPosRangeTopY = vPosRange.topY;

   let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
   imgsArrangeCenterArr[0]={
     pos:centerPos,
     rotate:0,
     isCenter:true
   }

   let imgsArrangeTopArr = [],
   topImgNum = Math.floor(Math.random()*2),
   topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length-topImgNum));

   imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
   imgsArrangeTopArr.forEach( (value,index)=>{
     imgsArrangeTopArr[index] = {
       pos:{
         top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
         left: getRangeRandom(vPosRangeX[0],vPosRangeX[1])
       },
       rotate: get30DegRandom() //感觉初始化render那里已经把center什么的设置成false了，这里就不用再初始化为false了吧？？试验一下~~~~~~~~~~
     }; //这里不加分号是不是也可以呢??????
   });

   for(let i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
     let hPosRangeLORX = null;
     if(i<k){
       hPosRangeLORX = hPosRangeLeftSecX;
     }else{
       hPosRangeLORX = hPosRangeRightSecX;
     }
     imgsArrangeArr[i] = {
       pos:{
         top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
         left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
       },
       rotate: get30DegRandom()
     };  //后面必须加分号吗？？？？？？
   }

   if(imgsArrangeArr && imgsArrangeTopArr[0]){//这样写可以吗？？？？？
     imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr);
   }
   imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr);
   this.setState({
     imgsArrangeArr:imgsArrangeArr //事实证明不可以加分号哦，会报错
   });

 }

  center(index){
    return ()=>{
      this.rearrange(index);// this.rearrange(index); 不加this可不可以？？？？
    }
  }

  componentDidMount(){
    let stageDOM = this.refs.stage,//好像新版的是酱紫写的吧？？？？？？
    stageW = stageDOM.scrollWidth,
    stageH = stageDOM.scrollHeight,
    halfStageW = Math.ceil(stageW/2),
    halfStageH = Math.ceil(stageH/2);

    let imgFigureDOM = this.refs.imgFigure0,
    imgW = imgFigureDOM.scrollWidth,
    imgH = imgFigureDOM.scrollHeight,
    halfImgW = Math.ceil(imgW/2),
    halfImgH = Math.ceil(imgH/2);

    this.Constant.centerPos = {
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
      }
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    //这样写可不可以呢？？？？试验一下啦~~~~~~~~~~~~~~~~~~~~~~~~~~
    // this.Constant.centerPos.left = halfStageW - halfImgW;
    // this.Constant.centerPos.top = halfStageH - halfImgH;
    // this.Constant.hPosRange.leftSecX = [-halfImgW,halfStageW-halfImgW*3];
    // this.Constant.hPosRange.rightSecX = [halfStageW+halfImgW,stageW-halfImgW];
    // this.Constant.hPosRange.y = [-halfImgH,stageH-halfImgH];
    // this.Constant.vPosRange.topY = [-halfImgH,halfStageH-halfImgH*3];
    // this.Constant.x = [halfStageW-imgW,halfStageW];

    let randomNum = Math.floor(Math.random()*10);
    this.rearrange(randomNum);
  }

  render() {
    var imgFigures=[],
        controllerUnits=[];
    imageDatas.forEach((value,index)=>{
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isCenter:false,
          isInverse:false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}></ImgFigure>);
      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} center={this.center(index)} inverse={this.inverse(index)}></ControllerUnit>);
    });
    return (
      <section className="stage" ref="stage">
         <section className="img-sec">
          {imgFigures}
         </section>
         <nav className="controller-nav">
          {controllerUnits}
         </nav>
      </section>
    );
  }
}

GalleryStage.defaultProps = {};

export default GalleryStage;  //AppComponent 改为 GalleryStage
