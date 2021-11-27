var app = angular.module('reportingApp', []);

//<editor-fold desc="global helpers">

var isValueAnArray = function (val) {
    return Array.isArray(val);
};

var getSpec = function (str) {
    var describes = str.split('|');
    return describes[describes.length - 1];
};
var checkIfShouldDisplaySpecName = function (prevItem, item) {
    if (!prevItem) {
        item.displaySpecName = true;
    } else if (getSpec(item.description) !== getSpec(prevItem.description)) {
        item.displaySpecName = true;
    }
};

var getParent = function (str) {
    var arr = str.split('|');
    str = "";
    for (var i = arr.length - 2; i > 0; i--) {
        str += arr[i] + " > ";
    }
    return str.slice(0, -3);
};

var getShortDescription = function (str) {
    return str.split('|')[0];
};

var countLogMessages = function (item) {
    if ((!item.logWarnings || !item.logErrors) && item.browserLogs && item.browserLogs.length > 0) {
        item.logWarnings = 0;
        item.logErrors = 0;
        for (var logNumber = 0; logNumber < item.browserLogs.length; logNumber++) {
            var logEntry = item.browserLogs[logNumber];
            if (logEntry.level === 'SEVERE') {
                item.logErrors++;
            }
            if (logEntry.level === 'WARNING') {
                item.logWarnings++;
            }
        }
    }
};

var convertTimestamp = function (timestamp) {
    var d = new Date(timestamp),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
};

var defaultSortFunction = function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) {
        return -1;
    } else if (a.sessionId > b.sessionId) {
        return 1;
    }

    if (a.timestamp < b.timestamp) {
        return -1;
    } else if (a.timestamp > b.timestamp) {
        return 1;
    }

    return 0;
};

//</editor-fold>

