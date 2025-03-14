# IncoLeakPeek

IncoLeakPeek is a memory usage monitoring tool designed to detecting memory leaks within [Indel](https://www.indel.ch) industrial automation systems.

This project was created during an internal hackathon at [F&S BONDTEC Semiconductor GmbH](https://www.fsbondtec.at/).

## Features

- User-friendly interface for detecting memory leaks
- Easily start and stop leak detection sessions
- Save and load past sessions for review

## Installation

1. **Download**:
    Visit the [releases page](https://github.com/fsbondtec/incoleakpeek/releases) and download the latest release for your OS.

2. **Install**:
    Run the installer and follow the instructions.

## Usage

IncoLeakPeek provides a user-friendly interface to detect memory leaks.

![Usage](doc/assets/usage.gif)

### Key Features

- **Start/Stop Session**: Easily start and stop leak detection sessions.

  ![StartStop](doc/assets/startstop.png)

- **Search**: Quickly search through the memory usage data.

  ![Search](doc/assets/search.png)

- **Interval Selection**: Choose the interval for memory usage updates.

  ![Interval](doc/assets/interval.png)

- **Memory Usage Table**: View detailed memory usage information for each class.

  ![Table](doc/assets/table.png)

- **Memory Usage Chart**: Visualize memory usage over time.

  ![Chart](doc/assets/chart.png)

## Compilation from sources

To compile this project from sources, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/fsbondtec/incoleakpeek.git
    cd incoleakpeek
    ```

2. **Install dependencies**:
    Ensure you have [Node.js](https://nodejs.org/) and npm installed. Then, run:
    ```sh
    npm install
    ```

3. **Build the project**:
    ```sh
    npm run make
    ```

4. **Run the application**:
    ```sh
    npm start
    ```

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/fsbondtec/incoleakpeek/blob/main/LICENSE) file for details.

### Third-Party Licenses

This project uses `incov.browser.min.js` from [Indel AG](https://www.indel.ch). The usage of this library is subject to Indel AG's licensing terms. For more information, please refer to Indel AG's official documentation and licensing agreements.

Additionally, this project uses Electron and Node.js, which are licensed under the MIT License. For more information, please refer to their respective [Electron License](https://github.com/electron/electron/blob/main/LICENSE) and [Node.js License](https://github.com/nodejs/node/blob/main/LICENSE).

Other third-party libraries used in this project include:

- **Vue.js**: A progressive JavaScript framework. Licensed under the [MIT License](https://github.com/vuejs/vue/blob/main/LICENSE).
- **Vuetify**: A Material Design component framework for Vue.js. Licensed under the [MIT License](https://github.com/vuetifyjs/vuetify/blob/master/LICENSE).
- **@mdi/font**: Material Design Icons. Licensed under the [MIT License](https://github.com/Templarian/MaterialDesign-Webfont/blob/master/LICENSE).
- **echarts**: A powerful, interactive charting and visualization library. Licensed under the [Apache License 2.0](https://github.com/apache/echarts/blob/master/LICENSE).
- **vue-echarts**: ECharts component for Vue.js. Licensed under the [MIT License](https://github.com/ecomfe/vue-echarts/blob/main/LICENSE).
- **humanize-plus**: A collection of simple utility functions for JavaScript. Licensed under the [MIT License](https://github.com/HubSpot/humanize/blob/master/LICENSE).

Please refer to the respective licenses for more information.

