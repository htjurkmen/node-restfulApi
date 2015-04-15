var fileutils = require('./fileutils');

exports.assertEqual = function(actualValue, expectedValue,testcasename, messageOnFailure){
		var passed = false;
		if(actualValue == expectedValue){
			passed = true;
			console.log(testcasename + " passed");
			console.log("==================");
			fileutils.writeTestCaseExecution(reportFilePath, passed, testcasename);
		}else{
			fileutils.writeTestCaseExecution(reportFilePath, passed, testcasename, messageOnFailure);
			console.log(testcasename + " failed");
			console.log(messageOnFailure);
			console.log("==================");
		}
}