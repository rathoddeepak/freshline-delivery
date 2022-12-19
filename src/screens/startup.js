import React, {Component} from 'react';
import {
	View,
	Text,
	Image,
	TextInput,
	StyleSheet,
	Animated,
	Keyboard,
	TouchableOpacity,
	KeyboardAvoidingView,
	ToastAndroid	
} from 'react-native';
import request from 'libs/request';
import UserDB from 'libs/userdb';
import helper from 'assets/helper';
import {
	LoadingModal
} from 'components';
import ViewPager from '@react-native-community/viewpager';
import LottieView from 'lottie-react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import LinearGradient from 'react-native-linear-gradient';
import RNOtpVerify from 'libs/otpVerify/';
import Parse from 'parse/react-native';
import md5 from 'libs/md5';
import lang from 'assets/lang';
import { CommonActions } from '@react-navigation/native';
import OneSignal from 'react-native-onesignal';
const cover = require('assets/images/cover.jpg');
const colors = ['#000000', '#00000021','#000000b4', '#00000021','#000000'];
export default class Startup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			busy:false,
			opacity:new Animated.Value(1)
		}
	}
	componentDidMount(){
		OneSignal.sendTags({status: "logout", heroid: null, vendorid: null});
		this.keyboardDidShowListener = Keyboard.addListener(
	      'keyboardDidShow',
	      this._keyboardDidShow,
	    );
	    this.keyboardDidHideListener = Keyboard.addListener(
	      'keyboardDidHide',
	      this._keyboardDidHide,
	    );
	}
	_keyboardDidShow = () => {
	    Animated.timing(this.state.opacity, {
	    	toValue:0,
	    	useNativeDriver:false
	    }).start()
	}
	_keyboardDidHide = () => {
	    Animated.timing(this.state.opacity, {
	    	toValue:1,
	    	useNativeDriver:false
	    }).start()
	}
	landHome = () => {
		this.props.navigation.dispatch(
	      CommonActions.reset({
	        index: 0,
	        routes: [
	          { name: 'HomeActivity' }            
	        ],
	      })
	    );
	}
	render() {
		const {
			busy,
			opacity
		} = this.state;		
		return (
			<KeyboardAvoidingView style={helper.main2} enabled={false}>
				<View style={s.header}>
					<LinearGradient style={s.hin}
						colors={colors}>
						<Text style={s.ht}>Famdel | <Text style={{fontFamily:'sans-serif'}}>Hero</Text></Text>
					</LinearGradient>
				</View>
				<Inputer toHome={this.landHome} onBusy={busy => this.setState({busy})} />						
			    <LoadingModal visible={busy} />			    
			</KeyboardAvoidingView>
		)
	}
}

