// Get Enviroment Variables
const PROJECT_ID = process.env.PROJECT_ID;
const PROVIDER_ID = process.env.PROVIDER_ID;

// Express Configuration
const express = require("express");
const router = express.Router();
const app = express();

// Dialogflow Configuration
const dialogflow = require("dialogflow");
const dialogflowSessionClient = new dialogflow.SessionsClient();

// Jivo Configuration
const jivoEndpoint = `https://bot.jivosite.com/webhooks/${PROVIDER_ID}/dialogflow`;

// Axios configuration
const axios = require("axios");

// Timestamp on instance initialization
const startTime = new Date();

router.post("/dialogflow", async (request, response) => {
  // Ignore messages on Cold Start
  const currentTime = new Date();
  var timeDiff = currentTime - startTime;
  if(timeDiff < 1000){
    response.sendStatus(503)
    return response;
  }
  
  // Collect request data
  const body = request.body;
  const cliendId = body.client_id;
  const chatId = body.chat_id;

  // Immediately send a 200 response
  response.writeHead(200);
  
  // Process text messages
  if (body.event == "CLIENT_MESSAGE" && body.message.type == "TEXT") {
    const text = body.message.text;
    await _processText(text, cliendId, chatId);
  }
  
  // End the Response
  response.end();
  return response;
});

const _processText = async (text, clientId, chatId) => {
  const dialogflowTextResponses = await _getDialogflowTextResponses(
    text,
    clientId
  );
  for (const textResponse of dialogflowTextResponses) {
    if (textResponse == "INVITE_AGENT") {
      await _inviteAgent(clientInformation, chatId);
    } else {
      await _sendMessage(textResponse, clientId, chatId);
    }
  }
};

const _getDialogflowTextResponses = async (text, cliendId) => {
  const dialogflowSessionPath = dialogflowSessionClient.sessionPath(
    PROJECT_ID,
    cliendId
  );
  const dialogflowRequest = _makeDialogflowRequest(dialogflowSessionPath, text);
  const intentResult = await dialogflowSessionClient.detectIntent(
    dialogflowRequest
  );
  const fulfillmentMessages = intentResult[0].queryResult.fulfillmentMessages;
  const textMessages = fulfillmentMessages.map((fufillmentMessage) => {
    return fufillmentMessage.text.text[0];
  });
  return textMessages;
};

const _makeDialogflowRequest = (dialogflowSessionPath, text) => {
  return {
    session: dialogflowSessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: "pt-BR",
      },
    },
  };
};

const _sendMessage = async (textResponse, cliendId, chatId) => {
  const jivoBody = {
    event: "BOT_MESSAGE",
    id: "dialogflow",
    client_id: cliendId,
    chat_id: chatId,
    message: {
      type: "TEXT",
      text: textResponse,
      timestamp: Date.now(),
    },
  };
  await axios.post(jivoEndpoint, jivoBody);
};

const _inviteAgent = async (cliendId, chatId) => {
  const jivoBody = {
    event: "INVITE_AGENT",
    id: "dialogflow",
    client_id: cliendId,
    chat_id: chatId,
  };
  await axios.post(jivoEndpoint, jivoBody);
};

// Export
app.use("/", router);
exports.messageReceived = app;
