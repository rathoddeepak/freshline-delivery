import lang from 'assets/lang';
import helper from 'assets/helper';
import Parse from 'parse/react-native.js';
const ApiUrl = 'https://clufter.com/app_api.php?type=';
// const ApiUrl = 'http://192.168.145.46/FoodBazzar/app_api.php?type=';
const request = {
 isBlank(str) {return (!str || /^\s*$/.test(str))},
 countWords(str) {return str.split(' ').filter((n) => { return n != '' }).length},
 removeSpaces(str) {    
    str = str.replace(/\s+/g, " ");
    str = str.replace(/^[ ]+|[ ]+$/g,'');
    return str;
 },
 vegName(type, i){
    if(type == 1)return lang.z[i].vg;
    else if(type == 2)return lang.z[i].nnvg;
    else return lang.z[i].bth;
 },
 isValidName(userInput) {   
    var regex = /^[\p{L}\p{M}]+([\p{L}\p{Pd}\p{Zs}'.]*[\p{L}\p{M}])+$|^[\p{L}\p{M}]+$/u;
    return regex.test(userInput);  
 },
 api_url(){
    return ApiUrl;
 },
 site_url(){
    return 'https://clufter.com/';
 },
 fake_url(){
   return 'https://clufter.com/'; 
 },
 async taskAction (cloudAction, params) {
   return Parse.Cloud.run(cloudAction, params).then(response => {
      if(helper.no_such_task == response){
         alert('No Such Task Found');
      }else if(helper.task_already_accepted == response){
         alert('Task Already Accepted');
      }else if(helper.hero_not_found == response){
         alert('Hero Id Invalid');
      }else if(helper.task_accepted_successfully == response){
         return true;
      }else if(helper.task_not_accepted == response){
         alert("Task Not Accepted");
      }else if(helper.task_invalid_status == response){
         alert("Invalid Task Status");
      }else if(helper.pickup_pending == response){
         alert("Pickup Pending");
      }
      return false;
   }).catch(err => {
      alert('Error While Processing Try Again!');
      return false;
   });
 },
 async perform(code, details){  
    var formBody = [];
    for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(ApiUrl+code, {
    method: 'POST',
    timeout: 4000,    
    headers: {
    'Accept': 'application/json',    
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody})
    .then((response) => response.json())
    .then((res) => { 
      //console.log(res)
      return res;
    })
    .catch((error)=>{      
      return 'fetch_error';
    });
  }
}

export default request;