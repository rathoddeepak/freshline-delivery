import React from 'react';
import {
	StyleSheet,	
	ScrollView,
	FlatList,
	Text,
    View
} from 'react-native';
import Dazar from '../dazar';
import request from 'libs/request';
import helper from 'assets/helper';
import FoodCard from  '../foodCard';
import lang from 'assets/lang';
export default class FoodList extends React.Component {
 constructor(props){
	  super(props)
	  this.state={	    
	    results:[],	    
	    fetched:true,
	    error:false,	    
	    mounted:true,	    
	    previousKey:'',
	    id:null,
		type:undefined,
		isFirst:true
	  }
 }; 
 componentDidMount(){
	this.setState({mounted:true});
 }
 componentWillUnmount(){
	this.setState({mounted:false}); 	
 }
 async searchKey(key, id = null, type = undefined){   
   if(this.state.isFirst && this.state.previousKey != '')this.setState({isFirst:false});
   if(key.length == 0){   	    
   	    this.setState({previousKey:'',fetched:true,id,type})   
   } else if(key != this.state.previousKey) {
   	   var offset = this.state.offset;
   	   this.setState({previousKey:key,results:[],fetched:false})
   	   let data = {user_id,se,key,user_lat,user_long,req:'srh_fd'};
   	   if(!this.props.approved)data['allFood'] = true;
   	   if (type != undefined){
   	   	data['type'] = type;
   	   	data['type_id'] = id;
   	   }
	   try {	   	  
	      let res =  await request.perform("vendor2", data,false);	      
	      if(res)this.setState({fetched:true});
	      if(res == 'fetch_error' || res == 'network_error'){    
		    this.setState({error:true})
		  }else{
		    if(res.status == 400){
		     this.setState({error:true})    
		    }if(res.status == 300){     
		      this.setState({error:true})
		    }else if(res.status == 200){		    	
		      if(this.state.mounted == true){
		          this.setState({           		            
		            results:res.data
		          });
		      }
		    }
		  }
	   }catch(err){
	      this.setState({error:true})
	   }	   
   }    
 }
 handleNavItem(item){
	this.props.navigation.navigate('FoodView', {
		item
	});
 }
 render(){
	const {fetched,results,error,isFirst} = this.state;
	return(
		 <View>		    
		   	<FlatList
				data={results}				
				renderItem={({ item , index }) => (  
					  <FoodCard 
						data={item}
						onPress={() => this.handleNavItem(item)}
						index={index}						
					  />
				)}
				keyExtractor={(item,index) => index.toString()}
		    />
		    <Dazar
		      loading={!fetched}
		      error={error}
		      isFirst={isFirst}
		      length={results.length}
		      custom={lang.z[cl].srfaphr}
		      lcont_size={70}
			  lanim_size={160}
		    />		    
		   </View>	  
		
		)
    }
}

const s = StyleSheet.create({
	note:{fontSize:13,fontWeight:'bold',padding:5,alignSelf:'flex-end',color:helper.primaryColor},
	bx:{justifyContent:'center',alignItems:'center',height:250,width:'100%'}
})