function updateform(){
	var uname = $("#uname").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/name-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/name-update.php',
		data : "uname="+uname+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			Materialize.toast('Saved!', 3000, 'rounded')
			$("#u-name").text(uname);
			$("#uname").val("");
		}
	});
}

$(document).ready(function (e) {
	var imgup = $("#u_image").val();
	console.log(imgup);
	$("#upload-img").on('change',(function(e) {
		e.preventDefault();
		$.ajax({
        	//url: "server/upload.php",
        	url: "http://www.grand-pillar.com/uploads/fire/upload.php",
			type: "POST",
			data:  new FormData(this),
			contentType: false,
    	    cache: false,
			processData:false,
			beforeSend : function()
			{
				//$("#preview").fadeOut();
				$("#err").fadeOut();
			},
			success: function(data)
		    {
				if(data=='invalid')
				{
					// invalid file format.
					$("#err").html("Invalid File !").fadeIn();
				}
				else
				{
					// view uploaded file.
					$("#preview").html(data).fadeIn();
					$("#upload-img")[0].reset();	
				}
		    },
		  	error: function(e) 
	    	{
				$("#err").html(e).fadeIn();
	    	} 	        
	   });
	}));
});


function addfamform(){
	var addFname = $("#fmName").val();
	var addFemail = $("#fmEmail").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/add-family.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/add-family.php',
		data : "fmname="+addFname+"&fmemail="+addFemail+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			Materialize.toast('Saved!', 3000, 'rounded')

    		$("#parentDiv").append("<li id='removethis'><div class='collapsible-header'>"+addFname
                +"<span class='badge grey-text text-lighten-1'>"+addFemail+"</span></div></li>");
			$("#fmName").val("");
			$("#fmEmail").val("");
		}
	});
}

function addconform(){
	var ccname =  $("#c-cname").val();
    var ccnum = $("#c-cnum").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/add-contact.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/add-contact.php',
		data : "ccname="+ccname+"&ccnum="+ccnum+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			Materialize.toast('Saved!', 3000, 'rounded')

    		$("#contactAppend").append("<li><div class='collapsible-header'><a href='tel:"+ccnum+"'>"+ccname+" "+ccnum+"</a></div></li>");
			$("#c-cname").val("");
			$("#c-cnum").val("");
		}
	});
}

function homenameupdateform(){
	var newHname = $("#h-nname").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/homename-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/homename-update.php',
		data : "nhname="+newHname+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			Materialize.toast('Home name changed!', 3000, 'rounded')
			$("#h-name").text(newHname);
			
		}
	});
}

function setuphomename(){
	var newHname = $("#shname").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/homename-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/homename-update.php',
		data : "nhname="+newHname+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			$("#h-name").text(newHname);
		}
	});
}
function setuphomedevice(){
	var shdname = $("#shdname").val();
	var shdkey = $("#shdkey").val();

	$.ajax({		
		type : 'POST',
		//url  : 'server/device-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/device-update.php',
		data : "shdname="+shdname+"&shdkey="+shdkey+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			getDeviceStatus();
    		getChartData();
    		tabledata();
		}
	});
}

function homeaddupdateform(){
	var newAdd = $("#address").val();
	var newPrv = $("#province").val();
	var newCty = $("#city").val();
	var newZip = $("#zipcode").val();
	console.log(newAdd+newPrv+newCty+newZip);
	$.ajax({		
		type : 'POST',
		//url  : 'server/address-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/address-update.php',
		data : "nadd="+newAdd+"&nprv="+newPrv+"&ncty="+newCty+"&nzip="+newZip+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			Materialize.toast('Home Address Saved', 3000, 'rounded')
			$("#h-address").text(newZip+" "+newCty);
		}
	});
}

function setupadd(){
	var newAdd = $("#shadd").val();
	var newPrv = $("#shprov").val();
	var newCty = $("#shcity").val();
	var newZip = $("#shzip").val();
	console.log(newAdd+newPrv+newCty+newZip);
	$.ajax({		
		type : 'POST',
		//url  : 'server/address-update.php',
		url  : 'http://www.grand-pillar.com/uploads/fire/address-update.php',
		data : "nadd="+newAdd+"&nprv="+newPrv+"&ncty="+newCty+"&nzip="+newZip+"&udi="+idd,
		success :  function(response){						
			console.log(response);
			$("#h-address").text(newZip+" "+newCty);
		}
	});
}

