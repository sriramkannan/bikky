


var poolData = { 
    UserPoolId : 'us-west-2_gh9N06W7s', // Your user pool id here
    ClientId : '7cptg227a5boenhl117qk2sudm' // Your client id here
};

function authenticate() {
	//alert($('.form-control#email').val());
    var authenticationData = {
        Username : ''+$('.form-control#exampleInputEmail1').val(),
        Password : ''+$('.form-control#exampleInputPassword1').val(),
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : ''+$('.form-control#exampleInputEmail1').val(),
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            //alert("Logged in");

            $('#loginForm').submit();

            /*AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : 'us-west-2_nMYKB40RW', // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.us-west-2.amazonaws.com/us-west-2_nMYKB40RW' : result.getIdToken().getJwtToken()
                }
            });*/

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        },

        onFailure: function(err) {
            //alert(err);
            $('#loginFailed').show();
        },

        newPasswordRequired: function(userAttributes, requiredAttributes) {
            // User was signed up by an admin and must provide new 
            // password and required attributes, if any, to complete 
            // authentication.

            // the api doesn't accept this field back
            //delete userAttributes.email_verified;

            // Get these details and call 
            cognitoUser.completeNewPasswordChallenge("HeyThere123", userAttributes, this);
        }

    });
}

function register() {
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var attributeList = [];

    var dataEmail = {
        Name : 'email',
        Value : ''+$('.form-control#senderEmail').val()
    };

    var dataPhoneNumber = {
        Name : 'phone_number',
        Value : ''+$('.form-control#senderPhone').val()
    };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);

    attributeList.push(attributeEmail);
    attributeList.push(attributePhoneNumber);

    var emailToUserName = $('.form-control#senderEmail').val().replace('@','_at_');

    userPool.signUp(emailToUserName, ''+$('.form-control#senderPass').val(), attributeList, null, function(err, result){
        if (err) {
            alert(err);
            return;
        }
        cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        alert("Thanks for registering with us. Please check your email to complete the registration process.");
        $('#registerForm').submit();
    });
}

function confirmRegistration() {
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username : ''+$('.form-control#exampleInputEmail1').val().replace('@','_at_'),
        Pool : userPool
    };

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration($('.form-control#exampleInputConfirmCode1').val(), true, function(err, result) {
        if (err) {
            //alert(err);
            $('#confirmFailed').show();
            return;
        }
        alert("Congratulations. Your Email ID is verified.");

        console.log('call result: ' + result);
        $('#confirmationForm').submit();
    });
}

function resendConfirmationCode() {
    cognitoUser.resendConfirmationCode(function(err, result) {
        if (err) {
            alert(err);
            return;
        }
        console.log('call result: ' + result);
    });
}