class Inputer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phone_no:'',
			otp:'',
			wrt_otp:'',
			first_name:'',
			last_name:'',
			otpMode:false		
		}
	}

	componentDidMount(){		
		UserDB.init();
		this.showPhoneNumber();	
	}

	showPhoneNumber = async () => {
	  try {
	    const phone_no = await SmsRetriever.requestPhoneNumber();
	    this.setState({phone_no}, () => {
	    	this.sendOtp()
	    })
	  } catch (error) {
	    console.log(JSON.stringify(error));
	  }
	}

	sendOtp = async () => {
		let phone_no = this.state.phone_no;
		phone_no = request.removeSpaces(phone_no);
		if (phone_no.length < 10){
			ToastAndroid.show(lang.z[cl].psc, ToastAndroid.SHORT);
			return;
		}else if(isNaN(phone_no)){
			ToastAndroid.show(lang.z[cl].inp, ToastAndroid.SHORT);
			return;
		}
		this.pager.setPage(1);
	}

	verifyOtp = async () => {
		try {
			const agentQuery = new Parse.Query(helper.tbls.AG);
			agentQuery.equalTo("phone", parseInt(this.state.phone_no));
			agentQuery.equalTo("hpin", parseInt(this.state.wrt_otp));
			const agents = await agentQuery.find();
			if(agents == undefined || agents == false)this.notFound();
			this.props.onBusy(false);
			if(agents.length > 0){
				let agent = agents[0];
				const {id, attributes:{first_name, last_name}} = agent;
				UserDB.setUser({id, first_name, last_name}, () => {				
					this.props.toHome();
				});
			}else{
				ToastAndroid.show("Hero Not Found", ToastAndroid.SHORT)
				this.setState({otpMode:false});
				this.pager.setPage(0);
			}
		}catch(err){
			alert(err);
			this.props.onBusy(false);
		}
	}

	notFound = () => {
		this.setState({otpMode:false});
		this.pager.setPage(0);
		ToastAndroid.show("An Error Occurred", ToastAndroid.SHORT);
	}
	
	verifyAttempt = (wrt_otp) => {
		this.setState({wrt_otp})
	}

	onChangeRq = () => {
		this.setState({otpMode:false}, () => {
			this.pager.setPage(0)
		})
	}
	render() {
		const {
			otp,			
			phone_no,
			last_name,		
			first_name
		} = this.state;
		return (
			<ViewPager ref={ref => this.pager = ref} style={{width:'100%',height:"100%"}} scrollEnabled={false}>
			 <View style={helper.max}>
				 <Text style={s.tt}>Phone Number</Text>
				 <Text style={s.dd}>Enter Your Registered Phone Number</Text>
				 <TextInput keyboardType='numeric' style={s.inpt} placeholder="Phone No" placeholderTextColor={helper.grey4} value={phone_no} onChangeText={phone_no => this.setState({phone_no})}/>
				 <TouchableOpacity activeOpacity={0.8} style={s.ee} onPress={this.sendOtp}>
					 <Text style={{fontSize:14,color:helper.silver}}>Submit</Text>
				 </TouchableOpacity>
			 </View>

			 <View style={helper.max}>
				 <Text style={s.tt}>Enter HPIN</Text>
				 <Text style={s.dd}>Please Enter Your HPIN</Text>
				 <OTPInputView
				    style={s.otpv}
				    pinCount={4}
				    codeInputFieldStyle={s.bs}
				    codeInputHighlightStyle={s.z}
				    onCodeFilled = {(code) => this.verifyAttempt(code)}
				    ref={ref => (this.otpRef = ref)}
				/>				
				<TouchableOpacity onPress={this.verifyOtp} activeOpacity={0.8} style={s.ee}>
					 <Text style={{fontSize:14,color:helper.silver}}>Verify</Text>
			    </TouchableOpacity>
			 </View>

			 <View style={helper.max}>
				 <Text style={s.tt}>Phone Number</Text>
				 <Text style={s.dd}>We Will Send OTP To Verify You</Text>
				 <TextInput style={s.inpt} placeholder="First Name" placeholderTextColor={helper.grey4} value={first_name} onChangeText={first_name => this.setState({first_name})}/>
				 <TextInput style={s.inpt} placeholder="Last Name" placeholderTextColor={helper.grey4} value={last_name} onChangeText={last_name => this.setState({last_name})}/>
				 <TouchableOpacity onPress={this.saveDetails} activeOpacity={0.8} style={s.ee}>
					 <Text style={{fontSize:14,color:helper.silver}}>Save</Text>
				 </TouchableOpacity>
			 </View>
			</ViewPager>
		)
	}
}

class OtpTimer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			counter:'60',
			ended:false
		}
		this.timer = null;
	}
	start = () => {
		this.setState({counter:60,ended:false});
		this.timer = setInterval(() => {
			this.setState({counter:this.state.counter - 1}, () => {
				if(this.state.counter == 0)this.end();
			})			
		}, 1000);
	}
	stop = () => {
		clearInterval(this.timer);
		this.setState({counter:60})
	}
	end = () => {
		this.setState({ended:true,counter:60});
		clearInterval(this.timer);		
	}
	resend = () => {
		this.props.onResend();
		this.stop();
		setTimeout(this.start, 100);
	}
	change = () => {
		this.stop();
		this.props.onChange();
	}
	render() {
		const {
			ended,
			counter
		} = this.state;
		return (
			<View style={{width:'100%'}}>
			 {ended	?		   
			    <Text style={[s.dtf, {alignSelf:'center'}]} onPress={this.resend}>Resend OTP</Text>
			 :
				<View style={{alignSelf:'center',flexDirection:'row'}}>
				<Text style={s.dtf}>00:{counter} •</Text>
				<Text style={s.dtf} onPress={this.change}> Change Number</Text>
				</View>
			 }
			</View>
		)
	}
}
const s = StyleSheet.create({
	header:{height:200,width:'100%',marginBottom:30,marginTop:20},
	dtf:{fontSize:13,color:helper.silver,fontWeight:'bold',marginBottom:10},
	hin:{height:200,width:'100%',position:'absolute',justifyContent:'center',alignItems:'center'},
	ht:{fontSize:40,color:helper.primaryColor,fontWeight:'bold'},
	tt:{fontSize:22,fontWeight:'bold',color:helper.silver,textAlign:'center',marginBottom:10},
	dd:{fontSize:16,color:helper.silver,textAlign:'center',marginBottom:10},
	ee:{height:28,width:90,borderWidth:1,borderColor:helper.silver,borderRadius:5,justifyContent:'center',alignItems:'center',alignSelf:'center'},
	inpt:{fontSize:22,fontWeight:'bold',color:helper.silver,textAlign:'center',marginBottom:20,padding:0},
	btn:{width:'100%',bottom:-57,position:'absolute',zIndex:-1},
	otpv:{width:200,alignSelf:'center',height:40,marginBottom:20},
	bs:{width: 30,height: 45,borderWidth: 0,borderBottomWidth: 1},
	z:{borderColor: helper.primaryColor}
})
