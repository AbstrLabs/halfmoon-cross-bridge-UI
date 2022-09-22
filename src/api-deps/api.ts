import { postTxn } from "../api-deps/call-server";
import { ApiCallParam } from "../api-deps/config";


//pass param
const parseResultUrlFromParam = (id: string) => {
    const url = new URL("/result", window.location.origin);
    url.searchParams.set("id", id);
    return url.toString();
}

export const parseProcessUrlFromParam = (transactionHash: string) => {
    const url = new URL("/process", window.location.origin);
    url.searchParams.set("transactionHashes", transactionHash);
    return url.toString();
}

export const confirmTxn = async (newParam: ApiCallParam) => {
    console.log(newParam)
    const res = await postTxn(newParam)
    if (res.status === 400) {
        window.alert("Invalid transaction");
        console.log(res)
        return;
    }
    if (res.status === 201) {
        const resJson = await res.json();
        const replacingUrl = parseResultUrlFromParam(resJson.id);
        window.location.replace(replacingUrl);
        return;
    }
}