var fs = require('fs');
var $ = require('jquery');

var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
		
exports.createFile = function(callback, path){
	var logValue = '[{"test scenarios" :'+' "'+datetime+'"}';
	fs.writeFileSync(path, logValue+',\n');
	console.log('File created');
	console.log('==============');
	callback();
}

var readFile = function(path, callback){
	fs.readFile(path, 'utf8', function (err,data) {
		if (err) {
		return console.log(err);
		}
		callback(data);
	});
}

exports.generateHtmlReport = function(callback, path){
	finishReportFile(path, function(data){
		var temp = JSON.parse(data);
		var passCount =0;
		var failCount = 0;
		var skipCount = 0;
		var numberOfTestCases=0;
		var template = '<!DOCTYPE html><html><head><style>table, th, td {border: 1px solid black;}</style></head><body><table><caption><b>Execution details</b></caption><tr bgcolor="#DFD9D9"><th>Test case</th><th>Status</th><th>Reason</th>';
		for(var i=1;i<temp.length;i++){
			if(typeof temp[i].test_case !== 'undefined'){
				if(temp[i].status == 'pass'){
					template = template.concat('<tr bgcolor="#2EDC34"><th>'+temp[i].test_case+'</th>');
				}else if(temp[i].status == 'fail'){
					template = template.concat('<tr bgcolor="#F13037"><th>'+temp[i].test_case+'</th>');
				}else if(temp[i].status == 'skip'){
					template = template.concat('<tr bgcolor="#BAB7B7"><th>'+temp[i].test_case+'</th>');
				}	
				//template = template.concat("<tr><th>"+temp[i].test_case+"</th>");
			}else{
				template = template.concat("<tr><th></th>");
			}
			if(typeof temp[i].status !== 'undefined'){
				if(temp[i].status == 'pass'){
					passCount = passCount+1;
				}else if(temp[i].status == 'fail'){
					failCount = failCount+1;
				}else if(temp[i].status == 'skip'){
					skipCount = skipCount +1;
				}
				template = template.concat("<th>"+temp[i].status+"</th>");
			}else{
				template = template.concat("<th></th>");
			}
			if(typeof temp[i].reason !== 'undefined'){
				template = template.concat("<th>"+temp[i].reason+"</th>");
			}else{
				template = template.concat("<th></th>");
			}
			template = template.concat("</tr>")
			numberOfTestCases = numberOfTestCases+1;
		}
		template = template.concat('</table></br></br><table><caption><b>Overall Status</b></caption><tr bgcolor="#DFD9D9"><th>Status</th><th>Count</th></tr><tr bgcolor="#F1F42B"><th>Number of test cases executed</th><th>');
		template = template.concat(numberOfTestCases+'</th></tr><tr bgcolor="#2EDC34"><th>Pass</th><th>');
		template = template.concat(passCount+'</th></tr><tr bgcolor="#F13037"><th>Fail</th><th>');
		template = template.concat(failCount+'</th></tr><tr bgcolor="#BAB7B7"><th>Skip</th><th>');
		template = template.concat(skipCount+"</th></tr></table></body></html>");
		fs.writeFileSync(htmlReportFilePath, template);
		callback();
	});
}

var finishReportFile = function(path, callback){
	readFile(path, function(data){
		data = data.substring(0, data.length - 2);
		data = data + ']';
		fs.writeFileSync(path, data);
		console.log("\nLog is generated in directory:"+path+'\n');
		console.log('==============');
		callback(data);
	});
}

exports.writeToFile = function(path, data){
	fs.appendFile(path, data, function (err) {
	  if (err){ 
		console.log('Cannot write in report file');
	  }
	});
}

exports.writeTestCaseExecution = function(path, result, testCaseName, reason){
	var status = 'fail';
	var jsonData;
	if(result == true){
		status = 'pass';
		jsonData = '{"test_case" : '+'"'+testCaseName+'", "status" : "'+status+'"}';
	}
	else{
		jsonData = '{"test_case": '+'"'+testCaseName+'", "status" : "'+status+'", "reason": "'+reason+'"}';
	}
	
	fs.appendFile(path, jsonData+',\n', function (err) {
	  if (err){ 
		console.log('Cannot write in report file');
	  }
	});
}

exports.writeSkippedTestCaseExecution = function(path, testCaseName, reason){
	var status = 'skip';
	var jsonData = '{"test_case" : '+'"'+testCaseName+'", "status" : "'+status+'", "reason": "'+reason+'"}';
	console.log(testCaseName + " skipped");
	console.log(jsonData);
	console.log("==================");
	
	fs.appendFile(path, jsonData+',\n', function (err) {
	  if (err){ 
		console.log('Cannot write in report file');
	  }
	});
}




	
	