import React, {Component} from 'react';
import {
	Alert,
	View,
	Text,
	Image,
	StyleSheet,
	TextInput,
	Animated,
	ScrollView,
	Dimensions,
	RefreshControl
} from 'react-native';
import helper from 'assets/helper';
import Icon from 'components/icon';
import lang from 'assets/lang';
import { CommonActions } from '@react-navigation/native';
import {Text as AniText} from 'react-native-animatable';
import Parse from 'parse/react-native.js';
import {Bar as Progressbar} from 'react-native-progress'
import UserDB from 'libs/userdb';
import OneSignal from 'react-native-onesignal';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
const width = Dimensions.get('window').width;
export default class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			first_name:'',
			last_name:'',
			phone_no:'',
			clufter_id:'',
			fleet_id:'',
			busy:true
		}
	}
	componentDidMount() {	
		this.load();
	}
	load = async () => {
		try {
			this.setState({busy:true})
			const query = new Parse.Query(helper.tbls.AG);
			query.select(['first_name', 'last_name', 'phone']);
			let result = await query.get(heroId);			
			if(result != undefined && result != false){
				let attr = result.attributes;				
				let {first_name, last_name, phone} = attr;
				this.setState({
					first_name,
					last_name,
					phone_no:phone.toString(),
					fleet_id:result.id,
					busy:false
				})
			}else{
				this.error();
			}
		} catch (err) {
			alert(err)
			this.error();
		}
	}

	error  = () => {
		alert('There Was An Error');
		this.props.navigation.goBack();
	}

	logout = () => {
		UserDB.flush();
		OneSignal.sendTags({status: "logout", heroid: null});
		ReactNativeForegroundService.stop();

		setTimeout(() => {
			this.props.navigation.dispatch(
		      CommonActions.reset({
		        index: 0,
		        routes: [
		          { name: 'Startup' }            
		        ],
		      })
		    );
		}, 300)		
	}

	sure = () => {
		Alert.alert(
	      "Are you sure..",
	      "You Won't Be Able To Accept Orders",
	      [
	        {
	          text: "Yes",
	          onPress: () => this.logout()
	        },
	        {text: "Cancel"}	        
	      ]
	    )
	}
	render() {
		const {
			first_name,
			last_name,
			phone_no,
			fleet_id,
			clufter_id,
			busy
		} = this.state;
		return (
			<View style={{height:'100%',width:'100%',backgroundColor:helper.blk}}>
			 <View style={s.hdr}>
			  <View style={s.icn}>
			   <Icon name={'arw_back'} color={helper.primaryColor} size={25} />
			  </View>
			  <Text style={{fontSize:17,fontWeight:'bold',fontFamily:'sans-serif-thin',color:helper.primaryColor}}>MY PROFILE</Text>
			  <Text onPress={this.sure} style={{fontSize:14,color:helper.primaryColor,marginRight:10}}>Logout</Text>
			  {busy ?<View style={s.pbar}><Progressbar indeterminate width={width} color={helper.primaryColor} borderColor={helper.blk} borderRadius={0} height={3} /></View>: null}
			 </View>
			 <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={this.load} colors={[helper.primaryColor, "#000"]} />}><View style={{flex:1}}>			  
			  <View style={{height:250,width:'100%',justifyContent:'center',alignItems:'center'}}>
			   <Image borderRadius={100} style={{width:170,height:170,backgroundColor:helper.grey}} source={require('assets/icons/profile.png')}/>
			  </View>

			  <View style={{width:'100%',height:34,backgroundColor:helper.grey4,justifyContent:'center',marginBottom:10}}>
			   <Text style={{fontSize:16,fontWeight:'bold',fontFamily:'sans-serif-thin',color:'#adadad',marginLeft:10}}>ACCOUNT DETAILS</Text>			   
			  </View>
			  <Inputer value={first_name} placeholder={'First Name'} editable={false} />
			  <Inputer value={last_name} placeholder={'Last Name'} editable={false} />
			  <Inputer value={phone_no} placeholder={'Phone'} editable={false} />
			  <Inputer value={fleet_id} placeholder={'Fleet Id'} editable={false} />
			 </View></ScrollView>
			 <View style={s.hr} />
			</View>
		)
	}
}

class Inputer extends Component {
	constructor(props){
		super(props)
		this.state = {
			anim:new Animated.Value(0),
			anim2:new Animated.Value(0),
		}
	}
	focus = () => {
		Animated.timing(this.state.anim, {
			toValue:1,
			useNativeDriver:false,
			duration:500
		}).start();
	}
	blur = () => {
		Animated.timing(this.state.anim, {
			toValue:0,
			useNativeDriver:false,
			duration:500
		}).start();
	}	
	render () {
		const {
			placeholder,
			value,
			onChange,
			editable
		} = this.props;				
		return (
			<View style={{height:70,width:'90%',alignSelf:'center',marginTop:5}}>
			 <AniText animation={value.length > 0 ? "fadeIn" : "fadeOut"} style={s.data}>{placeholder}</AniText>			
			 <TextInput
			  placeholder={placeholder}
			  value={value}
			  onChangeText={onChange}
			  onFocus={this.focus}
			  editable={editable}
			  onBlur={this.blur}
			  style={{fontSize:16,fontFamily:'sans-serif',height:40,color:helper.white}}
			  placeholderTextColor={helper.grey}
			 />
			 <Animated.View style={{opacity:this.state.anim,height:2,backgroundColor:helper.startColor,width:'100%'}} />
			</View>
	    )
	}
}

const s = StyleSheet.create({
	pbar:{position:'absolute',bottom:0,width:'100%',height:3},
	hr:{width:'100%',position:'absolute',bottom:0,height:0.3,backgroundColor:helper.grey1},
	hdr:{height:60,flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center',backgroundColor:helper.blk,borderBottomWidth:0.5,borderColor:helper.grey1},
	icn:{height:60,width:40,justifyContent:'center',alignItems:'center'},
	data:{fontSize:13,marginLeft:4,fontFamily:'sans-serif',color:'#adadad'}
})