function emailupdateform(){
	var newEmail = $("#newEmail").val();
	var vpass = $("#upass").val();
	if (vpass == valpass) {
		$.ajax({		
			type : 'POST',
			//url  : 'server/email-update.php',
			url  : 'http://www.grand-pillar.com/uploads/fire/email-update.php',
			data : "nemail="+newEmail+"&udi="+idd,
			success :  function(response){						
				console.log(response);
				Materialize.toast('Saved!', 3000, 'rounded')
				$("#u-email").text(newEmail);
				$("#newEmail").val("");
				$("#upass").val("");
			}
		});
	}
	else{
		$("#errEmail").text("Password is incorrect.");
		$("#errEmail").fadeIn();
		$("#errEmail").fadeOut(5000)
	}
	
}

function passwordupdateform(){
	var newPass = $("#c-pass").val();
	var nvpass = $("#n-pass").val();
	var vpass = $("#o-pass").val();
	if (vpass == valpass && newPass == nvpass) {
		$.ajax({		
			type : 'POST',
			//url  : 'server/pass-update.php',
			url  : 'http://www.grand-pillar.com/uploads/fire/pass-update.php',
			data : "npass="+newPass+"&udi="+idd,
			success :  function(response){						
				console.log(response);
				Materialize.toast('Password Changed!', 3000, 'rounded')
				$("#c-pass").val("");
				$("#o-pass").val("");
				$("#n-pass").val("");
			}
		});
	}
	if(newPass != nvpass){
		$("#errPass").text("Password not match.");
		$("#errPass").fadeIn();
		$("#errPass").fadeOut(5000);
	}
	if(vpass != valpass){
		$("#errPass").text("Password is incorrect");
		$("#errPass").fadeIn();
		$("#errPass").fadeOut(5000);
	}
	
}

$(document).ready(function()
{
	/* validation */
	 $("#login-form").validate({
	   submitHandler: submitForm	
       });  
	   /* validation */
	   
	   /* login submit */
	   function submitForm()
	   {		
			var data = $("#login-form").serialize();
			
			$.ajax({
				
			type : 'POST',
			//url  : 'server/login.php',
			url  : 'http://www.grand-pillar.com/uploads/fire/login.php',
			data : data,
			beforeSend: function()
			{	
				$("#error").fadeOut();
				$("#btn-login").html('<span class=""></span> &nbsp; loading...');
			},
			success :  function(response)
			   {						
					//if(response=="ok"){
					if(response > 0){
						$("#btn-login").html('&nbsp; Signing in...');
						//setTimeout(' window.location.href = "home.html?usrID='+response+'"; ',4000);
						window.location.href = "home.html?usrID="+response;
					}
					else{
									
						$("#error").fadeIn(1000, function(){						
							$("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+'.</div>');
							$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
						});
						console.log(response);
					}
			  }
			});
				return false;
		}
	   /* login submit */
});

function signupform(){
	var remail = $("#usrnm2").val();
	var pass = $("#psswrd2").val();
	var rpass = $("#psswrd3").val();
	if (pass == rpass) {
		$.ajax({		
			type : 'POST',
			url  : 'http://www.grand-pillar.com/uploads/fire/signup.php',
			//url  : 'server/signup.php',
			data : "remail="+remail+"&pass="+pass,
			beforeSend: function()
			{	
				$("#error").fadeOut();
				$("#btn-signup").html('<span class=""></span> &nbsp; loading...');
			},
			success :  function(response){						
				if(response > 0){
						$("#btn-signup").html('&nbsp; Signing up...');
						//setTimeout(' window.location.href = "index.html"; ',4000);
						$("#sccMsg").text("Signing up success.");
					}
				else{
									
						$("#error").fadeIn(1000, function(){						
							$("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response+'.</div>');
							$("#btn-signup").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign up');
						});
						console.log(response);
					}
				
			}
		});
	}
	if(pass != rpass){
		$("#error").text("Password not match.");
		$("#error").fadeIn();
		$("#error").fadeOut(5000);
	}
	
}