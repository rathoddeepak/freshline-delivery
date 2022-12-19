import React, {Component} from 'react';
import {
	View,
	Text
} from 'react-native';
import helper from 'assets/helper';

export default class OrderEmpty extends Component {
	constructor(props){
		super(props)
		this.state = {
			dot:''
		}
		this.interval = null;
	}
	componentDidMount(){
		this.mount();
	}
	componentWillUnmount(){
		this.unmount();
	}
	mount = () => {
		let {dot} = this.state;
		this.interval = setInterval(() => {
			if(dot.length < 4){
				dot += '.';				
			}else{
				dot = '';				
			}
			this.setState({dot})
		}, 1000);
	}
	unmount = () => {
		if(this.interval != null)
			clearInterval(this.interval);
	}
	render(){
		const {
			dot
		} = this.state;
		return (
			<View style={s.main}><View style={s.body}>
			 <Text style={s.text}>{dot}Drive Safe | Searching Orders{dot}</Text>
			 <View style={s.hr} />
			 <Text style={s.live}>LIVE ORDER</Text>
			</View></View>
		)
	}
}

const s = {
	main:{
		width:'100%',
		height:'100%',
		justifyContent:'center',
		alignItems:'center'
	},
	body:{
		backgroundColor:helper.blk,
		height:100,
		width:'100%',
		justifyContent:'center',
		alignItems:'center'
	},
	hr:{
		width:'70%',
		height:0.5,
		backgroundColor:helper.grey1,
		marginVertical:2
	},
	text:{
		fontWeight:'bold',
		color:helper.primaryColor,
		fontSize:17		
	},
	live:{
		fontFamily:'sans-serif-light',
		color:helper.primaryColor,
		fontSize:17	
	}
}