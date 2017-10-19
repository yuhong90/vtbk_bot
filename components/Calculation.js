const Calculation = {
    daysBetween: function(dateOne, dateTwo) {
        // Get 1 day in milliseconds
        let oneDayMs = 1000*60*60*24;

        // Convert both dates to milliseconds
        
        let dateOneMs = new Date(dateOne).getTime();
        let dateTwoMs = dateTwo.getTime();

        // Calculate the difference in milliseconds
        let difference_ms = dateOneMs - dateTwoMs;

        // Convert back to days and return
        return Math.round(difference_ms/oneDayMs);
    }
}
module.exports = Calculation;