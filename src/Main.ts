const getDex3Price = ():number => {
  const url = "https://serum-api.bonfida.com/orderbooks/STEPUSDC";
  const response = UrlFetchApp.fetch(url).getContentText();
  const jsonData = JSON.parse(response);
  const bestBid = jsonData['data']['bids'][0]['price'];
  const bestAsk =  jsonData['data']['asks'][0]['price'];
  return calcMidPrice(bestBid, bestAsk);
}

const getFtxPrice = ():number => {
  const url = "https://ftx.com/api/markets/STEP/USD";
  const response = UrlFetchApp.fetch(url).getContentText();
  const jsonData = JSON.parse(response);
  const bestBid = jsonData['result']['bid'];
  const bestAsk =  jsonData['result']['ask'];
  return calcMidPrice(bestBid, bestAsk);
}

const calcMidPrice = (bid: number, ask: number):number => {
  const midPrice = (bid + ask) / 2;
  return Math.round(midPrice * 1000) / 1000;
}

const main = () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const dex3Price = getDex3Price();
  const ftxPrice = getFtxPrice();
  const deviation = Math.abs(dex3Price - ftxPrice);
  const deviationPercentage = (deviation / ((dex3Price + ftxPrice) / 2)) * 100;
  const roundedDeviationPercentage = Math.round(deviationPercentage * 100) / 100;
  const timeString = Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), "YYYY/MM/d HH:mm");
  sheet.appendRow([dex3Price, ftxPrice, deviation, `${roundedDeviationPercentage}%`, timeString]);
}