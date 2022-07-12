// File not used

// import React, { useState, useCallback } from "react";

// export const NearContext = React.createContext({
//   user: null,
//   nearContract: null,
//   signIn: () => {},
//   signOut: () => {},
//   isLoading: false
// });

// const NearContextProvider = ({
//   currentUser,
//   nearConfig,
//   wallet,
//   near,
//   children,
// }) => {
//   const user = useState(currentUser)[0];
//   const nearContent = useState(near)[0];
//   const [isLoading, setLoading] = useState(false);

//   const signIn = useCallback(() => {
//     wallet.requestSignIn(nearConfig.contractName, "NEAR Corgi");
//   }, [wallet, nearConfig]);

//   const signOut = useCallback(() => {
//     wallet.signOut();
//     setTimeout(setLoading(true), 2000);
//     window.location = "/";
//     setLoading(false);
//   }, [wallet]);

//   return (
//     <NearContext.Provider
//       value={{
//         user,
//         signIn,
//         signOut,
//         isLoading,
//         nearContent,
//       }}
//     >
//       {children}
//     </NearContext.Provider>
//   );
// };

// export default NearContextProvider;
