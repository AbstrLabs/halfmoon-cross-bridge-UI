import { Box } from "@mui/system";

export function DocsPage() {
  return (
    <Box textAlign="center">
      <Box height="20px" />
      <div
        style={{
          display: "flex",
          flex: "0 1 100%",
          justifyContent: "space-evenly",
        }}
      >
        <div /* comment="mint-instruction" */ style={{ width: "70%" }}>
          <h2>mint</h2>
          <ul style={{ textAlign: "start", border: "1px solid teal" }}>
            <li>converts NEAR to goNEAR</li>
            <li>
              API Endpoint: <code>/api/mint</code>
            </li>
            <li>
              API Method: <code>POST</code>
            </li>
            <li>
              API Call Body:
              <ul>
                <li>
                  <code>mint_from</code>: NEAR will be paid from this account
                </li>
                <li>
                  <code>mint_to</code>: goNEAR will be received on this account
                </li>
                <li>
                  <code>mint_amount</code>: amount of NEAR paid, including fee
                </li>
                <li>
                  <code>mint_txnId</code>: Transaction ID on NEAR (tx_hash)
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div /* comment="burn-instruction" */ style={{ width: "70%" }}>
          <h2>burn</h2>
          <ul style={{ textAlign: "start", border: "1px solid teal" }}>
            <li>converts NEAR to goNEAR</li>
            <li>
              API Endpoint: <code>/api/burn</code>
            </li>
            <li>
              API Method: <code>POST</code>
            </li>
            <li>
              API Call Body:
              <ul>
                <li>
                  <code>burn_from</code>: goNEAR will be paid from this account
                </li>
                <li>
                  <code>burn_to</code>: NEAR will be received on this account
                </li>
                <li>
                  <code>burn_amount</code>: amount of goNEAR paid, including fee
                </li>
                <li>
                  <code>burn_txnId</code>: Transaction ID on Algorand (txnId)
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <Box height="20px" />
    </Box>
  );
}
