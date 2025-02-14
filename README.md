# Ev-Connect SDK Sample for Envision

## About

This package is an example of implementation of a "envision connector", for Envision product. 

## Prerequisites

Before starting to build the "envision connector", these tools need to be installed:

- Node JS LTS (https://nodejs.org/en/download)

## QuickStart Instructions

To create your own connector for a specific datasource system, please follow these steps:

1 - clone this project

2 - implement the different functions available in ev-connector-example.ts (this file can be renamed, as well as the class name)

3 - Build the file, by running 
```
npm install && npm build
```

4 - Copy the built file from `dist/ev-connector-example.js` to the installation path of Envision `<Envision installation path>/dist/workspaces/server/`

5 - Sign in to Envision as a Workspace admin. Navigate to the admin section and configure Connector Center. There are now two types of centers that users can create:

  * **PLM Center:** Documents are stored in the data source system, and Envision can cache the document temporarily.
![](./img/plm_connector_config.png)

  * **PDM Center:** Documents are stored in Envision and synchronized between the data source system and Envision.
![](./img/pdm_connector_config.png)

## Documentation

Please read the documentation for more details:
https://github.com/canvasgfx/ev-connector-sample/blob/main/docs/GETTING_STARTED.md

## Note

You'll find this sample on github: https://github.com/canvasgfx/ev-connector-sample