app.controller('ScreenshotReportController', ['$scope', '$http', 'TitleService', function ($scope, $http, titleService) {
    var that = this;
    var clientDefaults = {};

    $scope.searchSettings = Object.assign({
        description: '',
        allselected: true,
        passed: true,
        failed: true,
        pending: true,
        withLog: true
    }, clientDefaults.searchSettings || {}); // enable customisation of search settings on first page hit

    this.warningTime = 1400;
    this.dangerTime = 1900;
    this.totalDurationFormat = clientDefaults.totalDurationFormat;
    this.showTotalDurationIn = clientDefaults.showTotalDurationIn;

    var initialColumnSettings = clientDefaults.columnSettings; // enable customisation of visible columns on first page hit
    if (initialColumnSettings) {
        if (initialColumnSettings.displayTime !== undefined) {
            // initial settings have be inverted because the html bindings are inverted (e.g. !ctrl.displayTime)
            this.displayTime = !initialColumnSettings.displayTime;
        }
        if (initialColumnSettings.displayBrowser !== undefined) {
            this.displayBrowser = !initialColumnSettings.displayBrowser; // same as above
        }
        if (initialColumnSettings.displaySessionId !== undefined) {
            this.displaySessionId = !initialColumnSettings.displaySessionId; // same as above
        }
        if (initialColumnSettings.displayOS !== undefined) {
            this.displayOS = !initialColumnSettings.displayOS; // same as above
        }
        if (initialColumnSettings.inlineScreenshots !== undefined) {
            this.inlineScreenshots = initialColumnSettings.inlineScreenshots; // this setting does not have to be inverted
        } else {
            this.inlineScreenshots = false;
        }
        if (initialColumnSettings.warningTime) {
            this.warningTime = initialColumnSettings.warningTime;
        }
        if (initialColumnSettings.dangerTime) {
            this.dangerTime = initialColumnSettings.dangerTime;
        }
    }


    this.chooseAllTypes = function () {
        var value = true;
        $scope.searchSettings.allselected = !$scope.searchSettings.allselected;
        if (!$scope.searchSettings.allselected) {
            value = false;
        }

        $scope.searchSettings.passed = value;
        $scope.searchSettings.failed = value;
        $scope.searchSettings.pending = value;
        $scope.searchSettings.withLog = value;
    };

    this.isValueAnArray = function (val) {
        return isValueAnArray(val);
    };

    this.getParent = function (str) {
        return getParent(str);
    };

    this.getSpec = function (str) {
        return getSpec(str);
    };

    this.getShortDescription = function (str) {
        return getShortDescription(str);
    };
    this.hasNextScreenshot = function (index) {
        var old = index;
        return old !== this.getNextScreenshotIdx(index);
    };

    this.hasPreviousScreenshot = function (index) {
        var old = index;
        return old !== this.getPreviousScreenshotIdx(index);
    };
    this.getNextScreenshotIdx = function (index) {
        var next = index;
        var hit = false;
        while (next + 2 < this.results.length) {
            next++;
            if (this.results[next].screenShotFile && !this.results[next].pending) {
                hit = true;
                break;
            }
        }
        return hit ? next : index;
    };

    this.getPreviousScreenshotIdx = function (index) {
        var prev = index;
        var hit = false;
        while (prev > 0) {
            prev--;
            if (this.results[prev].screenShotFile && !this.results[prev].pending) {
                hit = true;
                break;
            }
        }
        return hit ? prev : index;
    };

    this.convertTimestamp = convertTimestamp;


    this.round = function (number, roundVal) {
        return (parseFloat(number) / 1000).toFixed(roundVal);
    };


    this.passCount = function () {
        var passCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.passed) {
                passCount++;
            }
        }
        return passCount;
    };


    this.pendingCount = function () {
        var pendingCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.pending) {
                pendingCount++;
            }
        }
        return pendingCount;
    };

    this.failCount = function () {
        var failCount = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (!result.passed && !result.pending) {
                failCount++;
            }
        }
        return failCount;
    };

    this.totalDuration = function () {
        var sum = 0;
        for (var i in this.results) {
            var result = this.results[i];
            if (result.duration) {
                sum += result.duration;
            }
        }
        return sum;
    };

    this.passPerc = function () {
        return (this.passCount() / this.totalCount()) * 100;
    };
    this.pendingPerc = function () {
        return (this.pendingCount() / this.totalCount()) * 100;
    };
    this.failPerc = function () {
        return (this.failCount() / this.totalCount()) * 100;
    };
    this.totalCount = function () {
        return this.passCount() + this.failCount() + this.pendingCount();
    };


    var results = [
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fa000e-000f-00b2-0001-006d00060000.png",
        "timestamp": 1637892406417,
        "duration": 4665
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00de00e1-008c-00ae-0076-00ba00b40077.png",
        "timestamp": 1637892411704,
        "duration": 1399
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d6003b-002a-00fc-00e0-0051008600b5.png",
        "timestamp": 1637892413272,
        "duration": 1475
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ff0079-00dc-0017-001e-00fe00360049.png",
        "timestamp": 1637892414980,
        "duration": 1007
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00810096-00d8-00cc-00d8-002e006f008b.png",
        "timestamp": 1637892416099,
        "duration": 661
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0071005b-0081-000b-00f1-007a00b80099.png",
        "timestamp": 1637892416912,
        "duration": 613
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af00f2-00b3-000a-006e-00d400b000ee.png",
        "timestamp": 1637892417795,
        "duration": 721
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/794/wxk33chn/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637892418678,
                "type": ""
            }
        ],
        "screenShotFile": "004a0002-0074-0021-0022-00d900940089.png",
        "timestamp": 1637892418662,
        "duration": 4042
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00eb00b1-00ed-002a-00d7-005700510062.png",
        "timestamp": 1637892422791,
        "duration": 2670
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ac00dd-00ef-005e-00d8-00ea00490002.png",
        "timestamp": 1637892425562,
        "duration": 1622
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af00c8-003e-002a-00b9-0065001f00c1.png",
        "timestamp": 1637892427337,
        "duration": 2124
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001600f6-0057-002f-008d-005100760094.png",
        "timestamp": 1637892429611,
        "duration": 2127
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0034000b-00d2-0047-00f3-001000fd0066.png",
        "timestamp": 1637892431914,
        "duration": 3102
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000300a4-00f9-00c4-00a2-006b004d0009.png",
        "timestamp": 1637892435235,
        "duration": 2066
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "006e0039-0000-008a-00d5-000e002b003d.png",
        "timestamp": 1637892437419,
        "duration": 1319
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 7472,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a60038-002e-0098-0092-00080016005a.png",
        "timestamp": 1637892438835,
        "duration": 14402
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009c0034-009a-0098-002a-0059008e00fa.png",
        "timestamp": 1637892757842,
        "duration": 1752
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001c0081-0056-006a-006f-00de00d300f4.png",
        "timestamp": 1637892760092,
        "duration": 1597
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000a0010-00c2-0083-0016-003d006400af.png",
        "timestamp": 1637892761983,
        "duration": 3259
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002a0035-003b-00b3-00d2-001d007e003d.png",
        "timestamp": 1637892765485,
        "duration": 1055
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00cb002e-0074-00b4-0037-00230096003f.png",
        "timestamp": 1637892766622,
        "duration": 696
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b0008a-0060-0059-005c-0078007100f6.png",
        "timestamp": 1637892767419,
        "duration": 637
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0003003a-00a6-00a6-0089-006a00cc005c.png",
        "timestamp": 1637892768172,
        "duration": 701
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/009/wd42tcs1/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637892769017,
                "type": ""
            }
        ],
        "screenShotFile": "00e300f3-0029-000f-0054-00db00980099.png",
        "timestamp": 1637892769017,
        "duration": 3432
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e900af-00ce-00a7-008f-00580082001a.png",
        "timestamp": 1637892772538,
        "duration": 2703
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000300f3-00bb-008a-0080-003100c2002f.png",
        "timestamp": 1637892775463,
        "duration": 1671
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e50020-0017-0061-0096-00f60047000d.png",
        "timestamp": 1637892777288,
        "duration": 2530
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009400c3-00c4-002d-003e-007700ab00d5.png",
        "timestamp": 1637892779912,
        "duration": 1897
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00aa00ca-00e4-00ca-00c9-00e2004d00b9.png",
        "timestamp": 1637892781967,
        "duration": 3133
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007a0076-0045-009b-006b-00f000f20068.png",
        "timestamp": 1637892785226,
        "duration": 1741
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00dc008b-00e3-00c3-002a-004900e200c1.png",
        "timestamp": 1637892787103,
        "duration": 2021
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 13148,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00750018-000c-0058-0084-002400f40008.png",
        "timestamp": 1637892789258,
        "duration": 14123
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ab0027-002b-000b-0077-00a700c000ec.png",
        "timestamp": 1637892902886,
        "duration": 1491
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008600b8-006d-005d-00e8-0057001700e9.png",
        "timestamp": 1637892904994,
        "duration": 1568
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009f00a5-0016-00a7-0025-00aa004500d5.png",
        "timestamp": 1637892906717,
        "duration": 1524
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ce00da-005a-0049-00ba-00a0007b0096.png",
        "timestamp": 1637892908521,
        "duration": 1066
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007b00e9-001a-00f7-0098-00bb00a2005e.png",
        "timestamp": 1637892909767,
        "duration": 649
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af00c8-00e3-00fe-0028-007800090015.png",
        "timestamp": 1637892910540,
        "duration": 616
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900f1-002e-00c3-00e6-004b00d300c3.png",
        "timestamp": 1637892911264,
        "duration": 669
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/930/wrbpw0np/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637892912072,
                "type": ""
            }
        ],
        "screenShotFile": "001d00ee-00d6-0029-00c5-0078008f0007.png",
        "timestamp": 1637892912070,
        "duration": 3487
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006c00be-0021-00fb-00cc-0004005f005e.png",
        "timestamp": 1637892915636,
        "duration": 2998
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00180091-0019-000a-0025-00e8007900ea.png",
        "timestamp": 1637892918778,
        "duration": 1634
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007e007c-00be-00ef-00bf-00f400f5009a.png",
        "timestamp": 1637892920569,
        "duration": 1560
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0092008b-003b-0056-005b-00b0005200d3.png",
        "timestamp": 1637892922274,
        "duration": 1795
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009b0029-00c0-0030-00bc-006b007d0023.png",
        "timestamp": 1637892924203,
        "duration": 3113
    },
    {
        "description": "should change input text|User page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": [
            "Expected 'AdminNeroaaaaa' to equal 'aaaaa'."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\e2e\\user\\user.e2e-spec.ts:83:49)\n    at step (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:143:27)\n    at Object.next (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:124:57)\n    at fulfilled (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:114:62)\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "0020005f-003f-00e9-00dc-00310014007a.png",
        "timestamp": 1637892927475,
        "duration": 2150
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00b300fc-0065-0040-001d-003600c20049.png",
        "timestamp": 1637892929880,
        "duration": 1307
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 5820,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000f0036-00d4-007b-00c5-005f003000f4.png",
        "timestamp": 1637892931338,
        "duration": 14896
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0076004d-00a1-00f2-004c-008900fc005e.png",
        "timestamp": 1637893012004,
        "duration": 1734
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b00087-00ad-0014-00b7-003a00910032.png",
        "timestamp": 1637893014104,
        "duration": 1530
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00870031-00ae-009a-003e-004c006100ba.png",
        "timestamp": 1637893015771,
        "duration": 1540
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001d008b-00a8-00c9-00d3-008d00bf0017.png",
        "timestamp": 1637893017556,
        "duration": 1007
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008c00b1-00ea-00e4-0034-00f0002a00ec.png",
        "timestamp": 1637893018671,
        "duration": 655
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005900bc-00b8-0081-003a-009700450063.png",
        "timestamp": 1637893019474,
        "duration": 614
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d0005e-00b3-001d-00dd-00da00250064.png",
        "timestamp": 1637893020204,
        "duration": 674
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/311/guy4pxn5/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637893021044,
                "type": ""
            }
        ],
        "screenShotFile": "00e5007a-0076-00b9-00c9-005c00f4001d.png",
        "timestamp": 1637893021040,
        "duration": 3477
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002700c6-009a-00a5-00ff-00f300980074.png",
        "timestamp": 1637893024597,
        "duration": 3028
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000b00b5-00c7-00e8-0096-006f00cd002f.png",
        "timestamp": 1637893027722,
        "duration": 1633
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009d00d2-006c-00f9-00c4-000700520081.png",
        "timestamp": 1637893029506,
        "duration": 2012
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0062000d-003b-0018-00e8-00ac003b0006.png",
        "timestamp": 1637893031664,
        "duration": 1842
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008b0094-0089-002f-008f-00ad006a0099.png",
        "timestamp": 1637893033669,
        "duration": 3046
    },
    {
        "description": "should change input text|User page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": [
            "Expected 'ManyaTestname' to equal 'Testname'."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\e2e\\user\\user.e2e-spec.ts:85:49)\n    at step (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:143:27)\n    at Object.next (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:124:57)\n    at fulfilled (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:114:62)\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "001400ec-00e1-0046-0088-0003007700a9.png",
        "timestamp": 1637893036795,
        "duration": 1425
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00130057-0058-0082-0015-008a00b900cd.png",
        "timestamp": 1637893038499,
        "duration": 1318
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8768,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ee0001-0022-00e5-0029-007e00b1002c.png",
        "timestamp": 1637893039986,
        "duration": 13981
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000000fa-001a-00ab-0025-000d007800bd.png",
        "timestamp": 1637893094526,
        "duration": 1674
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f20004-00eb-0086-0019-00a8005c0059.png",
        "timestamp": 1637893096678,
        "duration": 1452
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e60051-0008-00ee-00ae-006d00cf0075.png",
        "timestamp": 1637893098426,
        "duration": 1526
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002d0064-005b-00af-0030-00c800910038.png",
        "timestamp": 1637893100222,
        "duration": 1091
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00eb0055-007c-003c-005f-0050001e00aa.png",
        "timestamp": 1637893101465,
        "duration": 662
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00d400a4-0091-0076-00ed-008000450051.png",
        "timestamp": 1637893102295,
        "duration": 619
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009600ea-00ae-004b-0012-0068009c009b.png",
        "timestamp": 1637893103074,
        "duration": 705
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/445/dqxylt1h/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637893103878,
                "type": ""
            }
        ],
        "screenShotFile": "00c30028-0058-003a-0067-006a00bb00b5.png",
        "timestamp": 1637893103865,
        "duration": 3663
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002200de-00a9-0092-009e-006000c00032.png",
        "timestamp": 1637893107607,
        "duration": 3029
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008300cc-0048-0065-0004-008e005c0016.png",
        "timestamp": 1637893110798,
        "duration": 1614
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f3008c-0034-0030-0017-007c002f00ba.png",
        "timestamp": 1637893112570,
        "duration": 2177
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": [
            "NoSuchElementError: No element found using locator: By(css selector, ul)"
        ],
        "trace": [
            "NoSuchElementError: No element found using locator: By(css selector, ul)\n    at C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\built\\element.js:814:27\n    at ManagedPromise.invokeCallback_ (C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:1376:14)\n    at TaskQueue.execute_ (C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3084:14)\n    at TaskQueue.executeNext_ (C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:3067:27)\n    at C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:2927:27\n    at C:\\Users\\sangn\\AppData\\Roaming\\npm\\node_modules\\protractor\\node_modules\\selenium-webdriver\\lib\\promise.js:668:7\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "005800a8-003e-00b6-00c8-00530000004d.png",
        "timestamp": 1637893114903,
        "duration": 1989
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009d007a-0080-00ae-007c-00640069005d.png",
        "timestamp": 1637893117040,
        "duration": 3463
    },
    {
        "description": "should change input text|User page",
        "passed": false,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": [
            "Expected 'Manya12Testname' to equal 'Testname'."
        ],
        "trace": [
            "Error: Failed expectation\n    at UserContext.<anonymous> (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\e2e\\user\\user.e2e-spec.ts:85:49)\n    at step (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:143:27)\n    at Object.next (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:124:57)\n    at fulfilled (D:\\SAng\\Angular in 11\\coreui-free-angular-admin-template-master\\node_modules\\tslib\\tslib.js:114:62)\n    at processTicksAndRejections (internal/process/task_queues.js:95:5)"
        ],
        "browserLogs": [],
        "screenShotFile": "005400df-00b5-00d8-00da-00b800cc00b1.png",
        "timestamp": 1637893120637,
        "duration": 1408
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14808,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "009d0090-0036-0003-00e9-0091002e008d.png",
        "timestamp": 1637893122261,
        "duration": 2010
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00250040-007c-00dd-0048-0080003a00ee.png",
        "timestamp": 1637893176515,
        "duration": 1672
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e50069-00e7-0085-0009-00ce00590011.png",
        "timestamp": 1637893178351,
        "duration": 1420
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00e7002a-008d-0027-00b1-009100130077.png",
        "timestamp": 1637893179963,
        "duration": 1514
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001900da-00e0-00e4-006e-004f000a00e4.png",
        "timestamp": 1637893181770,
        "duration": 993
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b30056-0048-0002-00a6-0087005b00d4.png",
        "timestamp": 1637893182957,
        "duration": 638
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001d0022-0054-004a-0061-007200ec005e.png",
        "timestamp": 1637893183757,
        "duration": 612
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f50036-0095-00ac-0098-00f7005c0013.png",
        "timestamp": 1637893184532,
        "duration": 706
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/736/c5rsippz/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637893185384,
                "type": ""
            }
        ],
        "screenShotFile": "00f30009-0055-0048-007c-0073007c00b8.png",
        "timestamp": 1637893185374,
        "duration": 3491
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004700d7-00dd-00c0-0031-00eb00ec00b7.png",
        "timestamp": 1637893188977,
        "duration": 2685
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 14672,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "009d0011-00ff-0097-00d3-006400f20005.png",
        "timestamp": 1637893191833,
        "duration": 1451
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002800b8-00d7-0068-00db-00e7007100f0.png",
        "timestamp": 1637893245472,
        "duration": 2925
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b500d2-009b-00bc-00a9-00cb003600ab.png",
        "timestamp": 1637893248597,
        "duration": 1401
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006c0012-00f9-003c-00af-0025008200ed.png",
        "timestamp": 1637893250166,
        "duration": 1505
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006a001a-00c1-0041-0048-00b000e4009a.png",
        "timestamp": 1637893252085,
        "duration": 1056
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00ef004e-00ee-007a-00dc-009b00bb0031.png",
        "timestamp": 1637893253298,
        "duration": 637
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "002d00e1-00e0-00d3-0096-0047009c00aa.png",
        "timestamp": 1637893254106,
        "duration": 603
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0028009a-00fc-0001-0005-000f001d0085.png",
        "timestamp": 1637893254862,
        "duration": 700
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [
            {
                "level": "WARNING",
                "message": "http://localhost:4200/polyfills.js 25676 WebSocket connection to 'ws://localhost:4200/sockjs-node/231/e2udvjeb/websocket' failed: WebSocket is closed before the connection is established.",
                "timestamp": 1637893255712,
                "type": ""
            }
        ],
        "screenShotFile": "00030099-00b8-001e-00f7-000a00fb0021.png",
        "timestamp": 1637893255708,
        "duration": 3469
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006500a2-00c1-000f-00f4-002b00dc0081.png",
        "timestamp": 1637893259265,
        "duration": 2689
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00910006-00d5-001e-00cb-005500cf000d.png",
        "timestamp": 1637893262127,
        "duration": 1611
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001500b3-00ee-00d9-00eb-006200890010.png",
        "timestamp": 1637893263897,
        "duration": 1924
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bb002f-007a-0087-002f-00e200ab00ca.png",
        "timestamp": 1637893265965,
        "duration": 1831
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a600c2-0038-009d-0013-00fc00ee00d4.png",
        "timestamp": 1637893267942,
        "duration": 3107
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008b0037-00db-0067-0046-009f00d7008d.png",
        "timestamp": 1637893271144,
        "duration": 1912
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00de0008-0003-00fc-0077-009700db00a1.png",
        "timestamp": 1637893273170,
        "duration": 1649
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 3112,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00bc0072-00bc-00d5-0019-00330065001e.png",
        "timestamp": 1637893274964,
        "duration": 14553
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f5001e-0029-00e4-00d4-00b500b10021.png",
        "timestamp": 1637896881866,
        "duration": 1153
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00590008-00fd-0051-0022-00e9009300fd.png",
        "timestamp": 1637896883589,
        "duration": 998
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a100e9-00e9-00e0-0078-001900160001.png",
        "timestamp": 1637896884705,
        "duration": 1064
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f80075-008b-00f1-00fd-0019008f008b.png",
        "timestamp": 1637896886144,
        "duration": 627
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "006d0060-008b-003b-0024-004e00b800ab.png",
        "timestamp": 1637896886957,
        "duration": 211
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "001800cc-0000-0041-00af-005e00aa0068.png",
        "timestamp": 1637896887320,
        "duration": 282
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "003e00f5-003d-009c-005a-00050077003a.png",
        "timestamp": 1637896887714,
        "duration": 336
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "000d00e7-00cf-0028-004e-001000570087.png",
        "timestamp": 1637896888165,
        "duration": 3386
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0089001d-0093-00c1-00b0-00c90048003f.png",
        "timestamp": 1637896891645,
        "duration": 2292
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00360009-0021-0041-0014-00320040003a.png",
        "timestamp": 1637896894097,
        "duration": 1164
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "005c006e-0056-00da-0010-000800a30019.png",
        "timestamp": 1637896895422,
        "duration": 1735
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00500094-0051-00f5-00cf-001f00dc00bf.png",
        "timestamp": 1637896897307,
        "duration": 1377
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00fe00cd-00ac-0014-0056-00ef00090059.png",
        "timestamp": 1637896898816,
        "duration": 2617
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00dd005e-00fc-00be-001d-0056009e00c5.png",
        "timestamp": 1637896901580,
        "duration": 1026
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00c8005f-00e2-003e-00b1-000f008d0062.png",
        "timestamp": 1637896902799,
        "duration": 1176
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 8252,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004b00b7-00f1-003b-006a-00b000a7000e.png",
        "timestamp": 1637896904129,
        "duration": 14380
    },
    {
        "description": "should navigate to products page when first run|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0071007b-00ab-0061-003f-00c400390037.png",
        "timestamp": 1637933245864,
        "duration": 1858
    },
    {
        "description": "should display the LivePreview button on mouseover|App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0059005e-0021-00b6-0044-004800440091.png",
        "timestamp": 1637933248302,
        "duration": 1675
    },
    {
        "description": "should navigate to Theme page when click LivePreview button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a90017-000e-0067-00be-00d100bd00d5.png",
        "timestamp": 1637933250141,
        "duration": 1615
    },
    {
        "description": "should navigate to Login page when click dashboard button |App page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0097008f-00c0-00bb-0081-0071003d0060.png",
        "timestamp": 1637933252040,
        "duration": 1066
    },
    {
        "description": "Login form should be valid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "0031008e-0082-00fb-0002-00e200bf0011.png",
        "timestamp": 1637933253279,
        "duration": 890
    },
    {
        "description": "Login form should be invalid|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "007300ad-0093-0056-004f-001500e80027.png",
        "timestamp": 1637933254306,
        "duration": 622
    },
    {
        "description": "App should navigate to the register page when the register button is clicked|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "004500d1-006c-0067-0029-0067001c006e.png",
        "timestamp": 1637933255065,
        "duration": 1047
    },
    {
        "description": "App should navigate to the dashboard/user page when user login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f20095-00a5-0029-006c-0072007e00f5.png",
        "timestamp": 1637933256230,
        "duration": 3668
    },
    {
        "description": "App should navigate to the dashboard/admin/manager page admin login|Login tests",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00f80052-008b-0049-0052-00e500680032.png",
        "timestamp": 1637933260039,
        "duration": 2683
    },
    {
        "description": "LocalStorage should have userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00b000e1-0025-00fb-0053-007e00fe00ff.png",
        "timestamp": 1637933262880,
        "duration": 1616
    },
    {
        "description": "Should select option Busy of Status select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "008f00c1-00d8-00df-00b3-005d003d00d5.png",
        "timestamp": 1637933264657,
        "duration": 2145
    },
    {
        "description": "Should select option Visa of paymentMethod select and clear option|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00a400de-0038-00a6-00a1-008b005200dd.png",
        "timestamp": 1637933266936,
        "duration": 1934
    },
    {
        "description": "Should select option VietNam of Country select|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00180068-001b-0052-007a-0065005b0078.png",
        "timestamp": 1637933269038,
        "duration": 3208
    },
    {
        "description": "should change input text|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00930045-00e8-00b3-00e2-001f007000f4.png",
        "timestamp": 1637933272393,
        "duration": 2003
    },
    {
        "description": "should upload a file|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed",
        "browserLogs": [],
        "screenShotFile": "00230013-0086-0082-0034-000300f60093.png",
        "timestamp": 1637933274557,
        "duration": 1647
    },
    {
        "description": "should upload a form userData|User page",
        "passed": true,
        "pending": false,
        "os": "Windows",
        "instanceId": 11620,
        "browser": {
            "name": "chrome",
            "version": "96.0.4664.45"
        },
        "message": "Passed.",
        "trace": "",
        "browserLogs": [],
        "screenShotFile": "00af0064-0080-006e-0024-00130001005f.png",
        "timestamp": 1637933276355,
        "duration": 14864
    }
];

    this.sortSpecs = function () {
        this.results = results.sort(function sortFunction(a, b) {
    if (a.sessionId < b.sessionId) return -1;else if (a.sessionId > b.sessionId) return 1;

    if (a.timestamp < b.timestamp) return -1;else if (a.timestamp > b.timestamp) return 1;

    return 0;
});

    };

    this.setTitle = function () {
        var title = $('.report-title').text();
        titleService.setTitle(title);
    };

    // is run after all test data has been prepared/loaded
    this.afterLoadingJobs = function () {
        this.sortSpecs();
        this.setTitle();
    };

    this.loadResultsViaAjax = function () {

        $http({
            url: './combined.json',
            method: 'GET'
        }).then(function (response) {
                var data = null;
                if (response && response.data) {
                    if (typeof response.data === 'object') {
                        data = response.data;
                    } else if (response.data[0] === '"') { //detect super escaped file (from circular json)
                        data = CircularJSON.parse(response.data); //the file is escaped in a weird way (with circular json)
                    } else {
                        data = JSON.parse(response.data);
                    }
                }
                if (data) {
                    results = data;
                    that.afterLoadingJobs();
                }
            },
            function (error) {
                console.error(error);
            });
    };


    if (clientDefaults.useAjax) {
        this.loadResultsViaAjax();
    } else {
        this.afterLoadingJobs();
    }

}]);

