var start_stop_btn, wpid=false, map, z, op, prev_lat, prev_long, min_speed=0, max_speed=0, min_altitude=0, max_altitude=0, distance_travelled=0, min_accuracy=150, date_pos_updated="", info_string="", localatlong;

function format_time_component(time_component)
{
	if(time_component<10)
		time_component="0"+time_component;
	else if(time_component.length<2)
		time_component=time_component+"0";
		
	return time_component;
}

function geo_success(position)
{
	start_stop_btn.innerHTML="Stop"; 
	
	info_string="";
	var d=new Date(); 
	var h=d.getHours();
	var m=d.getMinutes();
	var s=d.getSeconds();
		
	var current_datetime=format_time_component(h)+":"+format_time_component(m)+":"+format_time_component(s);
		
	if(position.coords.accuracy<=min_accuracy)
	{

		if(prev_lat!=position.coords.latitude || prev_long!=position.coords.longitude)
		{
			if(position.coords.speed>max_speed)
				max_speed=position.coords.speed;
			else if(position.coords.speed<min_speed)
				min_speed=position.coords.speed;
				
			if(position.coords.altitude>max_altitude)
				max_altitude=position.coords.altitude;
			else if(position.coords.altitude<min_altitude)
				min_altitude=position.coords.altitude;
			
			
			prev_long = position.coords.longitude;
			prev_lat = position.coords.latitude;
			
			info_string="Localizacion Actual: lat="+position.coords.latitude+", long="+position.coords.longitude +"<br />Ultimo dato: "+current_datetime;
			
			
			
			
			
			
		}
	}
	else
		info_string="No suficiente("+Math.round(position.coords.accuracy, 1)+"m vs "+min_accuracy+"m) - Ultimo Dato: "+current_datetime;

	if(info_string)
		op.innerHTML=info_string;
}


function geo_error(error)
{
	switch(error.code)
	{
		case error.TIMEOUT:
			op.innerHTML="Timeout!";
		break;
	};
}


function get_pos()
{
	
	if(!!navigator.geolocation)
		wpid=navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
	else
		op.innerHTML="Error: Tu navegador no soporta la Webapi de Geolocalizacion";
}



function init_geo()
{
	op=document.getElementById("output");	if(op)
	{
		start_stop_btn=document.getElementById("geo_start_stop");
		
		if(start_stop_btn)
		{
			start_stop_btn.onclick=function()
			{
				if(wpid) 
				{
					start_stop_btn.innerHTML="Comenzar";
					navigator.geolocation.clearWatch(wpid);
					wpid=false;
				}
				else 
				{
					start_stop_btn.innerHTML="Adquiriendo localizacion";
					get_pos();
				}
			}
			
			
		}
		else
			op.innerHTML="Error: No se puede encontrar boton de inicio o detencion";
	}	
}




window.onload=init_geo;