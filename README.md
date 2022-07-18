## Why

- We need a demo frontend to show our work in [Algorand-NEAR-bridge](https://github.com/AbstrLabs/Algorand-NEAR-bridge) (Private)
- Possibly this can be a stand-alone version of the bridge.

## How to use

- This repo is hosted on [Half Moon Cross](https://halfmooncross.com/)
- Host on localhost with `yarn install && yarn start` (for dev)

## Contributing

- Feel free to [open issues](https://github.com/AbstrLabs/algorand-near-bridge-UI/issues/new/choose) or [make pull requests](https://github.com/AbstrLabs/algorand-near-bridge-UI/compare).
- To reach us personally, contact [lion@abstrlabs.com](mailto:lion@abstrlabs.com)

## Part below is hosted in Docs page

But we edit it here.

## Introduction to Algorand-NEAR-bridge Milestone 1

Based our estimation of the project time, we rescheduled the first milestone of Algorand-NEAR unidirectional bridge to be released with a centralized backend.

In this milestone, we will:

- Finish the economical model of the bridge
- Structural design and implementation of the bridge.
- Assess the target audience, goal, use cases of the expandable backend API.

We will deliver:

- A simple frontend (this repo) hosted with Amazon EC2 as the user interface.
- A backend (private for security reason) deployed on Amazon EC2 to handle the API calls.
- A demo video of the bridge in action.

## How to use our frontend

- Visit [Half Moon Cross](https://halfmooncross.com/)
- Select mint/burn function. (Mint = stake NEAR and get goNEAR; Burn = send goNEAR and get back the NEAR)
- Connect to the according wallet (NEAR wallet for Mint; My Algo wallet for Burn)
- Fill up the form (the frontend has a simple validate function)
- Authorize the transaction on the frontend.

## How to use our backend

- [Our API server](https://api.halfmooncross.com/) accepts the following API calls:
- Use POST method to create a bridge transaction (like stake NEAR to get goNEAR) and get a unique ID `uid`.
- Use GET method with `uid` to get the latest transaction status.
- See the example in

## Further Missions

- A test toolkit to test the bridge.
