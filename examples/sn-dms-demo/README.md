# sn-dms-demo

A sensenet Document Management demo with React.

## Install and start


1. Install yarn globally with: **npm i yarn -g**
2. Clone the monorepo with: **git clone https://github.com/SenseNet/sn-client.git**
3. Navigate into the monorepo's root folder: **cd sn-client**
4. Install all of the dependencies with a simple **yarn** command (this will take a second or two)
5. Set the environment options, Repository path in index.tsx, etc... *(Since this app is for demo purposes it requires several demo content items (e.g. demo users, demo content types, demo templates, demo actions) that are NOT the part of the official sensenet packages. So please, please if you want to try out the examples of the sn-client package, do it with connecting to our fully prepared demo sensenet instance at [https://dmsservice.demo.sensenet.com](https://dmsservice.demo.sensenet.com).*
6. Build all of the packages with the command **yarn build**
7. Run the application with **yarn workspace sn-dms-demo run start**
8. You should be able to login at https://localhost:3000
