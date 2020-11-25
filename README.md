# ReactNativeAgoraApp

> #### **_Note: Please do not use `npm` to manage dependencies. Use :heart:`yarn`:heart: instead. We use `yarn` because of better performance for all developers._**

## Initial Setup for Mac users

```bash
brew install node

brew install yarn

brew install watchman

sudo gem install cocoapods

git clone https://github.com/glue-labs/fifo-app.git # Clone the project

```

## React Native Installation steps

```bash
cd fifo-app # go to app directory

yarn # Install dependencies

cd ios && pod install && cd .. # Goto ios directory, install pods and go back to main project directory

yarn start # To run the metro bundler

yarn ios # Start app in ios

yarn android # Start app in android

```

You can also refer the official [React Native docs](https://reactnative.dev/docs/environment-setup) for installation and setup.