app.filter('bySearchSettings', function () {
    return function (items, searchSettings) {
        var filtered = [];
        if (!items) {
            return filtered; // to avoid crashing in where results might be empty
        }
        var prevItem = null;

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.displaySpecName = false;

            var isHit = false; //is set to true if any of the search criteria matched
            countLogMessages(item); // modifies item contents

            var hasLog = searchSettings.withLog && item.browserLogs && item.browserLogs.length > 0;
            if (searchSettings.description === '' ||
                (item.description && item.description.toLowerCase().indexOf(searchSettings.description.toLowerCase()) > -1)) {

                if (searchSettings.passed && item.passed || hasLog) {
                    isHit = true;
                } else if (searchSettings.failed && !item.passed && !item.pending || hasLog) {
                    isHit = true;
                } else if (searchSettings.pending && item.pending || hasLog) {
                    isHit = true;
                }
            }
            if (isHit) {
                checkIfShouldDisplaySpecName(prevItem, item);

                filtered.push(item);
                prevItem = item;
            }
        }

        return filtered;
    };
});

//formats millseconds to h m s
app.filter('timeFormat', function () {
    return function (tr, fmt) {
        if(tr == null){
            return "NaN";
        }

        switch (fmt) {
            case 'h':
                var h = tr / 1000 / 60 / 60;
                return "".concat(h.toFixed(2)).concat("h");
            case 'm':
                var m = tr / 1000 / 60;
                return "".concat(m.toFixed(2)).concat("min");
            case 's' :
                var s = tr / 1000;
                return "".concat(s.toFixed(2)).concat("s");
            case 'hm':
            case 'h:m':
                var hmMt = tr / 1000 / 60;
                var hmHr = Math.trunc(hmMt / 60);
                var hmMr = hmMt - (hmHr * 60);
                if (fmt === 'h:m') {
                    return "".concat(hmHr).concat(":").concat(hmMr < 10 ? "0" : "").concat(Math.round(hmMr));
                }
                return "".concat(hmHr).concat("h ").concat(hmMr.toFixed(2)).concat("min");
            case 'hms':
            case 'h:m:s':
                var hmsS = tr / 1000;
                var hmsHr = Math.trunc(hmsS / 60 / 60);
                var hmsM = hmsS / 60;
                var hmsMr = Math.trunc(hmsM - hmsHr * 60);
                var hmsSo = hmsS - (hmsHr * 60 * 60) - (hmsMr*60);
                if (fmt === 'h:m:s') {
                    return "".concat(hmsHr).concat(":").concat(hmsMr < 10 ? "0" : "").concat(hmsMr).concat(":").concat(hmsSo < 10 ? "0" : "").concat(Math.round(hmsSo));
                }
                return "".concat(hmsHr).concat("h ").concat(hmsMr).concat("min ").concat(hmsSo.toFixed(2)).concat("s");
            case 'ms':
                var msS = tr / 1000;
                var msMr = Math.trunc(msS / 60);
                var msMs = msS - (msMr * 60);
                return "".concat(msMr).concat("min ").concat(msMs.toFixed(2)).concat("s");
        }

        return tr;
    };
});


function PbrStackModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;
    ctrl.convertTimestamp = convertTimestamp;
    ctrl.isValueAnArray = isValueAnArray;
    ctrl.toggleSmartStackTraceHighlight = function () {
        var inv = !ctrl.rootScope.showSmartStackTraceHighlight;
        ctrl.rootScope.showSmartStackTraceHighlight = inv;
    };
    ctrl.applySmartHighlight = function (line) {
        if ($rootScope.showSmartStackTraceHighlight) {
            if (line.indexOf('node_modules') > -1) {
                return 'greyout';
            }
            if (line.indexOf('  at ') === -1) {
                return '';
            }

            return 'highlight';
        }
        return '';
    };
}


app.component('pbrStackModal', {
    templateUrl: "pbr-stack-modal.html",
    bindings: {
        index: '=',
        data: '='
    },
    controller: PbrStackModalController
});

function PbrScreenshotModalController($scope, $rootScope) {
    var ctrl = this;
    ctrl.rootScope = $rootScope;
    ctrl.getParent = getParent;
    ctrl.getShortDescription = getShortDescription;

    /**
     * Updates which modal is selected.
     */
    this.updateSelectedModal = function (event, index) {
        var key = event.key; //try to use non-deprecated key first https://developer.mozilla.org/de/docs/Web/API/KeyboardEvent/keyCode
        if (key == null) {
            var keyMap = {
                37: 'ArrowLeft',
                39: 'ArrowRight'
            };
            key = keyMap[event.keyCode]; //fallback to keycode
        }
        if (key === "ArrowLeft" && this.hasPrevious) {
            this.showHideModal(index, this.previous);
        } else if (key === "ArrowRight" && this.hasNext) {
            this.showHideModal(index, this.next);
        }
    };

    /**
     * Hides the modal with the #oldIndex and shows the modal with the #newIndex.
     */
    this.showHideModal = function (oldIndex, newIndex) {
        const modalName = '#imageModal';
        $(modalName + oldIndex).modal("hide");
        $(modalName + newIndex).modal("show");
    };

}

