function fetchCryptoData() {
  var url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";
  var response;
  var attempts = 0;
  
  while (attempts < 5) {
    try {
      response = UrlFetchApp.fetch(url);
      var json = JSON.parse(response.getContentText());
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.clear();
      sheet.appendRow(['Cryptocurrency Name', 'Symbol', 'Current Price (USD)', 'Market Capitalization', '24-hour Trading Volume', 'Price Change (24-hour, %)']);
      
      json.forEach(function(coin) {
        sheet.appendRow([coin.name, coin.symbol, coin.current_price, coin.market_cap, coin.total_volume, coin.price_change_percentage_24h]);
      });
      break;
    } catch (e) {
      attempts++;
      Utilities.sleep((Math.pow(2, attempts) + Math.random()) * 1000); // Exponential backoff
    }
  }
}

function createTrigger() {
  ScriptApp.newTrigger('fetchCryptoData')
    .timeBased()
    .everyMinutes(5)
    .create();
}