import {parse,format} from 'date-fns'


const timeConversion = (time,formats=12)=>{

      const currentTime = new Date();
      let parsedTime = currentTime;
      let timeFormat = "hh:mm:ss a"; 
      let toConvert = "HH:mm";
      if(formats===24){
        timeFormat = "HH:mm"; toConvert = "hh:mm:ss a";
      }
      if(time){
        parsedTime = parse(time ,timeFormat,currentTime);
      }
      console.log('toConvert',toConvert,formats);
      
      const formattedTime = format(parsedTime,toConvert);
      return formattedTime;
}


export default timeConversion;