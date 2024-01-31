<!-- https://mc-yfyyj2sjhsjhkwc1s8w4zrxx4.pub.sfmc-content.com/4riylizrw0l?f=sab-create-de-fields.html&t=a1c7-2604-3d08-597c-9190-dcbc-a6f1-78e8-1cfc.ngrok-free.app -->

<script runat="server">
    Platform.Load("core","1.1.5");  
try { 
    
    function checkFolder(folderName) {
        var filter1 = {
            Property: "Name", 
            SimpleOperator: "equals",
            Value: folderName
        }
        var filter2 = {
            Property: "ContentType", 
            SimpleOperator: "equals", 
            Value: "dataextension"
        }
        var folderFilter = {
            LeftOperand: filter1,
            LogicalOperator: "AND",
            RightOperand: filter2
        }
        var folder = Folder.Retrieve(folderFilter);
        // Write('<br><br> Check Folder function ' + Stringify(folder))
        return (folder.length > 0 ? true : false);
    }

    function isChildFolderExists(childFolderName, parentFolderName) {
        var filter1 = {
            Property: "Name", 
            SimpleOperator: "equals",
            Value: childFolderName
        }
        var filter2 = {
            Property: "ContentType", 
            SimpleOperator: "equals", 
            Value: "dataextension"
        }
        var filter3 = {
            Property: "ParentFolder.Name", 
            SimpleOperator: "equals", 
            Value: parentFolderName
        }
        var folderFilter = {
            LeftOperand: filter1,
            LogicalOperator:"AND",
            RightOperand: {
                LeftOperand: filter2,
                LogicalOperator: "AND",
                RightOperand: filter3
            }
        };

        var folder = Folder.Retrieve(folderFilter);
        // Write('<br><br> Check Folder function ' + Stringify(folder))
        return (folder.length > 0 ? true : false);
    }

    function getFolderId(folderName) {
        var filter1 = {
            Property: "Name", 
            SimpleOperator: "equals",
            Value: folderName
        }
        var filter2 = {
            Property: "ContentType", 
            SimpleOperator: "equals", 
            Value: "dataextension"
        }
        var folderFilter = {
            LeftOperand: filter1,
            LogicalOperator: "AND",
            RightOperand: filter2
        }
        var folder = Folder.Retrieve(folderFilter);
        // Write(Stringify(folder))
        return (folder.length > 0 ? folder[0].ID : false);
    }

    function createFolder(ParentFolderID, folderName) {
        // TODO: Add additional sections like isSendable, isTestable
        var folderObject = {
            "Name" : folderName,
            "CustomerKey" : Platform.Function.GUID(),
            "Description" : "Auto-generated by SQL 30 challenger script",
            "ContentType" : "dataextension",
            "IsActive" : "true",
            "IsEditable" : "true",
            "AllowChildren" : "true",
            "ParentFolderID" : ParentFolderID
        }
        // Write('<br><br> folderObject ' + Stringify(folderObject))
        var folderCreationStatus = Folder.Add(folderObject);

        return folderCreationStatus; 
    }

    function isDEExists(deName, folderId) { 
        var filter1 = {Property: "Name", SimpleOperator: "equals", Value: deName};
        var filter2 = {Property: "CategoryID", SimpleOperator: "equals", Value: folderId};
        var deFilter =  { LeftOperand: filter1, LogicalOperator:"AND", RightOperand: filter2}
        // Write('<br><br> deFilter : ' + Stringify(deFilter))
        var deExistsStatus = DataExtension.Retrieve(deFilter);
        
        return (deExistsStatus.length > 0 ? true : false);
    }

    function createDE(deFields) { 
        Write('<br><br> Create DE deFields ' + Stringify(deFields));
        var deCreationStatus = DataExtension.Add(deFields);
        Write('<br><br> Create DE Status ' + Stringify(deCreationStatus));
    }

    function insertCsvToDE(url, deName) { 
        var headerNames = [];
        var headerValues = [];
        var response = HTTP.Get(url, headerNames, headerValues);
        // TODO: if response.Status == 0 , then get content
        if(response.Status == 0) { 
            var content = response.Content;
            var rows = content.split('\n');
            for(var i = 1; i< rows.length ; i++) { //exclude first tow
                var cols = rows[0].split(','); // first row is header 
                var data = rows[i].split(','); // data row 
                // Write('<br><br> Row ' + Stringify(cols) + ' Data ' + Stringify(data));
                if(data.length > 1) { 
                    var addedRowCount = Platform.Function.InsertData(
                        deName,
                        cols,
                        data
                    );
                    Write('<br><br> addedRowCount : ' + Stringify(addedRowCount))
                }
            }
            return true; 
        } else { 
            return false; 
        }// if ends 
    } // fn ends

    // Main Function starts 

    // Variables 
    var parentFolderName = 'SQL_30_Challenge';
    var childFolderNames = ['Day_1', 'Day_2'];
    var deStructure = 
        [
            {
                "meta" : {
                    "deName": "sql30_01_users",
                    "dataUrl" : "https://raw.githubusercontent.com/sabuhiy/mc30/main/sql30/sql30_01_users.csv",
                    "folderName": "Day_1"
                },
                "CustomerKey": Platform.Function.GUID(),
                "Name": "sql30_01_users",
                "Fields": [
                    {
                    "Name": "Id",
                    "FieldType": "Text",
                    "IsPrimaryKey": true,
                    "IsRequired": true,
                    "MaxLength" : 18
                    },
                    {
                    "Name": "first_name",
                    "FieldType": "Text",
                    "MaxLength": 50,
                    "IsRequired": true
                    },
                    {
                    "Name": "last_name",
                    "FieldType": "Text",
                    "MaxLength": 50,
                    "IsRequired": true
                    },
                    {
                    "Name": "email",
                    "FieldType": "EmailAddress",
                    "IsRequired": true
                    }
                ]
            },
            {
                "meta" : {
                    "deName": "sql30_02_users_packages",
                    "dataUrl" : "https://raw.githubusercontent.com/sabuhiy/mc30/main/sql30/sql30_02_users_packages.csv",
                    "folderName" : "Day_2"
                },
                "CustomerKey": Platform.Function.GUID(),
                "Name": "sql30_02_users_packages",
                "Fields": [
                    {
                    "Name": "Id",
                    "FieldType": "Text",
                    "IsPrimaryKey": true,
                    "IsRequired": true,
                    "MaxLength" : 18
                    },
                    {
                    "Name": "first_name",
                    "FieldType": "Text",
                    "MaxLength": 50,
                    "IsRequired": true
                    },
                    {
                    "Name": "last_name",
                    "FieldType": "Text",
                    "MaxLength": 50,
                    "IsRequired": true
                    },
                    {
                    "Name": "email",
                    "FieldType": "EmailAddress",
                    "IsRequired": true
                    },
                    {
                    "Name": "internet_package",
                    "FieldType": "Text",
                    "MaxLength": 255,
                    "IsRequired": false
                    }
                ]
            }
        ];
    
    var isFolderExists = checkFolder(parentFolderName);
    Write('<br><br> isFolderExists ' + Stringify(isFolderExists))

    // check if folder does not  exists 
    if(!isFolderExists) { 
        var DE = Folder.Retrieve({Property:"ContentType",SimpleOperator:"equals",Value:"dataextension"});
        var ParentFolderID = DE[0].ID;

        var folderCreationStatus = createFolder(ParentFolderID, parentFolderName);
        var folderId = getFolderId(parentFolderName);
        Write('<br><br> folderId : ' + Stringify(folderId))
        for(var child in childFolderNames) {
            Write('<br><br> Creating folder for ' +  childFolderNames[child])
            var childFolderCreationStatus = createFolder(folderId, childFolderNames[child]);
            Write('<br><br> childFolderCreationStatus ' + Stringify(childFolderCreationStatus));
        }

        Write('<br><br> folderCreationStatus : ' + Stringify(folderCreationStatus));
        
    } else {
        // if folder exists, check for subfolders & DEs 
        var parentFolderId = getFolderId(parentFolderName);
        Write('<br><br> parentFolderId : ' + Stringify(parentFolderId))
        
        for(var child in childFolderNames) {
            var isSubFolderExists = isChildFolderExists(childFolderNames[child], parentFolderName);
            Write('<br><br> Is Child folder ' + childFolderNames[child] + ' exists? ' + Stringify(isSubFolderExists))
            if(!isSubFolderExists) { // create if subfolder dons't exist
                // Add parent folder ID 
                Write('<br><br> parentFolderId, childFolderNames[child] ' + childFolderNames[child] + ' -- ' + parentFolderId )
                var childFolderCreationStatus = createFolder(parentFolderId, childFolderNames[child])
                Write('<br><br> childFolderCreationStatus ' + Stringify(childFolderCreationStatus));
            }
        }
    } 
    // If ends 

    // Pre-requisites: At this point, all folders are created and available.

    // Create data extension
    // Check if DE is present and add 
    for(var d in deStructure) { 
        var url = deStructure[d]['meta']['dataUrl'];
        var deName = deStructure[d]['meta']['deName'];
        var folderName = deStructure[d]['meta']['folderName'];
        var deFields = deStructure[d];
        Write('<br><br> url ' + Stringify(url))
        Write('<br><br> deName ' + Stringify(deName))
        Write('<br><br> folderName ' + Stringify(folderName))

        var childFolderId = getFolderId(folderName);
        Write('<br><br> getFolderId for child folder ' + folderName + ' --> ' + Stringify(childFolderId) )
        var isDEPresent = isDEExists(deName, childFolderId)
        Write('<br><br> Is DE ' + deName + ' Exists : ' + Stringify(isDEPresent))
        if(!isDEPresent){
            Write('<br>url ' + Stringify(url));
            delete(deFields['meta']);
            deFields['CategoryID'] = childFolderId;
            Write('<br><br> DE Fields without meta? ' + Stringify(deFields))
            
            var deCreationStatus = createDE(deFields);
            Write('<br><br> deCreationStatus for DE ' + deName +  ' : ' + Stringify(deCreationStatus))
            var deInsertStatus = insertCsvToDE(url, deName);
            Write('<br><br> deInsertStatus from url ' + url +  ' : ' + Stringify(deInsertStatus))
        }
    }
    

    // var url = 'https://raw.githubusercontent.com/sabuhiy/mc30/main/sql30/sql30_01_users.csv';
    // insertCsvToDE(url, deStructure['sql30_01_users']['Name']);
    
}catch(e) { Write('<br><br><br><br><br><br><b> ERROR : ' + Stringify(e)); }
</script>