# JivoChat Dialogflow Integration  
A simple way to connect and integrate Dialogflow and JivoChat to create great experiences.

## How to Connect

### Before starting you will need:
 - A Dialogflow project (You can create one [here](https://dialogflow.cloud.google.com/))
 - A JivoChat project  (You can create one [here](https://www.jivochat.com.br/?partner_id=34947)) with a connected channel.
 - A JivoChat PRO account

### Step-by-step:

1. Open the Google Console for Cloud Functions ([here](https://console.cloud.google.com/functions)) and make sure you have the Google Project of your Dialogflow chatbot selected.

2. Click on "Create Function" to open the interface for function creation.

3. Set the name of the function (**jivochat-connector** is a good option)

4. On Trigger > Authentication select "**Allow Unauthenticated Invocations**" and click save.
5. Copy the given **Trigger URL** somewhere, we will need it later.

6. Open the "Runtime, Build and Connection Settings" dropdown.

7.  In Runtime > Runtime Environment Variables add the PROJECT_ID variable with the name of your **Dialogflow Project ID** (this is found on your Dialogflow’s agent settings page)
8. Click on **Next**
9. In the **index.js** tab, copy and paste the code from the index.js file in this repository.
10. In the **Entry Point** field type **messageReceived**
11. In the **package.json** tab, copy and paste the code from the package.json file in this repository.
12. Click **Deploy**
13. Send an email to info@jivosite.com with the following:
		
		Subject: Bot Integration
		Content:
		"I would like the configuration of my Bot API
		Endpoint:[YOUR TRIGGER URL]
		Token: dialogflow  
		Email: [YOUR JIVO ACCOUNT EMAIL]
		Channels:  [The channels you want to use (telegram, whatsapp, websites)]
14. You will later receive (normally after 24h) a response containing your **PROVIDER ID**. Copy it somewhere.
15. In the Google Cloud Functions dashboard, select your previously created function.
16. Select **Edit**
17. In the "Runtime, Build and Connection Settings" dropdown, add a new Runtime environment variable called **PROVIDER_ID** and set it to the value given in the email.
18. Click **Next** then **Deploy**
19. After the Deploy is complete, you now should be able to chat with your Dialogflow created chatbot through your JivoChat connected channel.


## How to Invite an Agent

With the integration complete, you are also able to invite an agent to a client's conversation. To do so, just add a normal Text Response on Dialogflow with the text **INVITE_AGENT**:

![INVITE_AGENT Text Response](https://i.imgur.com/1jW9x9h.png)

Now, whenever this text response is sent to the user, an agent on the JivoChat Dashboard will be notified to talk to the client.

When the agent starts the conversation, the chatbot will stop being called until the conversation is closed.
