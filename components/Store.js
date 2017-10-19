const GoogleSpreadsheet = require('google-spreadsheet');
const config = require('../config');
let doc = new GoogleSpreadsheet(config.spreadsheetKey);
let sheet;

const Store = {
  setAuth: function(step) {
    let creds = require('../config/vtbk-bot.json');
    doc.useServiceAccountAuth(creds, step);
  },
  getInfoAndWorksheets: function(step) {
    doc.getInfo(function(err, info) {
		if(err){
            console.log("error while getInfoAndWorksheets: "+err);    
        }	
      sheet = info.worksheets[0];
      step();
    });
  },
	updateSheets: function(announcements, step) {
        sheet.getCells({
          'min-row': 1,
          'max-row': 50,
            'max-col':3,
          'return-empty': true
        }, function(err, cells) {
            if(err){
                console.log("error while updating sheet: " + err);
            }
                
            var cell = 0;
            cells[cell++].value = "id";
            cells[cell++].value = "message";
            cells[cell++].value = "date";
            
            for(var id in announcements){
                var chatGrpReminders = announcements[id];
                for (var i = 0; i < chatGrpReminders.length; i++) {
                    console.log("adding for id "+ id);
                    console.log(chatGrpReminders);
                    cells[cell++].value = id;
                    cells[cell++].value = chatGrpReminders[i].message;
                    cells[cell++].value = chatGrpReminders[i].date;
                }
            }
            sheet.bulkUpdateCells(cells);
            step();
		});
	},
    updateSheets2: function(announcements, step) {
        for(var id in announcements){
            var chatGrpReminders = announcements[id];
            for (var i = 0; i < chatGrpReminders.length; i++) {
                var newRow = {
                    "id": id,
                    "message": chatGrpReminders[i].message,
                    "date": ""+chatGrpReminders[i].date
                };
                sheet.addRow({
                    'worksheet_id': 1,
                    'new_row': newRow
                }, function(err) {
                    console.log(err);

		      });
            }
        }
        step();
	},
    readSheets:function(announcements,step){
        sheet.getRows({
            offset: 1,
              limit: 30,
              orderby: 'id'
            }, function( err, rows ) {
              // the row is an object with keys set by the column headers
              for(var i = 0 ; i < rows.length; i++){
                  var chatId = rows[i]["id"];
                    if (announcements[chatId] == undefined) {
                        announcements[chatId] = [];
                    }
                    announcements[chatId].push({
                        "message":rows[i]["message"],
                        "date":rows[i]["date"]
                    });
              }
        });
    }
}

module.exports = Store;