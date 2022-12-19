import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
const helper = {
	tbls:{
		AG:'Agents'
	},
	COD:0,
	ONLINE_PAY:1,
	//Colors
	white:'#ffffff',
	grey:"#898989",
	grey1:'#707070',
	grey2:"#474747",
	brown:'#2e2727',
	greyw:'#7c7c7c',
	silver:'#C7C7C7',
	grey4:"#353535",
	grey5:'#3F3F3F',
	grey6:'#242424',
	blight:"#8f8f8f",
	blk:'#000',
	green:'#8bc34a',
	grn1:'#0ebd34',
	blackTrans:'#00000099',
	primaryColor:'#D0AA45',	
	numList:['Add', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],

	ORDER_CREATED:0,
	ORDER_PLACED:1,
	ORDER_ACCEPTED:2,
	ORDER_READY:3,
	PICKUP_START:4,
	PICKUP_READY_START:5,
	REACHED_PICKUP:6,
	ORDER_PICKED:7,
	ORDER_DELIVERED:8,
	ORDER_CANCEL:9,

	NONE:0,
	PLATE:1,
	GLASS:2,
	BOWL:3,

	FOOD_NOT_PREPARED:0,
	FOOD_ACCEPT:1,
	FOOD_PREPARED:2,
	DELIVERY_FN_PREPARED:3,
	DELIVERY_F_PREPARED:4,
	HAS_PICKED_F:5,
	HAS_PICKED_C:6,
	HAS_CENTERED:7,
	HAS_DELIVERED:8,
	VDRFDCANCEL:9,


	security:'&42jc4$',
	onesignal:'1427e7ac-aa4a-4c0f-8d67-2a95c677c3b4',
	wrp:{flexWrap:'wrap'},
	site_url:'https://clufter.com/',
	//Style
	model:{justifyContent:'center',alignItems:'center',height:'100%',width:'100%',backgroundColor:'#00000099'},
	model2:{height:'100%',width:'100%',backgroundColor:'#00000099'},
	hldr:{flex:1,backgroundColor:"#000"},
	main:{height:'97%',width:'100%'},
	main2:{height:'100%',backgroundColor:'#000',width:'100%'},
	cont:{height:'100%',width:'100%',backgroundColor:'#000'},
	max:{height:'100%',width:'100%'},
	site_url:'https://clufter.com/',
	// parse_server_url:'http://153.92.214.195:1337/parse',
	// parse_app_id:'myAppId',
	// parse_js_key:'jsreact',
	// parse_master_key:'myMasterKey',

	parse_server_url:'http://192.168.67.152:1337/parse',
	parse_app_id:'myAppId',
	parse_js_key:'jsreact',
	parse_master_key:'myMasterKey',

	//Shimmer 	
	skTT:{width:'60%',height:20, marginTop:15,marginBottom:10,marginLeft:14,borderRadius:7},
	//Dimensions
	height,
	width,

	HERO_ONLINE:1,
	HERO_BUSY:2,
	HERO_OFFLINE:0,

	FLEETX_UNASSIGNED:0,
	FLEETX_ASSIGNED:1,
	FLEETX_START:2,
	FLEETX_COMPLETE:3,
	FLEETX_CANCEL:4,
	FLEETX_AUTO:5,

	PICKUP:0,
	DELIVERY:1,

	startColor:'#2196f3',
	acceptColor:'#ba68c8',
	unasgColor:'#ff6d00',

	TASKS:"Tasks",
	HERO:"Heroes",
	again:"There Was An Error Please Try Again",

	no_such_task:0,
	task_already_accepted:1,
	hero_not_found:2,
	task_accepted_successfully:3,
	task_not_accepted:4,
	task_invalid_status:5,
	pickup_pending:6,

	getStatusData: (status) => {
		switch(status){
			case 0:
			return {text:'Unassigned',color:'#ff6d00'};
			case 1:
			return {text:'Accepted',color:'#ba68c8'};
			case 2:
			return {text:'Started',color:'#2196f3'};
			case 3:
			return {text:'Complete',color:'#0ebd34'};
			case 4:
			return {text:'Failed',color:'red'};
			case 5:
			return {text:'Assigned',color:'#dce775'};
			default:
			return {text:'',color:''};
		}
	},
	getActionData: (status) => {
		switch(status){
			case 0:
				return 'Accept';
			case 1:
				return 'Start';
			case 2:
				return 'Finish';
			case 3:
			case 4:
				return '';
				return '';
			default:
				return '';
		}
	},

	CASH:0,
	RAZORPAY:1,
	PHONEPE:2,
	GPAY:3,
	PAYTM:4,
	accessToken:'pk.eyJ1IjoiZGVlcGFrNDU2IiwiYSI6ImNqcmFudjExeDAyeGs0Nm1yYWMyendmdnoifQ.DOdaXwOfEgNEs2T6lzKQwg'
}

export default helper;