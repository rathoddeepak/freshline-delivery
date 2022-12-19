import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	Text
} from 'react-native';
import Err from './err';
import Empty from './empty';
import Loading from './loading';
import helper from 'assets/helper';
import lang from 'assets/lang';
export default class Dazar extends Component {
	render() {		
		const {loading, error, length, lcont_size, lanim_size, emptyOther, emptyCustom, onRetry, isFirst, custom} = this.props;
		if(!loading && error){
			return (
				<Err onPress={onRetry} />
			);
		}else if(loading && !error){
			return (
			  <Loading
			    container={lcont_size}
				animation={lanim_size}
			  />
			)
		}else if(!loading && !error && length === 0){
			if(emptyOther != undefined){
				if(emptyCustom == undefined){
					return (
						<View style={{height:200,width:'100%',justifyContent:'center',alignItems:'center'}}>
							<Text style={{fontWeight:'bold',fontSize:14,color:helper.silver}}>{lang.z[cl].emdc}</Text>
						</View>
					)
				}else{
					return emptyCustom();
				}
			}else{
				if(isFirst == true){
					return (
						<View style={{height:200,width:'100%',justifyContent:'center',alignItems:'center'}}>
						    <Text style={{fontWeight:'bold',fontSize:14,color:helper.silver}}>{custom}</Text>
					    </View>
				    )
				}else{
					return (
						<Empty
						/>
					);
				}				
			}
		}else{
			return (<View></View>)
		}	
	}
}