# Emergency response API
This repository is 1 of 3 that forms a proof of concept emergency response service.
- [Emergency response API](https://github.com/StevenVanBlerk/emergency-response-api) - An API that allows for creation and management and panic requests.
- [Guuber emergency response](https://github.com/StevenVanBlerk/guuber-emergency-response) - A mock third-party service that is incorporating the API allowing users to create panic requests.
- [Emergency response dashboard](https://github.com/StevenVanBlerk/emergency-response-dashboard) - A dashboard where internal staff manage active panic requests via a feed.

# How to run this project locally
You should be able to simply clone the repository, install dependencies, and go.
Clone this project locally
```bash
git clone https://github.com/StevenVanBlerk/emotion-wheel.git
```

Install all node dependencies
```bash
npm install
# or
yarn install
```

Run the development server:
```bash
npm run dev
# or
yarn dev
# or
```

# What to expect
All 3 projects are rudementary and simply a proof of concept so expect a few rough edges and some missing polish.
## Emergency response API
This is purely an API with a handful of endpoints. This runs on port `3000` by default ([http://localhost:3000/](http://localhost:3000/)).

## Guuber emergency response
This is a simple UI with only one button with significance (It's big and red).
<img width="1680" alt="image" src="https://github.com/user-attachments/assets/c426a2c4-5216-4c41-b0ad-c77e2937d48c" />

## Emergenecy response dashboard
This is predominantly a single table with a collection of actions. Not all actions are implemented and they give an idea of where this project could grow.
<img width="1149" alt="image" src="https://github.com/user-attachments/assets/7b068c61-b06c-4589-9bda-bb9624b6eb13" />
