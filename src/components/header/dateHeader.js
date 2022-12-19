import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} from 'react-native';
import Icon from '../icon';
import helper from 'assets/helper';
export default class DateHeader extends Component {
	render(){
		return (
			<View style={s.header}>
			 <TouchableOpacity onPress={this.props.onLeft} style={s.icnH}>
			  <Icon name="menu" color={helper.white} size={29} />
			 </TouchableOpacity>
			 <View style={s.txtH}>
			  <Text style={{fontSize:30,color:helper.white,fontFamily:'scriptmt'}}>Clufter </Text>
			 </View>
			 <TouchableOpacity onPress={this.props.onRight} style={s.icnH}>
			  <Icon name="filter" color={helper.white} size={29} />
			 </TouchableOpacity>
			</View>
		)
	}
}

const s = StyleSheet.create({
	icnH:{width:50,height:50,justifyContent:'center',alignItems:'center'},
	txtH:{width:150,justifyContent:'center',alignItems:'center',height:50,flexDirection:'row'},
	header:{width:"100%",height:60,flexDirection:'row',justifyContent:'space-between'}
})