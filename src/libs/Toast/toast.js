import {NativeModules} from 'react-native';
const {CogoToast} = NativeModules;
export default {
  success(data){
    return CogoToast.success(data);
  },
  warn(data){
    return CogoToast.warn(data);
  },
  error(data){
    return CogoToast.error(data);
  },
  show(data){
    return CogoToast.defaultT(data);
  },
  confused(data){
    return CogoToast.confused(data);
  }
}