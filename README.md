# ChatLeevi

ChatLeevi is a chatbot app created using React Native and powered by OpenAI's GPT-3 and Whisper APIs. The app allows users to ask questions and chat with Leevi, a cute Finnish dog character who responds with helpful answers and sometimes a bit of humor.

## Features

- Voice recording: users can ask questions by recording their voice and sending the recording to Leevi, who will respond with an audio message.
- Text input: users can also type their questions for Leevi to answer.
- Predefined prompts: users can choose from a list of predefined prompts to help guide their conversation with Leevi.
- OpenAI integration: the app uses the GPT-3 and Whisper APIs from OpenAI to provide intelligent responses to user questions and to transcribe voice recordings.

## Getting started

To get started with ChatLeevi, follow these steps:

1. Clone the GitHub repository
2. Install dependencies with `npm install`
3. Install the Expo CLI with `npm install -g expo-cli`
4. Start the app with `expo start`

Note: Voice recording and transcription features may not work properly on Android simulators. It is recommended to test these features on a physical device or iOS simulator.

## Structure of the app

The app has the following main components:

- `Home`: the main screen of the app, where users can ask questions and see Leevi's responses.
- `Settings`: a screen where users can save their OpenAI API key for future use.

The app also has various helper functions for working with audio recordings, sending requests to OpenAI APIs, and handling user interactions with the app.
