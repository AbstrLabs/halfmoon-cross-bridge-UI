const myAlgoWallet = new MyAlgoConnect();

const connectToMyAlgo = async() => {
  try {
    const accounts = await myAlgoWallet.connect();

    const addresses = accounts.map(account => account.address);
    
  } catch (err) {
    console.error(err);
  }
}