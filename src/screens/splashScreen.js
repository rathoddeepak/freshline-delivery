import React, {Component} from 'react';
import { View  } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import UserDB from 'libs/userdb';
export default class SplashScreen extends Component {
  UNSAFE_componentWillMount() {    
    UserDB.init(() => {
      let user = UserDB.getUser();
      if(user == undefined || user == null){
        this.reset('Startup');        
        return;
      }
      // global.user_id = user.user_id;
      // global.se = user.se;
      global.heroId = user.id;
      this.reset('HomeActivity');
    });    
  }
  reset = (page) => {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: page }            
        ],
      })
    );
  }
  render() {
    return (
      <View style={{backgroundColor:'#000',width:'100%',height:'100%'}} />
    )
  }
}