app.component('pbrScreenshotModal', {
    templateUrl: "pbr-screenshot-modal.html",
    bindings: {
        index: '=',
        data: '=',
        next: '=',
        previous: '=',
        hasNext: '=',
        hasPrevious: '='
    },
    controller: PbrScreenshotModalController
});

app.factory('TitleService', ['$document', function ($document) {
    return {
        setTitle: function (title) {
            $document[0].title = title;
        }
    };
}]);


app.run(
    function ($rootScope, $templateCache) {
        //make sure this option is on by default
        $rootScope.showSmartStackTraceHighlight = true;
        
  $templateCache.put('pbr-screenshot-modal.html',
    '<div class="modal" id="imageModal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="imageModalLabel{{$ctrl.index}}" ng-keydown="$ctrl.updateSelectedModal($event,$ctrl.index)">\n' +
    '    <div class="modal-dialog modal-lg m-screenhot-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="imageModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="imageModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <img class="screenshotImage" ng-src="{{$ctrl.data.screenShotFile}}">\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <div class="pull-left">\n' +
    '                    <button ng-disabled="!$ctrl.hasPrevious" class="btn btn-default btn-previous" data-dismiss="modal"\n' +
    '                            data-toggle="modal" data-target="#imageModal{{$ctrl.previous}}">\n' +
    '                        Prev\n' +
    '                    </button>\n' +
    '                    <button ng-disabled="!$ctrl.hasNext" class="btn btn-default btn-next"\n' +
    '                            data-dismiss="modal" data-toggle="modal"\n' +
    '                            data-target="#imageModal{{$ctrl.next}}">\n' +
    '                        Next\n' +
    '                    </button>\n' +
    '                </div>\n' +
    '                <a class="btn btn-primary" href="{{$ctrl.data.screenShotFile}}" target="_blank">\n' +
    '                    Open Image in New Tab\n' +
    '                    <span class="glyphicon glyphicon-new-window" aria-hidden="true"></span>\n' +
    '                </a>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

  $templateCache.put('pbr-stack-modal.html',
    '<div class="modal" id="modal{{$ctrl.index}}" tabindex="-1" role="dialog"\n' +
    '     aria-labelledby="stackModalLabel{{$ctrl.index}}">\n' +
    '    <div class="modal-dialog modal-lg m-stack-modal" role="document">\n' +
    '        <div class="modal-content">\n' +
    '            <div class="modal-header">\n' +
    '                <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
    '                    <span aria-hidden="true">&times;</span>\n' +
    '                </button>\n' +
    '                <h6 class="modal-title" id="stackModalLabelP{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getParent($ctrl.data.description)}}</h6>\n' +
    '                <h5 class="modal-title" id="stackModalLabel{{$ctrl.index}}">\n' +
    '                    {{$ctrl.getShortDescription($ctrl.data.description)}}</h5>\n' +
    '            </div>\n' +
    '            <div class="modal-body">\n' +
    '                <div ng-if="$ctrl.data.trace.length > 0">\n' +
    '                    <div ng-if="$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer" ng-repeat="trace in $ctrl.data.trace track by $index"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                    <div ng-if="!$ctrl.isValueAnArray($ctrl.data.trace)">\n' +
    '                        <pre class="logContainer"><div ng-class="$ctrl.applySmartHighlight(line)" ng-repeat="line in $ctrl.data.trace.split(\'\\n\') track by $index">{{line}}</div></pre>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '                <div ng-if="$ctrl.data.browserLogs.length > 0">\n' +
    '                    <h5 class="modal-title">\n' +
    '                        Browser logs:\n' +
    '                    </h5>\n' +
    '                    <pre class="logContainer"><div class="browserLogItem"\n' +
    '                                                   ng-repeat="logError in $ctrl.data.browserLogs track by $index"><div><span class="label browserLogLabel label-default"\n' +
    '                                                                                                                             ng-class="{\'label-danger\': logError.level===\'SEVERE\', \'label-warning\': logError.level===\'WARNING\'}">{{logError.level}}</span><span class="label label-default">{{$ctrl.convertTimestamp(logError.timestamp)}}</span><div ng-repeat="messageLine in logError.message.split(\'\\\\n\') track by $index">{{ messageLine }}</div></div></div></pre>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="modal-footer">\n' +
    '                <button class="btn btn-default"\n' +
    '                        ng-class="{active: $ctrl.rootScope.showSmartStackTraceHighlight}"\n' +
    '                        ng-click="$ctrl.toggleSmartStackTraceHighlight()">\n' +
    '                    <span class="glyphicon glyphicon-education black"></span> Smart Stack Trace\n' +
    '                </button>\n' +
    '                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
     ''
  );

    });
