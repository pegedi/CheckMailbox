import React, { useState, useEffect } from 'react';
import './App.css';
import ButtonAppBar from'./AppBar';
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import CustomizedTables from './Table';
//import jsonp from './jsonp';
import downloadfile2 from './downloadToFile';
import StatusBar from './StatusBar';
//import {API_KEY_ENV, CLIENT_ID_ENV} from './.env.local'

const queryURL='https://script.google.com/macros/s/AKfycbzNEIVgweOKPUyS9rjAOePMG2fTcKy1YIj0V8cI_VpMTGQLuA3-/exec?query=label:orareport';
const queryDEVURL='https://script.google.com/macros/s/AKfycbymuFfnEq2Rw-KSq93_3u4qpKnFiOhQMn-uY2_3IdMo/dev?query=label:orareport';
const API_KEY = process.env.REACT_APP_API_KEY;

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; 
const DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"];
var SCOPES = 'https://www.googleapis.com/auth/script.projects';


const headerCells = [{fieldName: "Report Name", align: "left"},
                {fieldName: "Subject", align: "left"},
                {fieldName: "Request ID", align: "left"},
                {fieldName: "Link", align: "left"},
                {fieldName: "ThreadID", align: "left"},]

let uName = 'InitName';  
export const AppProvider = (props) => {
    const [appUName, setAppUName] = useState(uName);
    console.log(appUName);
    return (
        
           <App 
             appUName={appUName}
             setAppUName={setAppUName}
           />
    )
}
function App({appUName, setAppUName}) {
   console.log('function app Started');
   console.log(process.env.REACT_APP_API_KEY); 
   console.log(process.env.REACT_APP_CLIENT_ID);

   if (!document.getElementById('gapi_script')) {
        let script = document.createElement('script');
        script.src = 'https://apis.google.com/js/client.js'
        script.setAttribute("id", "gapi_script")
        script.setAttribute("async", "");
        script.setAttribute("defer","");
        script.onload = function() {
            window.gapi.load('client:auth2', initClient);
        } 
        
     //   script.setAttribute("onload", 'this.onload=function(){};handleClientLoad()');
     //   script.setAttribute("onreadystatechange","if (this.readyState === 'complete') this.onload()");
        document.body.appendChild(script);
       // initClient();

   }
   
   //const [dataRows, setDataRows] = useState([]);
   let dataRows = [];
   
 
  // setAppUserName('Kettő');

     function initClient() {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
            console.log("gapi.client.init went OK");
            window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
            
            // Handle the initial sign-in state.
            updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());

        }, function(error) {
            console.log('gapi.client.init went wrong:');
            console.log(error);
        });
      }
   
   
   const updateSigninStatus = (isSignedIn) => {
       console.log('function updateSigninStatus:');
       console.log(isSignedIn);
       if (isSignedIn) {
          const currentProfile = window.gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
          console.log(currentProfile.getName());
          uName = currentProfile.getName();       
        } else {
          uName = null;
        }
        setAppUName(uName);
        console.log(uName);

   }

   const loginClickedFunction = (event) => {
      console.log(window.gapi.auth2.getAuthInstance().isSignedIn.get())
      if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        window.gapi.auth2.getAuthInstance().signOut();
      } else {
        window.gapi.auth2.getAuthInstance().signIn();

      }
      event.stopPropagation();
   };

   const inquiryPressed = (event) => {
    console.log('Refresh Started!');
    setAppUName('-ha');
    console.log(appUName);
//    jsonp(queryDEVURL, response => {setDataRows(response)});
 
  };
  
  const downloadBtnClicked = (event) => {
    console.log("buttonClicked function started");
    let fileText = "Request ID|Subject|Report Name|Link\r\n";
    for (let dataRow of dataRows) {
    fileText += dataRow.requestID + "|" + dataRow.subject + "|" + dataRow.reportName + "|" + dataRow.linkString +"\r\n";          
    }

    downloadfile2("emailDetails.txt",fileText);
//    $('#progress').html("File Downloaded");

    event.stopPropagation();
    }

  
  return (
    <>
        <CssBaseline/>
        <ButtonAppBar 
            inquiryPressed={inquiryPressed}
            downloadBtnClicked={downloadBtnClicked}
            loginClicked={loginClickedFunction}
            userName={appUName}
        />

        <Box m='20px' mt='80px'>
           <CustomizedTables 
                headerCells={headerCells} 
                dataRows={dataRows}/>
        </Box>
        <StatusBar
            message1={'Username: ' + appUName} 
        />
    </>
  );
}

export default App;

