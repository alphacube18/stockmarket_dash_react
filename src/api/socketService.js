const socket = new WebSocket("wss://ws.finnhub.io?token=YOUR_API_KEY");

const pendingSubscriptions = [];

socket.onopen = () => {
  console.log("WebSocket Connected ✅");
  while (pendingSubscriptions.length) {
    const message = pendingSubscriptions.shift();
    socket.send(message);
  }
};

socket.onerror = (error) => {
  console.error("WebSocket Error ❌:", error);
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "trade") {
    data.data.forEach((trade) => {
      if (callbacks[trade.s]) {
        callbacks[trade.s]({ p: trade.p });
      }
    });
  }
};

const callbacks = {};

export const subscribeToStock = (symbol, callback) => {
  callbacks[symbol] = callback;
  const message = JSON.stringify({ type: "subscribe", symbol });

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    pendingSubscriptions.push(message);
  }
};
